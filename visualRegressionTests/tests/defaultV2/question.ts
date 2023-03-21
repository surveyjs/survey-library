import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, explicitErrorHandler, resetFocusToBody, wrapVisualTest, takeElementScreenshot } from "../../helper";

const title = "Question Screenshot";

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

  test("Check question num", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "text",
            name: "question_with_num",
            width: "708px",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });
      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("question-with-num.png", questionRoot, t, comparer);
    });
  });

  test("Check question num + expand/collapse", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "text",
            name: "question_with_num",
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
        questions: [
          {
            type: "text",
            name: "q1",
            title: "Rate the importance of this scenario for your enterprise (assuming you've encountered it in the past).",
            width: "708px",
            choices: ["High", "Medium", "Low"],
            visible: false,
          },
        ]
      });
      const questionRoot = Selector(".sd-question");
      await ClientFunction(()=>{ (<any>window).survey.showInvisibleElements = true; })();
      await resetFocusToBody();
      await takeElementScreenshot("question-invisible.png", questionRoot, t, comparer);
    });
  });

  test("Check question title actions", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "text",
            name: "question_with_num",
            width: "708px",
            state: "collapsed",
            title: "Personal information"
          },
        ]
      }, { onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions.push(
          {
            title: "Reset to Default",
            action: () => {}
          }
        );
      } });
      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("question-title-actions.png", questionRoot, t, comparer);
    });
  });

  test("Check required question with multiline title", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "text",
            name: "required_question",
            isRequired: true,
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

  test("Check questions in one row (overflow content)", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1000, 1080);
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

  test("Check question error", async(t)=> {
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

  test("Check question error with title location left", async(t)=> {
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

  test("Check question errors bottom", async(t) => {
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

  test("Check title location Left", async(t)=> {
    await wrapVisualTest(t, async (t, comparer) => {

      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
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
        questions: [
          {
            name: "name",
            type: "text",
            title: "Text long  long long long long long long long long long long long long long long",
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
        questions: [
          {
            name: "name",
            type: "text",
            maxLength: 10,
            defaultValue: "Test"
          },
          {
            name: "comment",
            type: "comment",
            maxLength: 10,
            defaultValue: "Test"
          }]
      });

      await takeElementScreenshot("question-text-remaining-character-counter.png", Selector(".sd-text__content"), t, comparer);

      await t.pressKey("tab");
      await takeElementScreenshot("question-comment-remaining-character-counter.png", Selector(".sd-comment__content"), t, comparer);
    });
  });
  test("Check question with indent", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, {
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
});