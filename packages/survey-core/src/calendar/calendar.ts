import { Base } from "../base";
import { EventBase } from "../event";
import { property } from "../decorators";
import { createDate } from "../helpers";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { CalendarItem, CalendarMonth, CalendarZoom, ICalendarOptions } from "./interfaces";
import { calendarCssClasses } from "./css-classes";
import { clampDate, isPeriodOutside, isSameDay, toDateOnly, toMonthStart } from "./date-utils";

// Localization is out of scope for now: the names are english.
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const daysInGrid = 42;
const yearsInRange = 12;
const nextZoom: { [zoom: string]: CalendarZoom } = { day: "month", month: "year", year: "day" };

interface ICalendarItemState {
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isOutside?: boolean;
}

export class CalendarModel extends Base {
  private hoveredItem: CalendarItem;

  @property() value: Date;
  @property() viewDate: Date;
  @property() min: Date;
  @property() max: Date;
  @property({ defaultValue: "day" }) zoom: CalendarZoom;
  @property({ defaultValue: 1 }) firstDayOfWeek: number;
  @property() title: string;
  @property({ defaultValue: true }) canPrev: boolean;
  @property({ defaultValue: true }) canNext: boolean;
  @property() months: Array<CalendarMonth>;
  @property() items: Array<CalendarItem>;
  @property() weekDays: Array<string>;

  public onValueChanged: EventBase<CalendarModel, { value: Date }> = this.addEvent<CalendarModel, { value: Date }>();
  public onZoomChanged: EventBase<CalendarModel, { zoom: CalendarZoom }> = this.addEvent<CalendarModel, { zoom: CalendarZoom }>();

  constructor(options: ICalendarOptions = {}) {
    super();
    this.min = options.min;
    this.max = options.max;
    this.value = options.value;
    this.viewDate = options.viewDate || this.getDefaultViewDate();
    this.updateWeekDays();
    this.updateView();
  }
  public getType(): string {
    return "calendar";
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
    if (item.isOutside) {
      this.viewDate = item.date;
    }
    if (isSameDay(this.value, item.date)) return;
    this.value = item.date;
    this.onValueChanged.fire(this, { value: this.value });
  }
  public hoverItem(item?: CalendarItem): void {
    if (!!item && item.isDisabled) return;
    this.hoveredItem = item;
    this.updateView();
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (["value", "min", "max"].indexOf(name) > -1 && !!newValue) {
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
    if (name === "zoom") {
      this.hoveredItem = undefined;
    }
    if (name === "firstDayOfWeek") {
      this.updateWeekDays();
    }
    if (["value", "viewDate", "min", "max", "zoom", "firstDayOfWeek"].indexOf(name) > -1) {
      this.updateView();
    }
    if (name === "zoom") {
      this.onZoomChanged.fire(this, { zoom: newValue });
    }
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
    return this.value || clampDate(this.getToday(), this.min, this.max);
  }
  private isOutside(start: Date, end: Date): boolean {
    return isPeriodOutside(start, end, this.min, this.max);
  }
  private isNeighbourPeriodOutside(direction: number): boolean {
    const year = this.viewDate.getFullYear();
    if (this.zoom === "month") {
      return this.isOutside(new Date(year + direction, 0, 1), new Date(year + direction, 11, 31));
    }
    if (this.zoom === "year") {
      const startYear = Math.floor(year / yearsInRange) * yearsInRange + direction * yearsInRange;
      return this.isOutside(new Date(startYear, 0, 1), new Date(startYear + yearsInRange - 1, 11, 31));
    }
    const month = this.viewDate.getMonth() + direction;
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
    if (this.zoom === "month") {
      this.months = [];
      this.items = this.createMonthItems(year);
      this.title = year.toString();
    } else if (this.zoom === "year") {
      const startYear = Math.floor(year / yearsInRange) * yearsInRange;
      this.months = [];
      this.items = this.createYearItems(startYear);
      this.title = startYear + " \u2013 " + (startYear + yearsInRange - 1);
    } else {
      const month = this.createMonth(this.viewDate);
      this.months = [month];
      this.items = [];
      this.title = month.title;
    }
    this.canPrev = !this.isNeighbourPeriodOutside(-1);
    this.canNext = !this.isNeighbourPeriodOutside(1);
  }
  private createMonth(monthStart: Date): CalendarMonth {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const offset = (monthStart.getDay() - this.firstDayOfWeek + 7) % 7;
    const today = this.getToday();
    const days: Array<CalendarItem> = [];
    for (let i = 0; i < daysInGrid; i++) {
      const date = new Date(year, month, 1 - offset + i);
      days.push(this.createItem("day", date, date.getDate().toString(), {
        isSelected: isSameDay(this.value, date),
        isToday: isSameDay(today, date),
        isDisabled: this.isOutside(date, date),
        isOutside: date.getMonth() !== month
      }));
    }
    return { date: monthStart, title: monthNames[month] + " " + year, days: days };
  }
  private createMonthItems(year: number): Array<CalendarItem> {
    const isInMonth = (date: Date, month: number) => !!date && date.getFullYear() === year && date.getMonth() === month;
    const today = this.getToday();
    return monthNames.map((name, month) => this.createItem("month", new Date(year, month, 1), name, {
      isSelected: isInMonth(this.value, month),
      isToday: isInMonth(today, month),
      isDisabled: this.isOutside(new Date(year, month, 1), new Date(year, month + 1, 0))
    }));
  }
  private createYearItems(startYear: number): Array<CalendarItem> {
    const isInYear = (date: Date, year: number) => !!date && date.getFullYear() === year;
    const today = this.getToday();
    const res: Array<CalendarItem> = [];
    for (let year = startYear; year < startYear + yearsInRange; year++) {
      res.push(this.createItem("year", new Date(year, 0, 1), year.toString(), {
        isSelected: isInYear(this.value, year),
        isToday: isInYear(today, year),
        isDisabled: this.isOutside(new Date(year, 0, 1), new Date(year, 11, 31))
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
      .toString();
  }
}
