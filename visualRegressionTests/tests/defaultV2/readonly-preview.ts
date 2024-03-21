import { Selector, ClientFunction } from "testcafe";
import { setData } from "../../../testCafe/helper";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, wrapVisualTest, resetFocusToBody, resetHoverToBody } from "../../helper";
import { backgroundImage } from "../../constants";

const title = "ReadOnly and Preview";

fixture`${title}`.page`${url}`;

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`
    .beforeEach(async t => {
      await applyTheme(theme);
    });

  test("Radiogroup ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "radiogroup",
            "name": "car",
            "choices": ["Ford", "Vauxhall", "BMW", "Peugeot"],
            "readOnly": true,
            "defaultValue": "BMW",
          },
        ]
      });
      await takeElementScreenshot("readonly-radiogroup.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-radiogroup.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test("Single Input ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "name": "username",
            "type": "text",
            "defaultValue": "John"
          },
        ]
      });
      await takeElementScreenshot("readonly-single-input.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-single-input.png", Selector(".sd-question__content"), t, comparer);
    });
  });

  test.only("Rating ReadOnly and Preview", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "rating",
            "name": "nps-score",
            "title": "Rating",
            "rateMin": 1,
            "rateMax": 5,
            "minRateDescription": "Not Satisfied",
            "maxRateDescription": "Completely Satisfied",
            "defaultValue": 4,
            "readOnly": true
          }
        ]
      });
      await takeElementScreenshot("readonly-rating.png", Selector(".sd-question__content"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("preview-rating.png", Selector(".sd-question__content"), t, comparer);
    });
  });

});
