import { QuestionTextModel } from "../src/question_text";
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
