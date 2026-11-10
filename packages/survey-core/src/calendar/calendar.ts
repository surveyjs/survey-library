import { Base } from "../base";
import { EventBase } from "../event";
import { property } from "../decorators";
import { createDate } from "../helpers";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { CalendarItem, CalendarMonth, CalendarZoom, ICalendarOptions } from "./interfaces";
import { calendarCssClasses } from "./css-classes";
import { isSameDay, toDateOnly, toMonthStart } from "./date-utils";

// Localization is out of scope for now: the names are english.
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const daysInGrid = 42;
const yearsInRange = 12;
const nextZoom: { [zoom: string]: CalendarZoom } = { day: "month", month: "year", year: "day" };

interface ICalendarItemState {
  isSelected: boolean;
  isToday: boolean;
  isOutside?: boolean;
}

export class CalendarModel extends Base {
  private hoveredItem: CalendarItem;

  @property() value: Date;
  @property() viewDate: Date;
  @property({ defaultValue: "day" }) zoom: CalendarZoom;
  @property({ defaultValue: 1 }) firstDayOfWeek: number;
  @property() title: string;
  @property() months: Array<CalendarMonth>;
  @property() items: Array<CalendarItem>;
  @property() weekDays: Array<string>;

  public onValueChanged: EventBase<CalendarModel, { value: Date }> = this.addEvent<CalendarModel, { value: Date }>();
  public onZoomChanged: EventBase<CalendarModel, { zoom: CalendarZoom }> = this.addEvent<CalendarModel, { zoom: CalendarZoom }>();

  constructor(options: ICalendarOptions = {}) {
    super();
    this.value = options.value;
    this.viewDate = options.viewDate || options.value || this.getToday();
    this.updateWeekDays();
    this.updateView();
  }
  public getType(): string {
    return "calendar";
  }
  public prev(): void {
    this.shiftView(-1);
  }
  public next(): void {
    this.shiftView(1);
  }
  public zoomOut(): void {
    this.zoom = nextZoom[this.zoom];
  }
  public resetView(): void {
    this.hoveredItem = undefined;
    this.zoom = "day";
    this.viewDate = this.value || this.getToday();
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
    if (name === "value") {
      const date = toDateOnly(newValue);
      if (!isSameDay(date, newValue)) {
        this.value = date;
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
    if (["value", "viewDate", "zoom", "firstDayOfWeek"].indexOf(name) > -1) {
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
      isToday: isInMonth(today, month)
    }));
  }
  private createYearItems(startYear: number): Array<CalendarItem> {
    const isInYear = (date: Date, year: number) => !!date && date.getFullYear() === year;
    const today = this.getToday();
    const res: Array<CalendarItem> = [];
    for (let year = startYear; year < startYear + yearsInRange; year++) {
      res.push(this.createItem("year", new Date(year, 0, 1), year.toString(), {
        isSelected: isInYear(this.value, year),
        isToday: isInYear(today, year)
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
      isHovered: !!hovered && isSameDay(hovered.date, date) && hovered.isOutside === isOutside,
      isToday: state.isToday,
      isOutside: isOutside,
      isDisabled: false,
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
