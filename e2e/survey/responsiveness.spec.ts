import { frameworks, initSurvey, url, test, expect } from "../helper";

const title = "Survey responsiveness";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check survey root class on isMobile switch", async ({ page }) => {
      await page.goto(`${url}${framework}`);

      const json = { questions: [{ type: "text", name: "q1", },], };
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1000, height: 1000 });
      await page.evaluate(() => {
        window.addEventListener("error", e => {
          if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
            e.message === "ResizeObserver loop limit exceeded") {
            e.stopImmediatePropagation();
          }
        });
      });

      const rootSelector = page.locator(".sd-root-modern");
      const mobileClass = /sd-root-modern--mobile/;

      await expect(rootSelector).not.toHaveClass(mobileClass);
      await page.setViewportSize({ width: 500, height: 1000 });
      await page.waitForTimeout(500);
      await expect(rootSelector).toHaveClass(mobileClass);
      await page.setViewportSize({ width: 1000, height: 1000 });
      await page.waitForTimeout(500);
      await expect(rootSelector).not.toHaveClass(mobileClass);
    });

    test("check rating question in survey with multiple pages on small screen", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.evaluate(() => {
        window.addEventListener("error", e => {
          if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
            e.message === "ResizeObserver loop limit exceeded") {
            e.stopImmediatePropagation();
          }
        });
      });

      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ]
          },
          {
            "name": "page2",
            "elements": [
              {
                "type": "rating",
                "name": "satisfaction-auto",
                "title": "How satisfied are you with our product?",
                "description": "Display mode = Auto",
                "minRateDescription": "Not satisfied",
                "maxRateDescription": "Completely satisfied"
              }
            ]
          },
          {
            "name": "page3",
            "elements": [
              {
                "type": "boolean",
                "name": "question2"
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
      });

      await page.setViewportSize({ width: 500, height: 1080 });
      await page.click(".sd-navigation__next-btn");

      await page.waitForTimeout(500);
      const renderAs = await page.evaluate(() => {
        return window["survey"].getAllQuestions()[1].renderAs;
      });
      expect(renderAs).toBe("dropdown");

      await page.click(".sd-navigation__next-btn");
      await page.click(".sd-navigation__prev-btn");

      await page.waitForTimeout(500);
      const renderAsAfter = await page.evaluate(() => {
        return window["survey"].getAllQuestions()[1].renderAs;
      });
      expect(renderAsAfter).toBe("dropdown");
    });
  });
});