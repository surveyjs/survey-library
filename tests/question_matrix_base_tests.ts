import { QuestionMatrixBaseModel } from "../src/martixBase";
import { MatrixRowModel } from "../src/question_matrix";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey_MatrixBase");

// QUnit.test("allowRowsDragAndDrop test", function (assert) {
//   var survey = new SurveyModel(json);

//   var matrix = survey.getQuestionByName("Quality");

//   assert.equal(matrix.allowRowsDragAndDrop, true);
// });

// QUnit.test("moveRowByIndex test", function (assert) {
//   var matrixBase = new QuestionMatrixBaseModel("q1");
//   var rows = ["row1", "row2", "row3"];
//   matrixBase["moveRowByIndex"](rows, 2, 0);
//   assert.deepEqual(rows, ["row3", "row1", "row2"]);
// });

var json = {
  questions: [
    {
      type: "matrix",
      name: "Quality",
      allowRowsDragAndDrop: true,
      title:
        "Please indicate if you agree or disagree with the following statements",
      columns: [
        {
          value: 1,
          text: "Strongly Disagree",
        },
        {
          value: 2,
          text: "Disagree",
        },
        {
          value: 3,
          text: "Neutral",
        },
        {
          value: 4,
          text: "Agree",
        },
        {
          value: 5,
          text: "Strongly Agree",
        },
      ],
      rows: [
        {
          value: "affordable",
          text: "Product is affordable",
        },
        {
          value: "does what it claims",
          text: "Product does what it claims",
        },
        {
          value: "better then others",
          text: "Product is better than other products on the market",
        },
        {
          value: "easy to use",
          text: "Product is easy to use",
        },
      ],
    },
  ],
};
