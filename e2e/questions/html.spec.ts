import { frameworks, url, setOptions, initSurvey, test, expect } from "../helper";

const title = "html question";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          {
            type: "text",
            name: "name",
          },
          {
            type: "html",
            name: "info",
            html:
              "<table><body><row><td><img src='https://surveyjs.io/Content/Images/examples/26178-20160417.jpg' width='100px' /></td><td style='padding:20px'>You may put here any html code. For example images, <b>text</b> or <a href='https://surveyjs.io/Editor/Editor/'  target='_blank'>links</a></td></row></body></table>"
          },
          {
            type: "html",
            name: "testName",
            html: "Name: <span>{name}</span>"
          }
        ]
      };
      await initSurvey(page, framework, json);
    });

    test("check html elements", async ({ page }) => {
      const getImageExistance = await page.evaluate(
        () => !!(window as any).survey.rootElement.getRootNode().querySelector('table img[src="https://surveyjs.io/Content/Images/examples/26178-20160417.jpg"]')
      );
      const getBoldExistance = await page.evaluate(
        () => !!(window as any).survey.rootElement.getRootNode().querySelector("table b")
      );
      const getLinkExistance = await page.evaluate(
        () => !!(window as any).survey.rootElement.getRootNode().querySelector('table a[href="https://surveyjs.io/Editor/Editor/"]'));

      expect(getImageExistance).toBe(true);
      expect(getBoldExistance).toBe(true);
      expect(getLinkExistance).toBe(true);
    });

    test("change html", async ({ page }) => {
      await setOptions(page, "info", { html: "<h1>Wombat</h1>" });
      await expect(page.locator("h1").filter({ hasText: "Wombat" })).toBeVisible();
    });

    test("text processing", async ({ page }) => {
      await page.locator("input[type=text]").fill("John");
      await page.keyboard.press("Tab");
      await expect(page.locator("span").filter({ hasText: "John" })).toBeVisible();
    });
  });
});

