import { Action } from "../src/actions/action";
import { AdaptiveActionContainer } from "../src/actions/adaptive-container";
import { ActionContainer } from "../src/actions/container";
import { LocalizableString } from "../src/localizablestring";
import { ResponsivityManager, VerticalResponsivityManager } from "../src/utils/responsivity-manager";

export default QUnit.module("ResponsivityManager");

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
}
class ResizeObserver {
  observe() { }
  disconnect() { }
}
window.ResizeObserver = <any>ResizeObserver;

QUnit.test("ActionContainer: renderedActions & visibleActions", assert => {
  const actions = [new Action({ id: "first" }), new Action({ id: "second", visible: false }), new Action({ id: "third" })];

  const actionContainer: ActionContainer = new ActionContainer();
  actionContainer.actions = actions;
  assert.equal(actionContainer.visibleActions.length, 2, "actionContainer visibleActions");
  assert.equal(actionContainer.renderedActions.length, 3, "actionContainer renderedActions");

  const adaptiveContainer: AdaptiveActionContainer = new AdaptiveActionContainer();
  adaptiveContainer.actions = actions;
  assert.equal(adaptiveContainer.visibleActions.length, 2, "adaptiveContainer visibleActions");
  assert.equal(adaptiveContainer.renderedActions.length, 4, "adaptiveContainer renderedActions");
  assert.equal(adaptiveContainer.renderedActions[3].id.indexOf("dotsItem-id"), 0, "dotsItem-id exists");
});

QUnit.test("ActionContainer: renderedActions & visibleActions if only one element", assert => {
  const actions = [new Action({ id: "first" })];

  const actionContainer: ActionContainer = new ActionContainer();
  actionContainer.actions = actions;
  assert.equal(actionContainer.visibleActions.length, 1, "actionContainer visibleActions");
  assert.equal(actionContainer.renderedActions.length, 1, "actionContainer renderedActions");

  const adaptiveContainer: AdaptiveActionContainer = new AdaptiveActionContainer();
  adaptiveContainer.actions = actions;
  assert.equal(adaptiveContainer.visibleActions.length, 1, "adaptiveContainer visibleActions");
  assert.equal(adaptiveContainer.renderedActions.length, 2, "adaptiveContainer renderedActions");

  actions[0].iconName = "icon-name";
  assert.equal(adaptiveContainer.visibleActions.length, 1, "adaptiveContainer visibleActions");
  assert.equal(adaptiveContainer.renderedActions.length, 1, "adaptiveContainer renderedActions");
});

QUnit.test("Fit items", function (assert) {
  const itemSmallWidth = 48;
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();

  const item1 = new Action(<any>{});
  item1.minDimension = itemSmallWidth;
  item1.maxDimension = itemSmallWidth;
  model.actions.push(item1);
  const item2 = new Action(<any>{});
  item2.minDimension = itemSmallWidth;
  item2.maxDimension = 200;
  model.actions.push(item2);
  model.actions.push(new Action({ id: "invisible", visible: false }));
  assert.equal(model.actions.length, 3);
  assert.equal(model.visibleActions.length, 2);
  assert.equal(model.renderedActions.length, 4);

  model.fit(300, itemSmallWidth);
  assert.equal(model.renderedActions.length, 4, "dimension 300");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "large", "dimension 300");
  assert.equal(item2.mode, "large", "dimension 300");

  model.fit(200, itemSmallWidth);
  assert.equal(model.renderedActions.length, 4, "dimension 200");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "large", "dimension 200");
  assert.equal(item2.mode, "small", "dimension 200");

  model.fit(100, itemSmallWidth);
  assert.equal(model.renderedActions.length, 4, "dimension 100");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "large", "dimension 100");
  assert.equal(item2.mode, "small", "dimension 100");

  model.fit(50, itemSmallWidth);
  assert.equal(model.renderedActions.length, 4, "dimension 50");
  assert.equal(model.renderedActions[0].isVisible, false, "hidden 1");
  assert.equal(model.renderedActions[1].isVisible, false, "hidden 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, true, "dots visible");
  assert.equal(model.renderedActions[3].iconName, "icon-more", "dimension 50");
  assert.equal(item1.mode, "popup", "dimension 50");
  assert.equal(item2.mode, "popup", "dimension 50");

  item2.disableShrink = true;
  model.fit(100, itemSmallWidth);
  assert.equal(model.renderedActions.length, 4, "dimension 100");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "small", "dimension 100");
  assert.equal(item2.mode, "large", "dimension 100 unshrinkable");

});

QUnit.test("Fit items - hide if needed", function (assert) {
  const itemSmallWidth = 50;
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();

  const item1 = new Action(<any>{});
  item1.minDimension = 0;
  item1.disableShrink = true;
  item1.maxDimension = itemSmallWidth;
  item1.removePriority = 2;
  model.actions.push(item1);
  const item2 = new Action(<any>{});
  item2.minDimension = 0;
  item2.disableShrink = true;
  item2.maxDimension = itemSmallWidth;
  item2.removePriority = 1;
  model.actions.push(item2);
  const item3 = new Action(<any>{});
  item3.minDimension = 0;
  item3.disableShrink = true;
  item3.maxDimension = itemSmallWidth;
  model.actions.push(item3);

  assert.equal(model.actions.length, 3);
  assert.equal(model.visibleActions.length, 3);

  model.fit(300, itemSmallWidth);
  assert.equal(model.visibleActions.length, 3, "dimension 300");
  assert.equal(model.visibleActions[0].isVisible, true, "300 - visible 1");
  assert.equal(model.visibleActions[1].isVisible, true, "300 - visible 2");
  assert.equal(model.visibleActions[2].isVisible, true, "300 - visible 3");

  model.fit(120, itemSmallWidth);
  assert.equal(model.visibleActions.length, 3, "dimension 120");
  assert.equal(model.visibleActions[0].isVisible, true, "120 - visible 1");
  assert.equal(model.visibleActions[1].isVisible, false, "120 - invisible 2");
  assert.equal(model.visibleActions[2].isVisible, true, "120 - visible 3");
  model.fit(70, itemSmallWidth);
  assert.equal(model.visibleActions.length, 3, "dimension 70");
  assert.equal(model.visibleActions[0].isVisible, false, "70 - invisible 1");
  assert.equal(model.visibleActions[1].isVisible, false, "70 - invisible 2");
  assert.equal(model.visibleActions[2].isVisible, true, "70 - visible 3");
});

QUnit.test("Fit items - hide items with priority", function (assert) {
  const itemSmallWidth = 15;
  const itemLargeWidth = 50;
  const dotsItemSize = 10;
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();

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
  item2.removePriority = 1;
  model.actions.push(item2);
  const item3 = new Action(<any>{});
  item3.minDimension = itemSmallWidth;
  item3.maxDimension = itemLargeWidth;
  item3.title = "c";
  model.actions.push(item3);

  assert.equal(model.actions.length, 3);
  assert.equal(model.visibleActions.length, 3);

  model.fit(300, dotsItemSize);
  assert.equal(model.visibleActions.length, 3, "dimension 300");
  assert.equal(model.visibleActions[0].isVisible, true, "300 - visible 1");
  assert.equal(model.visibleActions[1].isVisible, true, "300 - visible 2");
  assert.equal(model.visibleActions[2].isVisible, true, "300 - visible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "300 - dots hidden");

  model.fit(78, dotsItemSize);
  assert.equal(model.visibleActions.length, 3, "dimension 78");
  assert.equal(model.visibleActions[0].isVisible, true, "78 - visible 1");
  assert.equal(model.visibleActions[1].isVisible, false, "78 - invisible 2");
  assert.equal(model.visibleActions[2].isVisible, true, "78 - visible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "78 - dots hidden");

  model.fit(29, dotsItemSize);
  assert.equal(model.visibleActions.length, 3, "dimension 29");
  assert.equal(model.visibleActions[0].isVisible, true, "29 - visible 1");
  assert.equal(model.visibleActions[1].isVisible, false, "29 - invisible 2");
  assert.equal(model.visibleActions[2].isVisible, false, "29 - visible 3");
  assert.equal(model.dotsItem.isVisible, true, "29 - dots visible");
});

QUnit.test("getAvailableSpace with content-box test", function (assert) {
  const itemSmallWidth = 48;
  const container: SimpleContainer = new SimpleContainer({
    offsetWidth: 40,
    scrollWidth: itemSmallWidth,
    querySelectorAll: () => [{ offsetWidth: itemSmallWidth }],
  });
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const manager: ResponsivityManager = new ResponsivityManager(
    <any>container,
    <any>model,
    "",
    itemSmallWidth
  );
  (<any>manager.getComputedStyle) = () => {
    return { boxSizing: "content-box", paddingLeft: 5, paddingRight: 5 };
  };
  assert.equal(manager["getAvailableSpace"](), 40);
});

QUnit.test("getAvailableSpace with border-box test", function (assert) {
  const itemSmallWidth = 48;
  const container: SimpleContainer = new SimpleContainer({
    offsetWidth: 40,
    scrollWidth: itemSmallWidth,
    querySelectorAll: () => [{ offsetWidth: itemSmallWidth }],
  });
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const manager: ResponsivityManager = new ResponsivityManager(
    <any>container,
    <any>model,
    "",
    itemSmallWidth
  );
  (<any>manager.getComputedStyle) = () => {
    return { boxSizing: "border-box", paddingLeft: 5, paddingRight: 5 };
  };
  assert.equal(manager["getAvailableSpace"](), 30);
});
QUnit.test("Ignore space for invisible items", function (assert) {
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
  model.fit(50, itemSmallWidth);
  assert.equal(item1.mode, "large");
});

QUnit.test("Action container: updateCallback test", assert => {
  let isRaised = false;
  let currentIsInitialized = false;
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.updateCallback = (isResetInitialized) => {
    currentIsInitialized = isResetInitialized;
    isRaised = true;
  };

  assert.equal(isRaised, false);
  model.actions = [new Action({ id: "first" })];
  assert.equal(isRaised, true, "container OnSet");
  assert.equal(currentIsInitialized, true, "container OnSet");

  isRaised = false;
  model.actions.push(new Action({ id: "second" }));
  assert.equal(isRaised, true, "container OnPush");
  assert.equal(currentIsInitialized, true, "container OnPush");

  isRaised = false;
  model.actions.splice(1, 1);
  assert.equal(isRaised, true, "container OnRemove");
  assert.equal(currentIsInitialized, true, "container OnRemove");

  isRaised = false;
  model.actions[0].visible = !model.actions[0].visible;
  assert.equal(isRaised, true, "action visible changed");
  assert.equal(currentIsInitialized, false, "action visible changed");
});

QUnit.test("ResponsivityManager process test", function (assert) {
  const container: SimpleContainer = new SimpleContainer({});
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const manager: ResponsivityManager = new ResponsivityManager(<any>container, <any>model, "");
  (<any>manager.getComputedStyle) = () => {
    return { boxSizing: "content-box", paddingLeft: 5, paddingRight: 5 };
  };
  manager["getRenderedVisibleActionsCount"] = () => model.actions.length;
  manager["calcItemsSizes"] = () => {
    model.actions.forEach(action => {
      action.minDimension = 20;
      action.maxDimension = 100;
    });
  };
  const oldQueueMicrotask = window.queueMicrotask;
  window.queueMicrotask = undefined as any;
  assert.equal(manager["isInitialized"], false, "before start");
  manager["process"]();
  const newAction = new Action({ id: "first" });
  assert.equal(newAction.minDimension, undefined);
  assert.equal(newAction.maxDimension, undefined);
  assert.equal(manager["isInitialized"], true, "before push");

  model.actions.push(newAction);
  assert.equal(manager["isInitialized"], false, "after push");

  manager["process"]();
  assert.equal(manager["isInitialized"], true, "after process");
  assert.equal(newAction.minDimension, 20);
  assert.equal(newAction.maxDimension, 100);
  window.queueMicrotask = oldQueueMicrotask;
});

QUnit.test("ResponsivityManager minDimension calc test", function (assert) {
  const container: SimpleContainer = new SimpleContainer({});
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const manager: ResponsivityManager = new ResponsivityManager(<any>container, <any>model, "");
  (<any>manager.getComputedStyle) = () => {
    return { boxSizing: "content-box", paddingLeft: 5, paddingRight: 5 };
  };

  const newAction = new Action({ id: "first", iconName: "icon" });
  model.actions.push(newAction);
  assert.equal(manager["calcMinDimension"](newAction), 56);

  model.actions = [];
  const smallAction = new Action({ id: "first", iconName: "icon", iconSize: 16 });
  model.actions.push(newAction);
  assert.equal(manager["calcMinDimension"](smallAction), 40);
});

QUnit.test(
  "ResponsivityManager process test: stop when container is invisible",
  function (assert) {
    const container: SimpleContainer = new SimpleContainer({});
    const model: AdaptiveActionContainer = new AdaptiveActionContainer();
    const manager: ResponsivityManager = new ResponsivityManager(
      <any>container,
      <any>model,
      ""
    );
    container.offsetHeight = 0;
    container.offsetWidth = 0;
    container.clientRects = [];
    assert.equal(manager["isInitialized"], false);
    manager["process"]();
    assert.equal(manager["isInitialized"], false);
  }
);

QUnit.test("ResponsivityManager - vertical",
  function (assert) {
    const container: SimpleContainer = new SimpleContainer({});
    const model: AdaptiveActionContainer = new AdaptiveActionContainer();
    const manager: VerticalResponsivityManager = new VerticalResponsivityManager(<any>container, <any>model, "");
    (<any>manager.getComputedStyle) = () => {
      return { boxSizing: "content-box", paddingLeft: 5, paddingRight: 5 };
    };

    const newAction = new Action({ id: "item", iconName: "icon", title: "item title" });
    model.actions.push(newAction);

    assert.equal(manager["calcMinDimension"](newAction), 40);
  }
);

QUnit.test("ResponsivityManager - vertical process", function (assert) {
  const itemSmallWidth = 48;
  const oldQueueMicrotask = window.queueMicrotask;
  window.queueMicrotask = undefined as any;
  const container: SimpleContainer = new SimpleContainer({
    offsetHeight: 100,
    querySelector: (query: string) => {
      if(query == ".sv-dots") return { offsetWidth: 20, offsetHeight: 30 };
    },
    querySelectorAll: (query: string) => {
      if(query == ".sv-action") {
        let items: Array<{ offsetWidth: number, offsetHeight: number }> = [];
        for(var i = 0; i < 10; i++) items.push({ offsetWidth: 20, offsetHeight: 20 });
        return items;
      }
    }
  });
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  for(var i = 0; i < 10; i++) {
    model.actions.push(new Action(<any>{}));
  }
  const manager: VerticalResponsivityManager = new VerticalResponsivityManager(
    <any>container,
    <any>model,
    ".sv-action"
  );
  (<any>manager.getComputedStyle) = () => {
    return { boxSizing: "border-box", paddingTop: 5, paddingBottom: 5 };
  };
  manager["process"]();
  assert.equal(model.hiddenItemsListModel.actions.length, 7);
  window.queueMicrotask = oldQueueMicrotask;
});

QUnit.test("isResponsivenessDisabled", function (assert) {
  const oldQueueMicrotask = window.queueMicrotask;
  window.queueMicrotask = undefined as any;
  const itemSmallWidth = 48;
  const container: SimpleContainer = new SimpleContainer({});
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const manager: VerticalResponsivityManager = new VerticalResponsivityManager(<any>container, <any>model, "");
  manager["getAvailableSpace"] = () => { return 142; };
  manager["itemSmallWidth"] = itemSmallWidth;

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
  assert.equal(model.actions.length, 3);
  assert.equal(model.renderedActions.length, 4);
  assert.equal(model.isResponsivenessDisabled, false);

  manager["isInitialized"] = true;
  manager["process"]();
  assert.equal(model.renderedActions.length, 4, "dimension 300");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, false, "invisible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, true, "dots button");
  assert.equal(item1.mode, "small", "dimension 300");
  assert.equal(item2.mode, "popup", "dimension 300");
  assert.equal(item3.mode, "popup", "dimension 300");

  model.setActionsMode("large");
  model.isResponsivenessDisabled = true;
  manager["process"]();
  assert.equal(model.renderedActions.length, 4, "dimension 300");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, true, "visible 3");

  assert.equal(item1.mode, "large", "dimension 300");
  assert.equal(item2.mode, "large", "dimension 300");
  assert.equal(item3.mode, "large", "dimension 300");
  window.queueMicrotask = oldQueueMicrotask;
});

QUnit.test("check disableHide property", function (assert) {
  const itemSmallWidth = 48;
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();

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

  model.fit(50, 0);
  assert.notOk(item1.isVisible);
  assert.notOk(item2.isVisible);
  assert.ok(item3.isVisible);

  model.fit(120, 0);
  assert.ok(item1.isVisible);
  assert.notOk(item2.isVisible);
  assert.ok(item3.isVisible);

  model.fit(160, 0);
  assert.ok(item1.isVisible);
  assert.ok(item2.isVisible);
  assert.ok(item3.isVisible);
});

QUnit.test("check disableHide property in case of different widths", function (assert) {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
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

  model.fit(125, 0);
  assert.notOk(item1.isVisible);
  assert.notOk(item2.isVisible);
  assert.ok(item3.isVisible);

  model.fit(150, 0);
  assert.ok(item1.isVisible);
  assert.notOk(item2.isVisible);
  assert.ok(item3.isVisible);

  model.fit(225, 0);
  assert.ok(item1.isVisible);
  assert.ok(item2.isVisible);
  assert.ok(item3.isVisible);
});

QUnit.test("check title change calls raise update", function (assert) {
  const itemSmallWidth = 48;
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  let log = "";
  model.updateCallback = (isResetInitialized: boolean) => {
    log += `->called: ${isResetInitialized}`;
  };
  const item1 = new Action(<any>{});
  item1.minDimension = itemSmallWidth;
  item1.maxDimension = itemSmallWidth;
  model.actions.push(item1);
  assert.equal(log, "->called: true", "called from push");
  item1.title = "Test";
  assert.equal(log, "->called: true->called: true", "called from title change");
  item1.title = "Test";
  assert.equal(log, "->called: true->called: true");
});