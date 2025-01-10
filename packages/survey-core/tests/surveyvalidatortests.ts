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

QUnit.test(
  "Validators and isRequired in multipletext items, Bug#1055",
  function(assert) {
    var json = {
      questions: [
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
    assert.equal(
      question.hasErrors(),
      false,
      "Everything is fine, there is no errors"
    );
  }
);

QUnit.test(
  "text validator doesn't work correctly with empty text, Bug#1241",
  function(assert) {
    var json = {
      questions: [
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
      survey.currentPage.hasErrors(),
      false,
      "There is no errors, values are empty"
    );
  }
);

QUnit.test(
  "text validator doesn't work correctly with setting value to  empty text, Bug#3065",
  function(assert) {
    var json = {
      questions: [
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
    assert.equal(q.hasErrors(), false, "There is no errors, values are empty");
    survey.setValue("q1", "abc");
    assert.equal(q.isEmpty(), false, "value is not empty");
    assert.equal(q.hasErrors(), true, "There is an error");
    survey.setValue("q1", "");
    assert.equal(q.isEmpty(), true, "value is empty #2");
    assert.equal(
      q.hasErrors(),
      false,
      "There is no error, again value is empty #2"
    );
  }
);

QUnit.test("Expression validator", function(assert) {
  var json = {
    questions: [
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
  assert.equal(question.hasErrors(), true, "5 <= 3");
  question.items[0].value = 3;
  question.items[1].value = 5;
  assert.equal(question.hasErrors(), false, "5 >= 3");
});

QUnit.test("Expression validator #2", function(assert) {
  var json = {
    questions: [
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

QUnit.test("validator.isAsync", function(assert) {
  function asyncFunc(params: any): any {
    this.returnResult(params[0] * 3);
    return false;
  }
  FunctionFactory.Instance.register("asyncFunc", asyncFunc, true);

  var regValidator = new RegexValidator("^0*(?:[2-9]|[1-9]dd*)$");
  assert.equal(regValidator.isAsync, false, "Regex is not async validator");
  var expValidator = new ExpressionValidator();
  expValidator.expression = "age({q1}) + {q2}";
  assert.equal(
    expValidator.isAsync,
    false,
    "There is no async function in expression"
  );
  expValidator.expression = "asyncFunc({q1}) + {q2}";
  assert.equal(
    expValidator.isAsync,
    true,
    "There is an async function in expression"
  );

  FunctionFactory.Instance.unregister("asyncFunc");
});

QUnit.test("question with async validators", function(assert) {
  var returnResult1: (res: any) => void;
  var returnResult2: (res: any) => void;
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
  assert.equal(question.validators[1].isAsync, true, "The validator is async");
  var hasErrorsCounter = 0;
  question.onCompletedAsyncValidators = (hasErrors: boolean) => {
    if (hasErrors) hasErrorsCounter++;
  };
  assert.equal(
    question.isRunningValidators,
    false,
    "We do not run validators yet"
  );
  question.hasErrors();
  assert.equal(question.errors.length, 1, "There is one error");
  assert.equal(
    question.isRunningValidators,
    true,
    "func1 and func2 are not completed"
  );
  assert.equal(hasErrorsCounter, 0, "onCompletedAsyncValidators is not called");
  returnResult1(11);
  assert.equal(question.isRunningValidators, true, "func2 is not completed");
  assert.equal(hasErrorsCounter, 0, "onCompletedAsyncValidators is not called");
  returnResult2(22);
  assert.equal(
    hasErrorsCounter,
    1,
    "onCompletedAsyncValidators is  called one time"
  );
  assert.equal(question.errors.length, 3, "There are three errors now");
  assert.equal(
    question.isRunningValidators,
    false,
    "func1 and func2 are completed"
  );

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
      if(i >= asynList.length) i = 0;
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
