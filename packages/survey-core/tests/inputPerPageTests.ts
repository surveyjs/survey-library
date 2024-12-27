import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { PanelModel } from "../src/panel";
import { Question } from "../src/question";
import { IElement } from "../src/base-interfaces";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";

export default QUnit.module("Input Per Page Tests");

function getSingleQuestion(page: PageModel): Question {
  if(page.visibleRows.length === 0) return <any>undefined;
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
  assert.notOk(survey.currentSingleQuestion, "currentSingleQuestion is undefined");
  assert.equal(page.visibleRows.length, 2, "There are two rows");
  assert.equal(page.visibleRows[0].elements[0].name, "q1", "visible question is q1");
  assert.equal(page.visibleRows[1].elements[0].name, "q2", "visible question is q2");
});
QUnit.test("singleInput for panel dynamic", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
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
  assert.equal(survey.isSingleVisibleInput, true, "isSingleVisibleInput is true");
  const panel = survey.getQuestionByName("panel1");
  assert.equal(panel.panelCount, 1, "panelCount is 1");
  assert.equal(panel.panels.length, 1, "There is one panel");
  const page: PageModel = survey.currentPage;
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #1");
  let el = page.visibleRows[0].elements[0];
  assert.equal(el.name, "panel1", "page visible row is panel1, #1");
  assert.equal(panel.singleInputQuestion.name, "q1", "singleInputQuestion, #1");

  survey.performNext();
  el = <PanelModel>page.visibleRows[0].elements[0];
  assert.equal(el.name, "panel1", "page visible row is panel1, #2");
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #2");
  assert.equal(panel.singleInputQuestion.name, "q2", "singleInputQuestion, #2");

  survey.performPrevious();
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #3");
  assert.equal(panel.singleInputQuestion.name, "q1", "singleInputQuestion, #3");

  survey.performNext();
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "q3", "currentSingleQuestion is q3, #4");
  assert.notOk(survey.getQuestionByName("q3").singleInputQuestion, "singleInputQuestion, #4");
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
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #1");
  assert.equal(survey.isShowNextButton, true, "next buttton, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #1");
  survey.performNext();
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #2");
  assert.equal(survey.isShowNextButton, true, "next buttton, #2");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #2");
  survey.performNext();
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #3");
  assert.equal(survey.isShowNextButton, false, "next buttton, #3");
  assert.equal(survey.isCompleteButtonVisible, true, "complete buttton, #3");
  survey.performPrevious();
  assert.equal(survey.isShowPrevButton, true, "prev buttton, #4");
  assert.equal(survey.isShowNextButton, true, "next buttton, #4");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #4");
  survey.performPrevious();
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #5");
  assert.equal(survey.isShowNextButton, true, "next buttton, #5");
  assert.equal(survey.isCompleteButtonVisible, false, "complete buttton, #5");
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
  const page: PageModel = survey.currentPage;
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #1");
  assert.equal(panel.singleInputQuestion.name, "q1", "The q1 is in the row, #1");
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Item: 1 - ", "wrapper panel title, #1.1");
  let q1 = panel.singleInputQuestion;
  q1.value = "abc";
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Item: 1 - abc", "wrapper panel title, #1.2");

  survey.performNext();
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Item: 2 - ", "wrapper panel title, #2.2");
  q1 = panel.singleInputQuestion;
  q1.value = "edf";
  assert.equal(panel.singleInputLocTitle.textOrHtml, "Item: 2 - edf", "wrapper panel title, #2.2");
});
QUnit.test("singleInput and panel dynamic & add/remove panels in navigation bar", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic", name: "panel1",
        panelCount: 2,
        templateElements: [
          { type: "text", name: "q1" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const panel1 = survey.getQuestionByName("panel1");
  const bar = survey.navigationBar;
  assert.ok(bar.getActionById("sv-singleinput-add"), "addBtn exists, #1");
  assert.ok(bar.getActionById("sv-singleinput-remove"), "removeBtn exists, #1");
  assert.equal(panel1.singleInputQuestion.name, "q1", "singleInputQuestion, #1");
  survey.questionsOnPageMode = "standard";
  assert.notOk(bar.getActionById("sv-singleinput-add"), "addBtn exists, #2");
  assert.notOk(bar.getActionById("sv-singleinput-remove"), "removeBtn exists, #2");
  assert.equal(survey.currentSingleQuestion?.name, undefined, "currentSingleQuestion #2");
  assert.equal(panel1.singleInputQuestion?.name, undefined, "singleInputQuestion, #2");
  survey.questionsOnPageMode = "inputPerPage";
  assert.equal(panel1.singleInputQuestion.name, "q1", "singleInputQuestion, #3");
  const addBtn = bar.getActionById("sv-singleinput-add");
  const removeBtn = bar.getActionById("sv-singleinput-remove");
  assert.ok(addBtn, "addBtn exists, #3");
  assert.ok(removeBtn, "removeBtn exists, #3");
  assert.equal(addBtn.visible, false, "addBtn visible #1");
  assert.equal(removeBtn.visible, true, "removeBtn visible #1");
  assert.equal(removeBtn.title, "Remove", "removeBtn text #1");
  survey.performNext();
  assert.equal(addBtn.visible, true, "addBtn visible #2");
  assert.equal(addBtn.title, "Add new", "addBtn text #2");
  assert.equal(removeBtn.visible, true, "removeBtn visible #2");
  assert.equal(removeBtn.title, "Remove", "removeBtn text #2");
  addBtn.action();
  assert.equal(panel1.panelCount, 3, "New panel is added");
  assert.equal(addBtn.visible, true, "addBtn visible #3");
  assert.equal(removeBtn.visible, true, "removeBtn visible #3");
  removeBtn.action();
  assert.equal(panel1.panelCount, 2, "Last panel is removed");
  assert.equal(addBtn.visible, true, "addBtn visible #4");
  assert.equal(removeBtn.visible, true, "removeBtn visible #4");
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
  const removeBtn = bar.getActionById("sv-singleinput-remove");
  const page: PageModel = survey.currentPage;
  assert.equal(addBtn.visible, true, "addBtn visible #1");
  assert.equal(removeBtn.visible, false, "removeBtn visible #1");
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion, #1");
  assert.equal(page.visibleRows.length, 1, "Just one visible row, #1");
  assert.equal(page.visibleRows[0].elements[0].name, "panel1", "visible question in row, #1");
  assert.equal(panel1.singleInputQuestion?.name, undefined, "singleInputQuestion, #1");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #1");
  assert.equal(survey.isShowNextButton, false, "next buttton, #1");
  panel1.addPanelUI();
  assert.equal(panel1.panelCount, 1, "panelCount #2");
  assert.equal(addBtn.visible, false, "addBtn visible #2");
  assert.equal(removeBtn.visible, true, "removeBtn visible #2");
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion, #2");
  assert.equal(panel1.singleInputQuestion.name, "q1", "singleInputQuestion, #2");
  assert.equal(survey.isShowPrevButton, false, "prev buttton, #2");
  assert.equal(survey.isShowNextButton, true, "next buttton, #2");
  removeBtn.action();
  assert.equal(panel1.panelCount, 0, "panelCount #3");
  assert.equal(addBtn.visible, true, "addBtn visible #3");
  assert.equal(removeBtn.visible, false, "removeBtn visible #3");
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion, #3");
  assert.equal(page.visibleRows.length, 1, "Just one visible row, #3");
  assert.equal(page.visibleRows[0].elements[0].name, "panel1", "visible question in row, #3");
  assert.equal(panel1.singleInputQuestion?.name, undefined, "singleInputQuestion, #3");
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
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion, #1");
  assert.equal(addBtn.visible, false, "addBtn visible #1");
  assert.equal(getSingleQuestion(page).name, "q1", "getSingleQuestion is q1");
  assert.equal(survey.performNext(), false, "next #2");
  assert.equal(getSingleQuestion(page).name, "q1", "getSingleQuestion is q1, #2");
  assert.equal(getSingleQuestion(page).errors.length, 1, "getSingleQuestion errors, #2");
  getSingleQuestion(page).value = "a";
  assert.equal(survey.performNext(), true, "next #3");
  assert.equal(getSingleQuestion(page).name, "q2", "getSingleQuestion is q2, #3");
  assert.equal(addBtn.visible, true, "addBtn visible #3");
  addBtn.action();
  assert.equal(getSingleQuestion(page).name, "q2", "getSingleQuestion is q2, #4");
  assert.equal(getSingleQuestion(page).errors.length, 1, "getSingleQuestion errors, #4");
  assert.equal(addBtn.visible, true, "addBtn visible #4");
  getSingleQuestion(page).value = "b";
  addBtn.action();
  assert.equal(getSingleQuestion(page).name, "q1", "getSingleQuestion is q1, #5");
  assert.equal(addBtn.visible, false, "addBtn visible #5");
  assert.equal(panel1.panelCount, 2, "panelCount #5");
  getSingleQuestion(page).value = "c";
  survey.performNext();
  getSingleQuestion(page).value = "d";
  assert.equal(survey.completeLastPage(), true, "compete");
  assert.deepEqual(survey.data, { panel1: [{ q1: "a", q2: "b" }, { q1: "c", q2: "d" }] }, "survey.data");
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
        rows: ["Row 1", "Row 2"]
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
        columns: [
          { cellType: "text", name: "col1", title: "Column 1" },
          { cellType: "text", name: "col2", title: "Column 2" }
        ],
        rowCount: 1
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion.name, #1");
  assert.equal(matrix1.singleInputQuestion.title, "Column 1", "singleInputQuestion.title, #1");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #1");
  survey.performNext();
  assert.equal(matrix1.singleInputQuestion.name, "col2", "singleInputQuestion.name, #2");
  assert.equal(matrix1.singleInputQuestion.title, "Column 2", "singleInputQuestion.title, #2");
  assert.equal(survey.isCompleteButtonVisible, true, "isCompleteButtonVisible #2");
  matrix1.removeRow(0);
  assert.equal(matrix1.singleInputQuestion?.name, undefined, "singleInputQuestion.name, #3");
  assert.equal(survey.isCompleteButtonVisible, true, "isCompleteButtonVisible #3");
  matrix1.addRow();
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion.name, #4");
  assert.equal(matrix1.singleInputQuestion.title, "Column 1", "singleInputQuestion.title, #4");
  assert.equal(survey.isCompleteButtonVisible, false, "isCompleteButtonVisible #4");
});
QUnit.test("singleInput and matrix dynamic & add/remove rows in navigation bar", assert => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic", name: "matrix1",
        rowCount: 2,
        columns: [
          { cellType: "text", name: "col1" }
        ]
      }
    ],
    questionsOnPageMode: "inputPerPage"
  });
  const matrix1 = survey.getQuestionByName("matrix1");
  const bar = survey.navigationBar;
  assert.ok(bar.getActionById("sv-singleinput-add"), "addBtn exists, #1");
  assert.ok(bar.getActionById("sv-singleinput-remove"), "removeBtn exists, #1");
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion, #1");
  survey.questionsOnPageMode = "standard";
  assert.notOk(bar.getActionById("sv-singleinput-add"), "addBtn exists, #2");
  assert.notOk(bar.getActionById("sv-singleinput-remove"), "removeBtn exists, #2");
  assert.equal(survey.currentSingleQuestion?.name, undefined, "currentSingleQuestion #2");
  assert.equal(matrix1.singleInputQuestion?.name, undefined, "singleInputQuestion, #2");
  survey.questionsOnPageMode = "inputPerPage";
  assert.equal(matrix1.singleInputQuestion.name, "col1", "singleInputQuestion, #3");
  const addBtn = bar.getActionById("sv-singleinput-add");
  const removeBtn = bar.getActionById("sv-singleinput-remove");
  assert.ok(addBtn, "addBtn exists, #3");
  assert.ok(removeBtn, "removeBtn exists, #3");
  assert.equal(addBtn.visible, false, "addBtn visible #1");
  assert.equal(removeBtn.visible, true, "removeBtn visible #1");
  assert.equal(removeBtn.title, "Remove", "removeBtn text #1");
  survey.performNext();
  assert.equal(addBtn.visible, true, "addBtn visible #2");
  assert.equal(addBtn.title, "Add Row", "addBtn text #2");
  assert.equal(removeBtn.visible, true, "removeBtn visible #2");
  assert.equal(removeBtn.title, "Remove", "removeBtn text #2");
  addBtn.action();
  assert.equal(matrix1.rowCount, 3, "New row is added");
  assert.equal(addBtn.visible, true, "addBtn visible #3");
  assert.equal(removeBtn.visible, true, "removeBtn visible #3");
  removeBtn.action();
  assert.equal(matrix1.rowCount, 2, "Last row is removed");
  assert.equal(addBtn.visible, true, "addBtn visible #4");
  assert.equal(removeBtn.visible, true, "removeBtn visible #4");
});
