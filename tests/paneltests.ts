import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { QuestionFactory } from "../src/questionfactory";
import { Question } from "../src/question";
import { PanelModel, QuestionRowModel } from "../src/panel";
import { QuestionTextModel } from "../src/question_text";
import { JsonObject, Serializer } from "../src/jsonobject";
import { FlowPanelModel } from "../src/flowpanel";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { settings } from "../src/settings";

export default QUnit.module("Panel");

QUnit.test("questions-elements synhronization", function (assert) {
  var page = new PageModel();
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
  var page = new PageModel();
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
  var page = new PageModel();
  var jsonObject = new JsonObject();
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
  var page = new PageModel();
  page.addNewQuestion("text", "q1");
  var panel = page.addNewPanel("p1");
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
  var page = new PageModel();
  page.addNewQuestion("text", "q1");
  var panel = page.addNewPanel("p1");
  panel.addNewQuestion("text", "q2_1");
  page.addNewQuestion("text", "q3");
  var list = [];
  page.addQuestionsToList(list);
  assert.equal(list.length, 3, "There are three questions");
});

QUnit.test("load nested panel from json", function (assert) {
  var page = new PageModel();
  var jsonObject = new JsonObject();
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
  var page = new PageModel();
  var q1 = page.addNewQuestion("text", "q1");
  page.addNewQuestion("text", "q2");
  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.rows[0].visible, true, "The first row is visible");
  q1.visible = false;
  assert.equal(page.rows[0].visible, false, "The first row is invisible now");
});

QUnit.test("panel rows generation - startNewLine false", function (assert) {
  var page = new PageModel();
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  q2.startWithNewLine = false;
  assert.equal(page.rows.length, 1, "There is one row");
  assert.equal(page.rows[0].visible, true, "The first row is visible");
  q1.visible = false;
  assert.equal(page.rows[0].visible, true, "The first row is still visible");
  q2.visible = false;
  assert.equal(page.rows[0].visible, false, "The first row is invisible now");
});

QUnit.test("panel rows generation - nested panel", function (assert) {
  var page = new PageModel();
  var q1 = page.addNewQuestion("text", "q1");
  var p1 = page.addNewPanel("p1");
  var p1q1 = p1.addNewQuestion("text", "p1q1");
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
QUnit.test("panel isExpanded and isCollapsed", function (assert) {
  var page = new PageModel();
  var panel = page.addNewPanel("p1");
  var stateChangedCounter = 0;
  panel.stateChangedCallback = function () {
    stateChangedCounter++;
  };
  assert.equal(panel.isCollapsed, false, "Panel is not collapsed by default");
  assert.equal(panel.isExpanded, false, "Panel is not expanded by default");
  assert.equal(panel.processedTitle, "", "Panel title is empty");
  panel.collapse();
  assert.equal(panel.processedTitle, "p1", "Panel title renders name");
  assert.equal(panel.isCollapsed, true, "Panel is collapsed");
  assert.equal(stateChangedCounter, 1, "callback is called one time");
  panel.expand();
  assert.equal(panel.isExpanded, true, "Panel is expanded");
  assert.equal(stateChangedCounter, 2, "callback is called two time");
});
QUnit.test("Expand panel on validation error", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel1 = page.addNewPanel("p1");
  panel1.collapse();
  var panel2 = panel1.addNewPanel("p2");
  panel2.collapse();
  var question = <Question>panel2.addNewQuestion("text", "q1");
  question.isRequired = true;
  assert.equal(panel1.isCollapsed, true, "Panel1 is collapsed");
  assert.equal(panel2.isCollapsed, true, "Panel2 is collapsed");
  page.hasErrors(true, true);
  assert.equal(panel1.isCollapsed, false, "Panel1 is not collapsed");
  assert.equal(panel2.isCollapsed, false, "Panel2 is not collapsed");
});
QUnit.test("Panel.isRequired", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("p1");
  var panel2 = page.addNewPanel("p2");
  var q1 = <Question>panel.addNewQuestion("text", "q1");
  var q2 = <Question>panel.addNewQuestion("text", "q2");
  assert.equal(panel.hasErrors(), false, "There is no errors");
  panel.isRequired = true;
  assert.equal(panel.hasErrors(), true, "All questions are empty");
  assert.equal(panel.errors.length, 1, "One error");
  q1.value = "1";
  assert.equal(panel.hasErrors(), false, "The first question is not empty");
  panel2.isRequired = true;
  assert.equal(
    panel.hasErrors(),
    false,
    "There is no visible questions in the panel"
  );
});

QUnit.test("Panel with paneldynamic error focus", function (assert) {
  var json = {
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
  var survey = new SurveyModel(json);
  var rec = {
    focuseOnFirstError: true,
    firstErrorQuestion: <any>null,
  };
  var panel = survey.getPanelByName("p1");

  survey.isCurrentPageHasErrors;
  panel["hasErrorsCore"](rec);

  assert.equal(
    rec.firstErrorQuestion.name,
    "textinpd",
    "scroll to first question in the dynamicpanel instead of dynamicpanel itself"
  );
});

QUnit.test(
  "Required panel error focus/not focus - T3101 - Stop focus when page has error",
  function (assert) {
    var json = {
      elements: [
        { type: "checkbox", name: "chk0" },
        {
          name: "p1",
          type: "panel",
          isRequired: true,
          elements: [
            { type: "checkbox", name: "chk1", isRequired: true },
            {
              type: "panel",
              name: "panel",
              elements: [
                { type: "checkbox", name: "textinpd", isRequired: true },
              ],
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var page = survey.currentPage;

    var rec = {
      focuseOnFirstError: true,
      firstErrorQuestion: <any>null,
    };
    page.hasErrors(true, true, rec);
    assert.equal(
      rec.firstErrorQuestion.name,
      "chk1",
      "scroll to first question in the dynamicpanel instead of dynamicpanel itself"
    );

    var rec = {
      focuseOnFirstError: false,
      firstErrorQuestion: <any>null,
    };
    page.hasErrors(true, false, rec);
    assert.equal(
      !rec.firstErrorQuestion,
      true,
      "don't scroll to question - T3101 - Stop focus when page has error"
    );
  }
);

QUnit.test("Panel.getValue()", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel1 = page.addNewPanel("p1");
  var panel2 = page.addNewPanel("p2");
  var panel3 = panel1.addNewPanel("p3");
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
  var survey = new SurveyModel({
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
  var question = <QuestionCheckboxModel>survey.getQuestionByName("spread");
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
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel1 = page.addNewPanel("p1");
  var panel2 = page.addNewPanel("p2");
  var panel3 = panel1.addNewPanel("p3");
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
  var survey = new SurveyModel();
  var page1 = survey.addNewPage("page1");
  var panel1 = page1.addNewPanel("p1");
  var panel2 = page1.addNewPanel("p2");

  var page2 = survey.addNewPage("page2");
  var panel3 = page2.addNewPanel("p3");

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
  var survey = new SurveyModel({
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
  var page = survey.pages[0];
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

QUnit.test("Flow Panel, add new element/remove element", function (assert) {
  var panel = new FlowPanelModel("p");
  panel.addNewQuestion("text", "q1");
  assert.equal(panel.content, "{element:q1}", "element was added into content");
  panel.removeElement(panel.elements[0]);
  assert.equal(panel.content, "", "element is removed from content");
});

QUnit.test("getLayoutType()", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var q1 = page.addNewQuestion("text", "q1");
  var flowPanel = new FlowPanelModel("flowPanel");
  page.addElement(flowPanel);
  var panel = page.addNewPanel("panel");
  var q2 = panel.addNewQuestion("text", "q2");
  var q3 = flowPanel.addNewQuestion("text", "q3");

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
  var flowPanel = new FlowPanelModel("flowPanel");
  var q = flowPanel.addNewQuestion("text", "q");
  assert.equal(q.getTitleLocation(), "hidden", "Hide for flow layout");
});
QUnit.test("Do not generate rows and do not set renderWidth", function (
  assert
) {
  var flowPanel = new FlowPanelModel("flowPanel");
  var q = flowPanel.addNewQuestion("text", "q");
  assert.equal(flowPanel.rows.length, 0, "There is no rows");
  assert.equal(q.renderWidth, "", "render width is empty");
});
QUnit.test("question.cssRoot class", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p");
  var flowPanel = new FlowPanelModel("flowPanel");
  page.addElement(flowPanel);
  var q1 = flowPanel.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
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
    var survey = new SurveyModel();
    var page = survey.addNewPage("p");
    var flowPanel = new FlowPanelModel("flowPanel");
    page.addElement(flowPanel);
    var q1 = <QuestionCheckboxModel>flowPanel.addNewQuestion("checkbox", "q1");
    var q2 = <QuestionRadiogroupModel>(
      flowPanel.addNewQuestion("radiogroup", "q2")
    );
    assert.equal(q1.colCount, 0, "checkbox.colCount is 0 now");
    assert.equal(q2.colCount, 0, "radiogroup.colCount is 0 now");
    var q3 = new QuestionCheckboxModel("q3");
    q3.colCount = 2;
    flowPanel.addElement(q3);
    assert.equal(q3.colCount, 0, "q3.colCount is 0 now");
    q2.colCount = 2;
    assert.equal(q2.colCount, 0, "radiogroup.colCount is still 0");
  }
);
QUnit.test("FlowPanel: support limited number of questions", function (assert) {
  var flowPanel = new FlowPanelModel("flowPanel");
  assert.notOk(flowPanel.addNewPanel("p1"), "We can't add panel");
  assert.notOk(flowPanel.addNewQuestion("matrix", "q1"), "We can't add matrix");
  assert.ok(flowPanel.addNewQuestion("boolean", "q1"), "We can add boolean");
});

QUnit.test(
  "PageModel: isDesignMode && allowShowEmptyTitleInDesignMode",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("page");
    assert.notOk(page._showTitle, "Empty title is not visible at runtime");
    assert.notOk(
      page._showDescription,
      "Empty title is not visible at runtime - description"
    );
    survey.setDesignMode(true);
    assert.ok(
      page._showTitle,
      "Empty title is visible in DesignMode by default"
    );
    assert.ok(
      page._showDescription,
      "Empty description is visible in DesignMode by default"
    );
    settings.allowShowEmptyTitleInDesignMode = false;
    assert.notOk(
      page._showTitle,
      "Empty title is not visible at DesignMode after flag"
    );
    assert.notOk(
      page._showDescription,
      "Empty description is not visible at DesignMode after flag"
    );
    page.title = "My title";
    page.description = "My description";
    assert.ok(page._showTitle, "Entered title is visible in DesignMode");
    assert.ok(
      page._showDescription,
      "Entered description is visible in DesignMode"
    );
  }
);

QUnit.test("QuestionRowModel setElementMaxMinWidth", function (assert) {
  var qrm = new QuestionRowModel((<any>{ areInvisibleElementsShowing: false }));

  var el1: any = { width: "100px" };
  qrm.setElementMaxMinWidth(el1);
  assert.equal(el1.minWidth, "100px", "minWidth in 'px' is set");
  assert.equal(el1.maxWidth, "100px", "maxWidth in 'px' is set");

  var el2: any = { width: "20%" };
  qrm.setElementMaxMinWidth(el2);
  assert.equal(el2.minWidth, "300px", "minWidth in '%' is default");
  assert.equal(el2.maxWidth, "initial", "maxWidth in '%' is default");
});
