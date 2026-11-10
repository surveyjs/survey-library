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
