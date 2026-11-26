import { createDate } from "../helpers";
import { getLocaleDataValue } from "../locale-data";

export function toDateOnly(date: Date): Date {
  return !!date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : undefined;
}
export function getToday(): Date {
  return toDateOnly(createDate("calendar-today"));
}
export function toMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
export function shiftMonth(date: Date, count: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}
export function isSameDay(a: Date, b: Date): boolean {
  return !!a && !!b && a.getTime() === b.getTime();
}
export function isPeriodOutside(start: Date, end: Date, min: Date, max: Date): boolean {
  return (!!min && end.getTime() < min.getTime()) || (!!max && start.getTime() > max.getTime());
}
// Parses "yyyy-mm-dd" as a local date; returns undefined for any other string or a nonexistent date.
export function parseISODate(val: any): Date {
  if (typeof val !== "string") return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  date.setFullYear(year);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return undefined;
  return date;
}
// Same numbering as Date.getDay(): 0 is Sunday. Resolved from the locale table, like datePattern.
// An empty locale is the mask default, English.
export function getFirstDayOfWeek(locale: string): number {
  const first = getLocaleDataValue(locale, "firstDayOfWeek");
  return typeof first === "number" && first >= 0 && first <= 6 ? first : 1;
}
export function clampDate(date: Date, min: Date, max: Date): Date {
  if (!!min && date.getTime() < min.getTime()) return min;
  if (!!max && date.getTime() > max.getTime()) return max;
  return date;
}
