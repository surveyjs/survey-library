import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, resetFocusToBody, wrapVisualTest } from "../../helper";

const title = "Rating Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    await applyTheme(theme);
  });
  test("Check rating question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateMax: 3,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await focusBody();
      await takeElementScreenshot("question-rating.png", questionRoot, t, comparer);
      await ClientFunction(() => { (<HTMLElement>document.querySelector(".sd-rating__item input")).focus(); })();
      await takeElementScreenshot("question-rating-focus.png", questionRoot, t, comparer);
      await t.click(".sd-rating__item");
      await takeElementScreenshot("question-rating-focus-selected.png", questionRoot, t, comparer);
      await focusBody();
      await takeElementScreenshot("question-rating-selected", questionRoot, t, comparer);
    });
  });

  test.skip("Check rating disabled question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateMax: 3,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
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
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            displayMode: "buttons",
            rateMax: 30,
            minWidth: "708px",
            maxWidth: "708px",
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
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateMax: 3,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            renderAs: "dropdown",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await resetFocusToBody();
      await takeElementScreenshot("question-rating-dropdown.png", questionRoot, t, comparer);

      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
      const popupContainer = Selector(".sv-popup__container").filterVisible();
      await t.click(questionDropdownSelect);
      await takeElementScreenshot("question-rating-dropdown-popup.png", popupContainer, t, comparer);
    });
  });

  test("Check rating question - long items", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
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
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await resetFocusToBody();
      await takeElementScreenshot("question-rating-long-items.png", questionRoot, t, comparer);
    });
  });

  test("Check rating question - long items, button mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "rating",
                "name": "question1",
                "autoGenerate": false,
                "displayMode": "buttons",
                "rateValues": [
                  1,
                  {
                    "value": 2,
                    "text": "item 2"
                  },
                  {
                    "value": 3,
                    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  },
                  4,
                  5
                ]
              }
            ]
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await resetFocusToBody();
      await takeElementScreenshot("question-rating-long-items-buttons.png", questionRoot, t, comparer);
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

  test("Check rating stars question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await ClientFunction(() => {
        document.head.insertAdjacentHTML("beforeend", "<style>* { box-sizing: border-box; }</style>");
      })();
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "stars",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
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
      await t.hover(Selector(".sd-body"), { offsetX: 0, offsetY: 0 });
      await takeElementScreenshot("question-rating-stars-selected", questionRoot, t, comparer);
    });
  });

  test.skip("Check rating stars disabled question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "stars",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
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
  test("Check rating stars question - baseunit", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => {
        document.body.focus();
        document.body.style.setProperty("--base-unit", "4px");
      });

      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "stars",
            displayMode: "buttons",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await focusBody();
      await takeElementScreenshot("question-rating-stars-baseunit.png", questionRoot, t, comparer);
    });
  });
  test("Check rating smileys question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "smileys",
            rateColorMode: "default",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await focusBody();
      await takeElementScreenshot("question-rating-smileys.png", questionRoot, t, comparer);
      await ClientFunction(() => { (<HTMLElement>document.querySelector(".sd-rating__item-smiley input")).focus(); })();
      await takeElementScreenshot("question-rating-smileys-focus.png", questionRoot, t, comparer);
      await t.hover(Selector(".sd-rating__item-smiley").nth(3));
      await takeElementScreenshot("question-rating-smileys-focus-hovered.png", questionRoot, t, comparer);
      await t.click(Selector(".sd-rating__item-smiley").nth(3));
      await takeElementScreenshot("question-rating-smileys-focus-selected.png", questionRoot, t, comparer);
      await t.hover(Selector(".sd-rating__item-smiley").nth(1));
      await takeElementScreenshot("question-rating-smileys-unhovered.png", questionRoot, t, comparer);
      await focusBody();
      await t.hover(Selector(".sd-body"), { offsetX: 0, offsetY: 0 });
      await takeElementScreenshot("question-rating-smileys-selected", questionRoot, t, comparer);
    });
  });

  test("Check rating smileys rate colored question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "smileys",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await focusBody();
      await takeElementScreenshot("question-rating-smileys-rate-colored.png", questionRoot, t, comparer);
      await ClientFunction(() => { (<HTMLElement>document.querySelector(".sd-rating__item-smiley input")).focus(); })();
      await takeElementScreenshot("question-rating-smileys-rate-colored-focus.png", questionRoot, t, comparer);
      await t.hover(Selector(".sd-rating__item-smiley").nth(3));
      await takeElementScreenshot("question-rating-smileys-rate-colored-focus-hovered.png", questionRoot, t, comparer);
      await t.click(Selector(".sd-rating__item-smiley").nth(3));
      await takeElementScreenshot("question-rating-smileys-rate-colored-focus-selected.png", questionRoot, t, comparer);
      await t.hover(Selector(".sd-rating__item-smiley").nth(1));
      await takeElementScreenshot("question-rating-smileys-rate-colored-unhovered.png", questionRoot, t, comparer);
      await focusBody();
      await t.hover(Selector(".sd-body"), { offsetX: 0, offsetY: 0 });
      await takeElementScreenshot("question-rating-smileys-rate-colored-selected", questionRoot, t, comparer);
    });
  });

  test("Check rating smileys scale colored question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "smileys",
            scaleColorMode: "colored",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await focusBody();
      await takeElementScreenshot("question-rating-smileys-scale-colored.png", questionRoot, t, comparer);
      await ClientFunction(() => { (<HTMLElement>document.querySelector(".sd-rating__item-smiley input")).focus(); })();
      await takeElementScreenshot("question-rating-smileys-scale-colored-focus.png", questionRoot, t, comparer);
      await t.hover(Selector(".sd-rating__item-smiley").nth(3));
      await takeElementScreenshot("question-rating-smileys-scale-colored-focus-hovered.png", questionRoot, t, comparer);
      await t.click(Selector(".sd-rating__item-smiley").nth(3));
      await takeElementScreenshot("question-rating-smileys-scale-colored-focus-selected.png", questionRoot, t, comparer);
      await t.hover(Selector(".sd-rating__item-smiley").nth(1));
      await takeElementScreenshot("question-rating-smileys-scale-colored-unhovered.png", questionRoot, t, comparer);
      await focusBody();
      await t.hover(Selector(".sd-body"), { offsetX: 0, offsetY: 0 });
      await takeElementScreenshot("question-rating-smileys-scale-colored-selected", questionRoot, t, comparer);
    });
  });

  test("Check rating smileys scale colored question themes", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });

      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "smileys",
            scaleColorMode: "colored",
            defaultValue: "1",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px"
          }
        ]
      });

      await ClientFunction(() => {
        const themeJson = {
          "cssVariables": {
            "--sjs-special-red": "orange",
            "--sjs-special-yellow": "magenta",
            "--sjs-special-green": "blue"
          },
          "isPanelless": false
        };
        window["survey"].applyTheme(themeJson);
      })();

      const questionRoot = Selector(".sd-question");
      await focusBody();
      await takeElementScreenshot("question-rating-smileys-scale-colored-theme", questionRoot, t, comparer);
    });
  });

  test("Check rating inner shadow", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });

      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "q1"
          }
        ]
      });

      await ClientFunction(() => {
        const themeJson = {
          "cssVariables": {
            "--sjs-shadow-small": "inset 0px 2px 0px 0px rgba(0, 0, 0, 1)",
            "--sjs-shadow-small-reset": "inset 0px 0px 0px 0px rgba(0, 0, 0, 1)"
          },
          "isPanelless": false
        };
        window["survey"].applyTheme(themeJson);
      })();

      const questionRoot = Selector(".sd-rating");
      await focusBody();
      await takeElementScreenshot("rating-inner-shadow", questionRoot, t, comparer);
    });
  });

  test.skip("Check rating smileys disabled question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "smileys",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            defaultValue: 2,
            readOnly: true
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await focusBody();
      await takeElementScreenshot("question-rating-smileys-selected-disabled.png", questionRoot, t, comparer);
    });
  });

  test("Check rating smileys error question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "smileys",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            isRequired: true
          },
          {
            type: "rating",
            name: "satisfaction",
            title: "Rating",
            rateType: "smileys",
            scaleColorMode: "colored",
            rateMax: 5,
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            isRequired: true
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await t.click(Selector("input[value=Complete]"));
      await focusBody();
      await takeElementScreenshot("question-rating-smileys-required.png", questionRoot.nth(0), t, comparer);
      await t.hover(questionRoot.nth(0).find(".sd-rating__item-smiley").nth(1));
      await takeElementScreenshot("question-rating-smileys-required-hover.png", questionRoot.nth(0), t, comparer);
      await takeElementScreenshot("question-rating-smileys-colored-required.png", questionRoot.nth(1), t, comparer);
      await t.hover(questionRoot.nth(1).find(".sd-rating__item-smiley").nth(1));
      await takeElementScreenshot("question-rating-smileys-colored-required-hover.png", questionRoot.nth(1), t, comparer);
    });
  });

  test("Check rating smileys and stars in matrix", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework,

        {
          widthMode: "static",
          questions: [
            {
              "type": "matrixdropdown",
              "name": "question7",
              "columns": [
                {
                  "name": "Column 1",
                  "cellType": "rating",
                  "rateType": "stars"
                },
                {
                  "name": "Column 2",
                  "cellType": "rating",
                  "rateType": "smileys"
                }
              ],
              "choices": [
                1,
                2,
                3,
                4,
                5
              ],
              "rows": [
                "Row 1"
              ]
            }
          ]
        }
      );

      const questionRoot = Selector(".sd-question--table");
      await focusBody();
      await takeElementScreenshot("question-rating-smileys-stars-in-matrix", questionRoot, t, comparer);

      const questionStars = Selector(".sd-rating").nth(0);
      await focusBody();
      await takeElementScreenshot("question-rating-stars-small.png", questionStars, t, comparer);
      await ClientFunction(() => { (<HTMLElement>document.querySelector(".sd-rating__item-star input")).focus(); })();
      await takeElementScreenshot("question-rating-stars-small-focus.png", questionStars, t, comparer);
      await t.hover(Selector(".sd-rating__item-star").nth(3));
      await takeElementScreenshot("question-rating-stars-small-focus-hovered.png", questionStars, t, comparer);
      await t.click(Selector(".sd-rating__item-star").nth(3));
      await takeElementScreenshot("question-rating-stars-small-focus-selected.png", questionStars, t, comparer);
      await t.hover(Selector(".sd-rating__item-star").nth(1));
      await takeElementScreenshot("question-rating-stars-small-unhovered.png", questionStars, t, comparer);
      await focusBody();
      await t.hover(Selector(".sd-body"), { offsetX: 0, offsetY: 0 });
      await takeElementScreenshot("question-rating-stars-small-selected", questionStars, t, comparer);

      const questionSmileys = Selector(".sd-rating").nth(1);
      await focusBody();
      await takeElementScreenshot("question-rating-smileys-small.png", questionSmileys, t, comparer);
      await ClientFunction(() => { (<HTMLElement>document.querySelector(".sd-rating__item-smiley input")).focus(); })();
      await takeElementScreenshot("question-rating-smileys-small-focus.png", questionSmileys, t, comparer);
      await t.hover(Selector(".sd-rating__item-smiley").nth(3));
      await takeElementScreenshot("question-rating-smileys-small-focus-hovered.png", questionSmileys, t, comparer);
      await t.click(Selector(".sd-rating__item-smiley").nth(3));
      await takeElementScreenshot("question-rating-smileys-small-focus-selected.png", questionSmileys, t, comparer);
      await t.hover(Selector(".sd-rating__item-smiley").nth(1));
      await takeElementScreenshot("question-rating-smileys-small-unhovered.png", questionSmileys, t, comparer);
      await focusBody();
      await t.hover(Selector(".sd-body"), { offsetX: 0, offsetY: 0 });
      await takeElementScreenshot("question-rating-smileys-small-selected", questionSmileys, t, comparer);

    });
  });
  test("Check rating rate descriptions position", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [
          {
            "type": "rating",
            "name": "question2",
            "title": "How likely are you to recommend us to a friend or colleague?",
            "rateMax": 10,
            "minRateDescription": "Not at all likely",
            "maxRateDescription": "Extremely likely",
            "rateDescriptionLocation": "top"
          },
          {
            "type": "rating",
            "name": "question3",
            "title": "How likely are you to recommend us to a friend or colleague?",
            "rateMax": 10,
            "minRateDescription": "Not at all likely",
            "maxRateDescription": "Extremely likely",
            "rateDescriptionLocation": "bottom"
          },
          {
            "type": "rating",
            "name": "question4",
            "title": "How likely are you to recommend us to a friend or colleague?",
            "rateMax": 10,
            "minRateDescription": "Not at all likely",
            "maxRateDescription": "Extremely likely",
            "rateDescriptionLocation": "topBottom"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("question-rating-labels-top.png", questionRoot.nth(0), t, comparer);
      await takeElementScreenshot("question-rating-labels-bottom.png", questionRoot.nth(1), t, comparer);
      await takeElementScreenshot("question-rating-labels-diagonal.png", questionRoot.nth(2), t, comparer);
    });
  });

});
