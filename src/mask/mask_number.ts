import { InputMaskBase } from "./mask_base";
import { MaskManagerType, IMaskOption, IMaskedValue, ITextMaskInputArgs } from "./mask_manager";
import { settings } from "./mask_utils";

interface INumberMaskOption extends IMaskOption {
  // align?: "left" | "right";
  allowNegative?: boolean;
  decimal?: string;
  precision?: number;
  thousands?: string;
  min?: number;
  max?: number;
}
interface INumericalComposition {
  integralPart: string;
  fractionalPart: string;
  isNegative?: boolean;
  decimalSeparatorCount?: number;
}

// export function parseNumber(str: any, decimalSeparator = "."): INumericalComposition {
//   const result: INumericalComposition = { integralPart: 0, fractionalPart: 0 };
//   const input = str.toString();

//   const parts = input.trim().split(decimalSeparator);
//   if(parts.length >= 2) {
//     result.integralPart = parseInt(parts[0].trim() || 0);
//     result.fractionalPart = parseInt(parts[1].trim() || 0);
//   } else if(parts.length == 1) {
//     result.integralPart = parseInt(parts[0].trim() || 0);
//   } else {
//     result.integralPart = parseInt(input.trim() || 0);
//   }

//   return result;
// }

export function splitString(str: string, reverse = true, n = 3): Array<string> {
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

// export function getNumberMaskedValueOld(str: string | number, option?: INumberMaskOption): string {
//   const decimalSeparator = option?.decimal || settings.numberOptions.decimal;
//   const thousandsSeparator = option?.thousands || settings.numberOptions.thousands;
//   const precision = option?.precision || settings.numberOptions.precision;
//   const parsedNumber = parseNumber(str, decimalSeparator);

//   const integralPart = parsedNumber.integralPart ? splitString(parsedNumber.integralPart.toString()).join(thousandsSeparator) : "0";
//   let fractionalPart = parsedNumber.fractionalPart ? parsedNumber.fractionalPart.toString() : "";
//   if(fractionalPart === "") {
//     return integralPart;
//   } else {
//     fractionalPart = fractionalPart.substring(0, precision);
//     return [integralPart, fractionalPart].join(decimalSeparator);
//   }
// }

export class InputMaskNumber extends InputMaskBase {
  constructor(options?: INumberMaskOption) {
    super(options || <IMaskOption>{ mask: "" });
  }

  get numberOptions(): INumberMaskOption {
    return this.maskOptions as INumberMaskOption;
  }
  get decimalSeparator(): string {
    return this.numberOptions?.decimal || settings.numberOptions.decimal;
  }
  get thousandsSeparator(): string {
    return this.numberOptions?.thousands || settings.numberOptions.thousands;
  }
  get precision(): number {
    return this.numberOptions?.precision || settings.numberOptions.precision;
  }
  get allowNegative(): boolean {
    return this.numberOptions?.allowNegative !== undefined ? this.numberOptions?.allowNegative : settings.numberOptions.allowNegative;
  }

  public displayNumber(parsedNumber: INumericalComposition): string {
    const displayIntegralPart = parsedNumber.integralPart ? splitString(parsedNumber.integralPart).join(this.thousandsSeparator) : "0";
    let displayFractionalPart = parsedNumber.fractionalPart;
    const minusSign = parsedNumber.isNegative ? "-" : "";
    if(displayFractionalPart === "") {
      return minusSign + displayIntegralPart + (parsedNumber.decimalSeparatorCount ? this.decimalSeparator : "");
    } else {
      displayFractionalPart = displayFractionalPart.substring(0, this.precision);
      return [minusSign + displayIntegralPart, displayFractionalPart].join(this.decimalSeparator);
    }
  }

  public convertNumber(parsedNumber: INumericalComposition): number {
    let value;
    const minusSign = parsedNumber.isNegative ? "-" : "";
    if(!!parsedNumber.fractionalPart) {
      value = parseFloat(minusSign + (parsedNumber.integralPart || "0") + this.decimalSeparator + parsedNumber.fractionalPart.substring(0, this.precision));
    } else {
      value = parseInt(minusSign + parsedNumber.integralPart || "0");
    }
    return value;
  }

  public validateNumber(number: INumericalComposition, min = Number.MIN_VALUE, max= Number.MAX_VALUE): boolean {
    let value = this.convertNumber(number);
    // if(!!number.fractionalPart) {
    //   value = parseFloat((number.integralPart || "0") + decimalSeparator + number.fractionalPart);
    // } else {
    //   value = parseInt(number.integralPart || "0");
    // }
    return value >= min && value <= max;
  }

  public parseNumber(str: any): INumericalComposition {
    const result: INumericalComposition = { integralPart: "", fractionalPart: "", decimalSeparatorCount: 0, isNegative: false };
    const input = str.toString();

    for(let inputIndex = 0; inputIndex < input.length; inputIndex++) {
      const currentDefinition = settings.definitions["9"];
      const currentChar = input[inputIndex];
      switch(currentChar) {
        case "-": {
          if(this.allowNegative) {
            result.isNegative = true;
          }
          break;
        }
        case this.decimalSeparator: {
          result.decimalSeparatorCount++;
          break;
        }
        case this.thousandsSeparator: {
          break;
        }
        default: {
          if(currentChar.match(currentDefinition)) {
            if(result.decimalSeparatorCount === 0) {
              result.integralPart += currentChar;
            } else {
              result.fractionalPart += currentChar;
            }
          }
        }
      }
    }

    return result;
  }

  public getNumberMaskedValue(src: string | number): string {
    const input = src.toString();
    const parsedNumber = this.parseNumber(input);

    if(!!this.numberOptions && (this.numberOptions.min !== undefined || this.numberOptions.max !== undefined)
    && !this.validateNumber(parsedNumber, this.numberOptions.min, this.numberOptions.max)) {
      return input;
    }

    const displayText = this.displayNumber(parsedNumber);
    return displayText;
  }

  private getNumberUnmaskedValue(str: string): number {
    const parsedNumber = this.parseNumber(str);
    return this.convertNumber(parsedNumber);
  }

  public getMaskedValue(src: string, matchWholeMask: boolean = false): string {
    return this.getNumberMaskedValue(src);
  }
  public getUnmaskedValue(src: string, matchWholeMask: boolean = false): string {
    return this.getNumberUnmaskedValue(src).toString();
  }
  public processInput(args: ITextMaskInputArgs): IMaskedValue {
    const leftPart = args.prevValue.slice(0, args.selectionStart) + (args.insertedCharacters || "");
    const src = leftPart + args.prevValue.slice(args.selectionEnd);
    const maskedValue = this.getMaskedValue(src, true);
    const result = { text: maskedValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };

    if(!args.insertedCharacters && args.inputDirection === "rightToLeft") {
      result.cursorPosition = args.selectionStart;
    } else {
      result.cursorPosition = this.getMaskedValue(leftPart).length;
    }

    return result;
  }
}

MaskManagerType.Instance.registerMaskManagerType("number", (maskOptions: IMaskOption) => { return new InputMaskNumber(maskOptions); });