import { frameworks, url_test, initSurvey } from "../helper";
import { QuestionRadiogroup, QuestionDropdown } from "../questionHelper";
import { test, expect } from "@playwright/test";
import { Survey } from "../surveyHelper";

const themeName = "defaultV2";
const title = "visibleIf";

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      var json = {
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
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json);
    });
    test("check question visibility", async ({ page }) => {
      const survey = new Survey(page);
      const haveKids = new QuestionRadiogroup(page, "haveKids");

      await survey.checkVisibleQuestions(1);
      await haveKids.clickByValue("Yes");
      await survey.checkVisibleQuestions(2);

      const kids = new QuestionDropdown(page, "kids");
      await kids.selectItemByText("5");
      await survey.checkVisibleQuestions(7);
      await kids.selectItemByText("1");
      await survey.checkVisibleQuestions(3);
      const kid1Age = new QuestionDropdown(page, "kid1Age");
      await kid1Age.selectItemByText("7");

      await survey.checkData({
        haveKids: "Yes",
        kid1Age: 7,
        kids: 1
      });
    });
  });
});