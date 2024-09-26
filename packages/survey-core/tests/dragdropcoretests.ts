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
QUnit.skip("Show/hide new created item, simple test", function (assert) {
  const dragDropCore = new DragDropTest({} as any, {} as any);
  const container = document.createElement("div");
  const child = document.createElement("div");
  container.style.width = "1920px";
  container.style.height = "1080px";
  container.style.overflow = "scroll";
  child.style.width = "10000px";
  child.style.height = "10000px";
  container.appendChild(child);
  document.body.appendChild(container);
  dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 0);
  assert.equal(container.scrollTop, 0);
  dragDropCore.scrollByDragTest(container, container.clientHeight - 120, 0);
  assert.equal(container.scrollTop, 0);
  dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 400);
  assert.equal(container.scrollTop, 15);
  dragDropCore.scrollByDragTest(container, container.clientHeight - 10, container.clientWidth - 10);
  assert.equal(container.scrollTop, 15);
  dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 400);
  assert.equal(container.scrollTop, 30);
  dragDropCore.scrollByDragTest(container, 120, 400);
  assert.equal(container.scrollTop, 30);
  dragDropCore.scrollByDragTest(container, 10, 400);
  assert.equal(container.scrollTop, 15);
  dragDropCore.scrollByDragTest(container, 10, 10);
  assert.equal(container.scrollTop, 15);
  dragDropCore.scrollByDragTest(container, 10, container.clientWidth - 10);
  assert.equal(container.scrollTop, 15);
  dragDropCore.scrollByDragTest(container, 10, 400);
  assert.equal(container.scrollTop, 0);

  dragDropCore.scrollByDragTest(container, 0, container.clientWidth - 10);
  assert.equal(container.scrollLeft, 0);
  dragDropCore.scrollByDragTest(container, 0, container.clientWidth - 120);
  assert.equal(container.scrollLeft, 0);
  dragDropCore.scrollByDragTest(container, 400, container.clientWidth - 10);
  assert.equal(container.scrollLeft, 15);
  dragDropCore.scrollByDragTest(container, container.clientHeight - 10, container.clientWidth - 10);
  assert.equal(container.scrollLeft, 15);
  dragDropCore.scrollByDragTest(container, 400, container.clientWidth - 10);
  assert.equal(container.scrollLeft, 30);
  dragDropCore.scrollByDragTest(container, 400, 120);
  assert.equal(container.scrollLeft, 30);
  dragDropCore.scrollByDragTest(container, 400, 10);
  assert.equal(container.scrollLeft, 15);
  dragDropCore.scrollByDragTest(container, 10, 10);
  assert.equal(container.scrollLeft, 15);
  dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 10);
  assert.equal(container.scrollLeft, 15);
  dragDropCore.scrollByDragTest(container, 400, 10);
  assert.equal(container.scrollLeft, 0);
  container.remove();
});
