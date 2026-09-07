import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "property/invalid-value");
}

describe("property/invalid-value - values outside the allowed set", () => {
  test("a misspelled enum value is flagged with a suggestion", () => {
    const findings = byRule({ elements: [{ type: "text", name: "q1", titleLocation: "topp" }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("notInChoices");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].path).toBe("elements[0].titleLocation");
    expect(findings[0].suggestion).toBe("top");
    expect(findings[0].messageData.value).toBe("topp");
    expect(findings[0].messageData.allowed).toContain("top");
  });
  test("a value that differs only in case is flagged with the right spelling", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", clearIfInvisible: "OnHidden" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("onHidden");
  });
  test("a survey-level enum is checked", () => {
    expect(byRule({
      progressBarType: "nosuchbar", elements: [{ type: "text", name: "q1" }],
    })).toHaveLength(1);
  });
  test("an unknown cellType of a matrix column is flagged", () => {
    const findings = byRule({
      elements: [{ type: "matrixdynamic", name: "m1", columns: [{ name: "c1", cellType: "nosuch" }] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].columns[0].cellType");
  });
  test("allowed values stay clean", () => {
    expect(byRule({
      progressBarType: "pages", showQuestionNumbers: "off",
      elements: [
        { type: "text", name: "q1", titleLocation: "left", clearIfInvisible: "onHidden" },
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1", cellType: "dropdown" }] },
      ],
    })).toHaveLength(0);
  });
  test("free-form values are not checked against anything", () => {
    expect(byRule({
      elements: [
        { type: "dropdown", name: "q1", choices: ["a"], defaultValue: "zzz" },
        { type: "text", name: "q2", title: "Anything goes" },
      ],
    })).toHaveLength(0);
  });
});

describe("property/invalid-value - numbers outside their range", () => {
  test("a value below the registered minimum is flagged", () => {
    const findings = byRule({
      elements: [{ type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }], rowCount: -1 }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("outOfRange");
    expect(findings[0].messageData.min).toBe(0);
  });
  test("a value above the registered maximum is flagged", () => {
    const findings = byRule({
      backgroundOpacity: 5, elements: [{ type: "text", name: "q1" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.max).toBe(1);
  });
  test("a value inside the range is clean", () => {
    expect(byRule({
      backgroundOpacity: 0.5,
      elements: [{ type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }], rowCount: 3 }],
    })).toHaveLength(0);
  });
});

describe("property/invalid-value - a valueName that is read as a path", () => {
  test("a dotted valueName is flagged", () => {
    const findings = byRule({ elements: [{ type: "text", name: "q1", valueName: "user.email" }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("valueNameDotted");
    expect(findings[0].messageData.valueName).toBe("user.email");
  });
  test("a plain valueName is clean", () => {
    expect(byRule({ elements: [{ type: "text", name: "q1", valueName: "email" }] })).toHaveLength(0);
  });
});

describe("property/invalid-value - configuration", () => {
  test("the rule can be switched off", () => {
    const result = lintSurvey(
      { elements: [{ type: "text", name: "q1", titleLocation: "topp" }] },
      { rules: { "property/invalid-value": "off" } });
    expect(result.findings.filter(f => f.ruleId === "property/invalid-value")).toHaveLength(0);
  });
});
