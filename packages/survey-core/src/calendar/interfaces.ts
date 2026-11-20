export type CalendarZoom = "day" | "month" | "year";
export type CalendarRangePosition = "start" | "end" | "middle" | "single";

export interface CalendarItem {
  date: Date;
  text: string;
  isSelected: boolean;
  // the day is between the range start and end (inclusive), committed or being selected
  isInRange: boolean;
  isHovered: boolean;
  isToday: boolean;
  isOutside: boolean;
  isHidden: boolean;
  isDisabled: boolean;
  rangePosition?: CalendarRangePosition;
  css: string;
}

export interface CalendarMonth {
  date: Date;
  title: string;
  days: Array<CalendarItem>;
}

export interface ICalendarOptions {
  // a Date, or an array of two dates [start, end] if range is true
  value?: Date | Array<Date>;
  viewDate?: Date;
  min?: Date;
  max?: Date;
  range?: boolean;
}
