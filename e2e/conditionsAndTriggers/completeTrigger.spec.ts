import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { test, expect } from "@playwright/test";

const title = "completeTrigger";

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

frameworks.forEach(framework => {
  test.describe(`${title} - ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
    });

    test("check visibility", async ({ page }) => {
      const nextSelector = page.locator("input[value=\"Next\"]").filter({ visible: true });
      const completeSelector = page.locator("input[value=\"Complete\"]").filter({ visible: true });
      const yesSelector = page.locator("label").filter({ hasText: "Yes" }).locator("span").first();
      const noSelector = page.locator("label").filter({ hasText: "No" }).locator("span").first();

      await expect(page.locator(".sv-string-viewer").filter({ hasText: "4. Do you want to finish the survey?" })).toHaveCount(0);
      await noSelector.click();
      await nextSelector.click();
      await yesSelector.click();
      await completeSelector.click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ exit1: "No", exit2: "Yes" });
    });

    test("check complete and next buttons visibility", async ({ page }) => {
      const nextSelector = page.locator("input[value=\"Next\"]").filter({ visible: true });
      const completeSelector = page.locator("input[value=\"Complete\"]").filter({ visible: true });
      const yesSelector = page.locator("label").filter({ hasText: "Yes" }).locator("span").first();
      const noSelector = page.locator("label").filter({ hasText: "No" }).locator("span").first();

      await expect(nextSelector).toHaveCount(1);
      await expect(completeSelector).toHaveCount(0);

      await yesSelector.click();
      await expect(nextSelector).toHaveCount(0);
      await expect(completeSelector).toHaveCount(1);

      await noSelector.click();
      await expect(nextSelector).toHaveCount(1);
      await expect(completeSelector).toHaveCount(0);

      await yesSelector.click();
      await completeSelector.click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ exit1: "Yes" });
    });
  });
});