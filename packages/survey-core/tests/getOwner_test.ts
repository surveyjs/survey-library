import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";
describe("Test getOwner", () => {
  test("Base", () => {

    const survey = new SurveyModel({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
              validators: [
                { type: "expression", expression: "1+2" }
              ]
            }
          ]
        }
      ],
      triggers: [
        { type: "runexpression", expression: "1+1", runExpression: "1+1" }
      ],
      calculatedValues: [{ name: "var1", expression: "1+1" }],
      navigateToUrlOnCondition: [{ expression: "1+1" }],
      completedHtmlOnCondition: [{ expression: "1+1" }],
    });

    const q1 = survey.getQuestionByName("q1");
    expect(q1.validators[0].getOwner(), "The owner of validator is question").toBe(q1);
    expect(survey.getOwner(), "The owner of survey is null").toBe(undefined);
    expect(survey.pages[0].getOwner(), "The owner of page is survey").toBe(survey);
    expect(survey.getQuestionByName("q1").getOwner(), "The owner of question is page").toBe(survey.pages[0]);
    expect(survey.triggers[0].getOwner(), "The owner of trigger is survey").toBe(survey);
    expect(survey.calculatedValues[0].getOwner(), "The owner of calculatedValue is survey").toBe(survey);
    expect(survey.navigateToUrlOnCondition[0].getOwner(), "The owner of navigateToUrlOnCondition is survey").toBe(survey);
    expect(survey.completedHtmlOnCondition[0].getOwner(), "The owner of completedHtmlOnCondition is survey").toBe(survey);
  });

  test("matrix", () => {

    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            type: "matrix",
            name: "q1",
            columns: ["Column 1"],
            rows: ["Row 1"]
          }
        ]
      }],
    });

    const q1 = survey.getQuestionByName("q1");
    expect(q1.getOwner(), "The owner of question is page").toBe(survey.pages[0]);
    expect(q1.columns[0].getOwner(), "The owner of column is question").toBe(q1);
    expect(q1.rows[0].getOwner(), "The owner of row is question").toBe(q1);
  });

  test("dropdown", () => {

    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            type: "dropdown",
            name: "q1",
            choices: ["Item 1"]
          }
        ]
      }],
    });

    const q1 = survey.getQuestionByName("q1");
    expect(q1.getOwner(), "The owner of question is page").toBe(survey.pages[0]);
    expect(q1.choices[0].getOwner(), "The owner of choice is question").toBe(q1);
  });

  test("panel", () => {

    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            type: "panel",
            name: "q1",
            elements: [
              {
                type: "text",
                name: "q2"
              }
            ]
          }
        ]
      }],
    });

    const p1 = survey.getPanelByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(p1.getOwner(), "The owner of panel is page").toBe(survey.pages[0]);
    expect(q2.getOwner(), "The owner of question is panel").toBe(p1);
  });

  test("paneldynamic", () => {

    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            type: "paneldynamic",
            name: "p1",
            templateElements: [
              {
                type: "text",
                name: "q1"
              }
            ]
          }
        ]
      }],
    });

    const p1 = survey.getQuestionByName("p1");
    const q1 = p1.templateElements[0];
    expect(p1.getOwner(), "The owner of paneldynamic is page").toBe(survey.pages[0]);
    expect(q1.getOwner(), "The owner of question is paneldynamic").toBe(p1);
  });

  test("multipletext", () => {

    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            type: "multipletext",
            name: "q1",
            items: [
              {
                name: "text1"
              },
            ]
          }
        ]
      }],
    });

    const q1 = survey.getQuestionByName("q1");
    const item1 = q1.items[0];
    expect(q1.getOwner(), "The owner of multipletext is page").toBe(survey.pages[0]);
    expect(item1.getOwner(), "The owner of item is multipletext").toBe(q1);
  });

  test("matrixdynamic", () => {

    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            "type": "matrixdynamic",
            "name": "q1",
            "columns": [
              { "name": "Column 1" }
            ],
            "choices": [1]
          }
        ]
      }],
    });

    const q1 = survey.getQuestionByName("q1");
    expect(q1.getOwner(), "The owner of q1 is page").toBe(survey.pages[0]);
    expect(q1.columns[0].getOwner(), "The owner of column is q1").toBe(q1);
    expect(q1.choices[0].getOwner(), "The owner of choice is q1").toBe(q1);
  });

  test("imagemap", () => {

    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            type: "imagemap",
            name: "q1",
            areas: [
              { value: "val1", },
            ]
          }
        ]
      }],
    });

    const q1 = survey.getQuestionByName("q1");
    expect(q1.getOwner(), "The owner of q1 is page").toBe(survey.pages[0]);
    expect(q1.areas[0].getOwner(), "The owner of area is q1").toBe(q1);
  });
});
