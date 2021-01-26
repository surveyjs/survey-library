import { PopupUtils } from "../../src/knockout/components/popup/popup-utils";
import { PopupModel, PopupViewModel } from "../../src/knockout/components/popup/popup";
import { ListViewModel } from "../../src/knockout/components/list/list";
import ko from "knockout";

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

QUnit.test("PopupModel defaults", (assert) => {
  const data = {};
  const model: PopupModel = new PopupModel(
    "sv-list",
    data,
    "template-name"
  );

  assert.equal(model.contentComponentName, "sv-list");
  assert.equal(model.contentComponentData, data);
  assert.equal(model.contentTemplateName, "template-name");
  assert.equal(model.verticalPosition, "bottom");
  assert.equal(model.horizontalPosition, "left");
  assert.equal(model.showPointer, true);
  assert.equal(model.isModal, false);
  assert.equal(typeof model.onCancel, "function");
  assert.equal(typeof model.onApply, "function");
  assert.equal(typeof model.onHide, "function");
  assert.equal(typeof model.onShow, "function");
  assert.equal(model.cssClass, "");
  assert.equal(typeof model.onToggleVisibility, "undefined");
});

QUnit.test("PopupModel toggleVisibility", (assert) => {
  const data = {};
  const model: PopupModel = new PopupModel(
    "sv-list",
    data,
    "template-name"
  );

  let trace = "";

  model.toggleVisibility();
  assert.equal(trace, "");

  model.onToggleVisibility = () => {
    trace += "->onToggleVisibility";
  };

  model.toggleVisibility();
  assert.equal(trace, "->onToggleVisibility");
});

QUnit.test("PopupViewModel defaults", (assert) => {
  const listModel: ListViewModel = new ListViewModel([], () => {}, false);
  const data = {};
  const model: PopupModel = new PopupModel(
    "sv-list",
    data,
    ""
  );

  const targetElement: HTMLElement = document.createElement('div');
  const viewModel: PopupViewModel = new PopupViewModel(
    model,
    targetElement
  );

  assert.equal(viewModel.contentComponentName, "sv-list");
  assert.equal(viewModel.contentComponentData, data);
  assert.equal(viewModel.contentTemplateName, "");
  assert.equal(viewModel.verticalPosition, "bottom");
  assert.equal(viewModel.horizontalPosition, "left");
  assert.equal(viewModel.showPointer, true);
  assert.equal(viewModel.isModal, false);
  assert.equal(typeof viewModel.onCancel, "function");
  assert.equal(typeof viewModel.onApply, "function");
  assert.equal(typeof viewModel.onHide, "function");
  assert.equal(typeof viewModel.onShow, "function");
  assert.equal(viewModel.cssClass, "");

  assert.equal(ko.isWritableObservable(viewModel.top), true);
  assert.equal(viewModel.top(), undefined);
  assert.equal(ko.isWritableObservable(viewModel.left), true);
  assert.equal(viewModel.left(), undefined);
  assert.equal(ko.isWritableObservable(viewModel.popupDirection), true);
  assert.equal(viewModel.popupDirection(), undefined);
  assert.equal(ko.isWritableObservable(viewModel.pointerTarget), true);
  assert.deepEqual(viewModel.pointerTarget(), {});
  assert.equal(ko.isWritableObservable(viewModel.isVisible), true);
  assert.equal(viewModel.isVisible(), false);

  const container: HTMLElement = viewModel["container"];
  assert.equal(!!container, true);
  assert.equal(container.tagName, "DIV");
  assert.equal(container.innerHTML.indexOf("<div class=\"sv-popup\""), 0);
  assert.equal(container.parentElement.tagName, "BODY");
  
  const showSubscription: ko.Subscription = viewModel["showSubscription"];
  assert.equal(!!showSubscription, true);

  assert.equal(viewModel.applyButtonText, "Apply");
  assert.equal(viewModel.cancelButtonText, "Cancel");
});

QUnit.test("PopupViewModel styleClass", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "");
  const targetElement: HTMLElement = document.createElement('div');
  const viewModel: PopupViewModel = new PopupViewModel(model, targetElement);

  assert.equal(viewModel.styleClass, " sv-popup--show-pointer sv-popup--undefined");
  model.cssClass = "my-css-class";
  assert.equal(viewModel.styleClass, "my-css-class sv-popup--show-pointer sv-popup--undefined");

  viewModel.popupDirection("down");
  assert.equal(viewModel.styleClass, "my-css-class sv-popup--show-pointer sv-popup--down");

  model.showPointer = false;
  assert.equal(viewModel.styleClass, "my-css-class");
});

QUnit.test("PopupViewModel isVisible", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "");
  const targetElement: HTMLElement = document.createElement('div');
  const viewModel: PopupViewModel = new PopupViewModel(model, targetElement);

  assert.equal(viewModel.isVisible(), false);
  assert.equal(viewModel.top(), undefined);
  assert.equal(viewModel.left(), undefined);
  assert.equal(viewModel.popupDirection(), undefined);
  assert.deepEqual(viewModel.pointerTarget(), {});

  let trace: String = "";
  model.onHide = () => {
    trace += "->onHide";
  };
  model.onShow = () => {
    trace += "->onShow";
  };

  //model.toggleVisibility();
  viewModel.isVisible(!viewModel.isVisible());
  assert.equal(trace, "->onShow");
  assert.equal(viewModel.isVisible(), true);
  assert.equal(viewModel.top(), 0);
  assert.equal(viewModel.left() === 0, false);
  assert.equal(viewModel.popupDirection(), "left");
  assert.equal(viewModel.pointerTarget()["left"] === 0, false);
  assert.equal(viewModel.pointerTarget()["top"] === 0, true);
  trace = "";

  //model.toggleVisibility();
  viewModel.isVisible(!viewModel.isVisible());
  assert.equal(trace, "->onHide");
  assert.equal(viewModel.isVisible(), false);
  assert.equal(viewModel.top(), 0);
  assert.equal(viewModel.left() === 0, false);
  assert.equal(viewModel.popupDirection(), "left");
  assert.equal(viewModel.pointerTarget()["left"] === 0, false);
  assert.equal(viewModel.pointerTarget()["top"] === 0, true);
});

QUnit.test("PopupModel toggleVisibility", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "");
  const targetElement: HTMLElement = document.createElement('div');
  const viewModel: PopupViewModel = new PopupViewModel(model, targetElement);

  assert.equal(viewModel.isVisible(), false);
  assert.equal(viewModel.top(), undefined);
  assert.equal(viewModel.left(), undefined);
  assert.equal(viewModel.popupDirection(), undefined);
  assert.deepEqual(viewModel.pointerTarget(), {});

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
  assert.equal(viewModel.isVisible(), true);
  assert.equal(viewModel.top(), 0);
  assert.equal(viewModel.left() === 0, false);
  assert.equal(viewModel.popupDirection(), "left");
  assert.equal(viewModel.pointerTarget()["left"] === 0, false);
  assert.equal(viewModel.pointerTarget()["top"] === 0, true);
  trace = "";

  model.toggleVisibility();
  //viewModel.isVisible(!viewModel.isVisible());
  assert.equal(trace, "->onHide");
  assert.equal(viewModel.isVisible(), false);
  assert.equal(viewModel.top(), 0);
  assert.equal(viewModel.left() === 0, false);
  assert.equal(viewModel.popupDirection(), "left");
  assert.equal(viewModel.pointerTarget()["left"] === 0, false);
  assert.equal(viewModel.pointerTarget()["top"] === 0, true);
});

QUnit.test("PopupModel clickOutside", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "");
  const targetElement: HTMLElement = document.createElement('div');
  const viewModel: PopupViewModel = new PopupViewModel(model, targetElement);

  assert.equal(viewModel.isVisible(), false);
  assert.equal(viewModel.top(), undefined);
  assert.equal(viewModel.left(), undefined);
  assert.equal(viewModel.popupDirection(), undefined);
  assert.deepEqual(viewModel.pointerTarget(), {});

  let trace: String = "";
  model.onHide = () => {
    trace += "->onHide";
  };
  model.onShow = () => {
    trace += "->onShow";
  };

  viewModel.clickOutside();
  assert.equal(trace, "");
  assert.equal(viewModel.isVisible(), false);
  assert.equal(viewModel.top(), undefined);
  assert.equal(viewModel.left(), undefined);
  assert.equal(viewModel.popupDirection(), undefined);
  assert.deepEqual(viewModel.pointerTarget(), {});
  trace = "";

  viewModel.isVisible(!viewModel.isVisible());
  trace = "";
  viewModel.clickOutside();
  assert.equal(trace, "->onHide");
  assert.equal(viewModel.isVisible(), false);
  assert.equal(viewModel.top(), 0);
  assert.equal(viewModel.left() === 0, false);
  assert.equal(viewModel.popupDirection(), "left");
  assert.equal(viewModel.pointerTarget()["left"] === 0, false);
  assert.equal(viewModel.pointerTarget()["top"] === 0, true);
  trace = "";

  model.isModal = true;
  viewModel.isVisible(!viewModel.isVisible());
  trace = "";
  viewModel.clickOutside();
  assert.equal(trace, "");
  assert.equal(viewModel.isVisible(), true);
  assert.equal(viewModel.top(), 0);
  assert.equal(viewModel.left() === 0, false);
  assert.equal(viewModel.popupDirection(), "left");
  assert.equal(viewModel.pointerTarget()["left"] === 0, false);
  assert.equal(viewModel.pointerTarget()["top"] === 0, true);
  trace = "";
});

QUnit.test("PopupModel cancel", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "");
  const targetElement: HTMLElement = document.createElement('div');
  const viewModel: PopupViewModel = new PopupViewModel(model, targetElement);

  assert.equal(viewModel.isVisible(), false);

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
  assert.equal(viewModel.isVisible(), false);
  trace = "";

  viewModel.isVisible(!viewModel.isVisible());
  trace = "";
  viewModel.cancel();
  assert.equal(trace, "->onCancel->onHide");
  assert.equal(viewModel.isVisible(), false);
  trace = "";

  model.isModal = true;
  viewModel.isVisible(!viewModel.isVisible());
  trace = "";
  viewModel.cancel();
  assert.equal(trace, "->onCancel->onHide");
  assert.equal(viewModel.isVisible(), false);
  trace = "";
});

QUnit.test("PopupModel apply", (assert) => {
  const model: PopupModel = new PopupModel("sv-list", {}, "");
  const targetElement: HTMLElement = document.createElement('div');
  const viewModel: PopupViewModel = new PopupViewModel(model, targetElement);

  assert.equal(viewModel.isVisible(), false);

  let trace: String = "";
  model.onApply = () => {
    trace += "->onApply";
  };
  model.onHide = () => {
    trace += "->onHide";
  };
  model.onShow = () => {
    trace += "->onShow";
  };

  viewModel.apply();
  assert.equal(trace, "->onApply");
  assert.equal(viewModel.isVisible(), false);
  trace = "";

  viewModel.isVisible(!viewModel.isVisible());
  trace = "";
  viewModel.apply();
  assert.equal(trace, "->onApply->onHide");
  assert.equal(viewModel.isVisible(), false);
  trace = "";

  model.isModal = true;
  viewModel.isVisible(!viewModel.isVisible());
  trace = "";
  viewModel.apply();
  assert.equal(trace, "->onApply->onHide");
  assert.equal(viewModel.isVisible(), false);
  trace = "";
});

QUnit.test("PopupViewModel dispose", (assert) => {
  const listModel: ListViewModel = new ListViewModel([], () => {}, false);
  const data = {};
  const model: PopupModel = new PopupModel(
    "sv-list",
    data,
    ""
  );

  const targetElement: HTMLElement = document.createElement('div');
  const viewModel: PopupViewModel = new PopupViewModel(
    model,
    targetElement
  );

  const container: HTMLElement = viewModel["container"];

  viewModel.dispose();

  let trace: String = "";
  model.onHide = () => {
    trace += "->onHide";
  };
  model.onShow = () => {
    trace += "->onShow";
  };

  model.toggleVisibility();
  viewModel.isVisible(!viewModel.isVisible());
  assert.equal(trace, "");
  assert.equal(!!viewModel["showSubscription"], false);

  assert.equal(!!viewModel["container"], false);
  assert.equal(container.tagName, "DIV");
  assert.equal(container.innerHTML.indexOf("<div class=\"sv-popup\""), 0);
  assert.equal(container.parentElement, undefined);
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
      "right"
    ),
    { left: 60, top: 35 }
  );
});
