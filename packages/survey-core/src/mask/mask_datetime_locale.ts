import { surveyLocalization } from "../surveyStrings";

// SurveyJS locale codes that are not valid BCP-47 language tags. Intl.DateTimeFormat does not
// throw on such a code - it silently resolves to the runtime default locale - so they have to be
// mapped before the locale data is requested.
const surveyLocaleToBCP47: { [key: string]: string } = {
  mm: "my",
  tel: "te"
};

// Characters that getDateTimeLexems() reads as semantic tokens. A generated literal that contains
// one of them cannot be rendered as a separator because the canonical grammar has no escape
// syntax, so such a locale is treated as unresolvable.
const canonicalTokens = "dmyhHMstT";
// Directionality marks and isolates that RTL locales add around the numeric parts:
// LRM, RLM, ALM and the four directional isolate controls.
const directionalityMarkCodes = [0x200E, 0x200F, 0x061C, 0x2066, 0x2067, 0x2068, 0x2069];
// The day and the month of the reference date differ from each other and from a two-digit year.
const referenceDate = new Date(Date.UTC(2000, 11, 25));

export function getBCP47LocaleName(locale: string): string {
  const loc = surveyLocalization.getCorrectLocaleName(locale || "");
  if (!loc) return "";
  return surveyLocaleToBCP47[loc] || loc;
}

function getPrimaryLanguage(locale: string): string {
  const index = locale.indexOf("-");
  return (index < 1 ? locale : locale.substring(0, index)).toLowerCase();
}

function createDateFormatter(bcp47Locale: string): any {
  if (typeof Intl === "undefined" || !Intl.DateTimeFormat) return undefined;
  try {
    const formatter = new Intl.DateTimeFormat(bcp47Locale, <any>{
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
      calendar: "gregory",
      numberingSystem: "latn"
    });
    const resolved: any = formatter.resolvedOptions();
    // Intl falls back to the runtime default locale when the requested locale data is missing
    // (a non-BCP-47 code, a locale the ICU build does not ship). Such a result would make the
    // generated pattern depend on the machine instead of on survey.locale.
    if (getPrimaryLanguage(resolved.locale || "") !== getPrimaryLanguage(bcp47Locale)) return undefined;
    if (!!resolved.calendar && resolved.calendar !== "gregory") return undefined;
    if (!!resolved.numberingSystem && resolved.numberingSystem !== "latn") return undefined;
    return formatter;
  } catch(e) {
    return undefined;
  }
}

function removeDirectionalityMarks(str: string): string {
  let res = "";
  for (let i = 0; i < str.length; i++) {
    if (directionalityMarkCodes.indexOf(str.charCodeAt(i)) === -1) res += str[i];
  }
  return res;
}

function getLiteralSeparator(value: string): string {
  const res = removeDirectionalityMarks(value || "");
  for (let i = 0; i < res.length; i++) {
    if (canonicalTokens.indexOf(res[i]) !== -1) return undefined;
  }
  return res;
}

const datePartTokens: { [key: string]: string } = {
  year: "yyyy",
  month: "mm",
  day: "dd"
};

function hasDatePartAfter(parts: Array<any>, index: number): boolean {
  for (let i = index + 1; i < parts.length; i++) {
    if (parts[i].type !== "literal") return true;
  }
  return false;
}

// Returns a canonical SurveyJS date pattern (field order and separators) for the passed locale, or
// undefined when the locale data cannot be resolved. The result never depends on the runtime
// default locale, so a server and a browser generate the same pattern for the same survey JSON.
export function getLocaleDatePattern(locale: string): string {
  const bcp47Locale = getBCP47LocaleName(locale);
  if (!bcp47Locale) return undefined;
  const formatter = createDateFormatter(bcp47Locale);
  if (!formatter) return undefined;
  let parts: Array<any>;
  try {
    parts = formatter.formatToParts(referenceDate);
  } catch(e) {
    return undefined;
  }
  let res = "";
  let lastDatePartEnd = 0;
  let prevIsDatePart = false;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.type === "literal") {
      const separator = getLiteralSeparator(part.value);
      if (separator === undefined) return undefined;
      // an empty literal between two date parts would merge them into a single input part
      if (!separator && prevIsDatePart && hasDatePartAfter(parts, i)) return undefined;
      res += separator;
      prevIsDatePart = false;
    } else {
      const token = datePartTokens[part.type];
      // an era, a weekday or any other part cannot be expressed by the canonical grammar
      if (token === undefined) return undefined;
      res += token;
      lastDatePartEnd = res.length;
      prevIsDatePart = true;
    }
  }
  // a trailing literal ("yyyy. mm. dd.") is never rendered by the mask, so it is not generated
  return lastDatePartEnd > 0 ? res.substring(0, lastDatePartEnd) : undefined;
}
