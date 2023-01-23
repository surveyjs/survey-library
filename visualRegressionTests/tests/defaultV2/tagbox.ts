import { Selector, ClientFunction, t } from "testcafe";
import { getListItemByText } from "../../../testCafe/helper";
import { url, frameworks, initSurvey, url_test, explicitErrorHandler, takeElementScreenshot, wrapVisualTest, resetFocusToBody } from "../../helper";

const title = "Tagbox Screenshot";

fixture`${title}`.page`${url}`;

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(async framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`
    .beforeEach(async t => {
      await explicitErrorHandler();
      await applyTheme(theme);
    });

  test("Check tagbox select question popup", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "question1",
            hasOther: "true",
            closeOnSelect: "false",
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

      const questionTagbox = Selector(".sd-input.sd-tagbox");
      const popupContainer = Selector(".sv-popup__container").filterVisible();
      await resetFocusToBody();
      await takeElementScreenshot("tagbox-question.png", questionTagbox, t, comparer);

      await t
        .click(questionTagbox)
        .click(getListItemByText("item10"))
        .click(getListItemByText("item20"));
      await takeElementScreenshot("tagbox-popup-selected-items.png", popupContainer, t, comparer);
      await takeElementScreenshot("tagbox-input-selected-items.png", questionTagbox, t, comparer);

      await t
        .pressKey("esc")
        .hover(Selector(".sv-tagbox__item"));
      await takeElementScreenshot("tagbox-question-item-hover.png", Selector(".sv-tagbox__item"), t, comparer);

      await t.hover(Selector(".sd-tagbox-item_clean-button-svg"));
      await takeElementScreenshot("tagbox-question-item-icon-hover.png", Selector(".sv-tagbox__item"), t, comparer);
    });
  });

  test("Check tagbox select question without clear button", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "question12",
            hasOther: "true",
            allowClear: false,
            defaultValue: ["item1"],
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

      const questionTagbox = Selector(".sd-input.sd-tagbox");
      await resetFocusToBody();
      await takeElementScreenshot("tagbox-question-without-clear-button.png", questionTagbox, t, comparer);
    });
  });

  test("Check tagbox disabled items", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "tagbox",
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

        const selectQuestion = window["survey"].getQuestionByName("tagbox");
        selectQuestion.onOpened.add(updateChoiceEnabled);
      })();

      const questionTagbox = Selector(".sd-input.sd-tagbox");
      const popupContainer = Selector(".sv-popup__container").filterVisible();
      await t
        .pressKey("esc")
        .click(questionTagbox);
      await takeElementScreenshot("tagbox-disabled-popup-items.png", popupContainer, t, comparer);
    });
  });

  test("Check tagbox multivalue selected items", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 900);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "question12",
            hasOther: "true",
            allowClear: false,
            defaultValue: [
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
            ],
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
            ]
          }
        ]
      });

      const questionTagbox = Selector(".sd-input.sd-tagbox");
      await takeElementScreenshot("tagbox-question-multiline-selected-items.png", questionTagbox, t, comparer);
    });
  });

  test("Check rtl tagbox question ", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1280, 1100);
      await ClientFunction(() => {
        document.body.setAttribute("dir", "rtl");
      })();

      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "question1",
            defaultValue: ["item10", "item20"],
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
              "item20"
            ]
          }
        ]
      });

      const questionTagbox = Selector(".sd-question");
      await resetFocusToBody();

      await t.hover(Selector(".sv-tagbox__item"));
      await takeElementScreenshot("tagbox-rtl-question-answered.png", questionTagbox, t, comparer);

      await t.click(".sd-tagbox_clean-button-svg");
      await resetFocusToBody();
      await takeElementScreenshot("tagbox-rtl-question.png", questionTagbox, t, comparer);

      await ClientFunction(() => {
        document.body.setAttribute("dir", "ltr");
      })();
    });
  });
  test("Check overlay popup in tagbox question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 900);
      await ClientFunction(() => {
        window["Survey"]._setIsTouch(true);
      })();
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "tagbox",
            name: "tagbox",
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
        .typeText(Selector(".sv-list__input"), "item1", { paste: true });
      await takeElementScreenshot("tagbox-question-overlay-popup.png", Selector(".sv-popup.sv-single-select-list"), t, comparer);
    });
  });
});