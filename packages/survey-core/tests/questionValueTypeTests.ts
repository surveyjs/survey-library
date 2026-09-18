import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { ItemValue } from "../src/itemvalue";
import { QuestionSelectBase } from "../src/question_baseselect";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionBooleanModel } from "../src/question_boolean";
import { QuestionRatingModel } from "../src/question_rating";
import { ComponentCollection } from "../src/question_custom";
// The question types the tests create register themselves on import.
import "../src/question_text";
import "../src/question_comment";
import "../src/question_expression";
import "../src/question_html";
import "../src/question_image";
import "../src/question_radiogroup";
import "../src/question_dropdown";
import "../src/question_tagbox";
import "../src/question_ranking";
import "../src/question_file";
import "../src/question_signaturepad";
import "../src/question_imagepicker";
import "../src/question_imagemap";
import "../src/question_slider";
import "../src/question_matrix";
import "../src/question_matrixdropdown";
import "../src/question_matrixdynamic";
import "../src/question_paneldynamic";
import "../src/question_multipletext";

import { describe, test, expect } from "vitest";

describe("Question.getValueType()", () => {
  function createSurvey(elements: Array<any>): SurveyModel {
    return new SurveyModel({ elements: elements });
  }
  function valueTypes(survey: SurveyModel, names: Array<string>): Array<string> {
    return names.map(name => survey.getQuestionByName(name).getValueType());
  }
  test("A text question answers by its inputType", () => {
    const survey = createSurvey([
      { type: "text", name: "t1" },
      { type: "text", name: "t2", inputType: "number" },
      { type: "text", name: "t3", inputType: "range" },
      { type: "text", name: "t4", inputType: "date" },
      { type: "text", name: "t5", inputType: "week" },
      { type: "text", name: "t6", inputType: "email" },
    ]);
    expect(valueTypes(survey, ["t1", "t2", "t3", "t4", "t5", "t6"]),
      "number and range are numbers, the other minMax types are dates").toEqual(
      ["string", "number", "number", "date", "date", "string"]);
  });
  test("A slider is a number, a range slider is an array", () => {
    const survey = createSurvey([
      { type: "slider", name: "sl1" },
      { type: "slider", name: "sl2", sliderType: "range" },
    ]);
    expect(valueTypes(survey, ["sl1", "sl2"])).toEqual(["number", "array"]);
  });
  test("An image picker and an image map are arrays only when multiSelect", () => {
    const survey = createSurvey([
      { type: "imagepicker", name: "ip1", choices: [{ value: "a", imageLink: "a.png" }] },
      { type: "imagepicker", name: "ip2", multiSelect: true, choices: [{ value: "a", imageLink: "a.png" }] },
      { type: "imagemap", name: "im1", multiSelect: false },
      { type: "imagemap", name: "im2" },
    ]);
    expect(valueTypes(survey, ["ip1", "ip2", "im1", "im2"]),
      "an image map selects many regions by default, an image picker a single image").toEqual(
      ["string", "array", "string", "array"]);
  });
  test("A rating is a number until rateValues say otherwise", () => {
    const survey = createSurvey([
      { type: "rating", name: "ra1", rateMin: 1, rateMax: 3 },
      { type: "rating", name: "ra2", rateValues: [{ value: "low", text: "Low" }, "high"] },
      { type: "rating", name: "ra3", rateValues: [1, 2] },
    ]);
    expect(valueTypes(survey, ["ra1", "ra2", "ra3"])).toEqual(["number", "string", "number"]);
  });
  test("A boolean follows the type of its valueTrue", () => {
    const survey = createSurvey([
      { type: "boolean", name: "b1" },
      { type: "boolean", name: "b2", valueTrue: "yes", valueFalse: "no" },
      { type: "boolean", name: "b3", valueTrue: 1, valueFalse: 0 },
    ]);
    expect(valueTypes(survey, ["b1", "b2", "b3"])).toEqual(["boolean", "string", "number"]);
  });
  test("A select question follows the type of its first authored choice", () => {
    const survey = createSurvey([
      { type: "radiogroup", name: "r1", choices: ["a", "b"] },
      { type: "radiogroup", name: "r2", choices: [1, 2] },
      { type: "dropdown", name: "d1", choices: [{ value: true, text: "Yes" }, { value: false, text: "No" }] },
      { type: "dropdown", name: "d2" },
      { type: "radiogroup", name: "r3", choices: [], showNoneItem: true, showOtherItem: true },
    ]);
    expect(valueTypes(survey, ["r1", "r2", "d1", "d2", "r3"]),
      "with no authored choice the base answer stands").toEqual(
      ["string", "number", "boolean", "string", "string"]);
  });
  test("The questions that store a list of values are arrays", () => {
    const survey = createSurvey([
      { type: "checkbox", name: "ch1", choices: [1, 2] },
      { type: "tagbox", name: "tg1", choices: [1, 2] },
      { type: "ranking", name: "rk1", choices: [1, 2] },
      { type: "file", name: "f1" },
      { type: "matrixdynamic", name: "m3", columns: [{ name: "c" }] },
      { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "q" }] },
    ]);
    expect(valueTypes(survey, ["ch1", "tg1", "rk1", "f1", "m3", "p1"]),
      "the item type does not change the value type").toEqual(
      ["array", "array", "array", "array", "array", "array"]);
  });
  test("The questions that store a value per row or per item are objects", () => {
    const survey = createSurvey([
      { type: "matrix", name: "m1", rows: ["r"], columns: ["c"] },
      { type: "matrixdropdown", name: "m2", rows: ["r"], columns: [{ name: "c" }] },
      { type: "multipletext", name: "mt1", items: [{ name: "i1" }] },
    ]);
    expect(valueTypes(survey, ["m1", "m2", "mt1"])).toEqual(["object", "object", "object"]);
  });
  test("A signature, an expression, a comment and a non-value question keep the base string", () => {
    const survey = createSurvey([
      { type: "signaturepad", name: "s1" },
      { type: "expression", name: "e1", expression: "1 + 1" },
      { type: "comment", name: "c1" },
      { type: "html", name: "h1" },
      { type: "image", name: "i1" },
    ]);
    expect(valueTypes(survey, ["s1", "e1", "c1", "h1", "i1"])).toEqual(
      ["string", "string", "string", "string", "string"]);
  });
});

describe("Question.isSelectQuestion() and Question.hasPlainInput", () => {
  function createSurvey(): SurveyModel {
    return new SurveyModel({
      elements: [
        { type: "radiogroup", name: "r1", choices: ["a"] },
        { type: "boolean", name: "b1" },
        { type: "rating", name: "ra1" },
        { type: "text", name: "t1" },
        { type: "matrix", name: "m1", rows: ["r"], columns: ["c"] },
        { type: "file", name: "f1" },
        { type: "signaturepad", name: "s1" },
        { type: "imagepicker", name: "ip1", choices: [{ value: "a", imageLink: "a.png" }] },
        { type: "imagemap", name: "im1" },
        { type: "html", name: "h1" },
      ],
    });
  }
  test("Only the questions that offer items to pick from are select questions", () => {
    const survey = createSurvey();
    const isSelect = (name: string) => survey.getQuestionByName(name).isSelectQuestion();
    expect(["r1", "b1", "ra1"].map(isSelect), "the pick-one questions say so themselves").toEqual([true, true, true]);
    expect(["t1", "m1", "f1"].map(isSelect), "the others do not").toEqual([false, false, false]);
  });
  test("A value only the question's own UI can produce is not a plain input", () => {
    const survey = createSurvey();
    const hasPlainInput = (name: string) => survey.getQuestionByName(name).hasPlainInput;
    expect(["r1", "b1", "t1", "m1"].map(hasPlainInput)).toEqual([true, true, true, true]);
    expect(["f1", "s1", "ip1", "im1", "h1"].map(hasPlainInput),
      "a file, a signature, an image to click, and a question with no input at all").toEqual(
      [false, false, false, false, false]);
  });
});

describe("ISelectQuestion", () => {
  test("getValueChoices leaves out the Select All item and keeps None and Other", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox", name: "q1", showSelectAllItem: true, showNoneItem: true, showOtherItem: true,
          choices: ["a", { value: "b", isExclusive: true }],
        },
      ],
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.visibleChoices.length, "the model renders the Select All item").toBe(5);
    const items = q.getValueChoices();
    expect(items.map(item => item.value), "Select All is a gesture, not a value").toEqual(["a", "b", "none", "other"]);
    expect(items.map(item => q.isNoneItem(item)), "isExclusive is what clears the rest").toEqual([false, true, true, false]);
    expect(items.map(item => q.isOtherItem(item))).toEqual([false, false, false, true]);
    expect(q.isSelectAllItem(q.selectAllItem), "the question knows its own Select All item").toBe(true);
    expect(q.isSelectAllItem(items[0])).toBe(false);
  });
  test("Refuse to answer and Don't know clear the rest as None does", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "radiogroup", name: "q1", choices: ["a"], showRefuseItem: true, showDontKnowItem: true },
      ],
    });
    const q = <QuestionSelectBase>survey.getQuestionByName("q1");
    const items = q.getValueChoices();
    expect(items.map(item => item.value)).toEqual(["a", "refused", "dontknow"]);
    expect(items.map(item => q.isNoneItem(item))).toEqual([false, true, true]);
  });
  test("A select question that is not a Checkboxes one has no Select All item", () => {
    const survey = new SurveyModel({
      elements: [{ type: "radiogroup", name: "q1", choices: ["a"] }],
    });
    const q = <QuestionSelectBase>survey.getQuestionByName("q1");
    expect(q.isSelectAllItem(q.getValueChoices()[0])).toBe(false);
  });
  test("A boolean returns its two items in the rendered order", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "q1" },
        { type: "boolean", name: "q2", valueTrue: "yes", valueFalse: "no", labelTrue: "Sure", labelFalse: "Nope" },
        { type: "boolean", name: "q3", swapOrder: true },
      ],
    });
    const asPairs = (q: QuestionBooleanModel) => q.getValueChoices().map(item => [item.value, item.text]);
    expect(asPairs(<QuestionBooleanModel>survey.getQuestionByName("q1")), "the left label first").toEqual(
      [[false, "No"], [true, "Yes"]]);
    expect(asPairs(<QuestionBooleanModel>survey.getQuestionByName("q2")), "labelTrue and labelFalse are the texts").toEqual(
      [["no", "Nope"], ["yes", "Sure"]]);
    expect(asPairs(<QuestionBooleanModel>survey.getQuestionByName("q3")), "swapOrder renders the true item first").toEqual(
      [[true, "Yes"], [false, "No"]]);
  });
  test("A boolean and a rating have no built-in items", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "q1" },
        { type: "rating", name: "q2", rateMin: 1, rateMax: 3 },
      ],
    });
    const q1 = <QuestionBooleanModel>survey.getQuestionByName("q1");
    const q2 = <QuestionRatingModel>survey.getQuestionByName("q2");
    const isBuiltIn = (q: any, item: ItemValue) => q.isNoneItem(item) || q.isOtherItem(item);
    expect(q1.getValueChoices().map(item => isBuiltIn(q1, item))).toEqual([false, false]);
    expect(q2.getValueChoices().map(item => isBuiltIn(q2, item))).toEqual([false, false, false]);
  });
  test("A rating returns its visible rate values", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "rating", name: "q1", rateMin: 1, rateMax: 3 },
        { type: "rating", name: "q2", rateValues: [{ value: "low", text: "Low" }, "high"] },
      ],
    });
    const q1 = <QuestionRatingModel>survey.getQuestionByName("q1");
    const q2 = <QuestionRatingModel>survey.getQuestionByName("q2");
    expect(q1.getValueChoices()).toBe(q1.visibleRateValues);
    expect(q1.getValueChoices().map(item => item.value)).toEqual([1, 2, 3]);
    expect(q2.getValueChoices().map(item => [item.value, item.text])).toEqual([["low", "Low"], ["high", "high"]]);
  });
});

describe("Question.hasUnknownChoices", () => {
  test("The choices that are loaded on demand cannot be listed", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "q1", choicesLazyLoadEnabled: true },
        { type: "dropdown", name: "q2", choices: ["a"] },
      ],
    });
    expect((<QuestionSelectBase>survey.getQuestionByName("q1")).hasUnknownChoices).toBe(true);
    expect((<QuestionSelectBase>survey.getQuestionByName("q2")).hasUnknownChoices).toBe(false);
  });
  test("choicesByUrl is unknown until the request answers", () => {
    let respond: (response: any) => void = undefined;
    const survey = new SurveyModel();
    survey.webProvider = {
      sendRequest: (request: any, onResponse: any): void => { respond = onResponse; },
    };
    survey.fromJSON({
      elements: [{
        type: "dropdown", name: "country",
        choicesByUrl: { url: "https://api.example.com/countries", valueName: "id" },
      }],
    });
    const q = <QuestionSelectBase>survey.getQuestionByName("country");
    expect(q.hasUnknownChoices, "the request is still pending").toBe(true);
    respond({ status: 200, response: [{ id: "de" }, { id: "fr" }] });
    expect(q.hasUnknownChoices, "the choices are here now").toBe(false);
    expect(q.getValueChoices().map(item => item.value)).toEqual(["de", "fr"]);
  });
  test("A boolean and a rating always know their items", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "boolean", name: "q1" },
        { type: "rating", name: "q2" },
      ],
    });
    expect((<QuestionBooleanModel>survey.getQuestionByName("q1")).hasUnknownChoices).toBe(false);
    expect((<QuestionRatingModel>survey.getQuestionByName("q2")).hasUnknownChoices).toBe(false);
  });
});

describe("A custom component answers through its content question", () => {
  test("A single component delegates every member to the question it wraps", () => {
    ComponentCollection.Instance.add({
      name: "grade",
      questionJSON: { type: "dropdown", choices: [1, 2, 3], showOtherItem: true, showNoneItem: true },
    });
    try {
      const survey = new SurveyModel({
        elements: [{ type: "grade", name: "q1" }],
      });
      const q = <any>survey.getQuestionByName("q1");
      expect(q.getValueType(), "the content question has number choices").toBe("number");
      expect(q.hasPlainInput).toBe(true);
      expect(q.isSelectQuestion()).toBe(true);
      const items = q.getValueChoices();
      expect(items.map((item: ItemValue) => item.value)).toEqual([1, 2, 3, "none", "other"]);
      expect(items.map((item: ItemValue) => q.isNoneItem(item))).toEqual([false, false, false, true, false]);
      expect(items.map((item: ItemValue) => q.isOtherItem(item))).toEqual([false, false, false, false, true]);
      expect(q.hasUnknownChoices).toBe(false);
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
  test("A single component over a question with no plain input has none either", () => {
    ComponentCollection.Instance.add({
      name: "photo",
      questionJSON: { type: "file" },
    });
    try {
      const survey = new SurveyModel({
        elements: [{ type: "photo", name: "q1" }],
      });
      const q = <Question>survey.getQuestionByName("q1");
      expect(q.getValueType()).toBe("array");
      expect(q.hasPlainInput).toBe(false);
      expect(q.isSelectQuestion()).toBe(false);
      expect((<any>q).getValueChoices()).toBeUndefined();
      expect((<any>q).hasUnknownChoices).toBe(false);
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
  test("A composite component is an object and is not a select question", () => {
    ComponentCollection.Instance.add({
      name: "fullname",
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "dropdown", name: "title", choices: ["Mr", "Ms"] },
      ],
    });
    try {
      const survey = new SurveyModel({
        elements: [{ type: "fullname", name: "q1" }],
      });
      const q = <Question>survey.getQuestionByName("q1");
      expect(q.getValueType()).toBe("object");
      expect(q.isSelectQuestion()).toBe(false);
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
});
