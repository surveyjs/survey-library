import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { SurveyModel } from "../src/survey";
import { UIStateChangedEvent } from "../src/survey-events-api";

export default QUnit.module("SurveyStateTest");

QUnit.test("restore element state property", function (assert) {
  const survey = new SurveyModel();
  assert.deepEqual(survey.uiState, {}, "there is no state");

  const page = survey.addNewPage("page1");
  assert.equal(page.uiState, undefined, "page state is undefined");

  const quesiton = page.addNewQuestion("text", "question1");
  assert.equal(quesiton.uiState, undefined, "quesiton state is undefined");
  assert.deepEqual(survey.uiState, {}, "there is no state #2");

  quesiton.collapse();
  assert.deepEqual(quesiton.uiState, { collapsed: true }, "quesiton state is no undefined");
  assert.deepEqual(survey.uiState, { questions: { question1: { collapsed: true } } }, "survey state is no undefined");

  survey.uiState = { questions: { question1: { collapsed: false } } };
  assert.equal(quesiton.isExpanded, true, "question is expanded");
});

QUnit.test("restore last focused question state", function (assert) {
  const config = {
    pages: [
      {
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }
        ]
      },
      {
        elements: [
          { type: "text", name: "q3" },
          { type: "text", name: "q4" }
        ]
      },
      {
        elements: [
          { type: "text", name: "q5" },
          { type: "text", name: "q6" }
        ]
      }
    ]
  };

  let survey = new SurveyModel(config);
  assert.deepEqual(survey.uiState, {}, "there is no state");
  survey.whenQuestionFocusIn(survey.getQuestionByName("q3"));
  assert.deepEqual(survey.uiState, { "activeElementName": "q3" }, "there is no state");

  survey = new SurveyModel(config);
  assert.deepEqual(survey.uiState, {}, "there is no state #2");
  assert.equal(survey.currentPageNo, 0, "survey on first page");
  survey.uiState = { "activeElementName": "q5" };
  assert.equal(survey.currentPageNo, 2, "survey on last page");
});

QUnit.test("restore current index in dynamic pannel", function (assert) {
  const panel = new QuestionPanelDynamicModel("panel1");
  panel.template.addNewQuestion("text", "question1");
  panel.panelCount = 3;

  assert.deepEqual(panel.uiState, undefined, "panel state is undefined");

  panel.displayMode = "tab";
  panel.currentIndex = 1;

  assert.deepEqual(panel.uiState, { activePanelIndex: 1 }, "panel current index is 1");

  panel.uiState = { activePanelIndex: 2 };
  assert.equal(panel.currentIndex, 2, "panel current index is 2");
});

QUnit.test("restore active element in dynamic panel", function (assert) {
  const config = {
    pages: [
      {
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }
        ]
      },
      {
        elements: [
          { type: "text", name: "q3" },
          {
            type: "paneldynamic",
            name: "q4",
            templateElements: [
              { type: "text", name: "q5" },
              { type: "text", name: "q6" }
            ],
            panelCount: 3,
            displayMode: "tab"
          }
        ]
      }
    ]
  };

  let survey = new SurveyModel(config);
  survey.currentPageNo = 1;

  let panel = survey.getQuestionByName("q4");
  panel.currentIndex = 1;

  survey.whenQuestionFocusIn(panel.panels[1].getQuestionByName("q6"));
  assert.deepEqual(survey.uiState, { questions: { q4: { activePanelIndex: 1 } }, activeElementName: "q4" }, "survey state with last active");

  survey = new SurveyModel(config);
  survey.uiState = { questions: { q4: { activePanelIndex: 1 } }, activeElementName: "q4" };
  assert.equal(survey.currentPageNo, 1, "survey current page numbers is 1");

  panel = survey.getQuestionByName("q4");
  assert.equal(panel.currentIndex, 1, "panel current index is 1");
});

QUnit.test("onUIStateChanged event test", function (assert) {
  const config = {
    elements: [
      { type: "text", name: "q1", state: "collapsed" },
      {
        type: "paneldynamic",
        name: "q2",
        templateElements: [
          { type: "text", name: "q3" },
          { type: "text", name: "q4" }
        ],
        panelCount: 3,
        displayMode: "tab"
      }
    ]
  };

  const survey = new SurveyModel(config);
  let events: any[] = [];
  survey.onUIStateChanged.add((sender, options: UIStateChangedEvent) => {
    events.push({ reason: options.changedProperty, name: options.element.name });
  });

  survey.getQuestionByName("q1").expand();

  const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q2");
  panel.currentIndex = 1;
  survey.whenQuestionFocusIn(panel.currentPanel.getQuestionByName("q4"));

  assert.deepEqual(events, [
    { reason: "collapsed", name: "q1" },
    { reason: "activePanelIndex", name: "q2" },
    { reason: "activeElementName", name: "q4" }
  ], "check received events");
});
QUnit.test("randomSeed", (assert) => {
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