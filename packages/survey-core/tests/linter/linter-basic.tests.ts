import { describe, test, expect } from "vitest";
import { lintSurvey, renderFindings, getRules } from "../../src/linter/index";

describe("linter basics", () => {
  test("invalid input throws TypeError", () => {
    expect(() => lintSurvey(null)).toThrow(TypeError);
    expect(() => lintSurvey(<any>"{}")).toThrow(TypeError);
    expect(() => lintSurvey(<any>[])).toThrow(TypeError);
  });
  test("empty survey produces no findings", () => {
    const res = lintSurvey({});
    expect(res.findings).toHaveLength(0);
    expect(res.errorCount).toBe(0);
  });
  test("getRules returns registry", () => {
    const rules = getRules();
    expect(rules.length).toBeGreaterThan(10);
    expect(rules.some(r => r.id === "reference/unknown")).toBeTruthy();
  });
  test("unknown reference with suggestion", () => {
    const res = lintSurvey({
      pages: [{
        name: "page1",
        elements: [
          { type: "text", name: "hasInsurance" },
          { type: "text", name: "insuranceProvider", visibleIf: "{hasInsurnce} notempty" },
        ],
      }],
    });
    const finding = res.findings.filter(f => f.ruleId === "reference/unknown")[0];
    expect(finding).toBeDefined();
    expect(finding.severity).toBe("error");
    expect(finding.path).toBe("pages[0].elements[1].visibleIf");
    expect(finding.suggestion).toBe("hasInsurance");
    expect(finding.elementName).toBe("insuranceProvider");
  });
  test("clean survey with valid references", () => {
    const res = lintSurvey({
      elements: [
        { type: "radiogroup", name: "q1", choices: ["a", "b"] },
        { type: "text", name: "q2", visibleIf: "{q1} = 'a'" },
      ],
    });
    expect(res.findings).toHaveLength(0);
  });
  test("renderFindings produces summary line", () => {
    const res = lintSurvey({ elements: [{ type: "text", name: "q1", visibleIf: "{nope} = 1" }] });
    const text = renderFindings(res);
    expect(text).toContain("ERROR  reference/unknown");
    expect(text).toContain("at elements[0].visibleIf");
    expect(text).toContain("1 error, 0 warnings, 0 info");
  });
});
