export function toDateOnly(date: Date): Date {
  return !!date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : undefined;
}
export function toMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
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
export function clampDate(date: Date, min: Date, max: Date): Date {
  if (!!min && date.getTime() < min.getTime()) return min;
  if (!!max && date.getTime() > max.getTime()) return max;
  return date;
}
