import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { Question, ValidationContext } from "../src/question";
import { PanelModel } from "../src/panel";
import { QuestionTextModel } from "../src/question_text";
import { JsonObject, Serializer } from "../src/jsonobject";
import { FlowPanelModel } from "../src/flowpanel";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { settings } from "../src/settings";
import { AdaptiveActionContainer } from "../src/actions/adaptive-container";
import { ActionContainer } from "../src/actions/container";
import { IElement } from "../src/base-interfaces";
import { SurveyElement } from "../src/survey-element";
import { setOldTheme } from "./oldTheme";
import { CustomWidgetCollection } from "../src/questionCustomWidgets";
import { Helpers } from "../src/helpers";
import { FunctionFactory, registerFunction } from "../src/functionsfactory";
import { describe, test, expect } from "vitest";
describe("Panel", () => {
  test("questions-elements synhronization", () => {
    const page = new PageModel();
    page.addNewQuestion("text", "q1");
    page.addNewQuestion("text", "q2");
    page.addNewQuestion("text", "q3");
    expect(page.questions.length, "There are 3 questions").toLooseEqual(3);
    expect(page.elements.length, "There are 3 elements").toLooseEqual(3);
    page.removeQuestion(page.questions[1]);
    expect(page.questions.length, "There are 2 questions").toLooseEqual(2);
    expect(page.elements.length, "There are 2 elements").toLooseEqual(2);
    expect((<Question>page.elements[1]).name, "The second element is correct").toLooseEqual("q3");
  });

  test("elements-questions synhronization", () => {
    const page = new PageModel();
    page.elements.push(new QuestionTextModel("q1"));
    page.elements.push(new QuestionTextModel("q2"));
    page.elements.push(new QuestionTextModel("q3"));
    expect(page.elements.length, "There are 3 elements").toLooseEqual(3);
    expect(page.questions.length, "There are 3 questions").toLooseEqual(3);
    page.elements.splice(1, 1);
    expect(page.elements.length, "There are 2 elements").toLooseEqual(2);
    expect(page.questions.length, "There are 2 questions").toLooseEqual(2);
    expect(page.questions[1].name, "The second element is correct").toLooseEqual("q3");
  });

  test("load page from json with old questions", () => {
    const page = new PageModel();
    const jsonObject = new JsonObject();
    jsonObject.toObject(
      {
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
        ],
      },
      page
    );
    expect(page.elements.length, "There are two elements").toLooseEqual(2);
    expect(page.questions.length, "There are two questions").toLooseEqual(2);
    expect(jsonObject.errors.length, "There is no errors").toLooseEqual(0);
  });

  test("Simple test on nested panel", () => {
    const page = new PageModel();
    page.addNewQuestion("text", "q1");
    const panel = page.addNewPanel("p1");
    expect(page.elements.length, "There are two elements").toLooseEqual(2);
    expect(page.questions.length, "There is still one question").toLooseEqual(1);
    panel.addNewQuestion("text", "q2_1");
    panel.addNewQuestion("text", "q2_2");
    expect(page.elements.length, "There are two elements").toLooseEqual(2);
    expect(page.questions.length, "There are three questions").toLooseEqual(3);
    page.addNewQuestion("text", "q3");
    expect(page.elements.length, "There are two elements").toLooseEqual(3);
    expect(page.questions.length, "There are four questions").toLooseEqual(4);
    panel.addNewQuestion("text", "q2_3");
    expect(page.elements.length, "There are two elements").toLooseEqual(3);
    expect(page.questions.length, "There are five questions").toLooseEqual(5);
  });

  test("add questions to list", () => {
    const page = new PageModel();
    page.addNewQuestion("text", "q1");
    const panel = page.addNewPanel("p1");
    panel.addNewQuestion("text", "q2_1");
    page.addNewQuestion("text", "q3");
    const list = [];
    page.addQuestionsToList(list);
    expect(list.length, "There are three questions").toLooseEqual(3);
  });

  test("load nested panel from json", () => {
    const page = new PageModel();
    const jsonObject = new JsonObject();
    jsonObject.toObject(
      {
        elements: [
          { type: "text", name: "q1" },
          {
            type: "panel",
            elements: [
              { type: "text", name: "q1" },
              { type: "text", name: "q3" },
            ],
          },
          { type: "text", name: "q4" },
        ],
      },
      page
    );
    expect(page.elements.length, "There are two elements").toLooseEqual(3);
    expect(page.questions.length, "There are four questions").toLooseEqual(4);
    expect(jsonObject.errors.length, "There is no errors").toLooseEqual(0);
  });

  test("panel rows generation - simple", () => {
    const page = new PageModel();
    const q1 = page.addNewQuestion("text", "q1");
    page.addNewQuestion("text", "q2");
    expect(page.rows.length, "There are two rows").toLooseEqual(2);
    expect(page.rows[0].visible, "The first row is visible").toLooseEqual(true);
    q1.visible = false;
    expect(page.rows[0].visible, "The first row is invisible now").toLooseEqual(false);
  });

  test("panel rows generation - startNewLine false", () => {
    const page = new PageModel();
    const q1 = page.addNewQuestion("text", "q1");
    const q2 = page.addNewQuestion("text", "q2");
    q2.startWithNewLine = false;
    expect(page.rows.length, "There is one row").toLooseEqual(1);
    expect(page.rows[0].visible, "The first row is visible").toLooseEqual(true);
    q1.visible = false;
    expect(page.rows[0].visible, "The first row is still visible").toLooseEqual(true);
    q2.visible = false;
    expect(page.rows[0].visible, "The first row is invisible now").toLooseEqual(false);
  });

  test("panel rows generation - nested panel", () => {
    const page = new PageModel();
    page.addNewQuestion("text", "q1");
    const p1 = page.addNewPanel("p1");
    const p1q1 = p1.addNewQuestion("text", "p1q1");
    expect(page.rows.length, "There is two rows").toLooseEqual(2);
    expect(page.rows[1].visible, "The panel row is visible").toLooseEqual(true);
    p1.visible = false;
    expect(page.rows[1].visible, "The panel row is invisible since panel is invisible").toLooseEqual(false);
    p1.visible = true;
    expect(page.rows[1].visible, "The panel row is visible since panel is visible").toLooseEqual(true);
    p1q1.visible = false;
    expect(page.rows[1].visible, "The panel row is invisible since all questions are invisible").toLooseEqual(false);
    p1q1.visible = true;
    expect(page.rows[1].visible, "The panel row is visible again").toLooseEqual(true);
    p1.removeElement(p1q1);
    expect(page.rows[1].visible, "The panel row is invisible - it is empty").toLooseEqual(false);
  });
  test("panel row lazy rendering: nested panel becoming visible via visibleIf force-renders inner rows, Bug#11191", () => {
    const prevLazyRowsRendering = settings.lazyRowsRendering;
    settings.lazyRowsRendering = true;
    try {
      const survey = new SurveyModel({
        elements: [
          { type: "text", name: "q1" },
          {
            type: "panel", name: "p1", visibleIf: "{q1} = 1",
            elements: [
              { type: "text", name: "q2" },
              { type: "text", name: "q3" }
            ]
          }
        ]
      });
      const page = survey.pages[0];
      page.onFirstRendering();
      const p1 = <PanelModel>survey.getPanelByName("p1");
      expect(p1.isVisible, "Nested panel starts hidden").toLooseEqual(false);
      expect(p1.rows.length, "Nested panel has two rows built").toLooseEqual(2);
      expect(p1.rows[0].isNeedRender, "Row 0 starts as a lazy skeleton").toLooseEqual(false);
      expect(p1.rows[0].isLazyRendering(), "Row 0 starts in lazy mode").toLooseEqual(true);

      survey.setValue("q1", 1);

      expect(p1.isVisible, "Nested panel becomes visible after visibleIf flips").toLooseEqual(true);
      expect(p1.rows[0].isNeedRender, "Row 0 is force-rendered when parent panel becomes visible").toLooseEqual(true);
      expect(p1.rows[1].isNeedRender, "Row 1 is force-rendered when parent panel becomes visible").toLooseEqual(true);
      // Lazy mode is cleared so a subsequent React StrictMode unmount cannot flip isNeedRender back to false
      expect(p1.rows[0].isLazyRendering(), "Row 0 is no longer lazy after force render").toLooseEqual(false);
      expect(p1.rows[1].isLazyRendering(), "Row 1 is no longer lazy after force render").toLooseEqual(false);
    } finally {
      settings.lazyRowsRendering = prevLazyRowsRendering;
    }
  });
  test("Expand panel on validation error", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page1");
    const panel1 = page.addNewPanel("p1");
    panel1.collapse();
    const panel2 = panel1.addNewPanel("p2");
    panel2.collapse();
    const question = <Question>panel2.addNewQuestion("text", "q1");
    question.isRequired = true;
    expect(panel1.isCollapsed, "Panel1 is collapsed").toLooseEqual(true);
    expect(panel2.isCollapsed, "Panel2 is collapsed").toLooseEqual(true);
    page.validate(true, true);
    expect(panel1.isCollapsed, "Panel1 is not collapsed").toLooseEqual(false);
    expect(panel2.isCollapsed, "Panel2 is not collapsed").toLooseEqual(false);
  });
  test("Render name if title is empty and panel is expanded or collapsed", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page1");
    const panel = page.addNewPanel("p1");
    expect(panel.locTitle.textOrHtml, "panel title is empty").toBeFalsy();
    expect(panel.hasTitle, "no title, #1").toBeFalsy();
    panel.collapse();
    expect(panel.locTitle.textOrHtml, "panel title is name").toLooseEqual("p1");
    expect(panel.hasTitle, "has title, #2").toBeTruthy();
    panel.state = "default";
    expect(panel.locTitle.textOrHtml, "panel title is empty, #2").toBeFalsy();
    expect(panel.hasTitle, "no title, #3").toBeFalsy();
    panel.expand();
    expect(panel.locTitle.textOrHtml, "panel title is name, #2").toLooseEqual("p1");
    expect(panel.hasTitle, "has title, #3").toBeTruthy();
    panel.title = "some text";
    expect(panel.locTitle.textOrHtml, "panel title is not empty").toLooseEqual("some text");
    expect(panel.hasTitle, "has title, #4").toBeTruthy();
    panel.title = "";
    panel.state = "default";
    expect(panel.locTitle.textOrHtml, "panel title is empty, #3").toBeFalsy();
    expect(panel.hasTitle, "no title, #5").toBeFalsy();
    panel.title = "some text";
    expect(panel.locTitle.textOrHtml, "panel title is not empty, #2").toLooseEqual("some text");
    expect(panel.hasTitle, "has title, #6").toBeTruthy();
  });
  test("Panel.isRequired", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page1");
    const panel = page.addNewPanel("p1");
    const panel2 = page.addNewPanel("p2");
    const q1 = <Question>panel.addNewQuestion("text", "q1");
    const q2 = <Question>panel.addNewQuestion("text", "q2");
    expect(panel.validate(), "There is no errors").toLooseEqual(true);
    expect(panel.hasVisibleErrors, "There is no visible errors").toLooseEqual(false);
    panel.isRequired = true;
    expect(panel.validate(), "All questions are empty").toLooseEqual(false);
    expect(panel.errors.length, "One error").toLooseEqual(1);
    expect(panel.hasVisibleErrors, "There is visible errors").toLooseEqual(true);
    q1.value = "1";
    expect(panel.validate(), "The first question is not empty").toLooseEqual(true);
    expect(panel.hasVisibleErrors, "There no visible errors").toLooseEqual(false);
    panel2.isRequired = true;
    expect(panel.validate(), "There is no visible questions in the panel").toLooseEqual(true);
    expect(panel.hasVisibleErrors, "There no visible errors").toLooseEqual(false);
  });
  test("Panel.isRequired and hideRequiredErrors, Bug#2679", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page1");
    const panel = page.addNewPanel("p1");
    panel.addNewQuestion("text", "q1");
    panel.isRequired = true;
    survey.hideRequiredErrors = true;
    expect(panel.validate(), "All questions are empty").toLooseEqual(false);
    expect(panel.errors.length, "One error").toLooseEqual(1);
    expect(panel.errors[0].visible, "error is invisible").toLooseEqual(false);
    expect(panel.hasVisibleErrors, "There is error, but it is invisible").toLooseEqual(false);
  });
  test("Panel.isRequired&checkErrorsMode='onValueChanged', bug#6395", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "panel",
          name: "panel1",
          elements: [
            {
              type: "text",
              name: "q1",
            },
          ],
          isRequired: true,
        },
        {
          type: "panel",
          name: "panel2",
          elements: [
            {
              type: "panel",
              name: "panel3",
              elements: [
                {
                  type: "text",
                  name: "q2",
                },
              ],
            },
          ],
          isRequired: true,
        }
      ]
    });
    const panel1 = survey.getPanelByName("panel1");
    const q1 = survey.getQuestionByName("q1");
    expect(panel1.errors.length, "There is no errors in panel, #1").toLooseEqual(0);
    panel1.validate();
    expect(panel1.errors.length, "There is an error in panel, #2").toLooseEqual(1);
    q1.value = "abc";
    expect(panel1.errors.length, "There is no errors in panel, #3").toLooseEqual(0);

    const panel2 = survey.getPanelByName("panel2");
    const q2 = survey.getQuestionByName("q2");
    expect(panel2.errors.length, "There is no errors in panel, #4").toLooseEqual(0);
    panel2.validate();
    expect(panel2.errors.length, "There is an error in panel, #5").toLooseEqual(1);
    q2.value = "abc";
    expect(panel2.errors.length, "There is no errors in panel, #6").toLooseEqual(0);
  });
  test("Panel with paneldynamic error focus", () => {
    const json = {
      elements: [
        {
          name: "p1",
          type: "panel",
          elements: [
            {
              type: "paneldynamic",
              name: "paneldynamic1",
              panelCount: 1,
              templateElements: [
                { type: "text", name: "textinpd", isRequired: true },
              ],
            },
          ],
        },
      ],
    };
    const survey = new SurveyModel(json);
    const context = new ValidationContext({ fireCallback: true, focusOnFirstError: true });
    const panel = survey.getPanelByName("p1");

    survey.isCurrentPageHasErrors;
    panel.validateElement(context);

    expect(context.firstErrorQuestion?.name, "scroll to first question in the dynamicpanel instead of dynamicpanel itself").toLooseEqual("textinpd");
  });
  test("Required panel error focus/not focus - T3101 - Stop focus when page has error", () => {
    var focusedQuestionId = "";
    const oldFunc = SurveyElement.FocusElement;
    SurveyElement.FocusElement = function (elId: string): boolean {
      focusedQuestionId = elId;
      return true;
    };
    const json = {
      elements: [
        { type: "text", name: "chk0" },
        {
          name: "p1",
          type: "panel",
          isRequired: true,
          elements: [
            { type: "text", name: "chk1", isRequired: true },
            {
              type: "panel",
              name: "panel",
              elements: [
                { type: "text", name: "textinpd", isRequired: true },
              ],
            },
          ],
        },
      ],
    };
    const survey = new SurveyModel(json);
    const page = <PageModel>survey.currentPage;

    let context = new ValidationContext({ fireCallback: true, focusOnFirstError: true });
    page.validateElement(context);
    expect(context.firstErrorQuestion.name, "scroll to first question in the dynamicpanel instead of dynamicpanel itself").toLooseEqual("chk1");
    expect(focusedQuestionId, "focus the question").toLooseEqual(context.firstErrorQuestion.inputId);

    focusedQuestionId = "";
    context = new ValidationContext({ fireCallback: true, focusOnFirstError: false });
    page.validateElement(context);
    expect(focusedQuestionId, "don't scroll to question - T3101 - Stop focus when page has error").toBeFalsy();
    SurveyElement.FocusElement = oldFunc;
  });

  test("Panel.getValue()", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page1");
    const panel1 = page.addNewPanel("p1");
    const panel2 = page.addNewPanel("p2");
    const panel3 = panel1.addNewPanel("p3");
    panel1.addNewQuestion("text", "q1");
    panel2.addNewQuestion("text", "q2");
    panel3.addNewQuestion("text", "q3");
    panel1.addNewQuestion("text", "qEmpty");
    survey.setValue("q1", "val1");
    survey.setValue("q2", "val2");
    survey.setValue("q3", "val3");

    expect(panel3.getValue(), "Nested panel.getValue() works correctly").toEqualValues({ q3: "val3" });
    expect(panel1.getValue(), "Panel.getValue()  works correctly").toEqualValues({ q1: "val1", q3: "val3" });
    expect(page.getValue(), "Page.getValue() works correctly").toEqualValues({ q1: "val1", q2: "val2", q3: "val3" });
    expect(page.getValue(), "survey.data == page.getValue() in our case").toEqualValues(survey.data);
  });

  test("Panel.getValue() + others, Bug# 1573, T1701", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "spread",
          showOtherItem: true,
          choices: [
            {
              value: "butter",
              text: "Butter",
            },
          ],
        },
      ],
    });
    survey.setValue("spread", "other");
    survey.setComment("spread", "Jam");
    expect(survey.data, "survey.data is correct").toEqualValues({ spread: "other", "spread-Comment": "Jam" });
    expect(survey.currentPage.getValue(), "survey.currentPage.getValue() is correct").toEqualValues({ spread: "other", "spread-Comment": "Jam" });
    const question = <QuestionCheckboxModel>survey.getQuestionByName("spread");
    question.otherValue = "";
    question.value = "butter";
    expect(survey.data, "survey.data is correct, not other").toEqualValues({ spread: "butter" });
    expect(survey.currentPage.getValue(), "survey.currentPage.getValue() is correct, not other").toEqualValues({ spread: "butter" });
    survey.storeOthersAsComment = false;
    question.value = "other";
    question.otherValue = "Jam";
    expect(survey.data, "survey.data is correct, other +  storeOthersAsComment = false").toEqualValues({ spread: "Jam" });
    expect(survey.currentPage.getValue(), "survey.currentPage.getValue() is correct + storeOthersAsComment = false").toEqualValues({ spread: "Jam" });
  });

  test("Panel.getComments()", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page1");
    const panel1 = page.addNewPanel("p1");
    const panel2 = page.addNewPanel("p2");
    const panel3 = panel1.addNewPanel("p3");
    panel1.addNewQuestion("text", "q1");
    panel2.addNewQuestion("text", "q2");
    panel3.addNewQuestion("text", "q3");
    panel1.addNewQuestion("text", "qEmpty");
    survey.setComment("q1", "val1");
    survey.setComment("q2", "val2");
    survey.setComment("q3", "val3");

    expect(panel3.getComments(), "Nested panel.getComments() works correctly").toEqualValues({ q3: "val3" });
    expect(panel1.getComments(), "Panel.getComments()  works correctly").toEqualValues({ q1: "val1", q3: "val3" });
    expect(page.getComments(), "Page.getComments() works correctly").toEqualValues({ q1: "val1", q2: "val2", q3: "val3" });
  });

  test("Page getPanels and Survey getAllPanels", () => {
    const survey = new SurveyModel();
    const page1 = survey.addNewPage("page1");
    const panel1 = page1.addNewPanel("p1");
    const panel2 = page1.addNewPanel("p2");

    const page2 = survey.addNewPage("page2");
    const panel3 = page2.addNewPanel("p3");

    expect(survey.getAllPanels().length, "There are 3 panels in the survey").toLooseEqual(3);
    expect(survey.pages[0].getPanels().length, "There are 2 panels in the first page").toLooseEqual(2);
    expect(survey.pages[1].getPanels().length, "There is 1 panel in the second page").toLooseEqual(1);
  });

  test("Get first focused question correctly, Bug#1417", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "html", name: "q1" },
        {
          type: "panel",
          name: "p1",
          visible: false,
          elements: [
            { type: "text", name: "q2" },
            { type: "text", name: "q3", isRequired: true },
          ],
        },
        {
          type: "panel",
          name: "p2",
          visible: false,
          elements: [
            {
              type: "panel",
              name: "p3",
              elements: [
                { type: "text", name: "q4" },
                { type: "text", name: "q5", isRequired: true },
              ],
            },
          ],
        },
        {
          type: "panel",
          name: "p4",
          elements: [
            { type: "text", name: "q6" },
            { type: "text", name: "q7", isRequired: true },
          ],
        },
      ],
    });
    const page = survey.pages[0];
    page.validate(true);
    expect(page.getFirstQuestionToFocus().name, "The first question for focusing is q6").toLooseEqual("q6");
    expect(page.getFirstQuestionToFocus(true).name, "The first question for focusing with errors is q7").toLooseEqual("q7");
  });
  test("Get first focused error question for matrix cell", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 1,
          columns: [
            {
              cellType: "text",
              name: "col1",
              isRequired: true
            },
          ],
        }
      ],
    });
    const page = survey.pages[0];
    page.validate(true);
    expect(page.getFirstQuestionToFocus(true).name, "The first question for focusing is matrix cell question").toLooseEqual("col1");
  });
  test("Get first focused error question for panel dynamic question", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 1,
          templateElements: [
            {
              type: "text",
              name: "question1",
              isRequired: true
            },
          ],
        }
      ],
    });
    const page = survey.pages[0];
    page.validate(true);
    expect(page.getFirstQuestionToFocus(true).name, "The first question for focusing is in matrix dynamic").toLooseEqual("question1");
  });
  test("Get first focused question on collapsed panel", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "panel",
          name: "panel1",
          state: "collapsed",
          elements: [{ type: "text", name: "q1", isRequired: true }],
        },
        { type: "text", name: "q2" }
      ],
    });
    const page = survey.pages[0];
    expect(page.getFirstQuestionToFocus().name, "q1 is in collapsed panel").toLooseEqual("q2");
    expect(page.getFirstQuestionToFocus(false, true).name, "ignore collapsed state").toLooseEqual("q1");
    page.validate(true);
    expect(page.getFirstQuestionToFocus(true).name, "q1 has error").toLooseEqual("q1");
  });
  test("Flow Panel, add new element/remove element", () => {
    const panel = new FlowPanelModel("p");
    panel.addNewQuestion("text", "q1");
    expect(panel.content, "element was added into content").toLooseEqual("{element:q1}");
    panel.removeElement(panel.elements[0]);
    expect(panel.content, "element is removed from content").toLooseEqual("");
  });

  test("getLayoutType()", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("p");
    const q1 = page.addNewQuestion("text", "q1");
    const flowPanel = new FlowPanelModel("flowPanel");
    page.addElement(flowPanel);
    const panel = page.addNewPanel("panel");
    const q2 = panel.addNewQuestion("text", "q2");
    const q3 = flowPanel.addNewQuestion("text", "q3");

    expect(page.getLayoutType()).toLooseEqual("row");
    expect(panel.getLayoutType()).toLooseEqual("row");
    expect(flowPanel.getLayoutType()).toLooseEqual("row");
    expect(panel.getChildrenLayoutType()).toLooseEqual("row");
    expect(flowPanel.getChildrenLayoutType()).toLooseEqual("flow");
    expect(q1.getLayoutType()).toLooseEqual("row");
    expect(q2.getLayoutType()).toLooseEqual("row");
    expect(q3.getLayoutType()).toLooseEqual("flow");
  });

  test("Hide question title for flow layout", () => {
    const flowPanel = new FlowPanelModel("flowPanel");
    const q = flowPanel.addNewQuestion("text", "q");
    expect(q.getTitleLocation(), "Hide for flow layout").toLooseEqual("hidden");
  });
  test("Do not generate rows and do not set renderWidth", () => {
    const flowPanel = new FlowPanelModel("flowPanel");
    const q = flowPanel.addNewQuestion("text", "q");
    expect(flowPanel.rows.length, "There is no rows").toLooseEqual(0);
    expect(q.renderWidth, "render width is empty").toLooseEqual("");
  });
  test("question.cssRoot class", () => {
    const survey = new SurveyModel();
    setOldTheme(survey);
    const page = survey.addNewPage("p");
    const flowPanel = new FlowPanelModel("flowPanel");
    page.addElement(flowPanel);
    const q1 = flowPanel.addNewQuestion("text", "q1");
    const q2 = page.addNewQuestion("text", "q2");
    expect(q1.cssRoot, "flow question.cssRoot").toLooseEqual("sv_q_flow sv_qstn");
    expect(q2.cssRoot, "non flow question.cssRoot").toLooseEqual("sv_q sv_qstn");
    q1.titleLocation = "left";
    q2.titleLocation = "left";
    expect(q1.cssRoot, "flow question.cssRoot").toLooseEqual("sv_q_flow sv_qstn");
    expect(q2.cssRoot, "non flow question.cssRoot").toLooseEqual("sv_q sv_qstn sv_qstn_left");
  });
  test("FlowPanel: checkbox and radiogroup - always keep colCount to 0", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("p");
    const flowPanel = new FlowPanelModel("flowPanel");
    page.addElement(flowPanel);
    const q1 = <QuestionCheckboxModel>flowPanel.addNewQuestion("checkbox", "q1");
    const q2 = <QuestionRadiogroupModel>(
      flowPanel.addNewQuestion("radiogroup", "q2")
    );
    expect(q1.colCount, "checkbox.colCount is 0 now").toLooseEqual(0);
    expect(q2.colCount, "radiogroup.colCount is 0 now").toLooseEqual(0);
    const q3 = new QuestionCheckboxModel("q3");
    q3.colCount = 2;
    flowPanel.addElement(q3);
    expect(q3.colCount, "q3.colCount is 0 now").toLooseEqual(0);
    q2.colCount = 2;
    expect(q2.colCount, "radiogroup.colCount is still 0").toLooseEqual(0);
  });
  test("FlowPanel: support limited number of questions", () => {
    const flowPanel = new FlowPanelModel("flowPanel");
    expect(flowPanel.addNewPanel("p1"), "We can't add panel").toBeFalsy();
    expect(flowPanel.addNewQuestion("matrix", "q1"), "We can't add matrix").toBeFalsy();
    expect(flowPanel.addNewQuestion("boolean", "q1"), "We can add boolean").toBeTruthy();
  });

  test("PageModel: isDesignMode && allowShowEmptyTitleInDesignMode", () => {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page");
    expect(page.hasTitle, "Empty title is not visible at runtime").toBeFalsy();
    expect(page._showDescription, "Empty description is not visible at runtime - description").toBeFalsy();
    survey.setDesignMode(true);
    expect(page.hasTitle, "Empty title is visible in DesignMode by default").toBeTruthy();
    expect(page._showDescription, "Empty description is visible in DesignMode by default").toBeTruthy();
    settings.allowShowEmptyDescriptionInDesignMode = false;
    expect(page.hasTitle, "Empty title is visible in DesignMode after description flag").toBeTruthy();
    expect(page._showDescription, "Empty description is not visible in DesignMode after description flag").toBeFalsy();
    settings.allowShowEmptyDescriptionInDesignMode = true;
    settings.allowShowEmptyTitleInDesignMode = false;
    expect(page.hasTitle, "Empty title is not visible at DesignMode after title flag").toBeFalsy();
    expect(page._showDescription, "Empty description is not visible at DesignMode after tile flag").toBeFalsy();
    page.title = "My title";
    page.description = "My description";
    expect(page.hasTitle, "Entered title is visible in DesignMode").toBeTruthy();
    expect(page._showDescription, "Entered description is visible in DesignMode").toBeTruthy();
    page.title = "";
    page.description = "";
    expect(page.hasTitle, "No title").toBeFalsy();
    expect(page._showDescription, "No description").toBeFalsy();
  });

  test("Page/Panel.getProgressInfo()", () => {
    const page = new PageModel("q1");
    const panel1 = page.addNewPanel("panel1");
    const panel2 = page.addNewPanel("panel2");
    panel1.isRequired = true;
    panel1.addNewQuestion("text", "q1");
    panel1.addNewQuestion("text", "q2");
    panel2.addNewQuestion("text", "q3").isRequired = true;
    panel2.addNewQuestion("text", "q4");
    panel2.addNewQuestion("html", "q5");
    panel2.addNewQuestion("expression", "q6");
    page.getQuestionByName("q1").value = 1;
    page.getQuestionByName("q3").value = 2;
    expect(page.getProgressInfo()).toEqualValues({
      questionCount: 4,
      answeredQuestionCount: 2,
      requiredQuestionCount: 2,
      requiredAnsweredQuestionCount: 2,
    });
  });
  test("Panel.requiredIf", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text",
          name: "q1",
        },
        {
          type: "panel",
          name: "panel1",
          requiredIf: "{q1} = 1",
          elements: [{ type: "text", name: "q3" }],
        },
      ],
    });
    const panel = <PanelModel>survey.getPanelByName("panel1");
    expect(panel.isRequired, "It is not required by default").toLooseEqual(false);
    survey.setValue("q1", 1);
    expect(panel.isRequired, "q1 is 1").toLooseEqual(true);
    survey.setValue("q1", 2);
    expect(panel.isRequired, "q1 is 2").toLooseEqual(false);
  });

  test("Panel.ensureRowsVisibility", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "panel",
              name: "panel1",
              elements: [
                {
                  type: "text",
                  name: "question1",
                },
                {
                  type: "checkbox",
                  name: "question2",
                  choices: ["item1", "item2", "item3"],
                },
              ],
              state: "collapsed",
            },
          ],
        },
      ],
    };

    let counter = 0;
    let handler = () => counter++;

    const survey = new SurveyModel(json);
    const panel: PanelModel = <PanelModel>survey.getAllPanels()[0];
    const page = survey.currentPage;
    expect(panel.rows.length).toLooseEqual(2);

    panel.rows.forEach((row) => {
      expect(row["_updateVisibility"]).toLooseEqual(undefined);
      expect(row["_scrollableParent"]).toLooseEqual(undefined);
      row["_updateVisibility"] = handler;
    });
    expect(counter).toLooseEqual(0);

    panel.ensureRowsVisibility();
    expect(counter).toLooseEqual(2);
  });

  test("Panel.startLazyRendering isNeedRender=true", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "panel",
              name: "panel1",
              elements: [
                {
                  type: "text",
                  name: "question1",
                },
                {
                  type: "checkbox",
                  name: "question2",
                  choices: ["item1", "item2", "item3"],
                },
              ],
              state: "collapsed",
            },
          ],
        },
      ],
    };

    const prevLazyRowsRenderingStartRow = settings.lazyRowsRenderingStartRow;
    const createdDivs: Array<HTMLElement> = [];
    try {
      settings.lazyRowsRenderingStartRow = 0;
      const survey = new SurveyModel(json);
      survey.lazyRenderEnabled = true;
      const panel: PanelModel = <PanelModel>survey.getAllPanels()[0];
      const page = survey.currentPage;
      expect(panel.rows.length).toLooseEqual(2);

      panel.rows.forEach((row) => {
        expect(row["_scrollableParent"]).toLooseEqual(undefined);
        expect(row["_updateVisibility"]).toLooseEqual(undefined);
        expect(row.isNeedRender).toLooseEqual(false);
        const div = document.createElement("div");
        createdDivs.push(div);
        row.startLazyRendering(div, () => {
          return <any>{ scrollHeight: 200, clientHeight: 300 };
        });
        expect(row["_scrollableParent"]).not.toLooseEqual(undefined);
        expect(row["_updateVisibility"]).toLooseEqual(undefined);
        expect(row.isNeedRender).toLooseEqual(true);

        row.stopLazyRendering();
        expect(row["_scrollableParent"]).toLooseEqual(undefined);
        expect(row["_updateVisibility"]).toLooseEqual(undefined);
        expect(row.isNeedRender).toLooseEqual(true);
      });
    } finally {
      settings.lazyRowsRenderingStartRow = prevLazyRowsRenderingStartRow;
      createdDivs.forEach(div => div?.remove());
    }
  });

  test("Panel.startLazyRendering isNeedRender=false", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "panel",
              name: "panel1",
              elements: [
                {
                  type: "text",
                  name: "question1",
                },
                {
                  type: "checkbox",
                  name: "question2",
                  choices: ["item1", "item2", "item3"],
                },
              ],
              state: "collapsed",
            },
          ],
        },
      ],
    };

    const prevLazyRowsRendering = settings.lazyRowsRendering;
    const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
    settings.lazyRowsRendering = true;
    settings.lazyRowsRenderingStartRow = 0;
    const createdDivs: Array<HTMLElement> = [];
    try {
      const survey = new SurveyModel(json);
      const panel: PanelModel = <PanelModel>survey.getAllPanels()[0];
      const page = survey.currentPage;
      expect(panel.rows.length).toLooseEqual(2);

      panel.rows.forEach((row) => {
        expect(row["_scrollableParent"]).toLooseEqual(undefined);
        expect(row["_updateVisibility"]).toLooseEqual(undefined);
        expect(row.isNeedRender).toLooseEqual(false);
        const div = document.createElement("div");
        createdDivs.push(div);
        row.startLazyRendering(div, () => {
          return <any>{ scrollHeight: 200, clientHeight: 100 };
        });
        expect(row["_scrollableParent"]).not.toLooseEqual(undefined);
        expect(row["_updateVisibility"]).not.toLooseEqual(undefined);
        expect(row.isNeedRender).toLooseEqual(false);

        row.stopLazyRendering();
        expect(row["_scrollableParent"]).toLooseEqual(undefined);
        expect(row["_updateVisibility"]).toLooseEqual(undefined);
        expect(row.isNeedRender).toLooseEqual(false);
      });
    } finally {
      settings.lazyRowsRendering = prevLazyRowsRendering;
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
      createdDivs.forEach(div => div?.remove());
    }
  });
  test("row.isNeedRender & settings.lazyRowsRenderingStartRow", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "text",
              name: "q2",
            },
            {
              type: "text",
              name: "q3",
            },
          ],
        },
      ],
    };

    const prevLazyRowsRendering = settings.lazyRowsRendering;
    const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
    settings.lazyRowsRenderingStartRow = 2;
    try {
      const survey = new SurveyModel(json);
      survey.lazyRenderEnabled = true;
      const page: PageModel = survey.currentPage;
      expect(page.rows.length, "There are 3 rows").toLooseEqual(3);
      expect(page.rows[0].isNeedRender, "isNeedRender rows[0]").toLooseEqual(true);
      expect(page.rows[1].isNeedRender, "isNeedRender rows[1]").toLooseEqual(true);
      expect(page.rows[2].isNeedRender, "isNeedRender rows[2]").toLooseEqual(false);
    } finally {
      settings.lazyRowsRendering = prevLazyRowsRendering;
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  });
  test("row.isNeedRender & settings.lazyRowsRenderingStartRow & designMode", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "text",
              name: "q2",
            },
            {
              type: "text",
              name: "q3",
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              type: "text",
              name: "q4",
            },
          ],
        },
      ],
    };

    const prevLazyRowsRendering = settings.lazyRowsRendering;
    const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
    settings.lazyRowsRenderingStartRow = 2;
    try {
      const survey = new SurveyModel(json);
      survey.lazyRenderEnabled = true;
      survey.setDesignMode(true);
      const page1: PageModel = survey.pages[0];
      expect(page1.rows.length, "There are 3 rows").toLooseEqual(3);
      expect(page1.rows[0].isNeedRender, "isNeedRender rows[0]").toLooseEqual(true);
      expect(page1.rows[1].isNeedRender, "isNeedRender rows[1]").toLooseEqual(true);
      expect(page1.rows[2].isNeedRender, "isNeedRender rows[2]").toLooseEqual(false);

      const page2: PageModel = survey.pages[1];
      page2.onFirstRendering();
      expect(page2.rows.length, "There is one row on the second page").toLooseEqual(1);
      expect(page2.rows[0].isNeedRender, "We do lazy rendering for the second page in design mode").toLooseEqual(false);
    } finally {
      settings.lazyRowsRendering = prevLazyRowsRendering;
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  });
  test("row.visibleElements make it reactive", () => {
    const page = new PageModel();
    page.addNewQuestion("text", "q1");
    page.addNewQuestion("text", "q2");
    page.addNewQuestion("text", "q3");
    page.questions[1].startWithNewLine = false;
    page.questions[2].startWithNewLine = false;
    expect(page.rows.length, "We have one row").toLooseEqual(1);
    const row = page.rows[0];
    expect(row.elements.length, "We have 3 elements in row").toLooseEqual(3);
    expect(row.visibleElements.length, "All elements are visible").toLooseEqual(3);
    expect(row.getPropertyValue("visibleElements").length, "visibleElements are reactive").toLooseEqual(3);
    page.questions[1].visible = false;
    expect(row.visibleElements.length, "Two elements are visible").toLooseEqual(2);
    expect(row.visibleElements[0].name, "First element").toLooseEqual("q1");
    expect(row.visibleElements[1].name, "Second element").toLooseEqual("q3");
    page.removeElement(page.questions[2]);
    expect(row.visibleElements.length, "One element is visible").toLooseEqual(1);
    expect(row.visibleElements[0].name, "First element, #2").toLooseEqual("q1");
    page.questions[1].visible = true;
    expect(row.visibleElements.length, "Two elements are visible, #3").toLooseEqual(2);
    expect(row.visibleElements[0].name, "First element, #3").toLooseEqual("q1");
    expect(row.visibleElements[1].name, "Second element, #3").toLooseEqual("q2");
  });

  test("row.isNeedRender for dynamically added questions", () => {

    const json = {
      "elements": [
        {
          "name": "signature",
          "type": "signaturepad",
          "title": "Sign here"

        }, {
          "name": "name",
          "type": "text",
          "title": "Text",
          "placeHolder": "Jon Snow"

        }, {
          "name": "birthdate",
          "type": "text",
          "inputType": "date",
          "title": "Text Date"

        }, {
          "name": "color",
          "type": "text",
          "inputType": "color",
          "title": "Text Color"
        }, {
          "name": "email",
          "type": "text",
          "inputType": "email",
          "title": "Text Email",
          "placeHolder": "jon.snow@nightwatch.org",

          "validators": [
            {
              "type": "email"
            }
          ]
        }, {
          "type": "dropdown",
          "name": "cars",
          "title": "Dropdown",

          "showNoneItem": true,
          "colCount": 4,
          "choices": [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }, {
          "type": "checkbox",
          "name": "car",
          "title": "Checkbox",

          "showSelectAllItem": true,
          "showNoneItem": true,
          "colCount": 4,
          "choices": [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }, {
          "type": "radiogroup",
          "name": "carss",
          "title": "Radiogroup",

          "colCount": 4,
          "choices": [
            "None",
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }, {
          "type": "image",
          "name": "banner",
          "imageHeight": "300px",
          "imageWidth": "450px",
          "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
        }, {
          "type": "imagepicker",
          "name": "choosepicture",
          "title": "Imagepicker",
          "imageHeight": "150px",
          "imageWidth": "225px",
          "choices": [
            {
              "value": "lion",
              "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
            }, {
              "value": "giraffe",
              "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
            }, {
              "value": "panda",
              "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
            }, {
              "value": "camel",
              "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
            }
          ]
        }, {
          "type": "boolean",
          "name": "bool",
          "title": "Boolean",
          "label": "Are you 21 or older?"

        }, {
          "type": "matrix",
          "name": "Quality",
          "title": "Matrix",
          "columns": [
            {
              "value": 1,
              "text": "Strongly Disagree"
            }, {
              "value": 2,
              "text": "Disagree"
            }, {
              "value": 3,
              "text": "Neutral"
            }, {
              "value": 4,
              "text": "Agree"
            }, {
              "value": 5,
              "text": "Strongly Agree"
            }
          ],
          "rows": [
            {
              "value": "affordable",
              "text": "Product is affordable"
            }, {
              "value": "does what it claims",
              "text": "Product does what it claims"
            }, {
              "value": "better than others",
              "text": "Product is better than other products on the market"
            }, {
              "value": "easy to use",
              "text": "Product is easy to use"
            }
          ]
        }, {
          "type": "matrix",
          "name": "planningPerformance",
          "title": "Matrix Rubric",
          "columns": [
            "Ineffective", "Improvement Necessary", "Effective", "Highly Effective"
          ],
          "rows": [
            {
              "value": "dataToPlan",
              "text": "Utilizes Assessment Data to Plan"
            }, {
              "value": "ambitiousGoals",
              "text": "Ambitious and Measurable Achievement Goal"
            }, {
              "value": "developsStandards",
              "text": "Develops Standards.<br/>Based Unit Plans and Assessments.<br/>Evaluation Values."
            }, {
              "value": "createsObjective",
              "text": "Creates Objective - Driven Lesson Plans and Assessments"
            }
          ],
          "cells": {
            "dataToPlan": {
              "Ineffective": "Teacher rarely or never uses formal and informal assessment data when planning",
              "Improvement Necessary": "Teacher uses formal and informal assessment data to formulate <br/> - Achievement goals, unit plans, or lesson plans, but not all of these",
              "Effective": "Teacher uses formal and informal assessment data to formulate <br/>- Achievement goals, unit plans, and lesson plans",
              "Highly Effective": "Teacher uses formal and informal assessment data to formulate achievement goals, unit plans, and lesson plans<br/>- Incorporates differentiated instructional strategies in planning to reach every student at his/her level of understanding"
            },
            "ambitiousGoals": {
              "Ineffective": "Teacher rarely or never develops achievement goals for the class, or goals are developed but are too general to be helpful for planning purposes",
              "Improvement Necessary": "Teacher develops an annual student achievement goalthat lacks one or more of these traits:<br/>- Measurable<br/>- Aligned to content standards<br/>- Includes benchmarks to help monitor learning and inform interventions throughout the year",
              "Effective": "Teacher develops an annual student achievement goal that<br/>- Is measurable<br/>- Is aligned to content standards<br/>- Includes benchmarks to help monitor learning and inform interventions throughout the year",
              "Highly Effective": "Teacher develops an annual student achievement goal that<br/>- Is measurable<br/>- Is aligned to content standards where applicable<br/>- Includes benchmarks to help monitor learning and informinterventions throughout the year"
            },
            "developsStandards": {
              "Ineffective": "Teacher rarely or never plans by identifying content standards that students will master in each unit, or there is little to no evidence that teacher plans units at all",
              "Improvement Necessary": "Based on achievement goals, teacher plans units but omits one or more of these steps:<br/>- Identifying content standards that students will master in each unit<br/>- Creating assessments before planning units<br/>- Allocating an instructionally appropriate amount of time for each unit",
              "Effective": "Based on achievement goals, teacher plans units by<br/>- Identifying content standards that students will master in each unit<br/>- Creating assessments before each unit begins for backwards planning<br/>- Allocating an instructionally appropriate amount of time for each unit",
              "Highly Effective": "Based on achievement goals, teacher plans units by<br/>- Identifying content standards that students will master in each unit<br/>- Creating assessments before each unit begins for backwards planning<br/>- Allocating an instructionally appropriate amount of time for each unit"
            },
            "createsObjective": {
              "Ineffective": "Teacher rarely or never uses a system to track student assessment/progress data and/or has an ineffective grading system",
              "Improvement Necessary": "Teacher uses a data tracking system to record student assessment / progress data and maintain a grading system but fails in one or more of the following steps<br/>- Use data to analyze student progress toward mastery or to plan future lessons / units<br/>- Have a grading system that appropriately aligns with student learning goals",
              "Effective": "Teacher uses an effective data tracking system for<br/>- Recording student assessment / progress data<br/>- Analyzing student progress towards mastery and planning future lessons/units accordingly<br/>- Maintaining a grading system aligned to student learning goals",
              "Highly Effective": "Teacher uses an effective data tracking system that<br/>- Records student assessment / progress data<br/>- Analyzes student progress toward mastery and plans future lessons/units accordingly<br/>- Maintains a grading system aligned to student learning goals"
            }
          }
        }, {
          "type": "matrix Dropdown",
          "name": "frameworksRate",
          "title": "Matrixdropdown",
          "choices": [
            "Excelent", "Good", "Average", "Fair", "Poor"
          ],
          "columns": [
            {
              "name": "using",
              "title": "Do you use it?",
              "choices": [
                "Yes", "No"
              ],
              "cellType": "radiogroup"
            }, {
              "name": "experience",
              "title": "How long do you use it?",
              "choices": [
                {
                  "value": 5,
                  "text": "3-5 years"
                }, {
                  "value": 2,
                  "text": "1-2 years"
                }, {
                  "value": 1,
                  "text": "less than a year"
                }
              ]
            }, {
              "name": "strength",
              "title": "What is main strength?",
              "choices": [
                "Easy", "Compact", "Fast", "Powerfull"
              ],
              "cellType": "checkbox"
            }, {
              "name": "knowledge",
              "title": "Please describe your experience",
              "cellType": "text"
            }, {
              "name": "rate",
              "title": "Please rate the framework itself"
            }
          ],
          "rows": [
            {
              "value": "angularv1",
              "text": "angularjs v1.x"
            }, {
              "value": "angularv2",
              "text": "angularjs v2"
            }, {
              "value": "knockoutjs"
            }, {
              "value": "reactjs"
            }
          ]
        }, {
          "type": "matrixdynamic",
          "name": "teachersRate",
          "title": "Matrix Dynamic",
          "addRowText": "Add Subject",
          "horizontalScroll": true,
          "columnMinWidth": "130px",
          "columnColCount": 1,
          "cellType": "radiogroup",
          "choices": [
            {
              "value": 1,
              "text": "Yes"
            }, {
              "value": 0,
              "text": "Sometimes"
            }, {
              "value": -1,
              "text": "No"
            }
          ],
          "columns": [
            {
              "name": "subject",
              "cellType": "dropdown",
              "title": "Select a subject",

              "minWidth": "300px",
              "choices": [
                "English: American Literature",
                "English: British and World Literature",
                "Math: Consumer Math",
                "Math: Practical Math",
                "Math: Developmental Algebra",

                "World Languages: Japanese"
              ]
            }, {
              "name": "selfthinking",
              "title": "Encourages me to think for myself"
            }, {
              "name": "frusturation",
              "cellType": "comment",
              "title": "Is there anything about this class that frustrates you?",
              "minWidth": "250px"
            }, {
              "name": "likeTheBest",
              "cellType": "comment",
              "title": "What do you like best about this class and/or teacher?",
              "minWidth": "250px"
            }, {
              "name": "improvements",
              "cellType": "comment",
              "title": "What do you wish this teacher would do differently that would improve this class?",
              "minWidth": "250px"
            }
          ],
          "rowCount": 2
        }, {
          "type": "matrixdynamic",
          "name": "Current Level of Function",
          "title": "Matrix Dynamic (vertical columns)",
          "transposeData": true,
          "maxRowCount": 5,
          "columns": [
            {
              "name": "Date",
              "title": "Date",
              "cellType": "text",
              "inputType": "date"
            }, {
              "name": "AmbDistance",
              "title": "Amb Distance",
              "cellType": "text"
            }, {
              "name": "Amb Assistance",
              "cellType": "dropdown",
              "choices": ["D", "MAX", "MOD", "MIN"]
            }, {
              "name": "Standing Tolerance",
              "cellType": "text"
            }, {
              "name": "UE Strength",
              "cellType": "text"
            }, {
              "name": "Cognitive Function",
              "cellType": "comment"
            }
          ],
          "choices": [1],
          "cellType": "comment",
          "confirmDelete": true,
          "addRowText": "Add Date +",
          "removeRowText": "Remove"
        }, {
          "type": "matrixdynamic",
          "name": "orderList",
          "rowCount": 1,
          "minRowCount": 1,
          "title": "Matrix Dynamic (totals)",
          "addRowText": "Add new item",
          "columns": [
            {
              "name": "id",
              "title": "Id",
              "cellType": "expression",
              "expression": "{rowIndex}"
            }, {
              "name": "phone_model",
              "title": "Phone model",

              "totalType": "count",
              "totalFormat": "Items count: {0}",
              "choices": [1, 2, 3]
            }, {
              "name": "price",
              "title": "Price",
              "cellType": "expression",
              "expression": "getItemPrice('phone_model')",
              "displayStyle": "currency"
            }, {
              "name": "quantity",
              "title": "Quantity",

              "cellType": "text",
              "inputType": "number",
              "totalType": "sum",
              "totalFormat": "Total phones: {0}",
              "validators": [
                {
                  "type": "numeric",
                  "minValue": 1,
                  "maxValue": 100
                }
              ]
            }, {
              "name": "total",
              "title": "Total",
              "cellType": "expression",
              "expression": "{row.quantity} * {row.price}",
              "displayStyle": "currency",
              "totalType": "sum",
              "totalDisplayStyle": "currency",
              "totalFormat": "Total: {0}"
            }
          ]
        }, {
          "name": "vatProcents",
          "type": "text",
          "title": "VAT (in %)",
          "defaultValue": 20,
          "inputType": "number",
          "validators": [
            {
              "type": "numeric",
              "minValue": 0,
              "maxValue": 40
            }
          ]
        }, {
          "name": "vatTotal",
          "type": "expression",
          "title": "VAT",
          "expression": "{orderList-total.total} * {vatProcents} / 100",
          "displayStyle": "currency",
          "startWithNewLine": false
        }, {
          "name": "total",
          "type": "expression",
          "title": "Total",
          "expression": "{orderList-total.total} + {vatTotal}",
          "displayStyle": "currency",
          "startWithNewLine": false
        }, {
          "type": "multipletext",
          "name": "pricelimit",
          "title": "Multipletext",
          "colCount": 2,
          "items": [
            {
              "name": "mostamount",
              "title": "Most amount you would every pay for a product like ours"
            }, {
              "name": "leastamount",
              "title": "The least amount you would feel comfortable paying"
            }
          ]
        }, {
          "type": "rating",
          "name": "satisfaction",
          "title": "Rating",
          "minRateDescription": "Not Satisfied",
          "maxRateDescription": "Completely satisfied"
        }, {
          "type": "comment",
          "name": "suggestions",
          "title": "Comment"
        }, {
          "type": "file",
          "title": "File",
          "name": "image",
          "storeDataAsText": false,
          "showPreview": true,
          "imageWidth": 150,
          "maxSize": 102400
        }
      ]
    };
    const prevLazyRowsRendering = settings.lazyRowsRendering;
    const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
    settings.lazyRowsRendering = true;
    settings.lazyRowsRenderingStartRow = 2;
    try {
      const survey = new SurveyModel(json);
      const page1: PageModel = survey.pages[0];

      expect(page1.rows.length, "There are 21 rows").toLooseEqual(21);
      expect(page1.rows[0].isNeedRender, "isNeedRender rows[0]").toLooseEqual(true);
      expect(page1.rows[1].isNeedRender, "isNeedRender rows[1]").toLooseEqual(true);
      expect(page1.rows[2].isNeedRender, "isNeedRender rows[2]").toLooseEqual(false);
      expect(page1.rows[3].isNeedRender, "isNeedRender rows[3]").toLooseEqual(false);
      expect(page1.rows[20].isNeedRender, "isNeedRender rows[20]").toLooseEqual(false);

      page1.addNewQuestion("text", "qN");
      expect(page1.rows.length, "There are 22 rows").toLooseEqual(22);
      expect(page1.rows[21].isNeedRender, "isNeedRender rows[21]").toLooseEqual(false);

      survey["_isDesignMode"] = true;

      page1.addNewQuestion("text", "qN2");
      expect(page1.rows.length, "There are 23 rows").toLooseEqual(23);
      expect(page1.rows[22].isNeedRender, "isNeedRender rows[22] for creator v2").toLooseEqual(true);
    } finally {
      settings.lazyRowsRendering = prevLazyRowsRendering;
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  });

  test("row.isNeedRender for question invisible -> visible", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "text",
              name: "q2",
            },
            {
              type: "text",
              name: "q3",
              visibleIf: "{q1} == 'a'"
            },
          ],
        }
      ],
    };

    const prevLazyRowsRendering = settings.lazyRowsRendering;
    const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
    settings.lazyRowsRenderingStartRow = 2;
    try {
      const survey = new SurveyModel(json);
      survey.lazyRenderEnabled = true;
      const page1: PageModel = survey.pages[0];
      expect(page1.rows.length, "There are 3 rows").toLooseEqual(3);
      expect(page1.rows[0].isNeedRender, "isNeedRender rows[0]").toLooseEqual(true);
      expect(page1.rows[1].isNeedRender, "isNeedRender rows[1]").toLooseEqual(true);
      expect(page1.rows[2].isNeedRender, "isNeedRender rows[2]").toLooseEqual(false);

      survey.data = { q1: "a" };

      expect(page1.rows[2].isNeedRender, "isNeedRender rows[2]").toLooseEqual(true);

    } finally {
      settings.lazyRowsRendering = prevLazyRowsRendering;
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  });
  test("Panel.actions", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "panel",
          name: "panel1",
          elements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    const panel = <PanelModel>survey.getPanelByName("panel1");
    panel.footerActions.push({ id: "test" });
    expect(panel.getFooterToolbar().actions.length).toLooseEqual(1);
    expect(panel.getFooterToolbar().actions[0].id).toLooseEqual("test");
  });
  test("Footer toolbar type", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "panel",
          name: "panel1",
          allowAdaptiveActions: false,
          elements: [{ type: "text", name: "q1" }],
        },
      ],
    });
    const panel = <PanelModel>survey.getPanelByName("panel1");
    expect(panel.getFooterToolbar() instanceof ActionContainer).toBeTruthy();
    panel.allowAdaptiveActions = true;
    panel["footerToolbarValue"] = null;
    expect(panel.getFooterToolbar() instanceof AdaptiveActionContainer).toBeTruthy();
  });
  test("Check needResponsiveWidth method", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "panel",
          name: "panel1",
          elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
        },
      ],
    });
    const panel = <PanelModel>survey.getPanelByName("panel1");
    expect(panel.needResponsiveWidth()).toBeFalsy();
    panel.startWithNewLine = false;
    expect(panel.needResponsiveWidth()).toBeTruthy();
    panel.startWithNewLine = true;
    panel.elements[1].startWithNewLine = false;
    expect(panel.needResponsiveWidth()).toBeTruthy();
  });
  test("Delete a first question in the row", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3", startWithNewLine: false },
      ],
    });
    const page = <PageModel>survey.currentPage;
    expect(page.rows.length, "There are two rows").toLooseEqual(2);
    expect(page.rows[1].elements.length, "There are two elements in the second row").toLooseEqual(2);
    const q2 = <IElement>survey.getQuestionByName("q2");
    const q3 = <IElement>survey.getQuestionByName("q3");
    expect(q3.startWithNewLine, "q3 startWithNewLine is false").toLooseEqual(false);
    q2.delete();
    expect(page.rows.length, "Still two rows").toLooseEqual(2);
    expect(q3.startWithNewLine, "q3 startWithNewLine is true").toLooseEqual(true);
  });
  test("page.cssRoot check for existings cssStyle.page", () => {
    const survey = new SurveyModel();
    const prevPage = survey.css.page;
    delete survey.css.page;
    const page = new PageModel();
    expect(page.cssRoot).toLooseEqual("");
    expect(page.cssTitle).toLooseEqual("");
    survey.css.page = prevPage;
  });
  test("Check panel footer actions event", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "panel",
          name: "panel",
          elements: [
            {
              type: "text",
            }
          ]
        }
      ]
    });
    const panel = <PanelModel>survey.getPanelByName("panel");
    survey.onGetPanelFooterActions.add((sender, opt) => {
      expect(sender).toLooseEqual(survey);
      expect(opt.panel).toLooseEqual(panel);
      expect(opt.question).toLooseEqual(undefined);
      opt.actions.push({
        id: "test",
        title: "test",
        action: () => { }
      });
    });
    expect(panel.footerActions.length).toLooseEqual(0);
    expect(panel["footerToolbarValue"]).toLooseEqual(undefined);

    //panel actions should be created only after footerToolbar is requested

    const actions = panel.getFooterToolbar().actions;

    expect(actions.length).toLooseEqual(1);
    expect(actions[0].title).toLooseEqual("test");
  });
  test("Expand panel on error in multiple text question", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text", name: "q1",
        },
        {
          type: "panel",
          name: "panel",
          title: "title",
          state: "collapsed",
          elements: [
            {
              "type": "multipletext",
              "name": "q2",
              "items": [{ "name": "item1", "isRequired": true }]
            }
          ]
        }
      ]
    });
    const panel = <PanelModel>survey.getPanelByName("panel");
    expect(panel.state, "the panel is collapsed by default").toLooseEqual("collapsed");
    survey.tryComplete();
    expect(panel.state, "the panel is expanded").toLooseEqual("expanded");
  });

  test("Check panel styles with originalPage", () => {
    const survey = new SurveyModel({
      questionsOnPageMode: "singlePage",
      pages: [
        {
          name: "panel",
          title: "title",
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "panel",
              name: "innerPanel",
              elements: [
                {
                  type: "text",
                  name: "q2",
                }
              ]
            }
          ]
        }
      ]
    });
    survey.css = {
      root: "sd-root-modern",
      pageRow: "page_row"
    };
    const panel = <PanelModel>survey.getPageByName("panel");
    const innerPanel = <PanelModel>survey.getPanelByName("innerPanel");
    const question = survey.getQuestionByName("q1");
    const question2 = survey.getQuestionByName("q2");
    //check panels styles

    expect(panel["getIsNested"]()).toBeFalsy();
    expect(panel["getHasFrameV2"]()).toBeFalsy();

    expect(innerPanel["getIsNested"]()).toBeFalsy();
    expect(innerPanel["getHasFrameV2"]()).toBeTruthy();

    expect(panel.rows[0].getRowCss().includes("page_row")).toBeTruthy();
    expect(innerPanel.rows[0].getRowCss().includes("page_row")).toBeFalsy();

    // //check questions styles

    expect(question["getIsNested"]()).toBeFalsy();
    expect(question["getHasFrameV2"]()).toBeTruthy();

    expect(question2["getIsNested"]()).toBeTruthy();
    expect(question2["getHasFrameV2"]()).toBeFalsy();
    survey.css = {};
  });

  test.skip("Check panel styles with originalPage and showPreview", () => {
    const survey = new SurveyModel({
      pages: [
        {
          name: "panel",
          title: "title",
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "panel",
              name: "innerPanel",
              elements: [
                {
                  type: "text",
                  name: "q2",
                }
              ]
            }
          ]
        }
      ]
    });
    survey.css = {
      root: "sd-root-modern",
      pageRow: "page_row"
    };
    survey.showPreview();
    const panel = <PanelModel>survey.getPanelByName("panel");
    const innerPanel = <PanelModel>survey.getPanelByName("innerPanel");
    const question = survey.getQuestionByName("q1");
    const question2 = survey.getQuestionByName("q2");
    //check panels styles

    expect(panel["getIsNested"]()).toBeFalsy();
    expect(panel["getHasFrameV2"]()).toBeTruthy();

    expect(innerPanel["getIsNested"]()).toBeTruthy();
    expect(innerPanel["getHasFrameV2"]()).toBeFalsy();

    expect(panel.rows[0].getRowCss().includes("page_row")).toBeFalsy();
    expect(innerPanel.rows[0].getRowCss().includes("page_row")).toBeFalsy();

    // // //check questions styles

    expect(question["getIsNested"]()).toBeTruthy();
    expect(question["getHasFrameV2"]()).toBeFalsy();

    expect(question2["getIsNested"]()).toBeTruthy();
    expect(question2["getHasFrameV2"]()).toBeFalsy();
    survey.css = {};
  });
  test("Render name for collapsed/expanded questions in design-time", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        {
          type: "panel",
          name: "panel",
          state: "collapsed",
          elements: [
            {
              "type": "text",
              "name": "q2"
            }
          ]
        }
      ]
    });
    const panel = <PanelModel>survey.getPanelByName("panel");
    expect(panel.state, "the panel is collapsed").toLooseEqual("collapsed");
    expect(panel.hasTitle, "We are in design mode and state is not default, #1").toLooseEqual(true);
    expect(panel.locTitle.renderedHtml, "Render name, #1").toLooseEqual("panel");
    panel.expand();
    expect(panel.state, "the panel is expanded").toLooseEqual("expanded");
    expect(panel.hasTitle, "We are in design mode and state is not default, #2").toLooseEqual(true);
    expect(panel.locTitle.renderedHtml, "Render name, #2").toLooseEqual("panel");
    panel.state = "default";
    expect(panel.state, "the panel is not collapsed or expanded").toLooseEqual("default");
    expect(panel.hasTitle, "We do not render the title").toLooseEqual(false);
    expect(panel.locTitle.renderedHtml, "Render title is empty, #3").toBeFalsy();
  });

  test("Check updateRowsOnElementAdded: insert on empty page", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1"
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    const question = new QuestionTextModel("q1");
    page.addElement(question, 0);
    expect(page.rows.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements[0].name).toLooseEqual("q1");

  });
  test("Check updateRowsOnElementAdded: insert into page with latest index and swnl: false", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1"
            }
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    const question = new QuestionTextModel("q2");
    question.startWithNewLine = false;
    page.addElement(question, 1);
    expect(page.rows.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements.length).toLooseEqual(2);
    expect(page.rows[0].visibleElements[0].name).toLooseEqual("q1");
    expect(page.rows[0].visibleElements[1].name).toLooseEqual("q2");
  });
  test("Check updateRowsOnElementAdded: insert into page with latest index and swnl: true", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1"
            }
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    const question = new QuestionTextModel("q2");
    question.startWithNewLine = true;
    page.addElement(question, 1);
    expect(page.rows.length).toLooseEqual(2);
    expect(page.rows[0].visibleElements.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements[0].name).toLooseEqual("q1");
    expect(page.rows[1].visibleElements.length).toLooseEqual(1);
    expect(page.rows[1].visibleElements[0].name).toLooseEqual("q2");
  });
  test("Check updateRowsOnElementAdded: insert into page with zero index and swnl: false for next element", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              name: "q1",
              type: "text",
              startWithNewLine: false
            }
          ]
        }
      ]
    };
    let survey = new SurveyModel();
    survey.fromJSON(json);
    let page = <PageModel>survey.getPageByName("page1");
    let question = new QuestionTextModel("q2");
    page.addElement(question, 0);
    expect(page.rows.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements.length).toLooseEqual(2);
    expect(page.rows[0].visibleElements[0].name).toLooseEqual("q2");
    expect(page.rows[0].visibleElements[1].name).toLooseEqual("q1");

    survey = new SurveyModel();
    survey.fromJSON(json);
    page = <PageModel>survey.getPageByName("page1");
    question = new QuestionTextModel("q2");
    question.startWithNewLine = false;
    page.addElement(question, 0);
    expect(page.rows.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements.length).toLooseEqual(2);
    expect(page.rows[0].visibleElements[0].name).toLooseEqual("q2");
    expect(page.rows[0].visibleElements[1].name).toLooseEqual("q1");
  });
  test("Check updateRowsOnElementAdded: insert into page with zero index and swnl: true for next element", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              name: "q1",
              type: "text",
              startWithNewLine: true
            }
          ]
        }
      ]
    };
    let survey = new SurveyModel();
    survey.fromJSON(json);
    let page = <PageModel>survey.getPageByName("page1");
    let question = new QuestionTextModel("q2");
    page.addElement(question, 0);
    expect(page.rows.length).toLooseEqual(2);
    expect(page.rows[0].visibleElements.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements[0].name).toLooseEqual("q2");
    expect(page.rows[1].visibleElements.length).toLooseEqual(1);
    expect(page.rows[1].visibleElements[0].name).toLooseEqual("q1");

    survey = new SurveyModel();
    survey.fromJSON(json);
    page = <PageModel>survey.getPageByName("page1");
    question = new QuestionTextModel("q2");
    question.startWithNewLine = false;
    page.addElement(question, 0);
    expect(page.rows[0].visibleElements.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements[0].name).toLooseEqual("q2");
    expect(page.rows[1].visibleElements.length).toLooseEqual(1);
    expect(page.rows[1].visibleElements[0].name).toLooseEqual("q1");
  });
  test("Check updateRowsOnElementAdded method: insert between elements in one row with swnl: false", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
            { type: "text", name: "q3", startWithNewLine: false },
            { type: "text", name: "q4", startWithNewLine: false },
            { type: "text", name: "q5" }
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);

    let question = new QuestionTextModel("q6");
    question.startWithNewLine = false;
    page.addElement(question, 2);
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q6", "q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);

    question = new QuestionTextModel("q7");
    question.startWithNewLine = false;
    page.addElement(question, 4);
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q6", "q3", "q7", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);
  });
  test("Check updateRowsOnElementAdded method: insert between elements in one row with swnl: true", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
            { type: "text", name: "q3", startWithNewLine: false },
            { type: "text", name: "q4", startWithNewLine: false },
            { type: "text", name: "q5" }
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);

    let question = new QuestionTextModel("q6");
    question.startWithNewLine = true;
    page.addElement(question, 2);
    expect(page.rows.length).toLooseEqual(4);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q6", "q3", "q4"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q5"]);

    question = new QuestionTextModel("q7");
    question.startWithNewLine = true;
    page.addElement(question, 4);
    expect(page.rows.length).toLooseEqual(5);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q6", "q3"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q7", "q4"]);
    expect(page.rows[4].visibleElements.map(q => q.name)).toEqualValues(["q5"]);
  });
  test("Check updateRowsOnElementAdded method: insert between rows with swnl: false", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2", startWithNewLine: false },
            { type: "text", name: "q3", },
            { type: "text", name: "q4", startWithNewLine: false },
            { type: "text", name: "q5" }
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);

    let question = new QuestionTextModel("q6");
    question.startWithNewLine = false;
    page.addElement(question, 2);
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2", "q6"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);

    question = new QuestionTextModel("q7");
    question.startWithNewLine = false;
    page.addElement(question, 5);
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2", "q6"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4", "q7"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);
  });
  test("Check updateRowsOnElementAdded method: insert between rows with swnl: true", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2", startWithNewLine: false },
            { type: "text", name: "q3", },
            { type: "text", name: "q4", startWithNewLine: false },
            { type: "text", name: "q5" }
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);

    let question = new QuestionTextModel("q6");
    question.startWithNewLine = true;
    page.addElement(question, 2);
    expect(page.rows.length).toLooseEqual(4);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q6"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q5"]);

    question = new QuestionTextModel("q7");
    question.startWithNewLine = true;
    page.addElement(question, 5);
    expect(page.rows.length).toLooseEqual(5);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q6"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q7"]);
    expect(page.rows[4].visibleElements.map(q => q.name)).toEqualValues(["q5"]);
  });
  test("Check swnl changed: change swnl for first element on page", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2", startWithNewLine: false },
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    const question = survey.getQuestionByName("q1");

    expect(page.rows.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);

    question.startWithNewLine = false;
    expect(page.rows.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);

    question.startWithNewLine = true;
    expect(page.rows.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
  });
  test("Check swnl changed: change swnl for first element in row", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
            { type: "text", name: "q3", startWithNewLine: false },
            { type: "text", name: "q4", startWithNewLine: false },
            { type: "text", name: "q5" },
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    const question = survey.getQuestionByName("q2");

    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);

    question.startWithNewLine = false;
    expect(page.rows.length).toLooseEqual(2);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2", "q3", "q4"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q5"]);
  });

  test("Check swnl changed: change swnl for last element in row", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
            { type: "text", name: "q3", startWithNewLine: false },
            { type: "text", name: "q4", startWithNewLine: false },
            { type: "text", name: "q5" },
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    const question = survey.getQuestionByName("q4");

    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);

    question.startWithNewLine = true;
    expect(page.rows.length).toLooseEqual(4);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q3"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q4"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q5"]);
  });

  test("Check swnl changed: change swnl for middle element in row", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
            { type: "text", name: "q3", startWithNewLine: false },
            { type: "text", name: "q4", startWithNewLine: false },
            { type: "text", name: "q5", startWithNewLine: false },
            { type: "text", name: "q6", startWithNewLine: false },
            { type: "text", name: "q7" },
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    const question = survey.getQuestionByName("q4");

    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q3", "q4", "q5", "q6"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q7"]);

    question.startWithNewLine = true;
    expect(page.rows.length).toLooseEqual(4);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q3"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q4", "q5", "q6"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q7"]);
  });

  test("Check swnl changed: change swnl for single element in row", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
            { type: "text", name: "q3", startWithNewLine: false },
            { type: "text", name: "q4", startWithNewLine: false },
            { type: "text", name: "q5" },
            { type: "text", name: "q6" },
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    const question = survey.getQuestionByName("q5");

    expect(page.rows.length).toLooseEqual(4);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q6"]);

    question.startWithNewLine = false;
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q2", "q3", "q4", "q5"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q6"]);
  });

  test("Check insert function: insert in empty page", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    expect(page.rows.length).toLooseEqual(0);
    page.insertElement(new QuestionTextModel("q1"));
    expect(page.rows.length).toLooseEqual(1);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1"]);
  });

  test("Check insert function: insert before first element in row", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "text",
              name: "q2",
              startWithNewLine: false
            },
            {
              type: "text",
              name: "q3",
            },
            {
              type: "text",
              name: "q4",
              startWithNewLine: false
            },
            {
              type: "text",
              name: "q5",
            },
            {
              type: "text",
              name: "q6",
              startWithNewLine: false
            },
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    let calledBuildRows = 0;
    page["onRowsChanged"] = () => {
      calledBuildRows++;
    };
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    page.insertElement(new QuestionTextModel("q7"), survey.getQuestionByName("q3"), "left");
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q7", "q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    expect(calledBuildRows).toLooseEqual(0);
  });
  test("Check insert function: insert after last element in row", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "text",
              name: "q2",
              startWithNewLine: false
            },
            {
              type: "text",
              name: "q3",
            },
            {
              type: "text",
              name: "q4",
              startWithNewLine: false
            },
            {
              type: "text",
              name: "q5",
            },
            {
              type: "text",
              name: "q6",
              startWithNewLine: false
            },
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");
    let calledBuildRows = 0;
    page["onRowsChanged"] = () => {
      calledBuildRows++;
    };
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    page.insertElement(new QuestionTextModel("q7"), survey.getQuestionByName("q4"), "right");
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4", "q7"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    expect(calledBuildRows).toLooseEqual(0);
  });

  test("Check insert function: insert between elements in row", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "text",
              name: "q2",
              startWithNewLine: false
            },
            {
              type: "text",
              name: "q3",
            },
            {
              type: "text",
              name: "q4",
              startWithNewLine: false
            },
            {
              type: "text",
              name: "q5",
            },
            {
              type: "text",
              name: "q6",
              startWithNewLine: false
            },
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");

    let calledBuildRows = 0;
    page["onRowsChanged"] = () => {
      calledBuildRows++;
    };

    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    page.insertElement(new QuestionTextModel("q7"), survey.getQuestionByName("q3"), "right");
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q7", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    page.insertElement(new QuestionTextModel("q8"), survey.getQuestionByName("q7"), "left");
    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q8", "q7", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    expect(calledBuildRows).toLooseEqual(0);

  });

  test("Check insert function: insert between rows", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "text",
              name: "q1",
            },
            {
              type: "text",
              name: "q2",
              startWithNewLine: false
            },
            {
              type: "text",
              name: "q3",
            },
            {
              type: "text",
              name: "q4",
              startWithNewLine: false
            },
            {
              type: "text",
              name: "q5",
            },
            {
              type: "text",
              name: "q6",
              startWithNewLine: false
            },
          ]
        }
      ]
    });
    const page = <PageModel>survey.getPageByName("page1");

    let calledBuildRows = 0;
    page["onRowsChanged"] = () => {
      calledBuildRows++;
    };

    expect(page.rows.length).toLooseEqual(3);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    page.insertElement(new QuestionTextModel("q7"), survey.getQuestionByName("q4"), "bottom");
    expect(page.rows.length).toLooseEqual(4);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q7"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    page.insertElement(new QuestionTextModel("q8"), survey.getQuestionByName("q3"), "top");
    expect(page.rows.length).toLooseEqual(5);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q8"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q7"]);
    expect(page.rows[4].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    page.insertElement(new QuestionTextModel("q9"), survey.getQuestionByName("q4"), "top");
    expect(page.rows.length).toLooseEqual(6);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q8"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q9"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[4].visibleElements.map(q => q.name)).toEqualValues(["q7"]);
    expect(page.rows[5].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    page.insertElement(new QuestionTextModel("q10"), survey.getQuestionByName("q3"), "bottom");
    expect(page.rows.length).toLooseEqual(7);
    expect(page.rows[0].visibleElements.map(q => q.name)).toEqualValues(["q1", "q2"]);
    expect(page.rows[1].visibleElements.map(q => q.name)).toEqualValues(["q8"]);
    expect(page.rows[2].visibleElements.map(q => q.name)).toEqualValues(["q9"]);
    expect(page.rows[3].visibleElements.map(q => q.name)).toEqualValues(["q3", "q4"]);
    expect(page.rows[4].visibleElements.map(q => q.name)).toEqualValues(["q10"]);
    expect(page.rows[5].visibleElements.map(q => q.name)).toEqualValues(["q7"]);
    expect(page.rows[6].visibleElements.map(q => q.name)).toEqualValues(["q5", "q6"]);

    expect(calledBuildRows).toLooseEqual(0);
  });
  test("Do not expand panels on validation that doesn't have an error Bug#8341", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "text",
          "name": "question1",
          "isRequired": true
        },
        {
          "type": "panel",
          "name": "panel1",
          "elements": [
            {
              "type": "text",
              "name": "question2"
            }
          ],
          "title": "Title",
          "state": "collapsed"
        },
        {
          "type": "panel",
          "name": "panel2",
          "elements": [
            {
              "type": "text",
              "name": "question3",
              "isRequired": true
            }
          ],
          "title": "Title",
          "state": "collapsed"
        },
        {
          "type": "panel",
          "name": "panel3",
          "elements": [
            {
              "type": "panel",
              "name": "panel4",
              "elements": [
                {
                  "type": "text",
                  "name": "question4",
                  "isRequired": true
                }
              ],
              "title": "Title",
              "state": "collapsed"
            }
          ],
          "title": "Title",
          "state": "collapsed"
        },
        {
          "type": "panel",
          "name": "panel5",
          "isRequired": true,
          "elements": [
            {
              "type": "text",
              "name": "question2"
            }
          ],
          "title": "Title",
          "state": "collapsed"
        },
      ]
    });
    survey.validate(true, true);
    const panels = survey.getAllPanels();
    expect(panels[0].isCollapsed, "The panel should rename collapsed").toLooseEqual(true);
    expect(panels[1].isExpanded, "The panel should be expanded, it has error inside, #1").toLooseEqual(true);
    expect(panels[2].isExpanded, "The panel should be expanded, it has error inside, #2").toLooseEqual(true);
    expect(panels[3].isExpanded, "The panel should be expanded, it has error inside, #3").toLooseEqual(true);
    expect(panels[4].isExpanded, "The panel should be expanded, panel is required, #4").toLooseEqual(true);
  });
  test("Check if errors disappered in the closest questions on changing the question, checkErrorsMode: 'onValueChanged', Bug#8539", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [
        {
          type: "text", name: "q1",
          validators: [{ type: "expression", expression: "{q1} + {q2} <= 10" }]
        },
        { type: "text", name: "q3" },
        {
          type: "text", name: "q2",
          validators: [{ type: "expression", expression: "{q1} + {q2} <= 10" }]
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q1.value = 5;
    q2.value = 6;
    expect(q1.errors.length, "q1.errors #1").toLooseEqual(0);
    expect(q2.errors.length, "q2.errors #1").toLooseEqual(1);
    q1.value = 3;
    expect(q1.errors.length, "q1.errors #2").toLooseEqual(0);
    expect(q2.errors.length, "q2.errors #2").toLooseEqual(0);
    q1.value = 7;
    expect(q1.errors.length, "q1.errors #3").toLooseEqual(1);
    expect(q2.errors.length, "q2.errors #3").toLooseEqual(0);
    q2.value = 2;
    expect(q1.errors.length, "q1.errors #4").toLooseEqual(0);
    expect(q2.errors.length, "q2.errors #4").toLooseEqual(0);
  });
  test("Check if errors disappered in the closest questions on changing the question, Bug#8539", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "text", name: "q1",
          validators: [{ type: "expression", expression: "{q1} + {q2} <= 10" }]
        },
        { type: "text", name: "q3" },
        {
          type: "text", name: "q2",
          validators: [{ type: "expression", expression: "{q1} + {q2} <= 10" }]
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    q1.value = 5;
    q2.value = 6;
    expect(q1.errors.length, "q1.errors #1").toLooseEqual(0);
    expect(q2.errors.length, "q2.errors #1").toLooseEqual(0);
    expect(survey.tryComplete(), "Could not complete").toLooseEqual(false);
    expect(q1.errors.length, "q1.errors #2").toLooseEqual(1);
    expect(q2.errors.length, "q2.errors #2").toLooseEqual(1);
    q1.value = 1;
    expect(q1.errors.length, "q1.errors #3").toLooseEqual(0);
    expect(q2.errors.length, "q2.errors #3").toLooseEqual(0);
  });

  test("Panel hasTextInTitle - reactive property #8816", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "panel", name: "panel1" },
        { type: "panel", name: "panel2", title: "Panel 2" }
      ]
    });
    const panel1 = survey.getPanelByName("panel1");
    const panel2 = survey.getPanelByName("panel2");
    expect(panel1.hasTextInTitle, "panel1 #1, hasTextInTitle").toLooseEqual(false);
    expect(panel1.hasTitle, "panel1 #1, hasTitle").toLooseEqual(false);

    expect(panel2.hasTextInTitle, "panel2 #1, hasTextInTitle").toLooseEqual(true);
    expect(panel2.hasTextInTitle, "panel2 #1, hasTitle").toLooseEqual(true);

    panel1.title = "Panel 1";
    expect(panel1.hasTextInTitle, "panel1 #2, hasTextInTitle").toLooseEqual(true);
    expect(panel1.hasTitle, "panel1 #2, hasTitle").toLooseEqual(true);

    panel2.title = "";
    expect(panel2.hasTextInTitle, "panel2 #2, hasTextInTitle").toLooseEqual(false);
    expect(panel2.hasTitle, "panel2 #2, hasTitle").toLooseEqual(false);
  });

  test("row.isNeedRender for panels", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [
                {
                  type: "text",
                  name: "q1",
                },
                {
                  type: "text",
                  name: "q2",
                },

              ]
            },
            {
              type: "text",
              name: "q3",
            },
          ],
        }
      ],
    };

    const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
    settings.lazyRowsRenderingStartRow = 0;
    try {
      const survey = new SurveyModel(json);
      survey.lazyRenderEnabled = true;
      const page1: PageModel = survey.pages[0];
      expect(page1.rows.length, "There are 2 rows").toLooseEqual(2);
      expect(page1.rows[0].isNeedRender, "isNeedRender page1 rows[0]").toLooseEqual(true);
      expect(page1.rows[1].isNeedRender, "isNeedRender page1 rows[1]").toLooseEqual(false);

      const panel1 = survey.pages[0].elements[0] as PanelModel;
      expect(panel1.rows.length, "There are 2 rows in panel1").toLooseEqual(2);
      expect(panel1.rows[0].isNeedRender, "isNeedRender panel1 rows[0]").toLooseEqual(false);
      expect(panel1.rows[1].isNeedRender, "isNeedRender panel1 rows[1]").toLooseEqual(false);
    } finally {
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  });
  test("getAllRows for page", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [
                {
                  type: "text",
                  name: "q1",
                },
                {
                  type: "text",
                  name: "q2",
                },

              ]
            },
            {
              type: "text",
              name: "q3",
            },
          ],
        }
      ],
    };

    const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
    settings.lazyRowsRenderingStartRow = 0;
    try {
      const survey = new SurveyModel(json);
      survey.lazyRenderEnabled = true;
      const page1: PageModel = survey.pages[0];
      const allPageRows = page1.getAllRows();

      expect(allPageRows.length, "There are 4 rows").toLooseEqual(4);
      expect(allPageRows[0].elements[0].name).toLooseEqual("panel1");
      expect(allPageRows[1].elements[0].name).toLooseEqual("q1");
      expect(allPageRows[2].elements[0].name).toLooseEqual("q2");
      expect(allPageRows[3].elements[0].name).toLooseEqual("q3");
    } finally {
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  });
  test("forceRenderRows for page", async () => {
    return new Promise(function(resolve) {
      let __remaining = 1;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const done = __done;
      const json = {
        pages: [
          {
            name: "page1",
            elements: [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    type: "text",
                    name: "q1",
                  },
                  {
                    type: "text",
                    name: "q2",
                  },

                ]
              },
              {
                type: "text",
                name: "q3",
              },
            ],
          }
        ],
      };

      const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
      settings.lazyRowsRenderingStartRow = 0;
      try {
        const survey = new SurveyModel(json);
        survey.lazyRenderEnabled = true;
        survey.getAllQuestions().forEach(q => {
          q.supportOnElementRerenderedEvent = true;
          q.onElementRerenderedEventEnabled = true;
        });
        const page1: PageModel = survey.pages[0];
        const allPageRows = page1.getAllRows();
        expect(allPageRows[0].isNeedRender, "isNeedRender for panel").toLooseEqual(true);
        expect(allPageRows[1].isNeedRender, "isNeedRender for q1").toLooseEqual(false);
        expect(allPageRows[2].isNeedRender, "isNeedRender for q2").toLooseEqual(false);
        expect(allPageRows[3].isNeedRender, "isNeedRender for q3").toLooseEqual(false);

        page1.forceRenderRows([allPageRows[2], allPageRows[3]], () => {
          settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
          expect(allPageRows[0].isNeedRender, "isNeedRender for panel").toLooseEqual(true);
          expect(allPageRows[1].isNeedRender, "isNeedRender for q1").toLooseEqual(false);
          expect(allPageRows[2].isNeedRender, "isNeedRender for q2").toLooseEqual(true);
          expect(allPageRows[3].isNeedRender, "isNeedRender for q3").toLooseEqual(true);
          done();
        });
        survey.getQuestionByName("q2").onElementRerendered.fire({} as any, {});
        survey.getQuestionByName("q3").onElementRerendered.fire({} as any, {});
      } finally {
        settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
      }
    });
  });
  test("forceRenderElement for page the exact element, gap = 0", async () => {
    return new Promise(function(resolve) {
      let __remaining = 1;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const done = __done;
      const json = {
        pages: [
          {
            name: "page1",
            elements: [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    type: "text",
                    name: "q1",
                  },
                  {
                    type: "text",
                    name: "q2",
                  },

                ]
              },
              {
                type: "text",
                name: "q3",
              },
            ],
          }
        ],
      };

      const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
      settings.lazyRowsRenderingStartRow = 0;
      try {
        const survey = new SurveyModel(json);
        survey.lazyRenderEnabled = true;
        survey.getAllQuestions().forEach(q => {
          q.supportOnElementRerenderedEvent = true;
          q.onElementRerenderedEventEnabled = true;
        });
        const page1: PageModel = survey.pages[0];
        const allPageRows = page1.getAllRows();
        expect(allPageRows[0].isNeedRender, "isNeedRender for panel").toLooseEqual(true);
        expect(allPageRows[1].isNeedRender, "isNeedRender for q1").toLooseEqual(false);
        expect(allPageRows[2].isNeedRender, "isNeedRender for q2").toLooseEqual(false);
        expect(allPageRows[3].isNeedRender, "isNeedRender for q3").toLooseEqual(false);

        page1.forceRenderElement(survey.getQuestionByName("q3"), () => {
          settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
          expect(allPageRows[0].isNeedRender, "isNeedRender for panel").toLooseEqual(true);
          expect(allPageRows[1].isNeedRender, "isNeedRender for q1").toLooseEqual(false);
          expect(allPageRows[2].isNeedRender, "isNeedRender for q2").toLooseEqual(false);
          expect(allPageRows[3].isNeedRender, "isNeedRender for q3").toLooseEqual(true);
          done();
        });
        survey.getQuestionByName("q3").onElementRerendered.fire({} as any, {});
      } finally {
        settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
      }
    });
  });
  test("forceRenderElement for page with one prev element, gap = 1", async () => {
    return new Promise(function(resolve) {
      let __remaining = 1;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const done = __done;
      const json = {
        pages: [
          {
            name: "page1",
            elements: [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    type: "text",
                    name: "q1",
                  },
                  {
                    type: "text",
                    name: "q2",
                  },

                ]
              },
              {
                type: "text",
                name: "q3",
              },
            ],
          }
        ],
      };

      const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
      settings.lazyRowsRenderingStartRow = 0;
      try {
        const survey = new SurveyModel(json);
        survey.lazyRenderEnabled = true;
        survey.getAllQuestions().forEach(q => {
          q.supportOnElementRerenderedEvent = true;
          q.onElementRerenderedEventEnabled = true;
        });
        const page1: PageModel = survey.pages[0];
        const allPageRows = page1.getAllRows();
        expect(allPageRows[0].isNeedRender, "isNeedRender for panel").toLooseEqual(true);
        expect(allPageRows[1].isNeedRender, "isNeedRender for q1").toLooseEqual(false);
        expect(allPageRows[2].isNeedRender, "isNeedRender for q2").toLooseEqual(false);
        expect(allPageRows[3].isNeedRender, "isNeedRender for q3").toLooseEqual(false);

        page1.forceRenderElement(survey.getQuestionByName("q3"), () => {
          settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
          expect(allPageRows[0].isNeedRender, "isNeedRender for panel").toLooseEqual(true);
          expect(allPageRows[1].isNeedRender, "isNeedRender for q1").toLooseEqual(false);
          expect(allPageRows[2].isNeedRender, "isNeedRender for q2").toLooseEqual(true);
          expect(allPageRows[3].isNeedRender, "isNeedRender for q3").toLooseEqual(true);
          done();
        }, 1);
        survey.getQuestionByName("q2").onElementRerendered.fire({} as any, {});
        survey.getQuestionByName("q3").onElementRerendered.fire({} as any, {});
      } finally {
        settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
      }
    });
  });
  test("row.isNeedRender for nested panels", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [
                {
                  "type": "panel",
                  "name": "panel2",
                  "elements": [
                    {
                      "type": "panel",
                      "name": "panel3",
                      "elements": [
                        {
                          type: "text",
                          name: "q1",
                        },
                        {
                          type: "text",
                          name: "q2",
                        },

                      ]
                    },
                  ]
                },
                {
                  type: "text",
                  name: "q3",
                },
              ]
            },
            {
              type: "text",
              name: "q4",
            },
          ],
        }
      ],
    };

    const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
    settings.lazyRowsRenderingStartRow = 0;
    try {
      const survey = new SurveyModel(json);
      survey.lazyRenderEnabled = true;
      const page1: PageModel = survey.pages[0];
      const allPageRows = page1.getAllRows();
      expect(allPageRows.length, "7 rows with panels").toLooseEqual(7);
      expect(allPageRows[0].isNeedRender, "isNeedRender for panel1").toLooseEqual(true);
      expect(allPageRows[1].isNeedRender, "isNeedRender for panel2").toLooseEqual(true);
      expect(allPageRows[2].isNeedRender, "isNeedRender for panel3").toLooseEqual(true);
      expect(allPageRows[3].isNeedRender, "isNeedRender for q1").toLooseEqual(false);
      expect(allPageRows[4].isNeedRender, "isNeedRender for q2").toLooseEqual(false);
      expect(allPageRows[5].isNeedRender, "isNeedRender for q3").toLooseEqual(false);
      expect(allPageRows[6].isNeedRender, "isNeedRender for q4").toLooseEqual(false);
    } finally {
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  });
  test("row.isNeedRender for nested panels - complex", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              "type": "panel",
              "name": "panel1",
              "elements": [
                {
                  "type": "paneldynamic",
                  "name": "panel2",
                  "templateElements": [
                    {
                      "type": "text",
                      "name": "q1",
                    },
                    {
                      "type": "text",
                      "name": "q2",
                      "startWithNewLine": false,
                    },
                    {
                      "type": "text",
                      "name": "q3",
                    },
                    {
                      "type": "text",
                      "name": "q4",
                      "startWithNewLine": false,
                    },
                  ],
                  "templateTitle": "item #{panelIndex}",
                  "panelCount": 1,
                  "minPanelCount": 1,
                  "keyName": "name",
                },
                {
                  "type": "panel",
                  "name": "panel3",
                  "title": "Totals",
                  "elements": [
                    {
                      "type": "expression",
                      "name": "q5",
                    },
                    {
                      "type": "expression",
                      "name": "q6",
                      "startWithNewLine": false,
                    }
                  ]
                }
              ]
            },
            {
              "type": "text",
              "name": "last-question"
            }
          ],
        }
      ],
    };

    const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
    settings.lazyRowsRenderingStartRow = 0;
    try {
      const survey = new SurveyModel(json);
      survey.lazyRenderEnabled = true;
      const page1: PageModel = survey.pages[0];
      const allPageRows = page1.getAllRows();
      expect(allPageRows.length, "7 rows with panels").toLooseEqual(7);
      expect(allPageRows[0].elements[0].name).toLooseEqual("panel1");
      expect(allPageRows[0].isNeedRender, "isNeedRender for panel1").toLooseEqual(true);
      expect(allPageRows[1].elements[0].name, "panel2 - paneldynamic").toLooseEqual("panel2");
      expect(allPageRows[1].isNeedRender, "isNeedRender for panel2").toLooseEqual(true);
      expect(allPageRows[2].elements[0].name).toLooseEqual("q1");
      // expect(allPageRows[2].isNeedRender, "isNeedRender for q1, q2").toLooseEqual(false);
      expect(allPageRows[3].elements[0].name).toLooseEqual("q3");
      // expect(allPageRows[3].isNeedRender, "isNeedRender for q3, q4").toLooseEqual(false);
      expect(allPageRows[4].elements[0].name).toLooseEqual("panel3");
      expect(allPageRows[4].isNeedRender, "isNeedRender for panel3").toLooseEqual(true);
      expect(allPageRows[5].elements[0].name).toLooseEqual("q5");
      expect(allPageRows[5].isNeedRender, "isNeedRender for q5, q6").toLooseEqual(false);
      expect(allPageRows[6].elements[0].name).toLooseEqual("last-question");
      expect(allPageRows[6].isNeedRender, "isNeedRender for q-last").toLooseEqual(false);
    } finally {
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  });
  test("row.isNeedRender panel dynamic different modes - ordinary and designer", () => {
    const json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              "type": "paneldynamic",
              "name": "panel1",
              "templateElements": [
                {
                  "type": "text",
                  "name": "q1",
                },
                {
                  "type": "text",
                  "name": "q2",
                  "startWithNewLine": false,
                },
                {
                  "type": "text",
                  "name": "q3",
                },
                {
                  "type": "text",
                  "name": "q4",
                  "startWithNewLine": false,
                },
              ],
              "templateTitle": "item #{panelIndex}",
              "panelCount": 2,
              "minPanelCount": 1,
            },
          ],
        }
      ],
    };

    const prevStartRowInLazyRendering = settings.lazyRowsRenderingStartRow;
    settings.lazyRowsRenderingStartRow = 0;
    try {
      const survey = new SurveyModel(json);
      survey.lazyRenderEnabled = true;
      const page1: PageModel = survey.pages[0];

      let allPageRows = page1.getAllRows();
      expect(allPageRows.length, "7 rows with inner panels in runtime mode").toLooseEqual(5);
      expect(allPageRows[0].elements[0].name).toLooseEqual("panel1");
      expect(allPageRows[0].isNeedRender, "isNeedRender for panel1").toLooseEqual(true);
      expect(allPageRows[1].elements[0].name).toLooseEqual("q1");
      // expect(allPageRows[1].isNeedRender, "isNeedRender for q1, q2").toLooseEqual(false);
      expect(allPageRows[2].elements[0].name).toLooseEqual("q3");
      // expect(allPageRows[2].isNeedRender, "isNeedRender for q3, q4").toLooseEqual(false);
      expect(allPageRows[3].elements[0].name).toLooseEqual("q1");
      // expect(allPageRows[3].isNeedRender, "isNeedRender for q1, q2").toLooseEqual(false);
      expect(allPageRows[4].elements[0].name).toLooseEqual("q3");
      // expect(allPageRows[4].isNeedRender, "isNeedRender for q3, q4").toLooseEqual(false);

      survey.setDesignMode(true);
      allPageRows = page1.getAllRows();
      expect(allPageRows.length, "3 rows with inner panels in design mode").toLooseEqual(3);
      expect(allPageRows[0].elements[0].name).toLooseEqual("panel1");
      expect(allPageRows[0].isNeedRender, "isNeedRender for panel1").toLooseEqual(true);
      expect(allPageRows[1].elements[0].name).toLooseEqual("q1");
      // expect(allPageRows[1].isNeedRender, "isNeedRender for q1, q2").toLooseEqual(false);
      expect(allPageRows[2].elements[0].name).toLooseEqual("q3");
    // expect(allPageRows[2].isNeedRender, "isNeedRender for q3, q4").toLooseEqual(false);
    } finally {
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  });
  test("Nested pages", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] }
      ]
    });
    const page1 = survey.pages[0];
    expect(page1.isPage, "isPage #1").toLooseEqual(true);
    expect(page1.isPanel, "isPanel #1").toLooseEqual(false);
    expect(page1.getTemplate(), "template #1").toLooseEqual("page");
    expect(page1.survey.state, "survey state #1").toLooseEqual("running");
    const rootPage = new PageModel("p1");
    rootPage.isPageContainer = true;
    rootPage.addElement(page1);
    expect(page1.isPage, "isPage #2").toLooseEqual(false);
    expect(page1.isPanel, "isPanel #2").toLooseEqual(true);
    expect(page1.getTemplate(), "template #2").toLooseEqual("panel");
    expect(page1.survey.state, "survey state #2").toLooseEqual("running");
    page1.parent = null;
    expect(page1.isPage, "isPage #3").toLooseEqual(true);
    expect(page1.isPanel, "isPanel #3").toLooseEqual(false);
    expect(page1.getTemplate(), "template #3").toLooseEqual("page");
    expect(page1.survey.state, "survey state #3").toLooseEqual("running");
    expect(page1.isDisposed, "The page is not disposed").toLooseEqual(false);
  });
  test("survey.onGetPanelNumber", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        {
          type: "panel", name: "panel1", title: "Panel 1",
          showNumber: true, showQuestionNumbers: "onpanel",
          elements: [
            {
              type: "panel", name: "panel2",
              showNumber: true, showQuestionNumbers: "onpanel", title: "Panel 2",
              elements: [
                { type: "text", name: "q1" },
                { type: "text", name: "q2" }
              ]
            },
            { type: "text", name: "q3" },
            { type: "text", name: "q4" }
          ]
        },
        {
          type: "panel", name: "panel3",
          showNumber: true, showQuestionNumbers: "onpanel", title: "Panel 3",
          elements: [
            { type: "text", name: "q5" },
            { type: "text", name: "q6" }
          ]
        },
        { type: "text", name: "q7" }
      ]
    });
    survey.onGetQuestionNumber.add((sender, options) => {
      const parent: any = options.question.parent;
      if (!!parent && parent.no) {
        options.number = parent.no + options.number;
      }
    });
    survey.onGetPanelNumber.add((sender, options) => {
      const parent: any = options.panel.parent;
      if (!!parent && parent.no) {
        options.number = parent.no + options.number;
      }
    });
    expect(survey.getPanelByName("panel1").no, "panel1.no").toLooseEqual("1.");
    expect(survey.getPanelByName("panel2").no, "panel2.no").toLooseEqual("1.1.");
    expect(survey.getPanelByName("panel3").no, "panel3.no").toLooseEqual("2.");
    expect(survey.getQuestionByName("q1").no, "q1.no").toLooseEqual("1.1.1.");
    expect(survey.getQuestionByName("q2").no, "q2.no").toLooseEqual("1.1.2.");
    expect(survey.getQuestionByName("q3").no, "q3.no").toLooseEqual("1.2.");
    expect(survey.getQuestionByName("q4").no, "q4.no").toLooseEqual("1.3.");
    expect(survey.getQuestionByName("q5").no, "q5.no").toLooseEqual("2.1.");
    expect(survey.getQuestionByName("q6").no, "q6.no").toLooseEqual("2.2.");
    expect(survey.getQuestionByName("q7").no, "q7.no").toLooseEqual("3.");
  });
  test("panel.showQuestionNumbers: 'recursive'", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        {
          type: "panel", name: "panel1", title: "Panel 1",
          showNumber: true, showQuestionNumbers: "recursive",
          elements: [
            {
              type: "panel", name: "panel2",
              showNumber: true, showQuestionNumbers: "recursive", title: "Panel 2",
              elements: [
                { type: "text", name: "q1" },
                { type: "text", name: "q2" }
              ]
            },
            { type: "text", name: "q3" },
            { type: "text", name: "q4" }
          ]
        },
        {
          type: "panel", name: "panel3",
          showNumber: true, showQuestionNumbers: "recursive", title: "Panel 3",
          elements: [
            { type: "text", name: "q5" },
            { type: "text", name: "q6" }
          ]
        },
        { type: "text", name: "q7" }
      ]
    });
    expect(survey.getPanelByName("panel1").no, "panel1.no").toLooseEqual("1.");
    expect(survey.getPanelByName("panel2").no, "panel2.no").toLooseEqual("1.1.");
    expect(survey.getPanelByName("panel3").no, "panel3.no").toLooseEqual("2.");
    expect(survey.getQuestionByName("q1").no, "q1.no").toLooseEqual("1.1.1.");
    expect(survey.getQuestionByName("q2").no, "q2.no").toLooseEqual("1.1.2.");
    expect(survey.getQuestionByName("q3").no, "q3.no").toLooseEqual("1.2.");
    expect(survey.getQuestionByName("q4").no, "q4.no").toLooseEqual("1.3.");
    expect(survey.getQuestionByName("q5").no, "q5.no").toLooseEqual("2.1.");
    expect(survey.getQuestionByName("q6").no, "q6.no").toLooseEqual("2.2.");
    expect(survey.getQuestionByName("q7").no, "q7.no").toLooseEqual("3.");
  });
  test("survey.showQuestionNumbers: 'recursive' & panels", () => {
    const survey = new SurveyModel({
      showQuestionNumbers: "recursive",
      elements: [
        {
          type: "panel", name: "panel1", title: "Panel 1",
          showNumber: true,
          elements: [
            {
              type: "panel", name: "panel2",
              title: "Panel 2",
              elements: [
                { type: "text", name: "q1" },
                { type: "text", name: "q2" }
              ]
            },
            { type: "text", name: "q3" },
            { type: "text", name: "q4" }
          ]
        },
        {
          type: "panel", name: "panel3",
          showNumber: true, title: "Panel 3",
          elements: [
            { type: "text", name: "q5" },
            { type: "text", name: "q6" }
          ]
        },
        { type: "text", name: "q7" }
      ]
    });
    expect(survey.getPanelByName("panel1").no, "panel1.no").toLooseEqual("1.");
    expect(survey.getPanelByName("panel2").no, "panel2.no").toLooseEqual("1.1.");
    expect(survey.getPanelByName("panel3").no, "panel3.no").toLooseEqual("2.");
    expect(survey.getQuestionByName("q1").no, "q1.no").toLooseEqual("1.1.1.");
    expect(survey.getQuestionByName("q2").no, "q2.no").toLooseEqual("1.1.2.");
    expect(survey.getQuestionByName("q3").no, "q3.no").toLooseEqual("1.2.");
    expect(survey.getQuestionByName("q4").no, "q4.no").toLooseEqual("1.3.");
    expect(survey.getQuestionByName("q5").no, "q5.no").toLooseEqual("2.1.");
    expect(survey.getQuestionByName("q6").no, "q6.no").toLooseEqual("2.2.");
    expect(survey.getQuestionByName("q7").no, "q7.no").toLooseEqual("3.");
  });
  test("survey.showQuestionNumbers: 'recursive' & panels & questionStartIndex 1.1, Issue#10456", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      showQuestionNumbers: "recursive",
      questionStartIndex: "1.1.",
      pages: [{
        elements: [
          {
            type: "panel", name: "panel1", title: "Panel 1",
            showNumber: true,
            elements: [
              {
                type: "panel", name: "panel2",
                title: "Panel 2",
                elements: [
                  { type: "text", name: "q1" },
                  { type: "text", name: "q2" }
                ]
              },
              { type: "text", name: "q3" },
              { type: "text", name: "q4" }
            ]
          },
          { type: "panel", name: "panel3", showNumber: true, title: "Panel 4", elements: [
            { type: "text", name: "q5" }
          ] },
          { type: "text", name: "q6" }
        ] },
      {
        elements: [
          {
            type: "panel", name: "panel4",
            showNumber: true, title: "Panel 3",
            elements: [
              { type: "text", name: "q7" },
              { type: "text", name: "q8" }
            ]
          },
          { type: "text", name: "q9" }
        ] }]
    });
    expect(survey.getPanelByName("panel1").no, "panel1.no").toLooseEqual("1.1.");
    expect(survey.getPanelByName("panel2").no, "panel2.no").toLooseEqual("1.1.1.");
    expect(survey.getPanelByName("panel3").no, "panel2.no").toLooseEqual("1.2.");
    expect(survey.getPanelByName("panel4").no, "panel4.no").toLooseEqual("2.1.");
    expect(survey.getQuestionByName("q1").no, "q1.no").toLooseEqual("1.1.1.1.");
    expect(survey.getQuestionByName("q2").no, "q2.no").toLooseEqual("1.1.1.2.");
    expect(survey.getQuestionByName("q3").no, "q3.no").toLooseEqual("1.1.2.");
    expect(survey.getQuestionByName("q4").no, "q4.no").toLooseEqual("1.1.3.");
    expect(survey.getQuestionByName("q5").no, "q5.no").toLooseEqual("1.2.1.");
    expect(survey.getQuestionByName("q6").no, "q6.no").toLooseEqual("1.3.");
    expect(survey.getQuestionByName("q7").no, "q7.no").toLooseEqual("2.1.1.");
    expect(survey.getQuestionByName("q8").no, "q8.no").toLooseEqual("2.1.2.");
    expect(survey.getQuestionByName("q9").no, "q9.no").toLooseEqual("2.2.");
  });
  test("Check that startWithNewLine doesn't trigger animation", () => {
    settings.animationEnabled = true;
    const survey = new SurveyModel({
      "logoPosition": "right",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            },
            {
              "type": "text",
              "name": "question2"
            }
          ]
        }
      ]
    });
    const question2 = survey.getQuestionByName("question2");
    const page = survey.getPageByName("page1");
    page.enableOnElementRerenderedEvent();
    expect(page.animationAllowed, "check that animation is enabled").toBeTruthy();
    expect(page.visibleRows.length).toLooseEqual(2);
    question2.startWithNewLine = false;
    expect(page.visibleRows.length).toLooseEqual(1);
    settings.animationEnabled = false;
  });

  test("test titleTagName of ", () => {
    const savedTitleTags = Helpers.createCopy(settings.titleTags);
    settings.titleTags.survey = "h1";
    settings.titleTags.page = "h2";
    settings.titleTags.panel = "h3";
    settings.titleTags.question = "h4";

    const dynamicContainer = {
      name: "dynamic_container",
      title: "Dynamic Container",
      iconName: "icon-dynamic_container",
      widgetIsLoaded() { return true; },
      isFit(question) { return question.getType() === "panel"; },
      init() {
        Serializer.addClass("dynamic_container", [], undefined, "panel");
        Serializer.addProperty("dynamic_container", { name: "section_identifier", displayName: "Section Identifier" });
      },
    };

    CustomWidgetCollection.Instance.clear();
    CustomWidgetCollection.Instance.add(dynamicContainer, "customtype");

    try {
      const survey = new SurveyModel();
      const page = survey.addNewPage("Page 1");
      const panel = Serializer.createClass("dynamic_container", { "type": "dynamic_container", "name": "q1" }) as PanelModel;
      page.addPanel(panel);

      expect(survey.getAllPanels().length).toLooseEqual(1);
      expect(panel.titleTagName).toLooseEqual("h3");
      expect(page.titleTagName).toLooseEqual("h2");

    } finally {
      CustomWidgetCollection.Instance.clear();
      settings.titleTags = savedTitleTags;
    }
  });
  test("Add element into non rendered page, bug#10103", () => {
    const survey = new SurveyModel({
      pages: [{
        name: "page1",
        elements: [
          {
            type: "text",
            name: "q1"
          }
        ]
      },
      {
        name: "page2",
        elements: [
          {
            type: "text",
            name: "q2"
          }
        ]
      }
      ] });
    expect(survey.activePage.name, "active page is page1").toLooseEqual("page1");
    const page2 = survey.getPageByName("page2");
    expect(page2.rows.length, "page2 has no rows yet").toLooseEqual(0);
    page2.addElement(new QuestionTextModel("q3"), 1);
    expect(page2.rows.length, "page2 still has no rows #1").toLooseEqual(0);
    expect(page2.elements.length, "There are 2 questions").toLooseEqual(2);
    page2.addElement(new QuestionTextModel("q4"), 2);
    expect(page2.rows.length, "page2 still has no rows #2").toLooseEqual(0);
    expect(page2.elements.length, "There are 3 questions").toLooseEqual(3);
    survey.nextPage();
    expect(page2.rows.length, "page2 has 3 rows").toLooseEqual(3);
  });
  test("Panel.validate vs callback function as a parameter #10307", () => {
    let returnResults = new Array<any>();
    function asyncFunc(params: any): any {
      returnResults.push(this.returnResult);
      return false;
    }
    registerFunction({ name: "asyncFunc", func: asyncFunc, isAsync: true, useCache: false });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", validators: [{ type: "expression", expression: "asyncFunc({q2})" }] },
        { type: "text", name: "q2" },
        { type: "text", name: "q3", validators: [{ type: "expression", expression: "{q2} > {q1}" }] }
      ]
    });
    const page = survey.pages[0];
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const callbackResults = new Array<any>();
    q1.value = 1;
    q2.value = 2;
    q3.value = 3;
    const callbackValidators = (res: boolean, question: Question): void => {
      callbackResults.push({ res: res, name: question?.name || "" });
    };
    let res = page.validate(true, false, callbackValidators);
    expect(res, "res #1").toLooseEqual(undefined);
    expect(returnResults.length, "returnResults, #1").toLooseEqual(1);
    expect(callbackResults, "callbackResults, #1").toEqualValues([]);
    expect(q1.errors.length, "q1.errors #1").toLooseEqual(0);
    returnResults[0](false);
    expect(q1.errors.length, "q1.errors #2").toLooseEqual(1);
    expect(callbackResults, "callbackResults, #2").toEqualValues([{ res: false, name: "q1" }]);

    q1.value = 3;
    returnResults.splice(0, returnResults.length);
    callbackResults.splice(0, callbackResults.length);
    res = page.validate(true, false, callbackValidators);
    expect(res, "res #3").toLooseEqual(false);
    expect(returnResults.length, "returnResults, #3").toLooseEqual(1);
    expect(callbackResults, "callbackResults, #3").toEqualValues([{ res: false, name: "q3" }]);
    expect(q1.errors.length, "q1.errors #3").toLooseEqual(0);
    expect(q3.errors.length, "q3.errors #3").toLooseEqual(1);
    returnResults[0](false);
    expect(q1.errors.length, "q1.errors #4").toLooseEqual(1);
    expect(q3.errors.length, "q3.errors #4").toLooseEqual(1);
    expect(callbackResults, "callbackResults, #4").toEqualValues([{ res: false, name: "q3" }]);

    q2.value = 30;
    returnResults.splice(0, returnResults.length);
    callbackResults.splice(0, callbackResults.length);
    res = page.validate(true, false, callbackValidators);
    expect(res, "res #5").toLooseEqual(undefined);
    expect(returnResults.length, "returnResults, #5").toLooseEqual(1);
    expect(callbackResults, "callbackResults, #5").toEqualValues([]);
    expect(q1.errors.length, "q1.errors #5").toLooseEqual(0);
    expect(q3.errors.length, "q3.errors #5").toLooseEqual(0);
    returnResults[0](true);
    expect(q1.errors.length, "q1.errors #6").toLooseEqual(0);
    expect(q3.errors.length, "q3.errors #6").toLooseEqual(0);
    expect(callbackResults, "callbackResults, #6").toEqualValues([{ res: true, name: "" }]);

    FunctionFactory.Instance.unregister("asyncFunc");
  });
  test("page questionStartIndex, Issue#10523", () => {
    const survey = new SurveyModel({
      pages: [{
        elements: [
          {
            type: "text",
            name: "q1"
          }] },
      {
        elements: [
          {
            type: "text",
            name: "q2"
          }] },
      {
        questionStartIndex: "A.1",
        elements: [
          {
            type: "panel", name: "p1", title: "Panel",
            elements: [
              { type: "text", name: "q3" },
              { type: "text", name: "q4" }
            ]
          },
        ] },
      { elements: [
        { type: "text", name: "q5" },
        {
          type: "panel", name: "p2", title: "Panel",
          elements: [
            { type: "text", name: "q6" },
            { type: "text", name: "q7" }
          ]
        }]
      }],
      showQuestionNumbers: "recursive",
      questionStartIndex: "1.1"
    });
    expect(survey.pages[1].visibleIndex, "page2.visibleIndex, #1").toLooseEqual(1);
    expect(survey.pages[1].num, "page2.num, #2").toLooseEqual(2);
    expect(survey.pages[2].questionStartIndex, "questionStartIndex, #1").toLooseEqual("A.1");
    expect(survey.pages[2].visibleIndex, "page2.visibleIndex, #1").toLooseEqual(2);
    expect(survey.pages[2].num, "page2.num, #2").toLooseEqual(1);
    expect(survey.pages[3].visibleIndex, "page3.visibleIndex, #1").toLooseEqual(3);
    expect(survey.pages[3].num, "page3.num, #1").toLooseEqual(2);
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    const q5 = survey.getQuestionByName("q5");
    const q6 = survey.getQuestionByName("q6");
    const q7 = survey.getQuestionByName("q7");
    const p1 = survey.getPanelByName("p1");
    const p2 = survey.getPanelByName("p2");

    expect(q1.no, "q1, #1").toLooseEqual("1.1");
    expect(q2.no, "q2, #1").toLooseEqual("2.1");
    expect(p1.no, "panel1, #1").toLooseEqual("A.1");
    expect(q3.no, "q3, #1").toLooseEqual("A.1.1");
    expect(q4.no, "q4, #1").toLooseEqual("A.1.2");
    expect(q5.no, "q5, #1").toLooseEqual("B.1");
    expect(p2.no, "panel2, #1").toLooseEqual("B.2");
    expect(q6.no, "q6, #1").toLooseEqual("B.2.1");
    expect(q7.no, "q7, #1").toLooseEqual("B.2.2");
  });
  test("Panel/Page getPanelInDesignMode", () => {
    expect(new PageModel("p1").getPanelInDesignMode(), "page returns null").toBeFalsy();
    expect(new PanelModel("p1").getPanelInDesignMode().name, "panel returns itself").toLooseEqual("p1");
  });
  test("Do not create footerActions array on creating&loading", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "panel", name: "panel1", elements: [{ type: "text", name: "q1" }] }
      ]
    });
    const panel = survey.getPanelByName("panel1");
    expect(panel.getPropertyValue("footerActions"), "footerActions array is not created").toLooseEqual(undefined);
  });
  test("Do not create gridLayoutColumns array on creating&loading/serializing", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "panel", name: "panel1", elements: [{ type: "text", name: "q1" }] }
      ]
    });
    const panel = survey.getPanelByName("panel1");
    expect(panel.getPropertyValue("gridLayoutColumns"), "gridLayoutColumns array is not created on loading").toLooseEqual(undefined);
    expect(panel.toJSON().name).toLooseEqual("panel1");
    expect(panel.getPropertyValue("gridLayoutColumns"), "gridLayoutColumns array is not created on serializing").toLooseEqual(undefined);
  });
  test("Panel maxWidth should return to default when set to empty string", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "panel", name: "panel1", elements: [{ type: "text", name: "q1" }] }
      ]
    });
    const panel = survey.getPanelByName("panel1");
    expect(panel.maxWidth, "panel maxWidth default value").toLooseEqual(settings.maxWidth);
    panel.maxWidth = "50%";
    expect(panel.maxWidth, "panel maxWidth is set to 50%").toLooseEqual("50%");
    panel.maxWidth = "";
    expect(panel.maxWidth, "panel maxWidth returns to default on empty string").toLooseEqual(settings.maxWidth);
  });
  test("Required Validation Errors should not appear for Read-only Panels Bug#11136", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "panel", name: "panel1", isRequired: true, readOnly: true, elements: [{ type: "text", name: "q1" }] }
      ]
    });
    const panel = survey.getPanelByName("panel1");
    expect(survey.validate(), "Survey is valid when panel is read-only and required").toLooseEqual(true);
    expect(panel.errors.length, "There should be no errors on the panel").toLooseEqual(0);
  });
});
