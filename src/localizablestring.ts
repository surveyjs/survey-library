import { Helpers } from "./helpers";
import { surveyLocalization } from "./surveyStrings";

export interface ILocalizableOwner {
  getLocale(): string;
  getMarkdownHtml(text: string): string;
  getProcessedText(text: string): string;
}
/**
 * The class represents the string that supports multi-languages and markdown.
 * It uses in all objects where support for multi-languages and markdown is required.
 */
export class LocalizableString {
  public static defaultLocale: string = "default";
  private values = {};
  private htmlValues = {};
  private renderedText: string = null;
  private calculatedText: string = null;
  public onRenderedHtmlCallback: (html: string) => string;
  public onGetTextCallback: (str: string) => string = null;
  public onStrChanged: () => void;
  constructor(
    public owner: ILocalizableOwner,
    public useMarkdown: boolean = false
  ) {
    this.onCreating();
  }
  public get locale() {
    return this.owner ? this.owner.getLocale() : "";
  }
  public strChanged() {
    if (this.renderedText === null) return;
    this.calculatedText = this.calText();
    if (this.renderedText !== this.calculatedText) {
      this.onChanged();
    }
  }
  public get text(): string {
    this.renderedText =
      this.calculatedText !== null ? this.calculatedText : this.calText();
    this.calculatedText = null;
    return this.renderedText;
  }
  private calText(): string {
    var res = this.pureText;
    if (
      res &&
      this.owner &&
      this.owner.getProcessedText &&
      res.indexOf("{") > -1
    ) {
      res = this.owner.getProcessedText(res);
    }
    if (this.onGetTextCallback) res = this.onGetTextCallback(res);
    return res;
  }
  public get pureText() {
    var loc = this.locale;
    if (!loc) loc = LocalizableString.defaultLocale;
    var res = (<any>this).values[loc];
    if (!res && loc == LocalizableString.defaultLocale) {
      res = (<any>this).values[surveyLocalization.defaultLocale];
    }
    if (!res && loc !== LocalizableString.defaultLocale) {
      res = (<any>this).values[LocalizableString.defaultLocale];
    }
    if (!res) res = "";
    return res;
  }
  public get hasHtml(): boolean {
    return this.hasHtmlValue();
  }
  public get html() {
    if (!this.hasHtml) return "";
    return this.getHtmlValue();
  }
  public get isEmpty(): boolean {
    return Object.keys(this.values).length == 0;
  }
  public get textOrHtml() {
    return this.hasHtml ? this.getHtmlValue() : this.text;
  }
  public get renderedHtml() {
    var res = this.textOrHtml;
    return this.onRenderedHtmlCallback ? this.onRenderedHtmlCallback(res) : res;
  }
  public set text(value: string) {
    this.setLocaleText(this.locale, value);
  }
  public getLocaleText(loc: string): string {
    if (!loc) loc = LocalizableString.defaultLocale;
    var res = (<any>this).values[loc];
    return res ? res : "";
  }
  public setLocaleText(loc: string, value: string) {
    if (value == this.getLocaleText(loc)) return;
    if (
      value &&
      loc &&
      loc != LocalizableString.defaultLocale &&
      !(<any>this).values[loc] &&
      value == this.getLocaleText(LocalizableString.defaultLocale)
    )
      return;
    if (!loc) loc = LocalizableString.defaultLocale;
    delete (<any>this).htmlValues[loc];
    if (!value) {
      if ((<any>this).values[loc]) delete (<any>this).values[loc];
    } else {
      if (typeof value === "string") {
        if (
          loc != LocalizableString.defaultLocale &&
          value == this.getLocaleText(LocalizableString.defaultLocale)
        ) {
          this.setLocaleText(loc, null);
        } else {
          (<any>this).values[loc] = value;
          if (loc == LocalizableString.defaultLocale) {
            this.deleteValuesEqualsToDefault(value);
          }
        }
      }
    }
    this.strChanged();
  }
  public getJson(): any {
    var keys = Object.keys(this.values);
    if (keys.length == 0) return null;
    if (keys.length == 1 && keys[0] == LocalizableString.defaultLocale)
      return (<any>this).values[keys[0]];
    return this.values;
  }
  public setJson(value: any) {
    this.values = {};
    this.htmlValues = {};
    if (!value) return;
    if (typeof value === "string") {
      this.setLocaleText(null, value);
    } else {
      for (var key in value) {
        this.setLocaleText(key, value[key]);
      }
    }
    this.strChanged();
  }
  public equals(obj: any) {
    if (!obj || !obj.values) return false;
    return Helpers.isTwoValueEquals(this.values, obj.values);
  }
  public onChanged() {
    if (this.onStrChanged) this.onStrChanged();
  }
  protected onCreating() {}
  private hasHtmlValue(): boolean {
    if (!this.owner || !this.useMarkdown) return false;
    var text = this.text;
    if (!text) return false;
    var loc = this.locale;
    if (!loc) loc = LocalizableString.defaultLocale;
    (<any>this).htmlValues[loc] = this.owner.getMarkdownHtml(text);
    return (<any>this).htmlValues[loc] ? true : false;
  }
  private getHtmlValue(): string {
    var loc = this.locale;
    if (!loc) loc = LocalizableString.defaultLocale;
    return (<any>this).htmlValues[loc];
  }

  private deleteValuesEqualsToDefault(defaultValue: string) {
    var keys = Object.keys(this.values);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == LocalizableString.defaultLocale) continue;
      if ((<any>this).values[keys[i]] == defaultValue) delete (<any>this).values[keys[i]];
    }
  }
}
