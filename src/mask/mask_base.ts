import { Base } from "../base";
import { JsonObject, Serializer, property } from "../jsonobject";
import { IInputMask, IMaskedInputResult, ITextInputParams } from "./mask_utils";

export class InputMaskBase extends Base implements IInputMask {
  /**
   * Specifies whether to store the question value with an applied mask in survey results.
   *
   * Default value: `false`
   */
  @property() saveMaskedValue: boolean;

  public getType(): string {
    return "masksettings";
  }

  public setData(json: any): void {
    const properties = Serializer.getProperties(this.getType());
    properties.forEach(property => {
      const currentValue = json[property.name];
      (this as any)[property.name] = currentValue !== undefined ? currentValue : property.defaultValue;
    });
  }
  public getData(): any {
    const res: any = {};
    const properties = Serializer.getProperties(this.getType());
    properties.forEach(property => {
      const currentValue = (this as any)[property.name];
      if(!property.isDefaultValue(currentValue)) {
        res[property.name] = currentValue;
      }
    });

    return res;
  }

  // public get maskedInputValue(): string {
  //   return this.input.value;
  // }
  // public get unmaskedInputValue(): string {
  //   return this.getUnmaskedValue(this.input.value, true);
  // }

  public processInput(args: ITextInputParams): IMaskedInputResult {
    return { value: args.prevValue, caretPosition: args.selectionEnd, cancelPreventDefault: false };
  }

  public getUnmaskedValue(src: string): any { return src; }
  public getMaskedValue(src: any): string { return src; }
}

Serializer.addClass(
  "masksettings",
  [
    {
      name: "saveMaskedValue:boolean",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.getType() !== "masksettings";
      },
    },
  ],
  function () {
    return new InputMaskBase();
  }
);