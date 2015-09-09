/// <reference path="../src/base.ts" />
var dxSurvey;
(function (dxSurvey) {
    var Tests;
    (function (Tests) {
        QUnit.module("Base");
        QUnit.test("Event no parameters", function (assert) {
            var event = new dxSurvey.Event();
            var counter = 0;
            var func = function () { counter++; };
            event.add(func);
            event.fire(null, null);
            assert.equal(counter, 1, "function called one time");
            event.remove(func);
            event.fire(null, null);
            assert.equal(counter, 1, "function should not be called the second time");
        });
        QUnit.test("Event with parameters", function (assert) {
            var event = new dxSurvey.Event();
            var counter = 0;
            event.add(function (s, params) { counter += s; params.allow = true; });
            var options = { allow: false };
            assert.equal(options.allow, false, "Initial options.allow == false");
            event.fire(5, options);
            assert.equal(options.allow, true, "function should change allow to true");
            assert.equal(counter, 5, "function should increase counter on 5");
        });
        QUnit.test("Item value", function (assert) {
            var value = new dxSurvey.ItemValue("Item");
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
            var items = new Array();
            dxSurvey.ItemValue.setData(items, [{ value: 7, text: "Item 1" }, 5, "item", "value1|text1"]);
            assert.equal(items.length, 4, "there are 4 items");
            assert.equal(items[1].value, 5, "set correct value property for the second item");
            assert.equal(items[1].text, "5", "set correct text property for the second item");
            assert.equal(items[2].value, "item", "set correct value property for the third item");
            assert.equal(items[2].text, "item", "set correct text property for the third item");
            assert.equal(items[3].value, "value1", "set correct value property for the fourth item");
            assert.equal(items[3].text, "text1", "set correct text property for the fourth item");
        });
        QUnit.test("ItemValue.getData()", function (assert) {
            var items = new Array();
            items.push(new dxSurvey.ItemValue(7, "Item 1"));
            items.push(new dxSurvey.ItemValue(5));
            items.push(new dxSurvey.ItemValue("item"));
            var data = dxSurvey.ItemValue.getData(items);
            dxSurvey.ItemValue.setData(items, [{ value: 7, text: "Item 1" }, 5, "item"]);
            assert.deepEqual(data, [{ value: 7, text: "Item 1" }, 5, "item"], "convert some items to simple values");
        });
    })(Tests = dxSurvey.Tests || (dxSurvey.Tests = {}));
})(dxSurvey || (dxSurvey = {}));
