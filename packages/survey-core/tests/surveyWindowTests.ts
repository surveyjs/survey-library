import { PopupSurveyModel } from "../src/popup-survey";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { surveyCss } from "../src/defaultCss/defaultCss";

import { describe, test, expect } from "vitest";
describe("PopupSurvey", () => {
  test("Survey is created", () => {
    const window = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const questions = window.survey.getAllQuestions();
    expect(questions.length, "There is one question").toLooseEqual(1);
    expect(questions[0].name, "The question name is correct").toLooseEqual("q1");
    expect(window.survey.showTitle, "Show survey title by default").toLooseEqual(true);
  });
  test("isShowing/isExpanded properties", () => {
    const window = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
    let expandedCounter = 0;
    let showingCounter = 0;
    window.expandedChangedCallback = () => {
      expandedCounter ++;
    };
    window.showingChangedCallback = () => {
      showingCounter ++;
    };
    expect(window.isShowing, "It is showing by default").toLooseEqual(false);
    expect(window.isExpanded, "It is not expanded by default").toLooseEqual(false);
    window.show();
    expect(window.isShowing, "show window").toLooseEqual(true);
    expect(showingCounter, "showingCounter #1").toLooseEqual(1);
    expect(expandedCounter, "expandedCounter #1").toLooseEqual(0);
    window.expand();
    expect(window.isExpanded, "expand window").toLooseEqual(true);
    expect(showingCounter, "showingCounter #2").toLooseEqual(1);
    expect(expandedCounter, "expandedCounter #2").toLooseEqual(1);
    window.collapse();
    expect(window.isExpanded, "collapse window").toLooseEqual(false);
    expect(showingCounter, "showingCounter #3").toLooseEqual(1);
    expect(expandedCounter, "expandedCounter #3").toLooseEqual(2);
    window.changeExpandCollapse();
    expect(window.isExpanded, "changeExpandCollapse window, #1").toLooseEqual(true);
    expect(showingCounter, "showingCounter #4").toLooseEqual(1);
    expect(expandedCounter, "expandedCounter #4").toLooseEqual(3);
    window.changeExpandCollapse();
    expect(window.isExpanded, "changeExpandCollapse window, #2").toLooseEqual(false);
    expect(showingCounter, "showingCounter #5").toLooseEqual(1);
    expect(expandedCounter, "expandedCounter #5").toLooseEqual(4);
    window.hide();
    expect(window.isShowing, "hide window").toLooseEqual(false);
    expect(showingCounter, "showingCounter #6").toLooseEqual(2);
    expect(expandedCounter, "expandedCounter #6").toLooseEqual(4);
  });
  test("buttonCss", () => {
    const css = surveyCss.getCss();
    const oldCssCollapsed = css.window.header.buttonCollapsed;
    const oldCssExpanded = css.window.header.buttonExpanded;
    css.window.header.buttonCollapsed = "state1";
    css.window.header.buttonExpanded = "state2";

    const window = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
    expect(window.css.window.header.buttonCollapsed, "check state1").toLooseEqual("state1");
    expect(window.css.window.header.buttonExpanded, "check state2").toLooseEqual("state2");
    window.show();
    expect(window.cssButton, "Collapsed").toLooseEqual("state1");
    window.expand();
    expect(window.cssButton, "expanded").toLooseEqual("state2");
    window.collapse();
    expect(window.cssButton, "Collapsed #2").toLooseEqual("state1");

    css.window.header.buttonCollapsed = oldCssCollapsed;
    css.window.header.buttonExpanded = oldCssExpanded;
  });
  test("cssStyles", () => {
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
    expect(window.cssRoot, "Root collapsed").toLooseEqual("windowRoot windowRoot--collapsed");
    window.changeExpandCollapse();
    expect(window.cssRoot, "Root expanded").toLooseEqual("windowRoot");
    expect(window.cssHeaderRoot, "HeaderRoot").toLooseEqual("headerRoot");
    expect(window.cssBody, "windowBody").toLooseEqual("windowBody");
    css.window.root = oldCssRoot;
    css.window.header.root = oldCssHeaderRoot;
    css.window.body = oldCssBody;
  });

  test("Check that popups inside survey are closed when scrolling container", (assert): any => {
    const model = new PopupSurveyModel({ elements: [{ type: "dropdown", name: "q1", choices: ["Item1", "Item2", "Item3"] }] });
    const question = <QuestionDropdownModel>model.survey.getAllQuestions()[0];
    question.dropdownListModel.popupModel.toggleVisibility();
    expect(model.survey["onScrollCallback"]).toBeTruthy();
    expect(question.dropdownListModel.popupModel.isVisible).toBeTruthy();
    model.onScroll();
    expect(question.dropdownListModel.popupModel.isVisible).toBeFalsy();
    expect(model.survey["onScrollCallback"]).toBeFalsy();
    model.onScroll();
  });

  test("toggleFullScreen", () => {
    const popup = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
    popup.show();
    expect(popup.isExpanded, "It is not expanded by default").toLooseEqual(false);

    popup.toggleFullScreen();
    expect(popup.isExpanded, "expanded if full screen on").toLooseEqual(true);

    popup.isExpanded = false;
    expect(popup.isFullScreen, "fullScreen is off after collapsed").toLooseEqual(false);

    popup.isExpanded = true;
    popup.toggleFullScreen();
    popup.toggleFullScreen();
    expect(popup.isExpanded, "expanded after full screen off").toLooseEqual(true);
  });
});
