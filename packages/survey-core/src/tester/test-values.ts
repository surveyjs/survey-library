import { Helpers } from "../helpers";

// How the tester compares a value a case wrote with a value the survey holds. It lives on its own
// because more than one place has to compare exactly the same way: a check that reads a question, and
// the arguments of a stubbed function that decide which answer a case gets. A second implementation
// of "the same" would eventually stop being the same.

// Helpers.isTwoValueEquals converts "5" into 5 because the expression engine does, and visibleIf has
// to keep working that way. A case must not: "what is stored" has one answer, and a case that passes
// with the wrong type hides the bug it was written to find. Empty values keep the engine semantics,
// so value: null still matches an unanswered question and value: [] an unanswered checkbox. Only the
// top level is compared: a payload is written by hand, and a nested type-only difference has never
// been the confusing case.
export function isTestTypeMismatch(actual: any, expected: any): boolean {
  if (Helpers.isValueEmpty(actual) || Helpers.isValueEmpty(expected)) return false;
  if (Array.isArray(actual) !== Array.isArray(expected)) return true;
  return typeof actual !== typeof expected;
}

export function isEqualByEngine(actual: any, expected: any, ignoreOrder: boolean): boolean {
  return Helpers.isTwoValueEquals(actual, expected, ignoreOrder, true, false);
}

export function isSameTestValue(actual: any, expected: any, ignoreOrder?: boolean): boolean {
  if (isTestTypeMismatch(actual, expected)) return false;
  return isEqualByEngine(actual, expected, ignoreOrder === true);
}
