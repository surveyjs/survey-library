import { SurveyModel } from "../src/survey";
import { QuestionTextModel } from "../src/question_text";
import { DragDropCore } from "../src/dragdrop/core";
import { DragDropDOMAdapter } from "../src/dragdrop/dom-adapter";

export default QUnit.module("Drag and Drop Tests");

class DragDropTest extends DragDropDOMAdapter {
  private times = 0;

  protected requestAnimationFrame(callback: any): number {
    if (this.times == 0) {
      this.times++;
      callback();
    }
    return 0;
  }
  public scrollByDragTest(scrollableParentNode: HTMLElement, clientY: number, clientX: number) {
    this.times = 0;
    this.scrollByDrag(scrollableParentNode, clientY, clientX);
  }
}
QUnit.test("Show/hide new created item, simple test", function (assert) {
  var dragDropCore = new DragDropTest({} as any, {} as any);
  document.body.style.height = "10000px";
  document.body.style.width = "10000px";
  dragDropCore.scrollByDragTest(document.documentElement, document.documentElement.clientHeight - 10, 0);
  assert.equal(document.documentElement.scrollTop, 0);
  dragDropCore.scrollByDragTest(document.documentElement, document.documentElement.clientHeight - 120, 0);
  assert.equal(document.documentElement.scrollTop, 0);
  dragDropCore.scrollByDragTest(document.documentElement, document.documentElement.clientHeight - 10, 400);
  assert.equal(document.documentElement.scrollTop, 15);
  dragDropCore.scrollByDragTest(document.documentElement, document.documentElement.clientHeight - 10, document.documentElement.clientWidth - 10);
  assert.equal(document.documentElement.scrollTop, 15);
  dragDropCore.scrollByDragTest(document.documentElement, document.documentElement.clientHeight - 10, 400);
  assert.equal(document.documentElement.scrollTop, 30);
  dragDropCore.scrollByDragTest(document.documentElement, 120, 400);
  assert.equal(document.documentElement.scrollTop, 30);
  dragDropCore.scrollByDragTest(document.documentElement, 10, 400);
  assert.equal(document.documentElement.scrollTop, 15);
  dragDropCore.scrollByDragTest(document.documentElement, 10, 10);
  assert.equal(document.documentElement.scrollTop, 15);
  dragDropCore.scrollByDragTest(document.documentElement, 10, document.documentElement.clientWidth - 10);
  assert.equal(document.documentElement.scrollTop, 15);
  dragDropCore.scrollByDragTest(document.documentElement, 10, 400);
  assert.equal(document.documentElement.scrollTop, 0);

  dragDropCore.scrollByDragTest(document.documentElement, 0, document.documentElement.clientWidth - 10);
  assert.equal(document.documentElement.scrollLeft, 0);
  dragDropCore.scrollByDragTest(document.documentElement, 0, document.documentElement.clientWidth - 120);
  assert.equal(document.documentElement.scrollLeft, 0);
  dragDropCore.scrollByDragTest(document.documentElement, 400, document.documentElement.clientWidth - 10);
  assert.equal(document.documentElement.scrollLeft, 15);
  dragDropCore.scrollByDragTest(document.documentElement, document.documentElement.clientHeight - 10, document.documentElement.clientWidth - 10);
  assert.equal(document.documentElement.scrollLeft, 15);
  dragDropCore.scrollByDragTest(document.documentElement, 400, document.documentElement.clientWidth - 10);
  assert.equal(document.documentElement.scrollLeft, 30);
  dragDropCore.scrollByDragTest(document.documentElement, 400, 120);
  assert.equal(document.documentElement.scrollLeft, 30);
  dragDropCore.scrollByDragTest(document.documentElement, 400, 10);
  assert.equal(document.documentElement.scrollLeft, 15);
  dragDropCore.scrollByDragTest(document.documentElement, 10, 10);
  assert.equal(document.documentElement.scrollLeft, 15);
  dragDropCore.scrollByDragTest(document.documentElement, document.documentElement.clientHeight - 10, 10);
  assert.equal(document.documentElement.scrollLeft, 15);
  dragDropCore.scrollByDragTest(document.documentElement, 400, 10);
  assert.equal(document.documentElement.scrollLeft, 0);
});
