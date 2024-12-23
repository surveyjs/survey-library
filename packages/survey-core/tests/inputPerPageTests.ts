import { SurveyModel } from "../src/survey";
import { PageModel } from "../src/page";
import { PanelModel } from "../src/panel";

export default QUnit.module("Input Per Page Tests");

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
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "q2", "currentSingleQuestion is q2");
  assert.equal(page.visibleRows[0].elements[0].name, "q2", "visible question is q2");
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
  const el = <PanelModel>page.visibleRows[0].elements[0];
  assert.ok(el.survey, "survey is set");
  assert.ok(el.data, "survey data is set");
  assert.equal(el.isPanel, true, "visible question is panel, #1");
  assert.equal(el.name, "panel1_singlePanel", "visible question name, #1");
  assert.equal(el.visibleRows.length, 1, "There is one row, #1");
  assert.equal(el.visibleRows[0].elements[0].name, "q1", "The q1 is in the row, #1");

  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #2");
  assert.equal(el.isPanel, true, "visible question is panel, #2");
  assert.equal(el.name, "panel1_singlePanel", "visible question name, #2");
  assert.equal(el.visibleRows.length, 1, "There is one row, #2");
  assert.equal(el.visibleRows[0].elements[0].name, "q2", "The q1 is in the row, #2");

  survey.performPrevious();
  assert.equal(survey.currentSingleQuestion.name, "panel1", "currentSingleQuestion is panel1, #3");
  assert.equal(el.isPanel, true, "visible question is panel, #3");
  assert.equal(el.name, "panel1_singlePanel", "visible question name, #3");
  assert.equal(el.visibleRows.length, 1, "There is one row, #3");
  assert.equal(el.visibleRows[0].elements[0].name, "q1", "The q1 is in the row, #3");

  survey.performNext();
  survey.performNext();
  assert.equal(survey.currentSingleQuestion.name, "q3", "currentSingleQuestion is q3, #4");
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
