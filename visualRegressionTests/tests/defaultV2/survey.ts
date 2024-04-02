import { Selector, ClientFunction } from "testcafe";
import { setData } from "../../../testCafe/helper";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, wrapVisualTest, resetFocusToBody, resetHoverToBody } from "../../helper";
import { backgroundImage } from "../../constants";

const title = "Survey Screenshot";

fixture`${title}`.page`${url}`;

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});
const insertDiv = ClientFunction(() => {
  const el = document.createElement("div");
  el.style.height = "1000px";
  document.body.insertBefore(el, document.body.firstChild);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`
    .beforeEach(async t => {
      await applyTheme(theme);
    });

  test("Check survey title", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        title: "Survey Title",
        widthMode: "responsive",
        questions: [
          {
            type: "text",
            title: "Question title",
            name: "q1"
          }
        ]
      });
      await takeElementScreenshot("survey-title.png", Selector(".sd-title"), t, comparer);
      await ClientFunction(() => {
        (<any>window).survey.description = "descr";
      })();
      await takeElementScreenshot("survey-title-descr.png", Selector(".sd-title"), t, comparer);
      await takeElementScreenshot("survey-body.png", Selector(".sd-body"), t, comparer);
    });
  });
  test("Check survey default advanced header view", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        title: "Survey Title",
        description: "Survey description",
        logo: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
        widthMode: "responsive",
        questions: [
          {
            type: "text",
            title: "Question title",
            name: "q1"
          }
        ]
      });
      await ClientFunction(() => {
        (<any>window).survey.headerView = "advanced";
      })();
      await takeElementScreenshot("survey-advanced-header-default.png", Selector(".sd-root-modern"), t, comparer);
    });
  });
  test("Check survey default advanced header mobile view", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(500, 600);
      await initSurvey(framework, {
        title: "Survey Title",
        description: "Survey description",
        logo: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
        widthMode: "responsive",
        questions: [
          {
            type: "text",
            title: "Question title",
            name: "q1"
          }
        ]
      });
      await ClientFunction(() => {
        (<any>window).survey.headerView = "advanced";
        (<any>window).survey.setIsMobile(true);
      })();
      await takeElementScreenshot("survey-advanced-header-mobile-default.png", Selector(".sd-root-modern"), t, comparer);
    });
  });
  test("Check survey advanced header mobile view with background", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(500, 600);
      await initSurvey(framework, {
        title: "Survey Title",
        description: "Survey description",
        logo: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
        widthMode: "responsive",
        questions: [
          {
            type: "text",
            title: "Question title",
            name: "q1"
          }
        ]
      });
      await ClientFunction(() => {
        (<any>window).survey.headerView = "advanced";
        (<any>window).survey.applyTheme({
          cssVariables: {
            "--sjs-header-backcolor": "green"
          },
          header: {
          }
        });
        (<any>window).survey.setIsMobile(true);
      })();
      await takeElementScreenshot("survey-advanced-header-mobile-background.png", Selector(".sd-root-modern"), t, comparer);
    });
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

  test("Check survey with width", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        title: "Test",
        widthMode: "static",
        width: "900px",
        pages: testedPages
      });
      await takeElementScreenshot("survey-with-width.png", Selector(".sd-container-modern"), t, comparer); // title
    });
  });
  test("Check survey with width adaptivity", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(700, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        title: "Test",
        widthMode: "static",
        width: "900px",
        pages: testedPages
      });
      await takeElementScreenshot("survey-with-width-adaptivity.png", Selector(".sd-container-modern"), t, comparer); // title
    });
  });
  test("Check survey title with logo", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "logo": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNi4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAyMDAgMTAyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMDAgMTAyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojMTlCMzk0O30NCgkuc3Qxe2ZpbGw6I0ZGOTgxNDt9DQo8L3N0eWxlPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE5NS45LDIwSDQuMUgwdjQuMXY1NHY0LjFoNC4xaDE3My40bDE1LjcsMTMuOGw2LjgsNnYtOVYyNC4xVjIwSDE5NS45eiBNMTk1LjksOTIuOUwxNzksNzguMUg0LjF2LTU0aDE5MS44DQoJCVY5Mi45eiBNMTI2LjEsNjEuN2wtNi44LTE3LjJoNC41bDQuNywxMy40bDQuMS0xMy40aDQuMWwtNy4yLDIwLjZjLTAuNCwxLjItMS4xLDIuMi0yLjEsM2MtMSwwLjgtMi4zLDEuMS0zLjcsMS4xDQoJCWMtMC40LDAtMC43LDAtMS4xLTAuMWMtMC40LTAuMS0wLjctMC4xLTEuMS0wLjNWNjVjMC40LDAuMSwwLjcsMC4yLDEuMSwwLjJjMC4zLDAuMSwwLjYsMC4xLDAuOSwwLjFjMC4zLDAsMC41LTAuMSwwLjgtMC4yDQoJCWMwLjItMC4xLDAuNS0wLjMsMC43LTAuNmMwLjItMC4zLDAuNC0wLjcsMC42LTEuMUMxMjUuNyw2MywxMjUuOSw2Mi40LDEyNi4xLDYxLjd6IE0xMDMuMyw1OS40YzAuOCwwLjgsMS43LDEuNCwyLjksMS45DQoJCXMyLjQsMC43LDMuNywwLjdjMS45LDAsMy42LTAuNCw1LTEuM2MxLjQtMC44LDIuNC0xLjksMy0zLjJsLTMuOC0xYy0wLjMsMC43LTAuOCwxLjMtMS42LDEuN2MtMC44LDAuNC0xLjYsMC42LTIuNSwwLjYNCgkJYy0wLjYsMC0xLjEtMC4xLTEuNi0wLjNjLTAuNS0wLjItMS0wLjUtMS40LTAuOWMtMC40LTAuNC0wLjgtMC44LTEtMS4zYy0wLjMtMC41LTAuNC0xLjEtMC41LTEuOGgxMy4zYzAtMC4yLDAuMS0wLjQsMC4xLTAuNw0KCQljMC0wLjMsMC0wLjUsMC0wLjhjMC0xLjItMC4yLTIuMy0wLjYtMy4zYy0wLjQtMS4xLTEtMi0xLjgtMi44Yy0wLjgtMC44LTEuNy0xLjUtMi44LTEuOWMtMS4xLTAuNS0yLjQtMC43LTMuOC0wLjcNCgkJcy0yLjcsMC4yLTMuOCwwLjdjLTEuMSwwLjUtMi4xLDEuMS0yLjksMmMtMC44LDAuOC0xLjQsMS44LTEuOCwyLjljLTAuNCwxLjEtMC42LDIuMi0wLjYsMy41YzAsMS4yLDAuMiwyLjMsMC42LDMuNA0KCQlDMTAxLjksNTcuNiwxMDIuNSw1OC41LDEwMy4zLDU5LjR6IE0xMDUuOSw0OS45YzAuMy0wLjUsMC42LTEsMS0xLjNjMC40LTAuNCwwLjgtMC43LDEuNC0wLjljMC41LTAuMiwxLjEtMC4zLDEuNy0wLjMNCgkJYzEuMiwwLDIuMiwwLjQsMy4xLDEuMnMxLjMsMS44LDEuNCwzLjFoLTguOUMxMDUuNSw1MSwxMDUuNiw1MC40LDEwNS45LDQ5Ljl6IE00My43LDU1LjVjMC0wLjUtMC4xLTAuOS0wLjQtMS4zDQoJCWMtMC4zLTAuMy0wLjctMC43LTEuMi0wLjljLTAuNS0wLjMtMS4yLTAuNS0xLjktMC43Yy0wLjctMC4yLTEuNi0wLjUtMi41LTAuN2MtMS4xLTAuMy0yLjEtMC42LTIuOS0xYy0wLjgtMC40LTEuNS0wLjgtMi4xLTEuMw0KCQljLTAuNS0wLjUtMS0xLjEtMS4yLTEuN2MtMC4zLTAuNi0wLjQtMS40LTAuNC0yLjNjMC0xLjIsMC4yLTIuMiwwLjctMy4xYzAuNC0wLjksMS0xLjcsMS44LTIuM2MwLjgtMC42LDEuNy0xLjEsMi43LTEuNA0KCQljMS0wLjMsMi4xLTAuNSwzLjMtMC41YzEuNiwwLDMuMSwwLjMsNC41LDAuOGMxLjQsMC41LDIuNiwxLjEsMy42LDEuOGwtMiwzLjdjLTAuMi0wLjItMC40LTAuNC0wLjgtMC42Yy0wLjQtMC4zLTAuOS0wLjUtMS41LTAuOA0KCQljLTAuNi0wLjMtMS4yLTAuNS0xLjktMC42Yy0wLjctMC4yLTEuNC0wLjMtMi4xLTAuM2MtMS4yLDAtMi4yLDAuMi0yLjgsMC43Yy0wLjYsMC41LTAuOSwxLjEtMC45LDEuOWMwLDAuNSwwLjEsMC45LDAuMywxLjINCgkJYzAuMiwwLjMsMC42LDAuNiwxLDAuOGMwLjQsMC4yLDEsMC41LDEuNywwLjdjMC43LDAuMiwxLjQsMC40LDIuMywwLjZjMS4xLDAuMywyLjIsMC42LDMuMSwxYzAuOSwwLjMsMS43LDAuOCwyLjQsMS4zDQoJCWMwLjYsMC41LDEuMSwxLjIsMS41LDEuOWMwLjMsMC43LDAuNSwxLjYsMC41LDIuN2MwLDEuMi0wLjIsMi4zLTAuNywzLjJjLTAuNSwwLjktMS4xLDEuNi0xLjksMi4xYy0wLjgsMC41LTEuNywwLjktMi44LDEuMg0KCQljLTEsMC4zLTIuMSwwLjQtMy4zLDAuNGMtMS43LDAtMy41LTAuMy01LjItMC44Yy0xLjctMC41LTMuMi0xLjMtNC42LTIuMmwyLTMuOWMwLjIsMC4yLDAuNiwwLjUsMS4xLDAuOGMwLjUsMC4zLDEuMSwwLjYsMS44LDENCgkJYzAuNywwLjMsMS41LDAuNiwyLjMsMC44YzAuOSwwLjIsMS43LDAuMywyLjYsMC4zQzQyLjUsNTcuOCw0My43LDU3LjEsNDMuNyw1NS41eiBNNTIuNyw2MC4zYy0wLjktMS4xLTEuNC0yLjgtMS40LTUuMVY0NC41aDQuNA0KCQl2OS44YzAsMi42LDEsNCwyLjksNGMwLjksMCwxLjctMC4zLDIuNS0wLjhjMC44LTAuNSwxLjQtMS4zLDItMi4zVjQ0LjVoNC40djEyLjFjMCwwLjUsMC4xLDAuOCwwLjIsMWMwLjIsMC4yLDAuNCwwLjMsMC44LDAuM3YzLjcNCgkJYy0wLjQsMC4xLTAuOCwwLjEtMS4xLDAuMmMtMC4zLDAtMC42LDAtMC44LDBjLTAuOCwwLTEuNC0wLjItMS45LTAuNWMtMC41LTAuNC0wLjgtMC45LTAuOS0xLjVsLTAuMS0xLjRjLTAuOCwxLjItMS43LDIuMS0zLDIuNw0KCQljLTEuMiwwLjYtMi41LDAuOS00LDAuOUM1NSw2Miw1My43LDYxLjQsNTIuNyw2MC4zeiBNNzYuMiw2MS43aC00LjRWNDQuNWg0djMuN2MwLjMtMC42LDAuNy0xLjEsMS4xLTEuNmMwLjQtMC41LDAuOS0wLjksMS4zLTEuMg0KCQljMC41LTAuMywxLTAuNiwxLjUtMC44YzAuNS0wLjIsMS0wLjMsMS40LTAuM2MwLjIsMCwwLjQsMCwwLjUsMHMwLjIsMCwwLjMsMHY0Yy0xLjMsMC0yLjUsMC4zLTMuNiwwLjhjLTEuMSwwLjUtMS44LDEuMi0yLjMsMi4yDQoJCVY2MS43eiBNODkuMSw2MS43bC02LjMtMTcuMmg0LjVsNC40LDEzLjZsNC40LTEzLjZoNC4xbC02LjMsMTcuMkg4OS4xeiIvPg0KCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xMzUuOSw1Ni45YzAuMywwLjIsMC44LDAuNSwxLjUsMC43YzAuNywwLjMsMS42LDAuNCwyLjUsMC40YzAuOSwwLDEuNy0wLjIsMi4yLTAuNWMwLjUtMC4zLDEtMC44LDEuMi0xLjUNCgkJYzAuMy0wLjcsMC41LTEuNSwwLjYtMi40YzAuMS0xLDAuMS0yLjEsMC4xLTMuNFYzOC40aDQuNXYxMS44YzAsMS44LTAuMSwzLjQtMC4zLDQuOGMtMC4yLDEuNS0wLjYsMi43LTEuMiwzLjcNCgkJYy0wLjYsMS0xLjUsMS44LTIuNiwyLjRjLTEuMSwwLjYtMi43LDAuOS00LjYsMC45Yy0yLDAtMy43LTAuNS01LjEtMS40TDEzNS45LDU2Ljl6IE0xNjcsNDQuNWMtMC4yLTAuMi0wLjQtMC40LTAuOC0wLjYNCgkJcy0wLjktMC41LTEuNS0wLjhjLTAuNi0wLjMtMS4yLTAuNS0xLjktMC42Yy0wLjctMC4yLTEuNC0wLjMtMi4xLTAuM2MtMS4yLDAtMi4yLDAuMi0yLjgsMC43Yy0wLjYsMC41LTAuOSwxLjEtMC45LDEuOQ0KCQljMCwwLjUsMC4xLDAuOSwwLjMsMS4yYzAuMiwwLjMsMC42LDAuNiwxLDAuOGMwLjQsMC4yLDEsMC41LDEuNywwLjdjMC43LDAuMiwxLjQsMC40LDIuMywwLjZjMS4xLDAuMywyLjIsMC42LDMuMSwxDQoJCWMwLjksMC4zLDEuNywwLjgsMi40LDEuM2MwLjYsMC41LDEuMSwxLjIsMS41LDEuOWMwLjQsMC43LDAuNSwxLjYsMC41LDIuN2MwLDEuMi0wLjIsMi4zLTAuNywzLjJjLTAuNSwwLjktMS4xLDEuNi0xLjksMi4xDQoJCWMtMC44LDAuNS0xLjcsMC45LTIuOCwxLjJjLTEsMC4zLTIuMSwwLjQtMy4zLDAuNGMtMS43LDAtMy41LTAuMy01LjItMC44Yy0xLjctMC41LTMuMi0xLjMtNC42LTIuMmwyLTMuOWMwLjIsMC4yLDAuNiwwLjUsMS4xLDAuOA0KCQljMC41LDAuMywxLjEsMC42LDEuOCwxYzAuNywwLjMsMS41LDAuNiwyLjMsMC44YzAuOSwwLjIsMS43LDAuMywyLjYsMC4zYzIuNSwwLDMuNy0wLjgsMy43LTIuNGMwLTAuNS0wLjEtMC45LTAuNC0xLjMNCgkJcy0wLjctMC43LTEuMi0wLjljLTAuNS0wLjMtMS4yLTAuNS0xLjktMC43Yy0wLjctMC4yLTEuNi0wLjUtMi41LTAuN2MtMS4xLTAuMy0yLjEtMC42LTIuOS0xYy0wLjgtMC40LTEuNS0wLjgtMi4xLTEuMw0KCQljLTAuNS0wLjUtMS0xLjEtMS4yLTEuN2MtMC4zLTAuNi0wLjQtMS40LTAuNC0yLjNjMC0xLjIsMC4yLTIuMiwwLjctMy4xYzAuNC0wLjksMS0xLjcsMS44LTIuM2MwLjgtMC42LDEuNy0xLjEsMi43LTEuNA0KCQljMS0wLjMsMi4xLTAuNSwzLjMtMC41YzEuNiwwLDMuMSwwLjMsNC41LDAuOGMxLjQsMC41LDIuNiwxLjEsMy42LDEuOEwxNjcsNDQuNXoiLz4NCjwvZz4NCjwvc3ZnPg0K",
        "logoPosition": "right",
        "title": "Test",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ]
          }
        ]
      });
      await takeElementScreenshot("survey-title-with-logo.png", Selector(".sd-title"), t, comparer); // without title and progress
    });

  });
  test("Check survey with backgroundImage", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 900);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        "backgroundImage": backgroundImage,
        "backgroundOpacity": 0.7,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ]
          }
        ]
      });
      await takeElementScreenshot("survey-with-backgroundImage.png", Selector(".sd-root-modern"), t, comparer);
    });

  });
  test("Check survey navigation bar", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(400, 1080);
      const json = {
        title: "Software developer survey.",
        pages: [
          {
            "title": "What operating system do you use?",
            "elements": [
              {
                "type": "checkbox",
                "name": "opSystem",
                "title": "OS",
                "hasOther": true,
                "isRequired": true,
                "choices": ["Windows", "Linux", "Macintosh OSX"]
              }
            ]
          }, {
            "title": "What language(s) are you currently using?",
            "elements": [
              {
                "type": "checkbox",
                "name": "langs",
                "title": "Please select from the list",
                "isRequired": true,
                "choices": [
                  "Javascript",
                  "Java",
                  "Python",
                  "CSS",
                  "PHP",
                  "Ruby",
                  "C++",
                  "C",
                  "Shell",
                  "C#",
                ]
              }
            ]
          }, {
            "title": "Please enter your name and e-mail",
            "elements": [
              {
                "type": "text",
                "name": "name",
                "title": "Name:"
              }, {
                "type": "text",
                "name": "email",
                "title": "Your e-mail"
              }
            ]
          }
        ]
      };
      await initSurvey(framework, json);
      await ClientFunction(() => {
        window["survey"].addNavigationItem({
          id: "survey_clear_current_page", title: "Clear page", visibleIndex: 49, // "Complete" button has the visibleIndex 50.
          action: () => { window["survey"].currentPage.questions.forEach(function (question) { question.value = undefined; }); }
        });
      })();
      await t
        .click(Selector(".sd-item__control-label").withText("Windows"))
        .click(Selector(".sd-btn.sd-navigation__next-btn"))
        .click(Selector(".sd-item__control-label").withText("Javascript"));

      await takeElementScreenshot("survey-navigation-bar.png", Selector(".sd-action-bar.sd-footer.sd-body__navigation"), t, comparer);
      await t.resizeWindow(1920, 1080);
    });
  });
  test("Check survey responsive timer", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const json = {
        focusFirstQuestionAutomatic: true,
        "title": "American History",
        "showTimerPanel": "bottom",
        "showTimerPanelMode": "survey",
        "maxTimeToFinish": 60,
        "widthMode": "responsive",
        "firstPageIsStarted": true,
        "pages": [
          {
            "elements": [
              {
                "type": "html",
                "html": "You are about to start a quiz on American history. <br>You will have 10 seconds for every question and 25 seconds to end the quiz.<br>Enter your name below and click <b>Start Quiz</b> to begin."
              }
            ]
          },
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
      await ClientFunction(() => {
        const style = document.createElement("style");
        style.innerHTML = ".sd-timer__progress--animation { transition: none !important; }";
        document.body.appendChild(style);
        (<any>window).Survey.SurveyTimer.instance.start = () => { };
      })();
      await initSurvey(framework, json);
      await t.click(Selector(".sd-navigation__start-btn"));
      await takeElementScreenshot("survey-responsive-timer.png", Selector("body"), t, comparer);
    });
  });
  test("Check survey timer", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const json = {
        focusFirstQuestionAutomatic: true,
        "title": "American History",
        "showTimerPanel": "bottom",
        "showTimerPanelMode": "survey",
        "maxTimeToFinish": 60,
        "widthMode": "static",
        "firstPageIsStarted": true,
        "pages": [
          {
            "elements": [
              {
                "type": "html",
                "html": "You are about to start a quiz on American history. <br>You will have 10 seconds for every question and 25 seconds to end the quiz.<br>Enter your name below and click <b>Start Quiz</b> to begin."
              }
            ]
          },
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
      await ClientFunction(() => {
        const style = document.createElement("style");
        style.innerHTML = ".sd-timer__progress--animation { transition: none !important; }";
        document.body.appendChild(style);
        (<any>window).Survey.SurveyTimer.instance.start = () => { };
      })();
      await initSurvey(framework, json);
      await t.click(Selector(".sd-navigation__start-btn"));
      await resetHoverToBody(t);
      await takeElementScreenshot("survey-timer.png", Selector("body"), t, comparer);
    });
  });
  test("Check survey timer with no limits", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const json = {
        focusFirstQuestionAutomatic: true,
        "title": "American History",
        "showTimerPanel": "bottom",
        "showTimerPanelMode": "survey",
        "widthMode": "static",
        "firstPageIsStarted": true,
        "pages": [
          {
            "elements": [
              {
                "type": "html",
                "html": "You are about to start a quiz on American history. <br>You will have 10 seconds for every question and 25 seconds to end the quiz.<br>Enter your name below and click <b>Start Quiz</b> to begin."
              }
            ]
          },
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
      await ClientFunction(() => {
        (<any>window).Survey.SurveyTimer.instance.start = () => { };
      })();
      await initSurvey(framework, json);
      await t.click(Selector(".sd-navigation__start-btn"));
      await resetHoverToBody(t);
      await takeElementScreenshot("survey-timer-without-progress.png", Selector("body"), t, comparer);
    });
  });

  const notifierJson = {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "rating",
            "name": "nps_score",
            "title": "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
            "isRequired": true,
            "rateMin": 0,
            "rateMax": 10,
            "minRateDescription": "(Most unlikely)",
            "maxRateDescription": "(Most likely)"
          },
          {
            "type": "checkbox",
            "name": "promoter_features",
            "visibleIf": "{nps_score} >= 9",
            "title": "Which of the following features do you value the most?",
            "description": "Please select no more than three features.",
            "isRequired": true,
            "validators": [
              {
                "type": "answercount",
                "text": "Please select no more than three features.",
                "maxCount": 3
              }
            ],
            "showOtherItem": true,
            "choices": [
              "Performance",
              "Stability",
              "User interface",
              "Complete functionality",
              "Learning materials (documentation, demos, code examples)",
              "Quality support"
            ],
            "otherText": "Other features:",
            "colCount": 2
          },
          {
            "type": "comment",
            "name": "passive_experience",
            "visibleIf": "{nps_score} >= 7  and {nps_score} <= 8",
            "title": "What can we do to make your experience more satisfying?"
          },
          {
            "type": "comment",
            "name": "disappointing_experience",
            "visibleIf": "{nps_score} <= 6",
            "title": "Please let us know why you had such a disappointing experience with our product"
          }
        ]
      }
    ],
    "completedHtml": "<h3>Thank you for your feedback</h3>",
    "completedHtmlOnCondition": [
      {
        "expression": "{nps_score} >= 9",
        "html": "<h3>Thank you for your feedback</h3> <h4>We are glad that you love our product. Your ideas and suggestions will help us make it even better.</h4>"
      },
      {
        "expression": "{nps_score} >= 6  and {nps_score} <= 8",
        "html": "<h3>Thank you for your feedback</h3> <h4>We are glad that you shared your ideas with us. They will help us make our product better.</h4>"
      }
    ],
    "showQuestionNumbers": "off"
  };
  test("Check survey notifier info type", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await ClientFunction(() => { (<any>window).Survey.settings.notifications.lifetime = 10000; })();
      await t.resizeWindow(1920, 900);
      await initSurvey(framework, notifierJson, {
        onComplete: (_sender, options) => {
          options.isCompleteOnTrigger = false;
          options.showDataSaving();
          let fail = true;

          new Promise((resolve, reject) => { setTimeout(fail ? reject : resolve, 10000); }).then(
            () => { options.showDataSavingSuccess(); },
            () => { options.showDataSavingError(); }
          );
        }
      });
      await setData({ nps_score: 4 });
      await t.click("input[value=\"Complete\"]");
      await takeElementScreenshot("save-data-saving.png", Selector(".sv-save-data_root"), t, comparer);
      await ClientFunction(() => { (<any>window).Survey.settings.notifications.lifetime = 2000; })();
    });
  });

  test("Check survey notifier error type", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await ClientFunction(() => { (<any>window).Survey.settings.notifications.lifetime = 10000; })();
      await t.resizeWindow(1920, 900);
      await initSurvey(framework, notifierJson, {
        onComplete: (_sender, options) => {
          options.isCompleteOnTrigger = false;
          options.showDataSaving();
          let fail = true;

          new Promise((resolve, reject) => { setTimeout(fail ? reject : resolve, 500); }).then(
            () => { options.showDataSavingSuccess(); },
            () => { options.showDataSavingError(); }
          );
        }
      });
      await setData({ nps_score: 4 });
      await t.click("input[value=\"Complete\"]");
      await takeElementScreenshot("save-data-error.png", Selector(".sv-save-data_root.sv-save-data_error"), t, comparer);
      await ClientFunction(() => { (window as any).survey.notify("An error occurred and we could not save the results.", "error", false); })();
      await takeElementScreenshot("save-data-error-without-button.png", Selector(".sv-save-data_root.sv-save-data_error"), t, comparer);
      await ClientFunction(() => { (<any>window).Survey.settings.notifications.lifetime = 2000; })();
    });
  });

  test("Check survey notifier success type", async (t) => {
    await ClientFunction(() => { (<any>window).Survey.settings.notifications.lifetime = 10000; })();
    await t.resizeWindow(1920, 900);
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, notifierJson, {
        onComplete: (_sender, options) => {
          options.isCompleteOnTrigger = false;
          options.showDataSaving();
          let fail = false;

          new Promise((resolve, reject) => { setTimeout(fail ? reject : resolve, 500); }).then(
            () => { options.showDataSavingSuccess(); },
            () => { options.showDataSavingError(); }
          );
        }
      });
      await setData({ nps_score: 4 });
      await t.click("input[value=\"Complete\"]");
      await takeElementScreenshot("save-data-success.png", Selector(".sv-save-data_root.sv-save-data_success"), t, comparer);
      await ClientFunction(() => { (<any>window).Survey.settings.notifications.lifetime = 2000; })();
    });
  });
  test("TOC survey navigation", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1600, 900);
      const json = {
        focusFirstQuestionAutomatic: true,
        title: "Software developer survey.",
        showTOC: true,
        pages: [
          {
            "title": "What operating system do you use?",
            "elements": [
              {
                "type": "checkbox",
                "name": "opSystem",
                "title": "OS",
                "hasOther": true,
                "isRequired": true,
                "choices": ["Windows", "Linux", "Macintosh OSX"]
              }
            ]
          }, {
            "title": "What language(s) are you currently using?",
            "elements": [
              {
                "type": "checkbox",
                "name": "langs",
                "title": "Please select from the list",
                "isRequired": true,
                "choices": [
                  "Javascript",
                  "Java",
                  "Python",
                  "CSS",
                  "PHP",
                  "Ruby",
                  "C++",
                  "C",
                  "Shell",
                  "C#",
                ]
              }
            ]
          }, {
            "title": "Please enter your name and e-mail",
            "elements": [
              {
                "type": "text",
                "name": "name",
                "title": "Name:"
              }, {
                "type": "text",
                "name": "email",
                "title": "Your e-mail"
              }
            ]
          }
        ]
      };
      await initSurvey(framework, json);
      await takeElementScreenshot("survey-navigation-toc-left.png", Selector(".sv-components-row"), t, comparer);

      await ClientFunction(() => {
        window["survey"].tocLocation = "right";
      })();
      await takeElementScreenshot("survey-navigation-toc-right.png", Selector(".sv-components-row"), t, comparer);

      await t.click(".sd-item__control-label");
      await t.click(".sd-navigation__next-btn");
      await t.click(".sd-item__control-label");
      await t.click(".sd-navigation__next-btn");
      await t.click(".sd-navigation__complete-btn");
      await takeElementScreenshot("survey-completed-no-toc.png", Selector(".sd-root-modern"), t, comparer);

      await t.resizeWindow(1920, 1080);
    });
  });

  test("Survey complete pages", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1600, 900);
      const json = {
        "cookieName": "survey-id",
        "completedHtml": "<h3>Completed</h3><button style='display: inline-block;'>OK</button>",
        "completedBeforeHtml": "<h3>Already completed</h3><button style='display: inline-block;'>OK</button>",
        pages: [
          {
            "elements": [
              {
                "type": "text",
                "name": "name",
                "title": "Name"
              }
            ]
          }
        ]
      };
      await initSurvey(framework, json);
      await t.click(".sd-navigation__complete-btn");
      await takeElementScreenshot("survey-completed.png", Selector(".sd-root-modern"), t, comparer);
      await ClientFunction(() => {
        document.body.style.setProperty("--sjs-corner-radius", "0px");
        (<any>window).survey.clear();
        (<any>window).survey.isCompletedBefore = true;
      })();
      await takeElementScreenshot("survey-completed-before.png", Selector(".sd-root-modern"), t, comparer);
    });
  });

  test("Check survey in compact mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const json = {
        title: "Lightweight",
        widthMode: "static",
        showQuestionNumbers: "off",
        width: "1000px",
        pages: [{
          elements: [
            {
              name: "q1",
              title: "First Name",
              type: "text"
            },
            {
              name: "q2",
              title: "Last Name",
              startWithNewLine: false,
              type: "text"
            },
            {
              name: "q3",
              title: "Middle Name",
              startWithNewLine: false,
              type: "text"
            },
            {
              name: "q4",
              title: "Address",
              type: "comment"
            }
          ]
        }
        ]
      };
      await initSurvey(framework, json);
      await resetFocusToBody();
      await ClientFunction(() => {
        document.body.style.setProperty("--background-dim", "#fff");
        (<any>window).survey.isCompact = true;
      })();
      await takeElementScreenshot("survey-page-without-title-compact.png", Selector(".sd-root-modern"), t, comparer);
    });
  });
  test("Check survey in compact mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const json = {
        title: "Lightweight",
        widthMode: "static",
        showQuestionNumbers: "off",
        width: "1000px",
        pages: [{
          title: "Form Library in Action",
          description: "Form Library is extensible and allows you to change its behavior as your needs require. Take advantage of more than a hundred free demos showing functionality that includes all popular scenarios.",
          elements: [
            {
              name: "q1",
              title: "First Name",
              type: "text"
            },
            {
              name: "q2",
              title: "Last Name",
              startWithNewLine: false,
              type: "text"
            },
            {
              name: "q3",
              title: "Middle Name",
              startWithNewLine: false,
              type: "text"
            },
            {
              name: "q4",
              title: "Address",
              type: "comment"
            }
          ]
        }
        ]
      };
      await initSurvey(framework, json);
      await resetFocusToBody();
      await ClientFunction(() => {
        document.body.style.setProperty("--background-dim", "#fff");
        (<any>window).survey.isCompact = true;
      })();
      await takeElementScreenshot("survey-compact.png", Selector(".sd-root-modern"), t, comparer);
    });
  });

  test("Check survey with panels in compact mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            elements: [
              {
                type: "radiogroup",
                name: "delivery_agent",
                title: "Delivery agent",
                choices: ["DHL", "Pony Express", "FedEx"]
              },
              {
                type: "boolean",
                name: "delivery_speed",
                title: "Do you like to get the order as fast as it possible?"
              }
            ]
          },
        ]
      });
      await resetFocusToBody();
      await ClientFunction(() => {
        document.body.style.setProperty("--background-dim", "#f3f3f3");
        (<any>window).survey.isCompact = true;
      })();
      await takeElementScreenshot("survey-with-panel-compact.png", Selector(".sd-root-modern"), t, comparer);
    });
  });
  test("TOC survey navigation mobile", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 900);
      await ClientFunction(() => {
        window["Survey"]._setIsTouch(true);
      })();

      const json = {
        focusFirstQuestionAutomatic: true,
        title: "Software developer survey.",
        showTOC: true,
        pages: [
          {
            "title": "What operating system do you use?",
            "elements": [
              {
                "type": "checkbox",
                "name": "opSystem",
                "title": "OS",
                "hasOther": true,
                "isRequired": true,
                "choices": ["Windows", "Linux", "Macintosh OSX"]
              }
            ]
          }, {
            "title": "What language(s) are you currently using?",
            "elements": [
              {
                "type": "checkbox",
                "name": "langs",
                "title": "Please select from the list",
                "isRequired": true,
                "choices": [
                  "Javascript",
                  "Java",
                  "Python",
                  "CSS",
                  "PHP",
                  "Ruby",
                  "C++",
                  "C",
                  "Shell",
                  "C#",
                ]
              }
            ]
          }, {
            "title": "Please enter your name and e-mail",
            "elements": [
              {
                "type": "text",
                "name": "name",
                "title": "Name:"
              }, {
                "type": "text",
                "name": "email",
                "title": "Your e-mail"
              }
            ]
          }
        ]
      };
      await initSurvey(framework, json);

      await takeElementScreenshot("survey-navigation-toc-mobile.png", Selector(".sd-root-modern"), t, comparer);

      await t.click(".sv_progress-toc--mobile > div");
      await takeElementScreenshot("survey-navigation-toc-mobile-popup.png", Selector(".sd-root-modern"), t, comparer);

      await t.resizeWindow(1920, 1080);
    });
  });
  test("TOC survey navigation responsive", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1600, 900);

      const json = {
        focusFirstQuestionAutomatic: true,
        title: "Software developer survey.",
        showTOC: true,
        pages: [
          {
            "title": "What operating system do you use?",
            "elements": [
              {
                "type": "checkbox",
                "name": "opSystem",
                "title": "OS",
                "hasOther": true,
                "isRequired": true,
                "choices": ["Windows", "Linux", "Macintosh OSX"]
              }
            ]
          }, {
            "title": "What language(s) are you currently using?",
            "elements": [
              {
                "type": "checkbox",
                "name": "langs",
                "title": "Please select from the list",
                "isRequired": true,
                "choices": [
                  "Javascript",
                  "Java",
                  "Python",
                  "CSS",
                  "PHP",
                  "Ruby",
                  "C++",
                  "C",
                  "Shell",
                  "C#",
                ]
              }
            ]
          }, {
            "title": "Please enter your name and e-mail",
            "elements": [
              {
                "type": "text",
                "name": "name",
                "title": "Name:"
              }, {
                "type": "text",
                "name": "email",
                "title": "Your e-mail"
              }
            ]
          }
        ]
      };
      await initSurvey(framework, json);
      await takeElementScreenshot("survey-navigation-toc-left.png", Selector(".sv-components-row"), t, comparer);

      await t.resizeWindow(600, 900);
      await takeElementScreenshot("survey-navigation-toc-mobile.png", Selector(".sd-root-modern"), t, comparer);

      await t.resizeWindow(1920, 1080);
    });
  });
  test("TOC survey navigation wide questions fit total width", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1600, 900);

      const json = {
        focusFirstQuestionAutomatic: true,
        title: "Software developer survey.",
        showTOC: true,
        pages: [
          {
            "title": "What operating system do you use?",
            "elements": [
              {
                type: "matrixdynamic",
                name: "teachersRate",
                title: "Matrix Dynamic",
                addRowText: "Add Subject",
                horizontalScroll: true,
                columnMinWidth: "130px",
                columnColCount: 1,
                cellType: "radiogroup",
                choices: [
                  {
                    value: 1,
                    text: "Yes"
                  },
                  {
                    value: 0,
                    text: "Sometimes"
                  },
                  {
                    value: -1,
                    text: "No"
                  }
                ],
                columns: [
                  {
                    name: "subject",
                    cellType: "dropdown",
                    title: "Select a subject",
                    isRequired: true,
                    minWidth: "300px",
                    choices: [
                      "English: American Literature",
                      "English: British and World Literature",
                      "Math: Consumer Math",
                      "Math: Practical Math",
                      "Math: Developmental Algebra",
                      "Math: Continuing Algebra",
                      "Math: Pre-Algebra",
                      "Math: Algebra",
                      "Math: Geometry",
                      "Math: Integrated Mathematics",
                      "Science: Physical Science",
                      "Science: Earth Science",
                      "Science: Biology",
                      "Science: Chemistry",
                      "History: World History",
                      "History: Modern World Studies",
                      "History: U.S. History",
                      "History: Modern U.S. History",
                      "Social Sciences: U.S. Government and Politics",
                      "Social Sciences: U.S. and Global Economics",
                      "World Languages: Spanish",
                      "World Languages: French",
                      "World Languages: German",
                      "World Languages: Latin",
                      "World Languages: Chinese",
                      "World Languages: Japanese"
                    ]
                  },
                  {
                    name: "explains",
                    title: "Clearly explains the objectives"
                  },
                  {
                    name: "interesting",
                    title: "Makes class interesting"
                  },
                  {
                    name: "effective",
                    title: "Uses class time effectively"
                  },
                  {
                    name: "knowledge",
                    title: "Knows the subject matter"
                  },
                  {
                    name: "recognition",
                    title: "Recognizes and acknowledges effort"
                  },
                  {
                    name: "inform",
                    title: "Keeps me informed of my progress"
                  },
                  {
                    name: "opinion",
                    title: "Encourages and accepts different opinions"
                  },
                  {
                    name: "respect",
                    title: "Has the respect of the student"
                  },
                  {
                    name: "cooperation",
                    title: "Encourages cooperation and participation"
                  },
                  {
                    name: "parents",
                    title: "Communicates with my parents"
                  },
                  {
                    name: "selfthinking",
                    title: "Encourages me to think for myself"
                  },
                  {
                    name: "frusturation",
                    cellType: "comment",
                    title: "Is there anything about this class that frustrates you?",
                    minWidth: "250px"
                  },
                  {
                    name: "likeTheBest",
                    cellType: "comment",
                    title: "What do you like best about this class and/or teacher?",
                    minWidth: "250px"
                  },
                  {
                    name: "improvements",
                    cellType: "comment",
                    title:
                      "What do you wish this teacher would do differently that would improve this class?",
                    minWidth: "250px"
                  }
                ],
                rowCount: 2
              }
            ]
          }
        ]
      };
      await initSurvey(framework, json);
      await takeElementScreenshot("survey-navigation-toc-matrix-fit-width.png", Selector(".sv-components-row"), t, comparer);

      await t.resizeWindow(1920, 1080);
    });
  });

  test("Check page with errors and title", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const json = {
        pages: [
          {
            name: "p1",
            title: "Page",
            requiredIf: "{q1} empty",
            isRequired: true,
            elements: [
              {
                type: "text",
                name: "q1",
                title: "Question"
              },
            ]
          },
        ]
      };

      await initSurvey(framework, json);
      await t.click("input[title='Complete']");
      await takeElementScreenshot("survey-page-with-error-with-title.png", Selector(".sd-root-modern"), t, comparer);
      await ClientFunction(() => (window as any).survey.isCompact = true)();
      await takeElementScreenshot("survey-compact-page-with-error-with-title.png", Selector(".sd-root-modern"), t, comparer);
      await ClientFunction(() => { (window as any).survey.questionsOnPageMode = "singlePage"; })();
      await t.click("input[title='Complete']");
      await takeElementScreenshot("survey-compact-spm-page-with-error-with-title.png", Selector(".sd-root-modern"), t, comparer);
      await ClientFunction(() => (window as any).survey.isCompact = false)();
      await takeElementScreenshot("survey-spm-page-with-error-with-title.png", Selector(".sd-root-modern"), t, comparer);
    });
  });
  test("Check page with errors and without title", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const json = {
        pages: [
          {
            name: "p1",
            requiredIf: "{q1} empty",
            isRequired: true,
            elements: [
              {
                type: "text",
                name: "q1",
                title: "Question"
              },
            ]
          },
        ]
      };

      await initSurvey(framework, json);
      await t.click("input[title='Complete']");
      await takeElementScreenshot("survey-page-with-error-without-title.png", Selector(".sd-root-modern"), t, comparer);
      await ClientFunction(() => (window as any).survey.isCompact = true)();
      await takeElementScreenshot("survey-compact-page-with-error-without-title.png", Selector(".sd-root-modern"), t, comparer);
      await ClientFunction(() => { (window as any).survey.questionsOnPageMode = "singlePage"; })();
      await t.click("input[title='Complete']");
      await takeElementScreenshot("survey-compact-spm-page-with-error-without-title.png", Selector(".sd-root-modern"), t, comparer);
      await ClientFunction(() => (window as any).survey.isCompact = false)();
      await takeElementScreenshot("survey-spm-page-with-error-without-title.png", Selector(".sd-root-modern"), t, comparer);
    });
  });

  test("Check multiple row in compact mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(700, 1080);
      const json = {
        pages: [
          {
            name: "p1",
            elements: [
              {
                type: "text",
                name: "q1",
                title: "Question",
                startWithNewLine: false
              },
              {
                type: "text",
                name: "q2",
                title: "Question",
                startWithNewLine: false
              },
              {
                type: "text",
                name: "q3",
                title: "Question",
                startWithNewLine: false
              },
              {
                type: "text",
                name: "q4",
                title: "Question",
                startWithNewLine: false
              },
            ]
          },
        ]
      };

      await initSurvey(framework, json);
      await ClientFunction(() => (window as any).survey.isCompact = true)();
      await takeElementScreenshot("row-multiple-compact-mode.png", Selector(".sd-root-modern"), t, comparer);
    });
  });

  test("Check survey logo right with empty title", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const json = {
        "logo": "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg",
        "logoPosition": "right",
        "elements": [
          {
            "type": "text",
            "name": "FirstName",
            "title": "Enter your first name:"
          },
        ],
        "widthMode": "responsive"
      };

      await initSurvey(framework, json);
      await takeElementScreenshot("survey-logo-right-without-title.png", Selector(".sd-root-modern"), t, comparer);
    });
  });
  test("Do not scroll to survey by default", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(500, 300);
      await insertDiv();
      const json = {
        "pages": [
          {
            "elements": [
              {
                "type": "text",
                "name": "q1"
              },
            ]
          },
          {
            "elements": [
              {
                "type": "text",
                "name": "q2"
              },
            ]
          }
        ]
      };

      await initSurvey(framework, json);
      await t.wait(100);
      await takeElementScreenshot("survey-no-scrolling.png", undefined, t, comparer);
      await t.click(Selector(".sd-btn.sd-navigation__next-btn"));
      await t.wait(100);
      await takeElementScreenshot("survey-scrolling-second-page.png", undefined, t, comparer);
    });
  });
  test("Scroll to survey", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(500, 300);
      await insertDiv();
      const json = {
        "focusFirstQuestionAutomatic": true,
        "elements": [
          {
            "type": "text",
            "name": "q1"
          },
        ]
      };

      await initSurvey(framework, json);
      await t.wait(100);
      await takeElementScreenshot("survey-scrolling.png", undefined, t, comparer);
    });
  });
});
