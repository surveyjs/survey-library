import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

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
  test("array source without choiceValuesFromQuestion is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }] },
        { type: "dropdown", name: "q2", choicesFromQuestion: "m1" },
      ],
    }, "choices/dead-source");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reason).toBe("missing-choice-values");
  });
});
