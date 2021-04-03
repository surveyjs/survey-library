import { QuestionNonValue } from "./questionnonvalue";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";

/**
 * A Model for html question. Unlike other questions it doesn't have value and title.
 */
export class QuestionHtmlModel extends QuestionNonValue {
  public ignoreHtmlProgressing: boolean;
  constructor(name: string) {
    super(name);
    var locHtml = this.createLocalizableString("html", this);
    locHtml.onGetTextCallback = (str: string): string => {
      return !!this.survey && !this.ignoreHtmlProgressing
        ? this.survey.processHtml(str)
        : str;
    };
  }
  public getType(): string {
    return "html";
  }
  public get isCompositeQuestion(): boolean {
    return true;
  }
  public getProcessedText(text: string): string {
    if (this.ignoreHtmlProgressing) return text;
    return super.getProcessedText(text);
  }
  /**
   * Set html to display it
   */
  public get html(): string {
    return this.getLocalizableStringText("html", "");
  }
  public set html(val: string) {
    this.setLocalizableStringText("html", val);
  }
  get locHtml(): LocalizableString {
    return this.getLocalizableString("html");
  }
  public get processedHtml() {
    return this.survey ? this.survey.processHtml(this.html) : this.html;
  }
}
Serializer.addClass(
  "html",
  [{ name: "html:html", serializationProperty: "locHtml" }],
  function() {
    return new QuestionHtmlModel("");
  },
  "nonvalue"
);
QuestionFactory.Instance.registerQuestion("html", name => {
  return new QuestionHtmlModel(name);
});
