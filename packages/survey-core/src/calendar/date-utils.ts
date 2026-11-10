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
export function clampDate(date: Date, min: Date, max: Date): Date {
  if (!!min && date.getTime() < min.getTime()) return min;
  if (!!max && date.getTime() > max.getTime()) return max;
  return date;
}
