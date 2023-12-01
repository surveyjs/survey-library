import { InputMaskBase } from "./mask";
import { IMaskedValue, settings, syntacticAnalysisMask } from "./mask_utils";

export function getMaskedValueByPattern(str: string, pattern: string, matchWholeMask = true): string {
  let result = "";
  let strIndex = 0;

  const parsedMask = syntacticAnalysisMask(pattern);
  for(let maskIndex = 0; maskIndex < parsedMask.length; maskIndex++) {
    if(parsedMask[maskIndex].type === "regex") {
      const currentDefinition = settings.definitions[parsedMask[maskIndex].value];
      if(strIndex < str.length && str[strIndex].match(currentDefinition)) {
        result += str[strIndex];
      } else if(matchWholeMask) {
        result += settings.placeholderChar;
      } else {
        break;
      }
      strIndex++;
    } else if(parsedMask[maskIndex].type === "const") {
      result += parsedMask[maskIndex].value;
      if(parsedMask[maskIndex].value === str[strIndex]) {
        strIndex++;
      }
    }
  }
  return result;
}

export function getUnmaskedValueByPattern(str: string, pattern: string, matchWholeMask: boolean): string {
  let result = "";
  if(!str) return result;

  const parsedMask = syntacticAnalysisMask(pattern);
  for(let index = 0; index < parsedMask.length; index++) {
    if(parsedMask[index].type === "regex") {
      const currentDefinition = settings.definitions[parsedMask[index].value];
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

export function processValueWithPattern(str: string, pattern: string, prevСursorPosition: number, currentCursorPosition: number): IMaskedValue {
  let result = "";
  if(!str) return <IMaskedValue>{ text: result, cursorPosition: currentCursorPosition };
  let leftPartResult = "";
  let rigthPartResult = "";
  let centerPart = "";
  let newCursorPosition = currentCursorPosition;

  const leftPartRange = Math.min(prevСursorPosition, currentCursorPosition, pattern.length - 1);
  leftPartResult = getUnmaskedValueByPattern(str.substring(0, leftPartRange), pattern.substring(0, leftPartRange), false);
  rigthPartResult = getUnmaskedValueByPattern(str.substring(currentCursorPosition), pattern.substring(prevСursorPosition), false);
  if(currentCursorPosition > prevСursorPosition) {
    centerPart = getUnmaskedValueByPattern(str.substring(leftPartRange, currentCursorPosition), pattern.substring(leftPartRange), false);
    newCursorPosition = getMaskedValueByPattern(leftPartResult + centerPart, pattern, false).length;

  }
  result = getMaskedValueByPattern(leftPartResult + centerPart + rigthPartResult, pattern);
  return <IMaskedValue>{ text: result, cursorPosition: newCursorPosition };
}

export class InputMaskPattern extends InputMaskBase {
  protected getMaskedValue(mask: string, option?: any): string {
    return getMaskedValueByPattern(getUnmaskedValueByPattern(this.input.value, mask, false), mask);
  }
  protected processMaskedValue(mask: string): IMaskedValue {
    return processValueWithPattern(this.input.value, mask, this._prevSelectionStart, this.input.selectionStart);
  }

  protected updateMaskedString(mask: string, option?: any): void {
    if(!!this.input) {
      const result = this.processMaskedValue(mask);
      this.input.value = result.text;
      this.input.setSelectionRange(result.cursorPosition, result.cursorPosition);
    }
  }
}