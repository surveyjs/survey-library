import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "page";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("page title", async ({ page }) => {
      const json = {
        pages: [
          {
            title: "Page title",
            questions: [
              {
                titleLocation: "hidden",
                type: "text",
                name: "simple text"
              }
            ]
          }
        ]
      };

      await initSurvey(page, framework, json);
      await expect(page.locator(".sd-page__title")).toBeVisible();

      await page.evaluate(() => {
        window["survey"].setDesignMode(true);
        window["survey"].render();
      });

      await expect(page.locator(".sd-page__title")).toBeVisible();
    });

    test("page description", async ({ page }) => {
      await page.evaluate(() => {
        window["Survey"].defaultCss.page.description = "sv_page_description";
      });

      const json = {
        pages: [
          {
            description: "Page description",
            questions: [
              {
                titleLocation: "hidden",
                type: "text",
                name: "simple text"
              }
            ]
          }
        ]
      };

      await initSurvey(page, framework, json);
      await expect(page.locator(".sv_page_description")).toBeVisible();

      await page.evaluate(() => {
        window["survey"].setDesignMode(true);
        window["survey"].render();
      });

      await expect(page.locator(".sv_page_description")).toBeVisible();
    });

    test("page title empty", async ({ page }) => {
      const json = {
        pages: [
          {
            title: "",
            questions: [
              {
                titleLocation: "hidden",
                type: "text",
                name: "simple text"
              }
            ]
          }
        ]
      };

      await initSurvey(page, framework, json);
      await expect(page.locator(".sd-page__title")).toHaveCount(0);

      await page.evaluate(() => {
        window["survey"].setDesignMode(true);
        window["survey"].render();
      });

      await expect(page.locator(".sd-page__title")).toHaveCount(1);
    });

    test("page description empty", async ({ page }) => {
      await page.evaluate(() => {
        window["Survey"].defaultCss.page.description = "sv_page_description";
      });

      const json = {
        pages: [
          {
            description: "",
            questions: [
              {
                titleLocation: "hidden",
                type: "text",
                name: "simple text"
              }
            ]
          }
        ]
      };

      await initSurvey(page, framework, json);
      await expect(page.locator(".sv_page_description")).toHaveCount(0);

      await page.evaluate(() => {
        window["survey"].setDesignMode(true);
        window["survey"].render();
      });

      await expect(page.locator(".sv_page_description")).toHaveCount(1);
    });

    test("render page description on changing locale when description is empty for default locale", async ({ page }) => {
      const json = {
        pages: [
          {
            description: {
              de: "Page description"
            },
            questions: [
              {
                titleLocation: "hidden",
                type: "text",
                name: "simple text"
              }
            ]
          }
        ]
      };
      const descSelector = page.locator("span", { hasText: "Page description" });
      await initSurvey(page, framework, json);
      await expect(descSelector).toHaveCount(0);

      await page.evaluate(() => {
        window["survey"].locale = "de";
      });

      await expect(descSelector).toHaveCount(1);
    });
  });
});