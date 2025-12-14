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
   * [View Demo](https://surveyjs.io/form-library/examples/add-html-form-field/ (linkStyle))
   *
   * > If you get the markup from a third party, ensure that it does not contain malicious code.
   */
  public get html(): string {
    return this.getLocStringText(this.locHtml) || "";
  }
  public set html(val: string) {
    this.setLocStringText(this.locHtml, val);
  }
  get locHtml(): LocalizableString {
    return this.getOrCreateLocStr("html", false, false, (locStr: LocalizableString) => {
      locStr.onGetTextCallback = (str: string): string => {
        return !!this.survey && !this.ignoreHtmlProgressing
          ? this.processHtml(str)
          : str;
      };
    });
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
