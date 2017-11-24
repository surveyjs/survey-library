export interface ILocalizableOwner {
  getLocale(): string;
  getMarkdownHtml(text: string): string;
}
/**
 * The class represents the string that supports multi-languages and markdown.
 * It uses in all objects where support for multi-languages and markdown is required.
 */
export class LocalizableString {
  public static defaultLocale: string = "default";
  private values = {};
  private htmlValues = {};
  public onRenderedHtmlCallback: (html: string) => string;
  public onGetTextCallback: (str: string) => string = null;
  constructor(
    public owner: ILocalizableOwner,
    public useMarkdown: boolean = false
  ) {
    this.onCreating();
  }
  public get locale() {
    return this.owner ? this.owner.getLocale() : "";
  }
  public get text(): string {
    var res = this.pureText;
    if (this.onGetTextCallback) res = this.onGetTextCallback(res);
    return res;
  }
  public get pureText() {
    var loc = this.locale;
    if (!loc) loc = LocalizableString.defaultLocale;
    var res = this.values[loc];
    if (!res && loc !== LocalizableString.defaultLocale) {
      res = this.values[LocalizableString.defaultLocale];
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
    var res = this.values[loc];
    return res ? res : "";
  }
  public setLocaleText(loc: string, value: string) {
    if (value == this.getLocaleText(loc)) return;
    if (!loc) loc = LocalizableString.defaultLocale;
    delete this.htmlValues[loc];
    if (!value) {
      if (this.values[loc]) delete this.values[loc];
    } else {
      if (typeof value === "string") {
        if (
          loc != LocalizableString.defaultLocale &&
          value == this.getLocaleText(LocalizableString.defaultLocale)
        ) {
          this.setLocaleText(loc, null);
        } else {
          this.values[loc] = value;
          if (loc == LocalizableString.defaultLocale) {
            this.deleteValuesEqualsToDefault(value);
          }
        }
      }
    }
    this.onChanged();
  }
  public getJson(): any {
    var keys = Object.keys(this.values);
    if (keys.length == 0) return null;
    if (keys.length == 1 && keys[0] == LocalizableString.defaultLocale)
      return this.values[keys[0]];
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
    this.onChanged();
  }
  public onChanged() {}
  protected onCreating() {}
  private hasHtmlValue(): boolean {
    if (!this.owner || !this.useMarkdown) return false;
    var text = this.text;
    if (!text) return false;
    var loc = this.locale;
    if (!loc) loc = LocalizableString.defaultLocale;
    if (!(loc in this.htmlValues)) {
      this.htmlValues[loc] = this.owner.getMarkdownHtml(text);
    }
    return this.htmlValues[loc] ? true : false;
  }
  private getHtmlValue(): string {
    var loc = this.locale;
    if (!loc) loc = LocalizableString.defaultLocale;
    return this.htmlValues[loc];
  }

  private deleteValuesEqualsToDefault(defaultValue: string) {
    var keys = Object.keys(this.values);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == LocalizableString.defaultLocale) continue;
      if (this.values[keys[i]] == defaultValue) delete this.values[keys[i]];
    }
  }
}
