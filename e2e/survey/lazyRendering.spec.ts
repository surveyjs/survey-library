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
  });
});