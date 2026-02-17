import { frameworks, url, initSurvey, getSurveyResult, test, expect, getTimeZone, getButtonByText } from "../helper";

const title = "Text question in western timezone";

test.use({
  locale: "en-US",
  timezoneId: "America/Los_Angeles"
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Test mask in western timezone", async ({ page }) => {
      if (framework === "vue") return;
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            name: "name",
            type: "text",
            maskType: "datetime",
            maskSettings: {
              pattern: "HH:MM"
            }
          }, {
            "type": "text",
            "name": "yearInput",
            "title": "Year Input (Input Mask)",
            "maskType": "datetime",
            "maskSettings": {
              "pattern": "yyyy"
            },
            "placeholder": "YYYY"
          }]
      });

      expect(await getTimeZone(page)).toBe("America/Los_Angeles");
      await expect(page.locator(".sd-text").first()).toBeFocused();
      await page.keyboard.type("1234");
      await page.keyboard.press("Tab");
      await page.keyboard.type("2022");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      expect(await page.locator("input").nth(0).inputValue()).toBe("12:34");
      expect(await page.locator("input").nth(1).inputValue()).toBe("2022");
      await getButtonByText(page, "Complete").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        name: "12:34",
        yearInput: "2022"
      });
    });

  });
});