import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, resetFocusToBody, wrapVisualTest, takeElementScreenshot } from "../../helper";

const title = "Question Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    await applyTheme(theme);
  });

  test("Check question without title", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "text",
            titleLocation: "hidden",
            name: "question",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
          },
        ]
      });
      const questionRoot = Selector(".sd-question");
      await resetFocusToBody();
      await takeElementScreenshot("question-without-title.png", questionRoot, t, comparer);
    });
  });

  test("Check question with empty title", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "text",
            title: " ",
            name: "question",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
          },
        ]
      });
      const questionRoot = Selector(".sd-question");
      await resetFocusToBody();
      await takeElementScreenshot("question-empty-title.png", questionRoot, t, comparer);
    });
  });
  test("Check question num", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        width: "900px",
        questions: [
          {
            type: "text",
            name: "question_with_num",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });
      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("question-with-num.png", questionRoot, t, comparer);
    });
  });

  test("Check question color", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        width: "900px",
        questions: [
          {
            type: "text",
            inputType: "color",
            name: "question_color",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            title: "Color question"
          },
        ]
      });
      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("question-color.png", questionRoot, t, comparer);
    });
  });

  test("Check question num + expand/collapse", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "text",
            name: "question_with_num",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            state: "collapsed",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });
      const questionRoot = Selector(".sd-question");

      await takeElementScreenshot("question-collapse.png", questionRoot, t, comparer);
      await t.hover(".sd-element__header");
      await takeElementScreenshot("question-collapse-hover-focus.png", questionRoot, t, comparer);
      await t.hover("body");
      await ClientFunction(() => { (<HTMLElement>document.querySelector(".sd-question__title")).focus(); })();
      await takeElementScreenshot("question-collapse-hover-focus.png", questionRoot, t, comparer);
      await t.click(questionRoot);
      await takeElementScreenshot("question-expand.png", questionRoot, t, comparer);
    });
  });

  test("Check invisible question when showInvisibleElements: true", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "text",
            name: "q1",
            title: "Rate the importance of this scenario for your enterprise (assuming you've encountered it in the past).",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            choices: ["High", "Medium", "Low"],
            visible: false,
          },
        ]
      });
      const questionRoot = Selector(".sd-question");
      await ClientFunction(() => { (<any>window).survey.showInvisibleElements = true; })();
      await resetFocusToBody();
      await takeElementScreenshot("question-invisible.png", questionRoot, t, comparer);
    });
  });

  test("Check question title actions", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        showQuestionNumbers: "off",
        questions: [
          {
            type: "text",
            name: "question_with_num",
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            state: "collapsed",
            title: "Personal information"
          },
        ]
      }, {
        onGetQuestionTitleActions: (_, opt) => {
          opt.titleActions.push(
            {
              title: "Reset to Default",
              action: () => { }
            }
          );
        }
      });
      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("question-title-actions.png", questionRoot, t, comparer);
    });
  });

  test("Check required question with multiline title", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        showQuestionNumbers: "off",
        questions: [
          {
            type: "text",
            name: "required_question",
            isRequired: true,
            minWidth: "708px",
            maxWidth: "708px",
            width: "708px",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });
      const questionRoot = Selector(".sd-question");
      await resetFocusToBody();
      await takeElementScreenshot("question-required.png", questionRoot, t, comparer);

    });
  });

  test("Check questions in one row", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
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
        ]
      },);
      const rowSelector = Selector(".sd-row");
      await resetFocusToBody();
      await takeElementScreenshot("multiple-row.png", rowSelector, t, comparer);
    });
  });

  test("Check questions in one row", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
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
        ]
      },);
      const rowSelector = Selector(".sd-row");
      await resetFocusToBody();
      await takeElementScreenshot("multiple-row.png", rowSelector, t, comparer);

      await ClientFunction(() => {
        window["survey"].questionTitleLocation = "bottom";
        window["survey"].render();
      })();
      await takeElementScreenshot("multiple-row-title-bottom.png", rowSelector, t, comparer);

      await ClientFunction(() => {
        window["survey"].questionTitleLocation = "left";
        window["survey"].render();
      })();
      await takeElementScreenshot("multiple-row-title-left.png", rowSelector, t, comparer);
    });
  });

  test("Check questions in one row with different default heights", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question3"
              },
              {
                "type": "checkbox",
                "name": "question4",
                "startWithNewLine": false,
                "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
                ]
              },
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    "type": "text",
                    "name": "question2"
                  }
                ],
                "title": "Panel"
              },
              {
                "type": "checkbox",
                "name": "question1",
                "startWithNewLine": false,
                "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3",
                  "Item 4",
                  "Item 5",
                  "Item 6"
                ]
              }
            ]
          }
        ],
        "widthMode": "static",
        "width": "1000px"
      },);
      const rowSelector = Selector(".sd-page");
      await resetFocusToBody();
      await takeElementScreenshot("multiple-row-heights.png", rowSelector, t, comparer);
    });
  });

  test("Check questions in one row (overflow content)", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(900, 1080);
      await initSurvey(framework, {
        questions: [
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
      },);
      const rowSelector = Selector(".sd-row");
      await resetFocusToBody();
      await takeElementScreenshot("multiple-row-overflow.png", rowSelector, t, comparer);
    });
  });

  test("Check question error", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "text",
            name: "q_error",
            title: "What is your name?",
            isRequired: true,
          }
        ]
      }, {
        onValidateQuestion: (s, options) => {
          options.error = "Very very very very very very very very very very very very very very very Very very very very very very very very very very very very very very very long error";
        }
      });
      const qRoot = Selector(".sd-question");
      await t.click(".sd-navigation__complete-btn");
      await resetFocusToBody();
      await takeElementScreenshot("question-with-error.png", qRoot, t, comparer);
      await t.resizeWindow(600, 1080);
      await takeElementScreenshot("responsiveness-question-with-error.png", qRoot, t, comparer);
      await t.resizeWindow(1920, 1080);
      await t.typeText(".sd-input", "some-text");
      await t.click(".sd-navigation__complete-btn");
      await takeElementScreenshot("question-with-long-error.png", qRoot, t, comparer);
    });
  });

  test("Check question error with title location left", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "text",
            name: "q_error",
            titleLocation: "left",
            title: "What is your name?",
            isRequired: true,
          }
        ]
      });
      const qRoot = Selector(".sd-question");
      await t.click(".sd-navigation__complete-btn");
      await resetFocusToBody();
      await takeElementScreenshot("question-with-title-left-and-error.png", qRoot, t, comparer);
    });
  });

  test("Check question errors bottom", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "text",
            name: "q_error",
            title: "What is your name?",
            isRequired: true,
          }
        ],
        questionErrorLocation: "bottom"
      });
      const qRoot = Selector(".sd-question");
      await t.click(".sd-navigation__complete-btn");
      await resetFocusToBody();
      await takeElementScreenshot("question-with-error-below.png", qRoot, t, comparer);
      await t.resizeWindow(600, 1080);
      await takeElementScreenshot("responsiveness-question-with-error-below.png", qRoot, t, comparer);
    });
  });

  test("Check question errors bottom one-row", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(800, 800);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              },
              {
                "type": "text",
                "name": "question2",
                "startWithNewLine": false,
                "isRequired": true
              },
              {
                "type": "checkbox",
                "name": "question3",
                "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
                ]
              },
              {
                "type": "text",
                "name": "question4",
                "startWithNewLine": false,
                "isRequired": true
              }
            ]
          }
        ],
        "questionErrorLocation": "bottom"
      });
      const pRoot = Selector(".sd-body");
      await t.click(".sd-navigation__complete-btn");
      await resetFocusToBody();
      await takeElementScreenshot("question-with-error-below-one-line.png", pRoot, t, comparer);
    });
  });

  test("Check title location Left", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            type: "text",
            name: "q1",
            title: "What is your name?",
            titleLocation: "left"
          }
        ]
      },);
      const qRoot = Selector(".sd-question");
      await takeElementScreenshot("question-title-location-left.png", qRoot, t, comparer);
    });
  });

  test("Check title location Left - small question - !!!Need to be improved!!!", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: false,
        "showQuestionNumbers": "off",
        questions: [
          {
            type: "text",
            name: "q1",
            title: "State",
            titleLocation: "left",
            maxWidth: "120px",
            minWidth: "120px"
          }
        ]
      },);
      const qRoot = Selector(".sd-question");
      await takeElementScreenshot("question-title-location-left-small.png", qRoot, t, comparer);
    });
  });

  test("Composite", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      const setupComposite = ClientFunction(() => {
        window["Survey"]
          .ComponentCollection
          .Instance
          .add({
            name: "shippingaddress",
            title: "Shipping Address",
            elementsJSON: [
              {
                type: "text",
                name: "businessAddress",
                title: "Business Address"
              }
            ],
            onCreated(question) {
              // Hide the title for component/root location
              question.titleLocation = "hidden";
            }
          });
      });
      await setupComposite();
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "elements": [
          {
            "type": "shippingaddress",
            "name": "question1"
          }
        ]
      });
      const qRoot = Selector(".sd-question");
      await takeElementScreenshot("question-composite-hidden-title.png", qRoot, t, comparer);

      await ClientFunction(() => {
        window["survey"].getAllQuestions()[0].titleLocation = "default";
      })();
      await takeElementScreenshot("question-composite-with-title.png", qRoot, t, comparer);
    });
  });

  test("Question with title action + long title", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      const json = {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            name: "name",
            type: "text",
            title: "Text long long long long long long long long long long long long long long long",
            placeHolder: "Jon Snow",
            isRequired: true
          }
        ]
      };
      await initSurvey(framework, json, {
        onGetQuestionTitleActions: (_, opt) => {
          opt.titleActions = [
            {
              title: "Action",
              action: () => { },
            },
          ];
        },
      });
      const qRoot = Selector(".sd-question");
      await takeElementScreenshot("question-title-actions-long-title.png", qRoot, t, comparer);
      await ClientFunction(() => {
        (window as any).survey.getAllQuestions()[0].titleToolbarValue.actions[0].visible = false;
      })();
      await takeElementScreenshot("question-hidden-title-actions-long-title.png", qRoot, t, comparer);
    });
  });
  test("Text question inputType: 'range'", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      const json = {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            name: "Range",
            type: "text",
            inputType: "range",
            isRequired: true
          }
        ]
      };
      await initSurvey(framework, json);
      const qRoot = Selector(".sd-question");
      await takeElementScreenshot("question-text-range.png", qRoot, t, comparer);
    });
  });

  test("Remaining character counter", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            name: "name",
            type: "text",
            maxLength: 10,
            defaultValue: "Test"
          }, {
            name: "comment",
            type: "comment",
            maxLength: 10,
            defaultValue: "Test"
          },
          {
            "type": "multipletext",
            "name": "question1",
            "validators": [
              {
                "type": "expression"
              }
            ],
            "items": [
              {
                "name": "text1",
                "maxLength": 10
              },
              {
                "name": "text2",
                "maxLength": 15
              }
            ]
          }]
      });

      await takeElementScreenshot("question-text-remaining-character-counter.png", Selector(".sd-text__content"), t, comparer);

      await t.pressKey("tab");

      await takeElementScreenshot("question-comment-remaining-character-counter.png", Selector(".sd-comment__content"), t, comparer);

      await t.pressKey("tab");
      await takeElementScreenshot("question-multipletext-remaining-character-counter.png", Selector(".sd-multipletext__content"), t, comparer);
    });
  });

  test("Remaining character counter - mobile view", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(350, 900);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            name: "name",
            type: "text",
            maxLength: 25,
            defaultValue: "Tewwwwwwwwwwwwwwwwwwwwst"
          }, {
            name: "text",
            type: "text",
            maxLength: 100,
            defaultValue: "Tewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwst"
          }, {
            "type": "multipletext",
            "name": "question1",
            "defaultValue": {
              "text1": "Tewwwwwwwwwwwwwwwwwwwwst1",
              "text2": "Tewwwwwwwwwwwwwwwwwwwwst2"
            },
            "items": [
              {
                "name": "text1",
                "maxLength": 25
              },
              {
                "name": "text2",
                "maxLength": 25
              }
            ]
          }]
      });

      await takeElementScreenshot("question-text-remaining-character-counter-mobile-view-with-focus.png", Selector(".sd-text__content"), t, comparer);
      await takeElementScreenshot("question-multipletext-remaining-character-counter-mobile-view-without-focus.png", Selector(".sd-multipletext__content"), t, comparer);
      await takeElementScreenshot("question-text-remaining-character-counter-maxLength-100-without-focus.png", Selector(".sd-text__content").nth(1), t, comparer);

      await t.pressKey("tab");
      await takeElementScreenshot("question-text-remaining-character-counter-maxLength-100-with-focus.png", Selector(".sd-text__content").nth(1), t, comparer);

      await t.pressKey("tab");
      await takeElementScreenshot("question-text-remaining-character-counter-mobile-view-without-focus.png", Selector(".sd-text__content"), t, comparer);
      await takeElementScreenshot("question-multipletext-remaining-character-counter-mobile-view-with-focus.png", Selector(".sd-multipletext__content"), t, comparer);
    });
  });

  test("Remaining character counter matrixdynamic", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            "type": "matrixdynamic",
            "name": "relatives",
            "title": "Please enter all blood relatives you know",
            "columns": [
              {
                "name": "relativeType",
                "title": "Relative",
                "cellType": "dropdown",
                "isRequired": true,
                "choices": [
                  "father",
                  "mother",
                  "brother",
                  "sister",
                  "son",
                  "daughter"
                ]
              },
              {
                "name": "firstName",
                "title": "First name",
                "cellType": "text",
                "isRequired": true,
                "maxLength": 25
              },
              {
                "name": "lastName",
                "title": "Last name",
                "cellType": "text",
                "isRequired": true,
                "maxLength": 25
              }
            ],
            "detailElements": [
              {
                "type": "radiogroup",
                "name": "isalive",
                "startWithNewLine": false,
                "title": "Alive?",
                "isRequired": true,
                "choices": [
                  "Yes",
                  "No"
                ],
                "colCount": 0
              },
              {
                "type": "dropdown",
                "name": "liveage",
                "visibleIf": "{row.isalive} = 'Yes'",
                "startWithNewLine": false,
                "title": "Age",
                "isRequired": true,
                "choicesMin": 1,
                "choicesMax": 115
              },
              {
                "type": "dropdown",
                "name": "deceasedage",
                "visibleIf": "{row.isalive} = 'No'",
                "startWithNewLine": false,
                "title": "Deceased Age",
                "isRequired": true,
                "choices": [
                  {
                    "value": -1,
                    "text": "Unknown"
                  }
                ],
                "choicesMin": 1,
                "choicesMax": 115
              },
              {
                "type": "radiogroup",
                "name": "causeofdeathknown",
                "visibleIf": "{row.isalive} = 'No'",
                "startWithNewLine": false,
                "title": "Cause of Death Known?",
                "isRequired": true,
                "choices": [
                  "Yes",
                  "No"
                ],
                "colCount": 0
              },
              {
                "type": "text",
                "name": "causeofdeath",
                "visibleIf": "{row.isalive} = 'No' and {row.causeofdeathknown} = 'Yes'",
                "startWithNewLine": false,
                "title": "Cause of Death",
                "isRequired": true
              }
            ],
            "detailPanelMode": "underRow",
            "rowCount": 1,
            "addRowText": "Add a blood relative",
            "removeRowText": "Remove the relative"
          }]
      });

      await t.pressKey("tab tab");
      await takeElementScreenshot("question-matrixdynamic-remaining-character-counter.png", Selector(".sd-matrixdynamic__content"), t, comparer);
    });
  });

  test("Check question with indent", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            name: "name",
            type: "text",
            indent: 1,
          }]
      });
      await t.pressKey("tab");
      await takeElementScreenshot("question-with-indent.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check question with big number", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        questionStartIndex: "1.1.1",
        questions: [
          {
            name: "name",
            type: "text",
          }]
      });
      await t.pressKey("tab");
      await takeElementScreenshot("question-with-big-number.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check question - baseunit", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => {
        document.body.focus();
        document.body.style.setProperty("--base-unit", "4px");
      });

      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            name: "q1",
            type: "text",
            title: "Question",
            description: "Description"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await focusBody();
      await takeElementScreenshot("question-baseunit.png", questionRoot, t, comparer);
    });
  });

  test("Check question - multiline description", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => {
        document.body.focus();
        document.body.style.setProperty("--base-unit", "4px");
      });

      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            name: "q1",
            type: "text",
            title: "Question",
            description: "First Line\nSecond Line"
          }
        ]
      });

      const questionRoot = Selector(".sd-question");
      await focusBody();
      await takeElementScreenshot("question-multiline-description.png", questionRoot, t, comparer);
    });
  });

  test("Question descriptionLocation property", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "focusFirstQuestionAutomatic": false,
        showQuestionNumbers: "off",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                name: "q1",
                type: "text",
                title: "description underTitle",
                description: "question-description",
              },
              {
                name: "q2",
                type: "text",
                title: "description underTitle",
                description: "question-description",
                descriptionLocation: "underTitle",
              },
              {
                name: "q3",
                type: "text",
                title: "description empty",
                descriptionLocation: "underTitle",
              },
              {
                name: "q4",
                type: "text",
                title: "description underInput",
                description: "question-description",
                descriptionLocation: "underInput",
              },
              {
                name: "q5",
                type: "text",
                title: "description empty",
                descriptionLocation: "underInput",
              }
            ]
          }
        ]
      });
      const questionRows = Selector(".sd-row");
      await takeElementScreenshot("question-descriptionLocation-underTitle.png", questionRows.nth(0), t, comparer);
      await takeElementScreenshot("question-descriptionLocation-underTitle.png", questionRows.nth(1), t, comparer);
      await takeElementScreenshot("question-description-empty.png", questionRows.nth(2), t, comparer);
      await takeElementScreenshot("question-description-empty.png", questionRows.nth(4), t, comparer);
      await takeElementScreenshot("question-descriptionLocation-underInput.png", questionRows.nth(3), t, comparer);
    });
  });

  test("Question empty title height", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              },
              {
                "type": "text",
                "name": "question2",
                "startWithNewLine": false,
                "title": " "
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "800"
      });
      await ClientFunction(() => {
        document.documentElement.style.setProperty("--sjs-font-size", "8px");
      })();
      const questionRows = Selector(".sd-row");
      await takeElementScreenshot("question-empty-title-height.png", questionRows.nth(0), t, comparer);
    });
  });

  test("Question content scroll", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "radiogroup",
                "name": "question2",
                "choices": [
                  {
                    "value": "Item 1",
                    "text": "11111111111111111111111"
                  },
                  {
                    "value": "Item 2",
                    "text": "2222222222222222222222222222"
                  },
                  {
                    "value": "Item 3",
                    "text": "333333333333333"
                  },
                  {
                    "value": "Item 4",
                    "text": "44444444444444444444444444444"
                  },
                  {
                    "value": "Item 5",
                    "text": "555555555555555555555555"
                  },
                  {
                    "value": "Item 6",
                    "text": "6666666666666"
                  },
                  {
                    "value": "Item 7",
                    "text": "7777777777777777777777777"
                  },
                  {
                    "value": "Item 8",
                    "text": "88888888888888888888888888888888888888"
                  }
                ],
                "colCount": 3
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "650"
      });
      const question = Selector(".sd-question");
      await takeElementScreenshot("question-multicolumn-overflow.png", question, t, comparer);
    });
  });
  test("Question title linebreak", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question2",
                "title": "Line\nbreak",
              }
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "widthMode": "static",
        "width": "650"
      });
      const question = Selector(".sd-question");
      await takeElementScreenshot("question-title-linebreak.png", question, t, comparer);
    });
  });

});