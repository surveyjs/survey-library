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
