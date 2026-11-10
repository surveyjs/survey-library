import { Base } from "../base";
import { EventBase } from "../event";
import { property } from "../decorators";
import { createDate } from "../helpers";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { CalendarItem, CalendarMonth, CalendarRangePosition, CalendarZoom, ICalendarOptions } from "./interfaces";
import { calendarCssClasses } from "./css-classes";
import { clampDate, isPeriodOutside, isSameDay, toDateOnly, toMonthStart } from "./date-utils";

// Localization is out of scope for now: the names are english.
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const daysInGrid = 42;
const yearsInRange = 12;
const nextZoom: { [zoom: string]: CalendarZoom } = { day: "month", month: "year", year: "day" };
const rangePositionCss: { [position: string]: string } = {
  start: calendarCssClasses.dayRangeStart,
  end: calendarCssClasses.dayRangeEnd,
  middle: calendarCssClasses.dayRangeMiddle,
  single: calendarCssClasses.dayRangeSingle
};

interface ICalendarItemState {
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isOutside?: boolean;
  rangePosition?: CalendarRangePosition;
}

export class CalendarModel extends Base {
  private hoveredItem: CalendarItem;

  @property() viewDate: Date;
  @property() min: Date;
  @property() max: Date;
  @property({ defaultValue: false }) range: boolean;
  @property() rangeStart: Date;
  @property({ defaultValue: "day" }) zoom: CalendarZoom;
  @property({ defaultValue: 1 }) firstDayOfWeek: number;
  @property() title: string;
  @property({ defaultValue: true }) canPrev: boolean;
  @property({ defaultValue: true }) canNext: boolean;
  @property() months: Array<CalendarMonth>;
  @property() items: Array<CalendarItem>;
  @property() weekDays: Array<string>;

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
    this.updateWeekDays();
    this.updateView();
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
    this.zoom = nextZoom[this.zoom];
  }
  public resetView(): void {
    this.hoveredItem = undefined;
    this.zoom = "day";
    this.viewDate = this.getDefaultViewDate();
    this.updateView();
  }
  public selectItem(item: CalendarItem): void {
    if (!item || item.isDisabled) return;
    if (this.zoom === "month") {
      this.viewDate = item.date;
      this.zoom = "day";
      return;
    }
    if (this.zoom === "year") {
      this.viewDate = new Date(item.date.getFullYear(), this.viewDate.getMonth(), 1);
      this.zoom = "month";
      return;
    }
    if (this.range) {
      this.selectRangeDay(item.date);
      return;
    }
    if (item.isOutside) {
      this.viewDate = item.date;
    }
    if (!isSameDay(this.value, item.date)) {
      this.value = item.date;
      this.onValueChanged.fire(this, { value: this.value });
    }
    this.onSelectionCompleted.fire(this, { value: this.value });
  }
  public hoverItem(item?: CalendarItem): void {
    if (!!item && item.isDisabled) return;
    this.hoveredItem = item;
    this.updateView();
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
      this.hoveredItem = undefined;
    }
    if (name === "range") {
      this.setPropertyValue("value", this.normalizeValue(this.value));
      this.rangeStart = undefined;
    }
    if (name === "zoom") {
      this.hoveredItem = undefined;
    }
    if (name === "firstDayOfWeek") {
      this.updateWeekDays();
    }
    if (["value", "viewDate", "min", "max", "range", "rangeStart", "zoom", "firstDayOfWeek"].indexOf(name) > -1) {
      this.updateView();
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
    this.hoveredItem = undefined;
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
  // The dates that are rendered as selected: the pending selection (rangeStart and the hovered
  // day) takes the place of the committed value while it lasts.
  private getSelectedRange(): Array<Date> {
    if (!this.range) return !!this.value ? [this.value, this.value] : undefined;
    if (!this.rangeStart) return this.value;
    const hovered = this.hoveredItem;
    if (!hovered || this.zoom !== "day") return [this.rangeStart, this.rangeStart];
    return this.normalizeValue([this.rangeStart, hovered.date]);
  }
  private getRangePosition(date: Date, range: Array<Date>): CalendarRangePosition {
    if (!this.range || !range) return undefined;
    const time = date.getTime();
    const start = range[0].getTime();
    const end = range[1].getTime();
    if (time < start || time > end) return undefined;
    if (start === end) return "single";
    if (time === start) return "start";
    if (time === end) return "end";
    return "middle";
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
  private getToday(): Date {
    return toDateOnly(createDate("calendar-today"));
  }
  private getDefaultViewDate(): Date {
    const value = this.range && !!this.value ? this.value[0] : this.value;
    return this.rangeStart || value || clampDate(this.getToday(), this.min, this.max);
  }
  private get monthCount(): number {
    return this.range && this.zoom === "day" ? 2 : 1;
  }
  private isOutside(start: Date, end: Date): boolean {
    return isPeriodOutside(start, end, this.min, this.max);
  }
  // The period that prev() / next() would bring into view.
  private isNeighbourPeriodOutside(direction: number): boolean {
    const year = this.viewDate.getFullYear();
    if (this.zoom === "month") {
      return this.isOutside(new Date(year + direction, 0, 1), new Date(year + direction, 11, 31));
    }
    if (this.zoom === "year") {
      const startYear = Math.floor(year / yearsInRange) * yearsInRange + direction * yearsInRange;
      return this.isOutside(new Date(startYear, 0, 1), new Date(startYear + yearsInRange - 1, 11, 31));
    }
    const month = this.viewDate.getMonth() + (direction > 0 ? this.monthCount : direction);
    return this.isOutside(new Date(year, month, 1), new Date(year, month + 1, 0));
  }
  private updateWeekDays(): void {
    const res: Array<string> = [];
    for (let i = 0; i < 7; i++) {
      res.push(weekDayNames[(this.firstDayOfWeek + i) % 7]);
    }
    this.weekDays = res;
  }
  private updateView(): void {
    if (!this.viewDate) return;
    const year = this.viewDate.getFullYear();
    const selectedRange = this.getSelectedRange();
    if (this.zoom === "month") {
      this.months = [];
      this.items = this.createMonthItems(year, selectedRange);
      this.title = year.toString();
    } else if (this.zoom === "year") {
      const startYear = Math.floor(year / yearsInRange) * yearsInRange;
      this.months = [];
      this.items = this.createYearItems(startYear, selectedRange);
      this.title = startYear + " \u2013 " + (startYear + yearsInRange - 1);
    } else {
      const months: Array<CalendarMonth> = [];
      for (let i = 0; i < this.monthCount; i++) {
        months.push(this.createMonth(new Date(year, this.viewDate.getMonth() + i, 1), selectedRange));
      }
      this.months = months;
      this.items = [];
      this.title = months[0].title;
    }
    this.canPrev = !this.isNeighbourPeriodOutside(-1);
    this.canNext = !this.isNeighbourPeriodOutside(1);
  }
  private createMonth(monthStart: Date, selectedRange: Array<Date>): CalendarMonth {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const offset = (monthStart.getDay() - this.firstDayOfWeek + 7) % 7;
    const today = this.getToday();
    const days: Array<CalendarItem> = [];
    for (let i = 0; i < daysInGrid; i++) {
      const date = new Date(year, month, 1 - offset + i);
      const rangePosition = this.getRangePosition(date, selectedRange);
      days.push(this.createItem("day", date, date.getDate().toString(), {
        isSelected: this.range ? !!rangePosition : isSameDay(this.value, date),
        isToday: isSameDay(today, date),
        isDisabled: this.isOutside(date, date),
        isOutside: date.getMonth() !== month,
        rangePosition: rangePosition
      }));
    }
    return { date: monthStart, title: monthNames[month] + " " + year, days: days };
  }
  private isPeriodSelected(start: Date, end: Date, selectedRange: Array<Date>): boolean {
    return !!selectedRange && !isPeriodOutside(start, end, selectedRange[0], selectedRange[1]);
  }
  private createMonthItems(year: number, selectedRange: Array<Date>): Array<CalendarItem> {
    const today = this.getToday();
    return monthNames.map((name, month) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      return this.createItem("month", start, name, {
        isSelected: this.isPeriodSelected(start, end, selectedRange),
        isToday: !isPeriodOutside(start, end, today, today),
        isDisabled: this.isOutside(start, end)
      });
    });
  }
  private createYearItems(startYear: number, selectedRange: Array<Date>): Array<CalendarItem> {
    const today = this.getToday();
    const res: Array<CalendarItem> = [];
    for (let year = startYear; year < startYear + yearsInRange; year++) {
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      res.push(this.createItem("year", start, year.toString(), {
        isSelected: this.isPeriodSelected(start, end, selectedRange),
        isToday: !isPeriodOutside(start, end, today, today),
        isDisabled: this.isOutside(start, end)
      }));
    }
    return res;
  }
  private createItem(kind: CalendarZoom, date: Date, text: string, state: ICalendarItemState): CalendarItem {
    const isOutside = !!state.isOutside;
    const hovered = this.hoveredItem;
    const item: CalendarItem = {
      date: date,
      text: text,
      isSelected: state.isSelected,
      isHovered: !state.isDisabled && !!hovered && isSameDay(hovered.date, date) && hovered.isOutside === isOutside,
      isToday: state.isToday,
      isOutside: isOutside,
      isDisabled: state.isDisabled,
      rangePosition: state.rangePosition,
      css: ""
    };
    item.css = this.getItemCss(kind, item);
    return item;
  }
  private getItemCss(kind: CalendarZoom, item: CalendarItem): string {
    const classes: { [key: string]: string } = calendarCssClasses;
    return new CssClassBuilder()
      .append(classes[kind])
      .append(classes[kind + "Outside"], item.isOutside)
      .append(classes[kind + "Today"], item.isToday)
      .append(classes[kind + "Selected"], item.isSelected)
      .append(classes[kind + "Hovered"], item.isHovered)
      .append(classes[kind + "Disabled"], item.isDisabled)
      .append(rangePositionCss[item.rangePosition], !!item.rangePosition)
      .toString();
  }
}
