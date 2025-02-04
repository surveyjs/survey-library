/* eslint-disable indent */
import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, setOptions, takeElementScreenshot, wrapVisualTest, resetFocusToBody } from "../../helper";

const title = "Boolean Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("Check boolean question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        questions: [
          {
            type: "boolean",
            name: "boolean_question",
          },
        ]
      });
      const questionRoot = Selector(".sd-question--boolean");
      await t.wait(1000);
      await resetFocusToBody();
      await takeElementScreenshot("boolean-question-indeterminate.png", questionRoot, t, comparer);

      await t.hover(".sd-boolean__thumb-ghost");
      await takeElementScreenshot("boolean-question-indeterminate-hovered.png", questionRoot, t, comparer);

      await t.click(Selector(".sv-string-viewer").withText("No"));
      await takeElementScreenshot("boolean-question-clicked.png", questionRoot, t, comparer);

      await t.hover(Selector(".sd-boolean__thumb-ghost").nth(1));
      await takeElementScreenshot("boolean-question-clicked-hovered.png", questionRoot, t, comparer);

      await t.hover(".sd-boolean__thumb-ghost");
      await setOptions("boolean_question", { readOnly: true });
      await takeElementScreenshot("boolean-question-clicked-disabled.png", questionRoot, t, comparer);

      await setOptions("boolean_question", { value: null });
      await takeElementScreenshot("boolean-question-disabled.png", questionRoot, t, comparer);
    });
  });

  test("Check boolean question - interchange buttons", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1600, 800);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        questions: [
          {
            type: "boolean",
            name: "boolean_question",
            swapOrder: true
          },
        ]
      });
      const questionRoot = Selector(".sd-question--boolean");
      await t.wait(1000);
      await resetFocusToBody();
      await takeElementScreenshot("boolean-question-exch-indeterminate.png", questionRoot, t, comparer);

      await t.hover(".sd-boolean__thumb-ghost");
      await takeElementScreenshot("boolean-question-exch-indeterminate-hovered.png", questionRoot, t, comparer);

      await t.click(Selector(".sv-string-viewer").withText("No"));
      await takeElementScreenshot("boolean-question-exch-clicked.png", questionRoot, t, comparer);

      await t.hover(Selector(".sd-boolean__thumb-ghost").nth(1));
      await takeElementScreenshot("boolean-question-exch-clicked-hovered.png", questionRoot, t, comparer);

      await t.hover(".sd-boolean__thumb-ghost");
      await setOptions("boolean_question", { readOnly: true });
      await takeElementScreenshot("boolean-question-exch-clicked-disabled.png", questionRoot, t, comparer);

      await setOptions("boolean_question", { value: null });
      await takeElementScreenshot("boolean-question-exch-disabled.png", questionRoot, t, comparer);
    });
  });

  test("Check radio boolean question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        width: "900px",
        questions: [
          {
            type: "boolean",
            name: "boolean_question",
            maxWidth: "768px",
            minWidth: "768px",
            width: "768px",
            renderAs: "radio"
          },
        ]
      });
      const questionRoot = Selector(".sd-question--boolean");
      await t.wait(1000);
      await takeElementScreenshot("boolean-radio-question.png", questionRoot, t, comparer);

      await t
        .click(Selector(".sv-string-viewer").withText("No"))
        .expect(Selector("input[type=radio]").nth(0).checked).ok();
      await takeElementScreenshot("boolean-radio-question-clicked.png", questionRoot, t, comparer);

      await t
        .click(Selector("body"), { offsetY: 400 })
        .expect(Selector("input[type=radio]").nth(0).focused).notOk();
      await takeElementScreenshot("boolean-radio-question-unfocused.png", questionRoot, t, comparer);
    });
  });
  test("Check boolean question word-wrap", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        focusFirstQuestionAutomatic: true,
        questions: [
          {
            type: "boolean",
            name: "boolean_question",
            "labelTrue": "On-site",
            "labelFalse": "Remote",
            defaultValue: true
          },
        ]
      });
      const questionRoot = Selector(".sd-question--boolean");
      await t.wait(1000);
      await takeElementScreenshot("boolean-question-word-wrap.png", questionRoot, t, comparer);
    });
  });

  test("Check boolean thumb position", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1400, 800);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                type: "boolean",
                name: "boolean1",
                swapOrder: false,
                labelTrue: "True Label",
                defaultValue: true
              },
              {
                type: "boolean",
                name: "boolean2",
                swapOrder: true,
                labelTrue: "True Label",
                defaultValue: false
              },
            ]
          }
        ]
      });
      const questionRoot = Selector(".sd-question--boolean");
      await t.wait(1000);
      await takeElementScreenshot("boolean-switch-thumb-right.png", questionRoot.nth(0), t, comparer);
      await takeElementScreenshot("boolean-switch-thumb-right-swapped.png", questionRoot.nth(1), t, comparer);
    });
  });

  test("Check boolean swapOrder thumb position", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1400, 800);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        "elements": [
          {
            type: "boolean",
            name: "boolean1",
            swapOrder: true,
          },
        ]
      });
      const questionRoot = Selector(".sd-question--boolean");
      await t.wait(1000);
      await takeElementScreenshot("boolean-switch-thumb-swapped-indeterminate.png", questionRoot.nth(0), t, comparer);
      await t.click(Selector(".sv-string-viewer").withText("No"));
      await takeElementScreenshot("boolean-switch-thumb-swapped-no.png", questionRoot.nth(0), t, comparer);
      await t.click(Selector(".sv-string-viewer").withText("Yes"));
      await takeElementScreenshot("boolean-switch-thumb-swapped-yes.png", questionRoot.nth(0), t, comparer);
    });
  });

  test("Check boolean rtl", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await ClientFunction(() => {
        document.body.setAttribute("dir", "rtl");
      })();

      await initSurvey(framework, {
        showQuestionNumbers: "on",
        "elements": [
          {
            "type": "boolean",
            "name": "slider",
            "title": "Are you 21 or older?",
            "description": "Display mode = Default (Slider)",
            "valueTrue": "Yes",
            "valueFalse": "No",
            "defaultValue": "No"
          }
        ]
      });

      const questionRoot = Selector(".sd-question--boolean");
      await takeElementScreenshot("boolean-question-rtl.png", questionRoot, t, comparer);

      await ClientFunction(() => {
        document.body.setAttribute("dir", "ltr");
      })();
    });

  });
});

