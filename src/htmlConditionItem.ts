import { Serializer } from "./jsonobject";
import { Base } from "./base";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { ConditionRunner } from "./conditions";

/**
 * A class that contains expression and html propeties. It uses in survey.completedHtmlOnCondition array.
 * If the expression returns true then html of this item uses instead of survey.completedHtml property
 * @see SurveyModel.completedHtmlOnCondition
 * @see SurveyModel.completedHtml
 */
export class HtmlConditionItem extends Base implements ILocalizableOwner {
  public locOwner: ILocalizableOwner;
  constructor(expression: string = null, html: string = null) {
    super();
    this.createLocalizableString("html", this);
    this.expression = expression;
    this.html = html;
  }
  public getType(): string {
    return "htmlconditionitem";
  }
  public runCondition(values: any, properties: any): boolean {
    if (!this.expression) return false;
    return new ConditionRunner(this.expression).run(values, properties);
  }
  /**
   * The expression property. If this expression returns true, then survey will use html property to show on complete page.
   */
  public get expression(): string {
    return this.getPropertyValue("expression", "");
  }
  public set expression(val: string) {
    this.setPropertyValue("expression", val);
  }
  /**
   * The html that shows on completed ('Thank you') page. The expression should return true
   * @see expression
   */
  public get html(): string {
    return this.getLocalizableStringText("html");
  }
  public set html(value: string) {
    this.setLocalizableStringText("html", value);
  }
  get locHtml(): LocalizableString {
    return this.getLocalizableString("html");
  }

  public getLocale(): string {
    return !!this.locOwner ? this.locOwner.getLocale() : "";
  }
  public getMarkdownHtml(text: string): string {
    return !!this.locOwner ? this.locOwner.getMarkdownHtml(text) : null;
  }
  public getProcessedText(text: string): string {
    return this.locOwner ? this.locOwner.getProcessedText(text) : text;
  }
}

Serializer.addClass(
  "htmlconditionitem",
  [
    "expression:condition",
    { name: "html:html", serializationProperty: "locHtml" }
  ],
  function() {
    return new HtmlConditionItem();
  },
  "base"
);
