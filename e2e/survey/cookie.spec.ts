import { frameworks, url, initSurvey, test, expect } from "../helper";

const title = "cookie";

const deleteCookie = async (page) => {
  await page.evaluate(() => {
    window["survey"].deleteCookie();
    window["survey"].clear();
    window["survey"].render();
  });
};

const json = {
  cookieName: "myuniquesurveyid",
  questions: [
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

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check works and delete", async ({ page }) => {
      const firstElement = page.locator(".sd-item__decorator").first();
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      await firstElement.click();
      await page.click("input[value=Complete]");
      await page.goto("about:blank");
      await page.goto(`${url}${framework}`);
      await initSurvey(page, framework, json);

      await expect(page.locator(".sd-body h3").getByText("You have already completed this survey.")).toBeVisible();
      await deleteCookie(page);
      await firstElement.hover();

      await expect(page.locator(".sd-body h3").getByText("You have already completed this survey.")).not.toBeVisible();
    });
  });
});