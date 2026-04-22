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

export default QUnit.module("Validators");

QUnit.test("Numeric validator", function(assert) {
  var validator = new NumericValidator();
  assert.notEqual(
    validator.validate("s5").error,
    null,
    "Could not convert to numeric"
  );
  assert.equal(validator.validate(5), null, "There are no limits (non-zero)");
  assert.equal(validator.validate(0), null, "There are no limits (zero)");
  assert.equal(
    validator.validate("5").value,
    5,
    "Convert to numeric (non-zero)"
  );
  assert.equal(
    validator.validate("5").error,
    null,
    "There is no error (non-zero)"
  );
  assert.equal(validator.validate("0").value, 0, "Convert to numeric (zero)");
  assert.equal(validator.validate("0").error, null, "There is no error (zero)");

  validator.minValue = 10;
  validator.maxValue = 20;
  assert.notEqual(
    validator.validate(5).error,
    null,
    "Value is too low. Limits are not 0."
  );
  assert.notEqual(
    validator.validate(25).error,
    null,
    "Value is too high. Limits are not 0."
  );
  assert.equal(
    validator.validate("15").error,
    null,
    "Value is between minValue and maxValue. Limits are not 0."
  );
  assert.equal(
    validator.validate(15),
    null,
    "Value is between minValue and maxValue. Return no errors. Limits are not 0."
  );

  validator.minValue = 0;
  validator.maxValue = 20;
  assert.notEqual(
    validator.validate(-1).error,
    null,
    "Value is too low. Low limit is 0."
  );
  assert.notEqual(
    validator.validate(25).error,
    null,
    "Value is too high. Low limit is 0."
  );
  assert.equal(
    validator.validate("15").error,
    null,
    "Value is between minValue and maxValue. Low limit is 0."
  );
  assert.equal(
    validator.validate(15),
    null,
    "Value is between minValue and maxValue. Return no errors. Low limit is 0."
  );

  validator.minValue = -20;
  validator.maxValue = 0;
  assert.notEqual(
    validator.validate(-21).error,
    null,
    "Value is too low. High limit is 0."
  );
  assert.notEqual(
    validator.validate(1).error,
    null,
    "Value is too high. High limit is 0."
  );
  assert.equal(
    validator.validate("-5").error,
    null,
    "Value is between minValue and maxValue. High limit is 0."
  );
  assert.equal(
    validator.validate(-5),
    null,
    "Value is between minValue and maxValue. Return no errors. High limit is 0."
  );

  validator.minValue = 0;
  validator.maxValue = 100;
  assert.equal(validator.validate("0.1").error, null, "0.1 > 0");
  assert.equal(validator.validate("1.1").error, null, "1.1 > 0");
  assert.equal(validator.validate("0,1").error, null, "0,1 > 0");
  assert.equal(validator.validate("1,1").error, null, "1,1 > 0");
  assert.equal(validator.validate("99,1").error, null, "99,1 < 100");
  assert.notEqual(validator.validate("100,1").error, null, "100,1 > 100");
});

QUnit.test("Email validator", function(assert) {
  var validator = new EmailValidator();
  assert.equal(
    validator.validate("my@mail.com"),
    null,
    "Could convert the correct e-mail"
  );
  assert.notEqual(
    validator.validate("@mail.com").error,
    null,
    "Could convert the incorrect correct e-mail"
  );
});

QUnit.test("Text validator", function(assert) {
  var validator = new TextValidator();
  assert.equal(validator.validate(""), null, "Empty string");
  validator.minLength = 1;
  validator.maxLength = 5;
  assert.equal(validator.validate(""), null, "Empty string");
  assert.equal(validator.validate("a"), null, "Shorter string");
  assert.equal(validator.validate("abcde"), null, "Five letter string");
  assert.notEqual(validator.validate("abcdef"), null, "Longer string");
  assert.equal(validator.validate("abc12"), null, "Not just text");
  validator.allowDigits = false;
  assert.notEqual(validator.validate("abc12"), null, "Not just text");
  assert.equal(validator.validate("abc."), null, "Just text");
});

QUnit.test("Text validator calls onPropertyValueChangedCallback", function(
  assert
) {
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
  assert.equal(validator.minLength, 11, "minLength loaded");
  assert.equal(validator.maxLength, 15, "maxLength loaded");
  validator.minLength = 1;
  assert.equal(changes["minLength"], true, "minLength changed");
  validator.maxLength = 5;
  assert.equal(changes["maxLength"], true, "maxLength changed");
  validator.allowDigits = false;
  assert.equal(changes["allowDigits"], true, "allowDigits changed");
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

QUnit.test("Support camel names in validators, Bug#994", function(assert) {
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
  assert.equal(qSame.validators.length, 1, "same case - validtor is here");
  assert.equal(qLow.validators.length, 1, "low case - validtor is here");
  assert.equal(qUpper.validators.length, 1, "upper case - validtor is here");
});
QUnit.test("Support camel names in validators, Bug#994", function(assert) {
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
  assert.equal(q1.errors.length, 1, "There is an error");
  q1.value = "some CamelCase text";
  assert.equal(q1.errors.length, 0, "There is no error");
});
QUnit.test(
  "Validators and isRequired in multipletext items, Bug#1055",
  function(assert) {
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
    assert.equal(question.validate(), true, "Everything is fine, there is no errors");
  }
);

QUnit.test(
  "text validator doesn't work correctly with empty text, Bug#1241",
  function(assert) {
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
    assert.equal(
      survey.currentPage.validate(),
      true,
      "There is no errors, values are empty"
    );
  }
);

QUnit.test(
  "text validator doesn't work correctly with setting value to  empty text, Bug#3065",
  function(assert) {
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
    assert.equal(q.isEmpty(), true, "value is empty");
    assert.equal(q.validate(), true, "There is no errors, values are empty");
    survey.setValue("q1", "abc");
    assert.equal(q.isEmpty(), false, "value is not empty");
    assert.equal(q.validate(), false, "There is an error");
    survey.setValue("q1", "");
    assert.equal(q.isEmpty(), true, "value is empty #2");
    assert.equal(q.validate(), true, "There is no error, again value is empty #2");
  }
);

QUnit.test("Expression validator", function(assert) {
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
  assert.equal(question.validate(), false, "5 <= 3");
  question.items[0].value = 3;
  question.items[1].value = 5;
  assert.equal(question.validate(), true, "5 >= 3");
});

QUnit.test("Expression validator #2", function(assert) {
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
  assert.equal(
    survey.isCurrentPageHasErrors,
    true,
    "comment should not be empty"
  );
  survey.setValue("comment", "some text");
  assert.equal(survey.isCurrentPageHasErrors, false, "comment has text now");
  survey.clearValue("comment");
  assert.equal(survey.isCurrentPageHasErrors, true, "comment is empty again");
  survey.setValue("satisfaction", 5);
  assert.equal(survey.isCurrentPageHasErrors, false, "satisfaction is low");
});

QUnit.test("ExceedSizeError", function(assert) {
  var error = new ExceedSizeError(102400);
  assert.equal(error.getText(), "The file size should not exceed 100 KB.");
  assert.equal(error.locText.text, "The file size should not exceed 100 KB.");
});

QUnit.test("ExceedSizeError uses localized file size units", function(assert) {
  const enStrings = surveyLocalization.getLocaleStrings("en");
  const prevValue = enStrings.fileSizeUnits;
  enStrings.fileSizeUnits = "tavua, kt, Mt, Gt, Tt";
  var error = new ExceedSizeError(102400);
  assert.equal(error.getText(), "The file size should not exceed 100 kt.");
  enStrings.fileSizeUnits = prevValue;
});

QUnit.test("MinRowCountError", function(assert) {
  var error = new MinRowCountError(1);
  assert.equal(error.getText(), "Please fill in at least 1 row(s).");
  assert.equal(error.locText.text, "Please fill in at least 1 row(s).");
});

QUnit.test("Regex number validator, Bug#1775", function(assert) {
  var validator = new RegexValidator("^0*(?:[2-9]|[1-9]dd*)$");
  validator.text = "More than 0";
  assert.equal(validator.validate(0).error.text, "More than 0", "0 give error");
  assert.equal(validator.validate(2), null, "Parse correctly 2");
  assert.equal(validator.validate(null), null, "Parse correctly null");
});
QUnit.test("Regex case insensitive, Bug#7620", function(assert) {
  const validator = new RegexValidator(".+@something.com");
  validator.insensitive = true;
  validator.text = "Error";
  assert.equal(validator.validate("abc").error.text, "Error", "#1");
  assert.equal(validator.validate("abc@something1.com").error.text, "Error", "#2");
  assert.equal(validator.validate("abc@something.com"), null, "#3");
  assert.equal(validator.validate("abc@SomeThing.com"), null, "#4");
});
QUnit.test("Regex load caseInsensitve", function(assert) {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [{ type: "text", name: "q", validators: [{ type: "regex", regex: ".+@something.com", caseInsensitive: true }] }]
  });
  const q = survey.getQuestionByName("q");
  assert.equal(q.errors.length, 0, "#1");
  q.value = "abc";
  assert.equal(q.errors.length, 1, "#2");
  q.value = "abc@something1.com";
  assert.equal(q.errors.length, 1, "#3");
  q.value = "abc@something.com";
  assert.equal(q.errors.length, 0, "#4");
  q.value = "abc@SomeThing.com";
  assert.equal(q.errors.length, 0, "#5");
});
QUnit.test("survey.onCreateRegexValidator, Issue#10766", function(assert) {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [{ type: "text", name: "q", validators: [{ type: "regex", regex: ".+@something." }] }]
  });
  survey.onCreateRegexValidator.add((sender, options) => {
    assert.equal(options.validator.regex, ".+@something.", "check options.validator");
    options.pattern = options.pattern + "com";
    options.flags = "i";
  });
  const q = survey.getQuestionByName("q");
  assert.equal(q.errors.length, 0, "#1");
  q.value = "abc";
  assert.equal(q.errors.length, 1, "#2");
  q.value = "abc@something1.com";
  assert.equal(q.errors.length, 1, "#3");
  q.value = "abc@something.com";
  assert.equal(q.errors.length, 0, "#4");
  q.value = "abc@SomeThing.com";
  assert.equal(q.errors.length, 0, "#5");
});

QUnit.test("question with async validators", function(assert) {
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
  assert.equal(question.isRunningValidators, false, "We do not run validators yet");
  assert.equal(question.validate(), false, "There is an error");
  assert.equal(question.errors.length, 1, "There is one error");
  assert.equal(question.isRunningValidators, true, "func1 and func2 are not completed");
  returnResult1(11);
  assert.equal(question.isRunningValidators, true, "func2 is not completed");
  returnResult2(22);
  assert.equal(question.errors.length, 3, "There are three errors now");
  assert.equal(question.isRunningValidators, false, "func1 and func2 are completed");

  FunctionFactory.Instance.unregister("asyncFunc1");
  FunctionFactory.Instance.unregister("asyncFunc2");
});
QUnit.test("settings.readOnly.enableValidation option", function(assert) {
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
  assert.equal(q1.errors.length, 0, "No errors");
  settings.readOnly.enableValidation = true;
  survey.validate(true);
  assert.equal(q1.errors.length, 1, "There is an error");
  settings.readOnly.enableValidation = false;
});
QUnit.test("Async expression validators creates several errors", function(assert) {
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
  assert.equal(asynList.length, 2, "#1.0");
  callAsyncList();
  assert.equal(q1.errors.length, 1, "#1.1");
  assert.equal(q2.errors.length, 1, "#1.2");
  q1.value = "aa";
  callAsyncList();
  assert.equal(q1.errors.length, 1, "#2.1");
  assert.equal(q2.errors.length, 1, "#2.2");
  q2.value = "bb";
  callAsyncList();
  assert.equal(q1.errors.length, 1, "#3.1");
  assert.equal(q2.errors.length, 1, "#3.2");
});
QUnit.test("expression validators & survey.onExpressionRunning, Bug#10294", function(assert) {
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
  assert.equal(counter, 0, "#1");
  allow = true;
  survey.validate(true);
  assert.equal(counter, 2, "#2");
});
QUnit.test("SurveyError.getCssIcon, Issue#9085", function(assert) {
  const surveyError = new SurveyError("ErrorText");
  assert.equal(surveyError.getCssIcon(undefined), undefined, "getCssIcon #1");
  assert.equal(surveyError.getCssIcon({}), undefined, "getCssIcon #2");
  assert.equal(surveyError.getCssIcon({ error: {} }), undefined, "getCssIcon #3");
  assert.equal(surveyError.getCssIcon({ error: { icon: "icon" } }), "icon", "getCssIcon #4");
  assert.equal(surveyError.getCssIcon({ error: { icon: "icon", warningIcon: "warningIcon" } }), "icon", "getCssIcon #4.1");
  surveyError.notificationType = "warning";
  assert.equal(surveyError.getCssIcon({ error: { icon: "icon" } }), "icon", "getCssIcon #5");
  assert.equal(surveyError.getCssIcon({ error: { warningIcon: "warningIcon", icon: "warningIcon" } }), "warningIcon", "getCssIcon #6");
  assert.equal(surveyError.getCssIcon({ error: { icon: "icon", warningIcon: "warningIcon" } }), "warningIcon", "getCssIcon #7");
  assert.equal(surveyError.getCssIcon(undefined), undefined, "getCssIcon #8");
  assert.equal(surveyError.getCssIcon({}), undefined, "getCssIcon #9");
  assert.equal(surveyError.getCssIcon({ error: {} }), undefined, "getCssIcon #10");
});
QUnit.test("SurveyError.notificationType, Issue#9085", function(assert) {
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
  assert.equal(q1.errors.length, 1, "There is an error, q1");
  assert.equal(q1.errors[0].isWarning, true, "isWarning property is set true, q1");
  assert.equal(q2.errors.length, 1, "There is an error, q2");
  assert.equal(q2.errors[0].isWarning, false, "isWarning property is set false, q2");
});
QUnit.test("SurveyError.isWarning & validate returns, Issue#9085", function(assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", validators: [{ type: "numeric", maxValue: 3, notificationType: "info" }, { type: "numeric", maxValue: 5, notificationType: "warning" }, { type: "numeric", maxValue: 10 }] }
    ],
  });
  const q1 = <QuestionTextModel>survey.getQuestionByName("q1");
  q1.value = 4;
  assert.equal(survey.validate(true), true, "One error as info");
  assert.equal(q1.errors.length, 1, "There is no error, q1");
  assert.equal(q1["hasCssError"](), false, "There is no css error, q1");
  assert.equal(q1["hasCssError"](true), true, "There is a info, q1");
  q1.value = 7;
  assert.equal(survey.validate(true), true, "One error as warning");
  assert.equal(q1.errors.length, 2, "There is no error, q1");
  assert.equal(q1["hasCssError"](), false, "There is no css error, q1");
  assert.equal(q1["hasCssError"](true), true, "There is a warning, q1");
  q1.value = 12;
  assert.equal(q1.errors.length, 3, "There is no error, q1");
  assert.equal(survey.validate(true), false, "One error as warning and one as error");
  assert.equal(q1["hasCssError"](), true, "There is css error, q1");
});
QUnit.test("SurveyError.notificationType & only the strongest type rendered, Issue#9085", function(assert) {
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
  assert.equal(q1.errors.length, 5, "3 errors (one hidden), 1 warning, 1 info");
  assert.equal(q1.renderedErrors.length, 2, "2 errors");
  assert.equal(q1.currentNotificationType, "error", "rendrered message type is 'error'");
  q1.errors = [];

  q1.errors.push(createError("warning"));
  q1.errors.push(createError("info"));
  assert.equal(q1.errors.length, 2, "1 warning, 1 info");
  assert.equal(q1.renderedErrors.length, 1, "1 warning");
  assert.equal(q1.currentNotificationType, "warning", "rendrered message type is 'warning'");
  q1.errors = [];

  q1.errors.push(createError("info"));
  assert.equal(q1.errors.length, 1, "1 info");
  assert.equal(q1.renderedErrors.length, 1, "1 info");
  assert.equal(q1.currentNotificationType, "info", "rendrered message type is 'info'");
  q1.errors = [];

  q1.errors.push(createError("info", false));
  assert.equal(q1.renderedErrors.length, 0, "no rendered errors");
  assert.equal(q1.currentNotificationType, "", "no rendrered message type");
});
QUnit.test("Expression validator with empty survey, Bug#10416", function(assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1", validators: [{ type: "expression" }] }
    ]
  });
  assert.equal(survey.validate(true), true, "There is no error");
  survey.tryComplete();
  assert.equal(survey.state, "completed", "The survey is completed");
});

QUnit.test("Validation dependencies: simple case, endDate depends on startDate", function(assert) {
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
  assert.deepEqual(endDate["getValidatorVariableNames"](), ["startDate", "startDate2"], "endDate depends on startDate and startDate2");
  survey.setValue("startDate", "2024-01-01");
  survey.setValue("endDate", "2025-06-01");
  assert.equal(endDate.errors.length, 1, "Error: more than 1 year");
  survey.setValue("startDate", "2025-03-01");
  assert.equal(endDate.errors.length, 0, "Error cleared: within 1 year again");
});
QUnit.test("Validation dependencies: add and clear errors", function(assert) {
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
  assert.equal(q2.errors.length, 1, "Error: 7+5>10");
  q1.value = 4;
  assert.equal(q2.errors.length, 0, "Error cleared: 4+5<=10");
});
QUnit.test("Validation dependencies: both questions have expression validators", function(assert) {
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
  assert.equal(q1.errors.length, 0, "q1.errors #1");
  assert.equal(q2.errors.length, 1, "q2.errors #1");
  q1.value = 3;
  assert.equal(q1.errors.length, 0, "q1.errors #2");
  assert.equal(q2.errors.length, 0, "q2.errors #2");
  q1.value = 7;
  assert.equal(q1.errors.length, 1, "q1.errors #3");
  assert.equal(q2.errors.length, 0, "q2.errors #3");
  q2.value = 2;
  assert.equal(q1.errors.length, 0, "q1.errors #4");
  assert.equal(q2.errors.length, 0, "q2.errors #4");
});
QUnit.test("Validation dependencies: clear errors after tryComplete, no checkErrorsMode", function(assert) {
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
  assert.equal(q1.errors.length, 0, "q1.errors #1");
  assert.equal(q2.errors.length, 0, "q2.errors #1");
  assert.equal(survey.tryComplete(), false, "Could not complete");
  assert.equal(q1.errors.length, 1, "q1.errors #2");
  assert.equal(q2.errors.length, 1, "q2.errors #2");
  q1.value = 1;
  assert.equal(q1.errors.length, 0, "q1.errors #3");
  assert.equal(q2.errors.length, 0, "q2.errors #3");
});
QUnit.test("Validation dependencies: questions in dynamic panel", function(assert) {
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
  assert.equal(q2.errors.length, 0, "No error initially");
  q1.value = 7;
  assert.equal(q2.errors.length, 1, "Error: 5+7>10");
  q1.value = 3;
  assert.equal(q2.errors.length, 0, "Error cleared: 3+7<=10");
});
QUnit.test("Validation dependencies: questions in matrix dynamic", function(assert) {
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
  assert.equal(q2.errors.length, 0, "No error initially");
  q1.value = 10;
  assert.equal(q2.errors.length, 1, "Error: 10+5>10");
  q1.value = 3;
  assert.equal(q2.errors.length, 0, "Error cleared: 3+5<=10");
});
QUnit.test("Validation dependencies: reset on adding/removing validators", function(assert) {
  const survey = new SurveyModel({
    checkErrorsMode: "onValueChanged",
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.deepEqual(q2["getValidatorVariableNames"](), [], "No dependencies initially");
  q2.validators.push(new ExpressionValidator("{q1} + {q2} <= 10"));
  assert.deepEqual(q2["getValidatorVariableNames"](), ["q1"], "Depends on q1 after adding validator");
  q2.value = 6;
  q1.value = 7;
  assert.equal(q2.errors.length, 1, "Error: 7+6>10");
  q1.value = 3;
  assert.equal(q2.errors.length, 0, "Error cleared: 3+6<=10");
  q2.validators.splice(0, 1);
  assert.deepEqual(q2["getValidatorVariableNames"](), [], "No dependencies after removing validator");
  q1.value = 7;
  assert.equal(q2.errors.length, 0, "No error after removing validator");
});
QUnit.test("Validation dependencies: no validation on value change without onValueChanged mode", function(assert) {
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
  assert.deepEqual(q2["getValidatorVariableNames"](), ["q1"], "q2 depends on q1");
  q1.value = 7;
  q2.value = 6;
  assert.equal(q2.errors.length, 0, "No error on q2: default mode does not validate on value change");
  q1.value = 3;
  assert.equal(q2.errors.length, 0, "Still no error on q2: no validation triggered");
  q1.value = 7;
  assert.equal(q2.errors.length, 0, "Still no error on q2: default mode ignores dependency changes");
  assert.equal(survey.tryComplete(), false, "Could not complete: 7+6>10");
  assert.equal(q2.errors.length, 1, "q2 has error after tryComplete");
  q1.value = 3;
  assert.equal(q2.errors.length, 0, "Error cleared: dependency change clears existing error since 3+6<=10");
});
QUnit.test("Validation dependencies: reset on changing validator expression", function(assert) {
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
  assert.deepEqual(q3["getValidatorVariableNames"](), ["q1"], "Depends on q1");
  q1.value = 7;
  q3.value = 6;
  assert.equal(q3.errors.length, 1, "Error: 7+6>10");
  validator.expression = "{q2} + {q3} <= 10";
  assert.deepEqual(q3["getValidatorVariableNames"](), ["q2"], "Now depends on q2 after expression change");
  q2.value = 3;
  assert.equal(q3.errors.length, 0, "Error cleared with new expression: 3+6<=10");
  q1.value = 100;
  assert.equal(q3.errors.length, 0, "No error: q1 no longer a dependency");
});
