import { ConsoleWarnings } from "../src/console-warnings";
import { SurveyModel } from "../src/survey";

export default QUnit.module("SurveySerialization");

const errorText = "Self-hosted Form Library no longer supports integration with SurveyJS Demo Service. Learn more: https://surveyjs.io/stay-updated/release-notes/v2.0.0#form-library-removes-apis-for-integration-with-surveyjs-demo-service";

QUnit.test("survey.beginLoading()/survey.endLoading()", function (assert) {
  const survey = new SurveyModel();
  assert.equal(survey.state, "empty", "state #1");
  survey.beginLoading();
  assert.equal(survey.state, "loading", "state #2");
  survey.endLoading();
  assert.equal(survey.state, "empty", "state #3");
  survey.beginLoading();
  assert.equal(survey.state, "loading", "state #4");
  survey.fromJSON({ elements: [{ type: "text", name: "q1" }] });
  assert.equal(survey.state, "running", "state #5");
});
QUnit.test("Show warning in console on loading survey", function(assert) {
  const prev = ConsoleWarnings.warn;
  let reportText: string = "";
  ConsoleWarnings.warn = (text: string) => {
    reportText = text;
  };
  let survey = new SurveyModel({ surveyId: "abcde" });

  assert.equal(survey.state, "empty", "state #1");
  assert.equal(reportText, errorText, "Error on loading, #1");
  reportText = "";
  survey.loadSurveyFromService("abcde");
  assert.equal(reportText, errorText, "Error on loading, #2");

  ConsoleWarnings.warn = prev;
});
QUnit.test("Show warning in console on loading survey", function(assert) {
  const prev = ConsoleWarnings.warn;
  let reportText: string = "";
  ConsoleWarnings.warn = (text: string) => {
    reportText = text;
  };
  let survey = new SurveyModel({ surveyPostId: "abcde", elements: [{ type: "text", name: "q1", defaultValue: 1 }] });

  assert.equal(survey.state, "running", "state #1");
  survey.doComplete();
  assert.equal(survey.state, "completed", "state #2");
  assert.equal(reportText, errorText, "Error on loading, #1");

  ConsoleWarnings.warn = prev;
});
QUnit.test("Show warning in console on sendResult/getResult", function(assert) {
  const prev = ConsoleWarnings.warn;
  let reportText: string = "";
  ConsoleWarnings.warn = (text: string) => {
    reportText = text;
  };
  let survey = new SurveyModel();
  survey.sendResult("abcde");
  assert.equal(reportText, errorText, "Error on sendResult, #1");
  reportText = "";
  survey.getResult("abcde", "q1");
  assert.equal(reportText, errorText, "Error on getResult, #2");
  ConsoleWarnings.warn = prev;
});
