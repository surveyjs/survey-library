import { SurveyModel, QuestionMatrixDynamicModel, Action, settings } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeAll, afterAll } from "vitest";

// jsdom has no matchMedia; the survey subscribes to the reduced-motion media query while it is rendered.
const media = { matches: false, addEventListener: () => { }, removeEventListener: () => { } };
const prevMatchMedia = (window as any).matchMedia;
// jsdom fires no animationend: a removed row would stay rendered as a leaving row.
const prevAnimationEnabled = settings.animationEnabled;
beforeAll(() => {
  (window as any).matchMedia = () => media;
  settings.animationEnabled = false;
});
afterAll(() => {
  (window as any).matchMedia = prevMatchMedia;
  settings.animationEnabled = prevAnimationEnabled;
});

let container: HTMLElement | undefined;
function render(json: any): QuestionMatrixDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "matrixdynamic", name: "matrix", title: "Products", rowCount: 0, allowSort: true, showSortBar: "always", maxSortLevel: 3,
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
// The dialog is placed under the survey's root element; its content is a survey of its own.
const root = (): HTMLElement => container as HTMLElement;
function openDialog(matrix: QuestionMatrixDynamicModel): Element {
  act(() => {
    (matrix.recordsBar.sortActions.getActionById("sv-sort-more") as Action).action();
  });
  return root().querySelector(".sv-popup--records-sort .sv-popup__body-content") as Element;
}
const rowsOf = (dialog: Element): Array<Element> => Array.prototype.slice.call(dialog.querySelectorAll("tr.sd-sort-dialog__row")) as Array<Element>;
const labelsOf = (row: Element): Array<string> =>
  Array.prototype.map.call(row.querySelectorAll("[role=button][aria-label], button[aria-label], [role=combobox][aria-label]"), (el: Element): string => el.getAttribute("aria-label")) as Array<string>;
const removeButton = (row: Element): HTMLButtonElement => row.querySelector("button[aria-label^='Remove sort level']") as HTMLButtonElement;

describe("Records sort dialog", () => {
  it("renders through the survey component: a matrix row per level with the handle, the number, two dropdowns and the remove button", () => {
    const matrix = render({ sortCriteria: [{ field: "product", direction: "asc" }, { field: "price", direction: "desc" }] });
    const dialog = openDialog(matrix);
    expect(!!dialog, "#1: the dialog is open").toBe(true);
    const surveyRoot = dialog.querySelector(".sd-root-modern") as Element;
    expect([!!surveyRoot, surveyRoot.classList.contains("sd-theme-root"), (surveyRoot as HTMLElement).style.getPropertyValue("--sd-mobile-width")], "#2: the dialog's survey")
      .toEqual([true, false, "0px"]);
    const rows = rowsOf(dialog);
    expect(rows.map(labelsOf), "#3").toEqual([["Move sort level 1", "Sort field", "Sort order", "Remove sort level 1"],
      ["Move sort level 2", "Sort field 2", "Sort order 2", "Remove sort level 2"]]);
    expect(rows.map((row: Element): string => (row.querySelector(".sd-expression") as Element).textContent), "#4: the numbers").toEqual(["1", "2"]);
    expect(dialog.querySelectorAll("thead").length, "#5: no header").toBe(0);
    expect(root().querySelector(".sv-popup--records-sort .sv-popup__body-header")!.textContent, "#6").toBe("Sort by");
    const footer = Array.prototype.map.call(root().querySelectorAll(".sv-popup--records-sort .sv-popup__body-footer .sd-action__title"),
      (el: Element): string => el.textContent);
    expect(footer, "#7: Add New, then Apply").toEqual(["Add New", "Apply"]);
  });
  it("a removed row leaves the dialog and the single row's remove button is disabled; Add New adds a row and is disabled at the limit", () => {
    const matrix = render({ sortCriteria: [{ field: "product", direction: "asc" }, { field: "price", direction: "desc" }] });
    const dialog = openDialog(matrix);
    act(() => { removeButton(rowsOf(dialog)[1]).click(); });
    expect(rowsOf(dialog).length, "#1").toBe(1);
    expect(removeButton(rowsOf(dialog)[0]).disabled, "#2: the remove column stays, disabled").toBe(true);
    const addNew = (): HTMLButtonElement => Array.prototype.filter.call(root().querySelectorAll(".sv-popup--records-sort .sv-popup__body-footer button"),
      (el: Element): boolean => el.textContent === "Add New")[0] as HTMLButtonElement;
    act(() => { addNew().click(); });
    act(() => { addNew().click(); });
    expect(rowsOf(dialog).length, "#3").toBe(3);
    expect([addNew().disabled, removeButton(rowsOf(dialog)[0]).disabled], "#4: Add New is disabled at maxSortLevel rows, not hidden").toEqual([true, false]);
  });
});
