import { surveyLocalization } from "./surveyStrings";

// Locale metadata that configures behavior or formats. Values displayed to the respondent as
// text (e.g. mask placeholder symbols) belong in the localization dictionaries instead; the
// entries here are configuration and are never rendered as text or translated.
// Date patterns are canonical SurveyJS mask grammar: dd, mm, yyyy plus literal separators.
export interface ILocaleData {
  datePattern?: string;
  // reserved for the time/datetime presets and the numeric/currency locale presets
  timePattern?: string;
  dateTimePattern?: string;
  decimalSeparator?: string;
  thousandsSeparator?: string;
}

// Keyed by SurveyJS locale codes (lowercase). Regional entries (en-gb, fr-ca) exist on their
// own - they do not need a localization dictionary. Extend or correct by assignment:
// localeData["en-nz"] = { datePattern: "dd/mm/yyyy" };
export const localeData: { [locale: string]: ILocaleData } = {
  "ar": { datePattern: "dd/mm/yyyy" },
  "bg": { datePattern: "dd.mm.yyyy" },
  "ca": { datePattern: "dd/mm/yyyy" },
  "cs": { datePattern: "dd. mm. yyyy" },
  "cy": { datePattern: "dd/mm/yyyy" },
  "da": { datePattern: "dd.mm.yyyy" },
  "de": { datePattern: "dd.mm.yyyy" },
  "el": { datePattern: "dd/mm/yyyy" },
  "en": { datePattern: "mm/dd/yyyy" },
  "en-au": { datePattern: "dd/mm/yyyy" },
  "en-ca": { datePattern: "yyyy-mm-dd" },
  "en-gb": { datePattern: "dd/mm/yyyy" },
  "en-ie": { datePattern: "dd/mm/yyyy" },
  "en-in": { datePattern: "dd/mm/yyyy" },
  "en-nz": { datePattern: "dd/mm/yyyy" },
  "en-za": { datePattern: "yyyy/mm/dd" },
  "es": { datePattern: "dd/mm/yyyy" },
  "et": { datePattern: "dd.mm.yyyy" },
  "eu": { datePattern: "yyyy/mm/dd" },
  "fa": { datePattern: "yyyy/mm/dd" },
  "fi": { datePattern: "dd.mm.yyyy" },
  "fil": { datePattern: "mm/dd/yyyy" },
  "fr": { datePattern: "dd/mm/yyyy" },
  "fr-ca": { datePattern: "yyyy-mm-dd" },
  "fr-ch": { datePattern: "dd.mm.yyyy" },
  "he": { datePattern: "dd.mm.yyyy" },
  "hi": { datePattern: "dd/mm/yyyy" },
  "hr": { datePattern: "dd. mm. yyyy" },
  "ht": { datePattern: "dd/mm/yyyy" },
  "hu": { datePattern: "yyyy. mm. dd" },
  "id": { datePattern: "dd/mm/yyyy" },
  "is": { datePattern: "dd.mm.yyyy" },
  "it": { datePattern: "dd/mm/yyyy" },
  "ja": { datePattern: "yyyy/mm/dd" },
  "ka": { datePattern: "dd.mm.yyyy" },
  "kk": { datePattern: "dd.mm.yyyy" },
  "ko": { datePattern: "yyyy. mm. dd" },
  "lt": { datePattern: "yyyy-mm-dd" },
  "lv": { datePattern: "dd.mm.yyyy" },
  "mk": { datePattern: "dd.mm.yyyy" },
  "mm": { datePattern: "dd/mm/yyyy" },
  "ms": { datePattern: "dd/mm/yyyy" },
  "nl": { datePattern: "dd-mm-yyyy" },
  "nl-be": { datePattern: "dd/mm/yyyy" },
  "no": { datePattern: "dd.mm.yyyy" },
  "pl": { datePattern: "dd.mm.yyyy" },
  "pt": { datePattern: "dd/mm/yyyy" },
  "pt-br": { datePattern: "dd/mm/yyyy" },
  "ro": { datePattern: "dd.mm.yyyy" },
  "ru": { datePattern: "dd.mm.yyyy" },
  "sk": { datePattern: "dd. mm. yyyy" },
  "sl": { datePattern: "dd. mm. yyyy" },
  "sr": { datePattern: "dd.mm.yyyy" },
  "sv": { datePattern: "yyyy-mm-dd" },
  "sw": { datePattern: "dd/mm/yyyy" },
  "tel": { datePattern: "dd-mm-yyyy" },
  "tg": { datePattern: "dd/mm/yyyy" },
  "th": { datePattern: "dd/mm/yyyy" },
  "tr": { datePattern: "dd.mm.yyyy" },
  "uk": { datePattern: "dd.mm.yyyy" },
  "ur": { datePattern: "dd/mm/yyyy" },
  "vi": { datePattern: "dd/mm/yyyy" },
  "zh": { datePattern: "yyyy/mm/dd" },
  "zh-cn": { datePattern: "yyyy/mm/dd" },
  "zh-tw": { datePattern: "yyyy/mm/dd" }
};

// Resolves one field through the chain: exact locale -> its language subtag -> "en". The walk is
// per field, so a regional entry that defines only some fields never shadows the rest, and an
// entry the validator rejects falls through the same way. The "en" entry defines every shipped
// field, so a lookup with a validator that accepts it cannot come back empty.
export function getLocaleDataValue(locale: string, field: keyof ILocaleData, isValid?: (value: string) => boolean): string {
  const chain: Array<string> = [];
  const addLocale = (loc: string): void => {
    if (!loc || chain.indexOf(loc) !== -1) return;
    chain.push(loc);
    const index = loc.indexOf("-");
    if (index > 0) {
      addLocale(loc.substring(0, index));
    }
  };
  addLocale(surveyLocalization.getCorrectLocaleName(locale || "").toLowerCase());
  addLocale("en");
  for (let i = 0; i < chain.length; i++) {
    const res = localeData[chain[i]]?.[field];
    if (res !== undefined && (!isValid || isValid(res))) return res;
  }
  return undefined;
}
