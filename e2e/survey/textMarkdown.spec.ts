import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "Test survey width";

const json = {
  elements: [
    {
      type: "checkbox",
      name: "question1",
      choices: [
        { value: 1, text: "|item 1|" },
        { value: 2, text: "|item 2|" },
        { value: 3, text: "|item 3|" }
      ]
    },
    {
      type: "dropdown",
      placeHolder: "Click me",
      name: "question2",
      searchEnabled: false,
      choices: [
        { value: 1, text: "|choice 1|" },
        { value: 2, text: "|choice 2|" },
        { value: 3, text: "|choice 3|" }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {

    test("Check Text Markdown on checkbox", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onTextMarkdown.add((_, options) => {
          if (options.text.indexOf("|") > -1) {
            options.html = "<span class='markdownclass'>" + options.text.replace(/\|/g, "*") + "</span>";
          }
        });
        window["survey"].fromJSON(json);
      }, json);

      await page.locator(".markdownclass", { hasText: "*item 2*" }).click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.question1).toEqual([2]);
    });

    test("Check Text Markdown on dropdown", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onTextMarkdown.add((_, options) => {
          if (options.text.indexOf("|") > -1) {
            options.html = "<span class='markdownclass'>" + options.text.replace(/\|/g, "*") + "</span>";
          }
        });
        window["survey"].fromJSON(json);
      }, json);

      const questionValueText = page.locator(".sd-dropdown__value .sv-string-viewer");
      const questionDropdownSelect = page.locator(".sd-dropdown");

      await questionDropdownSelect.click();
      await page.locator(".markdownclass", { hasText: "*choice 3*" }).click();
      await expect(questionValueText).toHaveText("*choice 3*");

      await questionDropdownSelect.click();
      await page.locator(".markdownclass", { hasText: "*choice 2*" }).click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.question2).toEqual(2);
    });

    test("Check link inside description is clickable", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json2 = {
        elements: [
          {
            type: "text",
            title: "Title",
            name: "q1",
            description: "<a class='test-link' href='/test'>Click</a>"
          }
        ]
      };
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onTextMarkdown.add((_, options) => {
          options.html = options.text;
        });
        window["survey"].fromJSON(json);
      }, json2);

      await page.locator(".test-link").click();
      expect(page.url()).toContain("/test");
    });
  });
});