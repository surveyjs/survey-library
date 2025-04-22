import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

frameworks.forEach(framework => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${url}${framework}`);
  });

  test.describe(`${framework} Rating Screenshot`, () => {
    test("Check rating question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating.png");
      await page.evaluate(() => { (<HTMLElement>document.querySelector(".sd-rating__item input")).focus(); });
      await expect(questionRoot).toHaveScreenshot("question-rating-focus.png");
      await page.click(".sd-rating__item");
      await expect(questionRoot).toHaveScreenshot("question-rating-focus-selected.png");
      await resetFocusToBody(page);
      await expect(questionRoot).toHaveScreenshot("question-rating-selected");
    });

    test.skip("Check rating disabled question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);
      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-selected-disabled.png");
    });

    test("Check rating question with many items", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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

      await resetFocusToBody(page);
      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-many.png");
    });

    test("Check rating question as dropdown", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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

      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-dropdown.png");

      const questionDropdownSelect = page.locator(".sd-input.sd-dropdown");
      const popupContainer = page.locator(".sv-popup__container");
      await questionDropdownSelect.click();
      await expect(popupContainer).toHaveScreenshot("question-rating-dropdown-popup.png", { timeout: 5000 });
    });

    test("Check rating question - long items", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-long-items.png");
    });

    test("Check rating question - long items, button mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-long-items-buttons.png");
    });

    test("Check big rating in panel", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 1080 });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-panel");
      await expect(questionRoot).toHaveScreenshot("long-rating-in-panel.png");
    });

    test("Check big rating in matrix", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
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
        }]
      });
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-table");
      await expect(questionRoot).toHaveScreenshot("rating-in-matrix.png");
    });

    test("Check rating stars question", async ({ page }) => {
      await page.evaluate(() => {
        document.head.insertAdjacentHTML("beforeend", "<style>* { box-sizing: border-box; }</style>");
      });
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-stars.png");
      await page.evaluate(() => { (<HTMLElement>document.querySelector(".sd-rating__item-star input")).focus(); });
      await expect(questionRoot).toHaveScreenshot("question-rating-stars-focus.png");
      await page.hover(".sd-rating__item-star >> nth=3");
      await expect(questionRoot).toHaveScreenshot("question-rating-stars-focus-hovered.png");
      await page.click(".sd-rating__item-star >> nth=3");
      await expect(questionRoot).toHaveScreenshot("question-rating-stars-focus-selected.png");
      await page.hover(".sd-rating__item-star >> nth=1");
      await expect(questionRoot).toHaveScreenshot("question-rating-stars-unhovered.png");
      await resetFocusToBody(page);
      await page.hover(".sd-body", { position: { x: 0, y: 0 } });
      await expect(questionRoot).toHaveScreenshot("question-rating-stars-selected");
    });

    test.skip("Check rating stars disabled question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-stars-selected-disabled.png");
    });

    test("Check rating stars question - baseunit", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        document.body.style.setProperty("--base-unit", "4px");
      });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-stars-baseunit.png");
    });

    test("Check rating smileys question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys.png");
      await page.evaluate(() => { (<HTMLElement>document.querySelector(".sd-rating__item-smiley input")).focus(); });
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-focus.png");
      await page.hover(".sd-rating__item-smiley >> nth=3");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-focus-hovered.png");
      await page.click(".sd-rating__item-smiley >> nth=3");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-focus-selected.png");
      await page.hover(".sd-rating__item-smiley >> nth=1");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-unhovered.png");
      await resetFocusToBody(page);
      await page.hover(".sd-body", { position: { x: 0, y: 0 } });
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-selected");
    });

    test("Check rating smileys rate colored question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-rate-colored.png");
      await page.evaluate(() => { (<HTMLElement>document.querySelector(".sd-rating__item-smiley input")).focus(); });
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-rate-colored-focus.png");
      await page.hover(".sd-rating__item-smiley >> nth=3");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-rate-colored-focus-hovered.png");
      await page.click(".sd-rating__item-smiley >> nth=3");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-rate-colored-focus-selected.png");
      await page.hover(".sd-rating__item-smiley >> nth=1");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-rate-colored-unhovered.png");
      await resetFocusToBody(page);
      await page.hover(".sd-body", { position: { x: 0, y: 0 } });
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-rate-colored-selected");
    });

    test("Check rating smileys scale colored question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-scale-colored.png");
      await page.evaluate(() => { (<HTMLElement>document.querySelector(".sd-rating__item-smiley input")).focus(); });
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-scale-colored-focus.png");
      await page.hover(".sd-rating__item-smiley >> nth=3");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-scale-colored-focus-hovered.png");
      await page.click(".sd-rating__item-smiley >> nth=3");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-scale-colored-focus-selected.png");
      await page.hover(".sd-rating__item-smiley >> nth=1");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-scale-colored-unhovered.png");
      await resetFocusToBody(page);
      await page.hover(".sd-body", { position: { x: 0, y: 0 } });
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-scale-colored-selected");
    });

    test("Check rating smileys scale colored question themes", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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

      await page.evaluate(() => {
        const themeJson = {
          "cssVariables": {
            "--sjs-special-red": "orange",
            "--sjs-special-yellow": "magenta",
            "--sjs-special-green": "blue"
          },
          "isPanelless": false
        };
        window["survey"].applyTheme(themeJson);
      });

      await resetFocusToBody(page);
      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-scale-colored-theme");
    });

    test("Check rating inner shadow", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        width: "900px",
        questions: [{ type: "rating", name: "q1" }]
      });

      await page.evaluate(() => {
        const themeJson = {
          "cssVariables": {
            "--sjs-shadow-small": "inset 0px 2px 0px 0px rgba(0, 0, 0, 1)",
            "--sjs-shadow-small-reset": "inset 0px 0px 0px 0px rgba(0, 0, 0, 1)"
          },
          "isPanelless": false
        };
        window["survey"].applyTheme(themeJson);
      });
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-rating");
      await expect(questionRoot).toHaveScreenshot("rating-inner-shadow");
    });

    test.skip("Check rating smileys disabled question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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

      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-selected-disabled.png");
    });

    test("Check rating smileys error question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question");
      await page.click("input[value=Complete]");
      await expect(questionRoot.nth(0)).toHaveScreenshot("question-rating-smileys-required.png");
      await page.hover(questionRoot.nth(0).locator(".sd-rating__item-smiley").nth(1));
      await expect(questionRoot.nth(0)).toHaveScreenshot("question-rating-smileys-required-hover.png");
      await expect(questionRoot.nth(1)).toHaveScreenshot("question-rating-smileys-colored-required.png");
      await page.hover(questionRoot.nth(1).locator(".sd-rating__item-smiley").nth(1));
      await expect(questionRoot.nth(1)).toHaveScreenshot("question-rating-smileys-colored-required-hover.png");
    });

    test("Check rating smileys and stars in matrix", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
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
            "choices": [1, 2, 3, 4, 5],
            "rows": ["Row 1"]
          }
        ]
      }
      );
      await resetFocusToBody(page);

      const questionRoot = page.locator(".sd-question--table");
      await expect(questionRoot).toHaveScreenshot("question-rating-smileys-stars-in-matrix");

      const questionStars = page.locator(".sd-rating").nth(0);
      await expect(questionStars).toHaveScreenshot("question-rating-stars-small.png");
      await page.evaluate(() => { (<HTMLElement>document.querySelector(".sd-rating__item-star input")).focus(); });
      await expect(questionStars).toHaveScreenshot("question-rating-stars-small-focus.png");
      await page.hover(".sd-rating__item-star >> nth=3");
      await expect(questionStars).toHaveScreenshot("question-rating-stars-small-focus-hovered.png");
      await page.click(".sd-rating__item-star >> nth=3");
      await expect(questionStars).toHaveScreenshot("question-rating-stars-small-focus-selected.png");
      await page.hover(".sd-rating__item-star >> nth=1");
      await expect(questionStars).toHaveScreenshot("question-rating-stars-small-unhovered.png");
      await resetFocusToBody(page);
      await page.hover(".sd-body", { position: { x: 0, y: 0 } });
      await expect(questionStars).toHaveScreenshot("question-rating-stars-small-selected");

      const questionSmileys = page.locator(".sd-rating").nth(1);
      await expect(questionSmileys).toHaveScreenshot("question-rating-smileys-small.png");
      await page.evaluate(() => { (<HTMLElement>document.querySelector(".sd-rating__item-smiley input")).focus(); });
      await expect(questionSmileys).toHaveScreenshot("question-rating-smileys-small-focus.png");
      await page.hover(".sd-rating__item-smiley >> nth=3");
      await expect(questionSmileys).toHaveScreenshot("question-rating-smileys-small-focus-hovered.png");
      await page.click(".sd-rating__item-smiley >> nth=3");
      await expect(questionSmileys).toHaveScreenshot("question-rating-smileys-small-focus-selected.png");
      await page.hover(".sd-rating__item-smiley >> nth=1");
      await expect(questionSmileys).toHaveScreenshot("question-rating-smileys-small-unhovered.png");
      await resetFocusToBody(page);
      await page.hover(".sd-body", { position: { x: 0, y: 0 } });
      await expect(questionSmileys).toHaveScreenshot("question-rating-smileys-small-selected");
    });

    test("Check rating rate descriptions position", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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

      const questionRoot = page.locator(".sd-question");
      await expect(questionRoot.nth(0)).toHaveScreenshot("question-rating-labels-top.png");
      await expect(questionRoot.nth(1)).toHaveScreenshot("question-rating-labels-bottom.png");
      await expect(questionRoot.nth(2)).toHaveScreenshot("question-rating-labels-diagonal.png");
    });

    test("Check rating selected label width", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    "type": "rating",
                    "name": "q",
                    "titleLocation": "hidden",
                    "defaultValue": "MMMMMMMMMMMMMM",
                    "isRequired": true,
                    "autoGenerate": false,
                    "rateCount": 2,
                    "rateValues": [
                      "MMMMMMMMMMMMMM",
                      "S"
                    ],
                    "displayMode": "buttons"
                  },
                  {
                    "type": "rating",
                    "name": "q1",
                    "titleLocation": "hidden",
                    "isRequired": true,
                    "autoGenerate": false,
                    "rateCount": 2,
                    "rateValues": [
                      "MMMMMMMMMMMMMM",
                      "S"
                    ],
                    "displayMode": "buttons"
                  }
                ]
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "500px"
      });

      const questionRoot = page.locator(".sd-panel__content");
      await expect(questionRoot.nth(0)).toHaveScreenshot("question-rating-selected-label-should-have-the-same-width.png");
    });
  });
});