import { surveyLocalization } from "./surveyStrings";

// Locale metadata that configures behavior or formats. Values displayed to the respondent as
// text (e.g. mask placeholder symbols) belong in the localization dictionaries instead; the
// entries here are configuration and are never rendered as text or translated.
// Date patterns are canonical SurveyJS mask grammar: dd, mm, yyyy plus literal separators.
// Currency patterns are a small CLDR inspired grammar: U+00A4 is the currency symbol, # is the
// formatted number, - is the minus sign, and an optional ; separates the positive subpattern
// from the negative one. Without a ; the negative form is the positive one with a - in front.
// Everything else in a pattern is literal text. The symbol the pattern places is the curated
// currencySymbol unless the mask or the region options carry one of their own.
export interface ILocaleData {
  datePattern?: string;
  timePattern?: string;
  decimalSeparator?: string;
  thousandsSeparator?: string;
  currencyPattern?: string;
  currencySymbol?: string;
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
// Currency patterns carry placement and spacing. They are probed with a symbolic currency:
// CLDR inserts a space between an alphabetic symbol (USD, RM, Ft) and the number that is not
// part of the locale's pattern, and this table cannot know which kind of symbol an author will
// write. The literal spaces are no-break (U+00A0) and are written as escapes.
// A currency is a property of a country, not of a language, so currencySymbol is the symbol of
// the currency of the locale's CLDR likely region (ja -> JP -> yen, pt-br -> BR -> real),
// written the way that locale writes it. It is a default an author overrides per mask - a
// survey in german may well ask for dollars - and a mask that is told "" renders no symbol at
// all. Regional entries carry their own (en-gb -> pound, en-in -> rupee) instead of inheriting
// the language's, which is why every entry in the table defines the field.
// ar, fa and he are curated without the U+200E/U+200F marks ICU emits around the number: the
// pattern reaches an input value, where control characters are not allowed, and the direction
// is handled by the RTL styles instead. A minus sign ICU writes as U+2212 (et, eu, fi, hr, lt,
// no, sl, sv) is curated as the ASCII - the mask parses. ht again follows the French
// convention.
export const localeData: { [locale: string]: ILocaleData } = {
  "ar": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u062C.\u0645." },
  "bg": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u043B\u0432." },
  "ca": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "cs": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "K\u010D" },
  "cy": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u00A3" },
  "da": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "kr." },
  "de": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "el": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "en": { datePattern: "mm/dd/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "$" },
  "en-au": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "$" },
  "en-ca": { datePattern: "yyyy-mm-dd", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "$" },
  "en-gb": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u00A3" },
  "en-ie": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u20AC" },
  "en-in": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u20B9" },
  "en-nz": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "$" },
  "en-za": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "\u00A4#", currencySymbol: "R" },
  "es": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "et": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "eu": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "fa": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u0631\u06CC\u0627\u0644" },
  "fi": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "fil": { datePattern: "mm/dd/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u20B1" },
  "fr": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u202F", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "fr-ca": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "$" },
  "fr-ch": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u202F", currencyPattern: "#\u00A0\u00A4", currencySymbol: "CHF" },
  "he": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AA" },
  "hi": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u20B9" },
  "hr": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "ht": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "G" },
  "hu": { datePattern: "yyyy. mm. dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "Ft" },
  "id": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "\u00A4#", currencySymbol: "Rp" },
  "is": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "kr." },
  "it": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "ja": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u00A5" },
  "ka": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20BE" },
  "kk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20B8" },
  "ko": { datePattern: "yyyy. mm. dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u20A9" },
  "lt": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "lv": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "mk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u0434\u0435\u043D" },
  "mm": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "#\u00A0\u00A4", currencySymbol: "K" },
  "ms": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "RM" },
  "nl": { datePattern: "dd-mm-yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "\u00A4\u00A0#;\u00A4\u00A0-#", currencySymbol: "\u20AC" },
  "nl-be": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "\u00A4\u00A0#;\u00A4\u00A0-#", currencySymbol: "\u20AC" },
  "no": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "kr" },
  "pl": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "z\u0142" },
  "pt": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "pt-br": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "\u00A4\u00A0#", currencySymbol: "R$" },
  "ro": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "RON" },
  "ru": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20BD" },
  "sk": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "sl": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AC" },
  "sr": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "RSD" },
  "sv": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "kr" },
  "sw": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4\u00A0#", currencySymbol: "TSh" },
  "tel": { datePattern: "dd-mm-yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u20B9" },
  "tg": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u0441\u043E\u043C" },
  "th": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u0E3F" },
  "tr": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "\u00A4#", currencySymbol: "\u20BA" },
  "uk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20B4" },
  "ur": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "Rs" },
  "vi": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencyPattern: "#\u00A0\u00A4", currencySymbol: "\u20AB" },
  "zh": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u00A5" },
  "zh-cn": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "\u00A5" },
  "zh-tw": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencyPattern: "\u00A4#", currencySymbol: "NT$" }
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
