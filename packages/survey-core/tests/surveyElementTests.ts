import { PageModel } from "../src/page";
import { SurveyModel } from "../src/survey";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { CustomWidgetCollection } from "../src/questionCustomWidgets";
import { Serializer } from "../src/jsonobject";
import { PanelModel } from "../src/panel";
import { Question } from "../src/question";
import { RenderingCompletedAwaiter } from "../src/survey-element";
import { QuestionBooleanModel } from "../src/question_boolean";
import { setOldTheme } from "./oldTheme";
import { describe, test, expect, vi } from "vitest";
describe("SurveyElement", () => {
  test("panel isExpanded and isCollapsed", () => {
    var page = new PageModel();
    var panel = page.addNewPanel("p1");
    var stateChangedCounter = 0;
    panel.stateChangedCallback = function () {
      stateChangedCounter++;
    };
    expect(panel.isCollapsed, "Panel is not collapsed by default").toBe(false);
    expect(panel.isExpanded, "Panel is not expanded by default").toBe(false);
    expect(panel.processedTitle, "Panel title is empty").toBe("");
    panel.collapse();
    expect(panel.processedTitle, "Panel title renders name").toBe("p1");
    expect(panel.isCollapsed, "Panel is collapsed").toBe(true);
    expect(stateChangedCounter, "callback is called one time").toBe(1);
    panel.expand();
    expect(panel.isExpanded, "Panel is expanded").toBe(true);
    panel.toggleState();
    expect(panel.isExpanded, "Panel is not expanded").toBe(false);
    panel.toggleState();
    expect(panel.isExpanded, "Panel is expanded").toBe(true);
    expect(stateChangedCounter, "callback is called two time").toBe(4);
  });

  test("panel renderedIsExpanded in design mode after duplicate", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    var p = new PanelModel("p1");
    p.fromJSON({
      "type": "panel",
      "state": "collapsed",
      "elements": [
        {
          "type": "text",
          "name": "question1",
          "title": "Text"
        }
      ]
    });
    p.setSurveyImpl(survey);
    expect(p.renderedIsExpanded).toBeTruthy();
  });

  test("question isExpanded and isCollapsed", () => {
    var page = new PageModel();
    var q = page.addNewQuestion("text", "q1");
    var stateChangedCounter = 0;
    q.stateChangedCallback = function () {
      stateChangedCounter++;
    };
    expect(q.isCollapsed, "Question is not collapsed by default").toBe(false);
    expect(q.isExpanded, "Question is not expanded by default").toBe(false);
    q.collapse();
    expect(q.isCollapsed, "Question is collapsed").toBe(true);
    expect(stateChangedCounter, "callback is called one time").toBe(1);
    q.expand();
    expect(q.isExpanded, "Question is expanded").toBe(true);
    q.toggleState();
    expect(q.isExpanded, "Panel is not expanded").toBe(false);
    q.toggleState();
    expect(q.isExpanded, "Panel is expanded").toBe(true);
    expect(stateChangedCounter, "callback is called two time").toBe(4);
  });

  test("element check that title classes are updated after element state updated", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "panel",
          name: "p1",
          title: "panel",
          elements: [
            {
              type: "text",
              name: "_"
            }
          ]
        },
        {
          type: "text",
          name: "q1"
        }
      ]
    });
    setOldTheme(survey);
    const panel = <PanelModel>survey.getAllPanels()[0];
    const question = <Question>survey.getQuestionByName("q1");
    expect(panel.cssTitle).toBe("sv_p_title");
    expect(question.cssTitle).toBe("sv_q_title");

    panel.state = "collapsed";
    question.state = "collapsed";
    expect(panel.cssTitle).toBe("sv_p_title sv_p_title_expandable sv_p_title_collapsed");
    expect(question.cssTitle).toBe("sv_q_title sv_q_title_expandable sv_q_title_collapsed");

    panel.state = "expanded";
    question.state = "expanded";
    expect(panel.cssTitle).toBe("sv_p_title sv_p_title_expandable sv_p_title_expanded");
    expect(question.cssTitle).toBe("sv_q_title sv_q_title_expandable sv_q_title_expanded");

    panel.state = "default";
    question.state = "default";
    expect(panel.cssTitle).toBe("sv_p_title");
    expect(question.cssTitle).toBe("sv_q_title");

  });

  test("creator v1: https://github.com/surveyjs/survey-creator/issues/1744", () => {
  // moved q from page1 to page2
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1"
            }
          ]
        },
        {
          name: "page2"
        }
      ],
    };
    var survey = new SurveyModel(json);
    var page1 = survey.pages[0];
    var page2 = survey.pages[1];
    var q = survey.getQuestionByName("q1");

    var val: any = "page2";
    q["setPage"](page1, val);

    expect(page1.questions.length, "page1 has no questions").toBe(0);
    expect(page2.questions.length, "page1 has question").toBe(1);
    expect(page2.questions[0].name, "page1 has q1 question").toBe("q1");
  });

  test("Check errors location", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "text",
        name: "q1"
      },
      {
        type: "matrixdynamic",
        name: "q2",
        "columns": [
          {
            "name": "subjects",
            "cellType": "radigroup",
            "isRequired": true,
            "choices": [1, 2, 3]
          }
        ]
      }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const questionInMatrix = survey.getAllQuestions()[1].renderedTable.rows[0].cells[0].question;
    survey.css = defaultCss;
    survey.questionErrorLocation = "top";
    expect(q1.showErrorOnTop).toBeFalsy();
    expect(q1.showErrorOnBottom).toBeFalsy();
    expect(q1.showErrorsAboveQuestion).toBeTruthy();

    expect(questionInMatrix.showErrorOnTop).toBeFalsy();
    expect(questionInMatrix.showErrorOnBottom).toBeFalsy();
    expect(questionInMatrix.showErrorsAboveQuestion).toBeTruthy();
  });
  test("Check error location for questions in panel", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "panel",
          name: "p1",
          elements: [
            {
              name: "q1",
              type: "text"
            }
          ]
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    survey.css = defaultCss;
    survey.questionErrorLocation = "top";
    expect(q1.showErrorOnBottom).toBeFalsy();
    expect(q1.showErrorOnTop).toBeFalsy();
    expect(q1.showErrorsBelowQuestion).toBeFalsy();
    expect(q1.showErrorsAboveQuestion).toBeTruthy();

    survey.questionErrorLocation = "bottom";
    expect(q1.showErrorOnBottom).toBeFalsy();
    expect(q1.showErrorOnTop).toBeFalsy();
    expect(q1.showErrorsAboveQuestion).toBeFalsy();
    expect(q1.showErrorsBelowQuestion).toBeTruthy();
  });
  test("allowRootStyle", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "text",
        name: "q1"
      }]
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.allowRootStyle).toBeTruthy();
    expect(q1.rootStyle).toEqual({
      "flexBasis": "100%",
      "flexGrow": 1,
      "flexShrink": 1,
      "maxWidth": "100%",
      "minWidth": "min(100%, 300px)",
    });
    q1.allowRootStyle = false;
    survey.css = defaultCss;
    expect(q1.rootStyle).toEqual({});
  });
  test("Do not create rootStyle by default", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "text",
        name: "q1"
      }]
    });
    expect(survey.pages[0].getPropertyValue("rootStyle"), "page rootStyle via property value").toBeFalsy();
    expect(survey.getQuestionByName("q1").getPropertyValue("rootStyle"), "q1 rootStyle via property value").toBeFalsy();
    expect(survey.pages[0].rootStyle, "page rootStyle directly").toBeTruthy();
    expect(survey.getQuestionByName("q1").rootStyle, "q1 rootStyle directly").toBeTruthy();
  });
  test("rootStyle on mobile", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "text",
        name: "q1"
      }]
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.rootStyle).toEqual({
      "flexBasis": "100%",
      "flexGrow": 1,
      "flexShrink": 1,
      "maxWidth": "100%",
      "minWidth": "min(100%, 300px)",
    });
    survey.setIsMobile(true);
    expect(q1.rootStyle).toEqual({
      "flexBasis": "100%",
      "flexGrow": 1,
      "flexShrink": 1,
      "maxWidth": "100%",
      "minWidth": "min(100%, 300px)"
    });
  });
  test("question.errorLocation", () => {
    const survey = new SurveyModel({
      elements: [
        {
          name: "q1",
          type: "text"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    expect(q1.getErrorLocation(), "#1").toBe("top");

    survey.questionErrorLocation = "bottom";
    expect(q1.getErrorLocation(), "#2").toBe("bottom");

    q1.errorLocation = "top";
    expect(q1.getErrorLocation(), "#3").toBe("top");

    q1.errorLocation = "default";
    expect(q1.getErrorLocation(), "#4").toBe("bottom");

    survey.questionErrorLocation = "top";
    expect(q1.getErrorLocation(), "#5").toBe("top");

    q1.errorLocation = "bottom";
    expect(q1.getErrorLocation(), "#6").toBe("bottom");
  });
  test("question.errorLocation & panel.questionErrorLocation & page.questionErrorLocation", () => {
    const survey = new SurveyModel({
      pages: [
        {
          elements: [
            {
              name: "p1", type: "panel",
              elements: [
                {
                  name: "q1",
                  type: "text"
                }
              ]
            }
          ]
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const p1 = survey.getPanelByName("p1");
    const page = survey.currentPage;
    expect(q1.getErrorLocation(), "#1").toBe("top");

    survey.questionErrorLocation = "bottom";
    expect(q1.getErrorLocation(), "#2").toBe("bottom");

    page.questionErrorLocation = "top";
    expect(q1.getErrorLocation(), "#3").toBe("top");

    p1.questionErrorLocation = "bottom";
    expect(q1.getErrorLocation(), "#4").toBe("bottom");

    q1.errorLocation = "top";
    expect(q1.getErrorLocation(), "#5").toBe("top");
  });

  test("single page survey in preview", () => {
    const json = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            }
          ],
          "title": "Page 1"
        }
      ],
      "questionsOnPageMode": "singlePage",
      "showPreviewBeforeComplete": true,
    };

    let survey = new SurveyModel(json);
    var oldCss = survey.css;
    survey.css = {
      root: "sd-root-modern"
    };
    expect(survey.getQuestionByName("question1")["getHasFrameV2"](), "question1.getHasFrameV2, #1").toBeTruthy();
    expect(survey.getQuestionByName("question1")["getIsNested"](), "question1.getIsNested, #1").toBeFalsy();
    survey.showPreview();
    expect(survey.getQuestionByName("question1")["getHasFrameV2"](), "question1.getHasFrameV2, #2").toBeTruthy();
    expect(survey.getQuestionByName("question1")["getIsNested"](), "question1.getIsNested, #2").toBeFalsy();
    expect((survey.currentPage.elements[0] as PanelModel).showPanelAsPage).toBeTruthy();
    survey.css = oldCss;
  });

  test("wait for elements to render RenderingCompletedAwaiter + onAfterRenderElement event", () => {
    const json = {
      "elements": [
        { "type": "text", "name": "question1" },
        { "type": "text", "name": "question2" }
      ],
    };

    const survey = new SurveyModel(json);
    const [q1, q2] = survey.getAllQuestions();

    let qRenderLog = "";
    survey.onAfterRenderQuestion.add((s, o) => {
      qRenderLog += "->rendered(" + o.question.name + ")";
    });

    expect(q1.onAfterRenderElement.isEmpty).toBeTruthy();
    expect(q2.onAfterRenderElement.isEmpty).toBeTruthy();

    let log = "";
    const awaiter = new RenderingCompletedAwaiter([q1, q2], () => {
      log += "->elementsRendered";
    });

    expect(log).toBe("");
    expect(qRenderLog).toBe("");
    expect(q1.onAfterRenderElement.length).toBe(1);
    expect(q2.onAfterRenderElement.length).toBe(1);

    q1.afterRender({} as any);

    expect(log).toBe("");
    expect(qRenderLog).toBe("->rendered(question1)");
    expect(q1.onAfterRenderElement.length).toBe(0);
    expect(q1.onAfterRenderElement.isEmpty).toBeTruthy();
    expect(q2.onAfterRenderElement.length).toBe(1);
    expect(q2.onAfterRenderElement.isEmpty).toBeFalsy();

    q2.afterRender({} as any);

    expect(log).toBe("->elementsRendered");
    expect(qRenderLog).toBe("->rendered(question1)->rendered(question2)");
    expect(q1.onAfterRenderElement.isEmpty).toBeTruthy();
    expect(q2.onAfterRenderElement.isEmpty).toBeTruthy();
  });

  test("wait for elements to render RenderingCompletedAwaiter by timeout", () => {
    vi.useFakeTimers();
    try {
      const json = {
        "elements": [
          { "type": "text", "name": "question1" },
          { "type": "text", "name": "question2" }
        ],
      };

      const survey = new SurveyModel(json);
      const [q1, q2] = survey.getAllQuestions();

      let qRenderLog = "";
      survey.onAfterRenderQuestion.add((s, o) => {
        qRenderLog += "->rendered(" + o.question.name + ")";
      });

      expect(q1.onAfterRenderElement.isEmpty).toBeTruthy();
      expect(q2.onAfterRenderElement.isEmpty).toBeTruthy();

      let log = "";
      const awaiter = new RenderingCompletedAwaiter([q1, q2], () => {
        log += "->elementsRendered";
      });

      expect(log).toBe("");
      expect(qRenderLog).toBe("");
      expect(q1.onAfterRenderElement.length).toBe(1);
      expect(q2.onAfterRenderElement.length).toBe(1);

      vi.advanceTimersByTime(500);
      expect(log).toBe("->elementsRendered");
      expect(qRenderLog).toBe("");
      expect(q1.onAfterRenderElement.isEmpty).toBeTruthy();
      expect(q2.onAfterRenderElement.isEmpty).toBeTruthy();
    } finally {
      vi.useRealTimers();
    }
  });
  test("description css should be calculated even if description is empty", () => {
    const json = {
      "elements": [
        { "type": "text", "name": "q1" },
      ],
    };

    const survey = new SurveyModel(json);
    const q = survey.getQuestionByName("q1");
    expect(q.description).toBeFalsy();
    expect(q.cssDescription).toBeTruthy();
  });
  test("description css under input", () => {
    const json = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "q1",
              "description": "123"
            }
          ]
        }
      ],
      "questionDescriptionLocation": "underInput"
    };

    const survey = new SurveyModel(json);
    survey.css = {
      question: {
        description: "sd-desc",
        descriptionUnderInput: "sd-desc--ui"
      }
    };
    const q = survey.getQuestionByName("q1");
    expect(q.cssDescription).toBe("sd-desc sd-desc--ui");
  });

  test("boolean question with no survey returns valid skeletonComponentName", () => {
    var q1 = new QuestionBooleanModel("q1");
    expect(q1.survey, "Question is not lined to a survey").toBe(undefined);
    expect(q1.skeletonComponentName, "Question returns valid skeletonComponentName").toBe("sv-skeleton");
  });
});
