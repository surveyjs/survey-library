import { frameworks, initSurvey, test, expect } from "../helper";

const title = "autoCenterFocusedQuestion";

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Focusing a question centers it in the survey container", async ({ page }) => {
      await initSurvey(page, framework, {
        fitToContainer: true,
        autoFocusFirstQuestion: false,
        elements: Array.from({ length: 12 }, (_, i) => ({
          type: "text",
          name: "q" + (i + 1),
          title: "Question " + (i + 1)
        }))
      }, false, { autoCenterFocusedQuestion: true });
      await page.evaluate(() => {
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        let container: any = document.querySelector("#surveyElement");
        if (container?.shadowRoot) {
          container = container.shadowRoot.querySelector("div");
        }
        if (container) {
          container.style.height = "600px";
        }
      });
      const scroller = page.locator(".sv-scroll__scroller").first();
      const question = page.locator(".sd-question[data-name='q6']");
      await expect(question).toBeVisible();
      await question.locator("input").first().focus();
      await expect.poll(async () => {
        const scrollerBox = await scroller.boundingBox();
        const questionBox = await question.boundingBox();
        if (!scrollerBox || !questionBox) return Number.POSITIVE_INFINITY;
        const scrollerCenter = scrollerBox.y + scrollerBox.height / 2;
        const questionCenter = questionBox.y + questionBox.height / 2;
        return Math.abs(questionCenter - scrollerCenter);
      }).toBeLessThan(24);
    });
  });
});
