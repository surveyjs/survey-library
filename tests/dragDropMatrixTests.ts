import { SurveyModel } from "../src/survey";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { DragDropMatrixRows } from "../src/dragdrop/matrix-rows";

export default QUnit.module("Drag and Drop Matrix Row Tests");

QUnit.test("Clear the isGhostRow marker", function (assert) {
  const survey = new SurveyModel({
    elements: [{
      type: "matrixdynamic",
      name: "test",
      rowCount: 2,
      columns: [
        { cellType: "text", name: "value" },
        { cellType: "text", name: "text" },
      ],

    }]
  });
  survey.setDesignMode(true);
  const matrixQuestion = survey.getAllQuestions()[0] as QuestionMatrixDynamicModel;
  const renderedTable = matrixQuestion.renderedTable;
  const dd = matrixQuestion.dragDropMatrixRows;

  assert.equal(renderedTable.rows[1].isGhostRow, false, "Row 0 isGhostRow marker is clear initially");
  dd.dragInit(<any>{}, renderedTable.rows[1].row, matrixQuestion);
  assert.equal(renderedTable.rows[1].isGhostRow, true, "Row 0 marked as being dragged");
  dd.clear();
  assert.equal(renderedTable.rows[1].isGhostRow, false, "Row 0 isGhostRow marker is reset");
});
