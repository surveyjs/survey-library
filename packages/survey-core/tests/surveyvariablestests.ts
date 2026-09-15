import { SurveyModel } from "../src/survey";
import { FunctionFactory } from "../src/functionsfactory";

import { describe, test, expect, beforeEach, afterEach } from "vitest";

let conditionRunCount = 0;
function countConditionRun(): number {
  conditionRunCount++;
  return 1;
}

describe("survey.setVariables (issue #11814)", () => {
  beforeEach(() => {
    conditionRunCount = 0;
    // An expression with a function is never skipped by the dependency check, so it is called
    // exactly once per question on every conditions pass
    FunctionFactory.Instance.register("countConditionRun", countConditionRun);
  });
  afterEach(() => {
    FunctionFactory.Instance.unregister("countConditionRun");
  });

  const countingSurveyJson = {
    elements: [
      { type: "text", name: "q1", visibleIf: "countConditionRun() = 1" },
      { type: "text", name: "q2", visibleIf: "countConditionRun() = 1" },
      { type: "text", name: "q3", visibleIf: "countConditionRun() = 1" }
    ],
    triggers: [
      { type: "runexpression", expression: "{v1} notempty", runExpression: "1" }
    ]
  };

  test("setVariables runs conditions once, a setVariable loop runs them per variable", () => {
    const variables = { v1: 1, v2: 2, v3: 3, v4: 4 };
    const batchSurvey = new SurveyModel(countingSurveyJson);
    let batchTriggerCount = 0;
    batchSurvey.onTriggerExecuted.add(() => { batchTriggerCount++; });
    conditionRunCount = 0;
    batchSurvey.setVariables(variables);
    // three questions, one pass
    expect(conditionRunCount).toBe(3);
    expect(batchTriggerCount).toBe(1);

    const loopSurvey = new SurveyModel(countingSurveyJson);
    conditionRunCount = 0;
    for (const key in variables) {
      loopSurvey.setVariable(key, (<any>variables)[key]);
    }
    // three questions, four passes - the behavior setVariables replaces
    expect(conditionRunCount).toBe(12);
  });
  test("a single setVariable still runs conditions once", () => {
    const survey = new SurveyModel(countingSurveyJson);
    conditionRunCount = 0;
    survey.setVariable("v1", 1);
    expect(conditionRunCount).toBe(3);
  });
  test("setVariables does not expose a half-set state, in any key order", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", visibleIf: "{tier} = 'gold' and {years} > 10" },
        { type: "text", name: "q2" }
      ],
      triggers: [
        { type: "setvalue", expression: "{tier} = 'gold'", setToName: "q2", setValue: "premium" }
      ]
    };
    [{ tier: "gold", years: 12 }, { years: 12, tier: "gold" }].forEach((variables) => {
      const survey = new SurveyModel(json);
      let triggerCount = 0;
      survey.onTriggerExecuted.add(() => { triggerCount++; });
      const q1 = survey.getQuestionByName("q1");
      expect(q1.isVisible).toBeFalsy();
      survey.setVariables(variables);
      expect(q1.isVisible).toBeTruthy();
      expect(triggerCount).toBe(1);
      expect(survey.getValue("q2")).toBe("premium");
    });
  });
  test("merge is the default", () => {
    const survey = new SurveyModel();
    survey.setVariables({ a: 1 });
    survey.setVariables({ b: 2 });
    expect(survey.getVariable("a")).toBe(1);
    expect(survey.getVariable("b")).toBe(2);
    expect(survey.getVariableNames()).toEqual(["a", "b"]);
  });
  test("clearPrevious removes the variables that are not in the argument", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", visibleIf: "{b} notempty" }]
    });
    const q1 = survey.getQuestionByName("q1");
    survey.setVariables({ a: 1, b: 2 });
    expect(q1.isVisible).toBeTruthy();
    survey.setVariables({ a: 1 }, true);
    expect(survey.getVariable("a")).toBe(1);
    expect(survey.getVariable("b")).toBeUndefined();
    expect(survey.getVariableNames()).toEqual(["a"]);
    expect(q1.isVisible).toBeFalsy();
  });
  test("clearPrevious with an empty or undefined argument clears everything", () => {
    const survey = new SurveyModel();
    survey.setVariables({ a: 1, b: 2 });
    survey.setVariables({}, true);
    expect(survey.getVariableNames()).toEqual([]);
    survey.setVariables({ a: 1, b: 2 });
    survey.setVariables(undefined, true);
    expect(survey.getVariableNames()).toEqual([]);
  });
  test("setVariables does nothing on an empty argument without clearPrevious", () => {
    const survey = new SurveyModel();
    survey.setVariables({ a: 1 });
    survey.setVariables(undefined);
    survey.setVariables(null);
    expect(survey.getVariableNames()).toEqual(["a"]);
    expect(survey.getVariable("a")).toBe(1);
  });
  test("nothing changed - nothing runs", () => {
    const survey = new SurveyModel(countingSurveyJson);
    let changedCount = 0;
    survey.onVariableChanged.add(() => { changedCount++; });
    conditionRunCount = 0;
    survey.setVariables({ v1: 1, v2: 2 });
    expect(changedCount).toBe(2);
    expect(conditionRunCount).toBe(3);
    conditionRunCount = 0;
    survey.setVariables({ v1: 1, v2: 2 });
    expect(changedCount).toBe(2);
    expect(conditionRunCount).toBe(0);
  });
  test("onVariableChanged fires per changed name after the batch has settled", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 'gold' and {years} > 10" }]
    });
    const q1 = survey.getQuestionByName("q1");
    const events: Array<any> = [];
    survey.onVariableChanged.add((sender, options) => {
      events.push({ name: options.name, value: options.value, isVisible: q1.isVisible });
    });
    survey.setVariables({ Tier: "gold", years: 12 });
    expect(events).toEqual([
      { name: "tier", value: "gold", isVisible: true },
      { name: "years", value: 12, isVisible: true }
    ]);
    events.length = 0;
    survey.setVariables({ tier: "gold" }, true);
    expect(events).toEqual([{ name: "years", value: undefined, isVisible: false }]);
  });
  test("variable names are case-insensitive, the last key wins", () => {
    const survey = new SurveyModel();
    survey.setVariables({ Tier: "gold" });
    expect(survey.getVariable("tier")).toBe("gold");
    expect(survey.getVariableNames()).toEqual(["tier"]);
    survey.setVariables({ tier: "a", TIER: "b" });
    expect(survey.getVariable("tier")).toBe("b");
    expect(survey.getVariableNames()).toEqual(["tier"]);
  });
  test("a variable removes the data key with the same name, as setVariable does", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.setValue("q1", "abc");
    expect(survey.data.q1).toBe("abc");
    survey.setVariables({ q1: 5 });
    expect(survey.data.q1).toBeUndefined();
    expect(survey.getVariable("q1")).toBe(5);
  });
  test("question-level triggers run for a batch, as they do for setVariable", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", resetValueIf: "{tier} = 'gold' and {years} > 10" },
        { type: "text", name: "q2", setValueIf: "{tier} = 'gold'", setValueExpression: "'premium'" }
      ]
    };
    const survey = new SurveyModel(json);
    survey.setValue("q1", "abc");
    survey.setVariables({ tier: "gold", years: 12 });
    expect(survey.data).toEqual({ q2: "premium" });

    const loopSurvey = new SurveyModel(json);
    loopSurvey.setValue("q1", "abc");
    loopSurvey.setVariable("tier", "gold");
    loopSurvey.setVariable("years", 12);
    expect(loopSurvey.data).toEqual(survey.data);
  });
  test("empty keys are skipped", () => {
    const survey = new SurveyModel();
    survey.setVariables({ "": 1, a: 2 });
    expect(survey.getVariableNames()).toEqual(["a"]);
  });
});
