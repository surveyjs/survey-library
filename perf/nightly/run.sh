#!/usr/bin/env bash
# The host side of the nightly performance run (perf/README.md): options, lock, git update, image, gate, container,
# load sampler, posting to Discord, crash posts. The container side is nightly.ts.
#   run.sh [--nightly] [--ref <ref>] [--label <text>] [--suites core,react,survey-js-ui] [--only <ids>] [--record]
#          [--bisect <good>..<bad>] [--no-gate] [--dry-post] [--no-bisect] [--reinstall]
# Never add `set -x`: the webhook must not reach a log. It goes to curl through a config read from a process
# substitution, so it is never in argv or ps either. The env file and this script live outside the state directory:
# the container mounts the state directory and runs the target's npm scripts, so nothing it can read or write there
# may hold a secret or code the host runs.
set -u -o pipefail

STATE="${PERF_STATE_DIR:-/srv/surveyjs-perf}"
REPO="$STATE/repo"
TOOL="$STATE/work/tool"
ENV_FILE="${PERF_ENV_FILE:-/etc/surveyjs-perf/perf.env}"

NIGHTLY=0 REF="origin/master" LABEL="" SUITES="core,react,survey-js-ui" ONLY="" RECORD=0 BISECT="" NO_GATE=0 DRY=0 NO_BISECT=0 REINSTALL=0
die() { echo "run.sh: $*" >&2; exit 2; }
need() { [ $# -ge 2 ] && [ -n "$2" ] || die "$1 needs a value"; }
while [ $# -gt 0 ]; do
  case "$1" in
    --nightly) NIGHTLY=1 ;;
    --ref) need "$@"; REF="$2"; shift ;;
    --label) need "$@"; LABEL="$2"; shift ;;
    --suites) need "$@"; SUITES="$2"; shift ;;
    --only) need "$@"; ONLY="$2"; shift ;;
    --record) RECORD=1 ;;
    --bisect) need "$@"; BISECT="$2"; shift ;;
    --no-gate) NO_GATE=1 ;;
    --dry-post) DRY=1 ;;
    --no-bisect) NO_BISECT=1 ;;
    --reinstall) REINSTALL=1 ;;
    -h|--help) sed -n '2,5p' "$0"; exit 0 ;;
    *) die "unknown option $1" ;;
  esac
  shift
done
[ -n "$BISECT" ] && [ -z "$ONLY" ] && die "--bisect needs --only <id>"
[ -n "$BISECT" ] && [ "$RECORD" = 1 ] && die "--bisect and --record do not go together"
case "$BISECT" in ''|?*..?*) ;; *) die "--bisect takes <good>..<bad>" ;; esac
KIND="on-demand"
[ "$NIGHTLY" = 1 ] && KIND="nightly"
[ "$RECORD" = 1 ] && KIND="record"

# The env file: plain KEY=value lines, no quotes, parsed line by line (never sourced); never under the state directory.
PERF_DISCORD_WEBHOOK="" PERF_DISCORD_ROLE_ID="" PERF_CPUS="" PERF_MEMORY="8g" PERF_MAX_BUSY_CORES="1.0" PERF_MAX_OTHER_CORES="1.0"
PERF_GATE_MAX_MIN="60" PERF_KEEP_DAYS="90"
state_real=$(cd "$STATE" 2>/dev/null && pwd -P || echo "$STATE")
env_dir_real=$(cd "$(dirname "$ENV_FILE")" 2>/dev/null && pwd -P || dirname "$ENV_FILE")
case "$env_dir_real/" in "$state_real"/*) die "$ENV_FILE is inside the state directory, which the container mounts: move it out (PERF_ENV_FILE)" ;; esac
if [ -f "$ENV_FILE" ]; then
  mode=$(stat -c %a "$ENV_FILE" 2>/dev/null || echo 600)
  [ "$mode" = 600 ] || echo "run.sh: $ENV_FILE should be chmod 600 (is $mode)" >&2
  while IFS= read -r line || [ -n "$line" ]; do
    line="${line%$'\r'}"
    case "$line" in ''|'#'*) continue ;; esac
    key="${line%%=*}"
    val="${line#*=}"
    case "$key" in
      PERF_DISCORD_WEBHOOK|PERF_DISCORD_ROLE_ID|PERF_CPUS|PERF_MEMORY|PERF_MAX_BUSY_CORES|PERF_MAX_OTHER_CORES|PERF_GATE_MAX_MIN|PERF_KEEP_DAYS)
        printf -v "$key" '%s' "$val" ;;
      *) echo "run.sh: $ENV_FILE: unknown key $key" >&2 ;;
    esac
  done < "$ENV_FILE"
fi
[ "$DRY" = 1 ] || [ -n "$PERF_DISCORD_WEBHOOK" ] || die "PERF_DISCORD_WEBHOOK is not set in $ENV_FILE (or use --dry-post)"

mkdir -p "$STATE/tmp" "$STATE/history" "$STATE/home" "$STATE/npm-cache"
HIST=""
RUN_ID="$(date -u +%Y%m%dT%H%M%S)-$KIND"
CPID=""
SPID=""
GPID=""
# A post may take 5 minutes; the one after a stop signal must fit systemd's TimeoutStopSec=90 with the docker stop.
POST_MAX_TIME=300

# --- posting -------------------------------------------------------------------------------------------------------

# post_dir <message dir> <n>: payload.json plus the files of files.txt; 429: wait Retry-After, retry up to 3 times.
# The HTTP status of a failure goes to $HIST/post-failed-<n>.
post_dir() {
  local dir="$1" n="$2" url hdr body code rc i ra
  local -a files=()
  i=0
  if [ -f "$dir/files.txt" ]; then
    while IFS= read -r f; do
      [ -n "$f" ] || continue
      files+=(-F "files[$i]=@$f")
      i=$((i + 1))
    done < "$dir/files.txt"
  fi
  if [ "$DRY" = 1 ]; then
    echo "--- dry post $n ($dir)"
    echo "curl --fail-with-body -sS --connect-timeout 30 --max-time 300 -D <hdr> -K <(printf 'url = \"%s\"\\n' '<webhook>?wait=true') -F 'payload_json=<payload.json;type=application/json' ${files[*]}"
    cat "$dir/payload.json"; echo
    [ -n "$HIST" ] && echo "$RUN_ID" > "$HIST/posted-$n"
    return 0
  fi
  url="$PERF_DISCORD_WEBHOOK"
  case "$url" in *\?*) url="$url&wait=true" ;; *) url="$url?wait=true" ;; esac
  hdr=$(mktemp "$STATE/tmp/hdr.XXXXXX")
  body=$(mktemp "$STATE/tmp/body.XXXXXX")
  for attempt in 1 2 3 4; do
    code=$(cd "$dir" && curl --fail-with-body -sS --connect-timeout 30 --max-time "$POST_MAX_TIME" -o "$body" -w '%{http_code}' -D "$hdr" \
      -K <(printf 'url = "%s"\n' "$url") -F 'payload_json=<payload.json;type=application/json' "${files[@]}")
    rc=$?
    if [ "$rc" = 0 ]; then
      [ -n "$HIST" ] && echo "$RUN_ID" > "$HIST/posted-$n"
      rm -f "$hdr" "$body"
      return 0
    fi
    if [ "$code" = 429 ] && [ "$attempt" -lt 4 ]; then
      ra=$(grep -i '^retry-after:' "$hdr" | tail -1 | tr -d '\r' | awk '{print $2}')
      ra="${ra%%.*}"
      case "$ra" in ''|*[!0-9]*) ra=5 ;; esac
      sleep $((ra + 1))
      continue
    fi
    break
  done
  echo "run.sh: posting $dir failed (HTTP $code); the payload is kept" >&2
  head -c 500 "$body" >&2; echo >&2
  [ -n "$HIST" ] && echo "${code:-000}" > "$HIST/post-failed-$n"
  rm -f "$hdr" "$body"
  return 1
}

# post_text <n> <text> [file]: run.sh's own messages, fixed templates with no untrusted text.
post_text() {
  local n="$1" text="$2" file="${3:-}" dir
  dir=$(mktemp -d "$STATE/tmp/msg.XXXXXX")
  local json="${text//\\/\\\\}"
  json="${json//\"/\\\"}"
  json="${json//$'\n'/\\n}"
  if [ -n "$file" ] && [ -f "$file" ]; then
    cp "$file" "$dir/"
    basename "$file" > "$dir/files.txt"
    printf '{"content":"%s","embeds":[],"allowed_mentions":{"parse":[]},"attachments":[{"id":0,"filename":"%s"}]}\n' "$json" "$(basename "$file")" > "$dir/payload.json"
  else
    : > "$dir/files.txt"
    printf '{"content":"%s","embeds":[],"allowed_mentions":{"parse":[]}}\n' "$json" > "$dir/payload.json"
  fi
  post_dir "$dir" "$n"
  local rc=$?
  rm -rf "$dir"
  return $rc
}

# After the lock a run that cannot start says so: a missing message must mean the host did not run (D23).
fail() { post_text x "❌ perf $KIND not started: $1"; echo "run.sh: $1" >&2; exit 2; }

# --- 1. lock --------------------------------------------------------------------------------------------------------

exec 9>"$STATE/run.lock" || die "cannot open $STATE/run.lock: run as the owner of the state directory, with its PERF_STATE_DIR"
if [ "$KIND" = nightly ]; then flock -w 1800 9; else flock -n 9; fi || {
  post_text x "⏭️ perf $KIND skipped: another perf run is active"
  exit 1
}

# --- 2. orphans -----------------------------------------------------------------------------------------------------

if created=$(docker inspect -f '{{.Created}}' perf-run 2>/dev/null); then
  age=$(( $(date +%s) - $(date -d "$created" +%s) ))
  if [ "$age" -lt 14400 ]; then
    post_text x "⚠️ perf $KIND not started: a previous run is still alive since $(date -u -d "$created" +%FT%TZ)"
    exit 1
  fi
  docker rm -f perf-run >/dev/null
fi

# --- 3. did the last run finish? -------------------------------------------------------------------------------------

if [ -f "$STATE/running.json" ]; then
  last=$(sed -n 's/.*"start": *"\([0-9TZ:.-]*\)".*/\1/p' "$STATE/running.json" | head -1)
  post_text x "⚠️ the perf run of ${last:-an unknown date} did not finish (a reboot or a kill)"
fi
printf '{"ref":"%s","kind":"%s","start":"%s"}\n' "${REF//\"/}" "$KIND" "$(date -u +%FT%TZ)" > "$STATE/running.json"

# --- 4. the trap ----------------------------------------------------------------------------------------------------

cleanup() {
  [ -n "$GPID" ] && docker stop -t 5 perf-gate >/dev/null 2>&1
  [ -n "$CPID" ] && docker stop -t 30 perf-run >/dev/null 2>&1
  [ -n "$SPID" ] && kill "$SPID" 2>/dev/null
  rm -f "$STATE/running.json"
}
# A stop (systemctl stop, a reboot, systemd's TimeoutStartSec) is posted: a missing message must mean the host did not run.
on_signal() {
  trap - EXIT
  cleanup
  POST_MAX_TIME=20
  [ -n "$HIST" ] && tail -n 50 "$HIST/nightly.log" > "$HIST/nightly-log-tail.txt" 2>/dev/null
  post_text x "⛔ perf $KIND $RUN_ID: stopped by a signal (systemctl stop, a reboot or a timeout)" "${HIST:+$HIST/nightly-log-tail.txt}"
  exit 143
}
trap cleanup EXIT
trap on_signal INT TERM

# --- 5. git, on the host --------------------------------------------------------------------------------------------

git -C "$REPO" fetch --prune --quiet origin || fail "git fetch failed"
git -C "$TOOL" checkout --quiet --force --detach origin/master || fail "the tool worktree cannot be updated"
# A ref is origin/<ref> when that exists (the local branches of repo/ are never updated), else as given (a sha, a tag).
resolve() {
  git -C "$REPO" rev-parse --verify -q "origin/$1^{commit}" 2>/dev/null || git -C "$REPO" rev-parse --verify -q "$1^{commit}"
}
if [ -n "$BISECT" ]; then
  GOOD=$(resolve "${BISECT%%..*}") || fail "the good end of --bisect is not a known ref"
  SHA=$(resolve "${BISECT#*..}") || fail "the bad end of --bisect is not a known ref"
  BISECT="$GOOD..$SHA"
else
  SHA=$(resolve "$REF") || fail "--ref is not a known ref"
fi

# --- 6. image -------------------------------------------------------------------------------------------------------

PW=$(sed -n 's/.*"@playwright\/test": *"[^0-9]*\([0-9][0-9.]*\)".*/\1/p' "$TOOL/package.json" | head -1)
[ -n "$PW" ] || fail "no @playwright/test version in the tool's package.json"
DSHA=$(sha1sum "$TOOL/perf/nightly/Dockerfile" | cut -c1-7)
IMAGE="surveyjs-perf:$PW-$DSHA"
if ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
  docker build --quiet --build-arg "PW_VERSION=$PW" -t "$IMAGE" "$TOOL/perf/nightly" >/dev/null || fail "docker build of $IMAGE failed"
  if ls "$STATE"/baselines/*.json >/dev/null 2>&1; then
    post_text x "🐳 new image $IMAGE: a new machine key, the next nightly records a baseline"
  else
    post_text x "🐳 new image $IMAGE"
  fi
fi
MACHINE_EXTRA="$IMAGE-cpus${PERF_CPUS:-all}"

# The options are checked by nightly.ts's own parser before the gate, so a typo is not found an hour later as a crash.
CHECK=(--suites "$SUITES")
[ -n "$ONLY" ] && CHECK+=(--only "$ONLY")
[ -n "$BISECT" ] && CHECK+=(--bisect "$BISECT")
docker run --rm --network none -v "$TOOL:$TOOL:ro" "$IMAGE" node "$TOOL/perf/nightly/nightly.ts" --check-args "${CHECK[@]}" >&2 ||
  fail "the options are not valid (the error is on the terminal)"

# --- 7. the run id and the history directory ------------------------------------------------------------------------

RUN_ID="$(date -u +%Y%m%dT%H%M%S)-${SHA:0:7}-$([ -n "$BISECT" ] && echo bisect || echo "$KIND")"
HIST="$STATE/history/$RUN_ID"
[ -e "$HIST" ] && fail "the history directory of $RUN_ID exists"
mkdir -p "$HIST"
printf '{"runId":"%s","ref":"%s","kind":"%s","start":"%s"}\n' "$RUN_ID" "${REF//\"/}" "$KIND" "$(date -u +%FT%TZ)" > "$STATE/running.json"
echo "run.sh: $RUN_ID, image $IMAGE, history $HIST"

# --- 8. gate --------------------------------------------------------------------------------------------------------

if [ "$NO_GATE" = 0 ]; then
  # In the background with `& wait`, so a stop signal is not held up for up to an hour; the trap stops perf-gate.
  docker run --rm --name perf-gate --network none -v "$TOOL:$TOOL:ro" "$IMAGE" node "$TOOL/perf/nightly/gate.ts" wait \
    --max-busy "$PERF_MAX_BUSY_CORES" --quiet-min 5 --max-min "$PERF_GATE_MAX_MIN" --interval 10 > "$HIST/gate.out" 2>&1 &
  GPID=$!
  wait "$GPID" || true
  GPID=""
  gate=$(grep '^{' "$HIST/gate.out" | tail -1)
  [ -n "$gate" ] || gate='{"ok":false,"reason":"gate-failed","waitMin":0}'
  echo "$gate" > "$HIST/gate.json"
  echo "run.sh: gate $gate"
fi

# --- 9. the container -----------------------------------------------------------------------------------------------

RECORD_T=$((5 * (10 + 8 + 8) + 15 + 30))
case "$KIND" in
  nightly) T=$((45 + 40 + 30)) ;;
  record) T=$RECORD_T ;;
  *) T=$((45 + 30)); [ -n "$BISECT" ] && T=$((T + 40)) ;;
esac
# A nightly after a new machine key records (record-pending.json, D22): it gets the record's time.
[ "$KIND" = nightly ] && [ -f "$STATE/record-pending.json" ] && T=$RECORD_T
ARGS=(--ref "$REF" --sha "$SHA" --suites "$SUITES" --history "$HIST" --image "$IMAGE")
[ "$KIND" = nightly ] && ARGS+=(--nightly)
[ "$KIND" = record ] && ARGS+=(--record)
[ -n "$LABEL" ] && ARGS+=(--label "$LABEL")
[ -n "$ONLY" ] && ARGS+=(--only "$ONLY")
[ -n "$BISECT" ] && ARGS+=(--bisect "$BISECT")
[ "$NO_BISECT" = 1 ] && ARGS+=(--no-bisect)
[ "$REINSTALL" = 1 ] && ARGS+=(--reinstall)
# The repo's hooks and config are read-only inside: the host runs git in repo/ before the next night.
mkdir -p "$REPO/.git/hooks"
DOCKER=(docker run --rm --init --name perf-run --cgroup-parent=perf.slice --user "$(id -u):$(id -g)" --shm-size=2g
  --memory="$PERF_MEMORY" --memory-swap="$PERF_MEMORY" -v "$STATE:$STATE"
  -v "$REPO/.git/hooks:$REPO/.git/hooks:ro" -v "$REPO/.git/config:$REPO/.git/config:ro"
  -e "PERF_STATE_DIR=$STATE" -e "PERF_CPUS=$PERF_CPUS" -e "PERF_MAX_OTHER_CORES=$PERF_MAX_OTHER_CORES" -e "PERF_KEEP_DAYS=$PERF_KEEP_DAYS"
  -e "PERF_DISCORD_ROLE_ID=$PERF_DISCORD_ROLE_ID" -e "PERF_MACHINE_EXTRA=$MACHINE_EXTRA" -e "PERF_IMAGE=$IMAGE" -e "TZ=Europe/Berlin" -e "HOME=$STATE/home")
[ -n "$PERF_CPUS" ] && DOCKER+=(--cpuset-cpus="$PERF_CPUS")
# In the background with `& wait`, so the trap runs at once on a signal.
DOCKER+=(-e "PERF_DEADLINE=$(( $(date +%s) + T * 60 ))")
timeout -k 60 "${T}m" "${DOCKER[@]}" "$IMAGE" node "$TOOL/perf/nightly/nightly.ts" "${ARGS[@]}" > "$HIST/nightly.log" 2>&1 &
CPID=$!

# --- 10. the sampler ------------------------------------------------------------------------------------------------

sampler() {
  exec 9>&-
  local pid="" cg="" i
  for i in $(seq 1 60); do
    pid=$(docker inspect -f '{{.State.Pid}}' perf-run 2>/dev/null) && [ "${pid:-0}" != 0 ] && break
    sleep 1
  done
  [ -n "$pid" ] && [ "$pid" != 0 ] || { echo "sampler: the container did not start" > "$HIST/sampler.err"; return 1; }
  cg="/sys/fs/cgroup$(sed -n 's/^0:://p' "/proc/$pid/cgroup" | head -1)"
  if [ ! -f "$cg/cpu.stat" ]; then
    echo "sampler: no cpu.stat in $cg (cgroup v2 needed)" | tee "$HIST/sampler.err" >&2
    return 1
  fi
  while kill -0 "$CPID" 2>/dev/null && [ -f "$cg/cpu.stat" ]; do
    local t cpus usage oom
    # The time first, to the nanosecond: an interval is about 5.1 s, and whole seconds would misread it by up to 20%.
    t=$(date +%s.%N)
    cpus=$(grep '^cpu[0-9]' /proc/stat | sed 's/.*/"&"/' | paste -sd, -)
    usage=$(sed -n 's/^usage_usec //p' "$cg/cpu.stat" 2>/dev/null)
    oom=$(sed -n 's/^oom_kill //p' "$cg/memory.events" 2>/dev/null)
    printf '{"t":%s,"cpu":[%s],"usage_usec":%s,"oom_kill":%s}\n' "$t" "$cpus" "${usage:-null}" "${oom:-null}" >> "$HIST/load.jsonl"
    sleep 5
  done
}
sampler &
SPID=$!

# --- 11. posting ----------------------------------------------------------------------------------------------------

POST_FAILED=0
# One attempt while the container runs (429s are retried inside post_dir), one more after it exits.
try_post() { # try_post <n> <dir>
  if [ -f "$2/ready" ] && [ ! -f "$HIST/posted-$1" ] && [ ! -f "$HIST/post-failed-$1" ]; then post_dir "$2" "$1" || POST_FAILED=1; fi
}
while kill -0 "$CPID" 2>/dev/null; do
  try_post 1 "$HIST/discord/1-result"
  sleep 10
done
wait "$CPID"
EC=$?
CPID=""
docker stop -t 30 perf-run >/dev/null 2>&1
kill "$SPID" 2>/dev/null
SPID=""
rm -f "$HIST/post-failed-1"
POST_FAILED=0
try_post 1 "$HIST/discord/1-result"

oom_kills() {
  [ -f "$HIST/load.jsonl" ] || { echo 0; return; }
  local a b
  a=$(head -1 "$HIST/load.jsonl" | sed -n 's/.*"oom_kill":\([0-9]*\).*/\1/p')
  b=$(tail -1 "$HIST/load.jsonl" | sed -n 's/.*"oom_kill":\([0-9]*\).*/\1/p')
  echo $(( ${b:-0} - ${a:-0} ))
}
tail -n 50 "$HIST/nightly.log" > "$HIST/nightly-log-tail.txt" 2>/dev/null
what="crashed (exit $EC)"
{ [ "$EC" = 124 ] || [ "$EC" = 137 ]; } && what="timed out after $T min"
[ "$(oom_kills)" -gt 0 ] && what="out of memory"
handled=0
case "$EC" in 0|1|3) handled=1 ;; esac
if [ ! -f "$HIST/posted-1" ]; then
  if [ "$handled" = 1 ] && [ -f "$HIST/post-failed-1" ]; then
    # The night ended normally but Discord refused its message: say so, not "crashed".
    post_text 1 "❌ perf $KIND $RUN_ID: the result message could not be posted (HTTP $(cat "$HIST/post-failed-1")); see history/$RUN_ID" || POST_FAILED=1
  else
    post_text 1 "❌ perf $KIND $RUN_ID: $what" "$HIST/nightly-log-tail.txt" || POST_FAILED=1
  fi
elif [ "$handled" = 0 ]; then
  if { [ "$EC" = 124 ] || [ "$EC" = 137 ]; } && [ -f "$HIST/bisect-started" ]; then
    [ -f "$HIST/discord/2-bisect/ready" ] || post_text 2 "⏱️ perf $KIND $RUN_ID: bisect timed out" "$HIST/nightly-log-tail.txt" || POST_FAILED=1
  else
    post_text 2 "❌ perf $KIND $RUN_ID: $what after the result was posted" "$HIST/nightly-log-tail.txt" || POST_FAILED=1
  fi
fi
try_post 2 "$HIST/discord/2-bisect"

echo "run.sh: $RUN_ID done, exit $EC"
[ "$POST_FAILED" = 0 ] || exit 1
case "$EC" in 0|1) exit 0 ;; *) exit 1 ;; esac
