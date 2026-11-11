import { SurveyModel, QuestionPanelDynamicModel, PanelModel } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeAll, afterAll } from "vitest";

// A sort and a page move rebind the panels of a Dynamic Panel in list mode (survey-core): the panels are kept, so
// React keeps each panel's element and inputs and only updates the values.

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
function render(json: any): QuestionPanelDynamicModel {
  const survey = new SurveyModel({ elements: [Object.assign({
    type: "paneldynamic", name: "items", allowSort: true, templateTitle: "Item {panelIndex}",
    templateElements: [{ type: "text", name: "product" }, { type: "text", name: "price", inputType: "number" },
      { type: "dropdown", name: "kind", choices: ["x", "y"] }]
  }, json)] });
  survey.data = { items: [{ product: "b", price: 20, kind: "x" }, { product: "a", price: 30 }, { product: "c", price: 10, kind: "y" },
    { product: "d", price: 40 }] };
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<SurveyReact model={survey} />, container as HTMLElement);
  });
  return survey.getQuestionByName("items") as QuestionPanelDynamicModel;
}
afterEach(() => {
  if (container) {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = undefined;
  }
});
function panelElements(question: QuestionPanelDynamicModel): Array<HTMLElement> {
  return question.renderedPanels.map((panel: PanelModel): HTMLElement => (container as HTMLElement).querySelector("#" + panel.id) as HTMLElement);
}
function productInputs(question: QuestionPanelDynamicModel): Array<HTMLInputElement> {
  return question.renderedPanels.map((panel: PanelModel): HTMLInputElement =>
    (container as HTMLElement).querySelector("#" + panel.getQuestionByName("product").inputId) as HTMLInputElement);
}
function productValues(question: QuestionPanelDynamicModel): Array<string> {
  return productInputs(question).map((input: HTMLInputElement): string => input.value);
}
function titles(question: QuestionPanelDynamicModel): Array<string> {
  return panelElements(question).map((el: HTMLElement): string => (el.querySelector(".sd-panel__title") as HTMLElement).textContent as string);
}
function isSame<T>(current: Array<T>, old: Array<T>): boolean {
  return current.length === old.length && current.every((item: T, i: number): boolean => !!item && item === old[i]);
}

describe("Panel rebind: a sort and a page move keep the rendered panels", () => {
  it("a sort keeps the panel and input elements and shows the new values, also in the input that has focus", () => {
    const question = render({});
    const panels = panelElements(question);
    const inputs = productInputs(question);
    expect(panels.length, "#1").toBe(4);
    expect(productValues(question), "#2").toEqual(["b", "a", "c", "d"]);
    inputs[0].focus();
    expect(document.activeElement, "#3").toBe(inputs[0]);
    act(() => { question.sort([{ field: "price", direction: "desc" }]); });
    expect(productValues(question), "#4").toEqual(["d", "a", "b", "c"]);
    expect(isSame(panelElements(question), panels), "#5: the same panel elements").toBe(true);
    expect(isSame(productInputs(question), inputs), "#6: the same inputs").toBe(true);
    expect(document.activeElement, "#7: the focused input keeps the focus").toBe(inputs[0]);
    expect(inputs[0].value, "#8: and shows the record of its panel now").toBe("d");
    // {panelIndex} is the number of the record, as a panel built for it shows.
    expect(titles(question), "#9: the titles follow the records").toEqual(["Item 4", "Item 2", "Item 1", "Item 3"]);
    act(() => { question.sort([]); });
    expect(productValues(question), "#10: the sort is cleared").toEqual(["b", "a", "c", "d"]);
    expect(isSame(panelElements(question), panels), "#11: the same panel elements").toBe(true);
  });
  it("a page move keeps the panel and input elements and shows the next page", () => {
    const question = render({ pageSize: 2 });
    const panels = panelElements(question);
    const inputs = productInputs(question);
    expect(productValues(question), "#1").toEqual(["b", "a"]);
    act(() => { question.nextPage(); });
    expect(question.pageIndex, "#2").toBe(1);
    expect(productValues(question), "#3").toEqual(["c", "d"]);
    expect(titles(question), "#4: the panel numbers of page 2").toEqual(["Item 3", "Item 4"]);
    expect(isSame(panelElements(question), panels), "#5: the same panel elements").toBe(true);
    expect(isSame(productInputs(question), inputs), "#6: the same inputs").toBe(true);
  });
});
