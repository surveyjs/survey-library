import { frameworks, url, initSurvey, test } from "../helper";

const title = "progressButtons";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check progress buttons", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        pages: [
          {
            name: "page1",
            elements: [{ type: "text", name: "question1" }] },
          {
            name: "page2",
            elements: [{ type: "text", name: "question2" }]
          },
          {
            name: "page3",
            elements: [{ type: "text", name: "question3" }]
          }
        ],
        showProgressBar: true,
        progressBarLocation: "top",
        progressBarType: "pages",
        progressBarShowPageTitles: true
      };
      await initSurvey(page, framework, json);
      await page.locator("[data-name='question1']").hover();
      await page.locator("[title='page3']").click();
      await page.locator("[data-name='question3']").hover();
      await page.locator("[title='page2']").click();
      await page.locator("[data-name='question2']").hover();
    });
  });
});

