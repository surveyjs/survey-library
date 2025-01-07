import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, fixture, test, ClientFunction } from "testcafe";
const title = "matrixdropdownMultiplecolumns";

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
  test("multiple columns", async (t) => {
    const baseSelectorFunc = function (strings, ...values) {
      return `tbody > tr:nth-of-type(${values[0]}) > td:nth-of-type(${values[1]})`;
    };

    await t.expect(Selector("th").withText("Strongly disagree").exists).ok();
    await t.expect(Selector("th").count).eql(6);

    await t
      .click(`${baseSelectorFunc`${1}${2}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${2}${3}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${3}${4}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${4}${5}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${5}${6}`} input[type=radio]`)
      .typeText(`${baseSelectorFunc`${1}${7}`} textarea`, "Some comment");

    await t.click("input[value=Complete]");

    let surveyResult = await getSurveyResult();
    await t.expect(surveyResult.question1.Excited).eql({
      col1: "Strongly disagree",
      comment: "Some comment",
    });
    await t.expect(surveyResult.question1["Emotionally safe"]).eql({
      col1: "Strongly agree",
    });
  });

  const updateColumn = ClientFunction(() => {
    const survey = window["survey"];
    survey.getQuestionByName("question1").columns[0].hasOther = true;
  });

  test("multiple columns and hasOther", async (t) => {
    const baseSelectorFunc = function (strings, ...values) {
      return `tbody > tr:nth-of-type(${values[0]}) > td:nth-of-type(${values[1]})`;
    };

    await updateColumn();

    await t.expect(Selector("th").withText("Other (describe)").exists).ok();
    await t.expect(Selector("th").count).eql(7);

    await t
      .click(`${baseSelectorFunc`${1}${2}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${2}${3}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${3}${4}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${4}${5}`} input[type=radio]`)
      .click(`${baseSelectorFunc`${5}${6}`} input[type=radio]`)
      .typeText(`${baseSelectorFunc`${1}${7}`} textarea`, "Some comment");

    await t.click("input[value=Complete]");

    let surveyResult = await getSurveyResult();
    await t.expect(surveyResult.question1.Excited).eql({
      col1: "other",
      "col1-Comment": "Some comment",
    });
    await t.expect(surveyResult.question1["Emotionally safe"]).eql({
      col1: "Strongly agree",
    });
  });
});
