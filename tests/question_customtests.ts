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

QUnit.test("Create the wrapper question and sync the value", function (assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(
    q.question.getType(),
    "dropdown",
    "Question the type was created"
  );
  q.value = 1;
  assert.equal(q.question.value, 1, "Set value to wrapper value");
  q.question.value = 2;
  assert.equal(q.value, 2, "Set value to custom question");
  CustomQuestionCollection.Instance.clear();
});
