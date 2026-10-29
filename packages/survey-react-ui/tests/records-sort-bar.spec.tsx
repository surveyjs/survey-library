import { SurveyModel, QuestionMatrixDynamicModel, ActionContainer } from "survey-core";
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
    type: "matrixdynamic", name: "matrix", title: "Products", rowCount: 0, showSortBar: "always",
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
    expect(titles.slice(0, 3), "#4: label, field and direction, in order").toEqual(["Sort by", "product", "Default"]);
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
    const button = headerBar()!.querySelector("button.sd-sort-bar__dropdown") as HTMLButtonElement;
    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(matrix.state, "#1").toBe("expanded");
    const level = matrix.recordsBar.sortActions.getActionById("sv-sort-level").data as ActionContainer;
    expect(level.getActionById("sv-sort-field").popupModel.isVisible, "#2: the list opens").toBe(true);
  });
});

describe("Records sort bar: several levels", () => {
  it("each level is one element of the bar with its own action bar, separated from the next level and from \"+\"", () => {
    render({ allowSort: true, maxSortLevel: 3, sortCriteria: [{ field: "product", direction: "asc" }, { field: "price", direction: "desc" }],
      columns: [{ name: "product", cellType: "text" }, { name: "price", cellType: "text", inputType: "number" }, { name: "category", cellType: "text" }] });
    // "..." is rendered out of sight until the bar is fitted.
    const hidden = Array.prototype.filter.call(headerBar()!.children, (item: Element): boolean => item.classList.contains("sd-action-bar__item--hidden")) as Array<Element>;
    expect(hidden.map((item: Element): string => item.querySelector("button")!.getAttribute("aria-label")), "#0").toEqual(["Show all sort levels"]);
    const items = Array.prototype.filter.call(headerBar()!.children, (item: Element): boolean => hidden.indexOf(item) < 0) as Array<Element>;
    expect(items.length, "#1: Sort by, two levels and +").toBe(4);
    const levels = Array.prototype.map.call(items, (item: Element): Element => item.querySelector(".sd-sort-bar__level")) as Array<Element>;
    expect(levels.map((level: Element): boolean => !!level && level.classList.contains("sd-action-bar")), "#2").toEqual([false, true, true, false]);
    const separators = Array.prototype.map.call(items, (item: Element): number => item.querySelectorAll(".sd-action-bar__separator").length);
    expect(separators, "#3: one before the second level, one before +").toEqual([0, 0, 1, 1]);
    const labels = (level: Element): Array<string> => Array.prototype.map.call(level.querySelectorAll("button"), (b: Element): string => b.getAttribute("aria-label")) as Array<string>;
    expect(labels(levels[1]), "#4: no remove button on the first level").toEqual(["Sort field product", "Sort order Alphabet, A - Z"]);
    expect(labels(levels[2]), "#5").toEqual(["Sort field 2 price", "Sort order 2 High - Low", "Remove sort level 2"]);
    expect(items[3].querySelector("button")!.getAttribute("aria-label"), "#6").toBe("Add sort level");
  });
  it("\"...\" renders as an icon button with an accessible name, and \"+\" renders disabled at the limit", () => {
    const matrix = render({ allowSort: true, maxSortLevel: 2, sortCriteria: [{ field: "product", direction: "asc" }],
      columns: [{ name: "product", cellType: "text" }, { name: "price", cellType: "text", inputType: "number" }, { name: "category", cellType: "text" }] });
    const button = (label: string): HTMLButtonElement => headerBar()!.querySelector("button[aria-label='" + label + "']") as HTMLButtonElement;
    const more = button("Show all sort levels");
    expect([more.getAttribute("title"), !!more.querySelector(".sv-svg-icon"), !!more.querySelector(".sd-action__title")], "#1")
      .toEqual(["Show all sort levels", true, false]);
    expect(button("Add sort level").disabled, "#2: a level can be added").toBe(false);
    act(() => { matrix.sort([{ field: "product", direction: "asc" }, { field: "price", direction: "asc" }] as any); });
    expect(button("Add sort level").disabled, "#3: the limit").toBe(true);
  });
});
