import { frameworks, url, initSurvey, getSurveyResult, visibleInViewport, test, expect } from "../helper";

const title = "matrixdropdown";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("choose several values", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        questions: [
          {
            type: "matrixdropdown",
            name: "frameworksRate",
            title: "Please tells us your opinion about JavaScript MVVM frameworks",
            choices: ["Excelent", "Good", "Average", "Fair", "Poor"],
            columns: [
              {
                name: "using",
                title: "Do you use it?",
                choices: ["Yes", "No"],
                cellType: "radiogroup"
              },
              {
                name: "experience",
                title: "How long do you use it?",
                cellType: "dropdown",
                choices: [
                  { value: 5, text: "3-5 years" },
                  { value: 2, text: "1-2 years" },
                  {
                    value: 1,
                    text: "less than a year"
                  }
                ]
              },
              {
                name: "strength",
                title: "What is main strength?",
                choices: ["Easy", "Compact", "Fast", "Powerfull"],
                cellType: "checkbox"
              },
              {
                name: "knowledge",
                title: "Please describe your experience",
                cellType: "text"
              },
              { name: "rate", title: "Please rate the framework itself" }
            ],
            rows: [
              { value: "angularv1", text: "angularjs v1.x" },
              { value: "angularv2", text: "angularjs v2" },
              { value: "knockoutjs" },
              { value: "reactjs" }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);

      // answer for row 1
      await page.getByLabel("row angularjs v1.x, column Do").locator("label").filter({ hasText: "Yes" }).locator("span").first().click();
      await page.getByRole("combobox", { name: "row angularjs v1.x, column" }).first().click();
      await page.locator(".sv-list__item").filter({ hasText: "2", visible: true }).click();
      await page.mouse.click(1, 1);
      await page.getByLabel("row angularjs v1.x, column What is main strength?").getByText("Fast").click();
      await page.getByRole("textbox", { name: "row angularjs v1.x, column" }).fill("why hello world so hard");
      await page.getByRole("combobox", { name: "row angularjs v1.x, column" }).nth(2).click();
      await page.locator(".sv-list__item").filter({ hasText: "Excelent" }).click();
      await page.mouse.click(1, 1);

      // answer for row 3
      await page.getByLabel("row knockoutjs, column Do you").locator("label").filter({ hasText: "No" }).locator("span").first().click();
      await page.getByRole("combobox", { name: "row knockoutjs, column How" }).first().click();
      await page.locator(".sv-list__item").filter({ hasText: "5", visible: true }).click();
      await page.mouse.click(1, 1);
      await page.getByLabel("row knockoutjs, column What").getByText("Easy").click();
      await page.getByLabel("row knockoutjs, column What").getByText("Powerfull").click();
      await page.getByRole("textbox", { name: "row knockoutjs, column Please" }).fill("it is not 2016");
      await page.getByRole("combobox", { name: "row knockoutjs, column Please" }).first().click();
      await page.locator(".sv-list__item").filter({ hasText: "Good", visible: true }).click();

      await page.click("input[value=Complete]");
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        frameworksRate: {
          angularv1: {
            using: "Yes",
            experience: 2,
            strength: ["Fast"],
            knowledge: "why hello world so hard",
            rate: "Excelent"
          },
          knockoutjs: {
            using: "No",
            experience: 5,
            strength: ["Easy", "Powerfull"],
            knowledge: "it is not 2016",
            rate: "Good"
          }
        }
      });
    });

    test("Column requiredIf and vertical layout", async ({ page }) => {
      await page.goto(`${url}${framework}`);

      const json2 = {
        "focusFirstQuestionAutomatic": true,
        "elements": [{
          "type": "radiogroup",
          "name": "question2",
          "defaultValue": "Item1",
          "choices": [
            "Item1",
            "Item2",
            "Item3"
          ]
        },
        {
          "type": "matrixdropdown",
          "name": "question1",
          "columns": [
            {
              "name": "Column 1",
              "cellType": "text",
              "requiredIf": "{question2} = 'Item1'"
            }
          ],
          "columnLayout": "vertical",
          "rows": [
            "Row 1",
            "Row 2"
          ]
        }]
      };
      await initSurvey(page, framework, json2);

      const requiredSpan = page.locator("span").filter({ hasText: "*", visible: true });
      await expect(requiredSpan).toHaveCount(1);
      await page.keyboard.press("ArrowDown");
      await expect(requiredSpan).toHaveCount(0);
      await page.keyboard.press("ArrowUp");
      await expect(requiredSpan).toHaveCount(1);
    });

    test("Make a horizontal scroll to show a column with an error", async ({ page }) => {
      await page.goto(`${url}${framework}`);

      const json3 = {
        elements: [
          {
            type: "matrixdropdown",
            name: "question1",
            columns: [
              { name: "Column 1" },
              { name: "Column 2" },
              { name: "Column 3" },
              { name: "Column 4" },
              { name: "Column 5" },
              { name: "Column 6" },
              { name: "Column 7" },
              { name: "Column 8" },
              { name: "Column 9" },
              { name: "Column 10", isRequired: true }
            ],
            choices: [1, 2, 3, 4, 5],
            rows: ["Row 1", "Row 2"]
          }
        ]
      };
      await initSurvey(page, framework, json3);

      await page.click("input[value=Complete]");
      const requiredSpan = page.locator("span").filter({ hasText: "Response required." }).first();
      let elementVisisbleInViewPort = await visibleInViewport(page, requiredSpan);
      await expect(elementVisisbleInViewPort).toBeTruthy();
    });
  });
});