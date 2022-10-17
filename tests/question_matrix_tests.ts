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