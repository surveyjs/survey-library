import { Page } from "playwright";
import { frameworks, url, initSurvey, getSurveyResult, test, expect } from "../helper";

const title = "validateOnServer";

const setupSurvey = async (page: Page) => {
  await page.evaluate(() => {
    (window as any).survey.onServerValidateQuestions.add(function(survey, options) {
      //options.data contains the data for the current page.
      var countryName = options.data["country"];
      //If the question is empty then do nothing
      if (!countryName) options.complete();
      //call the ajax method
      window["$"].ajax({
        url: "http://127.0.0.1:8080/test-resources/countriesMock.json"
      }).then(function(data) {
        var found = false;
        var countries = data.RestResponse.result;
        for (var i = 0; i < countries.length; i++) {
          if (countries[i].name == countryName) {
            found = true;
            break;
          }
        }
        //if the country is unknown, add the error
        if (!found)
          options.errors["country"] =
            "The country name '" +
            countryName +
            "' is not in this list: http://services.groupkt.com/country/get/all";
        //tell survey that we are done with the server validation
        options.complete();
      });
    });
  });
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("check validation", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      const json = {
        elements: [{ type: "text", name: "country", title: "Type a country:" }]
      };
      await initSurvey(page, framework, json);
      await setupSurvey(page);

      const getErrorSpan = page
        .locator("div")
        .filter({ hasText: "The country name 'wombatland' is not in this list: http://services.groupkt.com/country/get/all" })
        .first();
      let surveyResult;

      await page.locator("input[type=\"text\"]").pressSequentially("wombatland");
      await page.locator("button[title=Complete]").click();
      await getErrorSpan.waitFor({ state: "visible", timeout: 1000 });
      await getErrorSpan.hover();
      await page.locator("input[type=\"text\"]").fill("Romania");
      await page.locator("button[title=Complete]").click();

      surveyResult = await getSurveyResult(page);
      await expect(surveyResult).toEqual({
        country: "Romania"
      });
    });
  });
});

