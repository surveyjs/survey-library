import type { Base } from "./base";
import type { Question } from "./question";
import type { SurveyModel, IExpressionScopePath, IExpressionVariableInfo } from "./survey";
import type { IValueGetterContext } from "./conditions/conditionProcessValue";
import { ValueGetter, parseValuePath } from "./conditions/conditionProcessValue";
import { settings } from "./settings";
import { ItemValue } from "./itemvalue";
import { SurveyValidator } from "./validator";
import { PanelDataScopeValueGetterContext } from "./data-scope-contexts";
import { getMetadataValueGetterContext } from "./data-scope-metadata";

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
// The owner a choice's or a validator's expression resolves as, or null. A matrix column's template question has no
// parent, so its choices and validators resolve as the column, as a cell's do at runtime.
function getContextOwner(el: any): any {
  let owner: any = el instanceof ItemValue ? el.locOwner : el instanceof SurveyValidator ? el.errorOwner : null;
  if (!!owner && owner.locOwner?.templateQuestion === owner) owner = owner.locOwner;
  return !!owner && typeof owner.getValueGetterContext === "function" ? owner : null;
}
// An item value's own variables ({item}, {choice}, {self}, with or without a path after them): they keep the item
// value's context, which answers them (ItemValueGetterContext); they name no question there.
function isItemVariable(name: string): boolean {
  const head = parseValuePath(name)[0]?.name.toLocaleLowerCase();
  const expVar = settings.expressionVariables;
  return [expVar.item, expVar.choice, expVar.self].indexOf(head) > -1;
}
// The question an expression variable reads ({street}, {address.street}, {m.r1}, {kind-Comment}), found by the
// runtime's own walk in its metadata mode. null for a name the runtime answers with no element question: a built-in,
// a property path, a variable, a container's object, the raw data, a matrix cell or an item editor. A choice and a
// validator start from their owner: an item value has no parent, so it would not see the records template around its
// question. rest is the tail after the question's part ("", ".r1", "[0].q1"): a rename replaces what is before it.
export function getQuestionByVariable(survey: SurveyModel, name: string, context?: Base): IExpressionVariableInfo {
  let owner: any = context || survey;
  if (!name || typeof owner.getValueGetterContext !== "function") return null;
  if (!(owner instanceof ItemValue && isItemVariable(name))) owner = getContextOwner(owner) || owner;
  const info = new ValueGetter().getQuestionInfo(name, getMetadataValueGetterContext(owner));
  const q = <Question>info?.obj;
  if (!q || !q.isQuestion || !isElementQuestion(q) || info.restFrom === undefined) return null;
  const res: IExpressionVariableInfo = { question: q, rest: name.substring(info.restFrom) };
  if (info.isComment) res.isComment = true;
  if (info.isUnwrapped) res.isUnwrapped = true;
  return res;
}
// The shortest variable that reads question from context's expressions: the rest of its data path after one of
// context's scopes, innermost first, that the walk resolves back to the question. An inner scope that holds the same
// key makes the shorter text read another question, so a scope further out gives the text. A question inside a
// record and the record scopes are skipped: the caller writes the record's prefix ({panel.x}, {row.x}) itself.
function getVariableNameFromScopes(survey: SurveyModel, question: Question, context: Base): string {
  if (getExpressionScopePaths(survey, question).some(item => !!item.record)) return undefined;
  const path = question.getDataPath();
  for (const scope of getExpressionScopePaths(survey, context)) {
    if (!!scope.record || scope.path.length >= path.length || scope.path.some((key, i) => key !== path[i])) continue;
    const name = path.slice(scope.path.length).join(".");
    const info = getQuestionByVariable(survey, name, context);
    if (!!info && info.question === question && !info.rest) return name;
  }
  return undefined;
}
// The reverse of getQuestionByVariable: the shortest text from context's scopes, else the root's, which from context
// may read another question. A question in a record's container keeps its name, as the record's expressions read it.
export function getQuestionVariableName(survey: SurveyModel, question: Question, context?: Base): string {
  const res = !!context && context !== survey ? getVariableNameFromScopes(survey, question, context) : undefined;
  if (!!res) return res;
  const path = question.getDataPath();
  if (path.length < 2) return question.getValueName();
  const pathName = path.join(".");
  const info = getQuestionByVariable(survey, pathName);
  return !!info && info.question === question && !info.rest ? pathName : question.name;
}
// The variable a root expression writes for name: a name the root reads as a question's value, or no question's
// name, goes as it is; a question's name gives the survey's variable for it ({q1} with valueName "val1" is {val1}).
export function getExpressionVariableName(survey: SurveyModel, name: string): string {
  if (!name || !!getQuestionByVariable(survey, name)) return name;
  const question = survey.getQuestionByName(name);
  return !!question ? getQuestionVariableName(survey, question) : name;
}
// The data paths an object's expressions resolve their names in, innermost first, ending with the survey's []. A
// panel's and a page's own expressions run in their parent's scope. Inside a record (a template element at design
// time, a record's element, a matrix column) the paths relative to the record come first, tagged with the records
// question. A choice and a validator resolve as their owner; a trigger and an object without a value scope at the root.
export function getExpressionScopePaths(survey: SurveyModel, context: Base): Array<IExpressionScopePath> {
  const el: any = context;
  if (!el || el === survey) return [{ path: [] }];
  const owner = getContextOwner(el);
  if (!!owner) return getExpressionScopePaths(survey, owner);
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
// The root's keys, in this order: a question by value name (the exact name first), then a container by key. A name
// inside a container is not found from the root: outside it an expression writes the data path ({address.street}).
export function findDataScopeValueContext(survey: SurveyModel, name: string): { obj?: Question, context?: IValueGetterContext } {
  const q = survey.getQuestionByValueName(name, true);
  if (!!q) return { obj: q, context: q.getValueGetterContext() };
  if (!survey.isDataScopeUsed()) return undefined;
  const scopes = survey.getDataKeyIndex().getScopes(name, true);
  if (scopes.length > 0) return { context: new PanelDataScopeValueGetterContext(scopes) };
  return undefined;
}
