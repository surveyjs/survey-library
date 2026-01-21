import { frameworks, url, initSurvey, getVisibleListItemByText, getSurveyResult, test, expect } from "../helper";

const title = "component_single_question";
const questionDropdownSelect = ".sd-dropdown";

const json_matrix = {
  elements: [
    {
      type: "matrixdynamic",
      name: "matrix",
      columns: [{ name: "col1", cellType: "newquestion" }],
      rowCount: 1,
    },
  ],
};

const createComponent = async (page) => {
  await page.evaluate(() => {
    window["Survey"].ComponentCollection.Instance.add({
      name: "newquestion",
      questionJSON: {
        type: "dropdown",
        choices: ["a", "b", "c"],
      },
      onAfterRender: (question, htmlElement) => {
        window["newquestion_afterrender"] = question.name;
      }
    });
  });
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Component as a single question", async ({ page }) => {
      await createComponent(page);
      const json_question = {
        elements: [
          {
            type: "newquestion",
            name: "q1"
          },
        ],
      };
      await initSurvey(page, framework, json_question);
      await page.locator(questionDropdownSelect).click();
      await getVisibleListItemByText(page, "b").click();
      await page.locator("button[title=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.q1).toBe("b");
    });

    test("Component as a cell question", async ({ page }) => {
      await createComponent(page);
      await initSurvey(page, framework, json_matrix);
      await page.locator(questionDropdownSelect).click();
      await getVisibleListItemByText(page, "b").click();
      await page.locator("button[title=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.matrix[0].col1).toBe("b");
    });

    test("Component as a cell question & afterRender", async ({ page }) => {
      await createComponent(page);
      await initSurvey(page, framework, json_matrix);

      const getAfterRenderResult = async (page) => {
        return await page.evaluate(() => {
          return window["newquestion_afterrender"];
        });
      };
      const res = await getAfterRenderResult(page);
      expect(res).toBe("col1");
    });
  });
});

