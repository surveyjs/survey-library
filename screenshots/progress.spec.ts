import { test } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot } from "../e2e/helper";

const title = "Survey Progress Screenshot";

const testedPages = [{
  name: "page1",
  title: "Test",
  elements: [
    {
      name: "q1",
      type: "text"
    }
  ]
}];

const json = {
  showQuestionNumbers: "on",
  focusFirstQuestionAutomatic: true,
  "title": "Minimum data reporting form – for suspected and probable cases of COVID-19",
  "pages": [{
    "name": "page1",
    "navigationTitle": "Sign In",
    "navigationDescription": "... to continue purchasing.",
    "elements": [
      {
        "name": "q1",
        type: "text"
      }
    ]
  }, {
    "name": "page2",
    "navigationTitle": "Shipping information",
    "title": "Shipping",
    "navigationDescription": "Enter shipping information.",
    "elements": [
      {
        "type": "radiogroup",
        "name": "q1",
        "title": "Select a shipping method.",
        "choices": ["FedEx", "DHL", "USP", "In-Store Pickup"]
      },
    ]
  }, {
    "name": "page3",
    "navigationTitle": "Payment method",
    "navigationDescription": "Select a payment method.",
    "elements": [
      {
        "name": "q1",
        type: "text"
      }
    ]
  }, {
    "name": "page4",
    "navigationTitle": "Gift Options",
    "navigationDescription": "Choose your gift.",
    "elements": [
      {
        "name": "q1",
        type: "text"
      }
    ]
  }, {
    "name": "page5",
    "navigationTitle": "Place Order",
    "navigationDescription": "Finish your purchasing.",
    "elements": [{
      "name": "q1",
      type: "text"
    }]
  }],
  "showProgressBar": "top",
  "progressBarType": "buttons"
};

const applyHeaderAccentBackgroundColor = async (page) => {
  await page.evaluate(() => {
    window["survey"].applyTheme({
      "header": { "inheritWidthFrom": "container" },
      "cssVariables": { "--sjs-header-backcolor": "var(--sjs-primary-backcolor)" }
    });
  });
};

frameworks.forEach(framework => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${url}${framework}`);
  });

  test.describe(`${framework} ${title}`, () => {
    test("Check survey with progress top", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";

      await initSurvey(page, framework, newJSON);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.currentPageNo = 1;
      });

      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top.png");
    });

    test("Check survey with progress bottom", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const newJSON = { ...json };
      newJSON.showProgressBar = "bottom";
      newJSON.progressBarType = "pages";

      await initSurvey(page, framework, newJSON);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.currentPageNo = 1;
      });

      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-bottom.png");
    });

    test("Check survey with progress bottom with brand info and fit to container", async ({ page }) => {
      await page.setViewportSize({ width: 1800, height: 1000 });
      const newJSON = { ...json };
      newJSON["showBrandInfo"] = true;
      newJSON["fitToContainer"] = true;
      newJSON.showProgressBar = "bottom";
      newJSON.progressBarType = "pages";

      await initSurvey(page, framework, newJSON);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        const container = document.getElementById("surveyElement");
        if (container) {
          container.style.position = "fixed";
          container.style.top = "0";
          container.style.bottom = "0";
          container.style.left = "0";
          container.style.right = "0";
        }
        (<any>window).survey.currentPageNo = 1;
      });
      await page.waitForLoadState("networkidle");

      await compareScreenshot(page, "#surveyElement", "survey-progress-bar-bottom-brand.png");
    });

    test("Check survey with progress top buttons", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);
      await applyHeaderAccentBackgroundColor(page);

      await page.click("li:nth-child(2)");
      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-buttons.png");

      await page.setViewportSize({ width: 600, height: 1000 });
      await page.waitForTimeout(500);
      await page.setViewportSize({ width: 500, height: 1080 });
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-buttons-mobile.png");
    });

    test("Check survey with progress top buttons with numbers", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.progressBarShowPageNumbers = true;
      });

      await page.click("li:nth-child(2)");
      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-numbered-buttons.png");

      await page.setViewportSize({ width: 600, height: 1000 });
      await page.waitForTimeout(500);
      await page.setViewportSize({ width: 500, height: 1080 });
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-numbered-buttons-mobile.png");
    });

    test("Check survey with progress top and bottom buttons", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.showProgressBar = "topBottom";
      });

      await page.click("li:nth-child(2)");
      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-bottom-buttons.png");

      await page.setViewportSize({ width: 600, height: 1000 });
      await page.waitForTimeout(500);
      await page.setViewportSize({ width: 500, height: 1080 });
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-bottom-buttons-mobile.png");
    });

    test("Check survey with progress top and TOC", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const newJSON = { ...json };
      newJSON["showTOC"] = true;
      newJSON.progressBarType = "pages";

      await initSurvey(page, framework, newJSON);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.currentPageNo = 1;
      });

      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-and-toc.png");
    });

    test("Check survey without title and with progress", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        pages: testedPages,
        showProgressBar: "top"
      });
      await applyHeaderAccentBackgroundColor(page);

      await compareScreenshot(page, ".sd-container-modern", "survey-without-title-and-with-progress.png");
    });

    test("Check survey without title and progress", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        pages: testedPages
      });
      await applyHeaderAccentBackgroundColor(page);

      await compareScreenshot(page, ".sd-container-modern", "survey-without-title-and-progress.png");
    });

    test("Check survey with title and without progress", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        title: "Test",
        pages: testedPages
      });
      await applyHeaderAccentBackgroundColor(page);

      await compareScreenshot(page, ".sd-container-modern", "survey-with-title-and-without-progress.png");
    });

    test("Check survey progress bar freezes on top", async ({ page }) => {
      // if (["knockout", "react", "angular"].includes(framework)) { // TODO: reanimate Vue after Vue3 supported
      const json = {
        "title": "American History",
        "showProgressBar": "top",
        showQuestionNumbers: "on",
        "pages": [
          {
            "elements": [
              {
                "type": "radiogroup",
                "name": "civilwar",
                "title": "When was the American Civil War?",
                "choices": [
                  "1796-1803",
                  "1810-1814",
                  "1861-1865",
                  "1939-1945"
                ],
                "correctAnswer": "1861-1865"
              },
              {
                "type": "radiogroup",
                "name": "libertyordeath",
                "title": "Whose quote is this: \"Give me liberty, or give me death\"?",
                "choices": [
                  "John Hancock",
                  "James Madison",
                  "Patrick Henry",
                  "Samuel Adams"
                ],
                "correctAnswer": "Patrick Henry"
              },
              {
                "type": "radiogroup",
                "name": "magnacarta",
                "title": "What is Magna Carta?",
                "choices": [
                  "The foundation of the British parliamentary system",
                  "The Great Seal of the monarchs of England",
                  "The French Declaration of the Rights of Man",
                  "The charter signed by the Pilgrims on the Mayflower"
                ],
                "correctAnswer": "The foundation of the British parliamentary system"
              }
            ]
          }
        ]
      };
      await page.setViewportSize({ width: 1500, height: 720 });
      await initSurvey(page, framework, json);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        const surveyElement = document.getElementById("surveyElement");
        if (surveyElement) {
          surveyElement.style.height = "90vh";
          surveyElement.style.overflowY = "auto";
          document.querySelector("[data-name='libertyordeath']")?.scrollIntoView(true);
        }
      });

      await compareScreenshot(page, "body", "survey-progress-top-freeze.png");
      // }
    });

    test("Check survey with custom navigation", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";

      await initSurvey(page, framework, newJSON);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.currentPageNo = 1;
        (<any>window).survey.addNavigationItem({
          title: "Save",
          action: () => { }
        });
      });

      await compareScreenshot(page, ".sd-container-modern", "survey-custom-navigation.png");
    });

    test("Check survey with progress top pages - hover", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";

      await initSurvey(page, framework, newJSON);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.currentPageNo = 1;
      });

      await page.hover(".sd-progress-buttons__list li:nth-child(1)");
      await compareScreenshot(page, ".sd-progress-buttons", "survey-progress-bar-hover-visited.png");

      await page.hover(".sd-progress-buttons__list li:nth-child(2)");
      await compareScreenshot(page, ".sd-progress-buttons", "survey-progress-bar-hover-current.png");

      await page.hover(".sd-progress-buttons__list li:nth-child(3)");
      await compareScreenshot(page, ".sd-progress-buttons", "survey-progress-bar-hover-next.png");
    });

    test("Check survey with progress top buttons - hover", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.currentPageNo = 1;
        window["survey"].progressBarShowPageNumbers = true;
      });

      await page.hover(".sd-progress-buttons__list li:nth-child(1)");
      await compareScreenshot(page, ".sd-progress-buttons", "survey-progress-bar-buttons-hover-visited.png");

      await page.hover(".sd-progress-buttons__list li:nth-child(2)");
      await compareScreenshot(page, ".sd-progress-buttons", "survey-progress-bar-buttons-hover-current.png");

      await page.hover(".sd-progress-buttons__list li:nth-child(3)");
      await compareScreenshot(page, ".sd-progress-buttons", "survey-progress-bar-buttons-hover-next.png");
    });

    test("Check survey with progress top - progressBarInheritWidthFrom modes", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      const newJSON = { ...json };
      newJSON.progressBarType = "pages";
      newJSON["progressBarInheritWidthFrom"] = "survey";
      newJSON["widthMode"] = "static";

      await initSurvey(page, framework, newJSON);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.currentPageNo = 1;
      });

      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-survey-width-static.png");

      await page.evaluate(() => {
        window["survey"].width = "1400px";
      });

      await page.setViewportSize({ width: 1900, height: 1000 });
      await page.waitForTimeout(500);
      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-survey-width-static-1400.png");
    });

    test("Check survey with progress top - RTL", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";

      await page.evaluate(() => {
        document.body.setAttribute("dir", "rtl");
      });
      await initSurvey(page, framework, newJSON);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.currentPageNo = 1;
      });

      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-rtl.png");
    });

    test("Check survey with progress and bootstrap/tailwind", async ({ page }) => {
      await page.evaluate(() => {
        document.head.insertAdjacentHTML("beforeend", "<style>* { box-sizing: border-box; }</style>");
      });
      await page.setViewportSize({ width: 800, height: 1080 });
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";

      await initSurvey(page, framework, newJSON);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        (<any>window).survey.currentPageNo = 1;
      });

      await compareScreenshot(page, ".sd-progress-buttons__list", "survey-progress-bar-bootstrap.png");

      await page.evaluate(() => {
        window["survey"].progressBarShowPageNumbers = true;
      });
      await compareScreenshot(page, ".sd-progress-buttons__list", "survey-progress-bar-bootstrap-numbers.png");
    });

    test("Check survey with progress top pages - sticky", async ({ page }) => {
      const surveyJson = {
        showQuestionNumbers: "on",
        title: "Survey Title",
        showProgressBar: "top",
        progressBarType: "pages",
        pages: [
          {
            name: "p1",
            elements: [
              { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" },
              { type: "text", name: "q1" }, { type: "text", name: "q1" },
            ]
          },
          {
            name: "p2",
            elements: [
              { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" },
              { type: "text", name: "q1" }, { type: "text", name: "q1" },
            ]
          }
        ]
      };

      await initSurvey(page, framework, surveyJson);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        const element = document.querySelector("#surveyElement") as HTMLElement;
        if (element) {
          element.style.height = "calc(100vh - 32px)";
        }
        window["survey"].currentPageNo = 1;
      });
      await page.waitForTimeout(500);
      await page.setViewportSize({ width: 800, height: 600 });
      await page.waitForTimeout(500);
      const scroller = page.locator(".sd-root-modern--full-container > .sv-scroll__wrapper > .sv-scroll__scroller");
      await scroller.evaluate((el) => el.scrollTo(0, 500));
      await page.waitForTimeout(1000);
      await compareScreenshot(page, "#surveyElement", "survey-progress-bar-top-pages-sticky.png");
    });

    test("Check survey with progress top questions - sticky", async ({ page }) => {
      const surveyJson = {
        showQuestionNumbers: "on",
        title: "Survey Title",
        showProgressBar: "top",
        progressBarType: "questions",
        pages: [
          {
            name: "p1",
            elements: [
              { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" },
              { type: "text", name: "q1" }, { type: "text", name: "q1" },
            ]
          },
          {
            name: "p2",
            elements: [
              { type: "text", name: "q2" }, { type: "text", name: "q2" }, { type: "text", name: "q2" },
              { type: "text", name: "q2" }, { type: "text", name: "q2" },
            ]
          }
        ]
      };

      await initSurvey(page, framework, surveyJson);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        const element = document.querySelector("#surveyElement") as HTMLElement;
        if (element) {
          element.style.height = "calc(100vh - 32px)";
        }
        (<any>window).survey.data = { q1: "answer" };
        (<any>window).survey.currentPageNo = 1;
      });
      await page.setViewportSize({ width: 800, height: 600 });
      const scroller = page.locator(".sd-root-modern--full-container > .sv-scroll__wrapper > .sv-scroll__scroller");
      await scroller.evaluate((el) => el.scrollTo(0, 500));

      await page.waitForTimeout(1000);
      await compareScreenshot(page, "#surveyElement", "survey-progress-bar-top-questions-sticky.png");
    });

    test("Check progress top buttons sticky has background", async ({ page }) => {
      await page.setViewportSize({ width: 1400, height: 800 });
      const surveyJson = {
        showQuestionNumbers: "on",
        title: "Sample Survey",
        logoPosition: "right",
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "boolean",
                name: "question1",
                title: "Show Page 2?",
                defaultValue: "true"
              },
              {
                type: "radiogroup",
                name: "question4",
                choices: [
                  "Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7"
                ]
              },
              {
                type: "matrixdropdown",
                name: "question5",
                columns: [
                  { name: "Column 1" },
                  { name: "Column 2" },
                  { name: "Column 3" }
                ],
                choices: [1, 2, 3, 4, 5],
                rows: [
                  "Row 1", "Row 2", "Row 3", "Row 4", "Row 5",
                  "Row 6", "Row 7", "Row 8", "Row 9", "Row 10"
                ]
              }
            ],
            title: "Page 1"
          },
          {
            name: "page2",
            elements: [
              {
                type: "boolean",
                name: "question2",
                title: "Show Page 3?",
                defaultValue: "true"
              }
            ],
            visibleIf: "{question1} = true",
            title: "Page 2"
          },
          {
            name: "page3",
            elements: [
              {
                type: "text",
                name: "question3"
              }
            ],
            visibleIf: "{question2} = true",
            title: "Page 3"
          }
        ],
        showProgressBar: "belowheader",
        progressBarType: "buttons",
        progressBarShowPageTitles: true,
        widthMode: "static",
        width: "800px"
      };
      await initSurvey(page, framework, surveyJson);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        const element = document.querySelector("#surveyElement") as HTMLElement;
        if (element) {
          element.style.height = "calc(100vh - 32px)";
        }
      });

      await page.waitForTimeout(500);
      const scroller = page.locator(".sd-root-modern--full-container > .sv-scroll__wrapper > .sv-scroll__scroller");
      await scroller.evaluate((el) => el.scrollTo(0, 300));

      await compareScreenshot(page, ".sd-progress-buttons", "survey-progress-bar-top-buttons-sticky-background.png");
    });

    test("Check survey with progress top buttons with numbers and background", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);
      await applyHeaderAccentBackgroundColor(page);
      await page.evaluate(() => {
        const theme = {
          "themeName": "doubleborder",
          "colorPalette": "light",
          "isPanelless": false,
          "backgroundImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEAeAB4AAD//gASTEVBRFRPT0xTIHYyMC4wAP/bAIQABQUFCAUIDAcHDAwJCQkMDQwMDAwNDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQEFCAgKBwoMBwcMDQwKDA0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0N/8QBogAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoLAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+hEAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/8AAEQgClAJfAwERAAIRAQMRAf/aAAwDAQACEQMRAD8Aq18af0qFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAH/9k=",
          "backgroundOpacity": 1,
          "backgroundImageAttachment": "scroll",
          "backgroundImageFit": "cover",
          "cssVariables": {
            "--sjs-corner-radius": "4px",
            "--sjs-base-unit": "8px",
            "--sjs-shadow-small": "0px 0px 0px 2px rgba(0, 0, 0, 0.07)",
            "--sjs-shadow-inner": "0px 0px 0px 2px rgba(0, 0, 0, 0.1)",
            "--sjs-border-default": "rgba(0, 0, 0, 0.1)",
            "--sjs-border-light": "rgba(0, 0, 0, 0.1)",
            "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
            "--sjs-general-backcolor-dark": "rgba(239, 239, 239, 1)",
            "--sjs-general-backcolor-dim-light": "rgba(255, 255, 255, 1)",
            "--sjs-general-backcolor-dim-dark": "rgba(237, 237, 237, 1)",
            "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
            "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
            "--sjs-general-dim-forecolor": "rgba(0, 0, 0, 0.91)",
            "--sjs-general-dim-forecolor-light": "rgba(0, 0, 0, 0.45)",
            "--sjs-secondary-backcolor": "rgba(255, 152, 20, 1)",
            "--sjs-secondary-backcolor-light": "rgba(255, 152, 20, 0.1)",
            "--sjs-secondary-backcolor-semi-light": "rgba(255, 152, 20, 0.25)",
            "--sjs-secondary-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-secondary-forecolor-light": "rgba(255, 255, 255, 0.25)",
            "--sjs-shadow-small-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.07)",
            "--sjs-shadow-medium": "0px 0px 0px 2px rgba(0, 0, 0, 0.08),0px 2px 6px 0px rgba(0, 0, 0, 0.04)",
            "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.08)",
            "--sjs-shadow-inner-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.1)",
            "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
            "--sjs-special-red-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-special-green": "rgba(25, 179, 148, 1)",
            "--sjs-special-green-light": "rgba(25, 179, 148, 0.1)",
            "--sjs-special-green-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-special-blue": "rgba(67, 127, 217, 1)",
            "--sjs-special-blue-light": "rgba(67, 127, 217, 0.1)",
            "--sjs-special-blue-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-special-yellow": "rgba(255, 152, 20, 1)",
            "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)",
            "--sjs-special-yellow-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-article-font-xx-large-textDecoration": "none",
            "--sjs-article-font-xx-large-fontWeight": "700",
            "--sjs-article-font-xx-large-fontStyle": "normal",
            "--sjs-article-font-xx-large-fontStretch": "normal",
            "--sjs-article-font-xx-large-letterSpacing": "0",
            "--sjs-article-font-xx-large-lineHeight": "64px",
            "--sjs-article-font-xx-large-paragraphIndent": "0px",
            "--sjs-article-font-xx-large-textCase": "none",
            "--sjs-article-font-x-large-textDecoration": "none",
            "--sjs-article-font-x-large-fontWeight": "700",
            "--sjs-article-font-x-large-fontStyle": "normal",
            "--sjs-article-font-x-large-fontStretch": "normal",
            "--sjs-article-font-x-large-letterSpacing": "0",
            "--sjs-article-font-x-large-lineHeight": "56px",
            "--sjs-article-font-x-large-paragraphIndent": "0px",
            "--sjs-article-font-x-large-textCase": "none",
            "--sjs-article-font-large-textDecoration": "none",
            "--sjs-article-font-large-fontWeight": "700",
            "--sjs-article-font-large-fontStyle": "normal",
            "--sjs-article-font-large-fontStretch": "normal",
            "--sjs-article-font-large-letterSpacing": "0",
            "--sjs-article-font-large-lineHeight": "40px",
            "--sjs-article-font-large-paragraphIndent": "0px",
            "--sjs-article-font-large-textCase": "none",
            "--sjs-article-font-medium-textDecoration": "none",
            "--sjs-article-font-medium-fontWeight": "700",
            "--sjs-article-font-medium-fontStyle": "normal",
            "--sjs-article-font-medium-fontStretch": "normal",
            "--sjs-article-font-medium-letterSpacing": "0",
            "--sjs-article-font-medium-lineHeight": "32px",
            "--sjs-article-font-medium-paragraphIndent": "0px",
            "--sjs-article-font-medium-textCase": "none",
            "--sjs-article-font-default-textDecoration": "none",
            "--sjs-article-font-default-fontWeight": "400",
            "--sjs-article-font-default-fontStyle": "normal",
            "--sjs-article-font-default-fontStretch": "normal",
            "--sjs-article-font-default-letterSpacing": "0",
            "--sjs-article-font-default-lineHeight": "28px",
            "--sjs-article-font-default-paragraphIndent": "0px",
            "--sjs-article-font-default-textCase": "none",
            "--sjs-general-backcolor-dim": "rgba(245, 245, 245, 1)",
            "--sjs-primary-backcolor": "rgba(76, 100, 137, 1)",
            "--sjs-primary-backcolor-dark": "rgba(62, 83, 115, 1)",
            "--sjs-primary-backcolor-light": "rgba(76, 100, 137, 0.1)",
            "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
            "--sjs-special-red": "rgba(229, 10, 62, 1)",
            "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)",
            "--sjs-font-headertitle-color": "rgba(255, 255, 255, 0.6)",
            "--sjs-header-backcolor": "transparent"
          },
          "header": {
            "height": 200,
            "textAreaWidth": 550,
            "logoPositionY": "middle",
            "titlePositionY": "middle"
          },
          "headerView": "basic"
        };
        (<any>window).survey.progressBarShowPageNumbers = true;
        (<any>window).survey.applyTheme(theme);
      });

      await page.locator("li").nth(1).click();

      // Desktop screenshot
      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-numbered-buttons-background.png");

      await page.setViewportSize({ width: 600, height: 1000 });
      await page.waitForTimeout(500);
      await page.setViewportSize({ width: 500, height: 1080 });
      await page.waitForTimeout(500);

      // Mobile screenshot
      await compareScreenshot(page, ".sd-container-modern", "survey-progress-bar-top-numbered-buttons-mobile-background.png");
    });
  });
});