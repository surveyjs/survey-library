import { Action, IAction } from "../src/actions/action";
import { MultiSelectListModel } from "../src/multiSelectListModel";

export default QUnit.module("Multi select list model");

QUnit.test("MultiSelectListModel", function (assert) {
  const selectedItems = [];
  const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
  ];
  const multiSelectList = new MultiSelectListModel(items, () => { }, true, selectedItems);

  assert.equal(multiSelectList.renderedActions.length, 4);
  assert.equal(multiSelectList.renderedActions.filter(item => item.visible).length, 4);
  assert.equal(selectedItems.length, 0);

  multiSelectList.onItemClick(multiSelectList.renderedActions[1]);
  assert.equal(selectedItems.length, 1);

  multiSelectList.onItemClick(multiSelectList.renderedActions[2]);
  assert.equal(selectedItems.length, 2);

  multiSelectList.onItemClick(multiSelectList.renderedActions[1]);
  assert.equal(selectedItems.length, 1);
  assert.ok(selectedItems[0] === multiSelectList.renderedActions[2]);
});

QUnit.test("MultiSelectListModel onSelectionChanged added item", function (assert) {
  const selectedItems = [];
  const onSelectionChanged = (item, status) => {
    assert.equal(status, "added");
  };
  const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
  ];
  const multiSelectList = new MultiSelectListModel(items, onSelectionChanged, true, selectedItems);

  assert.equal(selectedItems.length, 0);

  multiSelectList.onItemClick(multiSelectList.renderedActions[1]);
  assert.equal(selectedItems.length, 1);

  multiSelectList.onItemClick(multiSelectList.renderedActions[2]);
  assert.equal(selectedItems.length, 2);
});

QUnit.test("MultiSelectListModel onSelectionChanged removed item", function (assert) {
  const selectedItems:Array<Action> = [];
  const onSelectionChanged = (item, status) => {
    assert.equal(item.id, "test2");
    assert.equal(status, "removed");
  };
  const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
  ];
  const multiSelectList = new MultiSelectListModel(items, onSelectionChanged, true, selectedItems);
  selectedItems.push(multiSelectList.renderedActions[1]);
  selectedItems.push(multiSelectList.renderedActions[2]);

  assert.equal(multiSelectList.selectedItems?.length, 2);

  multiSelectList.onItemClick(multiSelectList.renderedActions[1]);
  assert.equal(multiSelectList.selectedItems?.length, 1);
  assert.ok(selectedItems[0] === multiSelectList.renderedActions[2]);
});

QUnit.test("MultiSelectListModel isSelectedItem", function (assert) {
  const selectedItems:Array<Action> = [];
  const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
  ];
  const multiSelectList = new MultiSelectListModel(items, () => {}, true, selectedItems);
  selectedItems.push(multiSelectList.renderedActions[1]);
  selectedItems.push(multiSelectList.renderedActions[2]);

  assert.equal(multiSelectList.selectedItems?.length, 2);
  assert.equal(multiSelectList.isItemSelected(multiSelectList.renderedActions[0]), false);
  assert.equal(multiSelectList.isItemSelected(multiSelectList.renderedActions[1]), true);
  assert.equal(multiSelectList.isItemSelected(multiSelectList.renderedActions[2]), true);
  assert.equal(multiSelectList.isItemSelected(multiSelectList.renderedActions[3]), false);
});