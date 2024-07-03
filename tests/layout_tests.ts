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

QUnit.test("user columns de/serialization", function (assert) {
  const surveyModel = new SurveyModel({
    pages: [
      {
        name: "page1",
        layoutColumns: [{
          "width": 40,
        }, {
          "width": 45,
          "questionTitleWidth": "200px"
        }]
      }]
  });
  const page = surveyModel.pages[0];

  assert.deepEqual(page.layoutColumns.length, 2);
  assert.deepEqual(page.layoutColumns[0].width, 40);
  assert.deepEqual(page.layoutColumns[0].questionTitleWidth, undefined);
  assert.deepEqual(page.layoutColumns[1].width, 45);
  assert.deepEqual(page.layoutColumns[1].questionTitleWidth, "200px");

  page.layoutColumns[0].width = 70;
  page.layoutColumns[0].questionTitleWidth = "300px";
  const result = surveyModel.toJSON();
  assert.deepEqual(result, {
    pages: [
      {
        name: "page1",
        layoutColumns: [{
          "questionTitleWidth": "300px",
          "width": 70,
        }, {
          "questionTitleWidth": "200px",
          "width": 45,
        }],
      }]
  });
});

QUnit.test("layout columns de/serialization", function (assert) {
  const json = {
    pages: [
      {
        name: "page1",
        "elements": [
          {
            "type": "text",
            "name": "q1"
          },
          {
            "type": "text",
            "name": "q2",
            "colSpan": 2,
            "startWithNewLine": false
          }
        ],
      }]
  };
  const surveyModel = new SurveyModel(json);
  const page = surveyModel.pages[0];
  assert.equal(page.layoutColumns.length, 3);

  const result = surveyModel.toJSON();
  assert.deepEqual(result, json);
});

QUnit.test("apply columns from layoutColumns #1", function (assert) {
  const surveyModel = new SurveyModel({
    pages: [
      {
        name: "page1",
        layoutColumns: [{
          "width": 40,
        }],
        elements: [
          {
            "name": "q1",
            "type": "text",
          }, {
            "name": "q2",
            "type": "text",
            "startWithNewLine": false
          }
        ]
      }]
  });
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");
  const q2 = surveyModel.getQuestionByName("q2");

  assert.deepEqual(page.columns.length, 2);
  assert.deepEqual(page.columns[0].width, 40);
  assert.deepEqual(page.columns[1].width, 60);

  assert.equal(q1.rootStyle["flexBasis"], "40%");
  assert.equal(q2.rootStyle["flexBasis"], "60%");
});

QUnit.test("apply columns from layoutColumns #2", function (assert) {
  const surveyModel = new SurveyModel({
    pages: [
      {
        name: "page1",
        layoutColumns: [{
          "width": 20,
        }, {
          "width": 30,
        }, {
          "width": 25,
        }, {
          "width": 25,
        }],
        elements: [
          {
            "name": "q1",
            "type": "text",
          }, {
            "name": "q2",
            "type": "text",
            "startWithNewLine": false
          }, {
            "name": "q3",
            "type": "text",
            "colSpan": 2,
            "startWithNewLine": false
          }
        ]
      }]
  });
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");
  const q2 = surveyModel.getQuestionByName("q2");
  const q3 = surveyModel.getQuestionByName("q3");

  assert.deepEqual(page.columns.length, 4);
  assert.deepEqual(page.columns[0].width, 20);
  assert.deepEqual(page.columns[1].width, 30);
  assert.deepEqual(page.columns[2].width, 25);
  assert.deepEqual(page.columns[3].width, 25);

  assert.equal(q1.rootStyle["flexBasis"], "20%", "q1 rootStyle flexBasis");
  assert.equal(q2.rootStyle["flexBasis"], "30%", "q2 rootStyle flexBasis");
  assert.equal(q3.rootStyle["flexBasis"], "50%", "q3 rootStyle flexBasis");
});

QUnit.test("apply columns from layoutColumns with given colSpan", function (assert) {
  const surveyModel = new SurveyModel({
    pages: [
      {
        name: "page1",
        layoutColumns: [{
          "width": 20,
        }, {
          "width": 30,
        }, {
          "width": 25,
        }, {
          "width": 25,
        }],
        elements: [
          {
            "name": "q1",
            "type": "text",
          }, {
            "name": "q2",
            "type": "text",
            "startWithNewLine": false
          }, {
            "name": "q3",
            "type": "text",
            "colSpan": 1,
            "startWithNewLine": false
          }
        ]
      }]
  });
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");
  const q2 = surveyModel.getQuestionByName("q2");
  const q3 = surveyModel.getQuestionByName("q3");

  assert.deepEqual(page.columns.length, 3);
  assert.deepEqual(page.columns[0].width, 20);
  assert.deepEqual(page.columns[1].width, 30);
  assert.deepEqual(page.columns[2].width, 25);

  assert.equal(q1.rootStyle["flexBasis"], "20%", "q1 rootStyle flexBasis");
  assert.equal(q2.rootStyle["flexBasis"], "30%", "q2 rootStyle flexBasis");
  assert.equal(q3.rootStyle["flexBasis"], "25%", "q3 rootStyle flexBasis");
});

QUnit.test("check question width if column width is set for only one column", function (assert) {
  const surveyModel = new SurveyModel({
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "name": "q1"
          },
          {
            "type": "text",
            "name": "q2",
            "colSpan": 2,
            "startWithNewLine": false
          }
        ],
        "layoutColumns": [
          { "width": 25 },
          {},
          {}
        ]
      }
    ],
  });
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");
  const q2 = surveyModel.getQuestionByName("q2");

  assert.deepEqual(page.columns.length, 3);
  assert.deepEqual(page.columns[0].width, 25);
  assert.deepEqual(page.columns[1].width, 37.5);
  assert.deepEqual(page.columns[2].width, 37.5);

  assert.equal(q1.rootStyle["flexBasis"], "25%", "q1 rootStyle flexBasis");
  assert.equal(q2.rootStyle["flexBasis"], "75%", "q2 rootStyle flexBasis");
});