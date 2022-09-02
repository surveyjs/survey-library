import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, checkElementScreenshot, explicitErrorHandler, resetFocusToBody } from "../../helper";

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
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-question");
    await takeScreenshot("question-with-num.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
  test("Check question num + expand/collapse", async (t) => {
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

    await checkElementScreenshot("question-collapse.png", questionRoot, t);
    await t.hover(".sd-element__header");
    await checkElementScreenshot("question-collapse-hover-focus.png", questionRoot, t);
    await t.hover("body");
    await ClientFunction(() => { (<HTMLElement>document.querySelector(".sd-question__title")).focus(); })();
    await checkElementScreenshot("question-collapse-hover-focus.png", questionRoot, t);
    await t.click(questionRoot);
    await checkElementScreenshot("question-expand.png", questionRoot, t);
  });
  test("Check invisible question when showInvisibleElements: true", async (t) => {
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
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-question");
    await ClientFunction(()=>{ (<any>window).survey.showInvisibleElements = true; })();
    await resetFocusToBody();
    await takeScreenshot("question-invisible.png", questionRoot, screenshotComparerOptions);
  });
  test("Check question title actions", async (t) => {
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
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-question");
    await takeScreenshot("question-title-actions.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
  test("Check required question with multiline title", async (t) => {
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
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-question");
    await resetFocusToBody();
    await takeScreenshot("question-required.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());

  });
  test("Check questions in one row", async (t) => {
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
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const rowSelector = Selector(".sd-row");
    await resetFocusToBody();
    await takeScreenshot("multiple-row.png", rowSelector, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
  test("Check questions in one row (overflow content)", async (t) => {
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
    await checkElementScreenshot("multiple-row-overflow.png", rowSelector, t);
  });
  test("Check question error", async(t)=> {
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
    await checkElementScreenshot("question-with-error.png", qRoot, t);
    await t.resizeWindow(600, 1080);
    await checkElementScreenshot("responsiveness-question-with-error.png", qRoot, t);
    await t.resizeWindow(1920, 1080);
    await t.typeText(".sd-input", "some-text");
    await t.click(".sd-navigation__complete-btn");
    await checkElementScreenshot("question-with-long-error.png", qRoot, t);
  });
  test("Check question errors bottom", async(t) => {
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
    await checkElementScreenshot("question-with-error-below.png", qRoot, t);
    await t.resizeWindow(600, 1080);
    await checkElementScreenshot("responsiveness-question-with-error-below.png", qRoot, t);
  });
  test("Check title location Left", async(t)=> {
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
    await checkElementScreenshot("question-title-location-left.png", qRoot, t);
  });

  test("Composite", async (t) => {
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
    await checkElementScreenshot("question-composite-hidden-title.png", qRoot, t);

    await ClientFunction(() => {
      window["survey"].getAllQuestions()[0].titleLocation = "default";
    })();
    await checkElementScreenshot("question-composite-with-title.png", qRoot, t);
  });
  test("Question with title action + long title", async (t) => {
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
    await checkElementScreenshot("question-title-actions-long-title.png", qRoot, t);
    await ClientFunction(() => {
      (window as any).survey.getAllQuestions()[0].titleToolbarValue.actions[0].visible = false;
    })();
    await checkElementScreenshot("question-hidden-title-actions-long-title.png", qRoot, t);
  });
});
