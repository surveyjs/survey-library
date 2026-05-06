import { SurveyModel } from "../src/survey";
import { QuestionMatrixModel } from "../src/question_matrix";
import { ComponentCollection, QuestionCompositeModel } from "../src/question_custom";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { PanelModel } from "../src/panel";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";

import { describe, test, expect } from "vitest";
describe("RandomSeed", () => {
  test("generator", () => {
    const survey = new SurveyModel();
    const seed = survey.randomSeed;
    expect(seed, "Seed generated on demand and is the same on next call").toBe(survey.randomSeed);
  });

  test("matrix", () => {
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
    expect(q1.visibleRows.map(e => e.name), "Rows order for seed 12345").toEqual(["r8", "r4", "r2", "r5", "r7", "r1", "r6", "r9", "r3"]);

    survey.randomSeed = 123456;
    expect(q1.visibleRows.map(e => e.name), "Rows order for seed 123456").toEqual(["r5", "r2", "r9", "r3", "r1", "r4", "r7", "r6", "r8"]);
  });

  test("composite", () => {
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
    expect(q2.visibleChoices.map((item) => item.value), "choices order for seed 12345").toEqual([4, 2, 1, 8, 6, 9, 7, 3, 5]);

    survey.randomSeed = 123456;
    expect(q2.visibleChoices.map((item) => item.value), "choices order for seed 123456").toEqual([7, 1, 5, 6, 8, 4, 9, 2, 3]);

    ComponentCollection.Instance.clear();
  });

  test("page", () => {
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

    expect(survey.randomSeed, "survey randomSeed is correct").toBe(123456);
    expect(p1.randomSeed, "p1 randomSeed is correct").toBe(2042968784);
    expect(q1.randomSeed, "q1 randomSeed is correct").toBe(-447444863);
    expect(q2.randomSeed, "q2 randomSeed is correct").toBe(1931033524);

    expect(p1.visibleQuestions.map(q => q.name), "page questions order").toEqual(["q5", "q4", "q2", "q7", "q8", "q3", "q9", "q1", "q6"]);
    expect(q1.visibleChoices.map((e: any) => e.value), "dropdown choices order").toEqual([2, 7, 3, 6, 4, 8, 1, 9, 5]);
    expect(q2.visibleChoices.map((e: any) => e.value), "checkbox choices order").toEqual([1, 2, 7, 6, 9, 3, 8, 5, 4]);
  });

  test("panel + paneldynamic", () => {
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
    expect(survey.randomSeed, "survey randomSeed is correct").toBe(123456);
    expect(panel.elements.map(q => q.name), "panel questions order").toEqual(["q6", "q1", "q5", "q8", "q4", "q3", "q9", "q2", "q7"]);
    expect((<QuestionDropdownModel>paneldynamic.panels[0].elements[0]).visibleChoices.map((e: any) => e.value), "paneldynamic panel#0 order for seed 123456").toEqual([4, 2, 1, 3, 6, 7, 8, 5, 9]);
    expect((<QuestionDropdownModel>paneldynamic.panels[1].elements[0]).visibleChoices.map((e: any) => e.value), "paneldynamic panel#1 order for seed 123456").toEqual([4, 2, 1, 3, 6, 7, 8, 5, 9]);

    survey.randomSeed = 1234567;
    expect(panel.elements.map(q => q.name), "panel questions order").toEqual(["q4", "q8", "q5", "q6", "q9", "q2", "q1", "q7", "q3"]);
    expect((<QuestionDropdownModel>paneldynamic.panels[0].elements[0]).visibleChoices.map((e: any) => e.value), "paneldynamic panel#0 order for seed 1234567").toEqual([6, 1, 7, 9, 4, 2, 5, 8, 3]);
    expect((<QuestionDropdownModel>paneldynamic.panels[1].elements[0]).visibleChoices.map((e: any) => e.value), "paneldynamic panel#1 order for seed 1234567").toEqual([6, 1, 7, 9, 4, 2, 5, 8, 3]);
  });

  test("uiState", () => {
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

    expect(survey.uiState, "random seed is in the state").toEqual({ randomSeed: survey.randomSeed });
    survey.randomSeed = 987654;
    expect(survey.uiState, "random seed in state is changed").toEqual({ randomSeed: 987654 });
    expect(p1.visibleQuestions.map(q => q.name), "page questions order for seed 987654").toEqual(["q8", "q1", "q4", "q9", "q3", "q2", "q6", "q7", "q5"]);
    expect(q1.visibleChoices.map((e: any) => e.value), "dropdown choices order for seed 987654").toEqual([8, 9, 3, 7, 1, 2, 6, 5, 4]);
    expect(q2.visibleChoices.map((e: any) => e.value), "checkbox choices order for seed 987654").toEqual([9, 4, 6, 2, 5, 1, 3, 7, 8]);

    survey.uiState = { randomSeed: 123456 };
    expect(survey.randomSeed, "random seed is set from state").toBe(123456);
    expect(p1.visibleQuestions.map(q => q.name), "page questions order for seed 123456").toEqual(["q5", "q4", "q2", "q7", "q8", "q3", "q9", "q1", "q6"]);
    expect(q1.visibleChoices.map((e: any) => e.value), "dropdown choices order for seed 123456").toEqual([2, 7, 3, 6, 4, 8, 1, 9, 5]);
    expect(q2.visibleChoices.map((e: any) => e.value), "checkbox choices order for seed 123456").toEqual([1, 2, 7, 6, 9, 3, 8, 5, 4]);
  });

  test("matrixdropdown rows randomize", () => {
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
    expect(q1.visibleRows.map(e => e.rowName), "Matrix#1 Row order randomized").not.toEqual(["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"]);
    expect(q2.visibleRows.map(e => e.rowName), "Matrix#2 Row order initial").toEqual(["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"]);
    expect(q3.visibleRows.map(e => e.rowName), "Matrix#3 Row order initial").toEqual(["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"]);

    survey.randomSeed = 12345;
    expect(q1.visibleRows.map(e => e.rowName), "Matrix#1 Row order randomized with seed 12345").toEqual(["r8", "r6", "r4", "r9", "r7", "r3", "r1", "r5", "r2"]);
    expect(q2.visibleRows.map(e => e.rowName), "Matrix#2 Row order initial").toEqual(["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"]);
    expect(q3.visibleRows.map(e => e.rowName), "Matrix#3 Row order initial").toEqual(["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"]);
  });

  test("matrixdropdown", () => {
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
    expect(survey.randomSeed, "survey randomSeed is correct").toBe(123456);
    expect(matrix.visibleRows.map(e => e.rowName).join(), "Matrix Row order randomized with seed 123456").toEqual("r5,r2,r6,r8,r7,r9,r3,r4,r1");
    expect(matrix.visibleRows[0].cells[0].question.visibleChoices.map((e: any) => e.value).join(), "matrix row#0 col#0 order for seed 123456").toEqual("5,6,4,2,1,9,3,8,7");
    expect(matrix.visibleRows[0].cells[1].question.visibleChoices.map((e: any) => e.value).join(), "matrix row#0 col#1 order for seed 123456").toEqual("7,8,9,2,1,4,6,5,3");
    expect(matrix.visibleRows[1].cells[0].question.visibleChoices.map((e: any) => e.value).join(), "matrix row#1 col#0 order for seed 123456").toEqual("5,6,4,2,1,9,3,8,7");
    expect(matrix.visibleRows[1].cells[1].question.visibleChoices.map((e: any) => e.value).join(), "matrix row#1 col#1 order for seed 123456").toEqual("7,8,9,2,1,4,6,5,3");

    survey.randomSeed = 1234567;
    expect(survey.randomSeed, "survey randomSeed is correct").toBe(1234567);
    expect(matrix.visibleRows.map(e => e.rowName).join(), "Matrix Row order randomized with seed 1234567").toEqual("r8,r2,r9,r5,r3,r7,r1,r4,r6");
    expect(matrix.visibleRows[0].cells[0].question.visibleChoices.map((e: any) => e.value).join(), "matrix row#0 col#0 order for seed 1234567").toEqual("5,1,6,2,4,7,8,3,9");
    expect(matrix.visibleRows[0].cells[1].question.visibleChoices.map((e: any) => e.value).join(), "matrix row#0 col#1 order for seed 1234567").toEqual("9,4,7,2,8,1,5,3,6");
    expect(matrix.visibleRows[1].cells[0].question.visibleChoices.map((e: any) => e.value).join(), "matrix row#1 col#0 order for seed 1234567").toEqual("5,1,6,2,4,7,8,3,9");
    expect(matrix.visibleRows[1].cells[1].question.visibleChoices.map((e: any) => e.value).join(), "matrix row#1 col#1 order for seed 1234567").toEqual("9,4,7,2,8,1,5,3,6");
  });

  test("randomize with category", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "dropdown",
          name: "q1",
          choices: [
            { value: 1, randomizeCategory: "A" },
            { value: 2, randomize: false },
            { value: 3, randomizeCategory: "A" },
            { value: 4, randomizeCategory: "A" },
            { value: 5, randomizeCategory: "A" },
            { value: 6, randomizeCategory: "B" },
            { value: 7, randomizeCategory: "B" },
            { value: 8, randomizeCategory: "B" },
            { value: 9, randomizeCategory: "C" }
          ],
          choicesOrder: "random"
        },
        {
          type: "checkbox",
          name: "q2",
          choices: [
            { value: 1, randomizeCategory: "A" },
            { value: 2, randomizeCategory: "A" },
            { value: 3, randomizeCategory: "A" },
            { value: 4, randomizeCategory: "A" },
            { value: 5, randomize: false },
            { value: 6, randomizeCategory: "B" },
            { value: 7, randomizeCategory: "B" },
            { value: 8, randomizeCategory: "B" },
            { value: 9, randomizeCategory: "C" }
          ],
          choicesOrder: "random"
        },
        {
          type: "matrixdropdown",
          name: "m1",
          columns: [
            {
              name: "m1c1",
              cellType: "dropdown",
              choices: [
                { value: 1, randomizeCategory: "A" },
                { value: 2, randomize: false },
                { value: 3, randomizeCategory: "A" },
                { value: 4, randomizeCategory: "A" },
                { value: 5, randomizeCategory: "A" },
                { value: 6, randomizeCategory: "B" },
                { value: 7, randomizeCategory: "B" },
                { value: 8, randomizeCategory: "B" },
                { value: 9, randomizeCategory: "C" }
              ],
              choicesOrder: "random"
            },
            {
              name: "m1c2",
              cellType: "dropdown",
              choices: [
                { value: 1, randomizeCategory: "A" },
                { value: 2, randomizeCategory: "A" },
                { value: 3, randomizeCategory: "A" },
                { value: 4, randomizeCategory: "A" },
                { value: 5, randomize: false },
                { value: 6, randomizeCategory: "B" },
                { value: 7, randomizeCategory: "B" },
                { value: 8, randomizeCategory: "B" },
                { value: 9, randomizeCategory: "C" }
              ],
              choicesOrder: "random"
            }
          ],
          rows: [
            { value: 1, randomizeCategory: "A" },
            { value: 2, randomizeCategory: "A" },
            { value: 3, randomizeCategory: "A" },
            { value: 4, randomizeCategory: "A" },
            { value: 5, randomize: false },
            { value: 6, randomizeCategory: "B" },
            { value: 7, randomizeCategory: "B" },
            { value: 8, randomizeCategory: "B" },
            { value: 9, randomizeCategory: "C" }
          ],
          rowOrder: "random"
        },
      ]
    });

    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m1");
    survey.randomSeed = 987654;
    expect(q1.visibleChoices.map((e: any) => e.value).join(), "dropdown choices order").toEqual("3,2,5,1,4,8,6,7,9");
    expect(q2.visibleChoices.map((e: any) => e.value).join(), "checkbox choices order").toEqual("3,2,1,4,5,7,6,8,9");
    expect(matrix.visibleRows.map(e => e.rowName).join(), "Matrix Row order randomized").toEqual("3,2,1,4,5,7,6,8,9");
    expect(matrix.visibleRows[0].cells[0].question.visibleChoices.map((e: any) => e.value).join(), "matrix row#0 col#0 order").toEqual("5,2,1,3,4,6,8,7,9");
    expect(matrix.visibleRows[0].cells[1].question.visibleChoices.map((e: any) => e.value).join(), "matrix row#0 col#1 order").toEqual("1,3,2,4,5,6,7,8,9");
  });

  test("page: randomize:false and category", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "p1",
          questionOrder: "random",
          elements: [
            { type: "text", name: "q1", randomize: false },
            { type: "text", name: "q2", randomizeCategory: "A" },
            { type: "text", name: "q3", randomizeCategory: "A" },
            { type: "text", name: "q4", randomizeCategory: "A" },
            { type: "text", name: "q5" },
            { type: "text", name: "q6" },
            { type: "text", name: "q7" },
            { type: "text", name: "q8" },
            { type: "text", name: "q9", randomize: false }
          ]
        }
      ],
    });
    const p1 = survey.pages[0];
    survey.randomSeed = 987654;
    expect(p1.visibleQuestions.map(q => q.name).join(), "randomize correct").toEqual("q1,q2,q4,q3,q5,q6,q8,q7,q9");
  });

  test("panel: randomize:false and category", () => {
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
                { type: "text", name: "q1", randomize: false },
                { type: "text", name: "q2", randomizeCategory: "A" },
                { type: "text", name: "q3", randomizeCategory: "A" },
                { type: "text", name: "q4", randomizeCategory: "A" },
                { type: "text", name: "q5", randomize: false },
                { type: "text", name: "q6" },
                { type: "text", name: "q7" },
                { type: "text", name: "q8" },
                { type: "text", name: "q9" }
              ]
            }
          ]
        }
      ]
    });
    survey.randomSeed = 123456;
    const panel = <PanelModel>survey.getPanelByName("panel1");
    const names = panel.elements.map((e: any) => e.name).join();
    expect(names, "randomize correct").toEqual("q1,q3,q2,q4,q5,q8,q7,q6,q9");
  });
});
