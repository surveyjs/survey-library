import { Serializer } from "../src/jsonobject";
import { SurveyModel } from "../src/survey";
import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { QuestionMatrixModel } from "../src/question_matrix";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionBooleanModel } from "../src/question_boolean";
import { Question } from "../src/question";
import { IAction } from "../src/actions/action";
import { defaultCss } from "../src/defaultCss/defaultCss";

import { describe, test, expect } from "vitest";

// allowClear for Image Picker and Single-Select Matrix, plus the "Clear" title action that
// Radio Button Group, Yes/No, Image Picker and Single-Select Matrix now share (#11936).
describe("allowClear, Bug#11936", () => {
  const imagePickerJson = (props: any = {}): any => ({
    elements: [{ type: "imagepicker", name: "q1", choices: ["lion", "giraffe", "panda"], ...props }]
  });
  const matrixJson = (props: any = {}): any => ({
    elements: [{ type: "matrix", name: "q1", rows: ["row1", "row2"], columns: ["col1", "col2"], ...props }]
  });
  const getClearAction = (q: Question): IAction => <IAction>q.getTitleActions()[0];

  describe("Image Picker", () => {
    test("serialization", () => {
      const survey = new SurveyModel({
        elements: [
          { type: "imagepicker", name: "q1", allowClear: true },
          { type: "imagepicker", name: "q2" }
        ]
      });
      const q1 = <QuestionImagePickerModel>survey.getQuestionByName("q1");
      const q2 = <QuestionImagePickerModel>survey.getQuestionByName("q2");
      expect(q1.allowClear, "allowClear is loaded from JSON").toBe(true);
      expect(q2.allowClear, "allowClear is false by default").toBe(false);
      expect(q1.toJSON().allowClear, "allowClear is serialized").toBe(true);
      expect(q2.toJSON().allowClear, "the default value is not serialized").toBeUndefined();
      expect(q1.getConditionJson().allowClear, "allowClear is removed from the condition JSON").toBeUndefined();
    });
    test("the Clear title action clears a single selection", () => {
      const survey = new SurveyModel(imagePickerJson({ allowClear: true }));
      survey.css = defaultCss;
      const q1 = <QuestionImagePickerModel>survey.getQuestionByName("q1");
      const action = getClearAction(q1);
      expect(action.title, "the action uses the clearCaption string").toBe("Clear");
      expect(action.visible, "the action is visible").toBe(true);

      q1.value = "giraffe";
      expect(survey.data, "the value is set").toEqual({ q1: "giraffe" });
      action.action();
      expect(q1.isEmpty(), "the value is cleared").toBe(true);
      expect(survey.data, "the value is removed from survey data").toEqual({});

      q1.allowClear = false;
      expect(q1.getTitleActions().length, "the action is removed when allowClear is disabled").toBe(0);
    });
    test("the Clear title action clears every image when multiSelect is enabled", () => {
      const survey = new SurveyModel(imagePickerJson({ allowClear: true, multiSelect: true }));
      const q1 = <QuestionImagePickerModel>survey.getQuestionByName("q1");
      q1.value = ["lion", "panda"];
      expect(survey.data, "two images are selected").toEqual({ q1: ["lion", "panda"] });
      getClearAction(q1).action();
      expect(q1.isEmpty(), "all images are cleared").toBe(true);
      expect(survey.data, "the value is removed from survey data").toEqual({});
    });
    test("the Clear title action is hidden in read-only mode and absent in design mode", () => {
      const survey = new SurveyModel(imagePickerJson({ allowClear: true }));
      const q1 = <QuestionImagePickerModel>survey.getQuestionByName("q1");
      const action = getClearAction(q1);
      survey.readOnly = true;
      expect(action.visible, "hidden in survey read-only mode").toBe(false);
      survey.readOnly = false;
      q1.readOnly = true;
      expect(action.visible, "hidden for a read-only question").toBe(false);
      q1.readOnly = false;
      expect(action.visible, "visible again").toBe(true);

      const designSurvey = new SurveyModel();
      designSurvey.setDesignMode(true);
      designSurvey.fromJSON(imagePickerJson({ allowClear: true }));
      expect(designSurvey.getQuestionByName("q1").getTitleActions().length, "no title actions in design mode").toBe(0);
    });
  });

  describe("Single-Select Matrix", () => {
    test("serialization", () => {
      const survey = new SurveyModel(matrixJson({ allowClear: true }));
      const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
      expect(q1.allowClear, "allowClear is loaded from JSON").toBe(true);
      expect(q1.toJSON().allowClear, "allowClear is serialized").toBe(true);
      expect(q1.getConditionJson().allowClear, "allowClear is removed from the condition JSON").toBeUndefined();
      expect(q1.getConditionJson("equal", "row1").type, "a row condition still returns a dropdown").toBe("dropdown");

      const q2 = <QuestionMatrixModel>new SurveyModel(matrixJson()).getQuestionByName("q1");
      expect(q2.allowClear, "allowClear is false by default").toBe(false);
      expect(q2.toJSON().allowClear, "the default value is not serialized").toBeUndefined();
    });
    test("the Clear title action clears every row", () => {
      const survey = new SurveyModel(matrixJson({ allowClear: true }));
      survey.css = defaultCss;
      const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
      const action = getClearAction(q1);
      expect(action.title, "the action uses the clearCaption string").toBe("Clear");
      expect(action.visible, "the action is visible").toBe(true);

      q1.value = { row1: "col1", row2: "col2" };
      expect(survey.data, "both rows are answered").toEqual({ q1: { row1: "col1", row2: "col2" } });
      action.action();
      expect(q1.isEmpty(), "the value is cleared").toBe(true);
      expect(survey.data, "the value is removed from survey data").toEqual({});
      q1.visibleRows.forEach((row) => {
        expect(row.value, `row ${row.name} has no value`).toBeFalsy();
        q1.visibleColumns.forEach((column) => {
          expect(row.isChecked(column), `row ${row.name}, column ${column.value} is unchecked in the UI`).toBe(false);
        });
      });

      q1.allowClear = false;
      expect(q1.getTitleActions().length, "the action is removed when allowClear is disabled").toBe(0);
    });
    test("the Clear title action clears a checkbox-cell matrix", () => {
      const survey = new SurveyModel(matrixJson({ allowClear: true, cellType: "checkbox" }));
      const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
      q1.value = { row1: ["col1", "col2"] };
      getClearAction(q1).action();
      expect(q1.isEmpty(), "the value is cleared").toBe(true);
      expect(survey.data, "the value is removed from survey data").toEqual({});
    });
    test("the Clear title action is hidden in read-only mode and absent in design mode", () => {
      const survey = new SurveyModel(matrixJson({ allowClear: true }));
      const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
      const action = getClearAction(q1);
      survey.readOnly = true;
      expect(action.visible, "hidden in survey read-only mode").toBe(false);
      survey.readOnly = false;
      expect(action.visible, "visible again").toBe(true);

      const designSurvey = new SurveyModel();
      designSurvey.setDesignMode(true);
      designSurvey.fromJSON(matrixJson({ allowClear: true }));
      expect(designSurvey.getQuestionByName("q1").getTitleActions().length, "no title actions in design mode").toBe(0);
    });
  });

  test("the Clear action exists only while allowClear is on, so other questions keep their title markup", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "bool" },
        { type: "imagepicker", name: "image", choices: ["a"] },
        { type: "matrix", name: "matrix", rows: ["r"], columns: ["c"] },
        { type: "text", name: "text" },
        { type: "checkbox", name: "check", choices: ["a"] },
        { type: "rating", name: "rating" }
      ]
    });
    survey.getAllQuestions().forEach((q: any) => {
      const toolbar = q.getTitleToolbar();
      expect(q.hasTitleActions, `${q.getType()}: no title actions before allowClear`).toBe(false);
      expect(toolbar.actions.length, `${q.getType()}: the toolbar is empty before allowClear`).toBe(0);

      q.allowClear = true;
      expect(q.hasTitleActions, `${q.getType()}: has title actions after allowClear`).toBe(true);
      expect(toolbar.actions.length, `${q.getType()}: the toolbar gets the action`).toBe(1);
      expect(toolbar.actions[0].visible, `${q.getType()}: visible after allowClear`).toBe(true);

      q.allowClear = false;
      expect(q.hasTitleActions, `${q.getType()}: no title actions again`).toBe(false);
      expect(toolbar.actions.length, `${q.getType()}: the toolbar is empty again`).toBe(0);
    });
  });
  test("Radio Button Group and Slider keep the always-present Clear action", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "radiogroup", name: "radio", choices: ["a"] },
        { type: "slider", name: "slider" }
      ]
    });
    survey.getAllQuestions().forEach((q: any) => {
      expect(q.getTitleActions().length, `${q.getType()}: the action exists`).toBe(1);
      expect(getClearAction(q).visible, `${q.getType()}: hidden while allowClear is off`).toBe(false);
      q.allowClear = true;
      expect(q.getTitleActions().length, `${q.getType()}: the same action stays`).toBe(1);
      expect(getClearAction(q).visible, `${q.getType()}: visible after allowClear`).toBe(true);
    });
  });
  test("Yes/No in the checkbox mode does not add a title Clear action", () => {
    const survey = new SurveyModel({
      elements: [{ type: "boolean", name: "q1", renderAs: "checkbox", allowClear: true }]
    });
    expect(survey.getQuestionByName("q1").getTitleActions().length).toBe(0);
  });
  test("Rating rendered as a dropdown keeps its input clear button", () => {
    const survey = new SurveyModel({
      elements: [{ type: "rating", name: "q1", displayMode: "dropdown" }]
    });
    const q1 = <any>survey.getQuestionByName("q1");
    expect(q1.allowClear, "allowClear is false by default").toBe(false);
    q1.value = 3;
    const clearButton = q1.dropdownListModel.editorButtons.getActionById("clear");
    expect(clearButton.visible, "the input clear button is visible").toBe(true);
    expect(q1.getTitleActions().length, "no title Clear action").toBe(0);
  });
  test("questions that already clear a value, or have no value, do not add a title button", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "drop", choices: ["a"], allowClear: true },
        { type: "tagbox", name: "tags", choices: ["a"], allowClear: true },
        { type: "file", name: "file" },
        { type: "html", name: "html", html: "<p>x</p>" },
        { type: "image", name: "image", imageLink: "https://surveyjs.io/favicon.ico" },
        { type: "signaturepad", name: "sign" },
        { type: "expression", name: "expr", expression: "1 + 1", allowClear: true },
        { type: "matrixdynamic", name: "md", columns: [{ name: "col" }], allowClear: true },
        { type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "t" }], allowClear: true }
      ]
    });
    survey.getAllQuestions().forEach((q) => {
      expect(q.getTitleActions().length, `${q.getType()}: no title Clear action`).toBe(0);
    });
    expect(Serializer.findProperty("file", "allowClear").visible, "file hides allowClear").toBe(false);
    expect(Serializer.findProperty("html", "allowClear").visible, "html hides allowClear").toBe(false);
    expect(Serializer.findProperty("image", "allowClear").visible, "image hides allowClear").toBe(false);
    expect(Serializer.findProperty("expression", "allowClear").visible, "expression hides allowClear").toBe(false);
    expect(Serializer.findProperty("matrixdynamic", "allowClear").visible, "matrixdynamic hides allowClear").toBe(false);
    expect(Serializer.findProperty("paneldynamic", "allowClear").visible, "paneldynamic hides allowClear").toBe(false);
  });
  test("allowClear stays available for value questions", () => {
    const types = ["checkbox", "radiogroup", "dropdown", "tagbox", "ranking", "imagepicker", "matrixdropdown", "text", "comment", "boolean", "rating", "slider", "multipletext", "matrix", "signaturepad"];
    types.forEach((type) => {
      const prop = Serializer.findProperty(type, "allowClear");
      expect(prop, type).toBeTruthy();
      expect(prop.visible, `${type} visible`).not.toBe(false);
      expect(prop.isSerializable, `${type} serializable`).not.toBe(false);
    });
  });
  test("every question type builds the same Clear action", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "radiogroup", name: "radio", choices: ["a"], allowClear: true },
        { type: "boolean", name: "bool", allowClear: true },
        { type: "imagepicker", name: "image", choices: ["a"], allowClear: true },
        { type: "matrix", name: "matrix", rows: ["r"], columns: ["c"], allowClear: true }
      ]
    });
    survey.css = defaultCss;
    const questions = [
      <QuestionRadiogroupModel>survey.getQuestionByName("radio"),
      <QuestionBooleanModel>survey.getQuestionByName("bool"),
      <QuestionImagePickerModel>survey.getQuestionByName("image"),
      <QuestionMatrixModel>survey.getQuestionByName("matrix")
    ];
    questions.forEach((q) => {
      const actions = q.getTitleActions();
      expect(actions.length, `${q.getType()}: one title action`).toBe(1);
      const action = <IAction>actions[0];
      expect(action.id, `${q.getType()}: action id`).toBe(`sv-clr-btn-${q.id}`);
      expect(action.title, `${q.getType()}: action title`).toBe("Clear");
      expect(action.ariaLabelledBy, `${q.getType()}: aria-labelledby`).toBe(q.a11y_input_ariaLabelledBy);
      expect(action.visible, `${q.getType()}: visible`).toBe(true);
    });
  });
});
