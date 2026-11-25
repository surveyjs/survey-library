import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import * as Survey from "survey-core";
import { runnerRoot } from "../harness/node/build.ts";
import { getExtraFixtures } from "../fixtures/extra.ts";
import { extraScenarioIds } from "../scenarios/index.ts";
import { extraOpKinds } from "../scenarios/extra.ts";

// The sidecar files of a PERF_EXTRA_JSON file (<base>.data.json, <base>.setup.mjs, <base>.ops.json): a small form
// with a matrix, a dynamic panel, text questions and a calculated value that calls a function the setup module registers.
const json = {
  calculatedValues: [{ name: "label", expression: "shout({t})" }],
  elements: [
    { type: "text", name: "t" },
    { type: "radiogroup", name: "r", choices: [1, 2] },
    { type: "text", name: "u", visibleIf: "{r} = 1" },
    { type: "expression", name: "e", expression: "shout({t})" },
    { type: "matrixdropdown", name: "m", rows: ["a", "b"], columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text" }] },
    { type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "pt" }] }
  ]
};
const data = { t: "hello", r: 2, m: { a: { c1: "x" } }, p: [{ pt: "one" }, { pt: "two" }] };
const setupModule = "export default (Survey) => Survey.FunctionFactory.Instance.register(\"shout\", (p) => String(p[0] || \"\").toUpperCase() + \"!\");\n";
const ops = [
  { id: "data", op: "data", samples: 1, warmup: 0 },
  { id: "data-again", op: "data-again", samples: 2, warmup: 1 },
  { id: "merge", op: "merge", value: { t: "merged", m: { a: { c2: "w" } } } },
  { id: "set-r", op: "set", name: "r", value: 1, before: [{ name: "t", value: "before" }] },
  { id: "cell", op: "cell", question: "m", row: "b", column: "c2", value: "y" },
  { id: "row-cell", op: "row-cell", question: "m", row: "a", column: "c1", value: "z" },
  { id: "panel", op: "panel-question", question: "p", panelIndex: 1, name: "pt", value: "edited" },
  { id: "type", op: "type", question: "t", text: "abc" }
];

let dir = "";
let file = "";
beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "perf extra ops "));
  file = path.join(dir, "form.json");
  fs.writeFileSync(file, JSON.stringify(json));
  fs.writeFileSync(path.join(dir, "form.data.json"), String.fromCharCode(0xfeff) + JSON.stringify(data));
  fs.writeFileSync(path.join(dir, "form.setup.mjs"), setupModule);
  fs.writeFileSync(path.join(dir, "form.ops.json"), JSON.stringify(ops));
  fs.writeFileSync(path.join(dir, "plain.json"), JSON.stringify(json));
});
afterAll(() => { fs.rmSync(dir, { recursive: true, force: true }); });

describe("extra/ sidecar files", () => {
  test("the data, setup and ops files are read by name; a file without them has none", () => {
    const [form, plain] = getExtraFixtures(file + ";" + path.join(dir, "plain.json"));
    expect(form.data).toEqual(data);
    expect(form.setup).toBe(path.resolve(dir, "form.setup.mjs"));
    expect(form.ops).toEqual(ops);
    expect(plain.data).toBeUndefined();
    expect(plain.setup).toBeUndefined();
    expect(plain.ops).toBeUndefined();
    // A missing sidecar file changes nothing: the two ids of before.
    expect(extraScenarioIds(plain.key, plain.ops)).toEqual(["extra/plain/load/model", "extra/plain/answer/first"]);
  });
  test("every op kind is covered, and each op is an id extra/<base>/ops/<id>", () => {
    expect(ops.map((op: any) => op.op).sort()).toEqual(extraOpKinds.slice().sort());
    expect(extraScenarioIds("extra/form", ops as any)).toEqual(["extra/form/load/model", "extra/form/answer/first"].concat(ops.map((op: any) => "extra/form/ops/" + op.id)));
  });
  test("a bad ops file is refused with the op it names", () => {
    expect(() => extraScenarioIds("extra/x", [{ id: "a", op: "nope" }] as any)).toThrow(/ops\[0\] \(a\): op must be one of/);
    expect(() => extraScenarioIds("extra/x", [{ id: "a", op: "set", name: "q" }] as any)).toThrow(/set needs value/);
    expect(() => extraScenarioIds("extra/x", [{ id: "a b", op: "data" }] as any)).toThrow(/id must match/);
    expect(() => extraScenarioIds("extra/x", [{ id: "a", op: "data" }, { id: "a", op: "data" }] as any)).toThrow(/duplicate id a/);
    expect(() => extraScenarioIds("extra/x", [{ id: "a", op: "data", samples: 0 }] as any)).toThrow(/bad samples/);
    fs.writeFileSync(path.join(dir, "bad.json"), "{}");
    fs.writeFileSync(path.join(dir, "bad.ops.json"), "{\"id\": 1}");
    expect(() => getExtraFixtures(path.join(dir, "bad.json"))).toThrow(/bad\.ops\.json is not an array/);
  });
  test("the setup module registers the function a calculated value calls", async() => {
    // Vite cannot import a file URL with an escaped space: a folder without one (the runner test keeps the spaces).
    const plainDir = fs.mkdtempSync(path.join(os.tmpdir(), "perf-extra-setup-"));
    fs.writeFileSync(path.join(plainDir, "form.setup.mjs"), setupModule);
    const setup = await import(/* @vite-ignore */ pathToFileURL(path.join(plainDir, "form.setup.mjs")).href);
    fs.rmSync(plainDir, { recursive: true, force: true });
    setup.default(Survey);
    try {
      const survey = new Survey.Model(json);
      survey.data = data;
      expect(survey.getVariable("label")).toBe("HELLO!");
      survey.dispose();
    } finally {
      Survey.FunctionFactory.Instance.unregister("shout");
    }
  });
});

describe("extra/ ops in the core runner", () => {
  test("answer/first on a checkbox sets an array of the first choice", () => {
    const checkbox = path.join(dir, "checkbox.json");
    fs.writeFileSync(checkbox, JSON.stringify({ elements: [{ type: "checkbox", name: "c", choices: ["x", "y"] }] }));
    const resultFile = path.join(dir, "checkbox-core.json");
    const res = spawnSync(process.execPath, [path.join(runnerRoot, "perf", "core", "run.ts")], {
      encoding: "utf8",
      env: Object.assign({}, process.env, { PERF_EXTRA_JSON: checkbox, PERF_ONLY: "extra/checkbox/answer/first", PERF_RESULT_FILE: resultFile, PERF_CORE_DIR: "" })
    });
    expect(res.stderr).toBe("");
    const result = JSON.parse(fs.readFileSync(resultFile, "utf8"));
    expect(result.failed).toEqual([]);
    expect(result.results.map((r: any) => r.id)).toEqual(["extra/checkbox/answer/first"]);
  });
  test("every op runs and passes its check; setup runs before the first survey; samples and warmup reach the loop; conditionsPasses is counted", () => {
    const resultFile = path.join(dir, "core.json");
    const ids = extraScenarioIds("extra/form", ops as any);
    const res = spawnSync(process.execPath, [path.join(runnerRoot, "perf", "core", "run.ts")], {
      encoding: "utf8",
      env: Object.assign({}, process.env, { PERF_EXTRA_JSON: file, PERF_ONLY: ids.join(","), PERF_RESULT_FILE: resultFile, PERF_CORE_DIR: "", PERF_EXTRA_TIMEOUT_MS: "60000" })
    });
    expect(res.stderr).toBe("");
    const result = JSON.parse(fs.readFileSync(resultFile, "utf8"));
    expect(result.failed).toEqual([]);
    expect(result.results.map((r: any) => r.id)).toEqual(ids.slice().sort());
    expect(result.fixtures["extra/form"].dataHash).toMatch(/^[0-9a-f]{40}$/);
    expect(result.fixtures["extra/form"].options).toEqual({ path: "form.json", setup: "form.setup.mjs", ops: ops.length });
    const byId: { [id: string]: any } = {};
    result.results.forEach((r: any) => { byId[r.id] = r; });
    // Without the setup module the calculated value warns "Unknown function name" on every survey.
    result.results.forEach((r: any) => expect(r.info.warnings, r.id).toBe(0));
    expect(byId["extra/form/ops/data"].info).toMatchObject({ kept: 1, warmups: 0 });
    expect(byId["extra/form/ops/data-again"].info).toMatchObject({ kept: 2, warmups: 1 });
    expect(byId["extra/form/ops/type"].info.warmups).toBe(2);
    expect(byId["extra/form/ops/type"].info.kept).toBeGreaterThanOrEqual(5);
    result.results.forEach((r: any) => expect(r.counters.conditionsPasses.kind, r.id).toBe("work"));
    // One pass per character at least.
    expect(byId["extra/form/ops/type"].counters.conditionsPasses.value).toBeGreaterThanOrEqual(3);
    expect(byId["extra/form/ops/data"].counters.conditionsPasses.value).toBeGreaterThan(0);
    expect(byId["extra/form/ops/data"].counters.dataDiffs.value).toBe(0);
  });
});
