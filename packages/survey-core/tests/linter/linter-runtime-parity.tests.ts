import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { JsonObject } from "../../src/jsonobject";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionSelectBase } from "../../src/question_baseselect";
import { lintSurvey } from "../../src/linter/index";
import { OBJECT_PROTOTYPE_MEMBERS } from "../../src/linter/catalog";
import { LintFixture, NOT_AN_ARRAY_FIXTURES, REQUIRED_FIXTURES } from "./lint-fixtures";
import { getBuiltInVariableNames } from "../../src/survey";

// A finding at "error" severity claims the survey cannot work. These tests build a
// live SurveyModel on purpose - it is the only way to pin the linter against real
// behavior rather than against our reading of the code. Every case in the first
// describe used to be reported as an error while the runtime accepted it.
//
// One rule is deliberately wider than the runtime: name/reserved reports every member of
// Object.prototype in every slot that keys a value, although the core now survives most of
// them. Its describe keeps the two halves apart and says why.
//
// The linter itself must stay model-free (issue #11693, pinned by
// linter-imports.tests.ts); only this test file constructs a survey.
function errors(json: any): Array<string> {
  return lintSurvey(json).findings
    .filter(f => f.severity === "error")
    .map(f => f.ruleId + " @ " + f.path);
}

function cellQuestion(survey: SurveyModel, matrixName: string, rowIndex: number, cellIndex: number): any {
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName(matrixName);
  return matrix.visibleRows[rowIndex].cells[cellIndex].question;
}

function choiceValues(question: QuestionSelectBase): Array<any> {
  return question.visibleChoices.map(choice => choice.value);
}

describe("linter vs runtime: configurations the runtime accepts", () => {
  test("carry-forward through panel. builds choices", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [
          { type: "checkbox", name: "src", choices: ["a", "b"] },
          { type: "dropdown", name: "dst", choicesFromQuestion: "panel.src" },
        ],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p1");
    const dst = <QuestionSelectBase>panel.panels[0].getQuestionByName("dst");
    expect(choiceValues(dst)).toEqual(["a", "b"]);
  });

  test("carry-forward through row. builds choices", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1", rowCount: 1, columns: [
          { name: "src", cellType: "checkbox", choices: ["a", "b"] },
          { name: "dst", cellType: "dropdown", choicesFromQuestion: "row.src" },
        ],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    expect(choiceValues(cellQuestion(survey, "m1", 0, 1))).toEqual(["a", "b"]);
  });

  test("a column named after a top-level question reacts to that question", () => {
    const json = {
      elements: [
        { type: "text", name: "score", inputType: "number" },
        {
          type: "matrixdynamic", name: "m1", rowCount: 1,
          columns: [{ name: "score", cellType: "text", visibleIf: "{score} > 5" }],
        },
      ],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("score", 10);
    expect(cellQuestion(survey, "m1", 0, 0).isVisible).toBe(true);
    survey.setValue("score", 1);
    expect(cellQuestion(survey, "m1", 0, 0).isVisible).toBe(false);
  });

  test("a comment key of a column is a live row key", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1", rowCount: 1, columns: [
          { name: "col1", cellType: "text", showCommentArea: true },
          { name: "col2", cellType: "text", visibleIf: "{row.col1-Comment} notempty" },
        ],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("m1", [{ col1: "x", "col1-Comment": "note" }]);
    expect(cellQuestion(survey, "m1", 0, 1).isVisible).toBe(true);
  });

  test("a comment key of a template question is a live panel key", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [
          { type: "text", name: "q1", showCommentArea: true },
          { type: "text", name: "q2", visibleIf: "{panel.q1-Comment} notempty" },
        ],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("p1", [{ q1: "x", "q1-Comment": "note" }]);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p1");
    expect(panel.panels[0].getQuestionByName("q2").isVisible).toBe(true);
  });

  test("an item condition filters the choices of a matrix cell", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1", rowCount: 1,
        columns: [{
          name: "col2", cellType: "dropdown", choices: ["a", "b"],
          choicesVisibleIf: "{item} != 'b'",
        }],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    expect(choiceValues(cellQuestion(survey, "m1", 0, 0))).toEqual(["a"]);
  });

  test("an array source without choiceValuesFromQuestion uses the first field", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }, { name: "col2" }] },
        { type: "dropdown", name: "d1", choicesFromQuestion: "m1" },
      ],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("m1", [{ col1: "a", col2: "b" }, { col1: "c", col2: "d" }]);
    expect(choiceValues(<QuestionSelectBase>survey.getQuestionByName("d1"))).toEqual(["a", "c"]);
  });

  test("the total row is addressed by valueName", () => {
    const json = {
      elements: [
        {
          type: "matrixdynamic", name: "m1", valueName: "mv", rowCount: 1,
          columns: [{ name: "col1", cellType: "text", inputType: "number", totalType: "sum" }],
        },
        { type: "text", name: "q2", visibleIf: "{mv-total.col1} > 0" },
      ],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("mv", [{ col1: 5 }]);
    expect(survey.data["mv-total"]).toEqual({ col1: 5 });
    expect(survey.getQuestionByName("q2").isVisible).toBe(true);
  });

  test("a template question reading itself in the previous panel follows that panel (#12014)", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "question1", panelCount: 2,
        templateElements: [{
          type: "boolean", name: "agree",
          enableIf: "{panelIndex} = 0 || {prevPanel.agree} = true",
        }],
      }],
    };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    const panels = (<QuestionPanelDynamicModel>survey.getQuestionByName("question1")).panels;
    const first = panels[0].getQuestionByName("agree");
    const second = panels[1].getQuestionByName("agree");
    expect(first.isReadOnly).toBe(false);
    expect(second.isReadOnly).toBe(true);
    first.value = true;
    expect(second.isReadOnly).toBe(false);
  });
});

// name/shadowing is a warning, so these cases read its findings rather than errors(): a data key
// competes only with the keys of the record it is written into.
describe("linter vs runtime: data scopes of name/shadowing", () => {
  function shadowing(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "name/shadowing")
      .map(f => f.reason + " @ " + f.path);
  }
  function templateQuestion(survey: SurveyModel, panelName: string, name: string): any {
    return (<QuestionPanelDynamicModel>survey.getQuestionByName(panelName)).panels[0].getQuestionByName(name);
  }

  test("a template valueName writes into its panel, not next to a top-level question (#12014)", () => {
    const json = {
      elements: [
        { type: "text", name: "phone_number" },
        {
          type: "paneldynamic", name: "emergency_contacts", panelCount: 1,
          templateElements: [{ type: "text", name: "contact_phone_number", valueName: "phone_number" }],
        },
      ],
    };
    expect(shadowing(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.getQuestionByName("phone_number").value = "a";
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("emergency_contacts");
    panel.panels[0].getQuestionByName("contact_phone_number").value = "b";
    expect(survey.data).toEqual({ phone_number: "a", emergency_contacts: [{ phone_number: "b" }] });
  });

  // the share works, and inside a record it is left unreported - a deliberate share as often as not
  test("a detail-panel valueName shares the row key of a column", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1", rowCount: 1, detailPanelMode: "underRow",
        columns: [{ name: "c1", cellType: "text" }],
        detailElements: [{ type: "text", name: "d1", valueName: "c1" }],
      }],
    };
    expect(shadowing(json)).toEqual([]);
    const survey = new SurveyModel(json);
    const row = (<QuestionMatrixDynamicModel>survey.getQuestionByName("m1")).visibleRows[0];
    row.showDetailPanel();
    row.detailPanel.getQuestionByName("d1").value = "x";
    expect(survey.data).toEqual({ m1: [{ c1: "x" }] });
    expect(cellQuestion(survey, "m1", 0, 0).value).toBe("x");
  });

  test("a template question spelling a top-level comment key writes into its panel", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", showCommentArea: true },
        { type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [{ type: "text", name: "q1-Comment" }] },
      ],
    };
    expect(shadowing(json)).toEqual([]);
    const survey = new SurveyModel(json);
    const q1 = survey.getQuestionByName("q1");
    q1.value = "a";
    q1.comment = "note";
    templateQuestion(survey, "p1", "q1-Comment").value = "b";
    expect(survey.data).toEqual({ q1: "a", "q1-Comment": "note", p1: [{ "q1-Comment": "b" }] });
    expect(q1.comment).toBe("note");
  });

  test("a template question spelling a top-level totals key writes into its panel", () => {
    const json = {
      elements: [
        {
          type: "matrixdynamic", name: "m1", rowCount: 1,
          columns: [{ name: "c1", cellType: "text", inputType: "number", totalType: "sum" }],
        },
        { type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [{ type: "text", name: "m1-total" }] },
      ],
    };
    expect(shadowing(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.setValue("m1", [{ c1: 5 }]);
    templateQuestion(survey, "p1", "m1-total").value = "x";
    expect(survey.data["m1-total"]).toEqual({ c1: 5 });
    expect(survey.data.p1).toEqual([{ "m1-total": "x" }]);
  });

  test("questions of two different templates write into different panels", () => {
    const json = {
      elements: [
        { type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [{ type: "text", name: "x" }] },
        {
          type: "paneldynamic", name: "p2", panelCount: 1,
          templateElements: [{ type: "text", name: "y", valueName: "x" }],
        },
      ],
    };
    expect(shadowing(json)).toEqual([]);
    const survey = new SurveyModel(json);
    templateQuestion(survey, "p1", "x").value = "a";
    templateQuestion(survey, "p2", "y").value = "b";
    expect(survey.data).toEqual({ p1: [{ x: "a" }], p2: [{ x: "b" }] });
    expect(templateQuestion(survey, "p1", "x").value).toBe("a");
  });

  test("a top-level valueName and a template question of that name write into different records", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", valueName: "x" },
        { type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [{ type: "text", name: "x" }] },
      ],
    };
    expect(shadowing(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.getQuestionByName("q1").value = "a";
    templateQuestion(survey, "p1", "x").value = "b";
    expect(survey.data).toEqual({ x: "a", p1: [{ x: "b" }] });
    expect(survey.getQuestionByName("q1").value).toBe("a");
  });

  // the share works, and inside a record it is left unreported - a deliberate share as often as not
  test("a valueName landing on another question of the same template shares its panel key", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [
          { type: "text", name: "x" },
          { type: "text", name: "y", valueName: "x" },
        ],
      }],
    };
    expect(shadowing(json)).toEqual([]);
    const survey = new SurveyModel(json);
    templateQuestion(survey, "p1", "x").value = "a";
    expect(templateQuestion(survey, "p1", "y").value).toBe("a");
    templateQuestion(survey, "p1", "y").value = "b";
    expect(templateQuestion(survey, "p1", "x").value).toBe("b");
    expect(survey.data).toEqual({ p1: [{ x: "b" }] });
  });

  // The comment and the question spelling its key write the same record key without knowing of
  // each other: the last write wins in the data, and the other question keeps showing its own.
  test("a comment key inside one template is overwritten by the question spelling it", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [
          { type: "text", name: "q1", showCommentArea: true },
          { type: "text", name: "q1-Comment" },
        ],
      }],
    };
    expect(shadowing(json)).toEqual(["commentKeyCollision @ elements[0].templateElements[1]"]);
    const survey = new SurveyModel(json);
    templateQuestion(survey, "p1", "q1").comment = "note";
    expect(survey.data).toEqual({ p1: [{ "q1-Comment": "note" }] });
    templateQuestion(survey, "p1", "q1-Comment").value = "other";
    expect(survey.data).toEqual({ p1: [{ "q1-Comment": "other" }] });
    expect(templateQuestion(survey, "p1", "q1").comment).toBe("note");
  });

  test("a comment key inside one template is overwritten through a valueName too", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [
          { type: "text", name: "q1", valueName: "shared", showCommentArea: true },
          { type: "text", name: "q2", valueName: "shared-Comment" },
        ],
      }],
    };
    expect(shadowing(json)).toEqual(["commentKeyCollision @ elements[0].templateElements[1]"]);
    const survey = new SurveyModel(json);
    templateQuestion(survey, "p1", "q1").comment = "note";
    expect(survey.data).toEqual({ p1: [{ "shared-Comment": "note" }] });
    templateQuestion(survey, "p1", "q2").value = "other";
    expect(survey.data).toEqual({ p1: [{ "shared-Comment": "other" }] });
    expect(templateQuestion(survey, "p1", "q1").comment).toBe("note");
  });

  test("a column comment key is overwritten by a detail-panel question spelling it", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1", rowCount: 1, detailPanelMode: "underRow",
        columns: [{ name: "c1", cellType: "text", showCommentArea: true }],
        detailElements: [{ type: "text", name: "c1-Comment" }],
      }],
    };
    expect(shadowing(json)).toEqual(["commentKeyCollision @ elements[0].detailElements[0]"]);
    const survey = new SurveyModel(json);
    const row = (<QuestionMatrixDynamicModel>survey.getQuestionByName("m1")).visibleRows[0];
    row.showDetailPanel();
    const cell = cellQuestion(survey, "m1", 0, 0);
    cell.comment = "note";
    expect(survey.data).toEqual({ m1: [{ "c1-Comment": "note" }] });
    row.detailPanel.getQuestionByName("c1-Comment").value = "other";
    expect(survey.data).toEqual({ m1: [{ "c1-Comment": "other" }] });
    expect(cell.comment).toBe("note");
  });

  // The comment of a question with a valueName lives under "<valueName>-Comment", so a question
  // named "<name>-Comment" next to it writes a key of its own.
  test("a question named after the comment key of a valueName question writes a key of its own", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [
          { type: "text", name: "q1", valueName: "v1", showCommentArea: true },
          { type: "text", name: "q1-Comment" },
        ],
      }],
    };
    expect(shadowing(json)).toEqual([]);
    const survey = new SurveyModel(json);
    templateQuestion(survey, "p1", "q1").comment = "note";
    templateQuestion(survey, "p1", "q1-Comment").value = "x";
    expect(survey.data).toEqual({ p1: [{ "v1-Comment": "note", "q1-Comment": "x" }] });
    expect(templateQuestion(survey, "p1", "q1").comment).toBe("note");
  });

  test("the comment key of a valueName is overwritten by the question spelling it, whoever carries the name", () => {
    const json = {
      elements: [{
        type: "paneldynamic", name: "p1", panelCount: 1, templateElements: [
          { type: "text", name: "x", valueName: "q1", showCommentArea: true },
          { type: "text", name: "q1", valueName: "other" },
          { type: "text", name: "q1-Comment" },
        ],
      }],
    };
    expect(shadowing(json)).toEqual(["commentKeyCollision @ elements[0].templateElements[2]"]);
    const survey = new SurveyModel(json);
    templateQuestion(survey, "p1", "x").comment = "note";
    expect(survey.data).toEqual({ p1: [{ "q1-Comment": "note" }] });
    templateQuestion(survey, "p1", "q1-Comment").value = "other";
    expect(survey.data).toEqual({ p1: [{ "q1-Comment": "other" }] });
    expect(templateQuestion(survey, "p1", "x").comment).toBe("note");
  });
});

// Questions on one data key share one value; a panel/row object then holds the fields every one of
// them writes, whichever side declares the valueName. Each case writes through the partner and reads
// the field through the owner, the way a respondent's answer reaches it.
describe("linter vs runtime: fields of a shared value", () => {
  function referenceFindings(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "reference/unknown" || f.ruleId === "choices/dead-source")
      .map(f => f.ruleId + "/" + f.reason + " @" + f.path);
  }
  const PARTNERS: Array<{ id: string, field: string, json: any, write: (q: any) => void, first: any }> = [
    { id: "checkbox with valuePropertyName", field: "car", first: "Ford",
      json: { type: "checkbox", choices: ["Ford", "BMW"], valuePropertyName: "car" }, write: q => { q.value = ["Ford", "BMW"]; } },
    { id: "tagbox with valuePropertyName", field: "car", first: "Ford",
      json: { type: "tagbox", choices: ["Ford", "BMW"], valuePropertyName: "car" }, write: q => { q.value = ["Ford", "BMW"]; } },
    { id: "ranking with valuePropertyName", field: "car", first: "Ford",
      json: { type: "ranking", choices: ["Ford", "BMW"], valuePropertyName: "car" }, write: q => { q.value = ["Ford", "BMW"]; } },
    { id: "image map with valuePropertyName", field: "car", first: "Ford",
      json: { type: "imagemap", valuePropertyName: "car", imageLink: "x",
        areas: [{ value: "Ford", coords: "1,1,2,2", shape: "rect" }, { value: "BMW", coords: "3,3,4,4", shape: "rect" }] },
      write: q => { q.value = ["Ford", "BMW"]; } },
    { id: "checkbox with a choice comment (value)", field: "value", first: "Ford",
      json: { type: "checkbox", choices: [{ value: "Ford", showCommentArea: true }, "BMW"] }, write: q => { q.value = ["Ford", "BMW"]; } },
    { id: "checkbox with a choice comment (comment)", field: "comment", first: "note",
      json: { type: "checkbox", choices: [{ value: "Ford", showCommentArea: true }, "BMW"] },
      write: q => { q.value = ["Ford", "BMW"]; q.setCommentValue(q.choices[0], "note"); } },
    { id: "dynamic matrix", field: "pcol", first: "Ford",
      json: { type: "matrixdynamic", rowCount: 0, columns: [{ name: "pcol", cellType: "text" }] },
      write: q => { q.value = [{ pcol: "Ford" }, { pcol: "BMW" }]; } },
    { id: "dynamic panel", field: "ptq", first: "Ford",
      json: { type: "paneldynamic", panelCount: 0, templateElements: [{ type: "text", name: "ptq" }] },
      write: q => { q.value = [{ ptq: "Ford" }, { ptq: "BMW" }]; } },
  ];
  const ORIENTATIONS = [
    { id: "both declare the valueName", owner: { name: "O", valueName: "cars" }, partner: { name: "P", valueName: "cars" } },
    { id: "the owner declares it", owner: { name: "O", valueName: "cars" }, partner: { name: "cars" } },
    { id: "the partner declares it", owner: { name: "cars" }, partner: { name: "P", valueName: "cars" } },
  ];
  PARTNERS.forEach(partner => ORIENTATIONS.forEach(or => {
    const f = partner.field;
    test("dynamic panel + " + partner.id + ", " + or.id, () => {
      const json = { elements: [
        Object.assign({ type: "paneldynamic", panelCount: 0, templateTitle: "T {panel." + f + "}",
          templateElements: [{ type: "text", name: "tq", visibleIf: "{panel." + f + "} = '" + partner.first + "'" }] }, or.owner),
        Object.assign({}, partner.json, or.partner),
        { type: "expression", name: "e", expression: "{cars[0]." + f + "}" },
      ] };
      expect(referenceFindings(json)).toEqual([]);
      const survey = new SurveyModel(json);
      partner.write(survey.getQuestionByName(or.partner.name));
      const panels = (<QuestionPanelDynamicModel>survey.getQuestionByName(or.owner.name)).panels;
      expect(panels[0].locTitle.renderedHtml).toBe("T " + partner.first);
      expect(panels.map(p => p.getQuestionByName("tq").isVisible)).toEqual([true, false]);
      expect(survey.getQuestionByName("e").value).toBe(partner.first);
    });
    test("dynamic matrix + " + partner.id + ", " + or.id, () => {
      const json = { elements: [
        Object.assign({ type: "matrixdynamic", rowCount: 0, columns: [{ name: "own", cellType: "text" },
          { name: "c2", cellType: "text", visibleIf: "{row." + f + "} = '" + partner.first + "'" }] }, or.owner),
        Object.assign({}, partner.json, or.partner),
      ] };
      expect(referenceFindings(json)).toEqual([]);
      const survey = new SurveyModel(json);
      partner.write(survey.getQuestionByName(or.partner.name));
      const rows = (<QuestionMatrixDynamicModel>survey.getQuestionByName(or.owner.name)).visibleRows;
      expect(rows.map(row => row.cells[1].question.isVisible)).toEqual([true, false]);
    });
  }));

  test("countInArray, choiceValuesFromQuestion, keyName and default keys read the shared field", () => {
    const json = { elements: [
      { type: "paneldynamic", name: "info", valueName: "cars", keyName: "car", templateElements: [{ type: "text", name: "rating" }] },
      { type: "checkbox", name: "cars", choices: ["Ford", "BMW", "Audi"], valuePropertyName: "car" },
      { type: "expression", name: "count", expression: "countInArray({cars}, 'car')" },
      { type: "dropdown", name: "dd", choicesFromQuestion: "info", choiceValuesFromQuestion: "car" },
    ] };
    expect(errors(json)).toEqual([]);
    const survey = new SurveyModel(json);
    survey.getQuestionByName("cars").value = ["Ford", "BMW"];
    expect(survey.getQuestionByName("count").value).toBe(2);
    expect((<QuestionSelectBase>survey.getQuestionByName("dd")).visibleChoices.map(c => c.value)).toEqual(["Ford", "BMW"]);
    survey.setValue("cars", [{ car: "Ford" }, { car: "Ford" }]);
    expect(survey.getQuestionByName("info").hasErrors(true)).toBe(true);
    const withDefault = { elements: [
      { type: "paneldynamic", name: "info", valueName: "cars", defaultValue: [{ car: "Audi" }], templateElements: [{ type: "text", name: "rating" }] },
      { type: "checkbox", name: "cars", choices: ["Ford", "BMW", "Audi"], valuePropertyName: "car" },
    ] };
    expect(lintSurvey(withDefault).findings.filter(f => f.ruleId === "value/not-a-choice")).toEqual([]);
    expect(new SurveyModel(withDefault).getQuestionByName("cars").value).toEqual([{ car: "Audi" }]);
  });

  test("a template question is read by the key it stores its value under", () => {
    const json = { elements: [
      { type: "paneldynamic", name: "pd", panelCount: 1, templateTitle: "T {panel.v1} {panel.tv}",
        templateElements: [{ type: "text", name: "tv", valueName: "v1" }] },
    ] };
    expect(referenceFindings(json)).toEqual(["reference/unknown/scopedUnknown @elements[0].templateTitle"]);
    expect(lintSurvey(json).findings.filter(f => f.ruleId === "reference/unknown")[0].message).toContain("{panel.tv}");
    const survey = new SurveyModel(json);
    const panel = (<QuestionPanelDynamicModel>survey.getQuestionByName("pd")).panels[0];
    panel.getQuestionByName("tv").value = "a";
    expect(panel.locTitle.renderedHtml).toBe("T a {panel.tv}");
  });

  test("object values merge the keys of every sharing question", () => {
    const json = { elements: [
      { type: "multipletext", name: "obj", items: [{ name: "a" }] },
      { type: "matrixdropdown", name: "md", valueName: "obj", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] },
      { type: "matrix", name: "m", valueName: "obj", rows: ["r2"], columns: ["x", "y"] },
      { type: "expression", name: "e1", expression: "{obj.r1.c}" },
      { type: "expression", name: "e2", expression: "{obj.r2}" },
    ] };
    expect(referenceFindings(json)).toEqual([]);
    const survey = new SurveyModel(json);
    // a matrix answer replaces the whole object, so it goes first
    survey.getQuestionByName("m").value = { r2: "x" };
    (<any>survey.getQuestionByName("md")).visibleRows[0].cells[0].question.value = "v";
    expect(survey.data.obj).toEqual({ r2: "x", r1: { c: "v" } });
    expect(survey.getQuestionByName("e1").value).toBe("v");
    expect(survey.getQuestionByName("e2").value).toBe("x");
  });

  test("a question on the same key in another data scope adds no field", () => {
    const json = { elements: [
      { type: "paneldynamic", name: "cars", templateTitle: "T {panel.car}", templateElements: [{ type: "text", name: "tq" }] },
      { type: "paneldynamic", name: "other", panelCount: 1, templateElements: [
        { type: "checkbox", name: "cb", valueName: "cars", valuePropertyName: "car", choices: ["Ford"] }] },
    ] };
    expect(referenceFindings(json)).toEqual(["reference/unknown/scopedUnknown @elements[0].templateTitle"]);
    const survey = new SurveyModel(json);
    (<QuestionPanelDynamicModel>survey.getQuestionByName("other")).panels[0].getQuestionByName("cb").value = ["Ford"];
    expect((<QuestionPanelDynamicModel>survey.getQuestionByName("cars")).panels).toHaveLength(0);
  });

  test("a column adds its fields to a detail-panel question on its row key", () => {
    const json = { elements: [{
      type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
      columns: [{ name: "cars", cellType: "checkbox", choices: ["Ford", "BMW"], valuePropertyName: "car" }],
      detailElements: [{ type: "paneldynamic", name: "pd", valueName: "cars", templateTitle: "Car: {panel.car}",
        templateElements: [{ type: "text", name: "tq", visibleIf: "{panel.car} = 'Ford'" }] }],
    }] };
    expect(referenceFindings(json)).toEqual([]);
    const survey = new SurveyModel(json);
    const row = (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows[0];
    row.showDetailPanel();
    cellQuestion(survey, "m", 0, 0).value = ["Ford", "BMW"];
    const panels = (<QuestionPanelDynamicModel>row.detailPanel.getQuestionByName("pd")).panels;
    expect(panels.map(p => p.locTitle.renderedHtml)).toEqual(["Car: Ford", "Car: BMW"]);
    expect(panels.map(p => p.getQuestionByName("tq").isVisible)).toEqual([true, false]);
  });

  test("a tag box with a choice comment keeps plain values", () => {
    const json = { elements: [
      { type: "tagbox", name: "cars", choices: [{ value: "Ford", showCommentArea: true }, "BMW"] },
      { type: "paneldynamic", name: "info", valueName: "cars", templateTitle: "Car: {panel.value}",
        templateElements: [{ type: "text", name: "tq" }] },
    ] };
    expect(referenceFindings(json)).toEqual(["reference/unknown/scopedUnknown @elements[1].templateTitle"]);
    const survey = new SurveyModel(json);
    const q = <QuestionSelectBase>survey.getQuestionByName("cars");
    expect(q.choices[0].showCommentArea).toBe(false);
    q.value = ["Ford"];
    q.setCommentValue(q.choices[0], "note");
    expect(survey.data.cars).toEqual(["Ford"]);
  });

  test("a single-select image map keeps the area value as it is", () => {
    const json = { elements: [
      { type: "imagemap", name: "cars", multiSelect: false, valuePropertyName: "car", imageLink: "x",
        areas: [{ value: "Ford", coords: "1,1,2,2", shape: "rect" }] },
      { type: "paneldynamic", name: "info", valueName: "cars", templateTitle: "Car: {panel.car}",
        templateElements: [{ type: "text", name: "tq" }] },
    ] };
    expect(referenceFindings(json)).toEqual(["reference/unknown/scopedUnknown @elements[1].templateTitle"]);
    const survey = new SurveyModel(json);
    const q = <any>survey.getQuestionByName("cars");
    q.mapItemToggle(q.areas[0]);
    expect(survey.data.cars).toBe("Ford");
    expect((<QuestionPanelDynamicModel>survey.getQuestionByName("info")).panels).toHaveLength(0);
  });

  test("a choice comment lives under \"comment\" in the item object, never under \"<field>-Comment\"", () => {
    const json = { elements: [
      { type: "checkbox", name: "cars", valuePropertyName: "car", choices: [{ value: "Ford", showCommentArea: true }, "BMW"] },
      { type: "paneldynamic", name: "info", valueName: "cars", templateTitle: "T {panel.car-Comment}",
        templateElements: [{ type: "text", name: "tq" }] },
    ] };
    expect(referenceFindings(json)).toEqual(["reference/unknown/scopedUnknown @elements[1].templateTitle"]);
    const survey = new SurveyModel(json);
    const q = <QuestionSelectBase>survey.getQuestionByName("cars");
    q.value = ["Ford"];
    q.setCommentValue(q.choices[0], "note");
    expect(survey.data.cars).toEqual([{ car: "Ford", comment: "note" }]);
    const panels = (<QuestionPanelDynamicModel>survey.getQuestionByName("info")).panels;
    expect(panels[0].locTitle.renderedHtml).not.toContain("note");
  });

  test("a key another question on the data key adds is that question's to check", () => {
    const json = { elements: [
      { type: "matrix", name: "m", rows: ["r1"], columns: ["x", "y"], defaultValue: { r1: "x", r2: "a", i1: "free" } },
      { type: "matrix", name: "m2", valueName: "m", rows: ["r2"], columns: ["a", "b"] },
      { type: "multipletext", name: "mt", valueName: "m", items: [{ name: "i1" }] },
    ] };
    expect(lintSurvey(json).findings.filter(f => f.ruleId === "value/not-a-choice")).toEqual([]);
    const survey = new SurveyModel(json);
    expect(survey.data.m).toEqual({ r1: "x", r2: "a", i1: "free" });
    survey.clearIncorrectValues();
    expect(survey.data.m).toEqual({ r1: "x", r2: "a", i1: "free" });
  });
});

describe("linter vs runtime: configurations that really are dead", () => {
  test("a scoped carry-forward outside a dynamic panel builds no choices", () => {
    const json = {
      elements: [
        { type: "checkbox", name: "src", choices: ["a", "b"] },
        { type: "dropdown", name: "dst", choicesFromQuestion: "panel.src" },
      ],
    };
    expect(errors(json)).toEqual(["choices/dead-source @ elements[1].choicesFromQuestion"]);
    const survey = new SurveyModel(json);
    expect(choiceValues(<QuestionSelectBase>survey.getQuestionByName("dst"))).toEqual([]);
  });

  test("a question referencing itself is still an error", () => {
    const json = {
      elements: [{ type: "text", name: "q1", visibleIf: "{q1} notempty" }],
    };
    expect(errors(json)).toEqual(["reference/self @ elements[0].visibleIf"]);
  });

  test("an unknown inner name behind a comment suffix is still an error", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text", visibleIf: "{row.nosuch-Comment} notempty" },
        ],
      }],
    };
    expect(errors(json)).toEqual(["reference/unknown @ elements[0].columns[1].visibleIf"]);
  });

  test("an item variable outside an item condition is still an error", () => {
    const json = { elements: [{ type: "text", name: "q1", visibleIf: "{item} = 1" }] };
    expect(errors(json)).toEqual(["reference/unknown @ elements[0].visibleIf"]);
  });

  test("a misspelled choiceValuesFromQuestion is still an error", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "product" }] },
        { type: "dropdown", name: "d1", choicesFromQuestion: "m1", choiceValuesFromQuestion: "produkt" },
      ],
    };
    expect(errors(json)).toEqual(["choices/dead-source @ elements[1].choiceValuesFromQuestion"]);
  });

  test("a page name in an expression resolves to nothing", () => {
    const json = {
      pages: [
        { name: "intro", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2", visibleIf: "{intro} notempty" }] },
      ],
    };
    expect(errors(json)).toEqual(["reference/unknown @ pages[1].elements[0].visibleIf"]);
    const survey = new SurveyModel(json);
    survey.setValue("q1", "abc");
    expect(survey.runExpression("{intro} notempty")).toBe(false);
    // the runtime answers a page only behind the element-property prefix
    expect(survey.runExpression("{$intro.isVisible}")).toBe(true);
    expect(errors({
      pages: [
        { name: "intro", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2", visibleIf: "{$intro.isVisible} = true" }] },
      ],
    })).toEqual([]);
  });

  test("an unknown total column is still an error", () => {
    const json = {
      elements: [
        {
          type: "matrixdynamic", name: "m1", valueName: "mv",
          columns: [{ name: "col1", cellType: "text", inputType: "number", totalType: "sum" }],
        },
        { type: "text", name: "q2", visibleIf: "{mv-total.nosuchcol} > 0" },
      ],
    };
    expect(errors(json)).toEqual(["reference/unknown @ elements[1].visibleIf"]);
  });
});

// The linter reads these names from the core's own table, so the two cannot drift
// apart. What still needs pinning is the table itself: every name in it must really be
// answered by a live survey, and a name outside it must not be.
describe("built-in variables: the core table vs the linter", () => {
  const json = {
    elements: [
      { type: "text", name: "q1", correctAnswer: "a" },
      { type: "text", name: "q2" },
    ],
  };
  getBuiltInVariableNames().forEach(name => {
    test("{" + name + "} is answered by the survey and accepted by the linter", () => {
      const survey = new SurveyModel(json);
      expect(survey.runExpression("{" + name + "}")).not.toBe(null);
      expect(errors({
        elements: [{ type: "text", name: "q1", visibleIf: "{" + name + "} notempty" }],
      })).toEqual([]);
    });
  });

  test("a name outside the table is answered by nothing", () => {
    const survey = new SurveyModel(json);
    expect(survey.runExpression("{nosuchvariable}")).toBe(null);
    expect(errors({
      elements: [{ type: "text", name: "q1", visibleIf: "{nosuchvariable} notempty" }],
    })).toEqual(["reference/unknown @ elements[0].visibleIf"]);
  });

  test("a built-in has no sub-path", () => {
    const survey = new SurveyModel(json);
    expect(survey.runExpression("{pageno.title}")).toBe(null);
    expect(errors({
      elements: [{ type: "text", name: "q1", visibleIf: "{pageno.title} notempty" }],
    })).toEqual(["reference/unknown @ elements[0].visibleIf"]);
  });
});

// validator/dead claims a validator either never fires or rejects every answer. The claim is
// about behaviour, so it is pinned against behaviour: each case feeds the question a valid
// answer and asks the model what the validator did with it.
//
// settings.supportedValidators is deliberately NOT the criterion. It lists what the Creator
// offers, and the runtime runs whatever is attached: the "regex on a number input" rows below
// pass validation, which is why the linter stays silent about them.
describe("linter vs runtime: validators that cannot validate", () => {
  function runtimeRejects(question: any, validator: any, value: any): boolean {
    const survey = new SurveyModel({
      elements: [Object.assign({}, question, { name: "q1", validators: [validator] })],
    });
    const q = survey.getQuestionByName("q1");
    q.value = value;
    return q.hasErrors(false);
  }
  function lintReports(question: any, validator: any): Array<string> {
    const json = { elements: [Object.assign({}, question, { name: "q1", validators: [validator] })] };
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "validator/dead" && f.reason === "wrongValueShape")
      .map(f => f.messageData.effect);
  }
  test("numeric checkbox validation still warns when a single selection is coerced", () => {
    const question = { type: "checkbox", choices: [1, 2, 3] };
    const validator = { type: "numeric", minValue: 2 };
    // minValue compares the coerced value, not the selection count or each item.
    expect(runtimeRejects(question, validator, [1])).toBe(true);
    expect(runtimeRejects(question, validator, [2])).toBe(false);
    expect(runtimeRejects(question, validator, [3])).toBe(false);
    expect(runtimeRejects(question, validator, [2, 3])).toBe(true);
    expect(lintReports(question, validator)).toHaveLength(1);
  });
  const CASES: Array<{
    title: string, question: any, validator: any,
    // answers the validator is meant to accept, plus one it is meant to reject
    good: any, bad: any, effect?: string,
  }> = [
    {
      title: "numeric on a checkbox", question: { type: "checkbox", choices: [1, 2] },
      validator: { type: "numeric", minValue: 1 }, good: [1, 2], bad: [1, 2],
      effect: "rejectsEveryAnswer",
    },
    {
      title: "email on a number input", question: { type: "text", inputType: "number" },
      validator: { type: "email" }, good: 42, bad: 42, effect: "rejectsEveryAnswer",
    },
    {
      title: "a length check on a number input", question: { type: "text", inputType: "number" },
      validator: { type: "text", minLength: 5 }, good: 42, bad: 4, effect: "neverFires",
    },
    {
      title: "answercount on a single-value question", question: { type: "radiogroup", choices: ["a"] },
      validator: { type: "answercount", minCount: 2 }, good: "a", bad: "a", effect: "neverFires",
    },
    {
      title: "regex on a number input", question: { type: "text", inputType: "number" },
      validator: { type: "regex", regex: "^4" }, good: 42, bad: 91,
    },
    {
      title: "regex on a checkbox", question: { type: "checkbox", choices: ["ab"] },
      validator: { type: "regex", regex: "^a" }, good: ["ab"], bad: undefined,
    },
    {
      title: "numeric on a rating", question: { type: "rating" },
      validator: { type: "numeric", minValue: 1 }, good: 3, bad: undefined,
    },
    {
      title: "a length check on a text input", question: { type: "text" },
      validator: { type: "text", minLength: 5 }, good: "abcdef", bad: "ab",
    },
  ];
  CASES.forEach(entry => {
    test(entry.title + (entry.effect ? " is reported as " + entry.effect : " stays clean"), () => {
      expect(lintReports(entry.question, entry.validator)).toEqual(entry.effect ? [entry.effect] : []);
      if (entry.effect === "rejectsEveryAnswer") {
        // the answer the validator was written for is rejected all the same
        expect(runtimeRejects(entry.question, entry.validator, entry.good)).toBe(true);
      } else if (entry.effect === "neverFires") {
        // the answer the validator was written to reject passes
        expect(runtimeRejects(entry.question, entry.validator, entry.bad)).toBe(false);
      } else {
        expect(runtimeRejects(entry.question, entry.validator, entry.good)).toBe(false);
        if (entry.bad !== undefined) {
          expect(runtimeRejects(entry.question, entry.validator, entry.bad)).toBe(true);
        }
      }
    });
  });
});

// property/unknown rebuilds the deserializer's own key matching. The runtime answer is
// survey.jsonErrors: a JsonUnknownPropertyError per key it could not place.
describe("linter vs runtime: unknown properties", () => {
  function runtimeUnknownKeys(json: any): Array<string> {
    const survey = new SurveyModel(json);
    // jsonErrors is null while the JSON loads without a complaint
    return (survey.jsonErrors || [])
      .filter(e => e.type === "unknownproperty")
      .map((e: any) => e.propertyName)
      .sort();
  }
  function lintUnknownKeys(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "property/unknown")
      .map(f => f.messageData.key)
      .sort();
  }
  const CASES: Array<{ title: string, json: any }> = [
    {
      title: "misspelled keys on a question and on the survey",
      json: { titlee: "t", elements: [{ type: "text", name: "q1", visibileIf: "1=1", nosuch: 2 }] },
    },
    {
      title: "keys of a page, a panel and a trigger",
      json: {
        pages: [{
          name: "p1", nosuchpageprop: 1,
          elements: [{ type: "panel", name: "pan1", nosuchpanelprop: 1, elements: [] }],
        }],
        triggers: [{ type: "complete", expression: "1=1", nosuchtriggerprop: 1 }],
      },
    },
    {
      title: "keys inside a matrix column and a multipletext item",
      json: {
        elements: [
          { type: "matrixdynamic", name: "m1", columns: [{ name: "c1", nosuchcolumnprop: 1 }] },
          { type: "multipletext", name: "mt1", items: [{ name: "i1", nosuchitemprop: 1 }] },
        ],
      },
    },
    {
      title: "an object-form choice next to a scalar one",
      json: {
        elements: [{ type: "dropdown", name: "q1", choices: ["a", { value: "b", nosuchchoiceprop: 1 }] }],
      },
    },
    {
      title: "a survey the serializer accepts whole",
      json: {
        title: "t",
        elements: [
          { type: "text", name: "q1", inputType: "number", min: 1, max: 5 },
          { type: "checkbox", name: "q2", choices: ["a"], hasOther: true },
          { type: "matrixdynamic", name: "m1", columns: [{ name: "c1", cellType: "dropdown", choices: ["x"] }] },
        ],
        triggers: [{ type: "setvalue", expression: "{q1} > 1", setToName: "q2", setValue: ["a"] }],
      },
    },
  ];
  CASES.forEach(entry => {
    test(entry.title + ": the linter reports what the deserializer drops", () => {
      expect(lintUnknownKeys(entry.json)).toEqual(runtimeUnknownKeys(entry.json));
    });
  });
});

// property/not-an-array mirrors JsonRequiredArrayPropertyError: the deserializer wraps a
// non-array value written for an array property and records the key it found it under.
describe("linter vs runtime: a non-array written for an array property", () => {
  function runtimeKeys(json: any): Array<string> {
    const survey = new SurveyModel(json);
    return (survey.jsonErrors || [])
      .filter(e => e.type === "arrayproperty")
      .map((e: any) => e.propertyName + "@" + e.className)
      .sort();
  }
  function lintKeys(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "property/not-an-array")
      .map(f => f.messageData.key + "@" + f.messageData.className)
      .sort();
  }
  const CASES: Array<LintFixture> = Object.keys(NOT_AN_ARRAY_FIXTURES)
    .map(key => NOT_AN_ARRAY_FIXTURES[key]);
  CASES.forEach(entry => {
    test(entry.title + ": the linter reports what the deserializer wraps", () => {
      expect(lintKeys(entry.json)).toEqual(runtimeKeys(entry.json));
    });
  });
});

// property/required mirrors JsonRequiredPropertyError. The deserializer reports the first
// missing property of an object only, so every fixture leaves out one property per object.
describe("linter vs runtime: required properties", () => {
  function runtimeKeys(json: any): Array<string> {
    const survey = new SurveyModel(json);
    return (survey.jsonErrors || [])
      .filter(e => e.type === "requiredproperty")
      .map((e: any) => e.propertyName + "@" + e.className)
      .sort();
  }
  function lintKeys(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "property/required")
      .map(f => f.messageData.key + "@" + f.messageData.className)
      .sort();
  }
  const CASES: Array<LintFixture> = Object.keys(REQUIRED_FIXTURES)
    .map(key => REQUIRED_FIXTURES[key]);
  CASES.forEach(entry => {
    test(entry.title + ": the linter reports what the deserializer requires", () => {
      expect(lintKeys(entry.json)).toEqual(runtimeKeys(entry.json));
    });
  });
});

// The */unknown-type rules mirror JsonMissingTypeError and JsonIncorrectTypeError: an object
// under a baseClassName property (elements, templateElements, triggers, validators) that the
// serializer cannot build - no type, or a type it does not know - is dropped at runtime.
describe("linter vs runtime: missing and unknown types", () => {
  const RUNTIME_KIND: { [baseClassName: string]: string } = {
    question: "element", surveytrigger: "trigger", surveyvalidator: "validator",
  };
  function runtimeTokens(json: any): Array<string> {
    const survey = new SurveyModel(json);
    return (survey.jsonErrors || [])
      .filter(e => e.type === "missingtypeproperty" || e.type === "incorrecttypeproperty")
      .map((e: any) => RUNTIME_KIND[e.baseClassName] + ":" + (e.type === "missingtypeproperty" ? "missing" : "unknown"))
      .sort();
  }
  function lintTokens(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "element/unknown-type" || f.ruleId === "trigger/unknown-type" ||
        f.ruleId === "validator/unknown-type")
      .map(f => f.ruleId.split("/")[0] + ":" +
        (f.reason === "missingType" || f.reason === "noType" ? "missing" : "unknown"))
      .sort();
  }
  const CASES: Array<{ title: string, json: any }> = [
    { title: "a question without a type", json: { pages: [{ name: "p1", elements: [{ name: "q1" }] }] } },
    { title: "a question with an unknown type", json: { elements: [{ type: "text_custom", name: "q1" }] } },
    { title: "inside a panel and a dynamic-panel template", json: {
      elements: [
        { type: "panel", name: "pn", elements: [{ name: "q1" }] },
        { type: "paneldynamic", name: "pd", templateElements: [{ type: "nosuch", name: "q2" }] },
      ],
    } },
    { title: "triggers without a type and with an unknown one", json: {
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ expression: "{q1} = 1" }, { type: "nosuchtrigger", expression: "{q1} = 1" }],
    } },
    { title: "validators without a type and with an unknown one", json: {
      elements: [{ type: "text", name: "q1", validators: [{ minValue: 1 }, { type: "nosuchvalidator" }] }],
    } },
    { title: "a survey the serializer builds whole", json: {
      elements: [
        { type: "text", name: "q1", validators: [{ type: "numeric" }] },
        { type: "panel", name: "pn", elements: [{ type: "comment", name: "q2" }] },
      ],
      triggers: [{ type: "complete", expression: "{q1} = 1" }],
    } },
  ];
  CASES.forEach(entry => {
    test(entry.title + ": the linter reports what the deserializer drops", () => {
      expect(lintTokens(entry.json)).toEqual(runtimeTokens(entry.json));
    });
  });
});

// property/invalid-value (notInChoices) mirrors JsonIncorrectPropertyValueError, which the
// deserializer reports only when asked to validate property values.
describe("linter vs runtime: values outside the allowed set", () => {
  function runtimeKeys(json: any): Array<string> {
    const survey = new SurveyModel();
    const converter = new JsonObject();
    converter.toObject(json, survey, { validatePropertyValues: true });
    return converter.errors
      .filter(e => e.type === "incorrectvalue")
      .map((e: any) => e.property.name + "=" + JSON.stringify(e.value))
      .sort();
  }
  function lintKeys(json: any): Array<string> {
    return lintSurvey(json).findings
      .filter(f => f.ruleId === "property/invalid-value" && f.reason === "notInChoices")
      .map(f => f.messageData.key + "=" + JSON.stringify(f.messageData.value))
      .sort();
  }
  const CASES: Array<{ title: string, json: any }> = [
    { title: "a misspelled enum value", json: { elements: [{ type: "text", name: "q1", clearIfInvisible: "sss" }] } },
    { title: "an enum value in the wrong case", json: { elements: [{ type: "text", name: "q1", clearIfInvisible: "cOmPlEtE" }] } },
    { title: "a survey-level enum and a question-level one", json: {
      questionTitleLocation: "Left",
      elements: [{ type: "text", name: "q1", titleLocation: "topp" }],
    } },
    { title: "a number spelled as a string is still that number", json: {
      elements: [{ type: "rating", name: "q1", rateMax: "5" }],
    } },
    { title: "the default locale spelled out", json: { locale: "default", elements: [{ type: "text", name: "q1" }] } },
    { title: "a survey the serializer accepts whole", json: {
      locale: "de", questionTitleLocation: "left",
      elements: [{ type: "text", name: "q1", clearIfInvisible: "onComplete", titleLocation: "top" }],
    } },
  ];
  CASES.forEach(entry => {
    test(entry.title + ": the linter reports what the deserializer rejects", () => {
      expect(lintKeys(entry.json)).toEqual(runtimeKeys(entry.json));
    });
  });
  test("\"default\" is an accepted spelling of the survey locale - for both", () => {
    const json = { locale: "default", elements: [{ type: "text", name: "q1" }] };
    expect(runtimeKeys(json)).toEqual([]);
    expect(lintKeys(json)).toEqual([]);
  });
});

describe("linter vs runtime: reserved names", () => {
  // "__proto__" is the one member the runtime singles out - it is never stored under that key -
  // while the other eleven are ordinary keys to it. The two halves below follow that split.
  const MEMBERS = Array.from(OBJECT_PROTOTYPE_MEMBERS).filter(name => name !== "__proto__");
  function keepsAnswer(name: string): boolean {
    try {
      const survey = new SurveyModel({ elements: [{ type: "text", name: name }] });
      survey.setValue(name, 1);
      return survey.getValue(name) === 1;
    } catch{
      return false;
    }
  }

  // --- what the runtime still cannot take ---
  // The survey keys its own hashes by Object.create(null) and skips "__proto__" on the way in
  // (Bug#11856, Bug#11858), so a top-level data key spelled like a prototype member is safe
  // today. The value objects nested inside an answer were left plain: a matrix row value and a
  // multiple text value are still {}, so reading such a key back off one of them hands out the
  // prototype member - a function, which the value cloner turns into a SyntaxError.
  test("a column named after a member throws on the first write", () => {
    MEMBERS.forEach(name => {
      const json = {
        elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "a" }, { name: name }] }],
      };
      const survey = new SurveyModel(json);
      expect(() => { cellQuestion(survey, "m", 0, 1).value = "x"; }, name).toThrow();
      expect(errors(json), name).toEqual(["name/reserved @ elements[0].columns[1].name"]);
    });
  });
  test("a multiple text item named after a member throws on the first write", () => {
    MEMBERS.forEach(name => {
      const json = { elements: [{ type: "multipletext", name: "mt", items: [{ name: "a" }, { name: name }] }] };
      const survey = new SurveyModel(json);
      const question = <any>survey.getQuestionByName("mt");
      expect(() => { question.items[0].value = "x"; question.items[1].value = "y"; }, name).toThrow();
      expect(errors(json), name).toEqual(["name/reserved @ elements[0].items[1].name"]);
    });
  });
  // "__proto__" writes nowhere rather than throwing: the assignment would replace the prototype
  // of the plain object that carries the value, so every slot drops it on the floor instead
  test("a column or an item named __proto__ swallows the value instead of throwing", () => {
    const matrixJson = {
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "a" }, { name: "__proto__" }] }],
    };
    const matrixSurvey = new SurveyModel(matrixJson);
    cellQuestion(matrixSurvey, "m", 0, 1).value = "x";
    expect(matrixSurvey.data).toEqual({});
    expect(errors(matrixJson)).toEqual(["name/reserved @ elements[0].columns[1].name"]);

    const textJson = { elements: [{ type: "multipletext", name: "mt", items: [{ name: "a" }, { name: "__proto__" }] }] };
    const textSurvey = new SurveyModel(textJson);
    const question = <any>textSurvey.getQuestionByName("mt");
    question.items[0].value = "x";
    question.items[1].value = "y";
    expect(textSurvey.data).toEqual({ mt: { a: "x" } });
    expect(errors(textJson)).toEqual(["name/reserved @ elements[0].items[1].name"]);
  });
  test("a question named __proto__ answers itself and never reaches the data", () => {
    const json = { elements: [{ type: "text", name: "__proto__" }] };
    const survey = new SurveyModel(json);
    const question = <any>survey.getQuestionByName("__proto__");
    question.value = 1;
    // the respondent sees the answer in the question and the survey is submitted without it
    expect(question.value).toBe(1);
    expect(Object.keys(survey.data)).toEqual([]);
    expect(keepsAnswer("__proto__")).toBe(false);
    expect(errors(json)).toEqual(["name/reserved @ elements[0].name"]);
  });
  test("a calculated value named __proto__ never reaches the result", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "__proto__", expression: "1 + 1", includeIntoResult: true }],
    };
    const survey = new SurveyModel(json);
    survey.setValue("q1", 1);
    expect(Object.keys(survey.data)).toEqual(["q1"]);
    expect(errors(json)).toEqual(["name/reserved @ calculatedValues[0].name"]);
  });

  // --- policy rather than parity: the slots the runtime takes today ---
  // The rule reports the whole list in every slot that keys a value, the ones the core fix made
  // safe included. One list, any case, any context is the rule an author can remember - and a
  // name that works as a question and throws as a column of that same question is the confusing
  // part. The findings below are the linter's own claim rather than the runtime's.
  test("a question named after a member keeps its answer today - and is reported all the same", () => {
    MEMBERS.forEach(name => {
      expect(keepsAnswer(name), name).toBe(true);
      expect(errors({ elements: [{ type: "text", name: name }] }), name)
        .toEqual(["name/reserved @ elements[0].name"]);
    });
  });
  test("a matrix row named toString carries its value the way any other row does", () => {
    const json = { elements: [{ type: "matrix", name: "m", rows: ["r1", "toString"], columns: ["c1", "c2"] }] };
    const survey = new SurveyModel(json);
    const matrix = <any>survey.getQuestionByName("m");
    matrix.visibleRows[0].value = "c2";
    matrix.visibleRows[1].value = "c1";
    expect(survey.data).toEqual({ m: { r1: "c2", toString: "c1" } });
    expect(matrix.isAnswered).toBe(true);
    expect(errors(json)).toEqual(["name/reserved @ elements[0].rows[1]"]);
  });
  // the runtime lower-cases its variable names and its question lookup hashes, so a spelling that
  // survives in one slot collides in another ("Constructor" as a question, "__Proto__" as a
  // calculated value); the comparison ignores case for that reason
  test("another spelling of a member is reserved by policy", () => {
    ["ToString", "tostring", "Constructor", "__Proto__"].forEach(name => {
      expect(errors({ elements: [{ type: "text", name: name }] }), name)
        .toEqual(["name/reserved @ elements[0].name"]);
    });
  });
  test("a name padded with spaces is trimmed by the runtime, so it lands in the reserved slot", () => {
    const json = { elements: [{ type: "text", name: " toString " }] };
    const survey = new SurveyModel(json);
    const question = <any>survey.getAllQuestions()[0];
    expect(question.name).toBe("toString");
    question.value = 1;
    expect(survey.data).toEqual({ toString: 1 });
    expect(errors(json)).toEqual(["name/reserved @ elements[0].name"]);
  });
  test("a page and a panel may carry the name - neither keys a plain object", () => {
    const json = {
      pages: [{
        name: "toString",
        elements: [{ type: "panel", name: "valueOf", elements: [{ type: "text", name: "q1" }] }],
      }],
    };
    const survey = new SurveyModel(json);
    survey.setValue("q1", 1);
    expect(survey.data).toEqual({ q1: 1 });
    expect(survey.getPageByName("toString")).toBeTruthy();
    expect(survey.getPanelByName("valueOf")).toBeTruthy();
    expect(errors(json)).toEqual([]);
  });
});

describe("linter vs runtime: a name that is not a string", () => {
  // the runtime trims a name whatever it belongs to, so a page or a panel named by a number
  // stops the survey from loading the way a question does - and neither has a required name
  test("a page and a panel named by a number do not load, and property/required reports them", () => {
    const pageJson = { pages: [{ name: 1, elements: [{ type: "text", name: "q1" }] }] };
    const panelJson = { elements: [{ type: "panel", name: 5, elements: [{ type: "text", name: "q1" }] }] };
    expect(() => new SurveyModel(pageJson)).toThrow();
    expect(() => new SurveyModel(panelJson)).toThrow();
    expect(errors(pageJson)).toEqual(["property/required @ pages[0].name"]);
    expect(errors(panelJson)).toEqual(["property/required @ elements[0].name"]);
  });
});
