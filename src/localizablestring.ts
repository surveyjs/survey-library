import { Helpers } from "./helpers";
import { surveyLocalization } from "./surveyStrings";
import { settings } from "./settings";

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
  public static SerializeAsObject: boolean = false;
  public static get defaultLocale(): string {
    return settings.defaultLocaleName;
  }
  public static set defaultLocale(val: string) {
    settings.defaultLocaleName = val;
  }
  private values = {};
  private htmlValues = {};
  private renderedText: string = null;
  private calculatedTextValue: string = null;
  public onGetTextCallback: (str: string) => string = null;
  public onStrChanged: () => void;
  public sharedData: LocalizableString;
  constructor(
    public owner: ILocalizableOwner,
    public useMarkdown: boolean = false
  ) {
    this.onCreating();
  }
  public get locale() {
    return this.owner && this.owner.getLocale ? this.owner.getLocale() : "";
  }
  public strChanged() {
    if (this.renderedText === null) return;
    this.calculatedTextValue = this.calText();
    if (this.renderedText !== this.calculatedTextValue) {
      this.renderedText = null;
      this.calculatedTextValue = null;
      this.onChanged();
    }
  }
  public get text(): string {
    return this.pureText;
  }
  public get calculatedText(): string {
    this.renderedText =
      this.calculatedTextValue !== null
        ? this.calculatedTextValue
        : this.calText();
    this.calculatedTextValue = null;
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
    if (!loc) loc = settings.defaultLocaleName;
    var res = this.getValue(loc);
    if (!res && loc == settings.defaultLocaleName) {
      res = this.getValue(surveyLocalization.defaultLocale);
    }
    if (!res && loc !== settings.defaultLocaleName) {
      res = this.getValue(settings.defaultLocaleName);
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
    return this.getValuesKeys().length == 0;
  }
  public get textOrHtml() {
    return this.hasHtml ? this.getHtmlValue() : this.calculatedText;
  }
  public get renderedHtml() {
    return this.textOrHtml;
  }
  public set text(value: string) {
    this.setLocaleText(this.locale, value);
  }
  public getLocaleText(loc: string): string {
    if (!loc) loc = settings.defaultLocaleName;
    var res = this.getValue(loc);
    return res ? res : "";
  }
  public setLocaleText(loc: string, value: string) {
    if (value == this.getLocaleText(loc)) return;
    if (
      value &&
      loc &&
      loc != settings.defaultLocaleName &&
      !this.getValue(loc) &&
      value == this.getLocaleText(settings.defaultLocaleName)
    )
      return;
    if (!loc) loc = settings.defaultLocaleName;
    delete (<any>this).htmlValues[loc];
    if (!value) {
      if (this.getValue(loc)) this.deleteValue(loc);
    } else {
      if (typeof value === "string") {
        if (
          loc != settings.defaultLocaleName &&
          value == this.getLocaleText(settings.defaultLocaleName)
        ) {
          this.setLocaleText(loc, null);
        } else {
          this.setValue(loc, value);
          if (loc == settings.defaultLocaleName) {
            this.deleteValuesEqualsToDefault(value);
          }
        }
      }
    }
    this.strChanged();
  }
  public hasNonDefaultText(): boolean {
    var keys = this.getValuesKeys();
    if (keys.length == 0) return false;
    return keys.length > 1 || keys[0] != settings.defaultLocaleName;
  }
  public getLocales(): Array<string> {
    var keys = this.getValuesKeys();
    if (keys.length == 0) return [];
    return keys;
  }
  public getJson(): any {
    if (!!this.sharedData) return this.sharedData.getJson();
    var keys = this.getValuesKeys();
    if (keys.length == 0) return null;
    if (
      keys.length == 1 &&
      keys[0] == settings.defaultLocaleName &&
      !settings.serializeLocalizableStringAsObject
    )
      return (<any>this).values[keys[0]];
    return this.values;
  }
  public setJson(value: any) {
    if (!!this.sharedData) {
      this.sharedData.setJson(value);
      return;
    }
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
  public equals(obj: any): boolean {
    if (!!this.sharedData) return this.sharedData.equals(obj);
    if (!obj || !obj.values) return false;
    return Helpers.isTwoValueEquals(this.values, obj.values);
  }
  public onChanged() {
    if (this.onStrChanged) this.onStrChanged();
  }
  protected onCreating() {}
  private hasHtmlValue(): boolean {
    if (!this.owner || !this.useMarkdown) return false;
    var renderedText = this.calculatedText;
    if (!renderedText) return false;
    var loc = this.locale;
    if (!loc) loc = settings.defaultLocaleName;
    (<any>this).htmlValues[loc] = this.owner.getMarkdownHtml(renderedText);
    return (<any>this).htmlValues[loc] ? true : false;
  }
  private getHtmlValue(): string {
    var loc = this.locale;
    if (!loc) loc = settings.defaultLocaleName;
    return (<any>this).htmlValues[loc];
  }
  private deleteValuesEqualsToDefault(defaultValue: string) {
    var keys = this.getValuesKeys();
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == settings.defaultLocaleName) continue;
      if (this.getValue(keys[i]) == defaultValue) {
        this.deleteValue(keys[i]);
      }
    }
  }
  private getValue(loc: string): string {
    if (!!this.sharedData) return this.sharedData.getValue(loc);
    return (<any>this).values[loc];
  }
  private setValue(loc: string, value: string) {
    if (!!this.sharedData) this.sharedData.setValue(loc, value);
    else (<any>this).values[loc] = value;
  }
  private deleteValue(loc: string) {
    if (!!this.sharedData) this.sharedData.deleteValue(loc);
    else delete (<any>this).values[loc];
  }
  private getValuesKeys(): string[] {
    if (!!this.sharedData) return this.sharedData.getValuesKeys();
    return Object.keys(this.values);
  }
}
