import { SurveyModel } from "../src/survey";
import { QuestionTextModel } from "../src/question_text";
import { RegionOptions, regionOptionsCategory } from "../src/region-options";
import { Serializer } from "../src/jsonobject";
import { localeData, getLocaleDataLocales } from "../src/locale-data";
import { surveyLocalization } from "../src/surveyStrings";
import "../src/localization/german";

import { describe, test, expect, afterEach } from "vitest";

const euro = "\u20AC";
const nbsp = "\u00A0";

function createSurvey(json: any = {}): SurveyModel {
  return new SurveyModel({
    elements: [
      { type: "text", name: "num", maskType: "numeric" },
      { type: "text", name: "cur", maskType: "currency", maskSettings: { currencySymbol: euro } },
      { type: "text", name: "date", maskType: "datetime" },
      { type: "text", name: "time", maskType: "datetime", maskSettings: { patternPreset: "localeTime" } },
    ],
    ...json
  });
}
// walks the pages rather than the name hash: survey.fromJSON() clears the hash and rebuilds it
// only from pages the JSON supplies, so a retained question is not found by name afterwards
function getQuestion(survey: SurveyModel, name: string): QuestionTextModel {
  return <QuestionTextModel>survey.getAllQuestions().filter(q => q.name === name)[0];
}
function renderNumber(survey: SurveyModel, name: string = "num"): string {
  const q = getQuestion(survey, name);
  q.value = 1234.56;
  return q.inputValue;
}
function createInput(): HTMLInputElement {
  const input = document.createElement("input");
  document.body.appendChild(input);
  return input;
}

describe("RegionOptions: serialization", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("An untouched survey has no regionOptions key, including after the property has been read", () => {
    const survey = createSurvey();
    expect(survey.toJSON().regionOptions, "never read").toBeUndefined();
    const options = survey.regionOptions;
    expect(options, "reading creates the object").toBeInstanceOf(RegionOptions);
    expect(options.isEmpty, "the created object is empty").toBe(true);
    expect(survey.toJSON().regionOptions, "read but empty").toBeUndefined();
    expect(Object.keys(survey.toJSON()).indexOf("regionOptions"), "no key at all").toBe(-1);
  });

  test("Setting one field serializes only that field and the round trip is stable", () => {
    const survey = createSurvey();
    survey.regionOptions.decimalSeparator = ",";
    expect(survey.toJSON().regionOptions, "one field").toEqual({ decimalSeparator: "," });

    const copy = new SurveyModel(survey.toJSON());
    expect(copy.toJSON().regionOptions, "stable").toEqual({ decimalSeparator: "," });
    expect(copy.regionOptions.decimalSeparator, "loaded").toBe(",");
    expect(copy.regionOptions.thousandsSeparator, "the others stay unset").toBeUndefined();
  });

  test("A field set equal to the locale's own value is still written", () => {
    const survey = createSurvey();
    survey.regionOptions.decimalSeparator = localeData["en"].decimalSeparator;
    survey.regionOptions.datePattern = localeData["en"].datePattern;
    expect(survey.toJSON().regionOptions, "written").toEqual({ decimalSeparator: ".", datePattern: "mm/dd/yyyy" });
  });

  test("A second fromJSON that omits a child field does not leave the old value behind", () => {
    const survey = createSurvey({ regionOptions: { decimalSeparator: ",", thousandsSeparator: "." } });
    expect(renderNumber(survey), "first load").toBe("1.234,56");

    survey.fromJSON({ regionOptions: { decimalSeparator: "," } });
    expect(survey.regionOptions.thousandsSeparator, "the omitted field is unset").toBeUndefined();
    expect(survey.toJSON().regionOptions, "only the supplied field survives").toEqual({ decimalSeparator: "," });
    expect(renderNumber(survey), "grouping follows the locale again (the collision policy drops it)").toBe("1234,56");
  });

  test("A second fromJSON with an empty regionOptions object clears every field", () => {
    const survey = createSurvey({ regionOptions: { locale: "de", decimalSeparator: "*" } });
    survey.fromJSON({ regionOptions: {} });
    expect(survey["regionOptionsValue"], "the object still exists").toBeInstanceOf(RegionOptions);
    expect(survey.regionOptions.isEmpty, "but is empty").toBe(true);
    expect(survey.regionOptions.locale, "the locale is gone").toBeUndefined();
    expect(survey.toJSON().regionOptions, "and nothing is written").toBeUndefined();
    expect(renderNumber(survey), "english formats").toBe("1,234.56");
  });

  test("A second fromJSON that omits the whole object resets it to never created", () => {
    const survey = createSurvey({ regionOptions: { decimalSeparator: "*", thousandsSeparator: "|" } });
    const previous = survey.regionOptions;
    expect(renderNumber(survey), "overrides applied").toBe("1|234*56");

    survey.fromJSON({ title: "reloaded" });
    expect(survey["regionOptionsValue"], "the private value is undefined again").toBeUndefined();
    expect(previous.isDisposed, "the old object is disposed").toBe(true);
    expect(survey.toJSON().regionOptions, "no key").toBeUndefined();
    expect(survey.title, "the rest of the JSON loaded").toBe("reloaded");
    expect(renderNumber(survey), "locale defaults are back").toBe("1,234.56");
  });

  test("A null regionOptions in JSON counts as omitted", () => {
    const survey = createSurvey({ regionOptions: { decimalSeparator: "*" } });
    survey.fromJSON({ regionOptions: null });
    expect(survey["regionOptionsValue"], "reset").toBeUndefined();
    expect(renderNumber(survey), "locale defaults").toBe("1,234.56");
  });

  test("thousandsSeparator: \"\" survives a round trip and still disables grouping", () => {
    const survey = createSurvey();
    survey.regionOptions.thousandsSeparator = "";
    expect(survey.regionOptions.isEmpty, "an empty string is a stored value").toBe(false);
    expect(survey.toJSON().regionOptions, "written").toEqual({ thousandsSeparator: "" });
    expect(renderNumber(survey), "no grouping").toBe("1234.56");

    const copy = new SurveyModel(survey.toJSON());
    expect(copy.toJSON().regionOptions, "round trip").toEqual({ thousandsSeparator: "" });
    expect(renderNumber(copy), "no grouping after the round trip").toBe("1234.56");
  });

  test("The region locale is stored as unset when cleared, never as an empty string", () => {
    const survey = createSurvey();
    survey.regionOptions.locale = "de";
    expect(survey.toJSON().regionOptions, "set").toEqual({ locale: "de" });
    survey.regionOptions.locale = "";
    expect(survey.regionOptions.isEmpty, "cleared means unset").toBe(true);
    expect(survey.toJSON().regionOptions, "nothing written").toBeUndefined();
  });

  test("The private value is undefined until the property is read or JSON sets it", () => {
    const survey = createSurvey();
    expect(survey["regionOptionsValue"], "untouched").toBeUndefined();
    expect(survey.getFormatLocale(), "the format locale falls back to the survey locale").toBe(survey.locale);
    expect(survey["regionOptionsValue"], "resolving the format locale does not create it").toBeUndefined();
    expect(renderNumber(survey), "rendering a mask does not create it").toBe("1,234.56");
    expect(survey["regionOptionsValue"], "not created by the resolver").toBeUndefined();

    survey.regionOptions;
    expect(survey["regionOptionsValue"], "created by a read").toBeInstanceOf(RegionOptions);

    const loaded = createSurvey({ regionOptions: { datePattern: "yyyy-mm-dd" } });
    expect(loaded["regionOptionsValue"], "created by JSON").toBeInstanceOf(RegionOptions);
    expect(loaded["regionOptionsValue"].owner === loaded, "owned by the survey").toBe(true);
  });
});

describe("RegionOptions: precedence", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("decimalSeparator: authored beats the object, the object beats the locale table, the table beats english", () => {
    const survey = createSurvey();
    expect(renderNumber(survey), "english").toBe("1,234.56");
    survey.regionOptions.locale = "de";
    expect(renderNumber(survey), "the locale table").toBe("1.234,56");
    survey.regionOptions.decimalSeparator = "*";
    expect(renderNumber(survey), "the object").toBe("1.234*56");
    getQuestion(survey, "num").maskSettings["decimalSeparator"] = "#";
    expect(renderNumber(survey), "authored on the mask").toBe("1.234#56");
  });

  test("thousandsSeparator: authored beats the object, the object beats the locale table, the table beats english", () => {
    const survey = createSurvey();
    survey.regionOptions.locale = "de";
    expect(renderNumber(survey), "the locale table").toBe("1.234,56");
    survey.regionOptions.thousandsSeparator = "|";
    expect(renderNumber(survey), "the object").toBe("1|234,56");
    getQuestion(survey, "num").maskSettings["thousandsSeparator"] = "'";
    expect(renderNumber(survey), "authored on the mask").toBe("1'234,56");
  });

  test("datePattern: authored beats the object, the object beats the locale table, the table beats english", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "date");
    expect(q.inputValue, "english").toBe("mm/dd/yyyy");
    survey.regionOptions.locale = "de";
    expect(q.inputValue, "the locale table").toBe("dd.mm.yyyy");
    survey.regionOptions.datePattern = "yyyy-mm-dd";
    expect(q.inputValue, "the object").toBe("yyyy-mm-dd");
    q.maskSettings["pattern"] = "dd/mm/yyyy";
    expect(q.inputValue, "authored on the mask").toBe("dd/mm/yyyy");
  });

  test("timePattern: authored beats the object, the object beats the locale table, the table beats english", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "time");
    expect(q.inputValue, "english").toBe("hh:MM TT");
    survey.regionOptions.locale = "de";
    expect(q.inputValue, "the locale table").toBe("HH:MM");
    survey.regionOptions.timePattern = "hh.MM TT";
    expect(q.inputValue, "the object").toBe("hh.MM TT");
    q.maskSettings["pattern"] = "HH-MM";
    expect(q.inputValue, "authored on the mask").toBe("HH-MM");
  });

  test("currencyPattern: authored affixes beat the object, the object beats the locale table, the table beats english", () => {
    const survey = createSurvey();
    expect(renderNumber(survey, "cur"), "english").toBe(euro + "1,234.56");
    survey.regionOptions.locale = "de";
    expect(renderNumber(survey, "cur"), "the locale table").toBe("1.234,56" + nbsp + euro);
    survey.regionOptions.currencyPattern = "\u00A4 #";
    expect(renderNumber(survey, "cur"), "the object").toBe(euro + " 1.234,56");
    getQuestion(survey, "cur").maskSettings["prefix"] = "EUR ";
    expect(renderNumber(survey, "cur"), "authored on the mask").toBe("EUR 1.234,56");
  });

  test("The object applies with the survey locale when no region locale is set", () => {
    const survey = createSurvey();
    survey.locale = "de";
    expect(renderNumber(survey), "the survey locale").toBe("1.234,56");
    survey.regionOptions.thousandsSeparator = " ";
    expect(renderNumber(survey), "the object over the survey locale").toBe("1 234,56");
    survey.locale = "";
  });

  test("An invalid override falls through to the locale table", () => {
    const survey = createSurvey({ regionOptions: { locale: "de", datePattern: "abc", timePattern: "yyyy", decimalSeparator: "ab", thousandsSeparator: "12", currencyPattern: "##" } });
    expect(getQuestion(survey, "date").inputValue, "an unparseable date pattern").toBe("dd.mm.yyyy");
    expect(getQuestion(survey, "time").inputValue, "a time pattern without time fields").toBe("HH:MM");
    expect(renderNumber(survey), "two-character separators").toBe("1.234,56");
    expect(renderNumber(survey, "cur"), "a currency pattern with two numbers").toBe("1.234,56" + nbsp + euro);
    expect(survey.toJSON().regionOptions.decimalSeparator, "the rejected value is still stored").toBe("ab");
  });
});

describe("RegionOptions: the format locale", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("regionOptions.locale drives getFormatLocale() and outranks the survey locale", () => {
    const survey = createSurvey();
    survey.regionOptions.locale = "en-GB";
    expect(survey.getFormatLocale(), "the format locale").toBe("en-GB");
    survey.locale = "fr";
    expect(survey.getFormatLocale(), "regionOptions.locale outranks locale").toBe("en-GB");
    survey.regionOptions.locale = "";
    expect(survey.getFormatLocale(), "locale is used again").toBe("fr");
    survey.locale = "";
  });

  test("The region locale has one home, regionOptions.locale; the survey has no regionLocale property", () => {
    expect(Serializer.findProperty("survey", "regionLocale"), "no serializer entry").toBeFalsy();
    expect("regionLocale" in new SurveyModel(), "no accessor").toBe(false);
    const survey = createSurvey();
    survey.regionOptions.locale = "en-GB";
    expect(survey.toJSON().regionOptions, "inside the object").toEqual({ locale: "en-GB" });

    const loaded = createSurvey({ regionOptions: { locale: "en-GB" } });
    expect(loaded.regionOptions.locale, "loaded from the object").toBe("en-GB");
    expect(loaded.getFormatLocale(), "the format locale").toBe("en-GB");
    expect(getQuestion(loaded, "date").inputValue, "applied on load").toBe("dd/mm/yyyy");
  });
});

describe("RegionOptions: propagation", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("Changing a field rerenders an existing masked question and its input element without a locale event", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "num");
    const input = createInput();
    q.value = 1234.56;
    q.afterRenderQuestionElement(input);
    expect(input.value, "rendered").toBe("1,234.56");
    let localeEvents = 0;
    survey.onLocaleChangedEvent.add(() => localeEvents++);

    survey.regionOptions.decimalSeparator = ",";
    expect(q.inputValue, "the question rerendered (the collision policy drops grouping)").toBe("1234,56");
    expect(input.value, "the input element followed").toBe("1234,56");
    survey.regionOptions.thousandsSeparator = ".";
    expect(input.value, "and again").toBe("1.234,56");
    expect(q.value, "the stored value is untouched").toBe(1234.56);
    expect(localeEvents, "no locale event").toBe(0);
  });

  test("A change reaches every locale dependent mask", () => {
    const survey = createSurvey();
    survey.regionOptions.locale = "de";
    expect(getQuestion(survey, "date").inputValue, "date").toBe("dd.mm.yyyy");
    expect(getQuestion(survey, "time").inputValue, "time").toBe("HH:MM");
    expect(renderNumber(survey), "number").toBe("1.234,56");
    expect(renderNumber(survey, "cur"), "currency").toBe("1.234,56" + nbsp + euro);
  });

  test("Loading a survey from JSON does not trigger a rebuild per property", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "num");
    let rebuilds = 0;
    let localeEvents = 0;
    q.localeChangedCallback = () => rebuilds++;
    survey.onLocaleChangedEvent.add(() => localeEvents++);

    survey.fromJSON({ regionOptions: { locale: "de", decimalSeparator: "*", thousandsSeparator: "|", datePattern: "yyyy-mm-dd" } });
    expect(rebuilds, "one refresh after the load").toBe(1);
    expect(renderNumber(survey), "applied").toBe("1|234*56");

    survey.fromJSON({ regionOptions: { locale: "de", decimalSeparator: "*", thousandsSeparator: "|", datePattern: "yyyy-mm-dd" } });
    expect(rebuilds, "no refresh when nothing changed").toBe(1);
    expect(localeEvents, "no locale event").toBe(0);
  });

  test("A survey loaded from JSON renders correctly on first read with no refresh and no event", () => {
    const originalLocaleChanged = SurveyModel.prototype.localeChanged;
    let refreshes = 0;
    SurveyModel.prototype.localeChanged = function () {
      refreshes++;
      originalLocaleChanged.call(this);
    };
    try {
      let localeEvents = 0;
      // the options are in place before the elements load, so every mask resolves correctly the
      // first time and nothing has to be rebuilt afterwards - including the time question, whose
      // authored preset makes its mask resolve while its own settings load
      const survey = createSurvey({ regionOptions: { locale: "de", decimalSeparator: "*", timePattern: "hh.MM TT" } });
      survey.onLocaleChangedEvent.add(() => localeEvents++);
      expect(refreshes, "nothing to refresh on a fresh load").toBe(0);
      expect(renderNumber(survey), "correct on first read").toBe("1.234*56");
      expect(getQuestion(survey, "date").inputValue, "the date too").toBe("dd.mm.yyyy");
      expect(getQuestion(survey, "time").inputValue, "and the mask that resolved during the load").toBe("hh.MM TT");
      expect(localeEvents, "no locale event").toBe(0);

      createSurvey();
      createSurvey({ regionOptions: {} });
      expect(refreshes, "nor without region options or with an empty object").toBe(0);
    } finally {
      SurveyModel.prototype.localeChanged = originalLocaleChanged;
    }
  });

  test("Replacing the whole object through the setter refreshes once without a locale event", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "num");
    const input = createInput();
    q.value = 1234.56;
    q.afterRenderQuestionElement(input);
    survey.regionOptions.thousandsSeparator = "'";
    expect(input.value, "before").toBe("1'234.56");
    let rebuilds = 0;
    let localeEvents = 0;
    q.localeChangedCallback = () => rebuilds++;
    survey.onLocaleChangedEvent.add(() => localeEvents++);

    const other = new RegionOptions();
    other.decimalSeparator = ",";
    other.thousandsSeparator = ".";
    survey.regionOptions = other;
    expect(survey.regionOptions === other, "the survey keeps its own object").toBe(false);
    expect(rebuilds, "one refresh").toBe(1);
    expect(input.value, "the input element followed").toBe("1.234,56");
    expect(survey.toJSON().regionOptions, "the replacement is complete").toEqual({ decimalSeparator: ",", thousandsSeparator: "." });
    expect(localeEvents, "no locale event").toBe(0);
  });

  test("Replacing the object through the serializer at runtime behaves like the setter", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "num");
    const input = createInput();
    q.value = 1234.56;
    q.afterRenderQuestionElement(input);
    survey.regionOptions.thousandsSeparator = "'";
    let rebuilds = 0;
    q.localeChangedCallback = () => rebuilds++;

    Serializer.findProperty("survey", "regionOptions").setValue(survey, { decimalSeparator: "," }, null);
    expect(rebuilds, "one refresh").toBe(1);
    expect(survey.regionOptions.thousandsSeparator, "the omitted field is cleared").toBeUndefined();
    expect(input.value, "the input element followed").toBe("1234,56");
  });

  test("Reloading only regionOptions refreshes a retained question whose cache is populated", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "num");
    const input = createInput();
    q.value = 1234.56;
    q.afterRenderQuestionElement(input);
    expect(input.value, "the cache is primed").toBe("1,234.56");
    let rebuilds = 0;
    let localeEvents = 0;
    q.localeChangedCallback = () => rebuilds++;
    survey.onLocaleChangedEvent.add(() => localeEvents++);

    survey.fromJSON({ regionOptions: { decimalSeparator: "," } });
    expect(getQuestion(survey, "num") === q, "the question is retained").toBe(true);
    expect(rebuilds, "one refresh").toBe(1);
    expect(q.inputValue, "the question uses the new separator").toBe("1234,56");
    expect(input.value, "the input element too").toBe("1234,56");

    survey.fromJSON({ title: "no overrides" });
    expect(rebuilds, "one more refresh for the removal").toBe(2);
    expect(input.value, "locale defaults are back").toBe("1,234.56");
    expect(localeEvents, "no locale event").toBe(0);
  });

  test("A JSON loaded into the object directly refreshes the masks once", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "num");
    const input = createInput();
    q.value = 1234.56;
    q.afterRenderQuestionElement(input);
    expect(input.value, "the cache is primed").toBe("1,234.56");
    let rebuilds = 0;
    let localeEvents = 0;
    q.localeChangedCallback = () => rebuilds++;
    survey.onLocaleChangedEvent.add(() => localeEvents++);

    // the object loads its own JSON, which fires no property events of its own
    survey.regionOptions.fromJSON({ decimalSeparator: "*" });
    expect(survey.regionOptions.decimalSeparator, "the option is applied").toBe("*");
    expect(rebuilds, "one refresh").toBe(1);
    expect(q.inputValue, "the question uses the new separator").toBe("1,234*56");
    expect(input.value, "the input element too").toBe("1,234*56");

    survey.regionOptions.fromJSON({ locale: "de", thousandsSeparator: " " });
    expect(rebuilds, "one refresh per load, whatever it carries").toBe(2);
    expect(input.value, "both fields applied, the previous one kept").toBe("1 234*56");
    expect(localeEvents, "no locale event").toBe(0);
  });

  test("A JSON that changes nothing in the object refreshes nothing", () => {
    const survey = createSurvey({ regionOptions: { decimalSeparator: "*" } });
    const q = getQuestion(survey, "num");
    expect(renderNumber(survey), "the cache is primed").toBe("1,234*56");
    let rebuilds = 0;
    q.localeChangedCallback = () => rebuilds++;

    survey.regionOptions.fromJSON({});
    survey.regionOptions.fromJSON({ decimalSeparator: "*" });
    expect(rebuilds, "no refresh").toBe(0);
  });
});

describe("RegionOptions: JSON key order", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  // saveMaskedValue stores the text the respondent sees, so this default is parsed with whatever
  // separators are in place when the question loads; the wrong ones corrupt the stored value
  const maskedDefault = () => ({ type: "text", name: "num", maskType: "numeric", defaultValue: "1.234,56", maskSettings: { saveMaskedValue: true } });
  const separators = { decimalSeparator: ",", thousandsSeparator: "." };

  test("A masked default value is not corrupted when the elements are loaded first", () => {
    const optionsFirst = new SurveyModel({ regionOptions: separators, elements: [maskedDefault()] });
    const elementsFirst = new SurveyModel({ elements: [maskedDefault()], regionOptions: separators });
    const optionsFirstQuestion = getQuestion(optionsFirst, "num");
    const elementsFirstQuestion = getQuestion(elementsFirst, "num");

    expect(optionsFirstQuestion.value, "the stored value, options first").toBe("1.234,56");
    expect(elementsFirstQuestion.value, "the stored value, elements first").toBe("1.234,56");
    expect(elementsFirstQuestion.inputValue, "the displayed value, elements first").toBe(optionsFirstQuestion.inputValue);
    expect(elementsFirstQuestion.toJSON().defaultValue, "and it round-trips").toBe("1.234,56");
  });

  test("The region locale applies to a mask declared before it", () => {
    const json = (regionOptionsFirst: boolean): any => {
      const elements = [{ type: "text", name: "date", maskType: "datetime" }];
      return regionOptionsFirst
        ? { regionOptions: { locale: "en-GB" }, elements: elements }
        : { elements: elements, regionOptions: { locale: "en-GB" } };
    };
    expect(getQuestion(new SurveyModel(json(true)), "date").inputValue, "options first").toBe("dd/mm/yyyy");
    expect(getQuestion(new SurveyModel(json(false)), "date").inputValue, "elements first").toBe("dd/mm/yyyy");
  });

  test("Every field resolves from the object whichever key comes first", () => {
    const options = { locale: "de", datePattern: "yyyy-mm-dd", timePattern: "hh.MM TT", decimalSeparator: "*", thousandsSeparator: "|", currencyPattern: "\u00A4 #" };
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "num", maskType: "numeric" },
        { type: "text", name: "cur", maskType: "currency", maskSettings: { currencySymbol: euro } },
        { type: "text", name: "date", maskType: "datetime" },
        { type: "text", name: "time", maskType: "datetime", maskSettings: { patternPreset: "localeTime" } },
      ],
      regionOptions: options
    });
    expect(getQuestion(survey, "date").inputValue, "date").toBe("yyyy-mm-dd");
    expect(getQuestion(survey, "time").inputValue, "time").toBe("hh.MM TT");
    expect(renderNumber(survey), "number").toBe("1|234*56");
    expect(renderNumber(survey, "cur"), "currency").toBe("" + euro + " 1|234*56");
  });
});

describe("RegionOptions: parent notifications", () => {
  test("A child assignment emits onNestedPropertyChanged on the survey", () => {
    const survey = createSurvey();
    const nested: Array<any> = [];
    const direct: Array<string> = [];
    survey.onNestedPropertyChanged.add((_, options) => nested.push(options));
    survey.onPropertyChanged.add((_, options) => direct.push(options.name));

    survey.regionOptions.decimalSeparator = ",";
    expect(nested, "the nested payload").toEqual([{ name: "regionOptions", nestedName: "decimalSeparator", newValue: "," }]);
    expect(direct.indexOf("regionOptions"), "no direct survey property change").toBe(-1);
  });

  test("Whole-object replacement emits one onPropertyChanged with the old and the populated new objects", () => {
    const survey = createSurvey();
    survey.regionOptions.locale = "de";
    const before = survey.regionOptions;
    const changes: Array<any> = [];
    survey.onPropertyChanged.add((_, options) => {
      if (options.name === "regionOptions") changes.push(options);
    });

    const other = new RegionOptions();
    other.decimalSeparator = ",";
    survey.regionOptions = other;
    expect(changes.length, "one notification for the setter").toBe(1);
    expect(changes[0].oldValue === before, "the old object").toBe(true);
    expect(changes[0].newValue === survey.regionOptions, "the new object").toBe(true);
    expect(changes[0].newValue.decimalSeparator, "populated before the notification").toBe(",");
    expect(changes[0].newValue.locale, "the omitted field is not carried over").toBeUndefined();

    Serializer.findProperty("survey", "regionOptions").setValue(survey, { thousandsSeparator: "." }, null);
    expect(changes.length, "one notification for the serializer").toBe(2);
    expect(changes[1].oldValue === changes[0].newValue, "the previous object").toBe(true);
    expect(changes[1].newValue.thousandsSeparator, "populated").toBe(".");
  });

  test("Survey deserialization suppresses the runtime notifications, the omitted-object reset included", () => {
    const survey = createSurvey({ regionOptions: { decimalSeparator: "," } });
    const events: Array<string> = [];
    survey.onPropertyChanged.add((_, options) => { if (options.name === "regionOptions") events.push("direct"); });
    survey.onNestedPropertyChanged.add(() => events.push("nested"));

    survey.fromJSON({ regionOptions: { decimalSeparator: "*", thousandsSeparator: "|" } });
    survey.fromJSON({ title: "reset" });
    expect(events, "nothing fired").toEqual([]);
  });
});

describe("RegionOptions: metadata for the Creator", () => {
  test("The serializer reports the type, category and length limits the property grid relies on", () => {
    const maxLengths: { [name: string]: number } = { decimalSeparator: 1, thousandsSeparator: 1 };
    const props = Serializer.getProperties("regionoptions");
    expect(props.map(p => p.name), "the six properties in order").toEqual(["locale", "datePattern", "timePattern", "decimalSeparator", "thousandsSeparator", "currencyPattern"]);
    props.forEach(prop => {
      expect(prop.type, prop.name + " type").toBe("string");
      expect(prop.category, prop.name + " category").toBe(regionOptionsCategory);
      expect(prop.visible, prop.name + " visible").toBe(true);
      expect(prop.maxLength, prop.name + " maxLength").toBe(maxLengths[prop.name] !== undefined ? maxLengths[prop.name] : -1);
    });
    const surveyProp = Serializer.findProperty("survey", "regionOptions");
    expect(surveyProp.visible, "the survey property is visible").toBe(true);
    expect(surveyProp.className, "its class").toBe("regionoptions");
    expect(Serializer.createClass("regionoptions"), "creatable by name").toBeInstanceOf(RegionOptions);
  });

  test("The locale choice list is the curated locale data", () => {
    const localeProp = Serializer.findProperty("regionoptions", "locale");
    const choices = localeProp.getChoices(null);
    expect(choices.length, "non-empty").toBeGreaterThan(0);
    expect(choices, "the curated keys").toEqual(getLocaleDataLocales());
    expect(choices.indexOf("en-gb") >= 0, "contains a regional entry").toBe(true);
    expect(choices.indexOf("de") >= 0, "contains a language entry").toBe(true);
    expect(choices, "the same set as the table").toEqual(Object.keys(localeData));
  });
});
