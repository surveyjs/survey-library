import { SurveyModel } from "../src/survey";
import { dxSurveyService } from "../src/dxSurveyService";

export default QUnit.module("SurveyServiceTests");

class SurveyServiceTester extends dxSurveyService {
  private onSendResult: any;
  public doSendResult(success: boolean, response: any, request?: any): void {
    if(!!this.onSendResult) {
      this.onSendResult(success, response, request);
      this.onSendResult = undefined;
    }
  }
  public get isSavingData(): boolean {
    return !!this.onSendResult;
  }
  protected sendResultCore(postId: string, result: JSON,
    onSendResult: (success: boolean, response: any, request?: any) => void,
    clientId: string = null, isPartialCompleted: boolean = false): void {
    this.onSendResult = onSendResult;
  }
}

class SurveyModelTester extends SurveyModel {
  public serviceTester: SurveyServiceTester;
  public notiferList: Array<any> = [];
  constructor(jsonObj: any = null) {
    super(jsonObj);
  }
  protected createSurveyService(): dxSurveyService {
    this.serviceTester = new SurveyServiceTester();
    return this.serviceTester;
  }
  public notify(message: string, type: string, showActions: boolean = false): void {
    this.notiferList.push({ message: message, type: type, showActions: showActions });
  }
}

QUnit.test("Always show data saving for surveyjs io service, no errors", function(assert) {
  const json = {
    surveyPostId: "abc",
    elements: [{ type: "comment", name: "q1", defaultValue: 1 }]
  };
  const survey = new SurveyModelTester(json);
  survey.getQuestionByName("q1").value = "0123456789";
  survey.doComplete();
  assert.equal(survey.serviceTester.isSavingData, true, "The data is saving");
  assert.equal(survey.serviceTester.isSurveJSIOService, true, "We are saving data into the surveyjs service");
  assert.equal(survey.completedStateText, "The results are being saved on the server...", "do saving #1");
  assert.equal(survey.notiferList.length, 1, "notiferList.length #1");
  assert.equal(survey.notiferList[0].type, "saving", "notiferList[0].type #1");
  survey.serviceTester.doSendResult(true, "", "");
  assert.equal(survey.completedStateText, "The results were saved successfully!", "do saving #2");
  assert.equal(survey.notiferList.length, 2, "notiferList.length #2");
  assert.equal(survey.notiferList[1].type, "success", "notiferList[1].type #2");
});
QUnit.test("Always show data saving for surveyjs io service, with errors", function(assert) {
  const json = {
    surveyPostId: "abc",
    elements: [{ type: "comment", name: "q1" }]
  };
  const survey = new SurveyModelTester(json);
  survey.getQuestionByName("q1").value = "0123456789";
  survey.doComplete();
  assert.equal(survey.serviceTester.isSavingData, true, "The data is saving");
  assert.equal(survey.serviceTester.isSurveJSIOService, true, "We are saving data into the surveyjs service");
  assert.equal(survey.completedStateText, "The results are being saved on the server...", "do saving #1");
  assert.equal(survey.notiferList.length, 1, "notiferList.length #1");
  assert.equal(survey.notiferList[0].type, "saving", "notiferList[0].type #1");
  survey.serviceTester.doSendResult(false, "We have an error on the server", "");
  assert.equal(survey.completedStateText, "We have an error on the server", "do saving #2");
  assert.equal(survey.notiferList.length, 2, "notiferList.length #2");
  assert.equal(survey.notiferList[1].type, "error", "notiferList[1].type #2");
});
QUnit.test("Try to save a lot of data into the service", function(assert) {
  const json = {
    surveyPostId: "abc",
    elements: [{ type: "comment", name: "q1" }]
  };
  const survey = new SurveyModelTester(json);
  let largeVal = "";
  for(let i = 0; i < 6556; i ++) {
    largeVal += "0123456789";
  }
  survey.getQuestionByName("q1").value = largeVal;
  survey.doComplete();
  const errorText = "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner.";
  assert.equal(survey.serviceTester.isSurveJSIOService, true, "We are saving data into the surveyjs service");
  assert.equal(survey.serviceTester.isSavingData, false, "The data is not saving. We got an error stright away");
  assert.equal(survey.completedStateText, errorText, "try to save");
  assert.equal(survey.notiferList.length, 2, "notiferList.length");
  assert.equal(survey.notiferList[0].type, "saving", "notiferList[0].type");
  assert.equal(survey.notiferList[1].type, "error", "notiferList[1].type");
  assert.equal(survey.notiferList[1].message, errorText, "notiferList[1].type");
});
