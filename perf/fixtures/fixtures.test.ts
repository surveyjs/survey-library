import { describe, test, expect } from "vitest";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import * as path from "node:path";
import * as Survey from "survey-core";
import { lintSurvey } from "survey-core/linter";
import { FIXTURE_KEYS, getFixture } from "./index.ts";
import { computeChainStep } from "./calculations.ts";
import type { ChainStep } from "./calculations.ts";
import { runnerRoot } from "../harness/node/build.ts";
import { loadQuietly, countsOf, plannedCounts, choiceCounts } from "./fixture-checks.ts";

// The fixture checks of 01 on the runner's build. fixtures-old.test.ts runs check 7 on an older one.
const sha1 = (text: string): string => createHash("sha1").update(text).digest("hex");

// Every expression of a survey JSON with whether it is a condition: element and item properties, validators,
// triggers, calculated values, completedHtmlOnCondition.
function collectExpressions(json: any): Array<{ path: string, text: string, isCondition: boolean }> {
  const res: Array<{ path: string, text: string, isCondition: boolean }> = [];
  const walk = (obj: any, at: string): void => {
    if (Array.isArray(obj)) {
      obj.forEach((item: any, i: number) => walk(item, at + "[" + i + "]"));
      return;
    }
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (typeof value === "string" && (/If$/.test(key) || /Expression$/.test(key) || key === "expression" || key === "runExpression")) {
        const isCondition = /If$/.test(key) || (key === "expression" && !obj.name && !obj.type) || (key === "expression" && /trigger|validator|completed/i.test(at)) ||
          (key === "expression" && ["setvalue", "copyvalue", "runexpression"].indexOf(obj.type) > -1);
        res.push({ path: at + "." + key, text: value, isCondition: isCondition && key !== "runExpression" });
      } else if (typeof value === "object") {
        walk(value, at + "." + key);
      }
    }
  };
  walk(json.pages, "pages");
  walk(json.triggers, "triggers");
  walk(json.completedHtmlOnCondition, "completedHtmlOnCondition");
  (json.calculatedValues || []).forEach((cv: any, i: number) => res.push({ path: "calculatedValues[" + i + "]", text: cv.expression, isCondition: false }));
  return res;
}

describe.skipIf(!!process.env.PERF_CORE_DIR)("perf fixtures on the runner's build", () => {
  test("1. determinism: the same seed gives the same output, another seed differs", () => {
    for (const key of FIXTURE_KEYS) {
      const a = getFixture(key);
      const b = getFixture(key);
      expect(JSON.stringify(a.json), key).toBe(JSON.stringify(b.json));
      expect(JSON.stringify(a.data), key + " data").toBe(JSON.stringify(b.data));
      const other = getFixture(key, { seed: 12345 });
      expect(sha1(JSON.stringify(other.json)), key + " another seed").not.toBe(sha1(JSON.stringify(a.json)));
      if (a.data) expect(sha1(JSON.stringify(other.data)), key + " another seed, data").not.toBe(sha1(JSON.stringify(a.data)));
    }
  });
  for (const key of FIXTURE_KEYS) {
    test("2. " + key + " loads with no warning, no jsonErrors and the planned counts", () => {
      const fixture = getFixture(key);
      const { survey, warnings } = loadQuietly(Survey, fixture.json);
      expect(warnings, key).toEqual([]);
      expect(survey.jsonErrors, key).toBeNull();
      expect(countsOf(survey), key).toEqual(plannedCounts(fixture.meta));
      expect(choiceCounts(survey), key + " choice questions").toEqual(fixture.meta.choiceQuestions);
    });
  }
  for (const key of ["records-1k", "records-10k"]) {
    test("3. " + key + ": the matrix and the panel on one valueName, paging, sort, aggregates, choicesFromQuestion", () => {
      const fixture = getFixture(key);
      const { survey } = loadQuietly(Survey, fixture.json);
      survey.data = fixture.data;
      const orders = fixture.data.orders;
      const n = orders.length;
      const matrix = survey.getQuestionByName("orders");
      expect(matrix.rowCount, "orders reports every record").toBe(n);
      expect(matrix.pageCount).toBe(Math.ceil(n / 20));
      const maxTotal = Math.max(...orders.map((o: any) => o.total));
      expect(matrix.visibleRows.length).toBe(20);
      expect(matrix.visibleRows[0].getValue("total"), "the first shown row has the largest total").toBe(maxTotal);
      // The whole first page in sort order (ties in data order): the first record alone may already hold the minimum.
      const byTotal = orders.slice().sort((a: any, b: any) => b.total - a.total);
      expect(matrix.visibleRows.map((r: any) => r.getValue("id"))).toEqual(byTotal.slice(0, 20).map((o: any) => o.id));
      const panel = survey.getQuestionByName("ordersPanel");
      const minQty = Math.min(...orders.map((o: any) => o.qty));
      expect(panel.panelCount).toBe(n);
      expect(panel.panels[0].getQuestionByName("qty").value, "the first panel has the smallest qty").toBe(minQty);
      const byQty = orders.slice().sort((a: any, b: any) => a.qty - b.qty);
      expect(panel.panels.map((p: any) => p.getQuestionByName("id").value)).toEqual(byQty.slice(0, 10).map((o: any) => o.id));
      expect(byQty.slice(0, 10).map((o: any) => o.id), "the sorted page differs from the unsorted one").not.toEqual(orders.slice(0, 10).map((o: any) => o.id));
      const sum = orders.reduce((s: number, o: any) => s + o.total, 0);
      expect(survey.getVariable("ordersTotal")).toBe(sum);
      expect(survey.getVariable("openCount")).toBe(orders.filter((o: any) => o.status === "open").length);
      expect(survey.getQuestionByName("ordersTotalShown").value).toBe(sum);
      expect(survey.getQuestionByName("selectedOrder").visibleChoices.length).toBe(n);
      const bound = survey.getQuestionByName(fixture.meta.boundToTotal);
      expect(bound.isVisible, "a later page's question bound to {ordersTotal} is visible").toBe(true);
      expect(survey.getQuestionByName("cid0Orders").value).toBe(orders.filter((o: any) => o.customer === "cid0").length);
      const customers = survey.getQuestionByName("customers");
      expect(customers.panels[0].getQuestionByName("contactCount").value).toBe(fixture.data.customers[0].contacts.length);
      survey.setValue("orders", []);
      expect(bound.isVisible, "with no orders it is hidden").toBe(false);
    });
  }
  for (const key of ["expressions", "calculations", "complexLogic"]) {
    test("4. " + key + ": every expression parses and the linter finds nothing unplanned", () => {
      const fixture = getFixture(key);
      const list = collectExpressions(fixture.json);
      expect(list.length).toBeGreaterThan(0);
      const bad = list.filter((e: any) => !(e.isCondition ? new Survey.ConditionRunner(e.text) : new Survey.ExpressionRunner(e.text)).canRun());
      expect(bad.map((e: any) => e.path + ": " + e.text.substring(0, 80))).toEqual([]);
      const findings = lintSurvey(fixture.json).findings.filter((f: any) => f.severity === "error" || f.severity === "warning");
      const expected = fixture.meta.expectedLintFindings;
      expect(findings.map((f: any) => f.ruleId)).toEqual(expected.map((f: any) => f.ruleId));
      expected.forEach((f: any, i: number) => {
        if (f.names) f.names.forEach((name: string) => expect(findings[i].message).toContain("\"" + name + "\""));
      });
    });
  }
  test("5. calculations: the longest chain ends at the value computed by hand, and it is not constant", () => {
    const fixture = getFixture("calculations");
    const { survey } = loadQuietly(Survey, fixture.json);
    const longest = fixture.meta.chains.reduce((a: any, b: any): any => b.steps.length > a.steps.length ? b : a);
    expect(longest.steps.length).toBe(10);
    const last = longest.steps[longest.steps.length - 1].name;
    const atLoad = survey.getVariable(last);
    const values = fixture.meta.startValues;
    Object.keys(values).forEach((name: string) => survey.setValue(name, values[name]));
    let prev = 0;
    longest.steps.forEach((step: ChainStep) => {
      prev = computeChainStep(step, prev, step.kind === "start" || step.kind === "add" ? values[step.arg as string] : 0);
    });
    expect(survey.getVariable(last)).toBeCloseTo(prev, 6);
    expect(survey.getVariable(last), "the chain is not constant").not.toBe(atLoad);
    // The settling cycle settles at 3, 4, 3, off the chains.
    expect([survey.getVariable("cycA"), survey.getVariable("cycB"), survey.getVariable("cycC")]).toEqual([3, 4, 3]);
  });
  for (const key of ["expressions", "complexLogic"]) {
    test("6. " + key + ": the first answer changes the visibility of at least the planned elements", () => {
      const fixture = getFixture(key);
      const { survey } = loadQuietly(Survey, fixture.json);
      // Elements: questions and panels (a planned element may be a panel).
      const elements = (): Array<any> => survey.getAllQuestions(false).concat(survey.getAllPanels());
      const before = new Map<string, boolean>();
      elements().forEach((el: any) => before.set(el.name, el.isVisible));
      survey.setValue(fixture.meta.firstAnswer.name, fixture.meta.firstAnswer.value);
      let changed = 0;
      elements().forEach((el: any) => { if (before.get(el.name) !== el.isVisible) changed++; });
      const planned = fixture.meta.planned[0].hides;
      expect(planned).toBeGreaterThan(0);
      expect(changed).toBeGreaterThanOrEqual(planned);
      fixture.meta.plannedElements.forEach((name: string) => {
        const el = survey.getQuestionByName(name) || survey.getPanelByName(name);
        expect(el.isVisible, name).toBe(false);
      });
    });
  }
  test("8. TypeScript loading: node runs the smoke entry, esbuild bundles the fixtures for the browser", async() => {
    const res = spawnSync(process.execPath, [path.join(runnerRoot, "perf", "fixtures", "smoke.ts")], { encoding: "utf8" });
    expect(res.stderr).toBe("");
    expect(res.status).toBe(0);
    expect(res.stdout.trim().split("\n").map((line: string) => line.split(" ")[0])).toEqual([...FIXTURE_KEYS]);
    const esbuild = await import("esbuild");
    const out = await esbuild.build({ entryPoints: [path.join(runnerRoot, "perf", "fixtures", "index.ts")], bundle: true, platform: "browser",
      format: "iife", write: false, logLevel: "silent" });
    expect(out.errors).toEqual([]);
    expect(out.outputFiles[0].text).not.toMatch(/require\("node:|from "node:/);
  });
});

describe("PERF_EXTRA_JSON", () => {
  test("reads ;-separated paths with spaces, strips a BOM, names a duplicate basename -2, reports the path of a parse error", async() => {
    const fs = await import("node:fs");
    const os = await import("node:os");
    const { getExtraFixtures } = await import("./extra.ts");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "perf extra ("));
    fs.mkdirSync(path.join(dir, "b"));
    const a = path.join(dir, "My Survey (v2).json");
    const b = path.join(dir, "b", "My Survey (v2).json");
    fs.writeFileSync(a, String.fromCharCode(0xfeff) + JSON.stringify({ pages: [] }));
    fs.writeFileSync(b, JSON.stringify({ title: "x" }));
    const list = getExtraFixtures(a + ";" + b);
    expect(list.map((f: any) => f.key)).toEqual(["extra/My Survey (v2)", "extra/My Survey (v2)-2"]);
    expect(list[0].json).toEqual({ pages: [] });
    const bad = path.join(dir, "bad.json");
    fs.writeFileSync(bad, "{");
    expect(() => getExtraFixtures(bad)).toThrow(bad);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
