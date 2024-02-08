import { Serializer, property } from "../jsonobject";
import { Base } from "../base";
import { IInputMaskType, MaskManagerType } from "./mask_manager";

export interface IMaskSettings {
  type: string;
  mask: string;
  dataToSave?: "masked" | "unmasked";
}

export class MaskSettings extends Base implements IMaskSettings {
  type: string;
  mask: string;
  dataToSave?: "masked" | "unmasked";
  allowNegative?: boolean;
  decimal?: string;
  precision?: number;
  thousands?: string;
  min?: number;
  max?: number;
  maskInstance?: IInputMaskType;

  private createMaskInstance() {
    if(this.isEmpty) return;
    this.maskInstance = MaskManagerType.Instance.createInputMask(this);
  }
  public getType(): string {
    return "masksettings";
  }
  public get isEmpty(): boolean {
    return !this.type || this.type === "none";
  }
  public setData(json: any) {
    // this.clear();
    if (json.type) this.type = json.type;
    if (json.mask) this.mask = json.mask;
    if (json.dataToSave) this.dataToSave = json.dataToSave;
    if (json.allowNegative !== undefined) this.allowNegative = json.allowNegative;
    if (json.decimal) this.decimal = json.decimal;
    if (json.precision) this.precision = json.precision;
    if (json.thousands) this.thousands = json.thousands;
    if (json.min !== undefined) this.min = json.min;
    if (json.max !== undefined) this.max = json.max;

    // var properties = this.getCustomPropertiesNames();
    // for (var i = 0; i < properties.length; i++) {
    //   if (json[properties[i]]) (<any>this)[properties[i]] = json[properties[i]];
    // }

    this.createMaskInstance();
  }
  public getData(): any {
    if (this.isEmpty) return null;

    var res: any = {};
    if (this.type) res["type"] = this.type;
    if (this.mask) res["mask"] = this.mask;
    if (this.dataToSave) res["dataToSave"] = this.dataToSave;
    if (this.allowNegative) res["allowNegative"] = this.allowNegative;
    if (this.decimal) res["decimal"] = this.decimal;
    if (this.precision) res["precision"] = this.precision;
    if (this.thousands) res["thousands"] = this.thousands;
    if (this.min !== undefined) res["min"] = this.min;
    if (this.max !== undefined) res["max"] = this.max;

    // var properties = this.getCustomPropertiesNames();
    // for (var i = 0; i < properties.length; i++) {
    //   if ((<any>this)[properties[i]])
    //     res[properties[i]] = (<any>this)[properties[i]];
    // }
    return res;
  }
}

Serializer.addClass(
  "masksettings",
  [
    { name: "type",
      choices: ["none", "pattern", "number"],
      default: "none"
    },
    { name: "mask",
      dependsOn: "type",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.type === "pattern";
      },
    },
    { name: "dataToSave",
      choices: ["masked", "unmasked"],
      default: "unmasked",
      dependsOn: "type",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.type !== "none";
      },
    },
    { name: "allowNegative:boolean",
      dependsOn: "type",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.type === "number";
      },
    },
    { name: "decimal",
      dependsOn: "type",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.type === "number";
      },
    },
    { name: "precision:number",
      dependsOn: "type",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.type === "number";
      },
    },
    { name: "thousands",
      dependsOn: "type",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.type === "number";
      },
    },
    { name: "min:number",
      dependsOn: "type",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.type === "number";
      },
    },
    { name: "max:number",
      dependsOn: "type",
      visibleIf: function(obj: any) {
        if (!obj) return false;
        return obj.type === "number";
      },
    },
  ],
  function () {
    return new MaskSettings();
  }
);