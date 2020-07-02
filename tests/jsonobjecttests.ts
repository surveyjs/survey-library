import {
  JsonObject,
  Serializer,
  JsonUnknownPropertyError,
} from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { Base } from "../src/base";
import { Helpers } from "../src/helpers";
import { ILocalizableOwner, LocalizableString } from "../src/localizablestring";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { Question } from "../src/question";

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
  constructor(public A: number = 0) {}
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
  startLoadingFromJson() {
    super.startLoadingFromJson();
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

Serializer.addClass(
  "dealer",
  [
    "name:string",
    { name: "dummyname", layout: "row" },
    "car",
    "cars",
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
    },
  ],
  function () {
    return new Dealer();
  }
);

Serializer.addClass(
  "carowner",
  [{ name: "carType", default: "fast" }, "name"],
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
  null,
  "dealer"
);

Serializer.addClass(
  "camelDealer",
  [{ name: "defaultValue", visible: false }],
  null,
  "dealer"
);

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

export default QUnit.module("JsonSerializationTests");

QUnit.test("Metadata for non inherited class", function (assert) {
  assert.equal(
    Serializer.getProperties("dealer").length,
    10,
    "Flat properties list"
  );
  assert.equal(
    Serializer.getProperties("dealer")[0].name,
    "name",
    "Name property"
  );
});
QUnit.test("Metadata add at the beginning parent class properties ", function (
  assert
) {
  assert.equal(
    Serializer.getProperties("truck").length,
    3,
    "2 + 1 parent propreties"
  );
  assert.equal(
    Serializer.getProperties("truck")[0].name,
    "name",
    "parent properties first"
  );
});
QUnit.test("One object - one property serialization", function (assert) {
  var dealer = new Dealer();
  dealer.name = "small";
  dealer.unserializedName = "none";
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"name":"small"}',
    "serialize just one property"
  );
});
QUnit.test("String array serialization", function (assert) {
  var dealer = new Dealer();
  dealer.stringArray = ["one", "two"];
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"stringArray":["one","two"]}',
    "serialize array"
  );
});
QUnit.test("Use onGetValue during serialization", function (assert) {
  var dealer = new Dealer();
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    "{}",
    "default value of this property is not serialized"
  );
  dealer.defaultValue = "nondefault";
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"defaultValue":"nondefault"}',
    "serialize non default property as any other"
  );
});
QUnit.test("Serialize object with it's type", function (assert) {
  var dealer = new Dealer();
  var truck = new Truck();
  truck.maxWeight = 10000;
  dealer.car = truck;
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"car":{"type":"truck","maxWeight":10000}}',
    "serialize object with it's type"
  );
});
QUnit.test(
  "Serialize create readOnly custom property using onGetValue",
  function (assert) {
    Serializer.addProperty("truck", {
      name: "calc",
      onGetValue: function (obj: any): any {
        return !!obj && !!obj.maxWeight ? obj.maxWeight * 2 : 0;
      },
      onSetValue: function (obj: any) {},
    });
    var truck = new Truck();
    truck.maxWeight = 100;
    assert.equal(truck["calc"], "200", "100 * 2");
    Serializer.removeProperty("truck", "calc");
  }
);
QUnit.test("Check isRequired property", function (assert) {
  assert.equal(
    Serializer.findProperty("sport", "maxSpeed").isRequired,
    true,
    "maxSpeed is required property"
  );
  assert.equal(
    Serializer.findProperty("truck", "maxWeight").isRequired,
    false,
    "maxWeight is not required property"
  );
});
QUnit.test("Create isRequired properties", function (assert) {
  Serializer.addProperty("sport", "!property1");
  Serializer.addProperty("sport", { name: "property2", isRequired: true });

  assert.equal(
    Serializer.findProperty("sport", "property1").isRequired,
    true,
    "! makes property required"
  );
  assert.equal(
    Serializer.findProperty("sport", "property2").isRequired,
    true,
    "attribute isRequired works"
  );

  Serializer.removeProperty("sport", "property1");
  Serializer.removeProperty("sport", "property2");
});
QUnit.test("Serialize arrays with serializable objects", function (assert) {
  var dealer = new Dealer();
  var truck = new Truck();
  truck.maxWeight = 10000;
  var sport = new SportCar();
  sport.maxSpeed = 320;
  dealer.cars = [sport, truck];
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"cars":[{"type":"sport","maxSpeed":320},{"type":"truck","maxWeight":10000}]}',
    "serialize objects with their type"
  );
});
QUnit.test("Serialize 0 for number ", function (assert) {
  assert.equal(Helpers.isValueEmpty(0), false, "The value is not default");
  var sport = new SportCar();
  sport.maxSpeed = 0;
  var jsObj = new JsonObject().toJsonObject(sport);
  assert.deepEqual(jsObj, { maxSpeed: 0 }, "0 should be serialized as well");
});
QUnit.test("Serialize object and get type by it's property", function (assert) {
  var dealer = new Dealer();
  var truck = new Truck();
  dealer.truck = new Truck();
  dealer.truck.maxWeight = 10000;
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"truck":{"maxWeight":10000}}',
    "serialize object without it's type"
  );
});
QUnit.test(
  "Serialize arrays with serializable objects and get type by it's property",
  function (assert) {
    var dealer = new Dealer();
    dealer.trucks.push(new Truck());
    dealer.trucks.push(new Truck());
    dealer.trucks[0].maxWeight = 10000;
    dealer.trucks[1].maxWeight = 15000;
    var jsObj = new JsonObject().toJsonObject(dealer);
    assert.equal(
      JSON.stringify(jsObj),
      '{"trucks":[{"maxWeight":10000},{"maxWeight":15000}]}',
      "serialize objects without their type"
    );
  }
);

QUnit.test("One object - one property deserialization", function (assert) {
  var dealer = new Dealer();
  new JsonObject().toObject({ name: "small" }, dealer);
  assert.equal(dealer.name, "small", "deserialize just one property");
});
QUnit.test("String array deserialization", function (assert) {
  var dealer = new Dealer();
  new JsonObject().toObject({ stringArray: ["one", "two"] }, dealer);
  assert.deepEqual(dealer.stringArray, ["one", "two"], "deserialize array");
});
QUnit.test("Deserialize object with it's type", function (assert) {
  var dealer = new Dealer();
  new JsonObject().toObject(
    { car: { type: "truck", maxWeight: 10000 } },
    dealer
  );
  var truck: any = dealer.car;
  assert.equal(truck.maxWeight, 10000, "deserialize object with it's type");
  assert.equal(truck.getType(), "truck", "the live object");
  assert.notEqual(truck.type, "truck", "type is removed");
});
QUnit.test("Deserialize arrays with serializable objects", function (assert) {
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
  assert.equal(
    dealer.cars.length,
    2,
    "two objects in array should be deserialized"
  );
  var sport: any = dealer.cars[0];
  var truck: any = dealer.cars[1];
  assert.equal(sport.maxSpeed, 320, "deserialize the first object");
  assert.equal(sport.getType(), "sport", "deserialize the first object");
  assert.equal(truck.maxWeight, 10000, "deserialize the second object");
  assert.equal(truck.getType(), "truck", "deserialize the second object");
});
QUnit.test(
  "Deserialize object and get type by it's property className",
  function (assert) {
    var dealer = new Dealer();
    new JsonObject().toObject({ truck: { maxWeight: 10000 } }, dealer);
    assert.equal(
      dealer.truck.maxWeight,
      10000,
      "deserialize object with it's type"
    );
    assert.equal(dealer.truck.getType(), "truck", "the live object");
  }
);
QUnit.test(
  "Deserialize arrays with serializable objects and get type by it's property className",
  function (assert) {
    var dealer = new Dealer();
    new JsonObject().toObject(
      { trucks: [{ maxWeight: 10000 }, { maxWeight: 15000 }] },
      dealer
    );
    assert.equal(
      dealer.trucks.length,
      2,
      "two objects in array should be deserialized"
    );
    assert.equal(
      dealer.trucks[0].maxWeight,
      10000,
      "deserialize the first object"
    );
    assert.equal(
      dealer.trucks[0].getType(),
      "truck",
      "deserialize the first object"
    );
    assert.equal(
      dealer.trucks[1].maxWeight,
      15000,
      "deserialize the second object"
    );
    assert.equal(
      dealer.trucks[1].getType(),
      "truck",
      "deserialize the second object"
    );
  }
);
QUnit.test("Use on setValue during deserialization", function (assert) {
  var dealer = new Dealer();
  new JsonObject().toObject({ changeNameOnSet: "nameIsChanged" }, dealer);
  assert.equal(dealer.name, "nameIsChanged", "the property name is set");
});
QUnit.test("ItemValueListOwner serialization", function (assert) {
  var list = new ItemValueListOwner();
  list.items.push(new ItemValue(7, "Item 1"));
  list.items.push(new ItemValue(5));
  list.items.push(new ItemValue("item"));

  var jsObj = new JsonObject().toJsonObject(list);
  assert.equal(
    JSON.stringify(jsObj),
    '{"items":[{"value":7,"text":"Item 1"},5,"item"]}',
    "serialize ItemValueListOwner"
  );
});
QUnit.test("ItemValueListOwner deserialization", function (assert) {
  var list = new ItemValueListOwner();
  new JsonObject().toObject(
    { items: [{ value: 7, text: "Item 1" }, 5, "item", "value1|text1"] },
    list
  );
  assert.equal(list.items.length, 4, "there are 4 items");
  assert.equal(
    list.items[1].value,
    5,
    "set correct value property for the second item"
  );
  assert.equal(
    list.items[1].calculatedText,
    "5",
    "set correct text property for the second item"
  );
  assert.equal(
    list.items[3].value,
    "value1",
    "set correct value property for the fourth item"
  );
  assert.equal(
    list.items[3].calculatedText,
    "text1",
    "set correct text property for the fourth item"
  );
});
QUnit.test(
  "ItemValueListOwner deserialization with empty object, #1667",
  function (assert) {
    var list = new ItemValueListOwner();
    new JsonObject().toObject({ items: [{}, 1] }, list);
    assert.equal(list.items.length, 2, "there are two items");
    assert.equal(
      list.items[0].getType(),
      "itemvalue",
      "the type created correct"
    );
    assert.equal(list.items[0].value, null, "The value is null");
  }
);
QUnit.test(
  "ItemValueListOwner deserialization, custom property in ItemValue",
  function (assert) {
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
    assert.equal(list.items.length, 4, "there are 4 items");
    assert.equal(list.items[0]["price"], 55.5, "set custom value correctly");
    Serializer.removeProperty("itemvalue", "price");
  }
);
QUnit.test(
  "ItemValueListOwner deserialization, value as object, remove pos",
  function (assert) {
    var list = new ItemValueListOwner();
    list.items.push(
      new ItemValue({ pos: { start: 1, end: 3 }, id: 1, city: "NY" }, "Item 1")
    );

    var jsObj = new JsonObject().toJsonObject(list);
    assert.deepEqual(
      jsObj,
      { items: [{ value: { id: 1, city: "NY" }, text: "Item 1" }] },
      "serialize ItemValueListOwner"
    );
  }
);
QUnit.test(
  "defaultValue and defaultRowValue deserialization, remove pos",
  function (assert) {
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
    assert.deepEqual(
      jsObj,
      {
        name: "q1",
        defaultValue: [
          { column1: 1, column2: 2 },
          { column1: 3, column2: 4 },
        ],
        defaultRowValue: { column1: 1, column2: 2 },
      },
      "serialize ItemValueListOwner"
    );
  }
);
QUnit.test("LongNamesOwner serialization", function (assert) {
  var owner = new LongNamesOwner();
  var l1 = new LongNameItemA();
  l1.A = 5;
  var l2 = new LongNameItemB();
  l2.B = 15;
  owner.items.push(l1);
  owner.items.push(l2);
  var jsObj = new JsonObject().toJsonObject(owner);
  assert.equal(
    JSON.stringify(jsObj),
    '{"items":[{"type":"itemA","A":5},{"type":"itemB","B":15}]}',
    "serialize LongNamesOwner"
  );
});
QUnit.test("ItemValueListOwner deserialization", function (assert) {
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
  assert.equal(owner.items.length, 2, "there are 2 items");
  assert.equal(
    owner.items[0].getType(),
    "itemA_thelongpart",
    "the first object is live"
  );
  assert.equal(
    owner.items[1].getType(),
    "itemB_thelongpart",
    "the second object is live"
  );
});
QUnit.test("Do not change Json", function (assert) {
  var json = {
    items: [
      { type: "itemA", A: 5 },
      { type: "itemB_thelongpart", B: 15 },
    ],
  };
  var jsonText = JSON.stringify(json);
  var owner = new LongNamesOwner();
  new JsonObject().toObject(json, owner);
  assert.equal(
    JSON.stringify(json),
    jsonText,
    "Json object should be the same after deserialization"
  );
});

QUnit.test("Unknown property error on deserialization", function (assert) {
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
  assert.equal(jsonObj.errors.length, 2, "it should be two errors");
  assert.equal(
    (<JsonUnknownPropertyError>jsonObj.errors[0]).propertyName,
    "unknown1",
    "the property Name in the first error"
  );
  assert.equal(
    (<JsonUnknownPropertyError>jsonObj.errors[0]).className,
    "LongNamesOwner",
    "the class Name in the first error"
  );
  assert.equal(
    (<JsonUnknownPropertyError>jsonObj.errors[1]).propertyName,
    "unknown2",
    "the property Name in the second error"
  );
  assert.equal(
    (<JsonUnknownPropertyError>jsonObj.errors[1]).className,
    "itemB_thelongpart",
    "the class Name in the second error"
  );
});
QUnit.test("Having 'pos' property for objects with errors", function (assert) {
  var owner = new LongNamesOwner();
  var jsonObj = new JsonObject();
  jsonObj.toObject(
    {
      pos: { start: 20 },
      unknown1: 4,
      items: [
        { pos: { start: 30, end: 50 }, type: "itemA", A: 5 },
        {
          pos: { start: 30, end: 50 },
          unknown2: 5,
          type: "itemB_thelongpart",
          B: 15,
        },
      ],
    },
    owner
  );
  assert.equal(jsonObj.errors.length, 2, "it should be two errors");
  assert.equal((<JsonUnknownPropertyError>jsonObj.errors[0]).at, 20);
  assert.equal((<JsonUnknownPropertyError>jsonObj.errors[1]).at, 30);
});
QUnit.test("Do not remove 'pos' property from objects", function (assert) {
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
  assert.equal(truck["pos"].start, 20, "deserialize the second object");
});
QUnit.test("Deserialize arrays with missing type property", function (assert) {
  var dealer = new Dealer();
  var jsonObj = new JsonObject();
  jsonObj.toObject(
    { cars: [{ maxSpeed: 320 }, { type: "truck", maxWeight: 10000 }] },
    dealer
  );
  assert.equal(dealer.cars.length, 1, "can only one object deserialized");
  var truck = <Truck>dealer.cars[0];
  assert.equal(truck.maxWeight, 10000, "deserialize the second object");
  assert.equal(truck.getType(), "truck", "deserialize the second object");
  assert.equal(jsonObj.errors.length, 1, "there should be one error");
  assert.equal(
    jsonObj.errors[0].type,
    "missingtypeproperty",
    "The missing type property error"
  );
});
QUnit.test("Deserialize arrays with incorrect type property", function (
  assert
) {
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
  assert.equal(dealer.cars.length, 1, "can only one object deserialized");
  var truck = <Truck>dealer.cars[0];
  assert.equal(truck.maxWeight, 10000, "deserialize the second object");
  assert.equal(truck.getType(), "truck", "deserialize the second object");
  assert.equal(jsonObj.errors.length, 1, "there should be one error");
  assert.equal(
    jsonObj.errors[0].type,
    "incorrecttypeproperty",
    "The incorrect type property error"
  );
});
QUnit.test("Deserialization - required property error", function (assert) {
  var dealer = new Dealer();
  var jsonObj = new JsonObject();
  jsonObj.toObject({ cars: [{ type: "sport" }] }, dealer);
  assert.equal(dealer.cars.length, 1, "One object is deserialized");
  assert.equal(
    jsonObj.errors.length,
    1,
    "there should be one error about required property"
  );
  assert.equal(
    jsonObj.errors[0].type,
    "requiredproperty",
    "The required property error"
  );

  Serializer.addProperty("dealer", "!foo");
  jsonObj = new JsonObject();
  jsonObj.toObject({}, dealer);
  assert.equal(
    jsonObj.errors.length,
    1,
    "dealer: there should be one error about required property"
  );
  assert.equal(
    jsonObj.errors[0].type,
    "requiredproperty",
    "dealer: The required property error"
  );
  assert.equal(
    jsonObj.errors[0].message.indexOf("foo") > -1,
    true,
    "dealer: show that 'foo' is missing:" + jsonObj.errors[0].message
  );
  Serializer.removeProperty("dealer", "foo");
});
QUnit.test("Deserialization - required property error", function (assert) {
  var children = Serializer.getChildrenClasses("car");
  assert.equal(children.length, 5, "There are 5 children classes");
  children = Serializer.getChildrenClasses("car", true);
  assert.equal(
    children.length,
    3,
    "There are 3 children classes that can be created."
  );
});
QUnit.test("Property Type test", function (assert) {
  var properties = Serializer.getProperties("truck");
  assert.equal(properties[0].name, "name", "It is a 'name' property");
  assert.equal(properties[0].type, "string", "Name property is string");
  assert.equal(properties[1].name, "maxWeight", "It is a 'maxWeight' property");
  assert.equal(properties[1].type, "number", "maxWeight property is number");
});
QUnit.test("Property Choices test", function (assert) {
  var properties = Serializer.getProperties("truck");
  assert.equal(properties[0].name, "name", "It is a 'name' property");
  assert.equal(properties[0].type, "string", "Name property is string");
  assert.equal(properties[1].name, "maxWeight", "It is a 'maxWeight' property");
  assert.equal(properties[1].type, "number", "maxWeight property is number");
});
QUnit.test("Property Choices test", function (assert) {
  var properties = Serializer.getProperties("sport");
  assert.equal(properties[1].name, "maxSpeed", "It is a 'maxSpeed' property");
  assert.deepEqual(
    properties[1].choices,
    [100, 150, 200, 250],
    "'maxSpeed' property choices"
  );
});
QUnit.test("Property Choices func test", function (assert) {
  var properties = Serializer.getProperties("truck");
  assert.equal(properties[1].name, "maxWeight", "It is a 'maxWeight' property");
  assert.deepEqual(
    properties[1].choices,
    [500, 1500],
    "'maxWeight' property choices"
  );
});
QUnit.test("Property set choices test", function (assert) {
  var property = Serializer.addProperty("sport", "choices2");
  property.setChoices([1, 2, 3]);
  assert.deepEqual(
    property.choices,
    [1, 2, 3],
    "set choices array works correctly"
  );
  property.setChoices(
    null,
    (obj: any): Array<any> => {
      return [4, 5, 6];
    }
  );
  assert.deepEqual(
    property.choices,
    [4, 5, 6],
    "set choices function works correctly"
  );
  Serializer.removeProperty("sport", "choices2");
});
QUnit.test("Create inherited class instead of origional", function (assert) {
  var container = new CreatingObjectContainer();
  var jsonObj = new JsonObject();
  jsonObj.toObject(
    { items: [{ type: "shouldnotcreate", A: 320 }], obj: { A: 200 } },
    container
  );
  assert.equal(container.items.length, 1, "one object is added");
  assert.equal(
    container.items[0].getType(),
    "shouldcreate",
    "created the right class in array"
  );
  assert.equal(
    container.obj.getType(),
    "shouldcreate",
    "created the right class in property"
  );
});

QUnit.test("Optionally do not save all properties", function (assert) {
  var container = new CreatingObjectContainer();
  container.items.push(new NonCreatingObject(10));
  container.items.push(new NonCreatingObject(20));
  container.obj = new NonCreatingObject(30);
  var jsonObj = new JsonObject();
  jsonObj.lightSerializing = true;
  var json = jsonObj.toJsonObject(container, false);
  assert.deepEqual(json, { obj: { A: 30 } }, "Do not serialize items");
});

QUnit.test("toJsonObject should create new instance of objects", function (
  assert
) {
  var dealer = new Dealer();
  var truck = new Truck();
  truck.maxWeight = 10000;
  var sport = new SportCar();
  sport.maxSpeed = 320;
  dealer.cars = [sport, truck];
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.notEqual(jsObj.cars, dealer.cars);
  assert.notEqual(jsObj.cars[0], dealer.cars[0]);
  dealer.cars.push(sport);
  assert.equal(dealer.cars.length, 3);
  assert.equal(jsObj.cars.length, 2);
});

QUnit.test("Add new property to object", function (assert) {
  var propertiesCount = Serializer.getProperties("truck").length;
  Serializer.addProperty("car", "isUsed:boolean");
  var dealer = new Dealer();
  new JsonObject().toObject(
    { truck: { isUsed: true, maxWeight: 10000 } },
    dealer
  );
  assert.equal(dealer.truck["isUsed"], true, "new property is here");
  assert.equal(
    propertiesCount + 1,
    Serializer.getProperties("truck").length,
    "there is on one property more"
  );
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"truck":{"isUsed":true,"maxWeight":10000}}',
    "property is serialized"
  );
  Serializer.removeProperty("car", "isUsed");
  assert.equal(
    propertiesCount,
    Serializer.getProperties("truck").length,
    "the additional property is removed"
  );
});

QUnit.test("Add property into alternative name of class", function (assert) {
  Serializer.addAlterNativeClassName("truck", "trick");
  assert.equal(
    Serializer.findClass("trick").name,
    "truck",
    "Find class by alternative name"
  );
  var propertiesCount = Serializer.getProperties("truck").length;
  Serializer.addProperty("trick", "isUsed:boolean");
  assert.equal(
    propertiesCount + 1,
    Serializer.getProperties("truck").length,
    "there is on one property more"
  );
  assert.equal(
    propertiesCount + 1,
    Serializer.getProperties("trick").length,
    "alternative name returns correct properties as well"
  );
  var dealer = new Dealer();
  new JsonObject().toObject(
    { truck: { isUsed: true, maxWeight: 10000 } },
    dealer
  );
  assert.equal(dealer.truck["isUsed"], true, "new property is here");
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.deepEqual(
    jsObj,
    { truck: { isUsed: true, maxWeight: 10000 } },
    "property is serialized"
  );
  Serializer.removeProperty("trick", "isUsed");
  assert.equal(
    propertiesCount,
    Serializer.getProperties("truck").length,
    "the additional property is removed"
  );
});

QUnit.test("Add a new number property with default value", function (assert) {
  Serializer.addProperty("car", { name: "tag:number", default: 1 });
  var dealer = new Dealer();
  new JsonObject().toObject({ truck: { tag: 10, maxWeight: 10000 } }, dealer);
  assert.equal(dealer.truck["tag"], 10, "new property is here");
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"truck":{"tag":10,"maxWeight":10000}}',
    "property is serialized"
  );
  dealer.truck["tag"] = 1;
  jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"truck":{"maxWeight":10000}}',
    "property is serialized"
  );

  new JsonObject().toObject({ truck: { maxWeight: 10000 } }, dealer);
  jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"truck":{"maxWeight":10000}}',
    "property is serialized"
  );

  Serializer.removeProperty("car", "tag");
});

QUnit.test("Add a boolean property default value", function (assert) {
  Serializer.addProperty("car", {
    name: "isNew:boolean",
    default: true,
  });
  Serializer.addProperty("itemvalue", {
    name: "isNew:boolean",
    default: true,
  });
  var car = new Truck();
  assert.equal(
    car["isNew"],
    true,
    "New boolean property is added with correct default value"
  );

  var item = new ItemValue(1);
  assert.equal(
    item["isNew"],
    true,
    "New boolean property is added with correct default value into itemvalue"
  );

  Serializer.removeProperty("itemvalue", "isNew");
  Serializer.removeProperty("car", "isNew");
});

QUnit.test("A non serializable property", function (assert) {
  var dealer = new Dealer();
  new JsonObject().toObject({ truck: { maxWeight: 10000 } }, dealer);
  dealer.definedNonSerializable = "some value";
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.deepEqual(
    jsObj,
    { truck: { maxWeight: 10000 } },
    "definedNonSerializable property is not serialized"
  );
});

QUnit.test("Get property and readonly", function (assert) {
  var property = Serializer.findProperty("truck", "name");
  assert.equal(property.readOnly, false, "readOnly is false by default");
  property.readOnly = true;
  var property2 = Serializer.findProperty("truck", "name");
  assert.equal(property2.readOnly, true, "readOnly is true now");
});

QUnit.test("Set readOnly by default", function (assert) {
  var property = Serializer.findProperty("truck", "readOnlyName");
  assert.equal(property.readOnly, true, "readOnly is true by default");
});

QUnit.test(
  "Add alternative/misspelled property support, https://github.com/surveyjs/surveyjs/issues/280",
  function (assert) {
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
    assert.equal(truck.maxWeight, 10000, "deserialize the second object");
  }
);

QUnit.test("Check if visible is set", function (assert) {
  assert.equal(
    Serializer.findProperty("dealer", "name").visible,
    true,
    "By default the property is visible"
  );
  assert.equal(
    Serializer.findProperty("dealer", "cars").visible,
    false,
    "Cars is invisible"
  );
});

QUnit.test("Test getPropertyValue and isLocalizable", function (assert) {
  var obj = new CheckGetPropertyValue();
  obj.directProp = "dirValue";
  obj.getValueProp = "getValue_no";
  obj.getValuePropGetter = "getValue_yes";
  obj.serProperty = "serProperty_no";
  obj.getSerProperty.text = "serProperty_yes";
  obj.locProperty = "loc_no";
  obj.locPropertyGetter.text = "loc_yes";

  var property = Serializer.findProperty(obj.getType(), "directProp");
  assert.equal(
    property.getPropertyValue(obj),
    "dirValue",
    "dirProperty works correctly"
  );

  property = Serializer.findProperty(obj.getType(), "getValueProp");
  assert.equal(
    property.getPropertyValue(obj),
    "getValue_yes",
    "getValueProp works correctly"
  );

  property = Serializer.findProperty(obj.getType(), "serProperty");
  assert.deepEqual(
    property.getPropertyValue(obj),
    { text: "serProperty_yes" },
    "getValueProp works correctly"
  );

  property = Serializer.findProperty(obj.getType(), "locProperty");
  assert.equal(
    property.getPropertyValue(obj),
    "loc_yes",
    "getValueProp works correctly"
  );
});
QUnit.test("Deserialize number and boolean correctly, bug #439", function (
  assert
) {
  Serializer.addProperty("car", "isUsed:boolean");
  var truck = new Truck();
  new JsonObject().toObject(
    { type: "truck", maxWeight: "10", isUsed: "false" },
    truck
  );
  assert.equal(truck.maxWeight, 10, "deserialize property as number");
  truck.maxWeight += 1;
  assert.equal(truck.maxWeight, 11, "it should becomes 11 now");
  assert.equal(truck["isUsed"], false, "deserialize property as boolean");
  truck["isUsed"] = !truck["isUsed"];
  assert.equal(truck["isUsed"], true, "it should become true");
  Serializer.removeProperty("car", "isUsed");
});

QUnit.test("Loading test deserialization", function (assert) {
  var obj = new LoadingFromJsonObj();
  new JsonObject().toObject(
    { name: "obj", items: [{ name: "item1" }, { name: "item2" }] },
    obj
  );
  assert.equal(obj.name, "obj");
  assert.equal(obj.items.length, 2);
  assert.equal(obj.items[1].name, "item2");
  assert.equal(
    obj.startLoadingFromJsonCounter,
    1,
    "obj: startLoadingFromJson was called one time"
  );
  assert.equal(
    obj.endLoadingFromJsonCounter,
    1,
    "obj: endLoadingFromJson was called one time"
  );
  assert.equal(
    obj.items[1].startLoadingFromJsonCounter,
    1,
    "item1: startLoadingFromJson was called one time"
  );
  assert.equal(
    obj.items[1].endLoadingFromJsonCounter,
    1,
    "item1: endLoadingFromJson was called one time"
  );
});

QUnit.test("Override type property in a successor class", function (assert) {
  var property = Serializer.findProperty("fast", "name");
  assert.equal(property.type, "string", "The default type");
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
  assert.equal(property.type, "string", "The default type");
  Serializer.addProperty("fast", "name:text");
  property = Serializer.findProperty("fast", "name");
  assert.equal(property.type, "text", "The type is text for fast car");
  property = Serializer.findProperty("car", "name");
  assert.equal(property.type, "string", "The type is string for car");
  findProperty();
  assert.equal(
    property.type,
    "text",
    "The type is text for fast car, getProperties"
  );
});

QUnit.test("Set default value to the custom property", function (assert) {
  Serializer.addProperty("car", {
    name: "isUsed:boolean",
    default: true,
  });
  Serializer.addProperty("car", { name: "tag:number", default: 0 });
  var truck = new Truck();
  assert.equal(truck["isUsed"], true, "the default boolean value is set");
  assert.equal(truck["tag"], 0, "the default numeric value is set");
  Serializer.removeProperty("car", "isUsed");
  Serializer.removeProperty("car", "tag");
});
QUnit.test("Create localizable property", function (assert) {
  Serializer.addProperty("car", {
    name: "myLocalizableProp:text",
    isLocalizable: true,
  });
  var property = Serializer.findProperty("car", "myLocalizableProp");
  assert.equal(
    property.serializationProperty,
    "locmyLocalizableProp",
    "set correct serializationProperty"
  );
  var truck = new Truck();
  assert.notOk(truck["myLocalizableProp"], "It is empty");
  assert.notOk(property.getPropertyValue(truck), "It is empty, via property");

  truck["myLocalizableProp"] = "default_Text";
  assert.equal(
    property.getPropertyValue(truck),
    "default_Text",
    "get value via property"
  );
  assert.equal(
    truck["myLocalizableProp"],
    "default_Text",
    "The default text is here"
  );
  truck.locale = "de";
  truck["myLocalizableProp"] = "de_Text";
  assert.equal(truck["myLocalizableProp"], "de_Text", "The 'de' text is here");
  truck.locale = "en";
  assert.equal(
    truck["myLocalizableProp"],
    "default_Text",
    "Use default value again"
  );
  assert.deepEqual(
    new JsonObject().toJsonObject(truck),
    { myLocalizableProp: { default: "default_Text", de: "de_Text" } },
    "Serialized correctly"
  );

  Serializer.removeProperty("car", "myLocalizableProp");
});

QUnit.test(
  "Create localizable property in Item value, use getPropertyValue/setPropertyValue",
  function (assert) {
    Serializer.addProperty("itemvalue", {
      name: "myLocalizableProp:text",
      isLocalizable: true,
    });
    var property = Serializer.findProperty("itemvalue", "myLocalizableProp");
    var itemValue = new ItemValue(1);
    var car = new Car();
    itemValue.locOwner = car;
    assert.notOk(itemValue["myLocalizableProp"], "It is empty");
    assert.notOk(
      property.getPropertyValue(itemValue),
      "It is empty, via property"
    );

    //property.setValue(itemValue, "default_Text", null);
    itemValue["myLocalizableProp"] = "default_Text";
    assert.equal(
      property.getPropertyValue(itemValue),
      "default_Text",
      "get value via property"
    );
    assert.equal(
      itemValue["myLocalizableProp"],
      "default_Text",
      "The default text is here"
    );
    car.locale = "de";
    //property.setValue(itemValue, "de_Text", null);
    itemValue["myLocalizableProp"] = "de_Text";
    assert.equal(
      property.getPropertyValue(itemValue),
      "de_Text",
      "The 'de' text is here, via property"
    );
    assert.equal(
      itemValue["myLocalizableProp"],
      "de_Text",
      "The 'de' text is here"
    );
    car.locale = "en";
    assert.equal(
      itemValue["myLocalizableProp"],
      "default_Text",
      "Use default value again"
    );
    assert.equal(
      property.getPropertyValue(itemValue),
      "default_Text",
      "Use default value again via property"
    );

    Serializer.removeProperty("itemvalue", "myLocalizableProp");
  }
);

QUnit.test(
  "Create  object with virtual type by using parent constructor",
  function (assert) {
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
    assert.equal(dealer.cars.length, 1, "can only one object deserialized");
    var truck = <Truck>dealer.cars[0];
    assert.equal(truck.maxWeight, 10000, "maxWeight is deserialized");
    assert.equal(
      truck["description"],
      "some text",
      "added property is deserialized"
    );
    assert.equal(
      truck["isCustom"],
      true,
      "added property created if it is default"
    );
    assert.equal(truck.getType(), "customtruck", "type is customtruck");
    assert.equal(truck.getTemplate(), "truck", "template is truck");
  }
);

QUnit.test(
  "Custom class - do not serialize invisible properties with default value",
  function (assert) {
    var dealer = <Dealer>Serializer.createClass("customdealer");
    assert.ok(dealer, "The object is created");
    assert.equal(dealer.getType(), "customdealer", "type is customdealer");
    assert.equal(dealer.getTemplate(), "dealer", "template is dealer");
    dealer.name = "mydealer";
    var jsonObj = new JsonObject();
    var json = jsonObj.toJsonObject(dealer);
    assert.deepEqual(
      json,
      { name: "mydealer" },
      "property with default value is not serialized"
    );
  }
);

QUnit.test("Create class with camel name", function (assert) {
  var dealer = <Dealer>Serializer.createClass("Cameldealer");
  assert.ok(dealer, "The object is created");
});

QUnit.test("Generate properties on the fly", function (assert) {
  var carOwner = <CarOwner>Serializer.createClass("carowner");
  assert.ok(carOwner, "The object is created");
  assert.equal(carOwner.getType(), "carowner", "type is carowner");
  assert.equal(carOwner.carType, "fast", "the default value is fast");
  assert.equal(carOwner.car.getType(), "fast", "the car is fast car");
  carOwner.carType = "truck";
  assert.equal(carOwner.carType, "truck", "the default value is truck");
  assert.equal(carOwner.car.getType(), "truck", "the car is fast truck");
  carOwner["maxWeight"] = 100;
  assert.equal(
    carOwner.car["maxWeight"],
    100,
    "The property has been added correctly"
  );
  carOwner.carType = "fast";
  assert.notEqual(
    carOwner.car["maxWeight"],
    100,
    "The property doesn't equal 100"
  );
  assert.equal(carOwner["maxWeight"], undefined, "The property doesn't exist");
});

QUnit.test("Serialize/deserialize dynamic properties", function (assert) {
  var carOwner = new CarOwner();
  carOwner.carType = "truck";
  carOwner["maxWeight"] = 100;
  var json = new JsonObject().toJsonObject(carOwner);
  assert.deepEqual(
    json,
    { carType: "truck", maxWeight: 100 },
    "The additional property has serialized"
  );
  carOwner.carType = "fast";
  assert.deepEqual(
    new JsonObject().toJsonObject(carOwner),
    {},
    "There is no additional properties"
  );
  carOwner = new CarOwner();
  new JsonObject().toObject({ carType: "truck", maxWeight: 200 }, carOwner);
  assert.equal(carOwner.carType, "truck", "the car type was created correctly");
  assert.equal(
    carOwner["maxWeight"],
    200,
    "The dynamic property loaded correctly"
  );
  assert.equal(
    carOwner.car["maxWeight"],
    200,
    "The dynamic property set correctly"
  );
});

QUnit.test("Add property into questionbase", function (assert) {
  Serializer.addProperty("questionbase", "custom");
  var question = new Question("q1");
  new JsonObject().toObject({ name: "q2", custom: "customValue1" }, question);
  assert.equal(question.name, "q2", "name serialzied successful");
  assert.equal(
    question["custom"],
    "customValue1",
    "custom serialzied successful"
  );
  Serializer.removeProperty("questionbase", "custom");
});

QUnit.test("Add itemvalues (array) property into questionbase", function (
  assert
) {
  Serializer.addProperty("questionbase", "customArray:itemvalues");
  var question = new Question("q1");

  var property = Serializer.findProperty("questionbase", "customArray");
  assert.equal(
    property.type,
    "itemvalue[]",
    "Property should have correct type"
  );
  assert.equal(
    property.className,
    "itemvalue",
    "Property should have correct className"
  );

  assert.equal(
    question["customArray"].length,
    0,
    "customArray deserialzied successful"
  );
  new JsonObject().toObject(
    { name: "q2", custom: "customValue1", customArray: [1, 2, 3, 4] },
    question
  );
  assert.equal(
    question["customArray"].length,
    4,
    "customArray deserialzied successful"
  );
  assert.equal(
    question["customArray"][0].value,
    1,
    "customArray content deserialzied successful"
  );

  var json = new JsonObject().toJsonObject(question);
  assert.deepEqual(
    json.customArray,
    [1, 2, 3, 4],
    "customArray serialzied successful"
  );

  Serializer.removeProperty("questionbase", "customArray");

  Serializer.addProperty("questionbase", {
    name: "customArray:itemvalues",
    default: [1, 3, 5],
  });
  question = new Question("q2");
  assert.equal(
    question["customArray"].length,
    3,
    "defaultValue loaded successful"
  );
  Serializer.removeProperty("questionbase", "customArray");
});

QUnit.test(
  "Serialize default values - https://github.com/surveyjs/surveyjs/issues/1386",
  function (assert) {
    var q1 = new Question("q1");
    var q2 = new Question("q2");

    q1.readOnly = false;
    var json = new JsonObject().toJsonObject(q1, true);

    assert.equal(
      json["readOnly"],
      false,
      "default value for readOnly proeprty has been serialzied successfully"
    );

    q2.readOnly = true;
    new JsonObject().toObject(json, q2);
    assert.notOk(
      q2.readOnly,
      "default value for readOnly proeprty has been deserialzied successfully"
    );
  }
);

QUnit.test("itemvalues (array) default value", function (assert) {
  Serializer.addProperty("questionbase", {
    name: "customArray:itemvalues",
    default: [0, 25, 50, 75, 100],
  });
  var question = new Question("q1");

  assert.equal(
    question["customArray"].length,
    5,
    "customArray defaults applied successfully"
  );

  question["customArray"][0].text = "text 1";

  var json = new JsonObject().toJsonObject(question);
  assert.deepEqual(
    json.customArray,
    [
      {
        text: "text 1",
        value: 0,
      },
      25,
      50,
      75,
      100,
    ],
    "customArray serialzied successful 1"
  );

  question = new Question("q1");

  new JsonObject().toObject(json, question);
  assert.equal(
    question["customArray"][0].text,
    "text 1",
    "text deserialized ok"
  );

  json = new JsonObject().toJsonObject(question);
  assert.deepEqual(
    json.customArray,
    [
      {
        text: "text 1",
        value: 0,
      },
      25,
      50,
      75,
      100,
    ],
    "customArray serialzied successful 2"
  );

  question["customArray"][0].text = "text 2";
  json = new JsonObject().toJsonObject(question);

  assert.deepEqual(
    json.customArray,
    [
      {
        text: "text 2",
        value: 0,
      },
      25,
      50,
      75,
      100,
    ],
    "customArray serialzied successful 2"
  );

  Serializer.removeProperty("questionbase", "customArray");
});

QUnit.test("itemvalues (array) save localized text", function (assert) {
  Serializer.addProperty("questionbase", {
    name: "customArray:itemvalues",
    default: [0],
  });
  var question = new Question("q1");

  assert.equal(
    question["customArray"].length,
    1,
    "customArray defaults applied successfully"
  );

  question["customArray"][0].text = "text 1";
  question.locOwner = <any>{
    getLocale: () => "de",
    doPropertyValueChangedCallback: () => {},
  };
  question["customArray"][0].text = "text de";

  var json = new JsonObject().toJsonObject(question);
  assert.deepEqual(
    json.customArray,
    [
      {
        text: {
          default: "text 1",
          de: "text de",
        },
        value: 0,
      },
    ],
    "customArray serialzied successful 1"
  );

  Serializer.removeProperty("questionbase", "customArray");
});

QUnit.test("ItemValue should be deserialized without errors", function (
  assert
) {
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
  assert.equal(
    jsonObject.errors.length,
    0,
    "there are no errors on deserialization"
  );
});

QUnit.test("Extend ItemValue via inheritance with custom property", function (
  assert
) {
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
  assert.equal(
    question["customArray"][0]["points"],
    1,
    "one should be able to read and write the custom property"
  );
  question["customArray"][0]["guid"] = "2";
  assert.equal(
    question["customArray"][0]["guid"],
    "2",
    "one should be able to read and write the inherited custom property"
  );

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
  assert.equal(
    question["customArray"].length,
    4,
    "custom array should be deserialized"
  );
  assert.equal(
    question["customArray"][0]["points"],
    5,
    "custom property value should be deserialized"
  );
  assert.equal(
    jsonObject.errors.length,
    0,
    "there are no errors on deserialization"
  );

  Serializer.removeProperty("questionbase", "customArray");
  Serializer.removeProperty("itemvalue", "guid");
});

QUnit.test("isDescendantOf", function (assert) {
  Serializer.addClass(
    "itemvaluesWithPoints",
    ["points:number"],
    null,
    "itemvalue"
  );

  assert.ok(
    Serializer.isDescendantOf("itemvaluesWithPoints", "itemvalue"),
    "itemvaluesWithPoints is a descendant of the itemvalue"
  );
  assert.ok(
    Serializer.isDescendantOf("itemvalue", "itemvalue"),
    "itemvalue is a descendant of the itemvalue"
  );
});
QUnit.test("property.isVisible", function (assert) {
  var property = Serializer.findProperty("dealer", "dummyname");
  assert.equal(property.visible, true, "Property is visible");
  assert.equal(
    property.isVisible("row"),
    true,
    "Property is visible in row layout"
  );
  assert.equal(
    property.isVisible("flow"),
    false,
    "Property is invisible in flow layout"
  );
});

QUnit.test("property.baseValue", function (assert) {
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
  assert.equal(
    Serializer.findProperty("questionbase", "newChoices2").getBaseValue(),
    "Row",
    "getBaseValue works fine with constant"
  );
  assert.equal(
    Serializer.findProperty("questionbase", "newChoices1").getBaseValue(),
    "Column",
    "getBaseValue works fine with function"
  );
  assert.equal(
    Serializer.findProperty("selectbase", "choices").getBaseValue(),
    "item",
    "it is item for choices"
  );
  assert.equal(
    Serializer.findProperty("matrix", "rows").getBaseValue(),
    "Row",
    "it is Row for rows"
  );
  assert.equal(
    Serializer.findProperty("matrix", "columns").getBaseValue(),
    "Column",
    "it is Column for columns"
  );

  Serializer.removeProperty("questionbase", "newChoices1");
  Serializer.removeProperty("questionbase", "newChoices2");
});

QUnit.test("Remove class", function (assert) {
  assert.ok(Serializer.findClass("big"), "Class is here");
  var classes = [];
  Serializer.getChildrenClasses("car", false).forEach((item) => {
    classes.push(item.name);
  });
  assert.ok(classes.indexOf("big") > -1, "big is in children car classes");

  Serializer.removeClass("big");
  assert.notOk(Serializer.findClass("big"), "Class is not here");
  classes = [];
  Serializer.getChildrenClasses("car", false).forEach((item) => {
    classes.push(item.name);
  });
  assert.notOk(
    classes.indexOf("big") > -1,
    "big is not in children car classes"
  );

  Serializer.addClass("big", [], null, "car");
});

QUnit.test("Get properties dependedOn", function (assert) {
  var propCar = Serializer.findProperty("dealer", "car");
  var propTruck = Serializer.findProperty("dealer", "truck");
  assert.deepEqual(propCar.getDependedProperties(), ["truck"]);
  assert.deepEqual(propTruck.getDependedProperties(), []);

  Serializer.addProperty("dealer", { name: "dp1", dependsOn: "car" });
  assert.deepEqual(propCar.getDependedProperties(), ["truck", "dp1"]);

  //depends on property from a parent class
  Serializer.addProperty("sport", { name: "dp2", dependsOn: ["name"] });
  var propName = Serializer.findProperty("sport", "name");
  assert.deepEqual(propName.getDependedProperties(), ["dp2"]);

  Serializer.removeProperty("dealer", "dp1");
  Serializer.removeProperty("sport", "dp2");
});
QUnit.test("property.visibleIf functionality", function (assert) {
  var dealer = new Dealer();
  var propTruck = Serializer.findProperty("dealer", "truck");
  assert.equal(
    propTruck.isVisible("row", dealer),
    false,
    "It is invisible by default"
  );
  dealer.car = new Truck();
  dealer.car.name = "mycar";
  assert.equal(
    propTruck.isVisible("row", dealer),
    true,
    "The visibleIf returns true"
  );
});

QUnit.test(
  "Apply defaultValue property serializer attribute for all object in constructor",
  function (assert) {
    var propDefaultValue = Serializer.findProperty("dealer", "defaultValue");
    var oldValue = propDefaultValue.defaultValue;
    propDefaultValue.defaultValue = "MyValue";
    var dealer = new Dealer();
    assert.equal(dealer.defaultValue, "MyValue");
    propDefaultValue.defaultValue = oldValue;
  }
);

QUnit.test("custom property and onSetValue", function (assert) {
  Serializer.addProperty("car", {
    name: "onSetValueCheck",
    onSetValue: function (obj, value) {
      obj.dummyProperty = value;
    },
  });
  var car = new Car();
  car["onSetValueCheck"] = "dummy";
  assert.equal(
    car["dummyProperty"],
    "dummy",
    "onSetValue attribute is working"
  );
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

QUnit.test("re-defnine property in dynamic type", function (assert) {
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
  assert.equal(
    properties.length,
    newProperties.length,
    "We do not add new property, since it has the same name as original"
  );
  var nameProperties = newProperties.filter((p) => p.name === "name");
  assert.equal(nameProperties.length, 1, "Only one name property");
  assert.equal(
    nameProperties[0].type,
    "string",
    "We do not change the property"
  );
  Serializer.removeClass("numberedcarredefinedname");
});

QUnit.test("ItemValue notifications", function (assert) {
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
  assert.equal(propChangeCounter, 1, "One time was changed");
  assert.equal(propChangeSenderType, "dealer", "sender type is correct");
  assert.equal(propChangeName, "orders", "prop name is correct");
  var orderItem = dealer["orders"][0];
  orderItem.value = 2;
  assert.equal(
    propItemValueChangeCounter,
    1,
    "ItemValue: One time was changed"
  );
  assert.equal(
    propItemValueChangeSenderType,
    "dealer",
    "ItemValue: sender type is correct"
  );
  assert.equal(
    propItemValueChangeObjType,
    "itemorder",
    "ItemValue: itemvalue type is correct"
  );
  assert.equal(
    propItemValueChangePropertyName,
    "orders",
    "ItemValue: property name is correct"
  );
  assert.equal(
    propItemValueChangeName,
    "value",
    "ItemValue: itemvalue name is correct"
  );
  orderItem.price = 10;
  assert.equal(
    propItemValueChangeCounter,
    2,
    "ItemValue (price): One time was changed"
  );
  assert.equal(
    propItemValueChangeSenderType,
    "dealer",
    "ItemValue (price): sender type is correct"
  );
  assert.equal(
    propItemValueChangeObjType,
    "itemorder",
    "ItemValue (price): itemvalue type is correct"
  );
  assert.equal(
    propItemValueChangePropertyName,
    "orders",
    "ItemValue (price): property name is correct"
  );
  assert.equal(
    propItemValueChangeName,
    "price",
    "ItemValue (price): itemvalue name is correct"
  );
  Serializer.removeProperty("dealer", "orders");
  Serializer.removeClass("itemorder");
});

QUnit.test("Override invisible property by making it visible", function (
  assert
) {
  Serializer.addProperty("itemvalue", { name: "price:number", visible: false });
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
  assert.equal(
    properties.length,
    propertiesOrder.length,
    "The number of properties are the same"
  );
  var l = properties.length - 1;
  assert.equal(properties[l].name, "price", "itemvalue: price propeprty");
  assert.equal(properties[l].visible, false, "itemvalue: price invisible");
  assert.equal(propertiesOrder[l].name, "price", "itemorder: price propeprty");
  assert.equal(propertiesOrder[l].visible, true, "itemorder: price visible");
  Serializer.removeClass("itemorder");
  Serializer.removeProperty("item", "price");
});

QUnit.test("ItemValue value changed notifications", function (assert) {
  var itemValue = new ItemValue("item");
  var valueChangedCount = 0;
  itemValue.registerFunctionOnPropertyValueChanged(
    "value",
    () => {
      valueChangedCount++;
    },
    "val_changed"
  );
  itemValue.value = "Test";
  assert.equal(valueChangedCount, 1, "changed notification has been fired");
  itemValue.unRegisterFunctionOnPropertyValueChanged("value", "val_changed");
});
QUnit.test("property.displayName", function (assert) {
  assert.equal(
    Serializer.findProperty("truck", "maxWeight").displayName,
    "Maximum Weight",
    "property.displayName is correct"
  );
});
