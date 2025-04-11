import { Base } from "../base";
import { ISurvey } from "../base-interfaces";
import { JsonObject, Serializer, property } from "../jsonobject";
import { IInputMask, IMaskedInputResult, ITextInputParams } from "./mask_utils";

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

  public owner: ISurvey;

  public getSurvey(live: boolean = false): ISurvey {
    return this.owner as any;
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
  public getTextAlignment(): "left" | "right" | "auto" { return "auto"; }

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