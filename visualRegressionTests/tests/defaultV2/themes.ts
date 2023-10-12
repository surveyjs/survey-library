import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, wrapVisualTest } from "../../helper";

const title = "Survey themes Screenshot";

fixture`${title}`.page`${url}`;

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`
    .beforeEach(async t => {
      await applyTheme(theme);
    });

  test("Check question title font size", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 1600);
      await initSurvey(framework, {
        "logoPosition": "right",
        "showQuestionNumbers": "off",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "file",
                "name": "question5"
              },
              {
                "type": "matrixdynamic",
                "name": "question1",
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
                ]
              },
              {
                "type": "paneldynamic",
                "name": "question2",
                "templateElements": [
                  {
                    "type": "text",
                    "name": "question3"
                  }
                ],
                "panelCount": 3,
                "minPanelCount": 3,
                "renderMode": "tab"
              }
            ]
          },
          {
            "name": "page2",
            "elements": [
              {
                "type": "text",
                "name": "question4"
              }
            ]
          }
        ]
      });
      await ClientFunction(() => {
        (<any>window).survey.applyTheme({
          "cssVariables": {
            "--sjs-font-questiontitle-size": "24px"
          }
        });
      })();
      await takeElementScreenshot("survey-theme-questiontitle-font-size.png", Selector(".sd-root-modern"), t, comparer);
    });
  });
  test("Check question title font size", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 1600);
      await initSurvey(framework, {
        "logoPosition": "right",
        "showQuestionNumbers": "off",
        "elements": [{
          type: "matrix",
          name: "Quality",
          title: "Matrix",
          columns: [
            {
              value: 1,
              text: "Strongly Disagree"
            },
            {
              value: 2,
              text: "Disagree"
            },
            {
              value: 3,
              text: "Neutral"
            },
            {
              value: 4,
              text: "Agree"
            },
            {
              value: 5,
              text: "Strongly Agree"
            }
          ],
          rows: [
            {
              value: "affordable",
              text: "Product is affordable"
            },
            {
              value: "does what it claims",
              text: "Product does what it claims"
            },
            {
              value: "better than others",
              text: "Product is better than other products on the market"
            },
            {
              value: "easy to use",
              text: "Product is easy to use"
            }
          ]
        }]
      });
      await ClientFunction(() => {
        (<any>window).survey.applyTheme({
          "cssVariables": {
            "--sjs-font-editorfont-size": "24px",
            "--sjs-font-questiontitle-weight": "400"
          }
        });
      })();
      await takeElementScreenshot("survey-theme-questiontitle-font-weight.png", Selector(".sd-root-modern"), t, comparer);
    });
  });
});