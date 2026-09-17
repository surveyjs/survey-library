// Shared test helpers used by BOTH Karma (QUnit) and Vitest test files.
// Keep this file free of any test-runner imports (`vitest`, `qunit`) so
// it can be imported safely from either side without dragging the runner
// into the bundle.
import { IAction } from "../src/actions/action";
import { defaultListCss } from "../src/list";

export function createIActionArray(count: number): Array<IAction> {
  const result: Array<IAction> = [];
  for (let index = 0; index < count; ++index) {
    result.push(<IAction>{ id: "test" + index, title: "test" + index });
  }
  return result;
}

export function createListContainerHtmlElement(): HTMLElement {
  const element = document.createElement("div");
  const innerElement = document.createElement("div");
  innerElement.className = defaultListCss.itemsContainer;
  innerElement.style.width = "200px";
  innerElement.style.height = "100px";

  const listContainerElement = document.createElement("div");
  listContainerElement.style.width = "200px";
  listContainerElement.style.height = "1000px";
  listContainerElement.scrollTop = 0;
  listContainerElement.scrollLeft = 0;

  document.body.appendChild(element);
  element.appendChild(innerElement);
  innerElement.appendChild(listContainerElement);
  return element;
}

export class CustomResizeObserver {
  constructor(private callback: () => void) { }
  observe() {
    this.call();
  }
  call() {
    this.callback();
  }
  disconnect() { }
}

// Queued requestAnimationFrame mock. Callbacks run only when a test advances a frame, and a callback
// requested while a frame runs waits for the next one. cancelAnimationFrame drops a queued callback.
export class AnimationFrameQueue {
  private callbacks = new Map<number, FrameRequestCallback>();
  private lastId = 0;
  private originalRAF: typeof window.requestAnimationFrame;
  private originalCAF: typeof window.cancelAnimationFrame;
  public now = 0;
  constructor(private frameDuration: number = 16) { }
  public install(): void {
    this.originalRAF = window.requestAnimationFrame;
    this.originalCAF = window.cancelAnimationFrame;
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      this.callbacks.set(++this.lastId, cb);
      return this.lastId;
    }) as any;
    window.cancelAnimationFrame = ((id: number) => {
      this.callbacks.delete(id);
    }) as any;
  }
  public uninstall(): void {
    window.requestAnimationFrame = this.originalRAF;
    window.cancelAnimationFrame = this.originalCAF;
    this.callbacks.clear();
  }
  public get pendingCount(): number {
    return this.callbacks.size;
  }
  public runFrame(): void {
    this.now += this.frameDuration;
    const frame = Array.from(this.callbacks.values());
    this.callbacks.clear();
    frame.forEach(cb => cb(this.now));
  }
  public runFrames(count: number): void {
    for (let i = 0; i < count; i++) {
      this.runFrame();
    }
  }
}

export function mockRect(el: Element, top: number, height: number, left: number = 0, width: number = 100): void {
  el.getBoundingClientRect = () => ({ top: top, bottom: top + height, left: left, right: left + width, width: width, height: height, x: left, y: top, toJSON: () => { } }) as DOMRect;
}
