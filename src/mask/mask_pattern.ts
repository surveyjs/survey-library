import { InputMaskBase } from "./mask_base";
import { MaskManagerType, IMaskOption, IMaskedValue, ITextMaskInputArgs } from "./mask_manager";
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

export function getMaskedValueByPatternOld(str: string, pattern: string | Array<IMaskLiteral>, matchWholeMask = true): string {
  let result = "";
  let strIndex = 0;

  let literals: Array<IMaskLiteral> = (typeof pattern === "string") ? getLiterals(pattern) : pattern;
  for(let maskIndex = 0; maskIndex < literals.length; maskIndex++) {
    if(literals[maskIndex].type === "regex") {
      const currentDefinition = settings.definitions[literals[maskIndex].value];
      if(strIndex < str.length && str[strIndex].match(currentDefinition)) {
        result += str[strIndex];
      } else if(matchWholeMask) {
        result += settings.placeholderChar;
      } else {
        break;
      }
      strIndex++;
    } else if(literals[maskIndex].type === "const" || literals[maskIndex].type === "fixed") {
      result += literals[maskIndex].value;
      if(literals[maskIndex].value === str[strIndex]) {
        strIndex++;
      }
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

export function getUnmaskedValueByPattern(str: string, pattern: string | Array<IMaskLiteral>, matchWholeMask: boolean): string {
  let result = "";
  if(!str) return result;

  let literals: Array<IMaskLiteral> = (typeof pattern === "string") ? getLiterals(pattern) : pattern;
  for(let index = 0; index < literals.length; index++) {
    if(literals[index].type === "fixed") {
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

export function processValueWithPattern(str: string, pattern: string | Array<IMaskLiteral>, prevCursorPosition: number, currentCursorPosition: number): IMaskedValue {
  let result = "";
  if(!str) return <IMaskedValue>{ text: result, cursorPosition: currentCursorPosition };
  let leftPartResult = "";
  let rigthPartResult = "";
  let centerPart = "";
  let newCursorPosition = currentCursorPosition;

  let literals: Array<IMaskLiteral> = (typeof pattern === "string") ? getLiterals(pattern) : pattern;
  const leftPartRange = Math.min(prevCursorPosition, currentCursorPosition, literals.length - 1);
  leftPartResult = getUnmaskedValueByPattern(str.substring(0, leftPartRange), literals, false);
  rigthPartResult = getUnmaskedValueByPattern(str.substring(currentCursorPosition), literals.slice(prevCursorPosition), false);
  if(currentCursorPosition > prevCursorPosition) {
    centerPart = getUnmaskedValueByPattern(str.substring(leftPartRange, currentCursorPosition), literals.slice(leftPartRange), false);
    newCursorPosition = getMaskedValueByPatternOld(leftPartResult + centerPart, literals, false).length;
  }
  result = getMaskedValueByPatternOld(leftPartResult + centerPart + rigthPartResult, literals);
  return <IMaskedValue>{ text: result, cursorPosition: newCursorPosition, cancelPreventDefault: false };
}

export class InputMaskPattern extends InputMaskBase {
  private _maskLiterals: Array<IMaskLiteral>;
  get literals(): Array<IMaskLiteral> {
    if(!this._maskLiterals) {
      this._maskLiterals = getLiterals(this.maskOptions.mask);
    }
    return this._maskLiterals;
  }
  public processInput(args: ITextMaskInputArgs): IMaskedValue {
    const result = { text: args.prevValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };
    if(!args.insertedCharacters && args.selectionStart === args.selectionEnd) {
      return result;
    }

    const isInsertOperation = !!args.insertedCharacters && args.insertedCharacters.length > args.selectionEnd - args.selectionStart;
    const leftPart = args.prevValue.slice(0, args.selectionStart) + (args.insertedCharacters || "");
    if(isInsertOperation) {
      const leftPartMasked = this.getMaskedValue(leftPart);
      const rightPart = args.prevValue.slice(leftPartMasked.length - 1);
      result.text = this.getMaskedValue(leftPartMasked + rightPart, true);
    } else {
      const rightPart = args.prevValue.slice(args.selectionEnd);
      result.text = this.getMaskedValue(leftPart + rightPart, true);
    }

    if(!args.insertedCharacters && args.inputDirection === "rightToLeft") {
      result.cursorPosition = args.selectionStart;
    } else {
      result.cursorPosition = this.getMaskedValue(leftPart).length;
    }

    return result;
  }
  public getMaskedValue(src: string, matchWholeMask: boolean = false): string {
    return getMaskedValueByPattern(src, this.literals, matchWholeMask);
  }
  public getUnmaskedValue(src: string, matchWholeMask: boolean = false): string {
    return getUnmaskedValueByPattern(src, this.literals, matchWholeMask);
  }
}

MaskManagerType.Instance.registerMaskManagerType("pattern", (mask: IMaskOption) => { return new InputMaskPattern(mask); });