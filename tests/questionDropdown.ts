import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";

import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";

export default QUnit.module("choicesRestful");

QUnit.test("Test dropdown choicesMax choicesMin properties", function(assert) {
  var json = {
    questions: [
      {
        name: "liveage",
        type: "dropdown",
        choicesMin: 1,
        choicesMax: 115,
      },
    ],
  };
  var survey = new SurveyModel(json);

  var question = <QuestionDropdownModel>survey.getAllQuestions()[0];

  assert.equal(question.choicesMin, 1, "choicesMin is ok");
  assert.equal(question.choicesMax, 115, "choicesMax is ok");
  assert.equal(question.visibleChoices.length, 115, "visibleChoices is ok");
});

QUnit.test("check dropdown disabled class", function(assert) {
  var json = {
    questions: [
      {
        name: "q1",
        type: "dropdown",
      },
    ],
  };
  const survey = new SurveyModel(json);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  question.cssClasses.controlDisabled = "sv_q_dropdown_disabled";
  assert.ok(question.getControlClass().indexOf("sv_q_dropdown_disabled") == -1);
  question.readOnly = true;
  assert.ok(question.getControlClass().indexOf("sv_q_dropdown_disabled") != -1);
});
