import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult,
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `matrixdropdown_multiplecolumns`;

const json = {
  questions: [
    {
      type: "matrixdropdown",
      name: "question1",
      columns: [
        {
          name: "col1",
          cellType: "radiogroup",
          title: "What is your feeling?",
          showInMultipleColumns: true,
          choices: [
            "Strongly disagree",
            "Disagree",
            "Neutral",
            "Agree",
            "Strongly agree",
          ],
        },
        {
          name: "comment",
          title: "Please comment",
          cellType: "comment",
        },
      ],
      rows: [
        "Excited",
        "Enthusiastic",
        "Open",
        "Physically safe",
        "Emotionally safe",
        "Apprehensive",
        "Nervous",
        "Scared",
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test(`multiple columns`, async (t) => {
    const baseSelectorFunc = function (strings, ...values) {
      return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
    };

    await t.expect(Selector("th").withText("Strongly disagree").exists).ok();
    await t.expect(Selector("th").count).eql(7);

    await t
      .click(`${baseSelectorFunc`${1}${2}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${2}${3}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${3}${4}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${4}${5}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${5}${6}`} input[type=radio]`)
      .typeText(`${baseSelectorFunc`${1}${7}`} textarea`, `Some comment`);

    await t.click(`input[value=Complete]`);

    let surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult.question1.Excited, {
      col1: "Strongly disagree",
      comment: "Some comment",
    });
    assert.deepEqual(surveyResult.question1["Emotionally safe"], {
      col1: "Strongly agree",
    });
  });
});
