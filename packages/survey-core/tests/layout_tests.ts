import { ArrayChanges, Base } from "../src/base";
import { Helpers } from "../src/helpers";
import { Serializer } from "../src/jsonobject";
import { QuestionTextModel } from "../src/question_text";
import { SurveyModel } from "../src/survey";
import { floorTo2Decimals } from "../src/utils/utils";

import { describe, test, expect } from "vitest";
describe("Layout:", () => {
  test("columns generate - simple", () => {
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

    expect(page.rows.length, "There are two rows").toLooseEqual(2);
    expect(page.columns.length).toLooseEqual(3);
    expect(page.columns[0].width).toLooseEqual(undefined);
    expect(floorTo2Decimals(page.columns[0].effectiveWidth)).toLooseEqual(33.33);

    expect(page.getColumsForElement(q1).length).toLooseEqual(1);
    expect(page.getColumsForElement(q1), "q1").toEqualValues([page.columns[0]]);
    expect(page.getColumsForElement(q2).length).toLooseEqual(2);
    expect(page.getColumsForElement(q2), "q2").toEqualValues([page.columns[1], page.columns[2]]);
    expect(page.getColumsForElement(q3).length).toLooseEqual(1);
    expect(page.getColumsForElement(q3), "q3").toEqualValues([page.columns[0]]);
    expect(page.getColumsForElement(q4).length).toLooseEqual(2);
    expect(page.getColumsForElement(q4), "q4").toEqualValues([page.columns[1], page.columns[2]]);
  });

  test("columns generate - complex", () => {
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

    expect(page.rows.length, "There are two rows").toLooseEqual(2);
    expect(page.columns.length).toLooseEqual(3);
    expect(page.columns[0].width).toLooseEqual(undefined);
    expect(floorTo2Decimals(page.columns[0].effectiveWidth)).toLooseEqual(33.33);

    expect(Helpers.isTwoValueEquals(page.getColumsForElement(q1), [page.columns[0]]), "q1").toBeTruthy();
    expect(Helpers.isTwoValueEquals(page.getColumsForElement(q2), [page.columns[1], page.columns[1]]), "q2").toBeTruthy();
    expect(Helpers.isTwoValueEquals(page.getColumsForElement(q3), [page.columns[0], page.columns[1]]), "q3").toBeTruthy();
    expect(Helpers.isTwoValueEquals(page.getColumsForElement(q4), [page.columns[1]]), "q4").toBeTruthy();
  });

  test("columns generate - title width", () => {
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

    expect(q1.titleWidth).toEqualValues(undefined);
    expect(q2.titleWidth).toEqualValues(undefined);
    expect(q3.titleWidth).toEqualValues(undefined);
    expect(q4.titleWidth).toEqualValues(undefined);

    page.questionTitleLocation = "left";
    expect(q1.titleWidth).toEqualValues("25%");
    expect(q2.titleWidth).toEqualValues("12.5%");
    expect(q3.titleWidth).toEqualValues("12.5%");
    expect(q4.titleWidth).toEqualValues("25%");
  });
  test("title width & titleLocation left & delete question, #8686", () => {
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
    expect(q1.titleWidth).toBeFalsy();
  });

  test("user columns de/serialization", () => {
    const surveyModel = new SurveyModel({
      gridLayoutEnabled: true,
      pages: [
        {
          name: "page1",
          gridLayoutColumns: [
            { "width": 40, },
            {
              "width": 45,
              "questionTitleWidth": "200px"
            }]
        }]
    });
    const page = surveyModel.pages[0];

    expect(page.gridLayoutColumns.length).toEqualValues(2);
    expect(page.gridLayoutColumns[0].width).toEqualValues(40);
    expect(page.gridLayoutColumns[0].questionTitleWidth).toEqualValues(undefined);
    expect(page.gridLayoutColumns[1].width).toEqualValues(45);
    expect(page.gridLayoutColumns[1].questionTitleWidth).toEqualValues("200px");

    page.gridLayoutColumns[0].width = 70;
    page.gridLayoutColumns[0].questionTitleWidth = "300px";
    const result = surveyModel.toJSON();
    expect(result).toEqualValues({
      gridLayoutEnabled: true,
      pages: [
        {
          name: "page1",
          gridLayoutColumns: [{
            "questionTitleWidth": "300px",
            "width": 70,
          }, {
            "questionTitleWidth": "200px",
            "width": 45,
          }],
        }]
    });
  });

  test("layout columns de/serialization", () => {
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
    expect(page.gridLayoutColumns.length).toLooseEqual(3);

    const result = surveyModel.toJSON();
    expect(result).toEqualValues(json);
  });

  test("apply columns from gridLayoutColumns #1", () => {
    const surveyModel = new SurveyModel({
      gridLayoutEnabled: true,
      pages: [
        {
          name: "page1",
          gridLayoutColumns: [
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
    expect(page.getPropertyValue("gridLayoutColumns").length, "Do not do calculation").toLooseEqual(1);
    expect(page.gridLayoutColumns.length, "Do calculation").toLooseEqual(2);

    expect(page.columns.length).toEqualValues(2);
    expect(page.columns[0].width).toEqualValues(40);
    expect(page.columns[0].effectiveWidth).toEqualValues(40);
    expect(page.columns[1].width).toEqualValues(undefined);
    expect(page.columns[1].effectiveWidth).toEqualValues(60);

    expect(q1.rootStyle["flexBasis"]).toLooseEqual("40%");
    expect(q2.rootStyle["flexBasis"]).toLooseEqual("60%");
  });

  test("apply columns from gridLayoutColumns #2", () => {
    const surveyModel = new SurveyModel({
      gridLayoutEnabled: true,
      pages: [
        {
          name: "page1",
          gridLayoutColumns: [
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

    expect(page.columns.length).toEqualValues(4);
    expect(page.columns[0].width).toEqualValues(20);
    expect(page.columns[1].width).toEqualValues(30);
    expect(page.columns[2].width).toEqualValues(25);
    expect(page.columns[3].width).toEqualValues(25);

    expect(q1.rootStyle["flexBasis"], "q1 rootStyle flexBasis").toLooseEqual("20%");
    expect(q2.rootStyle["flexBasis"], "q2 rootStyle flexBasis").toLooseEqual("30%");
    expect(q3.rootStyle["flexBasis"], "q3 rootStyle flexBasis").toLooseEqual("50%");
  });

  test("apply columns from gridLayoutColumns with given colSpan", () => {
    const surveyModel = new SurveyModel({
      gridLayoutEnabled: true,
      pages: [
        {
          name: "page1",
          gridLayoutColumns: [
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

    expect(page.columns.length).toEqualValues(3);
    expect(page.columns[0].width).toEqualValues(20);
    expect(page.columns[1].width).toEqualValues(30);
    expect(page.columns[2].width).toEqualValues(25);

    expect(q1.rootStyle["flexBasis"], "q1 rootStyle flexBasis").toLooseEqual("20%");
    expect(q2.rootStyle["flexBasis"], "q2 rootStyle flexBasis").toLooseEqual("30%");
    expect(q3.rootStyle["flexBasis"], "q3 rootStyle flexBasis").toLooseEqual("25%");
  });

  test("check question width if column width is set for only one column", () => {
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
          "gridLayoutColumns": [
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

    expect(page.columns.length).toEqualValues(3);
    expect(page.columns[0].width).toEqualValues(25);
    expect(page.columns[0].effectiveWidth).toEqualValues(25);
    expect(page.columns[1].width).toEqualValues(undefined);
    expect(page.columns[1].effectiveWidth).toEqualValues(37.5);
    expect(page.columns[2].width).toEqualValues(undefined);
    expect(page.columns[2].effectiveWidth).toEqualValues(37.5);

    expect(q1.rootStyle["flexBasis"], "q1 rootStyle flexBasis").toLooseEqual("25%");
    expect(q2.rootStyle["flexBasis"], "q2 rootStyle flexBasis").toLooseEqual("75%");
  });

  test("effectiveColSpan #1", () => {
    const surveyModel = new SurveyModel({
      gridLayoutEnabled: true,
      "elements": [
        { "type": "text", "name": "q1" },
        {
          "type": "text",
          "name": "q2",
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

    const q1 = surveyModel.getQuestionByName("q1");
    const q2 = surveyModel.getQuestionByName("q2");
    const q3 = surveyModel.getQuestionByName("q3");
    const q4 = surveyModel.getQuestionByName("q4");
    const page = surveyModel.pages[0];

    expect(page.gridLayoutColumns.length, "#0").toEqualValues(2);
    expect(q1.effectiveColSpan, "q1 effectiveColSpan #0").toLooseEqual(1);
    expect(q2.effectiveColSpan, "q2 effectiveColSpan #0").toLooseEqual(1);
    expect(q3.effectiveColSpan, "q3 effectiveColSpan #0").toLooseEqual(1);
    expect(q4.effectiveColSpan, "q4 effectiveColSpan #0").toLooseEqual(1);

    q2.colSpan = 2;
    expect(page.gridLayoutColumns.length, "#1").toEqualValues(3);
    expect(q1.colSpan, "q1 colSpan #1").toLooseEqual(1);
    expect(q1.effectiveColSpan, "q1 effectiveColSpan #1").toLooseEqual(1);
    expect(q2.colSpan, "q2 colSpan #1").toLooseEqual(2);
    expect(q2.effectiveColSpan, "q2 effectiveColSpan #1").toLooseEqual(2);
    expect(q3.colSpan, "q3 colSpan #1").toLooseEqual(1);
    expect(q3.effectiveColSpan, "q3 effectiveColSpan #1").toLooseEqual(1);
    expect(q4.colSpan, "q4 colSpan #1").toLooseEqual(1);
    expect(q4.effectiveColSpan, "q4 effectiveColSpan #1").toLooseEqual(2);

    q3.colSpan = 2;
    expect(page.gridLayoutColumns.length, "#2").toEqualValues(3);
    expect(q1.colSpan, "q1 colSpan #2").toLooseEqual(1);
    expect(q1.effectiveColSpan, "q1 effectiveColSpan #2").toLooseEqual(1);
    expect(q2.colSpan, "q2 colSpan #2").toLooseEqual(2);
    expect(q2.effectiveColSpan, "q2 effectiveColSpan #2").toLooseEqual(2);
    expect(q3.colSpan, "q3 colSpan #2").toLooseEqual(2);
    expect(q3.effectiveColSpan, "q3 effectiveColSpan #2").toLooseEqual(2);
    expect(q4.colSpan, "q4 colSpan #2").toLooseEqual(1);
    expect(q4.effectiveColSpan, "q4 effectiveColSpan #2").toLooseEqual(1);
  });

  test("columns effectiveWidth #1", () => {
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
          "gridLayoutColumns": [
            { "width": 25 },
            { "width": 30 },
            { "width": 35 }
          ]
        }
      ]
    });

    const page = surveyModel.pages[0];

    expect(page.gridLayoutColumns.length).toLooseEqual(4);
    expect(page.gridLayoutColumns[0].effectiveWidth).toLooseEqual(25);
    expect(page.gridLayoutColumns[1].effectiveWidth).toLooseEqual(30);
    expect(page.gridLayoutColumns[2].effectiveWidth).toLooseEqual(35);
    expect(page.gridLayoutColumns[3].effectiveWidth).toLooseEqual(10);
    expect(page.gridLayoutColumns[3].width).toLooseEqual(undefined);

    page.gridLayoutColumns[0].effectiveWidth = 20;
    expect(page.gridLayoutColumns[0].effectiveWidth).toLooseEqual(20);
    expect(page.gridLayoutColumns[0].width).toLooseEqual(20);
    expect(page.gridLayoutColumns[1].effectiveWidth).toLooseEqual(30);
    expect(page.gridLayoutColumns[2].effectiveWidth).toLooseEqual(35);
    expect(page.gridLayoutColumns[3].effectiveWidth).toLooseEqual(15);
    expect(page.gridLayoutColumns[3].width).toLooseEqual(undefined);
  });

  test("colSpan for first row", () => {
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

    expect(page.gridLayoutColumns.length).toLooseEqual(3);
    expect(q1.effectiveColSpan, "q1 effectiveColSpan").toLooseEqual(1);
    expect(q2.effectiveColSpan, "q2 effectiveColSpan").toLooseEqual(2);
    expect(q3.effectiveColSpan, "q3 effectiveColSpan").toLooseEqual(3);
    expect(q4.effectiveColSpan, "q4 effectiveColSpan").toLooseEqual(3);
  });

  test("expand last question in row whitch does not have colSpan set", () => {
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

    expect(page.gridLayoutColumns.length).toLooseEqual(5);
    expect(q9.effectiveColSpan, "q9 effectiveColSpan").toLooseEqual(3);
    expect(q10.effectiveColSpan, "q10 effectiveColSpan").toLooseEqual(2);
  });

  test("recalculate column width after question added", () => {
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

    expect(page.gridLayoutColumns.length).toLooseEqual(2);
    expect(page.gridLayoutColumns[0].effectiveWidth).toLooseEqual(50);
    expect(page.gridLayoutColumns[1].effectiveWidth).toLooseEqual(50);

    const q3 = new QuestionTextModel("q3");
    q3.startWithNewLine = false;
    page.addElement(q3, 2);
    expect(page.gridLayoutColumns.length).toLooseEqual(3);
    expect(page.gridLayoutColumns[0].effectiveWidth).toLooseEqual(33.33);
    expect(page.gridLayoutColumns[1].effectiveWidth).toLooseEqual(33.33);
    expect(page.gridLayoutColumns[2].effectiveWidth).toLooseEqual(33.33);
  });

  test("recalculate column width after question deleted", () => {
    const surveyModel = new SurveyModel({
      gridLayoutEnabled: true,
      "pages": [
        {
          "name": "page1",
          "gridLayoutColumns": [
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
    expect(page.gridLayoutColumns.length).toLooseEqual(2);
    expect(page.gridLayoutColumns[0].effectiveWidth).toLooseEqual(51);
    expect(page.gridLayoutColumns[1].effectiveWidth).toLooseEqual(47);

    const q3 = surveyModel.getQuestionByName("q2");
    q3.delete();

    expect(page.gridLayoutColumns.length).toLooseEqual(1);
    expect(page.gridLayoutColumns[0].effectiveWidth).toLooseEqual(51);
  });

  test("question root style", () => {
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

    expect(q1.rootStyle, "#1").toEqualValues({
      "flexBasis": "100%",
      "flexGrow": 1,
      "flexShrink": 1,
      "maxWidth": "100%",
      "minWidth": "min(100%, 300px)"
    });

    const q2 = new QuestionTextModel("q2");
    q2.startWithNewLine = false;
    page.addElement(q2, 1);

    expect(q1.rootStyle, "#2").toEqualValues({
      "flexBasis": "50%",
      "flexGrow": 1,
      "flexShrink": 0,
      "maxWidth": "100%",
      "minWidth": undefined
    });

    expect(q2.rootStyle, "#3").toEqualValues({
      "flexBasis": "50%",
      "flexGrow": 1,
      "flexShrink": 0,
      "maxWidth": "100%",
      "minWidth": undefined
    });
  });

  test("gridLayoutColumns: serialize last column", () => {
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
          "gridLayoutColumns": [
            { "width": 10 }
          ]
        }
      ],
    };
    const surveyModel = new SurveyModel(json);
    const page = surveyModel.pages[0];

    expect(page.gridLayoutColumns.length).toEqualValues(4);
    expect(page.gridLayoutColumns[0].width).toEqualValues(10);
    expect(page.gridLayoutColumns[1].effectiveWidth).toEqualValues(30);
    expect(page.gridLayoutColumns[2].effectiveWidth).toEqualValues(30);
    expect(page.gridLayoutColumns[3].effectiveWidth).toEqualValues(30);

    page.gridLayoutColumns[3].width = 10;
    const result = surveyModel.toJSON();
    expect(result["pages"][0]["gridLayoutColumns"]).toEqualValues([
      { "width": 10 },
      {},
      {},
      { "width": 10 }
    ]);
  });

  test("gridLayoutColumns: questions with visibleIf", () => {
    const json = {
      gridLayoutEnabled: true,
      "elements": [
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

    expect(page.gridLayoutColumns.length).toEqualValues(6);
    expect(q1.visible, "q1 visible").toLooseEqual(true);
    expect(q2.visible, "q2 visible").toLooseEqual(true);
    expect(q3.visible, "q3 visible").toLooseEqual(false);
    expect(q4.visible, "q4 visible").toLooseEqual(false);
    expect(q5.visible, "q5 visible").toLooseEqual(false);
    expect(q6.visible, "q6 visible").toLooseEqual(false);

    expect(q1.effectiveColSpan, "q1 effectiveColSpan").toLooseEqual(1);
    expect(q2.effectiveColSpan, "q2 effectiveColSpan").toLooseEqual(1);

    q2.value = "No";
    expect(q1.visible, "q1 visible").toLooseEqual(true);
    expect(q2.visible, "q2 visible").toLooseEqual(true);
    expect(q3.visible, "q3 visible").toLooseEqual(false);
    expect(q4.visible, "q4 visible").toLooseEqual(true);
    expect(q5.visible, "q5 visible").toLooseEqual(true);
    expect(q6.visible, "q6 visible").toLooseEqual(false);
  });

  test("Do not call survey.onPropertyValueChangedCallback on loading choicesByUrl, Bug#2563", () => {
    let counter = 0;
    let survey = new SurveyModel({ gridLayoutEnabled: true });
    survey.onPropertyValueChangedCallback = function (name: string, oldValue: any, newValue: any, sender: Base, arrayChanges: ArrayChanges) {
      if (!Serializer.findProperty(sender.getType(), name)) return;
      counter++;
    };
    counter = 0;
    survey.fromJSON({ elements: [{ type: "text", name: "q1" }] });
    expect(counter, "We shouldn't call onPropertyValueChangedCallback on loading from JSON").toLooseEqual(0);
  });

  test("gridLayoutColumns: 1 - 3 - 2 layout", () => {
    const json = {
      gridLayoutEnabled: true,
      "widthMode": "static",
      "width": "1200px",
      "elements": [
        { "type": "text", "name": "street-address" },

        { "type": "text", "name": "city" },
        { "type": "text", "name": "zip", "startWithNewLine": false },
        { "type": "dropdown", "name": "country", "startWithNewLine": false, "choices": ["Yes", "No"], },

        { "type": "boolean", "name": "used-as-main-residence", },
        { "type": "boolean", "name": "used-for-business", "startWithNewLine": false }
      ]
    };

    const surveyModel = new SurveyModel(json);
    const page = surveyModel.pages[0];

    expect(page.gridLayoutColumns.length).toEqualValues(3);
  });

  test("gridLayoutColumns: 2 - 2 - 3 layout", () => {
    const json = {
      gridLayoutEnabled: true,
      "widthMode": "static",
      "width": "1200px",
      "elements": [
        {
          "type": "multipletext",
          "name": "full-name",
          "items": [
            { "name": "first-name", "title": "First name" },
            { "name": "last-name", "title": "Last name" }
          ]
        },
        {
          "type": "multipletext",
          "name": "birth-info",
          "startWithNewLine": false,
          "items": [
            { "name": "birthplace", "title": "Place of birth" },
            { "name": "birthdate", "inputType": "date", "title": "Date of birth" }
          ]
        },
        {
          "type": "text",
          "name": "phone",
          "title": "Phone number",
          "titleLocation": "top",
        },
        {
          "type": "text",
          "name": "question1",
          "startWithNewLine": false,
          "title": "Street address",
          "titleLocation": "top"
        },
        {
          "type": "text",
          "name": "city1",
          "title": "City/Town",
          "titleLocation": "top"
        },
        {
          "type": "text",
          "name": "zip1",
          "startWithNewLine": false,
          "title": "Zip Code",
          "titleLocation": "top"
        },
        {
          "type": "dropdown",
          "name": "country1",
          "startWithNewLine": false,
          "title": "Country",
          "titleLocation": "top",
          "choices": ["Yes", "No"],
        }
      ]
    };

    const surveyModel = new SurveyModel(json);
    const page = surveyModel.pages[0];

    expect(page.gridLayoutColumns.length).toEqualValues(3);
  });

  test("Update gridLayoutColumns after gridLayoutEnabled changed", () => {
    const json = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            { "type": "text", "name": "question1" },
            { "type": "text", "name": "question2", "startWithNewLine": false },
            { "type": "text", "name": "question3" },
            { "type": "text", "name": "question4", "startWithNewLine": false }
          ]
        }
      ]
    };
    const surveyModel = new SurveyModel(json);
    const page = surveyModel.pages[0];
    expect(page.gridLayoutColumns.length, "#1").toEqualValues(0);

    surveyModel.gridLayoutEnabled = true;
    expect(page.gridLayoutColumns.length, "#2").toEqualValues(2);

    surveyModel.gridLayoutEnabled = false;
    expect(page.gridLayoutColumns.length, "#3").toEqualValues(2);
  });
});
