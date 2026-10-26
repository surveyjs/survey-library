import { SurveyModel, Question, PopupModel, PopupBaseViewModel, Action, createDropdownActionModel, settings } from "survey-core";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey as SurveyReact } from "../entries/index";
import { Popup } from "../src/components/popup/popup";
import { SurveyActionBarItemDropdown } from "../src/components/action-bar/action-bar-item-dropdown";
import { ReactElementFactory } from "../src/element-factory";
import { describe, it, expect, afterEach, beforeAll, vi } from "vitest";

let container: HTMLElement | undefined;
beforeAll(() => {
  // jsdom has no CSS.escape; a click focuses the input through it.
  if (!(globalThis as any).CSS) {
    (globalThis as any).CSS = { escape: (str: string) => str };
  }
  ReactElementFactory.Instance.registerElement("test-popup-input-content", () => {
    return <div className="test-popup-input-content"><input id="testPopupInput" /></div>;
  });
});
function render(element: React.JSX.Element): HTMLElement {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(element, container as HTMLElement);
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
function getRoot(q: Question): HTMLElement {
  return (container as HTMLElement).querySelector("#" + q.id) as HTMLElement;
}
function getInput(q: Question): HTMLElement {
  return (container as HTMLElement).querySelector("#" + q.inputId) as HTMLElement;
}
function getComboboxInput(q: Question): HTMLElement {
  return getRoot(q).querySelector("input[role=combobox]") as HTMLElement;
}
function getPopupContainers(root: HTMLElement): number {
  return root.querySelectorAll(".sv-popup__container").length;
}

describe("A popup renders its content the first time it is shown", () => {
  it("dropdown and tagbox questions render no popup container until opened", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "dropdown", choices: ["item1", "item2", "item3"] },
        { type: "tagbox", name: "tagbox", choices: ["item1", "item2", "item3"] }
      ]
    });
    render(<SurveyReact model={survey} />);
    for (const name of ["dropdown", "tagbox"]) {
      const q = survey.getQuestionByName(name);
      const popupModel: PopupModel = q.dropdownListModel.popupModel;
      const listId = q.dropdownListModel.listModel.elementId;
      expect(getRoot(q).querySelectorAll(".sv-popup").length, name + ": no .sv-popup, not opened").toBe(0);
      expect(getPopupContainers(getRoot(q)), name + ": not opened").toBe(0);
      expect(getComboboxInput(q).getAttribute("aria-controls"), name + ": aria-controls, not opened").toBe(listId);
      expect((container as HTMLElement).querySelector("#" + listId), name + ": the list, not opened").toBeNull();

      act(() => {
        (getInput(q).parentElement as HTMLElement).click();
      });
      expect(popupModel.isVisible, name + ": opened").toBe(true);
      expect(getPopupContainers(getRoot(q)), name + ": opened").toBe(1);
      expect(getComboboxInput(q).getAttribute("aria-controls"), name + ": aria-controls, opened").toBe(listId);
      expect(!!(container as HTMLElement).querySelector("#" + listId), name + ": the list, opened").toBe(true);

      act(() => {
        popupModel.hide();
      });
      expect(popupModel.isVisible, name + ": closed").toBe(false);
      expect(getPopupContainers(getRoot(q)), name + ": closed, the tree stays").toBe(1);
      expect((getRoot(q).querySelector(".sv-popup") as HTMLElement).style.display, name + ": closed, hidden").toBe("none");
      expect(getComboboxInput(q).getAttribute("aria-controls"), name + ": aria-controls, closed").toBe(listId);
      expect(!!(container as HTMLElement).querySelector("#" + listId), name + ": the list, closed").toBe(true);
    }
  });
  it("the keyboard works from the list model and renders the popup list only when it opens the popup", () => {
    const choices = Array.from({ length: 27 }, (_, i) => "item" + (i + 1));
    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "dropdown", showOtherItem: true, choices },
        { type: "tagbox", name: "tagbox", showOtherItem: true, choices }
      ]
    });
    render(<SurveyReact model={survey} />);
    const pressKey = (el: HTMLElement, keyCode: number) => {
      const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "keyCode", { get: () => keyCode });
      Object.defineProperty(event, "which", { get: () => keyCode });
      act(() => {
        el.dispatchEvent(event);
      });
    };
    const keys = { up: 38, down: 40, tab: 9, enter: 13, escape: 27, delete: 46, backspace: 8 };
    for (const name of ["dropdown", "tagbox"]) {
      const q = survey.getQuestionByName(name);
      const popupModel: PopupModel = q.dropdownListModel.popupModel;
      const listModel = q.dropdownListModel.listModel;
      const input = getComboboxInput(q);
      expect(listModel.visibleItems.length, name + ": the items are in the list model").toBe(28);

      for (const key of ["up", "tab", "enter", "delete", "backspace", "escape"]) {
        pressKey(input, keys[key]);
        expect(popupModel.isVisible, name + ", " + key + ": not opened").toBe(false);
        expect(getRoot(q).querySelectorAll(".sv-popup").length, name + ", " + key + ": no popup list").toBe(0);
      }

      pressKey(input, keys.down);
      expect(popupModel.isVisible, name + ", down: opened").toBe(true);
      expect(listModel.focusedItem?.id, name + ", down: the focused item").toBe("item1");
      expect(getRoot(q).querySelectorAll(".sd-selectlist__item").length, name + ", down: the list is rendered").toBe(28);
      expect(getRoot(q).querySelector(".sd-selectlist__item--focused")?.textContent, name + ", down: the focused item is rendered").toBe("item1");

      pressKey(input, keys.down);
      expect(listModel.focusedItem?.id, name + ", down again").toBe("item2");
      pressKey(input, keys.enter);
      expect(name === "tagbox" ? [...q.value] : q.value, name + ", enter selects the focused item").toEqual(name === "tagbox" ? ["item2"] : "item2");

      pressKey(input, keys.escape);
      expect(popupModel.isVisible, name + ", escape: closed").toBe(false);
      expect(getRoot(q).querySelectorAll(".sd-selectlist__item").length, name + ", escape: the list stays").toBe(28);
    }
  });
  it("an action-bar dropdown item renders no popup container until opened", () => {
    const action: Action = createDropdownActionModel(
      { id: "menu", title: "Menu" },
      { items: [{ id: "item1", title: "Item 1" }, { id: "item2", title: "Item 2" }] }
    );
    const root = render(<SurveyActionBarItemDropdown item={action} />);
    expect(root.querySelectorAll("button").length, "the button is rendered").toBe(1);
    expect(getPopupContainers(root), "not opened").toBe(0);
    expect(root.querySelectorAll(".sd-menu-item").length, "no items, not opened").toBe(0);

    act(() => {
      root.querySelector("button")?.click();
    });
    expect(action.popupModel.isVisible, "opened").toBe(true);
    expect(getPopupContainers(root), "opened").toBe(1);
    expect(root.querySelectorAll(".sd-menu-item").length, "opened, items").toBe(2);

    act(() => {
      action.popupModel.hide();
    });
    expect(action.popupModel.isVisible, "closed").toBe(false);
    expect(getPopupContainers(root), "closed, the tree stays").toBe(1);
    expect(root.querySelectorAll(".sd-menu-item").length, "closed, items").toBe(2);

    act(() => {
      root.querySelector("button")?.click();
    });
    expect(action.popupModel.isVisible, "opened again").toBe(true);
    expect(getPopupContainers(root), "opened again").toBe(1);
  });
  // The animated show is debounced to a microtask; the enter animation runs after the next render.
  async function flushAnimation(): Promise<void> {
    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(50);
    });
  }
  async function checkFirstShow(caption: string, show: (popupModel: PopupModel) => void, isAnimated: boolean = false): Promise<void> {
    vi.useFakeTimers();
    const prevAnimationEnabled = settings.animationEnabled;
    settings.animationEnabled = isAnimated;
    const target = document.createElement("div");
    document.body.appendChild(target);
    try {
      const popupModel = new PopupModel("test-popup-input-content", {}, { isFocusedContent: true });
      popupModel.getTargetCallback = () => target;
      const popupRef = React.createRef<Popup>();
      const root = render(<Popup ref={popupRef} model={popupModel} />);
      const viewModel: PopupBaseViewModel = (popupRef.current as any).popup;
      const log: Array<string> = [];
      const logState = (name: string) => {
        const popup = viewModel.container?.querySelector(".sv-popup") as HTMLElement;
        const input = popup?.querySelector(".sv-popup__content #testPopupInput");
        log.push(name + ": " + (!popup ? "no popup" : (popup.style.display === "none" ? "hidden" : "visible") + (!!input ? ", input" : ", no input")));
      };
      // PopupDropdownViewModel overrides updateOnShowing without calling super: wrap the instance.
      const updateOnShowing = viewModel.updateOnShowing;
      viewModel.updateOnShowing = function () {
        logState("updateOnShowing");
        return updateOnShowing.call(viewModel);
      };
      const getEnterOptions = viewModel.getEnterOptions;
      viewModel.getEnterOptions = function () {
        logState("enter");
        return getEnterOptions.call(viewModel);
      };
      expect(viewModel.isPositionSet, caption + ": not shown, not positioned").toBe(false);

      show(popupModel);
      if (isAnimated) await flushAnimation();
      expect(viewModel.isVisible, caption + ": shown").toBe(true);
      expect(viewModel.isPositionSet, caption + ": shown, positioned by the renderer").toBe(true);
      expect(log, caption + ": the content is present when the popup is positioned").toEqual(
        isAnimated ? ["enter: visible, input", "updateOnShowing: visible, input"] : ["updateOnShowing: visible, input"]);
      const input = root.querySelector(".sv-popup__content #testPopupInput");
      expect(!!input, caption + ": the input is rendered").toBe(true);
      expect(document.activeElement === input, caption + ": not focused before the timeout").toBe(false);
      vi.advanceTimersByTime(100);
      expect(document.activeElement === input, caption + ": the input is focused").toBe(true);
      act(() => {
        popupModel.hide();
      });
      if (isAnimated) await flushAnimation();
      expect(viewModel.isVisible, caption + ": hidden").toBe(false);
      expect(root.querySelectorAll(".sv-popup__container").length, caption + ": hidden, the tree stays").toBe(1);
    } finally {
      settings.animationEnabled = prevAnimationEnabled;
      target.remove();
      vi.useRealTimers();
    }
  }
  it("the first show positions and focuses with the content present, batched", async () => {
    await checkFirstShow("batched", (popupModel) => {
      act(() => {
        popupModel.isVisible = true;
      });
    });
  });
  it("the first show positions and focuses with the content present, not batched", async () => {
    // React 17 renders on each state change outside a batch.
    await checkFirstShow("not batched", (popupModel) => {
      popupModel.isVisible = true;
    });
  });
  it("the first show positions and focuses with the content present, animated", async () => {
    await checkFirstShow("animated", (popupModel) => {
      act(() => {
        popupModel.isVisible = true;
      });
    }, true);
  });
});
