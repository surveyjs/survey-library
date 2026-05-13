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
import { QuestionTextModel } from "../src/question_text";

import { describe, test, expect } from "vitest";
describe("LocalizableString", () => {
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

  test("Simple get/set tests", () => {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner);
    locString.text = "val1";
    expect(locString.text, "Check1. use default string").toBe("val1");
    expect(locString.getLocaleText(""), "Check1_2. use default string").toBe("val1");
    owner.locale = "en";
    locString.text = "val2";
    expect(locString.text, "Check2. 'en' locale").toBe("val2");
    expect(locString.getLocaleText("en"), "Check2_2. 'en' locale").toBe("val2");
    owner.locale = "fr";
    locString.text = "val3";
    expect(locString.text, "Check3.  'fr' locale").toBe("val3");
    expect(locString.getLocaleText("fr"), "Check3_2.  'fr' locale").toBe("val3");
    owner.locale = "unknown";
    expect(locString.text, "Check4.  'unknown' locale, use default").toBe("val1");
    expect(locString.getLocaleText("unkown"), "Check4_2.  'unknown' locale, use default").toBe("");
    owner.locale = "en";
    expect(locString.text, "Check5. 'en' locale").toBe("val2");
    expect(locString.getLocaleText("en"), "Check5_2. 'en' locale").toBe("val2");
  });

  test("Test set JSON", () => {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner);
    locString.setJson("val1");
    expect(locString.getLocaleText(""), "Check1").toBe("val1");

    locString.setJson({ default: "val2", en: "val3" });
    expect(locString.getLocaleText(""), "Check2").toBe("val2");
    expect(locString.getLocaleText("en"), "Check3").toBe("val3");

    locString.setJson({ fr: "val5", en: "val4" });
    expect(locString.getLocaleText(""), "Check4").toBe("");
    expect(locString.getLocaleText("en"), "Check5").toBe("val4");
    expect(locString.getLocaleText("fr"), "Check6").toBe("val5");
  });

  test("Test getJson", () => {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner);

    expect(locString.getJson(), "There is no values").toBe(null);
    locString.setLocaleText("en", "value1");
    expect(locString.getJson(), "There is one value, but 'en'").toEqual({ en: "value1" });

    var json = { default: "val2", en: "val3" };
    locString.setJson(json);
    expect(locString.getJson(), "Several values").toEqual(json);

    locString.setLocaleText("en", "val2");
    expect(locString.getJson(), "There is one value again, 'en' was equaled to default").toEqual("val2");

    locString.setLocaleText("en", "val1");
    expect(locString.getJson(), "'en' is different from default now").toEqual({ default: "val2", en: "val1" });

    locString.setLocaleText("", "val1");
    expect(locString.getJson(), "'en' and default are the same").toEqual("val1");
    settings.serializeLocalizableStringAsObject = true;
    expect(locString.getJson(), "LocalizableString.SerializeAsObject = true").toEqual({ default: "val1" });
    settings.serializeLocalizableStringAsObject = false;
  });
  test("Test getJson with selectedLocales", () => {
    const owner = new LocalizableOwnerTester("");
    const locString = new LocalizableString(owner);

    expect(locString.getJson({ locales: ["de"] }), "There is no values").toBe(null);
    let json = { default: "val2", en: "val3" };
    locString.setJson(json);
    expect(locString.getJson({ locales: ["default", "en"] }), "Several values").toEqual(json);
    expect(locString.getJson({ locales: ["de"] }), "There is no 'de' value").toEqual(null);
    expect(locString.getJson({ locales: ["en"] }), "There is only 'en' value").toEqual("val3");
    locString.setJson({ default: "val1", de: "val2", fr: "val3" });
    expect(locString.getJson({ locales: ["de", "fr"] }), "There are 'de' and 'fr' values").toEqual({ de: "val2", fr: "val3" });
    expect(locString.getJson({ locales: ["it"] }), "There is not 'it' locale value").toBe(null);
    locString.setJson({ default: "val1" });
    expect(locString.getJson({ locales: ["de"] }), "There is no 'de' value again").toBe(null);
  });
  test("Test mergeWidth", () => {
    const owner1 = new LocalizableOwnerTester("");
    const locString1 = new LocalizableString(owner1);
    const owner2 = new LocalizableOwnerTester("");
    const locString2 = new LocalizableString(owner2);
    locString1.setJson({ default: "val1", de: "val2" });
    locString2.mergeWith(locString1, ["de", "fr"]);
    expect(locString2.getJson(), "merge with selected locales").toEqual({ de: "val2" });
  });
  test("Test mergeWith with different default locales", () => {
    const owner1 = new LocalizableOwnerTester("de");
    const locString1 = new LocalizableString(owner1);
    const owner2 = new LocalizableOwnerTester("");
    const locString2 = new LocalizableString(owner2);
    locString1.text = "val-de";
    locString2.mergeWith(locString1, ["de"]);
    expect(locString2.getJson(), "merge with selected locales").toEqual({ de: "val-de" });
  });
  test("Test hasNonDefaultText", () => {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner);

    expect(locString.hasNonDefaultText(), "There is no values").toBe(false);
    locString.setLocaleText("en", "value1");
    expect(locString.hasNonDefaultText(), "There is one value, but 'en'").toEqual(true);

    locString.setJson({ default: "val2", en: "val3" });
    expect(locString.hasNonDefaultText(), "Several values").toEqual(true);

    locString.setLocaleText("en", "val2");
    expect(locString.hasNonDefaultText(), "There is one value again, 'en' was equaled to default").toEqual(false);

    locString.setLocaleText("en", "val1");
    expect(locString.hasNonDefaultText(), "'en' is different from default now").toEqual(true);

    locString.setLocaleText("", "val1");
    expect(locString.hasNonDefaultText(), "'en' and default are the same").toEqual(false);
  });

  test("Test json deserialization", () => {
    var owner = new LocalizableOwnerTester("");
    var tester = new LocalizableObjectTester(owner);
    new JsonObject().toObject({ text: { default: "val2", en: "val3" } }, tester);
    expect(tester.locText.getLocaleText(""), "Check1").toBe("val2");
    expect(tester.locText.getLocaleText("en"), "Check2").toBe("val3");
  });

  test("Test json serialization", () => {
    var owner = new LocalizableOwnerTester("");
    var tester = new LocalizableObjectTester(owner);
    tester.text = "val2";
    owner.locale = "en";
    tester.text = "val3";
    var json = new JsonObject().toJsonObject(tester);
    expect(json, "Serialize object correctly").toEqual({ text: { default: "val2", en: "val3" } });
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

  test("Array<ItemValue> localization", () => {
    var owner = new BaseItemValueArrayTester("");
    var items = owner.items;
    items.push(new ItemValue("val1", "text1"));
    items.push(new ItemValue("val2"));
    owner.locale = "de";
    items[0].text = "de-text1";
    owner.locale = "fr";
    expect(items[0].calculatedText, "Check1, use default text").toBe("text1");
    expect(items[1].calculatedText, "Check2, use default value").toBe("val2");
    owner.locale = "de";
    items[1].text = "de-text2";
    expect(items[0].calculatedText, "Check3, use 'de' text").toBe("de-text1");
    expect(items[1].calculatedText, "Check4, use 'de' value").toBe("de-text2");
    owner.locale = "";
    expect(items[0].calculatedText, "Check5, use default text").toBe("text1");
    items[0].locText.setLocaleText("", null);
    expect(items[0].calculatedText, "Check6, use value").toBe("val1");
  });
  test("ItemValue.value = 0, #538", () => {
    var owner = new BaseItemValueArrayTester("");
    var items = owner.items;

    items.push(new ItemValue(0));
    expect(items[0].locText.textOrHtml, "value 0, text should be '0'").toBe("0");
  });

  test("Array<ItemValue> localization serialize", () => {
    var owner = new BaseItemValueArrayTester("");
    var items = owner.items;
    items.push(new ItemValue("val1", "text1"));
    items.push(new ItemValue("val2"));
    owner.locale = "de";
    items[0].text = "de-text1";
    items[1].text = "de-text2";
    expect(ItemValue.getData(items), "serialize localization").toEqual([
      { value: "val1", text: { default: "text1", de: "de-text1" } },
      { value: "val2", text: { de: "de-text2" } },
    ]);
    items[1].text = "";
    expect(ItemValue.getData(items), "serialize localization, with empty text in the second item").toEqual([{ value: "val1", text: { default: "text1", de: "de-text1" } }, "val2"]);
  });
  test("Array<ItemValue> localization deserialize/setData", () => {
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
    expect(items[0].calculatedText, "Check1, use default text").toBe("text1");
    expect(items[1].calculatedText, "Check2, use default value").toBe("de-text2");
    owner.locale = "de";
    expect(items[0].calculatedText, "Check3, use 'de' text").toBe("de-text1");
    expect(items[1].calculatedText, "Check4, use 'de' value").toBe("de-text2");
    var serJson = [
      { value: "val1", text: { default: "text1", de: "de-text1" } },
      { value: "val2", text: "de-text2" },
    ];
    expect(ItemValue.getData(items), "There is no pos object").toEqual(serJson);
  });

  test("Array<ItemValue> localization deserialize/setData, no default value", () => {
    var owner = new BaseItemValueArrayTester("");
    var items = owner.items;
    var json = [{ value: "val1", text: { de: "de-text1" } }];
    ItemValue.setData(items, json);
    expect(ItemValue.getData(items), "There is 'de' serialization").toEqual(json);
  });

  test("Localization string markdown test", () => {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner, true);
    locString.text = "val1";
    expect(locString.hasHtml, "There is no markdown").toBe(false);
    expect(locString.html, "html is empty").toBe("");
    expect(locString.textOrHtml, "html is empty").toBe("val1");
    locString.text = "markdown";
    expect(locString.hasHtml, "Markdown is appy").toBe(true);
    expect(locString.html, "html is not empty").toBe(LocalizableOwnerTester.MarkdownText);
    expect(locString.textOrHtml, "html is empty").toBe(LocalizableOwnerTester.MarkdownText);
    locString.useMarkdown = false;
    expect(locString.hasHtml, "remove markdown").toBe(false);
    expect(locString.html, "html is empty again").toBe("");
    expect(locString.textOrHtml, "html is empty").toBe("markdown");
  });

  test("ItemValue markdown support", () => {
    var owner = new BaseItemValueArrayTester("");
    var items = owner.items;
    var json = [
      "val1",
      { value: "val2", text: "text2" },
      { value: "val3", text: "text3markdown" },
    ];
    ItemValue.setData(items, json);
    expect(items[0].locText.renderedHtml, "renderedHtml for item1").toBe("val1");
    expect(items[1].locText.renderedHtml, "renderedHtml for item2").toBe("text2");
    expect(items[2].locText.renderedHtml, "renderedHtml for item3").toBe(LocalizableOwnerTester.MarkdownText);
  });

  test("Do not call changed on setting value for locale, if there is the same value in default locale", () => {
    var owner = new LocalizableOwnerTester("");

    var locString = new LocalizableStringTester(owner, true);
    var text = locString.calculatedText; //cached text
    locString.text = "enText";
    expect(locString.onChangedCounter, "onChanged called one time").toBe(1);
    owner.locale = "en";
    locString.text = "enText";
    expect(locString.onChangedCounter, "onChanged called still one time").toBe(1);
    expect(locString.getJson(), "Only default text is set").toEqual("enText");
  });
  test("Call changed on setting value for non-default locale. It used in Creator", () => {
    var owner = new LocalizableOwnerTester("");

    var locString = new LocalizableStringTester(owner, true);
    var text = locString.calculatedText; //cached text
    locString.text = "enText";
    expect(locString.onChangedCounter, "onChanged called one time").toBe(1);
    expect(locString.onStrChangedCounter, "onStrChanged called one time").toBe(1);
    locString.setLocaleText("de", "deText");
    expect(locString.onChangedCounter, "onChanged called on changing de locale").toBe(2);
    expect(locString.onStrChangedCounter, "onStrChanged called on changing de locale").toBe(2);
  });

  test("getProcessedText, cached text", () => {
    var owner = new LocalizableOwnerTester("");
    owner.values["name"] = "John Snow";
    var locString = new LocalizableStringTester(owner, true);
    var text = locString.calculatedText; //cached text
    locString.text = "enText";
    expect(locString.onChangedCounter, "onChanged called one time").toBe(1);
    owner.locale = "en";
    locString.text = "enText";
    expect(locString.onChangedCounter, "onChanged called still one time").toBe(1);
    expect(locString.getJson(), "Only default text is set").toEqual("enText");
  });

  test("Value without title loctext", () => {
    var itemValue = new ItemValue("val1");
    var counter = 0;

    itemValue.locText.onChanged = () => {
      counter++;
    };

    itemValue.value = "val2";

    expect(counter).toBe(1);
  });

  test("Using shared values", () => {
    var owner = new LocalizableOwnerTester("");
    owner.values["value"] = "My Value";
    var locString = new LocalizableString(owner, true);
    locString.onGetTextCallback = function (text) {
      return "*" + text + "*";
    };
    locString.text = "A {value} B";
    expect(locString.renderedHtml, "check the standard text").toBe("*A My Value B*");
    var sharedString = new LocalizableString(owner, false);
    sharedString.sharedData = locString;
    expect(sharedString.renderedHtml, "check the shared text").toBe("A My Value B");
  });

  test("Using sharedData and translated strings", () => {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner, true);
    locString.localizationName = "completeText";
    var sharedString = new LocalizableString(owner, false);
    sharedString.sharedData = locString;
    expect(sharedString.renderedHtml, "Use localization name from sharedData").toBe("Complete");
  });

  test("text property should not be changed by onGetTextCallback", () => {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner, true);
    locString.onGetTextCallback = function (text) {
      return "*" + text + "*";
    };
    locString.text = "A";
    expect(locString.renderedHtml, "event is working").toBe("*A*");
    expect(locString.text, "the value is still 'A'").toBe("A");
  });
  test("Can get value from localization if default value is empty", () => {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner, true);
    locString.localizationName = "completeText";
    expect(locString.renderedHtml, "get value from localizationName, renderedHtml").toBe("Complete");
    expect(locString.text, "get value from localizationName, text").toBe("Complete");
    locString.text = "A";
    expect(locString.renderedHtml, "rendred html").toBe("A");
    expect(locString.text, "text").toBe("A");
  });

  test("Search text", () => {
    var owner = new LocalizableOwnerTester("");
    var locString = new LocalizableString(owner, true);
    var counter = 0;
    locString.onSearchChanged = () => {
      counter++;
    };
    locString.text = "abcd";
    locString.setFindText("ddd");
    expect(counter, "Nothign happens").toBe(0);
    expect(locString.searchText, "Search text is set").toBe("ddd");
    expect(locString.searchIndex, "Search text index is set").toBe(undefined);

    locString.setFindText("bc");
    expect(counter, "callback: 1").toBe(1);
    expect(locString.searchIndex, "Search text index is set to 1").toBe(1);

    locString.setFindText("bcd");
    expect(counter, "callback: 2").toBe(2);
    expect(locString.searchIndex, "Search text index is keep equals to 1").toBe(1);
    locString.setFindText("bcde");
    expect(counter, "callback: 3").toBe(3);
    expect(locString.searchIndex, "Search text index should be cleaned").toBe(undefined);
  });
  test("Localizable strings get/set tests", () => {
    var owner = new LocalizableOwnerTester("");
    var locStrings = new LocalizableStrings(owner);
    expect(locStrings.value, "Empty by default").toEqual([]);
    locStrings.value = ["val1", "val2"];
    expect(locStrings.value, "value is set").toEqual(["val1", "val2"]);
    owner.locale = "de";
    expect(locStrings.value, "get default values").toEqual(["val1", "val2"]);
    locStrings.value = ["de-val1", "de-val2"];
    expect(locStrings.value, "get de values").toEqual(["de-val1", "de-val2"]);
    owner.locale = "en";
    expect(locStrings.value, "get default/en values").toEqual(["val1", "val2"]);
    expect(locStrings.text, "use text").toBe("val1\nval2");
    locStrings.text = "val1\nval2\nval3";
    expect(locStrings.value, "get value via text property").toEqual(["val1", "val2", "val3"]);
  });
  test("Localizable strings getLocaleText/setLocaleText tests", () => {
    var owner = new LocalizableOwnerTester("");
    var locStrings = new LocalizableStrings(owner);
    expect(locStrings.value, "Empty by default").toEqual([]);
    owner.locale = "en";
    locStrings.setLocaleText("", "val1\nval2");
    expect(locStrings.value, "value is set").toEqual(["val1", "val2"]);
    expect(locStrings.getLocaleText("de"), "de text is emtpy").toEqual("");

    locStrings.setLocaleText("de", "de-val1\nde-val2");
    expect(locStrings.getLocaleText("de"), "get de values").toEqual("de-val1\nde-val2");
    expect(locStrings.getLocaleText("en"), "get default/en values").toEqual("val1\nval2");
  });
  test("Localizable strings getJson/setJson", () => {
    var owner = new LocalizableOwnerTester("");
    var locStrings = new LocalizableStrings(owner);
    expect(locStrings.isEmpty, "it is empty").toBe(true);
    expect(locStrings.getJson(), "it is empty").toBeFalsy();
    locStrings.value = ["val1", "val2"];
    expect(locStrings.getJson(), "one value type").toEqual(["val1", "val2"]);
    owner.locale = "de";
    locStrings.value = ["de-val1", "de-val2"];
    expect(locStrings.getJson(), "return an object").toEqual({ default: ["val1", "val2"], de: ["de-val1", "de-val2"] });
  });
  test("Localization strings hasValue() and value property for different locales, Bug#3378", () => {
    var owner = new LocalizableOwnerTester("");
    var locStrings = new LocalizableStrings(owner);
    expect(locStrings.isEmpty, "it is empty").toBe(true);
    expect(locStrings.getJson(), "it is empty").toBeFalsy();
    locStrings.setJson({
      fr: ["val1", "val2"]
    });
    expect(locStrings.value, "one value type").toEqual([]);
    expect(locStrings.hasValue(), "default, hasValue()").toBe(false);
    owner.locale = "de";
    expect(locStrings.value, "Empty array").toEqual([]);
    expect(locStrings.hasValue(), "de, hasValue()").toBe(false);
    owner.locale = "fr";
    expect(locStrings.hasValue(), "fr, hasValue").toEqual(true);
    owner.locale = "de";
    expect(locStrings.hasValue("fr"), "fr as parameter, hasValue").toEqual(true);
    expect(locStrings.hasValue("en"), "en as parameter, hasValue").toEqual(false);

    var owner = new LocalizableOwnerTester("");
    var locStrings = new LocalizableStrings(owner);
    locStrings.setJson(["val1", "val2"]);
    expect(locStrings.hasValue(), "hasValue() - default").toBe(true);
  });
  test("Localization strings should return copy on getJson", () => {
    const owner = new LocalizableOwnerTester("");
    const locStrings = new LocalizableStrings(owner);
    locStrings.setJson({
      default: ["val1", "val2"],
      fr: ["val1-fr", "val2-fr"]
    });
    let json = locStrings.getJson();
    json.fr = "dummy";
    expect(locStrings.getLocaleText("fr"), "Do not touch object").toBe("val1-fr\nval2-fr");
  });
  test("Survey localization string name", () => {
    const owner = new LocalizableOwnerTester("");
    const locString = new LocalizableString(owner);
    locString.localizationName = "pageNextText";
    expect(locString.text, "English next").toBe("Next");
  });
  test("External localization string name", () => {
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
    expect(locString.text, "English ExternalStr").toBe("ExternalStr-en");
    owner.locale = "de";
    expect(locString.text, "Deutsch ExternalStr").toBe("ExternalStr-de");
    owner.locale = "";
    expect(locString.text, "Default locale").toBe("ExternalStr");
  });
  test("Get/set language dialect", () => {
    const owner = new LocalizableOwnerTester("");
    const locString = new LocalizableString(owner, true);
    locString.setJson({
      default: "Default",
      en: "English",
      "en-GB": "English GB",
      pt: "Portuguese"
    });
    expect(locString.renderedHtml, "default locale").toBe("Default");
    owner.locale = "en";
    expect(locString.renderedHtml, "en locale").toBe("English");
    owner.locale = "en-GB";
    expect(locString.renderedHtml, "en-GB locale").toBe("English GB");
    owner.locale = "pt";
    expect(locString.renderedHtml, "pt locale").toBe("Portuguese");
    owner.locale = "pt-BR";
    expect(locString.renderedHtml, "pt-BR locale").toBe("Portuguese");
    locString.text = "Portuguese BR";
    owner.locale = "en-GB";
    locString.text = "English";
    expect(locString.getJson(), "Remove en-GB").toEqual({
      default: "Default",
      en: "English",
      pt: "Portuguese",
      "pt-BR": "Portuguese BR"
    });
    owner.locale = "en";
    locString.text = "Default";
    expect(locString.getJson(), "Remove en").toEqual({
      default: "Default",
      pt: "Portuguese",
      "pt-BR": "Portuguese BR"
    });
    owner.locale = "en-GB";
    locString.text = "English GB";
    expect(locString.getJson(), "Add en-GB").toEqual({
      default: "Default",
      "en-GB": "English GB",
      pt: "Portuguese",
      "pt-BR": "Portuguese BR"
    });
  });
  test("Do not reset values in any locale", () => {
    settings.storeDuplicatedTranslations = true;
    const owner = new LocalizableOwnerTester("");
    const locString = new LocalizableString(owner, true);
    locString.text = "default";
    locString.setLocaleText("de", "default-de");
    locString.setLocaleText("pt", "default-pt");
    locString.setLocaleText("pt-br", "default-pt");
    locString.setLocaleText("it", "default");
    expect(locString.getJson(), "Do not reset any locale value").toEqual({
      default: "default",
      de: "default-de",
      it: "default",
      pt: "default-pt",
      "pt-br": "default-pt",
    });
    settings.storeDuplicatedTranslations = false;
  });
  test("Do not reset values in any locale on changing the default", () => {
    settings.storeDuplicatedTranslations = true;
    const owner = new LocalizableOwnerTester("");
    const locString = new LocalizableString(owner, true);
    locString.text = "default";
    locString.setLocaleText("de", "default-de");
    locString.setLocaleText("it", "default-it");
    expect(locString.getJson(), "Default values").toEqual({
      default: "default",
      de: "default-de",
      it: "default-it"
    });
    locString.text = "default-de";
    expect(locString.getJson(), "Do not remove keys, #1").toEqual({
      default: "default-de",
      de: "default-de",
      it: "default-it"
    });
    owner.locale = "it";
    locString.text = "default-de";
    expect(locString.getJson(), "Do not remove keys, #2").toEqual({
      default: "default-de",
      de: "default-de",
      it: "default-de"
    });
    settings.storeDuplicatedTranslations = false;
  });
  test("Support disableLocalization", () => {
    const owner = new LocalizableOwnerTester("");
    const locString = new LocalizableString(owner, true);
    let oldStr, newStr;
    locString.onStrChanged = (oldValue: string, newValue: string) => {
      oldStr = oldValue;
      newStr = newValue;
    };
    locString.disableLocalization = true;
    locString.text = "default";
    expect(oldStr, "onStrChanged, oldStr #1").toBeFalsy();
    expect(newStr, "onStrChanged, newStr #1").toBe("default");
    locString.setLocaleText("de", "default-de");
    expect(oldStr, "onStrChanged, oldStr #2").toBe("default");
    expect(newStr, "onStrChanged, newStr #2").toBe("default-de");
    locString.setLocaleText("it", "default-it");
    expect(oldStr, "onStrChanged, oldStr #3").toBe("default-de");
    expect(newStr, "onStrChanged, newStr #3").toBe("default-it");
    expect(locString.getJson(), "#1").toBe("default-it");
    locString.text = "default-de";
    expect(locString.getJson(), "#2").toEqual("default-de");
    expect(oldStr, "onStrChanged, oldStr #3").toBe("default-it");
    expect(newStr, "onStrChanged, newStr #3").toBe("default-de");
    owner.locale = "fr";
    expect(locString.text, "check text on changing locale").toBe("default-de");
    locString.text = "default-fr";
    expect(locString.getJson(), "#3").toEqual("default-fr");
    expect(newStr, "onStrChanged, newStr #4").toBe("default-fr");
    locString.setJson("default-2");
    expect(locString.getJson(), "#4").toEqual("default-2");
  });
  test("Allow to set empty string if there is localization name", () => {
    const owner = new LocalizableOwnerTester("");
    const locString = new LocalizableString(owner, true);
    locString.localizationName = "completeText";
    expect(locString.renderedHtml, "get value from localizationName, renderedHtml").toBe("Complete");
    expect(locString.text, "get value from localizationName, text").toBe("Complete");
    locString.text = "";
    expect(locString.renderedHtml, "empty rendred html").toBe("");
    expect(locString.text, "empty text").toBe("");
    expect(locString.getJson(), "Return empty string in getJson()").toBe("");
    const locString2 = new LocalizableString(owner, true);
    locString2.localizationName = "completeText";
    expect(locString2.renderedHtml, "locString2 = default value, renderedHtml").toBe("Complete");
    locString2.setJson("");
    expect(locString2.renderedHtml, "locString2 = empty string after setJson, renderedHtml").toBe("");
  });
  test("Fire onStringChanged when localizationName is set", () => {
    const owner = new LocalizableOwnerTester("");
    const locString = new LocalizableString(owner, true);
    let callCount = 0;
    locString.onStringChanged.add(() => {
      callCount++;
    });
    expect(callCount, "no calls").toBe(0);
    expect(locString.text, "default value").toBe("");
    locString.localizationName = "completeText";
    expect(callCount, "onStringChanged is called").toBe(1);
  });
  test("Support defaultValue for localizable strings", () => {
    const owner = new LocalizableOwnerTester("");
    const locStr1 = new LocalizableString(owner, true);
    locStr1.defaultValue = "str1";
    const locStr2 = new LocalizableString(owner, true, "locStr2");
    locStr2.defaultValue = "str2";
    const locStr3 = new LocalizableString(owner, true);
    locStr3.localizationName = "completeText";
    locStr3.defaultValue = "str3";
    expect(locStr1.text, "str1 #1").toBe("str1");
    expect(locStr2.text, "str2 #1").toBe("str2");
    expect(locStr3.text, "str3 #1").toBe("Complete");

    locStr1.text = "new str1";
    expect(locStr1.text, "str1 #2").toBe("new str1");

    owner.locale = "de";
    expect(locStr1.text, "str1 #3").toBe("new str1");
    expect(locStr2.text, "str2 #3").toBe("str2");
    expect(locStr3.text, "str3 #3").toBe("Abschließen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  });
  test("getJSON should copy values", () => {
    const owner = new LocalizableOwnerTester("");
    const locStr = new LocalizableString(owner, true);
    locStr.setJson({ default: "str", de: "de: str" });
    expect(locStr.getJson(), "getJson #1").toEqual({ default: "str", de: "de: str" });
    const json = locStr.getJson();
    json["fr"] = "fr: str";
    expect(locStr.getJson(), "getJson #2").toEqual({ default: "str", de: "de: str" });
  });
  test("allowLineBreaks check", () => {
    var tester = new LocalizableStringObjectTester();
    const testerText = new LocalizableTextObjectTester();
    expect(tester.locText.allowLineBreaks).toBeFalsy();
    expect(testerText.locText.allowLineBreaks).toBeTruthy();
  });
  test("Remove locale for en empty string", () => {
    const owner = new LocalizableOwnerTester("");
    const locStr = new LocalizableString(owner, true);
    locStr.setJson({ default: "str", de: "" }, true);
    expect(locStr.getJson(), "getJson #1").toEqual({ default: "str", de: "" });
    locStr.clearLocale("de");
    expect(locStr.getJson(), "getJson #2").toEqual("str");
  });
  test("Setting value equal to default locale removes en locale and fires change notification, Bug#11091", () => {
    surveyLocalization.defaultLocale = "de";
    const owner = new LocalizableOwnerTester("en");
    const locStr = new LocalizableStringTester(owner, true);
    locStr.setJson({ en: "", default: "my text" }, true);
    var text = locStr.calculatedText; //cached text
    locStr.onChangedCounter = 0;
    locStr.text = "my text";
    expect(locStr.getJson(), "Only default text remains after setting same value").toEqual("my text");
    expect(locStr.onChangedCounter, "onChanged is called").toBe(1);
    surveyLocalization.defaultLocale = "en";
  });
  test("locString placeholder", () => {
    const owner = new LocalizableOwnerTester("");
    const locStr = new LocalizableString(owner, true);
    locStr.setJson({ default: "str", pt: "str-pt", "pt-BR": "str-br" }, true);
    expect(locStr.getPlaceholder(), "default placeholder").toBe("");
    owner.locale = "pt";
    expect(locStr.getPlaceholder(), "pt placeholder").toBe("str");
    owner.locale = "pt-BR";
    expect(locStr.getPlaceholder(), "pt-BR placeholder").toBe("str-pt");
    owner.locale = "";
    locStr.onGetTextCallback = (text: string) => {
      if (!text) return "empty";
      return text;
    };
    expect(locStr.getPlaceholder(), "default placeholder, onGetTextCallback").toBe("empty");
  });
  test("locString.lastLocChanged: string", () => {
    const owner = new LocalizableOwnerTester("");
    const locString = new LocalizableStringTester(owner, true);
    expect(locString.lastChangedLoc, "lastLocChanged #1").toBe(undefined);
    locString.setLocaleText("de", "deText");
    expect(locString.lastChangedLoc, "lastLocChanged #2").toBe("de");
    locString.setLocaleText("en", "enText");
    expect(locString.lastChangedLoc, "lastLocChanged #3").toBe("en");
    locString.clearLocale("de");
    expect(locString.lastChangedLoc, "lastLocChanged #4").toBe("de");
    locString.setJson({});
    expect(locString.lastChangedLoc, "lastLocChanged #5").toBe(undefined);
    locString.setLocaleText("fr", "frText");
    expect(locString.lastChangedLoc, "lastLocChanged #6").toBe("fr");
    locString.text = "fdfdf";
    expect(locString.lastChangedLoc, "lastLocChanged #7").toBe("");
    locString.setLocaleText("fr", "frText");
    expect(locString.lastChangedLoc, "lastLocChanged #8").toBe("fr");
    locString.clear();
    expect(locString.lastChangedLoc, "lastLocChanged #9").toBe(undefined);
  });
  test("test getStringViewerClassName", () => {
    const owner = new LocalizableOwnerTester("");
    const locStr = new LocalizableString(owner, true);
    expect(locStr.getStringViewerClassName(), "default class name").toBe("sv-string-viewer");
    expect(locStr.getStringViewerClassName("testClass"), "custom class name").toBe("testClass");
    expect(locStr.getStringViewerClassName(""), "empty class name").toBe("");
    const q1 = new QuestionTextModel("q1");
    expect(q1.locTitle.allowLineBreaks, "question title allowLineBreaks").toBe(true);
    expect(q1.locTitle.getStringViewerClassName(), "question title class name").toBe("sv-string-viewer sv-string-viewer--multiline");
    expect(q1.locTitle.getStringViewerClassName("testClass"), "question title class name, use custom class name").toBe("testClass");
    expect(q1.locTitle.getStringViewerClassName(""), "question title class name, use empty custom class name").toBe("");
  });
});
