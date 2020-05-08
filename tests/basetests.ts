import { Base, Event, ArrayChanges } from "../src/base";
import { ItemValue } from "../src/itemvalue";
import { ILocalizableOwner, LocalizableString } from "../src/localizablestring";
import { Serializer } from "../src/jsonobject";

export default QUnit.module("Base");

QUnit.test("Event hasEvents property", function(assert) {
  var event = new Event<() => any, any>();
  assert.equal(event.isEmpty, true, "There is no callbacks at the beginning");
  var func = () => {};
  event.add(func);
  assert.equal(event.isEmpty, false, "a callbacks is added");
  event.remove(func);
  assert.equal(event.isEmpty, true, "a callbacks is removed");
});
QUnit.test("Event no parameters", function(assert) {
  var event = new Event<() => any, any>();
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
QUnit.test("Event with parameters", function(assert) {
  var event = new Event<(s: number, params) => any, any>();
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
QUnit.test("Do not add function with the same instance several times", function(
  assert
) {
  var event = new Event<() => any, any>();
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

QUnit.test("Item value", function(assert) {
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
QUnit.test("ItemValue.setData()", function(assert) {
  var items = new Array<ItemValue>();
  ItemValue.setData(items, [
    { value: 7, text: "Item 1" },
    5,
    "item",
    "value1|text1"
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
QUnit.test("ItemValue.setData() empty text", function(assert) {
  var items = new Array<ItemValue>();
  items.push(new ItemValue(1));
  items.push(new ItemValue(2));
  var newItems = new Array<ItemValue>();
  ItemValue.setData(newItems, items);
  assert.equal(newItems.length, 2, "there are 2 items");
  assert.equal(newItems[0].value, 1, "the first value is 1");
  assert.equal(newItems[0].hasText, false, "There is no text");
});
QUnit.test("ItemValue.setData() boolean", function(assert) {
  var items = new Array<ItemValue>();
  ItemValue.setData(items, [
    { value: true, text: "Yes" },
    { value: false, text: "No" }
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
QUnit.test("ItemValue.setData() ItemValue with type", function(assert) {
  Serializer.addClass("imageitemvalue1", [], null, "itemvalue");
  var items = new Array<ItemValue>();
  var data = [
    new ItemValue(true, "Yes", "imageitemvalue1"),
    new ItemValue(false, "No", "imageitemvalue1")
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
QUnit.test("ItemValue.getData()", function(assert) {
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
QUnit.test("ItemValue.getItemByValue()", function(assert) {
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
});

class BaseTester extends Base implements ILocalizableOwner {
  constructor() {
    super();
    var self = this;
    this.createNewArray(
      "items",
      function(newItem) {
        newItem.isNew = true;
      },
      function(deletedItem) {
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
  getProcessedText(text: string): string {
    return text;
  }
}

QUnit.test("Base simple propety value", function(assert) {
  var base = new BaseTester();
  var counter = 0;
  var propertyName;
  var oldValue, newValue;
  base.onPropertyChanged.add(function(sender, options) {
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
  assert.notOk(oldValue, "oldValue is underfined");
  assert.equal(newValue, 5, "newValue is 5");
});

QUnit.test("Base hash values - get/set PropertyValueCoreHandler", function(
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

QUnit.test("Base localizable string", function(assert) {
  var base = new BaseTester();
  var counter = 0;
  var propertyName;
  var oldValue, newValue;
  base.onPropertyChanged.add(function(sender, options) {
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
  assert.notOk(oldValue, "oldValue is underfined");
  assert.equal(newValue, "value1", "newValue is value1");
});

QUnit.test("Base array propety value, push/splice/pop", function(assert) {
  var base = new BaseTester();
  var counter = 0;
  var propertyName;
  base.onPropertyChanged.add(function(sender, options) {
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
QUnit.test("Base array propety value, set value", function(assert) {
  var base = new BaseTester();
  var counter = 0;
  var propertyName;
  base.onPropertyChanged.add(function(sender, options) {
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

QUnit.test("Base onPropertyValueChangedCallback", function(assert) {
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

QUnit.test("Base propertyValueChanged itemValue", function(assert) {
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

QUnit.test("Base propertyValueChanged colOwner - column undo/redo", function(
  assert
) {
  var counter1 = 0;
  var counter2 = 0;
  var baseObj: any = new Base();

  baseObj.colOwner = {
    doPropertyValueChangedCallback: (
      name: string,
      oldValue: any,
      newValue: any,
      sender: Base,
      arrayChanges: ArrayChanges
    ) => {
      counter1++;
    }
  };
  baseObj.locOwner = {
    doPropertyValueChangedCallback: (
      name: string,
      oldValue: any,
      newValue: any,
      sender: Base,
      arrayChanges: ArrayChanges
    ) => {
      counter2++;
    }
  };

  assert.equal(counter1, 0, "initial");
  assert.equal(counter2, 0, "initial");

  baseObj.setPropertyValue("some", 1);
  assert.equal(counter1, 1, "callback colOwner called");
  assert.equal(counter2, 0, "callback locOwner not called");
});
