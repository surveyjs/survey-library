import {ILocalizableOwner, LocalizableString} from "../src/localizablestring";
import {JsonObject} from "../src/jsonobject";

export default QUnit.module("LocalizableString");

class LocalizableOwnerTester implements ILocalizableOwner {
    constructor(public locale: string) {}
}

class LocalizableObjectTester {
    private locString: LocalizableString;
    constructor(public owner: ILocalizableOwner) {
        this.locString = new LocalizableString(owner);
    }
    public get locText(): LocalizableString { return this.locString; };
    public get text() { return this.locString.text;}
    public set text(value: string) { this.locString.text = value;}
    public getType(): string { return "locstringtester"; }
}

JsonObject.metaData.addClass("locstringtester", [
    { name: "text", serializationProperty: "locText" }
]);


QUnit.test("Simple get/set tests", function (assert) {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner);
    locString.text = "val1";
    assert.equal(locString.text, "val1", "Check1. use default string");
    assert.equal(locString.getLocaleText(""), "val1", "Check1_2. use default string");
    owner.locale = "en";
    locString.text = "val2";
    assert.equal(locString.text, "val2", "Check2. 'en' locale");
    assert.equal(locString.getLocaleText("en"), "val2", "Check2_2. 'en' locale");
    owner.locale = "fr";
    locString.text = "val3";
    assert.equal(locString.text, "val3", "Check3.  'fr' locale");
    assert.equal(locString.getLocaleText("fr"), "val3", "Check3_2.  'fr' locale");
    owner.locale = "unknown";
    assert.equal(locString.text, "val1", "Check4.  'unknown' locale, use default");
    assert.equal(locString.getLocaleText("unkown"), "", "Check4_2.  'unknown' locale, use default");
    owner.locale = "en";
    assert.equal(locString.text, "val2", "Check5. 'en' locale");
    assert.equal(locString.getLocaleText("en"), "val2", "Check5_2. 'en' locale");    
});

QUnit.test("Test set JSON", function (assert) {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner);
    locString.setJson("val1");
    assert.equal(locString.getLocaleText(""), "val1", "Check1");

    locString.setJson({"default": "val2", "en": "val3"});
    assert.equal(locString.getLocaleText(""), "val2", "Check2");
    assert.equal(locString.getLocaleText("en"), "val3", "Check3");    

    locString.setJson({"fr": "val5", "en": "val4"});
    assert.equal(locString.getLocaleText(""), "", "Check4");
    assert.equal(locString.getLocaleText("en"), "val4", "Check5");    
    assert.equal(locString.getLocaleText("fr"), "val5", "Check6");    
});

QUnit.test("Test get JSON", function (assert) {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner);

    assert.equal(locString.getJson(), null, "There is no values");
    locString.setLocaleText("en", "value1");
    assert.equal(locString.getJson(), "value1", "There is one value");

    var json = {"default": "val2", "en": "val3"};
    locString.setJson(json);
    assert.deepEqual(locString.getJson(), json, "Several values");
});

QUnit.test("Test json deserialization", function (assert) {
    var owner = new LocalizableOwnerTester("");
    var tester = new LocalizableObjectTester(owner);
    new JsonObject().toObject({ "text": {"default": "val2", "en": "val3"} }, tester);
    assert.equal(tester.locText.getLocaleText(""), "val2", "Check1");
    assert.equal(tester.locText.getLocaleText("en"), "val3", "Check2");    
});

QUnit.test("Test json serialization", function (assert) {
    var owner = new LocalizableOwnerTester("");
    var tester = new LocalizableObjectTester(owner);
    tester.text = "val2"
    owner.locale = "en";
    tester.text = "val3";
    var json = new JsonObject().toJsonObject(tester);
    assert.deepEqual(json, { "text": {"default": "val2", "en": "val3"} }, "Serialize object correctly");
});
