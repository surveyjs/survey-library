import { SurveyModel } from "../src/survey";
import { QuestionMatrixModel } from "../src/question_matrix";
import { ComponentCollection, QuestionCompositeModel } from "../src/question_custom";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { PanelModel } from "../src/panel";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";

export default QUnit.module("RandomSeed");

QUnit.test("generator", (assert) => {
  const survey = new SurveyModel();
  const seed = survey.randomSeed;
  assert.equal(seed, survey.randomSeed, "Seed generated on demand and is the same on next call");
});

QUnit.test("matrix", (assert) => {
  const survey = new SurveyModel({
    pages: [
      {
        name: "p1",
        elements: [
          {
            type: "matrix",
            name: "q1",
            columns: ["c1", "c2"],
            rows: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9",],
            rowsOrder: "random"
          }
        ]
      }
    ]
  });
  const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");

  survey.randomSeed = 12345;
  assert.deepEqual(q1.visibleRows.map(e => e.name), ["r8", "r4", "r2", "r5", "r7", "r1", "r6", "r9", "r3"], "Rows order for seed 12345");

  survey.randomSeed = 123456;
  assert.deepEqual(q1.visibleRows.map(e => e.name), ["r5", "r2", "r9", "r3", "r1", "r4", "r7", "r6", "r8"], "Rows order for seed 123456");
});

QUnit.test("composite", (assert) => {
  ComponentCollection.Instance.add({
    name: "test",
    elementsJSON: [
      { type: "dropdown", name: "q2", choices: [1, 2, 3, 4, 5, 6, 7, 8, 9], choicesOrder: "random" },
    ]
  });
  const survey = new SurveyModel({
    elements: [
      { type: "test", name: "q1" }
    ]
  });
  const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
  const q2 = <QuestionDropdownModel>q1.contentPanel.getQuestionByName("q2");

  survey.randomSeed = 12345;
  assert.deepEqual(q2.visibleChoices.map((item) => item.value), [4, 2, 1, 8, 6, 9, 7, 3, 5], "choices order for seed 12345");

  survey.randomSeed = 123456;
  assert.deepEqual(q2.visibleChoices.map((item) => item.value), [7, 1, 5, 6, 8, 4, 9, 2, 3], "choices order for seed 123456");

  ComponentCollection.Instance.clear();
});

QUnit.test("page", (assert) => {
  const survey = new SurveyModel({
    pages: [
      {
        name: "p1",
        questionOrder: "random",
        elements: [
          {
            type: "dropdown",
            name: "q1",
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            choicesOrder: "random"
          },
          {
            type: "checkbox",
            name: "q2",
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            choicesOrder: "random"
          },
          { type: "text", name: "q3" },
          { type: "text", name: "q4" },
          { type: "text", name: "q5" },
          { type: "text", name: "q6" },
          { type: "text", name: "q7" },
          { type: "text", name: "q8" },
          { type: "text", name: "q9" }
        ]
      }
    ],
  });

  survey.randomSeed = 123456;

  const p1 = survey.pages[0];
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");

  assert.equal(survey.randomSeed, 123456, "survey randomSeed is correct");
  assert.equal(p1.randomSeed, 2042968784, "p1 randomSeed is correct");
  assert.equal(q1.randomSeed, -447444863, "q1 randomSeed is correct");
  assert.equal(q2.randomSeed, 1931033524, "q2 randomSeed is correct");

  assert.deepEqual(p1.visibleQuestions.map(q => q.name), ["q5", "q4", "q2", "q7", "q8", "q3", "q9", "q1", "q6"], "page questions order");
  assert.deepEqual(q1.visibleChoices.map((e: any) => e.value), [2, 7, 3, 6, 4, 8, 1, 9, 5], "dropdown choices order");
  assert.deepEqual(q2.visibleChoices.map((e: any) => e.value), [1, 2, 7, 6, 9, 3, 8, 5, 4], "checkbox choices order");
});

QUnit.test("panel + paneldynamic", (assert) => {
  const survey = new SurveyModel({
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "panel",
            name: "panel1",
            questionOrder: "random",
            elements: [
              { type: "text", name: "q1" },
              { type: "text", name: "q2" },
              { type: "text", name: "q3" },
              { type: "text", name: "q4" },
              { type: "text", name: "q5" },
              { type: "text", name: "q6" },
              { type: "text", name: "q7" },
              { type: "text", name: "q8" },
              { type: "text", name: "q9" }
            ]
          },
          {
            type: "paneldynamic",
            name: "paneldynamic1",
            panelCount: 2,
            templateElements: [
              {
                type: "dropdown",
                name: "question2",
                choices: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                choicesOrder: "random"
              }
            ]
          }
        ]
      }
    ]
  });

  const panel = <PanelModel>survey.getPanelByName("panel1");
  const paneldynamic = <QuestionPanelDynamicModel>survey.getQuestionByName("paneldynamic1");

  survey.randomSeed = 123456;
  assert.equal(survey.randomSeed, 123456, "survey randomSeed is correct");
  assert.deepEqual(panel.elements.map(q => q.name), ["q6", "q1", "q5", "q8", "q4", "q3", "q9", "q2", "q7"], "panel questions order");
  assert.deepEqual((<QuestionDropdownModel>paneldynamic.panels[0].elements[0]).visibleChoices.map((e: any) => e.value), [4, 2, 1, 3, 6, 7, 8, 5, 9], "paneldynamic panel#0 order for seed 123456");
  assert.deepEqual((<QuestionDropdownModel>paneldynamic.panels[1].elements[0]).visibleChoices.map((e: any) => e.value), [4, 2, 1, 3, 6, 7, 8, 5, 9], "paneldynamic panel#1 order for seed 123456");

  survey.randomSeed = 1234567;
  assert.deepEqual(panel.elements.map(q => q.name), ["q4", "q8", "q5", "q6", "q9", "q2", "q1", "q7", "q3"], "panel questions order");
  assert.deepEqual((<QuestionDropdownModel>paneldynamic.panels[0].elements[0]).visibleChoices.map((e: any) => e.value), [6, 1, 7, 9, 4, 2, 5, 8, 3], "paneldynamic panel#0 order for seed 1234567");
  assert.deepEqual((<QuestionDropdownModel>paneldynamic.panels[1].elements[0]).visibleChoices.map((e: any) => e.value), [6, 1, 7, 9, 4, 2, 5, 8, 3], "paneldynamic panel#1 order for seed 1234567");
});

QUnit.test("uiState", (assert) => {
  const survey = new SurveyModel({
    pages: [
      {
        name: "p1",
        questionOrder: "random",
        elements: [
          {
            type: "dropdown",
            name: "q1",
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            choicesOrder: "random"
          },
          {
            type: "checkbox",
            name: "q2",
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            choicesOrder: "random"
          },
          { type: "text", name: "q3" },
          { type: "text", name: "q4" },
          { type: "text", name: "q5" },
          { type: "text", name: "q6" },
          { type: "text", name: "q7" },
          { type: "text", name: "q8" },
          { type: "text", name: "q9" },
        ]
      },
    ]
  });

  const p1 = survey.pages[0];
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");

  assert.deepEqual(survey.uiState, { randomSeed: survey.randomSeed }, "random seed is in the state");
  survey.randomSeed = 987654;
  assert.deepEqual(survey.uiState, { randomSeed: 987654 }, "random seed in state is changed");
  assert.deepEqual(p1.visibleQuestions.map(q => q.name), ["q8", "q1", "q4", "q9", "q3", "q2", "q6", "q7", "q5"], "page questions order for seed 987654");
  assert.deepEqual(q1.visibleChoices.map((e: any) => e.value), [8, 9, 3, 7, 1, 2, 6, 5, 4], "dropdown choices order for seed 987654");
  assert.deepEqual(q2.visibleChoices.map((e: any) => e.value), [9, 4, 6, 2, 5, 1, 3, 7, 8], "checkbox choices order for seed 987654");

  survey.uiState = { randomSeed: 123456 };
  assert.equal(survey.randomSeed, 123456, "random seed is set from state");
  assert.deepEqual(p1.visibleQuestions.map(q => q.name), ["q5", "q4", "q2", "q7", "q8", "q3", "q9", "q1", "q6"], "page questions order for seed 123456");
  assert.deepEqual(q1.visibleChoices.map((e: any) => e.value), [2, 7, 3, 6, 4, 8, 1, 9, 5], "dropdown choices order for seed 123456");
  assert.deepEqual(q2.visibleChoices.map((e: any) => e.value), [1, 2, 7, 6, 9, 3, 8, 5, 4], "checkbox choices order for seed 123456");
});

QUnit.test("matrixdropdown rows randomize", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: ["c1", "c2"],
        rows: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"],
        rowOrder: "random"
      }, {
        type: "matrixdropdown",
        name: "q2",
        columns: ["c1", "c2"],
        rows: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"],
        rowOrder: "initial"
      }, {
        type: "matrixdropdown",
        name: "q3",
        columns: ["c1", "c2"],
        rows: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"],
      }
    ]
  });
  const q1 = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q1");
  const q2 = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q2");
  const q3 = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q3");
  assert.notDeepEqual(q1.visibleRows.map(e => e.rowName), ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"], "Matrix#1 Row order randomized");
  assert.deepEqual(q2.visibleRows.map(e => e.rowName), ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"], "Matrix#2 Row order initial");
  assert.deepEqual(q3.visibleRows.map(e => e.rowName), ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"], "Matrix#3 Row order initial");

  survey.randomSeed = 12345;
  assert.deepEqual(q1.visibleRows.map(e => e.rowName), ["r8", "r6", "r4", "r9", "r7", "r3", "r1", "r5", "r2"], "Matrix#1 Row order randomized with seed 12345");
  assert.deepEqual(q2.visibleRows.map(e => e.rowName), ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"], "Matrix#2 Row order initial");
  assert.deepEqual(q3.visibleRows.map(e => e.rowName), ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"], "Matrix#3 Row order initial");
});

QUnit.test("matrixdropdown", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "matrix1",
        columns: [
          {
            name: "c1",
            cellType: "dropdown",
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            choicesOrder: "random"
          },
          {
            name: "c2",
            cellType: "dropdown",
            choices: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            choicesOrder: "random"
          }
        ],
        rows: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"],
        rowOrder: "random"
      },
    ]
  });

  const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix1");

  survey.randomSeed = 123456;
  assert.equal(survey.randomSeed, 123456, "survey randomSeed is correct");
  assert.deepEqual(matrix.visibleRows.map(e => e.rowName).join(), "r5,r2,r6,r8,r7,r9,r3,r4,r1", "Matrix Row order randomized with seed 123456");
  assert.deepEqual(matrix.visibleRows[0].cells[0].question.visibleChoices.map((e: any) => e.value).join(), "5,6,4,2,1,9,3,8,7", "matrix row#0 col#0 order for seed 123456");
  assert.deepEqual(matrix.visibleRows[0].cells[1].question.visibleChoices.map((e: any) => e.value).join(), "7,8,9,2,1,4,6,5,3", "matrix row#0 col#1 order for seed 123456");
  assert.deepEqual(matrix.visibleRows[1].cells[0].question.visibleChoices.map((e: any) => e.value).join(), "5,6,4,2,1,9,3,8,7", "matrix row#1 col#0 order for seed 123456");
  assert.deepEqual(matrix.visibleRows[1].cells[1].question.visibleChoices.map((e: any) => e.value).join(), "7,8,9,2,1,4,6,5,3", "matrix row#1 col#1 order for seed 123456");

  survey.randomSeed = 1234567;
  assert.equal(survey.randomSeed, 1234567, "survey randomSeed is correct");
  assert.deepEqual(matrix.visibleRows.map(e => e.rowName).join(), "r8,r2,r9,r5,r3,r7,r1,r4,r6", "Matrix Row order randomized with seed 1234567");
  assert.deepEqual(matrix.visibleRows[0].cells[0].question.visibleChoices.map((e: any) => e.value).join(), "5,1,6,2,4,7,8,3,9", "matrix row#0 col#0 order for seed 1234567");
  assert.deepEqual(matrix.visibleRows[0].cells[1].question.visibleChoices.map((e: any) => e.value).join(), "9,4,7,2,8,1,5,3,6", "matrix row#0 col#1 order for seed 1234567");
  assert.deepEqual(matrix.visibleRows[1].cells[0].question.visibleChoices.map((e: any) => e.value).join(), "5,1,6,2,4,7,8,3,9", "matrix row#1 col#0 order for seed 1234567");
  assert.deepEqual(matrix.visibleRows[1].cells[1].question.visibleChoices.map((e: any) => e.value).join(), "9,4,7,2,8,1,5,3,6", "matrix row#1 col#1 order for seed 1234567");
});