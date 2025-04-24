import { test, expect } from "@playwright/test";
import { compareScreenshot, frameworks, initSurvey, resetFocusToBody, url } from "../e2e/helper";

const title = "ButtonGroup Screenshot";

const registerButtongroup = async (page, framework) => {
  await page.evaluate((framework) => {
    const Survey = (window as any).Survey;
    Survey.QuestionFactory.Instance.registerQuestion("buttongroup", (name) => {
      return new Survey.QuestionButtonGroupModel(name);
    });
    if (framework === "react") {
      (window as any).SurveyReact.ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
        return (window as any).React.createElement((window as any).SurveyReact.SurveyQuestionButtonGroup, props);
      });
    }
    if (framework === "jquery-ui") {
      const SurveyJquery = (window as any).SurveyJquery;
      const preact = SurveyJquery["preact"];
      SurveyJquery.ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
        return preact.createElement(SurveyJquery.SurveyQuestionButtonGroup, props);
      });
    }
    if (framework === "survey-js-ui") {
      const SurveyUI = (window as any).SurveyUI;
      const preact = SurveyUI["preact"];
      SurveyUI.ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
        return preact.createElement(SurveyUI.SurveyQuestionButtonGroup, props);
      });
    }
    if (framework === "knockout") {
      Survey.Serializer.overrideClassCreator("buttongroup", function () {
        return new Survey.QuestionButtonGroup("");
      });

      Survey.QuestionFactory.Instance.registerQuestion("buttongroup", (name) => {
        var q = new Survey.QuestionButtonGroup(name);
        q.choices = Survey.QuestionFactory.DefaultChoices;
        return q;
      });
    }
  }, framework);
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check buttongroup question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      // await registerButtongroup(page, framework);

      // if (framework === "vue" || framework === "angular") {
      //   return;
      // }

      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        widthMode: "static",
        questions: [
          {
            type: "buttongroup",
            title: "Where are you living?",
            name: "buttongroup_question",
            choices: ["Greece", "US", "UK", "Spain"]
          },
        ]
      });

      const item = page.locator(".sv-button-group__item").nth(2);

      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "buttongroup-question.png");

      await item.hover();
      await compareScreenshot(page, ".sd-question", "buttongroup-question-hovered.png");

      item.focus();
      await compareScreenshot(page, ".sd-question", "buttongroup-question-focused.png");

      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("buttongroup_question").value = "UK";
      });
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question", "buttongroup-question-answered.png");
    });

    test("Check brand info banner", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 1000 });

      const json = {
        questions: [{
          "type": "buttongroup",
          "name": "car",
          "title": "Which is the brand of your car?",
          "defaultValue": "Volkswagen",
          "choices": ["Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi"]
        }]
      };
      await initSurvey(page, framework, json);
      await resetFocusToBody(page);
      await compareScreenshot(page, ".sd-question__content", "buttongroup-renderas-default.png");

      await page.setViewportSize({ width: 500, height: 1000 });
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sd-question__content", "buttongroup-renderas-dropdown.png");
    });
  });
});