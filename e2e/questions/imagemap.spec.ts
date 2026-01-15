import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "imagemap question";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check imagemap question layout", async ({ page }) => {

      const config = {
        "elements": [
          {
            "type": "boolean",
            "name": "q1",
            "titleLocation": "hidden"
          },
          {
            "type": "imagemap",
            "name": "q2",
            "visibleIf": "{q1} = true",
            "titleLocation": "hidden",
            "clearIfInvisible": "onHidden",
            "idleFillColor": "#ff0000",
            "hoverFillColor": "#0000ff",
            "selectedFillColor": "#00ff00",
            "imageLink": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgNjAwIDYwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI0RERERERCIvPjwvc3ZnPg==",
            "areas": [
              {
                "value": "v1",
                "shape": "rect",
                "coords": "25,25,100,100"
              },
              {
                "value": "v2",
                "shape": "rect",
                "coords": "125,25,200,100"
              }
            ]
          },
          {
            "type": "text",
            "name": "q3",
            "visibleIf": "{q2} contains 'v1'",
            "titleLocation": "hidden"
          },
          {
            "type": "text",
            "name": "q4",
            "visibleIf": "{q2} contains 'v2'",
            "titleLocation": "hidden"
          }
        ]
      };

      await initSurvey(page, framework, config);

      await page.waitForLoadState("load");

      await page.locator("span").filter({ hasText: "Yes" }).first().click();
      await page.waitForTimeout(500);
      await expect(page.locator(".sd-imagemap-bg")).toBeVisible();

      let ok = await page.evaluate(() => (window as any).survey.rootElement.getRootNode().querySelectorAll(".sd-imagemap-svg rect").length === 2);
      expect(ok).toBeTruthy();

      await page.locator(".sd-imagemap-svg").click({ position: { x: 30, y: 30 } });
      ok = await page.evaluate(() => (window as any).survey.rootElement.getRootNode().querySelectorAll(".sd-row").length === 3);
      expect(ok).toBeTruthy();

      await page.locator(".sd-imagemap-svg").click({ position: { x: 130, y: 30 } });
      ok = await page.evaluate(() => (window as any).survey.rootElement.getRootNode().querySelectorAll(".sd-row").length === 4);
      expect(ok).toBeTruthy();

      await page.locator("span").filter({ hasText: "Yes" }).first().click();
      ok = await page.evaluate(() => (window as any).survey.rootElement.getRootNode().querySelectorAll(".sd-row").length === 1);
      expect(ok).toBeTruthy();

      await page.locator("span").filter({ hasText: "Yes" }).first().click();
      ok = await page.evaluate(() => (window as any).survey.rootElement.getRootNode().querySelectorAll(".sd-row").length === 2);
      expect(ok).toBeTruthy();
    });
  });
});

