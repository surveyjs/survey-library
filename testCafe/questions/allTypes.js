import { frameworks, url_test, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `allTypes`;

const img_base64 =
  "data:image/png;base64,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";

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
      type: "imagepicker",
      name: "imagepicker_question",
      choices: [
        {
          value: "item1",
          imageLink: img_base64,
        },
      ],
    },
    {
      type: "boolean",
      name: "boolean_question",
    },
    {
      type: "image",
      name: "image_question",
      imageLink: img_base64,
    },
    {
      type: "html",
      name: "html_question",
      html: "<div class='sjs-html-question'>html text</div>",
    },
    {
      type: "signaturepad",
      name: "signature_question",
      defaultValue: img_base64,
    },
    {
      type: "expression",
      name: "expression_question",
      expression: "1",
    },
    {
      type: "file",
      name: "file_question",
      defaultValue: [
        {
          name:
            "data:image/png;base64,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",
          type: "image/png",
          content: img_base64,
        },
      ],
    },
    {
      type: "matrix",
      name: "matrix_question",
      columns: ["Column 1"],
      rows: ["Row 1"],
    },
    {
      type: "matrixdropdown",
      name: "matrixdropdown_question",
      columns: [
        {
          name: "Column 1",
        },
      ],
      choices: [1],
      rows: ["Row 1"],
    },
    {
      type: "matrixdynamic",
      name: "matrixdynamic_question",
      columns: [
        {
          name: "Column 1",
        },
      ],
      choices: [1],
      rowCount: 1,
    },
    {
      type: "multipletext",
      name: "multipletext_question",
      items: [
        {
          name: "text1",
        },
      ],
    },
    {
      type: "panel",
      name: "panel",
      elements: [
        {
          type: "text",
          name: "panel_question",
        },
      ],
      title: "panel_title",
      state: "collapsed",
    },
    {
      type: "paneldynamic",
      name: "paneldynamic",
      templateElements: [
        {
          type: "text",
          name: "paneldynamic_question",
        },
      ],
      panelCount: 1,
    },
    {
      type: "ranking",
      name: "ranking_question",
      choices: ["item1", "item2"],
    },
  ],
};

const applyTheme = ClientFunction(theme => {
  Survey.StylesManager.applyTheme(theme);
});

["modern", "bootstrap"].forEach(theme => {
  frameworks.forEach(framework => {
    fixture`${framework} ${title} ${theme}`
      .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
      await applyTheme(theme);
      await initSurvey(framework, json);
    });
    test("check survey will all types", async t => {
      var editable = Selector(".sv-string-editor");
      await t
        .expect(editable.exists)
        .notOk("There should not be any editable elements outside design mode");

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

      const dropdownSelector = Selector(
        "select[aria-label='dropdown_question']"
      );
      await t.click(dropdownSelector);
      await t.click(
        dropdownSelector
          .parent("[aria-labelledby]")
          .find("option")
          .withText("item1")
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
        Selector("[aria-label='imagepicker_question']")
          .parent("[aria-labelledby]")
          .find("img")
          .withAttribute("alt", "item1")
          .parent()
      );

      await t.click(
        Selector("[aria-label='boolean_question']")
          .parent("[aria-labelledby]")
          .find("span")
          .withText("Yes")
      );

      await t.hover(Selector("[name='image_question']").find("img"));

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

      await t.click(
        Selector("[aria-label='file_question']")
          .parent("[aria-labelledby]")
          .find("button")
          .withText("Clean")
          .filterVisible()
      );

      await t.click(
        Selector("[aria-label='matrix_question']")
          .parent("[aria-labelledby]")
          .find("tr")
          .withText("Row 1")
          .find("input[type='radio']")
          .parent()
      );

      const matrixDropdownRow = Selector(
        "[aria-label='matrixdropdown_question']"
      )
        .parent("[aria-labelledby]")
        .find("tr")
        .withText("Row 1");
      await t.click(matrixDropdownRow.find("select"));
      await t.click(matrixDropdownRow.find("option").withText("1"));

      await t.click(
        Selector("[aria-label='matrixdynamic_question']")
          .parent("[aria-labelledby]")
          .find("span")
          .withText("Remove")
      );

      await t.typeText(
        Selector("[aria-label='multipletext_question']")
          .parent("[aria-labelledby]")
          .find("input"),
        "test multiple text"
      );

      await t.click(Selector("span").withText("panel_title"));

      await t.click(
        Selector("[aria-label='paneldynamic']")
          .parent("[aria-labelledby]")
          .find("input[value='Remove']")
      );

      await t.hover(
        Selector("[aria-label='ranking_question']")
          .parent("[aria-labelledby]")
          .find("div")
          .withText("item1")
      );
      await t.drag(Selector(".sv-ranking-item__icon--hover").nth(1), 0, -71, {
        offsetX: 7,
        offsetY: 8,
      });

      await t.click("input[value=Complete]");

      let surveyResult = await getSurveyResult();

      assert.deepEqual(surveyResult.text_question, "test text");
      assert.deepEqual(surveyResult.checkbox_question, ["item1"]);
      assert.deepEqual(surveyResult.radiogroup_question, "item1");
      assert.deepEqual(surveyResult.dropdown_question, "item1");
      assert.deepEqual(surveyResult.comment_question, "test comment");
      assert.deepEqual(surveyResult.rating_question, 3);
      assert.deepEqual(surveyResult.imagepicker_question, "item1");
      assert.deepEqual(surveyResult.boolean_question, true);
      assert.deepEqual(surveyResult.expression_question, 1);
      assert.deepEqual(surveyResult.matrix_question, {
        "Row 1": "Column 1",
      });
      assert.deepEqual(surveyResult.matrixdropdown_question, {
        "Row 1": {
          "Column 1": 1,
        },
      });
      assert.deepEqual(surveyResult.multipletext_question, {
        text1: "test multiple text",
      });
      //TODO fix the drag&drop
      //assert.deepEqual(surveyResult.ranking_question, ["item2", "item1"]);
      assert.equal(surveyResult.ranking_question.length, 2);
    });
  });
});
