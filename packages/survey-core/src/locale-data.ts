import { surveyLocalization } from "./surveyStrings";

// Locale metadata that configures behavior or formats. Values displayed to the respondent as
// text (e.g. mask placeholder symbols) belong in the localization dictionaries instead; the
// entries here are configuration and are never rendered as text or translated.
// Date patterns are canonical SurveyJS mask grammar: dd, mm, yyyy plus literal separators.
export interface ILocaleData {
  datePattern?: string;
  timePattern?: string;
  // reserved for the numeric/currency locale presets
  decimalSeparator?: string;
  thousandsSeparator?: string;
}

// Keyed by SurveyJS locale codes (lowercase). Regional entries (en-gb, fr-ca) exist on their
// own - they do not need a localization dictionary. Extend or correct by assignment:
// localeData["en-nz"] = { datePattern: "dd/mm/yyyy" };
//
// timePattern is 12-hour ("hh:MM TT") only where the locale writes the marker as the Latin
// AM/PM that the mask accepts as input. Locales that are 12-hour in CLDR but write the marker
// in another script (ar, el, hi, ur), with letters the mask cannot tell apart (ms: PG/PTG),
// or before the hour (ko, zh, zh-cn, zh-tw - the mask cannot parse a leading marker) are
// curated as 24-hour, which is accepted everywhere. Seconds are never included: no locale's
// short time format has them, and an author who needs them writes a pattern.
// There is deliberately no combined date-time field: the "localeDateTime" preset composes the
// two patterns above, so a locale that defines both never falls back to the english order.
export const localeData: { [locale: string]: ILocaleData } = {
  "ar": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "bg": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "ca": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "cs": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM" },
  "cy": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "da": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "de": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "el": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "en": { datePattern: "mm/dd/yyyy", timePattern: "hh:MM TT" },
  "en-au": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT" },
  "en-ca": { datePattern: "yyyy-mm-dd", timePattern: "hh:MM TT" },
  "en-gb": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "en-ie": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "en-in": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT" },
  "en-nz": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT" },
  "en-za": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM" },
  "es": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "et": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "eu": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM" },
  "fa": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM" },
  "fi": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "fil": { datePattern: "mm/dd/yyyy", timePattern: "hh:MM TT" },
  "fr": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "fr-ca": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM" },
  "fr-ch": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "he": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "hi": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "hr": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM" },
  "ht": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "hu": { datePattern: "yyyy. mm. dd", timePattern: "HH:MM" },
  "id": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "is": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "it": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "ja": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM" },
  "ka": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "kk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "ko": { datePattern: "yyyy. mm. dd", timePattern: "HH:MM" },
  "lt": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM" },
  "lv": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "mk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "mm": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "ms": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "nl": { datePattern: "dd-mm-yyyy", timePattern: "HH:MM" },
  "nl-be": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "no": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "pl": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "pt": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "pt-br": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "ro": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "ru": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "sk": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM" },
  "sl": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM" },
  "sr": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "sv": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM" },
  "sw": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "tel": { datePattern: "dd-mm-yyyy", timePattern: "HH:MM" },
  "tg": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "th": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "tr": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "uk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM" },
  "ur": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "vi": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM" },
  "zh": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM" },
  "zh-cn": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM" },
  "zh-tw": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM" }
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
