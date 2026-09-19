import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { SurveyDataDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";

// The check Andrew asked for: can a DynamicDataList get and post its records through ISurveyData?
// getValue/setValue are all it needs - comments are ordinary keys inside a record, so getComment and
// setComment never come into play.
describe("SurveyDataDynamicDataSource over a real SurveyModel", () => {
  function createSurvey(): SurveyModel {
    return new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
  }
  test("reads the survey value", () => {
    const survey = createSurvey();
    survey.setValue("items", [{ a: 1 }, { a: 2 }]);
    const source = new SurveyDataDynamicDataSource(survey, "items");
    expect(source.read().length).toBe(2);
    expect(source.read()[0].a).toBe(1);
  });
  test("a missing or non-array value reads as empty", () => {
    const survey = createSurvey();
    const source = new SurveyDataDynamicDataSource(survey, "items");
    expect(source.read()).toEqual([]);
    survey.setValue("items", "not an array");
    expect(source.read()).toEqual([]);
  });
  test("writes land in survey.data", () => {
    const survey = createSurvey();
    const source = new SurveyDataDynamicDataSource(survey, "items");
    source.insert(0, { a: 1 });
    source.insert(1, { a: 2 });
    expect(survey.data["items"]).toEqual([{ a: 1 }, { a: 2 }]);
    source.update(0, { a: 11 });
    expect(survey.data["items"]).toEqual([{ a: 11 }, { a: 2 }]);
    source.move(0, 1);
    expect(survey.data["items"]).toEqual([{ a: 2 }, { a: 11 }]);
    source.remove(0);
    expect(survey.data["items"]).toEqual([{ a: 11 }]);
  });
  test("onValueChanged fires once per write with the array", () => {
    const survey = createSurvey();
    const source = new SurveyDataDynamicDataSource(survey, "items");
    const changes: Array<any> = [];
    survey.onValueChanged.add((sender, options) => {
      changes.push({ name: options.name, value: options.value });
    });
    source.insert(0, { a: 1 });
    expect(changes.length).toBe(1);
    expect(changes[0].name).toBe("items");
    expect(changes[0].value).toEqual([{ a: 1 }]);
    source.update(0, { a: 2 });
    expect(changes.length).toBe(2);
    expect(changes[1].value).toEqual([{ a: 2 }]);
  });
  test("a DynamicDataList over the survey data writes through to survey.data", () => {
    const survey = createSurvey();
    const list = new DynamicDataList(new SurveyDataDynamicDataSource(survey, "items"));
    list.load();
    expect(list.count).toBe(0);
    list.add({ name: "first" });
    list.add({ name: "second" });
    expect(list.count).toBe(2);
    expect(survey.data["items"]).toEqual([{ name: "first" }, { name: "second" }]);
    list.setValue(1, "name", "changed");
    expect(survey.data["items"]).toEqual([{ name: "first" }, { name: "changed" }]);
    expect(list.getValue(1, "name")).toBe("changed");
    list.remove(0);
    expect(survey.data["items"]).toEqual([{ name: "changed" }]);
    expect(list.count).toBe(1);
  });
  test("the list reads a value the survey changed behind its back on the next load", () => {
    const survey = createSurvey();
    const list = new DynamicDataList(new SurveyDataDynamicDataSource(survey, "items"));
    list.load();
    survey.setValue("items", [{ a: 1 }, { a: 2 }, { a: 3 }]);
    expect(list.count).toBe(0);
    list.load();
    expect(list.count).toBe(3);
    expect(list.getValue(2, "a")).toBe(3);
  });
  test("the survey never receives the array instance the list holds", () => {
    const survey = createSurvey();
    const source = new SurveyDataDynamicDataSource(survey, "items");
    const list = new DynamicDataList(source);
    list.load();
    list.add({ a: 1 });
    // SurveyModel unbinds the value it stores, so the stored array is its own copy and the list
    // window is re-read from it.
    expect(source.read()).toEqual([{ a: 1 }]);
    expect(list.getRecord(0)).toEqual({ a: 1 });
  });
});
