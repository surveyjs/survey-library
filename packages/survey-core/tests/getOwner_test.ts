import { SurveyModel } from "../src/survey";

export default QUnit.module("Test getOwner");

QUnit.test("Base", (assert) => {

  var survey = new SurveyModel({
    pages: [{
      elements: [
        {
          type: "text",
          name: "q1",
        },
      ],
    }],
  });

  assert.equal(survey.getOwner(), undefined, "The owner of survey is null");
  assert.equal(survey.pages[0].getOwner(), survey, "The owner of page is survey");
  assert.equal(survey.getQuestionByName("q1").getOwner(), survey.pages[0], "The owner of question is page");
});

QUnit.test("matrix", (assert) => {

  var survey = new SurveyModel({
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

  var survey = new SurveyModel({
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

  var survey = new SurveyModel({
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

  var survey = new SurveyModel({
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

  var survey = new SurveyModel({
    pages: [{
      elements: [
        {
          type: "multipletext",
          name: "question1",
          items: [
            {
              name: "text1"
            },
          ]
        }
      ]
    }],
  });

  const p1 = survey.getQuestionByName("question1");
  const q1 = p1.items[0];
  assert.equal(p1.getOwner(), survey.pages[0], "The owner of multipletext is page");
  assert.equal(q1.getOwner(), p1, "The owner of item is multipletext");
});