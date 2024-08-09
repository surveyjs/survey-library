import { settings } from "./settings";
import { surveyLocalization } from "./surveyStrings";

const surveyIOSite = "surveyjs.io";
const surveyIOMaxPostSize = 65536;
/**
 * The class contains methods to work with api.surveyjs.io service.
 */
export class dxSurveyService {
  public locale: string;
  public static get serviceUrl(): string {
    return settings.web.surveyServiceUrl;
  }
  public static set serviceUrl(val: string) {
    settings.web.surveyServiceUrl = val;
  }
  public loadSurvey(surveyId: string,
    onLoad: (success: boolean, result: string, response: any) => void): void {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      this.serviceUrl + "/getSurvey?surveyId=" + surveyId
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
      var result = JSON.parse(xhr.response);
      onLoad(xhr.status == 200, result, xhr.response);
    };
    xhr.send();
  }
  public getSurveyJsonAndIsCompleted(surveyId: string, clientId: string,
    onLoad: (success: boolean, surveyJson: any, result: string, response: any) => void): void {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      this.serviceUrl +
        "/getSurveyAndIsCompleted?surveyId=" +
        surveyId +
        "&clientId=" +
        clientId
    );
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
      var result = JSON.parse(xhr.response);
      var surveyJson = result ? result.survey : null;
      var isCompleted = result ? result.isCompleted : null;
      onLoad(xhr.status == 200, surveyJson, isCompleted, xhr.response);
    };
    xhr.send();
  }
  public canSendResult(result: JSON): boolean {
    if(!this.isSurveJSIOService) return true;
    const str = JSON.stringify(result);
    return str.length < surveyIOMaxPostSize;
  }
  public get isSurveJSIOService(): boolean {
    return this.serviceUrl.indexOf(surveyIOSite) >= 0;
  }
  public sendResult(postId: string, result: JSON,
    onSendResult: (success: boolean, response: any, request?: any) => void,
    clientId: string = null, isPartialCompleted: boolean = false): void {
    if(!this.canSendResult(result)) {
      onSendResult(false, surveyLocalization.getString("savingExceedSize", this.locale), undefined);
    } else {
      this.sendResultCore(postId, result, onSendResult, clientId, isPartialCompleted);
    }
  }
  protected sendResultCore(postId: string, result: JSON,
    onSendResult: (success: boolean, response: any, request?: any) => void,
    clientId: string = null, isPartialCompleted: boolean = false): void {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.serviceUrl + "/post/");
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    var data = { postId: postId, surveyResult: JSON.stringify(result) };
    if (clientId) (<any>data)["clientId"] = clientId;
    if (isPartialCompleted) (<any>data)["isPartialCompleted"] = true;
    var dataStringify: string = JSON.stringify(data);
    xhr.onload = xhr.onerror = function () {
      if (!onSendResult) return;
      onSendResult(xhr.status === 200, xhr.response, xhr);
    };
    xhr.send(dataStringify);
  }
  public sendFile(postId: string, file: File,
    onSendFile: (success: boolean, response: any) => void): void {
    var xhr = new XMLHttpRequest();
    xhr.onload = xhr.onerror = function () {
      if (!onSendFile) return;
      onSendFile(xhr.status == 200, JSON.parse(xhr.response));
    };
    xhr.open("POST", this.serviceUrl + "/upload/", true);
    var formData = new FormData();
    formData.append("file", file);
    formData.append("postId", postId);
    xhr.send(formData);
  }
  public getResult(resultId: string, name: string,
    onGetResult: (success: boolean, data: any, dataList: Array<any>, response: any) => void): void {
    var xhr = new XMLHttpRequest();
    var data = "resultId=" + resultId + "&name=" + name;
    xhr.open("GET", this.serviceUrl + "/getResult?" + data);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var self = this;
    xhr.onload = function () {
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
  public isCompleted(resultId: string, clientId: string,
    onIsCompleted: (success: boolean, result: string, response: any) => void): void {
    var xhr = new XMLHttpRequest();
    var data = "resultId=" + resultId + "&clientId=" + clientId;
    xhr.open("GET", this.serviceUrl + "/isCompleted?" + data);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var self = this;
    xhr.onload = function () {
      var result = null;
      if (xhr.status == 200) {
        result = JSON.parse(xhr.response);
      }
      onIsCompleted(xhr.status == 200, result, xhr.response);
    };
    xhr.send();
  }
  private get serviceUrl(): string {
    return dxSurveyService.serviceUrl || "";
  }
}
