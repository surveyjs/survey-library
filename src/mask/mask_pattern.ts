import { InputMaskBase } from "./mask_base";
import { MaskManagerType, IMaskedValue, ITextMaskInputArgs } from "./mask_manager";
import { IMaskSettings } from "./mask_settings";
import { settings } from "./mask_utils";

export interface IMaskLiteral {
  type: "const" | "regex" | "fixed";
  value: any;
}

export function getLiterals(mask: string): Array<IMaskLiteral> {
  const result: Array<IMaskLiteral> = [];
  let prevCharIsEscaped = false;
  const definitionsKeys = Object.keys(settings.definitions);

  for(let index = 0; index < mask.length; index++) {
    const currentChar = mask[index];
    if(currentChar === settings.escapedChar) {
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
  const currentDefinition = settings.definitions[literal.value];
  while(strIndex < str.length) {
    if(str[strIndex].match(currentDefinition)) {
      return strIndex;
    }
    strIndex++;
  }
  return strIndex;
}

export function getMaskedValueByPattern(str: string, pattern: string | Array<IMaskLiteral>, matchWholeMask:boolean): string {
  let result = "";
  let strIndex = 0;
  const literals: Array<IMaskLiteral> = (typeof pattern === "string") ? getLiterals(pattern) : pattern;

  maskEnumerator:
  for(let maskIndex = 0; maskIndex < literals.length; maskIndex++) {
    switch(literals[maskIndex].type) {
      case "regex" :
        if(strIndex < str.length) {
          strIndex = getFirstMatch(str, strIndex, literals[maskIndex]);
        }
        if(strIndex < str.length) {
          result += str[strIndex];
        } else if(matchWholeMask) {
          result += settings.placeholderChar;
        } else {
          break maskEnumerator;
        }

        strIndex++;
        break;

      case "const":
      case "fixed":
        result += literals[maskIndex].value;
        if(literals[maskIndex].value === str[strIndex]) {
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
      const currentDefinition = settings.definitions[literals[index].value];
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

export class InputMaskPattern extends InputMaskBase {
  private _maskLiterals: Array<IMaskLiteral>;
  get literals(): Array<IMaskLiteral> {
    if(!this._maskLiterals) {
      this._maskLiterals = getLiterals(this.maskOptions.mask);
    }
    return this._maskLiterals;
  }
  public _getMaskedValue(src: string, matchWholeMask: boolean = false): string {
    return getMaskedValueByPattern(src, this.literals, matchWholeMask);
  }
  public _getUnmaskedValue(src: string, matchWholeMask: boolean = false): string {
    return getUnmaskedValueByPattern(src, this.literals, matchWholeMask);
  }
  public processInput(args: ITextMaskInputArgs): IMaskedValue {
    const result = { text: args.prevValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };
    if(!args.insertedCharacters && args.selectionStart === args.selectionEnd) {
      return result;
    }

    const leftPart = args.prevValue.slice(0, args.selectionStart) + (args.insertedCharacters || "");
    const leftPartUnmasked = getUnmaskedValueByPattern(args.prevValue.slice(0, args.selectionStart), this.literals.slice(0, args.selectionStart), false);
    const rightPartUnmasked = getUnmaskedValueByPattern(args.prevValue.slice(args.selectionEnd), this.literals.slice(args.selectionEnd), false, true);
    result.text = this._getMaskedValue(leftPartUnmasked + (args.insertedCharacters || "") + rightPartUnmasked, true);

    if(!args.insertedCharacters && args.inputDirection === "rightToLeft") {
      result.cursorPosition = args.selectionStart;
    } else {
      result.cursorPosition = this._getMaskedValue(leftPart).length;
    }

    return result;
  }
  public getMaskedValue(src: string): string {
    return this._getMaskedValue(src, true);
  }
  public getUnmaskedValue(src: string): string {
    return this._getUnmaskedValue(src, true);
  }
}

MaskManagerType.Instance.registerMaskManagerType("pattern", (mask: IMaskSettings) => { return new InputMaskPattern(mask); });