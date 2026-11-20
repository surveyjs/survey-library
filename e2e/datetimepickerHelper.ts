import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

// November 19, 2026. Month index is 0-based, so the calendar key of this month is "2026-10".
export const fixedToday = new Date(2026, 10, 19);
export const todayMonthKey = "2026-10";
// 2026 sits in the 12-year block [2016, 2027].
export const yearRangeTitle = "2016 \u2013 2027";

// Freezes the calendar's "today" without stopping timers: the popup focuses itself on a timeout.
export async function fixCalendarToday(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as any).Survey.settings.onDateCreated = (date: Date, reason: string) => {
      return reason === "calendar-today" ? new Date(2026, 10, 19) : date;
    };
  });
}

export function calendarButton(page: Page): Locator {
  return page.getByRole("button", { name: "Open calendar" });
}

export function clearButton(page: Page): Locator {
  return page.getByRole("button", { name: "Clear", exact: true });
}

export function dateInput(page: Page): Locator {
  return page.locator(".sd-datetimepicker__input");
}

export function popupContainer(page: Page): Locator {
  return page.locator(".sv-popup__container").filter({ visible: true });
}

export function calendarRoot(page: Page): Locator {
  return popupContainer(page).locator(".sv-calendar");
}

// In-month days. Pass "outside" or "disabled" to require that modifier.
// monthKey limits the day to one month of a range ("2026-10" is November).
export function calendarDay(page: Page, text: string, modifier?: string, monthKey?: string): Locator {
  const scope = monthKey ? calendarRoot(page).locator("[data-month='" + monthKey + "']") : calendarRoot(page);
  const selector = modifier
    ? ".sv-calendar__day.sv-calendar__day--" + modifier
    : ".sv-calendar__day:not(.sv-calendar__day--outside):not(.sv-calendar__day--hidden)";
  return scope.locator(selector).filter({ hasText: new RegExp("^" + text + "$") });
}

export function calendarTitle(page: Page): Locator {
  return calendarRoot(page).locator(".sv-calendar__title .sd-action__title");
}

export function calendarTitleButton(page: Page): Locator {
  return calendarRoot(page).locator(".sv-calendar__title button");
}

export function navButton(page: Page, direction: "prev" | "next"): Locator {
  return calendarRoot(page).locator(".sv-calendar__nav-button button").nth(direction === "prev" ? 0 : 1);
}

export async function openCalendar(page: Page, index = 0): Promise<void> {
  await calendarButton(page).nth(index).click();
  await expect(calendarRoot(page)).toBeVisible();
}

export async function getDateValue(page: Page, name = "date"): Promise<any> {
  return page.evaluate((questionName) => {
    return (window as any).survey.getQuestionByName(questionName).value;
  }, name);
}

export function singleDateQuestion(props: any = {}): any {
  return {
    showQuestionNumbers: false,
    elements: [Object.assign({ type: "datetimepicker", name: "date", title: "Date" }, props)]
  };
}

export function rangeQuestion(props: any = {}): any {
  return singleDateQuestion(Object.assign({
    range: true,
    title: "Trip dates",
    startPlaceholder: "Start",
    endPlaceholder: "End"
  }, props));
}

export function dateField(page: Page, index = 0): Locator {
  return page.locator(".sd-datetimepicker__field").nth(index);
}

// Moves a desktop range until the first visible month title starts with the given month and year.
export async function showRangeMonth(page: Page, monthTitle: string): Promise<void> {
  const titles = calendarRoot(page).locator(".sv-calendar__month-title");
  for (let step = 0; step < 24; step++) {
    const current = (await titles.first().innerText()).trim();
    if (current.indexOf(monthTitle) === 0) return;
    const goingBack = new Date(current).getTime() > new Date(monthTitle + " 1").getTime();
    await navButton(page, goingBack ? "prev" : "next").click();
  }
  throw new Error("Calendar did not reach " + monthTitle);
}

export async function monthListOffset(page: Page, monthKey: string): Promise<number> {
  const anchorBox = await calendarRoot(page).locator("[data-month='" + monthKey + "']").boundingBox();
  const scrollerBox = await calendarRoot(page).locator(".sv-calendar__months").boundingBox();
  if (!anchorBox || !scrollerBox) return Number.NaN;
  return Math.round(anchorBox.y - scrollerBox.y);
}

// The month list aligns on the next frame, so wait until the offset stops changing.
export async function waitForMonthList(page: Page, monthKey: string): Promise<number> {
  let previous = Number.NaN;
  let settled = Number.NaN;
  await expect.poll(async () => {
    const offset = await monthListOffset(page, monthKey);
    const isStable = Number.isFinite(offset) && offset === previous;
    previous = offset;
    if (isStable) settled = offset;
    return isStable;
  }).toBe(true);
  return settled;
}

export async function scrollMonthList(page: Page, edge: "start" | "end"): Promise<void> {
  await calendarRoot(page).locator(".sv-calendar__months").evaluate((el, target) => {
    el.scrollTop = target === "start" ? 0 : el.scrollHeight;
    el.dispatchEvent(new Event("scroll"));
  }, edge);
}
