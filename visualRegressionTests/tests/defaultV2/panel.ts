import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, explicitErrorHandler, resetFocusToBody, wrapVisualTest, takeElementScreenshot } from "../../helper";

const title = "Panel Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await explicitErrorHandler();
    await applyTheme(theme);
  });

  test("Check oridinary panel", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
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
      const panelRoot = Selector(".sd-panel");
      await takeElementScreenshot("panel.png", panelRoot, t, comparer);
    });
  });

  test("Check panel with elements in one line", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Contact",
            width: "780px",
            elements: [
              {
                type: "text",
                name: "question_with_num",
                title: "Personal information"
              },
              {
                type: "text",
                name: "question_with_num",
                startWithNewLine: false,
                title: "Contact information"
              },
              {
                type: "text",
                name: "question_with_num",
                startWithNewLine: false,
                title: "Other information"
              },
            ]
          },
        ]
      });
      await ClientFunction(()=> document.body.focus())();
      const panelRoot = Selector(".sd-panel");
      await takeElementScreenshot("panel-elements-one-row.png", panelRoot, t, comparer);
    });
  });
  test("Check panel expand/collapse", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            width: "708px",
            state: "collapsed",
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

      const panelRoot = Selector(".sd-panel");
      await takeElementScreenshot("panel-collapse.png", panelRoot, t, comparer);
      await t.click(panelRoot.find(".sd-panel__title"));
      await takeElementScreenshot("panel-expand.png", panelRoot, t, comparer);
    });
  });

  test("Check invisible panel when showInvisibleElements: true", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            width: "708px",
            visible: false,
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
      const panelRoot = Selector(".sd-panel");
      await ClientFunction(()=>{ (<any>window).survey.showInvisibleElements = true; })();
      await resetFocusToBody();
      await takeElementScreenshot("panel-invisible.png", panelRoot, t, comparer);
    });
  });

  test("Check panel in row", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "elements": [
          {
            type: "html",
            name: "question0",
            html: "HTML1",
            title: "Question title",
            titleLocation: "hidden"
          },
          {
            type: "panel",
            name: "name",
            showQuestionNumbers: "off",
            startWithNewLine: false,
            elements: [
              {
                type: "html",
                name: "question1",
                html: "HTML2",
                title: "Question title",
                titleLocation: "hidden"
              }
            ]
          }
        ]
      });
      const rowRoot = Selector(".sd-row");
      await ClientFunction(()=>{ (<any>window).survey.showInvisibleElements = true; })();
      await resetFocusToBody();
      await takeElementScreenshot("panel-in-row.png", rowRoot, t, comparer);
    });
  });

  test("Check panel with actions", async(t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "elements": [
          {
            type: "text",
            name: "question1",
            title: "Question title",
          }
        ]
      });
      await t.typeText(Selector(".sd-input"), "This is my answer");
      await ClientFunction(()=>{
        document.body.focus();
        (<any>window).survey.showPreview();
      })();
      const panelRoot = Selector(".sd-panel");
      await takeElementScreenshot("panel-with-actions.png", panelRoot, t, comparer);
    });
  });

  test("Check panel with actions", async(t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(722, 1000);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [

          {
            "type": "panel",
            "name": "panel1",
            "elements": [
              {
                "type": "panel",
                "name": "panel2",
                "elements": [
                  {
                    "type": "text",
                    "name": "question1"
                  }
                ],
                "title": "Panel 2",
                "startWithNewLine": false
              },
              {
                "type": "panel",
                "name": "panel3",
                "elements": [
                  {
                    "type": "text",
                    "name": "question2"
                  }
                ],
                "title": "Panel 3",
                "startWithNewLine": false
              }
            ],
            "title": "Panel 1"
          },
        ]
      });
      await ClientFunction(()=>{
        document.body.focus();
      })();
      const panelRoot = Selector(".sd-panel");
      await takeElementScreenshot("two-panels-one-row-small-screen.png", panelRoot, t, comparer);
    });
  });
  test("Check panel with errors above", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            width: "708px",
            elements: [
              {
                type: "radiogroup",
                name: "delivery_agent",
                isRequired: true,
                title: "Delivery agent",
                choices: ["DHL", "Pony Express", "FedEx"]
              },
              {
                type: "boolean",
                isRequired: true,
                name: "delivery_speed",
                title: "Do you like to get the order as fast as it possible?"
              }
            ]
          },
        ]
      });
      const panelRoot = Selector(".sd-panel");
      await resetFocusToBody();
      await t.click(Selector("input[value='Complete']"));
      await t.hover(Selector("body"), { offsetX: 0, offsetY: 0 });
      await takeElementScreenshot("panel-with-question-errors-above.png", panelRoot, t, comparer);
    });
  });

  test("Check panel with errors and question title location left", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            width: "708px",
            elements: [
              {
                type: "radiogroup",
                name: "delivery_agent",
                isRequired: true,
                titleLocation: "left",
                title: "Delivery agent",
                choices: ["DHL", "Pony Express", "FedEx"]
              },
              {
                type: "boolean",
                isRequired: true,
                titleLocation: "left",
                name: "delivery_speed",
                title: "Do you like to get the order as fast as it possible?"
              }
            ]
          },
        ]
      });
      const panelRoot = Selector(".sd-panel");
      await resetFocusToBody();
      await t.click(Selector("input[value='Complete']"));
      await takeElementScreenshot("panel-with-question-title-left-and-errors-above.png", panelRoot, t, comparer);
    });
  });

  test("Check panel with errors below", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questionErrorLocation: "bottom",
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            width: "708px",
            elements: [
              {
                type: "radiogroup",
                name: "delivery_agent",
                isRequired: true,
                title: "Delivery agent",
                choices: ["DHL", "Pony Express", "FedEx"]
              },
              {
                type: "boolean",
                isRequired: true,
                name: "delivery_speed",
                title: "Do you like to get the order as fast as it possible?"
              }
            ]
          },
        ]
      });
      const panelRoot = Selector(".sd-panel");
      await resetFocusToBody();
      await t.click(Selector("input[value='Complete']"));
      await takeElementScreenshot("panel-with-question-errors-below.png", panelRoot, t, comparer);
    });
  });
  test("Check panel with number", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            width: "708px",
            showNumber: true,
            elements: [
              {
                type: "text",
                name: "delivery_agent",
                isRequired: true,
                title: "Delivery agent",
              },
            ]
          },
        ]
      });
      const panelRoot = Selector(".sd-panel");
      await resetFocusToBody();
      await takeElementScreenshot("panel-with-number.png", panelRoot, t, comparer);
    });
  });
  test("Check panel with singlePage mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questionsOnPageMode: "singlePage",
        pages: [
          {
            title: "Page title",
            description: "Page description",
            elements: [{
              name: "username",
              type: "text",
              title: "Username",
            }, {
              name: "email",
              type: "text",
              title: "E-mail address"
            }, {
              name: "password",
              type: "text",
              title: "Password"
            }]
          }]
      });
      const panelRoot = Selector(".sd-panel");
      await resetFocusToBody();
      await takeElementScreenshot("panel-single-page.png", panelRoot, t, comparer);
    });
  });
  test("Check inner panel with singlePage mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questionsOnPageMode: "singlePage",
        pages: [
          {
            title: "Page",
            elements: [
              {
                "type": "panel",
                "name": "panel",
                "elements": [
                  {
                    "type": "text",
                    "name": "question2"
                  },
                  {
                    "type": "text",
                    "name": "question1"
                  }
                ],
                "title": "Panel"
              }
            ]
          }
        ]
      });
      const panelRoot = Selector(".sd-panel");
      await resetFocusToBody();
      await takeElementScreenshot("inner-panel-single-page.png", panelRoot, t, comparer);
    });
  });
  test("Check collapsed questions inside panel", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        elements: [
          {
            "type": "panel",
            "name": "panel",
            "elements": [
              {
                "type": "text",
                state: "collapsed",
                "name": "question2"
              },
              {
                "type": "text",
                state: "collapsed",
                "name": "question1"
              }
            ],
            "title": "Panel"
          }
        ]
      });
      const panelRoot = Selector(".sd-panel");
      await resetFocusToBody();
      await takeElementScreenshot("collapsed-questions-inside-panel.png", panelRoot, t, comparer);
      await t.hover(Selector(".sd-question__header"));
      await takeElementScreenshot("collapsed-questions-inside-panel-hover.png", panelRoot, t, comparer);
    });
  });
  test("Check panel with errors", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        elements: [
          {
            "type": "panel",
            "name": "panel",
            "isRequired": true,
            "elements": [
              {
                "type": "text",
                "name": "question2"
              }
            ],
            "title": "Panel"
          }
        ]
      });
      const panelRoot = Selector(".sd-panel");
      await resetFocusToBody();
      await t.click("input[value='Complete']");
      await takeElementScreenshot("panel-with-errors.png", panelRoot, t, comparer);
    });
  });
  test("Check panel with errors without title", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        elements: [
          {
            "type": "panel",
            "name": "panel",
            "isRequired": true,
            "elements": [
              {
                "type": "text",
                "name": "question2"
              }
            ],
          }
        ]
      });
      const panelRoot = Selector(".sd-panel");
      await resetFocusToBody();
      await t.click("input[value='Complete']");
      await takeElementScreenshot("panel-with-errors-without-title.png", panelRoot, t, comparer);
    });
  });
});