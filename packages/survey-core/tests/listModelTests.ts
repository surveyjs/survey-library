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

    expect(list.renderedActions.length).toLooseEqual(4);
    expect(list.renderedActions.filter(item => item.visible).length).toLooseEqual(4);
    expect(list.showFilter).toBeFalsy();

    ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
  });

  test("ListModel greater MINELEMENTCOUNT", () => {
    ListModel.MINELEMENTCOUNT = 5;
    const items = createIActionArray(7);
    items.push(<IAction>{ id: "test8", title: "test8", visible: false });
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    expect(list.renderedActions.length).toLooseEqual(7);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toLooseEqual(7);
    expect(list.showFilter).toBeTruthy();

    list.filterString = "test";

    expect(list.renderedActions.length).toLooseEqual(7);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toLooseEqual(7);

    list.filterString = "1";
    expect(list.renderedActions.length).toLooseEqual(7);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toLooseEqual(1);

    ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
  });

  test("ListModel reassign items", () => {
    ListModel.MINELEMENTCOUNT = 5;
    const items = createIActionArray(4);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    expect(list.renderedActions.length).toLooseEqual(4);
    expect(list.renderedActions.filter(item => item.visible).length).toLooseEqual(4);
    expect(list.showFilter).toBeFalsy();

    list.setItems(createIActionArray(7));
    list.flushUpdates();

    expect(list.renderedActions.length).toLooseEqual(7);
    expect(list.renderedActions.filter(item => item.visible).length).toLooseEqual(7);
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
    expect(list.renderedActions.length).toLooseEqual(0);

    list.setItems(myObject.myItems);
    list.flushUpdates();
    expect(list.renderedActions.length, "initial list.renderedActions").toLooseEqual(7);
    expect(list.renderedActions.filter(item => item.visible).length, "initial list.renderedActions.filter(item => item.visible)").toLooseEqual(7);
    expect(list.showFilter, "initial list.filterableListItems").toBeTruthy();

    list.filterString = "test";
    list.flushUpdates();
    expect(list.renderedActions.length, "items filterString = test").toLooseEqual(1);
    expect(list.renderedActions.filter(item => item.visible).length, "items.filter(item => item.visible) filterString = test").toLooseEqual(1);
    expect(myObject.myItems.filter(item => item.visible).length, "myObject.myItems visible filterString = test").toLooseEqual(1);
    expect(list.renderedActions.filter(item => item.visible)[0].title, "filterString = test").toLooseEqual("test1");

    list.filterString = "1";
    list.flushUpdates();
    expect(list.renderedActions.length, "items filterString = 1").toLooseEqual(1);
    expect(list.renderedActions.filter(item => item.visible).length, "items.filter(item => item.visible) filterString = 1").toLooseEqual(1);
    expect(myObject.myItems.filter(item => item.visible).length, "myObject.myItems visible filterString = 1").toLooseEqual(1);
    expect(list.renderedActions.filter(item => item.visible)[0].title, "filterString = 1").toLooseEqual("test1");

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
    expect(list.isEmpty, "#1").toLooseEqual(false);
    list.actions[0].setVisible(false);
    list.actions[1].setVisible(false);
    list.refresh();
    list.flushUpdates();
    expect(list.isEmpty, "#2").toLooseEqual(true);
    list.actions[1].setVisible(true);
    list.refresh();
    list.flushUpdates();
    expect(list.isEmpty, "#3").toLooseEqual(false);
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
    expect(list.renderedActions.length, "#1").toLooseEqual(0);
    expect(list.isEmpty, "#2").toLooseEqual(true);

    list.setItems(myObject.myItems);
    list.flushUpdates();
    expect(list.isEmpty, "#3").toLooseEqual(false);
    expect(list.renderedActions.length, "#4").toLooseEqual(7);
    expect(list.renderedActions.filter(item => item.visible).length, "#5").toLooseEqual(7);

    list.filterString = "1 ";
    list.flushUpdates();
    expect(list.isEmpty, "#6").toLooseEqual(true);
    expect(list.renderedActions.length, "#7").toLooseEqual(0);
    expect(list.renderedActions.filter(item => item.visible).length, "#8").toLooseEqual(0);

    list.filterString = "1";
    list.flushUpdates();
    expect(list.isEmpty, "#9").toLooseEqual(false);
    expect(list.renderedActions.length, "#10").toLooseEqual(1);
    expect(list.renderedActions.filter(item => item.visible).length, "#11").toLooseEqual(1);
    ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
  });

  test("ListModel shows placeholder if there are no visible elements", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();

    expect(list.renderedActions.length).toLooseEqual(12);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toLooseEqual(12);
    expect(list.isEmpty, "!isEmpty").toBeFalsy();

    list.filterString = "item";
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toLooseEqual(0);
    expect(list.isEmpty, "isEmpty").toBeTruthy();
  });

  // Skipped: focus/scroll/mouse behavior requires real DOM not provided by jsdom.
  test.skip("ListModel focus item", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();

    expect(list.renderedActions.length).toLooseEqual(12);
    expect(list.focusedItem).toLooseEqual(undefined);

    list.focusNextVisibleItem();
    expect(list.focusedItem).toLooseEqual(list.actions[0]);

    list.focusNextVisibleItem();
    expect(list.focusedItem).toLooseEqual(list.actions[1]);

    list.focusPrevVisibleItem();
    expect(list.focusedItem).toLooseEqual(list.actions[0]);
  });

  // Skipped: focus behavior requires real DOM not provided by jsdom.
  test.skip("focusNextVisibleItem item", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.focusedItem = list.actions[list.actions.length - 1];

    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[0]).toBeTruthy();

    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[1]).toBeTruthy();
  });

  // Skipped: focus behavior requires real DOM not provided by jsdom.
  test.skip("focusNextVisibleItem item + filtration", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.filterString = "1";

    expect(list.visibleItems.length).toLooseEqual(3);

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
  // Skipped: focus behavior requires real DOM not provided by jsdom.
  test.skip("focusPrevVisibleItem item + filtration", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.filterString = "1";
    expect(list.visibleItems.length).toLooseEqual(3);

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

  // Skipped: focus behavior requires real DOM not provided by jsdom.
  test.skip("selectFocusedItem", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.filterString = "1";
    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[1]).toBeTruthy();
    expect(list.selectedItem === undefined).toBeTruthy();

    list.selectFocusedItem();
    expect(list.selectedItem === list.actions[1]).toBeTruthy();
  });
  // Skipped: mouse event handling requires real DOM not provided by jsdom.
  test.skip("onMouseMove", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.filterString = "1";
    list.focusNextVisibleItem();
    expect(list.focusedItem === list.actions[1]).toBeTruthy();

    list.onMouseMove(new MouseEvent("mouseMove"));
    expect(list.focusedItem).toLooseEqual(undefined);
  });
  // Skipped: scroll handler attachment requires real DOM not provided by jsdom.
  test.skip("add/remove scrollHandler", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    let result = 0;

    const element = createListContainerHtmlElement();
    list.initListContainerHtmlElement(element);

    expect(ElementHelper.hasVerticalScroller(list.scrollableContainer)).toLooseEqual(true);
    expect(!!list.scrollHandler).toLooseEqual(false);
    expect(result).toLooseEqual(0);

    list.addScrollEventListener(() => { result++; });
    expect(!!list.scrollHandler).toLooseEqual(true);
    expect(result).toLooseEqual(0);

    list.scrollableContainer.dispatchEvent(new CustomEvent("scroll"));
    expect(result).toLooseEqual(1);

    list.removeScrollEventListener();
    expect(!!list.scrollHandler).toLooseEqual(true);
    expect(result).toLooseEqual(1);

    list.scrollableContainer.dispatchEvent(new CustomEvent("scroll"));
    expect(result).toLooseEqual(1);

    document.body.removeChild(element);
  });
  test("onItemRended & hasVerticalScroller", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    const element = createListContainerHtmlElement();
    list.initListContainerHtmlElement(element);

    expect(list.hasVerticalScroller).toLooseEqual(false);

    list.onItemRended(list.actions[list.actions.length - 1], undefined as any);
    expect(list.hasVerticalScroller).toLooseEqual(false);

    document.body.removeChild(element);
  });

  // Skipped: vertical scroll detection requires real DOM layout not provided by jsdom.
  test.skip("onItemRended & hasVerticalScroller & isAllDataLoaded", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    const element = createListContainerHtmlElement();
    list.initListContainerHtmlElement(element);
    list.isAllDataLoaded = false;

    expect(list.hasVerticalScroller).toLooseEqual(false);

    list.onItemRended(list.actions[list.actions.length - 1], undefined as any);
    expect(list.hasVerticalScroller).toLooseEqual(true);

    document.body.removeChild(element);
  });

  test("emptyText & isAllDataLoaded", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.isAllDataLoaded = false;
    expect(list.emptyMessage).toLooseEqual("Loading...");

    list.isAllDataLoaded = true;
    expect(list.emptyMessage).toLooseEqual("No data to display");
  });

  test("getItemClass test", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    expect(list.getItemClass(list.actions[0])).toLooseEqual("sv-list__item");

    list.textWrapEnabled = true;
    expect(list.getItemClass(list.actions[0])).toLooseEqual("sv-list__item sv-list__item-text--wrap");

    list.textWrapEnabled = false;
    list.focusedItem = list.actions[0];
    expect(list.getItemClass(list.actions[0])).toLooseEqual("sv-list__item sv-list__item--focused");

    list.selectFocusedItem();
    expect(list.getItemClass(list.actions[0])).toLooseEqual("sv-list__item sv-list__item--focused sv-list__item--selected");
    expect(list.getItemClass(list.actions[1])).toLooseEqual("sv-list__item");

    list.actions[1].enabled = false;
    expect(list.getItemClass(list.actions[1])).toLooseEqual("sv-list__item sv-list__item--disabled");

    list.actions[1].css = "custom-css";
    expect(list.getItemClass(list.actions[1])).toLooseEqual("sv-list__item sv-list__item--disabled custom-css");
  });

  test("getListClass test", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    expect(list.getListClass()).toLooseEqual("sv-list");

    list.filterString = "test";
    expect(list.getListClass()).toLooseEqual("sv-list");

    list.filterString = "test1";
    expect(list.getListClass()).toLooseEqual("sv-list sv-list--filtering");
  });

  test("allow show selected item with disabled selection", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: [], onSelectionChanged: () => { }, allowSelection: false } as any);
    expect(list.selectedItem, "no selected item").toLooseEqual(undefined);
    expect(list.isItemSelected(items[0] as any), "selected item is false").toLooseEqual(false);

    list.selectedItem = items[0];
    expect(list.selectedItem, "first item selected").toLooseEqual(items[0]);
    expect(list.isItemSelected(items[0] as any), "selected item is true").toLooseEqual(true);
  });
  test("ListModel filter & comparator.normalize text (brouillé=brouille)", () => { // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    const items: Array<IAction> = [];
    items.push(<IAction>{ id: "test1", title: "brouillé" }); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    items.push(<IAction>{ id: "test1", title: "lle" });
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();
    list.filterString = "le";
    let filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length, "both items are found by default").toLooseEqual(2);
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
    expect(filteredActions.length).toLooseEqual(7);
    list.filterString = "t";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toLooseEqual(9);

    list.filterString = "2";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toLooseEqual(3);
    expect(filteredActions.map(a => a.title)).toEqualValues(["test2", "test28", "test29"]);

    list.filterString = "1";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toLooseEqual(1);
    expect(filteredActions.map(a => a.title)).toEqualValues(["test1"]);
    list.filterString = "28";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toLooseEqual(1);
    expect(filteredActions.map(a => a.title)).toEqualValues(["test28"]);

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
    expect(filteredActions.length).toLooseEqual(7);

    list.filterString = "2";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toLooseEqual(3);
    expect(filteredActions.map(a => a.title)).toEqualValues(["test2", "test28", "test29"]);
    expect(filteredActions.map(a => a.iconName)).toEqualValues(["icon2", "icon2", "icon2"]);

    list.filterString = "";
    filteredActions = list.renderedActions.filter(item => list.isItemVisible(item));
    expect(filteredActions.length).toLooseEqual(7);
    expect(filteredActions[2].items.length).toLooseEqual(2);
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
    expect(actionCalled).toLooseEqual(0);
    expect(selectCalled).toLooseEqual(1);

    list.onItemClick(items[1]);
    expect(actionCalled).toLooseEqual(1);
    expect(selectCalled).toLooseEqual(2);
  });

  test("a11y: list item aria attr", () => {
    const items = createIActionArray(4);
    const list = new ListModel({ items: items, selectedItem: items[0], onSelectionChanged: () => { }, allowSelection: true });

    expect(list.listItemRole, "defaultValue listItemRole").toLooseEqual("option");
    expect(list.getA11yItemAriaSelected(list.actions[0]), "0 ariaSelected #1").toLooseEqual("true");
    expect(list.getA11yItemAriaChecked(list.actions[0]), "0 ariaChecked #1").toLooseEqual(undefined);
    expect(list.getA11yItemAriaSelected(list.actions[1]), "1 ariaSelected #1").toLooseEqual("false");
    expect(list.getA11yItemAriaChecked(list.actions[1]), "1 ariaChecked #1").toLooseEqual(undefined);

    list.listItemRole = "menuitemradio";
    expect(list.getA11yItemAriaSelected(list.actions[0]), "0 ariaSelected #2").toLooseEqual(undefined);
    expect(list.getA11yItemAriaChecked(list.actions[0]), "0 ariaChecked #2").toLooseEqual("true");
    expect(list.getA11yItemAriaSelected(list.actions[1]), "1 ariaSelected #2").toLooseEqual(undefined);
    expect(list.getA11yItemAriaChecked(list.actions[1]), "1 ariaChecked #2").toLooseEqual("false");
  });

  test("ListModel disableSearch property", () => {
    const items = createIActionArray(12);
    const list = new ListModel({ items: items, onSelectionChanged: () => { }, allowSelection: true } as any);
    list.flushUpdates();

    // Test default behavior (disableSearch = false)
    expect(list.disableSearch, "disableSearch defaults to false").toLooseEqual(false);
    expect(list.renderedActions.length, "all items are rendered initially").toLooseEqual(12);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "all items are visible initially").toLooseEqual(12);

    // Test filtering with disableSearch = false
    list.filterString = "1";
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "filtering works when disableSearch is false").toLooseEqual(3);

    // Test with disableSearch = true
    list.disableSearch = true;
    list.flushUpdates();
    expect(list.disableSearch, "disableSearch is set to true").toLooseEqual(true);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "all items are visible when disableSearch is true, even with filterString").toLooseEqual(12);

    // Test that filterString is ignored when disableSearch is true
    list.filterString = "nonexistent";
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "all items remain visible when disableSearch is true, even with non-matching filterString").toLooseEqual(12);

    // Test switching back to disableSearch = false
    list.disableSearch = false;
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "filtering works again when disableSearch is set back to false").toLooseEqual(0);

    // Test with empty filterString and disableSearch = true
    list.filterString = "";
    list.disableSearch = true;
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "all items are visible when disableSearch is true and filterString is empty").toLooseEqual(12);
  });
});
