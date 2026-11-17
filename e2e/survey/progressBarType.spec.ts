import { frameworks, initSurvey, url, test, expect } from "../helper";
import { Survey } from "../surveyHelper";

const title = "progressBarType";

const json_questions = {
  showProgressBar: true,
  progressBarLocation: "top",
  progressBarType: "questions",
  pages: [
    {
      elements: [
        {
          type: "text",
          isRequired: true,
          inputType: "email",
          name: "q1"
        },
        { type: "text", name: "q2" }
      ]
    },
    {
      elements: [
        { type: "text", isRequired: true, name: "q3" },
        { type: "text", name: "q4" }
      ]
    }
  ]
};

const json_requiredQuestions = {
  showProgressBar: true,
  progressBarLocation: "top",
  progressBarType: "requiredQuestions",
  pages: [
    {
      elements: [
        {
          type: "text",
          isRequired: true,
          inputType: "email",
          name: "q1"
        },
        { type: "text", name: "q2" }
      ]
    },
    {
      elements: [
        { type: "text", isRequired: true, name: "q3" },
        { type: "text", name: "q4" }
      ]
    }
  ]
};

const json_toc = {
  showTOC: true,
  pages: [
    {
      elements: [
        { type: "text", inputType: "email", name: "q1" },
        { type: "text", name: "q2" }
      ]
    },
    {
      elements: [
        { type: "text", isRequired: true, name: "q3" },
        { type: "text", name: "q4" }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test("progressBarType:questions", async ({ page }) => {
      await initSurvey(page, framework, json_questions);

      await expect(page.locator("span").filter({ hasText: "Answered 0/4 questions", visible: true })).toHaveCount(1);
      await page.locator("input[type=email]").fill("stub@gmail.com");
      await page.keyboard.press("Tab");
      await expect(page.locator("span").filter({ hasText: "Answered 1/4 questions", visible: true })).toHaveCount(1);
    });

    test("progressBarType:requiredQuestions", async ({ page }) => {
      await initSurvey(page, framework, json_requiredQuestions);

      await expect(page.locator("span").filter({ hasText: "Answered 0/2 questions", visible: true })).toHaveCount(1);
      await page.locator("input[type=email]").fill("stub@gmail.com");
      await page.keyboard.press("Tab");
      await expect(page.locator("span").filter({ hasText: "Answered 1/2 questions", visible: true })).toHaveCount(1);
    });

    test("navigation:toc", async ({ page }) => {
      await initSurvey(page, framework, json_toc);

      const page1 = page.locator(".sv-list__item-body").filter({ hasText: "page1" });
      const page2 = page.locator(".sv-list__item-body").filter({ hasText: "page2" });

      await expect(page1).toBeVisible();
      await expect(page2).toBeVisible();
      await page2.click();
      await expect(page.locator("div[id$=ariaTitle][id^=sq]").filter({ hasText: "q3" })).toBeVisible();
    });

    test("progressBarType:questions, the bar width follows the progress after a value is set in onAfterRenderPage", async ({ page }) => {
      const json = {
        showProgressBar: "top",
        progressBarType: "questions",
        pages: [
          { name: "p1", elements: [{ type: "text", name: "a" }, { type: "text", name: "b" }] },
          { name: "p2", elements: [{ type: "text", name: "c" }, { type: "text", name: "d" }] }
        ]
      };
      await initSurvey(page, framework, json, false, undefined, async () => {
        await page.evaluate(() => {
          const survey = (window as any).survey;
          const pagesShown: Array<string> = [];
          survey.onAfterRenderPage.add((sender, options) => {
            pagesShown.push(options.page.name);
            sender.setValue("pagesShown", [].concat(pagesShown));
          });
        });
      });
      const progressBar = page.locator("[role=progressbar]");
      const answer = async (name: string) => {
        await page.getByRole("textbox", { name: name }).fill("x");
        await page.keyboard.press("Tab");
      };

      await answer("a");
      await answer("b");
      await expect(progressBar).toHaveAttribute("style", /width: 50%/);
      await new Survey(page).nextPage();
      await answer("c");
      await expect(page.locator("span").filter({ hasText: "Answered 3/4 questions", visible: true })).toHaveCount(1);
      await expect(progressBar).toHaveAttribute("style", /width: 75%/);
      await answer("d");
      await expect(progressBar).toHaveAttribute("style", /width: 100%/);
    });
  });
});