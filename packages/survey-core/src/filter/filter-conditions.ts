import { getLocaleString } from "../surveyStrings";

// The label a condition editor shows for one operator, e.g. "equal" -> "Equals". Keyed
// "conditionOperatorXxx" in english.ts, one entry per name getConditionOperatorNames() returns
// (conditionOperators.ts); a locale that has not translated a key falls back to English, the way
// getLocaleString always does.
export function getConditionOperatorTitle(operator: string, locale?: string): string {
  const key = "conditionOperator" + operator.charAt(0).toUpperCase() + operator.slice(1);
  return getLocaleString(key, locale);
}
