import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `loadSurvey`;

const json = {
  surveyId: "5af48e08-a0a5-44a5-83f4-1c90e8e98de1"
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`correct loading`, async t => {
    let surveyResult;

    await t
      .click(`fieldset div:nth-child(2) label input`)
      .click(`fieldset div:nth-child(4) label input`)
      .click(`input[value="Complete"]`);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, {
      langs: ["Javascript", "Python"]
    });
  });
});
