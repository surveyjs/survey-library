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
          titleLocation: "hidden"
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");
    assert.equal(question.a11y_input_ariaLabel, "Title", "aria-label is correct");
  }
);

QUnit.test(
  "a11y: aria-labelledby",
  function(assert) {
    var json = {
      questions: [
        {
          type: "text",
          title: "Title",
          name: "q1"
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");
    assert.equal(question.a11y_input_ariaLabel, null, "aria-label does not exist");
    assert.equal(question.a11y_input_ariaLabelledBy.indexOf("_ariaTitle") !== -1, true, "aria-labelledby is correct");
  }
);

QUnit.test(
  "a11y: aria-describedbby",
  function(assert) {
    var json = {
      questions: [
        {
          type: "text",
          title: "Title",
          description: "Description",
          name: "q1"
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");
    assert.equal(question.a11y_input_ariaDescribedBy.indexOf("_ariaDescription") !== -1, true, "aria-describedbby is correct");
  }
);

QUnit.test(
  "a11y: aria-describedbby: empty description",
  function(assert) {
    var json = {
      questions: [
        {
          type: "text",
          title: "Title",
          name: "q1"
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");
    assert.equal(question.a11y_input_ariaDescribedBy, null, "aria-describedbby is null");
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
  "a11y: aria-errormessage",
  function(assert) {
    var question = new Question("q1");
    question.isRequired = true;

    question.hasErrors();
    assert.equal(question.ariaErrormessage, question.id + "_errors", "aria-errormessage is NOT NULL because we have errors");

    question.value = "test";
    question.hasErrors();
    assert.equal(question.ariaErrormessage, null, "aria-errormessage is NULL because we don't have any errors");
  }
);

QUnit.test(
  "a11y: aria-labelledby",
  function(assert) {
    var json = {
      questions: [
        {
          type: "radiogroup",
          choices: [1, 2, 3],
          title: "Title",
          name: "q1",
          isRequired: true
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = survey.getQuestionByName("q1");

    assert.equal(question.isNewA11yStructure, true, "new a11y structure");

    assert.equal(question.ariaLabel, null, "old aria-label is null");
    assert.equal(question.ariaRole, null, "old aria-role is null");
    assert.equal(question.ariaRequired, null, "old aria-required is null");
    assert.equal(question.ariaInvalid, null, "old aria-invalid is null");
    assert.equal(question.ariaLabelledBy, null, "old aria-labelledby is null");
    assert.equal(question.ariaExpanded, null, "old aria-expanded is null");
    assert.equal(question.ariaErrormessage, null, "old aria-errormessage is null");

    assert.equal(question.a11y_input_ariaLabel, null, "aria-label does not exist because we have a title");
    assert.equal(question.a11y_input_ariaLabelledBy.indexOf("_ariaTitle") !== -1, true, "aria-labelledby is correct");
    assert.equal(question.a11y_input_ariaRole, "radiogroup", "aria-role is radiogroup");
    assert.equal(question.a11y_input_ariaRequired, "true", "aria-required is true");
    assert.equal(question.a11y_input_ariaInvalid, "false", "aria-invalid is false");
    assert.equal(question.a11y_input_ariaExpanded, null, "aria-expanded is null");
    assert.equal(question.a11y_input_ariaErrormessage, null, "aria-errormessage is null");
  }
);