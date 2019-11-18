import {
  QuestionMatrixDropdownModelBase,
  MatrixDropdownColumn
} from "../src/question_matrixdropdownbase";

export default QUnit.module("Survey_QuestionMatrixDropdownBase");

QUnit.test(" 213 123sad d213 sadsd", function(assert) {
  var matrix = new QuestionMatrixDropdownModelBase("q1");

  assert.equal(
    matrix["generatedVisibleRows"],
    null,
    "generatedVisibleRows is null"
  );
  assert.deepEqual(matrix.getAllErrors(), [], "getAllErrors method doesn't fall");
});
