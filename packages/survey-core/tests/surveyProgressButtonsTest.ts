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
    expect(progress.getListElementCss(0), "1) Page 1 style is current").toBe(survey.css.progressButtonsListElementCurrent);
    expect(progress.getListElementCss(1), "1) Page 2 style is empty").toBe("");
    expect(progress.getListElementCss(2), "1) Page 3 style is empty").toBe("");

    progress.clickListElement(2);
    expect(survey.currentPageNo, "currentPageNo #1").toBe(2);
    expect(progress.getListElementCss(0), "2) Page 1 style is passed").toBe(survey.css.progressButtonsListElementPassed);
    expect(progress.getListElementCss(1), "2) Page 2 style is passed").toBe(survey.css.progressButtonsListElementPassed);
    expect(progress.getListElementCss(2), "2) Page 3 style is current").toBe(survey.css.progressButtonsListElementCurrent);

    progress.clickListElement(0);
    expect(survey.currentPageNo, "currentPageNo #2").toBe(0);
    expect(progress.getListElementCss(0), "3) Page 1 style is passed and current").toBe(survey.css.progressButtonsListElementPassed + " " +
    survey.css.progressButtonsListElementCurrent);
    expect(progress.getListElementCss(1), "3) Page 2 style is passed").toBe(survey.css.progressButtonsListElementPassed);
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
    expect(progress.getListElementCss(0), "1) Page 1 style is current").toBe(survey.css.progressButtonsListElementCurrent);
    expect(progress.getListElementCss(1), "1) Page 2 style is empty").toBe("");
    expect(progress.getListElementCss(2), "1) Page 3 style is non clickable").toBe(survey.css.progressButtonsListElementNonClickable);
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
    // Source survey: navigate forward to page3, which marks page1 and page2 as passed.
    const survey1: SurveyModel = new SurveyModel(json);
    const progress1: ProgressButtons = new ProgressButtons(survey1);
    progress1.clickListElement(2);
    const uiState: any = survey1.uiState;
    expect(uiState.pages.page1, "page1 is captured as passed").toEqual({ passed: true });
    expect(uiState.pages.page2, "page2 is captured as passed").toEqual({ passed: true });
    expect(uiState.pages.page3, "current page3 is not passed yet").toBe(undefined);
    expect(uiState.currentPageName, "current page is captured").toBe("page3");

    // Target survey: a fresh model that restores the saved UI state.
    const survey2: SurveyModel = new SurveyModel(json);
    const progress2: ProgressButtons = new ProgressButtons(survey2);
    expect(progress2.getListElementCss(1), "page2 is not passed before restore").toBe("");

    survey2.uiState = uiState;
    // The passed pages are highlighted again purely from the restored state.
    expect(progress2.getListElementCss(0), "page1 is passed after restore").toBe(survey2.css.progressButtonsListElementPassed);
    expect(survey2.visiblePages[1].passed, "page2 is passed after restore").toBe(true);
    expect(survey2.visiblePages[2].passed, "page3 stays not passed after restore").toBe(false);
    // The survey is restored on the actual last visited (current) page, not the last passed one.
    expect(survey2.currentPageNo, "currentPageNo is restored to the last visited page").toBe(2);
  });
});
