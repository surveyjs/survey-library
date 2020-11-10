import { frameworks, url_test, initSurvey, getSurveyResult } from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `allTypes`;

var json = {
  questions: [
    {
      type: "text",
      name: "text_question",
    },
    {
      type: "checkbox",
      name: "checkbox_question",
      choices: ["item1"],
    },
    {
      type: "radiogroup",
      name: "radiogroup_question",
      choices: ["item1"],
    },
    {
      type: "dropdown",
      name: "dropdown_question",
      choices: ["item1"],
    },
    {
      type: "comment",
      name: "comment_question",
    },
  ],
};

const applyTheme = ClientFunction((theme) => {
  Survey.StylesManager.applyTheme(theme);
});
["modern", "bootstrap"].forEach((theme) => {
  frameworks.forEach((framework) => {
    fixture`${framework} ${title}`
      .page`${url_test}${theme}/${framework}.html`.beforeEach(async (t) => {
      await applyTheme(theme);
      await initSurvey(framework, json);
    });
    test("check survey will all types", async (t) => {
      await t.typeText(
        Selector("[aria-label='text_question']")
          .parent("[aria-labelledby]")
          .find("input"),
        "test text"
      );

      await t.click(
        Selector("[aria-label='checkbox_question']")
          .parent("[aria-labelledby]")
          .find("span")
          .withText("item1")
      );

      await t.click(
        Selector("[aria-label='radiogroup_question']")
          .parent("[aria-labelledby]")
          .find("span")
          .withText("item1")
      );

      const select = Selector("select[aria-label='dropdown_question']");
      await t.click(select);
      await t.click(
        select.parent("[aria-labelledby]").find("option").withText("item1")
      );

      await t.typeText(
        Selector("[aria-label='comment_question']")
          .parent("[aria-labelledby]")
          .find("textarea"),
        "test comment"
      );

      await t.click("input[value=Complete]");

      let surveyResult = await getSurveyResult();
      assert.deepEqual(surveyResult, {
        text_question: "test text",
        checkbox_question: ["item1"],
        radiogroup_question: "item1",
        dropdown_question: "item1",
        comment_question: "test comment",
      });
    });
  });
});
