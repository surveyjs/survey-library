import { Base } from "../base";
import { Action } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { property } from "../decorators";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { CalendarItem, CalendarMonth, CalendarRangePosition, CalendarZoom } from "./interfaces";
import { calendarCssClasses } from "./css-classes";
import { CalendarModel, yearsInRange } from "./calendar";
import { clampDate, getToday, isPeriodOutside, isSameDay, shiftMonth, toMonthStart } from "./date-utils";

// Localization is out of scope for now: the names are english.
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isOutside?: boolean;
  isHidden?: boolean;
  rangePosition?: CalendarRangePosition;
}

interface IMonthListBinding {
  root: HTMLElement;
  align(): void;
  dispose(): void;
}

function getMonthKey(date: Date): string {
  return date.getFullYear() + "-" + date.getMonth();
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
    this.hoveredItem = item;
    this.updateView();
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
    if (!!this.monthListBinding && this.monthListBinding.root === root) return;
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
    if (name === "isMobile") {
      this.updateView();
    }
  }
  private updateWeekDays(): void {
    const res: Array<string> = [];
    for (let i = 0; i < 7; i++) {
      res.push(weekDayNames[(this.model.firstDayOfWeek + i) % 7]);
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
        days.push(this.createItem("day", date, "", { isSelected: false, isToday: false, isDisabled: false, isOutside: true, isHidden: true }));
        continue;
      }
      const rangePosition = this.getRangePosition(date, selectedRange);
      days.push(this.createItem("day", date, date.getDate().toString(), {
        isSelected: this.model.range ? !!rangePosition : isSameDay(this.model.value, date),
        isToday: isSameDay(today, date),
        isDisabled: this.model.isPeriodDisabled(date, date),
        isOutside: isOutside,
        rangePosition: rangePosition
      }));
    }
    if (hideOutside) {
      this.trimHiddenWeeks(days);
    }
    return { date: monthStart, title: monthNames[month] + " " + year, days: days };
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
  private createMonthItems(year: number, selectedRange: Array<Date>): Array<CalendarItem> {
    const today = getToday();
    return monthNames.map((name, month) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      return this.createItem("month", start, name, {
        isSelected: this.isPeriodSelected(start, end, selectedRange),
        isToday: !isPeriodOutside(start, end, today, today),
        isDisabled: this.model.isPeriodDisabled(start, end)
      });
    });
  }
  private createYearItems(startYear: number, selectedRange: Array<Date>): Array<CalendarItem> {
    const today = getToday();
    const res: Array<CalendarItem> = [];
    for (let year = startYear; year < startYear + yearsInRange; year++) {
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);
      res.push(this.createItem("year", start, year.toString(), {
        isSelected: this.isPeriodSelected(start, end, selectedRange),
        isToday: !isPeriodOutside(start, end, today, today),
        isDisabled: this.model.isPeriodDisabled(start, end)
      }));
    }
    return res;
  }
  private createItem(kind: CalendarZoom, date: Date, text: string, state: ICalendarItemState): CalendarItem {
    const isOutside = !!state.isOutside;
    const hovered = this.hoveredItem;
    // An unavailable date is always rendered as disabled and unselected.
    const rangePosition = state.isDisabled ? undefined : state.rangePosition;
    const item: CalendarItem = {
      date: date,
      text: text,
      isSelected: state.isSelected && !state.isDisabled,
      isInRange: !!rangePosition,
      isHovered: !state.isDisabled && !!hovered && isSameDay(hovered.date, date) && hovered.isOutside === isOutside,
      isToday: state.isToday,
      isOutside: isOutside,
      isHidden: !!state.isHidden,
      isDisabled: state.isDisabled,
      rangePosition: rangePosition,
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
  const align = (): void => {
    if (!scroller) return;
    cancelAnimationFrame(alignFrame);
    alignFrame = requestAnimationFrame(() => {
      const anchor = root.querySelector("[data-month=\"" + viewModel.anchorMonthKey + "\"]");
      if (!anchor) return;
      scroller.scrollTop += anchor.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    });
  };
  // Prepended months push the content down, so the scroll position is restored after they render.
  const grow = (): void => {
    if (isGrowing) return;
    const nearStart = scroller.scrollTop < listGrowEdge;
    const nearEnd = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < listGrowEdge;
    if (!nearStart && !nearEnd) return;
    const prevHeight = scroller.scrollHeight;
    const prevTop = scroller.scrollTop;
    if (!viewModel.extendMonthList(nearStart ? -1 : 1)) return;
    isGrowing = true;
    requestAnimationFrame(() => {
      if (nearStart) scroller.scrollTop = prevTop + scroller.scrollHeight - prevHeight;
      isGrowing = false;
    });
  };
  const onScroll = (): void => {
    grow();
  };
  if (!!scroller) scroller.addEventListener("scroll", onScroll);
  align();
  return {
    root: root,
    align: align,
    dispose: () => {
      cancelAnimationFrame(alignFrame);
      if (!!scroller) scroller.removeEventListener("scroll", onScroll);
    }
  };
}
