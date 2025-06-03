import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Ranking Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check ranking question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await compareScreenshot(page, ".sd-question", "question-ranking.png");

      await page.locator(".sv-ranking-item").first().hover();
      await compareScreenshot(page, ".sd-question", "question-ranking-hover-item.png");
    });

    test("Check ranking question readonly", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await compareScreenshot(page, ".sd-question", "question-ranking-readonly.png");
    });

    test("Check ranking question items size", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            name: "ranking_question",
            choices: ["item1", "item2", "item3", "item4"]
          }
        ]
      });
      await page.evaluate(() => {
        document.querySelector('div[data-name="ranking_question"] .sv-ranking-item__text .sv-string-viewer').style.backgroundColor = "red";
      });
      await compareScreenshot(page, ".sd-question", "question-ranking-size.png");
    });

    test("Check ranking question selectToRankEnabled", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await compareScreenshot(page, ".sd-question", "question-ranking-select-to-rank.png");
    });

    test("Check ranking question selectToRankEnabled vertical mode", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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
      await compareScreenshot(page, ".sd-question", "question-ranking-select-to-rank-vertical.png");
    });

    test("Check ranking question selectToRankEnabled narrow", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "ranking",
                "name": "question1",
                "maxWidth": "400px",
                "choices": ["Item 1", "Item 2", "Item 3"],
                "selectToRankEnabled": true
              },
              {
                "type": "ranking",
                "name": "question2",
                "maxWidth": "250px",
                "minWidth": "200px",
                "choices": ["Item 1", "Item 2", "Item 3"],
                "selectToRankEnabled": true
              }
            ]
          }
        ]
      });
      await compareScreenshot(page, page.locator(".sd-question").nth(0), "question-ranking-select-to-rank-narrow-medium.png");
      await compareScreenshot(page, page.locator(".sd-question").nth(1), "question-ranking-select-to-rank-narrow-small.png");
    });

    test.skip("Shortcut position due container layout", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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

      await page.evaluate(() => {
        document.getElementById("surveyElement").style.margin = "50px";
        const question = window["survey"].getAllQuestions()[0];
        question.dragDropRankingChoices.removeGhostElementFromSurvey = () => { };
        question.dragDropRankingChoices.domAdapter.drop = () => { };
        question.dragDropRankingChoices.domAdapter.clear = () => { };
      });

      const item1 = page.locator(".sv-ranking-item__text span").filter({ hasText: "item1" });
      await item1.dragTo(page.locator(".sd-question"));
      await compareScreenshot(page, ".sd-question", "question-ranking-shortcut-position-container-layout.png");
    });

    test.skip("Shortcut position due container layout (relative)", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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

      await page.evaluate(() => {
        document.getElementById("surveyElement").style.position = "relative";
        document.getElementById("surveyElement").style.margin = "100px";
        const question = window["survey"].getAllQuestions()[0];
        question.dragDropRankingChoices.removeGhostElementFromSurvey = () => { };
        question.dragDropRankingChoices.domAdapter.drop = () => { };
        question.dragDropRankingChoices.domAdapter.clear = () => { };
      });

      const item1 = page.locator(".sv-ranking-item__text span").filter({ hasText: "item1" });
      await item1.dragTo(page.locator(".sd-question"));
      await compareScreenshot(page, ".sd-question", "question-ranking-shortcut-position-container-relative-layout.png");
    });

    test.skip("Shortcut position due container layout (scroll)", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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

      await page.evaluate(() => {
        document.getElementById("surveyElement").style.height = "300px";
        const surveyContainer = document.querySelector(".sd-root-modern--full-container > .sv-scroll__wrapper > .sv-scroll__scroller");
        if (surveyContainer) {
          surveyContainer.scrollTop = 50;
        }
        const question = window["survey"].getAllQuestions()[0];
        question.dragDropRankingChoices.removeGhostElementFromSurvey = () => { };
        question.dragDropRankingChoices.domAdapter.drop = () => { };
        question.dragDropRankingChoices.domAdapter.clear = () => { };
        question.dragDropRankingChoices.domAdapter.doScroll = () => { };
      });

      const item1 = page.locator(".sv-ranking-item__text span").filter({ hasText: "item1" });
      await item1.dragTo(item1, { targetPosition: { x: -1, y: 0 } });
      await compareScreenshot(page, ".sd-question", "question-ranking-shortcut-position-container-scroll-layout.png");
    });

    test("Ranking theming", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "on",
        questions: [
          {
            "type": "ranking",
            "name": "name",
            "title": "Question title",
            "choices": ["item1", "item2"]
          }
        ]
      });
      await page.evaluate(() => {
        window["survey"].applyTheme({
          "cssVariables": {
            "--sjs-font-questiontitle-color": "red",
            "--sjs-font-editorfont-size": "32px"
          }
        });
      });
      await compareScreenshot(page, ".sv-ranking-item", "question-ranking-item-theme.png");
    });

    test.skip("Ranking custom content component", async ({ page }) => {
      // await registerCustomItemContentComponent(framework);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
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

      const item = page.locator(".sv-ranking-item").nth(0).locator(".sv-ranking-item__text");
      await compareScreenshot(page, item, "question-ranking-custom-item-content.png");
    });

    test("Ranking long items", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: "off",
        questions: [
          {
            type: "ranking",
            name: "ranking_question",
            choices: [
              "longitem_1 longitem_1 longitem_1 longitem_1 longitem_1 longitem_1 longitem_1 longitem_1 longitem_1",
              "item2",
              "longitem_3 longitem_3 longitem_3 longitem_3 longitem_3 longitem_3 longitem_3 longitem_3 longitem_3",
              "item4"
            ]
          }
        ]
      });
      await compareScreenshot(page, ".sd-question", "question-ranking-long-items.png");

      await page.locator(".sv-ranking-item").first().hover();
      await compareScreenshot(page, ".sd-question", "question-ranking-hover-long-item.png");
    });
  });
});