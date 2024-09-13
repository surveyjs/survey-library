import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, resetFocusToBody, wrapVisualTest, takeElementScreenshot, resetHoverToBody } from "../../helper";

const title = "Panel Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => { await applyTheme(theme); });

  test("Check oridinary panel", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        width: "900px",
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
      const panelRoot = Selector(".sd-panel");
      await takeElementScreenshot("panel.png", panelRoot, t, comparer);
    });
  });

  test("Check panel with elements in one line", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Contact",
            minWidth: "780px",
            maxWidth: "780px",
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
      await ClientFunction(() => document.body.focus())();
      const panelRoot = Selector(".sd-panel");
      await takeElementScreenshot("panel-elements-one-row.png", panelRoot, t, comparer);
    });
  });
  test("Check panel expand/collapse", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
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

  test("Check panel expand/collapse - rtl", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await ClientFunction(() => {
        document.body.setAttribute("dir", "rtl");
      })();

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "panel",
            name: "details",
            title: "Please answer",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            state: "collapsed",
            elements: [
              {
                type: "text",
                name: "question",
              }
            ]
          },
        ]
      });

      const panelRoot = Selector(".sd-panel");
      await takeElementScreenshot("panel-collapse-rtl.png", panelRoot, t, comparer);
      await t.click(panelRoot.find(".sd-panel__title"));
      await takeElementScreenshot("panel-expand-rtl.png", panelRoot, t, comparer);

      await t.resizeWindow(400, 1080);

      await takeElementScreenshot("panel-expand-mobile-rtl.png", panelRoot, t, comparer);

      await ClientFunction(() => {
        document.body.setAttribute("dir", "ltr");
      })();
    });
  });

  test("Check invisible panel when showInvisibleElements: true", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
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
      await ClientFunction(() => { (<any>window).survey.showInvisibleElements = true; })();
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
      await ClientFunction(() => { (<any>window).survey.showInvisibleElements = true; })();
      await resetFocusToBody();
      await takeElementScreenshot("panel-in-row.png", rowRoot, t, comparer);
    });
  });

  test("Check panel with actions", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page0",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ]
          },
          {
            "name": "page1",
            "elements": [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    "type": "text",
                    "name": "question1"
                  }
                ]
              }
            ]
          }
        ]
      });

      await ClientFunction(() => {
        var panel = window["survey"].getAllPanels()[0];
        var locstr = new window["Survey"].LocalizableString(panel);
        locstr.text = "Edit";
        panel.footerActions.push({ id: "test", locTitle: locstr });
      })();

      await t.click(Selector("input[title=Next]"));
      const panelRoot = Selector(".sd-panel");
      await takeElementScreenshot("panel-with-actions.png", panelRoot, t, comparer);
    });
  });

  test("Check preview mode", async (t) => {
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
      await ClientFunction(() => {
        document.body.focus();
        (<any>window).survey.showPreview();
      })();
      const panelRoot = Selector(".sd-panel");
      await takeElementScreenshot("panel-preview-mode.png", panelRoot, t, comparer);
    });
  });

  test("Check preview mode for multi-rows", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page2",
            "elements": [
              {
                "type": "text",
                "name": "question5",
                "title": "First name"
              },
              {
                "type": "text",
                "name": "question6",
                "startWithNewLine": false,
                "title": "Last name"
              },
              {
                "type": "text",
                "name": "question7",
                "title": "Address"
              },
              {
                type: "panel",
                "name": "dd",
                "elements": [
                  {
                    "type": "text",
                    "name": "question1",
                    "title": "First name"
                  },
                  {
                    "type": "text",
                    "name": "question2",
                    "startWithNewLine": false,
                    "title": "Last name"
                  },
                  {
                    "type": "text",
                    "name": "question3",
                    "title": "Address"
                  },
                ]
              },
            ]
          },
        ],
        "showQuestionNumbers": "off",
        "questionsOnPageMode": "singlePage",
        "showPreviewBeforeComplete": "showAllQuestions",
        "widthMode": "static",
        "width": "800"
      });
      await ClientFunction(() => {
        document.body.focus();
        (<any>window).survey.showPreview();
      })();
      const panelRoot = Selector(".sd-panel--as-page");
      await takeElementScreenshot("panel-preview-mode-multi.png", panelRoot, t, comparer);
    });
  });

  test("Check preview mode for multi-rows Panelless", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page2",
            "elements": [
              {
                "type": "text",
                "name": "question5",
                "title": "First name"
              },
              {
                "type": "text",
                "name": "question6",
                "startWithNewLine": false,
                "title": "Last name"
              },
              {
                "type": "text",
                "name": "question7",
                "title": "Address"
              },
              {
                type: "panel",
                "name": "dd",
                "elements": [
                  {
                    "type": "text",
                    "name": "question1",
                    "title": "First name"
                  },
                  {
                    "type": "text",
                    "name": "question2",
                    "startWithNewLine": false,
                    "title": "Last name"
                  },
                  {
                    "type": "text",
                    "name": "question3",
                    "title": "Address"
                  },
                ]
              },
            ]
          },
        ],
        "showQuestionNumbers": "off",
        "questionsOnPageMode": "singlePage",
        "showPreviewBeforeComplete": "showAllQuestions",
        "widthMode": "static",
        "width": "800"
      });
      await ClientFunction(() => {
        const themeJson = {
          "isPanelless": true
        };
        window["survey"].applyTheme(themeJson);
      })();
      const panelRoot = Selector(".sd-panel--as-page");
      await takeElementScreenshot("panel-multi-panelless.png", panelRoot, t, comparer);
      await ClientFunction(() => {
        document.body.focus();
        (<any>window).survey.showPreview();
      })();
      await takeElementScreenshot("panel-preview-mode-multi-panelless.png", panelRoot, t, comparer);
    });
  });

  test("Two panels - one row, small screen", async (t) => {
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
      await ClientFunction(() => {
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
        width: "900px",
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
      await resetHoverToBody(t);
      await takeElementScreenshot("panel-with-question-errors-above.png", panelRoot, t, comparer);
    });
  });

  test("Check panel with errors and question title location left", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
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
        width: "900px",
        questionErrorLocation: "bottom",
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
        width: "900px",
        questions: [
          {
            type: "panel",
            name: "delivery_details",
            title: "Please, specify the delivery details.",
            minWidth: "708px",
            maxWidth: "708px",
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
  test("Check panel with singlePage mode - one line", async (t) => {
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
              title: "E-mail address",
              startWithNewLine: false
            }, {
              name: "password",
              type: "text",
              title: "Password",
              startWithNewLine: false
            }]
          }]
      });
      const panelRoot = Selector(".sd-panel");
      await resetFocusToBody();
      await takeElementScreenshot("panel-single-page-one-line.png", panelRoot, t, comparer);
    });
  });
  test("Check multiple panels with singlePage mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questionsOnPageMode: "singlePage",
        pages: [
          {
            title: "Page title",
            description: "Page description",
            elements: [
              {
                name: "username",
                type: "text",
                title: "Username",
              }
            ]
          },
          {
            title: "Page title 2",
            description: "Page description 2",
            elements: [
              {
                name: "email",
                type: "text",
                title: "email",
              }
            ]
          }
        ]
      });
      const panelRoot = Selector(".sd-container-modern");
      await resetFocusToBody();
      await takeElementScreenshot("multiple-panels-single-page.png", panelRoot, t, comparer);
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
  test("Check question min size inside panels in design mode", async (t) => {
    if (framework == "vue") return;
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(370, 800);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    "type": "panel",
                    "name": "panel2",
                    "elements": [
                      {
                        "type": "panel",
                        "name": "panel3",
                        "elements": [
                          {
                            "type": "text",
                            "name": "question1"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
      const panelRoot = Selector(".sd-body");
      await ClientFunction(() => {
        (window as any).survey.setDesignMode(true);
        (window as any).survey.setIsMobile(true);
      })();
      await resetFocusToBody();
      await takeElementScreenshot("responsive-question-inside-panels-in-creator.png", panelRoot, t, comparer);
    });
  });
  test("Scroll into view if needed on expanding panel", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(400, 600);
      await initSurvey(framework, {
        showNavigationButtons: "none",
        width: "500px",
        elements: [
          {
            type: "comment",
            name: "q1"
          },
          {
            type: "comment",
            name: "q2"
          },
          {
            type: "comment",
            name: "q3"
          },
          {
            type: "comment",
            name: "q4"
          },
          {
            type: "panel",
            name: "panel",
            state: "collapsed",
            elements: [
              {
                type: "comment",
                name: "panel_q1"
              },
              {
                type: "comment",
                name: "panel_q2"
              }
            ]
          },
        ]
      });
      await t.scrollBy(0, 400);
      const panelTitle = Selector(".sd-panel__title");
      await t.click(panelTitle);
      await takeElementScreenshot("panel-scroll-on-expand.png", null, t, comparer);
    });
  });
});