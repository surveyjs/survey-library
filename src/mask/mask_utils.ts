export interface IMaskedValue {
  text: string;
  cursorPosition: number;
}

export var settings = {
  placeholderChar: "_",
  escapedChar: "\\",
  numberOptions: {
    decimal: ".",
    thousands: ",",
    precision: 2,
    allowNegative: true,
    align: "right"
  },
  definitions: <{ [key: string]: RegExp }>{
    "9": /[0-9]/,
    "a": /[a-zA-Z]/,
    "*": /[a-zA-Z0-9]/
  }
};

interface IMaskLiteral {
  type: "const" | "regex";
  repeat?: boolean;
  value: any;
}

export function syntacticAnalysisMask(mask: string): Array<IMaskLiteral> {
  const result: Array<IMaskLiteral> = [];
  let prevChartIsEscaped = false;
  let prevChart;
  const definitionsKeys = Object.keys(settings.definitions);

  for(let index = 0; index < mask.length; index++) {
    const currentChar = mask[index];
    if(currentChar === settings.escapedChar) {
      prevChartIsEscaped = true;
    } else if(prevChartIsEscaped) {
      prevChartIsEscaped = false;
      result.push({ type: "const", value: currentChar });
    } else if(currentChar === "+") {
      result[result.length - 1].repeat = true;
    } else {
      result.push({ type: definitionsKeys.indexOf(currentChar) !== -1 ? "regex" : "const", value: currentChar });
    }
    prevChart = currentChar;
  }

  return result;
}

// export function getMaskedValueByPatternOld(str: string, pattern: string, matchWholeMask = true): string {
//   let result = "";
//   let strIndex = 0;
//   for(let maskIndex = 0; maskIndex < pattern.length; maskIndex++) {
//     const currentDefinition = settings.definitions[pattern[maskIndex]];
//     if(currentDefinition) {
//       if(strIndex < str.length && str[strIndex].match(currentDefinition)) {
//         result += str[strIndex];
//       } else if(matchWholeMask) {
//         result += settings.placeholderChar;
//       } else {
//         break;
//       }
//       strIndex++;
//     } else {
//       result += pattern[maskIndex];
//     }
//   }
//   return result;
// }

// export function getUnmaskedValueByPatternOld(str: string, pattern: string, matchWholeMask: boolean): string {
//   let result = "";
//   if(!str) return result;

//   for(let index = 0; index < pattern.length; index++) {
//     const currentDefinition = settings.definitions[pattern[index]];
//     if(currentDefinition) {
//       if(!!str[index] && str[index].match(currentDefinition)) {
//         result += str[index];
//       } else if(matchWholeMask) {
//         result = "";
//         break;
//       } else {
//         break;
//       }
//     }
//   }
//   return result;
// }
