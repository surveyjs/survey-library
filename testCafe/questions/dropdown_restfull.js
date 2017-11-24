import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { ClientFunction } from "testcafe";
const assert = require("assert");
const title = `dropdown_restfull`;

const json = {
  questions: [
    {
      type: "dropdown",
      name: "country",
      title: "Select the country...",
      isRequired: true,
      choicesByUrl: {
        //url: "http://services.groupkt.com/country/get/all",
        url: "http://127.0.0.1:8080/testCafe/countriesMock.json",
        path: "RestResponse;result",
        valueName: "name"
      }
    }
  ]
};

export const changeValue = ClientFunction(() => {
  var q = survey.getQuestionByName("country");
  q.choicesByUrl.valueName = "alpha2_code";
  q.choicesByUrl.titleName = "name";
  q.choicesByUrl.run();
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`choose empty`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("Please answer the question")
    );
    let position;
    let surveyResult;

    await t.wait(1000).click(`input[value=Complete]`);

    position = await getPosition();
    assert.notEqual(position, -1);

    surveyResult = await getSurveyResult();
    assert.equal(typeof surveyResult, `undefined`);
  });

  test(`choose value`, async t => {
    let surveyResult;

    await t
      .wait(1000)
      .click(`select`)
      .click(`option[value=Cuba]`)
      .click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.country, "Cuba");
  });

  test(`change "value" in the returned json`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("Cuba")
    );
    let position;
    let surveyResult;

    await t.wait(1000);
    await changeValue();

    position = await getPosition();
    assert.notEqual(position, -1);

    await t
      .click(`select`)
      .click(`option[value=CU]`)
      .click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.country, "CU");
  });
});
