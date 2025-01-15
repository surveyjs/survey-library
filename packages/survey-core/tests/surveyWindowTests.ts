import { PopupSurveyModel } from "../src/popup-survey";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { surveyCss } from "../src/defaultCss/defaultCss";

export default QUnit.module("PopupSurvey");

QUnit.test("Survey is created", function (assert) {
  const window = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
  const questions = window.survey.getAllQuestions();
  assert.equal(questions.length, 1, "There is one question");
  assert.equal(questions[0].name, "q1", "The question name is correct");
  assert.equal(window.survey.showTitle, true, "Show survey title by default");
});
QUnit.test("isShowing/isExpanded properties", function (assert) {
  const window = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
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

  const window = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
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
QUnit.test("cssStyles", function (assert) {
  const css = surveyCss.getCss();
  const oldCssRoot = css.window.root;
  const oldCssHeaderRoot = css.window.header.root;
  const oldCssBody = css.window.body;
  css.window.root = "windowRoot";
  css.window.rootCollapsedMod = "windowRoot--collapsed";
  css.window.header.root = "headerRoot";
  css.window.body = "windowBody";

  const window = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
  window.show();
  assert.equal(window.cssRoot, "windowRoot windowRoot--collapsed", "Root collapsed");
  window.changeExpandCollapse();
  assert.equal(window.cssRoot, "windowRoot", "Root expanded");
  assert.equal(window.cssHeaderRoot, "headerRoot", "HeaderRoot");
  assert.equal(window.cssBody, "windowBody", "windowBody");
  css.window.root = oldCssRoot;
  css.window.header.root = oldCssHeaderRoot;
  css.window.body = oldCssBody;
});

QUnit.test("Check that popups inside survey are closed when scrolling container", (assert): any => {
  const model = new PopupSurveyModel({ elements: [{ type: "dropdown", name: "q1", choices: ["Item1", "Item2", "Item3"] }] });
  const question = <QuestionDropdownModel>model.survey.getAllQuestions()[0];
  question.dropdownListModel.popupModel.toggleVisibility();
  assert.ok(model.survey["onScrollCallback"]);
  assert.ok(question.dropdownListModel.popupModel.isVisible);
  model.onScroll();
  assert.notOk(question.dropdownListModel.popupModel.isVisible);
  assert.notOk(model.survey["onScrollCallback"]);
  model.onScroll();
});

QUnit.test("toggleFullScreen", function (assert) {
  const popup = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
  popup.show();
  assert.equal(popup.isExpanded, false, "It is not expanded by default");

  popup.toggleFullScreen();
  assert.equal(popup.isExpanded, true, "expanded if full screen on");

  popup.isExpanded = false;
  assert.equal(popup.isFullScreen, false, "fullScreen is off after collapsed");

  popup.isExpanded = true;
  popup.toggleFullScreen();
  popup.toggleFullScreen();
  assert.equal(popup.isExpanded, true, "expanded after full screen off");
});