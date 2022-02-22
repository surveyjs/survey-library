import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, checkElementScreenshot } from "../../helper";

const title = "Rating Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await applyTheme(theme);
  });
  test("Check rating question", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "rating",
          name: "satisfaction",
          title: "Rating",
          rateMax: 3,
          minRateDescription: "Not Satisfied",
          maxRateDescription: "Completely satisfied",
          width: "708px"
        }
      ]
    });

    const questionRoot = Selector(".sd-question");
    await ClientFunction(()=>{ document.body.focus(); })();
    await checkElementScreenshot("question-rating.png", questionRoot, t);
  });
  test("Check rating question with many items", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "rating",
          name: "satisfaction",
          title: "Rating",
          rateMax: 30,
          width: "708px"
        }
      ]
    });

    const questionRoot = Selector(".sd-question");
    await ClientFunction(()=>{ document.body.focus(); })();
    await checkElementScreenshot("question-rating-many.png", questionRoot, t);
  });
  test("Check rating question as dropdown", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "rating",
          name: "satisfaction",
          title: "Rating",
          rateMax: 3,
          minRateDescription: "Not Satisfied",
          maxRateDescription: "Completely satisfied",
          renderAs: "dropdown",
          width: "708px"
        }
      ]
    });

    const questionRoot = Selector(".sd-question");
    await ClientFunction(()=>{ document.body.focus(); })();
    await checkElementScreenshot("question-rating-dropdown.png", questionRoot, t);
  });
});