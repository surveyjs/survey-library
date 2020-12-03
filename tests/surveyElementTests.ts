import { PageModel } from "../src/page";

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
  assert.equal(stateChangedCounter, 2, "callback is called two time");
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
  assert.equal(stateChangedCounter, 2, "callback is called two time");
});
