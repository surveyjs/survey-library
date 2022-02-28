import { Selector, ClientFunction } from "testcafe";
import { url, checkElementScreenshot, frameworks, initSurvey, url_test } from "../../helper";

const title = "Responsiveness Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await applyTheme(theme);
  });
  test("Check simple question in small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, {
      questions: [
        {
          type: "text",
          name: "question_with_num",
          title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
        },
      ]
    });
    await checkElementScreenshot("responsiveness-simple-question.png", Selector(".sd-question"), t);
  });
  test("Check questions in one row in small screen", async (t) => {
    await t.resizeWindow(600, 1080);
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
    await ClientFunction(()=>{ document.body.focus(); })();
    await checkElementScreenshot("responsiveness-multiple-row.png", rowSelector, t);
  });
  const panelDynamicJSON = {
    showQuestionNumbers: "off",
    questions: [
      {
        type: "paneldynamic",
        name: "applications",
        title: "What application do you use?",
        renderMode: "progressTop",
        templateTitle: "{panel.application}",
        templateElements: [
          {
            name: "application",
            type: "dropdown",
            title: "Application",
            defaultValue: "Adobe Photoshop",
            choices: [
              "Adobe Photoshop",
            ],
          },
          {
            name: "often",
            type: "radiogroup",
            title: "How often do you use this applications?",
            choices: ["Rare", "Sometimes", "Always"]
          }
        ],
        panelCount: 2,
        noEntriesText: "You can add as many applications as you want.\nJust click the button below to start.",
        panelAddText: "Add application",
        panelRemoveText: "Remove application"
      },
    ]
  };
  test("Check paneldynamic progressTop on small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, panelDynamicJSON);
    await ClientFunction(() => {
      (window as any).survey.getQuestionByName("applications").currentIndex = 2;
    })();
    await checkElementScreenshot("responsiveness-paneldynamic-progress-top.png", Selector(".sd-question--paneldynamic"), t);
  });
  test("Check paneldynamic list on small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, panelDynamicJSON);
    await ClientFunction(() => {
      (window as any).survey.getQuestionByName("applications").renderMode = "list";
    })();
    await checkElementScreenshot("responsiveness-paneldynamic-list.png", Selector(".sd-question--paneldynamic"), t);
  });
  test("Check matrix on small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      elements: [
        {
          "type": "matrix",
          "name": "Quality",
          "title": "Please indicate if you agree or disagree with the following statements",
          "columns": ["Strongly Disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly Agree",
          ],
          "rows": [
            "Product is affordable",
            "Product does what it claims",
            "Product is better than other products on the market"
          ]
        }
      ]
    });
    await ClientFunction(() => {
      document.body.focus();
    })();
    await checkElementScreenshot("responsiveness-matrix.png", Selector(".sd-question"), t);
  });
  test("Check matrixdynamic on small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      elements: [
        {
          type: "matrixdynamic",
          name: "frameworks",
          title: "Please tells us your opinion about JavaScript MVVM frameworks.",
          columns: [
            {
              "name": "Column 1",
              "title": "Framework"
            },
            {
              "name": "Column 2",
              "title": "How long do you use it?"
            },
            {
              "name": "Column 3",
              "title": "What is main strength?"
            }
          ],
          addRowText: "Add a New Record",
          rowCount: 2,
        },
      ]
    });
    await ClientFunction(() => {
      document.body.focus();
    })();
    await checkElementScreenshot("responsiveness-matrixdynamic.png", Selector(".sd-question"), t);
  });
  test("Check matrixdropdown on small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      elements: [
        {
          type: "matrixdropdown",
          name: "frameworks",
          title: "Please tells us your opinion about JavaScript MVVM frameworks.",
          "rows": ["AngularJS", "ReactJS"],
          "columns": [
            {
              "name": "using",
              "title": "Do you use it?",
              "choices": [
                "Yes", "No"
              ],
              "cellType": "radiogroup"
            }, {
              "name": "strength",
              "title": "What is main strength?",
              "choices": [
                "Easy", "Compact", "Fast", "Powerfull"
              ],
              "cellType": "checkbox"
            },
          ],
        },
      ]
    });
    await ClientFunction(() => {
      document.body.focus();
    })();
    await checkElementScreenshot("responsiveness-matrixdropdown.png", Selector(".sd-question"), t);
  });
  test("Check multipletext on small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        { type: "multipletext",
          name: "q1",
          title: "Personal Information",
          colCount: 2,
          items: [
            {
              name: "item1",
              title: "Full Name"
            },
            {
              name: "item2",
              title: "Email Address"
            },
            {
              name: "item3",
              title: "ID"
            },
          ]
        },
      ]
    });
    const inputSelector = Selector(".sd-input");
    await t.typeText(inputSelector.nth(0), "Jon Snow")
      .typeText(inputSelector.nth(2), "jon@snow.com")
      .typeText(inputSelector.nth(4), "1234-56789");
    await ClientFunction(()=>{ document.body.focus(); })();
    await checkElementScreenshot("responsiveness-multipletext.png", Selector(".sd-question"), t);
  });
  test("Check multicolumn checkbox question on small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "checkbox",
          title: "Which cities have you visited?",
          name: "checkbox_question",
          choices: ["Moscow", "Paris", "Madrid", "Munich", "London", "None"],
          colCount: 2
        },
      ]
    });
    await ClientFunction(() => { document.body.focus(); })();
    await checkElementScreenshot("responsiveness-checkbox-col-count-2.png", Selector(".sd-question"), t);
  });

  test("Check ranking question on small screen", async (t) => {
    await t.resizeWindow(600, 1080);
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "ranking",
          title: "Tell me about a time you strongly disagreed with your manager. What did you do to convince him or her that you were right? What happened?",
          name: "ranking_question",
          choices: ["item1", "item2", "item3", "item4"]
        }
      ]
    });
    await checkElementScreenshot("responsiveness-ranking.png", Selector(".sd-question"), t);

    await t.hover(".sv-ranking-item");
    await checkElementScreenshot("responsiveness-ranking-hover-item.png", Selector(".sd-question"), t);
  });
});