import {
  JsonObject,
  Serializer,
  JsonUnknownPropertyError,
  JsonObjectProperty,
  JsonRequiredPropertyError,
} from "../src/jsonobject";
import { property } from "../src/decorators";
import { ItemValue } from "../src/itemvalue";
import { Base } from "../src/base";
import { Helpers } from "../src/helpers";
import { ILocalizableOwner, LocalizableString } from "../src/localizablestring";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { Question } from "../src/question";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionMatrixModel } from "../src/question_matrix";
import { settings } from "../src/settings";
import { TextValidator } from "../src/validator";
import { englishStrings } from "../src/localization/english";
import { SurveyModel } from "../src/survey";
import { CalculatedValue } from "../src/calculatedValue";
import { QuestionHtmlModel } from "../src/question_html";
import { ImageItemValue } from "../src/question_imagepicker";
import { PageModel } from "../src/page";
import { QuestionTextModel } from "../src/question_text";
import { QuestionCommentModel } from "../src/question_comment";
import { QuestionTagboxModel } from "../src/question_tagbox";

import { describe, test, expect } from "vitest";
class Car extends Base implements ILocalizableOwner {
  public locale: string;
  constructor() {
    super();
  }
  public name: string;
  public getType(): string {
    return "car";
  }
  getLocale(): string {
    return this.locale;
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
class FastCar extends Car {
  constructor() {
    super();
  }
  public getType(): string {
    return "fast";
  }
}
class BigCar extends Car {
  constructor() {
    super();
  }
  public getType(): string {
    return "big";
  }
}
class SportCar extends FastCar {
  constructor() {
    super();
  }
  public maxSpeed: number;
  public getType(): string {
    return "sport";
  }
}
class Truck extends BigCar {
  constructor() {
    super();
  }
  public maxWeight: number;
  public getType(): string {
    return "truck";
  }
}

class CarOwner extends Base {
  private carValue: Car;
  constructor() {
    super();
    this.carValue = new FastCar();
  }
  public getType(): string {
    return "carowner";
  }
  getDynamicPropertyName(): string {
    return "carType";
  }
  getDynamicType(): string {
    return this.carType;
  }
  public name: string;
  public get car(): Car {
    return this.carValue;
  }
  public get carType(): string {
    return this.carValue.getType();
  }
  public set carType(val: string) {
    if (val == this.carType) return;
    var newCar = <Car>Serializer.createClass(val);
    if (!newCar) return;
    this.removeProperties();
    this.carValue = newCar;
    this.addProperties();
  }
  private removeProperties() {
    var props = Serializer.getDynamicPropertiesByObj(this, this.carType);
    for (var i = 0; i < props.length; i++) {
      delete this[props[i].name];
    }
  }
  private addProperties() {
    var props = Serializer.getDynamicPropertiesByObj(this);
    for (var i = 0; i < props.length; i++) {
      var propName = props[i].name;
      if (!!this[propName]) continue;
      this.defineNewProperty(propName);
    }
  }
  private defineNewProperty(propName: string) {
    var car = this.car;
    var desc = {
      configurable: true,
      get: function () {
        return car[propName];
      },
      set: function (v: any) {
        car[propName] = v;
      },
    };
    Object.defineProperty(this, propName, desc);
  }
}

class Dealer extends Base {
  constructor() {
    super();
  }
  public name: string;
  public unserializedName: string;
  public definedNonSerializable: string;
  public cars = new Array<Car>();
  public stringArray: Array<string> = [];
  public car: Car;
  public truck: Truck;
  public trucks = new Array<Truck>();
  public changeNameOnSet: string;
  public getType(): string {
    return "dealer";
  }
  public get defaultValue(): string {
    return this.getPropertyValue("defaultValue");
  }
  public set defaultValue(val: string) {
    this.setPropertyValue("defaultValue", val);
  }
}

class ItemValueListOwner {
  public items: Array<ItemValue> = new Array<ItemValue>();
  public getType(): string {
    return "itemvaluelistowner";
  }
}

class LongNameItemBase {
  public baseSt: string;
  public getType(): string {
    return "item_thelongpart";
  }
}
class LongNameItemA extends LongNameItemBase {
  public A: number;
  public getType(): string {
    return "itemA_thelongpart";
  }
}
class LongNameItemB extends LongNameItemBase {
  public B: number;
  public getType(): string {
    return "itemB_thelongpart";
  }
}

class LongNamesOwner {
  public items = new Array<LongNameItemBase>();
  public getType(): string {
    return "LongNamesOwner";
  }
}

class NonCreatingObject {
  constructor(public A: number = 0) { }
  public getType(): string {
    return "shouldnotcreate";
  }
}
class CreatingObject extends NonCreatingObject {
  public B: number;
  constructor(public A: number = 0) {
    super(A);
  }
  public getType(): string {
    return "shouldcreate";
  }
}
class CreatingObjectContainer {
  public obj: NonCreatingObject;
  public items = new Array<NonCreatingObject>();
  public getType(): string {
    return "container";
  }
}

class LoadingFromJsonObjBase extends Base {
  public startLoadingFromJsonCounter: number = 0;
  public endLoadingFromJsonCounter: number = 0;
  public name: string;
  startLoadingFromJson(json: any) {
    super.startLoadingFromJson(json);
    this.startLoadingFromJsonCounter++;
  }
  endLoadingFromJson() {
    super.endLoadingFromJson();
    this.endLoadingFromJsonCounter++;
  }
}

class LoadingFromJsonObjItem extends LoadingFromJsonObjBase {
  public getType(): string {
    return "loadingtestitem";
  }
}

class LoadingFromJsonObj extends LoadingFromJsonObjBase {
  public items = new Array<LoadingFromJsonObjItem>();
  public getType(): string {
    return "loadingtest";
  }
}

class TestDeclaredProps extends Car {
  getType() {
    return "new_declared_props";
  }
  @property({ defaultValue: 5 }) numberProp: number;
  @property({ localizable: true }) str1: string;
  @property({ localizable: true }) strProp: string;
  @property({ localizable: { name: "locStrName" } }) str2: string;
  @property({ localizable: { defaultStr: "completeText" } }) str3: string;
}

class DefaultValueClassObj extends Base {
  @property() prop1: number;
  public getType(): string {
    return "defaultvaluefunctest";
  }
}

Serializer.addClass(
  "dealer",
  [
    "name:string",
    { name: "dummyname", layout: "row" },
    "car",
    "stringArray",
    { name: "defaultValue", default: "default" },
    { name: "cars", baseClassName: "car", visible: false },
    {
      name: "truck",
      className: "truck",
      dependsOn: ["car"],
      visibleIf: function (obj: any) {
        return obj.car != null && obj.car.name == "mycar";
      },
    },
    { name: "trucks", className: "truck", visible: false },
    { name: "definedNonSerializable", isSerializable: false },
    {
      name: "changeNameOnSet",
      onSetValue: function (obj: any, value: any, jsonConv: JsonObject) {
        obj.name = value;
      },
    }
  ],
  function () {
    return new Dealer();
  }
);

Serializer.addClass(
  "carowner",
  [
    { name: "carType", default: "fast" },
    { name: "name", dataList: ["item1", "item2"], isUnique: true },
  ],
  function () {
    return new CarOwner();
  }
);

Serializer.addClass(
  "fast",
  [],
  function () {
    return new FastCar();
  },
  "car"
);
Serializer.addClass("big", [], null, "car");

Serializer.addClass("car", ["name"]);
Serializer.addClass(
  "truck",
  [
    {
      name: "maxWeight:number",
      displayName: "Maximum Weight",
      choices: () => {
        return [500, 1500];
      },
    },
    { name: "readOnlyName", readOnly: true },
  ],
  function () {
    return new Truck();
  },
  "big"
);
Serializer.addClass(
  "sport",
  [{ name: "!maxSpeed", choices: [100, 150, 200, 250] }],
  function () {
    return new SportCar();
  },
  "fast"
);

Serializer.addClass("itemvaluelistowner", ["items:itemvalues"]);

Serializer.addClass("item_thelongpart", ["baseSt"]);
Serializer.addClass(
  "itemA_thelongpart",
  ["A"],
  function () {
    return new LongNameItemA();
  },
  "LongNameItemBase"
);
Serializer.addClass(
  "itemB_thelongpart",
  ["B"],
  function () {
    return new LongNameItemB();
  },
  "LongNameItemBase"
);
Serializer.addClass("LongNamesOwner", [
  {
    name: "items",
    baseClassName: "item_thelongpart",
    classNamePart: "_thelongpart",
  },
]);

Serializer.addClass("shouldnotcreate", ["A"], function () {
  return new NonCreatingObject();
});
Serializer.addClass("container", [
  { name: "obj", className: "shouldnotcreate" },
  { name: "items", className: "shouldnotcreate", isLightSerializable: false },
]);
Serializer.overrideClassCreator("shouldnotcreate", function () {
  return new CreatingObject();
});

Serializer.addClass(
  "loadingtest",
  ["name", { name: "items", className: "loadingtestitem" }],
  function () {
    return new LoadingFromJsonObj();
  }
);
Serializer.addClass("loadingtestitem", ["name"], function () {
  return new LoadingFromJsonObjItem();
});

Serializer.addClass("customtruck", ["description"], null, "truck");
Serializer.addProperty("customtruck", {
  name: "isCustom:boolean",
  default: true,
});

Serializer.addClass(
  "customdealer",
  [{ name: "defaultValue", visible: false }],
  undefined,
  "dealer"
);

Serializer.addClass(
  "camelDealer",
  [{ name: "defaultValue", visible: false }],
  undefined,
  "dealer"
);
let defaultValueForProp1 = 5;
Serializer.addClass("defaultvaluefunctest", [{ name: "prop1",
  defaultFunc: () => { return defaultValueForProp1; } }],
() => { return new DefaultValueClassObj(); }, "base");

class CheckGetPropertyValue {
  public directProp: string;
  public getValueProp: string;
  public getValuePropGetter: string;
  public serProperty: string;
  public getSerProperty: CheckGetPropertyValueGetter = new CheckGetPropertyValueGetter();
  public locProperty: string;
  public locPropertyGetter: CheckGetPropertyValueGetter = new CheckGetPropertyValueGetter();
  public getType(): string {
    return "getpropertyvalue";
  }
}

class CheckGetPropertyValueGetter {
  public text: string;
  public getJson(): any {
    return { text: this.text };
  }
}

Serializer.addClass("getpropertyvalue", [
  "directProp",
  {
    name: "getValueProp",
    onGetValue: function (obj: any) {
      return obj.getValuePropGetter;
    },
  },
  { name: "serProperty", serializationProperty: "getSerProperty" },
  { name: "locProperty", serializationProperty: "locPropertyGetter" },
]);

describe("JsonSerializationTests", () => {
  test("Metadata for non inherited class", () => {
    expect(Serializer.getProperties("dealer").length, "Flat properties list").toLooseEqual(10);
    expect(Serializer.getProperties("dealer")[0].name, "Name property").toLooseEqual("name");
  });
  test("Metadata add at the beginning parent class properties ", () => {
    expect(Serializer.getProperties("truck").length, "2 + 1 parent properties").toLooseEqual(3);
    expect(Serializer.getProperties("truck")[0].name, "parent properties first").toLooseEqual("name");
  });
  test("One object - one property serialization", () => {
    var dealer = new Dealer();
    dealer.name = "small";
    dealer.unserializedName = "none";
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "serialize just one property").toLooseEqual('{"name":"small"}');
  });
  test("String array serialization", () => {
    var dealer = new Dealer();
    dealer.stringArray = ["one", "two"];
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "serialize array").toLooseEqual('{"stringArray":["one","two"]}');
  });
  test("Use onGetValue during serialization", () => {
    var dealer = new Dealer();
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "default value of this property is not serialized").toLooseEqual("{}");
    dealer.defaultValue = "nondefault";
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "serialize non default property as any other").toLooseEqual('{"defaultValue":"nondefault"}');
  });
  test("Serialize object with it's type", () => {
    var dealer = new Dealer();
    var truck = new Truck();
    truck.maxWeight = 10000;
    dealer.car = truck;
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "serialize object with it's type").toLooseEqual('{"car":{"type":"truck","maxWeight":10000}}');
  });
  test("Serialize create readOnly custom property using onGetValue", () => {
    Serializer.addProperty("truck", {
      name: "calc",
      onGetValue: function (obj: any): any {
        return !!obj && !!obj.maxWeight ? obj.maxWeight * 2 : 0;
      },
      onSetValue: function (obj: any) { },
    });
    var truck = new Truck();
    truck.maxWeight = 100;
    expect(truck["calc"], "100 * 2").toLooseEqual("200");
    Serializer.removeProperty("truck", "calc");
  });
  test("Check isRequired property", () => {
    expect(Serializer.findProperty("sport", "maxSpeed").isRequired, "maxSpeed is required property").toLooseEqual(true);
    expect(Serializer.findProperty("truck", "maxWeight").isRequired, "maxWeight is not required property").toLooseEqual(false);
  });
  test("Create isRequired properties", () => {
    Serializer.addProperty("sport", "!property1");
    Serializer.addProperty("sport", { name: "property2", isRequired: true });

    expect(Serializer.findProperty("sport", "property1").isRequired, "! makes property required").toLooseEqual(true);
    expect(Serializer.findProperty("sport", "property2").isRequired, "attribute isRequired works").toLooseEqual(true);

    Serializer.removeProperty("sport", "property1");
    Serializer.removeProperty("sport", "property2");
  });
  test("Serialize arrays with serializable objects", () => {
    var dealer = new Dealer();
    var truck = new Truck();
    truck.maxWeight = 10000;
    var sport = new SportCar();
    sport.maxSpeed = 320;
    dealer.cars = [sport, truck];
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "serialize objects with their type").toLooseEqual('{"cars":[{"type":"sport","maxSpeed":320},{"type":"truck","maxWeight":10000}]}');
  });
  test("Serialize 0 for number ", () => {
    expect(Helpers.isValueEmpty(0), "The value is not default").toLooseEqual(false);
    var sport = new SportCar();
    sport.maxSpeed = 0;
    var jsObj = new JsonObject().toJsonObject(sport);
    expect(jsObj, "0 should be serialized as well").toEqualValues({ maxSpeed: 0 });
  });
  test("Serialize object and get type by it's property", () => {
    var dealer = new Dealer();
    var truck = new Truck();
    dealer.truck = new Truck();
    dealer.truck.maxWeight = 10000;
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "serialize object without it's type").toLooseEqual('{"truck":{"maxWeight":10000}}');
  });
  test("Serialize arrays with serializable objects and get type by it's property", () => {
    var dealer = new Dealer();
    dealer.trucks.push(new Truck());
    dealer.trucks.push(new Truck());
    dealer.trucks[0].maxWeight = 10000;
    dealer.trucks[1].maxWeight = 15000;
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "serialize objects without their type").toLooseEqual('{"trucks":[{"maxWeight":10000},{"maxWeight":15000}]}');
  });

  test("One object - one property deserialization", () => {
    var dealer = new Dealer();
    new JsonObject().toObject({ name: "small" }, dealer);
    expect(dealer.name, "deserialize just one property").toLooseEqual("small");
  });
  test("String array deserialization", () => {
    var dealer = new Dealer();
    new JsonObject().toObject({ stringArray: ["one", "two"] }, dealer);
    expect(dealer.stringArray, "deserialize array").toEqualValues(["one", "two"]);
  });
  test("Deserialize object with it's type", () => {
    var dealer = new Dealer();
    new JsonObject().toObject(
      { car: { type: "truck", maxWeight: 10000 } },
      dealer
    );
    var truck: any = dealer.car;
    expect(truck.maxWeight, "deserialize object with it's type").toLooseEqual(10000);
    expect(truck.getType(), "the live object").toLooseEqual("truck");
    expect(truck.type, "type is removed").not.toLooseEqual("truck");
  });
  test("Deserialize arrays with serializable objects", () => {
    var dealer = new Dealer();
    new JsonObject().toObject(
      {
        cars: [
          { type: "sport", maxSpeed: 320 },
          { type: "truck", maxWeight: 10000 },
        ],
      },
      dealer
    );
    expect(dealer.cars.length, "two objects in array should be deserialized").toLooseEqual(2);
    var sport: any = dealer.cars[0];
    var truck: any = dealer.cars[1];
    expect(sport.maxSpeed, "deserialize the first object").toLooseEqual(320);
    expect(sport.getType(), "deserialize the first object").toLooseEqual("sport");
    expect(truck.maxWeight, "deserialize the second object").toLooseEqual(10000);
    expect(truck.getType(), "deserialize the second object").toLooseEqual("truck");
  });
  test("Deserialize object and get type by it's property className", () => {
    var dealer = new Dealer();
    new JsonObject().toObject({ truck: { maxWeight: 10000 } }, dealer);
    expect(dealer.truck.maxWeight, "deserialize object with it's type").toLooseEqual(10000);
    expect(dealer.truck.getType(), "the live object").toLooseEqual("truck");
  });
  test("Deserialize arrays with serializable objects and get type by it's property className", () => {
    var dealer = new Dealer();
    new JsonObject().toObject(
      { trucks: [{ maxWeight: 10000 }, { maxWeight: 15000 }] },
      dealer
    );
    expect(dealer.trucks.length, "two objects in array should be deserialized").toLooseEqual(2);
    expect(dealer.trucks[0].maxWeight, "deserialize the first object").toLooseEqual(10000);
    expect(dealer.trucks[0].getType(), "deserialize the first object").toLooseEqual("truck");
    expect(dealer.trucks[1].maxWeight, "deserialize the second object").toLooseEqual(15000);
    expect(dealer.trucks[1].getType(), "deserialize the second object").toLooseEqual("truck");
  });
  test("Use on setValue during deserialization", () => {
    var dealer = new Dealer();
    new JsonObject().toObject({ changeNameOnSet: "nameIsChanged" }, dealer);
    expect(dealer.name, "the property name is set").toLooseEqual("nameIsChanged");
  });
  test("ItemValueListOwner serialization", () => {
    var list = new ItemValueListOwner();
    list.items.push(new ItemValue(7, "Item 1"));
    list.items.push(new ItemValue(5));
    list.items.push(new ItemValue("item"));

    var jsObj = new JsonObject().toJsonObject(list);
    expect(JSON.stringify(jsObj), "serialize ItemValueListOwner").toLooseEqual('{"items":[{"value":7,"text":"Item 1"},5,"item"]}');
  });
  test("ItemValueListOwner deserialization", () => {
    var list = new ItemValueListOwner();
    new JsonObject().toObject(
      { items: [{ value: 7, text: "Item 1" }, 5, "item", "value1|text1"] },
      list
    );
    expect(list.items.length, "there are 4 items").toLooseEqual(4);
    expect(list.items[1].value, "set correct value property for the second item").toLooseEqual(5);
    expect(list.items[1].calculatedText, "set correct text property for the second item").toLooseEqual("5");
    expect(list.items[3].value, "set correct value property for the fourth item").toLooseEqual("value1");
    expect(list.items[3].calculatedText, "set correct text property for the fourth item").toLooseEqual("text1");
  });
  test("ItemValueListOwner deserialization with empty object, #1667", () => {
    var list = new ItemValueListOwner();
    new JsonObject().toObject({ items: [{}, 1] }, list);
    expect(list.items.length, "there are two items").toLooseEqual(2);
    expect(list.items[0].getType(), "the type created correct").toLooseEqual("itemvalue");
    expect(list.items[0].value, "The value is null").toLooseEqual(null);
  });
  test("ItemValueListOwner deserialization, custom property in ItemValue", () => {
    Serializer.addProperty("itemvalue", "price:number");
    var list = new ItemValueListOwner();

    new JsonObject().toObject(
      {
        items: [
          { value: 7, text: "Item 1", price: 55.5 },
          5,
          "item",
          "value1|text1",
        ],
      },
      list
    );
    expect(list.items.length, "there are 4 items").toLooseEqual(4);
    expect(list.items[0]["price"], "set custom value correctly").toLooseEqual(55.5);
    Serializer.removeProperty("itemvalue", "price");
  });
  test("ItemValueListOwner deserialization, value as object, remove pos", () => {
    var list = new ItemValueListOwner();
    list.items.push(
      new ItemValue({ pos: { start: 1, end: 3 }, id: 1, city: "NY" }, "Item 1")
    );

    var jsObj = new JsonObject().toJsonObject(list);
    expect(jsObj, "serialize ItemValueListOwner").toEqualValues({ items: [{ value: { id: 1, city: "NY" }, text: "Item 1" }] });
  });
  test("itemvalue.value is required and unique", () => {
    const prop = Serializer.findProperty("itemvalue", "value");
    expect(prop.isRequired, "itemvalue.value is required").toLooseEqual(true);
    expect(prop.isUnique, "itemvalue.value is unique").toLooseEqual(true);
  });
  test("defaultValue and defaultRowValue deserialization, remove pos", () => {
    var json = {
      name: "q1",
      defaultValue: [
        { pos: { start: 1, end: 5 }, column1: 1, column2: 2 },
        { column1: 3, column2: 4 },
      ],
      defaultRowValue: { pos: { start: 1, end: 5 }, column1: 1, column2: 2 },
    };
    var matrix = new QuestionMatrixDynamicModel("q1");
    new JsonObject().toObject(json, matrix);
    var jsObj = new JsonObject().toJsonObject(matrix);
    expect(jsObj, "serialize ItemValueListOwner").toEqualValues({
      name: "q1",
      defaultValue: [
        { column1: 1, column2: 2 },
        { column1: 3, column2: 4 },
      ],
      defaultRowValue: { column1: 1, column2: 2 },
    });
  });
  test("Custom object deserialization, remove pos", () => {
    Serializer.addClass("optionstype",
      [
        { name: "itemValue" },
        { name: "colorId" },
        { name: "label:text", isLocalizable: true },
      ], undefined);
    Serializer.addProperty("car", { name: "options:optionstype" });
    Serializer.addProperty("car", { name: "optionsarray:optionstype[]" });
    const json: any = {
      options: {
        pos: { start: 1, end: 5 },
        itemValue: "abcdef",
        label: {
          pos: { start: 10, end: 15 },
          default: "default text",
          en: "en text",
          de: "de text",
        },
        colorId: "black"
      },
      optionsarray: [{
        pos: { start: 20, end: 25 },
        itemValue: "abcdef",
        label: {
          pos: { start: 30, end: 35 },
          default: "default text",
          en: "en text",
          de: "de text",
        },
        colorId: "black"
      }]
    };
    const car: any = new Car();
    car.fromJSON(json);

    expect(car.options.itemValue, "check itemValue").toLooseEqual("abcdef");
    expect(car.options.pos.start, "pos1").toLooseEqual(1);
    expect(car.options.label.pos.start, "pos2").toLooseEqual(10);
    expect(car.optionsarray[0].pos.start, "pos3").toLooseEqual(20);
    expect(car.optionsarray[0].label.pos.start, "pos4").toLooseEqual(30);

    const car_json = car.toJSON();
    expect(car_json.options["pos"], "no pos1").toBeFalsy();
    expect(car_json.options.label["pos"], "no pos2").toBeFalsy();
    expect(car_json.optionsarray[0]["pos"], "no pos3").toBeFalsy();
    expect(car_json.optionsarray[0].label["pos"], "no pos4").toBeFalsy();

    Serializer.removeProperty("car", "options");
    Serializer.removeProperty("car", "optionsarray");
    Serializer.removeClass("optionstype");
  });
  test("ItemValue and settings.itemValueAlwaysSerializeAsObject = true", () => {
    settings.itemValueAlwaysSerializeAsObject = true;
    const list = new ItemValueListOwner();
    list.items.push(new ItemValue(7, "Item 1"));
    list.items.push(new ItemValue(5));
    list.items.push(new ItemValue("item"));

    const jsObj = new JsonObject().toJsonObject(list);
    expect(jsObj, "serialize ItemValueListOwner").toEqualValues({ "items": [{ "value": 7, "text": "Item 1" }, { "value": 5 }, { "value": "item" }] });
    settings.itemValueAlwaysSerializeAsObject = false;
  });
  test("ItemValue and settings.itemValueAlwaysSerializeAsObject = true", () => {
    settings.itemValueAlwaysSerializeText = true;
    const list = new ItemValueListOwner();
    list.items.push(new ItemValue(7, "Item 1"));
    list.items.push(new ItemValue(5));
    list.items.push(new ItemValue("item"));
    list.items.push(new ItemValue("A", "A"));
    list.items.push(new ItemValue("a", "A"));

    let jsObj = new JsonObject().toJsonObject(list);
    expect(jsObj, "serialize ItemValueListOwner with text").toEqualValues({
      "items": [{ "value": 7, "text": "Item 1" },
        { "value": 5, text: "5" },
        { "value": "item", text: "item" },
        { "value": "A", text: "A" },
        { "value": "a", text: "A" }]
    });
    settings.itemValueAlwaysSerializeText = false;
    jsObj = new JsonObject().toJsonObject(list);
    expect(jsObj, "serialize ItemValueListOwner without text").toEqualValues({ "items": [{ "value": 7, "text": "Item 1" }, 5, "item", "A", { "value": "a", text: "A" }] });
  });
  test("ItemValue and settings.itemValueAlwaysSerializeAsObject = true, do not serialize", () => {
    settings.itemValueAlwaysSerializeText = true;
    const list = new ItemValueListOwner();
    list.items.push(new ItemValue({ val: 1, text: "Item1" }, "Item 1"));
    list.items.push(new ItemValue({ val: 1, text: "Item1" }));
    let jsObj = new JsonObject().toJsonObject(list);
    expect(jsObj, "Do not serialize objects").toEqualValues({
      "items": [{ value: { val: 1, text: "Item1" }, "text": "Item 1" },
        { val: 1, text: "Item1" }]
    });
    settings.itemValueAlwaysSerializeText = false;
  });

  test("LongNamesOwner serialization", () => {
    var owner = new LongNamesOwner();
    var l1 = new LongNameItemA();
    l1.A = 5;
    var l2 = new LongNameItemB();
    l2.B = 15;
    owner.items.push(l1);
    owner.items.push(l2);
    var jsObj = new JsonObject().toJsonObject(owner);
    expect(JSON.stringify(jsObj), "serialize LongNamesOwner").toLooseEqual('{"items":[{"type":"itemA","A":5},{"type":"itemB","B":15}]}');
  });
  test("ItemValueListOwner deserialization", () => {
    var owner = new LongNamesOwner();
    new JsonObject().toObject(
      {
        items: [
          { type: "itemA", A: 5 },
          { type: "itemB_thelongpart", B: 15 },
        ],
      },
      owner
    );
    expect(owner.items.length, "there are 2 items").toLooseEqual(2);
    expect(owner.items[0].getType(), "the first object is live").toLooseEqual("itemA_thelongpart");
    expect(owner.items[1].getType(), "the second object is live").toLooseEqual("itemB_thelongpart");
  });
  test("Do not change Json", () => {
    var json = {
      items: [
        { type: "itemA", A: 5 },
        { type: "itemB_thelongpart", B: 15 },
      ],
    };
    var jsonText = JSON.stringify(json);
    var owner = new LongNamesOwner();
    new JsonObject().toObject(json, owner);
    expect(JSON.stringify(json), "Json object should be the same after deserialization").toLooseEqual(jsonText);
  });

  test("Unknown property error on deserialization", () => {
    var owner = new LongNamesOwner();
    var jsonObj = new JsonObject();
    jsonObj.toObject(
      {
        unknown1: 4,
        items: [
          { type: "itemA", A: 5 },
          { unknown2: 5, type: "itemB_thelongpart", B: 15 },
        ],
      },
      owner
    );
    expect(jsonObj.errors.length, "it has two errors").toLooseEqual(2);
    const error1 = <JsonUnknownPropertyError>jsonObj.errors[0];
    expect(error1.propertyName, "the property Name in the first error").toLooseEqual("unknown1");
    expect(error1.element.getType(), "element is set correctly in first error").toLooseEqual("LongNamesOwner");
    expect(error1.jsonObj, "jsonObj is here").toBeTruthy();
    expect(error1.className, "the class Name in the first error").toLooseEqual("LongNamesOwner");
    const error2 = <JsonUnknownPropertyError>jsonObj.errors[1];
    expect(error2.propertyName, "the property Name in the second error").toLooseEqual("unknown2");
    expect(error2.className, "the class Name in the second error").toLooseEqual("itemB_thelongpart");
    expect(error2.element.getType(), "the element property in the second error").toLooseEqual("itemB_thelongpart");
    expect(error2.jsonObj["B"], "jsonObj is correct").toLooseEqual(15);
  });
  test("Having 'pos' property for objects with errors", () => {
    var owner = new LongNamesOwner();
    var jsonObj = new JsonObject();
    jsonObj.toObject(
      {
        pos: { start: 20, end: 29 },
        unknown1: 4,
        items: [
          { pos: { start: 30, end: 40 }, type: "itemA", A: 5 },
          {
            pos: { start: 41, end: 50 },
            unknown2: 5,
            type: "itemB_thelongpart",
            B: 15,
          },
        ],
      },
      owner
    );
    expect(jsonObj.errors.length, "it should be two errors").toLooseEqual(2);
    const error1 = jsonObj.errors[0];
    const error2 = jsonObj.errors[1];
    expect(error1.at).toLooseEqual(20);
    expect(error1.end).toLooseEqual(29);
    expect(error2.at).toLooseEqual(41);
    expect(error2.end).toLooseEqual(50);
  });
  test("Do not remove 'pos' property from objects", () => {
    var dealer = new Dealer();
    var jsonObj = new JsonObject();
    jsonObj.toObject(
      {
        pos: { start: 1 },
        cars: [
          { pos: { start: 10 }, maxSpeed: 320 },
          { pos: { start: 20 }, type: "truck", maxWeight: 10000 },
        ],
      },
      dealer
    );
    var truck = <Truck>dealer.cars[0];
    expect(truck["pos"].start, "deserialize the second object").toLooseEqual(20);
  });
  test("Deserialize arrays with missing type property", () => {
    var dealer = new Dealer();
    var jsonObj = new JsonObject();
    jsonObj.toObject(
      { cars: [{ maxSpeed: 320 }, { type: "truck", maxWeight: 10000 }] },
      dealer
    );
    expect(dealer.cars.length, "can only one object deserialized").toLooseEqual(1);
    var truck = <Truck>dealer.cars[0];
    expect(truck.maxWeight, "deserialize the second object").toLooseEqual(10000);
    expect(truck.getType(), "deserialize the second object").toLooseEqual("truck");
    expect(jsonObj.errors.length, "there should be one error").toLooseEqual(1);
    expect(jsonObj.errors[0].type, "The missing type property error").toLooseEqual("missingtypeproperty");
  });
  test("Deserialize arrays with incorrect type property", () => {
    var dealer = new Dealer();
    var jsonObj = new JsonObject();
    jsonObj.toObject(
      {
        cars: [
          { type: "unknown", maxSpeed: 320 },
          { type: "truck", maxWeight: 10000 },
        ],
      },
      dealer
    );
    expect(dealer.cars.length, "can only one object deserialized").toLooseEqual(1);
    var truck = <Truck>dealer.cars[0];
    expect(truck.maxWeight, "deserialize the second object").toLooseEqual(10000);
    expect(truck.getType(), "deserialize the second object").toLooseEqual("truck");
    expect(jsonObj.errors.length, "there should be one error").toLooseEqual(1);
    expect(jsonObj.errors[0].type, "The incorrect type property error").toLooseEqual("incorrecttypeproperty");
  });
  test("Deserialization - required property error", () => {
    Serializer.addProperty("truck", { name: "req:number", default: 0, isRequired: true });
    const car = new Truck();
    var jsonObj = new JsonObject();
    jsonObj.toObject({ maxWeight: 5000 }, car);
    expect(car.maxWeight, "Property is deserialized").toLooseEqual(5000);
    expect(jsonObj.errors.length, "req property is required, but it has a default value").toLooseEqual(0);
    Serializer.removeProperty("truck", "req");
  });
  test("Deserialization - required property with default value should not produce error", () => {
    var dealer = new Dealer();
    var jsonObj = new JsonObject();
    jsonObj.toObject({ cars: [{ type: "sport" }] }, dealer);
    expect(dealer.cars.length, "One object is deserialized").toLooseEqual(1);
    expect(jsonObj.errors.length, "there should be one error about required property").toLooseEqual(1);
    let error1 = <JsonRequiredPropertyError>jsonObj.errors[0];
    expect(error1.type, "The required property error, #1").toLooseEqual("requiredproperty");
    expect(error1.propertyName, "propertyName is set, #1").toLooseEqual("maxSpeed");
    expect(error1.element.getType(), "element is set into error, #1").toLooseEqual("sport");

    Serializer.addProperty("dealer", "!foo");
    jsonObj = new JsonObject();
    jsonObj.toObject({}, dealer);
    expect(jsonObj.errors.length, "dealer: there should be one error about required property").toLooseEqual(1);
    error1 = <JsonRequiredPropertyError>jsonObj.errors[0];
    expect(error1.type, "dealer: The required property error, #2").toLooseEqual("requiredproperty");
    expect(error1.propertyName, "property name is set, #2").toLooseEqual("foo");
    expect(error1.element.getType(), "element is set into error, #2").toLooseEqual("dealer");
    expect(error1.message.indexOf("foo") > -1, "dealer: show that 'foo' is missing:" + error1.message).toLooseEqual(true);
    Serializer.removeProperty("dealer", "foo");
  });
  test("Deserialization - required property error", () => {
    var children = Serializer.getChildrenClasses("car");
    expect(children.length, "There are 5 children classes").toLooseEqual(5);
    children = Serializer.getChildrenClasses("car", true);
    expect(children.length, "There are 3 children classes that can be created.").toLooseEqual(3);
  });
  test("Property Type test", () => {
    var properties = Serializer.getProperties("truck");
    expect(properties[0].name, "It is a 'name' property").toLooseEqual("name");
    expect(properties[0].type, "Name property is string").toLooseEqual("string");
    expect(properties[1].name, "It is a 'maxWeight' property").toLooseEqual("maxWeight");
    expect(properties[1].type, "maxWeight property is number").toLooseEqual("number");
  });
  test("Property Choices test", () => {
    var properties = Serializer.getProperties("truck");
    expect(properties[0].name, "It is a 'name' property").toLooseEqual("name");
    expect(properties[0].type, "Name property is string").toLooseEqual("string");
    expect(properties[1].name, "It is a 'maxWeight' property").toLooseEqual("maxWeight");
    expect(properties[1].type, "maxWeight property is number").toLooseEqual("number");
  });
  test("Property Choices test", () => {
    var properties = Serializer.getProperties("sport");
    expect(properties[1].name, "It is a 'maxSpeed' property").toLooseEqual("maxSpeed");
    expect(properties[1].choices, "'maxSpeed' property choices").toEqualValues([100, 150, 200, 250]);
  });
  test("Property Choices func test", () => {
    var properties = Serializer.getProperties("truck");
    expect(properties[1].name, "It is a 'maxWeight' property").toLooseEqual("maxWeight");
    expect(properties[1].choices, "'maxWeight' property choices").toEqualValues([500, 1500]);
  });
  test("Property set choices test", () => {
    var property = Serializer.addProperty("sport", "choices2");
    property.setChoices([1, 2, 3]);
    expect(property.choices, "set choices array works correctly").toEqualValues([1, 2, 3]);
    property.setChoices(
      null,
      (obj: any): Array<any> => {
        return [4, 5, 6];
      }
    );
    expect(property.choices, "set choices function works correctly").toEqualValues([4, 5, 6]);
    Serializer.removeProperty("sport", "choices2");
  });
  test("Create inherited class instead of origional", () => {
    var container = new CreatingObjectContainer();
    var jsonObj = new JsonObject();
    jsonObj.toObject(
      { items: [{ type: "shouldnotcreate", A: 320 }], obj: { A: 200 } },
      container
    );
    expect(container.items.length, "one object is added").toLooseEqual(1);
    expect(container.items[0].getType(), "created the right class in array").toLooseEqual("shouldcreate");
    expect(container.obj.getType(), "created the right class in property").toLooseEqual("shouldcreate");
  });

  test("Optionally do not save all properties", () => {
    var container = new CreatingObjectContainer();
    container.items.push(new NonCreatingObject(10));
    container.items.push(new NonCreatingObject(20));
    container.obj = new NonCreatingObject(30);
    var jsonObj = new JsonObject();
    jsonObj.lightSerializing = true;
    var json = jsonObj.toJsonObject(container, false);
    expect(json, "Do not serialize items").toEqualValues({ obj: { A: 30 } });
  });

  test("toJsonObject should create new instance of objects", () => {
    var dealer = new Dealer();
    var truck = new Truck();
    truck.maxWeight = 10000;
    var sport = new SportCar();
    sport.maxSpeed = 320;
    dealer.cars = [sport, truck];
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(jsObj.cars).not.toLooseEqual(dealer.cars);
    expect(jsObj.cars[0]).not.toLooseEqual(dealer.cars[0]);
    dealer.cars.push(sport);
    expect(dealer.cars.length).toLooseEqual(3);
    expect(jsObj.cars.length).toLooseEqual(2);
  });

  test("Add new property to object", () => {
    var propertiesCount = Serializer.getProperties("truck").length;
    Serializer.addProperty("car", "isUsed:boolean");
    var dealer = new Dealer();
    new JsonObject().toObject(
      { truck: { isUsed: true, maxWeight: 10000 } },
      dealer
    );
    expect(dealer.truck["isUsed"], "new property is here").toLooseEqual(true);
    expect(propertiesCount + 1, "there is on one property more").toLooseEqual(Serializer.getProperties("truck").length);
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "property is serialized").toLooseEqual('{"truck":{"isUsed":true,"maxWeight":10000}}');
    Serializer.removeProperty("car", "isUsed");
    expect(propertiesCount, "the additional property is removed").toLooseEqual(Serializer.getProperties("truck").length);
  });

  test("Add property into alternative name of class", () => {
    Serializer.addAlterNativeClassName("truck", "trick");
    expect(Serializer.findClass("trick").name, "Find class by alternative name").toLooseEqual("truck");
    var propertiesCount = Serializer.getProperties("truck").length;
    Serializer.addProperty("trick", "isUsed:boolean");
    expect(propertiesCount + 1, "there is on one property more").toLooseEqual(Serializer.getProperties("truck").length);
    expect(propertiesCount + 1, "alternative name returns correct properties as well").toLooseEqual(Serializer.getProperties("trick").length);
    var dealer = new Dealer();
    new JsonObject().toObject(
      { truck: { isUsed: true, maxWeight: 10000 } },
      dealer
    );
    expect(dealer.truck["isUsed"], "new property is here").toLooseEqual(true);
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(jsObj, "property is serialized").toEqualValues({ truck: { isUsed: true, maxWeight: 10000 } });
    Serializer.removeProperty("trick", "isUsed");
    expect(propertiesCount, "the additional property is removed").toLooseEqual(Serializer.getProperties("truck").length);
  });

  test("Add a new number property with default value", () => {
    Serializer.addProperty("car", { name: "tag:number", default: 1 });
    var dealer = new Dealer();
    new JsonObject().toObject({ truck: { tag: 10, maxWeight: 10000 } }, dealer);
    expect(dealer.truck["tag"], "new property is here").toLooseEqual(10);
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "property is serialized").toLooseEqual('{"truck":{"tag":10,"maxWeight":10000}}');
    dealer.truck["tag"] = 1;
    jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "property is serialized").toLooseEqual('{"truck":{"maxWeight":10000}}');

    new JsonObject().toObject({ truck: { maxWeight: 10000 } }, dealer);
    jsObj = new JsonObject().toJsonObject(dealer);
    expect(JSON.stringify(jsObj), "property is serialized").toLooseEqual('{"truck":{"maxWeight":10000}}');

    Serializer.removeProperty("car", "tag");
  });

  test("Add a boolean property default value", () => {
    Serializer.addProperty("car", {
      name: "isNew:boolean",
      default: true,
    });
    Serializer.addProperty("itemvalue", {
      name: "isNew:boolean",
      default: true,
    });
    var car = new Truck();
    expect(car["isNew"], "New boolean property is added with correct default value").toLooseEqual(true);

    var item = new ItemValue(1);
    expect(item["isNew"], "New boolean property is added with correct default value into itemvalue").toLooseEqual(true);

    Serializer.removeProperty("itemvalue", "isNew");
    Serializer.removeProperty("car", "isNew");
  });

  test("A non serializable property", () => {
    var dealer = new Dealer();
    new JsonObject().toObject({ truck: { maxWeight: 10000 } }, dealer);
    dealer.definedNonSerializable = "some value";
    var jsObj = new JsonObject().toJsonObject(dealer);
    expect(jsObj, "definedNonSerializable property is not serialized").toEqualValues({ truck: { maxWeight: 10000 } });
  });

  test("Get property and readonly", () => {
    var property = Serializer.findProperty("truck", "name");
    expect(property.readOnly, "readOnly is false by default").toLooseEqual(false);
    property.readOnly = true;
    var property2 = Serializer.findProperty("truck", "name");
    expect(property2.readOnly, "readOnly is true now").toLooseEqual(true);
  });

  test("Set readOnly by default", () => {
    var property = Serializer.findProperty("truck", "readOnlyName");
    expect(property.readOnly, "readOnly is true by default").toLooseEqual(true);
  });

  test("Add alternative/misspelled property support, https://github.com/surveyjs/surveyjs/issues/280", () => {
    Serializer.findProperty("truck", "maxWeight").alternativeName =
      "maxaWeight";
    var dealer = new Dealer();
    new JsonObject().toObject(
      {
        cars: [
          { type: "sport", maxSpeed: 320 },
          { type: "truck", maxaWeight: 10000 },
        ],
      },
      dealer
    );
    var truck: any = dealer.cars[1];
    expect(truck.maxWeight, "deserialize the second object").toLooseEqual(10000);
  });

  test("Check if visible is set", () => {
    expect(Serializer.findProperty("dealer", "name").visible, "By default the property is visible").toLooseEqual(true);
    expect(Serializer.findProperty("dealer", "cars").visible, "Cars is invisible").toLooseEqual(false);
  });

  test("Test getPropertyValue and isLocalizable", () => {
    var obj = new CheckGetPropertyValue();
    obj.directProp = "dirValue";
    obj.getValueProp = "getValue_no";
    obj.getValuePropGetter = "getValue_yes";
    obj.serProperty = "serProperty_no";
    obj.getSerProperty.text = "serProperty_yes";
    obj.locProperty = "loc_no";
    obj.locPropertyGetter.text = "loc_yes";

    var property = Serializer.findProperty(obj.getType(), "directProp");
    expect(property.getPropertyValue(obj), "dirProperty works correctly").toLooseEqual("dirValue");

    property = Serializer.findProperty(obj.getType(), "getValueProp");
    expect(property.getPropertyValue(obj), "getValueProp works correctly").toLooseEqual("getValue_yes");

    property = Serializer.findProperty(obj.getType(), "serProperty");
    expect(property.getPropertyValue(obj), "getValueProp works correctly").toEqualValues({ text: "serProperty_yes" });

    property = Serializer.findProperty(obj.getType(), "locProperty");
    expect(property.getPropertyValue(obj), "getValueProp works correctly").toLooseEqual("loc_yes");
  });
  test("Deserialize number and boolean correctly, bug #439", () => {
    Serializer.addProperty("car", "isUsed:boolean");
    var truck = new Truck();
    new JsonObject().toObject(
      { type: "truck", maxWeight: "10", isUsed: "false" },
      truck
    );
    expect(truck.maxWeight, "deserialize property as number").toLooseEqual(10);
    truck.maxWeight += 1;
    expect(truck.maxWeight, "it should becomes 11 now").toLooseEqual(11);
    expect(truck["isUsed"], "deserialize property as boolean").toLooseEqual(false);
    truck["isUsed"] = !truck["isUsed"];
    expect(truck["isUsed"], "it should become true").toLooseEqual(true);
    Serializer.removeProperty("car", "isUsed");
  });

  test("Loading test deserialization", () => {
    var obj = new LoadingFromJsonObj();
    new JsonObject().toObject(
      { name: "obj", items: [{ name: "item1" }, { name: "item2" }] },
      obj
    );
    expect(obj.name).toLooseEqual("obj");
    expect(obj.items.length).toLooseEqual(2);
    expect(obj.items[1].name).toLooseEqual("item2");
    expect(obj.startLoadingFromJsonCounter, "obj: startLoadingFromJson was called one time").toLooseEqual(1);
    expect(obj.endLoadingFromJsonCounter, "obj: endLoadingFromJson was called one time").toLooseEqual(1);
    expect(obj.items[1].startLoadingFromJsonCounter, "item1: startLoadingFromJson was called one time").toLooseEqual(1);
    expect(obj.items[1].endLoadingFromJsonCounter, "item1: endLoadingFromJson was called one time").toLooseEqual(1);
  });

  test("Override type property in a successor class", () => {
    var property = Serializer.findProperty("fast", "name");
    expect(property.type, "The default type").toLooseEqual("string");
    function findProperty() {
      property = null;
      var properties = Serializer.getProperties("fast");
      for (var i = 0; i < properties.length; i++) {
        if (properties[i].name == "name") {
          property = properties[i];
          break;
        }
      }
    }
    findProperty();
    expect(property.type, "The default type").toLooseEqual("string");
    Serializer.addProperty("fast", "name:text");
    property = Serializer.findProperty("fast", "name");
    expect(property.type, "The type is text for fast car").toLooseEqual("text");
    property = Serializer.findProperty("car", "name");
    expect(property.type, "The type is string for car").toLooseEqual("string");
    findProperty();
    expect(property.type, "The type is text for fast car, getProperties").toLooseEqual("text");
  });

  test("Set default value to the custom property", () => {
    Serializer.addProperty("car", {
      name: "isUsed:boolean",
      default: true,
    });
    Serializer.addProperty("car", { name: "tag:number", default: 0 });
    var truck = new Truck();
    expect(truck["isUsed"], "the default boolean value is set").toLooseEqual(true);
    expect(truck["tag"], "the default numeric value is set").toLooseEqual(0);
    Serializer.removeProperty("car", "isUsed");
    Serializer.removeProperty("car", "tag");
  });
  test("Create localizable property", () => {
    Serializer.addProperty("car", {
      name: "myLocalizableProp:text",
      isLocalizable: true,
    });
    var property = Serializer.findProperty("car", "myLocalizableProp");
    expect(property.serializationProperty, "set correct serializationProperty").toLooseEqual("locMyLocalizableProp");
    var truck = new Truck();
    expect(truck["myLocalizableProp"], "It is empty").toBeFalsy();
    expect(property.getPropertyValue(truck), "It is empty, via property").toBeFalsy();

    truck["myLocalizableProp"] = "default_Text";
    expect(property.getPropertyValue(truck), "get value via property").toLooseEqual("default_Text");
    expect(truck["myLocalizableProp"], "The default text is here").toLooseEqual("default_Text");
    truck.locale = "de";
    truck["myLocalizableProp"] = "de_Text";
    expect(truck["myLocalizableProp"], "The 'de' text is here").toLooseEqual("de_Text");
    truck.locale = "en";
    expect(truck["myLocalizableProp"], "Use default value again").toLooseEqual("default_Text");
    expect(new JsonObject().toJsonObject(truck), "Serialized correctly").toEqualValues({ myLocalizableProp: { default: "default_Text", de: "de_Text" } });

    Serializer.removeProperty("car", "myLocalizableProp");
  });

  test("Create localizable property in Item value, use getPropertyValue/setPropertyValue", () => {
    Serializer.addProperty("itemvalue", {
      name: "myLocalizableProp:text",
      isLocalizable: true,
    });
    var property = Serializer.findProperty("itemvalue", "myLocalizableProp");
    var itemValue = new ItemValue(1);
    var car = new Car();
    itemValue.locOwner = car;
    expect(itemValue["myLocalizableProp"], "It is empty").toBeFalsy();
    expect(property.getPropertyValue(itemValue), "It is empty, via property").toBeFalsy();

    //property.setValue(itemValue, "default_Text", null);
    itemValue["myLocalizableProp"] = "default_Text";
    expect(property.getPropertyValue(itemValue), "get value via property").toLooseEqual("default_Text");
    expect(itemValue["myLocalizableProp"], "The default text is here").toLooseEqual("default_Text");
    car.locale = "de";
    //property.setValue(itemValue, "de_Text", null);
    itemValue["myLocalizableProp"] = "de_Text";
    expect(property.getPropertyValue(itemValue), "The 'de' text is here, via property").toLooseEqual("de_Text");
    expect(itemValue["myLocalizableProp"], "The 'de' text is here").toLooseEqual("de_Text");
    car.locale = "en";
    expect(itemValue["myLocalizableProp"], "Use default value again").toLooseEqual("default_Text");
    expect(property.getPropertyValue(itemValue), "Use default value again via property").toLooseEqual("default_Text");

    Serializer.removeProperty("itemvalue", "myLocalizableProp");
  });

  test("Create  object with virtual type by using parent constructor", () => {
    var dealer = new Dealer();
    var jsonObj = new JsonObject();
    jsonObj.toObject(
      {
        cars: [
          { type: "customtruck", maxWeight: 10000, description: "some text" },
        ],
      },
      dealer
    );
    expect(dealer.cars.length, "can only one object deserialized").toLooseEqual(1);
    var truck = <Truck>dealer.cars[0];
    expect(truck.maxWeight, "maxWeight is deserialized").toLooseEqual(10000);
    expect(truck["description"], "added property is deserialized").toLooseEqual("some text");
    expect(truck["isCustom"], "added property created if it is default").toLooseEqual(true);
    expect(truck.getType(), "type is customtruck").toLooseEqual("customtruck");
    expect(truck.getTemplate(), "template is truck").toLooseEqual("truck");
  });

  test("Custom class - do not serialize invisible properties with default value", () => {
    var dealer = <Dealer>Serializer.createClass("customdealer");
    expect(dealer, "The object is created").toBeTruthy();
    expect(dealer.getType(), "type is customdealer").toLooseEqual("customdealer");
    expect(dealer.getTemplate(), "template is dealer").toLooseEqual("dealer");
    dealer.name = "mydealer";
    var jsonObj = new JsonObject();
    var json = jsonObj.toJsonObject(dealer);
    expect(json, "property with default value is not serialized").toEqualValues({ name: "mydealer" });
  });

  test("Create class with camel name", () => {
    var dealer = <Dealer>Serializer.createClass("Cameldealer");
    expect(dealer, "The object is created").toBeTruthy();
  });

  test("Generate properties on the fly", () => {
    var carOwner = <CarOwner>Serializer.createClass("carowner");
    expect(carOwner, "The object is created").toBeTruthy();
    expect(carOwner.getType(), "type is carowner").toLooseEqual("carowner");
    expect(carOwner.carType, "the default value is fast").toLooseEqual("fast");
    expect(carOwner.car.getType(), "the car is fast car").toLooseEqual("fast");
    carOwner.carType = "truck";
    expect(carOwner.carType, "the default value is truck").toLooseEqual("truck");
    expect(carOwner.car.getType(), "the car is fast truck").toLooseEqual("truck");
    carOwner["maxWeight"] = 100;
    expect(carOwner.car["maxWeight"], "The property has been added correctly").toLooseEqual(100);
    carOwner.carType = "fast";
    expect(carOwner.car["maxWeight"], "The property doesn't equal 100").not.toLooseEqual(100);
    expect(carOwner["maxWeight"], "The property doesn't exist").toLooseEqual(undefined);
  });

  test("Serialize/deserialize dynamic properties", () => {
    var carOwner = new CarOwner();
    carOwner.carType = "truck";
    carOwner["maxWeight"] = 100;
    var json = new JsonObject().toJsonObject(carOwner);
    expect(json, "The additional property has serialized").toEqualValues({ carType: "truck", maxWeight: 100 });
    carOwner.carType = "fast";
    expect(new JsonObject().toJsonObject(carOwner), "There is no additional properties").toEqualValues({});
    carOwner = new CarOwner();
    new JsonObject().toObject({ carType: "truck", maxWeight: 200 }, carOwner);
    expect(carOwner.carType, "the car type was created correctly").toLooseEqual("truck");
    expect(carOwner["maxWeight"], "The dynamic property loaded correctly").toLooseEqual(200);
    expect(carOwner.car["maxWeight"], "The dynamic property set correctly").toLooseEqual(200);
  });

  test("Add property into questionbase", () => {
    Serializer.addProperty("questionbase", "custom");
    var question = new Question("q1");
    new JsonObject().toObject({ name: "q2", custom: "customValue1" }, question);
    expect(question.name, "name serialzied successful").toLooseEqual("q2");
    expect(question["custom"], "custom serialzied successful").toLooseEqual("customValue1");
    Serializer.removeProperty("questionbase", "custom");
  });

  test("Add textitems (array) property into questionbase", () => {
    Serializer.addProperty("questionbase", {
      name: "customItems",
      type: "textitems",
    });
    var question = new Question("q1");

    var property = Serializer.findProperty("questionbase", "customItems");
    expect(property.type, "Property should have correct type").toLooseEqual("textitem[]");

    Serializer.removeProperty("questionbase", "customItems");
  });

  test("Add itemvalues (array) property into questionbase", () => {
    Serializer.addProperty("questionbase", "customArray:itemvalues");
    var question = new Question("q1");

    var property = Serializer.findProperty("questionbase", "customArray");
    expect(property.type, "Property should have correct type").toLooseEqual("itemvalue[]");
    expect(property.className, "Property should have correct className").toLooseEqual("itemvalue");

    expect(question["customArray"].length, "customArray deserialzied successful").toLooseEqual(0);
    new JsonObject().toObject(
      { name: "q2", custom: "customValue1", customArray: [1, 2, 3, 4] },
      question
    );
    expect(question["customArray"].length, "customArray deserialzied successful").toLooseEqual(4);
    expect(question["customArray"][0].value, "customArray content deserialzied successful").toLooseEqual(1);

    var json = new JsonObject().toJsonObject(question);
    expect(json.customArray, "customArray serialzied successful").toEqualValues([1, 2, 3, 4]);

    Serializer.removeProperty("questionbase", "customArray");

    Serializer.addProperty("questionbase", {
      name: "customArray:itemvalues",
      default: [1, 3, 5],
    });
    question = new Question("q2");
    expect(question["customArray"].length, "defaultValue loaded successful").toLooseEqual(3);
    Serializer.removeProperty("questionbase", "customArray");
  });

  test("Serialize default values - https://github.com/surveyjs/surveyjs/issues/1386", () => {
    var q1 = new Question("q1");
    var q2 = new Question("q2");

    q1.readOnly = false;
    var json = new JsonObject().toJsonObject(q1, true);

    expect(json["readOnly"], "default value for readOnly property has been serialzied successfully").toLooseEqual(false);
    const jsonKeys = Object.keys(json);
    expect(jsonKeys.indexOf("validators"), "no validators").toLooseEqual(-1);

    q2.readOnly = true;
    new JsonObject().toObject(json, q2);
    expect(q2.readOnly, "default value for readOnly proeprty has been deserialzied successfully").toBeFalsy();
  });

  test("itemvalues (array) default value", () => {
    Serializer.addProperty("questionbase", {
      name: "customArray:itemvalues",
      default: [0, 25, 50, 75, 100],
    });
    var question = new Question("q1");

    expect(question["customArray"].length, "customArray defaults applied successfully").toLooseEqual(5);

    question["customArray"][0].text = "text 1";

    var json = new JsonObject().toJsonObject(question);
    expect(json.customArray, "customArray serialzied successful 1").toEqualValues([
      {
        text: "text 1",
        value: 0,
      },
      25,
      50,
      75,
      100,
    ]);

    question = new Question("q1");

    new JsonObject().toObject(json, question);
    expect(question["customArray"][0].text, "text deserialized ok").toLooseEqual("text 1");

    json = new JsonObject().toJsonObject(question);
    expect(json.customArray, "customArray serialzied successful 2").toEqualValues([
      {
        text: "text 1",
        value: 0,
      },
      25,
      50,
      75,
      100,
    ]);

    question["customArray"][0].text = "text 2";
    json = new JsonObject().toJsonObject(question);

    expect(json.customArray, "customArray serialzied successful 2").toEqualValues([
      {
        text: "text 2",
        value: 0,
      },
      25,
      50,
      75,
      100,
    ]);

    Serializer.removeProperty("questionbase", "customArray");
  });

  test("itemvalues (array) save localized text", () => {
    Serializer.addProperty("questionbase", {
      name: "customArray:itemvalues",
      default: [0],
    });
    var question = new Question("q1");

    expect(question["customArray"].length, "customArray defaults applied successfully").toLooseEqual(1);

    question["customArray"][0].text = "text 1";
    question.locOwner = <any>{
      getLocale: () => "de",
      doPropertyValueChangedCallback: () => { },
      getMarkdownHtml: (text) => text,
    };
    question["customArray"][0].text = "text de";

    var json = new JsonObject().toJsonObject(question);
    expect(json.customArray, "customArray serialzied successful 1").toEqualValues([
      {
        text: {
          default: "text 1",
          de: "text de",
        },
        value: 0,
      },
    ]);

    Serializer.removeProperty("questionbase", "customArray");
  });

  test("ItemValue should be deserialized without errors", () => {
    var list = new ItemValueListOwner();

    var jsonObject = new JsonObject();
    jsonObject.toObject(
      {
        items: [
          { value: 7, text: "Item 1", price: 55.5 },
          5,
          "item",
          "value1|text1",
        ],
      },
      list
    );
    expect(jsonObject.errors.length, "there are no errors on deserialization").toLooseEqual(0);
  });

  test("Extend ItemValue via inheritance with custom property", () => {
    Serializer.addClass(
      "itemvaluesWithPoints",
      ["points:number"],
      null,
      "itemvalue"
    );
    Serializer.addProperty("itemvalue", "guid");
    Serializer.addProperty("questionbase", {
      name: "customArray:itemvalues",
      default: [0],
    });
    var p1 = Serializer.findProperty("questionbase", "customArray");
    p1["typeValue"] = "itemvaluesWithPoints";
    p1["className"] = "itemvaluesWithPoints";
    var question = new Question("q1");

    question["customArray"][0]["points"] = 1;
    expect(question["customArray"][0]["points"], "one should be able to read and write the custom property").toLooseEqual(1);
    question["customArray"][0]["guid"] = "2";
    expect(question["customArray"][0]["guid"], "one should be able to read and write the inherited custom property").toLooseEqual("2");

    var jsonObject = new JsonObject();
    jsonObject.toObject(
      {
        name: "q1",
        customArray: [
          { value: 7, text: "Item 1", points: 5 },
          5,
          "item",
          "value1|text1",
        ],
      },
      question
    );
    expect(question["customArray"].length, "custom array should be deserialized").toLooseEqual(4);
    expect(question["customArray"][0]["points"], "custom property value should be deserialized").toLooseEqual(5);
    expect(jsonObject.errors.length, "there are no errors on deserialization").toLooseEqual(0);
    Serializer.removeProperty("questionbase", "customArray");
    Serializer.removeProperty("itemvalue", "guid");
  });

  test("isDescendantOf", () => {
    Serializer.addClass(
      "itemvaluesWithPoints",
      ["points:number"],
      null,
      "itemvalue"
    );

    expect(Serializer.isDescendantOf("itemvaluesWithPoints", "itemvalue"), "itemvaluesWithPoints is a descendant of the itemvalue").toBeTruthy();
    expect(Serializer.isDescendantOf("itemvalue", "itemvalue"), "itemvalue is a descendant of the itemvalue").toBeTruthy();
  });
  test("property.isVisible", () => {
    var property = Serializer.findProperty("dealer", "dummyname");
    expect(property.visible, "Property is visible").toLooseEqual(true);
    expect(property.isVisible("row"), "Property is visible in row layout").toLooseEqual(true);
    expect(property.isVisible("flow"), "Property is invisible in flow layout").toLooseEqual(false);
  });
  test("title property.isVisible", () => {
    const prop = Serializer.findProperty("question", "title");
    prop.visibleIf = (obj: any): boolean => {
      return obj.name != "abc";
    };
    const q = new QuestionTextModel("q1");
    expect(prop.isVisible("row", q), "row, #1").toLooseEqual(true);
    expect(prop.isVisible("detail", q), "detail #2").toLooseEqual(false);
    expect(prop.isVisible("", q), "empty #1").toLooseEqual(true);
    q.name = "abc";
    expect(prop.isVisible("row", q), "row, #2").toLooseEqual(false);
    expect(prop.isVisible("detail", q), "detail #2").toLooseEqual(false);
    expect(prop.isVisible("", q), "empty #2").toLooseEqual(false);
    (<any>prop).visibleIf = undefined;
  });

  test("property.baseValue", () => {
    Serializer.addProperty("questionbase", {
      name: "newChoices1:itemvalues",
      baseValue: function () {
        return "Column";
      },
    });
    Serializer.addProperty("questionbase", {
      name: "newChoices2:itemvalues",
      baseValue: "Row",
    });
    expect(Serializer.findProperty("questionbase", "newChoices2").getBaseValue(), "getBaseValue works fine with constant").toLooseEqual("Row");
    expect(Serializer.findProperty("questionbase", "newChoices1").getBaseValue(), "getBaseValue works fine with function").toLooseEqual("Column");
    expect(Serializer.findProperty("selectbase", "choices").getBaseValue(), "it is item for choices").toLooseEqual("item");
    expect(Serializer.findProperty("matrix", "rows").getBaseValue(), "it is Row for rows").toLooseEqual("Row");
    expect(Serializer.findProperty("matrix", "columns").getBaseValue(), "it is Column for columns").toLooseEqual("Column");

    Serializer.removeProperty("questionbase", "newChoices1");
    Serializer.removeProperty("questionbase", "newChoices2");
  });

  test("Remove class", () => {
    expect(Serializer.findClass("big"), "Class is here").toBeTruthy();
    var classes = [];
    Serializer.getChildrenClasses("car", false).forEach((item) => {
      classes.push(item.name);
    });
    expect(classes.indexOf("big") > -1, "big is in children car classes").toBeTruthy();

    Serializer.removeClass("big");
    expect(Serializer.findClass("big"), "Class is not here").toBeFalsy();
    classes = [];
    Serializer.getChildrenClasses("car", false).forEach((item) => {
      classes.push(item.name);
    });
    expect(classes.indexOf("big") > -1, "big is not in children car classes").toBeFalsy();

    Serializer.addClass("big", [], null, "car");
  });

  test("Get properties dependedOn", () => {
    var propCar = Serializer.findProperty("dealer", "car");
    var propTruck = Serializer.findProperty("dealer", "truck");
    expect(propCar.getDependedProperties()).toEqualValues(["truck"]);
    expect(propTruck.getDependedProperties()).toEqualValues([]);

    Serializer.addProperty("dealer", { name: "dp1", dependsOn: "car" });
    expect(propCar.getDependedProperties()).toEqualValues(["truck", "dp1"]);

    //depends on property from a parent class
    Serializer.addProperty("sport", { name: "dp2", dependsOn: ["name"] });
    var propName = Serializer.findProperty("sport", "name");
    expect(propName.getDependedProperties()).toEqualValues(["dp2"]);

    Serializer.removeProperty("dealer", "dp1");
    Serializer.removeProperty("sport", "dp2");
  });
  test("property.visibleIf functionality", () => {
    var dealer = new Dealer();
    var propTruck = Serializer.findProperty("dealer", "truck");
    expect(propTruck.isVisible("row", dealer), "It is invisible by default").toLooseEqual(false);
    dealer.car = new Truck();
    dealer.car.name = "mycar";
    expect(propTruck.isVisible("row", dealer), "The visibleIf returns true").toLooseEqual(true);
  });

  test("Apply defaultValue property serializer attribute for all object in constructor", () => {
    var propDefaultValue = Serializer.findProperty("dealer", "defaultValue");
    var oldValue = propDefaultValue.defaultValue;
    propDefaultValue.defaultValue = "MyValue";
    var dealer = new Dealer();
    expect(dealer.defaultValue).toLooseEqual("MyValue");
    propDefaultValue.defaultValue = oldValue;
  });

  test("custom property and onSetValue", () => {
    Serializer.addProperty("car", {
      name: "onSetValueCheck",
      onSetValue: function (obj, value) {
        obj.dummyProperty = value;
      },
    });
    var car = new Car();
    car["onSetValueCheck"] = "dummy";
    expect(car["dummyProperty"], "onSetValue attribute is working").toLooseEqual("dummy");
    Serializer.removeProperty("car", "onSetValueCheck");
  });

  class RedefinedNameCar extends Car {
    constructor() {
      super();
    }
    public getType(): string {
      return "numberedcarredefinedname";
    }
  }

  test("re-defnine property in dynamic type", () => {
    var properties = Serializer.getPropertiesByObj(
    <CarOwner>Serializer.createClass("carowner")
    );
    Serializer.addClass(
      "numberedcarredefinedname",
      [],
      () => new RedefinedNameCar(),
      "car"
    );
    Serializer.addProperties("numberedcarredefinedname", [
      {
        name: "name:number",
        default: 100,
      },
    ]);
    var carOwner = <CarOwner>Serializer.createClass("carowner");
    carOwner.carType = "numberedcarredefinedname";
    var newProperties = Serializer.getPropertiesByObj(carOwner);
    expect(properties.length, "We do not add new property, since it has the same name as original").toLooseEqual(newProperties.length);
    var nameProperties = newProperties.filter((p) => p.name === "name");
    expect(nameProperties.length, "Only one name property").toLooseEqual(1);
    expect(nameProperties[0].type, "We do not change the property").toLooseEqual("string");
    Serializer.removeClass("numberedcarredefinedname");
  });

  test("ItemValue notifications", () => {
    Serializer.addClass(
      "itemorder",
      [
        { name: "visibleIf", visible: false },
        { name: "enableIf", visible: false },
      ],
      function () {
        return new ItemValue(null, null, "itemorder");
      },
      "itemvalue"
    );
    Serializer.addProperty("itemorder", {
      name: "price:number",
      default: 0,
    });
    Serializer.addProperty("dealer", {
      name: "orders:itemorder[]",
      category: "general",
    });
    var dealer = new Dealer();
    var propChangeSenderType = "";
    var propChangeName = "";
    var propChangeCounter = 0;
    dealer.onPropertyChanged.add((sender, options) => {
      propChangeSenderType = sender.getType();
      propChangeName = options.name;
      propChangeCounter++;
    });
    var propItemValueChangeSenderType = "";
    var propItemValueChangeObjType = "";
    var propItemValueChangePropertyName = "";
    var propItemValueChangeName = "";
    var propItemValueChangeCounter = 0;
    dealer.onItemValuePropertyChanged.add((sender, options) => {
      propItemValueChangeSenderType = sender.getType();
      propItemValueChangeObjType = options.obj.getType();
      propItemValueChangePropertyName = options.propertyName;
      propItemValueChangeName = options.name;
      propItemValueChangeCounter++;
    });
    dealer["orders"].push(new ItemValue(1, "11", "itemorder"));
    expect(propChangeCounter, "One time was changed").toLooseEqual(1);
    expect(propChangeSenderType, "sender type is correct").toLooseEqual("dealer");
    expect(propChangeName, "prop name is correct").toLooseEqual("orders");
    var orderItem = dealer["orders"][0];
    orderItem.value = 2;
    expect(propItemValueChangeCounter, "ItemValue: One time was changed").toLooseEqual(1);
    expect(propItemValueChangeSenderType, "ItemValue: sender type is correct").toLooseEqual("dealer");
    expect(propItemValueChangeObjType, "ItemValue: itemvalue type is correct").toLooseEqual("itemorder");
    expect(propItemValueChangePropertyName, "ItemValue: property name is correct").toLooseEqual("orders");
    expect(propItemValueChangeName, "ItemValue: itemvalue name is correct").toLooseEqual("value");
    orderItem.price = 10;
    expect(propItemValueChangeCounter, "ItemValue (price): One time was changed").toLooseEqual(2);
    expect(propItemValueChangeSenderType, "ItemValue (price): sender type is correct").toLooseEqual("dealer");
    expect(propItemValueChangeObjType, "ItemValue (price): itemvalue type is correct").toLooseEqual("itemorder");
    expect(propItemValueChangePropertyName, "ItemValue (price): property name is correct").toLooseEqual("orders");
    expect(propItemValueChangeName, "ItemValue (price): itemvalue name is correct").toLooseEqual("price");
    Serializer.removeProperty("dealer", "orders");
    Serializer.removeClass("itemorder");
  });

  test("Override invisible property by making it visible", () => {
    Serializer.addProperty("itemvalue", {
      name: "price:number",
      visible: false,
    });
    Serializer.addClass(
      "itemorder",
      [
        {
          name: "price:number",
          visible: true,
        },
      ],
      function () {
        return new ItemValue(null, null, "itemorder");
      },
      "itemvalue"
    );
    var properties = Serializer.getProperties("itemvalue");
    var propertiesOrder = Serializer.getProperties("itemorder");
    expect(properties.length, "The number of properties are the same").toLooseEqual(propertiesOrder.length);
    var l = properties.length - 1;
    expect(properties[l].name, "itemvalue: price propeprty").toLooseEqual("price");
    expect(properties[l].visible, "itemvalue: price invisible").toLooseEqual(false);
    expect(propertiesOrder[l].name, "itemorder: price propeprty").toLooseEqual("price");
    expect(propertiesOrder[l].visible, "itemorder: price visible").toLooseEqual(true);
    Serializer.removeClass("itemorder");
    Serializer.removeProperty("item", "price");
  });

  test("ItemValue value changed notifications", () => {
    var itemValue = new ItemValue("item");
    var valueChangedCount = 0;
    itemValue.registerPropertyChangedHandlers(["value"],
      () => {
        valueChangedCount++;
      },
      "val_changed"
    );
    itemValue.value = "Test";
    expect(valueChangedCount, "changed notification has been fired").toLooseEqual(1);
    itemValue.unregisterPropertyChangedHandlers(["value"], "val_changed");
  });
  test("property.displayName", () => {
    expect(Serializer.findProperty("truck", "maxWeight").displayName, "property.displayName is correct").toLooseEqual("Maximum Weight");
  });
  test("Serializer.getAllClasses() function", () => {
    var classes = Serializer.getAllClasses();
    expect(classes.indexOf("truck") > -1, "Has truck").toBeTruthy();
    expect(classes.indexOf("question") > -1, "Has question").toBeTruthy();
    expect(classes.indexOf("dummy_") > -1, "Has no dummy_").toBeFalsy();
  });
  test("Serializer.getAllPropertiesByName() function", () => {
    var properties = Serializer.getAllPropertiesByName("description");
    expect(properties.length, "survey, panel, page, question, customtruck, nonvalue").toLooseEqual(6);
    expect(properties[0].name, "Find property with the correct name").toLooseEqual("description");
  });
  test("nextToProperty attribute", () => {
    var prop = Serializer.addProperty("truck", {
      name: "test",
      nextToProperty: "name",
    });
    expect(prop.nextToProperty, "created with correct nextToProperty attribute").toLooseEqual("name");
    Serializer.removeProperty("truck", "test");
  });
  test("check dataList attribute", () => {
    var prop = Serializer.findProperty("carowner", "name");
    expect(prop.dataList, "dataList attribute created correctly").toEqualValues(["item1", "item2"]);
  });
  test("check isUnique attribute", () => {
    var prop = Serializer.findProperty("carowner", "name");
    expect(prop.isUnique, "isUnique attribute created correctly").toEqualValues(true);
  });
  test("multiplevalues/array property should call onPropertyChanged on modifying array", () => {
    Serializer.addProperty("carowner", "ar:multiplevalues");
    var owner = new CarOwner();
    var propName = "";
    var counter = 0;
    owner.onPropertyChanged.add((sender, options) => {
      propName = options.name;
      counter++;
    });
    owner["ar"] = ["A"];
    owner["ar"].push("B");
    expect(owner["ar"], "property set correctly").toEqualValues(["A", "B"]);
    expect(counter, "onPropertyChanged called two times").toLooseEqual(2);
    expect(propName, "onPropertyChanged called on chaning 'ar' property").toLooseEqual("ar");
    Serializer.removeProperty("carowner", "ar");
  });
  test("always return false for a boolean property", () => {
    Serializer.addProperty("truck", "boolProp:boolean");
    var truck = new Truck();
    expect(truck.getPropertyValue("boolProp"), "There is no default value, but we use false as default for boolean ").toLooseEqual(false);
    Serializer.removeProperty("truck", "boolProp");
  });
  test("Serialize title with whitespace, Bug#2725", () => {
    var question = new Question("q1");
    question.title = " ";
    expect(question.title, "White space is set").toLooseEqual(" ");
    expect(question.locTitle.isEmpty, "Value is not empty").toLooseEqual(false);
    expect(question.toJSON(), "Serialize white space").toEqualValues({ name: "q1", title: " " });
  });
  test("itemvalue enableIf property visibility test", () => {
    var rating = new QuestionRatingModel("q1");
    rating.rateValues.push(new ItemValue(1));
    var checkbox = new QuestionCheckboxModel("q2");
    checkbox.choices.push(new ItemValue(1));

    var property = Serializer.findProperty("itemvalue", "enableIf");
    expect(property, "Property is here").toBeTruthy();
    expect(property.isVisible("form", rating.rateValues[0]), "We do not show enableIf for rateValues").toLooseEqual(false);
    expect(property.isVisible("form", checkbox.choices[0]), "We show enableIf for all other properties").toLooseEqual(true);
  });
  test("Change default value for question.showNumber", () => {
    expect(new Question("q1").showNumber, "By default showNumber returns true").toLooseEqual(true);
    Serializer.findProperty("question", "showNumber").defaultValue = false;
    expect(new Question("q1").showNumber, "We have override showNumber").toLooseEqual(false);
    Serializer.findProperty("question", "showNumber").defaultValue = true;
    expect(new Question("q1").showNumber, "We made showNumber true by default again").toLooseEqual(true);
  });
  test("Serializer.getProperty()", () => {
    Serializer.addClass("new_dealer", [], null, "dealer");
    let new_dealer: Dealer = Serializer.createClass("new_dealer");
    expect(new_dealer.defaultValue, "Use attribute from dealer for new_dealer").toLooseEqual("default");
    Serializer.getProperty("new_dealer", "defaultValue").defaultValue = "new_default";
    new_dealer = Serializer.createClass("new_dealer");
    expect(new_dealer.defaultValue, "Use attribute from new_dealer").toLooseEqual("new_default");
    let dealer: Dealer = Serializer.createClass("dealer");
    expect(dealer.defaultValue, "Use attribute from dealer").toLooseEqual("default");
    Serializer.removeClass("new_dealer");
  });
  test("Serializer.getProperty For not-arrays and arrays", () => {
    Serializer.addClass("new_selectbase", [], null, "selectbase");
    let hasOtherFind = Serializer.findProperty("new_selectbase", "hasOther");
    expect(hasOtherFind.isArray, "Find hasOther for new_selectbase is not array").toLooseEqual(false);
    let hasOtherGet = Serializer.getProperty("new_selectbase", "hasOther");
    expect(hasOtherGet.isArray, "Get hasOther for new_selectbase is not array").toLooseEqual(false);

    let choicesPropFind = Serializer.findProperty("new_selectbase", "choices");
    expect(choicesPropFind.isArray, "Find Choices for new_selectbase is array").toLooseEqual(true);
    let choicesPropGet = Serializer.getProperty("new_selectbase", "choices");
    expect(choicesPropGet.isArray, "Get Choices for new_selectbase is array").toLooseEqual(true);
    Serializer.removeClass("new_selectbase");
  });
  test("Declared @property", () => {
    const obj = new TestDeclaredProps();
    expect(obj.numberProp, "get default number prop").toLooseEqual(5);
    expect(obj["locStr1"], "locStr1 exists").toBeTruthy();
    expect(obj["locStr1"].owner, "locStr1 owner is correct").toBe(obj);
    obj["locStr1"].setLocaleText("", "val1", "locStr1 set value");
    expect(obj["locStr1"].getLocaleText(""), "locStr1 get value").toLooseEqual("val1");

    expect(obj["locStrName"], "locStrName exists").toBeTruthy();
    expect(obj["locStrName"].owner, "locStrName owner is correct").toBe(obj);
    obj["locStrName"].setLocaleText("", "val2", "locStrName set value");
    expect(obj["locStrName"].getLocaleText(""), "locStrName get value").toLooseEqual("val2");
    expect(obj.str2, "str2 get value").toLooseEqual("val2");

    expect(obj["locStr3"], "locStr3 exists").toBeTruthy();
    expect(obj["locStr3"].owner, "locStr3 owner is correct").toBe(obj);
    expect(obj.str3, "get default value from localizable strings").toLooseEqual("Complete");
    obj["locStr3"].setLocaleText("", "val3", "locStr3 set value");
    expect(obj["locStr3"].getLocaleText(""), "locStr3 get value").toLooseEqual("val3");
    expect(obj.str3, "str3 get value").toLooseEqual("val3");
    obj.locale = "";
  });
  test("Check Declared @property localizable string defaultStr", () => {
    const obj = new TestDeclaredProps();
    expect(obj["locStr3"], "locStr3 exists").toBeTruthy();
    expect(obj["locStr3"].owner, "locStr3 owner is correct").toBe(obj);
    expect(obj["locStr3"].renderedHtml, "get renderedHtml for loc string from default string").toLooseEqual("Complete");
    obj["locStr3"].setLocaleText("", "val3", "locStr3 set value");
    expect(obj["locStr3"].renderedHtml, "get renderedHtml for loc string from changed default string").toLooseEqual("val3");
    obj.locale = "";
  });
  test("TextValidator, serialize allowDigits property", () => {
    const validator = new TextValidator();
    expect(validator.toJSON(), "validator is empty").toEqualValues({});
    validator.allowDigits = false;
    expect(validator.toJSON(), "allowDigits is false").toEqualValues({ allowDigits: false });
    validator.allowDigits = true;
    expect(validator.toJSON(), "validator is empty again").toEqualValues({});
    validator.minLength = 1;
    validator.maxLength = 10;
    expect(validator.toJSON(), "minLength and maxLenght are not null").toEqualValues({ minLength: 1, maxLength: 10 });
  });
  test("Change question isRequired default value", () => {
    expect(new Question("q1").isRequired, "It is false by defult").toLooseEqual(false);
    Serializer.findProperty("question", "isRequired").defaultValue = true;
    expect(new Question("q1").isRequired, "It is true now").toLooseEqual(true);
    Serializer.findProperty("question", "isRequired").defaultValue = false;
    expect(new Question("q1").isRequired, "It is false again").toLooseEqual(false);
  });
  test("Change question readOnly default value", () => {
    expect(new Question("q1").readOnly, "It is false by defult").toLooseEqual(false);
    Serializer.findProperty("question", "readOnly").defaultValue = true;
    expect(new Question("q1").readOnly, "It is true now").toLooseEqual(true);
    expect(new Question("q1").toJSON(), "no readOnly attribute in JSON, #1").toEqualValues({ name: "q1" });
    Serializer.findProperty("question", "readOnly").defaultValue = false;
    expect(new Question("q1").readOnly, "It is false again").toLooseEqual(false);
    expect(new Question("q1").toJSON(), "no readOnly attribute in JSON, #2").toEqualValues({ name: "q1" });
  });
  test("Load localizable @property", () => {
    Serializer.addClass("new_declared_props", [{
      name: "str1",
      serializationProperty: "locStr1",
    }, {
      name: "strProp",
      serializationProperty: "locStrProp"
    }], () => new TestDeclaredProps(), "car");
    const obj = new TestDeclaredProps();
    obj.fromJSON({
      str1: {
        "da": "str1 da",
        "default": "str1 en"
      },
      strProp: {
        "da": "strProp da",
        "default": "strProp en"
      }
    });
    expect(obj.str1, "default string").toLooseEqual("str1 en");
    expect(obj.strProp, "default string").toLooseEqual("strProp en");
    expect(obj["locStr1"].renderedHtml, "default html string").toLooseEqual("str1 en");
    obj.locale = "da";
    expect(obj.str1, "da string").toLooseEqual("str1 da");
    expect(obj.strProp, "da string").toLooseEqual("strProp da");
    expect(obj["locStr1"].renderedHtml, "da html string").toLooseEqual("str1 da");
    Serializer.removeClass("new_declared_props");
  });
  test("Load localizable @property with undefined creator", () => {
    Serializer.addClass("new_declared_props", [{
      name: "str1",
      serializationProperty: "locStr1",
    }, {
      name: "strProp",
      serializationProperty: "locStrProp"
    }], undefined, "car");
    const obj = new TestDeclaredProps();
    obj.fromJSON({
      str1: {
        "da": "str1 da",
        "default": "str1 en"
      },
      strProp: {
        "da": "strProp da",
        "default": "strProp en"
      }
    });
    expect(obj.str1, "default string").toLooseEqual("str1 en");
    expect(obj.strProp, "default string").toLooseEqual("strProp en");
    expect(obj["locStr1"].renderedHtml, "default html string").toLooseEqual("str1 en");
    obj.locale = "da";
    expect(obj.str1, "da string").toLooseEqual("str1 da");
    expect(obj.strProp, "da string").toLooseEqual("strProp da");
    expect(obj["locStr1"].renderedHtml, "da html string").toLooseEqual("str1 da");
    Serializer.removeClass("new_declared_props");
  });
  test("Get default value for custom localizable @property from global localized strings", () => {
    Serializer.addProperty("car", {
      name: "strWithDefaultValue",
      serializationProperty: "locStrWithDefaultValue",
    });
    const obj = new Car();
    expect(obj["strWithDefaultValue"], "It is empty by default").toBeFalsy();
    englishStrings["strWithDefaultValue"] = "default value";
    expect(obj["strWithDefaultValue"], "get value from localization strings").toLooseEqual("default value");
    delete englishStrings["strWithDefaultValue"];
    Serializer.removeProperty("car", "strWithDefaultValue");
  });

  test("override defaultValue of @property", () => {
    let settings = {
      defaultNumverValue: 5
    };
    class TestDeclaredProps extends Base {
      getType() {
        return "new_declared_props";
      }
    @property({ getDefaultValue: () => { return settings.defaultNumverValue; } }) numberProp: number;
    }

    settings.defaultNumverValue = 10;
    const obj = new TestDeclaredProps();
    expect(obj.numberProp).toLooseEqual(10);
  });

  test("Creator custom ItemValue class, and a property an array of custom ItemValue + default value ", () => {
    Serializer.addClass("coloritemvalue", [
      { name: "text", visible: false },
      { name: "color", type: "color" }],
    null, "itemvalue");
    Serializer.addProperty("car", {
      name: "colors",
      default: [{ value: "A1", color: "#ff0000" }, { value: "A2", color: "#00ff00" }],
      className: "coloritemvalue", type: "coloritemvalue[]"
    });

    const car: any = new Car();
    expect(car.colors.length, "There are two colors by default").toLooseEqual(2);
    expect(car.colors[0].value, "value set correctly #1").toLooseEqual("A1");
    expect(car.colors[1].color, "color set correctly #2").toLooseEqual("#00ff00");
    expect(car.toJSON(), "toJSON. It should be empty #3").toEqualValues({});
    car.colors.splice(0, 1);
    const newItem = new ItemValue("A3", undefined, "coloritemvalue");
    newItem.color = "#ffffff";
    car.colors.push(newItem);
    expect(car.toJSON(), "toJSON #4").toEqualValues({ colors: [{ value: "A2", color: "#00ff00" }, { value: "A3", color: "#ffffff" }] });
    car.fromJSON({
      colors: [
        { value: "B1", color: "-ff0000" },
        { value: "B2", color: "-00ff00" },
        { value: "B3", color: "-ffffff" }]
    });
    expect(car.colors.length, "There are three colors loaded #5").toLooseEqual(3);
    expect(car.colors[0].value, "value set correctly #6").toLooseEqual("B1");
    expect(car.colors[2].color, "color set correctly #7").toLooseEqual("-ffffff");

    Serializer.removeProperty("car", "colors");
    Serializer.removeClass("coloritemvalue");
  });
  test("Add condition custom property", () => {
    const newProp = Serializer.addProperty("matrix", {
      name: "showHeaderIf:condition", category: "logic",
      onExecuteExpression: (obj: Base, res: any) => { (<any>obj).showHeader = res === true; }
    });
    expect(newProp.onExecuteExpression, "onExecuteExpression function is set").toBeTruthy();
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrix",
          name: "q1",
          rows: [1, 2, 3],
          columns: [1, 2, 3]
        }
      ]
    });
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("q1");
    expect(matrix.showHeader, "Header is visible").toLooseEqual(true);
    matrix.showHeaderIf = "{val1} = 1";
    expect(matrix.showHeader, "Header is invisible #1").toLooseEqual(false);
    survey.setValue("val1", 2);
    expect(matrix.showHeader, "Header is invisible #2").toLooseEqual(false);
    survey.setValue("val1", 1);
    expect(matrix.showHeader, "Header is visible #3").toLooseEqual(true);
    survey.setValue("val1", 3);
    expect(matrix.showHeader, "Header is invisible #4").toLooseEqual(false);
    Serializer.removeProperty("matrix", "showHeaderIf");
  });
  test("Add condition custom property into survey", () => {
    const newProp = Serializer.addProperty("survey", {
      name: "showTitleIf:condition", category: "logic",
      onExecuteExpression: (obj: Base, res: any) => { (<any>obj).showTitle = res === true; }
    });
    const survey = new SurveyModel({
      showTitleIf: "{q1} = 1",
      elements: [
        {
          type: "text",
          name: "q1"
        }
      ]
    });
    expect(survey.showTitle, "It is false by default").toLooseEqual(false);
    survey.setValue("q1", 1);
    expect(survey.showTitle, "It is shown").toLooseEqual(true);
    survey.setValue("q1", 2);
    expect(survey.showTitle, "It is hidden again").toLooseEqual(false);
    Serializer.removeProperty("survey", "showTitleIf");
  });
  test("base.isDescendantOf", () => {
    const big = new BigCar();
    const dealer = <Dealer>Serializer.createClass("customdealer");
    expect(big.isDescendantOf("car"), "big->car").toLooseEqual(true);
    expect(big.isDescendantOf("big"), "big->big").toLooseEqual(true);
    expect(big.isDescendantOf("dealer"), "big->dealer").toLooseEqual(false);
    expect(dealer.isDescendantOf("customdealer"), "customdealer->customdealer").toLooseEqual(true);
    expect(dealer.isDescendantOf("dealer"), "customdealer->dealer").toLooseEqual(true);
    expect(dealer.isDescendantOf("car"), "customdealer->car").toLooseEqual(false);
  });
  test("Add custom calculatedValues property into survey, isArray attribute", () => {
    const prop = Serializer.addProperty("survey", {
      name: "customFunctions:calculatedvalues",
      className: "calculatedvalue",
      isArray: true
    });
    expect(prop.isArray, "Custom property is array").toLooseEqual(true);
    const survey = new SurveyModel();
    let funcs = <Array<CalculatedValue>>survey.customFunctions;
    expect(funcs.length, "It is false by default").toLooseEqual(0);
    const func = new CalculatedValue("func1", "testFunc");
    funcs.push(func);
    expect(funcs.length, "It is false by default").toLooseEqual(1);
    const json = survey.toJSON();
    const expectedJson = { customFunctions: [{ name: "func1", expression: "testFunc" }] };
    expect(json, "Serialized successful").toEqualValues(expectedJson);
    const survey2 = new SurveyModel();
    survey2.fromJSON(json);
    funcs = <Array<CalculatedValue>>survey2.customFunctions;
    expect(funcs.length, "Deserialized one item").toLooseEqual(1);
    expect(funcs[0].name, "Deserialized item name").toLooseEqual("func1");
    expect(funcs[0].expression, "Deserialized item expression").toLooseEqual("testFunc");
    expect(funcs[0].getType(), "Deserialized item has correct type").toLooseEqual("calculatedvalue");
    Serializer.removeProperty("survey", "customFunctions");
  });
  test("Store column title in json if it equals to name, but it was set manually", () => {
    const matrix = new QuestionMatrixDynamicModel("q1");
    const column = matrix.addColumn("col1");
    expect(matrix.toJSON(), "title is empty").toEqualValues({ name: "q1", columns: [{ name: "col1" }] });
    column.title = "Col1";
    expect(matrix.toJSON(), "title is not equal to name").toEqualValues({ name: "q1", columns: [{ name: "col1", title: "Col1" }] });
    column.title = "";
    expect(matrix.toJSON(), "title is empty, #2").toEqualValues({ name: "q1", columns: [{ name: "col1" }] });
    column.title = "col1";
    expect(matrix.toJSON(), "title is equal to name").toEqualValues({ name: "q1", columns: [{ name: "col1", title: "col1" }] });
  });
  test("Store question title in json if it equals to name, but it was set manually", () => {
    const question = new Question("q1");
    expect(question.toJSON(), "title is empty").toEqualValues({ name: "q1" });
    question.title = "Q1";
    expect(question.toJSON(), "title is not equal to name").toEqualValues({ name: "q1", title: "Q1" });
    question.title = "";
    expect(question.toJSON(), "title is empty, #2").toEqualValues({ name: "q1" });
    question.title = "q1";
    expect(question.toJSON(), "title is equal to name").toEqualValues({ name: "q1", title: "q1" });
  });
  test("One property - array to not array", () => {
    var dealer = new Dealer();
    dealer.name = "4";
    new JsonObject().toObject({ name: ["small"] }, dealer);
    expect(dealer.name, "deserialize property for different types").toLooseEqual("4");
  });
  test("Find out are properties addingin in addClass are custom or not", () => {
    Serializer.addClass("testcar", ["name"]);
    expect(Serializer.findProperty("testcar", "name").isCustom, "testcar properties are custom").toLooseEqual(true);
    expect(Serializer.findProperty("car", "name").isCustom, "car properties are not custom").toLooseEqual(false);
  });
  test("Custom survey serialization, onSerializingProperty", () => {
    const mapping: any = {
      base: { elements: "Questions", visible: { name: "IsHidden", converter: (obj: Base, value: any): any => { return !value; } } },
      question: { choices: "AnswerOptions" },
      survey: { title: "Name", pages: "sections" }
    };
    const getMappedObj = function (type: string, name: string): string {
      const typeMap = mapping[type];
      return !!typeMap ? typeMap[name] : undefined;
    };
    Serializer.onSerializingProperty = (obj: Base, prop: JsonObjectProperty, value: any, json: any): boolean => {
      let typesList = new Array<string>();
      typesList.push(obj.getType());
      if (obj.isDescendantOf("question")) {
        typesList.push("question");
      }
      typesList.push("base");

      for (var i = 0; i < typesList.length; i++) {
        let mapObj = <any>getMappedObj(typesList[i], prop.name);
        if (!mapObj) continue;
        const name = typeof mapObj === "string" ? mapObj : mapObj.name;
        if (typeof mapObj !== "string" && mapObj.converter) {
          value = mapObj.converter(obj, value);
        }
        json[name] = value;
        return true;
      }
      return false;
    };
    const checkJSON = function (origionalJSON: any, expectedJSON: any, attempt: string) {
      const survey = new SurveyModel(origionalJSON);
      expect(survey.toJSON(), "Failed attempt: " + attempt).toEqualValues(expectedJSON);
    };
    checkJSON({ title: "Your Questionnaire" }, { Name: "Your Questionnaire" }, "survey title => survey Name");
    checkJSON({ pages: [{ name: "page1" }] }, { sections: [{ name: "page1" }] }, "survey pages => survey sections");
    checkJSON(
      { pages: [{ name: "page1", elements: [{ type: "text", name: "q1" }] }] },
      { sections: [{ name: "page1", Questions: [{ type: "text", name: "q1" }] }] }, "page elements => page Questions");
    checkJSON(
      { pages: [{ name: "page1", elements: [{ type: "checkbox", name: "q1", choices: [1, 2] }] }] },
      { sections: [{ name: "page1", Questions: [{ type: "checkbox", name: "q1", AnswerOptions: [1, 2] }] }] }, "choices => page AnswerOptions");
    checkJSON(
      { pages: [{ name: "page1", elements: [{ type: "text", name: "q1", visible: false }] }] },
      { sections: [{ name: "page1", Questions: [{ type: "text", name: "q1", IsHidden: true }] }] }, "visible => isHidden (opposite)");
    Serializer.onSerializingProperty = undefined;
  });
  test("return correct uniquePropertyName", () => {
    const rowsMatrixDropdownProp = Serializer.findProperty("matrixdropdown", "rows");
    expect(rowsMatrixDropdownProp.uniquePropertyName, "matrixdropdown.rows").toLooseEqual("value");
    const rowsMatrixProp = Serializer.findProperty("matrix", "rows");
    expect(rowsMatrixProp.uniquePropertyName, "matrix.rows").toLooseEqual("value");
    const columnsMatrixProp = Serializer.findProperty("matrix", "columns");
    expect(columnsMatrixProp.uniquePropertyName, "matrix.columns").toLooseEqual("value");
  });
  test("default value inheritance", () => {
    const checkboxProp = Serializer.findProperty("checkbox", "itemComponent");
    const rankingProp = Serializer.findProperty("ranking", "itemComponent");
    expect(checkboxProp.defaultValue, "survey-checkbox-item default").toLooseEqual("survey-checkbox-item");
    expect(rankingProp.defaultValue, "ranking default is empty").toLooseEqual("sv-ranking-item");
  });
  test("Do not load choices and rows without value", () => {
    const q = new QuestionCheckboxModel("q1");
    q.fromJSON({
      name: "q2",
      choices: [1, { value: 2 }, { text: "abc" }]
    });
    expect(q.choices.length).toLooseEqual(3);
    expect(q.choices[0].value, "First choice").toLooseEqual(1);
    expect(q.choices[1].value, "Second choice").toLooseEqual(2);
    expect(q.choices[2].value, "Third choice").toLooseEqual("abc");
  });
  test("QuestionMatrixModel and commentText property, Bug#5562", () => {
    const q = new QuestionMatrixModel("q1");
    const prop = Serializer.findProperty(q.getType(), "commentText");
    expect(prop, "Property is here").toBeTruthy();
    expect(prop.isVisible("row", q), "commentText is invisible by default").toLooseEqual(false);
    q.showCommentArea = true;
    expect(prop.isVisible("row", q), "commentText is visible now").toLooseEqual(true);
    const survey = new SurveyModel({
      elements: [{ type: "matrix", name: "q1", commentText: "comment_text" }]
    });
    expect(survey.getQuestionByName("q1").commentText, "Loaded correctly").toLooseEqual("comment_text");
  });
  test("QuestionMatrixModel and commentPlaceholder property, Bug#5569", () => {
    const q = new QuestionMatrixModel("q1");
    const prop = Serializer.findProperty(q.getType(), "commentPlaceholder");
    expect(prop, "Property is here").toBeTruthy();
    expect(prop.isVisible("row", q), "commentPlaceholder is invisible by default").toLooseEqual(false);
    q.showCommentArea = true;
    expect(prop.isVisible("row", q), "commentPlaceholder is visible now").toLooseEqual(true);
    const survey = new SurveyModel({
      elements: [{ type: "matrix", name: "q1", commentPlaceholder: "comment_text" }]
    });
    expect(survey.getQuestionByName("q1").commentPlaceholder, "Loaded correctly").toLooseEqual("comment_text");
  });
  test("Add defaultFunc attribute support, Bug#5615", () => {
    const obj = new DefaultValueClassObj();
    expect(obj.prop1, "The default value is 5").toLooseEqual(5);
    defaultValueForProp1 = 7;
    expect(obj.prop1, "The default value is 7 now").toLooseEqual(7);
  });
  test("QuestionHtmlModel", () => {
    let html = new QuestionHtmlModel("q1");
    expect(html.renderAs, "default is default").toLooseEqual("default");
    Serializer.addProperty("html", { name: "renderAs", default: "auto", choices: ["auto", "standard", "image"] });
    html = new QuestionHtmlModel("q1");
    expect(html.renderAs, "default is auto").toLooseEqual("auto");
    Serializer.removeProperty("html", "renderAs");
  });
  test("Ignore type for typed array elements", () => {
    const survey = new SurveyModel({
      "completedHtmlOnCondition": [{
        "type": "runexpression",
        "expression": "{question1} = 'item1'",
        "html": "custom text"
      }]
    });
    const htmls = survey.completedHtmlOnCondition;
    expect(htmls.length, "completedHtmlOnCondition is loaded").toLooseEqual(1);
    expect(htmls[0].getType(), "It has corrected type").toLooseEqual("htmlconditionitem");
  });
  test("ImageItemValue get imageLink property", () => {
    const prop = new ImageItemValue("val1").getPropertyByName("imageLink");
    expect(prop, "property is return correctly").toBeTruthy();
    expect(new ImageItemValue("val1").locImageLink.disableLocalization, "image link is localizable").toLooseEqual(false);
    prop.isLocalizable = false;
    expect(new ImageItemValue("val1").locImageLink.disableLocalization, "image link is not localizable").toLooseEqual(true);
    prop.isLocalizable = true;
  });
  test("overridingProperty test", () => {
    expect(Serializer.findProperty("question", "visible").overridingProperty, "visible property check").toLooseEqual("visibleIf");
    expect(Serializer.findProperty("question", "readOnly").overridingProperty, "readOnly property check").toLooseEqual("enableIf");
    expect(Serializer.findProperty("question", "isRequired").overridingProperty, "isRequired property check").toLooseEqual("requiredIf");
  });
  test("multipletextitem, name property should be required and unique", () => {
    const prop = Serializer.findProperty("multipletextitem", "name");
    expect(prop.isRequired, "name property is required").toLooseEqual(true);
    expect(prop.isUnique, "name property is unique").toLooseEqual(true);
  });
  test("load matrix column, visible property", () => {
    const matrix = new QuestionMatrixDynamicModel("q1");
    const column = matrix.addColumn("col1");
    expect(column.visible, "It is visible by default").toLooseEqual(true);
    column.fromJSON({ title: "column1", visible: false });
    expect(column.title, "set column title correctly").toLooseEqual("column1");
    expect(column.visible, "column.visible is false").toLooseEqual(false);
  });
  test("defaultValue for matrix rowTitleWidth and columnMinWidth properties", () => {
    Serializer.findProperty("matrix", "rowTitleWidth").defaultValue = "110px";
    Serializer.findProperty("matrix", "columnMinWidth").defaultValue = "220px";
    const matrix = new QuestionMatrixModel("q1");
    expect(matrix.rowTitleWidth, "rowTitleWidth").toLooseEqual("110px");
    expect(matrix.columnMinWidth, "columnMinWidth").toLooseEqual("220px");
    Serializer.findProperty("matrix", "rowTitleWidth").defaultValue = undefined;
    Serializer.findProperty("matrix", "columnMinWidth").defaultValue = undefined;
  });

  test("Check that .toJSON returns clean structure for all question types", () => {
    const name = "q";
    const etalon = { name };
    const classes = Serializer["classes"];

    for (const prop in classes) {
      const cls = classes[prop];
      const qModel: any = Serializer.createClass(cls.name);
      if (!!qModel) {
        qModel.name = name;
        if (qModel.isQuestion && qModel.getType() === cls.name) {
          expect(qModel.toJSON(), `JSON for ${cls.name} is clean`).toEqualValues(etalon);
        }
      }
    }
  });
  test("Add a quesition into page elements array", () => {
    const prop = Serializer.findProperty("page", "elements");
    expect(prop.isArray, "Elements is an array").toLooseEqual(true);
    const survey = new SurveyModel({
      pages: [
        {
          elements: { type: "text", name: "q1" }
        }
      ]
    });
    expect(survey.pages.length, "There is one page").toLooseEqual(1);
    expect(survey.pages[0].elements.length, "There is one element in the page").toLooseEqual(1);
    expect(survey.pages[0].elements[0].name, "Element has a correct name").toLooseEqual("q1");
    expect(survey.jsonErrors.length, "There is a JSON error").toLooseEqual(1);
    expect((<any>survey.jsonErrors[0]).propertyName, "Correct property name").toLooseEqual("elements");
  });
  test("Add a quesition into survey questions array", () => {
    const prop = Serializer.findProperty("survey", "elements");
    expect(prop.isArray, "Elements is an array").toLooseEqual(true);
    const survey = new SurveyModel({
      questions: { type: "text", name: "q1" }
    });
    expect(survey.pages.length, "There is one page").toLooseEqual(1);
    expect(survey.pages[0].elements.length, "There is one element in the page").toLooseEqual(1);
    expect(survey.pages[0].elements[0].name, "Element has a correct name").toLooseEqual("q1");
    expect(survey.jsonErrors.length, "There is a JSON error").toLooseEqual(1);
    expect((<any>survey.jsonErrors[0]).propertyName, "Correct property name").toLooseEqual("questions");
  });
  test("Add a required property into survey model & check the json error, Bug#10811", () => {
    Serializer.addProperty("survey", "!version");
    const props = Serializer.findClass("survey").getRequiredProperties();
    expect(props.length, "there is one required property").toLooseEqual(1);
    expect(props[0].name, "the required property is version").toLooseEqual("version");
    const survey = new SurveyModel({
    });
    expect(survey.jsonErrors.length, "There is a JSON error").toLooseEqual(1);
    expect((<any>survey.jsonErrors[0]).propertyName, "Correct property name").toLooseEqual("version");
    Serializer.removeProperty("survey", "version");
  });
  test("Add a page into survey pages array", () => {
    const prop = Serializer.findProperty("survey", "pages");
    expect(prop.isArray, "Elements is an array").toLooseEqual(true);
    const survey = new SurveyModel({
      pages: { questions: { type: "text", name: "q1" } }
    });
    expect(survey.pages.length, "There is one page").toLooseEqual(1);
    expect(survey.pages[0].elements.length, "There is one element in the page").toLooseEqual(1);
    expect(survey.pages[0].elements[0].name, "Element has a correct name").toLooseEqual("q1");
    expect(survey.jsonErrors.length, "There are JSONs error").toLooseEqual(2);
    expect((<any>survey.jsonErrors[0]).propertyName, "Correct property name #1").toLooseEqual("pages");
    expect((<any>survey.jsonErrors[1]).propertyName, "Correct property name #2").toLooseEqual("questions");
  });
  test("selectbase colCount property default value", () => {
    const q = new QuestionCheckboxModel("q");
    expect(q.colCount, "Default value is 1").toLooseEqual(1);
    const prop = Serializer.findProperty("checkboxbase", "colCount");
    const defaultVal = prop.defaultValue;
    prop.defaultValue = 0;
    expect(q.colCount, "Default value is 0").toLooseEqual(0);
    prop.defaultValue = 2;
    expect(q.colCount, "Default value is 2").toLooseEqual(2);
    prop.defaultValue = defaultVal;
    expect(q.colCount, "Default value is 1 again").toLooseEqual(1);
  });
  test("Validated property values", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      clearInvisibleValues: "abc",
      elements: [
        { type: "text", name: "q1", textUpdateMode: "edf" }
      ]
    }, { validatePropertyValues: true });
    expect(survey.getAllQuestions().length, "We have one question loaded").toLooseEqual(1);
    expect(survey.jsonErrors.length, "There are two errors").toLooseEqual(2);
    expect(survey.jsonErrors[0].message, "errors[0].message").toLooseEqual("The property value: 'abc' is incorrect for property 'clearInvisibleValues'.");
    expect(survey.jsonErrors[0].element.getType(), "errors[0].element").toLooseEqual("survey");
    expect(survey.jsonErrors[1].message, "errors[1].message").toLooseEqual("The property value: 'edf' is incorrect for property 'textUpdateMode'.");
    expect(survey.jsonErrors[1].element.getType(), "errors[1].element").toLooseEqual("text");
  });
  test("Validated property values & get choices by obj, Bug#10818", () => {
    Serializer.addProperty("question", { name: "prop1", choices: (obj: Base) => {
      return obj.getType() === "text" ? [1, 2, 3] : [4, 5, 6];
    } });
    const survey = new SurveyModel();
    survey.fromJSON({
      elements: [
        { type: "text", name: "q1", prop1: 2 },
        { type: "checkbox", name: "q2", prop1: 5 }
      ]
    }, { validatePropertyValues: true });
    expect(survey.jsonErrors, "There are no errors").toLooseEqual(undefined);
    Serializer.removeProperty("question", "prop1");
  });
  test("Validated property values & get choices by obj vs callback function, Bug#10845", () => {
    Serializer.addProperty("question", { name: "prop1", choices: (obj: Base, choicesCallback: (choices: any) => void) => {
      if (obj.getType() === "text") {
        choicesCallback([1, 2, 3]);
      } else {
        choicesCallback([4, 5, 6]);
      }
    } });
    const survey = new SurveyModel();
    survey.fromJSON({
      elements: [
        { type: "text", name: "q1", prop1: 2 },
        { type: "checkbox", name: "q2", prop1: 5 }
      ]
    }, { validatePropertyValues: true });
    expect(survey.jsonErrors, "There are no errors").toLooseEqual(undefined);
    Serializer.removeProperty("question", "prop1");
  });
  test("Validated property values with boolean property type, Bug#10759", () => {
    const survey = new SurveyModel();
    survey.fromJSON({
      showQuestionNumbers: true

    }, { validatePropertyValues: true });
    expect(survey.jsonErrors, "There is no errors, #1").toLooseEqual(undefined);
    survey.fromJSON({
      showQuestionNumbers: false

    }, { validatePropertyValues: true });
    expect(survey.jsonErrors, "There is no errors, #2").toLooseEqual(undefined);
    survey.fromJSON({
      showQuestionNumbers: "abc"

    }, { validatePropertyValues: true });
    expect(survey.jsonErrors.length, "There is one error, #3").toLooseEqual(1);
    survey.fromJSON({
      showQuestionNumbers: "recursive"

    }, { validatePropertyValues: true });
    expect(survey.jsonErrors, "There is no errors, #4").toLooseEqual(undefined);
  });
  test("Validated property values where choices values are objects, Bug#10773", () => {
    Serializer.addProperty("survey", { name: "prop1", choices: [
      { value: { point: 1, color: "red" } },
      { value: { point: 1, color: "blue" } },
      { value: { point: 2, color: "green" } },
    ] });
    const survey = new SurveyModel();
    survey.fromJSON({
      prop1: { }

    }, { validatePropertyValues: true });
    expect(survey.jsonErrors, "There is no errors, #1").toLooseEqual(undefined);
    Serializer.removeProperty("survey", "prop1");
  });
  test("Validated property values where choices values are objects vs {value, text}, Bug#10813", () => {
    Serializer.addProperty("survey", { name: "prop1", choices: [
      { value: 1, text: "red" },
      { value: 2, text: "blue" },
      { value: 3, text: "green" },
    ] });
    const survey = new SurveyModel();
    survey.fromJSON({
      prop1: 2

    }, { validatePropertyValues: true });
    expect(survey.jsonErrors, "There is no errors, #1").toLooseEqual(undefined);
    Serializer.removeProperty("survey", "prop1");
  });
  test("getRequiredProperties", () => {
    let requiedValues = Serializer.getRequiredProperties("text");
    expect(requiedValues, "required #1").toEqualValues(["name"]);
    Serializer.findProperty("question", "title").isRequired = true;
    requiedValues = Serializer.getRequiredProperties("text");
    expect(requiedValues, "required #2").toEqualValues(["name", "title"]);
    Serializer.findProperty("question", "title").isRequired = false;
    requiedValues = Serializer.getRequiredProperties("text");
    expect(requiedValues, "required #3").toEqualValues(["name"]);
  });
  test("Create localizable property with default value", () => {
    Serializer.addProperty("question", { name: "customProp:text", isLocalizable: true, default: "Question text" });
    Serializer.addProperty("page", { name: "customProp:text", isLocalizable: true, default: "Page text" });
    const question = new Question("q1");
    const page = new PageModel("page1");
    expect(question["customProp"], "Question prop #1").toLooseEqual("Question text");
    expect(page["customProp"], "Page prop #1").toLooseEqual("Page text");
    expect(question.getPropertyValue("customProp"), "Question getPropertyValue #1").toLooseEqual("Question text");
    expect(page.getPropertyValue("customProp"), "Page getPropertyValue #1").toLooseEqual("Page text");

    question["customProp"] = "Set question val";
    page["customProp"] = "Set page val";
    expect(question["customProp"], "Question prop #2").toLooseEqual("Set question val");
    expect(page["customProp"], "Page prop #2").toLooseEqual("Set page val");
    expect(question.getPropertyValue("customProp"), "Question getPropertyValue #2").toLooseEqual("Set question val");
    expect(page.getPropertyValue("customProp"), "Page getPropertyValue #2").toLooseEqual("Set page val");

    question.resetPropertyValue("customProp");
    page.resetPropertyValue("customProp");
    expect(question["customProp"], "Question prop #3").toLooseEqual("Question text");
    expect(page["customProp"], "Page prop #3").toLooseEqual("Page text");
    expect(question.getPropertyValue("customProp"), "Question getPropertyValue #3").toLooseEqual("Question text");
    expect(page.getPropertyValue("customProp"), "Page getPropertyValue #3").toLooseEqual("Page text");

    Serializer.removeProperty("question", "customProp");
    Serializer.removeProperty("page", "customProp");
  });
  test("Check existing pos", () => {
    Serializer.addProperty("question", { name: "testProperty", default: { someProperty: "default" } });
    const question = new QuestionTextModel("q1");
    question.fromJSON({ pos: { start: 1, end: 5 }, type: "text", name: "question1", testProperty: { someProperty: "bbb", pos: { start: 10, end: 15 } } });
    const json = question.toJSON();
    expect(json, "no pos in json").toEqualValues({ name: "question1", testProperty: { someProperty: "bbb" } });
    Serializer.removeProperty("question", "testProperty");
  });
  test("Versions in property", () => {
    const prop = Serializer.addProperty("question", { name: "testProperty", version: "1.9.127" });
    expect(prop.version, "version is set correclty").toLooseEqual("1.9.127");
    expect(prop.isAvailableInVersion("1.9.5"), "#1").toLooseEqual(false);
    expect(prop.isAvailableInVersion("1.9.200"), "#2").toLooseEqual(true);
    expect(prop.isAvailableInVersion("2"), "#3").toLooseEqual(true);
    expect(prop.isAvailableInVersion("1"), "#4").toLooseEqual(false);
    expect(prop.isAvailableInVersion("1.9.127"), "#5").toLooseEqual(true);
    expect(prop.isAvailableInVersion("1.9.126"), "#6").toLooseEqual(false);
    expect(prop.isAvailableInVersion("1.9.128"), "#7").toLooseEqual(true);
    expect(prop.isAvailableInVersion(""), "#8").toLooseEqual(true);
    Serializer.removeProperty("question", "testProperty");
  });
  test("Versions in new property serialization", () => {
    Serializer.addProperty("question", { name: "testProperty", version: "1.9.127" });
    const question = new QuestionTextModel("q1");
    question.testProperty = "abc";
    expect(question.toJSON(), "#1").toEqualValues({ name: "q1", testProperty: "abc" });
    expect(question.toJSON({ version: "1.9.127" }), "#2").toEqualValues({ name: "q1", testProperty: "abc" });
    expect(question.toJSON({ version: "1.9.126" }), "#3").toEqualValues({ name: "q1" });
    Serializer.removeProperty("question", "testProperty");
  });
  test("Versions & alternative name", () => {
    const prop = Serializer.addProperty("question", { name: "testProperty", version: "1.9.127", alternativeName: "testProp" });

    expect(prop.isAvailableInVersion("1.9.5"), "isAvailableInVersion: #1").toLooseEqual(true);
    expect(prop.isAvailableInVersion("1.9.200"), "isAvailableInVersion: #2").toLooseEqual(true);
    expect(prop.isAvailableInVersion(""), "isAvailableInVersion: #3").toLooseEqual(true);
    expect(prop.getSerializedName("1.9.5"), "getSerializedName: #1").toLooseEqual("testProp");
    expect(prop.getSerializedName("1.9.200"), "getSerializedName: #2").toLooseEqual("testProperty");
    expect(prop.getSerializedName(""), "getSerializedName: #3").toLooseEqual("testProperty");

    const question = new QuestionTextModel("q1");
    question.testProperty = "abc";
    expect(question.toJSON(), "#1").toEqualValues({ name: "q1", testProperty: "abc" });
    expect(question.toJSON({ version: "1.9.127" }), "#2").toEqualValues({ name: "q1", testProperty: "abc" });
    expect(question.toJSON({ version: "1.9.128" }), "#3").toEqualValues({ name: "q1", testProperty: "abc" });
    expect(question.toJSON({ version: "1.9.126" }), "#4").toEqualValues({ name: "q1", testProp: "abc" });
    expect(question.toJSON({ version: "1" }), "#5").toEqualValues({ name: "q1", testProp: "abc" });
    Serializer.removeProperty("question", "testProperty");
  });
  test("Test showInMultipleColumns prop visibility", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "columns": [
            {
              "name": "Column1",
              "cellType": "checkbox",
              "showInMultipleColumns": true
            }
          ]
        }
      ]
    });
    const column = survey.getQuestionByName("matrix").columns[0];
    const prop = Serializer.findProperty("matrixdropdowncolumn", "showInMultipleColumns");
    expect(prop, "property is here").toBeTruthy();
    expect(prop.isVisible("", column), "column is visible").toLooseEqual(true);
  });
  test("displayName, empty string", () => {
    const prop1 = Serializer.addProperty("question", { name: "testProperty1", displayName: "" });
    const prop2 = Serializer.addProperty("question", { name: "testProperty2", displayName: undefined });
    const prop3 = Serializer.addProperty("question", { name: "testProperty3" });

    expect(prop1.displayName, "prop1").toBe("");
    expect(prop2.displayName, "prop2").toBe(undefined);
    expect(prop3.displayName, "prop3").toBe(undefined);

    Serializer.removeProperty("question", "testProperty1");
    Serializer.removeProperty("question", "testProperty2");
    Serializer.removeProperty("question", "testProperty3");
  });
  test("enableIf", () => {
    const prop1 = Serializer.addProperty("question", { name: "testProperty1", readOnly: true });
    const prop2 = Serializer.addProperty("question", { name: "testProperty2", enableIf: (obj) => { return obj.title === "abc"; } });
    const prop3 = Serializer.addProperty("question", { name: "testProperty3" });
    const prop4 = Serializer.addProperty("question", { name: "testProperty4", readOnly: true, enableIf: (obj) => { return true; } });

    const q = new Question("q1");

    expect(prop1.enableIf, "prop1.enableIf").toBeFalsy();
    expect(prop1.isEnable(null), "prop1 #1").toLooseEqual(false);
    expect(prop1.isEnable(q), "prop1 #2").toLooseEqual(false);

    expect(prop2.enableIf, "prop2.enableIf").toBeTruthy();
    expect(prop2.isEnable(null), "prop2 #1").toLooseEqual(true);
    expect(prop2.isEnable(q), "prop2 #2").toLooseEqual(false);
    q.title = "abc";
    expect(prop2.isEnable(q), "prop2 #3").toLooseEqual(true);

    expect(prop3.enableIf, "prop3.enableIf").toBeFalsy();
    expect(prop3.isEnable(null), "prop3 #1").toLooseEqual(true);
    expect(prop3.isEnable(q), "prop3 #2").toLooseEqual(true);

    expect(prop4.enableIf, "prop4.enableIf").toBeTruthy();
    expect(prop4.isEnable(null), "prop4 #1").toLooseEqual(false);
    expect(prop4.isEnable(q), "prop4 #2").toLooseEqual(false);

    Serializer.removeProperty("question", "testProperty1");
    Serializer.removeProperty("question", "testProperty2");
    Serializer.removeProperty("question", "testProperty3");
    Serializer.removeProperty("question", "testProperty4");
  });
  test("circular dependsOn, #8624", () => {
    const prop1 = Serializer.addProperty("question", { name: "testProperty1" });
    Serializer.addProperty("question", { name: "testProperty2", dependsOn: "testProperty1" });
    prop1.dependsOn = ["testProperty2"];

    const q: any = new Question("q1");
    q.fromJSON({
      testProperty1: "abc",
      testProperty2: "edf"
    });
    expect(q.testProperty1, "testProperty1 value").toLooseEqual("abc");
    expect(q.testProperty2, "testProperty2 value").toLooseEqual("edf");

    Serializer.removeProperty("question", "testProperty1");
    Serializer.removeProperty("question", "testProperty2");
  });
  test("Do fire JS unhandled exception on loading empty objects, Bug#8702", () => {
    const survey = new SurveyModel({
      pages: [
        {},
        {
          elements: [
            {},
            {
              type: "panel",
              name: "panel1",
              elements: [
                {},
                { type: "text", name: "q1" }
              ]
            },
            {
              type: "paneldynamic",
              name: "q2",
              templateElements: [
                {},
                { type: "text", name: "q3" }
              ]
            },
            {
              type: "matrixdynamic",
              name: "q4",
              columns: [
                {},
                { cellType: "text", name: "col1" },
                { name: "col2" }
              ],
              detailElements: [
                {},
                { type: "text", name: "q5" }
              ]
            }
          ]
        }
      ],
      triggers: [
        {},
        { expression: "abc" },
      ],
      calculatedValues: [
        {},
        { name: "abc" }
      ]
    });
    const q4 = survey.getQuestionByName("q4");
    const q5 = q4.detailPanel.getQuestionByName("q5");
    expect(q5, "#1").toBeTruthy();
  });
  test("circular dependsOn, #8885", () => {
    let onSetValueObjType = "";
    let onSettingValueObjType = "";
    let onGetValueObjType = "";
    Serializer.addProperty("question", { name: "prop1:boolean",
      onSetValue: (obj, val) => {
        onSetValueObjType = obj.getType();
        obj.setPropertyValue("prop1", val);
      },
      onSettingValue: (obj, val) => {
        onSettingValueObjType = obj.getType();
        return val;
      },
      onGetValue: (obj) => {
        onGetValueObjType = obj.getType();
        return obj.getPropertyValue("prop1");
      }
    });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", prop1: true },
        { type: "matrixdynamic", name: "q2", columns: [
          { cellType: "text", name: "col1", prop1: true },
          { cellType: "text", name: "col2" },
          { name: "col3", prop1: true },
        ] }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.prop1, "text question").toLooseEqual(true);
    expect(q2.columns[0].prop1, "columns[0]").toLooseEqual(true);
    expect(q2.columns[1].prop1, "columns[1]").toLooseEqual(false);
    expect(q2.columns[2].prop1, "columns[2]").toLooseEqual(true);
    expect(onSetValueObjType, "object is not a column in onSetValue").not.toLooseEqual(q2.columns[0].getType());
    expect(onSettingValueObjType, "object is not a column in onSettingValue").not.toLooseEqual(q2.columns[0].getType());
    expect(onGetValueObjType, "object is not a column in onGetValueObjType").not.toLooseEqual(q2.columns[0].getType());
    Serializer.removeProperty("question", "prop1");
  });
  test("Add availableInMatrixColumn attribute", () => {
    const prop1 = Serializer.addProperty("question", { name: "prop1", availableInMatrixColumn: true });
    const prop2 = Serializer.addProperty("question", { name: "prop2", availableInMatrixColumn: false });
    const prop3 = Serializer.addProperty("question", { name: "prop3" });

    expect(prop1.availableInMatrixColumn, "prop1").toLooseEqual(true);
    expect(prop2.availableInMatrixColumn, "prop2").toLooseEqual(undefined);
    expect(prop3.availableInMatrixColumn, "prop3").toLooseEqual(undefined);

    Serializer.removeProperty("question", "prop1");
    Serializer.removeProperty("question", "prop2");
    Serializer.removeProperty("question", "prop3");
  });
  test("Add defaultFunc attribute based on another property & obj parameter, Bug#9108", () => {
    Serializer.addProperty("question", { name: "secondName", defaultFunc: (obj: any) => { return obj.name + "_second"; } });
    const obj: any = new QuestionTextModel("q1");
    expect(obj.secondName, "secondName #1").toLooseEqual("q1_second");
    obj.name = "q2";
    expect(obj.secondName, "secondName #2").toLooseEqual("q2_second");
    expect(obj.toJSON(), "toJSON #1").toEqualValues({ name: "q2" });

    obj.secondName = "q3_s";
    expect(obj.secondName, "secondName #3").toLooseEqual("q3_s");
    expect(obj.toJSON(), "toJSON #2").toEqualValues({ name: "q2", secondName: "q3_s" });

    obj.resetPropertyValue("secondName");
    expect(obj.secondName, "secondName #4").toLooseEqual("q2_second");
    expect(obj.toJSON(), "toJSON #3").toEqualValues({ name: "q2" });

    Serializer.removeProperty("question", "secondName");
  });
  test("Page & Panel should have different title&description properties", () => {
    const pageTitle = Serializer.findProperty("page", "title");
    const pageDescription = Serializer.findProperty("page", "description");
    const panelTitle = Serializer.findProperty("panel", "title");
    const panelDescription = Serializer.findProperty("panel", "description");
    pageTitle.placeholder = "pageT";
    pageDescription.placeholder = "pageD";
    panelTitle.placeholder = "panelT";
    panelDescription.placeholder = "panelD";
    expect(pageTitle.placeholder, "page title unique").toLooseEqual("pageT");
    expect(pageDescription.placeholder, "page description unique").toLooseEqual("pageD");
    expect(panelTitle.placeholder, "panel title unique").toLooseEqual("panelT");
    expect(panelDescription.placeholder, "panel description unique").toLooseEqual("panelD");
  });
  test("property showMode -> locationInTable, #9291", () => {
    const prop1 = Serializer.addProperty("question", { name: "prop1", showMode: "form" });
    const prop2 = Serializer.addProperty("question", { name: "prop2", locationInTable: "detail" });
    const prop3 = Serializer.addProperty("question", { name: "prop3" });
    const prop4 = Serializer.addProperty("question", { name: "prop4", showMode: "list" });
    const prop5 = Serializer.addProperty("question", { name: "prop5", locationInTable: "column" });
    const prop6 = Serializer.addProperty("question", { name: "prop6", locationInTable: "both" });

    expect(prop1.showMode, "prop1.showMode").toLooseEqual("form");
    expect(prop1.locationInTable, "prop1.locationInTable").toLooseEqual("detail");
    expect(prop2.showMode, "prop2.showMode").toLooseEqual("form");
    expect(prop2.locationInTable, "prop2.locationInTable").toLooseEqual("detail");
    expect(prop3.showMode, "prop3.showMode").toLooseEqual("");
    expect(prop3.locationInTable, "prop3.locationInTable").toLooseEqual("column");
    expect(prop4.showMode, "prop4.showMode").toLooseEqual("list");
    expect(prop4.locationInTable, "prop4.locationInTable").toLooseEqual("column");
    expect(prop5.showMode, "prop5.showMode").toLooseEqual("list");
    expect(prop5.locationInTable, "prop5.locationInTable").toLooseEqual("column");
    expect(prop6.showMode, "prop6.showMode").toLooseEqual("");
    expect(prop6.locationInTable, "prop6.locationInTable").toLooseEqual("both");

    prop1.showMode = "";
    expect(prop1.showMode, "prop1.showMode, #2").toLooseEqual("");
    expect(prop1.locationInTable, "prop1.locationInTable, #2").toLooseEqual("column");
    prop1.showMode = "list";
    expect(prop1.showMode, "prop1.showMode, #3").toLooseEqual("list");
    expect(prop1.locationInTable, "prop1.locationInTable, #3").toLooseEqual("column");
    prop1.showMode = "form";
    expect(prop1.showMode, "prop1.showMode, #4").toLooseEqual("form");
    expect(prop1.locationInTable, "prop1.locationInTable, #4").toLooseEqual("detail");

    prop1.locationInTable = "both";
    expect(prop1.showMode, "prop1.showMode, #5").toLooseEqual("");
    expect(prop1.locationInTable, "prop1.locationInTable, #5").toLooseEqual("both");
    prop1.locationInTable = "column";
    expect(prop1.showMode, "prop1.showMode, #6").toLooseEqual("list");
    expect(prop1.locationInTable, "prop1.locationInTable, #6").toLooseEqual("column");
    prop1.locationInTable = "detail";
    expect(prop1.showMode, "prop1.showMode, #7").toLooseEqual("form");
    expect(prop1.locationInTable, "prop1.locationInTable, #7").toLooseEqual("detail");

    Serializer.removeProperty("question", "prop1");
    Serializer.removeProperty("question", "prop2");
    Serializer.removeProperty("question", "prop3");
    Serializer.removeProperty("question", "prop4");
    Serializer.removeProperty("question", "prop5");
    Serializer.removeProperty("question", "prop6");
  });
  test("property.isSerializabeFunc", () => {
    let ser = true;
    Serializer.addProperty("question", { name: "prop1", isSerializableFunc: (obj) => { return ser; } });
    const q = new Question("q1");
    q.prop1 = "abc";
    expect(q.toJSON(), "#1").toEqualValues({ name: "q1", prop1: "abc" });
    ser = false;
    expect(q.toJSON(), "#2").toEqualValues({ name: "q1" });
    Serializer.removeProperty("question", "prop1");
  });
  test("property.isSerializabeFunc", () => {
    const prop = Serializer.findProperty("comment", "allowResize");
    const oldFunc = prop.defaultValueFunc;
    prop.defaultValue = false;
    let q = new QuestionCommentModel("q1");
    expect(q.allowResize, "allowResize is false by default").toBe(false);
    prop.defaultValue = true;
    q = new QuestionCommentModel("q1");
    expect(q.allowResize, "allowResize is true now").toBe(true);
    prop.defaultValueFunc = oldFunc;
    q = new QuestionCommentModel("q1");
    expect(q.allowResize, "allowResize is undefined now").toBe(undefined);
  });
  test("column isRequired vs default value in column&question, Bug#9920", () => {
    const doChecks = (num: number, dv1: boolean | undefined, dv2: boolean | undefined, dv3: boolean | undefined,
      v1: boolean, v2: boolean, v3: boolean): void => {
      const q = new QuestionMatrixDynamicModel("q1");
      const col1 = q.addColumn("col1");
      col1.isRequired = true;
      const col2 = q.addColumn("col2");
      col2.isRequired = false;
      const col3 = q.addColumn("col3");
      expect(col1.toJSON().isRequired, "col1.toJSON() is required, #" + num).toLooseEqual(dv1);
      expect(col2.toJSON().isRequired, "col2.toJSON() is required, #" + num).toLooseEqual(dv2);
      expect(col3.toJSON().isRequired, "col3.toJSON() is required, #" + num).toLooseEqual(dv3);
      expect(col1.isRequired, "col1 is required, #" + num).toLooseEqual(v1);
      expect(col2.isRequired, "col2 is required, #" + num).toLooseEqual(v2);
      expect(col3.isRequired, "col3 is required, #" + num).toLooseEqual(v3);
    };
    doChecks(1, true, undefined, undefined, true, false, false);
    Serializer.findProperty("question", "isRequired").defaultValue = true;
    doChecks(2, undefined, false, undefined, true, false, true);
    Serializer.findProperty("question", "isRequired").defaultValue = undefined;
    doChecks(3, true, undefined, undefined, true, false, false);
    Serializer.findProperty("matrixdropdowncolumn", "isRequired").defaultValue = true;
    doChecks(4, undefined, false, undefined, true, false, true);
    Serializer.findProperty("matrixdropdowncolumn", "isRequired").defaultValue = false;
    doChecks(5, true, undefined, undefined, true, false, false);
    Serializer.findProperty("matrixdropdowncolumn", "isRequired").defaultValue = undefined;
    doChecks(6, true, undefined, undefined, true, false, false);
  });
  test("choiceitem showCommentArea visibilty for different questions", () => {
    const prop = Serializer.findProperty("choiceitem", "showCommentArea");
    const q1 = new QuestionCheckboxModel("q1");
    q1.choices = [1];
    expect(prop.isVisible("", q1.choices[0]), "showCommentArea is visible choice item in checkbox question").toLooseEqual(true);
    const q2 = new QuestionTagboxModel("q2");
    q2.choices = [1];
    expect(prop.isVisible("", q2.choices[0]), "showCommentArea is invisible choice item in tagbox question").toLooseEqual(false);
  });
  test("Could not override default value for valueName & titleName properties in choicesByUrl object, Bug#10088", () => {
    const valueProp = Serializer.findProperty("choicesbyurl", "valueName");
    const titleProp = Serializer.findProperty("choicesbyurl", "titleName");
    const q = new QuestionCheckboxModel("q1");
    expect(q.choicesByUrl.valueName, "default valueName, #1").toLooseEqual("");
    expect(q.choicesByUrl.titleName, "default titleName, #1").toLooseEqual("");
    valueProp.defaultValue = "id";
    titleProp.defaultValue = "name";
    expect(q.choicesByUrl.valueName, "default valueName, #2").toLooseEqual("id");
    expect(q.choicesByUrl.titleName, "default titleName, #2").toLooseEqual("name");
    valueProp.defaultValue = undefined;
    titleProp.defaultValue = undefined;
    expect(q.choicesByUrl.valueName, "default valueName, #3").toLooseEqual("");
    expect(q.choicesByUrl.titleName, "default titleName, #3").toLooseEqual("");
  });
  test("Make expression question invisible by default, Bug#10135", () => {
    Serializer.getProperty("expression", "visible").defaultValue = false;
    const survey = new SurveyModel({ elements: [
      {
        "type": "expression",
        "name": "q1",
      },
      {
        "type": "expression",
        "name": "q2",
        "visible": true
      },
      {
        "type": "text",
        "name": "q3",
      }
    ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q1.visible, "expression q1 is invisible by default").toLooseEqual(false);
    expect(q2.visible, "expression q2 is visible").toLooseEqual(true);
    expect(q3.visible, "text q3 is visible").toLooseEqual(true);
    expect(q1.toJSON(), "expression q1 toJSON is empty").toEqualValues({ name: "q1" });
    expect(q2.toJSON(), "expression q2 toJSON is not empty").toEqualValues({ name: "q2", visible: true });
    expect(q3.toJSON(), "text q3 toJSON is empty").toEqualValues({ name: "q3" });
    Serializer.removeProperty("expression", "visible");
  });
  test("Do not create localization string on serializing", () => {
    const q = new QuestionTextModel("q1");
    expect(q.getLocalizableString("description"), "There is no description by default").toLooseEqual(undefined);
    q.toJSON();
    expect(q.getLocalizableString("description"), "There is no description after serializing").toLooseEqual(undefined);
    q.description = "desc";
    expect(q.getLocalizableString("description"), "There is a description after setting the value").toBeTruthy();
  });
});
