import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "options";

const json = {
  title: "Software developer survey.",
  headerView: "basic",
  showQuestionNumbers: "on",
  pages: [
    {
      title: "What operating system do you use?",
      questions: [
        {
          type: "checkbox",
          name: "opSystem",
          title: "OS",
          hasOther: true,
          isRequired: true,
          choices: ["Windows", "Linux", "Macintosh OSX"]
        }
      ]
    },
    {
      title: "What language(s) are you currently using?",
      questions: [
        {
          type: "checkbox",
          name: "langs",
          title: "Plese select from the list",
          colCount: 4,
          isRequired: true,
          choices: [
            "Javascript",
            "Java",
            "Python",
            "CSS",
            "PHP",
            "Ruby",
            "C++",
            "C",
            "Shell",
            "C#",
            "Objective-C",
            "R",
            "VimL",
            "Go",
            "Perl",
            "CoffeeScript",
            "TeX",
            "Swift",
            "Scala",
            "Emacs List",
            "Haskell",
            "Lua",
            "Clojure",
            "Matlab",
            "Arduino",
            "Makefile",
            "Groovy",
            "Puppet",
            "Rust",
            "PowerShell"
          ]
        }
      ]
    },
    {
      title: "Please enter your name and e-mail",
      questions: [
        { type: "text", name: "name", title: "Name:" },
        { type: "text", name: "email", title: "Your e-mail" }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
    });

    test("change question required text", async ({ page }) => {
      const requiredElement = page.locator(".sd-question__required-text");
      await expect(requiredElement).toHaveText("*");

      await page.evaluate(() => {
        window["survey"].requiredText = "😱";
        window["survey"].render();
      });

      await expect(requiredElement).toHaveText("😱");
    });

    test("set question numbers on page", async ({ page }) => {
      const questionNumber = page.locator(".sd-element__num");
      const firstElement = page.locator(".sd-item__decorator").first();

      await firstElement.click();
      await page.locator("input[value=\"Next\"]").click();
      await expect(questionNumber).toHaveText("2.");

      await page.evaluate(() => {
        window["survey"].showQuestionNumbers = "onPage";
        window["survey"].render();
      });

      await expect(questionNumber).toHaveText("1.");
    });

    test("set question numbers off", async ({ page }) => {
      const questionNumber = page.locator(".sd-element__num");
      await expect(questionNumber).toHaveText("1.");

      await page.evaluate(() => {
        window["survey"].showQuestionNumbers = "off";
        window["survey"].render();
      });

      await expect(questionNumber).not.toBeVisible();
    });

    test("hide survey title", async ({ page }) => {
      const surveyTitle = page.locator("h3", { hasText: "Software developer survey." });
      await expect(surveyTitle).toBeVisible();

      await page.evaluate(() => {
        window["survey"].showTitle = false;
        window["survey"].render();
      });

      await expect(surveyTitle).not.toBeVisible();
    });

    test("hide page title", async ({ page }) => {
      const pageTitle = page.locator("h4", { hasText: "What operating system do you use?" });
      await expect(pageTitle).toBeVisible();

      await page.evaluate(() => {
        window["survey"].showPageTitles = false;
        window["survey"].render();
      });

      await expect(pageTitle).not.toBeVisible();
    });

    test("show page numbers", async ({ page }) => {
      const pageTitle = page.locator(".sd-page__title");
      const pageTitleText = "What operating system do you use?";
      const firstElement = page.locator(".sd-item__decorator").first();

      await expect(pageTitle).toContainText(pageTitleText);

      await page.evaluate(() => {
        window["survey"].showPageNumbers = true;
        window["survey"].render();
      });

      await expect(pageTitle).toContainText("1. ");
      await expect(pageTitle).toContainText(pageTitleText);

      await firstElement.click();
      await page.locator("input[value=\"Next\"]").click();

      await expect(pageTitle).toContainText("2. ");
      await expect(pageTitle).toContainText("What language(s) are you currently using?");
    });

    test("no progress bar", async ({ page }) => {
      const progressbar = page.locator(".sd-progress").filter({ hasText: "Page" });
      await expect(progressbar).toHaveCount(0);
    });

    test("show top progress bar", async ({ page }) => {
      await page.evaluate(() => {
        window["Survey"].surveyCss.currentType = "";
      });

      const progressbar = page.locator(".sd-progress").filter({ hasText: "Page" });
      await expect(progressbar).toHaveCount(0);

      await page.evaluate(() => {
        window["survey"].showProgressBar = "top";
        window["survey"].render();
      });

      await expect(progressbar).toBeVisible();
      await expect(progressbar).toContainText("Page 1 of 3");

      const progressElement = page.locator(".sd-container-modern .sv-components-column--expandable > .sv-components-column > div");
      await expect(progressElement).toHaveClass(/sd-progress/);
    });

    test("show bottom progress bar", async ({ page }) => {
      await page.evaluate(() => {
        window["Survey"].surveyCss.currentType = "";
      });

      const progressbar = page.locator(".sd-progress").filter({ hasText: "Page" });
      await expect(progressbar).toHaveCount(0);

      await page.evaluate(() => {
        window["survey"].showProgressBar = "bottom";
        window["survey"].render();
      });

      await expect(progressbar).toBeVisible();
      await expect(progressbar).toContainText("Page 1 of 3");

      const progressRootElement = page.locator(".sd-root-modern > .sv-scroll__wrapper > .sv-scroll__scroller > .sv-scroll__container > div > form > .sd-container-modern .sv-components-row ~ div");

      if (framework === "vue") {
        await expect(progressRootElement.locator(".sd-progress")).toBeVisible();
      } else {
        await expect(progressRootElement).toHaveClass(/sd-progress/);
      }
    });

    test("check progress bar page 2", async ({ page }) => {
      await page.evaluate(() => {
        window["Survey"].surveyCss.currentType = "";
      });

      const firstElement = page.locator(".sd-item__decorator").first();
      const progressbar = page.locator(".sd-progress").filter({ hasText: "Page" });
      await expect(progressbar).toHaveCount(0);

      await page.evaluate(() => {
        window["survey"].showProgressBar = "top";
        window["survey"].render();
      });

      await expect(progressbar).toBeVisible();
      await expect(progressbar).toContainText("Page 1 of 3");

      await firstElement.click();
      await page.locator("input[value=\"Next\"]").click();

      await expect(progressbar).toContainText("Page 2 of 3");
    });

    test("set completed html", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].completedHtml = "<h1>Wombat</h1>";
        window["survey"].render();
      });
      const firstElement = page.locator(".sd-item__decorator").first();

      await firstElement.click();
      await page.locator("input[value=\"Next\"]").click();
      await firstElement.click();
      await page.locator("input[value=\"Next\"]").click();
      await page.locator("input[value=\"Complete\"]").click();

      await expect(page.locator(".sd-completedpage h1", { hasText: "Wombat" })).toBeVisible();
    });

    test("check previous", async ({ page }) => {
      const pageTitle = page.locator(".sd-page__title .sv-string-viewer");
      const firstElement = page.locator(".sd-item__decorator").first();

      await firstElement.click();
      await page.locator("input[value=\"Next\"]").click();
      await firstElement.click();
      await page.locator("input[value=\"Next\"]").click();
      await page.locator("input[value=\"Previous\"]").click();
      await page.locator("input[value=\"Previous\"]").click();

      await expect(await pageTitle.textContent()).toBe("What operating system do you use?");
    });
  });
});