import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../src/survey";
import { PanelModel } from "../src/panel";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { SurveyConditionEditorItem } from "../src/conditions/conditionEditorItems";
import { getDataScopeHost } from "../src/panel-data-scope";
import { ISurvey } from "../src/base-interfaces";

describe("Nested data: the survey as the host of its data scopes", () => {
  afterEach(() => { vi.restoreAllMocks(); });
  test("a SurveyModel is its own host; a survey object without the members has none", () => {
    const survey = new SurveyModel();
    expect(getDataScopeHost(survey), "#1").toBe(survey);
    expect(getDataScopeHost(<ISurvey><any>{}), "#2").toBeUndefined();
    expect(getDataScopeHost(<ISurvey><any>{ getQuestionByName: () => null }), "#3").toBeUndefined();
    expect(getDataScopeHost(null), "#4").toBeUndefined();
    expect(getDataScopeHost(undefined), "#5").toBeUndefined();
  });
  test("the callers ask a survey object without the members nothing", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "street" }] },
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
        { type: "panel", name: "inner", valueName: "home", elements: [{ type: "text", name: "town" }] }] }
    ] });
    const partial = <ISurvey><any>{};
    const panel = <PanelModel>survey.getPanelByName("panel1");
    const item = (<QuestionPanelDynamicModel>survey.getQuestionByName("dp")).panels[0].data;
    expect((<any>item).getNestedDataNames(), "#1: the survey").toContain("home");
    vi.spyOn(<any>item, "getSurvey").mockReturnValue(partial);
    expect((<any>item).getNestedDataNames(), "#2: no host, no nesting walk").toEqual([]);
    const spy = vi.spyOn(survey, "dataScopeValueChanged");
    panel.onSurveyValueChanged({ street: "a" });
    expect(spy, "#3: the survey").toHaveBeenCalledTimes(1);
    vi.spyOn(panel, "survey", "get").mockReturnValue(partial);
    expect(() => panel.onSurveyValueChanged({ street: "b" }), "#4: no host").not.toThrow();
    expect(spy, "#5: the survey is not asked").toHaveBeenCalledTimes(1);
  });
  test("the condition editor writes a question's data path for a survey object without the members", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "top", valueName: "city" },
      { type: "panel", name: "panel1", valueName: "address", elements: [{ type: "text", name: "city", valueName: "town" }] }
    ] });
    const item = new SurveyConditionEditorItem(survey);
    item.questionName = "city";
    item.value = 1;
    expect(item.toExpression(), "#1: the survey, {city} is the top-level value name: the path").toBe("{address.town} = 1");
    const partial = <ISurvey><any>{ getQuestionByName: (name: string) => survey.getQuestionByName(name) };
    const item2 = new SurveyConditionEditorItem(partial);
    item2.questionName = "city";
    item2.value = 1;
    expect(item2.toExpression(), "#2: no host to resolve the name: the path").toBe("{address.town} = 1");
  });
});
