import { HashTable } from "../helpers";
import { InputMaskBase } from "./mask_base";
import { IMaskSettings } from "./mask_settings";

export interface IMaskedValue {
  text: string;
  cursorPosition: number;
  cancelPreventDefault: boolean;
}

export interface ITextMaskInputArgs {
  prevValue: string;
  selectionStart: number;
  selectionEnd: number;
  insertedCharacters: string | null;
  inputDirection?: "leftToRight" | "rightToLeft";
}

export interface IInputMaskType {
  getMaskedValue(src: string): string;
  getUnmaskedValue(src: string): string;
  processInput(args: ITextMaskInputArgs): IMaskedValue;
}

export class MaskManagerType {
  public static Instance: MaskManagerType = new MaskManagerType();
  private creatorHash: HashTable<(maskOption: IMaskSettings) => IInputMaskType> = {};

  public registerMaskManagerType(maskType: string, maskCreator: (maskOption: IMaskSettings) => IInputMaskType): void {
    this.creatorHash[maskType] = maskCreator;
  }

  public createInputMask(maskOption: IMaskSettings): IInputMaskType {
    const creator = MaskManagerType.Instance.creatorHash[maskOption.type];
    if (!!creator) return creator(maskOption);

    return new InputMaskBase(maskOption);
  }
  public getAllTypes(): Array<string> {
    var result = new Array<string>();
    for (var key in this.creatorHash) {
      result.push(key);
    }
    return result.sort();
  }
}
