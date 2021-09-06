import { QuestionCheckboxModel } from "../../src/question_checkbox";

export default QUnit.module("a11y: checkbox");

QUnit.test(
  "a11y: role",
  function(assert) {
    var question = new QuestionCheckboxModel("q1");
    assert.equal(question.a11y.ariaRole, "group", "role is 'group' for checkbox");
  }
);