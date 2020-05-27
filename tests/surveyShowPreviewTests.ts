import { SurveyModel } from "../src/survey";
import { surveyLocalization } from "../src/surveyStrings";
import { PanelModel } from "../src/panel";

export default QUnit.module("SurveyShowPreviewTests");

QUnit.test("Complete and Preview button visibility", function (assert) {
  var survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
  assert.equal(survey.isShowPreviewBeforeComplete, false, "no preview");
  assert.equal(
    survey.isCompleteButtonVisible,
    true,
    "complete button: running survey, no preview"
  );
  assert.equal(
    survey.isPreviewButtonVisible,
    false,
    "preview button: running survey, no preview"
  );
  assert.equal(
    survey.isCancelPreviewButtonVisible,
    false,
    "cancel preview button: running survey, no preview"
  );
  survey.showPreviewBeforeComplete = "showAllQuestions";
  assert.equal(survey.isShowPreviewBeforeComplete, true, "has preview");
  assert.equal(
    survey.isCompleteButtonVisible,
    false,
    "complete button: running survey, has preview"
  );
  assert.equal(
    survey.isPreviewButtonVisible,
    true,
    "preview button: running survey, has preview"
  );
  assert.equal(
    survey.isCancelPreviewButtonVisible,
    false,
    "cancel preview button: running survey, has preview"
  );
  survey.showPreview();
  assert.equal(
    survey.isCompleteButtonVisible,
    true,
    "complete button: running survey, show preview"
  );
  assert.equal(
    survey.isPreviewButtonVisible,
    false,
    "preview button: running survey, show preview"
  );
  assert.equal(
    survey.isCancelPreviewButtonVisible,
    true,
    "cancel preview button: running survey, show preview"
  );
  survey.cancelPreview();
  assert.equal(
    survey.isCompleteButtonVisible,
    false,
    "complete button: running survey, cancel preview"
  );
  assert.equal(
    survey.isPreviewButtonVisible,
    true,
    "preview button: running survey, cancel preview"
  );
  assert.equal(
    survey.isCancelPreviewButtonVisible,
    false,
    "cancel preview button: running survey, cancel preview"
  );
});

QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', do not show preview if there is an error",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2", isRequired: true }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 1;
    assert.equal(survey.showPreview(), false, "It should show error");
    assert.equal(
      survey.state,
      "running",
      "state is running, there is an error"
    );
    assert.equal(
      survey.getQuestionByName("q2").errors.length,
      1,
      "There is a requried error"
    );
    survey.setValue("q2", "val2");
    assert.equal(survey.showPreview(), true, "There is no errors");
    assert.equal(
      survey.getQuestionByName("q2").errors.length,
      0,
      "There is no requried error"
    );
    assert.equal(
      survey.state,
      "preview",
      "state is preview, there is no errors"
    );
  }
);

QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', check currentPage on showing preview",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    assert.equal(survey.visiblePages.length, 1, "We have one page now");
    assert.equal(
      survey.visiblePages[0].getPanels().length,
      2,
      "There are two panels - one panel per page"
    );
    var question = survey.visiblePages[0].getPanels()[0].elements[0];
    assert.equal(question.name, "q1", "First panel contains first question");
    assert.equal(
      question.isReadOnly,
      true,
      "Question are read-only in preview mode"
    );
    survey.cancelPreview();
    assert.equal(survey.visiblePages.length, 2, "There are two pages");
    assert.equal(
      survey.visiblePages[0].getPanels().length,
      0,
      "There is no panel in origional page"
    );
    question = survey.visiblePages[0].elements[0];
    assert.equal(question.name, "q1", "First page contains first question");
    assert.equal(
      question.isReadOnly,
      false,
      "Question is not read-only in running mode"
    );
    assert.equal(
      survey.currentPageNo,
      1,
      "The current page number is the same, the last one"
    );
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', restore pages before onComplete",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    survey.completeLastPage();
    assert.equal(survey.visiblePages.length, 2, "We have two pages again");
    assert.equal(survey.currentPageNo, 1, "Current page is the last one");
  }
);

QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', questionsOnPageMode = 'singlePage'",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
      ],
    });
    survey.questionsOnPageMode = "singlePage";
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    survey.cancelPreview();
    assert.equal(survey.visiblePages.length, 1, "We have one page");
    assert.equal(survey.getAllPanels().length, 2, "There are two panels");
    assert.equal(survey.getAllQuestions().length, 2, "There are two questions");
    assert.equal(
      survey.getAllQuestions()[0].isReadOnly,
      false,
      "Questions are not readonly"
    );
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', questionsOnPageMode = 'questionPerPage'",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
          ],
        },
        {
          elements: [
            { type: "text", name: "q3" },
            { type: "text", name: "q4" },
          ],
        },
      ],
    });
    survey.questionsOnPageMode = "questionPerPage";
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    assert.equal(survey.visiblePages.length, 1, "We have one page");
    assert.equal(survey.getAllPanels().length, 4, "There is four panels");
    assert.equal(
      survey.getAllQuestions().length,
      4,
      "There are four questions"
    );
    assert.equal(
      survey.getAllQuestions()[0].isReadOnly,
      true,
      "Questions are readonly"
    );
    survey.cancelPreview();
    assert.equal(
      survey.visiblePages.length,
      4,
      "We have one page per question"
    );
    assert.equal(survey.getAllPanels().length, 0, "There is no panels");
    assert.equal(
      survey.getAllQuestions().length,
      4,
      "There are four questions"
    );
    assert.equal(
      survey.getAllQuestions()[0].isReadOnly,
      false,
      "Questions are not readonly"
    );
  }
);
QUnit.test("showPreviewBeforeComplete = 'showAnsweredQuestions'", function (
  assert
) {
  var survey = new SurveyModel({
    pages: [
      { elements: [{ type: "text", name: "q1" }] },
      { elements: [{ type: "text", name: "q2" }] },
    ],
  });
  survey.setValue("q2", "va1");
  survey.showPreviewBeforeComplete = "showAnsweredQuestions";
  survey.currentPageNo = 1;
  survey.showPreview();
  assert.equal(survey.visiblePages.length, 1, "We have one page");
  assert.equal(survey.getAllPanels().length, 2, "There are two panels");
  assert.equal(survey.getAllQuestions().length, 2, "There are two questions");
  assert.equal(
    survey.getAllPanels()[0].isVisible,
    false,
    "question inside is empty"
  );
  assert.equal(
    survey.getAllQuestions()[0].isVisible,
    false,
    "question is empty"
  );
  assert.equal(
    survey.getAllPanels()[1].isVisible,
    true,
    "question inside is not empty"
  );
  assert.equal(
    survey.getAllQuestions()[1].isVisible,
    true,
    "question is not empty"
  );
});
QUnit.test(
  "showPreviewBeforeComplete = 'showAllQuestions', edit page",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        {
          elements: [
            {
              type: "panel",
              name: "panel1",
              elements: [{ type: "text", name: "q2" }],
            },
          ],
        },
        { elements: [{ type: "text", name: "q3" }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAllQuestions";
    survey.currentPageNo = 2;
    assert.equal(survey.getAllPanels().length, 1, "There is one panel");
    assert.equal(
      (<PanelModel>survey.getAllPanels()[0]).hasEditButton,
      false,
      "The panel is not editable"
    );
    survey.showPreview();
    assert.equal(survey.visiblePageCount, 1, "Show preview");
    assert.equal(survey.getAllPanels().length, 4, "There are four panels");
    assert.equal(
      (<PanelModel>survey.getAllPanels()[0]).hasEditButton,
      true,
      "The panel is editable"
    );
    var panel = <PanelModel>survey.getAllPanels()[1].elements[0];
    assert.equal(
      panel.hasEditButton,
      false,
      "The standard panel doesn't have edit button"
    );
    (<PanelModel>survey.getAllPanels()[1]).cancelPreview();
    assert.equal(survey.state, "running", "Preview is canceled");
    assert.equal(survey.visiblePageCount, 3, "There are three visible pages");
    assert.equal(survey.currentPageNo, 1, "We are editing the second page");
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAnsweredQuestions', edit page",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
        { elements: [{ type: "text", name: "q3" }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAnsweredQuestions";
    survey.data = { q2: "2", q3: "3" };
    survey.currentPageNo = 2;
    survey.showPreview();
    assert.equal(survey.visiblePageCount, 1, "Show preview");
    assert.equal(survey.getAllPanels().length, 3, "There are three panels");
    (<PanelModel>survey.getAllPanels()[1]).cancelPreview();
    assert.equal(survey.state, "running", "Preview is canceled");
    assert.equal(survey.visiblePageCount, 3, "There are three visible pages");
    assert.equal(survey.currentPageNo, 1, "We are editing the second page");
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAnsweredQuestions', do not hide questions on running state",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q1" }] },
        { elements: [{ type: "text", name: "q2" }] },
        { elements: [{ type: "text", name: "q3" }] },
      ],
    });
    survey.showPreviewBeforeComplete = "showAnsweredQuestions";
    assert.equal(survey.visiblePageCount, 3, "There are 3 visible pages");
  }
);
QUnit.test(
  "showPreviewBeforeComplete = 'showAnsweredQuestions', Bug#2190",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        {
          elements: [
            { type: "text", name: "question1", defaultValue: "A" },
            { type: "text", name: "question2" },
          ],
        },
        {
          elements: [
            { type: "text", name: "question3", defaultValue: "B" },
            { type: "text", name: "question4" },
            { type: "text", name: "question5" },
          ],
        },
      ],
    });
    survey.showPreviewBeforeComplete = "showAnsweredQuestions";
    survey.currentPageNo = 1;
    survey.showPreview();
    (<PanelModel>survey.getAllPanels()[0]).cancelPreview();
    assert.equal(survey.currentPageNo, 0, "Go to the first page");
  }
);
