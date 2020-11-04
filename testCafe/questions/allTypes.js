import { frameworks, url_test, initSurvey, getSurveyResult } from "../settings";
import { ClientFunction } from "testcafe";
const assert = require("assert");
const title = `allTypes`;

var json = {
  questions: [
    {
      type: "text",
      name: "text_question"
    }
  ]
};

const applyTheme = ClientFunction((theme) => {
  Survey.StylesManager.applyTheme(theme);
});
frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url_test}modern/${framework}.html`.beforeEach(
    async (t) => {
      await applyTheme("modern");
      await initSurvey(framework, json);
    }
  );
  test("check survey will all types", async t => {
    const getQuestionInputIdByName = ClientFunction((name) => {
      let question = survey.getQuestionByName(name);
      return question.inputId;
    });

    await t
      .typeText(`input[id=${await getQuestionInputIdByName("text_question")}]`, "test text")
      .click("input[value=Complete]");

    let surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, {
      text_question: "test text"
    });
  });
});
