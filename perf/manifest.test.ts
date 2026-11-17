import { describe, test, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { manifest, contractVersion, resultSchema, scenarioTimeoutMs } from "./manifest.ts";
import { SUITES, idsOfSuite } from "./harness/ids.ts";
import { runnerRoot } from "./harness/node/build.ts";

describe("the runner contract", () => {
  test("the manifest lists every suite with its ids, and its paths exist", () => {
    const m = manifest({ PERF_MACHINE_EXTRA: "x" });
    expect(m.contract).toBe(contractVersion);
    expect(m.resultSchema).toBe(resultSchema);
    expect(Object.keys(m.suites).sort()).toEqual(SUITES.slice().sort());
    SUITES.forEach((suite: string) => {
      const s = m.suites[suite];
      expect(s.ids).toEqual(idsOfSuite(suite as any));
      expect(fs.existsSync(path.join(runnerRoot, s.cwd))).toBe(true);
      expect(fs.existsSync(path.join(runnerRoot, s.script))).toBe(true);
      if (suite === "core") return;
      expect(fs.existsSync(path.join(runnerRoot, s.cwd, s.args[2]))).toBe(true);
      (s.src as Array<string>).forEach((dir: string) => expect(fs.existsSync(path.join(runnerRoot, dir))).toBe(true));
    });
    expect(m.suites.vue3).toMatchObject({ cwd: "packages/survey-vue3-ui", package: "survey-vue3-ui", buildFile: "survey-vue3-ui.umd.js",
      src: ["packages/survey-vue3-ui/src"] });
    expect(m.suites.angular).toMatchObject({ cwd: "packages/survey-angular-ui", package: "survey-angular-ui", buildFile: "fesm2015/survey-angular-ui.js",
      src: ["packages/survey-angular-ui/src"] });
    expect(m.machine.chromium).toBeNull();
    expect(m.machine.key).toMatch(/-x$/);
  });
  test("node perf/manifest.ts prints the same manifest", () => {
    const r = spawnSync(process.execPath, [path.join(runnerRoot, "perf", "manifest.ts")], { encoding: "utf8",
      env: Object.assign({}, process.env, { PERF_MACHINE_EXTRA: "y" }) });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toEqual(manifest({ PERF_MACHINE_EXTRA: "y" }));
  });
  test("contract 2: a suite has no time limit and the manifest names no spacer id", () => {
    const m: any = manifest();
    expect(m.contract).toBe(2);
    expect(m.resultSchema).toBe(2);
    expect("calibrationOnlyId" in m).toBe(false);
    SUITES.forEach((suite: string) => expect(Object.keys(m.suites[suite])).not.toContain("budgetMin"));
  });
  test("the core hang guard is 5 minutes per scenario process", () => {
    expect(scenarioTimeoutMs).toBe(300000);
  });
});
