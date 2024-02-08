import { InputMaskBase } from "./mask_base";
import { MaskManagerType } from "./mask_manager";
import { IMaskSettings } from "./mask_settings";

export interface IDateTimeMaskLiteral {
  type: "month" | "day" | "year" | "separator";
  value: any;
  length: number;
}

export function getDateTimeLiterals(mask: string): Array<IDateTimeMaskLiteral> {
  const result: Array<IDateTimeMaskLiteral> = [];
  let prevLiteralType: string;

  const createOrUpdateLiteral = (currentLiteralType: "month" | "day" | "year" | "separator", currentChar: string) => {
    if(!!prevLiteralType && prevLiteralType === currentLiteralType) {
      result[result.length - 1].length++;
    } else {
      result.push({ type: currentLiteralType, value: currentChar, length: 1 });
    }
  };

  for(let index = 0; index < mask.length; index++) {
    const currentChar = mask[index];
    switch (currentChar) {
      case "m":
        createOrUpdateLiteral("month", "m");
        break;
      case "d":
        createOrUpdateLiteral("day", "d");
        break;
      case "y":
        createOrUpdateLiteral("year", "y");
        break;
      default:
        result.push({ type: "separator", value: currentChar, length: 1 });
        break;
    }
    prevLiteralType = result[result.length - 1].type;
  }

  return result;
}

export class InputMaskDateTime extends InputMaskBase {
  // public processInput(args: ITextMaskInputArgs): IMaskedValue {
  //   return { text: args.prevValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };
  // }

  public getUnmaskedValue(src: string): string { return src; }
  public getMaskedValue(src: string): string { return src; }
}

MaskManagerType.Instance.registerMaskManagerType("datetime", (maskOptions: IMaskSettings) => { return new InputMaskDateTime(maskOptions); });