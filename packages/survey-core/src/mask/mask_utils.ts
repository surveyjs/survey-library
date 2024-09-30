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