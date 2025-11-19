
import { SurveyModel } from "../src/survey";

export default QUnit.module("SurveyStateTest");

QUnit.test("restore element state property", function (assert) {
  const survey = new SurveyModel();
  assert.deepEqual(survey.getState(), {}, "there is no state");

  const page = survey.addNewPage("page1");
  assert.equal(page.getState(), undefined, "page state is undefined");

  const quesiton = page.addNewQuestion("text", "question1");
  assert.equal(quesiton.getState(), undefined, "quesiton state is undefined");
  assert.deepEqual(survey.getState(), {}, "there is no state #2");

  quesiton.collapse();
  assert.deepEqual(quesiton.getState(), { state: "collapsed" }, "quesiton state is no undefined");
  assert.deepEqual(page.getState(), undefined, "page state is undefined #2");
  assert.deepEqual(survey.getState(), { questions: { question1: { state: "collapsed" }}}, "survey state is no undefined");

  survey.setState({ questions: { question1: { state: "expanded" }}});
  assert.equal(quesiton.isExpanded, true, "quesiton is expanded");
});

QUnit.test("restore last focused question state", function (assert) {
  const config = {
    pages: [
      {
        elements: [
          { type: "text", name: "q1"},
          { type: "text", name: "q2"}
        ]
      },
      {
        elements: [
          { type: "text", name: "q3"},
          { type: "text", name: "q4"}
        ]
      },
      {
        elements: [
          { type: "text", name: "q5"},
          { type: "text", name: "q6"}
        ]
      }
    ]
  };

  let survey = new SurveyModel(config);
  assert.deepEqual(survey.getState(), {}, "there is no state");
  survey.whenQuestionFocusIn(survey.getQuestionByName("q3"))
  assert.deepEqual(survey.getState(), { "lastActive": "q3" }, "there is no state");

  survey = new SurveyModel(config);
  assert.deepEqual(survey.getState(), {}, "there is no state #2");
  assert.equal(survey.currentPageNo, 0, "survey on first page");
  survey.setState({ "lastActive": "q5" })
  assert.equal(survey.currentPageNo, 2, "survey on last page");
});