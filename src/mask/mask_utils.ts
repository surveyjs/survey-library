export var numberDefinition = /[0-9]/;

export interface IMaskedValue {
  value: string;
  caretPosition: number;
  cancelPreventDefault?: boolean;
}

export interface ITextMaskInputArgs {
  prevValue: string;
  selectionStart: number;
  selectionEnd: number;
  insertedChars: string | null;
  inputDirection?: "forward" | "backward";
}

export interface IInputMask {
  getMaskedValue(src: any): string;
  getUnmaskedValue(src: string): any;
  processInput(args: ITextMaskInputArgs): IMaskedValue;
}