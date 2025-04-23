import { test, expect, Page } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";
import { backgroundImage } from "../visualRegressionTests/constants";
import { upArrowImageLink } from "../visualRegressionTests/helper";

const title = "Survey Screenshot";

export async function resetHoverToBody(page: Page): Promise<void> {
  await page.hover("body", { position: { x: 0, y: 0 } });
}

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check survey title", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        headerView: "basic",
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
      await compareScreenshot(page, ".sd-title", "survey-title.png");
      await page.evaluate(() => {
        (window as any).survey.description = "descr";
      });

      await compareScreenshot(page, ".sd-title", "survey-title-descr.png");
      await compareScreenshot(page, ".sd-body", "survey-body.png");
    });

    test("Check survey default advanced header view", async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        title: "Survey Title",
        description: "Survey description",
        logo: upArrowImageLink,
        widthMode: "responsive",
        questions: [
          {
            type: "text",
            title: "Question title",
            name: "q1"
          }
        ]
      });

      await page.evaluate(() => {
        (window as any).survey.headerView = "advanced";
      });
      await compareScreenshot(page, ".sd-root-modern", "survey-advanced-header-default.png");
    });

    test("Check survey default advanced header mobile view", async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        title: "Survey Title",
        description: "Survey description",
        logo: upArrowImageLink,
        widthMode: "responsive",
        questions: [
          {
            type: "text",
            title: "Question title",
            name: "q1"
          }
        ]
      });
      await page.evaluate(() => {
        (window as any).survey.headerView = "advanced";
        (window as any).survey.setIsMobile(true);
      });
      await compareScreenshot(page, ".sd-root-modern", "survey-advanced-header-mobile-default.png");
    });

    test("Check survey advanced header mobile view with background", async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 600 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        title: "Survey Title",
        description: "Survey description",
        logo: upArrowImageLink,
        widthMode: "responsive",
        questions: [
          {
            type: "text",
            title: "Question title",
            name: "q1"
          }
        ]
      });
      await page.evaluate(() => {
        (window as any).survey.headerView = "advanced";
        (window as any).survey.applyTheme({
          cssVariables: {
            "--sjs-header-backcolor": "green"
          },
          header: {}
        });
        (window as any).survey.setIsMobile(true);
      });
      await compareScreenshot(page, ".sd-root-modern", "survey-advanced-header-mobile-background.png");
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

    test("Check survey with width", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        headerView: "basic",
        title: "Test",
        widthMode: "static",
        width: "900px",
        pages: testedPages
      });
      await compareScreenshot(page, ".sd-container-modern", "survey-with-width.png");
    });

    test("Check survey with width adaptivity", async ({ page }) => {
      await page.setViewportSize({ width: 700, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        headerView: "basic",
        title: "Test",
        widthMode: "static",
        width: "900px",
        pages: testedPages
      });
      await compareScreenshot(page, ".sd-container-modern", "survey-with-width-adaptivity.png");
    });

    test("Check survey title with logo", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        headerView: "basic",
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
      await compareScreenshot(page, ".sd-title", "survey-title-with-logo.png");
    });

    test("Check survey with backgroundImage", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
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
      await compareScreenshot(page, ".sd-root-modern", "survey-with-backgroundImage.png");
    });

    test("Check survey navigation bar", async ({ page }) => {
      await page.setViewportSize({ width: 400, height: 1080 });
      const json = {
        showQuestionNumbers: "on",
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
      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        window["survey"].addNavigationItem({
          id: "survey_clear_current_page",
          title: "Clear page",
          visibleIndex: 49,
          action: () => {
            window["survey"].currentPage.questions.forEach(function (question) {
              question.value = undefined;
            });
          }
        });
      });
      await page.click("text=Windows");
      await page.click(".sd-btn.sd-navigation__next-btn");
      await page.click("text=Javascript");
      await compareScreenshot(page, ".sd-action-bar.sd-footer.sd-body__navigation", "survey-navigation-bar.png");
    });

    test("Check survey responsive timer", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        headerView: "basic",
        "title": "American History",
        "showTimerPanel": "bottom",
        "showTimerPanelMode": "survey",
        "maxTimeToFinish": 60,
        "widthMode": "responsive",
        "firstPageIsStartPage": true,
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
      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        const style = document.createElement("style");
        style.innerHTML = ".sd-timer__progress--animation { transition: none !important; }";
        document.body.appendChild(style);
        (window as any).Survey.SurveyTimer.instance.start = () => { };
      });
      await page.click(".sd-navigation__start-btn");
      await compareScreenshot(page, "body", "survey-responsive-timer.png");
    });

    test("Check survey timer", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        headerView: "basic",
        "title": "American History",
        "showTimerPanel": "bottom",
        "showTimerPanelMode": "survey",
        "maxTimeToFinish": 60,
        "widthMode": "static",
        "firstPageIsStartPage": true,
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
      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        const style = document.createElement("style");
        style.innerHTML = ".sd-timer__progress--animation { transition: none !important; }";
        document.body.appendChild(style);
        (window as any).Survey.SurveyTimer.instance.start = () => { };
      });
      await page.click(".sd-navigation__start-btn");
      await compareScreenshot(page, "body", "survey-timer.png");
    });

    test("Check survey timer with no limits", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        headerView: "basic",
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
      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        (window as any).Survey.SurveyTimer.instance.start = () => { };
      });
      await page.click(".sd-navigation__start-btn");
      await compareScreenshot(page, "body", "survey-timer-without-progress.png");
    });

    test("Check survey timer both values - page and total", async ({ page }) => {
      await page.setViewportSize({ width: 1400, height: 800 });
      const json = {
        showQuestionNumbers: "on",
        "showTimer": true,
        "timeLimit": 227,
        "timeLimitPerPage": 107,
        "widthMode": "static",
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
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        const style = document.createElement("style");
        style.innerHTML = ".sd-timer__progress--animation { transition: none !important; }";
        document.body.appendChild(style);
        (window as any).Survey.SurveyTimer.instance.start = () => { };
      });

      await resetHoverToBody(page);
      await compareScreenshot(page, "body", "survey-timer-both.png");
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

    test("Check survey notifier info type", async ({ page }) => {
      await page.evaluate(() => {
        (window as any).Survey.settings.notifications.lifetime = 10000;
      });
      await page.setViewportSize({ width: 1920, height: 900 });

      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onComplete.add((_, options) => {
          options.isCompleteOnTrigger = false;
          options.showDataSaving();
          let fail = true;
          new Promise((resolve, reject) => {
            setTimeout(fail ? reject : resolve, 10000);
          }).then(
            () => { options.showDataSavingSuccess(); },
            () => { options.showDataSavingError(); }
          );
        });
        window["survey"].fromJSON(json);
      }, notifierJson);

      await page.evaluate(() => {
        (window as any).survey.data = { nps_score: 4 };
      });
      await page.click("input[value=\"Complete\"]");
      await compareScreenshot(page, ".sv-save-data_root", "save-data-saving.png");
      await page.evaluate(() => {
        (window as any).Survey.settings.notifications.lifetime = 2000;
      });
    });

    test("Check survey notifier error type", async ({ page }) => {
      await page.evaluate(() => {
        (window as any).Survey.settings.notifications.lifetime = 10000;
      });
      await page.setViewportSize({ width: 1920, height: 900 });

      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onComplete.add((_, options) => {
          options.isCompleteOnTrigger = false;
          options.showDataSaving();
          let fail = true;
          new Promise((resolve, reject) => {
            setTimeout(fail ? reject : resolve, 500);
          }).then(
            () => { options.showDataSavingSuccess(); },
            () => { options.showDataSavingError(); }
          );
        });
        window["survey"].fromJSON(json);
      }, notifierJson);

      await page.evaluate(() => {
        (window as any).survey.data = { nps_score: 4 };
      });
      await page.click("input[value=\"Complete\"]");
      await compareScreenshot(page, ".sv-save-data_root.sv-save-data_error", "save-data-error.png");
      await page.evaluate(() => {
        (window as any).survey.notify("An error occurred and we could not save the results.", "error", false);
      });
      await compareScreenshot(page, ".sv-save-data_root.sv-save-data_error", "save-data-error-without-button.png");
      await page.evaluate(() => {
        (window as any).Survey.settings.notifications.lifetime = 2000;
      });
    });

    test("Check survey notifier success type", async ({ page }) => {
      await page.evaluate(() => {
        (window as any).Survey.settings.notifications.lifetime = 10000;
      });
      await page.setViewportSize({ width: 1920, height: 900 });

      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onComplete.add((_, options) => {
          options.isCompleteOnTrigger = false;
          options.showDataSaving();
          let fail = false;
          new Promise((resolve, reject) => {
            setTimeout(fail ? reject : resolve, 500);
          }).then(
            () => { options.showDataSavingSuccess(); },
            () => { options.showDataSavingError(); }
          );
        });
        window["survey"].fromJSON(json);
      }, notifierJson);

      await page.evaluate(() => {
        (window as any).survey.data = { nps_score: 4 };
      });
      await page.click("input[value=\"Complete\"]");
      await compareScreenshot(page, ".sv-save-data_root.sv-save-data_success", "save-data-success.png");
      await page.evaluate(() => {
        (window as any).Survey.settings.notifications.lifetime = 2000;
      });
    });

    test("TOC survey navigation", async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 900 });
      const json = {
        showQuestionNumbers: "on",
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
      await initSurvey(page, framework, json);

      await compareScreenshot(page, ".sv-components-row", "survey-navigation-toc-left.png");
      await page.click(".sd-item__control-label");
      await page.click(".sd-navigation__next-btn");
      await page.click(".sd-item__control-label");
      await page.click(".sd-navigation__next-btn");
      await page.click(".sd-navigation__complete-btn");
      await compareScreenshot(page, ".sd-root-modern", "survey-completed-no-toc.png");
    });

    test("TOC survey navigation right", async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 900 });
      const json = {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        title: "Software developer survey.",
        showTOC: true,
        tocLocation: "right",
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
      await initSurvey(page, framework, json);
      await compareScreenshot(page, ".sv-components-row", "survey-navigation-toc-right.png");
    });

    test("Survey complete pages", async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 900 });
      const json = {
        showQuestionNumbers: "on",
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
      await initSurvey(page, framework, json);
      await page.click(".sd-navigation__complete-btn");
      await compareScreenshot(page, ".sd-root-modern", "survey-completed.png");
      await page.evaluate(() => {
        document.body.style.setProperty("--sjs-corner-radius", "0px");
        (window as any).survey.clear();
        (window as any).survey.isCompletedBefore = true;
      });
      await compareScreenshot(page, ".sd-root-modern", "survey-completed-before.png");
    });

    test("Check survey in compact mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
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
      await initSurvey(page, framework, json);
      await resetFocusToBody(page);
      await page.evaluate(() => {
        document.body.style.setProperty("--background-dim", "#fff");
        (window as any).survey.isCompact = true;
      });
      await compareScreenshot(page, ".sd-root-modern", "survey-page-without-title-compact.png");
    });

    test("Check survey in compact mode page has title", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
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
      await initSurvey(page, framework, json);
      await resetFocusToBody(page);
      await page.evaluate(() => {
        document.body.style.setProperty("--background-dim", "#fff");
        (window as any).survey.isCompact = true;
      });
      await compareScreenshot(page, ".sd-root-modern", "survey-compact.png");
    });

    test("Check survey with panels in compact mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        showQuestionNumbers: "on",
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
      };
      await initSurvey(page, framework, json);
      await resetFocusToBody(page);
      await page.evaluate(() => {
        document.body.style.setProperty("--background-dim", "#f3f3f3");
        (window as any).survey.isCompact = true;
      });
      await compareScreenshot(page, ".sd-root-modern", "survey-with-panel-compact.png");
    });

    test("TOC survey navigation mobile", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 900 });
      await page.evaluate(() => {
        window["Survey"]._setIsTouch(true);
      });
      const json = {
        showQuestionNumbers: "on",
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
      await initSurvey(page, framework, json);
      await compareScreenshot(page, ".sd-root-modern", "survey-navigation-toc-mobile.png");
      await page.click(".sv_progress-toc--mobile > div");
      await compareScreenshot(page, ".sv-popup .sv-popup__container", "survey-navigation-toc-mobile-popup.png");
    });

    test("TOC survey navigation responsive", async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 900 });
      const json = {
        showQuestionNumbers: "on",
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
      await initSurvey(page, framework, json);

      await compareScreenshot(page, ".sv-components-row", "survey-navigation-toc-left.png");
      await page.setViewportSize({ width: 600, height: 900 });
      await compareScreenshot(page, ".sd-root-modern", "survey-navigation-toc-mobile.png");
    });

    test("TOC survey navigation wide questions fit total width", async ({ page }) => {
      await page.setViewportSize({ width: 1600, height: 900 });
      const json = {
        showQuestionNumbers: "on",
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
      await initSurvey(page, framework, json);

      await compareScreenshot(page, ".sv-components-row", "survey-navigation-toc-matrix-fit-width.png");
    });

    test("Check page with errors and title", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        showQuestionNumbers: "on",
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

      await initSurvey(page, framework, json);

      await page.click("input[title='Complete']");
      await compareScreenshot(page, ".sd-root-modern", "survey-page-with-error-with-title.png");
      await page.evaluate(() => (window as any).survey.isCompact = true);
      await compareScreenshot(page, ".sd-root-modern", "survey-compact-page-with-error-with-title.png");
      await page.evaluate(() => { (window as any).survey.questionsOnPageMode = "singlePage"; });
      await page.click("input[title='Complete']");
      // if (framework !== "vue" && framework !== "knockout") {
      await compareScreenshot(page, ".sd-root-modern", "survey-compact-spm-page-with-error-with-title.png");
      // }
      await page.evaluate(() => (window as any).survey.isCompact = false);
      await compareScreenshot(page, ".sd-root-modern", "survey-spm-page-with-error-with-title.png");
    });

    test("Check page with errors and without title", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        showQuestionNumbers: "on",
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

      await initSurvey(page, framework, json);

      await page.click("input[title='Complete']");
      await compareScreenshot(page, ".sd-root-modern", "survey-page-with-error-without-title.png");
      await page.evaluate(() => (window as any).survey.isCompact = true);
      await compareScreenshot(page, ".sd-root-modern", "survey-compact-page-with-error-without-title.png");
      await page.evaluate(() => { (window as any).survey.questionsOnPageMode = "singlePage"; });
      await page.click("input[title='Complete']");
      await compareScreenshot(page, ".sd-root-modern", "survey-compact-spm-page-with-error-without-title.png");
      await page.evaluate(() => (window as any).survey.isCompact = false);
      await compareScreenshot(page, ".sd-root-modern", "survey-spm-page-with-error-without-title.png");
    });

    test("Check multiple row in compact mode", async ({ page }) => {
      await page.setViewportSize({ width: 700, height: 1080 });
      const json = {
        showQuestionNumbers: "on",
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

      await initSurvey(page, framework, json);

      await page.evaluate(() => (window as any).survey.isCompact = true);
      await compareScreenshot(page, ".sd-root-modern", "row-multiple-compact-mode.png");
    });

    test("Check survey logo right with empty title", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        "logo": upArrowImageLink,
        "logoPosition": "right",
        headerView: "basic",
        showQuestionNumbers: "on",
        "elements": [
          {
            "type": "text",
            "name": "FirstName",
            "title": "Enter your first name:"
          },
        ],
        "widthMode": "responsive"
      };

      await initSurvey(page, framework, json);

      await compareScreenshot(page, ".sd-root-modern", "survey-logo-right-without-title.png");
    });

    test("Do not scroll to survey by default", async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 300 });
      await page.evaluate(() => {
        const el = document.createElement("div");
        el.style.height = "1000px";
        document.body.insertBefore(el, document.body.firstChild);
      });
      const json = {
        showQuestionNumbers: "on",
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

      await initSurvey(page, framework, json);
      await page.waitForTimeout(100);
      await compareScreenshot(page, undefined, "survey-no-scrolling.png");
      await page.click(".sd-btn.sd-navigation__next-btn");
      await page.waitForTimeout(100);
      await compareScreenshot(page, undefined, "survey-scrolling-second-page.png");
    });

    test("Scroll to survey", async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 300 });
      await page.evaluate(() => {
        const el = document.createElement("div");
        el.style.height = "1000px";
        document.body.insertBefore(el, document.body.firstChild);
      });
      const json = {
        showQuestionNumbers: "on",
        "focusFirstQuestionAutomatic": true,
        "elements": [
          {
            "type": "text",
            "name": "q1"
          },
        ]
      };

      await initSurvey(page, framework, json);
      await page.waitForTimeout(100);
      await compareScreenshot(page, undefined, "survey-scrolling.png");
    });
  });
});