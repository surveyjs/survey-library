import { SurveyModel } from "../src/survey";
import { QuestionCommentModel } from "../src/question_comment";

export default QUnit.module("Comment question");

QUnit.test("A Comment displays undefined when resetting the value", function (assert) {
  let json = {
    "elements": [
      {
        "type": "comment",
        "name": "billing-address",
        "title": "Billing address",
        "rows": 2
      },
      {
        "type": "boolean",
        "name": "shipping-same-as-billing",
        "title": "Shipping address same as billing",
        "defaultValue": "true"
      },
      {
        "type": "comment",
        "name": "shipping-address",
        "title": "Shipping address",
        "enableIf": "{shipping-same-as-billing} = false",
        "resetValueIf": "{shipping-same-as-billing} = false",
        "setValueIf": "{shipping-same-as-billing} = true",
        "setValueExpression": "{billing-address}",
        "rows": 2
      }
    ],
    "showQuestionNumbers": "off",
    "textUpdateMode": "onTyping"
  };
  let survey = new SurveyModel(json);
  let comment1 = survey.getQuestionByName("billing-address") as QuestionCommentModel;
  let comment2 = survey.getQuestionByName("shipping-address") as QuestionCommentModel;
  let boolQuestion = survey.getQuestionByName("shipping-same-as-billing");
  const textArea1 = document.createElement("textarea");
  const textArea2 = document.createElement("textarea");
  comment1.textAreaModel.setElement(textArea1);
  comment2.textAreaModel.setElement(textArea2);

  assert.equal(comment1.value, undefined, "commnet 1 value #1");
  assert.equal(comment2.value, undefined, "commnet 2 value #1");
  assert.equal(boolQuestion.value, true, "boolQuestion value #1");
  assert.equal(textArea1.value, "", "textArea 1 value #1");
  assert.equal(textArea2.value, "", "textArea 2 value #1");

  comment1.value = "test";
  assert.equal(comment1.value, "test", "commnet 1 value #2");
  assert.equal(comment2.value, "test", "commnet 2 value #2");
  assert.equal(boolQuestion.value, true, "boolQuestion value #2");
  assert.equal(textArea1.value, "test", "textArea 1 value #2");
  assert.equal(textArea2.value, "test", "textArea 2 value #2");

  boolQuestion.value = false;
  assert.equal(comment1.value, "test", "commnet 1 value #3");
  assert.equal(comment2.value, undefined, "commnet 2 value #3");
  assert.equal(boolQuestion.value, false, "boolQuestion value #3");
  assert.equal(textArea1.value, "test", "textArea 1 value #3");
  assert.equal(textArea2.value, "", "textArea 2 value #3");

  textArea1.remove();
  textArea2.remove();
});
QUnit.test("The text length validation error occurs when the minLength validator is enabled and 'allowDigits' is false Bug#8988", function(assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "comment", name: "q1",
        validators: [
          { type: "text", minLength: 5,
            allowDigits: false
          }
        ]
      }
    ]
  });
  const q1 = <QuestionCommentModel>survey.getQuestionByName("q1");
  q1.value = "abcdedf";
  survey.validate(true);
  assert.equal(q1.errors.length, 0, "No errors");
  q1.value = "123456";
  survey.validate(true);
  assert.equal(q1.errors.length, 1, "There are errors");
  assert.equal(q1.errors[0].text, "Numbers are not allowed.", "No digits allowing");
});