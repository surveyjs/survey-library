import { Serializer } from "../jsonobject";
import { InputMaskPattern } from "./mask_pattern";
import { IMaskedValue, ITextMaskInputArgs, settings } from "./mask_utils";

export interface IDateTimeMaskLexem {
  type: "month" | "day" | "year" | "separator";
  value: any;
  length: number;
  data?: string;
}

interface IDateTimeComposition {
  [index: string]: any;
  day: number;
  month: number;
  year: number;
  hour?: number;
  minute?: number;
  second?: number;
}

export function getDateTimeLexems(mask: string): Array<IDateTimeMaskLexem> {
  const result: Array<IDateTimeMaskLexem> = [];
  let prevLexemType: string;

  const createOrUpdateLexem = (currentLexemType: "month" | "day" | "year" | "separator", currentChar: string) => {
    if(!!prevLexemType && prevLexemType === currentLexemType) {
      result[result.length - 1].length++;
    } else {
      result.push({ type: currentLexemType, value: currentChar, length: 1, data: "" });
    }
  };

  for(let index = 0; index < mask.length; index++) {
    const currentChar = mask[index];
    switch (currentChar) {
      case "m":
        createOrUpdateLexem("month", "m");
        break;
      case "d":
        createOrUpdateLexem("day", "d");
        break;
      case "y":
        createOrUpdateLexem("year", "y");
        break;
      default:
        result.push({ type: "separator", value: currentChar, length: 1 });
        break;
    }
    prevLexemType = result[result.length - 1].type;
  }

  return result;
}

export class InputMaskDateTime extends InputMaskPattern {
  numberDefinition = settings.definitions["9"];
  private lexems: Array<IDateTimeMaskLexem> = [];

  protected updateLiterals(): void {
    this.lexems = getDateTimeLexems(this.mask || "");
  }

  private getOnlyNumbers(input: string): string {
    let result = "";
    for(let index = 0; index < input.length; index++) {
      if(input[index].match(this.numberDefinition)) {
        result += input[index];
      }
    }
    return result;
  }

  private isDateValid(dateTime: IDateTimeComposition): boolean {
    const year = dateTime.year !== undefined ? dateTime.year : 2000,
      month = dateTime.month !== undefined ? dateTime.month : 1,
      day = dateTime.day !== undefined ? dateTime.day : 1;
    const monthIndex = month - 1;
    const date = new Date(year, monthIndex, day);

    return date.getDate() === day &&
    date.getMonth() === monthIndex &&
    date.getFullYear() === year &&
    !isNaN(date as any);
  }

  private getPlaceholderPart(lexemLength: number, str: string, char: string) {
    const paddingsLength = lexemLength - (str || "").length;
    const paddings = paddingsLength > 0 ? char.repeat(paddingsLength) : "";
    return paddings;
  }
  private validateDatePart(lexem: IDateTimeMaskLexem, dateTime: IDateTimeComposition, propertyName: string): void {
    let str = lexem.data;
    if(!str) return undefined;

    dateTime[propertyName] = parseInt(str);
    if(this.isDateValid(dateTime)) {
      if(str.length > lexem.length) {
        str = parseInt(str).toString();
      } else {
        const zeroPaddings = this.getPlaceholderPart(lexem.length, str, "0");
        str = zeroPaddings + str;
      }
    } else {
      str = str.slice(0, str.length - 1);
      str += this.getPlaceholderPart(lexem.length, str, lexem.value);
    }

    lexem.data = str;
    dateTime[propertyName] = parseInt(str);
  }

  private formatDateTime(): string {
    let result = "";
    this.lexems.forEach(lexem => {

      switch(lexem.type) {
        case "day":
        case "month":
        case "year": {
          result += (!!lexem.data ? lexem.data : lexem.value.repeat(lexem.length));
          break;
        }
        case "separator": {
          result += lexem.value;
          break;
        }
      }
    });

    return result;
  }
  private assignLexemData(numberParts: string[]): void {
    const tempDateTime: IDateTimeComposition = { day: undefined, month: undefined, year: undefined };
    if (numberParts.length > 0) {
      const numberLexems = this.lexems.filter(l => l.type !== "separator");
      numberLexems.forEach(l => l.data = undefined);
      numberParts.forEach((part, index) => {
        numberLexems[index].data = this.getOnlyNumbers(part);
      });

      numberLexems.forEach(l => { this.validateDatePart(l, tempDateTime, l.type); });
    }
  }

  _getMaskedValue(src: string): string {
    let input = (src === undefined || src === null) ? "" : src.toString();
    const inputParts = this.getNumberParts(input);
    this.assignLexemData(inputParts);
    return this.formatDateTime();
  }

  private getNumberParts(input: string): Array<string> {
    const inputParts: Array<string> = [];
    const separatorLexems = this.lexems.filter(l => l.type === "separator");

    let separatorLexemsIndex = 0;
    do {
      if (!separatorLexems[separatorLexemsIndex]) {
        if (!!input) {
          inputParts.push(input);
          input = "";
        }
        break;
      }

      let separatorCharIndex = input.indexOf(separatorLexems[separatorLexemsIndex].value);
      if (separatorCharIndex !== -1) {
        const part = input.slice(0, separatorCharIndex);
        if (!!part) {
          inputParts.push(part);
        }
        input = input.slice(separatorCharIndex + 1);
      }
      separatorLexemsIndex++;
    } while (!!input);

    return inputParts;
  }

  public getUnmaskedValue(src: string): string {
    return this.getMaskedValue(src);
  }
  public getMaskedValue(src: string): string {
    const input = (src === undefined || src === null) ? "" : src;

    return this._getMaskedValue(input);
  }

  public processInput(args: ITextMaskInputArgs): IMaskedValue {
    const result = { text: args.prevValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };
    const leftPart = args.prevValue.slice(0, args.selectionStart);
    const rightPart = args.prevValue.slice(args.selectionEnd);

    result.text = this._getMaskedValue(leftPart + (args.insertedCharacters || "") + rightPart);
    return result;
  }
}

Serializer.addClass(
  "datetimemask",
  [],
  function () {
    return new InputMaskDateTime();
  },
  "patternmask"
);