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
// The object a choice's (an item value's) or a validator's expression resolves as: its owner, as their value-getter
// contexts hand a name to it (ItemValueGetterContext, SurveyValidator.getValueGetterContext). null for any other
// object, and for one whose owner has no context.
function getContextOwner(el: any): any {
  const owner: any = el instanceof ItemValue ? el.locOwner : el instanceof SurveyValidator ? el.errorOwner : null;
  return !!owner && typeof owner.getValueGetterContext === "function" ? owner : null;
}
// An item value's own variables ({item}, {choice}, {self}, with or without a path after them): they keep the item
// value's context, which answers them (ItemValueGetterContext); they name no question there.
function isItemVariable(name: string): boolean {
  const head = parseValuePath(name)[0]?.name.toLocaleLowerCase();
  const expVar = settings.expressionVariables;
  return [expVar.item, expVar.choice, expVar.self].indexOf(head) > -1;
}
// SurveyModel.getQuestionByVariable: which question an expression variable reads ({street}, {address.street},
// {m.r1}, {kind-Comment}), found by the runtime's own walk in its metadata mode, without values.
// context is the object whose expression it is (a question, a panel, a page, a matrix column, a choice, a
// validator); the survey when it is omitted. null when the runtime answers the name with no element question: a
// built-in, a property path, a variable, a container's object, the raw data, a matrix cell or an item editor.
// A choice and a validator start from their owner's context: an item value has no parent, so its own would not
// see the records template around its question.
// rest is the exact tail of the name after the question's part ("", ".r1", "[0].q1"), so the head a rename
// replaces is name.slice(0, name.length - rest.length).
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
// The shortest variable that reads question from context's expressions (O3): the rest of its data path after one of
// context's scopes, innermost first, that the walk resolves back to the question. An inner scope that holds the same
// key makes the shorter text read another question, so a scope further out gives the text. undefined when none does.
// The record prefixes ({panel.x}, {row.x}) are out of scope: a question inside a record (its data path starts at the
// record) and the record-relative scopes are skipped; the caller writes the record's prefix itself.
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
// SurveyModel.getQuestionVariableName, the reverse of getQuestionByVariable: the variable an expression of context
// (the survey when it is omitted) names question by. From inside a container, the shortest text that reads it
// (getVariableNameFromScopes): {street} inside address. Otherwise the root's answer. When no text reaches question
// from context (a top-level street hidden by address's street, from inside address), that root's answer reads
// another question or a container's object there. A top-level question: its value
// name. An inner question: its data path ({address.town}): the root does not resolve a name inside a container (O3).
// A question no root variable reaches (one inside a container of a record) keeps its name, as the record's own
// expressions read it: its data path starts at the record, not at the survey data.
export function getQuestionVariableName(survey: SurveyModel, question: Question, context?: Base): string {
  const res = !!context && context !== survey ? getVariableNameFromScopes(survey, question, context) : undefined;
  if (!!res) return res;
  const path = question.getDataPath();
  if (path.length < 2) return question.getValueName();
  const pathName = path.join(".");
  const info = getQuestionByVariable(survey, pathName);
  return !!info && info.question === question && !info.rest ? pathName : question.name;
}
// SurveyModel.getExpressionVariableName: the variable a root expression writes for name. A name the root reads
// as a question's value goes as it is (a value name, a data path, {m.r1}); a question's name gives the variable
// the survey names the question by (getQuestionVariableName): {q1} with valueName "val1" is {val1}. Any other
// name (a variable, a calculated value) goes as it is.
export function getExpressionVariableName(survey: SurveyModel, name: string): string {
  if (!name || !!getQuestionByVariable(survey, name)) return name;
  const question = survey.getQuestionByName(name);
  return !!question ? getQuestionVariableName(survey, question) : name;
}
// SurveyModel.getExpressionScopePaths: the data paths an object's expressions resolve their names in,
// innermost first, ending with the survey's []: the prefixes of its value scope's data path;
// a panel's and a page's own expressions run in their parent's scope. Inside a record (a template element at
// design time, a record's element, a matrix column) the paths relative to the record come first, tagged with
// the records question, then the records question's own paths. A choice (an item value) and a validator resolve
// as their owner, as their value-getter contexts do; a trigger, and any object without a value scope, at the root.
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
// The root expression lookup (SurveyValueGetterContext), in this order: the root's keys, a question by value
// name (the exact name first), then a container by key. A name inside a container is not found from the root
// (O3): an expression outside the container writes its data path ({address.street}); one inside it resolves the
// bare name in its own scope and the scopes around it (PanelDataScope.getValueGetterContext).
export function findDataScopeValueContext(survey: SurveyModel, name: string): { obj?: Question, context?: IValueGetterContext } {
  const q = survey.getQuestionByValueName(name, true);
  if (!!q) return { obj: q, context: q.getValueGetterContext() };
  if (!survey.isDataScopeUsed()) return undefined;
  const scopes = survey.getDataKeyIndex().getScopes(name, true);
  if (scopes.length > 0) return { context: new PanelDataScopeValueGetterContext(scopes) };
  return undefined;
}
