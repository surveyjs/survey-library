import { settings } from "../settings";
import { Serializer, property } from "../jsonobject";
import { InputMaskBase } from "./mask_base";
import { IMaskedInputResult, ITextInputParams } from "./mask_utils";
import { ILoadFromJSONOptions } from "../base-interfaces";

export interface IMaskLiteral {
  type: "const" | "regex" | "fixed";
  value: any;
}

export function getLiterals(pattern: string): Array<IMaskLiteral> {
  const result: Array<IMaskLiteral> = [];
  let prevCharIsEscaped = false;
  const definitionsKeys = Object.keys(settings.maskSettings.patternDefinitions);

  for(let index = 0; index < pattern.length; index++) {
    const currentChar = pattern[index];
    if(currentChar === settings.maskSettings.patternEscapeChar) {
      prevCharIsEscaped = true;
    } else if(prevCharIsEscaped) {
      prevCharIsEscaped = false;
      result.push({ type: "fixed", value: currentChar });
    } else {
      result.push({ type: definitionsKeys.indexOf(currentChar) !== -1 ? "regex" : "const", value: currentChar });
    }
  }

  return result;
}

function getFirstMatch(str: string, strIndex: number, literal: IMaskLiteral): number {
  const currentDefinition = settings.maskSettings.patternDefinitions[literal.value];
  while(strIndex < str.length) {
    if(str[strIndex].match(currentDefinition)) {
      return strIndex;
    }
    strIndex++;
  }
  return strIndex;
}

export function getMaskedValueByPattern(src: string, pattern: string | Array<IMaskLiteral>, matchWholeMask: boolean): string {
  const input = (src === undefined || src === null) ? "" : src;
  let result = "";
  let strIndex = 0;
  const literals: Array<IMaskLiteral> = (typeof pattern === "string") ? getLiterals(pattern) : pattern;

  for(let maskIndex = 0; maskIndex < literals.length; maskIndex++) {
    switch(literals[maskIndex].type) {
      case "regex" :
        if(strIndex < input.length) {
          strIndex = getFirstMatch(input, strIndex, literals[maskIndex]);
        }
        if(strIndex < input.length) {
          result += input[strIndex];
        } else if(matchWholeMask) {
          result += settings.maskSettings.patternPlaceholderChar;
        } else {
          return result;
        }

        strIndex++;
        break;

      case "const":
      case "fixed":
        result += literals[maskIndex].value;
        if(literals[maskIndex].value === input[strIndex]) {
          strIndex++;
        }
        break;
    }
  }
  return result;
}

export function getUnmaskedValueByPattern(str: string, pattern: string | Array<IMaskLiteral>, matchWholeMask: boolean, skipFixedChar = false): string {
  let result = "";
  if(!str) return result;

  let literals: Array<IMaskLiteral> = (typeof pattern === "string") ? getLiterals(pattern) : pattern;
  for(let index = 0; index < literals.length; index++) {
    if(literals[index].type === "fixed" && !skipFixedChar) {
      result += literals[index].value;
    } if(literals[index].type === "regex") {
      const currentDefinition = settings.maskSettings.patternDefinitions[literals[index].value];
      if(!!str[index] && str[index].match(currentDefinition)) {
        result += str[index];
      } else if(matchWholeMask) {
        result = "";
        break;
      } else {
        break;
      }
    }
  }
  return result;
}

/**
 * A class that describes an input mask of the `"pattern"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType).
 *
 * The following code shows how to specify the properties of this class within a survey JSON schema:
 *
 * ```js
 * const surveyJson = {
 *   "elements": [{
 *     "name": "textquestion1"
 *     "type": "text",
 *     "maskType": "pattern",
 *     "maskSettings": {
 *       // Specify the properties of a pattern input mask here
 *     }
 *   }]
 * }
 * ```
 *
 * [View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))
 */
export class InputMaskPattern extends InputMaskBase {
  private literals: Array<IMaskLiteral> = [];

  /**
   * A pattern for the input value.
   *
   * If you set the [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType) to `"pattern"`, the mask can contain string literals and the following placeholders:
   *
   * - `9` - A digit.
   * - `a` - An upper- or lower-case letter.
   * - `#` - A digit or an upper- or lower-case letter.
   *
   * Use backslash `\` to escape a character.
   *
   * Example: `+1(999)-999-99-99`
   *
   * If you set the [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType) to `"datetime"`, the mask can contain separator characters and the following placeholders:
   *
   * - `m` - Month number.
   * - `mm` - Month number, with leading zero for single-digit values.
   * - `d` - Day of the month.
   * - `dd` - Day of the month, with leading zero for single-digit values.
   * - `yy` - Last two digits of the year.
   * - `yyyy` - A four-digit year.
   * - `H` - Hours in 24-hour format.
   * - `HH` - Hours in 24-hour format, with leading zero for single-digit values.
   * - `h` - Hours in 12-hour format.
   * - `hh` - Hours in 12-hour format, with leading zero for single-digit values.
   * - `MM` - Minutes.
   * - `ss` - Seconds.
   * - `TT` - 12-hour clock period in upper case (AM/PM).
   * - `tt` - 12-hour clock period in lower case (am/pm).
   *
   * Example: `mm/dd/yyyy HH:MM:ss`
   *
   * [View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))
   * @see [settings.maskSettings](https://surveyjs.io/form-library/documentation/api-reference/settings#maskSettings)
   */
  @property() pattern: string;

  protected updateLiterals(): void {
    this.literals = getLiterals(this.pattern || "");
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    if(name === "pattern") {
      this.updateLiterals();
    }
  }

  public getType(): string {
    return "patternmask";
  }

  public fromJSON(json: any, options?: ILoadFromJSONOptions): void {
    super.fromJSON(json, options);
    this.updateLiterals();
  }

  public _getMaskedValue(src: string, matchWholeMask: boolean = false): string {
    const input = (src === undefined || src === null) ? "" : src;
    return getMaskedValueByPattern(input, this.literals, matchWholeMask);
  }
  public _getUnmaskedValue(src: string, matchWholeMask: boolean = false): string {
    const input = (src === undefined || src === null) ? "" : src;
    return getUnmaskedValueByPattern(input, this.literals, matchWholeMask);
  }
  public processInput(args: ITextInputParams): IMaskedInputResult {
    const result = { value: args.prevValue, caretPosition: args.selectionEnd, cancelPreventDefault: false };
    if(!args.insertedChars && args.selectionStart === args.selectionEnd) {
      return result;
    }

    const leftPart = args.prevValue.slice(0, args.selectionStart) + (args.insertedChars || "");
    const leftPartUnmasked = getUnmaskedValueByPattern(args.prevValue.slice(0, args.selectionStart), this.literals.slice(0, args.selectionStart), false);
    const rightPartUnmasked = getUnmaskedValueByPattern(args.prevValue.slice(args.selectionEnd), this.literals.slice(args.selectionEnd), false, true);
    result.value = this._getMaskedValue(leftPartUnmasked + (args.insertedChars || "") + rightPartUnmasked, true);

    if(!args.insertedChars && args.inputDirection === "backward") {
      result.caretPosition = args.selectionStart;
    } else {
      result.caretPosition = this._getMaskedValue(leftPart).length;
    }

    return result;
  }
  public getMaskedValue(src: any): string {
    return this._getMaskedValue(src, true);
  }
  public getUnmaskedValue(src: string): any {
    return this._getUnmaskedValue(src, true);
  }
}

Serializer.addClass(
  "patternmask",
  [
    { name: "pattern" },
  ],
  function () {
    return new InputMaskPattern();
  },
  "masksettings"
);