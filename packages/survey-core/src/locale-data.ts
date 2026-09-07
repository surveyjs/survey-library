import { surveyLocalization } from "./surveyStrings";

// Locale metadata that configures behavior or formats. Values displayed to the respondent as
// text (e.g. mask placeholder symbols) belong in the localization dictionaries instead; the
// entries here are configuration and are never rendered as text or translated.
// Date patterns are canonical SurveyJS mask grammar: dd, mm, yyyy plus literal separators.
// Currency patterns are a small CLDR inspired grammar: U+00A4 is the currency symbol the author
// supplies, # is the formatted number, - is the minus sign, and an optional ; separates the
// positive subpattern from the negative one. Without a ; the negative form is the positive one
// with a - in front. Everything else in a pattern is literal text.
export interface ILocaleData {
  datePattern?: string;
  timePattern?: string;
  decimalSeparator?: string;
  thousandsSeparator?: string;
  currencyPattern?: string;
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
// Numeric separators are the CLDR decimal and group symbols. A group symbol is often a no-break
// (U+00A0) or narrow no-break (U+202F) space rather than a plain one and is written here as an
// escape; input parsing ignores any character that is neither a digit nor a separator, so a
// respondent may type a plain space instead. ar and fa are curated with ASCII separators rather
// than CLDR U+066B/U+066C, which belong with the Arabic-Indic digits this mask does not render;
// ht has no CLDR data and follows the French convention its date pattern already uses. The mask
// always groups by three, so en-in, hi and tel carry their separator characters but not their
// 12,34,567 grouping.
// Currency patterns carry placement and spacing only - the symbol itself depends on the
// currency, not on the locale, so the author supplies it. They are probed with a symbolic
// currency: CLDR inserts a space between an alphabetic symbol (USD, RM, Ft) and the number
// that is not part of the locale's pattern, and this table cannot know which kind of symbol
// an author will write. The literal spaces are no-break (U+00A0) and are written as escapes.
// ar, fa and he are curated without the U+200E/U+200F marks ICU emits around the number: the
// pattern reaches an input value, where control characters are not allowed, and the direction
// is handled by the RTL styles instead. A minus sign ICU writes as U+2212 (et, eu, fi, hr, lt,
// no, sl, sv) is curated as the ASCII - the mask parses. ht again follows the French
// convention.
export const localeData: { [locale: string]: ILocaleData } = {
  "ar": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "#\u00A0\u00A4" },
  "bg": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "ca": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "cs": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "cy": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "da": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "de": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "el": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "en": { datePattern: "mm/dd/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "en-au": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "en-ca": { datePattern: "yyyy-mm-dd", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "en-gb": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "en-ie": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "en-in": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "en-nz": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "en-za": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "\u00A4#" },
  "es": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "et": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "eu": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "fa": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "fi": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "fil": { datePattern: "mm/dd/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "fr": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u202F", currencyPattern: "#\u00A0\u00A4" },
  "fr-ca": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "fr-ch": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u202F", currencyPattern: "#\u00A0\u00A4" },
  "he": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "#\u00A0\u00A4" },
  "hi": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "hr": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "ht": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "hu": { datePattern: "yyyy. mm. dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "id": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "\u00A4#" },
  "is": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "it": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "ja": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "ka": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "kk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "ko": { datePattern: "yyyy. mm. dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "lt": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "lv": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "mk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "mm": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "#\u00A0\u00A4" },
  "ms": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "nl": { datePattern: "dd-mm-yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "\u00A4\u00A0#;\u00A4\u00A0-#" },
  "nl-be": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "\u00A4\u00A0#;\u00A4\u00A0-#" },
  "no": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "pl": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "pt": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "pt-br": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "\u00A4\u00A0#" },
  "ro": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "ru": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "sk": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "sl": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "sr": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "sv": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "sw": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4\u00A0#" },
  "tel": { datePattern: "dd-mm-yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "tg": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "th": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "tr": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "\u00A4#" },
  "uk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4" },
  "ur": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "vi": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4" },
  "zh": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "zh-cn": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" },
  "zh-tw": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#" }
};

// The locales that have curated data, regional entries (en-gb, fr-ca) included. This is the
// choice list of a region locale editor: a locale outside it still resolves through its language
// subtag, but only these have a curated entry of their own.
export function getLocaleDataLocales(): Array<string> {
  return Object.keys(localeData);
}

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
