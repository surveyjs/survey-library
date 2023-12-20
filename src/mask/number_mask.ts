import { InputMaskBase } from "./mask";
import { IMaskLiteral } from "./mask_pattern";
import { IMaskedValue, settings } from "./mask_utils";

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

interface INumberMaskLiteral extends IMaskLiteral {
  repeat?: boolean;
}

export function getNumberMaskLiterals(mask: string): Array<INumberMaskLiteral> {
  const result: Array<INumberMaskLiteral> = [];
  let prevChartIsEscaped = false;
  let prevChart;
  const definitionsKeys = Object.keys(settings.definitions);

  for(let index = 0; index < mask.length; index++) {
    const currentChar = mask[index];
    if(currentChar === settings.escapedChar) {
      prevChartIsEscaped = true;
    } else if(prevChartIsEscaped) {
      prevChartIsEscaped = false;
      result.push({ type: "const", value: currentChar });
    } else if(currentChar === "+") {
      result[result.length - 1].repeat = true;
    } else {
      result.push({ type: definitionsKeys.indexOf(currentChar) !== -1 ? "regex" : "const", value: currentChar });
    }
    prevChart = currentChar;
  }

  return result;
}

export function parseNumber(str: any, decimalSeparator = "."): INumericalСomposition {
  const result: INumericalСomposition = { integralPart: 0, fractionalPart: 0 };
  const input = str.toString();

  const parts = input.trim().split(decimalSeparator);
  if(parts.length >= 2) {
    result.integralPart = parseInt(parts[0].trim() || 0);
    result.fractionalPart = parseInt(parts[1].trim() || 0);
  } else if(parts.length == 1) {
    result.integralPart = parseInt(parts[0].trim() || 0);
  } else {
    result.integralPart = parseInt(input.trim() || 0);
  }

  return result;
}

export function splitString(str: string, reverse = false, n = 3): Array<string> {
  let arr = [];

  if(reverse) {
    for (let i = str.length - n; i > -n; i -= n) {
      arr.push(str.substring(i, i + n));
    }
    arr = arr.reverse();
  } else {
    for (let i = 0; i < str.length; i += n) {
      arr.push(str.substring(i, i + n));
    }
  }

  return arr;
}

export function getNumberMaskedValue(str: string | number, mask: string, option?: INumberMaskOption): string {
  const decimalSeparator = option?.decimal || settings.numberOptions.decimal;
  const thousandsSeparator = option?.thousands || settings.numberOptions.thousands;
  const precision = option?.precision || settings.numberOptions.precision;
  const parsedNumber = parseNumber(str);

  const integralPart = parsedNumber.integralPart ? splitString(parsedNumber.integralPart.toString(), true).join(thousandsSeparator) : "0";
  let fractionalPart = parsedNumber.fractionalPart ? splitString(parsedNumber.fractionalPart.toString()).join(thousandsSeparator) : "";
  if(fractionalPart === "") {
    return integralPart;
  } else {
    fractionalPart = fractionalPart.substring(0, precision);
    return [integralPart, fractionalPart].join(decimalSeparator);
  }
}

export function getNumberUnmaskedValue(str: string, mask: string, option?: INumberMaskOption): number {
  const decimalSeparator = option?.decimal || settings.numberOptions.decimal;
  const thousandsSeparator = option?.thousands || settings.numberOptions.thousands;
  const precision = option?.precision || settings.numberOptions.precision;

  const number = parseNumber(str.replace(thousandsSeparator, ""), decimalSeparator);
  const integralPart = number.integralPart ? number.integralPart : 0;
  let fractionalPart = number.fractionalPart ? number.fractionalPart : undefined;
  if(fractionalPart) {
    fractionalPart = parseInt(fractionalPart.toString().substring(0, precision));
  }

  return parseFloat([integralPart, fractionalPart].join(decimalSeparator));
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