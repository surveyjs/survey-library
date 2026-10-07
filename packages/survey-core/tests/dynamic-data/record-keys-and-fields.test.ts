import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { Question } from "../../src/question";

/* The record keys a records question compares for keyName duplicates, and the record fields it gives
   its sort and filter. Both questions compare keys as text, and both declare the field the other text
   of a hasOther question is stored under. */

function createKeyPanel(keys: Array<any>, json?: any): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p", keyName: "k",
    templateElements: [{ type: "text", name: "k" }] }, json || {})] });
  survey.data = { p: keys.map((k: any): any => ({ k: k })) };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("p");
}
function hasKeyError(panel: QuestionPanelDynamicModel): boolean {
  return panel.panels.some((p): boolean => (<Question>p.getQuestionByName("k")).errors.length > 0);
}

describe("keyName duplicates: the panel compares keys as text", () => {
  const keys = ["a", "b", 1, "c", "1.0", "d"];
  test("1 and \"1.0\" are different keys", () => {
    const panel = createKeyPanel(keys);
    expect(panel.validate(), "#1").toBe(true);
    expect(hasKeyError(panel), "#2: no error").toBe(false);
  });
  test("a paged panel gives the same answer on every page, and completes", () => {
    const panel = createKeyPanel(keys, { panelsPerPage: 2 });
    expect(panel.validate(), "#1: page 0").toBe(true);
    panel.pageIndex = 1;
    expect(panel.pageIndex, "#2").toBe(1);
    expect(panel.validate(), "#3: page 1").toBe(true);
    panel.pageIndex = 2;
    expect(panel.validate(), "#4: page 2").toBe(true);
    const survey = <SurveyModel>panel.survey;
    expect(survey.tryComplete(), "#5: completes").toBe(true);
  });
  test("a paged panel finds a duplicate on another page", () => {
    const panel = createKeyPanel(["a", 1, "b", "1"], { panelsPerPage: 2 });
    expect(panel.validate(), "#1: page 0").toBe(false);
    const panel2 = createKeyPanel(["a", 1, "b", "1"]);
    expect(panel2.validate(), "#2: unpaged").toBe(false);
  });
  test("true and \"true\" are duplicates", () => {
    const panel = createKeyPanel([true, "true"]);
    expect(panel.validate(), "#1").toBe(false);
    expect((<Question>panel.panels[1].getQuestionByName("k")).errors.length, "#2: the later panel gets the error").toBe(1);
    expect((<Question>panel.panels[0].getQuestionByName("k")).errors.length, "#3").toBe(0);
  });
  test("the panel compares case-sensitively, the matrix does not", () => {
    expect(createKeyPanel(["A", "a"]).validate(), "#1: unpaged panel").toBe(true);
    expect(createKeyPanel(["A", "a", "b"], { panelsPerPage: 1 }).validate(), "#2: paged panel").toBe(true);
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, keyName: "k",
      columns: [{ name: "k", cellType: "text" }] }] });
    survey.data = { m: [{ k: "A" }, { k: "a" }] };
    expect((<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).validate(), "#3: matrix").toBe(false);
  });
  test("two key arrays with the same content are duplicates", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", keyName: "k",
      templateElements: [{ type: "checkbox", name: "k", choices: [1, 2, 3] }] }] });
    survey.data = { p: [{ k: [1, 2] }, { k: [1, 2] }, { k: [3] }] };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    expect(panel.validate(), "#1").toBe(false);
    expect((<Question>panel.panels[1].getQuestionByName("k")).errors.length, "#2: the later panel gets the error").toBe(1);
  });
  test("a key typed on the page that repeats the key of a record off the page", () => {
    const panel = createKeyPanel(["a", "b", "c", "1"], { panelsPerPage: 2 });
    panel.panels[0].getQuestionByName("k").value = 1;
    expect(panel.validate(), "#1: 1 and \"1\"").toBe(false);
    const panel2 = createKeyPanel(["a", "b", "c", "1"], { panelsPerPage: 2 });
    panel2.panels[0].getQuestionByName("k").value = "1.0";
    expect(panel2.validate(), "#2: \"1.0\" and \"1\"").toBe(true);
    const panel3 = createKeyPanel(["a", "b", "c", "1.0"], { panelsPerPage: 2 });
    panel3.panels[0].getQuestionByName("k").value = 1;
    expect(panel3.validate(), "#3: 1 and \"1.0\"").toBe(true);
  });
});

describe("record fields: the other text of a hasOther question", () => {
  const other = (text: string): any => ({ q: "other", "q-Comment": text });
  test("panel: getFields declares the comment field of a hasOther template question", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p",
      templateElements: [{ type: "dropdown", name: "q", choices: [1, 2], showOtherItem: true },
        { type: "dropdown", name: "both", choices: [1, 2], showOtherItem: true, showCommentArea: true }] }] });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    expect((<any>panel).getFields()).toEqual([
      { name: "q", dataType: "number" },
      { name: "both", dataType: "number" },
      { name: "both-Comment", dataType: "string" },
      { name: "q-Comment", dataType: "string" }
    ]);
  });
  test("panel: a sort by the other text compares strings", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "p", sortBy: "q-Comment",
      templateElements: [{ type: "dropdown", name: "q", choices: [1, 2], showOtherItem: true }] }] });
    survey.data = { p: [other("9"), other("10")] };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    expect(panel.panels.map((p): string => (<Question>p.getQuestionByName("q")).comment), "#1").toEqual(["10", "9"]);
  });
  test("matrix: a sort by the other text compares strings", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, sortBy: "q-Comment",
      columns: [{ name: "q", cellType: "dropdown", choices: [1, 2], showOtherItem: true }] }] });
    survey.data = { m: [other("9"), other("10")] };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.visibleRows.map((r): string => r.getQuestionByName("q").comment), "#1").toEqual(["10", "9"]);
  });
});
