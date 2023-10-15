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

  test("Check items size & colors", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 2000);
      await initSurvey(framework, {
        "logoPosition": "right",
        "showQuestionNumbers": "off",
        "elements": [
          {
            type: "dropdown",
            name: "cars",
            choices: [
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen"
            ]
          },
          {
            "type": "checkbox",
            "name": "question6",
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ]
          },
          {
            "type": "ranking",
            "name": "question1",
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ]
          },
          {
            "type": "radiogroup",
            "name": "question4",
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ]
          },
          {
            "type": "rating",
            "name": "question5"
          },
          {
            type: "imagepicker",
            name: "choosepicture",
            showLabel: true,
            choices: [{
              value: "lion",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
            },
            {
              value: "giraffe",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
            },
            ]
          }
        ]
      });
      await ClientFunction(() => {
        (<any>window).survey.applyTheme({
          "cssVariables": {
            "--sjs-font-questiontitle-color": "rgba(242, 2, 2, 1)",
            "--sjs-font-editorfont-size": "24px"
          }
        });
      })();
      await takeElementScreenshot("survey-theme-questiontitle-font-color-for-items.png", Selector(".sd-root-modern"), t, comparer);

      await t.click(".sd-dropdown");
      await takeElementScreenshot("survey-theme-questiontitle-font-color-for-dropdown-list-items.png", Selector(".sv-popup.sv-dropdown-popup .sv-popup__container"), t, comparer);
    });
  });

  test("Check input element placeholder", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 1600);
      await initSurvey(framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "boolean",
                "name": "question1"
              },
              {
                "type": "multipletext",
                "name": "question2",
                "items": [
                  {
                    "name": "text1"
                  },
                  {
                    "name": "text2"
                  }
                ]
              },
              {
                "type": "dropdown",
                "name": "question3",
                "defaultValue": "Item 1",
                "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
                ]
              }
            ]
          }
        ]
      });
      await ClientFunction(() => {
        (<any>window).survey.applyTheme({
          "cssVariables": {
            "--sjs-font-editorfont-placeholdercolor": "rgba(66, 123, 215, 1)"
          }
        });
      })();
      await takeElementScreenshot("survey-theme-editorfont-placeholdercolor.png", Selector(".sd-root-modern"), t, comparer);
    });
  });
});