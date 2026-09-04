import { SurveyModel } from "../src/survey";
import { ProgressButtons } from "../src/progress-buttons";

import { describe, test, expect } from "vitest";
describe("ProgressButtons", () => {
  test("ProgressButtons list elements", () => {
    const json: any = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "text",
              "name": "question2"
            }
          ]
        },
        {
          "name": "page3",
          "elements": [
            {
              "type": "text",
              "name": "question3"
            }
          ]
        }
      ]
    };
    const survey: SurveyModel = new SurveyModel(json);
    const progress: ProgressButtons = new ProgressButtons(survey);
    expect(progress.getListElementCss(0), "1) Page 1 style is passed and current").toBe(survey.css.progressButtonsListElementPassed + " " + survey.css.progressButtonsListElementCurrent);
    expect(progress.getListElementCss(1), "1) Page 2 style is empty").toBe("");
    expect(progress.getListElementCss(2), "1) Page 3 style is empty").toBe("");

    progress.clickListElement(2);
    expect(survey.currentPageNo, "currentPageNo #1").toBe(2);
    expect(progress.getListElementCss(0), "2) Page 1 style is passed").toBe(survey.css.progressButtonsListElementPassed);
    expect(progress.getListElementCss(1), "2) Page 2 style is empty (skipped)").toBe("");
    expect(progress.getListElementCss(2), "2) Page 3 style is passed and current").toBe(survey.css.progressButtonsListElementPassed + " " + survey.css.progressButtonsListElementCurrent);

    progress.clickListElement(0);
    expect(survey.currentPageNo, "currentPageNo #2").toBe(0);
    expect(progress.getListElementCss(0), "3) Page 1 style is passed and current").toBe(survey.css.progressButtonsListElementPassed + " " +
    survey.css.progressButtonsListElementCurrent);
    expect(progress.getListElementCss(1), "3) Page 2 style is empty (never rendered)").toBe("");
    expect(progress.getListElementCss(2), "3) Page 3 style is passed").toBe(survey.css.progressButtonsListElementPassed);
  });
  test("ProgressButtons list elements non clickable", () => {
    let json: any = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "text",
              "name": "question2"
            }
          ]
        },
        {
          "name": "page3",
          "elements": [
            {
              "type": "text",
              "name": "question3"
            }
          ]
        }
      ]
    };
    let survey: SurveyModel = new SurveyModel(json);
    survey.onServerValidateQuestions.add((_: any, options: any) => options.complete());
    let progress: ProgressButtons = new ProgressButtons(survey);
    expect(progress.getListElementCss(0), "1) Page 1 style is passed and current").toBe(survey.css.progressButtonsListElementPassed + " " + survey.css.progressButtonsListElementCurrent);
    expect(progress.getListElementCss(1), "1) Page 2 style is empty").toBe("");
    expect(progress.getListElementCss(2), "1) Page 3 style is non clickable").toBe(survey.css.progressButtonsListElementNonClickable);
  });
  test("getTabIndex returns 0 for current page and -1 for others", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
        { name: "page3", elements: [{ type: "text", name: "q3" }] }
      ]
    });
    const progress = new ProgressButtons(survey);
    expect(progress.getTabIndex(0)).toBe(0);
    expect(progress.getTabIndex(1)).toBe(-1);
    expect(progress.getTabIndex(2)).toBe(-1);

    survey.currentPageNo = 2;
    expect(progress.getTabIndex(0)).toBe(-1);
    expect(progress.getTabIndex(1)).toBe(-1);
    expect(progress.getTabIndex(2)).toBe(0);
  });
  test("isPageSelected returns true only for current page", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] }
      ]
    });
    const progress = new ProgressButtons(survey);
    expect(progress.isPageSelected(0)).toBe(true);
    expect(progress.isPageSelected(1)).toBe(false);

    survey.currentPageNo = 1;
    expect(progress.isPageSelected(0)).toBe(false);
    expect(progress.isPageSelected(1)).toBe(true);
  });
  test("getButtonAriaLabel returns navigationTitle or fallback", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", navigationTitle: "Introduction", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] }
      ]
    });
    const progress = new ProgressButtons(survey);
    expect(progress.getButtonAriaLabel(survey.visiblePages[0])).toBe("Introduction");
    expect(progress.getButtonAriaLabel(survey.visiblePages[1])).toBe("page2");
  });
  test("onKeyDown navigates focus with arrow keys", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
        { name: "page3", elements: [{ type: "text", name: "q3" }] }
      ]
    });
    const progress = new ProgressButtons(survey);

    const focusedElements: string[] = [];
    const container = document.createElement("div");
    container.setAttribute("role", "tablist");
    for (let i = 0; i < 3; i++) {
      const btn = document.createElement("button");
      btn.dataset.pageIndex = String(i);
      btn.focus = () => focusedElements.push(String(i));
      container.appendChild(btn);
    }
    document.body.appendChild(container);

    const createKeyEvent = (key: string, targetIndex: number): KeyboardEvent => {
      const event = new KeyboardEvent("keydown", { key, bubbles: true });
      Object.defineProperty(event, "target", { value: container.children[targetIndex] });
      return event;
    };

    // ArrowRight from index 0 -> focuses index 1
    progress.onKeyDown(createKeyEvent("ArrowRight", 0));
    expect(focusedElements[focusedElements.length - 1]).toBe("1");

    // ArrowRight from index 2 -> wraps to index 0
    progress.onKeyDown(createKeyEvent("ArrowRight", 2));
    expect(focusedElements[focusedElements.length - 1]).toBe("0");

    // ArrowLeft from index 0 -> wraps to index 2
    progress.onKeyDown(createKeyEvent("ArrowLeft", 0));
    expect(focusedElements[focusedElements.length - 1]).toBe("2");

    // ArrowDown from index 1 -> focuses index 2
    progress.onKeyDown(createKeyEvent("ArrowDown", 1));
    expect(focusedElements[focusedElements.length - 1]).toBe("2");

    // ArrowUp from index 1 -> focuses index 0
    progress.onKeyDown(createKeyEvent("ArrowUp", 1));
    expect(focusedElements[focusedElements.length - 1]).toBe("0");

    // Home from index 2 -> focuses index 0
    progress.onKeyDown(createKeyEvent("Home", 2));
    expect(focusedElements[focusedElements.length - 1]).toBe("0");

    // End from index 0 -> focuses index 2
    progress.onKeyDown(createKeyEvent("End", 0));
    expect(focusedElements[focusedElements.length - 1]).toBe("2");

    document.body.removeChild(container);
  });
  test("onKeyDown does nothing for non-arrow keys", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] }
      ]
    });
    const progress = new ProgressButtons(survey);

    const container = document.createElement("div");
    container.setAttribute("role", "tablist");
    const btn = document.createElement("button");
    btn.dataset.pageIndex = "0";
    let focused = false;
    btn.focus = () => { focused = true; };
    container.appendChild(btn);

    const btn2 = document.createElement("button");
    btn2.dataset.pageIndex = "1";
    btn2.focus = () => { focused = true; };
    container.appendChild(btn2);
    document.body.appendChild(container);

    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true });
    Object.defineProperty(event, "target", { value: container.children[0] });
    progress.onKeyDown(event);
    expect(focused).toBe(false);

    document.body.removeChild(container);
  });
  test("showItemDescriptions returns true when showItemTitles is true and false otherwise", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] }
      ],
      progressBarShowNavigationText: false
    });
    const progress = new ProgressButtons(survey);
    expect(progress.showItemDescriptions).toBe(false);

    survey.progressBarShowNavigationText = true;
    expect(progress.showItemDescriptions).toBe(true);
  });
  test("ProgressButtons progressText is updated on current page change", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "question1" }] },
        { name: "page2", elements: [{ type: "text", name: "question2" }] },
        { name: "page3", elements: [{ type: "text", name: "question3" }] }
      ]
    });
    const progress = new ProgressButtons(survey);

    expect(progress.progressText).toBe("Page 1 of 3");

    survey.nextPage();

    expect(progress.progressText).toBe("Page 2 of 3");
  });
  test("ProgressButtons passed pages survive uiState save & restore", () => {
    const json: any = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "question1" }] },
        { name: "page2", elements: [{ type: "text", name: "question2" }] },
        { name: "page3", elements: [{ type: "text", name: "question3" }] }
      ]
    };
    // MERGE(V3): this test (and "ProgressButtons restores the actually active page" below)
    // conflicts every merge. V3 captures visited pages as `{ shown: true }` and drives state by
    // navigation (currentPage/currentPageNo); master (V2) captures `{ passed: true }` and drives
    // state via ProgressButtons.clickListElement. Keep the V3 body on merge.
    // Source survey: visit page3 directly (page2 stays unvisited), leave all questions empty.
    const survey1: SurveyModel = new SurveyModel(json);
    survey1.currentPage = survey1.pages[2];
    const uiState: any = survey1.uiState;
    // Visited pages are captured as "shown", the skipped one is not.
    expect(uiState.pages.page1.shown, "page1 is captured as shown").toBe(true);
    expect(uiState.pages.page3.shown, "page3 is captured as shown").toBe(true);
    expect(uiState.pages.page2, "page2 was not visited, so it is not captured").toBe(undefined);

    // Target survey: a fresh model that restores the saved UI state.
    const survey2: SurveyModel = new SurveyModel(json);
    const progress2: ProgressButtons = new ProgressButtons(survey2);
    expect(progress2.isListElementPassed(2), "page3 is not passed before restore").toBe(false);

    survey2.uiState = uiState;
    // The visited (but empty) non-first page is passed again purely from the restored state.
    expect(progress2.isListElementPassed(2), "page3 is passed after restore").toBe(true);
    expect(progress2.isListElementPassed(1), "page2 stays not passed after restore").toBe(false);
    // The survey is restored on the last passed page.
    expect(survey2.currentPageNo, "currentPageNo is restored to the last passed page").toBe(2);
  });
  test("Progress bar 'passed' style is not applied to a not-yet-visited page when its value is set via code, Issue#11740", () => {
    const json: any = {
      progressBarType: "pages",
      pages: [
        { name: "patient", title: "Patient", elements: [{ type: "text", name: "firstName" }] },
        { name: "history", title: "History", elements: [{ type: "comment", name: "currentMedications" }] },
        { name: "consent", title: "Consent", elements: [{ type: "boolean", name: "consentTreatment", isRequired: true }] },
      ],
    };
    const survey: SurveyModel = new SurveyModel(json);
    const progress: ProgressButtons = new ProgressButtons(survey);

    // After init the current (first) page is passed, the not-yet-visited pages are not.
    expect(progress.isListElementPassed(0), "first page is passed after init").toBe(true);
    expect(progress.isListElementPassed(1), "history page is not passed after init").toBe(false);
    expect(progress.isListElementPassed(2), "consent page is not passed after init").toBe(false);

    // Setting a value via code on a not-yet-visited page does not mark it as passed.
    survey.setValue("currentMedications", "Aspirin");
    expect(progress.isListElementPassed(1), "history page is still not passed - the value was set via code").toBe(false);
    expect(survey.visiblePages[1].wasShown, "it is not marked as visited").toBe(false);
  });
  test("Progress bar does not mark an unvisited page as passed just because of a default value", () => {
    const survey: SurveyModel = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2", defaultValue: "x" }] },
      ],
    });
    const progress: ProgressButtons = new ProgressButtons(survey);
    expect(progress.isListElementPassed(0), "the current page is passed").toBe(true);
    expect(progress.isListElementPassed(1), "the unvisited page with a default value is not passed").toBe(false);
  });
  test("Progress bar does not mark an unvisited page as passed because of a calculated expression value", () => {
    const survey: SurveyModel = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "expression", name: "date", expression: "currentDate()" }, { type: "html", name: "info", html: "<p>text</p>" }] },
      ],
    });
    const progress: ProgressButtons = new ProgressButtons(survey);
    expect(progress.isListElementPassed(0), "the current page is passed").toBe(true);
    expect(progress.isListElementPassed(1), "the unvisited page with an expression question is not passed").toBe(false);
  });
  test("Progress bar does not mark unvisited pages as passed when their values are set via API, Issue#11740", () => {
    const survey: SurveyModel = new SurveyModel({
      progressBarType: "pages",
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
        { name: "page3", elements: [{ type: "text", name: "q3" }] },
      ],
    });
    const progress: ProgressButtons = new ProgressButtons(survey);
    // Custom application logic loads data from its API and puts it into questions
    // that live on pages the respondent has not visited yet.
    survey.setValue("q2", "value from API");
    survey.setValue("q3", "value from API");
    expect(progress.isListElementPassed(0), "the current page is passed").toBe(true);
    expect(progress.isListElementPassed(1), "page2 got its value via API and is not passed").toBe(false);
    expect(progress.isListElementPassed(2), "page3 got its value via API and is not passed").toBe(false);
    survey.nextPage();
    expect(progress.isListElementPassed(1), "page2 is passed once it is shown").toBe(true);
    expect(progress.isListElementPassed(2), "page3 is still not passed").toBe(false);
  });
  test("Setting and merging survey.data marks pages with answers as visited, Issue#11740", () => {
    const survey: SurveyModel = new SurveyModel({
      progressBarType: "pages",
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
        { name: "page3", elements: [{ type: "text", name: "q3" }] },
      ],
    });
    const progress: ProgressButtons = new ProgressButtons(survey);
    // Assigning survey.data restores a previously saved state: answered pages are passed.
    survey.data = { q2: "stored answer" };
    expect(progress.isListElementPassed(0), "the current page is passed").toBe(true);
    expect(progress.isListElementPassed(1), "page2 answer is restored from data - the page is passed").toBe(true);
    expect(progress.isListElementPassed(2), "page3 has no answer - it is not passed").toBe(false);
    survey.mergeData({ q3: "merged answer" });
    expect(progress.isListElementPassed(2), "page3 answer is merged into data - the page is passed").toBe(true);
  });
  test("Progress bar does not mark unvisited pages as passed when a trigger sets their values, Issue#11740", () => {
    const survey: SurveyModel = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
      ],
      triggers: [{ type: "setvalue", expression: "{q1} = 'a'", setToName: "q2", setValue: "value from trigger" }],
    });
    const progress: ProgressButtons = new ProgressButtons(survey);
    survey.setValue("q1", "a");
    expect(survey.getValue("q2"), "the trigger has set the value").toBe("value from trigger");
    expect(progress.isListElementPassed(1), "page2 got its value from a trigger and is not passed").toBe(false);
  });
  test("ProgressButtons restores the actually active page, not the furthest visited", () => {
    const json: any = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
        { name: "page3", elements: [{ type: "text", name: "q3" }] },
        { name: "page4", elements: [{ type: "text", name: "q4" }] },
        { name: "page5", elements: [{ type: "text", name: "q5" }] }
      ]
    };
    // Visit page1 -> page3 -> page4 -> back to page3, WITHOUT focusing questions or
    // entering values, so the restore relies purely on the saved current page (not on
    // activeElementName, which would restore the last focused question's page).
    const survey1: SurveyModel = new SurveyModel(json);
    survey1.currentPageNo = 2; // page3
    survey1.currentPageNo = 3; // page4
    survey1.currentPageNo = 2; // back to page3 (the actually active page)
    const uiState: any = survey1.uiState;
    expect(uiState.activeElementName, "no question was focused").toBe(undefined);
    expect(uiState.currentPageName, "the actually active page is captured").toBe("page3");
    // page4 was visited (further than the active page) and is still marked shown.
    expect(uiState.pages.page4.shown, "page4 stays shown").toBe(true);

    const survey2: SurveyModel = new SurveyModel(json);
    survey2.uiState = uiState;
    // Restored on page3 (the active page), NOT page4 (the furthest visited).
    expect(survey2.currentPageNo, "restored on the active page, not the furthest visited").toBe(2);
  });

  test("The page buttons view is not used in the questionPerPage mode, Bug#11773", () => {
    const json: any = {
      showProgressBar: true,
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] }
      ]
    };
    const survey: SurveyModel = new SurveyModel(json);
    expect(survey.getProgressTypeComponent(), "standard mode").toBe("sv-progress-pages");

    survey.questionsOnPageMode = "questionPerPage";
    expect(survey.getProgressTypeComponent(), "questionPerPage").toBe("sv-progress-questions");

    // inputPerPage does not remap the type - the bar is hidden there instead
    survey.questionsOnPageMode = "inputPerPage";
    expect(survey.getProgressTypeComponent(), "inputPerPage").toBe("sv-progress-pages");

    survey.questionsOnPageMode = "standard";
    expect(survey.getProgressTypeComponent(), "back to standard").toBe("sv-progress-pages");
  });
});
