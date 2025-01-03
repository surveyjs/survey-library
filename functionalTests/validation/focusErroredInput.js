import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "focus input with Error";
const json1 = {
  focusFirstQuestionAutomatic: true,
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "question1"
        },
        {
          "type": "boolean",
          "name": "question2"
        },

        {
          "type": "text",
          "name": "q1",
          "validators": [{ "type": "numeric", "text": "Enter only numbers" }]
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "text",
          "name": "question3"
        }
      ]
    }
  ],
  "checkErrorsMode": "onComplete"
};
const json2 = {
  focusFirstQuestionAutomatic: true,
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "question1"
        },
        {
          "type": "boolean",
          "name": "question2"
        },

        {
          "type": "matrixdynamic",
          "name": "matrix",
          "rowCount": 1,
          "columns": [
            { "cellType": "text", "name": "col1",
              "validators": [{ "type": "numeric", "text": "Enter only numbers" }] }
          ]
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "text",
          "name": "question3"
        }
      ]
    }
  ],
  "checkErrorsMode": "onComplete"
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
    }
  );

  test("validate on error", async t => {
    let surveyResult;

    await initSurvey(framework, json1);
    await t
      .pressKey("tab")
      .pressKey("tab")
      .pressKey("a")
      .click("input[value=\"Next\"]")
      .click("input[value=\"Complete\"]")
      .pressKey("backspace")
      .pressKey("1")
      .click("input[value=\"Next\"]")
      .click("input[value=\"Complete\"]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({ q1: "1" });
  });

  test("validate on error in matrix", async t => {
    let surveyResult;

    await initSurvey(framework, json2);
    await t
      .pressKey("tab")
      .pressKey("tab")
      .pressKey("a")
      .click("input[value=\"Next\"]")
      .click("input[value=\"Complete\"]")
      .pressKey("backspace")
      .pressKey("1")
      .click("input[value=\"Next\"]")
      .click("input[value=\"Complete\"]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({ matrix: [{ col1: "1" }] });
  });
});
