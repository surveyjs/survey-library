import { frameworks, url, initSurvey, test, expect, getButtonByText } from "../helper";

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

      await expect(page.locator('.sd-question__title:has-text("question1")')).toBeVisible();

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

      await expect(page.locator('.sd-question__title:has-text("question1")')).toBeVisible();
    });

    test("Change questionsOnPageMode", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await page.setViewportSize({ width: 1600, height: 900 });

      await expect(page.locator('.sd-question__title:has-text("question1")')).toBeVisible();

      await page.evaluate(() => {
        window["survey"].questionsOnPageMode = "singlePage";
      });
      await expect(page.locator('.sd-question__title:has-text("question1")')).toBeVisible();

      await page.evaluate(() => {
        window["survey"].questionsOnPageMode = "questionPerPage";
      });
      await expect(page.locator('.sd-question__title:has-text("question1")')).toBeVisible();

      await page.evaluate(() => {
        window["survey"].questionsOnPageMode = "standard";
      });
      await expect(page.locator('.sd-question__title:has-text("question1")')).toBeVisible();
    });

    test("Check matrix fail when showing preview", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1600, height: 900 });
      await initSurvey(page, framework, {
        showPreviewBeforeComplete: true,
        previewMode: "answeredQuestions",
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

      await page.getByRole("button", { name: "Preview" }).click();
      await getButtonByText(page, "Complete").click();
    });
    test("The complete page follows completedHtml through the save flow", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, {
        completedHtml: "<h3>Thank you</h3>",
        elements: [{ type: "text", name: "q1" }]
      });
      await page.evaluate(() => {
        const survey = window["survey"];
        survey.onComplete.add((sender, options) => {
          window["saveOptions"] = options;
          sender.completedHtml = "<h3>Sending your message...</h3>";
          options.showSaveInProgress("Saving");
        });
        survey.registerPropertyChangedHandlers(["completedState"], () => {
          if (survey.completedState === "error") survey.completedHtml = "<h3>Your message has not been saved.</h3>";
        });
      });
      const completedPage = page.locator(".sd-completedpage");

      await getButtonByText(page, "Complete").click();
      await expect(completedPage).toHaveText("Sending your message...");

      await page.evaluate(() => { window["saveOptions"].showSaveError("Error"); });
      await expect(completedPage).toHaveText("Your message has not been saved.");

      await page.evaluate(() => {
        window["survey"].setVariable("responseId", 42);
        window["survey"].completedHtml = "<h3>Saved, Response ID: {responseId}</h3>";
        window["saveOptions"].showSaveSuccess("Success");
      });
      await expect(completedPage).toHaveText("Saved, Response ID: 42");
    });
  });
});