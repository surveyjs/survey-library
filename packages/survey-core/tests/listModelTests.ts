import { Action, IAction } from "../src/actions/action";
import { ElementHelper } from "../src/element-helper";
import { ListModel } from "../src/list";
import { settings } from "../src/settings";
import { createIActionArray, createListContainerHtmlElement } from "./test-helpers";

import { describe, test, expect } from "vitest";
describe("List Model", () => {
  const oldValueMINELEMENTCOUNT = ListModel.MINELEMENTCOUNT;

  test("ListModel less than or equal to MINELEMENTCOUNT", () => {
    ListModel.MINELEMENTCOUNT = 5;
    const items = createIActionArray(4);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();

    expect(list.renderedActions.length).toBe(4);
    expect(list.renderedActions.filter(item => item.visible).length).toBe(4);
    expect(list.showFilter).toBeFalsy();

    ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
  });

  test("ListModel greater MINELEMENTCOUNT", () => {
    ListModel.MINELEMENTCOUNT = 5;
    const items = createIActionArray(7);
    items.push(<IAction>{ id: "test8", title: "test8", visible: false });
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    expect(list.renderedActions.length).toBe(7);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(7);
    expect(list.showFilter).toBeTruthy();

    list.filterString = "test";

    expect(list.renderedActions.length).toBe(7);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(7);

    list.filterString = "1";
    expect(list.renderedActions.length).toBe(7);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(1);

    ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
  });

  test("ListModel reassign items", () => {
    ListModel.MINELEMENTCOUNT = 5;
    const items = createIActionArray(4);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    expect(list.renderedActions.length).toBe(4);
    expect(list.renderedActions.filter(item => item.visible).length).toBe(4);
    expect(list.showFilter).toBeFalsy();

    list.setItems(createIActionArray(7));
    list.flushUpdates();

    expect(list.renderedActions.length).toBe(7);
    expect(list.renderedActions.filter(item => item.visible).length).toBe(7);
    expect(list.showFilter).toBeTruthy();

    ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
  });

  test("hasText method", () => {
    const list = new ListModel({ items: [], onSelectionChanged: () => { }, allowSelection: true } as any);
    const item = new Action({ id: "1", title: "Best test1" });
    expect(list["hasText"](item, "test")).toBeTruthy();
    expect(list["hasText"](item, "1")).toBeTruthy();
    expect(list["hasText"](item, "test2")).toBeFalsy();
    expect(list["hasText"](item, "Best")).toBeTruthy();
    expect(list["hasText"](item, "best")).toBeTruthy();
  });

  class MyObject {
    myOnFilter(text: string) {
      this.myItems.forEach(item => {
        item.visible = !!text ? item.title.indexOf("1") !== -1 : true;
      });
    }
    constructor(public myItems: Array<IAction>) {}
  }

  class MyObject2 {
    myOnFilter(text: string) {
      this.myItems.forEach((item: IAction) => {
        if (!!text && !!item) {
          item.visible = item.title?.indexOf(text) !== -1;
        } else {
          item.visible = true;
        }
      });
    }
    constructor(public myItems: Array<IAction>) {}
  }

  test("ListModel custom onFilter", () => {
    ListModel.MINELEMENTCOUNT = 5;
    const items = [
      new Action({ id: "test1", title: "test1" }),
      new Action({ id: "test2", title: "test2" }),
      new Action({ id: "test3", title: "test3" }),
      new Action({ id: "test4", title: "test4" }),
      new Action({ id: "test5", title: "test5" }),
      new Action({ id: "test6", title: "test6" }),
      new Action({ id: "test7", title: "test7" })
    ];
    const myObject = new MyObject(items);
    const list = new ListModel({ items: [], onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    list.setOnFilterStringChangedCallback((text: string) => { myObject.myOnFilter(text); });
    expect(list.renderedActions.length).toBe(0);

    list.setItems(myObject.myItems);
    list.flushUpdates();
    expect(list.renderedActions.length, "initial list.renderedActions").toBe(7);
    expect(list.renderedActions.filter(item => item.visible).length, "initial list.renderedActions.filter(item => item.visible)").toBe(7);
    expect(list.showFilter, "initial list.filterableListItems").toBeTruthy();

    list.filterString = "test";
    list.flushUpdates();
    expect(list.renderedActions.length, "items filterString = test").toBe(1);
    expect(list.renderedActions.filter(item => item.visible).length, "items.filter(item => item.visible) filterString = test").toBe(1);
    expect(myObject.myItems.filter(item => item.visible).length, "myObject.myItems visible filterString = test").toBe(1);
    expect(list.renderedActions.filter(item => item.visible)[0].title, "filterString = test").toBe("test1");

    list.filterString = "1";
    list.flushUpdates();
    expect(list.renderedActions.length, "items filterString = 1").toBe(1);
    expect(list.renderedActions.filter(item => item.visible).length, "items.filter(item => item.visible) filterString = 1").toBe(1);
    expect(myObject.myItems.filter(item => item.visible).length, "myObject.myItems visible filterString = 1").toBe(1);
    expect(list.renderedActions.filter(item => item.visible)[0].title, "filterString = 1").toBe("test1");

    ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
  });

  test("ListModel: refresh & isEmpty", () => {
    const items = [
      new Action({ id: "test1", title: "test1" }),
      new Action({ id: "test2", title: "test2" })
    ];
    const myObject = new MyObject(items);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    expect(list.isEmpty, "#1").toBe(false);
    list.actions[0].setVisible(false);
    list.actions[1].setVisible(false);
    list.refresh();
    list.flushUpdates();
    expect(list.isEmpty, "#2").toBe(true);
    list.actions[1].setVisible(true);
    list.refresh();
    list.flushUpdates();
    expect(list.isEmpty, "#3").toBe(false);
  });

  test("ListModel custom onFilter: item is not found when a search string contains a white space", () => {
    ListModel.MINELEMENTCOUNT = 5;
    const items = [
      new Action({ id: "test1", title: "test1" }),
      new Action({ id: "test2", title: "test2" }),
      new Action({ id: "test3", title: "test3" }),
      new Action({ id: "test4", title: "test4" }),
      new Action({ id: "test5", title: "test5" }),
      new Action({ id: "test6", title: "test6" }),
      new Action({ id: "test7", title: "test7" })
    ];
    const myObject = new MyObject2(items);
    const list = new ListModel({ items: [], onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    list.setOnFilterStringChangedCallback((text: string) => { myObject.myOnFilter(text); });
    expect(list.renderedActions.length, "#1").toBe(0);
    expect(list.isEmpty, "#2").toBe(true);

    list.setItems(myObject.myItems);
    list.flushUpdates();
    expect(list.isEmpty, "#3").toBe(false);
    expect(list.renderedActions.length, "#4").toBe(7);
    expect(list.renderedActions.filter(item => item.visible).length, "#5").toBe(7);

    list.filterString = "1 ";
    list.flushUpdates();
    expect(list.isEmpty, "#6").toBe(true);
    expect(list.renderedActions.length, "#7").toBe(0);
    expect(list.renderedActions.filter(item => item.visible).length, "#8").toBe(0);

    list.filterString = "1";
    list.flushUpdates();
    expect(list.isEmpty, "#9").toBe(false);
    expect(list.renderedActions.length, "#10").toBe(1);
    expect(list.renderedActions.filter(item => item.visible).length, "#11").toBe(1);
    ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
  });

  test("ListModel shows placeholder if there are no visible elements", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();

    expect(list.renderedActions.length).toBe(12);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(12);
    expect(list.isEmpty, "!isEmpty").toBeFalsy();

    list.filterString = "item";
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(0);
    expect(list.isEmpty, "isEmpty").toBeTruthy();
  });

  test("ListModel focus item", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();

    expect(list.renderedActions.length).toBe(12);
    expect(list.focusedItem).toBeUndefined();

    list.focusNextVisibleItem();
    expect(list.focusedItem).toBe(list.actions[0]);

    list.focusNextVisibleItem();
    expect(list.focusedItem).toBe(list.actions[1]);

    list.focusPrevVisibleItem();
    expect(list.focusedItem).toBe(list.actions[0]);
  });

  test("focusNextVisibleItem item", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.focusedItem = list.actions[list.actions.length - 1];

    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[0]).toBeTruthy();

    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[1]).toBeTruthy();
  });

  test("focusNextVisibleItem item + filtration", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.filterString = "1";

    expect(list.visibleItems.length).toBe(3);

    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[1]).toBeTruthy();

    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[10]).toBeTruthy();
  });

  test("focusPrevVisibleItem item", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.focusedItem = list.actions[0];

    list.focusPrevVisibleItem();
    expect(list.focusedItem === list.actions[list.actions.length - 1]).toBeTruthy();

    list.focusPrevVisibleItem();
    expect(list.focusedItem === list.actions[list.actions.length - 2]).toBeTruthy();
  });
  test("focusPrevVisibleItem item + filtration", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.filterString = "1";
    expect(list.visibleItems.length).toBe(3);

    list.focusPrevVisibleItem();
    expect(list.focusedItem === list.actions[1]).toBeTruthy();

    list.focusPrevVisibleItem();
    expect(list.focusedItem === list.actions[list.actions.length - 1]).toBeTruthy();

    list.focusPrevVisibleItem();
    expect(list.focusedItem === list.actions[list.actions.length - 2]).toBeTruthy();
  });

  test("focusNextVisibleItem item if there is selected item", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true, selectedItem: items[2] } as any);

    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[2]).toBeTruthy();
  });

  test("selectFocusedItem", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.filterString = "1";
    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[1]).toBeTruthy();
    expect(list.selectedItem === undefined).toBeTruthy();

    list.selectFocusedItem();
    expect(list.selectedItem === list.actions[1]).toBeTruthy();
  });
  test("onMouseMove", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.filterString = "1";
    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[1]).toBeTruthy();

    list.onMouseMove(new MouseEvent("mouseMove"));
    expect(list.focusedItem).toBeUndefined();
  });
  test("add/remove scrollHandler", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    let result = 0;

    const element = createListContainerHtmlElement();
    list.initListContainerHtmlElement(element);
    // jsdom does not perform layout; force the scrollable container to report a vertical scroller.
    Object.defineProperty(list.scrollableContainer, "scrollHeight", { configurable: true, value: 1000 });
    Object.defineProperty(list.scrollableContainer, "offsetHeight", { configurable: true, value: 100 });

    expect(ElementHelper.hasVerticalScroller(list.scrollableContainer)).toBe(true);
    expect(!!list.scrollHandler).toBe(false);
    expect(result).toBe(0);

    list.addScrollEventListener(() => { result++; });
    expect(!!list.scrollHandler).toBe(true);
    expect(result).toBe(0);

    list.scrollableContainer.dispatchEvent(new CustomEvent("scroll"));
    expect(result).toBe(1);

    list.removeScrollEventListener();
    expect(!!list.scrollHandler).toBe(true);
    expect(result).toBe(1);

    list.scrollableContainer.dispatchEvent(new CustomEvent("scroll"));
    expect(result).toBe(1);

    document.body.removeChild(element);
  });
  test("onItemRended & hasVerticalScroller", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    const element = createListContainerHtmlElement();
    list.initListContainerHtmlElement(element);

    expect(list.hasVerticalScroller).toBe(false);

    list.onItemRended(list.actions[list.actions.length - 1], undefined as any);
    expect(list.hasVerticalScroller).toBe(false);

    document.body.removeChild(element);
  });

  test("onItemRended & hasVerticalScroller & isAllDataLoaded", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    const element = createListContainerHtmlElement();
    list.initListContainerHtmlElement(element);
    list.isAllDataLoaded = false;
    // jsdom does not perform layout; stub measurements so hasVerticalScroller can detect overflow.
    Object.defineProperty(list.scrollableContainer, "scrollHeight", { configurable: true, value: 1000 });
    Object.defineProperty(list.scrollableContainer, "offsetHeight", { configurable: true, value: 100 });

    expect(list.hasVerticalScroller).toBe(false);

    list.onItemRended(list.actions[list.actions.length - 1], undefined as any);
    expect(list.hasVerticalScroller).toBe(true);

    document.body.removeChild(element);
  });

  test("emptyText & isAllDataLoaded", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.isAllDataLoaded = false;
    expect(list.emptyMessage).toBe("Loading...");

    list.isAllDataLoaded = true;
    expect(list.emptyMessage).toBe("No data to display");
  });

  test("getItemClass test", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    expect(list.getItemClass(list.actions[0])).toBe("sv-list__item");

    list.textWrapEnabled = true;
    expect(list.getItemClass(list.actions[0])).toBe("sv-list__item sv-list__item-text--wrap");

    list.textWrapEnabled = false;
    list.focusedItem = list.actions[0];
    expect(list.getItemClass(list.actions[0])).toBe("sv-list__item sv-list__item--focused");

    list.selectFocusedItem();
    expect(list.getItemClass(list.actions[0])).toBe("sv-list__item sv-list__item--focused sv-list__item--selected");
    expect(list.getItemClass(list.actions[1])).toBe("sv-list__item");

    list.actions[1].enabled = false;
    expect(list.getItemClass(list.actions[1])).toBe("sv-list__item sv-list__item--disabled");

    list.actions[1].css = "custom-css";
    expect(list.getItemClass(list.actions[1])).toBe("sv-list__item sv-list__item--disabled custom-css");
  });

  test("getListClass test", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    expect(list.getListClass()).toBe("sv-list");

    list.filterString = "test";
    expect(list.getListClass()).toBe("sv-list");

    list.filterString = "test1";
    expect(list.getListClass()).toBe("sv-list sv-list--filtering");
  });

  test("allow show selected item with disabled selection", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: [], onSelectionChanged: () => { }, allowSelection: false } as any);
    expect(list.selectedItem, "no selected item").toBeUndefined();
    expect(list.isItemSelected(items[0] as any), "selected item is false").toBe(false);

    list.selectedItem = items[0];
    expect(list.selectedItem, "first item selected").toBe(items[0]);
    expect(list.isItemSelected(items[0] as any), "selected item is true").toBe(true);
  });
  test("ListModel filter & comparator.normalize text (brouillé=brouille)", () => { // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    const items: Array<IAction> = [];
    items.push(<IAction>{ id: "test1", title: "brouillé" }); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    items.push(<IAction>{ id: "test1", title: "lle" });
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    list.filterString = "le";
    let filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length, "both items are found by default").toBe(2);
  });
  test("ListModel search in subitems", () => {
    ListModel.MINELEMENTCOUNT = 5;

    const items: Array<IAction> = [];
    for (let index = 0; index < 7; ++index) {
      items.push(new Action({ id: "test" + index, title: "test" + index }));
    }

    const subitems = [new Action({ id: "test28", title: "test28" }), new Action({ id: "test29", title: "test29" })];
    (items[2] as Action).setSubItems({ items: subitems });
    const list = new ListModel(items, () => { }, true);
    list.flushUpdates();
    let filteredActions;
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toBe(7);
    list.filterString = "t";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toBe(9);

    list.filterString = "2";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toBe(3);
    expect(filteredActions.map(a => a.title)).toEqual(["test2", "test28", "test29"]);

    list.filterString = "1";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toBe(1);
    expect(filteredActions.map(a => a.title)).toEqual(["test1"]);
    list.filterString = "28";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toBe(1);
    expect(filteredActions.map(a => a.title)).toEqual(["test28"]);

    ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
  });

  test("ListModel search in subitems with icons", () => {
    ListModel.MINELEMENTCOUNT = 5;

    const items: Array<IAction> = [];
    for (let index = 0; index < 7; ++index) {
      items.push(new Action({ id: "test" + index, title: "test" + index, iconName: "icon" + index }));
    }

    const subitems = [new Action({ id: "test28", title: "test28" }), new Action({ id: "test29", title: "test29" })];
    (items[2] as Action).setSubItems({ items: subitems });
    const list = new ListModel(items, () => { }, true);

    list.flushUpdates();

    let filteredActions;
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toBe(7);

    list.filterString = "2";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toBe(3);
    expect(filteredActions.map(a => a.title)).toEqual(["test2", "test28", "test29"]);
    expect(filteredActions.map(a => a.iconName)).toEqual(["icon2", "icon2", "icon2"]);

    list.filterString = "";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toBe(7);
    expect(filteredActions[2].items.length).toBe(2);
    expect(filteredActions[2].items[0].iconName).toBeFalsy();

    ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
  });

  test("ListModel onItemClick", () => {

    let items: Array<Action> = [];
    for (let index = 0; index < 4; ++index) {
      items.push(new Action({ id: "test" + index, title: "test" + index }));
    }
    let actionCalled = 0;
    let selectCalled = 0;
    items[1].action = () => {
      actionCalled++;
    };
    const list = new ListModel({
      items: items,
      onSelectionChanged: () => {
        selectCalled++;
      },
      allowSelection: true
    } as any);

    list.onItemClick(items[0]);
    expect(actionCalled).toBe(0);
    expect(selectCalled).toBe(1);

    list.onItemClick(items[1]);
    expect(actionCalled).toBe(1);
    expect(selectCalled).toBe(2);
  });

  test("a11y: list item aria attr", () => {
    const items = createIActionArray(4);
    const list = new ListModel({ items: items, selectedItem: items[0], onSelectionChanged: () => { }, allowSelection: true });

    expect(list.listItemRole, "defaultValue listItemRole").toBe("option");
    expect(list.getA11yItemAriaSelected(list.actions[0]), "0 ariaSelected #1").toBe("true");
    expect(list.getA11yItemAriaChecked(list.actions[0]), "0 ariaChecked #1").toBeUndefined();
    expect(list.getA11yItemAriaSelected(list.actions[1]), "1 ariaSelected #1").toBe("false");
    expect(list.getA11yItemAriaChecked(list.actions[1]), "1 ariaChecked #1").toBeUndefined();

    list.listItemRole = "menuitemradio";
    expect(list.getA11yItemAriaSelected(list.actions[0]), "0 ariaSelected #2").toBeUndefined();
    expect(list.getA11yItemAriaChecked(list.actions[0]), "0 ariaChecked #2").toBe("true");
    expect(list.getA11yItemAriaSelected(list.actions[1]), "1 ariaSelected #2").toBeUndefined();
    expect(list.getA11yItemAriaChecked(list.actions[1]), "1 ariaChecked #2").toBe("false");
  });

  test("ListModel disableSearch property", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();

    // Test default behavior (disableSearch = false)
    expect(list.disableSearch, "disableSearch defaults to false").toBe(false);
    expect(list.renderedActions.length, "all items are rendered initially").toBe(12);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "all items are visible initially").toBe(12);

    // Test filtering with disableSearch = false
    list.filterString = "1";
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "filtering works when disableSearch is false").toBe(3);

    // Test with disableSearch = true
    list.disableSearch = true;
    list.flushUpdates();
    expect(list.disableSearch, "disableSearch is set to true").toBe(true);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "all items are visible when disableSearch is true, even with filterString").toBe(12);

    // Test that filterString is ignored when disableSearch is true
    list.filterString = "nonexistent";
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "all items remain visible when disableSearch is true, even with non-matching filterString").toBe(12);

    // Test switching back to disableSearch = false
    list.disableSearch = false;
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "filtering works again when disableSearch is set back to false").toBe(0);

    // Test with empty filterString and disableSearch = true
    list.filterString = "";
    list.disableSearch = true;
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "all items are visible when disableSearch is true and filterString is empty").toBe(12);
  });
});
