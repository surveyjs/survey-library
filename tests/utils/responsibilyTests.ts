import { Model } from "vue-property-decorator";
import { ResponsibilityManager } from "../../src/utils/resonsibilitymanager";

export default QUnit.module("ResponsibilityManager");

class TestModel {
  public visibleElementsCount: number = 0;
  public isShrank = false;
  public isGrown = false;
  public canShrink = false;
  public canGrow = false;
  showFirstN(count: number) {
    this.visibleElementsCount = count;
  }
  public shrink() {
    this.canShrink = false;
    this.canGrow = true;
  }

  public grow() {
    this.canGrow = false;
    this.canShrink = true;
  }
}

QUnit.test("Check on element with box-sizing: content-box", function (assert) {
  var container = { offsetWidth: 30, scrollWidth: 30 };
  var model = new TestModel();
  var manager = new ResponsibilityManager(<any>container, model, 5);
  manager.getComputedStyle = () => {
    return {
      marginLeft: "0px",
      marginRight: "0px",
      boxSizing: "content-box",
    };
  };
  manager.process();
  assert.equal(
    model.visibleElementsCount,
    Number.MAX_VALUE,
    "trying show all items at first"
  );
  container.offsetWidth = 24;
  manager.process();
  assert.equal(
    model.visibleElementsCount,
    3,
    "process method set number of visible items 3"
  );
  container.offsetWidth = 18;
  manager.process();
  assert.equal(
    model.visibleElementsCount,
    2,
    "process method set number of visible items 2"
  );

  container.offsetWidth = 41;
  manager.process();
  assert.equal(
    model.visibleElementsCount,
    Number.MAX_VALUE,
    "process method tries show all items"
  );
});

QUnit.test("Check on element with box-sizing: border-box", function (assert) {
  var container = { offsetWidth: 30, scrollWidth: 30 };
  var model = new TestModel();
  var manager = new ResponsibilityManager(<any>container, model, 5);
  manager.getComputedStyle = () => {
    return {
      marginLeft: "0px",
      marginRight: "0px",
      boxSizing: "border-box",
      paddingLeft: "4px",
      paddingRight: "1px",
    };
  };
  container.offsetWidth = 24;
  manager.process();
  assert.equal(
    model.visibleElementsCount,
    2,
    "process method set number of visible items 3"
  );
  container.offsetWidth = 18;
  manager.process();
  assert.equal(
    model.visibleElementsCount,
    1,
    "process method set number of visible items 2"
  );
});

QUnit.test("Check on model which can shrink and grow", function (assert) {
  var container = { offsetWidth: 30, scrollWidth: 30 };
  var model = new TestModel();
  model.canGrow = true;
  var manager = new ResponsibilityManager(<any>container, model, 5);
  manager.getComputedStyle = () => {
    return {
      marginLeft: "0px",
      marginRight: "0px",
    };
  };
  manager.process();
  assert.notOk(model.canGrow, "process method grew model at first");
  assert.equal(
    model.visibleElementsCount,
    Number.MAX_VALUE,
    "trying show all items at first"
  );

  container.offsetWidth = 24;
  manager.process();
  assert.notOk(model.canShrink, "process shrank model");
  assert.equal(
    model.visibleElementsCount,
    Number.MAX_VALUE,
    "process did not changed visible items count"
  );

  manager.process();
  assert.equal(
    model.visibleElementsCount,
    3,
    "after shrink process changed visible items count"
  );

  container.offsetWidth = 18;
  manager.process();
  assert.equal(
    model.visibleElementsCount,
    2,
    "process method set number of visible items 2"
  );

  container.offsetWidth = 41;
  manager.process();
  assert.notOk(model.canGrow, "process grew model");
  assert.equal(
    model.visibleElementsCount,
    Number.MAX_VALUE,
    "process method tries show all items"
  );
});

QUnit.test("Check on element with changing margins", function (assert) {
  var container = { offsetWidth: 30, scrollWidth: 30 };
  var model = new TestModel();
  model.canGrow = true;
  var style = {
    marginLeft: "0px",
    marginRight: "0px",
  };
  var manager = new ResponsibilityManager(<any>container, model, 5);
  manager.getComputedStyle = () => {
    return style;
  };

  container.offsetWidth = 24;
  manager.process();
  assert.ok(model.canGrow);
  assert.equal(
    model.visibleElementsCount,
    3,
    "process method set number of visible items 3"
  );
  container.scrollWidth = 24;
  style.marginLeft = "5px";
  style.marginRight = "1px";
  manager.process();

  assert.notOk(
    model.canGrow,
    "process grew model in favor of margin's increase"
  );
  assert.equal(
    model.visibleElementsCount,
    Number.MAX_VALUE,
    "process method tries show all items in favor of margin's increase"
  );
});
