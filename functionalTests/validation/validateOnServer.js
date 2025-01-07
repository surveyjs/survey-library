import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "validateOnServer";
const setupSurvey = ClientFunction(() => {
  window["survey"].onServerValidateQuestions.add(function(survey, options) {
    //options.data contains the data for the current page.
    var countryName = options.data["country"];
    //If the question is empty then do nothing
    if (!countryName) options.complete();
    //call the ajax method
    window["$"].ajax({
      url: "http://127.0.0.1:8080/testCafe/countriesMock.json"
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

const json = {
  questions: [{ type: "text", name: "country", title: "Type a country:" }]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
      await setupSurvey();
    }
  );

  test("check validation", async (t) => {
    const getErrorSpan = Selector("div")
      .withText("The country name 'wombatland' is not in this list: http://services.groupkt.com/country/get/all")
      .with({ timeout: 1000, visibilityCheck: true });
    let surveyResult;

    await t
      .typeText("input[type=\"text\"]", "wombatland")
      .click("input[value=\"Complete\"]")
      .hover(getErrorSpan)
      .typeText("input[type=\"text\"]", "Romania", { replace: true })
      .click("input[value=\"Complete\"]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      country: "Romania"
    });
  });
});
