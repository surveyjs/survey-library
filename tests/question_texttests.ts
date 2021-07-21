import { QuestionTextModel } from "../src/question_text";
import { QuestionCommentModel } from "../src/question_comment";
import { SurveyModel } from "../src/survey";

QUnit.test("check dropdown disabled class", function(assert) {
  var json = {
    questions: [
      {
        name: "q1",
        type: "text",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const question = <QuestionTextModel>survey.getAllQuestions()[0];
  question.cssClasses.controlDisabled = "sv_q_text_disabled";
  assert.ok(question.getControlClass().indexOf("sv_q_text_disabled") == -1);
  question.readOnly = true;
  assert.ok(question.getControlClass().indexOf("sv_q_text_disabled") != -1);
});
QUnit.test("Test renderedPlaceHolder", function(assert) {
  var json = {
    questions: [
      {
        type: "text",
        name: "q1",
      },
      {
        type: "comment",
        placeHolder: "comment_2",
        name: "q2",
      },
      {
        type: "text",
        placeHolder: "text_3",
        readOnly: true,
        name: "q3",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionTextModel>survey.getAllQuestions()[0];
  const q2 = <QuestionCommentModel>survey.getAllQuestions()[1];
  const q3 = <QuestionTextModel>survey.getAllQuestions()[2];
  assert.notOk(q1.renderedPlaceHolder, "q1, there is no placeHolder");
  assert.equal(q2.renderedPlaceHolder, "comment_2", "q2 has placeHolder");
  assert.notOk(q3.renderedPlaceHolder, "q3, question is readOnly");
  q2.readOnly = true;
  assert.notOk(q2.renderedPlaceHolder, "q2, question is readOnly");
  q3.readOnly = false;
  assert.equal(q3.renderedPlaceHolder, "text_3", "q3 is not readOnly any more");
  q1.placeHolder = "text_1";
  assert.equal(q1.renderedPlaceHolder, "text_1", "q1 has placeHolder now");
  q1.inputType = "range";
  assert.notOk(q1.renderedPlaceHolder, "q1 has inputType range");
  q1.inputType = "text";
  assert.equal(q1.renderedPlaceHolder, "text_1", "q1 has inputType text");
});
