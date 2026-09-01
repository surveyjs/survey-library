import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any, ruleId: string): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId);
}

function unknownType(json: any): Array<ILintFinding> {
  return byRule(json, "validator/unknown-type");
}

function dead(json: any): Array<ILintFinding> {
  return byRule(json, "validator/dead");
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
  test("an unknown type is left to this rule alone", () => {
    expect(dead({
      elements: [{ type: "text", name: "q1", validators: [{ type: "nosuch", minValue: 5, maxValue: 1 }] }],
    })).toHaveLength(0);
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

describe("validator/dead - unsupported for the question", () => {
  test("a numeric validator on an array-valued question is flagged", () => {
    const findings = dead({
      elements: [{
        type: "checkbox", name: "q1", choices: [1, 2, 3],
        validators: [{ type: "numeric", minValue: 1 }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("unsupportedForQuestion");
    expect(findings[0].messageData.validatorType).toBe("numeric");
    expect(findings[0].messageData.questionType).toBe("checkbox");
  });
  test("an email validator needs the email inputType", () => {
    expect(dead({
      elements: [{
        type: "text", name: "q1", inputType: "number", validators: [{ type: "email" }],
      }],
    })).toHaveLength(1);
    expect(dead({
      elements: [{
        type: "text", name: "q1", inputType: "email", validators: [{ type: "email" }],
      }],
    })).toHaveLength(0);
  });
  test("a text validator needs a text-like inputType", () => {
    expect(dead({
      elements: [{
        type: "text", name: "q1", inputType: "number", validators: [{ type: "text", minLength: 2 }],
      }],
    })).toHaveLength(1);
  });
  test("an answercount validator needs a multi-select question", () => {
    expect(dead({
      elements: [{
        type: "radiogroup", name: "q1", choices: ["a"], validators: [{ type: "answercount", minCount: 1 }],
      }],
    })).toHaveLength(1);
  });
  test("a column is judged by its cell type", () => {
    const findings = dead({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [
          { name: "c1", cellType: "text", inputType: "number", validators: [{ type: "email" }] },
          { name: "c2", cellType: "text", inputType: "number", validators: [{ type: "numeric", minValue: 1 }] },
        ],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].columns[0].validators[0]");
  });
  test("a multipletext item is judged by its own inputType", () => {
    expect(dead({
      elements: [{
        type: "multipletext", name: "mt1",
        items: [{ name: "i1", inputType: "number", validators: [{ type: "email" }] }],
      }],
    })).toHaveLength(1);
  });
  test("an expression validator fits every question", () => {
    expect(dead({
      elements: [
        { type: "checkbox", name: "q1", choices: ["a"], validators: [{ type: "expression", expression: "1=1" }] },
        { type: "comment", name: "q2", validators: [{ type: "text", minLength: 2 }] },
      ],
    })).toHaveLength(0);
  });
  test("a custom component type is not judged", () => {
    const result = lintSurvey(
      { elements: [{ type: "mycomp", name: "q1", validators: [{ type: "numeric", minValue: 1 }] }] },
      { components: { mycomp: { questionJSON: { type: "text" } } } });
    expect(result.findings.filter(f => f.ruleId === "validator/dead")).toHaveLength(0);
  });
});

describe("validator/dead - unsatisfiable and inert settings", () => {
  test("a numeric validator with min above max is flagged", () => {
    const findings = dead({
      elements: [{
        type: "text", name: "q1", inputType: "number",
        validators: [{ type: "numeric", minValue: 100, maxValue: 10 }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minAboveMax");
    expect(findings[0].messageData.min).toBe(100);
  });
  test("a text validator with minLength above maxLength is flagged", () => {
    expect(dead({
      elements: [{ type: "comment", name: "q1", validators: [{ type: "text", minLength: 10, maxLength: 2 }] }],
    })).toHaveLength(1);
  });
  test("a zero length bound is switched off", () => {
    expect(dead({
      elements: [{ type: "comment", name: "q1", validators: [{ type: "text", minLength: 10, maxLength: 0 }] }],
    })).toHaveLength(0);
  });
  test("an answercount validator with min above max is flagged", () => {
    expect(dead({
      elements: [{
        type: "checkbox", name: "q1", choices: ["a", "b", "c"],
        validators: [{ type: "answercount", minCount: 3, maxCount: 2 }],
      }],
    })).toHaveLength(1);
  });
  test("an answercount minimum above the choices is flagged", () => {
    const findings = dead({
      elements: [{
        type: "checkbox", name: "q1", choices: ["a", "b"],
        validators: [{ type: "answercount", minCount: 3 }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minCountAboveChoices");
    expect(findings[0].messageData.selectable).toBe(2);
  });
  test("choices the JSON does not list leave the count undecided", () => {
    expect(dead({
      elements: [{
        type: "checkbox", name: "q1", choicesByUrl: { url: "https://example.com/c" },
        validators: [{ type: "answercount", minCount: 3 }],
      }],
    })).toHaveLength(0);
  });
  test("an invalid regex is flagged", () => {
    const findings = dead({
      elements: [{ type: "text", name: "q1", validators: [{ type: "regex", regex: "([0-9" }] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("invalidRegex");
  });
  test("a valid regex is clean", () => {
    expect(dead({
      elements: [{ type: "text", name: "q1", validators: [{ type: "regex", regex: "^[0-9]+$" }] }],
    })).toHaveLength(0);
  });
  test("an expression validator without an expression always passes", () => {
    const findings = dead({
      elements: [{ type: "text", name: "q1", validators: [{ type: "expression", text: "Must be positive" }] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("emptyExpression");
  });
  test("consistent validators stay clean", () => {
    expect(dead({
      elements: [
        {
          type: "text", name: "q1", inputType: "number",
          validators: [{ type: "numeric", minValue: 1, maxValue: 10 }],
        },
        {
          type: "checkbox", name: "q2", choices: ["a", "b", "c"],
          validators: [{ type: "answercount", minCount: 1, maxCount: 2 }],
        },
      ],
    })).toHaveLength(0);
  });
});
