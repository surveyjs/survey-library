import { IInputMaskType, IMaskedValue, ITextMaskInputArgs } from "./mask_manager";
import { IMaskSettings } from "./mask_settings";

export class InputMaskBase implements IInputMaskType {

  constructor(protected maskOptions: IMaskSettings) { }

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