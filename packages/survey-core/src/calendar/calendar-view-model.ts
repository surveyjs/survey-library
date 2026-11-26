import { Base } from "../base";
import { Action } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { property } from "../decorators";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { CalendarItem, CalendarRangePosition, CalendarZoom } from "./calendar-item";
import { CalendarMonth } from "./interfaces";
import { calendarCssClasses } from "./css-classes";
import { CalendarModel, yearsInRange } from "./calendar";
import { clampDate, getToday, isPeriodOutside, isSameDay, shiftMonth, toMonthStart } from "./date-utils";
import { getCalendarMonthNames, getCalendarWeekdayShortNames } from "./calendar-locale";

const daysInGrid = 42;
const listMonthsBefore = 12;
const listMonthsAfter = 12;
const listMonthsStep = 6;
const listGrowEdge = 48;
const viewProperties = ["value", "viewDate", "min", "max", "range", "rangeStart", "zoom", "firstDayOfWeek"];
const rangePositionCss: { [position: string]: string } = {
  start: calendarCssClasses.dayRangeStart,
  end: calendarCssClasses.dayRangeEnd,
  middle: calendarCssClasses.dayRangeMiddle,
  single: calendarCssClasses.dayRangeSingle
};

interface ICalendarItemState {
  isToday: boolean;
  isDisabled: boolean;
  isOutside?: boolean;
  isHidden?: boolean;
}

interface IMonthListBinding {
  root: HTMLElement;
  scroller: HTMLElement;
  align(): void;
  dispose(): void;
}

function getMonthKey(date: Date): string {
  return date.getFullYear() + "-" + date.getMonth();
}
function periodEnd(kind: CalendarZoom, date: Date): Date {
  if (kind === "month") return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  if (kind === "year") return new Date(date.getFullYear(), 11, 31);
  return date;
}

// Everything the renderers draw: months and items with their css, toolbars, hover preview and
// the mobile month list. The rules of the calendar stay in CalendarModel.
export class CalendarViewModel extends Base {
  private hoveredItem: CalendarItem;
  private topToolbarValue: ActionContainer;
  private footerToolbarValue: ActionContainer;
  private listStart: Date;
  private listEnd: Date;
  private monthListBinding: IMonthListBinding;
  private onModelChanged = (_: CalendarModel, options: { name: string, newValue: any }): void => {
    if (viewProperties.indexOf(options.name) < 0) return;
    if (options.name === "viewDate" || options.name === "zoom" || (options.name === "rangeStart" && !options.newValue)) {
      this.hoveredItem = undefined;
    }
    if (options.name === "firstDayOfWeek") {
      this.updateWeekDays();
    }
    this.updateView();
  };

  @property() title: string;
  @property() months: Array<CalendarMonth>;
  @property() items: Array<CalendarItem>;
  @property() weekDays: Array<string>;
  @property({ defaultValue: false }) footerVisible: boolean;
  @property({ defaultValue: false }) isMobile: boolean;
  @property() locale: string;
  @property() anchorMonthKey: string;

  constructor(public readonly model: CalendarModel) {
    super();
    this.model.onPropertyChanged.add(this.onModelChanged);
    this.updateWeekDays();
    this.updateView();
  }
  public getType(): string {
    return "calendarviewmodel";
  }
  public get cssClasses(): typeof calendarCssClasses {
    return calendarCssClasses;
  }
  public get isDayZoom(): boolean {
    return this.model.isDayZoom;
  }
  public get isMonthList(): boolean {
    return this.isMobile && this.model.range && this.isDayZoom;
  }
  public get showMonthTitles(): boolean {
    return this.model.monthCount > 1 && !this.isMonthList;
  }
  public get showTopToolbar(): boolean {
    return !this.isMonthList;
  }
  public get showMonthWeekDays(): boolean {
    return !this.isMonthList;
  }
  public get rootCss(): string {
    return new CssClassBuilder()
      .append(calendarCssClasses.root)
      .append(calendarCssClasses.rootRange, this.model.monthCount > 1 || this.isMonthList)
      .append(calendarCssClasses.rootMonthList, this.isMonthList)
      .toString();
  }
  public get topToolbar(): ActionContainer {
    if (!this.topToolbarValue) {
      this.topToolbarValue = this.createTopToolbar();
    }
    return this.topToolbarValue;
  }
  // An empty toolbar under the calendar. Extra buttons are added here by the host.
  public get footerToolbar(): ActionContainer {
    if (!this.footerToolbarValue) {
      this.footerToolbarValue = this.createFooterToolbar();
    }
    return this.footerToolbarValue;
  }
  public selectItem(item: CalendarItem): void {
    if (!item || item.isDisabled || item.isHidden) return;
    this.model.selectDate(item.date);
  }
  public hoverItem(item?: CalendarItem): void {
    if (!!item && (item.isDisabled || item.isHidden)) return;
    if (this.hoveredItem === item) return;
    this.hoveredItem = item;
    this.refreshHover();
  }
  public resetView(): void {
    this.hoveredItem = undefined;
    this.listStart = undefined;
    this.listEnd = undefined;
    this.model.resetView();
    this.updateView();
    if (!!this.monthListBinding)this.monthListBinding.align();
  }
  public getMonthKey(month: CalendarMonth): string {
    return getMonthKey(month.date);
  }
  // Grows the mobile range list so scrolling can reach any month inside min/max.
  public extendMonthList(direction: number): boolean {
    if (!this.isMonthList || !this.model.viewDate) return false;
    const anchor = toMonthStart(this.model.viewDate);
    this.updateListBounds(anchor);
    const start = this.listStart.getTime();
    const end = this.listEnd.getTime();
    if (direction < 0) {
      this.listStart = shiftMonth(this.listStart, -listMonthsStep);
    } else {
      this.listEnd = shiftMonth(this.listEnd, listMonthsStep);
    }
    this.updateListBounds(anchor);
    if (this.listStart.getTime() === start && this.listEnd.getTime() === end) return false;
    this.updateView();
    return true;
  }
  // Renderers call it after each render: the mobile range list scrolls to the anchor month and
  // grows on scroll while it is shown.
  public attachMonthList(root: HTMLElement): void {
    if (!this.isMonthList || !root) {
      this.detachMonthList();
      return;
    }
    const scroller = root.querySelector("." + calendarCssClasses.months) as HTMLElement;
    if (!scroller) return;
    if (!!this.monthListBinding && this.monthListBinding.root === root && this.monthListBinding.scroller === scroller) return;
    this.detachMonthList();
    this.monthListBinding = bindMonthList(this, root);
  }
  public detachMonthList(): void {
    if (!this.monthListBinding) return;
    this.monthListBinding.dispose();
    this.monthListBinding = undefined;
  }
  public dispose(): void {
    this.model.onPropertyChanged.remove(this.onModelChanged);
    if (!!this.topToolbarValue) {
      this.topToolbarValue.dispose();
      this.topToolbarValue = undefined;
    }
    if (!!this.footerToolbarValue) {
      this.footerToolbarValue.dispose();
      this.footerToolbarValue = undefined;
    }
    this.detachMonthList();
    super.dispose();
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "isMobile" || name === "locale") {
      if (name === "locale") {
        this.updateWeekDays();
      }
      this.updateView();
    }
  }
  private get monthNames(): Array<string> {
    return getCalendarMonthNames(this.locale);
  }
  private get weekDayNames(): Array<string> {
    return getCalendarWeekdayShortNames(this.locale);
  }
  private updateWeekDays(): void {
    const res: Array<string> = [];
    for (let i = 0; i < 7; i++) {
      res.push(this.weekDayNames[(this.model.firstDayOfWeek + i) % 7]);
    }
    this.weekDays = res;
  }
  private updateView(): void {
    const viewDate = this.model.viewDate;
    if (!viewDate) return;
    const year = viewDate.getFullYear();
    const selectedRange = this.model.getSelectedRange(this.hoveredItem?.date);
    if (this.model.zoom === "month") {
      this.months = [];
      this.items = this.createMonthItems(year, selectedRange);
      this.title = year.toString();
    } else if (this.model.zoom === "year") {
      const startYear = Math.floor(year / yearsInRange) * yearsInRange;
      this.months = [];
      this.items = this.createYearItems(startYear, selectedRange);
      this.title = startYear + " \u2013 " + (startYear + yearsInRange - 1);
    } else if (this.isMonthList) {
      const anchor = toMonthStart(viewDate);
      this.anchorMonthKey = getMonthKey(anchor);
      this.months = this.createListMonths(anchor, selectedRange);
      this.items = [];
      this.title = String(year);
    } else {
      const months: Array<CalendarMonth> = [];
      for (let i = 0; i < this.model.monthCount; i++) {
        months.push(this.createMonth(shiftMonth(viewDate, i), selectedRange));
      }
      this.months = months;
      this.items = [];
      this.title = months[0].title;
    }
    this.updateTopToolbar();
  }
  private createTopToolbar(): ActionContainer {
    const css = calendarCssClasses;
    const container = new ActionContainer();
    container.containerCss = css.toolbarActions;
    container.setActionsAppearance({ mode: "tertiary", style: "neutral", size: "small" });
    const button = (id: string, iconName: string, action: () => void): Action => {
      return new Action({
        id: id,
        css: css.navButton,
        iconName: iconName,
        iconSize: "auto",
        showTitle: false,
        disableShrink: true,
        disableTabStop: true,
        action: action
      });
    };
    container.setItems([
      button("prev", css.prevIconId, () => this.model.prev()),
      new Action({
        id: "title",
        css: css.title,
        iconName: css.titleIconId,
        iconSize: "auto",
        showTitle: true,
        disableShrink: true,
        action: () => this.model.zoomOut()
      }),
      button("next", css.nextIconId, () => this.model.next())
    ]);
    this.topToolbarValue = container;
    this.updateTopToolbar();
    return container;
  }
  private createFooterToolbar(): ActionContainer {
    const container = new ActionContainer();
    container.containerCss = calendarCssClasses.footerActions;
    container.setActionsAppearance({ mode: "secondary", style: "neutral", size: "small" });
    container.onPropertyChanged.add(() => {
      this.footerVisible = container.hasActions;
    });
    return container;
  }
  private updateTopToolbar(): void {
    if (!this.topToolbarValue) return;
    this.topToolbarValue.getActionById("prev").setEnabled(this.model.canPrev);
    this.topToolbarValue.getActionById("next").setEnabled(this.model.canNext);
    const title = this.topToolbarValue.getActionById("title");
    title.title = this.title;
    title.visible = this.model.canZoom;
  }
  // The list spans [listStart, listEnd]: it always contains the anchor month and never leaves min/max.
  private updateListBounds(anchor: Date): void {
    const minMonth = !!this.model.min ? toMonthStart(this.model.min) : undefined;
    const maxMonth = !!this.model.max ? toMonthStart(this.model.max) : undefined;
    const start = this.listStart || shiftMonth(anchor, -listMonthsBefore);
    const end = this.listEnd || shiftMonth(anchor, listMonthsAfter);
    this.listStart = clampDate(clampDate(start, minMonth, undefined), undefined, anchor);
    this.listEnd = clampDate(clampDate(end, undefined, maxMonth), anchor, undefined);
  }
  private createListMonths(anchor: Date, selectedRange: Array<Date>): Array<CalendarMonth> {
    this.updateListBounds(anchor);
    const months: Array<CalendarMonth> = [];
    for (let date = this.listStart; date.getTime() <= this.listEnd.getTime(); date = shiftMonth(date, 1)) {
      months.push(this.createMonth(date, selectedRange));
    }
    return months;
  }
  private createMonth(monthStart: Date, selectedRange: Array<Date>): CalendarMonth {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const offset = (monthStart.getDay() - this.model.firstDayOfWeek + 7) % 7;
    const today = getToday();
    // With several months side by side, a neighbour month's day would repeat a day of the next block.
    const hideOutside = this.model.monthCount > 1 || this.isMonthList;
    const days: Array<CalendarItem> = [];
    for (let i = 0; i < daysInGrid; i++) {
      const date = new Date(year, month, 1 - offset + i);
      const isOutside = date.getMonth() !== month;
      if (isOutside && hideOutside) {
        days.push(this.createItem("day", date, "", { isToday: false, isDisabled: false, isOutside: true, isHidden: true }, selectedRange));
        continue;
      }
      days.push(this.createItem("day", date, date.getDate().toString(), {
        isToday: isSameDay(today, date),
        isDisabled: this.model.isPeriodDisabled(date, date),
        isOutside: isOutside
      }, selectedRange));
    }
    if (hideOutside) {
      this.trimHiddenWeeks(days);
    }
    return { date: monthStart, title: this.monthNames[month] + " " + year, days: days };
  }
  // Neighbour days are not drawn, so a trailing week that contains none of the month is only empty space.
  private trimHiddenWeeks(days: Array<CalendarItem>): void {
    while(days.length > 7 && days.slice(-7).every(item => item.isHidden)) {
      days.splice(days.length - 7, 7);
    }
  }
  private getRangePosition(date: Date, range: Array<Date>): CalendarRangePosition {
    if (!this.model.range || !range) return undefined;
    const time = date.getTime();
    const start = range[0].getTime();
    const end = range[1].getTime();
    if (time < start || time > end) return undefined;
    if (start === end) return "single";
    if (time === start) return "start";
    if (time === end) return "end";
    return "middle";
  }
  private isPeriodSelected(start: Date, end: Date, selectedRange: Array<Date>): boolean {
    return !!selectedRange && !isPeriodOutside(start, end, selectedRange[0], selectedRange[1]);
  }
  private createPeriodItems(kind: CalendarZoom, count: number, dateAt: (index: number) => Date, textAt: (index: number) => string, selectedRange: Array<Date>): Array<CalendarItem> {
    const today = getToday();
    const res: Array<CalendarItem> = [];
    for (let i = 0; i < count; i++) {
      const start = dateAt(i);
      const end = periodEnd(kind, start);
      res.push(this.createItem(kind, start, textAt(i), {
        isToday: !isPeriodOutside(start, end, today, today),
        isDisabled: this.model.isPeriodDisabled(start, end)
      }, selectedRange));
    }
    return res;
  }
  private createMonthItems(year: number, selectedRange: Array<Date>): Array<CalendarItem> {
    return this.createPeriodItems("month", this.monthNames.length,
      month => new Date(year, month, 1),
      month => this.monthNames[month],
      selectedRange);
  }
  private createYearItems(startYear: number, selectedRange: Array<Date>): Array<CalendarItem> {
    return this.createPeriodItems("year", yearsInRange,
      index => new Date(startYear + index, 0, 1),
      index => (startYear + index).toString(),
      selectedRange);
  }
  private createItem(kind: CalendarZoom, date: Date, text: string, state: ICalendarItemState, selectedRange: Array<Date>): CalendarItem {
    const item = new CalendarItem(kind, date, text, {
      isToday: state.isToday,
      isOutside: !!state.isOutside,
      isHidden: !!state.isHidden,
      isDisabled: state.isDisabled
    });
    this.applyItemState(item, selectedRange);
    return item;
  }
  // Hover and the range preview rewrite the flags of the cells that already exist.
  private refreshHover(): void {
    const selectedRange = this.model.getSelectedRange(this.hoveredItem?.date);
    (this.months || []).forEach(month => month.days.forEach(item => this.applyItemState(item, selectedRange)));
    (this.items || []).forEach(item => this.applyItemState(item, selectedRange));
  }
  private applyItemState(item: CalendarItem, selectedRange: Array<Date>): void {
    let rangePosition: CalendarRangePosition = undefined;
    let isSelected = false;
    // An unavailable or a hidden neighbour day is rendered unselected.
    if (!item.isDisabled && !item.isHidden) {
      if (item.kind === "day") {
        rangePosition = this.getRangePosition(item.date, selectedRange);
        isSelected = this.model.range ? !!rangePosition : isSameDay(this.model.value, item.date);
      } else {
        isSelected = this.isPeriodSelected(item.date, periodEnd(item.kind, item.date), selectedRange);
      }
    }
    const hovered = this.hoveredItem;
    item.isSelected = isSelected;
    item.isInRange = !!rangePosition;
    item.isHovered = !item.isDisabled && !item.isHidden && !!hovered && hovered.kind === item.kind && hovered.isOutside === item.isOutside && isSameDay(hovered.date, item.date);
    item.rangePosition = rangePosition;
    item.css = this.getItemCss(item);
  }
  private getItemCss(item: CalendarItem): string {
    const kind = item.kind;
    const classes: { [key: string]: string } = calendarCssClasses;
    return new CssClassBuilder()
      .append(classes[kind])
      .append(classes[kind + "Outside"], item.isOutside)
      .append(classes[kind + "Hidden"], item.isHidden)
      .append(classes[kind + "Today"], item.isToday)
      .append(classes[kind + "Selected"], item.isSelected)
      .append(classes[kind + "InRange"], item.isInRange)
      .append(classes[kind + "Hovered"], item.isHovered)
      .append(classes[kind + "Disabled"], item.isDisabled)
      .append(rangePositionCss[item.rangePosition], !!item.rangePosition)
      .toString();
  }
}

// The month list is the scroller in the mobile range mode; the sticky header is outside of it.
// Month elements are expected to carry data-month set to CalendarViewModel.getMonthKey().
function bindMonthList(viewModel: CalendarViewModel, root: HTMLElement): IMonthListBinding {
  const scroller = root.querySelector("." + calendarCssClasses.months) as HTMLElement;
  let isGrowing = false;
  let alignFrame: number;
  let restoreFrame: number;
  // The list can be in the DOM before the popup has a height, so one frame is not enough.
  const alignAttemptLimit = 30;
  const align = (): void => {
    if (!scroller) return;
    cancelAnimationFrame(alignFrame);
    const step = (framesLeft: number): void => {
      alignFrame = requestAnimationFrame(() => {
        if (!scroller.isConnected) return;
        const anchor = root.querySelector("[data-month=\"" + viewModel.anchorMonthKey + "\"]") as HTMLElement;
        if (!anchor || scroller.clientHeight === 0) {
          if (framesLeft > 0) step(framesLeft - 1);
          return;
        }
        const delta = anchor.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
        if (Math.abs(delta) <= 1) return;
        scroller.scrollTop += delta;
        if (framesLeft > 0) step(framesLeft - 1);
      });
    };
    step(alignAttemptLimit);
  };
  // Prepended months push the content down, so the scroll position is restored after they render.
  const grow = (): void => {
    if (isGrowing || !scroller) return;
    const nearStart = scroller.scrollTop < listGrowEdge;
    const nearEnd = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < listGrowEdge;
    if (!nearStart && !nearEnd) return;
    const prevHeight = scroller.scrollHeight;
    const prevTop = scroller.scrollTop;
    if (!viewModel.extendMonthList(nearStart ? -1 : 1)) return;
    isGrowing = true;
    // The new months are painted on a later frame. Restoring before that sees no height change and the view jumps.
    const restore = (framesLeft: number): void => {
      restoreFrame = requestAnimationFrame(() => {
        const grown = scroller.scrollHeight - prevHeight;
        if (nearStart && grown > 0) {
          scroller.scrollTop = prevTop + grown;
          isGrowing = false;
          return;
        }
        if (nearStart && framesLeft > 0) {
          restore(framesLeft - 1);
          return;
        }
        isGrowing = false;
      });
    };
    restore(alignAttemptLimit);
  };
  const onScroll = (): void => {
    grow();
  };
  if (!!scroller) scroller.addEventListener("scroll", onScroll);
  align();
  return {
    root: root,
    scroller: scroller,
    align: align,
    dispose: () => {
      cancelAnimationFrame(alignFrame);
      cancelAnimationFrame(restoreFrame);
      if (!!scroller) scroller.removeEventListener("scroll", onScroll);
    }
  };
}
