import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "autoNextPage";

const json = {
  focusFirstQuestionAutomatic: true,
  title: "American History",
  showProgressBar: "bottom",
  goNextPageAutomatic: true,
  pages: [
    {
      elements: [
        {
          type: "radiogroup",
          name: "civilwar",
          title: "When was the Civil War?",
          choices: [
            "1750-1800",
            "1800-1850",
            "1850-1900",
            "1900-1950",
            "after 1950"
          ]
        }
      ]
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "libertyordeath",
          title: "Who said 'Give me liberty or give me death?'",
          choices: [
            "John Hancock",
            "James Madison",
            "Patrick Henry",
            "Samuel Adams"
          ]
        }
      ]
    },
    {
      elements: [
        {
          type: "radiogroup",
          name: "magnacarta",
          title: "What is the Magna Carta?",
          choices: [
            "The foundation of the British parliamentary system",
            "The Great Seal of the monarchs of England",
            "The French Declaration of the Rights of Man",
            "The charter signed by the Pilgrims on the Mayflower"
          ]
        }
      ]
    }
  ],
  completedHtml:
    "<p>Your anwers are:</p><p>When was the Civil War?: <b>{civilwar}</b>. The correct is: <b>1850-1900</b></p><p>Who said 'Give me liberty or give me death?': <b>{libertyordeath}</b>. The correct is: <b>Patrick Henry</b></p><p>What is the Magna Carta?: <b>{magnacarta}</b>. The correct is: <b>The foundation of the British parliamentary system</b></p>"
};

const json2 = {
  focusFirstQuestionAutomatic: true,
  goNextPageAutomatic: true,
  pages: [
    {
      elements: [
        {
          type: "matrix",
          name: "q1",
          columns: [1, 2, 3],
          rows: ["A", "B", "C"]
        }
      ]
    }
  ]
};

const json3 = {
  focusFirstQuestionAutomatic: true,
  goNextPageAutomatic: true,
  pages: [
    {
      elements: [
        {
          type: "rating",
          name: "q1"
        }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("check auto next page", async ({ page }) => {
      await initSurvey(page, framework, json);
      const firstRadioElement = page.locator(".sd-radio__decorator").first();
      const progressText = page.locator(".sd-progress-buttons__page-title");

      let text = "Page 1 of 3";
      expect(await progressText.textContent()).toBe(text);
      await firstRadioElement.click();
      await page.waitForTimeout(500);
      text = "Page 2 of 3";
      expect(await progressText.textContent()).toBe(text);

      await firstRadioElement.click();
      await page.waitForTimeout(500);
      text = "Page 3 of 3";
      expect(await progressText.textContent()).toBe(text);

      await firstRadioElement.click();
      await page.waitForTimeout(500);

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        civilwar: "1750-1800",
        libertyordeath: "John Hancock",
        magnacarta: "The foundation of the British parliamentary system"
      });
    });

    test("check auto next page with keyboard", async ({ page }) => {
      await initSurvey(page, framework, json);

      const progressText = page.locator(".sd-progress-buttons__page-title");
      let text = "Page 1 of 3";
      expect(await progressText.textContent()).toBe(text);

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      text = "Page 2 of 3";
      expect(await progressText.textContent()).toBe(text);
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      text = "Page 3 of 3";
      expect(await progressText.textContent()).toBe(text);
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        civilwar: "1800-1850",
        libertyordeath: "James Madison",
        magnacarta: "The Great Seal of the monarchs of England"
      });
    });

    test("check auto next page with matrix", async ({ page }) => {
      await initSurvey(page, framework, json2);
      await page.locator("tr").filter({ hasText: "A" }).locator("span").nth(1).click();
      await page.waitForTimeout(500);
      await page.locator("tr").filter({ hasText: "B" }).locator("span").nth(2).click();
      await page.waitForTimeout(500);
      await page.locator("tr").filter({ hasText: "C" }).locator("span").nth(3).click();
      await page.waitForTimeout(500);

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.q1).toEqual({ A: 1, B: 2, C: 3 });
    });

    test("check auto next page with matrix + keyboard", async ({ page }) => {
      await initSurvey(page, framework, json2);
      await page.waitForTimeout(500);
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Tab");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.q1).toEqual({ A: 1, B: 2, C: 3 });
    });

    test("check auto next page with rating", async ({ page }) => {
      await initSurvey(page, framework, json3);
      const label3 = page.locator("label", { hasText: "3" });
      await label3.click();
      await page.waitForTimeout(500);

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.q1).toBe(3);
    });

    test("check auto next page with rating + keyboard", async ({ page }) => {
      await initSurvey(page, framework, json3);
      await page.waitForTimeout(500);
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.q1).toBe(3);
    });
  });
});