import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `cookie`;
const deleteCookie = ClientFunction(() => {
  survey.deleteCookie();
  survey.clear();
  survey.render();
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

  test(`check works and delete`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf(
        "Thank you for completing the survey!"
      )
    );

    await t.click(`input[type=checkbox]`).click(`input[value=Complete]`);

    await t.navigateTo(`http://surveyjs.io`).navigateTo(url + framework);
    await initSurvey(framework, json);

    assert.notEqual(await getPosition(), -1);

    await deleteCookie();
    await t.hover(`input[type=checkbox]`);

    assert.equal(await getPosition(), -1);
  });
});
