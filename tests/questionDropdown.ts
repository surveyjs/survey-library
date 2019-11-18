import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";

import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";

export default QUnit.module("choicesRestfull");

QUnit.test("Test dropdown choicesMax choicesMin properties", function(assert) {
  var json = {
    questions: [
      {
        name: "liveage",
        type: "dropdown",
        choicesMin: 1,
        choicesMax: 115
      }
    ]
  };
  var survey = new SurveyModel(json);

  var question = <QuestionDropdownModel>survey.getAllQuestions()[0];

  assert.equal(question.choicesMin, 1, "choicesMin is ok");
  assert.equal(question.choicesMax, 115, "choicesMax is ok");
  assert.equal(question.visibleChoices.length, 115, "visibleChoices is ok");
});
