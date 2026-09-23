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
  test("the new properties are registered but invisible in the property grid", () => {
    ["source", "fields", "items", "defaultItem", "allowMultipleItems", "allowAddItems",
      "allowReorderItems", "showSearch", "searchFields", "allowChangeSearchFields"].forEach((name) => {
      const prop = Serializer.findProperty("filter", name);
      expect(prop, name).toBeTruthy();
      expect(prop.visible, name).toBe(false);
    });
  });
});
