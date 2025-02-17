import { Helpers } from "./helpers";
import { surveyLocalization, getLocaleString } from "./surveyStrings";
import { settings } from "./settings";
import { Base, EventBase } from "./base";
import { Serializer } from "./jsonobject";
import { SurveyElementCore } from "./survey-element";

export interface ILocalizableOwner {
  getLocale(): string;
  getMarkdownHtml(text: string, name: string): string;
  getProcessedText(text: string): string;
  getRenderer(name: string): string;
  getRendererContext(locStr: LocalizableString): any;
}
export interface ILocalizableString {
  getLocaleText(loc: string): string;
  setLocaleText(loc: string, newValue: string): any;
  getJson(): any;
  getLocales(): Array<string>;
  getIsMultiple(): boolean;
}
/**
 * The class represents the string that supports multi-languages and markdown.
 * It uses in all objects where support for multi-languages and markdown is required.
 */
export class LocalizableString implements ILocalizableString {
  public static SerializeAsObject: boolean = false;
  public static get defaultLocale(): string {
    return settings.localization.defaultLocaleName;
  }
  public static set defaultLocale(val: string) {
    settings.localization.defaultLocaleName = val;
  }
  public static defaultRenderer = "sv-string-viewer";
  public static editableRenderer = "sv-string-editor";

  private values: any = {};
  private htmlValues = {};
  private renderedText: string;
  private calculatedTextValue: string;
  private _localizationName: string;
  public get localizationName(): string {
    return this._localizationName;
  }
  public set localizationName(val: string) {
    if (this._localizationName != val) {
      this._localizationName = val;
      this.strChanged();
    }
  }
  private _allowLineBreaks: boolean;
  public get allowLineBreaks(): boolean {
    if (this._allowLineBreaks === undefined) {
      this._allowLineBreaks = false;
      if (!!this.name && this.owner instanceof SurveyElementCore) {
        this._allowLineBreaks = Serializer.findProperty((this.owner as SurveyElementCore).getType(), this.name)?.type == "text";
      }
    }
    return this._allowLineBreaks;
  }
  public onGetTextCallback: (str: string, nonProcessedText?: string) => string;
  public storeDefaultText: boolean;
  public serializeCallBackText: boolean;
  public onGetLocalizationTextCallback: (str: string) => string;
  public onStrChanged: (oldValue: string, newValue: string) => void;
  public onSearchChanged: () => void;
  public sharedData: LocalizableString;
  public searchText: string;
  public searchIndex: number;
  public disableLocalization: boolean;
  public defaultValue: string;
  constructor(public owner: ILocalizableOwner, public useMarkdown: boolean = false,
    public name?: string, locName?: string) {
    this._localizationName = locName;
    this.onCreating();
  }
  public getIsMultiple(): boolean { return false; }
  public get locale(): string {
    if (this.owner && this.owner.getLocale) {
      const res = this.owner.getLocale();
      if (!!res || !this.sharedData) return res;
    }
    if (!!this.sharedData) return this.sharedData.locale;
    return "";
  }
  public strChanged(): void {
    if(!this.isTextRequested) return;
    this.searchableText = undefined;
    if (this.renderedText === undefined && this.isEmpty && !this.onGetTextCallback && !this.localizationName) return;
    this.calculatedTextValue = this.calcText();
    if (this.renderedText !== this.calculatedTextValue) {
      this.renderedText = undefined;
      this.calculatedTextValue = undefined;
    }
    this.htmlValues = {};
    this.onChanged();
    this.onStringChanged.fire(this, {});
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
    const pureText = this.pureText;
    let res = pureText;
    if (res && this.owner && this.owner.getProcessedText && res.indexOf("{") > -1) {
      res = this.owner.getProcessedText(res);
    }
    if (this.onGetTextCallback) res = this.onGetTextCallback(res, pureText);
    return res;
  }
  private isTextRequested: boolean;
  public get pureText(): string {
    this.isTextRequested = true;
    var loc = this.locale;
    if (!loc) loc = this.defaultLoc;
    var res = this.getValue(loc);
    if (this.isValueEmpty(res) && loc === this.defaultLoc) {
      res = this.getValue(surveyLocalization.defaultLocale);
    }
    if (this.isValueEmpty(res)) {
      const dialect = this.getRootDialect(loc);
      if (!!dialect) {
        res = this.getValue(dialect);
      }
    }
    if (this.isValueEmpty(res) && loc !== this.defaultLoc) {
      res = this.getValue(this.defaultLoc);
    }
    if (this.isValueEmpty(res) && !!this.getLocalizationName()) {
      res = this.getLocalizationStr();
      if (!!this.onGetLocalizationTextCallback) {
        res = this.onGetLocalizationTextCallback(res);
      }
    }
    if (!res) res = this.defaultValue || "";
    return res;
  }
  private getRootDialect(loc: string): string {
    if (!loc) return loc;
    const index = loc.indexOf("-");
    return index > -1 ? loc.substring(0, index) : "";
  }
  private getLocalizationName(): string {
    return !!this.sharedData ? this.sharedData.localizationName : this.localizationName;
  }
  private getLocalizationStr(): string {
    const name = this.getLocalizationName();
    return !!name ? getLocaleString(name, this.locale) : "";
  }
  public get hasHtml(): boolean {
    return this.hasHtmlValue();
  }
  public get html(): string {
    if (!this.hasHtml) return "";
    return this.getHtmlValue();
  }
  public get isEmpty(): boolean {
    return this.getValuesKeys().length == 0;
  }
  public get textOrHtml(): string {
    return this.hasHtml ? this.getHtmlValue() : this.calculatedText;
  }
  public get renderedHtml(): string {
    return this.textOrHtml;
  }
  public getLocaleText(loc: string): string {
    const res = this.getLocaleTextCore(loc);
    return res ? res : "";
  }
  private getLocaleTextCore(loc: string): string {
    if (!loc) loc = this.defaultLoc;
    return this.getValue(loc);
  }
  private isLocaleTextEqualsWithDefault(loc: string, val: string): boolean {
    let res = this.getLocaleTextCore(loc);
    if (res === val) return true;
    return this.isValueEmpty(res) && this.isValueEmpty(val);
  }
  public clear(): void {
    this.setJson(undefined);
  }
  public clearLocale(loc?: string): void {
    this.setLocaleText(loc, undefined);
  }
  public setLocaleText(loc: string, value: string): void {
    loc = this.getValueLoc(loc);
    if (!!loc && value === undefined) {
      const oldValue = this.getValue(loc);
      if (oldValue !== undefined) {
        this.deleteValue(loc);
        this.fireStrChanged(loc, oldValue);
      }
      return;
    }
    if (!this.storeDefaultText && this.isLocaleTextEqualsWithDefault(loc, value)) {
      if (!this.isValueEmpty(value) || !!loc && loc !== this.defaultLoc) return;
      let dl = surveyLocalization.defaultLocale;
      let oldValue = this.getValue(dl);
      if (!!dl && !this.isValueEmpty(oldValue)) {
        this.setValue(dl, value);
        this.fireStrChanged(dl, oldValue);
      }
      return;
    }
    if (!settings.localization.storeDuplicatedTranslations &&
      !this.isValueEmpty(value) && loc && loc != this.defaultLoc &&
      !this.getValue(loc) &&
      value == this.getLocaleText(this.defaultLoc)
    )
      return;
    var curLoc = this.curLocale;
    if (!loc) loc = this.defaultLoc;
    var oldValue = this.onStrChanged && loc === curLoc ? this.pureText : undefined;
    delete (<any>this).htmlValues[loc];
    if (this.isValueEmpty(value)) {
      this.deleteValue(loc);
    } else {
      if (typeof value === "string") {
        if (this.canRemoveLocValue(loc, value)) {
          this.setLocaleText(loc, null);
        } else {
          this.setValue(loc, value);
          if (loc == this.defaultLoc) {
            this.deleteValuesEqualsToDefault(value);
          }
        }
      }
    }
    this.fireStrChanged(loc, oldValue);
  }
  private isValueEmpty(val: string): boolean {
    if (val === undefined || val === null) return true;
    if (this.localizationName) return false;
    return val === "";
  }
  private get curLocale(): string {
    return !!this.locale ? this.locale : this.defaultLoc;
  }
  private canRemoveLocValue(loc: string, val: string): boolean {
    if (settings.localization.storeDuplicatedTranslations) return false;
    if (loc === this.defaultLoc) return false;
    const dialect = this.getRootDialect(loc);
    if (!!dialect) {
      const dialectVal = this.getLocaleText(dialect);
      if (!!dialectVal) return dialectVal == val;
      return this.canRemoveLocValue(dialect, val);
    } else {
      return val == this.getLocaleText(this.defaultLoc);
    }
  }
  private fireStrChanged(loc: string, oldValue: string) {
    this.strChanged();
    if (!this.onStrChanged) return;
    const value = this.pureText;
    if (loc !== this.curLocale || oldValue !== value) {
      this.onStrChanged(oldValue, value);
    }
  }
  public hasNonDefaultText(): boolean {
    var keys = this.getValuesKeys();
    if (keys.length == 0) return false;
    return keys.length > 1 || keys[0] != this.defaultLoc;
  }
  public getLocales(): Array<string> {
    var keys = this.getValuesKeys();
    if (keys.length == 0) return [];
    return keys;
  }
  public getJson(): any {
    if (!!this.sharedData) return this.sharedData.getJson();
    const keys = this.getValuesKeys();
    if (keys.length == 0) {
      if(this.serializeCallBackText) {
        const text = this.calcText();
        if(!!text) return text;
      }
      return null;
    }
    if (
      keys.length == 1 &&
      keys[0] == settings.localization.defaultLocaleName &&
      !settings.serialization.localizableStringSerializeAsObject
    )
      return (<any>this).values[keys[0]];
    const res: any = {};
    for (let key in this.values) {
      res[key] = this.values[key];
    }
    return res;
  }
  public setJson(value: any, isLoading?: boolean): void {
    if (!!this.sharedData) {
      this.sharedData.setJson(value, isLoading);
      return;
    }
    this.values = {};
    this.htmlValues = {};
    if (value === null || value === undefined) return;
    if (isLoading) {
      if (typeof value === "string") {
        this.values[settings.defaultLocaleName] = value;
      } else {
        this.values = value;
        delete this.values["pos"];
      }
    } else {
      if (typeof value === "string") {
        this.setLocaleText(null, value);
      } else {
        for (var key in value) {
          this.setLocaleText(key, value[key]);
        }
      }
      this.strChanged();
    }
  }
  public get renderAs(): string {
    if (!this.owner || typeof this.owner.getRenderer !== "function") {
      return LocalizableString.defaultRenderer;
    }
    return this.owner.getRenderer(this.name) || LocalizableString.defaultRenderer;
  }
  public get renderAsData(): any {
    if (!this.owner || typeof this.owner.getRendererContext !== "function") {
      return this;
    }
    return this.owner.getRendererContext(this) || this;
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
  public onChanged(): void { }
  public onStringChanged: EventBase<LocalizableString> = new EventBase<LocalizableString>();
  protected onCreating(): void { }
  private hasHtmlValue(): boolean {
    if (!this.owner || !this.useMarkdown) return false;
    let loc = this.locale;
    if (!loc) loc = this.defaultLoc;
    if ((<any>this).htmlValues[loc] !== undefined) return !!(<any>this).htmlValues[loc];
    let renderedText = this.calculatedText;
    if (!renderedText) {
      this.setHtmlValue(loc, "");
      return false;
    }
    if (!!this.getLocalizationName() && renderedText === this.getLocalizationStr()) {
      this.setHtmlValue(loc, "");
      return false;
    }
    const res = this.owner.getMarkdownHtml(renderedText, this.name);
    this.setHtmlValue(loc, res);
    return !!res;
  }
  private setHtmlValue(loc: string, val: string): void {
    (<any>this).htmlValues[loc] = val;
  }
  public getHtmlValue(): string {
    var loc = this.locale;
    if (!loc) loc = this.defaultLoc;
    return (<any>this).htmlValues[loc];
  }
  private deleteValuesEqualsToDefault(defaultValue: string) {
    if (settings.localization.storeDuplicatedTranslations) return;
    var keys = this.getValuesKeys();
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == this.defaultLoc) continue;
      if (this.getValue(keys[i]) == defaultValue) {
        this.deleteValue(keys[i]);
      }
    }
  }
  private getValue(loc: string): string {
    if (!!this.sharedData) return this.sharedData.getValue(loc);
    return (<any>this).values[this.getValueLoc(loc)];
  }
  private setValue(loc: string, value: string) {
    if (!!this.sharedData) this.sharedData.setValue(loc, value);
    else (<any>this).values[this.getValueLoc(loc)] = value;
  }
  private deleteValue(loc: string) {
    if (!!this.sharedData) this.sharedData.deleteValue(loc);
    else delete (<any>this).values[this.getValueLoc(loc)];
  }
  private getValueLoc(loc: string): string {
    if (this.disableLocalization) return settings.localization.defaultLocaleName;
    return loc;
  }
  private getValuesKeys(): string[] {
    if (!!this.sharedData) return this.sharedData.getValuesKeys();
    return Object.keys(this.values);
  }
  private get defaultLoc(): string {
    return settings.localization.defaultLocaleName;
  }
}
/**
 * The class represents the list of strings that supports multi-languages.
 */
export class LocalizableStrings implements ILocalizableString {
  private values: any = {};
  public onValueChanged: (oldValue: any, newValue: any) => void;
  constructor(public owner: ILocalizableOwner) { }
  public getIsMultiple(): boolean { return true; }
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
      var defLoc = settings.localization.defaultLocaleName;
      if (loc !== defLoc && this.values[defLoc]) return this.values[defLoc];
    }
    return [];
  }
  public setValue(loc: string, val: Array<string>) {
    loc = this.getLocale(loc);
    const oldValue = Helpers.createCopy(this.values);
    if (!val || val.length == 0) {
      delete this.values[loc];
    } else {
      this.values[loc] = val;
    }
    if (!!this.onValueChanged) {
      this.onValueChanged(oldValue, this.values);
    }
  }
  public hasValue(loc: string = ""): boolean {
    return !this.isEmpty && this.getValue(loc).length > 0;
  }
  public get isEmpty(): boolean {
    return this.getValuesKeys().length == 0;
  }
  private getLocale(loc: string): string {
    if (!!loc) return loc;
    loc = this.locale;
    return !!loc ? loc : settings.localization.defaultLocaleName;
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
      keys[0] == settings.localization.defaultLocaleName &&
      !settings.serialization.localizableStringSerializeAsObject
    ) return (<any>this).values[keys[0]];
    return Helpers.createCopy(this.values);
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
