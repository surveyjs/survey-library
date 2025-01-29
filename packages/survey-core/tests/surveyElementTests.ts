import { PageModel } from "../src/page";
import { SurveyModel } from "../src/survey";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { CustomWidgetCollection } from "../src/questionCustomWidgets";
import { Serializer } from "../src/jsonobject";
import { PanelModel } from "../src/panel";
import { Question } from "../src/question";
import { RenderingCompletedAwaiter } from "../src/survey-element";
import { QuestionBooleanModel } from "../src/question_boolean";
import { setOldTheme } from "./oldTheme";
export default QUnit.module("SurveyElement");

QUnit.test("panel isExpanded and isCollapsed", function (assert) {
  var page = new PageModel();
  var panel = page.addNewPanel("p1");
  var stateChangedCounter = 0;
  panel.stateChangedCallback = function () {
    stateChangedCounter++;
  };
  assert.equal(panel.isCollapsed, false, "Panel is not collapsed by default");
  assert.equal(panel.isExpanded, false, "Panel is not expanded by default");
  assert.equal(panel.processedTitle, "", "Panel title is empty");
  panel.collapse();
  assert.equal(panel.processedTitle, "p1", "Panel title renders name");
  assert.equal(panel.isCollapsed, true, "Panel is collapsed");
  assert.equal(stateChangedCounter, 1, "callback is called one time");
  panel.expand();
  assert.equal(panel.isExpanded, true, "Panel is expanded");
  panel.toggleState();
  assert.equal(panel.isExpanded, false, "Panel is not expanded");
  panel.toggleState();
  assert.equal(panel.isExpanded, true, "Panel is expanded");
  assert.equal(stateChangedCounter, 4, "callback is called two time");
});

QUnit.test("question isExpanded and isCollapsed", function (assert) {
  var page = new PageModel();
  var q = page.addNewQuestion("text", "q1");
  var stateChangedCounter = 0;
  q.stateChangedCallback = function () {
    stateChangedCounter++;
  };
  assert.equal(q.isCollapsed, false, "Question is not collapsed by default");
  assert.equal(q.isExpanded, false, "Question is not expanded by default");
  q.collapse();
  assert.equal(q.isCollapsed, true, "Question is collapsed");
  assert.equal(stateChangedCounter, 1, "callback is called one time");
  q.expand();
  assert.equal(q.isExpanded, true, "Question is expanded");
  q.toggleState();
  assert.equal(q.isExpanded, false, "Panel is not expanded");
  q.toggleState();
  assert.equal(q.isExpanded, true, "Panel is expanded");
  assert.equal(stateChangedCounter, 4, "callback is called two time");
});

QUnit.test("element check that title classes are updated after element state updated", function (assert) {
  const survey = new SurveyModel({
    questions: [
      {
        type: "panel",
        name: "p1",
        title: "panel",
        elements: [
          {
            type: "text",
            name: "_"
          }
        ]
      },
      {
        type: "text",
        name: "q1"
      }
    ]
  });
  setOldTheme(survey);
  const panel = <PanelModel>survey.getAllPanels()[0];
  const question = <Question>survey.getQuestionByName("q1");
  assert.equal(panel.cssTitle, "sv_p_title");
  assert.equal(question.cssTitle, "sv_q_title");

  panel.state = "collapsed";
  question.state = "collapsed";
  assert.equal(panel.cssTitle, "sv_p_title sv_p_title_expandable sv_p_title_collapsed");
  assert.equal(question.cssTitle, "sv_q_title sv_q_title_expandable sv_q_title_collapsed");

  panel.state = "expanded";
  question.state = "expanded";
  assert.equal(panel.cssTitle, "sv_p_title sv_p_title_expandable sv_p_title_expanded");
  assert.equal(question.cssTitle, "sv_q_title sv_q_title_expandable sv_q_title_expanded");

  panel.state = "default";
  question.state = "default";
  assert.equal(panel.cssTitle, "sv_p_title");
  assert.equal(question.cssTitle, "sv_q_title");

});

QUnit.test("creator v1: https://github.com/surveyjs/survey-creator/issues/1744", function (assert) {
  // moved q from page1 to page2
  var json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            name: "q1"
          }
        ]
      },
      {
        name: "page2"
      }
    ],
  };
  var survey = new SurveyModel(json);
  var page1 = survey.pages[0];
  var page2 = survey.pages[1];
  var q = survey.getQuestionByName("q1");

  var val: any = "page2";
  q["setPage"](page1, val);

  assert.equal(page1.questions.length, 0, "page1 has no questions");
  assert.equal(page2.questions.length, 1, "page1 has question");
  assert.equal(page2.questions[0].name, "q1", "page1 has q1 question");
});

QUnit.test("Check errors location", function (assert) {
  const survey = new SurveyModel({
    elements: [{
      type: "text",
      name: "q1"
    },
    {
      type: "matrixdynamic",
      name: "q2",
      "columns": [
        {
          "name": "subjects",
          "cellType": "radigroup",
          "isRequired": true,
          "choices": [1, 2, 3]
        }
      ]
    }
    ]
  });
  setOldTheme(survey);
  const q1 = survey.getQuestionByName("q1");
  const questionInMatrix = survey.getAllQuestions()[1].renderedTable.rows[0].cells[0].question;
  assert.notOk(q1.showErrorsAboveQuestion);
  assert.notOk(q1.showErrorOnBottom);
  assert.ok(q1.showErrorOnTop);

  assert.notOk(questionInMatrix.showErrorsAboveQuestion);
  assert.notOk(questionInMatrix.showErrorOnBottom);
  assert.ok(questionInMatrix.showErrorOnTop);

  survey.questionErrorLocation = "bottom";
  assert.notOk(q1.showErrorOnTop);
  assert.ok(q1.showErrorOnBottom);

  assert.notOk(questionInMatrix.showErrorOnTop);
  assert.ok(questionInMatrix.showErrorOnBottom);

  survey.css = defaultCss;
  survey.questionErrorLocation = "top";
  assert.notOk(q1.showErrorOnTop);
  assert.notOk(q1.showErrorOnBottom);
  assert.ok(q1.showErrorsAboveQuestion);

  assert.notOk(questionInMatrix.showErrorOnTop);
  assert.notOk(questionInMatrix.showErrorOnBottom);
  assert.ok(questionInMatrix.showErrorsAboveQuestion);
});
QUnit.test("Check error location for questions in panel", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "panel",
        name: "p1",
        elements: [
          {
            name: "q1",
            type: "text"
          }
        ]
      }
    ]
  });
  setOldTheme(survey);
  const q1 = survey.getQuestionByName("q1");
  assert.notOk(q1.showErrorOnBottom);
  assert.notOk(q1.showErrorsBelowQuestion);
  assert.notOk(q1.showErrorsAboveQuestion);
  assert.ok(q1.showErrorOnTop);

  survey.questionErrorLocation = "bottom";
  assert.notOk(q1.showErrorOnTop);
  assert.notOk(q1.showErrorsBelowQuestion);
  assert.notOk(q1.showErrorsAboveQuestion);
  assert.ok(q1.showErrorOnBottom);

  survey.css = defaultCss;
  survey.questionErrorLocation = "top";
  assert.notOk(q1.showErrorOnBottom);
  assert.notOk(q1.showErrorOnTop);
  assert.notOk(q1.showErrorsBelowQuestion);
  assert.ok(q1.showErrorsAboveQuestion);

  survey.questionErrorLocation = "bottom";
  assert.notOk(q1.showErrorOnBottom);
  assert.notOk(q1.showErrorOnTop);
  assert.notOk(q1.showErrorsAboveQuestion);
  assert.ok(q1.showErrorsBelowQuestion);
});
QUnit.test("allowRootStyle", function (assert) {
  const survey = new SurveyModel({
    elements: [{
      type: "text",
      name: "q1"
    }]
  });
  const q1 = survey.getQuestionByName("q1");
  assert.ok(q1.allowRootStyle);
  assert.deepEqual(q1.rootStyle, {
    "flexBasis": "100%",
    "flexGrow": 1,
    "flexShrink": 1,
    "maxWidth": "100%",
    "minWidth": "min(100%, 300px)",
  });
  q1.allowRootStyle = false;
  survey.css = defaultCss;
  assert.deepEqual(q1.rootStyle, {});
});
QUnit.test("rootStyle on mobile", function (assert) {
  const survey = new SurveyModel({
    elements: [{
      type: "text",
      name: "q1"
    }]
  });
  const q1 = survey.getQuestionByName("q1");
  assert.deepEqual(q1.rootStyle, {
    "flexBasis": "100%",
    "flexGrow": 1,
    "flexShrink": 1,
    "maxWidth": "100%",
    "minWidth": "min(100%, 300px)",
  });
  survey.setIsMobile(true);
  assert.deepEqual(q1.rootStyle, {
    "flexBasis": "100%",
    "flexGrow": 1,
    "flexShrink": 1,
    "maxWidth": "100%",
    "minWidth": "min(100%, 300px)"
  });
});
QUnit.test("question.errorLocation", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        name: "q1",
        type: "text"
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  assert.equal(q1.getErrorLocation(), "top", "#1");

  survey.questionErrorLocation = "bottom";
  assert.equal(q1.getErrorLocation(), "bottom", "#2");

  q1.errorLocation = "top";
  assert.equal(q1.getErrorLocation(), "top", "#3");

  q1.errorLocation = "default";
  assert.equal(q1.getErrorLocation(), "bottom", "#4");

  survey.questionErrorLocation = "top";
  assert.equal(q1.getErrorLocation(), "top", "#5");

  q1.errorLocation = "bottom";
  assert.equal(q1.getErrorLocation(), "bottom", "#6");
});
QUnit.test("question.errorLocation & panel.questionErrorLocation & page.questionErrorLocation", function (assert) {
  const survey = new SurveyModel({
    pages: [
      {
        elements: [
          {
            name: "p1", type: "panel",
            elements: [
              {
                name: "q1",
                type: "text"
              }
            ]
          }
        ]
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const p1 = survey.getPanelByName("p1");
  const page = survey.currentPage;
  assert.equal(q1.getErrorLocation(), "top", "#1");

  survey.questionErrorLocation = "bottom";
  assert.equal(q1.getErrorLocation(), "bottom", "#2");

  page.questionErrorLocation = "top";
  assert.equal(q1.getErrorLocation(), "top", "#3");

  p1.questionErrorLocation = "bottom";
  assert.equal(q1.getErrorLocation(), "bottom", "#4");

  q1.errorLocation = "top";
  assert.equal(q1.getErrorLocation(), "top", "#5");
});

QUnit.test("single page survey in preview", function (assert) {
  const json = {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "name": "question1"
          }
        ],
        "title": "Page 1"
      }
    ],
    "questionsOnPageMode": "singlePage",
    "showPreviewBeforeComplete": "showAllQuestions"
  };

  let survey = new SurveyModel(json);
  var oldCss = survey.css;
  survey.css = {
    root: "sd-root-modern"
  };
  assert.ok(survey.getQuestionByName("question1")["getHasFrameV2"](), "question1.getHasFrameV2, #1");
  assert.notOk(survey.getQuestionByName("question1")["getIsNested"](), "question1.getIsNested, #1");
  survey.showPreview();
  assert.ok(survey.getQuestionByName("question1")["getHasFrameV2"](), "question1.getHasFrameV2, #2");
  assert.notOk(survey.getQuestionByName("question1")["getIsNested"](), "question1.getIsNested, #2");
  assert.ok((survey.currentPage.elements[0] as PanelModel).showPanelAsPage);
  survey.css = oldCss;
});

QUnit.test("wait for elements to render RenderingCompletedAwaiter + onAfterRenderElement event", function (assert) {
  const json = {
    "elements": [
      { "type": "text", "name": "question1" },
      { "type": "text", "name": "question2" }
    ],
  };

  const survey = new SurveyModel(json);
  const [q1, q2] = survey.getAllQuestions();

  let qRenderLog = "";
  survey.onAfterRenderQuestion.add((s, o) => {
    qRenderLog += "->rendered(" + o.question.name + ")";
  });

  assert.ok(q1.onAfterRenderElement.isEmpty);
  assert.ok(q2.onAfterRenderElement.isEmpty);

  let log = "";
  const awaiter = new RenderingCompletedAwaiter([q1, q2], () => {
    log += "->elementsRendered";
  });

  assert.equal(log, "");
  assert.equal(qRenderLog, "");
  assert.equal(q1.onAfterRenderElement.length, 1);
  assert.equal(q2.onAfterRenderElement.length, 1);

  q1.afterRender({} as any);

  assert.equal(log, "");
  assert.equal(qRenderLog, "->rendered(question1)");
  assert.equal(q1.onAfterRenderElement.length, 0);
  assert.ok(q1.onAfterRenderElement.isEmpty);
  assert.equal(q2.onAfterRenderElement.length, 1);
  assert.notOk(q2.onAfterRenderElement.isEmpty);

  q2.afterRender({} as any);

  assert.equal(log, "->elementsRendered");
  assert.equal(qRenderLog, "->rendered(question1)->rendered(question2)");
  assert.ok(q1.onAfterRenderElement.isEmpty);
  assert.ok(q2.onAfterRenderElement.isEmpty);
});

QUnit.test("wait for elements to render RenderingCompletedAwaiter by timeout", async function (assert) {
  const done = assert.async();
  const json = {
    "elements": [
      { "type": "text", "name": "question1" },
      { "type": "text", "name": "question2" }
    ],
  };

  const survey = new SurveyModel(json);
  const [q1, q2] = survey.getAllQuestions();

  let qRenderLog = "";
  survey.onAfterRenderQuestion.add((s, o) => {
    qRenderLog += "->rendered(" + o.question.name + ")";
  });

  assert.ok(q1.onAfterRenderElement.isEmpty);
  assert.ok(q2.onAfterRenderElement.isEmpty);

  let log = "";
  const awaiter = new RenderingCompletedAwaiter([q1, q2], () => {
    log += "->elementsRendered";
  });

  assert.equal(log, "");
  assert.equal(qRenderLog, "");
  assert.equal(q1.onAfterRenderElement.length, 1);
  assert.equal(q2.onAfterRenderElement.length, 1);

  setTimeout(() => {
    assert.equal(log, "->elementsRendered");
    assert.equal(qRenderLog, "");
    assert.ok(q1.onAfterRenderElement.isEmpty);
    assert.ok(q2.onAfterRenderElement.isEmpty);
    done();
  }, 500);
});
QUnit.test("description css should be calculated even if description is empty", function (assert) {
  const json = {
    "elements": [
      { "type": "text", "name": "q1" },
    ],
  };

  const survey = new SurveyModel(json);
  const q = survey.getQuestionByName("q1");
  assert.notOk(q.description);
  assert.ok(q.cssDescription);
});
QUnit.test("description css under input", function (assert) {
  const json = {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "name": "q1",
            "description": "123"
          }
        ]
      }
    ],
    "questionDescriptionLocation": "underInput"
  };

  const survey = new SurveyModel(json);
  survey.css = {
    question: {
      description: "sd-desc",
      descriptionUnderInput: "sd-desc--ui"
    }
  };
  const q = survey.getQuestionByName("q1");
  assert.equal(q.cssDescription, "sd-desc sd-desc--ui");
});

QUnit.test("boolean question with no survey returns valid skeletonComponentName", function (assert) {
  var q1 = new QuestionBooleanModel("q1");
  assert.equal(q1.survey, undefined, "Question is not lined to a survey");
  assert.equal(q1.skeletonComponentName, "sv-skeleton", "Question returns valid skeletonComponentName");
});