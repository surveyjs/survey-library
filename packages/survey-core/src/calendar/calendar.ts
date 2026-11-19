import { Base } from "../base";
import { EventBase } from "../event";
import { property } from "../decorators";
import { CalendarZoom, ICalendarOptions } from "./interfaces";
import { clampDate, getToday, isPeriodOutside, isSameDay, toDateOnly, toMonthStart } from "./date-utils";

export const yearsInRange = 12;
const nextZoom: { [zoom: string]: CalendarZoom } = { day: "month", month: "year", year: "day" };

// The calendar state and its rules: value, range selection, limits, navigation and zoom.
// Everything that is only about rendering lives in CalendarViewModel.
export class CalendarModel extends Base {
  @property() viewDate: Date;
  @property() min: Date;
  @property() max: Date;
  @property({ defaultValue: false }) range: boolean;
  @property() rangeStart: Date;
  @property({ defaultValue: 1 }) firstDayOfWeek: number;

  public onValueChanged: EventBase<CalendarModel, { value: any }> = this.addEvent<CalendarModel, { value: any }>();
  public onSelectionCompleted: EventBase<CalendarModel, { value: any }> = this.addEvent<CalendarModel, { value: any }>();
  public onRangeStartSelected: EventBase<CalendarModel, { date: Date }> = this.addEvent<CalendarModel, { date: Date }>();
  public onZoomChanged: EventBase<CalendarModel, { zoom: CalendarZoom }> = this.addEvent<CalendarModel, { zoom: CalendarZoom }>();

  constructor(options: ICalendarOptions = {}) {
    super();
    this.min = options.min;
    this.max = options.max;
    this.range = !!options.range;
    this.value = options.value;
    this.viewDate = options.viewDate || this.getDefaultViewDate();
  }
  public getType(): string {
    return "calendar";
  }
  // A Date, or an array of two dates [start, end] if range is true. The value is always a new
  // object, so an array passed in or handed out is never changed by the calendar.
  public get value(): any {
    return this.getPropertyValue("value");
  }
  public set value(val: any) {
    this.setPropertyValue("value", this.normalizeValue(val));
  }
  // The range mode shows days only.
  public get zoom(): CalendarZoom {
    return this.getPropertyValue("zoom", "day");
  }
  public set zoom(val: CalendarZoom) {
    if (!this.canZoom && val !== "day") return;
    this.setPropertyValue("zoom", val);
  }
  public get isDayZoom(): boolean {
    return this.zoom === "day";
  }
  public get canZoom(): boolean {
    return !this.range;
  }
  // The days of a range are picked from two months at once.
  public get monthCount(): number {
    return this.range && this.isDayZoom ? 2 : 1;
  }
  public get canPrev(): boolean {
    return !this.isNeighbourPeriodOutside(-1);
  }
  public get canNext(): boolean {
    return !this.isNeighbourPeriodOutside(1);
  }
  public setRangeStart(date: Date): void {
    this.rangeStart = date;
  }
  public prev(): void {
    if (!this.canPrev) return;
    this.shiftView(-1);
  }
  public next(): void {
    if (!this.canNext) return;
    this.shiftView(1);
  }
  public zoomOut(): void {
    if (!this.canZoom) return;
    this.zoom = nextZoom[this.zoom];
  }
  public resetView(): void {
    this.zoom = "day";
    this.viewDate = this.getDefaultViewDate();
  }
  // A month or a year zooms in; a day is selected.
  public selectDate(date: Date): void {
    if (!date) return;
    if (this.zoom === "month") {
      this.viewDate = date;
      this.zoom = "day";
      return;
    }
    if (this.zoom === "year") {
      this.viewDate = new Date(date.getFullYear(), this.viewDate.getMonth(), 1);
      this.zoom = "month";
      return;
    }
    if (this.range) {
      this.selectRangeDay(date);
      return;
    }
    if (date.getMonth() !== this.viewDate.getMonth() || date.getFullYear() !== this.viewDate.getFullYear()) {
      this.viewDate = date;
    }
    if (!isSameDay(this.value, date)) {
      this.value = date;
      this.onValueChanged.fire(this, { value: this.value });
    }
    this.onSelectionCompleted.fire(this, { value: this.value });
  }
  public isPeriodDisabled(start: Date, end: Date): boolean {
    return isPeriodOutside(start, end, this.min, this.max);
  }
  // The dates that are shown as selected: while a range is being picked, the range start and
  // the previewed day take the place of the committed value.
  public getSelectedRange(previewDate?: Date): Array<Date> {
    if (!this.range) return !!this.value ? [this.value, this.value] : undefined;
    if (!this.rangeStart) return this.clipRange(this.value);
    if (!previewDate || !this.isDayZoom) return [this.rangeStart, this.rangeStart];
    return this.clipRange(this.normalizeValue([this.rangeStart, previewDate]));
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (["min", "max", "rangeStart"].indexOf(name) > -1 && !!newValue) {
      const date = toDateOnly(newValue);
      if (!isSameDay(date, newValue)) {
        this.setPropertyValue(name, date);
        return;
      }
    }
    if (name === "viewDate") {
      const monthStart = toMonthStart(newValue);
      if (!isSameDay(monthStart, newValue)) {
        this.viewDate = monthStart;
        return;
      }
    }
    if (name === "range") {
      this.setPropertyValue("value", this.normalizeValue(this.value));
      this.rangeStart = undefined;
      if (!this.canZoom) {
        this.zoom = "day";
      }
    }
    if (name === "zoom") {
      this.onZoomChanged.fire(this, { zoom: newValue });
    }
  }
  private normalizeValue(val: any): any {
    if (!val) return undefined;
    if (!this.range) return toDateOnly(Array.isArray(val) ? val[0] : val);
    const dates = Array.isArray(val) ? val : [val, val];
    if (!dates[0] || !dates[1]) return undefined;
    const start = toDateOnly(dates[0]);
    const end = toDateOnly(dates[1]);
    return start.getTime() > end.getTime() ? [end, start] : [start, end];
  }
  private selectRangeDay(date: Date): void {
    if (!this.rangeStart) {
      this.rangeStart = date;
      this.onRangeStartSelected.fire(this, { date: this.rangeStart });
      return;
    }
    const value = this.normalizeValue([this.rangeStart, date]);
    const isChanged = !this.isSameRange(this.value, value);
    this.rangeStart = undefined;
    this.value = value;
    if (isChanged) {
      this.onValueChanged.fire(this, { value: this.value });
    }
    this.onSelectionCompleted.fire(this, { value: this.value });
  }
  private isSameRange(a: Array<Date>, b: Array<Date>): boolean {
    return !!a && !!b && isSameDay(a[0], b[0]) && isSameDay(a[1], b[1]);
  }
  // Disabled dates are never a part of the range, so its boundaries move inside [min, max].
  private clipRange(range: Array<Date>): Array<Date> {
    if (!range) return undefined;
    const start = !!this.min && range[0].getTime() < this.min.getTime() ? this.min : range[0];
    const end = !!this.max && range[1].getTime() > this.max.getTime() ? this.max : range[1];
    return start.getTime() > end.getTime() ? undefined : [start, end];
  }
  private shiftView(direction: number): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    if (this.zoom === "month") {
      this.viewDate = new Date(year + direction, month, 1);
    } else if (this.zoom === "year") {
      this.viewDate = new Date(year + direction * yearsInRange, month, 1);
    } else {
      this.viewDate = new Date(year, month + direction, 1);
    }
  }
  private getDefaultViewDate(): Date {
    const value = this.range && !!this.value ? this.value[0] : this.value;
    return this.rangeStart || value || clampDate(getToday(), this.min, this.max);
  }
  // The period that prev() / next() would bring into view.
  private isNeighbourPeriodOutside(direction: number): boolean {
    if (!this.viewDate) return true;
    const year = this.viewDate.getFullYear();
    if (this.zoom === "month") {
      return this.isPeriodDisabled(new Date(year + direction, 0, 1), new Date(year + direction, 11, 31));
    }
    if (this.zoom === "year") {
      const startYear = Math.floor(year / yearsInRange) * yearsInRange + direction * yearsInRange;
      return this.isPeriodDisabled(new Date(startYear, 0, 1), new Date(startYear + yearsInRange - 1, 11, 31));
    }
    const month = this.viewDate.getMonth() + (direction > 0 ? this.monthCount : direction);
    return this.isPeriodDisabled(new Date(year, month, 1), new Date(year, month + 1, 0));
  }
}
