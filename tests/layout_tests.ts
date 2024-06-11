import { SurveyModel } from "../src/survey";

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
  assert.equal(page.columns[0].width, 33.33);

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
  assert.equal(page.columns[0].width, 33.33);

  assert.deepEqual(page.getColumsForElement(q1), [page.columns[0]]);
  assert.deepEqual(page.getColumsForElement(q2), [page.columns[1], page.columns[1]]);
  assert.deepEqual(page.getColumsForElement(q3), [page.columns[0], page.columns[1]]);
  assert.deepEqual(page.getColumsForElement(q4), [page.columns[1]]);
});