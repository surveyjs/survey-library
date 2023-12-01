import { InputMaskBase } from "./mask";
import { IMaskedValue, settings, syntacticAnalysisMask } from "./mask_utils";

interface INumberMaskOption {
  mask?: string;
  align?: "left" | "right";
  allowNegative?: boolean;
  decimal?: string;
  precision?: number;
  thousands?: string;
}
interface INumericalСomposition {
  integralPart: number;
  fractionalPart?: number;
}

export function parseNumber(str: any): INumericalСomposition {
  const result: INumericalСomposition = { integralPart: 0, fractionalPart: 0 };
  const input = str.toString();

  const parts = input.trim().split(".");
  if(parts.length >= 2) {
    result.integralPart = parseInt(parts[0].trim());
    result.fractionalPart = parseInt(parts[1].trim());
  } else if(parts.length == 1) {
    result.integralPart = parseInt(parts[0].trim());
  } else {
    result.integralPart = parseInt(input.trim());
  }

  return result;
}

export function getNumberMaskedValue(str: string | number, mask: string, option?: INumberMaskOption) {
  const decimalSeparator = option?.decimal || settings.numberOptions.decimal;
  const parsedMask = syntacticAnalysisMask(mask);

  const input = str.toString();
  const parsedNumber = parseNumber(input);

  let result = "";
  let maskIndex = 0;

  for(let index = 0; index < parsedNumber.integralPart.toString().length; index++) {

  }
  return result;
}

export function getNumberUnmaskedValue(str: string, mask: string, option?: INumberMaskOption) {
  return str;
}

export class InputMaskNumber extends InputMaskBase {

  constructor(input: HTMLInputElement, mask?: INumberMaskOption) {
    super(input, mask);
  }

  protected getMaskedValue(mask: string, option: INumberMaskOption): string {
    return getNumberMaskedValue(getNumberUnmaskedValue(this.input.value, mask, option), mask, option);
  }

  protected processMaskedValue(mask: string): IMaskedValue {
    // return processValueWithPattern(this.input.value, mask, this._prevSelectionStart, this.input.selectionStart);
    return { text: this.input.value, cursorPosition: this.input.selectionStart };
  }
}