interface IMaskedValue {
  text: string;
  cursorPosition: number;
}

export var settings = {
  placeholderChar: "_",
  escapedChar: "\\",
  definitions: <{ [key: string]: RegExp }>{
    "9": /[0-9]/,
    "a": /[a-zA-Z]/,
    "*": /[a-zA-Z0-9]/
  }
};

interface IMaskLiteral {
  type: "const" | "regex";
  value: any;
}

export function syntacticAnalysisMask(mask: string): Array<IMaskLiteral> {
  const result: Array<IMaskLiteral> = [];
  let prevChartIsEscaped = false;
  const definitionsKeys = Object.keys(settings.definitions);

  for(let index = 0; index < mask.length; index++) {
    const currentChar = mask[index];
    if(currentChar === settings.escapedChar) {
      prevChartIsEscaped = true;
    } else if(prevChartIsEscaped) {
      prevChartIsEscaped = false;
      result.push({ type: "const", value: currentChar });
    } else {
      result.push({ type: definitionsKeys.indexOf(currentChar) !== -1 ? "regex" : "const", value: currentChar });
    }
  }

  return result;
}

export function getMaskedValueByPatternOld(str: string, pattern: string, matchWholeMask = true): string {
  let result = "";
  let strIndex = 0;
  for(let maskIndex = 0; maskIndex < pattern.length; maskIndex++) {
    const currentDefinition = settings.definitions[pattern[maskIndex]];
    if(currentDefinition) {
      if(strIndex < str.length && str[strIndex].match(currentDefinition)) {
        result += str[strIndex];
      } else if(matchWholeMask) {
        result += settings.placeholderChar;
      } else {
        break;
      }
      strIndex++;
    } else {
      result += pattern[maskIndex];
    }
  }
  return result;
}

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

export function getUnmaskedValueByPatternOld(str: string, pattern: string, matchWholeMask: boolean): string {
  let result = "";
  if(!str) return result;

  for(let index = 0; index < pattern.length; index++) {
    const currentDefinition = settings.definitions[pattern[index]];
    if(currentDefinition) {
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