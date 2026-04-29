import { ComputedUpdater, Base, ArrayChanges, IPropertyArrayValueChangedEvent, IPropertyValueChangedEvent, EventAsync } from "../src/base";
import { Event } from "../src/event";
import { ItemValue } from "../src/itemvalue";
import { ILocalizableOwner, LocalizableString } from "../src/localizablestring";
import { Serializer } from "../src/jsonobject";
import { property } from "../src/decorators";
import { SurveyModel } from "../src/survey";
import { Action } from "../src/actions/action";
import { findParentByClassNames } from "../src/utils/dom-utils";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { settings } from "../src/settings";
import { describe, test, expect } from "vitest";
export * from "../src/localization/german";

describe("Base", () => {
  test("Event hasEvents property", () => {
    var event = new Event<() => any, any, any>();
    expect(event.isEmpty, "There is no callbacks at the beginning").toBe(true);
    var func = () => { };
    event.add(func);
    expect(event.isEmpty, "a callbacks is added").toBe(false);
    event.remove(func);
    expect(event.isEmpty, "a callbacks is removed").toBe(true);
  });
  test("Event no parameters", () => {
    var event = new Event<() => any, any, any>();
    var counter = 0;
    var func = () => {
      counter++;
    };
    event.add(func);
    event.fire(null, null);
    expect(counter, "function called one time").toBe(1);
    event.remove(func);
    event.fire(null, null);
    expect(counter, "function should not be called the second time").toBe(1);
  });
  test("Event with parameters", () => {
    var event = new Event<(s: number, params) => any, any, any>();
    var counter = 0;
    event.add((s: number, params) => {
      counter += s;
      params.allow = true;
    });
    var options = { allow: false };
    expect(options.allow, "Initial options.allow == false").toBe(false);
    event.fire(5, options);
    expect(options.allow, "function should change allow to true").toBe(true);
    expect(counter, "function should increase counter on 5").toBe(5);
  });
  test("Do not add function with the same instance several times", () => {
    var event = new Event<() => any, any, any>();
    var counter = 0;
    var func = () => {
      counter++;
    };
    event.add(func);
    event.add(func);
    event.add(func);
    event.fire(null, null);
    expect(counter, "function called one time").toBe(1);
    event.remove(func);
    event.fire(null, null);
    expect(counter, "function should not be called the second time").toBe(1);
  });
  // VITEST-MIGRATION: MANUAL -- ASYNC_DONE: contains assert.async(), manual rewrite required
  /*
test("Add async event", () => {
  const done = assert.async();
  interface ResultOptions {
    counter: number;
  }
  const event = new EventAsync<any, ResultOptions>();
  const func1 = (sender: any, options: ResultOptions): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        options.counter++;
        resolve();
      }, 0);
    });
  };
  const func2 = (sender: any, options: ResultOptions): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        options.counter++;
        resolve();
      }, 0);
    });
  };
  const options: ResultOptions = { counter: 0 };
  let completeCounter = 0;
  let firstAsyncCounter = 0;
  event.add(func1);
  event.add(func2);
  event.fire(null, options, () => completeCounter++, () => firstAsyncCounter++);
  setTimeout(() => {
    expect(options.counter, "function called 2 times").toBe(2);
    expect(firstAsyncCounter, "onAsyncCallbacks called one time #2").toBe(1);
    done();
  }, 10);
  expect(firstAsyncCounter, "onAsyncCallbacks called one time").toBe(1);
});
*/
  test("Add sync functions to async event", () => {
  interface ResultOptions {
    counter: number;
  }
  const event = new EventAsync<any, ResultOptions>();
  const func1 = (sender: any, options: ResultOptions) => { options.counter++; };
  const func2 = (sender: any, options: ResultOptions) => { options.counter++; };
  const options: ResultOptions = { counter: 0 };
  event.add(func1);
  event.add(func2);
  let completeCounter = 0;
  let firstAsyncCounter = 0;
  event.fire(null, options, () => completeCounter++, () => firstAsyncCounter++);
  expect(options.counter, "function called 2 times").toBe(2);
  expect(firstAsyncCounter, "onAsyncCallbacks called one time").toBe(0);
  expect(completeCounter, "onComplete called one time").toBe(1);
  });
  test("Item value & dynamic separator, #10424", () => {
    var value = new ItemValue("Item");
    expect(value.value, "simple text value").toBe("Item");
    expect(value.locText.renderedHtml, "get text from value").toBe("Item");
    value.text = "My text";
    expect(value.text, "get text from text property").toBe("My text");
    value.text = null;
    expect(value.locText.renderedHtml, "get text from value").toBe("Item");
    value.value = 5;
    expect(value.locText.renderedHtml, "get text from value and convert it to string").toBe("5");
    value.value = null;
    expect(value.value, "value was set to null").toBe(null);
    expect(value.calculatedText, "text is null if value is null").toBe(null);
    value.value = "Item|Text Item";
    expect(value.value, "use the text separator: value").toBe("Item");
    expect(value.calculatedText, "use the text separator: text").toBe("Text Item");
    settings.itemValueSeparator = "";
    value.value = "Item|Text Item";
    expect(value.value, "do not use the text separator").toBe("Item|Text Item");
    settings.itemValueSeparator = "|";
  });
  test("ItemValue.setData()", () => {
    var items = new Array<ItemValue>();
    ItemValue.setData(items, [
      { value: 7, text: "Item 1" },
      5,
      "item",
      "value1|text1",
    ]);
    expect(items.length, "there are 4 items").toBe(4);
    expect(items[1].value, "set correct value property for the second item").toBe(5);
    expect(items[1].calculatedText, "set correct text property for the second item").toBe("5");
    expect(items[2].value, "set correct value property for the third item").toBe("item");
    expect(items[2].calculatedText, "set correct text property for the third item").toBe("item");
    expect(items[3].value, "set correct value property for the fourth item").toBe("value1");
    expect(items[3].calculatedText, "set correct text property for the fourth item").toBe("text1");
  });
  test("ItemValue.setData() empty text", () => {
    var items = new Array<ItemValue>();
    items.push(new ItemValue(1));
    items.push(new ItemValue(2));
    var newItems = new Array<ItemValue>();
    ItemValue.setData(newItems, items);
    expect(newItems.length, "there are 2 items").toBe(2);
    expect(newItems[0].value, "the first value is 1").toBe(1);
    expect(newItems[0].hasText, "There is no text").toBe(false);
  });
  test("ItemValue.setData() boolean", () => {
    var items = new Array<ItemValue>();
    ItemValue.setData(items, [
      { value: true, text: "Yes" },
      { value: false, text: "No" },
    ]);
    expect(items.length, "there are 2 items").toBe(2);
    expect(items[0].value, "set correct value property for the first item").toBe(true);
    expect(items[0].calculatedText, "set correct text property for the first item").toBe("Yes");
    expect(items[1].value, "set correct value property for the second item").toBe(false);
    expect(items[1].calculatedText, "set correct text property for the second item").toBe("No");
  });
  test("ItemValue.setData() ItemValue with type", () => {
    Serializer.addClass("imageitemvalue1", [], null, "itemvalue");
    var items = new Array<ItemValue>();
    var data = [
      new ItemValue(true, "Yes", "imageitemvalue1"),
      new ItemValue(false, "No", "imageitemvalue1"),
    ];
    ItemValue.setData(items, data);
    expect(items.length, "there are 2 items").toBe(2);
    expect(items[0].value, "set correct value property for the first item").toBe(true);
    expect(items[0].text, "set correct text property for the first item").toBe("Yes");
    expect(items[1].value, "set correct value property for the second item").toBe(false);
    expect(items[1].text, "set correct text property for the second item").toBe("No");
  });
  test("ItemValue.getData()", () => {
    var items = new Array<ItemValue>();
    items.push(new ItemValue(7, "Item 1"));
    items.push(new ItemValue(5));
    items.push(new ItemValue("item"));
    var data = ItemValue.getData(items);
    ItemValue.setData(items, [{ value: 7, text: "Item 1" }, 5, "item"]);
    expect(data, "convert some items to simple values").toEqual([{ value: 7, text: "Item 1" }, 5, "item"]);
    var item = new ItemValue(1);
    expect(item.getData(), "Just value").toBe(1);
    item.visibleIf = "{item}=1";
    expect(item.getData(), "Object value + visibleIf").toEqual({ value: 1, visibleIf: "{item}=1" });
  });
  test("ItemValue.getItemByValue()", () => {
    var items = new Array<ItemValue>();
    items.push(new ItemValue(7, "Item 1"));
    items.push(new ItemValue(5));
    items[1]["custom"] = "mydata";
    items.push(new ItemValue("item"));
    var item = ItemValue.getItemByValue(items, 5);
    expect(item.value, "find item correctly").toBe(5);
    expect(item["custom"], "get custom data correctly").toBe("mydata");
    item = ItemValue.getItemByValue(items, 55);
    expect(item, "there is no item by this value").toBe(null);
    items.push(new ItemValue("", "empty"));
    item = ItemValue.getItemByValue(items, undefined);
    expect(item.text, "returns empty value").toBe("empty");
  });

  test("ItemValue.locText property on demand", () => {
    const hasLocText = (item: ItemValue): boolean => {
      return !!item["locTextValue"];
    };
    const item = new ItemValue(1);
    expect(hasLocText(item), "locText is not created #1").toBeFalsy();
    expect(item.textOrHtml, "textOrHtml is 1").toBe("1");
    expect(item.hasText, "has text is false").toBe(false);
    expect(item.toJSON(), "toJSON is correct").toEqual({ value: 1 });
    expect(hasLocText(item), "locText is not created #2").toBeFalsy();
    item.text = "abc";
    expect(hasLocText(item), "locText is not created #3").toBeTruthy();
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
      this.createLocalizableString("title");
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

  test("Base simple propety value", () => {
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
    expect(base.value1, "Use the default value").toBe(1);
    base.value1 = 5;
    expect(base.value1, "It has been assign correctly").toBe(5);
    expect(counter, "event called one time").toBe(1);
    expect(propertyName, "value1 has been changed").toBe("value1");
    expect(oldValue, "oldValue is undefined").toBeFalsy();
    expect(newValue, "newValue is 5").toBe(5);
  });

  test("Base hash values - get/set PropertyValueCoreHandler", () => {
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
    expect(counter).toBe(2);
    expect(val).toBe(5);
    expect(base.value1).toBe(5);
    expect(counter).toBe(3);
  });
  test("Base hash values - onPropertyValueCoreChanged event", () => {
    var base = new BaseTester();
    const names = new Array<string>();
    const onPropertyValueChanged = (sender: Base, options: IPropertyValueChangedEvent) => {
      names.push(options.name);
    };
    base.addOnPropertyValueChangedCallback(onPropertyValueChanged);
    expect(names.length).toBe(0);
    base.value1 = 5;
    expect(names, "#1").toEqual(["value1"]);
    base.value1 = 5;
    expect(names, "#2").toEqual(["value1"]);
    base.value1 = 7;
    expect(names, "#3").toEqual(["value1", "value1"]);
    base.removeOnPropertyValueChangedCallback(onPropertyValueChanged);
    base.value1 = 10;
    expect(names, "#4").toEqual(["value1", "value1"]);
  });
  test("Base hash values - onPropertyValueCoreChanged event, do not call on caculdated function", () => {
    class BaseTesterWithCalc extends BaseTester {
      public get value1(): number {
        return this.getPropertyValue("value1", 1);
      }
      public get value2(): number {
        return this.getPropertyValue("value2", undefined, () => this.value1 + 1);
      }
    }
    const base = new BaseTesterWithCalc();
    const names = new Array<string>();
    const onPropertyValueChanged = (sender: Base, options: IPropertyValueChangedEvent) => {
      names.push(options.name);
    };
    base.addOnPropertyValueChangedCallback(onPropertyValueChanged);
    expect(names.length).toBe(0);
    expect(base.value2, "initial calculated value").toBe(2);
    expect(names.length).toBe(0);
    base.setPropertyValue("value1", 5);
    expect(names, "#1").toEqual(["value1"]);
    expect(base.value2, "calculated value is not changed").toBe(2);
    expect(names, "#2").toEqual(["value1"]);
    base.setPropertyValue("value2", 15);
    expect(names, "#3").toEqual(["value1", "value2"]);
    expect(base.value2, "set value").toBe(15);
    expect(names, "#4").toEqual(["value1", "value2"]);
  });

  test("Base localizable string", () => {
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
    expect(base.title, "Use the default value").toBe("default");
    base.title = "value1";
    expect(base.title, "It has been assign correctly").toBe("value1");
    expect(counter, "event called one time").toBe(1);
    expect(propertyName, "title has been changed").toBe("title");
    expect(oldValue, "oldValue is undefined").toBeFalsy();
    expect(newValue, "newValue is value1").toBe("value1");
  });

  test("Base array propety value, push/splice/pop", () => {
    var base = new BaseTester();
    var counter = 0;
    var propertyName;
    base.onPropertyChanged.add(function (sender, options) {
      counter++;
      propertyName = options.name;
    });
    base.items.push({ value: 1 });
    expect(base.items.length, "There is one item").toBe(1);
    expect(base.items[0].isNew, "isNew property is set").toBe(true);
    expect(counter, "event called one time").toBe(1);
    expect(propertyName, "items has been changed").toBe("items");
    var item = base.items[0];
    base.items.splice(0, 1, { value: 2 }, { value: 3 });
    expect(base.items.length, "There are two items").toBe(2);
    expect(item.isDeleted, "First Item is deleted").toBe(true);
    expect(base.items[0].isNew, "Item1, isNew property is set").toBe(true);
    expect(base.items[1].isNew, "Item2, isNew property is set").toBe(true);
    expect(counter, "event called two times").toBe(2);
    expect(propertyName, "items has been changed").toBe("items");

    item = base.items[0];
    base.items.pop();
    base.items.pop();
    expect(base.items.length, "There is no items").toBe(0);
    expect(item.isDeleted, "Item is deleted").toBe(true);
    expect(counter, "event called 4 times, pop is called two times").toBe(4);
    expect(propertyName, "items has been changed").toBe("items");
  });
  test("Base array propety value, set value", () => {
    var base = new BaseTester();
    var counter = 0;
    var propertyName;
    base.onPropertyChanged.add(function (sender, options) {
      counter++;
      propertyName = options.name;
    });
    base.setPropertyValue("items", [{ value1: 1 }, { value2: 2 }]);
    expect(base.items.length, "There are two items").toBe(2);
    expect(base.items[0].isNew, "first item, isNew property is set").toBe(true);
    expect(base.items[1].isNew, "second item, isNew property is set").toBe(true);
    expect(counter, "event called one time").toBe(1);
    expect(propertyName, "items has been changed").toBe("items");

    base.items.push({ value: 3 });
    expect(base.items.length, "There are 3 items").toBe(3);
    expect(base.items[2].isNew, "The third  item, isNew property is set").toBe(true);
    expect(counter, "event called two times").toBe(2);
  });

  test("Base onPropertyValueChangedCallback", () => {
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

    expect(counter, "initial").toBe(0);

    base.setPropertyValue("some", "some");

    expect(counter, "callback called").toBe(1);
  });

  test("Base propertyValueChanged itemValue", () => {
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

    expect(counter, "initial").toBe(0);

    itemValue.text = "new";

    expect(counter, "callback called").toBe(1);
  });

  test("Base propertyValueChanged colOwner - column undo/redo", () => {
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

    expect(counter1, "initial").toBe(0);
    expect(counter2, "initial").toBe(0);
    matrix.columns[0].name = "col2";
    expect(counter1, "callback colOwner called").toBe(1);
    expect(counter2, "callback locOwner not called").toBe(0);
    matrix.rows[0].value = 3;
    expect(counter1, "callback colOwner is the same").toBe(1);
    expect(counter2, "callback locOwner called").toBe(1);
  });
  test("Base onArrayChanged", () => {
    const base = new BaseTester();
    let counter = 0;
    let arrayChanges: ArrayChanges = null;
    expect((base as any).onArrayChanged, "#1").toBe(undefined);
    const callback = (_: Base, options: IPropertyArrayValueChangedEvent) => {
      arrayChanges = options.arrayChanges;
      counter++;
    };
    base.addOnArrayChangedCallback(callback);
    expect(counter, "initial").toBe(0);
    base.items.push(new ItemValue(1));

    expect(counter, "onArrayChanged is changed").toBe(1);
    expect(arrayChanges.index, "added into 0 index").toBe(0);
    expect(arrayChanges.itemsToAdd, "added items").toEqual([base.items[0]]);

    base.removeOnArrayChangedCallback(callback);
    expect((base as any).onArrayChanged).toBe(undefined);
    base.items.push(new ItemValue(1));
    expect(counter, "onArrayChanged is not changed").toBe(1);
  });
  test("Change value to array and then to undefined", () => {
    var base = new Base();
    base.setPropertyValue("testValue", [1, 2, 3]);
    expect(base.getPropertyValue("testValue")).toEqual([1, 2, 3]);
    base.setPropertyValue("testValue", undefined);
    expect(base.getPropertyValue("testValue")).toBeFalsy();
  });
  test("Change value to array and then to string", () => {
    var base = new BaseTester();
    base.setPropertyValue("testValue", [1, 2, 3]);
    expect(base.getPropertyValue("testValue")).toEqual([1, 2, 3]);
    base.setPropertyValue("testValue", "abc");
    expect(base.getPropertyValue("testValue")).toBe("abc");
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
  test("Collect dependencies", () => {
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
    expect(deps.dependencies.length, "two dependencies").toBe(2);
    expect(deps.dependencies[0].obj).toBe(base1);
    expect(deps.dependencies[0].prop).toBe("propA");
    expect(deps.dependencies[1].obj).toBe(base2);
    expect(deps.dependencies[1].prop).toBe("propB");

    expect(updaterCallCount, "first time calculation").toBe(1);
    expect(base3.propC).toBe(3);
    base1.propA = 2;
    expect(updaterCallCount, "propA changed").toBe(2);
    expect(base3.propC).toBe(4);
    base2.propB = 3;
    expect(updaterCallCount, "propB changed").toBe(3);
    expect(base3.propC).toBe(5);

    deps.dispose();
    base1.propA = 1;
    expect(updaterCallCount, "no updater calls").toBe(3);
    expect(base3.propC, "no value updates").toBe(5);
  });
  test("Collect dependencies automatically", () => {
    const base1 = new BaseTester1();
    const base2 = new BaseTester2();
    const base3 = new BaseTester3();
    let updaterCallCount = 0;
    const updater = new ComputedUpdater<number>(() => {
      updaterCallCount++;
      return base1.propA + base2.propB;
    });
    base3.propC = <any>updater;

    expect(updaterCallCount, "first time calculation").toBe(1);
    expect(base3.propC, "1 + 2").toBe(3);
    base1.propA = 2;
    expect(updaterCallCount, "propA changed").toBe(2);
    expect(base3.propC, "2 + 2").toBe(4);
    base2.propB = 3;
    expect(updaterCallCount, "propB changed").toBe(3);
    expect(base3.propC, "2 + 3").toBe(5);

    updater.dispose();
    base1.propA = 1;
    expect(updaterCallCount, "no updater calls").toBe(3);
    expect(base3.propC, "no value updates").toBe(5);
  });
  test("Action visibility update", () => {
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

    expect(updaterCallCount, "first time calculation").toBe(1);
    expect(action.visible).toBe(false);
    base1.propA = 1;
    expect(updaterCallCount, "propA changed to true").toBe(2);
    expect(action.visible).toBe(true);
    base2.propB = 0;
    expect(updaterCallCount, "propB changed to false").toBe(3);
    expect(action.visible).toBe(false);
    base2.propB = 1;
    expect(updaterCallCount, "propB changed to true").toBe(4);
    expect(action.visible).toBe(true);

    updater.dispose();
    base1.propA = 0;
    expect(updaterCallCount, "no updater calls").toBe(4);
    expect(action.visible).toBe(true);
  });
  test("Action enable active update same function", () => {
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
    expect(dependencies1.dependencies.length, "active dependencies count = 1").toBe(1);
    const dependencies2 = updater1["getDependencies"]();
    expect(dependencies2.dependencies.length, "enabled dependencies count = 1").toBe(1);

    expect(updaterCallCount1, "first time calculation - active").toBe(1);
    expect(updaterCallCount2, "first time calculation - enabled").toBe(1);
    expect(action.active, "active 1").toBe(false);
    expect(action.enabled, "enabled 1").toBe(false);
    base1.propA = 1;
    expect(updaterCallCount1, "propA changed to true - active").toBe(2);
    expect(updaterCallCount2, "propA changed to true - enabled").toBe(2);
    expect(action.active, "active 2").toBe(true);
    expect(action.enabled, "enabled 2").toBe(true);
    base1.propA = 0;
    expect(updaterCallCount1, "propA changed to false - active").toBe(3);
    expect(updaterCallCount2, "propA changed to false - enabled").toBe(3);
    expect(action.active, "active 3").toBe(false);
    expect(action.enabled, "enabled 3").toBe(false);
  });
  test("Action, support multiple language in title, issue#10291", () => {
    let action = new Action({ title: "title" });
    expect(action.title, "default title").toBe("title");
    expect(action.locTitle.getLocaleText(""), "en title #1").toBe("title");
    action.locTitle.setLocaleText("de", "title-de");
    expect(action.locTitle.getLocaleText("de"), "de title #1").toBe("title-de");
    action = new Action({ titles: { default: "title1", de: "title1-de" } });
    expect(action.title, "default title #2").toBe("title1");
    expect(action.locTitle.getLocaleText("de"), "de title #2").toBe("title1-de");
    expect(action.titles, "titles").toEqual({ default: "title1", de: "title1-de" });
    action.titles = { default: "title2", fr: "title2-fr" };
    expect(action.title, "default title #3").toBe("title2");
    expect(action.locTitle.getLocaleText("fr"), "fr title #3").toBe("title2-fr");
    expect(action.titles, "titles #2").toEqual({ default: "title2", fr: "title2-fr" });
  });
  test("Update via function - nested dependencies", () => {
    const base1 = new BaseTester1();
    let updaterCallCount1 = 0;
    const survey = new SurveyModel();
    base1.propS = <any>new ComputedUpdater(() => {
      updaterCallCount1++;
      return survey.calculateWidthMode();
    });

    expect(updaterCallCount1, "first time calculation - static").toBe(1);
    expect(base1.propS).toBe("static");

    survey.widthMode = "responsive";
    expect(updaterCallCount1, "update called - responsive").toBe(2);
    expect(base1.propS).toBe("responsive");
  });
  test("Unsubscribe dependencies on dispose", () => {
    const base1 = new BaseTester1();
    const base2 = new BaseTester2();
    const base3 = new BaseTester3();
    let updaterCallCount = 0;
    const updater = new ComputedUpdater<number>(() => {
      updaterCallCount++;
      return base1.propA + base2.propB;
    });
    base3.propC = <any>updater;

    expect(Object.keys(base3.dependencies).length, "one computed").toBe(1);
    expect(Object.keys(base3.dependencies)[0], "propC").toBe("propC");
    expect(base3.dependencies["propC"]["getDependencies"]().dependencies.length, "depends on two properties").toBe(2);

    expect(base1["onPropChangeFunctions"].length, "base1 one subscription").toBe(1);
    expect(base1["onPropChangeFunctions"][0].name, "base1 one subscription to A").toBe("propA");
    expect(base2["onPropChangeFunctions"].length, "base2 one subscription").toBe(1);
    expect(base2["onPropChangeFunctions"][0].name, "base2 one subscription to B").toBe("propB");

    expect(updaterCallCount, "first time calculation").toBe(1);
    expect(base3.propC, "1 + 2").toBe(3);
    base1.propA = 2;
    expect(updaterCallCount, "propA changed").toBe(2);
    expect(base3.propC, "2 + 2").toBe(4);

    base3.dispose();

    expect(Object.keys(base3.dependencies).length, "one computed").toBe(1);
    expect(base3.dependencies["propC"]["getDependencies"](), "no dependencies").toBe(undefined);

    expect(base1["onPropChangeFunctions"].length, "base1 no subscriptions").toBe(0);
    expect(base2["onPropChangeFunctions"].length, "base2 no subscriptions").toBe(0);

    base1.propA = 3;
    expect(updaterCallCount, "updater doesn't react on changes").toBe(2);
    expect(base3.propC, "no value updates").toBe(4);
  });

  test("findParentByClassNames function", () => {
    const parentElement = document.createElement("div");
    parentElement.classList.add("class1");
    parentElement.classList.add("class22");

    const element = document.createElement("div");
    element.classList.add("class1");
    element.classList.add("class2");

    parentElement.appendChild(element);

    expect(findParentByClassNames(element, ["class1", "class2", ""])).toBe(element);
    expect(findParentByClassNames(element, ["class1", "class22", ""])).toBe(parentElement);

    parentElement.remove();
  });
  test("Subscribe localizable property", () => {
    const base4 = new BaseTester4();
    let updaterCallCount1 = 0;
    base4.propC = <any>new ComputedUpdater(() => {
      updaterCallCount1++;
      return base4.propL;
    });

    expect(base4.propC, "initial empty string").toBe("");
    expect(updaterCallCount1, "first time calculation - static").toBe(1);

    base4.propL = "localizable value";
    expect(base4.propC).toBe("localizable value");
    expect(updaterCallCount1, "update called - localizable value").toBe(2);
  });
  test("base.hasDefaultPropertyValue, base.getDefaultPropertyValue and base.resetPropertyValue()", () => {
    const question = new QuestionDropdownModel("q1");
    expect(question.hasDefaultPropertyValue("width"), "question.width has no default value").toBe(false);
    expect(question.getDefaultPropertyValue("width"), "question.width default value is undefined").toBeFalsy();
    question.width = "200px";
    question.resetPropertyValue("width");
    expect(question.width, "width property value is empty").toBeFalsy();

    expect(question.hasDefaultPropertyValue("minWidth"), "question.minWidth has default value").toBe(true);
    expect(question.getDefaultPropertyValue("minWidth"), "question.minWidth default value is 300px").toBeTruthy();
    question.minWidth = "200px";
    expect(question.minWidth, "minWidth property is set to 200px").toBe("200px");
    question.resetPropertyValue("minWidth");
    expect(question.minWidth, "minWidth property value is reset, #1").toBe("300px");
    question.minWidth = "";
    expect(question.minWidth, "minWidth property value is empty string").toBe("");
    question.resetPropertyValue("minWidth");
    expect(question.minWidth, "minWidth property value is reset, #2").toBe("300px");

    expect(question.placeholder, "question.locPlaceholder default value").toBe("Select...");
    expect(question.hasDefaultPropertyValue("placeholder"), "question.placeholder has default value").toBe(true);
    expect(question.getDefaultPropertyValue("placeholder"), "question.placeholder default value").toBe("Select...");
    expect(question.placeholder, "question.placeholder value").toBe("Select...");
    question.placeholder = "abc";
    expect(question.placeholder, "placeholder property is set to 200px").toBe("abc");
    question.resetPropertyValue("placeholder");
    expect(question.placeholder, "placeholder property value is reset, #1").toBe("Select...");
    question.placeholder = "";
    expect(question.placeholder, "placeholder property value is empty string").toBe("");
    question.resetPropertyValue("placeholder");
    expect(question.placeholder, "placeholder property value is reset, #2").toBe("Select...");
  });
  test("base.resetPropertyValue() for localization string", () => {
    const survey = new SurveyModel();
    expect(survey.completeText, "default value").toBe("Complete");
    survey.completeText = "test";
    expect(survey.completeText, "set value").toBe("test");
    survey.resetPropertyValue("completeText");
    expect(survey.completeText, "default value, #2").toBe("Complete");
    const prop = Serializer.findProperty("survey", "completeText");
    prop.setValue(survey, "", null);
    expect(survey.completeText, "Empty string after prop.setValue func").toBe("");
  });
  test("base.resetPropertyValue() for localization string, #2, bug#7388", () => {
    const survey = new SurveyModel();
    expect(survey.completeText, "default value").toBe("Complete");
    survey.completeText = "test en";
    expect(survey.completeText, "set value en").toBe("test en");
    survey.locale = "de";
    survey.completeText = "test de";
    expect(survey.completeText, "set value de").toBe("test de");
    survey.resetPropertyValue("completeText");
    expect(survey.completeText, "default value de").toBe("Abschließen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    survey.locale = "";
    expect(survey.completeText, "default value en").toBe("Complete");
  });

  test("check animationAllowed", () => {
    const survey = new SurveyModel({
      elements: [
        {
          name: "q1",
          type: "text"
        }
      ]
    });
    const question = survey.getAllQuestions()[0];
    expect(question.animationAllowed).toBeFalsy();
    settings.animationEnabled = true;
    question.supportOnElementRerenderedEvent = false;
    expect(question.animationAllowed).toBeTruthy();
    question.blockAnimations();
    expect(question.animationAllowed).toBeFalsy();
    question.blockAnimations();
    expect(question.animationAllowed).toBeFalsy();
    question.releaseAnimations();
    expect(question.animationAllowed).toBeFalsy();
    question.releaseAnimations();
    expect(question.animationAllowed).toBeTruthy();
    settings.animationEnabled = false;
  });

  test("check afterRerender function", () => {
    const survey = new SurveyModel({});
    expect(!!survey.onElementRerendered).toBeFalsy();
    survey.afterRerender();
    survey.enableOnElementRerenderedEvent();
    let log = "";
    survey.onElementRerendered.add((_, options) => log += `->callback: ${!!options.isCancel}`);
    survey.afterRerender();
    expect(log).toBe("->callback: false");
    log = "";
    survey.disableOnElementRerenderedEvent();
    expect(log).toBe("->callback: true");
    log = "";
    survey.afterRerender();
    expect(log).toBe("");
  });
  test("maxWidth should return to default when set to empty string", () => {
    const question = new QuestionDropdownModel("q1");
    expect(question.maxWidth, "maxWidth default value is 100%").toBe("100%");
    question.maxWidth = "50%";
    expect(question.maxWidth, "maxWidth is set to 50%").toBe("50%");
    question.maxWidth = "";
    expect(question.maxWidth, "maxWidth returns to default on empty string").toBe("100%");
  });

  test("check default value doesn't exist on getPropertyValueDirectly", () => {
    Serializer.addProperty("itemvalue", {
      name: "score:number",
      category: "general",
      displayName: "Score",
      default: 1,
      visibleIndex: 5,
    });
    const itemValue = new ItemValue("item1");
    expect(itemValue.getPropertyValue("score"), "default value should be returned").toBe(1);
    itemValue.setPropertyValue("score", 1);
    expect((itemValue as any).getPropertyValueWithoutDefault("score"), "default value shouldn't be set").toBe(undefined);
    Serializer.removeProperty("itemvalue", "score");
  });
  test("check default 0 value doesn't exist on getPropertyValueDirectly", () => {
    Serializer.addProperty("itemvalue", {
      name: "score:number",
      category: "general",
      displayName: "Score",
      default: 0,
      visibleIndex: 5,
    });
    const itemValue = new ItemValue("item1");
    expect(itemValue.getPropertyValue("score"), "default value should be returned").toBe(0);
    itemValue.setPropertyValue("score", 0);
    expect((itemValue as any).getPropertyValueWithoutDefault("score"), "default value shouldn't be set").toBe(undefined);
    Serializer.removeProperty("itemvalue", "score");
  });
  test("getPropertyValue & calcFunc & emtpy object {}", () => {
    let counter = 0;
    function calcProp() {
      counter ++;
      return {};
    }
    class TestClass extends Base {
      public get obj1(): any { return this.getPropertyValue("obj1", undefined, () => calcProp()); }
    }
    const obj = new TestClass();
    expect(obj.obj1, "Test #1").toEqual({});
    expect(obj.obj1, "Test #2").toEqual({});
    expect(obj.obj1, "Test #3").toEqual({});
    expect(counter, "calcProp called one time").toBe(1);
  });
  test("getPropertyValue & NaN", () => {
    class TestClass extends Base {
    @property({ defaultValue: 1 }) public pageSize: number;
    }
    const obj = new TestClass();
    expect(obj.pageSize, "pageSize #1").toBe(1);
    obj.pageSize = <any>undefined;
    expect(obj.pageSize, "pageSize #2").toBe(1);
    obj.pageSize = <any>null;
    expect(obj.pageSize, "pageSize #3").toBe(1);
    obj.pageSize = NaN;
    expect(obj.pageSize, "pageSize #4").toBe(1);
  });
});
