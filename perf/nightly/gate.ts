import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// The gate before a night and the load arithmetic after each suite (05, D12). run.sh's sampler writes raw lines to
// <history>/load.jsonl; all arithmetic is here:
// * busy = user + nice + system + irq + softirq + steal (guest time is already inside user; iowait counts as idle);
// * other work on the pinned cores = their busy time minus the container's cgroup usage;
// * other work elsewhere = the host total minus the pinned cores;
// * a suite is noisy when its busiest minute has more than 0.25 core of other work on the pinned cores, or more than
//   PERF_MAX_OTHER_CORES (1.0) elsewhere.
// /proc/stat is not namespaced, so a container sees the host's.
export interface CpuTimes {
  user: number;
  nice: number;
  system: number;
  idle: number;
  iowait: number;
  irq: number;
  softirq: number;
  steal: number;
  guest: number;
  guestNice: number;
}

export interface LoadSample {
  // Seconds since the epoch.
  t: number;
  cpus: { [cpu: number]: CpuTimes };
  // The container cgroup's cpu.stat usage_usec and memory.events oom_kill; null before the container is found.
  usageUsec: number | null;
  oomKill: number | null;
}

export const defaultLimits = { maxPinned: 0.25, maxOther: 1.0, maxBusy: 1.0 };

export function parseCpuLine(line: string): { cpu: number, times: CpuTimes } | undefined {
  const m = /^cpu(\d+)\s+(.*)$/.exec(line.trim());
  if (!m) return undefined;
  const v = m[2].split(/\s+/).map(Number);
  const at = (i: number): number => (isFinite(v[i]) ? v[i] : 0);
  return { cpu: Number(m[1]), times: { user: at(0), nice: at(1), system: at(2), idle: at(3), iowait: at(4), irq: at(5), softirq: at(6),
    steal: at(7), guest: at(8), guestNice: at(9) } };
}

export function parseProcStat(text: string): { [cpu: number]: CpuTimes } {
  const res: { [cpu: number]: CpuTimes } = {};
  text.split(/\r?\n/).forEach((line: string) => {
    const c = parseCpuLine(line);
    if (c) res[c.cpu] = c.times;
  });
  return res;
}

// One sampler line: {"t":<epoch s>,"cpu":["cpu0 ...","cpu1 ..."],"usage_usec":<n>|null,"oom_kill":<n>|null}.
export function parseLoadLine(line: string): LoadSample | undefined {
  let raw: any;
  try {
    raw = JSON.parse(line);
  } catch(e) {
    return undefined;
  }
  if (!raw || typeof raw.t !== "number" || !Array.isArray(raw.cpu)) return undefined;
  const num = (v: any): number | null => (typeof v === "number" && isFinite(v) ? v : null);
  return { t: raw.t, cpus: parseProcStat(raw.cpu.join("\n")), usageUsec: num(raw.usage_usec), oomKill: num(raw.oom_kill) };
}

export function readLoad(file: string): Array<LoadSample> {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/).map(parseLoadLine).filter((s: LoadSample | undefined) => !!s) as Array<LoadSample>;
}

export function busyOf(t: CpuTimes): number {
  return t.user + t.nice + t.system + t.irq + t.softirq + t.steal;
}

export function totalOf(t: CpuTimes): number {
  return busyOf(t) + t.idle + t.iowait;
}

// "2-5,8" -> [2, 3, 4, 5, 8].
export function parseCpuList(text: string | undefined): Array<number> {
  const res: Array<number> = [];
  (text || "").split(",").map((s: string) => s.trim()).filter((s: string) => !!s).forEach((part: string) => {
    const m = /^(\d+)(?:-(\d+))?$/.exec(part);
    if (!m) throw new Error("not a cpu list: " + text);
    const from = Number(m[1]);
    const to = m[2] === undefined ? from : Number(m[2]);
    for (let i = from; i <= to; i++) res.push(i);
  });
  return res;
}

// Busy cores between two samples, over the given cpus (all when omitted): the sum of each cpu's busy share.
export function busyCores(a: { [cpu: number]: CpuTimes }, b: { [cpu: number]: CpuTimes }, cpus?: Array<number>): number {
  const list = cpus || Object.keys(b).map(Number);
  let sum = 0;
  list.forEach((cpu: number) => {
    if (!a[cpu] || !b[cpu]) return;
    const total = totalOf(b[cpu]) - totalOf(a[cpu]);
    if (total > 0) sum += Math.max(0, busyOf(b[cpu]) - busyOf(a[cpu])) / total;
  });
  return sum;
}

export interface LoadInterval {
  from: number;
  to: number;
  host: number;
  pinned: number;
  ours: number;
  otherPinned: number;
  otherElsewhere: number;
}

export function intervalsOf(samples: Array<LoadSample>, pinned: Array<number>): Array<LoadInterval> {
  const res: Array<LoadInterval> = [];
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1];
    const b = samples[i];
    const dt = b.t - a.t;
    if (dt <= 0 || a.usageUsec === null || b.usageUsec === null) continue;
    const host = busyCores(a.cpus, b.cpus);
    const onPinned = pinned.length ? busyCores(a.cpus, b.cpus, pinned) : host;
    const ours = Math.max(0, b.usageUsec - a.usageUsec) / 1e6 / dt;
    res.push({ from: a.t, to: b.t, host: host, pinned: onPinned, ours: ours, otherPinned: Math.max(0, onPinned - ours),
      otherElsewhere: pinned.length ? Math.max(0, host - onPinned) : 0 });
  }
  return res;
}

export interface Environment {
  noisy: boolean;
  noisyReasons: Array<string>;
  gateWaitMin: number | null;
  // Means over the suite; the busiest minute decides noisy.
  otherCoresPinned: number;
  otherCoresElsewhere: number;
  busiestMinutePinned: number;
  busiestMinuteElsewhere: number;
  oomKills: number;
  samples: number;
}

const round = (v: number): number => Math.round(v * 100) / 100;

// The largest mean of `key` over any full window of `windowSec` (the whole span when the suite is shorter): a window
// that starts in the last minute would be shorter, and one 5 s burst at a suite's end would count 12 times as much.
function busiest(list: Array<LoadInterval>, key: "otherPinned" | "otherElsewhere", windowSec: number): number {
  let best = 0;
  if (!list.length) return 0;
  const end = list[list.length - 1].to;
  const full = end - list[0].from >= windowSec;
  for (let i = 0; i < list.length; i++) {
    if (full && end - list[i].from < windowSec) break;
    if (!full && i > 0) break;
    let weighted = 0;
    let span = 0;
    for (let j = i; j < list.length && list[j].from < list[i].from + windowSec; j++) {
      const d = list[j].to - list[j].from;
      weighted += list[j][key] * d;
      span += d;
    }
    if (span > 0) best = Math.max(best, weighted / span);
  }
  return best;
}

export interface EnvironmentOptions {
  from: number;
  to: number;
  pinned: Array<number>;
  maxPinned?: number;
  maxOther?: number;
  gate?: { ok: boolean, reason?: string, waitMin: number } | null;
  // No load samples at all: a local run without the sampler is not noisy; on the server it is.
  requireSamples?: boolean;
}

// The result file's environment block for one suite (00, Result file), from the sampler lines in [from, to].
export function environmentOf(samples: Array<LoadSample>, options: EnvironmentOptions): Environment {
  const maxPinned = options.maxPinned === undefined ? defaultLimits.maxPinned : options.maxPinned;
  const maxOther = options.maxOther === undefined ? defaultLimits.maxOther : options.maxOther;
  const inside = samples.filter((s: LoadSample) => s.t >= options.from - 5 && s.t <= options.to + 5);
  const list = intervalsOf(inside, options.pinned).filter((x: LoadInterval) => x.to > options.from && x.from < options.to);
  const span = list.reduce((s: number, x: LoadInterval) => s + (x.to - x.from), 0);
  const mean = (key: "otherPinned" | "otherElsewhere"): number => (span > 0 ? list.reduce((s: number, x: LoadInterval) => s + x[key] * (x.to - x.from), 0) / span : 0);
  const reasons: Array<string> = [];
  const bp = busiest(list, "otherPinned", 60);
  const be = busiest(list, "otherElsewhere", 60);
  if (bp > maxPinned) reasons.push("other work on the pinned cores: " + round(bp) + " cores in the busiest minute (limit " + maxPinned + ")");
  if (be > maxOther) reasons.push("other work elsewhere: " + round(be) + " cores in the busiest minute (limit " + maxOther + ")");
  if (options.gate && !options.gate.ok) reasons.push(options.gate.reason || "gate");
  if (list.length === 0 && options.requireSamples) reasons.push("no load samples");
  const ooms = inside.map((s: LoadSample) => s.oomKill).filter((v: number | null) => v !== null) as Array<number>;
  return { noisy: reasons.length > 0, noisyReasons: reasons, gateWaitMin: options.gate ? options.gate.waitMin : null,
    otherCoresPinned: round(mean("otherPinned")), otherCoresElsewhere: round(mean("otherElsewhere")), busiestMinutePinned: round(bp),
    busiestMinuteElsewhere: round(be), oomKills: ooms.length ? Math.max(...ooms) - Math.min(...ooms) : 0, samples: list.length };
}

// The gate (run.sh step 8): wait until the host is below maxBusy cores for quietMin minutes, give up after maxMin.
export interface GateState {
  start: number;
  quietSince: number | null;
}

export type GateDecision = { done: false } | { done: true, ok: boolean, reason?: string, waitMin: number };

export function gateStep(state: GateState, busy: number, now: number, options: { maxBusy: number, quietMin: number, maxMin: number }): GateDecision {
  const waitMin = Math.round((now - state.start) / 60 * 100) / 100;
  if (busy < options.maxBusy) {
    if (state.quietSince === null) state.quietSince = now;
    if (now - state.quietSince >= options.quietMin * 60) return { done: true, ok: true, waitMin: waitMin };
  } else {
    state.quietSince = null;
  }
  if (now - state.start >= options.maxMin * 60) return { done: true, ok: false, reason: "gate-timeout", waitMin: waitMin };
  return { done: false };
}

// node gate.ts wait [--max-busy 1.0] [--quiet-min 5] [--max-min 60] [--interval 10]: prints one JSON line,
// {"ok":true,"waitMin":5.2} or {"ok":false,"reason":"gate-timeout","waitMin":60}, and exits 0 either way.
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const opt = (name: string, fallback: number): number => {
    const i = args.indexOf(name);
    return i > -1 && args[i + 1] !== undefined && args[i + 1] !== "" ? Number(args[i + 1]) : fallback;
  };
  if (args[0] !== "wait") throw new Error("usage: gate.ts wait [--max-busy n] [--quiet-min n] [--max-min n] [--interval s]");
  const options = { maxBusy: opt("--max-busy", defaultLimits.maxBusy), quietMin: opt("--quiet-min", 5), maxMin: opt("--max-min", 60) };
  const interval = opt("--interval", 10);
  const read = (): { [cpu: number]: CpuTimes } => parseProcStat(fs.readFileSync("/proc/stat", "utf8"));
  const state: GateState = { start: Date.now() / 1000, quietSince: null };
  let prev = read();
  for (;;) {
    await new Promise((resolve: (v: any) => void) => setTimeout(resolve, interval * 1000));
    const cur = read();
    const d = gateStep(state, busyCores(prev, cur), Date.now() / 1000, options);
    prev = cur;
    if (d.done) {
      console.log(JSON.stringify({ ok: d.ok, reason: d.reason, waitMin: d.waitMin }));
      return;
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e: any) => {
    console.error(e && e.stack ? e.stack : String(e));
    process.exitCode = 2;
  });
}
