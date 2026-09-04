import { InputMaskDateTime } from "../../src/mask/mask_datetime";
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
      // symbols deliberately unlocalized (CJK repeats per digit, RTL is untested): the canonical
      // letters render in the locale's field order
      "ja": "yyyy/mm/dd",
      "ko": "yyyy. mm. dd",
      "zh-cn": "yyyy/mm/dd",
      "ar": "dd/mm/yyyy",
      "he": "dd.mm.yyyy"
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
