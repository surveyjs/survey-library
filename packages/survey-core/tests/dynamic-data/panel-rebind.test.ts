import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { PanelModel } from "../../src/panel";
import { settings } from "../../src/settings";
import { FunctionFactory } from "../../src/functionsfactory";
import { CustomWidgetCollection } from "../../src/questionCustomWidgets";
import { getPanelDynamicState, getPanelPairs, getElementFieldDiffs } from "./rebind-conformance";

/* A sort, a cleared sort and a page move the list cuts keep the panels of a Dynamic Panel in list mode:
   each panel takes the record its position holds now (QuestionPanelDynamicModel.rebuildPanelsForView).
   A rebound panel has to look exactly like a panel built for its record, so every case compares the
   question that rebinds with one built fresh from the same data in the same view (getPanelDynamicState),
   and every panel and question of it field by field (getElementFieldDiffs). */

interface ITemplateCase {
  name: string;
  question: any;
  values: Array<any>;
  comments?: Array<string>;
  // A value an edit writes into the first panel.
  edit: any;
}
const keys = [3, 1, 5, 2, 4];
const templateCases: Array<ITemplateCase> = [
  { name: "text", question: { type: "text" }, values: ["a", undefined, "c", "", "e"], edit: "z" },
  { name: "text, number", question: { type: "text", inputType: "number" }, values: [3, undefined, 1, 0, 2], edit: 7 },
  { name: "text, date", question: { type: "text", inputType: "date" },
    values: ["2024-01-02", undefined, "2023-05-06", undefined, "2025-01-01"], edit: "2020-02-02" },
  { name: "text, numeric mask", question: { type: "text", maskType: "numeric", maskSettings: { thousandsSeparator: "," } },
    values: [1234.5, undefined, 12, 99999, undefined], edit: 5678 },
  { name: "text, pattern mask", question: { type: "text", maskType: "pattern", maskSettings: { pattern: "999-99" } },
    values: ["12345", undefined, "54321", undefined, "11111"], edit: "22222" },
  { name: "comment", question: { type: "comment" }, values: ["x\ny", undefined, "z", undefined, "w"], edit: "q" },
  { name: "dropdown", question: { type: "dropdown", choices: [1, 2, 3], showOtherItem: true },
    values: [1, undefined, "other", 3, 2], comments: [undefined, undefined, "my other", undefined, undefined], edit: 2 },
  { name: "checkbox", question: { type: "checkbox", choices: [1, 2, 3], showOtherItem: true },
    values: [[1, 2], undefined, ["other"], [3], undefined], comments: [undefined, undefined, "other text", undefined, undefined], edit: [3] },
  { name: "radiogroup", question: { type: "radiogroup", choices: [1, 2, 3], showOtherItem: true },
    values: [2, "other", undefined, 1, 3], comments: [undefined, "it is other", undefined, undefined, undefined], edit: 1 },
  { name: "tagbox", question: { type: "tagbox", choices: [1, 2, 3] }, values: [[1], undefined, [2, 3], undefined, [3]], edit: [1, 2] },
  { name: "boolean", question: { type: "boolean" }, values: [true, undefined, false, true, undefined], edit: false },
  { name: "rating", question: { type: "rating", rateCount: 5 }, values: [1, undefined, 5, 3, undefined], edit: 4 },
  { name: "expression", question: { type: "expression", expression: "{panel.key} * 2" }, values: [undefined, undefined, undefined, undefined, undefined], edit: undefined }
];
const sortDesc = [{ field: "key", direction: "desc" }];
// The panel title and an expression read the panel number; the panels follow panelsState.
const caseJson = { templateTitle: "Item {panelIndex}: {panel.key}", panelsState: "firstExpanded" };

/* The question under test twice: "v" as it is, and "w" hidden by a condition for some records and read-only
   for one - the conditions are decided per record. A nested panel holds it a third time, with a title that
   reads the panel number, and an expression reads {panelIndex}. */
function caseElements(templateCase: ITemplateCase): Array<any> {
  return [{ type: "text", name: "key", inputType: "number" },
    Object.assign({ name: "v" }, templateCase.question),
    Object.assign({ name: "w", visibleIf: "{panel.key} > 2", enableIf: "{panel.key} != 4" }, templateCase.question),
    { type: "panel", name: "inner", title: "Inner {panelIndex}", visibleIf: "{panel.key} != 1",
      elements: [Object.assign({ name: "n" }, templateCase.question)] },
    { type: "expression", name: "num", expression: "{panelIndex} + {panel.key}" }];
}
function caseData(templateCase: ITemplateCase): Array<any> {
  return keys.map((key: number, i: number): any => {
    const res: any = { key: key };
    const v = templateCase.values[i];
    const w = templateCase.values[(i + 1) % keys.length];
    const n = templateCase.values[(i + 2) % keys.length];
    if (v !== undefined) res.v = v;
    if (w !== undefined) res.w = w;
    if (n !== undefined) res.n = n;
    const comments = templateCase.comments || [];
    if (!!comments[i]) res["v-Comment"] = comments[i];
    if (!!comments[(i + 1) % keys.length]) res["w-Comment"] = comments[(i + 1) % keys.length];
    if (!!comments[(i + 2) % keys.length]) res["n-Comment"] = comments[(i + 2) % keys.length];
    return res;
  });
}
function createPanel(elements: Array<any>, data: Array<any>, json?: any, surveyJson?: any): QuestionPanelDynamicModel {
  const survey = new SurveyModel(Object.assign({
    elements: [Object.assign({ type: "paneldynamic", name: "p", allowSort: true, templateElements: elements }, json)]
  }, surveyJson));
  survey.data = { p: JSON.parse(JSON.stringify(data)) };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("p");
}
// A question that renders: its panels are built, as a UI shows them.
function render(question: QuestionPanelDynamicModel): QuestionPanelDynamicModel {
  question.renderedPanels;
  return question;
}
function surveyOf(question: QuestionPanelDynamicModel): SurveyModel {
  return <SurveyModel>question.survey;
}
function panelsOf(question: QuestionPanelDynamicModel): Array<PanelModel> {
  return question.panels.slice();
}
function storedRecords(question: QuestionPanelDynamicModel): Array<any> {
  return surveyOf(question).data.p;
}
function isSamePanels(question: QuestionPanelDynamicModel, panels: Array<PanelModel>): boolean {
  const current = question.panels;
  return current.length === panels.length && current.every((panel: PanelModel, i: number): boolean => panel === panels[i]);
}
/* The question a fresh build gives for the view the question shows now: the same template and data, the
   sort in the JSON, and the page assigned before the panels are built. */
function createFresh(question: QuestionPanelDynamicModel, elements: Array<any>, json?: any, surveyJson?: any): QuestionPanelDynamicModel {
  const sort = question.sortCriteria.map((item: any): any => ({ field: item.field, direction: item.direction }));
  const res = createPanel(elements, storedRecords(question), Object.assign({}, json, sort.length > 0 ? { sortCriteria: sort } : {}), surveyJson);
  res.pageIndex = question.pageIndex;
  return render(res);
}
function expectSameAsFresh(question: QuestionPanelDynamicModel, elements: Array<any>, json?: any, surveyJson?: any, message: string = ""): void {
  const fresh = createFresh(question, elements, json, surveyJson);
  expect(getPanelDynamicState(render(question)), message).toEqual(getPanelDynamicState(fresh));
  // The private fields too, of every panel and question: what the public state does not show.
  question.panels.forEach((panel: PanelModel, i: number): void => {
    getPanelPairs(panel, fresh.panels[i]).forEach(([el, freshEl, name]): void => {
      expect(getElementFieldDiffs(el, freshEl), message + ": the fields of panel " + i + ", " + name).toEqual({});
    });
  });
}

describe("Panel rebind: a rebound panel looks like a panel built for its record", () => {
  templateCases.forEach((templateCase: ITemplateCase): void => {
    const elements = caseElements(templateCase);
    test(templateCase.name + ": a sort and a cleared sort", () => {
      const question = render(createPanel(elements, caseData(templateCase), caseJson));
      const panels = panelsOf(question);
      const data = surveyOf(question).data;
      question.sort(sortDesc);
      expect(isSamePanels(question, panels), "#1: the panels are rebound").toBe(true);
      expectSameAsFresh(question, elements, caseJson, undefined, "#2: sorted");
      expect(surveyOf(question).data, "#3: the data").toEqual(data);
      question.sort([]);
      expect(isSamePanels(question, panels), "#4: the panels are rebound").toBe(true);
      expectSameAsFresh(question, elements, caseJson, undefined, "#5: the sort is cleared");
      expect(surveyOf(question).data, "#6: the data").toEqual(data);
    });
    test(templateCase.name + ": a page move", () => {
      const json = Object.assign({ pageSize: 2 }, caseJson);
      const question = render(createPanel(elements, caseData(templateCase), json));
      const panels = panelsOf(question);
      const data = surveyOf(question).data;
      question.nextPage();
      expect(isSamePanels(question, panels), "#1: the panels are rebound").toBe(true);
      expectSameAsFresh(question, elements, json, undefined, "#2: page 2");
      question.sort(sortDesc);
      expectSameAsFresh(question, elements, json, undefined, "#3: sorted on page 2");
      question.nextPage();
      expect(isSamePanels(question, panels.slice(0, 1)), "#4: the last page has one panel: rebuilt").toBe(false);
      expectSameAsFresh(question, elements, json, undefined, "#5: page 3");
      expect(surveyOf(question).data, "#6: the data").toEqual(data);
    });
    test(templateCase.name + ": an edit, then a sort", () => {
      const question = render(createPanel(elements, caseData(templateCase), caseJson));
      const panels = panelsOf(question);
      if (templateCase.edit !== undefined) {
        panels[0].getQuestionByName("v").value = templateCase.edit;
        panels[1].getQuestionByName("v").value = templateCase.edit;
        panels[1].getQuestionByName("n").value = templateCase.edit;
      }
      question.sort(sortDesc);
      expect(isSamePanels(question, panels), "#1: the panels are rebound").toBe(true);
      expectSameAsFresh(question, elements, caseJson, undefined, "#2: sorted after the edit");
      if (templateCase.edit !== undefined) {
        expect(storedRecords(question)[0].v, "#3: the edit reached its record").toEqual(templateCase.edit);
        expect(storedRecords(question)[1].n, "#4: the nested edit reached its record").toEqual(templateCase.edit);
      }
    });
  });
  [{ name: "without paging", json: { templateVisibleIf: "{panel.key} != 2" } },
    { name: "pageSize: 2", json: { templateVisibleIf: "{panel.key} != 2", pageSize: 2 } }]
    .forEach((item: { name: string, json: any }): void => {
      test("templateVisibleIf, " + item.name + ": a panel that becomes hidden or shown", () => {
        /* Without the expression that reads {panelIndex}: a fresh build sorted from the JSON, paged and with
           hidden panels writes records of that expression alone - a defect of the first build, not of the
           rebind, which the reference here must not carry. */
        const elements = caseElements(templateCases[6]).filter((el: any): boolean => el.name !== "num");
        const json = Object.assign({}, caseJson, item.json);
        const question = render(createPanel(elements, caseData(templateCases[6]), json));
        question.sort(sortDesc);
        expectSameAsFresh(question, elements, json, undefined, "#1: sorted");
        if (question.pageCount > 1) {
          question.nextPage();
          expectSameAsFresh(question, elements, json, undefined, "#2: page 2");
        }
        question.sort([]);
        expectSameAsFresh(question, elements, json, undefined, "#3: the sort is cleared");
      });
    });
  ["default", "expanded", "collapsed", "firstExpanded"].forEach((state: string): void => {
    test("panelsState: " + state + ": a panel collapsed or expanded by the user comes back as panelsState says", () => {
      const elements = caseElements(templateCases[0]);
      const json = { templateTitle: "Item {panelIndex}", panelsState: state, pageSize: 2 };
      const question = render(createPanel(elements, caseData(templateCases[0]), json));
      const panels = panelsOf(question);
      panels[0].collapse();
      panels[1].expand();
      (<PanelModel>panels[1].getElementByName("inner")).collapse();
      question.sort(sortDesc);
      expect(isSamePanels(question, panels), "#1").toBe(true);
      expectSameAsFresh(question, elements, json, undefined, "#2: sorted");
      panels[1].collapse();
      question.nextPage();
      expect(isSamePanels(question, panels), "#3").toBe(true);
      expectSameAsFresh(question, elements, json, undefined, "#4: page 2");
    });
  });
  test("question numbers on the panel follow a rebind", () => {
    const elements = caseElements(templateCases[0]);
    const json = Object.assign({ pageSize: 2, showQuestionNumbers: "onPanel" }, caseJson);
    const question = render(createPanel(elements, caseData(templateCases[0]), json, { showQuestionNumbers: true }));
    question.sort(sortDesc);
    expectSameAsFresh(question, elements, json, { showQuestionNumbers: true }, "#1");
    question.nextPage();
    expectSameAsFresh(question, elements, json, { showQuestionNumbers: true }, "#2");
  });
});

const plainElements = [{ type: "text", name: "key", inputType: "number" }, { type: "text", name: "name" }];
const plainData = [{ key: 3, name: "c" }, { key: 1, name: "a" }, { key: 5, name: "e" }, { key: 2, name: "b" }, { key: 4, name: "d" }];
function names(question: QuestionPanelDynamicModel): Array<any> {
  return question.panels.map((panel: PanelModel): any => panel.getQuestionByName("name").value);
}
function storedNames(question: QuestionPanelDynamicModel): Array<any> {
  return storedRecords(question).map((record: any): any => record.name);
}

describe("Panel rebind: what a panel holds for its record goes", () => {
  const elements = [{ type: "text", name: "key", inputType: "number" },
    { type: "text", name: "v", isRequired: true },
    { type: "text", name: "p", maskType: "pattern", maskSettings: { pattern: "999-99" } },
    { type: "dropdown", name: "d", choices: [1, 2, 3] },
    { type: "panel", name: "inner", elements: [{ type: "text", name: "x", isRequired: true }] },
    // A required panel shows an error of its own while none of its questions is answered.
    { type: "panel", name: "req", isRequired: true, elements: [{ type: "text", name: "y" }] }];
  const data = [{ key: 2, v: "b", d: 1, x: "1", y: "1" }, { key: 1, d: 2 }, { key: 3, v: "c", p: "12345", x: "3", y: "3" }];
  test("a panel with errors loses them on a sort from code, as a rebuilt one does", () => {
    const question = render(createPanel(elements, data, caseJson));
    const panels = panelsOf(question);
    expect(question.validate(true), "#1").toBe(false);
    expect(panels[1].getQuestionByName("v").errors.length, "#2: the empty question shows an error").toBe(1);
    expect(panels[1].getElementByName("req")["errors"].length, "#3: the required nested panel shows an error").toBe(1);
    question.sort(sortDesc);
    expect(isSamePanels(question, panels), "#4: rebound").toBe(true);
    expect(panels.map((panel: PanelModel): number => panel.getQuestionByName("v").errors.length), "#5: no errors").toEqual([0, 0, 0]);
    expect(panels.map((panel: PanelModel): number => panel.getElementByName("req")["errors"].length), "#6: no panel errors").toEqual([0, 0, 0]);
    expectSameAsFresh(question, elements, caseJson, undefined, "#7");
  });
  test("an incomplete masked entry and an open, filtered dropdown are dropped", () => {
    const question = render(createPanel(elements, data, caseJson));
    const panels = panelsOf(question);
    const masked: any = panels[0].getQuestionByName("p");
    masked.inputValue = "12";
    const dropdown: any = panels[1].getQuestionByName("d");
    dropdown.dropdownListModel.inputStringRendered = "2";
    dropdown.dropdownListModel.popupModel.isVisible = true;
    question.sort(sortDesc);
    expect(isSamePanels(question, panels), "#1: rebound").toBe(true);
    expectSameAsFresh(question, elements, caseJson, undefined, "#2");
  });
});

describe("Panel rebind: the panels are kept for a sort and a page move, and rebuilt otherwise", () => {
  test("a sort, a cleared sort and a page move keep the panel objects", () => {
    const question = render(createPanel(plainElements, plainData, { pageSize: 2 }));
    const panels = panelsOf(question);
    question.sort(sortDesc);
    expect(isSamePanels(question, panels), "#1: a sort").toBe(true);
    expect(names(question), "#2").toEqual(["e", "d"]);
    question.nextPage();
    expect(isSamePanels(question, panels), "#3: a page move").toBe(true);
    expect(names(question), "#4").toEqual(["c", "b"]);
    question.sort([]);
    expect(isSamePanels(question, panels), "#5: a cleared sort keeps the page and the panels").toBe(true);
    expect(names(question), "#6").toEqual(["e", "b"]);
  });
  test("a filter and refreshView() rebuild them", () => {
    const question = render(createPanel(plainElements, plainData));
    let panels = panelsOf(question);
    question.sort(sortDesc);
    question.filterExpression = "{key} != 9";
    expect(isSamePanels(question, panels), "#1: a filter").toBe(false);
    panels = panelsOf(question);
    question.refreshView();
    expect(isSamePanels(question, panels), "#2: refreshView()").toBe(false);
  });
  interface IFallback { name: string, json?: any, surveyJson?: any, elements?: Array<any>, setup?: (question: QuestionPanelDynamicModel) => void }
  const withQuestion = (question: any): Array<any> => [plainElements[0], Object.assign({ name: "name" }, question)];
  const fallbacks: Array<IFallback> = [
    { name: "carousel mode", json: { displayMode: "carousel" } },
    { name: "tab mode", json: { displayMode: "tab", templateTabTitle: "{panel.name}" } },
    { name: "onQuestionCreated", setup: (q) => { surveyOf(q).onQuestionCreated.add(() => { }); } },
    { name: "onAfterRenderQuestion", setup: (q) => { surveyOf(q).onAfterRenderQuestion.add(() => { }); } },
    { name: "onAfterRenderQuestionInput", setup: (q) => { surveyOf(q).onAfterRenderQuestionInput.add(() => { }); } },
    { name: "onAfterRenderPanel", setup: (q) => { surveyOf(q).onAfterRenderPanel.add(() => { }); } },
    { name: "onGetQuestionTitleActions", setup: (q) => { surveyOf(q).onGetQuestionTitleActions.add(() => { }); } },
    { name: "onGetPanelTitleActions", setup: (q) => { surveyOf(q).onGetPanelTitleActions.add(() => { }); } },
    { name: "onGetPanelFooterActions", setup: (q) => { surveyOf(q).onGetPanelFooterActions.add(() => { }); } },
    { name: "onUpdateQuestionCssClasses", setup: (q) => { surveyOf(q).onUpdateQuestionCssClasses.add(() => { }); } },
    { name: "onUpdatePanelCssClasses", setup: (q) => { surveyOf(q).onUpdatePanelCssClasses.add(() => { }); } },
    { name: "onDynamicPanelAdded", setup: (q) => { surveyOf(q).onDynamicPanelAdded.add(() => { }); } },
    { name: "clearInvisibleValues: onHidden", surveyJson: { clearInvisibleValues: "onHidden" } },
    { name: "a template defaultValue", elements: withQuestion({ type: "text", defaultValue: "x" }) },
    { name: "a template defaultValueExpression", elements: withQuestion({ type: "text", defaultValueExpression: "{panel.key}" }) },
    { name: "a nested defaultValue", elements: [plainElements[0], plainElements[1],
      { type: "panel", name: "inner", elements: [{ type: "text", name: "x", defaultValue: "x" }] }] },
    { name: "a nested dynamic panel", elements: [plainElements[0], plainElements[1],
      { type: "paneldynamic", name: "inner", templateElements: [{ type: "text", name: "x" }] }] },
    { name: "a nested dynamic matrix", elements: [plainElements[0], plainElements[1],
      { type: "panel", name: "inner", elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "c" }] }] }] },
    { name: "a file question", elements: withQuestion({ type: "file" }) },
    { name: "a signature question", elements: withQuestion({ type: "signaturepad" }) },
    { name: "a multiple text question", elements: withQuestion({ type: "multipletext", items: [{ name: "i" }] }) },
    { name: "single-input mode", surveyJson: { questionsOnPageMode: "inputPerPage" } },
    { name: "choices loaded on demand", elements: withQuestion({ type: "dropdown", choicesLazyLoadEnabled: true }) },
    { name: "a choice with elements", elements: withQuestion({ type: "checkbox", choices: [{ value: 1, elements: [{ type: "text", name: "t" }] }, 2] }) }
  ];
  fallbacks.forEach((fallback: IFallback): void => {
    test("rebuilt: " + fallback.name, () => {
      const elements = fallback.elements || plainElements;
      const question = createPanel(elements, plainData, Object.assign({ pageSize: 2 }, fallback.json), fallback.surveyJson);
      if (!!fallback.setup) fallback.setup(question);
      const isSingleInput = surveyOf(question).isSingleVisibleInput;
      if (!isSingleInput) render(question);
      let panels = panelsOf(question);
      question.sort(sortDesc);
      expect(isSamePanels(question, panels), "#1: a sort").toBe(false);
      // Single-input mode does not page.
      if (isSingleInput) return;
      panels = panelsOf(question);
      // A carousel follows its current record to its page on a sort: the move goes to another page.
      const pageIndex = question.pageIndex === 1 ? 2 : 1;
      question.pageIndex = pageIndex;
      expect(question.pageIndex, "#2").toBe(pageIndex);
      expect(isSamePanels(question, panels), "#3: a page move").toBe(false);
    });
  });
  test("rebuilt: a remote source", () => {
    const question = render(createPanel(plainElements, [], { pageSize: 2 }));
    question.dataSource = { read: (): Array<any> => plainData.map((record: any): any => Object.assign({}, record)) };
    let panels = panelsOf(question);
    expect(panels.length, "#1").toBe(2);
    question.sort(sortDesc);
    expect(isSamePanels(question, panels), "#2: a sort").toBe(false);
    panels = panelsOf(question);
    question.pageIndex = 1;
    expect(isSamePanels(question, panels), "#3: a page move").toBe(false);
  });
  test("rebuilt: the page move of an add", () => {
    const question = render(createPanel(plainElements, plainData.slice(0, 4), { pageSize: 2 }));
    const panels = panelsOf(question);
    question.addPanel();
    expect(question.pageIndex, "#1: the new record's page").toBe(2);
    expect(question.panels.some((panel: PanelModel): boolean => panels.indexOf(panel) > -1), "#2: new panels").toBe(false);
  });
  test("rebuilt: choices loaded from a URL - a load the old record started would write into the new one", () => {
    const globalAny: any = globalThis;
    const savedXhr = globalAny.XMLHttpRequest;
    globalAny.XMLHttpRequest = class { open(): void { } setRequestHeader(): void { } send(): void { } };
    try {
      const elements = withQuestion({ type: "dropdown", choicesByUrl: { url: "http://localhost/choices/{panel.key}" } });
      const question = render(createPanel(elements, plainData));
      const panels = panelsOf(question);
      question.sort(sortDesc);
      expect(isSamePanels(question, panels), "#1").toBe(false);
    } finally {
      globalAny.XMLHttpRequest = savedXhr;
    }
  });
  test("rebuilt: a panel question whose validator is still running", () => {
    const callbacks: Array<(res: any) => void> = [];
    FunctionFactory.Instance.register("panelRebindAsyncCheck", function (): any { callbacks.push(this.returnResult); return false; }, true);
    try {
      const elements = withQuestion({ type: "text", validators: [{ type: "expression", expression: "panelRebindAsyncCheck({panel.name}) = 1" }] });
      const question = render(createPanel(elements, plainData));
      const panels = panelsOf(question);
      question.validate(true);
      expect(callbacks.length > 0, "#1: a validator is running").toBe(true);
      question.sort(sortDesc);
      expect(isSamePanels(question, panels), "#2").toBe(false);
      callbacks.forEach((callback: (res: any) => void): void => callback(1));
    } finally {
      FunctionFactory.Instance.unregister("panelRebindAsyncCheck");
    }
  });
  test("rebuilt: a nested question whose async expression is still running - its result would land in another record", () => {
    const calls: Array<{ key: any, done: (res: any) => void }> = [];
    FunctionFactory.Instance.register("panelRebindAsyncExpr", function (params: Array<any>): any {
      calls.push({ key: params[0], done: this.returnResult }); return false;
    }, true);
    try {
      const elements = [plainElements[0], { type: "panel", name: "inner",
        elements: [{ type: "expression", name: "e", expression: "panelRebindAsyncExpr({panel.key})" }] }];
      const question = render(createPanel(elements, [{ key: 1 }, { key: 2 }]));
      const panels = panelsOf(question);
      expect(calls.length > 0, "#1: a run is pending").toBe(true);
      question.sort(sortDesc);
      expect(isSamePanels(question, panels), "#2").toBe(false);
      calls.forEach((call): void => call.done("r-" + call.key));
      expect(storedRecords(question), "#3: each record gets its own result").toEqual([{ key: 1, e: "r-1" }, { key: 2, e: "r-2" }]);
    } finally {
      FunctionFactory.Instance.unregister("panelRebindAsyncExpr");
    }
  });
  test("rebuilt: a nested question with a custom widget - it is set up for the record its element is mounted for", () => {
    const widgets = CustomWidgetCollection.Instance.widgets;
    CustomWidgetCollection.Instance.addCustomWidget({ name: "panelRebindWidget", isFit: (question: any): boolean => question.name === "panelRebindWidgetQ" });
    try {
      const elements = [plainElements[0], { type: "panel", name: "inner", elements: [{ type: "text", name: "panelRebindWidgetQ" }] }];
      const question = render(createPanel(elements, plainData));
      const panels = panelsOf(question);
      question.sort(sortDesc);
      expect(isSamePanels(question, panels), "#1").toBe(false);
    } finally {
      widgets.splice(widgets.indexOf(CustomWidgetCollection.Instance.getCustomWidgetByName("panelRebindWidget")), 1);
    }
  });
});

describe("Panel rebind: questions, panels and texts that depend on each other", () => {
  const choicesData = [{ key: 3, src: [1, 2], dst: 1 }, { key: 1, src: [3], dst: 3 }, { key: 5, src: [4, 2], dst: 4 }];
  const dependent = (mode: string): any => ({ type: "dropdown", name: "dst", choicesFromQuestion: "panel.src", choicesFromQuestionMode: mode, isRequired: true });
  const source = { type: "checkbox", name: "src", choices: [1, 2, 3, 4] };
  ["selected", "unselected"].forEach((mode: string): void => {
    test("rebuilt: choicesFromQuestion \"" + mode + "\" before its source - the dependent would see the source still empty", () => {
      const elements = [plainElements[0], dependent(mode), source];
      const data = mode === "selected" ? choicesData : [{ key: 3, src: [1, 2], dst: 3 }, { key: 1, src: [3], dst: 1 }, { key: 5, src: [4, 2], dst: 1 }];
      const question = render(createPanel(elements, data));
      const panels = panelsOf(question);
      question.sort(sortDesc);
      expect(isSamePanels(question, panels), "#1").toBe(false);
      expect(question.panels.map((panel: PanelModel): any => panel.getQuestionByName("dst").value), "#2").toEqual([data[2].dst, data[0].dst, data[1].dst]);
      expect(surveyOf(question).validate(true), "#3: every dependent keeps its value").toBe(true);
    });
  });
  test("choicesFromQuestion \"all\" keeps the panels: the choices do not follow a value", () => {
    const elements = [plainElements[0], { type: "dropdown", name: "dst", choicesFromQuestion: "panel.src" }, source];
    const question = render(createPanel(elements, choicesData));
    const panels = panelsOf(question);
    question.sort(sortDesc);
    expect(isSamePanels(question, panels), "#1").toBe(true);
    expectSameAsFresh(question, elements, undefined, undefined, "#2");
  });
  test("choicesVisibleIf that reads a question after it: the value survives the swap of the records", () => {
    const elements = [plainElements[0], { type: "checkbox", name: "dst", choices: [1, 2, 3, 4], choicesVisibleIf: "{panel.src} contains {item}" }, source];
    const data = [{ key: 3, src: [1, 2], dst: [1, 2] }, { key: 1, src: [3], dst: [3] }, { key: 5, src: [4, 2], dst: [4] }];
    const question = render(createPanel(elements, data));
    const panels = panelsOf(question);
    question.sort(sortDesc);
    expect(isSamePanels(question, panels), "#1").toBe(true);
    expectSameAsFresh(question, elements, undefined, undefined, "#2");
    expect(storedRecords(question), "#3").toEqual(data);
  });
  [{ name: "a nested panel's visibleIf", elements: [plainElements[0], { type: "panel", name: "inner", visibleIf: "panelRebindAsyncVis({panel.key})",
    elements: [{ type: "text", name: "x" }] }], json: {} },
  { name: "templateVisibleIf", elements: plainElements, json: { templateVisibleIf: "panelRebindAsyncVis({panel.key})" } }]
    .forEach((item: { name: string, elements: Array<any>, json: any }): void => {
      test("rebuilt: " + item.name + " still running - its result would land in another record", () => {
        const calls: Array<{ key: any, done: (res: any) => void }> = [];
        FunctionFactory.Instance.register("panelRebindAsyncVis", function (params: Array<any>): any {
          calls.push({ key: params[0], done: this.returnResult }); return false;
        }, true);
        try {
          const question = render(createPanel(item.elements, [{ key: 1 }, { key: 2 }, { key: 3 }], item.json));
          const panels = panelsOf(question);
          expect(calls.length > 0, "#1: a run is pending").toBe(true);
          question.sort(sortDesc);
          expect(isSamePanels(question, panels), "#2").toBe(false);
          calls.forEach((call): void => call.done(call.key === 1));
          const isShown = (panel: PanelModel): boolean => item.name === "templateVisibleIf" ? panel.isVisible : panel.getElementByName("inner").isVisible;
          expect(question.panels.map((panel: PanelModel): any => [panel.getQuestionByName("key").value, isShown(panel)]), "#3: each record gets its own result")
            .toEqual([[3, false], [2, false], [1, true]]);
        } finally {
          FunctionFactory.Instance.unregister("panelRebindAsyncVis");
        }
      });
    });
  test("the texts that read the record or the panel number announce their new values on a sort", () => {
    const elements = [plainElements[0], { type: "text", name: "name", title: "Name of {panel.name}" }];
    const question = render(createPanel(elements, plainData, { templateTitle: "Item {panelIndex}: {panel.name}" }));
    const panels = panelsOf(question);
    const changed: Array<string> = [];
    panels.forEach((panel: PanelModel): void => {
      panel.locTitle.renderedHtml;
      panel.locTitle.onStringChanged.add(() => { changed.push("panel " + panel.locTitle.renderedHtml); });
      const name = panel.getQuestionByName("name");
      name.locTitle.renderedHtml;
      name.locTitle.onStringChanged.add(() => { changed.push("question " + name.locTitle.renderedHtml); });
    });
    question.sort(sortDesc);
    expect(isSamePanels(question, panels), "#1").toBe(true);
    expect(changed.indexOf("panel Item 3: e") > -1, "#2: the first panel's title").toBe(true);
    expect(changed.indexOf("question Name of e") > -1, "#3: the first panel's question title").toBe(true);
  });
  test("onTextMarkdown: the rendered texts follow the record", () => {
    const elements = [plainElements[0], { type: "text", name: "name", title: "Name of {panel.name}" },
      { type: "panel", name: "inner", title: "Inner {panel.name}", elements: [{ type: "text", name: "x", title: "X of {panel.name}" }] }];
    const json = { templateTitle: "Item {panelIndex}: {panel.name}" };
    const markdown = { onTextMarkdown: undefined };
    const create = (): QuestionPanelDynamicModel => {
      const res = createPanel(elements, plainData, json, markdown);
      surveyOf(res).onTextMarkdown.add((_, options) => { options.html = "<b>" + options.text + "</b>"; });
      return render(res);
    };
    const texts = (q: QuestionPanelDynamicModel): Array<any> => q.panels.map((panel: PanelModel): any => [panel.locTitle.renderedHtml,
      panel.getQuestionByName("name").locTitle.renderedHtml, (<PanelModel>panel.getElementByName("inner")).locTitle.renderedHtml,
      panel.getQuestionByName("x").locTitle.renderedHtml]);
    const question = create();
    texts(question);
    question.sort(sortDesc);
    const fresh = create();
    fresh.sort(sortDesc);
    expect(texts(question), "#1").toEqual(texts(fresh));
    expect(texts(question)[0], "#2").toEqual(["<b>Item 3: e</b>", "<b>Name of e</b>", "<b>Inner e</b>", "<b>X of e</b>"]);
  });
});

describe("Panel rebind: the records follow the panels", () => {
  ["none", "onComplete", "onHidden", "onHiddenContainer"].forEach((mode: string): void => {
    test("survey.data does not change on a sort and a page move, clearInvisibleValues: " + mode, () => {
      const elements = [plainElements[0], plainElements[1], { type: "text", name: "extra", visibleIf: "{panel.key} > 2" }];
      const data = plainData.map((record: any): any => Object.assign({ extra: "x" + record.key }, record));
      const question = render(createPanel(elements, data, { pageSize: 2 }, { clearInvisibleValues: mode }));
      const before = JSON.parse(JSON.stringify(surveyOf(question).data));
      question.sort(sortDesc);
      expect(surveyOf(question).data, "#1: a sort").toEqual(before);
      question.nextPage();
      expect(surveyOf(question).data, "#2: a page move").toEqual(before);
      question.sort([{ field: "name", direction: "asc" }]);
      question.prevPage();
      expect(surveyOf(question).data, "#3").toEqual(before);
    });
  });
  [{ name: "defaultPanelValue", json: { defaultPanelValue: { name: "x" } } },
    { name: "copyDefaultValueFromLastEntry", json: { copyDefaultValueFromLastEntry: true } },
    { name: "minPanelCount", json: { minPanelCount: 2 } }].forEach((item: { name: string, json: any }): void => {
    test(item.name + ": a sort and a page move store what a rebuild stores", () => {
      const data = [{ key: 3 }, { key: 1, name: "a" }, { key: 5 }, { key: 2, name: "b" }, { key: 4 }];
      const run = (rebuild: boolean): any => {
        const question = createPanel(plainElements, data, Object.assign({ pageSize: 2 }, item.json));
        // A question-creation handler keeps the rebuild.
        if (rebuild) surveyOf(question).onQuestionCreated.add(() => { });
        render(question);
        const panels = panelsOf(question);
        question.sort(sortDesc);
        question.nextPage();
        question.sort([]);
        return { isRebound: isSamePanels(question, panels), data: surveyOf(question).data, names: names(question) };
      };
      const rebound = run(false);
      const rebuilt = run(true);
      expect(rebound.isRebound, "#1").toBe(true);
      expect(rebuilt.isRebound, "#2").toBe(false);
      expect(rebound.data, "#3: the data").toEqual(rebuilt.data);
      expect(rebound.names, "#4: the panels").toEqual(rebuilt.names);
    });
  });
  test("an edit made after a rebind reaches the record its panel shows, and only that record", () => {
    const question = render(createPanel(plainElements, plainData, { pageSize: 2 }));
    const log: Array<any> = [];
    surveyOf(question).onDynamicPanelValueChanged.add((_, options) => { log.push([options.panelIndex, options.name, options.value]); });
    const panels = panelsOf(question);
    question.sort(sortDesc);
    expect(isSamePanels(question, panels), "#1").toBe(true);
    panels[0].getQuestionByName("name").value = "E";
    expect(storedNames(question), "#2: record 2 (key 5)").toEqual(["c", "a", "E", "b", "d"]);
    question.nextPage();
    panels[1].getQuestionByName("name").value = "B";
    expect(storedNames(question), "#3: record 3 (key 2)").toEqual(["c", "a", "E", "B", "d"]);
    expect(panels[1].getQuestionByName("name").value, "#4").toBe("B");
    expect(panels[0].getQuestionByName("name").value, "#5: the other panel shows its own record").toBe("c");
    // The panel's position in the sorted view, as a rebuilt panel reports it.
    expect(log, "#6: the panel index of each edit").toEqual([[0, "name", "E"], [3, "name", "B"]]);
  });
  test("removing a panel after a rebind removes the record it shows", () => {
    const question = render(createPanel(plainElements, plainData, { pageSize: 2 }));
    const panels = panelsOf(question);
    question.sort(sortDesc);
    question.nextPage();
    expect(isSamePanels(question, panels), "#1").toBe(true);
    question.removePanelUI(panels[1]);
    expect(storedNames(question), "#2: key 2 is gone").toEqual(["c", "a", "e", "d"]);
  });
  test("confirmDelete asks about the record the panel shows, and a sort or a page move while it is open drops the answer", () => {
    const old = settings.confirmActionAsync;
    const callbacks: Array<(res: boolean) => void> = [];
    settings.confirmActionAsync = (message: string, callback: (res: boolean) => void): boolean => { callbacks.push(callback); return true; };
    try {
      const question = render(createPanel(plainElements, plainData, { pageSize: 2, confirmDelete: true }));
      const panels = panelsOf(question);
      question.sort(sortDesc);
      question.removePanelUI(panels[0]);
      expect(callbacks.length, "#1: asks").toBe(1);
      callbacks[0](true);
      expect(storedNames(question), "#2: key 5, the record the panel shows, is removed").toEqual(["c", "a", "b", "d"]);
      question.removePanelUI(question.panels[0]);
      expect(callbacks.length, "#3").toBe(2);
      question.sort([{ field: "key", direction: "asc" }]);
      callbacks[1](true);
      expect(storedNames(question), "#4: a sort while it was open: nothing is removed").toEqual(["c", "a", "b", "d"]);
      question.removePanelUI(question.panels[0]);
      expect(callbacks.length, "#5").toBe(3);
      question.nextPage();
      callbacks[2](true);
      expect(storedNames(question), "#6: a page move while it was open: nothing is removed").toEqual(["c", "a", "b", "d"]);
      question.removePanelUI(question.panels[0]);
      callbacks[3](true);
      expect(storedNames(question), "#7: an answer with nothing in between removes the record").toEqual(["a", "b", "d"]);
    } finally {
      settings.confirmActionAsync = old;
    }
  });
  test("sorting 60 times adds no handlers to the survey and keeps the panels", () => {
    const question = render(createPanel(caseElements(templateCases[6]), caseData(templateCases[6]), caseJson));
    const panels = panelsOf(question);
    const survey: any = surveyOf(question);
    const countHandlers = (): number => Object.keys(survey)
      .filter((key: string): boolean => !!survey[key] && typeof survey[key].length === "number" && typeof survey[key].add === "function")
      .reduce((sum: number, key: string): number => sum + survey[key].length, 0);
    const handlers = countHandlers();
    const propHandlers = survey.onPropChangeFunctions.length;
    for (let i = 0; i < 60; i++) {
      question.sort([{ field: "key", direction: i % 2 === 0 ? "desc" : "asc" }]);
    }
    expect(isSamePanels(question, panels), "#1").toBe(true);
    expect(countHandlers(), "#2").toBe(handlers);
    expect(survey.onPropChangeFunctions.length, "#3: no survey property handlers").toBe(propHandlers);
  });
});
