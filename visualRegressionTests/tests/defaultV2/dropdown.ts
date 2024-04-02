import { Selector, ClientFunction } from "testcafe";
import { getListItemByText, registerCustomItemComponent } from "../../../testCafe/helper";
import { url, frameworks, initSurvey, url_test, wrapVisualTest, takeElementScreenshot, resetFocusToBody } from "../../helper";

const title = "Dropdown Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

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
  test("Check dropdown select question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            title: "Where are you living?",
            name: "dropdown_question",
            renderAs: "select",
            optionsCaption: "Select country here...",
            choices: ["Greece"]
          },
        ]
      });

      const questionRoot = Selector(".sd-question");
      await resetFocusToBody();
      await takeElementScreenshot("dropdown-question.png", questionRoot, t, comparer);

      await ClientFunction(() => { (<any>window).survey.getQuestionByName("dropdown_question").value = "Greece"; })();
      await takeElementScreenshot("dropdown-question-answered.png", questionRoot, t, comparer);
    });
  });

  test("Check dropdown question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            title: "Where are you living?",
            name: "dropdown_question",
            optionsCaption: "Select country here...",
            allowClear: false,
            choices: ["Greece"],
          },
        ]
      });

      const questionRoot = Selector(".sd-question");
      await resetFocusToBody();
      //
      await takeElementScreenshot("dropdown-select-question.png", questionRoot, t, comparer);

      await ClientFunction(() => { (<any>window).survey.getQuestionByName("dropdown_question").value = "Greece"; })();
      await takeElementScreenshot("dropdown-select-question-answered.png", questionRoot, t, comparer);
    });
  });

  test("Check dropdown question input", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            title: "Where are you living?",
            name: "dropdown_question",
            optionsCaption: "Select country here...",
            allowClear: false,
            choices: ["Greece"],
          },
        ]
      });

      const questionRoot = Selector(".sd-question");
      await t
        .click(".sd-dropdown__filter-string-input")
        .pressKey("G r e e c e")
        .wait(500);
      await takeElementScreenshot("dropdown-input-position.png", questionRoot, t, comparer);
    });
  });

  test("item focused state for keyboard navigation", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            title: "Where are you living?",
            name: "dropdown_question",
            optionsCaption: "Select country here...",
            allowClear: false,
            choices: [
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7",
              "item8",
              "item9",
              "item10"
            ]
          },
        ]
      });

      const popupContainer = Selector(".sv-popup__container").filterVisible();
      await t
        .pressKey("down")
        .pressKey("down")
        .wait(500);
      await takeElementScreenshot("dropdown-item-focused-state.png", popupContainer, t, comparer);
    });
  });

  test("Check dropdown select question popup", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            name: "question1",
            hasOther: "true",
            choices: [
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7",
              "item8",
              "item9",
              "item10",
              "item11",
              "item12",
              "item13",
              "item14",
              "item15",
              "item16",
              "item17",
              "item18",
              "item19",
              "item20",
              "item21",
              "item22",
              "item23",
              "item24",
              "item25",
              "item26",
              "item27"
            ]
          }
        ]
      });

      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
      const popupContainer = Selector(".sv-popup__container").filterVisible();
      await t.click(questionDropdownSelect);
      await takeElementScreenshot("dropdown-select-question-popup.png", popupContainer, t, comparer);
    });
  });
  test("Check dropdown select question with clear button", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: true,
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            name: "question12",
            hasOther: "true",
            defaultValue: "item1",
            choices: [
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7"
            ]
          }
        ]
      });

      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
      await takeElementScreenshot("dropdown-select-question-with-clear-button.png", questionDropdownSelect, t, comparer);
    });

  });
  test("Check dropdown select question with long text", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            name: "question1",
            defaultValue: "item1_longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
            choices: [
              "item1_longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7"
            ]
          }, {
            type: "dropdown",
            allowClear: false,
            name: "question2",
            defaultValue: "item1_longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
            choices: [
              "item1_longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7"
            ]
          }
        ]
      });
      await resetFocusToBody();
      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
      const popupContainer = Selector(".sv-popup__container").filterVisible();
      await takeElementScreenshot("dropdown-select-question-and-long-text.png", questionDropdownSelect.nth(1), t, comparer);

      await takeElementScreenshot("dropdown-select-question-with-clear-button-and-long-text.png", questionDropdownSelect.nth(0), t, comparer);

      await t.click(questionDropdownSelect);
      await takeElementScreenshot("dropdown-list-item-with-long-text.png", popupContainer, t, comparer);
    });
  });

  test("Check dropdown disabled items", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            name: "DropdownRenderAsSelect",
            hasOther: "true",
            searchEnabled: false,
            choices: [
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7",
              "item8",
              "item9",
              "item10",
              "item11",
              "item12",
              "item13",
              "item14",
              "item15",
              "item16",
              "item17",
              "item18",
              "item19",
              "item20",
              "item21",
              "item22",
              "item23",
              "item24",
              "item25",
              "item26",
              "item27"
            ]
          }
        ]
      });

      await ClientFunction(() => {
        const updateChoiceEnabled = (_, opt) => {
          opt.choices.forEach((ch, index) => { ch.setIsEnabled(index % 2 === 0); });
        };

        const selectQuestion = window["survey"].getQuestionByName("DropdownRenderAsSelect");
        selectQuestion.onOpened.add(updateChoiceEnabled);
      })();

      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
      const popupContainer = Selector(".sv-popup__container").filterVisible();
      await t
        .pressKey("esc")
        .click(questionDropdownSelect);
      await takeElementScreenshot("dropdown-select-disabled-popup-items.png", popupContainer, t, comparer);
    });
  });

  test("Check dropdown selected items", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(500, 300);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            name: "question1",
            hasOther: "true",
            choices: [
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7",
              "item8",
              "item9",
              "item10",
              "item11",
              "item12",
              "item13",
              "item14",
              "item15",
              "item16",
              "item17",
              "item18",
              "item19",
              "item20",
              "item21",
              "item22",
              "item23",
              "item24",
              "item25",
              "item26",
              "item27"
            ]
          }
        ]
      });
      const popupContainer = Selector(".sv-popup__container").filterVisible();
      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");

      await t
        .click(questionDropdownSelect);
      await takeElementScreenshot("dropdown-question-empty-value.png", popupContainer, t, comparer);

      await t.click(getListItemByText("item7"));
      await t.click(questionDropdownSelect);
      await takeElementScreenshot("dropdown-question-noempty-value.png", popupContainer, t, comparer);

      await t.resizeWindow(1280, 1100);
    });
  });

  test("Check dropdown empty list", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            name: "q1",
            hasOther: "true",
            choices: [
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7",
              "item8",
              "item9",
              "item10",
              "item11",
              "item12",
              "item13",
              "item14",
              "item15",
              "item16",
              "item17",
              "item18",
              "item19",
              "item20",
              "item21",
              "item22",
              "item23",
              "item24",
              "item25",
              "item26",
              "item27"
            ]
          }
        ]
      });

      const popupContainer = Selector(".sv-list__empty-container").filterVisible();
      await t
        .typeText(".sd-dropdown__filter-string-input", "test")
        .wait(100);
      await takeElementScreenshot("dropdown-empty-list.png", popupContainer, t, comparer);
      await t.resizeWindow(300, 500);
      await takeElementScreenshot("dropdown-small-window-empty-list.png", popupContainer, t, comparer);
    });
  });

  test("Check dropdown with markdown", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        focusFirstQuestionAutomatic: false,
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            name: "q1",
            defaultValue: "cat",
            choices: [
              {
                "value": "dog",
                "text": "Dog: ![A dog](https://surveyjs.io/Content/Images/examples/markdown/dog.svg =14x14)"
              }, {
                "value": "cat",
                "text": "Cat: ![A cat](https://surveyjs.io/Content/Images/examples/markdown/cat.svg =14x14)"
              }, {
                "value": "parrot",
                "text": "Parrot ![A parrot](https://surveyjs.io/Content/Images/examples/markdown/parrot.svg =14x14)"
              }
            ]
          }
        ]
      }, {
        "onTextMarkdown": (sender, options) => {
          var converter = new window["showdown"].Converter();
          var str = converter.makeHtml(options.text);
          str = str.substring(3);
          str = str.substring(0, str.length - 4);
          options.html = str;
        }
      });

      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
      await takeElementScreenshot("dropdown-with-markdown.png", questionDropdownSelect, t, comparer);

      const popupContainer = Selector(".sv-popup__container").filterVisible();
      await t.click(questionDropdownSelect);
      await takeElementScreenshot("dropdown-with-markdown-popup.png", popupContainer, t, comparer);

      await t.pressKey("Enter");
      await takeElementScreenshot("dropdown-with-markdown-focused.png", questionDropdownSelect, t, comparer);
    });
  });

  test("Check rtl dropdown question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await ClientFunction(() => {
        document.body.setAttribute("dir", "rtl");
      })();

      await initSurvey(framework, {
        questions: [
          {
            type: "dropdown",
            showTitle: false,
            name: "dropdown_question",
            defaultValue: "item10",
            choices: [
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7",
              "item8",
              "item9",
              "item10",
              "item11",
              "item12",
              "item13",
              "item14",
              "item15",
              "item16",
              "item17",
              "item18",
              "item19"
            ],
          },
        ]
      });

      const questionRoot = Selector(".sd-question");

      await resetFocusToBody();
      await takeElementScreenshot("dropdown-rtl-question-answered.png", questionRoot, t, comparer);

      await t.click(".sd-dropdown_clean-button");
      await resetFocusToBody();
      await takeElementScreenshot("dropdown-rtl-question.png", questionRoot, t, comparer);

      await ClientFunction(() => {
        document.body.setAttribute("dir", "ltr");
      })();
    });

  });

  test("Dropdown search with spaces", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            name: "q1",
            hasOther: "true",
            choices: [
              "item abc",
              "item def",
            ]
          }
        ]
      });

      const popupContainer = Selector(".sd-dropdown").filterVisible();
      await t
        .typeText(".sd-dropdown__filter-string-input", "a")
        .wait(100);
      await takeElementScreenshot("dropdown-search-spaces-prefix.png", popupContainer, t, comparer);
      await t
        .typeText(".sd-dropdown__filter-string-input", "m", { replace: true })
        .wait(100);
      await takeElementScreenshot("dropdown-search-spaces-suffix.png", popupContainer, t, comparer);
    });
  });

  test("Check dropdown with custom component input height", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {

      await registerCustomItemComponent(framework);

      const jsonWithDropDown = {
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            type: "dropdown",
            name: "cars",
            title: "Dropdown",
            defaultValue: "Ford",
            itemComponent: "new-item",
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
          }
        ]
      };
      await initSurvey(framework, jsonWithDropDown);

      await t.resizeWindow(1280, 1100);
      const questionDropdownSelect = Selector(".sd-question__content");
      await ClientFunction(() => {
        (<HTMLElement>document.querySelector(".sd-question__content svg")).style.height = "48px";
        (<HTMLElement>document.querySelector(".sd-question__content input")).style.backgroundColor = "red";
      })();
      await takeElementScreenshot("dropdown-custom-component.png", questionDropdownSelect, t, comparer);
    });
  });

  test("Check overlay popup in dropdown question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(500, 700);
      await ClientFunction(() => {
        window["Survey"]._setIsTouch(true);
      })();
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "dropdown",
            name: "dropdown",
            hasOther: "true",
            closeOnSelect: false,
            choices: [
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7",
              "item8",
              "item9",
              "item10",
              "item11",
              "item12",
            ]
          }
        ]
      });
      await t.click(Selector(".sd-dropdown__filter-string-input"))
        .click(Selector(".sd-list__item span").withText("item1"))
        .click(Selector(".sd-dropdown__filter-string-input"));
      await takeElementScreenshot("dropdown-question-overlay-popup-selected.png", Selector(".sv-popup.sv-single-select-list"), t, comparer);
    });
  });
  test("Check long text in disabled dropdown question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1000, 700);
      await initSurvey(framework, {
        "logoPosition": "right",
        "mode": "display",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "dropdown",
                "name": "question1",
                "defaultValue": "Item 1",
                "choices": [
                  {
                    "value": "Item 1",
                    "text": "Some long text goes here Some long text goes here Some long text goes here "
                  },
                  "Item 2",
                  "Item 3"
                ]
              }
            ]
          }
        ]
      });
      await takeElementScreenshot("dropdown-question-disabled-long-text.png", Selector(".sd-question"), t, comparer);
    });
  });

});