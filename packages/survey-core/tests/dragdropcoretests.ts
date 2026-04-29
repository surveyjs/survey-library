import { SurveyModel } from "../src/survey";
import { QuestionTextModel } from "../src/question_text";
import { DragDropCore } from "../src/dragdrop/core";
import { DragDropDOMAdapter } from "../src/dragdrop/dom-adapter";

import { describe, test, expect } from "vitest";
describe("Drag and Drop Tests", () => {
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
  test.skip("Show/hide new created item, simple test", () => {
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
    expect(container.scrollTop).toLooseEqual(0);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 120, 0);
    expect(container.scrollTop).toLooseEqual(0);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 400);
    expect(container.scrollTop).toLooseEqual(15);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, container.clientWidth - 10);
    expect(container.scrollTop).toLooseEqual(15);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 400);
    expect(container.scrollTop).toLooseEqual(30);
    dragDropCore.scrollByDragTest(container, 120, 400);
    expect(container.scrollTop).toLooseEqual(30);
    dragDropCore.scrollByDragTest(container, 10, 400);
    expect(container.scrollTop).toLooseEqual(15);
    dragDropCore.scrollByDragTest(container, 10, 10);
    expect(container.scrollTop).toLooseEqual(15);
    dragDropCore.scrollByDragTest(container, 10, container.clientWidth - 10);
    expect(container.scrollTop).toLooseEqual(15);
    dragDropCore.scrollByDragTest(container, 10, 400);
    expect(container.scrollTop).toLooseEqual(0);

    dragDropCore.scrollByDragTest(container, 0, container.clientWidth - 10);
    expect(container.scrollLeft).toLooseEqual(0);
    dragDropCore.scrollByDragTest(container, 0, container.clientWidth - 120);
    expect(container.scrollLeft).toLooseEqual(0);
    dragDropCore.scrollByDragTest(container, 400, container.clientWidth - 10);
    expect(container.scrollLeft).toLooseEqual(15);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, container.clientWidth - 10);
    expect(container.scrollLeft).toLooseEqual(15);
    dragDropCore.scrollByDragTest(container, 400, container.clientWidth - 10);
    expect(container.scrollLeft).toLooseEqual(30);
    dragDropCore.scrollByDragTest(container, 400, 120);
    expect(container.scrollLeft).toLooseEqual(30);
    dragDropCore.scrollByDragTest(container, 400, 10);
    expect(container.scrollLeft).toLooseEqual(15);
    dragDropCore.scrollByDragTest(container, 10, 10);
    expect(container.scrollLeft).toLooseEqual(15);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 10);
    expect(container.scrollLeft).toLooseEqual(15);
    dragDropCore.scrollByDragTest(container, 400, 10);
    expect(container.scrollLeft).toLooseEqual(0);
    container.remove();
  });
});
