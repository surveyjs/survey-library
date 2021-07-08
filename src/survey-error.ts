import { ISurveyErrorOwner } from "./base-interfaces";
import { LocalizableString } from "./localizablestring";

export class SurveyError {
  private locTextValue: LocalizableString;
  public visible: boolean = true;
  constructor(
    public text: string = null,
    protected errorOwner: ISurveyErrorOwner = null
  ) {}
  public get locText() {
    if (!this.locTextValue) {
      this.locTextValue = new LocalizableString(this.errorOwner, true);
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
}
