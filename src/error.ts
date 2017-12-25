import { surveyLocalization } from "./surveyStrings";
import { SurveyError } from "./base";

export class AnswerRequiredError extends SurveyError {
  constructor(public customErrorText: string = null) {
    super();
  }
  public getText(): string {
    return this.customErrorText
      ? this.customErrorText
      : surveyLocalization.getString("requiredError");
  }
}
export class OneAnswerRequiredError extends SurveyError {
  constructor(public customErrorText: string = null) {
    super();
  }
  public getText(): string {
    return this.customErrorText
      ? this.customErrorText
      : surveyLocalization.getString("requiredErrorInPanel");
  }
}
export class RequreNumericError extends SurveyError {
  constructor() {
    super();
  }
  public getText(): string {
    return surveyLocalization.getString("numericError");
  }
}
export class ExceedSizeError extends SurveyError {
  private maxSize: number;
  constructor(maxSize: number) {
    super();
    this.maxSize = maxSize;
  }
  public getText(): string {
    return surveyLocalization
      .getString("exceedMaxSize")
      ["format"](this.getTextSize());
  }
  private getTextSize() {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    var fixed = [0, 0, 2, 3, 3];
    if (this.maxSize == 0) return "0 Byte";
    var i = Math.floor(Math.log(this.maxSize) / Math.log(1024));
    var value = this.maxSize / Math.pow(1024, i);
    return value.toFixed(fixed[i]) + " " + sizes[i];
  }
}

export class CustomError extends SurveyError {
  private text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }
  public getText(): string {
    return this.text;
  }
}
