import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "customNavigation";

const setCustomNavigation = async (page) => {
  await page.evaluate(() => {
    const surveyElement = document.querySelector("#surveyElement");
    if (!surveyElement) return;

    surveyElement.insertAdjacentHTML(
      "afterend",
      [
        '<div><span id="surveyProgress">Page 1 of 3.</span>',
        '<a id="surveyPrev" href="#" style="display: none;">Prev</a>',
        '<a id="surveyNext" href="#" style="display: inline;">Next</a>',
        '<a id="surveyComplete" href="#" style="display: none;">Complete</a>',
        "</div>"
      ]
        .join()
        .replace(new RegExp(",", "g"), "")
    );

    const prevButton = document.getElementById("surveyPrev");
    const nextButton = document.getElementById("surveyNext");
    const completeButton = document.getElementById("surveyComplete");
    const progressElement = document.getElementById("surveyProgress");

    if (prevButton) {
      prevButton.onclick = function(event) {
        window["survey"].prevPage();
        event?.preventDefault();
      };
    }

    if (nextButton) {
      nextButton.onclick = function(event) {
        window["survey"].nextPage();
        event?.preventDefault();
      };
    }

    if (completeButton) {
      completeButton.onclick = function(event) {
        window["survey"].tryComplete();
        event?.preventDefault();
      };
    }

    window["survey"].showTitle = false;

    window["survey"].onCurrentPageChanged.add(function(sender) {
      setNavigationVisibility(sender);
    });

    function setNavigationVisibility(survey) {
      if (prevButton) {
        prevButton.style.display = !window["survey"].isFirstPage ? "inline" : "none";
      }
      if (nextButton) {
        nextButton.style.display = !window["survey"].isLastPage ? "inline" : "none";
      }
      if (completeButton) {
        completeButton.style.display = window["survey"].isLastPage ? "inline" : "none";
      }
      if (progressElement) {
        progressElement.innerText =
          "Page " +
          (window["survey"].currentPage.visibleIndex + 1) +
          " of " +
          window["survey"].visiblePageCount +
          ".";
      }
    }
  });
};

const changePrevNextCompleteText = async (page) => {
  await page.evaluate(() => {
    window["survey"].pagePrevText = "back";
    window["survey"].pageNextText = "forward";
    window["survey"].completeText = "done";
    window["survey"].render();
  });
};

const hideStandardNav = async (page) => {
  await page.evaluate(() => {
    window["survey"].showNavigationButtons = false;
    window["survey"].render();
  });
};

const json = {
  title: "Software developer survey.",
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

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("set custom navigation", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await setCustomNavigation(page);
      const firstElement = page.locator(".sd-item__decorator").first();

      // Check initial state
      await expect(page.locator("#surveyPrev")).toHaveCSS("display", "none");
      await expect(page.locator("#surveyNext")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyComplete")).toHaveCSS("display", "none");
      await expect(page.locator("#surveyProgress")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyProgress")).toHaveText("Page 1 of 3.");

      // Go to second page
      await firstElement.click();
      await page.click("#surveyNext");

      await expect(page.locator("#surveyPrev")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyNext")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyComplete")).toHaveCSS("display", "none");
      await expect(page.locator("#surveyProgress")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyProgress")).toHaveText("Page 2 of 3.");

      // Go to third page
      await firstElement.click();
      await page.click("#surveyNext");

      await expect(page.locator("#surveyPrev")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyNext")).toHaveCSS("display", "none");
      await expect(page.locator("#surveyComplete")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyProgress")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyProgress")).toHaveText("Page 3 of 3.");

      // Go back to second page
      await page.click("#surveyPrev");

      await expect(page.locator("#surveyPrev")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyNext")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyComplete")).toHaveCSS("display", "none");
      await expect(page.locator("#surveyProgress")).not.toHaveCSS("display", "none");
      await expect(page.locator("#surveyProgress")).toHaveText("Page 2 of 3.");

      // Complete survey
      await page.click("#surveyNext");
      await page.click("#surveyComplete");

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        opSystem: ["Windows"],
        langs: ["Javascript"]
      });
    });

    test("change prev next complete text", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await changePrevNextCompleteText(page);
      const firstElement = page.locator(".sd-item__decorator").first();

      await firstElement.click();
      await page.click("input[value=\"forward\"]");
      await firstElement.click();
      await page.click("input[value=\"forward\"]");
      await page.click("input[value=\"back\"]");
      await page.click("input[value=\"forward\"]");
      await page.click("input[value=\"done\"]");
    });

    test("hide standard nav", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      const firstElement = page.locator(".sd-item__decorator").first();

      await firstElement.click();
      await page.click("input[value=\"Next\"]");

      await hideStandardNav(page);

      await expect(page.locator("input[value=Prev]")).not.toBeVisible();
      await expect(page.locator("input[value=Next]")).not.toBeVisible();

      await setCustomNavigation(page);
      await firstElement.click();
      await page.click("#surveyNext");

      await expect(page.locator("input[value=Complete]")).not.toBeVisible();
    });
  });
});