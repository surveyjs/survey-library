import { SurveyModel } from "../src/survey";

export default QUnit.module("Test getOwner");

QUnit.test("Base", (assert) => {

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
  assert.equal(q1.validators[0].getOwner(), q1, "The owner of validator is question");
  assert.equal(survey.getOwner(), undefined, "The owner of survey is null");
  assert.equal(survey.pages[0].getOwner(), survey, "The owner of page is survey");
  assert.equal(survey.getQuestionByName("q1").getOwner(), survey.pages[0], "The owner of question is page");
  assert.equal(survey.triggers[0].getOwner(), survey, "The owner of trigger is survey");
  assert.equal(survey.calculatedValues[0].getOwner(), survey, "The owner of calculatedValue is survey");
  assert.equal(survey.navigateToUrlOnCondition[0].getOwner(), survey, "The owner of navigateToUrlOnCondition is survey");
  assert.equal(survey.completedHtmlOnCondition[0].getOwner(), survey, "The owner of completedHtmlOnCondition is survey");
});

QUnit.test("matrix", (assert) => {

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
  assert.equal(q1.getOwner(), survey.pages[0], "The owner of question is page");
  assert.equal(q1.columns[0].getOwner(), q1, "The owner of column is question");
  assert.equal(q1.rows[0].getOwner(), q1, "The owner of row is question");
});

QUnit.test("dropdown", (assert) => {

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
  assert.equal(q1.getOwner(), survey.pages[0], "The owner of question is page");
  assert.equal(q1.choices[0].getOwner(), q1, "The owner of choice is question");
});

QUnit.test("panel", (assert) => {

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
  assert.equal(p1.getOwner(), survey.pages[0], "The owner of panel is page");
  assert.equal(q2.getOwner(), p1, "The owner of question is panel");
});

QUnit.test("paneldynamic", (assert) => {

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
  assert.equal(p1.getOwner(), survey.pages[0], "The owner of paneldynamic is page");
  assert.equal(q1.getOwner(), p1, "The owner of question is paneldynamic");
});

QUnit.test("multipletext", (assert) => {

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
  assert.equal(q1.getOwner(), survey.pages[0], "The owner of multipletext is page");
  assert.equal(item1.getOwner(), q1, "The owner of item is multipletext");
});

QUnit.test("matrixdynamic", (assert) => {

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
  assert.equal(q1.getOwner(), survey.pages[0], "The owner of q1 is page");
  assert.equal(q1.columns[0].getOwner(), q1, "The owner of column is q1");
  assert.equal(q1.choices[0].getOwner(), q1, "The owner of choice is q1");
});

QUnit.test("imagemap", (assert) => {

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
  assert.equal(q1.getOwner(), survey.pages[0], "The owner of q1 is page");
  assert.equal(q1.areas[0].getOwner(), q1, "The owner of area is q1");
});