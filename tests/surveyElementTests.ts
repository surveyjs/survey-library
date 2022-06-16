import { PageModel } from "../src/page";
import { SurveyModel } from "../src/survey";
import { defaultV2Css } from "../src/defaultCss/defaultV2Css";
import { CustomWidgetCollection } from "../src/questionCustomWidgets";
import { Serializer } from "../src/jsonobject";

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
  const q1 = survey.getQuestionByName("q1");
  const questionInMatrix = survey.getAllQuestions()[1].renderedTable.rows[0].cells[0].question;
  assert.notOk(q1.isErrorsModeTooltip);
  assert.notOk(q1.showErrorsAboveQuestion);
  assert.notOk(q1.showErrorOnBottom);
  assert.ok(q1.showErrorOnTop);

  assert.notOk(questionInMatrix.isErrorsModeTooltip);
  assert.notOk(questionInMatrix.showErrorsAboveQuestion);
  assert.notOk(questionInMatrix.showErrorOnBottom);
  assert.ok(questionInMatrix.showErrorOnTop);

  survey.questionErrorLocation = "bottom";
  assert.notOk(q1.showErrorOnTop);
  assert.ok(q1.showErrorOnBottom);

  assert.notOk(questionInMatrix.showErrorOnTop);
  assert.ok(questionInMatrix.showErrorOnBottom);

  survey.css = defaultV2Css;
  survey.questionErrorLocation = "top";
  assert.notOk(q1.showErrorOnTop);
  assert.notOk(q1.showErrorOnBottom);
  assert.notOk(q1.isErrorsModeTooltip);
  assert.ok(q1.showErrorsAboveQuestion);

  assert.notOk(questionInMatrix.showErrorOnTop);
  assert.notOk(questionInMatrix.showErrorOnBottom);
  assert.notOk(questionInMatrix.showErrorsAboveQuestion);
  assert.ok(questionInMatrix.isErrorsModeTooltip);
});

QUnit.test("Check isErrorsModeTooltip for custom widget", function (assert) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget(
    {
      name: "tagbox",
      isFit: (question) => {
        return question.getType() === "tagbox";
      },
    }
  );
  if (!Serializer.findClass("tagbox")) {
    Serializer.addClass("tagbox", [], null, "text");
  }
  const survey = new SurveyModel({
    elements: [
      {
        type: "tagbox",
        name: "q1"
      },
      {
        type: "matrixdynamic",
        name: "q2",
        "columns": [
          {
            "name": "subjects",
            "cellType": "tagbox",
            "isRequired": true,
            "choices": [1, 2, 3]
          }
        ]
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const questionInMatrix = survey.getAllQuestions()[1].renderedTable.rows[0].cells[0].question;
  assert.notOk(q1.isErrorsModeTooltip);
  assert.notOk(q1.showErrorsAboveQuestion);
  assert.notOk(q1.showErrorOnBottom);
  assert.ok(q1.showErrorOnTop);

  assert.notOk(questionInMatrix.isErrorsModeTooltip);
  assert.notOk(questionInMatrix.showErrorsAboveQuestion);
  assert.notOk(questionInMatrix.showErrorOnBottom);
  assert.ok(questionInMatrix.showErrorOnTop);

  survey.questionErrorLocation = "bottom";
  assert.notOk(q1.showErrorOnTop);
  assert.ok(q1.showErrorOnBottom);

  assert.notOk(questionInMatrix.showErrorOnTop);
  assert.ok(questionInMatrix.showErrorOnBottom);

  survey.css = defaultV2Css;
  survey.questionErrorLocation = "top";
  assert.notOk(q1.showErrorOnTop);
  assert.notOk(q1.showErrorOnBottom);
  assert.notOk(q1.isErrorsModeTooltip);
  assert.ok(q1.showErrorsAboveQuestion);

  survey.questionErrorLocation = "bottom";
  assert.notOk(questionInMatrix.showErrorOnTop);
  assert.notOk(questionInMatrix.showErrorsAboveQuestion);
  assert.notOk(questionInMatrix.isErrorsModeTooltip);
  assert.ok(questionInMatrix.showErrorOnBottom);
  CustomWidgetCollection.Instance.clear();
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
    "flexBasis": "100.000000%",
    "flexGrow": 1,
    "flexShrink": 1,
    "maxWidth": "initial",
    "minWidth": "300px",
    "width": "100.000000%"
  });
  q1.allowRootStyle = false;
  survey.css = defaultV2Css;
  assert.deepEqual(q1.rootStyle, {});
});