export var settings = {
  placeholderChar: "_",
  escapedChar: "\\",
  numberOptions: {
    decimalSeparator: ".",
    thousandsSeparator: ",",
    precision: 2,
    allowNegative: true,
    // align: "right"
  },
  definitions: <{ [key: string]: RegExp }>{
    "9": /[0-9]/,
    "a": /[a-zA-Z]/,
    "#": /[a-zA-Z0-9]/
  }
};

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