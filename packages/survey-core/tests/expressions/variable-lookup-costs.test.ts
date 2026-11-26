import { describe, test, expect, vi, afterEach } from "vitest";
import { SurveyModel } from "../../src/survey";
import { ValueGetter, VariableGetterContext } from "../../src/conditions/conditionProcessValue";
import { ConditionRunner } from "../../src/conditions/conditionRunner";
import { QuestionValueGetterContext } from "../../src/question";
import { QuestionSelectBase } from "../../src/question_baseselect";

/* The work of one variable lookup. These are performance items: the tests count calls, they do
   not measure time. */

afterEach(() => {
  vi.restoreAllMocks();
});

describe("a variable lookup parses its name once and asks each context once", () => {
  function createSurvey(): SurveyModel {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "radiogroup", name: "q2", choices: ["a", "b"] }
      ]
    });
    survey.setValue("q1", 1);
    return survey;
  }
  test("a choice condition that reads a survey question", () => {
    const survey = createSurvey();
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    const context = q2.choices[0].getValueGetterContext();
    const parses = vi.spyOn(ValueGetter.prototype, "getPath");
    const asks = vi.spyOn(QuestionValueGetterContext.prototype, "getValue");
    expect(new ConditionRunner("{q1} = 1").runContext(context), "#1").toBe(true);
    expect(parses.mock.calls.length, "#2: the name is parsed once").toBe(1);
    const ownerAsks = asks.mock.instances.filter((ctx: any) => ctx.question === q2).length;
    expect(ownerAsks, "#3: the choice's question is asked once").toBe(1);
    survey.dispose();
  });
  test("a question condition that reads another question builds no context over the survey's variables", () => {
    const survey = createSurvey();
    const q2 = survey.getQuestionByName("q2");
    const variableReads = vi.spyOn(VariableGetterContext.prototype, "getValue");
    expect(new ConditionRunner("{q1} = 1").runContext(q2.getValueGetterContext()), "#1").toBe(true);
    expect(variableReads.mock.calls.length, "#2").toBe(0);
    survey.dispose();
  });
  test("a condition of an empty matrix that reads a survey question builds no context over the matrix value", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "matrix", name: "m", columns: ["c1"], rows: ["r1"] },
        { type: "matrixdropdown", name: "md", rows: ["r1"], columns: [{ name: "col1", cellType: "text" }] }
      ]
    });
    survey.setValue("q1", 1);
    const variableReads = vi.spyOn(VariableGetterContext.prototype, "getValue");
    expect(new ConditionRunner("{q1} = 1").runContext(survey.getQuestionByName("m").getValueGetterContext()), "#1: matrix").toBe(true);
    expect(new ConditionRunner("{q1} = 1").runContext(survey.getQuestionByName("md").getValueGetterContext()), "#2: matrix dropdown").toBe(true);
    expect(variableReads.mock.calls.length, "#3").toBe(0);
    survey.dispose();
  });
});
