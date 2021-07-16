import { Action } from "../../src/actions/action";
import { AdaptiveActionContainer } from "../../src/actions/adaptive-container";
import { settings } from "../../src/settings";

QUnit.test("Check that items are wrapped after set", (assert) => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.setItems([{ id: "first" }, { id: "second" }]);
  assert.ok(model.actions[0] instanceof Action);
  assert.ok(model.actions[1] instanceof Action);
});

QUnit.test("Check action sort items", (assert) => {
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.setItems([
    { id: "invisible", visibleIndex: -1 },
    { id: "second", visibleIndex: 1 },
    { id: "third", visibleIndex: 2 },
    { id: "first", visibleIndex: 0 },
    { id: "undefined_index", visibleIndex: undefined }
  ]);
  assert.equal(model.actions.length, 4);
  assert.equal(model.actions[0].id, "first");
  assert.equal(model.actions[1].id, "second");
  assert.equal(model.actions[2].id, "third");
  //item with undefined index should be put in the end of array
  assert.equal(model.actions[3].id, "undefined_index");
});

QUnit.test("Use proxy to get icons", (assert) => {
  settings.customIcons["icon-proxy"] = "new-icon";
  const model: AdaptiveActionContainer = new AdaptiveActionContainer();
  model.setItems([
    { id: "invisible", iconName: "icon-normal" },
    { id: "second", iconName: "icon-proxy" }
  ]);
  assert.equal(model.actions.length, 2);
  assert.equal(model.actions[0].iconName, "icon-normal");
  assert.equal(model.actions[1].iconName, "new-icon");
});
