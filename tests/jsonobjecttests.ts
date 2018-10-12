import { JsonObject, JsonUnknownPropertyError } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { Base } from "../src/base";
import { Helpers } from "../src/helpers";
import { ILocalizableOwner } from "../src/localizablestring";
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
  static supportedCars = {
    fast: [],
    truck: ["maxWeight"]
  };
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
  getDynamicProperties(): Array<string> {
    return CarOwner.supportedCars[this.carType];
  }
  public name: string;
  public get car(): Car {
    return this.carValue;
  }
  public get carType(): string {
    return this.carValue.getType();
  }
  public set carType(val: string) {
    if (val == this.carType || !CarOwner.supportedCars[val]) return;
    var newCar = <Car>JsonObject.metaData.createClass(val);
    if (!newCar) return;
    this.removeProperties();
    this.carValue = newCar;
    this.addProperties();
  }
  private removeProperties() {
    var props = CarOwner.supportedCars[this.carType];
    for (var i = 0; i < props.length; i++) {
      delete this[props[i]];
    }
  }
  private addProperties() {
    var props = CarOwner.supportedCars[this.carType];
    var car = this.car;
    for (var i = 0; i < props.length; i++) {
      var propName = props[i];
      if (!!this[propName]) continue;
      var desc = {
        configurable: true,
        get: function() {
          return car[propName];
        },
        set: function(v: any) {
          car[propName] = v;
        }
      };
      Object.defineProperty(this, propName, desc);
    }
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
  public defaultValue: string = "default";
  public car: Car;
  public truck: Truck;
  public trucks = new Array<Truck>();
  public changeNameOnSet: string;
  public getType(): string {
    return "dealer";
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
  public A: number;
  public getType(): string {
    return "shouldnotcreate";
  }
}
class CreatingObject extends NonCreatingObject {
  public B: number;
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

JsonObject.metaData.addClass(
  "dealer",
  [
    "name:string",
    "dummyname",
    "car",
    "cars",
    "stringArray",
    { name: "defaultValue", default: "default" },
    { name: "cars", baseClassName: "car", visible: false },
    { name: "truck", className: "truck" },
    { name: "trucks", className: "truck", visible: false },
    { name: "definedNonSerializable", isSerializable: false },
    {
      name: "changeNameOnSet",
      onSetValue: function(obj: any, value: any, jsonConv: JsonObject) {
        obj.name = value;
      }
    }
  ],
  function() {
    return new Dealer();
  }
);

JsonObject.metaData.addClass(
  "carowner",
  [{ name: "carType", default: "fast" }, "name"],
  function() {
    return new CarOwner();
  }
);

JsonObject.metaData.addClass(
  "fast",
  [],
  function() {
    return new FastCar();
  },
  "car"
);
JsonObject.metaData.addClass("big", [], null, "car");

JsonObject.metaData.addClass("car", ["name"]);
JsonObject.metaData.addClass(
  "truck",
  [
    {
      name: "maxWeight:number",
      choices: () => {
        return [500, 1500];
      }
    }
  ],
  function() {
    return new Truck();
  },
  "big"
);
JsonObject.metaData.addClass(
  "sport",
  [{ name: "!maxSpeed", choices: [100, 150, 200, 250] }],
  function() {
    return new SportCar();
  },
  "fast"
);

JsonObject.metaData.addClass("itemvaluelistowner", [
  {
    name: "items",
    onGetValue: function(obj: any) {
      return ItemValue.getData(obj.items);
    },
    onSetValue: function(obj: any, value: any) {
      ItemValue.setData(obj.items, value);
    }
  }
]);

JsonObject.metaData.addClass("item_thelongpart", ["baseSt"]);
JsonObject.metaData.addClass(
  "itemA_thelongpart",
  ["A"],
  function() {
    return new LongNameItemA();
  },
  "LongNameItemBase"
);
JsonObject.metaData.addClass(
  "itemB_thelongpart",
  ["B"],
  function() {
    return new LongNameItemB();
  },
  "LongNameItemBase"
);
JsonObject.metaData.addClass("LongNamesOwner", [
  {
    name: "items",
    baseClassName: "item_thelongpart",
    classNamePart: "_thelongpart"
  }
]);

JsonObject.metaData.addClass("shouldnotcreate", ["A"], function() {
  return new NonCreatingObject();
});
JsonObject.metaData.addClass("container", [
  { name: "obj", className: "shouldnotcreate" },
  { name: "items", className: "shouldnotcreate" }
]);
JsonObject.metaData.overrideClassCreatore("shouldnotcreate", function() {
  return new CreatingObject();
});

JsonObject.metaData.addClass(
  "loadingtest",
  ["name", { name: "items", className: "loadingtestitem" }],
  function() {
    return new LoadingFromJsonObj();
  }
);
JsonObject.metaData.addClass("loadingtestitem", ["name"], function() {
  return new LoadingFromJsonObjItem();
});

JsonObject.metaData.addClass("customtruck", ["description"], null, "truck");
JsonObject.metaData.addProperty("customtruck", {
  name: "isCustom:boolean",
  default: true
});

JsonObject.metaData.addClass(
  "customdealer",
  [{ name: "defaultValue", visible: false }],
  null,
  "dealer"
);

JsonObject.metaData.addClass(
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

JsonObject.metaData.addClass("getpropertyvalue", [
  "directProp",
  {
    name: "getValueProp",
    onGetValue: function(obj: any) {
      return obj.getValuePropGetter;
    }
  },
  { name: "serProperty", serializationProperty: "getSerProperty" },
  { name: "locProperty", serializationProperty: "locPropertyGetter" }
]);

export default QUnit.module("JsonSerializationTests");

QUnit.test("Metadata for non inherited class", function(assert) {
  assert.equal(
    JsonObject.metaData.getProperties("dealer").length,
    10,
    "Flat properties list"
  );
  assert.equal(
    JsonObject.metaData.getProperties("dealer")[0].name,
    "name",
    "Name property"
  );
});
QUnit.test("Metadata add at the beginning parent class properties ", function(
  assert
) {
  assert.equal(
    JsonObject.metaData.getProperties("truck").length,
    2,
    "1 + 1 parent propreties"
  );
  assert.equal(
    JsonObject.metaData.getProperties("truck")[0].name,
    "name",
    "parent properties first"
  );
});
QUnit.test("One object - one property serialization", function(assert) {
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
QUnit.test("String array serialization", function(assert) {
  var dealer = new Dealer();
  dealer.stringArray = ["one", "two"];
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"stringArray":["one","two"]}',
    "serialize array"
  );
});
QUnit.test("Use onGetValue during serialization", function(assert) {
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
QUnit.test("Serialize object with it's type", function(assert) {
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
QUnit.test("Check isRequired property", function(assert) {
  assert.equal(
    JsonObject.metaData.findProperty("sport", "maxSpeed").isRequired,
    true,
    "maxSpeed is required property"
  );
  assert.equal(
    JsonObject.metaData.findProperty("truck", "maxWeight").isRequired,
    false,
    "maxWeight is not required property"
  );
});
QUnit.test("Serialize arrays with serializable objects", function(assert) {
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
QUnit.test("Serialize 0 for number ", function(assert) {
  assert.equal(Helpers.isValueEmpty(0), false, "The value is not default");
  var sport = new SportCar();
  sport.maxSpeed = 0;
  var jsObj = new JsonObject().toJsonObject(sport);
  assert.deepEqual(jsObj, { maxSpeed: 0 }, "0 should be serialized as well");
});
QUnit.test("Serialize object and get type by it's property", function(assert) {
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
  function(assert) {
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

QUnit.test("One object - one property deserialization", function(assert) {
  var dealer = new Dealer();
  new JsonObject().toObject({ name: "small" }, dealer);
  assert.equal(dealer.name, "small", "deserialize just one property");
});
QUnit.test("String array deserialization", function(assert) {
  var dealer = new Dealer();
  new JsonObject().toObject({ stringArray: ["one", "two"] }, dealer);
  assert.deepEqual(dealer.stringArray, ["one", "two"], "deserialize array");
});
QUnit.test("Deserialize object with it's type", function(assert) {
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
QUnit.test("Deserialize arrays with serializable objects", function(assert) {
  var dealer = new Dealer();
  new JsonObject().toObject(
    {
      cars: [
        { type: "sport", maxSpeed: 320 },
        { type: "truck", maxWeight: 10000 }
      ]
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
  function(assert) {
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
  function(assert) {
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
QUnit.test("Use on setValue during deserialization", function(assert) {
  var dealer = new Dealer();
  new JsonObject().toObject({ changeNameOnSet: "nameIsChanged" }, dealer);
  assert.equal(dealer.name, "nameIsChanged", "the property name is set");
});
QUnit.test("ItemValueListOwner serialization", function(assert) {
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
QUnit.test("ItemValueListOwner deserialization", function(assert) {
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
    list.items[1].text,
    "5",
    "set correct text property for the second item"
  );
  assert.equal(
    list.items[3].value,
    "value1",
    "set correct value property for the fourth item"
  );
  assert.equal(
    list.items[3].text,
    "text1",
    "set correct text property for the fourth item"
  );
});
QUnit.test(
  "ItemValueListOwner deserialization, custom property in ItemValue",
  function(assert) {
    var list = new ItemValueListOwner();

    new JsonObject().toObject(
      {
        items: [
          { value: 7, text: "Item 1", price: 55.5 },
          5,
          "item",
          "value1|text1"
        ]
      },
      list
    );
    assert.equal(list.items.length, 4, "there are 4 items");
    assert.equal(list.items[0]["price"], 55.5, "set custom value correctly");
  }
);
QUnit.test(
  "ItemValueListOwner deserialization, value as object, remove pos",
  function(assert) {
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
  function(assert) {
    var json = {
      name: "q1",
      defaultValue: [
        { pos: { start: 1, end: 5 }, column1: 1, column2: 2 },
        { column1: 3, column2: 4 }
      ],
      defaultRowValue: { pos: { start: 1, end: 5 }, column1: 1, column2: 2 }
    };
    var matrix = new QuestionMatrixDynamicModel("q1");
    new JsonObject().toObject(json, matrix);
    var jsObj = new JsonObject().toJsonObject(matrix);
    assert.deepEqual(
      jsObj,
      {
        name: "q1",
        defaultValue: [{ column1: 1, column2: 2 }, { column1: 3, column2: 4 }],
        defaultRowValue: { column1: 1, column2: 2 }
      },
      "serialize ItemValueListOwner"
    );
  }
);
QUnit.test("LongNamesOwner serialization", function(assert) {
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
QUnit.test("ItemValueListOwner deserialization", function(assert) {
  var owner = new LongNamesOwner();
  new JsonObject().toObject(
    { items: [{ type: "itemA", A: 5 }, { type: "itemB_thelongpart", B: 15 }] },
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
QUnit.test("Do not change Json", function(assert) {
  var json = {
    items: [{ type: "itemA", A: 5 }, { type: "itemB_thelongpart", B: 15 }]
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

QUnit.test("Unknown property error on deserialization", function(assert) {
  var owner = new LongNamesOwner();
  var jsonObj = new JsonObject();
  jsonObj.toObject(
    {
      unknown1: 4,
      items: [
        { type: "itemA", A: 5 },
        { unknown2: 5, type: "itemB_thelongpart", B: 15 }
      ]
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
QUnit.test("Having 'pos' property for objects with errors", function(assert) {
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
          B: 15
        }
      ]
    },
    owner
  );
  assert.equal(jsonObj.errors.length, 2, "it should be two errors");
  assert.equal((<JsonUnknownPropertyError>jsonObj.errors[0]).at, 20);
  assert.equal((<JsonUnknownPropertyError>jsonObj.errors[1]).at, 30);
});
QUnit.test("Do not remove 'pos' property from objects", function(assert) {
  var dealer = new Dealer();
  var jsonObj = new JsonObject();
  jsonObj.toObject(
    {
      pos: { start: 1 },
      cars: [
        { pos: { start: 10 }, maxSpeed: 320 },
        { pos: { start: 20 }, type: "truck", maxWeight: 10000 }
      ]
    },
    dealer
  );
  var truck = <Truck>dealer.cars[0];
  assert.equal(truck["pos"].start, 20, "deserialize the second object");
});
QUnit.test("Deserialize arrays with missing type property", function(assert) {
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
QUnit.test("Deserialize arrays with incorrect type property", function(assert) {
  var dealer = new Dealer();
  var jsonObj = new JsonObject();
  jsonObj.toObject(
    {
      cars: [
        { type: "unknown", maxSpeed: 320 },
        { type: "truck", maxWeight: 10000 }
      ]
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
QUnit.test("Deserialization - required property error", function(assert) {
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
});
QUnit.test("Deserialization - required property error", function(assert) {
  var children = JsonObject.metaData.getChildrenClasses("car");
  assert.equal(children.length, 5, "There are 5 children classes");
  children = JsonObject.metaData.getChildrenClasses("car", true);
  assert.equal(
    children.length,
    3,
    "There are 3 children classes that can be created."
  );
});
QUnit.test("Property Type test", function(assert) {
  var properties = JsonObject.metaData.getProperties("truck");
  assert.equal(properties[0].name, "name", "It is a 'name' property");
  assert.equal(properties[0].type, "string", "Name property is string");
  assert.equal(properties[1].name, "maxWeight", "It is a 'maxWeight' property");
  assert.equal(properties[1].type, "number", "maxWeight property is number");
});
QUnit.test("Property Choices test", function(assert) {
  var properties = JsonObject.metaData.getProperties("truck");
  assert.equal(properties[0].name, "name", "It is a 'name' property");
  assert.equal(properties[0].type, "string", "Name property is string");
  assert.equal(properties[1].name, "maxWeight", "It is a 'maxWeight' property");
  assert.equal(properties[1].type, "number", "maxWeight property is number");
});
QUnit.test("Property Choices test", function(assert) {
  var properties = JsonObject.metaData.getProperties("sport");
  assert.equal(properties[1].name, "maxSpeed", "It is a 'maxSpeed' property");
  assert.deepEqual(
    properties[1].choices,
    [100, 150, 200, 250],
    "'maxSpeed' property choices"
  );
});
QUnit.test("Property Choices func test", function(assert) {
  var properties = JsonObject.metaData.getProperties("truck");
  assert.equal(properties[1].name, "maxWeight", "It is a 'maxWeight' property");
  assert.deepEqual(
    properties[1].choices,
    [500, 1500],
    "'maxWeight' property choices"
  );
});
QUnit.test("Create inherited class instead of origional", function(assert) {
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
QUnit.test("toJsonObject should create new instance of objects", function(
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

QUnit.test("Add new property to object", function(assert) {
  var propertiesCount = JsonObject.metaData.getProperties("truck").length;
  JsonObject.metaData.addProperty("car", "isUsed:boolean");
  var dealer = new Dealer();
  new JsonObject().toObject(
    { truck: { isUsed: true, maxWeight: 10000 } },
    dealer
  );
  assert.equal(dealer.truck["isUsed"], true, "new property is here");
  assert.equal(
    propertiesCount + 1,
    JsonObject.metaData.getProperties("truck").length,
    "there is on one property more"
  );
  var jsObj = new JsonObject().toJsonObject(dealer);
  assert.equal(
    JSON.stringify(jsObj),
    '{"truck":{"isUsed":true,"maxWeight":10000}}',
    "property is serialized"
  );
  JsonObject.metaData.removeProperty("car", "isUsed");
  assert.equal(
    propertiesCount,
    JsonObject.metaData.getProperties("truck").length,
    "the additional property is removed"
  );
});

QUnit.test("Add property into alternative name of class", function(assert) {
  JsonObject.metaData.addAlterNativeClassName("truck", "trick");
  assert.equal(
    JsonObject.metaData.findClass("trick").name,
    "truck",
    "Find class by alternative name"
  );
  var propertiesCount = JsonObject.metaData.getProperties("truck").length;
  JsonObject.metaData.addProperty("trick", "isUsed:boolean");
  assert.equal(
    propertiesCount + 1,
    JsonObject.metaData.getProperties("truck").length,
    "there is on one property more"
  );
  assert.equal(
    propertiesCount + 1,
    JsonObject.metaData.getProperties("trick").length,
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
  JsonObject.metaData.removeProperty("trick", "isUsed");
  assert.equal(
    propertiesCount,
    JsonObject.metaData.getProperties("truck").length,
    "the additional property is removed"
  );
});

QUnit.test("Add a new number property with default value", function(assert) {
  JsonObject.metaData.addProperty("car", { name: "tag:number", default: 1 });
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

  JsonObject.metaData.removeProperty("car", "tag");
});

QUnit.test("A non serializable property", function(assert) {
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

QUnit.test("Get property and readonly", function(assert) {
  var property = JsonObject.metaData.findProperty("truck", "name");
  assert.equal(property.readOnly, false, "readOnly is false by default");
  property.readOnly = true;
  var property2 = JsonObject.metaData.findProperty("truck", "name");
  assert.equal(property2.readOnly, true, "readOnly is true now");
});

QUnit.test(
  "Add alternative/misspelled property support, https://github.com/surveyjs/surveyjs/issues/280",
  function(assert) {
    JsonObject.metaData.findProperty("truck", "maxWeight").alternativeName =
      "maxaWeight";
    var dealer = new Dealer();
    new JsonObject().toObject(
      {
        cars: [
          { type: "sport", maxSpeed: 320 },
          { type: "truck", maxaWeight: 10000 }
        ]
      },
      dealer
    );
    var truck: any = dealer.cars[1];
    assert.equal(truck.maxWeight, 10000, "deserialize the second object");
  }
);

QUnit.test("Check if visible is set", function(assert) {
  assert.equal(
    JsonObject.metaData.findProperty("dealer", "name").visible,
    true,
    "By default the property is visible"
  );
  assert.equal(
    JsonObject.metaData.findProperty("dealer", "cars").visible,
    false,
    "Cars is invisible"
  );
});

QUnit.test("Test getPropertyValue and isLocalizable", function(assert) {
  var obj = new CheckGetPropertyValue();
  obj.directProp = "dirValue";
  obj.getValueProp = "getValue_no";
  obj.getValuePropGetter = "getValue_yes";
  obj.serProperty = "serProperty_no";
  obj.getSerProperty.text = "serProperty_yes";
  obj.locProperty = "loc_no";
  obj.locPropertyGetter.text = "loc_yes";

  var property = JsonObject.metaData.findProperty(obj.getType(), "directProp");
  assert.equal(
    property.getPropertyValue(obj),
    "dirValue",
    "dirProperty works correctly"
  );

  property = JsonObject.metaData.findProperty(obj.getType(), "getValueProp");
  assert.equal(
    property.getPropertyValue(obj),
    "getValue_yes",
    "getValueProp works correctly"
  );

  property = JsonObject.metaData.findProperty(obj.getType(), "serProperty");
  assert.deepEqual(
    property.getPropertyValue(obj),
    { text: "serProperty_yes" },
    "getValueProp works correctly"
  );

  property = JsonObject.metaData.findProperty(obj.getType(), "locProperty");
  assert.equal(
    property.getPropertyValue(obj),
    "loc_yes",
    "getValueProp works correctly"
  );
});
QUnit.test("Deserialize number and boolean correctly, bug #439", function(
  assert
) {
  JsonObject.metaData.addProperty("car", "isUsed:boolean");
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
  JsonObject.metaData.removeProperty("car", "isUsed");
});

QUnit.test("Loading test deserialization", function(assert) {
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

QUnit.test("Override type property in a successor class", function(assert) {
  var property = JsonObject.metaData.findProperty("fast", "name");
  assert.equal(property.type, "string", "The default type");
  function findProperty() {
    property = null;
    var properties = JsonObject.metaData.getProperties("fast");
    for (var i = 0; i < properties.length; i++) {
      if (properties[i].name == "name") {
        property = properties[i];
        break;
      }
    }
  }
  findProperty();
  assert.equal(property.type, "string", "The default type");
  JsonObject.metaData.addProperty("fast", "name:text");
  property = JsonObject.metaData.findProperty("fast", "name");
  assert.equal(property.type, "text", "The type is text for fast car");
  property = JsonObject.metaData.findProperty("car", "name");
  assert.equal(property.type, "string", "The type is string for car");
  findProperty();
  assert.equal(
    property.type,
    "text",
    "The type is text for fast car, getProperties"
  );
});

QUnit.test("Set default value to the custom property", function(assert) {
  JsonObject.metaData.addProperty("car", {
    name: "isUsed:boolean",
    default: true
  });
  JsonObject.metaData.addProperty("car", { name: "tag:number", default: 0 });
  var truck = new Truck();
  assert.equal(truck["isUsed"], true, "the default boolean value is set");
  assert.equal(truck["tag"], 0, "the default numeric value is set");
  JsonObject.metaData.removeProperty("car", "isUsed");
  JsonObject.metaData.removeProperty("car", "tag");
});
QUnit.test("Create localizable property", function(assert) {
  JsonObject.metaData.addProperty("car", {
    name: "myLocalizableProp:text",
    isLocalizable: true
  });
  var truck = new Truck();
  truck["myLocalizableProp"] = "default_Text";
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

  JsonObject.metaData.removeProperty("car", "myLocalizableProp");
});

QUnit.test(
  "Create  object with virtual type by using parent constructor",
  function(assert) {
    var dealer = new Dealer();
    var jsonObj = new JsonObject();
    jsonObj.toObject(
      {
        cars: [
          { type: "customtruck", maxWeight: 10000, description: "some text" }
        ]
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
  function(assert) {
    var dealer = <Dealer>JsonObject.metaData.createClass("customdealer");
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

QUnit.test("Create class with camel name", function(assert) {
  var dealer = <Dealer>JsonObject.metaData.createClass("Cameldealer");
  assert.ok(dealer, "The object is created");
});

QUnit.test("Generate properties on the fly", function(assert) {
  var carOwner = <CarOwner>JsonObject.metaData.createClass("carowner");
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

QUnit.test("Serialize/deserialize dynamic properties", function(assert) {
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

QUnit.test("Add property into questionbase", function(assert) {
  JsonObject.metaData.addProperty("questionbase", "custom");
  var question = new Question("q1");
  new JsonObject().toObject({ name: "q2", custom: "customValue1" }, question);
  assert.equal(question.name, "q2", "name serialzied successful");
  assert.equal(
    question["custom"],
    "customValue1",
    "custom serialzied successful"
  );
  JsonObject.metaData.removeProperty("questionbase", "custom");
});

QUnit.test("Add itemvalues (array) property into questionbase", function(
  assert
) {
  JsonObject.metaData.addProperty("questionbase", "customArray:itemvalues");
  var question = new Question("q1");

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

  var json = new JsonObject().toJsonObject(question);
  assert.deepEqual(
    json.customArray,
    [1, 2, 3, 4],
    "customArray serialzied successful"
  );

  JsonObject.metaData.removeProperty("questionbase", "customArray");

  JsonObject.metaData.addProperty("questionbase", {
    name: "customArray:itemvalues",
    default: [1, 3, 5]
  });
  question = new Question("q2");
  assert.equal(
    question["customArray"].length,
    3,
    "defaultValue loaded successful"
  );
  JsonObject.metaData.removeProperty("questionbase", "customArray");
});

QUnit.test(
  "Serialize default values - https://github.com/surveyjs/surveyjs/issues/1386",
  function(assert) {
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
