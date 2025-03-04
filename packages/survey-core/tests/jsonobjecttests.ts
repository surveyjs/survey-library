import {
  JsonObject,
  Serializer,
  JsonUnknownPropertyError,
  property,
  JsonObjectProperty,
  JsonRequiredPropertyError,
} from "../src/jsonobject";
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
    "2 + 1 parent properties"
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
      onSetValue: function (obj: any) { },
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
QUnit.test("itemvalue.value is required and unique", function (assert) {
  const prop = Serializer.findProperty("itemvalue", "value");
  assert.equal(prop.isRequired, true, "itemvalue.value is required");
  assert.equal(prop.isUnique, true, "itemvalue.value is unique");
});
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
QUnit.test("Custom object deserialization, remove pos", function (assert) {
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

  assert.equal(car.options.itemValue, "abcdef", "check itemValue");
  assert.equal(car.options.pos.start, 1, "pos1");
  assert.equal(car.options.label.pos.start, 10, "pos2");
  assert.equal(car.optionsarray[0].pos.start, 20, "pos3");
  assert.equal(car.optionsarray[0].label.pos.start, 30, "pos4");

  const car_json = car.toJSON();
  assert.notOk(car_json.options["pos"], "no pos1");
  assert.notOk(car_json.options.label["pos"], "no pos2");
  assert.notOk(car_json.optionsarray[0]["pos"], "no pos3");
  assert.notOk(car_json.optionsarray[0].label["pos"], "no pos4");

  Serializer.removeProperty("car", "options");
  Serializer.removeProperty("car", "optionsarray");
  Serializer.removeClass("optionstype");
});
QUnit.test(
  "ItemValue and settings.itemValueAlwaysSerializeAsObject = true",
  function (assert) {
    settings.itemValueAlwaysSerializeAsObject = true;
    const list = new ItemValueListOwner();
    list.items.push(new ItemValue(7, "Item 1"));
    list.items.push(new ItemValue(5));
    list.items.push(new ItemValue("item"));

    const jsObj = new JsonObject().toJsonObject(list);
    assert.deepEqual(jsObj, { "items": [{ "value": 7, "text": "Item 1" }, { "value": 5 }, { "value": "item" }] },
      "serialize ItemValueListOwner"
    );
    settings.itemValueAlwaysSerializeAsObject = false;
  }
);
QUnit.test(
  "ItemValue and settings.itemValueAlwaysSerializeAsObject = true",
  function (assert) {
    settings.itemValueAlwaysSerializeText = true;
    const list = new ItemValueListOwner();
    list.items.push(new ItemValue(7, "Item 1"));
    list.items.push(new ItemValue(5));
    list.items.push(new ItemValue("item"));
    list.items.push(new ItemValue("A", "A"));
    list.items.push(new ItemValue("a", "A"));

    let jsObj = new JsonObject().toJsonObject(list);
    assert.deepEqual(
      jsObj,
      {
        "items": [{ "value": 7, "text": "Item 1" },
          { "value": 5, text: "5" },
          { "value": "item", text: "item" },
          { "value": "A", text: "A" },
          { "value": "a", text: "A" }]
      },
      "serialize ItemValueListOwner with text"
    );
    settings.itemValueAlwaysSerializeText = false;
    jsObj = new JsonObject().toJsonObject(list);
    assert.deepEqual(
      jsObj,
      { "items": [{ "value": 7, "text": "Item 1" }, 5, "item", "A", { "value": "a", text: "A" }] },
      "serialize ItemValueListOwner without text");
  });
QUnit.test(
  "ItemValue and settings.itemValueAlwaysSerializeAsObject = true, do not serialize",
  function (assert) {
    settings.itemValueAlwaysSerializeText = true;
    const list = new ItemValueListOwner();
    list.items.push(new ItemValue({ val: 1, text: "Item1" }, "Item 1"));
    list.items.push(new ItemValue({ val: 1, text: "Item1" }));
    let jsObj = new JsonObject().toJsonObject(list);
    assert.deepEqual(
      jsObj,
      {
        "items": [{ value: { val: 1, text: "Item1" }, "text": "Item 1" },
          { val: 1, text: "Item1" }]
      }, "Do not serialize objects");
    settings.itemValueAlwaysSerializeText = false;
  });

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
  assert.equal(jsonObj.errors.length, 2, "it has two errors");
  const error1 = <JsonUnknownPropertyError>jsonObj.errors[0];
  assert.equal(error1.propertyName, "unknown1", "the property Name in the first error");
  assert.equal(error1.element.getType(), "LongNamesOwner", "element is set correctly in first error");
  assert.ok(error1.jsonObj, "jsonObj is here");
  assert.equal(error1.className, "LongNamesOwner", "the class Name in the first error");
  const error2 = <JsonUnknownPropertyError>jsonObj.errors[1];
  assert.equal(error2.propertyName, "unknown2", "the property Name in the second error");
  assert.equal(error2.className, "itemB_thelongpart", "the class Name in the second error");
  assert.equal(error2.element.getType(), "itemB_thelongpart", "the element property in the second error");
  assert.equal(error2.jsonObj["B"], 15, "jsonObj is correct");
});
QUnit.test("Having 'pos' property for objects with errors", function (assert) {
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
  assert.equal(jsonObj.errors.length, 2, "it should be two errors");
  const error1 = jsonObj.errors[0];
  const error2 = jsonObj.errors[1];
  assert.equal(error1.at, 20);
  assert.equal(error1.end, 29);
  assert.equal(error2.at, 41);
  assert.equal(error2.end, 50);
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
QUnit.test("Deserialize arrays with incorrect type property", function (assert) {
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
  Serializer.addProperty("truck", { name: "req:number", default: 0, isRequired: true });
  const car = new Truck();
  var jsonObj = new JsonObject();
  jsonObj.toObject({ maxWeight: 5000 }, car);
  assert.equal(car.maxWeight, 5000, "Property is deserialized");
  assert.equal(jsonObj.errors.length, 0, "req property is required, but it has a default value");
  Serializer.removeProperty("truck", "req");
});
QUnit.test("Deserialization - required property with default value should not produce error", function (assert) {
  var dealer = new Dealer();
  var jsonObj = new JsonObject();
  jsonObj.toObject({ cars: [{ type: "sport" }] }, dealer);
  assert.equal(dealer.cars.length, 1, "One object is deserialized");
  assert.equal(jsonObj.errors.length, 1, "there should be one error about required property");
  let error1 = <JsonRequiredPropertyError>jsonObj.errors[0];
  assert.equal(error1.type, "requiredproperty", "The required property error, #1");
  assert.equal(error1.propertyName, "maxSpeed", "propertyName is set, #1");
  assert.equal(error1.element.getType(), "sport", "element is set into error, #1");

  Serializer.addProperty("dealer", "!foo");
  jsonObj = new JsonObject();
  jsonObj.toObject({}, dealer);
  assert.equal(
    jsonObj.errors.length,
    1,
    "dealer: there should be one error about required property"
  );
  error1 = <JsonRequiredPropertyError>jsonObj.errors[0];
  assert.equal(error1.type, "requiredproperty", "dealer: The required property error, #2");
  assert.equal(error1.propertyName, "foo", "property name is set, #2");
  assert.equal(error1.element.getType(), "dealer", "element is set into error, #2");
  assert.equal(error1.message.indexOf("foo") > -1, true, "dealer: show that 'foo' is missing:" + error1.message);
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

QUnit.test("Add textitems (array) property into questionbase", function (
  assert
) {
  Serializer.addProperty("questionbase", {
    name: "customItems",
    type: "textitems",
  });
  var question = new Question("q1");

  var property = Serializer.findProperty("questionbase", "customItems");
  assert.equal(
    property.type,
    "textitem[]",
    "Property should have correct type"
  );

  Serializer.removeProperty("questionbase", "customItems");
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
      "default value for readOnly property has been serialzied successfully"
    );
    const jsonKeys = Object.keys(json);
    assert.equal(jsonKeys.indexOf("validators"), -1, "no validators");

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
    doPropertyValueChangedCallback: () => { },
    getMarkdownHtml: (text) => text,
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

QUnit.test("ItemValue should be deserialized without errors", function (assert) {
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
QUnit.test("title property.isVisible", function (assert) {
  const prop = Serializer.findProperty("question", "title");
  prop.visibleIf = (obj: any): boolean => {
    return obj.name != "abc";
  };
  const q = new QuestionTextModel("q1");
  assert.equal(prop.isVisible("row", q), true, "row, #1");
  assert.equal(prop.isVisible("detail", q), false, "detail #2");
  assert.equal(prop.isVisible("", q), true, "empty #1");
  q.name = "abc";
  assert.equal(prop.isVisible("row", q), false, "row, #2");
  assert.equal(prop.isVisible("detail", q), false, "detail #2");
  assert.equal(prop.isVisible("", q), false, "empty #2");
  (<any>prop).visibleIf = undefined;
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
  itemValue.registerPropertyChangedHandlers(["value"],
    () => {
      valueChangedCount++;
    },
    "val_changed"
  );
  itemValue.value = "Test";
  assert.equal(valueChangedCount, 1, "changed notification has been fired");
  itemValue.unregisterPropertyChangedHandlers(["value"], "val_changed");
});
QUnit.test("property.displayName", function (assert) {
  assert.equal(
    Serializer.findProperty("truck", "maxWeight").displayName,
    "Maximum Weight",
    "property.displayName is correct"
  );
});
QUnit.test("Serializer.getAllClasses() function", function (assert) {
  var classes = Serializer.getAllClasses();
  assert.ok(classes.indexOf("truck") > -1, "Has truck");
  assert.ok(classes.indexOf("question") > -1, "Has question");
  assert.notOk(classes.indexOf("dummy_") > -1, "Has no dummy_");
});
QUnit.test("Serializer.getAllPropertiesByName() function", function (assert) {
  var properties = Serializer.getAllPropertiesByName("description");
  assert.equal(properties.length, 6, "survey, panel, page, question, customtruck, nonvalue");
  assert.equal(properties[0].name, "description", "Find property with the correct name");
});
QUnit.test("nextToProperty attribute", function (assert) {
  var prop = Serializer.addProperty("truck", {
    name: "test",
    nextToProperty: "name",
  });
  assert.equal(
    prop.nextToProperty,
    "name",
    "created with correct nextToProperty attribute"
  );
  Serializer.removeProperty("truck", "test");
});
QUnit.test("check dataList attribute", function (assert) {
  var prop = Serializer.findProperty("carowner", "name");
  assert.deepEqual(
    prop.dataList,
    ["item1", "item2"],
    "dataList attribute created correctly"
  );
});
QUnit.test("check isUnique attribute", function (assert) {
  var prop = Serializer.findProperty("carowner", "name");
  assert.deepEqual(prop.isUnique, true, "isUnique attribute created correctly");
});
QUnit.test(
  "multiplevalues/array property should call onPropertyChanged on modifying array",
  function (assert) {
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
    assert.deepEqual(owner["ar"], ["A", "B"], "property set correctly");
    assert.equal(counter, 2, "onPropertyChanged called two times");
    assert.equal(
      propName,
      "ar",
      "onPropertyChanged called on chaning 'ar' property"
    );
    Serializer.removeProperty("carowner", "ar");
  }
);
QUnit.test("always return false for a boolean property", function (assert) {
  Serializer.addProperty("truck", "boolProp:boolean");
  var truck = new Truck();
  assert.equal(
    truck.getPropertyValue("boolProp"),
    false,
    "There is no default value, but we use false as default for boolean "
  );
  Serializer.removeProperty("truck", "boolProp");
});
QUnit.test("Serialize title with whitespace, Bug#2725", function (assert) {
  var question = new Question("q1");
  question.title = " ";
  assert.equal(question.title, " ", "White space is set");
  assert.equal(question.locTitle.isEmpty, false, "Value is not empty");
  assert.deepEqual(
    question.toJSON(),
    { name: "q1", title: " " },
    "Serialize white space"
  );
});
QUnit.test("itemvalue enableIf property visibility test", function (assert) {
  var rating = new QuestionRatingModel("q1");
  rating.rateValues.push(new ItemValue(1));
  var checkbox = new QuestionCheckboxModel("q2");
  checkbox.choices.push(new ItemValue(1));

  var property = Serializer.findProperty("itemvalue", "enableIf");
  assert.ok(property, "Property is here");
  assert.equal(
    property.isVisible("form", rating.rateValues[0]),
    false,
    "We do not show enableIf for rateValues"
  );
  assert.equal(
    property.isVisible("form", checkbox.choices[0]),
    true,
    "We show enableIf for all other properties"
  );
});
QUnit.test("Change default value for question.showNumber", function (assert) {
  assert.equal(new Question("q1").showNumber, true, "By default showNumber returns true");
  Serializer.findProperty("question", "showNumber").defaultValue = false;
  assert.equal(new Question("q1").showNumber, false, "We have override showNumber");
  Serializer.findProperty("question", "showNumber").defaultValue = true;
  assert.equal(new Question("q1").showNumber, true, "We made showNumber true by default again"
  );
});
QUnit.test("Serializer.getProperty()", function (assert) {
  Serializer.addClass("new_dealer", [], null, "dealer");
  let new_dealer: Dealer = Serializer.createClass("new_dealer");
  assert.equal(new_dealer.defaultValue, "default", "Use attribute from dealer for new_dealer");
  Serializer.getProperty("new_dealer", "defaultValue").defaultValue = "new_default";
  new_dealer = Serializer.createClass("new_dealer");
  assert.equal(new_dealer.defaultValue, "new_default", "Use attribute from new_dealer");
  let dealer: Dealer = Serializer.createClass("dealer");
  assert.equal(dealer.defaultValue, "default", "Use attribute from dealer");
  Serializer.removeClass("new_dealer");
});
QUnit.test("Serializer.getProperty For not-arrays and arrays", function (assert) {
  Serializer.addClass("new_selectbase", [], null, "selectbase");
  let hasOtherFind = Serializer.findProperty("new_selectbase", "hasOther");
  assert.equal(hasOtherFind.isArray, false, "Find hasOther for new_selectbase is not array");
  let hasOtherGet = Serializer.getProperty("new_selectbase", "hasOther");
  assert.equal(hasOtherGet.isArray, false, "Get hasOther for new_selectbase is not array");

  let choicesPropFind = Serializer.findProperty("new_selectbase", "choices");
  assert.equal(choicesPropFind.isArray, true, "Find Choices for new_selectbase is array");
  let choicesPropGet = Serializer.getProperty("new_selectbase", "choices");
  assert.equal(choicesPropGet.isArray, true, "Get Choices for new_selectbase is array");
  Serializer.removeClass("new_selectbase");
});
QUnit.test("Declared @property", function (assert) {
  const obj = new TestDeclaredProps();
  assert.equal(obj.numberProp, 5, "get default number prop");
  assert.ok(obj["locStr1"], "locStr1 exists");
  assert.strictEqual(obj["locStr1"].owner, obj, "locStr1 owner is correct");
  obj["locStr1"].setLocaleText("", "val1", "locStr1 set value");
  assert.equal(obj["locStr1"].getLocaleText(""), "val1", "locStr1 get value");

  assert.ok(obj["locStrName"], "locStrName exists");
  assert.strictEqual(obj["locStrName"].owner, obj, "locStrName owner is correct");
  obj["locStrName"].setLocaleText("", "val2", "locStrName set value");
  assert.equal(obj["locStrName"].getLocaleText(""), "val2", "locStrName get value");
  assert.equal(obj.str2, "val2", "str2 get value");

  assert.ok(obj["locStr3"], "locStr3 exists");
  assert.strictEqual(obj["locStr3"].owner, obj, "locStr3 owner is correct");
  assert.equal(obj.str3, "Complete", "get default value from localizable strings");
  obj["locStr3"].setLocaleText("", "val3", "locStr3 set value");
  assert.equal(obj["locStr3"].getLocaleText(""), "val3", "locStr3 get value");
  assert.equal(obj.str3, "val3", "str3 get value");
  obj.locale = "";
});
QUnit.test("Check Declared @property localizable string defaultStr", function (assert) {
  const obj = new TestDeclaredProps();
  assert.ok(obj["locStr3"], "locStr3 exists");
  assert.strictEqual(obj["locStr3"].owner, obj, "locStr3 owner is correct");
  assert.equal(obj["locStr3"].renderedHtml, "Complete", "get renderedHtml for loc string from default string");
  obj["locStr3"].setLocaleText("", "val3", "locStr3 set value");
  assert.equal(obj["locStr3"].renderedHtml, "val3", "get renderedHtml for loc string from changed default string");
  obj.locale = "";
});
QUnit.test("TextValidator, serialize allowDigits property", function (assert) {
  const validator = new TextValidator();
  assert.deepEqual(validator.toJSON(), {}, "validator is empty");
  validator.allowDigits = false;
  assert.deepEqual(validator.toJSON(), { allowDigits: false }, "allowDigits is false");
  validator.allowDigits = true;
  assert.deepEqual(validator.toJSON(), {}, "validator is empty again");
  validator.minLength = 1;
  validator.maxLength = 10;
  assert.deepEqual(validator.toJSON(), { minLength: 1, maxLength: 10 }, "minLength and maxLenght are not null");
});
QUnit.test("Change question isRequired default value", function (assert) {
  assert.equal(new Question("q1").isRequired, false, "It is false by defult");
  Serializer.findProperty("question", "isRequired").defaultValue = true;
  assert.equal(new Question("q1").isRequired, true, "It is true now");
  Serializer.findProperty("question", "isRequired").defaultValue = false;
  assert.equal(new Question("q1").isRequired, false, "It is false again");
});
QUnit.test("Change question readOnly default value", function (assert) {
  assert.equal(new Question("q1").readOnly, false, "It is false by defult");
  Serializer.findProperty("question", "readOnly").defaultValue = true;
  assert.equal(new Question("q1").readOnly, true, "It is true now");
  assert.deepEqual(new Question("q1").toJSON(), { name: "q1" }, "no readOnly attribute in JSON, #1");
  Serializer.findProperty("question", "readOnly").defaultValue = false;
  assert.equal(new Question("q1").readOnly, false, "It is false again");
  assert.deepEqual(new Question("q1").toJSON(), { name: "q1" }, "no readOnly attribute in JSON, #2");
});
QUnit.test("Load localizable @property", function (assert) {
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
  assert.equal(obj.str1, "str1 en", "default string");
  assert.equal(obj.strProp, "strProp en", "default string");
  assert.equal(obj["locStr1"].renderedHtml, "str1 en", "default html string");
  obj.locale = "da";
  assert.equal(obj.str1, "str1 da", "da string");
  assert.equal(obj.strProp, "strProp da", "da string");
  assert.equal(obj["locStr1"].renderedHtml, "str1 da", "da html string");
  Serializer.removeClass("new_declared_props");
});
QUnit.test("Load localizable @property with undefined creator", function (assert) {
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
  assert.equal(obj.str1, "str1 en", "default string");
  assert.equal(obj.strProp, "strProp en", "default string");
  assert.equal(obj["locStr1"].renderedHtml, "str1 en", "default html string");
  obj.locale = "da";
  assert.equal(obj.str1, "str1 da", "da string");
  assert.equal(obj.strProp, "strProp da", "da string");
  assert.equal(obj["locStr1"].renderedHtml, "str1 da", "da html string");
  Serializer.removeClass("new_declared_props");
});
QUnit.test("Get default value for custom localizable @property from global localized strings", function (assert) {
  Serializer.addProperty("car", {
    name: "strWithDefaultValue",
    serializationProperty: "locStrWithDefaultValue",
  });
  const obj = new Car();
  assert.notOk(obj["strWithDefaultValue"], "It is empty by default");
  englishStrings["strWithDefaultValue"] = "default value";
  assert.equal(obj["strWithDefaultValue"], "default value", "get value from localization strings");
  delete englishStrings["strWithDefaultValue"];
  Serializer.removeProperty("car", "strWithDefaultValue");
});

QUnit.test("override defaultValue of @property", function (assert) {
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
  assert.equal(obj.numberProp, 10);
});

QUnit.test("Creator custom ItemValue class, and a property an array of custom ItemValue + default value ", function (assert) {
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
  assert.equal(car.colors.length, 2, "There are two colors by default");
  assert.equal(car.colors[0].value, "A1", "value set correctly #1");
  assert.equal(car.colors[1].color, "#00ff00", "color set correctly #2");
  assert.deepEqual(car.toJSON(), {}, "toJSON. It should be empty #3");
  car.colors.splice(0, 1);
  const newItem = new ItemValue("A3", undefined, "coloritemvalue");
  newItem.color = "#ffffff";
  car.colors.push(newItem);
  assert.deepEqual(car.toJSON(), { colors: [{ value: "A2", color: "#00ff00" }, { value: "A3", color: "#ffffff" }] }, "toJSON #4");
  car.fromJSON({
    colors: [
      { value: "B1", color: "-ff0000" },
      { value: "B2", color: "-00ff00" },
      { value: "B3", color: "-ffffff" }]
  });
  assert.equal(car.colors.length, 3, "There are three colors loaded #5");
  assert.equal(car.colors[0].value, "B1", "value set correctly #6");
  assert.equal(car.colors[2].color, "-ffffff", "color set correctly #7");

  Serializer.removeProperty("car", "colors");
  Serializer.removeClass("coloritemvalue");
});
QUnit.test("Add condition custom property", function (assert) {
  const newProp = Serializer.addProperty("matrix", {
    name: "showHeaderIf:condition", category: "logic",
    onExecuteExpression: (obj: Base, res: any) => { (<any>obj).showHeader = res === true; }
  });
  assert.ok(newProp.onExecuteExpression, "onExecuteExpression function is set");
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
  assert.equal(matrix.showHeader, true, "Header is visible");
  matrix.showHeaderIf = "{val1} = 1";
  assert.equal(matrix.showHeader, false, "Header is invisible #1");
  survey.setValue("val1", 2);
  assert.equal(matrix.showHeader, false, "Header is invisible #2");
  survey.setValue("val1", 1);
  assert.equal(matrix.showHeader, true, "Header is visible #3");
  survey.setValue("val1", 3);
  assert.equal(matrix.showHeader, false, "Header is invisible #4");
  Serializer.removeProperty("matrix", "showHeaderIf");
});
QUnit.test("Add condition custom property into survey", function (assert) {
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
  assert.equal(survey.showTitle, false, "It is false by default");
  survey.setValue("q1", 1);
  assert.equal(survey.showTitle, true, "It is shown");
  survey.setValue("q1", 2);
  assert.equal(survey.showTitle, false, "It is hidden again");
  Serializer.removeProperty("survey", "showTitleIf");
});
QUnit.test("base.isDescendantOf", function (assert) {
  const big = new BigCar();
  const dealer = <Dealer>Serializer.createClass("customdealer");
  assert.equal(big.isDescendantOf("car"), true, "big->car");
  assert.equal(big.isDescendantOf("big"), true, "big->big");
  assert.equal(big.isDescendantOf("dealer"), false, "big->dealer");
  assert.equal(dealer.isDescendantOf("customdealer"), true, "customdealer->customdealer");
  assert.equal(dealer.isDescendantOf("dealer"), true, "customdealer->dealer");
  assert.equal(dealer.isDescendantOf("car"), false, "customdealer->car");
});
QUnit.test("Add custom calculatedValues property into survey, isArray attribute", function (assert) {
  const prop = Serializer.addProperty("survey", {
    name: "customFunctions:calculatedvalues",
    className: "calculatedvalue",
    isArray: true
  });
  assert.equal(prop.isArray, true, "Custom property is array");
  const survey = new SurveyModel();
  let funcs = <Array<CalculatedValue>>survey.customFunctions;
  assert.equal(funcs.length, 0, "It is false by default");
  const func = new CalculatedValue("func1", "testFunc");
  funcs.push(func);
  assert.equal(funcs.length, 1, "It is false by default");
  const json = survey.toJSON();
  const expectedJson = { customFunctions: [{ name: "func1", expression: "testFunc" }] };
  assert.deepEqual(json, expectedJson, "Serialized successful");
  const survey2 = new SurveyModel();
  survey2.fromJSON(json);
  funcs = <Array<CalculatedValue>>survey2.customFunctions;
  assert.equal(funcs.length, 1, "Deserialized one item");
  assert.equal(funcs[0].name, "func1", "Deserialized item name");
  assert.equal(funcs[0].expression, "testFunc", "Deserialized item expression");
  assert.equal(funcs[0].getType(), "calculatedvalue", "Deserialized item has correct type");
  Serializer.removeProperty("survey", "customFunctions");
});
QUnit.test("Store column title in json if it equals to name, but it was set manually", function (assert) {
  const matrix = new QuestionMatrixDynamicModel("q1");
  const column = matrix.addColumn("col1");
  assert.deepEqual(matrix.toJSON(), { name: "q1", columns: [{ name: "col1" }] }, "title is empty");
  column.title = "Col1";
  assert.deepEqual(matrix.toJSON(), { name: "q1", columns: [{ name: "col1", title: "Col1" }] }, "title is not equal to name");
  column.title = "";
  assert.deepEqual(matrix.toJSON(), { name: "q1", columns: [{ name: "col1" }] }, "title is empty, #2");
  column.title = "col1";
  assert.deepEqual(matrix.toJSON(), { name: "q1", columns: [{ name: "col1", title: "col1" }] }, "title is equal to name");
});
QUnit.test("Store question title in json if it equals to name, but it was set manually", function (assert) {
  const question = new Question("q1");
  assert.deepEqual(question.toJSON(), { name: "q1" }, "title is empty");
  question.title = "Q1";
  assert.deepEqual(question.toJSON(), { name: "q1", title: "Q1" }, "title is not equal to name");
  question.title = "";
  assert.deepEqual(question.toJSON(), { name: "q1" }, "title is empty, #2");
  question.title = "q1";
  assert.deepEqual(question.toJSON(), { name: "q1", title: "q1" }, "title is equal to name");
});
QUnit.test("One property - array to not array", function (assert) {
  var dealer = new Dealer();
  dealer.name = "4";
  new JsonObject().toObject({ name: ["small"] }, dealer);
  assert.equal(dealer.name, "4", "deserialize property for different types");
});
QUnit.test("Find out are properties addingin in addClass are custom or not", function (assert) {
  Serializer.addClass("testcar", ["name"]);
  assert.equal(Serializer.findProperty("testcar", "name").isCustom, true, "testcar properties are custom");
  assert.equal(Serializer.findProperty("car", "name").isCustom, false, "car properties are not custom");
});
QUnit.test("Custom survey serialization, onSerializingProperty", function (assert) {
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
    assert.deepEqual(survey.toJSON(), expectedJSON, "Failed attempt: " + attempt);
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
QUnit.test("return correct uniquePropertyName", function (assert) {
  const rowsMatrixDropdownProp = Serializer.findProperty("matrixdropdown", "rows");
  assert.equal(rowsMatrixDropdownProp.uniquePropertyName, "value", "matrixdropdown.rows");
  const rowsMatrixProp = Serializer.findProperty("matrix", "rows");
  assert.equal(rowsMatrixProp.uniquePropertyName, "value", "matrix.rows");
  const columnsMatrixProp = Serializer.findProperty("matrix", "columns");
  assert.equal(columnsMatrixProp.uniquePropertyName, "value", "matrix.columns");
});
QUnit.test("default value inheritance", function (assert) {
  const checkboxProp = Serializer.findProperty("checkbox", "itemComponent");
  const rankingProp = Serializer.findProperty("ranking", "itemComponent");
  assert.equal(checkboxProp.defaultValue, "survey-checkbox-item", "survey-checkbox-item default");
  assert.equal(rankingProp.defaultValue, "sv-ranking-item", "ranking default is empty");
});
QUnit.test("Do not load choices and rows without value", function (assert) {
  const q = new QuestionCheckboxModel("q1");
  q.fromJSON({
    name: "q2",
    choices: [1, { value: 2 }, { text: "abc" }]
  });
  assert.equal(q.choices.length, 3,);
  assert.equal(q.choices[0].value, 1, "First choice");
  assert.equal(q.choices[1].value, 2, "Second choice");
  assert.equal(q.choices[2].value, "abc", "Third choice");
});
QUnit.test("QuestionMatrixModel and commentText property, Bug#5562", function (assert) {
  const q = new QuestionMatrixModel("q1");
  const prop = Serializer.findProperty(q.getType(), "commentText");
  assert.ok(prop, "Property is here");
  assert.equal(prop.isVisible("row", q), false, "commentText is invisible by default");
  q.showCommentArea = true;
  assert.equal(prop.isVisible("row", q), true, "commentText is visible now");
  const survey = new SurveyModel({
    elements: [{ type: "matrix", name: "q1", commentText: "comment_text" }]
  });
  assert.equal(survey.getQuestionByName("q1").commentText, "comment_text", "Loaded correctly");
});
QUnit.test("QuestionMatrixModel and commentPlaceholder property, Bug#5569", function (assert) {
  const q = new QuestionMatrixModel("q1");
  const prop = Serializer.findProperty(q.getType(), "commentPlaceholder");
  assert.ok(prop, "Property is here");
  assert.equal(prop.isVisible("row", q), false, "commentPlaceholder is invisible by default");
  q.showCommentArea = true;
  assert.equal(prop.isVisible("row", q), true, "commentPlaceholder is visible now");
  const survey = new SurveyModel({
    elements: [{ type: "matrix", name: "q1", commentPlaceholder: "comment_text" }]
  });
  assert.equal(survey.getQuestionByName("q1").commentPlaceholder, "comment_text", "Loaded correctly");
});
QUnit.test("Add defaultFunc attribute support, Bug#5615", function (assert) {
  const obj = new DefaultValueClassObj();
  assert.equal(obj.prop1, 5, "The default value is 5");
  defaultValueForProp1 = 7;
  assert.equal(obj.prop1, 7, "The default value is 7 now");
});
QUnit.test("QuestionHtmlModel", function (assert) {
  let html = new QuestionHtmlModel("q1");
  assert.equal(html.renderAs, "default", "default is default");
  Serializer.addProperty("html", { name: "renderAs", default: "auto", choices: ["auto", "standard", "image"] });
  html = new QuestionHtmlModel("q1");
  assert.equal(html.renderAs, "auto", "default is auto");
  Serializer.removeProperty("html", "renderAs");
});
QUnit.test("Ignore type for typed array elements", function (assert) {
  const survey = new SurveyModel({
    "completedHtmlOnCondition": [{
      "type": "runexpression",
      "expression": "{question1} = 'item1'",
      "html": "custom text"
    }]
  });
  const htmls = survey.completedHtmlOnCondition;
  assert.equal(htmls.length, 1, "completedHtmlOnCondition is loaded");
  assert.equal(htmls[0].getType(), "htmlconditionitem", "It has corrected type");
});
QUnit.test("ImageItemValue get imageLink property", function (assert) {
  const prop = new ImageItemValue("val1").getPropertyByName("imageLink");
  assert.ok(prop, "property is return correctly");
  assert.equal(new ImageItemValue("val1").locImageLink.disableLocalization, false, "image link is localizable");
  prop.isLocalizable = false;
  assert.equal(new ImageItemValue("val1").locImageLink.disableLocalization, true, "image link is not localizable");
  prop.isLocalizable = true;
});
QUnit.test("overridingProperty test", function (assert) {
  assert.equal(Serializer.findProperty("question", "visible").overridingProperty, "visibleIf", "visible property check");
  assert.equal(Serializer.findProperty("question", "readOnly").overridingProperty, "enableIf", "readOnly property check");
  assert.equal(Serializer.findProperty("question", "isRequired").overridingProperty, "requiredIf", "isRequired property check");
});
QUnit.test("multipletextitem, name property should be required and unique", function (assert) {
  const prop = Serializer.findProperty("multipletextitem", "name");
  assert.equal(prop.isRequired, true, "name property is required");
  assert.equal(prop.isUnique, true, "name property is unique");
});
QUnit.test("load matrix column, visible property", function (assert) {
  const matrix = new QuestionMatrixDynamicModel("q1");
  const column = matrix.addColumn("col1");
  assert.equal(column.visible, true, "It is visible by default");
  column.fromJSON({ title: "column1", visible: false });
  assert.equal(column.title, "column1", "set column title correctly");
  assert.equal(column.visible, false, "column.visible is false");
});
QUnit.test("defaultValue for matrix rowTitleWidth and columnMinWidth properties", function (assert) {
  Serializer.findProperty("matrix", "rowTitleWidth").defaultValue = "110px";
  Serializer.findProperty("matrix", "columnMinWidth").defaultValue = "220px";
  const matrix = new QuestionMatrixModel("q1");
  assert.equal(matrix.rowTitleWidth, "110px", "rowTitleWidth");
  assert.equal(matrix.columnMinWidth, "220px", "columnMinWidth");
  Serializer.findProperty("matrix", "rowTitleWidth").defaultValue = undefined;
  Serializer.findProperty("matrix", "columnMinWidth").defaultValue = undefined;
});

QUnit.test("Check that .toJSON returns clean structure for all question types", function (assert) {
  const name = "q";
  const etalon = { name };
  const classes = Serializer["classes"];

  for (const prop in classes) {
    const cls = classes[prop];
    const qModel: any = Serializer.createClass(cls.name);
    if (!!qModel) {
      qModel.name = name;
      if (qModel.isQuestion && qModel.getType() === cls.name) {
        assert.deepEqual(qModel.toJSON(), etalon, `JSON for ${cls.name} is clean`);
      }
    }
  }
});
QUnit.test("Add a quesition into page elements array", function (assert) {
  const prop = Serializer.findProperty("page", "elements");
  assert.equal(prop.isArray, true, "Elements is an array");
  const survey = new SurveyModel({
    pages: [
      {
        elements: { type: "text", name: "q1" }
      }
    ]
  });
  assert.equal(survey.pages.length, 1, "There is one page");
  assert.equal(survey.pages[0].elements.length, 1, "There is one element in the page");
  assert.equal(survey.pages[0].elements[0].name, "q1", "Element has a correct name");
  assert.equal(survey.jsonErrors.length, 1, "There is a JSON error");
  assert.equal((<any>survey.jsonErrors[0]).propertyName, "elements", "Correct property name");
});
QUnit.test("Add a quesition into survey questions array", function (assert) {
  const prop = Serializer.findProperty("survey", "elements");
  assert.equal(prop.isArray, true, "Elements is an array");
  const survey = new SurveyModel({
    questions: { type: "text", name: "q1" }
  });
  assert.equal(survey.pages.length, 1, "There is one page");
  assert.equal(survey.pages[0].elements.length, 1, "There is one element in the page");
  assert.equal(survey.pages[0].elements[0].name, "q1", "Element has a correct name");
  assert.equal(survey.jsonErrors.length, 1, "There is a JSON error");
  assert.equal((<any>survey.jsonErrors[0]).propertyName, "questions", "Correct property name");
});
QUnit.test("Add a page into survey pages array", function (assert) {
  const prop = Serializer.findProperty("survey", "pages");
  assert.equal(prop.isArray, true, "Elements is an array");
  const survey = new SurveyModel({
    pages: { questions: { type: "text", name: "q1" } }
  });
  assert.equal(survey.pages.length, 1, "There is one page");
  assert.equal(survey.pages[0].elements.length, 1, "There is one element in the page");
  assert.equal(survey.pages[0].elements[0].name, "q1", "Element has a correct name");
  assert.equal(survey.jsonErrors.length, 2, "There are JSONs error");
  assert.equal((<any>survey.jsonErrors[0]).propertyName, "pages", "Correct property name #1");
  assert.equal((<any>survey.jsonErrors[1]).propertyName, "questions", "Correct property name #2");
});
QUnit.test("selectbase colCount property default value", function (assert) {
  const q = new QuestionCheckboxModel("q");
  assert.equal(q.colCount, 1, "Default value is 1");
  const prop = Serializer.findProperty("checkboxbase", "colCount");
  const defaultVal = prop.defaultValue;
  prop.defaultValue = 0;
  assert.equal(q.colCount, 0, "Default value is 0");
  prop.defaultValue = 2;
  assert.equal(q.colCount, 2, "Default value is 2");
  prop.defaultValue = defaultVal;
  assert.equal(q.colCount, 1, "Default value is 1 again");
});
QUnit.test("Validated property values", function (assert) {
  const survey = new SurveyModel();
  survey.fromJSON({
    clearInvisibleValues: "abc",
    elements: [
      { type: "text", name: "q1", textUpdateMode: "edf" }
    ]
  }, { validatePropertyValues: true });
  assert.equal(survey.getAllQuestions().length, 1, "We have one question loaded");
  assert.equal(survey.jsonErrors.length, 2, "There are two errors");
  assert.equal(survey.jsonErrors[0].message, "The property value: 'abc' is incorrect for property 'clearInvisibleValues'.", "errors[0].message");
  assert.equal(survey.jsonErrors[0].element.getType(), "survey", "errors[0].element");
  assert.equal(survey.jsonErrors[1].message, "The property value: 'edf' is incorrect for property 'textUpdateMode'.", "errors[1].message");
  assert.equal(survey.jsonErrors[1].element.getType(), "text", "errors[1].element");
});
QUnit.test("getRequiredProperties", function (assert) {
  let requiedValues = Serializer.getRequiredProperties("text");
  assert.deepEqual(requiedValues, ["name"], "required #1");
  Serializer.findProperty("question", "title").isRequired = true;
  requiedValues = Serializer.getRequiredProperties("text");
  assert.deepEqual(requiedValues, ["name", "title"], "required #2");
  Serializer.findProperty("question", "title").isRequired = false;
  requiedValues = Serializer.getRequiredProperties("text");
  assert.deepEqual(requiedValues, ["name"], "required #3");
});
QUnit.test("Create localizable property with default value", function (assert) {
  Serializer.addProperty("question", { name: "customProp:text", isLocalizable: true, default: "Question text" });
  Serializer.addProperty("page", { name: "customProp:text", isLocalizable: true, default: "Page text" });
  const question = new Question("q1");
  const page = new PageModel("page1");
  assert.equal(question["customProp"], "Question text", "Question prop #1");
  assert.equal(page["customProp"], "Page text", "Page prop #1");
  assert.equal(question.getPropertyValue("customProp"), "Question text", "Question getPropertyValue #1");
  assert.equal(page.getPropertyValue("customProp"), "Page text", "Page getPropertyValue #1");

  question["customProp"] = "Set question val";
  page["customProp"] = "Set page val";
  assert.equal(question["customProp"], "Set question val", "Question prop #2");
  assert.equal(page["customProp"], "Set page val", "Page prop #2");
  assert.equal(question.getPropertyValue("customProp"), "Set question val", "Question getPropertyValue #2");
  assert.equal(page.getPropertyValue("customProp"), "Set page val", "Page getPropertyValue #2");

  question.resetPropertyValue("customProp");
  page.resetPropertyValue("customProp");
  assert.equal(question["customProp"], "Question text", "Question prop #3");
  assert.equal(page["customProp"], "Page text", "Page prop #3");
  assert.equal(question.getPropertyValue("customProp"), "Question text", "Question getPropertyValue #3");
  assert.equal(page.getPropertyValue("customProp"), "Page text", "Page getPropertyValue #3");

  Serializer.removeProperty("question", "customProp");
  Serializer.removeProperty("page", "customProp");
});
QUnit.test("Check existing pos", function (assert) {
  Serializer.addProperty("question", { name: "testProperty", default: { someProperty: "default" } });
  const question = new QuestionTextModel("q1");
  question.fromJSON({ pos: { start: 1, end: 5 }, type: "text", name: "question1", testProperty: { someProperty: "bbb", pos: { start: 10, end: 15 } } });
  const json = question.toJSON();
  assert.deepEqual(json, { name: "question1", testProperty: { someProperty: "bbb" } }, "no pos in json");
  Serializer.removeProperty("question", "testProperty");
});
QUnit.test("Versions in property", function (assert) {
  const prop = Serializer.addProperty("question", { name: "testProperty", version: "1.9.127" });
  assert.equal(prop.version, "1.9.127", "version is set correclty");
  assert.equal(prop.isAvailableInVersion("1.9.5"), false, "#1");
  assert.equal(prop.isAvailableInVersion("1.9.200"), true, "#2");
  assert.equal(prop.isAvailableInVersion("2"), true, "#3");
  assert.equal(prop.isAvailableInVersion("1"), false, "#4");
  assert.equal(prop.isAvailableInVersion("1.9.127"), true, "#5");
  assert.equal(prop.isAvailableInVersion("1.9.126"), false, "#6");
  assert.equal(prop.isAvailableInVersion("1.9.128"), true, "#7");
  assert.equal(prop.isAvailableInVersion(""), true, "#8");
  Serializer.removeProperty("question", "testProperty");
});
QUnit.test("Versions in new property serialization", function (assert) {
  Serializer.addProperty("question", { name: "testProperty", version: "1.9.127" });
  const question = new QuestionTextModel("q1");
  question.testProperty = "abc";
  assert.deepEqual(question.toJSON(), { name: "q1", testProperty: "abc" }, "#1");
  assert.deepEqual(question.toJSON({ version: "1.9.127" }), { name: "q1", testProperty: "abc" }, "#2");
  assert.deepEqual(question.toJSON({ version: "1.9.126" }), { name: "q1" }, "#3");
  Serializer.removeProperty("question", "testProperty");
});
QUnit.test("Versions & alternative name", function (assert) {
  const prop = Serializer.addProperty("question", { name: "testProperty", version: "1.9.127", alternativeName: "testProp" });

  assert.equal(prop.isAvailableInVersion("1.9.5"), true, "isAvailableInVersion: #1");
  assert.equal(prop.isAvailableInVersion("1.9.200"), true, "isAvailableInVersion: #2");
  assert.equal(prop.isAvailableInVersion(""), true, "isAvailableInVersion: #3");
  assert.equal(prop.getSerializedName("1.9.5"), "testProp", "getSerializedName: #1");
  assert.equal(prop.getSerializedName("1.9.200"), "testProperty", "getSerializedName: #2");
  assert.equal(prop.getSerializedName(""), "testProperty", "getSerializedName: #3");

  const question = new QuestionTextModel("q1");
  question.testProperty = "abc";
  assert.deepEqual(question.toJSON(), { name: "q1", testProperty: "abc" }, "#1");
  assert.deepEqual(question.toJSON({ version: "1.9.127" }), { name: "q1", testProperty: "abc" }, "#2");
  assert.deepEqual(question.toJSON({ version: "1.9.128" }), { name: "q1", testProperty: "abc" }, "#3");
  assert.deepEqual(question.toJSON({ version: "1.9.126" }), { name: "q1", testProp: "abc" }, "#4");
  assert.deepEqual(question.toJSON({ version: "1" }), { name: "q1", testProp: "abc" }, "#5");
  Serializer.removeProperty("question", "testProperty");
});
QUnit.test("Test showInMultipleColumns prop visibility", function (assert) {
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
  assert.ok(prop, "property is here");
  assert.equal(prop.isVisible("", column), true, "column is visible");
});
QUnit.test("displayName, empty string", function (assert) {
  const prop1 = Serializer.addProperty("question", { name: "testProperty1", displayName: "" });
  const prop2 = Serializer.addProperty("question", { name: "testProperty2", displayName: undefined });
  const prop3 = Serializer.addProperty("question", { name: "testProperty3" });

  assert.strictEqual(prop1.displayName, "", "prop1");
  assert.strictEqual(prop2.displayName, undefined, "prop2");
  assert.strictEqual(prop3.displayName, undefined, "prop3");

  Serializer.removeProperty("question", "testProperty1");
  Serializer.removeProperty("question", "testProperty2");
  Serializer.removeProperty("question", "testProperty3");
});
QUnit.test("enableIf", function (assert) {
  const prop1 = Serializer.addProperty("question", { name: "testProperty1", readOnly: true });
  const prop2 = Serializer.addProperty("question", { name: "testProperty2", enableIf: (obj) => { return obj.title === "abc"; } });
  const prop3 = Serializer.addProperty("question", { name: "testProperty3" });
  const prop4 = Serializer.addProperty("question", { name: "testProperty4", readOnly: true, enableIf: (obj) => { return true; } });

  const q = new Question("q1");

  assert.notOk(prop1.enableIf, "prop1.enableIf");
  assert.equal(prop1.isEnable(null), false, "prop1 #1");
  assert.equal(prop1.isEnable(q), false, "prop1 #2");

  assert.ok(prop2.enableIf, "prop2.enableIf");
  assert.equal(prop2.isEnable(null), true, "prop2 #1");
  assert.equal(prop2.isEnable(q), false, "prop2 #2");
  q.title = "abc";
  assert.equal(prop2.isEnable(q), true, "prop2 #3");

  assert.notOk(prop3.enableIf, "prop3.enableIf");
  assert.equal(prop3.isEnable(null), true, "prop3 #1");
  assert.equal(prop3.isEnable(q), true, "prop3 #2");

  assert.ok(prop4.enableIf, "prop4.enableIf");
  assert.equal(prop4.isEnable(null), false, "prop4 #1");
  assert.equal(prop4.isEnable(q), false, "prop4 #2");

  Serializer.removeProperty("question", "testProperty1");
  Serializer.removeProperty("question", "testProperty2");
  Serializer.removeProperty("question", "testProperty3");
  Serializer.removeProperty("question", "testProperty4");
});
QUnit.test("circular dependsOn, #8624", function (assert) {
  const prop1 = Serializer.addProperty("question", { name: "testProperty1" });
  Serializer.addProperty("question", { name: "testProperty2", dependsOn: "testProperty1" });
  prop1.dependsOn = ["testProperty2"];

  const q: any = new Question("q1");
  q.fromJSON({
    testProperty1: "abc",
    testProperty2: "edf"
  });
  assert.equal(q.testProperty1, "abc", "testProperty1 value");
  assert.equal(q.testProperty2, "edf", "testProperty2 value");

  Serializer.removeProperty("question", "testProperty1");
  Serializer.removeProperty("question", "testProperty2");
});
QUnit.test("Do fire JS unhandled exception on loading empty objects, Bug#8702", function (assert) {
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
  assert.ok(q5, "#1");
});
QUnit.test("circular dependsOn, #8885", function (assert) {
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
  assert.equal(q1.prop1, true, "text question");
  assert.equal(q2.columns[0].prop1, true, "columns[0]");
  assert.equal(q2.columns[1].prop1, false, "columns[1]");
  assert.equal(q2.columns[2].prop1, true, "columns[2]");
  assert.notEqual(onSetValueObjType, q2.columns[0].getType(), "object is not a column in onSetValue");
  assert.notEqual(onSettingValueObjType, q2.columns[0].getType(), "object is not a column in onSettingValue");
  assert.notEqual(onGetValueObjType, q2.columns[0].getType(), "object is not a column in onGetValueObjType");
  Serializer.removeProperty("question", "prop1");
});
QUnit.test("Add availableInMatrixColumn attribute", function (assert) {
  const prop1 = Serializer.addProperty("question", { name: "prop1", availableInMatrixColumn: true });
  const prop2 = Serializer.addProperty("question", { name: "prop2", availableInMatrixColumn: false });
  const prop3 = Serializer.addProperty("question", { name: "prop3" });

  assert.equal(prop1.availableInMatrixColumn, true, "prop1");
  assert.equal(prop2.availableInMatrixColumn, undefined, "prop2");
  assert.equal(prop3.availableInMatrixColumn, undefined, "prop3");

  Serializer.removeProperty("question", "prop1");
  Serializer.removeProperty("question", "prop2");
  Serializer.removeProperty("question", "prop3");
});
QUnit.test("Add defaultFunc attribute based on another property & obj parameter, Bug#9108", function (assert) {
  Serializer.addProperty("question", { name: "secondName", defaultFunc: (obj: any) => { return obj.name + "_second"; } });
  const obj: any = new QuestionTextModel("q1");
  assert.equal(obj.secondName, "q1_second", "secondName #1");
  obj.name = "q2";
  assert.equal(obj.secondName, "q2_second", "secondName #2");
  assert.deepEqual(obj.toJSON(), { name: "q2" }, "toJSON #1");

  obj.secondName = "q3_s";
  assert.equal(obj.secondName, "q3_s", "secondName #3");
  assert.deepEqual(obj.toJSON(), { name: "q2", secondName: "q3_s" }, "toJSON #2");

  obj.resetPropertyValue("secondName");
  assert.equal(obj.secondName, "q2_second", "secondName #4");
  assert.deepEqual(obj.toJSON(), { name: "q2" }, "toJSON #3");

  Serializer.removeProperty("question", "secondName");
});
QUnit.test("Page & Panel should have different title&description properties", function (assert) {
  const pageTitle = Serializer.findProperty("page", "title");
  const pageDescription = Serializer.findProperty("page", "description");
  const panelTitle = Serializer.findProperty("panel", "title");
  const panelDescription = Serializer.findProperty("panel", "description");
  pageTitle.placeholder = "pageT";
  pageDescription.placeholder = "pageD";
  panelTitle.placeholder = "panelT";
  panelDescription.placeholder = "panelD";
  assert.equal(pageTitle.placeholder, "pageT", "page title unique");
  assert.equal(pageDescription.placeholder, "pageD", "page description unique");
  assert.equal(panelTitle.placeholder, "panelT", "panel title unique");
  assert.equal(panelDescription.placeholder, "panelD", "panel description unique");
});
QUnit.test("property showMode -> displayMode, #9291", function (assert) {
  const prop1 = Serializer.addProperty("question", { name: "prop1", showMode: "form" });
  const prop2 = Serializer.addProperty("question", { name: "prop2", locationInTable: "detail" });
  const prop3 = Serializer.addProperty("question", { name: "prop3" });
  const prop4 = Serializer.addProperty("question", { name: "prop4", showMode: "list" });
  const prop5 = Serializer.addProperty("question", { name: "prop5", locationInTable: "column" });
  const prop6 = Serializer.addProperty("question", { name: "prop6", locationInTable: "both" });

  assert.equal(prop1.showMode, "form", "prop1.showMode");
  assert.equal(prop1.locationInTable, "detail", "prop1.locationInTable");
  assert.equal(prop2.showMode, "form", "prop2.showMode");
  assert.equal(prop2.locationInTable, "detail", "prop2.locationInTable");
  assert.equal(prop3.showMode, "", "prop3.showMode");
  assert.equal(prop3.locationInTable, "both", "prop3.locationInTable");
  assert.equal(prop4.showMode, "list", "prop4.showMode");
  assert.equal(prop4.locationInTable, "column", "prop4.locationInTable");
  assert.equal(prop5.showMode, "list", "prop5.showMode");
  assert.equal(prop5.locationInTable, "column", "prop5.locationInTable");
  assert.equal(prop6.showMode, "", "prop6.showMode");
  assert.equal(prop6.locationInTable, "both", "prop6.locationInTable");

  prop1.showMode = "";
  assert.equal(prop1.showMode, "", "prop1.showMode, #2");
  assert.equal(prop1.locationInTable, "both", "prop1.locationInTable, #2");
  prop1.showMode = "list";
  assert.equal(prop1.showMode, "list", "prop1.showMode, #3");
  assert.equal(prop1.locationInTable, "column", "prop1.locationInTable, #3");
  prop1.showMode = "form";
  assert.equal(prop1.showMode, "form", "prop1.showMode, #4");
  assert.equal(prop1.locationInTable, "detail", "prop1.locationInTable, #4");

  prop1.locationInTable = "both";
  assert.equal(prop1.showMode, "", "prop1.showMode, #5");
  assert.equal(prop1.locationInTable, "both", "prop1.locationInTable, #5");
  prop1.locationInTable = "column";
  assert.equal(prop1.showMode, "list", "prop1.showMode, #6");
  assert.equal(prop1.locationInTable, "column", "prop1.locationInTable, #6");
  prop1.locationInTable = "detail";
  assert.equal(prop1.showMode, "form", "prop1.showMode, #7");
  assert.equal(prop1.locationInTable, "detail", "prop1.locationInTable, #7");

  Serializer.removeProperty("question", "prop1");
  Serializer.removeProperty("question", "prop2");
  Serializer.removeProperty("question", "prop3");
  Serializer.removeProperty("question", "prop4");
  Serializer.removeProperty("question", "prop5");
  Serializer.removeProperty("question", "prop6");
});
QUnit.test("property.isSerializabeFunc", function (assert) {
  let ser = true;
  Serializer.addProperty("question", { name: "prop1", isSerializableFunc: (obj) => { return ser; } });
  const q = new Question("q1");
  q.prop1 = "abc";
  assert.deepEqual(q.toJSON(), { name: "q1", prop1: "abc" }, "#1");
  ser = false;
  assert.deepEqual(q.toJSON(), { name: "q1" }, "#2");
  Serializer.removeProperty("question", "prop1");
});