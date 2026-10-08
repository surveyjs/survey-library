import { SurveyModel, Question } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { describe, it, expect, afterEach, beforeAll } from "vitest";

const choices = ["item1", "item2", "item3"];
const json = {
  elements: [
    { type: "dropdown", name: "dropdown", choices },
    { type: "dropdown", name: "dropdownNoSearch", choices, searchEnabled: false },
    { type: "tagbox", name: "tagbox", choices },
    { type: "rating", name: "rating", displayMode: "dropdown" },
    { type: "buttongroup", name: "buttongroup", choices }
  ]
};
const prefill: any = { dropdown: "item2", dropdownNoSearch: "item1", tagbox: ["item1", "item3"], rating: 3, buttongroup: "item2" };

let container: HTMLElement | undefined;
beforeAll(() => {
  // jsdom has no CSS.escape; a click focuses the input through it.
  if (!(globalThis as any).CSS) {
    (globalThis as any).CSS = { escape: (str: string) => str };
  }
});
function renderSurvey(survey: SurveyModel): HTMLElement {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(<SurveyReact model={survey} />, container as HTMLElement);
  });
  return container;
}
afterEach(() => {
  if (container) {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = undefined;
  }
});
function createSurvey(mode: "design" | "display" | "readOnly" | "edit", isPrefilled: boolean): SurveyModel {
  let survey: SurveyModel;
  if (mode === "design") {
    survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
  } else {
    survey = new SurveyModel(json);
  }
  if (mode === "display") survey.mode = "display";
  survey.getAllQuestions().forEach(q => {
    if (mode === "readOnly") q.readOnly = true;
    if (q.getType() === "rating" || q.getType() === "buttongroup") q.renderAs = "dropdown";
    if (isPrefilled) q.value = prefill[q.name];
  });
  return survey;
}
function hasModel(q: Question): boolean {
  return !!q["dropdownListModelValue"];
}
function getControl(q: Question): HTMLElement {
  return (container as HTMLElement).querySelector("#" + q.inputId) as HTMLElement;
}

describe("DropdownListModel is created on demand, Issue#9014", () => {
  it("Rendering in design, display and read-only mode creates no model, Issue#9014", () => {
    for (const mode of ["design", "display", "readOnly"]) {
      for (const isPrefilled of [false, true]) {
        const survey = createSurvey(mode as any, isPrefilled);
        renderSurvey(survey);
        survey.getAllQuestions().forEach(q => {
          const caption = mode + ", " + (isPrefilled ? "prefilled" : "empty") + ", " + q.name;
          expect(!!getControl(q), caption + ", the control is rendered").toBe(true);
          expect(q.isEmpty(), caption + ", value").toBe(!isPrefilled);
          expect(hasModel(q), caption + ", no model").toBe(false);
        });
        // eslint-disable-next-line react/no-deprecated
        ReactDOM.unmountComponentAtNode(container as HTMLElement);
      }
    }
  });
  it("Rendering an editable survey creates the models as before, Issue#9014", () => {
    for (const isPrefilled of [false, true]) {
      const survey = createSurvey("edit", isPrefilled);
      renderSurvey(survey);
      survey.getAllQuestions().forEach(q => {
        expect(hasModel(q), (isPrefilled ? "prefilled, " : "empty, ") + q.name).toBe(true);
      });
      // eslint-disable-next-line react/no-deprecated
      ReactDOM.unmountComponentAtNode(container as HTMLElement);
    }
  });
  it("A display-mode survey switched to edit opens the list on click, Issue#9014", () => {
    const survey = createSurvey("display", true);
    renderSurvey(survey);
    const dropdown = survey.getQuestionByName("dropdown");
    const dropdownNoSearch = survey.getQuestionByName("dropdownNoSearch");
    const tagbox = survey.getQuestionByName("tagbox");
    expect(hasModel(dropdown), "display mode, no model").toBe(false);
    act(() => {
      survey.mode = "edit";
    });
    expect(hasModel(dropdown), "edit mode mounts the popup").toBe(true);

    const input = (container as HTMLElement).querySelector("#" + dropdown.getInputId()) as HTMLElement;
    expect(input.getAttribute("aria-expanded"), "dropdown is closed").toBe("false");
    act(() => {
      (getControl(dropdown).parentElement as HTMLElement).click();
    });
    expect(dropdown.dropdownListModel.popupModel.isVisible, "dropdown popup is opened").toBe(true);
    expect(input.getAttribute("aria-expanded"), "dropdown is expanded").toBe("true");

    act(() => {
      (getControl(dropdownNoSearch).parentElement as HTMLElement).click();
    });
    expect(dropdownNoSearch.dropdownListModel.popupModel.isVisible, "dropdown without search popup is opened").toBe(true);
    expect(getControl(dropdownNoSearch).getAttribute("aria-expanded"), "dropdown without search is expanded").toBe("true");

    act(() => {
      (getControl(tagbox).parentElement as HTMLElement).click();
    });
    expect(tagbox.dropdownListModel.popupModel.isVisible, "tagbox popup is opened").toBe(true);
    const tagboxInput = (container as HTMLElement).querySelector("#" + tagbox.getInputId()) as HTMLElement;
    expect(tagboxInput.getAttribute("aria-expanded"), "tagbox is expanded").toBe("true");
  });
  it("Focusing a read-only dropdown creates the model, Issue#9014", () => {
    const survey = createSurvey("readOnly", true);
    renderSurvey(survey);
    const dropdown = survey.getQuestionByName("dropdown");
    expect(hasModel(dropdown), "no model before focus").toBe(false);
    act(() => {
      dropdown.onFocus({});
    });
    expect(hasModel(dropdown), "focus creates the model").toBe(true);
    act(() => {
      dropdown.title = "Changed title";
    });
    expect(getControl(dropdown).getAttribute("aria-expanded"), "read-only control is not expanded").toBe("false");
    act(() => {
      dropdown.onBlur({ target: null, stopPropagation: () => { } });
    });
    expect(dropdown.dropdownListModel.focused, "blur").toBe(false);
  });
});
