import { SurveyModel } from "../src/survey";
import { QuestionTextModel } from "../src/question_text";
import { settings } from "../src/settings";

export default QUnit.module("Drag and Drop Tests - CreatorV2 specific");

QUnit.test("Move item in row from left to right", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 0; i < 6; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;
    var page = survey.addNewPage("p1");
    var q1 = page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var target = new QuestionTextModel("q2");

    assert.equal(page.rows.length, 2, "Iteration "+i+". Three is two rows");
    assert.equal(page.rows[1].elements.length, 3, "Iteration "+i+". There are three elements in the last row");
    page.dragDropStart(q2, target);

    page.dragDropMoveTo(q2, false);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 1. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 1. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 0) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q2, true);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 2. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 2. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 1) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q3, false);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 3. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 3. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 2) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q3, true);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 4. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q2", "q4"], "Iteration "+i+". Move 4. The last row is q2, q3, q2, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 3) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q3", "q2", "q4"], "Iteration "+i+". End. The last row is q3, q2, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q4, false);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 5. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q2", "q4"], "Iteration "+i+". Move 5. The last row is q2, q3, q2, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 4) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q3", "q2", "q4"], "Iteration "+i+". End. The last row is q3, q2, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q4, true);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 6. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4", "q2"], "Iteration "+i+". Move 6. The last row is q2, q3, q4, q2");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");

    if(i == 5) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q3", "q4", "q2"], "Iteration "+i+". End. The last row is q3, q4, q2");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }
  }

});

QUnit.test("Move item in row from right to left", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 0; i < 6; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;
    var page = survey.addNewPage("p1");
    var q1 = page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var target = new QuestionTextModel("q4");
    target.startWithNewLine = false;

    assert.equal(page.rows.length, 2, "Iteration "+i+". Three is two rows");
    assert.equal(page.rows[1].elements.length, 3, "Iteration "+i+". There are three elements in the last row");
    page.dragDropStart(q4, target);

    page.dragDropMoveTo(q4, true);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 1. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 1. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 0) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q4, false);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 2. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 2. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 1) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q3, true);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 3. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 3. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 2) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q3, false);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 4. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q4", "q3", "q4"], "Iteration "+i+". Move 4. The last row is q2, q4, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 3) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q4", "q3"], "Iteration "+i+". End. The last row is q2, q4, q3");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q2, true);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 5. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q4", "q3", "q4"], "Iteration "+i+". Move 5. The last row is q2, q4, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 4) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q4", "q3"], "Iteration "+i+". End. The last row is q2, q4, q3");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q2, false);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 6. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q4", "q2", "q3", "q4"], "Iteration "+i+". Move 6. The last row is q4, q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");

    if(i == 5) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q4", "q2", "q3"], "Iteration "+i+". End. The last row is q4, q2, q3");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }
  }

});
QUnit.test("Move item in row from center to right", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 0; i < 4; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;
    var page = survey.addNewPage("p1");
    var q1 = page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var target = new QuestionTextModel("q3");
    target.startWithNewLine = false;

    assert.equal(page.rows.length, 2, "Iteration "+i+". Three is two rows");
    assert.equal(page.rows[1].elements.length, 3, "Iteration "+i+". There are three elements in the last row");
    page.dragDropStart(q3, target);

    page.dragDropMoveTo(q3, false);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 1. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 1. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 0) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q3, true);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 2. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 2. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 1) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q4, false);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 3. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 3. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 2) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q4, true);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 4. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4", "q3"], "Iteration "+i+". Move 4. The last row is q2, q3, q4, q3");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 3) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q4", "q3"], "Iteration "+i+". End. The last row is q2, q4, q3");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }
  }

});

QUnit.test("Move item in row from center to left", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 0; i < 4; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;

    var page = survey.addNewPage("p1");
    var q1 = page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var target = new QuestionTextModel("q3");
    target.startWithNewLine = false;

    assert.equal(page.rows.length, 2, "Iteration "+i+". Three is two rows");
    assert.equal(page.rows[1].elements.length, 3, "Iteration "+i+". There are three elements in the last row");
    page.dragDropStart(q3, target);

    page.dragDropMoveTo(q3, true);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 1. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 1. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 0) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q3, false);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 2. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 2. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 1) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q2, true);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 3. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". Move 3. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 2) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q3, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }

    page.dragDropMoveTo(q2, false);
    assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 4. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q3", "q2", "q3", "q4"], "Iteration "+i+". Move 4. The last row is q3, q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
    if(i == 3) {
      page.dragDropFinish();
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q3", "q2", "q4"], "Iteration "+i+". End. The last row is q3, q2, q4");
      assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
      continue;
    }
  }
});

QUnit.test("Move item in prev row from left to multi-row", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 0; i < 6; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;
    var page = survey.addNewPage("p1");
    var q0 = page.addNewQuestion("text", "q0");
    var q1 = page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    q1.startWithNewLine = false;
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var target = new QuestionTextModel("q0");

    assert.equal(page.rows.length, 2, "Iteration "+i+". Three is two rows");
    assert.equal(page.rows[1].elements.length, 3, "Iteration "+i+". There are three elements in the last row");
    page.dragDropStart(q0, target);

    if(i == 0) {
      page.dragDropMoveTo(q2, false);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 1. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q0", "q2", "q3", "q4"], "Iteration "+i+". Move 1. The last row is q0, q2, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q0", "q2", "q3", "q4"], "Iteration "+i+". End. The last row is q0, q2, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }

    if(i == 1) {
      page.dragDropMoveTo(q2, true);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 2. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q0", "q3", "q4"], "Iteration "+i+". Move 2. The last row is q2, q0, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q0", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q0, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }

    if(i == 2) {
      page.dragDropMoveTo(q3, false);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 3. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q0", "q3", "q4"], "Iteration "+i+". Move 3. The last row is q2, q0, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q0", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q0, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }

    if(i == 3) {
      page.dragDropMoveTo(q3, true);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 4. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q0", "q4"], "Iteration "+i+". Move 4. The last row is q2, q3, q0, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q0", "q4"], "Iteration "+i+". End. The last row is q2, q3, q0, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }

    if(i == 4) {
      page.dragDropMoveTo(q4, false);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 5. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q0", "q4"], "Iteration "+i+". Move 5. The last row is q2, q3, q0, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q0", "q4"], "Iteration "+i+". End. The last row is q2, q3, q0, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }

    if(i == 5) {
      page.dragDropMoveTo(q4, true);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 6. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4", "q0"], "Iteration "+i+". Move 6. The last row is q2, q3, q4, q2");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4", "q0"], "Iteration "+i+". End. The last row is q2, q3, q4, q0");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }
  }
});

QUnit.test("Move item in prev row from right to multi-row", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 0; i < 6; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;
    var page = survey.addNewPage("p1");
    var q0 = page.addNewQuestion("text", "q0");
    var q1 = page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    q1.startWithNewLine = false;
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var target = new QuestionTextModel("q1");
    target.startWithNewLine = false;

    assert.equal(page.rows.length, 2, "Iteration "+i+". Three is two rows");
    assert.equal(page.rows[1].elements.length, 3, "Iteration "+i+". There are three elements in the last row");
    page.dragDropStart(q1, target);

    if(i == 0) {
      page.dragDropMoveTo(q2, false);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 1. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q1", "q2", "q3", "q4"], "Iteration "+i+". Move 1. The last row is q1, q2, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0"], "Iteration "+i+". End. The first row is q0");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q1", "q2", "q3", "q4"], "Iteration "+i+". End. The last row is q1, q2, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }

    if(i == 1) {
      page.dragDropMoveTo(q2, true);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 2. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q1", "q3", "q4"], "Iteration "+i+". Move 2. The last row is q2, q1, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0"], "Iteration "+i+". End. The first row is q0");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q1", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q1, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }

    if(i == 2) {
      page.dragDropMoveTo(q3, false);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 3. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q1", "q3", "q4"], "Iteration "+i+". Move 3. The last row is q2, q1, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0"], "Iteration "+i+". End. The first row is q0");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q1", "q3", "q4"], "Iteration "+i+". End. The last row is q2, q1, q3, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }

    if(i == 3) {
      page.dragDropMoveTo(q3, true);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 4. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q1", "q4"], "Iteration "+i+". Move 4. The last row is q2, q3, q1, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0"], "Iteration "+i+". End. The first row is q0");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q1", "q4"], "Iteration "+i+". End. The last row is q2, q3, q1, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }

    if(i == 4) {
      page.dragDropMoveTo(q4, false);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 5. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q1", "q4"], "Iteration "+i+". Move 5. The last row is q2, q3, q1, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0"], "Iteration "+i+". End. The first row is q0");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q1", "q4"], "Iteration "+i+". End. The last row is q2, q3, q1, q4");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }

    if(i == 5) {
      page.dragDropMoveTo(q4, true);
      assert.equal(page.rows.length, 2, "Iteration "+i+". Move 1. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0", "q1"], "Iteration "+i+". Move 6. The first row is q0, q1");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4", "q1"], "Iteration "+i+". Move 6. The last row is q2, q3, q4, q1");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      page.dragDropFinish();
      assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
      assert.equal(page.rows.length, 2, "Iteration "+i+". End. No rows should be added");
      assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q0"], "Iteration "+i+". End. The first row is q0");
      assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2", "q3", "q4", "q1"], "Iteration "+i+". End. The last row is q2, q3, q4, q1");
      assert.equal(page.questions.length, 5, "Iteration "+i+". we have only 5 questions");
      continue;
    }
  }
});

QUnit.test("Move item multi-row to single-row bottom, from bottom to top", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 2; i <= 4; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;
    var page = survey.addNewPage("p1");
    var q1 = page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var dragQuestionName = "q" + i;
    var dragQuestion = page.getQuestionByName(dragQuestionName);
    var target = new QuestionTextModel(dragQuestionName);
    target.startWithNewLine = dragQuestion.startWithNewLine;

    assert.equal(page.rows.length, 2, "Iteration "+i+". Three is two rows");
    assert.equal(page.rows[1].elements.length, 3, "Iteration "+i+". There are three elements in the last row");
    page.dragDropStart(dragQuestion, target);

    var arr = ["q2", "q3", "q4"];

    page.dragDropMoveTo(q1, true);
    assert.equal(page.rows.length, 3, "Iteration "+i+". Move 1. Row added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 1. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), [dragQuestionName], "Iteration "+i+". Move 1. The first row is dragged");
    assert.deepEqual(page.rows[2].elements.map(e => e.name), arr, "Iteration "+i+". Move 1. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");

    arr.splice(i - 2, 1);

    page.dragDropFinish();
    assert.equal(page.rows.length, 3, "Iteration "+i+". End.  Row added");
    assert.equal(page.rows[2].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The first row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), [dragQuestionName], "Iteration "+i+". Move 1. The first row is dragged");
    assert.deepEqual(page.rows[2].elements.map(e => e.name), arr, "Iteration "+i+". End. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
  }

});

QUnit.test("Move item multi-row to single-row top, from bottom to top", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 2; i <= 4; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;
    var page = survey.addNewPage("p1");
    var q1 = page.addNewQuestion("text", "q1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var dragQuestionName = "q" + i;
    var dragQuestion = page.getQuestionByName(dragQuestionName);
    var target = new QuestionTextModel(dragQuestionName);
    target.startWithNewLine = dragQuestion.startWithNewLine;

    assert.equal(page.rows.length, 2, "Iteration "+i+". Three is two rows");
    assert.equal(page.rows[1].elements.length, 3, "Iteration "+i+". There are three elements in the last row");
    page.dragDropStart(dragQuestion, target);

    var arr = ["q2", "q3", "q4"];

    page.dragDropMoveTo(q1, false);
    assert.equal(page.rows.length, 3, "Iteration "+i+". Move 1. Row added");
    assert.equal(page.rows[2].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), [dragQuestionName], "Iteration "+i+". Move 1. The first row is dragged");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 1. The second row is q1");
    assert.deepEqual(page.rows[2].elements.map(e => e.name), arr, "Iteration "+i+". Move 1. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");

    arr.splice(i - 2, 1);

    page.dragDropFinish();
    assert.equal(page.rows.length, 3, "Iteration "+i+". End.  Row added");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), [dragQuestionName], "Iteration "+i+". Move 1. The first row is dragged");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The second row is q1");
    assert.deepEqual(page.rows[2].elements.map(e => e.name), arr, "Iteration "+i+". End. The last row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
  }

});

QUnit.test("Move item multi-row to single-row bottom, from top to bottom", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 2; i <= 4; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;
    var page = survey.addNewPage("p1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    var q1 = page.addNewQuestion("text", "q1");
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var dragQuestionName = "q" + i;
    var dragQuestion = page.getQuestionByName(dragQuestionName);
    var target = new QuestionTextModel(dragQuestionName);
    target.startWithNewLine = dragQuestion.startWithNewLine;

    assert.equal(page.rows.length, 2, "Iteration "+i+". Three is two rows");
    assert.equal(page.rows[0].elements.length, 3, "Iteration "+i+". There are three elements in the first row");
    page.dragDropStart(dragQuestion, target);

    var arr = ["q2", "q3", "q4"];

    page.dragDropMoveTo(q1, true);
    assert.equal(page.rows.length, 3, "Iteration "+i+". Move 1. Row added");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 1. The pre-last row is q1");
    assert.deepEqual(page.rows[2].elements.map(e => e.name), [dragQuestionName], "Iteration "+i+". Move 1. The last row is dragged");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), arr, "Iteration "+i+". Move 1. The first row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");

    arr.splice(i - 2, 1);

    page.dragDropFinish();
    assert.equal(page.rows.length, 3, "Iteration "+i+". End.  Row added");
    assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The pre-last row is q1");
    assert.deepEqual(page.rows[2].elements.map(e => e.name), [dragQuestionName], "Iteration "+i+". Move 1. The last row is dragged");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), arr, "Iteration "+i+". End. The first row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
  }

});

QUnit.test("Move item multi-row to single-row bottom, from top to bottom", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 2; i <= 4; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;
    var page = survey.addNewPage("p1");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    var q1 = page.addNewQuestion("text", "q1");
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var dragQuestionName = "q" + i;
    var dragQuestion = page.getQuestionByName(dragQuestionName);
    var target = new QuestionTextModel(dragQuestionName);
    target.startWithNewLine = dragQuestion.startWithNewLine;

    assert.equal(page.rows.length, 2, "Iteration "+i+". Three is two rows");
    assert.equal(page.rows[0].elements.length, 3, "Iteration "+i+". There are three elements in the first row");
    page.dragDropStart(dragQuestion, target);

    var arr = ["q2", "q3", "q4"];

    page.dragDropMoveTo(q1, false);
    assert.equal(page.rows.length, 3, "Iteration "+i+". Move 1. Row added");
    assert.deepEqual(page.rows[2].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 1. The last row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), [dragQuestionName], "Iteration "+i+". Move 1. The pre-last row is dragged");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), arr, "Iteration "+i+". Move 1. The first row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");

    arr.splice(i - 2, 1);

    page.dragDropFinish();
    assert.equal(page.rows.length, 3, "Iteration "+i+". End.  Row added");
    assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
    assert.deepEqual(page.rows[2].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The last row is q1");
    assert.deepEqual(page.rows[1].elements.map(e => e.name), [dragQuestionName], "Iteration "+i+". Move 1. The pre-last row is dragged");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), arr, "Iteration "+i+". End. The first row is q2, q3, q4");
    assert.equal(page.questions.length, 4, "Iteration "+i+". we have only four questions");
  }
});

QUnit.test("Move item between pages", function (assert) {
  settings.supportCreatorV2 = true;
  var survey = new SurveyModel();
  survey["_isDesignMode"] = true;
  settings.supportCreatorV2 = true;
  var page = survey.addNewPage("p1");
  var page2 = survey.addNewPage("p2");
  var q1 = page.addNewQuestion("text", "q1");
  var q2 = page.addNewQuestion("text", "q2");
  var q3 = page2.addNewQuestion("text", "q3");

  var target = new QuestionTextModel("q1");

  //debugger;
  page2.dragDropStart(q1, target);

  page2.dragDropMoveTo(q3, false);
  assert.equal(page2.rows.length, 2, "Move/ Page 2 has 2 rows");
  assert.deepEqual(page2.rows[0].elements.map(e => e.name), ["q1"], "Move. The first row of last page is q1");
  assert.deepEqual(page2.rows[1].elements.map(e => e.name), ["q3"], "Move. The second row of last page is q3");
  assert.equal(page.rows.length, 2, "Move/ Page 1 has 2 rows");
  assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Move. The first row of last page is q1");
  assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2"], "Move. The second row of last page is q2");
  page2.dragDropFinish();
  assert.deepEqual(page2.elements.map(e => e.name), ["q1", "q3"], "End. The last page is q1, q3");
  assert.deepEqual(page.elements.map(e => e.name), ["q2"], "End. The first page q2");
});

QUnit.test("Move item multi-row to single-row bottom, between pages", function (assert) {
  settings.supportCreatorV2 = true;
  for(let i = 2; i <= 4; i++) {
    var survey = new SurveyModel();
    survey["_isDesignMode"] = true;
    settings.supportCreatorV2 = true;
    var page = survey.addNewPage("p1");
    var page2 = survey.addNewPage("p2");
    var q2 = page.addNewQuestion("text", "q2");
    var q3 = page.addNewQuestion("text", "q3");
    var q4 = page.addNewQuestion("text", "q4");
    var q1 = page2.addNewQuestion("text", "q1");
    q3.startWithNewLine = false;
    q4.startWithNewLine = false;
    var dragQuestionName = "q" + i;
    var dragQuestion = page.getQuestionByName(dragQuestionName);
    var target = new QuestionTextModel(dragQuestionName);
    target.startWithNewLine = dragQuestion.startWithNewLine;

    assert.equal(page.rows.length, 1, "Iteration "+i+". There is one row in page 1");
    assert.equal(page.rows[0].elements.length, 3, "Iteration "+i+". There are three elements in the first row");
    page2.dragDropStart(dragQuestion, target);

    var arr = ["q2", "q3", "q4"];

    page2.dragDropMoveTo(q1, false);
    assert.equal(page.rows.length, 1, "Iteration "+i+". Move 1. No rows added");
    assert.equal(page2.rows.length, 2, "Iteration "+i+". Move 1. Page 2 - two rows");
    assert.deepEqual(page2.rows[1].elements.map(e => e.name), ["q1"], "Iteration "+i+". Move 1. The last row is q1");
    assert.deepEqual(page2.rows[0].elements.map(e => e.name), [dragQuestionName], "Iteration "+i+". Move 1. The pre-last row is dragged");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), arr, "Iteration "+i+". Move 1. The first row is correct");

    arr.splice(i - 2, 1);

    page2.dragDropFinish();
    assert.equal(page.rows.length, 1, "Iteration "+i+". End.  Page1 - no Row added");
    assert.equal(page2.rows.length, 2, "Iteration "+i+". End.  Page2 - Row added");
    assert.deepEqual(page2.rows[1].elements.map(e => e.name), ["q1"], "Iteration "+i+". End. The last row is q1");
    assert.deepEqual(page2.rows[0].elements.map(e => e.name), [dragQuestionName], "Iteration "+i+". Move 1. The pre-last row is dragged");
    assert.deepEqual(page.rows[0].elements.map(e => e.name), arr, "Iteration "+i+". End. The first row is correct");
    assert.equal(page.rows[0].elements[0].startWithNewLine, true, "Iteration "+i+". End. The first element SWNL = true");
  }
});

QUnit.test("Move item from nowhere (creator toolbox) to page", function (assert) {
  settings.supportCreatorV2 = true;
  var survey = new SurveyModel();
  survey["_isDesignMode"] = true;
  settings.supportCreatorV2 = true;
  var page = survey.addNewPage("p1");
  var q1 = new QuestionTextModel("q1");
  var q2 = page.addNewQuestion("text", "q2");

  var target = new QuestionTextModel("q1");

  //debugger;
  page.dragDropStart(q1, target);

  page.dragDropMoveTo(q2, false);
  assert.equal(page.rows.length, 2, "Move/ Page has 2 rows");
  assert.deepEqual(page.rows[0].elements.map(e => e.name), ["q1"], "Move. The first row of last page is q1");
  assert.deepEqual(page.rows[1].elements.map(e => e.name), ["q2"], "Move. The second row of last page is q2");
  page.dragDropFinish();
  assert.deepEqual(page.elements.map(e => e.name), ["q1", "q2"], "End. The page is q1, q2");
});
QUnit.test("Move new question under row with several questions", function (assert) {
  settings.supportCreatorV2 = true;
  const survey = new SurveyModel();
  survey["_isDesignMode"] = true;
  settings.supportCreatorV2 = true;
  const page = survey.addNewPage("p1");
  const q1 = page.addNewQuestion("text", "q1");
  const q2 = page.addNewQuestion("text", "q2");
  const q3 = page.addNewQuestion("text", "q3");
  q2.startWithNewLine = false;
  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.rows[0].elements.length, 2, "There are two elements in the first row");
  var target = new QuestionTextModel("q4");
  var newQuestion = new QuestionTextModel("q4");
  page.dragDropStart(newQuestion, target);
  page.dragDropMoveTo(q3, false, true);
  page.dragDropFinish();
  assert.equal(page.rows.length, 3, "There are 3 rows");
  assert.equal(page.rows[0].elements.length, 2, "We still have two elements in the first row");
  assert.equal(page.rows[1].elements.length, 1, "One element in the second row");
  assert.equal(page.rows[1].elements[0].name, "q4", "New question is in the second row");
  assert.equal(page.rows[1].elements[0].startWithNewLine, true, "New question starts with new line");
});
QUnit.test("Move new question inside the row with several questions", function (assert) {
  settings.supportCreatorV2 = true;
  const survey = new SurveyModel();
  survey["_isDesignMode"] = true;
  settings.supportCreatorV2 = true;
  const page = survey.addNewPage("p1");
  const q1 = page.addNewQuestion("text", "q1");
  const q2 = page.addNewQuestion("text", "q2");
  const q3 = page.addNewQuestion("text", "q3");
  q2.startWithNewLine = false;
  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.rows[0].elements.length, 2, "There are two elements in the first row");
  var target = new QuestionTextModel("q4");
  var newQuestion = new QuestionTextModel("q4");
  page.dragDropStart(newQuestion, target);
  page.dragDropMoveTo(q2, true, true);
  page.dragDropFinish();
  assert.equal(page.rows.length, 2, "There are 2 rows");
  assert.equal(page.rows[0].elements.length, 3, "There are 3 elements in the first row");
  assert.equal(page.rows[1].elements.length, 1, "One element in the second row");
  assert.equal(page.rows[0].elements[2].name, "q4", "New question is in the first row");
  assert.equal(page.rows[0].elements[2].startWithNewLine, false, "New question is on the same line");
});

QUnit.test("Drag Drop Question with Multiline (StartWithNewLine === false)", function (assert) {
  settings.supportCreatorV2 = true;
  const survey = new SurveyModel();
  survey["_isDesignMode"] = true;
  settings.supportCreatorV2 = true;
  const page = survey.addNewPage("p1");

  const q1 = page.addNewQuestion("text", "q1");
  const q2 = page.addNewQuestion("text", "q2");
  const q3 = page.addNewQuestion("text", "q3");
  const q4 = page.addNewQuestion("text", "q4");
  q3.startWithNewLine = false;
  q4.startWithNewLine = false;

  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.rows[1].elements.length, 3, "There are three elements in the second row");

  assert.equal(page.rows[0].elements[0].name, "q1", "r1 q1 check");
  assert.equal(page.rows[1].elements[0].name, "q2", "r2 q2 check");
  assert.equal(page.rows[1].elements[1].name, "q3", "r2 q3 check");
  assert.equal(page.rows[1].elements[2].name, "q4", "r2 q4 check");

  var target = new QuestionTextModel("q2");

  page.dragDropStart(q2, target);
  page.dragDropMoveTo(q3, true, false);
  page.dragDropFinish();

  assert.equal(page.rows.length, 2, "There are 2 rows at the page");

  assert.equal(page.rows[0].elements.length, 1, "There are 1 elements in the first row");
  assert.equal(page.rows[0].elements[0].name, "q1", "r1 q1 check");

  assert.equal(page.rows[1].elements.length, 3, "There are three elements in the second row");
  assert.equal(page.rows[1].elements[0].name, "q3", "r2 q3 check");
  assert.equal(page.rows[1].elements[1].name, "q2", "r2 q2 check");
  assert.equal(page.rows[1].elements[2].name, "q4", "r2 q4 check");
});

QUnit.test("Drag Drop Question with Multiline (StartWithNewLine === false)", function (assert) {
  settings.supportCreatorV2 = true;
  const survey = new SurveyModel();
  survey["_isDesignMode"] = true;
  settings.supportCreatorV2 = true;
  const page = survey.addNewPage("p1");

  const q1 = page.addNewQuestion("text", "q1");
  const q2 = page.addNewQuestion("text", "q2");
  const q3 = page.addNewQuestion("text", "q3");
  q2.startWithNewLine = false;

  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.rows[1].elements.length, 1, "There on element in the 2 row");

  assert.equal(page.rows[0].elements[0].name, "q1", "r1 q1 check");
  assert.equal(page.rows[0].elements[1].name, "q2", "r1 q2 check");
  assert.equal(page.rows[1].elements[0].name, "q3", "r2 q3 check");

  //var target = new QuestionTextModel("q3");

  var target = new QuestionTextModel("q4");
  var fake = new QuestionTextModel("q4");

  debugger;

  page.dragDropStart(target, fake);
  page.dragDropMoveTo(q2, true, false);
  page.dragDropFinish();

  assert.equal(page.rows.length, 1, "There are 1 rows at the page");

  // assert.equal(page.rows[0].elements.length, 1, "There are 1 elements in the first row");
  // assert.equal(page.rows[0].elements[0].name, "q1", "r1 q1 check");

  // assert.equal(page.rows[1].elements.length, 3, "There are three elements in the second row");
  // assert.equal(page.rows[1].elements[0].name, "q3", "r2 q3 check");
  // assert.equal(page.rows[1].elements[1].name, "q2", "r2 q2 check");
  // assert.equal(page.rows[1].elements[2].name, "q4", "r2 q4 check");
});
