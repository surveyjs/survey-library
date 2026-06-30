import { PopupUtils } from "../../src/utils/popup";
import { IPopupOptionsBase, PopupModel } from "../../src/popup";
import { PopupBaseViewModel } from "../../src/popup-view-model";
import { createPopupViewModel } from "../../src/popup-utils";
import { surveyLocalization } from "../../src/surveyStrings";
import { PopupDropdownViewModel } from "../../src/popup-dropdown-view-model";
import { PopupModalViewModel } from "../../src/popup-modal-view-model";
import { englishStrings } from "../../src/localization/english";
import { germanSurveyStrings } from "../../src/localization/german";
import { settings, ISurveyEnvironment } from "../../src/settings";
import { AnimationOptions, AnimationUtils } from "../../src/utils/animation";
import { ListModel } from "../../src/list";
import { Action, IAction } from "../../src/actions/action";

import { describe, test, expect, vi } from "vitest";
// const popupTemplate = require("html-loader?interpolate!val-loader!../../../../src/knockout/components/popup/popup.html");

const popupTemplate = `<div>
  <!-- ko with: popupViewModel -->
  <div class="sv-popup" tabindex="-1"
    data-bind="visible: isVisible, click: function(data, event) { clickOutside(event); return true; }, class: styleClass, event: { keydown: function(data, event) { onKeyDown(event); return true; } }">
    <div class="sv-popup__container"
      data-bind="style: { left: left, top: top, height: height, minWidth: minWidth, width: width }, click: function() { return true; }, clickBubble: false">
      <!-- ko if: $data.showHeader -->
      <!-- ko template: { name: $data.popupHeaderTemplate, data: $data } -->
      <!-- /ko -->
      <!-- /ko -->
      <div class="sv-popup__body-content">
        <!-- ko if: !!title  -->
        <div class="sv-popup__body-header" data-bind="text: title"></div>
        <!-- /ko -->
        <div class="sv-popup__scrolling-content">
          <div class="sv-popup__content"
            data-bind="component: { name: contentComponentName, params: contentComponentData }"></div>
        </div>
        <!-- ko if: showFooter  -->
        <div class="sv-popup__body-footer">
          <!-- ko component: { name: "sv-action-bar", params: { model: $data.footerToolbar } } -->
          <!-- /ko -->
        </div>
        <!-- /ko -->
      </div>
    </div>
  </div>
  <!-- /ko -->
</div>
`;

describe("Popup", () => {
  function addElementIntoBody(element: HTMLElement) {
    document.body.style.margin = "0px";
    document.body.appendChild(element);
  }
  function getPopupContainer(root: HTMLElement) {
    return <HTMLElement>root?.querySelector(".sv-popup__container");
  }

  // jsdom does not perform layout, so getBoundingClientRect/offsetWidth/offsetHeight
  // always report 0 even when an inline style sets a size. The popup positioning
  // tests below need real values; this helper exposes them deterministically.
  function stubElementLayout(el: HTMLElement, rect: { left?: number, top?: number, width?: number, height?: number, scrollHeight?: number }) {
    const left = rect.left || 0;
    const top = rect.top || 0;
    const width = rect.width || 0;
    const height = rect.height || 0;
    const scrollHeight = rect.scrollHeight ?? height;
    Object.defineProperty(el, "offsetWidth", { configurable: true, value: width });
    Object.defineProperty(el, "offsetHeight", { configurable: true, value: height });
    Object.defineProperty(el, "scrollHeight", { configurable: true, value: scrollHeight });
    el.getBoundingClientRect = () => ({
      x: left, y: top, left, top, width, height,
      right: left + width, bottom: top + height,
      toJSON() { return this; }
    } as DOMRect);
  }
  // Reads the px value from an inline style (e.g., "200px") and stubs layout to match.
  function stubFromInlineStyle(el: HTMLElement) {
    const px = (v: string) => parseFloat(v) || 0;
    stubElementLayout(el, {
      left: px(el.style.left),
      top: px(el.style.top),
      width: px(el.style.width),
      height: px(el.style.height),
    });
  }

  function createPopupViewModelTest(model: PopupModel, target: HTMLElement) {
    model.getTargetCallback = () => target;
    return createPopupViewModel(model);
  }

  const targetRect = {
    left: 20,
    top: 20,
    width: 50,
    height: 50,
    right: 70,
    bottom: 70,
  };

  //TODO: disable setTimeout when testing
  const toggleVisibility = PopupModel.prototype.toggleVisibility;
  PopupModel.prototype.toggleVisibility = function () {
    var prevSetTimeout = window.setTimeout;
    (<any>window).setTimeout = function (callback: any) {
      callback();
    };
    toggleVisibility.apply(this, arguments);
    window.setTimeout = prevSetTimeout;
  };
  //

  test("PopupModel defaults", () => {
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data);

    expect(model.contentComponentName).toBe("sv-list");
    expect(model.contentComponentData).toBe(data);
    expect(model.verticalPosition).toBe("bottom");
    expect(model.horizontalPosition).toBe("left");
    expect(model.showPointer).toBe(true);
    expect(model.isModal).toBe(false);
    expect(typeof model.onCancel).toBe("function");
    expect(typeof model.onApply).toBe("function");
    expect(typeof model.onHide).toBe("function");
    expect(typeof model.onShow).toBe("function");
    expect(model.cssClass).toBe("");
    expect(model.onVisibilityChanged.isEmpty).toBeTruthy();
  });

  test("PopupModel toggleVisibility", () => {
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data);

    let trace = "";

    model.toggleVisibility();
    expect(trace).toBe("");

    model.onVisibilityChanged.add(() => {
      trace += "->onToggleVisibility";
    });

    model.toggleVisibility();
    expect(trace).toBe("->onToggleVisibility");
  });

  test("PopupDropdownViewModel defaults", () => {
    surveyLocalization.currentLocale = "";
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data);

    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.contentComponentName).toBe("sv-list");
    expect(viewModel.contentComponentData).toBe(data);
    expect(viewModel.model.verticalPosition).toBe("bottom");
    expect(viewModel.model.horizontalPosition).toBe("left");
    expect(viewModel.showHeader).toBe(true);
    expect(viewModel.isModal).toBe(false);
    expect(typeof viewModel.model.onCancel).toBe("function");
    expect(typeof viewModel.model.onApply).toBe("function");
    expect(typeof viewModel.model.onHide).toBe("function");
    expect(typeof viewModel.model.onShow).toBe("function");
    expect(viewModel.model.cssClass).toBe("");

    //expect(ko.isWritableObservable(viewModel.top)).toBe(true);
    expect(viewModel.top).toBe("0px");
    //expect(ko.isWritableObservable(viewModel.left)).toBe(true);
    expect(viewModel.left).toBe("0px");
    //expect(ko.isWritableObservable(viewModel.popupDirection)).toBe(true);
    expect(viewModel.popupDirection).toBe("left");
    //expect(ko.isWritableObservable(viewModel.pointerTarget)).toBe(true);
    expect(viewModel.pointerTarget).toEqual({ left: "0px", top: "0px" });
    // expect(ko.isWritableObservable(viewModel.isVisible)).toBe(true);
    expect(viewModel.isVisible).toBe(false);

    const container: HTMLElement = viewModel.container;
    expect(!!container).toBe(true);
    expect(container.tagName).toBe("DIV");
    expect(container.innerHTML.indexOf('<div class="sv-popup"')).not.toBe(0);
    expect(container.parentElement.tagName).toBe("BODY");

    expect(viewModel.footerToolbar.actions.length).toBe(1);
    expect(viewModel.footerToolbar.actions[0].title).toBe(viewModel.cancelButtonText);

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupDropdownViewModel RTL", () => {
    surveyLocalization.currentLocale = "";
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data, { horizontalPosition: "right" });

    document.dir = "rtl";
    // jsdom does not propagate document.dir into computed style; set it on body too.
    document.body.style.direction = "rtl";
    const targetElement: HTMLElement = document.createElement("div");
    targetElement.style.position = "absolute";
    targetElement.style.top = "1000px";
    targetElement.style.left = "1000px";
    targetElement.style.width = "32px";
    targetElement.style.height = "24px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = viewModel.container.querySelector(".sv-popup__container") as HTMLElement;
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";
    popupContainer.style.margin = "8px";
    stubElementLayout(popupContainer, { width: 200, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 200, height: 400 });

    (<any>window).innerHeight = 2000;
    (<any>window).innerWidth = 2000;
    viewModel.updateOnShowing();

    viewModel.updatePosition(false, false);
    expect(viewModel.popupDirection).toBe("left");

    viewModel.dispose();
    targetElement.remove();
    document.dir = "";
    document.body.style.direction = "";
  });

  test("PopupDropdownViewModel custom environment", () => {
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data);

    const shadowRootWrapper = document.createElement("div");
    const shadowRoot = shadowRootWrapper.attachShadow({ mode: "open" });

    const popupMountContainer = document.createElement("div");
    popupMountContainer.setAttribute("id", "shadowElement");
    shadowRoot.appendChild(popupMountContainer);

    const environment: ISurveyEnvironment = {
      ...settings.environment,
      root: shadowRoot,
      rootElement: shadowRoot,
      popupMountContainer
    };

    settings.environment = environment as any;

    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    const container: HTMLElement = viewModel.container;
    expect(!!container).toBe(true);
    expect(container.tagName).toBe("DIV");
    expect(container.innerHTML.indexOf('<div class="sv-popup"')).not.toBe(0);

    expect(container.parentElement?.tagName).toBe("DIV");
    expect(container.parentElement?.id).toBe("shadowElement");

    viewModel.dispose();
    targetElement.remove();
    popupMountContainer.remove();
    shadowRootWrapper.remove();

    settings.environment = {
      ...settings.environment,
      root: document,
      rootElement: document.body,
      popupMountContainer: document.body,
    };
  });

  test("PopupModalViewModel defaults", () => {
    surveyLocalization.currentLocale = "";
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data);
    model.isModal = true;
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupModalViewModel = createPopupViewModelTest(model, targetElement) as PopupModalViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.contentComponentName).toBe("sv-list");
    expect(viewModel.contentComponentData).toBe(data);
    expect(viewModel.model.verticalPosition).toBe("bottom");
    expect(viewModel.model.horizontalPosition).toBe("left");
    expect(viewModel.isModal).toBe(true);
    expect(typeof viewModel.model.onCancel).toBe("function");
    expect(typeof viewModel.model.onApply).toBe("function");
    expect(typeof viewModel.model.onHide).toBe("function");
    expect(typeof viewModel.model.onShow).toBe("function");
    expect(viewModel.model.cssClass).toBe("");
    expect(viewModel.isVisible).toBe(false);

    const container: HTMLElement = viewModel.container;
    expect(!!container).toBe(true);
    expect(container.tagName).toBe("DIV");
    expect(container.innerHTML.indexOf('<div class="sv-popup"')).not.toBe(0);
    expect(container.parentElement.tagName).toBe("BODY");

    expect(viewModel.applyButtonText).toBe("Apply");
    expect(viewModel.cancelButtonText).toBe("Cancel");
    expect(viewModel.footerToolbar.actions.length).toBe(2);
    expect(viewModel.footerToolbar.actions[0].title).toBe(viewModel.cancelButtonText);
    expect(viewModel.footerToolbar.actions[1].title).toBe(viewModel.applyButtonText);

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModalViewModel getActualHorizontalPosition", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.model.horizontalPosition).toBe("left");
    expect(viewModel["getActualHorizontalPosition"]()).toBe("left");

    document.body.style.direction = "rtl";
    expect(viewModel["getActualHorizontalPosition"]()).toBe("right");

    document.body.style.direction = "";
    expect(viewModel["getActualHorizontalPosition"]()).toBe("left");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupViewModel styleClass", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.styleClass).toBe("sv-popup--menu-popup sv-popup--show-pointer sv-popup--left");
    model.cssClass = "my-css-class";
    expect(viewModel.styleClass).toBe("my-css-class sv-popup--menu-popup sv-popup--show-pointer sv-popup--left");

    viewModel.popupDirection = "down";
    expect(viewModel.styleClass).toBe("my-css-class sv-popup--menu-popup sv-popup--show-pointer sv-popup--down");

    model.showPointer = false;
    expect(viewModel.styleClass).toBe("my-css-class sv-popup--menu-popup");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupViewModel isVisible", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.popupDirection).toBe("left");
    expect(viewModel.pointerTarget).toEqual({ left: "0px", top: "0px" });

    let trace: string = "";
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    model.toggleVisibility();

    //viewModel.isVisible(!viewModel.isVisible());
    expect(trace).toBe("->onShow");
    expect(viewModel.isVisible).toBe(true);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.popupDirection).toBe("left");
    expect(viewModel.pointerTarget.left).toBe("0px");
    expect(viewModel.pointerTarget.top).toBe("0px");
    trace = "";

    model.toggleVisibility();
    //viewModel.isVisible(!viewModel.isVisible());
    expect(trace).toBe("->onHide");
    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.popupDirection).toBe("left");
    expect(viewModel.pointerTarget.left).toBe("0px");
    expect(viewModel.pointerTarget.top).toBe("0px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel toggleVisibility", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;

    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.popupDirection).toBe("left");
    expect(viewModel.pointerTarget).toEqual({ left: "0px", top: "0px" });

    let trace: string = "";
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    model.toggleVisibility();
    //viewModel.isVisible(!viewModel.isVisible());
    expect(trace).toBe("->onShow");
    expect(viewModel.isVisible).toBe(true);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.popupDirection).toBe("left");
    expect(viewModel.pointerTarget.left).toBe("0px");
    expect(viewModel.pointerTarget.top).toBe("0px");
    trace = "";

    model.toggleVisibility();
    //viewModel.isVisible(!viewModel.isVisible());
    expect(trace).toBe("->onHide");
    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.popupDirection).toBe("left");
    expect(viewModel.pointerTarget.left).toBe("0px");
    expect(viewModel.pointerTarget.top).toBe("0px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel PopupDropdownViewModel clickOutside", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.popupDirection).toBe("left");
    expect(viewModel.pointerTarget).toEqual({ left: "0px", top: "0px" });

    let trace: string = "";
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    viewModel.clickOutside();
    expect(trace).toBe("");
    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.popupDirection).toBe("left");
    expect(viewModel.pointerTarget).toEqual({ left: "0px", top: "0px" });
    trace = "";

    model.toggleVisibility();
    trace = "";
    viewModel.clickOutside();
    expect(trace).toBe("->onHide");
    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.popupDirection).toBe("left");
    expect(viewModel.pointerTarget.left).toBe("0px");
    expect(viewModel.pointerTarget.top).toBe("0px");
    trace = "";

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupDropdownViewModel pointerTarget", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { horizontalPosition: "center", verticalPosition: "bottom" });
    const areaElement: HTMLElement = document.createElement("div");
    model.getAreaCallback = (container) => {
      areaElement.getBoundingClientRect = () => { return <DOMRect>{ bottom: 963, height: 871, left: 9, right: 773, top: 92, width: 764, x: 9, y: 92 }; };
      return areaElement;
    };
    const targetElement: HTMLElement = document.createElement("div");
    targetElement.getBoundingClientRect = () => { return <DOMRect>{ bottom: 292, height: 40, left: 220, right: 310, top: 252, width: 90, x: 220, y: 252 }; };
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "268px";
    popupContainer.style.height = "225px";
    stubElementLayout(popupContainer, { width: 268, height: 225 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 268, height: 225 });

    let fixedPopupContainer = viewModel.container.querySelector(".sv-popup") as HTMLElement;
    fixedPopupContainer.getBoundingClientRect = () => { return <DOMRect>{ bottom: 953, height: 953, left: 0, right: 795, top: 0, width: 795, x: 0, y: 0 }; };

    model.toggleVisibility();
    viewModel.updatePosition(true, false);

    expect(viewModel.popupDirection).toBe("bottom");
    expect(viewModel.top).toBe("292px");
    expect(viewModel.left).toBe("131px");
    expect(viewModel.pointerTarget).toEqual({ left: "134px", top: "0px" });

    viewModel.dispose();
    targetElement.remove();
    areaElement.remove();
  });

  test("PopupModel PopupModalViewModel clickOutside", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    model.isModal = true;
    const viewModel: PopupModalViewModel = createPopupViewModelTest(model, targetElement) as PopupModalViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.isVisible).toBe(false);

    let trace: string = "";
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    model.toggleVisibility();
    trace = "";
    viewModel.clickOutside();
    expect(trace).toBe("");
    expect(viewModel.isVisible).toBe(true);
    trace = "";

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel cancel", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupBaseViewModel = createPopupViewModelTest(
      model,
      targetElement
    );
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.isVisible).toBe(false);

    let trace: string = "";
    model.onCancel = () => {
      trace += "->onCancel";
    };
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    viewModel.cancel();
    expect(trace).toBe("->onCancel");
    expect(viewModel.isVisible).toBe(false);
    trace = "";

    model.toggleVisibility();
    trace = "";
    viewModel.cancel();
    expect(trace).toBe("->onCancel->onHide");
    expect(viewModel.isVisible).toBe(false);
    trace = "";

    model.isModal = true;
    model.toggleVisibility();
    trace = "";
    viewModel.cancel();
    expect(trace).toBe("->onCancel->onHide");
    expect(viewModel.isVisible).toBe(false);
    trace = "";

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel apply", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    model.isModal = true;
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupModalViewModel = createPopupViewModelTest(model, targetElement) as PopupModalViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.isVisible).toBe(false);

    let trace: string = "";
    model.onApply = () => {
      trace += "->onApply";
      return true;
    };
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    viewModel.apply();
    expect(trace).toBe("->onApply");
    expect(viewModel.isVisible).toBe(false);
    trace = "";

    model.toggleVisibility();
    trace = "";
    viewModel.apply();
    expect(trace).toBe("->onApply->onHide");
    expect(viewModel.isVisible).toBe(false);
    trace = "";

    model.isModal = true;
    model.toggleVisibility();
    trace = "";
    viewModel.apply();
    expect(trace).toBe("->onApply->onHide");
    expect(viewModel.isVisible).toBe(false);
    trace = "";

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel apply when not allow", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    model.isModal = true;
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupModalViewModel = createPopupViewModelTest(model, targetElement) as PopupModalViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.isVisible).toBe(false);

    let canApply = false;
    model.onApply = (): boolean => {
      return canApply;
    };

    model.toggleVisibility();
    expect(viewModel.isVisible).toBe(true);
    viewModel.apply();
    expect(viewModel.isVisible).toBe(true);
    canApply = true;
    viewModel.apply();
    expect(viewModel.isVisible).toBe(false);

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupViewModel dispose", () => {
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data);

    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupBaseViewModel = createPopupViewModelTest(
      model,
      targetElement
    );
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    const container: HTMLElement = viewModel.container;

    viewModel.dispose();

    let trace: string = "";
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    model.isVisible = true;
    expect(trace).toBe("");
    expect(!!viewModel.container).toBe(false);
    expect(container.tagName).toBe("DIV");
    expect(container.innerHTML.indexOf('<div class="sv-popup"')).not.toBe(0);

    targetElement.remove();
  });

  test("PopupViewModel initialize/dispose", () => {
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data);

    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupBaseViewModel = createPopupViewModelTest(
      model,
      targetElement
    );

    expect(!!viewModel.container).toBe(false);
    viewModel.initializePopupContainer();
    expect(!!viewModel.container).toBe(true);

    viewModel.dispose();
    expect(!!viewModel.container).toBe(false);

    targetElement.remove();
  });

  test("Check calculatePosition method", () => {
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "left"), "top left").toEqual({ left: 0, top: 60 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "center"), "top center").toEqual({ left: 35, top: 10 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "right"), "top right").toEqual({ left: 70, top: 60 });

    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "middle", "left"), "middle left").toEqual({ left: 0, top: 40 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "middle", "center"), "middle center").toEqual({ left: 35, top: 40 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "middle", "right"), "middle right").toEqual({ left: 70, top: 40 });

    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "bottom", "left"), "bottom left").toEqual({ left: 0, top: 20 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "bottom", "center"), "bottom center").toEqual({ left: 35, top: 70 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "bottom", "right"), "bottom right").toEqual({ left: 70, top: 20 });

    //cases with pointer
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "left"/*, true*/)).toEqual({ left: 0, top: 60 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "right"/*, true*/)).toEqual({ left: 70, top: 60 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "bottom", "left"/*, true*/)).toEqual({ left: 0, top: 20 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "bottom", "right"/*, true*/)).toEqual({ left: 70, top: 20 });
  });

  test("Check calculatateDirection method", () => {
    expect(PopupUtils.calculatePopupDirection("top", "left")).toEqual("left");

    expect(PopupUtils.calculatePopupDirection("top", "center")).toEqual("top");

    expect(PopupUtils.calculatePopupDirection("top", "right")).toEqual("right");
    expect(PopupUtils.calculatePopupDirection("middle", "left")).toEqual("left");
    expect(PopupUtils.calculatePopupDirection("middle", "center")).toEqual(undefined);
    expect(PopupUtils.calculatePopupDirection("middle", "right")).toEqual("right");
    expect(PopupUtils.calculatePopupDirection("bottom", "left")).toEqual("left");
    expect(PopupUtils.calculatePopupDirection("bottom", "center")).toEqual("bottom");
    expect(PopupUtils.calculatePopupDirection("bottom", "right")).toEqual("right");
  });

  test("Check calculatePointer target method", () => {
    expect(PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "left")).toEqual({ left: 10, top: 35 });

    expect(PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "center")).toEqual({ left: 35, top: 10 });

    expect(PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "right")).toEqual({ left: 60, top: 35 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "middle",
      "left"
    )).toEqual({ left: 10, top: 35 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      20,
      "middle",
      "center"
    )).toEqual({ left: NaN, top: NaN });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "middle",
      "right"
    )).toEqual({ left: 60, top: 35 });

    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "left"
    )).toEqual({ left: 10, top: 35 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "left",
      10,
      15
    ), "pointer target takes into account margin").toEqual({ left: -15, top: 35 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "center"
    )).toEqual({ left: 35, top: 60 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "center",
      10,
      15
    ), "pointer target takes into account margin").toEqual({ left: 25, top: 60 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "right"
    )).toEqual({ left: 60, top: 35 });
  });

  test("Check calculatePosition with window size method", () => {
    let targetRect: any = {
      left: 50,
      top: 250,
      width: 50,
      height: 20,
      right: 100,
      bottom: 270,
    };
    let windowHeight = 300;
    let verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      100,
      "center",
      "bottom",
      windowHeight
    );
    expect(verticalPosition, "vertical position is changed to top cause doesn't fit in bottom").toEqual("top");
    targetRect.top = 50;
    targetRect.bottom = 70;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      100,
      "center",
      "top",
      windowHeight
    );
    expect(verticalPosition, "vertical position is changed to bottom cause doesn't fit in top").toEqual("bottom");
    targetRect.top = 200;
    targetRect.bottom = 220;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      300,
      "center",
      "top",
      windowHeight
    );
    expect(verticalPosition, "both directions do not fit: result top").toEqual("top");
    targetRect.top = 100;
    targetRect.bottom = 120;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      300,
      "center",
      "top",
      windowHeight
    );
    expect(verticalPosition, "both directions do not fit: result bottom").toEqual("bottom");
    targetRect.top = 50;
    targetRect.bottom = 70;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      60,
      "left",
      "top",
      windowHeight
    );
    expect(verticalPosition, "with pointer: top vertical position is not changed").toEqual("top");
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      100,
      "left",
      "top",
      windowHeight
    );
    expect(verticalPosition, "with pointer: top vertical position is changed to bottom").toEqual("bottom");

    targetRect.top = 250;
    targetRect.bottom = 270;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      40,
      "left",
      "bottom",
      windowHeight
    );
    expect(verticalPosition, "with pointer: bottom vertical position is not changed").toEqual("bottom");
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      100,
      "left",
      "bottom",
      windowHeight
    );
    expect(verticalPosition, "with pointer: bottom vertical position is changed to top").toEqual("top");
    targetRect.top = 200;
    targetRect.bottom = 220;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      300,
      "left",
      "top",
      windowHeight
    );
    expect(verticalPosition, "with pointer: both directions do not fit: result top").toEqual("top");
    targetRect.top = 100;
    targetRect.bottom = 120;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      300,
      "left",
      "top",
      windowHeight
    );
    expect(verticalPosition, "with pointer: both directions do not fit: result bottom").toEqual("bottom");
  });

  test("Check calculatePosition with window size method", () => {
    let targetRect: any = {
      top: 50,
      left: 250,
      height: 50,
      width: 20,
      bottom: 100,
      right: 270,
    };
    let windowWidth = 300;
    let horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 100, "right", windowWidth);
    expect(horizontalPosition, "horizontal position is changed to top cause doesn't fit in right").toEqual("left");

    horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 25, "right", windowWidth);
    expect(horizontalPosition, "right horizontal position is not changed").toEqual("right");

    targetRect.left = 50;
    targetRect.right = 70;
    horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 100, "left", windowWidth);
    expect(horizontalPosition, "horizontal position is changed to bottom cause doesn't fit in left").toEqual("right");

    horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 40, "left", windowWidth);
    expect(horizontalPosition, "left horizontal position is not changed").toEqual("left");

    targetRect.left = 200;
    targetRect.right = 220;
    horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 300, "left", windowWidth);
    expect(horizontalPosition, "both directions do not fit: result left").toEqual("left");

    targetRect.left = 100;
    targetRect.right = 120;
    horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 300, "left", windowWidth);
    expect(horizontalPosition, "both directions do not fit: result right").toEqual("right");
  });

  test("Check getCorrectedVerticalDimensions if both directions do not fit", () => {
    let newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(-20, 200, 300, "bottom");
    expect(newVerticalDimensions.height).toBe(180);
    expect(newVerticalDimensions.top).toBe(-0);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(150, 200, 300, "bottom");
    expect(newVerticalDimensions.height).toBe(150 - PopupUtils.bottomIndent);
    expect(newVerticalDimensions.top).toBe(150);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(150, 450, 300, "bottom");
    expect(newVerticalDimensions.height).toBe(150 - PopupUtils.bottomIndent);
    expect(newVerticalDimensions.top).toBe(150);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(10, 200, 300, "bottom");
    expect(newVerticalDimensions).toBeFalsy();

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(10, 200, 300, "top");
    expect(newVerticalDimensions.height).toBe(200);
    expect(newVerticalDimensions.top).toBe(10);
  });

  test("Check getCorrectedVerticalDimensions if both directions do not fit and canShrink = false", () => {
    let newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(-20, 200, 300, "bottom", false);
    expect(newVerticalDimensions.height).toBe(200);
    expect(newVerticalDimensions.top).toBe(-0);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(150, 200, 300, "bottom", false);
    expect(newVerticalDimensions.height).toBe(200);
    expect(newVerticalDimensions.top).toBe(100 - PopupUtils.bottomIndent);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(150, 450, 300, "bottom", false);
    expect(newVerticalDimensions.height).toBe(300 - PopupUtils.bottomIndent);
    expect(newVerticalDimensions.top).toBe(-0);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(10, 200, 300, "bottom", false);
    expect(newVerticalDimensions).toBeFalsy();

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(10, 200, 300, "top", false);
    expect(newVerticalDimensions.height).toBe(200);
    expect(newVerticalDimensions.top).toBe(10);
  });

  test("Check updateHorizontalDimensions", () => {
    let newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-20, 200, 300, "center");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center - fitting left out - width").toBe(200);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center - fitting left out - left").toBe(0);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-100, 300, 250, "center");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center - not-fitting left out - width").toBe(250);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center - not-fitting left out - left").toBe(0);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 200, 250, "center");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center - fitting right out - width").toBe(200);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center - fitting right out - left").toBe(50);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center - non-fitting right out - width").toBe(250);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center - non-fitting right out - left").toBe(0);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-20, 200, 300, "left");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - left - left out - width").toBe(200);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - left - left out - left").toBe(0);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 250, 300, "right");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - right - right out - width").toBe(200);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - right - right out - left").toBe(100);
  });
  test("Check updateHorizontalDimensions with margins positionMode is flex", () => {
    let newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center", "flex", { left: 10, right: 15 });
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center+flex - non-fitting right out - width").toBe(225);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center+flex - non-fitting right out - left").toBe(10);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-20, 200, 300, "left", "flex", { left: 10, right: 15 });
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - left+flex - left out - width").toBe(200);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - left+flex - left out - left").toBe(10);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 250, 300, "right", "flex", { left: 10, right: 15 });
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - right+flex - right out - width").toBe(175);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - right+flex - right out - left").toBe(100);
  });

  test("Check updateHorizontalDimensions positionMode is fixed", () => {
    let newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center", "fixed", { left: 10, right: 15 });
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center+fixed - non-fitting right out - width").toBe(125);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center+fixed - non-fitting right out - left").toBe(90);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center", "fixed");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center+fixed - without margin").toBe(150);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center+fixed - without margin").toBe(100);
  });

  test("PopupModel dropdown displayMode", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.showFooter).toBe(false);
    expect(viewModel.styleClass).toBe("sv-popup--menu-popup sv-popup--show-pointer sv-popup--left");
    model.displayMode = "overlay";
    expect(viewModel.styleClass).toBe("sv-popup--menu-popup");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel displayMode overlay and overlayDisplayMode", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.showFooter).toBe(false);
    expect(model.overlayDisplayMode).toBe("auto");

    expect(viewModel.styleClass, "default").toBe("sv-popup--menu-popup sv-popup--show-pointer sv-popup--left");
    model.displayMode = "overlay";
    expect(viewModel.styleClass, "overlayDisplayMode auto").toBe("sv-popup--menu-popup");

    model.overlayDisplayMode = "dropdown-overlay";
    expect(viewModel.styleClass, "overlayDisplayMode dropdown-overlay").toBe("sv-popup--menu-phone");

    model.overlayDisplayMode = "tablet-dropdown-overlay";
    expect(viewModel.styleClass, "overlayDisplayMode tablet-dropdown-overlay").toBe("sv-popup--menu-tablet");

    model.overlayDisplayMode = "plain";
    expect(viewModel.styleClass, "overlayDisplayMode plain").toBe("sv-popup--menu-popup");

    model.overlayDisplayMode = "auto";
    expect(viewModel.styleClass, "overlayDisplayMode auto").toBe("sv-popup--menu-popup");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel isModal displayMode", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    model.isModal = true;
    const viewModel: PopupModalViewModel = createPopupViewModelTest(model, targetElement) as PopupModalViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.styleClass).toBe("sv-popup--modal-popup");
    model.displayMode = "overlay";
    expect(viewModel.styleClass).toBe("sv-popup--modal-overlay");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel and locale", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupModalViewModel = createPopupViewModelTest(model, targetElement) as PopupModalViewModel;
    viewModel.initializePopupContainer();
    expect(viewModel.getLocalizationString("modalApplyButtonText"), "en Apply text").toBe(englishStrings.modalApplyButtonText);
    viewModel.locale = "de";
    expect(viewModel.getLocalizationString("modalApplyButtonText"), "de Apply text").toBe(germanSurveyStrings.modalApplyButtonText);
    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel top+center position calculate", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "top", horizontalPosition: "center", showPointer: true });
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "1000px";
    targetElement.style.left = "1000px";
    targetElement.style.width = "32px";
    targetElement.style.height = "24px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = viewModel.container.querySelector(".sv-popup__container") as HTMLElement;
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";
    popupContainer.style.margin = "8px";
    stubElementLayout(popupContainer, { width: 200, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 200, height: 400 });

    (<any>window).innerHeight = 2000;
    (<any>window).innerWidth = 2000;
    viewModel.updateOnShowing();
    expect(viewModel.left).toBe((1000 - 200 / 2 - 8 + 32 / 2) + "px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel top+left position calculate", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "top", horizontalPosition: "left", showPointer: true });
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "1000px";
    targetElement.style.left = "1000px";
    targetElement.style.width = "32px";
    targetElement.style.height = "24px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";
    popupContainer.style.margin = "8px";
    stubElementLayout(popupContainer, { width: 200, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 200, height: 400 });

    (<any>window).innerHeight = 2000;
    (<any>window).innerWidth = 2000;
    viewModel.updateOnShowing();
    expect(viewModel.pointerTarget.left).toBe("200px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("Fixed PopupModel width calculate setWidthByTarget = false", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "bottom", horizontalPosition: "center", showPointer: true });
    model.positionMode = "fixed";
    model.setWidthByTarget = false;
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "130px";
    targetElement.style.left = "200px";
    targetElement.style.width = "560px";
    targetElement.style.height = "48px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "700px";
    popupContainer.style.height = "400px";
    stubElementLayout(popupContainer, { width: 700, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 700, height: 400 });

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toBe("auto");
    expect(viewModel.width, "width").toBe("auto");
    expect(viewModel.left, "left").toBe("200px");
    expect(viewModel.top, "top").toBe("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("Fixed PopupModel width calculate if short content setWidthByTarget = false", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "bottom", horizontalPosition: "center", showPointer: true });
    model.positionMode = "fixed";
    model.setWidthByTarget = false;
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "130px";
    targetElement.style.left = "200px";
    targetElement.style.width = "560px";
    targetElement.style.height = "48px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";
    stubElementLayout(popupContainer, { width: 200, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 200, height: 400 });

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toBe("auto");
    expect(viewModel.width, "width").toBe("auto");
    expect(viewModel.left, "left").toBe("200px");
    expect(viewModel.top, "top").toBe("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("Fixed PopupModel width calculate and overflow content position calculate setWidthByTarget = false", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "bottom", horizontalPosition: "center", showPointer: true });
    model.positionMode = "fixed";
    model.setWidthByTarget = false;
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "130px";
    targetElement.style.left = "200px";
    targetElement.style.width = "560px";
    targetElement.style.height = "48px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "1500px";
    popupContainer.style.height = "400px";
    stubElementLayout(popupContainer, { width: 1500, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 1500, height: 400 });

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toBe("auto");
    expect(viewModel.width, "width").toBe("800px");
    expect(viewModel.left, "left").toBe("200px");
    expect(viewModel.top, "top").toBe("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("Fixed PopupModel width calculate", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "bottom", horizontalPosition: "center", showPointer: true });
    model.positionMode = "fixed";
    model.setWidthByTarget = true;
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "130px";
    targetElement.style.left = "200px";
    targetElement.style.width = "560px";
    targetElement.style.height = "48px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "700px";
    popupContainer.style.height = "400px";
    stubElementLayout(popupContainer, { width: 700, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 700, height: 400 });

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toBe("560px");
    expect(viewModel.width, "width").toBe("560px");
    expect(viewModel.left, "left").toBe("200px");
    expect(viewModel.top, "top").toBe("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("Fixed PopupModel width calculate if short content", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "bottom", horizontalPosition: "center", showPointer: true });
    model.positionMode = "fixed";
    model.setWidthByTarget = true;
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "130px";
    targetElement.style.left = "200px";
    targetElement.style.width = "560px";
    targetElement.style.height = "48px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";
    stubElementLayout(popupContainer, { width: 200, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 200, height: 400 });

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toBe("560px");
    expect(viewModel.width, "width").toBe("560px");
    expect(viewModel.left, "left").toBe("200px");
    expect(viewModel.top, "top").toBe("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("Fixed PopupModel width calculate and overflow content position calculate", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "bottom", horizontalPosition: "center", showPointer: true });
    model.positionMode = "fixed";
    model.setWidthByTarget = true;
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "130px";
    targetElement.style.left = "200px";
    targetElement.style.width = "560px";
    targetElement.style.height = "48px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "1500px";
    popupContainer.style.height = "400px";
    stubElementLayout(popupContainer, { width: 1500, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 1500, height: 400 });

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toBe("560px");
    expect(viewModel.width, "width").toBe("560px");
    expect(viewModel.left, "left").toBe("200px");
    expect(viewModel.top, "top").toBe("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupViewModel updateOnHiding", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "bottom", horizontalPosition: "center", showPointer: true });
    model.positionMode = "fixed";
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "130px";
    targetElement.style.left = "200px";
    targetElement.style.width = "560px";
    targetElement.style.height = "48px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = viewModel.container.querySelector(".sv-popup__container") as HTMLElement;
    popupContainer.style.width = "550px";
    popupContainer.style.height = "400px";
    stubElementLayout(popupContainer, { width: 550, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 550, height: 400 });

    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.height).toBe("auto");
    expect(viewModel.width).toBe("auto");

    let trace: string = "";
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    model.toggleVisibility();
    (<any>window).innerWidth = 600;
    (<any>window).innerHeight = 400;
    viewModel.updateOnShowing();

    expect(trace).toBe("->onShow");
    expect(viewModel.isVisible).toBe(true);
    expect(viewModel.top, "onShow top").not.toBe("0px");
    expect(viewModel.left, "onShow left").not.toBe("0px");
    expect(viewModel.height, "onShow height").not.toBe("auto");
    expect(viewModel.width, "onShow width").not.toBe("auto");
    trace = "";

    model.toggleVisibility();
    expect(trace).toBe("->onHide");
    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top, "onHide top").toBe("0px");
    expect(viewModel.left, "onHide left").toBe("0px");
    expect(viewModel.height, "onHide height").toBe("auto");
    expect(viewModel.width, "onHide width").toBe("auto");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupViewModel updateOnHiding displayMode = overlay", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "bottom", horizontalPosition: "center", showPointer: true });
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "130px";
    targetElement.style.left = "200px";
    targetElement.style.width = "560px";
    targetElement.style.height = "48px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "550px";
    popupContainer.style.height = "400px";

    model.displayMode = "overlay";
    expect(viewModel.styleClass).toBe("sv-popup--menu-popup");

    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top).toBe("0px");
    expect(viewModel.left).toBe("0px");
    expect(viewModel.height).toBe("auto");
    expect(viewModel.width).toBe("auto");

    let trace: string = "";
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    model.toggleVisibility();
    (<any>window).innerWidth = 600;
    (<any>window).innerHeight = 400;
    viewModel.updateOnShowing();

    expect(trace).toBe("->onShow");
    expect(viewModel.isVisible).toBe(true);
    expect(viewModel.top, "onShow top").toBe("");
    expect(viewModel.left, "onShow left").toBe("");
    expect(viewModel.height, "onShow height").toBe("");
    expect(viewModel.width, "onShow width").toBe("");
    trace = "";

    model.toggleVisibility();
    expect(trace).toBe("->onHide");
    expect(viewModel.isVisible).toBe(false);
    expect(viewModel.top, "onHide top").toBe("0px");
    expect(viewModel.left, "onHide left").toBe("0px");
    expect(viewModel.height, "onHide height").toBe("auto");
    expect(viewModel.width, "onHide width").toBe("auto");

    viewModel.dispose();
    targetElement.remove();
  });

  test("Check that modal popup prevents scroll outside", () => {
    let eventLog = "";
    let subscribeLog = "";
    const wrapEvent = (event) => {
      event.preventDefault = () => {
        eventLog += "->prevented";
      };
    };
    const wrapContainer = (element) => {
      const oldAddEventListener = element.addEventListener;
      element.addEventListener = function (name, callback) {
        oldAddEventListener.call(element, name, callback);
        subscribeLog += "->subscribed";
      };
      const oldRemoveEventListener = element.removeEventListener;
      element.removeEventListener = function (name, callback) {
        oldRemoveEventListener.call(element, name, callback);
        subscribeLog += "->unsubscribed";
      };
    };

    const model: PopupModel = new PopupModel("sv-list", {});
    model.isModal = true;
    const viewModel: PopupModalViewModel = createPopupViewModel(model) as PopupModalViewModel;

    const container = document.createElement("div");
    container.innerHTML = `<div style="height: 200px; overflow: auto;">
    <div style="height: 400px;"></div>
  </div>`;
    wrapContainer(container);
    addElementIntoBody(container);
    // jsdom does not perform layout: stub offsetHeight/scrollHeight on the
    // overflow:auto wrapper, and provide a settable scrollTop, so the
    // production preventScrollOuside() can detect inner scrollability.
    const scrollWrapper = container.children[0] as HTMLElement;
    // jsdom does not expand the `overflow` shorthand into overflowY in
    // getComputedStyle; set it explicitly so the production preventScrollOuside()
    // recognizes the wrapper as scrollable.
    scrollWrapper.style.overflowY = "auto";
    Object.defineProperty(scrollWrapper, "offsetHeight", { configurable: true, value: 200 });
    Object.defineProperty(scrollWrapper, "clientHeight", { configurable: true, value: 200 });
    Object.defineProperty(scrollWrapper, "scrollHeight", { configurable: true, value: 400 });
    let __scrollTop = 0;
    Object.defineProperty(scrollWrapper, "scrollTop", { configurable: true, get: () => __scrollTop, set: (v: number) => { __scrollTop = v; } });
    scrollWrapper.scrollTo = ((x: number, y: number) => { __scrollTop = y; }) as any;
    viewModel.setComponentElement(container);
    model.isVisible = true;
    viewModel.updateOnShowing();
    expect(subscribeLog).toBe("->subscribed");

    let event = new WheelEvent("wheel", { deltaY: 20, cancelable: true });
    wrapEvent(event);
    container.dispatchEvent(event);
    expect(eventLog, "prevented scroll when not scrolling inside").toBe("->prevented");

    eventLog = "";
    event = new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true });
    wrapEvent(event);
    container.children[0].children[0].dispatchEvent(event);
    expect(eventLog, "scroll inside (not prevented)").toBe("");

    eventLog = "";
    event = new WheelEvent("wheel", { deltaY: -20, bubbles: true, cancelable: true });
    wrapEvent(event);
    container.children[0].scrollTo(0, 20);
    container.children[0].children[0].dispatchEvent(event);
    expect(eventLog, "scroll inside (not prevented)").toBe("");

    eventLog = "";
    event = new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true });
    wrapEvent(event);
    container.children[0].scrollTo(0, 150);
    container.children[0].children[0].dispatchEvent(event);
    expect(eventLog, "scroll inside (not prevented)").toBe("");

    eventLog = "";
    event = new WheelEvent("wheel", { deltaY: -20, bubbles: true, cancelable: true });
    wrapEvent(event);
    container.children[0].scrollTo(0, 0);
    container.children[0].children[0].dispatchEvent(event);
    expect(eventLog, "overscroll inside (prevented)").toBe("->prevented");

    eventLog = "";
    event = new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true });
    wrapEvent(event);
    container.children[0].scrollTo(0, 200);
    container.children[0].children[0].dispatchEvent(event);
    expect(eventLog, "overscroll inside (prevented)").toBe("->prevented");

    model.toggleVisibility();
    expect(subscribeLog).toBe("->subscribed->unsubscribed");

    container.remove();
  });
  test("PopupModel into modal window with translate/transform", () => {
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "top", horizontalPosition: "center" });
    const targetElement: HTMLElement = document.createElement("button");

    targetElement.style.position = "absolute";
    targetElement.style.top = "350px";
    targetElement.style.left = "250px";
    targetElement.style.width = "32px";
    targetElement.style.height = "24px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;
    stubFromInlineStyle(targetElement);

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    let popupContainer = viewModel.container.querySelector(".sv-popup__container") as HTMLElement;
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";
    stubElementLayout(popupContainer, { width: 200, height: 400 });
    const scrollContent = popupContainer.querySelector(".sv-popup__scrolling-content") as HTMLElement;
    if (scrollContent) stubElementLayout(scrollContent, { width: 200, height: 400 });

    let fixedPopupContainer = viewModel.container.querySelector(".sv-popup") as HTMLElement;
    fixedPopupContainer.getBoundingClientRect = () => {
      return <DOMRect>{ "x": 100, "y": 200, "width": 1920, "height": 0, "top": 200, "right": 2097, "bottom": 200, "left": 100 };
    };

    (<any>window).innerHeight = 2000;
    (<any>window).innerWidth = 2000;
    viewModel.updateOnShowing();
    expect(viewModel.top, "top").toBe(174 + "px");
    expect(viewModel.left, "left").toBe(66 + "px");

    viewModel.dispose();
    targetElement.remove();
  });

  class TestAnimation extends AnimationUtils {
    public logger: { log: string };
    public passedEnterClass: string;
    public passedLeaveClass: string;
    public onEnter(options: PopupBaseViewModel): void {
      this.logger.log += "->onEnter";
      this.passedEnterClass = options.getEnterOptions().cssClass;
    }
    public onLeave(options: PopupBaseViewModel, callback: () => void): void {
      this.logger.log += "->onLeave";
      this.passedLeaveClass = options.getLeaveOptions().cssClass;
      callback();
    }
  }

  class TestAnimationPopupViewModel extends PopupBaseViewModel {
    constructor(model: PopupModel) {
      super(model);
      this["visibilityAnimation"]["animation"] = new TestAnimation();
    }
    public set logger(logger: { log: string }) {
      (this["visibilityAnimation"]["animation"] as any).logger = logger;
    }
    public getAnimation() {
      return this["visibilityAnimation"]["animation"] as TestAnimation;
    }
  }

  test("PopupViewModel: check animation's onEnter, onLeave are called correctly", () => {
    const logger = { log: "" };
    settings.animationEnabled = true;
    const oldQueueMicrotask = window.queueMicrotask;
    window.queueMicrotask = (cb) => cb();
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "top", horizontalPosition: "center" });
    model.onVisibilityChanged.add((_: PopupModel, options: { isVisible: boolean }) => {
      logger.log += `->model:isVisible:${options.isVisible}`;
    });
    const viewModel: TestAnimationPopupViewModel = new TestAnimationPopupViewModel(model);
    viewModel.setComponentElement(document.createElement("div"));
    viewModel.logger = logger;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    viewModel.onVisibilityChanged.add((_: PopupBaseViewModel, options: { isVisible: boolean }) => {
      logger.log += `->viewModel:isVisible:${options.isVisible}`;
    });
    viewModel.enableOnElementRerenderedEvent();
    model.isVisible = true;
    viewModel.afterRerender();
    expect(logger.log, "correct order of updates when entering").toBe("->model:isVisible:true->viewModel:isVisible:true->onEnter");
    expect(viewModel.getAnimation().passedEnterClass, "correct css classes passed to animation's onEnter").toEqual("sv-popup--enter");
    logger.log = "";
    model.isVisible = false;
    expect(logger.log, "correct order of updates when leaving").toBe("->model:isVisible:false->onLeave->viewModel:isVisible:false");
    expect(viewModel.getAnimation().passedLeaveClass, "correct css classes passed to animation's onLeave").toEqual("sv-popup--leave");
    settings.animationEnabled = false;
    window.queueMicrotask = oldQueueMicrotask;
  });

  test("PopupViewModel: check popupViewModel without container is working correctly", () => {
    const logger = { log: "" };
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "top", horizontalPosition: "center" });
    model.onVisibilityChanged.add((_: PopupModel, options: { isVisible: boolean }) => {
      logger.log += `->model:isVisible:${options.isVisible}`;
    });
    const viewModel: PopupDropdownViewModel = new PopupDropdownViewModel(model);
    viewModel.initializePopupContainer();
    viewModel.onVisibilityChanged.add((_: PopupBaseViewModel, options: { isVisible: boolean }) => {
      logger.log += `->viewModel:isVisible:${options.isVisible}`;
    });
    model.isVisible = true;
    expect(logger.log, "correct order of updates when entering without animation").toBe("->model:isVisible:true->viewModel:isVisible:true");
    logger.log = "";
    model.isVisible = false;
    expect(logger.log, "correct order of updates when leaving without animation").toBe("->model:isVisible:false->viewModel:isVisible:false");
  });

  test("PopupViewModel: check popupViewModel is working correctly when shouldRunAnimation is false", () => {
    const logger = { log: "" };
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "top", horizontalPosition: "center" });
    model.onVisibilityChanged.add((_: PopupModel, options: { isVisible: boolean }) => {
      logger.log += `->model:isVisible:${options.isVisible}`;
    });
    const viewModel: TestAnimationPopupViewModel = new TestAnimationPopupViewModel(model);
    viewModel.setComponentElement(document.createElement("div"));
    viewModel.logger = logger;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    viewModel.onVisibilityChanged.add((_: PopupBaseViewModel, options: { isVisible: boolean }) => {
      logger.log += `->viewModel:isVisible:${options.isVisible}`;
    });
    model.isVisible = true;
    expect(logger.log, "correct order of updates when entering without animation").toBe("->model:isVisible:true->viewModel:isVisible:true");
    logger.log = "";
    model.isVisible = false;
    expect(logger.log, "correct order of updates when leaving without animation").toBe("->model:isVisible:false->viewModel:isVisible:false");
  });

  test("PopupViewModel: check getShouldRunAnimation method", () => {
    settings.animationEnabled = true;
    const model: PopupModel = new PopupModel("sv-list", {}, { verticalPosition: "top", horizontalPosition: "center" });
    const viewModel: TestAnimationPopupViewModel = new TestAnimationPopupViewModel(model);
    expect(viewModel.isAnimationEnabled()).toBeTruthy();
    model.displayMode = "overlay";
    expect(viewModel.isAnimationEnabled()).toBeFalsy();
    settings.animationEnabled = false;
  });

  test("Check the sequence of method calls", () => {
    vi.useFakeTimers();
    settings.animationEnabled = true;
    const animationTimeOut = 1;
    const oldQueueMicrotask = window.queueMicrotask;
    window.queueMicrotask = (callback) => { setTimeout(() => callback(), animationTimeOut); };

    const originalRefresh = ListModel.prototype["refresh"];
    try {
      let log = "";
      const items: Array<Action> = [new Action({ id: "test", action: () => { } })];
      const listModel = new ListModel(items, () => { model.isVisible = false; }, true);

      ListModel.prototype["refresh"] = function () {
        log += "listModel.refresh->";
        originalRefresh.call(this);
      };

      const popupOptions = {
        onShow: () => { log += "onShow:(viewModel.isVisible == " + viewModel.isVisible.toString() + ")->"; },
        onHide: () => { log += "onHide:(viewModel.isVisible == " + viewModel.isVisible.toString() + ")"; },
        onCancel: () => { log += "onCancel->"; },
        onDispose: () => { log += "onDispose"; }
      };
      const model: PopupModel = new PopupModel("sv-list", { model: listModel }, popupOptions);
      const viewModel: TestAnimationPopupViewModel = new TestAnimationPopupViewModel(model);
      viewModel.logger = { log: "" };
      viewModel.onVisibilityChanged.add((_: PopupBaseViewModel, options: { isVisible: boolean }) => {
        log += "onVisibilityChanged:(viewModel.isVisible == " + options.isVisible + ")->";
      });
      expect(log).toBe("");

      model.isVisible = true;
      vi.advanceTimersByTime(animationTimeOut + 1);
      expect(log, "popup show").toBe("onShow:(viewModel.isVisible == false)->onVisibilityChanged:(viewModel.isVisible == true)->");

      log = "";
      model.isVisible = false;
      vi.advanceTimersByTime(animationTimeOut + 1);
      expect(log, "popup hide").toBe("onVisibilityChanged:(viewModel.isVisible == false)->listModel.refresh->onHide:(viewModel.isVisible == false)");

      model.isVisible = true;
      vi.advanceTimersByTime(animationTimeOut + 1);
      log = "";
      listModel.onItemClick(items[0]);
      vi.advanceTimersByTime(animationTimeOut + 1);
      expect(log, "item click").toBe("onVisibilityChanged:(viewModel.isVisible == false)->listModel.refresh->onHide:(viewModel.isVisible == false)");

      model.isVisible = true;
      vi.advanceTimersByTime(animationTimeOut + 1);
      log = "";
      viewModel.cancel();
      vi.advanceTimersByTime(animationTimeOut + 1);
      expect(log, "click cancel").toBe("onCancel->onVisibilityChanged:(viewModel.isVisible == false)->listModel.refresh->onHide:(viewModel.isVisible == false)");

      log = "";
      model.dispose();
      expect(log).toBe("onDispose");
    } finally {
      ListModel.prototype["refresh"] = originalRefresh;
      settings.animationEnabled = false;
      window.queueMicrotask = oldQueueMicrotask;
      vi.useRealTimers();
    }
  });
});
