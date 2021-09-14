import { Helpers } from "./helpers";
import { surveyLocalization } from "./surveyStrings";
import { settings } from "./settings";

export interface ILocalizableOwner {
  getLocale(): string;
  getMarkdownHtml(text: string, name: string): string;
  getProcessedText(text: string): string;
  getRenderer(name: string): string;
}
export interface ILocalizableString {
  getLocaleText(loc: string): string;
  setLocaleText(loc: string, newValue: string): any;
  getLocales(): Array<string>;
}
/**
 * The class represents the string that supports multi-languages and markdown.
 * It uses in all objects where support for multi-languages and markdown is required.
 */
export class LocalizableString implements ILocalizableString {
  public static SerializeAsObject: boolean = false;
  public static get defaultLocale(): string {
    return settings.defaultLocaleName;
  }
  public static set defaultLocale(val: string) {
    settings.defaultLocaleName = val;
  }
  public static defaultRenderer = "sv-string-viewer";
  public static editableRenderer = "sv-string-editor";
  private values = {};
  private htmlValues = {};
  private renderedText: string;
  private calculatedTextValue: string;
  public localizationName: string;
  public onGetTextCallback: (str: string) => string;
  public onStrChanged: (oldValue: string, newValue: string) => void;
  public onSearchChanged: () => void;
  public sharedData: LocalizableString;
  public searchText: string;
  public searchIndex: number;
  constructor(
    public owner: ILocalizableOwner,
    public useMarkdown: boolean = false,
    public name?: string
  ) {
    this.onCreating();
  }
  public get locale() {
    return this.owner && this.owner.getLocale ? this.owner.getLocale() : "";
  }
  public strChanged() {
    this.searchableText = undefined;
    if (this.renderedText === undefined) return;
    this.calculatedTextValue = this.calcText();
    if (this.renderedText !== this.calculatedTextValue) {
      this.renderedText = undefined;
      this.calculatedTextValue = undefined;
    }
    this.onChanged();
  }
  public get text(): string {
    return this.pureText;
  }
  public set text(value: string) {
    this.setLocaleText(this.locale, value);
  }
  public get calculatedText(): string {
    this.renderedText =
      this.calculatedTextValue !== undefined
        ? this.calculatedTextValue
        : this.calcText();
    this.calculatedTextValue = undefined;
    return this.renderedText;
  }
  private calcText(): string {
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
    if (!res && !!this.localizationName) {
      res = surveyLocalization.getString(this.localizationName);
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
    var curLoc = this.locale;
    if (!loc) loc = settings.defaultLocaleName;
    if (!curLoc) curLoc = settings.defaultLocaleName;
    var hasOnStrChanged = this.onStrChanged && loc === curLoc;
    var oldValue = hasOnStrChanged ? this.pureText : undefined;

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
    if (hasOnStrChanged) {
      this.onStrChanged(oldValue, value);
    }
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
  public get renderAs(): string {
    if (!this.owner) {
      return LocalizableString.defaultRenderer;
    }
    if (typeof this.owner.getRenderer !== "function") {
      return LocalizableString.defaultRenderer;
    }
    return (
      this.owner.getRenderer(this.name) || LocalizableString.defaultRenderer
    );
  }
  public equals(obj: any): boolean {
    if (!!this.sharedData) return this.sharedData.equals(obj);
    if (!obj || !obj.values) return false;
    return Helpers.isTwoValueEquals(this.values, obj.values, false, true, false);
  }
  private searchableText: string;
  public setFindText(text: string): boolean {
    if (this.searchText == text) return;
    this.searchText = text;
    if (!this.searchableText) {
      let textOrHtml = this.textOrHtml;
      this.searchableText = !!textOrHtml ? textOrHtml.toLowerCase() : "";
    }
    var str = this.searchableText;
    var index = !!str && !!text ? str.indexOf(text) : undefined;
    if (index < 0) index = undefined;
    if (index != undefined || this.searchIndex != index) {
      this.searchIndex = index;
      if (!!this.onSearchChanged) {
        this.onSearchChanged();
      }
    }
    return this.searchIndex != undefined;
  }
  public onChanged() {}
  protected onCreating() {}
  private hasHtmlValue(): boolean {
    if (!this.owner || !this.useMarkdown) return false;
    var renderedText = this.calculatedText;
    if (!renderedText) return false;
    var loc = this.locale;
    if (!loc) loc = settings.defaultLocaleName;
    (<any>this).htmlValues[loc] = this.owner.getMarkdownHtml(
      renderedText,
      this.name
    );
    return (<any>this).htmlValues[loc] ? true : false;
  }
  public getHtmlValue(): string {
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
/**
 * The class represents the list of strings that supports multi-languages.
 */
export class LocalizableStrings implements ILocalizableString {
  private values: any = {};
  constructor(public owner: ILocalizableOwner) {}
  public get locale() {
    return this.owner && this.owner.getLocale ? this.owner.getLocale() : "";
  }
  public get value(): Array<string> {
    return this.getValue("");
  }
  public set value(val: Array<string>) {
    this.setValue("", val);
  }
  public get text(): string {
    return Array.isArray(this.value) ? this.value.join("\n") : "";
  }
  public set text(val: string) {
    this.value = !!val ? val.split("\n") : [];
  }
  public getLocaleText(loc: string): string {
    var res = this.getValueCore(loc, !loc || loc === this.locale);
    if (!res || !Array.isArray(res) || res.length == 0) return "";
    return res.join("\n");
  }
  public setLocaleText(loc: string, newValue: string): any {
    var val = !!newValue ? newValue.split("\n") : null;
    this.setValue(loc, val);
  }
  public getValue(loc: string): Array<string> {
    return this.getValueCore(loc);
  }
  private getValueCore(loc: string, useDefault: boolean = true): Array<string> {
    loc = this.getLocale(loc);
    if (this.values[loc]) return this.values[loc];
    if (useDefault) {
      var defLoc = settings.defaultLocaleName;
      if (loc !== defLoc) return this.values[defLoc];
    }
    return [];
  }
  public setValue(loc: string, val: Array<string>) {
    loc = this.getLocale(loc);
    if (!val || val.length == 0) {
      delete this.values[loc];
    } else {
      this.values[loc] = val;
    }
  }
  public get isEmpty(): boolean {
    return this.getValuesKeys().length == 0;
  }
  private getLocale(loc: string): string {
    if (!!loc) return loc;
    loc = this.locale;
    return !!loc ? loc : settings.defaultLocaleName;
  }
  public getLocales(): Array<string> {
    var keys = this.getValuesKeys();
    if (keys.length == 0) return [];
    return keys;
  }
  public getJson(): any {
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
    this.values = {};
    if (!value) return;
    if (Array.isArray(value)) {
      this.setValue(null, value);
    } else {
      for (var key in value) {
        this.setValue(key, value[key]);
      }
    }
  }
  private getValuesKeys(): string[] {
    return Object.keys(this.values);
  }
}
