import { getLocaleString } from "../surveyStrings";

// The label a condition editor shows for one operator, e.g. "equal" -> "Equals". Written out as
// literal keys (not "conditionOperator" + operator, capitalized) so survey-utils check-strings -
// which counts a string literal in the scanned sources as usage - can see all 13 keys are used;
// the same reason src/linter/value-types.ts:20-25 keeps its locale keys as a literal table instead
// of building them. One entry per name getConditionOperatorNames() returns (conditionOperators.ts).
const OPERATOR_TITLE_KEYS: { [operator: string]: string } = {
  empty: "conditionOperatorEmpty",
  notempty: "conditionOperatorNotempty",
  equal: "conditionOperatorEqual",
  notequal: "conditionOperatorNotequal",
  contains: "conditionOperatorContains",
  notcontains: "conditionOperatorNotcontains",
  anyof: "conditionOperatorAnyof",
  noneof: "conditionOperatorNoneof",
  allof: "conditionOperatorAllof",
  greater: "conditionOperatorGreater",
  less: "conditionOperatorLess",
  greaterorequal: "conditionOperatorGreaterorequal",
  lessorequal: "conditionOperatorLessorequal"
};

// A locale that has not translated a key falls back to English, the way getLocaleString always
// does. An operator the table does not know (a future operator, a typo) has no key to look up, so
// the operator name itself is the best title there is.
export function getConditionOperatorTitle(operator: string, locale?: string): string {
  const key = OPERATOR_TITLE_KEYS[operator];
  return !!key ? getLocaleString(key, locale) : operator;
}
