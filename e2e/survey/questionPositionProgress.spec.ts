import type { Page } from "@playwright/test";
import { frameworks, initSurvey, url, test, expect, getButtonByText } from "../helper";

const title = "question position progress";

async function expectProgress(page: Page, text: string): Promise<void> {
  await expect(page.getByText(text, { exact: true }).filter({ visible: true })).toHaveCount(1);
}

async function next(page: Page): Promise<void> {
  await getButtonByText(page, "Next").click();
}

async function previous(page: Page): Promise<void> {
  await getButtonByText(page, "Previous").click();
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test("questionPerPage follows the screen forward and back", async ({ page }) => {
      await initSurvey(page, framework, {
        showProgressBar: true,
        progressBarLocation: "top",
        questionsOnPageMode: "questionPerPage",
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
          { type: "text", name: "q3" }
        ]
      });
      await expectProgress(page, "Question 1 of 3");
      await page.locator("input").fill("a");
      await expectProgress(page, "Question 1 of 3");
      await next(page);
      await expectProgress(page, "Question 2 of 3");
      await next(page);
      await expectProgress(page, "Question 3 of 3");
      await previous(page);
      await expectProgress(page, "Question 2 of 3");
      await previous(page);
      await expectProgress(page, "Question 1 of 3");
    });

    test("questionPerPage counts a panel as one screen and adds a question that becomes visible", async ({ page }) => {
      await initSurvey(page, framework, {
        showProgressBar: true,
        progressBarLocation: "top",
        questionsOnPageMode: "questionPerPage",
        elements: [
          { type: "text", name: "q1" },
          { type: "panel", name: "p1", elements: [{ type: "text", name: "q2" }, { type: "text", name: "q3" }] },
          { type: "text", name: "q4", visibleIf: "{q1} = 'show'" }
        ]
      });
      await expectProgress(page, "Question 1 of 2");
      await next(page);
      await expect(page.locator("input")).toHaveCount(2);
      await expectProgress(page, "Question 2 of 2");
      await page.evaluate(() => { (window as any)["survey"].setValue("q1", "show"); });
      await expectProgress(page, "Question 2 of 3");
      await next(page);
      await expectProgress(page, "Question 3 of 3");
      await previous(page);
      await expectProgress(page, "Question 2 of 3");
    });

    test("inputPerPage counts questions inside a static panel and walks back", async ({ page }) => {
      await initSurvey(page, framework, {
        showProgressBar: true,
        progressBarLocation: "top",
        questionsOnPageMode: "inputPerPage",
        elements: [
          { type: "panel", name: "p1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
          { type: "text", name: "q3" }
        ]
      });
      await expectProgress(page, "Question 1 of 3");
      await next(page);
      await expectProgress(page, "Question 2 of 3");
      await next(page);
      await expectProgress(page, "Question 3 of 3");
      await previous(page);
      await expectProgress(page, "Question 2 of 3");
      await previous(page);
      await expectProgress(page, "Question 1 of 3");
    });

    test("inputPerPage counts each static matrix row and walks back", async ({ page }) => {
      await initSurvey(page, framework, {
        showProgressBar: true,
        progressBarLocation: "top",
        questionsOnPageMode: "inputPerPage",
        elements: [
          { type: "text", name: "q1" },
          { type: "matrix", name: "m1", columns: ["a", "b"], rows: ["r1", "r2"] }
        ]
      });
      await expectProgress(page, "Question 1 of 3");
      await next(page);
      await expectProgress(page, "Question 2 of 3");
      await next(page);
      await expectProgress(page, "Question 3 of 3");
      await previous(page);
      await expectProgress(page, "Question 2 of 3");
      await previous(page);
      await expectProgress(page, "Question 1 of 3");
    });

    test("inputPerPage follows a dynamic panel forward and back", async ({ page }) => {
      await initSurvey(page, framework, {
        showProgressBar: true,
        progressBarLocation: "top",
        questionsOnPageMode: "inputPerPage",
        elements: [
          {
            type: "paneldynamic", name: "panel1", panelCount: 1,
            templateElements: [
              { type: "text", name: "q1" },
              { type: "text", name: "q2" }
            ]
          },
          { type: "text", name: "q3" }
        ]
      });
      await expectProgress(page, "Question 1 of 4");
      await page.locator("input").fill("a");
      await next(page);
      await expectProgress(page, "Question 2 of 4");
      await page.locator("input").fill("b");
      await previous(page);
      await expectProgress(page, "Question 1 of 4");
      await next(page);
      await next(page);
      await expectProgress(page, "Question 3 of 4");
      await next(page);
      await expectProgress(page, "Question 4 of 4");
      await previous(page);
      await expectProgress(page, "Question 3 of 4");
    });

    test("inputPerPage follows a dynamic matrix forward and back", async ({ page }) => {
      await initSurvey(page, framework, {
        showProgressBar: true,
        progressBarLocation: "top",
        questionsOnPageMode: "inputPerPage",
        elements: [
          { type: "text", name: "q1" },
          {
            type: "matrixdynamic", name: "matrix", rowCount: 2,
            columns: [{ cellType: "text", name: "col1" }]
          }
        ]
      });
      await expectProgress(page, "Question 1 of 4");
      await next(page);
      await expectProgress(page, "Question 2 of 4");
      await next(page);
      await expectProgress(page, "Question 3 of 4");
      await previous(page);
      await expectProgress(page, "Question 2 of 4");
      await previous(page);
      await expectProgress(page, "Question 1 of 4");
      await next(page);
      await next(page);
      await next(page);
      await expectProgress(page, "Question 4 of 4");
      await previous(page);
      await expectProgress(page, "Question 1 of 4");
    });
  });
});
