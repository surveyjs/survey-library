import { Question } from "../src/question";
import { SurveyModel } from "../src/survey";

export default QUnit.module("a11y");

QUnit.test(
  "a11y: aria-required",
  function(assert) {
    var question = new Question("q1");
    question.isRequired = true;
    assert.equal(question.ariaRequired, "true", "aria-required is true");

    question.isRequired = false;
    assert.equal(question.ariaRequired, "false", "aria-required is false");
  }
);

QUnit.test(
  "a11y: aria-label",
  function(assert) {
    var json = {
      questions: [
        {
          type: "text",
          title: "Title",
          name: "q1",
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");
    assert.equal(question.ariaLabel, "Title", "aria-label is correct");
  }
);

QUnit.test(
  "a11y: aria-invalid",
  function(assert) {
    var question = new Question("q1");
    question.isRequired = true;

    question.hasErrors();
    assert.equal(question.ariaInvalid, "true", "aria-invalid is TRUE because we have errors");

    question.value = "test";
    question.hasErrors();
    assert.equal(question.ariaInvalid, "false", "aria-invalid is FALSE because we don't have any errors");
  }
);

QUnit.test(
  "a11y: aria-describedby",
  function(assert) {
    var question = new Question("q1");
    question.isRequired = true;

    question.hasErrors();
    assert.equal(question.ariaDescribedBy, question.id + "_errors", "aria-describedby is NOT NULL because we have errors");

    question.value = "test";
    question.hasErrors();
    assert.equal(question.ariaDescribedBy, null, "aria-describedby is NULL because we don't have any errors");
  }
);