import { Serializer } from "../jsonobject";
import { settings } from "../settings";

/* Which condition operators a question type takes, read from settings.logic.operators on every call,
   so a change made at runtime applies at once. Creator's condition editor and the Filter Control both
   ask here. Moved from survey-creator-core (ConditionEditor.isOperatorEnabled / isClassContains). */
export function isQuestionTypeInList(questionType: string, types: Array<string>): boolean {
  if (!questionType) return true;
  if (!types || types.length == 0) return true;
  const contains: Array<string> = [];
  const notContains: Array<string> = [];
  for (let i = 0; i < types.length; i++) {
    const name = types[i];
    if (name[0] == "!") {
      notContains.push(name.substring(1));
    } else {
      contains.push(name);
    }
  }
  return isQuestionClassContains(questionType, contains, notContains);
}
// Walks up the class hierarchy: the nearest class named in either list decides.
export function isQuestionClassContains(questionType: string, contains: Array<string>, notContains: Array<string>): boolean {
  let classInfo = Serializer.findClass(questionType);
  while(!!classInfo) {
    if (contains.indexOf(classInfo.name) > -1) return true;
    if (notContains.indexOf(classInfo.name) > -1) return false;
    classInfo = !!classInfo.parentName ? Serializer.findClass(classInfo.parentName) : null;
  }
  // No class in the hierarchy is named: a list of refusals only takes whatever it does not refuse.
  return contains.length == 0;
}
export function isConditionOperatorEnabled(questionType: string, operator: string): boolean {
  return isQuestionTypeInList(questionType, settings.logic.operators[operator]);
}
// The key order of the table is the order the editors list the operators in.
export function getConditionOperatorNames(): Array<string> {
  return Object.keys(settings.logic.operators);
}
// The operator a new condition on a question of this type starts with.
export function getConditionDefaultOperator(questionType?: string): string {
  const defaultOperators = settings.logic.defaultOperators;
  return !!questionType && !!defaultOperators[questionType] ? defaultOperators[questionType] : defaultOperators.default;
}
