import { Base } from "../base";
import { Serializer, property } from "../jsonobject";
import { IInputMaskType, IMaskedValue, ITextMaskInputArgs } from "./mask_manager";

export class InputMaskBase extends Base implements IInputMaskType {
  @property() dataToSave: "masked" | "unmasked";

  public getType(): string {
    return "masksettings";
  }
  public isEmpty(): boolean {
    return true;
  }
  public setData(json: any) {
    this.clear();
    if (json.dataToSave) this.dataToSave = json.dataToSave;

    // var properties = this.getCustomPropertiesNames();
    // for (var i = 0; i < properties.length; i++) {
    //   if (json[properties[i]]) (<any>this)[properties[i]] = json[properties[i]];
    // }
  }
  public getData(): any {
    if (this.isEmpty()) return null;

    var res: any = {};
    if (this.dataToSave) res["dataToSave"] = this.dataToSave;

    // var properties = this.getCustomPropertiesNames();
    // for (var i = 0; i < properties.length; i++) {
    //   if ((<any>this)[properties[i]])
    //     res[properties[i]] = (<any>this)[properties[i]];
    // }
    return res;
  }

  public clear(): void {
    this.dataToSave = undefined;
    // var properties = this.getCustomPropertiesNames();
    // for (var i = 0; i < properties.length; i++) {
    //   if ((<any>this)[properties[i]]) (<any>this)[properties[i]] = "";
    // }
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