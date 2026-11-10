export interface CalendarItem {
  date: Date;
  text: string;
  isSelected: boolean;
  isHovered: boolean;
  isToday: boolean;
  isOutside: boolean;
  isDisabled: boolean;
  css: string;
}

export interface CalendarMonth {
  date: Date;
  title: string;
  days: Array<CalendarItem>;
}

export interface ICalendarOptions {
  value?: Date;
  viewDate?: Date;
}
