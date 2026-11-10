export function toDateOnly(date: Date): Date {
  return !!date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : undefined;
}
export function toMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
export function isSameDay(a: Date, b: Date): boolean {
  return !!a && !!b && a.getTime() === b.getTime();
}
