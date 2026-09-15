import { describe, test, expect } from "vitest";
import { applyFix, ILintFinding, ILintFix, lintSurvey, SurveyLintFixReasons } from "../../src/linter/index";

function findingOf(json: any, ruleId: string): ILintFinding {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId)[0];
}

describe("applyFix", () => {
  test("set writes a value, and a key the object does not have yet", () => {
    const json = { elements: [{ type: "text", name: "q1" }] };
    const fix: ILintFix = { reason: "any", edits: [{ op: "set", path: "elements[0].title", value: "T" }] };
    expect(applyFix(json, fix).elements[0]).toEqual({ type: "text", name: "q1", title: "T" });
    expect(json.elements[0]).toEqual({ type: "text", name: "q1" });
  });
  test("wrap turns the value into a one-item array", () => {
    const json = { pages: [{ name: "p1", elements: { type: "text", name: "q1" } }] };
    const fix: ILintFix = { reason: "any", edits: [{ op: "wrap", path: "pages[0].elements" }] };
    expect(applyFix(json, fix).pages[0].elements).toEqual([{ type: "text", name: "q1" }]);
  });
  test("remove drops a key of an object and splices an item of an array", () => {
    const json = { elements: [{ type: "text", name: "q1", nosuch: 1 }, { type: "text", name: "q2" }] };
    const dropKey: ILintFix = { reason: "any", edits: [{ op: "remove", path: "elements[0].nosuch" }] };
    expect(applyFix(json, dropKey).elements[0]).toEqual({ type: "text", name: "q1" });
    const dropItem: ILintFix = { reason: "any", edits: [{ op: "remove", path: "elements[1]" }] };
    expect(applyFix(json, dropItem).elements).toHaveLength(1);
    expect(json.elements).toHaveLength(2);
  });
  test("rename keeps the key where it was written", () => {
    const json = { elements: [{ type: "text", name: "q1", titel: "T", description: "d" }] };
    const fix: ILintFix = { reason: "any", edits: [{ op: "rename", path: "elements[0].titel", key: "title" }] };
    expect(Object.keys(applyFix(json, fix).elements[0])).toEqual(["type", "name", "title", "description"]);
  });
  test("everything the edit does not touch is shared with the input", () => {
    const json: any = { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] };
    const fix: ILintFix = { reason: "any", edits: [{ op: "set", path: "elements[0].title", value: "T" }] };
    const fixed = applyFix(json, fix);
    expect(fixed).not.toBe(json);
    expect(fixed.elements[1]).toBe(json.elements[1]);
  });
  test("a path that resolves to nothing leaves the document alone", () => {
    const json = { elements: [{ type: "text", name: "q1" }] };
    const fix: ILintFix = { reason: "any", edits: [{ op: "remove", path: "elements[3].name" }] };
    expect(applyFix(json, fix)).toBe(json);
  });
  test("a survey JSON is required, the way lintSurvey requires one", () => {
    const fix: ILintFix = { reason: "any", edits: [{ op: "remove", path: "title" }] };
    expect(() => applyFix(<any>"{}", fix)).toThrow(TypeError);
  });
});

describe("property/not-an-array fix", () => {
  test("a single object written for an array is wrapped", () => {
    const json = { pages: [{ name: "p1", elements: { type: "text", name: "q1" } }] };
    const finding = findingOf(json, "property/not-an-array");
    expect(finding.fix).toEqual({
      reason: SurveyLintFixReasons["property/not-an-array"].wrapInArray,
      edits: [{ op: "wrap", path: "pages[0].elements" }],
    });
    const fixed = applyFix(json, finding.fix);
    expect(fixed.pages[0].elements).toEqual([{ type: "text", name: "q1" }]);
    expect(lintSurvey(fixed).findings.filter(f => f.ruleId === "property/not-an-array")).toHaveLength(0);
  });
  test("a scalar written for an array is wrapped too", () => {
    const json = { elements: [{ type: "checkbox", name: "q1", choices: "a" }] };
    const finding = findingOf(json, "property/not-an-array");
    expect(finding.fix.edits).toEqual([{ op: "wrap", path: "elements[0].choices" }]);
    expect(applyFix(json, finding.fix).elements[0].choices).toEqual(["a"]);
  });
});
