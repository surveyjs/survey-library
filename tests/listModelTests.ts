import { Action, IAction } from "../src/actions/action";
import { ListModel } from "../src/list";

export default QUnit.module("List Model");
const oldValueMINELEMENTCOUNT = ListModel.MINELEMENTCOUNT;

QUnit.test("ListModel less than or equal to MINELEMENTCOUNT", function (assert) {
  ListModel.MINELEMENTCOUNT = 5;
  const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
  ];
  const list = new ListModel(items, () => { }, true);

  assert.equal(list.renderedActions.length, 4);
  assert.equal(list.renderedActions.filter(item => item.visible).length, 4);
  assert.notOk(list.needFilter);

  ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
});

QUnit.test("ListModel greater MINELEMENTCOUNT", function (assert) {
  ListModel.MINELEMENTCOUNT = 5;
  const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" },
    <IAction>{ id: "test5", title: "test5" },
    <IAction>{ id: "test6", title: "test6" },
    <IAction>{ id: "test7", title: "test7" }
  ];
  const list = new ListModel(items, () => { }, true);

  assert.equal(list.renderedActions.length, 7);
  assert.equal(list.renderedActions.filter(item => item.visible).length, 7);
  assert.ok(list.needFilter);

  list.filteredText = "test";
  assert.equal(list.renderedActions.length, 7);
  assert.equal(list.renderedActions.filter(item => item.visible).length, 7);

  list.filteredText = "1";
  assert.equal(list.renderedActions.length, 7);
  assert.equal(list.renderedActions.filter(item => item.visible).length, 1);

  ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
});

QUnit.test("ListModel reassign items", function (assert) {
  ListModel.MINELEMENTCOUNT = 5;
  const items = [
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" }
  ];
  const list = new ListModel(items, () => { }, true);

  assert.equal(list.renderedActions.length, 4);
  assert.equal(list.renderedActions.filter(item => item.visible).length, 4);
  assert.notOk(list.needFilter);

  list.setItems([
    <IAction>{ id: "test1", title: "test1" },
    <IAction>{ id: "test2", title: "test2" },
    <IAction>{ id: "test3", title: "test3" },
    <IAction>{ id: "test4", title: "test4" },
    <IAction>{ id: "test5", title: "test5" },
    <IAction>{ id: "test6", title: "test6" },
    <IAction>{ id: "test7", title: "test7" }
  ]);

  assert.equal(list.renderedActions.length, 7);
  assert.equal(list.renderedActions.filter(item => item.visible).length, 7);
  assert.ok(list.needFilter);

  ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
});

QUnit.test("hasText method", assert => {
  const listModel = new ListModel([], () => { }, true);
  const item = new Action({ id: "1", title: "Best test1" });
  assert.ok(listModel["hasText"](item, "test"));
  assert.ok(listModel["hasText"](item, "1"));
  assert.notOk(listModel["hasText"](item, "test2"));
  assert.ok(listModel["hasText"](item, "Best"));
  assert.ok(listModel["hasText"](item, "best"));
});

class MyObject {
  myOnFilter(text: string) {
    this.myItems.forEach(item => {
      item.visible = !!text ? item.title.indexOf("1") !== -1 : true;
    });
  }
  constructor(public myItems: Array<IAction>) {}
}

QUnit.test("ListModel custom onFilter", assert => {
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
  const list = new ListModel([], () => { }, true, null, (text: string) => { myObject.myOnFilter(text); });
  assert.equal(list.renderedActions.length, 0);

  list.setItems(myObject.myItems);

  assert.equal(list.renderedActions.length, 7, "initial list.renderedActions");
  assert.equal(list.renderedActions.filter(item => item.visible).length, 7, "initial list.renderedActions.filter(item => item.visible)");
  assert.ok(list.needFilter, "initial list.filterableListItems");

  list.filteredText = "test";
  assert.equal(list.renderedActions.length, 7, "items filteredText = test");
  assert.equal(list.renderedActions.filter(item => item.visible).length, 1, "items.filter(item => item.visible) filteredText = test");
  assert.equal(myObject.myItems.filter(item => item.visible).length, 1, "myObject.myItems visible filteredText = test");
  assert.equal(list.renderedActions.filter(item => item.visible)[0].title, "test1", "filteredText = test");

  list.filteredText = "1";
  assert.equal(list.renderedActions.length, 7, "items filteredText = 1");
  assert.equal(list.renderedActions.filter(item => item.visible).length, 1, "items.filter(item => item.visible) filteredText = 1");
  assert.equal(myObject.myItems.filter(item => item.visible).length, 1, "myObject.myItems visible filteredText = 1");
  assert.equal(list.renderedActions.filter(item => item.visible)[0].title, "test1", "filteredText = 1");

  list.setItems(items);
  list.refresh(); // if popup is visible
  assert.equal(list.filteredText, "", "filteredText is reset");

  ListModel.MINELEMENTCOUNT = oldValueMINELEMENTCOUNT;
});
