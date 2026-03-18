import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "Lazy rendering";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Skeleton rendered", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await expect(page.locator("#surveyElement")).toHaveCount(1);

      // Enable lazy rendering
      await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        const container = document.getElementById("surveyElement") as HTMLDivElement;
        container.style.height = "500px";
        container.style.overflow = "auto";
        window["Survey"].settings.lazyRender.enabled = true;
      });

      const json = { elements: <Array<any>>[] };
      // Add questions
      for (var i = 0; i < 50; i++) {
        json.elements.push({
          type: "radiogroup",
          name: "q" + (i + 1),
          choices: ["item1", "item2", "item3"],
        });
      }
      await initSurvey(page, framework, json);

      // Set question IDs and render
      await page.evaluate(() => {
        window["survey"].getAllQuestions().forEach((q, i) => {
          q.id = "my_id_" + (i + 1);
        });
        window["survey"].render("surveyElement");
      });

      // Check skeleton elements
      await expect(page.locator(".sv-skeleton-element")).toHaveCount(47);
      await expect(page.locator(".sv-skeleton-element").nth(46)).toHaveAttribute("id", "my_id_50");
      await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        let container = document.getElementById("surveyElement");
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        let scrollContainer = document.querySelector(".sv-scroll__scroller");
        if (container && !!container.shadowRoot) {
          scrollContainer = container;
        }
        if (!scrollContainer) return;
        scrollContainer.scrollTop = 1000;
      });
      await page.waitForTimeout(1000);
      const count1 = await page.locator(".sv-skeleton-element").count();
      expect(count1).toBeLessThan(44);
      // Disable lazy rendering
      await page.evaluate(() => {
        window["Survey"].settings.lazyRender.enabled = false;
      });
    });
    test("Focus not rendered yet question in matrix cell", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await expect(page.locator("#surveyElement")).toHaveCount(1);

      // Enable lazy rendering
      await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        const container = document.getElementById("surveyElement") as HTMLDivElement;
        container.style.height = "500px";
        container.style.overflow = "auto";
        window["Survey"].settings.lazyRender.enabled = true;
      });

      const json = {
        "showNavigationButtons": "both",
        "pages": [
          {
            "name": "page2",
            "elements": [
              {
                "type": "radiogroup",
                "name": "question10",
                "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
                ]
              },
              {
                "type": "slider",
                "name": "question11"
              },
              {
                "type": "checkbox",
                "name": "question12",
                "choices": [
                  "Item 1",
                  "Item 2",
                  "Item 3"
                ]
              }
            ]
          },
          {
            "name": "page1",
            "elements": [
              {
                "type": "text",
                "name": "question1",
                "isRequired": true
              },
              {
                "type": "text",
                "name": "question2",
                "isRequired": true
              },
              {
                "type": "text",
                "name": "question3",
                "isRequired": true
              },
              {
                "type": "text",
                "name": "question4",
                "isRequired": true
              },
              {
                "type": "text",
                "name": "question5",
                "isRequired": true
              },
              {
                "type": "text",
                "name": "question6",
                "isRequired": true
              },
              {
                "type": "text",
                "name": "question7",
                "isRequired": true
              },
              {
                "type": "text",
                "name": "question8",
                "isRequired": true
              },
              {
                "type": "matrixdropdown",
                "name": "question9",
                "columns": [
                  {
                    "name": "Column 1",
                    "isRequired": true
                  },
                  {
                    "name": "Column 2",
                    "isRequired": true
                  },
                  {
                    "name": "Column 3",
                    "isRequired": true
                  }
                ],
                "choices": [
                  1,
                  2,
                  3,
                  4,
                  5
                ],
                "cellType": "text",
                "rows": [
                  "Row 1",
                  "Row 2"
                ]
              }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);

      await page.evaluate(() => {
        window["survey"].addNavigationItem({
          id: "validate-survey",
          title: "Focus a Cell",
          action: () => {
            const matrix = window["survey"].getQuestionByName("question9");
            const cellQuestion = matrix.visibleRows[1].getQuestionByName("Column 2");
            cellQuestion.focus();
          },
        });
        window["survey"].render("surveyElement");
      });

      const focusCellButton = page.getByRole("button", { name: "Focus a Cell" }).first();
      const nextButton = page.getByRole("button", { name: "Next" }).first();
      const cellTextbox = page.getByRole("textbox", { name: "row Row 2, column Column 2" });

      await expect(nextButton).toBeVisible();
      await nextButton.click();
      await expect(focusCellButton).toBeVisible();
      // let count = await page.locator(".sv-skeleton-element").count();
      // expect(count).toBeGreaterThan(0);
      await focusCellButton.click();
      await page.waitForTimeout(1000);
      // count = await page.locator(".sv-skeleton-element").count();
      await expect(cellTextbox).toBeVisible();
      await expect(cellTextbox).toBeFocused();
      // expect(count).toBe(0);
    });
  });
});