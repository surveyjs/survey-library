import { JsonMetadataClass, Serializer } from "../jsonobject";

export var numberDefinition = /[0-9]/;

// Letters of the right-to-left scripts in current use (Hebrew, Arabic, Syriac, Thaana, NKo, Samaritan,
// Mandaic, Adlam), selected by Unicode script property so the presentation forms and the supplementary
// planes are covered. Only letters count: the digits, marks and punctuation of these scripts (Arabic-Indic
// digits, the Arabic decimal and thousands separators, the harakat) are numeric, neutral or combining and
// do not reverse a field order. Historic right-to-left scripts are not classified.
// A mask asks this about the text it renders by itself (literals, separators, affixes, placeholder
// symbols) to decide whether it may declare its content a left-to-right run. It is never asked about
// a respondent value or about a pattern definition regex, which cannot be inspected for the scripts it admits.
const strongRtlRegex = /(?=\p{L})[\p{Script=Hebrew}\p{Script=Arabic}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Nko}\p{Script=Samaritan}\p{Script=Mandaic}\p{Script=Adlam}]/u;
export function hasStrongRtlText(text: string): boolean {
  return typeof text === "string" && strongRtlRegex.test(text);
}

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
  getInputDirection(): "ltr" | "auto";
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