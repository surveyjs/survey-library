import { test, expect, Locator } from "@playwright/test";
import { frameworks, url, initSurvey, resetFocusToBody, compareScreenshot } from "../e2e/helper";

const title = "Input mask Screenshot";

// A masked value is rendered as a left-to-right run whatever the survey direction (tier 01 of the
// mask RTL series). The empty and the half-typed states are where the bidi reordering used to show.
const maskedQuestions = [
  { type: "text", name: "date", title: "Date", maskType: "datetime" },
  { type: "text", name: "phone", title: "Phone", maskType: "pattern", maskSettings: { pattern: "+1 (999) 999-9999" } },
  { type: "text", name: "amount", title: "Amount", maskType: "numeric", defaultValue: -1234.56 },
  { type: "text", name: "price", title: "Price", maskType: "currency", maskSettings: { prefix: "$ " }, defaultValue: 1234.56 },
];

// A click places the caret at the pointer, which is not the logical end of a right-aligned value;
// the caret is placed explicitly so every typed digit lands where the mask expects it.
async function typeAt(input: Locator, caret: number, text: string): Promise<void> {
  await input.evaluate((el: HTMLInputElement, pos: number) => {
    el.focus();
    el.setSelectionRange(pos, pos);
  }, caret);
  await input.page().keyboard.type(text);
}

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check masked inputs in an rtl locale", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        locale: "ar",
        showQuestionNumbers: false,
        width: "600px",
        elements: [
          ...maskedQuestions,
          // an arabic affix opts the currency mask out of the left-to-right rule
          { type: "text", name: "riyal", title: "Riyal", maskType: "currency", maskSettings: { suffix: " ر.س" }, defaultValue: 1234.56 }, // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
          // an author's right-to-left placeholder, shown while the masked input is empty and unfocused
          { type: "text", name: "placeholder", title: "Placeholder", maskType: "pattern", maskSettings: { pattern: "999-999" }, placeholder: "أدخل الرقم:" }, // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
          { type: "multipletext", name: "mt", title: "Items", items: [{ name: "when", title: "When", maskType: "datetime" }, { name: "howmuch", title: "How much", maskType: "currency" }] },
        ]
      });
      const body = page.locator(".sd-body");
      const date = page.locator("[data-name='date'] input");
      const phone = page.locator("[data-name='phone'] input");
      await expect(date).toHaveValue("dd/mm/yyyy");
      await expect(phone).toHaveValue("+1 (___) ___-____");
      await resetFocusToBody(page);
      await compareScreenshot(page, body, "input-mask-rtl-empty.png");

      await typeAt(date, 0, "12");
      await typeAt(phone, 0, "555");
      await expect(date).toHaveValue("12/mm/yyyy");
      await expect(phone).toHaveValue("+1 (555) ___-____");
      await resetFocusToBody(page);
      await compareScreenshot(page, body, "input-mask-rtl-half-typed.png");

      await typeAt(date, 3, "031999");
      await typeAt(phone, 9, "1234567");
      await expect(date).toHaveValue("12/03/1999");
      await expect(phone).toHaveValue("+1 (555) 123-4567");
      await resetFocusToBody(page);
      await compareScreenshot(page, body, "input-mask-rtl-complete.png");
    });

    test("Check masked inputs in an rtl container with the default locale", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        document.body.setAttribute("dir", "rtl");
      });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        width: "600px",
        elements: maskedQuestions
      });
      const body = page.locator(".sd-body");
      const date = page.locator("[data-name='date'] input");
      await typeAt(date, 0, "12");
      await expect(date).toHaveValue("12/dd/yyyy");
      await resetFocusToBody(page);
      await compareScreenshot(page, body, "input-mask-rtl-container.png");

      await page.evaluate(() => {
        document.body.removeAttribute("dir");
      });
    });

    test("Check masked inputs ltr baseline", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        width: "600px",
        elements: maskedQuestions
      });
      const body = page.locator(".sd-body");
      const date = page.locator("[data-name='date'] input");
      await typeAt(date, 0, "12");
      await expect(date).toHaveValue("12/dd/yyyy");
      await resetFocusToBody(page);
      await compareScreenshot(page, body, "input-mask-ltr.png");
    });
  });
});
