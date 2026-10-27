import { ArrayChanges, Base } from "../src/base";
import { Helpers } from "../src/helpers";
import { Serializer } from "../src/jsonobject";
import { PanelModel, PanelModelBase } from "../src/panel";
import { QuestionTextModel } from "../src/question_text";
import { SurveyModel } from "../src/survey";
import { SurveyElement } from "../src/survey-element";
import { floorTo2Decimals } from "../src/utils/utils";

import { describe, test, expect, vi } from "vitest";
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

    expect(page.rows.length, "There are two rows").toBe(2);
    expect(page.columns.length).toBe(3);
    expect(page.columns[0].width).toBeUndefined();
    expect(floorTo2Decimals(page.columns[0].effectiveWidth)).toBe(33.33);

    expect(page.getColumsForElement(q1).length).toBe(1);
    expect(page.getColumsForElement(q1), "q1").toEqual([page.columns[0]]);
    expect(page.getColumsForElement(q2).length).toBe(2);
    expect(page.getColumsForElement(q2), "q2").toEqual([page.columns[1], page.columns[2]]);
    expect(page.getColumsForElement(q3).length).toBe(1);
    expect(page.getColumsForElement(q3), "q3").toEqual([page.columns[0]]);
    expect(page.getColumsForElement(q4).length).toBe(2);
    expect(page.getColumsForElement(q4), "q4").toEqual([page.columns[1], page.columns[2]]);
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

    expect(page.rows.length, "There are two rows").toBe(2);
    expect(page.columns.length).toBe(3);
    expect(page.columns[0].width).toBeUndefined();
    expect(floorTo2Decimals(page.columns[0].effectiveWidth)).toBe(33.33);

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

    expect(q1.titleWidth).toEqual(undefined);
    expect(q2.titleWidth).toEqual(undefined);
    expect(q3.titleWidth).toEqual(undefined);
    expect(q4.titleWidth).toEqual(undefined);

    page.questionTitleLocation = "left";
    expect(q1.titleWidth).toEqual("25%");
    expect(q2.titleWidth).toEqual("12.5%");
    expect(q3.titleWidth).toEqual("12.5%");
    expect(q4.titleWidth).toEqual("25%");
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

    expect(page.gridLayoutColumns.length).toEqual(2);
    expect(page.gridLayoutColumns[0].width).toEqual(40);
    expect(page.gridLayoutColumns[0].questionTitleWidth).toEqual(undefined);
    expect(page.gridLayoutColumns[1].width).toEqual(45);
    expect(page.gridLayoutColumns[1].questionTitleWidth).toEqual("200px");

    page.gridLayoutColumns[0].width = 70;
    page.gridLayoutColumns[0].questionTitleWidth = "300px";
    const result = surveyModel.toJSON();
    expect(result).toEqual({
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
    expect(page.gridLayoutColumns.length).toBe(3);

    const result = surveyModel.toJSON();
    expect(result).toEqual(json);
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
    expect(page.getPropertyValue("gridLayoutColumns").length, "Do not do calculation").toBe(1);
    expect(page.gridLayoutColumns.length, "Do calculation").toBe(2);

    expect(page.columns.length).toEqual(2);
    expect(page.columns[0].width).toEqual(40);
    expect(page.columns[0].effectiveWidth).toEqual(40);
    expect(page.columns[1].width).toEqual(undefined);
    expect(page.columns[1].effectiveWidth).toEqual(60);

    expect(q1.rootStyle["flexBasis"]).toBe("40%");
    expect(q2.rootStyle["flexBasis"]).toBe("60%");
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

    expect(page.columns.length).toEqual(4);
    expect(page.columns[0].width).toEqual(20);
    expect(page.columns[1].width).toEqual(30);
    expect(page.columns[2].width).toEqual(25);
    expect(page.columns[3].width).toEqual(25);

    expect(q1.rootStyle["flexBasis"], "q1 rootStyle flexBasis").toBe("20%");
    expect(q2.rootStyle["flexBasis"], "q2 rootStyle flexBasis").toBe("30%");
    expect(q3.rootStyle["flexBasis"], "q3 rootStyle flexBasis").toBe("50%");
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

    expect(page.columns.length).toEqual(3);
    expect(page.columns[0].width).toEqual(20);
    expect(page.columns[1].width).toEqual(30);
    expect(page.columns[2].width).toEqual(25);

    expect(q1.rootStyle["flexBasis"], "q1 rootStyle flexBasis").toBe("20%");
    expect(q2.rootStyle["flexBasis"], "q2 rootStyle flexBasis").toBe("30%");
    expect(q3.rootStyle["flexBasis"], "q3 rootStyle flexBasis").toBe("25%");
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

    expect(page.columns.length).toEqual(3);
    expect(page.columns[0].width).toEqual(25);
    expect(page.columns[0].effectiveWidth).toEqual(25);
    expect(page.columns[1].width).toEqual(undefined);
    expect(page.columns[1].effectiveWidth).toEqual(37.5);
    expect(page.columns[2].width).toEqual(undefined);
    expect(page.columns[2].effectiveWidth).toEqual(37.5);

    expect(q1.rootStyle["flexBasis"], "q1 rootStyle flexBasis").toBe("25%");
    expect(q2.rootStyle["flexBasis"], "q2 rootStyle flexBasis").toBe("75%");
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

    expect(page.gridLayoutColumns.length, "#0").toEqual(2);
    expect(q1.effectiveColSpan, "q1 effectiveColSpan #0").toBe(1);
    expect(q2.effectiveColSpan, "q2 effectiveColSpan #0").toBe(1);
    expect(q3.effectiveColSpan, "q3 effectiveColSpan #0").toBe(1);
    expect(q4.effectiveColSpan, "q4 effectiveColSpan #0").toBe(1);

    q2.colSpan = 2;
    expect(page.gridLayoutColumns.length, "#1").toEqual(3);
    expect(q1.colSpan, "q1 colSpan #1").toBe(1);
    expect(q1.effectiveColSpan, "q1 effectiveColSpan #1").toBe(1);
    expect(q2.colSpan, "q2 colSpan #1").toBe(2);
    expect(q2.effectiveColSpan, "q2 effectiveColSpan #1").toBe(2);
    expect(q3.colSpan, "q3 colSpan #1").toBe(1);
    expect(q3.effectiveColSpan, "q3 effectiveColSpan #1").toBe(1);
    expect(q4.colSpan, "q4 colSpan #1").toBe(1);
    expect(q4.effectiveColSpan, "q4 effectiveColSpan #1").toBe(2);

    q3.colSpan = 2;
    expect(page.gridLayoutColumns.length, "#2").toEqual(3);
    expect(q1.colSpan, "q1 colSpan #2").toBe(1);
    expect(q1.effectiveColSpan, "q1 effectiveColSpan #2").toBe(1);
    expect(q2.colSpan, "q2 colSpan #2").toBe(2);
    expect(q2.effectiveColSpan, "q2 effectiveColSpan #2").toBe(2);
    expect(q3.colSpan, "q3 colSpan #2").toBe(2);
    expect(q3.effectiveColSpan, "q3 effectiveColSpan #2").toBe(2);
    expect(q4.colSpan, "q4 colSpan #2").toBe(1);
    expect(q4.effectiveColSpan, "q4 effectiveColSpan #2").toBe(1);
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

    expect(page.gridLayoutColumns.length).toBe(4);
    expect(page.gridLayoutColumns[0].effectiveWidth).toBe(25);
    expect(page.gridLayoutColumns[1].effectiveWidth).toBe(30);
    expect(page.gridLayoutColumns[2].effectiveWidth).toBe(35);
    expect(page.gridLayoutColumns[3].effectiveWidth).toBe(10);
    expect(page.gridLayoutColumns[3].width).toBeUndefined();

    page.gridLayoutColumns[0].effectiveWidth = 20;
    expect(page.gridLayoutColumns[0].effectiveWidth).toBe(20);
    expect(page.gridLayoutColumns[0].width).toBe(20);
    expect(page.gridLayoutColumns[1].effectiveWidth).toBe(30);
    expect(page.gridLayoutColumns[2].effectiveWidth).toBe(35);
    expect(page.gridLayoutColumns[3].effectiveWidth).toBe(15);
    expect(page.gridLayoutColumns[3].width).toBeUndefined();
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

    expect(page.gridLayoutColumns.length).toBe(3);
    expect(q1.effectiveColSpan, "q1 effectiveColSpan").toBe(1);
    expect(q2.effectiveColSpan, "q2 effectiveColSpan").toBe(2);
    expect(q3.effectiveColSpan, "q3 effectiveColSpan").toBe(3);
    expect(q4.effectiveColSpan, "q4 effectiveColSpan").toBe(3);
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

    expect(page.gridLayoutColumns.length).toBe(5);
    expect(q9.effectiveColSpan, "q9 effectiveColSpan").toBe(3);
    expect(q10.effectiveColSpan, "q10 effectiveColSpan").toBe(2);
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

    expect(page.gridLayoutColumns.length).toBe(2);
    expect(page.gridLayoutColumns[0].effectiveWidth).toBe(50);
    expect(page.gridLayoutColumns[1].effectiveWidth).toBe(50);

    const q3 = new QuestionTextModel("q3");
    q3.startWithNewLine = false;
    page.addElement(q3, 2);
    expect(page.gridLayoutColumns.length).toBe(3);
    expect(page.gridLayoutColumns[0].effectiveWidth).toBe(33.33);
    expect(page.gridLayoutColumns[1].effectiveWidth).toBe(33.33);
    expect(page.gridLayoutColumns[2].effectiveWidth).toBe(33.33);
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
    expect(page.gridLayoutColumns.length).toBe(2);
    expect(page.gridLayoutColumns[0].effectiveWidth).toBe(51);
    expect(page.gridLayoutColumns[1].effectiveWidth).toBe(47);

    const q3 = surveyModel.getQuestionByName("q2");
    q3.delete();

    expect(page.gridLayoutColumns.length).toBe(1);
    expect(page.gridLayoutColumns[0].effectiveWidth).toBe(51);
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

    expect(q1.rootStyle, "#1").toEqual({
      "flexBasis": "100%",
      "flexGrow": 1,
      "flexShrink": 1
    });
    expect(q1.isInGridColumn, "q1 spans the whole row").toBe(false);
    expect(q1.getWrapperCss(), "q1 wrapper css")
      .toBe("sd-element-wrapper sd-element-wrapper--min-width");

    const q2 = new QuestionTextModel("q2");
    q2.startWithNewLine = false;
    page.addElement(q2, 1);

    expect(q1.rootStyle, "#2").toEqual({
      "flexBasis": "50%",
      "flexGrow": 1,
      "flexShrink": 0
    });

    expect(q2.rootStyle, "#3").toEqual({
      "flexBasis": "50%",
      "flexGrow": 1,
      "flexShrink": 0
    });

    // Elements sized by grid columns must not get the default element min-width from CSS.
    expect(q1.isInGridColumn, "q1 is in a grid column").toBe(true);
    expect(q1.getWrapperCss(), "q1 wrapper css").toBe("sd-element-wrapper");
    expect(q2.getWrapperCss(), "q2 wrapper css").toBe("sd-element-wrapper");
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

    expect(page.gridLayoutColumns.length).toEqual(4);
    expect(page.gridLayoutColumns[0].width).toEqual(10);
    expect(page.gridLayoutColumns[1].effectiveWidth).toEqual(30);
    expect(page.gridLayoutColumns[2].effectiveWidth).toEqual(30);
    expect(page.gridLayoutColumns[3].effectiveWidth).toEqual(30);

    page.gridLayoutColumns[3].width = 10;
    const result = surveyModel.toJSON();
    expect(result["pages"][0]["gridLayoutColumns"]).toEqual([
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

    expect(page.gridLayoutColumns.length).toEqual(6);
    expect(q1.visible, "q1 visible").toBe(true);
    expect(q2.visible, "q2 visible").toBe(true);
    expect(q3.visible, "q3 visible").toBe(false);
    expect(q4.visible, "q4 visible").toBe(false);
    expect(q5.visible, "q5 visible").toBe(false);
    expect(q6.visible, "q6 visible").toBe(false);

    expect(q1.effectiveColSpan, "q1 effectiveColSpan").toBe(1);
    expect(q2.effectiveColSpan, "q2 effectiveColSpan").toBe(1);

    q2.value = "No";
    expect(q1.visible, "q1 visible").toBe(true);
    expect(q2.visible, "q2 visible").toBe(true);
    expect(q3.visible, "q3 visible").toBe(false);
    expect(q4.visible, "q4 visible").toBe(true);
    expect(q5.visible, "q5 visible").toBe(true);
    expect(q6.visible, "q6 visible").toBe(false);
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
    expect(counter, "We shouldn't call onPropertyValueChangedCallback on loading from JSON").toBe(0);
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

    expect(page.gridLayoutColumns.length).toEqual(3);
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

    expect(page.gridLayoutColumns.length).toEqual(3);
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
    expect(page.gridLayoutColumns.length, "#1").toEqual(0);

    surveyModel.gridLayoutEnabled = true;
    expect(page.gridLayoutColumns.length, "#2").toEqual(2);

    surveyModel.gridLayoutEnabled = false;
    expect(page.gridLayoutColumns.length, "#3").toEqual(2);
  });
});

describe("Layout: elements added while the survey loads", () => {
  function addText(container: PanelModelBase, name: string, startWithNewLine: boolean = true): QuestionTextModel {
    const q = new QuestionTextModel(name);
    q.startWithNewLine = startWithNewLine;
    container.addElement(q);
    return q;
  }
  function getColumnWidths(container: PanelModelBase): Array<number> {
    return container.gridLayoutColumns.map(col => col.effectiveWidth);
  }
  function getRowNames(container: PanelModelBase): Array<Array<string>> {
    return container.rows.map(row => row.elements.map(el => el.name));
  }
  const fullRowStyle = { flexGrow: 1, flexShrink: 1, flexBasis: "100%" };

  // The page is shown, so its rows are not rebuilt after loading: it keeps the row [q1], and q2 and q3 get no root style.
  // Built without loading, the page has one row of three 33.33% columns. This test pins the current behavior.
  [true, false].forEach(isCached => {
    test("elements added to a rendered page keep the current layout, " + (isCached ? "cached" : "uncached"), () => {
      const survey = new SurveyModel({ gridLayoutEnabled: true, elements: [{ type: "text", name: "q1" }] });
      const page = survey.pages[0];
      const q1 = survey.getQuestionByName("q1");
      expect(page.wasRendered, "the current page is rendered").toBe(true);
      if (isCached) {
        expect(getColumnWidths(page), "page columns before loading").toEqual([100]);
        expect(q1.rootStyle, "q1 before loading").toEqual(fullRowStyle);
      }
      survey.startLoadingFromJson();
      const q2 = addText(page, "q2", false);
      const q3 = addText(page, "q3", false);
      survey.endLoadingFromJson();

      expect(getRowNames(page), "page rows").toEqual([["q1"]]);
      expect(getColumnWidths(page), "page columns").toEqual([100]);
      expect(q1.rootStyle, "q1").toEqual(fullRowStyle);
      expect(q2.rootStyle, "q2").toEqual({});
      expect(q3.rootStyle, "q3").toEqual({});
    });
  });

  // As above, and the panel added while loading never builds rows, so it has no columns.
  [true, false].forEach(isCached => {
    test("elements added to a nested panel of a rendered page keep the current layout, " + (isCached ? "cached" : "uncached"), () => {
      const survey = new SurveyModel({ gridLayoutEnabled: true, elements: [{ type: "text", name: "q1" }] });
      const page = survey.pages[0];
      const q1 = survey.getQuestionByName("q1");
      if (isCached) {
        expect(getColumnWidths(page), "page columns before loading").toEqual([100]);
        expect(q1.rootStyle, "q1 before loading").toEqual(fullRowStyle);
      }
      survey.startLoadingFromJson();
      const panel = new PanelModel("panel1");
      page.addElement(panel);
      const q2 = addText(panel, "q2", false);
      const q3 = addText(panel, "q3", false);
      survey.endLoadingFromJson();

      expect(getRowNames(page), "page rows").toEqual([["q1"]]);
      expect(getRowNames(panel), "panel rows").toEqual([]);
      expect(getColumnWidths(page), "page columns").toEqual([100]);
      expect(getColumnWidths(panel), "panel columns").toEqual([]);
      expect(q1.rootStyle, "q1").toEqual(fullRowStyle);
      expect(panel.rootStyle, "panel").toEqual({});
      expect(q2.rootStyle, "q2").toEqual({});
      expect(q3.rootStyle, "q3").toEqual({});
    });
  });

  test("a page added while the survey loads and rendered after it has the same layout as without loading", () => {
    const buildLayout = (isLoading: boolean): any => {
      const survey = new SurveyModel({ gridLayoutEnabled: true, elements: [{ type: "text", name: "q1" }] });
      if (isLoading) survey.startLoadingFromJson();
      const page = survey.addNewPage("page2");
      const panel = new PanelModel("panel1");
      page.addElement(panel);
      const questions = [addText(panel, "q2"), addText(panel, "q3", false), addText(panel, "q4", false)];
      if (isLoading) survey.endLoadingFromJson();
      survey.currentPage = page;
      return {
        pageColumns: getColumnWidths(page),
        panelColumns: getColumnWidths(panel),
        panelRows: getRowNames(panel),
        panelStyle: panel.rootStyle,
        questionStyles: questions.map(q => q.rootStyle)
      };
    };
    const expected = buildLayout(false);
    expect(expected.panelColumns, "the panel has three columns").toEqual([33.33, 33.33, 33.33]);
    expect(buildLayout(true)).toEqual(expected);
  });

  // Counts SurveyElement.updateRootStyle calls on this survey's elements. Before the columns update was deferred:
  // 37,375 while loading (the page's subtree on each panel add, 25,875, plus the panel's subtree on each question add, 11,500)
  // and 0 in endLoadingFromJson().
  test("adding elements while the survey loads updates each changed panel once", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q0" }] });
    const page = survey.pages[0];
    const spy = vi.spyOn(SurveyElement.prototype, "updateRootStyle");
    try {
      const getCount = () => spy.mock.contexts.filter((el: SurveyElement) => el.survey === survey).length;
      survey.startLoadingFromJson();
      for (let i = 0; i < 50; i++) {
        const panel = new PanelModel("panel" + i);
        page.addElement(panel);
        for (let j = 0; j < 20; j++) {
          addText(panel, "q" + i + "_" + j);
        }
      }
      const loadingCount = getCount();
      survey.endLoadingFromJson();
      const endLoadingCount = getCount() - loadingCount;
      expect(loadingCount, "while loading").toBe(0);
      // The page subtree (1 + q0 + 50 + 1,000) plus each panel's subtree (50 x 21).
      expect(endLoadingCount, "in endLoadingFromJson").toBeLessThanOrEqual(2102);
    } finally {
      spy.mockRestore();
    }
  });

  [true, false].forEach(isRendered => {
    test("a panel without a survey loaded on its own, " + (isRendered ? "rendered" : "not rendered"), () => {
      const panel = new PanelModel("panel1");
      if (isRendered) {
        panel.onFirstRendering();
        expect(panel.wasRendered, "rendered").toBe(true);
        expect(panel.rootStyle, "panel before loading").toEqual({});
      }
      panel.startLoadingFromJson();
      const questions = [addText(panel, "q1"), addText(panel, "q2", false), addText(panel, "q3", false)];
      const spy = vi.spyOn(panel, "updateColumns");
      panel.endLoadingFromJson();

      expect(spy.mock.calls.length, "updateColumns calls in endLoadingFromJson").toBeLessThanOrEqual(1);
      expect(getRowNames(panel), "rows").toEqual(isRendered ? [["q1", "q2", "q3"]] : []);
      expect(panel.rootStyle, "panel").toEqual({});
      const questionStyle = isRendered ? { flexGrow: 1, flexShrink: 1, flexBasis: "33.333333%" } : {};
      questions.forEach(q => expect(q.rootStyle, q.name).toEqual(questionStyle));
    });
  });
});
