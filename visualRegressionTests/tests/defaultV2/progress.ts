import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, takeElementScreenshot, wrapVisualTest } from "../../helper";

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

export const applyHeaderAccentBackgroundColor = ClientFunction(() => {
  window["survey"].applyTheme({
    "header": { "inheritWidthFrom": "container" },
    "cssVariables": { "--sjs-header-backcolor": "var(--sjs-primary-backcolor)" }
  });
});

fixture`${title}`.page`${url}`;

frameworks.forEach(framework => {
  fixture`${framework} ${title}`
    .page`${url}${framework}`;

  test("Check survey with progress top", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";

      await initSurvey(framework, newJSON);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-top.png", Selector(".sd-container-modern"), t, comparer); // title + progress
    });
  });
  test("Check survey with progress bottom", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const newJSON = { ...json };
      newJSON.showProgressBar = "bottom";
      newJSON.progressBarType = "pages";

      await initSurvey(framework, newJSON);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-bottom.png", Selector(".sd-container-modern"), t, comparer); // title + progress
    });
  });
  test("Check survey with progress bottom with brand info and fit to container", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1800, 1000);
      const newJSON = { ...json };
      newJSON["showBrandInfo"] = true;
      newJSON["fitToContainer"] = true;
      newJSON.showProgressBar = "bottom";
      newJSON.progressBarType = "pages";

      await initSurvey(framework, newJSON);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        const container = (<any>window).document.getElementById("surveyElement");
        container.style.position = "fixed";
        container.style.top = 0;
        container.style.bottom = 0;
        container.style.left = 0;
        container.style.right = 0;
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-bottom-brand.png", Selector("#surveyElement"), t, comparer); // title + progress
    });
  });
  test("Check survey with progress top buttons", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await applyHeaderAccentBackgroundColor();
      await t.click(Selector("li").nth(1));
      await takeElementScreenshot("survey-progress-bar-top-buttons.png", Selector(".sd-container-modern"), t, comparer);
      await t.resizeWindow(500, 1080);
      await t.resizeWindow(600, 1000);
      await t.resizeWindow(500, 1080);
      await takeElementScreenshot("survey-progress-bar-top-buttons-mobile.png", Selector(".sd-container-modern"), t, comparer);
    });
  });
  test("Check survey with progress top buttons with numbers", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.progressBarShowPageNumbers = true;
      })();
      await t.click(Selector("li").nth(1));
      await takeElementScreenshot("survey-progress-bar-top-numbered-buttons.png", Selector(".sd-container-modern"), t, comparer);
      await t.resizeWindow(500, 1080);
      await t.resizeWindow(600, 1000);
      await t.resizeWindow(500, 1080);
      await takeElementScreenshot("survey-progress-bar-top-numbered-buttons-mobile.png", Selector(".sd-container-modern"), t, comparer);
    });
  });
  test("Check survey with progress top and bottom buttons", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.showProgressBar = "topBottom";
      })();
      await t.click(Selector("li").nth(1));
      await takeElementScreenshot("survey-progress-bar-top-bottom-buttons.png", Selector(".sd-container-modern"), t, comparer);
      await t.resizeWindow(500, 1080);
      await t.resizeWindow(600, 1000);
      await t.resizeWindow(500, 1080);
      await takeElementScreenshot("survey-progress-bar-top-bottom-buttons-mobile.png", Selector(".sd-container-modern"), t, comparer);
    });
  });
  test("Check survey with progress top and TOC", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const newJSON = { ...json };
      newJSON["showTOC"] = true;
      newJSON.progressBarType = "pages";

      await initSurvey(framework, newJSON);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-top-and-toc.png", Selector(".sd-container-modern"), t, comparer); // title + progress
    });
  });
  test("Check survey without title and with progress", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        pages: testedPages,
        showProgressBar: "top"
      });
      await applyHeaderAccentBackgroundColor();
      await takeElementScreenshot("survey-without-tilte-and-with-progress.png", Selector(".sd-container-modern"), t, comparer); // progress
    });
  });
  test("Check survey without title and progress", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        pages: testedPages
      });
      await applyHeaderAccentBackgroundColor();
      await takeElementScreenshot("survey-without-tilte-and-progress.png", Selector(".sd-container-modern"), t, comparer); // without title and progress
    });
  });
  test("Check survey with title and without progress", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        title: "Test",
        pages: testedPages
      });
      await applyHeaderAccentBackgroundColor();
      await takeElementScreenshot("survey-with-tilte-and-without-progress.png", Selector(".sd-container-modern"), t, comparer); // title
    });
  });
  test("Check survey progress bar freezes on top", async (t) => {
    if (framework in ["knockout", "react", "angular"]) { // TODO: reanimate Vue after Vue3 supported
      await wrapVisualTest(t, async (t, comparer) => {
        await t.resizeWindow(1500, 720);
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
        await initSurvey(framework, json);
        await applyHeaderAccentBackgroundColor();
        await ClientFunction(() => {
          const surveyElement = document.getElementById("surveyElement");
          if (surveyElement) {
            surveyElement.style.height = "90vh";
            surveyElement.style.overflowY = "auto";
            document.querySelector("[data-name='libertyordeath']")?.scrollIntoView(true);
          }
        })();
        await takeElementScreenshot("survey-progress-top-freeze.png", Selector("body"), t, comparer);
      });
    }
  });
  test("Check survey with custom navigation", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";

      await initSurvey(framework, newJSON);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.currentPageNo = 1;
        (<any>window).survey.addNavigationItem({
          title: "Save",
          action: () => { }
        });
      })();
      await takeElementScreenshot("survey-custom-navigation.png", Selector(".sd-container-modern"), t, comparer);
    });
  });
  test("Check survey with progress top pages - hover", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";

      await initSurvey(framework, newJSON);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.currentPageNo = 1;
      })();
      const progressBarItemsSelector = Selector(".sd-progress-buttons__list li");
      await t.hover(progressBarItemsSelector.nth(0));
      await takeElementScreenshot("survey-progress-bar-hover-visited.png", Selector(".sd-progress-buttons"), t, comparer); // title + progress
      await t.hover(progressBarItemsSelector.nth(1));
      await takeElementScreenshot("survey-progress-bar-hover-current.png", Selector(".sd-progress-buttons"), t, comparer); // title + progress
      await t.hover(progressBarItemsSelector.nth(2));
      await takeElementScreenshot("survey-progress-bar-hover-next.png", Selector(".sd-progress-buttons"), t, comparer); // title + progress
    });
  });
  test("Check survey with progress top buttons - hover", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.progressBarShowPageNumbers = true;
        (<any>window).survey.currentPageNo = 1;
      })();
      const progressBarItemsSelector = Selector(".sd-progress-buttons__list li");
      await t.hover(progressBarItemsSelector.nth(0));
      await takeElementScreenshot("survey-progress-bar-buttons-hover-visited.png", Selector(".sd-progress-buttons"), t, comparer); // title + progress
      await t.hover(progressBarItemsSelector.nth(1));
      await takeElementScreenshot("survey-progress-bar-buttons-hover-current.png", Selector(".sd-progress-buttons"), t, comparer); // title + progress
      await t.hover(progressBarItemsSelector.nth(2));
      await takeElementScreenshot("survey-progress-bar-buttons-hover-next.png", Selector(".sd-progress-buttons"), t, comparer); // title + progress
    });
  });
  test("Check survey with progress top - progressBarInheritWidthFrom modes", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";
      newJSON["progressBarInheritWidthFrom"] = "survey";
      newJSON["widthMode"] = "static";

      await initSurvey(framework, newJSON);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-top-survey-width-static.png", Selector(".sd-container-modern"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.width = "1400px";
      })();
      await t.resizeWindow(1900, 1000);
      await t.wait(500);
      await takeElementScreenshot("survey-progress-bar-top-survey-width-static-1400.png", Selector(".sd-container-modern"), t, comparer);
    });
  });
  test("Check survey with progress top - RTL", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";

      await ClientFunction(() => {
        document.body.setAttribute("dir", "rtl");
      })();
      await initSurvey(framework, newJSON);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-top-rtl.png", Selector(".sd-container-modern"), t, comparer); // title + progress
    });
  });

  test("Check survey with progress and bootstrap/tailwind", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await ClientFunction(() => {
        document.head.insertAdjacentHTML("beforeend", "<style>* { box-sizing: border-box; }</style>");
      })();
      await t.resizeWindow(800, 1080);
      const newJSON = { ...json };
      newJSON.progressBarType = "pages";

      await initSurvey(framework, newJSON);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-bootstrap.png", Selector(".sd-progress-buttons__list"), t, comparer); // title + progress
      await ClientFunction(() => {
        (<any>window).survey.progressBarShowPageNumbers = true;
      })();
      await takeElementScreenshot("survey-progress-bar-bootstrap-numbers.png", Selector(".sd-progress-buttons__list"), t, comparer);
    });
  });

  test("Check survey with progress top pages - sticky", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        title: "Survey Title",
        showProgressBar: "top",
        progressBarType: "pages",
        // progressBarShowPageNumbers: true,
        pages: [
          {
            name: "p1",
            elements: [
              { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" },
            ]
          },
          {
            name: "p2",
            elements: [
              { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" },
            ]
          }
        ]
      });
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (document.querySelector("#surveyElement") as HTMLElement).style.height = "calc(100vh - 32px)";
        (<any>window).survey.currentPageNo = 1;
      })();
      await t.resizeWindow(800, 600);
      await t.scroll(".sd-root-modern--full-container", 0, 500);
      await t.wait(1000);
      await takeElementScreenshot("survey-progress-bar-top-pages-sticky.png", Selector("#surveyElement"), t, comparer);
    });
  });

  test("Check survey with progress top questions - sticky", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        title: "Survey Title",
        showProgressBar: "top",
        progressBarType: "questions",
        pages: [
          {
            name: "p1",
            elements: [
              { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" }, { type: "text", name: "q1" },
            ]
          },
          {
            name: "p2",
            elements: [
              { type: "text", name: "q2" }, { type: "text", name: "q2" }, { type: "text", name: "q2" }, { type: "text", name: "q2" }, { type: "text", name: "q2" },
            ]
          }
        ]
      });
      await ClientFunction(() => {
        (document.querySelector("#surveyElement") as HTMLElement).style.height = "calc(100vh - 32px)";
        (<any>window).survey.data = { q1: "answer" };
        (<any>window).survey.currentPageNo = 1;
      })();
      await applyHeaderAccentBackgroundColor();
      await t.resizeWindow(800, 600);
      await t.scroll(".sd-root-modern--full-container", 0, 500);
      await t.wait(1000);
      await takeElementScreenshot("survey-progress-bar-top-questions-sticky.png", Selector("#surveyElement"), t, comparer);
    });
  });

  test("Check progress top buttons sticky has background", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1400, 800);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        "title": "Sample Survey",
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "boolean",
                "name": "question1",
                "title": "Show Page 2?",
                "defaultValue": "true"
              },
              {
                "type": "radiogroup",
                "name": "question4",
                "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3",
                  "Item 4",
                  "Item 5",
                  "Item 6",
                  "Item 7"
                ]
              },
              {
                "type": "matrixdropdown",
                "name": "question5",
                "columns": [
                  {
                    "name": "Column 1"
                  },
                  {
                    "name": "Column 2"
                  },
                  {
                    "name": "Column 3"
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
                  "Row 1",
                  "Row 2",
                  "Row 3",
                  "Row 4",
                  "Row 5",
                  "Row 6",
                  "Row 7",
                  "Row 8",
                  "Row 9",
                  "Row 10"
                ]
              }
            ],
            "title": "Page 1"
          },
          {
            "name": "page2",
            "elements": [
              {
                "type": "boolean",
                "name": "question2",
                "title": "Show Page 3?",
                "defaultValue": "true"
              }
            ],
            "visibleIf": "{question1} = true",
            "title": "Page 2"
          },
          {
            "name": "page3",
            "elements": [
              {
                "type": "text",
                "name": "question3"
              },
            ],
            "visibleIf": "{question2} = true",
            "title": "Page 3"
          }
        ],
        "showProgressBar": "belowheader",
        "progressBarType": "buttons",
        "progressBarShowPageTitles": true,
        "widthMode": "static",
        "width": "800px"
      });
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (document.querySelector("#surveyElement") as HTMLElement).style.height = "calc(100vh - 32px)";
      })();
      await t.scroll(".sd-root-modern--full-container", 0, 300);
      await t.wait(1000);
      await takeElementScreenshot("survey-progress-bar-top-buttons-sticky-background.png", Selector("#surveyElement"), t, comparer);
    });
  });

  test("Check survey with progress top buttons with numbers and background", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await applyHeaderAccentBackgroundColor();
      await ClientFunction(() => {
        (<any>window).survey.progressBarShowPageNumbers = true;
        (<any>window).survey.applyTheme({
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
        });
      })();
      await t.click(Selector("li").nth(1));
      await takeElementScreenshot("survey-progress-bar-top-numbered-buttons-background.png", Selector(".sd-container-modern"), t, comparer);
      await t.resizeWindow(500, 1080);
      await t.resizeWindow(600, 1000);
      await t.resizeWindow(500, 1080);
      await takeElementScreenshot("survey-progress-bar-top-numbered-buttons-mobile-background.png", Selector(".sd-container-modern"), t, comparer);
    });
  });
});