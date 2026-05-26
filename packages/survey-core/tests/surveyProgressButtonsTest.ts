import { SurveyModel } from "../src/survey";
import { ProgressButtons } from "../src/progress-buttons";
import { surveyCss } from "../src/defaultCss/defaultCss";

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
  test("showItemDescriptions returns false when showItemTitles is false", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] }
      ],
      progressBarShowPageTitles: false,
      progressBarShowPageDescriptions: true
    });
    surveyCss.currentType = "default";
    const progress = new ProgressButtons(survey);
    expect(progress.showItemDescriptions).toBe(false);
  });
  test("showItemDescriptions respects progressBarShowPageDescriptions when currentType is default", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] }
      ],
      progressBarShowPageTitles: true,
      progressBarShowPageDescriptions: false
    });
    surveyCss.currentType = "default";
    const progress = new ProgressButtons(survey);
    expect(progress.showItemDescriptions).toBe(false);

    survey.progressBarShowPageDescriptions = true;
    expect(progress.showItemDescriptions).toBe(true);
  });
  test("showItemDescriptions returns true when currentType is not default and titles are shown", () => {
    const prevType = surveyCss.currentType;
    surveyCss.currentType = "defaultV2";
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] }
      ]
    });
    const progress = new ProgressButtons(survey);
    expect(progress.showItemDescriptions).toBe(true);
    surveyCss.currentType = prevType;
  });
});
