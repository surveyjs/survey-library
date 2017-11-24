import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `rating`;

const json = {
  questions: [
    {
      type: "rating",
      name: "satisfaction",
      title: "How satisfied are you with the Product?",
      mininumRateDescription: "Not Satisfied",
      maximumRateDescription: "Completely satisfied"
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`description exists`, async t => {
    const getPositionMin = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("Not Satisfied")
    );
    const getPositionMax = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("Completely satisfied")
    );
    const positionMin = await getPositionMin();
    const positionMax = await getPositionMax();

    assert.notEqual(positionMin, -1);
    assert.notEqual(positionMax, -1);
  });

  test(`choose value`, async t => {
    const label3 = Selector("label").withText("3");
    let surveyResult;

    await t.click(label3).click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();

    assert.deepEqual(surveyResult, {
      satisfaction: "3"
    });
  });
});
