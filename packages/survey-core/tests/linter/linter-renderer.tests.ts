import { describe, test, expect } from "vitest";
import { lintSurvey, renderFindings } from "../../src/linter/index";

describe("renderFindings", () => {
  test("renders a finding block in the spec format", () => {
    const res = lintSurvey({
      pages: [{
        name: "p1",
        elements: [
          { type: "text", name: "hasInsurance" },
          { type: "text", name: "insuranceProvider", visibleIf: "{hasInsurnce} notempty" },
        ],
      }],
    });
    const text = renderFindings(res);
    expect(text).toContain("ERROR  reference/unknown");
    expect(text).toContain("Did you mean \"hasInsurance\"?");
    expect(text).toContain("visibleIf: {hasInsurnce} notempty");
    expect(text).toContain("at pages[0].elements[1].visibleIf");
    expect(text).toContain("No case: the reference cannot be evaluated.");
    expect(text).toContain("1 error, 0 warnings, 0 info");
  });
  test("renders reproduction steps as JSON", () => {
    const res = lintSurvey({
      pages: [{
        elements: [
          { type: "radiogroup", name: "satisfaction", choices: ["low", "medium", "high"] },
          { type: "comment", name: "followUp", visibleIf: "{satisfaction} = 'poor'" },
        ],
      }],
    });
    const text = renderFindings(res);
    expect(text).toContain("WARN  expression/unknown-choice");
    expect(text).toContain("Reproduction:");
    expect(text).toContain("\"set\"");
    expect(text).toContain("\"satisfaction\": \"low\"");
  });
  test("renders related paths for cycles", () => {
    const res = lintSurvey({
      calculatedValues: [
        { name: "a", expression: "{b} + 1" },
        { name: "b", expression: "{a} + 1" },
      ],
    });
    const text = renderFindings(res);
    expect(text).toContain("related: calculatedValues[0].expression, calculatedValues[1].expression");
  });
  test("summary reports suppressed count", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1", visibleIf: "{missing} = 1" }],
    }, { suppress: [{ ruleId: "reference/unknown" }] });
    const text = renderFindings(res);
    expect(text).toContain("(1 suppressed)");
  });
  test("accepts a plain findings array", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1", visibleIf: "{missing} = 1" }],
    });
    const text = renderFindings(res.findings);
    expect(text).toContain("ERROR  reference/unknown");
  });
  test("includeSuppressed appends suppressed findings", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1", visibleIf: "{missing} = 1" }],
    }, { suppress: [{ ruleId: "reference/unknown" }], reportSuppressed: true });
    const text = renderFindings(res, { includeSuppressed: true });
    expect(text).toContain("ERROR  reference/unknown");
  });
});
