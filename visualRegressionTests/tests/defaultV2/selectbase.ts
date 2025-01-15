import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, resetFocusToBody, wrapVisualTest, takeElementScreenshot, setRowItemFlowDirection } from "../../helper";

const title = "Selectbase Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("Check checkbox question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await setRowItemFlowDirection();
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
    await setRowItemFlowDirection();
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
        showQuestionNumbers: "on",
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

  test("Check rating smileys scale colored question themes", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const focusBody = ClientFunction(() => { document.body.focus(); });

      await initSurvey(framework, {
        showQuestionNumbers: "on",
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "radiogroup",
                "name": "question1",
                "startWithNewLine": false,
                "title": "question1",
                "choices": [
                  "option1",
                  "option2",
                  "option3"
                ],
                "colCount": 3
              }
            ],
            "title": "Personal Information"
          }
        ]
      });

      await ClientFunction(() => {
        const themeJson = {
          "themeName": "default",
          "colorPalette": "light",
          "isPanelless": true,
          "cssVariables": {
            "--sjs-corner-radius": "4px",
            "--sjs-base-unit": "8px",
            "--sjs-shadow-small": "0px 1px 2px 0px rgba(0, 0, 0, 0.15)",
            "--sjs-shadow-inner": "inset 0px 1px 2px 0px rgba(0, 0, 0, 0.15)",
            "--sjs-border-default": "rgba(0, 0, 0, 0.16)",
            "--sjs-border-light": "rgba(0, 0, 0, 0.09)",
            "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
            "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
            "--sjs-general-backcolor-dim-light": "rgba(249, 249, 249, 1)",
            "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)",
            "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
            "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
            "--sjs-general-dim-forecolor": "rgba(0, 0, 0, 0.91)",
            "--sjs-general-dim-forecolor-light": "rgba(0, 0, 0, 0.45)",
            "--sjs-secondary-backcolor": "rgba(255, 152, 20, 1)",
            "--sjs-secondary-backcolor-light": "rgba(255, 152, 20, 0.1)",
            "--sjs-secondary-backcolor-semi-light": "rgba(255, 152, 20, 0.25)",
            "--sjs-secondary-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-secondary-forecolor-light": "rgba(255, 255, 255, 0.25)",
            "--sjs-shadow-small-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.15)",
            "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.1)",
            "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.1)",
            "--sjs-shadow-inner-reset": "inset 0px 0px 0px 0px rgba(0, 0, 0, 0.15)",
            "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
            "--sjs-general-backcolor-dim": "rgba(255, 255, 255, 1)",
            "--sjs-primary-backcolor": "rgba(25, 179, 148, 1)",
            "--sjs-primary-backcolor-dark": "rgba(20, 164, 139, 1)",
            "--sjs-primary-backcolor-light": "rgba(25, 179, 148, 0.1)",
            "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
            "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
            "--sjs-special-red": "rgba(229, 10, 62, 1)",
            "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)"
          },
        };
        window["survey"].applyTheme(themeJson);
      })();

      const questionRoot = Selector(".sd-question .sd-question__content");
      await focusBody();
      await takeElementScreenshot("question-selectbase-zero-column-panelless", questionRoot, t, comparer);
    });
  });
});