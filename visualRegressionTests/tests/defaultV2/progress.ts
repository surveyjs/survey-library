import { Selector, ClientFunction } from "testcafe";
import { setData } from "../../../testCafe/helper";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, wrapVisualTest, resetFocusToBody, resetHoverToBody } from "../../helper";
import { backgroundImage } from "../../constants";

const title = "Survey Progress Screenshot";
const theme = "defaultV2";

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

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

fixture`${title}`.page`${url}`;

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`
    .beforeEach(async t => {
      await applyTheme(theme);
    });

  test("Check survey with progress top", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await ClientFunction(() => {
        (<any>window).survey.progressBarType = "pages";
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-top.png", Selector(".sd-container-modern"), t, comparer); // title + progress
    });
  });
  test("Check survey with progress bottom", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await ClientFunction(() => {
        (<any>window).survey.showProgressBar = "bottom";
        (<any>window).survey.progressBarType = "pages";
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-bottom.png", Selector(".sd-container-modern"), t, comparer); // title + progress
    });
  });
  test("Check survey with progress bottom with brand info and fit to container", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1800, 900);
      await initSurvey(framework, json);
      await ClientFunction(() => {
        const container = (<any>window).document.getElementById("surveyElement");
        container.style.position = "fixed";
        container.style.top = 0;
        container.style.bottom = 0;
        container.style.left = 0;
        container.style.right = 0;
        (<any>window).survey.showBrandInfo = true;
        (<any>window).survey.fitToContainer = true;
        (<any>window).survey.showProgressBar = "bottom";
        (<any>window).survey.progressBarType = "pages";
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-bottom-brand.png", Selector("#surveyElement"), t, comparer); // title + progress
    });
  });
  test("Check survey with progress top buttons", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await t.click(Selector("li").nth(1));
      await t.wait(500);
      await takeElementScreenshot("survey-progress-bar-top-buttons.png", Selector(".sd-container-modern"), t, comparer);
      await t.resizeWindow(500, 1080);
      await t.wait(500);
      await takeElementScreenshot("survey-progress-bar-top-buttons-mobile.png", Selector(".sd-container-modern"), t, comparer);
    });
  });
  test("Check survey with progress top buttons with numbers", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await ClientFunction(() => {
        (<any>window).survey.progressBarShowPageNumbers = true;
      })();
      await t.click(Selector("li").nth(1));
      await takeElementScreenshot("survey-progress-bar-top-numbered-buttons.png", Selector(".sd-container-modern"), t, comparer);
      await t.resizeWindow(500, 1080);
      await takeElementScreenshot("survey-progress-bar-top-numbered-buttons-mobile.png", Selector(".sd-container-modern"), t, comparer);
    });
  });
  test("Check survey with progress top and bottom buttons", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await ClientFunction(() => {
        (<any>window).survey.showProgressBar = "topBottom";
      })();
      await t.click(Selector("li").nth(1));
      await takeElementScreenshot("survey-progress-bar-top-bottom-buttons.png", Selector(".sd-container-modern"), t, comparer);
      await t.resizeWindow(500, 1080);
      await takeElementScreenshot("survey-progress-bar-top-bottom-buttons-mobile.png", Selector(".sd-container-modern"), t, comparer);
    });
  });
  test("Check survey with progress top and TOC", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
      await ClientFunction(() => {
        (<any>window).survey.showTOC = true;
        (<any>window).survey.progressBarType = "pages";
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-top-and-toc.png", Selector(".sd-container-modern"), t, comparer); // title + progress
    });
  });
  test("Check survey without title and with progress", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        pages: testedPages,
        showProgressBar: "top"
      });
      await takeElementScreenshot("survey-without-tilte-and-with-progress.png", Selector(".sd-container-modern"), t, comparer); // progress
    });
  });
  test("Check survey without title and progress", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        pages: testedPages
      });
      await takeElementScreenshot("survey-without-tilte-and-progress.png", Selector(".sd-container-modern"), t, comparer); // without title and progress
    });
  });
  test("Check survey with title and without progress", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        title: "Test",
        pages: testedPages
      });
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
      await initSurvey(framework, json);
      await ClientFunction(() => {
        (<any>window).survey.progressBarType = "pages";
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
      await initSurvey(framework, json);
      await ClientFunction(() => {
        (<any>window).survey.progressBarType = "pages";
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
      await initSurvey(framework, json);
      await ClientFunction(() => {
        (<any>window).survey.progressBarType = "pages";
        (<any>window).survey.progressBarInheritWidthFrom = "survey";
        (<any>window).survey.widthMode = "static";
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
      await ClientFunction(() => {
        document.body.setAttribute("dir", "rtl");
      })();
      await initSurvey(framework, json);
      await ClientFunction(() => {
        (<any>window).survey.progressBarType = "pages";
        (<any>window).survey.currentPageNo = 1;
      })();
      await takeElementScreenshot("survey-progress-bar-top-rtl.png", Selector(".sd-container-modern"), t, comparer); // title + progress
    });
  });
});