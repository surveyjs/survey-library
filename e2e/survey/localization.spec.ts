import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "localization";

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
        },
        {
          type: "dropdown",
          name: "q1",
          choices: [
            { value: 1, text: { default: "en1", de: "de1", fr: "fr1" } },
            { value: 2, text: { default: "en2", de: "de2", fr: "fr2" } }
          ]
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
    test("next", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        window["survey"].locale = "ru";
      });
      await page.hover('input[value="Далее"]');

      await page.evaluate(() => {
        window["survey"].locale = "en";
      });
      await page.hover('input[value="Next"]');

      await page.evaluate(() => {
        window["survey"].locale = "de";
      });
      await page.hover('input[value="Weiter"]');

      await page.evaluate(() => {
        window["survey"].locale = "fi";
      });
      await page.hover('input[value="Seuraava"]');

      await page.evaluate(() => {
        window["survey"].locale = "fr";
      });
      await page.hover('input[value="Suivant"]');
    });

    test("check dropdown localization", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);
      const questionDropdownSelect = page.locator(".sd-dropdown");

      await questionDropdownSelect.click();
      await expect(page.getByTitle("en1")).toBeVisible();
      await expect(page.getByTitle("en2")).toBeVisible();
      await page.getByTitle("en1").click();

      await page.evaluate(() => {
        window["survey"].locale = "de";
      });
      await questionDropdownSelect.click();
      await expect(page.getByTitle("de1")).toBeVisible();
      await expect(page.getByTitle("de2")).toBeVisible();
      await page.getByTitle("de2").click();

      await page.evaluate(() => {
        window["survey"].locale = "fr";
      });
      await questionDropdownSelect.click();
      await expect(page.getByTitle("fr1")).toBeVisible();
      await expect(page.getByTitle("fr2")).toBeVisible();
      await page.getByTitle("fr1").click();

      await page.evaluate(() => {
        window["survey"].locale = "en";
      });
      await questionDropdownSelect.click();
      await expect(page.getByTitle("en1")).toBeVisible();
      await expect(page.getByTitle("en2")).toBeVisible();
      await page.getByTitle("en2").click();
    });
  });
});