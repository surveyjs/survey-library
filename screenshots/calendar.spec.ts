import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, resizeToMobile, loadSurveyLocales, baseTest as test, expect } from "../e2e/helper";
import type { Locator, Page } from "@playwright/test";
import {
  calendarDay, calendarRoot, calendarTitleButton, fixCalendarToday, openCalendar, popupContainer,
  rangeQuestion, singleDateQuestion, todayMonthKey, waitForMonthList
} from "../e2e/datetimepickerHelper";

const title = "calendar Screenshot";

async function shoot(page: Page, target: string | Locator, name: string): Promise<void> {
  await resetFocusToBody(page);
  await compareScreenshot(page, target, name, { animations: "disabled" });
}

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${url}${framework}`);
      await fixCalendarToday(page);
    });

    test("Check day zoom", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion());
      await openCalendar(page);
      await expect(calendarRoot(page).locator(".sv-calendar__day--today")).toHaveText("19");
      await shoot(page, calendarRoot(page), "calendar-day-zoom.png");
      await shoot(page, calendarRoot(page).locator(".sv-calendar__title"), "calendar-title-chevron.png");
    });

    test("Check selected day", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ defaultValue: "2026-11-09" }));
      await openCalendar(page);
      await expect(calendarDay(page, "9")).toHaveClass(/sv-calendar__day--selected/);
      await expect(calendarDay(page, "19")).toHaveClass(/sv-calendar__day--today/);
      await shoot(page, calendarRoot(page), "calendar-day-selected.png");
    });

    test("Check hovered day", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion());
      await openCalendar(page);
      await calendarDay(page, "11").hover();
      await expect(calendarDay(page, "11")).toHaveClass(/sv-calendar__day--hovered/);
      await shoot(page, calendarRoot(page), "calendar-day-hovered.png");
    });

    test("Check month and year zoom", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ defaultValue: "2026-03-09" }));
      await openCalendar(page);
      await calendarTitleButton(page).click();
      await expect(calendarRoot(page).locator(".sv-calendar__month--selected")).toHaveText("March");
      await expect(calendarRoot(page).locator(".sv-calendar__month--today")).toHaveText("November");
      await shoot(page, calendarRoot(page), "calendar-month-zoom.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = "2024-03-09";
      });
      await calendarTitleButton(page).click();
      await expect(calendarRoot(page).locator(".sv-calendar__year")).toHaveCount(12);
      await expect(calendarRoot(page).locator(".sv-calendar__year--selected")).toHaveText("2024");
      await expect(calendarRoot(page).locator(".sv-calendar__year--today")).toHaveText("2026");
      await shoot(page, calendarRoot(page), "calendar-year-zoom.png");
    });

    test("Check min and max", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ min: "2026-11-10", max: "2026-11-20" }));
      await openCalendar(page);
      await expect(calendarDay(page, "9")).toHaveClass(/sv-calendar__day--disabled/);
      await expect(calendarRoot(page).locator(".sv-calendar__nav-button button").first()).toBeDisabled();
      await shoot(page, calendarRoot(page), "calendar-min-max.png");
    });

    test("Check empty range calendar", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);
      await expect(calendarRoot(page).locator(".sv-calendar__month-title")).toHaveText(["November 2026", "December 2026"]);
      await expect(calendarRoot(page).locator(".sv-calendar__day--hidden").first()).toBeAttached();
      await shoot(page, calendarRoot(page), "calendar-range-empty.png");
    });

    test("Check range start and preview", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);
      await calendarDay(page, "9", undefined, todayMonthKey).click();
      await expect(calendarDay(page, "9", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-single/);
      await shoot(page, calendarRoot(page), "calendar-range-start.png");

      await calendarDay(page, "13", undefined, todayMonthKey).hover();
      await expect(calendarDay(page, "11", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--in-range/);
      await shoot(page, calendarRoot(page), "calendar-range-preview.png");
    });

    test("Check selected ranges", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion({ defaultValue: ["2026-11-09", "2026-11-13"] }));
      await openCalendar(page);
      await expect(calendarDay(page, "9", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-start/);
      await expect(calendarDay(page, "13", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-end/);
      await shoot(page, calendarRoot(page), "calendar-range-selected.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = ["2026-11-09", "2026-11-20"];
      });
      await expect(calendarDay(page, "15", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--in-range/);
      await shoot(page, calendarRoot(page), "calendar-range-multi-week.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = ["2026-11-09", "2026-11-09"];
      });
      await expect(calendarDay(page, "9", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-single/);
      await shoot(page, calendarRoot(page), "calendar-range-single.png");
    });

    test("Check a range across month edges", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion({ defaultValue: ["2022-04-30", "2022-06-01"] }));
      await openCalendar(page);
      await expect(calendarRoot(page).locator(".sv-calendar__month-title")).toHaveText(["April 2022", "May 2022"]);
      await expect(calendarDay(page, "30", undefined, "2022-3")).toHaveClass(/sv-calendar__day--range-start/);
      await shoot(page, calendarRoot(page), "calendar-range-month-edges.png");
    });

    test("Check range ends on the outer columns", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion({ defaultValue: ["2026-11-01", "2026-11-05"] }));
      await openCalendar(page);
      await expect(calendarDay(page, "1", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-start/);
      await shoot(page, calendarRoot(page), "calendar-range-start-sunday.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = ["2026-11-04", "2026-11-09"];
      });
      await expect(calendarDay(page, "9", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-end/);
      await shoot(page, calendarRoot(page), "calendar-range-end-monday.png");
    });

    test("Check a range clipped by min and max", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion({
        min: "2026-11-10",
        max: "2026-11-20",
        defaultValue: ["2026-11-05", "2026-11-25"]
      }));
      await openCalendar(page);
      await expect(calendarDay(page, "10", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--in-range/);
      await expect(calendarDay(page, "9", "disabled", todayMonthKey)).not.toHaveClass(/sv-calendar__day--in-range/);
      await shoot(page, calendarRoot(page), "calendar-range-disabled.png");
    });

    test("Check mobile single sheet", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({
        title: "Date",
        description: "Pick a single day."
      }));
      await resizeToMobile(page);
      await openCalendar(page);
      const sheet = page.locator(".sv-popup--sheet");
      await expect(sheet.locator(".sv-popup__body-header-title")).toHaveText("Date");
      await expect(sheet.locator(".sv-popup__body-footer").getByRole("button")).toHaveCount(1);
      await shoot(page, popupContainer(page), "calendar-mobile-single.png");

      await calendarDay(page, "9").click();
      await expect(calendarDay(page, "9")).toHaveClass(/sv-calendar__day--selected/);
      await shoot(page, popupContainer(page), "calendar-mobile-single-selected.png");
    });

    test("Check mobile range list", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion({
        title: "Trip dates",
        description: "Choose the start and the end."
      }));
      await resizeToMobile(page);
      await openCalendar(page);
      await waitForMonthList(page, todayMonthKey);
      await expect(calendarRoot(page)).toHaveClass(/sv-calendar--month-list/);
      await expect(page.locator(".sv-popup--sheet .sv-popup__body-footer").getByRole("button", { name: "Clear" })).toBeVisible();
      await shoot(page, popupContainer(page), "calendar-mobile-range-list.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = ["2026-11-25", "2026-12-03"];
      });
      await waitForMonthList(page, todayMonthKey);
      await expect(calendarDay(page, "25", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-start/);
      await shoot(page, popupContainer(page), "calendar-mobile-range-selected.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = ["2026-11-01", "2026-11-09"];
      });
      await waitForMonthList(page, todayMonthKey);
      await expect(calendarDay(page, "1", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-start/);
      await expect(calendarDay(page, "9", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-end/);
      await shoot(page, popupContainer(page), "calendar-mobile-range-start-edge.png");
    });

    test("Check rtl calendars", async ({ page }) => {
      await loadSurveyLocales(page, framework);
      await initSurvey(page, framework, Object.assign(singleDateQuestion({ defaultValue: "2026-11-09" }), { locale: "ar" }));
      await expect(page.locator(".sd-root-modern")).toHaveAttribute("dir", "rtl");
      await openCalendar(page);
      await expect(calendarDay(page, "9")).toHaveClass(/sv-calendar__day--selected/);
      await shoot(page, calendarRoot(page), "calendar-rtl.png");

      await page.keyboard.press("Escape");
      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("date");
        question.range = true;
        question.value = ["2026-11-09", "2026-11-13"];
      });
      await openCalendar(page);
      await expect(calendarRoot(page)).toHaveClass(/sv-calendar--range/);
      await shoot(page, calendarRoot(page), "calendar-range-rtl.png");
    });

    test("Check themed calendar", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ defaultValue: "2026-11-09" }));
      await page.evaluate(() => {
        (window as any).survey.applyTheme({
          cssVariables: {
            "--sjs2-layout-component-input-medium-content-padding-vertical": "30px",
            "--sjs2-layout-component-input-medium-content-padding-horizontal": "40px",
            "--sjs2-layout-component-formbox-medium-padding-vertical": "10px",
            "--sjs2-layout-component-formbox-medium-padding-horizontal": "20px",
            "--sjs2-color-bg-brand-primary": "#0b6e4f",
            "--sjs2-color-bg-brand-secondary": "#c6f0de",
            "--sjs2-color-border-brand-primary": "#0b6e4f"
          }
        });
      });
      await openCalendar(page);
      await expect(calendarDay(page, "9")).toHaveClass(/sv-calendar__day--selected/);
      await shoot(page, calendarRoot(page), "calendar-themed.png");
    });
  });
});
