import { Action } from "../src/actions/action";
import { AdaptiveActionContainer } from "../src/actions/adaptive-container";
import { ResponsivityManager } from "../src/utils/responsivity-manager";

export default QUnit.module("ResponsivityManager");

class SimpleContainer {
  parentElement: any;
  constructor(config: any) {
    (<any>Object).assign(this, config);
    this.parentElement = this;
  }
}

class ResizeObserver {
  observe() {}
}
window.ResizeObserver = <any>ResizeObserver;

QUnit.test("Fit items", function(assert) {
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
  assert.equal(model.actions.length, 2);

  model.fit(300, itemSmallWidth);
  assert.equal(model.renderedActions.length, 3, "dimension 300");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "large", "dimension 300");
  assert.equal(item2.mode, "large", "dimension 300");

  model.fit(200, itemSmallWidth);
  assert.equal(model.renderedActions.length, 3, "dimension 200");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "large", "dimension 200");
  assert.equal(item2.mode, "small", "dimension 200");

  model.fit(100, itemSmallWidth);
  assert.equal(model.renderedActions.length, 3, "dimension 100");
  assert.equal(model.renderedActions[0].isVisible, true, "visible 1");
  assert.equal(model.renderedActions[1].isVisible, true, "visible 2");
  assert.equal(model.renderedActions[2].isVisible, false, "dots hidden");
  assert.equal(item1.mode, "large", "dimension 100");
  assert.equal(item2.mode, "small", "dimension 100");

  model.fit(50, itemSmallWidth);
  assert.equal(model.renderedActions.length, 3, "dimension 50");
  assert.equal(model.renderedActions[0].isVisible, false, "hidden 1");
  assert.equal(model.renderedActions[1].isVisible, false, "hidden 2");
  assert.equal(model.renderedActions[2].isVisible, true, "dots visible");
  assert.equal(model.renderedActions[2].iconName, "icon-dots", "dimension 50");
  assert.equal(item1.mode, "popup", "dimension 50");
  assert.equal(item2.mode, "popup", "dimension 50");
});

QUnit.test("getAvailableSpace with content-box test", function(assert) {
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

QUnit.test("getAvailableSpace with border-box test", function(assert) {
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
QUnit.test("Ignore space for invisible items", function(assert) {
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
