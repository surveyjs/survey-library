import { Serializer, property } from "../jsonobject";
import { InputMaskPattern } from "./mask_pattern";
import { IMaskedInputResult, ITextInputParams, numberDefinition } from "./mask_utils";

type DateTimeMaskLexemType = "month" | "day" | "year" | "hour" | "minute" | "second" | "timeMarker" | "separator"
export interface IDateTimeMaskLexem {
  type: DateTimeMaskLexemType;
  value: any;
  count: number;
  maxCount: number;
  upperCase: boolean;
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
  timeMarker?: string;
  min?: Date;
  max?: Date;
}

function getMaxCountLexem(currentLexemType: string, count: number): number {
  switch(currentLexemType) {
    case "hour":
    case "minute":
    case "second":
    case "day":
    case "month": {
      return 2;
    }
    case "timeMarker":
    case "year": {
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

export function getDateTimeLexems(pattern: string): Array<IDateTimeMaskLexem> {
  const result: Array<IDateTimeMaskLexem> = [];
  let prevLexemType: string;

  const createOrUpdateLexem = (currentLexemType: DateTimeMaskLexemType, currentChar: string, upperCase: boolean = false) => {
    if(!!prevLexemType && prevLexemType === currentLexemType) {
      result[result.length - 1].count++;
      const maxCount = getMaxCountLexem(currentLexemType, result[result.length - 1].count);
      result[result.length - 1].maxCount = maxCount;
    } else {
      const maxCount = getMaxCountLexem(currentLexemType, 1);
      // result.push({ type: currentLexemType, value: currentChar, count: 1, data: { value: "", isCompleted: false, isCorrect: false }, maxCount: maxCount });
      result.push({ type: currentLexemType, value: currentChar, count: 1, maxCount: maxCount, upperCase: upperCase });
    }
  };

  for(let index = 0; index < pattern.length; index++) {
    const currentChar = pattern[index];
    switch (currentChar) {
      case "m":
        createOrUpdateLexem("month", currentChar);
        break;
      case "d":
        createOrUpdateLexem("day", currentChar);
        break;
      case "y":
        createOrUpdateLexem("year", currentChar);
        break;
      case "h":
        createOrUpdateLexem("hour", currentChar, false);
        break;
      case "H":
        createOrUpdateLexem("hour", currentChar, true);
        break;
      case "M":
        createOrUpdateLexem("minute", currentChar);
        break;
      case "s":
        createOrUpdateLexem("second", currentChar);
        break;
      case "t":
        createOrUpdateLexem("timeMarker", currentChar);
        break;
      case "T":
        createOrUpdateLexem("timeMarker", currentChar, true);
        break;
      default:
        result.push({ type: "separator", value: currentChar, count: 1, maxCount: 1, upperCase: false });
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
 * ```js
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
 *
 * [View Demo](https://surveyjs.io/form-library/examples/masked-input-fields/ (linkStyle))
 */
export class InputMaskDateTime extends InputMaskPattern {
  private defaultDate = "1970-01-01T";
  private turnOfTheCentury = 68;
  private twelve = 12;
  private lexems: Array<IDateTimeMaskLexem> = [];
  private inputDateTimeData: Array<IInputDateTimeData> = [];
  private validBeginningOfNumbers: { [key: string]: any } = {
    hour: 1,
    hourU: 2,
    minute: 5,
    second: 5,
    day: 3,
    month: 1,
  };
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

  public get hasDatePart(): boolean {
    return this.lexems.some(l => l.type === "day" || l.type === "month" || l.type === "year");
  }
  public get hasTimePart(): boolean {
    return this.lexems.some(l => l.type === "hour" || l.type === "minute" || l.type === "second");
  }
  private get is12Hours(): boolean {
    return this.lexems.filter(l => l.type === "hour" && !l.upperCase).length > 0;
  }

  public getType(): string {
    return "datetimemask";
  }

  public getTypeForExpressions(): string {
    return this.hasTimePart ? "datetime-local" : "datetime";
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
    let date = new Date(str);
    this.initInputDateTimeData();
    if (!this.hasTimePart) {
      date = new Date(str + "T00:00:00");
    }
    if(!this.hasDatePart) {
      date = new Date(this.defaultDate + str);
    }

    if(!isNaN(date as any)) {
      this.lexems.forEach((lexem, index) => {
        let inputData = this.inputDateTimeData[index];
        inputData.isCompleted = true;

        switch(lexem.type) {
          case "hour": {
            if (!this.is12Hours) {
              inputData.value = date.getHours().toString();
            } else {
              inputData.value = ((date.getHours() - 1) % this.twelve + 1).toString();
            }
            break;
          }
          case "minute": {
            inputData.value = date.getMinutes().toString();
            break;
          }
          case "second": {
            inputData.value = date.getSeconds().toString();
            break;
          }
          case "timeMarker": {
            const marker = (date.getHours() >= this.twelve) ? "pm" : "am";
            inputData.value = lexem.upperCase ? marker.toUpperCase() : marker;
            break;
          }
          case "day": {
            inputData.value = date.getDate().toString();
            break;
          }
          case "month": {
            inputData.value = (date.getMonth() + 1).toString();
            break;
          }
          case "year": {
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

  public getISO_8601Format(dateTime: IDateTimeComposition): string {
    const date: Array<string> = [];
    const time: Array<string> = [];

    if (dateTime.year !== undefined) {
      const year = this.getPlaceholder(4, dateTime.year.toString(), "0") + dateTime.year;
      date.push(year);
    }
    if (dateTime.month !== undefined && dateTime.year !== undefined) {
      const month = this.getPlaceholder(2, dateTime.month.toString(), "0") + dateTime.month;
      date.push(month);
    }
    if (dateTime.day !== undefined && dateTime.month !== undefined && dateTime.year !== undefined) {
      const day = this.getPlaceholder(2, dateTime.day.toString(), "0") + dateTime.day;
      date.push(day);
    }

    if (dateTime.hour !== undefined) {
      const hour = this.getPlaceholder(2, dateTime.hour.toString(), "0") + dateTime.hour;
      time.push(hour);
    }
    if (dateTime.minute !== undefined && dateTime.hour !== undefined) {
      const minute = this.getPlaceholder(2, dateTime.minute.toString(), "0") + dateTime.minute;
      time.push(minute);
    }
    if (dateTime.second !== undefined && dateTime.minute !== undefined && dateTime.hour !== undefined) {
      const second = this.getPlaceholder(2, dateTime.second.toString(), "0") + dateTime.second;
      time.push(second);
    }

    const result: Array<string> = [];
    if(date.length > 0) {
      result.push(date.join("-"));
    }
    if (time.length > 1) {
      result.push(time.join(":"));
    }
    return result.join("T");
  }

  private isYearValid(dateTime: IDateTimeComposition): boolean {
    if(dateTime.min === undefined && dateTime.max === undefined) return false;

    const data = dateTime.year.toString();
    const minYearPart = dateTime.min.toISOString().slice(0, data.length);
    const maxYearPart = dateTime.max.toISOString().slice(0, data.length);
    return dateTime.year >= parseInt(minYearPart) && dateTime.year <= parseInt(maxYearPart);
  }

  private createIDateTimeCompositionWithDefaults(dateTime: IDateTimeComposition, isUpperLimit: boolean): IDateTimeComposition {
    const checkOnlyLeapYears = dateTime.day == 29 && dateTime.month == 2;
    let minYear = dateTime.min.getFullYear();
    let maxYear = dateTime.max.getFullYear();
    if (checkOnlyLeapYears) {
      minYear = Math.ceil(minYear / 4) * 4;
      maxYear = Math.floor(minYear / 4) * 4;
      if (minYear > maxYear) {
        minYear = undefined;
        maxYear = undefined;
      }
    }
    const year = dateTime.year !== undefined ? dateTime.year : isUpperLimit ? maxYear : minYear;
    const month = dateTime.month !== undefined ? dateTime.month : (isUpperLimit && this.hasDatePart ? 12 : 1);
    const day = dateTime.day !== undefined ? dateTime.day : (isUpperLimit && this.hasDatePart ? this.getMaxDateForMonth(year, month) : 1);
    const hour = dateTime.hour !== undefined ? dateTime.hour : (isUpperLimit ? 23 : 0);
    const minute = dateTime.minute !== undefined ? dateTime.minute : (isUpperLimit ? 59 : 0);
    const second = dateTime.second !== undefined ? dateTime.second : (isUpperLimit ? 59 : 0);

    return { year: year, month: month, day: day, hour: hour, minute: minute, second: second };
  }

  private getMaxDateForMonth(year: number, month: number) {
    if (month == 2) return year % 4 == 0 && year % 100 != 0 || year % 400 ? 29 : 28;
    return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  }

  private isDateValid(dateTime: IDateTimeComposition): boolean {
    const date = new Date(this.getISO_8601Format(this.createIDateTimeCompositionWithDefaults(dateTime, false)));
    const dateH = new Date(this.getISO_8601Format(this.createIDateTimeCompositionWithDefaults(dateTime, true)));

    return !isNaN(date as any) &&
      (date.getDate() === dateTime.day || dateTime.day === undefined) &&
      (date.getMonth() === dateTime.month - 1 || dateTime.month === undefined) &&
      (date.getFullYear() === dateTime.year || dateTime.year === undefined) &&
    dateH >= dateTime.min && date <= dateTime.max;
  }

  private getPlaceholder(lexemLength: number, str: string, char: string) {
    const paddingsLength = lexemLength - (str || "").length;
    const paddings = paddingsLength > 0 ? char.repeat(paddingsLength) : "";
    return paddings;
  }

  private isDateValid12(dateTime12: IDateTimeComposition) {
    if(!this.is12Hours) return this.isDateValid(dateTime12);

    if(this.is12Hours && dateTime12.hour > this.twelve) {
      return false;
    }

    if(!dateTime12.timeMarker) {
      if(this.isDateValid(dateTime12)) return true;
      dateTime12.hour += this.twelve;
      return this.isDateValid(dateTime12);
    } else if(dateTime12.timeMarker[0].toLowerCase() === "p") {
      if(dateTime12.hour !== this.twelve) {
        dateTime12.hour += this.twelve;
      }
      return this.isDateValid(dateTime12);
    } else {
      if(dateTime12.hour === this.twelve) {
        dateTime12.hour = 0;
      }
      return this.isDateValid(dateTime12);
    }
  }

  private updateTimeMarkerInputDateTimeData(newItem: IInputDateTimeData, dateTime: IDateTimeComposition): void {
    let data = newItem.value;
    if(!data) return;

    const propertyName = "timeMarker";
    const tempDateTime = { ...dateTime };

    (tempDateTime as any)[propertyName] = data;
    if(this.isDateValid12(tempDateTime)) {
      newItem.isCompleted = true;
    } else {
      data = data.slice(0, data.length - 1);
    }
    newItem.value = data || undefined;
    (dateTime as any)[propertyName] = data || undefined;
    return;
  }

  private updateInputDateTimeData(newItem: IInputDateTimeData, dateTime: IDateTimeComposition): void {
    let data = newItem.value;
    if(!data) return;

    const propertyName = newItem.lexem.type;
    const tempDateTime = { ...dateTime };
    (tempDateTime as any)[propertyName] = parseInt(this.parseTwoDigitYear(newItem));
    if(data.length === newItem.lexem.maxCount) {
      if(this.isDateValid12(tempDateTime)) {
        newItem.isCompleted = true;
        newItem.value = data || undefined;
        (dateTime as any)[propertyName] = parseInt(data) > 0 ? parseInt(data) : undefined;
        return;
      } else {
        data = data.slice(0, data.length - 1);
      }
    }

    (tempDateTime as any)[propertyName] = parseInt(data);
    const firstDigit = parseInt(data[0]);
    const validBeginningOfNumber = this.validBeginningOfNumbers[propertyName + (newItem.lexem.upperCase ? "U" : "")];
    if ((propertyName === "year" && !this.isYearValid(tempDateTime))) {
      data = data.slice(0, data.length - 1);
      newItem.isCompleted = false;
    } else if(validBeginningOfNumber !== undefined && firstDigit > validBeginningOfNumber) {
      if(this.isDateValid12(tempDateTime)) {
        newItem.isCompleted = true;
      } else {
        data = data.slice(0, data.length - 1);
      }
    } else if(validBeginningOfNumber !== undefined && firstDigit !== 0 && firstDigit <= validBeginningOfNumber) {
      this.checkValidationDateTimePart(tempDateTime, propertyName, newItem);
      if(newItem.isCompleted && !this.isDateValid12(tempDateTime)) {
        data = data.slice(0, data.length - 1);
      }
    }
    newItem.value = data || undefined;
    (dateTime as any)[propertyName] = parseInt(data) > 0 ? parseInt(data) : undefined;
  }

  private checkValidationDateTimePart(dateTime: IDateTimeComposition, propertyName: string, newItem: IInputDateTimeData) {
    const prevValue = (dateTime as any)[propertyName];
    let tempValue = prevValue * 10;
    let maxValue = 10;
    if (propertyName === "month") maxValue = 3;
    if (propertyName === "hour") maxValue = this.is12Hours ? 3 : 5;

    newItem.isCompleted = true;

    for (let index = 0; index < maxValue; index++) {
      (dateTime as any)[propertyName] = tempValue + index;
      if (this.isDateValid12(dateTime)) {
        newItem.isCompleted = false;
        break;
      }
    }
    (dateTime as any)[propertyName] = prevValue;
  }

  private getCorrectDatePartFormat(inputData: IInputDateTimeData, matchWholeMask: boolean): string {
    const lexem = inputData.lexem;
    let dataStr = inputData.value || "";

    if(!!dataStr && lexem.type === "timeMarker") {
      if(matchWholeMask) {
        dataStr = dataStr + this.getPlaceholder(lexem.count, dataStr, lexem.value);
      }
      return dataStr;
    }

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
    let isoMin: string, isoMax: string;

    if(this.hasDatePart) {
      isoMin = this.min || "0001-01-01";
      isoMax = this.max || "9999-12-31";
    } else {
      isoMin = this.defaultDate + (this.min || "00:00:00");
      isoMax = this.defaultDate + (this.max || "23:59:59");

    }

    const tempDateTime: IDateTimeComposition = {
      hour: undefined,
      minute: undefined,
      second: undefined,
      day: undefined,
      month: undefined,
      year: undefined,
      min: new Date(isoMin),
      max: new Date(isoMax)
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
    let lastItemWithDataIndex = this.inputDateTimeData.length - 1;
    if(!matchWholeMask) {
      const arr = this.inputDateTimeData.filter(item => !!item.value);
      lastItemWithDataIndex = this.inputDateTimeData.indexOf(arr[arr.length - 1]);
    }

    for(let index = 0; index < this.inputDateTimeData.length; index++) {
      const inputData = this.inputDateTimeData[index];
      switch(inputData.lexem.type) {
        case "timeMarker":
        case "hour":
        case "minute":
        case "second":
        case "day":
        case "month":
        case "year":
          if(inputData.value === undefined && !matchWholeMask) {
            result += (prevIsCompleted ? prevSeparator : "");
            return result;
          } else {
            const _matchWholeMask = matchWholeMask || lastItemWithDataIndex > index;
            const data = this.getCorrectDatePartFormat(inputData, _matchWholeMask);
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

  private cleanTimeMarker(str: string, upperCase: boolean) {
    let result = "";
    str = str.toUpperCase();
    for (let i = 0; i < str.length; i++) {
      if (!result && (str[i] == "P" || str[i] == "A") || result && str[i] == "M") result += str[i];
    }
    if (upperCase) {
      result = result.toUpperCase();
    } else {
      result = result.toLowerCase();
    }
    return result;
  }
  private setInputDateTimeData(numberParts: string[]): void {
    let numberPartsArrayIndex = 0;

    this.initInputDateTimeData();
    this.lexems.forEach((lexem, index) => {
      if (numberParts.length > 0 && numberPartsArrayIndex < numberParts.length) {
        if (lexem.type === "separator") return;
        const inputData: IInputDateTimeData = this.inputDateTimeData[index];
        const currentPart = numberParts[numberPartsArrayIndex];
        let _data;
        if (lexem.type === "timeMarker") {
          _data = this.cleanTimeMarker(currentPart, lexem.upperCase);
        } else {
          _data = this.leaveOnlyNumbers(currentPart);
        }
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
    this.inputDateTimeData.forEach(itemData => {
      if(itemData.lexem.type === "timeMarker") {
        this.updateTimeMarkerInputDateTimeData(itemData, tempDateTime);
      } else {
        this.updateInputDateTimeData(itemData, tempDateTime);
      }
    });
    const result = this.getFormatedString(matchWholeMask);
    return result;
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
      } else if (lexemsWithValue[inputParts.length].type === "timeMarker") {
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

    const timeMarker = this.inputDateTimeData.filter(idtd => idtd.lexem.type === "timeMarker")[0]?.value.toLowerCase()[0];

    const tempDateTime = this.createIDateTimeComposition();
    let uncompleted = false;
    this.inputDateTimeData.forEach(inputData => {
      let str = inputData.value;
      if (inputData.lexem.type == "timeMarker" || inputData.lexem.type == "separator") return;
      if (!str || str.length < inputData.lexem.count) {
        uncompleted = true;
        return;
      }
      let value = parseInt(this.parseTwoDigitYear(inputData));
      if (inputData.lexem.type == "hour" && timeMarker === "p" && value != this.twelve) value += this.twelve;
      (tempDateTime as any)[inputData.lexem.type] = value;
    });

    return uncompleted ? "" : this.getISO_8601Format(tempDateTime);
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