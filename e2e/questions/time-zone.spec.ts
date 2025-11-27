/* eslint-disable no-console */
import { frameworks, url, initSurvey, getSurveyResult, test, expect, getTimeZone } from "../helper";

const title = "Text question in western timezone";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.use({
      locale: "en-US",
      timezoneId: "America/Los_Angeles"
    });

    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Test input type (month) in western timezone", async ({ page }) => {
      const userAgent = await page.evaluate(() => navigator.userAgent);
      console.log("User Agent:", userAgent);

      const platform = await page.evaluate(() => navigator.platform);
      console.log("Platform:", platform);

      const language = await page.evaluate(() => navigator.language);
      console.log("Language:", language);

      const geolocation = await page.evaluate(() => navigator.geolocation);
      console.log("geolocation:", geolocation);

      const appName = await page.evaluate(() => navigator.appName);
      console.log("appName:", appName);

      const appVersion = await page.evaluate(() => navigator.appVersion);
      console.log("appVersion:", appVersion);

      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            "type": "text",
            "name": "monthInput",
            "title": "Month Input",
            "inputType": "month"
          }]
      });

      expect(await getTimeZone(page)).toBe("America/Los_Angeles");
      await expect(page.locator(".sd-text").first()).toBeFocused();
      await page.keyboard.press("m");
      await page.keyboard.press("a");
      await page.keyboard.press("r");
      await page.keyboard.press("Tab");
      await page.keyboard.press("2");
      await page.keyboard.press("0");
      await page.keyboard.press("2");
      await page.keyboard.press("4");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      expect(await page.locator("input").nth(0).inputValue()).toBe("2024-03");
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        monthInput: "2024-03"
      });
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
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        name: "12:34",
        yearInput: "2022"
      });
    });

  });
});