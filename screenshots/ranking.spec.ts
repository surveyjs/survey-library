import { test } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, doDrag } from "../e2e/helper";
import { registerCustomItemContentComponent } from "../e2e/registerCustomComponents";

const title = "Ranking Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check ranking question", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
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
        showQuestionNumbers: false,
        elements: [
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
        showQuestionNumbers: false,
        elements: [
          {
            type: "ranking",
            name: "ranking_question",
            choices: ["item1", "item2", "item3", "item4"]
          }
        ]
      });
      await page.evaluate(() => {
        (window as any).survey.rootElement.getRootNode().querySelector('div[data-name="ranking_question"] .sv-ranking-item__text .sv-string-viewer').style.backgroundColor = "red";
      });
      await compareScreenshot(page, ".sd-question", "question-ranking-size.png");
    });

    test("Check ranking question selectToRankEnabled", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
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
        showQuestionNumbers: false,
        elements: [
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
        showQuestionNumbers: true,
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

    test("Shortcut position due container layout", async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "ranking",
            title: "ranking question",
            name: "ranking_question",
            choices: ["."]
          }
        ]
      });

      await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        document.querySelector("#surveyElement")!.style.margin = "50px";
      });

      const element = page.locator(".sv-ranking-item__text span").filter({ hasText: "." });
      const target = page.locator(".sd-question");
      await doDrag({ page, element, target });

      const maxDiffPixels = 10;
      await compareScreenshot(page, ".sd-question", "question-ranking-shortcut-position-container-layout.png", 0, maxDiffPixels);
    });

    test("Shortcut position due container layout (relative)", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "ranking",
            title: "ranking question",
            name: "ranking_question",
            choices: ["."]
          }
        ]
      });

      await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        document.querySelector("#surveyElement")!.style.position = "relative";
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        document.querySelector("#surveyElement")!.style.margin = "100px";
      });

      const element = page.locator(".sv-ranking-item__text span").filter({ hasText: "." });
      const target = page.locator(".sd-question");
      await doDrag({ page, element, target });
      const maxDiffPixels = 10;
      await compareScreenshot(page, ".sd-question", "question-ranking-shortcut-position-container-relative-layout.png", 0, maxDiffPixels);
    });

    test("Shortcut position due container layout (scroll)", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "ranking",
            title: "ranking question",
            name: "ranking_question",
            choices: ["."]
          }
        ]
      });

      await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        document.querySelector("#surveyElement")!.style.height = "300px";
        const surveyContainer = (window as any).survey.rootElement.getRootNode().querySelector(".sd-root-modern--full-container > .sv-scroll__wrapper > .sv-scroll__scroller");
        if (surveyContainer) {
          surveyContainer.scrollTop = 50;
        }
        const question = window["survey"].getAllQuestions()[0];
        question.dragDropRankingChoices.domAdapter.doScroll = () => { };
      });

      const element = page.locator(".sv-ranking-item__text span").filter({ hasText: "." });
      await page.waitForTimeout(500);
      const { x, y } = await <any>element.boundingBox();
      await page.waitForTimeout(500);
      await element.hover({ force: true });
      //   await page.waitForTimeout(500);
      await page.mouse.down();
      //  await page.waitForTimeout(500);
      await page.mouse.move(x - 10, y, { steps: 20 });
      // await page.waitForTimeout(500);

      const maxDiffPixels = 40;
      await compareScreenshot(page, ".sd-question", "question-ranking-shortcut-position-container-scroll-layout.png", 0, maxDiffPixels);
    });

    test("Ranking theming", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [
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

    test("Ranking custom content component", async ({ page }) => {
      await registerCustomItemContentComponent(page, framework);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
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
        showQuestionNumbers: false,
        elements: [
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