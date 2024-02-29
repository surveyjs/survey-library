import { settings } from "../settings";
import { Serializer, property } from "../jsonobject";
import { InputMaskBase } from "./mask_base";
import { IMaskedValue, ITextMaskInputArgs } from "./mask_utils";

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

export class InputMaskPattern extends InputMaskBase {
  private literals: Array<IMaskLiteral> = [];

  @property({
    onSet: (val: string, target: InputMaskPattern) => {
      target.updateLiterals();
    }
  }) pattern: string;

  protected updateLiterals(): void {
    this.literals = getLiterals(this.pattern || "");
  }

  public getType(): string {
    return "patternmask";
  }

  public _getMaskedValue(src: string, matchWholeMask: boolean = false): string {
    const input = (src === undefined || src === null) ? "" : src;
    return getMaskedValueByPattern(input, this.literals, matchWholeMask);
  }
  public _getUnmaskedValue(src: string, matchWholeMask: boolean = false): string {
    const input = (src === undefined || src === null) ? "" : src;
    return getUnmaskedValueByPattern(input, this.literals, matchWholeMask);
  }
  public processInput(args: ITextMaskInputArgs): IMaskedValue {
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