import test from "playwright/test";
import { compareScreenshot, frameworks, initSurvey, url } from "../e2e/helper";

const title = "Imagemap Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Imagemap", async ({ page }) => {

      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        elements: [
          {
            type: "imagemap",
            name: "q1",
            imageLink: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTI1IiB2aWV3Qm94PSIwIDAgNjAwIDEyNSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI0ZGMDBGRiIvPjwvc3ZnPg==",
            idleFillColor: "#ff0000",
            hoverFillColor: "#0000ff",
            selectedFillColor: "#00ff00",
            areas: [
              {
                value: "v1",
                shape: "rect",
                coords: "25,25,100,100"
              },
              {
                value: "v2",
                shape: "rect",
                coords: "125,25,200,100"
              }
            ]
          },
        ]
      });

      await page.waitForTimeout(10);
      await compareScreenshot(page, ".sd-question", "imagemap-idle.png");

      await page.hover("img[usemap]", { position: { x: 30, y: 30 } });
      await page.waitForTimeout(10);
      await compareScreenshot(page, ".sd-question", "imagemap-hover.png");

      await page.click("img[usemap]", { position: { x: 30, y: 30 } });
      await page.waitForTimeout(10);
      await compareScreenshot(page, ".sd-question", "imagemap-selected.png");
    });
  });
});