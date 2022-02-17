import { ActionContainerImplementor } from "../../src/knockout/components/action-bar/action-bar";
import ko from "knockout";
import { ActionContainer } from "../../src/actions/container";

export default QUnit.module("koTests");

QUnit.test("ActionBarViewModel item visible is observable",
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
    const actionContainer = new ActionContainer();
    actionContainer.setItems(items);
    const model = new ActionContainerImplementor(actionContainer);
    const item = actionContainer.actions[0];
    assert.equal(item.visible, true);
    let count = 0;
    ko.computed(() => {
      const val = item.visible;
      count++;
    });
    assert.equal(count, 1);
    item.visible = !item.visible;
    assert.equal(item.visible, false);
    assert.equal(count, 2);
    item.visible = !item.visible;
    assert.equal(item.visible, true);
    assert.equal(count, 3);
  }
);

QUnit.test("ActionBarViewModel dispose", (assert) => {
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
  const actionContainer = new ActionContainer();
  actionContainer.setItems(items);
  const model = new ActionContainerImplementor(actionContainer);

  assert.equal(actionContainer.actions.length, 2);
  model.dispose();
  assert.equal(actionContainer.actions.length, 2);
});

QUnit.test("ActionBarViewModel check setItems not throwing exception after dispose", (assert) => {
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
  const actionContainer = new ActionContainer();
  actionContainer.setItems(items);
  const model = new ActionContainerImplementor(actionContainer);
  model.dispose();
  actionContainer.setItems(items);
  assert.equal("dummy", "dummy");
});