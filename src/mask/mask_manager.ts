import { HashTable } from "../helpers";
import { InputMaskBase } from "./mask_base";

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
  isEmpty(): boolean;
}

export class MaskManagerType {
  public static Instance: MaskManagerType = new MaskManagerType();
  private creatorHash: HashTable<() => IInputMaskType> = {};

  public registerMaskManagerType(maskType: string, maskCreator: () => IInputMaskType): void {
    this.creatorHash[maskType] = maskCreator;
  }

  public createInputMask(typeName: string): InputMaskBase {
    const creator = MaskManagerType.Instance.creatorHash[typeName];
    if (!!creator) return creator() as InputMaskBase;

    return new InputMaskBase();
  }
  public getAllTypes(): Array<string> {
    const result = Object.keys(this.creatorHash).sort();
    result.splice(0, 0, "none");
    return result;
  }
}
