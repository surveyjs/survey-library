import { url, initSurvey, frameworks, test, expect } from "../helper";

const title = "svgRegistry";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test("Check svg icons", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.evaluate(() => {
        window["Survey"].SvgRegistry.registerIconFromSvg("icn-test", "<svg viewBox=\"1 2 3 4\"></svg>");
      });
      const json = {
        elements: [
          {
            "type": "html",
            "name": "question1",
            "html": "<svg id=\"svg-icon-test\"><use xlink:href=\"#icon-icn-test\"></use></svg>"
          }
        ]
      };
      await initSurvey(page, framework, json);
      const svgContainer = await page.evaluate(() => {
        return document.querySelector("#sv-icon-holder-global-container")?.innerHTML;
      });

      await expect(page.locator("#sv-icon-holder-global-container")).toHaveCount(1);
      expect(svgContainer).toContain("<symbol id=\"icon-icn-test\" viewBox=\"1 2 3 4\"></symbol>");
      expect(svgContainer).toContain("<symbol id=\"icon-chevronright-16x16\"");
    });
  });
});