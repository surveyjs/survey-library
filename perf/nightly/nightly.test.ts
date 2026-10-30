import { describe, test, expect } from "vitest";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import { prOf } from "./pr.ts";
import { installKeyOf, installedList, depsDiff } from "./install-key.ts";
import { dependencyInfo } from "../harness/node/deps.ts";
import { parseProcStat, busyCores, parseCpuList, parseLoadLine, environmentOf, gateStep, intervalsOf } from "./gate.ts";
import { escapeText, resultMessage, bisectMessage, embedsSize, limits, rangeLines, rangeText } from "./discord.ts";
import type { SuiteReport } from "./discord.ts";
import { planSuites, planReruns, nextLastNightly, chooseBisects } from "./plan.ts";
import { search, firstParentRange, rangePrs } from "./bisect.ts";
import { parseArgs, curlArgv, writeMessage } from "./nightly.ts";
import type { Comparison } from "../harness/node/compare.ts";
import { idsOfSuite } from "../harness/ids.ts";

// The unit tests of 05 (Checks): the message builder, pr.ts, the install key and fingerprint, gate.ts, the PERF_ONLY
// split, the bisect search on a fake measure function, last-nightly.json transitions.
const tmp = (name: string): string => fs.mkdtempSync(path.join(os.tmpdir(), "perf-" + name + "-"));

describe("pr.ts", () => {
  test("40 real first-parent subjects", () => {
    const list = JSON.parse(fs.readFileSync(path.join(__dirname, "testdata", "first-parent-subjects.json"), "utf8"));
    expect(list.length).toBe(40);
    ["ea6cea4f1", "57757f062", "647db47f5"].forEach((sha: string) => expect(list.some((e: any) => e.sha === sha)).toBe(true));
    expect(list.some((e: any) => /^Merge branch 'master'/.test(e.subject))).toBe(true);
    list.forEach((e: any) => expect([e.sha, prOf(e.sha, e.subject, e.body).pr]).toEqual([e.sha, e.pr]));
  });
  test("merge title from the body, the last (#N), no bare #N, commit links", () => {
    const merge = prOf("ea6cea4f1", "Merge pull request #12152 from surveyjs/fix/unary-null-operand", "\nfix(expressions): a unary operator over null\n");
    expect(merge).toEqual({ sha: "ea6cea4f1", pr: 12152, title: "fix(expressions): a unary operator over null", url: "https://github.com/surveyjs/survey-library/pull/12152" });
    expect(prOf("x", "feat(matrix): show the sort level number in sorted column headers (#1\u2026 (#12145)").pr).toBe(12145);
    expect(prOf("x", "fix #12147 (matrixdynamic): keep empty rows (#12151)").title).toBe("fix #12147 (matrixdynamic): keep empty rows");
    expect(prOf("abc", "fix #12147 without a PR")).toEqual({ sha: "abc", pr: null, title: "fix #12147 without a PR", url: "https://github.com/surveyjs/survey-library/commit/abc" });
    expect(prOf("abc", "Release: 3.2.3 [azurepipelines skip]").pr).toBeNull();
  });
});

describe("install-key.ts", () => {
  const before = { name: "survey-core", version: "3.2.3", scripts: { build: "rollup" }, devDependencies: { rollup: "^4.34.8", "survey-utils": "github:surveyjs/survey-utils" } };
  test("a release bump changes no key; a dependency or the image does", () => {
    const after = Object.assign({}, before, { version: "3.2.4" });
    expect(installKeyOf(after, "img:1")).toBe(installKeyOf(before, "img:1"));
    expect(installKeyOf({ devDependencies: { "survey-utils": "github:surveyjs/survey-utils", rollup: "^4.34.8" } }, "img:1")).toBe(installKeyOf(before, "img:1"));
    expect(installKeyOf(Object.assign({}, before, { devDependencies: { rollup: "^4.35.0" } }), "img:1")).not.toBe(installKeyOf(before, "img:1"));
    expect(installKeyOf(before, "img:2")).not.toBe(installKeyOf(before, "img:1"));
    expect(installKeyOf(Object.assign({}, before, { overrides: { a: "1" } }), "img:1")).not.toBe(installKeyOf(before, "img:1"));
  });
  test("the fingerprint lists external packages only: no own version, no linked survey-core", () => {
    const dir = tmp("deps");
    const pkg = (at: string, name: string, version: string): void => {
      fs.mkdirSync(at, { recursive: true });
      fs.writeFileSync(path.join(at, "package.json"), JSON.stringify({ name: name, version: version }));
    };
    pkg(dir, "survey-react-ui", "3.2.3");
    pkg(path.join(dir, "node_modules", "rollup"), "rollup", "4.34.8");
    pkg(path.join(dir, "node_modules", "@types", "node"), "@types/node", "7.0.4");
    const build = path.join(dir, "core-build");
    pkg(build, "survey-core", "3.2.3");
    fs.symlinkSync(build, path.join(dir, "node_modules", "survey-core"), "junction");
    const a = dependencyInfo([dir]);
    expect(installedList([dir])).toEqual(["@types/node@7.0.4", "rollup@4.34.8"]);
    // The release bump: the package's own version and the linked build's.
    pkg(dir, "survey-react-ui", "3.2.4");
    pkg(build, "survey-core", "3.2.4");
    expect(dependencyInfo([dir]).fingerprint).toBe(a.fingerprint);
    pkg(path.join(dir, "node_modules", "rollup"), "rollup", "4.35.0");
    expect(dependencyInfo([dir]).fingerprint).not.toBe(a.fingerprint);
    expect(depsDiff(["@types/node@7.0.4", "rollup@4.34.8", "x@1"], ["@types/node@7.0.4", "rollup@4.35.0", "y@2"])).toBe("rollup 4.34.8 -> 4.35.0, +y@2, -x@1");
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

// /proc/stat lines: user nice system idle iowait irq softirq steal guest guest_nice (jiffies).
const stat = (rows: Array<Array<number>>): string => rows.map((r: Array<number>, i: number) => "cpu" + i + " " + r.join(" ")).join("\n");
const line = (t: number, rows: Array<Array<number>>, usageUsec: number | null, oom: number = 0): string =>
  JSON.stringify({ t: t, cpu: stat(rows).split("\n"), usage_usec: usageUsec, oom_kill: oom });

describe("gate.ts", () => {
  test("busy is user+nice+system+irq+softirq+steal; guest is inside user; iowait is idle", () => {
    const a = parseProcStat("cpu  1 2 3 4\n" + stat([[100, 0, 0, 900, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1000, 0, 0, 0, 0, 0, 0]]));
    // cpu0: +50 user of which 40 guest, +50 idle -> 0.5 busy; cpu1: +50 iowait, +50 idle -> 0 busy.
    const b = parseProcStat(stat([[150, 0, 0, 950, 0, 0, 0, 0, 40, 0], [0, 0, 0, 1050, 50, 0, 0, 0, 0, 0]]));
    expect(busyCores(a, b)).toBeCloseTo(0.5);
    expect(busyCores(a, b, [1])).toBe(0);
    const c = parseProcStat(stat([[150, 10, 10, 950, 0, 10, 10, 10, 40, 0], [0, 0, 0, 1050, 50, 0, 0, 0, 0, 0]]));
    expect(busyCores(b, c, [0])).toBe(1);
    expect(parseCpuList("2-4,7")).toEqual([2, 3, 4, 7]);
    expect(() => parseCpuList("2-x")).toThrow();
  });
  test("other work on the pinned cores, elsewhere, the busiest minute, oom kills", () => {
    // 4 cpus, cpus 2-3 pinned. Every 5 s each cpu has 500 jiffies. The container uses 1.5 cores.
    const lines: Array<string> = [];
    let usage = 0;
    const acc = [[0, 0], [0, 0], [0, 0], [0, 0]];
    for (let k = 0; k <= 36; k++) {
      // From 60 s to 120 s someone else uses 0.5 core on cpu 3 and 1.5 cores on cpus 0-1.
      const busy = k > 12 && k <= 24 ? [375, 375, 500, 500] : [0, 0, 500, 250];
      if (k > 0) {
        busy.forEach((b: number, i: number) => { acc[i][0] += b; acc[i][1] += 500 - b; });
        usage += 1.5 * 5 * 1e6;
      }
      lines.push(line(1000 + k * 5, acc.map((x: Array<number>) => [x[0], 0, 0, x[1], 0, 0, 0, 0, 0, 0]), usage, k > 30 ? 1 : 0));
    }
    const samples = lines.map(parseLoadLine).filter((s: any) => !!s) as any;
    const iv = intervalsOf(samples, [2, 3]);
    expect(iv[0].ours).toBeCloseTo(1.5);
    expect(iv[0].otherPinned).toBeCloseTo(0);
    expect(iv[14].otherPinned).toBeCloseTo(0.5);
    expect(iv[14].otherElsewhere).toBeCloseTo(1.5);
    const quiet = environmentOf(samples, { from: 1000, to: 1060, pinned: [2, 3] });
    expect(quiet.noisy).toBe(false);
    expect(quiet.oomKills).toBe(0);
    const env = environmentOf(samples, { from: 1000, to: 1180, pinned: [2, 3] });
    expect(env.noisy).toBe(true);
    expect(env.noisyReasons.length).toBe(2);
    expect(env.busiestMinutePinned).toBeCloseTo(0.5);
    expect(env.otherCoresPinned).toBeLessThan(0.25);
    expect(env.oomKills).toBe(1);
    // R05-F5: one 0.6-core burst of 5 s at the very end of a 3-minute suite is diluted like one in the middle.
    const burst = (at: number): any => {
      const out: Array<string> = [];
      const cpu = [[0, 0], [0, 0], [0, 0], [0, 0]];
      let used = 0;
      for (let k = 0; k <= 36; k++) {
        const b = [0, 0, 500, k === at ? 300 : 0];
        if (k > 0) {
          b.forEach((x: number, i: number) => { cpu[i][0] += x; cpu[i][1] += 500 - x; });
          used += 5 * 1e6;
        }
        out.push(line(2000 + k * 5, cpu.map((x: Array<number>) => [x[0], 0, 0, x[1], 0, 0, 0, 0, 0, 0]), used));
      }
      return environmentOf(out.map(parseLoadLine) as any, { from: 2000, to: 2180, pinned: [2, 3] });
    };
    expect([burst(18).noisy, burst(36).noisy]).toEqual([false, false]);
    expect(burst(36).busiestMinutePinned).toBeCloseTo(burst(18).busiestMinutePinned);
    expect(environmentOf([], { from: 0, to: 1, pinned: [] }).noisy).toBe(false);
    expect(environmentOf([], { from: 0, to: 1, pinned: [], requireSamples: true }).noisyReasons).toEqual(["no load samples"]);
    expect(environmentOf([], { from: 0, to: 1, pinned: [], gate: { ok: false, reason: "gate-timeout", waitMin: 60 } }).noisyReasons).toEqual(["gate-timeout"]);
  });
  test("saved real /proc/stat and cpu.stat samples, as run.sh's sampler writes them", () => {
    const text = fs.readFileSync(path.join(__dirname, "testdata", "proc-stat-linux.txt"), "utf8");
    const samples = text.split("=== sample ").slice(1).map((block: string, k: number) => {
      // run.sh: grep '^cpu[0-9]' /proc/stat (not the "cpu " total line), sed -n 's/^usage_usec //p' cpu.stat.
      const lines = block.split(/\r?\n/);
      const cpus = lines.filter((l: string) => /^cpu[0-9]/.test(l));
      const usage = Number(lines.filter((l: string) => /^usage_usec /.test(l))[0].split(" ")[1]);
      return parseLoadLine(JSON.stringify({ t: 100 + k * 5.02, cpu: cpus, usage_usec: usage, oom_kill: null }))!;
    });
    expect(Object.keys(samples[0].cpus)).toEqual(["0", "1", "2", "3"]);
    expect(samples[1].cpus[3]).toEqual({ user: 3, nice: 0, system: 40, idle: 977, iowait: 4, irq: 0, softirq: 2, steal: 0, guest: 0, guestNice: 0 });
    // cpu3: busy 36 -> 45 of total 529 -> 1026; cpu0 4 of 498; cpu1 1 of 499; cpu2 0.
    expect(busyCores(samples[0].cpus, samples[1].cpus, [3])).toBeCloseTo(9 / 497, 5);
    expect(busyCores(samples[0].cpus, samples[1].cpus)).toBeCloseTo(9 / 497 + 4 / 498 + 1 / 499, 5);
    const iv = intervalsOf(samples, [2, 3]);
    expect(iv[0].ours).toBeCloseTo(748000 / 1e6 / 5.02, 5);
    expect(iv[0].otherPinned).toBe(0);
    expect(iv[0].otherElsewhere).toBeCloseTo(4 / 498 + 1 / 499, 5);
  });
  test("the gate waits for 5 quiet minutes and gives up after 60", () => {
    const o = { maxBusy: 1, quietMin: 5, maxMin: 60 };
    const s = { start: 0, quietSince: null };
    expect(gateStep(s, 0.5, 10, o).done).toBe(false);
    expect(gateStep(s, 2, 20, o).done).toBe(false);
    expect(gateStep(s, 0.5, 30, o).done).toBe(false);
    expect(gateStep(s, 0.5, 329, o).done).toBe(false);
    expect(gateStep(s, 0.5, 330, o)).toEqual({ done: true, ok: true, waitMin: 5.5 });
    const busy = { start: 0, quietSince: null };
    expect(gateStep(busy, 3, 3600, o)).toEqual({ done: true, ok: false, reason: "gate-timeout", waitMin: 60 });
  });
});

function verdict(id: string, v: string, extra?: any): any {
  return Object.assign({ id: id, verdict: v, median: 120, reference: 100, change: 0.2, threshold: 0.25, tolerance: 0.25, counters: [], tags: [], judgedOk: v === "ok",
    okAgainstFrozen: false, countersOk: true, counterValues: {} }, extra || {});
}
function comparison(suite: string, verdicts: Array<any>): Comparison {
  return { suite: suite, machineKey: "k", newMachineKey: false, verdicts: verdicts, reruns: [], noisy: false,
    failed: verdicts.some((v: any) => ["regression", "counter regression", "missing", "fixture changed"].indexOf(v.verdict) > -1), previous: { date: "2026-10-28T03:00:00Z", commit: "p" } };
}

describe("discord.ts", () => {
  const subjects = JSON.parse(fs.readFileSync(path.join(__dirname, "testdata", "first-parent-subjects.json"), "utf8"));
  const range = subjects.map((e: any) => prOf(e.sha, e.subject, e.body));
  test("escaping: Markdown, URLs in <...>, no mention can render", () => {
    expect(escapeText(String.fromCharCode(27) + "[31mTest timeout of 180000ms exceeded." + String.fromCharCode(27) + "[39m\u0007")).toBe("Test timeout of 180000ms exceeded.");
    expect(escapeText("Merge branch 'master' of https://github.com/surveyjs/survey-library into x")).toBe("Merge branch 'master' of <https://github.com/surveyjs/survey-library> into x");
    expect(escapeText("**bold** _it_ `code` <@&123> [x](y) # h > q ~s~ |s|")).toBe("\\*\\*bold\\*\\* \\_it\\_ \\`code\\` \\<@&123\\> \\[x\\](y) \\# h \\> q \\~s\\~ \\|s\\|");
  });
  test("the range is cut at 15 lines, then +N more", () => {
    const lines = rangeLines(range);
    expect(lines.length).toBe(15);
    expect(rangeText(range, 6000).split("\n")[15]).toBe("+25 more");
    expect(rangeText(range, 600)).toMatch(/\n\+3\d more$/);
    expect(lines[0]).toMatch(/^\[#12159\]\(https:\/\/github.com\/surveyjs\/survey-library\/pull\/12159\) feat\(playwright\)/);
    expect(lines.filter((l: string) => /Release: 3\.2\.3/.test(l)).length).toBe(0);
  });
  const big = (n: number): Array<any> => {
    const res: Array<any> = [];
    for (let i = 0; i < n; i++) res.push(verdict("records-10k/records/scenario-" + i + "@orders", i % 3 === 0 ? "regression" : i % 3 === 1 ? "improved" : "ok", { vsPrevious: 0.5, rerunMedians: [121, 122] }));
    return res;
  };
  const input = (suites: Array<SuiteReport>, newRegression: boolean): any => ({ kind: "nightly", label: "nightly **x** <@&1>", ref: "origin/master", commit: "0123456789abcdef", date: "2026-10-29T03:00:00.000Z",
    durationMin: 52, range: range, rangeFrom: "fedcba987654", suites: suites, notes: ["dependencies changed: " + "rollup 1 -> 2, ".repeat(300)], roleId: "4242",
    newRegression: newRegression, footer: "run x \u00b7 state 3.1 GB", files: ["summary.md", "results.tar.gz"].concat(Array.from({ length: 12 }, (x: any, i: number) => "build-" + i + ".log")) });
  test("the documented limits hold for a huge night", () => {
    const suites: Array<SuiteReport> = ["core", "react", "survey-js-ui"].map((s: string) => ({ suite: s, status: "ok", comparison: comparison(s, big(120)),
      unstable: idsOfSuite("core"), known: { added: [], removed: [], still: big(30).map((v: any) => ({ id: v.id, entry: { since: "2026-10-01T03:00:00Z" } })) } as any }));
    suites.push({ suite: "survey-js-ui", status: "build failed", buildLog: { pkg: "survey-js-ui", tail: Array.from({ length: 50 }, (x: any, i: number) => "error line " + i + " `x`") } });
    const m = resultMessage(input(suites, true));
    const p = m.payload;
    expect(p.content.length).toBeLessThanOrEqual(limits.content);
    expect(p.embeds.length).toBeLessThanOrEqual(limits.embeds);
    expect(embedsSize(p)).toBeLessThanOrEqual(limits.total);
    p.embeds.forEach((e: any) => {
      expect((e.title || "").length).toBeLessThanOrEqual(limits.title);
      expect((e.description || "").length).toBeLessThanOrEqual(limits.description);
    });
    expect(m.files.length).toBeLessThanOrEqual(limits.files);
    expect(p.content).toMatch(/<@&4242> new regression$/);
    expect(p.content.indexOf("<@&1>")).toBe(-1);
    expect(p.allowed_mentions).toEqual({ parse: [], roles: ["4242"] });
    expect(p.embeds[0].description).toMatch(/\+25 more$/);
    expect(p.embeds[p.embeds.length - 1].footer!.text).toBe("run x \u00b7 state 3.1 GB");
  });
  test("mentions are off without a new regression; an ok night is green", () => {
    const m = resultMessage(input([{ suite: "core", status: "ok", comparison: comparison("core", [verdict("large/load/model", "ok")]) }], false));
    expect(m.payload.allowed_mentions).toEqual({ parse: [] });
    expect(m.payload.content).not.toMatch(/(^|[^\\])<@&/);
    expect(m.payload.content.indexOf("\u2705")).toBe(0);
    const b = bisectMessage([{ suite: "core", id: "records-10k/records/next@orders", status: "found", message: "first bad x", firstBad: prOf("abcdef0123", "spin (#90004)"),
      result: { result: "found", message: "", steps: [{ commit: "abcdef0123", medians: [1, 2, 3], median: 2, bad: true }], good: { commit: "g", medians: [1], median: 1 }, bad: { commit: "b", medians: [2], median: 2 } } }],
    { kind: "nightly", commit: "0123456789" }, []);
    expect(b.payload.allowed_mentions).toEqual({ parse: [] });
    expect(b.payload.content).toMatch(/first bad `abcdef012` \[#90004\]\(<https:\/\/github.com\/surveyjs\/survey-library\/pull\/90004>\) spin/);
  });
  test("a message directory and the curl argv with the webhook redacted", () => {
    const dir = tmp("msg");
    const src = path.join(dir, "src");
    fs.mkdirSync(src);
    fs.writeFileSync(path.join(src, "summary.md"), "# x\n");
    const m = resultMessage(input([{ suite: "core", status: "ok", comparison: comparison("core", []) }], false));
    m.files = ["summary.md", "missing.tar.gz"];
    writeMessage(path.join(dir, "1-result"), m, { "summary.md": path.join(src, "summary.md") });
    expect(fs.readFileSync(path.join(dir, "1-result", "files.txt"), "utf8")).toBe("summary.md\n");
    expect(JSON.parse(fs.readFileSync(path.join(dir, "1-result", "payload.json"), "utf8")).attachments).toEqual([{ id: 0, filename: "summary.md" }]);
    expect(fs.existsSync(path.join(dir, "1-result", "ready"))).toBe(true);
    const argv = curlArgv(path.join(dir, "1-result")).join(" ");
    expect(argv).toBe("curl --fail-with-body -sS -D <hdr> -K <(printf 'url = \"%s\"\\n' '<webhook>?wait=true') -F payload_json=<payload.json;type=application/json -F files[0]=@summary.md");
    expect(argv.indexOf("discord.com")).toBe(-1);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe("plan.ts", () => {
  test("the PERF_ONLY split per suite", () => {
    expect(planSuites(null, ["react", "core"]).map((p: any) => p.suite)).toEqual(["core", "react"]);
    const p = planSuites(["records-10k/records/next@orders", "large/output/data", "manyPages/load/paint"], ["core", "react", "survey-js-ui"]);
    expect(p).toEqual([{ suite: "core", only: ["large/output/data", "records-10k/records/next@orders"] },
      { suite: "react", only: ["manyPages/load/paint", "records-10k/records/next@orders"] },
      { suite: "survey-js-ui", only: ["manyPages/load/paint", "records-10k/records/next@orders"] }]);
    expect(planSuites(["large/output/data"], ["core", "react"]).map((x: any) => x.suite)).toEqual(["core"]);
    expect(() => planSuites(["manyPages/load/paint"], ["core"])).toThrow(/none of the suites core/);
    expect(() => planSuites(["no/such/id"], ["core"])).toThrow();
    expect(() => planSuites(null, ["vue3" as any])).toThrow(/unknown suites/);
    expect(() => parseArgs(["--bisect", "a..b"])).toThrow(/--only/);
    expect(parseArgs(["--nightly"]).kind).toBe("nightly");
    expect(parseArgs(["--record", "--nightly"]).kind).toBe("record");
  });
  const res = (suite: string, core: string, ui?: string): any => ({ suite: suite, build: { core: { dir: core, commit: "t1" }, ui: ui ? { dir: ui } : undefined } });
  test("reruns: round 1 of every suite, then round 2, the env from the build block, a spacer for a single suspect", () => {
    const steps = planReruns([{ suite: "core", reruns: ["a", "b"], result: res("core", "/t/core") }, { suite: "react", reruns: [], result: res("react", "/t/core", "/t/react") },
      { suite: "survey-js-ui", reruns: ["c"], result: res("survey-js-ui", "/t/core", "/t/js") }]);
    expect(steps.map((s: any) => s.suite + ":" + s.round + ":" + s.ids)).toEqual(["core:1:a,b", "survey-js-ui:1:c", "core:2:a,b", "survey-js-ui:2:c"]);
    expect(steps[1].env).toEqual({ PERF_CORE_DIR: "/t/core", PERF_UI_DIR: "/t/js", PERF_TARGET_COMMIT: "t1" });
    const one = planReruns([{ suite: "core", reruns: ["a"], result: res("core", "/t/core") }]);
    expect(one.map((s: any) => s.ids)).toEqual([["a"], "calibration", ["a"]]);
    expect(planReruns([{ suite: "core", reruns: [], result: res("core", "/c") }])).toEqual([]);
  });
  test("last-nightly.json: lastRun moves every nightly, lastJudged only when complete, quiet and with a reference", () => {
    const night = (commit: string, suites: Array<any>, kind: string = "nightly"): any => ({ kind: kind, commit: commit, date: "d-" + commit, runId: "r-" + commit, suites: suites });
    const s = (suite: string, complete: boolean, noisy: boolean, ref: boolean): any => ({ suite: suite, complete: complete, noisy: noisy, hasReference: ref, result: suite + ".json" });
    let st = nextLastNightly(null, night("c1", [s("core", true, false, false)]));
    expect(st).toEqual({ lastRun: { commit: "c1", date: "d-c1", runId: "r-c1" }, suites: {} });
    st = nextLastNightly(st, night("c2", [s("core", true, false, true), s("react", true, true, true)]));
    expect(Object.keys(st.suites)).toEqual(["core"]);
    expect(st.suites.core.lastJudged.commit).toBe("c2");
    st = nextLastNightly(st, night("c3", [s("core", false, false, true), s("react", true, false, true)]));
    expect([st.lastRun!.commit, st.suites.core.lastJudged.commit, st.suites.react.lastJudged.commit]).toEqual(["c3", "c2", "c3"]);
    const after = nextLastNightly(st, night("c4", [s("core", true, false, true)], "on-demand"));
    expect(after).toEqual(st);
  });
  test("bisect choice: core first, a browser suite only without core, whole-suite once, at most 2", () => {
    const c = (suite: string, id: string, change: number, tags: Array<string> = []): any => ({ suite: suite, id: id, lastOkCommit: "g",
      verdict: verdict(id, "regression", { change: change, tags: tags, rerunMedians: [1, 2] }) });
    const r = chooseBisects([c("react", "x", 0.9), c("survey-js-ui", "x", 0.5), c("core", "x", 0.3), c("react", "paint", 0.4), c("core", "y", 0.2), c("core", "z", 0.1)]);
    expect(r.chosen.map((x: any) => x.suite + ":" + x.id)).toEqual(["core:x", "core:y"]);
    expect(r.skipped.map((x: any) => x.c.suite + ":" + x.c.id)).toEqual(["core:z", "survey-js-ui:x", "react:x", "react:paint"]);
    const w = chooseBisects([c("core", "a", 0.3, ["whole-suite"]), c("core", "b", 0.5, ["whole-suite"]), c("react", "p", 0.4)]);
    expect(w.chosen.map((x: any) => x.id)).toEqual(["b", "p"]);
  });
});

describe("bisect.ts", () => {
  const commits = ["c0", "c1", "c2", "c3", "c4", "c5"];
  const pr = (sha: string): any => prOf(sha, "commit " + sha + " (#9000" + sha.substring(1) + ")");
  test("a +50% step at the 4th of 6 commits is found, with its PR and the step medians", async() => {
    const measure = async(c: string): Promise<number> => (commits.indexOf(c) >= 3 ? 150 : 100) * (1 + (Math.random() - 0.5) * 0.04);
    const r = await search(commits, measure, { suite: "core", id: "x", reference: 100, tolerance: 0.25, deadline: Date.now() + 60000, prOf: pr });
    expect(r.status).toBe("found");
    expect(r.firstBad!.sha).toBe("c3");
    expect(r.firstBad!.pr).toBe(90003);
    expect(r.result!.steps.length).toBeGreaterThan(0);
  });
  test("an unbuildable step is skipped by its neighbour; all unbuildable is narrowed", async() => {
    const measure = async(c: string): Promise<number | null> => (c === "c2" ? null : commits.indexOf(c) >= 4 ? 150 : 100);
    const r = await search(commits, measure, { suite: "core", id: "x", reference: 100, tolerance: 0.25, deadline: Date.now() + 60000, prOf: pr });
    expect([r.status, r.firstBad!.sha]).toEqual(["found", "c4"]);
    expect(r.result!.unbuildable).toEqual(["c2"]);
    // c2 unbuildable between a good c1 and a bad c3: the first bad is c2 or c3.
    const between = await search(commits, async(c: string) => (c === "c2" ? null : commits.indexOf(c) >= 3 ? 150 : 100), { suite: "core", id: "x",
      reference: 100, tolerance: 0.25, deadline: Date.now() + 60000, prOf: pr });
    expect([between.status, between.message]).toEqual(["narrowed", "narrowed to c1..c3, unbuildable"]);
    const none = await search(commits, async(c: string) => (c === "c0" ? 100 : c === "c5" ? 150 : null), { suite: "core", id: "x", reference: 100, tolerance: 0.25,
      deadline: Date.now() + 60000, prOf: pr });
    expect(none.status).toBe("narrowed");
    expect(none.message).toBe("narrowed to c0..c5, unbuildable");
  });
  test("not reproduced, not in range, the budget", async() => {
    const nr = await search(commits, async() => 100, { suite: "core", id: "x", reference: 100, tolerance: 0.25, deadline: Date.now() + 60000, prOf: pr });
    expect(nr.status).toBe("not-reproduced");
    const nir = await search(commits, async() => 150, { suite: "core", id: "x", reference: 100, tolerance: 0.25, deadline: Date.now() + 60000, prOf: pr });
    expect(nir.status).toBe("not-in-range");
    let t = 0;
    const late = await search(commits, async(c: string) => { t += 10 * 60000; return commits.indexOf(c) >= 3 ? 150 : 100; },
      { suite: "core", id: "x", reference: 100, tolerance: 0.25, deadline: 25 * 60000, now: () => t, prOf: pr });
    expect(late.status).toBe("timed out");
  });
  test("the first-parent range and the PRs of a real repository", () => {
    const repo = tmp("repo");
    const g = (...args: Array<string>): string => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
    g("init", "-q", "-b", "main");
    g("config", "user.email", "t@example.com");
    g("config", "user.name", "t");
    const shas: Array<string> = [];
    for (let i = 0; i < 4; i++) {
      fs.writeFileSync(path.join(repo, "f.txt"), String(i));
      g("add", "f.txt");
      g("commit", "-q", "-m", i === 2 ? "Merge pull request #90002 from x/y" : "step " + i + " (#9000" + i + ")", "-m", "the title of " + i);
      shas.push(g("rev-parse", "HEAD"));
    }
    expect(firstParentRange(repo, shas[0], shas[3])).toEqual(shas);
    expect(() => firstParentRange(repo, shas[3], shas[0])).toThrow(/not an ancestor/);
    const prs = rangePrs(repo, shas[0], shas[3]);
    expect(prs.map((p: any) => p.pr + " " + p.title)).toEqual(["90003 step 3", "90002 the title of 2", "90001 step 1"]);
    fs.rmSync(repo, { recursive: true, force: true });
  });
});
