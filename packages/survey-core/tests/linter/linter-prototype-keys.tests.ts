import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";
import { CIMap, CIMultiMap } from "../../src/linter/symbols";
import { findCycles } from "../../src/linter/graph";

// Names like "constructor", "__proto__" or "hasOwnProperty" are valid element names
// in survey JSON, but collide with Object.prototype keys when maps are backed by
// plain object literals. These tests pin that user-controlled names never leak
// into the prototype chain.
describe("linter prototype-key safety", () => {
  test("CIMap does not see Object.prototype keys as entries", () => {
    const map = new CIMap<number>();
    expect(map.has("constructor")).toBe(false);
    expect(map.has("toString")).toBe(false);
    expect(map.get("constructor")).toBeUndefined();
    map.set("constructor", 1);
    map.set("__proto__", 2);
    expect(map.get("constructor")).toBe(1);
    expect(map.get("__proto__")).toBe(2);
    expect(map.size).toBe(2);
    expect(map.names()).toEqual(["constructor", "__proto__"]);
  });
  test("CIMultiMap does not see Object.prototype keys as entries", () => {
    const map = new CIMultiMap<string>();
    expect(map.has("constructor")).toBe(false);
    expect(map.get("hasOwnProperty")).toEqual([]);
    map.add("constructor", "a");
    map.add("Constructor", "b");
    map.add("__proto__", "c");
    expect(map.get("constructor")).toEqual(["a", "b"]);
    expect(map.first("__proto__")).toBe("c");
    expect(map.names()).toEqual(["constructor", "__proto__"]);
  });
  test("question named 'constructor' lints and resolves references", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "constructor" },
        { type: "text", name: "q2", visibleIf: "{constructor} notempty" },
      ],
    });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
    expect(res.findings.filter(f => f.ruleId === "name/duplicate")).toHaveLength(0);
  });
  test("question named '__proto__' lints without crashing", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "__proto__" },
        { type: "text", name: "q2", visibleIf: "{__proto__} notempty" },
      ],
    });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
  });
  test("calculated value named 'constructor' is not a false duplicate", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "constructor", expression: "{q1} + 1" }],
    });
    expect(res.findings.filter(f => f.ruleId === "name/duplicate")).toHaveLength(0);
  });
  test("element type 'constructor' is reported as unknown, not dispatched as a panel", () => {
    const res = lintSurvey({ elements: [{ type: "constructor", name: "q1" }] });
    const unknown = res.findings.filter(f => f.ruleId === "element/unknown-type");
    expect(unknown).toHaveLength(1);
    expect(unknown[0].elementName).toBe("q1");
    expect(res.findings.filter(f => f.ruleId === "page/empty")).toHaveLength(0);
    // options.components is a caller-supplied plain object: inherited keys are not components
    const resWithComponents = lintSurvey(
      { elements: [{ type: "constructor", name: "q1" }] },
      { components: {} });
    expect(resWithComponents.findings.filter(f => f.ruleId === "element/unknown-type")).toHaveLength(1);
  });
  test("trigger type 'constructor' lints without crashing", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "constructor", expression: "{q1} = 1" }],
    });
    expect(res.findings.filter(f => f.ruleId === "cycle/trigger")).toHaveLength(0);
  });
  test("findCycles visits a node named 'constructor'", () => {
    const cycles = findCycles(["constructor", "x"],
      node => node.toLowerCase() === "constructor" ? ["x"] : ["constructor"]);
    expect(cycles).toHaveLength(1);
    expect(cycles[0]).toEqual(["constructor", "x"]);
  });
});
