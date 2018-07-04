import { surveyLocalization } from "./surveyStrings";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { SurveyError } from "./base";

export class AnswerRequiredError extends SurveyError {
  constructor(public text: string = null, locOwner: ILocalizableOwner = null) {
    super(text, locOwner);
  }
  protected getDefaultText(): string {
    return surveyLocalization.getString("requiredError");
  }
}
export class OneAnswerRequiredError extends SurveyError {
  constructor(public text: string = null, locOwner: ILocalizableOwner = null) {
    super(text, locOwner);
  }
  protected getDefaultText(): string {
    return surveyLocalization.getString("requiredErrorInPanel");
  }
}
export class RequreNumericError extends SurveyError {
  constructor(public text: string = null, locOwner: ILocalizableOwner = null) {
    super(text, locOwner);
  }
  protected getDefaultText(): string {
    return surveyLocalization.getString("numericError");
  }
}
export class ExceedSizeError extends SurveyError {
  constructor(private maxSize: number, locOwner: ILocalizableOwner = null) {
    super(null, locOwner);
    this.locText.text = this.getText();
  }
  public getDefaultText(): string {
    return surveyLocalization
      .getString("exceedMaxSize")
      ["format"](this.getTextSize());
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

export class CustomError extends SurveyError {
  constructor(public text: string, locOwner: ILocalizableOwner = null) {
    super(text, locOwner);
  }
}
