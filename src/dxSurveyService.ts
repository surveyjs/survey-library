/**
 * The class contains methods to work with www.dxsurvey.com service.
 */
export class dxSurveyService {
  public static serviceUrl: string = "https://dxsurveyapi.azurewebsites.net/api/Survey";
  //public static serviceUrl: string = "http://localhost:50488/api/Survey";
  constructor() {}
  public loadSurvey(
    surveyId: string,
    onLoad: (success: boolean, result: string, response: any) => void
  ) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      dxSurveyService.serviceUrl + "/getSurvey?surveyId=" + surveyId
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      var result = JSON.parse(xhr.response);
      onLoad(xhr.status == 200, result, xhr.response);
    };
    xhr.send();
  }
  public getSurveyJsonAndIsCompleted(
    surveyId: string,
    clientId: string,
    onLoad: (
      success: boolean,
      surveyJson: any,
      result: string,
      response: any
    ) => void
  ) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      dxSurveyService.serviceUrl +
        "/getSurveyAndIsCompleted?surveyId=" +
        surveyId +
        "&clientId=" +
        clientId
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
      var result = JSON.parse(xhr.response);
      var surveyJson = result ? result.survey : null;
      var isCompleted = result ? result.isCompleted : null;
      onLoad(xhr.status == 200, surveyJson, isCompleted, xhr.response);
    };
    xhr.send();
  }
  public sendResult(
    postId: string,
    result: JSON,
    onSendResult: (success: boolean, response: any) => void,
    clientId: string = null,
    isPartialCompleted: boolean = false
  ) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", dxSurveyService.serviceUrl + "/post/");
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    var data = { postId: postId, surveyResult: JSON.stringify(result) };
    if (clientId) (<any>data)["clientId"] = clientId;
    if (isPartialCompleted) (<any>data)["isPartialCompleted"] = true;
    var dataStringify: string = JSON.stringify(data);
    var self = this;
    xhr.onload = xhr.onerror = function() {
      if (!onSendResult) return;
      onSendResult(xhr.status == 200, xhr.response);
    };
    xhr.send(dataStringify);
  }
  public sendFile(
    postId: string,
    file: File,
    onSendFile: (success: boolean, response: any) => void
  ) {
    var xhr = new XMLHttpRequest();
    xhr.onload = xhr.onerror = function() {
      if (!onSendFile) return;
      onSendFile(xhr.status == 200, JSON.parse(xhr.response));
    };
    xhr.open("POST", dxSurveyService.serviceUrl + "/upload/", true);
    var formData = new FormData();
    formData.append("file", file);
    formData.append("postId", postId);
    xhr.send(formData);
  }
  public getResult(
    resultId: string,
    name: string,
    onGetResult: (
      success: boolean,
      data: any,
      dataList: Array<any>,
      response: any
    ) => void
  ) {
    var xhr = new XMLHttpRequest();
    var data = "resultId=" + resultId + "&name=" + name;
    xhr.open("GET", dxSurveyService.serviceUrl + "/getResult?" + data);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var self = this;
    xhr.onload = function() {
      var result = null;
      var list = null;
      if (xhr.status == 200) {
        result = JSON.parse(xhr.response);
        list = [];
        for (var key in result.QuestionResult) {
          var el = { name: key, value: result.QuestionResult[key] };
          list.push(el);
        }
      }
      onGetResult(xhr.status == 200, result, list, xhr.response);
    };
    xhr.send();
  }
  public isCompleted(
    resultId: string,
    clientId: string,
    onIsCompleted: (success: boolean, result: string, response: any) => void
  ) {
    var xhr = new XMLHttpRequest();
    var data = "resultId=" + resultId + "&clientId=" + clientId;
    xhr.open("GET", dxSurveyService.serviceUrl + "/isCompleted?" + data);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var self = this;
    xhr.onload = function() {
      var result = null;
      if (xhr.status == 200) {
        result = JSON.parse(xhr.response);
      }
      onIsCompleted(xhr.status == 200, result, xhr.response);
    };
    xhr.send();
  }
}
