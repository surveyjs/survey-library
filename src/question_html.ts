import { Question } from "./question";
import { QuestionNonValue } from "./questionnonvalue";
import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";

/**
 * A Model for html question. Unlike other questions it doesn't have value and title.
 */
export class QuestionHtmlModel extends QuestionNonValue {
  constructor(public name: string) {
    super(name);
    var locHtml = this.createLocalizableString("html", this);
    var self = this;
    locHtml.onGetTextCallback = function(str: string): string {
      return !!self.survey ? self.survey.processHtml(str) : str;
    };
  }
  public getType(): string {
    return "html";
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
JsonObject.metaData.addClass(
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
