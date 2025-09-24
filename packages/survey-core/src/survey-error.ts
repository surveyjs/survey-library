import { ISurveyErrorOwner } from "./base-interfaces";
import { LocalizableString } from "./localizablestring";
import { getLocaleString } from "./surveyStrings";

export class SurveyError {
  private locTextValue: LocalizableString;
  private notificationTypeValue: string;
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
  public get notificationType(): string { return this.notificationTypeValue || "error"; }
  public set notificationType(val: string) { this.notificationTypeValue = val; }
  public get isWarning(): boolean { return this.notificationTypeValue === "warning"; }
  public get isInfo(): boolean { return this.notificationTypeValue === "info"; }
  public get isError(): boolean { return !this.isInfo && !this.isWarning; }
  public getCssIcon(cssClasses: any): string {
    const error = this.getCssError(cssClasses);
    const icon = this.isWarning ? error.warningIcon : this.isInfo ? error.infoIcon : error.icon;
    return icon || error.icon || undefined;
  }
  private getCssError(cssClasses: any): any {
    cssClasses = cssClasses || {};
    return cssClasses.error || {};
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
