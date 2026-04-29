import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { SurveyModel } from "../src/survey";
import { UIStateChangedEvent } from "../src/survey-events-api";

import { describe, test, expect } from "vitest";
describe("SurveyStateTest", () => {
  test("restore element state property", () => {
    const survey = new SurveyModel();
    expect(survey.uiState, "there is no state").toEqualValues({});

    const page = survey.addNewPage("page1");
    expect(page.uiState, "page state is undefined").toLooseEqual(undefined);

    const quesiton = page.addNewQuestion("text", "question1");
    expect(quesiton.uiState, "quesiton state is undefined").toLooseEqual(undefined);
    expect(survey.uiState, "there is no state #2").toEqualValues({});

    quesiton.collapse();
    expect(quesiton.uiState, "quesiton state is no undefined").toEqualValues({ collapsed: true });
    expect(survey.uiState, "survey state is no undefined").toEqualValues({ questions: { question1: { collapsed: true } } });

    survey.uiState = { questions: { question1: { collapsed: false } } };
    expect(quesiton.isExpanded, "question is expanded").toLooseEqual(true);
  });

  test("restore last focused question state", () => {
    const config = {
      pages: [
        {
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        },
        {
          elements: [
            { type: "text", name: "q3" },
            { type: "text", name: "q4" }
          ]
        },
        {
          elements: [
            { type: "text", name: "q5" },
            { type: "text", name: "q6" }
          ]
        }
      ]
    };

    let survey = new SurveyModel(config);
    expect(survey.uiState, "there is no state").toEqualValues({});
    survey.whenQuestionFocusIn(survey.getQuestionByName("q3"));
    expect(survey.uiState, "there is no state").toEqualValues({ "activeElementName": "q3" });

    survey = new SurveyModel(config);
    expect(survey.uiState, "there is no state #2").toEqualValues({});
    expect(survey.currentPageNo, "survey on first page").toLooseEqual(0);
    survey.uiState = { "activeElementName": "q5" };
    expect(survey.currentPageNo, "survey on last page").toLooseEqual(2);
  });

  test("restore current index in dynamic pannel", () => {
    const panel = new QuestionPanelDynamicModel("panel1");
    panel.template.addNewQuestion("text", "question1");
    panel.panelCount = 3;

    expect(panel.uiState, "panel state is undefined").toEqualValues(undefined);

    panel.displayMode = "tab";
    panel.currentIndex = 1;

    expect(panel.uiState, "panel current index is 1").toEqualValues({ activePanelIndex: 1 });

    panel.uiState = { activePanelIndex: 2 };
    expect(panel.currentIndex, "panel current index is 2").toLooseEqual(2);
  });

  test("restore active element in dynamic panel", () => {
    const config = {
      pages: [
        {
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        },
        {
          elements: [
            { type: "text", name: "q3" },
            {
              type: "paneldynamic",
              name: "q4",
              templateElements: [
                { type: "text", name: "q5" },
                { type: "text", name: "q6" }
              ],
              panelCount: 3,
              displayMode: "tab"
            }
          ]
        }
      ]
    };

    let survey = new SurveyModel(config);
    survey.currentPageNo = 1;

    let panel = survey.getQuestionByName("q4");
    panel.currentIndex = 1;

    survey.whenQuestionFocusIn(panel.panels[1].getQuestionByName("q6"));
    expect(survey.uiState, "survey state with last active").toEqualValues({ questions: { q4: { activePanelIndex: 1 } }, activeElementName: "q4" });

    survey = new SurveyModel(config);
    survey.uiState = { questions: { q4: { activePanelIndex: 1 } }, activeElementName: "q4" };
    expect(survey.currentPageNo, "survey current page numbers is 1").toLooseEqual(1);

    panel = survey.getQuestionByName("q4");
    expect(panel.currentIndex, "panel current index is 1").toLooseEqual(1);
  });

  test("onUIStateChanged event test", () => {
    const config = {
      elements: [
        { type: "text", name: "q1", state: "collapsed" },
        {
          type: "paneldynamic",
          name: "q2",
          templateElements: [
            { type: "text", name: "q3" },
            { type: "text", name: "q4" }
          ],
          panelCount: 3,
          displayMode: "tab"
        }
      ]
    };

    const survey = new SurveyModel(config);
    let events: any[] = [];
    survey.onUIStateChanged.add((sender, options: UIStateChangedEvent) => {
      events.push({ reason: options.changedProperty, name: options.element.name });
    });

    survey.getQuestionByName("q1").expand();

    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q2");
    panel.currentIndex = 1;
    survey.whenQuestionFocusIn(panel.currentPanel.getQuestionByName("q4"));

    expect(events, "check received events").toEqualValues([
      { reason: "collapsed", name: "q1" },
      { reason: "activePanelIndex", name: "q2" },
      { reason: "activeElementName", name: "q4" }
    ]);
  });
});
