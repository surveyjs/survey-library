import { getLocaleString } from "../surveyStrings";

const monthNameKeys = [
  "calendarJanuary", "calendarFebruary", "calendarMarch", "calendarApril",
  "calendarMay", "calendarJune", "calendarJuly", "calendarAugust",
  "calendarSeptember", "calendarOctober", "calendarNovember", "calendarDecember"
];
const weekdayShortKeys = [
  "calendarSundayShort", "calendarMondayShort", "calendarTuesdayShort", "calendarWednesdayShort",
  "calendarThursdayShort", "calendarFridayShort", "calendarSaturdayShort"
];

export function getCalendarMonthNames(locale?: string): Array<string> {
  return monthNameKeys.map(key => getLocaleString(key, locale));
}
export function getCalendarWeekdayShortNames(locale?: string): Array<string> {
  return weekdayShortKeys.map(key => getLocaleString(key, locale));
}
