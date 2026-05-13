import { PopupSurveyModel } from "../src/popup-survey";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { surveyCss } from "../src/defaultCss/defaultCss";

import { describe, test, expect } from "vitest";
describe("PopupSurvey", () => {
  test("Survey is created", () => {
    const window = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const questions = window.survey.getAllQuestions();
    expect(questions.length, "There is one question").toBe(1);
    expect(questions[0].name, "The question name is correct").toBe("q1");
    expect(window.survey.showTitle, "Show survey title by default").toBe(true);
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
    expect(window.isShowing, "It is showing by default").toBe(false);
    expect(window.isExpanded, "It is not expanded by default").toBe(false);
    window.show();
    expect(window.isShowing, "show window").toBe(true);
    expect(showingCounter, "showingCounter #1").toBe(1);
    expect(expandedCounter, "expandedCounter #1").toBe(0);
    window.expand();
    expect(window.isExpanded, "expand window").toBe(true);
    expect(showingCounter, "showingCounter #2").toBe(1);
    expect(expandedCounter, "expandedCounter #2").toBe(1);
    window.collapse();
    expect(window.isExpanded, "collapse window").toBe(false);
    expect(showingCounter, "showingCounter #3").toBe(1);
    expect(expandedCounter, "expandedCounter #3").toBe(2);
    window.changeExpandCollapse();
    expect(window.isExpanded, "changeExpandCollapse window, #1").toBe(true);
    expect(showingCounter, "showingCounter #4").toBe(1);
    expect(expandedCounter, "expandedCounter #4").toBe(3);
    window.changeExpandCollapse();
    expect(window.isExpanded, "changeExpandCollapse window, #2").toBe(false);
    expect(showingCounter, "showingCounter #5").toBe(1);
    expect(expandedCounter, "expandedCounter #5").toBe(4);
    window.hide();
    expect(window.isShowing, "hide window").toBe(false);
    expect(showingCounter, "showingCounter #6").toBe(2);
    expect(expandedCounter, "expandedCounter #6").toBe(4);
  });
  test("buttonCss", () => {
    const css = surveyCss.getCss();
    const oldCssCollapsed = css.window.header.buttonCollapsed;
    const oldCssExpanded = css.window.header.buttonExpanded;
    css.window.header.buttonCollapsed = "state1";
    css.window.header.buttonExpanded = "state2";

    const window = new PopupSurveyModel({ elements: [{ type: "text", name: "q1" }] });
    expect(window.css.window.header.buttonCollapsed, "check state1").toBe("state1");
    expect(window.css.window.header.buttonExpanded, "check state2").toBe("state2");
    window.show();
    expect(window.cssButton, "Collapsed").toBe("state1");
    window.expand();
    expect(window.cssButton, "expanded").toBe("state2");
    window.collapse();
    expect(window.cssButton, "Collapsed #2").toBe("state1");

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
    expect(window.cssRoot, "Root collapsed").toBe("windowRoot windowRoot--collapsed");
    window.changeExpandCollapse();
    expect(window.cssRoot, "Root expanded").toBe("windowRoot");
    expect(window.cssHeaderRoot, "HeaderRoot").toBe("headerRoot");
    expect(window.cssBody, "windowBody").toBe("windowBody");
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
    expect(popup.isExpanded, "It is not expanded by default").toBe(false);

    popup.toggleFullScreen();
    expect(popup.isExpanded, "expanded if full screen on").toBe(true);

    popup.isExpanded = false;
    expect(popup.isFullScreen, "fullScreen is off after collapsed").toBe(false);

    popup.isExpanded = true;
    popup.toggleFullScreen();
    popup.toggleFullScreen();
    expect(popup.isExpanded, "expanded after full screen off").toBe(true);
  });
});
