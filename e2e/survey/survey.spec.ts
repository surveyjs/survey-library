import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "Survey";

const json = {
  questionsOnPageMode: "questionPerPage",
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "radiogroup",
          name: "question1",
          choices: ["Item 1", "Item 2", "Item 3"]
        }
      ]
    },
    {
      name: "page2",
      elements: [
        {
          type: "radiogroup",
          name: "question2",
          choices: ["Item 1", "Item 2", "Item 3"]
        }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Update survey via fromJSON", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1600, height: 900 });

      await expect(page.locator('.sv-title-actions__title:has-text("question1")')).toBeVisible();

      await page.evaluate(() => {
        window["survey"].data = { question1: "Item 1" };
        const newJson = {
          pages: [
            {
              name: "page1",
              elements: [
                {
                  type: "radiogroup",
                  isRequired: true,
                  name: "question1",
                  choices: ["Item 1", "Item 2", "Item 3"]
                }
              ]
            }
          ]
        };
        window["survey"].fromJSON(newJson);
      });

      await expect(page.locator('.sv-title-actions__title:has-text("question1")')).toBeVisible();
    });

    test("Change questionsOnPageMode", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1600, height: 900 });

      await expect(page.locator('.sv-title-actions__title:has-text("question1")')).toBeVisible();

      await page.evaluate(() => {
        window["survey"].questionsOnPageMode = "singlePage";
      });
      await expect(page.locator('.sv-title-actions__title:has-text("question1")')).toBeVisible();

      await page.evaluate(() => {
        window["survey"].questionsOnPageMode = "questionPerPage";
      });
      await expect(page.locator('.sv-title-actions__title:has-text("question1")')).toBeVisible();

      await page.evaluate(() => {
        window["survey"].questionsOnPageMode = "standard";
      });
      await expect(page.locator('.sv-title-actions__title:has-text("question1")')).toBeVisible();
    });

    test("Check matrix fail when showing preview", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1600, height: 900 });
      await initSurvey(page, framework, {
        showPreviewBeforeComplete: "showAnsweredQuestions",
        elements: [
          {
            type: "matrixdropdown",
            name: "framework-ratings",
            title: "Please leave your feedback about JavaScript frameworks",
            columnMinWidth: "130px",
            columns: [
              {
                name: "usage",
                title: "Do you use the framework?",
                cellType: "radiogroup",
                choices: ["Yes", "No"],
                defaultValue: "Yes",
              },
              {
                name: "experience",
                title: "How long have you used it?",
                choices: [
                  { text: "3-5 years", value: 4 },
                  { text: "1-2 years", value: 1.5 },
                  { text: "Less than a year", value: 0.5 },
                ],
                enableIf: "{row.usage} = 'Yes'",
              },
              {
                name: "strengths",
                title: "Which are the framework's main strengths?",
                cellType: "checkbox",
                choices: [
                  "Scalability",
                  "Performance",
                  "Complete functionality",
                  "Learning materials",
                  "Strong community",
                ],
                colCount: 1,
                enableIf: "{row.usage} = 'Yes'",
              },
              {
                name: "free-form-feedback",
                title: "Describe what you like and dislike about the framework",
                cellType: "comment",
                enableIf: "{row.usage} = 'Yes'",
              },
              {
                name: "rating",
                title: "Rate your experience with the framework",
                cellType: "rating",
                rateValues: [
                  { text: "Excelent", value: 5 },
                  { text: "Good", value: 4 },
                  { text: "Average", value: 3 },
                  { text: "Fair", value: 2 },
                  { text: "Poor", value: 1 },
                ],
                displayMode: "dropdown",
                enableIf: "{row.usage} = 'Yes'",
              },
            ],
            rows: [
              { text: "Angular", value: "angular" },
              { text: "React", value: "react" },
              { text: "Vue.js", value: "vue" },
            ],
            transposeData: true,
          },
        ],
        showQuestionNumbers: false,
      });

      await page.click("#sv-nav-preview input");
      await page.click("#sv-nav-complete input");
    });
  });
});