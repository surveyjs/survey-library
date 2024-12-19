import { getLocaleString } from "./surveyStrings";
import { SurveyError } from "./survey-error";
import { ISurveyErrorOwner } from "./base-interfaces";

export class AnswerRequiredError extends SurveyError {
  constructor(
    public text: string = null,
    errorOwner: ISurveyErrorOwner = null
  ) {
    super(text, errorOwner);
  }
  public getErrorType(): string {
    return "required";
  }
  protected getDefaultText(): string {
    return this.getLocalizationString("requiredError");
  }
}
export class OneAnswerRequiredError extends SurveyError {
  constructor(
    public text: string = null,
    errorOwner: ISurveyErrorOwner = null
  ) {
    super(text, errorOwner);
  }
  public getErrorType(): string {
    return "requireoneanswer";
  }
  protected getDefaultText(): string {
    return this.getLocalizationString("requiredErrorInPanel");
  }
}
export class RequreNumericError extends SurveyError {
  constructor(
    public text: string = null,
    errorOwner: ISurveyErrorOwner = null
  ) {
    super(text, errorOwner);
  }
  public getErrorType(): string {
    return "requirenumeric";
  }
  protected getDefaultText(): string {
    return this.getLocalizationString("numericError");
  }
}
export class ExceedSizeError extends SurveyError {
  constructor(private maxSize: number, errorOwner: ISurveyErrorOwner = null) {
    super(null, errorOwner);
    this.locText.text = this.getText();
  }
  public getErrorType(): string {
    return "exceedsize";
  }
  public getDefaultText(): string {
    return (<any>getLocaleString("exceedMaxSize"))["format"](this.getTextSize());
  }
  private getTextSize() {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    var fixed = [0, 0, 2, 3, 3];
    if (this.maxSize === 0) {
      return "0 Byte";
    }
    var i = Math.floor(Math.log(this.maxSize) / Math.log(1024));
    var value = this.maxSize / Math.pow(1024, i);
    return value.toFixed(fixed[i]) + " " + sizes[i];
  }
}
export class WebRequestError extends SurveyError {
  constructor(
    public status: string,
    public response: string,
    errorOwner: ISurveyErrorOwner = null
  ) {
    super(null, errorOwner);
  }
  public getErrorType(): string {
    return "webrequest";
  }
  protected getDefaultText(): string {
    const str: any = this.getLocalizationString("urlRequestError");
    return !!str ? str["format"](this.status, this.response) : "";
  }
}
export class WebRequestEmptyError extends SurveyError {
  constructor(public text: string, errorOwner: ISurveyErrorOwner = null) {
    super(text, errorOwner);
  }
  public getErrorType(): string {
    return "webrequestempty";
  }
  protected getDefaultText(): string {
    return this.getLocalizationString("urlGetChoicesError");
  }
}
export class OtherEmptyError extends SurveyError {
  constructor(public text: string, errorOwner: ISurveyErrorOwner = null) {
    super(text, errorOwner);
  }
  public getErrorType(): string {
    return "otherempty";
  }
  protected getDefaultText(): string {
    return this.getLocalizationString("otherRequiredError");
  }
}
export class UploadingFileError extends SurveyError {
  constructor(public text: string, errorOwner: ISurveyErrorOwner = null) {
    super(text, errorOwner);
  }
  public getErrorType(): string {
    return "uploadingfile";
  }
  protected getDefaultText(): string {
    return this.getLocalizationString("uploadingFile");
  }
}
export class RequiredInAllRowsError extends SurveyError {
  constructor(public text: string, errorOwner: ISurveyErrorOwner = null) {
    super(text, errorOwner);
  }
  public getErrorType(): string {
    return "requiredinallrowserror";
  }
  protected getDefaultText(): string {
    return this.getLocalizationString("requiredInAllRowsError");
  }
}
export class EachRowUniqueError extends SurveyError {
  constructor(public text: string, errorOwner: ISurveyErrorOwner = null) {
    super(text, errorOwner);
  }
  public getErrorType(): string {
    return "eachrowuniqueeerror";
  }
  protected getDefaultText(): string {
    return this.getLocalizationString("eachRowUniqueError");
  }
}
export class MinRowCountError extends SurveyError {
  constructor(
    public minRowCount: number,
    errorOwner: ISurveyErrorOwner = null
  ) {
    super(null, errorOwner);
  }
  public getErrorType(): string {
    return "minrowcounterror";
  }
  protected getDefaultText(): string {
    return (<any>getLocaleString("minRowCountError"))["format"](this.minRowCount);
  }
}
export class KeyDuplicationError extends SurveyError {
  constructor(public text: string, errorOwner: ISurveyErrorOwner = null) {
    super(text, errorOwner);
  }
  public getErrorType(): string {
    return "keyduplicationerror";
  }
  protected getDefaultText(): string {
    return this.getLocalizationString("keyDuplicationError");
  }
}
export class CustomError extends SurveyError {
  constructor(public text: string, errorOwner: ISurveyErrorOwner = null) {
    super(text, errorOwner);
  }
  public getErrorType(): string {
    return "custom";
  }
}
