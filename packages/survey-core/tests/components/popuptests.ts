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

import { describe, test, expect } from "vitest";
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

    expect(model.contentComponentName).toLooseEqual("sv-list");
    expect(model.contentComponentData).toLooseEqual(data);
    expect(model.verticalPosition).toLooseEqual("bottom");
    expect(model.horizontalPosition).toLooseEqual("left");
    expect(model.showPointer).toLooseEqual(true);
    expect(model.isModal).toLooseEqual(false);
    expect(typeof model.onCancel).toLooseEqual("function");
    expect(typeof model.onApply).toLooseEqual("function");
    expect(typeof model.onHide).toLooseEqual("function");
    expect(typeof model.onShow).toLooseEqual("function");
    expect(model.cssClass).toLooseEqual("");
    expect(model.onVisibilityChanged.isEmpty).toBeTruthy();
  });

  test("PopupModel toggleVisibility", () => {
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data);

    let trace = "";

    model.toggleVisibility();
    expect(trace).toLooseEqual("");

    model.onVisibilityChanged.add(() => {
      trace += "->onToggleVisibility";
    });

    model.toggleVisibility();
    expect(trace).toLooseEqual("->onToggleVisibility");
  });

  test("PopupDropdownViewModel defaults", () => {
    surveyLocalization.currentLocale = "";
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data);

    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.contentComponentName).toLooseEqual("sv-list");
    expect(viewModel.contentComponentData).toLooseEqual(data);
    expect(viewModel.model.verticalPosition).toLooseEqual("bottom");
    expect(viewModel.model.horizontalPosition).toLooseEqual("left");
    expect(viewModel.showHeader).toLooseEqual(true);
    expect(viewModel.isModal).toLooseEqual(false);
    expect(typeof viewModel.model.onCancel).toLooseEqual("function");
    expect(typeof viewModel.model.onApply).toLooseEqual("function");
    expect(typeof viewModel.model.onHide).toLooseEqual("function");
    expect(typeof viewModel.model.onShow).toLooseEqual("function");
    expect(viewModel.model.cssClass).toLooseEqual("");

    //expect(ko.isWritableObservable(viewModel.top)).toLooseEqual(true);
    expect(viewModel.top).toLooseEqual("0px");
    //expect(ko.isWritableObservable(viewModel.left)).toLooseEqual(true);
    expect(viewModel.left).toLooseEqual("0px");
    //expect(ko.isWritableObservable(viewModel.popupDirection)).toLooseEqual(true);
    expect(viewModel.popupDirection).toLooseEqual("left");
    //expect(ko.isWritableObservable(viewModel.pointerTarget)).toLooseEqual(true);
    expect(viewModel.pointerTarget).toEqualValues({ left: "0px", top: "0px" });
    // expect(ko.isWritableObservable(viewModel.isVisible)).toLooseEqual(true);
    expect(viewModel.isVisible).toLooseEqual(false);

    const container: HTMLElement = viewModel.container;
    expect(!!container).toLooseEqual(true);
    expect(container.tagName).toLooseEqual("DIV");
    expect(container.innerHTML.indexOf('<div class="sv-popup"')).not.toLooseEqual(0);
    expect(container.parentElement.tagName).toLooseEqual("BODY");

    expect(viewModel.footerToolbar.actions.length).toLooseEqual(1);
    expect(viewModel.footerToolbar.actions[0].title).toLooseEqual(viewModel.cancelButtonText);

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: popup direction calculation requires real DOM/RTL layout not provided by jsdom.
  test.skip("PopupDropdownViewModel RTL", () => {
    surveyLocalization.currentLocale = "";
    const data = {};
    const model: PopupModel = new PopupModel("sv-list", data, { horizontalPosition: "right" });

    document.dir = "rtl";
    const targetElement: HTMLElement = document.createElement("div");
    targetElement.style.position = "absolute";
    targetElement.style.top = "1000px";
    targetElement.style.left = "1000px";
    targetElement.style.width = "32px";
    targetElement.style.height = "24px";
    addElementIntoBody(targetElement);
    targetElement.parentElement.scrollTop = 0;
    targetElement.parentElement.scrollLeft = 0;

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = viewModel.container.querySelector(".sv-popup__container") as HTMLElement;
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";
    popupContainer.style.margin = "8px";

    (<any>window).innerHeight = 2000;
    (<any>window).innerWidth = 2000;
    viewModel.updateOnShowing();

    viewModel.updatePosition(false, false);
    expect(viewModel.popupDirection).toLooseEqual("left");

    viewModel.dispose();
    targetElement.remove();
    document.dir = "";
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
    expect(!!container).toLooseEqual(true);
    expect(container.tagName).toLooseEqual("DIV");
    expect(container.innerHTML.indexOf('<div class="sv-popup"')).not.toLooseEqual(0);

    expect(container.parentElement?.tagName).toLooseEqual("DIV");
    expect(container.parentElement?.id).toLooseEqual("shadowElement");

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

    expect(viewModel.contentComponentName).toLooseEqual("sv-list");
    expect(viewModel.contentComponentData).toLooseEqual(data);
    expect(viewModel.model.verticalPosition).toLooseEqual("bottom");
    expect(viewModel.model.horizontalPosition).toLooseEqual("left");
    expect(viewModel.isModal).toLooseEqual(true);
    expect(typeof viewModel.model.onCancel).toLooseEqual("function");
    expect(typeof viewModel.model.onApply).toLooseEqual("function");
    expect(typeof viewModel.model.onHide).toLooseEqual("function");
    expect(typeof viewModel.model.onShow).toLooseEqual("function");
    expect(viewModel.model.cssClass).toLooseEqual("");
    expect(viewModel.isVisible).toLooseEqual(false);

    const container: HTMLElement = viewModel.container;
    expect(!!container).toLooseEqual(true);
    expect(container.tagName).toLooseEqual("DIV");
    expect(container.innerHTML.indexOf('<div class="sv-popup"')).not.toLooseEqual(0);
    expect(container.parentElement.tagName).toLooseEqual("BODY");

    expect(viewModel.applyButtonText).toLooseEqual("Apply");
    expect(viewModel.cancelButtonText).toLooseEqual("Cancel");
    expect(viewModel.footerToolbar.actions.length).toLooseEqual(2);
    expect(viewModel.footerToolbar.actions[0].title).toLooseEqual(viewModel.cancelButtonText);
    expect(viewModel.footerToolbar.actions[1].title).toLooseEqual(viewModel.applyButtonText);

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModalViewModel getActualHorizontalPosition", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.model.horizontalPosition).toLooseEqual("left");
    expect(viewModel["getActualHorizontalPosition"]()).toLooseEqual("left");

    document.body.style.direction = "rtl";
    expect(viewModel["getActualHorizontalPosition"]()).toLooseEqual("right");

    document.body.style.direction = "";
    expect(viewModel["getActualHorizontalPosition"]()).toLooseEqual("left");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupViewModel styleClass", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.styleClass).toLooseEqual("sv-popup--menu-popup sv-popup--show-pointer sv-popup--left");
    model.cssClass = "my-css-class";
    expect(viewModel.styleClass).toLooseEqual("my-css-class sv-popup--menu-popup sv-popup--show-pointer sv-popup--left");

    viewModel.popupDirection = "down";
    expect(viewModel.styleClass).toLooseEqual("my-css-class sv-popup--menu-popup sv-popup--show-pointer sv-popup--down");

    model.showPointer = false;
    expect(viewModel.styleClass).toLooseEqual("my-css-class sv-popup--menu-popup");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupViewModel isVisible", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.popupDirection).toLooseEqual("left");
    expect(viewModel.pointerTarget).toEqualValues({ left: "0px", top: "0px" });

    let trace: string = "";
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    model.toggleVisibility();

    //viewModel.isVisible(!viewModel.isVisible());
    expect(trace).toLooseEqual("->onShow");
    expect(viewModel.isVisible).toLooseEqual(true);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.popupDirection).toLooseEqual("left");
    expect(viewModel.pointerTarget.left).toLooseEqual("0px");
    expect(viewModel.pointerTarget.top).toLooseEqual("0px");
    trace = "";

    model.toggleVisibility();
    //viewModel.isVisible(!viewModel.isVisible());
    expect(trace).toLooseEqual("->onHide");
    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.popupDirection).toLooseEqual("left");
    expect(viewModel.pointerTarget.left).toLooseEqual("0px");
    expect(viewModel.pointerTarget.top).toLooseEqual("0px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel toggleVisibility", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;

    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.popupDirection).toLooseEqual("left");
    expect(viewModel.pointerTarget).toEqualValues({ left: "0px", top: "0px" });

    let trace: string = "";
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    model.toggleVisibility();
    //viewModel.isVisible(!viewModel.isVisible());
    expect(trace).toLooseEqual("->onShow");
    expect(viewModel.isVisible).toLooseEqual(true);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.popupDirection).toLooseEqual("left");
    expect(viewModel.pointerTarget.left).toLooseEqual("0px");
    expect(viewModel.pointerTarget.top).toLooseEqual("0px");
    trace = "";

    model.toggleVisibility();
    //viewModel.isVisible(!viewModel.isVisible());
    expect(trace).toLooseEqual("->onHide");
    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.popupDirection).toLooseEqual("left");
    expect(viewModel.pointerTarget.left).toLooseEqual("0px");
    expect(viewModel.pointerTarget.top).toLooseEqual("0px");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel PopupDropdownViewModel clickOutside", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.popupDirection).toLooseEqual("left");
    expect(viewModel.pointerTarget).toEqualValues({ left: "0px", top: "0px" });

    let trace: string = "";
    model.onHide = () => {
      trace += "->onHide";
    };
    model.onShow = () => {
      trace += "->onShow";
    };

    viewModel.clickOutside();
    expect(trace).toLooseEqual("");
    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.popupDirection).toLooseEqual("left");
    expect(viewModel.pointerTarget).toEqualValues({ left: "0px", top: "0px" });
    trace = "";

    model.toggleVisibility();
    trace = "";
    viewModel.clickOutside();
    expect(trace).toLooseEqual("->onHide");
    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.popupDirection).toLooseEqual("left");
    expect(viewModel.pointerTarget.left).toLooseEqual("0px");
    expect(viewModel.pointerTarget.top).toLooseEqual("0px");
    trace = "";

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: pointer target positioning requires real DOM layout not provided by jsdom.
  test.skip("PopupDropdownViewModel pointerTarget", () => {
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

    let fixedPopupContainer = viewModel.container.querySelector(".sv-popup") as HTMLElement;
    fixedPopupContainer.getBoundingClientRect = () => { return <DOMRect>{ bottom: 953, height: 953, left: 0, right: 795, top: 0, width: 795, x: 0, y: 0 }; };

    model.toggleVisibility();
    viewModel.updatePosition(true, false);

    expect(viewModel.popupDirection).toLooseEqual("bottom");
    expect(viewModel.top).toLooseEqual("292px");
    expect(viewModel.left).toLooseEqual("131px");
    expect(viewModel.pointerTarget).toEqualValues({ left: "134px", top: "0px" });

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

    expect(viewModel.isVisible).toLooseEqual(false);

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
    expect(trace).toLooseEqual("");
    expect(viewModel.isVisible).toLooseEqual(true);
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

    expect(viewModel.isVisible).toLooseEqual(false);

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
    expect(trace).toLooseEqual("->onCancel");
    expect(viewModel.isVisible).toLooseEqual(false);
    trace = "";

    model.toggleVisibility();
    trace = "";
    viewModel.cancel();
    expect(trace).toLooseEqual("->onCancel->onHide");
    expect(viewModel.isVisible).toLooseEqual(false);
    trace = "";

    model.isModal = true;
    model.toggleVisibility();
    trace = "";
    viewModel.cancel();
    expect(trace).toLooseEqual("->onCancel->onHide");
    expect(viewModel.isVisible).toLooseEqual(false);
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

    expect(viewModel.isVisible).toLooseEqual(false);

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
    expect(trace).toLooseEqual("->onApply");
    expect(viewModel.isVisible).toLooseEqual(false);
    trace = "";

    model.toggleVisibility();
    trace = "";
    viewModel.apply();
    expect(trace).toLooseEqual("->onApply->onHide");
    expect(viewModel.isVisible).toLooseEqual(false);
    trace = "";

    model.isModal = true;
    model.toggleVisibility();
    trace = "";
    viewModel.apply();
    expect(trace).toLooseEqual("->onApply->onHide");
    expect(viewModel.isVisible).toLooseEqual(false);
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

    expect(viewModel.isVisible).toLooseEqual(false);

    let canApply = false;
    model.onApply = (): boolean => {
      return canApply;
    };

    model.toggleVisibility();
    expect(viewModel.isVisible).toLooseEqual(true);
    viewModel.apply();
    expect(viewModel.isVisible).toLooseEqual(true);
    canApply = true;
    viewModel.apply();
    expect(viewModel.isVisible).toLooseEqual(false);

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
    expect(trace).toLooseEqual("");
    expect(!!viewModel.container).toLooseEqual(false);
    expect(container.tagName).toLooseEqual("DIV");
    expect(container.innerHTML.indexOf('<div class="sv-popup"')).not.toLooseEqual(0);

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

    expect(!!viewModel.container).toLooseEqual(false);
    viewModel.initializePopupContainer();
    expect(!!viewModel.container).toLooseEqual(true);

    viewModel.dispose();
    expect(!!viewModel.container).toLooseEqual(false);

    targetElement.remove();
  });

  test("Check calculatePosition method", () => {
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "left"), "top left").toEqualValues({ left: 0, top: 60 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "center"), "top center").toEqualValues({ left: 35, top: 10 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "right"), "top right").toEqualValues({ left: 70, top: 60 });

    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "middle", "left"), "middle left").toEqualValues({ left: 0, top: 40 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "middle", "center"), "middle center").toEqualValues({ left: 35, top: 40 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "middle", "right"), "middle right").toEqualValues({ left: 70, top: 40 });

    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "bottom", "left"), "bottom left").toEqualValues({ left: 0, top: 20 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "bottom", "center"), "bottom center").toEqualValues({ left: 35, top: 70 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "bottom", "right"), "bottom right").toEqualValues({ left: 70, top: 20 });

    //cases with pointer
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "left"/*, true*/)).toEqualValues({ left: 0, top: 60 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "top", "right"/*, true*/)).toEqualValues({ left: 70, top: 60 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "bottom", "left"/*, true*/)).toEqualValues({ left: 0, top: 20 });
    expect(PopupUtils.calculatePosition(<any>targetRect, 10, 20, "bottom", "right"/*, true*/)).toEqualValues({ left: 70, top: 20 });
  });

  test("Check calculatateDirection method", () => {
    expect(PopupUtils.calculatePopupDirection("top", "left")).toEqualValues("left");

    expect(PopupUtils.calculatePopupDirection("top", "center")).toEqualValues("top");

    expect(PopupUtils.calculatePopupDirection("top", "right")).toEqualValues("right");
    expect(PopupUtils.calculatePopupDirection("middle", "left")).toEqualValues("left");
    expect(PopupUtils.calculatePopupDirection("middle", "center")).toEqualValues(undefined);
    expect(PopupUtils.calculatePopupDirection("middle", "right")).toEqualValues("right");
    expect(PopupUtils.calculatePopupDirection("bottom", "left")).toEqualValues("left");
    expect(PopupUtils.calculatePopupDirection("bottom", "center")).toEqualValues("bottom");
    expect(PopupUtils.calculatePopupDirection("bottom", "right")).toEqualValues("right");
  });

  test("Check calculatePointer target method", () => {
    expect(PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "left")).toEqualValues({ left: 10, top: 35 });

    expect(PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "center")).toEqualValues({ left: 35, top: 10 });

    expect(PopupUtils.calculatePointerTarget(<any>targetRect, 10, 10, "top", "right")).toEqualValues({ left: 60, top: 35 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "middle",
      "left"
    )).toEqualValues({ left: 10, top: 35 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      20,
      "middle",
      "center"
    )).toEqualValues({ left: NaN, top: NaN });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "middle",
      "right"
    )).toEqualValues({ left: 60, top: 35 });

    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "left"
    )).toEqualValues({ left: 10, top: 35 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "left",
      10,
      15
    ), "pointer target takes into account margin").toEqualValues({ left: -15, top: 35 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "center"
    )).toEqualValues({ left: 35, top: 60 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "center",
      10,
      15
    ), "pointer target takes into account margin").toEqualValues({ left: 25, top: 60 });
    expect(PopupUtils.calculatePointerTarget(
      <any>targetRect,
      10,
      10,
      "bottom",
      "right"
    )).toEqualValues({ left: 60, top: 35 });
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
    expect(verticalPosition, "vertical position is changed to top cause doesn't fit in bottom").toEqualValues("top");
    targetRect.top = 50;
    targetRect.bottom = 70;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      100,
      "center",
      "top",
      windowHeight
    );
    expect(verticalPosition, "vertical position is changed to bottom cause doesn't fit in top").toEqualValues("bottom");
    targetRect.top = 200;
    targetRect.bottom = 220;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      300,
      "center",
      "top",
      windowHeight
    );
    expect(verticalPosition, "both directions do not fit: result top").toEqualValues("top");
    targetRect.top = 100;
    targetRect.bottom = 120;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      300,
      "center",
      "top",
      windowHeight
    );
    expect(verticalPosition, "both directions do not fit: result bottom").toEqualValues("bottom");
    targetRect.top = 50;
    targetRect.bottom = 70;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      60,
      "left",
      "top",
      windowHeight
    );
    expect(verticalPosition, "with pointer: top vertical position is not changed").toEqualValues("top");
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      100,
      "left",
      "top",
      windowHeight
    );
    expect(verticalPosition, "with pointer: top vertical position is changed to bottom").toEqualValues("bottom");

    targetRect.top = 250;
    targetRect.bottom = 270;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      40,
      "left",
      "bottom",
      windowHeight
    );
    expect(verticalPosition, "with pointer: bottom vertical position is not changed").toEqualValues("bottom");
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      100,
      "left",
      "bottom",
      windowHeight
    );
    expect(verticalPosition, "with pointer: bottom vertical position is changed to top").toEqualValues("top");
    targetRect.top = 200;
    targetRect.bottom = 220;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      300,
      "left",
      "top",
      windowHeight
    );
    expect(verticalPosition, "with pointer: both directions do not fit: result top").toEqualValues("top");
    targetRect.top = 100;
    targetRect.bottom = 120;
    verticalPosition = PopupUtils.updateVerticalPosition(
      targetRect,
      300,
      "left",
      "top",
      windowHeight
    );
    expect(verticalPosition, "with pointer: both directions do not fit: result bottom").toEqualValues("bottom");
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
    expect(horizontalPosition, "horizontal position is changed to top cause doesn't fit in right").toEqualValues("left");

    horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 25, "right", windowWidth);
    expect(horizontalPosition, "right horizontal position is not changed").toEqualValues("right");

    targetRect.left = 50;
    targetRect.right = 70;
    horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 100, "left", windowWidth);
    expect(horizontalPosition, "horizontal position is changed to bottom cause doesn't fit in left").toEqualValues("right");

    horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 40, "left", windowWidth);
    expect(horizontalPosition, "left horizontal position is not changed").toEqualValues("left");

    targetRect.left = 200;
    targetRect.right = 220;
    horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 300, "left", windowWidth);
    expect(horizontalPosition, "both directions do not fit: result left").toEqualValues("left");

    targetRect.left = 100;
    targetRect.right = 120;
    horizontalPosition = PopupUtils.updateHorizontalPosition(targetRect, 300, "left", windowWidth);
    expect(horizontalPosition, "both directions do not fit: result right").toEqualValues("right");
  });

  test("Check getCorrectedVerticalDimensions if both directions do not fit", () => {
    let newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(-20, 200, 300, "bottom");
    expect(newVerticalDimensions.height).toLooseEqual(180);
    expect(newVerticalDimensions.top).toLooseEqual(0);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(150, 200, 300, "bottom");
    expect(newVerticalDimensions.height).toLooseEqual(150 - PopupUtils.bottomIndent);
    expect(newVerticalDimensions.top).toLooseEqual(150);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(150, 450, 300, "bottom");
    expect(newVerticalDimensions.height).toLooseEqual(150 - PopupUtils.bottomIndent);
    expect(newVerticalDimensions.top).toLooseEqual(150);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(10, 200, 300, "bottom");
    expect(newVerticalDimensions).toBeFalsy();

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(10, 200, 300, "top");
    expect(newVerticalDimensions.height).toLooseEqual(200);
    expect(newVerticalDimensions.top).toLooseEqual(10);
  });

  test("Check getCorrectedVerticalDimensions if both directions do not fit and canShrink = false", () => {
    let newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(-20, 200, 300, "bottom", false);
    expect(newVerticalDimensions.height).toLooseEqual(200);
    expect(newVerticalDimensions.top).toLooseEqual(0);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(150, 200, 300, "bottom", false);
    expect(newVerticalDimensions.height).toLooseEqual(200);
    expect(newVerticalDimensions.top).toLooseEqual(100 - PopupUtils.bottomIndent);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(150, 450, 300, "bottom", false);
    expect(newVerticalDimensions.height).toLooseEqual(300 - PopupUtils.bottomIndent);
    expect(newVerticalDimensions.top).toLooseEqual(0);

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(10, 200, 300, "bottom", false);
    expect(newVerticalDimensions).toBeFalsy();

    newVerticalDimensions = PopupUtils.getCorrectedVerticalDimensions(10, 200, 300, "top", false);
    expect(newVerticalDimensions.height).toLooseEqual(200);
    expect(newVerticalDimensions.top).toLooseEqual(10);
  });

  test("Check updateHorizontalDimensions", () => {
    let newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-20, 200, 300, "center");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center - fitting left out - width").toLooseEqual(200);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center - fitting left out - left").toLooseEqual(0);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-100, 300, 250, "center");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center - not-fitting left out - width").toLooseEqual(250);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center - not-fitting left out - left").toLooseEqual(0);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 200, 250, "center");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center - fitting right out - width").toLooseEqual(200);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center - fitting right out - left").toLooseEqual(50);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center - non-fitting right out - width").toLooseEqual(250);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center - non-fitting right out - left").toLooseEqual(0);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-20, 200, 300, "left");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - left - left out - width").toLooseEqual(200);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - left - left out - left").toLooseEqual(0);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 250, 300, "right");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - right - right out - width").toLooseEqual(200);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - right - right out - left").toLooseEqual(100);
  });
  test("Check updateHorizontalDimensions with margins positionMode is flex", () => {
    let newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center", "flex", { left: 10, right: 15 });
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center+flex - non-fitting right out - width").toLooseEqual(225);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center+flex - non-fitting right out - left").toLooseEqual(10);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(-20, 200, 300, "left", "flex", { left: 10, right: 15 });
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - left+flex - left out - width").toLooseEqual(200);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - left+flex - left out - left").toLooseEqual(10);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 250, 300, "right", "flex", { left: 10, right: 15 });
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - right+flex - right out - width").toLooseEqual(175);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - right+flex - right out - left").toLooseEqual(100);
  });

  test("Check updateHorizontalDimensions positionMode is fixed", () => {
    let newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center", "fixed", { left: 10, right: 15 });
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center+fixed - non-fitting right out - width").toLooseEqual(125);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center+fixed - non-fitting right out - left").toLooseEqual(90);

    newHorizontalDimensions = PopupUtils.updateHorizontalDimensions(100, 300, 250, "center", "fixed");
    expect(newHorizontalDimensions.width, "updateHorizontalDimensions - center+fixed - without margin").toLooseEqual(150);
    expect(newHorizontalDimensions.left, "updateHorizontalDimensions - center+fixed - without margin").toLooseEqual(100);
  });

  // Skipped: tablet vs popup display mode depends on matchMedia/screen size detection not provided by jsdom.
  test.skip("PopupModel dropdown displayMode", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.showFooter).toLooseEqual(false);
    expect(viewModel.styleClass).toLooseEqual("sv-popup--menu-popup sv-popup--show-pointer sv-popup--left");
    model.displayMode = "overlay";
    expect(viewModel.styleClass).toLooseEqual("sv-popup--menu-popup");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: overlay display mode depends on matchMedia/screen size detection not provided by jsdom.
  test.skip("PopupModel displayMode overlay and overlayDisplayMode", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    expect(viewModel.showFooter).toLooseEqual(false);
    expect(model.overlayDisplayMode).toLooseEqual("auto");

    expect(viewModel.styleClass, "default").toLooseEqual("sv-popup--menu-popup sv-popup--show-pointer sv-popup--left");
    model.displayMode = "overlay";
    expect(viewModel.styleClass, "overlayDisplayMode auto").toLooseEqual("sv-popup--menu-popup");

    model.overlayDisplayMode = "dropdown-overlay";
    expect(viewModel.styleClass, "overlayDisplayMode dropdown-overlay").toLooseEqual("sv-popup--menu-phone");

    model.overlayDisplayMode = "tablet-dropdown-overlay";
    expect(viewModel.styleClass, "overlayDisplayMode tablet-dropdown-overlay").toLooseEqual("sv-popup--menu-tablet");

    model.overlayDisplayMode = "plain";
    expect(viewModel.styleClass, "overlayDisplayMode plain").toLooseEqual("sv-popup--menu-popup");

    model.overlayDisplayMode = "auto";
    expect(viewModel.styleClass, "overlayDisplayMode auto").toLooseEqual("sv-popup--menu-popup");

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

    expect(viewModel.styleClass).toLooseEqual("sv-popup--modal-popup");
    model.displayMode = "overlay";
    expect(viewModel.styleClass).toLooseEqual("sv-popup--modal-overlay");

    viewModel.dispose();
    targetElement.remove();
  });

  test("PopupModel and locale", () => {
    const model: PopupModel = new PopupModel("sv-list", {});
    const targetElement: HTMLElement = document.createElement("div");
    const viewModel: PopupModalViewModel = createPopupViewModelTest(model, targetElement) as PopupModalViewModel;
    viewModel.initializePopupContainer();
    expect(viewModel.getLocalizationString("modalApplyButtonText"), "en Apply text").toLooseEqual(englishStrings.modalApplyButtonText);
    viewModel.locale = "de";
    expect(viewModel.getLocalizationString("modalApplyButtonText"), "de Apply text").toLooseEqual(germanSurveyStrings.modalApplyButtonText);
    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: position calculation requires real DOM layout not provided by jsdom.
  test.skip("PopupModel top+center position calculate", () => {
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

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = viewModel.container.querySelector(".sv-popup__container") as HTMLElement;
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";
    popupContainer.style.margin = "8px";

    (<any>window).innerHeight = 2000;
    (<any>window).innerWidth = 2000;
    viewModel.updateOnShowing();
    expect(viewModel.left).toLooseEqual((1000 - 200 / 2 - 8 + 32 / 2) + "px");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: position calculation requires real DOM layout not provided by jsdom.
  test.skip("PopupModel top+left position calculate", () => {
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

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";
    popupContainer.style.margin = "8px";

    (<any>window).innerHeight = 2000;
    (<any>window).innerWidth = 2000;
    viewModel.updateOnShowing();
    expect(viewModel.pointerTarget.left).toLooseEqual("200px");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: width calculation requires real DOM layout not provided by jsdom.
  test.skip("Fixed PopupModel width calculate setWidthByTarget = false", () => {
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

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "700px";
    popupContainer.style.height = "400px";

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toLooseEqual("auto");
    expect(viewModel.width, "width").toLooseEqual("auto");
    expect(viewModel.left, "left").toLooseEqual("200px");
    expect(viewModel.top, "top").toLooseEqual("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: width calculation requires real DOM layout not provided by jsdom.
  test.skip("Fixed PopupModel width calculate if short content setWidthByTarget = false", () => {
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

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toLooseEqual("auto");
    expect(viewModel.width, "width").toLooseEqual("auto");
    expect(viewModel.left, "left").toLooseEqual("200px");
    expect(viewModel.top, "top").toLooseEqual("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: width calculation requires real DOM layout not provided by jsdom.
  test.skip("Fixed PopupModel width calculate and overflow content position calculate setWidthByTarget = false", () => {
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

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "1500px";
    popupContainer.style.height = "400px";

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toLooseEqual("auto");
    expect(viewModel.width, "width").toLooseEqual("800px");
    expect(viewModel.left, "left").toLooseEqual("200px");
    expect(viewModel.top, "top").toLooseEqual("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: width calculation requires real DOM layout not provided by jsdom.
  test.skip("Fixed PopupModel width calculate", () => {
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

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "700px";
    popupContainer.style.height = "400px";

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toLooseEqual("560px");
    expect(viewModel.width, "width").toLooseEqual("560px");
    expect(viewModel.left, "left").toLooseEqual("200px");
    expect(viewModel.top, "top").toLooseEqual("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: width calculation requires real DOM layout not provided by jsdom.
  test.skip("Fixed PopupModel width calculate if short content", () => {
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

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toLooseEqual("560px");
    expect(viewModel.width, "width").toLooseEqual("560px");
    expect(viewModel.left, "left").toLooseEqual("200px");
    expect(viewModel.top, "top").toLooseEqual("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: width calculation requires real DOM layout not provided by jsdom.
  test.skip("Fixed PopupModel width calculate and overflow content position calculate", () => {
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

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = getPopupContainer(viewModel.container);
    popupContainer.style.width = "1500px";
    popupContainer.style.height = "400px";

    (<any>window).innerWidth = 1000;
    (<any>window).innerHeight = 800;
    model.toggleVisibility();
    viewModel.updateOnShowing();
    expect(viewModel.minWidth, "minWidth").toLooseEqual("560px");
    expect(viewModel.width, "width").toLooseEqual("560px");
    expect(viewModel.left, "left").toLooseEqual("200px");
    expect(viewModel.top, "top").toLooseEqual("178px");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: hide animation depends on real DOM layout not provided by jsdom.
  test.skip("PopupViewModel updateOnHiding", () => {
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

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;
    let popupContainer = viewModel.container.querySelector(".sv-popup__container") as HTMLElement;
    popupContainer.style.width = "550px";
    popupContainer.style.height = "400px";

    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.height).toLooseEqual("auto");
    expect(viewModel.width).toLooseEqual("auto");

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

    expect(trace).toLooseEqual("->onShow");
    expect(viewModel.isVisible).toLooseEqual(true);
    expect(viewModel.top, "onShow top").not.toLooseEqual("0px");
    expect(viewModel.left, "onShow left").not.toLooseEqual("0px");
    expect(viewModel.height, "onShow height").not.toLooseEqual("auto");
    expect(viewModel.width, "onShow width").not.toLooseEqual("auto");
    trace = "";

    model.toggleVisibility();
    expect(trace).toLooseEqual("->onHide");
    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top, "onHide top").toLooseEqual("0px");
    expect(viewModel.left, "onHide left").toLooseEqual("0px");
    expect(viewModel.height, "onHide height").toLooseEqual("auto");
    expect(viewModel.width, "onHide width").toLooseEqual("auto");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: hide animation depends on real DOM layout not provided by jsdom.
  test.skip("PopupViewModel updateOnHiding displayMode = overlay", () => {
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
    expect(viewModel.styleClass).toLooseEqual("sv-popup--menu-popup");

    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top).toLooseEqual("0px");
    expect(viewModel.left).toLooseEqual("0px");
    expect(viewModel.height).toLooseEqual("auto");
    expect(viewModel.width).toLooseEqual("auto");

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

    expect(trace).toLooseEqual("->onShow");
    expect(viewModel.isVisible).toLooseEqual(true);
    expect(viewModel.top, "onShow top").toLooseEqual("");
    expect(viewModel.left, "onShow left").toLooseEqual("");
    expect(viewModel.height, "onShow height").toLooseEqual("");
    expect(viewModel.width, "onShow width").toLooseEqual("");
    trace = "";

    model.toggleVisibility();
    expect(trace).toLooseEqual("->onHide");
    expect(viewModel.isVisible).toLooseEqual(false);
    expect(viewModel.top, "onHide top").toLooseEqual("0px");
    expect(viewModel.left, "onHide left").toLooseEqual("0px");
    expect(viewModel.height, "onHide height").toLooseEqual("auto");
    expect(viewModel.width, "onHide width").toLooseEqual("auto");

    viewModel.dispose();
    targetElement.remove();
  });

  // Skipped: scroll prevention depends on real DOM scroll events not provided by jsdom.
  test.skip("Check that modal popup prevents scroll outside", () => {
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
    viewModel.setComponentElement(container);
    model.isVisible = true;
    viewModel.updateOnShowing();
    expect(subscribeLog).toLooseEqual("->subscribed");

    let event = new WheelEvent("wheel", { deltaY: 20, cancelable: true });
    wrapEvent(event);
    container.dispatchEvent(event);
    expect(eventLog, "prevented scroll when not scrolling inside").toLooseEqual("->prevented");

    eventLog = "";
    event = new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true });
    wrapEvent(event);
    container.children[0].children[0].dispatchEvent(event);
    expect(eventLog, "scroll inside (not prevented)").toLooseEqual("");

    eventLog = "";
    event = new WheelEvent("wheel", { deltaY: -20, bubbles: true, cancelable: true });
    wrapEvent(event);
    container.children[0].scrollTo(0, 20);
    container.children[0].children[0].dispatchEvent(event);
    expect(eventLog, "scroll inside (not prevented)").toLooseEqual("");

    eventLog = "";
    event = new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true });
    wrapEvent(event);
    container.children[0].scrollTo(0, 150);
    container.children[0].children[0].dispatchEvent(event);
    expect(eventLog, "scroll inside (not prevented)").toLooseEqual("");

    eventLog = "";
    event = new WheelEvent("wheel", { deltaY: -20, bubbles: true, cancelable: true });
    wrapEvent(event);
    container.children[0].scrollTo(0, 0);
    container.children[0].children[0].dispatchEvent(event);
    expect(eventLog, "overscroll inside (prevented)").toLooseEqual("->prevented");

    eventLog = "";
    event = new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true });
    wrapEvent(event);
    container.children[0].scrollTo(0, 200);
    container.children[0].children[0].dispatchEvent(event);
    expect(eventLog, "overscroll inside (prevented)").toLooseEqual("->prevented");

    model.toggleVisibility();
    expect(subscribeLog).toLooseEqual("->subscribed->unsubscribed");

    container.remove();
  });
  // Skipped: translate/transform offsets require real DOM layout not provided by jsdom.
  test.skip("PopupModel into modal window with translate/transform", () => {
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

    const viewModel: PopupDropdownViewModel = createPopupViewModelTest(model, targetElement) as PopupDropdownViewModel;
    viewModel.initializePopupContainer();
    viewModel.container.innerHTML = popupTemplate;

    let popupContainer = viewModel.container.querySelector(".sv-popup__container") as HTMLElement;
    popupContainer.style.width = "200px";
    popupContainer.style.height = "400px";

    let fixedPopupContainer = viewModel.container.querySelector(".sv-popup") as HTMLElement;
    fixedPopupContainer.getBoundingClientRect = () => {
      return <DOMRect>{ "x": 100, "y": 200, "width": 1920, "height": 0, "top": 200, "right": 2097, "bottom": 200, "left": 100 };
    };

    (<any>window).innerHeight = 2000;
    (<any>window).innerWidth = 2000;
    viewModel.updateOnShowing();
    expect(viewModel.top, "top").toLooseEqual(174 + "px");
    expect(viewModel.left, "left").toLooseEqual(66 + "px");

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
    expect(logger.log, "correct order of updates when entering").toLooseEqual("->model:isVisible:true->viewModel:isVisible:true->onEnter");
    expect(viewModel.getAnimation().passedEnterClass, "correct css classes passed to animation's onEnter").toEqualValues("sv-popup--enter");
    logger.log = "";
    model.isVisible = false;
    expect(logger.log, "correct order of updates when leaving").toLooseEqual("->model:isVisible:false->onLeave->viewModel:isVisible:false");
    expect(viewModel.getAnimation().passedLeaveClass, "correct css classes passed to animation's onLeave").toEqualValues("sv-popup--leave");
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
    expect(logger.log, "correct order of updates when entering without animation").toLooseEqual("->model:isVisible:true->viewModel:isVisible:true");
    logger.log = "";
    model.isVisible = false;
    expect(logger.log, "correct order of updates when leaving without animation").toLooseEqual("->model:isVisible:false->viewModel:isVisible:false");
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
    expect(logger.log, "correct order of updates when entering without animation").toLooseEqual("->model:isVisible:true->viewModel:isVisible:true");
    logger.log = "";
    model.isVisible = false;
    expect(logger.log, "correct order of updates when leaving without animation").toLooseEqual("->model:isVisible:false->viewModel:isVisible:false");
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
    return new Promise(function(resolve) {
      let __remaining = 6;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const done1 = __done;
      const done2 = __done;
      const done3 = __done;
      const done4 = __done;
      const done5 = __done;
      const done6 = __done;

      settings.animationEnabled = true;
      const animationTimeOut = 1;
      const oldQueueMicrotask = window.queueMicrotask;
      window.queueMicrotask = (callback) => { setTimeout(() => callback(), animationTimeOut); };

      let log = "";
      const items: Array<Action> = [new Action({ id: "test", action: () => { } })];
      const listModel = new ListModel(items, () => { model.isVisible = false; }, true);

      const originalRefresh = ListModel.prototype["refresh"];
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
      expect(log).toLooseEqual("");

      model.isVisible = true;
      setTimeout(() => {
        expect(log, "popup show").toLooseEqual("onShow:(viewModel.isVisible == false)->onVisibilityChanged:(viewModel.isVisible == true)->");

        log = "";
        model.isVisible = false;
        setTimeout(() => {
          expect(log, "popup hide").toLooseEqual("onVisibilityChanged:(viewModel.isVisible == false)->listModel.refresh->onHide:(viewModel.isVisible == false)");

          model.isVisible = true;
          setTimeout(() => {
            log = "";
            listModel.onItemClick(items[0]);
            setTimeout(() => {
              expect(log, "item click").toLooseEqual("onVisibilityChanged:(viewModel.isVisible == false)->listModel.refresh->onHide:(viewModel.isVisible == false)");

              model.isVisible = true;
              setTimeout(() => {
                log = "";
                viewModel.cancel();
                setTimeout(() => {
                  expect(log, "click cancel").toLooseEqual("onCancel->onVisibilityChanged:(viewModel.isVisible == false)->listModel.refresh->onHide:(viewModel.isVisible == false)");

                  log = "";
                  model.dispose();
                  expect(log).toLooseEqual("onDispose");

                  settings.animationEnabled = false;
                  window.queueMicrotask = oldQueueMicrotask;

                  done6();
                }, animationTimeOut + 1);
                done5();
              }, animationTimeOut + 1);
              done4();
            }, animationTimeOut + 1);
            done3();
          }, animationTimeOut + 1);
          done2();
        }, animationTimeOut + 1);
        done1();
      }, animationTimeOut + 1);
    });
  });
});
