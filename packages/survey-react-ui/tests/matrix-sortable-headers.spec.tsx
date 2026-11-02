import { SurveyModel, QuestionMatrixDynamicModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeAll, afterAll } from "vitest";

// jsdom has no matchMedia; the survey subscribes to the reduced-motion media query while it is rendered.
const media = { matches: false, addEventListener: () => { }, removeEventListener: () => { } };
const prevMatchMedia = (window as any).matchMedia;
beforeAll(() => {
  (window as any).matchMedia = () => media;
});
afterAll(() => {
  (window as any).matchMedia = prevMatchMedia;
});

let container: HTMLElement | undefined;
function render(json: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "matrixdynamic", name: "matrix", rowCount: 0,
    columns: [{ name: "product", cellType: "text" }, { name: "price", cellType: "text", inputType: "number" }]
  }, json)] });
  survey.data = { matrix: [{ product: "b", price: 20 }, { product: "a", price: 30 }, { product: "c", price: 10 }] };
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<SurveyReact model={survey} />, container as HTMLElement);
  });
  return survey.getQuestionByName("matrix") as QuestionMatrixDynamicModel;
}
afterEach(() => {
  if (container) {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = undefined;
  }
});
function headers(): Array<HTMLTableCellElement> {
  return Array.prototype.slice.call((container as HTMLElement).querySelectorAll("thead th"));
}
function headerButton(index: number): HTMLButtonElement {
  return headers()[index].querySelector("button") as HTMLButtonElement;
}
function click(button: HTMLButtonElement, init?: MouseEventInit): void {
  act(() => {
    button.dispatchEvent(new MouseEvent("click", Object.assign({ bubbles: true }, init)));
  });
}

describe("Matrix: sortable column headers", () => {
  it("a sortable header holds one button; aria-sort sits on the th of the first sort level only", () => {
    const matrix = render({ allowSort: true, maxSortLevel: 2 });
    expect(headers().length, "#1").toBe(2);
    const price = headerButton(1);
    expect(price.getAttribute("type"), "#2").toBe("button");
    expect(price.getAttribute("aria-label"), "#3").toBe("Sort by price");
    expect(headers().map(th => th.hasAttribute("aria-sort")), "#4: not sorted").toEqual([false, false]);
    expect(price.hasAttribute("aria-describedby"), "#5").toBe(false);
    click(price);
    expect(headers().map(th => th.getAttribute("aria-sort")), "#6").toEqual([null, "descending"]);
    expect(headerButton(1).getAttribute("title"), "#7").toBe("High - Low");
    click(headerButton(0), { shiftKey: true });
    expect(matrix.sortCriteria.map(item => item.field), "#8").toEqual(["price", "product"]);
    expect(headers().map(th => th.getAttribute("aria-sort")), "#9: the second level has none").toEqual([null, "descending"]);
    const describedBy = headerButton(0).getAttribute("aria-describedby") as string;
    const description = (container as HTMLElement).querySelector("[id='" + describedBy + "']") as HTMLElement;
    expect(description.textContent, "#10").toBe("Sorted by price (High - Low), then by product (Alphabet, A - Z)");
    expect(description.className, "#11").toBe("sv-visuallyhidden");
  });
  it("the button is aria-disabled, never disabled, while a page loads", () => {
    const matrix = render({ allowSort: true });
    act(() => { matrix.isDataLoading = true; });
    const price = headerButton(1);
    expect([price.getAttribute("aria-disabled"), price.disabled], "#1").toEqual(["true", false]);
    click(price);
    expect(matrix.sortCriteria.length, "#2: the click did nothing").toBe(0);
    act(() => { matrix.isDataLoading = false; });
    expect(headerButton(1).hasAttribute("aria-disabled"), "#3").toBe(false);
  });
  it("a sort from code moves the arrow on the same button", () => {
    const matrix = render({ allowSort: true, allowRowReorder: true });
    const price = headerButton(1);
    const indicator = (): string => (price.querySelector("[aria-hidden='true']") as HTMLElement).className;
    expect(indicator(), "#1").toBe("sd-table__header-sort sd-table__header-sort--none");
    act(() => { matrix.sort("price", "asc"); });
    expect(headerButton(1), "#2: the same DOM node, though the drag cell has left the row").toBe(price);
    expect(indicator(), "#3").toBe("sd-table__header-sort sd-table__header-sort--asc");
    act(() => { matrix.sortCriteria[0].direction = "desc"; });
    expect(indicator(), "#4").toBe("sd-table__header-sort sd-table__header-sort--desc");
  });
  it("the level number is rendered inside the hidden indicator and follows the sort", () => {
    const matrix = render({ allowSort: true, maxSortLevel: 3 });
    const rank = (index: number): Element | null => headerButton(index).querySelector(".sd-table__header-sort-rank");
    expect([rank(0), rank(1)], "#1: not sorted").toEqual([null, null]);
    click(headerButton(1));
    expect([rank(0), rank(1)], "#1a: one sorted column has no number").toEqual([null, null]);
    click(headerButton(0), { shiftKey: true });
    expect([rank(1)?.textContent, rank(0)?.textContent], "#2").toEqual(["1", "2"]);
    expect((rank(1)?.parentElement as HTMLElement).getAttribute("aria-hidden"), "#3").toBe("true");
    expect((rank(1)?.parentElement as HTMLElement).className, "#4")
      .toBe("sd-table__header-sort sd-table__header-sort--desc sd-table__header-sort--ranked");
    act(() => { matrix.sortCriteria.splice(0, 1); });
    expect([rank(1), rank(0)], "#5: one level left, no number").toEqual([null, null]);
  });
  it("a matrix without allowSort renders no button and no aria-sort", () => {
    render({});
    expect(headers().map(th => [th.querySelector("button"), th.hasAttribute("aria-sort"), th.className.indexOf("sortable")]))
      .toEqual([[null, false, -1], [null, false, -1]]);
  });
});
