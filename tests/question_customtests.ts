import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import {
  QuestionCustomModel,
  CustomQuestionCollection,
  CustomQuestionJSON,
} from "../src/question_custom";

export default QUnit.module("custom questions");

QUnit.test("Register and load from json", function (assert) {
  var json = {
    name: "newquestion",
  };
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  assert.equal(survey.getAllQuestions().length, 1, "Question is created");
  var q = <Question>survey.getAllQuestions()[0];
  assert.equal(q.getType(), "newquestion", "type is correct");
  assert.equal(q.name, "q1", "name is correct");
  assert.deepEqual(
    survey.toJSON(),
    {
      pages: [
        { name: "page1", elements: [{ type: "newquestion", name: "q1" }] },
      ],
    },
    "Seralized correctly"
  );
  CustomQuestionCollection.Instance.clear();
});
