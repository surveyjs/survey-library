import { CalendarModel } from "../src/calendar/calendar";
import { CalendarItem } from "../src/calendar/interfaces";

import { describe, test, expect, vi, afterEach } from "vitest";

function d(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}
function days(calendar: CalendarModel): Array<CalendarItem> {
  return calendar.months[0].days;
}
function findDay(calendar: CalendarModel, date: Date, isOutside: boolean = false): CalendarItem {
  return days(calendar).filter(item => item.date.getTime() === date.getTime() && !!item.isOutside === isOutside)[0];
}

describe("CalendarModel", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("Default state", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9, 15, 30));
    const calendar = new CalendarModel();
    expect(calendar.value).toBeUndefined();
    expect(calendar.firstDayOfWeek).toBe(1);
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
    expect(calendar.months).toHaveLength(1);
    expect(calendar.months[0].date.getTime()).toBe(d(2026, 11, 1).getTime());
    expect(calendar.months[0].title).toBe("November 2026");
  });

  test("viewDate comes from options, then from value, and is normalized to the first day of the month", () => {
    let calendar = new CalendarModel({ value: d(2025, 3, 17) });
    expect(calendar.viewDate.getTime()).toBe(d(2025, 3, 1).getTime());

    calendar = new CalendarModel({ value: d(2025, 3, 17), viewDate: new Date(2024, 6, 20, 10, 15) });
    expect(calendar.viewDate.getTime()).toBe(d(2024, 7, 1).getTime());
    expect(calendar.value.getTime()).toBe(d(2025, 3, 17).getTime());
  });

  test("value is stored without time", () => {
    const calendar = new CalendarModel({ value: new Date(2025, 2, 17, 23, 59) });
    expect(calendar.value.getTime()).toBe(d(2025, 3, 17).getTime());
  });

  test("weekDays start from Monday", () => {
    const calendar = new CalendarModel();
    expect(calendar.weekDays).toEqual(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]);
  });

  test("weekDays and the grid follow firstDayOfWeek", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.firstDayOfWeek = 0;
    expect(calendar.weekDays).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
    // November 1, 2026 is a Sunday
    expect(days(calendar)[0].date.getTime()).toBe(d(2026, 11, 1).getTime());
    expect(days(calendar)[0].isOutside).toBe(false);
  });

  test("The grid always has 42 days", () => {
    [d(2026, 11, 1), d(2024, 2, 1), d(2023, 2, 1), d(2021, 2, 1), d(2026, 6, 1), d(2025, 8, 1)].forEach(viewDate => {
      const calendar = new CalendarModel({ viewDate: viewDate });
      expect(days(calendar), viewDate.toDateString()).toHaveLength(42);
    });
  });

  test("Grid of November 2026", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
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
    const calendar = new CalendarModel({ viewDate: d(2026, 6, 1) });
    const items = days(calendar);
    expect(items[0].date.getTime()).toBe(d(2026, 6, 1).getTime());
    expect(items[0].isOutside).toBe(false);
    expect(items.filter(item => !item.isOutside)).toHaveLength(30);
    expect(items[30].date.getTime()).toBe(d(2026, 7, 1).getTime());
    expect(items[30].isOutside).toBe(true);
  });

  test("Grid of February in a leap year", () => {
    // February 1, 2024 is a Thursday
    const calendar = new CalendarModel({ viewDate: d(2024, 2, 1) });
    const items = days(calendar);
    expect(items[0].date.getTime()).toBe(d(2024, 1, 29).getTime());
    const inside = items.filter(item => !item.isOutside);
    expect(inside).toHaveLength(29);
    expect(inside[28].date.getTime()).toBe(d(2024, 2, 29).getTime());
  });

  test("Grid of February in a non-leap year", () => {
    // February 1, 2023 is a Wednesday
    const calendar = new CalendarModel({ viewDate: d(2023, 2, 1) });
    const items = days(calendar);
    expect(items[0].date.getTime()).toBe(d(2023, 1, 30).getTime());
    const inside = items.filter(item => !item.isOutside);
    expect(inside).toHaveLength(28);
    expect(inside[27].date.getTime()).toBe(d(2023, 2, 28).getTime());
    expect(items[41].date.getTime()).toBe(d(2023, 3, 12).getTime());
  });

  test("Grid of February that fits into four weeks", () => {
    // February 1, 2021 is a Monday and the month has 28 days: two full weeks of March follow it
    const calendar = new CalendarModel({ viewDate: d(2021, 2, 1) });
    const items = days(calendar);
    expect(items[0].date.getTime()).toBe(d(2021, 2, 1).getTime());
    expect(items.slice(0, 28).every(item => !item.isOutside)).toBe(true);
    expect(items.slice(28).every(item => item.isOutside)).toBe(true);
    expect(items[41].date.getTime()).toBe(d(2021, 3, 14).getTime());
  });

  test("isToday", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9, 15, 30));
    const calendar = new CalendarModel();
    const todayItems = days(calendar).filter(item => item.isToday);
    expect(todayItems).toHaveLength(1);
    expect(todayItems[0].date.getTime()).toBe(d(2026, 11, 9).getTime());
    calendar.next();
    expect(days(calendar).filter(item => item.isToday)).toHaveLength(0);
  });

  test("isDisabled is false for every day", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    expect(days(calendar).every(item => item.isDisabled === false)).toBe(true);
  });

  test("Selected day", () => {
    const calendar = new CalendarModel({ value: d(2026, 11, 9) });
    const selected = days(calendar).filter(item => item.isSelected);
    expect(selected).toHaveLength(1);
    expect(selected[0].date.getTime()).toBe(d(2026, 11, 9).getTime());
  });

  test("selectItem sets value and fires onValueChanged", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    const log: Array<Date> = [];
    calendar.onValueChanged.add((_, options) => log.push(options.value));

    calendar.selectItem(findDay(calendar, d(2026, 11, 9)));
    expect(calendar.value.getTime()).toBe(d(2026, 11, 9).getTime());
    expect(findDay(calendar, d(2026, 11, 9)).isSelected).toBe(true);
    expect(log).toHaveLength(1);
    expect(log[0].getTime()).toBe(d(2026, 11, 9).getTime());

    calendar.selectItem(findDay(calendar, d(2026, 11, 20)));
    expect(findDay(calendar, d(2026, 11, 9)).isSelected).toBe(false);
    expect(findDay(calendar, d(2026, 11, 20)).isSelected).toBe(true);
    expect(log).toHaveLength(2);
  });

  test("Selecting the selected day again does not fire onValueChanged", () => {
    const calendar = new CalendarModel({ value: d(2026, 11, 9) });
    let counter = 0;
    calendar.onValueChanged.add(() => counter++);
    calendar.selectItem(findDay(calendar, d(2026, 11, 9)));
    expect(counter).toBe(0);
  });

  test("Setting value programmatically does not fire onValueChanged", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    let counter = 0;
    calendar.onValueChanged.add(() => counter++);
    calendar.value = d(2026, 11, 15);
    expect(findDay(calendar, d(2026, 11, 15)).isSelected).toBe(true);
    expect(counter).toBe(0);
  });

  test("Selecting an outside day switches the month", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.selectItem(findDay(calendar, d(2026, 10, 28), true));
    expect(calendar.value.getTime()).toBe(d(2026, 10, 28).getTime());
    expect(calendar.viewDate.getTime()).toBe(d(2026, 10, 1).getTime());
    expect(calendar.months[0].title).toBe("October 2026");
    expect(findDay(calendar, d(2026, 10, 28)).isSelected).toBe(true);

    calendar.selectItem(findDay(calendar, d(2026, 11, 3), true));
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("hoverItem", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
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

  test("Hovering an outside day hovers only that cell", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.hoverItem(findDay(calendar, d(2026, 10, 30), true));
    const hovered = days(calendar).filter(item => item.isHovered);
    expect(hovered).toHaveLength(1);
    expect(hovered[0].isOutside).toBe(true);
  });

  test("prev and next switch the month", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.next();
    expect(calendar.viewDate.getTime()).toBe(d(2026, 12, 1).getTime());
    expect(calendar.months[0].title).toBe("December 2026");
    calendar.prev();
    calendar.prev();
    expect(calendar.viewDate.getTime()).toBe(d(2026, 10, 1).getTime());
    expect(calendar.months[0].title).toBe("October 2026");
  });

  test("prev and next cross the year boundary", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 12, 1) });
    calendar.next();
    expect(calendar.viewDate.getTime()).toBe(d(2027, 1, 1).getTime());
    expect(calendar.months[0].title).toBe("January 2027");
    calendar.prev();
    calendar.prev();
    calendar.prev();
    expect(calendar.viewDate.getTime()).toBe(d(2026, 10, 1).getTime());

    const january = new CalendarModel({ viewDate: d(2026, 1, 1) });
    january.prev();
    expect(january.viewDate.getTime()).toBe(d(2025, 12, 1).getTime());
    expect(january.months[0].title).toBe("December 2025");
  });

  test("Navigation does not change value", () => {
    const calendar = new CalendarModel({ value: d(2026, 11, 9) });
    calendar.next();
    expect(calendar.value.getTime()).toBe(d(2026, 11, 9).getTime());
    expect(days(calendar).filter(item => item.isSelected)).toHaveLength(0);
    calendar.prev();
    expect(findDay(calendar, d(2026, 11, 9)).isSelected).toBe(true);
  });

  test("Item css reflects the item state", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const calendar = new CalendarModel({ value: d(2026, 11, 20) });
    calendar.hoverItem(findDay(calendar, d(2026, 11, 12)));
    expect(findDay(calendar, d(2026, 11, 5)).css).toBe("sv-calendar__day");
    expect(findDay(calendar, d(2026, 11, 9)).css).toBe("sv-calendar__day sv-calendar__day--today");
    expect(findDay(calendar, d(2026, 11, 20)).css).toBe("sv-calendar__day sv-calendar__day--selected");
    expect(findDay(calendar, d(2026, 11, 12)).css).toBe("sv-calendar__day sv-calendar__day--hovered");
    expect(findDay(calendar, d(2026, 10, 26), true).css).toBe("sv-calendar__day sv-calendar__day--outside");
  });

  test("onSelectionCompleted fires on every day selection, even if the value is the same", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    const completed: Array<Date> = [];
    let changedCount = 0;
    calendar.onSelectionCompleted.add((_, options) => completed.push(options.value));
    calendar.onValueChanged.add(() => changedCount++);
    calendar.selectItem(findDay(calendar, d(2026, 11, 5)));
    calendar.selectItem(findDay(calendar, d(2026, 11, 5)));
    expect(completed.map(date => date.getTime())).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 5).getTime()]);
    expect(changedCount).toBe(1);
  });

  test("onSelectionCompleted does not fire when the zoom changes", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    let count = 0;
    calendar.onSelectionCompleted.add(() => count++);
    calendar.zoom = "month";
    calendar.selectItem(calendar.items[2]);
    calendar.zoom = "year";
    calendar.selectItem(calendar.items[2]);
    expect(count).toBe(0);
  });
});

describe("CalendarModel zoom", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  function texts(calendar: CalendarModel): Array<string> {
    return calendar.items.map(item => item.text);
  }
  function findItem(calendar: CalendarModel, text: string): CalendarItem {
    return calendar.items.filter(item => item.text === text)[0];
  }

  test("zoom is day by default", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    expect(calendar.zoom).toBe("day");
    expect(calendar.title).toBe("November 2026");
    expect(calendar.months).toHaveLength(1);
    expect(calendar.items).toHaveLength(0);
  });

  test("zoomOut cycles day -> month -> year -> day", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.zoomOut();
    expect(calendar.zoom).toBe("month");
    calendar.zoomOut();
    expect(calendar.zoom).toBe("year");
    calendar.zoomOut();
    expect(calendar.zoom).toBe("day");
    calendar.zoomOut();
    expect(calendar.zoom).toBe("month");
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("Month zoom: title and items", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.zoomOut();
    expect(calendar.title).toBe("2026");
    expect(calendar.months).toHaveLength(0);
    expect(texts(calendar)).toEqual(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]);
    expect(calendar.items[0].date.getTime()).toBe(d(2026, 1, 1).getTime());
    expect(calendar.items[11].date.getTime()).toBe(d(2026, 12, 1).getTime());
    expect(calendar.items.every(item => !item.isOutside && !item.isDisabled)).toBe(true);
  });

  test("Year zoom: title and items", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.zoomOut();
    calendar.zoomOut();
    expect(calendar.title).toBe("2016 \u2013 2027");
    expect(calendar.months).toHaveLength(0);
    expect(texts(calendar)).toEqual(["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027"]);
    expect(calendar.items[0].date.getTime()).toBe(d(2016, 1, 1).getTime());
    expect(calendar.items.every(item => !item.isOutside && !item.isDisabled)).toBe(true);
  });

  test("Year ranges are aligned to 12", () => {
    const check = (year: number, title: string) => {
      const calendar = new CalendarModel({ viewDate: d(year, 5, 1) });
      calendar.zoom = "year";
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
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.zoom = "month";
    calendar.next();
    expect(calendar.viewDate.getTime()).toBe(d(2027, 11, 1).getTime());
    expect(calendar.title).toBe("2027");
    expect(calendar.items[0].date.getTime()).toBe(d(2027, 1, 1).getTime());
    calendar.prev();
    calendar.prev();
    expect(calendar.title).toBe("2025");
  });

  test("prev and next in the year zoom switch the range by 12 years", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.zoom = "year";
    calendar.next();
    expect(calendar.title).toBe("2028 \u2013 2039");
    expect(texts(calendar)[0]).toBe("2028");
    calendar.prev();
    calendar.prev();
    expect(calendar.title).toBe("2004 \u2013 2015");
    expect(texts(calendar)[11]).toBe("2015");
  });

  test("Selecting a month switches to the day zoom of that month", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.zoom = "month";
    calendar.selectItem(findItem(calendar, "March"));
    expect(calendar.zoom).toBe("day");
    expect(calendar.viewDate.getTime()).toBe(d(2026, 3, 1).getTime());
    expect(calendar.title).toBe("March 2026");
    expect(calendar.months).toHaveLength(1);
    expect(calendar.items).toHaveLength(0);
  });

  test("Selecting a year switches to the month zoom of that year", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.zoom = "year";
    calendar.selectItem(findItem(calendar, "2019"));
    expect(calendar.zoom).toBe("month");
    expect(calendar.title).toBe("2019");
    expect(calendar.viewDate.getFullYear()).toBe(2019);
  });

  test("year -> month -> day", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.zoomOut();
    calendar.zoomOut();
    calendar.next();
    calendar.selectItem(findItem(calendar, "2031"));
    calendar.selectItem(findItem(calendar, "July"));
    expect(calendar.zoom).toBe("day");
    expect(calendar.viewDate.getTime()).toBe(d(2031, 7, 1).getTime());
    expect(calendar.title).toBe("July 2031");
  });

  test("Selecting a month or a year does not change value", () => {
    const calendar = new CalendarModel({ value: d(2026, 11, 9) });
    let counter = 0;
    calendar.onValueChanged.add(() => counter++);
    calendar.zoom = "year";
    calendar.selectItem(findItem(calendar, "2020"));
    calendar.selectItem(findItem(calendar, "May"));
    expect(calendar.value.getTime()).toBe(d(2026, 11, 9).getTime());
    expect(counter).toBe(0);
  });

  test("Month and year items containing value are selected", () => {
    const calendar = new CalendarModel({ value: d(2026, 11, 9) });
    calendar.zoom = "month";
    expect(calendar.items.filter(item => item.isSelected).map(item => item.text)).toEqual(["November"]);
    calendar.next();
    expect(calendar.items.filter(item => item.isSelected)).toHaveLength(0);

    calendar.zoom = "year";
    expect(calendar.items.filter(item => item.isSelected).map(item => item.text)).toEqual(["2026"]);
    calendar.next();
    expect(calendar.items.filter(item => item.isSelected)).toHaveLength(0);
  });

  test("Month and year items containing today are marked as today", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const calendar = new CalendarModel();
    calendar.zoom = "month";
    expect(calendar.items.filter(item => item.isToday).map(item => item.text)).toEqual(["November"]);
    calendar.zoom = "year";
    expect(calendar.items.filter(item => item.isToday).map(item => item.text)).toEqual(["2026"]);
  });

  test("Hover in the month and year zooms", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.zoom = "month";
    calendar.hoverItem(findItem(calendar, "May"));
    expect(calendar.items.filter(item => item.isHovered).map(item => item.text)).toEqual(["May"]);
    calendar.zoom = "year";
    expect(calendar.items.filter(item => item.isHovered)).toHaveLength(0);
    calendar.hoverItem(findItem(calendar, "2020"));
    expect(calendar.items.filter(item => item.isHovered).map(item => item.text)).toEqual(["2020"]);
    calendar.hoverItem();
    expect(calendar.items.filter(item => item.isHovered)).toHaveLength(0);
  });

  test("Month and year item css", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const calendar = new CalendarModel({ value: d(2026, 5, 20) });
    calendar.zoom = "month";
    expect(findItem(calendar, "January").css).toBe("sv-calendar__month");
    expect(findItem(calendar, "May").css).toBe("sv-calendar__month sv-calendar__month--selected");
    expect(findItem(calendar, "November").css).toBe("sv-calendar__month sv-calendar__month--today");
    calendar.zoom = "year";
    calendar.hoverItem(findItem(calendar, "2020"));
    expect(findItem(calendar, "2020").css).toBe("sv-calendar__year sv-calendar__year--hovered");
    expect(findItem(calendar, "2026").css).toBe("sv-calendar__year sv-calendar__year--today sv-calendar__year--selected");
  });

  test("onZoomChanged", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    const log: Array<string> = [];
    calendar.onZoomChanged.add((_, options) => log.push(options.zoom));
    calendar.zoomOut();
    calendar.zoomOut();
    calendar.selectItem(findItem(calendar, "2020"));
    calendar.selectItem(findItem(calendar, "May"));
    calendar.zoom = "day";
    expect(log).toEqual(["month", "year", "month", "day"]);
  });

  test("resetView returns to the day zoom of the value month", () => {
    const calendar = new CalendarModel({ value: d(2026, 11, 9) });
    calendar.zoom = "year";
    calendar.next();
    calendar.resetView();
    expect(calendar.zoom).toBe("day");
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
    expect(calendar.title).toBe("November 2026");
  });

  test("resetView without value returns to the current month", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const calendar = new CalendarModel({ viewDate: d(2020, 3, 1) });
    calendar.zoom = "month";
    calendar.resetView();
    expect(calendar.zoom).toBe("day");
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("resetView clears hover", () => {
    const calendar = new CalendarModel({ value: d(2026, 11, 9) });
    calendar.hoverItem(findDay(calendar, d(2026, 11, 12)));
    calendar.resetView();
    expect(days(calendar).filter(item => item.isHovered)).toHaveLength(0);
  });
});

describe("CalendarModel min and max", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  function findItem(calendar: CalendarModel, text: string): CalendarItem {
    return calendar.items.filter(item => item.text === text)[0];
  }
  function disabledTexts(items: Array<CalendarItem>): Array<string> {
    return items.filter(item => item.isDisabled).map(item => item.text);
  }

  test("min and max are passed in options and stored without time", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: new Date(2026, 10, 5, 13, 0), max: new Date(2026, 10, 20, 8, 0) });
    expect(calendar.min.getTime()).toBe(d(2026, 11, 5).getTime());
    expect(calendar.max.getTime()).toBe(d(2026, 11, 20).getTime());
  });

  test("Days outside [min, max] are disabled", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: d(2026, 11, 5), max: d(2026, 11, 20) });
    expect(findDay(calendar, d(2026, 11, 4)).isDisabled).toBe(true);
    expect(findDay(calendar, d(2026, 11, 5)).isDisabled).toBe(false);
    expect(findDay(calendar, d(2026, 11, 20)).isDisabled).toBe(false);
    expect(findDay(calendar, d(2026, 11, 21)).isDisabled).toBe(true);
    expect(findDay(calendar, d(2026, 10, 30), true).isDisabled).toBe(true);
    expect(days(calendar).filter(item => !item.isDisabled)).toHaveLength(16);
  });

  test("Only min", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: d(2026, 11, 10) });
    expect(days(calendar).filter(item => item.isDisabled).map(item => item.date.getTime()))
      .toEqual(days(calendar).filter(item => item.date < d(2026, 11, 10)).map(item => item.date.getTime()));
    expect(findDay(calendar, d(2026, 12, 6), true).isDisabled).toBe(false);
  });

  test("Only max", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), max: d(2026, 11, 10) });
    expect(findDay(calendar, d(2026, 10, 26), true).isDisabled).toBe(false);
    expect(findDay(calendar, d(2026, 11, 10)).isDisabled).toBe(false);
    expect(findDay(calendar, d(2026, 11, 11)).isDisabled).toBe(true);
    expect(findDay(calendar, d(2026, 12, 6), true).isDisabled).toBe(true);
  });

  test("Months entirely outside [min, max] are disabled, partially available months are not", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: d(2026, 3, 31), max: d(2026, 9, 1) });
    calendar.zoom = "month";
    expect(disabledTexts(calendar.items)).toEqual(["January", "February", "October", "November", "December"]);
    calendar.max = undefined;
    calendar.next();
    expect(calendar.title).toBe("2027");
    expect(disabledTexts(calendar.items)).toHaveLength(0);
    calendar.min = d(2028, 1, 1);
    expect(disabledTexts(calendar.items)).toHaveLength(12);
  });

  test("Clearing value updates items", () => {
    const calendar = new CalendarModel({ value: d(2026, 11, 9) });
    calendar.value = undefined;
    expect(days(calendar).filter(item => item.isSelected)).toHaveLength(0);
  });

  test("Years entirely outside [min, max] are disabled, partially available years are not", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: d(2018, 12, 31), max: d(2024, 1, 1) });
    calendar.zoom = "year";
    expect(disabledTexts(calendar.items)).toEqual(["2016", "2017", "2025", "2026", "2027"]);
  });

  test("Disabled items cannot be selected", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: d(2026, 11, 5), max: d(2027, 6, 30) });
    let counter = 0;
    calendar.onValueChanged.add(() => counter++);
    calendar.selectItem(findDay(calendar, d(2026, 11, 4)));
    expect(calendar.value).toBeUndefined();
    expect(counter).toBe(0);

    calendar.zoom = "month";
    expect(findItem(calendar, "October").isDisabled).toBe(true);
    calendar.selectItem(findItem(calendar, "October"));
    expect(calendar.zoom).toBe("month");
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());

    calendar.zoom = "year";
    expect(findItem(calendar, "2025").isDisabled).toBe(true);
    calendar.selectItem(findItem(calendar, "2025"));
    expect(calendar.zoom).toBe("year");
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("Disabled items cannot be hovered", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: d(2026, 11, 5) });
    calendar.hoverItem(findDay(calendar, d(2026, 11, 4)));
    expect(days(calendar).filter(item => item.isHovered)).toHaveLength(0);

    calendar.hoverItem(findDay(calendar, d(2026, 11, 6)));
    calendar.min = d(2026, 11, 7);
    expect(findDay(calendar, d(2026, 11, 6)).isDisabled).toBe(true);
    expect(findDay(calendar, d(2026, 11, 6)).isHovered).toBe(false);
  });

  test("Disabled css", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: d(2026, 11, 5), max: d(2026, 12, 31) });
    expect(findDay(calendar, d(2026, 11, 4)).css).toBe("sv-calendar__day sv-calendar__day--disabled");
    calendar.zoom = "month";
    expect(findItem(calendar, "October").css).toBe("sv-calendar__month sv-calendar__month--disabled");
    calendar.zoom = "year";
    expect(findItem(calendar, "2027").css).toBe("sv-calendar__year sv-calendar__year--disabled");
  });

  test("canPrev and canNext without min and max", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    expect(calendar.canPrev).toBe(true);
    expect(calendar.canNext).toBe(true);
  });

  test("canPrev and canNext in the day zoom", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: d(2026, 10, 31), max: d(2026, 12, 1) });
    expect(calendar.canPrev).toBe(true);
    expect(calendar.canNext).toBe(true);
    calendar.prev();
    expect(calendar.viewDate.getTime()).toBe(d(2026, 10, 1).getTime());
    expect(calendar.canPrev).toBe(false);
    calendar.prev();
    expect(calendar.viewDate.getTime()).toBe(d(2026, 10, 1).getTime());

    calendar.next();
    calendar.next();
    expect(calendar.viewDate.getTime()).toBe(d(2026, 12, 1).getTime());
    expect(calendar.canNext).toBe(false);
    calendar.next();
    expect(calendar.viewDate.getTime()).toBe(d(2026, 12, 1).getTime());
  });

  test("canPrev and canNext in the month zoom", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: d(2025, 12, 31), max: d(2027, 1, 1) });
    calendar.zoom = "month";
    expect(calendar.canPrev).toBe(true);
    expect(calendar.canNext).toBe(true);
    calendar.prev();
    expect(calendar.title).toBe("2025");
    expect(calendar.canPrev).toBe(false);
    calendar.prev();
    expect(calendar.title).toBe("2025");
    calendar.next();
    calendar.next();
    expect(calendar.title).toBe("2027");
    expect(calendar.canNext).toBe(false);
    calendar.next();
    expect(calendar.title).toBe("2027");
  });

  test("canPrev and canNext in the year zoom", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), min: d(2015, 12, 31), max: d(2028, 1, 1) });
    calendar.zoom = "year";
    expect(calendar.canPrev).toBe(true);
    expect(calendar.canNext).toBe(true);
    calendar.prev();
    expect(calendar.title).toBe("2004 \u2013 2015");
    expect(calendar.canPrev).toBe(false);
    calendar.prev();
    expect(calendar.title).toBe("2004 \u2013 2015");

    calendar.max = d(2027, 12, 31);
    calendar.next();
    expect(calendar.title).toBe("2016 \u2013 2027");
    expect(calendar.canNext).toBe(false);
    calendar.next();
    expect(calendar.title).toBe("2016 \u2013 2027");
  });

  test("resetView without value moves today into [min, max]", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 9));
    const calendar = new CalendarModel({ min: d(2027, 3, 15) });
    expect(calendar.viewDate.getTime()).toBe(d(2027, 3, 1).getTime());
    calendar.prev();
    calendar.resetView();
    expect(calendar.viewDate.getTime()).toBe(d(2027, 3, 1).getTime());

    calendar.min = undefined;
    calendar.max = d(2025, 7, 4);
    calendar.resetView();
    expect(calendar.viewDate.getTime()).toBe(d(2025, 7, 1).getTime());

    calendar.max = d(2026, 12, 31);
    calendar.resetView();
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("resetView with value uses the value month", () => {
    const calendar = new CalendarModel({ value: d(2026, 11, 9), min: d(2027, 1, 1) });
    calendar.resetView();
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("Changing min and max updates items", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    expect(days(calendar).filter(item => item.isDisabled)).toHaveLength(0);
    calendar.min = d(2026, 11, 10);
    expect(findDay(calendar, d(2026, 11, 9)).isDisabled).toBe(true);
    calendar.max = d(2026, 11, 20);
    expect(findDay(calendar, d(2026, 11, 21)).isDisabled).toBe(true);
    expect(calendar.canPrev).toBe(false);
    expect(calendar.canNext).toBe(false);

    calendar.zoom = "month";
    expect(disabledTexts(calendar.items)).toHaveLength(11);
    calendar.min = undefined;
    calendar.max = undefined;
    expect(disabledTexts(calendar.items)).toHaveLength(0);
    expect(calendar.canPrev).toBe(true);
    expect(calendar.canNext).toBe(true);
  });
});

describe("CalendarModel range", () => {
  function rangeDay(calendar: CalendarModel, date: Date, monthIndex: number = 0): CalendarItem {
    return calendar.months[monthIndex].days.filter(item => item.date.getTime() === date.getTime() && !item.isOutside)[0];
  }
  function rangeDayAnywhere(calendar: CalendarModel, date: Date): CalendarItem {
    return rangeDay(calendar, date, 0) || rangeDay(calendar, date, 1);
  }
  function positions(calendar: CalendarModel, monthIndex: number = 0): { [day: string]: string } {
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
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    expect(calendar.range).toBe(false);
    expect(calendar.months).toHaveLength(1);
    expect(days(calendar).every(item => item.rangePosition === undefined)).toBe(true);
  });

  test("The day zoom shows two months", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    expect(calendar.months).toHaveLength(2);
    expect(calendar.months[0].title).toBe("November 2026");
    expect(calendar.months[1].title).toBe("December 2026");
    expect(calendar.months[1].days).toHaveLength(42);
    expect(calendar.title).toBe("November 2026");
  });

  test("prev and next shift the pair of months by one month", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 12, 1), range: true });
    calendar.next();
    expect(calendar.months.map(month => month.title)).toEqual(["January 2027", "February 2027"]);
    calendar.prev();
    calendar.prev();
    expect(calendar.months.map(month => month.title)).toEqual(["November 2026", "December 2026"]);
  });

  test("canNext takes the second month into account", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true, min: d(2026, 11, 1), max: d(2026, 12, 15) });
    expect(calendar.canPrev).toBe(false);
    expect(calendar.canNext).toBe(false);
    calendar.max = d(2027, 1, 1);
    expect(calendar.canNext).toBe(true);
    calendar.next();
    expect(calendar.months.map(month => month.title)).toEqual(["December 2026", "January 2027"]);
    expect(calendar.canNext).toBe(false);
    expect(calendar.canPrev).toBe(true);
  });

  test("The month and year zooms show one block", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    calendar.zoom = "month";
    expect(calendar.months).toHaveLength(0);
    expect(calendar.items).toHaveLength(12);
    calendar.zoom = "year";
    expect(calendar.months).toHaveLength(0);
    expect(calendar.items).toHaveLength(12);
    calendar.zoom = "day";
    expect(calendar.months).toHaveLength(2);
  });

  test("The first click sets rangeStart", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    const starts: Array<Date> = [];
    let valueChanged = 0;
    calendar.onRangeStartSelected.add((_, options) => starts.push(options.date));
    calendar.onValueChanged.add(() => valueChanged++);

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    expect(calendar.rangeStart.getTime()).toBe(d(2026, 11, 5).getTime());
    expect(calendar.value).toBeUndefined();
    expect(dates(starts)).toEqual([d(2026, 11, 5).getTime()]);
    expect(valueChanged).toBe(0);
    expect(positions(calendar)).toEqual({ "5": "single" });
    expect(rangeDay(calendar, d(2026, 11, 5)).isSelected).toBe(true);
  });

  test("Hover previews the range from rangeStart", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 8)));
    expect(positions(calendar)).toEqual({ "5": "start", "6": "middle", "7": "middle", "8": "end" });
    expect(rangeDay(calendar, d(2026, 11, 8)).isHovered).toBe(true);

    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 3)));
    expect(positions(calendar)).toEqual({ "3": "start", "4": "middle", "5": "end" });

    calendar.hoverItem();
    expect(positions(calendar)).toEqual({ "5": "single" });
  });

  test("Hover without rangeStart shows no preview", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 8)));
    expect(positions(calendar)).toEqual({});
  });

  test("The second click sets the end and commits the value", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    const values: Array<Array<Date>> = [];
    calendar.onValueChanged.add((_, options) => values.push(options.value));
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 7)));
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 7)));

    expect(dates(calendar.value)).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 7).getTime()]);
    expect(calendar.rangeStart).toBeUndefined();
    expect(values).toHaveLength(1);
    expect(dates(values[0])).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 7).getTime()]);
    expect(positions(calendar)).toEqual({ "5": "start", "6": "middle", "7": "end" });
    expect(calendar.months[0].days.filter(item => !item.isOutside && item.isSelected).map(item => item.text)).toEqual(["5", "6", "7"]);
  });

  test("The end before the start swaps them", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 12)));
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    expect(dates(calendar.value)).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 12).getTime()]);
  });

  test("Clicking the same day twice gives a one-day range", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    expect(dates(calendar.value)).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 5).getTime()]);
    expect(calendar.rangeStart).toBeUndefined();
    expect(positions(calendar)).toEqual({ "5": "single" });
  });

  test("A click with a committed range starts a new selection", () => {
    const calendar = new CalendarModel({ value: [d(2026, 11, 5), d(2026, 11, 12)], range: true });
    let valueChanged = 0;
    calendar.onValueChanged.add(() => valueChanged++);
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 20)));
    expect(calendar.rangeStart.getTime()).toBe(d(2026, 11, 20).getTime());
    expect(dates(calendar.value)).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 12).getTime()]);
    expect(valueChanged).toBe(0);
    expect(positions(calendar)).toEqual({ "20": "single" });

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 25)));
    expect(dates(calendar.value)).toEqual([d(2026, 11, 20).getTime(), d(2026, 11, 25).getTime()]);
    expect(valueChanged).toBe(1);
  });

  test("A range across the month boundary", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 27)));
    calendar.hoverItem(rangeDay(calendar, d(2026, 12, 2), 1));
    expect(positions(calendar, 0)).toEqual({ "27": "start", "28": "middle", "29": "middle", "30": "middle" });
    expect(positions(calendar, 1)).toEqual({ "1": "middle", "2": "end" });

    calendar.selectItem(rangeDay(calendar, d(2026, 12, 3), 1));
    expect(dates(calendar.value)).toEqual([d(2026, 11, 27).getTime(), d(2026, 12, 3).getTime()]);
    expect(positions(calendar, 0)).toEqual({ "27": "start", "28": "middle", "29": "middle", "30": "middle" });
    expect(positions(calendar, 1)).toEqual({ "1": "middle", "2": "middle", "3": "end" });
  });

  test("Clicking a day of a neighbour month does not move the months", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    const outside = calendar.months[0].days.filter(item => item.isOutside)[0];
    calendar.selectItem(outside);
    expect(calendar.rangeStart.getTime()).toBe(outside.date.getTime());
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("Disabled days inside the range are allowed", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true, min: d(2026, 11, 5) });
    calendar.value = [d(2026, 11, 2), d(2026, 11, 8)];
    expect(rangeDay(calendar, d(2026, 11, 3)).isDisabled).toBe(true);
    expect(rangeDay(calendar, d(2026, 11, 3)).rangePosition).toBe("middle");
  });

  test("A disabled day cannot be a range boundary", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true, min: d(2026, 11, 5), max: d(2026, 11, 20) });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 4)));
    expect(calendar.rangeStart).toBeUndefined();

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    calendar.hoverItem(rangeDay(calendar, d(2026, 11, 21)));
    expect(positions(calendar)).toEqual({ "5": "single" });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 21)));
    expect(calendar.value).toBeUndefined();
    expect(calendar.rangeStart.getTime()).toBe(d(2026, 11, 5).getTime());

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 20)));
    expect(dates(calendar.value)).toEqual([d(2026, 11, 5).getTime(), d(2026, 11, 20).getTime()]);
  });

  test("Month and year zooms only navigate in the range mode", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 11, 5)));
    calendar.zoom = "year";
    calendar.selectItem(calendar.items.filter(item => item.text === "2027")[0]);
    calendar.selectItem(calendar.items.filter(item => item.text === "March")[0]);
    expect(calendar.zoom).toBe("day");
    expect(calendar.rangeStart.getTime()).toBe(d(2026, 11, 5).getTime());
    expect(calendar.value).toBeUndefined();
    expect(calendar.months.map(month => month.title)).toEqual(["March 2027", "April 2027"]);

    calendar.selectItem(rangeDay(calendar, d(2027, 3, 10)));
    expect(dates(calendar.value)).toEqual([d(2026, 11, 5).getTime(), d(2027, 3, 10).getTime()]);
  });

  test("Month and year items containing the range are selected", () => {
    const calendar = new CalendarModel({ value: [d(2026, 11, 25), d(2027, 1, 5)], range: true });
    calendar.zoom = "month";
    expect(calendar.items.filter(item => item.isSelected).map(item => item.text)).toEqual(["November", "December"]);
    calendar.zoom = "year";
    expect(calendar.items.filter(item => item.isSelected).map(item => item.text)).toEqual(["2026", "2027"]);
  });

  test("resetView keeps rangeStart and shows its month", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    calendar.selectItem(rangeDay(calendar, d(2026, 12, 10), 1));
    calendar.next();
    calendar.next();
    calendar.zoom = "year";
    calendar.resetView();
    expect(calendar.zoom).toBe("day");
    expect(calendar.rangeStart.getTime()).toBe(d(2026, 12, 10).getTime());
    expect(calendar.viewDate.getTime()).toBe(d(2026, 12, 1).getTime());
    expect(positions(calendar)).toEqual({ "10": "single" });
  });

  test("resetView shows the month of the range start", () => {
    const calendar = new CalendarModel({ value: [d(2026, 11, 25), d(2027, 1, 5)], range: true });
    calendar.next();
    calendar.next();
    calendar.resetView();
    expect(calendar.viewDate.getTime()).toBe(d(2026, 11, 1).getTime());
  });

  test("setRangeStart sets the pending start from outside", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    let counter = 0;
    calendar.onRangeStartSelected.add(() => counter++);
    calendar.setRangeStart(new Date(2026, 10, 7, 12, 30));
    expect(calendar.rangeStart.getTime()).toBe(d(2026, 11, 7).getTime());
    expect(positions(calendar)).toEqual({ "7": "single" });
    expect(counter).toBe(0);

    calendar.selectItem(rangeDay(calendar, d(2026, 11, 9)));
    expect(dates(calendar.value)).toEqual([d(2026, 11, 7).getTime(), d(2026, 11, 9).getTime()]);

    calendar.setRangeStart(d(2026, 11, 15));
    calendar.setRangeStart(undefined);
    expect(calendar.rangeStart).toBeUndefined();
    expect(positions(calendar)).toEqual({ "7": "start", "8": "middle", "9": "end" });
  });

  test("A range value is normalized", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    calendar.value = [new Date(2026, 11, 3, 10, 0), new Date(2026, 10, 25, 22, 0)];
    expect(dates(calendar.value)).toEqual([d(2026, 11, 25).getTime(), d(2026, 12, 3).getTime()]);
    calendar.value = d(2026, 11, 9);
    expect(dates(calendar.value)).toEqual([d(2026, 11, 9).getTime(), d(2026, 11, 9).getTime()]);
  });

  test("Switching range converts the value and clears rangeStart", () => {
    const calendar = new CalendarModel({ value: d(2026, 11, 9) });
    calendar.range = true;
    expect(dates(calendar.value)).toEqual([d(2026, 11, 9).getTime(), d(2026, 11, 9).getTime()]);
    expect(calendar.months).toHaveLength(2);
    calendar.selectItem(rangeDayAnywhere(calendar, d(2026, 11, 20)));
    calendar.range = false;
    expect(calendar.rangeStart).toBeUndefined();
    expect(calendar.value.getTime()).toBe(d(2026, 11, 9).getTime());
    expect(calendar.months).toHaveLength(1);
    expect(days(calendar).every(item => item.rangePosition === undefined)).toBe(true);
  });

  test("onSelectionCompleted fires when the range end is selected, even if the range is the same", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1), range: true });
    let count = 0;
    calendar.onSelectionCompleted.add(() => count++);
    calendar.selectItem(findDay(calendar, d(2026, 11, 5)));
    expect(count).toBe(0);
    calendar.selectItem(findDay(calendar, d(2026, 11, 10)));
    expect(count).toBe(1);
    calendar.selectItem(findDay(calendar, d(2026, 11, 5)));
    calendar.selectItem(findDay(calendar, d(2026, 11, 10)));
    expect(count).toBe(2);
  });

  test("Single mode ignores rangeStart", () => {
    const calendar = new CalendarModel({ viewDate: d(2026, 11, 1) });
    calendar.selectItem(findDay(calendar, d(2026, 11, 5)));
    expect(calendar.rangeStart).toBeUndefined();
    expect(calendar.value.getTime()).toBe(d(2026, 11, 5).getTime());
  });
});
