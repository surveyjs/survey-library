import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";
import { withSettings } from "./lint-test-helpers";

function byRule(json: any, ruleId: string): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId);
}

describe("expression/unknown-choice", () => {
  const satisfactionSurvey = (visibleIf: string) => ({
    pages: [{
      elements: [
        { type: "radiogroup", name: "satisfaction", choices: ["low", "medium", "high"] },
        { type: "comment", name: "followUp", visibleIf: visibleIf },
      ],
    }],
  });
  test("comparing to a value not among choices, with reproduction", () => {
    const findings = byRule(satisfactionSurvey("{satisfaction} = 'poor'"), "expression/unknown-choice");
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].messageData.values).toEqual(["poor"]);
    expect(findings[0].messageData.available).toEqual(["low", "medium", "high"]);
    const steps = findings[0].reproduction.steps;
    expect(steps[0]).toEqual({ set: { satisfaction: "low" } });
    expect(steps[steps.length - 1]).toEqual({ expect: { visible: { followUp: true } } });
  });
  test("typo gets a closest-choice suggestion", () => {
    const findings = byRule(satisfactionSurvey("{satisfaction} = 'lw'"), "expression/unknown-choice");
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("low");
  });
  test("valid choice comparison is clean", () => {
    expect(byRule(satisfactionSurvey("{satisfaction} = 'high'"), "expression/unknown-choice")).toHaveLength(0);
  });
  test("numeric coercion: '2' matches numeric choices", () => {
    expect(byRule({
      elements: [
        { type: "dropdown", name: "q1", choices: [1, 2, 3] },
        { type: "text", name: "q2", visibleIf: "{q1} = '2'" },
      ],
    }, "expression/unknown-choice")).toHaveLength(0);
  });
  test("anyof flags only the missing members", () => {
    const findings = byRule(satisfactionSurvey("{satisfaction} anyof ['low', 'poor']"), "expression/unknown-choice");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.values).toEqual(["poor"]);
  });
  test("anyof against a constant array reference reads its members", () => {
    // a reference folding to an array must compare member-by-member, not as
    // one array-valued constant that never equals any single choice
    expect(byRule({
      elements: [
        { type: "radiogroup", name: "satisfaction", choices: ["low", "medium", "high"] },
        { type: "comment", name: "followUp", visibleIf: "{satisfaction} anyof {goodOnes}" },
      ],
      calculatedValues: [{ name: "goodOnes", expression: "['low', 'medium']" }],
    }, "expression/unknown-choice")).toHaveLength(0);
  });
  test("anyof against a constant array reference still flags a missing member", () => {
    const findings = byRule({
      elements: [
        { type: "radiogroup", name: "satisfaction", choices: ["low", "medium", "high"] },
        { type: "comment", name: "followUp", visibleIf: "{satisfaction} anyof {mixed}" },
      ],
      calculatedValues: [{ name: "mixed", expression: "['low', 'poor']" }],
    }, "expression/unknown-choice");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.values).toEqual(["poor"]);
  });
  test("contains against checkbox choices is checked", () => {
    const findings = byRule({
      elements: [
        { type: "checkbox", name: "tags", choices: ["red", "green"] },
        { type: "text", name: "q2", visibleIf: "{tags} contains 'blue'" },
      ],
    }, "expression/unknown-choice");
    expect(findings).toHaveLength(1);
  });
  test("showOtherItem allows 'other'", () => {
    expect(byRule({
      elements: [
        { type: "radiogroup", name: "q1", choices: ["a"], showOtherItem: true },
        { type: "text", name: "q2", visibleIf: "{q1} = 'other'" },
      ],
    }, "expression/unknown-choice")).toHaveLength(0);
  });
  test("showNoneItem allows 'none'", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "q1", choices: ["a"], showNoneItem: true },
        { type: "text", name: "q2", visibleIf: "{q1} contains 'none'" },
      ],
    }, "expression/unknown-choice")).toHaveLength(0);
  });
  test("choicesByUrl skips the check", () => {
    expect(byRule({
      elements: [
        { type: "dropdown", name: "q1", choicesByUrl: { url: "https://x/y" } },
        { type: "text", name: "q2", visibleIf: "{q1} = 'whatever'" },
      ],
    }, "expression/unknown-choice")).toHaveLength(0);
  });
  test("carry-forward skips the check", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "src", choices: ["a"] },
        { type: "dropdown", name: "q1", choicesFromQuestion: "src" },
        { type: "text", name: "q2", visibleIf: "{q1} = 'whatever'" },
      ],
    }, "expression/unknown-choice")).toHaveLength(0);
  });
  test("itemvalue object choices are compared by value", () => {
    const findings = byRule({
      elements: [
        {
          type: "radiogroup", name: "q1",
          choices: [{ value: "a", text: "Letter A" }, { value: "b", text: "Letter B" }],
        },
        { type: "text", name: "q2", visibleIf: "{q1} = 'Letter A'" },
      ],
    }, "expression/unknown-choice");
    expect(findings).toHaveLength(1);
  });
  test("matrix column choices are checked via {row.col}", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [
          { name: "color", cellType: "dropdown", choices: ["red", "green"] },
          { name: "note", cellType: "text", visibleIf: "{row.color} = 'blue'" },
        ],
      }],
    }, "expression/unknown-choice");
    expect(findings).toHaveLength(1);
  });
  test("matrix-level shared choices apply to columns", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m1",
        choices: ["red", "green"],
        columns: [
          { name: "color" },
          { name: "note", cellType: "text", visibleIf: "{row.color} = 'red'" },
        ],
      }],
    }, "expression/unknown-choice")).toHaveLength(0);
  });
  test("defaultValue is allowed even when not among choices", () => {
    expect(byRule({
      elements: [
        { type: "radiogroup", name: "q1", choices: ["a"], defaultValue: "legacy" },
        { type: "text", name: "q2", visibleIf: "{q1} = 'legacy'" },
      ],
    }, "expression/unknown-choice")).toHaveLength(0);
  });
  test("boolean constants are never checked against choices", () => {
    expect(byRule({
      elements: [
        { type: "radiogroup", name: "q1", choices: ["a"] },
        { type: "text", name: "q2", visibleIf: "{q1} = true" },
      ],
    }, "expression/unknown-choice")).toHaveLength(0);
  });
});

describe("choices/dead-source", () => {
  test("choicesFromQuestion pointing at a missing question", () => {
    const findings = byRule({
      elements: [
        { type: "checkbox", name: "products", choices: ["a"] },
        { type: "dropdown", name: "best", choicesFromQuestion: "product" },
      ],
    }, "choices/dead-source");
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[1].choicesFromQuestion");
    expect(findings[0].suggestion).toBe("products");
  });
  test("valid carry-forward is clean", () => {
    expect(byRule({
      elements: [
        { type: "checkbox", name: "products", choices: ["a"] },
        { type: "dropdown", name: "best", choicesFromQuestion: "products", choicesFromQuestionMode: "selected" },
      ],
    }, "choices/dead-source")).toHaveLength(0);
  });
  test("carry-forward from itself is flagged", () => {
    const findings = byRule({
      elements: [{ type: "dropdown", name: "q1", choicesFromQuestion: "q1" }],
    }, "choices/dead-source");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("self");
  });
  test("carry-forward from a text question is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "q1" },
        { type: "dropdown", name: "q2", choicesFromQuestion: "q1" },
      ],
    }, "choices/dead-source");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("not-a-source");
  });
  test("matrix source with a valid column is clean, wrong column flagged", () => {
    const base = {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "product" }] },
        {
          type: "dropdown", name: "q2",
          choicesFromQuestion: "m1", choiceValuesFromQuestion: "product",
        },
      ],
    };
    expect(byRule(base, "choices/dead-source")).toHaveLength(0);
    const bad = JSON.parse(JSON.stringify(base));
    bad.elements[1].choiceValuesFromQuestion = "produkt";
    const findings = byRule(bad, "choices/dead-source");
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("product");
    expect(findings[0].path).toBe("elements[1].choiceValuesFromQuestion");
  });
  test("paneldynamic source validates template question names", () => {
    const findings = byRule({
      elements: [
        { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "product" }] },
        {
          type: "dropdown", name: "q2",
          choicesFromQuestion: "p1", choiceValuesFromQuestion: "nope",
        },
      ],
    }, "choices/dead-source");
    expect(findings).toHaveLength(1);
  });
  test("array source without choiceValuesFromQuestion is clean", () => {
    // getValueKeyName (question_baseselect.ts) falls back to the first key of every
    // row/panel value object, so the choices are built and nothing is dead here
    expect(byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }, { name: "c2" }] },
        { type: "dropdown", name: "q2", choicesFromQuestion: "m1" },
      ],
    }, "choices/dead-source")).toHaveLength(0);
    expect(byRule({
      elements: [
        { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "t1" }] },
        { type: "dropdown", name: "q2", choicesFromQuestion: "p1" },
      ],
    }, "choices/dead-source")).toHaveLength(0);
  });
  test("carry-forward through panel. resolves inside the dynamic panel", () => {
    expect(byRule({
      elements: [{
        type: "paneldynamic", name: "p1", templateElements: [
          { type: "checkbox", name: "src", choices: ["a", "b"] },
          { type: "dropdown", name: "dst", choicesFromQuestion: "panel.src" },
        ],
      }],
    }, "choices/dead-source")).toHaveLength(0);
  });
  test("carry-forward through row. resolves inside the matrix row", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [
          { name: "src", cellType: "checkbox", choices: ["a", "b"] },
          { name: "dst", cellType: "dropdown", choicesFromQuestion: "row.src" },
        ],
      }],
    }, "choices/dead-source")).toHaveLength(0);
  });
  test("panel.-prefixed carry-forward outside a dynamic panel is still dead", () => {
    const findings = byRule({
      elements: [
        { type: "checkbox", name: "src", choices: ["a"] },
        { type: "dropdown", name: "dst", choicesFromQuestion: "panel.src" },
      ],
    }, "choices/dead-source");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("missing");
  });
  test("a wrong name behind a row. prefix is flagged with a prefixed suggestion", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [
          { name: "src", cellType: "checkbox", choices: ["a"] },
          { name: "dst", cellType: "dropdown", choicesFromQuestion: "row.scr" },
        ],
      }],
    }, "choices/dead-source");
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("row.src");
  });
});

describe("expression/unknown-choice - contains on scalar questions", () => {
  // containsCore (expressions.ts) does substring matching when the question value
  // is a scalar; whole-value membership only applies to array-valued questions
  const fruitSurvey = (visibleIf: string) => ({
    elements: [
      { type: "dropdown", name: "fruit", choices: ["apple", "apricot"] },
      { type: "text", name: "q2", visibleIf: visibleIf },
    ],
  });
  test("substring of a choice is legitimate", () => {
    expect(byRule(fruitSurvey("{fruit} contains 'apr'"), "expression/unknown-choice")).toHaveLength(0);
    expect(byRule(fruitSurvey("{fruit} notcontains 'apr'"), "expression/unknown-choice")).toHaveLength(0);
  });
  test("a string no choice contains is still flagged", () => {
    const findings = byRule(fruitSurvey("{fruit} contains 'xyz'"), "expression/unknown-choice");
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("no choice value contains");
  });
  test("equality on the same scalar keeps whole-value matching", () => {
    expect(byRule(fruitSurvey("{fruit} = 'apr'"), "expression/unknown-choice")).toHaveLength(1);
  });
  test("array-valued questions keep membership semantics for contains", () => {
    const tagsSurvey = (visibleIf: string) => ({
      elements: [
        { type: "checkbox", name: "tags", choices: ["alpha", "beta"] },
        { type: "text", name: "q2", visibleIf: visibleIf },
      ],
    });
    expect(byRule(tagsSurvey("{tags} contains 'alp'"), "expression/unknown-choice")).toHaveLength(1);
    expect(byRule(tagsSurvey("{tags} contains 'alpha'"), "expression/unknown-choice")).toHaveLength(0);
  });
});

describe("expression/unknown-choice - matrix columns and cellType", () => {
  const unknownChoice = (res: any) => res.findings.filter((f: any) => f.ruleId === "expression/unknown-choice");
  test("non-select columns are not validated against shared matrix choices", () => {
    const res = lintSurvey({
      elements: [{
        type: "matrixdynamic",
        name: "m",
        choices: ["red", "green"],
        columns: [
          { name: "color" },
          { name: "comments", cellType: "text" },
          { name: "note", visibleIf: "{row.comments} = 'hello'" },
        ],
      }],
    });
    expect(unknownChoice(res)).toHaveLength(0);
  });
  test("matrix-level cellType disables shared-choice validation for inheriting columns", () => {
    const res = lintSurvey({
      elements: [{
        type: "matrixdynamic",
        name: "m",
        cellType: "text",
        choices: ["red", "green"],
        columns: [
          { name: "comments" },
          { name: "note", visibleIf: "{row.comments} = 'hello'" },
        ],
      }],
    });
    expect(unknownChoice(res)).toHaveLength(0);
  });
  test("select columns keep shared-choice validation", () => {
    const res = lintSurvey({
      elements: [{
        type: "matrixdynamic",
        name: "m",
        choices: ["red", "green"],
        columns: [
          { name: "color" },
          { name: "note", visibleIf: "{row.color} = 'blue'" },
        ],
      }],
    });
    expect(unknownChoice(res)).toHaveLength(1);
  });
  test("settings.matrix.defaultCellType drives the inherited cell type", () => {
    const json = {
      elements: [{
        type: "matrixdynamic",
        name: "m",
        choices: ["red", "green"],
        columns: [
          { name: "c1" },
          { name: "note", visibleIf: "{row.c1} = 'blue'" },
        ],
      }],
    };
    expect(unknownChoice(lintSurvey(json))).toHaveLength(1);
    withSettings({ "matrix.defaultCellType": "text" }, () => {
      expect(unknownChoice(lintSurvey(json))).toHaveLength(0);
    });
  });
});

describe("choices/dead-source paths", () => {
  test("a matrix column reports at the carry-forward property path", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic",
        name: "m",
        columns: [{ name: "c1", cellType: "dropdown", choicesFromQuestion: "nope" }],
      }],
    }, "choices/dead-source");
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].columns[0].choicesFromQuestion");
  });
});

// The rule compares the way the runtime "equal"/"contains" operators do
// (Helpers.isTwoValueEquals / containsCore), so settings.comparator drives it.
describe("expression/unknown-choice - comparator parity", () => {
  const choiceSurvey = (visibleIf: string, choices: Array<any>) => ({
    elements: [
      { type: "radiogroup", name: "q1", choices: choices },
      { type: "text", name: "q2", visibleIf: visibleIf },
    ],
  });
  const unknownChoices = (visibleIf: string, choices: Array<any>) =>
    byRule(choiceSurvey(visibleIf, choices), "expression/unknown-choice");

  test("a case mismatch is accepted while the comparator is case-insensitive", () => {
    expect(unknownChoices("{q1} = 'LOW'", ["low", "high"])).toHaveLength(0);
  });
  test("a case mismatch is flagged once the comparator is case-sensitive", () => {
    withSettings({ "comparator.caseSensitive": true }, () => {
      const findings = unknownChoices("{q1} = 'LOW'", ["low", "high"]);
      expect(findings).toHaveLength(1);
      expect(findings[0].messageData.values).toEqual(["LOW"]);
    });
  });
  test("substring matching follows the comparator too", () => {
    expect(unknownChoices("{q1} contains 'LO'", ["low", "high"])).toHaveLength(0);
    withSettings({ "comparator.caseSensitive": true }, () => {
      expect(unknownChoices("{q1} contains 'LO'", ["low", "high"])).toHaveLength(1);
    });
  });
  test("a string compared to numeric choices converts, like the runtime", () => {
    expect(unknownChoices("{q1} = '2'", [1, 2, 3])).toHaveLength(0);
    expect(unknownChoices("{q1} = '4'", [1, 2, 3])).toHaveLength(1);
  });
});
