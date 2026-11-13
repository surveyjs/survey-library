import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";
import { SurveyModel } from "../../src/survey";
import { withSettings } from "./lint-test-helpers";

function byRule(json: any, ruleId = "expression/type-mismatch"): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId);
}

describe("expression/type-mismatch - ordering operators", () => {
  test("ordering on a checkbox (array) is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "checkbox", name: "tags", choices: ["a"] },
        { type: "text", name: "q2", visibleIf: "{tags} > 3" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("non-scalar");
  });
  test("ordering on a plain text question is flagged per spec", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} > 3" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].messageData.reason).toBe("text-ordering");
    expect(findings[0].suggestion).toContain("inputType");
  });
  test("ordering on inputType number is clean", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "text", name: "q2", visibleIf: "{q1} > 3" },
      ],
    })).toHaveLength(0);
  });
  test("ordering on rating is clean", () => {
    expect(byRule({
      elements: [
        { type: "rating", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} >= 4" },
      ],
    })).toHaveLength(0);
  });
  test("date input compared to a date string is clean, to a number flagged", () => {
    const base = {
      elements: [
        { type: "text", name: "birth", inputType: "date" },
        { type: "text", name: "q2", visibleIf: "{birth} < '2007-01-01'" },
      ],
    };
    expect(byRule(base)).toHaveLength(0);
    const bad = JSON.parse(JSON.stringify(base));
    bad.elements[1].visibleIf = "{birth} < 2007";
    expect(byRule(bad)).toHaveLength(1);
  });
  test("ordering on boolean is flagged", () => {
    expect(byRule({
      elements: [
        { type: "boolean", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} > 0" },
      ],
    })).toHaveLength(1);
  });
  test("arithmetic says arithmetic, not ordering", () => {
    const findings = byRule({
      elements: [
        { type: "boolean", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} + 1 > 2" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("boolean-ordering");
    expect(findings[0].message).toContain("not a number to compute with");
    expect(findings[0].message).not.toContain("ordering operators do not apply");
  });
  test("ordering on html (no value) is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "html", name: "banner" },
        { type: "text", name: "q2", visibleIf: "{banner} > 0" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("no-value");
  });
});

describe("expression/type-mismatch - equality", () => {
  test("boolean vs string constant is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "boolean", name: "agree" },
        { type: "text", name: "q2", visibleIf: "{agree} = 'yes'" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("boolean-vs-const");
  });
  test("boolean vs true/false is clean", () => {
    expect(byRule({
      elements: [
        { type: "boolean", name: "agree" },
        { type: "text", name: "q2", visibleIf: "{agree} = true" },
      ],
    })).toHaveLength(0);
  });
  test("boolean with valueTrue/valueFalse vs custom string is clean", () => {
    expect(byRule({
      elements: [
        { type: "boolean", name: "agree", valueTrue: "yes", valueFalse: "no" },
        { type: "text", name: "q2", visibleIf: "{agree} = 'yes'" },
      ],
    })).toHaveLength(0);
  });
  test("checkbox = scalar suggests contains/anyof", () => {
    const findings = byRule({
      elements: [
        { type: "checkbox", name: "tags", choices: ["a", "b"] },
        { type: "text", name: "q2", visibleIf: "{tags} = 'a'" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toContain("anyof");
  });
  test("empty-string comparison is never flagged", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "tags", choices: ["a"] },
        { type: "text", name: "q2", visibleIf: "{tags} = ''" },
      ],
    })).toHaveLength(0);
  });
});

describe("expression/type-mismatch - guards", () => {
  test("variable vs variable is never flagged", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "a", choices: ["x"] },
        { type: "checkbox", name: "b", choices: ["x"] },
        { type: "text", name: "q2", visibleIf: "{a} = {b}" },
      ],
    })).toHaveLength(0);
  });
  test("function results are never flagged", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "tags", choices: ["x"] },
        { type: "text", name: "q2", visibleIf: "count({tags}) > 3" },
      ],
    })).toHaveLength(0);
  });
  test("unknown question types are never flagged", () => {
    expect(byRule({
      elements: [
        { type: "customwidget", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} > 3" },
      ],
    })).toHaveLength(0);
  });
  test("expression sites (non-condition) are not checked", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1" },
        { type: "expression", name: "e1", expression: "{q1} + 1" },
      ],
    })).toHaveLength(0);
  });
  test("empty/notempty are never flagged", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "tags", choices: ["x"] },
        { type: "text", name: "q2", visibleIf: "{tags} notempty" },
      ],
    })).toHaveLength(0);
  });
  test("{row.col} type is taken from the column cellType", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [
          { name: "tags", cellType: "checkbox", choices: ["a"] },
          { name: "note", cellType: "text", visibleIf: "{row.tags} > 2" },
        ],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("non-scalar");
  });
});

describe("expression/type-mismatch - indexed and sub-path references", () => {
  test("indexed element access is not typed as the whole container", () => {
    // runtime evaluates {q1[0]} to the first selected value, a scalar
    expect(byRule({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3] },
        { type: "text", name: "q2", visibleIf: "{q1[0]} = 1" },
      ],
    })).toHaveLength(0);
    expect(byRule({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3] },
        { type: "text", name: "q2", visibleIf: "{q1[0]} > 5" },
      ],
    })).toHaveLength(0);
  });
  test("an unknown sub-path adds no type warning on top of reference/unknown", () => {
    const res = lintSurvey({
      elements: [
        { type: "multipletext", name: "mt", items: [{ name: "a" }] },
        { type: "text", name: "q2", visibleIf: "{mt.badItem} > 5" },
      ],
    });
    expect(res.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(1);
    expect(res.findings.filter(f => f.ruleId === "expression/type-mismatch")).toHaveLength(0);
  });
  test("whole-container comparisons are still flagged", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "q1", choices: ["a"] },
        { type: "text", name: "q2", visibleIf: "{q1} = 'a'" },
      ],
    })).toHaveLength(1);
    expect(byRule({
      elements: [
        { type: "multipletext", name: "mt", items: [{ name: "a" }] },
        { type: "text", name: "q2", visibleIf: "{mt} > 5" },
      ],
    })).toHaveLength(1);
  });
});

describe("expression/type-mismatch - matrix and panel sub-paths", () => {
  test("a numeric template question compared to a string is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "paneldynamic", name: "p5", templateElements: [
          { type: "text", name: "age", inputType: "number" },
        ] },
        { type: "text", name: "q4", visibleIf: "{p5[0].age} > 'ten'" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("number-vs-string");
  });
  test("a checkbox column compared to a scalar is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "matrixdropdown", name: "m8", rows: ["r1"],
          columns: [{ name: "tags", cellType: "checkbox", choices: ["a", "b"] }] },
        { type: "text", name: "q2", visibleIf: "{m8.r1.tags} = 'a'" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("array-vs-scalar");
  });
  test("an indexed single-segment reference stays untyped", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "tags", choices: ["a", "b"] },
        { type: "text", name: "q2", visibleIf: "{tags[0]} = 'a'" },
      ],
    })).toHaveLength(0);
  });
});

describe("expression/type-mismatch - scope index variables", () => {
  test("{rowIndex} compared to a string is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "matrixdynamic", name: "m10", columns: [
          { name: "col1" },
          { name: "col2", visibleIf: "{rowIndex} = 'first'" },
        ] },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("number-vs-string");
  });
  test("{visiblePanelIndex} compared to a number is clean", () => {
    expect(byRule({
      elements: [
        { type: "paneldynamic", name: "p6", templateElements: [
          { type: "text", name: "q", visibleIf: "{visiblePanelIndex} = 2" },
        ] },
      ],
    })).toHaveLength(0);
  });
});

// The runtime comparison converts values, so a constant of another type is only reported when no
// value of the question can equal it. Each row checks the linter against SurveyModel.
describe("expression/type-mismatch - a constant the runtime converts", () => {
  function check(type: string, expression: string, value: any): { visible: boolean, findings: number } {
    const extra = type === "text" ? { inputType: "number" } : {};
    const json = {
      elements: [
        { type: type, name: "c", ...extra },
        { type: "text", name: "q2", visibleIf: expression },
      ],
    };
    const survey = new SurveyModel(json);
    survey.setValue("c", value);
    return { visible: survey.getQuestionByName("q2").isVisible, findings: byRule(json).length };
  }
  test.each([
    ["boolean", "{c} = 'true'", true],
    ["boolean", "{c} <> 'true'", false],
    ["boolean", "{c} = 'TRUE'", true],
    ["boolean", "{c} = 1", true],
    ["boolean", "{c} = 0", false],
    ["text", "{c} = '5'", 5],
    ["text", "{c} = '5.0'", 5],
    ["rating", "{c} = '3'", 3],
    ["text", "{c} > '3'", 5],
  ])("%s %s with %s holds at runtime and is clean", (type, expression, value) => {
    expect(check(type, expression, value)).toEqual({ visible: true, findings: 0 });
  });
  test.each([
    ["boolean", "{c} = 'yes'", true],
    ["text", "{c} = 'abc'", 5],
    ["text", "{c} = '1,5'", 1.5],
    ["text", "{c} > '1,5'", 5],
  ])("%s %s with %s cannot hold at runtime and is reported", (type, expression, value) => {
    expect(check(type, expression, value)).toEqual({ visible: false, findings: 1 });
  });
  test("{c} = 'TRUE' holds with comparator.caseSensitive too", () => {
    withSettings({ "comparator.caseSensitive": true }, () => {
      expect(check("boolean", "{c} = 'TRUE'", true)).toEqual({ visible: true, findings: 0 });
    });
  });
  test("with comparator.strictEquality, {c} = 1 and {c} = 0 cannot hold and are reported", () => {
    withSettings({ "comparator.strictEquality": true }, () => {
      expect(check("boolean", "{c} = 1", true)).toEqual({ visible: false, findings: 1 });
      expect(check("boolean", "{c} = 0", false)).toEqual({ visible: false, findings: 1 });
    });
  });
  test("{n} + '3' joins strings at runtime and is still reported", () => {
    const json = {
      elements: [
        { type: "text", name: "n", inputType: "number" },
        { type: "expression", name: "e", expression: "{n} + '3'" },
      ],
    };
    const survey = new SurveyModel(json);
    survey.setValue("n", 5);
    expect(survey.getQuestionByName("e").value).toBe("53");
    const findings = byRule(json);
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("number-vs-string");
  });
});
