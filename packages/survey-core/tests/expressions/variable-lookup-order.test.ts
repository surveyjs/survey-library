import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { ValueGetter, IValueGetterContext, IValueInfoParams } from "../../src/conditions/conditionProcessValue";
import { QuestionSelectBase } from "../../src/question_baseselect";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";

/* Which context answers a variable name. A lookup asks its own context first (a choice, a question,
   a matrix row, a dynamic panel), then each root up to the survey; the first one that finds the
   name wins. In the survey a built-in variable comes first, then a survey, page or panel property
   reference, a variable, a question and the stored data. */

function read(context: IValueGetterContext, name: string, params?: Partial<IValueInfoParams>): { isFound: boolean, value: any, question?: string } {
  const res = new ValueGetter().getValueInfo(Object.assign({ name: name, context: context }, params || {}));
  const out: { isFound: boolean, value: any, question?: string } = { isFound: res.isFound, value: res.value };
  if (!!res.question) out.question = res.question.name;
  return out;
}
function cellContext(matrix: QuestionMatrixDropdownModel | QuestionMatrixDynamicModel, rowIndex: number, column: string): IValueGetterContext {
  return matrix.visibleRows[rowIndex].getQuestionByColumnName(column).getValueGetterContext();
}

describe("variable lookup: the first context that finds a name wins", () => {
  test("a choice condition reads {item} as the choice's value, before a question, a variable and a stored value of that name", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "item" },
        { type: "radiogroup", name: "q2", choices: [
          { value: "a", visibleIf: "{item} = 'a'" },
          { value: "b", visibleIf: "{item} = 'q'" },
          { value: "c", visibleIf: "{item} = 'v'" }
        ] }
      ]
    });
    survey.setVariable("item", "v");
    survey.setValue("item", "q");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.visibleChoices.map(c => c.value), "#1: only the choice whose own value matches").toEqual(["a"]);
    expect(read(q2.choices[1].getValueGetterContext(), "item"), "#2").toEqual({ isFound: true, value: "b" });
    expect(read(q2.choices[1].getValueGetterContext(), "choice"), "#3").toEqual({ isFound: true, value: "b" });
    expect(read(q2.getValueGetterContext(), "item"), "#4: outside the choice, the variable").toEqual({ isFound: true, value: "v" });
    survey.dispose();
  });
  test("a question reads a built-in variable first, then a variable, then the question, then the stored value", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3], valuePropertyName: "id" },
        { type: "text", name: "q2", visibleIf: "{q1} = 'v'" },
        { type: "text", name: "pageno" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const ctx = q2.getValueGetterContext();
    survey.setVariable("q1", "v");
    survey.setValue("q1", [{ id: 1 }]);
    survey.setVariable("pageno", 7);
    survey.setValue("pageno", 8);
    expect(read(ctx, "pageno"), "#1: the built-in variable").toEqual({ isFound: true, value: 1 });
    expect(read(ctx, "q1"), "#2: the variable").toEqual({ isFound: true, value: "v" });
    expect(q2.isVisible, "#2: visibleIf reads the variable").toBe(true);
    survey.setVariables({}, true);
    expect(read(ctx, "q1"), "#3: the question's unwrapped value").toEqual({ isFound: true, value: [1], question: "q1" });
    expect(q2.isVisible, "#3: visibleIf reads the question").toBe(false);
    q1.page.removeElement(q1);
    expect(survey.getQuestionByName("q1"), "#4: no question").toBeFalsy();
    expect(read(ctx, "q1"), "#4: the stored value").toEqual({ isFound: true, value: [{ id: 1 }] });
    survey.dispose();
  });
  test("a matrix cell reads its row's variables before a variable and a question of that name", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "item" },
        { type: "text", name: "q1" },
        { type: "matrixdropdown", name: "m", rows: ["r1", "r2"], columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text" }] }
      ]
    });
    survey.setVariable("item", "v");
    survey.setVariable("row", { col1: "from-variable" });
    survey.setValue("item", "q");
    survey.setValue("q1", "q1-value");
    survey.setValue("m", { r1: { col1: "r1-col1" }, r2: { col1: "r2-col1" } });
    const m = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    const ctx = cellContext(m, 1, "col2");
    expect(read(ctx, "item"), "#1: the row's name").toEqual({ isFound: true, value: "r2" });
    expect(read(ctx, "row.col1"), "#2: the row's cell").toEqual({ isFound: true, value: "r2-col1", question: "col1" });
    expect(read(ctx, "q1"), "#3: a survey question").toEqual({ isFound: true, value: "q1-value", question: "q1" });
    expect(read(ctx, "rowName"), "#4").toEqual({ isFound: true, value: "r2" });
    survey.dispose();
  });
  test("a survey or page property reference comes before a variable, a question property reference after the variables", () => {
    const survey = new SurveyModel({
      title: "Survey title",
      pages: [{ name: "page1", elements: [
        { type: "text", name: "q1" },
        { type: "radiogroup", name: "q2", choices: [{ value: "a", text: "A text" }] }
      ] }]
    });
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    const itemCtx = q2.choices[0].getValueGetterContext();
    const qCtx = q2.getValueGetterContext();
    expect(read(qCtx, "$q1.isVisible"), "#1: from a question").toEqual({ isFound: true, value: true });
    expect(read(itemCtx, "$q1.isVisible"), "#2: from a choice").toEqual({ isFound: true, value: true });
    expect(read(itemCtx, "$item.text"), "#3: the choice's own property").toEqual({ isFound: true, value: "A text" });
    expect(read(qCtx, "$self.name"), "#4: the question's own property").toEqual({ isFound: true, value: "q2" });
    survey.setVariable("q1", 5);
    expect(read(qCtx, "$q1.isVisible"), "#5: a variable without the member").toEqual({ isFound: true, value: true });
    survey.setVariable("q1", { isVisible: "from-variable" });
    expect(read(qCtx, "$q1.isVisible"), "#6: a variable with the member wins over the question").toEqual({ isFound: true, value: "from-variable" });
    expect(read(itemCtx, "$q1.isVisible"), "#7: from a choice too").toEqual({ isFound: true, value: "from-variable" });
    survey.setVariable("page1", { isVisible: "from-variable" });
    expect(read(qCtx, "$page1.isVisible"), "#8: the page wins over a variable").toEqual({ isFound: true, value: true });
    survey.setVariable("survey", { title: "from-variable" });
    expect(read(qCtx, "$survey.title"), "#9: the survey wins over a variable").toEqual({ isFound: true, value: "Survey title" });
    survey.dispose();
  });
});

describe("variable lookup: a name that a context rewrites and does not find reaches the next context unchanged", () => {
  test("{prevRow.x} of a matrix row that has no such cell is read again by the survey as prevRow.x", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "x" },
        { type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "col1", cellType: "text" }] }
      ]
    });
    survey.setVariable("prevRow", { x: "from-prevRow-variable" });
    survey.setVariable("row", { x: "from-row-variable" });
    survey.setValue("x", "from-question");
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(read(cellContext(m, 1, "col1"), "prevRow.x"), "#1: the second row").toEqual({ isFound: true, value: "from-prevRow-variable" });
    expect(read(cellContext(m, 0, "col1"), "prevRow.x"), "#2: the first row has no previous row").toEqual({ isFound: true, value: undefined });
    survey.dispose();
  });
  test("{panel.x} of a dynamic panel that has no such question is read again by the survey as panel.x", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "x" },
        { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "text", name: "a" }] }
      ]
    });
    survey.setVariable("panel", { x: "from-variable" });
    survey.setValue("x", "from-question");
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const ctx = pd.panels[0].getQuestionByName("a").getValueGetterContext();
    expect(read(ctx, "panel.x"), "#1").toEqual({ isFound: true, value: "from-variable" });
    expect(read(ctx, "x"), "#2").toEqual({ isFound: true, value: "from-question", question: "x" });
    survey.dispose();
  });
  test("{$q1.isVisible} keeps its prefix at every level a choice condition reaches", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", visible: false },
        { type: "checkbox", name: "q2", choices: [{ value: 1, visibleIf: "{$q1.isVisible} = false" }, { value: 2, visibleIf: "{$q1.isVisible} = true" }] }
      ]
    });
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    q2.value = [1];
    expect(q2.visibleChoices.map(c => c.value), "#1").toEqual([1]);
    expect(read(q2.choices[0].getValueGetterContext(), "$q1.isVisible"), "#2").toEqual({ isFound: true, value: false });
    survey.dispose();
  });
});

describe("variable lookup: names in another letter case", () => {
  test("{Q1} reads q1 from a choice, a question and a matrix cell; {ITEM} reads the choice", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "radiogroup", name: "q2", choices: ["a"] },
        { type: "matrixdropdown", name: "m", rows: ["r1"], columns: [{ name: "col1", cellType: "text" }] }
      ]
    });
    survey.setValue("q1", "v1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    const m = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    expect(read(q2.choices[0].getValueGetterContext(), "Q1"), "#1: a choice").toEqual({ isFound: true, value: "v1", question: "q1" });
    expect(read(q2.getValueGetterContext(), "Q1"), "#2: a question").toEqual({ isFound: true, value: "v1", question: "q1" });
    expect(read(cellContext(m, 0, "col1"), "Q1"), "#3: a cell").toEqual({ isFound: true, value: "v1", question: "q1" });
    expect(read(q2.choices[0].getValueGetterContext(), "ITEM"), "#4: the choice's value").toEqual({ isFound: true, value: "a" });
    expect(read(cellContext(m, 0, "col1"), "ROW.COL1"), "#5: the row's cell, empty").toEqual({ isFound: true, value: undefined, question: "col1" });
    survey.dispose();
  });
  test("{self} matches in its own letter case only; {PANEL.a} reads the dynamic panel's question", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "text", name: "a" }, { type: "text", name: "b" }] }
      ]
    });
    survey.setValue("q1", "v1");
    survey.setValue("pd", [{ a: "pa" }]);
    const q1 = survey.getQuestionByName("q1");
    expect(read(q1.getValueGetterContext(), "self"), "#1").toEqual({ isFound: true, value: "v1", question: "q1" });
    expect(read(q1.getValueGetterContext(), "SELF"), "#2").toEqual({ isFound: false, value: undefined });
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const ctx = pd.panels[0].getQuestionByName("b").getValueGetterContext();
    expect(read(ctx, "PANEL.a"), "#3").toEqual({ isFound: true, value: "pa", question: "a" });
    expect(read(ctx, "panel.A"), "#4").toEqual({ isFound: true, value: "pa", question: "a" });
    survey.dispose();
  });
  test("two stored keys that differ in letter case: either name reads the first key", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.data = { a: 1, A: 2 };
    const ctx = survey.getQuestionByName("q1").getValueGetterContext();
    expect(read(ctx, "a"), "#1").toEqual({ isFound: true, value: 1 });
    expect(read(ctx, "A"), "#2").toEqual({ isFound: true, value: 1 });
    survey.dispose();
  });
});

describe("variable lookup: dotted names, value paths and indexes", () => {
  test("a dotted name that is a question name wins over a path into another question's value", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "address.city" },
        { type: "text", name: "q2" }
      ]
    });
    survey.setValue("address.city", "Paris");
    survey.setValue("address", { city: "London", zip: "N1" });
    const ctx = survey.getQuestionByName("q2").getValueGetterContext();
    expect(read(ctx, "address.city"), "#1: the question").toEqual({ isFound: true, value: "Paris", question: "address.city" });
    expect(read(ctx, "address.zip"), "#2: the stored value's member").toEqual({ isFound: true, value: "N1" });
    expect(read(ctx, "ADDRESS.ZIP"), "#3: in another letter case").toEqual({ isFound: true, value: "N1" });
    survey.dispose();
  });
  test("a path into a question's value and an indexed path into a matrix", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "multipletext", name: "mt", items: [{ name: "a" }, { name: "b" }] },
        { type: "matrixdynamic", name: "q", rowCount: 0, columns: [{ name: "a", cellType: "text" }] },
        { type: "checkbox", name: "cb", choices: [1, 2, 3] },
        { type: "text", name: "q2" }
      ]
    });
    survey.setValue("mt", { a: "mt-a" });
    survey.setValue("q", [{ a: "r0" }, { a: "r1" }]);
    survey.setValue("cb", [2, 3]);
    const ctx = survey.getQuestionByName("q2").getValueGetterContext();
    expect(read(ctx, "mt.a"), "#1").toEqual({ isFound: true, value: "mt-a", question: "a" });
    expect(read(ctx, "q[0].a"), "#2").toEqual({ isFound: true, value: "r0", question: "a" });
    expect(read(ctx, "q[1].a"), "#3").toEqual({ isFound: true, value: "r1", question: "a" });
    expect(read(ctx, "q[5].a"), "#4: no such row").toEqual({ isFound: false, value: undefined });
    expect(read(ctx, "cb[1]"), "#5").toEqual({ isFound: true, value: 3, question: "cb" });
    survey.dispose();
  });
  test("{name.length} of an array that does not exist is 0, after every context has missed", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "cb", choices: [{ value: 1, visibleIf: "{missing.length} = 0" }, 2] },
        { type: "text", name: "q2" }
      ]
    });
    survey.setValue("cb", [1, 2]);
    const cb = <QuestionSelectBase>survey.getQuestionByName("cb");
    const qCtx = survey.getQuestionByName("q2").getValueGetterContext();
    const itemCtx = cb.choices[0].getValueGetterContext();
    expect(read(qCtx, "missing.length"), "#1").toEqual({ isFound: true, value: 0 });
    expect(read(itemCtx, "missing.length"), "#2").toEqual({ isFound: true, value: 0 });
    expect(cb.visibleChoices.map(c => c.value), "#3").toEqual([1, 2]);
    expect(read(qCtx, "cb.length"), "#4: an array that exists, read inside the question's value").toEqual({ isFound: true, value: 2 });
    expect(read(itemCtx, "$item.length"), "#5: the choice has no length: its question's value has").toEqual({ isFound: true, value: 2 });
    survey.setVariable("missing", [5, 6, 7]);
    expect(read(itemCtx, "missing.length"), "#6: a variable").toEqual({ isFound: true, value: 3 });
    survey.dispose();
  });
});

describe("variable lookup: questions that store one value", () => {
  test("a dynamic panel reads a question of another dynamic panel bound to the same valueName", () => {
    const survey = new SurveyModel({
      elements: [{ type: "panel", name: "p", elements: [
        { type: "paneldynamic", name: "pd1", valueName: "shared", templateElements: [{ type: "text", name: "a" }] },
        { type: "paneldynamic", name: "pd2", valueName: "shared", templateElements: [{ type: "text", name: "b" }] }
      ] }]
    });
    survey.data = { shared: [{ a: "a0", b: "b0" }, { a: "a1", b: "b1" }] };
    const pd1 = <QuestionPanelDynamicModel>survey.getQuestionByName("pd1");
    const pd2 = <QuestionPanelDynamicModel>survey.getQuestionByName("pd2");
    const ctx = pd2.panels[1].getQuestionByName("b").getValueGetterContext();
    const res = new ValueGetter().getValueInfo({ name: "panel.a", context: ctx });
    expect({ isFound: res.isFound, value: res.value }, "#1").toEqual({ isFound: true, value: "a1" });
    expect(res.question, "#2: the bound panel's question").toBe(pd1.panels[1].getQuestionByName("a"));
    expect(read(ctx, "panel.b"), "#3: its own question").toEqual({ isFound: true, value: "b1", question: "b" });
    survey.dispose();
  });
});

describe("variable lookup: trigger writes that create the objects they write to", () => {
  test("setvalue and copyvalue triggers write a matrix cell and read it back", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "matrixdropdown", name: "m", rows: ["r1"], columns: [{ name: "col1", cellType: "text" }] },
        { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "text", name: "a" }] }
      ],
      triggers: [
        { type: "setvalue", expression: "{q1} = 1", setToName: "m.r1.col1", setValue: "x" },
        { type: "setvalue", expression: "{q1} = 1", setToName: "pd[0].a", setValue: "y" },
        { type: "copyvalue", expression: "{q1} = 2", setToName: "q2", fromName: "m.r1.col1" }
      ]
    });
    survey.setValue("q1", 1);
    expect(survey.data, "#1").toEqual({ q1: 1, m: { r1: { col1: "x" } }, pd: [{ a: "y" }] });
    const m = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    expect(m.visibleRows[0].getQuestionByColumnName("col1").value, "#2: the cell").toBe("x");
    survey.setValue("q1", 2);
    expect(survey.getValue("q2"), "#3: copied").toBe("x");
    survey.dispose();
  });
  test("setTriggerValue writes through the question it finds, and copyTriggerValue reads with createObjects", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q2" },
        { type: "matrixdynamic", name: "md", rowCount: 0, columns: [{ name: "col1", cellType: "text" }] }
      ]
    });
    survey.setTriggerValue("md[0].col1", "z", false);
    expect(survey.data, "#1: no row to write to").toEqual({});
    survey.setValue("md", [{ col1: "a" }]);
    survey.setTriggerValue("md[0].col1", "z", false);
    expect(survey.data, "#2").toEqual({ md: [{ col1: "z" }] });
    survey.copyTriggerValue("q2", "md[0].col1", false);
    expect(survey.getValue("q2"), "#3").toBe("z");
    survey.setTriggerValue("plain", 5, false);
    expect(survey.getValue("plain"), "#4: no question: the stored value").toBe(5);
    survey.setTriggerValue("a.b", 6, false);
    expect(survey.getValue("a.b"), "#5: a dotted name without a question is not written").toBeUndefined();
    survey.dispose();
  });
});
