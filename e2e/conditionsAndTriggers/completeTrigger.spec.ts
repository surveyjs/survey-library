import { frameworks, url_test, initSurvey } from "../helper";
import { QuestionRadiogroup } from "../questionHelper";
import { test, expect } from "@playwright/test";
import { Survey } from "../surveyHelper";

const title = "completeTrigger";
const themeName = "defaultV2";

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      const json = {
        triggers: [
          { type: "complete", name: "exit1", operator: "equal", value: "Yes" },
          { type: "complete", name: "exit2", operator: "equal", value: "Yes" }
        ],
        pages: [
          {
            title: "What operating system do you use?",
            questions: [
              {
                type: "checkbox",
                name: "opSystem",
                title: "OS",
                hasOther: true,
                choices: ["Windows", "Linux", "Macintosh OSX"]
              },
              {
                type: "radiogroup",
                name: "exit1",
                title: "Do you want to finish the survey?",
                choices: ["Yes", "No"],
                colCount: 0
              }
            ]
          },
          {
            title: "What language(s) are you currently using?",
            questions: [
              {
                type: "checkbox",
                name: "langs",
                title: "Plese select from the list",
                colCount: 4,
                choices: [
                  "Javascript",
                  "Java",
                  "Python",
                  "CSS",
                  "PHP",
                  "Ruby",
                  "C++",
                  "C",
                  "Shell",
                  "C#",
                  "Objective-C",
                  "R",
                  "VimL",
                  "Go",
                  "Perl",
                  "CoffeeScript",
                  "TeX",
                  "Swift",
                  "Scala",
                  "Emacs List",
                  "Haskell",
                  "Lua",
                  "Clojure",
                  "Matlab",
                  "Arduino",
                  "Makefile",
                  "Groovy",
                  "Puppet",
                  "Rust",
                  "PowerShell"
                ]
              },
              {
                type: "radiogroup",
                name: "exit2",
                title: "Do you want to finish the survey?",
                choices: ["Yes", "No"],
                colCount: 0
              }
            ]
          },
          {
            title: "Please enter your name and e-mail",
            questions: [
              { type: "text", name: "name", title: "Name:" },
              { type: "text", name: "email", title: "Your e-mail" }
            ]
          }
        ]
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json);
    });
    test("check visibility", async ({ page }) => {
      const survey = new Survey(page);
      const exit1 = new QuestionRadiogroup(page, "exit1");
      await exit1.clickByValue("No");
      await survey.nextPage();
      const exit2 = new QuestionRadiogroup(page, "exit2");
      await exit2.clickByValue("Yes");
      await survey.complete();

      await survey.checkData({ exit1: "No", exit2: "Yes" });
    });
    test("check complete and next buttons visibility", async ({ page }) => {
      const survey = new Survey(page);
      const exit1 = new QuestionRadiogroup(page, "exit1");
      await exit1.clickByValue("Yes");
      await survey.checkNextButtonVisibility(false);
      await survey.checkCompleteButtonVisibility(true);
      await survey.checkNextButtonVisibility(true);
      await survey.checkCompleteButtonVisibility(false);
      await exit1.clickByValue("No");
      await exit1.clickByValue("Yes");
      await survey.checkNextButtonVisibility(false);
      await survey.checkCompleteButtonVisibility(true);
      await survey.complete();

      await survey.checkData({ exit1: "Yes" });
    });
  });
});