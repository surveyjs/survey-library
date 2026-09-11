import { Base } from "../base";
import { ISurvey, ISurveyImpl } from "../base-interfaces";
import { Serializer } from "../jsonobject";
import { property } from "../decorators";
import { IInputMask, IMaskedInputResult, IMaskLocaleChange, ITextInputParams, hasStrongRtlText } from "./mask_utils";
import { getLocaleDataValue, ILocaleData } from "../locale-data";
import { surveyLocalization } from "../surveyStrings";

/**
 * A base class for classes that implement input masks:
 *
 * - [`InputMaskNumeric`](https://surveyjs.io/form-library/documentation/inputmasknumeric)
 * - [`InputMaskCurrency`](https://surveyjs.io/form-library/documentation/inputmaskcurrency)
 * - [`InputMaskDateTime`](https://surveyjs.io/form-library/documentation/inputmaskdatetime)
 * - [`InputMaskPattern`](https://surveyjs.io/form-library/documentation/inputmaskpattern)
 */
export class InputMaskBase extends Base implements IInputMask {
  /**
   * Specifies whether to store the question value with an applied mask in survey results.
   *
   * Default value: `false`
   */
  @property() saveMaskedValue: boolean;

  private ownerValue: ISurveyImpl;
  private formatValues: { [field: string]: string };
  private formatValuesLocale: string;

  public get owner(): ISurveyImpl { return this.ownerValue; }
  // Attaching the mask to another owner may change every resolved format default even when the
  // locale name does not: the new survey can carry its own format overrides.
  public set owner(val: ISurveyImpl) {
    this.ownerValue = val;
    this.clearFormatValueCache();
  }

  // Indicates that the displayed masked value depends on the survey locale.
  public get isLocaleDependent(): boolean { return false; }
  // Rebuilds the locale dependent state of the mask. A locale dependent mask updates the passed
  // state with the text to display and the value to store.
  public localeChanged(state?: IMaskLocaleChange): void {
    super.localeChanged();
    this.clearFormatValueCache();
  }

  public getSurvey(live: boolean = false): ISurvey {
    return this.owner?.getSurvey();
  }

  // The locale whose formats the mask follows: the survey's format locale, then the mask's own
  // locale owner, then the currently selected one. The survey may be a stub without the method.
  protected get formatLocale(): string {
    const survey = this.getSurvey();
    const res = !!survey && !!survey.getFormatLocale ? survey.getFormatLocale() : this.getLocale();
    return res || surveyLocalization.currentLocale || surveyLocalization.defaultLocale;
  }
  // The single seam every mask asks for a format default through. Public because the serializer
  // defaultFunc closures call it on a typed instance from outside the class body.
  public getFormatValue(field: keyof ILocaleData, isValid?: (value: string) => boolean): string {
    const locale = this.formatLocale || "";
    if (this.formatValues === undefined || this.formatValuesLocale !== locale) {
      this.formatValues = {};
      this.formatValuesLocale = locale;
    }
    // a read per input character walks this, so a hit must cost no more than the lookup
    if (field in this.formatValues) return this.formatValues[field];
    let res = this.getSurveyFormatValue(field, isValid);
    if (res === undefined) {
      res = getLocaleDataValue(locale, field, isValid);
    }
    this.formatValues[field] = res;
    return res;
  }
  // An override authored in the survey's regional format outranks the curated locale data and
  // passes the same validator, so a broken override falls through to the table instead of
  // breaking the mask. The survey may be a stub without the method.
  private getSurveyFormatValue(field: keyof ILocaleData, isValid?: (value: string) => boolean): string {
    const survey = this.getSurvey();
    if (!survey || !survey.getRegionalFormatValue) return undefined;
    const res = survey.getRegionalFormatValue(field);
    if (res === undefined || res === null) return undefined;
    return !isValid || isValid(res) ? res : undefined;
  }
  // The value the cache already holds, without resolving one. A mask that re-formats an entry
  // made under the previous locale reads the old defaults here, before the cache is dropped.
  protected getCachedFormatValue(field: keyof ILocaleData): string {
    return !!this.formatValues ? this.formatValues[field] : undefined;
  }
  protected clearFormatValueCache(): void {
    this.formatValues = undefined;
    this.formatValuesLocale = undefined;
  }

  // Stores an assignment even when it equals the currently resolved default: with a locale
  // dependent default the two are different things and only an explicit value survives a locale
  // change. Base.setPropertyValue compares against the resolved value and would drop it.
  protected setExplicitPropertyValue(name: string, val: any): void {
    if (this.isDisposed) return;
    if (!this.isLoadingFromJson) {
      const prop = this.getPropertyByName(name);
      if (!!prop) {
        val = prop.settingValue(this, val);
      }
    }
    if (val === this.getPropertyValueWithoutDefault(name)) return;
    const oldValue = this.getPropertyValue(name);
    this.setPropertyValueDirectly(name, val);
    const newValue = this.getPropertyValue(name);
    if (!this.isTwoValueEquals(oldValue, newValue)) {
      this.propertyValueChanged(name, oldValue, newValue);
    }
  }
  // The stored value, or undefined when the property inherits its default.
  public getExplicitPropertyValue(name: string): any {
    return this.getPropertyValueWithoutDefault(name);
  }

  public getType(): string {
    return "masksettings";
  }

  public setData(json: any): void {
    const properties = Serializer.getProperties(this.getType());
    properties.forEach(property => {
      // an omitted key leaves the property unset instead of storing today's default: a locale
      // dependent default must keep resolving on every read, not freeze at deserialization time
      (this as any)[property.name] = json[property.name];
    });
  }
  public getData(): any {
    const res: any = {};
    const properties = Serializer.getProperties(this.getType());
    properties.forEach(property => {
      // the same routine Base.toJSON() uses, so that this path and survey.toJSON() agree on
      // computed defaults and on onSerializeValue
      const value = property.getSerializableValue(this);
      if (value !== undefined) {
        res[property.name] = value;
      }
    });

    return res;
  }

  public processInput(args: ITextInputParams): IMaskedInputResult {
    return { value: args.prevValue, caretPosition: args.selectionEnd, cancelPreventDefault: false };
  }

  public getUnmaskedValue(src: string): any { return src; }
  public getMaskedValue(src: any): string { return src; }
  // Returns the string to display in the input for a stored model value.
  // When saveMaskedValue is enabled the stored value is already masked, so it is returned as is.
  // An empty value has no masked text of its own: both save modes display the empty mask.
  public getMaskedValueBySaveMode(src: any): string {
    const isEmpty = src === undefined || src === null || src === "";
    return this.saveMaskedValue && !isEmpty ? src : this.getMaskedValue(src);
  }
  public getTextAlignment(): "left" | "right" | "auto" { return "auto"; }
  // "ltr": the masked text is a structured sequence whose field order is defined by the mask, so the
  // question renders it as a left-to-right run whatever the survey direction. "auto": leave the
  // paragraph direction alone. The base (no mask) has no opinion.
  public getInputDirection(): "ltr" | "auto" { return "auto"; }
  // The text a mask renders by itself, apart from what the respondent types: literals, separators,
  // affixes, placeholder symbols. Masks that own such text override this.
  protected getLiteralText(): string { return ""; }
  // Shared rule for every structured mask: a left-to-right run, unless the mask's own literal text is
  // strong right-to-left, in which case the natural bidi rendering is already the readable one.
  protected getInputDirectionByLiterals(): "ltr" | "auto" {
    return hasStrongRtlText(this.getLiteralText()) ? "auto" : "ltr";
  }

  public getTypeForExpressions(): string {
    return "text";
  }
}

Serializer.addClass(
  "masksettings",
  [
    {
      name: "saveMaskedValue:boolean",
      visibleIf: function (obj: any) {
        if (!obj) return false;
        return obj.getType() !== "masksettings";
      },
    },
  ],
  function () {
    return new InputMaskBase();
  }
);