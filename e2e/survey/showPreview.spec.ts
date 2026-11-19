import { frameworks, initSurvey, url, getSurveyResult, test, expect, getButtonByText } from "../helper";
const title = "ShowPreview";

const json = {
  pages: [
    { elements: [{ type: "text", name: "q1" }] },
    {
      elements: [
        { type: "text", name: "q2", defaultValue: "2" },
        { type: "text", name: "q3" },
      ],
    },
    { elements: [{ type: "text", name: "q4", defaultValue: "4" }] },
    { elements: [{ type: "text", name: "q5" }] },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("showPreview = showAllQuestions", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      await page.evaluate(() => {
        window["survey"].showPreviewBeforeComplete = true;
        window["survey"].currentPageNo = window["survey"].visiblePageCount - 1;
      });

      await getButtonByText(page, "Preview").click();
      const editButtons = await getButtonByText(page, "Edit").count();
      await expect(editButtons).toBe(4);

      await getButtonByText(page, "Edit").nth(1).click();
      await page.locator("input[type=text]").nth(1).fill("val3");

      await getButtonByText(page, "Next").click();
      await getButtonByText(page, "Next").click();
      await getButtonByText(page, "Preview").click();
      await getButtonByText(page, "Complete").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        q2: "2",
        q3: "val3",
        q4: "4",
      });
    });

    test("showPreview = showAnsweredQuestions", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      await page.evaluate(() => {
        window["survey"].showPreviewBeforeComplete = true;
        window["survey"].previewMode = "answeredQuestions";
        window["survey"].currentPageNo = window["survey"].visiblePageCount - 1;
      });

      await getButtonByText(page, "Preview").click();
      const editButtons = await getButtonByText(page, "Edit").count();
      await expect(editButtons).toBe(2);

      await getButtonByText(page, "Edit").nth(0).click();
      await page.locator("input[type=text]").nth(1).fill("val3");

      await getButtonByText(page, "Next").click();
      await getButtonByText(page, "Next").click();
      await getButtonByText(page, "Preview").click();
      await getButtonByText(page, "Complete").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        q2: "2",
        q3: "val3",
        q4: "4",
      });
    });

    test("showPreview and page descriptions", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, {
        pages: [
          {
            name: "page1",
            description: "p1description",
            elements: [
              {
                type: "text",
                name: "question1",
              }
            ],
          },
        ],
        showPreviewBeforeComplete: true
      });
      await getButtonByText(page, "Preview").click();
      const editButtons = await getButtonByText(page, "Edit").count();
      expect(editButtons).toBe(1);
      await getButtonByText(page, "Edit").click();
      await page.locator("input[type=text]").fill("val");
      await getButtonByText(page, "Preview").click();
      await getButtonByText(page, "Complete").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        question1: "val"
      });
    });

    ["singlePage", "questionPerPage"].forEach((mode) => {
      test(`Complete from the preview, questionsOnPageMode: ${mode}`, async ({ page }) => {
        await page.goto(`${url}${framework}`);
        await initSurvey(page, framework, {
          questionsOnPageMode: mode,
          showPreviewBeforeComplete: "showAllQuestions",
          completedHtml: "<h3>Survey is completed</h3>",
          pages: [
            {
              name: "page1",
              elements: [
                { type: "text", name: "first" },
                { type: "text", name: "second" }
              ]
            },
            {
              name: "page2",
              elements: [{ type: "text", name: "third" }]
            }
          ]
        });
        const values = ["1", "2", "3"];
        for (let i = 0; i < values.length; i++) {
          if (mode === "singlePage") {
            await page.locator("input[type=text]").nth(i).fill(values[i]);
          } else {
            await page.locator("input[type=text]").fill(values[i]);
            if (i < values.length - 1) {
              await getButtonByText(page, "Next").click();
            }
          }
        }
        await getButtonByText(page, "Preview").click();
        await expect(getButtonByText(page, "Complete")).toBeVisible();
        await getButtonByText(page, "Complete").click();
        await expect(page.locator(".sd-completedpage h3", { hasText: "Survey is completed" })).toBeVisible();
        const surveyResult = await getSurveyResult(page);
        expect(surveyResult).toEqual({ first: "1", second: "2", third: "3" });
      });
    });
  });
});