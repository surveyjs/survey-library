import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "autoCenterFocusedQuestion";

async function setHostHeight(page, height = "600px") {
  await page.evaluate((h) => {
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    let container: any = document.getElementById("surveyElement");
    if (container?.shadowRoot) {
      container = container.shadowRoot.querySelector("div");
    }
    if (container) {
      container.style.height = h;
      container.style.overflow = "hidden";
    }
  }, height);
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Focusing a question centers it in the survey container", async ({ page }) => {
      await setHostHeight(page);
      await initSurvey(page, framework, {
        fitToContainer: true,
        autoFocusFirstQuestion: false,
        elements: Array.from({ length: 12 }, (_, i) => ({
          type: "text",
          name: "q" + (i + 1),
          title: "Question " + (i + 1)
        }))
      }, false, { autoCenterFocusedQuestion: true });
      const scroller = page.locator(".sd-root-modern--full-container > .sv-scroll__wrapper > .sv-scroll__scroller");
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
