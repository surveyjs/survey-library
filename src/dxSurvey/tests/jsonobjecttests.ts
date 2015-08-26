/// <reference path="../sources/jsonobject.ts" />
module dxSurvey.Tests {
    class Car {
        public name: string;
        public getType(): string { return "car"; }
    }
    class SportCar extends Car {
        public maxSpeed: number;
        public getType(): string { return "sport"; }
    }
    class Truck extends Car { 
        public maxWeight: number;
        public getType(): string { return "truck"; }
    }
     
    class Dealer {
        public name: string;
        public unserializedName: string;
        public cars = new Array<Car>();
        public stringArray: Array<string> = [];
        public defaultValue: string;
        public car: Car;
        public truck: Truck;
        public trucks = new Array<Truck>();
        public changeNameOnSet: string;
        public getType(): string { return "dealer"; }
    }

    JsonObject.metaData.addClass("dealer", ["name", "dummyname", "cars", "stringArray", "defaultValue", "car", "truck", "trucks", "changeNameOnSet"]);
    JsonObject.metaData.setPropertyValues("dealer", "defaultValue", null, function (obj: any): any {
        if (obj.defaultValue == "default") return null;
        return obj.defaultValue;
    });
    JsonObject.metaData.setPropertyValues("dealer", "changeNameOnSet", null, null, function (obj: any, value: any) {
        obj.name = value;
    });
    JsonObject.metaData.setPropertyValues("dealer", "truck", "truck");
    JsonObject.metaData.setPropertyValues("dealer", "trucks", "truck");

    JsonObject.metaData.addClass("car", ["name"]);
    JsonObject.metaData.addClass("truck", ["maxWeight"], function () { return new Truck(); }, "car");
    JsonObject.metaData.addClass("sport", ["maxSpeed"], null, "car");
    JsonObject.metaData.setCreator("sport", function () { return new SportCar(); });

    QUnit.module("JsonObject");

    QUnit.test("Metadata for non inherited class", function (assert) {
        assert.equal(JsonObject.metaData.getProperties("dealer").length, 9, "Flat properties list");
        assert.equal(JsonObject.metaData.getProperties("dealer")[0].name, "name", "Name property");
    });
    QUnit.test("Metadata add at the beginning parent class properties ", function (assert) {
        assert.equal(JsonObject.metaData.getProperties("truck").length, 2, "1 + 1 parent propreties");
        assert.equal(JsonObject.metaData.getProperties("truck")[0].name, "name", "parent properties first");
    });
    QUnit.test("One object - one property serialization", function (assert) {
        var dealer = new Dealer();
        dealer.name = "small";
        dealer.unserializedName = "none";
        var jsObj = new dxSurvey.JsonObject().toJsonObject(dealer);
        assert.equal(JSON.stringify(jsObj), "{\"name\":\"small\"}", "serialize just one property");
    });
    QUnit.test("String array serialization", function (assert) {
        var dealer = new Dealer();
        dealer.stringArray = ["one", "two"];
        var jsObj = new dxSurvey.JsonObject().toJsonObject(dealer);
        assert.equal(JSON.stringify(jsObj), "{\"stringArray\":[\"one\",\"two\"]}", "serialize array");
    });
    QUnit.test("Use onGetValue during serialization", function (assert) {
        var dealer = new Dealer();
        dealer.defaultValue = "default";
        var jsObj = new dxSurvey.JsonObject().toJsonObject(dealer);
        assert.equal(JSON.stringify(jsObj), "{}", "default value of this property is not serialized");
        dealer.defaultValue = "nondefault";
        var jsObj = new dxSurvey.JsonObject().toJsonObject(dealer);
        assert.equal(JSON.stringify(jsObj), "{\"defaultValue\":\"nondefault\"}", "serialize non default property as any other");
    });
    QUnit.test("Serialize object with it's type", function (assert) {
        var dealer = new Dealer();
        var truck = new Truck();
        truck.maxWeight = 10000;
        dealer.car = truck;
        var jsObj = new dxSurvey.JsonObject().toJsonObject(dealer);
        assert.equal(JSON.stringify(jsObj), "{\"car\":{\"type\":\"truck\",\"maxWeight\":10000}}", "serialize object with it's type");
    });
    QUnit.test("Serialize arrays with serializable objects", function (assert) {
        var dealer = new Dealer();
        var truck = new Truck();
        truck.maxWeight = 10000;
        var sport = new SportCar();
        sport.maxSpeed = 320;
        dealer.cars = [sport, truck];
        var jsObj = new dxSurvey.JsonObject().toJsonObject(dealer);
        assert.equal(JSON.stringify(jsObj), "{\"cars\":[{\"type\":\"sport\",\"maxSpeed\":320},{\"type\":\"truck\",\"maxWeight\":10000}]}", "serialize objects with their type");
    });
    QUnit.test("Serialize object and get type by it's property", function (assert) {
        var dealer = new Dealer();
        var truck = new Truck();
        dealer.truck = new Truck();
        dealer.truck.maxWeight = 10000;
        var jsObj = new dxSurvey.JsonObject().toJsonObject(dealer);
        assert.equal(JSON.stringify(jsObj), "{\"truck\":{\"maxWeight\":10000}}", "serialize object without it's type");
    });
    QUnit.test("Serialize arrays with serializable objects and get type by it's property", function (assert) {
        var dealer = new Dealer();
        dealer.trucks.push(new Truck());
        dealer.trucks.push(new Truck());
        dealer.trucks[0].maxWeight = 10000;
        dealer.trucks[1].maxWeight = 15000;
        var jsObj = new dxSurvey.JsonObject().toJsonObject(dealer);
        assert.equal(JSON.stringify(jsObj), "{\"trucks\":[{\"maxWeight\":10000},{\"maxWeight\":15000}]}", "serialize objects without their type");
    });

    QUnit.test("One object - one property deserialization", function (assert) {
        var dealer = new Dealer();
        new dxSurvey.JsonObject().toObject({ "name": "small" }, dealer);
        assert.equal(dealer.name, "small", "deserialize just one property");
    });
    QUnit.test("String array deserialization", function (assert) {
        var dealer = new Dealer();
        new dxSurvey.JsonObject().toObject({ "stringArray": ["one", "two"] }, dealer);
        assert.deepEqual(dealer.stringArray, ["one", "two"], "deserialize array");
    });
    QUnit.test("Deserialize object with it's type", function (assert) {
        var dealer = new Dealer();
        new dxSurvey.JsonObject().toObject({ "car": { "type": "truck", "maxWeight": 10000 } }, dealer);
        var truck: any = dealer.car;
        assert.equal(truck.maxWeight, 10000, "deserialize object with it's type");
        assert.equal(truck.getType(), "truck", "the live object");
        assert.notEqual(truck.type, "truck", "type is removed");
    });
    QUnit.test("Deserialize arrays with serializable objects", function (assert) {
        var dealer = new Dealer();
        new dxSurvey.JsonObject().toObject({ "cars": [{ "type": "sport", "maxSpeed": 320 }, { "type": "truck", "maxWeight": 10000 }] }, dealer);
        assert.equal(dealer.cars.length, 2, "two objects in array should be deserialized");
        var sport: any = dealer.cars[0];
        var truck: any = dealer.cars[1];
        assert.equal(sport.maxSpeed, 320, "deserialize the first object");
        assert.equal(sport.getType(), "sport", "deserialize the first object");
        assert.equal(truck.maxWeight, 10000, "deserialize the second object");
        assert.equal(truck.getType(), "truck", "deserialize the second object");
    });
    QUnit.test("Deserialize object and get type by it's property className", function (assert) {
        var dealer = new Dealer();
        new dxSurvey.JsonObject().toObject({ "truck": { "maxWeight": 10000 } }, dealer);
        assert.equal(dealer.truck.maxWeight, 10000, "deserialize object with it's type");
        assert.equal(dealer.truck.getType(), "truck", "the live object");
    });
    QUnit.test("Deserialize arrays with serializable objects and get type by it's property className", function (assert) {
        var dealer = new Dealer();
        new dxSurvey.JsonObject().toObject({ "trucks": [{ "maxWeight": 10000 }, { "maxWeight": 15000 }] }, dealer);
        assert.equal(dealer.trucks.length, 2, "two objects in array should be deserialized");
        assert.equal(dealer.trucks[0].maxWeight, 10000, "deserialize the first object");
        assert.equal(dealer.trucks[0].getType(), "truck", "deserialize the first object");
        assert.equal(dealer.trucks[1].maxWeight, 15000, "deserialize the second object");
        assert.equal(dealer.trucks[1].getType(), "truck", "deserialize the second object");
    });
    QUnit.test("Use on setValue during deserialization", function (assert) {
        var dealer = new Dealer();
        new dxSurvey.JsonObject().toObject({ "changeNameOnSet": "nameIsChanged" }, dealer);
        assert.equal(dealer.name, "nameIsChanged", "the property name is set");
    });
}