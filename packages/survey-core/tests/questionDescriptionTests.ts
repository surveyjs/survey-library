import { SurveyModel } from "../src/survey";
import { QuestionTextModel } from "../src/question_text";
import { ComponentCollection } from "../src/question_custom";
import { settings } from "../src/settings";
import { describeQuestion, IQuestionDescription } from "../src/question-description";
import { getValueTypeInfo } from "../src/linter/value-types";
import "../src/localization/german";

import { describe, test, expect } from "vitest";

describe("question description (issue #11818)", () => {
  function describeByName(survey: SurveyModel, name: string, options?: any): IQuestionDescription {
    return describeQuestion(survey.getQuestionByName(name), options);
  }
  function createSurvey(json: any): SurveyModel {
    return new SurveyModel(json);
  }

  test("The issue's pet survey: nothing but what the consumer needs", () => {
    const survey = createSurvey({
      showQuestionNumbers: "on",
      elements: [
        { type: "radiogroup", name: "hasPet", title: "Do you have a pet?", isRequired: true, choices: ["Yes", "No"] },
      ],
    });
    expect(describeByName(survey, "hasPet")).toEqual({
      name: "hasPet",
      type: "radiogroup",
      title: "Do you have a pet?",
      required: true,
      valueType: "string",
      choices: [{ value: "Yes" }, { value: "No" }],
    });
  });
  test("The title carries neither the number nor the required mark, and piping is resolved", () => {
    const survey = createSurvey({
      showQuestionNumbers: "on",
      elements: [
        { type: "text", name: "name", title: "Your name" },
        { type: "text", name: "greeting", title: "How are you, {name}?", isRequired: true },
      ],
    });
    survey.setValue("name", "Ann");
    const q = survey.getQuestionByName("greeting");
    expect(q.no, "the question is numbered").toBe("2.");
    expect(q.requiredMark, "and marked as required").toBe("*");
    expect(describeQuestion(q).title, "neither leaks into the described title").toBe("How are you, Ann?");
  });
  test("The description is described only when the question has one", () => {
    const survey = createSurvey({
      elements: [
        { type: "text", name: "q1", description: "As it is in your passport" },
        { type: "text", name: "q2" },
      ],
    });
    expect(describeByName(survey, "q1").description).toBe("As it is in your passport");
    expect(Object.keys(describeByName(survey, "q2")).indexOf("description")).toBe(-1);
  });

  test("Text constraints: the stricter of the question bound and the validator bound wins", () => {
    const survey = createSurvey({
      elements: [
        {
          type: "text", name: "age", inputType: "number", min: 0, max: 40,
          validators: [{ type: "numeric", maxValue: 30 }],
        },
      ],
    });
    expect(describeByName(survey, "age")).toEqual({
      name: "age",
      type: "text",
      title: "age",
      required: false,
      valueType: "number",
      inputType: "number",
      constraints: { min: 0, max: 30 },
    });
  });
  test("An expression bound is described through renderedMin/renderedMax", () => {
    const survey = createSurvey({
      elements: [
        { type: "text", name: "a", inputType: "number", defaultValue: 5 },
        { type: "text", name: "b", inputType: "number", min: "={a}" },
      ],
    });
    const q = <QuestionTextModel>survey.getQuestionByName("b");
    expect(q.min, "the raw min was moved into minValueExpression").toBeUndefined();
    expect(describeByName(survey, "b").constraints).toEqual({ min: 5 });
    survey.setValue("a", 7);
    expect(describeByName(survey, "b").constraints).toEqual({ min: 7 });
  });
  test("A date input reports ISO strings and never the settings defaults", () => {
    const survey = createSurvey({
      elements: [
        { type: "text", name: "from", inputType: "date", min: "2020-01-01", max: "2020-12-31" },
        { type: "text", name: "any", inputType: "date" },
      ],
    });
    const from = describeByName(survey, "from");
    expect(from.valueType).toBe("date");
    expect(from.inputType).toBe("date");
    expect(from.constraints).toEqual({ min: "2020-01-01", max: "2020-12-31" });
    const any = describeByName(survey, "any");
    expect((<any>survey.getQuestionByName("any")).renderedMax, "the model falls back to settings.maxDate").toBe("2999-12-31");
    expect(any.constraints, "the question declared no bound").toBeUndefined();
  });
  test("maxLength comes from the question, then from survey.maxTextLength", () => {
    const survey = createSurvey({
      maxTextLength: 25,
      elements: [
        { type: "text", name: "q1", maxLength: 10 },
        { type: "text", name: "q2" },
        { type: "comment", name: "q3", maxLength: 300 },
      ],
    });
    expect(describeByName(survey, "q1").constraints).toEqual({ maxLength: 10 });
    expect(describeByName(survey, "q2").constraints).toEqual({ maxLength: 25 });
    expect(describeByName(survey, "q3").constraints).toEqual({ maxLength: 300 });
  });
  test("Validators are described as constraints, their error texts are not", () => {
    const survey = createSurvey({
      elements: [
        {
          type: "text", name: "q1",
          validators: [
            { type: "text", minLength: 2, maxLength: 8, allowDigits: false, text: "Letters only, please" },
            { type: "regex", regex: "^[A-Z]" },
          ],
        },
        { type: "text", name: "q2", inputType: "email", validators: [{ type: "email" }] },
        { type: "text", name: "q3", validators: [{ type: "expression", expression: "{q3} != 'no'" }] },
        { type: "checkbox", name: "q4", choices: [1, 2, 3], validators: [{ type: "answercount", minCount: 1, maxCount: 2 }] },
      ],
    });
    expect(describeByName(survey, "q1").constraints).toEqual({
      minLength: 2, maxLength: 8, regex: "^[A-Z]", allowDigits: false,
    });
    expect(describeByName(survey, "q2").constraints).toEqual({ format: "email" });
    expect(describeByName(survey, "q3").constraints).toEqual({ expression: "{q3} != 'no'" });
    expect(describeByName(survey, "q4").constraints).toEqual({ minCount: 1, maxCount: 2 });
  });
  test("A mask of each type is described", () => {
    const survey = createSurvey({
      elements: [
        { type: "text", name: "phone", maskType: "pattern", maskSettings: { pattern: "+1(999)-999-99-99" } },
        { type: "text", name: "amount", maskType: "numeric", maskSettings: { min: 0, max: 100 } },
        { type: "text", name: "price", maskType: "currency", maskSettings: { min: 1 } },
        { type: "text", name: "when", maskType: "datetime", maskSettings: { pattern: "mm/dd/yyyy", min: "2020-01-01" } },
      ],
    });
    expect(describeByName(survey, "phone").constraints).toEqual({
      mask: { type: "pattern", pattern: "+1(999)-999-99-99" },
    });
    expect(describeByName(survey, "amount").constraints).toEqual({
      mask: { type: "numeric", min: 0, max: 100 },
    });
    expect(describeByName(survey, "price").constraints).toEqual({
      mask: { type: "currency", min: 1 },
    });
    expect(describeByName(survey, "when").constraints).toEqual({
      mask: { type: "datetime", pattern: "mm/dd/yyyy", min: "2020-01-01" },
    });
  });
  test("A text question's step is described", () => {
    const survey = createSurvey({
      elements: [{ type: "text", name: "q1", inputType: "number", step: "5" }],
    });
    expect(describeByName(survey, "q1").constraints).toEqual({ step: 5 });
  });

  test("A choice text is described only when it differs from the value", () => {
    const survey = createSurvey({
      elements: [
        { type: "dropdown", name: "q1", choices: ["one", { value: "two", text: "Two" }, { value: 3, text: "3" }] },
      ],
    });
    expect(describeByName(survey, "q1").choices).toEqual([
      { value: "one" }, { value: "two", text: "Two" }, { value: 3 },
    ]);
  });
  test("choicesVisibleIf hides an item, choicesEnableIf disables one", () => {
    const survey = createSurvey({
      elements: [
        { type: "text", name: "src", defaultValue: "b" },
        { type: "radiogroup", name: "q1", choices: ["a", "b", "c"], choicesVisibleIf: "{item} != 'c'" },
        { type: "radiogroup", name: "q2", choices: ["a", "b", "c"], choicesEnableIf: "{item} != {src}" },
      ],
    });
    expect(describeByName(survey, "q1").choices).toEqual([{ value: "a" }, { value: "b" }]);
    expect(describeByName(survey, "q2").choices).toEqual([
      { value: "a" }, { value: "b", disabled: true }, { value: "c" },
    ]);
  });
  test("The built-in items: other and none are described, select-all is dropped", () => {
    const survey = createSurvey({
      elements: [
        {
          type: "checkbox", name: "q1", choices: ["a", "b"],
          showOtherItem: true, showNoneItem: true, showSelectAllItem: true,
        },
      ],
    });
    const res = describeByName(survey, "q1");
    expect(res.choices).toEqual([
      { value: "a" },
      { value: "b" },
      { value: "none", text: "None", none: true },
      { value: "other", text: "Other (describe)", other: true },
    ]);
    expect(res.comment).toEqual({ required: true });
  });
  test("refuse and don't know clear the rest as none does", () => {
    const survey = createSurvey({
      elements: [
        { type: "radiogroup", name: "q1", choices: ["a"], showRefuseItem: true, showDontKnowItem: true },
      ],
    });
    expect(describeByName(survey, "q1").choices).toEqual([
      { value: "a" },
      { value: "refused", text: "Refuse to answer", none: true },
      { value: "dontknow", text: "Don't know", none: true },
    ]);
  });
  test("A comment area is described as an optional text", () => {
    const survey = createSurvey({
      elements: [{ type: "radiogroup", name: "q1", choices: ["a"], showCommentArea: true }],
    });
    expect(describeByName(survey, "q1").comment).toEqual({ required: false });
    expect(survey.getQuestionByName("q1").name + settings.commentSuffix).toBe("q1-Comment");
  });

  test("choicesByUrl: unknown until the request answered", () => {
    let respond: (response: any) => void = undefined;
    const survey = new SurveyModel();
    survey.webProvider = {
      sendRequest: (request, onResponse): void => { respond = onResponse; },
    };
    survey.fromJSON({
      elements: [{
        type: "dropdown", name: "country",
        choicesByUrl: { url: "https://api.example.com/countries", valueName: "id" },
      }],
    });
    const waiting = describeByName(survey, "country");
    expect(waiting.choicesUnknown).toBe(true);
    expect(waiting.choices).toBeUndefined();
    respond({ status: 200, response: [{ id: "de" }, { id: "fr" }] });
    const loaded = describeByName(survey, "country");
    expect(loaded.choicesUnknown).toBeUndefined();
    expect(loaded.choices).toEqual([{ value: "de" }, { value: "fr" }]);
  });
  test("choicesLazyLoadEnabled cannot be enumerated", () => {
    const survey = createSurvey({
      elements: [{ type: "dropdown", name: "q1", choicesLazyLoadEnabled: true }],
    });
    const res = describeByName(survey, "q1");
    expect(res.choicesUnknown).toBe(true);
    expect(res.choices).toBeUndefined();
  });
  test("choicesFromQuestion reflects the source question's current value", () => {
    const survey = createSurvey({
      elements: [
        { type: "checkbox", name: "q1", choices: ["a", "b", "c"] },
        { type: "radiogroup", name: "q2", choicesFromQuestion: "q1", choicesFromQuestionMode: "selected" },
      ],
    });
    survey.setValue("q1", ["a", "c"]);
    expect(describeByName(survey, "q2").choices).toEqual([{ value: "a" }, { value: "c" }]);
  });

  test("boolean is described as two choices, one shape for every pick-one question", () => {
    const survey = createSurvey({
      elements: [
        { type: "boolean", name: "q1", title: "Agreed?" },
        { type: "boolean", name: "q2", valueTrue: "yes", valueFalse: "no", labelTrue: "Sure", labelFalse: "Nope" },
      ],
    });
    expect(describeByName(survey, "q1")).toEqual({
      name: "q1",
      type: "boolean",
      title: "Agreed?",
      required: false,
      valueType: "boolean",
      choices: [{ value: false, text: "No" }, { value: true, text: "Yes" }],
    });
    const q2 = describeByName(survey, "q2");
    expect(q2.valueType).toBe("string");
    expect(q2.choices).toEqual([{ value: "no", text: "Nope" }, { value: "yes", text: "Sure" }]);
  });

  test("rating: the generated items, the authored ones, and the rate descriptions", () => {
    const survey = createSurvey({
      elements: [
        { type: "rating", name: "q1", rateMin: 1, rateMax: 3, minRateDescription: "Bad", maxRateDescription: "Good" },
        { type: "rating", name: "q2", rateValues: [{ value: "low", text: "Low" }, "high"] },
      ],
    });
    expect(describeByName(survey, "q1")).toEqual({
      name: "q1",
      type: "rating",
      title: "q1",
      required: false,
      valueType: "number",
      rateValues: [{ value: 1 }, { value: 2 }, { value: 3 }],
      minRateDescription: "Bad",
      maxRateDescription: "Good",
    });
    const q2 = describeByName(survey, "q2");
    expect(q2.valueType).toBe("string");
    expect(q2.rateValues).toEqual([{ value: "low", text: "Low" }, { value: "high" }]);
    expect(q2.minRateDescription).toBeUndefined();
    expect(q2.choices, "a rating reports rateValues, never choices").toBeUndefined();
  });

  test("checkbox: the selection bounds are counts, the value is an array", () => {
    const survey = createSurvey({
      elements: [{ type: "checkbox", name: "q1", choices: ["a", "b", "c"], maxSelectedChoices: 2 }],
    });
    const res = describeByName(survey, "q1");
    expect(res.valueType).toBe("array");
    expect(res.constraints).toEqual({ maxCount: 2 });
  });

  test("multipletext describes one item per editor", () => {
    const survey = createSurvey({
      elements: [
        {
          type: "multipletext", name: "contact", title: "Contact",
          items: [
            { name: "email", title: "E-mail", inputType: "email", maxLength: 40 },
            { name: "age", inputType: "number", isRequired: true },
          ],
        },
      ],
    });
    expect(describeByName(survey, "contact")).toEqual({
      name: "contact",
      type: "multipletext",
      title: "Contact",
      required: false,
      valueType: "object",
      items: [
        { name: "email", type: "text", title: "E-mail", required: false, valueType: "string", inputType: "email", constraints: { maxLength: 40 } },
        { name: "age", type: "text", title: "age", required: true, valueType: "number", inputType: "number" },
      ],
    });
  });
  test("A composite component is described as composite with its content questions", () => {
    ComponentCollection.Instance.add({
      name: "fullname",
      elementsJSON: [
        { type: "text", name: "firstName", isRequired: true },
        { type: "dropdown", name: "title", choices: ["Mr", "Ms"] },
      ],
    });
    try {
      const survey = createSurvey({
        elements: [{ type: "fullname", name: "who", title: "Who are you?" }],
      });
      expect(describeByName(survey, "who")).toEqual({
        name: "who",
        type: "composite",
        title: "Who are you?",
        required: false,
        valueType: "object",
        items: [
          { name: "firstName", type: "text", title: "firstName", required: true, valueType: "string" },
          { name: "title", type: "dropdown", title: "title", required: false, valueType: "string", choices: [{ value: "Mr" }, { value: "Ms" }] },
        ],
      });
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
  test("A single custom component is described through its content question", () => {
    ComponentCollection.Instance.add({
      name: "grade",
      questionJSON: { type: "dropdown", choices: [1, 2, 3] },
    });
    try {
      const survey = createSurvey({
        elements: [{ type: "grade", name: "q1", title: "Your grade", isRequired: true }],
      });
      expect(describeByName(survey, "q1")).toEqual({
        name: "q1",
        type: "dropdown",
        title: "Your grade",
        required: true,
        valueType: "number",
        choices: [{ value: 1 }, { value: 2 }, { value: 3 }],
      });
    } finally {
      ComponentCollection.Instance.clear();
    }
  });

  test("readOnly is omitted, enableIf is disabled, includeReadOnly returns both", () => {
    const survey = createSurvey({
      elements: [
        { type: "text", name: "src" },
        { type: "text", name: "q1", readOnly: true },
        { type: "text", name: "q2", enableIf: "{src} = 'go'" },
      ],
    });
    expect(describeByName(survey, "q1"), "a read-only question cannot be answered at all").toBeUndefined();
    expect(describeByName(survey, "q2").disabled, "enableIf is false for now").toBe(true);
    expect(describeByName(survey, "q1", { includeReadOnly: true })).toEqual({
      name: "q1", type: "text", title: "q1", required: false, valueType: "string", disabled: true,
    });
    survey.setValue("src", "go");
    expect(Object.keys(describeByName(survey, "q2")).indexOf("disabled"), "enableIf turned true").toBe(-1);
  });

  test("The types nobody can answer through text are marked unsupported", () => {
    const survey = createSurvey({
      elements: [
        { type: "file", name: "q1", title: "Upload" },
        { type: "signaturepad", name: "q2" },
        { type: "imagepicker", name: "q3", choices: [{ value: "a", imageLink: "a.png" }] },
        { type: "html", name: "q4", html: "<b>hi</b>" },
        { type: "image", name: "q5" },
        { type: "expression", name: "q6", expression: "1 + 1" },
        { type: "imagemap", name: "q7" },
      ],
    });
    expect(describeByName(survey, "q1")).toEqual({
      name: "q1", type: "file", title: "Upload", required: false, valueType: "array", unsupported: true,
    });
    ["q2", "q3", "q4", "q5", "q6", "q7"].forEach(name => {
      expect(describeByName(survey, name).unsupported, name + " is unsupported").toBe(true);
      expect(describeByName(survey, name).choices, name + " lists no choices").toBeUndefined();
    });
  });

  test("Everything is read through the model, so the locale resolves itself", () => {
    const survey = createSurvey({
      showQuestionNumbers: "on",
      elements: [
        {
          type: "radiogroup", name: "q1", isRequired: true,
          title: { default: "Do you have a pet?", de: "Haben Sie ein Haustier?" },
          choices: ["Yes"], showOtherItem: true,
        },
      ],
    });
    expect(describeByName(survey, "q1").title).toBe("Do you have a pet?");
    survey.locale = "de";
    const res = describeByName(survey, "q1");
    expect(res.title).toBe("Haben Sie ein Haustier?");
    expect(res.choices[1]).toEqual({ value: "other", text: "Sonstiges (Bitte angeben)", other: true });
    survey.locale = "";
  });

  test("Question.getValueType() agrees with the linter's JSON-side table", () => {
    const elements: Array<any> = [
      { type: "text", name: "t1" },
      { type: "text", name: "t2", inputType: "number" },
      { type: "text", name: "t3", inputType: "date" },
      { type: "text", name: "t4", inputType: "week" },
      { type: "comment", name: "c1" },
      { type: "boolean", name: "b1" },
      { type: "radiogroup", name: "r1", choices: ["a", "b"] },
      { type: "dropdown", name: "d1", choices: [1, 2] },
      { type: "checkbox", name: "ch1", choices: ["a"] },
      { type: "tagbox", name: "tg1", choices: ["a"] },
      { type: "ranking", name: "rk1", choices: ["a"] },
      { type: "file", name: "f1" },
      { type: "signaturepad", name: "s1" },
      { type: "imagepicker", name: "ip1", choices: [{ value: "a", imageLink: "a.png" }] },
      { type: "imagepicker", name: "ip2", multiSelect: true, choices: [{ value: "a", imageLink: "a.png" }] },
      { type: "rating", name: "ra1" },
      { type: "rating", name: "ra2", rateValues: ["low", "high"] },
      { type: "slider", name: "sl1" },
      { type: "slider", name: "sl2", sliderType: "range" },
      { type: "matrix", name: "m1", rows: ["r"], columns: ["c"] },
      { type: "matrixdropdown", name: "m2", rows: ["r"], columns: [{ name: "c" }] },
      { type: "matrixdynamic", name: "m3", columns: [{ name: "c" }] },
      { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "q" }] },
      { type: "multipletext", name: "mt1", items: [{ name: "i1" }] },
    ];
    const survey = createSurvey({ elements: elements });
    elements.forEach(json => {
      const question = survey.getQuestionByName(json.name);
      const own = question.getValueType();
      expect(own, json.name + " is described").toBe(describeQuestion(question).valueType);
      const info = getValueTypeInfo(json.type, json);
      // The linter has no opinion on a shape it calls "none" or "unknown", nor on a scalar it
      // cannot pin to one type; everywhere else the two tables must say the same thing.
      const expected = info.shape === "scalar" ? (info.scalarType === "any" ? undefined : info.scalarType) :
        (info.shape === "array" || info.shape === "object" ? info.shape : undefined);
      if (expected !== undefined) {
        expect(own, json.name + " agrees with the linter").toBe(expected);
      }
    });
  });
  test("A single-choice matrix is an object with no choices of its own", () => {
    const survey = createSurvey({
      elements: [{ type: "matrix", name: "m1", rows: ["r1", "r2"], columns: ["c1", "c2"] }],
    });
    const res = describeByName(survey, "m1");
    expect(res.valueType).toBe("object");
    expect(res.choices).toBeUndefined();
  });
  test("The model answers what a describing consumer needs to know", () => {
    const survey = createSurvey({
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
    const isSelect = (name: string) => survey.getQuestionByName(name).isSelectQuestion();
    expect(["r1", "b1", "ra1"].map(isSelect), "the pick-one questions say so themselves").toEqual([true, true, true]);
    expect(["t1", "m1", "f1"].map(isSelect), "the others do not").toEqual([false, false, false]);
    const hasPlainInput = (name: string) => survey.getQuestionByName(name).hasPlainInput;
    expect(["r1", "b1", "t1", "m1"].map(hasPlainInput)).toEqual([true, true, true, true]);
    expect(["f1", "s1", "ip1", "im1", "h1"].map(hasPlainInput),
      "a value only the question's own UI can produce").toEqual([false, false, false, false, false]);
  });
  test("getValueChoices leaves out the Select All item and flags the exclusive ones", () => {
    const survey = createSurvey({
      elements: [
        {
          type: "checkbox", name: "q1", showSelectAllItem: true, showNoneItem: true,
          choices: ["a", { value: "b", isExclusive: true }],
        },
      ],
    });
    const q = <any>survey.getQuestionByName("q1");
    expect(q.visibleChoices.length, "the model renders the Select All item").toBe(4);
    const items = q.getValueChoices();
    expect(items.map((item: any) => item.value), "it is a gesture, not a value").toEqual(["a", "b", "none"]);
    expect(items.map((item: any) => q.isNoneItem(item)), "isExclusive is what clears the rest").toEqual([false, true, true]);
    expect(describeByName(survey, "q1").choices).toEqual([
      { value: "a" },
      { value: "b", none: true },
      { value: "none", text: "None", none: true },
    ]);
  });
  test("The single-input questions a matrix synthesizes are plain questions", () => {
    const survey = createSurvey({
      questionsOnPageMode: "inputPerPage",
      elements: [{ type: "matrix", name: "m1", rows: [{ value: "r1", text: "Row one" }], columns: ["c1", "c2"] }],
    });
    const rowQuestions = (<any>survey.getQuestionByName("m1")).getMatrixSingleInputQuestions();
    expect(rowQuestions).toHaveLength(1);
    const res = describeQuestion(rowQuestions[0]);
    expect(res.type).toBe("radiogroup");
    expect(res.valueType).toBe("string");
    expect(res.choices).toEqual([{ value: "c1" }, { value: "c2" }]);
  });
});
