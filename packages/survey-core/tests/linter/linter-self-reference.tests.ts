import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

// Per-item conditions (a choice's/rate value's own visibleIf/enableIf) legitimately
// reference the owning question to filter items by its current value - the documented
// exclusive-"none" idiom. The runtime converges: only the item hides, the question
// value is not cleared. reference/self must fire only for element-level conditions.
const selfRefs = (json: any): Array<ILintFinding> =>
  lintSurvey(json).findings.filter(f => f.ruleId === "reference/self");

describe("reference/self and per-item conditions", () => {
  test("choice-level visibleIf referencing the owning question is legitimate", () => {
    expect(selfRefs({
      elements: [{
        type: "checkbox",
        name: "q1",
        choices: ["a", "b", { value: "none", visibleIf: "{q1} notcontains 'a'" }],
      }],
    })).toHaveLength(0);
  });
  test("choice-level enableIf referencing the owner via valueName is legitimate", () => {
    expect(selfRefs({
      elements: [{
        type: "checkbox",
        name: "q1",
        valueName: "v1",
        choices: ["a", { value: "b", enableIf: "{v1} notcontains 'a'" }],
      }],
    })).toHaveLength(0);
  });
  test("rate-value visibleIf referencing the owning rating is legitimate", () => {
    expect(selfRefs({
      elements: [{
        type: "rating",
        name: "q1",
        rateValues: [1, 2, { value: 3, visibleIf: "{q1} notempty" }],
      }],
    })).toHaveLength(0);
  });
  test("column-choice visibleIf referencing the own column via row. is legitimate", () => {
    expect(selfRefs({
      elements: [{
        type: "matrixdropdown",
        name: "m",
        rows: ["r1"],
        columns: [{
          name: "col1",
          cellType: "checkbox",
          choices: ["x", { value: "y", visibleIf: "{row.col1} notcontains 'x'" }],
        }],
      }],
    })).toHaveLength(0);
  });
  test("question-level self references are still reported", () => {
    expect(selfRefs({
      elements: [{ type: "text", name: "q1", visibleIf: "{q1} notempty" }],
    })).toHaveLength(1);
    expect(selfRefs({
      elements: [{ type: "text", name: "q1", enableIf: "{self} notempty" }],
    })).toHaveLength(1);
  });
  test("a matrix column named after a top-level question is not a self reference", () => {
    // {score} inside the column resolves to the TOP-LEVEL question, so the cell
    // reacts to it - the runtime shows the cell at score=10 and hides it at score=1
    expect(selfRefs({
      elements: [
        { type: "text", name: "score", inputType: "number" },
        {
          type: "matrixdynamic", name: "m1",
          columns: [{ name: "score", cellType: "text", visibleIf: "{score} > 5" }],
        },
      ],
    })).toHaveLength(0);
  });
  test("a template question named after a top-level question is not a self reference", () => {
    expect(selfRefs({
      elements: [
        { type: "text", name: "score", inputType: "number" },
        {
          type: "paneldynamic", name: "p1",
          templateElements: [{ type: "text", name: "score", visibleIf: "{score} > 5" }],
        },
      ],
    })).toHaveLength(0);
  });
  test("a column referencing itself through row. is still reported", () => {
    const findings = selfRefs({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{ name: "c1", cellType: "text", visibleIf: "{row.c1} notempty" }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].columns[0].visibleIf");
  });
  test("a template question referencing itself through panel. is still reported", () => {
    expect(selfRefs({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "text", name: "q1", visibleIf: "{panel.q1} notempty" }],
      }],
    })).toHaveLength(1);
  });
  test("a question referencing itself through its valueName is still reported", () => {
    expect(selfRefs({
      elements: [{ type: "text", name: "q1", valueName: "v1", visibleIf: "{v1} notempty" }],
    })).toHaveLength(1);
  });
});

// {prevPanel.x}/{nextPanel.x} and {prevRow.x}/{nextRow.x}/{totalRow.x} name the same template
// question or column as the owner, but read it in another record - not the owner's own value.
describe("reference/self and neighbouring rows/panels", () => {
  const panelSurvey = (enableIf: string) => ({
    elements: [{
      type: "paneldynamic", name: "question1",
      templateElements: [{ type: "boolean", name: "agree", enableIf: enableIf }],
    }],
  });
  const matrixSurvey = (column: any) => ({
    elements: [{ type: "matrixdynamic", name: "m1", columns: [Object.assign({ name: "col1" }, column)] }],
  });
  test("the same field of the previous panel is not a self reference (#12014)", () => {
    expect(selfRefs({
      pages: [{
        name: "page1",
        elements: [{
          type: "paneldynamic",
          name: "question1",
          title: "Dynamic Panel test",
          templateElements: [{
            type: "boolean",
            name: "agree",
            title: "Agree?",
            enableIf: "{panelIndex} = 0 || {prevPanel.agree} = true",
          }],
        }],
      }],
    })).toHaveLength(0);
  });
  test("the same field of the next panel is not a self reference", () => {
    expect(selfRefs(panelSurvey("{nextPanel.agree} = true"))).toHaveLength(0);
  });
  test("both neighbouring panels in one condition are not a self reference", () => {
    expect(selfRefs(panelSurvey("{prevPanel.agree} = true || {nextPanel.agree} = true"))).toHaveLength(0);
  });
  test("the same column of the previous or next row is not a self reference", () => {
    expect(selfRefs(matrixSurvey({ cellType: "boolean", enableIf: "{prevRow.col1} = true" }))).toHaveLength(0);
    expect(selfRefs(matrixSurvey({ cellType: "boolean", enableIf: "{nextRow.col1} = true" }))).toHaveLength(0);
  });
  test("the same column of the total row is not a self reference", () => {
    expect(selfRefs(matrixSurvey({
      cellType: "text", inputType: "number", totalType: "sum", visibleIf: "{totalRow.col1} > 10",
    }))).toHaveLength(0);
  });
  test("the own panel next to a neighbour is still reported", () => {
    const findings = selfRefs(panelSurvey("{prevPanel.agree} = true || {panel.agree} = true"));
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reference).toBe("panel.agree");
  });
  test("the own row next to a neighbour is still reported", () => {
    const findings = selfRefs(matrixSurvey({ cellType: "text", visibleIf: "{prevRow.col1} = 1 || {row.col1} = 1" }));
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.reference).toBe("row.col1");
  });
});
