import { Serializer } from "../jsonobject";
import { InputMaskPattern } from "./mask_pattern";
import { IMaskedValue, ITextMaskInputArgs, numberDefinition } from "./mask_utils";

export interface IDateTimeMaskLexem {
  type: "month" | "day" | "year" | "separator";
  value: any;
  count: number;
  maxCount: number;
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
  min?: Date;
  max?: Date;
}

export function getDateTimeLexems(mask: string): Array<IDateTimeMaskLexem> {
  const result: Array<IDateTimeMaskLexem> = [];
  let prevLexemType: string;

  const createOrUpdateLexem = (currentLexemType: "month" | "day" | "year" | "separator", currentChar: string) => {
    if(!!prevLexemType && prevLexemType === currentLexemType) {
      result[result.length - 1].count++;
    } else {
      const maxCount = (currentLexemType === "month" || currentLexemType === "day") ? 2 : (currentLexemType === "year") ? 4 : 1;
      result.push({ type: currentLexemType, value: currentChar, count: 1, data: "", maxCount: maxCount });
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
        result.push({ type: "separator", value: currentChar, count: 1, maxCount: 1 });
        break;
    }
    prevLexemType = result[result.length - 1].type;
  }

  return result;
}

export class InputMaskDateTime extends InputMaskPattern {
  private currentValue: Array<{ lexem: IDateTimeMaskLexem, data?: string }> = [];
  private lexems: Array<IDateTimeMaskLexem> = [];

  protected updateLiterals(): void {
    this.lexems = getDateTimeLexems(this.mask || "");
  }

  private getOnlyNumbers(input: string): string {
    let result = "";
    for(let index = 0; index < input.length; index++) {
      if(input[index].match(numberDefinition)) {
        result += input[index];
      }
    }
    return result;
  }

  private getMaskedStrFromISO(str: string): string {
    const date = new Date(str);
    this.lexems.forEach(l => l.data = undefined);

    if(!isNaN(date as any)) {
      this.lexems.forEach(lexem => {
        switch(lexem.type) {
          case("day"): {
            lexem.data = date.getDate().toString();
            break;
          }
          case("month"): {
            lexem.data = (date.getMonth() + 1).toString();
            break;
          }
          case("year"): {
            lexem.data = date.getFullYear().toString();
            break;
          }
          default: {
            break;
          }
        }
      });
    }
    return this.getFormatedString(true);
  }
  private getISO_8601Format(dateTime: IDateTimeComposition): string {
    if(dateTime.year === undefined || dateTime.month === undefined || dateTime.day === undefined) return "";

    const year = this.getPlaceholder(4, dateTime.year.toString(), "0", true) + dateTime.year;
    const month = this.getPlaceholder(2, dateTime.month.toString(), "0", true) + dateTime.month;
    const day = this.getPlaceholder(2, dateTime.day.toString(), "0", true) + dateTime.day;
    return [year, month, day].join("-");
  }

  private isDateValid(dateTime: IDateTimeComposition): boolean {
    const year = dateTime.year !== undefined ? dateTime.year : 2000;
    const month = dateTime.month !== undefined ? dateTime.month : 1;
    const day = dateTime.day !== undefined ? dateTime.day : 1;
    const min = dateTime.min !== undefined ? dateTime.min : new Date("0001-01-01");
    const max = dateTime.max !== undefined ? dateTime.max : new Date("9999-12-31");
    const date = new Date(this.getISO_8601Format({ year: year, month: month, day: day }));
    const monthIndex = month - 1;

    return !isNaN(date as any) &&
    date.getDate() === day &&
    date.getMonth() === monthIndex &&
    date.getFullYear() === year &&
    date >= min && date <= max;
  }

  private getPlaceholder(lexemLength: number, str: string, char: string, matchWholeMask: boolean) {
    if(!matchWholeMask) return "";

    const paddingsLength = lexemLength - (str || "").length;
    const paddings = paddingsLength > 0 ? char.repeat(paddingsLength) : "";
    return paddings;
  }
  private isEntryComplete(lexem: IDateTimeMaskLexem, dateTime: IDateTimeComposition): boolean {
    let data = lexem.data;
    let result = false;
    if(!data) return result;

    const propertyName = lexem.type;
    dateTime[propertyName] = parseInt(data);
    if(data.length === lexem.maxCount) {
      if(this.isDateValid(dateTime)) {
        data = parseInt(data).toString();
        result = true;
      } else {
        // copy-paste ???
        data = data.slice(0, data.length - 1);
        result = false;
      }
    } else if((propertyName === "day" && parseInt(data[0]) > 3) ||
    (propertyName === "month" && parseInt(data[0]) > 1)) {
      result = true;
    } else {
      result = false;
    }

    lexem.data = data;
    dateTime[propertyName] = parseInt(data) > 0 ? parseInt(data) : undefined;
    return result;
  }

  private getCorrectDataFormat(lexem: IDateTimeMaskLexem, isCompleted: boolean, matchWholeMask: boolean): string {
    let data = lexem.data || "";
    if(isCompleted) {
      const zeroPaddings = this.getPlaceholder(lexem.count, data, "0", true);
      data = zeroPaddings + data;
    } else {
      if(((lexem.type === "day" && parseInt(data[0]) === 0) || (lexem.type === "month" && parseInt(data[0]) === 0)) && lexem.count < lexem.maxCount) {
        data = data.slice(1, data.length);
      }
      data += this.getPlaceholder(lexem.count, data, lexem.value, matchWholeMask);
    }

    if(!data && matchWholeMask) {
      data += lexem.value.repeat(lexem.count);
    }
    return data;
  }

  private getFormatedString(matchWholeMask: boolean): string {
    const tempDateTime: IDateTimeComposition = { day: undefined, month: undefined, year: undefined };
    let result = "";
    for(let index = 0; index < this.lexems.length; index++) {
      const lexem = this.lexems[index];
      if(lexem.type === "day" || lexem.type === "month" || lexem.type === "year") {
        const isCompleted = this.isEntryComplete(lexem, tempDateTime);
        let data = this.getCorrectDataFormat(lexem, isCompleted, matchWholeMask);
        if(!!data) {
          result += data;
          // if(data.length < lexem.count) {
          if(!isCompleted && !matchWholeMask) {
            break;
          }
        } else {
          break;
        }
      } else if (lexem.type === "separator") {
        result += lexem.value;
      }
    }

    return result;
  }
  private setLexemData(numberParts: string[]): void {
    const numberLexems = this.lexems.filter(l => l.type !== "separator");
    numberLexems.forEach(l => l.data = undefined);

    if (numberParts.length > 0) {
      numberParts.forEach((part, index) => {
        const _data = this.getOnlyNumbers(part);
        numberLexems[index].data = _data.slice(0, numberLexems[index].maxCount);
      });
    }
  }

  _getMaskedValue(src: string, matchWholeMask: boolean = true): string {
    let input = (src === undefined || src === null) ? "" : src.toString();
    const inputParts = this.getParts(input);
    this.setLexemData(inputParts);
    const result = this.getFormatedString(matchWholeMask);
    return result;
  }

  private getPartsOld(input: string): Array<string> {
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
      } else {

      }
      separatorLexemsIndex++;
    } while (!!input);

    return inputParts;
  }

  private getParts(input: string): Array<string> {
    const inputParts: Array<string> = [];
    const nonSeparatorLexems = this.lexems.filter(l => l.type !== "separator");
    let curPart = "";
    for(let i = 0; i < input.length; i++) {
      // if(input[i].match(numberDefinition) && curPart.length < nonSeparatorLexems[inputParts.length].maxCount) {
      //   curPart += input[i];
      // }
      if(!(input[i].match(numberDefinition) || input[i] == nonSeparatorLexems[inputParts.length].value)) {
        if(curPart != "") {
          inputParts.push(curPart);
          curPart = "";
        }
      } else {
        curPart += input[i];
        // if(curPart.length == nonSeparatorLexems[inputParts.length].maxCount) {
        //   if(curPart != "") {
        //     inputParts.push(curPart);
        //     curPart = "";
        //   }
        // }
      }
      if(inputParts.length >= nonSeparatorLexems.length) break;
    }

    if(curPart != "") {
      inputParts.push(curPart);
      curPart = "";
    }
    return inputParts;
  }

  public getUnmaskedValue(src: string): string {
    let input = (src === undefined || src === null) ? "" : src.toString();
    const inputParts = this.getParts(input);
    this.setLexemData(inputParts);

    const tempDateTime: IDateTimeComposition = { day: undefined, month: undefined, year: undefined };
    this.lexems.forEach(lexem => {
      let str = lexem.data;
      if(!str || str.length < lexem.count) return undefined;
      tempDateTime[lexem.type] = parseInt(str);
    });

    return this.getISO_8601Format(tempDateTime);
  }
  public getMaskedValue(src: string): string {
    const input = (src === undefined || src === null) ? "" : src;
    if(this.dataToSave === "unmasked") {
      return this.getMaskedStrFromISO(input);
    }
    return this._getMaskedValue(input);
  }

  public processInput(args: ITextMaskInputArgs): IMaskedValue {
    const result = { text: args.prevValue, cursorPosition: args.selectionEnd, cancelPreventDefault: false };
    const leftPart = args.prevValue.slice(0, args.selectionStart);
    const rightPart = args.prevValue.slice(args.selectionEnd);

    result.text = this._getMaskedValue(leftPart + (args.insertedCharacters || "") + rightPart);
    if(!args.insertedCharacters && args.inputDirection === "rightToLeft") {
      result.cursorPosition = args.selectionStart;
    } else {
      result.cursorPosition = this._getMaskedValue(leftPart + (args.insertedCharacters || ""), false).length;
    }
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