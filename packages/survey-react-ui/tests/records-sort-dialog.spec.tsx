import { SurveyModel, QuestionMatrixDynamicModel, Action } from "survey-core";
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
    type: "matrixdynamic", name: "matrix", title: "Products", rowCount: 0, allowSort: true, showSortBar: "always", maxSortLevel: 4,
    columns: [{ name: "product", cellType: "text" }, { name: "price", cellType: "text", inputType: "number" }, { name: "category", cellType: "text" }, { name: "stock", cellType: "text" }]
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
// The dialog is placed under the survey's root element.
const root = (): HTMLElement => container as HTMLElement;
function openDialog(matrix: QuestionMatrixDynamicModel): Element {
  act(() => {
    (matrix.recordsBar.sortActions.getActionById("sv-sort-more") as Action).action();
  });
  return root().querySelector(".sv-popup--records-sort .sd-sort-dialog") as Element;
}
const rowsOf = (dialog: Element): Array<Element> => Array.prototype.slice.call(dialog.children) as Array<Element>;
const titlesOf = (row: Element): Array<string> => Array.prototype.map.call(row.querySelectorAll(".sd-action__title"), (el: Element): string => el.textContent) as Array<string>;
const removeCount = (row: Element): number => row.querySelectorAll("button[aria-label^='Remove sort level']").length;

describe("Records sort dialog", () => {
  it("renders one action bar per row and a remove button from the second row on", () => {
    const matrix = render({ sortCriteria: [{ field: "product", direction: "asc" }, { field: "price", direction: "desc" }, { field: "category", direction: "desc" }] });
    const dialog = openDialog(matrix);
    expect(!!dialog, "#1: the dialog is open").toBe(true);
    const rows = rowsOf(dialog);
    expect(rows.map((row: Element): boolean => row.classList.contains("sd-action-bar") && row.classList.contains("sd-sort-dialog__row")), "#2")
      .toEqual([true, true, true]);
    expect(rows.map(titlesOf), "#3").toEqual([["product", "Alphabet, A - Z"], ["price", "High - Low"], ["category", "Alphabet, Z - A"]]);
    expect(rows.map(removeCount), "#4").toEqual([0, 1, 1]);
    expect(root().querySelector(".sv-popup--records-sort .sv-popup__body-header")!.textContent, "#5").toBe("Sort by");
    const footer = Array.prototype.map.call(root().querySelectorAll(".sv-popup--records-sort .sv-popup__body-footer .sd-action__title"),
      (el: Element): string => el.textContent);
    expect(footer, "#6: Add New, then Apply").toEqual(["Add New", "Apply"]);
  });
  it("a removed row leaves the dialog, and Add New adds one", () => {
    const matrix = render({ sortCriteria: [{ field: "product", direction: "asc" }, { field: "price", direction: "desc" }] });
    const dialog = openDialog(matrix);
    act(() => {
      (rowsOf(dialog)[1].querySelector("button[aria-label^='Remove sort level']") as HTMLButtonElement).click();
    });
    expect(rowsOf(dialog).map(titlesOf), "#1").toEqual([["product", "Alphabet, A - Z"]]);
    const addNew = Array.prototype.filter.call(root().querySelectorAll(".sv-popup--records-sort .sv-popup__body-footer button"),
      (el: Element): boolean => el.textContent === "Add New")[0] as HTMLButtonElement;
    act(() => { addNew.click(); });
    expect(rowsOf(dialog).map(titlesOf), "#2").toEqual([["product", "Alphabet, A - Z"], ["price", "\u2014"]]);
    expect(rowsOf(dialog).map(removeCount), "#3").toEqual([0, 1]);
  });
});
