import { SurveyModel, QuestionMatrixDynamicModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeAll, afterAll } from "vitest";

// A sort and a page move rebind the rows of a Dynamic Matrix (survey-core): the rendered table is kept, so React
// keeps every <tr> and input and only updates the values.

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
    type: "matrixdynamic", name: "matrix", rowCount: 0, allowSort: true,
    columns: [{ name: "product", cellType: "text" }, { name: "price", cellType: "text", inputType: "number" },
      { name: "kind", cellType: "dropdown", choices: ["x", "y"] }]
  }, json)] });
  survey.data = { matrix: [{ product: "b", price: 20, kind: "x" }, { product: "a", price: 30 }, { product: "c", price: 10, kind: "y" },
    { product: "d", price: 40 }] };
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
function dataRows(): Array<HTMLTableRowElement> {
  return Array.prototype.slice.call((container as HTMLElement).querySelectorAll("tbody tr.sd-table__row--data"));
}
function textInputs(): Array<HTMLInputElement> {
  return Array.prototype.slice.call((container as HTMLElement).querySelectorAll("tbody tr.sd-table__row--data input"));
}
function productValues(): Array<string> {
  return dataRows().map((tr: HTMLTableRowElement): string => (tr.querySelector("input") as HTMLInputElement).value);
}
function click(element: Element): void {
  act(() => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}
function priceSortButton(): HTMLButtonElement {
  return (container as HTMLElement).querySelectorAll("thead th")[1].querySelector("button") as HTMLButtonElement;
}

describe("Matrix rebind: a sort and a page move keep the rendered rows", () => {
  it("a header sort keeps the <tr> and input elements and shows the new values, also in the input that has focus", () => {
    const matrix = render({});
    const rows = dataRows();
    const inputs = textInputs();
    expect(rows.length, "#1").toBe(4);
    expect(productValues(), "#2").toEqual(["b", "a", "c", "d"]);
    inputs[0].focus();
    expect(document.activeElement, "#3").toBe(inputs[0]);
    click(priceSortButton());
    expect(matrix.sortCriteria.map(item => item.direction), "#4: price sorts high to low").toEqual(["desc"]);
    expect(productValues(), "#5").toEqual(["d", "a", "b", "c"]);
    expect(dataRows().every((tr: HTMLTableRowElement, i: number): boolean => tr === rows[i]), "#6: the same <tr> elements").toBe(true);
    expect(textInputs().every((input: HTMLInputElement, i: number): boolean => input === inputs[i]), "#7: the same inputs").toBe(true);
    expect(document.activeElement, "#8: the focused input keeps the focus").toBe(inputs[0]);
    expect(inputs[0].value, "#9: and shows the record of its row now").toBe("d");
    expect((container as HTMLElement).querySelectorAll("thead th")[1].getAttribute("aria-sort"), "#10").toBe("descending");
    click(priceSortButton());
    click(priceSortButton());
    expect(matrix.sortCriteria.length, "#11: the sort is cleared").toBe(0);
    expect(productValues(), "#12").toEqual(["b", "a", "c", "d"]);
    expect(dataRows().every((tr: HTMLTableRowElement, i: number): boolean => tr === rows[i]), "#13: the same <tr> elements").toBe(true);
    expect((container as HTMLElement).querySelectorAll("thead th")[1].hasAttribute("aria-sort"), "#14").toBe(false);
  });
  it("a page move keeps the <tr> and input elements and shows the next page", () => {
    const matrix = render({ pageSize: 2 });
    const rows = dataRows();
    const inputs = textInputs();
    expect(productValues(), "#1").toEqual(["b", "a"]);
    act(() => { matrix.nextPage(); });
    expect(matrix.pageIndex, "#2").toBe(1);
    expect(productValues(), "#3").toEqual(["c", "d"]);
    expect(dataRows().every((tr: HTMLTableRowElement, i: number): boolean => tr === rows[i]), "#4: the same <tr> elements").toBe(true);
    expect(textInputs().every((input: HTMLInputElement, i: number): boolean => input === inputs[i]), "#5: the same inputs").toBe(true);
  });
});
