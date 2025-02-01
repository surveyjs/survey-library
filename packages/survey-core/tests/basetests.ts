import { ComputedUpdater, Base, Event, ArrayChanges } from "../src/base";
import { ItemValue } from "../src/itemvalue";
import { ILocalizableOwner, LocalizableString } from "../src/localizablestring";
import { property, Serializer } from "../src/jsonobject";
import { SurveyModel } from "../src/survey";
import { Action } from "../src/actions/action";
import { findParentByClassNames } from "../src/utils/utils";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { settings } from "../src/settings";
export * from "../src/localization/german";

export default QUnit.module("Base");

QUnit.test("Event hasEvents property", function (assert) {
  var event = new Event<() => any, any, any>();
  assert.equal(event.isEmpty, true, "There is no callbacks at the beginning");
  var func = () => { };
  event.add(func);
  assert.equal(event.isEmpty, false, "a callbacks is added");
  event.remove(func);
  assert.equal(event.isEmpty, true, "a callbacks is removed");
});
QUnit.test("Event no parameters", function (assert) {
  var event = new Event<() => any, any, any>();
  var counter = 0;
  var func = () => {
    counter++;
  };
  event.add(func);
  event.fire(null, null);
  assert.equal(counter, 1, "function called one time");
  event.remove(func);
  event.fire(null, null);
  assert.equal(counter, 1, "function should not be called the second time");
});
QUnit.test("Event with parameters", function (assert) {
  var event = new Event<(s: number, params) => any, any, any>();
  var counter = 0;
  event.add((s: number, params) => {
    counter += s;
    params.allow = true;
  });
  var options = { allow: false };
  assert.equal(options.allow, false, "Initial options.allow == false");
  event.fire(5, options);
  assert.equal(options.allow, true, "function should change allow to true");
  assert.equal(counter, 5, "function should increase counter on 5");
});
QUnit.test("Do not add function with the same instance several times", function (
  assert
) {
  var event = new Event<() => any, any, any>();
  var counter = 0;
  var func = () => {
    counter++;
  };
  event.add(func);
  event.add(func);
  event.add(func);
  event.fire(null, null);
  assert.equal(counter, 1, "function called one time");
  event.remove(func);
  event.fire(null, null);
  assert.equal(counter, 1, "function should not be called the second time");
});

QUnit.test("Item value", function (assert) {
  var value = new ItemValue("Item");
  assert.equal(value.value, "Item", "simple text value");
  assert.equal(value.locText.renderedHtml, "Item", "get text from value");
  value.text = "My text";
  assert.equal(value.text, "My text", "get text from text property");
  value.text = null;
  assert.equal(value.locText.renderedHtml, "Item", "get text from value");
  value.value = 5;
  assert.equal(
    value.locText.renderedHtml,
    "5",
    "get text from value and convert it to string"
  );
  value.value = null;
  assert.equal(value.value, null, "value was set to null");
  assert.equal(value.calculatedText, null, "text is null if value is null");
  value.value = "Item|Text Item";
  assert.equal(value.value, "Item", "use the text separator: value");
  assert.equal(
    value.calculatedText,
    "Text Item",
    "use the text separator: text"
  );
});
QUnit.test("ItemValue.setData()", function (assert) {
  var items = new Array<ItemValue>();
  ItemValue.setData(items, [
    { value: 7, text: "Item 1" },
    5,
    "item",
    "value1|text1",
  ]);
  assert.equal(items.length, 4, "there are 4 items");
  assert.equal(
    items[1].value,
    5,
    "set correct value property for the second item"
  );
  assert.equal(
    items[1].calculatedText,
    "5",
    "set correct text property for the second item"
  );
  assert.equal(
    items[2].value,
    "item",
    "set correct value property for the third item"
  );
  assert.equal(
    items[2].calculatedText,
    "item",
    "set correct text property for the third item"
  );
  assert.equal(
    items[3].value,
    "value1",
    "set correct value property for the fourth item"
  );
  assert.equal(
    items[3].calculatedText,
    "text1",
    "set correct text property for the fourth item"
  );
});
QUnit.test("ItemValue.setData() empty text", function (assert) {
  var items = new Array<ItemValue>();
  items.push(new ItemValue(1));
  items.push(new ItemValue(2));
  var newItems = new Array<ItemValue>();
  ItemValue.setData(newItems, items);
  assert.equal(newItems.length, 2, "there are 2 items");
  assert.equal(newItems[0].value, 1, "the first value is 1");
  assert.equal(newItems[0].hasText, false, "There is no text");
});
QUnit.test("ItemValue.setData() boolean", function (assert) {
  var items = new Array<ItemValue>();
  ItemValue.setData(items, [
    { value: true, text: "Yes" },
    { value: false, text: "No" },
  ]);
  assert.equal(items.length, 2, "there are 2 items");
  assert.equal(
    items[0].value,
    true,
    "set correct value property for the first item"
  );
  assert.equal(
    items[0].calculatedText,
    "Yes",
    "set correct text property for the first item"
  );
  assert.equal(
    items[1].value,
    false,
    "set correct value property for the second item"
  );
  assert.equal(
    items[1].calculatedText,
    "No",
    "set correct text property for the second item"
  );
});
QUnit.test("ItemValue.setData() ItemValue with type", function (assert) {
  Serializer.addClass("imageitemvalue1", [], null, "itemvalue");
  var items = new Array<ItemValue>();
  var data = [
    new ItemValue(true, "Yes", "imageitemvalue1"),
    new ItemValue(false, "No", "imageitemvalue1"),
  ];
  ItemValue.setData(items, data);
  assert.equal(items.length, 2, "there are 2 items");
  assert.equal(
    items[0].value,
    true,
    "set correct value property for the first item"
  );
  assert.equal(
    items[0].text,
    "Yes",
    "set correct text property for the first item"
  );
  assert.equal(
    items[1].value,
    false,
    "set correct value property for the second item"
  );
  assert.equal(
    items[1].text,
    "No",
    "set correct text property for the second item"
  );
});
QUnit.test("ItemValue.getData()", function (assert) {
  var items = new Array<ItemValue>();
  items.push(new ItemValue(7, "Item 1"));
  items.push(new ItemValue(5));
  items.push(new ItemValue("item"));
  var data = ItemValue.getData(items);
  ItemValue.setData(items, [{ value: 7, text: "Item 1" }, 5, "item"]);
  assert.deepEqual(
    data,
    [{ value: 7, text: "Item 1" }, 5, "item"],
    "convert some items to simple values"
  );
  var item = new ItemValue(1);
  assert.equal(item.getData(), 1, "Just value");
  item.visibleIf = "{item}=1";
  assert.deepEqual(
    item.getData(),
    { value: 1, visibleIf: "{item}=1" },
    "Object value + visibleIf"
  );
});
QUnit.test("ItemValue.getItemByValue()", function (assert) {
  var items = new Array<ItemValue>();
  items.push(new ItemValue(7, "Item 1"));
  items.push(new ItemValue(5));
  items[1]["custom"] = "mydata";
  items.push(new ItemValue("item"));
  var item = ItemValue.getItemByValue(items, 5);
  assert.equal(item.value, 5, "find item correctly");
  assert.equal(item["custom"], "mydata", "get custom data correctly");
  item = ItemValue.getItemByValue(items, 55);
  assert.equal(item, null, "there is no item by this value");
  items.push(new ItemValue("", "empty"));
  item = ItemValue.getItemByValue(items, undefined);
  assert.equal(item.text, "empty", "returns empty value");
});

QUnit.test("ItemValue.locText property on demand", function (assert) {
  const hasLocText = (item: ItemValue): boolean => {
    return !!item["locTextValue"];
  };
  const item = new ItemValue(1);
  assert.notOk(hasLocText(item), "locText is not created #1");
  assert.equal(item.textOrHtml, "1", "textOrHtml is 1");
  assert.equal(item.hasText, false, "has text is false");
  assert.deepEqual(item.toJSON(), { value: 1 }, "toJSON is correct");
  assert.notOk(hasLocText(item), "locText is not created #2");
  item.text = "abc";
  assert.ok(hasLocText(item), "locText is not created #3");
});

class BaseTester extends Base implements ILocalizableOwner {
  constructor() {
    super();
    var self = this;
    this.createNewArray(
      "items",
      function (newItem) {
        newItem.isNew = true;
      },
      function (deletedItem) {
        deletedItem.isDeleted = true;
      }
    );
    this.createLocalizableString("title", this);
  }
  public get value1(): number {
    return this.getPropertyValue("value1", 1);
  }
  public set value1(val: number) {
    this.setPropertyValue("value1", val);
  }
  public get items(): Array<any> {
    return this.getPropertyValue("items");
  }
  public get title(): string {
    return this.getLocalizableStringText("title", "default");
  }
  public set title(val: string) {
    this.setLocalizableStringText("title", val);
  }
  getLocale(): string {
    return "en";
  }
  getMarkdownHtml(text: string): string {
    return text;
  }
  getRenderer(name: string): string {
    return undefined;
  }
  getRendererContext(locStr: LocalizableString): any {
    return undefined;
  }
  getProcessedText(text: string): string {
    return text;
  }
}

QUnit.test("Base simple propety value", function (assert) {
  var base = new BaseTester();
  var counter = 0;
  var propertyName;
  var oldValue, newValue;
  base.onPropertyChanged.add(function (sender, options) {
    counter++;
    propertyName = options.name;
    oldValue = options.oldValue;
    newValue = options.newValue;
  });
  assert.equal(base.value1, 1, "Use the default value");
  base.value1 = 5;
  assert.equal(base.value1, 5, "It has been assign correctly");
  assert.equal(counter, 1, "event called one time");
  assert.equal(propertyName, "value1", "value1 has been changed");
  assert.notOk(oldValue, "oldValue is undefined");
  assert.equal(newValue, 5, "newValue is 5");
});

QUnit.test("Base hash values - get/set PropertyValueCoreHandler", function (
  assert
) {
  var base = new BaseTester();
  var counter = 0;
  var val;
  base.setPropertyValueCoreHandler = (h, k, v) => {
    counter++;
    val = v;
  };
  base.getPropertyValueCoreHandler = (h, k) => {
    counter++;
    return val;
  };

  base.value1 = 5;
  assert.equal(counter, 2);
  assert.equal(val, 5);
  assert.equal(base.value1, 5);
  assert.equal(counter, 3);
});

QUnit.test("Base localizable string", function (assert) {
  var base = new BaseTester();
  var counter = 0;
  var propertyName;
  var oldValue, newValue;
  base.onPropertyChanged.add(function (sender, options) {
    counter++;
    propertyName = options.name;
    oldValue = options.oldValue;
    newValue = options.newValue;
  });
  assert.equal(base.title, "default", "Use the default value");
  base.title = "value1";
  assert.equal(base.title, "value1", "It has been assign correctly");
  assert.equal(counter, 1, "event called one time");
  assert.equal(propertyName, "title", "title has been changed");
  assert.notOk(oldValue, "oldValue is undefined");
  assert.equal(newValue, "value1", "newValue is value1");
});

QUnit.test("Base array propety value, push/splice/pop", function (assert) {
  var base = new BaseTester();
  var counter = 0;
  var propertyName;
  base.onPropertyChanged.add(function (sender, options) {
    counter++;
    propertyName = options.name;
  });
  base.items.push({ value: 1 });
  assert.equal(base.items.length, 1, "There is one item");
  assert.equal(base.items[0].isNew, true, "isNew property is set");
  assert.equal(counter, 1, "event called one time");
  assert.equal(propertyName, "items", "items has been changed");
  var item = base.items[0];
  base.items.splice(0, 1, { value: 2 }, { value: 3 });
  assert.equal(base.items.length, 2, "There are two items");
  assert.equal(item.isDeleted, true, "First Item is deleted");
  assert.equal(base.items[0].isNew, true, "Item1, isNew property is set");
  assert.equal(base.items[1].isNew, true, "Item2, isNew property is set");
  assert.equal(counter, 2, "event called two times");
  assert.equal(propertyName, "items", "items has been changed");

  item = base.items[0];
  base.items.pop();
  base.items.pop();
  assert.equal(base.items.length, 0, "There is no items");
  assert.equal(item.isDeleted, true, "Item is deleted");
  assert.equal(counter, 4, "event called 4 times, pop is called two times");
  assert.equal(propertyName, "items", "items has been changed");
});
QUnit.test("Base array propety value, set value", function (assert) {
  var base = new BaseTester();
  var counter = 0;
  var propertyName;
  base.onPropertyChanged.add(function (sender, options) {
    counter++;
    propertyName = options.name;
  });
  base.setPropertyValue("items", [{ value1: 1 }, { value2: 2 }]);
  assert.equal(base.items.length, 2, "There are two items");
  assert.equal(base.items[0].isNew, true, "first item, isNew property is set");
  assert.equal(base.items[1].isNew, true, "second item, isNew property is set");
  assert.equal(counter, 1, "event called one time");
  assert.equal(propertyName, "items", "items has been changed");

  base.items.push({ value: 3 });
  assert.equal(base.items.length, 3, "There are 3 items");
  assert.equal(
    base.items[2].isNew,
    true,
    "The third  item, isNew property is set"
  );
  assert.equal(counter, 2, "event called two times");
});

QUnit.test("Base onPropertyValueChangedCallback", function (assert) {
  var base = new BaseTester();
  var counter = 0;

  base.onPropertyValueChangedCallback = (
    name: string,
    oldValue: any,
    newValue: any,
    sender: Base,
    arrayChanges: ArrayChanges
  ) => {
    counter++;
  };

  assert.equal(counter, 0, "initial");

  base.setPropertyValue("some", "some");

  assert.equal(counter, 1, "callback called");
});

QUnit.test("Base propertyValueChanged itemValue", function (assert) {
  var itemValue = new ItemValue("Item");
  var counter = 0;

  itemValue.onPropertyValueChangedCallback = (
    name: string,
    oldValue: any,
    newValue: any,
    sender: Base,
    arrayChanges: ArrayChanges
  ) => {
    counter++;
  };

  assert.equal(counter, 0, "initial");

  itemValue.text = "new";

  assert.equal(counter, 1, "callback called");
});

QUnit.test("Base propertyValueChanged colOwner - column undo/redo", function (
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [{ name: "col1" }],
        rows: [1, 2],
      },
    ],
  });
  var matrix = <any>survey.getQuestionByName("q1");
  var counter1 = 0;
  var counter2 = 0;
  survey.onPropertyValueChangedCallback = (
    name: string,
    oldValue: any,
    newValue: any,
    sender: Base,
    arrayChanges: ArrayChanges
  ) => {
    if (name == "name" && oldValue == "col1" && newValue == "col2") counter1++;
    if (name == "value") counter2++;
  };

  assert.equal(counter1, 0, "initial");
  assert.equal(counter2, 0, "initial");
  matrix.columns[0].name = "col2";
  assert.equal(counter1, 1, "callback colOwner called");
  assert.equal(counter2, 0, "callback locOwner not called");
  matrix.rows[0].value = 3;
  assert.equal(counter1, 1, "callback colOwner is the same");
  assert.equal(counter2, 1, "callback locOwner called");
});
QUnit.test("Base onArrayChanged", function (assert) {
  var base = new BaseTester();
  var counter = 0;
  var arrayChanges: ArrayChanges = null;
  (<any>base["items"]).onArrayChanged = function (arCh: ArrayChanges): void {
    arrayChanges = arCh;
    counter++;
  };

  assert.equal(counter, 0, "initial");
  base.items.push(new ItemValue(1));

  assert.equal(counter, 1, "onArrayChanged is changed");
  assert.equal(arrayChanges.index, 0, "added into 0 index");
  assert.deepEqual(arrayChanges.itemsToAdd, [base.items[0]], "added items");
});
QUnit.test("Change value to array and then to undefined", function (assert) {
  var base = new Base();
  base.setPropertyValue("testValue", [1, 2, 3]);
  assert.deepEqual(base.getPropertyValue("testValue"), [1, 2, 3]);
  base.setPropertyValue("testValue", undefined);
  assert.notOk(base.getPropertyValue("testValue"));
});
QUnit.test("Change value to array and then to string", function (assert) {
  var base = new BaseTester();
  base.setPropertyValue("testValue", [1, 2, 3]);
  assert.deepEqual(base.getPropertyValue("testValue"), [1, 2, 3]);
  base.setPropertyValue("testValue", "abc");
  assert.equal(base.getPropertyValue("testValue"), "abc");
});

class BaseTester1 extends Base {
  @property({ defaultValue: 1 }) propA: number;
  @property() propS: string;
}
class BaseTester2 extends Base {
  @property({ defaultValue: 2 }) propB: number;
}
class BaseTester3 extends Base {
  @property() propC: number;
}
class BaseTester4 extends Base {
  getMarkdownHtml = (val) => val;
  @property() propC: string;
  @property({ localizable: true }) propL: string;
}
QUnit.test("Collect dependencies", function (assert) {
  const base1 = new BaseTester1();
  const base2 = new BaseTester2();
  const calc = () => base1.propA + base2.propB;
  const base3 = new BaseTester3();
  let updaterCallCount = 0;
  const updater = () => {
    base3.propC = calc();
    updaterCallCount++;
  };

  Base.startCollectDependencies(updater, base3, "propC");
  updater();
  const deps = Base.finishCollectDependencies();
  assert.equal(deps.dependencies.length, 2, "two dependencies");
  assert.equal(deps.dependencies[0].obj, base1);
  assert.equal(deps.dependencies[0].prop, "propA");
  assert.equal(deps.dependencies[1].obj, base2);
  assert.equal(deps.dependencies[1].prop, "propB");

  assert.equal(updaterCallCount, 1, "first time calculation");
  assert.equal(base3.propC, 3);
  base1.propA = 2;
  assert.equal(updaterCallCount, 2, "propA changed");
  assert.equal(base3.propC, 4);
  base2.propB = 3;
  assert.equal(updaterCallCount, 3, "propB changed");
  assert.equal(base3.propC, 5);

  deps.dispose();
  base1.propA = 1;
  assert.equal(updaterCallCount, 3, "no updater calls");
  assert.equal(base3.propC, 5, "no value updates");
});
QUnit.test("Collect dependencies automatically", function (assert) {
  const base1 = new BaseTester1();
  const base2 = new BaseTester2();
  const base3 = new BaseTester3();
  let updaterCallCount = 0;
  const updater = new ComputedUpdater<number>(() => {
    updaterCallCount++;
    return base1.propA + base2.propB;
  });
  base3.propC = <any>updater;

  assert.equal(updaterCallCount, 1, "first time calculation");
  assert.equal(base3.propC, 3, "1 + 2");
  base1.propA = 2;
  assert.equal(updaterCallCount, 2, "propA changed");
  assert.equal(base3.propC, 4, "2 + 2");
  base2.propB = 3;
  assert.equal(updaterCallCount, 3, "propB changed");
  assert.equal(base3.propC, 5, "2 + 3");

  updater.dispose();
  base1.propA = 1;
  assert.equal(updaterCallCount, 3, "no updater calls");
  assert.equal(base3.propC, 5, "no value updates");
});
QUnit.test("Action visibility update", function (assert) {
  const base1 = new BaseTester1();
  const base2 = new BaseTester2();
  let updaterCallCount = 0;
  const updater = new ComputedUpdater<boolean>(() => {
    updaterCallCount++;
    const isProp2 = !!base2.propB;
    return !!base1.propA && isProp2;
  });
  base1.propA = 0;
  base2.propB = 1;
  const action = new Action(<any>{
    visible: <any>updater,
  });

  assert.equal(updaterCallCount, 1, "first time calculation");
  assert.equal(action.visible, false);
  base1.propA = 1;
  assert.equal(updaterCallCount, 2, "propA changed to true");
  assert.equal(action.visible, true);
  base2.propB = 0;
  assert.equal(updaterCallCount, 3, "propB changed to false");
  assert.equal(action.visible, false);
  base2.propB = 1;
  assert.equal(updaterCallCount, 4, "propB changed to true");
  assert.equal(action.visible, true);

  updater.dispose();
  base1.propA = 0;
  assert.equal(updaterCallCount, 4, "no updater calls");
  assert.equal(action.visible, true);
});
QUnit.test("Action enable active update same function", function (assert) {
  const base1 = new BaseTester1();
  let updaterCallCount1 = 0;
  let updaterCallCount2 = 0;
  base1.propA = 0;
  const updater1 = new ComputedUpdater<boolean>(() => {
    updaterCallCount1++;
    return !!base1.propA;
  });
  const updater2 = new ComputedUpdater<boolean>(() => {
    updaterCallCount2++;
    return !!base1.propA;
  });
  const action = new Action(<any>{
    active: <any>updater1,
    enabled: <any>updater2,
  });

  const dependencies1 = updater1["getDependencies"]();
  assert.equal(dependencies1.dependencies.length, 1, "active dependencies count = 1");
  const dependencies2 = updater1["getDependencies"]();
  assert.equal(dependencies2.dependencies.length, 1, "enabled dependencies count = 1");

  assert.equal(updaterCallCount1, 1, "first time calculation - active");
  assert.equal(updaterCallCount2, 1, "first time calculation - enabled");
  assert.equal(action.active, false, "active 1");
  assert.equal(action.enabled, false, "enabled 1");
  base1.propA = 1;
  assert.equal(updaterCallCount1, 2, "propA changed to true - active");
  assert.equal(updaterCallCount2, 2, "propA changed to true - enabled");
  assert.equal(action.active, true, "active 2");
  assert.equal(action.enabled, true, "enabled 2");
  base1.propA = 0;
  assert.equal(updaterCallCount1, 3, "propA changed to false - active");
  assert.equal(updaterCallCount2, 3, "propA changed to false - enabled");
  assert.equal(action.active, false, "active 3");
  assert.equal(action.enabled, false, "enabled 3");
});
QUnit.test("Update via function - nested dependencies", function (assert) {
  const base1 = new BaseTester1();
  let updaterCallCount1 = 0;
  const survey = new SurveyModel();
  base1.propS = <any>new ComputedUpdater(() => {
    updaterCallCount1++;
    return survey.calculateWidthMode();
  });

  assert.equal(updaterCallCount1, 1, "first time calculation - static");
  assert.equal(base1.propS, "static");

  survey.widthMode = "responsive";
  assert.equal(updaterCallCount1, 2, "update called - responsive");
  assert.equal(base1.propS, "responsive");
});
QUnit.test("Unsubscribe dependencies on dispose", function (assert) {
  const base1 = new BaseTester1();
  const base2 = new BaseTester2();
  const base3 = new BaseTester3();
  let updaterCallCount = 0;
  const updater = new ComputedUpdater<number>(() => {
    updaterCallCount++;
    return base1.propA + base2.propB;
  });
  base3.propC = <any>updater;

  assert.equal(Object.keys(base3.dependencies).length, 1, "one computed");
  assert.equal(Object.keys(base3.dependencies)[0], "propC", "propC");
  assert.equal(base3.dependencies["propC"]["getDependencies"]().dependencies.length, 2, "depends on two properties");

  assert.equal(base1["onPropChangeFunctions"].length, 1, "base1 one subscription");
  assert.equal(base1["onPropChangeFunctions"][0].name, "propA", "base1 one subscription to A");
  assert.equal(base2["onPropChangeFunctions"].length, 1, "base2 one subscription");
  assert.equal(base2["onPropChangeFunctions"][0].name, "propB", "base2 one subscription to B");

  assert.equal(updaterCallCount, 1, "first time calculation");
  assert.equal(base3.propC, 3, "1 + 2");
  base1.propA = 2;
  assert.equal(updaterCallCount, 2, "propA changed");
  assert.equal(base3.propC, 4, "2 + 2");

  base3.dispose();

  assert.equal(Object.keys(base3.dependencies).length, 1, "one computed");
  assert.equal(base3.dependencies["propC"]["getDependencies"](), undefined, "no dependencies");

  assert.equal(base1["onPropChangeFunctions"].length, 0, "base1 no subscriptions");
  assert.equal(base2["onPropChangeFunctions"].length, 0, "base2 no subscriptions");

  base1.propA = 3;
  assert.equal(updaterCallCount, 2, "updater doesn't react on changes");
  assert.equal(base3.propC, 4, "no value updates");
});

QUnit.test("findParentByClassNames function", function (assert) {
  const parentElement = document.createElement("div");
  parentElement.classList.add("class1");
  parentElement.classList.add("class22");

  const element = document.createElement("div");
  element.classList.add("class1");
  element.classList.add("class2");

  parentElement.appendChild(element);

  assert.equal(findParentByClassNames(element, ["class1", "class2", ""]), element);
  assert.equal(findParentByClassNames(element, ["class1", "class22", ""]), parentElement);

  parentElement.remove();
});
QUnit.test("Subscribe localizable property", function (assert) {
  const base4 = new BaseTester4();
  let updaterCallCount1 = 0;
  base4.propC = <any>new ComputedUpdater(() => {
    updaterCallCount1++;
    return base4.propL;
  });

  assert.equal(base4.propC, "", "initial empty string");
  assert.equal(updaterCallCount1, 1, "first time calculation - static");

  base4.propL = "localizable value";
  assert.equal(base4.propC, "localizable value");
  assert.equal(updaterCallCount1, 2, "update called - localizable value");
});
QUnit.test("base.hasDefaultPropertyValue, base.getDefaultPropertyValue and base.resetPropertyValue()", function (assert) {
  const question = new QuestionDropdownModel("q1");
  assert.equal(question.hasDefaultPropertyValue("width"), false, "question.width has no default value");
  assert.notOk(question.getDefaultPropertyValue("width"), "question.width default value is undefined");
  question.width = "200px";
  question.resetPropertyValue("width");
  assert.notOk(question.width, "width property value is empty");

  assert.equal(question.hasDefaultPropertyValue("minWidth"), true, "question.minWidth has default value");
  assert.ok(question.getDefaultPropertyValue("minWidth"), "question.minWidth default value is 300px");
  question.minWidth = "200px";
  assert.equal(question.minWidth, "200px", "minWidth property is set to 200px");
  question.resetPropertyValue("minWidth");
  assert.equal(question.minWidth, "300px", "minWidth property value is reset, #1");
  question.minWidth = "";
  assert.strictEqual(question.minWidth, "", "minWidth property value is empty string");
  question.resetPropertyValue("minWidth");
  assert.equal(question.minWidth, "300px", "minWidth property value is reset, #2");

  assert.equal(question.hasDefaultPropertyValue("placeholder"), true, "question.placeholder has default value");
  assert.equal(question.getDefaultPropertyValue("placeholder"), "Select...", "question.placeholder default value");
  assert.equal(question.placeholder, "Select...", "question.placeholder value");
  question.placeholder = "abc";
  assert.equal(question.placeholder, "abc", "placeholder property is set to 200px");
  question.resetPropertyValue("placeholder");
  assert.equal(question.placeholder, "Select...", "placeholder property value is reset, #1");
  question.placeholder = "";
  assert.strictEqual(question.placeholder, "", "placeholder property value is empty string");
  question.resetPropertyValue("placeholder");
  assert.equal(question.placeholder, "Select...", "placeholder property value is reset, #2");
});
QUnit.test("base.resetPropertyValue() for localization string", function (assert) {
  const survey = new SurveyModel();
  assert.equal(survey.completeText, "Complete", "default value");
  survey.completeText = "test";
  assert.equal(survey.completeText, "test", "set value");
  survey.resetPropertyValue("completeText");
  assert.equal(survey.completeText, "Complete", "default value, #2");
  const prop = Serializer.findProperty("survey", "completeText");
  prop.setValue(survey, "", null);
  assert.equal(survey.completeText, "", "Empty string after prop.setValue func");
});
QUnit.test("base.resetPropertyValue() for localization string, #2, bug#7388", function (assert) {
  const survey = new SurveyModel();
  assert.equal(survey.completeText, "Complete", "default value");
  survey.completeText = "test en";
  assert.equal(survey.completeText, "test en", "set value en");
  survey.locale = "de";
  survey.completeText = "test de";
  assert.equal(survey.completeText, "test de", "set value de");
  survey.resetPropertyValue("completeText");
  assert.equal(survey.completeText, "Abschließen", "default value de");
  survey.locale = "";
  assert.equal(survey.completeText, "Complete", "default value en");
});

QUnit.test("check animationAllowed", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        name: "q1",
        type: "text"
      }
    ]
  });
  const question = survey.getAllQuestions()[0];
  assert.notOk(question.animationAllowed);
  settings.animationEnabled = true;
  question.supportOnElementRerenderedEvent = false;
  assert.ok(question.animationAllowed);
  question.blockAnimations();
  assert.notOk(question.animationAllowed);
  question.blockAnimations();
  assert.notOk(question.animationAllowed);
  question.releaseAnimations();
  assert.notOk(question.animationAllowed);
  question.releaseAnimations();
  assert.ok(question.animationAllowed);
  settings.animationEnabled = false;
});

QUnit.test("check afterRerender function", (assert) => {
  const survey = new SurveyModel({});
  assert.notOk(!!survey.onElementRerendered);
  survey.afterRerender();
  survey.enableOnElementRerenderedEvent();
  let log = "";
  survey.onElementRerendered.add((_, options) => log += `->callback: ${!!options.isCancel}`);
  survey.afterRerender();
  assert.equal(log, "->callback: false");
  log = "";
  survey.disableOnElementRerenderedEvent();
  assert.equal(log, "->callback: true");
  log = "";
  survey.afterRerender();
  assert.equal(log, "");
});

QUnit.test("check default value doesn't exist on getPropertyValueDirectly", (assert) => {
  Serializer.addProperty("itemvalue", {
    name: "score:number",
    category: "general",
    displayName: "Score",
    default: 1,
    visibleIndex: 5,
  });
  const itemValue = new ItemValue("item1");
  assert.equal(itemValue.getPropertyValue("score"), 1, "default value should be returned");
  itemValue.setPropertyValue("score", 1);
  assert.equal((itemValue as any).getPropertyValueWithoutDefault("score"), undefined, "default value shouldn't be set");
  Serializer.removeProperty("itemvalue", "score");
});
QUnit.test("check default 0 value doesn't exist on getPropertyValueDirectly", (assert) => {
  Serializer.addProperty("itemvalue", {
    name: "score:number",
    category: "general",
    displayName: "Score",
    default: 0,
    visibleIndex: 5,
  });
  const itemValue = new ItemValue("item1");
  assert.equal(itemValue.getPropertyValue("score"), 0, "default value should be returned");
  itemValue.setPropertyValue("score", 0);
  assert.equal((itemValue as any).getPropertyValueWithoutDefault("score"), undefined, "default value shouldn't be set");
  Serializer.removeProperty("itemvalue", "score");
});