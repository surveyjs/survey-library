import { Serializer, property } from "../jsonobject";
import { InputMaskBase } from "./mask_base";
import { IMaskedValue, ITextMaskInputArgs, settings } from "./mask_utils";

interface INumericalComposition {
  integralPart: string;
  fractionalPart: string;
  isNegative?: boolean;
  decimalSeparatorCount?: number;
}

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

export class InputMaskNumber extends InputMaskBase {
  private currentDefinition = settings.definitions["9"];

  @property() allowNegative: boolean;
  @property() decimalSeparator: string;
  @property() precision: number;
  @property() thousandsSeparator: string;
  @property() min: number;
  @property() max: number;

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

  constructor() {
    super();
    this.initialize();
  }

  get numberOptions(): InputMaskBase {
    return this;
  }

  protected initialize(): void {
    this.allowNegative = settings.numberOptions.allowNegative;
    this.decimalSeparator = settings.numberOptions.decimalSeparator;
    this.precision = settings.numberOptions.precision;
    this.thousandsSeparator = settings.numberOptions.thousandsSeparator;
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
    const min = this.min || Number.MIN_SAFE_INTEGER;
    const max = this.max || Number.MAX_SAFE_INTEGER;

    if(this.min !== undefined || this.max !== undefined) {
      let value = this.convertNumber(number);
      if(Number.isNaN(value)) {
        return true;
      }
      return value >= min && value <= max;
    }
    return true;
  }

  public parseNumber(src: string | number): INumericalComposition {
    const result: INumericalComposition = { integralPart: "", fractionalPart: "", decimalSeparatorCount: 0, isNegative: false };
    const input = (src === undefined || src === null) ? "" : src.toString();
    let minusCharCount = 0;

    for(let inputIndex = 0; inputIndex < input.length; inputIndex++) {
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
          if(currentChar.match(this.currentDefinition)) {
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
    const input = (src === undefined || src === null) ? "" : src.toString();
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

  public getType(): string {
    return "numbermask";
  }

  public isEmpty(): boolean {
    return false;
  }
}

Serializer.addClass(
  "numbermask",
  [
    { name: "allowNegative:boolean" },
    { name: "decimalSeparator" },
    { name: "thousandsSeparator" },
    { name: "precision:number" },
    { name: "min:number" },
    { name: "max:number" },
  ],
  function () {
    return new InputMaskNumber();
  },
  "masksettings"
);