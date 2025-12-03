import { test, expect } from "@playwright/test";
import { compareScreenshot, frameworks, initSurvey, resetFocusToBody, url } from "../e2e/helper";

const title = "Brand banner Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {

    test("Check markdown support for dropdown action, Bug#10679", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });

      const json = {
        pages: [
          { name: "page1", title: "<b><i>Page 1</i></b>", elements: [{ type: "text", name: "q1" }] },
          { name: "page2", title: "<b><i>Page 2</i></b>", elements: [{ type: "text", name: "q2" }] },
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        const survey = window["survey"];
        survey.onTextMarkdown.add((_, options) => {
          options.html = options.text;
        });
        survey.onGetQuestionTitleActions.add((_, options: any) => {
          const creator = window["Survey"];
          const item = creator.createDropdownActionModel(
            { locTitle: survey.pages[0].locTitle, showTitle: true },
            { items: [
              new creator.Action({ locTitle: survey.pages[0].locTitle }),
              new creator.Action({ locTitle: survey.pages[1].locTitle })]
            }
          );
          options.titleActions = [item, new creator.Action({ locTitle: survey.pages[1].locTitle })];
        });
        survey.fromJSON(json);
      }, json);
      const popupSelector = page.locator(".sv-popup .sv-popup__container").first();
      const dropdownButton = page.locator(".sd-action").first();
      const simpleButton = page.locator(".sd-action").nth(1);

      await expect(dropdownButton).toBeVisible();
      await expect(simpleButton).toBeVisible();
      await compareScreenshot(page, simpleButton, "simple-button.png");
      await compareScreenshot(page, dropdownButton, "dropdown-button.png");
      await dropdownButton.click();
      await expect(popupSelector).toBeVisible();
      await compareScreenshot(page, popupSelector, "dropdown-popup.png");
    });
  });
});