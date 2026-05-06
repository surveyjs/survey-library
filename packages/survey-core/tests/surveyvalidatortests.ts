import {
  SurveyValidator,
  NumericValidator,
  EmailValidator,
  TextValidator,
  ValidatorResult,
  ExpressionValidator,
  RegexValidator,
} from "../src/validator";
import { CustomError, ExceedSizeError, MinRowCountError } from "../src/error";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { QuestionTextModel } from "../src/question_text";
import { QuestionMultipleTextModel } from "../src/question_multipletext";
import { Serializer } from "../src/jsonobject";
import { FunctionFactory } from "../src/functionsfactory";
import { settings } from "../src/settings";
import { SurveyError } from "../src/survey-error";
import { surveyLocalization } from "../src/surveyStrings";

import { describe, test, expect } from "vitest";
test("Numeric validator", () => {
  var validator = new NumericValidator();
  expect(validator.validate("s5").error, "Could not convert to numeric").not.toBeNull();
  expect(validator.validate(5), "There are no limits (non-zero)").toBeNull();
  expect(validator.validate(0), "There are no limits (zero)").toBeNull();
  expect(validator.validate("5").value, "Convert to numeric (non-zero)").toBe(5);
  expect(validator.validate("5").error, "There is no error (non-zero)").toBeNull();
  expect(validator.validate("0").value, "Convert to numeric (zero)").toBe(0);
  expect(validator.validate("0").error, "There is no error (zero)").toBeNull();

  validator.minValue = 10;
  validator.maxValue = 20;
  expect(validator.validate(5).error, "Value is too low. Limits are not 0.").not.toBeNull();
  expect(validator.validate(25).error, "Value is too high. Limits are not 0.").not.toBeNull();
  expect(validator.validate("15").error, "Value is between minValue and maxValue. Limits are not 0.").toBeNull();
  expect(validator.validate(15), "Value is between minValue and maxValue. Return no errors. Limits are not 0.").toBeNull();

  validator.minValue = 0;
  validator.maxValue = 20;
  expect(validator.validate(-1).error, "Value is too low. Low limit is 0.").not.toBeNull();
  expect(validator.validate(25).error, "Value is too high. Low limit is 0.").not.toBeNull();
  expect(validator.validate("15").error, "Value is between minValue and maxValue. Low limit is 0.").toBeNull();
  expect(validator.validate(15), "Value is between minValue and maxValue. Return no errors. Low limit is 0.").toBeNull();

  validator.minValue = -20;
  validator.maxValue = 0;
  expect(validator.validate(-21).error, "Value is too low. High limit is 0.").not.toBeNull();
  expect(validator.validate(1).error, "Value is too high. High limit is 0.").not.toBeNull();
  expect(validator.validate("-5").error, "Value is between minValue and maxValue. High limit is 0.").toBeNull();
  expect(validator.validate(-5), "Value is between minValue and maxValue. Return no errors. High limit is 0.").toBeNull();

  validator.minValue = 0;
  validator.maxValue = 100;
  expect(validator.validate("0.1").error, "0.1 > 0").toBeNull();
  expect(validator.validate("1.1").error, "1.1 > 0").toBeNull();
  expect(validator.validate("0,1").error, "0,1 > 0").toBeNull();
  expect(validator.validate("1,1").error, "1,1 > 0").toBeNull();
  expect(validator.validate("99,1").error, "99,1 < 100").toBeNull();
  expect(validator.validate("100,1").error, "100,1 > 100").not.toBeNull();
});

test("Email validator", () => {
  var validator = new EmailValidator();
  expect(validator.validate("my@mail.com"), "Could convert the correct e-mail").toBeNull();
  expect(validator.validate("@mail.com").error, "Could convert the incorrect correct e-mail").not.toBeNull();
});

test("Text validator", () => {
  var validator = new TextValidator();
  expect(validator.validate(""), "Empty string").toBeNull();
  validator.minLength = 1;
  validator.maxLength = 5;
  expect(validator.validate(""), "Empty string").toBeNull();
  expect(validator.validate("a"), "Shorter string").toBeNull();
  expect(validator.validate("abcde"), "Five letter string").toBeNull();
  expect(validator.validate("abcdef"), "Longer string").not.toBeNull();
  expect(validator.validate("abc12"), "Not just text").toBeNull();
  validator.allowDigits = false;
  expect(validator.validate("abc12"), "Not just text").not.toBeNull();
  expect(validator.validate("abc."), "Just text").toBeNull();
});

test("Text validator calls onPropertyValueChangedCallback", () => {
  var validator = new TextValidator();
  var changes = {};
  validator.onPropertyValueChangedCallback = (name) => {
    changes[name] = true;
  };
  validator.fromJSON({
    type: "text",
    minLength: 11,
    maxLength: 15,
    allowDigits: true,
  });
  expect(validator.minLength, "minLength loaded").toBe(11);
  expect(validator.maxLength, "maxLength loaded").toBe(15);
  validator.minLength = 1;
  expect(changes["minLength"], "minLength changed").toBe(true);
  validator.maxLength = 5;
  expect(changes["maxLength"], "maxLength changed").toBe(true);
  validator.allowDigits = false;
  expect(changes["allowDigits"], "allowDigits changed").toBe(true);
});

export class CamelCaseValidator extends SurveyValidator {
  public getType(): string {
    return "CamelCaseValidator";
  }
  public validate(value: any, name: string = null): ValidatorResult {
    if (!value) return null;
    if (value.indexOf("CamelCase") < 0)
      return new ValidatorResult(value, new CustomError("No Camel Case"));
    return null;
  }
}

Serializer.addClass(
  "CamelCaseValidator",
  [],
  function() {
    return new CamelCaseValidator();
  },
  "surveyvalidator"
);

test("Support camel names in validators, Bug#994", () => {
  var json = {
    elements: [
      {
        type: "text",
        name: "qSame",
        validators: [{ type: "CamelCaseValidator" }],
      },
      {
        type: "text",
        name: "qLow",
        validators: [{ type: "camelcasevalidator" }],
      },
      {
        type: "text",
        name: "qUpper",
        validators: [{ type: "CAMELCASEVALIDATOR" }],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var qSame = <QuestionTextModel>survey.getQuestionByName("qSame");
  var qLow = <QuestionTextModel>survey.getQuestionByName("qLow");
  var qUpper = <QuestionTextModel>survey.getQuestionByName("qUpper");
  expect(qSame.validators.length, "same case - validtor is here").toBe(1);
  expect(qLow.validators.length, "low case - validtor is here").toBe(1);
  expect(qUpper.validators.length, "upper case - validtor is here").toBe(1);
});
test("Support camel names in validators, Bug#994", () => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        validators: [{ type: "camelcasevalidator" }],
      }
    ],
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  q1.value = "some text";
  survey.tryComplete();
  expect(q1.errors.length, "There is an error").toBe(1);
  q1.value = "some CamelCase text";
  expect(q1.errors.length, "There is no error").toBe(0);
});
test("Validators and isRequired in multipletext items, Bug#1055", () => {
  var json = {
    elements: [
      {
        type: "multipletext",
        name: "pricelimit",
        items: [
          {
            name: "leastamount",
            validators: [
              {
                type: "numeric",
                minValue: 0,
                maxValue: 100,
              },
            ],
          },
          {
            name: "mostamount",
            isRequired: true,
            validators: [
              {
                type: "numeric",
                minValue: 0,
                maxValue: 100,
              },
            ],
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var question = <QuestionMultipleTextModel>(
      survey.getQuestionByName("pricelimit")
    );
  question.items[1].value = 3;
  expect(question.validate(), "Everything is fine, there is no errors").toBe(true);
});

test("text validator doesn't work correctly with empty text, Bug#1241", () => {
  var json = {
    elements: [
      {
        type: "text",
        name: "q1",
        validators: [
          {
            type: "text",
            minLength: 1,
            maxLength: 100,
          },
        ],
      },
      {
        type: "text",
        name: "q2",
        validators: [
          {
            type: "text",
            minLength: 0,
            maxLength: 100,
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  expect(survey.currentPage.validate(), "There is no errors, values are empty").toBe(true);
});

test("text validator doesn't work correctly with setting value to  empty text, Bug#3065", () => {
  var json = {
    elements: [
      {
        type: "text",
        name: "q1",
        validators: [
          {
            type: "text",
            minLength: 5,
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var q = survey.getQuestionByName("q1");
  expect(q.isEmpty(), "value is empty").toBe(true);
  expect(q.validate(), "There is no errors, values are empty").toBe(true);
  survey.setValue("q1", "abc");
  expect(q.isEmpty(), "value is not empty").toBe(false);
  expect(q.validate(), "There is an error").toBe(false);
  survey.setValue("q1", "");
  expect(q.isEmpty(), "value is empty #2").toBe(true);
  expect(q.validate(), "There is no error, again value is empty #2").toBe(true);
});

test("Expression validator", () => {
  var json = {
    elements: [
      {
        type: "multipletext",
        name: "pricelimit",
        items: [
          {
            name: "leastamount",
          },
          {
            name: "mostamount",
          },
        ],
        validators: [
          {
            type: "expression",
            expression: "{pricelimit.leastamount} <= {pricelimit.mostamount}",
            text: "Error",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  var question = <QuestionMultipleTextModel>(
    survey.getQuestionByName("pricelimit")
  );
  question.items[0].value = 5;
  question.items[1].value = 3;
  expect(question.validate(), "5 <= 3").toBe(false);
  question.items[0].value = 3;
  question.items[1].value = 5;
  expect(question.validate(), "5 >= 3").toBe(true);
});

test("Expression validator #2", () => {
  var json = {
    elements: [
      {
        type: "comment",
        name: "comment",
        title: "Please tell us about your experience",
        validators: [
          {
            type: "expression",
            expression: "{satisfaction} < 6 or {comment} notempty",
            text: "Please answer this question.",
          },
        ],
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.setValue("satisfaction", 6);
  expect(survey.isCurrentPageHasErrors, "comment should not be empty").toBe(true);
  survey.setValue("comment", "some text");
  expect(survey.isCurrentPageHasErrors, "comment has text now").toBe(false);
  survey.clearValue("comment");
  expect(survey.isCurrentPageHasErrors, "comment is empty again").toBe(true);
  survey.setValue("satisfaction", 5);
  expect(survey.isCurrentPageHasErrors, "satisfaction is low").toBe(false);
});

test("ExceedSizeError", () => {
  var error = new ExceedSizeError(102400);
  expect(error.getText()).toBe("The file size should not exceed 100 KB.");
  expect(error.locText.text).toBe("The file size should not exceed 100 KB.");
});

test("ExceedSizeError uses localized file size units", () => {
  const enStrings = surveyLocalization.getLocaleStrings("en");
  const prevValue = enStrings.fileSizeUnits;
  enStrings.fileSizeUnits = "tavua, kt, Mt, Gt, Tt";
  var error = new ExceedSizeError(102400);
  expect(error.getText()).toBe("The file size should not exceed 100 kt.");
  enStrings.fileSizeUnits = prevValue;
});

test("MinRowCountError", () => {
  var error = new MinRowCountError(1);
  expect(error.getText()).toBe("Please fill in at least 1 row(s).");
  expect(error.locText.text).toBe("Please fill in at least 1 row(s).");
});

test("Regex number validator, Bug#1775", () => {
  var validator = new RegexValidator("^0*(?:[2-9]|[1-9]dd*)$");
  validator.text = "More than 0";
  expect(validator.validate(0).error.text, "0 give error").toBe("More than 0");
  expect(validator.validate(2), "Parse correctly 2").toBeNull();
  expect(validator.validate(null), "Parse correctly null").toBeNull();
});
test("Regex case insensitive, Bug#7620", () => {
  const validator = new RegexValidator(".+@something.com");
  validator.insensitive = true;
  validator.text = "Error";
  expect(validator.validate("abc").error.text, "#1").toBe("Error");
  expect(validator.validate("abc@something1.com").error.text, "#2").toBe("Error");
  expect(validator.validate("abc@something.com"), "#3").toBeNull();
  expect(validator.validate("abc@SomeThing.com"), "#4").toBeNull();
});
test("Regex load caseInsensitve", () => {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [{ type: "text", name: "q", validators: [{ type: "regex", regex: ".+@something.com", caseInsensitive: true }] }]
  });
  const q = survey.getQuestionByName("q");
  expect(q.errors.length, "#1").toBe(0);
  q.value = "abc";
  expect(q.errors.length, "#2").toBe(1);
  q.value = "abc@something1.com";
  expect(q.errors.length, "#3").toBe(1);
  q.value = "abc@something.com";
  expect(q.errors.length, "#4").toBe(0);
  q.value = "abc@SomeThing.com";
  expect(q.errors.length, "#5").toBe(0);
});
test("survey.onCreateRegexValidator, Issue#10766", () => {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [{ type: "text", name: "q", validators: [{ type: "regex", regex: ".+@something." }] }]
  });
  survey.onCreateRegexValidator.add((sender, options) => {
    expect(options.validator.regex, "check options.validator").toBe(".+@something.");
    options.pattern = options.pattern + "com";
    options.flags = "i";
  });
  const q = survey.getQuestionByName("q");
  expect(q.errors.length, "#1").toBe(0);
  q.value = "abc";
  expect(q.errors.length, "#2").toBe(1);
  q.value = "abc@something1.com";
  expect(q.errors.length, "#3").toBe(1);
  q.value = "abc@something.com";
  expect(q.errors.length, "#4").toBe(0);
  q.value = "abc@SomeThing.com";
  expect(q.errors.length, "#5").toBe(0);
});

test("question with async validators", () => {
  let returnResult1: (res: any) => void = (res: boolean) => {};
  let returnResult2: (res: any) => void = (res: boolean) => {};
  function asyncFunc1(params: any): any {
    returnResult1 = this.returnResult;
    return false;
  }
  function asyncFunc2(params: any): any {
    returnResult2 = this.returnResult;
    return false;
  }
  FunctionFactory.Instance.register("asyncFunc1", asyncFunc1, true);
  FunctionFactory.Instance.register("asyncFunc2", asyncFunc2, true);

  var question = new Question("q1");
  question.validators.push(new ExpressionValidator("2 = 1)"));
  question.validators.push(new ExpressionValidator("asyncFunc1() = 1"));
  question.validators.push(new ExpressionValidator("asyncFunc2() = 2"));
  expect(question.isRunningValidators, "We do not run validators yet").toBe(false);
  expect(question.validate(), "There is an error").toBe(false);
  expect(question.errors.length, "There is one error").toBe(1);
  expect(question.isRunningValidators, "func1 and func2 are not completed").toBe(true);
  returnResult1(11);
  expect(question.isRunningValidators, "func2 is not completed").toBe(true);
  returnResult2(22);
  expect(question.errors.length, "There are three errors now").toBe(3);
  expect(question.isRunningValidators, "func1 and func2 are completed").toBe(false);

  FunctionFactory.Instance.unregister("asyncFunc1");
  FunctionFactory.Instance.unregister("asyncFunc2");
});
test("settings.readOnly.enableValidation option", () => {
  var survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        readOnly: true,
        isRequired: true
      }
    ]
  });
  var q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  survey.validate(true);
  expect(q1.errors.length, "No errors").toBe(0);
  settings.readOnly.enableValidation = true;
  survey.validate(true);
  expect(q1.errors.length, "There is an error").toBe(1);
  settings.readOnly.enableValidation = false;
});
test("Async expression validators creates several errors", () => {
  const asynList = new Array<any>();
  function asyncFunc(params) {
    asynList.push(this.returnResult);
  }
  FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);
  function callAsyncList(): void {
    while(asynList.length > 0) {
      let i = asynList.length % 2;
      if (i >= asynList.length) i = 0;
      asynList[i](false);
      asynList.splice(i, 1);
    }
  }
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        validators: [{ type: "expression", expression: "asyncFunc({question1})" }]
      },
      {
        type: "text",
        name: "q2",
        validators: [{ type: "expression", expression: "asyncFunc({question1})" }]
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  q1.value = "a";
  q1.valule = "b";
  survey.validate(true);
  expect(asynList.length, "#1.0").toBe(2);
  callAsyncList();
  expect(q1.errors.length, "#1.1").toBe(1);
  expect(q2.errors.length, "#1.2").toBe(1);
  q1.value = "aa";
  callAsyncList();
  expect(q1.errors.length, "#2.1").toBe(1);
  expect(q2.errors.length, "#2.2").toBe(1);
  q2.value = "bb";
  callAsyncList();
  expect(q1.errors.length, "#3.1").toBe(1);
  expect(q2.errors.length, "#3.2").toBe(1);
});
test("expression validators & survey.onExpressionRunning, Bug#10294", () => {
  let counter = 0;
  function customFunc(params) {
    counter++;
  }
  FunctionFactory.Instance.register("customFunc", customFunc, false);
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
        validators: [{ type: "expression", expression: "customFunc({question1})" }]
      },
      {
        type: "text",
        name: "q2",
        validators: [{ type: "expression", expression: "customFunc({question1})" }]
      }
    ]
  });
  let allow = false;
  survey.onExpressionRunning.add((survey, options) => {
    if (options.element.getType() === "expressionvalidator") {
      options.allow = allow;
    }
  });
  const q1 = survey.getQuestionByName("q1");
  q1.value = "a";
  q1.valule = "b";
  survey.validate(true);
  expect(counter, "#1").toBe(0);
  allow = true;
  survey.validate(true);
  expect(counter, "#2").toBe(2);
});
test("SurveyError.getCssIcon, Issue#9085", () => {
  const surveyError = new SurveyError("ErrorText");
  expect(surveyError.getCssIcon(undefined), "getCssIcon #1").toBeUndefined();
  expect(surveyError.getCssIcon({}), "getCssIcon #2").toBeUndefined();
  expect(surveyError.getCssIcon({ error: {} }), "getCssIcon #3").toBeUndefined();
  expect(surveyError.getCssIcon({ error: { icon: "icon" } }), "getCssIcon #4").toBe("icon");
  expect(surveyError.getCssIcon({ error: { icon: "icon", warningIcon: "warningIcon" } }), "getCssIcon #4.1").toBe("icon");
  surveyError.notificationType = "warning";
  expect(surveyError.getCssIcon({ error: { icon: "icon" } }), "getCssIcon #5").toBe("icon");
  expect(surveyError.getCssIcon({ error: { warningIcon: "warningIcon", icon: "warningIcon" } }), "getCssIcon #6").toBe("warningIcon");
  expect(surveyError.getCssIcon({ error: { icon: "icon", warningIcon: "warningIcon" } }), "getCssIcon #7").toBe("warningIcon");
  expect(surveyError.getCssIcon(undefined), "getCssIcon #8").toBeUndefined();
  expect(surveyError.getCssIcon({}), "getCssIcon #9").toBeUndefined();
  expect(surveyError.getCssIcon({ error: {} }), "getCssIcon #10").toBeUndefined();
});
test("SurveyError.notificationType, Issue#9085", () => {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", validators: [{ type: "numeric", maxValue: 5, notificationType: "warning" }] },
      { type: "text", name: "q2", validators: [{ type: "numeric", maxValue: 5 }] }
    ],
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  const q2 = <QuestionTextModel>survey.getQuestionByName("q2");
  q1.value = 10;
  q2.value = 10;
  survey.validate(true);
  expect(q1.errors.length, "There is an error, q1").toBe(1);
  expect(q1.errors[0].isWarning, "isWarning property is set true, q1").toBe(true);
  expect(q2.errors.length, "There is an error, q2").toBe(1);
  expect(q2.errors[0].isWarning, "isWarning property is set false, q2").toBe(false);
});
test("SurveyError.isWarning & validate returns, Issue#9085", () => {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", validators: [{ type: "numeric", maxValue: 3, notificationType: "info" }, { type: "numeric", maxValue: 5, notificationType: "warning" }, { type: "numeric", maxValue: 10 }] }
    ],
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  q1.value = 4;
  expect(survey.validate(true), "One error as info").toBe(true);
  expect(q1.errors.length, "There is no error, q1").toBe(1);
  expect(q1["hasCssError"](), "There is no css error, q1").toBe(false);
  expect(q1["hasCssError"](true), "There is a info, q1").toBe(true);
  q1.value = 7;
  expect(survey.validate(true), "One error as warning").toBe(true);
  expect(q1.errors.length, "There is no error, q1").toBe(2);
  expect(q1["hasCssError"](), "There is no css error, q1").toBe(false);
  expect(q1["hasCssError"](true), "There is a warning, q1").toBe(true);
  q1.value = 12;
  expect(q1.errors.length, "There is no error, q1").toBe(3);
  expect(survey.validate(true), "One error as warning and one as error").toBe(false);
  expect(q1["hasCssError"](), "There is css error, q1").toBe(true);
});
test("SurveyError.notificationType & only the strongest type rendered, Issue#9085", () => {
  const q1 = new QuestionTextModel("q1");
  function createError(type:string, isVisible: boolean = true) {
    const res = new CustomError("");
    res.notificationType = type;
    res.visible = isVisible;
    return res;
  }

  q1.errors.push(createError("error"));
  q1.errors.push(createError("error"));
  q1.errors.push(createError("error", false));
  q1.errors.push(createError("warning"));
  q1.errors.push(createError("info"));
  expect(q1.errors.length, "3 errors (one hidden), 1 warning, 1 info").toBe(5);
  expect(q1.renderedErrors.length, "2 errors").toBe(2);
  expect(q1.currentNotificationType, "rendrered message type is 'error'").toBe("error");
  q1.errors = [];

  q1.errors.push(createError("warning"));
  q1.errors.push(createError("info"));
  expect(q1.errors.length, "1 warning, 1 info").toBe(2);
  expect(q1.renderedErrors.length, "1 warning").toBe(1);
  expect(q1.currentNotificationType, "rendrered message type is 'warning'").toBe("warning");
  q1.errors = [];

  q1.errors.push(createError("info"));
  expect(q1.errors.length, "1 info").toBe(1);
  expect(q1.renderedErrors.length, "1 info").toBe(1);
  expect(q1.currentNotificationType, "rendrered message type is 'info'").toBe("info");
  q1.errors = [];

  q1.errors.push(createError("info", false));
  expect(q1.renderedErrors.length, "no rendered errors").toBe(0);
  expect(q1.currentNotificationType, "no rendrered message type").toBe("");
});
test("Expression validator with empty survey, Bug#10416", () => {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", validators: [{ type: "expression" }] }
    ]
  });
  expect(survey.validate(true), "There is no error").toBe(true);
  survey.tryComplete();
  expect(survey.state, "The survey is completed").toBe("completed");
});

test("Validation dependencies: simple case, endDate depends on startDate", () => {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [
      { type: "text", name: "startDate", inputType: "date" },
      { type: "text", name: "startDate2", inputType: "date" },
      {
        type: "text", name: "endDate", inputType: "date",
        validators: [{
          type: "expression",
          text: "Must be less than 1 year.",
          expression: "dateDiff(min({startDate}, {startDate2}), {endDate}, 'years') < 1"
        }]
      }
    ]
  });
  const endDate = survey.getQuestionByName("endDate");
  expect(endDate["getValidatorVariableNames"](), "endDate depends on startDate and startDate2").toEqual(["startDate", "startDate2"]);
  survey.setValue("startDate", "2024-01-01");
  survey.setValue("endDate", "2025-06-01");
  expect(endDate.errors.length, "Error: more than 1 year").toBe(1);
  survey.setValue("startDate", "2025-03-01");
  expect(endDate.errors.length, "Error cleared: within 1 year again").toBe(0);
});
test("Validation dependencies: add and clear errors", () => {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2",
        validators: [{ type: "expression", expression: "{q1} + {q2} <= 10" }]
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  q1.value = 7;
  q2.value = 5;
  expect(q2.errors.length, "Error: 7+5>10").toBe(1);
  q1.value = 4;
  expect(q2.errors.length, "Error cleared: 4+5<=10").toBe(0);
});
test("Validation dependencies: both questions have expression validators", () => {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [
      {
        type: "text", name: "q1",
        validators: [{ type: "expression", expression: "{q1} + {q2} <= 10" }]
      },
      { type: "text", name: "q3" },
      {
        type: "text", name: "q2",
        validators: [{ type: "expression", expression: "{q1} + {q2} <= 10" }]
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  q1.value = 5;
  q2.value = 6;
  expect(q1.errors.length, "q1.errors #1").toBe(0);
  expect(q2.errors.length, "q2.errors #1").toBe(1);
  q1.value = 3;
  expect(q1.errors.length, "q1.errors #2").toBe(0);
  expect(q2.errors.length, "q2.errors #2").toBe(0);
  q1.value = 7;
  expect(q1.errors.length, "q1.errors #3").toBe(1);
  expect(q2.errors.length, "q2.errors #3").toBe(0);
  q2.value = 2;
  expect(q1.errors.length, "q1.errors #4").toBe(0);
  expect(q2.errors.length, "q2.errors #4").toBe(0);
});
test("Validation dependencies: clear errors after tryComplete, no checkErrorsMode", () => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text", name: "q1",
        validators: [{ type: "expression", expression: "{q1} + {q2} <= 10" }]
      },
      { type: "text", name: "q3" },
      {
        type: "text", name: "q2",
        validators: [{ type: "expression", expression: "{q1} + {q2} <= 10" }]
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  q1.value = 5;
  q2.value = 6;
  expect(q1.errors.length, "q1.errors #1").toBe(0);
  expect(q2.errors.length, "q2.errors #1").toBe(0);
  expect(survey.tryComplete(), "Could not complete").toBe(false);
  expect(q1.errors.length, "q1.errors #2").toBe(1);
  expect(q2.errors.length, "q2.errors #2").toBe(1);
  q1.value = 1;
  expect(q1.errors.length, "q1.errors #3").toBe(0);
  expect(q2.errors.length, "q2.errors #3").toBe(0);
});
test("Validation dependencies: questions in dynamic panel", () => {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [{
      type: "paneldynamic", name: "panel1",
      panelCount: 1,
      templateElements: [
        { type: "text", name: "q1" },
        {
          type: "text", name: "q2",
          validators: [{ type: "expression", expression: "{panel.q1} + {panel.q2} <= 10" }]
        }
      ]
    }]
  });
  const panel = survey.getQuestionByName("panel1");
  const q1 = panel.panels[0].getQuestionByName("q1");
  const q2 = panel.panels[0].getQuestionByName("q2");
  q2.value = 5;
  expect(q2.errors.length, "No error initially").toBe(0);
  q1.value = 7;
  expect(q2.errors.length, "Error: 5+7>10").toBe(1);
  q1.value = 3;
  expect(q2.errors.length, "Error cleared: 3+7<=10").toBe(0);
});
test("Validation dependencies: questions in matrix dynamic", () => {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [{
      type: "matrixdynamic", name: "matrix1",
      rowCount: 1,
      columns: [
        { name: "col1", cellType: "text" },
        {
          name: "col2", cellType: "text",
          validators: [{ type: "expression", expression: "{row.col1} + {row.col2} <= 10" }]
        }
      ]
    }]
  });
  const matrix = survey.getQuestionByName("matrix1");
  const row = matrix.visibleRows[0];
  const q1 = row.getQuestionByColumn(matrix.columns[0]);
  const q2 = row.getQuestionByColumn(matrix.columns[1]);
  q2.value = 5;
  expect(q2.errors.length, "No error initially").toBe(0);
  q1.value = 10;
  expect(q2.errors.length, "Error: 10+5>10").toBe(1);
  q1.value = 3;
  expect(q2.errors.length, "Error cleared: 3+5<=10").toBe(0);
});
test("Validation dependencies: reset on adding/removing validators", () => {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  expect(q2["getValidatorVariableNames"](), "No dependencies initially").toEqual([]);
  q2.validators.push(new ExpressionValidator("{q1} + {q2} <= 10"));
  expect(q2["getValidatorVariableNames"](), "Depends on q1 after adding validator").toEqual(["q1"]);
  q2.value = 6;
  q1.value = 7;
  expect(q2.errors.length, "Error: 7+6>10").toBe(1);
  q1.value = 3;
  expect(q2.errors.length, "Error cleared: 3+6<=10").toBe(0);
  q2.validators.splice(0, 1);
  expect(q2["getValidatorVariableNames"](), "No dependencies after removing validator").toEqual([]);
  q1.value = 7;
  expect(q2.errors.length, "No error after removing validator").toBe(0);
});
test("Validation dependencies: no validation on value change without onValueChanged mode", () => {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      {
        type: "text", name: "q2",
        validators: [{ type: "expression", expression: "{q1} + {q2} <= 10" }]
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  expect(q2["getValidatorVariableNames"](), "q2 depends on q1").toEqual(["q1"]);
  q1.value = 7;
  q2.value = 6;
  expect(q2.errors.length, "No error on q2: default mode does not validate on value change").toBe(0);
  q1.value = 3;
  expect(q2.errors.length, "Still no error on q2: no validation triggered").toBe(0);
  q1.value = 7;
  expect(q2.errors.length, "Still no error on q2: default mode ignores dependency changes").toBe(0);
  expect(survey.tryComplete(), "Could not complete: 7+6>10").toBe(false);
  expect(q2.errors.length, "q2 has error after tryComplete").toBe(1);
  q1.value = 3;
  expect(q2.errors.length, "Error cleared: dependency change clears existing error since 3+6<=10").toBe(0);
});
test("Validation dependencies: reset on changing validator expression", () => {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
      { type: "text", name: "q3" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  const q3 = survey.getQuestionByName("q3");
  const validator = new ExpressionValidator("{q1} + {q3} <= 10");
  q3.validators.push(validator);
  expect(q3["getValidatorVariableNames"](), "Depends on q1").toEqual(["q1"]);
  q1.value = 7;
  q3.value = 6;
  expect(q3.errors.length, "Error: 7+6>10").toBe(1);
  validator.expression = "{q2} + {q3} <= 10";
  expect(q3["getValidatorVariableNames"](), "Now depends on q2 after expression change").toEqual(["q2"]);
  q2.value = 3;
  expect(q3.errors.length, "Error cleared with new expression: 3+6<=10").toBe(0);
  q1.value = 100;
  expect(q3.errors.length, "No error: q1 no longer a dependency").toBe(0);
});
