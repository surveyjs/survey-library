import { fixture, test } from "testcafe";
import { frameworks, url, initSurvey, getSurveyResult, } from "../helper";
const title = "autoNextPage";

const json = {
  pages: [
    {
      questions: [
        {
          type: "radiogroup",
          name: "q1",
          choices: ["item1", "item2", "item3"],
        },
      ],
    },
    {
      questions: [
        {
          type: "text",
          name: "q2",
        },
        {
          type: "text",
          name: "q3",
        },
      ],
    },
  ],
  triggers: [{ type: "skip", gotoName: "q3", expression: "{q1} = 'item2'" }],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("skip to question should focus the correct question", async (t) => {
    let surveyResult;

    await t.click("input[value=\"item2\"]");
    await t.pressKey("a b c").click("input[value=\"Complete\"]");
    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      q1: "item2",
      q3: "abc",
    });
  });
});
