import { surveyLocalization } from "./surveyStrings";

// Locale metadata that configures behavior or formats. Values displayed to the respondent as
// text (e.g. mask placeholder symbols) belong in the localization dictionaries instead; the
// entries here are configuration and are never rendered as text or translated.
// Date patterns are canonical SurveyJS mask grammar: dd, mm, yyyy plus literal separators.
export interface ILocaleData {
  datePattern?: string;
  timePattern?: string;
  decimalSeparator?: string;
  thousandsSeparator?: string;
  // curated in tier 02
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
export const localeData: { [locale: string]: ILocaleData } = {
  "ar": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "bg": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "ca": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "cs": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "cy": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "da": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "de": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "el": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "en": { datePattern: "mm/dd/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: "," },
  "en-au": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: "," },
  "en-ca": { datePattern: "yyyy-mm-dd", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: "," },
  "en-gb": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "en-ie": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "en-in": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: "," },
  "en-nz": { datePattern: "dd/mm/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: "," },
  "en-za": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "es": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "et": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "eu": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "fa": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "fi": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "fil": { datePattern: "mm/dd/yyyy", timePattern: "hh:MM TT", decimalSeparator: ".", thousandsSeparator: "," },
  "fr": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u202F" },
  "fr-ca": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "fr-ch": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u202F" },
  "he": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "hi": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "hr": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "ht": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "hu": { datePattern: "yyyy. mm. dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "id": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "is": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "it": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "ja": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "ka": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "kk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "ko": { datePattern: "yyyy. mm. dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "lt": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "lv": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "mk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "mm": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "ms": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "nl": { datePattern: "dd-mm-yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "nl-be": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "no": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "pl": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "pt": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "pt-br": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "ro": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "ru": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "sk": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "sl": { datePattern: "dd. mm. yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "sr": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "sv": { datePattern: "yyyy-mm-dd", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "sw": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "tel": { datePattern: "dd-mm-yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "tg": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "th": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "tr": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "uk": { datePattern: "dd.mm.yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "\u00A0" },
  "ur": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "vi": { datePattern: "dd/mm/yyyy", timePattern: "HH:MM", decimalSeparator: ",", thousandsSeparator: "." },
  "zh": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "zh-cn": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," },
  "zh-tw": { datePattern: "yyyy/mm/dd", timePattern: "HH:MM", decimalSeparator: ".", thousandsSeparator: "," }
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
