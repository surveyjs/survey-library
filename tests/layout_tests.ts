import { SurveyModel } from "../src/survey";
import { roundTo2Decimals } from "../src/utils/utils";

export default QUnit.module("Layout");

QUnit.test("columns generate - simple", function (assert) {
  const surveyModel = new SurveyModel({
    elements: [{
      "name": "q1",
      "type": "text",
      colSpan: 1,
    }, {
      "name": "q2",
      "type": "text",
      colSpan: 2,
      "startWithNewLine": false
    },
    {
      "name": "q3",
      "type": "text",
    },
    {
      "name": "q4",
      "type": "text",
      "startWithNewLine": false
    }]
  });
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");
  const q2 = surveyModel.getQuestionByName("q2");
  const q3 = surveyModel.getQuestionByName("q3");
  const q4 = surveyModel.getQuestionByName("q4");

  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.columns.length, 3);
  assert.equal(roundTo2Decimals(page.columns[0].width), 33.33);

  assert.deepEqual(page.getColumsForElement(q1), [page.columns[0]]);
  assert.deepEqual(page.getColumsForElement(q2), [page.columns[1], page.columns[1]]);
  assert.deepEqual(page.getColumsForElement(q3), [page.columns[0]]);
  assert.deepEqual(page.getColumsForElement(q4), [page.columns[1], page.columns[1]]);
});

QUnit.test("columns generate - complex", function (assert) {
  const surveyModel = new SurveyModel({
    elements: [{
      "name": "q1",
      "type": "text",
      colSpan: 1,
    }, {
      "name": "q2",
      "type": "text",
      colSpan: 2,
      "startWithNewLine": false
    },
    {
      "name": "q3",
      "type": "text",
      colSpan: 2,
    },
    {
      "name": "q4",
      "type": "text",
      "startWithNewLine": false
    }]
  });
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");
  const q2 = surveyModel.getQuestionByName("q2");
  const q3 = surveyModel.getQuestionByName("q3");
  const q4 = surveyModel.getQuestionByName("q4");

  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.columns.length, 3);
  assert.equal(roundTo2Decimals(page.columns[0].width), 33.33);

  assert.deepEqual(page.getColumsForElement(q1), [page.columns[0]]);
  assert.deepEqual(page.getColumsForElement(q2), [page.columns[1], page.columns[1]]);
  assert.deepEqual(page.getColumsForElement(q3), [page.columns[0], page.columns[1]]);
  assert.deepEqual(page.getColumsForElement(q4), [page.columns[1]]);
});

QUnit.test("columns generate - title width", function (assert) {
  const surveyModel = new SurveyModel({
    pages: [
      {
        name: "page1",
        questionTitleWidth: "25%",
        elements: [{
          "name": "q1",
          "type": "text",
          colSpan: 1,
        }, {
          "name": "q2",
          "type": "text",
          colSpan: 2,
          "startWithNewLine": false
        },
        {
          "name": "q3",
          "type": "text",
          colSpan: 2,
        },
        {
          "name": "q4",
          "type": "text",
          "startWithNewLine": false
        }]
      }]
  });
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");
  const q2 = surveyModel.getQuestionByName("q2");
  const q3 = surveyModel.getQuestionByName("q3");
  const q4 = surveyModel.getQuestionByName("q4");

  assert.deepEqual(q1.titleWidth, undefined);
  assert.deepEqual(q2.titleWidth, undefined);
  assert.deepEqual(q3.titleWidth, undefined);
  assert.deepEqual(q4.titleWidth, undefined);

  page.questionTitleLocation = "left";
  assert.deepEqual(q1.titleWidth, "25%");
  assert.deepEqual(q2.titleWidth, "12.5%");
  assert.deepEqual(q3.titleWidth, "12.5%");
  assert.deepEqual(q4.titleWidth, "25%");
});