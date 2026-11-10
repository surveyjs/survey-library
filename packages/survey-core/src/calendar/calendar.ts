import { Base } from "../base";
import { EventBase } from "../event";
import { property } from "../decorators";
import { createDate } from "../helpers";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { CalendarItem, CalendarMonth, ICalendarOptions } from "./interfaces";
import { calendarCssClasses } from "./css-classes";
import { isSameDay, toDateOnly, toMonthStart } from "./date-utils";

// Localization is out of scope for now: the names are english.
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const daysInGrid = 42;

export class CalendarModel extends Base {
  private hoveredItem: CalendarItem;

  @property() value: Date;
  @property() viewDate: Date;
  @property({ defaultValue: 1 }) firstDayOfWeek: number;
  @property() months: Array<CalendarMonth>;
  @property() weekDays: Array<string>;

  public onValueChanged: EventBase<CalendarModel, { value: Date }> = this.addEvent<CalendarModel, { value: Date }>();

  constructor(options: ICalendarOptions = {}) {
    super();
    this.value = options.value;
    this.viewDate = options.viewDate || options.value || this.getToday();
    this.updateWeekDays();
    this.updateMonths();
  }
  public getType(): string {
    return "calendar";
  }
  public prev(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
  }
  public next(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
  }
  public selectItem(item: CalendarItem): void {
    if (!item || item.isDisabled) return;
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
    this.updateMonths();
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
    if (name === "firstDayOfWeek") {
      this.updateWeekDays();
    }
    if (["value", "viewDate", "firstDayOfWeek"].indexOf(name) > -1) {
      this.updateMonths();
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
  private updateMonths(): void {
    if (!this.viewDate) return;
    this.months = [this.createMonth(this.viewDate)];
  }
  private createMonth(monthStart: Date): CalendarMonth {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const offset = (monthStart.getDay() - this.firstDayOfWeek + 7) % 7;
    const today = this.getToday();
    const days: Array<CalendarItem> = [];
    for (let i = 0; i < daysInGrid; i++) {
      days.push(this.createDay(new Date(year, month, 1 - offset + i), month, today));
    }
    return { date: monthStart, title: monthNames[month] + " " + year, days: days };
  }
  private createDay(date: Date, month: number, today: Date): CalendarItem {
    const isOutside = date.getMonth() !== month;
    const hovered = this.hoveredItem;
    const item: CalendarItem = {
      date: date,
      text: date.getDate().toString(),
      isSelected: isSameDay(this.value, date),
      isHovered: !!hovered && isSameDay(hovered.date, date) && hovered.isOutside === isOutside,
      isToday: isSameDay(today, date),
      isOutside: isOutside,
      isDisabled: false,
      css: ""
    };
    item.css = this.getDayCss(item);
    return item;
  }
  private getDayCss(item: CalendarItem): string {
    return new CssClassBuilder()
      .append(calendarCssClasses.day)
      .append(calendarCssClasses.dayOutside, item.isOutside)
      .append(calendarCssClasses.dayToday, item.isToday)
      .append(calendarCssClasses.daySelected, item.isSelected)
      .append(calendarCssClasses.dayHovered, item.isHovered)
      .append(calendarCssClasses.dayDisabled, item.isDisabled)
      .toString();
  }
}
