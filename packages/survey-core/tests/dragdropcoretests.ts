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
  test("A drag started inside a modal scrolls only the scroll containers inside it", () => {
    const dragDropCore = new DragDropTest({} as any, {} as any);
    const createContainer = (): HTMLElement => {
      const container = document.createElement("div");
      Object.defineProperty(container, "clientWidth", { configurable: true, value: 1920 });
      Object.defineProperty(container, "clientHeight", { configurable: true, value: 1080 });
      const containerRect = { top: 0, bottom: 1080, left: 0, right: 1920, width: 1920, height: 1080, x: 0, y: 0, toJSON() { return this; } };
      container.getBoundingClientRect = () => containerRect as DOMRect;
      return container;
    };
    const outside = createContainer();
    const popup = document.createElement("div");
    popup.className = "sv-popup sv-popup--modal-popup";
    const inside = createContainer();
    popup.appendChild(inside);
    document.body.appendChild(outside);
    document.body.appendChild(popup);
    dragDropCore["popupNode"] = popup;
    dragDropCore.scrollByDragTest(outside, 1070, 400);
    expect(outside.scrollTop, "#1: the page behind the modal is not scrolled").toBe(0);
    dragDropCore.scrollByDragTest(inside, 1070, 400);
    expect(inside.scrollTop, "#2: a container inside the modal is").toBe(15);
    dragDropCore["popupNode"] = null;
    dragDropCore.scrollByDragTest(outside, 1070, 400);
    expect(outside.scrollTop, "#3: a drag outside a modal scrolls as before").toBe(15);
    outside.remove();
    popup.remove();
  });
  test("Only a modal limits the scroll: a drag from a dropdown popup goes on to the page", () => {
    const adapter: any = DragDropDOMAdapter;
    const dropdown = document.createElement("div");
    dropdown.className = "sv-popup";
    const item = document.createElement("div");
    dropdown.appendChild(item);
    const modal = document.createElement("div");
    modal.className = "sv-popup sv-popup--modal-overlay";
    const row = document.createElement("div");
    modal.appendChild(row);
    expect(adapter.getPopupNode(item), "#1").toBeNull();
    expect(adapter.getPopupNode(row) === modal, "#2").toBe(true);
    expect(adapter.getPopupNode(undefined), "#3").toBeNull();
  });
});
