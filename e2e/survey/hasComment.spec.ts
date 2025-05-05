import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "hasComment";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Enter and clear commment", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [
          {
            type: "checkbox",
            name: "q1",
            hasComment: true,
            choices: ["item1", "item2"]
          }
        ]
      };
      await initSurvey(page, framework, json);

      const textarea = page.locator("textarea");

      // Enter comment
      await textarea.fill("01234 56789");
      await textarea.press("Tab");

      // Verify comment is set
      const comment = await page.evaluate(() => {
        return window["survey"].getAllQuestions()[0].comment;
      });
      expect(comment).toBe("01234 56789");

      // Clear value
      await page.evaluate(() => {
        window["survey"].clearValue("q1");
      });

      // Verify comment is cleared
      const clearedComment = await page.evaluate(() => {
        return window["survey"].getAllQuestions()[0].comment;
      });
      expect(clearedComment).toBe("");
      expect(await textarea.inputValue()).toBe("");
    });
  });
});