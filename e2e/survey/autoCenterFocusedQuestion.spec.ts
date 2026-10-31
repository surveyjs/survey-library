import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "autoCenterFocusedQuestion";

async function setHostHeight(page, height = "600px") {
  await page.evaluate((h) => {
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    const host = document.getElementById("surveyElement") as HTMLElement;
    if (!host) return;
    host.style.height = h;
    host.style.overflow = "hidden";
    const inner = host.shadowRoot?.querySelector("div") as HTMLElement;
    if (inner) {
      inner.style.height = "100%";
      inner.style.overflow = "hidden";
    }
  }, height);
}

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

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
      await setHostHeight(page);
      const question = page.locator(".sd-question[data-name='q6']");
      await expect(question).toBeVisible();
      await page.evaluate(() => {
        const root = (window as any).survey.rootElement.getRootNode();
        root.querySelector(".sd-question[data-name='q6'] input")?.focus();
      });
      await expect.poll(async () => {
        return await page.evaluate(() => {
          const root = (window as any).survey.rootElement.getRootNode();
          const scroller = root.querySelector(".sd-root-modern--full-container > .sv-scroll__wrapper > .sv-scroll__scroller")
            || root.querySelector(".sv-scroll__scroller");
          const questionEl = root.querySelector(".sd-question[data-name='q6']");
          if (!scroller || !questionEl) return Number.POSITIVE_INFINITY;
          const scrollerBox = scroller.getBoundingClientRect();
          const questionBox = questionEl.getBoundingClientRect();
          const scrollerCenter = scrollerBox.top + scrollerBox.height / 2;
          const questionCenter = questionBox.top + questionBox.height / 2;
          return Math.abs(questionCenter - scrollerCenter);
        });
      }).toBeLessThan(24);
    });
  });
});
