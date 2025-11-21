import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "image question";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check image question layout", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "image",
            name: "image",
            imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
          },
          {
            type: "image",
            name: "video",
            imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.avi"
          },
          {
            type: "image",
            name: "youtube",
            imageLink: "https://www.youtube.com/embed/tgbNymZ7vqY"
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.waitForLoadState("load");

      const getSelectorByNumber = (questionNumber: number) => {
        return page.locator(".sd-body .sd-row").nth(questionNumber).locator(".sd-question .sd-image");
      };

      await expect(getSelectorByNumber(0).locator("img")).toBeVisible();
      await expect(getSelectorByNumber(1).locator("video")).toBeVisible();
      await expect(getSelectorByNumber(2).locator("iframe")).toBeVisible();
    });
  });
});

