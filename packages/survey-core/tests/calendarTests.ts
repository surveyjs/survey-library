import { CalendarModel } from "../src/calendar/calendar";
import { CalendarViewModel } from "../src/calendar/calendar-view-model";
import { CalendarItem } from "../src/calendar/calendar-item";
import { ICalendarOptions } from "../src/calendar/interfaces";

import { describe, test, expect, vi, afterEach } from "vitest";

function d(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}
function createCalendar(options?: ICalendarOptions): CalendarViewModel {
  return new CalendarViewModel(new CalendarModel(options));
}
function days(calendar: CalendarViewModel): Array<CalendarItem> {
  return calendar.months[0].days;
}
function findDay(calendar: CalendarViewModel, date: Date, isOutside: boolean = false): CalendarItem {
  return days(calendar).filter(item => item.date.getTime() === date.getTime() && !!item.isOutside === isOutside)[0];
}

describe("CalendarModel", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("Default state", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9, 15, 30));
    const calendar = createCalendar();
    expect(calendar.model.value).toBeUndefined();
    expect(calendar.model.firstDayOfWeek).toBe(1);
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
    expect(calendar.months).toHaveLength(1);
    expect(calendar.months[0].date.getTime()).toBe(d(2026, 11, 1).getTime());
    expect(calendar.months[0].title).toBe("November 2026");
  });

  test("viewDate comes from options, then from value, and is normalized to the first day of the month", () => {
    let calendar = createCalendar({ value: d(2025, 3, 17) });
    expect(calendar.model.viewDate.getTime()).toBe(d(2025, 3, 1).getTime());

    calendar = createCalendar({ value: d(2025, 3, 17), viewDate: new Date(2024, 6, 20, 10, 15) });
    expect(calendar.model.viewDate.getTime()).toBe(d(2024, 7, 1).getTime());
    expect(calendar.model.value.getTime()).toBe(d(2025, 3, 17).getTime());
  });

  test("value is stored without time", () => {
    const calendar = createCalendar({ value: new Date(2025, 2, 17, 23, 59) });
    expect(calendar.model.value.getTime()).toBe(d(2025, 3, 17).getTime());
  });

  test("weekDays start from Monday", () => {
    const calendar = createCalendar();
    expect(calendar.weekDays).toEqual(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]);
  });

  test("weekDays and the grid follow firstDayOfWeek", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.firstDayOfWeek = 0;
    expect(calendar.weekDays).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
    // November 1, 2026 is a Sunday
    expect(days(calendar)[0].date.getTime()).toBe(d(2026, 11, 1).getTime());
    expect(days(calendar)[0].isOutside).toBe(false);
  });

  test("The grid always has 42 days", () => {
    [d(2026, 11, 1), d(2024, 2, 1), d(2023, 2, 1), d(2021, 2, 1), d(2026, 6, 1), d(2025, 8, 1)].forEach(viewDate => {
      const calendar = createCalendar({ viewDate: viewDate });
      expect(days(calendar), viewDate.toDateString()).toHaveLength(42);
    });
  });

  test("Grid of November 2026", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    const items = days(calendar);
    // November 1, 2026 is a Sunday: the first row starts with October 26
    expect(items[0].date.getTime()).toBe(d(2026, 10, 26).getTime());
    expect(items[0].text).toBe("26");
    expect(items.slice(0, 6).every(item => item.isOutside)).toBe(true);
    expect(items[6].date.getTime()).toBe(d(2026, 11, 1).getTime());
    expect(items[6].text).toBe("1");
    expect(items[6].isOutside).toBe(false);
    expect(items[35].date.getTime()).toBe(d(2026, 11, 30).getTime());
    expect(items[35].isOutside).toBe(false);
    expect(items[36].date.getTime()).toBe(d(2026, 12, 1).getTime());
    expect(items.slice(36).every(item => item.isOutside)).toBe(true);
    expect(items[41].date.getTime()).toBe(d(2026, 12, 6).getTime());
  });

  test("Grid of a month that starts on Monday", () => {
    // June 1, 2026 is a Monday
    const calendar = createCalendar({ viewDate: d(2026, 6, 1) });
    const items = days(calendar);
    expect(items[0].date.getTime()).toBe(d(2026, 6, 1).getTime());
    expect(items[0].isOutside).toBe(false);
    expect(items.filter(item => !item.isOutside)).toHaveLength(30);
    expect(items[30].date.getTime()).toBe(d(2026, 7, 1).getTime());
    expect(items[30].isOutside).toBe(true);
  });

  test("Grid of February in a leap year", () => {
    // February 1, 2024 is a Thursday
    const calendar = createCalendar({ viewDate: d(2024, 2, 1) });
    const items = days(calendar);
    expect(items[0].date.getTime()).toBe(d(2024, 1, 29).getTime());
    const inside = items.filter(item => !item.isOutside);
    expect(inside).toHaveLength(29);
    expect(inside[28].date.getTime()).toBe(d(2024, 2, 29).getTime());
  });

  test("Grid of February in a non-leap year", () => {
    // February 1, 2023 is a Wednesday
    const calendar = createCalendar({ viewDate: d(2023, 2, 1) });
    const items = days(calendar);
    expect(items[0].date.getTime()).toBe(d(2023, 1, 30).getTime());
    const inside = items.filter(item => !item.isOutside);
    expect(inside).toHaveLength(28);
    expect(inside[27].date.getTime()).toBe(d(2023, 2, 28).getTime());
    expect(items[41].date.getTime()).toBe(d(2023, 3, 12).getTime());
  });

  test("Grid of February that fits into four weeks", () => {
    // February 1, 2021 is a Monday and the month has 28 days: two full weeks of March follow it
    const calendar = createCalendar({ viewDate: d(2021, 2, 1) });
    const items = days(calendar);
    expect(items[0].date.getTime()).toBe(d(2021, 2, 1).getTime());
    expect(items.slice(0, 28).every(item => !item.isOutside)).toBe(true);
    expect(items.slice(28).every(item => item.isOutside)).toBe(true);
    expect(items[41].date.getTime()).toBe(d(2021, 3, 14).getTime());
  });

  test("isToday", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9, 15, 30));
    const calendar = createCalendar();
    const todayItems = days(calendar).filter(item => item.isToday);
    expect(todayItems).toHaveLength(1);
    expect(todayItems[0].date.getTime()).toBe(d(2026, 11, 9).getTime());
    calendar.model.next();
    expect(days(calendar).filter(item => item.isToday)).toHaveLength(0);
  });

  test("isDisabled is false for every day", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    expect(days(calendar).every(item => item.isDisabled === false)).toBe(true);
  });

  test("Selected day", () => {
    const calendar = createCalendar({ value: d(2026, 11, 9) });
    const selected = days(calendar).filter(item => item.isSelected);
    expect(selected).toHaveLength(1);
    expect(selected[0].date.getTime()).toBe(d(2026, 11, 9).getTime());
  });

  test("selectItem sets value and fires onValueChanged", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    const log: Array<Date> = [];
    calendar.model.onValueChanged.add((_, options) => log.push(options.value));

    calendar.selectItem(findDay(calendar, d(2026, 11, 9)));
    expect(calendar.model.value.getTime()).toBe(d(2026, 11, 9).getTime());
    expect(findDay(calendar, d(2026, 11, 9)).isSelected).toBe(true);
    expect(log).toHaveLength(1);
    expect(log[0].getTime()).toBe(d(2026, 11, 9).getTime());

    calendar.selectItem(findDay(calendar, d(2026, 11, 20)));
    expect(findDay(calendar, d(2026, 11, 9)).isSelected).toBe(false);
    expect(findDay(calendar, d(2026, 11, 20)).isSelected).toBe(true);
    expect(log).toHaveLength(2);
  });

  test("Selecting the selected day again does not fire onValueChanged", () => {
    const calendar = createCalendar({ value: d(2026, 11, 9) });
    let counter = 0;
    calendar.model.onValueChanged.add(() => counter++);
    calendar.selectItem(findDay(calendar, d(2026, 11, 9)));
    expect(counter).toBe(0);
  });

  test("Setting value programmatically does not fire onValueChanged", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    let counter = 0;
    calendar.model.onValueChanged.add(() => counter++);
    calendar.model.value = d(2026, 11, 15);
    expect(findDay(calendar, d(2026, 11, 15)).isSelected).toBe(true);
    expect(counter).toBe(0);
  });

  test("Selecting an outside day switches the month", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.selectItem(findDay(calendar, d(2026, 10, 28), true));
    expect(calendar.model.value.getTime()).toBe(d(2026, 10, 28).getTime());
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 10, 1).getTime());
    expect(calendar.months[0].title).toBe("October 2026");
    expect(findDay(calendar, d(2026, 10, 28)).isSelected).toBe(true);

    calendar.selectItem(findDay(calendar, d(2026, 11, 3), true));
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("hoverItem", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.hoverItem(findDay(calendar, d(2026, 11, 9)));
    let hovered = days(calendar).filter(item => item.isHovered);
    expect(hovered).toHaveLength(1);
    expect(hovered[0].date.getTime()).toBe(d(2026, 11, 9).getTime());

    calendar.hoverItem(findDay(calendar, d(2026, 11, 10)));
    hovered = days(calendar).filter(item => item.isHovered);
    expect(hovered).toHaveLength(1);
    expect(hovered[0].date.getTime()).toBe(d(2026, 11, 10).getTime());

    calendar.hoverItem();
    expect(days(calendar).filter(item => item.isHovered)).toHaveLength(0);
  });

  test("Hover keeps the day and month objects", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    const month = calendar.months[0];
    const grid = days(calendar).slice();
    const first = findDay(calendar, d(2026, 11, 9));
    const second = findDay(calendar, d(2026, 11, 10));
    calendar.hoverItem(first);
    calendar.hoverItem(second);
    expect(calendar.months[0]).toBe(month);
    days(calendar).forEach((item, index) => expect(item).toBe(grid[index]));
    expect(second.isHovered).toBe(true);
    expect(first.isHovered).toBe(false);
    expect(second.css.indexOf("sv-calendar__day--hovered")).toBeGreaterThan(-1);
    expect(first.css.indexOf("sv-calendar__day--hovered")).toBe(-1);
  });

  test("Hovering an outside day hovers only that cell", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.hoverItem(findDay(calendar, d(2026, 10, 30), true));
    const hovered = days(calendar).filter(item => item.isHovered);
    expect(hovered).toHaveLength(1);
    expect(hovered[0].isOutside).toBe(true);
  });

  test("prev and next switch the month", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.next();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 12, 1).getTime());
    expect(calendar.months[0].title).toBe("December 2026");
    calendar.model.prev();
    calendar.model.prev();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 10, 1).getTime());
    expect(calendar.months[0].title).toBe("October 2026");
  });

  test("prev and next cross the year boundary", () => {
    const calendar = createCalendar({ viewDate: d(2026, 12, 1) });
    calendar.model.next();
    expect(calendar.model.viewDate.getTime()).toBe(d(2027, 1, 1).getTime());
    expect(calendar.months[0].title).toBe("January 2027");
    calendar.model.prev();
    calendar.model.prev();
    calendar.model.prev();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 10, 1).getTime());

    const january = createCalendar({ viewDate: d(2026, 1, 1) });
    january.model.prev();
    expect(january.model.viewDate.getTime()).toBe(d(2025, 12, 1).getTime());
    expect(january.months[0].title).toBe("December 2025");
  });

  test("Navigation does not change value", () => {
    const calendar = createCalendar({ value: d(2026, 11, 9) });
    calendar.model.next();
    expect(calendar.model.value.getTime()).toBe(d(2026, 11, 9).getTime());
    expect(days(calendar).filter(item => item.isSelected)).toHaveLength(0);
    calendar.model.prev();
    expect(findDay(calendar, d(2026, 11, 9)).isSelected).toBe(true);
  });

  test("Item css reflects the item state", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const calendar = createCalendar({ value: d(2026, 11, 20) });
    calendar.hoverItem(findDay(calendar, d(2026, 11, 12)));
    expect(findDay(calendar, d(2026, 11, 5)).css).toBe("sv-calendar__day");
    expect(findDay(calendar, d(2026, 11, 9)).css).toBe("sv-calendar__day sv-calendar__day--today");
    expect(findDay(calendar, d(2026, 11, 20)).css).toBe("sv-calendar__day sv-calendar__day--selected");
    expect(findDay(calendar, d(2026, 11, 12)).css).toBe("sv-calendar__day sv-calendar__day--hovered");
    expect(findDay(calendar, d(2026, 10, 26), true).css).toBe("sv-calendar__day sv-calendar__day--outside");
  });

  test("Render helpers: cssClasses, rootCss and isDayZoom", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    expect(calendar.cssClasses.root).toBe("sv-calendar");
    expect(calendar.cssClasses.titleIconId).toBe("icon-chevrondown-16x16");
    expect(calendar.cssClasses.prevIconId).toBe("icon-chevronleft-24x24");
    expect(calendar.cssClasses.nextIconId).toBe("icon-chevronright-24x24");
    expect(calendar.rootCss).toBe("sv-calendar");
    expect(calendar.isDayZoom).toBe(true);
    expect(calendar.showMonthTitles).toBe(false);
    expect(calendar.model.canZoom).toBe(true);
    calendar.model.zoom = "month";
    expect(calendar.isDayZoom).toBe(false);
    calendar.model.range = true;
    expect(calendar.isDayZoom).toBe(true);
    expect(calendar.rootCss).toBe("sv-calendar sv-calendar--range");
    expect(calendar.showMonthTitles).toBe(true);
    expect(calendar.model.canZoom).toBe(false);
    expect(calendar.topToolbar.getActionById("title").visible).toBe(false);
  });

  test("The toolbar is an action container", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2026, 11, 1), max: d(2026, 12, 31) });
    const toolbar = calendar.topToolbar;
    expect(toolbar.actions.map(action => action.id)).toEqual(["prev", "title", "next"]);
    expect(toolbar.getActionById("prev").enabled).toBe(false);
    expect(toolbar.getActionById("next").enabled).toBe(true);
    expect(toolbar.getActionById("prev").iconName).toBe("icon-chevronleft-24x24");
    expect(toolbar.getActionById("title").title).toBe("November 2026");
    expect(toolbar.getActionById("title").visible).toBe(true);

    toolbar.getActionById("next").action();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 12, 1).getTime());
    expect(toolbar.getActionById("title").title).toBe("December 2026");
    expect(toolbar.getActionById("next").enabled).toBe(false);
    expect(toolbar.getActionById("prev").enabled).toBe(true);

    toolbar.getActionById("title").action();
    expect(calendar.model.zoom).toBe("month");
    expect(toolbar.getActionById("title").title).toBe("2026");

    calendar.model.range = true;
    expect(toolbar.getActionById("title").visible).toBe(false);
    expect(calendar.model.zoom).toBe("day");
  });

  test("The footer toolbar accepts custom actions", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    const footer = calendar.footerToolbar;
    expect(footer.hasActions).toBe(false);
    expect(calendar.footerVisible).toBe(false);
    let clicked = 0;
    footer.addAction({ id: "today", title: "Today", action: () => clicked++ });
    expect(calendar.footerVisible).toBe(true);
    expect(footer.actions.map(action => action.id)).toEqual(["today"]);
    footer.getActionById("today").action();
    expect(clicked).toBe(1);
    calendar.dispose();
    expect(calendar["footerToolbarValue"]).toBeUndefined();
  });

  test("The mobile month list stacks months and the header year follows the edge", () => {
    const calendar = createCalendar({ viewDate: d(2023, 12, 1), range: true });
    calendar.isMobile = true;
    expect(calendar.isMonthList).toBe(true);
    expect(calendar.showTopToolbar).toBe(false);
    expect(calendar.anchorMonthKey).toBe("2023-11");
    expect(calendar.months[0].title).toBe("December 2022");
    expect(calendar.months.some(month => month.title === "December 2023")).toBe(true);
    const outside = calendar.months[0].days.filter(item => item.date.getMonth() !== 11);
    expect(outside.every(item => item.isHidden)).toBe(true);
  });

  test("The mobile month list grows in both directions until min and max", () => {
    const calendar = createCalendar({ viewDate: d(2026, 6, 1), range: true, min: d(2024, 1, 1), max: d(2028, 12, 31) });
    calendar.isMobile = true;
    const first = calendar.months[0].date.getTime();
    const last = calendar.months[calendar.months.length - 1].date.getTime();
    expect(calendar.extendMonthList(-1)).toBe(true);
    expect(calendar.months[0].date.getTime()).toBeLessThan(first);
    expect(calendar.extendMonthList(1)).toBe(true);
    expect(calendar.months[calendar.months.length - 1].date.getTime()).toBeGreaterThan(last);
    while(calendar.extendMonthList(-1)) { /* reach min */ }
    expect(calendar.months[0].date.getTime()).toBe(d(2024, 1, 1).getTime());
    while(calendar.extendMonthList(1)) { /* reach max */ }
    const end = calendar.months[calendar.months.length - 1].date;
    expect(end.getFullYear()).toBe(2028);
    expect(end.getMonth()).toBe(11);
    const grown = calendar.months.length;
    calendar.resetView();
    expect(calendar.months.length).toBeLessThan(grown);
  });

  test("onSelectionCompleted fires on every day selection, even if the value is the same", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    const completed: Array<Date> = [];
    let changedCount = 0;
    calendar.model.onSelectionCompleted.add((_, options) => completed.push(options.value));
    calendar.model.onValueChanged.add(() => changedCount++);
    calendar.selectItem(findDay(calendar, d(2026, 11, 5)));
    calendar.selectItem(findDay(calendar, d(2026, 11, 5)));
    expect(completed.map(date => date.getTime())).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 5).getTime()]);
    expect(changedCount).toBe(1);
  });

  test("onSelectionCompleted does not fire when the zoom changes", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    let count = 0;
    calendar.model.onSelectionCompleted.add(() => count++);
    calendar.model.zoom = "month";
    calendar.selectItem(calendar.items[2]);
    calendar.model.zoom = "year";
    calendar.selectItem(calendar.items[2]);
    expect(count).toBe(0);
  });
});

describe("CalendarModel zoom", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  function texts(calendar: CalendarViewModel): Array<string> {
    return calendar.items.map(item => item.text);
  }
  function findItem(calendar: CalendarViewModel, text: string): CalendarItem {
    return calendar.items.filter(item => item.text === text)[0];
  }

  test("zoom is day by default", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    expect(calendar.model.zoom).toBe("day");
    expect(calendar.title).toBe("November 2026");
    expect(calendar.months).toHaveLength(1);
    expect(calendar.items).toHaveLength(0);
  });

  test("zoomOut cycles day -> month -> year -> day", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.zoomOut();
    expect(calendar.model.zoom).toBe("month");
    calendar.model.zoomOut();
    expect(calendar.model.zoom).toBe("year");
    calendar.model.zoomOut();
    expect(calendar.model.zoom).toBe("day");
    calendar.model.zoomOut();
    expect(calendar.model.zoom).toBe("month");
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("Month zoom: title and items", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.zoomOut();
    expect(calendar.title).toBe("2026");
    expect(calendar.months).toHaveLength(0);
    expect(texts(calendar)).toEqual(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
    expect(calendar.items[0].date.getTime()).toBe(d(2026, 1, 1).getTime());
    expect(calendar.items[11].date.getTime()).toBe(d(2026, 12, 1).getTime());
    expect(calendar.items.every(item => !item.isOutside && !item.isDisabled)).toBe(true);
  });

  test("Year zoom: title and items", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.zoomOut();
    calendar.model.zoomOut();
    expect(calendar.title).toBe("2016 \u2013 2027");
    expect(calendar.months).toHaveLength(0);
    expect(texts(calendar)).toEqual(["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027"]);
    expect(calendar.items[0].date.getTime()).toBe(d(2016, 1, 1).getTime());
    expect(calendar.items.every(item => !item.isOutside && !item.isDisabled)).toBe(true);
  });

  test("Year ranges are aligned to 12", () => {
    const check = (year: number, title: string) => {
      const calendar = createCalendar({ viewDate: d(year, 5, 1) });
      calendar.model.zoom = "year";
      expect(calendar.title, year.toString()).toBe(title);
    };
    check(2016, "2016 \u2013 2027");
    check(2027, "2016 \u2013 2027");
    check(2028, "2028 \u2013 2039");
    check(2039, "2028 \u2013 2039");
    check(2040, "2040 \u2013 2051");
    check(2015, "2004 \u2013 2015");
  });

  test("prev and next in the month zoom switch the year", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.zoom = "month";
    calendar.model.next();
    expect(calendar.model.viewDate.getTime()).toBe(d(2027, 11, 1).getTime());
    expect(calendar.title).toBe("2027");
    expect(calendar.items[0].date.getTime()).toBe(d(2027, 1, 1).getTime());
    calendar.model.prev();
    calendar.model.prev();
    expect(calendar.title).toBe("2025");
  });

  test("prev and next in the year zoom switch the range by 12 years", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.zoom = "year";
    calendar.model.next();
    expect(calendar.title).toBe("2028 \u2013 2039");
    expect(texts(calendar)[0]).toBe("2028");
    calendar.model.prev();
    calendar.model.prev();
    expect(calendar.title).toBe("2004 \u2013 2015");
    expect(texts(calendar)[11]).toBe("2015");
  });

  test("Selecting a month switches to the day zoom of that month", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.zoom = "month";
    calendar.selectItem(findItem(calendar, "March"));
    expect(calendar.model.zoom).toBe("day");
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 3, 1).getTime());
    expect(calendar.title).toBe("March 2026");
    expect(calendar.months).toHaveLength(1);
    expect(calendar.items).toHaveLength(0);
  });

  test("Selecting a year switches to the month zoom of that year", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.zoom = "year";
    calendar.selectItem(findItem(calendar, "2019"));
    expect(calendar.model.zoom).toBe("month");
    expect(calendar.title).toBe("2019");
    expect(calendar.model.viewDate.getFullYear()).toBe(2019);
  });

  test("year -> month -> day", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.zoomOut();
    calendar.model.zoomOut();
    calendar.model.next();
    calendar.selectItem(findItem(calendar, "2031"));
    calendar.selectItem(findItem(calendar, "July"));
    expect(calendar.model.zoom).toBe("day");
    expect(calendar.model.viewDate.getTime()).toBe(d(2031, 7, 1).getTime());
    expect(calendar.title).toBe("July 2031");
  });

  test("Selecting a month or a year does not change value", () => {
    const calendar = createCalendar({ value: d(2026, 11, 9) });
    let counter = 0;
    calendar.model.onValueChanged.add(() => counter++);
    calendar.model.zoom = "year";
    calendar.selectItem(findItem(calendar, "2020"));
    calendar.selectItem(findItem(calendar, "May"));
    expect(calendar.model.value.getTime()).toBe(d(2026, 11, 9).getTime());
    expect(counter).toBe(0);
  });

  test("Month and year items containing value are selected", () => {
    const calendar = createCalendar({ value: d(2026, 11, 9) });
    calendar.model.zoom = "month";
    expect(calendar.items.filter(item => item.isSelected).map(item => item.text)).toEqual(["November"]);
    calendar.model.next();
    expect(calendar.items.filter(item => item.isSelected)).toHaveLength(0);

    calendar.model.zoom = "year";
    expect(calendar.items.filter(item => item.isSelected).map(item => item.text)).toEqual(["2026"]);
    calendar.model.next();
    expect(calendar.items.filter(item => item.isSelected)).toHaveLength(0);
  });

  test("Month and year items containing today are marked as today", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const calendar = createCalendar();
    calendar.model.zoom = "month";
    expect(calendar.items.filter(item => item.isToday).map(item => item.text)).toEqual(["November"]);
    calendar.model.zoom = "year";
    expect(calendar.items.filter(item => item.isToday).map(item => item.text)).toEqual(["2026"]);
  });

  test("Hover in the month and year zooms", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.zoom = "month";
    calendar.hoverItem(findItem(calendar, "May"));
    expect(calendar.items.filter(item => item.isHovered).map(item => item.text)).toEqual(["May"]);
    calendar.model.zoom = "year";
    expect(calendar.items.filter(item => item.isHovered)).toHaveLength(0);
    calendar.hoverItem(findItem(calendar, "2020"));
    expect(calendar.items.filter(item => item.isHovered).map(item => item.text)).toEqual(["2020"]);
    calendar.hoverItem();
    expect(calendar.items.filter(item => item.isHovered)).toHaveLength(0);
  });

  test("Hover keeps the month and year items", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.model.zoom = "month";
    const monthItems = calendar.items.slice();
    const may = findItem(calendar, "May");
    const june = findItem(calendar, "June");
    calendar.hoverItem(may);
    calendar.hoverItem(june);
    calendar.items.forEach((item, index) => expect(item).toBe(monthItems[index]));
    expect(june.isHovered).toBe(true);
    expect(may.isHovered).toBe(false);
    expect(june.css.indexOf("sv-calendar__month--hovered")).toBeGreaterThan(-1);
    expect(may.css.indexOf("sv-calendar__month--hovered")).toBe(-1);

    calendar.model.zoom = "year";
    const yearItems = calendar.items.slice();
    const year2020 = findItem(calendar, "2020");
    const year2021 = findItem(calendar, "2021");
    calendar.hoverItem(year2020);
    calendar.hoverItem(year2021);
    calendar.items.forEach((item, index) => expect(item).toBe(yearItems[index]));
    expect(year2021.isHovered).toBe(true);
    expect(year2020.isHovered).toBe(false);
    expect(year2021.css.indexOf("sv-calendar__year--hovered")).toBeGreaterThan(-1);
    expect(year2020.css.indexOf("sv-calendar__year--hovered")).toBe(-1);
  });

  test("Month and year item css", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const calendar = createCalendar({ value: d(2026, 5, 20) });
    calendar.model.zoom = "month";
    expect(findItem(calendar, "January").css).toBe("sv-calendar__month");
    expect(findItem(calendar, "May").css).toBe("sv-calendar__month sv-calendar__month--selected");
    expect(findItem(calendar, "November").css).toBe("sv-calendar__month sv-calendar__month--today");
    calendar.model.zoom = "year";
    calendar.hoverItem(findItem(calendar, "2020"));
    expect(findItem(calendar, "2020").css).toBe("sv-calendar__year sv-calendar__year--hovered");
    expect(findItem(calendar, "2026").css).toBe("sv-calendar__year sv-calendar__year--today sv-calendar__year--selected");
  });

  test("onZoomChanged", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    const log: Array<string> = [];
    calendar.model.onZoomChanged.add((_, options) => log.push(options.zoom));
    calendar.model.zoomOut();
    calendar.model.zoomOut();
    calendar.selectItem(findItem(calendar, "2020"));
    calendar.selectItem(findItem(calendar, "May"));
    calendar.model.zoom = "day";
    expect(log).toEqual(["month", "year", "month", "day"]);
  });

  test("resetView returns to the day zoom of the value month", () => {
    const calendar = createCalendar({ value: d(2026, 11, 9) });
    calendar.model.zoom = "year";
    calendar.model.next();
    calendar.resetView();
    expect(calendar.model.zoom).toBe("day");
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
    expect(calendar.title).toBe("November 2026");
  });

  test("resetView without value returns to the current month", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const calendar = createCalendar({ viewDate: d(2020, 3, 1) });
    calendar.model.zoom = "month";
    calendar.resetView();
    expect(calendar.model.zoom).toBe("day");
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("resetView clears hover", () => {
    const calendar = createCalendar({ value: d(2026, 11, 9) });
    calendar.hoverItem(findDay(calendar, d(2026, 11, 12)));
    calendar.resetView();
    expect(days(calendar).filter(item => item.isHovered)).toHaveLength(0);
  });
});

describe("CalendarModel min and max", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  function findItem(calendar: CalendarViewModel, text: string): CalendarItem {
    return calendar.items.filter(item => item.text === text)[0];
  }
  function disabledTexts(items: Array<CalendarItem>): Array<string> {
    return items.filter(item => item.isDisabled).map(item => item.text);
  }

  test("min and max are passed in options and stored without time", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: new Date(2026, 10, 5, 13, 0), max: new Date(2026, 10, 20, 8, 0) });
    expect(calendar.model.min.getTime()).toBe(d(2026, 11, 5).getTime());
    expect(calendar.model.max.getTime()).toBe(d(2026, 11, 20).getTime());
  });

  test("A disabled day is not selected in the single mode", () => {
    const calendar = createCalendar({ value: d(2026, 11, 3), min: d(2026, 11, 5) });
    const day = findDay(calendar, d(2026, 11, 3));
    expect(day.isDisabled).toBe(true);
    expect(day.isSelected).toBe(false);
    expect(day.css).toBe("sv-calendar__day sv-calendar__day--disabled");
  });

  test("Days outside [min, max] are disabled", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2026, 11, 5), max: d(2026, 11, 20) });
    expect(findDay(calendar, d(2026, 11, 4)).isDisabled).toBe(true);
    expect(findDay(calendar, d(2026, 11, 5)).isDisabled).toBe(false);
    expect(findDay(calendar, d(2026, 11, 20)).isDisabled).toBe(false);
    expect(findDay(calendar, d(2026, 11, 21)).isDisabled).toBe(true);
    expect(findDay(calendar, d(2026, 10, 30), true).isDisabled).toBe(true);
    expect(days(calendar).filter(item => !item.isDisabled)).toHaveLength(16);
  });

  test("Only min", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2026, 11, 10) });
    expect(days(calendar).filter(item => item.isDisabled).map(item => item.date.getTime()))
      .toEqual(days(calendar).filter(item => item.date < d(2026, 11, 10)).map(item => item.date.getTime()));
    expect(findDay(calendar, d(2026, 12, 6), true).isDisabled).toBe(false);
  });

  test("Only max", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), max: d(2026, 11, 10) });
    expect(findDay(calendar, d(2026, 10, 26), true).isDisabled).toBe(false);
    expect(findDay(calendar, d(2026, 11, 10)).isDisabled).toBe(false);
    expect(findDay(calendar, d(2026, 11, 11)).isDisabled).toBe(true);
    expect(findDay(calendar, d(2026, 12, 6), true).isDisabled).toBe(true);
  });

  test("Months entirely outside [min, max] are disabled, partially available months are not", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2026, 3, 31), max: d(2026, 9, 1) });
    calendar.model.zoom = "month";
    expect(disabledTexts(calendar.items)).toEqual(["January", "February", "October", "November", "December"]);
    calendar.model.max = undefined;
    calendar.model.next();
    expect(calendar.title).toBe("2027");
    expect(disabledTexts(calendar.items)).toHaveLength(0);
    calendar.model.min = d(2028, 1, 1);
    expect(disabledTexts(calendar.items)).toHaveLength(12);
  });

  test("Clearing value updates items", () => {
    const calendar = createCalendar({ value: d(2026, 11, 9) });
    calendar.model.value = undefined;
    expect(days(calendar).filter(item => item.isSelected)).toHaveLength(0);
  });

  test("Years entirely outside [min, max] are disabled, partially available years are not", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2018, 12, 31), max: d(2024, 1, 1) });
    calendar.model.zoom = "year";
    expect(disabledTexts(calendar.items)).toEqual(["2016", "2017", "2025", "2026", "2027"]);
  });

  test("Disabled items cannot be selected", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2026, 11, 5), max: d(2027, 6, 30) });
    let counter = 0;
    calendar.model.onValueChanged.add(() => counter++);
    calendar.selectItem(findDay(calendar, d(2026, 11, 4)));
    expect(calendar.model.value).toBeUndefined();
    expect(counter).toBe(0);

    calendar.model.zoom = "month";
    expect(findItem(calendar, "October").isDisabled).toBe(true);
    calendar.selectItem(findItem(calendar, "October"));
    expect(calendar.model.zoom).toBe("month");
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());

    calendar.model.zoom = "year";
    expect(findItem(calendar, "2025").isDisabled).toBe(true);
    calendar.selectItem(findItem(calendar, "2025"));
    expect(calendar.model.zoom).toBe("year");
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("Disabled items cannot be hovered", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2026, 11, 5) });
    calendar.hoverItem(findDay(calendar, d(2026, 11, 4)));
    expect(days(calendar).filter(item => item.isHovered)).toHaveLength(0);

    calendar.hoverItem(findDay(calendar, d(2026, 11, 6)));
    calendar.model.min = d(2026, 11, 7);
    expect(findDay(calendar, d(2026, 11, 6)).isDisabled).toBe(true);
    expect(findDay(calendar, d(2026, 11, 6)).isHovered).toBe(false);
  });

  test("Disabled css", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2026, 11, 5), max: d(2026, 12, 31) });
    expect(findDay(calendar, d(2026, 11, 4)).css).toBe("sv-calendar__day sv-calendar__day--disabled");
    calendar.model.zoom = "month";
    expect(findItem(calendar, "October").css).toBe("sv-calendar__month sv-calendar__month--disabled");
    calendar.model.zoom = "year";
    expect(findItem(calendar, "2027").css).toBe("sv-calendar__year sv-calendar__year--disabled");
  });

  test("canPrev and canNext without min and max", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    expect(calendar.model.canPrev).toBe(true);
    expect(calendar.model.canNext).toBe(true);
  });

  test("canPrev and canNext in the day zoom", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2026, 10, 31), max: d(2026, 12, 1) });
    expect(calendar.model.canPrev).toBe(true);
    expect(calendar.model.canNext).toBe(true);
    calendar.model.prev();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 10, 1).getTime());
    expect(calendar.model.canPrev).toBe(false);
    calendar.model.prev();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 10, 1).getTime());

    calendar.model.next();
    calendar.model.next();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 12, 1).getTime());
    expect(calendar.model.canNext).toBe(false);
    calendar.model.next();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 12, 1).getTime());
  });

  test("canPrev and canNext in the month zoom", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2025, 12, 31), max: d(2027, 1, 1) });
    calendar.model.zoom = "month";
    expect(calendar.model.canPrev).toBe(true);
    expect(calendar.model.canNext).toBe(true);
    calendar.model.prev();
    expect(calendar.title).toBe("2025");
    expect(calendar.model.canPrev).toBe(false);
    calendar.model.prev();
    expect(calendar.title).toBe("2025");
    calendar.model.next();
    calendar.model.next();
    expect(calendar.title).toBe("2027");
    expect(calendar.model.canNext).toBe(false);
    calendar.model.next();
    expect(calendar.title).toBe("2027");
  });

  test("canPrev and canNext in the year zoom", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), min: d(2015, 12, 31), max: d(2028, 1, 1) });
    calendar.model.zoom = "year";
    expect(calendar.model.canPrev).toBe(true);
    expect(calendar.model.canNext).toBe(true);
    calendar.model.prev();
    expect(calendar.title).toBe("2004 \u2013 2015");
    expect(calendar.model.canPrev).toBe(false);
    calendar.model.prev();
    expect(calendar.title).toBe("2004 \u2013 2015");

    calendar.model.max = d(2027, 12, 31);
    calendar.model.next();
    expect(calendar.title).toBe("2016 \u2013 2027");
    expect(calendar.model.canNext).toBe(false);
    calendar.model.next();
    expect(calendar.title).toBe("2016 \u2013 2027");
  });

  test("resetView without value moves today into [min, max]", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const calendar = createCalendar({ min: d(2027, 3, 15) });
    expect(calendar.model.viewDate.getTime()).toBe(d(2027, 3, 1).getTime());
    calendar.model.prev();
    calendar.resetView();
    expect(calendar.model.viewDate.getTime()).toBe(d(2027, 3, 1).getTime());

    calendar.model.min = undefined;
    calendar.model.max = d(2025, 7, 4);
    calendar.resetView();
    expect(calendar.model.viewDate.getTime()).toBe(d(2025, 7, 1).getTime());

    calendar.model.max = d(2026, 12, 31);
    calendar.resetView();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("resetView with value uses the value month", () => {
    const calendar = createCalendar({ value: d(2026, 11, 9), min: d(2027, 1, 1) });
    calendar.resetView();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("Changing min and max updates items", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    expect(days(calendar).filter(item => item.isDisabled)).toHaveLength(0);
    calendar.model.min = d(2026, 11, 10);
    expect(findDay(calendar, d(2026, 11, 9)).isDisabled).toBe(true);
    calendar.model.max = d(2026, 11, 20);
    expect(findDay(calendar, d(2026, 11, 21)).isDisabled).toBe(true);
    expect(calendar.model.canPrev).toBe(false);
    expect(calendar.model.canNext).toBe(false);

    calendar.model.zoom = "month";
    expect(disabledTexts(calendar.items)).toHaveLength(11);
    calendar.model.min = undefined;
    calendar.model.max = undefined;
    expect(disabledTexts(calendar.items)).toHaveLength(0);
    expect(calendar.model.canPrev).toBe(true);
    expect(calendar.model.canNext).toBe(true);
  });
});

describe("CalendarModel range", () => {
  function rangeDay(calendar: CalendarViewModel, date: Date, monthIndex: number = 0): CalendarItem {
    return calendar.months[monthIndex].days.filter(item => item.date.getTime() === date.getTime() && !item.isOutside)[0];
  }
  function rangeDayAnywhere(calendar: CalendarViewModel, date: Date): CalendarItem {
    return rangeDay(calendar, date, 0) || rangeDay(calendar, date, 1);
  }
  function positions(calendar: CalendarViewModel, monthIndex: number = 0): { [day: string]: string } {
    const res: { [day: string]: string } = {};
    calendar.months[monthIndex].days.forEach(item => {
      if (!item.isOutside && !!item.rangePosition) res[item.text] = item.rangePosition;
    });
    return res;
  }
  function dates(value: Array<Date>): Array<number> {
    return value.map(date => date.getTime());
  }

  test("range is false by default", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    expect(calendar.model.range).toBe(false);
    expect(calendar.months).toHaveLength(1);
    expect(days(calendar).every(item => item.rangePosition === undefined)).toBe(true);
  });

  test("The day zoom shows two months", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    expect(calendar.months).toHaveLength(2);
    expect(calendar.months[0].title).toBe("November 2026");
    expect(calendar.months[1].title).toBe("December 2026");
    expect(calendar.months[1].days.length % 7).toBe(0);
    expect(calendar.months[1].days.length).toBeLessThanOrEqual(42);
    expect(calendar.title).toBe("November 2026");
  });

  test("prev and next shift the pair of months by one month", () => {
    const calendar = createCalendar({ viewDate: d(2026, 12, 1), range: true });
    calendar.model.next();
    expect(calendar.months.map(month => month.title)).toEqual(["January 2027", "February 2027"]);
    calendar.model.prev();
    calendar.model.prev();
    expect(calendar.months.map(month => month.title)).toEqual(["November 2026", "December 2026"]);
  });

  test("canNext takes the second month into account", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true, min: d(2026, 11, 1), max: d(2026, 12, 15) });
    expect(calendar.model.canPrev).toBe(false);
    expect(calendar.model.canNext).toBe(false);
    calendar.model.max = d(2027, 1, 1);
    expect(calendar.model.canNext).toBe(true);
    calendar.model.next();
    expect(calendar.months.map(month => month.title)).toEqual(["December 2026", "January 2027"]);
    expect(calendar.model.canNext).toBe(false);
    expect(calendar.model.canPrev).toBe(true);
  });

  test("The zoom is always day in the range mode", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    const zooms: Array<string> = [];
    calendar.model.onZoomChanged.add((_, options) => zooms.push(options.zoom));
    calendar.model.zoomOut();
    expect(calendar.model.zoom).toBe("day");
    calendar.model.zoom = "year";
    expect(calendar.model.zoom).toBe("day");
    expect(calendar.months).toHaveLength(2);
    expect(calendar.items).toHaveLength(0);
    expect(zooms).toEqual([]);

    calendar.model.range = false;
    calendar.model.zoomOut();
    expect(calendar.model.zoom).toBe("month");
    calendar.model.range = true;
    expect(calendar.model.zoom).toBe("day");
    expect(calendar.months.map(month => month.title)).toEqual(["November 2026", "December 2026"]);
  });

  test("The range mode shows the current month and the next one by default", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 11, 9, 15, 30));
    const calendar = createCalendar({ range: true });
    expect(calendar.months.map(month => month.title)).toEqual(["December 2026", "January 2027"]);
    calendar.model.next();
    expect(calendar.months.map(month => month.title)).toEqual(["January 2027", "February 2027"]);
    calendar.resetView();
    expect(calendar.months.map(month => month.title)).toEqual(["December 2026", "January 2027"]);
    vi.useRealTimers();
  });

  test("The first click sets rangeStart", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    const starts: Array<Date> = [];
    let valueChanged = 0;
    calendar.model.onRangeStartSelected.add((_, options) => starts.push(options.date));
    calendar.model.onValueChanged.add(() => valueChanged++);

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    expect(calendar.model.rangeStart.getTime()).toBe(d(2026, 11, 5).getTime());
    expect(calendar.model.value).toBeUndefined();
    expect(dates(starts)).toEqual([d(2026, 11, 5).getTime()]);
    expect(valueChanged).toBe(0);
    expect(positions(calendar)).toEqual({ "5": "single" });
    expect(rangeDay(calendar, d(2026, 11, 5)).isSelected).toBe(true);
  });

  test("Hover previews the range from rangeStart", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 8)));
    expect(positions(calendar)).toEqual({ "5": "start", "6": "middle", "7": "middle", "8": "end" });
    expect(rangeDay(calendar, d(2026, 11, 8)).isHovered).toBe(true);

    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 3)));
    expect(positions(calendar)).toEqual({ "3": "start", "4": "middle", "5": "end" });

    calendar.hoverItem();
    expect(positions(calendar)).toEqual({ "5": "single" });
  });

  test("isInRange marks the days of the committed range and of the range being selected", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true, value: [d(2026, 11, 5), d(2026, 11, 7)] });
    const inRange = () => calendar.months[0].days.filter(item => item.isInRange).map(item => item.text);
    expect(inRange()).toEqual(["5", "6", "7"]);
    expect(rangeDay(calendar, d(2026, 11, 6)).css).toBe("sv-calendar__day sv-calendar__day--selected sv-calendar__day--in-range sv-calendar__day--range-middle");
    expect(rangeDay(calendar, d(2026, 11, 8)).isInRange).toBe(false);

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 10)));
    expect(inRange()).toEqual(["10"]);
    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 13)));
    expect(inRange()).toEqual(["10", "11", "12", "13"]);
    expect(rangeDay(calendar, d(2026, 11, 11)).css.indexOf("sv-calendar__day--in-range") > -1).toBe(true);
  });

  test("isInRange is false in the single mode", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), value: d(2026, 11, 5) });
    expect(days(calendar).every(item => !item.isInRange)).toBe(true);
  });

  test("Hover without rangeStart shows no preview", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 8)));
    expect(positions(calendar)).toEqual({});
  });

  test("The second click sets the end and commits the value", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    const values: Array<Array<Date>> = [];
    calendar.model.onValueChanged.add((_, options) => values.push(options.value));
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 7)));
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 7)));

    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 7).getTime()]);
    expect(calendar.model.rangeStart).toBeUndefined();
    expect(values).toHaveLength(1);
    expect(dates(values[0])).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 7).getTime()]);
    expect(positions(calendar)).toEqual({ "5": "start", "6": "middle", "7": "end" });
    expect(calendar.months[0].days.filter(item => !item.isOutside && item.isSelected).map(item => item.text)).toEqual(["5", "6", "7"]);
  });

  test("The end before the start swaps them", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 12)));
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 12).getTime()]);
  });

  test("Clicking the same day twice gives a one-day range", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 5).getTime()]);
    expect(calendar.model.rangeStart).toBeUndefined();
    expect(positions(calendar)).toEqual({ "5": "single" });
  });

  test("A click with a committed range starts a new selection", () => {
    const calendar = createCalendar({ value: [d(2026, 11, 5), d(2026, 11, 12)], range: true });
    let valueChanged = 0;
    calendar.model.onValueChanged.add(() => valueChanged++);
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 20)));
    expect(calendar.model.rangeStart.getTime()).toBe(d(2026, 11, 20).getTime());
    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 12).getTime()]);
    expect(valueChanged).toBe(0);
    expect(positions(calendar)).toEqual({ "20": "single" });

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 25)));
    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 20).getTime(), d(2026, 11, 25).getTime()]);
    expect(valueChanged).toBe(1);
  });

  test("A range across the month boundary", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 27)));
    calendar.hoverItem(rangeDay(calendar, d(2026, 12, 2), 1));
    expect(positions(calendar, 0)).toEqual({ "27": "start", "28": "middle", "29": "middle", "30": "middle" });
    expect(positions(calendar, 1)).toEqual({ "1": "middle", "2": "end" });

    calendar.selectItem(rangeDay(calendar, d(2026, 12, 3), 1));
    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 27).getTime(), d(2026, 12, 3).getTime()]);
    expect(positions(calendar, 0)).toEqual({ "27": "start", "28": "middle", "29": "middle", "30": "middle" });
    expect(positions(calendar, 1)).toEqual({ "1": "middle", "2": "middle", "3": "end" });
  });

  test("Days of neighbour months are hidden when two months are shown", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true, value: [d(2026, 11, 20), d(2026, 12, 10)] });
    calendar.months.forEach(month => {
      expect(month.days.length % 7).toBe(0);
      expect(month.days.slice(-7).some(item => !item.isHidden)).toBe(true);
      const outside = month.days.filter(item => item.isOutside);
      expect(outside.length > 0).toBe(true);
      expect(outside.every(item => item.isHidden && item.text === "" && !item.isSelected && !item.rangePosition)).toBe(true);
      expect(outside.every(item => item.css.indexOf("sv-calendar__day--hidden") > -1)).toBe(true);
      expect(month.days.filter(item => !item.isOutside).every(item => !item.isHidden)).toBe(true);
    });
    expect(positions(calendar, 1)).toEqual({ "1": "middle", "2": "middle", "3": "middle", "4": "middle", "5": "middle",
      "6": "middle", "7": "middle", "8": "middle", "9": "middle", "10": "end" });
  });

  test("A hidden day cannot be selected or hovered", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    const hidden = calendar.months[0].days.filter(item => item.isHidden)[0];
    calendar.selectItem(hidden);
    expect(calendar.model.rangeStart).toBeUndefined();

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 8)));
    calendar.hoverItem(hidden);
    expect(positions(calendar)).toEqual({ "5": "start", "6": "middle", "7": "middle", "8": "end" });
  });

  test("Days of neighbour months are not hidden with one month", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    expect(days(calendar).every(item => !item.isHidden)).toBe(true);
    expect(days(calendar)[0].text).toBe("26");
  });

  test("Disabled days are not part of the range, the range is clipped by min and max", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true, min: d(2026, 11, 5), max: d(2026, 11, 20) });
    calendar.model.value = [d(2026, 11, 2), d(2026, 11, 8)];
    const disabled = rangeDay(calendar, d(2026, 11, 3));
    expect(disabled.isDisabled).toBe(true);
    expect(disabled.isSelected).toBe(false);
    expect(disabled.isInRange).toBe(false);
    expect(disabled.rangePosition).toBeUndefined();
    expect(disabled.css).toBe("sv-calendar__day sv-calendar__day--disabled");
    expect(positions(calendar)).toEqual({ "5": "start", "6": "middle", "7": "middle", "8": "end" });

    calendar.model.value = [d(2026, 11, 18), d(2026, 11, 25)];
    expect(positions(calendar)).toEqual({ "18": "start", "19": "middle", "20": "end" });

    calendar.model.value = [d(2026, 11, 1), d(2026, 11, 3)];
    expect(positions(calendar)).toEqual({});
  });

  test("A disabled month or year is not selected", () => {
    const calendar = createCalendar({ value: d(2026, 3, 10), min: d(2026, 6, 1) });
    calendar.model.zoom = "month";
    const march = calendar.items.filter(item => item.text === "March")[0];
    expect(march.isDisabled).toBe(true);
    expect(march.isSelected).toBe(false);
  });

  test("A disabled day cannot be a range boundary", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true, min: d(2026, 11, 5), max: d(2026, 11, 20) });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 4)));
    expect(calendar.model.rangeStart).toBeUndefined();

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 21)));
    expect(positions(calendar)).toEqual({ "5": "single" });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 21)));
    expect(calendar.model.value).toBeUndefined();
    expect(calendar.model.rangeStart.getTime()).toBe(d(2026, 11, 5).getTime());

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 20)));
    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 20).getTime()]);
  });

  test("resetView keeps rangeStart and shows its month", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 12, 10), 1));
    calendar.model.next();
    calendar.model.next();
    calendar.resetView();
    expect(calendar.model.zoom).toBe("day");
    expect(calendar.model.rangeStart.getTime()).toBe(d(2026, 12, 10).getTime());
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 12, 1).getTime());
    expect(positions(calendar)).toEqual({ "10": "single" });
  });

  test("resetView shows the month of the range start", () => {
    const calendar = createCalendar({ value: [d(2026, 11, 25), d(2027, 1, 5)], range: true });
    calendar.model.next();
    calendar.model.next();
    calendar.resetView();
    expect(calendar.model.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("setRangeStart sets the pending start from outside", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    let counter = 0;
    calendar.model.onRangeStartSelected.add(() => counter++);
    calendar.model.setRangeStart(new Date(2026, 10, 7, 12, 30));
    expect(calendar.model.rangeStart.getTime()).toBe(d(2026, 11, 7).getTime());
    expect(positions(calendar)).toEqual({ "7": "single" });
    expect(counter).toBe(0);

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 9)));
    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 7).getTime(), d(2026, 11, 9).getTime()]);

    calendar.model.setRangeStart(d(2026, 11, 15));
    calendar.model.setRangeStart(undefined);
    expect(calendar.model.rangeStart).toBeUndefined();
    expect(positions(calendar)).toEqual({ "7": "start", "8": "middle", "9": "end" });
  });

  test("A range value is normalized", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    calendar.model.value = [new Date(2026, 11, 3, 10, 0), new Date(2026, 10, 25, 22, 0)];
    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 25).getTime(), d(2026, 12, 3).getTime()]);
    calendar.model.value = d(2026, 11, 9);
    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 9).getTime(), d(2026, 11, 9).getTime()]);
  });

  test("Switching range converts the value and clears rangeStart", () => {
    const calendar = createCalendar({ value: d(2026, 11, 9) });
    calendar.model.range = true;
    expect(dates(calendar.model.value)).toEqual([d(2026, 11, 9).getTime(), d(2026, 11, 9).getTime()]);
    expect(calendar.months).toHaveLength(2);
    calendar.selectItem(rangeDayAnywhere(calendar, d(2026, 11, 20)));
    calendar.model.range = false;
    expect(calendar.model.rangeStart).toBeUndefined();
    expect(calendar.model.value.getTime()).toBe(d(2026, 11, 9).getTime());
    expect(calendar.months).toHaveLength(1);
    expect(days(calendar).every(item => item.rangePosition === undefined)).toBe(true);
  });

  test("onSelectionCompleted fires when the range end is selected, even if the range is the same", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1), range: true });
    let count = 0;
    calendar.model.onSelectionCompleted.add(() => count++);
    calendar.selectItem(findDay(calendar, d(2026, 11, 5)));
    expect(count).toBe(0);
    calendar.selectItem(findDay(calendar, d(2026, 11, 10)));
    expect(count).toBe(1);
    calendar.selectItem(findDay(calendar, d(2026, 11, 5)));
    calendar.selectItem(findDay(calendar, d(2026, 11, 10)));
    expect(count).toBe(2);
  });

  test("Single mode ignores rangeStart", () => {
    const calendar = createCalendar({ viewDate: d(2026, 11, 1) });
    calendar.selectItem(findDay(calendar, d(2026, 11, 5)));
    expect(calendar.model.rangeStart).toBeUndefined();
    expect(calendar.model.value.getTime()).toBe(d(2026, 11, 5).getTime());
  });
});
