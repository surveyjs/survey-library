import { url, initSurvey, frameworks, getSurveyResult } from "../helper";

const title = "goNextPageAutomatic";

const json = {
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "q1"
        },
        {
          "type": "text",
          "name": "q2"
        }
      ]
    }
  ],
  "focusFirstQuestionAutomatic": true,
  "goNextPageAutomatic": true,
  "questionsOnPageMode": "questionPerPage",
};

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
    }
  );
  test("Go to the next page only, bug#8253", async t => {
    await initSurvey(framework, json);
    await t.pressKey("v a l 1")
      .click("input[value=Next]")
      .pressKey("v a l 2")
      .click("input[value=Complete]");

    let surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      q1: "val1", q2: "val2" });
  });
});