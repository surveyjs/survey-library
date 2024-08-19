import { Action, IAction } from "../src/actions/action";
import { MultiSelectListModel } from "../src/multiSelectListModel";
import { createIActionArray } from "./utilstests";

export default QUnit.module("Multi select list model");

QUnit.test("MultiSelectListModel", function (assert) {
  const selectedItems = [];
  const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
  ];
  const multiSelectList = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true, selectedItems: selectedItems });

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
  const multiSelectList = new MultiSelectListModel({ items: items, onSelectionChanged: onSelectionChanged, allowSelection: true, selectedItems: selectedItems });

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
  const multiSelectList = new MultiSelectListModel({ items: items, onSelectionChanged: onSelectionChanged, allowSelection: true, selectedItems: selectedItems });
  selectedItems.push(multiSelectList.renderedActions[1]);
  selectedItems.push(multiSelectList.renderedActions[2]);

  assert.equal(multiSelectList.selectedItems.length, 2);

  multiSelectList.onItemClick(multiSelectList.renderedActions[1]);
  assert.equal(multiSelectList.selectedItems.length, 1);
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
  const multiSelectList = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true, selectedItems: selectedItems });
  selectedItems.push(multiSelectList.renderedActions[1]);
  selectedItems.push(multiSelectList.renderedActions[2]);

  assert.equal(multiSelectList.selectedItems.length, 2);
  assert.equal(multiSelectList.isItemSelected(multiSelectList.renderedActions[0]), false);
  assert.equal(multiSelectList.isItemSelected(multiSelectList.renderedActions[1]), true);
  assert.equal(multiSelectList.isItemSelected(multiSelectList.renderedActions[2]), true);
  assert.equal(multiSelectList.isItemSelected(multiSelectList.renderedActions[3]), false);
});

QUnit.test("selectFocusedItem", function (assert) {
  const items = createIActionArray(12);
  const list = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true });
  list.filterString = "1";
  list.focusNextVisibleItem();
  assert.ok(list.focusedItem === list.actions[1]);
  assert.equal(list.selectedItems.length, 0);

  list.selectFocusedItem();
  assert.equal(list.selectedItems.length, 1);
  assert.ok(list.focusedItem === list.actions[1]);
});

QUnit.test("selectFocusedItem & hideSelectedItems", function (assert) {
  const items = createIActionArray(12);
  const list = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true });
  list.hideSelectedItems = true;
  list.filterString = "1";
  list.focusNextVisibleItem();
  assert.ok(list.focusedItem === list.actions[1]);
  assert.equal(list.selectedItems.length, 0);

  list.selectFocusedItem();
  assert.equal(list.selectedItems.length, 1);
  assert.ok(list.focusedItem === list.actions[10]);
});

QUnit.test("focusNextVisibleItem item if there is selected items", function (assert) {
  const items = createIActionArray(12);
  const list = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true, selectedItems: [items[2]] });

  list.focusNextVisibleItem();
  assert.ok(list.focusedItem === list.actions[2]);
});

QUnit.test("isEmpty & hideSelectedItems", function (assert) {
  const items = createIActionArray(2);
  const multiSelectList = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true });
  multiSelectList.hideSelectedItems = true;

  assert.equal(multiSelectList.selectedItems.length, 0, "selectedItems count 1");
  assert.notOk(multiSelectList.isEmpty, "isEmpty 1");

  multiSelectList.setSelectedItems(multiSelectList.renderedActions);

  assert.equal(multiSelectList.selectedItems.length, 2, "selectedItems count 2");
  assert.ok(multiSelectList.isEmpty, "isEmpty 2");
});