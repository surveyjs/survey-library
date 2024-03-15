import { Serializer, property } from "../jsonobject";
import { InputMaskPattern } from "./mask_pattern";
import { IMaskedInputResult, ITextInputParams, numberDefinition } from "./mask_utils";

export interface IDateTimeMaskLexem {
  type: "month" | "day" | "year" | "separator";
  value: any;
  count: number;
  maxCount: number;
}

interface IInputDateTimeData {
  lexem: IDateTimeMaskLexem;
  value: string;
  isCompleted: boolean;
}

interface IDateTimeComposition {
  day: number;
  month: number;
  year: number;
  hour?: number;
  minute?: number;
  second?: number;
  min?: Date;
  max?: Date;
}

function getMaxCountLexem(currentLexemType: string, count: number): number {
  switch(currentLexemType) {
    case("day"):
    case("month"): {
      return 2;
    }
    case("year"): {
      return count;
    }
    default: {
      return 1;
    }
  }
}
function trimDatePart(lexem: IDateTimeMaskLexem, data: string): string {
  let result = data;
  if(lexem.count < lexem.maxCount && ((lexem.type === "day" && parseInt(data[0]) === 0) || (lexem.type === "month" && parseInt(data[0]) === 0))) {
    result = data.slice(1, data.length);
  }
  return result;
}

function getDefaultYearForValidation(minYear: number, maxYear: number): number {
  let defaultVal = 2000;
  if(defaultVal > maxYear) {
    defaultVal = parseInt(maxYear.toString().slice(0, maxYear.toString().length - 2)) * 100;
  }
  if(defaultVal < minYear) {
    const middle = (maxYear - minYear)/2 + minYear;
    defaultVal = parseInt(middle.toString().slice(0, middle.toString().length - 1)) * 10;
  }
  if(defaultVal >= minYear && defaultVal <= maxYear) {
    return defaultVal;
  }
  return minYear;
}

export function getDateTimeLexems(pattern: string): Array<IDateTimeMaskLexem> {
  const result: Array<IDateTimeMaskLexem> = [];
  let prevLexemType: string;

  const createOrUpdateLexem = (currentLexemType: "month" | "day" | "year" | "separator", currentChar: string) => {
    if(!!prevLexemType && prevLexemType === currentLexemType) {
      result[result.length - 1].count++;
      const maxCount = getMaxCountLexem(currentLexemType, result[result.length - 1].count);
      result[result.length - 1].maxCount = maxCount;
    } else {
      const maxCount = getMaxCountLexem(currentLexemType, 1);
      // result.push({ type: currentLexemType, value: currentChar, count: 1, data: { value: "", isCompleted: false, isCorrect: false }, maxCount: maxCount });
      result.push({ type: currentLexemType, value: currentChar, count: 1, maxCount: maxCount });
    }
  };

  for(let index = 0; index < pattern.length; index++) {
    const currentChar = pattern[index];
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

/**
 * A class that describes an input mask of the `"datetime"` [`maskType`](https://surveyjs.io/form-library/documentation/api-reference/text-entry-question-model#maskType).
 *
 * The following code shows how to specify the properties of this class within a survey JSON schema:
 *
 * ```
 * const surveyJson = {
 *   "elements": [{
 *     "name": "textquestion1"
 *     "type": "text",
 *     "maskType": "datetime",
 *     "maskSettings": {
 *       // Specify the properties of a date-time input mask here
 *     }
 *   }]
 * }
 * ```
 */
export class InputMaskDateTime extends InputMaskPattern {
  private turnOfTheCentury = 68;
  private lexems: Array<IDateTimeMaskLexem> = [];
  private inputDateTimeData: Array<IInputDateTimeData> = [];
  /**
   * A minimum date and time value that respondents can enter.
   * @see max
   */
  @property() min: string;
  /**
   * A maximum date and time value that respondents can enter.
   * @see min
   */
  @property() max: string;

  public getType(): string {
    return "datetimemask";
  }

  protected updateLiterals(): void {
    this.lexems = getDateTimeLexems(this.pattern || "");
  }

  private leaveOnlyNumbers(input: string): string {
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
    this.initInputDateTimeData();

    if(!isNaN(date as any)) {
      this.lexems.forEach((lexem, index) => {
        let inputData = this.inputDateTimeData[index];
        inputData.isCompleted = true;

        switch(lexem.type) {
          case("day"): {
            inputData.value = date.getDate().toString();
            break;
          }
          case("month"): {
            inputData.value = (date.getMonth() + 1).toString();
            break;
          }
          case("year"): {
            let year = date.getFullYear();
            if(lexem.count == 2) year = year % 100;
            inputData.value = year.toString();
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
  private initInputDateTimeData() {
    this.inputDateTimeData = [];
    this.lexems.forEach(lexem => {
      this.inputDateTimeData.push({ lexem: lexem, isCompleted: false, value: undefined });
    });
  }

  private getISO_8601Format(dateTime: IDateTimeComposition): string {
    if(dateTime.year === undefined || dateTime.month === undefined || dateTime.day === undefined) return "";

    const year = this.getPlaceholder(4, dateTime.year.toString(), "0") + dateTime.year;
    const month = this.getPlaceholder(2, dateTime.month.toString(), "0") + dateTime.month;
    const day = this.getPlaceholder(2, dateTime.day.toString(), "0") + dateTime.day;
    return [year, month, day].join("-");
  }

  private isYearValid(dateTime: IDateTimeComposition): boolean {
    if(dateTime.min === undefined && dateTime.max === undefined) return false;

    const data = dateTime.year.toString();
    const minYearPart = dateTime.min.toISOString().slice(0, data.length);
    const maxYearPart = dateTime.max.toISOString().slice(0, data.length);
    return dateTime.year >= parseInt(minYearPart) && dateTime.year <= parseInt(maxYearPart);
  }

  private isDateValid(dateTime: IDateTimeComposition): boolean {
    const min = dateTime.min;
    const max = dateTime.max;
    const year = dateTime.year !== undefined ? dateTime.year : getDefaultYearForValidation(min.getFullYear(), max.getFullYear());
    const month = dateTime.month !== undefined ? dateTime.month : 1;
    const day = dateTime.day !== undefined ? dateTime.day : 1;
    const date = new Date(this.getISO_8601Format({ year: year, month: month, day: day }));
    const monthIndex = month - 1;

    return !isNaN(date as any) &&
    date.getDate() === day &&
    date.getMonth() === monthIndex &&
    date.getFullYear() === year &&
    date >= dateTime.min && date <= dateTime.max;
  }

  private getPlaceholder(lexemLength: number, str: string, char: string) {
    const paddingsLength = lexemLength - (str || "").length;
    const paddings = paddingsLength > 0 ? char.repeat(paddingsLength) : "";
    return paddings;
  }

  private updateInputDateTimeData(newItem: IInputDateTimeData, dateTime: IDateTimeComposition): void {
    let data = newItem.value;
    if(!data) return;

    const propertyName = newItem.lexem.type;
    (dateTime as any)[propertyName] = parseInt(data);
    if(data.length === newItem.lexem.maxCount) {
      if(this.isDateValid(dateTime)) {
        newItem.isCompleted = true;
      } else {
        data = data.slice(0, data.length - 1);
      }
    } else if (propertyName === "year" && !this.isYearValid(dateTime)) {
      data = data.slice(0, data.length - 1);
    } else if((propertyName === "day" && parseInt(data[0]) > 3) || (propertyName === "month" && parseInt(data[0]) > 1)) {
      newItem.isCompleted = true;
    }
    newItem.value = data;
    (dateTime as any)[propertyName] = parseInt(data) > 0 ? parseInt(data) : undefined;
  }

  private getCorrectDatePartFormat(inputData: IInputDateTimeData, matchWholeMask: boolean): string {
    const lexem = inputData.lexem;
    let dataStr = inputData.value || "";
    if(!!dataStr && inputData.isCompleted) {
      dataStr = parseInt(dataStr).toString();
    }
    if(!!dataStr && inputData.isCompleted) {
      const zeroPaddings = this.getPlaceholder(lexem.count, dataStr, "0");
      dataStr = zeroPaddings + dataStr;
    } else {
      // !!!
      dataStr = trimDatePart(lexem, dataStr);
      if(matchWholeMask) {
        dataStr += this.getPlaceholder(lexem.count, dataStr, lexem.value);
      }
    }
    return dataStr;
  }

  private createIDateTimeComposition(): IDateTimeComposition {
    const tempDateTime: IDateTimeComposition = {
      day: undefined,
      month: undefined,
      year: undefined,
      min: new Date(this.min || "0001-01-01"),
      max: new Date(this.max || "9999-12-31")
    };
    return tempDateTime;
  }

  private parseTwoDigitYear (data: IInputDateTimeData): string {
    const inputData = data.value;
    if(data.lexem.type !== "year" || data.lexem.count > 2) return inputData;

    if(!!this.max && this.max.length >= 4) {
      this.turnOfTheCentury = parseInt(this.max.slice(2, 4));
    }

    const year = parseInt(inputData);
    const result = (year > this.turnOfTheCentury ? "19" : "20") + inputData;
    return result;
  }

  private getFormatedString(matchWholeMask: boolean): string {
    let result = "";
    let prevSeparator = "";
    let prevIsCompleted = false;

    for(let index = 0; index < this.inputDateTimeData.length; index++) {
      const inputData = this.inputDateTimeData[index];
      switch(inputData.lexem.type) {
        case "day":
        case "month":
        case "year":
          if(inputData.value === undefined && !matchWholeMask) {
            result += (prevIsCompleted ? prevSeparator : "");
            return result;
          } else {
            const data = this.getCorrectDatePartFormat(inputData, matchWholeMask);
            result += (prevSeparator + data);
            prevIsCompleted = inputData.isCompleted;
          }
          break;

        case "separator":
          prevSeparator = inputData.lexem.value;
          break;
      }
    }

    return result;
  }
  private setInputDateTimeData(numberParts: string[]): void {
    let numberPartsArrayIndex = 0;

    this.initInputDateTimeData();
    this.lexems.forEach((lexem, index) => {
      if(lexem.type !== "separator" && numberParts.length > 0 && numberPartsArrayIndex < numberParts.length) {
        const inputData: IInputDateTimeData = this.inputDateTimeData[index];
        const currentPart = numberParts[numberPartsArrayIndex];
        const _data = this.leaveOnlyNumbers(currentPart);
        inputData.value = _data.slice(0, lexem.maxCount);
        numberPartsArrayIndex++;
      }
    });
  }

  _getMaskedValue(src: string, matchWholeMask: boolean = true): string {
    let input = (src === undefined || src === null) ? "" : src.toString();
    const inputParts = this.getParts(input);
    this.setInputDateTimeData(inputParts);
    const tempDateTime = this.createIDateTimeComposition();
    this.inputDateTimeData.forEach(itemData => this.updateInputDateTimeData(itemData, tempDateTime));
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
    const lexemsWithValue = this.lexems.filter(l => l.type !== "separator");
    const separators = this.lexems.filter(l => l.type === "separator").map(s => s.value);
    let curPart = "";
    let foundSeparator = false;
    let foundPseudoSeparator = false;
    for(let i = 0; i < input.length; i++) {
      const inputChar = input[i];
      if(inputChar.match(numberDefinition) || inputChar === lexemsWithValue[inputParts.length].value) {
        foundSeparator = false;
        foundPseudoSeparator = false;
        curPart += inputChar;
      } else {
        if(separators.indexOf(inputChar) !== -1) {
          if(!foundPseudoSeparator) {
            foundSeparator = true;
            inputParts.push(curPart);
            curPart = "";
          }
        } else {
          if(!foundSeparator) {
            foundPseudoSeparator = true;
            inputParts.push(curPart);
            curPart = "";
          }
        }
      }
      if(inputParts.length >= lexemsWithValue.length) {
        foundSeparator = false;
        break;
      }
    }

    if(curPart != "" || foundSeparator) {
      inputParts.push(curPart);
    }
    return inputParts;
  }

  public getUnmaskedValue(src: string): any {
    let input = (src === undefined || src === null) ? "" : src.toString();
    const inputParts = this.getParts(input);
    this.setInputDateTimeData(inputParts);

    const tempDateTime = this.createIDateTimeComposition();
    this.inputDateTimeData.forEach(inputData => {
      let str = inputData.value;
      if(!str || str.length < inputData.lexem.count) return undefined;
      (tempDateTime as any)[inputData.lexem.type] = parseInt(this.parseTwoDigitYear(inputData));
    });

    return this.getISO_8601Format(tempDateTime);
  }

  public getMaskedValue(src: string) : string {
    return this.getMaskedStrFromISO(src);
  }

  public processInput(args: ITextInputParams): IMaskedInputResult {
    const result = { value: args.prevValue, caretPosition: args.selectionEnd, cancelPreventDefault: false };
    const leftPart = args.prevValue.slice(0, args.selectionStart);
    const rightPart = args.prevValue.slice(args.selectionEnd);

    result.value = this._getMaskedValue(leftPart + (args.insertedChars || "") + rightPart);
    if(!args.insertedChars && args.inputDirection === "backward") {
      result.caretPosition = args.selectionStart;
    } else {
      result.caretPosition = this._getMaskedValue(leftPart + (args.insertedChars || ""), false).length;
    }
    return result;
  }
}

Serializer.addClass(
  "datetimemask",
  [
    {
      name: "min",
      type: "datetime",
      enableIf: (obj: any) => {
        return !!obj.pattern;
      }
    },
    {
      name: "max",
      type: "datetime",
      enableIf: (obj: any) => {
        return !!obj.pattern;
      }
    }
  ],
  function () {
    return new InputMaskDateTime();
  },
  "patternmask"
);