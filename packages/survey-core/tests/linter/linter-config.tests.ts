import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";

const brokenSurvey = {
  elements: [
    { type: "text", name: "q1", visibleIf: "{missing} = 1" },
    { type: "chekbox", name: "q2" },
  ],
};

describe("linter configuration", () => {
  test("severity can be overridden per rule", () => {
    const res = lintSurvey(brokenSurvey, { rules: { "reference/unknown": "warning" } });
    const finding = res.findings.filter(f => f.ruleId === "reference/unknown")[0];
    expect(finding.severity).toBe("warning");
    expect(res.errorCount).toBe(0);
    expect(res.warningCount).toBe(1);
  });
  test("rules can be switched off", () => {
    const res = lintSurvey(brokenSurvey, {
      rules: { "reference/unknown": "off", "element/unknown-type": "off" },
    });
    expect(res.findings).toHaveLength(0);
  });
  test("suppression by ruleId and elementName", () => {
    const res = lintSurvey(brokenSurvey, {
      suppress: [{ ruleId: "reference/unknown", elementName: "q1" }],
    });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
    expect(res.suppressedCount).toBe(1);
  });
  test("suppression elementName match is case-insensitive", () => {
    const res = lintSurvey(brokenSurvey, {
      suppress: [{ ruleId: "reference/unknown", elementName: "Q1" }],
    });
    expect(res.suppressedCount).toBe(1);
  });
  test("suppression by exact path", () => {
    const res = lintSurvey(brokenSurvey, {
      suppress: [{ path: "elements[0].visibleIf" }],
    });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
  });
  test("suppression by path prefix with .*", () => {
    const res = lintSurvey({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "a", visibleIf: "{missing} = 1" }] },
        { name: "p2", elements: [{ type: "text", name: "b", visibleIf: "{missing} = 1" }] },
      ],
    }, { suppress: [{ path: "pages[0].*" }] });
    const remaining = res.findings.filter(f => f.ruleId === "reference/unknown");
    expect(remaining).toHaveLength(1);
    expect(remaining[0].path).toContain("pages[1]");
  });
  test("suppression by ruleId alone silences the rule everywhere", () => {
    const res = lintSurvey(brokenSurvey, { suppress: [{ ruleId: "reference/unknown" }] });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
    expect(res.findings.filter(f => f.ruleId === "element/unknown-type")).toHaveLength(1);
  });
  test("an empty suppression object matches nothing", () => {
    const res = lintSurvey(brokenSurvey, { suppress: [{}] });
    expect(res.findings.length).toBeGreaterThan(0);
    expect(res.suppressedCount).toBe(0);
  });
  test("reportSuppressed returns the suppressed findings", () => {
    const res = lintSurvey(brokenSurvey, {
      suppress: [{ ruleId: "reference/unknown" }],
      reportSuppressed: true,
    });
    expect(res.suppressed).toHaveLength(1);
    expect(res.suppressed[0].ruleId).toBe("reference/unknown");
  });
  test("counts add up by severity", () => {
    const res = lintSurvey(brokenSurvey);
    expect(res.errorCount).toBe(1);
    expect(res.infoCount).toBe(1);
    expect(res.errorCount + res.warningCount + res.infoCount).toBe(res.findings.length);
  });
  test("findings are sorted by path then ruleId", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "z", visibleIf: "{missing} = 1" },
        { type: "text", name: "a", enableIf: "{missing} = 1" },
      ],
    });
    const paths = res.findings.map(f => f.path);
    expect(paths).toEqual(paths.slice().sort());
  });
  test("input JSON is not mutated", () => {
    const survey = JSON.parse(JSON.stringify(brokenSurvey));
    const copy = JSON.parse(JSON.stringify(survey));
    lintSurvey(survey);
    expect(survey).toEqual(copy);
  });
});
