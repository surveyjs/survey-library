import type { SurveyModel } from "../survey";
import { surveyLocalization } from "../surveyStrings";

// The variables a survey answers by itself. They are declared nowhere in the survey
// JSON and resolve before any question, calculated value or variable of the same name.
// This table is the single source of truth for the list: tools read the names from it
// (getBuiltInVariableNames) instead of keeping their own copy.
// A Map, not an object literal: the key is an arbitrary name taken from an expression
// and must not hit Object.prototype ("constructor", ...).
// It lives in a leaf module, so that the expression code (ValueGetter.isAnyKeyChanged) can
// read the names without importing survey.ts. The survey is only a type here.
const builtInVariables = new Map<string, (survey: SurveyModel) => any>([
  ["pageno", (survey: SurveyModel): any => {
    const page = survey.currentPage;
    return page != null ? survey.visiblePages.indexOf(page) + 1 : 0;
  }],
  ["pagecount", (survey: SurveyModel): any => survey.visiblePageCount],
  ["questioncount", (survey: SurveyModel): any => survey.getQuizQuestionCount()],
  ["correctedanswers", (survey: SurveyModel): any => survey.getCorrectedAnswerCount()],
  ["correctanswers", (survey: SurveyModel): any => survey.getCorrectedAnswerCount()],
  ["correctedanswercount", (survey: SurveyModel): any => survey.getCorrectedAnswerCount()],
  ["incorrectedanswers", (survey: SurveyModel): any => survey.getInCorrectedAnswerCount()],
  ["incorrectanswers", (survey: SurveyModel): any => survey.getInCorrectedAnswerCount()],
  ["incorrectedanswercount", (survey: SurveyModel): any => survey.getInCorrectedAnswerCount()],
  ["locale", (survey: SurveyModel): any => survey.locale || surveyLocalization.defaultLocale],
]);

export function getBuiltInVariableNames(): Array<string> {
  return Array.from(builtInVariables.keys());
}
export function isBuiltInVariableName(name: string): boolean {
  return !!name && builtInVariables.has(name.toLocaleLowerCase());
}
export function getBuiltInVariableValue(survey: SurveyModel, name: string): any {
  const func = builtInVariables.get(name.toLocaleLowerCase());
  return !!func ? func(survey) : undefined;
}
