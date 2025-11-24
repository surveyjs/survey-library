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
  assert.deepEqual(quesiton.uiState, { state: "collapsed" }, "quesiton state is no undefined");
  assert.deepEqual(page.uiState, undefined, "page state is undefined #2");
  assert.deepEqual(survey.uiState, { questions: { question1: { state: "collapsed" } } }, "survey state is no undefined");

  survey.uiState = { questions: { question1: { state: "expanded" } } };
  assert.equal(quesiton.isExpanded, true, "quesiton is expanded");
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
  assert.deepEqual(survey.uiState, { "lastActive": "q3" }, "there is no state");

  survey = new SurveyModel(config);
  assert.deepEqual(survey.uiState, {}, "there is no state #2");
  assert.equal(survey.currentPageNo, 0, "survey on first page");
  survey.uiState = { "lastActive": "q5" };
  assert.equal(survey.currentPageNo, 2, "survey on last page");
});

QUnit.test("restore current index in dynamic pannel", function (assert) {
  const panel = new QuestionPanelDynamicModel("panel1");
  panel.template.addNewQuestion("text", "question1");
  panel.panelCount = 3;

  assert.deepEqual(panel.uiState, undefined, "panel state is undefined");

  panel.displayMode = "tab";
  panel.currentIndex = 1;

  assert.deepEqual(panel.uiState, { currentIndex: 1 }, "panel current index is 1");

  panel.uiState = { currentIndex: 2 };
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
  assert.deepEqual(survey.uiState, { questions: { q4: { currentIndex: 1 } }, lastActive: "q4" }, "survey state with last active");

  survey = new SurveyModel(config);
  survey.uiState = { questions: { q4: { currentIndex: 1 } }, lastActive: "q4" };
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
    events.push({ reason: options.reason, name: options.element.name });
  });

  survey.getQuestionByName("q1").expand();

  const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q2");
  panel.currentIndex = 1;
  survey.whenQuestionFocusIn(panel.currentPanel.getQuestionByName("q4"));

  assert.deepEqual(events, [
    { reason: "state", name: "q1" },
    { reason: "currentIndex", name: "q2" },
    { reason: "lastActive", name: "q4" }
  ], "check received events");
});