import {Event} from "../src/base";
import {ItemValue} from "../src/itemvalue";

export default QUnit.module("Base");

QUnit.test("Event hasEvents property", function (assert) {
    var event = new Event<() => any, any>();
    assert.equal(event.isEmpty, true, "There is no callbacks at the beginning");
    var func = () => {  };
    event.add(func);
    assert.equal(event.isEmpty, false, "a callbacks is added");
    event.remove(func);
    assert.equal(event.isEmpty, true, "a callbacks is removed");
});
QUnit.test("Event no parameters", function (assert) {
    var event = new Event<() => any, any>();
    var counter = 0;
    var func = () => { counter++; };
    event.add(func);
    event.fire(null, null);
    assert.equal(counter, 1, "function called one time");
    event.remove(func);
    event.fire(null, null);
    assert.equal(counter, 1, "function should not be called the second time");
});
QUnit.test("Event with parameters", function (assert) {
    var event = new Event<(s: number, params) => any, any>();
    var counter = 0;
    event.add((s: number, params) => { counter += s; params.allow = true; });
    var options = { allow: false };
    assert.equal(options.allow, false, "Initial options.allow == false");
    event.fire(5, options);
    assert.equal(options.allow, true, "function should change allow to true");
    assert.equal(counter, 5, "function should increase counter on 5");
});
QUnit.test("Item value", function (assert) {
    var value = new ItemValue("Item");
    assert.equal(value.value, "Item", "simple text value");
    assert.equal(value.text, "Item", "get text from value");
    value.text = "My text";
    assert.equal(value.text, "My text", "get text from text property");
    value.text = null;
    assert.equal(value.text, "Item", "get text from value");
    value.value = 5;
    assert.equal(value.text, "5", "get text from value and convert it to string");
    value.value = null;
    assert.equal(value.value, null, "value was set to null");
    assert.equal(value.text, null, "text is null if value is null");
    value.value = "Item|Text Item";
    assert.equal(value.value, "Item", "use the text separator: value");
    assert.equal(value.text, "Text Item", "use the text separator: text");
});
QUnit.test("ItemValue.setData()", function (assert) {
    var items = new Array<ItemValue>();
    ItemValue.setData(items, [{ value: 7, text: "Item 1" }, 5, "item", "value1|text1"]);
    assert.equal(items.length, 4, "there are 4 items");
    assert.equal(items[1].value, 5, "set correct value property for the second item");
    assert.equal(items[1].text, "5", "set correct text property for the second item");
    assert.equal(items[2].value, "item", "set correct value property for the third item");
    assert.equal(items[2].text, "item", "set correct text property for the third item");
    assert.equal(items[3].value, "value1", "set correct value property for the fourth item");
    assert.equal(items[3].text, "text1", "set correct text property for the fourth item");
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
    ItemValue.setData(items, [{ value: true, text: "Yes" }, { value: false, text: "No" }]);
    assert.equal(items.length, 2, "there are 2 items");
    assert.equal(items[0].value, true, "set correct value property for the first item");
    assert.equal(items[0].text, "Yes", "set correct text property for the first item");
    assert.equal(items[1].value, false, "set correct value property for the second item");
    assert.equal(items[1].text, "No", "set correct text property for the second item");
});
QUnit.test("ItemValue.getData()", function (assert) {
    var items = new Array<ItemValue>();
    items.push(new ItemValue(7, "Item 1"));
    items.push(new ItemValue(5));
    items.push(new ItemValue("item"));
    var data = ItemValue.getData(items);
    ItemValue.setData(items, [{ value: 7, text: "Item 1" }, 5, "item"]);
    assert.deepEqual(data, [{ value: 7, text: "Item 1" }, 5, "item"], "convert some items to simple values");
});

QUnit.test("ItemValue.getItemByValue()", function (assert) {
    var items = new Array<ItemValue>();
    items.push(new ItemValue(7, "Item 1"));
    items.push(new ItemValue(5));
    items[1]["custom"] = 'mydata';
    items.push(new ItemValue("item"));
    var item = ItemValue.getItemByValue(items, 5);
    assert.equal(item.value, 5, "find item correctly");
    assert.equal(item["custom"], 'mydata', "get custom data correctly");
    item = ItemValue.getItemByValue(items, 55);
    assert.equal(item, null, "there is no item by this value");
});
