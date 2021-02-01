import {
  ActionBarViewModel,
  ActionBaseViewModelImplementor,
} from "../../src/knockout/components/action-bar/action-bar";
import ko from "knockout";

export default QUnit.module("koTests");

QUnit.test(
  "ActionBarViewModel item isVisible is observable",
  function (assert) {
    const items = [
      {
        id: "id1",
        title: "title1",
      },
      {
        id: "id1",
        title: "title1",
      },
    ];
    const model = new ActionBarViewModel(items);
    new ActionBaseViewModelImplementor(model);
    const item = model.items[0];
    assert.equal(item.isVisible, true);
    let count = 0;
    ko.computed(() => {
      const val = item.isVisible;
      count++;
    });
    assert.equal(count, 1);
    item.isVisible = !item.isVisible;
    assert.equal(item.isVisible, false);
    assert.equal(count, 2);
    item.isVisible = !item.isVisible;
    assert.equal(item.isVisible, true);
    assert.equal(count, 3);
  }
);
