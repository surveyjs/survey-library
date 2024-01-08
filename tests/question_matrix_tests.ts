import { Helpers } from "../src/helpers";
import { QuestionMatrixModel } from "../src/question_matrix";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey_QuestionMatrix");

QUnit.test("check row randomization in design mode", (assert) => {

  var json = {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "matrix",
            "name": "question1",
            "columns": [
              "Column 1",
              "Column 2"
            ],
            "rows": [
              "Row 1",
              "Row 2",
              "Row 3",
              "Row 4"
            ],
            "rowsOrder": "random"
          }
        ]
      }
    ]
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionMatrixModel>survey.getQuestionByName("question1");
  const rows = q1.getRows();

  var randomizedCount: number = 0;
  Helpers.randomizeArray = (array: Array<any>): Array<any> => {
    randomizedCount++;
    return array;
  };

  randomizedCount = 0;
  survey.setDesignMode(false);
  q1["sortVisibleRows"](rows);
  assert.equal(randomizedCount, 1);

  survey.setDesignMode(true);
  randomizedCount = 0;
  q1["sortVisibleRows"](rows);
  assert.equal(randomizedCount, 0);

  q1.rowsOrder = "initial";

  randomizedCount = 0;
  survey.setDesignMode(false);
  q1["sortVisibleRows"](rows);
  assert.equal(randomizedCount, 0);

  survey.setDesignMode(true);
  randomizedCount = 0;
  q1["sortVisibleRows"](rows);
  assert.equal(randomizedCount, 0);

});
QUnit.test("rows, ItemValue.enableIf", (assert) => {
  const survey = new SurveyModel({
    elements: [
      { type: "matrix", name: "q1", columns: ["col1"], rows: [{ value: "row1", enableIf: "{q2} = 1" }, "row2"] },
      { type: "text", name: "q2" }
    ]
  });
  const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  const row = q1.visibleRows[0];
  assert.equal(q1.rows[0].isEnabled, false, "First row test isEnabled, #1");
  assert.equal(row.isReadOnly, true, "First visible row test isReadOnly, #1");
  assert.equal(q1.rows[1].isEnabled, true, "Second row test isEnabled, #1");
  q2.value = 1;
  assert.equal(q1.rows[0].isEnabled, true, "First row test isEnabled, #2");
  assert.equal(row.isReadOnly, false, "First visible row test isReadOnly, #2");
  q2.value = 2;
  assert.equal(q1.rows[0].isEnabled, false, "First row test isEnabled, #3");
  assert.equal(row.isReadOnly, true, "First visible row test isReadOnly, #3");
});
QUnit.test("rows.class, ItemValue.enableIf", (assert) => {
  const survey = new SurveyModel();
  const prevCssValue = survey.css.matrix.rowTextCellDisabled;
  survey.css.matrix.rowTextCellDisabled = "disable_val";
  survey.fromJSON({
    elements: [
      { type: "matrix", name: "q1", columns: ["col1"], rows: [{ value: "row1", enableIf: "{q2} = 1" }, "row2"] },
      { type: "text", name: "q2" }
    ]
  });
  const q1 = <QuestionMatrixModel>survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");

  const row = q1.visibleRows[0];

  assert.equal(row.isReadOnly, true, "First visible row test isReadOnly, #1");
  assert.equal(row.css.indexOf("disable_val") === -1, false, "css #1");
  q2.value = 1;
  assert.equal(row.isReadOnly, false, "First visible row test isReadOnly, #2");
  assert.equal(row.css.indexOf("disable_val") === -1, true, "css #2");
  q2.value = 2;
  assert.equal(row.isReadOnly, true, "First visible row test isReadOnly, #3");
  assert.equal(row.css.indexOf("disable_val") === -1, false, "css #3");

  const secondRow = q1.visibleRows[1];
  assert.equal(secondRow.isReadOnly, false, "Second visible row test isReadOnly, #1");
  assert.equal(secondRow.css.indexOf("disable_val") === -1, true, "Second row css #1");
  survey.mode = "display";
  assert.equal(secondRow.isReadOnly, true, "Second visible row test isReadOnly, #2");
  assert.equal(secondRow.css.indexOf("disable_val") === -1, false, "Second row css #2");

  if(prevCssValue) {
    survey.css.matrix.rowTextCellDisabled = prevCssValue;
  }
});