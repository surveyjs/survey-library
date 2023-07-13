import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, explicitErrorHandler, wrapVisualTest } from "../../helper";

const title = "Ranking Screenshot";

fixture`${title}`.page`${url}`;

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

  test.only("Shortcut position due container layout", async (t) => {
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

      await t.debug();

      await t.dragToElement(item1, qustion);

      await takeElementScreenshot("question-ranking-shortcut-position-container-layout.png", Selector(".sd-question"), t, comparer);
    });
  });
});