import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, explicitErrorHandler, checkElementScreenshot } from "../../helper";

const title = "Dropdown Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

const registerButtongroup = ClientFunction((framework) => {
  const Survey = (<any>window).Survey;
  Survey.QuestionFactory.Instance.registerQuestion("buttongroup", (name) => {
    return new Survey.QuestionButtonGroupModel(name);
  });
  if (framework === "react") {
    Survey.ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
      return (<any>window).React.createElement(Survey.SurveyQuestionButtonGroup, props);
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
});

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await explicitErrorHandler();
    await applyTheme(theme);
  });
  test("Check dropdown question", async (t) => {
    await t.resizeWindow(1920, 1080);
    await registerButtongroup(framework);
    if (framework === "vue" || framework === "angular") {
      return;
    }
    await initSurvey(framework, {
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
    const questionRoot = Selector(".sd-question");
    const item = Selector(".sv-button-group__item").nth(2);
    const focusBody = ClientFunction(() => { document.body.focus(); });
    await focusBody();
    await checkElementScreenshot("buttongroup-question.png", questionRoot, t);
    await ClientFunction(() => { (<HTMLEmbedElement>document.querySelector(".sv-button-group__item:nth-child(2)")).focus(); })();
    await checkElementScreenshot("buttongroup-question-focused.png", questionRoot, t);
    await focusBody();
    await t.hover(item);
    await checkElementScreenshot("buttongroup-question-hovered.png", questionRoot, t);
    await focusBody();
    await ClientFunction(() => {
      (<any>window).survey.getQuestionByName("buttongroup_question").value = "UK";
    })();
    await checkElementScreenshot("buttongroup-question-answered.png", questionRoot, t);
  });
});