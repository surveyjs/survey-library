import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { PanelModel } from "../../src/panel";
import { FunctionFactory } from "../../src/functionsfactory";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { Question } from "../../src/question";
import { QuestionSelectBase } from "../../src/question_baseselect";
import { ItemValue } from "../../src/itemvalue";
import { Helpers } from "../../src/helpers";

/* Step 16 (prompts/dynamic-data-list/16-paging-700-records.md): the per-write costs that remain once
   only the page is built. These are performance items: the tests count calls, they do not measure
   time. The item names in the test names are the ones the prompt gives. */

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

describe("R1: a panel that is being built runs its conditions once, over its values", () => {
  // The expression comes first, as expHousInfoEntered comes before drpHomeTypology: attached in element
  // order, it runs before the question it reads has its value.
  const expressionFirst = [
    { type: "expression", name: "b", expression: "iif({panel.a} = '', 'No', 'Yes')" },
    { type: "text", name: "a" }
  ];
  test("(1) a page move writes nothing when every record already holds its computed value", () => {
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
  test("(1a) the first build writes nothing either", () => {
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
      { type: "text", name: "copy", defaultValueExpression: "r1LogIndex({panelIndex}, {panel.id})" }
    ];
    function createLookupPanel(): QuestionPanelDynamicModel {
      log = [];
      FunctionFactory.Instance.register("r1LogIndex", logIndex);
      return createPanel({ panelsPerPage: 5, templateElements: lookupTemplate }, records(20, i => ({ id: i })));
    }
    afterEach(() => {
      FunctionFactory.Instance.unregister("r1LogIndex");
    });
    test("(2) its record lookup names the record it is about to hold: getIndex() and {panelIndex}", () => {
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
    test("(3) its writes address the record it holds (pins the write path; passes before the fix)", () => {
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
  test("(4) a new record added by addPanel() still gets its default value and its computed expression", () => {
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

describe("P1: choicesFromQuestion over an array question projects once per source value", () => {
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
  test("(1) a write to a field that is neither the value nor the text field: one projection, no ItemValue comparison, no search", () => {
    const question = createChoicesPanel(50);
    const toJSON = vi.spyOn(ItemValue.prototype, "toJSON");
    const projections = vi.spyOn(<any>Question.prototype, "createArrayValueChoices");
    const searches = vi.spyOn(ItemValue, "getItemByValue");
    question.panels[10].getQuestionByName("name").value = "changed";
    expect(question.value[10].name, "#1: the write reached the record").toBe("changed");
    expect(toJSON.mock.calls.length, "#2: no toJSON").toBe(0);
    expect(projections.mock.calls.length, "#3: one projection for the whole survey").toBe(1);
    expect(searches.mock.calls.length, "#4: no search from the dependents").toBe(0);
    expect(refValues(question, 0).length, "#5: the choices are intact").toBe(50);
    expect(question.panels[3].getQuestionByName("ref").value, "#6: the answers are intact").toBe("k4");
  });
  test("(2) a write to the value field: every dropdown gets the new choice, the answer that named the old key is cleared", () => {
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
  test("(2a) a key renamed by case only is a new choice: the projections are compared exactly", () => {
    const question = createChoicesPanel(5);
    question.panels[2].getQuestionByName("key").value = "K2";
    expect(refValues(question, 0), "#1").toEqual(["k0", "k1", "K2", "k3", "k4"]);
    question.panels[2].getQuestionByName("key").value = "K2 ";
    expect(refValues(question, 0), "#2: a trailing space counts too").toEqual(["k0", "k1", "K2 ", "k3", "k4"]);
  });
  test("(3) the dependent's own state still applies while the projection does not change", () => {
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

describe("Q2: the first build attaches every panel once", () => {
  test("(1) 30 panels built on the first rendering: 30 setSurveyImpl calls, not 60", () => {
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
  test("(2) panels that existed before the first build are attached again: a question built outside a survey", () => {
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

describe("Q5: a single-field write copies the whole array only where a caller needs the copy", () => {
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
  test("(1) one field of one record, three questions bound to the value: 4 whole-array copies, not 7", () => {
    const survey = createBoundSurvey();
    const pd1 = <QuestionPanelDynamicModel>survey.getQuestionByName("pd1");
    const copies = vi.spyOn(Helpers, "getUnbindValue");
    pd1.panels[10].getQuestionByName("b").value = "changed";
    const wholeArray = copies.mock.calls.filter(call => Array.isArray(call[0]) && call[0].length === 50);
    // Kept: the survey hash gets its own copy (survey.setValue), each sibling gets its own copy
    // (updateValueFromSurvey of pd2 and m), the matrix copies the value it receives (createNewValue).
    expect(wholeArray.length, "#1").toBe(4);
    expect(survey.data.rec[10].b, "#2").toBe("changed");
    expect((<QuestionPanelDynamicModel>survey.getQuestionByName("pd2")).panels[10].getQuestionByName("b").value, "#3").toBe("changed");
  });
  test("(2) removed copy 1 (Question.setNewValue): onDynamicPanelValueChanged still gets an oldValue snapshot", () => {
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
  test("(3) removed copy 3 (survey.setValue oldValue): storage that updates the hash in place still reports the change", () => {
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
  test("(4) removed copy 2 (survey.isValueEqual): an equal write is still a no-op, a different one is not", () => {
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
  test("(5) the kept copies: mutating what a question or a handler received leaves the others as they were", () => {
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
});
