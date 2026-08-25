import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any, ruleId: string, options?: any): Array<ILintFinding> {
  return lintSurvey(json, options).findings.filter(f => f.ruleId === ruleId);
}

describe("reference/self", () => {
  test("visibleIf referencing own name is flagged with reproduction", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", visibleIf: "{q1} notempty" }],
    }, "reference/self");
    expect(findings).toHaveLength(1);
    expect(findings[0].reproduction).toBeDefined();
    expect(findings[0].reproduction.steps[0]).toEqual({ set: { q1: "<any value>" } });
  });
  test("enableIf via valueName is flagged", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", valueName: "income", enableIf: "{income} > 0" }],
    }, "reference/self")).toHaveLength(1);
  });
  test("{self} in a question condition is flagged", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", requiredIf: "{self} notempty" }],
    }, "reference/self")).toHaveLength(1);
  });
  test("{self} in choicesVisibleIf is NOT flagged (binds to the item)", () => {
    expect(byRule({
      elements: [{
        type: "checkbox", name: "q1", choices: ["a"],
        choicesVisibleIf: "{self} != 'b'",
      }],
    }, "reference/self")).toHaveLength(0);
  });
  test("column self-reference via {row.own} is flagged", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{ name: "col1", visibleIf: "{row.col1} > 0" }],
      }],
    }, "reference/self")).toHaveLength(1);
  });
  test("template question self-reference via {panel.own} is flagged", () => {
    expect(byRule({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "text", name: "inner", visibleIf: "{panel.inner} = 1" }],
      }],
    }, "reference/self")).toHaveLength(1);
  });
  test("defaultValueExpression referencing self is NOT flagged (conditions only)", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", defaultValueExpression: "{q1}" }],
    }, "reference/self")).toHaveLength(0);
  });
});

describe("name/duplicate", () => {
  test("two questions on different pages share a name", () => {
    const findings = byRule({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q1" }] },
      ],
    }, "name/duplicate");
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("pages[1].elements[0]");
    expect(findings[0].related).toHaveLength(2);
  });
  test("question vs panel name clash is flagged", () => {
    expect(byRule({
      elements: [
        { type: "panel", name: "info", elements: [] },
        { type: "text", name: "info" },
      ],
    }, "name/duplicate")).toHaveLength(1);
  });
  test("calculated value shadowing a question is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "total" }],
      calculatedValues: [{ name: "total", expression: "1" }],
    }, "name/duplicate");
    expect(findings).toHaveLength(1);
    expect(findings[0].elementType).toBe("calculatedvalue");
  });
  test("duplicate calculated value names are flagged", () => {
    expect(byRule({
      calculatedValues: [
        { name: "a", expression: "1" },
        { name: "a", expression: "2" },
      ],
    }, "name/duplicate")).toHaveLength(1);
  });
  test("same template name in two different dynamic panels is clean", () => {
    expect(byRule({
      elements: [
        { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "inner" }] },
        { type: "paneldynamic", name: "p2", templateElements: [{ type: "text", name: "inner" }] },
      ],
    }, "name/duplicate")).toHaveLength(0);
  });
  test("duplicate names inside ONE template are flagged", () => {
    expect(byRule({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [
          { type: "text", name: "inner" },
          { type: "text", name: "inner" },
        ],
      }],
    }, "name/duplicate")).toHaveLength(1);
  });
  test("duplicate column names in one matrix are flagged, across matrices clean", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{ name: "col1" }, { name: "col1" }],
      }],
    }, "name/duplicate")).toHaveLength(1);
    expect(byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "matrixdynamic", name: "m2", columns: [{ name: "col1" }] },
      ],
    }, "name/duplicate")).toHaveLength(0);
  });
  test("duplicate valueNames are NOT flagged (legal feature)", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", valueName: "shared" },
        { type: "text", name: "q2", valueName: "shared" },
      ],
    }, "name/duplicate")).toHaveLength(0);
  });
});

describe("element/unknown-type", () => {
  test("typo in type produces an info finding with suggestion", () => {
    const findings = byRule({
      elements: [{ type: "chekbox", name: "q1" }],
    }, "element/unknown-type");
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("info");
    expect(findings[0].suggestion).toBe("checkbox");
  });
  test("type passed via options.components is known", () => {
    expect(byRule({
      elements: [{ type: "fullname", name: "q1" }],
    }, "element/unknown-type", { components: { fullname: {} } })).toHaveLength(0);
  });
  test("all built-in types are known", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "a" }, { type: "rating", name: "b" },
        { type: "signaturepad", name: "c" }, { type: "html", name: "d" },
      ],
    }, "element/unknown-type")).toHaveLength(0);
  });
});

describe("expression/unknown-function", () => {
  test("typo in a built-in function name is flagged with suggestion", () => {
    const findings = byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "expression", name: "sum", expression: "sumInArrey({m1}, 'col1')" },
      ],
    }, "expression/unknown-function");
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].suggestion).toBe("sumInArray");
  });
  test("built-in functions are known", () => {
    expect(byRule({
      elements: [{ type: "expression", name: "e", expression: "iif(age({birthdate}) > 18, 1, 2)" }],
    }, "expression/unknown-function")).toHaveLength(0);
  });
  test("options.knownFunctions silences custom functions", () => {
    const survey = {
      elements: [{ type: "expression", name: "e", expression: "myCustomFunc(1)" }],
    };
    expect(byRule(survey, "expression/unknown-function")).toHaveLength(1);
    expect(byRule(survey, "expression/unknown-function", { knownFunctions: ["myCustomFunc"] })).toHaveLength(0);
  });
});
