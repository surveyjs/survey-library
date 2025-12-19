import { Serializer } from "./jsonobject";
import { Base } from "./base";
import { ISurvey } from "./base-interfaces";
import { ILocalizableOwner, LocalizableString } from "./localizablestring";
import { ConditionRunner } from "./conditions";

/**
 * Base class for HtmlConditionItem and UrlConditionItem classes.
 */
export class ExpressionItem extends Base implements ILocalizableOwner {
  public locOwner: ILocalizableOwner;
  constructor(expression: string = null) {
    super();
    this.expression = expression;
  }
  public getType(): string {
    return "expressionitem";
  }
  public runCondition(properties: any): boolean {
    let res = false;
    this.runExpressionByProperty("expression", properties, (val: any) => {
      res = val === true;
    });
    return res;
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
  get locHtml(): LocalizableString {
    return this.getLocalizableString("html");
  }
  public getLocale(): string {
    return !!this.locOwner ? this.locOwner.getLocale() : "";
  }
  public getMarkdownHtml(text: string, name: string, item?: any): string {
    return !!this.locOwner ? this.locOwner.getMarkdownHtml(text, name, item) : undefined;
  }
  public getRenderer(name: string): string {
    return !!this.locOwner ? this.locOwner.getRenderer(name) : null;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return !!this.locOwner ? this.locOwner.getRendererContext(locStr) : locStr;
  }
  public getProcessedText(text: string): string {
    return this.locOwner ? this.locOwner.getProcessedText(text) : text;
  }
  public getSurvey(isLive: boolean = false): ISurvey {
    return <ISurvey>this.locOwner;
  }
}

/**
 * A class that contains expression and html propeties. It uses in survey.completedHtmlOnCondition array.
 * If the expression returns true then html of this item uses instead of survey.completedHtml property
 * @see SurveyModel.completedHtmlOnCondition
 * @see SurveyModel.completedHtml
 */
export class HtmlConditionItem extends ExpressionItem {
  constructor(expression: string = null, html: string = null) {
    super(expression);
    if (html) {
      this.html = html;
    }
  }
  public getType(): string {
    return "htmlconditionitem";
  }
  /**
   * The html that shows on completed ('Thank you') page. The expression should return true
   * @see expression
   */
  public get html(): string {
    return this.getLocStringText(this.locHtml);
  }
  public set html(value: string) {
    this.setLocStringText(this.locHtml, value);
  }
  get locHtml(): LocalizableString {
    return this.getOrCreateLocStr("html");
  }
}

/**
 * A class that contains expression and url propeties. It uses in survey.navigateToUrlOnCondition array.
 * If the expression returns true then url of this item uses instead of survey.navigateToUrl property
 * @see SurveyModel.navigateToUrl
 */
export class UrlConditionItem extends ExpressionItem {
  constructor(expression: string = null, url: string = null) {
    super(expression);
    if (url) {
      this.url = url;
    }
  }
  public getType(): string {
    return "urlconditionitem";
  }
  /**
   * The url that survey navigates to on completing the survey. The expression should return true
   * @see expression
   */
  public get url(): string {
    return this.getLocStringText(this.locUrl);
  }
  public set url(value: string) {
    this.setLocStringText(this.locUrl, value);
  }
  get locUrl(): LocalizableString {
    return this.getOrCreateLocStr("url");
  }
}

Serializer.addClass(
  "expressionitem",
  ["expression:condition"],
  function() {
    return new ExpressionItem();
  },
  "base"
);

Serializer.addClass(
  "htmlconditionitem",
  [{ name: "html:html", serializationProperty: "locHtml" }],
  function() {
    return new HtmlConditionItem();
  },
  "expressionitem"
);

Serializer.addClass(
  "urlconditionitem",
  [{ name: "url:string", serializationProperty: "locUrl" }],
  function() {
    return new UrlConditionItem();
  },
  "expressionitem"
);
