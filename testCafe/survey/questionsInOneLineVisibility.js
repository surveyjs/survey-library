import { frameworks, url_test, initSurvey, applyTheme } from "../helper";
import { Selector, fixture, test } from "testcafe";
const title = "questionsInOneLine and question visibility";

const json = {
  pages: [
    {
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          startWithNewLine: false,
          choices: ["item 1", "item 2", "item 3"],
        },
        {
          type: "radiogroup",
          name: "q2",
          startWithNewLine: false,
          visibleIf: "{q1} = 'item 1'",
          choices: ["item 4", "item 5"],
        },
        {
          type: "radiogroup",
          name: "q3",
          startWithNewLine: false,
          choices: ["item 6", "item 7"],
        },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title} modern`
    .page`${url_test}modern/${framework}`.beforeEach(async (t) => {
    await applyTheme("modern");
    await initSurvey(framework, json);
  });

  test("Make invisible question visible", async (t) => {
    await t.expect(Selector("span").withText("q1").visible).ok();
    await t.expect(Selector("span").withText("q2").visible).notOk();
    await t.click(Selector("span").withText("item 1"));
    await t
      .expect(
        Selector("h5.sv-question__title--answer")
          .find("span")
          .withText("q1").exists
      )
      .ok();
    await t.expect(Selector("span").withText("q2").visible).ok();
    await t.click(Selector("span").withText("item 4"));
    await t
      .expect(
        Selector("h5.sv-question__title--answer")
          .find("span")
          .withText("q2").exists
      )
      .ok();
  });
});
