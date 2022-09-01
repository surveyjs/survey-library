import { Selector, ClientFunction } from "testcafe";
import { getListItemByText } from "../../../testCafe/helper";
import { url, frameworks, initSurvey, url_test, explicitErrorHandler, wrapVisualTest, takeElementScreenshot } from "../../helper";

const title = "Dropdown Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`
    .beforeEach(async t => {
      await explicitErrorHandler();
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
      await ClientFunction(() => { document.body.focus(); })();
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
      await ClientFunction(() => { document.body.focus(); })();
      await takeElementScreenshot("dropdown-select-question.png", questionRoot, t, comparer);

      await ClientFunction(() => { (<any>window).survey.getQuestionByName("dropdown_question").value = "Greece"; })();
      await takeElementScreenshot("dropdown-select-question-answered.png", questionRoot, t, comparer);
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

      const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
      await takeElementScreenshot("dropdown-select-question-with-clear-button-and-long-text.png", questionDropdownSelect, t, comparer);

      await takeElementScreenshot("dropdown-select-question-and-long-text.png", questionDropdownSelect.nth(1), t, comparer);
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
        .pressKey("esc")
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
    });
  });
});