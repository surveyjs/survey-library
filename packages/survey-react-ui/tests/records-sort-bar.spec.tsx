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
    type: "matrixdynamic", name: "matrix", title: "Products", rowCount: 0,
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
const root = (): HTMLElement => container as HTMLElement;
const headerBar = (): Element => root().querySelector(".sd-question__header .sd-matrixdynamic__sort-bar");
const topBar = (): Element => root().querySelector(".sd-matrixdynamic__sort-bar-top .sd-matrixdynamic__sort-bar");

describe("Records sort bar: where the renderer mounts it", () => {
  it("the header shows and hides the bar when allowSort flips at runtime", () => {
    const matrix = render({});
    expect(headerBar(), "#1: no bar").toBeNull();
    act(() => { matrix.allowSort = true; });
    expect(headerBar(), "#2: in the header").not.toBeNull();
    expect(root().querySelector(".sd-question__header")!.classList.contains("sd-question__header--sort-bar"), "#3: the modifier").toBe(true);
    const titles = Array.prototype.map.call(headerBar()!.querySelectorAll(":scope > * .sd-action__title"), (el: Element): string => el.textContent);
    expect(titles.slice(0, 3), "#4: field, label and direction, in order").toEqual(["product", "Sort by", "Default"]);
    act(() => { matrix.allowSort = false; });
    expect(headerBar(), "#5: gone").toBeNull();
  });
  it("with a hidden title the bar shows above the records, and moves to the header when the title comes back", () => {
    const matrix = render({ allowSort: true, titleLocation: "hidden" });
    expect([headerBar(), !!topBar()], "#1").toEqual([null, true]);
    act(() => { matrix.titleLocation = "top"; });
    expect([!!headerBar(), topBar()], "#2").toEqual([true, null]);
  });
  it("a click on a dropdown in the header of a collapsible question does not collapse it", () => {
    const matrix = render({ allowSort: true, state: "expanded" });
    const button = headerBar()!.querySelector("button") as HTMLButtonElement;
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(matrix.state, "#1").toBe("expanded");
    expect(matrix.recordsBar.sortActions.getActionById("sv-sort-field").popupModel.isVisible, "#2: the list opens").toBe(true);
  });
});
