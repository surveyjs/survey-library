import { IInputMaskType, IMaskOption, IMaskedValue, ITextMaskInputArgs } from "./mask_manager";

export class InputMaskBase implements IInputMaskType {

  constructor(protected maskOptions: IMaskOption) { }

  // public get maskedInputValue(): string {
  //   return this.input.value;
  // }
  // public get unmaskedInputValue(): string {
  //   return this.getUnmaskedValue(this.input.value, true);
  // }

  public processInput(args: ITextMaskInputArgs): IMaskedValue {
    return { text: args.prevValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };
  }

  public getUnmaskedValue(src: string, matchWholeMask: boolean = false): string { return src; }
  public getMaskedValue(src: string, matchWholeMask: boolean = false): string { return src; }
}