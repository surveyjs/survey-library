import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function findings(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "property/not-an-array");
}

describe("property/not-an-array", () => {
  test("a single element object written where the elements array belongs", () => {
    const res = findings({ pages: [{ name: "p1", elements: { type: "text", name: "q1" } }] });
    expect(res).toHaveLength(1);
    expect(res[0].path).toBe("pages[0].elements");
    expect(res[0].severity).toBe("warning");
    expect(res[0].reason).toBe("notAnArray");
    expect(res[0].messageData).toEqual({
      reason: "notAnArray", key: "elements", className: "page", name: "p1", valueType: "object",
    });
    expect(res[0].elementName).toBe("p1");
    expect(res[0].message).toContain("\"elements\"");
  });
  test("the key is reported as written - the legacy questions alias stays", () => {
    const res = findings({ pages: [{ questions: { type: "text", name: "q1" } }] });
    expect(res).toHaveLength(1);
    expect(res[0].path).toBe("pages[0].questions");
    expect(res[0].messageData.key).toBe("questions");
  });
  test("a scalar written where an array belongs is reported too - the runtime wraps it", () => {
    const res = findings({ elements: [{ type: "checkbox", name: "q1", choices: "a" }] });
    expect(res).toHaveLength(1);
    expect(res[0].path).toBe("elements[0].choices");
    expect(res[0].messageData.valueType).toBe("string");
  });
  test("a single column object and a single item object", () => {
    expect(findings({
      elements: [{ type: "matrixdynamic", name: "m1", columns: { name: "c1" } }],
    }).map(f => f.path)).toEqual(["elements[0].columns"]);
    expect(findings({
      elements: [{ type: "multipletext", name: "q1", items: { name: "i1" } }],
    }).map(f => f.path)).toEqual(["elements[0].items"]);
  });
  test("arrays, empty values and non-array properties are clean", () => {
    expect(findings({
      title: "t",
      pages: [{ name: "p1", elements: [{ type: "text", name: "q1", choices: [] }] }],
      triggers: [],
    })).toHaveLength(0);
    expect(findings({ elements: [{ type: "text", name: "q1", validators: null }] })).toHaveLength(0);
  });
  test("the wrapped element is still analysed", () => {
    const all = lintSurvey({
      pages: [
        { name: "p1", elements: { type: "text", name: "q1" } },
        { name: "p2", elements: [{ type: "text", name: "q1" }] },
      ],
    }).findings;
    expect(all.filter(f => f.ruleId === "page/empty")).toHaveLength(0);
    expect(all.filter(f => f.ruleId === "name/duplicate")).toHaveLength(1);
  });
});
