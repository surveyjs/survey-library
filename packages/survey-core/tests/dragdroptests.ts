import { SurveyModel } from "../src/survey";
import { QuestionTextModel } from "../src/question_text";
import { PanelModel } from "../src/panel";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { FlowPanelModel } from "../src/flowpanel";
import { QuestionMatrixModel } from "../src/question_matrix";
import { settings } from "../src/settings";

export default QUnit.module("Drag and Drop Tests");

QUnit.test("Show/hide new created item, simple test", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  var target = new QuestionTextModel("qt");
  page.dragDropStart(null, target);
  assert.equal(page.rows.length, 2, "Two elements initially");

  assert.equal(page.dragDropMoveTo(q1, false), true, "It can be done: 1");
  assert.equal(page.rows.length, 3, "Move 1");
  assert.equal(page.rows[0].elements[0].name, "qt", "Move 1");

  assert.equal(page.dragDropMoveTo(q1, true), true, "It can be done: 2");
  assert.equal(page.rows.length, 3, "Move 2");
  assert.equal(page.rows[1].elements[0].name, "qt", "Move 2");

  assert.equal(page.dragDropMoveTo(q2, false), true, "It can be done: 3");
  assert.equal(page.rows.length, 3, "Move 3");
  assert.equal(page.rows[1].elements[0].name, "qt", "Move 3");

  assert.equal(page.dragDropMoveTo(q2, true), true, "It can be done: 4");
  assert.equal(page.rows.length, 3, "Move 4");
  assert.equal(page.rows[2].elements[0].name, "qt", "Move 4");

  page.dragDropMoveTo(null);

  assert.equal(page.rows.length, 2, "clear destination");
  assert.equal(page.elements.length, 2, "still 2 questions");

  page.dragDropMoveTo(q2, false);
  assert.equal(page.rows.length, 3, "Move 6");
  assert.equal(page.rows[1].elements[0].name, "qt", "Move 6");
  page.dragDropFinish();
  assert.equal(page.questions.length, 3, "3 questions now");
  assert.equal(page.questions[1].name, "qt", "It is a second question");
});
QUnit.test("Move item to the end", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  var q3 = page.addNewQuestion("text", "q3");
  var target = new QuestionTextModel("q1");

  page.dragDropStart(q1, target);
  page.dragDropMoveTo(q3, true);
  page.dragDropFinish();
  assert.equal(page.questions.length, 3, "we have only two questions");
  assert.equal(page.questions[2].name, "q1", "The last question is q1 now");
});
QUnit.test("Do not move question to the same position", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  var q3 = page.addNewQuestion("text", "q3");
  var target = new QuestionTextModel("q2");

  page.dragDropStart(q2, target);
  assert.equal(page.rows.length, 3, "Initial 3 rows");
  page.dragDropMoveTo(q1, false);
  assert.equal(page.rows.length, 4, "It should be 4 rows, above the first row");
  page.dragDropMoveTo(q1, true);
  assert.equal(page.rows.length, 3, "It should be 3 rows, next the first row");
  page.dragDropMoveTo(q2, false);
  assert.equal(
    page.rows.length,
    3,
    "It should be 3 rows, above the second row"
  );
  page.dragDropMoveTo(q2, true);
  assert.equal(page.rows.length, 3, "It should be 3 rows, next the second row");
  page.dragDropMoveTo(q3, false);
  assert.equal(page.rows.length, 3, "It should be 3 rows, above the third row");
  page.dragDropMoveTo(q3, true);
  assert.equal(page.rows.length, 4, "It should be 4 rows, next the third row");
});
QUnit.test(
  "Do not move question to the same position, from bottom to top",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("p1");
    var q1 = page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var target = new QuestionTextModel("q3");

    page.dragDropStart(q3, target);
    assert.equal(page.rows.length, 3, "Initial 3 rows");
    page.dragDropMoveTo(q3, true);
    assert.equal(
      page.rows.length,
      3,
      "It should be 3 rows, next the third row"
    );
    page.dragDropMoveTo(q3, false);
    assert.equal(
      page.rows.length,
      3,
      "It should be 3 rows, above the third row"
    );
    page.dragDropMoveTo(q2, true);
    assert.equal(
      page.rows.length,
      3,
      "It should be 3 rows, next the second row"
    );
    page.dragDropMoveTo(q2, false);
    assert.equal(
      page.rows.length,
      4,
      "It should be 4 rows, above the second row"
    );
    page.dragDropMoveTo(q1, true);
    assert.equal(
      page.rows.length,
      4,
      "It should be 4 rows, next the first row"
    );
    page.dragDropMoveTo(q1, false);
    assert.equal(
      page.rows.length,
      4,
      "It should be 4 rows, above the first row"
    );
  }
);
QUnit.test("Dropping element on the source should do nothing", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q1 = page.addNewQuestion("text", "q1");
  var target = new QuestionTextModel("q1");

  page.dragDropStart(q1, target);
  assert.equal(page.rows.length, 1, "Initial 1 rows");
  page.dragDropMoveTo(q1, false);
  assert.equal(page.rows.length, 1, "still 1 rows");
  page.dragDropFinish();
  assert.equal(page.elements.length, 1, "It should be stil one element");
});
QUnit.test("Do not move remove the target without source", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  var target = new QuestionTextModel("q1");

  page.dragDropStart(null, target);
  assert.equal(page.rows.length, 2, "Initial 2 rows");
  page.dragDropMoveTo(q2, true);
  assert.equal(page.rows.length, 3, "Target is shown");
  page.dragDropMoveTo(target, true);
  assert.equal(page.rows.length, 3, "Target is still shown");
});
QUnit.test("Show/hide/create for empty page", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var target = new QuestionTextModel("qt");
  page.dragDropStart(null, target);
  assert.equal(page.rows.length, 0, "There are no elements initially");
  assert.equal(page.dragDropMoveTo(page, false), true, "It can be done: 1");
  assert.equal(page.rows.length, 1, "Move 1");
  assert.equal(page.rows[0].elements[0].name, "qt", "Move 1");
  page.dragDropMoveTo(null);
  assert.equal(page.rows.length, 0, "clear destination");
  page.dragDropMoveTo(page, false);
  page.dragDropFinish();
  assert.equal(page.questions.length, 1, "one question now");
  assert.equal(page.questions[0].name, "qt", "A new question");
});
QUnit.test("Move item startWithNewLine=false", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  var q3 = page.addNewQuestion("text", "q3");
  q1.startWithNewLine = false;
  var target = new QuestionTextModel("q1");
  target.startWithNewLine = false;

  page.dragDropStart(q1, target);
  page.dragDropMoveTo(q3, true);
  assert.equal(page.rows.length, 3, "Move 1. No rows should be added");
  assert.equal(
    page.rows[2].elements.length,
    2,
    "Move 1. There are two elements in the last row"
  );
  assert.equal(
    page.rows[2].elements[1].name,
    "q1",
    "Move 1. The first question is the last element"
  );
  page.dragDropMoveTo(q3, false);
  assert.equal(page.rows.length, 3, "Move 2. No rows should be added");
  assert.equal(
    page.rows[1].elements.length,
    2,
    "Move 2. There are two elements in the second row"
  );
  assert.equal(
    page.rows[2].elements.length,
    1,
    "Move 2. There is one elements in the last row"
  );
  assert.equal(
    page.rows[1].elements[1].name,
    "q1",
    "Move 2. The first question is the last element in the first row"
  );
  page.dragDropFinish();
  assert.equal(page.questions.length, 3, "we have only two questions");
  assert.equal(page.questions[1].name, "q1", "The second question is q1 now");
});
QUnit.test("Move item startWithNewLine=false, 2", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  var q3 = page.addNewQuestion("text", "q3");
  q2.startWithNewLine = false;
  var target = new QuestionTextModel("q2");
  target.startWithNewLine = false;

  page.dragDropStart(q2, target);
  page.dragDropMoveTo(q3, true);
  page.dragDropFinish();
  assert.equal(page.questions.length, 3, "we have 3 questions");
  assert.equal(page.questions[2].name, "q2", "The last question is q2 now");
});
QUnit.test("Move item startWithNewLine=false, 3", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  q2.startWithNewLine = false;
  var target = new QuestionTextModel("q2");
  target.startWithNewLine = false;

  page.dragDropStart(q2, target);
  assert.equal(page.rows.length, 1, "There is one row");
  assert.equal(
    page.dragDropMoveTo(q1, false),
    true,
    "You can move a question here"
  );
  assert.equal(page.rows.length, 2, "There is two rows now");
  page.dragDropFinish();
  assert.equal(page.questions[0].name, "q2", "The first question is q2 now");
});
QUnit.test("Move panel startWithNewLine=false", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var p1 = page.addNewPanel("p1");
  var p2 = page.addNewPanel("p2");
  var p3 = page.addNewPanel("p3");
  p1.startWithNewLine = false;
  var target = new QuestionTextModel("p1");
  target.startWithNewLine = false;

  page.dragDropStart(p1, target);
  page.dragDropMoveTo(p3, true, true);
  assert.equal(page.rows.length, 3, "Move 1. No rows should be added");
  assert.equal(
    page.rows[2].elements.length,
    2,
    "Move 1. There are two elements in the last row"
  );
  assert.equal(
    page.rows[2].elements[1].name,
    "p1",
    "Move 1. The first panel is the last element"
  );
  page.dragDropMoveTo(target, false, false);
  page.dragDropMoveTo(p3, true, true);
  page.dragDropMoveTo(target, true, true);
  page.dragDropMoveTo(p3, true, true);
  assert.equal(page.rows.length, 3, "Move 1.1. No rows should be added");
  assert.equal(
    page.rows[2].elements.length,
    2,
    "Move 1.1. There are two elements in the last row"
  );
  assert.equal(
    page.rows[2].elements[1].name,
    "p1",
    "Move 1.1. The first panel is the last element"
  );
  page.dragDropMoveTo(p3, false, true);
  assert.equal(page.rows.length, 3, "Move 2. No rows should be added");
  assert.equal(
    page.rows[1].elements.length,
    2,
    "Move 2. There are two elements in the second row"
  );
  assert.equal(
    page.rows[2].elements.length,
    1,
    "Move 2. There is one elements in the last row"
  );
  assert.equal(
    page.rows[1].elements[1].name,
    "p1",
    "Move 2. The first panel is the last element in the first row"
  );
  page.dragDropFinish();
  assert.equal(page.elements.length, 3, "we have only 3 panels");
  assert.equal(page.elements[1].name, "p1", "The second element is p1 now");
});
QUnit.test("Move question into empty panel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var target = new QuestionTextModel("q1");

  page.dragDropStart(null, target);

  assert.equal(panel.rows.length, 0, "There is no rows");
  assert.equal(
    page.dragDropMoveTo(panel, false),
    true,
    "You can move a question here"
  );
  assert.equal(panel.rows.length, 1, "There is one row");
  page.dragDropFinish();
  assert.equal(panel.questions.length, 1, "There is one question in the panel");
  assert.equal(panel.questions[0].name, "q1", "It is the 'q1' question");
});
QUnit.test("Move panel into empty panel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var target = new PanelModel("p1");

  page.dragDropStart(null, target);

  assert.equal(panel.rows.length, 0, "There is no rows");
  assert.equal(
    page.dragDropMoveTo(panel),
    true,
    "You can move a question here"
  );
  assert.equal(panel.rows.length, 1, "There is one row");
  page.dragDropFinish();
  assert.equal(panel.elements.length, 1, "There is one panel in the panel");
  assert.equal(panel.elements[0].name, "p1", "It is the 'p1' panel");
});
QUnit.test("Optionally forbiden move panel into panel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var target = new PanelModel("p1");

  page.dragDropStart(null, target, 0);

  assert.equal(page.rows.length, 1, "There is one row");
  assert.equal(
    page.dragDropMoveTo(panel, false),
    true,
    "You can move a question here"
  );
  assert.equal(panel.rows.length, 0, "There is no row in panel");
  assert.equal(page.rows.length, 2, "There are two rows in page");
  page.dragDropFinish();
  assert.equal(panel.elements.length, 0, "There is no elements in panel");
  assert.equal(page.elements.length, 2, "There are two elements in page");
  assert.equal(page.elements[0].name, "p1", "It is the 'p1' panel");
});
QUnit.test("Move item in panel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var q1 = panel.addNewQuestion("text", "q1");
  var q2 = panel.addNewQuestion("text", "q2");
  var target = new QuestionTextModel("q1");

  page.dragDropStart(q1, target);

  assert.equal(panel.rows.length, 2, "There is two rows");
  assert.equal(
    page.dragDropMoveTo(q2, true),
    true,
    "You can move a question here"
  );
  assert.equal(panel.rows.length, 3, "There are 3 rows");
  assert.equal(
    panel.rows[2].elements[0].name,
    "q1",
    "Move 1. The 'q1' is in the last row"
  );
  page.dragDropFinish();
  assert.equal(
    panel.elements.length,
    2,
    "There are two questions in the panel"
  );
  assert.equal(panel.elements[1].name, "q1", "It is the 'q1' question");
});
QUnit.test("Move new item in panel with one question", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var q1 = panel.addNewQuestion("text", "q1");
  var target = new QuestionTextModel("q2");

  page.dragDropStart(null, target);

  assert.equal(panel.rows.length, 1, "There is two rows");
  assert.equal(
    page.dragDropMoveTo(panel, false, false),
    true,
    "Move 0. You can move a question before q1 here"
  );
  assert.equal(panel.rows.length, 2, "Move 0. There are 2 rows");
  assert.equal(
    panel.rows[0].elements[0].name,
    "q2",
    "Move 0. The 'q1' is in the last row"
  );
  assert.equal(
    page.dragDropMoveTo(q1, false, true),
    true,
    "Move 1. You can move a question before q1 here"
  );
  assert.equal(panel.rows.length, 2, "Move 1. There are 2 rows");
  assert.equal(
    panel.rows[0].elements[0].name,
    "q2",
    "Move 1. The 'q1' is in the last row"
  );
  assert.equal(
    page.dragDropMoveTo(q1, true, true),
    true,
    "Move 2. You can move a question after q1 here"
  );
  assert.equal(panel.rows.length, 2, "Move 1. There are 2 rows");
  assert.equal(
    panel.rows[1]["elements"][0].name,
    "q2",
    "Move 1. The 'q1' is in the last row"
  );

  page.dragDropFinish();
  assert.equal(
    panel.elements.length,
    2,
    "There are two questions in the panel"
  );
  assert.equal(panel.elements[1].name, "q2", "It is the 'q2' question");
});
QUnit.test("Move item before panel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var target = new QuestionTextModel("q1");

  page.dragDropStart(null, target);

  assert.equal(panel.rows.length, 0, "There is no rows");
  assert.equal(
    page.dragDropMoveTo(panel, false, true),
    true,
    "You can move a question here"
  );
  assert.equal(panel.rows.length, 0, "There is no rows in panel");
  assert.equal(page.rows.length, 2, "There are two rows in the page");
  page.dragDropFinish();
  assert.equal(page.elements.length, 2, "There are two elements on the page");
  assert.equal(page.elements[0].name, "q1", "The first element is 'q1'");
});
QUnit.test("Move item after panel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var target = new QuestionTextModel("q1");

  page.dragDropStart(null, target);

  assert.equal(panel.rows.length, 0, "There is no rows");
  assert.equal(
    page.dragDropMoveTo(panel, true, true),
    true,
    "You can move a question here"
  );
  assert.equal(panel.rows.length, 0, "There is no rows in panel");
  assert.equal(page.rows.length, 2, "There are two rows in the page");
  page.dragDropFinish();
  assert.equal(page.elements.length, 2, "There are two elements on the page");
  assert.equal(page.elements[1].name, "q1", "The first element is 'q1'");
});
QUnit.test("Move panel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q1");
  var target = new PanelModel("panel1");

  page.dragDropStart(null, target);

  assert.equal(page.rows.length, 2, "There is no rows");

  assert.equal(
    page.dragDropMoveTo(q1, false),
    true,
    "You can move a panel here"
  );
  assert.equal(page.rows.length, 3, "Move 1. There are 3 rows");
  assert.equal(
    page.rows[0].elements[0].name,
    "panel1",
    "Move 1. The panel is in the first row"
  );

  assert.equal(
    page.dragDropMoveTo(q1, true),
    true,
    "You can move a panel here"
  );
  assert.equal(page.rows.length, 3, "Move 2. There are 3 rows");
  assert.equal(
    page.rows[1]["elements"][0].name,
    "panel1",
    "Move 2. The panel is in the first row"
  );

  assert.equal(
    page.dragDropMoveTo(q2, true),
    true,
    "You can move a panel here"
  );
  assert.equal(page.rows.length, 3, "Move 3. There are 3 rows");
  assert.equal(
    page.rows[2].elements[0].name,
    "panel1",
    "Move 3. The panel is in the first row"
  );

  assert.equal(
    page.dragDropMoveTo(target, true),
    false,
    "You can't move to itself"
  );

  page.dragDropMoveTo(q1, false);
  page.dragDropFinish();
  assert.equal(page.elements.length, 3, "There are 3 elements on the page");
  assert.equal(
    page.elements[0].name,
    "panel1",
    "The first element is 'panel1'"
  );
});
QUnit.test("Move panel, 2", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = page.addNewQuestion("text", "q1");
  var target = new PanelModel("panel1");

  page.dragDropStart(null, target);

  assert.equal(page.rows.length, 1, "There is no rows");

  assert.equal(
    page.dragDropMoveTo(q1, true),
    true,
    "You can move a panel here"
  );
  assert.equal(page.rows.length, 2, "Move 1. There are 2 rows");
  assert.equal(
    page.rows[0].elements[0].name,
    "q1",
    "Move 1. The q1 is in the first row"
  );
  assert.equal(
    page.rows[1].elements[0].name,
    "panel1",
    "Move 1. The panel1 is in the last row"
  );

  assert.equal(
    page.dragDropMoveTo(q1, true),
    true,
    "Move 2. You can move a panel here"
  );
  assert.equal(page.rows.length, 2, "Move 2. There are 2 rows");
  assert.equal(
    page.rows[0].elements[0].name,
    "q1",
    "Move 2. The q1 is in the first row"
  );
  assert.equal(
    page.rows[1].elements[0].name,
    "panel1",
    "Move 2. The panel1 is in the last row"
  );
});
QUnit.test("Move existing panel, 1", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = page.addNewQuestion("text", "q1");
  var panel = page.addNewPanel("panel1");
  var q2 = panel.addNewQuestion("text", "q2");
  var target = new PanelModel("panel1");
  target.addNewQuestion("text", "q2");

  page.dragDropStart(panel, target);

  assert.equal(page.rows.length, 2, "There are 2 rows");
  page.dragDropMoveTo(q1, true);
  assert.equal(page.rows.length, 2, "Move 1. There are still 2 rows");
  assert.equal(
    page.dragDropMoveTo(q1, false),
    true,
    "You can move a panel here"
  );
  assert.equal(page.rows.length, 3, "Move 2. There are 3 rows");
  assert.equal(
    page.rows[0].elements[0].name,
    "panel1",
    "Move 2. The panel1 is in the first row"
  );
  assert.equal(
    page.rows[1].elements[0].name,
    "q1",
    "Move 2. The q1 is in the second row"
  );
  page.dragDropFinish();
  assert.equal(page.elements.length, 2, "There are 2 elements on the page");
  assert.equal(page.elements[0].name, "panel1", "The first element is panel1");
  assert.equal(page.elements[1].name, "q1", "The second element is q1");
  var p = <PanelModel>page.elements[0];
  assert.equal(p.elements.length, 1, "There is one element in the panel");
  assert.equal(
    p.elements[0].name,
    "q2",
    "The question in the panel is correct"
  );
});
QUnit.test("Move question out of the panel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = page.addNewPanel("panel1");
  var q1 = panel.addNewQuestion("text", "q1");

  var target = new QuestionTextModel("q1");

  page.dragDropStart(q1, target);

  assert.equal(
    page.dragDropMoveTo(panel, false, true),
    true,
    "Move 1. You can move a question here"
  );
  assert.equal(page.rows.length, 2, "Move 1. There are 2 rows");
  assert.equal(
    page.rows[0].elements[0].name,
    "q1",
    "Move 1. The q1 is in the first row"
  );
  assert.equal(
    page.rows[1].elements[0].name,
    "panel1",
    "Move 1. The panel1 is in the last row"
  );
  assert.equal(panel.rows.length, 1, "Move 1. The panel has one rows");

  page.dragDropFinish();
  assert.equal(page.elements.length, 2, "There are 2 elements on the page");
  assert.equal(page.elements[0].name, "q1", "The first element is 'q1'");
});
QUnit.test("Add item into page", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var target = new PanelModel("panel1");

  page.dragDropStart(null, target);

  assert.equal(
    page.dragDropMoveTo(page, false),
    true,
    "You can move a panel here"
  );
  assert.equal(page.rows.length, 1, "There are one in the page");
  page.dragDropFinish();
  assert.equal(page.elements.length, 1, "There is one element on the page");
  assert.equal(
    page.elements[0].name,
    "panel1",
    "The first element is 'panel1'"
  );
});

QUnit.test("Move item into empty paneldynamic", function (assert) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  var page = survey.addNewPage("page1");
  var panelDynamic = <QuestionPanelDynamicModel>(
    page.addNewQuestion("paneldynamic", "panel1")
  );
  assert.equal(
    panelDynamic.template.elements.length,
    0,
    "There is no questions in the template"
  );
  var target = new QuestionTextModel("q1");
  page.dragDropStart(null, target);
  assert.equal(
    page.dragDropMoveTo(panelDynamic.template, true),
    true,
    "You can move a question here"
  );
  page.dragDropFinish();
  assert.equal(
    panelDynamic.template.elements.length,
    1,
    "There is a question in the template"
  );
  assert.equal(
    panelDynamic.template.elements[0].name,
    "q1",
    "It is the 'q1' question"
  );
});

QUnit.test("Move item into empty detailPanel", function (assert) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  var page = survey.addNewPage("page1");
  var matrix = <QuestionMatrixDynamicModel>(
    page.addNewQuestion("matrixdynamic", "matrix")
  );
  matrix.detailPanelMode = "underRow";
  assert.equal(
    matrix.detailPanel.elements.length,
    0,
    "There is no questions in the detailPanel"
  );
  var target = new QuestionTextModel("q1");
  page.dragDropStart(null, target);
  assert.equal(
    page.dragDropMoveTo(matrix.detailPanel, true),
    true,
    "You can move a question here"
  );
  page.dragDropFinish();
  assert.equal(
    matrix.detailPanel.elements.length,
    1,
    "There is a question in the detailPanel"
  );
  assert.equal(
    matrix.detailPanel.elements[0].name,
    "q1",
    "It is the 'q1' question"
  );
});

QUnit.test("Don't allow to move empty paneldynamic into itself", function (
  assert
) {
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  var page = survey.addNewPage("page1");
  var panelDynamic = new QuestionPanelDynamicModel("panel1");
  page.dragDropStart(null, panelDynamic, -1);
  assert.equal(page.dragDropMoveTo(panelDynamic.template, true), true);
  page.dragDropFinish();
  assert.equal(panelDynamic.template.rows.length, 0, "The template is empty");
});

QUnit.test("survey onDragDropAllow event", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  var panel1 = page.addNewPanel("panel1");
  var q3 = panel1.addNewQuestion("text", "q3");
  var q4 = panel1.addNewQuestion("text", "q4");
  var q5 = page.addNewQuestion("text", "q5");
  var panel2 = page.addNewPanel("panel2");
  var target = new QuestionTextModel("q1");
  var canInsertIntoPanel2 = false;
  survey.onDragDropAllow.add(function (sender, options) {
    options.allow =
      (canInsertIntoPanel2 || options.parent != panel2) &&
      options.insertBefore !== panel1 &&
      options.insertAfter != q5;
  });
  assert.equal(page.rows.length, 5, "By default 5 rows in the page");
  page.dragDropStart(q1, target);
  page.dragDropMoveTo(q2, true);
  assert.equal(
    page.rows.length,
    5,
    "not allow options.insertBefore !== panel1"
  );
  page.dragDropMoveTo(panel1, false, true);
  assert.equal(
    page.rows.length,
    5,
    "not allow options.insertBefore !== panel1"
  );
  assert.equal(panel1.rows.length, 2, "two rows in panel1 by default");
  page.dragDropMoveTo(q3, false);
  assert.equal(panel1.rows.length, 3, "three rows in panel1 now");
  page.dragDropMoveTo(q5, false);
  assert.equal(panel1.rows.length, 2, "two rows in panel1 again");
  assert.equal(page.rows.length, 6, "6 rows in the page");
  page.dragDropMoveTo(q5, true);
  assert.equal(page.rows.length, 5, "options.insertAfter != q5");
  page.dragDropMoveTo(panel2, false);
  assert.equal(panel2.rows.length, 0, "options.parent != panel2");
  canInsertIntoPanel2 = true;
  page.dragDropMoveTo(panel2, true);
  assert.equal(panel2.rows.length, 1, "can insert into panel2 now");
});

QUnit.test("survey onDragDropAllow event", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = new FlowPanelModel("panel1");
  panel.content = "abcd";
  page.addElement(panel);

  var target = new QuestionTextModel("q1");
  assert.equal(page.rows.length, 1, "one row");
  page.dragDropStart(null, target);
  assert.equal(
    page.dragDropMoveTo(panel, true, true),
    true,
    "Move to end of the page"
  );
  assert.equal(page.rows.length, 2, "target is under panel");
});

QUnit.test("survey drop new question into FlowPanel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = new FlowPanelModel("panel1");
  panel.content = "abcd";
  page.addElement(panel);

  assert.equal(
    panel.elements.length,
    0,
    "there is no elements in the flowpanel"
  );
  var target = new QuestionTextModel("q1");
  assert.equal(page.rows.length, 1, "one row");
  page.dragDropStart(null, target);
  assert.equal(
    page.dragDropMoveTo(panel, false, false),
    true,
    "Move into flow panel"
  );
  page.dragDropFinish();
  assert.equal(
    panel.elements.length,
    1,
    "there is one element in the flowpanel"
  );
  assert.equal(
    panel.content,
    "abcd{element:q1}",
    "flowpanel.content changed correctly"
  );
  assert.equal(
    panel.questions[0].renderWidth,
    "",
    "clear question render width"
  );
  assert.equal(panel.rows.length, 0, "there is no rows in the flowpanel");
});

QUnit.test("survey drop move question in FlowPanel", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = new FlowPanelModel("panel1");
  panel.addNewQuestion("text", "q1");
  panel.content = "{element:q1}abcd";
  page.addElement(panel);

  assert.equal(
    panel.elements.length,
    1,
    "there is one element in the flowpanel"
  );
  var target = new QuestionTextModel("q1");
  page.dragDropStart(panel.questions[0], target);
  assert.equal(
    page.dragDropMoveTo(panel, false, false),
    true,
    "Move in flow panel"
  );
  page.dragDropFinish();
  assert.equal(panel.rows.length, 0, "there is no rows in the flowpanel");
  assert.equal(
    panel.elements.length,
    1,
    "there is one element in the flowpanel"
  );
  assert.equal(
    panel.content,
    "{element:q1}abcd",
    "flowpanel.content doesn't changed"
  );
  assert.equal(
    panel.questions[0].renderWidth,
    "",
    "clear question render width"
  );
});

QUnit.test("Do not all elements support flow layout", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var panel = new FlowPanelModel("panel1");
  panel.addNewQuestion("text", "q1");
  panel.content = "{element:q1}abcd";
  page.addElement(panel);

  var target = new QuestionMatrixModel("matrix");
  page.dragDropStart(null, target);
  assert.equal(page.rows.length, 1, "There is one row");
  assert.equal(
    page.dragDropMoveTo(panel, false, false),
    true,
    "Do support matrix in flow panel, but allow drop on page"
  );
  assert.equal(page.rows.length, 2, "There are two rows");
  page.dragDropFinish();
  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(
    panel.elements.length,
    1,
    "there is one element in the flowpanel"
  );
  assert.equal(
    panel.content,
    "{element:q1}abcd",
    "flowpanel.content doesn't changed"
  );
  assert.equal(page.elements.length, 2, "There are two elements in page");
  assert.equal(page.elements[0].name, "matrix", "The first element is matrix");
});

QUnit.test("Move flow panel up", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var question = page.addNewQuestion("text", "q1");
  var panel = new FlowPanelModel("panel1");
  panel.addNewQuestion("text", "pq1");
  panel.content = "{element:pq1}abcd";
  page.addElement(panel);

  var target = new FlowPanelModel("panel1");
  page.dragDropStart(panel, target);
  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(
    page.dragDropMoveTo(question, false, false),
    true,
    "Can drop the question"
  );
  assert.equal(page.rows.length, 3, "There are three rows now");
  page.dragDropFinish();
  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.elements.length, 2, "There are two elements in page");
  assert.equal(
    page.elements[0].name,
    "panel1",
    "The first element is the flow panel"
  );
  assert.equal(page.elements[1].name, "q1", "The second element is a question");
});

QUnit.test("Check onQuestionAdded event is not fired", function (assert) {
  settings.supportCreatorV2 = false;
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var question = page.addNewQuestion("question1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  var q3 = page.addNewQuestion("text", "q3");
  var target = new QuestionTextModel("question1");
  var eventIsFired = false;
  survey.onQuestionAdded
    .add(function (sender, options) {
      eventIsFired = true;
    });
  page.dragDropStart(question, target);
  page.dragDropMoveTo(q1, true);
  page.dragDropFinish();
  assert.notOk(eventIsFired, "onQuestionAdded event is not fired while dragging");

  survey.setDesignMode(true);
  page.dragDropStart(question, target);
  page.dragDropMoveTo(q2, true);
  page.dragDropFinish();

  assert.ok(eventIsFired, "onQuestionAdded event is fired while dragging, Creator V1");

  eventIsFired = false;
  settings.supportCreatorV2 = true;
  page.dragDropStart(question, target);
  page.dragDropMoveTo(q3, true);
  page.dragDropFinish();
  settings.supportCreatorV2 = false;

  assert.notOk(eventIsFired, "onQuestionAdded event is not fired while dragging, Creator V2");

  page.addNewQuestion("text", "q5");
  assert.ok(eventIsFired, "onQuestionAdded event is fired on adding new question");
});
QUnit.test("Check onPanelAdded event is not fired", function (assert) {
  settings.supportCreatorV2 = false;
  var survey = new SurveyModel();
  var page = survey.addNewPage("p1");
  var panel1 = page.addNewPanel("panel1");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  var q3 = page.addNewQuestion("text", "q3");
  var target = new PanelModel("panel1");
  var eventIsFired = false;
  survey.onPanelAdded
    .add(function (sender, options) {
      eventIsFired = true;
    });
  page.dragDropStart(panel1, target);
  page.dragDropMoveTo(q1, true);
  page.dragDropFinish();
  assert.notOk(eventIsFired, "onPanelAdded event is not fired while dragging");

  survey.setDesignMode(true);
  page.dragDropStart(panel1, target);
  page.dragDropMoveTo(q2, true);
  page.dragDropFinish();
  assert.ok(eventIsFired, "onPanelAdded event is fired while dragging, Creator V1");

  eventIsFired = false;
  settings.supportCreatorV2 = true;
  page.dragDropStart(panel1, target);
  page.dragDropMoveTo(q3, true);
  page.dragDropFinish();
  assert.notOk(eventIsFired, "onPanelAdded event is not fired while dragging, Creator V2");
  settings.supportCreatorV2 = false;

  page.addNewPanel("panel2");
  assert.ok(eventIsFired, "onPanelAdded event is fired on adding new panel");
});
