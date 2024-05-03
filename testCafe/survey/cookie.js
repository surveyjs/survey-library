import { frameworks, url, initSurvey } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
const title = "cookie";
const deleteCookie = ClientFunction(() => {
  window["survey"].deleteCookie();
  window["survey"].clear();
  window["survey"].render();
});

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

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("check works and delete", async t => {
    await t
      .click("input[type=checkbox]")
      .click("input[value=Complete]")
      .navigateTo("https://www.google.com")
      .navigateTo(url + framework);
    await initSurvey(framework, json);

    await t.expect(Selector(".sv_body h3").withText("You have already completed this survey.").visible).ok();
    await deleteCookie();
    await t.hover("input[type=checkbox]");

    await t.expect(Selector(".sv_body h3").withText("You have already completed this survey.").exist).notOk();
  });
});
