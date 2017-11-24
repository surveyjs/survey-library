import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `multipletext`;

const json = {
  questions: [
    {
      type: "multipletext",
      name: "pricelimit",
      title: "What is the... ",
      colCount: 2,
      items: [
        {
          name: "mostamount",
          title: "Most amount you would every pay for a product like ours"
        },
        {
          name: "leastamount",
          title: "The least amount you would feel comfortable paying"
        }
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

  test(`fill text fields`, async t => {
    let surveyResult;

    await t
      .typeText(`tr > td:nth-child(2) input`, `All my money`)
      .typeText(`tr > td:nth-child(4) input`, `Zero`)
      .click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();

    assert.deepEqual(surveyResult, {
      pricelimit: {
        mostamount: "All my money",
        leastamount: "Zero"
      }
    });
  });
});
