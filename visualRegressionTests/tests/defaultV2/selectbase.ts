import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, resetFocusToBody, wrapVisualTest, takeElementScreenshot } from "../../helper";

const title = "Selectbase Screenshot";

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
  test("Check checkbox question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "checkbox",
            title: "Which cities have you visited?",
            name: "checkbox_question",
            choices: ["Moscow", "Paris", "Madrid", "Munich", "London", "None"],
            colCount: 1
          },
        ]
      });
      await resetFocusToBody();
      await takeElementScreenshot("checkbox-col-count-1.png", Selector(".sd-question"), t, comparer);
      await ClientFunction(() => { (<any>window).survey.getQuestionByName("checkbox_question").colCount = 2; })();
      await takeElementScreenshot("checkbox-col-count-2.png", Selector(".sd-question"), t, comparer);
      await ClientFunction(() => { (<any>window).survey.getQuestionByName("checkbox_question").colCount = 0; })();
      await takeElementScreenshot("checkbox-col-count-0.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check checkbox state", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "checkbox",
            title: "Which cities have you visited?",
            name: "checkbox_question",
            choices: ["Moscow", "Paris", "Madrid"],
            colCount: 1
          },
        ]
      });
      await t
        .click(Selector(".sd-item__control-label").withText("Moscow"))
        .click(Selector(".sd-item__control-label").withText("Paris"))
        .hover(Selector(".sd-item__control-label").withText("Madrid"));
      await takeElementScreenshot("checkbox-state.png", Selector(".sd-question"), t, comparer);
      await t.hover(Selector(".sd-selectbase__item").withText("Madrid"), { offsetX: 1, offsetY: 1 });
      await takeElementScreenshot("checkbox-state-hover-near.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check radiogroup question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            "type": "radiogroup",
            "name": "car",
            "title": "What car are you driving?",
            "hasNone": true,
            "colCount": 0,
            "choices": [
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
      });
      await resetFocusToBody();
      await takeElementScreenshot("radiogroup-col-count-0.png", Selector(".sd-question"), t, comparer);
      await ClientFunction(() => { (<any>window).survey.getQuestionByName("car").colCount = 4; })();
      await takeElementScreenshot("radiogroup-col-count-4.png", Selector(".sd-question"), t, comparer);
      await ClientFunction(() => { (window as any).survey.getAllQuestions()[0].showClearButton = true; })();
      await takeElementScreenshot("radiogroup-clear-button", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check radiogroup state", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "radiogroup",
            title: "Which city have you visited?",
            name: "radiogroup_question",
            choices: ["Moscow", "Paris", "Madrid"],
            colCount: 1
          },
        ]
      });
      await t
        .click(Selector(".sd-item__control-label").withText("Moscow"))
        .hover(Selector(".sd-item__control-label").withText("Madrid"));
      await takeElementScreenshot("radiogroup-state.png", Selector(".sd-question"), t, comparer);
      await resetFocusToBody();
      await t.hover(Selector(".sd-selectbase__item").withText("Madrid"), { offsetX: 1, offsetY: 1 });
      await takeElementScreenshot("radiogroup-state-hover-near.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check checkbox with comment long area", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "checkbox",
                "choices": [
                  "choice1"
                ],
                "hasComment": true,
                "name": "q1",
                "commentText": "Please feel free to share your thoughts in the comment box down below"
              }
            ]
          }
        ],
        "widthMode": "static",
        "width": "600px"
      });
      await resetFocusToBody();
      await takeElementScreenshot("checkbox-with-long-comment-text.png", Selector(".sd-question"), t, comparer);

    });
  });
});