import { ArrayChanges, Base } from "../src/base";
import { Serializer } from "../src/jsonobject";
import { QuestionTextModel } from "../src/question_text";
import { SurveyModel } from "../src/survey";
import { roundTo2Decimals } from "../src/utils/utils";

export default QUnit.module("Layout:");

QUnit.test("columns generate - simple", function (assert) {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
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
  assert.equal(page.columns[0].width, undefined);
  assert.equal(roundTo2Decimals(page.columns[0].effectiveWidth), 33.33);

  assert.equal(page.getColumsForElement(q1).length, 1);
  assert.deepEqual(page.getColumsForElement(q1), [page.columns[0]], "q1");
  assert.equal(page.getColumsForElement(q2).length, 2);
  assert.deepEqual(page.getColumsForElement(q2), [page.columns[1], page.columns[1]], "q2");
  assert.equal(page.getColumsForElement(q3).length, 1);
  assert.deepEqual(page.getColumsForElement(q3), [page.columns[0]], "q3");
  assert.equal(page.getColumsForElement(q4).length, 2);
  assert.deepEqual(page.getColumsForElement(q4), [page.columns[1], page.columns[1]], "q4");
});

QUnit.test("columns generate - complex", function (assert) {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
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
  assert.equal(page.columns[0].width, undefined);
  assert.equal(roundTo2Decimals(page.columns[0].effectiveWidth), 33.33);

  assert.deepEqual(page.getColumsForElement(q1), [page.columns[0]]);
  assert.deepEqual(page.getColumsForElement(q2), [page.columns[1], page.columns[1]]);
  assert.deepEqual(page.getColumsForElement(q3), [page.columns[0], page.columns[1]]);
  assert.deepEqual(page.getColumsForElement(q4), [page.columns[1]]);
});

QUnit.test("columns generate - title width", function (assert) {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
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
QUnit.test("title width & titleLocation left & delete question, #8686", function (assert) {
  const surveyModel = new SurveyModel({
    elements: [{
      name: "q1",
      type: "text",
      titleLocation: "left"
    }]
  });
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");
  q1.delete();
  assert.notOk(q1.titleWidth);
});

QUnit.test("user columns de/serialization", function (assert) {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
    pages: [
      {
        name: "page1",
        layoutColumns: [
          { "width": 40, },
          {
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
    gridLayoutEnabled: true,
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
    gridLayoutEnabled: true,
    pages: [
      {
        name: "page1",
        "elements": [
          { "type": "text", "name": "q1" },
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
    gridLayoutEnabled: true,
    pages: [
      {
        name: "page1",
        layoutColumns: [
          { "width": 40 }
        ],
        elements: [
          { "name": "q1", "type": "text", },
          { "name": "q2", "type": "text", "startWithNewLine": false }
        ]
      }]
  });
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");
  const q2 = surveyModel.getQuestionByName("q2");

  assert.deepEqual(page.columns.length, 2);
  assert.deepEqual(page.columns[0].width, 40);
  assert.deepEqual(page.columns[0].effectiveWidth, 40);
  assert.deepEqual(page.columns[1].width, undefined);
  assert.deepEqual(page.columns[1].effectiveWidth, 60);

  assert.equal(q1.rootStyle["flexBasis"], "40%");
  assert.equal(q2.rootStyle["flexBasis"], "60%");
});

QUnit.test("apply columns from layoutColumns #2", function (assert) {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
    pages: [
      {
        name: "page1",
        layoutColumns: [
          { "width": 20, },
          { "width": 30, },
          { "width": 25, },
          { "width": 25, }
        ],
        elements: [
          { "name": "q1", "type": "text", },
          { "name": "q2", "type": "text", "startWithNewLine": false },
          {
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
    gridLayoutEnabled: true,
    pages: [
      {
        name: "page1",
        layoutColumns: [
          { "width": 20, },
          { "width": 30, },
          { "width": 25, },
          { "width": 25, }
        ],
        elements: [
          { "name": "q1", "type": "text", },
          { "name": "q2", "type": "text", "startWithNewLine": false },
          {
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
    gridLayoutEnabled: true,
    "pages": [
      {
        "name": "page1",
        "elements": [
          { "type": "text", "name": "q1" },
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
  assert.deepEqual(page.columns[0].effectiveWidth, 25);
  assert.deepEqual(page.columns[1].width, undefined);
  assert.deepEqual(page.columns[1].effectiveWidth, 37.5);
  assert.deepEqual(page.columns[2].width, undefined);
  assert.deepEqual(page.columns[2].effectiveWidth, 37.5);

  assert.equal(q1.rootStyle["flexBasis"], "25%", "q1 rootStyle flexBasis");
  assert.equal(q2.rootStyle["flexBasis"], "75%", "q2 rootStyle flexBasis");
});

QUnit.test("effectiveColSpan #1", assert => {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
    "questions": [
      { "type": "text", "name": "q1" },
      {
        "type": "text",
        "name": "q2",
        "colSpan": 2,
        "startWithNewLine": false
      },
      { "type": "text", "name": "q3" },
      {
        "type": "text",
        "name": "q4",
        "startWithNewLine": false
      }
    ]
  });

  const q3 = surveyModel.getQuestionByName("q3");
  const q4 = surveyModel.getQuestionByName("q4");

  assert.equal(q3.colSpan, 1, "q3 colSpan #1");
  assert.equal(q3.effectiveColSpan, 1, "q3 effectiveColSpan #1");
  assert.equal(q4.colSpan, 1, "q4 colSpan #1");
  assert.equal(q4.effectiveColSpan, 2, "q4 effectiveColSpan #1");

  q3.effectiveColSpan = 2;
  assert.equal(q3.colSpan, 2, "q3 colSpan #2");
  assert.equal(q3.effectiveColSpan, 2, "q3 effectiveColSpan #2");
  assert.equal(q4.colSpan, 1, "q4 colSpan #2");
  assert.equal(q4.effectiveColSpan, 1, "q4 effectiveColSpan #2");
});

QUnit.test("columns effectiveWidth #1", assert => {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
    "pages": [
      {
        "name": "page1",
        "elements": [
          { "type": "text", "name": "q1" },
          {
            "type": "text",
            "name": "q2",
            "colSpan": 2,
            "startWithNewLine": false
          },
          { "type": "text", "name": "q5", "startWithNewLine": false },
          { "type": "text", "name": "q3" },
          { "type": "text", "name": "q4", "startWithNewLine": false }
        ],
        "layoutColumns": [
          { "width": 25 },
          { "width": 30 },
          { "width": 35 }
        ]
      }
    ]
  });

  const page = surveyModel.pages[0];

  assert.equal(page.layoutColumns.length, 4);
  assert.equal(page.layoutColumns[0].effectiveWidth, 25);
  assert.equal(page.layoutColumns[1].effectiveWidth, 30);
  assert.equal(page.layoutColumns[2].effectiveWidth, 35);
  assert.equal(page.layoutColumns[3].effectiveWidth, 10);
  assert.equal(page.layoutColumns[3].width, undefined);

  page.layoutColumns[0].effectiveWidth = 20;
  assert.equal(page.layoutColumns[0].effectiveWidth, 20);
  assert.equal(page.layoutColumns[0].width, 20);
  assert.equal(page.layoutColumns[1].effectiveWidth, 30);
  assert.equal(page.layoutColumns[2].effectiveWidth, 35);
  assert.equal(page.layoutColumns[3].effectiveWidth, 15);
  assert.equal(page.layoutColumns[3].width, undefined);
});

QUnit.test("colSpan for first row", assert => {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
    "pages": [
      {
        "name": "page1",
        "elements": [
          { "type": "text", "name": "q4" },
          { "type": "text", "name": "q1" },
          {
            "type": "text", "name": "q2",
            "colSpan": 2, "startWithNewLine": false
          },
          { "type": "text", "name": "q3" }
        ]
      }
    ]
  });

  const q1 = surveyModel.getQuestionByName("q1");
  const q2 = surveyModel.getQuestionByName("q2");
  const q3 = surveyModel.getQuestionByName("q3");
  const q4 = surveyModel.getQuestionByName("q4");
  const page = surveyModel.pages[0];

  assert.equal(page.layoutColumns.length, 3);
  assert.equal(q1.effectiveColSpan, 1, "q1 effectiveColSpan");
  assert.equal(q2.effectiveColSpan, 2, "q2 effectiveColSpan");
  assert.equal(q3.effectiveColSpan, 3, "q3 effectiveColSpan");
  assert.equal(q4.effectiveColSpan, 3, "q4 effectiveColSpan");
});

QUnit.test("expand last question in row whitch does not have colSpan set", assert => {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
    "pages": [
      {
        "name": "page1",
        "elements": [
          { "type": "text", "name": "question1" },
          { "type": "text", "name": "question2", "startWithNewLine": false },
          { "type": "text", "name": "question3", "startWithNewLine": false },
          { "type": "text", "name": "question4", "startWithNewLine": false },
          { "type": "text", "name": "question5", "startWithNewLine": false },
          { "type": "text", "name": "question9" },
          {
            "type": "text",
            "name": "question10",
            "colSpan": 2,
            "startWithNewLine": false
          }
        ]
      }
    ]
  });

  const q9 = surveyModel.getQuestionByName("question9");
  const q10 = surveyModel.getQuestionByName("question10");
  const page = surveyModel.pages[0];

  assert.equal(page.layoutColumns.length, 5);
  assert.equal(q9.effectiveColSpan, 3, "q9 effectiveColSpan");
  assert.equal(q10.effectiveColSpan, 2, "q10 effectiveColSpan");
});

QUnit.test("recalculate column width after question added", assert => {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
    "pages": [
      {
        "name": "page1",
        "elements": [
          { "type": "text", "name": "question1" },
          { "type": "text", "name": "question2", "startWithNewLine": false }
        ]
      }
    ]
  });

  const page = surveyModel.pages[0];

  assert.equal(page.layoutColumns.length, 2);
  assert.equal(page.layoutColumns[0].effectiveWidth, 50);
  assert.equal(page.layoutColumns[1].effectiveWidth, 50);

  const q3 = new QuestionTextModel("q3");
  q3.startWithNewLine = false;
  page.addElement(q3, 2);
  assert.equal(page.layoutColumns.length, 3);
  assert.equal(page.layoutColumns[0].effectiveWidth, 33.33);
  assert.equal(page.layoutColumns[1].effectiveWidth, 33.33);
  assert.equal(page.layoutColumns[2].effectiveWidth, 33.33);
});

QUnit.test("recalculate column width after question deleted", assert => {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
    "pages": [
      {
        "name": "page1",
        "layoutColumns": [
          { "width": 51 },
          { "width": 47 }
        ],
        "elements": [
          { "type": "text", "name": "q1" },
          { "type": "text", "name": "q2", "startWithNewLine": false }
        ]
      }
    ]
  });

  const page = surveyModel.pages[0];
  assert.equal(page.layoutColumns.length, 2);
  assert.equal(page.layoutColumns[0].effectiveWidth, 51);
  assert.equal(page.layoutColumns[1].effectiveWidth, 47);

  const q3 = surveyModel.getQuestionByName("q2");
  q3.delete();

  assert.equal(page.layoutColumns.length, 1);
  assert.equal(page.layoutColumns[0].effectiveWidth, 51);
});

QUnit.test("question root style", function (assert) {
  const surveyModel = new SurveyModel({
    gridLayoutEnabled: true,
    pages: [
      {
        name: "page1",
        elements: [{ "name": "q1", "type": "text" }]
      }
    ]
  });
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");

  assert.deepEqual(q1.rootStyle, {
    "flexBasis": "100%",
    "flexGrow": 1,
    "flexShrink": 1,
    "maxWidth": "100%",
    "minWidth": "min(100%, 300px)"
  });

  const q2 = new QuestionTextModel("q2");
  q2.startWithNewLine = false;
  page.addElement(q2, 1);

  assert.deepEqual(q1.rootStyle, {
    "flexBasis": "50%",
    "flexGrow": 0,
    "flexShrink": 0,
    "maxWidth": undefined,
    "minWidth": undefined
  });

  assert.deepEqual(q2.rootStyle, {
    "flexBasis": "50%",
    "flexGrow": 0,
    "flexShrink": 0,
    "maxWidth": undefined,
    "minWidth": undefined
  });
});

QUnit.test("layoutColumns: serialize last column", assert => {
  const json = {
    gridLayoutEnabled: true,
    "pages": [
      {
        "name": "page1",
        "elements": [
          { "type": "text", "name": "question1" },
          { "type": "text", "name": "question3", "startWithNewLine": false },
          { "type": "text", "name": "question2", "startWithNewLine": false },
          { "type": "text", "name": "question4" },
          { "type": "text", "name": "question7", "startWithNewLine": false },
          { "type": "text", "name": "question8", "startWithNewLine": false },
          { "type": "text", "name": "question9", "startWithNewLine": false }
        ],
        "layoutColumns": [
          { "width": 10 }
        ]
      }
    ],
  };
  const surveyModel = new SurveyModel(json);
  const page = surveyModel.pages[0];

  assert.deepEqual(page.layoutColumns.length, 4);
  assert.deepEqual(page.layoutColumns[0].width, 10);
  assert.deepEqual(page.layoutColumns[1].effectiveWidth, 30);
  assert.deepEqual(page.layoutColumns[2].effectiveWidth, 30);
  assert.deepEqual(page.layoutColumns[3].effectiveWidth, 30);

  page.layoutColumns[3].width = 10;
  const result = surveyModel.toJSON();
  assert.deepEqual(result["pages"][0]["layoutColumns"], [
    { "width": 10 },
    {},
    {},
    { "width": 10 }
  ]);
});

QUnit.test("layoutColumns: questions with visibleIf", assert => {
  const json = {
    gridLayoutEnabled: true,
    "questions": [
      { "type": "text", "name": "q1" },
      {
        "type": "radiogroup",
        "name": "q2",
        "startWithNewLine": false,
        "choices": ["Yes", "No"],
        "colCount": 0
      },
      {
        "type": "text",
        "name": "q3",
        "visibleIf": "{q2} = 'Yes'",
        "startWithNewLine": false,
      },
      {
        "type": "text",
        "name": "q4",
        "visibleIf": "{q2} = 'No'",
        "startWithNewLine": false,
      },
      {
        "type": "text",
        "name": "q5",
        "visibleIf": "{q2} = 'No'",
        "startWithNewLine": false,
      },
      {
        "type": "text",
        "name": "q6",
        "visibleIf": "{q2} = 'No' and {q5} = 'Yes'",
        "startWithNewLine": false,
      }
    ]
  };
  const surveyModel = new SurveyModel(json);
  const page = surveyModel.pages[0];
  const q1 = surveyModel.getQuestionByName("q1");
  const q2 = surveyModel.getQuestionByName("q2");
  const q3 = surveyModel.getQuestionByName("q3");
  const q4 = surveyModel.getQuestionByName("q4");
  const q5 = surveyModel.getQuestionByName("q5");
  const q6 = surveyModel.getQuestionByName("q6");

  assert.deepEqual(page.layoutColumns.length, 6);
  assert.equal(q1.visible, true, "q1 visible");
  assert.equal(q2.visible, true, "q2 visible");
  assert.equal(q3.visible, false, "q3 visible");
  assert.equal(q4.visible, false, "q4 visible");
  assert.equal(q5.visible, false, "q5 visible");
  assert.equal(q6.visible, false, "q6 visible");

  assert.equal(q1.effectiveColSpan, 1, "q1 effectiveColSpan");
  assert.equal(q2.effectiveColSpan, 1, "q2 effectiveColSpan");

  q2.value = "No";
  assert.equal(q1.visible, true, "q1 visible");
  assert.equal(q2.visible, true, "q2 visible");
  assert.equal(q3.visible, false, "q3 visible");
  assert.equal(q4.visible, true, "q4 visible");
  assert.equal(q5.visible, true, "q5 visible");
  assert.equal(q6.visible, false, "q6 visible");
});

QUnit.skip("Do not call survey.onPropertyValueChangedCallback on loading choicesByUrl, Bug#2563", function (assert) {
  let counter = 0;
  let survey = new SurveyModel({ gridLayoutEnabled: true });
  survey.onPropertyValueChangedCallback = function (name: string, oldValue: any, newValue: any, sender: Base, arrayChanges: ArrayChanges) {
    if (!Serializer.findProperty(sender.getType(), name)) return;
    counter++;
  };
  counter = 0;
  survey.fromJSON({ elements: [{ type: "text", name: "q1" }] });
  assert.equal(counter, 0, "We shouldn't call onPropertyValueChangedCallback on loading from JSON");
});