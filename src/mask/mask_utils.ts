export interface IMaskedValue {
  text: string;
  cursorPosition: number;
}

export var settings = {
  placeholderChar: "_",
  escapedChar: "\\",
  numberOptions: {
    decimal: ".",
    thousands: ",",
    precision: 2,
    allowNegative: true,
    align: "right"
  },
  definitions: <{ [key: string]: RegExp }>{
    "9": /[0-9]/,
    "a": /[a-zA-Z]/,
    "#": /[a-zA-Z0-9]/
  }
};