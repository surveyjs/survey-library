import type { Base } from "./base";
import type { Question } from "./question";
import type { IExpressionScopePath, IExpressionVariableInfo } from "./survey";
import type { IValueGetterContext } from "./conditions/conditionProcessValue";
import { ValueGetter } from "./conditions/conditionProcessValue";
import { Helpers } from "./helpers";
import { IDataScope, PanelDataScopeValueGetterContext, getMetadataValueGetterContext, getNameOfCommentName } from "./panel-data-scope";

// The survey members the expression variable lookup reads. The survey is the root data scope: an element
// whose value scope is it is a top-level element.
export interface IDataScopeVariablesSurvey extends IDataScope {
  isDataScopeUsed(): boolean;
  getQuestionByName(name: string, caseInsensitive?: boolean): Question;
  getQuestionByValueName(valueName: string, caseInsensitive?: boolean): Question;
}

// ["a", "b"] -> [["a", "b"], ["a"], []]
function getPathPrefixes(path: Array<string>): Array<Array<string>> {
  const res: Array<Array<string>> = [];
  for (let i = path.length; i >= 0; i--) res.push(path.slice(0, i));
  return res;
}
// An element of a panel or a page, not a matrix cell or a multiple text item editor (their parent is no container).
function isElementQuestion(q: Question): boolean {
  const parent: any = q.parent;
  return !!parent && (parent.isPanel || parent.isPage);
}
// SurveyModel.getQuestionByVariable: which question an expression variable reads ({street}, {address.street},
// {m.r1}, {kind-Comment}), found by the runtime's own walk in its metadata mode, without values (decisions
// L1-L5). context is the object whose expression it is (a question, a panel, a page, a matrix column); the
// survey when it is omitted. null when the runtime answers the name with no element question: a built-in, a
// property path, a variable, a container's object, the raw data, a matrix cell or an item editor.
// rest is the exact tail of the name after the question's part ("", ".r1", "[0].q1"), so the head a rename
// replaces is name.slice(0, name.length - rest.length).
export function getQuestionByVariable(survey: IDataScopeVariablesSurvey, name: string, context?: Base): IExpressionVariableInfo {
  const owner: any = context || survey;
  if (!name || typeof owner.getValueGetterContext !== "function") return null;
  const info = new ValueGetter().getQuestionInfo(name, getMetadataValueGetterContext(owner));
  const q = <Question>info?.obj;
  if (!q || !q.isQuestion || !isElementQuestion(q) || info.restFrom === undefined) return null;
  const res: IExpressionVariableInfo = { question: q, rest: name.substring(info.restFrom) };
  if (info.isComment) res.isComment = true;
  if (info.isUnwrapped) res.isUnwrapped = true;
  return res;
}
// SurveyModel.getExpressionScopePaths: the data paths an object's expressions resolve their names in,
// innermost first, ending with the survey's [] (decisions L6): the prefixes of its value scope's data path;
// a panel's and a page's own expressions run in their parent's scope. Inside a record (a template element at
// design time, a record's element, a matrix column) the paths relative to the record come first, tagged with
// the records question (RN4), then the records question's own paths.
export function getExpressionScopePaths(survey: IDataScopeVariablesSurvey, context: Base): Array<IExpressionScopePath> {
  const el: any = context;
  if (!el || el === survey) return [{ path: [] }];
  if (!!el.colOwner) return [<IExpressionScopePath>{ path: [], record: el.colOwner }].concat(getExpressionScopePaths(survey, el.colOwner));
  // A record panel's and a template's own expressions run in the record.
  const own = typeof el.getRecordsOwner === "function" ? el.getRecordsOwner() : null;
  if (!!own) return [<IExpressionScopePath>{ path: [], record: own }].concat(getExpressionScopePaths(survey, own));
  const keys: Array<string> = [];
  let panel: any = el.parent;
  while(!!panel && typeof panel.getRecordsOwner === "function") {
    const records = panel.getRecordsOwner();
    if (!!records) {
      const res = getPathPrefixes(keys).map(path => <IExpressionScopePath>{ path: path, record: records });
      return res.concat(getExpressionScopePaths(survey, records));
    }
    const key = panel.getRecordDataNestingKey();
    if (!!key) keys.unshift(key);
    panel = panel.parent;
  }
  const scope = typeof el.getValueScope === "function" ? el.getValueScope() : null;
  return getPathPrefixes(!!scope ? scope.getDataPath() : []).map(path => <IExpressionScopePath>{ path: path });
}
// SurveyModel.findDataScopeValueContext: the root expression lookup (SurveyValueGetterContext), in this
// order: the root index, a question by value name (the exact name first), then a container by key; then a
// question by name whose value scope is not the root (names are unique, design-01 1.1). A comment key
// ({kind-Comment}) of such a question gives the comment it stores (value, no context), as a top-level
// {q-Comment} reads the raw data key; isMetadata (getQuestionByVariable) gives the question instead, marked
// isComment, and reads nothing.
export function findDataScopeValueContext(survey: IDataScopeVariablesSurvey, name: string, isMetadata?: boolean): { obj?: Question, context?: IValueGetterContext, value?: any, isComment?: boolean } {
  const q = survey.getQuestionByValueName(name, true);
  if (!!q) return { obj: q, context: q.getValueGetterContext() };
  if (!survey.isDataScopeUsed()) return undefined;
  const scopes = survey.getDataKeyIndex().getScopes(name, true);
  if (scopes.length > 0) return { context: new PanelDataScopeValueGetterContext(scopes) };
  const inner = survey.getQuestionByName(name, true);
  if (!!inner && inner.getValueScope() !== survey) return { obj: inner, context: inner.getValueGetterContext() };
  const baseName = getNameOfCommentName(name);
  const owner = !!baseName ? survey.getQuestionByName(baseName, true) : null;
  if (!!owner && owner.getValueScope() !== survey) {
    if (isMetadata) return { obj: owner, isComment: true };
    return { value: owner.getValueScope().getValue(Helpers.getCommentKey(owner.getValueName())) };
  }
  return undefined;
}
