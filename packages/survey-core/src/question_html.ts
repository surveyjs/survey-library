import { QuestionNonValue } from "./questionnonvalue";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { LocalizableString } from "./localizablestring";
import { CssClassBuilder } from "./utils/cssClassBuilder";

/**
  * A class that describes the HTML question type. Unlike other question types, HTML cannot have a title or value.
 *
 * [View Demo](https://surveyjs.io/form-library/examples/questiontype-html/ (linkStyle))
 */
export class QuestionHtmlModel extends QuestionNonValue {
  public ignoreHtmlProgressing: boolean;
  constructor(name: string) {
    super(name);
    var locHtml = this.createLocalizableString("html", this);
    locHtml.onGetTextCallback = (str: string): string => {
      return !!this.survey && !this.ignoreHtmlProgressing
        ? this.processHtml(str)
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
   * HTML markup to display.
   *
   * > IMPORTANT: If you get the markup from a third party, ensure that it does not contain malicious code.
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
    return this.processHtml(this.html);
  }
  private processHtml(html: string): string {
    return this.survey ? this.survey.processHtml(html, "html-question") : this.html;
  }
  public get isNewA11yStructure(): boolean {
    return true;
  }
  public get renderCssRoot(): string {
    return new CssClassBuilder().append(this.cssClasses.root).append(this.cssClasses.nested, this.getIsNested()).toString() || undefined;
  }
}
Serializer.addClass(
  "html",
  [
    { name: "html:html", serializationProperty: "locHtml" },
    { name: "showNumber", visible: false },
    { name: "state", visible: false },
    { name: "titleLocation", visible: false },
    { name: "descriptionLocation", visible: false },
    { name: "errorLocation", visible: false },
    { name: "indent", visible: false },
    { name: "width", visible: false },
  ],
  function () {
    return new QuestionHtmlModel("");
  },
  "nonvalue"
);
QuestionFactory.Instance.registerQuestion("html", name => {
  return new QuestionHtmlModel(name);
});
