import {
  AdaptiveActionBarItemWrapper,
  AdaptiveElement,
} from "../../src/action-bar";
import { ResponsivityManager } from "../../src/utils/responsivity-manager";

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
  const container: SimpleContainer = new SimpleContainer({
    offsetWidth: 5,
    scrollWidth: itemSmallWidth,
    querySelectorAll: () => [{ offsetWidth: itemSmallWidth }],
  });
  const model: AdaptiveElement = new AdaptiveElement();
  const manager: ResponsivityManager = new ResponsivityManager(
    <any>container,
    <any>model,
    "",
    itemSmallWidth
  );

  const item1 = new AdaptiveActionBarItemWrapper(model, <any>{});
  item1.minDimension = itemSmallWidth;
  item1.maxDimension = itemSmallWidth;
  model.items.push(item1);
  const item2 = new AdaptiveActionBarItemWrapper(model, <any>{});
  item2.minDimension = itemSmallWidth;
  item2.maxDimension = 200;
  model.items.push(item2);
  assert.equal(model.items.length, 2);

  manager.fit(300);
  assert.equal(model.visibleItems.length, 2, "dimension 300");
  assert.equal(item1.mode, "large", "dimension 300");
  assert.equal(item2.mode, "large", "dimension 300");

  manager.fit(200);
  assert.equal(model.visibleItems.length, 2, "dimension 200");
  assert.equal(item1.mode, "large", "dimension 200");
  assert.equal(item2.mode, "small", "dimension 200");

  manager.fit(100);
  assert.equal(model.visibleItems.length, 2, "dimension 100");
  assert.equal(item1.mode, "large", "dimension 100");
  assert.equal(item2.mode, "small", "dimension 100");

  manager.fit(50);
  assert.equal(model.visibleItems.length, 1, "dimension 50");
  assert.equal(model.visibleItems[0].iconName, "icon-dots", "dimension 50");
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
  const model: AdaptiveElement = new AdaptiveElement();
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
  const model: AdaptiveElement = new AdaptiveElement();
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
