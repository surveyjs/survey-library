import { ActionBar } from "../../src/action-bar";

QUnit.test("Check action sort items", assert => {
  const data = {};
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
