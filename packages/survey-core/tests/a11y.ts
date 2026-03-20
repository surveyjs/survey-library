import { Question } from "../src/question";
import { ComponentCollection } from "../src/question_custom";
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
      elements: [
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
      elements: [
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
      elements: [
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
  "a11y: aria-describedbby: empty and hidden description",
  function(assert) {
    var json = {
      elements: [
        {
          type: "text",
          title: "Title",
          name: "q1"
        },
        {
          type: "text",
          title: "Title",
          description: "Description",
          name: "q2"
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question1 = survey.getQuestionByName("q1");
    assert.equal(question1.a11y_input_ariaDescribedBy, null, "aria-describedby is null");
    var question2 = survey.getQuestionByName("q2");
    assert.equal(question2.a11y_input_ariaDescribedBy, question2.id + "_ariaDescription", "aria-describedby is not empty");
    question2.descriptionLocation = "hidden";
    assert.equal(question2.a11y_input_ariaDescribedBy, null, "aria-describedby is null");
  }
);

QUnit.test(
  "a11y: aria-invalid",
  function(assert) {
    var question = new Question("q1");
    question.isRequired = true;

    question.validate();
    assert.equal(question.ariaInvalid, "true", "aria-invalid is TRUE because we have errors");

    question.value = "test";
    question.validate();
    assert.equal(question.ariaInvalid, "false", "aria-invalid is FALSE because we don't have any errors");
  }
);

QUnit.test(
  "a11y: aria-errormessage",
  function(assert) {
    var question = new Question("q1");
    question.isRequired = true;

    question.validate();
    assert.equal(question.ariaErrormessage, question.id + "_errors", "aria-errormessage is NOT NULL because we have errors");

    question.value = "test";
    question.validate();
    assert.equal(question.ariaErrormessage, null, "aria-errormessage is NULL because we don't have any errors");
  }
);

QUnit.test(
  "a11y: aria-labelledby",
  function(assert) {
    var json = {
      elements: [
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

QUnit.test("a11y: aria-labelledby customquestion Bug#11049", (assert) => {

  ComponentCollection.Instance.add({
    name: "text2",
    defaultQuestionTitle: "Currency",
    questionJSON: {
      "type": "text",
    }
  });

  const config = {
    elements: [
      {
        type: "text2",
        name: "q1",
        title: "Currency (specialized)",
      }
    ]
  };

  var survey = new SurveyModel(config);
  var q1 = survey.getQuestionByName("q1");

  assert.equal(q1.ariaTitleId, q1.contentQuestion.ariaTitleId);
  assert.equal(q1.ariaDescriptionId, q1.contentQuestion.ariaDescriptionId);
  assert.equal(q1.commentId, q1.contentQuestion.commentId);
});