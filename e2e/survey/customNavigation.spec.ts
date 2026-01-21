import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "customNavigation";

const setCustomNavigation = async (page) => {
  await page.evaluate(() => {
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
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

    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    const prevButton = document.querySelector("#surveyPrev");
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    const nextButton = document.querySelector("#surveyNext");
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    const completeButton = document.querySelector("#surveyComplete");
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    const progressElement = document.querySelector("#surveyProgress");

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
      elements: [
        {
          type: "checkbox",
          name: "opSystem",
          title: "OS",
          showOtherItem: true,
          isRequired: true,
          choices: ["Windows", "Linux", "Macintosh OSX"]
        }
      ]
    },
    {
      title: "What language(s) are you currently using?",
      elements: [
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
      elements: [
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
      await page.click("button[title=\"forward\"]");
      await firstElement.click();
      await page.click("button[title=\"forward\"]");
      await page.click("button[title=\"back\"]");
      await page.click("button[title=\"forward\"]");
      await page.click("button[title=\"done\"]");
    });

    test("hide standard nav", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      const firstElement = page.locator(".sd-item__decorator").first();

      await firstElement.click();
      await page.click("button[title=\"Next\"]");

      await hideStandardNav(page);

      await expect(page.locator("button[title=Prev]")).not.toBeVisible();
      await expect(page.locator("button[title=Next]")).not.toBeVisible();

      await setCustomNavigation(page);
      await firstElement.click();
      await page.click("#surveyNext");

      await expect(page.locator("button[title=Complete]")).not.toBeVisible();
    });
  });
});