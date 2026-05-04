import { Action, IAction } from "../src/actions/action";
import { MultiSelectListModel } from "../src/multiSelectListModel";
import { createIActionArray } from "./test-helpers";

import { describe, test, expect } from "vitest";
describe("Multi select list model", () => {
  test("MultiSelectListModel", () => {
    const selectedItems = [];
    const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
    ];
    const multiSelectList = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true, selectedItems: selectedItems });
    multiSelectList.flushUpdates();

    expect(multiSelectList.renderedActions.length).toBe(4);
    expect(multiSelectList.renderedActions.filter(item => item.visible).length).toBe(4);
    expect(selectedItems.length).toBe(0);

    multiSelectList.onItemClick(multiSelectList.renderedActions[1]);
    expect(selectedItems.length).toBe(1);

    multiSelectList.onItemClick(multiSelectList.renderedActions[2]);
    expect(selectedItems.length).toBe(2);

    multiSelectList.onItemClick(multiSelectList.renderedActions[1]);
    expect(selectedItems.length).toBe(1);
    expect(selectedItems[0] === multiSelectList.renderedActions[2]).toBeTruthy();
  });

  test("MultiSelectListModel onSelectionChanged added item", () => {
    const selectedItems = [];
    const onSelectionChanged = (item, status) => {
      expect(status).toBe("added");
    };
    const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
    ];
    const multiSelectList = new MultiSelectListModel({ items: items, onSelectionChanged: onSelectionChanged, allowSelection: true, selectedItems: selectedItems });
    multiSelectList.flushUpdates();
    expect(selectedItems.length).toBe(0);

    multiSelectList.onItemClick(multiSelectList.renderedActions[1]);
    expect(selectedItems.length).toBe(1);

    multiSelectList.onItemClick(multiSelectList.renderedActions[2]);
    expect(selectedItems.length).toBe(2);
  });

  test("MultiSelectListModel onSelectionChanged removed item", () => {
    const selectedItems:Array<Action> = [];
    const onSelectionChanged = (item, status) => {
      expect(item.id).toBe("test2");
      expect(status).toBe("removed");
    };
    const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
    ];
    const multiSelectList = new MultiSelectListModel({ items: items, onSelectionChanged: onSelectionChanged, allowSelection: true, selectedItems: selectedItems });
    multiSelectList.flushUpdates();
    selectedItems.push(multiSelectList.renderedActions[1]);
    selectedItems.push(multiSelectList.renderedActions[2]);

    expect(multiSelectList.selectedItems.length).toBe(2);

    multiSelectList.onItemClick(multiSelectList.renderedActions[1]);
    expect(multiSelectList.selectedItems.length).toBe(1);
    expect(selectedItems[0] === multiSelectList.renderedActions[2]).toBeTruthy();
  });

  test("MultiSelectListModel isSelectedItem", () => {
    const selectedItems:Array<Action> = [];
    const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
    ];
    const multiSelectList = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true, selectedItems: selectedItems });
    multiSelectList.flushUpdates();
    selectedItems.push(multiSelectList.renderedActions[1]);
    selectedItems.push(multiSelectList.renderedActions[2]);

    expect(multiSelectList.selectedItems.length).toBe(2);
    expect(multiSelectList.isItemSelected(multiSelectList.renderedActions[0])).toBe(false);
    expect(multiSelectList.isItemSelected(multiSelectList.renderedActions[1])).toBe(true);
    expect(multiSelectList.isItemSelected(multiSelectList.renderedActions[2])).toBe(true);
    expect(multiSelectList.isItemSelected(multiSelectList.renderedActions[3])).toBe(false);
  });

  test("selectFocusedItem", () => {
    const items = createIActionArray(12);
    const list = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true });
    list.filterString = "1";
    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[1]).toBeTruthy();
    expect(list.selectedItems.length).toBe(0);

    list.selectFocusedItem();
    expect(list.selectedItems.length).toBe(1);
    expect(list.focusedItem === list.actions[1]).toBeTruthy();
  });

  test("selectFocusedItem & hideSelectedItems", () => {
    const items = createIActionArray(12);
    const list = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true });
    list.hideSelectedItems = true;
    list.filterString = "1";
    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[1]).toBeTruthy();
    expect(list.selectedItems.length).toBe(0);

    list.selectFocusedItem();
    expect(list.selectedItems.length).toBe(1);
    expect(list.focusedItem === list.actions[10]).toBeTruthy();
  });

  test("focusNextVisibleItem item if there is selected items", () => {
    const items = createIActionArray(12);
    const list = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true, selectedItems: [items[2]] });

    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[2]).toBeTruthy();
  });

  test("isEmpty & hideSelectedItems", () => {
    const items = createIActionArray(2);
    const multiSelectList = new MultiSelectListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true });
    multiSelectList.hideSelectedItems = true;
    multiSelectList.flushUpdates();

    expect(multiSelectList.selectedItems.length, "selectedItems count 1").toBe(0);
    expect(multiSelectList.isEmpty, "isEmpty 1").toBeFalsy();

    multiSelectList.setSelectedItems(multiSelectList.renderedActions.concat([]));
    multiSelectList.flushUpdates();

    expect(multiSelectList.selectedItems.length, "selectedItems count 2").toBe(2);
    expect(multiSelectList.isEmpty, "isEmpty 2").toBeTruthy();
  });
});
