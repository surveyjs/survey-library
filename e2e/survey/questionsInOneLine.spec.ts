import { frameworks, initSurvey, url, test, expect } from "../helper";

const title = "questionsInOneLine and titles location";

const json = {
  questionTitleLocation: "bottom",
  showQuestionNumbers: "off",
  pages: [
    {
      name: "Address",
      title: "Address",
      questions: [
        { type: "text", name: "address1", title: "Stree Address" },
        { type: "text", name: "address2", title: "Address Line 2" },
        { type: "text", name: "city", title: "City" },
        {
          type: "text",
          name: "state",
          startWithNewLine: false,
          title: "State / Province / Region",
        },
        { type: "text", name: "zip", title: "Zip / Postal Code" },
        {
          type: "dropdown",
          name: "country",
          startWithNewLine: false,
          title: "Country",
          choicesByUrl: {
            url: "http://services.groupkt.com/country/get/all",
            path: "RestResponse;result",
            valueName: "name",
          },
        },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check one line", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      const cityElement = page.locator("div[style*=\"flex: 1 1 50%\"] div[data-name='city']");
      const stateElement = page.locator("div[style*=\"flex: 1 1 50%\"] div[data-name='state']");

      await expect(cityElement).toBeVisible();
      await expect(stateElement).toBeVisible();
      await expect(page.locator(".sd-question")).toHaveCount(6);
    });
  });
});