import { Base } from "../base";
import { ISurvey, ISurveyImpl } from "../base-interfaces";
import { Serializer } from "../jsonobject";
import { property } from "../decorators";
import { IInputMask, IMaskedInputResult, IMaskLocaleChange, ITextInputParams, hasStrongRtlText } from "./mask_utils";

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

  public owner: ISurveyImpl;

  // Indicates that the displayed masked value depends on the survey locale.
  public get isLocaleDependent(): boolean { return false; }
  // Rebuilds the locale dependent state of the mask. A locale dependent mask updates the passed
  // state with the text to display and the value to store.
  public localeChanged(state?: IMaskLocaleChange): void {
    super.localeChanged();
  }

  public getSurvey(live: boolean = false): ISurvey {
    return this.owner?.getSurvey();
  }

  public getType(): string {
    return "masksettings";
  }

  public setData(json: any): void {
    const properties = Serializer.getProperties(this.getType());
    properties.forEach(property => {
      const currentValue = json[property.name];
      (this as any)[property.name] = currentValue !== undefined ? currentValue : property.getDefaultValue(this);
    });
  }
  public getData(): any {
    const res: any = {};
    const properties = Serializer.getProperties(this.getType());
    properties.forEach(property => {
      const currentValue = (this as any)[property.name];
      if (!property.isDefaultValue(currentValue)) {
        res[property.name] = currentValue;
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