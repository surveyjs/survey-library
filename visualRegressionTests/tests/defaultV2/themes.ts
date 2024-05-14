import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, wrapVisualTest } from "../../helper";
import { getListItemByText } from "../../../testCafe/helper";

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
        focusFirstQuestionAutomatic: true,
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
  test("Check question title font size, #2", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 1600);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
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
        focusFirstQuestionAutomatic: true,
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
        focusFirstQuestionAutomatic: true,
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

  test("Check dropdown element colors", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 1600);
      await initSurvey(framework, {
        "elements": [
          {
            "type": "dropdown",
            "name": "dropdown",
            "defaultValue": "Item 1",
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ]
          }
        ]
      });
      await ClientFunction(() => {
        (<any>window).survey.applyTheme({
          "cssVariables": {
            "--sjs-general-backcolor": "rgba(255, 255, 255, 0.25)", "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)", "--sjs-general-backcolor-dim": "#1846A5", "--sjs-general-backcolor-dim-light": "rgba(255, 255, 255, 0.99)", "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)", "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)", "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)", "--sjs-general-dim-forecolor": "rgba(0, 0, 0, 0.91)", "--sjs-general-dim-forecolor-light": "rgba(0, 0, 0, 0.45)", "--sjs-primary-backcolor": "rgba(24, 70, 165, 1)", "--sjs-primary-backcolor-light": "rgba(24, 70, 165, 0.1)", "--sjs-primary-backcolor-dark": "rgba(22, 64, 150, 1)", "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)", "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)", "--sjs-base-unit": "8px", "--sjs-corner-radius": "4px", "--sjs-secondary-backcolor": "rgba(255, 152, 20, 1)", "--sjs-secondary-backcolor-light": "rgba(255, 152, 20, 0.1)", "--sjs-secondary-backcolor-semi-light": "rgba(255, 152, 20, 0.25)", "--sjs-secondary-forecolor": "rgba(255, 255, 255, 1)", "--sjs-secondary-forecolor-light": "rgba(255, 255, 255, 0.25)", "--sjs-shadow-small": "0px 0px 0px 0px rgba(0, 0, 0, 0)", "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.1)", "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.1)", "--sjs-shadow-inner": "0px 0px 0px 0px rgba(0, 0, 0, 0)", "--sjs-border-light": "rgba(24, 70, 165, 0.15)", "--sjs-border-default": "rgba(0, 0, 0, 0.25)", "--sjs-border-inside": "rgba(0, 0, 0, 0.16)", "--sjs-special-red": "rgba(229, 10, 62, 1)", "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)", "--sjs-special-red-forecolor": "rgba(255, 255, 255, 1)", "--sjs-special-green": "rgba(25, 179, 148, 1)", "--sjs-special-green-light": "rgba(25, 179, 148, 0.1)", "--sjs-special-green-forecolor": "rgba(255, 255, 255, 1)", "--sjs-special-blue": "rgba(67, 127, 217, 1)", "--sjs-special-blue-light": "rgba(67, 127, 217, 0.1)", "--sjs-special-blue-forecolor": "rgba(255, 255, 255, 1)", "--sjs-special-yellow": "rgba(255, 152, 20, 1)", "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)", "--sjs-special-yellow-forecolor": "rgba(255, 255, 255, 1)", "--sjs-article-font-xx-large-textDecoration": "none", "--sjs-article-font-xx-large-fontWeight": "700", "--sjs-article-font-xx-large-fontStyle": "normal", "--sjs-article-font-xx-large-fontStretch": "normal", "--sjs-article-font-xx-large-letterSpacing": "0", "--sjs-article-font-xx-large-lineHeight": "64px", "--sjs-article-font-xx-large-paragraphIndent": "0px", "--sjs-article-font-xx-large-textCase": "none", "--sjs-article-font-x-large-textDecoration": "none", "--sjs-article-font-x-large-fontWeight": "700", "--sjs-article-font-x-large-fontStyle": "normal", "--sjs-article-font-x-large-fontStretch": "normal", "--sjs-article-font-x-large-letterSpacing": "0", "--sjs-article-font-x-large-lineHeight": "56px", "--sjs-article-font-x-large-paragraphIndent": "0px", "--sjs-article-font-x-large-textCase": "none", "--sjs-article-font-large-textDecoration": "none", "--sjs-article-font-large-fontWeight": "700", "--sjs-article-font-large-fontStyle": "normal", "--sjs-article-font-large-fontStretch": "normal", "--sjs-article-font-large-letterSpacing": "0", "--sjs-article-font-large-lineHeight": "40px", "--sjs-article-font-large-paragraphIndent": "0px", "--sjs-article-font-large-textCase": "none", "--sjs-article-font-medium-textDecoration": "none", "--sjs-article-font-medium-fontWeight": "700", "--sjs-article-font-medium-fontStyle": "normal", "--sjs-article-font-medium-fontStretch": "normal", "--sjs-article-font-medium-letterSpacing": "0", "--sjs-article-font-medium-lineHeight": "32px", "--sjs-article-font-medium-paragraphIndent": "0px", "--sjs-article-font-medium-textCase": "none", "--sjs-article-font-default-textDecoration": "none", "--sjs-article-font-default-fontWeight": "400", "--sjs-article-font-default-fontStyle": "normal", "--sjs-article-font-default-fontStretch": "normal", "--sjs-article-font-default-letterSpacing": "0", "--sjs-article-font-default-lineHeight": "28px", "--sjs-article-font-default-paragraphIndent": "0px", "--sjs-article-font-default-textCase": "none", "--sjs-article-font-xx-large-fontSize": "64px", "--sjs-article-font-x-large-fontSize": "48px", "--sjs-article-font-large-fontSize": "32px", "--sjs-article-font-medium-fontSize": "24px", "--sjs-article-font-default-fontSize": "16px", "--sjs-cover-backcolor": "transparent", "--sjs-question-background": "rgba(255, 255, 255, 1)", "--font-family": "Open Sans", "--sjs-questionpanel-backcolor": "rgba(255, 255, 255, 0.25)", "--sjs-questionpanel-cornerRadius": "8px", "--sjs-editor-background": "rgba(255, 255, 255, 1)", "--sjs-editorpanel-hovercolor": "rgba(24, 70, 165, 0.1)", "--sjs-editorpanel-backcolor": "rgba(255, 255, 255, 0.99)", "--sjs-editorpanel-cornerRadius": "3px", "--sjs-font-pagetitle-color": "rgba(255, 255, 255, 1)", "--sjs-font-editorfont-color": "rgba(0, 0, 0, 0.9)", "--sjs-font-editorfont-placeholdercolor": "rgba(0, 0, 0, 0.5)", "--sjs-font-questiontitle-color": "rgba(255, 255, 255, 1)", "--sjs-font-questiondescription-color": "rgba(255, 255, 255, 0.75)", "--sjs-questionpanel-hovercolor": "rgba(24, 70, 165, 0.1)", "--sjs-cover-title-forecolor": "#FFFFFF", "--sjs-cover-description-forecolor": "rgba(255, 255, 255, 1)", "--sjs-font-questiontitle-weight": "700", "--sjs-font-questiontitle-size": "14px", "--sjs-font-questiondescription-size": "14px", "--sjs-font-editorfont-size": "14px"
          }
        });
      })();
      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
      const popupContainer = Selector(".sv-popup__container").filterVisible();
      await t
        .click(questionDropdownSelect)
        .hover(getListItemByText("Item 2"));
      await takeElementScreenshot("survey-theme-dropdown-elements.png", popupContainer, t, comparer);
    });
  });

  const jsonWithInputs = {
    "logoPosition": "right",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "name": "question1",
            "defaultValue": "test1"
          },
          {
            "type": "comment",
            "name": "question2",
            "defaultValue": "test2"
          },
          {
            "type": "multipletext",
            "name": "question3",
            "defaultValue": {
              "text1": "test3"
            },
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
            "type": "checkbox",
            "name": "question6",
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ]
          },
          {
            "type": "dropdown",
            "name": "question7",
            "defaultValue": "Item 1",
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ]
          },
          {
            "type": "tagbox",
            "name": "question8",
            "defaultValue": [
              "Item 2",
              "Item 3"
            ],
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ]
          },
          {
            "type": "boolean",
            "name": "question9"
          },
          {
            "type": "ranking",
            "name": "question10",
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ]
          }
        ]
      }
    ]
  };

  test("Desktop: Input font-size less 16px", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 3000);
      await initSurvey(framework, jsonWithInputs);
      await ClientFunction(() => {
        (<any>window).survey.applyTheme({
          "cssVariables": {
            "--sjs-font-editorfont-size": "12px",
            "--sjs-font-size": "20px"
          }
        });
      })();

      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
      const popupContainer = Selector(".sv-popup__container").filterVisible();
      await takeElementScreenshot("survey-theme-desktop-input-size.png", Selector(".sd-root-modern"), t, comparer);

      await t.click(questionDropdownSelect);
      await takeElementScreenshot("survey-theme-desktop-popup-input-size.png", popupContainer, t, comparer);
    });
  });

  test("Mobile mode: input font-size is 16px", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(400, 2000);
      await ClientFunction(() => { window["Survey"]._setIsTouch(true); })();
      await initSurvey(framework, jsonWithInputs);
      await ClientFunction(() => {
        (<any>window).survey.applyTheme({
          "cssVariables": {
            "--sjs-font-editorfont-size": "12px",
            "--sjs-font-size": "20px"
          }
        });
      })();

      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
      const popupContainer = Selector(".sv-popup__container .sv-popup__content").filterVisible();
      await takeElementScreenshot("survey-theme-mobile-input-size.png", Selector(".sd-root-modern"), t, comparer);

      await t.resizeWindow(400, 1000);
      await t.click(questionDropdownSelect);
      await takeElementScreenshot("survey-theme-mobile-popup-input-size.png", popupContainer, t, comparer);
    });
  });

  test("HTML default color", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 3000);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "html",
                "name": "question1",
                "html": "HTML on surface"
              },
              {
                "type": "panel",
                "name": "panel1",
                "title": "Panel",
                "elements": [
                  {
                    "type": "html",
                    "name": "question2",
                    "html": "HTML in panel"
                  }
                ]
              }
            ],
            "title": "Page"
          }
        ]
      });
      await ClientFunction(() => {
        (<any>window).survey.applyTheme({
          "cssVariables": {
            "--sjs-general-forecolor": "red",
            "--sjs-general-dim-forecolor": "blue"
          }
        });
      })();

      await takeElementScreenshot("survey-html-theme.png", Selector(".sd-page"), t, comparer);
    });
  });

  test("Matrix many columns", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        "logoPosition": "right",
        "focusFirstQuestionAutomatic": false,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdynamic",
                "name": "matrix",
                "columns": [
                  {
                    "name": "col1"
                  },
                  {
                    "name": "col2"
                  },
                  {
                    "name": "col3"
                  },
                  {
                    "name": "col5"
                  },
                  {
                    "name": "col6"
                  },
                  {
                    "name": "col6"
                  },
                  {
                    "name": "col7"
                  },
                  {
                    "name": "col8"
                  },
                  {
                    "name": "col9"
                  },
                  {
                    "name": "col10"
                  },
                  {
                    "name": "col11"
                  },
                  {
                    "name": "col12"
                  }
                ],
                "rows": [
                  "item1",
                  "item2"
                ]
              }
            ]
          }
        ]
      });
      //await t.click(Selector("body"), { offsetX: 5, offsetY: 5 });
      await ClientFunction(() => {
        (<any>window).survey.isCompact = true;
        (<any>window).survey.applyTheme({
          "cssVariables": {
            "--sjs-general-backcolor-dim": "blue"
          }
        });
      })();
      const questionRoot = Selector(".sd-body");
      await takeElementScreenshot("question-matrix-dropdown-columns-theme.png", questionRoot, t, comparer);
    });
  });

});