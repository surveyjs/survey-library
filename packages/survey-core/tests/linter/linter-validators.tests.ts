import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any, ruleId: string): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId);
}

function unknownType(json: any): Array<ILintFinding> {
  return byRule(json, "validator/unknown-type");
}

describe("validator/unknown-type", () => {
  test("a misspelled validator type is flagged with a suggestion", () => {
    const findings = unknownType({
      elements: [{
        type: "text", name: "q1", inputType: "number",
        validators: [{ type: "numberic", minValue: 1, maxValue: 10 }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("unknownType");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].suggestion).toBe("numeric");
    expect(findings[0].path).toBe("elements[0].validators[0]");
  });
  test("a validator without a type is flagged", () => {
    const findings = unknownType({
      elements: [{ type: "text", name: "q1", validators: [{ minValue: 1 }] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("noType");
  });
  test("both the short and the full class name are accepted", () => {
    expect(unknownType({
      elements: [{
        type: "text", name: "q1", inputType: "number",
        validators: [{ type: "numeric", minValue: 1 }, { type: "numericvalidator", minValue: 1 }],
      }],
    })).toHaveLength(0);
  });
  test("validators of a matrix column and a multipletext item are checked", () => {
    const findings = unknownType({
      elements: [
        {
          type: "matrixdynamic", name: "m1",
          columns: [{ name: "c1", validators: [{ type: "nosuch" }] }],
        },
        { type: "multipletext", name: "mt1", items: [{ name: "i1", validators: [{ type: "nosuch" }] }] },
      ],
    });
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.path).sort())
      .toEqual(["elements[0].columns[0].validators[0]", "elements[1].items[0].validators[0]"]);
  });
  test("every registered validator type stays clean", () => {
    expect(unknownType({
      elements: [
        { type: "text", name: "q1", validators: [{ type: "expression", expression: "{q1} > 1" }] },
        { type: "comment", name: "q2", validators: [{ type: "text", minLength: 2 }] },
        { type: "text", name: "q3", inputType: "email", validators: [{ type: "email" }] },
        { type: "checkbox", name: "q4", choices: ["a", "b"], validators: [{ type: "answercount", minCount: 1 }] },
        { type: "text", name: "q5", validators: [{ type: "regex", regex: "^a" }] },
      ],
    })).toHaveLength(0);
  });
});
