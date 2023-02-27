import { PopupUtils } from "../../src/utils/popup";
import { PopupModel } from "../../src/popup";
import { PopupBaseViewModel } from "../../src/popup-view-model";
import { createPopupViewModel } from "../../src/popup-utils";
import { surveyLocalization } from "../../src/surveyStrings";
import { PopupDropdownViewModel } from "../../src/popup-dropdown-view-model";
import { PopupModalViewModel } from "../../src/popup-modal-view-model";
import { englishStrings } from "../../src/localization/english";
import { germanSurveyStrings } from "../../src/localization/german";
import { ISurveyEnvironment } from "../../src/base-interfaces";

const popupTemplate = require("html-loader?interpolate!val-loader!../../src/knockout/components/popup/popup.html");

export default QUnit.module("Popup");

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

QUnit.test("PopupModel defaults", (assert) => {
  const data = {};
  const model: PopupModel = new PopupModel("sv-list", data);

  assert.equal(model.contentComponentName, "sv-list");
  assert.equal(model.contentComponentData, data);
  assert.equal(model.verticalPosition, "bottom");
  assert.equal(model.horizontalPosition, "left");
  assert.equal(model.showPointer, true);
  assert.equal(model.isModal, false);
  assert.equal(typeof model.onCancel, "function");
  assert.equal(typeof model.onApply, "function");
  assert.equal(typeof model.onHide, "function");
  assert.equal(typeof model.onShow, "function");
  assert.equal(model.cssClass, "");
  assert.ok(model.onVisibilityChanged.isEmpty);
});

QUnit.test("PopupModel toggleVisibility", (assert) => {
  const data = {};
  const model: PopupModel = new PopupModel("sv-list", data);

  let trace = "";

  model.toggleVisibility();
  assert.equal(trace, "");

  model.onVisibilityChanged.add(() => {
    trace += "->onToggleVisibility";
  });

  model.toggleVisibility();
  assert.equal(trace, "->onToggleVisibility");
});

QUnit.test("PopupDropdownViewModel defaults", (assert) => {
  surveyLocalization.currentLocale = "";
  const data = {};
  const model: PopupModel = new PopupModel("sv-list", data);

  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.contentComponentName, "sv-list");
  assert.equal(viewModel.contentComponentData, data);
  assert.equal(viewModel.model.verticalPosition, "bottom");
  assert.equal(viewModel.model.horizontalPosition, "left");
  assert.equal(viewModel.showHeader, true);
  assert.equal(viewModel.isModal, false);
  assert.equal(typeof viewModel.model.onCancel, "function");
  assert.equal(typeof viewModel.model.onApply, "function");
  assert.equal(typeof viewModel.model.onHide, "function");
  assert.equal(typeof viewModel.model.onShow, "function");
  assert.equal(viewModel.model.cssClass, "");

  //assert.equal(ko.isWritableObservable(viewModel.top), true);
  assert.equal(viewModel.top, "0px");
  //assert.equal(ko.isWritableObservable(viewModel.left), true);
  assert.equal(viewModel.left, "0px");
  //assert.equal(ko.isWritableObservable(viewModel.popupDirection), true);
  assert.equal(viewModel.popupDirection, "left");
  //assert.equal(ko.isWritableObservable(viewModel.pointerTarget), true);
  assert.deepEqual(viewModel.pointerTarget, { left: "0px", top: "0px" });
  // assert.equal(ko.isWritableObservable(viewModel.isVisible), true);
  assert.equal(viewModel.isVisible, false);

  const container: HTMLElement = viewModel.container;
  assert.equal(!!container, true);
  assert.equal(container.tagName, "DIV");
  assert.equal(container.innerHTML.indexOf('<div class="sv-popup"'), 0);
  assert.equal(container.parentElement.tagName, "BODY");

  assert.equal(viewModel.footerToolbar.actions.length, 1);
  assert.equal(viewModel.footerToolbar.actions[0].title, viewModel.cancelButtonText);

  viewModel.dispose();
});

const createElementInsideShadowRoot =
  (shadowRoot: ShadowRoot) =>
  <K extends keyof HTMLElementTagNameMap>(tagName: K) => {
    const element = document.createElement(tagName);
    shadowRoot.appendChild(element);
    return element;
  };

QUnit.test("PopupDropdownViewModel custom environment", (assert) => {
  const data = {};
  const model: PopupModel = new PopupModel("sv-list", data);

  const shadowRootWrapper = document.createElement("div");
  const shadowRoot = shadowRootWrapper.attachShadow({ mode: "open" });

  const shadowElement = createElementInsideShadowRoot(shadowRoot)("div");
  shadowElement.setAttribute("id", "shadowElement");

  const environment: ISurveyEnvironment = {
    ...shadowRoot,
    body: shadowElement,
    getElementById: shadowRoot.getElementById.bind(shadowRoot),
    createElement: createElementInsideShadowRoot(shadowRoot),
  };

  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement, environment) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  const container: HTMLElement = viewModel.container;
  assert.equal(!!container, true);
  assert.equal(container.tagName, "DIV");
  assert.equal(container.innerHTML.indexOf('<div class="sv-popup"'), 0);

  assert.equal(container.parentElement?.tagName, "DIV");
  assert.equal(container.parentElement?.id, "shadowElement");

  viewModel.dispose();
});

QUnit.test("PopupModalViewModel defaults", (assert) => {
  surveyLocalization.currentLocale = "";
  const data = {};
  const model: PopupModel = new PopupModel("sv-list", data);
  model.isModal = true;
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupModalViewModel = createPopupViewModel(model, targetElement) as PopupModalViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.contentComponentName, "sv-list");
  assert.equal(viewModel.contentComponentData, data);
  assert.equal(viewModel.model.verticalPosition, "bottom");
  assert.equal(viewModel.model.horizontalPosition, "left");
  assert.equal(viewModel.isModal, true);
  assert.equal(typeof viewModel.model.onCancel, "function");
  assert.equal(typeof viewModel.model.onApply, "function");
  assert.equal(typeof viewModel.model.onHide, "function");
  assert.equal(typeof viewModel.model.onShow, "function");
  assert.equal(viewModel.model.cssClass, "");
  assert.equal(viewModel.isVisible, false);

  const container: HTMLElement = viewModel.container;
  assert.equal(!!container, true);
  assert.equal(container.tagName, "DIV");
  assert.equal(container.innerHTML.indexOf('<div class="sv-popup"'), 0);
  assert.equal(container.parentElement.tagName, "BODY");

  assert.equal(viewModel.applyButtonText, "Apply");
  assert.equal(viewModel.cancelButtonText, "Cancel");
  assert.equal(viewModel.footerToolbar.actions.length, 2);
  assert.equal(viewModel.footerToolbar.actions[0].title, viewModel.cancelButtonText);
  assert.equal(viewModel.footerToolbar.actions[1].title, viewModel.applyButtonText);

  viewModel.dispose();
});

QUnit.test("PopupModalViewModel getActualHorizontalPosition", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.model.horizontalPosition, "left");
  assert.equal(viewModel["getActualHorizontalPosition"](), "left");

  document.body.style.direction = "rtl";
  assert.equal(viewModel["getActualHorizontalPosition"](), "right");

  document.body.style.direction = "";
  assert.equal(viewModel["getActualHorizontalPosition"](), "left");

  viewModel.dispose();
});

QUnit.test("PopupViewModel styleClass", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.styleClass, "sv-popup--dropdown sv-popup--show-pointer sv-popup--left");
  model.cssClass = "my-css-class";
  assert.equal(viewModel.styleClass, "my-css-class sv-popup--dropdown sv-popup--show-pointer sv-popup--left");

  viewModel.popupDirection = "down";
  assert.equal(viewModel.styleClass, "my-css-class sv-popup--dropdown sv-popup--show-pointer sv-popup--down");

  model.showPointer = false;
  assert.equal(viewModel.styleClass, "my-css-class sv-popup--dropdown");

  viewModel.dispose();
});

QUnit.test("PopupViewModel isVisible", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.isVisible, false);
  assert.equal(viewModel.top, "0px");
  assert.equal(viewModel.left, "0px");
  assert.equal(viewModel.popupDirection, "left");
  assert.deepEqual(viewModel.pointerTarget, { left: "0px", top: "0px" });

  let trace: String = "";
  model.onHide = () => {
    trace += "->onHide";
  };
  model.onShow = () => {
    trace += "->onShow";
  };

  model.toggleVisibility();

  //viewModel.isVisible(!viewModel.isVisible());
  assert.equal(trace, "->onShow");
  assert.equal(viewModel.isVisible, true);
  assert.equal(viewModel.top, "0px");
  assert.equal(viewModel.left, "0px");
  assert.equal(viewModel.popupDirection, "left");
  assert.equal(viewModel.pointerTarget.left, "0px");
  assert.equal(viewModel.pointerTarget.top, "0px");
  trace = "";

  model.toggleVisibility();
  //viewModel.isVisible(!viewModel.isVisible());
  assert.equal(trace, "->onHide");
  assert.equal(viewModel.isVisible, false);
  assert.equal(viewModel.top, "0px");
  assert.equal(viewModel.left, "0px");
  assert.equal(viewModel.popupDirection, "left");
  assert.equal(viewModel.pointerTarget.left, "0px");
  assert.equal(viewModel.pointerTarget.top, "0px");

  viewModel.dispose();
});

QUnit.test("PopupModel toggleVisibility", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;

  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.isVisible, false);
  assert.equal(viewModel.top, "0px");
  assert.equal(viewModel.left, "0px");
  assert.equal(viewModel.popupDirection, "left");
  assert.deepEqual(viewModel.pointerTarget, { left: "0px", top: "0px" });

  let trace: String = "";
  model.onHide = () => {
    trace += "->onHide";
  };
  model.onShow = () => {
    trace += "->onShow";
  };

  model.toggleVisibility();
  //viewModel.isVisible(!viewModel.isVisible());
  assert.equal(trace, "->onShow");
  assert.equal(viewModel.isVisible, true);
  assert.equal(viewModel.top, "0px");
  assert.equal(viewModel.left, "0px");
  assert.equal(viewModel.popupDirection, "left");
  assert.equal(viewModel.pointerTarget.left, "0px");
  assert.equal(viewModel.pointerTarget.top, "0px");
  trace = "";

  model.toggleVisibility();
  //viewModel.isVisible(!viewModel.isVisible());
  assert.equal(trace, "->onHide");
  assert.equal(viewModel.isVisible, false);
  assert.equal(viewModel.top, "0px");
  assert.equal(viewModel.left, "0px");
  assert.equal(viewModel.popupDirection, "left");
  assert.equal(viewModel.pointerTarget.left, "0px");
  assert.equal(viewModel.pointerTarget.top, "0px");

  viewModel.dispose();
});

QUnit.test("PopupModel PopupDropdownViewModel clickOutside", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.isVisible, false);
  assert.equal(viewModel.top, "0px");
  assert.equal(viewModel.left, "0px");
  assert.equal(viewModel.popupDirection, "left");
  assert.deepEqual(viewModel.pointerTarget, { left: "0px", top: "0px" });

  let trace: String = "";
  model.onHide = () => {
    trace += "->onHide";
  };
  model.onShow = () => {
    trace += "->onShow";
  };

  viewModel.clickOutside();
  assert.equal(trace, "");
  assert.equal(viewModel.isVisible, false);
  assert.equal(viewModel.top, "0px");
  assert.equal(viewModel.left, "0px");
  assert.equal(viewModel.popupDirection, "left");
  assert.deepEqual(viewModel.pointerTarget, { left: "0px", top: "0px" });
  trace = "";

  model.toggleVisibility();
  trace = "";
  viewModel.clickOutside();
  assert.equal(trace, "->onHide");
  assert.equal(viewModel.isVisible, false);
  assert.equal(viewModel.top, "0px");
  assert.equal(viewModel.left, "0px");
  assert.equal(viewModel.popupDirection, "left");
  assert.equal(viewModel.pointerTarget.left, "0px");
  assert.equal(viewModel.pointerTarget.top, "0px");
  trace = "";

  viewModel.dispose();
});

QUnit.test("PopupModel PopupModalViewModel clickOutside", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  const targetElement: HTMLElement = document.createElement("div");
  model.isModal = true;
  const viewModel: PopupModalViewModel = createPopupViewModel(model, targetElement) as PopupModalViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.isVisible, false);

  let trace: String = "";
  model.onHide = () => {
    trace += "->onHide";
  };
  model.onShow = () => {
    trace += "->onShow";
  };

  model.toggleVisibility();
  trace = "";
  viewModel.clickOutside();
  assert.equal(trace, "");
  assert.equal(viewModel.isVisible, true);
  trace = "";

  viewModel.dispose();
});

QUnit.test("PopupModel cancel", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupBaseViewModel = createPopupViewModel(
    model,
    targetElement
  );
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.isVisible, false);

  let trace: String = "";
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
  assert.equal(trace, "->onCancel");
  assert.equal(viewModel.isVisible, false);
  trace = "";

  model.toggleVisibility();
  trace = "";
  viewModel.cancel();
  assert.equal(trace, "->onCancel->onHide");
  assert.equal(viewModel.isVisible, false);
  trace = "";

  model.isModal = true;
  model.toggleVisibility();
  trace = "";
  viewModel.cancel();
  assert.equal(trace, "->onCancel->onHide");
  assert.equal(viewModel.isVisible, false);
  trace = "";

  viewModel.dispose();
});

QUnit.test("PopupModel apply", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  model.isModal = true;
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupModalViewModel = createPopupViewModel(model, targetElement) as PopupModalViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.isVisible, false);

  let trace: String = "";
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
  assert.equal(trace, "->onApply");
  assert.equal(viewModel.isVisible, false);
  trace = "";

  model.toggleVisibility();
  trace = "";
  viewModel.apply();
  assert.equal(trace, "->onApply->onHide");
  assert.equal(viewModel.isVisible, false);
  trace = "";

  model.isModal = true;
  model.toggleVisibility();
  trace = "";
  viewModel.apply();
  assert.equal(trace, "->onApply->onHide");
  assert.equal(viewModel.isVisible, false);
  trace = "";

  viewModel.dispose();
});

QUnit.test("PopupModel apply when not allow", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  model.isModal = true;
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupModalViewModel = createPopupViewModel(model, targetElement) as PopupModalViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.isVisible, false);

  let canApply = false;
  model.onApply = (): boolean => {
    return canApply;
  };

  model.toggleVisibility();
  assert.equal(viewModel.isVisible, true);
  viewModel.apply();
  assert.equal(viewModel.isVisible, true);
  canApply = true;
  viewModel.apply();
  assert.equal(viewModel.isVisible, false);

  viewModel.dispose();
});

QUnit.test("PopupViewModel dispose", (assert) => {
  const data = {};
  const model: PopupModel = new PopupModel("sv-list", data);

  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupBaseViewModel = createPopupViewModel(
    model,
    targetElement
  );
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  const container: HTMLElement = viewModel.container;

  viewModel.dispose();

  let trace: String = "";
  model.onHide = () => {
    trace += "->onHide";
  };
  model.onShow = () => {
    trace += "->onShow";
  };

  model.toggleVisibility();
  //viewModel.isVisible(!viewModel.isVisible());
  assert.equal(trace, "->onShow");

  assert.equal(!!viewModel.container, false);
  assert.equal(container.tagName, "DIV");
  assert.equal(container.innerHTML.indexOf('<div class="sv-popup"'), 0);
  assert.equal(container.parentElement, undefined);
});

QUnit.test("PopupViewModel initialize/unmount/dispose", (assert) => {
  const data = {};
  const model: PopupModel = new PopupModel("sv-list", data);

  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupBaseViewModel = createPopupViewModel(
    model,
    targetElement
  );

  assert.equal(!!viewModel.container, false);
  viewModel.initializePopupContainer();
  assert.equal(!!viewModel.container, true);

  viewModel.unmountPopupContainer();
  assert.equal(!!viewModel.container, true);

  viewModel.dispose();
  assert.equal(!!viewModel.container, false);
});

QUnit.test("Check calculatePosition method", (assert) => {
  assert.deepEqual(
    PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "left", false),
    { left: 0, top: 10 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "top",
      "center",
      false
    ),
    { left: 35, top: 10 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "top",
      "right",
      false
    ),
    { left: 70, top: 10 }
  );
  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "middle",
      "left",
      false
    ),
    { left: 0, top: 40 }
  );
  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "middle",
      "center",
      false
    ),
    { left: 35, top: 40 }
  );
  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "middle",
      "right",
      false
    ),
    { left: 70, top: 40 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "bottom",
      "left",
      false
    ),
    { left: 0, top: 70 }
  );
  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "bottom",
      "center",
      false
    ),
    { left: 35, top: 70 }
  );
  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "bottom",
      "right",
      false
    ),
    { left: 70, top: 70 }
  );

  //cases with pointer
  assert.deepEqual(
    PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "left", true),
    { left: 0, top: 60 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "right", true),
    { left: 70, top: 60 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "bottom",
      "left",
      true
    ),
    { left: 0, top: 20 }
  );

  assert.deepEqual(
    PopupUtils.calculatePosition(
      <any>targetRect,
      10,
      20,
      "bottom",
      "right",
      true
    ),
    { left: 70, top: 20 }
  );
});

QUnit.test("Check calculatateDirection method", (assert) => {
  assert.deepEqual(PopupUtils.calculatePopupDirection("top", "left"), "left");

  assert.deepEqual(PopupUtils.calculatePopupDirection("top", "center"), "top");

  assert.deepEqual(PopupUtils.calculatePopupDirection("top", "right"), "right");
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("middle", "left"),
    "left"
  );
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("middle", "center"),
    undefined
  );
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("middle", "right"),
    "right"
  );
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("bottom", "left"),
    "left"
  );
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("bottom", "center"),
    "bottom"
  );
  assert.deepEqual(
    PopupUtils.calculatePopupDirection("bottom", "right"),
    "right"
  );
});

QUnit.test("Check calculatePointer target method", (assert) => {
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "left"),
    { left: 10, top: 35 }
  );

  assert.deepEqual(
    PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "center"),
    { left: 35, top: 10 }
  );

  assert.deepEqual(
    PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "right"),
    { left: 60, top: 35 }
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "middle",
      "left"
    ),
    { left: 10, top: 35 }
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      20,
      "middle",
      "center"
    ),
    { left: NaN, top: NaN }
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "middle",
      "right"
    ),
    { left: 60, top: 35 }
  );

  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "left"
    ),
    { left: 10, top: 35 }
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "left",
      10,
      15
    ),
    { left: -15, top: 35 }, "pointer target takes into account margin"
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "center"
    ),
    { left: 35, top: 60 }
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "center",
      10,
      15
    ),
    { left: 25, top: 60 }, "pointer target takes into account margin"
  );
  assert.deepEqual(
    PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "right"
    ),
    { left: 60, top: 35 }
  );
});

QUnit.test("Check calculatePosition with window size method", (assert) => {
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
    "bottom",
    false,
    windowHeight
  );
  assert.deepEqual(
    verticalPosition,
    "top",
    "vertical position is changed to top cause doesn't fit in bottom"
  );
  targetRect.top = 50;
  targetRect.bottom = 70;
  verticalPosition = PopupUtils.updateVerticalPosition(
    targetRect,
    100,
    "top",
    false,
    windowHeight
  );
  assert.deepEqual(
    verticalPosition,
    "bottom",
    "vertical position is changed to bottom cause doesn't fit in top"
  );
  targetRect.top = 200;
  targetRect.bottom = 220;
  verticalPosition = PopupUtils.updateVerticalPosition(
    targetRect,
    300,
    "top",
    false,
    windowHeight
  );
  assert.deepEqual(
    verticalPosition,
    "top",
    "both directions do not fit: result top"
  );
  targetRect.top = 100;
  targetRect.bottom = 120;
  verticalPosition = PopupUtils.updateVerticalPosition(
    targetRect,
    300,
    "top",
    false,
    windowHeight
  );
  assert.deepEqual(
    verticalPosition,
    "bottom",
    "both directions do not fit: result bottom"
  );
  targetRect.top = 50;
  targetRect.bottom = 70;
  verticalPosition = PopupUtils.updateVerticalPosition(
    targetRect,
    60,
    "top",
    true,
    windowHeight
  );
  assert.deepEqual(
    verticalPosition,
    "top",
    "with pointer: top vertical position is not changed"
  );
  verticalPosition = PopupUtils.updateVerticalPosition(
    targetRect,
    100,
    "top",
    true,
    windowHeight
  );
  assert.deepEqual(
    verticalPosition,
    "bottom",
    "with pointer: top vertical position is changed to bottom"
  );

  targetRect.top = 250;
  targetRect.bottom = 270;
  verticalPosition = PopupUtils.updateVerticalPosition(
    targetRect,
    40,
    "bottom",
    true,
    windowHeight
  );
  assert.deepEqual(
    verticalPosition,
    "bottom",
    "with pointer: bottom vertical position is not changed"
  );
  verticalPosition = PopupUtils.updateVerticalPosition(
    targetRect,
    100,
    "bottom",
    true,
    windowHeight
  );
  assert.deepEqual(
    verticalPosition,
    "top",
    "with pointer: bottom vertical position is changed to top"
  );
  targetRect.top = 200;
  targetRect.bottom = 220;
  verticalPosition = PopupUtils.updateVerticalPosition(
    targetRect,
    300,
    "top",
    true,
    windowHeight
  );
  assert.deepEqual(
    verticalPosition,
    "top",
    "with pointer: both directions do not fit: result top"
  );
  targetRect.top = 100;
  targetRect.bottom = 120;
  verticalPosition = PopupUtils.updateVerticalPosition(
    targetRect,
    300,
    "top",
    true,
    windowHeight
  );
  assert.deepEqual(
    verticalPosition,
    "bottom",
    "with pointer: both directions do not fit: result bottom"
  );
});

QUnit.test(
  "Check updateVerticalDimensions if both directions do not fit",
  (assert) => {
    let newVerticalDimensions = PopupUtils.updateVerticalDimensions(
      -20,
      200,
      300
    );
    assert.equal(newVerticalDimensions.height, 180);
    assert.equal(newVerticalDimensions.top, 0);

    newVerticalDimensions = PopupUtils.updateVerticalDimensions(150, 200, 300);
    assert.equal(newVerticalDimensions.height, 150 - PopupUtils.bottomIndent);
    assert.equal(newVerticalDimensions.top, 150);

    newVerticalDimensions = PopupUtils.updateVerticalDimensions(150, 450, 300);
    assert.equal(newVerticalDimensions.height, 150 - PopupUtils.bottomIndent);
    assert.equal(newVerticalDimensions.top, 150);
  }
);

QUnit.test("Check updateHorizontalDimensions", (assert) => {
  let newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-20, 200, 300, "center");
  assert.equal(newHorizontalDimensions.width, 200, "updateHorizontalDimensions - center - fitting left out - width");
  assert.equal(newHorizontalDimensions.left, 0, "updateHorizontalDimensions - center - fitting left out - left");

  newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-100, 300, 250, "center");
  assert.equal(newHorizontalDimensions.width, 250, "updateHorizontalDimensions - center - not-fitting left out - width");
  assert.equal(newHorizontalDimensions.left, 0, "updateHorizontalDimensions - center - not-fitting left out - left");

  newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 200, 250, "center");
  assert.equal(newHorizontalDimensions.width, 200, "updateHorizontalDimensions - center - fitting right out - width");
  assert.equal(newHorizontalDimensions.left, 50, "updateHorizontalDimensions - center - fitting right out - left");

  newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center");
  assert.equal(newHorizontalDimensions.width, 250, "updateHorizontalDimensions - center - non-fitting right out - width");
  assert.equal(newHorizontalDimensions.left, 0, "updateHorizontalDimensions - center - non-fitting right out - left");

  newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-20, 200, 300, "left");
  assert.equal(newHorizontalDimensions.width, 200, "updateHorizontalDimensions - left - left out - width");
  assert.equal(newHorizontalDimensions.left, 0, "updateHorizontalDimensions - left - left out - left");

  newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 250, 300, "right");
  assert.equal(newHorizontalDimensions.width, 200, "updateHorizontalDimensions - right - right out - width");
  assert.equal(newHorizontalDimensions.left, 100, "updateHorizontalDimensions - right - right out - left");
}
);
QUnit.test("Check updateHorizontalDimensions with margins positionMode is flex", (assert) => {
  let newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center", "flex", { left: 10, right: 15 });
  assert.equal(newHorizontalDimensions.width, 225, "updateHorizontalDimensions - center+flex - non-fitting right out - width");
  assert.equal(newHorizontalDimensions.left, 10, "updateHorizontalDimensions - center+flex - non-fitting right out - left");

  newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-20, 200, 300, "left", "flex", { left: 10, right: 15 });
  assert.equal(newHorizontalDimensions.width, 200, "updateHorizontalDimensions - left+flex - left out - width");
  assert.equal(newHorizontalDimensions.left, 10, "updateHorizontalDimensions - left+flex - left out - left");

  newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 250, 300, "right", "flex", { left: 10, right: 15 });
  assert.equal(newHorizontalDimensions.width, 175, "updateHorizontalDimensions - right+flex - right out - width");
  assert.equal(newHorizontalDimensions.left, 100, "updateHorizontalDimensions - right+flex - right out - left");
});

QUnit.test("Check updateHorizontalDimensions positionMode is fixed", (assert) => {
  let newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center", "fixed", { left: 10, right: 15 });
  assert.equal(newHorizontalDimensions.width, 125, "updateHorizontalDimensions - center+fixed - non-fitting right out - width");
  assert.equal(newHorizontalDimensions.left, 90, "updateHorizontalDimensions - center+fixed - non-fitting right out - left");

  newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center", "fixed");
  assert.equal(newHorizontalDimensions.width, 150, "updateHorizontalDimensions - center+fixed - without margin");
  assert.equal(newHorizontalDimensions.left, 100, "updateHorizontalDimensions - center+fixed - without margin");
});

QUnit.test("PopupModel dropdown displayMode", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.showFooter, false);
  assert.equal(viewModel.styleClass, "sv-popup--dropdown sv-popup--show-pointer sv-popup--left");
  model.displayMode = "overlay";
  assert.equal(viewModel.styleClass, "sv-popup--overlay");

  viewModel.dispose();
});

QUnit.test("PopupModel isModal displayMode", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  const targetElement: HTMLElement = document.createElement("div");
  model.isModal = true;
  const viewModel: PopupModalViewModel = createPopupViewModel(model, targetElement) as PopupModalViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;

  assert.equal(viewModel.styleClass, "sv-popup--modal");
  model.displayMode = "overlay";
  assert.equal(viewModel.styleClass, "sv-popup--overlay");

  viewModel.dispose();
});

QUnit.test("PopupModel and locale", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {});
  const targetElement: HTMLElement = document.createElement("div");
  const viewModel: PopupModalViewModel = createPopupViewModel(model, targetElement) as PopupModalViewModel;
  viewModel.initializePopupContainer();
  assert.equal(viewModel.getLocalizationString("modalApplyButtonText"), englishStrings.modalApplyButtonText, "en Apply text");
  viewModel.locale = "de";
  assert.equal(viewModel.getLocalizationString("modalApplyButtonText"), germanSurveyStrings.modalApplyButtonText, "de Apply text");
  viewModel.dispose();
});

QUnit.test("PopupModel top+center position calculate", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "top", "center", true);
  const targetElement: HTMLElement = document.createElement("button");

  targetElement.style.position = "absolute";
  targetElement.style.top = "1000px";
  targetElement.style.left = "1000px";
  targetElement.style.width = "32px";
  targetElement.style.height = "24px";
  document.body.appendChild(targetElement);
  targetElement.parentElement.scrollTop = 0;
  targetElement.parentElement.scrollLeft = 0;

  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;
  let popupContainer = viewModel.container.children[0].children[0] as HTMLElement;
  popupContainer.style.width = "200px";
  popupContainer.style.height = "400px";
  popupContainer.style.margin = "8px";

  (<any>window).innerHeight = 2000;
  (<any>window).innerWidth = 2000;
  viewModel.updateOnShowing();
  assert.equal(viewModel.left, (1000 - 200 / 2 - 8 + 32 / 2) + "px");

  viewModel.dispose();
  document.body.removeChild(targetElement);
});

QUnit.test("PopupModel top+left position calculate", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "top", "left", true);
  const targetElement: HTMLElement = document.createElement("button");

  targetElement.style.position = "absolute";
  targetElement.style.top = "1000px";
  targetElement.style.left = "1000px";
  targetElement.style.width = "32px";
  targetElement.style.height = "24px";
  document.body.appendChild(targetElement);
  targetElement.parentElement.scrollTop = 0;
  targetElement.parentElement.scrollLeft = 0;

  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;
  let popupContainer = viewModel.container.children[0].children[0] as HTMLElement;
  popupContainer.style.width = "200px";
  popupContainer.style.height = "400px";
  popupContainer.style.margin = "8px";

  (<any>window).innerHeight = 2000;
  (<any>window).innerWidth = 2000;
  viewModel.updateOnShowing();
  assert.equal(viewModel.pointerTarget.left, "200px");

  viewModel.dispose();
  document.body.removeChild(targetElement);
});

QUnit.test("Fixed PopupModel width calculate", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "bottom", "center", true);
  model.positionMode = "fixed";
  model.setWidthByTarget = true;
  const targetElement: HTMLElement = document.createElement("button");

  targetElement.style.position = "absolute";
  targetElement.style.top = "130px";
  targetElement.style.left = "200px";
  targetElement.style.width = "560px";
  targetElement.style.height = "48px";
  document.body.appendChild(targetElement);
  targetElement.parentElement.scrollTop = 0;
  targetElement.parentElement.scrollLeft = 0;

  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;
  let popupContainer = viewModel.container.children[0].children[0] as HTMLElement;
  popupContainer.style.width = "700px";
  popupContainer.style.height = "400px";

  (<any>window).innerWidth = 1000;
  (<any>window).innerHeight = 800;
  model.toggleVisibility();
  viewModel.updateOnShowing();
  assert.equal(viewModel.minWidth, "560px", "minWidth");
  assert.equal(viewModel.width, "auto", "width");
  assert.equal(viewModel.left, "200px", "left");
  assert.equal(viewModel.top, "178px", "top");

  viewModel.dispose();
  document.body.removeChild(targetElement);
});

QUnit.test("Fixed PopupModel width calculate if short content", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "bottom", "center", true);
  model.positionMode = "fixed";
  model.setWidthByTarget = true;
  const targetElement: HTMLElement = document.createElement("button");

  targetElement.style.position = "absolute";
  targetElement.style.top = "130px";
  targetElement.style.left = "200px";
  targetElement.style.width = "560px";
  targetElement.style.height = "48px";
  document.body.appendChild(targetElement);
  targetElement.parentElement.scrollTop = 0;
  targetElement.parentElement.scrollLeft = 0;

  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;
  let popupContainer = viewModel.container.children[0].children[0] as HTMLElement;
  popupContainer.style.width = "200px";
  popupContainer.style.height = "400px";

  (<any>window).innerWidth = 1000;
  (<any>window).innerHeight = 800;
  model.toggleVisibility();
  viewModel.updateOnShowing();
  assert.equal(viewModel.minWidth, "560px", "minWidth");
  assert.equal(viewModel.width, "auto", "width");
  assert.equal(viewModel.left, "200px", "left");
  assert.equal(viewModel.top, "178px", "top");

  viewModel.dispose();
  document.body.removeChild(targetElement);
});

QUnit.test("Fixed PopupModel width calculate and overflow content position calculate", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "bottom", "center", true);
  model.positionMode = "fixed";
  model.setWidthByTarget = true;
  const targetElement: HTMLElement = document.createElement("button");

  targetElement.style.position = "absolute";
  targetElement.style.top = "130px";
  targetElement.style.left = "200px";
  targetElement.style.width = "560px";
  targetElement.style.height = "48px";
  document.body.appendChild(targetElement);
  targetElement.parentElement.scrollTop = 0;
  targetElement.parentElement.scrollLeft = 0;

  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;
  let popupContainer = viewModel.container.children[0].children[0] as HTMLElement;
  popupContainer.style.width = "1500px";
  popupContainer.style.height = "400px";

  (<any>window).innerWidth = 1000;
  (<any>window).innerHeight = 800;
  model.toggleVisibility();
  viewModel.updateOnShowing();
  assert.equal(viewModel.minWidth, "560px", "minWidth");
  assert.equal(viewModel.width, "800px", "width");
  assert.equal(viewModel.left, "200px", "left");
  assert.equal(viewModel.top, "178px", "top");

  viewModel.dispose();
  document.body.removeChild(targetElement);
});

QUnit.test("PopupViewModel updateOnHiding", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "bottom", "center", true);
  model.positionMode = "fixed";
  const targetElement: HTMLElement = document.createElement("button");

  targetElement.style.position = "absolute";
  targetElement.style.top = "130px";
  targetElement.style.left = "200px";
  targetElement.style.width = "560px";
  targetElement.style.height = "48px";
  document.body.appendChild(targetElement);
  targetElement.parentElement.scrollTop = 0;
  targetElement.parentElement.scrollLeft = 0;

  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  viewModel.container.innerHTML = popupTemplate;
  let popupContainer = viewModel.container.children[0].children[0] as HTMLElement;
  popupContainer.style.width = "550px";
  popupContainer.style.height = "400px";

  assert.equal(viewModel.isVisible, false);
  assert.equal(viewModel.top, "0px");
  assert.equal(viewModel.left, "0px");
  assert.equal(viewModel.height, "auto");
  assert.equal(viewModel.width, "auto");

  let trace: String = "";
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

  assert.equal(trace, "->onShow");
  assert.equal(viewModel.isVisible, true);
  assert.notEqual(viewModel.top, "0px", "onShow top");
  assert.notEqual(viewModel.left, "0px", "onShow left");
  assert.notEqual(viewModel.height, "auto", "onShow height");
  assert.notEqual(viewModel.width, "auto", "onShow width");
  trace = "";

  model.toggleVisibility();
  assert.equal(trace, "->onHide");
  assert.equal(viewModel.isVisible, false);
  assert.equal(viewModel.top, "0px", "onHide top");
  assert.equal(viewModel.left, "0px", "onHide left");
  assert.equal(viewModel.height, "auto", "onHide height");
  assert.equal(viewModel.width, "auto", "onHide width");

  viewModel.dispose();
});

QUnit.test("PopupViewModel remove correct div even if container is changed", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "bottom", "center", true);
  const targetElement: HTMLElement = document.createElement("button");
  const viewModel: PopupDropdownViewModel = createPopupViewModel(model, targetElement) as PopupDropdownViewModel;
  viewModel.initializePopupContainer();
  const container = viewModel.container;
  viewModel.container.appendChild(document.createElement("div"));
  viewModel.container = <HTMLElement>viewModel.container.children[0];
  viewModel.unmountPopupContainer();
  assert.notOk(container.isConnected);
});