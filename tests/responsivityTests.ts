import { Action } from "../src/actions/action";
import { AdaptiveActionContainer } from "../src/actions/adaptive-container";
import { ActionContainer } from "../src/actions/container";
import { ResponsivityManager } from "../src/utils/responsivity-manager";

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
}

class ResizeObserver {
  observe() { }
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
  assert.equal(adaptiveContainer.renderedActions[3].id, "dotsItem-id");
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
  assert.equal(model.renderedActions[3].iconName, "icon-dots", "dimension 50");
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
  manager["calcItemsSizes"] = () => {
    model.actions.forEach(action => {
      action.minDimension = 20;
      action.maxDimension = 100;
    });
  };

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
  function(assert) {
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
