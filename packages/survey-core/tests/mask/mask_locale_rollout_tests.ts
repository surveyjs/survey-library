import { InputMaskDateTime } from "../../src/mask/mask_datetime";
import { InputMaskNumeric, isValidDecimalSeparator, isValidThousandsSeparator } from "../../src/mask/mask_numeric";
import { InputMaskCurrency, isValidCurrencyPattern, isValidCurrencySymbol } from "../../src/mask/mask_currency";
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

import { describe, test, expect, afterEach } from "vitest";

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
      // typing state; see the mask RTL design (promts/mask-rtl-00-phase1-design.md)
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
