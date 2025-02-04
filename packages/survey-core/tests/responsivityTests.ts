import { update } from "lodash";
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
  classList = {
    contains() {
      return false;
    }
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
  assert.equal(model.actions.length, 3);
  assert.equal(model.visibleActions.length, 2);
  assert.equal(model.renderedActions.length, 4);

  model.fit({ availableSpace: 300 });
  assert.equal(model.renderedActions.length, 4, "dimension 300");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "large", "dimension 300");
  assert.equal(item2.mode, "large", "dimension 300");

  model.fit({ availableSpace: 200 });
  assert.equal(model.renderedActions.length, 4, "dimension 200");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "large", "dimension 200");
  assert.equal(item2.mode, "small", "dimension 200");

  model.fit({ availableSpace: 100 });
  assert.equal(model.renderedActions.length, 4, "dimension 100");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "large", "dimension 100");
  assert.equal(item2.mode, "small", "dimension 100");

  model.fit({ availableSpace: 50 });
  assert.equal(model.renderedActions.length, 4, "dimension 50");
  assert.equal(model.renderedActions[0].isVisible, false, "hidden 1");
  assert.equal(model.renderedActions[1].isVisible, false, "hidden 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, true, "dots visible");
  assert.equal(model.renderedActions[3].iconName, "icon-more", "dimension 50");
  assert.equal(item1.mode, "popup", "dimension 50");
  assert.equal(item2.mode, "popup", "dimension 50");

  item2.disableShrink = true;
  model.fit({ availableSpace: 248 });
  assert.equal(model.renderedActions.length, 4, "dimension 100");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "invisible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "small", "dimension 248");
  assert.equal(item2.mode, "large", "dimension 248 unshrinkable");

});

QUnit.test("Fit items - hide items with priority", function (assert) {
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

  assert.equal(model.actions.length, 3);
  assert.equal(model.visibleActions.length, 3);

  model.fit({ availableSpace: 300 });
  assert.equal(model.visibleActions.length, 3, "dimension 300");
  assert.equal(model.visibleActions[0].isVisible, true, "300 - visible 1");
  assert.equal(model.visibleActions[1].isVisible, true, "300 - visible 2");
  assert.equal(model.visibleActions[2].isVisible, true, "300 - visible 3");
  assert.equal(model.renderedActions[3].isVisible, false, "300 - dots hidden");

  model.fit({ availableSpace: 78 });
  assert.equal(model.visibleActions.length, 3, "dimension 78");
  assert.equal(model.visibleActions[0].isVisible, true, "78 - visible 1");
  assert.equal(model.visibleActions[1].isVisible, true, "78 - invisible 2");
  assert.equal(model.visibleActions[2].isVisible, false, "78 - visible 3");
  assert.equal(model.renderedActions[3].isVisible, true, "78 - dots hidden");

  model.fit({ availableSpace: 29 });
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
    <any>model
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
    <any>model
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
  model.fit({ availableSpace: 50 });
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
  const manager: ResponsivityManager = new ResponsivityManager(<any>container, <any>model);

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
  manager["debouncedProcess"] = { run: () => manager["process"](), cancel: () => {} };
  (<any>manager.getComputedStyle) = () => {
    return { boxSizing: "content-box", paddingLeft: 5, paddingRight: 5 };
  };
  assert.notOk(manager["isInitialized"], "before start");
  updateActions();
  const newAction = new Action({ id: "first" });
  assert.equal(newAction.minDimension, undefined);
  assert.equal(newAction.maxDimension, undefined);
  assert.ok(manager["isInitialized"], "before push");

  model.actions.push(newAction);
  assert.notOk(manager["isInitialized"], "after push");
  updateActions();
  assert.ok(manager["isInitialized"], "after process");
  assert.equal(newAction.minDimension, 20);
  assert.equal(newAction.maxDimension, 100);
});

QUnit.test(
  "ResponsivityManager process test: stop when container is invisible",
  function (assert) {
    const container: SimpleContainer = new SimpleContainer({});
    const model: AdaptiveActionContainer = new AdaptiveActionContainer();
    const manager: ResponsivityManager = new ResponsivityManager(
      <any>container,
      <any>model
    );
    container.offsetHeight = 0;
    container.offsetWidth = 0;
    container.clientRects = [];
    assert.equal(manager["isInitialized"], false);
    manager["process"]();
    assert.equal(manager["isInitialized"], false);
  }
);

QUnit.test("ResponsivityManager - vertical process", function (assert) {
  const container: SimpleContainer = new SimpleContainer({
    offsetHeight: 100,
  });
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  for(var i = 0; i < 10; i++) {
    model.actions.push(new Action(<any>{}));
  }
  const manager: VerticalResponsivityManager = new VerticalResponsivityManager(
    <any>container,
    <any>model
  );
  (window as any).getComputedStyle = () => {
    return { boxSizing: "border-box", paddingTop: 5, paddingBottom: 5 };
  };
  model.renderedActions.forEach(action => {
    action.updateModeCallback = (mode, callback) => {
      action.mode = mode;
      const offsetHeight = action == model.dotsItem ? 30 : 20;
      const content = new SimpleContainer({ offsetWidth: 20, offsetHeight });
      callback(mode, content as any);
    };
  });
  manager["process"]();
  assert.equal(model.hiddenItemsListModel.actions.length, 7);
});

QUnit.test("isResponsivenessDisabled", function (assert) {
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
});

QUnit.test("check disableHide property", function (assert) {
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

  model.fit({ availableSpace: 50 });
  assert.notOk(item1.isVisible);
  assert.notOk(item2.isVisible);
  assert.ok(item3.isVisible);

  model.fit({ availableSpace: 120 });
  assert.ok(item1.isVisible);
  assert.notOk(item2.isVisible);
  assert.ok(item3.isVisible);

  model.fit({ availableSpace: 160 });
  assert.ok(item1.isVisible);
  assert.ok(item2.isVisible);
  assert.ok(item3.isVisible);
});

QUnit.test("check disableHide property in case of different widths", function (assert) {
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

  model.fit({ availableSpace: 125 });
  assert.notOk(item1.isVisible);
  assert.notOk(item2.isVisible);
  assert.ok(item3.isVisible);

  model.fit({ availableSpace: 150 });
  assert.ok(item1.isVisible);
  assert.notOk(item2.isVisible);
  assert.ok(item3.isVisible);

  model.fit({ availableSpace: 225 });
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
  assert.notOk(item1.needUpdateMaxDimension, "needUpdateMaxDimension is false by default");
  item1.title = "Test";
  assert.equal(log, "->called: true->called: false", "called from title change");
  assert.ok(item1.needUpdateMaxDimension, "needUpdateMaxDimension is true when changing title");
  item1.title = "Test";
  assert.equal(log, "->called: true->called: false");
});

QUnit.test("check actions mode is set correctly when disableShrink is set", function (assert) {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  const action = model.addAction({
    disableShrink: true,
    title: "test"
  });
  assert.equal(action.mode, "large");
  model.setActionsMode("removed");
  assert.equal(action.mode, "removed");
  model.setActionsMode("large");
  assert.equal(action.mode, "large");
  model.setActionsMode("popup");
  assert.equal(action.mode, "popup");
  model.setActionsMode("small");
  assert.equal(action.mode, "large");
});

QUnit.test("Check fit with gap", function (assert) {
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

  model.fit({ availableSpace: 300, gap: 0 });
  assert.equal(item1.mode, "large", "300 - 0 item1 large");
  assert.equal(item2.mode, "large", "300 - 0 item2 large");
  assert.equal(item3.mode, "large", "300 - 0 item3 large");
  assert.notOk(model.dotsItem.isVisible, "300 - 0 dotsItem not visible");

  model.fit({ availableSpace: 300, gap: 1 });
  assert.equal(item1.mode, "large", "300 - 1 item1 large");
  assert.equal(item2.mode, "large", "300 - 1 item2 large");
  assert.equal(item3.mode, "small", "300 - 1 item3 small");
  assert.notOk(model.dotsItem.isVisible, "300 - 1 dotsItem not visible");

  model.fit({ availableSpace: 300, gap: 25 });
  assert.equal(item1.mode, "large", "300 - 25 item1 large");
  assert.equal(item2.mode, "large", "300 - 25 item2 large");
  assert.equal(item3.mode, "small", "300 - 25 item3 small");
  assert.notOk(model.dotsItem.isVisible, "300 - 25 dotsItem not visible");

  model.fit({ availableSpace: 300, gap: 26 });
  assert.equal(item1.mode, "large", "300 - 26 item1 large");
  assert.equal(item2.mode, "small", "300 - 26 item2 small");
  assert.equal(item3.mode, "small", "300 - 26 item3 small");
  assert.notOk(model.dotsItem.isVisible, "300 - 26 dotsItem not visible");

  model.fit({ availableSpace: 300, gap: 50 });
  assert.equal(item1.mode, "large", "300 - 50 item1 large");
  assert.equal(item2.mode, "small", "300 - 50 item2 small");
  assert.equal(item3.mode, "small", "300 - 50 item3 small");
  assert.notOk(model.dotsItem.isVisible, "300 - 50 dotsItem not visible");

  model.fit({ availableSpace: 300, gap: 51 });
  assert.equal(item1.mode, "small", "300 - 51 item1 small");
  assert.equal(item2.mode, "small", "300 - 51 item2 small");
  assert.equal(item3.mode, "small", "300 - 51 item3 small");
  assert.notOk(model.dotsItem.isVisible, "300 - 51 dotsItem not visible");

  model.fit({ availableSpace: 300, gap: 75 });
  assert.equal(item1.mode, "small", "300 - 75 item1 small");
  assert.equal(item2.mode, "small", "300 - 75 item2 small");
  assert.equal(item3.mode, "small", "300 - 75 item3 small");
  assert.notOk(model.dotsItem.isVisible, "300 - 75 dotsItem not visible");

  model.fit({ availableSpace: 300, gap: 76 });
  assert.equal(item1.mode, "small", "300 - 76 item1 small");
  assert.equal(item2.mode, "popup", "300 - 76 item2 popup");
  assert.equal(item3.mode, "popup", "300 - 76 item3 popup");
  assert.ok(model.dotsItem.isVisible, "300 - 76 dotsItem visible");

  model.fit({ availableSpace: 300, gap: 200 });
  assert.equal(item1.mode, "small", "300 - 200 item1 small");
  assert.equal(item2.mode, "popup", "300 - 200 item2 popup");
  assert.equal(item3.mode, "popup", "300 - 200 item3 popup");
  assert.ok(model.dotsItem.isVisible, "300 - 200 dotsItem visible");

  model.fit({ availableSpace: 300, gap: 201 });
  assert.equal(item1.mode, "popup", "300 - 201 item1 small");
  assert.equal(item2.mode, "popup", "300 - 201 item2 popup");
  assert.equal(item3.mode, "popup", "300 - 201 item3 popup");
  assert.ok(model.dotsItem.isVisible, "300 - 201 dotsItem visible");
});

QUnit.test("Check fit with gap with disable hide on first action", function (assert) {
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

  model.fit({ availableSpace: 300, gap: 34 });
  assert.equal(item1.mode, "small", "300 - 34 item1 small");
  assert.equal(item2.mode, "small", "300 - 34 item2 small");
  assert.equal(item3.mode, "popup", "300 - 34 item3 popup");
  assert.equal(item4.mode, "popup", "300 - 34 item4 popup");
  assert.ok(model.dotsItem.isVisible, "300 - 34 dotsItem visible");

  model.fit({ availableSpace: 300, gap: 75 });
  assert.equal(item1.mode, "small", "300 - 75 item1 small");
  assert.equal(item2.mode, "small", "300 - 75 item2 popup");
  assert.equal(item3.mode, "popup", "300 - 75 item3 popup");
  assert.equal(item4.mode, "popup", "300 - 75 item4 popup");
  assert.ok(model.dotsItem.isVisible, "300 - 75 dotsItem visible");

  model.fit({ availableSpace: 300, gap: 76 });
  assert.equal(item1.mode, "small", "300 - 76 item1 small");
  assert.equal(item2.mode, "popup", "300 - 76 item2 popup");
  assert.equal(item3.mode, "popup", "300 - 76 item3 popup");
  assert.equal(item4.mode, "popup", "300 - 76 item4 popup");
  assert.ok(model.dotsItem.isVisible, "300 - 76 dotsItem visible");
});

QUnit.test("Check fit with gap with disable hide on non-first action", function (assert) {
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

  model.fit({ availableSpace: 300, gap: 34 });
  assert.equal(item1.mode, "small", "300 - 34 item1 small");
  assert.equal(item2.mode, "popup", "300 - 34 item2 popup");
  assert.equal(item3.mode, "popup", "300 - 34 item3 popup");
  assert.equal(item4.mode, "small", "300 - 34 item4 small");
  assert.ok(model.dotsItem.isVisible, "300 - 34 dotsItem visible");

  model.fit({ availableSpace: 300, gap: 75 });
  assert.equal(item1.mode, "small", "300 - 75 item1 small");
  assert.equal(item2.mode, "popup", "300 - 75 item2 popup");
  assert.equal(item3.mode, "popup", "300 - 75 item3 popup");
  assert.equal(item4.mode, "small", "300 - 75 item4 small");
  assert.ok(model.dotsItem.isVisible, "300 - 75 dotsItem visible");

  model.fit({ availableSpace: 300, gap: 76 });
  assert.equal(item1.mode, "popup", "300 - 76 item1 small");
  assert.equal(item2.mode, "popup", "300 - 76 item2 popup");
  assert.equal(item3.mode, "popup", "300 - 76 item3 popup");
  assert.equal(item4.mode, "small", "300 - 76 item4 small");
  assert.ok(model.dotsItem.isVisible, "300 - 76 dotsItem visible");
});