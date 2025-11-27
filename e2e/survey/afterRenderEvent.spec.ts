import { Page } from "playwright";
import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "afterRenderQuestionEvent";

async function checkResizeObserverExists(page: Page, modelName: string) {
  return await page.evaluate((modelName) => {
    return !!(window as any)[modelName].resizeObserver;
  }, modelName);
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("afterRender is not fired when questions are lazy rendered", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.evaluate(() => {
        (window as any).Survey.settings.lazyRowsRendering = true;
      });
      const json = {
        pages: [
          {
            name: "page1",
            title: "page one",
            elements: [
              { type: "radiogroup", name: "q1", choices: ["1", "2", "3"], },
              { type: "text", visibleIf: "{q1} = '1'", name: "q2", isRequired: true, },
              { type: "text", name: "q3", },
              { type: "text", name: "q4", }
            ],
          },
        ],
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        (window as any).survey.onAfterRenderQuestion.add((_, options) => {
          options.htmlElement.setAttribute("test", "true");
        });
        (window as any).survey.fromJSON(json);
      }, json);

      await page.locator("label").first().click();
      await expect(page.locator("div[data-name='q1']")).toHaveAttribute("test", "true");
      await expect(page.locator("div[data-name='q2']")).toHaveAttribute("test", "true");
      await expect(page.locator("div[data-name='q3']")).toHaveAttribute("test", "true");
      await expect(page.locator("div[data-name='q4']")).toHaveAttribute("test", "true");
    });

    test("afterRenderQuestion fires for initially hidden questions", async ({ page }) => {
      const yesChoiceSelector = page.locator("label").filter({ hasText: "Yes" }).locator("span").first();

      const json = {
        pages: [
          {
            elements: [
              {
                name: "question4a",
                type: "radiogroup",
                title: "4 (a) question 4a ",
                choices: [
                  { text: "Yes", value: "valueYes", },
                  { text: "No", value: "valueNo", },],
              },
              {
                name: "question4b",
                visibleIf: "{question4a} = 'valueYes'",
                type: "radiogroup",
                title: "4 (b) Test question 4b",
                choices: [
                  { text: "Yes", value: "BA17018_02_01", },
                  { text: "No", value: "BA17018_02_02", },
                ],
              },
            ],
            name: "sectionTest",
          },
        ],
        title: "Test Sample",
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        (window as any).survey.onAfterRenderQuestion.add((_, options) => {
          if (options.question.name == "question4a") {
            var title = options.htmlElement.querySelector("input[value='valueYes']");
            title.style.color = "tomato";
          }
          if (options.question.name == "question4b") {
            options.htmlElement.style.border = "1px solid #CCC";
          }
        });
        (window as any).survey.fromJSON(json);
      }, json);

      const questionSelector = page.locator(".sd-question");

      await expect(questionSelector).toHaveCount(1);
      await yesChoiceSelector.click();

      await expect(questionSelector).toHaveCount(2);
      await expect(page.locator("input[value='valueYes']")).toHaveCSS("color", "rgb(255, 99, 71)");
      await expect(questionSelector.nth(1)).toHaveCSS("border-top-color", "rgb(204, 204, 204)");
      await expect(questionSelector.nth(1)).toHaveCSS("border-top-style", "solid");
      await expect(questionSelector.nth(1)).toHaveCSS("border-top-width", "1px");
    });

    if (framework === "angular" || framework === "react") {
      test("Check that survey calls afterRender if model changed", async ({ page }) => {
        await page.evaluate((framework) => {
          if (framework === "react") {
            const surveyElement = document.getElementById("surveyElement");
            if (surveyElement) {
              surveyElement.innerHTML = "";

              const App = () => {
                const [survey, setSurvey] = (window as any)["React"].useState(undefined);
                (window as any).setSurvey = setSurvey;

                if (!!survey) {
                  return (window as any)["React"].createElement(
                    (window as any)["SurveyReact"].Survey,
                    { model: survey }
                  );
                } else {
                  return null;
                }
              };

              const root = (window as any)["ReactDOMClient"].createRoot(surveyElement);
              root.render((window as any)["React"].createElement(App));
            }
          }
        }, framework);
        await page.evaluate(() => {
          (window as any).model1 = new (window as any).Survey.Model({});
          (window as any).setSurvey((window as any).model1);
        });
        expect(await checkResizeObserverExists(page, "model1")).toBeTruthy();

        await page.evaluate(() => {
          (window as any).model2 = new (window as any).Survey.Model({});
          (window as any).setSurvey((window as any).model2);
        });
        expect(await checkResizeObserverExists(page, "model1")).toBeFalsy();
        expect(await checkResizeObserverExists(page, "model2")).toBeTruthy();
      });
    }
  });
});