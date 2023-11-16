import { frameworks, url_test, initSurvey, getSurveyResult, getDynamicPanelRemoveButton, applyTheme, getListItemByText } from "../helper";
import { Selector, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "allTypes";

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
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICAYAAABS39xVAAAGP0lEQVR4Xu3UPS6FURiF0aNW6SS38BPRyC3MQCNR68V09KIwCgqJuVAzAAoEuZJbmcH3Pck6Ezg7a7/ZG6vVajU8AgQIBAQ2DFagJREJEFgLGCyHQIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYE9/A2/fXuHt5Gpe7y4mT+J7A/AUM1sQdLR5u1gnOF4fj+vh04jS+JzBvAYM1YT8fvz/j4PF2neBi52hcLU8mTONrAvMXMFgTd3T/8jxeP9/H/ubWONvemziN7wnMW8Bgzbsf6QgQ+CdgsJwDAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYyAwcpUJSgBAgbLDRAgkBEwWJmqBCVAwGC5AQIEMgIGK1OVoAQIGCw3QIBARsBgZaoSlAABg+UGCBDICBisTFWCEiBgsNwAAQIZAYOVqUpQAgQMlhsgQCAjYLAyVQlKgIDBcgMECGQEDFamKkEJEDBYboAAgYzAH3j2MtZeCYSgAAAAAElFTkSuQmCC",
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

["modern", "bootstrap"].forEach(theme => {
  frameworks.forEach(framework => {
    fixture`${framework} ${title} ${theme}`
      .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
      await applyTheme(theme);
      await initSurvey(framework, json);
    });
    test("check survey will all types", async t => {
      await t
        .expect(Selector(".sv-string-editor").exists)
        .notOk("There should not be any editable elements outside design mode");

      await t.typeText(
        Selector("span").withText("text_question")
          .parent("[data-name]")
          .find("input"),
        "test text"
      );

      await t.click(
        Selector("span").withText("checkbox_question")
          .parent("[data-name]")
          .find("span")
          .withText("item1")
      );

      await t.click(
        Selector("span").withText("radiogroup_question")
          .parent("[data-name]")
          .find("span")
          .withText("item1")
      );

      await t
        .click(Selector("div[aria-label='dropdown_question']"))
        .click(getListItemByText("item1"));

      await t.typeText(
        Selector("span").withText("comment_question")
          .parent("[data-name]")
          .find("textarea"),
        "test comment"
      );

      await t.click(
        Selector("span").withText("rating_question")
          .parent("[data-name]")
          .find("span")
          .withText("3")
      );

      await t.click(
        Selector("span").withText("imagepicker_question")
          .parent("[data-name]")
          .find("img")
          .withAttribute("alt", "item1")
          .parent()
      );

      await t.click(
        Selector("span").withText("boolean_question")
          .parent("[data-name]")
          .find("span")
          .withText("Yes")
      );

      await t.hover(Selector("[data-name='image_question']").find("img"));

      assert.equal(await Selector(".sjs-html-question").innerText, "html text");

      await t.click(
        Selector("span").withText("signature_question")
          .parent("[data-name]")
          .find("button")
          .withAttribute("title", "Clear")
      );

      await t.hover(
        Selector("span").withText("expression_question")
          .parent("[data-name]")
          .find("div")
          .withText("1")
      );

      await t.click(
        Selector("span").withText("file_question")
          .parent("[data-name]")
          .find("button")
          .withText("Clear")
          .filterVisible()
      );

      await t.click(
        Selector("span").withText("matrix_question")
          .parent("[data-name]")
          .find("tr")
          .withText("Row 1")
          .find("input[type='radio']")
          .parent()
      );

      const matrixDropdownRow = Selector("span").withText("matrixdropdown_question")
        .parent("[data-name]")
        .find("tr").withText("Row 1");
      await t
        .click(matrixDropdownRow.find("div[aria-label='row Row 1, column Column 1']"))
        .click(getListItemByText("1"));

      await t.click(
        Selector("span").withText("matrixdynamic_question")
          .parent("[data-name]")
          .find("span")
          .withText("Remove")
      );

      await t.typeText(
        Selector("span").withText("multipletext_question")
          .parent("[data-name]")
          .find("input"),
        "test multiple text"
      );

      await t.click(Selector("span").withText("panel_title"));

      await t.click(getDynamicPanelRemoveButton("paneldynamic", "Remove"));

      // const rankItem1 = Selector("span").withText('ranking_question')
      //   .parent("[data-name]")
      //   .find("div")W
      //   .withText("item1");

      // const rankItem2 = Selector("span").withText('ranking_question')
      //   .parent("[data-name]")
      //   .find("div")
      //   .withText("item2");
      // await t.dragToElement(rankItem1, rankItem2, { destinationOffsetY: -1, speed: 0.1 });

      await t.click("input[value=Complete]");

      const surveyResult = await getSurveyResult();
      await t.expect(surveyResult.text_question).eql("test text");
      await t.expect(surveyResult.checkbox_question).eql(["item1"]);
      await t.expect(surveyResult.radiogroup_question).eql("item1");
      await t.expect(surveyResult.dropdown_question).eql("item1");
      await t.expect(surveyResult.comment_question).eql("test comment");
      await t.expect(surveyResult.rating_question).eql(3);
      await t.expect(surveyResult.imagepicker_question).eql("item1");
      await t.expect(surveyResult.boolean_question).eql(true);
      await t.expect(surveyResult.expression_question).eql(1);
      await t.expect(surveyResult.matrix_question).eql({ "Row 1": "Column 1", });
      await t.expect(surveyResult.matrixdropdown_question).eql({ "Row 1": { "Column 1": 1, }, });
      await t.expect(surveyResult.multipletext_question).eql({ text1: "test multiple text", });
      // await t.expect(surveyResult.ranking_question).eql(["item2", "item1"]);
    });
  });
});
