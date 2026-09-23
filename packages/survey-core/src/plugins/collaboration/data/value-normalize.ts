import { Helpers, Question, QuestionMatrixDynamicModel, SurveyModel } from "survey-core";

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
//
// A matrixdynamic nested in a composite needs the same treatment one level in - see
// padNestedRows.
export function normalizeOutgoingValue(survey: SurveyModel, name: string, value: any): any {
  const question = survey.getQuestionByValueName(name);
  if (!question) return value;
  if (question.getType() === "matrixdynamic") return padRows(question as QuestionMatrixDynamicModel, value);
  return padNestedRows(question, value);
}

function padRows(matrix: QuestionMatrixDynamicModel, value: any): Array<any> {
  const rows = Array.isArray(value) ? value.slice() : [];
  while(rows.length < matrix.rowCount) rows.push({});
  return rows;
}

// The same padding for a matrixdynamic nested in a COMPOSITE question, whose whole value
// is one object under the composite's own name. Without it the collapse above sinks the
// peers' rows exactly as it did on the top level - only invisibly, because neither
// getQuestionByValueName nor survey.data knows the nested question at all.
//
// The keys of a composite's value ARE the value names of the questions on its content
// panel (PanelModelBase.collectValues writes them flat, even out of inner panels), so the
// walk needs to know nothing about the schema. A key ABSENT from the object is padded too,
// not skipped: a collapsed matrix drops out of the composite's value entirely, and that is
// exactly the case that would empty the peers. It mirrors the top level, where the same
// pad runs against a raw [] or undefined.
//
// Left alone: a value that is not a plain object. A dynamic panel or a matrix flattens its
// children across panels and rows without an index, so no key can be attributed to them.
// So is a composite that reshapes its own value through valueToQuestion/valueFromQuestion.
function padNestedRows(question: Question, value: any): any {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  let res = value;
  question.getNestedQuestions(false, false, false).forEach((child) => {
    if (child.getType() !== "matrixdynamic") return;
    const key = child.getValueName();
    const rows = padRows(child as QuestionMatrixDynamicModel, res[key]);
    if (rows.length === 0 || Helpers.isTwoValueEquals(rows, res[key])) return;
    if (res === value) res = { ...value };
    res[key] = rows;
  });
  return res;
}

// The outgoing value of the top-level question that OWNS a nested matrixdynamic whose row
// count just changed, with that matrix padded to its new row count - creating the key when
// the matrix had no value at all, which is the whole point: an empty row writes nothing.
//
// Returns the value untouched when the path cannot be attributed - a matrix inside a
// dynamic panel or another matrix, where the value is an array indexed by position.
export function withNestedMatrixRows(value: any, matrix: QuestionMatrixDynamicModel): any {
  const path: Array<string> = [];
  let current: Question = matrix;
  while(!!current.parentQuestion) {
    path.unshift(current.getValueName());
    current = current.parentQuestion;
  }
  if (path.length === 0) return value;
  return setNestedRows(value, path, matrix);
}

function setNestedRows(value: any, path: Array<string>, matrix: QuestionMatrixDynamicModel): any {
  if (Array.isArray(value)) return value;
  const res = !!value && typeof value === "object" ? { ...value } : {};
  const key = path[0];
  if (path.length === 1) {
    res[key] = padRows(matrix, res[key]);
    return res;
  }
  const inner = setNestedRows(res[key], path.slice(1), matrix);
  if (inner === res[key]) return value;
  res[key] = inner;
  return res;
}

// Reconciles a matrixdynamic's rowCount with a freshly applied remote value.
//
// survey.setValue is a no-op when the incoming value is "equal" to the current one, and
// survey-core treats [] and undefined as equal - so when the sender removes the last
// (all-empty) row, receivers would silently keep theirs. Setting rowCount explicitly
// covers that gap; when setValue already did the job the counts match and this does
// nothing.
export function syncMatrixRowCount(survey: SurveyModel, name: string, value: any): void {
  const question = survey.getQuestionByValueName(name);
  if (!question) return;
  if (question.getType() === "matrixdynamic") {
    setRowCount(question as QuestionMatrixDynamicModel, value);
    return;
  }
  // A composite: same gap, one level in. Adding a row does reconcile itself - the nested
  // matrix reads the longer array in onBeforeValueChanged - but REMOVING one does not:
  // the shorter array is "equal" to what the question already holds, so nothing is
  // assigned, and a truncation below the schema's own rowCount is refused outright.
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  question.getNestedQuestions(false, false, false).forEach((child) => {
    if (child.getType() !== "matrixdynamic") return;
    setRowCount(child as QuestionMatrixDynamicModel, value[child.getValueName()]);
  });
}

function setRowCount(matrix: QuestionMatrixDynamicModel, value: any): void {
  if (!Array.isArray(value)) return;
  if (matrix.rowCount !== value.length) matrix.rowCount = value.length;
}

export function getQuestionValueName(question: Question): string {
  return question.getValueName();
}
