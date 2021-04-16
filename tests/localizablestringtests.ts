import {
  ILocalizableOwner,
  LocalizableString,
  LocalizableStrings,
} from "../src/localizablestring";
import { JsonObject, Serializer } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { HashTable } from "../src/helpers";
import { settings } from "../src/settings";

export default QUnit.module("LocalizableString");

class LocalizableOwnerTester implements ILocalizableOwner {
  public values: HashTable<string> = {};
  public static MarkdownText = "it is a markdown";
  constructor(public locale: string) {}
  public getLocale(): string {
    return this.locale;
  }
  public getMarkdownHtml(text: string): string {
    if (text.indexOf("markdown") > -1)
      return LocalizableOwnerTester.MarkdownText;
    return null;
  }
  public getRenderer(name: string): string {
    return undefined;
  }
  public getProcessedText(text: string): string {
    for (var key in this.values) {
      text = text.replace("{" + key + "}", this.values[key]);
    }
    return text;
  }
  public doPropertyValueChangedCallback() {}
}

class LocalizableStringTester extends LocalizableString {
  public onChangedCounter = 0;
  constructor(
    public owner: ILocalizableOwner,
    public useMarkdown: boolean = false
  ) {
    super(owner, useMarkdown);
  }
  public onChanged() {
    super.onChanged();
    this.onChangedCounter++;
  }
}

class LocalizableObjectTester {
  private locString: LocalizableString;
  constructor(public owner: ILocalizableOwner) {
    this.locString = new LocalizableString(owner);
  }
  public get locText(): LocalizableString {
    return this.locString;
  }
  public get text() {
    return this.locString.text;
  }
  public set text(value: string) {
    this.locString.text = value;
  }
  public getType(): string {
    return "locstringtester";
  }
}

Serializer.addClass("locstringtester", [
  { name: "text", serializationProperty: "locText" },
]);

QUnit.test("Simple get/set tests", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var locString = new LocalizableString(owner);
  locString.text = "val1";
  assert.equal(locString.text, "val1", "Check1. use default string");
  assert.equal(
    locString.getLocaleText(""),
    "val1",
    "Check1_2. use default string"
  );
  owner.locale = "en";
  locString.text = "val2";
  assert.equal(locString.text, "val2", "Check2. 'en' locale");
  assert.equal(locString.getLocaleText("en"), "val2", "Check2_2. 'en' locale");
  owner.locale = "fr";
  locString.text = "val3";
  assert.equal(locString.text, "val3", "Check3.  'fr' locale");
  assert.equal(locString.getLocaleText("fr"), "val3", "Check3_2.  'fr' locale");
  owner.locale = "unknown";
  assert.equal(
    locString.text,
    "val1",
    "Check4.  'unknown' locale, use default"
  );
  assert.equal(
    locString.getLocaleText("unkown"),
    "",
    "Check4_2.  'unknown' locale, use default"
  );
  owner.locale = "en";
  assert.equal(locString.text, "val2", "Check5. 'en' locale");
  assert.equal(locString.getLocaleText("en"), "val2", "Check5_2. 'en' locale");
});

QUnit.test("Test set JSON", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var locString = new LocalizableString(owner);
  locString.setJson("val1");
  assert.equal(locString.getLocaleText(""), "val1", "Check1");

  locString.setJson({ default: "val2", en: "val3" });
  assert.equal(locString.getLocaleText(""), "val2", "Check2");
  assert.equal(locString.getLocaleText("en"), "val3", "Check3");

  locString.setJson({ fr: "val5", en: "val4" });
  assert.equal(locString.getLocaleText(""), "", "Check4");
  assert.equal(locString.getLocaleText("en"), "val4", "Check5");
  assert.equal(locString.getLocaleText("fr"), "val5", "Check6");
});

QUnit.test("Test getJson", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var locString = new LocalizableString(owner);

  assert.equal(locString.getJson(), null, "There is no values");
  locString.setLocaleText("en", "value1");
  assert.deepEqual(
    locString.getJson(),
    { en: "value1" },
    "There is one value, but 'en'"
  );

  var json = { default: "val2", en: "val3" };
  locString.setJson(json);
  assert.deepEqual(locString.getJson(), json, "Several values");

  locString.setLocaleText("en", "val2");
  assert.deepEqual(
    locString.getJson(),
    "val2",
    "There is one value again, 'en' was equaled to default"
  );

  locString.setLocaleText("en", "val1");
  assert.deepEqual(
    locString.getJson(),
    { default: "val2", en: "val1" },
    "'en' is different from default now"
  );

  locString.setLocaleText("", "val1");
  assert.deepEqual(
    locString.getJson(),
    "val1",
    "'en' and default are the same"
  );
  settings.serializeLocalizableStringAsObject = true;
  assert.deepEqual(
    locString.getJson(),
    { default: "val1" },
    "LocalizableString.SerializeAsObject = true"
  );
  settings.serializeLocalizableStringAsObject = false;
});

QUnit.test("Test hasNonDefaultText", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var locString = new LocalizableString(owner);

  assert.equal(locString.hasNonDefaultText(), false, "There is no values");
  locString.setLocaleText("en", "value1");
  assert.deepEqual(
    locString.hasNonDefaultText(),
    true,
    "There is one value, but 'en'"
  );

  locString.setJson({ default: "val2", en: "val3" });
  assert.deepEqual(locString.hasNonDefaultText(), true, "Several values");

  locString.setLocaleText("en", "val2");
  assert.deepEqual(
    locString.hasNonDefaultText(),
    false,
    "There is one value again, 'en' was equaled to default"
  );

  locString.setLocaleText("en", "val1");
  assert.deepEqual(
    locString.hasNonDefaultText(),
    true,
    "'en' is different from default now"
  );

  locString.setLocaleText("", "val1");
  assert.deepEqual(
    locString.hasNonDefaultText(),
    false,
    "'en' and default are the same"
  );
});

QUnit.test("Test json deserialization", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var tester = new LocalizableObjectTester(owner);
  new JsonObject().toObject({ text: { default: "val2", en: "val3" } }, tester);
  assert.equal(tester.locText.getLocaleText(""), "val2", "Check1");
  assert.equal(tester.locText.getLocaleText("en"), "val3", "Check2");
});

QUnit.test("Test json serialization", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var tester = new LocalizableObjectTester(owner);
  tester.text = "val2";
  owner.locale = "en";
  tester.text = "val3";
  var json = new JsonObject().toJsonObject(tester);
  assert.deepEqual(
    json,
    { text: { default: "val2", en: "val3" } },
    "Serialize object correctly"
  );
});

QUnit.test("Array<ItemValue> localization", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var items = ItemValue.createArray(owner);
  items.push(new ItemValue("val1", "text1"));
  items.push(new ItemValue("val2"));
  owner.locale = "de";
  items[0].text = "de-text1";
  owner.locale = "fr";
  assert.equal(items[0].calculatedText, "text1", "Check1, use default text");
  assert.equal(items[1].calculatedText, "val2", "Check2, use default value");
  owner.locale = "de";
  items[1].text = "de-text2";
  assert.equal(items[0].calculatedText, "de-text1", "Check3, use 'de' text");
  assert.equal(items[1].calculatedText, "de-text2", "Check4, use 'de' value");
  owner.locale = "";
  assert.equal(items[0].calculatedText, "text1", "Check5, use default text");
  items[0].locText.setLocaleText("", null);
  assert.equal(items[0].calculatedText, "val1", "Check6, use value");
});
QUnit.test("ItemValue.value = 0, #538", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var items = ItemValue.createArray(owner);

  items.push(new ItemValue(0));
  assert.equal(items[0].locText.textOrHtml, "0", "value 0, text should be '0'");
});

QUnit.test("Array<ItemValue> localization serialize", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var items = ItemValue.createArray(owner);
  items.push(new ItemValue("val1", "text1"));
  items.push(new ItemValue("val2"));
  owner.locale = "de";
  items[0].text = "de-text1";
  items[1].text = "de-text2";
  assert.deepEqual(
    ItemValue.getData(items),
    [
      { value: "val1", text: { default: "text1", de: "de-text1" } },
      { value: "val2", text: { de: "de-text2" } },
    ],
    "serialize localization"
  );
  items[1].text = "";
  assert.deepEqual(
    ItemValue.getData(items),
    [{ value: "val1", text: { default: "text1", de: "de-text1" } }, "val2"],
    "serialize localization, with empty text in the second item"
  );
});
QUnit.test("Array<ItemValue> localization deserialize/setData", function(
  assert
) {
  var owner = new LocalizableOwnerTester("");
  var items = ItemValue.createArray(owner);
  var json = [
    {
      value: "val1",
      text: { default: "text1", de: "de-text1", pos: { start: 0, end: 10 } },
    },
    { value: "val2", text: "de-text2" },
  ];
  ItemValue.setData(items, json);
  owner.locale = "fr";
  assert.equal(items[0].calculatedText, "text1", "Check1, use default text");
  assert.equal(
    items[1].calculatedText,
    "de-text2",
    "Check2, use default value"
  );
  owner.locale = "de";
  assert.equal(items[0].calculatedText, "de-text1", "Check3, use 'de' text");
  assert.equal(items[1].calculatedText, "de-text2", "Check4, use 'de' value");
  var serJson = [
    { value: "val1", text: { default: "text1", de: "de-text1" } },
    { value: "val2", text: "de-text2" },
  ];
  assert.deepEqual(ItemValue.getData(items), serJson, "There is no pos object");
});

QUnit.test(
  "Array<ItemValue> localization deserialize/setData, no default value",
  function(assert) {
    var owner = new LocalizableOwnerTester("");
    var items = ItemValue.createArray(owner);
    var json = [{ value: "val1", text: { de: "de-text1" } }];
    ItemValue.setData(items, json);
    assert.deepEqual(
      ItemValue.getData(items),
      json,
      "There is 'de' serialization"
    );
  }
);

QUnit.test("Localization string markdown test", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var locString = new LocalizableString(owner, true);
  locString.text = "val1";
  assert.equal(locString.hasHtml, false, "There is no markdown");
  assert.equal(locString.html, "", "html is empty");
  assert.equal(locString.textOrHtml, "val1", "html is empty");
  locString.text = "markdown";
  assert.equal(locString.hasHtml, true, "Markdown is appy");
  assert.equal(
    locString.html,
    LocalizableOwnerTester.MarkdownText,
    "html is not empty"
  );
  assert.equal(
    locString.textOrHtml,
    LocalizableOwnerTester.MarkdownText,
    "html is empty"
  );
  locString.useMarkdown = false;
  assert.equal(locString.hasHtml, false, "remove markdown");
  assert.equal(locString.html, "", "html is empty again");
  assert.equal(locString.textOrHtml, "markdown", "html is empty");
});

QUnit.test("ItemValue markdown support", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var items = ItemValue.createArray(owner);
  var json = [
    "val1",
    { value: "val2", text: "text2" },
    { value: "val3", text: "text3markdown" },
  ];
  ItemValue.setData(items, json);
  assert.equal(items[0].locText.renderedHtml, "val1", "renderedHtml for item1");
  assert.equal(
    items[1].locText.renderedHtml,
    "text2",
    "renderedHtml for item2"
  );
  assert.equal(
    items[2].locText.renderedHtml,
    LocalizableOwnerTester.MarkdownText,
    "renderedHtml for item3"
  );
});

QUnit.test(
  "Do not call changed on setting value for locale, if there is the same value in default locale",
  function(assert) {
    var owner = new LocalizableOwnerTester("");

    var locString = new LocalizableStringTester(owner, true);
    var text = locString.calculatedText; //cached text
    locString.text = "enText";
    assert.equal(locString.onChangedCounter, 1, "onChanged called one time");
    owner.locale = "en";
    locString.text = "enText";
    assert.equal(
      locString.onChangedCounter,
      1,
      "onChanged called still one time"
    );
    assert.deepEqual(locString.getJson(), "enText", "Only default text is set");
  }
);

QUnit.test("getProcessedText, cached text", function(assert) {
  var owner = new LocalizableOwnerTester("");
  owner.values["name"] = "John Snow";
  var locString = new LocalizableStringTester(owner, true);
  //TODO replace
  locString.onGetTextCallback = locString.onGetTextCallback;
  var text = locString.calculatedText; //cached text
  locString.text = "enText";
  assert.equal(locString.onChangedCounter, 1, "onChanged called one time");
  owner.locale = "en";
  locString.text = "enText";
  assert.equal(
    locString.onChangedCounter,
    1,
    "onChanged called still one time"
  );
  assert.deepEqual(locString.getJson(), "enText", "Only default text is set");
});

QUnit.test("Value without title loctext", function(assert) {
  var itemValue = new ItemValue("val1");
  var counter = 0;

  itemValue.locText.onChanged = () => {
    counter++;
  };

  itemValue.value = "val2";

  assert.equal(counter, 1);
});

QUnit.test("Using shared values", function(assert) {
  var owner = new LocalizableOwnerTester("");
  owner.values["value"] = "My Value";
  var locString = new LocalizableString(owner, true);
  locString.onGetTextCallback = function(text) {
    return "*" + text + "*";
  };
  locString.text = "A {value} B";
  assert.equal(
    locString.renderedHtml,
    "*A My Value B*",
    "check the standard text"
  );
  var sharedString = new LocalizableString(owner, false);
  sharedString.sharedData = locString;
  assert.equal(
    sharedString.renderedHtml,
    "A My Value B",
    "check the shared text"
  );
});

QUnit.test("text property should not be changed by onGetTextCallback", function(
  assert
) {
  var owner = new LocalizableOwnerTester("");
  var locString = new LocalizableString(owner, true);
  locString.onGetTextCallback = function(text) {
    return "*" + text + "*";
  };
  locString.text = "A";
  assert.equal(locString.renderedHtml, "*A*", "event is working");
  assert.equal(locString.text, "A", "the value is still 'A'");
});
QUnit.test("Search text", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var locString = new LocalizableString(owner, true);
  var counter = 0;
  locString.onSearchChanged = () => {
    counter++;
  };
  locString.text = "abcd";
  locString.setFindText("ddd");
  assert.equal(counter, 0, "Nothign happens");
  assert.equal(locString.searchText, "ddd", "Search text is set");
  assert.equal(locString.searchIndex, undefined, "Search text index is set");

  locString.setFindText("bc");
  assert.equal(counter, 1, "callback: 1");
  assert.equal(locString.searchIndex, 1, "Search text index is set to 1");

  locString.setFindText("bcd");
  assert.equal(counter, 2, "callback: 2");
  assert.equal(
    locString.searchIndex,
    1,
    "Search text index is keep equals to 1"
  );
  locString.setFindText("bcde");
  assert.equal(counter, 3, "callback: 2");
  assert.equal(
    locString.searchIndex,
    undefined,
    "Search text index should be cleaned"
  );
});
QUnit.test("Localizable strings get/set tests", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var locStrings = new LocalizableStrings(owner);
  assert.deepEqual(locStrings.value, [], "Empty by default");
  locStrings.value = ["val1", "val2"];
  assert.deepEqual(locStrings.value, ["val1", "val2"], "value is set");
  owner.locale = "de";
  assert.deepEqual(locStrings.value, ["val1", "val2"], "get default values");
  locStrings.value = ["de-val1", "de-val2"];
  assert.deepEqual(locStrings.value, ["de-val1", "de-val2"], "get de values");
  owner.locale = "en";
  assert.deepEqual(locStrings.value, ["val1", "val2"], "get default/en values");
  assert.equal(locStrings.text, "val1\nval2", "use text");
  locStrings.text = "val1\nval2\nval3";
  assert.deepEqual(
    locStrings.value,
    ["val1", "val2", "val3"],
    "get value via text property"
  );
});
QUnit.test("Localizable strings getLocaleText/setLocaleText tests", function(
  assert
) {
  var owner = new LocalizableOwnerTester("");
  var locStrings = new LocalizableStrings(owner);
  assert.deepEqual(locStrings.value, [], "Empty by default");
  owner.locale = "en";
  locStrings.setLocaleText("", "val1\nval2");
  assert.deepEqual(locStrings.value, ["val1", "val2"], "value is set");
  assert.deepEqual(locStrings.getLocaleText("de"), "", "de text is emtpy");

  locStrings.setLocaleText("de", "de-val1\nde-val2");
  assert.deepEqual(
    locStrings.getLocaleText("de"),
    "de-val1\nde-val2",
    "get de values"
  );
  assert.deepEqual(
    locStrings.getLocaleText("en"),
    "val1\nval2",
    "get default/en values"
  );
});
QUnit.test("Localizable strings getJson/setJson", function(assert) {
  var owner = new LocalizableOwnerTester("");
  var locStrings = new LocalizableStrings(owner);
  assert.equal(locStrings.isEmpty, true, "it is empty");
  assert.notOk(locStrings.getJson(), "it is empty");
  locStrings.value = ["val1", "val2"];
  assert.deepEqual(locStrings.getJson(), ["val1", "val2"], "one value type");
  owner.locale = "de";
  locStrings.value = ["de-val1", "de-val2"];
  assert.deepEqual(
    locStrings.getJson(),
    { default: ["val1", "val2"], de: ["de-val1", "de-val2"] },
    "return an object"
  );
});
