import { Base } from "./base";
import { ISurvey } from "./base-interfaces";
import { Serializer } from "./jsonobject";
import { property } from "./decorators";
import { ILocaleData, getLocaleDataLocales, canonicalizeLocale } from "./locale-data";

// The Creator groups the properties of the object under this category.
export const regionalFormatCategory = "regionalFormat";

/**
 * Configures date, time, number, and currency formats for input masks throughout a survey.
 *
 * Access this object through the survey's [`regionalFormat`](/form-library/documentation/api-reference/survey-data-model#regionalFormat) property.
 *
 * Set [`locale`](#locale) to select default formats independently of the survey's display language, or specify individual properties to override the locale defaults.
 *
 * Settings in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object take precedence over these survey-wide settings.
 */
export class RegionalFormat extends Base implements ILocaleData {
  public owner: ISurvey;

  /**
   * A date pattern for [date-time input masks](/form-library/documentation/api-reference/inputmaskdatetime).
   *
   * The pattern can contain separator characters and the following placeholders:
   *
   * - `m` - Month number.
   * - `mm` - Month number, with leading zero for single-digit values.
   * - `d` - Day of the month.
   * - `dd` - Day of the month, with leading zero for single-digit values.
   * - `yy` - Last two digits of the year.
   * - `yyyy` - A four-digit year.
   *
   * Examples: `"mm/dd/yyyy"`, `"yyyy-mm-dd"`, `"dd.mm.yy"`
   *
   * An explicit [`pattern`](/form-library/documentation/api-reference/inputmaskdatetime#pattern) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.
   *
   * Default value: `undefined` (uses the [format locale](#locale)'s date pattern)
   * @see timePattern
   */
  @property() datePattern: string;
  /**
   * A time pattern for [date-time input masks](/form-library/documentation/api-reference/inputmaskdatetime).
   *
   * The pattern can contain separator characters and the following placeholders:
   *
   * - `H` - Hours in 24-hour format.
   * - `HH` - Hours in 24-hour format, with leading zero for single-digit values.
   * - `h` - Hours in 12-hour format.
   * - `hh` - Hours in 12-hour format, with leading zero for single-digit values.
   * - `MM` - Minutes.
   * - `ss` - Seconds.
   * - `TT` - 12-hour clock period in uppercase (AM/PM).
   * - `tt` - 12-hour clock period in lowercase (am/pm).
   *
   * Examples: `"HH:MM"`, `"HH:MM:ss"`, `"hh:MM TT"`
   *
   * An explicit [`pattern`](/form-library/documentation/api-reference/inputmaskdatetime#pattern) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.
   *
   * Default value: `undefined` (uses the [format locale](#locale)'s time pattern)
   * @see datePattern
   */
  @property() timePattern: string;
  /**
   * A symbol that separates the integer and fractional parts of a displayed number in [numeric](/form-library/documentation/api-reference/inputmasknumeric) and [currency input masks](/form-library/documentation/api-reference/inputmaskcurrency).
   *
   * An explicit [`decimalSeparator`](/form-library/documentation/api-reference/inputmasknumeric#decimalSeparator) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.
   *
   * Default value: `undefined` (uses the [format locale](#locale)'s decimal separator)
   * @see thousandsSeparator
   */
  @property() decimalSeparator: string;
  /**
   * A symbol that separates the digits of a large number into groups of three in [numeric](/form-library/documentation/api-reference/inputmasknumeric) and [currency input masks](/form-library/documentation/api-reference/inputmaskcurrency).
   *
   * Set this property to an empty string to disable grouping. Grouping is also disabled if the separator matches the mask's [`decimalSeparator`](#decimalSeparator).
   *
   * An explicit [`thousandsSeparator`](/form-library/documentation/api-reference/inputmasknumeric#thousandsSeparator) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.
   *
   * Default value: `undefined` (uses the [format locale](#locale)'s thousands separator)
   */
  @property() thousandsSeparator: string;
  /**
   * A currency symbol or code displayed by [currency input masks](/form-library/documentation/api-reference/inputmaskcurrency), for example, `"$"` or `"USD"`.
   *
   * The symbol's position is specified by the `@` token in [`currencyPattern`](#currencyPattern). A pattern without this token displays no symbol.
   *
   * An explicit [`currencySymbol`](/form-library/documentation/api-reference/inputmaskcurrency#currencySymbol) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.
   *
   * Default value: `undefined` (uses the [format locale](#locale)'s currency symbol)
   */
  @property() currencySymbol: string;
  /**
   * A pattern that specifies the position of the number, currency symbol, and minus sign in [currency input masks](/form-library/documentation/api-reference/inputmaskcurrency).
   *
   * The pattern supports the following tokens:
   *
   * - `#` &ndash; The formatted number, including decimal and thousands separators. Required exactly once.
   * - `@` &ndash; *(Optional)* The [currency symbol](#currencySymbol).
   * - `-` &ndash; *(Optional)* The minus sign for negative values. Omitted for positive values. If this token is absent, the minus sign appears at the beginning of a negative value.
   *
   * Other characters are displayed as literal text. Digits and control characters are not allowed.
   *
   * Examples:
   *
   * - `"@#"` &rarr; `$1.2`
   * - `"#@"` &rarr; `1.2$`
   * - `"@ -#"` &rarr; `$ -1.2`
   *
   * An explicit [`currencyPattern`](/form-library/documentation/api-reference/inputmaskcurrency#currencyPattern) value in an individual question's [`maskSettings`](/form-library/documentation/api-reference/text-entry-question-model#maskSettings) object overrides this setting.
   *
   * Default value: `undefined` (uses the [format locale](#locale)'s currency pattern)
   */
  @property() currencyPattern: string;

  /**
   * The locale used to resolve default date, time, number, and currency formats for input masks.
   *
   * This property affects formatting only. The survey's [`locale`](/form-library/documentation/api-reference/survey-data-model#locale) property controls the language of survey texts.
   *
   * Use a BCP 47 language tag, such as `"de"`, `"en-GB"`, or `"pt-BR"`. If a format is unavailable for the specified locale, the language's format is used, with the English format as a fallback. Format properties in this object override these locale defaults.
   *
   * Default value: `undefined` (uses the survey's locale)
   */
  public get locale(): string {
    return this.getPropertyValue("locale");
  }
  public set locale(val: string) {
    this.setPropertyValue("locale", canonicalizeLocale(val) || undefined);
  }

  // Called once after this object has loaded a JSON of its own, with the names of the fields the
  // load actually changed. Base suppresses property events while an object loads, so a direct
  // regionalFormat.fromJSON(...) reports itself here and nowhere else.
  public loadingCompletedCallback: (changedNames: Array<string>) => void;

  public getType(): string {
    return "regionalformat";
  }
  public startLoadingFromJson(json?: any): void {
    super.startLoadingFromJson(json);
    this.storedValuesBeforeLoad = this.getStoredValues();
  }
  public endLoadingFromJson(): void {
    super.endLoadingFromJson();
    const before = this.storedValuesBeforeLoad;
    this.storedValuesBeforeLoad = undefined;
    if (!before || !this.loadingCompletedCallback) return;
    const after = this.getStoredValues();
    // an omitted key keeps its stored value (JsonObject visits only supplied keys), so what
    // changed is the difference, not the set of keys the JSON carried
    const changedNames = Object.keys(after).filter(name => after[name] !== before[name]);
    if (changedNames.length > 0) {
      this.loadingCompletedCallback(changedNames);
    }
  }
  public dispose(): void {
    super.dispose();
    this.loadingCompletedCallback = undefined;
  }
  private storedValuesBeforeLoad: { [name: string]: any };
  private getStoredValues(): { [name: string]: any } {
    const res: { [name: string]: any } = {};
    Serializer.getProperties(this.getType()).forEach(prop => {
      res[prop.name] = this.getExplicitPropertyValue(prop.name);
    });
    return res;
  }
  // Base.setPropertyValue treats "" and unset as equal and would neither store the one over the
  // other nor notify; here "" is a stored value (thousandsSeparator: "" disables grouping), so an
  // assignment is stored and notified whenever it differs from what is stored.
  public setPropertyValue(name: string, val: any): void {
    if (this.isDisposed) return;
    const oldValue = this.getPropertyValueWithoutDefault(name);
    if (val === oldValue) return;
    this.setPropertyValueDirectly(name, val);
    this.propertyValueChanged(name, oldValue, val);
  }
  public getSurvey(live: boolean = false): ISurvey {
    return this.owner;
  }
  // True when no field is stored. Not truthiness: thousandsSeparator: "" ("disable grouping
  // survey-wide") is a stored value, and treating it as empty would drop the object from JSON
  // and turn it into "inherit grouping" on reload.
  public get isEmpty(): boolean {
    return Serializer.getProperties(this.getType()).every(prop => this.getExplicitPropertyValue(prop.name) === undefined);
  }
  // The stored value, or undefined when the field inherits the locale default.
  public getExplicitPropertyValue(name: string): any {
    return this.getPropertyValueWithoutDefault(name);
  }
}

// onSerializeValue writes the stored value whenever there is one, including "" and a value equal
// to the locale default: the serializer would otherwise treat "" as a default (no static default
// exists) and drop it. The single-character limit on the separators mirrors the numeric mask's
// registration so that the property grid enforces it.
function serializeStoredValue(name: string): (obj: RegionalFormat) => any {
  return (obj: RegionalFormat) => obj.getExplicitPropertyValue(name);
}
Serializer.addClass(
  "regionalformat",
  [
    {
      name: "locale:string",
      category: regionalFormatCategory,
      choices: () => getLocaleDataLocales(),
      onSerializeValue: serializeStoredValue("locale"),
    },
    { name: "datePattern:string", category: regionalFormatCategory, onSerializeValue: serializeStoredValue("datePattern") },
    { name: "timePattern:string", category: regionalFormatCategory, onSerializeValue: serializeStoredValue("timePattern") },
    { name: "decimalSeparator:string", category: regionalFormatCategory, maxLength: 1, onSerializeValue: serializeStoredValue("decimalSeparator") },
    { name: "thousandsSeparator:string", category: regionalFormatCategory, maxLength: 1, onSerializeValue: serializeStoredValue("thousandsSeparator") },
    { name: "currencySymbol:string", category: regionalFormatCategory, onSerializeValue: serializeStoredValue("currencySymbol") },
    { name: "currencyPattern:string", category: regionalFormatCategory, onSerializeValue: serializeStoredValue("currencyPattern") },
  ],
  function () {
    return new RegionalFormat();
  }
);
