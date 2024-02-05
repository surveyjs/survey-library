export var settings = {
  placeholderChar: "_",
  escapedChar: "\\",
  numberOptions: {
    decimal: ".",
    thousands: ",",
    precision: 2,
    allowNegative: true,
    dataToSave: "unmasked"
    // align: "right"
  },
  definitions: <{ [key: string]: RegExp }>{
    "9": /[0-9]/,
    "a": /[a-zA-Z]/,
    "#": /[a-zA-Z0-9]/
  }
};