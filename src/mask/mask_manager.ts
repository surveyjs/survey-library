import { HashTable } from "../helpers";
import { InputMaskBase } from "./mask_base";

export interface IMaskOption {
  type: string;
  mask: string;
}

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
  getMaskedValue(src: string, matchWholeMask?: boolean): string;
  getUnmaskedValue(src: string, matchWholeMask?: boolean): string;
  processInput(args: ITextMaskInputArgs): IMaskedValue;
}

export class MaskManagerType {
  public static Instance: MaskManagerType = new MaskManagerType();
  private creatorHash: HashTable<(maskOption: IMaskOption) => IInputMaskType> = {};

  public registerMaskManagerType(maskType: string, maskCreator: (maskOption: IMaskOption) => IInputMaskType): void {
    this.creatorHash[maskType] = maskCreator;
  }

  public createInputMask(maskOption: IMaskOption): IInputMaskType {
    const creator = MaskManagerType.Instance.creatorHash[maskOption.type];
    if (!!creator) return creator(maskOption);

    return new InputMaskBase(maskOption);
  }
}
