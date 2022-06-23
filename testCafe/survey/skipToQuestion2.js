import { fixture, test } from "testcafe";
import { frameworks, url, initSurvey, getSurveyResult, } from "../helper";
const title = "autoNextPage";

const json = {
  elements: [
    {
      type: "radiogroup",
      name: "q1",
      choices: ["item1", "item2", "item3"],
    },
    {
      type: "text",
      name: "q2"
    },
    {
      type: "text",
      name: "q3",
      enableIf: "{q1} = 'item3'"
    }
  ],
  triggers: [
    {
      type: "skip",
      expression: "{q1} = 'item2'",
      gotoName: "q2",
    },
    {
      type: "skip",
      expression: "{q1} = 'item3'",
      gotoName: "q3",
    },
  ],
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
    await t.pressKey("a b c");
    await t.click("input[value=\"item3\"]");
    await t.pressKey("d e f");
    await t.click("input[value=\"Complete\"]");
    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      q1: "item3",
      q2: "abc",
      q3: "def",
    });
  });
});
