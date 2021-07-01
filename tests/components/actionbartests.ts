import { ActionBar, AdaptiveActionBarItemWrapper } from "../../src/action-bar";
import { settings } from "../../src/settings";

QUnit.test("Check that items are wrapped after set", (assert) => {
  const model: ActionBar = new ActionBar();
  model.setItems([{ id: "first" }, { id: "second" }]);
  assert.ok(model.items[0] instanceof AdaptiveActionBarItemWrapper);
  assert.ok(model.items[1] instanceof AdaptiveActionBarItemWrapper);
});

QUnit.test("Check action sort items", (assert) => {
  const model: ActionBar = new ActionBar();
  model.setItems([
    { id: "invisible", visibleIndex: -1 },
    { id: "second", visibleIndex: 1 },
    { id: "third", visibleIndex: 2 },
    { id: "first", visibleIndex: 0 },
    { id: "undefined_index", visibleIndex: undefined },
  ]);
  assert.equal(model.items.length, 4);
  assert.equal(model.items[0].id, "first");
  assert.equal(model.items[1].id, "second");
  assert.equal(model.items[2].id, "third");
  //item with undefined index should be put in the end of array
  assert.equal(model.items[3].id, "undefined_index");
});
QUnit.test("Use proxy to get icons", (assert) => {
  settings.customIcons["icon-proxy"] = "new-icon";
  const model: ActionBar = new ActionBar();
  model.setItems([
    { id: "invisible", iconName: "icon-normal" },
    { id: "second", iconName: "icon-proxy" },
  ]);
  assert.equal(model.items.length, 2);
  assert.equal(model.items[0].iconName, "icon-normal");
  assert.equal(model.items[1].iconName, "new-icon");
});
