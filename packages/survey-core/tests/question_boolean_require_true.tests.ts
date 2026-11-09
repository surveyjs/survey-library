import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";
import { QuestionBooleanModel } from "../src/question_boolean";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { describe, test, expect } from "vitest";

function createQuestion(props: any): { survey: SurveyModel, q: QuestionBooleanModel } {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "boolean", name: "b" }, props)] });
  return { survey: survey, q: <QuestionBooleanModel>survey.getQuestionByName("b") };
}
function requiredErrors(q: QuestionBooleanModel): Array<string> {
  q.validate(true);
  return q.errors.map(err => err.getErrorType());
}

describe("boolean requiredTrue, Issue#12241", () => {
  test("isRequired + requiredTrue: untouched, false and true", () => {
    const { q } = createQuestion({ isRequired: true, requiredTrue: true });
    expect(q.requiredTrue).toBe(true);
    expect(requiredErrors(q), "untouched").toEqual(["required"]);
    q.value = false;
    expect(requiredErrors(q), "false").toEqual(["required"]);
    expect(q.errors[0].text).toBe(q.requiredErrorText);
    q.value = true;
    expect(requiredErrors(q), "true").toEqual([]);
  });
  test("isRequired without requiredTrue accepts false", () => {
    const { q } = createQuestion({ isRequired: true });
    expect(q.requiredTrue).toBe(false);
    q.value = false;
    expect(requiredErrors(q)).toEqual([]);
  });
  test("requiredTrue without isRequired does nothing", () => {
    const { q } = createQuestion({ requiredTrue: true });
    expect(requiredErrors(q), "untouched").toEqual([]);
    q.value = false;
    expect(requiredErrors(q), "false").toEqual([]);
  });
  test("requiredIf that holds and that does not hold", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "t" },
        { type: "boolean", name: "b", requiredIf: "{t} = 'a'", requiredTrue: true },
      ],
    });
    const q = <QuestionBooleanModel>survey.getQuestionByName("b");
    q.value = false;
    expect(requiredErrors(q), "requiredIf does not hold").toEqual([]);
    survey.setValue("t", "a");
    expect(q.isRequired).toBe(true);
    q.clearValue();
    expect(requiredErrors(q), "requiredIf holds, untouched").toEqual(["required"]);
    q.value = false;
    expect(requiredErrors(q), "requiredIf holds, false").toEqual(["required"]);
    q.value = true;
    expect(requiredErrors(q), "requiredIf holds, true").toEqual([]);
  });
  test("custom valueTrue and valueFalse", () => {
    const { q } = createQuestion({ isRequired: true, requiredTrue: true, valueTrue: "yes", valueFalse: "no" });
    q.value = "no";
    expect(requiredErrors(q), "no").toEqual(["required"]);
    q.value = "yes";
    expect(requiredErrors(q), "yes").toEqual([]);
    q.booleanValue = false;
    expect(q.value).toBe("no");
    expect(requiredErrors(q), "booleanValue false").toEqual(["required"]);
  });
  ["checkbox", "radio", "switch"].forEach(renderAs => {
    test("renderAs: " + renderAs, () => {
      const { q } = createQuestion({ isRequired: true, requiredTrue: true, renderAs: renderAs });
      expect(requiredErrors(q), "untouched").toEqual(["required"]);
      q.value = false;
      expect(requiredErrors(q), "false").toEqual(["required"]);
      q.value = true;
      expect(requiredErrors(q), "true").toEqual([]);
    });
  });
  test("false stays an answer: isEmpty, the empty operator and the data", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "b", isRequired: true, requiredTrue: true },
        { type: "text", name: "t", visibleIf: "{b} empty" },
      ],
    });
    const q = <QuestionBooleanModel>survey.getQuestionByName("b");
    const t = survey.getQuestionByName("t");
    expect(t.isVisible, "untouched: {b} empty").toBe(true);
    q.value = false;
    expect(q.isEmpty()).toBe(false);
    expect(q.isAnswered).toBe(true);
    expect(t.isVisible, "false: {b} empty is false").toBe(false);
    expect(survey.data).toEqual({ b: false });
    expect(requiredErrors(q)).toEqual(["required"]);
  });
  test("defaultValue: false with isRequired and requiredTrue: completing fails", () => {
    const { survey, q } = createQuestion({ isRequired: true, requiredTrue: true, defaultValue: false });
    expect(survey.data).toEqual({ b: false });
    expect(survey.tryComplete()).toBe(false);
    expect(survey.state).toBe("running");
    expect(q.errors.map(err => err.getErrorType())).toEqual(["required"]);
    q.value = true;
    expect(survey.tryComplete()).toBe(true);
    expect(survey.data).toEqual({ b: true });
  });
  test("checkErrorsMode: onValueChanged shows the error when the box is unchecked", () => {
    const { survey, q } = createQuestion({ isRequired: true, requiredTrue: true });
    survey.checkErrorsMode = "onValueChanged";
    q.value = true;
    expect(q.errors).toHaveLength(0);
    q.value = false;
    expect(q.errors.map(err => err.getErrorType())).toEqual(["required"]);
    q.value = true;
    expect(q.errors).toHaveLength(0);
  });
  test("checkErrorsMode: onValueChanged shows the error when No is chosen first", () => {
    const { survey, q } = createQuestion({ isRequired: true, requiredTrue: true });
    survey.checkErrorsMode = "onValueChanged";
    q.value = false;
    expect(q.errors.map(err => err.getErrorType())).toEqual(["required"]);
    q.value = true;
    expect(q.errors).toHaveLength(0);
  });
  test("switching requiredTrue off clears its required error", () => {
    const { q } = createQuestion({ isRequired: true, requiredTrue: true });
    q.value = false;
    expect(requiredErrors(q)).toEqual(["required"]);
    q.requiredTrue = false;
    expect(q.errors).toHaveLength(0);
  });
  test("a matrix cell in onValueChanged mode shows the error when No is chosen first", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "c", cellType: "boolean", isRequired: true, requiredTrue: true }],
      }],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const cell = matrix.visibleRows[0].getQuestionByColumnName("c");
    cell.value = false;
    expect(cell.errors.map(err => err.getErrorType())).toEqual(["required"]);
  });
  test("a column with no cellType in a boolean matrix gets requiredTrue", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1, cellType: "boolean",
        columns: [{ name: "c", isRequired: true, requiredTrue: true }],
      }],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const cell = <QuestionBooleanModel>matrix.visibleRows[0].getQuestionByColumnName("c");
    expect(cell.getType()).toBe("boolean");
    expect(cell.requiredTrue).toBe(true);
    cell.value = false;
    expect(survey.tryComplete()).toBe(false);
    expect(cell.errors.map(err => err.getErrorType())).toEqual(["required"]);
    expect(matrix.toJSON().columns).toEqual([{ name: "c", isRequired: true, requiredTrue: true }]);
  });
  test("a boolean matrix column with isRequired and requiredTrue", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 2,
        columns: [{ name: "c", cellType: "boolean", isRequired: true, requiredTrue: true }],
      }],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const column = matrix.getColumnByName("c");
    expect((<any>column).requiredTrue).toBe(true);
    const rows = matrix.visibleRows;
    rows[0].getQuestionByColumnName("c").value = false;
    rows[1].getQuestionByColumnName("c").value = true;
    expect(matrix.validate(true)).toBe(false);
    const cell0 = rows[0].getQuestionByColumnName("c");
    const cell1 = rows[1].getQuestionByColumnName("c");
    expect((<QuestionBooleanModel>cell0).requiredTrue).toBe(true);
    expect(cell0.errors.map(err => err.getErrorType())).toEqual(["required"]);
    expect(cell1.errors).toHaveLength(0);
    expect(matrix.toJSON().columns).toEqual([{ name: "c", cellType: "boolean", isRequired: true, requiredTrue: true }]);
  });
  test("serialization: absent when false, round-trips when true", () => {
    const { q } = createQuestion({});
    expect(q.toJSON()).toEqual({ name: "b" });
    q.requiredTrue = true;
    q.isRequired = true;
    expect(q.toJSON()).toEqual({ name: "b", isRequired: true, requiredTrue: true });
    const copy = <QuestionBooleanModel>Serializer.createClass("boolean");
    copy.fromJSON(q.toJSON());
    expect(copy.requiredTrue).toBe(true);
    const prop = Serializer.findProperty("boolean", "requiredTrue");
    expect(prop.type).toBe("boolean");
    expect(prop.isDefaultValue(false)).toBe(true);
  });
  test("property visibility: shown only while the question is required or has requiredIf", () => {
    const { q } = createQuestion({});
    const prop = Serializer.findProperty("boolean", "requiredTrue");
    expect(prop.dependsOn).toEqual(["isRequired", "requiredIf"]);
    expect(prop.isVisible("", q), "not required").toBe(false);
    q.isRequired = true;
    expect(prop.isVisible("", q), "isRequired").toBe(true);
    q.isRequired = false;
    q.requiredIf = "{t} = 1";
    expect(prop.isVisible("", q), "requiredIf").toBe(true);
  });
});
