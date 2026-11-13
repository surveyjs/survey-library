import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "property/dead");
}

describe("property/dead - properties dropped on save", () => {
  test("a survey property that is not serializable is flagged", () => {
    const findings = byRule({ mode: "display", elements: [{ type: "text", name: "q1" }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("notSerializable");
    expect(findings[0].severity).toBe("info");
    expect(findings[0].path).toBe("mode");
    expect(findings[0].messageData.key).toBe("mode");
  });
  test("a property suppressed on its own question type is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "expression", name: "e1", expression: "1+1", correctAnswer: 2 },
        { type: "ranking", name: "r1", choices: ["a", "b"], showOtherItem: true },
      ],
    });
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.messageData.key).sort()).toEqual(["correctAnswer", "showOtherItem"]);
  });
  test("the same property stays clean on a type that keeps it", () => {
    expect(byRule({
      elements: [
        { type: "dropdown", name: "q1", choices: ["a"], correctAnswer: "a" },
        { type: "checkbox", name: "q2", choices: ["a"], showOtherItem: true },
      ],
    })).toHaveLength(0);
  });
});

describe("property/dead - a property written under two keys", () => {
  test("a canonical name next to its alias is flagged, naming the winner", () => {
    const findings = byRule({
      elements: [{
        type: "checkbox", name: "q1", choices: ["a", "b"], showOtherItem: true, hasOther: false,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("aliasDuplicate");
    expect(findings[0].messageData.winner).toBe("hasOther");
    expect(findings[0].related.map(r => r.path).sort())
      .toEqual(["elements[0].hasOther", "elements[0].showOtherItem"]);
  });
  test("the winner follows the order of the keys", () => {
    const findings = byRule({
      elements: [{ type: "checkbox", name: "q1", choices: ["a"], hasOther: false, showOtherItem: true }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.winner).toBe("showOtherItem");
  });
  test("the survey elements array under both keys is flagged once", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }],
      questions: [{ type: "text", name: "q2" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("aliasDuplicate");
  });
  test("either key alone is clean", () => {
    expect(byRule({
      questions: [{ type: "checkbox", name: "q1", choices: ["a"], hasOther: true }],
    })).toHaveLength(0);
  });
});

describe("property/dead - bounds an inputType does not have", () => {
  test("min and max on a plain text question are flagged", () => {
    const findings = byRule({ elements: [{ type: "text", name: "q1", min: 1, max: 99 }] });
    expect(findings).toHaveLength(2);
    expect(findings[0].reason).toBe("inertMinMax");
    expect(findings.map(f => f.messageData.key).sort()).toEqual(["max", "min"]);
    expect(findings[0].messageData.inputType).toBe("text");
  });
  test("a step outside a numeric inputType is flagged", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", inputType: "email", step: 2 }],
    })).toHaveLength(1);
  });
  test("bounds on an inputType that has them are clean", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", inputType: "number", min: 1, max: 5, step: 2 },
        { type: "text", name: "q2", inputType: "date", min: "2020-01-01", max: "2025-01-01" },
      ],
    })).toHaveLength(0);
  });
  test("a matrix column and a multipletext item are checked too", () => {
    const findings = byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1", cellType: "text", min: 1 }] },
        { type: "multipletext", name: "mt1", items: [{ name: "i1", max: 5 }] },
      ],
    });
    expect(findings).toHaveLength(2);
  });
  test("a slider keeps its own min and max", () => {
    expect(byRule({ elements: [{ type: "slider", name: "s1", min: 0, max: 10 }] })).toHaveLength(0);
  });
});

describe("property/dead - configuration", () => {
  test("the rule can be raised to a warning", () => {
    const result = lintSurvey(
      { mode: "display", elements: [{ type: "text", name: "q1" }] },
      { rules: { "property/dead": "warning" } });
    const findings = result.findings.filter(f => f.ruleId === "property/dead");
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("warning");
  });
});
