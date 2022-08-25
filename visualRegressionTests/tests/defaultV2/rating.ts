import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, checkElementScreenshot, explicitErrorHandler } from "../../helper";

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
    await explicitErrorHandler();
    await applyTheme(theme);
  });
  test("Check rating question", async (t) => {
    await t.resizeWindow(1920, 1080);
    const focusBody = ClientFunction(()=>{ document.body.focus(); });
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
    await focusBody();
    await checkElementScreenshot("question-rating.png", questionRoot, t);
    await ClientFunction(()=> { (<HTMLElement>document.querySelector(".sd-rating__item input")).focus(); })();
    await checkElementScreenshot("question-rating-focus.png", questionRoot, t);
    await t.click(".sd-rating__item");
    await checkElementScreenshot("question-rating-focus-selected.png", questionRoot, t);
    await focusBody();
    await checkElementScreenshot("question-rating-selected", questionRoot, t);
  });
  test("Check rating disabled question", async (t) => {
    await t.resizeWindow(1920, 1080);
    const focusBody = ClientFunction(()=>{ document.body.focus(); });
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
          width: "708px",
          defaultValue: 2,
          readOnly: true
        }
      ]
    });

    const questionRoot = Selector(".sd-question");
    await focusBody();
    await checkElementScreenshot("question-rating-selected-disabled.png", questionRoot, t);
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
          useDropdown: "never",
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

  test("Check rating question - long items", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "rating",
          name: "question1",
          "rateValues": [
            {
              "value": 1,
              "text": "first item"
            },
            {
              "value": 2,
              "text": "second item"
            },
            {
              "value": 3,
              "text": "third item"
            }
          ],
          width: "708px"
        }
      ]
    });

    const questionRoot = Selector(".sd-question");
    await ClientFunction(()=>{ document.body.focus(); })();
    await checkElementScreenshot("question-rating-long-items.png", questionRoot, t);
  });
  test("Check big rating in panel", async (t) => {
    await t.resizeWindow(1000, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "panel",
          title: "Panel",
          elements: [
            {
              type: "rating",
              rateMax: 20,
              name: "What should be improved?"
            },
          ]
        },
      ]
    });

    const questionRoot = Selector(".sd-panel");
    await ClientFunction(()=>{ document.body.focus(); })();
    await checkElementScreenshot("long-rating-in-panel.png", questionRoot, t);
  });
});