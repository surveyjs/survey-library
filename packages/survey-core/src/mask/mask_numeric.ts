import { Serializer } from "../jsonobject";
import { property } from "../decorators";
import { InputMaskBase } from "./mask_base";
import { IMaskedInputResult, IMaskLocaleChange, ITextInputParams, numberDefinition } from "./mask_utils";

interface INumericalComposition {
  integralPart: string;
  fractionalPart: string;
  isNegative?: boolean;
  hasDecimalSeparator?: boolean;
}

const nonZeroDigitDefinition = /[1-9]/;
const trailingZerosDefinition = /0+$/;

export function splitString(str: string, reverse = true, n = 3): Array<string> {
  let arr = [];

  if (reverse) {
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

// A curated decimal separator has to be a single character that cannot be mistaken for part of
// a number. "" is rejected: a number needs a way to spell its fractional part.
export function isValidDecimalSeparator(value: string): boolean {
  if (!value) return false;
  return Array.from(value).length === 1 && value !== "-" && !value.match(numberDefinition);
}
// The same rule, except that "" is meaningful here and means "do not group".
export function isValidThousandsSeparator(value: string): boolean {
  if (value === "") return true;
  return isValidDecimalSeparator(value);
}

/**
 * A class that describes an input mask of the `"numeric"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType).
 *
 * The following code shows how to specify the properties of this class within a survey JSON schema:
 *
 * ```js
 * const surveyJson = {
 *   "elements": [{
 *     "name": "textquestion1"
 *     "type": "text",
 *     "maskType": "numeric",
 *     "maskSettings": {
 *       // Specify the properties of a numeric input mask here
 *     }
 *   }]
 * }
 * ```
 *
 * [Demo: Masked Input Fields](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))
 */
export class InputMaskNumeric extends InputMaskBase {
  // Keep the format used for text separate from the default lookup cache: callbacks may read
  // the new locale's defaults before localeChanged() converts text from the previous locale.
  private textSeparators: { decimal: string, thousands: string };
  /**
   * Specifies whether respondents can enter negative values.
   *
   * Default value: `true`
   * @see min
   * @see max
   */
  @property() allowNegativeValues: boolean;
  /**
   * A symbol that separates the integer and fractional parts of a displayed number.
   *
   * Specify this property to override the survey-wide decimal separator.
   *
   * Default value: `undefined` (the mask inherits [`regionalFormat.decimalSeparator`](/form-library/documentation/api-reference/regionalformat#decimalSeparator) or the separator used by the [format locale](/form-library/documentation/api-reference/regionalformat#locale) (`"."` in English))
   * @see precision
   * @see showTrailingZeros
   * @see thousandsSeparator
   */
  public get decimalSeparator(): string {
    return this.getPropertyValue("decimalSeparator");
  }
  public set decimalSeparator(val: string) {
    this.setExplicitPropertyValue("decimalSeparator", val);
  }
  /**
   * Limits how many digits to retain after the decimal point for a displayed number.
   *
   * Default value: 2
   *
   * [Demo: Masked Input Fields](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))
   * @see decimalSeparator
   * @see showTrailingZeros
   */
  @property() precision: number;
  /**
   * Specifies whether to add trailing zeros to the fractional part of a displayed number to match the specified [`precision`](#precision).
   *
   * When this property is `true`, trailing zeros appear immediately as respondents enter a value, without waiting for the input field to lose focus. For example, with `precision` set to 2, entering 1 displays "1.00", and entering 1.5 displays "1.50".
   *
   * Default value: `false`
   */
  @property() showTrailingZeros: boolean;
  /**
   * A symbol that separates the digits of a large number into groups of three.
   *
   * Set this property to override the survey-wide thousands separator, or use an empty string to disable grouping. Grouping is also disabled if the separator matches this mask's [`decimalSeparator`](#decimalSeparator).
   *
   * Default value: `undefined` (the mask inherits [`regionalFormat.thousandsSeparator`](/form-library/documentation/api-reference/regionalformat#thousandsSeparator) or the separator used by the [format locale](/form-library/documentation/api-reference/regionalformat#locale) (`","` in English))
   * @see decimalSeparator
   */
  public get thousandsSeparator(): string {
    return this.getPropertyValue("thousandsSeparator");
  }
  public set thousandsSeparator(val: string) {
    this.setExplicitPropertyValue("thousandsSeparator", val);
  }
  // The decimal separator is primary: a locale's grouping symbol that collides with it - which a
  // partial override reaches without any bad curation - suppresses grouping instead of rendering
  // a number that cannot be parsed back.
  public getDefaultThousandsSeparator(): string {
    const res = this.getFormatValue("thousandsSeparator", isValidThousandsSeparator);
    return res === this.decimalSeparator ? "" : res;
  }
  /**
   * A minimum value that respondents can enter.
   * @see max
   * @see allowNegativeValues
   */
  @property() min: number;
  /**
   * A maximum value that respondents can enter.
   * @see min
   * @see allowNegativeValues
   */
  @property() max: number;

  private calccaretPosition(leftPart: string, args: ITextInputParams, maskedValue: string) {
    const leftPartMaskedLength = !! leftPart ? this.displayNumber(this.parseNumber(leftPart), false).length : 0;
    let validCharIndex = 0;
    let result = args.selectionStart;
    // let result = 0;
    const isDeleteKeyOperation = !args.insertedChars && args.inputDirection === "forward";

    for (let index = 0; index < maskedValue.length; index++) {
      const currentChar = maskedValue[index];
      if (currentChar !== this.thousandsSeparator) {
        validCharIndex++;
      }
      if (validCharIndex === (leftPartMaskedLength + (isDeleteKeyOperation ? 1 : 0))) {
        if (isDeleteKeyOperation) {
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

  private numericalCompositionIsEmpty(number: INumericalComposition): boolean {
    return !number.integralPart && !number.fractionalPart;
  }

  private get hasTrailingZeros(): boolean {
    return !!this.showTrailingZeros && this.precision > 0;
  }
  private isZeroNumber(number: INumericalComposition): boolean {
    return !nonZeroDigitDefinition.test(number.integralPart || "") && !nonZeroDigitDefinition.test(number.fractionalPart || "");
  }
  // Fills the fractional part up to precision. The zeros belong to the displayed text, not to the
  // entry: the caret is placed by the digits the respondent typed, and a deletion cannot take them out.
  private addTrailingZeros(number: INumericalComposition): INumericalComposition {
    if (!this.hasTrailingZeros || this.numericalCompositionIsEmpty(number)) return number;
    return {
      ...number,
      fractionalPart: number.fractionalPart.substring(0, this.precision).padEnd(this.precision, "0"),
      hasDecimalSeparator: true
    };
  }
  // The generated zeros are no part of the entry either, so the limits are checked against the typed
  // digits: while an entry is in progress "2.60" is the prefix "2.6" and "20.00" is the prefix "20".
  private removeTrailingZeros(number: INumericalComposition): INumericalComposition {
    if (!this.hasTrailingZeros || !number.fractionalPart) return number;
    const fractionalPart = number.fractionalPart.replace(trailingZerosDefinition, "");
    // "20." is not a prefix of "200", "20.00" is: the separator goes with its zeros
    return { ...number, fractionalPart, hasDecimalSeparator: !!fractionalPart };
  }

  public displayNumber(parsedNumber: INumericalComposition, insertThousandsSeparator = true, matchWholeMask: boolean = false): string {
    this.textSeparators = { decimal: this.decimalSeparator, thousands: this.thousandsSeparator };
    let displayIntegralPart = parsedNumber.integralPart;
    // two authored separators that are the same character would render a number that parses back
    // as something else, so grouping yields there as well
    if (insertThousandsSeparator && !!displayIntegralPart && !!this.thousandsSeparator && this.thousandsSeparator !== this.decimalSeparator) {
      displayIntegralPart = splitString(displayIntegralPart).join(this.thousandsSeparator);
    }
    let displayFractionalPart = parsedNumber.fractionalPart;
    // A completed zero carries no minus sign: "-0" is displayed as "0". While an entry is in
    // progress the sign stays, as the respondent may be on the way to "-0.05".
    const isCompletedZero = matchWholeMask && this.isZeroNumber(parsedNumber);
    const minusSign = parsedNumber.isNegative && !isCompletedZero ? "-" : "";
    if (displayFractionalPart === "") {
      const displayDecimalSeparator = parsedNumber.hasDecimalSeparator && !matchWholeMask ? this.decimalSeparator : "";
      return minusSign + displayIntegralPart + displayDecimalSeparator;
    } else {
      displayIntegralPart = displayIntegralPart || "0";
      displayFractionalPart = displayFractionalPart.substring(0, this.precision);
      return [minusSign + displayIntegralPart, displayFractionalPart].join(this.decimalSeparator);
    }
  }

  public convertNumber(parsedNumber: INumericalComposition): number {
    let value;
    const minusSign = parsedNumber.isNegative ? "-" : "";
    if (!!parsedNumber.fractionalPart) {
      value = parseFloat(minusSign + (parsedNumber.integralPart || "0") + "." + parsedNumber.fractionalPart.substring(0, this.precision));
    } else {
      value = parseInt(minusSign + parsedNumber.integralPart || "0");
    }
    return value;
  }

  public validateNumber(srcNumber: INumericalComposition, matchWholeMask: boolean): boolean {
    const number = this.removeTrailingZeros(srcNumber);
    const min = this.min || Number.MIN_SAFE_INTEGER;
    const max = this.max || Number.MAX_SAFE_INTEGER;

    if (this.numericalCompositionIsEmpty(number)) return true;

    if (this.min !== undefined || this.max !== undefined) {
      let value = this.convertNumber(number);
      if (Number.isNaN(value)) {
        return true;
      }
      if (value >= min && value <= max) return true;
      if (!matchWholeMask) {
        if (!number.hasDecimalSeparator && value != 0) {
          let test_high = value;
          let test_low = value;
          if (value > 0) {
            if (value + 1 > min && value <= max) return true;
            while(true) {
              test_high = test_high * 10 + 9;
              test_low = test_low * 10;
              if (test_low > max) {
                break;
              }
              if (test_high > min) {
                return true;
              }
            }
            return false;
          }
          if (value < 0) {
            if (value >= min && value - 1 < max) return true;
            while(true) {
              test_high = test_high * 10;
              test_low = test_low * 10 - 9;
              if (test_high < min) {
                break;
              }
              if (test_low < max) {
                return true;
              }
            }
            return false;
          }
        } else {
          const delta = 0.1 ** (number.fractionalPart || "").length;
          if (value >= 0) return value + delta > min && value <= max;
          if (value < 0) return value >= min && value - delta < max;
        }
        return value >= 0 && value <= max || value < 0 && value >= min;
      }
      return false;
    }
    return true;
  }

  // The separators are parameters so that text entered under the previous locale can be read
  // with the pair that produced it; both default to the mask's current values.
  public parseNumber(src: string, decimalSeparator?: string, thousandsSeparator?: string): INumericalComposition {
    const result: INumericalComposition = { integralPart: "", fractionalPart: "", hasDecimalSeparator: false, isNegative: false };
    const input = (src === undefined || src === null) ? "" : src.toString();
    const decimal = decimalSeparator !== undefined ? decimalSeparator : this.decimalSeparator;
    const thousands = thousandsSeparator !== undefined ? thousandsSeparator : this.thousandsSeparator;
    if (decimalSeparator === undefined && thousandsSeparator === undefined) {
      this.textSeparators = { decimal, thousands };
    }
    let minusCharCount = 0;

    for (let inputIndex = 0; inputIndex < input.length; inputIndex++) {
      const currentChar = input[inputIndex];
      switch(currentChar) {
        case "-": {
          if (this.allowNegativeValues && (this.min === undefined || this.min < 0)) {
            minusCharCount++;
          }
          break;
        }
        case decimal: {
          if (this.precision > 0) {
            result.hasDecimalSeparator = true;
          }
          break;
        }
        case thousands: {
          break;
        }
        default: {
          if (currentChar.match(numberDefinition)) {
            if (result.hasDecimalSeparator) {
              result.fractionalPart += currentChar;
            } else {
              result.integralPart += currentChar;
            }
          }
        }
      }
    }

    result.isNegative = minusCharCount % 2 !== 0;

    if (result.integralPart.length > 1 && result.integralPart[0] === "0") {
      result.integralPart = result.integralPart.slice(1);
    }

    return result;
  }

  public getNumberMaskedValue(src: string, matchWholeMask: boolean = false): string {
    const parsedNumber = this.parseNumber(src);
    if (!this.validateNumber(parsedNumber, matchWholeMask)) {
      return null;
    }
    return this.displayParsedNumber(parsedNumber, matchWholeMask);
  }
  // The generated zeros and the separator that precedes them are the text the mask renders by itself,
  // so a deletion that leaves nothing else empties the entry - as a pattern mask holding only
  // placeholders is empty. The text alone cannot tell a generated zero from a typed one (".0" is
  // both the remainder of "1.00" and the start of "-.05"), so the rule is applied when no digit
  // has been typed.
  private displayParsedNumber(parsedNumber: INumericalComposition, matchWholeMask: boolean, insertedChars?: string): string {
    const isTrailingZerosOnly = this.hasTrailingZeros && !numberDefinition.test(insertedChars || "")
      && !parsedNumber.integralPart && !!parsedNumber.fractionalPart && this.isZeroNumber(parsedNumber);
    if (isTrailingZerosOnly) return "";
    return this.displayNumber(this.addTrailingZeros(parsedNumber), true, matchWholeMask);
  }

  private getNumberUnmaskedValue(str: string, decimalSeparator?: string, thousandsSeparator?: string): number | undefined {
    const parsedNumber = this.parseNumber(str, decimalSeparator, thousandsSeparator);
    if (this.numericalCompositionIsEmpty(parsedNumber)) return undefined;
    // An entry in progress may sit below min (the prefix "0" of "0,1"). A completed value
    // outside min/max is not an answer.
    if (!this.validateNumber(parsedNumber, true)) return undefined;
    return this.convertNumber(parsedNumber);
  }
  public isValueOutOfRange(src: string): boolean {
    const parsedNumber = this.parseNumber(src);
    if (this.numericalCompositionIsEmpty(parsedNumber)) return false;
    return !this.validateNumber(parsedNumber, true);
  }

  public getTextAlignment(): "left" | "right" | "auto" {
    return "right";
  }
  public getInputDirection(): "ltr" | "auto" {
    return this.getInputDirectionByLiterals();
  }
  protected getLiteralText(): string {
    return (this.decimalSeparator || "") + (this.thousandsSeparator || "");
  }
  public get isLocaleDependent(): boolean { return true; }
  protected getLocaleChangeInput(text: string): string {
    return text;
  }
  protected getLocaleChangeOutput(text: string): string {
    return text;
  }
  public localeChanged(state?: IMaskLocaleChange): void {
    const prev = this.textSeparators;
    const prevDecimal = !!prev ? prev.decimal : undefined;
    const enteredNumber = !!prev && !!state && !!state.enteredText
      ? this.parseNumber(this.getLocaleChangeInput(state.enteredText), prev.decimal, prev.thousands) : undefined;
    // a masked value is stored as text in the previous locale's format
    const savedNumber = !!prev && !!state && !!state.value
      ? this.getNumberUnmaskedValue(this.getLocaleChangeInput(state.value), prev.decimal, prev.thousands) : undefined;
    super.localeChanged();
    // Only the rendered text is locale dependent - a stored number is not - but the empty mask
    // and every displayed value change. Notify the owner question and the input element adapter
    // the same way a property change does.
    this.onPropertyChanged.fire(this, { name: "locale", oldValue: prevDecimal, newValue: this.decimalSeparator });
    if (!!enteredNumber && !this.numericalCompositionIsEmpty(enteredNumber)) {
      state.enteredText = this.getLocaleChangeOutput(this.displayNumber(enteredNumber));
    }
    if (savedNumber !== undefined) {
      state.value = this.getMaskedValue(savedNumber);
    }
  }
  public getMaskedValue(src: any): string {
    let input: string = (src === undefined || src === null) ? "" : src.toString();
    input = input.replace(".", this.decimalSeparator);
    return this.getNumberMaskedValue(input, true);
  }
  public getUnmaskedValue(src: string): any {
    return this.getNumberUnmaskedValue(src);
  }
  public processInput(args: ITextInputParams): IMaskedInputResult {
    const result = { value: args.prevValue, caretPosition: args.selectionEnd, cancelPreventDefault: false };
    const leftPart = args.prevValue.slice(0, args.selectionStart) + (args.insertedChars || "");
    const rightPart = args.prevValue.slice(args.selectionEnd);
    const deletedText = args.prevValue.slice(args.selectionStart, args.selectionEnd);
    // showTrailingZeros keeps a fractional part in the displayed text, so its separator belongs to the
    // mask rather than to the entry: a deletion or a replacement that covers the separator takes out
    // the digits it selected and leaves the separator in place. With no digit left there is nothing
    // to separate any more.
    const keepsDecimalSeparator = this.hasTrailingZeros && deletedText.indexOf(this.decimalSeparator) !== -1 && numberDefinition.test(leftPart + rightPart);
    const parsedNumber = this.parseNumber(leftPart + (keepsDecimalSeparator ? this.decimalSeparator : "") + rightPart);

    if (!this.validateNumber(parsedNumber, false)) {
      return result;
    }

    const maskedValue = this.displayParsedNumber(parsedNumber, false, args.insertedChars);
    result.value = maskedValue;
    if (!args.insertedChars && !!deletedText && maskedValue === args.prevValue) {
      // the mask keeps what the deletion aimed at - a separator or a generated zero - so the text is
      // regenerated as it was and the caret steps over the character instead of taking it out
      result.caretPosition = args.inputDirection === "backward" ? args.selectionStart : args.selectionEnd;
      return result;
    }
    result.caretPosition = this.calccaretPosition(leftPart, args, maskedValue);

    return result;
  }

  public getType(): string {
    return "numericmask";
  }
}

Serializer.addClass(
  "numericmask",
  [
    { name: "allowNegativeValues:boolean", default: true },
    // The default follows the survey's format locale. obj is undefined for a metadata query
    // (prop.defaultValue, the Creator, the JSON schema), which is answered with the canonical
    // value. onSerializeValue writes an assigned value even when it equals the current default:
    // "the author assigned it" and "it differs from today's default" are no longer the same.
    {
      name: "decimalSeparator", maxLength: 1,
      defaultFunc: (obj: InputMaskNumeric) => !!obj ? obj.getFormatValue("decimalSeparator", isValidDecimalSeparator) || "." : ".",
      onSerializeValue: (obj: InputMaskNumeric) => obj.getExplicitPropertyValue("decimalSeparator")
    },
    {
      name: "thousandsSeparator", maxLength: 1,
      defaultFunc: (obj: InputMaskNumeric) => !!obj ? obj.getDefaultThousandsSeparator() : ",",
      onSerializeValue: (obj: InputMaskNumeric) => obj.getExplicitPropertyValue("thousandsSeparator")
    },
    { name: "precision:number", default: 2, minValue: 0 },
    {
      name: "showTrailingZeros:boolean", default: false,
      dependsOn: ["precision"],
      visibleIf: (obj: any) => { return !!obj && obj.precision > 0; }
    },
    { name: "min:number" },
    { name: "max:number" },
  ],
  function () {
    return new InputMaskNumeric();
  },
  "masksettings"
);
