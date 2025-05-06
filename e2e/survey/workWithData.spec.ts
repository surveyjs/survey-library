import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "workWithData";

const json = {
  questions: [
    { type: "text", name: "name", title: "Your name:" },
    { type: "text", name: "email", title: "Your e-mail" },
    {
      type: "checkbox",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
      choices: [
        "None",
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen"
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

    test("set data", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].data = {
          name: "John Doe",
          email: "johndoe@nobody.com",
          car: ["Ford"]
        };
      });

      await page.click('input[value="Complete"]');
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        name: "John Doe",
        email: "johndoe@nobody.com",
        car: ["Ford"]
      });
    });

    test("add value changed listener", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].onValueChanged.add(function (sender, options) {
          let divElement = document.body.getElementsByClassName("new-element")[0];
          if (!divElement) {
            divElement = document.createElement("div");
            divElement.className = "new-element";
            document.body.appendChild(divElement);
          }
          divElement.appendChild(document.createTextNode(options.value));
        });
      });

      const firstElement = page.locator(".sd-item__decorator").first();
      const resultElement = page.locator(".new-element");
      await expect(resultElement).toHaveCount(0);

      await page.locator(".sd-row input").first().fill("John Doe");
      await page.keyboard.press("Tab");
      await expect(resultElement).toHaveText("John Doe");

      await firstElement.click();
      await page.keyboard.press("Tab");
      await expect(resultElement).toHaveText("John DoeNone");
    });

    test("set values", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].setValue("name", "Wombat");
        window["survey"].setValue("email", "wo@mbat.com");
        window["survey"].setValue("car", ["BMW", "Ford"]);
      });

      await page.click('input[value="Complete"]');
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        name: "Wombat",
        email: "wo@mbat.com",
        car: ["BMW", "Ford"]
      });
    });

    test("get value", async ({ page }) => {
      await page.evaluate(() => {
        window["survey"].setValue("name", "Wombat");
        window["survey"].setValue("email", "wo@mbat.com");
        window["survey"].setValue("car", ["BMW", "Ford"]);
      });

      await expect(page.locator('.sv-string-viewer:has-text("BMW")')).toBeVisible();
    });
  });
});