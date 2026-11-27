import type { CalendarItem } from "./calendar-item";

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
