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
  private calcCursorPosition(leftPart: string, args: ITextMaskInputArgs, maskedValue: string) {
    const leftPartMaskedLength = !! leftPart ? this.displayNumber(this.parseNumber(leftPart), false).length : 0;
    let validCharIndex = 0;
    let result = args.selectionStart;
    // let result = 0;
    const isDeleteKeyOperation = !args.insertedCharacters && args.inputDirection === "leftToRight";

    for (let index = 0; index < maskedValue.length; index++) {
      const currentChar = maskedValue[index];
      if (currentChar !== this.thousandsSeparator) {
        validCharIndex++;
      }
      if (validCharIndex === (leftPartMaskedLength + (isDeleteKeyOperation ? 1 : 0))) {
        if(isDeleteKeyOperation) {
          result = index;
        } else {
          result = index + 1;
        }
        break;
      }
      // if (validCharIndex === leftPartMaskedLength) {
      //   result = index + 1;
      //   break;
      // }
    }
    return result;
  }

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

  public displayNumber(parsedNumber: INumericalComposition, insertThousandsSeparator = true, matchWholeMask: boolean = false): string {
    let displayIntegralPart = parsedNumber.integralPart;
    if(insertThousandsSeparator && !!displayIntegralPart) {
      displayIntegralPart = splitString(displayIntegralPart).join(this.thousandsSeparator);
    }
    let displayFractionalPart = parsedNumber.fractionalPart;
    const minusSign = parsedNumber.isNegative ? "-" : "";
    if(displayFractionalPart === "") {
      if(matchWholeMask) {
        return (!displayIntegralPart || displayIntegralPart === "0") ? displayIntegralPart : minusSign + displayIntegralPart;
      } else {
        const displayDecimalSeparator = parsedNumber.decimalSeparatorCount && !matchWholeMask ? this.decimalSeparator : "";
        const src = displayIntegralPart + displayDecimalSeparator;
        return src === "0" ? src : minusSign + src;
      }
    } else {
      displayIntegralPart = displayIntegralPart || "0";
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

  public validateNumber(number: INumericalComposition): boolean {
    const min = this.numberOptions?.min || Number.MIN_SAFE_INTEGER;
    const max = this.numberOptions?.max || Number.MAX_SAFE_INTEGER;

    if(!!this.numberOptions && (this.numberOptions.min !== undefined || this.numberOptions.max !== undefined)) {
      let value = this.convertNumber(number);
      if(Number.isNaN(value)) {
        return true;
      }
      return value >= min && value <= max;
    }
    return true;
  }

  public parseNumber(str: any): INumericalComposition {
    const result: INumericalComposition = { integralPart: "", fractionalPart: "", decimalSeparatorCount: 0, isNegative: false };
    const input = str.toString();
    let minusCharCount = 0;

    for(let inputIndex = 0; inputIndex < input.length; inputIndex++) {
      const currentDefinition = settings.definitions["9"];
      const currentChar = input[inputIndex];
      switch(currentChar) {
        case "-": {
          if(this.allowNegative) {
            minusCharCount++;
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

    result.isNegative = minusCharCount % 2 !== 0;

    if(result.integralPart.length > 1 && result.integralPart[0] === "0") {
      result.integralPart = result.integralPart.slice(1);
    }

    return result;
  }

  public getNumberMaskedValue(src: string | number, matchWholeMask: boolean = false): string {
    const input = src.toString();
    const parsedNumber = this.parseNumber(input);
    const displayText = this.displayNumber(parsedNumber, true, matchWholeMask);
    return displayText;
  }

  private getNumberUnmaskedValue(str: string): number {
    const parsedNumber = this.parseNumber(str);
    return this.convertNumber(parsedNumber);
  }

  public getMaskedValue(src: string): string {
    return this.getNumberMaskedValue(src, true);
  }
  public getUnmaskedValue(src: string): string {
    return this.getNumberUnmaskedValue(src).toString();
  }
  public processInput(args: ITextMaskInputArgs): IMaskedValue {
    const result = { text: args.prevValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };
    const leftPart = args.prevValue.slice(0, args.selectionStart) + (args.insertedCharacters || "");
    const rightPart = args.prevValue.slice(args.selectionEnd);
    const src = leftPart + rightPart;
    const parsedNumber = this.parseNumber(src);

    if(!this.validateNumber(parsedNumber)) {
      return result;
    }

    const maskedValue = this.getNumberMaskedValue(src);
    const cursorPosition = this.calcCursorPosition(leftPart, args, maskedValue);
    result.text = maskedValue;
    result.cursorPosition = cursorPosition;

    return result;
  }
}

MaskManagerType.Instance.registerMaskManagerType("number", (maskOptions: IMaskOption) => { return new InputMaskNumber(maskOptions); });