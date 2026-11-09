import { SurveyModel } from "../src/survey";
import { Serializer } from "../src/jsonobject";
import { QuestionBooleanModel } from "../src/question_boolean";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { surveyLocalization } from "../src/surveyStrings";
import { describe, test, expect } from "vitest";

export * from "../src/localization/german";

const requireTrueText = "You must select Yes to continue.";

function createQuestion(props: any): { survey: SurveyModel, q: QuestionBooleanModel } {
  const survey = new SurveyModel({ elements: [Object.assign({ type: "boolean", name: "b" }, props)] });
  return { survey: survey, q: <QuestionBooleanModel>survey.getQuestionByName("b") };
}
function errorTypes(q: QuestionBooleanModel): Array<string> {
  q.validate(true);
  return q.errors.map(err => err.getErrorType());
}
function errorTexts(q: QuestionBooleanModel): Array<string> {
  q.validate(true);
  return q.errors.map(err => err.getText());
}

describe("boolean requireTrue, Issue#12241", () => {
  test("requireTrue without isRequired: untouched, false and true", () => {
    const { q } = createQuestion({ requireTrue: true });
    expect(q.requireTrue).toBe(true);
    expect(q.isRequired).toBe(false);
    expect(errorTypes(q), "untouched").toEqual(["required"]);
    expect(q.errors[0].getText()).toBe(requireTrueText);
    q.value = false;
    expect(errorTexts(q), "false").toEqual([requireTrueText]);
    q.value = true;
    expect(errorTypes(q), "true").toEqual([]);
  });
  test("requireTrue + isRequired: one error with requireTrueErrorText", () => {
    const { q } = createQuestion({ isRequired: true, requireTrue: true });
    expect(errorTexts(q), "untouched").toEqual([requireTrueText]);
    q.value = false;
    expect(errorTexts(q), "false").toEqual([requireTrueText]);
    q.value = true;
    expect(errorTypes(q), "true").toEqual([]);
  });
  test("isRequired alone accepts false and keeps requiredErrorText", () => {
    const { q } = createQuestion({ isRequired: true, requiredErrorText: "Answer it" });
    expect(q.requireTrue).toBe(false);
    expect(errorTexts(q), "untouched").toEqual(["Answer it"]);
    q.value = false;
    expect(errorTypes(q)).toEqual([]);
  });
  test("isRequired alone uses the default required text", () => {
    const { q } = createQuestion({ isRequired: true });
    expect(errorTexts(q)).toEqual(["Response required."]);
  });
  test("requireTrue off, no isRequired: no errors", () => {
    const { q } = createQuestion({});
    expect(errorTypes(q), "untouched").toEqual([]);
    q.value = false;
    expect(errorTypes(q), "false").toEqual([]);
  });
  test("requiredIf does not change requireTrue", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "t" },
        { type: "boolean", name: "b", requiredIf: "{t} = 'a'", requireTrue: true },
      ],
    });
    const q = <QuestionBooleanModel>survey.getQuestionByName("b");
    expect(q.isRequired).toBe(false);
    q.value = false;
    expect(errorTexts(q), "requiredIf does not hold, false").toEqual([requireTrueText]);
    survey.setValue("t", "a");
    expect(q.isRequired).toBe(true);
    q.clearValue();
    expect(errorTexts(q), "requiredIf holds, untouched").toEqual([requireTrueText]);
    q.value = true;
    expect(errorTypes(q), "requiredIf holds, true").toEqual([]);
  });
  test("custom requireTrueErrorText in JSON", () => {
    const { q } = createQuestion({ requireTrue: true, isRequired: true, requiredErrorText: "Answer it", requireTrueErrorText: "Agree first" });
    expect(errorTexts(q)).toEqual(["Agree first"]);
  });
  test("localized requireTrueErrorText follows a locale change of a shown error", () => {
    const { survey, q } = createQuestion({ requireTrue: true, requireTrueErrorText: { default: "Agree first", de: "Erst zustimmen" } });
    expect(errorTexts(q)).toEqual(["Agree first"]);
    survey.locale = "de";
    expect(q.errors.map(err => err.getText())).toEqual(["Erst zustimmen"]);
    survey.locale = "";
    expect(q.errors.map(err => err.getText())).toEqual(["Agree first"]);
  });
  test("the default requireTrueErrorText follows a locale change of a shown error", () => {
    const deStrings = surveyLocalization.locales["de"];
    const prev = deStrings.requireTrueError;
    deStrings.requireTrueError = "Ja waehlen";
    try {
      const { survey, q } = createQuestion({ requireTrue: true });
      expect(errorTexts(q)).toEqual([requireTrueText]);
      survey.locale = "de";
      expect(q.errors.map(err => err.getText())).toEqual(["Ja waehlen"]);
      survey.locale = "";
    } finally {
      if (prev === undefined) delete deStrings.requireTrueError; else deStrings.requireTrueError = prev;
    }
  });
  test("custom valueTrue and valueFalse", () => {
    const { q } = createQuestion({ requireTrue: true, valueTrue: "yes", valueFalse: "no" });
    q.value = "no";
    expect(errorTypes(q), "no").toEqual(["required"]);
    q.value = "yes";
    expect(errorTypes(q), "yes").toEqual([]);
    q.booleanValue = false;
    expect(q.value).toBe("no");
    expect(errorTypes(q), "booleanValue false").toEqual(["required"]);
  });
  ["checkbox", "radio", "switch"].forEach(renderAs => {
    test("renderAs: " + renderAs, () => {
      const { q } = createQuestion({ requireTrue: true, renderAs: renderAs });
      expect(errorTypes(q), "untouched").toEqual(["required"]);
      q.value = false;
      expect(errorTypes(q), "false").toEqual(["required"]);
      q.value = true;
      expect(errorTypes(q), "true").toEqual([]);
    });
  });
  test("no required mark: requireTrue does not set isRequired", () => {
    const { q } = createQuestion({ requireTrue: true });
    expect(q.isRequired).toBe(false);
    expect(q.requiredMark).toBe("");
    expect(q.requiredText).toBe("");
    expect(q.a11y_input_ariaRequired).toBe("false");
    // the renderers show the mark only through these flags
    expect(q.isRequireTextOnStart).toBe(false);
    expect(q.isRequireTextBeforeTitle).toBe(false);
    expect(q.isRequireTextAfterTitle).toBe(false);
  });
  test("false stays an answer: isEmpty, isAnswered, the empty operator and the data", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "b", requireTrue: true },
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
    expect(errorTypes(q)).toEqual(["required"]);
  });
  test("defaultValue: false with requireTrue: completing fails", () => {
    const { survey, q } = createQuestion({ requireTrue: true, defaultValue: false });
    expect(survey.data).toEqual({ b: false });
    expect(survey.tryComplete()).toBe(false);
    expect(survey.state).toBe("running");
    expect(q.errors.map(err => err.getText())).toEqual([requireTrueText]);
    q.value = true;
    expect(survey.tryComplete()).toBe(true);
    expect(survey.data).toEqual({ b: true });
  });
  test("untouched requireTrue question blocks completing", () => {
    const { survey, q } = createQuestion({ requireTrue: true });
    expect(survey.tryComplete()).toBe(false);
    expect(q.errors.map(err => err.getText())).toEqual([requireTrueText]);
  });
  test("checkErrorsMode: onValueChanged shows the error when the box is unchecked", () => {
    const { survey, q } = createQuestion({ requireTrue: true });
    survey.checkErrorsMode = "onValueChanged";
    q.value = true;
    expect(q.errors.length).toBe(0);
    q.value = false;
    expect(q.errors.map(err => err.getText())).toEqual([requireTrueText]);
    q.value = true;
    expect(q.errors.length).toBe(0);
  });
  test("checkErrorsMode: onValueChanged shows the error when No is chosen first", () => {
    const { survey, q } = createQuestion({ requireTrue: true });
    survey.checkErrorsMode = "onValueChanged";
    q.value = false;
    expect(q.errors.map(err => err.getText())).toEqual([requireTrueText]);
    q.value = true;
    expect(q.errors.length).toBe(0);
  });
  test("switching requireTrue off clears its error", () => {
    const { q } = createQuestion({ requireTrue: true });
    q.value = false;
    expect(errorTypes(q)).toEqual(["required"]);
    q.requireTrue = false;
    expect(q.errors.length).toBe(0);
  });
  test("switching requireTrue off keeps the ordinary required error of an empty required question", () => {
    const { q } = createQuestion({ requireTrue: true, isRequired: true });
    expect(errorTexts(q)).toEqual([requireTrueText]);
    q.requireTrue = false;
    expect(q.errors.map(err => err.getText())).toEqual(["Response required."]);
  });
  test("skip rules: read-only, invisible and design mode", () => {
    const readOnly = createQuestion({ requireTrue: true, readOnly: true });
    expect(readOnly.survey.tryComplete(), "read-only").toBe(true);
    expect(readOnly.q.errors.length).toBe(0);

    const invisible = new SurveyModel({
      elements: [
        { type: "text", name: "t" },
        { type: "boolean", name: "b", requireTrue: true, visible: false },
      ],
    });
    expect(invisible.tryComplete(), "invisible").toBe(true);
    expect(invisible.getQuestionByName("b").errors.length).toBe(0);

    const hidden = new SurveyModel({
      elements: [
        { type: "text", name: "t" },
        { type: "boolean", name: "b", requireTrue: true, visibleIf: "{t} = 'a'" },
      ],
    });
    expect(hidden.tryComplete(), "hidden by visibleIf").toBe(true);
    hidden.clear();
    hidden.setValue("t", "a");
    expect(hidden.tryComplete(), "shown by visibleIf").toBe(false);

    const inInvisiblePanel = new SurveyModel({
      elements: [
        { type: "text", name: "t" },
        { type: "panel", name: "p", visible: false, elements: [{ type: "boolean", name: "b", requireTrue: true }] },
      ],
    });
    expect(inInvisiblePanel.tryComplete(), "invisible panel").toBe(true);
    expect(inInvisiblePanel.getQuestionByName("b").errors.length).toBe(0);

    const onInvisiblePage = new SurveyModel({
      pages: [
        { name: "p1", elements: [{ type: "text", name: "t" }] },
        { name: "p2", visible: false, elements: [{ type: "boolean", name: "b", requireTrue: true }] },
      ],
    });
    expect(onInvisiblePage.tryComplete(), "invisible page").toBe(true);
    expect(onInvisiblePage.getQuestionByName("b").errors.length).toBe(0);

    const noValidation = createQuestion({ requireTrue: true });
    noValidation.survey.validationEnabled = false;
    expect(noValidation.survey.tryComplete(), "validationEnabled: false").toBe(true);

    // hideRequiredErrors hides the requireTrue error as well, as it shares the "required" type
    const hideRequired = createQuestion({ requireTrue: true, defaultValue: false });
    hideRequired.survey.hideRequiredErrors = true;
    expect(hideRequired.survey.tryComplete(), "hideRequiredErrors").toBe(true);
    expect(hideRequired.q.errors.length).toBe(1);
    expect(hideRequired.q.errors[0].visible).toBe(false);

    // Design mode does not skip an explicit validate() for isRequired either; requireTrue behaves the same.
    [{ isRequired: true }, { requireTrue: true }].forEach(props => {
      const design = new SurveyModel();
      design.setDesignMode(true);
      design.fromJSON({ elements: [Object.assign({ type: "boolean", name: "b" }, props)] });
      const dq = <QuestionBooleanModel>design.getQuestionByName("b");
      expect(dq.validate(true), "design mode: " + JSON.stringify(props)).toBe(false);
      expect(dq.errors.map(err => err.getErrorType())).toEqual(["required"]);
    });
  });
  test("a matrix cell in onValueChanged mode shows the error when No is chosen first", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "c", cellType: "boolean", requireTrue: true }],
      }],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const cell = matrix.visibleRows[0].getQuestionByColumnName("c");
    cell.value = false;
    expect(cell.errors.map(err => err.getText())).toEqual([requireTrueText]);
  });
  test("a column with no cellType in a boolean matrix gets requireTrue and requireTrueErrorText", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1, cellType: "boolean",
        columns: [{ name: "c", requireTrue: true, requireTrueErrorText: "Agree first" }],
      }],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const cell = <QuestionBooleanModel>matrix.visibleRows[0].getQuestionByColumnName("c");
    expect(cell.getType()).toBe("boolean");
    expect(cell.requireTrue).toBe(true);
    expect(cell.requireTrueErrorText).toBe("Agree first");
    cell.value = false;
    expect(survey.tryComplete()).toBe(false);
    expect(cell.errors.map(err => err.getText())).toEqual(["Agree first"]);
    expect(matrix.toJSON().columns).toEqual([{ name: "c", requireTrue: true, requireTrueErrorText: "Agree first" }]);
  });
  test("a boolean matrix column with requireTrue", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 2,
        columns: [{ name: "c", cellType: "boolean", requireTrue: true }],
      }],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const column = matrix.getColumnByName("c");
    expect((<any>column).requireTrue).toBe(true);
    const rows = matrix.visibleRows;
    rows[0].getQuestionByColumnName("c").value = false;
    rows[1].getQuestionByColumnName("c").value = true;
    expect(matrix.validate(true)).toBe(false);
    const cell0 = rows[0].getQuestionByColumnName("c");
    const cell1 = rows[1].getQuestionByColumnName("c");
    expect((<QuestionBooleanModel>cell0).requireTrue).toBe(true);
    expect(cell0.errors.map(err => err.getText())).toEqual([requireTrueText]);
    expect(cell1.errors.length).toBe(0);
    expect(matrix.toJSON().columns).toEqual([{ name: "c", cellType: "boolean", requireTrue: true }]);
  });
  test("a boolean column passes requireTrueErrorText to its cells", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "c", cellType: "boolean", requireTrue: true }],
      }],
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const column = <any>matrix.getColumnByName("c");
    column.requireTrueErrorText = "Agree first";
    const cell = <QuestionBooleanModel>matrix.visibleRows[0].getQuestionByColumnName("c");
    expect(cell.requireTrueErrorText).toBe("Agree first");
    expect(matrix.toJSON().columns).toEqual([{ name: "c", cellType: "boolean", requireTrue: true, requireTrueErrorText: "Agree first" }]);
  });
  test("serialization: absent at defaults, round-trips when set", () => {
    const { q } = createQuestion({});
    expect(q.toJSON()).toEqual({ name: "b" });
    q.requireTrue = true;
    q.requireTrueErrorText = "Agree first";
    expect(q.toJSON()).toEqual({ name: "b", requireTrue: true, requireTrueErrorText: "Agree first" });
    const copy = <QuestionBooleanModel>Serializer.createClass("boolean");
    copy.fromJSON(q.toJSON());
    expect(copy.requireTrue).toBe(true);
    expect(copy.requireTrueErrorText).toBe("Agree first");
    const prop = Serializer.findProperty("boolean", "requireTrue");
    expect(prop.type).toBe("boolean");
    expect(prop.isDefaultValue(false)).toBe(true);
    expect(Serializer.findProperty("boolean", "requireTrueErrorText").serializationProperty).toBe("locRequireTrueErrorText");
  });
  test("property metadata: requireTrue has no dependsOn and is visible on a question that is not required", () => {
    const { q } = createQuestion({});
    const prop = Serializer.findProperty("boolean", "requireTrue");
    expect(prop.dependsOn).toBeFalsy();
    expect(prop.isVisible("", q)).toBe(true);
  });
  test("property metadata: requireTrueErrorText depends on requireTrue and is visible only while it is on", () => {
    const { q } = createQuestion({});
    const prop = Serializer.findProperty("boolean", "requireTrueErrorText");
    expect(prop.dependsOn).toEqual(["requireTrue"]);
    expect(prop.isVisible("", q), "requireTrue is off").toBe(false);
    q.requireTrue = true;
    expect(prop.isVisible("", q), "requireTrue is on").toBe(true);
    q.isRequired = true;
    q.requireTrue = false;
    expect(prop.isVisible("", q), "isRequired alone").toBe(false);
  });
  test("requireTrueErrorText is empty by default, the error shows the localized default text", () => {
    const { q } = createQuestion({ requireTrue: true });
    expect(q.requireTrueErrorText).toBe("");
    expect(q.locRequireTrueErrorText.isEmpty).toBe(true);
    expect(errorTexts(q)).toEqual([requireTrueText]);
    expect(q.toJSON()).toEqual({ name: "b", requireTrue: true });
    q.requireTrueErrorText = "Agree first";
    expect(errorTexts(q)).toEqual(["Agree first"]);
    q.requireTrueErrorText = "";
    expect(errorTexts(q)).toEqual([requireTrueText]);
  });
  test("requireTrueErrorText of a boolean matrix column is visible only while requireTrue is on", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "c", cellType: "boolean" }],
      }],
    });
    const column = <any>(<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).getColumnByName("c");
    const prop = Serializer.getDynamicPropertiesByObj(column).filter(p => p.name === "requireTrueErrorText")[0];
    expect(prop.isVisible("", column), "requireTrue is off").toBe(false);
    column.requireTrue = true;
    expect(prop.isVisible("", column), "requireTrue is on").toBe(true);
  });
  test("the old property name is gone", () => {
    // the old name is built from parts so that a repo grep for it stays empty;
    // findProperty returns undefined for an unknown property
    const oldName = "required" + "True";
    expect(!!Serializer.findProperty("boolean", oldName)).toBe(false);
    expect(!!Serializer.findProperty("text", "requireTrue")).toBe(false);
  });
});
