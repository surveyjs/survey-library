# Performance tests

Nightly performance tests of survey-library: survey-core alone (Node) and rendered with React 19 and survey-js-ui in
headless Chromium. They only measure: no markup checks, no screenshots. Every night a Docker container on the perf
server builds `master`, measures it, compares it with a reference, posts the result to Discord and bisects a new
regression to its PR.

## Layout

| folder | what |
|---|---|
| `fixtures/` | generated survey JSON and data (`large`, `expressions`, `calculations`, `complexLogic`, `manyPages`, `records-1k`, `records-10k`) |
| `scenarios/` | the operations measured on them; `revs.json` holds each scenario's `rev` and hash |
| `harness/` | sample loop, stats, counters, calibration, ids; `harness/node/`: result file, baseline, compare, `known.json`, bisect step rule |
| `core/` | the core suite: one fresh `node --expose-gc` process per scenario |
| `browser/` | the browser suites: Playwright, one fresh page per scenario, pages served from the builds by `context.route` |
| `react19/` | the pinned React 19 production build of the React suite |
| `nightly/` | the server: `run.sh` (host), `nightly.ts` (container), `gate.ts`, `discord.ts`, `bisect.ts`, `Dockerfile`, `systemd/` |
| `results/` | local output, git-ignored |

## Running locally

Build first: survey-core `npm run build && npm run build:i18n && npm run build:icons && npm run build:linter` (the UI
builds import `survey-core/icons`), then `npm run build` in
survey-react-ui and survey-js-ui. The suites refuse a stale build.

```bash
cd packages/survey-core && npm run perf              # core suite -> perf/results/core-latest.json
cd packages/survey-react-ui && npm run perf:ci       # React 19 suite
cd packages/survey-js-ui && npm run perf:ci          # survey-js-ui suite
cd packages/survey-core && npm run perf:test         # the perf code's own unit tests
```

* `PERF_ONLY=<id>,<id>` runs some scenarios (`perf/harness/ids.ts` lists them); `PERF_ONLY=calibration` runs only a
  calibration process.
* `PERF_CORE_DIR=<dir>` measures another survey-core build (a `packages/survey-core/build` folder, or an npm
  `node_modules/survey-core`); `PERF_UI_DIR=<dir>` another UI build. The tests always come from this checkout.
* `npm run perf:baseline -- <suite> <result.json>...` and `npm run perf:compare -- <result.json>` (in survey-core)
  build a local baseline and judge a run. `PERF_STATE_DIR` sets where baselines live (default `perf/results/state`).
* `PERF_STATE_DIR=<tmp> node perf/nightly/nightly.ts --runner . --dry-post --suites core,react` runs a whole night
  locally against `origin/master` in `<tmp>/work/target`, and prints the Discord payloads instead of posting them.

## The server

### Host prerequisites

bash, util-linux `flock`, coreutils `timeout`, curl 7.76 or newer, git, Docker (the user that runs the tests is in the
`docker` group) on cgroup v2. Check `docker info -f '{{.CgroupDriver}} {{.CgroupVersion}}'`: `systemd 2` or
`cgroupfs 2`. Node is not needed on the host.

### Bootstrap

```bash
S=/srv/surveyjs-perf                         # PERF_STATE_DIR, owned by the user that runs the tests
mkdir -p $S && cd $S
git clone https://github.com/surveyjs/survey-library repo
git -C repo worktree add --detach ../work/tool origin/master
sudo install -D -m 755 work/tool/perf/nightly/run.sh /usr/local/lib/surveyjs-perf/run.sh
sudo install -D -m 600 -o perf -g perf /dev/null /etc/surveyjs-perf/perf.env   # then fill it, see below
```

The env file (`PERF_ENV_FILE`, default `/etc/surveyjs-perf/perf.env`) holds plain `KEY=value` lines, no quotes; `run.sh`
parses it line by line:

```
PERF_DISCORD_WEBHOOK=https://discord.com/api/webhooks/<id>/<token>
PERF_DISCORD_ROLE_ID=<role to mention on a new regression>
PERF_CPUS=4-7,12-15
PERF_MEMORY=12g
PERF_MAX_BUSY_CORES=1.0
PERF_MAX_OTHER_CORES=1.0
PERF_GATE_MAX_MIN=60
PERF_KEEP_DAYS=90
```

The env file and `run.sh` stay **outside** the state directory, and `run.sh` refuses an env file inside it: the container
mounts the state directory read-write and runs the target's npm scripts and build, so whatever it can reach there must
hold no secret and no code the host runs (`repo/.git/hooks` and `repo/.git/config` are mounted read-only for the same
reason). The webhook is never passed to the container, and curl reads it from a process substitution, so it is not in
`ps` either.

### Keeping other work off `PERF_CPUS`

The container runs in its own `perf.slice`. Move everything else off the perf cores:

```bash
systemctl set-property system.slice AllowedCPUs=0-3,8-11
systemctl set-property user.slice AllowedCPUs=0-3,8-11
systemctl set-property machine.slice AllowedCPUs=0-3,8-11   # only if VMs run on the box
```

Pin whole physical cores, both SMT siblings (`lscpu -e` shows them). Set the `performance` governor if the host
allows it (`cpupower frequency-set -g performance`). A night still checks the load: before it starts, the gate waits
until the host is below `PERF_MAX_BUSY_CORES` for 5 minutes (60 at most), and a suite with other work on the pinned
cores (0.25 core in its busiest minute) or elsewhere (`PERF_MAX_OTHER_CORES`) is `noisy`: counters are judged, times
are not.

### The timer

```bash
sudo cp $S/work/tool/perf/nightly/systemd/perf-nightly.* /etc/systemd/system/
sudoedit /etc/systemd/system/perf-nightly.service   # User=, Group= and PERF_STATE_DIR
sudo systemctl daemon-reload && sudo systemctl enable --now perf-nightly.timer
systemctl list-timers perf-nightly.timer            # the next run
```

`OnCalendar=*-*-* 03:00:00 Europe/Berlin`, `Persistent=false`: a missed night is skipped. A run stopped by a signal
(`systemctl stop`, a clean reboot, `TimeoutStartSec`) posts "stopped by a signal"; one killed outright (power loss,
SIGKILL) leaves `running.json`, and the next run posts "did not finish". A host that was off at 03:00 posts nothing, so
a missing morning message means the host did not run. Without systemd, use cron: `CRON_TZ=Europe/Berlin` and
`0 3 * * *` where cron supports it; otherwise `0 1,2 * * *` UTC with a wrapper that runs `run.sh --nightly` only when
`TZ=Europe/Berlin date +%H` is `03`.

### The first etalon

After the PR is merged: `run.sh --record` (5 interleaved rounds of the three suites: about 1.5 hours at the
steady-state suite times; the limit is 175 minutes). Each suite's baseline is written as soon as its 5 rounds are in;
scenarios with fewer than 4 clean runs are recorded again, at most twice, and only while the extra rounds fit in the
limit. A noisy run is left out, and a record does not start when the gate gave up. Check the spread and the `unstable`
list in its post. Until a baseline exists, a night posts its results without time verdicts.

### Renewing the baseline

`run.sh --record`, or `run.sh --record --only <ids>` for some scenarios. Say why in the channel. A new image (a new
`@playwright/test` or Dockerfile) is a new machine key: once a baseline exists, the next nightly records the suites by
itself (at most twice; after that the post asks for a `--record` by hand).

### On demand

Run them as the state owner, with the service's state directory (the env file is readable only by that user, and
`run.lock` belongs to it):

```bash
R="sudo -u perf PERF_STATE_DIR=/srv/surveyjs-perf /usr/local/lib/surveyjs-perf/run.sh"
$R --ref feature/x --label "PR #12345"          # a branch against master's reference
$R --ref feature/x --only records-10k/records/next@orders
$R --bisect v3.2.2..master --only <id>          # search by hand; refs are origin/<ref> first, then tags and shas
$R --dry-post --no-gate                          # build the messages, post nothing
$R --reinstall                                   # reinstall every node_modules folder of the run
```

The options are checked before the gate: a wrong suite or id is posted at once as "not started".

### Updating the installed `run.sh`

`run.sh` updates `work/tool` itself, but systemd runs the installed copy. After a merge that changes
`perf/nightly/run.sh`, read the diff, then `sudo install -m 755 $S/work/tool/perf/nightly/run.sh /usr/local/lib/surveyjs-perf/run.sh`.

### What a night does

1. `run.sh` (host): takes `run.lock`, posts a stuck or unfinished previous run, fetches, moves `work/tool` to
   `origin/master`, builds the image if needed, runs the gate, then the container with the load sampler beside it,
   and posts `history/<run>/discord/1-result` and `2-bisect`. A crash, a timeout or an out-of-memory kill is posted
   with the last 50 log lines attached.
2. `nightly.ts` (container): installs only when a folder's dependency fields change (`install-key.ts`), builds the
   target, runs the suites one after another, compares them with the reference, reruns the suspects twice at the end,
   writes `known.json`, the ratchet and `last-nightly.json`, and bisects new regressions (at most 2 and 40 minutes a
   night).

The state directory: `repo/`, `work/{tool,target,bisect,builds}`, `baselines/`, `history/`, `known.json`,
`last-nightly.json`, `record-pending.json`, `deps-last.json`, `npm-cache/`, `home/`, `tmp/` (run.sh's messages),
`run.lock`, `running.json`. History older than `PERF_KEEP_DAYS` is pruned.
