import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey");

QUnit.test("Survey widthMode property for startWithNewLine questions", function (assert) {
  var survey = new SurveyModel({
    widthMode: "static",
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "name1",
          },
          {
            type: "text",
            name: "name2",
          },
          {
            type: "text",
            name: "name3",
          },
          {
            type: "text",
            name: "name4",
          },
        ],
      },
    ]
  });
  assert.equal(survey.widthMode, "static");
  assert.equal(survey.calculateWidthMode(), "static", "calculate width for linear veritical survey");

  survey.getQuestionByName("name2").startWithNewLine = false;
  assert.equal(survey.calculateWidthMode(), "static", "calculate width 2 startWithNewLine");

  survey.getQuestionByName("name3").startWithNewLine = false;
  assert.equal(survey.calculateWidthMode(), "responsive", "calculate width 3 startWithNewLine");
});

QUnit.test("Survey widthMode property for panel questions", function (assert) {
  var survey = new SurveyModel({
    widthMode: "static",
    pages: [
      {
        "elements": [
          {
            "type": "panel",
            "elements": [
              {
                "type": "panel",
                "elements": [
                  {
                    "name": "q1",
                  }
                ],
                "name": "panel2"
              }, {
                "type": "panel",
                "elements": [
                  {
                    "name": "q3",
                  },
                  {
                    "name": "q4",
                  }
                ],
                "name": "panel1",
                "startWithNewLine": false
              }
            ],
            "name": "panel5",
          }
        ],
        "name": "page2"
      },
    ]
  });
  //debugger;
  assert.equal(survey.calculateWidthMode(), "responsive", "calculate width for panel survey");
});

QUnit.test("Survey widthMode property for matrices questions", function (assert) {
  var survey3 = new SurveyModel({
    pages: [
      {
        "elements": [
          {
            "type": "matrix",
            "name": "question1",
            "columns": [
              "Column 1",
              "Column 2",
              "Column 3"
            ],
            "rows": [
              "Row 1",
              "Row 2"
            ]
          },
          {
            "type": "text",
            "name": "question2"
          }
        ]
      },
    ]
  });
  assert.equal(survey3.widthMode, "auto");
  assert.equal(survey3.calculateWidthMode(), "responsive", "calculate width for survey with matrices");
});
