import { ISurveyErrorOwner } from "./base-interfaces";
import { LocalizableString } from "./localizablestring";
import { getLocaleString } from "./surveyStrings";

export class SurveyError {
  private locTextValue: LocalizableString;
  public visible: boolean = true;
  constructor(
    public text: string = null,
    protected errorOwner: ISurveyErrorOwner = null
  ) { }
  public equals(error: SurveyError): boolean {
    if (!error || !error.getErrorType) return false;
    if (this.getErrorType() !== error.getErrorType()) return false;
    return this.text === error.text && this.visible === error.visible;
  }
  public get locText(): LocalizableString {
    if (!this.locTextValue) {
      this.locTextValue = new LocalizableString(this.errorOwner, true);
      this.locTextValue.storeDefaultText = true;
      this.locTextValue.text = this.getText();
    }
    return this.locTextValue;
  }

  public getText(): string {
    var res = this.text;
    if (!res) res = this.getDefaultText();
    if (!!this.errorOwner) {
      res = this.errorOwner.getErrorCustomText(res, this);
    }
    return res;
  }
  public getErrorType(): string {
    return "base";
  }
  protected getDefaultText(): string {
    return "";
  }
  protected getLocale(): string {
    return !!this.errorOwner ? this.errorOwner.getLocale() : "";
  }
  protected getLocalizationString(locStrName: string): string {
    return getLocaleString(locStrName, this.getLocale());
  }
  public onUpdateErrorTextCallback: (error: SurveyError) => void = undefined;
  public updateText(): void {
    if (this.onUpdateErrorTextCallback) {
      this.onUpdateErrorTextCallback(this);
    }
    this.locText.text = this.getText();
  }
}
