import { SurveyWindowModel } from "../src/surveyWindow";
import { surveyCss } from "../src/defaultCss/cssstandard";

export default QUnit.module("SurveyWindow");

QUnit.test("Survey is created", function (assert) {
  const window = new SurveyWindowModel({ elements: [{ type: "text", name: "q1" }] });
  const questions = window.survey.getAllQuestions();
  assert.equal(questions.length, 1, "There is one question");
  assert.equal(questions[0].name, "q1", "The question name is correct");
  assert.equal(window.survey.showTitle, false, "Do not show survey title by default");
});
QUnit.test("isShowing/isExpanded properties", function (assert) {
  const window = new SurveyWindowModel({ elements: [{ type: "text", name: "q1" }] });
  let expandedCounter = 0;
  let showingCounter = 0;
  window.expandedChangedCallback = () => {
    expandedCounter ++;
  };
  window.showingChangedCallback = () => {
    showingCounter ++;
  };
  assert.equal(window.isShowing, false, "It is showing by default");
  assert.equal(window.isExpanded, false, "It is not expanded by default");
  window.show();
  assert.equal(window.isShowing, true, "show window");
  assert.equal(showingCounter, 1, "showingCounter #1");
  assert.equal(expandedCounter, 0, "expandedCounter #1");
  window.expand();
  assert.equal(window.isExpanded, true, "expand window");
  assert.equal(showingCounter, 1, "showingCounter #2");
  assert.equal(expandedCounter, 1, "expandedCounter #2");
  window.collapse();
  assert.equal(window.isExpanded, false, "collapse window");
  assert.equal(showingCounter, 1, "showingCounter #3");
  assert.equal(expandedCounter, 2, "expandedCounter #3");
  window.changeExpandCollapse();
  assert.equal(window.isExpanded, true, "changeExpandCollapse window, #1");
  assert.equal(showingCounter, 1, "showingCounter #4");
  assert.equal(expandedCounter, 3, "expandedCounter #4");
  window.changeExpandCollapse();
  assert.equal(window.isExpanded, false, "changeExpandCollapse window, #2");
  assert.equal(showingCounter, 1, "showingCounter #5");
  assert.equal(expandedCounter, 4, "expandedCounter #5");
  window.hide();
  assert.equal(window.isShowing, false, "hide window");
  assert.equal(showingCounter, 2, "showingCounter #6");
  assert.equal(expandedCounter, 4, "expandedCounter #6");
});
QUnit.test("buttonCss", function (assert) {
  const css = surveyCss.getCss();
  const oldCssCollapsed = css.window.header.buttonCollapsed;
  const oldCssExpanded = css.window.header.buttonExpanded;
  css.window.header.buttonCollapsed = "state1";
  css.window.header.buttonExpanded = "state2";

  const window = new SurveyWindowModel({ elements: [{ type: "text", name: "q1" }] });
  assert.equal(window.css.window.header.buttonCollapsed, "state1", "check state1");
  assert.equal(window.css.window.header.buttonExpanded, "state2", "check state2");
  window.show();
  assert.equal(window.cssButton, "state1", "Collapsed");
  window.expand();
  assert.equal(window.cssButton, "state2", "expanded");
  window.collapse();
  assert.equal(window.cssButton, "state1", "Collapsed #2");

  css.window.header.buttonCollapsed = oldCssCollapsed;
  css.window.header.buttonExpanded = oldCssExpanded;
});
