import { JsonMetadataClass, Serializer } from "../jsonobject";

export var numberDefinition = /[0-9]/;

export interface IMaskedInputResult {
  value: string;
  caretPosition: number;
  cancelPreventDefault?: boolean;
}

export interface ITextInputParams {
  prevValue: string;
  selectionStart: number;
  selectionEnd: number;
  insertedChars: string | null;
  inputDirection?: "forward" | "backward";
}

// Carries the question state that a locale change may have to re-render. The mask reads the
// values that apply to it and writes back what the question should display and store.
export interface IMaskLocaleChange {
  // an incomplete entry, which is displayed but not stored in the question value
  enteredText?: string;
  // the stored value, passed only when saveMaskedValue is enabled
  value?: any;
}

export interface IInputMask {
  getMaskedValue(src: any): string;
  getUnmaskedValue(src: string): any;
  processInput(args: ITextInputParams): IMaskedInputResult;
  getTextAlignment(): "left" | "right" | "auto";
}

export function getAvailableMaskTypeChoices() {
  const classes = Serializer.getChildrenClasses("masksettings") || [];
  const choices = classes.map((cl: JsonMetadataClass) => {
    let value = cl.name;
    if (cl.name.indexOf("mask") !== -1) {
      value = value.slice(0, value.indexOf("mask"));
    }
    return value;
  });
  choices.unshift("none");
  return choices;
}