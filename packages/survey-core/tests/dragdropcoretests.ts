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
  test("Show/hide new created item, simple test", () => {
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
    // jsdom does not perform layout; stub the metrics that scrollByDrag()
    // and the assertions read from the container.
    Object.defineProperty(container, "clientWidth", { configurable: true, value: 1920 });
    Object.defineProperty(container, "clientHeight", { configurable: true, value: 1080 });
    const containerRect = { top: 0, bottom: 1080, left: 0, right: 1920, width: 1920, height: 1080, x: 0, y: 0, toJSON() { return this; } };
    container.getBoundingClientRect = () => containerRect as DOMRect;
    // jsdom does not clamp scrollTop/scrollLeft to >= 0 like a real browser
    // does. The test's no-op steps depend on that clamping.
    let __scrollTop = 0;
    let __scrollLeft = 0;
    Object.defineProperty(container, "scrollTop", { configurable: true, get: () => __scrollTop, set: (v: number) => { __scrollTop = Math.max(0, v); } });
    Object.defineProperty(container, "scrollLeft", { configurable: true, get: () => __scrollLeft, set: (v: number) => { __scrollLeft = Math.max(0, v); } });
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 0);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 120, 0);
    expect(container.scrollTop).toBe(0);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 400);
    expect(container.scrollTop).toBe(15);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, container.clientWidth - 10);
    expect(container.scrollTop).toBe(15);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 400);
    expect(container.scrollTop).toBe(30);
    dragDropCore.scrollByDragTest(container, 120, 400);
    expect(container.scrollTop).toBe(30);
    dragDropCore.scrollByDragTest(container, 10, 400);
    expect(container.scrollTop).toBe(15);
    dragDropCore.scrollByDragTest(container, 10, 10);
    expect(container.scrollTop).toBe(15);
    dragDropCore.scrollByDragTest(container, 10, container.clientWidth - 10);
    expect(container.scrollTop).toBe(15);
    dragDropCore.scrollByDragTest(container, 10, 400);
    expect(container.scrollTop).toBe(0);

    dragDropCore.scrollByDragTest(container, 0, container.clientWidth - 10);
    expect(container.scrollLeft).toBe(0);
    dragDropCore.scrollByDragTest(container, 0, container.clientWidth - 120);
    expect(container.scrollLeft).toBe(0);
    dragDropCore.scrollByDragTest(container, 400, container.clientWidth - 10);
    expect(container.scrollLeft).toBe(15);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, container.clientWidth - 10);
    expect(container.scrollLeft).toBe(15);
    dragDropCore.scrollByDragTest(container, 400, container.clientWidth - 10);
    expect(container.scrollLeft).toBe(30);
    dragDropCore.scrollByDragTest(container, 400, 120);
    expect(container.scrollLeft).toBe(30);
    dragDropCore.scrollByDragTest(container, 400, 10);
    expect(container.scrollLeft).toBe(15);
    dragDropCore.scrollByDragTest(container, 10, 10);
    expect(container.scrollLeft).toBe(15);
    dragDropCore.scrollByDragTest(container, container.clientHeight - 10, 10);
    expect(container.scrollLeft).toBe(15);
    dragDropCore.scrollByDragTest(container, 400, 10);
    expect(container.scrollLeft).toBe(0);
    container.remove();
  });
});
