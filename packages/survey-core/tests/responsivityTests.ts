import { Action } from "../src/actions/action";
import { AdaptiveActionContainer, AdaptiveContainerUpdateOptions, UpdateResponsivenessMode } from "../src/actions/adaptive-container";
import { ActionContainer } from "../src/actions/container";
import { ResponsivityManager, VerticalResponsivityManager } from "../src/utils/responsivity-manager";

import { describe, test, expect } from "vitest";
class SimpleContainer {
  clientRects = [{ x: 0, y: 0, height: 20, width: 20 }];
  parentElement: any;
  constructor(config: any) {
    (<any>Object).assign(this, config);
    this.parentElement = this;
  }
  offsetWidth = 20;
  offsetHeight = 20;
  getClientRects() {
    return this.clientRects;
  }
  querySelector(query: string) {

  }
  querySelectorAll(query: string) {
    return [];
  }
  classList = {
    contains() {
      return false;
    }
  };
}
class ResizeObserver {
  constructor(private callback: () => void) {}
  observe() { }
  disconnect() { }
  run() {
    this.callback && this.callback();
  }
}
window.ResizeObserver = <any>ResizeObserver;

test("ActionContainer: renderedActions & visibleActions", () => {
  const actions = [new Action({ id: "first" }), new Action({ id: "second", visible: false }), new Action({ id: "third" })];

  const actionContainer: ActionContainer = new ActionContainer();
  actionContainer.actions = actions;

  actionContainer.flushUpdates();

  expect(actionContainer.visibleActions.length, "actionContainer visibleActions").toLooseEqual(2);
  expect(actionContainer.renderedActions.length, "actionContainer renderedActions").toLooseEqual(2);

  const adaptiveContainer: AdaptiveActionContainer = new AdaptiveActionContainer();
  adaptiveContainer.actions = actions;

  adaptiveContainer.flushUpdates();

  expect(adaptiveContainer.visibleActions.length, "adaptiveContainer visibleActions").toLooseEqual(2);
  expect(adaptiveContainer.renderedActions.length, "adaptiveContainer renderedActions").toLooseEqual(3);
  expect(adaptiveContainer.renderedActions[2].id.indexOf("dotsItem-id"), "dotsItem-id exists").toLooseEqual(0);
});

test("ActionContainer: renderedActions & visibleActions if only one element", () => {
  const actions = [new Action({ id: "first" })];

  const actionContainer: ActionContainer = new ActionContainer();
  actionContainer.actions = actions;

  actionContainer.flushUpdates();

  expect(actionContainer.visibleActions.length, "actionContainer visibleActions").toLooseEqual(1);
  expect(actionContainer.renderedActions.length, "actionContainer renderedActions").toLooseEqual(1);

  const adaptiveContainer: AdaptiveActionContainer = new AdaptiveActionContainer();
  adaptiveContainer.actions = actions;

  adaptiveContainer.flushUpdates();

  expect(adaptiveContainer.visibleActions.length, "adaptiveContainer visibleAction without icon").toLooseEqual(1);
  expect(adaptiveContainer.renderedActions.length, "adaptiveContainer renderedActions contains the dots item").toLooseEqual(2);

  actions[0].iconName = "icon-name";
  expect(adaptiveContainer.visibleActions.length, "adaptiveContainer visibleActions with icon").toLooseEqual(1);
  expect(adaptiveContainer.renderedActions.length, "adaptiveContainer renderedActions doesn't contain dots item").toLooseEqual(1);
});

test("Fit items", () => {
  const itemSmallWidth = 48;
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.dotsItem.maxDimension = itemSmallWidth;
  model.dotsItem.minDimension = itemSmallWidth;
  const item1 = new Action(<any>{});
  item1.minDimension = itemSmallWidth;
  item1.maxDimension = 50;
  model.actions.push(item1);
  const item2 = new Action(<any>{});
  item2.minDimension = itemSmallWidth;
  item2.maxDimension = 200;
  model.actions.push(item2);
  const item3 = new Action({ id: "invisible", visible: false });
  item3.minDimension = 50;
  item3.maxDimension = 100;
  model.actions.push(item3);

  model.flushUpdates();

  expect(model.actions.length).toLooseEqual(3);
  expect(model.visibleActions.length).toLooseEqual(2);
  expect(model.renderedActions.length).toLooseEqual(3);

  model.fit({ availableSpace: 300 });
  expect(model.renderedActions.length, "dimension 300").toLooseEqual(3);
  expect(model.renderedActions[0].isVisible, "visible 1").toLooseEqual(true);
  expect(model.renderedActions[1].isVisible, "visible 2").toLooseEqual(true);
  expect(model.renderedActions[2].isVisible, "dots hidden").toLooseEqual(false);
  expect(model.actions[2].isVisible, "invisible 3").toLooseEqual(false);
  expect(model.renderedActions.indexOf(model.actions[2]), "visible = false action is not in rendered actions").toLooseEqual(-1);
  expect(item1.mode, "dimension 300").toLooseEqual("large");
  expect(item2.mode, "dimension 300").toLooseEqual("large");

  model.fit({ availableSpace: 200 });
  expect(model.renderedActions.length, "dimension 200").toLooseEqual(3);
  expect(model.renderedActions[0].isVisible, "visible 1").toLooseEqual(true);
  expect(model.renderedActions[1].isVisible, "visible 2").toLooseEqual(true);
  expect(model.renderedActions[2].isVisible, "dots hidden").toLooseEqual(false);
  expect(model.actions[2].isVisible, "invisible 3").toLooseEqual(false);
  expect(model.renderedActions.indexOf(model.actions[2]), "visible = false action is not in rendered actions").toLooseEqual(-1);
  expect(item1.mode, "dimension 200").toLooseEqual("large");
  expect(item2.mode, "dimension 200").toLooseEqual("small");

  model.fit({ availableSpace: 100 });
  expect(model.renderedActions.length, "dimension 100").toLooseEqual(3);
  expect(model.renderedActions[0].isVisible, "visible 1").toLooseEqual(true);
  expect(model.renderedActions[1].isVisible, "visible 2").toLooseEqual(true);
  expect(model.renderedActions[2].isVisible, "dots hidden").toLooseEqual(false);
  expect(model.actions[2].isVisible, "invisible 3").toLooseEqual(false);
  expect(model.renderedActions.indexOf(model.actions[2]), "visible = false action is not in rendered actions").toLooseEqual(-1);
  expect(item1.mode, "dimension 100").toLooseEqual("large");
  expect(item2.mode, "dimension 100").toLooseEqual("small");

  model.fit({ availableSpace: 50 });
  expect(model.renderedActions.length, "dimension 50").toLooseEqual(3);
  expect(model.renderedActions[0].isVisible, "hidden 1").toLooseEqual(false);
  expect(model.renderedActions[1].isVisible, "hidden 2").toLooseEqual(false);
  expect(model.renderedActions[2].isVisible, "dots visible").toLooseEqual(true);
  expect(model.renderedActions[2].iconName, "dimension 50").toLooseEqual("icon-more");
  expect(model.actions[2].isVisible, "invisible 3").toLooseEqual(false);
  expect(model.renderedActions.indexOf(model.actions[2]), "visible = false action is not in rendered actions").toLooseEqual(-1);
  expect(item1.mode, "dimension 50").toLooseEqual("popup");
  expect(item2.mode, "dimension 50").toLooseEqual("popup");

  item2.disableShrink = true;
  model.fit({ availableSpace: 248 });
  expect(model.renderedActions.length, "dimension 100").toLooseEqual(3);
  expect(model.renderedActions[0].isVisible, "visible 1").toLooseEqual(true);
  expect(model.renderedActions[1].isVisible, "visible 2").toLooseEqual(true);
  expect(model.renderedActions[2].isVisible, "dots hidden").toLooseEqual(false);
  expect(model.actions[2].isVisible, "invisible 3").toLooseEqual(false);
  expect(model.renderedActions.indexOf(model.actions[2]), "visible = false action is not in rendered actions").toLooseEqual(-1);
  expect(item1.mode, "dimension 248").toLooseEqual("small");
  expect(item2.mode, "dimension 248 unshrinkable").toLooseEqual("large");

});

test("Fit items - hide items with priority", () => {
  const itemSmallWidth = 15;
  const itemLargeWidth = 50;
  const dotsItemSize = 10;
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.dotsItem.minDimension = dotsItemSize;
  model.dotsItem.maxDimension = dotsItemSize;
  const item1 = new Action(<any>{});
  item1.minDimension = itemSmallWidth;
  item1.maxDimension = itemLargeWidth;
  item1.title = "a";
  model.actions.push(item1);
  const item2 = new Action(<any>{});
  item2.minDimension = itemLargeWidth;
  item2.disableShrink = true;
  item2.maxDimension = itemLargeWidth;
  item2.title = "b";
  model.actions.push(item2);
  const item3 = new Action(<any>{});
  item3.minDimension = itemSmallWidth;
  item3.maxDimension = itemLargeWidth;
  item3.title = "c";
  model.actions.push(item3);

  model.flushUpdates();

  expect(model.actions.length).toLooseEqual(3);
  expect(model.visibleActions.length).toLooseEqual(3);

  model.fit({ availableSpace: 300 });
  expect(model.visibleActions.length, "dimension 300").toLooseEqual(3);
  expect(model.visibleActions[0].isVisible, "300 - visible 1").toLooseEqual(true);
  expect(model.visibleActions[1].isVisible, "300 - visible 2").toLooseEqual(true);
  expect(model.visibleActions[2].isVisible, "300 - visible 3").toLooseEqual(true);
  expect(model.renderedActions[3].isVisible, "300 - dots hidden").toLooseEqual(false);

  model.fit({ availableSpace: 78 });
  expect(model.visibleActions.length, "dimension 78").toLooseEqual(3);
  expect(model.visibleActions[0].isVisible, "78 - visible 1").toLooseEqual(true);
  expect(model.visibleActions[1].isVisible, "78 - invisible 2").toLooseEqual(true);
  expect(model.visibleActions[2].isVisible, "78 - visible 3").toLooseEqual(false);
  expect(model.renderedActions[3].isVisible, "78 - dots hidden").toLooseEqual(true);

  model.fit({ availableSpace: 29 });
  expect(model.visibleActions.length, "dimension 29").toLooseEqual(3);
  expect(model.visibleActions[0].isVisible, "29 - visible 1").toLooseEqual(true);
  expect(model.visibleActions[1].isVisible, "29 - invisible 2").toLooseEqual(false);
  expect(model.visibleActions[2].isVisible, "29 - visible 3").toLooseEqual(false);
  expect(model.dotsItem.isVisible, "29 - dots visible").toLooseEqual(true);
});

test("getAvailableSpace with content-box test", () => {
  const itemSmallWidth = 48;
  const container: SimpleContainer = new SimpleContainer({
    offsetWidth: 40,
    scrollWidth: itemSmallWidth,
    querySelectorAll: () => [{ offsetWidth: itemSmallWidth }],
  });
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const manager: ResponsivityManager = new ResponsivityManager(
    <any>container,
    <any>model
  );
  (<any>manager.getComputedStyle) = () => {
    return { boxSizing: "content-box", paddingLeft: 5, paddingRight: 5 };
  };
  expect(manager["getAvailableSpace"]()).toLooseEqual(40);
});

test("getAvailableSpace with border-box test", () => {
  const itemSmallWidth = 48;
  const container: SimpleContainer = new SimpleContainer({
    offsetWidth: 40,
    scrollWidth: itemSmallWidth,
    querySelectorAll: () => [{ offsetWidth: itemSmallWidth }],
  });
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const manager: ResponsivityManager = new ResponsivityManager(
    <any>container,
    <any>model
  );
  (<any>manager.getComputedStyle) = () => {
    return { boxSizing: "border-box", paddingLeft: 5, paddingRight: 5 };
  };
  expect(manager["getAvailableSpace"]()).toLooseEqual(30);
});
test("Ignore space for invisible items", () => {
  const itemSmallWidth = 48;
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const item1 = new Action({ id: "item1" });
  item1.minDimension = itemSmallWidth;
  item1.maxDimension = itemSmallWidth;
  const item2 = new Action({ id: "item2", visible: false });
  item2.minDimension = itemSmallWidth;
  item2.maxDimension = itemSmallWidth;
  model.actions.push(item1);
  model.actions.push(item2);
  model.fit({ availableSpace: 50 });
  expect(item1.mode).toLooseEqual("large");
});

export class TestAdaptiveActionContainer extends AdaptiveActionContainer {
  updateCallback: (isResetInitialized: boolean) => void;
  protected update(options: AdaptiveContainerUpdateOptions): void {
    if (!!options.updateResponsivenessMode) {
      this.updateCallback && this.updateCallback(options.updateResponsivenessMode == UpdateResponsivenessMode.Hard);
    }
  }
}

test("Action container: updateCallback test", () => {
  let isRaised = false;
  let currentIsInitialized = false;
  const model: TestAdaptiveActionContainer = new TestAdaptiveActionContainer();
  model.updateCallback = (isResetInitialized) => {
    currentIsInitialized = isResetInitialized;
    isRaised = true;
  };

  expect(isRaised).toLooseEqual(false);
  model.actions = [new Action({ id: "first" })];
  model.flushUpdates();
  expect(isRaised, "container OnSet").toLooseEqual(true);
  expect(currentIsInitialized, "container OnSet").toLooseEqual(true);

  isRaised = false;
  model.actions.push(new Action({ id: "second" }));
  model.flushUpdates();
  expect(isRaised, "container OnPush").toLooseEqual(true);
  expect(currentIsInitialized, "container OnPush").toLooseEqual(true);

  isRaised = false;
  model.actions.splice(1, 1);
  model.flushUpdates();
  expect(isRaised, "container OnRemove").toLooseEqual(true);
  expect(currentIsInitialized, "container OnRemove").toLooseEqual(true);

  isRaised = false;
  model.actions[0].visible = !model.actions[0].visible;
  model.flushUpdates();
  expect(isRaised, "action visible changed").toLooseEqual(true);
  expect(currentIsInitialized, "action visible changed").toLooseEqual(false);
});

test("ResponsivityManager process test", () => {
  const container: SimpleContainer = new SimpleContainer({});
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = ((cb) => { cb(); }) as any;
  model.initResponsivityManager(<any>container);
  const manager: ResponsivityManager = model["responsivityManager"];
  const updateActions = () => {
    model.renderedActions.forEach(action => {
      action.updateModeCallback = (mode, callback) => {
        action.mode = mode;
        const offsetWidth = mode == "small" ? 20 : 100;
        const content = new SimpleContainer({ offsetWidth });
        callback(mode, content as any);
      };
      action.afterRender();
    });
  };
  (<any>manager.getComputedStyle) = () => {
    return { boxSizing: "content-box", paddingLeft: 5, paddingRight: 5 };
  };
  expect(manager["isInitialized"], "before start").toBeFalsy();
  expect(manager["isResizeObserverStarted"]).toBeFalsy();
  let newAction = new Action({ id: "first" });
  expect(newAction.minDimension).toLooseEqual(undefined);
  expect(newAction.maxDimension).toLooseEqual(undefined);
  model.actions.push(newAction);
  model.flushUpdates();
  updateActions();
  expect(manager["isInitialized"], "process is not called after push when ResizeObserver has not started").toBeFalsy();
  expect(manager["isResizeObserverStarted"]).toBeFalsy();
  expect(newAction.minDimension).toLooseEqual(undefined);
  expect(newAction.maxDimension).toLooseEqual(undefined);
  (manager["resizeObserver"] as any).run();
  expect(manager["isInitialized"], "resize observer is started").toBeTruthy();
  expect(manager["isResizeObserverStarted"]).toBeTruthy();
  expect(newAction.minDimension).toLooseEqual(20);
  expect(newAction.maxDimension).toLooseEqual(100);
  newAction = new Action({ id: "second" });
  model.actions.push(newAction);
  model.flushUpdates();
  expect(manager["isInitialized"], "isInitialized should be reset before when item is being pushed").toBeFalsy();
  expect(newAction.minDimension).toLooseEqual(undefined);
  expect(newAction.maxDimension).toLooseEqual(undefined);
  updateActions();
  expect(manager["isInitialized"], "process is called after push when ResizeObserver has already started").toBeTruthy();
  expect(newAction.minDimension).toLooseEqual(20);
  expect(newAction.maxDimension).toLooseEqual(100);
  window.requestAnimationFrame = oldRequestAnimationFrame;
});

test("ResponsivityManager process test: stop when container is invisible", () => {
  const container: SimpleContainer = new SimpleContainer({});
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const manager: ResponsivityManager = new ResponsivityManager(
      <any>container,
      <any>model
  );
  container.offsetHeight = 0;
  container.offsetWidth = 0;
  container.clientRects = [];
  expect(manager["isInitialized"]).toLooseEqual(false);
  manager["process"]();
  expect(manager["isInitialized"]).toLooseEqual(false);
});

test("ResponsivityManager - vertical process", () => {
  const container: SimpleContainer = new SimpleContainer({
    offsetHeight: 100,
  });
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  for (var i = 0; i < 10; i++) {
    model.actions.push(new Action(<any>{}));
  }
  const manager: VerticalResponsivityManager = new VerticalResponsivityManager(
    <any>container,
    <any>model
  );
  const originalGetComputedStyle = (window as any).getComputedStyle;
  (window as any).getComputedStyle = () => {
    return { boxSizing: "border-box", paddingTop: 5, paddingBottom: 5 };
  };

  try {
    model.flushUpdates();

    model.renderedActions.forEach(action => {
      action.updateModeCallback = (mode, callback) => {
        action.mode = mode;
        const offsetHeight = action == model.dotsItem ? 30 : 20;
        const content = new SimpleContainer({ offsetWidth: 20, offsetHeight });
        callback(mode, content as any);
      };
    });
    manager["process"]();
    expect(model.hiddenItemsListModel.actions.length).toLooseEqual(7);
  } finally {
    (window as any).getComputedStyle = originalGetComputedStyle;
  }
});

test("isResponsivenessDisabled", () => {
  const itemSmallWidth = 48;
  const container: SimpleContainer = new SimpleContainer({});
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const manager: VerticalResponsivityManager = new VerticalResponsivityManager(<any>container, <any>model);
  manager["debouncedProcess"] = { run: () => manager["process"](), cancel: () => {} };
  manager["getAvailableSpace"] = () => { return 142; };
  manager["getGap"] = () => { return 0; };
  manager["itemSmallWidth"] = itemSmallWidth;

  model.dotsItem.minDimension = itemSmallWidth;

  const item1 = new Action(<any>{});
  item1.minDimension = itemSmallWidth;
  item1.maxDimension = itemSmallWidth;
  model.actions.push(item1);
  const item2 = new Action(<any>{});
  item2.minDimension = itemSmallWidth;
  item2.maxDimension = 200;
  model.actions.push(item2);
  const item3 = new Action(<any>{});
  item3.minDimension = itemSmallWidth;
  item3.maxDimension = 200;
  model.actions.push(item3);

  model.flushUpdates();

  expect(model.actions.length).toLooseEqual(3);
  expect(model.renderedActions.length).toLooseEqual(4);
  expect(model.isResponsivenessDisabled).toLooseEqual(false);

  manager["isInitialized"] = true;
  manager["process"]();
  expect(model.renderedActions.length, "dimension 300").toLooseEqual(4);
  expect(model.renderedActions[0].isVisible, "visible 1").toLooseEqual(true);
  expect(model.renderedActions[1].isVisible, "invisible 2").toLooseEqual(false);
  expect(model.renderedActions[2].isVisible, "invisible 3").toLooseEqual(false);
  expect(model.renderedActions[3].isVisible, "dots button").toLooseEqual(true);
  expect(item1.mode, "dimension 300").toLooseEqual("small");
  expect(item2.mode, "dimension 300").toLooseEqual("popup");
  expect(item3.mode, "dimension 300").toLooseEqual("popup");

  model.setActionsMode("large");
  model.isResponsivenessDisabled = true;
  manager["process"]();
  expect(model.renderedActions.length, "dimension 300").toLooseEqual(4);
  expect(model.renderedActions[0].isVisible, "visible 1").toLooseEqual(true);
  expect(model.renderedActions[1].isVisible, "visible 2").toLooseEqual(true);
  expect(model.renderedActions[2].isVisible, "visible 3").toLooseEqual(true);

  expect(item1.mode, "dimension 300").toLooseEqual("large");
  expect(item2.mode, "dimension 300").toLooseEqual("large");
  expect(item3.mode, "dimension 300").toLooseEqual("large");
});

test("check disableHide property", () => {
  const itemSmallWidth = 48;
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.dotsItem.minDimension = 0;
  model.dotsItem.maxDimension = 0;
  const item1 = new Action(<any>{});
  item1.minDimension = itemSmallWidth;
  item1.maxDimension = itemSmallWidth;
  model.actions.push(item1);

  const item2 = new Action(<any>{});
  item2.minDimension = itemSmallWidth;
  item2.maxDimension = itemSmallWidth;
  model.actions.push(item2);

  const item3 = new Action(<any>{});
  item3.minDimension = itemSmallWidth;
  item3.maxDimension = itemSmallWidth;
  item3.disableHide = true;
  model.actions.push(item3);

  model.flushUpdates();

  model.fit({ availableSpace: 50 });
  expect(item1.isVisible).toBeFalsy();
  expect(item2.isVisible).toBeFalsy();
  expect(item3.isVisible).toBeTruthy();

  model.fit({ availableSpace: 120 });
  expect(item1.isVisible).toBeTruthy();
  expect(item2.isVisible).toBeFalsy();
  expect(item3.isVisible).toBeTruthy();

  model.fit({ availableSpace: 160 });
  expect(item1.isVisible).toBeTruthy();
  expect(item2.isVisible).toBeTruthy();
  expect(item3.isVisible).toBeTruthy();
});

test("check disableHide property in case of different widths", () => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.dotsItem.minDimension = 0;
  model.dotsItem.maxDimension = 0;
  const item1 = new Action(<any>{});
  item1.minDimension = 50;
  item1.maxDimension = 50;
  model.actions.push(item1);

  const item2 = new Action(<any>{});
  item2.minDimension = 75;
  item2.maxDimension = 75;
  model.actions.push(item2);

  const item3 = new Action(<any>{});
  item3.minDimension = 100;
  item3.maxDimension = 100;
  item3.disableHide = true;
  model.actions.push(item3);

  model.flushUpdates();

  model.fit({ availableSpace: 125 });
  expect(item1.isVisible).toBeFalsy();
  expect(item2.isVisible).toBeFalsy();
  expect(item3.isVisible).toBeTruthy();

  model.fit({ availableSpace: 150 });
  expect(item1.isVisible).toBeTruthy();
  expect(item2.isVisible).toBeFalsy();
  expect(item3.isVisible).toBeTruthy();

  model.fit({ availableSpace: 225 });
  expect(item1.isVisible).toBeTruthy();
  expect(item2.isVisible).toBeTruthy();
  expect(item3.isVisible).toBeTruthy();
});

test("check title change calls raise update", () => {
  const itemSmallWidth = 48;
  const model: TestAdaptiveActionContainer = new TestAdaptiveActionContainer();
  let log = "";
  model.updateCallback = (isResetInitialized: boolean) => {
    log += `->called: ${isResetInitialized}`;
  };
  const item1 = new Action(<any>{});
  item1.minDimension = itemSmallWidth;
  item1.maxDimension = itemSmallWidth;
  model.actions.push(item1);
  model.flushUpdates();
  expect(log, "called from push").toLooseEqual("->called: true");
  expect(item1.needUpdateMaxDimension, "needUpdateMaxDimension is false by default").toBeFalsy();
  item1.title = "Test";
  model.flushUpdates();
  expect(log, "called from title change").toLooseEqual("->called: true->called: false");
  expect(item1.needUpdateMaxDimension, "needUpdateMaxDimension is true when changing title").toBeTruthy();
  item1.title = "Test";
  model.flushUpdates();
  expect(log).toLooseEqual("->called: true->called: false");
});

test("check actions mode is set correctly when disableShrink is set", () => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const action = model.addAction({
    disableShrink: true,
    title: "test"
  });
  expect(action.mode).toLooseEqual("large");
  model.setActionsMode("removed");
  expect(action.mode).toLooseEqual("removed");
  model.setActionsMode("large");
  expect(action.mode).toLooseEqual("large");
  model.setActionsMode("popup");
  expect(action.mode).toLooseEqual("popup");
  model.setActionsMode("small");
  expect(action.mode).toLooseEqual("large");
});

test("Check fit with gap", () => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.dotsItem.minDimension = 50;
  model.dotsItem.maxDimension = 50;
  const item1 = new Action(<any>{});
  item1.minDimension = 50;
  item1.maxDimension = 100;
  model.actions.push(item1);

  const item2 = new Action(<any>{});
  item2.minDimension = 50;
  item2.maxDimension = 100;
  model.actions.push(item2);

  const item3 = new Action(<any>{});
  item3.minDimension = 50;
  item3.maxDimension = 100;
  model.actions.push(item3);

  model.flushUpdates();

  model.fit({ availableSpace: 300, gap: 0 });
  expect(item1.mode, "300 - 0 item1 large").toLooseEqual("large");
  expect(item2.mode, "300 - 0 item2 large").toLooseEqual("large");
  expect(item3.mode, "300 - 0 item3 large").toLooseEqual("large");
  expect(model.dotsItem.isVisible, "300 - 0 dotsItem not visible").toBeFalsy();

  model.fit({ availableSpace: 300, gap: 1 });
  expect(item1.mode, "300 - 1 item1 large").toLooseEqual("large");
  expect(item2.mode, "300 - 1 item2 large").toLooseEqual("large");
  expect(item3.mode, "300 - 1 item3 small").toLooseEqual("small");
  expect(model.dotsItem.isVisible, "300 - 1 dotsItem not visible").toBeFalsy();

  model.fit({ availableSpace: 300, gap: 25 });
  expect(item1.mode, "300 - 25 item1 large").toLooseEqual("large");
  expect(item2.mode, "300 - 25 item2 large").toLooseEqual("large");
  expect(item3.mode, "300 - 25 item3 small").toLooseEqual("small");
  expect(model.dotsItem.isVisible, "300 - 25 dotsItem not visible").toBeFalsy();

  model.fit({ availableSpace: 300, gap: 26 });
  expect(item1.mode, "300 - 26 item1 large").toLooseEqual("large");
  expect(item2.mode, "300 - 26 item2 small").toLooseEqual("small");
  expect(item3.mode, "300 - 26 item3 small").toLooseEqual("small");
  expect(model.dotsItem.isVisible, "300 - 26 dotsItem not visible").toBeFalsy();

  model.fit({ availableSpace: 300, gap: 50 });
  expect(item1.mode, "300 - 50 item1 large").toLooseEqual("large");
  expect(item2.mode, "300 - 50 item2 small").toLooseEqual("small");
  expect(item3.mode, "300 - 50 item3 small").toLooseEqual("small");
  expect(model.dotsItem.isVisible, "300 - 50 dotsItem not visible").toBeFalsy();

  model.fit({ availableSpace: 300, gap: 51 });
  expect(item1.mode, "300 - 51 item1 small").toLooseEqual("small");
  expect(item2.mode, "300 - 51 item2 small").toLooseEqual("small");
  expect(item3.mode, "300 - 51 item3 small").toLooseEqual("small");
  expect(model.dotsItem.isVisible, "300 - 51 dotsItem not visible").toBeFalsy();

  model.fit({ availableSpace: 300, gap: 75 });
  expect(item1.mode, "300 - 75 item1 small").toLooseEqual("small");
  expect(item2.mode, "300 - 75 item2 small").toLooseEqual("small");
  expect(item3.mode, "300 - 75 item3 small").toLooseEqual("small");
  expect(model.dotsItem.isVisible, "300 - 75 dotsItem not visible").toBeFalsy();

  model.fit({ availableSpace: 300, gap: 76 });
  expect(item1.mode, "300 - 76 item1 small").toLooseEqual("small");
  expect(item2.mode, "300 - 76 item2 popup").toLooseEqual("popup");
  expect(item3.mode, "300 - 76 item3 popup").toLooseEqual("popup");
  expect(model.dotsItem.isVisible, "300 - 76 dotsItem visible").toBeTruthy();

  model.fit({ availableSpace: 300, gap: 200 });
  expect(item1.mode, "300 - 200 item1 small").toLooseEqual("small");
  expect(item2.mode, "300 - 200 item2 popup").toLooseEqual("popup");
  expect(item3.mode, "300 - 200 item3 popup").toLooseEqual("popup");
  expect(model.dotsItem.isVisible, "300 - 200 dotsItem visible").toBeTruthy();

  model.fit({ availableSpace: 300, gap: 201 });
  expect(item1.mode, "300 - 201 item1 small").toLooseEqual("popup");
  expect(item2.mode, "300 - 201 item2 popup").toLooseEqual("popup");
  expect(item3.mode, "300 - 201 item3 popup").toLooseEqual("popup");
  expect(model.dotsItem.isVisible, "300 - 201 dotsItem visible").toBeTruthy();
});

test("Check fit with gap with disable hide on first action", () => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.dotsItem.minDimension = 50;
  model.dotsItem.maxDimension = 50;
  const item1 = new Action(<any>{});
  item1.minDimension = 50;
  item1.maxDimension = 100;
  item1.disableHide = true;
  model.actions.push(item1);

  const item2 = new Action(<any>{});
  item2.minDimension = 50;
  item2.maxDimension = 100;
  model.actions.push(item2);

  const item3 = new Action(<any>{});
  item3.minDimension = 50;
  item3.maxDimension = 100;
  model.actions.push(item3);

  const item4 = new Action(<any>{});
  item4.minDimension = 50;
  item4.maxDimension = 100;
  model.actions.push(item4);

  model.flushUpdates();

  model.fit({ availableSpace: 300, gap: 34 });
  expect(item1.mode, "300 - 34 item1 small").toLooseEqual("small");
  expect(item2.mode, "300 - 34 item2 small").toLooseEqual("small");
  expect(item3.mode, "300 - 34 item3 popup").toLooseEqual("popup");
  expect(item4.mode, "300 - 34 item4 popup").toLooseEqual("popup");
  expect(model.dotsItem.isVisible, "300 - 34 dotsItem visible").toBeTruthy();

  model.fit({ availableSpace: 300, gap: 75 });
  expect(item1.mode, "300 - 75 item1 small").toLooseEqual("small");
  expect(item2.mode, "300 - 75 item2 popup").toLooseEqual("small");
  expect(item3.mode, "300 - 75 item3 popup").toLooseEqual("popup");
  expect(item4.mode, "300 - 75 item4 popup").toLooseEqual("popup");
  expect(model.dotsItem.isVisible, "300 - 75 dotsItem visible").toBeTruthy();

  model.fit({ availableSpace: 300, gap: 76 });
  expect(item1.mode, "300 - 76 item1 small").toLooseEqual("small");
  expect(item2.mode, "300 - 76 item2 popup").toLooseEqual("popup");
  expect(item3.mode, "300 - 76 item3 popup").toLooseEqual("popup");
  expect(item4.mode, "300 - 76 item4 popup").toLooseEqual("popup");
  expect(model.dotsItem.isVisible, "300 - 76 dotsItem visible").toBeTruthy();
});

test("Check fit with gap with disable hide on non-first action", () => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.dotsItem.minDimension = 50;
  model.dotsItem.maxDimension = 50;
  const item1 = new Action(<any>{});
  item1.minDimension = 50;
  item1.maxDimension = 100;
  model.actions.push(item1);

  const item2 = new Action(<any>{});
  item2.minDimension = 50;
  item2.maxDimension = 100;
  model.actions.push(item2);

  const item3 = new Action(<any>{});
  item3.minDimension = 50;
  item3.maxDimension = 100;
  model.actions.push(item3);

  const item4 = new Action(<any>{});
  item4.minDimension = 50;
  item4.maxDimension = 100;
  item4.disableHide = true;
  model.actions.push(item4);
  model.flushUpdates();

  model.fit({ availableSpace: 300, gap: 34 });
  expect(item1.mode, "300 - 34 item1 small").toLooseEqual("small");
  expect(item2.mode, "300 - 34 item2 popup").toLooseEqual("popup");
  expect(item3.mode, "300 - 34 item3 popup").toLooseEqual("popup");
  expect(item4.mode, "300 - 34 item4 small").toLooseEqual("small");
  expect(model.dotsItem.isVisible, "300 - 34 dotsItem visible").toBeTruthy();

  model.fit({ availableSpace: 300, gap: 75 });
  expect(item1.mode, "300 - 75 item1 small").toLooseEqual("small");
  expect(item2.mode, "300 - 75 item2 popup").toLooseEqual("popup");
  expect(item3.mode, "300 - 75 item3 popup").toLooseEqual("popup");
  expect(item4.mode, "300 - 75 item4 small").toLooseEqual("small");
  expect(model.dotsItem.isVisible, "300 - 75 dotsItem visible").toBeTruthy();

  model.fit({ availableSpace: 300, gap: 76 });
  expect(item1.mode, "300 - 76 item1 small").toLooseEqual("popup");
  expect(item2.mode, "300 - 76 item2 popup").toLooseEqual("popup");
  expect(item3.mode, "300 - 76 item3 popup").toLooseEqual("popup");
  expect(item4.mode, "300 - 76 item4 small").toLooseEqual("small");
  expect(model.dotsItem.isVisible, "300 - 76 dotsItem visible").toBeTruthy();
});

test("Check fit for two actions: action with disableHide and action with icon", () => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.dotsItem.minDimension = 50;
  model.dotsItem.maxDimension = 50;
  const item1 = new Action(<any>{});
  item1.minDimension = 50;
  item1.maxDimension = 100;
  item1.disableHide = true;
  model.actions.push(item1);

  const item2 = new Action(<any>{ iconName: "icon" });
  item2.minDimension = 50;
  item2.maxDimension = 100;
  model.actions.push(item2);

  model.flushUpdates();

  model.fit({ availableSpace: 300 });
  expect(item1.mode, "300 item1 large").toLooseEqual("large");
  expect(item2.mode, "300 item2 large").toLooseEqual("large");
  expect(!model.dotsItem.isVisible, "300 dotsItem hidden").toBeTruthy();

  model.fit({ availableSpace: 150 });
  expect(item1.mode, "150 item1 large").toLooseEqual("large");
  expect(item2.mode, "150 item2 small").toLooseEqual("small");
  expect(!model.dotsItem.isVisible, "150 dotsItem hidden").toBeTruthy();

  model.fit({ availableSpace: 100 });
  expect(item1.mode, "100 item1 small").toLooseEqual("small");
  expect(item2.mode, "100 item2 small").toLooseEqual("small");
  expect(!model.dotsItem.isVisible, "100 dotsItem hidden").toBeTruthy();

  model.fit({ availableSpace: 50 });
  expect(item1.mode, "100 item1 small").toLooseEqual("small");
  expect(item2.mode, "100 item2 small").toLooseEqual("small");
  expect(!model.dotsItem.isVisible, "100 dotsItem hidden").toBeTruthy();
});
