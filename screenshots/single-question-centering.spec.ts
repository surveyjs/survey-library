import { test, expect, Page, Locator } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody } from "../e2e/helper";

const title = "Single question centering";
const root = ".sd-root-modern";

const shortQuestion = {
  type: "text",
  name: "q1",
  title: "Your name"
};

function surveyJson(json: any): any {
  return {
    headerView: "basic",
    questionsOnPageMode: "questionPerPage",
    fitToContainer: true,
    widthMode: "static",
    showQuestionNumbers: false,
    autoFocusFirstQuestion: false,
    ...(json.pages || json.elements ? {} : { elements: [shortQuestion] }),
    ...json
  };
}

async function pinHost(page: Page, height?: number): Promise<void> {
  await page.evaluate((fixedHeight) => {
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    const container = document.querySelector("#surveyElement") as HTMLElement;
    if (fixedHeight) {
      container.style.width = "800px";
      container.style.height = fixedHeight + "px";
    } else {
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.right = "0";
      container.style.bottom = "0";
      container.style.left = "0";
    }
  }, height);
}

async function openSurvey(page: Page, framework: string, json: any, options: { pin?: boolean, height?: number } = {}): Promise<void> {
  await initSurvey(page, framework, surveyJson(json));
  if (options.pin !== false) {
    await pinHost(page, options.height);
  }
  await resetFocusToBody(page);
}

function navButton(page: Page): Locator {
  return page.locator(".sd-navigation__complete-btn, .sd-navigation__next-btn").first();
}

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1000, height: 800 });
    });

    test("short question with page title", async ({ page }) => {
      await openSurvey(page, framework, {
        pages: [{
          name: "page1",
          title: "About you",
          description: "One question on this page",
          elements: [shortQuestion]
        }]
      });
      const rootBox = await page.locator(root).boundingBox();
      const buttonBox = await navButton(page).boundingBox();
      expect(rootBox).toBeTruthy();
      expect(buttonBox).toBeTruthy();
      expect(buttonBox!.y).toBeGreaterThan(rootBox!.y + rootBox!.height * 0.35);
      expect(buttonBox!.y).toBeLessThan(rootBox!.y + rootBox!.height * 0.75);
      await compareScreenshot(page, root, "single-q-short-with-page-title.png");
    });

    test("long question", async ({ page }) => {
      await openSurvey(page, framework, {
        pages: [{
          name: "page1",
          title: "Details",
          elements: [{ type: "comment", name: "story", title: "Tell us more", rows: 20 }]
        }]
      });
      await expect(page.locator("textarea")).toBeVisible();
      const overflows = await page.locator(root).evaluate((el) => {
        const target = el.querySelector(".sv-scroll__scroller") || el;
        return target.scrollHeight > target.clientHeight + 1;
      });
      expect(overflows).toBe(true);
      await compareScreenshot(page, root, "single-q-long.png");
    });

    test("inputPerPage dynamic panel", async ({ page }) => {
      await openSurvey(page, framework, {
        questionsOnPageMode: "inputPerPage",
        elements: [{
          type: "paneldynamic",
          name: "people",
          title: "People",
          panelCount: 1,
          templateElements: [
            { type: "text", name: "name", title: "Name" },
            { type: "text", name: "city", title: "City" }
          ]
        }]
      });
      await compareScreenshot(page, root, "single-q-input-per-page.png");
    });

    test("navigation on top", async ({ page }) => {
      await openSurvey(page, framework, { navigationButtonsLocation: "top" });
      const questionBox = await page.locator(".sd-question").first().boundingBox();
      const buttonBox = await navButton(page).boundingBox();
      expect(buttonBox!.y).toBeLessThan(questionBox!.y);
      expect(questionBox!.y - (buttonBox!.y + buttonBox!.height)).toBeLessThan(80);
      await compareScreenshot(page, root, "single-q-nav-top.png");
    });

    test("navigation hidden", async ({ page }) => {
      await openSurvey(page, framework, { showNavigationButtons: false });
      await expect(page.locator(".sd-navigation__next-btn")).toHaveCount(0);
      await compareScreenshot(page, root, "single-q-nav-hidden.png");
    });

    test("responsive width", async ({ page }) => {
      await openSurvey(page, framework, { widthMode: "responsive" });
      await compareScreenshot(page, root, "single-q-responsive.png");
    });

    test("mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 400, height: 700 });
      await openSurvey(page, framework, {});
      await compareScreenshot(page, root, "single-q-mobile.png");
    });

    test("short question without page title in a fixed-height host", async ({ page }) => {
      await openSurvey(page, framework, {}, { height: 640 });
      const rootBox = await page.locator(root).boundingBox();
      expect(rootBox!.height).toBeGreaterThan(600);
      expect(rootBox!.height).toBeLessThan(680);
      await compareScreenshot(page, root, "single-q-fixed-host.png");
    });

    test("progress, toc and timer stay in place", async ({ page }) => {
      await openSurvey(page, framework, {
        title: "Quiz",
        showProgressBar: true,
        showTOC: true,
        showTimer: true,
        timeLimit: 120,
        pages: [
          { name: "page1", title: "First", elements: [shortQuestion] },
          { name: "page2", title: "Second", elements: [{ type: "text", name: "q2", title: "City" }] }
        ]
      });
      await expect(page.locator(".sd-timer")).toBeVisible();
      await expect(page.locator(".sv_progress-toc")).toBeVisible();
      await compareScreenshot(page, root, "single-q-progress-toc-timer.png", {
        mask: [page.locator(".sd-timer")]
      });
    });

    test("no host height stays top aligned", async ({ page }) => {
      await openSurvey(page, framework, { fitToContainer: false }, { pin: false });
      const rootBox = await page.locator(root).boundingBox();
      const buttonBox = await navButton(page).boundingBox();
      expect(rootBox!.height).toBeLessThan(400);
      expect(buttonBox!.y).toBeLessThan(rootBox!.y + rootBox!.height);
      await compareScreenshot(page, root, "single-q-no-host-height.png");
    });
  });
});
