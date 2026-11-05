import { SurveyModel, QuestionRowModel, settings } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";

const containers: Array<HTMLElement> = [];
function render(survey: SurveyModel): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  containers.push(container);
  act(() => {
    ReactDOM.render(<SurveyReact model={survey} />, container);
  });
  return container;
}
function unmount(container: HTMLElement): void {
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
  container.remove();
  containers.splice(containers.indexOf(container), 1);
}
let prevAnimationEnabled: boolean;
beforeEach(() => {
  // The leave animation keeps a hidden row mounted.
  prevAnimationEnabled = settings.animationEnabled;
  settings.animationEnabled = false;
  vi.useFakeTimers();
});
afterEach(() => {
  [...containers].forEach(container => unmount(container));
  vi.useRealTimers();
  settings.animationEnabled = prevAnimationEnabled;
});
// Five questions, one row each. With firstBatchSize = 3, rows 3 and 4 render lazily.
function createLazySurvey(): SurveyModel {
  const survey = new SurveyModel({
    elements: [1, 2, 3, 4, 5].map(i => ({ type: "text", name: "q" + i }))
  });
  survey.lazyRenderEnabled = true;
  return survey;
}
// The row's timer calls startLazyRendering. jsdom has no scroll, so the row renders at once.
function renderLazyRow(survey: SurveyModel): QuestionRowModel {
  const row = survey.currentPage.rows[4];
  expect(row.isLazyRendering(), "the last row renders lazily").toBe(true);
  expect(row.isNeedRender, "the lazy row starts as a placeholder").toBe(false);
  act(() => { vi.advanceTimersByTime(20); });
  expect(row.isNeedRender, "the lazy row is rendered").toBe(true);
  return row;
}

describe("A lazy row is reset when the last component that renders it unmounts", () => {
  it("a row that unmounts stops lazy rendering and clears its root element", () => {
    const survey = createLazySurvey();
    const container = render(survey);
    const row = renderLazyRow(survey);
    expect(container.contains(row.getRootElement()), "the row knows its root element").toBe(true);
    const stopLazyRendering = vi.spyOn(row, "stopLazyRendering");

    act(() => { survey.getQuestionByName("q5").visible = false; });
    expect(survey.currentPage.visibleRows.indexOf(row), "the row is not rendered").toBe(-1);
    expect(stopLazyRendering, "lazy rendering is stopped").toHaveBeenCalledTimes(1);
    expect(row.getRootElement(), "the root element is cleared").toBeUndefined();
    expect(row.isNeedRender, "the row renders lazily again when it is shown").toBe(false);
    survey.dispose();
  });
  it("a row rendered by two components is reset only when the second one unmounts, Bug#10701", () => {
    const survey = createLazySurvey();
    const first = render(survey);
    const second = render(survey);
    const row = renderLazyRow(survey);
    expect(second.contains(row.getRootElement()), "the row's root element is in the second component").toBe(true);
    const stopLazyRendering = vi.spyOn(row, "stopLazyRendering");

    unmount(first);
    expect(stopLazyRendering, "lazy rendering goes on for the second component").not.toHaveBeenCalled();
    expect(row.isNeedRender, "the row stays rendered").toBe(true);
    expect(second.contains(row.getRootElement()), "the root element is kept").toBe(true);

    unmount(second);
    expect(stopLazyRendering, "lazy rendering is stopped").toHaveBeenCalledTimes(1);
    expect(row.getRootElement(), "the root element is cleared").toBeUndefined();
    expect(row.isNeedRender, "the row renders lazily again").toBe(false);
    survey.dispose();
  });
});
