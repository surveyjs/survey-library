import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { Serializer } from "../../src/jsonobject";
import { QuestionFilterModel } from "../../src/question_filter";

describe("QuestionFilterModel", () => {
  test("the control is a non-value question that still has a title", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", title: "Filter orders" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.hasInput, "#1").toBe(false);
    expect(q.hasTitle, "#2").toBe(true);
    expect(q.title, "#3").toBe("Filter orders");
    expect(q.getConditionJson(), "#4: nothing to compare against").toBe(null);
  });
  test("it never enters survey.data and never blocks completion", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "a" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    // The quick search state the control will also hold (Task T9) cannot be called "searchText":
    // Base.searchText(text, founded) is an existing method that panel.ts calls on every element.
    q.activeItemName = "nosuchitem";
    expect(survey.data, "#1").toEqual({});
    expect(q.getAllErrors(), "#2").toHaveLength(0);
  });
  test("fields and items load and save", () => {
    const json = { type: "filter", name: "f1",
      fields: [{ name: "country", fieldType: "dropdown", choices: ["de", "fr"] }, { name: "age" }],
      items: [{ name: "adults", expression: "{age} > 18" }], defaultItem: "adults" };
    const survey = new SurveyModel({ elements: [json] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(q.fields, "#1").toHaveLength(2);
    expect(q.items[0].expression, "#2").toBe("{age} > 18");
    expect(q.toJSON().items[0].expression, "#3").toBe("{age} > 18");
  });
  test("the theme's filter classes reach the control", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect([q.cssClasses.root, q.cssClasses.chips, q.cssClasses.chipOverflow, q.cssClasses.popup])
      .toEqual(["sd-filter", "sd-filter__chips", "sd-filter__chip--overflow", "sd-filter-popup"]);
  });
  test("the authoring properties are visible; standalone-only and inert ones stay hidden", () => {
    const visibility = (className: string, names: Array<string>): Array<boolean> =>
      names.map((name: string): boolean => Serializer.findProperty(className, name).visible);
    const filterShown = ["source", "items", "defaultItem", "allowMultipleItems", "allowAddItems",
      "showSearch", "searchFields", "allowFastMode", "allowAdvancedMode"];
    const filterHidden = ["fields", "allowReorderItems", "allowChangeSearchFields"];
    expect(visibility("filter", filterShown), "#1").toEqual(filterShown.map(() => true));
    expect(visibility("filter", filterHidden), "#2").toEqual(filterHidden.map(() => false));
    const itemShown = ["name", "title", "type", "expression", "prompt", "allowEdit", "allowDelete"];
    expect(visibility("filteritem", itemShown), "#3").toEqual(itemShown.map(() => true));
    expect(visibility("filteritem", ["allowCopy"]), "#4").toEqual([false]);
  });
  test("defaultItem offers the presets by name", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1",
      items: [{ name: "adults", title: "Adults", expression: "{age} > 18" }, { name: "kids", expression: "{age} < 12" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const choices = Serializer.findProperty("filter", "defaultItem").getChoices(q);
    expect(choices, "#1: none, then the presets").toEqual(["", { value: "adults", text: "Adults" }, { value: "kids", text: "kids" }]);
  });
  test("renaming a preset keeps it the default one", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", defaultItem: "a",
      items: [{ name: "a", expression: "{x} > 1" }, { name: "c", expression: "{x} > 2" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    q.items[1].name = "d";
    expect(q.defaultItem, "#1: another preset").toBe("a");
    q.items[0].name = "b";
    expect(q.defaultItem, "#2").toBe("b");
  });
  test("searchFields offers the source's columns in the designer", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [
      { type: "filter", name: "f1", source: "m", showSearch: true },
      { type: "matrixdynamic", name: "m", columns: [{ name: "country", title: "Country", cellType: "dropdown" }, { name: "age", cellType: "text" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const choices = Serializer.findProperty("filter", "searchFields").getChoices(q);
    expect(choices, "#1").toEqual([{ value: "country", text: "Country" }, { value: "age", text: "age" }]);
  });
  test("allowAddItems is shown only with multiple presets; searchFields only with search", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1" }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const allowAddItems = Serializer.findProperty("filter", "allowAddItems");
    const searchFields = Serializer.findProperty("filter", "searchFields");
    expect([allowAddItems.isVisible("", q), searchFields.isVisible("", q)], "#1").toEqual([true, false]);
    q.allowMultipleItems = false;
    q.showSearch = true;
    expect([allowAddItems.isVisible("", q), searchFields.isVisible("", q)], "#2").toEqual([false, true]);
  });
  test("the new property types keep the JSON", () => {
    const json = { type: "filter", name: "f1", source: "m", defaultItem: "adults", searchFields: ["age"],
      items: [{ name: "adults", expression: "{age} > 18\nand {age} < 99" }] };
    const survey = new SurveyModel({ elements: [json] });
    expect(survey.toJSON().pages[0].elements[0], "#1").toEqual(json);
  });
});
