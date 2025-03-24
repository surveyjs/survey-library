import { Page, test } from "@playwright/test";
import { frameworks, url, initSurvey, axeContext, axeOptions } from "./helper";
import { injectAxe, checkA11y } from "axe-playwright";

const title = "buttongroup";

const registerButtongroup = async (page: Page, framework: string) => {
  await page.evaluate((framework: string) => {
    const Survey = (<any>window).Survey;
    Survey.QuestionFactory.Instance.registerQuestion("buttongroup", (name) => {
      return new Survey.QuestionButtonGroupModel(name);
    });
    switch(framework) {
      case "react":
        (<any>window).SurveyReact.ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
          return (<any>window).React.createElement((<any>window).SurveyReact.SurveyQuestionButtonGroup, props);
        });
        break;
      case "survey-js-ui":
        const SurveyUI = (<any>window).SurveyUI;
        const preact = SurveyUI["preact"];
        SurveyUI.ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
          return preact.createElement(SurveyUI.SurveyQuestionButtonGroup, props);
        });
        break;
    }
  }, framework);
};

frameworks.forEach((framework) => {
  test.describe(`${framework} a11y:${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await injectAxe(page);
    });
    test("axe check buttongroup", async ({ page }) => {
      await registerButtongroup(page, framework);
      await initSurvey(page, framework, {
        "elements": [
          {
            type: "buttongroup",
            name: "test",
            choices: ["choice1", "choice2", "choice3"],
          },
        ]
      });
      await checkA11y(page, axeContext, { axeOptions, detailedReport: true });
    });
  });
});