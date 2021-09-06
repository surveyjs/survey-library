import { Question } from "../../src/question";

export default QUnit.module("a11y: question");

QUnit.test(
  "a11y: aria-invalid",
  function(assert) {
    var question = new Question("q1");
    question.isRequired = true;

    question.hasErrors();
    assert.equal(question.a11y.ariaInvalid, true, "aria-invalid is TRUE because we have errors");

    question.value = "test";
    question.hasErrors();
    assert.equal(question.a11y.ariaInvalid, false, "aria-invalid is FALSE because we don't have any errors");
  }
);

QUnit.test(
  "a11y: aria-describedby",
  function(assert) {
    var question = new Question("q1");
    question.isRequired = true;

    question.hasErrors();
    assert.equal(question.a11y.ariaDescribedBy, question.id + "_errors", "aria-describedby is NOT NULL because we have errors");

    question.value = "test";
    question.hasErrors();
    assert.equal(question.a11y.ariaDescribedBy, null, "aria-describedby is NULL because we don't have any errors");
  }
);

QUnit.test(
  "a11y: aria-labelledby",
  function(assert) {
    var question = new Question("q1");

    question.titleLocation = "hidden";
    assert.equal(question.a11y.ariaLabelledby, null, "aria-labelledby is NULL because question have no title");

    question.titleLocation = "left";
    assert.equal(question.a11y.ariaLabelledby, question.a11y.ariaTitleId, "aria-labelledby is NOT NULL because question have title");
  }
);

QUnit.test(
  "a11y: role",
  function(assert) {
    var question = new Question("q1");
    assert.equal(question.a11y.ariaRole, null, "role is NULL for base question");
  }
);