import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "customCss";

const json = {
  questions: [
    {
      type: "matrix",
      name: "Quality",
      title:
        "Please indicate if you agree or disagree with the following statements",
      columns: [
        { value: 1, text: "Strongly Disagree" },
        { value: 2, text: "Disagree" },
        { value: 3, text: "Neutral" },
        { value: 4, text: "Agree" },
        { value: 5, text: "Strongly Agree" },
      ],
      rows: [
        { value: "affordable", text: "Product is affordable" },
        { value: "does what it claims", text: "Product does what it claims" },
        {
          value: "better than others",
          text: "Product is better than other products on the market",
        },
        { value: "easy to use", text: "Product is easy to use" },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check custom class", async ({ page }) => {
      await page.goto(`${url}${framework}`);

      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        const myCss = {
          matrix: { root: "table table-striped" },
          navigationButton: "button btn-lg",
        };
        window["survey"].css = myCss;
        window["survey"].fromJSON(json);
      }, json);

      const completeButton = page.locator('input[value="Complete"]');
      await expect(completeButton).toHaveClass(/btn-lg/);
    });
  });
});
