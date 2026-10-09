import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicItem, QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { PanelModel } from "../../src/panel";
import { FunctionFactory } from "../../src/functionsfactory";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { Question } from "../../src/question";
import { ArrayValueChoices } from "../../src/utils/array-value-choices";
import { QuestionRecordsModel } from "../../src/question_records";
import { QuestionSelectBase } from "../../src/question_baseselect";
import { ItemValue } from "../../src/itemvalue";
import { Helpers } from "../../src/helpers";
import { ConditionRunner } from "../../src/conditions/conditionRunner";
import { ChoicesRestful } from "../../src/choicesRestful";
import { settings } from "../../src/settings";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource } from "../../src/dynamic-data/dynamic-data-interfaces";

/* The per-write costs that remain once only the page is built. These are performance items: the
   tests count calls, they do not measure time. */

function records(count: number, create: (i: number) => any): Array<any> {
  const res: Array<any> = [];
  for (let i = 0; i < count; i++) {
    res.push(create(i));
  }
  return res;
}
function createPanel(json: any, data: Array<any>): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "pd" }, json)] });
  survey.data = { pd: data };
  return <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("a panel that is being built runs its conditions once, over its values", () => {
  // The expression comes first, as expHousInfoEntered comes before drpHomeTypology: attached in element
  // order, it runs before the question it reads has its value.
  const expressionFirst = [
    { type: "expression", name: "b", expression: "iif({panel.a} = '', 'No', 'Yes')" },
    { type: "text", name: "a" }
  ];
  test("a page move writes nothing when every record already holds its computed value", () => {
    const question = createPanel({ panelsPerPage: 5, templateElements: expressionFirst },
      records(20, i => ({ a: "a" + i, b: "Yes" })));
    const survey = question.survey as SurveyModel;
    expect(question.panels.length, "#1: the first page").toBe(5);
    const dataBefore = JSON.stringify(survey.data);
    const writes = vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "updateItemValue");
    const surveyWrites = vi.spyOn(SurveyModel.prototype, "setValue");
    expect(question.nextPage(), "#2").toBe(true);
    expect(question.panels.map((panel: PanelModel) => panel.getQuestionByName("a").value), "#3: the second page").toEqual(["a5", "a6", "a7", "a8", "a9"]);
    expect(writes.mock.calls.length, "#4: no panel write").toBe(0);
    expect(surveyWrites.mock.calls.length, "#5: no survey write").toBe(0);
    expect(JSON.stringify(survey.data), "#6: the data did not change").toBe(dataBefore);
    expect(question.panels.map((panel: PanelModel) => panel.getQuestionByName("b").value), "#7: the expressions are computed").toEqual(["Yes", "Yes", "Yes", "Yes", "Yes"]);
  });
  test("the first build writes nothing when every record already holds its computed value", () => {
    const writes = vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "updateItemValue");
    const question = createPanel({ panelsPerPage: 5, templateElements: expressionFirst },
      records(20, i => ({ a: i < 3 ? "a" + i : "", b: i < 3 ? "Yes" : "No" })));
    expect(question.panels.length, "#1").toBe(5);
    expect(writes.mock.calls.length, "#2: no panel write").toBe(0);
    expect(question.panels.map((panel: PanelModel) => panel.getQuestionByName("b").value), "#3").toEqual(["Yes", "Yes", "Yes", "No", "No"]);
  });
  describe("a panel that is not placed yet", () => {
    let log: Array<{ panelIndex: number, index: number, id: number }>;
    function logIndex(this: any, params: Array<any>): any {
      log.push({ panelIndex: params[0], index: this.question.data.getIndex(), id: params[1] });
      return params[1];
    }
    const lookupTemplate = [
      { type: "text", name: "id" },
      { type: "text", name: "copy", defaultValueExpression: "logRecordIndex({panelIndex}, {panel.id})" }
    ];
    function createLookupPanel(): QuestionPanelDynamicModel {
      log = [];
      FunctionFactory.Instance.register("logRecordIndex", logIndex);
      return createPanel({ panelsPerPage: 5, templateElements: lookupTemplate }, records(20, i => ({ id: i })));
    }
    afterEach(() => {
      FunctionFactory.Instance.unregister("logRecordIndex");
    });
    test("its record lookup names the record it is about to hold: getIndex() and {panelIndex}", () => {
      const question = createLookupPanel();
      expect(question.panels.length, "#1").toBe(5);
      expect(log.length > 0, "#2: the default expression ran while the panels were built").toBe(true);
      log.forEach(entry => {
        expect(entry.index, "#3: getIndex() of the panel that holds record " + entry.id).toBe(entry.id);
        expect(entry.panelIndex, "#4: {panelIndex} of the panel that holds record " + entry.id).toBe(entry.id);
      });
      log = [];
      expect(question.nextPage(), "#5").toBe(true);
      expect(log.length > 0, "#6: the second page ran it too").toBe(true);
      log.forEach(entry => {
        expect(entry.index, "#7: getIndex() of the panel that holds record " + entry.id).toBe(entry.id);
        expect(entry.panelIndex, "#8: {panelIndex} of the panel that holds record " + entry.id).toBe(entry.id);
      });
    });
    test("its writes address the record it holds", () => {
      const calls: Array<{ index: number, field: string, value: any }> = [];
      const origin = DynamicDataList.prototype.setValue;
      DynamicDataList.prototype.setValue = function (index: number, field: string, value: any): boolean {
        calls.push({ index, field, value });
        return origin.call(this, index, field, value);
      };
      try {
        const question = createLookupPanel();
        expect(question.panels.length, "#1").toBe(5);
        expect(question.nextPage(), "#2").toBe(true);
      } finally {
        DynamicDataList.prototype.setValue = origin;
      }
      const copies = calls.filter(call => call.field === "copy");
      expect(copies.length, "#3: the defaults of both pages were written").toBe(10);
      copies.forEach(call => {
        expect(call.index, "#4: the default copied from record " + call.value + " is written to it").toBe(call.value);
      });
    });
  });
  test("a new record added by addPanel() still gets its default value and its computed expression", () => {
    const question = createPanel({ panelsPerPage: 5, templateElements: [
      { type: "expression", name: "b", expression: "iif({panel.a} = '', 'No', 'Yes')" },
      { type: "text", name: "a", defaultValue: "new" },
      { type: "text", name: "c", defaultValueExpression: "{panel.a} + '!'" }
    ] }, records(3, i => ({ a: "a" + i, b: "Yes", c: "a" + i + "!" })));
    expect(question.panels.length, "#1").toBe(3);
    question.addPanel();
    expect(question.value.length, "#2").toBe(4);
    expect(question.value[3], "#3: the new record").toEqual({ a: "new", b: "Yes", c: "new!" });
    const panel = question.panels[3];
    expect(panel.getQuestionByName("a").value, "#4").toBe("new");
    expect(panel.getQuestionByName("b").value, "#5").toBe("Yes");
    expect(panel.getQuestionByName("c").value, "#6").toBe("new!");
  });
});

describe("choicesFromQuestion over an array question projects once per source value", () => {
  // Paging off: every record has a panel, and every panel a dependent dropdown. Every dropdown is
  // answered - with empty dropdowns clearIncorrectValues returns early and half of the cost is never
  // exercised.
  function createChoicesPanel(count: number): QuestionPanelDynamicModel {
    const question = createPanel({ templateElements: [
      { type: "text", name: "key" },
      { type: "text", name: "name" },
      { type: "dropdown", name: "ref", choicesFromQuestion: "pd", choiceValuesFromQuestion: "key" }
    ] }, records(count, i => ({ key: "k" + i, name: "n" + i, ref: "k" + ((i + 1) % count) })));
    expect(question.panels.length, "the panels are built").toBe(count);
    return question;
  }
  function refValues(question: QuestionPanelDynamicModel, index: number): Array<any> {
    return (<QuestionSelectBase>question.panels[index].getQuestionByName("ref")).visibleChoices.map(item => item.value);
  }
  test("a write to a field that is neither the value nor the text field: one projection, no ItemValue comparison, no search", () => {
    const question = createChoicesPanel(50);
    const toJSON = vi.spyOn(ItemValue.prototype, "toJSON");
    const projections = vi.spyOn(<any>ArrayValueChoices.prototype, "createChoices");
    const searches = vi.spyOn(ItemValue, "getItemByValue");
    question.panels[10].getQuestionByName("name").value = "changed";
    expect(question.value[10].name, "#1: the write reached the record").toBe("changed");
    expect(toJSON.mock.calls.length, "#2: no toJSON").toBe(0);
    expect(projections.mock.calls.length, "#3: one projection for the whole survey").toBe(1);
    expect(searches.mock.calls.length, "#4: no search from the dependents").toBe(0);
    expect(refValues(question, 0).length, "#5: the choices are intact").toBe(50);
    expect(question.panels[3].getQuestionByName("ref").value, "#6: the answers are intact").toBe("k4");
  });
  test("a write to the value field: every dropdown gets the new choice, the answer that named the old key is cleared", () => {
    const question = createChoicesPanel(50);
    question.panels[10].getQuestionByName("key").value = "k10x";
    for (let i = 0; i < 50; i++) {
      const values = refValues(question, i);
      expect(values.indexOf("k10x") > -1, "#1: panel " + i + " lists the new key").toBe(true);
      expect(values.indexOf("k10") > -1, "#2: panel " + i + " no longer lists the old key").toBe(false);
    }
    expect(question.panels[9].getQuestionByName("ref").isEmpty(), "#3: the answer k10 is cleared").toBe(true);
    expect(question.value[9].ref, "#4: in the record too").toBeUndefined();
    expect(question.panels[0].getQuestionByName("ref").value, "#5: the other answers stay").toBe("k1");
  });
  test("a key renamed by case only is a new choice: the projections are compared exactly", () => {
    const question = createChoicesPanel(5);
    question.panels[2].getQuestionByName("key").value = "K2";
    expect(refValues(question, 0), "#1").toEqual(["k0", "k1", "K2", "k3", "k4"]);
    question.panels[2].getQuestionByName("key").value = "K2 ";
    expect(refValues(question, 0), "#2: a trailing space counts too").toEqual(["k0", "k1", "K2 ", "k3", "k4"]);
  });
  test("the dependent's own state still applies while the projection does not change", () => {
    const question = createChoicesPanel(50);
    const dropdown = <QuestionSelectBase>question.panels[0].getQuestionByName("ref");
    const keys = records(50, i => "k" + i);
    dropdown.choicesOrder = "desc";
    const desc = [].concat(keys).sort((a: string, b: string) => -Helpers.compareStrings(a, b));
    expect(dropdown.visibleChoices.map(item => item.value), "#1: choicesOrder").toEqual(desc);
    dropdown.choicesVisibleIf = "{item} != 'k5'";
    expect(dropdown.visibleChoices.map(item => item.value), "#2: choicesVisibleIf").toEqual(desc.filter((key: string) => key !== "k5"));
    expect(refValues(question, 1).length, "#3: another dropdown keeps every choice").toBe(50);
  });
});

describe("the first build attaches every panel once", () => {
  test("30 panels built on the first rendering: 30 setSurveyImpl calls, not 60", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "html", name: "intro", html: "start" }] },
        { elements: [{ type: "paneldynamic", name: "pd", templateElements: [
          { type: "text", name: "a" },
          { type: "expression", name: "b", expression: "iif({panel.a} = '', 'No', 'Yes')" }
        ] }] }
      ]
    });
    survey.data = { pd: records(30, i => ({ a: "a" + i, b: "Yes" })) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const attach = vi.spyOn(PanelModel.prototype, "setSurveyImpl");
    let created = 0;
    survey.onQuestionCreated.add(() => { created++; });
    survey.currentPageNo = 1;
    expect(question.panels.length, "#1").toBe(30);
    expect(attach.mock.calls.length, "#2: one attach per panel").toBe(30);
    expect(created, "#3: every panel question is announced once").toBe(60);
    expect(question.panels[29].getQuestionByName("b").value, "#4: the conditions ran").toBe("Yes");
    expect(question.panels[29].getQuestionByName("a").value, "#5").toBe("a29");
  });
  test("panels that existed before the first build are attached again: a question built outside a survey", () => {
    const question = new QuestionPanelDynamicModel("pd");
    question.template.addNewQuestion("text", "a");
    question.panelCount = 2;
    expect(question.panels.length, "#1: built without a survey").toBe(2);
    const survey = new SurveyModel({ elements: [] });
    survey.pages[0].addElement(question);
    survey.data = { pd: [{ a: "x" }, { a: "y" }] };
    expect(question.panels[1].getQuestionByName("a").value, "#2: the panels read the survey").toBe("y");
    expect(question.panels[1].survey === survey, "#3").toBe(true);
  });
});

describe("a single-field write copies the whole array only where a caller needs the copy", () => {
  function createBoundSurvey(): SurveyModel {
    const template = [{ type: "text", name: "a" }, { type: "text", name: "b" }];
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "pd1", valueName: "rec", templateElements: template },
      { type: "paneldynamic", name: "pd2", valueName: "rec", templateElements: template },
      { type: "matrixdynamic", name: "m", valueName: "rec", columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }] }
    ] });
    survey.data = { rec: records(50, i => ({ a: "a" + i, b: "b" + i, nested: { x: i } })) };
    expect((<QuestionPanelDynamicModel>survey.getQuestionByName("pd1")).panels.length, "pd1 is built").toBe(50);
    expect((<QuestionPanelDynamicModel>survey.getQuestionByName("pd2")).panels.length, "pd2 is built").toBe(50);
    expect((<any>survey.getQuestionByName("m")).visibleRows.length, "m is built").toBe(50);
    return survey;
  }
  test("one field of one record, three questions bound to the value: 5 whole-array copies, not 7", () => {
    const survey = createBoundSurvey();
    const pd1 = <QuestionPanelDynamicModel>survey.getQuestionByName("pd1");
    const copies = vi.spyOn(Helpers, "getUnbindValue");
    pd1.panels[10].getQuestionByName("b").value = "changed";
    const wholeArray = copies.mock.calls.filter(call => Array.isArray(call[0]) && call[0].length === 50);
    // Kept: the survey hash gets its own copy (survey.setValue), each sibling gets its own copy
    // (updateValueFromSurvey of pd2 and m), and the old value is copied for the value-change
    // notifications (Question.setNewValue and survey.setValue). The matrix hands its rows their
    // records without copying the value it receives.
    expect(wholeArray.length, "#1").toBe(5);
    expect(survey.data.rec[10].b, "#2").toBe("changed");
    expect((<QuestionPanelDynamicModel>survey.getQuestionByName("pd2")).panels[10].getQuestionByName("b").value, "#3").toBe("changed");
  });
  test("onDynamicPanelValueChanged gets an oldValue snapshot", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [
      { type: "checkbox", name: "c", choices: ["x", "y", "z"] }
    ] }] });
    const oldValues: Array<any> = [];
    survey.onDynamicPanelValueChanged.add((_, options) => { oldValues.push(options.oldValue); });
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const checkbox = pd.panels[0].getQuestionByName("c");
    checkbox.value = ["x"];
    checkbox.value = ["x", "y"];
    checkbox.value = ["x", "y", "z"];
    expect(oldValues.length, "#1").toBe(3);
    expect(oldValues[1], "#2: the snapshot of the second write is kept although the array is updated in place").toEqual(["x"]);
    expect(oldValues[2], "#3").toEqual(["x", "y"]);
    oldValues[2].push("mutated");
    expect(checkbox.value, "#4: the snapshot is not the question's value").toEqual(["x", "y", "z"]);
  });
  test("storage that updates the hash in place still reports the change", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q" }] });
    const store: any = {};
    survey.valueHashGetDataCallback = (_, key) => store[key];
    survey.valueHashSetDataCallback = (_, key, value) => {
      if (Array.isArray(store[key]) && Array.isArray(value)) {
        store[key].splice(0, store[key].length, ...value);
      } else {
        store[key] = value;
      }
    };
    survey.valueHashDeleteDataCallback = (_, key) => { delete store[key]; };
    let changed = 0;
    survey.onValueChanged.add(() => { changed++; });
    survey.setValue("arr", [{ a: 1 }]);
    survey.setValue("arr", [{ a: 2 }]);
    expect(changed, "#1: both writes notify").toBe(2);
    expect(store.arr, "#2").toEqual([{ a: 2 }]);
  });
  test("an equal write is still a no-op, a different one is not (survey.isValueEqual)", () => {
    const survey = createBoundSurvey();
    let changed = 0;
    survey.onValueChanged.add(() => { changed++; });
    survey.setValue("rec", JSON.parse(JSON.stringify(survey.data.rec)));
    expect(changed, "#1: the same records").toBe(0);
    const rec = JSON.parse(JSON.stringify(survey.data.rec));
    rec[5].a = "other";
    survey.setValue("rec", rec);
    expect(changed, "#2: one record differs").toBe(1);
    expect((<QuestionPanelDynamicModel>survey.getQuestionByName("pd2")).panels[5].getQuestionByName("a").value, "#3").toBe("other");
  });
  test("the kept copies: mutating what a question or a handler received leaves the others as they were", () => {
    const survey = createBoundSurvey();
    const pd1 = <QuestionPanelDynamicModel>survey.getQuestionByName("pd1");
    const pd2 = <QuestionPanelDynamicModel>survey.getQuestionByName("pd2");
    let received: any;
    survey.onValueChanged.add((_, options) => { received = options.value; });
    pd1.panels[10].getQuestionByName("b").value = "changed";
    pd2.value[3].nested.x = "mutated";
    pd2.value[4].a = "mutated";
    expect(survey.data.rec[3].nested.x, "#1: survey.data").toBe(3);
    expect(survey.data.rec[4].a, "#2").toBe("a4");
    expect(pd1.value[3].nested.x, "#3: the sibling").toBe(3);
    expect(pd1.value[4].a, "#4").toBe("a4");
    pd1.value[6].nested.x = "mutated";
    expect(pd2.value[6].nested.x, "#5: the other way round").toBe(6);
    expect(received[6].nested.x, "#6: the handler's value").toBe(6);
  });
  test("survey.questionValueChanged gets a copy of the old value for every question, not only for one inside a dynamic panel", () => {
    const survey = new SurveyModel({ elements: [{ type: "checkbox", name: "c", choices: ["x", "y"] }] });
    const question = survey.getQuestionByName("c");
    const oldValues: Array<any> = [];
    const original = survey.questionValueChanged.bind(survey);
    survey.questionValueChanged = (q: any, oldValue: any, isComment?: boolean): void => {
      oldValues.push(oldValue);
      original(q, oldValue, isComment);
    };
    question.value = ["x"];
    question.value = ["x", "y"];
    expect(oldValues, "#1").toEqual([[], ["x"]]);
    expect(oldValues[1] === question.value, "#2: a copy").toBe(false);
  });
  test("survey.setValue hands the triggers and the conditions a copy of the old value", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "t" }] });
    survey.setValue("rec", [{ a: 1 }]);
    const stored = survey.getDataValueCore((<any>survey).valuesHash, "rec");
    const spy = vi.spyOn(<any>survey, "checkTriggersAndRunConditions");
    survey.setValue("rec", [{ a: 2 }]);
    const oldValue = spy.mock.calls[0][2];
    spy.mockRestore();
    expect(oldValue, "#1").toEqual([{ a: 1 }]);
    expect(oldValue === stored, "#2: not the stored entry").toBe(false);
  });
});

/* A read() source is paged by the list, and it is the kind of source whose storage may be large - the server hands over
   everything once. A page visit, an edit and a validation must cost the page, not the record count.
   The whole-list calculations (progress, display value) are correct at O(records) and are tested for
   their result in question-source-contract.test.ts, not here. */
describe("a read() source paged by the list costs the page", () => {
  // Keyed by "id", the record's position: a source without keyField is read-only.
  class BigReadSource {
    public keyField = "id";
    public calls: number = 0;
    constructor(public data: Array<any>) { }
    public read(): Array<any> {
      this.calls++;
      return this.data.map(r => Object.assign({}, r));
    }
    public update(key: any, record: any): void {
      this.calls++;
      this.data[key] = Object.assign({}, record);
    }
  }
  interface IBigQuestion {
    survey: SurveyModel;
    question: any;
    source: BigReadSource;
    items: () => Array<any>;
    input: (position: number, name: string) => Question;
    createSpy: () => { calls: Array<any> };
  }
  function createBig(type: string, count: number): IBigQuestion {
    const json: any = type === "matrix"
      ? { type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: 20,
        columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", isRequired: true }] }
      : { type: "paneldynamic", name: "q", panelCount: 0, panelsPerPage: 20,
        templateElements: [{ type: "text", name: "a" }, { type: "text", name: "b", isRequired: true }] };
    const survey = new SurveyModel({ elements: [json] });
    const question: any = survey.getQuestionByName("q");
    const source = new BigReadSource(records(count, i => ({ id: i, a: "a" + i, b: "b" + i })));
    question.dataSource = source;
    const items = (): Array<any> => type === "matrix" ? question.visibleRows : question.panels;
    expect(items().length, "the first page is built").toBe(20);
    return {
      survey: survey, question: question, source: source, items: items,
      input: (position: number, name: string): Question => items()[position].getQuestionByName(name),
      createSpy: () => (type === "matrix"
        ? vi.spyOn(<any>QuestionMatrixDynamicModel.prototype, "createMatrixRow")
        : vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "createNewPanel")).mock
    };
  }
  // Records, not calls: one call on a whole array unbinds every record of it.
  function countUnboundRecords(spy: { calls: Array<Array<any>> }): number {
    let res = 0;
    spy.calls.forEach((call: Array<any>): void => {
      const value = call[0];
      if (!!value && typeof value === "object" && !Array.isArray(value)) res++;
    });
    return res;
  }
  function measurePageVisit(type: string, count: number): { created: number, sourceCalls: number, unbound: number } {
    const big = createBig(type, count);
    const created = big.createSpy();
    const copies = vi.spyOn(Helpers, "getUnbindValue");
    const callsBefore = big.source.calls;
    big.question.pageIndex = 3;
    expect(big.input(0, "a").value, type + " " + count + ": the page holds records 60-79").toBe("a60");
    const res = { created: created.calls.length, sourceCalls: big.source.calls - callsBefore, unbound: countUnboundRecords(copies.mock) };
    vi.restoreAllMocks();
    return res;
  }
  /* A column default must not send a page visit through the whole-value copy.
     The records are populated - every one holds the default already - so nothing is written back. */
  function measureDefaultsPageVisit(count: number, hasSource: boolean): { created: number, unbound: number, writes: number } {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "q", rowCount: hasSource ? 0 : count, rowsPerPage: 20,
      columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", defaultValue: "def" }] }] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    const data = records(count, i => ({ a: "a" + i, b: "b" + i }));
    if (hasSource) {
      question.dataSource = new BigReadSource(data);
    } else {
      survey.data = { q: data };
    }
    expect(question.visibleRows.length, "the first page is built").toBe(20);
    const created = vi.spyOn(<any>QuestionMatrixDynamicModel.prototype, "createMatrixRow");
    const copies = vi.spyOn(Helpers, "getUnbindValue");
    const writes = vi.spyOn(SurveyModel.prototype, "setValue");
    question.pageIndex = 3;
    expect(question.visibleRows[0].getQuestionByName("b").value, count + ": the stored value, not the default").toBe("b60");
    const res = { created: created.mock.calls.length, unbound: countUnboundRecords(copies.mock), writes: writes.mock.calls.length };
    vi.restoreAllMocks();
    return res;
  }
  [false, true].forEach((hasSource: boolean): void => {
    test("matrix with a column default, " + (hasSource ? "a read() source" : "question.value") + ": a page visit copies what does not grow with the record count", () => {
      const small = measureDefaultsPageVisit(1000, hasSource);
      const large = measureDefaultsPageVisit(10000, hasSource);
      expect(small.created, "#1").toBe(20);
      expect(large.created, "#2").toBe(20);
      expect(large.unbound, "#3: the copies of a visit: " + small.unbound + " at 1,000, " + large.unbound + " at 10,000").toBe(small.unbound);
      expect(large.unbound <= 2 * 20, "#4: at most two copies per record on the page").toBe(true);
      expect(large.writes, "#5: nothing is written back").toBe(0);
    });
  });
  test("matrix with a column default: records the value does not hold yet still get the default", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "q", rowCount: 3,
      columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", defaultValue: "def" }] }] });
    const question = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    survey.data = { q: [{ a: "x", b: "y" }] };
    question.rowCount = 3;
    expect(question.visibleRows.length, "#1").toBe(3);
    expect(question.value, "#2: the padded records are written with the default").toEqual([{ a: "x", b: "y" }, { b: "def" }, { b: "def" }]);
  });
  ["matrix", "panel"].forEach((type: string): void => {
    test(type + ": one page visit builds the page, calls the source 0 times, copies what does not grow with the record count", () => {
      const small = measurePageVisit(type, 1000);
      const large = measurePageVisit(type, 10000);
      expect(small.created, "#1: 1,000 records").toBe(20);
      expect(large.created, "#2: 10,000 records").toBe(20);
      expect(small.sourceCalls, "#3").toBe(0);
      expect(large.sourceCalls, "#4").toBe(0);
      expect(large.unbound, "#5: the copies of a visit: " + small.unbound + " at 1,000, " + large.unbound + " at 10,000").toBe(small.unbound);
      expect(large.unbound <= 2 * 20, "#6: at most two copies per record on the page").toBe(true);
    });
    test(type + ": one cell edit creates no object and reads nothing", () => {
      [1000, 10000].forEach((count: number): void => {
        const big = createBig(type, count);
        big.question.pageIndex = 3;
        const before = [].concat(big.items());
        const created = big.createSpy();
        const callsBefore = big.source.calls;
        big.input(0, "a").value = "edited";
        expect(created.calls.length, "#1: " + count + ", no object created").toBe(0);
        expect(big.source.calls - callsBefore, "#2: " + count + ", the update and no read").toBe(1);
        expect(big.source.data[60].a, "#3: " + count).toBe("edited");
        expect(big.items().every((item: any, i: number): boolean => item === before[i]), "#4: " + count + ", the page keeps its objects").toBe(true);
        vi.restoreAllMocks();
      });
    });
    test(type + ": tryComplete after one edit on page 0 and a move to page 3 visits one page", () => {
      [1000, 10000].forEach((count: number): void => {
        const big = createBig(type, count);
        big.input(1, "a").value = "edited";
        big.question.pageIndex = 3;
        const visits = vi.spyOn(<any>(type === "matrix" ? QuestionMatrixDynamicModel.prototype : QuestionPanelDynamicModel.prototype), "validatePageObjects");
        const callsBefore = big.source.calls;
        expect(big.survey.tryComplete(), "#1: " + count + ", every record is valid").toBe(true);
        expect(visits.mock.calls.length, "#2: " + count + ", the edited page only").toBe(1);
        expect(big.source.calls, "#3: " + count + ", nothing is read").toBe(callsBefore);
        vi.restoreAllMocks();
      });
    });
  });
});

describe("Fixed matrix: the records are composed once per answer", () => {
  function createFixedMatrix(rowCount: number): QuestionMatrixDropdownModel {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdropdown", name: "m", columns: [{ name: "a", cellType: "text" }],
        rows: records(rowCount, i => "r" + i)
      }]
    });
    survey.data = { m: { r0: { a: "0" }, r150: { a: "150" } } };
    return <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
  }
  test("creating the list, a cell edit, reads and an assignment from outside", () => {
    const matrix = createFixedMatrix(200);
    const composes = vi.spyOn(<any>QuestionMatrixDropdownModel.prototype, "composeRecords");
    const list = matrix["dataList"];
    expect(list.loadedCount, "#1").toBe(200);
    expect(composes.mock.calls.length, "#1: creating the list composes at most once").toBeLessThanOrEqual(1);
    const afterCreate = composes.mock.calls.length;
    matrix.visibleRows[3].cells[0].question.value = "x";
    expect(list.getRecord(3), "#2: the edit is read back").toEqual({ a: "x" });
    expect(composes.mock.calls.length - afterCreate, "#2: one cell edit composes at most once more").toBeLessThanOrEqual(1);
    const afterEdit = composes.mock.calls.length;
    for (let i = 0; i < 200; i++) {
      list.getRecord(i);
    }
    expect(composes.mock.calls.length - afterEdit, "#3: reads without a write compose nothing").toBe(0);
    (<SurveyModel>matrix.survey).setValue("m", { r1: { a: "1" } });
    expect(composes.mock.calls.length - afterEdit, "#4: an assignment composes nothing by itself").toBe(0);
    expect(list.getRecord(1), "#5: the next read").toEqual({ a: "1" });
    list.getRecord(2);
    expect(composes.mock.calls.length - afterEdit, "#5: composes exactly once").toBe(1);
  });
  test("a page visit builds the page and composes the records at most once; the value-level reads build no row", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdropdown", name: "m", rowsPerPage: 10, columns: [{ name: "a", cellType: "text" }], rows: records(200, i => "r" + i) }]
    });
    survey.data = { m: { r0: { a: "0" }, r150: { a: "150" } } };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    expect(matrix.visibleRows.length, "#0: the first page").toBe(10);
    const composes = vi.spyOn(<any>QuestionMatrixDropdownModel.prototype, "composeRecords");
    const builds = vi.spyOn(<any>QuestionMatrixDropdownModel.prototype, "createMatrixRow");
    matrix.nextPage();
    expect(matrix.visibleRows[0].rowName, "#1: page 1").toBe("r10");
    expect(builds.mock.calls.length, "#2: a page of rows").toBe(10);
    expect(composes.mock.calls.length, "#3: composed at most once").toBeLessThanOrEqual(1);
    builds.mockClear();
    expect(Object.keys(matrix.getFilteredData()), "#4: every answered record").toEqual(["r0", "r150"]);
    expect(matrix.getProgressInfo().answeredQuestionCount, "#5").toBe(2);
    expect(builds.mock.calls.length, "#6: no row is built for them").toBe(0);
  });
  test("a full validation visits every page and builds one page of rows at a time", () => {
    const data: any = {};
    records(30, i => "r" + i).forEach((name: string) => { data[name] = { a: name }; });
    const survey = new SurveyModel({
      elements: [{ type: "matrixdropdown", name: "m", rowsPerPage: 5, columns: [{ name: "a", cellType: "text", isRequired: true }], rows: records(30, i => "r" + i) }]
    });
    survey.data = { m: data };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    expect(matrix.visibleRows.length, "#0: the first page").toBe(5);
    const rowBuilds = vi.spyOn(<any>QuestionMatrixDropdownModel.prototype, "createMatrixRow");
    const generations = vi.spyOn(<any>QuestionMatrixDropdownModel.prototype, "generateRows");
    let maxRows = 0;
    const originalGetVisibleRows = (<any>matrix).getVisibleRows.bind(matrix);
    (<any>matrix).getVisibleRows = function (): any {
      const res = originalGetVisibleRows();
      maxRows = Math.max(maxRows, ((<any>matrix).generatedVisibleRows || []).length);
      return res;
    };
    expect(survey.validate(), "#1").toBe(true);
    expect(rowBuilds.mock.calls.length, "#2: the five other pages, then the first one again").toBe(30);
    expect(generations.mock.calls.length, "#3: one build per page visit").toBe(6);
    expect(maxRows, "#4: no more than one page of rows at a time").toBe(5);
  });
  [{ name: "a sort", apply: (m: any): void => { m.sortBy = "rowTitle-"; } }, { name: "a filter", apply: (m: any): void => { m.filterExpression = "{rowTitle} contains '1'"; } }].forEach(view => {
    [0, 10].forEach(rowsPerPage => {
      test("assigning " + view.name + " composes the records once and builds no more rows than the view, rowsPerPage " + rowsPerPage, () => {
        const survey = new SurveyModel({
          elements: [{ type: "matrixdropdown", name: "m", rowsPerPage: rowsPerPage, columns: [{ name: "a", cellType: "text" }], rows: records(200, i => "r" + i) }]
        });
        survey.data = { m: { r0: { a: "0" } } };
        const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
        matrix.visibleRows;
        matrix["dataList"];
        const composes = vi.spyOn(<any>QuestionMatrixDropdownModel.prototype, "composeRecords");
        const getter = vi.spyOn(<any>QuestionMatrixDropdownModel.prototype, "getListRecords");
        const builds = vi.spyOn(<any>QuestionMatrixDropdownModel.prototype, "createMatrixRow");
        let virtualReads = 0;
        const getFields = (<any>QuestionMatrixDropdownModel.prototype).getFields;
        vi.spyOn(<any>QuestionMatrixDropdownModel.prototype, "getFields").mockImplementation(function (this: any) {
          return getFields.call(this).map((field: any) => !field.getValue ? field :
            Object.assign({}, field, { getValue: (record: any, index: number): any => { virtualReads++; return field.getValue(record, index); } }));
        });
        view.apply(matrix);
        const viewCount = matrix["dataList"].getVisibleIndexes().length;
        expect(composes.mock.calls.length, "#1: composed at most once").toBeLessThanOrEqual(1);
        expect(getter.mock.calls.length, "#2: the getter is called at most twice").toBeLessThanOrEqual(2);
        expect(builds.mock.calls.length, "#3: no more rows than the view").toBeLessThanOrEqual(rowsPerPage > 0 ? rowsPerPage : viewCount);
        expect(virtualReads, "#4: one read per record for the one key").toBeLessThanOrEqual(200);
      });
    });
  });
});

async function flush(times: number = 30): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}

describe("the record flags: which path writes them", () => {
  const kinds = [
    { name: "matrixdynamic", json: { type: "matrixdynamic", name: "q", rowCount: 4, rowsPerPage: 2, rowsVisibleIf: "{row.x} != 'a'",
      columns: [{ name: "x", cellType: "text" }, { name: "y", cellType: "text" }] } },
    { name: "paneldynamic", json: { type: "paneldynamic", name: "q", panelCount: 4, panelsPerPage: 2, templateVisibleIf: "{panel.x} != 'a'",
      templateElements: [{ type: "text", name: "x" }, { type: "text", name: "y" }] } }
  ];
  kinds.forEach(kind => {
    test(kind.name + ": with showInvisibleElements on, a second condition run writes no flag and does not sync paging", () => {
      const survey = new SurveyModel({ elements: [kind.json] });
      survey.data = { q: ["a", "b", "c", "d"].map((x: string): any => ({ x: x, y: x.toUpperCase() })) };
      const question: any = survey.getQuestionByName("q");
      const list = question["dataList"];
      list.visibleCount;
      survey.showInvisibleElements = true;
      list.visibleCount;
      const setVisible = vi.spyOn(list, "setRecordsVisible");
      const sync = vi.spyOn(question, "syncPagingState");
      survey.setValue("other", 1);
      expect(setVisible.mock.calls.length, "#3: a second run with the setting on writes no flag").toBe(0);
      expect(sync.mock.calls.length, "#4: and does not sync paging").toBe(0);
    });
  });
  [true, false].forEach((isMatrix: boolean) => {
    test((isMatrix ? "matrix" : "panel") + ": without paging the list's flags are not written from the expression", () => {
      const json = isMatrix
        ? { type: "matrixdynamic", name: "q", rowCount: 0, rowsVisibleIf: "{row.id} != {hideId}",
          columns: [{ name: "id", cellType: "text" }, { name: "name", cellType: "text" }] }
        : { type: "paneldynamic", name: "q", templateVisibleIf: "{panel.id} != {hideId}",
          templateElements: [{ type: "text", name: "id" }, { type: "text", name: "name" }] };
      const survey = new SurveyModel({ elements: [json, { type: "text", name: "hideId" }] });
      survey.data = { q: records(4, i => ({ id: i, name: "n" + i })) };
      const question: any = survey.getQuestionByName("q");
      if (isMatrix) question.visibleRows;
      const list = question["dataList"];
      const update = vi.spyOn(list, "updateRecordsVisibility");
      survey.setValue("hideId", 2);
      expect(update.mock.calls.length, "#1").toBe(0);
      question.pageSize = 2;
      survey.setValue("hideId", 1);
      expect(update.mock.calls.length, "#3: with paging the expression writes them").toBeGreaterThan(0);
    });
  });
});

describe("a change of the view or of the records decides the page once", () => {
  const createMatrix = (json: any, data: Array<any>): QuestionMatrixDynamicModel => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "hide" },
      Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "a", cellType: "text" }] }, json)] });
    survey.data = { m: data };
    return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
  };
  test("matrix: a record a condition hides rebuilds the page once", () => {
    const matrix = createMatrix({ rowsPerPage: 2, rowsVisibleIf: "{row.a} != {hide}" }, records(4, i => ({ a: i })));
    matrix.visibleRows;
    const rebuild = vi.spyOn(<any>matrix, "rebuildFromDataList");
    (<SurveyModel>matrix.survey).setValue("hide", 0);
    matrix.visibleRows;
    expect(rebuild, "#3").toHaveBeenCalledTimes(1);
  });
  test("a condition run that changes no record flag does not sync paging", () => {
    const matrix = createMatrix({ rowsVisibleIf: "{row.a} != {hide}" }, records(3, i => ({ a: i })));
    matrix.visibleRows;
    matrix["dataList"];
    (<SurveyModel>matrix.survey).setValue("hide", 1);
    matrix.visibleRows;
    const sync = vi.spyOn(<any>matrix, "syncPagingState");
    (<SurveyModel>matrix.survey).setValue("other", 5);
    expect(sync, "#3: no flag changed").not.toHaveBeenCalled();
  });
  test("a rebuild keeps one page state per row with an open detail panel", () => {
    const survey = new SurveyModel({ checkErrorsMode: "onComplete", elements: [{ type: "matrixdynamic", name: "outer", rowCount: 0, rowsPerPage: 2,
      columns: [{ name: "id", cellType: "text" }], detailPanelMode: "underRow", detailElements: [
        { type: "paneldynamic", name: "items", panelsPerPage: 1, templateElements: [{ type: "text", name: "r", isRequired: true }] }] }] });
    survey.data = { outer: records(4, (i: number) => ({ id: i, items: [{ r: "x0" }, { r: "x1" }, { r: "x2" }] })) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("outer");
    const row = matrix.visibleRows.filter(row => row.getQuestionByName("id").value === 0)[0];
    row.showDetailPanel();
    row.detailPanel.getQuestionByName("items");
    const keep = vi.spyOn(<any>QuestionMatrixDynamicModel.prototype, "keepPageStatesOfQuestions");
    matrix.pageIndex = 1;
    expect(keep.mock.calls.length, "#4: one row of the page had a detail panel").toBe(1);
  });
  const stableMatrix = (json: any, count: number): QuestionMatrixDynamicModel => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "m", rowCount: 0,
      columns: [{ name: "a", cellType: "text", inputType: "number" }] }, json)] });
    survey.data = { m: records(count, (i: number) => ({ a: i })) };
    return <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
  };
  const stablePanel = (json: any, count: number): QuestionPanelDynamicModel => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "paneldynamic", name: "p",
      templateElements: [{ type: "text", name: "a", inputType: "number" }] }, json)] });
    survey.data = { p: records(count, (i: number) => ({ a: i })) };
    return <QuestionPanelDynamicModel>survey.getQuestionByName("p");
  };
  const copyRecords = (val: any): Array<any> => JSON.parse(JSON.stringify(val));
  test("matrix: after a list write whose handler assigns and throws, the next edit owes no view decision", () => {
    const q = stableMatrix({ filterExpression: "{a} >= 0", defaultRowValue: { a: 9 } }, 4);
    q.visibleRows;
    let isArmed = true;
    (<SurveyModel>q.survey).onValueChanged.add((_, options) => {
      if (options.name !== "m" || !isArmed) return;
      isArmed = false;
      const v = copyRecords(q.value);
      v[1] = { a: -1 };
      (<SurveyModel>q.survey).setValue("m", v);
      throw new Error("handler");
    });
    try {
      q.addRow();
    } catch{
      // The handler's error reaches the caller; page-window.test.ts asserts it.
    }
    const invalidate = vi.spyOn((<any>q).dataListValue, "invalidateViews");
    q.visibleRows[0].getQuestionByColumnName("a").value = -7;
    expect(invalidate, "#5: nothing is owed any more").toHaveBeenCalledTimes(0);
  });
  test("two assignments made inside one write are followed by one decision of the view", () => {
    const q = stablePanel({ panelsPerPage: 2, filterExpression: "{a} >= 0" }, 6);
    let calls = 0;
    (<SurveyModel>q.survey).onValueChanged.add((_, options) => {
      if (options.name !== "p" || calls > 0) return;
      calls++;
      const v = copyRecords(q.value);
      v[2] = { a: -1 };
      (<SurveyModel>q.survey).setValue("p", v);
      const w = copyRecords(q.value);
      w[3] = { a: -1 };
      (<SurveyModel>q.survey).setValue("p", w);
    });
    const invalidate = vi.spyOn((<any>q).dataListValue, "invalidateViews");
    q.panels[0].getQuestionByName("a").value = 10;
    expect(invalidate, "#1").toHaveBeenCalledTimes(1);
  });
  test("panel: a condition run that changes no panel visibility renders the page zero times, one that does renders it once", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "outside" },
        { type: "text", name: "unrelated" },
        {
          type: "paneldynamic", name: "panel", panelsPerPage: 10,
          templateVisibleIf: "{outside} empty or {panel.id} > {outside}",
          templateElements: [{ type: "text", name: "id" }]
        }
      ]
    });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.value = records(30, i => ({ id: i + 1 }));
    question.visiblePanelCount;
    const spy = vi.spyOn(<any>question, "updateRenderedPanels");
    survey.setValue("unrelated", 1);
    const onUnrelated = spy.mock.calls.length;
    expect(onUnrelated, "#3: an unrelated change, was " + onUnrelated).toBe(0);
    spy.mockClear();
    survey.setValue("outside", 5);
    const onFive = spy.mock.calls.length;
    expect(onFive, "#4: panels 1-5 hidden, was " + onFive).toBe(1);
    spy.mockClear();
    survey.setValue("outside", 11);
    const onEleven = spy.mock.calls.length;
    expect(onEleven, "#7: six more hidden, was " + onEleven).toBe(1);
  });
  test("panel: an assigned page size updates the rendered panels, also when the value is the same", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "panel", panelCount: 5, panelsPerPage: 2,
      templateElements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] }] });
    survey.data = { panel: [{ q1: "a" }, { q1: "b" }, { q1: "c" }, { q1: "d" }, { q1: "e" }] };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const update = vi.spyOn(<any>question, "updateRenderedPanels");
    question.panelsPerPage = 2;
    expect(update.mock.calls.length, "#1: panelsPerPage").toBe(1);
    question.pageSize = 2;
    expect(update.mock.calls.length, "#2: pageSize").toBe(2);
  });
});

describe("the clearing pass of invisible values over records without an object", () => {
  test("matrix with paging: clearInvisibleValues builds no row for the pages never opened and runs the conditions linear in the records", () => {
    let runs = 0;
    FunctionFactory.Instance.register("countedVisible", function (params: Array<any>): boolean { runs++; return params[0] !== "hide"; });
    try {
      const run = (copies: number): { clearRuns: number, created: number } => {
        const survey = new SurveyModel({ clearInvisibleValues: "onComplete", elements: [
          { type: "matrixdynamic", name: "m", rowCount: 0, rowsPerPage: 2, rowsVisibleIf: "countedVisible({row.a})",
            filterExpression: "{a} != 'out'",
            columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text" }] }] });
        const data: Array<any> = [];
        for (let i = 0; i < copies; i++) {
          data.push({ a: "x", b: 1 }, { a: "hide", b: 2 }, { a: "y", b: 3 }, { a: "out", b: 4 }, { a: "z", b: 5 }, { a: "hide", b: 6 });
        }
        survey.data = { m: data };
        const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
        matrix.visibleRows[0].getQuestionByName("b").value = 10;
        const created = vi.spyOn(<any>QuestionMatrixDynamicModel.prototype, "createMatrixRow");
        const proto = <any>QuestionMatrixDynamicModel.prototype;
        const clear = proto.clearInvisibleValuesInRows;
        let clearRuns = -1;
        const spy = vi.spyOn(proto, "clearInvisibleValuesInRows").mockImplementation(function (this: any): void {
          const before = runs;
          clear.call(this);
          clearRuns = runs - before;
        });
        survey.completeLastPage();
        spy.mockRestore();
        const res = { clearRuns: clearRuns, created: created.mock.calls.length };
        created.mockRestore();
        return res;
      };
      const small = run(1);
      const large = run(10);
      expect(large.created, "#3: no row is built for the pages never opened: the rows built do not grow with the records").toBe(small.created);
      expect(large.clearRuns <= small.clearRuns * 10, "#4: the clear costs runs linear in the records: " + small.clearRuns + " for 6, " + large.clearRuns + " for 60").toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("countedVisible");
    }
  });
  test("panel: an edit, a page move and a hide under onHidden do not run the complete-time pass", () => {
    const proto = <any>QuestionPanelDynamicModel.prototype;
    const walk = vi.spyOn(proto, "clearValueInRecordsWithoutPanel");
    const survey = new SurveyModel({ clearInvisibleValues: "onHidden", elements: [
      { type: "paneldynamic", name: "pd", panelsPerPage: 2, templateElements: [{ type: "text", name: "show" },
        { type: "text", name: "secret", visibleIf: "{panel.show} = 'yes'" }] }] });
    survey.data = { pd: records(6, (i: number): any => ({ show: i === 3 ? "yes" : "no", secret: "s" + i })) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    question.panels[0].getQuestionByName("show").value = "yes";
    question.panels[0].getQuestionByName("show").value = "no";
    question.pageIndex = 1;
    question.pageIndex = 0;
    expect(walk.mock.calls.length, "#1").toBe(0);
  });
  test("panel: the pass builds no panel and runs one condition per record without a panel", () => {
    let runs = 0;
    FunctionFactory.Instance.register("countedShow", function (params: Array<any>): boolean { runs++; return params[0] === "yes"; });
    const template = [{ type: "text", name: "show" }, { type: "text", name: "secret", visibleIf: "countedShow({panel.show})" },
      { type: "text", name: "other", visibleIf: "countedShow({panel.show})" }];
    const proto = <any>QuestionPanelDynamicModel.prototype;
    const clear = proto.clearValueInRecordsWithoutPanel;
    try {
      const run = (count: number): { created: number, runs: number, runners: number } => {
        const survey = new SurveyModel({ clearInvisibleValues: "onComplete", elements: [
          { type: "paneldynamic", name: "pd", panelsPerPage: 2, templateElements: template }] });
        survey.data = { pd: records(count, (i: number): any => ({ show: i < 2 ? "yes" : "no", secret: "s" + i, other: "o" + i })) };
        const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
        question.panels;
        const created = vi.spyOn(proto, "createNewPanel");
        const runners: Array<ConditionRunner> = [];
        const runContext = ConditionRunner.prototype.runContext;
        const runnerSpy = vi.spyOn(ConditionRunner.prototype, "runContext");
        let passRuns = -1;
        const spy = vi.spyOn(proto, "clearValueInRecordsWithoutPanel").mockImplementation(function (this: any, reason: string): void {
          runnerSpy.mockImplementation(function (this: ConditionRunner, ...args: Array<any>): any {
            if (runners.indexOf(this) < 0) runners.push(this);
            return runContext.apply(this, <any>args);
          });
          const before = runs;
          clear.call(this, reason);
          passRuns = runs - before;
          runnerSpy.mockRestore();
        });
        survey.completeLastPage();
        spy.mockRestore();
        const res = { created: created.mock.calls.length, runs: passRuns, runners: runners.length };
        created.mockRestore();
        return res;
      };
      const small = run(6);
      const large = run(50);
      expect(large.created, "#2: no panel is built for the pass").toBe(small.created);
      expect(large.runs, "#4: two template conditions, 48 records without a panel").toBeLessThanOrEqual(48 * 2);
      expect(large.runners, "#5: one runner per expression text").toBe(1);
    } finally {
      FunctionFactory.Instance.unregister("countedShow");
    }
  });
  test("panel: paged in memory over a source that reads every record, completion runs no clearing pass", async () => {
    // A keyed source without paging: the list reads every record and pages them in memory.
    const owned = records(20, (i: number) => ({ id: i, col1: "v" + i, col2: "s" + i, hidden1: "keep" }));
    const indexOfKey = (key: any): number => owned.map(r => r.id).indexOf(key);
    const source: IDynamicDataSource = {
      keyField: "id",
      read: (): Promise<Array<any>> => Promise.resolve(owned.map(r => Object.assign({}, r))),
      insert: (record: any, sourceIndex: number): Promise<any> => { owned.splice(sourceIndex, 0, Object.assign({}, record)); return Promise.resolve(Object.assign({}, record)); },
      update: (key: any, record: any): Promise<void> => { owned[indexOfKey(key)] = Object.assign({}, record); return Promise.resolve(); },
      remove: (key: any): Promise<void> => { owned.splice(indexOfKey(key), 1); return Promise.resolve(); },
      move: (key: any, to: number): Promise<void> => { const record = owned.splice(indexOfKey(key), 1)[0]; owned.splice(to, 0, record); return Promise.resolve(); }
    };
    const walk = vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "clearValueInRecordsWithoutPanel");
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "panel", panelCount: 0, panelsPerPage: 5,
      templateElements: [{ type: "text", name: "col1" }, { type: "text", name: "col2" }, { type: "text", name: "hidden1", visibleIf: "false" }] }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.dataSource = source;
    await flush();
    survey.tryComplete();
    expect(walk.mock.calls.length, "#3: the pass is not run").toBe(0);
  });
});

describe("choices and dependents of the panels on a page", () => {
  test("a choicesByUrl label: the raw value before the answer, the cached label after, and no read starts a request", () => {
    const pending: Array<() => void> = [];
    const proto: any = ChoicesRestful.prototype;
    const sendRequest = proto.sendRequest;
    proto.sendRequest = function (): void {
      this.beforeSendRequest();
      const hash = this.objHash;
      pending.push(() => {
        this.beforeLoadRequest();
        this.onLoad([{ value: 1, text: "red" }, { value: 2, text: "blue" }], hash);
      });
    };
    ChoicesRestful.clearCache();
    const cache = settings.web.cacheLoadedChoices;
    settings.web.cacheLoadedChoices = true;
    try {
      const question = createPanel({ panelsPerPage: 20, templateElements: [{ type: "text", name: "id" },
        { type: "dropdown", name: "color", choicesByUrl: { url: "http://test/colors", valueName: "value", titleName: "text" } }] },
      records(100, (i: number) => ({ id: i, color: 2 })));
      question.panels;
      const requests = pending.length;
      expect(question.getDisplayValue(true)[70].color, "#1: raw before the answer").toBe(2);
      expect(pending.length, "#2: the read started no request").toBe(requests);
      pending.splice(0, pending.length).forEach(answer => answer());
      expect(question.getDisplayValue(true)[70].color, "#3: the cached label after").toBe("blue");
      expect(pending.length, "#4: nor did this one").toBe(0);
    } finally {
      proto.sendRequest = sendRequest;
      settings.web.cacheLoadedChoices = cache;
      ChoicesRestful.clearCache();
    }
  });
  test("after page visits, a write to the array source reaches each dropdown of the page once", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "panParticipant", templateElements: [{ type: "text", name: "pname" }] },
        { type: "paneldynamic", name: "pd", panelsPerPage: 20, templateElements: [{ type: "text", name: "id" },
          { type: "dropdown", name: "who", choicesFromQuestion: "panParticipant", choiceValuesFromQuestion: "pname" }] }
      ]
    });
    survey.data = { panParticipant: [{ pname: "a" }, { pname: "b" }], pd: records(100, i => ({ id: i, name: "n" + i })) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const touch = (): void => { question.panels.forEach(p => (<any>p.getQuestionByName("who")).visibleChoices); };
    touch();
    for (let i = 0; i < 10; i++) {
      question.pageIndex = 4;
      touch();
      question.pageIndex = 0;
      touch();
    }
    question.pageIndex = 4;
    touch();
    // The template's own dropdown is registered as well; it lives as long as the question does.
    const templateWho = question.template.getQuestionByName("who");
    const spy = vi.spyOn(<any>Object.getPrototypeOf(templateWho), "updateDependedQuestion");
    survey.setValue("panParticipant", [{ pname: "z" }, { pname: "y" }]);
    const calls = spy.mock.contexts.filter((q: any) => q !== templateWho).length;
    expect(calls, "#2: a write reaches each of them once").toBe(20);
  });
});

describe("the work an assignment of the value costs", () => {
  /* Counts the view assignments the list receives while func runs - through setView, which is what
     both setters are made of. "The list receives the authored sort once per load" is about the
     reset every assignment costs, not about the value it ends with. */
  const countSortAssignments = (func: () => void): number => {
    const proto: any = DynamicDataList.prototype;
    const original = proto.setView;
    let count = 0;
    proto.setView = function(filter: string, sort: any): void {
      count++;
      original.call(this, filter, sort);
    };
    try {
      func();
    } finally {
      proto.setView = original;
    }
    return count;
  };
  const loadSurvey = (element: any, data: Array<any>): SurveyModel => {
    const survey = new SurveyModel();
    survey.fromJSON({ elements: [element] });
    survey.data = { q: data };
    return survey;
  };
  test("paneldynamic: the list receives the authored sort once per load", () => {
    const count = countSortAssignments(() => {
      const survey = loadSurvey({ type: "paneldynamic", name: "q", sortBy: "q1-", panelsPerPage: 2, panelCount: 3,
        templateElements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] }, [{ q1: "c" }, { q1: "a" }, { q1: "b" }]);
      (<QuestionPanelDynamicModel>survey.getQuestionByName("q")).visiblePanels;
    });
    expect(count, "#1: no intermediate reset").toBe(1);
  });
  test("matrixdynamic: the list receives the authored sort once per load", () => {
    const count = countSortAssignments(() => {
      const survey = loadSurvey({ type: "matrixdynamic", name: "q", sortBy: "c1-", rowsPerPage: 2, rowCount: 3,
        columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text" }] }, [{ c1: "c" }, { c1: "a" }, { c1: "b" }]);
      (<QuestionMatrixDynamicModel>survey.getQuestionByName("q")).visibleRows;
    });
    expect(count, "#1: no intermediate reset").toBe(1);
  });
  // Three dynamic panels on their own pages share the value "rec"; five expressions per panel write their results.
  const writerNames = ["exp0", "exp1", "exp2", "exp3", "exp4"];
  const createSharedSurvey = (): SurveyModel => {
    const templateElements: Array<any> = [{ type: "text", name: "q1" }, { type: "text", name: "q2" }];
    writerNames.forEach(name => { templateElements.push({ type: "expression", name: name, expression: "'No'" }); });
    const pages: Array<any> = [{ name: "intro", elements: [{ type: "html", name: "intro", html: "start" }] }];
    for (let i = 0; i < 3; i++) {
      pages.push({ name: "p" + i, elements: [{ type: "paneldynamic", name: "pd" + i, valueName: "rec", panelCount: 1, minPanelCount: 1,
        panelsPerPage: 20, templateElements: JSON.parse(JSON.stringify(templateElements)) }] });
    }
    return new SurveyModel({ pages: pages });
  };
  test("Assigning data to built siblings sharing a valueName costs calls linear in the records", () => {
    const proto = <any>QuestionPanelDynamicModel.prototype;
    const measure = (count: number): Array<number> => {
      const survey = createSharedSurvey();
      for (let page = 1; page <= 3; page++) survey.currentPageNo = page;
      const spies = [vi.spyOn(<any>QuestionPanelDynamicItem.prototype, "updateFromRecord")]
        .concat(["setQuestionValue", "updateItemValue"].map(name => vi.spyOn(proto, name)));
      survey.data = { rec: records(count, i => ({ q1: "a" + i, q2: "b" + i })) };
      const res = spies.map(spy => spy.mock.calls.length);
      spies.forEach(spy => spy.mockRestore());
      return res;
    };
    const small = measure(25);
    const large = measure(50);
    expect(large[0], "#1: panel refreshes").toBeLessThan(small[0] * 2.5);
    expect(large[1], "#2: setQuestionValue").toBeLessThan(small[1] * 2.5);
    expect(large[2], "#3: updateItemValue").toBeLessThan(small[2] * 2.5);
    // 150 panels, five writer results per record: at most once per written field and once more.
    expect(large[0], "#4").toBeLessThanOrEqual(150 * 6);
  });
  const createPagedMatrix = (): QuestionMatrixDynamicModel => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "q", rowCount: 3, rowsPerPage: 2, columns: [{ name: "a", cellType: "text" }] }]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    q.visibleRows;
    return q;
  };
  test("matrix: one list-side pair per assignment, and the rows whose record changed get it after the pair", () => {
    const q = createPagedMatrix();
    q.value = [{ a: "1" }, { a: "2" }, { a: "3" }];
    const begin = vi.spyOn(<any>q, "beginValueAssignment");
    const end = vi.spyOn(<any>q, "endValueAssignment");
    const rowUpdates = q.visibleRows.map(row => vi.spyOn(row, "updateFromRecord"));
    q.value = [{ a: "1" }, { a: "x" }, { a: "3" }];
    expect(begin, "#1").toHaveBeenCalledTimes(1);
    expect(end, "#2").toHaveBeenCalledTimes(1);
    expect(end.mock.invocationCallOrder[0] < rowUpdates[1].mock.invocationCallOrder[0], "#4: after the pair").toBe(true);
  });
  test("panel: one list-side pair per assignment, and the panel count follows after it", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 2, templateElements: [{ type: "text", name: "a" }] }]
    });
    const q = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    q.value = [{ a: "1" }];
    const begin = vi.spyOn(<any>q, "beginValueAssignment");
    const end = vi.spyOn(<any>q, "endValueAssignment");
    const setCount = vi.spyOn(<any>q, "setPanelCountBasedOnValue");
    q.value = [{ a: "1" }, { a: "2" }, { a: "3" }];
    expect(begin, "#1").toHaveBeenCalledTimes(1);
    expect(end, "#2").toHaveBeenCalledTimes(1);
    expect(setCount, "#3").toHaveBeenCalledTimes(1);
    const order = [begin.mock.invocationCallOrder[0], end.mock.invocationCallOrder[0], setCount.mock.invocationCallOrder[0]];
    expect(order, "#4: begin, end, then the panel count").toEqual(order.slice().sort((x, y) => x - y));
  });
  test("an assignment made from inside another one runs a complete pair of its own", () => {
    const q = createPagedMatrix();
    const begin = vi.spyOn(<any>q, "beginValueAssignment");
    const end = vi.spyOn(<any>q, "endValueAssignment");
    let isReassigned = false;
    q.valueChangedCallback = (): void => {
      if (isReassigned) return;
      isReassigned = true;
      q.value = [{ a: "x" }, { a: "y" }, { a: "z" }];
    };
    q.value = [{ a: "1" }, { a: "2" }, { a: "3" }];
    expect(begin, "#1: two begins").toHaveBeenCalledTimes(2);
    expect(end, "#2: two ends").toHaveBeenCalledTimes(2);
    const outerBegin = begin.mock.invocationCallOrder[0];
    const innerBegin = begin.mock.invocationCallOrder[1];
    const innerEnd = end.mock.invocationCallOrder[0];
    const outerEnd = end.mock.invocationCallOrder[1];
    expect(outerBegin < innerBegin && innerBegin < innerEnd && innerEnd < outerEnd, "#3: the outer pair closes last").toBe(true);
  });
  test("panel: assigning a source refreshes the footer actions, also for the same source", async () => {
    // A keyed source that pages and updates, and cannot insert.
    const stored = records(6, (i: number) => ({ id: i, col1: "v" + i, col2: i }));
    const source: IDynamicDataSource = {
      keyField: "id",
      capabilities: { paging: true, filtering: true, sorting: true },
      read: (request: IDynamicDataReadRequest): Promise<IDynamicDataReadResult> => {
        const take = request.take > 0 ? request.take : stored.length;
        return Promise.resolve({ records: stored.slice(request.skip, request.skip + take).map(r => Object.assign({}, r)), total: stored.length });
      },
      update: (key: any, record: any): Promise<void> => { stored[key] = Object.assign({}, record); return Promise.resolve(); }
    };
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "panel", panelCount: 0, panelsPerPage: 0,
      templateElements: [{ type: "text", name: "col1" }, { type: "text", name: "col2" }] }] });
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    question.dataSource = source;
    await flush();
    let footerUpdates = 0;
    (<any>question).updateFooterActionsCallback = (): void => { footerUpdates++; };
    question.dataSource = source;
    expect(footerUpdates, "#1: the footer is told").toBe(1);
  });
});

describe("matrixdynamic: the padded records are not composed for their count", () => {
  /* Helpers.getUnbindValue and not getListRecords: the clone per padded record is the cost, and it
     is also what a composition inside getRecord/getValue pays - a spy on getListRecords would count
     calls, not the work each of them does. One composition of the padding is ROW_COUNT clones. */
  const ROW_COUNT = 20;
  function createSurvey(): SurveyModel {
    return new SurveyModel({
      elements: [
        { type: "text", name: "unrelated" },
        {
          type: "matrixdynamic", name: "matrix", rowCount: ROW_COUNT,
          columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text" }, { name: "col3", cellType: "text" }]
        }
      ]
    });
  }
  test("an unrelated value change, reading rowIndex and building the rendered table compose at most once", () => {
    const survey = createSurvey();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    const rows = matrix.visibleRows;
    const spy = vi.spyOn(Helpers, "getUnbindValue");
    try {
      survey.setValue("unrelated", 1);
      const onSetValue = spy.mock.calls.length;
      expect(onSetValue, "#2: an unrelated setValue, was " + onSetValue).toBeLessThanOrEqual(ROW_COUNT);
      spy.mockClear();
      rows.forEach(row => row.rowIndex);
      const onRowIndex = spy.mock.calls.length;
      expect(onRowIndex, "#3: rowIndex of every row, was " + onRowIndex).toBe(0);
      spy.mockClear();
      matrix.resetRenderedTable();
      matrix.renderedTable;
      const onTable = spy.mock.calls.length;
      expect(onTable, "#5: the rendered table, was " + onTable).toBeLessThanOrEqual(ROW_COUNT);
      spy.mockClear();
      rows[0].getQuestionByColumnName("col1").value = "a";
      spy.mockClear();
      survey.setValue("unrelated", 2);
      const afterEdit = spy.mock.calls.length;
      expect(afterEdit, "#6: an unrelated setValue after a cell edit, was " + afterEdit).toBeLessThanOrEqual(ROW_COUNT);
    } finally {
      spy.mockRestore();
    }
  });
  test("a matrix detached from an assigned source counts its padded records without composing them again", () => {
    const survey = createSurvey();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    matrix.dataSource = ArrayDynamicDataSource.fromArray([{ col1: "a" }]);
    matrix.dataSource = undefined;
    matrix.rowCount = ROW_COUNT;
    const list = matrix["dataList"];
    const rows = matrix.visibleRows;
    const spy = vi.spyOn(Helpers, "getUnbindValue");
    try {
      list.count;
      rows.forEach(row => row.rowIndex);
      matrix.visibleRows;
      expect(spy.mock.calls.length, "#7: no padded record was copied").toBe(0);
    } finally {
      spy.mockRestore();
    }
  });
});

describe("the record list's lifecycle: it is disposed after the objects that read it", () => {
  test("matrix: the list is disposed after the rows", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "q", rowCount: 3, rowsPerPage: 2, columns: [{ name: "a", cellType: "text" }] }]
    });
    const q = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    q.visibleRows;
    const listDispose = vi.spyOn((<any>q).dataListValue, "dispose");
    const clearRows = vi.spyOn(<any>q, "clearGeneratedRows");
    q.dispose();
    expect(listDispose, "#2").toHaveBeenCalledTimes(1);
    const lastClear = clearRows.mock.invocationCallOrder[clearRows.mock.invocationCallOrder.length - 1];
    expect(lastClear < listDispose.mock.invocationCallOrder[0], "#3: the rows go first").toBe(true);
  });
  test("panel: the list is disposed before the template", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 2, templateElements: [{ type: "text", name: "a" }] }]
    });
    const q = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    q.value = [{ a: "1" }, { a: "2" }, { a: "3" }];
    const listDispose = vi.spyOn((<any>q).dataListValue, "dispose");
    const templateDispose = vi.spyOn(q.template, "dispose");
    q.dispose();
    expect(listDispose, "#1").toHaveBeenCalledTimes(1);
    expect(listDispose.mock.invocationCallOrder[0] < templateDispose.mock.invocationCallOrder[0], "#3").toBe(true);
  });
  test("panel: a panel kept for a later dispose is disposed before the list, and the template last", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "pd", panelsPerPage: 1, displayMode: "carousel",
      templateElements: [{ type: "text", name: "a" }] }] });
    survey.data = { pd: [{ a: 1 }, { a: 2 }] };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const first = panel.currentPanel;
    // The carousel animates the panel out: it stays rendered while Next replaces it.
    const animation: any = panel.panelsAnimation;
    animation.sync = (): void => { };
    panel["_renderedPanels"] = [first];
    panel.goToNextPanel();
    const listDispose = vi.spyOn((<any>panel).dataListValue, "dispose");
    const panelDispose = vi.spyOn(first, "dispose");
    const templateDispose = vi.spyOn(panel.template, "dispose");
    panel.dispose();
    expect(listDispose, "#3").toHaveBeenCalledTimes(1);
    expect(panelDispose.mock.invocationCallOrder[0] < listDispose.mock.invocationCallOrder[0], "#4: the panel goes first").toBe(true);
    expect(listDispose.mock.invocationCallOrder[0] < templateDispose.mock.invocationCallOrder[0], "#5: the template goes last").toBe(true);
  });
  // The carousel animation keeps the panel Next replaced rendered: it is disposed when the animation ends, or with the question.
  const createCarousel = (count: number): QuestionPanelDynamicModel => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "pd", displayMode: "carousel", panelsPerPage: 1,
      templateElements: [{ type: "text", name: "id" }] }] });
    survey.css = { paneldynamic: { panelWrapperEnter: "enter", panelWrapperLeave: "leave" } };
    survey.data = { pd: records(count, (i: number) => ({ id: i })) };
    return <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
  };
  test("panel: a panel kept for a later dispose is disposed with the question", () => {
    const panel = createCarousel(2);
    const first = panel.currentPanel;
    const animation: any = panel.panelsAnimation;
    animation.sync = (): void => { };
    panel["_renderedPanels"] = [first];
    panel.goToNextPanel();
    const kept: Array<PanelModel> = (<any>panel).panelsToDispose;
    expect(kept.indexOf(first) > -1, "#1: the replaced panel waits for its animation").toBe(true);
    const panelDispose = vi.spyOn(first, "dispose");
    panel.dispose();
    expect(panelDispose, "#2").toHaveBeenCalledTimes(1);
  });
  test("panel: Next animates as a move, not as a removal, and the leaving panel is disposed when its animation ends", () => {
    const question = createCarousel(5);
    const first = question.currentPanel;
    const animation: any = question.panelsAnimation;
    const sync = animation.sync.bind(animation);
    let running: any;
    animation.sync = (val: any): void => { running = val; };
    question["_renderedPanels"] = [first];
    question.goToNextPanel();
    const next = question.currentPanel;
    question["_renderedPanels"] = [first, next];
    const options = question["getPanelsAnimationOptions"]();
    const enterCss = options.getEnterOptions(next).cssClass;
    expect(enterCss.indexOf("sv-pd-animation-removing"), "#1: not a removal: " + enterCss).toBe(-1);
    expect(enterCss.indexOf("sv-pd-animation-left") > -1, "#2: a move forward: " + enterCss).toBe(true);
    expect(first.isDisposed, "#3: still animating").toBe(false);
    animation.sync = sync;
    question["_renderedPanels"] = [first];
    animation.sync(running);
    expect(first.isDisposed, "#4: disposed when the animation ended").toBe(true);
  });
});

describe("reading a dynamic panel creates no record list", () => {
  const hasList = (question: any): boolean => !!question.dataListValue;
  test("a value assigned before the question joins a survey creates no list, for either question", () => {
    const panel = new QuestionPanelDynamicModel("p");
    panel.template.addNewQuestion("text", "a");
    panel.value = [{ a: 1 }, { a: 2 }];
    expect(hasList(panel), "#1: the dynamic panel").toBe(false);
    const matrix = new QuestionMatrixDynamicModel("m");
    matrix.addColumn("a");
    matrix.value = [{ a: 1 }, { a: 2 }];
    expect(hasList(matrix), "#2: the dynamic matrix").toBe(false);
  });
  test("loading a survey of dynamic panels with values, and reading isEmpty, panelCount and the values, creates no list", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "a" }] },
      { type: "paneldynamic", name: "p2", templateElements: [{ type: "text", name: "a" }] },
      { type: "paneldynamic", name: "p3", templateElements: [{ type: "text", name: "a" }] }] });
    survey.data = { p1: [{ a: 1 }, { a: 2 }], p2: [{ a: 3 }] };
    const panels = ["p1", "p2", "p3"].map(name => <QuestionPanelDynamicModel>survey.getQuestionByName(name));
    expect(panels.map(hasList), "#1: after the load").toEqual([false, false, false]);
    expect(panels.map(p => p.isEmpty()), "#2").toEqual([false, false, true]);
    expect(panels.map(p => p.panelCount), "#3").toEqual([2, 1, 0]);
    expect(panels.map(p => p.value), "#4").toEqual([[{ a: 1 }, { a: 2 }], [{ a: 3 }], undefined]);
    expect(panels.map(hasList), "#5: after the reads").toEqual([false, false, false]);
  });
});

describe("the clean-up of incorrect answers over records without an object", () => {
  const kinds: Array<{ name: string, proto: any, json: any }> = [
    { name: "matrix", proto: QuestionMatrixDynamicModel.prototype, json: { type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: 2,
      columns: [{ name: "a", cellType: "dropdown", choices: [1, 2] }, { name: "b", cellType: "text" }] } },
    { name: "panel", proto: QuestionPanelDynamicModel.prototype, json: { type: "paneldynamic", name: "q", panelsPerPage: 2,
      templateElements: [{ type: "dropdown", name: "a", choices: [1, 2] }, { type: "text", name: "b" }] } }
  ];
  kinds.forEach(kind => {
    test(kind.name + ": clearIncorrectValues builds one temporary row or panel per record without an object, an edit, a page move and a render build none", () => {
      const created = vi.spyOn(kind.proto, "createRecordCleanupObject");
      const survey = new SurveyModel({ elements: [kind.json] });
      survey.data = { q: records(6, (i: number): any => ({ a: 1, b: "b" + i })) };
      const question: any = survey.getQuestionByName("q");
      const firstQuestion = (): Question => kind.name === "matrix" ? question.visibleRows[0].getQuestionByColumnName("b") : question.panels[0].getQuestionByName("b");
      firstQuestion().value = "edited";
      question.pageIndex = 1;
      question.pageIndex = 0;
      expect(created.mock.calls.length, "#1").toBe(0);
      survey.clearIncorrectValues();
      expect(created.mock.calls.length, "#2: one object for each of the four records without an object").toBe(4);
    });
  });
});

describe("the onHidden pass over records without an object", () => {
  const createMatrix = (mode: string, rowsPerPage: number): { survey: SurveyModel, matrix: QuestionMatrixDynamicModel } => {
    const survey = new SurveyModel({ clearInvisibleValues: mode, elements: [{ type: "text", name: "hasB" },
      { type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: rowsPerPage,
        columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", visibleIf: "{hasB} = 'yes'" }] }] });
    survey.data = { hasB: "yes", q: records(6, (i: number): any => ({ a: i, b: "x" })) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.visibleRows;
    return { survey: survey, matrix: matrix };
  };
  test("it runs only under onHidden with paging", () => {
    const evaluators = vi.spyOn(<any>QuestionMatrixDynamicModel.prototype, "createRecordElementVisibility");
    createMatrix("onComplete", 2).survey.setValue("hasB", "no");
    createMatrix("onHidden", 0).survey.setValue("hasB", "no");
    expect(evaluators.mock.calls.length, "#1").toBe(0);
    createMatrix("onHidden", 2).survey.setValue("hasB", "no");
    expect(evaluators.mock.calls.length > 0, "#2").toBe(true);
  });
  test("an edit and a page move without a visibility change write no record", () => {
    const { survey, matrix } = createMatrix("onHidden", 2);
    const writes: Array<string> = [];
    survey.onValueChanged.add((_, options) => { writes.push(options.name); });
    matrix.visibleRows[0].getQuestionByColumnName("a").value = 10;
    expect(writes, "#1: the edit").toEqual(["q"]);
    matrix.pageIndex = 1;
    matrix.pageIndex = 2;
    matrix.pageIndex = 0;
    expect(writes, "#2: nothing more").toEqual(["q"]);
    expect(survey.data.q.filter((record: any) => record.b === "x").length, "#3").toBe(6);
  });
});

describe("the cost of the off-page clean-ups", () => {
  test("the onHidden pass evaluates a condition that reads no record variable once per run", () => {
    let runs = 0;
    FunctionFactory.Instance.register("countedEquals", function (params: Array<any>): boolean { runs++; return params[0] === params[1]; });
    try {
      const survey = new SurveyModel({ clearInvisibleValues: "onHidden", elements: [{ type: "text", name: "x" }, { type: "text", name: "y" },
        { type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: 10,
          columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", visibleIf: "countedEquals({x}, 1)" }] }] });
      survey.data = { x: 1, q: records(1000, (i: number): any => ({ a: i, b: "b" })) };
      (<QuestionMatrixDynamicModel>survey.getQuestionByName("q")).visibleRows;
      survey.setValue("y", 1);
      runs = 0;
      survey.setValue("y", 2);
      expect(runs <= 10 + 2, "#1: the rows of the page and one run for the records without a row: " + runs).toBe(true);
      runs = 0;
      survey.setValue("x", 2);
      expect(survey.data.q[500], "#2: the hide still reaches every record").toEqual({ a: 500 });
    } finally {
      FunctionFactory.Instance.unregister("countedEquals");
    }
  });
  test("a condition over the record is still evaluated per record", () => {
    let runs = 0;
    FunctionFactory.Instance.register("countedEquals", function (params: Array<any>): boolean { runs++; return params[0] === params[1]; });
    try {
      const survey = new SurveyModel({ clearInvisibleValues: "onHidden", elements: [{ type: "text", name: "y" },
        { type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: 10,
          columns: [{ name: "a", cellType: "text" }, { name: "b", cellType: "text", visibleIf: "countedEquals({row.a}, 1)" }] }] });
      survey.data = { q: records(100, (i: number): any => ({ a: 1, b: "b" })) };
      (<QuestionMatrixDynamicModel>survey.getQuestionByName("q")).visibleRows;
      runs = 0;
      survey.setValue("y", 2);
      expect(runs >= 90, "#1: " + runs).toBe(true);
    } finally {
      FunctionFactory.Instance.unregister("countedEquals");
    }
  });
  test("at complete a paged Dynamic Panel builds one temporary panel per record without a panel", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", panelsPerPage: 2,
      templateElements: [{ type: "text", name: "a" }, { type: "dropdown", name: "c", choices: [1, 2] }] }] });
    survey.data = { q: records(6, (i: number): any => ({ a: i, c: 1 })) };
    const question = <QuestionPanelDynamicModel>survey.getQuestionByName("q");
    question.panels;
    const created = vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "createRecordCleanupObject");
    try {
      survey.doComplete();
      expect(created.mock.calls.length, "#1: four records without a panel").toBe(4);
    } finally {
      created.mockRestore();
    }
  });
});

describe("page moves leak nothing", () => {
  const createMatrix = (extra?: any): { survey: SurveyModel, matrix: QuestionMatrixDynamicModel } => {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: 5,
      columns: [{ name: "a", cellType: "text" }] }, extra)] });
    survey.data = { q: records(50, (i: number): any => ({ a: i })) };
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.renderedTable;
    return { survey: survey, matrix: matrix };
  };
  const movePages = (matrix: QuestionMatrixDynamicModel, count: number): void => {
    for (let i = 0; i < count; i++) {
      matrix.pageIndex = (matrix.pageIndex + 1) % matrix.pageCount;
      matrix.renderedTable;
    }
  };
  test("page moves leave no listeners of dropped rows", () => {
    const { matrix } = createMatrix();
    movePages(matrix, 1);
    const afterFirst = matrix.locRemoveRowText.onStringChanged.length;
    movePages(matrix, 100);
    expect(matrix.locRemoveRowText.onStringChanged.length, "#1").toBe(afterFirst);
  });
  test("page moves of a matrix with a detail panel leave no survey property handlers", () => {
    const { survey, matrix } = createMatrix({ detailPanelMode: "underRow", detailElements: [{ type: "text", name: "d" }] });
    const countHandlers = (): number => {
      const hash = (<any>survey).onPropChangeFunctions;
      return Array.isArray(hash) ? hash.length : 0;
    };
    movePages(matrix, 1);
    const afterFirst = countHandlers();
    movePages(matrix, 100);
    expect(countHandlers() - afterFirst <= 5, "#1: " + (countHandlers() - afterFirst)).toBe(true);
  });
});

describe("the validation of a paged records question: its objects, the question, then the records off the page", () => {
  test("the records off the page are checked only when the question and its objects pass", () => {
    const kinds: Array<any> = [
      { type: "matrixdynamic", name: "q", rowCount: 0, rowsPerPage: 1, columns: [{ name: "a", cellType: "text" }] },
      { type: "paneldynamic", name: "q", panelsPerPage: 1, templateElements: [{ type: "text", name: "a" }] }
    ];
    kinds.forEach(json => {
      const offPage = vi.spyOn(<any>QuestionRecordsModel.prototype, "validateOffPage");
      const survey = new SurveyModel({ elements: [Object.assign({ validators: [{ type: "expression", expression: "{flag} != 1" }] }, json)] });
      survey.data = { q: [{ a: 1 }, { a: 2 }] };
      const question: any = survey.getQuestionByName("q");
      if (json.type === "paneldynamic") question.panels; else question.visibleRows;
      survey.setValue("flag", 1);
      survey.validate(true);
      expect(offPage.mock.calls.length, json.type + ": the question has an error").toBe(0);
      survey.setValue("flag", 2);
      survey.validate(true);
      expect(offPage.mock.calls.length > 0, json.type + ": everything passes").toBe(true);
      offPage.mockRestore();
    });
  });
});

describe("the focus kept for a re-read after a removal from the UI", () => {
  // A keyed source whose reads wait until release() is called.
  const createSource = (): { source: IDynamicDataSource, release: () => void } => {
    const records = [{ id: 1, col1: "a" }, { id: 2, col1: "b" }, { id: 3, col1: "c" }];
    const pending: Array<() => void> = [];
    let isHolding = false;
    const source: any = {
      keyField: "id",
      read: (): any => {
        const answer = { records: records.map(record => Object.assign({}, record)), total: records.length };
        if (!isHolding) return Promise.resolve(answer);
        return new Promise<any>(resolve => { pending.push(() => resolve(answer)); });
      },
      update: (): Promise<void> => Promise.resolve(),
      remove: (key: any): Promise<void> => { records.splice(records.findIndex(r => r.id === key), 1); return Promise.resolve(); }
    };
    return { source: source, release: (): void => { isHolding = true; pending.splice(0).forEach(answer => answer()); } };
  };
  const flushAll = async (): Promise<void> => { for (let i = 0; i < 20; i++) await new Promise(r => setTimeout(r, 0)); };
  test("a cancelled removal while a read is pending keeps no focus position for that read", async () => {
    const matrixFocused = vi.spyOn(<any>QuestionMatrixDynamicModel.prototype, "focusItemAfterRead");
    const panelFocused = vi.spyOn(<any>QuestionPanelDynamicModel.prototype, "focusItemAfterRead");
    try {
      const matrixSurvey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "q", rowCount: 0, columns: [{ name: "col1" }] }] });
      const matrix = <QuestionMatrixDynamicModel>matrixSurvey.getQuestionByName("q");
      const matrixSource = createSource();
      matrix.dataSource = matrixSource.source;
      await flushAll();
      matrixSurvey.onMatrixRowRemoving.add((_, options) => { options.allow = false; });
      matrixSource.release();
      matrix.refreshDataSource();
      matrix.removeRowUI(matrix.visibleRows[1]);
      matrixSource.release();
      await flushAll();
      expect(matrix.visibleRows.length, "#1: nothing was removed").toBe(3);
      expect(matrixFocused.mock.calls.length, "#2").toBe(0);
      const panelSurvey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "q", templateElements: [{ type: "text", name: "col1" }] }] });
      const panel = <QuestionPanelDynamicModel>panelSurvey.getQuestionByName("q");
      const panelSource = createSource();
      panel.dataSource = panelSource.source;
      await flushAll();
      panelSurvey.onDynamicPanelRemoving.add((_, options) => { options.allow = false; });
      panelSource.release();
      panel.refreshDataSource();
      panel.removePanelUI(panel.panels[1]);
      panelSource.release();
      await flushAll();
      expect(panel.panels.length, "#3").toBe(3);
      expect(panelFocused.mock.calls.length, "#4").toBe(0);
    } finally {
      matrixFocused.mockRestore();
      panelFocused.mockRestore();
    }
  });
});
