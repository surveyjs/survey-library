import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, takeElementScreenshot, wrapVisualTest } from "../../helper";
import { registerCustomItemContentComponent } from "../../../functionalTests/helper";

const title = "Ranking Screenshot";

fixture`${title}`.page`${url}`;

frameworks.forEach(framework => {
  fixture`${framework} ${title}`
    .page`${url}${framework}`;

  test("Check ranking question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
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
      await takeElementScreenshot("question-ranking.png", Selector(".sd-question"), t, comparer);

      await t.hover(".sv-ranking-item");
      await takeElementScreenshot("question-ranking-hover-item.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check ranking question readonly", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            name: "ranking_question",
            choices: ["item1", "item2", "item3", "item4"],
            readOnly: "true"
          }
        ]
      });
      await takeElementScreenshot("question-ranking-readonly.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check ranking question items size", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            name: "ranking_question",
            choices: ["item1", "item2", "item3", "item4"]
          }
        ]
      });
      await ClientFunction(selector => {
        document.querySelector(selector).style.backgroundColor = "red";
      })('div[data-name="ranking_question"] .sv-ranking-item__text .sv-string-viewer');
      await takeElementScreenshot("question-ranking-size.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check ranking question selectToRankEnabled", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            title: "Tell me about a time you strongly disagreed with your manager. What did you do to convince him or her that you were right? What happened?",
            name: "ranking_question",
            choices: ["item1", "item2", "item3", "item4"],
            selectToRankEnabled: true
          }
        ]
      });
      await takeElementScreenshot("question-ranking-select-to-rank.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check ranking question selectToRankEnabled vertical mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            title: "Tell me about a time you strongly disagreed with your manager. What did you do to convince him or her that you were right? What happened?",
            name: "ranking_question",
            choices: ["item1", "item2", "item3", "item4"],
            selectToRankEnabled: true,
            selectToRankAreasLayout: "vertical"
          }
        ]
      });
      await takeElementScreenshot("question-ranking-select-to-rank-vertical.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check ranking question selectToRankEnabled narrow", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "ranking",
                "name": "question1",
                "maxWidth": "400px",
                "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
                ],
                "selectToRankEnabled": true
              },
              {
                "type": "ranking",
                "name": "question2",
                "maxWidth": "250px",
                "minWidth": "200px",
                "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
                ],
                "selectToRankEnabled": true
              }
            ]
          }
        ]
      });
      await takeElementScreenshot("question-ranking-select-to-rank-narrow-medium.png", Selector(".sd-question").nth(0), t, comparer);
      await takeElementScreenshot("question-ranking-select-to-rank-narrow-small.png", Selector(".sd-question").nth(1), t, comparer);
    });
  });

  test("Shortcut position due container layout", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            title: "ranking question",
            name: "ranking_question",
            choices: ["item1", "item2", "item3", "item4"]
          }
        ]
      });

      const item1 = Selector("span")
        .withText("ranking question")
        .parent("[aria-labelledby]")
        .find("span")
        .withText("item1");

      const qustion = Selector("span")
        .withText("ranking question")
        .parent("[aria-labelledby]");

      const patchDragDropToShowGhostElementAfterDrop = ClientFunction(() => {
        (<HTMLElement>document.getElementById("surveyElement")).style.margin = "50px";
        const question = window["survey"].getAllQuestions()[0];
        question.dragDropRankingChoices.removeGhostElementFromSurvey = () => { };
        question.dragDropRankingChoices.domAdapter.drop = () => { };
        question.dragDropRankingChoices.domAdapter.clear = () => { };
      });

      await patchDragDropToShowGhostElementAfterDrop();
      await t.dragToElement(item1, qustion, { speed: 0.1 });
      await takeElementScreenshot("question-ranking-shortcut-position-container-layout.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Shortcut position due container layout (relative)", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            title: "ranking question",
            name: "ranking_question",
            choices: ["item1", "item2", "item3", "item4"]
          }
        ]
      });

      const item1 = Selector("span")
        .withText("ranking question")
        .parent("[aria-labelledby]")
        .find("span")
        .withText("item1");

      const qustion = Selector("span")
        .withText("ranking question")
        .parent("[aria-labelledby]");

      const patchDragDropToShowGhostElementAfterDrop = ClientFunction(() => {
        (<HTMLElement>document.getElementById("surveyElement")).style.position = "relative";
        (<HTMLElement>document.getElementById("surveyElement")).style.margin = "100px";

        const question = window["survey"].getAllQuestions()[0];
        question.dragDropRankingChoices.removeGhostElementFromSurvey = () => { };
        question.dragDropRankingChoices.domAdapter.drop = () => { };
        question.dragDropRankingChoices.domAdapter.clear = () => { };
      });

      await patchDragDropToShowGhostElementAfterDrop();
      await t.dragToElement(item1, qustion, { speed: 0.1 });
      await takeElementScreenshot("question-ranking-shortcut-position-container-relative-layout.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Shortcut position due container layout (scroll)", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            title: "ranking question",
            name: "ranking_question",
            choices: ["item1", "item2", "item3", "item4"]
          }
        ]
      });

      const item1 = Selector("span")
        .withText("ranking question")
        .parent("[aria-labelledby]")
        .find("span")
        .withText("item1");

      const qustion = Selector("span")
        .withText("ranking question")
        .parent("[aria-labelledby]");

      const patchDragDropToShowGhostElementAfterDrop = ClientFunction(() => {
        (<HTMLElement>document.getElementById("surveyElement")).style.height = "300px";
        const surveyContainer = (<HTMLElement>document.getElementById("surveyElement")).querySelector(".sd-root-modern--full-container > .sv-scroll__wrapper > .sv-scroll__scroller");
        if (!!surveyContainer) {
          surveyContainer.scrollTop = 50;
        }

        const question = window["survey"].getAllQuestions()[0];
        question.dragDropRankingChoices.removeGhostElementFromSurvey = () => { };
        question.dragDropRankingChoices.domAdapter.drop = () => { };
        question.dragDropRankingChoices.domAdapter.clear = () => { };
        question.dragDropRankingChoices.domAdapter.doScroll = () => { };
      });

      await patchDragDropToShowGhostElementAfterDrop();
      await t.dragToElement(item1, item1, { destinationOffsetX: -1, speed: 0.1 });
      await takeElementScreenshot("question-ranking-shortcut-position-container-scroll-layout.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Ranking theming", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        questions: [
          {
            "type": "ranking",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1", "item2"
            ]
          }
        ]
      });
      await ClientFunction(() => {
        (<any>window).survey.applyTheme({
          "cssVariables": {
            "--sjs-font-questiontitle-color": "red",
            "--sjs-font-editorfont-size": "32px"
          }
        });
      })();
      const question = Selector(".sv-ranking-item");
      await takeElementScreenshot("question-ranking-item-theme.png", question, t, comparer);
    });
  });

  test("Ranking custom content component", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await registerCustomItemContentComponent(framework);
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            name: "ranking_question",
            itemComponent: "new-item-content",
            choices: ["item1", "item2", "item3", "item4"],
            readOnly: "true"
          }
        ]
      });
      const itemContent = Selector(".sv-ranking-item").nth(0).find(".sv-ranking-item__text");
      await takeElementScreenshot("question-ranking-custom-item-content.png", itemContent, t, comparer);
    });
  });

  test("Ranking long items", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await registerCustomItemContentComponent(framework);
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            name: "ranking_question",
            choices:
            [
              "longitem_1 longitem_1 longitem_1 longitem_1 longitem_1 longitem_1 longitem_1 longitem_1 longitem_1",
              "item2",
              "longitem_3 longitem_3 longitem_3 longitem_3 longitem_3 longitem_3 longitem_3 longitem_3 longitem_3",
              "item4"
            ]
          }
        ]
      });
      await takeElementScreenshot("question-ranking-long-items.png", Selector(".sd-question"), t, comparer);

      await t.hover(".sv-ranking-item");
      await takeElementScreenshot("question-ranking-hover-long-item.png", Selector(".sd-question"), t, comparer);
    });
  });
});