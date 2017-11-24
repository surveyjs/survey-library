import { QuestionBase } from "./questionbase";
import { JsonObject } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";

/**
 * A Model for html question. Unlike other questions it doesn't have value and title.
 */
export class QuestionHtmlModel extends QuestionBase {
  constructor(public name: string) {
    super(name);
    this.createLocalizableString("html", this);
  }
  public getType(): string {
    return "html";
  }
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
  "questionbase"
);
QuestionFactory.Instance.registerQuestion("html", name => {
  return new QuestionHtmlModel(name);
});
