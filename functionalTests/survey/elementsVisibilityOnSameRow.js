import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "Elements Visibility on Same row";

const json = {
  pages: [
    {
      elements: [
        { type: "radiogroup", name: "q1", choices: ["Yes", "No"] },
        {
          type: "text",
          name: "q2",
          startWithNewLine: false,
          visibleIf: "{q1} = 'Yes'",
        },
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
  test("make element on same row visible", async (t) => {
    await t.expect(Selector("span").withText("2.").visible).notOk();
    const yesChoice = Selector("input[value=\"Yes\"]");
    const noChoice = Selector("input[value=\"No\"]");
    await t
      .click(yesChoice)
      .expect(yesChoice.checked)
      .ok();
    await t.expect(Selector("span").withText("2.").visible).ok();
    await t
      .click(noChoice)
      .expect(noChoice.checked)
      .ok();
    await t.expect(Selector("span").withText("2.").visible).notOk();
  });
});
