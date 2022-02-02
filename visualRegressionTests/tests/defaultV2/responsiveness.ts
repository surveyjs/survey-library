import { Selector, ClientFunction } from "testcafe";
import { url, checkElementScreenshot, frameworks, initSurvey, url_test } from "../../helper";

const title = "Responsiveness Screenshot";

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
  test("Check simple question in small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, {
      questions: [
        {
          type: "text",
          name: "question_with_num",
          title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
        },
      ]
    });
    await checkElementScreenshot("responsiveness-simple-question.png", Selector(".sd-question"), t);
  });
  test("Check questions in one row in small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, {
      questions: [
        {
          type: "text",
          name: "question_with_num",
          title: "Personal information"
        },
        {
          type: "text",
          name: "question_with_num",
          startWithNewLine: false,
          title: "Contact information"
        },
      ]
    },);
    const rowSelector = Selector(".sd-row");
    await ClientFunction(()=>{ document.body.focus(); })();
    await checkElementScreenshot("responsiveness-multiple-row.png", rowSelector, t);
  });
});