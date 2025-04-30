import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { PanelModel } from "../src/panel";
import { Question } from "../src/question";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionSingleInputSummary } from "../src/questionSingleInputSummary";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { Serializer } from "../src/jsonobject";

export default QUnit.module("Input Per Page Tests");

function getSingleQuestion(page: PageModel): Question {
  if (page.visibleRows.length === 0) return <any>undefined;
  const q = <Question>page.visibleRows[0].elements[0];
  return q.singleInputQuestion || q;
}

QUnit.test("singleInput should work the same as singleQuestion for standard questions", assert => {
  const survey = new SurveyModel({
    questionsOnPageMode: "inputPerPage",
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" }
    ]
  });
  assert.equal(survey.isSingleVisibleQuestion, true, "one question per page");
  const page: PageModel = survey.currentPage;
  assert.equal(survey.currentSingleQuestion.name, "q1", "currentSingleQuestion is q1");
  assert.equal(page.visibleRows.length, 1, "Just one visible row");
  assert.equal(page.visibleRows[0].elements[0].name, "q1", "visible question is q1");
  assert.equal(getSingleQuestion(page).name, "q1", "getSingleQuestion is q1");
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "q2", "currentSingleQuestion is q2");
  assert.equal(page.visibleRows[0].elements[0].name, "q2", "visible question is q2");
  assert.equal(getSingleQuestion(page).name, "q2", "getSingleQuestion is q2");
});
QUnit.test("singleInput works in designer as standard", assert => {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    questionsOnPageMode: "inputPerPage",
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" }
    ]
  });
  const page: PageModel = survey.currentPage;
  assert.notOk(survey.currentSingleQuestion?.name, "currentSingleQuestion is undefined");
  assert.equal(page.visibleRows.length, 2, "There are two rows");
  assert.equal(page.visibleRows[0].elements[0].name, "q1", "visible question is q1");
  assert.equal(page.visibleRows[1].elements[0].name, "q2", "visible question is q2");
});
QUnit.test("singleInput for panel dynamic", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1", title: "Root Panel",
        displayMode: "tab",
        panelCount: 1,
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }
        ]
      },
      { type: "text", name: "q3" }
    ],
    questionsOnPageMode: "inputPerPage",
  });
  survey.css = { question: { nested: "q-nested", withFrame: "q-frame" } };
  assert.equal(survey.isSingleVisibleInput, true, "isSingleVisibleInput is true");
  const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
  assert.equal(panel.panelCount, 1, "panelCount is 1");
  assert.equal(panel.panels.length, 1, "There is one panel");
  const page: PageModel = survey.currentPage;
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #1");
  let el = page.visibleRows[0].elements[0];
  assert.equal(el.name, "panel1", "page visible row is panel1, #1");
  assert.equal(panel.singleInputQuestion.name, "q1", "singleInputQuestion, #1.1");
  panel.singleInputQuestion.value = "a";
  survey.performNext();
  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "panel1", "singleInputQuestion, #1");
  assert.equal(panel.isRenderModeTab, false, "isRenderModeTab, #1");
  const rootCss = panel.singleInputQuestion.getRootCss();
  assert.equal(rootCss.indexOf("q-frame") > -1, false, "rootCss has q-frame, #1");
  assert.equal(rootCss.indexOf("q-nested") > -1, false, "rootCss has q-nested, #1");
  assert.equal(panel.locRenderedTitle.textOrHtml, "Root Panel", "panel title, #1");
  assert.ok(panel.singleInputSummary, "wrapper panel title, #1");

  panel.singleInputSummary.items[0].btnEdit.action();
  el = <PanelModel>page.visibleRows[0].elements[0];
  assert.equal(el.name, "panel1", "page visible row is panel1, #2");
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #2.1");
  assert.equal(panel.singleInputQuestion.name, "q1", "singleInputQuestion, #2.1");
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Panel 1", "wrapper panel single title, #2.1");
  assert.equal(panel.locRenderedTitle.textOrHtml, "Panel 1", "wrapper panel title, #2.1");

  survey.performNext();
  el = <PanelModel>page.visibleRows[0].elements[0];
  assert.equal(el.name, "panel1", "page visible row is panel1, #2.2");
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #2.2");
  assert.equal(panel.singleInputQuestion.name, "q2", "singleInputQuestion, #2.2");

  survey.performPrevious();
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #3");
  assert.equal(panel.singleInputQuestion.name, "q1", "singleInputQuestion, #3");

  survey.performNext();
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #4");
  assert.equal(panel.singleInputQuestion.name, "panel1", "singleInputQuestion, #4");

  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "q3", "currentSingleQuestion is q3, #5");
  assert.notOk(survey.getQuestionByName("q3").singleInputQuestion?.name, "singleInputQuestion, #5");
});
QUnit.test("singleInput and navigation buttons visibilty", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 1,
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
          { type: "text", name: "q3" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage",
  });
  const panel = survey.getQuestionByName("panel1");
  assert.equal(panel.singleInputQuestion.name, "q1", "singleInputQuestion, #0.1");
  panel.singleInputQuestion.value = "a";
  survey.performNext();
  survey.performNext();
  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "panel1", "singleInputQuestion, #0");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #0");
  assert.equal(survey.isShowNextButton, false, "next buttton, #0");
  assert.equal(survey.isCompleteButtonVisible, true, "complete buttton, #0");
  panel.singleInputSummary.items[0].btnEdit.action();
  assert.equal(panel.singleInputQuestion.name, "q1", "singleInputQuestion, #1");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #1");
  assert.equal(survey.isShowNextButton, true, "next buttton, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #1");
  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "q2", "singleInputQuestion, #2");
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #2");
  assert.equal(survey.isShowNextButton, true, "next buttton, #2");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #2");
  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "q3", "singleInputQuestion, #3");
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #3");
  assert.equal(survey.isShowNextButton, true, "next buttton, #3");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #3");
  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "panel1", "singleInputQuestion, #4");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #4");
  assert.equal(survey.isShowNextButton, false, "next buttton, #4");
  assert.equal(survey.isCompleteButtonVisible, true, "complete buttton, #4");
  panel.singleInputSummary.items[0].btnEdit.action();
  survey.performNext();
  survey.performNext();
  assert.equal(panel.singleInputQuestion?.name, "q3", "singleInputQuestion, #5");
  survey.performPrevious();
  assert.equal(panel.singleInputQuestion.name, "q2", "singleInputQuestion, #6");
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #6");
  assert.equal(survey.isShowNextButton, true, "next buttton, #6");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #6");
  survey.performPrevious();
  assert.equal(panel.singleInputQuestion.name, "q1", "singleInputQuestion, #7");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #7");
  assert.equal(survey.isShowNextButton, true, "next buttton, #7");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #7");
});
QUnit.test("singleInput and navigation buttons visibilty & visibleIf", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 1,
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2", visibleIf: "{panel.q1} notempty" },
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage",
  });
  const panel1 = survey.getQuestionByName("panel1");
  const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
  assert.equal(panel1.singleInputQuestion.name, "q1", "singleInputQuestion, #1");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #1");
  assert.equal(survey.isShowNextButton, true, "next buttton, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #1");
  assert.equal(addBtn.visible, false, "addBtn visible #1, panel is empty");
  panel1.singleInputQuestion.value = "a";
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #2");
  assert.equal(survey.isShowNextButton, true, "next buttton, #2");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #2");
  assert.equal(addBtn.visible, false, "addBtn visible #2");
  survey.performNext();
  assert.equal(panel1.singleInputQuestion.name, "q2", "singleInputQuestion, #3");
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #3");
  assert.equal(survey.isShowNextButton, true, "next buttton, #3");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #3");
  assert.equal(addBtn.visible, false, "addBtn visible #3");
  survey.performNext();
  assert.equal(panel1.singleInputQuestion.name, "panel1", "singleInputQuestion, #4");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #4");
  assert.equal(survey.isShowNextButton, false, "next buttton, #4");
  assert.equal(survey.isCompleteButtonVisible, true, "complete buttton, #4");
  assert.equal(addBtn.visible, true, "addBtn visible #4");
});
QUnit.test("singleInput and panel dynamic with templateTitle", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 2,
        templateTitle: "Item: {panelIndex} - {panel.q1}",
        templateElements: [
          { type: "text", name: "q1" },
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage",
  });
  const panel = survey.getQuestionByName("panel1");
  assert.equal(panel.singleInputQuestion.name, "q1", "The q1 is in the row, #1");
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Item: 1 - ", "wrapper panel single title, #1.1");
  assert.equal(panel.locRenderedTitle.textOrHtml, "Item: 1 - ", "wrapper panel title, #1.1");
  let q1 = panel.singleInputQuestion;
  q1.value = "abc";
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Item: 1 - abc", "wrapper panel single title, #1.2");
  assert.equal(panel.locRenderedTitle.textOrHtml, "Item: 1 - abc", "wrapper panel title, #1.2");
  survey.performNext();
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Item: 2 - ", "wrapper panel single title, #2.2");
  assert.equal(panel.locRenderedTitle.textOrHtml, "Item: 2 - ", "wrapper panel title, #2.2");
  q1 = panel.singleInputQuestion;
  q1.value = "edf";
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Item: 2 - edf", "wrapper panel single title, #2.2");
  assert.equal(panel.locRenderedTitle.textOrHtml, "Item: 2 - edf", "wrapper panel title, #2.2");
  survey.performNext();

  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #3");
  assert.equal(panel.singleInputQuestion.name, "panel1", "show summary, #3");
  assert.equal(panel.locRenderedTitle.textOrHtml, "panel1", "panel title, #3");
  panel.singleInputSummary.items[0].btnEdit.action();
  assert.equal(panel.singleInputQuestion.name, "q1", "The q1 is in the row, #4");
  survey.performNext();
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #5");
  assert.equal(panel.singleInputQuestion.name, "panel1", "show summary, #5");
  assert.equal(panel.locRenderedTitle.textOrHtml, "panel1", "panel title, #5");
  panel.singleInputSummary.items[1].btnEdit.action();
  assert.equal(panel.singleInputQuestion.name, "q1", "The q1 is in the row, #6");
});
QUnit.test("singleInput and panel dynamic & add panels in navigation bar", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 2,
        templateElements: [
          { type: "text", name: "q1", defaultValue: "val1" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const panel1 = survey.getQuestionByName("panel1");
  const bar = survey.navigationBar;
  assert.ok(bar.getActionById("sv-singleinput-add"), "addBtn exists, #1");
  assert.equal(panel1.singleInputQuestion.name, "panel1", "singleInputQuestion, #1");
  survey.questionsOnPageMode = "standard";
  assert.notOk(bar.getActionById("sv-singleinput-add")?.id, "addBtn exists, #2");
  assert.equal(survey.currentSingleQuestion?.name, undefined, "currentSingleQuestion #2");
  assert.equal(panel1.singleInputQuestion?.name, undefined, "singleInputQuestion, #2");
  survey.questionsOnPageMode = "inputPerPage";
  assert.equal(panel1.singleInputQuestion.name, "panel1", "singleInputQuestion, #3");
  const addBtn = bar.getActionById("sv-singleinput-add");
  assert.ok(addBtn, "addBtn exists, #3");
  panel1.singleInputSummary.items[0].btnEdit.action();
  assert.equal(addBtn.visible, false, "addBtn visible #1");
  survey.performNext();
  assert.equal(addBtn.visible, true, "addBtn visible #2");
  addBtn.action();
  assert.equal(panel1.panelCount, 3, "New panel is added, #3");
  assert.equal(addBtn.visible, false, "addBtn visible #3");
  panel1.singleInputRemoveItem();
  assert.equal(panel1.panelCount, 2, "Last panel is removed");
  assert.equal(addBtn.visible, false, "addBtn visible #4");
  survey.performNext();
  assert.equal(addBtn.visible, true, "addBtn visible #5");
});
QUnit.test("singleInput and panel dynamic & empty panel/add panel/remove panel", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const panel1 = survey.getQuestionByName("panel1");
  assert.equal(panel1.panelCount, 0, "panelCount #1");
  const bar = survey.navigationBar;
  const addBtn = bar.getActionById("sv-singleinput-add");
  const page: PageModel = survey.currentPage;
  assert.equal(addBtn.visible, true, "addBtn visible #1");
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion, #1");
  assert.equal(page.visibleRows.length, 1, "Just one visible row, #1");
  assert.equal(page.visibleRows[0].elements[0].name, "panel1", "visible question in row, #1");
  assert.equal(panel1.singleInputQuestion.name, "panel1", "singleInputQuestion, #1");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #1");
  assert.equal(survey.isShowNextButton, false, "next buttton, #1");
  panel1.addPanelUI();
  assert.equal(panel1.panelCount, 1, "panelCount #2");
  assert.equal(addBtn.visible, false, "addBtn visible #2");
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion, #2");
  assert.equal(panel1.singleInputQuestion.name, "q1", "singleInputQuestion, #2");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #2");
  assert.equal(survey.isShowNextButton, true, "next buttton, #2");
  panel1.singleInputRemoveItem();
  assert.equal(panel1.panelCount, 0, "panelCount #3");
  assert.equal(addBtn.visible, true, "addBtn visible #3");
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion, #3");
  assert.equal(page.visibleRows.length, 1, "Just one visible row, #3");
  assert.equal(page.visibleRows[0].elements[0].name, "panel1", "visible question in row, #3");
  assert.equal(panel1.singleInputQuestion.name, "panel1", "singleInputQuestion, #3");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #3");
  assert.equal(survey.isShowNextButton, false, "next buttton, #3");
});
QUnit.test("singleInput and panel dynamic & validation", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 1,
        templateElements: [
          { type: "text", name: "q1", isRequired: true },
          { type: "text", name: "q2", isRequired: true }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const panel1 = survey.getQuestionByName("panel1");
  assert.equal(panel1.panelCount, 1, "panelCount #1");
  const bar = survey.navigationBar;
  const addBtn = bar.getActionById("sv-singleinput-add");
  const page: PageModel = survey.currentPage;
  assert.equal(addBtn.visible, false, "addBtn visible #1");
  assert.equal(getSingleQuestion(page).name, "q1", "getSingleQuestion is q1");
  assert.equal(panel1.singleInputLocTitle.textOrHtml, "Panel 1", "wrapper panel title, #1");
  assert.equal(survey.performNext(), false, "next #2");
  assert.equal(getSingleQuestion(page).name, "q1", "getSingleQuestion is q1, #2");
  assert.equal(getSingleQuestion(page).errors.length, 1, "getSingleQuestion errors, #2");
  getSingleQuestion(page).value = "a";
  assert.equal(survey.performNext(), true, "next #3");
  assert.equal(getSingleQuestion(page).name, "q2", "getSingleQuestion is q2, #3");
  assert.equal(addBtn.visible, false, "addBtn visible #3");
  survey.performNext();
  addBtn.action();
  assert.equal(getSingleQuestion(page).name, "q2", "getSingleQuestion is q2, #4");
  assert.equal(getSingleQuestion(page).errors.length, 1, "getSingleQuestion errors, #4");
  assert.equal(addBtn.visible, false, "addBtn visible #4");
  getSingleQuestion(page).value = "b";
  survey.performNext();
  addBtn.action();
  assert.equal(getSingleQuestion(page).name, "q1", "getSingleQuestion is q1, #5");
  assert.equal(addBtn.visible, false, "addBtn visible #5");
  assert.equal(panel1.panelCount, 2, "panelCount #5");
  assert.equal(panel1.singleInputLocTitle.textOrHtml, "Panel 2", "wrapper panel title, #2");
  getSingleQuestion(page).value = "c";
  survey.performNext();
  getSingleQuestion(page).value = "d";
  assert.equal(survey.tryComplete(), true, "compete");
  assert.deepEqual(survey.data, { panel1: [{ q1: "a", q2: "b" }, { q1: "c", q2: "d" }] }, "survey.data");
});
QUnit.test("singleInput and focus on errors", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 1,
        templateElements: [
          { type: "text", name: "q1", isRequired: true },
          { type: "text", name: "q2", isRequired: true }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const panel1 = survey.getQuestionByName("panel1");
  assert.equal(panel1.panelCount, 1, "panelCount #1");
  assert.equal(panel1.singleInputQuestion.name, "q1", "singleInputQuestion, #0");
  survey.validate(true, true);
  assert.equal(panel1.singleInputQuestion.name, "q1", "singleInputQuestion, #1");
  panel1.singleInputQuestion.value = "a";
  survey.validate(true, true);
  assert.equal(panel1.singleInputQuestion.name, "q2", "singleInputQuestion, #2");
  panel1.singleInputQuestion.value = "b";
  survey.performNext();
  panel1.addPanel();
  survey.validate(true, true);
  assert.equal(panel1.singleInputQuestion.name, "q1", "singleInputQuestion, #4");
  panel1.singleInputQuestion.value = "c";
  survey.validate(true, true);
  assert.equal(panel1.singleInputQuestion.name, "q2", "singleInputQuestion, #5");
  panel1.singleInputQuestion.value = "d";
  survey.performNext();
  assert.equal(survey.tryComplete(), true, "compete");
  assert.deepEqual(survey.data, { panel1: [{ q1: "a", q2: "b" }, { q1: "c", q2: "d" }] }, "survey.data");
});
QUnit.test("singleInput and focus on errors on singleInputAddItem & tryComplete", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 1,
        templateElements: [
          { type: "text", name: "q1", isRequired: true },
          { type: "text", name: "q2", isRequired: true }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const panel1 = survey.getQuestionByName("panel1");
  assert.equal(panel1.panelCount, 1, "panelCount #1");
  assert.equal(panel1.singleInputQuestion.name, "q1", "singleInputQuestion, #1");
  const errQuestion = panel1.singleInputQuestion;
  errQuestion.value = "a";
  assert.equal(errQuestion.errors.length, 0, "singleInputQuestion, #1.1");
  survey.validate(true, true);
  assert.equal(panel1.singleInputQuestion.name, "q2", "singleInputQuestion, #2");
  panel1.singleInputQuestion.value = "b";
  survey.performNext();
  panel1.singleInputAddItem();
  survey.tryComplete();
  assert.equal(panel1.singleInputQuestion.name, "q1", "singleInputQuestion, #4");
  panel1.singleInputQuestion.value = "c";
  survey.tryComplete();
  assert.equal(panel1.singleInputQuestion.name, "q2", "singleInputQuestion, #5");
  panel1.singleInputQuestion.value = "d";
  survey.performNext();
  assert.equal(survey.tryComplete(), true, "compete");
  assert.deepEqual(survey.data, { panel1: [{ q1: "a", q2: "b" }, { q1: "c", q2: "d" }] }, "survey.data");
});
QUnit.test("singleInput and focus on errors on singleInputAddItem & tryComplete for matrix dynamic", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic", name: "matrix",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "q1", isRequired: true },
          { cellType: "text", name: "q2", isRequired: true }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const matrix = survey.getQuestionByName("matrix");
  assert.equal(matrix.singleInputQuestion.name, "matrix", "singleInputQuestion, #0");
  matrix.singleInputAddItem(true);
  assert.equal(matrix.singleInputQuestion.name, "q1", "singleInputQuestion, #1");
  matrix.singleInputQuestion.value = "a";
  assert.equal(matrix.singleInputQuestion.errors.length, 0, "singleInputQuestion, #1.1");
  survey.tryComplete();
  assert.equal(matrix.singleInputQuestion.name, "q2", "singleInputQuestion, #2");
  assert.equal(matrix.singleInputQuestion.errors.length, 1, "singleInputQuestion, #2");
  matrix.singleInputQuestion.value = "b";
  assert.equal(matrix.singleInputQuestion.errors.length, 0, "singleInputQuestion, #2.1");
  survey.performNext();
  matrix.singleInputAddItem();
  assert.equal(matrix.rowCount, 2, "rowCount #2");
  survey.tryComplete();
  assert.equal(matrix.singleInputQuestion.name, "q1", "singleInputQuestion, #4");
  matrix.singleInputQuestion.value = "c";
  survey.tryComplete();
  assert.equal(matrix.singleInputQuestion.name, "q2", "singleInputQuestion, #5");
  matrix.singleInputQuestion.value = "d";
  survey.performNext();
  assert.equal(survey.tryComplete(), true, "compete");
  assert.deepEqual(survey.data, { matrix: [{ q1: "a", q2: "b" }, { q1: "c", q2: "d" }] }, "survey.data");
});
QUnit.test("singleInput and matrix dropdown", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown", name: "matrix1",
        columns: [
          { cellType: "text", name: "col1", title: "Column 1" },
          { cellType: "text", name: "col2", title: "Column 2" }
        ],
        rows: [{ value: "row1", text: "Row 1" }, "Row 2"]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const matrix1 = survey.getQuestionByName("matrix1");
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion.name, #1");
  assert.equal(matrix1.singleInputQuestion.title, "Column 1", "singleInputQuestion.title, #1");
  assert.equal(matrix1.singleInputLocTitle.textOrHtml, "Row 1", "singleInputLocTitle, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #1");
  survey.performNext();
  assert.equal(matrix1.singleInputQuestion.name, "col2", "singleInputQuestion.name, #2");
  assert.equal(matrix1.singleInputQuestion.title, "Column 2", "singleInputQuestion.title, #2");
  assert.equal(matrix1.singleInputLocTitle.textOrHtml, "Row 1", "singleInputLocTitle, #2");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #2");
  survey.performNext();
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion.name, #3");
  assert.equal(matrix1.singleInputQuestion.title, "Column 1", "singleInputQuestion.title, #3");
  assert.equal(matrix1.singleInputLocTitle.textOrHtml, "Row 2", "singleInputLocTitle, #3");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #3");
  survey.performNext();
  assert.equal(matrix1.singleInputQuestion.name, "col2", "singleInputQuestion.name, #4");
  assert.equal(matrix1.singleInputQuestion.title, "Column 2", "singleInputQuestion.title, #4");
  assert.equal(matrix1.singleInputLocTitle.textOrHtml, "Row 2", "singleInputLocTitle, #4");
  assert.equal(survey.isCompleteButtonVisible, true, "isCompleteButtonVisible #4");
});
QUnit.test("singleInput and matrix dynamic", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic", name: "matrix1",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "col1", title: "Column 1" },
          { cellType: "text", name: "col2", title: "Column 2" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
  assert.equal(matrix1.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #0");
  assert.equal(survey.isCompleteButtonVisible, true, "isCompleteButtonVisible #0");
  matrix1.addRow();
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion.name, #1");
  assert.equal(matrix1.singleInputQuestion.title, "Column 1", "singleInputQuestion.title, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #1");
  matrix1.singleInputQuestion.value = "a";
  survey.performNext();
  assert.equal(matrix1.singleInputQuestion.name, "col2", "singleInputQuestion.name, #2");
  assert.equal(matrix1.singleInputQuestion.title, "Column 2", "singleInputQuestion.title, #2");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #2");
  assert.equal(matrix1.rowCount, 1, "rowCount #2");
  survey.performNext();
  assert.equal(matrix1.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #3");
  assert.equal(survey.isCompleteButtonVisible, true, "isCompleteButtonVisible #3");
  matrix1.removeRow(0);
  assert.equal(matrix1.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #4");
  assert.equal(survey.isCompleteButtonVisible, true, "isCompleteButtonVisible #4");
  matrix1.addRow();
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion.name, #5");
  assert.equal(matrix1.singleInputQuestion.title, "Column 1", "singleInputQuestion.title, #5");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #5");
});
QUnit.test("singleInput and matrix dynamic & add/remove rows in navigation bar", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic", name: "matrix1",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "col1", defaultValue: "val1" },
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const matrix1 = survey.getQuestionByName("matrix1");
  const bar = survey.navigationBar;
  assert.equal(matrix1.singleInputQuestion.name, "matrix1", "singleInputQuestion is empty, #1");
  matrix1.addRow();
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion, #1");
  assert.ok(bar.getActionById("sv-singleinput-add"), "addBtn exists, #1");
  survey.questionsOnPageMode = "standard";
  assert.notOk(bar.getActionById("sv-singleinput-add"), "addBtn exists, #2");
  assert.equal(survey.currentSingleQuestion?.name, undefined, "currentSingleQuestion #2");
  assert.equal(matrix1.singleInputQuestion?.name, undefined, "singleInputQuestion, #2");
  matrix1.rowCount = 0;
  survey.questionsOnPageMode = "inputPerPage";
  assert.equal(matrix1.singleInputQuestion.name, "matrix1", "singleInputQuestion, #3.1");
  matrix1.addRow();
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion, #3.2");
  const addBtn = bar.getActionById("sv-singleinput-add");
  assert.ok(addBtn, "addBtn exists, #3");
  assert.equal(addBtn.visible, false, "addBtn visible #1");
  survey.performNext();
  assert.equal(addBtn.visible, true, "addBtn visible #2");
  assert.equal(addBtn.title, "Add Row", "addBtn text #2");
  addBtn.action();
  assert.equal(matrix1.rowCount, 2, "New row is added");
  assert.equal(addBtn.visible, false, "addBtn visible #3");
  matrix1.singleInputRemoveItem();
  assert.equal(matrix1.rowCount, 1, "Last row is removed");
  assert.equal(addBtn.visible, false, "addBtn visible #4");
  survey.performNext();
  assert.equal(addBtn.visible, true, "addBtn visible #5");
  assert.equal(addBtn.title, "Add Row", "addBtn text #5");
});
QUnit.test("singleInput and single matrix", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrix", name: "matrix1",
        columns: ["col1", "col2", "col3", "col4"],
        rows: [{ value: "row1", text: "Row 1" }, "row2"]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  survey.css = { question: { nested: "q-nested", withFrame: "q-frame" } };
  const matrix1 = survey.getQuestionByName("matrix1");
  assert.equal(matrix1.singleInputQuestion.name, "row1", "singleInputQuestion.name, #1");
  assert.equal(matrix1.singleInputQuestion.locTitle.textOrHtml, "Row 1", "singleInputQuestion.title, #1");
  assert.equal(matrix1.singleInputQuestion.choices.length, 4, "singleInputQuestion.choices.length, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #1");
  assert.equal(matrix1.singleInputQuestion.isRequired, false, "The question is not required");
  const rootCss = matrix1.singleInputQuestion.getRootCss();
  assert.equal(rootCss.indexOf("q-frame") > -1, true, "rootCss has frame, #1");
  assert.equal(rootCss.indexOf("q-nested") > -1, false, "rootCss has frame, #1");
  matrix1.singleInputQuestion.value = "col2";
  survey.performNext();
  assert.equal(matrix1.singleInputQuestion.name, "row2", "singleInputQuestion.name, #2");
  assert.equal(matrix1.singleInputQuestion.choices.length, 4, "singleInputQuestion.choices.length, #2");
  assert.equal(survey.isCompleteButtonVisible, true, "isCompleteButtonVisible #2");
  matrix1.singleInputQuestion.value = "col3";
  assert.deepEqual(matrix1.value, { row1: "col2", row2: "col3" }, "matrix1.value");
  assert.deepEqual(survey.data, { matrix1: { row1: "col2", row2: "col3" } }, "survey.data");
});
QUnit.test("singleInput and single matrix", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrix", name: "matrix1", isAllRowRequired: true,
        columns: ["col1", "col2", "col3", "col4"],
        rows: [{ value: "row1", text: "Row 1" }, "row2"]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const matrix1 = survey.getQuestionByName("matrix1");
  assert.equal(matrix1.singleInputQuestion.isRequired, true, "The question is required");
});
QUnit.test("singleInput and matrix dynamic & navigation buttons visibilty & show matrix question", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic", name: "matrix1",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "col1" },
          { cellType: "text", name: "col2" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage",
  });
  const matrix1 = survey.getQuestionByName("matrix1");
  const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
  assert.equal(matrix1.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #1");
  assert.equal(addBtn.visible, true, "addBtn visible #1");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #1");
  assert.equal(survey.isShowNextButton, false, "next buttton, #1");
  assert.equal(survey.isCompleteButtonVisible, true, "complete buttton, #1");
  matrix1.addRow();
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion.name, #2");
  assert.equal(addBtn.visible, false, "addBtn visible #2");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #2");
  assert.equal(survey.isShowNextButton, true, "next buttton, #2");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #2");
  matrix1.singleInputQuestion.value = "a";
  survey.performNext();
  assert.equal(matrix1.singleInputQuestion.name, "col2", "singleInputQuestion.name, #3");
  assert.equal(addBtn.visible, false, "addBtn visible #3");
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #3");
  assert.equal(survey.isShowNextButton, true, "next buttton, #3");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #3");
  survey.performNext();
  assert.equal(matrix1.rowCount, 1, "rowCount #3");
  assert.equal(matrix1.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #4");
  assert.equal(addBtn.visible, true, "addBtn visible #4");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #4");
  assert.equal(survey.isShowNextButton, false, "next buttton, #4");
  assert.equal(survey.isCompleteButtonVisible, true, "complete buttton, #4");
  matrix1.addRow();
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion.name, #5");
  assert.equal(addBtn.visible, false, "addBtn visible #5");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #5");
  assert.equal(survey.isShowNextButton, true, "next buttton, #5");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #5");
});

QUnit.test("singleInput and matrix dynamic & navigation buttons visibilty & visibleIf", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic", name: "matrix1",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "col1" },
          { cellType: "text", name: "col2", visibleIf: "{row.col1} = 1" },
          { cellType: "text", name: "col3", visibleIf: "{row.col1} notempty" },
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage",
  });
  const matrix1 = survey.getQuestionByName("matrix1");
  assert.equal(matrix1.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #0");
  matrix1.addRow();
  const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #1");
  assert.equal(survey.isShowNextButton, true, "next buttton, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #1");
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion.name, #1");
  assert.equal(addBtn.visible, false, "addBtn visible #1, row is empty");
  matrix1.singleInputQuestion.value = "a";
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #2");
  assert.equal(survey.isShowNextButton, true, "next buttton, #2");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #2");
  assert.equal(addBtn.visible, false, "addBtn visible #2");
  survey.performNext();
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #3");
  assert.equal(survey.isShowNextButton, true, "next buttton, #3");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #3");
  assert.equal(matrix1.singleInputQuestion.name, "col3", "singleInputQuestion.name, #3");
  assert.equal(addBtn.visible, false, "addBtn visible #3");
  survey.performNext();
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #4");
  assert.equal(survey.isShowNextButton, false, "next buttton, #4");
  assert.equal(survey.isCompleteButtonVisible, true, "complete buttton, #4");
  assert.equal(matrix1.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #4");
  assert.equal(addBtn.visible, true, "addBtn visible #4");
});
QUnit.test("singleInput for panel dynamic & singleInputLocTitle", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 2,
        templateElements: [
          { type: "text", name: "q1" }
        ]
      }
    ]
  });
  const panel = survey.getQuestionByName("panel1");
  assert.equal(panel.panels[0].locTitle.isEmpty, true, "panels[0] locTitle is empty, #1");
  assert.equal(panel.panels[1].locTitle.isEmpty, true, "panels[1] locTitle is empty, #1");
  survey.questionsOnPageMode = "inputPerPage";
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Panel 1", "singleInputLocTitle, #2");
  panel.panels[0].getQuestionByName("q1").value = "a";
  survey.performNext();
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Panel 2", "singleInputLocTitle, #3");
  survey.questionsOnPageMode = "standard";
  assert.equal(panel.panels[0].locTitle.isEmpty, true, "panels[0] locTitle is empty, #4");
  assert.equal(panel.panels[1].locTitle.isEmpty, true, "panels[1] locTitle is empty, #4");
});
QUnit.test("singleInput for matrix dynamic & singleInputLocTitle, cell question title", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic", name: "matrix1",
        rowCount: 0,
        columns: [{ cellType: "text", name: "col1" }]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const matrix = survey.getQuestionByName("matrix1");
  assert.notOk(matrix.singleInputLocTitle?.name, "singleInputLocTitle, #1");
  matrix.addRow();
  assert.ok(matrix.singleInputLocTitle, "singleInputLocTitle, #2");
  assert.equal(matrix.singleInputLocTitle.textOrHtml, "Row 1", "singleInputLocTitle, #2");
  assert.equal(matrix.singleInputQuestion.locTitle.textOrHtml, "col1", "singleInputQuestion.title, #2");
  matrix.singleInputQuestion.value = "a";
  survey.performNext();
  assert.notOk(matrix.singleInputLocTitle?.textOrHtml, "singleInputLocTitle, #3");
  matrix.addRow();
  assert.ok(matrix.singleInputLocTitle, "singleInputLocTitle, #4");
  assert.equal(matrix.singleInputLocTitle.textOrHtml, "Row 2", "singleInputLocTitle, #4");
  matrix.singleInputQuestion.value = "b";
  survey.performNext();
  assert.notOk(matrix.singleInputLocTitle?.textOrHtml, "singleInputLocTitle, #5");
  matrix.addRow();
  assert.ok(matrix.singleInputLocTitle, "singleInputLocTitle, #6");
  assert.equal(matrix.singleInputLocTitle.textOrHtml, "Row 3", "singleInputLocTitle, #6");
  matrix.singleInputQuestion.value = "c";
  survey.performNext();
  matrix.singleInputSummary.items[1].btnEdit.action();
  assert.equal(matrix.singleInputLocTitle.textOrHtml, "Row 2", "singleInputLocTitle, #7");
});
QUnit.test("singleInput for matrix dynamic & cell question & css", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic", name: "matrix1",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "col1" },
          { cellType: "text", name: "col2" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  survey.css = { question: { nested: "q-nested", withFrame: "q-frame" } };
  const matrix = survey.getQuestionByName("matrix1");
  assert.equal(matrix.singleInputQuestion.name, "matrix1", "no singleInputQuestion, #1");
  matrix.addRow();
  matrix.addRow();
  matrix.visibleRows.forEach(row => {
    row.cells.forEach(cell => {
      const q = cell.question;
      const rootCss = q.getRootCss();
      assert.equal(rootCss.indexOf("q-frame") > -1, true, "rootCss has frame: name: " + q.name);
      assert.equal(rootCss.indexOf("q-nested") > -1, false, "rootCss no nested: name: " + q.name);
    });
  });
});

QUnit.test("singleInput & singleInputSummary for dynamic matrix", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic", name: "matrix1",
        rowCount: 0,
        columns: [
          { cellType: "text", name: "col1" },
          { cellType: "text", name: "col2" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const matrix = survey.getQuestionByName("matrix1");
  assert.equal(survey.currentSingleQuestion.name, "matrix1", "currentSingleQuestion is matrix1, #1");
  assert.equal(matrix.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #1");
  assert.ok(matrix.singleInputSummary, "singleInputSummary exists, #1");
  assert.equal(matrix.singleInputSummary.items.length, 0, "singleInputSummary.items.length, #1");
  assert.notOk(matrix.singleInputLocTitle?.textOrHtml, "singleInputLocTitle, #1");
  assert.equal(matrix.locRenderedTitle.textOrHtml, "matrix1", "locRenderedTitle, #1");
  matrix.addRow();
  assert.equal(matrix.rowCount, 1, "row count, #2");
  assert.notOk(matrix.singleInputSummary?.question.name, "singleInputSummary exists, #2");
  assert.equal(matrix.singleInputLocTitle?.textOrHtml, "Row 1", "singleInputLocTitle, #2");
  assert.equal(matrix.locRenderedTitle.textOrHtml, "Row 1", "locRenderedTitle, #2");
  matrix.singleInputQuestion.value = "a";
  survey.performNext();
  assert.notOk(matrix.singleInputSummary?.question.name, "singleInputSummary exists, #3");
  assert.equal(matrix.singleInputLocTitle?.textOrHtml, "Row 1", "singleInputLocTitle, #3");
  assert.equal(matrix.locRenderedTitle.textOrHtml, "Row 1", "locRenderedTitle, #3");
  survey.performNext();
  assert.ok(matrix.singleInputSummary, "singleInputSummary exists, #4");
  assert.equal(matrix.singleInputSummary.items.length, 1, "singleInputSummary.items.length, #4");
  assert.notOk(matrix.singleInputLocTitle?.textOrHtml, "singleInputLocTitle, #1");
  assert.equal(matrix.locRenderedTitle.textOrHtml, "matrix1", "locRenderedTitle, #1");

  matrix.addRow();
  matrix.singleInputQuestion.value = "b";
  survey.performNext();
  survey.performNext();
  assert.ok(matrix.singleInputSummary, "singleInputSummary exists, #5");
  assert.equal(matrix.singleInputSummary.items.length, 2, "singleInputSummary.items.length, #5");
  assert.equal(matrix.singleInputSummary.items[0].locText.textOrHtml, "Row 1", "singleInputSummary.items[0].locText, #5");
  assert.equal(matrix.singleInputSummary.items[1].locText.textOrHtml, "Row 2", "singleInputSummary.items[1].locText, #5");
  assert.equal(matrix.singleInputSummary.items[0].btnEdit.locTitle.textOrHtml, "Edit", "singleInputSummary.items[0].btnEdit.locTitle, #5");
  matrix.singleInputSummary.items[0].btnEdit.action();
  assert.equal(matrix.singleInputQuestion.name, "col1", "singleInputQuestion.name, #6");
  assert.equal(matrix.singleInputLocTitle.textOrHtml, "Row 1", "singleInputLocTitle, #6");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #6");
  assert.equal(survey.isShowNextButton, true, "next buttton, #6");
});
QUnit.test("singleInput & singleInputSummary for dynamic panel", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const panel = survey.getQuestionByName("panel1");
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is matrix1, #1");
  assert.equal(panel.singleInputQuestion.name, "panel1", "singleInputQuestion.name, #1");
  assert.ok(panel.singleInputSummary, "singleInputSummary exists, #1");
  assert.equal(panel.singleInputSummary.items.length, 0, "singleInputSummary.items.length, #1");
  panel.addPanel();
  assert.equal(panel.panelCount, 1, "row count, #2");
  assert.notOk(panel.singleInputSummary?.question.name, "singleInputSummary exists, #2");
  panel.singleInputQuestion.value = "a";
  survey.performNext();
  assert.notOk(panel.singleInputSummary?.question.name, "singleInputSummary exists, #3");
  survey.performNext();
  assert.ok(panel.singleInputSummary, "singleInputSummary exists, #4");
  assert.equal(panel.singleInputSummary.items.length, 1, "singleInputSummary.items.length, #4");
  panel.addPanel();
  panel.singleInputQuestion.value = "b";
  survey.performNext();
  survey.performNext();
  assert.ok(panel.singleInputSummary, "singleInputSummary exists, #5");
  assert.equal(panel.singleInputSummary.items.length, 2, "singleInputSummary.items.length, #5");
  assert.equal(panel.singleInputSummary.items[0].locText.textOrHtml, "Panel 1", "singleInputSummary.items[0].locText, #5");
  assert.equal(panel.singleInputSummary.items[1].locText.textOrHtml, "Panel 2", "singleInputSummary.items[1].locText, #5");
  assert.equal(panel.singleInputSummary.items[0].btnEdit.locTitle.textOrHtml, "Edit", "singleInputSummary.items[0].btnEdit.locTitle, #5");
  panel.singleInputSummary.items[0].btnEdit.action();
  assert.equal(panel.singleInputQuestion.name, "q1", "singleInputQuestion.name, #6");
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Panel 1", "singleInputLocTitle, #6");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #6");
  assert.equal(survey.isShowNextButton, true, "next buttton, #6");
});
QUnit.test("singleInput & singleInputSummary for nested dynamic panel", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        templateElements: [
          { type: "text", name: "q1" },
          { type: "paneldynamic", name: "panel2", templateElements: [{ type: "text", name: "q2" }], templateTitle: "#{panelIndex}: {panel.q2}" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  survey.data = { panel1: [{ q1: "a", panel2: [{ q2: "b" }, { q2: "c" }] }] };
  const panel1 = survey.getQuestionByName("panel1");
  assert.equal(panel1.singleInputQuestion.name, "panel1", "panel2.singleInputQuestion.name, #0");
  assert.ok(panel1.singleInputSummary, "singleInputSummary exists, #0");
  assert.equal(panel1.singleInputSummary.items.length, 1, "singleInputSummary.items.length, #0");
  panel1.singleInputSummary.items[0].btnEdit.action();
  survey.performNext();
  assert.equal(panel1.singleInputQuestion.name, "panel2", "panel2.singleInputQuestion.name, #1");
  const panel2 = panel1.panels[0].getQuestionByName("panel2");
  assert.equal(panel2.singleInputQuestion.name, "panel2", "panel2.singleInputQuestion.name, #1");
  const summary: QuestionSingleInputSummary = panel2.singleInputSummary;
  assert.ok(summary, "singleInputSummary exists, #2");
  const items = summary.items;
  assert.equal(items.length, 2, "singleInputSummary.items.length, #2");
  assert.equal(items[0].locText.textOrHtml, "#1: b", "items[0].text, #2");
  assert.equal(items[1].locText.textOrHtml, "#2: c", "items[1].text, #2");
});
QUnit.test("singleInput & nested matrix dynamic in the panel dynamic", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 1,
        templateElements: [
          { type: "text", name: "name" },
          {
            type: "matrixdynamic", name: "matrix1", rowCount: 0,
            columns: [
              { cellType: "text", name: "col1" },
              { cellType: "text", name: "col2" }
            ]
          }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
  const panel = survey.getQuestionByName("panel1");
  let move = " forward";
  const checkStep1 = () => {
    assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is matrix1, #1" + move);
    assert.equal(panel.singleInputQuestion.name, "name", "singleInputQuestion.name, #1" + move);
    assert.equal(panel.singleInputLocTitle.textOrHtml, "Panel 1", "input loc title #1" + move);
    assert.equal(survey.isShowPrevButton, false, "prev buttton, #1" + move);
    assert.equal(survey.isShowNextButton, true, "next buttton, #1" + move);
    assert.equal(addBtn.visible, false, "addBtn visible #1" + move);
  };
  checkStep1();
  panel.singleInputQuestion.value = "a";
  survey.performNext();
  let matrix = panel.panels[0].getQuestionByName("matrix1");
  const checkStep2 = () => {
    assert.equal(panel.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #2" + move);
    assert.equal(panel.singleInputLocTitle.textOrHtml, "Panel 1", "input loc title #2" + move);
    assert.equal(survey.isShowPrevButton, true, "prev buttton, #2" + move);
    assert.equal(survey.isShowNextButton, true, "next buttton, #2" + move);
    assert.equal(matrix.singleInputQuestion.name, "matrix1", "matrix.singleInputQuestion.name, #2" + move);
    assert.notOk(matrix.singleInputLocTitle?.textOrHtml, "matrix.input loc title #2" + move);
    assert.equal(matrix.singleInputSummary?.items.length, 0, "matrix.singleInputSummary exists, #2" + move);
    assert.equal(addBtn.visible, true, "addBtn visible #2" + move);
    assert.equal(matrix.visibleRows.length, 0, "matrix.visibleRows.length, #2" + move);
  };
  checkStep2();

  addBtn.action();
  const checkStep3 = () => {
    assert.equal(matrix.visibleRows.length, 1, "matrix.visibleRows.length, #3" + move);
    assert.equal(panel.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #3" + move);
    assert.equal(panel.singleInputLocTitle.textOrHtml, "Panel 1", "input loc title #3" + move);
    assert.equal(survey.isShowPrevButton, true, "prev buttton, #3" + move);
    assert.equal(survey.isShowNextButton, true, "next buttton, #3" + move);
    assert.equal(matrix.singleInputQuestion.name, "col1", "matrix.singleInputQuestion.name, #3" + move);
    matrix.singleInputQuestion.value = "a";
    assert.equal(matrix.singleInputLocTitle.textOrHtml, "Row 1", "matrix.input loc title #3" + move);
    assert.equal(matrix.singleInputSummary?.items.length, undefined, "matrix.singleInputSummary exists, #3" + move);
    assert.equal(addBtn.visible, false, "addBtn visible #3" + move);
  };
  checkStep3();

  survey.performNext();
  const checkStep4 = () => {
    assert.equal(panel.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #4" + move);
    assert.equal(panel.singleInputLocTitle.textOrHtml, "Panel 1", "input loc title #4" + move);
    assert.equal(survey.isShowPrevButton, true, "prev buttton, #4" + move);
    assert.equal(survey.isShowNextButton, true, "next buttton, #4" + move);
    assert.equal(matrix.singleInputQuestion.name, "col2", "matrix.singleInputQuestion.name, #4" + move);
    assert.equal(matrix.singleInputLocTitle.textOrHtml, "Row 1", "matrix.input loc title #4" + move);
    assert.equal(matrix.singleInputSummary?.items.length, undefined, "matrix.singleInputSummary exists, #4" + move);
    assert.equal(addBtn.visible, false, "addBtn visible #4" + move);
  };
  checkStep4();
  survey.performNext();
  const checkStep5 = () => {
    assert.equal(panel.singleInputQuestion.name, "matrix1", "singleInputQuestion.name, #5" + move);
    assert.equal(panel.singleInputLocTitle.textOrHtml, "Panel 1", "input loc title #5" + move);
    assert.equal(survey.isShowPrevButton, true, "prev buttton, #5" + move);
    assert.equal(survey.isShowNextButton, true, "next buttton, #5" + move);
    assert.equal(matrix.singleInputQuestion.name, "matrix1", "matrix.singleInputQuestion.name, #5" + move);
    assert.notOk(matrix.singleInputLocTitle?.textOrHtml, "matrix.input loc title #5" + move);
    assert.equal(matrix.singleInputSummary?.items.length, 1, "matrix.singleInputSummary exists, #5" + move);
    assert.equal(addBtn.visible, true, "addBtn visible #5" + move);
  };
  checkStep5();

  survey.performNext();
  const checkStep6 = () => {
    assert.equal(panel.singleInputQuestion.name, "panel1", "singleInputQuestion.name, #6");
    assert.notOk(panel.singleInputLocTitle?.textOrHtml, "input loc title #6");
    assert.equal(survey.isShowPrevButton, false, "prev buttton, #6");
    assert.equal(survey.isShowNextButton, false, "next buttton, #6");
    assert.equal(survey.isCompleteButtonVisible, true, "complete buttton, #6");
    assert.equal(panel.singleInputSummary.items.length, 1, "panel.singleInputSummary exists, #6");
    assert.equal(addBtn.visible, true, "addBtn visible #6");
  };
  checkStep6();
});
QUnit.test("singleInput & singleInputSummary, stay on summary on deleting", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 2,
        templateElements: [
          { type: "text", name: "q1", defaultValue: "a" },
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const panel = survey.getQuestionByName("panel1");
  survey.performNext();
  survey.performNext();
  assert.ok(panel.singleInputSummary, "singleInputSummary is here, #1");
  assert.equal(panel.singleInputSummary.items.length, 2, "singleInputSummary.items.length, #1");
  panel.singleInputSummary.items[0].btnRemove.action();
  assert.ok(panel.singleInputSummary, "singleInputSummary is here, #2");
  assert.equal(panel.singleInputSummary.items.length, 1, "singleInputSummary.items.length, #2");
  panel.singleInputSummary.items[0].btnRemove.action();
  assert.ok(panel.singleInputSummary, "singleInputSummary is here, #3");
  assert.equal(panel.singleInputSummary.items.length, 0, "singleInputSummary.items.length, #3");
});
QUnit.test("singleInput & singleInputSummary, showRemove", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 2,
        minPanelCount: 1,
        templateElements: [
          { type: "text", name: "q1", defaultValue: "a" },
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const panel = survey.getQuestionByName("panel1");
  survey.performNext();
  survey.performNext();
  assert.equal(panel.singleInputSummary.items.length, 2, "singleInputSummary.items.length, #1");
  assert.equal(panel.singleInputSummary.items[0].showRemove, true, "singleInputSummary.items[0].showRemove, #1");
  panel.singleInputSummary.items[0].btnRemove.action();
  assert.equal(panel.singleInputSummary.items.length, 1, "singleInputSummary.items.length, #2");
  assert.equal(panel.singleInputSummary.items[0].showRemove, false, "singleInputSummary.items[0].showRemove, #1");
});
const nestedJSON = {
  elements: [
    {
      type: "paneldynamic", name: "order",
      title: "Order", description: "Fill all fields to make an order",
      panelCount: 1,
      templateTitle: "Order #{panelIndex}",
      templateElements: [
        { type: "text", name: "buyerName", title: "Buyer name", isRequired: true },
        { type: "paneldynamic", name: "stores", title: "Place to Deliver", description: "Add all places you want to deliver",
          panelCount: 1,
          templateTitle: "Delivery #{panelIndex}",
          templateElements: [
            { type: "text", name: "storeName", title: "Store Name", isRequired: true },
            { type: "matrixdynamic", name: "products", cellType: "text", rowCount: 0,
              title: "Products", description: "Add all products you want to deliver to {panel.storeName}",
              singleInputTitleTemplate: "{row.productName}",
              columns: [{ name: "productName", title: "Product Name", isRequired: true, defaultDisplayValue: "New Product" }, { name: "productCount", title: "Count", isRequired: true }]
            },
            { type: "text", name: "address", title: "Place Address" }
          ]
        }
      ]
    }
  ],
  questionsOnPageMode: "inputPerPage"
};
QUnit.test("singleInput & two nested elements", assert => {
  const survey = new SurveyModel(nestedJSON);
  const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
  const panel = survey.getQuestionByName("order");
  assert.equal(panel.singleInputQuestion.name, "buyerName", "root.singleInputQuestion.name, #1");
  panel.singleInputQuestion.value = "John";

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #2");
  const storesPanel = panel.singleInputQuestion;
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #2");
  assert.equal(storesPanel.singleInputQuestion.name, "storeName", "storesPanel.singleInputQuestion.name, #3");
  storesPanel.singleInputQuestion.value = "Store 1";

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #4");
  assert.equal(storesPanel.singleInputQuestion.name, "products", "storesPanel.singleInputQuestion.name, #4");
  const productsMatrix = storesPanel.singleInputQuestion;
  assert.equal(productsMatrix.singleInputQuestion.name, "products", "productsMatrix.singleInputQuestion.name, #5");
  assert.equal(addBtn.visible, true, "addBtn visible #5");

  addBtn.action();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #6");
  assert.equal(storesPanel.singleInputQuestion.name, "products", "storesPanel.singleInputQuestion.name, #6");
  assert.equal(productsMatrix.singleInputQuestion.name, "productName", "productsMatrix.singleInputQuestion.name, #6");
  assert.equal(addBtn.visible, false, "addBtn visible #6");
  productsMatrix.singleInputQuestion.value = "Product 1";

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #7");
  assert.equal(storesPanel.singleInputQuestion.name, "products", "storesPanel.singleInputQuestion.name, #7");
  assert.equal(productsMatrix.singleInputQuestion.name, "productCount", "productsMatrix.singleInputQuestion.name, #7");
  assert.equal(addBtn.visible, false, "addBtn visible #7");
  productsMatrix.singleInputQuestion.value = 2;

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #8");
  assert.equal(storesPanel.singleInputQuestion.name, "products", "productsMatrix.singleInputQuestion.name, #8");
  assert.equal(productsMatrix.singleInputQuestion.name, "products", "productsMatrix.singleInputQuestion.name, #8");
  assert.equal(addBtn.visible, true, "addBtn visible #8");
  productsMatrix.singleInputSummary.items[0].btnEdit.action();
  assert.equal(productsMatrix.singleInputQuestion.name, "productName", "productsMatrix.singleInputQuestion.name, #8.2");
  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #9");
  assert.equal(storesPanel.singleInputQuestion.name, "products", "storesPanel.singleInputQuestion.name, #9");
  assert.equal(productsMatrix.singleInputQuestion.name, "productCount", "productsMatrix.singleInputQuestion.name, #9");
  assert.equal(addBtn.visible, false, "addBtn visible #9");

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #10");
  assert.equal(storesPanel.singleInputQuestion.name, "products", "productsMatrix.singleInputQuestion.name, #10");
  assert.equal(productsMatrix.singleInputQuestion.name, "products", "productsMatrix.singleInputQuestion.name, #10");

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #11");
  assert.equal(storesPanel.singleInputQuestion.name, "address", "storesPanel.singleInputQuestion.name, #11");
  assert.equal(addBtn.visible, false, "addBtn visible #11");

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #12");
  assert.equal(storesPanel.singleInputQuestion.name, "stores", "storesPanel.singleInputQuestion.name, #12");
  assert.equal(addBtn.visible, true, "addBtn visible #12");

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "order", "root.singleInputQuestion.name, #13");
  assert.equal(addBtn.visible, true, "addBtn visible #13");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #13");
  assert.equal(survey.isShowNextButton, false, "next buttton, #13");
  assert.equal(survey.isCompleteButtonVisible, true, "complete buttton, #13");
});
QUnit.test("singleInput & two nested elements & actions", assert => {
  const survey = new SurveyModel(nestedJSON);
  const addBtn = survey.navigationBar.getActionById("sv-singleinput-add");
  const panel = survey.getQuestionByName("order");
  const check4OneActions = (num: number, isSummary: boolean = true) => {
    const postFix = ", #" + num.toString();
    assert.equal(panel.singleInputHasActions, true, "singleInputHasActions" + postFix);
    assert.equal(panel.singleInputActions.actions.length, 1, "singleInputActions.length" + postFix);
    const orderTitle = isSummary ? "Order" : "Order #1";
    assert.equal(panel.singleInputActions.actions[0].title, orderTitle, "singleInputActions[0].title" + postFix);
  };
  const check4TwoActions = (num: number, isSummary: boolean) => {
    const postFix = ", #" + num.toString();
    assert.equal(panel.singleInputHasActions, true, "singleInputHasActions" + postFix);
    assert.equal(panel.singleInputActions.actions.length, 2, "singleInputActions.length" + postFix);
    assert.equal(panel.singleInputActions.actions[0].title, "Order #1", "singleInputActions[0].title" + postFix);
    const storeTitle = isSummary ? "Place to Deliver" : "Delivery #1";
    assert.equal(panel.singleInputActions.actions[1].title, storeTitle, "singleInputActions[1].title" + postFix);
  };
  assert.equal(panel.singleInputQuestion.name, "buyerName", "root.singleInputQuestion.name, #1");
  assert.equal(panel.singleInputHideHeader, false, "root.singleInputHideHeader, #1");
  panel.singleInputQuestion.value = "John";

  survey.performNext();
  check4OneActions(2, false);
  const storesPanel = panel.singleInputQuestion;
  assert.equal(storesPanel.singleInputQuestion.name, "storeName", "storesPanel.singleInputQuestion.name, #2.1");
  storesPanel.singleInputQuestion.value = "Store 1";
  survey.performNext();
  const productsMatrix = storesPanel.singleInputQuestion;
  assert.equal(productsMatrix.singleInputQuestion.name, "products", "productsMatrix.singleInputQuestion.name, #3");
  check4TwoActions(3, false);

  addBtn.action();
  assert.equal(productsMatrix.singleInputQuestion.name, "productName", "productsMatrix.singleInputQuestion.name, #4");
  check4TwoActions(4, false);
  productsMatrix.singleInputQuestion.value = "Product 1";

  survey.performNext();
  assert.equal(productsMatrix.singleInputQuestion.name, "productCount", "productsMatrix.singleInputQuestion.name, #5");
  check4TwoActions(5, false);
  productsMatrix.singleInputQuestion.value = 2;

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #6");
  assert.equal(storesPanel.singleInputQuestion.name, "products", "storesPanel.singleInputQuestion.name, #6");
  check4TwoActions(6, false);

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #7");
  assert.equal(storesPanel.singleInputQuestion.name, "address", "storesPanel.singleInputQuestion.name, #7");
  check4OneActions(7, false);

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #8");
  check4OneActions(8, false);

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "order", "root.singleInputQuestion.name, #9");
  assert.equal(panel.singleInputActions.actions.length, 0, "singleInputActions.length, #9");
  panel.singleInputSummary.items[0].btnEdit.action();
  survey.performNext();
  storesPanel.singleInputSummary.items[0].btnEdit.action();
  survey.performNext();
  productsMatrix.singleInputSummary.items[0].btnEdit.action();
  check4TwoActions(10, false);

  panel.singleInputActions.actions[1].action();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #11");
  assert.equal(storesPanel.singleInputQuestion.name, "storeName", "storesPanel.singleInputQuestion.name, #11");
  check4OneActions(11, false);

  survey.performNext();
  assert.equal(storesPanel.singleInputQuestion.name, "products", "storesPanel.singleInputQuestion.name, #12");

  panel.singleInputActions.actions[0].action();
  assert.equal(panel.singleInputQuestion.name, "buyerName", "root.singleInputQuestion.name, #13");

  survey.performNext();
  assert.equal(panel.singleInputQuestion.name, "stores", "root.singleInputQuestion.name, #14");
  assert.equal(storesPanel.singleInputQuestion.name, "storeName", "storesPanel.singleInputQuestion.name, #14");
  check4OneActions(14, false);
});
QUnit.test("singleInput & two nested elements & actions 2", assert => {
  const survey = new SurveyModel({
    "questionsOnPageMode": "inputPerPage",
    "title": "Employment History (merging answers from several previous questions)",
    "pages": [
      {
        "name": "employers-page",
        "elements": [
          {
            "type": "matrixdynamic",
            "name": "employerNames",
            "title": "Please add your previous and current employers",
            "singleInputTitleTemplate": "Employee name: {row.employee-name}",
            "valueName": "employers",
            "isRequired": true,
            "showHeader": false,
            "columns": [
              {
                "name": "employee-name",
                "cellType": "text",
                "isRequired": true
              }
            ],
            "minRowCount": 1,
            "rowCount": 1,
            "addRowText": "Add Employer"
          },
          {
            "type": "paneldynamic",
            "name": "employers_info",
            "title": "Details",
            "valueName": "employers",
            "templateElements": [
              {
                "type": "panel",
                "name": "panel_employer_address",
                "elements": [
                  {
                    "type": "text",
                    "name": "city"
                  },
                  {
                    "type": "panel",
                    "name": "workingDate",
                    "elements": [
                      {
                        "type": "text",
                        "name": "startDate",
                        "title": "Start Date",
                        "validators": [
                          {
                            "type": "expression",
                            "expression": "getDate({panel.startDate}) < currentDate()"
                          }
                        ]
                      },
                      {
                        "type": "text",
                        "name": "endDate",
                        "title": "End Date",
                        "validators": [
                          {
                            "type": "expression",
                            "expression": "getDate({panel.endDate}) > getDate({panel.startDate})"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ],
            "templateTitle": "Employer: {panel.employee-name}",
            "allowAddPanel": false,
            "allowRemovePanel": false
          }
        ]
      }
    ]
  });
  const matrix = survey.getQuestionByName("employerNames");
  const panelDynamic = survey.getQuestionByName("employers_info");
  const bar = survey.navigationBar;
  const addBtn = bar.getActionById("sv-singleinput-add");
  assert.equal(survey.currentSingleQuestion.name, "employerNames", "currentSingleQuestion is matrix1, #1");
  assert.equal(survey.isShowPrevButton, false, "isShowPrevButton, #1");
  assert.equal(survey.isShowNextButton, true, "isShowNextButton, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible, #1");
  assert.equal(matrix.singleInputQuestion?.name, "employee-name", "singleInputQuestion.name, #1");
  assert.equal(matrix.singleInputQuestion?.getTitleLocation(), "hidden", "singleInputQuestion.titlelocation, #1");
  assert.equal(addBtn.visible, false, "addBtn.visible, #1");
  matrix.singleInputQuestion.value = "emp1";
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "employerNames", "currentSingleQuestion is matrix1, #2");
  assert.equal(matrix.singleInputSummary.items.length, 1, "singleInputSummary.items.length, #2");
  assert.equal(matrix.singleInputSummary.items[0]?.locText.renderedHtml, "Employee name: emp1", "summary text, #2");
  assert.equal(survey.isShowPrevButton, false, "isShowPrevButton, #2");
  assert.equal(survey.isShowNextButton, true, "isShowNextButton, #2");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible, #2");
  assert.equal(addBtn.visible, true, "addBtn.visible, #2");
  assert.equal(addBtn.title, "Add Employer", "addBtn.title, #2");
  addBtn.action();
  assert.equal(matrix.singleInputQuestion?.name, "employee-name", "singleInputQuestion.name, #1");
  matrix.singleInputQuestion.value = "emp2";
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "employerNames", "currentSingleQuestion is matrix1, #4");
  assert.equal(matrix.singleInputSummary.items.length, 2, "singleInputSummary.items.length, #4");
  assert.equal(matrix.singleInputSummary.items[1]?.locText.renderedHtml, "Employee name: emp2", "summary text, #4");
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "employers_info", "currentSingleQuestion is matrix1, #5");
  assert.equal(survey.isShowPrevButton, true, "isShowPrevButton, #5");
  assert.equal(survey.isShowNextButton, true, "isShowNextButton, #5");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible, #5");
  assert.equal(panelDynamic.singleInputQuestion?.name, "city", "singleInputQuestion.name, #5");
  let panel = panelDynamic.panels[0];
  panel.getQuestionByName("city").value = "city1";
  survey.performNext();
  assert.equal(panelDynamic.singleInputQuestion?.name, "startDate", "singleInputQuestion.name, #6");
  panel.getQuestionByName("startDate").value = "2023-01-01";
  survey.performNext();
  assert.equal(panelDynamic.singleInputQuestion?.name, "endDate", "singleInputQuestion.name, #7");
  panel.getQuestionByName("endDate").value = "2023-05-01";
  assert.equal(panel.getQuestionByName("endDate").hasErrors(false, false), false, "There is not errors, #7");
  survey.performNext();
  panel = panelDynamic.panels[1];
  assert.equal(panelDynamic.singleInputQuestion?.name, "city", "singleInputQuestion.name, #8");
  panel.getQuestionByName("city").value = "city2";
  survey.performNext();
  assert.equal(panelDynamic.singleInputQuestion?.name, "startDate", "singleInputQuestion.name, #9");
  panel.getQuestionByName("startDate").value = "2024-01-01";
  survey.performNext();
  assert.equal(panelDynamic.singleInputQuestion?.name, "endDate", "singleInputQuestion.name, #10");
  panel.getQuestionByName("endDate").value = "2024-03-01";
  survey.performNext();
  assert.equal(panelDynamic.singleInputQuestion?.name, "employers_info", "singleInputQuestion.name, #11");
  assert.equal(survey.isShowPrevButton, true, "isShowPrevButton, #11");
  assert.equal(survey.isShowNextButton, false, "isShowNextButton, #11");
  assert.equal(survey.isCompleteButtonVisible, true, "isCompleteButtonVisible, #11");
  assert.equal(addBtn.visible, false, "addBtn.visible, #11");
  assert.deepEqual(survey.data, {
    "employers": [{
      "employee-name": "emp1",
      "city": "city1",
      "startDate": "2023-01-01",
      "endDate": "2023-05-01"
    }, {
      "employee-name": "emp2",
      "city": "city2",
      "startDate": "2024-01-01",
      "endDate": "2024-03-01"
    }] }, "check survey.data");
});
QUnit.test("singleInput and survey.onCheckSingleInputPerPageMode event", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "multipletext", name: "mt1",
        items: [{ name: "item1" }, { name: "item2" }],
      },
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 1,
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }
        ]
      },
      {
        type: "paneldynamic", name: "panel2",
        panelCount: 1,
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage",
  });
  survey.onCheckSingleInputPerPageMode.add((survey: SurveyModel, options: any) => {
    options.enabled = options.question.name !== "panel1";
  });
  const getSingleInputName = (): string => {
    return survey.currentSingleQuestion.singleInputQuestion?.name || "";
  };
  assert.equal(survey.currentSingleQuestion.name, "mt1", "currentSingleQuestion, #1");
  let mt1 = survey.getQuestionByName("mt1");
  assert.equal(getSingleInputName(), "item1", "singleInputQuestion.name, #1");
  survey.performNext();
  assert.equal(getSingleInputName(), "item2", "singleInputQuestion.name, #2");
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion, #2");
  assert.equal(getSingleInputName(), "", "singleInputQuestion.name, #3");
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "panel2", "currentSingleQuestion, #3");
  assert.equal(getSingleInputName(), "q1", "currentSingleQuestion, #3");
  survey.performNext();
  assert.equal(getSingleInputName(), "q2", "currentSingleQuestion, #4");
});
QUnit.test("check singleInputLocTitle reactivity, matrix", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic", name: "matrix",
        rowCount: 1,
        singleInputTitleTemplate: "value: {row.q1}",
        columns: [
          { cellType: "text", name: "q1", defaultDisplayValue: "[not set]" },
          { cellType: "text", name: "q2" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const matrix = survey.getQuestionByName("matrix");
  const locStr = matrix.singleInputLocTitle;
  let counter1 = 0;
  let counter2 = 0;
  locStr.onChanged = () => {
    counter2 ++;
  };
  locStr.onStringChanged.add((sender, options) => {
    counter1 ++;
  });
  assert.equal(counter1, 0, "onStringChanged, #0");
  assert.equal(counter2, 0, "onChanged, #0");
  assert.equal(locStr.textOrHtml, "value: [not set]", "singleInputLocTitle, #1");
  assert.equal(counter1, 0, "onStringChanged, #0.2");
  assert.equal(counter2, 0, "onChanged, #0.2");
  matrix.singleInputQuestion.value = "a";
  assert.equal(counter1, 1, "onStringChanged, #1");
  assert.equal(counter2, 1, "onChanged, #1");
  assert.equal(matrix.singleInputLocTitle.textOrHtml, "value: a", "singleInputLocTitle, #2");
});
QUnit.test("check singleInputLocTitle reactivity, panel dynamic", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "p",
        panelCount: 1,
        templateElements: [
          {
            type: "text",
            name: "test",
            defaultDisplayValue: "[not set]"
          }
        ],
        templateTitle: "value: {panel.test}"
      }
    ],
    "questionsOnPageMode": "inputPerPage"
  });
  const panel = survey.getQuestionByName("p");
  const locStr = panel.singleInputLocTitle;
  let counter1 = 0;
  let counter2 = 0;
  locStr.onChanged = () => {
    counter2 ++;
  };
  locStr.onStringChanged.add((sender, options) => {
    counter1 ++;
  });
  assert.equal(counter1, 0, "onStringChanged, #0");
  assert.equal(counter2, 0, "onChanged, #0");
  assert.equal(locStr.textOrHtml, "value: [not set]", "singleInputLocTitle, #1");
  assert.equal(counter1, 0, "onStringChanged, #0.2");
  assert.equal(counter2, 0, "onChanged, #0.2");
  panel.singleInputQuestion.value = "a";
  assert.equal(counter1, 1, "onStringChanged, #1");
  assert.equal(counter2, 1, "onChanged, #1");
  assert.equal(panel.singleInputLocTitle.textOrHtml, "value: a", "singleInputLocTitle, #2");
  assert.equal(counter1, 1, "onStringChanged, #2");
  assert.equal(counter2, 1, "onChanged, #2");
});
QUnit.test("check singleInputLocTitle reactivity on peformNext(), panel dynamic", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "p1",
        panelCount: 2,
        valueName: "sharedData",
        templateElements: [
          { type: "text", name: "q1" }
        ]
      },
      {
        type: "paneldynamic",
        name: "p2",
        valueName: "sharedData",
        templateElements: [
          { type: "text", name: "q2", isRequired: true }
        ],
        templateTitle: "value: {panel.q1}"
      }
    ],
    "questionsOnPageMode": "inputPerPage"
  });
  survey.currentSingleQuestion.singleInputQuestion.value = "a";
  survey.performNext();
  survey.currentSingleQuestion.singleInputQuestion.value = "b";
  survey.performNext();
  survey.performNext();

  assert.equal(survey.currentSingleQuestion.name, "p2", "currentSingleQuestion is p2, #1");
  const locStr = survey.currentSingleQuestion.singleInputLocTitle;
  assert.equal(locStr.textOrHtml, "value: a", "singleInputLocTitle, #1");
  survey.currentSingleQuestion.singleInputQuestion.value = "c";
  let counter1 = 0;
  let counter2 = 0;
  locStr.onChanged = () => {
    counter2 ++;
  };
  locStr.onStringChanged.add((sender, options) => {
    counter1 ++;
  });
  survey.performNext();
  assert.equal(counter1, 1, "onStringChanged, #1");
  assert.equal(counter2, 1, "onChanged, #1");
  assert.equal(locStr.textOrHtml, "value: b", "singleInputLocTitle, #1");
});
QUnit.test("check singleInputTitleTemplate property visibility", assert => {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    elements: [
      {
        type: "matrixdynamic", name: "matrix",
        rowCount: 1,
        singleInputTitleTemplate: "value: {row.q1}",
        columns: [
          { cellType: "text", name: "q1", defaultDisplayValue: "[not set]" },
          { cellType: "text", name: "q2" }
        ]
      }
    ],
  });
  const prop = Serializer.findProperty("matrixdynamic", "singleInputTitleTemplate");
  const matrix = survey.getQuestionByName("matrix");
  assert.equal(prop.visibleIf(matrix), false, "singleInputTitleTemplate visibleIf, #1");
  survey.questionsOnPageMode = "inputPerPage";
  assert.equal(prop.visibleIf(matrix), true, "singleInputTitleTemplate visibleIf, #2");
  survey.questionsOnPageMode = "questionPerPage";
  assert.equal(prop.visibleIf(matrix), false, "singleInputTitleTemplate visibleIf, #3");
});
QUnit.test("ratingItem small mode", assert => {
  const survey = new SurveyModel();
  survey.fromJSON({
    elements: [
      {
        type: "matrixdynamic", name: "matrix",
        rowCount: 1,
        columns: [
          { cellType: "rating", name: "q1", rateType: "stars" }
        ]
      }
    ],
    "questionsOnPageMode": "inputPerPage"
  });
  assert.equal(survey.currentSingleQuestion.singleInputQuestion.getType(), "rating");
  assert.notOk((survey.currentSingleQuestion.singleInputQuestion as QuestionRatingModel).itemSmallMode);
});
QUnit.test("checkbox vs matrixdropdown", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "products",
        choices: ["form-library", "survey-creator", "dashboard", "pdf-generator"]
      },
      {
        type: "matrixdropdown",
        name: "matrix",
        rowsVisibleIf: "{products} contains {item}",
        columns: [
          {
            name: "nps",
            cellType: "rating"
          },
          {
            name: "valued-features",
            cellType: "comment"
          }
        ],
        rows: ["form-library", "survey-creator", "dashboard", "pdf-generator"],
        hideIfRowsEmpty: true
      }
    ],
    questionsOnPageMode: "inputPerPage",
  });
  const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("products");
  const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
  checkbox.value = ["form-library", "survey-creator"];
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "matrix", "currentSingleQuestion is matrix, #1");
  assert.equal(matrix.singleInputQuestion.name, "nps", "singleInputQuestion is nps, #1");
  assert.equal(matrix.singleInputLocTitle.textOrHtml, "form-library", "matrix.singleInputLocTitle.textOrHtml, #1");
  survey.performPrevious();
  assert.equal(survey.currentSingleQuestion.name, "products", "currentSingleQuestion is products, #2");
  checkbox.value = ["survey-creator", "dashboard"];
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "matrix", "currentSingleQuestion is matrix, #3");
  assert.equal(matrix.singleInputQuestion.name, "nps", "singleInputQuestion is nps, #3");
  assert.equal(matrix.singleInputLocTitle.textOrHtml, "survey-creator", "matrix.singleInputLocTitle.textOrHtml, #3");
});