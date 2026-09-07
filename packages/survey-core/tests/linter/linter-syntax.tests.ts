import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";

describe("expression/syntax", () => {
  test("parse error is reported with an offset", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1", visibleIf: "{q2} = " }],
    });
    const findings = res.findings.filter(f => f.ruleId === "expression/syntax");
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("error");
    expect(typeof findings[0].messageData.at).toBe("number");
  });
  test("other expression rules skip an unparseable site", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1", visibleIf: "{totallyMissing} = " }],
    });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
    expect(res.findings.filter(f => f.ruleId === "expression/syntax")).toHaveLength(1);
  });
  test("valid expressions produce no syntax findings", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "({q1} notempty) and ({q1} != 'x') or (1 > 2)" },
      ],
    });
    expect(res.findings.filter(f => f.ruleId === "expression/syntax")).toHaveLength(0);
  });
  test("synthesized legacy trigger expression parse failure mentions the legacy form", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1" }],
      // "equals" inside the name is rewritten by the parser patches and breaks parsing,
      // exactly as it does at runtime
      triggers: [{ type: "complete", name: "q_equals", operator: "notempty" }],
    });
    const findings = res.findings.filter(f => f.ruleId === "expression/syntax");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.synthesized).toBe(true);
  });
});
