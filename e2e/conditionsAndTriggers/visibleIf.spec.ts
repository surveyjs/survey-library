import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "visibleIf";

const json = {
  showQuestionNumbers: "off",
  questions: [
    {
      type: "radiogroup",
      name: "haveKids",
      title: "Do you have a kid(s)?",
      isRequired: true,
      choices: ["Yes", "No"],
      colCount: 0
    },
    {
      type: "dropdown",
      name: "kids",
      title: "How many kids do you have",
      visibleIf: "{haveKids}='Yes'",
      isRequired: true,
      choices: [1, 2, 3, 4, 5]
    },
    {
      type: "dropdown",
      name: "kid1Age",
      title: "The first kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 1",
      isRequired: true,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid2Age",
      title: "The second kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 2",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid3Age",
      title: "The third kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 3",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid4Age",
      title: "The fourth kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 4",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid5Age",
      title: "The fifth kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 5",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1000, height: 1000 });
    });

    test("check visibility", async ({ page }) => {
      const questionDropdownSelect = page.locator(".sd-dropdown");
      const yesSelector = page.locator("label").filter({ hasText: "Yes" }).locator("span").first();

      // Initial state - no dropdowns visible
      await expect(questionDropdownSelect).toHaveCount(0);

      // Click Yes radio button
      await yesSelector.click();

      // One dropdown should be visible
      await expect(questionDropdownSelect).toHaveCount(1);

      // Select 5 kids
      await questionDropdownSelect.first().click();
      await page.getByText("5").click();

      // All 6 dropdowns should be visible
      await expect(questionDropdownSelect).toHaveCount(6);

      // Select 1 kid
      await questionDropdownSelect.first().click();
      await page.getByText("1").click();

      // Only 2 dropdowns should be visible
      await expect(questionDropdownSelect).toHaveCount(2);

      // Select age for first kid and complete
      await questionDropdownSelect.nth(1).click();
      await page.getByText("2", { exact: true }).filter({ visible: true }).click();
      await page.locator("input[value='Complete']").click();

      // Check survey results
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        haveKids: "Yes",
        kid1Age: 2,
        kids: 1
      });
    });
  });
});