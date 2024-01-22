import { IInputMaskType, IMaskOption, IMaskedValue, ITextMaskInputArgs } from "./mask_manager";

export class InputMaskBase implements IInputMaskType {
  protected prevSelectionStart: number;
  protected prevInputValue: string;

  constructor(protected maskOptions: IMaskOption) { }

  // public get maskedInputValue(): string {
  //   return this.input.value;
  // }
  // public get unmaskedInputValue(): string {
  //   return this.getUnmaskedValue(this.input.value, true);
  // }

  public processInput(args: ITextMaskInputArgs): IMaskedValue {
    const result = { text: args.prevValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };

    const leftPart = args.prevValue.slice(0, args.selectionStart) + (args.insertedCharacters || "");
    if(!args.insertedCharacters && args.inputDirection === "rightToLeft") {
      result.cursorPosition = args.selectionStart;
    } else {
      result.cursorPosition = this.getMaskedValue(leftPart).length;
    }

    const src = leftPart + args.prevValue.slice(args.selectionEnd);
    result.text = this.getMaskedValue(src, true);
    return result;
  }

  public getUnmaskedValue(src: string, matchWholeMask: boolean = false): string { return src; }
  public getMaskedValue(src: string, matchWholeMask: boolean = false): string { return src; }
}