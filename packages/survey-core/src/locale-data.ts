import { surveyLocalization } from "./surveyStrings";

// Locale metadata that configures behavior or formats. Values displayed to the respondent as
// text (e.g. mask placeholder symbols) belong in the localization dictionaries instead; the
// entries here are configuration and are never rendered as text or translated.
// Date patterns are canonical SurveyJS mask grammar: dd, mm, yyyy plus literal separators.
// Currency patterns use single-character symbols like every other mask pattern: # is the
// formatted number (exactly one), @ is the currency symbol (at most one) and - is where the minus
// sign of a negative amount goes (at most one, optional; without it the sign goes at the very
// beginning of the text). A positive amount renders the - as nothing, so one pattern describes
// both forms. Everything else in a pattern is literal text. The symbol the pattern places is the
// curated currencySymbol unless the mask or the regional format carry one of their own.
export interface ILocaleData {
  datePattern?: string;
  timePattern?: string;
  decimalSeparator?: string;
  thousandsSeparator?: string;
  currencySymbol?: string;
  currencyPattern?: string;
  // Date.getDay() numbering: 0 Sunday .. 6 Saturday. A region convention, like the currency.
  firstDayOfWeek?: number;
}

// Keyed by BCP-47 locale tags in their canonical casing: the language lowercase, the region
// uppercase (en-GB, pt-BR). Lookups are case-insensitive, so a survey locale written the SurveyJS
// way (pt-br) finds the same entry. Regional entries (en-GB, fr-CA) exist on their own - they do
// not need a localization dictionary. Extend or correct by assignment, preferably with the
// canonical spelling:
// localeData["en-PH"] = { datePattern: "mm/dd/yyyy" };
// A key added in another casing next to an existing one (localeData["en-nz"] while en-NZ exists)
// is a separate key: a lookup takes the key whose casing matches exactly and otherwise the first
// case-insensitive match in key order, and getLocaleDataLocales() lists the locale once, under
// the key that comes first.
//
// timePattern is 12-hour ("hh:MM TT") only where the locale writes the marker as the Latin
// AM/PM that the mask accepts as input. Locales that are 12-hour in CLDR but write the marker
// in another script (ar, el, hi, ur), with letters the mask cannot tell apart (ms: PG/PTG),
// or before the hour (ko, zh, zh-CN, zh-TW - the mask cannot parse a leading marker) are
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
// always groups by three, so en-IN, hi and tel carry their separator characters but not their
// 12,34,567 grouping.
// Currency patterns carry placement and spacing. They are probed with a symbolic currency:
// CLDR inserts a space between an alphabetic symbol (USD, RM, Ft) and the number that is not
// part of the locale's pattern, and this table cannot know which kind of symbol an author will
// write. CLDR writes the literal spaces as no-break (U+00A0); they are curated as plain spaces,
// because the affix is rendered inside an input, which never wraps, and a saved masked value
// should not carry a space no one can see or search for. Only nl and nl-BE place the sign
// themselves (after the symbol); every other locale puts it at the very beginning.
// A currency is a property of a country, not of a language, so currencySymbol is the symbol of
// the currency of the locale's CLDR likely region (ja -> JP -> yen, pt-BR -> BR -> real),
// written the way that locale writes it. It is a default an author overrides per mask - a
// survey in german may well ask for dollars - and a mask that is told "" renders no symbol at
// all. Regional entries carry their own (en-GB -> pound, en-IN -> rupee) instead of inheriting
// the language's, which is why every entry in the table defines the field.
// ar, fa and he are curated without the U+200E/U+200F marks ICU emits around the number: the
// pattern reaches an input value, where control characters are not allowed, and the direction
// is handled by the RTL styles instead. A minus sign ICU writes as U+2212 (et, eu, fi, hr, lt,
// no, sl, sv) is rendered as the ASCII - the mask parses. ht again follows the French
// convention.
export const localeData: { [locale: string]: ILocaleData } = {
  "ar": { firstDayOfWeek: 6, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u062C.\u0645.", currencyPattern: "# @" },
  "bg": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u043B\u0432.", currencyPattern: "# @" },
  "ca": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "cs": { firstDayOfWeek: 1, datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "K\u010D", currencyPattern: "# @" },
  "cy": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u00A3", currencyPattern: "@#" },
  "da": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "kr.", currencyPattern: "# @" },
  "de": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "el": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "en": { firstDayOfWeek: 0, datePattern: "mm/dd/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "$", currencyPattern: "@#" },
  "en-AU": { firstDayOfWeek: 0, datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "$", currencyPattern: "@#" },
  "en-CA": { firstDayOfWeek: 0, datePattern: "yyyy-mm-dd", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "$", currencyPattern: "@#" },
  "en-GB": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u00A3", currencyPattern: "@#" },
  "en-IE": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u20AC", currencyPattern: "@#" },
  "en-IN": { firstDayOfWeek: 0, datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u20B9", currencyPattern: "@#" },
  "en-NZ": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "$", currencyPattern: "@#" },
  "en-ZA": { firstDayOfWeek: 0, datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "R", currencyPattern: "@#" },
  "es": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "et": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "eu": { firstDayOfWeek: 1, datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "fa": { firstDayOfWeek: 6, datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u0631\u06CC\u0627\u0644", currencyPattern: "@#" },
  "fi": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "fil": { firstDayOfWeek: 0, datePattern: "mm/dd/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u20B1", currencyPattern: "@#" },
  "fr": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u202F", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "fr-CA": { firstDayOfWeek: 0, datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "$", currencyPattern: "# @" },
  "fr-CH": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u202F", currencySymbol: "CHF", currencyPattern: "# @" },
  "he": { firstDayOfWeek: 0, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u20AA", currencyPattern: "# @" },
  "hi": { firstDayOfWeek: 0, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u20B9", currencyPattern: "@#" },
  "hr": { firstDayOfWeek: 1, datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "ht": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "G", currencyPattern: "# @" },
  "hu": { firstDayOfWeek: 1, datePattern: "yyyy. mm. dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "Ft", currencyPattern: "# @" },
  "id": { firstDayOfWeek: 0, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "Rp", currencyPattern: "@#" },
  "is": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "kr.", currencyPattern: "# @" },
  "it": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "ja": { firstDayOfWeek: 0, datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u00A5", currencyPattern: "@#" },
  "ka": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u20BE", currencyPattern: "# @" },
  "kk": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u20B8", currencyPattern: "# @" },
  "ko": { firstDayOfWeek: 0, datePattern: "yyyy. mm. dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u20A9", currencyPattern: "@#" },
  "lt": { firstDayOfWeek: 1, datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "lv": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "mk": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u0434\u0435\u043D", currencyPattern: "# @" },
  "mm": { firstDayOfWeek: 0, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "K", currencyPattern: "# @" },
  "ms": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "RM", currencyPattern: "@#" },
  "nl": { firstDayOfWeek: 1, datePattern: "dd-mm-yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "@ -#" },
  "nl-BE": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "@ -#" },
  "no": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "kr", currencyPattern: "# @" },
  "pl": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "z\u0142", currencyPattern: "# @" },
  "pt": { firstDayOfWeek: 0, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "pt-BR": { firstDayOfWeek: 0, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "R$", currencyPattern: "@ #" },
  "ro": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "RON", currencyPattern: "# @" },
  "ru": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u20BD", currencyPattern: "# @" },
  "sk": { firstDayOfWeek: 1, datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "sl": { firstDayOfWeek: 1, datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AC", currencyPattern: "# @" },
  "sr": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "RSD", currencyPattern: "# @" },
  "sv": { firstDayOfWeek: 1, datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "kr", currencyPattern: "# @" },
  "sw": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "TSh", currencyPattern: "@ #" },
  "tel": { firstDayOfWeek: 0, datePattern: "dd-mm-yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u20B9", currencyPattern: "@#" },
  "tg": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u0441\u043E\u043C", currencyPattern: "# @" },
  "th": { firstDayOfWeek: 0, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u0E3F", currencyPattern: "@#" },
  "tr": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20BA", currencyPattern: "@#" },
  "uk": { firstDayOfWeek: 1, datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0", currencySymbol: "\u20B4", currencyPattern: "# @" },
  "ur": { firstDayOfWeek: 0, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "Rs", currencyPattern: "@#" },
  "vi": { firstDayOfWeek: 1, datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: ".", currencySymbol: "\u20AB", currencyPattern: "# @" },
  "zh": { firstDayOfWeek: 0, datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u00A5", currencyPattern: "@#" },
  "zh-CN": { firstDayOfWeek: 0, datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "\u00A5", currencyPattern: "@#" },
  "zh-TW": { firstDayOfWeek: 0, datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: ",", currencySymbol: "NT$", currencyPattern: "@#" }
};

// The locales that have curated data, regional entries (en-GB, fr-CA) included, as the keys are
// written. This is the choice list of a region locale editor: a locale outside it still resolves
// through its language subtag, but only these have a curated entry of their own. Keys that differ
// only in casing are listed once, under the one that comes first.
export function getLocaleDataLocales(): Array<string> {
  const res: Array<string> = [];
  const listed: Array<string> = [];
  Object.keys(localeData).forEach(key => {
    const name = key.toLowerCase();
    if (listed.indexOf(name) > -1) return;
    listed.push(name);
    res.push(key);
  });
  return res;
}

// The table key for a locale, matched case-insensitively: the key written exactly like the locale
// when there is one, otherwise the first key in key order that differs only in casing. A scan
// rather than a cached index: the table may be extended at runtime, and the masks cache the
// values they resolve per locale, so this runs once per locale change, not per keystroke.
export function findLocaleDataKey(locale: string): string | undefined {
  const name = surveyLocalization.getCorrectLocaleName(locale || "");
  if (!name) return undefined;
  if (Object.prototype.hasOwnProperty.call(localeData, name)) return name;
  const lowerName = name.toLowerCase();
  const keys = Object.keys(localeData);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].toLowerCase() === lowerName) return keys[i];
  }
  return undefined;
}

// The canonical BCP-47 casing of a locale tag, by syntax alone: the language lowercase, a
// two-letter region uppercase, a four-letter script in title case, everything else - a numeric
// region, variants, extensions and whatever follows a singleton - lowercase. No table entry is
// needed: en-US has none (en is the US form) and is still written en-US.
export function canonicalizeLocale(locale: string): string {
  if (!locale) return locale;
  let isExtension = false;
  return locale.split("-").map((part, index) => {
    if (index === 0 || isExtension) return part.toLowerCase();
    if (part.length === 1) {
      isExtension = true;
      return part.toLowerCase();
    }
    if (part.length === 2) return part.toUpperCase();
    if (part.length === 4 && /^[a-z]+$/i.test(part)) return part[0].toUpperCase() + part.substring(1).toLowerCase();
    return part.toLowerCase();
  }).join("-");
}

// Resolves one field through the chain: exact locale -> its language subtag -> "en", each matched
// case-insensitively. The walk is per field, so a regional entry that defines only some fields
// never shadows the rest, and an entry the validator rejects falls through the same way. The "en"
// entry defines every shipped field, so a lookup with a validator that accepts it cannot come back
// empty.
export function getLocaleDataValue(locale: string, field: keyof ILocaleData, isValid?: (value: any) => boolean): any {
  const name = surveyLocalization.getCorrectLocaleName(locale || "");
  const index = name.indexOf("-");
  const chain = [name, index > 0 ? name.substring(0, index).toLowerCase() : "", "en"];
  for (let i = 0; i < chain.length; i++) {
    const key = findLocaleDataKey(chain[i]);
    const res = key !== undefined ? localeData[key][field] : undefined;
    if (res !== undefined && (!isValid || isValid(res))) return res;
  }
  return undefined;
}
