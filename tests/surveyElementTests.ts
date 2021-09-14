import { PageModel } from "../src/page";
import { SurveyModel } from "../src/survey";
import { SurveyElement } from "../src/survey-element";

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

  var val:any = "page2";
  q["setPage"](page1, val);

  assert.equal(page1.questions.length, 0, "page1 has no questions");
  assert.equal(page2.questions.length, 1, "page1 has question");
  assert.equal(page2.questions[0].name, "q1", "page1 has q1 question");
});
