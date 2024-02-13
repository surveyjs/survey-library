import { Serializer, property } from "../jsonobject";
import { InputMaskNumber } from "./mask_number";

export class InputMaskCurrency extends InputMaskNumber {
  @property() prefix: string;
  @property() suffix: string;

  public getType(): string {
    return "currencymask";
  }

  public isEmpty(): boolean {
    return super.isEmpty() &&
    this.prefix !== undefined &&
    this.suffix !== undefined;
  }

  // public processInput(args: ITextMaskInputArgs): IMaskedValue {
  //   return { text: args.prevValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };
  // }

  public getUnmaskedValue(src: string): string {
    const input = (src === undefined || src === null) ? "" : src;
    return input;
  }
  public getMaskedValue(src: string): string {
    const input = (src === undefined || src === null) ? "" : src;
    return input;
  }
}

Serializer.addClass(
  "currencymask",
  [
    { name: "prefix" },
    { name: "suffix" },
  ],
  () => {
    return new InputMaskCurrency();
  },
  "numbermask"
);