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
});
