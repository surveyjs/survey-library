import { SurveyModel } from "../src/survey";
import { QuestionTextModel } from "../src/question_text";
import { RegionalFormat, regionalFormatCategory } from "../src/regional-format";
import { Serializer } from "../src/jsonobject";
import { localeData, getLocaleDataLocales, getLocaleDataValue, findLocaleDataKey, canonicalizeLocale } from "../src/locale-data";
import { surveyLocalization } from "../src/surveyStrings";
import "../src/localization/german";

import { describe, test, expect, afterEach } from "vitest";

const euro = "\u20AC";
const pound = "\u00A3";
const peso = "\u20B1";

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

describe("RegionalFormat: serialization", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("An untouched survey has no regionalFormat key, including after the property has been read", () => {
    const survey = createSurvey();
    expect(survey.toJSON().regionalFormat, "never read").toBeUndefined();
    const options = survey.regionalFormat;
    expect(options, "reading creates the object").toBeInstanceOf(RegionalFormat);
    expect(options.isEmpty, "the created object is empty").toBe(true);
    expect(survey.toJSON().regionalFormat, "read but empty").toBeUndefined();
    expect(Object.keys(survey.toJSON()).indexOf("regionalFormat"), "no key at all").toBe(-1);
  });

  test("Setting one field serializes only that field and the round trip is stable", () => {
    const survey = createSurvey();
    survey.regionalFormat.decimalSeparator = ",";
    expect(survey.toJSON().regionalFormat, "one field").toEqual({ decimalSeparator: "," });

    const copy = new SurveyModel(survey.toJSON());
    expect(copy.toJSON().regionalFormat, "stable").toEqual({ decimalSeparator: "," });
    expect(copy.regionalFormat.decimalSeparator, "loaded").toBe(",");
    expect(copy.regionalFormat.thousandsSeparator, "the others stay unset").toBeUndefined();
  });

  test("A field set equal to the locale's own value is still written", () => {
    const survey = createSurvey();
    survey.regionalFormat.decimalSeparator = localeData["en"].decimalSeparator;
    survey.regionalFormat.datePattern = localeData["en"].datePattern;
    expect(survey.toJSON().regionalFormat, "written").toEqual({ decimalSeparator: ".", datePattern: "mm/dd/yyyy" });
  });

  test("A second fromJSON that omits a child field does not leave the old value behind", () => {
    const survey = createSurvey({ regionalFormat: { decimalSeparator: ",", thousandsSeparator: "." } });
    expect(renderNumber(survey), "first load").toBe("1.234,56");

    survey.fromJSON({ regionalFormat: { decimalSeparator: "," } });
    expect(survey.regionalFormat.thousandsSeparator, "the omitted field is unset").toBeUndefined();
    expect(survey.toJSON().regionalFormat, "only the supplied field survives").toEqual({ decimalSeparator: "," });
    expect(renderNumber(survey), "grouping follows the locale again (the collision policy drops it)").toBe("1234,56");
  });

  test("A second fromJSON with an empty regionalFormat object clears every field", () => {
    const survey = createSurvey({ regionalFormat: { locale: "de", decimalSeparator: "*" } });
    survey.fromJSON({ regionalFormat: {} });
    expect(survey["regionalFormatValue"], "the object still exists").toBeInstanceOf(RegionalFormat);
    expect(survey.regionalFormat.isEmpty, "but is empty").toBe(true);
    expect(survey.regionalFormat.locale, "the locale is gone").toBeUndefined();
    expect(survey.toJSON().regionalFormat, "and nothing is written").toBeUndefined();
    expect(renderNumber(survey), "english formats").toBe("1,234.56");
  });

  test("A second fromJSON that omits the whole object resets it to never created", () => {
    const survey = createSurvey({ regionalFormat: { decimalSeparator: "*", thousandsSeparator: "|" } });
    const previous = survey.regionalFormat;
    expect(renderNumber(survey), "overrides applied").toBe("1|234*56");

    survey.fromJSON({ title: "reloaded" });
    expect(survey["regionalFormatValue"], "the private value is undefined again").toBeUndefined();
    expect(previous.isDisposed, "the old object is disposed").toBe(true);
    expect(survey.toJSON().regionalFormat, "no key").toBeUndefined();
    expect(survey.title, "the rest of the JSON loaded").toBe("reloaded");
    expect(renderNumber(survey), "locale defaults are back").toBe("1,234.56");
  });

  test("A null regionalFormat in JSON counts as omitted", () => {
    const survey = createSurvey({ regionalFormat: { decimalSeparator: "*" } });
    survey.fromJSON({ regionalFormat: null });
    expect(survey["regionalFormatValue"], "reset").toBeUndefined();
    expect(renderNumber(survey), "locale defaults").toBe("1,234.56");
  });

  test("thousandsSeparator: \"\" survives a round trip and still disables grouping", () => {
    const survey = createSurvey();
    survey.regionalFormat.thousandsSeparator = "";
    expect(survey.regionalFormat.isEmpty, "an empty string is a stored value").toBe(false);
    expect(survey.toJSON().regionalFormat, "written").toEqual({ thousandsSeparator: "" });
    expect(renderNumber(survey), "no grouping").toBe("1234.56");

    const copy = new SurveyModel(survey.toJSON());
    expect(copy.toJSON().regionalFormat, "round trip").toEqual({ thousandsSeparator: "" });
    expect(renderNumber(copy), "no grouping after the round trip").toBe("1234.56");
  });

  test("The region locale is stored as unset when cleared, never as an empty string", () => {
    const survey = createSurvey();
    survey.regionalFormat.locale = "de";
    expect(survey.toJSON().regionalFormat, "set").toEqual({ locale: "de" });
    survey.regionalFormat.locale = "";
    expect(survey.regionalFormat.isEmpty, "cleared means unset").toBe(true);
    expect(survey.toJSON().regionalFormat, "nothing written").toBeUndefined();
  });

  test("The private value is undefined until the property is read or JSON sets it", () => {
    const survey = createSurvey();
    expect(survey["regionalFormatValue"], "untouched").toBeUndefined();
    expect(survey.getFormatLocale(), "the format locale falls back to the survey locale").toBe(survey.locale);
    expect(survey["regionalFormatValue"], "resolving the format locale does not create it").toBeUndefined();
    expect(renderNumber(survey), "rendering a mask does not create it").toBe("1,234.56");
    expect(survey["regionalFormatValue"], "not created by the resolver").toBeUndefined();

    survey.regionalFormat;
    expect(survey["regionalFormatValue"], "created by a read").toBeInstanceOf(RegionalFormat);

    const loaded = createSurvey({ regionalFormat: { datePattern: "yyyy-mm-dd" } });
    expect(loaded["regionalFormatValue"], "created by JSON").toBeInstanceOf(RegionalFormat);
    expect(loaded["regionalFormatValue"].owner === loaded, "owned by the survey").toBe(true);
  });
});

describe("RegionalFormat: precedence", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("decimalSeparator: authored beats the object, the object beats the locale table, the table beats english", () => {
    const survey = createSurvey();
    expect(renderNumber(survey), "english").toBe("1,234.56");
    survey.regionalFormat.locale = "de";
    expect(renderNumber(survey), "the locale table").toBe("1.234,56");
    survey.regionalFormat.decimalSeparator = "*";
    expect(renderNumber(survey), "the object").toBe("1.234*56");
    getQuestion(survey, "num").maskSettings["decimalSeparator"] = "#";
    expect(renderNumber(survey), "authored on the mask").toBe("1.234#56");
  });

  test("thousandsSeparator: authored beats the object, the object beats the locale table, the table beats english", () => {
    const survey = createSurvey();
    survey.regionalFormat.locale = "de";
    expect(renderNumber(survey), "the locale table").toBe("1.234,56");
    survey.regionalFormat.thousandsSeparator = "|";
    expect(renderNumber(survey), "the object").toBe("1|234,56");
    getQuestion(survey, "num").maskSettings["thousandsSeparator"] = "'";
    expect(renderNumber(survey), "authored on the mask").toBe("1'234,56");
  });

  test("datePattern: authored beats the object, the object beats the locale table, the table beats english", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "date");
    expect(q.inputValue, "english").toBe("mm/dd/yyyy");
    survey.regionalFormat.locale = "de";
    expect(q.inputValue, "the locale table").toBe("dd.mm.yyyy");
    survey.regionalFormat.datePattern = "yyyy-mm-dd";
    expect(q.inputValue, "the object").toBe("yyyy-mm-dd");
    q.maskSettings["pattern"] = "dd/mm/yyyy";
    expect(q.inputValue, "authored on the mask").toBe("dd/mm/yyyy");
  });

  test("timePattern: authored beats the object, the object beats the locale table, the table beats english", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "time");
    expect(q.inputValue, "english").toBe("hh:MM TT");
    survey.regionalFormat.locale = "de";
    expect(q.inputValue, "the locale table").toBe("HH:MM");
    survey.regionalFormat.timePattern = "hh.MM TT";
    expect(q.inputValue, "the object").toBe("hh.MM TT");
    q.maskSettings["pattern"] = "HH-MM";
    expect(q.inputValue, "authored on the mask").toBe("HH-MM");
  });

  test("currencyPattern: authored affixes beat the object, the object beats the locale table, the table beats english", () => {
    const survey = createSurvey();
    expect(renderNumber(survey, "cur"), "english").toBe(euro + "1,234.56");
    survey.regionalFormat.locale = "de";
    expect(renderNumber(survey, "cur"), "the locale table").toBe("1.234,56 " + euro);
    survey.regionalFormat.currencyPattern = "@ #";
    expect(renderNumber(survey, "cur"), "the object").toBe(euro + " 1.234,56");
    getQuestion(survey, "cur").maskSettings["prefix"] = "EUR ";
    expect(renderNumber(survey, "cur"), "authored on the mask").toBe("EUR 1.234,56");
  });

  test("The object applies with the survey locale when no region locale is set", () => {
    const survey = createSurvey();
    survey.locale = "de";
    expect(renderNumber(survey), "the survey locale").toBe("1.234,56");
    survey.regionalFormat.thousandsSeparator = " ";
    expect(renderNumber(survey), "the object over the survey locale").toBe("1 234,56");
    survey.locale = "";
  });

  test("An invalid override falls through to the locale table", () => {
    const survey = createSurvey({ regionalFormat: { locale: "de", datePattern: "abc", timePattern: "yyyy", decimalSeparator: "ab", thousandsSeparator: "12", currencyPattern: "##" } });
    expect(getQuestion(survey, "date").inputValue, "an unparseable date pattern").toBe("dd.mm.yyyy");
    expect(getQuestion(survey, "time").inputValue, "a time pattern without time fields").toBe("HH:MM");
    expect(renderNumber(survey), "two-character separators").toBe("1.234,56");
    expect(renderNumber(survey, "cur"), "a currency pattern with two numbers").toBe("1.234,56 " + euro);
    expect(survey.toJSON().regionalFormat.decimalSeparator, "the rejected value is still stored").toBe("ab");
  });
});

describe("RegionalFormat: the format locale", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("regionalFormat.locale drives getFormatLocale() and outranks the survey locale", () => {
    const survey = createSurvey();
    survey.regionalFormat.locale = "en-GB";
    expect(survey.getFormatLocale(), "the format locale").toBe("en-GB");
    survey.locale = "fr";
    expect(survey.getFormatLocale(), "regionalFormat.locale outranks locale").toBe("en-GB");
    survey.regionalFormat.locale = "";
    expect(survey.getFormatLocale(), "locale is used again").toBe("fr");
    survey.locale = "";
  });

  test("The region locale has one home, regionalFormat.locale; the survey has no regionLocale property", () => {
    expect(Serializer.findProperty("survey", "regionLocale"), "no serializer entry").toBeFalsy();
    expect("regionLocale" in new SurveyModel(), "no accessor").toBe(false);
    const survey = createSurvey();
    survey.regionalFormat.locale = "en-GB";
    expect(survey.toJSON().regionalFormat, "inside the object").toEqual({ locale: "en-GB" });

    const loaded = createSurvey({ regionalFormat: { locale: "en-GB" } });
    expect(loaded.regionalFormat.locale, "loaded from the object").toBe("en-GB");
    expect(loaded.getFormatLocale(), "the format locale").toBe("en-GB");
    expect(getQuestion(loaded, "date").inputValue, "applied on load").toBe("dd/mm/yyyy");
  });
});

describe("RegionalFormat: propagation", () => {
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

    survey.regionalFormat.decimalSeparator = ",";
    expect(q.inputValue, "the question rerendered (the collision policy drops grouping)").toBe("1234,56");
    expect(input.value, "the input element followed").toBe("1234,56");
    survey.regionalFormat.thousandsSeparator = ".";
    expect(input.value, "and again").toBe("1.234,56");
    expect(q.value, "the stored value is untouched").toBe(1234.56);
    expect(localeEvents, "no locale event").toBe(0);
  });

  test("A change reaches every locale dependent mask", () => {
    const survey = createSurvey();
    survey.regionalFormat.locale = "de";
    expect(getQuestion(survey, "date").inputValue, "date").toBe("dd.mm.yyyy");
    expect(getQuestion(survey, "time").inputValue, "time").toBe("HH:MM");
    expect(renderNumber(survey), "number").toBe("1.234,56");
    expect(renderNumber(survey, "cur"), "currency").toBe("1.234,56 " + euro);
  });

  test("Loading a survey from JSON does not trigger a rebuild per property", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "num");
    let rebuilds = 0;
    let localeEvents = 0;
    q.localeChangedCallback = () => rebuilds++;
    survey.onLocaleChangedEvent.add(() => localeEvents++);

    survey.fromJSON({ regionalFormat: { locale: "de", decimalSeparator: "*", thousandsSeparator: "|", datePattern: "yyyy-mm-dd" } });
    expect(rebuilds, "one refresh after the load").toBe(1);
    expect(renderNumber(survey), "applied").toBe("1|234*56");

    survey.fromJSON({ regionalFormat: { locale: "de", decimalSeparator: "*", thousandsSeparator: "|", datePattern: "yyyy-mm-dd" } });
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
      const survey = createSurvey({ regionalFormat: { locale: "de", decimalSeparator: "*", timePattern: "hh.MM TT" } });
      survey.onLocaleChangedEvent.add(() => localeEvents++);
      expect(refreshes, "nothing to refresh on a fresh load").toBe(0);
      expect(renderNumber(survey), "correct on first read").toBe("1.234*56");
      expect(getQuestion(survey, "date").inputValue, "the date too").toBe("dd.mm.yyyy");
      expect(getQuestion(survey, "time").inputValue, "and the mask that resolved during the load").toBe("hh.MM TT");
      expect(localeEvents, "no locale event").toBe(0);

      createSurvey();
      createSurvey({ regionalFormat: {} });
      expect(refreshes, "nor without a regional format or with an empty object").toBe(0);
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
    survey.regionalFormat.thousandsSeparator = "'";
    expect(input.value, "before").toBe("1'234.56");
    let rebuilds = 0;
    let localeEvents = 0;
    q.localeChangedCallback = () => rebuilds++;
    survey.onLocaleChangedEvent.add(() => localeEvents++);

    const other = new RegionalFormat();
    other.decimalSeparator = ",";
    other.thousandsSeparator = ".";
    survey.regionalFormat = other;
    expect(survey.regionalFormat === other, "the survey keeps its own object").toBe(false);
    expect(rebuilds, "one refresh").toBe(1);
    expect(input.value, "the input element followed").toBe("1.234,56");
    expect(survey.toJSON().regionalFormat, "the replacement is complete").toEqual({ decimalSeparator: ",", thousandsSeparator: "." });
    expect(localeEvents, "no locale event").toBe(0);
  });

  test("Replacing the object through the serializer at runtime behaves like the setter", () => {
    const survey = createSurvey();
    const q = getQuestion(survey, "num");
    const input = createInput();
    q.value = 1234.56;
    q.afterRenderQuestionElement(input);
    survey.regionalFormat.thousandsSeparator = "'";
    let rebuilds = 0;
    q.localeChangedCallback = () => rebuilds++;

    Serializer.findProperty("survey", "regionalFormat").setValue(survey, { decimalSeparator: "," }, null);
    expect(rebuilds, "one refresh").toBe(1);
    expect(survey.regionalFormat.thousandsSeparator, "the omitted field is cleared").toBeUndefined();
    expect(input.value, "the input element followed").toBe("1234,56");
  });

  test("Reloading only regionalFormat refreshes a retained question whose cache is populated", () => {
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

    survey.fromJSON({ regionalFormat: { decimalSeparator: "," } });
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
    survey.regionalFormat.fromJSON({ decimalSeparator: "*" });
    expect(survey.regionalFormat.decimalSeparator, "the option is applied").toBe("*");
    expect(rebuilds, "one refresh").toBe(1);
    expect(q.inputValue, "the question uses the new separator").toBe("1,234*56");
    expect(input.value, "the input element too").toBe("1,234*56");

    survey.regionalFormat.fromJSON({ locale: "de", thousandsSeparator: " " });
    expect(rebuilds, "one refresh per load, whatever it carries").toBe(2);
    expect(input.value, "both fields applied, the previous one kept").toBe("1 234*56");
    expect(localeEvents, "no locale event").toBe(0);
  });

  test("A JSON that changes nothing in the object refreshes nothing", () => {
    const survey = createSurvey({ regionalFormat: { decimalSeparator: "*" } });
    const q = getQuestion(survey, "num");
    expect(renderNumber(survey), "the cache is primed").toBe("1,234*56");
    let rebuilds = 0;
    q.localeChangedCallback = () => rebuilds++;

    survey.regionalFormat.fromJSON({});
    survey.regionalFormat.fromJSON({ decimalSeparator: "*" });
    expect(rebuilds, "no refresh").toBe(0);
  });
});

describe("RegionalFormat: JSON key order", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  // saveMaskedValue stores the text the respondent sees, so this default is parsed with whatever
  // separators are in place when the question loads; the wrong ones corrupt the stored value
  const maskedDefault = () => ({ type: "text", name: "num", maskType: "numeric", defaultValue: "1.234,56", maskSettings: { saveMaskedValue: true } });
  const separators = { decimalSeparator: ",", thousandsSeparator: "." };

  test("A masked default value is not corrupted when the elements are loaded first", () => {
    const optionsFirst = new SurveyModel({ regionalFormat: separators, elements: [maskedDefault()] });
    const elementsFirst = new SurveyModel({ elements: [maskedDefault()], regionalFormat: separators });
    const optionsFirstQuestion = getQuestion(optionsFirst, "num");
    const elementsFirstQuestion = getQuestion(elementsFirst, "num");

    expect(optionsFirstQuestion.value, "the stored value, options first").toBe("1.234,56");
    expect(elementsFirstQuestion.value, "the stored value, elements first").toBe("1.234,56");
    expect(elementsFirstQuestion.inputValue, "the displayed value, elements first").toBe(optionsFirstQuestion.inputValue);
    expect(elementsFirstQuestion.toJSON().defaultValue, "and it round-trips").toBe("1.234,56");
  });

  test("The region locale applies to a mask declared before it", () => {
    const json = (regionalFormatFirst: boolean): any => {
      const elements = [{ type: "text", name: "date", maskType: "datetime" }];
      return regionalFormatFirst
        ? { regionalFormat: { locale: "en-GB" }, elements: elements }
        : { elements: elements, regionalFormat: { locale: "en-GB" } };
    };
    expect(getQuestion(new SurveyModel(json(true)), "date").inputValue, "options first").toBe("dd/mm/yyyy");
    expect(getQuestion(new SurveyModel(json(false)), "date").inputValue, "elements first").toBe("dd/mm/yyyy");
  });

  test("Every field resolves from the object whichever key comes first", () => {
    const options = { locale: "de", datePattern: "yyyy-mm-dd", timePattern: "hh.MM TT", decimalSeparator: "*", thousandsSeparator: "|", currencyPattern: "@ #" };
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "num", maskType: "numeric" },
        { type: "text", name: "cur", maskType: "currency", maskSettings: { currencySymbol: euro } },
        { type: "text", name: "date", maskType: "datetime" },
        { type: "text", name: "time", maskType: "datetime", maskSettings: { patternPreset: "localeTime" } },
      ],
      regionalFormat: options
    });
    expect(getQuestion(survey, "date").inputValue, "date").toBe("yyyy-mm-dd");
    expect(getQuestion(survey, "time").inputValue, "time").toBe("hh.MM TT");
    expect(renderNumber(survey), "number").toBe("1|234*56");
    expect(renderNumber(survey, "cur"), "currency").toBe("" + euro + " 1|234*56");
  });
});

describe("RegionalFormat: parent notifications", () => {
  test("A child assignment emits onNestedPropertyChanged on the survey", () => {
    const survey = createSurvey();
    const nested: Array<any> = [];
    const direct: Array<string> = [];
    survey.onNestedPropertyChanged.add((_, options) => nested.push(options));
    survey.onPropertyChanged.add((_, options) => direct.push(options.name));

    survey.regionalFormat.decimalSeparator = ",";
    expect(nested, "the nested payload").toEqual([{ name: "regionalFormat", nestedName: "decimalSeparator", newValue: "," }]);
    expect(direct.indexOf("regionalFormat"), "no direct survey property change").toBe(-1);
  });

  test("Whole-object replacement emits one onPropertyChanged with the old and the populated new objects", () => {
    const survey = createSurvey();
    survey.regionalFormat.locale = "de";
    const before = survey.regionalFormat;
    const changes: Array<any> = [];
    survey.onPropertyChanged.add((_, options) => {
      if (options.name === "regionalFormat") changes.push(options);
    });

    const other = new RegionalFormat();
    other.decimalSeparator = ",";
    survey.regionalFormat = other;
    expect(changes.length, "one notification for the setter").toBe(1);
    expect(changes[0].oldValue === before, "the old object").toBe(true);
    expect(changes[0].newValue === survey.regionalFormat, "the new object").toBe(true);
    expect(changes[0].newValue.decimalSeparator, "populated before the notification").toBe(",");
    expect(changes[0].newValue.locale, "the omitted field is not carried over").toBeUndefined();

    Serializer.findProperty("survey", "regionalFormat").setValue(survey, { thousandsSeparator: "." }, null);
    expect(changes.length, "one notification for the serializer").toBe(2);
    expect(changes[1].oldValue === changes[0].newValue, "the previous object").toBe(true);
    expect(changes[1].newValue.thousandsSeparator, "populated").toBe(".");
  });

  test("Survey deserialization suppresses the runtime notifications, the omitted-object reset included", () => {
    const survey = createSurvey({ regionalFormat: { decimalSeparator: "," } });
    const events: Array<string> = [];
    survey.onPropertyChanged.add((_, options) => { if (options.name === "regionalFormat") events.push("direct"); });
    survey.onNestedPropertyChanged.add(() => events.push("nested"));

    survey.fromJSON({ regionalFormat: { decimalSeparator: "*", thousandsSeparator: "|" } });
    survey.fromJSON({ title: "reset" });
    expect(events, "nothing fired").toEqual([]);
  });
});

describe("RegionalFormat: metadata for the Creator", () => {
  test("The serializer reports the type, category and length limits the property grid relies on", () => {
    const maxLengths: { [name: string]: number } = { decimalSeparator: 1, thousandsSeparator: 1 };
    const props = Serializer.getProperties("regionalformat");
    expect(props.map(p => p.name), "the seven properties in order").toEqual(["locale", "datePattern", "timePattern", "decimalSeparator", "thousandsSeparator", "currencySymbol", "currencyPattern"]);
    props.forEach(prop => {
      expect(prop.type, prop.name + " type").toBe("string");
      expect(prop.category, prop.name + " category").toBe(regionalFormatCategory);
      expect(prop.visible, prop.name + " visible").toBe(true);
      expect(prop.maxLength, prop.name + " maxLength").toBe(maxLengths[prop.name] !== undefined ? maxLengths[prop.name] : -1);
    });
    const surveyProp = Serializer.findProperty("survey", "regionalFormat");
    expect(surveyProp.visible, "the survey property is visible").toBe(true);
    expect(surveyProp.className, "its class").toBe("regionalformat");
    expect(Serializer.createClass("regionalformat"), "creatable by name").toBeInstanceOf(RegionalFormat);
  });

  test("The locale choice list is the curated locale data", () => {
    const localeProp = Serializer.findProperty("regionalformat", "locale");
    const choices = localeProp.getChoices(null);
    expect(choices.length, "non-empty").toBeGreaterThan(0);
    expect(choices, "the curated keys").toEqual(getLocaleDataLocales());
    expect(choices.indexOf("en-GB") >= 0, "contains a regional entry").toBe(true);
    expect(choices.indexOf("de") >= 0, "contains a language entry").toBe(true);
    expect(choices, "the same set as the table").toEqual(Object.keys(localeData));
  });
});

describe("RegionalFormat: locale casing", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("A lookup finds a canonical key in any casing", () => {
    ["en-gb", "en-GB", "EN-GB"].forEach(locale => {
      expect(getLocaleDataValue(locale, "datePattern"), locale).toBe("dd/mm/yyyy");
      expect(findLocaleDataKey(locale), locale + " key").toBe("en-GB");
    });
    expect(getLocaleDataValue("en-gb", "currencySymbol"), "the regional entry is hit, not skipped to the language").toBe(pound);
    expect(getLocaleDataValue("PT-BR", "currencySymbol"), "an uppercase language subtag").toBe("R$");
    expect(getLocaleDataValue("DE-AT", "datePattern"), "the language subtag of the query, lowercased").toBe("dd.mm.yyyy");
    expect(findLocaleDataKey("de"), "a language key").toBe("de");
    expect(findLocaleDataKey("en-US"), "no entry").toBeUndefined();
    expect(findLocaleDataKey("constructor"), "never a prototype member").toBeUndefined();
    expect(findLocaleDataKey(""), "no locale").toBeUndefined();
  });

  test("The choice list shows the canonical keys", () => {
    const locales = getLocaleDataLocales();
    expect(locales.indexOf("en-GB") >= 0, "canonical").toBe(true);
    expect(locales.indexOf("en-gb"), "not lowercase").toBe(-1);
    expect(locales.filter(locale => locale.indexOf("-") > 0), "the regional entries").toEqual(["en-AU", "en-CA", "en-GB", "en-IE", "en-IN", "en-NZ", "en-ZA", "fr-CA", "fr-CH", "nl-BE", "pt-BR", "zh-CN", "zh-TW"]);
  });

  test("The region locale is stored and serialized in canonical casing, table entry or not", () => {
    const cases: { [locale: string]: string } = { "en-us": "en-US", "de": "de", "DE": "de", "xx-yy": "xx-YY", "zh-hans-cn": "zh-Hans-CN", "ZH-HANT-TW": "zh-Hant-TW", "es-419": "es-419", "de-ch-1996": "de-CH-1996", "en-u-ca-gregory": "en-u-ca-gregory" };
    Object.keys(cases).forEach(locale => {
      expect(canonicalizeLocale(locale), locale).toBe(cases[locale]);
    });
    const survey = createSurvey();
    survey.regionalFormat.locale = "en-us";
    expect(survey.regionalFormat.locale, "read back").toBe("en-US");
    expect(survey.toJSON().regionalFormat, "serialized").toEqual({ locale: "en-US" });
    survey.regionalFormat.locale = "de";
    expect(survey.regionalFormat.locale, "a language stays lowercase").toBe("de");
    survey.regionalFormat.locale = "xx-yy";
    expect(survey.toJSON().regionalFormat, "an unknown locale").toEqual({ locale: "xx-YY" });
    survey.regionalFormat.locale = "zh-hans-cn";
    expect(survey.regionalFormat.locale, "a script subtag").toBe("zh-Hans-CN");

    const loaded = createSurvey({ regionalFormat: { locale: "en-gb" } });
    expect(loaded.regionalFormat.locale, "canonicalized on load").toBe("en-GB");
    expect(loaded.toJSON().regionalFormat, "and written back canonical").toEqual({ locale: "en-GB" });
    expect(renderNumber(loaded, "cur"), "the entry resolves").toBe(euro + "1,234.56");
    expect(getQuestion(loaded, "date").inputValue, "the regional date order").toBe("dd/mm/yyyy");
  });

  test("A survey locale in SurveyJS casing resolves the canonical entry", () => {
    const survey = createSurvey();
    getQuestion(survey, "cur").maskSettings.resetPropertyValue("currencySymbol");
    survey.locale = "pt-br";
    expect(renderNumber(survey, "cur"), "pt-br finds pt-BR").toBe("R$ 1.234,56");
    survey.locale = "";
  });

  test("An application may extend the table with a lowercase key", () => {
    try {
      localeData["en-ph"] = { datePattern: "mm/dd/yyyy", currencySymbol: peso };
      expect(findLocaleDataKey("en-PH"), "found in canonical casing").toBe("en-ph");
      expect(getLocaleDataValue("en-PH", "currencySymbol"), "resolves for en-PH").toBe(peso);
      expect(getLocaleDataValue("en-ph", "currencySymbol"), "and for en-ph").toBe(peso);
      expect(getLocaleDataValue("en-PH", "decimalSeparator"), "the other fields through en").toBe(".");
      expect(getLocaleDataLocales().filter(locale => locale.toLowerCase() === "en-ph"), "listed once").toEqual(["en-ph"]);

      const survey = createSurvey({ regionalFormat: { locale: "en-ph" } });
      getQuestion(survey, "cur").maskSettings.resetPropertyValue("currencySymbol");
      expect(survey.regionalFormat.locale, "the stored locale is canonical").toBe("en-PH");
      expect(renderNumber(survey, "cur"), "the mask finds the lowercase key").toBe(peso + "1,234.56");
    } finally {
      delete localeData["en-ph"];
    }
  });

  test("A key that differs only in casing: the exact casing wins, the list shows the first", () => {
    try {
      localeData["en-nz"] = { datePattern: "yyyy-mm-dd" };
      expect(findLocaleDataKey("en-NZ"), "exact casing wins").toBe("en-NZ");
      expect(findLocaleDataKey("en-nz"), "for the added key too").toBe("en-nz");
      expect(findLocaleDataKey("EN-NZ"), "otherwise the first in key order").toBe("en-NZ");
      expect(getLocaleDataValue("en-NZ", "datePattern"), "the curated entry").toBe("dd/mm/yyyy");
      expect(getLocaleDataValue("en-nz", "datePattern"), "the added entry").toBe("yyyy-mm-dd");
      const locales = getLocaleDataLocales();
      expect(locales.filter(locale => locale.toLowerCase() === "en-nz"), "listed once, under the first key").toEqual(["en-NZ"]);
      // the stored region locale is canonical, so it reaches the curated entry
      const survey = createSurvey({ regionalFormat: { locale: "en-nz" } });
      expect(getQuestion(survey, "date").inputValue, "the region locale").toBe("dd/mm/yyyy");
    } finally {
      delete localeData["en-nz"];
    }
  });

  test("A mixed-case format locale reaches the date pattern; the placeholder letters follow the survey locale", () => {
    // getPlaceholderSymbol reads the localization dictionaries with the survey locale
    // (Base.getLocalizationString), so the format locale never reaches a dictionary lookup
    ["en-GB", "en-gb", "EN-GB"].forEach(locale => {
      const survey = createSurvey({ locale: "de", regionalFormat: { locale: locale } });
      expect(getQuestion(survey, "date").inputValue, locale).toBe("TT/MM/JJJJ");
    });
    const english = createSurvey({ regionalFormat: { locale: "de" } });
    expect(getQuestion(english, "date").inputValue, "an english survey with a german format").toBe("dd.mm.yyyy");
  });
});
