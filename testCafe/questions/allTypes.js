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
    {
      type: "rating",
      name: "rating_question",
    },
    {
      type: "boolean",
      name: "boolean_question",
    },
    {
      type: "html",
      name: "html_question",
      html: "<div class='sjs-html-question'>html text</div>",
    },
    {
      type: "signaturepad",
      name: "signature_question",
      defaultValue:
        "data:image/png;base64,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",
    },
    {
      type: "expression",
      name: "expression_question",
      expression: "1",
    },
  ],
};

const applyTheme = ClientFunction((theme) => {
  Survey.StylesManager.applyTheme(theme);
});

["modern", "bootstrap"].forEach((theme) => {
  frameworks.forEach((framework) => {
    fixture`${framework} ${title} ${theme}`
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

      await t.click(
        Selector("[aria-label='rating_question']")
          .parent("[aria-labelledby]")
          .find("span")
          .withText("3")
      );

      await t.click(
        Selector("[aria-label='boolean_question']")
          .parent("[aria-labelledby]")
          .find("span")
          .withText("Yes")
      );

      assert.equal(await Selector(".sjs-html-question").innerText, "html text");

      await t.click(
        Selector("[aria-label='signature_question']")
          .parent("[aria-labelledby]")
          .find("button")
          .withAttribute("title", "Clear")
      );

      await t.hover(
        Selector("[aria-label='expression_question']")
          .parent("[aria-labelledby]")
          .find("div")
          .withText("1")
      );

      await t.click("input[value=Complete]");

      let surveyResult = await getSurveyResult();
      assert.deepEqual(surveyResult, {
        text_question: "test text",
        checkbox_question: ["item1"],
        radiogroup_question: "item1",
        dropdown_question: "item1",
        comment_question: "test comment",
        rating_question: 3,
        boolean_question: true,
        expression_question: 1,
      });
    });
  });
});
