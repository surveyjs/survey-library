import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "navigation";

const json = {
  pages: [
    {
      elements: [
        {
          name: "question4a",
          type: "text",
          title: "Question",
        },
      ]
    }
  ]
};

const tocJson = {
  title: "Survey New Design Test",
  showTOC: true,
  pages: [
    {
      elements: [{
        name: "name",
        type: "text"
      },
      ]
    },
    {
      elements: [
        {
          name: "birthdate",
          type: "text",
          inputType: "date"
        },
      ]
    }
  ]
};

const scrollJson = {
  "title": "Survey Title",
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "comment",
          "name": "question1"
        },
        {
          "type": "comment",
          "name": "question2"
        },
        {
          "type": "comment",
          "name": "question3"
        },
        {
          "type": "comment",
          "name": "question4"
        },
        {
          "type": "comment",
          "name": "question5"
        },
        {
          "type": "comment",
          "name": "question6"
        },
        {
          "type": "comment",
          "name": "question7"
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "comment",
          "name": "question8"
        },
        {
          "type": "comment",
          "name": "question9"
        },
        {
          "type": "comment",
          "name": "question10"
        },
        {
          "type": "comment",
          "name": "question11"
        },
        {
          "type": "comment",
          "name": "question12"
        },
        {
          "type": "comment",
          "name": "question13"
        },
        {
          "type": "comment",
          "name": "question14"
        }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("check disable/enable navigation item", async ({ page }) => {
      await initSurvey(page, framework, json);
      const btnSelector = page.locator("#sv-nav-complete input");
      await expect(btnSelector).not.toHaveAttribute("disabled");
      await page.evaluate(() => {
        window["survey"].navigationBarValue.actions[4].enabled = false;
      });
      await expect(btnSelector).toHaveAttribute("disabled");
      await page.evaluate(() => {
        window["survey"].navigationBarValue.actions[4].enabled = true;
      });
      await expect(btnSelector).not.toHaveAttribute("disabled");
    });

    test("TOC navigation saves entered text https://github.com/surveyjs/survey-library/issues/5870", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, tocJson);
      await page.locator("input[type=text]").fill("some text");
      await page.locator(".sv-string-viewer", { hasText: "page2" }).click();
      await expect(page.locator("input[type=date]")).toBeVisible();
      await page.locator(".sv-string-viewer", { hasText: "page1" }).click();
      await expect(page.locator("input[type=text]")).toHaveValue("some text");
    });

    test("Page should be scrolled to top of survey", async ({ page }) => {
      await initSurvey(page, framework, scrollJson);
      await page.locator("input[value=Next]").scrollIntoViewIfNeeded();
      await page.locator("input[value=Next]").click();
      const headingY = await page.evaluate(() => {
        return document.querySelector("h3")?.getBoundingClientRect().y;
      });
      expect(headingY).toBeGreaterThanOrEqual(0);
    });

    test("Page should be scrolled to top of survey fit to container", async ({ page }) => {
      await initSurvey(page, framework, scrollJson);
      await page.evaluate(() => {
        const container = window.document.getElementById("surveyElement");
        if (container) {
          container.style.position = "fixed";
          container.style.top = "0";
          container.style.bottom = "0";
          container.style.left = "0";
          container.style.right = "0";
        }
        window["survey"].fitToContainer = true;
      });

      await page.locator("input[value=Next]").scrollIntoViewIfNeeded();
      await page.locator("input[value=Next]").click();
      const headingY = await page.evaluate(() => {
        return document.querySelector("h3")?.getBoundingClientRect().y;
      });
      expect(headingY).toBeGreaterThanOrEqual(0);
    });
  });
});