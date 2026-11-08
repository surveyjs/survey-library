import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";
import { SurveyModel } from "../src/survey";
import { ConsoleWarnings } from "../src/console-warnings";
import { Event } from "../src/event";
import { SurveySettingsValues } from "../src/survey-settings";

export * from "../src/question_text";
export * from "../src/question_checkbox";
export * from "../src/question_dropdown";
export * from "../src/question_matrixdynamic";
export * from "../src/question_matrixdropdown";
export * from "../src/question_matrix";
export * from "../src/question_paneldynamic";
export * from "../src/question_multipletext";
export * from "../src/question_expression";
export * from "../src/question_html";
export * from "../src/question_boolean";

const questionsJson = {
  pages: [
    { name: "p1", elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "panel1", elements: [{ type: "text", name: "q2" }] }
    ] },
    { name: "p2", elements: [{ type: "checkbox", name: "q3", choices: [1, 2] }] }
  ]
};

// A survey whose loading raises every event found in the loading path (see report-02.md).
const loadingJson = {
  calculatedValues: [{ name: "cv", expression: "1 + 1" }],
  triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "q2", setValue: 2 }],
  pages: [
    { name: "p1", elements: [
      { type: "text", name: "q1", defaultValue: 1, title: "{cv}" },
      { type: "text", name: "q2", visibleIf: "{q1} = 2" },
      { type: "panel", name: "panel1", visibleIf: "{q1} = 5", elements: [{ type: "text", name: "q3" }] },
      { type: "checkbox", name: "q4", choices: [1, 2, 3], defaultValue: [2] },
      { type: "matrixdynamic", name: "m1", columns: [{ name: "c1", cellType: "text" }], defaultValue: [{ c1: "a" }, { c1: "b" }] },
      { type: "matrixdropdown", name: "m2", rows: ["r1"], columns: [{ name: "c1", cellType: "text" }], defaultValue: { r1: { c1: "x" } } },
      { type: "paneldynamic", name: "pd1", templateElements: [{ type: "text", name: "pq1" }], defaultValue: [{ pq1: "a" }, { pq1: "b" }] },
      // A template question with a default value raises the dynamic panel value events from the template (panelIndex -1).
      { type: "paneldynamic", name: "pd2", templateElements: [{ type: "text", name: "pq2", defaultValue: "k" }] },
      { type: "multipletext", name: "mt", items: [{ name: "i1" }] },
      { type: "expression", name: "e1", expression: "{q1} * 2" },
      { type: "boolean", name: "b1", defaultValue: true },
      { type: "html", name: "h1", html: "{q1}" }
    ] },
    { name: "p2", visibleIf: "{q1} = 3", elements: [{ type: "text", name: "q5" }] }
  ]
};
// The events that fire inside fromJSON for loadingJson, with what identifies each call.
const loadingEvents: Array<string> = [
  "onPropertyChanged", "onPageAdded", "onQuestionCreated", "onQuestionAdded", "onPanelAdded", "onMatrixColumnAdded",
  "onShowingChoiceItem", "onMultipleTextItemAdded", "onValueChanging", "onValueChanged", "onExpressionRunning",
  "onTriggerExecuted", "onVariableChanged", "onQuestionVisibleChanged", "onPanelVisibleChanged", "onPageVisibleChanged",
  "onCurrentPageChanging", "onCurrentPageChanged", "onDynamicPanelAdded", "onUIStateChanged", "onEndLoadingFromJson",
  "onUpdateQuestionCssClasses", "onGetExpressionDisplayValue",
  "onDynamicPanelValueChanging", "onDynamicPanelValueChanged", "onDynamicPanelItemValueChanged"
];
function describeCall(options: any): string {
  if (!options || typeof options !== "object") return String(options);
  const obj = options.question || options.panel || options.page || options.item || options.column || options.trigger;
  const name = !!obj ? (obj.name || obj.getType()) : "";
  return name + ":" + (options.name !== undefined ? options.name : "");
}
function recorder(log: Array<string>): (sender: SurveyModel, options: any) => void {
  return (sender: SurveyModel, options: any): void => { log.push(describeCall(options)); };
}
// Today's workaround: subscribe on an empty model, then load the JSON.
function logWithWorkaround(eventName: string, json: any): Array<string> {
  const log: Array<string> = [];
  const survey = new SurveyModel();
  (<any>survey)[eventName].add(recorder(log));
  survey.fromJSON(json);
  return log;
}

describe("Survey settings: event handlers in the constructor options", () => {
  let warnSpy: any;
  beforeEach(() => {
    warnSpy = vi.spyOn(ConsoleWarnings, "warn").mockImplementation(() => { });
  });
  afterEach(() => {
    warnSpy.mockRestore();
  });

  test("onQuestionCreated given in the options fires for every question in the JSON", () => {
    const names: Array<string> = [];
    const survey = new SurveyModel(questionsJson, {
      events: { onQuestionCreated: (sender, options) => { names.push(options.question.name); } }
    });
    expect(names).toEqual(["q1", "q2", "q3"]);
    expect(survey.getAllQuestions().map(q => q.name)).toEqual(["q1", "q2", "q3"]);
    expect(survey.onQuestionCreated.length).toBe(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });
  test("Without events, a handler added after the constructor misses the questions of the JSON, as today", () => {
    const names: Array<string> = [];
    const survey = new SurveyModel(questionsJson);
    survey.onQuestionCreated.add((sender, options) => { names.push(options.question.name); });
    expect(names).toEqual([]);
    expect(survey.onQuestionCreated.length).toBe(1);
    const survey2 = new SurveyModel(questionsJson, {});
    expect(survey2.onQuestionCreated.isEmpty).toBe(true);
    expect(survey2.getAllQuestions().length).toBe(3);
    expect(warnSpy).not.toHaveBeenCalled();
  });
  test.each(loadingEvents)("%s given in the options receives the calls raised while the JSON loads", (eventName: string) => {
    const expected = logWithWorkaround(eventName, loadingJson);
    expect(expected.length, "the event fires during fromJSON").toBeGreaterThan(0);
    const log: Array<string> = [];
    new SurveyModel(loadingJson, { events: { [eventName]: recorder(log) } });
    // The constructor's steps after fromJSON (theme, css) may raise more calls; the loading calls come first.
    expect(log.slice(0, expected.length)).toEqual(expected);
    expect(warnSpy).not.toHaveBeenCalled();
  });
  test("What the loading events receive", () => {
    const log: Array<string> = [];
    new SurveyModel(loadingJson, {
      events: {
        onPageAdded: (sender, options) => { log.push("page:" + options.page.name); },
        onPanelAdded: (sender, options) => { log.push("panel:" + options.panel.name + "/" + options.page.name); },
        onQuestionCreated: (sender, options) => { if (options.question.name === "q3") log.push("created:q3"); },
        onMatrixColumnAdded: (sender, options) => { log.push("column:" + options.question.name + "." + options.column.name); },
        onMultipleTextItemAdded: (sender, options) => { log.push("item:" + options.question.name + "." + options.item.name); },
        onDynamicPanelAdded: (sender, options) => { log.push("dynamicPanel:" + options.question.name + "#" + options.panelIndex); },
        onVariableChanged: (sender, options) => { log.push("variable:" + options.name + "=" + options.value); },
        onTriggerExecuted: (sender, options) => { log.push("trigger:" + options.trigger.getType()); },
        onValueChanged: (sender, options) => { if (["m1", "pd1", "q2"].indexOf(options.name) > -1) log.push("value:" + options.name + "=" + JSON.stringify(options.value)); },
        onEndLoadingFromJson: () => { log.push("endLoading"); }
      }
    });
    expect(log).toEqual([
      "page:p1",
      "panel:panel1/p1", "created:q3",
      "column:m1.c1", "column:m2.c1",
      "item:mt.i1",
      "page:p2",
      "value:q2=2",
      "trigger:setvaluetrigger",
      "value:m1=[{\"c1\":\"a\"},{\"c1\":\"b\"}]",
      "value:pd1=[{\"pq1\":\"a\"},{\"pq1\":\"b\"}]",
      "variable:cv=2",
      "dynamicPanel:pd1#0", "dynamicPanel:pd1#1",
      "endLoading"
    ]);
  });
  test("The alias onVisibleChanged subscribes to onQuestionVisibleChanged", () => {
    const log: Array<string> = [];
    const survey = new SurveyModel(loadingJson, { events: { onVisibleChanged: recorder(log) } });
    expect(log).toEqual(logWithWorkaround("onQuestionVisibleChanged", loadingJson));
    expect(survey.onQuestionVisibleChanged.length).toBe(1);
  });
  test("An array of handlers runs in array order, and the names run in the order given", () => {
    const log: Array<string> = [];
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] }, {
      events: {
        onValueChanged: [() => log.push("a"), () => log.push("b"), () => log.push("c")],
        onValueChanging: () => log.push("changing")
      }
    });
    const after = (): void => { log.push("after"); };
    survey.onValueChanged.add(after);
    survey.setValue("q1", 1);
    expect(log).toEqual(["changing", "a", "b", "c", "after"]);
  });
  test("onComplete given in the options fires on doComplete(), the same as survey.onComplete.add", () => {
    const log: Array<string> = [];
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] }, {
      events: { onComplete: (sender, options) => { log.push("options:" + (sender === survey) + ":" + typeof options.showSaveInProgress); } }
    });
    survey.onComplete.add(() => { log.push("add"); });
    survey.doComplete();
    expect(log).toEqual(["options:true:function", "add"]);
    expect(survey.state).toBe("completed");
  });
  test("Async events (onCompleting) given in the options work too", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] }, {
      events: { onCompleting: (sender, options) => { options.allow = false; } }
    });
    survey.tryComplete();
    expect(survey.state).toBe("running");
  });
  test("An unknown name and a non-function value warn once each, and the survey loads as today", () => {
    const names: Array<string> = [];
    const handler = (): void => { };
    const events: any = {
      onCompleted: handler,
      onComplete: "save",
      onValueChanged: [handler, 5],
      onQuestionCreated: (sender: SurveyModel, options: any) => { names.push(options.question.name); }
    };
    const survey = new SurveyModel(questionsJson, { events });
    expect(warnSpy).toHaveBeenCalledTimes(3);
    expect(warnSpy.mock.calls[0][0]).toContain("\"onCompleted\"");
    expect(warnSpy.mock.calls[1][0]).toContain("\"onComplete\"");
    expect(warnSpy.mock.calls[2][0]).toContain("\"onValueChanged\"");
    expect(survey.onComplete.isEmpty).toBe(true);
    expect(survey.onValueChanged.hasFunc(handler), "a value with one non-function is ignored as a whole").toBe(false);
    expect(survey.onValueChanged.length).toBe(new SurveyModel(questionsJson).onValueChanged.length);
    expect(names).toEqual(["q1", "q2", "q3"]);
    expect(survey.getAllQuestions().length).toBe(3);
  });
  test("Names that are not public events of the survey are unknown", () => {
    const handler = (): void => { };
    const names = ["toString", "title", "pages", "getQuestionByName", "currentPage", "_onElementRerendered", "hasOwnProperty"];
    const events: any = {};
    names.forEach(name => events[name] = handler);
    const survey = new SurveyModel(questionsJson, { events });
    expect(warnSpy).toHaveBeenCalledTimes(names.length);
    names.forEach((name, i) => expect(warnSpy.mock.calls[i][0]).toContain("\"" + name + "\""));
    expect(survey.getAllQuestions().length).toBe(3);
    expect(typeof survey.toString).toBe("function");
    expect(survey.pages.length).toBe(2);
  });
  test("undefined and an empty array subscribe nothing silently; null warns", () => {
    const survey = new SurveyModel(questionsJson, { events: { onComplete: undefined, onValueChanged: [], onStarted: <any>null } });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain("\"onStarted\"");
    const plain = new SurveyModel(questionsJson);
    expect(survey.onComplete.length).toBe(plain.onComplete.length);
    expect(survey.onValueChanged.length).toBe(plain.onValueChanged.length);
    expect(survey.onStarted.length).toBe(plain.onStarted.length);
  });
  test("events that is not a plain object is ignored without a warning, as a settings group", () => {
    ["x", [() => { }], null, 5].forEach((events: any) => {
      const survey = new SurveyModel(questionsJson, { events });
      expect(survey.getAllQuestions().length).toBe(3);
      expect(survey.onComplete.isEmpty).toBe(true);
    });
    expect(warnSpy).not.toHaveBeenCalled();
  });
  test("survey.settings({ events }) after construction stays ignored with a warning", () => {
    const survey = new SurveyModel(questionsJson);
    const handler = (): void => { };
    survey.settings(<any>{ events: { onComplete: handler } });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain("events");
    expect(survey.onComplete.isEmpty).toBe(true);
  });
  test("remove and clear work on handlers added through the options; dispose releases them", () => {
    const log: Array<string> = [];
    const a = (): void => { log.push("a"); };
    const b = (): void => { log.push("b"); };
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] }, {
      events: { onValueChanged: [a, b], onComplete: a }
    });
    expect(survey.onValueChanged.hasFunc(a)).toBe(true);
    survey.onValueChanged.remove(a);
    survey.setValue("q1", 1);
    expect(log).toEqual(["b"]);
    survey.onValueChanged.clear();
    survey.setValue("q1", 2);
    expect(log).toEqual(["b"]);
    expect(survey.onComplete.length).toBe(1);
    survey.dispose();
    expect(survey.onComplete.isEmpty).toBe(true);
  });
  test("The handlers are subscribed before loadSurveyFromService", () => {
    const spy = vi.spyOn(SurveyModel.prototype, "loadSurveyFromService").mockImplementation(function (this: SurveyModel) {
      expect(this.onLoadedSurveyFromService.length).toBe(1);
    });
    try {
      const handler = (): void => { };
      new SurveyModel({ surveyId: "abc" }, { events: { onLoadedSurveyFromService: handler } });
      expect(spy).toHaveBeenCalledTimes(1);
    } finally {
      spy.mockRestore();
    }
  });
  test("The handlers are subscribed after the settings are applied and before fromJSON", () => {
    // Applying the settings raises no event, so the order is read from the call order of spies that call through.
    const mergeSpy = vi.spyOn(SurveySettingsValues.prototype, "merge");
    const addSpy = vi.spyOn(Event.prototype, "add");
    const fromJSONSpy = vi.spyOn(SurveyModel.prototype, "fromJSON");
    try {
      let caseSensitive: boolean;
      const handler = (sender: SurveyModel): void => { caseSensitive = sender.getSettings().comparator.caseSensitive; };
      new SurveyModel(questionsJson, { comparator: { caseSensitive: true }, events: { onQuestionCreated: handler } });
      expect(caseSensitive).toBe(true);
      const addIndex = addSpy.mock.calls.findIndex(args => args[0] === handler);
      expect(addIndex).toBeGreaterThan(-1);
      const addOrder = addSpy.mock.invocationCallOrder[addIndex];
      expect(mergeSpy.mock.invocationCallOrder[0]).toBeLessThan(addOrder);
      expect(addOrder).toBeLessThan(fromJSONSpy.mock.invocationCallOrder[0]);
    } finally {
      mergeSpy.mockRestore();
      addSpy.mockRestore();
      fromJSONSpy.mockRestore();
    }
  });
  test("A sparse array is not a list of functions: it warns and subscribes nothing", () => {
    const handler = (): void => { };
    const handlers: Array<any> = [handler];
    handlers[2] = handler;
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", defaultValue: 1 }] }, { events: { onValueChanged: handlers } });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain("\"onValueChanged\"");
    expect(survey.onValueChanged.hasFunc(handler)).toBe(false);
    expect(survey.onValueChanged.hasFunc(undefined)).toBe(false);
    survey.setValue("q1", 2);
    expect(survey.getValue("q1")).toBe(2);
  });
  test("Every event that fires while the JSON loads is in the tested list", () => {
    const survey = new SurveyModel();
    const fired: Array<string> = [];
    Object.keys(survey).filter(key => key.indexOf("on") === 0 && (<any>survey)[key] instanceof Event).forEach(name => {
      (<any>survey)[name].add(() => { if (fired.indexOf(name) < 0) fired.push(name); });
    });
    survey.fromJSON(loadingJson);
    // onVisibleChanged is the alias of onQuestionVisibleChanged: the same event object.
    expect(fired.filter(name => name !== "onVisibleChanged").sort()).toEqual(loadingEvents.slice().sort());
  });
  test("The type's exclusion by name: the on* accessors of the prototype chain are known", () => {
    // SurveyEventHandlers excludes onElementRerendered by name; a new on* getter that returns an Event would need the same.
    const accessors: Array<string> = [];
    let proto = Object.getPrototypeOf(new SurveyModel());
    while(!!proto && proto !== Object.prototype) {
      Object.getOwnPropertyNames(proto).forEach(name => {
        const desc = Object.getOwnPropertyDescriptor(proto, name);
        if (name.indexOf("on") === 0 && !!desc.get && accessors.indexOf(name) < 0) accessors.push(name);
      });
      proto = Object.getPrototypeOf(proto);
    }
    expect(accessors.sort()).toEqual(["onElementRerendered", "onPropChangeFunctions"]);
  });
  test("A DOM element as the second argument reads no events and still renders", () => {
    const renderSpy = vi.spyOn(SurveyModel.prototype, "render").mockImplementation(() => { });
    try {
      const el: any = document.createElement("div");
      el.events = { onQuestionCreated: () => { } };
      const survey = new SurveyModel(questionsJson, el);
      expect(survey.onQuestionCreated.isEmpty).toBe(true);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).not.toHaveBeenCalled();
    } finally {
      renderSpy.mockRestore();
    }
  });
  test("Every public event of the survey whose name starts with 'on' can be given", () => {
    const probe = new SurveyModel();
    const names = Object.keys(probe).filter(key => key.indexOf("on") === 0 && (<any>probe)[key] instanceof Event);
    expect(names.length).toBeGreaterThan(100);
    const handler = (): void => { };
    const events: any = {};
    names.forEach(name => events[name] = handler);
    const survey = new SurveyModel(undefined, { events });
    expect(warnSpy).not.toHaveBeenCalled();
    names.forEach(name => expect((<any>survey)[name].hasFunc(handler), name).toBe(true));
  });
});
