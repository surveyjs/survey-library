import { Base } from "../base";
import { JsonObject, Serializer, property } from "../jsonobject";
import { IInputMaskType, IMaskedValue, ITextMaskInputArgs } from "./mask_utils";

export class InputMaskBase extends Base implements IInputMaskType {
  [index: string]: any;
  @property() dataToSave: "masked" | "unmasked";

  public getType(): string {
    return "masksettings";
  }
  public isEmpty(): boolean {
    return true;
  }
  public setData(json: any): void {
    const properties = Serializer.getProperties(this.getType());
    properties.forEach(property => {
      const currentValue = json[property.name];
      this[property.name] = currentValue !== undefined ? currentValue : property.defaultValue;
    });
  }
  public getData(): any {
    if (this.isEmpty()) return null;

    const res: any = {};
    const properties = Serializer.getProperties(this.getType());
    properties.forEach(property => {
      const currentValue = this[property.name];
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

  public processInput(args: ITextMaskInputArgs): IMaskedValue {
    return { text: args.prevValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };
  }

  public getUnmaskedValue(src: string): string { return src; }
  public getMaskedValue(src: string): string { return src; }
}

Serializer.addClass(
  "masksettings",
  [
    {
      name: "dataToSave",
      choices: ["masked", "unmasked"],
      default: "unmasked",
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