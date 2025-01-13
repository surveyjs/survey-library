import { fixture, test } from "testcafe";
import { frameworks, url_test, initSurvey, checkSurveyWithEmptyQuestion } from "../helper";
const title = "sortablejs";

const json = {
  questions: [
    {
      type: "sortablelist",
      name: "lifepriopity",
      title: "Life Priorities ",
      isRequired: true,
      colCount: 0,
      choices: ["family", "work", "pets", "travels", "games"],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}customWidget/${framework}`.beforeEach(
    async (ctx) => {
      await initSurvey(framework, json);
    }
  );

  test("check integrity", async (t) => {
    await t
      .hover("div[data-value]:nth-child(1)")
      .hover("div[data-value]:nth-child(2)")
      .hover("div[data-value]:nth-child(3)")
      .hover("div[data-value]:nth-child(4)")
      .hover("div[data-value]:nth-child(5)");
  });

  test("choose empty", async (t) => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose value", async (t) => {
    // TODO d&d doesn't work https://github.com/DevExpress/testcafe/issues/897
    // let surveyResult;
    //
    // await t
    //     .dragToElement('.source div:nth-child(4)', '.result')
    //     .dragToElement('.source div:nth-child(1)', '.result')
    //     .click(`input[value=Complete]`);
    //
    // surveyResult = await getSurveyResult();
    // assert.deepEqual(surveyResult.lifepriopity, ["travels","family"]);
  });

  test("change priority", async (t) => {
    // TODO d&d doesn't work https://github.com/DevExpress/testcafe/issues/897
    // let surveyResult;
    //
    // await t
    //     .dragToElement('.source div:nth-child(1)', '.result')
    //     .dragToElement('.source div:nth-child(2)', '.result')
    //     .dragToElement('.source div:nth-child(3)', '.result')
    //     .dragToElement('.source div:nth-child(4)', '.result')
    //     .dragToElement('.source div:nth-child(5)', '.result')
    //     .dragToElement('.result div:nth-child(1)', '.result div:nth-child(5) div')
    //     .dragToElement('.result div:nth-child(1)', '.result div:nth-child(4) div')
    //     .dragToElement('.result div:nth-child(1)', '.result div:nth-child(3) div')
    //     .dragToElement('.result div:nth-child(1)', '.result div:nth-child(2) div')
    //
    //     .click(`input[value=Complete]`);
    //
    // surveyResult = await getSurveyResult();
    // assert.deepEqual(surveyResult.lifepriopity, ["games","travels","pets","work","family"]);
  });
});
