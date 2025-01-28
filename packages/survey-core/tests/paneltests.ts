import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { Question } from "../src/question";
import { PanelModel, QuestionRowModel } from "../src/panel";
import { QuestionTextModel } from "../src/question_text";
import { JsonObject } from "../src/jsonobject";
import { FlowPanelModel } from "../src/flowpanel";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { settings } from "../src/settings";
import { AdaptiveActionContainer } from "../src/actions/adaptive-container";
import { ActionContainer } from "../src/actions/container";
import { IElement } from "../src/base-interfaces";
import { SurveyElement } from "../src/survey-element";
import { setOldTheme } from "./oldTheme";
export default QUnit.module("Panel");

QUnit.test("questions-elements synhronization", function (assert) {
  const page = new PageModel();
  page.addNewQuestion("text", "q1");
  page.addNewQuestion("text", "q2");
  page.addNewQuestion("text", "q3");
  assert.equal(page.questions.length, 3, "There are 3 questions");
  assert.equal(page.elements.length, 3, "There are 3 elements");
  page.removeQuestion(page.questions[1]);
  assert.equal(page.questions.length, 2, "There are 2 questions");
  assert.equal(page.elements.length, 2, "There are 2 elements");
  assert.equal(
    (<Question>page.elements[1]).name,
    "q3",
    "The second element is correct"
  );
});

QUnit.test("elements-questions synhronization", function (assert) {
  const page = new PageModel();
  page.elements.push(new QuestionTextModel("q1"));
  page.elements.push(new QuestionTextModel("q2"));
  page.elements.push(new QuestionTextModel("q3"));
  assert.equal(page.elements.length, 3, "There are 3 elements");
  assert.equal(page.questions.length, 3, "There are 3 questions");
  page.elements.splice(1, 1);
  assert.equal(page.elements.length, 2, "There are 2 elements");
  assert.equal(page.questions.length, 2, "There are 2 questions");
  assert.equal(page.questions[1].name, "q3", "The second element is correct");
});

QUnit.test("load page from json with old questions", function (assert) {
  const page = new PageModel();
  const jsonObject = new JsonObject();
  jsonObject.toObject(
    {
      questions: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
      ],
    },
    page
  );
  assert.equal(page.elements.length, 2, "There are two elements");
  assert.equal(page.questions.length, 2, "There are two questions");
  assert.equal(jsonObject.errors.length, 0, "There is no errors");
});

QUnit.test("Simple test on nested panel", function (assert) {
  const page = new PageModel();
  page.addNewQuestion("text", "q1");
  const panel = page.addNewPanel("p1");
  assert.equal(page.elements.length, 2, "There are two elements");
  assert.equal(page.questions.length, 1, "There is still one question");
  panel.addNewQuestion("text", "q2_1");
  panel.addNewQuestion("text", "q2_2");
  assert.equal(page.elements.length, 2, "There are two elements");
  assert.equal(page.questions.length, 3, "There are three questions");
  page.addNewQuestion("text", "q3");
  assert.equal(page.elements.length, 3, "There are two elements");
  assert.equal(page.questions.length, 4, "There are four questions");
  panel.addNewQuestion("text", "q2_3");
  assert.equal(page.elements.length, 3, "There are two elements");
  assert.equal(page.questions.length, 5, "There are five questions");
});

QUnit.test("add questions to list", function (assert) {
  const page = new PageModel();
  page.addNewQuestion("text", "q1");
  const panel = page.addNewPanel("p1");
  panel.addNewQuestion("text", "q2_1");
  page.addNewQuestion("text", "q3");
  const list = [];
  page.addQuestionsToList(list);
  assert.equal(list.length, 3, "There are three questions");
});

QUnit.test("load nested panel from json", function (assert) {
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
  assert.equal(page.elements.length, 3, "There are two elements");
  assert.equal(page.questions.length, 4, "There are four questions");
  assert.equal(jsonObject.errors.length, 0, "There is no errors");
});

QUnit.test("panel rows generation - simple", function (assert) {
  const page = new PageModel();
  const q1 = page.addNewQuestion("text", "q1");
  page.addNewQuestion("text", "q2");
  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.rows[0].visible, true, "The first row is visible");
  q1.visible = false;
  assert.equal(page.rows[0].visible, false, "The first row is invisible now");
});

QUnit.test("panel rows generation - startNewLine false", function (assert) {
  const page = new PageModel();
  const q1 = page.addNewQuestion("text", "q1");
  const q2 = page.addNewQuestion("text", "q2");
  q2.startWithNewLine = false;
  assert.equal(page.rows.length, 1, "There is one row");
  assert.equal(page.rows[0].visible, true, "The first row is visible");
  q1.visible = false;
  assert.equal(page.rows[0].visible, true, "The first row is still visible");
  q2.visible = false;
  assert.equal(page.rows[0].visible, false, "The first row is invisible now");
});

QUnit.test("panel rows generation - nested panel", function (assert) {
  const page = new PageModel();
  page.addNewQuestion("text", "q1");
  const p1 = page.addNewPanel("p1");
  const p1q1 = p1.addNewQuestion("text", "p1q1");
  assert.equal(page.rows.length, 2, "There is two rows");
  assert.equal(page.rows[1].visible, true, "The panel row is visible");
  p1.visible = false;
  assert.equal(
    page.rows[1].visible,
    false,
    "The panel row is invisible since panel is invisible"
  );
  p1.visible = true;
  assert.equal(
    page.rows[1].visible,
    true,
    "The panel row is visible since panel is visible"
  );
  p1q1.visible = false;
  assert.equal(
    page.rows[1].visible,
    false,
    "The panel row is invisible since all questions are invisible"
  );
  p1q1.visible = true;
  assert.equal(page.rows[1].visible, true, "The panel row is visible again");
  p1.removeElement(p1q1);
  assert.equal(
    page.rows[1].visible,
    false,
    "The panel row is invisible - it is empty"
  );
});
QUnit.test("Expand panel on validation error", function (assert) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("page1");
  const panel1 = page.addNewPanel("p1");
  panel1.collapse();
  const panel2 = panel1.addNewPanel("p2");
  panel2.collapse();
  const question = <Question>panel2.addNewQuestion("text", "q1");
  question.isRequired = true;
  assert.equal(panel1.isCollapsed, true, "Panel1 is collapsed");
  assert.equal(panel2.isCollapsed, true, "Panel2 is collapsed");
  page.hasErrors(true, true);
  assert.equal(panel1.isCollapsed, false, "Panel1 is not collapsed");
  assert.equal(panel2.isCollapsed, false, "Panel2 is not collapsed");
});
QUnit.test("Render name if title is empty and panel is expanded or collapsed", function (assert) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("page1");
  const panel = page.addNewPanel("p1");
  assert.notOk(panel.locTitle.textOrHtml, "panel title is empty");
  assert.notOk(panel.hasTitle, "no title, #1");
  panel.collapse();
  assert.equal(panel.locTitle.textOrHtml, "p1", "panel title is name");
  assert.ok(panel.hasTitle, "has title, #2");
  panel.state = "default";
  assert.notOk(panel.locTitle.textOrHtml, "panel title is empty, #2");
  assert.notOk(panel.hasTitle, "no title, #3");
  panel.expand();
  assert.equal(panel.locTitle.textOrHtml, "p1", "panel title is name, #2");
  assert.ok(panel.hasTitle, "has title, #3");
  panel.title = "some text";
  assert.equal(panel.locTitle.textOrHtml, "some text", "panel title is not empty");
  assert.ok(panel.hasTitle, "has title, #4");
  panel.title = "";
  panel.state = "default";
  assert.notOk(panel.locTitle.textOrHtml, "panel title is empty, #3");
  assert.notOk(panel.hasTitle, "no title, #5");
  panel.title = "some text";
  assert.equal(panel.locTitle.textOrHtml, "some text", "panel title is not empty, #2");
  assert.ok(panel.hasTitle, "has title, #6");
});
QUnit.test("Panel.isRequired", function (assert) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("page1");
  const panel = page.addNewPanel("p1");
  const panel2 = page.addNewPanel("p2");
  const q1 = <Question>panel.addNewQuestion("text", "q1");
  const q2 = <Question>panel.addNewQuestion("text", "q2");
  assert.equal(panel.hasErrors(), false, "There is no errors");
  assert.equal(panel.hasVisibleErrors, false, "There is no visible errors");
  panel.isRequired = true;
  assert.equal(panel.hasErrors(), true, "All questions are empty");
  assert.equal(panel.errors.length, 1, "One error");
  assert.equal(panel.hasVisibleErrors, true, "There is visible errors");
  q1.value = "1";
  assert.equal(panel.hasErrors(), false, "The first question is not empty");
  assert.equal(panel.hasVisibleErrors, false, "There no visible errors");
  panel2.isRequired = true;
  assert.equal(
    panel.hasErrors(),
    false,
    "There is no visible questions in the panel"
  );
  assert.equal(panel.hasVisibleErrors, false, "There no visible errors");
});
QUnit.test("Panel.isRequired and hideRequiredErrors, Bug#2679", function (
  assert
) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("page1");
  const panel = page.addNewPanel("p1");
  panel.addNewQuestion("text", "q1");
  panel.isRequired = true;
  survey.hideRequiredErrors = true;
  assert.equal(panel.hasErrors(), true, "All questions are empty");
  assert.equal(panel.errors.length, 1, "One error");
  assert.equal(panel.errors[0].visible, false, "error is invisible");
  assert.equal(
    panel.hasVisibleErrors,
    false,
    "There is error, but it is invisible"
  );
});
QUnit.test("Panel.isRequired&checkErrorsMode='onValueChanged', bug#6395", function (assert) {
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
  assert.equal(panel1.errors.length, 0, "There is no errors in panel, #1");
  panel1.hasErrors();
  assert.equal(panel1.errors.length, 1, "There is an error in panel, #2");
  q1.value = "abc";
  assert.equal(panel1.errors.length, 0, "There is no errors in panel, #3");

  const panel2 = survey.getPanelByName("panel2");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(panel2.errors.length, 0, "There is no errors in panel, #4");
  panel2.hasErrors();
  assert.equal(panel2.errors.length, 1, "There is an error in panel, #5");
  q2.value = "abc";
  assert.equal(panel2.errors.length, 0, "There is no errors in panel, #6");
});

QUnit.test("Panel with paneldynamic error focus", function (assert) {
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
  const rec = {
    focusOnFirstError: true,
    firstErrorQuestion: <any>null,
  };
  const panel = survey.getPanelByName("p1");

  survey.isCurrentPageHasErrors;
  panel["hasErrorsCore"](rec);

  assert.equal(
    rec.firstErrorQuestion.name,
    "textinpd",
    "scroll to first question in the dynamicpanel instead of dynamicpanel itself"
  );
});

QUnit.test("Required panel error focus/not focus - T3101 - Stop focus when page has error", function (assert) {
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
  const page = survey.currentPage;

  const rec: any = {
    fireCallback: true,
    focusOnFirstError: true
  };
  page.hasErrors(true, true, rec);
  assert.equal(rec.firstErrorQuestion.name, "chk1", "scroll to first question in the dynamicpanel instead of dynamicpanel itself");
  assert.equal(focusedQuestionId, rec.firstErrorQuestion.inputId, "focus the question");

  focusedQuestionId = "";
  rec.focusOnFirstError = false;
  rec.firstErrorQuestion = null;
  page.hasErrors(true, false, rec);
  assert.notOk(focusedQuestionId, "don't scroll to question - T3101 - Stop focus when page has error");
  SurveyElement.FocusElement = oldFunc;
});

QUnit.test("Panel.getValue()", function (assert) {
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

  assert.deepEqual(
    panel3.getValue(),
    { q3: "val3" },
    "Nested panel.getValue() works correctly"
  );
  assert.deepEqual(
    panel1.getValue(),
    { q1: "val1", q3: "val3" },
    "Panel.getValue()  works correctly"
  );
  assert.deepEqual(
    page.getValue(),
    { q1: "val1", q2: "val2", q3: "val3" },
    "Page.getValue() works correctly"
  );
  assert.deepEqual(
    page.getValue(),
    survey.data,
    "survey.data == page.getValue() in our case"
  );
});

QUnit.test("Panel.getValue() + others, Bug# 1573, T1701", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "radiogroup",
        name: "spread",
        hasOther: true,
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
  assert.deepEqual(
    survey.data,
    { spread: "other", "spread-Comment": "Jam" },
    "survey.data is correct"
  );
  assert.deepEqual(
    survey.currentPage.getValue(),
    { spread: "other", "spread-Comment": "Jam" },
    "survey.currentPage.getValue() is correct"
  );
  const question = <QuestionCheckboxModel>survey.getQuestionByName("spread");
  question.comment = "";
  question.value = "butter";
  assert.deepEqual(
    survey.data,
    { spread: "butter" },
    "survey.data is correct, not other"
  );
  assert.deepEqual(
    survey.currentPage.getValue(),
    { spread: "butter" },
    "survey.currentPage.getValue() is correct, not other"
  );
  survey.storeOthersAsComment = false;
  question.value = "other";
  question.comment = "Jam";
  assert.deepEqual(
    survey.data,
    { spread: "Jam" },
    "survey.data is correct, other +  storeOthersAsComment = false"
  );
  assert.deepEqual(
    survey.currentPage.getValue(),
    { spread: "Jam" },
    "survey.currentPage.getValue() is correct + storeOthersAsComment = false"
  );
});

QUnit.test("Panel.getComments()", function (assert) {
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

  assert.deepEqual(
    panel3.getComments(),
    { q3: "val3" },
    "Nested panel.getComments() works correctly"
  );
  assert.deepEqual(
    panel1.getComments(),
    { q1: "val1", q3: "val3" },
    "Panel.getComments()  works correctly"
  );
  assert.deepEqual(
    page.getComments(),
    { q1: "val1", q2: "val2", q3: "val3" },
    "Page.getComments() works correctly"
  );
});

QUnit.test("Page getPanels and Survey getAllPanels", function (assert) {
  const survey = new SurveyModel();
  const page1 = survey.addNewPage("page1");
  const panel1 = page1.addNewPanel("p1");
  const panel2 = page1.addNewPanel("p2");

  const page2 = survey.addNewPage("page2");
  const panel3 = page2.addNewPanel("p3");

  assert.equal(
    survey.getAllPanels().length,
    3,
    "There are 3 panels in the survey"
  );
  assert.equal(
    survey.pages[0].getPanels().length,
    2,
    "There are 2 panels in the first page"
  );
  assert.equal(
    survey.pages[1].getPanels().length,
    1,
    "There is 1 panel in the second page"
  );
});

QUnit.test("Get first focused question correctly, Bug#1417", function (assert) {
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
  page.hasErrors(true);
  assert.equal(
    page.getFirstQuestionToFocus().name,
    "q6",
    "The first question for focusing is q6"
  );
  assert.equal(
    page.getFirstQuestionToFocus(true).name,
    "q7",
    "The first question for focusing with errors is q7"
  );
});
QUnit.test("Get first focused error question for matrix cell", function (assert) {
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
  page.hasErrors(true);
  assert.equal(page.getFirstQuestionToFocus(true).name, "col1", "The first question for focusing is matrix cell question");
});
QUnit.test("Get first focused error question for panel dynamic question", function (assert) {
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
  page.hasErrors(true);
  assert.equal(page.getFirstQuestionToFocus(true).name, "question1", "The first question for focusing is in matrix dynamic");
});
QUnit.test("Get first focused question on collapsed panel", function (assert) {
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
  assert.equal(page.getFirstQuestionToFocus().name, "q2", "q1 is in collapsed panel");
  assert.equal(page.getFirstQuestionToFocus(false, true).name, "q1", "ignore collapsed state");
  page.hasErrors(true);
  assert.equal(page.getFirstQuestionToFocus(true).name, "q1", "q1 has error");
});
QUnit.test("Flow Panel, add new element/remove element", function (assert) {
  const panel = new FlowPanelModel("p");
  panel.addNewQuestion("text", "q1");
  assert.equal(panel.content, "{element:q1}", "element was added into content");
  panel.removeElement(panel.elements[0]);
  assert.equal(panel.content, "", "element is removed from content");
});

QUnit.test("getLayoutType()", function (assert) {
  const survey = new SurveyModel();
  const page = survey.addNewPage("p");
  const q1 = page.addNewQuestion("text", "q1");
  const flowPanel = new FlowPanelModel("flowPanel");
  page.addElement(flowPanel);
  const panel = page.addNewPanel("panel");
  const q2 = panel.addNewQuestion("text", "q2");
  const q3 = flowPanel.addNewQuestion("text", "q3");

  assert.equal(page.getLayoutType(), "row");
  assert.equal(panel.getLayoutType(), "row");
  assert.equal(flowPanel.getLayoutType(), "row");
  assert.equal(panel.getChildrenLayoutType(), "row");
  assert.equal(flowPanel.getChildrenLayoutType(), "flow");
  assert.equal(q1.getLayoutType(), "row");
  assert.equal(q2.getLayoutType(), "row");
  assert.equal(q3.getLayoutType(), "flow");
});

QUnit.test("Hide question title for flow layout", function (assert) {
  const flowPanel = new FlowPanelModel("flowPanel");
  const q = flowPanel.addNewQuestion("text", "q");
  assert.equal(q.getTitleLocation(), "hidden", "Hide for flow layout");
});
QUnit.test("Do not generate rows and do not set renderWidth", function (assert) {
  const flowPanel = new FlowPanelModel("flowPanel");
  const q = flowPanel.addNewQuestion("text", "q");
  assert.equal(flowPanel.rows.length, 0, "There is no rows");
  assert.equal(q.renderWidth, "", "render width is empty");
});
QUnit.test("question.cssRoot class", function (assert) {
  const survey = new SurveyModel();
  setOldTheme(survey);
  const page = survey.addNewPage("p");
  const flowPanel = new FlowPanelModel("flowPanel");
  page.addElement(flowPanel);
  const q1 = flowPanel.addNewQuestion("text", "q1");
  const q2 = page.addNewQuestion("text", "q2");
  assert.equal(q1.cssRoot, "sv_q_flow sv_qstn", "flow question.cssRoot");
  assert.equal(q2.cssRoot, "sv_q sv_qstn", "non flow question.cssRoot");
  q1.titleLocation = "left";
  q2.titleLocation = "left";
  assert.equal(q1.cssRoot, "sv_q_flow sv_qstn", "flow question.cssRoot");
  assert.equal(
    q2.cssRoot,
    "sv_q sv_qstn sv_qstn_left",
    "non flow question.cssRoot"
  );
});
QUnit.test(
  "FlowPanel: checkbox and radiogroup - always keep colCount to 0",
  function (assert) {
    const survey = new SurveyModel();
    const page = survey.addNewPage("p");
    const flowPanel = new FlowPanelModel("flowPanel");
    page.addElement(flowPanel);
    const q1 = <QuestionCheckboxModel>flowPanel.addNewQuestion("checkbox", "q1");
    const q2 = <QuestionRadiogroupModel>(
      flowPanel.addNewQuestion("radiogroup", "q2")
    );
    assert.equal(q1.colCount, 0, "checkbox.colCount is 0 now");
    assert.equal(q2.colCount, 0, "radiogroup.colCount is 0 now");
    const q3 = new QuestionCheckboxModel("q3");
    q3.colCount = 2;
    flowPanel.addElement(q3);
    assert.equal(q3.colCount, 0, "q3.colCount is 0 now");
    q2.colCount = 2;
    assert.equal(q2.colCount, 0, "radiogroup.colCount is still 0");
  }
);
QUnit.test("FlowPanel: support limited number of questions", function (assert) {
  const flowPanel = new FlowPanelModel("flowPanel");
  assert.notOk(flowPanel.addNewPanel("p1"), "We can't add panel");
  assert.notOk(flowPanel.addNewQuestion("matrix", "q1"), "We can't add matrix");
  assert.ok(flowPanel.addNewQuestion("boolean", "q1"), "We can add boolean");
});

QUnit.test(
  "PageModel: isDesignMode && allowShowEmptyTitleInDesignMode",
  function (assert) {
    const survey = new SurveyModel();
    const page = survey.addNewPage("page");
    assert.notOk(page.hasTitle, "Empty title is not visible at runtime");
    assert.notOk(
      page._showDescription,
      "Empty description is not visible at runtime - description"
    );
    survey.setDesignMode(true);
    assert.ok(
      page.hasTitle,
      "Empty title is visible in DesignMode by default"
    );
    assert.ok(
      page._showDescription,
      "Empty description is visible in DesignMode by default"
    );
    settings.allowShowEmptyDescriptionInDesignMode = false;
    assert.ok(
      page.hasTitle,
      "Empty title is visible in DesignMode after description flag"
    );
    assert.notOk(
      page._showDescription,
      "Empty description is not visible in DesignMode after description flag"
    );
    settings.allowShowEmptyDescriptionInDesignMode = true;
    settings.allowShowEmptyTitleInDesignMode = false;
    assert.notOk(
      page.hasTitle,
      "Empty title is not visible at DesignMode after title flag"
    );
    assert.notOk(
      page._showDescription,
      "Empty description is not visible at DesignMode after tile flag"
    );
    page.title = "My title";
    page.description = "My description";
    assert.ok(page.hasTitle, "Entered title is visible in DesignMode");
    assert.ok(
      page._showDescription,
      "Entered description is visible in DesignMode"
    );
    page.title = "";
    page.description = "";
    assert.notOk(page.hasTitle, "No title");
    assert.notOk(page._showDescription, "No description");
  }
);

QUnit.test("Page/Panel.getProgressInfo()", function (assert) {
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
  assert.deepEqual(page.getProgressInfo(), {
    questionCount: 4,
    answeredQuestionCount: 2,
    requiredQuestionCount: 2,
    requiredAnsweredQuestionCount: 2,
  });
});
QUnit.test("Panel.requiredIf", function (assert) {
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
  assert.equal(panel.isRequired, false, "It is not required by default");
  survey.setValue("q1", 1);
  assert.equal(panel.isRequired, true, "q1 is 1");
  survey.setValue("q1", 2);
  assert.equal(panel.isRequired, false, "q1 is 2");
});

QUnit.test("Panel.ensureRowsVisibility", function (assert) {
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
  assert.equal(panel.rows.length, 2);

  panel.rows.forEach((row) => {
    assert.equal(row["_updateVisibility"], undefined);
    assert.equal(row["_scrollableParent"], undefined);
    row["_updateVisibility"] = handler;
  });
  assert.equal(counter, 0);

  panel.ensureRowsVisibility();
  assert.equal(counter, 2);
});

QUnit.test("Panel.startLazyRendering isNeedRender=true", function (assert) {
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
    assert.equal(panel.rows.length, 2);

    panel.rows.forEach((row) => {
      assert.equal(row["_scrollableParent"], undefined);
      assert.equal(row["_updateVisibility"], undefined);
      assert.equal(row.isNeedRender, false);
      const div = document.createElement("div");
      createdDivs.push(div);
      row.startLazyRendering(div, () => {
        return <any>{ scrollHeight: 200, clientHeight: 300 };
      });
      assert.notEqual(row["_scrollableParent"], undefined);
      assert.equal(row["_updateVisibility"], undefined);
      assert.equal(row.isNeedRender, true);

      row.stopLazyRendering();
      assert.equal(row["_scrollableParent"], undefined);
      assert.equal(row["_updateVisibility"], undefined);
      assert.equal(row.isNeedRender, true);
    });
  } finally {
    settings.lazyRowsRenderingStartRow = prevLazyRowsRenderingStartRow;
    createdDivs.forEach(div => div?.remove());
  }
});

QUnit.test("Panel.startLazyRendering isNeedRender=false", function (assert) {
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
    assert.equal(panel.rows.length, 2);

    panel.rows.forEach((row) => {
      assert.equal(row["_scrollableParent"], undefined);
      assert.equal(row["_updateVisibility"], undefined);
      assert.equal(row.isNeedRender, false);
      const div = document.createElement("div");
      createdDivs.push(div);
      row.startLazyRendering(div, () => {
        return <any>{ scrollHeight: 200, clientHeight: 100 };
      });
      assert.notEqual(row["_scrollableParent"], undefined);
      assert.notEqual(row["_updateVisibility"], undefined);
      assert.equal(row.isNeedRender, false);

      row.stopLazyRendering();
      assert.equal(row["_scrollableParent"], undefined);
      assert.equal(row["_updateVisibility"], undefined);
      assert.equal(row.isNeedRender, false);
    });
  } finally {
    settings.lazyRowsRendering = prevLazyRowsRendering;
    settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    createdDivs.forEach(div => div?.remove());
  }
});
QUnit.test("row.isNeedRender & settings.lazyRowsRenderingStartRow", function (
  assert
) {
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
    assert.equal(page.rows.length, 3, "There are 3 rows");
    assert.equal(page.rows[0].isNeedRender, true, "isNeedRender rows[0]");
    assert.equal(page.rows[1].isNeedRender, true, "isNeedRender rows[1]");
    assert.equal(page.rows[2].isNeedRender, false, "isNeedRender rows[2]");
  } finally {
    settings.lazyRowsRendering = prevLazyRowsRendering;
    settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
  }
});
QUnit.test(
  "row.isNeedRender & settings.lazyRowsRenderingStartRow & designMode",
  function (assert) {
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
      assert.equal(page1.rows.length, 3, "There are 3 rows");
      assert.equal(page1.rows[0].isNeedRender, true, "isNeedRender rows[0]");
      assert.equal(page1.rows[1].isNeedRender, true, "isNeedRender rows[1]");
      assert.equal(page1.rows[2].isNeedRender, false, "isNeedRender rows[2]");

      const page2: PageModel = survey.pages[1];
      page2.onFirstRendering();
      assert.equal(page2.rows.length, 1, "There is one row on the second page");
      assert.equal(
        page2.rows[0].isNeedRender,
        false,
        "We do lazy rendering for the second page in design mode"
      );
    } finally {
      settings.lazyRowsRendering = prevLazyRowsRendering;
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  }
);
QUnit.test("row.visibleElements make it reactive", function (assert) {
  const page = new PageModel();
  page.addNewQuestion("text", "q1");
  page.addNewQuestion("text", "q2");
  page.addNewQuestion("text", "q3");
  page.questions[1].startWithNewLine = false;
  page.questions[2].startWithNewLine = false;
  assert.equal(page.rows.length, 1, "We have one row");
  const row = page.rows[0];
  assert.equal(row.elements.length, 3, "We have 3 elements in row");
  assert.equal(row.visibleElements.length, 3, "All elements are visible");
  assert.equal(
    row.getPropertyValue("visibleElements").length,
    3,
    "visibleElements are reactive"
  );
  page.questions[1].visible = false;
  assert.equal(row.visibleElements.length, 2, "Two elements are visible");
  assert.equal(row.visibleElements[0].name, "q1", "First element");
  assert.equal(row.visibleElements[1].name, "q3", "Second element");
  page.removeElement(page.questions[2]);
  assert.equal(row.visibleElements.length, 1, "One element is visible");
  assert.equal(row.visibleElements[0].name, "q1", "First element, #2");
  page.questions[1].visible = true;
  assert.equal(row.visibleElements.length, 2, "Two elements are visible, #3");
  assert.equal(row.visibleElements[0].name, "q1", "First element, #3");
  assert.equal(row.visibleElements[1].name, "q2", "Second element, #3");
});

QUnit.test(
  "row.isNeedRender for dynamically added questions",
  function (assert) {

    const json = {
      "questions": [
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

          "hasSelectAll": true,
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
          "columnLayout": "vertical",
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

      assert.equal(page1.rows.length, 21, "There are 21 rows");
      assert.equal(page1.rows[0].isNeedRender, true, "isNeedRender rows[0]");
      assert.equal(page1.rows[1].isNeedRender, true, "isNeedRender rows[1]");
      assert.equal(page1.rows[2].isNeedRender, false, "isNeedRender rows[2]");
      assert.equal(page1.rows[3].isNeedRender, false, "isNeedRender rows[3]");
      assert.equal(page1.rows[20].isNeedRender, false, "isNeedRender rows[20]");

      page1.addNewQuestion("text", "qN");
      assert.equal(page1.rows.length, 22, "There are 22 rows");
      assert.equal(page1.rows[21].isNeedRender, false, "isNeedRender rows[21]");

      survey["_isDesignMode"] = true;

      page1.addNewQuestion("text", "qN2");
      assert.equal(page1.rows.length, 23, "There are 23 rows");
      assert.equal(page1.rows[22].isNeedRender, true, "isNeedRender rows[22] for creator v2");
    }
    finally {
      settings.lazyRowsRendering = prevLazyRowsRendering;
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  });

QUnit.test(
  "row.isNeedRender for question invisible -> visible",
  function (assert) {
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
      assert.equal(page1.rows.length, 3, "There are 3 rows");
      assert.equal(page1.rows[0].isNeedRender, true, "isNeedRender rows[0]");
      assert.equal(page1.rows[1].isNeedRender, true, "isNeedRender rows[1]");
      assert.equal(page1.rows[2].isNeedRender, false, "isNeedRender rows[2]");

      survey.data = { q1: "a" };

      assert.equal(page1.rows[2].isNeedRender, true, "isNeedRender rows[2]");

    } finally {
      settings.lazyRowsRendering = prevLazyRowsRendering;
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
    }
  }
);
QUnit.test("Panel.actions", function (assert) {
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
  assert.equal(panel.getFooterToolbar().actions.length, 1);
  assert.equal(panel.getFooterToolbar().actions[0].id, "test");
});
QUnit.test("Footer toolbar type", function (assert) {
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
  assert.ok(panel.getFooterToolbar() instanceof ActionContainer);
  panel.allowAdaptiveActions = true;
  panel["footerToolbarValue"] = null;
  assert.ok(panel.getFooterToolbar() instanceof AdaptiveActionContainer);
});
QUnit.test("Check needResponsiveWidth method", function (assert) {
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
  assert.notOk(panel.needResponsiveWidth());
  panel.startWithNewLine = false;
  assert.ok(panel.needResponsiveWidth());
  panel.startWithNewLine = true;
  panel.elements[1].startWithNewLine = false;
  assert.ok(panel.needResponsiveWidth());
});
QUnit.test("Delete a first question in the row", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
      { type: "text", name: "q3", startWithNewLine: false },
    ],
  });
  const page = <PageModel>survey.currentPage;
  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.rows[1].elements.length, 2, "There are two elements in the second row");
  const q2 = <IElement>survey.getQuestionByName("q2");
  const q3 = <IElement>survey.getQuestionByName("q3");
  assert.equal(q3.startWithNewLine, false, "q3 startWithNewLine is false");
  q2.delete();
  assert.equal(page.rows.length, 2, "Still two rows");
  assert.equal(q3.startWithNewLine, true, "q3 startWithNewLine is true");
});
QUnit.test("page.cssRoot check for existings cssStyle.page", function (assert) {
  const survey = new SurveyModel();
  const prevPage = survey.css.page;
  delete survey.css.page;
  const page = new PageModel();
  assert.equal(page.cssRoot, "");
  assert.equal(page.cssTitle, "");
  survey.css.page = prevPage;
});
QUnit.test("Check panel footer actions event", function (assert) {
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
    assert.equal(sender, survey);
    assert.equal(opt.panel, panel);
    assert.equal(opt.question, undefined);
    opt.actions.push({
      id: "test",
      title: "test",
      action: () => { }
    });
  });
  assert.equal(panel.footerActions.length, 0);
  assert.equal(panel["footerToolbarValue"], undefined);

  //panel actions should be created only after footerToolbar is requested

  const actions = panel.getFooterToolbar().actions;

  assert.equal(actions.length, 1);
  assert.equal(actions[0].title, "test");
});
QUnit.test("Expand panel on error in multiple text question", function (assert) {
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
  assert.equal(panel.state, "collapsed", "the panel is collapsed by default");
  survey.tryComplete();
  assert.equal(panel.state, "expanded", "the panel is expanded");
});

QUnit.test("Check panel styles with originalPage", function (assert) {
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

  assert.notOk(panel["getIsNested"]());
  assert.notOk(panel["getHasFrameV2"]());

  assert.notOk(innerPanel["getIsNested"]());
  assert.ok(innerPanel["getHasFrameV2"]());

  assert.ok(panel.rows[0].getRowCss().includes("page_row"));
  assert.notOk(innerPanel.rows[0].getRowCss().includes("page_row"));

  // //check questions styles

  assert.notOk(question["getIsNested"]());
  assert.ok(question["getHasFrameV2"]());

  assert.ok(question2["getIsNested"]());
  assert.notOk(question2["getHasFrameV2"]());
  survey.css = {};
});

QUnit.skip("Check panel styles with originalPage and showPreview", function (assert) {
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

  assert.notOk(panel["getIsNested"]());
  assert.ok(panel["getHasFrameV2"]());

  assert.ok(innerPanel["getIsNested"]());
  assert.notOk(innerPanel["getHasFrameV2"]());

  assert.notOk(panel.rows[0].getRowCss().includes("page_row"));
  assert.notOk(innerPanel.rows[0].getRowCss().includes("page_row"));

  // // //check questions styles

  assert.ok(question["getIsNested"]());
  assert.notOk(question["getHasFrameV2"]());

  assert.ok(question2["getIsNested"]());
  assert.notOk(question2["getHasFrameV2"]());
  survey.css = {};
});
QUnit.test("Render name for collapsed/expanded questions in design-time", function (assert) {
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
  assert.equal(panel.state, "collapsed", "the panel is collapsed");
  assert.equal(panel.hasTitle, true, "We are in design mode and state is not default, #1");
  assert.equal(panel.locTitle.renderedHtml, "panel", "Render name, #1");
  panel.expand();
  assert.equal(panel.state, "expanded", "the panel is expanded");
  assert.equal(panel.hasTitle, true, "We are in design mode and state is not default, #2");
  assert.equal(panel.locTitle.renderedHtml, "panel", "Render name, #2");
  panel.state = "default";
  assert.equal(panel.state, "default", "the panel is not collapsed or expanded");
  assert.equal(panel.hasTitle, false, "We do not render the title");
  assert.notOk(panel.locTitle.renderedHtml, "Render title is empty, #3");
});

QUnit.test("Check updateRowsOnElementAdded: insert on empty page", function (assert) {
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
  assert.equal(page.rows.length, 1);
  assert.equal(page.rows[0].visibleElements.length, 1);
  assert.equal(page.rows[0].visibleElements[0].name, "q1");

});
QUnit.test("Check updateRowsOnElementAdded: insert into page with latest index and swnl: false", function (assert) {
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
  assert.equal(page.rows.length, 1);
  assert.equal(page.rows[0].visibleElements.length, 2);
  assert.equal(page.rows[0].visibleElements[0].name, "q1");
  assert.equal(page.rows[0].visibleElements[1].name, "q2");
});
QUnit.test("Check updateRowsOnElementAdded: insert into page with latest index and swnl: true", function (assert) {
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
  assert.equal(page.rows.length, 2);
  assert.equal(page.rows[0].visibleElements.length, 1);
  assert.equal(page.rows[0].visibleElements[0].name, "q1");
  assert.equal(page.rows[1].visibleElements.length, 1);
  assert.equal(page.rows[1].visibleElements[0].name, "q2");
});
QUnit.test("Check updateRowsOnElementAdded: insert into page with zero index and swnl: false for next element", function (assert) {
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
  assert.equal(page.rows.length, 1);
  assert.equal(page.rows[0].visibleElements.length, 2);
  assert.equal(page.rows[0].visibleElements[0].name, "q2");
  assert.equal(page.rows[0].visibleElements[1].name, "q1");

  survey = new SurveyModel();
  survey.fromJSON(json);
  page = <PageModel>survey.getPageByName("page1");
  question = new QuestionTextModel("q2");
  question.startWithNewLine = false;
  page.addElement(question, 0);
  assert.equal(page.rows.length, 1);
  assert.equal(page.rows[0].visibleElements.length, 2);
  assert.equal(page.rows[0].visibleElements[0].name, "q2");
  assert.equal(page.rows[0].visibleElements[1].name, "q1");
});
QUnit.test("Check updateRowsOnElementAdded: insert into page with zero index and swnl: true for next element", function (assert) {
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
  assert.equal(page.rows.length, 2);
  assert.equal(page.rows[0].visibleElements.length, 1);
  assert.equal(page.rows[0].visibleElements[0].name, "q2");
  assert.equal(page.rows[1].visibleElements.length, 1);
  assert.equal(page.rows[1].visibleElements[0].name, "q1");

  survey = new SurveyModel();
  survey.fromJSON(json);
  page = <PageModel>survey.getPageByName("page1");
  question = new QuestionTextModel("q2");
  question.startWithNewLine = false;
  page.addElement(question, 0);
  assert.equal(page.rows[0].visibleElements.length, 1);
  assert.equal(page.rows[0].visibleElements[0].name, "q2");
  assert.equal(page.rows[1].visibleElements.length, 1);
  assert.equal(page.rows[1].visibleElements[0].name, "q1");
});
QUnit.test("Check updateRowsOnElementAdded method: insert between elements in one row with swnl: false", function (assert) {
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
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);

  let question = new QuestionTextModel("q6");
  question.startWithNewLine = false;
  page.addElement(question, 2);
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q6", "q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);

  question = new QuestionTextModel("q7");
  question.startWithNewLine = false;
  page.addElement(question, 4);
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q6", "q3", "q7", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);
});
QUnit.test("Check updateRowsOnElementAdded method: insert between elements in one row with swnl: true", function (assert) {
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
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);

  let question = new QuestionTextModel("q6");
  question.startWithNewLine = true;
  page.addElement(question, 2);
  assert.equal(page.rows.length, 4);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q6", "q3", "q4"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q5"]);

  question = new QuestionTextModel("q7");
  question.startWithNewLine = true;
  page.addElement(question, 4);
  assert.equal(page.rows.length, 5);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q6", "q3"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q7", "q4"]);
  assert.deepEqual(page.rows[4].visibleElements.map(q => q.name), ["q5"]);
});
QUnit.test("Check updateRowsOnElementAdded method: insert between rows with swnl: false", function (assert) {
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
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);

  let question = new QuestionTextModel("q6");
  question.startWithNewLine = false;
  page.addElement(question, 2);
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2", "q6"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);

  question = new QuestionTextModel("q7");
  question.startWithNewLine = false;
  page.addElement(question, 5);
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2", "q6"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q4", "q7"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);
});
QUnit.test("Check updateRowsOnElementAdded method: insert between rows with swnl: true", function (assert) {
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
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);

  let question = new QuestionTextModel("q6");
  question.startWithNewLine = true;
  page.addElement(question, 2);
  assert.equal(page.rows.length, 4);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q6"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q5"]);

  question = new QuestionTextModel("q7");
  question.startWithNewLine = true;
  page.addElement(question, 5);
  assert.equal(page.rows.length, 5);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q6"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q7"]);
  assert.deepEqual(page.rows[4].visibleElements.map(q => q.name), ["q5"]);
});
QUnit.test("Check swnl changed: change swnl for first element on page", function (assert) {
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

  assert.equal(page.rows.length, 1);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);

  question.startWithNewLine = false;
  assert.equal(page.rows.length, 1);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);

  question.startWithNewLine = true;
  assert.equal(page.rows.length, 1);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
});
QUnit.test("Check swnl changed: change swnl for first element in row", function (assert) {
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

  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);

  question.startWithNewLine = false;
  assert.equal(page.rows.length, 2);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2", "q3", "q4"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q5"]);
});

QUnit.test("Check swnl changed: change swnl for last element in row", function (assert) {
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

  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);

  question.startWithNewLine = true;
  assert.equal(page.rows.length, 4);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q3"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q4"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q5"]);
});

QUnit.test("Check swnl changed: change swnl for middle element in row", function (assert) {
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

  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q3", "q4", "q5", "q6"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q7"]);

  question.startWithNewLine = true;
  assert.equal(page.rows.length, 4);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q3"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q4", "q5", "q6"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q7"]);
});

QUnit.test("Check swnl changed: change swnl for single element in row", function (assert) {
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

  assert.equal(page.rows.length, 4);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q6"]);

  question.startWithNewLine = false;
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q2", "q3", "q4", "q5"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q6"]);
});

QUnit.test("Check insert function: insert in empty page", (assert) => {
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
  assert.equal(page.rows.length, 0);
  page.insertElement(new QuestionTextModel("q1"));
  assert.equal(page.rows.length, 1);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1"]);
});

QUnit.test("Check insert function: insert before first element in row", (assert) => {
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
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5", "q6"]);

  page.insertElement(new QuestionTextModel("q7"), survey.getQuestionByName("q3"), "left");
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q7", "q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5", "q6"]);

  assert.equal(calledBuildRows, 0);
});
QUnit.test("Check insert function: insert after last element in row", (assert) => {
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
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5", "q6"]);

  page.insertElement(new QuestionTextModel("q7"), survey.getQuestionByName("q4"), "right");
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q4", "q7"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5", "q6"]);

  assert.equal(calledBuildRows, 0);
});

QUnit.test("Check insert function: insert between elements in row", (assert) => {
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

  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5", "q6"]);

  page.insertElement(new QuestionTextModel("q7"), survey.getQuestionByName("q3"), "right");
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q7", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5", "q6"]);

  page.insertElement(new QuestionTextModel("q8"), survey.getQuestionByName("q7"), "left");
  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q8", "q7", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5", "q6"]);

  assert.equal(calledBuildRows, 0);

});

QUnit.test("Check insert function: insert between rows", (assert) => {
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

  assert.equal(page.rows.length, 3);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q5", "q6"]);

  page.insertElement(new QuestionTextModel("q7"), survey.getQuestionByName("q4"), "bottom");
  assert.equal(page.rows.length, 4);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q7"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q5", "q6"]);

  page.insertElement(new QuestionTextModel("q8"), survey.getQuestionByName("q3"), "top");
  assert.equal(page.rows.length, 5);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q8"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q7"]);
  assert.deepEqual(page.rows[4].visibleElements.map(q => q.name), ["q5", "q6"]);

  page.insertElement(new QuestionTextModel("q9"), survey.getQuestionByName("q4"), "top");
  assert.equal(page.rows.length, 6);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q8"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q9"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[4].visibleElements.map(q => q.name), ["q7"]);
  assert.deepEqual(page.rows[5].visibleElements.map(q => q.name), ["q5", "q6"]);

  page.insertElement(new QuestionTextModel("q10"), survey.getQuestionByName("q3"), "bottom");
  assert.equal(page.rows.length, 7);
  assert.deepEqual(page.rows[0].visibleElements.map(q => q.name), ["q1", "q2"]);
  assert.deepEqual(page.rows[1].visibleElements.map(q => q.name), ["q8"]);
  assert.deepEqual(page.rows[2].visibleElements.map(q => q.name), ["q9"]);
  assert.deepEqual(page.rows[3].visibleElements.map(q => q.name), ["q3", "q4"]);
  assert.deepEqual(page.rows[4].visibleElements.map(q => q.name), ["q10"]);
  assert.deepEqual(page.rows[5].visibleElements.map(q => q.name), ["q7"]);
  assert.deepEqual(page.rows[6].visibleElements.map(q => q.name), ["q5", "q6"]);

  assert.equal(calledBuildRows, 0);
});
QUnit.test("Do not expand panels on validation that doesn't have an error Bug#8341", function (assert) {
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
  assert.equal(panels[0].isCollapsed, true, "The panel should rename collapsed");
  assert.equal(panels[1].isExpanded, true, "The panel should be expanded, it has error inside, #1");
  assert.equal(panels[2].isExpanded, true, "The panel should be expanded, it has error inside, #2");
  assert.equal(panels[3].isExpanded, true, "The panel should be expanded, it has error inside, #3");
  assert.equal(panels[4].isExpanded, true, "The panel should be expanded, panel is required, #4");
});
QUnit.test("Check if errors disappered in the closest questions on changing the question, checkErrorsMode: 'onValueChanged', Bug#8539", function (assert) {
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
  assert.equal(q1.errors.length, 0, "q1.errors #1");
  assert.equal(q2.errors.length, 1, "q2.errors #1");
  q1.value = 3;
  assert.equal(q1.errors.length, 0, "q1.errors #2");
  assert.equal(q2.errors.length, 0, "q2.errors #2");
  q1.value = 7;
  assert.equal(q1.errors.length, 1, "q1.errors #3");
  assert.equal(q2.errors.length, 0, "q2.errors #3");
  q2.value = 2;
  assert.equal(q1.errors.length, 0, "q1.errors #4");
  assert.equal(q2.errors.length, 0, "q2.errors #4");
});
QUnit.test("Check if errors disappered in the closest questions on changing the question, Bug#8539", function (assert) {
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
  assert.equal(q1.errors.length, 0, "q1.errors #1");
  assert.equal(q2.errors.length, 0, "q2.errors #1");
  assert.equal(survey.tryComplete(), false, "Could not complete");
  assert.equal(q1.errors.length, 1, "q1.errors #2");
  assert.equal(q2.errors.length, 1, "q2.errors #2");
  q1.value = 1;
  assert.equal(q1.errors.length, 0, "q1.errors #3");
  assert.equal(q2.errors.length, 0, "q2.errors #3");
});

QUnit.test("Panel hasTextInTitle - reactive property #8816", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "panel", name: "panel1" },
      { type: "panel", name: "panel2", title: "Panel 2" }
    ]
  });
  const panel1 = survey.getPanelByName("panel1");
  const panel2 = survey.getPanelByName("panel2");
  assert.equal(panel1.hasTextInTitle, false, "panel1 #1, hasTextInTitle");
  assert.equal(panel1.hasTitle, false, "panel1 #1, hasTitle");

  assert.equal(panel2.hasTextInTitle, true, "panel2 #1, hasTextInTitle");
  assert.equal(panel2.hasTextInTitle, true, "panel2 #1, hasTitle");

  panel1.title = "Panel 1";
  assert.equal(panel1.hasTextInTitle, true, "panel1 #2, hasTextInTitle");
  assert.equal(panel1.hasTitle, true, "panel1 #2, hasTitle");

  panel2.title = "";
  assert.equal(panel2.hasTextInTitle, false, "panel2 #2, hasTextInTitle");
  assert.equal(panel2.hasTitle, false, "panel2 #2, hasTitle");
});

QUnit.test("row.isNeedRender for panels", function (assert) {
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
    assert.equal(page1.rows.length, 2, "There are 2 rows");
    assert.equal(page1.rows[0].isNeedRender, true, "isNeedRender page1 rows[0]");
    assert.equal(page1.rows[1].isNeedRender, false, "isNeedRender page1 rows[1]");

    const panel1 = survey.pages[0].elements[0] as PanelModel;
    assert.equal(panel1.rows.length, 2, "There are 2 rows in panel1");
    assert.equal(panel1.rows[0].isNeedRender, false, "isNeedRender panel1 rows[0]");
    assert.equal(panel1.rows[1].isNeedRender, false, "isNeedRender panel1 rows[1]");
  } finally {
    settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
  }
});
QUnit.test("getAllRows for page", function (assert) {
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

    assert.equal(allPageRows.length, 4, "There are 4 rows");
    assert.equal(allPageRows[0].elements[0].name, "panel1");
    assert.equal(allPageRows[1].elements[0].name, "q1");
    assert.equal(allPageRows[2].elements[0].name, "q2");
    assert.equal(allPageRows[3].elements[0].name, "q3");
  } finally {
    settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
  }
});
QUnit.test("forceRenderRows for page", async function (assert) {
  let done = assert.async(1);
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
    assert.equal(allPageRows[0].isNeedRender, true, "isNeedRender for panel");
    assert.equal(allPageRows[1].isNeedRender, false, "isNeedRender for q1");
    assert.equal(allPageRows[2].isNeedRender, false, "isNeedRender for q2");
    assert.equal(allPageRows[3].isNeedRender, false, "isNeedRender for q3");

    page1.forceRenderRows([allPageRows[2], allPageRows[3]], () => {
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
      assert.equal(allPageRows[0].isNeedRender, true, "isNeedRender for panel");
      assert.equal(allPageRows[1].isNeedRender, false, "isNeedRender for q1");
      assert.equal(allPageRows[2].isNeedRender, true, "isNeedRender for q2");
      assert.equal(allPageRows[3].isNeedRender, true, "isNeedRender for q3");
      done();
    });
    survey.getQuestionByName("q2").onElementRerendered.fire({} as any, {});
    survey.getQuestionByName("q3").onElementRerendered.fire({} as any, {});
  } finally {
    settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
  }
});
QUnit.test("forceRenderElement for page the exact element, gap = 0", async function (assert) {
  let done = assert.async(1);
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
    assert.equal(allPageRows[0].isNeedRender, true, "isNeedRender for panel");
    assert.equal(allPageRows[1].isNeedRender, false, "isNeedRender for q1");
    assert.equal(allPageRows[2].isNeedRender, false, "isNeedRender for q2");
    assert.equal(allPageRows[3].isNeedRender, false, "isNeedRender for q3");

    page1.forceRenderElement(survey.getQuestionByName("q3"), () => {
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
      assert.equal(allPageRows[0].isNeedRender, true, "isNeedRender for panel");
      assert.equal(allPageRows[1].isNeedRender, false, "isNeedRender for q1");
      assert.equal(allPageRows[2].isNeedRender, false, "isNeedRender for q2");
      assert.equal(allPageRows[3].isNeedRender, true, "isNeedRender for q3");
      done();
    });
    survey.getQuestionByName("q3").onElementRerendered.fire({} as any, {});
  } finally {
    settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
  }
});
QUnit.test("forceRenderElement for page with one prev element, gap = 1", async function (assert) {
  let done = assert.async(1);
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
    assert.equal(allPageRows[0].isNeedRender, true, "isNeedRender for panel");
    assert.equal(allPageRows[1].isNeedRender, false, "isNeedRender for q1");
    assert.equal(allPageRows[2].isNeedRender, false, "isNeedRender for q2");
    assert.equal(allPageRows[3].isNeedRender, false, "isNeedRender for q3");

    page1.forceRenderElement(survey.getQuestionByName("q3"), () => {
      settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
      assert.equal(allPageRows[0].isNeedRender, true, "isNeedRender for panel");
      assert.equal(allPageRows[1].isNeedRender, false, "isNeedRender for q1");
      assert.equal(allPageRows[2].isNeedRender, true, "isNeedRender for q2");
      assert.equal(allPageRows[3].isNeedRender, true, "isNeedRender for q3");
      done();
    }, 1);
    survey.getQuestionByName("q2").onElementRerendered.fire({} as any, {});
    survey.getQuestionByName("q3").onElementRerendered.fire({} as any, {});
  } finally {
    settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
  }
});
QUnit.test("row.isNeedRender for nested panels", function (assert) {
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
    assert.equal(allPageRows.length, 7, "7 rows with panels");
    assert.equal(allPageRows[0].isNeedRender, true, "isNeedRender for panel1");
    assert.equal(allPageRows[1].isNeedRender, true, "isNeedRender for panel2");
    assert.equal(allPageRows[2].isNeedRender, true, "isNeedRender for panel3");
    assert.equal(allPageRows[3].isNeedRender, false, "isNeedRender for q1");
    assert.equal(allPageRows[4].isNeedRender, false, "isNeedRender for q2");
    assert.equal(allPageRows[5].isNeedRender, false, "isNeedRender for q3");
    assert.equal(allPageRows[6].isNeedRender, false, "isNeedRender for q4");
  } finally {
    settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
  }
});
QUnit.test("row.isNeedRender for nested panels - complex", function (assert) {
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
    assert.equal(allPageRows.length, 7, "7 rows with panels");
    assert.equal(allPageRows[0].elements[0].name, "panel1");
    assert.equal(allPageRows[0].isNeedRender, true, "isNeedRender for panel1");
    assert.equal(allPageRows[1].elements[0].name, "panel2", "panel2 - paneldynamic");
    assert.equal(allPageRows[1].isNeedRender, true, "isNeedRender for panel2");
    assert.equal(allPageRows[2].elements[0].name, "q1");
    // assert.equal(allPageRows[2].isNeedRender, false, "isNeedRender for q1, q2");
    assert.equal(allPageRows[3].elements[0].name, "q3");
    // assert.equal(allPageRows[3].isNeedRender, false, "isNeedRender for q3, q4");
    assert.equal(allPageRows[4].elements[0].name, "panel3");
    assert.equal(allPageRows[4].isNeedRender, true, "isNeedRender for panel3");
    assert.equal(allPageRows[5].elements[0].name, "q5");
    assert.equal(allPageRows[5].isNeedRender, false, "isNeedRender for q5, q6");
    assert.equal(allPageRows[6].elements[0].name, "last-question");
    assert.equal(allPageRows[6].isNeedRender, false, "isNeedRender for q-last");
  } finally {
    settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
  }
});
QUnit.test("row.isNeedRender panel dynamic different modes - ordinary and designer", function (assert) {
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
    assert.equal(allPageRows.length, 5, "7 rows with inner panels in runtime mode");
    assert.equal(allPageRows[0].elements[0].name, "panel1");
    assert.equal(allPageRows[0].isNeedRender, true, "isNeedRender for panel1");
    assert.equal(allPageRows[1].elements[0].name, "q1");
    // assert.equal(allPageRows[1].isNeedRender, false, "isNeedRender for q1, q2");
    assert.equal(allPageRows[2].elements[0].name, "q3");
    // assert.equal(allPageRows[2].isNeedRender, false, "isNeedRender for q3, q4");
    assert.equal(allPageRows[3].elements[0].name, "q1");
    // assert.equal(allPageRows[3].isNeedRender, false, "isNeedRender for q1, q2");
    assert.equal(allPageRows[4].elements[0].name, "q3");
    // assert.equal(allPageRows[4].isNeedRender, false, "isNeedRender for q3, q4");

    survey.setDesignMode(true);
    allPageRows = page1.getAllRows();
    assert.equal(allPageRows.length, 3, "3 rows with inner panels in design mode");
    assert.equal(allPageRows[0].elements[0].name, "panel1");
    assert.equal(allPageRows[0].isNeedRender, true, "isNeedRender for panel1");
    assert.equal(allPageRows[1].elements[0].name, "q1");
    // assert.equal(allPageRows[1].isNeedRender, false, "isNeedRender for q1, q2");
    assert.equal(allPageRows[2].elements[0].name, "q3");
    // assert.equal(allPageRows[2].isNeedRender, false, "isNeedRender for q3, q4");
  } finally {
    settings.lazyRowsRenderingStartRow = prevStartRowInLazyRendering;
  }
});
QUnit.test("Nested pages", function (assert) {
  const survey = new SurveyModel({
    pages: [
      { name: "page1", elements: [{ type: "text", name: "q1" }] },
      { name: "page2", elements: [{ type: "text", name: "q2" }] }
    ]
  });
  const page1 = survey.pages[0];
  assert.equal(page1.isPage, true, "isPage #1");
  assert.equal(page1.isPanel, false, "isPanel #1");
  assert.equal(page1.getTemplate(), "page", "template #1");
  assert.equal(page1.survey.state, "running", "survey state #1");
  const rootPage = new PageModel("p1");
  rootPage.isPageContainer = true;
  rootPage.addElement(page1);
  assert.equal(page1.isPage, false, "isPage #2");
  assert.equal(page1.isPanel, true, "isPanel #2");
  assert.equal(page1.getTemplate(), "panel", "template #2");
  assert.equal(page1.survey.state, "running", "survey state #2");
  page1.parent = null;
  assert.equal(page1.isPage, true, "isPage #3");
  assert.equal(page1.isPanel, false, "isPanel #3");
  assert.equal(page1.getTemplate(), "page", "template #3");
  assert.equal(page1.survey.state, "running", "survey state #3");
  assert.equal(page1.isDisposed, false, "The page is not disposed");
});
QUnit.test("survey.onGetPanelNumber", function (assert) {
  const survey = new SurveyModel({
    showQuestionNumbers: "on",
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
  assert.equal(survey.getPanelByName("panel1").no, "1.", "panel1.no");
  assert.equal(survey.getPanelByName("panel2").no, "1.1.", "panel2.no");
  assert.equal(survey.getPanelByName("panel3").no, "2.", "panel3.no");
  assert.equal(survey.getQuestionByName("q1").no, "1.1.1.", "q1.no");
  assert.equal(survey.getQuestionByName("q2").no, "1.1.2.", "q2.no");
  assert.equal(survey.getQuestionByName("q3").no, "1.2.", "q3.no");
  assert.equal(survey.getQuestionByName("q4").no, "1.3.", "q4.no");
  assert.equal(survey.getQuestionByName("q5").no, "2.1.", "q5.no");
  assert.equal(survey.getQuestionByName("q6").no, "2.2.", "q6.no");
  assert.equal(survey.getQuestionByName("q7").no, "3.", "q7.no");
});

QUnit.test("Check that startWithNewLine doesn't trigger animation", (assert) => {
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
  assert.ok(page.animationAllowed, "check that animation is enabled");
  assert.equal(page.visibleRows.length, 2);
  question2.startWithNewLine = false;
  assert.equal(page.visibleRows.length, 1);
  settings.animationEnabled = false;
});