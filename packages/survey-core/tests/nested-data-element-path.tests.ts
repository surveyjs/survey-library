import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../src/survey";
import { PanelModel, PanelModelBase } from "../src/panel";
import { PageModel } from "../src/page";
import { Question } from "../src/question";
import { settings } from "../src/settings";

// Nested data 14: one data path per element, and the survey as the root data scope. Each check runs for a
// top-level question and for the same question two levels deep (outer.inner.<key>): the two take one code
// path, so they give the same answers, under the path.

afterEach(() => {
  vi.restoreAllMocks();
});

type Layout = { title: string, nested: boolean };
const layouts: Array<Layout> = [{ title: "top-level", nested: false }, { title: "two levels deep", nested: true }];
// The elements at the root, or inside panel "outerPanel" (valueName "outer") > panel "innerPanel" (valueName "inner").
const wrap = (layout: Layout, elements: Array<any>): Array<any> => !layout.nested ? elements : [
  { type: "panel", name: "outerPanel", valueName: "outer", elements: [
    { type: "panel", name: "innerPanel", valueName: "inner", elements: elements }
  ] }
];
// The object under the path of the questions: the root data, or data.outer.inner.
const put = (layout: Layout, obj: any): any => !layout.nested ? obj : { outer: { inner: obj } };
const pathOf = (layout: Layout, key: string): Array<string> => layout.nested ? ["outer", "inner", key] : [key];
const delay = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 20));
const withNoDelay = async (func: () => Promise<void>): Promise<void> => {
  const prevDelay = settings.autoAdvanceDelay;
  settings.autoAdvanceDelay = 0;
  try {
    await func();
  } finally {
    settings.autoAdvanceDelay = prevDelay;
  }
};

describe("nested data path: the element members", () => {
  test("getDataPath() and getValueScope() of questions and containers", () => {
    const survey = new SurveyModel({ pages: [{ name: "page1", elements: [
      { type: "text", name: "q0", valueName: "v0" },
      { type: "panel", name: "flat", elements: [{ type: "text", name: "q1" }] },
      { type: "panel", name: "outerPanel", valueName: "outer", elements: [
        { type: "panel", name: "innerPanel", valueName: "inner", elements: [{ type: "text", name: "q2", valueName: "v2" }] }
      ] }
    ] }] });
    const outer = <PanelModel>survey.getPanelByName("outerPanel");
    const inner = <PanelModel>survey.getPanelByName("innerPanel");
    expect(survey.getQuestionByName("q0").getDataPath(), "a value name").toEqual(["v0"]);
    expect(survey.getQuestionByName("q0").getValueScope()).toBe(survey);
    expect(survey.getQuestionByName("q1").getDataPath(), "a panel that does not nest is transparent").toEqual(["q1"]);
    expect(survey.getQuestionByName("q2").getDataPath()).toEqual(["outer", "inner", "v2"]);
    expect(survey.getQuestionByName("q2").getValueScope()).toBe(inner.getDataScope());
    expect(outer.getDataPath(), "a container: its key").toEqual(["outer"]);
    expect(outer.getValueScope()).toBe(survey);
    expect(inner.getDataPath()).toEqual(["outer", "inner"]);
    expect(inner.getValueScope()).toBe(outer.getDataScope());
    expect(survey.getPanelByName("flat").getDataPath(), "a container that does not nest").toEqual([]);
    expect(survey.pages[0].getDataPath(), "a page that does not nest").toEqual([]);
    survey.dataNesting = "page";
    expect(survey.pages[0].getDataPath()).toEqual(["page1"]);
    expect(survey.getQuestionByName("q2").getDataPath()).toEqual(["page1", "outer", "inner", "v2"]);
  });
});

describe.each(layouts)("nested data path: filtered values, server validation, trigger keys ($title)", (layout: Layout) => {
  const fruitsJson = (extra?: Array<any>): any => ({ pages: [
    { name: "page1", elements: wrap(layout, [
      { type: "text", name: "q1" },
      { type: "checkbox", name: "fruits", valuePropertyName: "fruit", choices: ["a", "b"] }
    ]) },
    { name: "page2", elements: [{ type: "text", name: "target" }].concat(extra || []) }
  ] });
  test("getFilteredValues() writes a filtered value under the path and copies the objects on the way", () => {
    const survey = new SurveyModel(fruitsJson());
    survey.data = put(layout, { q1: "x", fruits: [{ fruit: "a" }, { fruit: "b" }] });
    const values = survey.getFilteredValues();
    const expected: any = put(layout, { q1: "x", fruits: ["a", "b"] });
    for (const key in expected) {
      expect(values[key]).toEqual(expected[key]);
    }
    expect(survey.data, "the stored data keeps its shape").toEqual(put(layout, { q1: "x", fruits: [{ fruit: "a" }, { fruit: "b" }] }));
    expect(survey.runCondition("{fruits} contains 'a'"), "an expression reads the filtered value").toBe(true);
  });
  test("onServerValidateQuestions options.data", () => {
    const survey = new SurveyModel(fruitsJson());
    let data: any;
    survey.onServerValidateQuestions.add((_, options) => {
      data = options.data;
      options.complete();
    });
    survey.data = put(layout, { q1: "x", fruits: [{ fruit: "a" }] });
    survey.nextPage();
    expect(data).toEqual(put(layout, { q1: "x", fruits: [{ fruit: "a" }] }));
    expect(survey.currentPageNo).toBe(1);
  });
  test("runTriggers() runs a setvalue trigger on the question's value", () => {
    const survey = new SurveyModel(Object.assign(fruitsJson(), {
      triggers: [{ type: "setvalue", expression: "{q1} = 'x'", setToName: "target", setValue: "done" }]
    }));
    survey.data = put(layout, { q1: "x" });
    expect(survey.getValue("target"), "setting data runs no setvalue trigger").toBeUndefined();
    survey.runTriggers();
    expect(survey.getValue("target")).toBe("done");
  });
  test("a copyvalue trigger copies the question's value on a change", () => {
    const survey = new SurveyModel(Object.assign(fruitsJson(), {
      triggers: [{ type: "copyvalue", expression: "{q1} notempty", setToName: "target", fromName: "q1" }]
    }));
    survey.getQuestionByName("q1").value = "y";
    expect(survey.getValue("target")).toBe("y");
  });
  test("a setvalue trigger does not run on a change of its own target", () => {
    const survey = new SurveyModel(Object.assign(fruitsJson(), {
      triggers: [{ type: "setvalue", expression: "{q1} notempty", setToName: "q1", setValue: "fixed" }]
    }));
    const q1 = survey.getQuestionByName("q1");
    q1.value = "y";
    expect(q1.value).toBe("y");
    expect(survey.data).toEqual(put(layout, { q1: "y" }));
  });
  test("performNext in questionPerPage mode runs a complete trigger on the question's value", () => {
    const survey = new SurveyModel(Object.assign(fruitsJson(), {
      questionsOnPageMode: "questionPerPage",
      triggers: [{ type: "complete", expression: "{q1} = 'x'" }]
    }));
    expect(survey.currentSingleElement.name, "the first element").toBe(layout.nested ? "outerPanel" : "q1");
    survey.getQuestionByName("q1").value = "x";
    survey.performNext();
    expect(survey.state).toBe("completed");
  });
});

describe("nested data path: runTriggers() and an empty question", () => {
  // Kept as it was: the root keys come from the data, so an empty top-level question is no key, while the keys
  // of an inner question's path are added even when they are empty.
  test.each(layouts)("$title", (layout: Layout) => {
    const survey = new SurveyModel({ elements: wrap(layout, [{ type: "text", name: "q1" }]).concat([{ type: "text", name: "target" }]),
      triggers: [{ type: "setvalue", expression: "{q1} empty", setToName: "target", setValue: "done" }] });
    survey.runTriggers();
    expect(survey.getValue("target")).toBe(layout.nested ? "done" : undefined);
  });
});

describe("nested data path: runTriggers() keys below the root hold the stored values", () => {
  // Kept as it was (review finding): getFilteredValues() gives the root keys, with filtered values; the keys
  // of an inner question's path are read from the stored data. {inn[0]} reads the stored item, not "apple".
  test.each(layouts)("$title", (layout: Layout) => {
    const survey = new SurveyModel({ elements: wrap(layout, [
      { type: "checkbox", name: "inn", valuePropertyName: "fruit", choices: ["apple", "pear"] },
      { type: "text", name: "other" }
    ]).concat([{ type: "text", name: "t" }]),
    triggers: [{ type: "setvalue", expression: "{inn[0]} empty", setToName: "t", setValue: "fired" }] });
    survey.getQuestionByName("other").value = "x";
    survey.runTriggers();
    expect(survey.getValue("t")).toBe(layout.nested ? undefined : "fired");
  });
  test("performNext: an inner question named like its container key", () => {
    const survey = new SurveyModel({ dataNesting: "page", questionsOnPageMode: "questionPerPage",
      triggers: [{ type: "complete", expression: "{page1.street} = 'x'" }],
      pages: [{ name: "page1", elements: [{ type: "text", name: "page1", valueName: "street" }, { type: "text", name: "last" }] }] });
    survey.getQuestionByName("page1").value = "x";
    expect(survey.data).toEqual({ page1: { street: "x" } });
    survey.performNext();
    expect(survey.state).toBe("completed");
  });
});

describe("nested data path: questionPerPage auto-advance, a write by an off-screen sharer", () => {
  // A deliberate change (prompt 14, "questions sharing a value"): an inner question's holders are the questions
  // sharing its value, as a top-level question's are. Before, an inner writer was its only holder.
  test.each([{ dataNesting: "none" }, { dataNesting: "page" }])("dataNesting $dataNesting", async (opt: any) => {
    await withNoDelay(async () => {
      const survey = new SurveyModel({ autoAdvanceEnabled: true, questionsOnPageMode: "questionPerPage", dataNesting: opt.dataNesting,
        pages: [{ name: "page1", elements: [
          { type: "dropdown", name: "q1", valueName: "shared", choices: ["a", "b"] },
          { type: "dropdown", name: "q2", valueName: "shared", choices: ["a", "b"] },
          { type: "text", name: "last" }] }] });
      survey.getQuestionByName("q1").value = "a";
      await delay();
      expect(survey.currentSingleElement.name).toBe("q2");
      survey.getQuestionByName("q1").value = "b";
      await delay();
      expect(survey.currentSingleElement.name, "q2 holds the value and is on screen").toBe("last");
    });
  });
});

describe.each(layouts)("nested data path: unknown keys ($title)", (layout: Layout) => {
  const json = (): any => ({
    elements: wrap(layout, [
      { type: "dropdown", name: "q1", choices: ["a", "b"], showCommentArea: true },
      { type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "c1", cellType: "text", totalType: "sum" }] }
    ]),
    calculatedValues: [
      { name: "cv1", expression: "1", includeIntoResult: true },
      { name: "cv2", expression: "2" }
    ]
  });
  const data = (): any => {
    const res: any = put(layout, { "q1": "a", "q1-Comment": "c", "m-total": { c1: 3 }, "foo": 1 });
    res.bar = 2;
    res.cv1 = 1;
    res.cv2 = 2;
    return res;
  };
  test("clearIncorrectValues(true): comment and totals keys, calculated values, an unknown key", () => {
    const survey = new SurveyModel(json());
    survey.data = data();
    survey.clearIncorrectValues(true);
    const expected: any = put(layout, { "q1": "a", "q1-Comment": "c", "m-total": { c1: 3 } });
    expected.cv1 = 1;
    expect(survey.data).toEqual(expected);
  });
  test("clearIncorrectValues(true): a calculated value is known at the root only", () => {
    const survey = new SurveyModel(json());
    survey.data = put(layout, { q1: "a", cv1: 5 });
    survey.clearIncorrectValues(true);
    // cv1 is in the data at the root (includeIntoResult); inside a container's object it is an unknown key.
    expect(survey.data).toEqual(layout.nested ? { outer: { inner: { q1: "a" } }, cv1: 1 } : { q1: "a", cv1: 1 });
  });
  test("clearIncorrectValues(true): an object that becomes empty goes, up through the containers", () => {
    const survey = new SurveyModel(json());
    survey.data = put(layout, { foo: 1 });
    survey.clearIncorrectValues(true);
    expect(survey.data, "cv1 is a calculated value in the result").toEqual({ cv1: 1 });
  });
  test("setData() reports unknown keys by path", () => {
    const survey = new SurveyModel(json());
    const issues = survey.setData(data());
    const prefix = layout.nested ? "outer.inner." : "";
    expect(issues.filter(issue => issue.type === "unknownProperty").map(issue => issue.path).sort())
      .toEqual(["bar", "cv2", prefix + "foo"].sort());
  });
});

describe("nested data path: unknown keys with shared keys (D4)", () => {
  test("two containers with one key, two levels deep, and questions sharing a value name at the root", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "t1", valueName: "shared" },
      { type: "text", name: "t2", valueName: "shared" },
      { type: "panel", name: "outerPanel", valueName: "outer", elements: [
        { type: "panel", name: "a1", valueName: "inner", elements: [{ type: "text", name: "q1" }] },
        { type: "panel", name: "a2", valueName: "inner", elements: [{ type: "text", name: "q2" }] }
      ] }
    ] });
    survey.data = { "shared": "s", "shared-Comment": "c", "outer": { inner: { q1: "a", q2: "b", foo: 1 }, bar: 2 } };
    survey.clearIncorrectValues(true);
    expect(survey.data).toEqual({ "shared": "s", "shared-Comment": "c", "outer": { inner: { q1: "a", q2: "b" } } });
    const issues = survey.setData({ shared: "s", outer: { inner: { q1: "a", q2: "b", foo: 1 }, bar: 2 } });
    expect(issues.map(issue => issue.type + ":" + issue.path).sort()).toEqual(["unknownProperty:outer.bar", "unknownProperty:outer.inner.foo"]);
  });
});

describe.each(layouts)("nested data path: a shared value name ($title)", (layout: Layout) => {
  const sharedJson = (extra?: any): any => Object.assign({ pages: [
    { name: "page1", elements: wrap(layout, [
      { type: "dropdown", name: "q1", valueName: "shared", choices: ["a", "b"] },
      { type: "dropdown", name: "q2", valueName: "shared", choices: ["a", "b"] }
    ]) },
    { name: "page2", elements: [{ type: "text", name: "last" }] }
  ] }, extra || {});
  test("hasVisibleQuestionByValueName", () => {
    const survey = new SurveyModel(sharedJson());
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(survey.hasVisibleQuestionByValueName(q1)).toBe(true);
    q2.visible = false;
    expect(survey.hasVisibleQuestionByValueName(q1)).toBe(false);
    expect(survey.hasVisibleQuestionByValueName(q2)).toBe(true);
    q1.value = "a";
    expect(q2.value, "they share the value").toBe("a");
  });
  test("the hidden sharer's value stays on complete", () => {
    const survey = new SurveyModel(sharedJson());
    survey.getQuestionByName("q2").visible = false;
    survey.getQuestionByName("q2").value = "b";
    survey.doComplete();
    expect(survey.data).toEqual(put(layout, { shared: "b" }));
  });
  test("auto-advance: a write of either sharer moves to the next page", async () => {
    await withNoDelay(async () => {
      const survey = new SurveyModel(sharedJson({ autoAdvanceEnabled: true }));
      survey.getQuestionByName("q2").value = "a";
      await delay();
      expect(survey.currentPageNo).toBe(1);
      survey.currentPageNo = 0;
      survey.clear(true, true);
      survey.getQuestionByName("q1").value = "b";
      await delay();
      expect(survey.currentPageNo).toBe(1);
    });
  });
  test("auto-advance in questionPerPage mode: the question on screen", async () => {
    await withNoDelay(async () => {
      const survey = new SurveyModel(sharedJson({ autoAdvanceEnabled: true, questionsOnPageMode: "questionPerPage" }));
      // Top-level, each sharer is an element; nested, the container is the one element that holds both.
      expect(survey.currentSingleElement.name).toBe(layout.nested ? "outerPanel" : "q1");
      survey.getQuestionByName("q1").value = "a";
      await delay();
      expect(survey.currentSingleElement.name).toBe(layout.nested ? "last" : "q2");
      if (layout.nested) return;
      // q2 is on screen; a code write of q1, the first holder, off screen.
      survey.getQuestionByName("q1").value = "b";
      await delay();
      expect(survey.currentSingleElement.name, "the value's holder q2 is on screen").toBe("last");
    });
  });
  test("auto-advance: Enter on a sharer", async () => {
    await withNoDelay(async () => {
      const survey = new SurveyModel(sharedJson({ autoAdvanceEnabled: true }));
      const q1: any = survey.getQuestionByName("q1");
      const q2: any = survey.getQuestionByName("q2");
      expect(q1.canAdvanceOnEnter(), "the first sharer").toBe(true);
      expect(q2.canAdvanceOnEnter(), "the second sharer").toBe(layout.nested);
    });
  });
});

describe("nested data path: getQuestionByValueName / getQuestionsByValueName (D9)", () => {
  const json = (): any => ({ pages: [
    { name: "page1", elements: [
      { type: "text", name: "q1", valueName: "shared" },
      { type: "text", name: "q2", valueName: "shared" },
      { type: "panel", name: "outerPanel", valueName: "outer", elements: [
        { type: "panel", name: "innerPanel", valueName: "inner", elements: [{ type: "text", name: "q4", valueName: "shared" }] }
      ] },
      { type: "panel", name: "flat", elements: [{ type: "text", name: "q3", valueName: "shared" }] }
    ] },
    { name: "page2", elements: [{ type: "text", name: "q5" }] }
  ] });
  const names = (survey: SurveyModel): Array<string> => (survey.getQuestionsByValueName("shared") || []).map(q => q.name);
  test("an inner question gives null", () => {
    const survey = new SurveyModel(json());
    expect(survey.getQuestionByValueName("q4")).toBeNull();
    expect(survey.getQuestionsByValueName("q4")).toBeNull();
    expect(survey.getQuestionByValueName("inner")).toBeNull();
    expect(survey.getQuestionByValueName("outer")).toBeNull();
    expect(names(survey)).toEqual(["q1", "q2", "q3"]);
    expect(survey.getQuestionByValueName("SHARED", true).name).toBe("q1");
  });
  const sortedNames = (survey: SurveyModel): Array<string> => names(survey).sort();
  test("the questions found after a rename, a move, a valueName and a dataNesting change", () => {
    const survey = new SurveyModel(json());
    survey.getQuestionByName("q1").name = "q1a";
    expect(sortedNames(survey), "a rename").toEqual(["q1a", "q2", "q3"]);
    survey.pages[1].addElement(survey.getQuestionByName("q2"));
    expect(sortedNames(survey), "a move").toEqual(["q1a", "q2", "q3"]);
    survey.getQuestionByName("q1a").valueName = "other";
    expect(sortedNames(survey), "a valueName change").toEqual(["q2", "q3"]);
    survey.getQuestionByName("q1a").valueName = "shared";
    survey.dataNesting = "none";
    expect(sortedNames(survey), "dataNesting \"none\": every question").toEqual(["q1a", "q2", "q3", "q4"]);
    survey.dataNesting = "auto";
    expect(sortedNames(survey), "dataNesting \"auto\" again").toEqual(["q1a", "q2", "q3"]);
  });
  test("the questions found in a survey without nesting after a rename and a dataNesting change", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1", valueName: "shared" },
      { type: "panel", name: "p1", elements: [{ type: "text", name: "q2", valueName: "shared" }] },
      { type: "text", name: "q3", valueName: "shared" }
    ] });
    survey.getQuestionByName("q1").name = "q1a";
    survey.dataNesting = "none";
    expect(sortedNames(survey), "no nesting container").toEqual(["q1a", "q2", "q3"]);
    survey.dataNesting = "panel";
    expect(sortedNames(survey), "p1 nests now").toEqual(["q1a", "q3"]);
  });
  // The value-name hash keeps the order added, with or without nesting: a dataNesting change only decides
  // which of the questions are top-level.
  test("the order is the order added", () => {
    const survey = new SurveyModel(json());
    survey.getQuestionByName("q1").name = "q1a";
    expect(names(survey), "a rename").toEqual(["q2", "q3", "q1a"]);
    survey.dataNesting = "none";
    expect(names(survey), "dataNesting \"none\"").toEqual(["q2", "q4", "q3", "q1a"]);
    survey.dataNesting = "auto";
    expect(names(survey), "dataNesting \"auto\" again").toEqual(["q2", "q3", "q1a"]);
  });
});

describe("nested data path: onValueChanged / onValueChanging (D1, D13)", () => {
  const collect = (survey: SurveyModel): Array<string> => {
    const res: Array<string> = [];
    const name = (q: any): string => q === undefined ? "undefined" : q === null ? "null" : q.name;
    survey.onValueChanging.add((_, o) => res.push("changing:" + o.name + ":" + name(o.question)));
    survey.onValueChanged.add((_, o) => res.push("changed:" + o.name + ":" + name(o.question)));
    return res;
  };
  test.each(layouts)("$title", (layout: Layout) => {
    const survey = new SurveyModel({ checkErrorsMode: "onValueChanging", elements: wrap(layout, [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", valueName: "v2" },
      { type: "text", name: "req", isRequired: true }
    ]).concat([{ type: "text", name: "top" }]) });
    const log = collect(survey);
    const key = layout.nested ? "outer" : "q1";
    survey.getQuestionByName("q1").value = "a";
    survey.getQuestionByName("q2").value = "b";
    survey.setValue(key, layout.nested ? { inner: { q1: "c" } } : "c");
    survey.setValue("top", "t");
    survey.setValue("none", "n");
    // A code write of a top-level key runs onValueChanging again when its question takes the value; a key no
    // question and no container owns is dropped by the validation (today's behaviour, kept).
    expect(log).toEqual(layout.nested ? [
      "changing:outer:q1", "changed:outer:q1",
      "changing:outer:q2", "changed:outer:q2",
      "changing:outer:null", "changed:outer:undefined",
      "changing:top:top", "changing:top:top", "changed:top:top",
      "changing:none:null"
    ] : [
      "changing:q1:q1", "changed:q1:q1",
      "changing:v2:q2", "changed:v2:q2",
      "changing:q1:q1", "changing:q1:q1", "changed:q1:q1",
      "changing:top:top", "changing:top:top", "changed:top:top",
      "changing:none:null"
    ]);
    expect(survey.getQuestionByName("q1").value).toBe("c");
    expect(survey.getQuestionByName("req").errors.length, "an empty required question does not block another's write").toBe(0);
  });
});

describe("nested data path: performance", () => {
  test("a survey without nesting: adding 100 questions and writing 100 values walks no panels", () => {
    const survey = new SurveyModel({ elements: [{ type: "panel", name: "p1", elements: [{ type: "text", name: "q0" }] }] });
    const panel = <PanelModel>survey.getPanelByName("p1");
    const spy = vi.spyOn(PanelModelBase.prototype, "getDataScope");
    for (let i = 1; i <= 100; i++) {
      panel.addNewQuestion("text", "q" + i);
    }
    const addCalls = spy.mock.calls.length;
    for (let i = 1; i <= 100; i++) {
      survey.getQuestionByName("q" + i).value = i;
      survey.getQuestionByValueName("q" + i);
    }
    expect(survey.getValue("q100")).toBe(100);
    expect(addCalls, "one container attachment per question added, no walk").toBeLessThanOrEqual(100);
    expect(spy.mock.calls.length - addCalls, "no data scope read on a write").toBe(0);
  });
});
