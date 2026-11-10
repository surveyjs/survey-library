import { InputMaskDateTime } from "../../src/mask/mask_datetime";
import { InputMaskNumeric, isValidDecimalSeparator, isValidThousandsSeparator } from "../../src/mask/mask_numeric";
import { InputMaskCurrency, isValidCurrencyPattern, isValidCurrencySymbol } from "../../src/mask/mask_currency";
import { InputMaskPattern } from "../../src/mask/mask_pattern";
import { localeData, getLocaleDataValue } from "../../src/locale-data";
import { QuestionTextModel } from "../../src/question_text";
import { SurveyModel } from "../../src/survey";
import { surveyLocalization } from "../../src/surveyStrings";
// registers every shipped localization dictionary
import "../../src/localization/arabic";
import "../../src/localization/basque";
import "../../src/localization/bulgarian";
import "../../src/localization/burmese";
import "../../src/localization/catalan";
import "../../src/localization/croatian";
import "../../src/localization/czech";
import "../../src/localization/danish";
import "../../src/localization/dutch";
import "../../src/localization/estonian";
import "../../src/localization/finnish";
import "../../src/localization/french";
import "../../src/localization/georgian";
import "../../src/localization/german";
import "../../src/localization/greek";
import "../../src/localization/haitian-creole";
import "../../src/localization/hebrew";
import "../../src/localization/hindi";
import "../../src/localization/hungarian";
import "../../src/localization/icelandic";
import "../../src/localization/indonesian";
import "../../src/localization/italian";
import "../../src/localization/japanese";
import "../../src/localization/kazakh";
import "../../src/localization/korean";
import "../../src/localization/latvian";
import "../../src/localization/lithuanian";
import "../../src/localization/macedonian";
import "../../src/localization/malay";
import "../../src/localization/nl-BE";
import "../../src/localization/norwegian";
import "../../src/localization/persian";
import "../../src/localization/philippines";
import "../../src/localization/polish";
import "../../src/localization/portuguese-br";
import "../../src/localization/portuguese";
import "../../src/localization/romanian";
import "../../src/localization/russian";
import "../../src/localization/serbian";
import "../../src/localization/simplified-chinese";
import "../../src/localization/slovak";
import "../../src/localization/slovenian";
import "../../src/localization/spanish";
import "../../src/localization/swahili";
import "../../src/localization/swedish";
import "../../src/localization/tajik";
import "../../src/localization/telugu";
import "../../src/localization/thai";
import "../../src/localization/traditional-chinese";
import "../../src/localization/turkish";
import "../../src/localization/ukrainian";
import "../../src/localization/urdu";
import "../../src/localization/vietnamese";
import "../../src/localization/welsh";

import { describe, test, expect, afterEach, vi } from "vitest";

const placeholderKeyRoles: { [key: string]: string } = {
  maskPlaceholderDay: "day",
  maskPlaceholderMonth: "month",
  maskPlaceholderYear: "year",
  maskPlaceholderHour12: "hour12",
  maskPlaceholderHour24: "hour24",
  maskPlaceholderMinute: "minute",
  maskPlaceholderSecond: "second",
  maskPlaceholderTimeMarkerLower: "timeMarkerLower",
  maskPlaceholderTimeMarkerUpper: "timeMarkerUpper"
};

describe("Datetime mask: locale rollout", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("Every localized placeholder symbol in every dictionary is valid for its role", () => {
    const maskInstance = new InputMaskDateTime();
    const isValid = maskInstance["isPlaceholderSymbolValid"].bind(maskInstance);
    let checkedCount = 0;
    Object.keys(surveyLocalization.locales).forEach(locale => {
      const strings = surveyLocalization.locales[locale];
      Object.keys(placeholderKeyRoles).forEach(key => {
        const symbol = strings[key];
        if (symbol === undefined) return;
        expect(isValid(symbol, placeholderKeyRoles[key]), locale + "." + key + " = " + JSON.stringify(symbol)).toBe(true);
        checkedCount++;
      });
    });
    // english (9) + german (3) + the 15 rolled-out dictionaries (3 each)
    expect(checkedCount, "the rollout is present").toBeGreaterThanOrEqual(57);
  });

  test("The pinned empty date mask for every locale of the rollout", () => {
    // pattern comes from locale-data, symbols from the localization dictionaries; both follow
    // the locale's <input type="date"> convention
    const expected: { [locale: string]: string } = {
      "": "mm/dd/yyyy",
      "de": "TT.MM.JJJJ",
      "fr": "jj/mm/aaaa",
      "es": "dd/mm/aaaa",
      "pt": "dd/mm/aaaa",
      "pt-br": "dd/mm/aaaa",
      "it": "gg/mm/aaaa",
      "nl": "dd-mm-jjjj",
      "nl-BE": "dd/mm/jjjj",
      "ru": "дд.мм.гггг", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
      "uk": "дд.мм.рррр", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
      "pl": "dd.mm.rrrr",
      "cs": "dd. mm. rrrr",
      "sk": "dd. mm. rrrr",
      "tr": "gg.aa.yyyy",
      "sv": "åååå-mm-dd", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
      "da": "dd.mm.åååå", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
      "no": "dd.mm.åååå", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
      "fi": "pp.kk.vvvv",
      // symbols deliberately unlocalized: the canonical letters render in the locale's field order.
      // CJK: a symbol would repeat per digit. RTL scripts: a strong right-to-left symbol makes the
      // field order unstable while the mask fills (the value changes bidi class as digits replace
      // letters), and the Latin fallback is the only symbol set that stays in logical order in every
      "ja": "yyyy/mm/dd",
      "ko": "yyyy. mm. dd",
      "zh-cn": "yyyy/mm/dd",
      "ar": "dd/mm/yyyy",
      "he": "dd.mm.yyyy",
      "fa": "yyyy/mm/dd"
    };
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime" }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    Object.keys(expected).forEach(locale => {
      survey.locale = locale;
      expect(q.inputValue, "locale " + JSON.stringify(locale)).toBe(expected[locale]);
    });
  });

  test("A value entered under any rollout locale stores the same ISO date", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "datetime" }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const entries: { [locale: string]: string } = {
      "": "12/25/2000",
      "de": "25.12.2000",
      "fr": "25/12/2000",
      "cs": "25. 12. 2000",
      "sv": "2000-12-25",
      "ja": "2000/12/25",
      "ru": "25.12.2000"
    };
    Object.keys(entries).forEach(locale => {
      survey.locale = locale;
      q.clearValue();
      q.inputValue = entries[locale];
      expect(q.value, "locale " + JSON.stringify(locale)).toBe("2000-12-25");
    });
  });
});

describe("Numeric mask: locale rollout", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  test("The pinned masked number for every curated locale", () => {
    // the value 1234567.89 rendered with each locale's decimal and group separator; grouping is
    // always by three, so en-IN, hi and tel read 1,234,567.89 where CLDR writes 12,34,567.89
    const expected: { [locale: string]: string } = {
      "ar": "1,234,567.89",
      "bg": "1\u00A0234\u00A0567,89",
      "ca": "1.234.567,89",
      "cs": "1\u00A0234\u00A0567,89",
      "cy": "1,234,567.89",
      "da": "1.234.567,89",
      "de": "1.234.567,89",
      "el": "1.234.567,89",
      "en": "1,234,567.89",
      "en-AU": "1,234,567.89",
      "en-CA": "1,234,567.89",
      "en-GB": "1,234,567.89",
      "en-IE": "1,234,567.89",
      "en-IN": "1,234,567.89",
      "en-NZ": "1,234,567.89",
      "en-ZA": "1\u00A0234\u00A0567,89",
      "es": "1.234.567,89",
      "et": "1\u00A0234\u00A0567,89",
      "eu": "1.234.567,89",
      "fa": "1,234,567.89",
      "fi": "1\u00A0234\u00A0567,89",
      "fil": "1,234,567.89",
      "fr": "1\u202F234\u202F567,89",
      "fr-CA": "1\u00A0234\u00A0567,89",
      "fr-CH": "1\u202F234\u202F567,89",
      "he": "1,234,567.89",
      "hi": "1,234,567.89",
      "hr": "1.234.567,89",
      "ht": "1\u00A0234\u00A0567,89",
      "hu": "1\u00A0234\u00A0567,89",
      "id": "1.234.567,89",
      "is": "1.234.567,89",
      "it": "1.234.567,89",
      "ja": "1,234,567.89",
      "ka": "1\u00A0234\u00A0567,89",
      "kk": "1\u00A0234\u00A0567,89",
      "ko": "1,234,567.89",
      "lt": "1\u00A0234\u00A0567,89",
      "lv": "1\u00A0234\u00A0567,89",
      "mk": "1.234.567,89",
      "mm": "1,234,567.89",
      "ms": "1,234,567.89",
      "nl": "1.234.567,89",
      "nl-BE": "1.234.567,89",
      "no": "1\u00A0234\u00A0567,89",
      "pl": "1\u00A0234\u00A0567,89",
      "pt": "1.234.567,89",
      "pt-BR": "1.234.567,89",
      "ro": "1.234.567,89",
      "ru": "1\u00A0234\u00A0567,89",
      "sk": "1\u00A0234\u00A0567,89",
      "sl": "1.234.567,89",
      "sr": "1.234.567,89",
      "sv": "1\u00A0234\u00A0567,89",
      "sw": "1,234,567.89",
      "tel": "1,234,567.89",
      "tg": "1\u00A0234\u00A0567,89",
      "th": "1,234,567.89",
      "tr": "1.234.567,89",
      "uk": "1\u00A0234\u00A0567,89",
      "ur": "1,234,567.89",
      "vi": "1.234.567,89",
      "zh": "1,234,567.89",
      "zh-CN": "1,234,567.89",
      "zh-TW": "1,234,567.89",
    };
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "numeric" }] });
    const mask = <InputMaskNumeric>(<QuestionTextModel>survey.getQuestionByName("q1")).maskSettings;
    Object.keys(localeData).forEach(locale => {
      expect(Object.keys(expected).indexOf(locale) >= 0, "locale " + JSON.stringify(locale) + " is pinned").toBe(true);
    });
    Object.keys(expected).forEach(locale => {
      survey.regionalFormat.locale = locale;
      expect(mask.getMaskedValue(1234567.89), "locale " + JSON.stringify(locale)).toBe(expected[locale]);
    });
    survey.regionalFormat.locale = "";
  });

  test("A number round-trips through the mask under every curated locale", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "numeric" }] });
    const mask = <InputMaskNumeric>(<QuestionTextModel>survey.getQuestionByName("q1")).maskSettings;
    Object.keys(localeData).forEach(locale => {
      survey.regionalFormat.locale = locale;
      const masked = mask.getMaskedValue(1234.56);
      const value = mask.getUnmaskedValue(masked);
      expect(typeof value, "locale " + JSON.stringify(locale) + " stores a number").toBe("number");
      expect(value, "locale " + JSON.stringify(locale) + " round trip of " + JSON.stringify(masked)).toBe(1234.56);
    });
    survey.regionalFormat.locale = "";
  });

  test("Every curated separator is a single valid character and the pair is distinct", () => {
    let checkedCount = 0;
    Object.keys(localeData).forEach(locale => {
      const decimal = localeData[locale].decimalSeparator;
      const thousands = localeData[locale].thousandsSeparator;
      expect(isValidDecimalSeparator(decimal), locale + ".decimalSeparator = " + JSON.stringify(decimal)).toBe(true);
      expect(isValidThousandsSeparator(thousands), locale + ".thousandsSeparator = " + JSON.stringify(thousands)).toBe(true);
      expect(decimal === thousands, locale + " curates two different separators").toBe(false);
      checkedCount++;
    });
    expect(checkedCount, "every locale entry curates separators").toBe(Object.keys(localeData).length);
  });
});

/* A question converts its saved value from the format the text is in. A read during the change, which
   a condition or a piped title makes for a question that has not converted yet, must not replace that
   format with the new locale's: the question would parse "2,222.22" as 2.22 and lose digits. */
describe("A saved masked value survives reads during a locale change", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  const numeric = { maskType: "numeric", maskSettings: { saveMaskedValue: true, precision: 2 } };
  // The locale's own symbol and pattern: the affixes differ between the locales, not only the separators.
  const currency = { maskType: "currency", maskSettings: { saveMaskedValue: true, precision: 2 } };
  const numberFormats = { en: ["1,111.11", "2,222.22"], de: ["1.111,11", "2.222,22"] };
  const euro = "\u20AC";
  const currencyFormats = { en: ["$1,111.11", "$2,222.22"], de: ["1.111,11 " + euro, "2.222,22 " + euro] };
  const maskCases: Array<[string, any, { en: Array<string>, de: Array<string> }]> = [["numeric", numeric, numberFormats], ["currency", currency, currencyFormats]];
  const values = (survey: SurveyModel, ...names: Array<string>): Array<any> => names.map(name => survey.getValue(name));

  test.each(maskCases)("%s: a condition reads the question that has not converted yet", (_, mask, formats) => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", ...mask },
        { type: "text", name: "q2", ...mask },
        { type: "text", name: "q3", visibleIf: "{q1} notempty and {q2} notempty" }
      ]
    });
    survey.data = { q1: formats.en[0], q2: formats.en[1] };
    survey.locale = "de";
    expect(values(survey, "q1", "q2")).toEqual(formats.de);
    survey.locale = "";
    expect(values(survey, "q1", "q2"), "back").toEqual(formats.en);
  });

  // A symbol that holds the decimal separator must leave as an affix: the number parser would misread it.
  test("a piped title leaves the affixes of the text, which the question removes", () => {
    const survey = new SurveyModel({
      regionalFormat: { currencySymbol: "Rs." },
      elements: [{ type: "text", name: "q1", title: "Sum: {q1}", ...currency }]
    });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    survey.data = { q1: "Rs.2,222.22" };
    q.locTitle.textOrHtml;
    q.locTitle.onChanged = () => { q.locTitle.textOrHtml; };
    survey.locale = "de";
    expect(q.value).toBe("2.222,22 Rs.");
  });

  test("a condition never sees a number misread during the change", () => {
    const survey = new SurveyModel({
      clearInvisibleValues: "onHidden",
      elements: [
        { type: "text", name: "q1", ...numeric },
        { type: "text", name: "q2", ...numeric },
        { type: "text", name: "q3", visibleIf: "{q1} > 0 and {q2} > 100" }
      ]
    });
    survey.data = { q1: "1,111.11", q2: "2,222.22", q3: "kept" };
    survey.locale = "de";
    expect(survey.getValue("q3")).toBe("kept");
  });

  test.each(maskCases)("%s: a piped title reads the only masked question", (_, mask, formats) => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", title: "Sum: {q1}", ...mask }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    survey.data = { q1: formats.en[1] };
    expect(q.locTitle.textOrHtml).toBe("Sum: " + formats.en[1]);
    q.locTitle.onChanged = () => { q.locTitle.textOrHtml; };
    survey.locale = "de";
    expect(q.value).toBe(formats.de[1]);
    expect(q.locTitle.textOrHtml).toBe("Sum: " + formats.de[1]);
  });

  test("a value typed after a change converts back", () => {
    const survey = new SurveyModel({ locale: "de", elements: [{ type: "text", name: "q1", ...numeric }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    q.inputValue = "9.876,54";
    expect(q.value).toBe("9.876,54");
    survey.locale = "";
    expect(q.value).toBe("9,876.54");
  });

  test("a survey that starts in the second locale reads and converts its nested values", () => {
    const survey = new SurveyModel({
      locale: "de",
      elements: [
        { type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "c", cellType: "text", ...numeric }, { name: "sum", cellType: "expression", expression: "{row.c} + 1" }] },
        { type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "t", ...numeric }] },
        { type: "text", name: "calc", visibleIf: "{m[0].c} > 1000 and {p[0].t} > 1000" }
      ]
    });
    survey.data = { m: [{ c: "1.234,56" }], p: [{ t: "1.234,56" }], calc: "kept" };
    const matrix = <any>survey.getQuestionByName("m");
    const cell = matrix.visibleRows[0].cells[0].question;
    const panelQuestion = (<any>survey.getQuestionByName("p")).panels[0].getQuestionByName("t");
    expect(matrix.visibleRows[0].cells[1].question.value, "the expression reads the number").toBe(1235.56);
    survey.locale = "";
    expect(cell.value, "the cell").toBe("1,234.56");
    expect(panelQuestion.value, "the panel's question").toBe("1,234.56");
    expect(survey.getQuestionByName("calc").isVisible, "the condition reads both numbers").toBe(true);
  });

  test.each(maskCases)("%s: an item of a multiple text gets the text it holds back from the first item's write", (_, mask, formats) => {
    const survey = new SurveyModel({
      elements: [{ type: "multipletext", name: "mt", items: [{ name: "a", ...mask }, { name: "b", ...mask }] }]
    });
    survey.data = { mt: { a: formats.en[0], b: formats.en[1] } };
    survey.locale = "de";
    expect(survey.getValue("mt")).toEqual({ a: formats.de[0], b: formats.de[1] });
    survey.locale = "";
    expect(survey.getValue("mt"), "back").toEqual({ a: formats.en[0], b: formats.en[1] });
  });

  test("a handler merges the text a question that has not converted holds", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", ...numeric }, { type: "text", name: "q2", ...numeric }] });
    survey.data = { q1: "1,111.11", q2: "2,222.22" };
    survey.onValueChanged.add((sender, options) => {
      if (options.name === "q1") sender.mergeData({ q2: "2,222.22" });
    });
    survey.locale = "de";
    expect(survey.getValue("q2")).toBe("2.222,22");
  });

  test("a matrix cell's write gives a shared record back to a panel that has not converted", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "m", valueName: "shared", rowCount: 0, columns: [{ name: "c", cellType: "text", ...numeric }] },
        { type: "paneldynamic", name: "p", valueName: "shared", templateElements: [{ type: "text", name: "c", ...numeric }, { type: "text", name: "d", ...numeric }] }
      ]
    });
    survey.data = { shared: [{ c: "1,111.11", d: "2,222.22" }] };
    (<any>survey.getQuestionByName("m")).visibleRows;
    (<any>survey.getQuestionByName("p")).panels;
    survey.locale = "de";
    expect(survey.getValue("shared")).toEqual([{ c: "1.111,11", d: "2.222,22" }]);
  });

  // A symbol that holds the decimal separator shows whether a read removes the affixes the text has.
  const symbolCurrency = { regionalFormat: { currencySymbol: "Rs." } };
  test("a nested question reads and converts text with a symbol it gets after it is created", () => {
    const survey = new SurveyModel({
      locale: "ja",
      ...symbolCurrency,
      elements: [{ type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "t", ...currency }] }]
    });
    survey.data = { p: [{ t: "Rs.2,222.22" }] };
    const q = (<any>survey.getQuestionByName("p")).panels[0].getQuestionByName("t");
    expect(q.getFilteredValue(), "the read").toBe(2222.22);
    survey.locale = "de";
    expect(q.value, "the conversion").toBe("2.222,22 Rs.");
  });

  test("a read follows a symbol that changes without a locale change", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", ...currency }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    survey.data = { q1: "$1,000.00" };
    (<InputMaskCurrency>q.maskSettings).currencySymbol = "Rs.";
    q.value = "Rs.2,000.00";
    expect(q.getFilteredValue()).toBe(2000);
  });

  test("outside a locale change a read goes through getUnmaskedValue, which a mask may override", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", ...numeric }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    const mask = <InputMaskNumeric>q.maskSettings;
    const read = mask.getUnmaskedValue.bind(mask);
    mask.getUnmaskedValue = (src: string): any => read(src) * 100;
    q.value = "12.5";
    expect(q.getFilteredValue()).toBe(1250);
  });

  test("the cells of a matrix with a total keep their digits", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "c", cellType: "text", totalType: "sum", ...numeric }] }]
    });
    survey.data = { m: [{ c: "1,111.11" }, { c: "2,222.22" }] };
    const matrix = <any>survey.getQuestionByName("m");
    matrix.visibleRows;
    survey.locale = "de";
    expect(survey.getValue("m")).toEqual([{ c: "1.111,11" }, { c: "2.222,22" }]);
    expect(matrix.generatedTotalRow.cells[0].question.value, "the sum").toBe(3333.33);
  });

  test("a mask that has not produced a text reads in its current format", () => {
    const q = new QuestionTextModel("q1");
    q.maskType = "numeric";
    q.maskSettings.saveMaskedValue = true;
    q.value = "1,234.56";
    expect(q.getFilteredValue(), "no survey").toBe(1234.56);
    const survey = new SurveyModel({ locale: "de", elements: [{ type: "text", name: "q1", ...numeric }] });
    const german = <QuestionTextModel>survey.getQuestionByName("q1");
    german.value = "1.234,56";
    expect(german.getFilteredValue(), "the format of the survey").toBe(1234.56);
  });

  test("a read does not move the format of a value the question has not converted", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", ...numeric }] });
    const q = <QuestionTextModel>survey.getQuestionByName("q1");
    survey.data = { q1: "2,222.22" };
    surveyLocalization.currentLocale = "de";
    expect(q.getFilteredValue(), "the number the text holds").toBe(2222.22);
    expect(q.displayValue, "the value shown in a read").toBe("2,222.22");
    q.localeChanged();
    expect(q.value).toBe("2.222,22");
  });
});

/* The mask keeps the unmasked value of its question. The question's value is that value, or its masked
   text with saveMaskedValue. The text is parsed once, when it arrives in the format it was written in. */
describe("The unmasked value of a masked question", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  const euro = "\u20AC";
  const numeric = { maskType: "numeric", maskSettings: { precision: 2 } };
  const currency = { maskType: "currency", maskSettings: { precision: 2 } };
  const datetime = { maskType: "datetime" };
  const pattern = { maskType: "pattern", maskSettings: { pattern: "999-99" } };
  const saved = (mask: any): any => ({ ...mask, maskSettings: { ...mask.maskSettings, saveMaskedValue: true } });
  interface IMaskCase { mask: any, text: string, unmasked: any, deText: string }
  const maskCases: Array<[string, IMaskCase]> = [
    ["numeric", { mask: numeric, text: "1,234.56", unmasked: 1234.56, deText: "1.234,56" }],
    ["currency", { mask: currency, text: "$1,234.56", unmasked: 1234.56, deText: "1.234,56 " + euro }],
    ["datetime", { mask: datetime, text: "12/25/2000", unmasked: "2000-12-25", deText: "25.12.2000" }],
    ["pattern", { mask: pattern, text: "123-45", unmasked: "12345", deText: "123-45" }]
  ];
  const createSurvey = (...elements: Array<any>): SurveyModel => new SurveyModel({ elements });
  const getText = (survey: SurveyModel, name: string = "q1"): QuestionTextModel => <QuestionTextModel>survey.getQuestionByName(name);
  const createInput = (q: QuestionTextModel): HTMLInputElement => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    q.afterRenderQuestionElement(input);
    return input;
  };

  test.each(maskCases)("%s: the value of a typed text", (_, c) => {
    const survey = createSurvey({ type: "text", name: "q1", ...c.mask }, { type: "text", name: "q2", ...saved(c.mask) });
    getText(survey, "q1").inputValue = c.text;
    getText(survey, "q2").inputValue = c.text;
    expect(getText(survey, "q1").maskSettings.unmaskedValue, "the value").toBe(c.unmasked);
    expect(getText(survey, "q2").maskSettings.unmaskedValue, "the text").toBe(c.unmasked);
    expect(survey.data).toEqual({ q1: c.unmasked, q2: c.text });
  });

  test.each(maskCases)("%s: the value of loaded data", (_, c) => {
    const survey = createSurvey({ type: "text", name: "q1", ...c.mask }, { type: "text", name: "q2", ...saved(c.mask) });
    survey.data = { q1: c.unmasked, q2: c.text };
    expect(getText(survey, "q1").maskSettings.unmaskedValue, "the value").toBe(c.unmasked);
    expect(getText(survey, "q2").maskSettings.unmaskedValue, "the text").toBe(c.unmasked);
  });

  test.each(maskCases)("%s: without saveMaskedValue it is the value on both sides of a locale change", (_, c) => {
    const survey = createSurvey({ type: "text", name: "q1", ...c.mask });
    const q = getText(survey);
    survey.data = { q1: c.unmasked };
    expect(q.maskSettings.unmaskedValue).toBe(q.value);
    survey.locale = "de";
    expect(q.value, "the value does not change").toBe(c.unmasked);
    expect(q.maskSettings.unmaskedValue).toBe(q.value);
    survey.locale = "";
    expect(survey.data).toEqual({ q1: c.unmasked });
    expect(q.maskSettings.unmaskedValue).toBe(q.value);
  });

  test.each(maskCases)("%s: with saveMaskedValue it survives a locale change and the way back", (_, c) => {
    const survey = createSurvey({ type: "text", name: "q1", ...saved(c.mask) });
    const q = getText(survey);
    survey.data = { q1: c.text };
    survey.locale = "de";
    expect(survey.data).toEqual({ q1: c.deText });
    expect(q.getFilteredValue()).toBe(c.unmasked);
    survey.locale = "";
    expect(survey.data).toEqual({ q1: c.text });
    expect(q.maskSettings.unmaskedValue).toBe(c.unmasked);
  });

  test.each([
    ["numeric", numeric, undefined, undefined], ["currency", currency, undefined, undefined],
    ["datetime", datetime, undefined, ""], ["pattern", pattern, undefined, ""]
  ])("%s: an empty question", (_, mask, plain, masked) => {
    const survey = createSurvey({ type: "text", name: "q1", ...mask }, { type: "text", name: "q2", ...saved(mask) });
    expect(getText(survey, "q1").getFilteredValue(), "without saveMaskedValue").toBe(plain);
    expect(getText(survey, "q1").maskSettings.unmaskedValue).toBe(plain);
    expect(getText(survey, "q2").getFilteredValue(), "with saveMaskedValue").toBe(masked);
    expect(getText(survey, "q2").maskSettings.unmaskedValue).toBe(masked);
  });

  test("with no mask a question gives its value", () => {
    const survey = createSurvey({ type: "text", name: "q1" }, { type: "text", name: "q2", inputType: "number", maskType: "numeric", maskSettings: { saveMaskedValue: true } });
    survey.data = { q1: "1,234.56", q2: 12 };
    expect(getText(survey, "q1").getFilteredValue()).toBe("1,234.56");
    expect(getText(survey, "q2").getFilteredValue(), "a mask type that the input type ignores").toBe(12);
    expect(getText(survey, "q2").maskSettings.unmaskedValue, "a mask that is not in use keeps nothing").toBeUndefined();
  });

  test("an empty question parses nothing while it loads, and a load does not render the text", () => {
    const parse = vi.spyOn(InputMaskNumeric.prototype, "getUnmaskedValue");
    const render = vi.spyOn(InputMaskNumeric.prototype, "getMaskedValue");
    try {
      const survey = createSurvey({ type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "c", cellType: "text", ...saved(numeric) }] });
      survey.data = { m: [{}, {}] };
      (<any>survey.getQuestionByName("m")).visibleRows;
      expect(parse, "empty cells").not.toHaveBeenCalled();
      parse.mockClear();
      render.mockClear();
      survey.data = { m: [{ c: "1,234.56" }, { c: "2,345.67" }] };
      (<any>survey.getQuestionByName("m")).visibleRows;
      expect(render, "the check of the text waits for a setting").not.toHaveBeenCalledWith(1234.56);
    } finally {
      parse.mockRestore();
      render.mockRestore();
    }
  });

  test("a text set before the question gets its survey is read in the survey's format", () => {
    const survey = new SurveyModel({ locale: "de", elements: [{ type: "text", name: "q0" }] });
    survey.data = { q1: "1.234,56" };
    const q = new QuestionTextModel("q1");
    q.maskType = "numeric";
    q.maskSettings.saveMaskedValue = true;
    q.value = "1.234,56";
    survey.pages[0].addElement(q);
    survey.locale = "";
    expect(q.value).toBe("1,234.56");
    expect(q.getFilteredValue()).toBe(1234.56);
  });

  test("the plain conversions leave it alone", () => {
    const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
    const q = getText(survey);
    survey.data = { q1: "1,234.56" };
    expect(q.maskSettings.getMaskedValue(99), "another value").toBe("99");
    expect(q.maskSettings.getMaskedValue(""), "the empty mask").toBe("");
    expect(q.maskSettings.getUnmaskedValue("7.5")).toBe(7.5);
    expect(q.getExpressionValue("8.5"), "a record's value").toBe(8.5);
    expect(q.maskSettings.unmaskedValue).toBe(1234.56);
  });

  test("rows and panels do not share it, and a column's template has none", () => {
    const survey = createSurvey(
      { type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "c", cellType: "text", ...saved(numeric) }] },
      { type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "t", ...saved(numeric) }] }
    );
    survey.data = { m: [{ c: "1.50" }, { c: "2.50" }], p: [{ t: "3.50" }, { t: "4.50" }] };
    const matrix = <any>survey.getQuestionByName("m");
    const cells = matrix.visibleRows.map((row: any) => row.cells[0].question);
    const panels = (<any>survey.getQuestionByName("p")).panels.map((panel: any) => panel.getQuestionByName("t"));
    expect(cells[0].maskSettings).not.toBe(cells[1].maskSettings);
    expect(panels[0].maskSettings).not.toBe(panels[1].maskSettings);
    expect(cells.concat(panels).map((q: QuestionTextModel) => q.maskSettings.unmaskedValue)).toEqual([1.5, 2.5, 3.5, 4.5]);
    const template = matrix.columns[0].templateQuestion;
    expect(template.getExpressionValue("9.50"), "a record read through the template").toBe(9.5);
    expect(template.maskSettings.unmaskedValue).toBeUndefined();
  });

  test("it is not serialized and is no reactive property", () => {
    const json = { elements: [{ type: "text", name: "q1", maskType: "numeric", maskSettings: { saveMaskedValue: true, precision: 3 } }] };
    const survey = new SurveyModel(json);
    const q = getText(survey);
    const names: Array<string> = [];
    q.maskSettings.onPropertyChanged.add((_, options) => names.push(options.name));
    survey.data = { q1: "1,234.56" };
    expect(q.getFilteredValue()).toBe(1234.56);
    expect(q.maskSettings.unmaskedValue).toBe(1234.56);
    expect(names, "the adapter re-renders on this event").toEqual([]);
    expect(survey.toJSON().pages[0].elements).toEqual(json.elements);
    expect(q.maskSettings.getData()).toEqual({ saveMaskedValue: true, precision: 3 });
  });

  test("a saveMaskedValue that arrives after the value leaves no stale value", () => {
    const survey = createSurvey({ type: "text", name: "q1", ...numeric });
    const q = getText(survey);
    q.value = "1,234.56";
    expect(q.maskSettings.unmaskedValue, "not parsed").toBe("1,234.56");
    q.maskSettings.saveMaskedValue = true;
    expect(q.maskSettings.unmaskedValue, "at runtime").toBe(1234.56);
    expect(q.value, "MU03: the stored text stays").toBe("1,234.56");
    q.maskSettings.saveMaskedValue = false;
    expect(q.maskSettings.unmaskedValue, "and off again").toBe("1,234.56");
    q.fromJSON({ maskSettings: { saveMaskedValue: true } });
    expect(q.maskSettings.unmaskedValue, "in the JSON").toBe(1234.56);
    expect(q.getFilteredValue()).toBe(1234.56);
  });

  describe("A locale change", () => {
    test.each([
      ["datetime", datetime, "12/"],
      ["numeric", numeric, "abc"]
    ])("%s: text the mask cannot read stays (MU02)", (_, mask, text) => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(mask) });
      const q = getText(survey);
      survey.data = { q1: text };
      survey.locale = "de";
      expect(q.value).toBe(text);
      survey.locale = "";
      expect(q.value, "back").toBe(text);
      expect(survey.data).toEqual({ q1: text });
    });

    test.each([
      ["numeric, max", { ...numeric, maskSettings: { precision: 2, max: 1000 } }, "2,222.22", 2222.22, "111.11" as any, "111,11"],
      ["numeric, min", { ...numeric, maskSettings: { precision: 2, min: 5000 } }, "2,222.22", 2222.22, "6,111.11", "6.111,11"],
      ["currency, max", { ...currency, maskSettings: { precision: 2, max: 1000 } }, "$2,222.22", 2222.22, "$111.11", "111,11 " + euro]
    ])("%s: out-of-range text stays and keeps its number", (_, mask, text, number, inRange, inRangeDe) => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(mask) }, { type: "text", name: "q2", ...saved(mask) });
      survey.data = { q1: text, q2: inRange };
      survey.locale = "de";
      expect(survey.data, "the value in range next to it converts").toEqual({ q1: text, q2: inRangeDe });
      expect(getText(survey).getFilteredValue()).toBe(number);
      survey.locale = "";
      expect(survey.data, "back").toEqual({ q1: text, q2: inRange });
      expect(getText(survey).getFilteredValue()).toBe(number);
    });

    test.each([
      ["an invalid date", "13/45/2000"], ["a date in another format", "25.12.2000"]
    ])("%s stays: the empty mask is no text", (_, text) => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(datetime) });
      const q = getText(survey);
      survey.data = { q1: text };
      survey.locale = "de";
      expect(survey.data).toEqual({ q1: text });
      survey.locale = "";
      expect(survey.data, "back").toEqual({ q1: text });
    });

    test("a question with no survey converts its text", () => {
      const q = new QuestionTextModel("q1");
      q.maskType = "numeric";
      q.maskSettings.saveMaskedValue = true;
      q.value = "2,222.22";
      surveyLocalization.currentLocale = "de";
      q.localeChanged();
      expect(q.value).toBe("2.222,22");
      expect(q.getFilteredValue()).toBe(2222.22);
    });

    test("out-of-range text through two locales, whose separators differ from both", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved({ ...numeric, maskSettings: { precision: 2, max: 1000 } }) });
      const q = getText(survey);
      survey.data = { q1: "2,222.22" };
      survey.locale = "de";
      survey.locale = "fr";
      expect(q.value).toBe("2,222.22");
      expect(q.getFilteredValue()).toBe(2222.22);
      survey.locale = "";
      expect(survey.data).toEqual({ q1: "2,222.22" });
    });

    test("a value of zero, with a neighbour's write during the change", () => {
      const zeros = saved({ ...numeric, maskSettings: { precision: 2, showTrailingZeros: true } });
      const survey = new SurveyModel({
        elements: [
          { type: "multipletext", name: "mt", items: [{ name: "a", ...zeros }, { name: "b", ...zeros }] },
          { type: "text", name: "q1", ...zeros },
          { type: "text", name: "q2", ...zeros }
        ]
      });
      survey.data = { mt: { a: "1,111.11", b: "0.00" }, q1: "1.50", q2: "0.00" };
      survey.onValueChanged.add((sender, options) => {
        if (options.name === "q1") sender.mergeData({ q2: "0.00" });
      });
      const b = (<any>survey.getQuestionByName("mt")).items[1].editor;
      survey.locale = "de";
      expect(survey.getValue("mt").b, "multiple text").toBe("0,00");
      expect(survey.getValue("q2"), "mergeData").toBe("0,00");
      expect(b.getFilteredValue()).toBe(0);
      expect(getText(survey, "q2").getFilteredValue()).toBe(0);
      survey.locale = "";
      expect(survey.getValue("mt").b, "multiple text, back").toBe("0.00");
      expect(survey.getValue("q2"), "mergeData, back").toBe("0.00");
    });

    test("a text nothing has read, in a matrix cell, a panel, a multiple text and an open detail panel", () => {
      const mask = saved(numeric);
      const survey = createSurvey(
        { type: "matrixdynamic", name: "m", rowCount: 0, columns: [{ name: "c", cellType: "text", ...mask }] },
        { type: "paneldynamic", name: "p", templateElements: [{ type: "text", name: "t", ...mask }] },
        { type: "multipletext", name: "mt", items: [{ name: "a", ...mask }] },
        { type: "matrixdynamic", name: "d", rowCount: 0, detailPanelMode: "underRow", columns: [{ name: "c", cellType: "text" }], detailElements: [{ type: "text", name: "t", ...mask }] }
      );
      survey.data = { m: [{ c: "2,222.22" }], p: [{ t: "2,222.22" }], mt: { a: "2,222.22" }, d: [{ t: "2,222.22" }] };
      const cell = (<any>survey.getQuestionByName("m")).visibleRows[0].cells[0].question;
      const inPanel = (<any>survey.getQuestionByName("p")).panels[0].getQuestionByName("t");
      const item = (<any>survey.getQuestionByName("mt")).items[0].editor;
      const row = (<any>survey.getQuestionByName("d")).visibleRows[0];
      row.showDetailPanel();
      const inDetail = row.detailPanel.getQuestionByName("t");
      survey.locale = "de";
      [cell, inPanel, item, inDetail].forEach((q: QuestionTextModel) => expect(q.getFilteredValue(), q.name).toBe(2222.22));
      expect(survey.data.m[0].c, "the cell converts").toBe("2.222,22");
      expect(survey.data.p[0].t, "the panel's question converts").toBe("2.222,22");
      expect(survey.data.mt.a, "the item converts").toBe("2.222,22");
      expect(survey.data.d[0].t, "NE01: a detail panel keeps its text").toBe("2,222.22");
      survey.locale = "";
      [cell, inPanel, item, inDetail].forEach((q: QuestionTextModel) => expect(q.getFilteredValue(), q.name + ", back").toBe(2222.22));
      expect(survey.data.m[0].c).toBe("2,222.22");
    });

    test("a switch that changes no format writes nothing", () => {
      const survey = createSurvey(
        { type: "text", name: "q1", ...saved(numeric) },
        { type: "text", name: "q2", maskType: "datetime", maskSettings: { pattern: "dd.mm.yyyy", saveMaskedValue: true } },
        { type: "text", name: "q3", ...saved({ ...currency, maskSettings: { precision: 2, currencySymbol: euro } }) }
      );
      // ja has en's separators. The texts are not the mask's own form, so a regenerated text would differ.
      const data = { q1: "1234.5", q2: "25/12/2000", q3: euro + "1234.5" };
      survey.data = data;
      let changes = 0;
      survey.onValueChanged.add(() => changes++);
      survey.locale = "ja";
      expect(changes).toBe(0);
      expect(survey.data).toEqual(data);
      survey.locale = "";
      expect(changes).toBe(0);
    });

    test("affixes that differ only in a space are another format", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved({ ...currency, maskSettings: { precision: 2, currencySymbol: "$" } }) });
      const q = getText(survey);
      survey.data = { q1: "$1,234.56" };
      const input = createInput(q);
      survey.locale = "sw";
      expect(survey.data).toEqual({ q1: "$ 1,234.56" });
      expect(input.value).toBe("$ 1,234.56");
      survey.locale = "";
      expect(survey.data).toEqual({ q1: "$1,234.56" });
      input.remove();
    });

    test("a change of the decimal separator alone converts", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved({ ...numeric, maskSettings: { precision: 2, thousandsSeparator: "'" } }) });
      survey.data = { q1: "1'234.56" };
      survey.locale = "de";
      expect(survey.data).toEqual({ q1: "1'234,56" });
      survey.locale = "";
      expect(survey.data).toEqual({ q1: "1'234.56" });
    });

    test("a currency whose separators stay but whose affixes change converts", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved({ ...currency, maskSettings: { precision: 2, currencySymbol: euro } }) });
      survey.data = { q1: euro + "1,234.56" };
      survey.locale = "mm";
      expect(survey.data).toEqual({ q1: "1,234.56 " + euro });
    });

    test("survey.regionalFormat assigned at runtime converts the same way", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) }, { type: "text", name: "q2", ...saved(numeric) });
      const q = getText(survey);
      survey.data = { q1: "2,222.22", q2: "1,111.11" };
      survey.regionalFormat.decimalSeparator = ",";
      survey.regionalFormat.thousandsSeparator = ".";
      expect(survey.data).toEqual({ q1: "2.222,22", q2: "1.111,11" });
      expect(q.getFilteredValue()).toBe(2222.22);
      survey.regionalFormat.decimalSeparator = undefined;
      survey.regionalFormat.thousandsSeparator = undefined;
      expect(survey.data).toEqual({ q1: "2,222.22", q2: "1,111.11" });
    });

    test("a write that bypasses onChangeQuestionValue still gives the right value", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      survey.data = { q1: "1,111.11" };
      q["storeQuestionValue"]("2,222.22");
      expect(q.getFilteredValue()).toBe(2222.22);
      expect(q.maskSettings.unmaskedValue).toBe(2222.22);
    });

    test("a locale change regenerates from the value the question holds, not from an older one", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      survey.data = { q1: "1,111.11" };
      q["storeQuestionValue"]("5");
      survey.locale = "de";
      expect(q.value).toBe("5");
      expect(q.getFilteredValue()).toBe(5);
    });

    test("the regenerated text is not parsed back", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      const mask = <InputMaskNumeric>q.maskSettings;
      const read = mask.getUnmaskedValue.bind(mask);
      mask.getUnmaskedValue = (src: string): any => read(src) * 2;
      survey.data = { q1: "100.50" };
      expect(q.getFilteredValue()).toBe(201);
      survey.locale = "de";
      expect(q.value, "generated from the number").toBe("201");
      expect(q.getFilteredValue(), "the number stays").toBe(201);
    });

    test("a text written in the new locale during the change is read in it", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) }, { type: "text", name: "q2", ...saved(numeric) });
      survey.data = { q1: "1,111.11", q2: "2,222.22" };
      survey.onValueChanged.add((sender, options) => {
        if (options.name === "q1") sender.setValue("q2", "3.333,33");
      });
      survey.locale = "de";
      expect(survey.getValue("q2")).toBe("3.333,33");
      expect(getText(survey, "q2").getFilteredValue()).toBe(3333.33);
    });
  });

  describe("A replaced mask", () => {
    const germanFormat = (): InputMaskNumeric => {
      const mask = new InputMaskNumeric();
      mask.fromJSON({ saveMaskedValue: true, decimalSeparator: ",", thousandsSeparator: "." });
      return mask;
    };

    test("a new maskType starts empty", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      survey.data = { q1: "1,234.56" };
      expect(q.getFilteredValue()).toBe(1234.56);
      q.maskType = "datetime";
      expect(q.maskSettings.unmaskedValue, "not the old number").toBeUndefined();
    });

    test("the same maskType keeps the number, which the text would misread", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      survey.data = { q1: "1,234.56" };
      q.maskSettings = germanFormat();
      expect(q.value, "MU03").toBe("1,234.56");
      expect(q.maskSettings.unmaskedValue).toBe(1234.56);
      expect(q.getFilteredValue()).toBe(1234.56);
      (<InputMaskNumeric>q.maskSettings).precision = 3;
      expect(q.getFilteredValue(), "a later setting does not read the old text in the new format").toBe(1234.56);
    });

    test("a text nothing has read is parsed in the old mask's format", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      q["storeQuestionValue"]("1,234.56");
      q.maskSettings = germanFormat();
      expect(q.getFilteredValue()).toBe(1234.56);
    });

    test("without a survey a replaced mask reads the text as on master, and the survey reads it again", () => {
      const survey = new SurveyModel({ locale: "de", elements: [{ type: "text", name: "q0" }] });
      survey.data = { q1: "1,234" };
      const q = new QuestionTextModel("q1");
      q.maskType = "numeric";
      (<InputMaskNumeric>q.maskSettings).precision = 3;
      q.maskSettings.saveMaskedValue = true;
      q.value = "1,234";
      const mask = new InputMaskNumeric();
      mask.fromJSON({ saveMaskedValue: true, precision: 3 });
      q.maskSettings = mask;
      survey.pages[0].addElement(q);
      expect(q.getFilteredValue()).toBe(1.234);
    });

    test("a mask with another save mode does not take the value over", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      survey.data = { q1: "1,234.56" };
      const mask = new InputMaskNumeric();
      mask.fromJSON({ saveMaskedValue: false });
      q.maskSettings = mask;
      expect(q.getFilteredValue(), "as on master: the value").toBe("1,234.56");
    });

    test("a multiple text item assigns the mask to its editor", () => {
      const survey = createSurvey({ type: "multipletext", name: "mt", items: [{ name: "a", ...saved(numeric) }] });
      const item = (<any>survey.getQuestionByName("mt")).items[0];
      survey.data = { mt: { a: "1,234.56" } };
      item.maskSettings = germanFormat();
      expect(item.editor.getFilteredValue()).toBe(1234.56);
      expect(survey.data).toEqual({ mt: { a: "1,234.56" } });
    });
  });

  /* A settings change does not rewrite the stored text (MU03). The kept value stays when it renders back
     into that text, because the text may be in the old format. Otherwise the text is read again. */
  describe("A mask settings change", () => {
    test("a text that does not fit the old precision is read again, and a switch does not lose it", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved({ ...numeric, maskSettings: { precision: 0 } }) });
      const q = getText(survey);
      survey.data = { q1: "12.5" };
      expect(q.getFilteredValue(), "precision 0 truncates the fraction").toBe(12);
      (<InputMaskNumeric>q.maskSettings).precision = 2;
      expect(q.getFilteredValue()).toBe(12.5);
      survey.locale = "de";
      expect(survey.data).toEqual({ q1: "12,5" });
      survey.locale = "";
      expect(survey.data).toEqual({ q1: "12.5" });
    });

    test("the digits the old precision cut are back, in the element too", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      survey.data = { q1: "1,234.5678" };
      const input = createInput(q);
      (<InputMaskNumeric>q.maskSettings).precision = 4;
      expect(q.getFilteredValue()).toBe(1234.5678);
      expect(input.value).toBe("1,234.5678");
      survey.locale = "de";
      expect(survey.data).toEqual({ q1: "1.234,5678" });
      survey.locale = "";
      expect(survey.data).toEqual({ q1: "1,234.5678" });
      input.remove();
    });

    test("separators set for a text the mask misread reach a condition", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) }, { type: "text", name: "q2", visibleIf: "{q1} > 1000" });
      const q = getText(survey);
      const mask = <InputMaskNumeric>q.maskSettings;
      survey.data = { q1: "1.234,56" };
      expect(q.getFilteredValue(), "as on master").toBe(1.23);
      mask.decimalSeparator = ",";
      mask.thousandsSeparator = ".";
      survey.data = { q1: "1.234,56" };
      expect(q.getFilteredValue()).toBe(1234.56);
      expect(getText(survey, "q2").isVisible).toBe(true);
    });

    test("a mask JSON applied to a live question is read after all of it arrives", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...numeric }, { type: "text", name: "q2", ...numeric });
      const q = getText(survey);
      q.value = "1,234.5678";
      q.fromJSON({ maskSettings: { saveMaskedValue: true, precision: 4 } });
      expect(q.getFilteredValue(), "fromJSON").toBe(1234.5678);
      survey.locale = "de";
      expect(q.value).toBe("1.234,5678");
      survey.locale = "";
      const german = getText(survey, "q2");
      german.value = "1.234,56";
      german.maskSettings.setData({ saveMaskedValue: true, decimalSeparator: ",", thousandsSeparator: "." });
      expect(german.getFilteredValue(), "setData").toBe(1234.56);
    });

    test.each([
      ["1,234", 1.234], ["1.234", 1234]
    ])("one mask JSON is read as a whole, also for a text that fits the old settings: %s", (text, number) => {
      const json = { saveMaskedValue: true, decimalSeparator: ",", thousandsSeparator: ".", precision: 3 };
      const survey = createSurvey({ type: "text", name: "q1", ...{ ...numeric, maskSettings: { precision: 3 } } }, { type: "text", name: "q2", ...{ ...numeric, maskSettings: { precision: 3 } } });
      const q = getText(survey);
      q.value = text;
      q.maskSettings.setData(json);
      expect(q.getFilteredValue(), "setData").toBe(number);
      const q2 = getText(survey, "q2");
      q2.value = text;
      q2.fromJSON({ maskSettings: json });
      expect(q2.getFilteredValue(), "fromJSON").toBe(number);
    });

    const emptyPattern = { type: "text", name: "q1", maskType: "pattern", maskSettings: { saveMaskedValue: true } };
    test("a pattern that arrives after the text reads it: at runtime", () => {
      const survey = createSurvey(emptyPattern);
      const q = getText(survey);
      survey.data = { q1: "12-34" };
      (<any>q.maskSettings).pattern = "99-99";
      expect(q.getFilteredValue()).toBe(q.maskSettings.getUnmaskedValue("12-34"));
      expect(q.getFilteredValue()).toBeTruthy();
    });

    test("a pattern that arrives after the text reads it: a replaced mask", () => {
      const survey = createSurvey(emptyPattern);
      const q = getText(survey);
      survey.data = { q1: "12-34" };
      const mask = new InputMaskPattern();
      mask.fromJSON({ saveMaskedValue: true, pattern: "99-99" });
      q.maskSettings = mask;
      expect(q.getFilteredValue()).toBeTruthy();
    });

    test("a pattern that arrives after the text reads it: in one JSON with saveMaskedValue", () => {
      const survey = createSurvey({ type: "text", name: "q1", maskType: "pattern" });
      const q = getText(survey);
      q.value = "12-34";
      q.maskSettings.setData({ saveMaskedValue: true, pattern: "99-99" });
      expect(q.getFilteredValue()).toBeTruthy();
    });

    test("a text the mask renders keeps its number: it may be in the old format", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) }, { type: "text", name: "q2", ...saved(datetime) });
      const q = getText(survey);
      const date = getText(survey, "q2");
      survey.data = { q1: "1,234.56", q2: "12/25/2000" };
      (<InputMaskNumeric>q.maskSettings).decimalSeparator = ",";
      (<InputMaskNumeric>q.maskSettings).thousandsSeparator = ".";
      (<InputMaskDateTime>date.maskSettings).pattern = "dd.mm.yyyy";
      expect(q.getFilteredValue()).toBe(1234.56);
      expect(date.getFilteredValue()).toBe("2000-12-25");
      expect(q.value, "MU03").toBe("1,234.56");
    });

    test("out-of-range text keeps its number through a settings change", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved({ ...numeric, maskSettings: { precision: 2, max: 1000 } }) });
      const q = getText(survey);
      survey.data = { q1: "2,222.22" };
      survey.locale = "de";
      (<InputMaskNumeric>q.maskSettings).precision = 3;
      expect(q.getFilteredValue()).toBe(2222.22);
      survey.locale = "";
      expect(survey.data).toEqual({ q1: "2,222.22" });
    });

    test("a text a switch regenerated is the mask's own and keeps its number", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      const mask = <InputMaskNumeric>q.maskSettings;
      survey.data = { q1: "1,234.5678" };
      survey.locale = "de";
      expect(q.value).toBe("1.234,56");
      mask.decimalSeparator = ".";
      mask.thousandsSeparator = ",";
      expect(q.getFilteredValue(), "the text is in the old format now").toBe(1234.56);
    });

    test("a preset that arrives after the text reads it", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(datetime) });
      const q = getText(survey);
      survey.data = { q1: "01:45 PM" };
      expect(q.getFilteredValue(), "not a date").toBe("");
      (<InputMaskDateTime>q.maskSettings).patternPreset = "localeTime";
      expect(q.getFilteredValue()).toBeTruthy();
      expect(q.getFilteredValue()).toBe(q.maskSettings.getUnmaskedValue("01:45 PM"));
    });

    test.each([
      ["a text the mask renders", "1,234.56", "1.234,56", 1234.56, "1,234.56"],
      ["a text without grouping", "1234.56", "1.234,56", 1234.56, "1,234.56"]
    ])("a setting that changes during a switch does not read the old text in the new format: %s", (_, text, deText, number, back) => {
      const survey = createSurvey({ type: "text", name: "q0", ...saved(numeric) }, { type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey, "q1");
      survey.data = { q0: "1,111.11", q1: text };
      survey.onValueChanged.add((sender, options) => {
        if (options.name === "q0") (<InputMaskNumeric>q.maskSettings).precision = 3;
      });
      survey.locale = "de";
      expect(q.value).toBe(deText);
      expect(q.getFilteredValue()).toBe(number);
      survey.locale = "";
      expect(q.value, "back").toBe(back);
    });

    test("a replaced mask reads a text the old one misread, before a switch", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      survey.data = { q1: "1,234.5678" };
      const mask = new InputMaskNumeric();
      mask.fromJSON({ saveMaskedValue: true, precision: 4 });
      q.maskSettings = mask;
      survey.locale = "de";
      expect(survey.data).toEqual({ q1: "1.234,5678" });
    });

    test("a replaced mask does not make a parse without a survey final", () => {
      const survey = new SurveyModel({ locale: "de", elements: [{ type: "text", name: "q0" }] });
      survey.data = { q1: "1.234,56" };
      const q = new QuestionTextModel("q1");
      q.maskType = "numeric";
      q.maskSettings.saveMaskedValue = true;
      q.value = "1.234,56";
      const mask = new InputMaskNumeric();
      mask.fromJSON({ saveMaskedValue: true });
      q.maskSettings = mask;
      survey.pages[0].addElement(q);
      expect(q.getFilteredValue()).toBe(1234.56);
      survey.locale = "";
      expect(survey.getValue("q1")).toBe("1,234.56");
    });
  });

  test("a number that prints with an exponent keeps its digits", () => {
    const survey = createSurvey({ type: "text", name: "q1", ...saved({ ...numeric, maskSettings: { precision: 8 } }) });
    const q = getText(survey);
    survey.data = { q1: "0.00000012" };
    const input = createInput(q);
    expect(q.getFilteredValue()).toBe(1.2e-7);
    (<InputMaskNumeric>q.maskSettings).precision = 9;
    expect(input.value, "a property change").toBe("0.00000012");
    survey.locale = "de";
    expect(survey.data, "a locale change").toEqual({ q1: "0,00000012" });
    input.remove();
  });

  test("a text that arrives in a mask that missed a locale change is in the current format", () => {
    const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
    const q = getText(survey);
    survey.data = { q1: "1,111.11" };
    // no survey.locale: as in a hidden row, which the walk over the rows does not reach
    surveyLocalization.currentLocale = "de";
    survey.data = { q1: "2.222,22" };
    expect(q.getFilteredValue()).toBe(2222.22);
    surveyLocalization.currentLocale = "";
    q.localeChanged();
    expect(q.value).toBe("2,222.22");
  });

  describe("The adapter", () => {
    test("a mask property change shows the number, not the saved text masked again", () => {
      const survey = new SurveyModel({ locale: "de", elements: [{ type: "text", name: "q1", ...saved(numeric) }] });
      const q = getText(survey);
      survey.data = { q1: "1.234,56" };
      const input = createInput(q);
      expect(input.value).toBe("1.234,56");
      (<InputMaskNumeric>q.maskSettings).precision = 3;
      expect(input.value).toBe("1.234,56");
      expect(q.value, "MU03").toBe("1.234,56");
      input.remove();
    });

    test("an invalid date stays visible", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(datetime) });
      const q = getText(survey);
      survey.data = { q1: "13/45/2000" };
      const input = createInput(q);
      (<InputMaskDateTime>q.maskSettings).min = "2000-01-01";
      expect(input.value).toBe("13/45/2000");
      input.remove();
    });

    test("text the mask cannot read stays visible", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) });
      const q = getText(survey);
      survey.data = { q1: "abc" };
      const input = createInput(q);
      expect(input.value).toBe("abc");
      (<InputMaskNumeric>q.maskSettings).precision = 3;
      expect(input.value, "a property").toBe("abc");
      survey.locale = "de";
      expect(input.value, "a locale").toBe("abc");
      input.remove();
    });

    test("out-of-range text stays visible through a locale change", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved({ ...numeric, maskSettings: { precision: 2, max: 1000 } }) });
      const q = getText(survey);
      survey.data = { q1: "2,222.22" };
      const input = createInput(q);
      survey.locale = "de";
      expect(input.value).toBe("2,222.22");
      input.remove();
    });

    test("a converted text reaches the element, and an empty question shows the empty mask", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...saved(numeric) }, { type: "text", name: "q2", ...saved(datetime) });
      const q = getText(survey);
      survey.data = { q1: "1,234.56" };
      const input = createInput(q);
      const empty = createInput(getText(survey, "q2"));
      survey.locale = "de";
      expect(input.value).toBe("1.234,56");
      expect(empty.value).toBe("TT.MM.JJJJ");
      expect(q.maskSettings.unmaskedValue).toBe(1234.56);
      input.remove();
      empty.remove();
    });

    test("rendering an empty question does not turn its value into a text", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...numeric });
      const q = getText(survey);
      const input = createInput(q);
      expect(q.maskSettings.unmaskedValue).toBeUndefined();
      input.remove();
    });
  });

  describe("An unfinished entry (MU04)", () => {
    const entryCases: Array<[string, any, string, string]> = [
      ["numeric", numeric, "2,222.22", "2.222,22"],
      ["currency", currency, "$2,222.22", "2.222,22 " + euro]
    ];

    test.each(entryCases)("%s: a piped title reads before the question's turn", (_, mask, text, deText) => {
      const survey = createSurvey({ type: "text", name: "q1", title: "Sum: {q1}", ...mask });
      const q = getText(survey);
      q.value = 1111.11;
      const input = createInput(q);
      input.focus();
      input.value = text;
      q.locTitle.textOrHtml;
      q.locTitle.onChanged = () => { q.locTitle.textOrHtml; };
      survey.locale = "de";
      expect(input.value).toBe(deText);
      input.remove();
    });

    test.each(entryCases)("%s: a condition reads a saved question before its turn", (_, mask, text, deText) => {
      const survey = createSurvey(
        { type: "text", name: "q0", ...saved(numeric) },
        { type: "text", name: "q1", ...saved(mask) },
        { type: "text", name: "q2", visibleIf: "{q0} > 0 and {q1} > 0" }
      );
      const q = getText(survey);
      survey.data = { q0: "1,111.11", q1: q.maskSettings.getMaskedValue(1111.11) };
      const input = createInput(q);
      input.focus();
      input.value = text;
      survey.locale = "de";
      expect(input.value).toBe(deText);
      input.remove();
    });

    test("a rendered value that nobody typed is in the format of the survey, not the one read before it", () => {
      const survey = new SurveyModel({ locale: "de", elements: [{ type: "text", name: "q0" }] });
      const q = new QuestionTextModel("q1");
      q.maskType = "numeric";
      expect(q.inputValue, "a read before the survey").toBe("");
      survey.pages[0].addElement(q);
      q.value = 2222.22;
      const input = createInput(q);
      input.focus();
      expect(input.value).toBe("2.222,22");
      survey.locale = "";
      expect(input.value).toBe("2,222.22");
      input.remove();
    });

    test("an entry leaves the affixes it was written with, not the new locale's", () => {
      const survey = new SurveyModel({ regionalFormat: { currencySymbol: "Rs." }, elements: [{ type: "text", name: "q1", ...currency }] });
      const q = getText(survey);
      const input = createInput(q);
      input.focus();
      input.value = "Rs.2,222.22";
      survey.locale = "de";
      expect(input.value).toBe("2.222,22 Rs.");
      input.remove();
    });

    test("an entry typed in a mask that missed a locale change is in the format it was typed in", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...numeric });
      const q = getText(survey);
      const input = createInput(q);
      // no survey.locale: as in a hidden row, which the walk over the rows does not reach
      surveyLocalization.currentLocale = "de";
      input.focus();
      input.value = (<InputMaskNumeric>q.maskSettings).processInput({ prevValue: "", insertedChars: "2.222,22", selectionStart: 0, selectionEnd: 0 }).value;
      expect(input.value).toBe("2.222,22");
      surveyLocalization.currentLocale = "";
      q.localeChanged();
      expect(input.value).toBe("2,222.22");
      input.remove();
    });

    test("an entry typed after a mask property change converts", () => {
      const survey = createSurvey({ type: "text", name: "q1", ...numeric });
      const q = getText(survey);
      const mask = <InputMaskNumeric>q.maskSettings;
      mask.getMaskedValue(1);
      mask.decimalSeparator = ";";
      const input = createInput(q);
      input.focus();
      input.value = "2,222;22";
      survey.locale = "de";
      expect(input.value, "the explicit separator stays").toBe("2.222;22");
      input.remove();
    });
  });
});

describe("Currency mask: locale rollout", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  const symbol = "\u20AC";

  test("The pinned masked currency value for every curated locale", () => {
    // 1234.56 and its negative, rendered with each locale's separators and its currency pattern;
    // the symbol is the author's, the placement and the spacing are the locale's
    const expected: { [locale: string]: Array<string> } = {
      "ar": ["1,234.56 \u20AC", "-1,234.56 \u20AC"],
      "bg": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "ca": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "cs": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "cy": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "da": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "de": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "el": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "en": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "en-AU": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "en-CA": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "en-GB": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "en-IE": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "en-IN": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "en-NZ": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "en-ZA": ["\u20AC1\u00A0234,56", "-\u20AC1\u00A0234,56"],
      "es": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "et": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "eu": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "fa": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "fi": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "fil": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "fr": ["1\u202F234,56 \u20AC", "-1\u202F234,56 \u20AC"],
      "fr-CA": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "fr-CH": ["1\u202F234,56 \u20AC", "-1\u202F234,56 \u20AC"],
      "he": ["1,234.56 \u20AC", "-1,234.56 \u20AC"],
      "hi": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "hr": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "ht": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "hu": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "id": ["\u20AC1.234,56", "-\u20AC1.234,56"],
      "is": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "it": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "ja": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "ka": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "kk": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "ko": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "lt": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "lv": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "mk": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "mm": ["1,234.56 \u20AC", "-1,234.56 \u20AC"],
      "ms": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "nl": ["\u20AC 1.234,56", "\u20AC -1.234,56"],
      "nl-BE": ["\u20AC 1.234,56", "\u20AC -1.234,56"],
      "no": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "pl": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "pt": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "pt-BR": ["\u20AC 1.234,56", "-\u20AC 1.234,56"],
      "ro": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "ru": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "sk": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "sl": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "sr": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "sv": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "sw": ["\u20AC 1,234.56", "-\u20AC 1,234.56"],
      "tel": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "tg": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "th": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "tr": ["\u20AC1.234,56", "-\u20AC1.234,56"],
      "uk": ["1\u00A0234,56 \u20AC", "-1\u00A0234,56 \u20AC"],
      "ur": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "vi": ["1.234,56 \u20AC", "-1.234,56 \u20AC"],
      "zh": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "zh-CN": ["\u20AC1,234.56", "-\u20AC1,234.56"],
      "zh-TW": ["\u20AC1,234.56", "-\u20AC1,234.56"],
    };
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "currency", maskSettings: { currencySymbol: symbol } }] });
    const mask = <InputMaskCurrency>(<QuestionTextModel>survey.getQuestionByName("q1")).maskSettings;
    Object.keys(localeData).forEach(locale => {
      expect(Object.keys(expected).indexOf(locale) >= 0, "locale " + JSON.stringify(locale) + " is pinned").toBe(true);
    });
    Object.keys(expected).forEach(locale => {
      survey.regionalFormat.locale = locale;
      expect(mask.getMaskedValue(1234.56), "locale " + JSON.stringify(locale)).toBe(expected[locale][0]);
      expect(mask.getMaskedValue(-1234.56), "locale " + JSON.stringify(locale) + ", negative").toBe(expected[locale][1]);
    });
    survey.regionalFormat.locale = "";
  });

  test("A currency value round-trips through the mask under every curated locale", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "currency", maskSettings: { currencySymbol: symbol } }] });
    const mask = <InputMaskCurrency>(<QuestionTextModel>survey.getQuestionByName("q1")).maskSettings;
    Object.keys(localeData).forEach(locale => {
      survey.regionalFormat.locale = locale;
      [1234.56, -1234.56].forEach(value => {
        const masked = mask.getMaskedValue(value);
        const unmasked = mask.getUnmaskedValue(masked);
        expect(typeof unmasked, "locale " + JSON.stringify(locale) + " stores a number").toBe("number");
        expect(unmasked, "locale " + JSON.stringify(locale) + " round trip of " + JSON.stringify(masked)).toBe(value);
      });
    });
    survey.regionalFormat.locale = "";
  });

  test("Every curated currency symbol is valid and round trips under its own locale", () => {
    // no maskSettings: the symbol under test is the curated one, placed by the curated pattern
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1", maskType: "currency" }] });
    const mask = <InputMaskCurrency>(<QuestionTextModel>survey.getQuestionByName("q1")).maskSettings;
    let checkedCount = 0;
    Object.keys(localeData).forEach(locale => {
      const symbol = localeData[locale].currencySymbol;
      expect(isValidCurrencySymbol(symbol), locale + ".currencySymbol = " + JSON.stringify(symbol)).toBe(true);
      survey.regionalFormat.locale = locale;
      expect(mask.currencySymbol, "locale " + JSON.stringify(locale) + " resolves its own symbol").toBe(symbol);
      [1234.56, -1234.56].forEach(value => {
        const masked = mask.getMaskedValue(value);
        expect(masked.indexOf(symbol) >= 0, "locale " + JSON.stringify(locale) + " renders " + JSON.stringify(masked)).toBe(true);
        expect(mask.getUnmaskedValue(masked), "locale " + JSON.stringify(locale) + " round trip of " + JSON.stringify(masked)).toBe(value);
      });
      checkedCount++;
    });
    survey.regionalFormat.locale = "";
    expect(checkedCount, "every locale entry curates a currency symbol").toBe(Object.keys(localeData).length);
  });

  test("Every curated currency pattern is valid and places a symbol", () => {
    let checkedCount = 0;
    Object.keys(localeData).forEach(locale => {
      const pattern = localeData[locale].currencyPattern;
      expect(isValidCurrencyPattern(pattern), locale + ".currencyPattern = " + JSON.stringify(pattern)).toBe(true);
      expect(pattern.indexOf("@") >= 0, locale + " places the currency symbol").toBe(true);
      checkedCount++;
    });
    expect(checkedCount, "every locale entry curates a currency pattern").toBe(Object.keys(localeData).length);
  });
});

describe("Regional format: resolution chain", () => {
  afterEach(() => {
    surveyLocalization.currentLocale = "";
  });

  const symbol = "\u20AC";
  function createSurvey(regionalFormat?: any): SurveyModel {
    return new SurveyModel({
      regionalFormat: regionalFormat,
      elements: [
        { type: "text", name: "date", maskType: "datetime" },
        { type: "text", name: "time", maskType: "datetime", maskSettings: { patternPreset: "localeTime" } },
        { type: "text", name: "num", maskType: "numeric" },
        { type: "text", name: "cur", maskType: "currency", maskSettings: { currencySymbol: symbol } },
      ]
    });
  }
  function getQuestion(survey: SurveyModel, name: string): QuestionTextModel {
    return <QuestionTextModel>survey.getQuestionByName(name);
  }

  test("An override on the survey outranks every curated locale, and an authored value outranks the override", () => {
    const survey = createSurvey({ datePattern: "yyyy-mm-dd", timePattern: "HH.MM", decimalSeparator: "*", thousandsSeparator: "|", currencyPattern: "#@" });
    const date = getQuestion(survey, "date");
    const time = getQuestion(survey, "time");
    const num = <InputMaskNumeric>getQuestion(survey, "num").maskSettings;
    const cur = <InputMaskCurrency>getQuestion(survey, "cur").maskSettings;
    Object.keys(localeData).forEach(locale => {
      survey.regionalFormat.locale = locale;
      expect(date.inputValue, "locale " + JSON.stringify(locale) + " date").toBe("yyyy-mm-dd");
      expect(time.inputValue, "locale " + JSON.stringify(locale) + " time").toBe("HH.MM");
      expect(num.getMaskedValue(1234567.89), "locale " + JSON.stringify(locale) + " number").toBe("1|234|567*89");
      expect(cur.getMaskedValue(1234.56), "locale " + JSON.stringify(locale) + " currency").toBe("1|234*56" + symbol);
    });
    survey.regionalFormat.locale = "de";
    date.maskSettings["pattern"] = "dd/mm/yyyy";
    time.maskSettings["pattern"] = "hh:MM TT";
    num.decimalSeparator = "#";
    num.thousandsSeparator = "'";
    cur.prefix = "EUR ";
    expect(date.inputValue, "authored date").toBe("dd/mm/yyyy");
    expect(time.inputValue, "authored time").toBe("hh:MM TT");
    expect(num.getMaskedValue(1234567.89), "authored separators").toBe("1'234'567#89");
    expect(cur.getMaskedValue(1234.56), "authored affixes over the overridden separators").toBe("EUR 1|234*56");
    survey.regionalFormat.locale = "";
  });

  test("Clearing an override restores every curated locale's own value through the same chain", () => {
    const survey = createSurvey({ datePattern: "yyyy-mm-dd", timePattern: "HH.MM", decimalSeparator: "*", thousandsSeparator: "|", currencyPattern: "#@" });
    const options = survey.regionalFormat;
    options.datePattern = undefined;
    options.timePattern = undefined;
    options.decimalSeparator = undefined;
    options.thousandsSeparator = undefined;
    options.currencyPattern = undefined;
    expect(options.isEmpty, "every override is cleared").toBe(true);
    const date = getQuestion(survey, "date");
    const time = getQuestion(survey, "time");
    const num = <InputMaskNumeric>getQuestion(survey, "num").maskSettings;
    const cur = <InputMaskCurrency>getQuestion(survey, "cur").maskSettings;
    Object.keys(localeData).forEach(locale => {
      survey.regionalFormat.locale = locale;
      const name = "locale " + JSON.stringify(locale);
      expect(date.inputValue, name + " date").toBe(getLocaleDataValue(locale, "datePattern"));
      expect(time.inputValue, name + " time").toBe(getLocaleDataValue(locale, "timePattern"));
      expect(num.decimalSeparator, name + " decimal").toBe(getLocaleDataValue(locale, "decimalSeparator"));
      expect(num.thousandsSeparator, name + " thousands").toBe(getLocaleDataValue(locale, "thousandsSeparator"));
      // a positive amount renders the pattern without its sign
      const affixes = getLocaleDataValue(locale, "currencyPattern").replace("-", "").split("#");
      const number = "1" + num.thousandsSeparator + "234" + num.decimalSeparator + "56";
      expect(cur.getMaskedValue(1234.56), name + " currency").toBe(affixes[0].replace("@", symbol) + number + affixes[1].replace("@", symbol));
    });
    survey.regionalFormat.locale = "";
  });
});
