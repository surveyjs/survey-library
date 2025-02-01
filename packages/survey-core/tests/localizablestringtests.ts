import {
  ILocalizableOwner,
  LocalizableString,
  LocalizableStrings,
} from "../src/localizablestring";
import { JsonObject, Serializer } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { HashTable } from "../src/helpers";
import { settings } from "../src/settings";
import { surveyLocalization } from "../src/surveyStrings";
import { englishStrings } from "../src/localization/english";
import { Base } from "../src/base";
import { SurveyElement, SurveyElementCore } from "../src/survey-element";

export default QUnit.module("LocalizableString");

class LocalizableOwnerTester implements ILocalizableOwner {
  public values: HashTable<string> = {};
  public static MarkdownText = "it is a markdown";
  constructor(public locale: string) { }
  public getLocale(): string {
    return this.locale;
  }
  public getMarkdownHtml(text: string): string {
    if (text.indexOf("markdown") > -1)
      return LocalizableOwnerTester.MarkdownText;
    return undefined;
  }
  public getRenderer(name: string): string {
    return undefined;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return undefined;
  }
  public getProcessedText(text: string): string {
    for (var key in this.values) {
      text = text.replace("{" + key + "}", this.values[key]);
    }
    return text;
  }
  public doPropertyValueChangedCallback() { }
}

class LocalizableStringTester extends LocalizableString {
  public onChangedCounter = 0;
  public onStrChangedCounter = 0;
  constructor(
    public owner: ILocalizableOwner,
    public useMarkdown: boolean = false
  ) {
    super(owner, useMarkdown);
    this.onStrChanged = (oldValue: string, newValue: string): void => {
      this.onStrChangedCounter++;
    };
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

class LocalizableStringObjectTester extends SurveyElement {
  private locString: LocalizableString;
  constructor() {
    super("locstringtester");
    this.locString = new LocalizableString(this);
  }
  public get locText(): LocalizableString {
    return this.locString;
  }
  public getType(): string {
    return "locstringobjecttester";
  }
}
class LocalizableTextObjectTester extends SurveyElement {
  private locString: LocalizableString;
  constructor() {
    super("locstringtester");
    this.locString = new LocalizableString(this);
  }
  public get locText(): LocalizableString {
    return this.locString;
  }
  public getType(): string {
    return "loctextobjecttester";
  }
}

Serializer.addClass("locstringtester", [
  { name: "text", serializationProperty: "locText" },
]);
Serializer.addClass("locstringobjecttester", [
  { name: "text", serializationProperty: "locText" },
]);
Serializer.addClass("loctextobjecttester", [
  { name: "text:text", serializationProperty: "locText" },
]);

QUnit.test("Simple get/set tests", function (assert) {
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

QUnit.test("Test set JSON", function (assert) {
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

QUnit.test("Test getJson", function (assert) {
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

QUnit.test("Test hasNonDefaultText", function (assert) {
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

QUnit.test("Test json deserialization", function (assert) {
  var owner = new LocalizableOwnerTester("");
  var tester = new LocalizableObjectTester(owner);
  new JsonObject().toObject({ text: { default: "val2", en: "val3" } }, tester);
  assert.equal(tester.locText.getLocaleText(""), "val2", "Check1");
  assert.equal(tester.locText.getLocaleText("en"), "val3", "Check2");
});

QUnit.test("Test json serialization", function (assert) {
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

class BaseItemValueArrayTester extends Base implements ILocalizableOwner {
  public values: HashTable<string> = {};
  constructor(public locale: string) {
    super();
    this.createItemValues("items");
  }
  public getLocale(): string {
    return this.locale;
  }
  public getMarkdownHtml(text: string): string {
    if (text.indexOf("markdown") > -1)
      return LocalizableOwnerTester.MarkdownText;
    return undefined as any;
  }
  public getRenderer(name: string): string {
    return undefined as any;
  }
  public getRendererContext(locStr: LocalizableString): any {
    return undefined;
  }
  public getProcessedText(text: string): string {
    for (var key in this.values) {
      text = text.replace("{" + key + "}", this.values[key]);
    }
    return text;
  }
  public get items(): Array<any> {
    return this.getPropertyValue("items");
  }
  public set items(newValue: Array<any>) {
    this.setPropertyValue("items", newValue);
  }
}

QUnit.test("Array<ItemValue> localization", function (assert) {
  var owner = new BaseItemValueArrayTester("");
  var items = owner.items;
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
QUnit.test("ItemValue.value = 0, #538", function (assert) {
  var owner = new BaseItemValueArrayTester("");
  var items = owner.items;

  items.push(new ItemValue(0));
  assert.equal(items[0].locText.textOrHtml, "0", "value 0, text should be '0'");
});

QUnit.test("Array<ItemValue> localization serialize", function (assert) {
  var owner = new BaseItemValueArrayTester("");
  var items = owner.items;
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
QUnit.test("Array<ItemValue> localization deserialize/setData", function (
  assert
) {
  var owner = new BaseItemValueArrayTester("");
  var items = owner.items;
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
  function (assert) {
    var owner = new BaseItemValueArrayTester("");
    var items = owner.items;
    var json = [{ value: "val1", text: { de: "de-text1" } }];
    ItemValue.setData(items, json);
    assert.deepEqual(
      ItemValue.getData(items),
      json,
      "There is 'de' serialization"
    );
  }
);

QUnit.test("Localization string markdown test", function (assert) {
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

QUnit.test("ItemValue markdown support", function (assert) {
  var owner = new BaseItemValueArrayTester("");
  var items = owner.items;
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
  function (assert) {
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
QUnit.test("Call changed on setting value for non-default locale. It used in Creator",
  function (assert) {
    var owner = new LocalizableOwnerTester("");

    var locString = new LocalizableStringTester(owner, true);
    var text = locString.calculatedText; //cached text
    locString.text = "enText";
    assert.equal(locString.onChangedCounter, 1, "onChanged called one time");
    assert.equal(locString.onStrChangedCounter, 1, "onStrChanged called one time");
    locString.setLocaleText("de", "deText");
    assert.equal(locString.onChangedCounter, 2, "onChanged called on changing de locale");
    assert.equal(locString.onStrChangedCounter, 2, "onStrChanged called on changing de locale");
  });

QUnit.test("getProcessedText, cached text", function (assert) {
  var owner = new LocalizableOwnerTester("");
  owner.values["name"] = "John Snow";
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
});

QUnit.test("Value without title loctext", function (assert) {
  var itemValue = new ItemValue("val1");
  var counter = 0;

  itemValue.locText.onChanged = () => {
    counter++;
  };

  itemValue.value = "val2";

  assert.equal(counter, 1);
});

QUnit.test("Using shared values", function (assert) {
  var owner = new LocalizableOwnerTester("");
  owner.values["value"] = "My Value";
  var locString = new LocalizableString(owner, true);
  locString.onGetTextCallback = function (text) {
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

QUnit.test("Using sharedData and translated strings", function (assert) {
  var owner = new LocalizableOwnerTester("");
  var locString = new LocalizableString(owner, true);
  locString.localizationName = "completeText";
  var sharedString = new LocalizableString(owner, false);
  sharedString.sharedData = locString;
  assert.equal(sharedString.renderedHtml, "Complete", "Use localization name from sharedData");
});

QUnit.test("text property should not be changed by onGetTextCallback", function (
  assert
) {
  var owner = new LocalizableOwnerTester("");
  var locString = new LocalizableString(owner, true);
  locString.onGetTextCallback = function (text) {
    return "*" + text + "*";
  };
  locString.text = "A";
  assert.equal(locString.renderedHtml, "*A*", "event is working");
  assert.equal(locString.text, "A", "the value is still 'A'");
});
QUnit.test(
  "Can get value from localization if default value is empty",
  function (assert) {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner, true);
    locString.localizationName = "completeText";
    assert.equal(
      locString.renderedHtml,
      "Complete",
      "get value from localizationName, renderedHtml"
    );
    assert.equal(
      locString.text,
      "Complete",
      "get value from localizationName, text"
    );
    locString.text = "A";
    assert.equal(locString.renderedHtml, "A", "rendred html");
    assert.equal(locString.text, "A", "text");
  }
);

QUnit.test("Search text", function (assert) {
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
  assert.equal(counter, 3, "callback: 3");
  assert.equal(
    locString.searchIndex,
    undefined,
    "Search text index should be cleaned"
  );
});
QUnit.test("Localizable strings get/set tests", function (assert) {
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
QUnit.test("Localizable strings getLocaleText/setLocaleText tests", function (
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
QUnit.test("Localizable strings getJson/setJson", function (assert) {
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
QUnit.test("Localization strings hasValue() and value property for different locales, Bug#3378", function (assert) {
  var owner = new LocalizableOwnerTester("");
  var locStrings = new LocalizableStrings(owner);
  assert.equal(locStrings.isEmpty, true, "it is empty");
  assert.notOk(locStrings.getJson(), "it is empty");
  locStrings.setJson({
    fr: ["val1", "val2"]
  });
  assert.deepEqual(locStrings.value, [], "one value type");
  assert.equal(locStrings.hasValue(), false, "default, hasValue()");
  owner.locale = "de";
  assert.deepEqual(locStrings.value, [], "Empty array");
  assert.equal(locStrings.hasValue(), false, "de, hasValue()");
  owner.locale = "fr";
  assert.deepEqual(locStrings.hasValue(), true, "fr, hasValue");
  owner.locale = "de";
  assert.deepEqual(locStrings.hasValue("fr"), true, "fr as parameter, hasValue");
  assert.deepEqual(locStrings.hasValue("en"), false, "en as parameter, hasValue");

  var owner = new LocalizableOwnerTester("");
  var locStrings = new LocalizableStrings(owner);
  locStrings.setJson(["val1", "val2"]);
  assert.equal(locStrings.hasValue(), true, "hasValue() - default");
});
QUnit.test("Localization strings should return copy on getJson", function (assert) {
  const owner = new LocalizableOwnerTester("");
  const locStrings = new LocalizableStrings(owner);
  locStrings.setJson({
    default: ["val1", "val2"],
    fr: ["val1-fr", "val2-fr"]
  });
  let json = locStrings.getJson();
  json.fr = "dummy";
  assert.equal(locStrings.getLocaleText("fr"), "val1-fr\nval2-fr", "Do not touch object");
});
QUnit.test("Survey localization string name", function (assert) {
  const owner = new LocalizableOwnerTester("");
  const locString = new LocalizableString(owner);
  locString.localizationName = "pageNextText";
  assert.equal(locString.text, "Next", "English next");
});
QUnit.test("External localization string name", function (assert) {
  surveyLocalization.onGetExternalString = (name: string, locale: string): string => {
    if (name === "ed.test") {
      if (locale === "de") return "ExternalStr-de";
      if (locale === "en") return "ExternalStr-en";
      return "ExternalStr";
    }
    return "";
  };
  const owner = new LocalizableOwnerTester("");
  const locString = new LocalizableString(owner);
  locString.localizationName = "ed.test";
  owner.locale = "en";
  assert.equal(locString.text, "ExternalStr-en", "English ExternalStr");
  owner.locale = "de";
  assert.equal(locString.text, "ExternalStr-de", "Deutsch ExternalStr");
  owner.locale = "";
  assert.equal(locString.text, "ExternalStr", "Default locale");
});
QUnit.test("Get/set language dialect", function (assert) {
  const owner = new LocalizableOwnerTester("");
  const locString = new LocalizableString(owner, true);
  locString.setJson({
    default: "Default",
    en: "English",
    "en-GB": "English GB",
    pt: "Portuguese"
  });
  assert.equal(locString.renderedHtml, "Default", "default locale");
  owner.locale = "en";
  assert.equal(locString.renderedHtml, "English", "en locale");
  owner.locale = "en-GB";
  assert.equal(locString.renderedHtml, "English GB", "en-GB locale");
  owner.locale = "pt";
  assert.equal(locString.renderedHtml, "Portuguese", "pt locale");
  owner.locale = "pt-BR";
  assert.equal(locString.renderedHtml, "Portuguese", "pt-BR locale");
  locString.text = "Portuguese BR";
  owner.locale = "en-GB";
  locString.text = "English";
  assert.deepEqual(locString.getJson(), {
    default: "Default",
    en: "English",
    pt: "Portuguese",
    "pt-BR": "Portuguese BR"
  }, "Remove en-GB");
  owner.locale = "en";
  locString.text = "Default";
  assert.deepEqual(locString.getJson(), {
    default: "Default",
    pt: "Portuguese",
    "pt-BR": "Portuguese BR"
  }, "Remove en");
  owner.locale = "en-GB";
  locString.text = "English GB";
  assert.deepEqual(locString.getJson(), {
    default: "Default",
    "en-GB": "English GB",
    pt: "Portuguese",
    "pt-BR": "Portuguese BR"
  }, "Add en-GB");
});
QUnit.test("Do not reset values in any locale", function (assert) {
  settings.storeDuplicatedTranslations = true;
  const owner = new LocalizableOwnerTester("");
  const locString = new LocalizableString(owner, true);
  locString.text = "default";
  locString.setLocaleText("de", "default-de");
  locString.setLocaleText("pt", "default-pt");
  locString.setLocaleText("pt-br", "default-pt");
  locString.setLocaleText("it", "default");
  assert.deepEqual(locString.getJson(), {
    default: "default",
    de: "default-de",
    it: "default",
    pt: "default-pt",
    "pt-br": "default-pt",
  }, "Do not reset any locale value");
  settings.storeDuplicatedTranslations = false;
});
QUnit.test("Do not reset values in any locale on changing the default", function (assert) {
  settings.storeDuplicatedTranslations = true;
  const owner = new LocalizableOwnerTester("");
  const locString = new LocalizableString(owner, true);
  locString.text = "default";
  locString.setLocaleText("de", "default-de");
  locString.setLocaleText("it", "default-it");
  assert.deepEqual(locString.getJson(), {
    default: "default",
    de: "default-de",
    it: "default-it"
  }, "Default values");
  locString.text = "default-de";
  assert.deepEqual(locString.getJson(), {
    default: "default-de",
    de: "default-de",
    it: "default-it"
  }, "Do not remove keys, #1");
  owner.locale = "it";
  locString.text = "default-de";
  assert.deepEqual(locString.getJson(), {
    default: "default-de",
    de: "default-de",
    it: "default-de"
  }, "Do not remove keys, #2");
  settings.storeDuplicatedTranslations = false;
});
QUnit.test("Support disableLocalization", function (assert) {
  const owner = new LocalizableOwnerTester("");
  const locString = new LocalizableString(owner, true);
  let oldStr, newStr;
  locString.onStrChanged = (oldValue: string, newValue: string) => {
    oldStr = oldValue;
    newStr = newValue;
  };
  locString.disableLocalization = true;
  locString.text = "default";
  assert.notOk(oldStr, "onStrChanged, oldStr #1");
  assert.equal(newStr, "default", "onStrChanged, newStr #1");
  locString.setLocaleText("de", "default-de");
  assert.equal(oldStr, "default", "onStrChanged, oldStr #2");
  assert.equal(newStr, "default-de", "onStrChanged, newStr #2");
  locString.setLocaleText("it", "default-it");
  assert.equal(oldStr, "default-de", "onStrChanged, oldStr #3");
  assert.equal(newStr, "default-it", "onStrChanged, newStr #3");
  assert.equal(locString.getJson(), "default-it", "#1");
  locString.text = "default-de";
  assert.deepEqual(locString.getJson(), "default-de", "#2");
  assert.equal(oldStr, "default-it", "onStrChanged, oldStr #3");
  assert.equal(newStr, "default-de", "onStrChanged, newStr #3");
  owner.locale = "fr";
  assert.equal(locString.text, "default-de", "check text on changing locale");
  locString.text = "default-fr";
  assert.deepEqual(locString.getJson(), "default-fr", "#3");
  assert.equal(newStr, "default-fr", "onStrChanged, newStr #4");
  locString.setJson("default-2");
  assert.deepEqual(locString.getJson(), "default-2", "#4");
});
QUnit.test("Allow to set empty string if there is localization name", function (assert) {
  const owner = new LocalizableOwnerTester("");
  const locString = new LocalizableString(owner, true);
  locString.localizationName = "completeText";
  assert.equal(locString.renderedHtml, "Complete", "get value from localizationName, renderedHtml");
  assert.equal(locString.text, "Complete", "get value from localizationName, text");
  locString.text = "";
  assert.equal(locString.renderedHtml, "", "empty rendred html");
  assert.equal(locString.text, "", "empty text");
  assert.strictEqual(locString.getJson(), "", "Return empty string in getJson()");
  const locString2 = new LocalizableString(owner, true);
  locString2.localizationName = "completeText";
  assert.equal(locString2.renderedHtml, "Complete", "locString2 = default value, renderedHtml");
  locString2.setJson("");
  assert.equal(locString2.renderedHtml, "", "locString2 = empty string after setJson, renderedHtml");
});
QUnit.test("Fire onStringChanged when localizationName is set", function (assert) {
  const owner = new LocalizableOwnerTester("");
  const locString = new LocalizableString(owner, true);
  let callCount = 0;
  locString.onStringChanged.add(() => {
    callCount++;
  });
  assert.equal(callCount, 0, "no calls");
  assert.equal(locString.text, "", "default value");
  locString.localizationName = "completeText";
  assert.equal(callCount, 1, "onStringChanged is called");
});
QUnit.test("Support defaultValue for localizable strings", function (assert) {
  const owner = new LocalizableOwnerTester("");
  const locStr1 = new LocalizableString(owner, true);
  locStr1.defaultValue = "str1";
  const locStr2 = new LocalizableString(owner, true, "locStr2");
  locStr2.defaultValue = "str2";
  const locStr3 = new LocalizableString(owner, true);
  locStr3.localizationName = "completeText";
  locStr3.defaultValue = "str3";
  assert.equal(locStr1.text, "str1", "str1 #1");
  assert.equal(locStr2.text, "str2", "str2 #1");
  assert.equal(locStr3.text, "Complete", "str3 #1");

  locStr1.text = "new str1";
  assert.equal(locStr1.text, "new str1", "str1 #2");

  owner.locale = "de";
  assert.equal(locStr1.text, "new str1", "str1 #3");
  assert.equal(locStr2.text, "str2", "str2 #3");
  assert.equal(locStr3.text, "Abschließen", "str3 #3");
});
QUnit.test("getJSON should copy values", function (assert) {
  const owner = new LocalizableOwnerTester("");
  const locStr = new LocalizableString(owner, true);
  locStr.setJson({ default: "str", de: "de: str" });
  assert.deepEqual(locStr.getJson(), { default: "str", de: "de: str" }, "getJson #1");
  const json = locStr.getJson();
  json["fr"] = "fr: str";
  assert.deepEqual(locStr.getJson(), { default: "str", de: "de: str" }, "getJson #2");
});
QUnit.test("allowLineBreaks check", function (assert) {
  var tester = new LocalizableStringObjectTester();
  const testerText = new LocalizableTextObjectTester();
  assert.notOk(tester.locText.allowLineBreaks);
  assert.ok(testerText.locText.allowLineBreaks);
});
QUnit.test("Remove locale for en empty string", function (assert) {
  const owner = new LocalizableOwnerTester("");
  const locStr = new LocalizableString(owner, true);
  locStr.setJson({ default: "str", de: "" }, true);
  assert.deepEqual(locStr.getJson(), { default: "str", de: "" }, "getJson #1");
  locStr.clearLocale("de");
  assert.deepEqual(locStr.getJson(), "str", "getJson #2");
});