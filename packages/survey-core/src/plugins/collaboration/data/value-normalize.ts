import { Question, QuestionMatrixDynamicModel, SurveyModel } from "survey-core";

// Pads a matrixdynamic value with empty row objects up to the question's rowCount.
//
// When the last non-empty cell of a matrixdynamic is cleared, survey-core collapses
// the value to [] while the sender's rows stay on screen (isRowChanging guards its own
// rowCount). Broadcasting the raw [] makes every OTHER client drop to rowCount = 0 and
// their rows vanish. Padding to the sender's rowCount keeps row counts in step while
// still clearing the cells.
//
// Genuine row removal is unaffected: survey-core decrements rowCount before writing the
// shortened value, so at emit time no padding is needed.
export function normalizeOutgoingValue(survey: SurveyModel, name: string, value: any): any {
  const question = survey.getQuestionByValueName(name);
  if (!question || question.getType() !== "matrixdynamic") return value;
  const rowCount = (question as QuestionMatrixDynamicModel).rowCount;
  const rows = Array.isArray(value) ? value.slice() : [];
  while(rows.length < rowCount) rows.push({});
  return rows;
}

// Reconciles a matrixdynamic's rowCount with a freshly applied remote value.
//
// survey.setValue is a no-op when the incoming value is "equal" to the current one, and
// survey-core treats [] and undefined as equal - so when the sender removes the last
// (all-empty) row, receivers would silently keep theirs. Setting rowCount explicitly
// covers that gap; when setValue already did the job the counts match and this does
// nothing.
export function syncMatrixRowCount(survey: SurveyModel, name: string, value: any): void {
  if (!Array.isArray(value)) return;
  const question = survey.getQuestionByValueName(name);
  if (!question || question.getType() !== "matrixdynamic") return;
  const matrix = question as QuestionMatrixDynamicModel;
  if (matrix.rowCount !== value.length) matrix.rowCount = value.length;
}

export function getQuestionValueName(question: Question): string {
  return question.getValueName();
}
