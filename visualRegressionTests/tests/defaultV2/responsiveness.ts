import { Selector, ClientFunction } from "testcafe";
import { imageSource } from "../../constants";
import { url, takeElementScreenshot, frameworks, initSurvey, url_test, resetFocusToBody, wrapVisualTest, resetHoverToBody } from "../../helper";

const title = "Responsiveness Screenshot";

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
  test("Check simple question in small screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            type: "text",
            name: "question_with_num",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });
      await takeElementScreenshot("responsiveness-simple-question.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check simple question on smartphone screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        "elements": [{
          "name": "username",
          "type": "text",
          "title": "Username",
          "maxLength": 25
        }, {
          "name": "email",
          "type": "text",
          "title": "E-mail address",
          "inputType": "email",
          "placeholder": "foobar@example.com",
          "isRequired": true,
          "autocomplete": "email"
        }, {
          "name": "password",
          "type": "text",
          "title": "Password",
          "description": "Enter 8 characters minimum.",
          "inputType": "password",
          "isRequired": true,
          "autocomplete": "password",
          "validators": [{
            "type": "text",
            "minLength": 8,
            "text": "Your password must be at least 8 characters long."
          }]
        }, {
          "name": "url",
          "type": "text",
          "title": "URL",
          "inputType": "url",
          "placeholder": "https://www.example.com",
          "validators": [{
            "type": "regex",
            "regex": "https://.*",
            "text": "Your answer must match the URL pattern."
          }]
        }],
        "showQuestionNumbers": false
      });
      await t.resizeWindow(391, 712);
      await takeElementScreenshot("responsiveness-simple-question-mobile.png", Selector("body"), t, comparer);
    });
  });

  test("Check simple question in small screen with rtl", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1080);
      await ClientFunction(() => {
        document.body.setAttribute("dir", "rtl");
      })();
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            type: "text",
            name: "question_with_num",
            title: "What can we improve or add to our Xamarin.Forms UI product line to better address your business needs in the future (control features, learning materials, etc.)?"
          },
        ]
      });
      await takeElementScreenshot("responsiveness-simple-question-rtl.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check questions in one row in small screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await resetFocusToBody();
      await takeElementScreenshot("responsiveness-multiple-row.png", rowSelector, t, comparer);
    });
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
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1080);
      await initSurvey(framework, panelDynamicJSON);
      await ClientFunction(() => {
        const panel = (window as any).survey.getQuestionByName("applications");
        panel.isMobile = true;
        panel.currentIndex = 2;
      })();
      await takeElementScreenshot("responsiveness-paneldynamic-progress-top.png", Selector(".sd-question--paneldynamic"), t, comparer);
    });
  });
  test("Check paneldynamic list on small screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1080);
      await initSurvey(framework, panelDynamicJSON);
      await ClientFunction(() => {
        document.body.focus();
        (window as any).survey.getQuestionByName("applications").renderMode = "list";
      })();
      await takeElementScreenshot("responsiveness-paneldynamic-list.png", Selector(".sd-question--paneldynamic"), t, comparer);
    });
  });
  test("Check matrix on small screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await takeElementScreenshot("responsiveness-matrix.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check matrix on small screen - alt rows", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        elements: [
          {
            "type": "matrix",
            "name": "Quality",
            "alternateRows": true,
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
      await takeElementScreenshot("responsiveness-matrix-alt-rows.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check matrixdynamic on small screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await takeElementScreenshot("responsiveness-matrixdynamic.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check matrixdynamic on small screen with errors", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
                "isRequired": true,
                "title": "Framework"
              },
              {
                "name": "Column 2",
                "title": "How long do you use it?"
              },
              {
                "name": "Column 3",
                "isRequired": true,
                "title": "What is main strength?"
              }
            ],
            addRowText: "Add a New Record",
            rowCount: 2,
          },
        ]
      });
      await t.click(".sd-navigation__complete-btn");
      await resetFocusToBody();
      await resetHoverToBody(t);

      await takeElementScreenshot("responsiveness-matrixdynamic-with-errros.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check matrixdynamic on small screen with errors bottom", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questionErrorLocation: "bottom",
        elements: [
          {
            type: "matrixdynamic",
            name: "frameworks",
            title: "Please tells us your opinion about JavaScript MVVM frameworks.",
            columns: [
              {
                "name": "Column 1",
                "isRequired": true,
                "title": "Framework"
              },
              {
                "name": "Column 2",
                "title": "How long do you use it?"
              },
              {
                "name": "Column 3",
                "isRequired": true,
                "title": "What is main strength?"
              }
            ],
            addRowText: "Add a New Record",
            rowCount: 2,
          },
        ]
      });
      await t.click(".sd-navigation__complete-btn");
      await resetFocusToBody();
      await resetHoverToBody(t);

      await takeElementScreenshot("responsiveness-matrixdynamic-with-errros-bottom.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check matrixdropdown on small screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
                "colCount": 1,
                "cellType": "radiogroup"
              }, {
                "name": "strength",
                "title": "What is main strength?",
                "choices": [
                  "Easy", "Compact", "Fast", "Powerfull"
                ],
                "colCount": 1,
                "cellType": "checkbox"
              },
            ],
          },
        ]
      });
      await ClientFunction(() => {
        document.body.focus();
      })();
      await takeElementScreenshot("responsiveness-matrixdropdown.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check multipletext on small screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "multipletext",
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
      await takeElementScreenshot("responsiveness-multipletext-empty.png", Selector(".sd-question"), t, comparer);
      await t.click(inputSelector.nth(0));
      await takeElementScreenshot("responsiveness-multipletext-focus.png", Selector(".sd-question"), t, comparer);
      await t.typeText(inputSelector.nth(0), "Jon Snow")
        .typeText(inputSelector.nth(2), "jon@snow.com")
        .typeText(inputSelector.nth(4), "1234-56789");
      await resetFocusToBody();
      await takeElementScreenshot("responsiveness-multipletext.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check multipletext with inputType 'date' on small screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "multipletext",
            name: "q1",
            title: "Personal Information",
            colCount: 2,
            items: [
              {
                name: "item1",
                inputType: "date",
                title: "Depature Date "
              },
              {
                name: "item2",
                inputType: "date",
                title: "Arrival Date "
              },
            ]
          },
        ]
      });
      const inputSelector = Selector(".sd-input");
      await takeElementScreenshot("responsiveness-multipletext-date-empty.png", Selector(".sd-question"), t, comparer);
      await t.click(inputSelector.nth(0));
      await takeElementScreenshot("responsiveness-multipletext-date-focus.png", Selector(".sd-question"), t, comparer);
      await t.typeText(inputSelector.nth(1), "2004-01-12")
        .click(inputSelector.nth(2))
        .typeText(inputSelector.nth(3), "2004-02-12");
      await resetFocusToBody();
      await takeElementScreenshot("responsiveness-multipletext-date.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check multicolumn checkbox question on small screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await resetFocusToBody();
      await takeElementScreenshot("responsiveness-checkbox-col-count-2.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check image question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        questions: [
          {
            type: "image",
            name: "image_question",
            imageLink: imageSource
          },
        ]
      });
      await takeElementScreenshot("responsiveness-image-max-width.png", Selector(".sd-question"), t, comparer);

      await t.resizeWindow(500, 1080);
      await takeElementScreenshot("responsiveness-image.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check ranking question on small screen", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
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
      await takeElementScreenshot("responsiveness-ranking.png", Selector(".sd-question"), t, comparer);

      await t.hover(".sv-ranking-item");
      await takeElementScreenshot("responsiveness-ranking-hover-item.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("check survey layout in mobile mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1080);
      await initSurvey(framework,
        {
          focusFirstQuestionAutomatic: true,
          description: "Survey Description",
          title: "Title",
          widthMode: "static",
          pages: [{
            name: "page1",
            title: "Page1",
            description: "description",
            elements: [{
              type: "text",
              name: "q1",
              title: "Question 1",
            },
            {
              type: "text",
              name: "q2",
              title: "Question 2",
            },

            ]

          },
          {
            name: "page2",
            title: "Page2",
            description: "description",
            elements: [{
              type: "text",
              name: "q3",
              title: "Question 3",
            },
            {
              type: "text",
              name: "q2",
              title: "Question 4",
            },
            ]
          }
          ]
        }
      );
      //in mobile mode static = responsive
      await takeElementScreenshot("responsiveness-survey-layout-page1.png", Selector(".sd-root-modern"), t, comparer);
      await ClientFunction(() => { (window as any).survey.widthMode = "responsive"; })();
      await takeElementScreenshot("responsiveness-survey-layout-page1.png", Selector(".sd-root-modern"), t, comparer);
      await ClientFunction(() => { (window as any).survey.nextPage(); })();
      await takeElementScreenshot("responsiveness-survey-layout-page2.png", Selector(".sd-root-modern"), t, comparer);
      await ClientFunction(() => { (window as any).survey.widthMode = "static"; })();
      await takeElementScreenshot("responsiveness-survey-layout-page2.png", Selector(".sd-root-modern"), t, comparer);
    });
  });
  test("check matrix-dynamic-detail in mobile mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 2000);
      await initSurvey(framework,
        {
          description: "Survey Description",
          title: "Title",
          widthMode: "static",
          showQuestionNumbers: "off",
          elements: [{
            "type": "matrixdynamic",
            "name": "question1",
            "title": "Users",
            "columns": [
              {
                "name": "Column 1",
                "title": "Name"
              },
              {
                "name": "Column 2",
                "title": "Email"
              },
              {
                "name": "Column 3",
                "title": "Role"
              }
            ],
            "detailElements": [
              {
                "type": "text",
                "name": "question3",
                "title": "Phone"
              },
              {
                "type": "text",
                "name": "question4",
                "title": "Department"
              }
            ],
            "detailPanelMode": "underRow",
            "cellType": "text",
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }]
        }
      );
      await takeElementScreenshot("responsiveness-matrix-dynamic-detail.png", Selector(".sd-question"), t, comparer);
      await t.click(Selector("button").withText("Show Details"));
      await takeElementScreenshot("responsiveness-matrix-dynamic-detail-open.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("check matrix-dropdown-detail in mobile mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 2080);
      await initSurvey(framework,
        {
          description: "Survey Description",
          title: "Title",
          widthMode: "static",
          showQuestionNumbers: "off",
          elements: [{
            "type": "matrixdropdown",
            "name": "question1",
            "title": "Users",
            "columns": [
              {
                "name": "Column 1",
                "title": "Name"
              },
              {
                "name": "Column 2",
                "title": "Email"
              },
              {
                "name": "Column 3",
                "title": "Role"
              }
            ],
            "detailElements": [
              {
                "type": "text",
                "name": "question3",
                "title": "Phone"
              },
              {
                "type": "text",
                "name": "question4",
                "title": "Department"
              }
            ],
            "detailPanelMode": "underRow",
            "cellType": "text",
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }]
        }
      );
      await takeElementScreenshot("responsiveness-matrix-dropdown-detail.png", Selector(".sd-question"), t, comparer);
      await t.click(Selector("button").withText("Show Details"));
      await takeElementScreenshot("responsiveness-matrix-dropdown-detail-open.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("check matrix-dropdown-text in mobile mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1080);
      await initSurvey(framework,
        {
          description: "Survey Description",
          title: "Title",
          widthMode: "static",
          showQuestionNumbers: "off",
          elements: [{
            "type": "matrixdropdown",
            "name": "question1",
            "title": "Users",
            "columns": [
              {
                "name": "Column 1",
                "title": "Name"
              },
              {
                "name": "Column 2",
                "title": "Email"
              },
              {
                "name": "Column 3",
                "title": "Role"
              }
            ],
            "cellType": "text",
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }]
        }
      );
      await takeElementScreenshot("responsiveness-matrixdropdown-text-fields.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("check matrixdropdown with totals in mobile mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1920);
      await initSurvey(framework,
        {
          "pages": [
            {
              "name": "page1",
              "elements": [
                {
                  "type": "matrixdropdown",
                  "name": "question1",
                  "columns": [
                    {
                      "name": "Column 1",
                      "totalType": "sum"
                    },
                    {
                      "name": "Column 2",
                      "totalType": "count"
                    },
                    {
                      "name": "Column 3",
                      "totalType": "max"
                    }
                  ],
                  "choices": [
                    1,
                    2,
                    3,
                    4,
                    5
                  ],
                  "rows": [
                    "Row 1",
                    "Row 2"
                  ],
                  "totalText": "Total:"
                }
              ]
            }
          ]
        }
      );
      await takeElementScreenshot("responsiveness-matrixdropdown-totals.png", Selector(".sd-question"), t, comparer);
    });
  });
});