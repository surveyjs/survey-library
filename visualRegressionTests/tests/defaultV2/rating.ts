import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, explicitErrorHandler, resetFocusToBody, wrapVisualTest } from "../../helper";

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
    await wrapVisualTest(t, async (t, comparer) => {
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
      await takeElementScreenshot("question-rating.png", questionRoot, t, comparer);
      await ClientFunction(()=> { (<HTMLElement>document.querySelector(".sd-rating__item input")).focus(); })();
      await takeElementScreenshot("question-rating-focus.png", questionRoot, t, comparer);
      await t.click(".sd-rating__item");
      await takeElementScreenshot("question-rating-focus-selected.png", questionRoot, t, comparer);
      await focusBody();
      await takeElementScreenshot("question-rating-selected", questionRoot, t, comparer);
    });
  });

  test("Check rating disabled question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await takeElementScreenshot("question-rating-selected-disabled.png", questionRoot, t, comparer);
    });
  });

  test("Check rating question with many items", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            displayMode: "buttons",
            rateMax: 30,
            width: "708px"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await resetFocusToBody();
      await takeElementScreenshot("question-rating-many.png", questionRoot, t, comparer);
    });
  });

  test("Check rating question as dropdown", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await resetFocusToBody();
      await takeElementScreenshot("question-rating-dropdown.png", questionRoot, t, comparer);
    });
  });

  test("Check rating question - long items", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await resetFocusToBody();
      await takeElementScreenshot("question-rating-long-items.png", questionRoot, t, comparer);
    });
  });

  test("Check big rating in panel", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await resetFocusToBody();
      await takeElementScreenshot("long-rating-in-panel.png", questionRoot, t, comparer);
    });
  });

  test("Check big rating in matrix", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1000, 1080);
      await initSurvey(framework, {
        locale: "de",
        pages: [{
          name: "page1", elements: [
            {
              type: "matrixdropdown",
              columns: [
                {
                  "name": "rate",
                  "cellType": "rating",
                  "minRateDescription": {
                    "default": "1 (the worst)",
                    "de": "1 (Das Schlechteste)"
                  },
                  "maxRateDescription": {
                    "default": "5 (the best)",
                    "de": "5 (Das beste)"
                  },
                  "title": {
                    "default": "Rating",
                    "de": "Bewertung"
                  }
                }
              ],
              name: "favoriteMovie",
              rows: [{ value: "moonlight", text: "Moonlight" }
              ],
              title: {
                default: "Please rate these movies",
                de: "Bitte bewerten Sie diese Filme"
              }
            }
          ]
        }
        ]
      });

      const questionRoot = Selector(".sd-table");
      await resetFocusToBody();
      await takeElementScreenshot("rating-in-matrix.png", questionRoot, t, comparer);
    });
  });

  test.only("Check rating stars question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "stars",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            width: "708px"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await focusBody();
      await takeElementScreenshot("question-rating-stars.png", questionRoot, t, comparer);
      await ClientFunction(() => { (<HTMLElement>document.querySelector(".sd-rating__item-star input")).focus(); })();
      await takeElementScreenshot("question-rating-stars-focus.png", questionRoot, t, comparer);
      await t.hover(Selector(".sd-rating__item-star").nth(3));
      await takeElementScreenshot("question-rating-stars-focus-hovered.png", questionRoot, t, comparer);
      await t.click(Selector(".sd-rating__item-star").nth(3));
      await takeElementScreenshot("question-rating-stars-focus-selected.png", questionRoot, t, comparer);
      await t.hover(Selector(".sd-rating__item-star").nth(1));
      await takeElementScreenshot("question-rating-stars-unhovered.png", questionRoot, t, comparer);
      await focusBody();
      await takeElementScreenshot("question-rating-stars-selected", questionRoot, t, comparer);
    });
  });

  test.only("Check rating stars disabled question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "stars",
            rateMax: 5,
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
      await takeElementScreenshot("question-rating-stars-selected-disabled.png", questionRoot, t, comparer);
    });
  });

});
