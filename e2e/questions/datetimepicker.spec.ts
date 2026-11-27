import { frameworks, url, initSurvey, loadSurveyLocales, resizeToDesktop, resizeToMobile, test, expect } from "../helper";
import {
  calendarButton, calendarDay, calendarRoot, calendarTitle, calendarTitleButton, clearButton,
  dateField, dateInput, fixCalendarToday, getDateValue, monthListOffset, navButton, openCalendar,
  popupContainer, rangeQuestion, scrollMonthList, showRangeMonth, singleDateQuestion, todayMonthKey,
  waitForMonthList, yearRangeTitle
} from "../datetimepickerHelper";

const title = "datetimepicker";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.describe.configure({ timeout: 40000 });
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await fixCalendarToday(page);
    });

    test("opens the calendar on the current month and marks today", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion());

      await expect(popupContainer(page)).toHaveCount(0);
      await openCalendar(page);

      await expect(calendarTitle(page)).toHaveText("November 2026");
      await expect(calendarRoot(page).locator(".sv-calendar__weekday")).toHaveText(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
      await expect(calendarRoot(page).locator("[data-month='" + todayMonthKey + "']")).toBeVisible();
      await expect(calendarRoot(page).locator(".sv-calendar__day--today")).toHaveText("19");
      await expect(calendarDay(page, "19")).toHaveClass(/sv-calendar__day--today/);
    });

    test("selects a day, writes the masked text and closes the popup", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion());

      await openCalendar(page);
      await calendarDay(page, "9").click();

      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toBe("2026-11-09");
      await expect(dateInput(page)).toHaveValue("11/09/2026");
    });

    test("reopens on the selected day and its month", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ defaultValue: "2026-11-09" }));

      await openCalendar(page);

      await expect(calendarTitle(page)).toHaveText("November 2026");
      await expect(calendarRoot(page).locator("[data-month='" + todayMonthKey + "']")).toBeVisible();
      await expect(calendarRoot(page).locator(".sv-calendar__day--selected")).toHaveText("9");
      await expect(calendarDay(page, "9")).toHaveClass(/sv-calendar__day--selected/);
    });

    test("navigates months and selects an outside day", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion());
      await openCalendar(page);

      await navButton(page, "next").click();
      await expect(calendarTitle(page)).toHaveText("December 2026");
      await expect(calendarRoot(page).locator("[data-month='2026-11']")).toBeVisible();

      await navButton(page, "prev").click();
      await navButton(page, "prev").click();
      await expect(calendarTitle(page)).toHaveText("October 2026");
      await expect(calendarRoot(page).locator("[data-month='2026-9']")).toBeVisible();

      await navButton(page, "next").click();
      await expect(calendarTitle(page)).toHaveText("November 2026");
      await navButton(page, "next").click();
      await expect(calendarTitle(page)).toHaveText("December 2026");
      // December starts on Tuesday, so Monday the 30th of November is the leading outside day.
      await calendarDay(page, "30", "outside").click();

      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toBe("2026-11-30");
      await expect(dateInput(page)).toHaveValue("11/30/2026");

      await openCalendar(page);
      await expect(calendarTitle(page)).toHaveText("November 2026");
      await expect(calendarDay(page, "30")).toHaveClass(/sv-calendar__day--selected/);
    });

    test("zooms through months and years without changing the value", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ defaultValue: "2026-11-09" }));
      await openCalendar(page);

      await calendarTitleButton(page).click();
      await expect(calendarTitle(page)).toHaveText("2026");
      await expect(calendarRoot(page).locator(".sv-calendar__month")).toHaveCount(12);
      await expect(calendarRoot(page).locator(".sv-calendar__month--selected")).toHaveText("November");
      expect(await getDateValue(page)).toBe("2026-11-09");

      await calendarTitleButton(page).click();
      await expect(calendarTitle(page)).toHaveText(yearRangeTitle);
      await expect(calendarRoot(page).locator(".sv-calendar__year")).toHaveCount(12);
      await expect(calendarRoot(page).locator(".sv-calendar__year--selected")).toHaveText("2026");
      expect(await getDateValue(page)).toBe("2026-11-09");

      await calendarTitleButton(page).click();
      await expect(calendarTitle(page)).toHaveText("November 2026");
      await expect(calendarDay(page, "9")).toHaveClass(/sv-calendar__day--selected/);

      await calendarTitleButton(page).click();
      await calendarTitleButton(page).click();
      await calendarRoot(page).locator(".sv-calendar__year").getByText("2025", { exact: true }).click();
      await expect(calendarTitle(page)).toHaveText("2025");
      await expect(calendarRoot(page).locator(".sv-calendar__month")).toHaveCount(12);
      expect(await getDateValue(page)).toBe("2026-11-09");

      await calendarRoot(page).locator(".sv-calendar__month").getByText("March", { exact: true }).click();
      await expect(calendarTitle(page)).toHaveText("March 2025");
      await expect(calendarRoot(page).locator(".sv-calendar__day")).not.toHaveCount(0);
      expect(await getDateValue(page)).toBe("2026-11-09");
      await expect(dateInput(page)).toHaveValue("11/09/2026");
    });

    test("disables days and navigation outside min and max", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ min: "2026-11-10", max: "2026-11-20" }));
      await openCalendar(page);

      await expect(calendarDay(page, "9")).toHaveClass(/sv-calendar__day--disabled/);
      await expect(calendarDay(page, "21")).toHaveClass(/sv-calendar__day--disabled/);
      await expect(calendarDay(page, "10")).not.toHaveClass(/sv-calendar__day--disabled/);
      await expect(calendarDay(page, "20")).not.toHaveClass(/sv-calendar__day--disabled/);

      await calendarDay(page, "9", "disabled").click();
      expect(await getDateValue(page)).toBeUndefined();
      await expect(popupContainer(page)).toBeVisible();
      await expect(calendarTitle(page)).toHaveText("November 2026");
      await expect(navButton(page, "prev")).toBeDisabled();
      await expect(navButton(page, "next")).toBeDisabled();

      await calendarTitleButton(page).click();
      await expect(calendarTitle(page)).toHaveText("2026");
      await expect(calendarRoot(page).locator(".sv-calendar__month--disabled")).toHaveCount(11);
      await expect(calendarRoot(page).locator(".sv-calendar__month").getByText("November", { exact: true })).not.toHaveClass(/sv-calendar__month--disabled/);
      await expect(navButton(page, "prev")).toBeDisabled();
      await expect(navButton(page, "next")).toBeDisabled();
      await calendarRoot(page).locator(".sv-calendar__month--disabled").getByText("January", { exact: true }).click();
      await expect(calendarTitle(page)).toHaveText("2026");
      expect(await getDateValue(page)).toBeUndefined();

      await calendarTitleButton(page).click();
      await expect(calendarTitle(page)).toHaveText(yearRangeTitle);
      await expect(calendarRoot(page).locator(".sv-calendar__year--disabled")).toHaveCount(11);
      await expect(calendarRoot(page).locator(".sv-calendar__year").getByText("2026", { exact: true })).not.toHaveClass(/sv-calendar__year--disabled/);
      await expect(navButton(page, "prev")).toBeDisabled();
      await expect(navButton(page, "next")).toBeDisabled();
      await calendarRoot(page).locator(".sv-calendar__year--disabled").getByText("2025", { exact: true }).click();
      await expect(calendarTitle(page)).toHaveText(yearRangeTitle);
      await calendarRoot(page).locator(".sv-calendar__year").getByText("2026", { exact: true }).click();
      await expect(calendarTitle(page)).toHaveText("2026");
      expect(await getDateValue(page)).toBeUndefined();
    });

    test("min and max expressions update the disabled days", async ({ page }) => {
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          { type: "text", name: "from", title: "From", inputType: "date" },
          { type: "text", name: "to", title: "To", inputType: "date" },
          {
            type: "datetimepicker",
            name: "date",
            title: "Date",
            minValueExpression: "{from}",
            maxValueExpression: "{to}"
          }
        ]
      });
      await page.evaluate(() => {
        const survey = (window as any).survey;
        survey.setValue("from", "2026-11-12");
        survey.setValue("to", "2026-11-18");
      });
      await openCalendar(page);

      await expect(calendarDay(page, "11")).toHaveClass(/sv-calendar__day--disabled/);
      await expect(calendarDay(page, "12")).not.toHaveClass(/sv-calendar__day--disabled/);
      await expect(calendarDay(page, "18")).not.toHaveClass(/sv-calendar__day--disabled/);
      await expect(calendarDay(page, "19")).toHaveClass(/sv-calendar__day--disabled/);

      await page.evaluate(() => {
        (window as any).survey.setValue("from", "2026-11-15");
      });
      await expect(calendarDay(page, "14")).toHaveClass(/sv-calendar__day--disabled/);
      await expect(calendarDay(page, "15")).not.toHaveClass(/sv-calendar__day--disabled/);
      await expect(calendarDay(page, "12")).toHaveClass(/sv-calendar__day--disabled/);
    });

    test("typing a masked date updates the value and the selected day", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion());

      await dateInput(page).click();
      await page.keyboard.type("11092026");

      await expect(dateInput(page)).toHaveValue("11/09/2026");
      expect(await getDateValue(page)).toBe("2026-11-09");

      await openCalendar(page);
      await expect(calendarTitle(page)).toHaveText("November 2026");
      await expect(calendarDay(page, "9")).toHaveClass(/sv-calendar__day--selected/);
    });

    test("clears the value and hides clear when allowClear is false", async ({ page }) => {
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          { type: "datetimepicker", name: "date", title: "Date", defaultValue: "2026-11-09" },
          { type: "datetimepicker", name: "locked", title: "Locked", defaultValue: "2026-11-09", allowClear: false }
        ]
      });

      await expect(dateInput(page).first()).toHaveValue("11/09/2026");
      await expect(clearButton(page)).toHaveCount(1);
      await clearButton(page).click();

      expect(await getDateValue(page, "date")).toBeUndefined();
      await expect(dateInput(page).first()).toHaveValue("");
      await expect(clearButton(page)).toHaveCount(0);

      const locked = page.locator(".sd-datetimepicker").nth(1);
      await expect(locked.locator(".sd-datetimepicker__input")).toHaveValue("11/09/2026");
      await expect(locked.locator(".sd-editor-clean-button")).toBeHidden();
      expect(await getDateValue(page, "locked")).toBe("2026-11-09");
    });

    test("closes on Escape and on an outside click without changing the value", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ defaultValue: "2026-11-09" }));

      await openCalendar(page);
      // The popup focuses its title button, and Escape bubbles from there to the popup.
      await expect(calendarTitleButton(page)).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toBe("2026-11-09");
      await expect(dateInput(page)).toHaveValue("11/09/2026");

      await openCalendar(page);
      await page.mouse.click(10, 10);
      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toBe("2026-11-09");
      await expect(dateInput(page)).toHaveValue("11/09/2026");
    });

    test("does not open the calendar when read-only or disabled", async ({ page }) => {
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          { type: "datetimepicker", name: "readonly", title: "Read-only", readOnly: true, defaultValue: "2026-11-09" },
          { type: "datetimepicker", name: "disabled", title: "Disabled", enableIf: "false", defaultValue: "2026-11-09" }
        ]
      });

      const buttons = calendarButton(page);
      await expect(buttons).toHaveCount(2);
      await expect(buttons.nth(0)).toBeDisabled();
      await expect(buttons.nth(1)).toBeDisabled();
      await buttons.nth(0).click({ force: true });
      await buttons.nth(1).click({ force: true });
      await expect(page.locator(".sv-calendar")).toHaveCount(0);
      expect(await getDateValue(page, "readonly")).toBe("2026-11-09");
      expect(await getDateValue(page, "disabled")).toBe("2026-11-09");
    });

    test("shows min and max error texts", async ({ page }) => {
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        checkErrorsMode: "onValueChanged",
        elements: [{
          type: "datetimepicker",
          name: "date",
          title: "Date",
          min: "2026-11-10",
          max: "2026-11-20",
          minErrorText: "Too early",
          maxErrorText: "Too late"
        }]
      });

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = "2026-11-01";
      });
      await expect(dateInput(page)).toHaveValue("11/01/2026");
      await expect(page.locator(".sd-error__item").filter({ hasText: "Too early" })).toBeVisible();
      await expect(page.locator(".sd-error__item").filter({ hasText: "Too late" })).toHaveCount(0);

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = "2026-11-28";
      });
      await expect(dateInput(page)).toHaveValue("11/28/2026");
      await expect(page.locator(".sd-error__item").filter({ hasText: "Too late" })).toBeVisible();
      await expect(page.locator(".sd-error__item").filter({ hasText: "Too early" })).toHaveCount(0);

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = "2026-11-15";
      });
      await expect(page.locator(".sd-error__item")).toHaveCount(0);
    });

    test("shows two months and hides the zoom title in range mode", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);

      await expect(calendarRoot(page)).toHaveClass(/sv-calendar--range/);
      await expect(calendarRoot(page).locator(".sv-calendar__month-view")).toHaveCount(2);
      await expect(calendarRoot(page).locator(".sv-calendar__month-title")).toHaveText(["November 2026", "December 2026"]);
      await expect(calendarRoot(page).locator(".sv-calendar__title")).toBeHidden();
    });

    test("keeps the popup open after the range start", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);
      await calendarDay(page, "5", undefined, todayMonthKey).click();

      // With no preview the start is a one-day range, so it is drawn as range-single.
      await expect(calendarDay(page, "5", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-single/);
      await expect(dateInput(page).nth(0)).toHaveValue("11/05/2026");
      await expect(dateInput(page).nth(1)).toHaveValue("");
      await expect(popupContainer(page)).toBeVisible();
      expect(await getDateValue(page)).toBeUndefined();
    });

    test("previews the range on hover and clears it when the pointer leaves", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);
      await calendarDay(page, "5", undefined, todayMonthKey).click();
      await calendarDay(page, "12", undefined, todayMonthKey).hover();

      await expect(calendarDay(page, "5", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-start/);
      await expect(calendarDay(page, "8", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--in-range/);
      await expect(calendarDay(page, "12", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--in-range/);

      await calendarRoot(page).locator(".sv-calendar__month-title").first().hover();
      await expect(calendarDay(page, "8", undefined, todayMonthKey)).not.toHaveClass(/sv-calendar__day--in-range/);
      await expect(calendarDay(page, "5", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-single/);
      await expect(popupContainer(page)).toBeVisible();
    });

    test("selects a range and closes the popup", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);
      await calendarDay(page, "5", undefined, todayMonthKey).click();
      await calendarDay(page, "12", undefined, todayMonthKey).click();

      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toEqual(["2026-11-05", "2026-11-12"]);
      await expect(dateInput(page).nth(0)).toHaveValue("11/05/2026");
      await expect(dateInput(page).nth(1)).toHaveValue("11/12/2026");
    });

    test("normalizes a range whose end is earlier than its start", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);
      await calendarDay(page, "12", undefined, todayMonthKey).click();
      await calendarDay(page, "5", undefined, todayMonthKey).click();

      expect(await getDateValue(page)).toEqual(["2026-11-05", "2026-11-12"]);
      await openCalendar(page);
      await expect(calendarDay(page, "5", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-start/);
      await expect(calendarDay(page, "12", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-end/);
    });

    test("selects a single-day range", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);
      await calendarDay(page, "9", undefined, todayMonthKey).click();
      await calendarDay(page, "9", undefined, todayMonthKey).click();

      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toEqual(["2026-11-09", "2026-11-09"]);
      await openCalendar(page);
      await expect(calendarDay(page, "9", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-single/);
    });

    test("selects a range across months and skips hidden neighbour days", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);
      await showRangeMonth(page, "April 2026");
      await calendarDay(page, "30", undefined, "2026-3").click();
      await showRangeMonth(page, "May 2026");
      await calendarDay(page, "1", undefined, "2026-5").click();

      expect(await getDateValue(page)).toEqual(["2026-04-30", "2026-06-01"]);
      await openCalendar(page);
      await expect(calendarDay(page, "30", undefined, "2026-3")).toHaveClass(/sv-calendar__day--range-start/);
      await expect(calendarDay(page, "15", undefined, "2026-4")).toHaveClass(/sv-calendar__day--in-range/);

      const hidden = calendarRoot(page).locator(".sv-calendar__day--hidden");
      await expect(hidden).not.toHaveCount(0);
      const hiddenCount = await hidden.count();
      for (let i = 0; i < hiddenCount; i++) {
        await expect(hidden.nth(i)).not.toHaveClass(/sv-calendar__day--in-range/);
      }
    });

    test("shifts the month pair by one and disables next at max", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);

      await expect(calendarRoot(page).locator(".sv-calendar__month-title")).toHaveText(["November 2026", "December 2026"]);
      await navButton(page, "next").click();
      await expect(calendarRoot(page).locator(".sv-calendar__month-title")).toHaveText(["December 2026", "January 2027"]);
      await navButton(page, "prev").click();
      await navButton(page, "prev").click();
      await expect(calendarRoot(page).locator(".sv-calendar__month-title")).toHaveText(["October 2026", "November 2026"]);

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").max = "2026-12-31";
      });
      await expect(navButton(page, "next")).toBeEnabled();
      await navButton(page, "next").click();
      await expect(calendarRoot(page).locator(".sv-calendar__month-title")).toHaveText(["November 2026", "December 2026"]);
      await expect(navButton(page, "next")).toBeDisabled();
      await expect(navButton(page, "prev")).toBeEnabled();
    });

    test("clips the range preview to min and max", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await openCalendar(page);
      await calendarDay(page, "5", undefined, todayMonthKey).click();
      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("date");
        question.min = "2026-11-10";
        question.max = "2026-11-20";
      });
      await calendarDay(page, "18", undefined, todayMonthKey).hover();

      await expect(calendarDay(page, "5", "disabled", todayMonthKey)).not.toHaveClass(/sv-calendar__day--in-range/);
      await expect(calendarDay(page, "9", "disabled", todayMonthKey)).not.toHaveClass(/sv-calendar__day--in-range/);
      await expect(calendarDay(page, "10", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--in-range/);
      await expect(calendarDay(page, "18", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--in-range/);
      await expect(calendarDay(page, "21", "disabled", todayMonthKey)).not.toHaveClass(/sv-calendar__day--in-range/);

      await calendarDay(page, "21", "disabled", todayMonthKey).hover();
      await expect(calendarDay(page, "21", "disabled", todayMonthKey)).not.toHaveClass(/sv-calendar__day--in-range/);
      await expect(calendarDay(page, "18", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--in-range/);
    });

    test("updates the range selection from the keyboard", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());

      await dateInput(page).nth(0).click();
      await page.keyboard.type("11052026");
      expect(await getDateValue(page)).toBeUndefined();
      await openCalendar(page);
      await expect(calendarDay(page, "5", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-single/);
      await page.mouse.click(10, 10);
      await expect(popupContainer(page)).not.toBeVisible();

      await dateInput(page).nth(1).click();
      await page.keyboard.type("11122026");
      expect(await getDateValue(page)).toEqual(["2026-11-05", "2026-11-12"]);
      await openCalendar(page);
      await expect(calendarDay(page, "5", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-start/);
      await expect(calendarDay(page, "12", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-end/);
    });

    test("shows rangeErrorText when the typed start is after the end", async ({ page }) => {
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        checkErrorsMode: "onValueChanged",
        elements: [{
          type: "datetimepicker",
          name: "date",
          title: "Trip dates",
          range: true,
          rangeErrorText: "Start is after the end"
        }]
      });

      await dateInput(page).nth(0).click();
      await page.keyboard.type("11052026");
      await dateInput(page).nth(1).click();
      await page.keyboard.type("11122026");
      expect(await getDateValue(page)).toEqual(["2026-11-05", "2026-11-12"]);

      await dateInput(page).nth(0).click();
      await dateInput(page).nth(0).evaluate((input: HTMLInputElement) => input.setSelectionRange(0, 0));
      await page.keyboard.type("11202026");

      await expect(dateInput(page).nth(0)).toHaveValue("11/20/2026");
      await expect(dateInput(page).nth(1)).toHaveValue("11/12/2026");
      expect(await getDateValue(page)).toEqual([]);
      await expect(page.locator(".sd-error__item").filter({ hasText: "Start is after the end" })).toBeVisible();
    });

    test("clears each range field on its own", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion({ defaultValue: ["2026-11-05", "2026-11-12"] }));

      await expect(dateField(page, 0).getByRole("button", { name: "Clear" })).toBeVisible();
      await expect(dateField(page, 1).getByRole("button", { name: "Clear" })).toBeVisible();
      await dateField(page, 0).getByRole("button", { name: "Clear" }).click();

      await expect(dateInput(page).nth(0)).toHaveValue("");
      await expect(dateInput(page).nth(1)).toHaveValue("11/12/2026");
      expect(await getDateValue(page)).toEqual([]);
      await expect(dateField(page, 0).getByRole("button", { name: "Clear" })).toHaveCount(0);

      await dateField(page, 1).getByRole("button", { name: "Clear" }).click();
      await expect(dateInput(page).nth(1)).toHaveValue("");
      await expect(dateField(page, 1).getByRole("button", { name: "Clear" })).toHaveCount(0);
    });

    test("opens a mobile sheet with the question header and Apply", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({
        title: "Date",
        description: "Pick a single day."
      }));
      await resizeToMobile(page);
      await openCalendar(page);

      const sheet = page.locator(".sv-popup--sheet");
      await expect(sheet).toBeVisible();
      await expect(sheet.locator(".sv-popup__body-header-title")).toHaveText("Date");
      await expect(sheet.locator(".sv-popup__body-header-description")).toHaveText("Pick a single day.");
      await expect(sheet.locator(".sv-popup__body-footer").getByRole("button")).toHaveCount(1);
      await expect(sheet.getByRole("button", { name: "Apply" })).toBeVisible();
      await expect(sheet.locator(".sv-popup__body-footer")).toHaveCSS("border-top-style", "none");
      await expect(calendarTitle(page)).toHaveText("November 2026");
    });

    test("applies a mobile day only from the footer", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion({ defaultValue: "2026-11-02" }));
      await resizeToMobile(page);
      await openCalendar(page);
      await calendarDay(page, "9").click();

      expect(await getDateValue(page)).toBe("2026-11-02");
      await expect(dateInput(page)).toHaveValue("11/02/2026");
      await expect(popupContainer(page)).toBeVisible();

      await page.locator(".sv-popup__close-button").click();
      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toBe("2026-11-02");

      await openCalendar(page);
      await calendarDay(page, "9").click();
      await page.locator(".sv-popup--sheet").getByRole("button", { name: "Apply" }).click();
      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toBe("2026-11-09");
      await expect(dateInput(page)).toHaveValue("11/09/2026");
    });

    test("shows a scrolling month list for a mobile range", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion({
        description: "Choose the start and the end."
      }));
      await resizeToMobile(page);
      await openCalendar(page);

      const sheet = page.locator(".sv-popup--sheet");
      await expect(calendarRoot(page)).toHaveClass(/sv-calendar--month-list/);
      await expect(calendarRoot(page).locator(".sv-calendar__list-header .sv-calendar__weekday")).toHaveText(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
      await expect(calendarRoot(page).locator(".sv-calendar__toolbar")).toHaveCount(0);
      await expect(calendarRoot(page).locator(".sv-calendar__month-title").filter({ hasText: "November 2026" })).toBeVisible();
      await expect(sheet.locator(".sv-popup__body-footer")).not.toHaveCSS("border-top-style", "none");
      await expect(sheet.locator(".sv-popup__body-footer").getByRole("button", { name: "Apply" })).toBeVisible();
      await expect(sheet.locator(".sv-popup__body-footer").getByRole("button", { name: "Clear" })).toBeVisible();
    });

    test("scrolls the value month to the top of the month list", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await resizeToMobile(page);
      await openCalendar(page);
      expect(Math.abs(await waitForMonthList(page, todayMonthKey))).toBeLessThanOrEqual(2);

      await page.locator(".sv-popup__close-button").click();
      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("date").value = ["2026-03-09", "2026-03-12"];
      });
      await openCalendar(page);
      expect(Math.abs(await waitForMonthList(page, "2026-2"))).toBeLessThanOrEqual(2);
      await expect(calendarRoot(page).locator("[data-month='2026-2'] .sv-calendar__month-title")).toHaveText("March 2026");
    });

    test("grows the month list on scroll and stays inside min and max", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await resizeToMobile(page);
      await openCalendar(page);
      await waitForMonthList(page, todayMonthKey);

      const months = calendarRoot(page).locator(".sv-calendar__month-view");
      const initialCount = await months.count();
      expect(initialCount).toBe(25);
      const firstKey = await months.first().getAttribute("data-month");

      await scrollMonthList(page, "start");
      await expect.poll(async () => {
        const count = await months.count();
        const offset = await monthListOffset(page, firstKey);
        if (count < initialCount + 6 || !Number.isFinite(offset)) return -1;
        return Math.abs(offset);
      }).toBeLessThanOrEqual(2);

      const grownCount = await months.count();
      await scrollMonthList(page, "end");
      await expect.poll(async () => months.count()).toBeGreaterThan(grownCount);

      await page.locator(".sv-popup__close-button").click();
      await page.evaluate(() => {
        const question = (window as any).survey.getQuestionByName("date");
        question.min = "2026-10-01";
        question.max = "2026-12-31";
      });
      await openCalendar(page);
      await waitForMonthList(page, todayMonthKey);
      await scrollMonthList(page, "start");
      await scrollMonthList(page, "end");
      await expect(months).toHaveCount(3);
      await expect(calendarRoot(page).locator("[data-month='2026-8']")).toHaveCount(0);
      await expect(calendarRoot(page).locator("[data-month='2027-0']")).toHaveCount(0);
    });

    test("applies, clears, and drops an incomplete mobile range", async ({ page }) => {
      await initSurvey(page, framework, rangeQuestion());
      await resizeToMobile(page);
      await openCalendar(page);
      await calendarDay(page, "5", undefined, todayMonthKey).click();
      await calendarDay(page, "12", undefined, todayMonthKey).click();

      expect(await getDateValue(page)).toBeUndefined();
      await expect(popupContainer(page)).toBeVisible();
      await expect(calendarDay(page, "5", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-start/);
      await expect(calendarDay(page, "12", undefined, todayMonthKey)).toHaveClass(/sv-calendar__day--range-end/);

      const sheet = page.locator(".sv-popup--sheet");
      await sheet.locator(".sv-popup__body-footer").getByRole("button", { name: "Apply" }).click();
      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toEqual(["2026-11-05", "2026-11-12"]);

      await openCalendar(page);
      await sheet.locator(".sv-popup__body-footer").getByRole("button", { name: "Clear" }).click();
      await expect(popupContainer(page)).toBeVisible();
      await expect(dateInput(page).nth(0)).toHaveValue("");
      await expect(dateInput(page).nth(1)).toHaveValue("");
      await expect(calendarDay(page, "5", undefined, todayMonthKey)).not.toHaveClass(/sv-calendar__day--in-range/);
      expect(await getDateValue(page)).toEqual(["2026-11-05", "2026-11-12"]);

      await calendarDay(page, "5", undefined, todayMonthKey).click();
      await expect(dateInput(page).nth(0)).toHaveValue("11/05/2026");
      await expect(dateInput(page).nth(1)).toHaveValue("");
      await expect(popupContainer(page)).toBeVisible();
      await sheet.locator(".sv-popup__body-footer").getByRole("button", { name: "Apply" }).click();
      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toEqual([]);
    });

    test("switches the popup between desktop and mobile", async ({ page }) => {
      await initSurvey(page, framework, singleDateQuestion());
      await openCalendar(page);
      await expect(page.locator(".sv-popup--sheet")).toHaveCount(0);

      await expect(calendarTitleButton(page)).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(popupContainer(page)).not.toBeVisible();
      await resizeToMobile(page);
      await openCalendar(page);
      await expect(page.locator(".sv-popup--sheet")).toBeVisible();
      await expect(calendarRoot(page)).toBeVisible();

      await page.locator(".sv-popup__close-button").click();
      await expect(popupContainer(page)).not.toBeVisible();
      await resizeToDesktop(page);
      await openCalendar(page);
      await expect(page.locator(".sv-popup--sheet")).toHaveCount(0);
      await expect(calendarTitle(page)).toHaveText("November 2026");
    });

    test("mirrors navigation in an rtl survey and still selects a day", async ({ page }) => {
      await loadSurveyLocales(page, framework);
      await initSurvey(page, framework, Object.assign(singleDateQuestion(), { locale: "ar" }));
      await expect(page.locator(".sd-root-modern")).toHaveAttribute("dir", "rtl");
      await openCalendar(page);

      const weekdays = calendarRoot(page).locator(".sv-calendar__weekday");
      const firstDay = await weekdays.first().boundingBox();
      const lastDay = await weekdays.last().boundingBox();
      const previous = await navButton(page, "prev").boundingBox();
      const next = await navButton(page, "next").boundingBox();
      expect(firstDay.x).toBeGreaterThan(lastDay.x);
      expect(previous.x).toBeGreaterThan(next.x);

      await calendarDay(page, "9").click();
      await expect(popupContainer(page)).not.toBeVisible();
      expect(await getDateValue(page)).toBe("2026-11-09");
    });
  });
});
