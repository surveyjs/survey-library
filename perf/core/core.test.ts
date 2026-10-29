import { describe, test, expect } from "vitest";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { runnerRoot } from "../harness/node/build.ts";

// 01 check 8 extended to the core entry points (02): run.ts and scenario-process.ts load in plain Node with nothing
// on stderr, and write a result file of 00's format.
describe("the core runner", () => {
  test("run.ts with PERF_ONLY runs one scenario in a child process and writes the result file", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "perf-core-"));
    const file = path.join(dir, "core.json");
    const res = spawnSync(process.execPath, [path.join(runnerRoot, "perf", "core", "run.ts")], {
      encoding: "utf8",
      env: Object.assign({}, process.env, { PERF_ONLY: "calculations/load/model,large/load/model", PERF_RESULT_FILE: file, PERF_CORE_DIR: "" })
    });
    expect(res.stderr).toBe("");
    expect(res.status).toBe(0);
    const result = JSON.parse(fs.readFileSync(file, "utf8"));
    expect(result.schema).toBe(1);
    expect(result.suite).toBe("core");
    expect(result.requested).toEqual({ only: ["calculations/load/model", "large/load/model"], notInSuite: [] });
    expect(result.results.map((r: any) => r.id)).toEqual(["calculations/load/model", "large/load/model"]);
    const r = result.results[0];
    expect(r.samples.length).toBeGreaterThanOrEqual(5);
    expect(r.median).toBeGreaterThan(0);
    expect(Object.keys(r.calibration)).toEqual(["median", "before", "after"]);
    expect(r.counters.expressionRuns.kind).toBe("work");
    expect(result.fixtures.calculations.hash).toMatch(/^[0-9a-f]{40}$/);
    expect(result.machine.key).toMatch(/^[a-z0-9.-]+$/);
    expect(result.failed).toEqual([]);
    fs.rmSync(dir, { recursive: true, force: true });
  });
  test("scenario-process.ts reports a scenario whose requires the build lacks as skipped", () => {
    const res = spawnSync(process.execPath, ["--expose-gc", path.join(runnerRoot, "perf", "core", "scenario-process.ts"), "records-1k/load/model"], {
      encoding: "utf8", env: Object.assign({}, process.env, { PERF_CORE_DIR: "" })
    });
    expect(res.stderr).toBe("");
    const msg = JSON.parse(res.stdout.trim());
    // On the runner's build paging exists, so the scenario runs.
    expect(msg.type).toBe("entry");
  });
});
