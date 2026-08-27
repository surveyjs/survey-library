import { Helpers } from "../helpers";
import { settings } from "../settings";
import { ProcessValue, VariableGetterContext } from "../conditions/conditionProcessValue";
import { ExpressionRunner } from "../expressions/expressionRunner";
import { CHECK_COMMAND_NAME } from "./test-json";
import { ISurveyTestCheckResult, ISurveyTestIssue, SurveyTestIssueCodes } from "./test-result";
import type { ISurveyTestContext } from "./test-context";
import type { ISurveyTestTarget } from "./test-targets";

// Why a check failed, in fields. Nothing here is a sentence: a renderer composes the text blocks from
// the check result, its jsonPath and its details, and adds nothing of its own.

// The discriminant every built-in detail object carries. "details" stays open-ended - a check an
// integrator registered puts into it whatever it likes - so a host has to be able to tell a shape the
// tester produced from one that merely looks like it. Narrowing on "kind" is that test; guessing from
// the properties an object happens to have is not.
const DETAIL_KINDS = ["expression", "trigger", "blocked", "cleared"] as const;
export type SurveyTestDetailKind = typeof DETAIL_KINDS[number];
export const SurveyTestDetailKinds: ReadonlyArray<SurveyTestDetailKind> = Object.freeze(DETAIL_KINDS.slice());

export interface ISurveyTestExpressionTrace {
  kind: "expression";
  expression: string;
  // Only the names the expression reads. Start data is shared and can be large, and a failure that
  // dumps the whole data object buries the two values that mattered.
  values: { [name: string]: any };
  // What the expression evaluates to now, and undefined when it was not evaluated: an expression that
  // calls a function is never re-run here, because running it would call that function a second time.
  result?: any;
  // Names that resolve to nothing at all: no question, no calculated value, no variable.
  unknownNames?: Array<string>;
  // The closest existing name for an entry of unknownNames, when there is one.
  suggestions?: { [name: string]: string };
}

export interface ISurveyTestTriggerTrace {
  kind: "trigger";
  stepIndex: number;
  // The type as the definition writes it: "complete", "setvalue", "runexpression".
  triggerType: string;
  expression: string;
  jsonPath: string;
}

export interface ISurveyTestBlockingQuestion {
  name: string;
  jsonPath: string;
  isRequired: boolean;
  isVisible: boolean;
  isEmpty: boolean;
  errors: Array<string>;
}

export interface ISurveyTestBlockedRecord {
  kind: "blocked";
  stepIndex: number;
  // The command that was blocked: "complete" or "nextPage".
  command: string;
  page: string;
  questions: Array<ISurveyTestBlockingQuestion>;
}

export interface ISurveyTestClearedRecord {
  kind: "cleared";
  stepIndex: number;
  name: string;
  jsonPath: string;
  // The effective mode, after the question's own "clearIfInvisible" is resolved against the survey.
  clearInvisibleValues: string;
}

// Everything a built-in check puts into ISurveyTestCheckResult.details. It is not the type of that
// field: "details" is open to a check an integrator registered, and typing it as this shape would
// promise a host that a third-party object is one of these. Read it through
// getSurveyTestCheckDetails, which returns only the members that carry the discriminant.
export interface ISurveyTestCheckDetails {
  // The expression that produced the state the check read - visibleIf, enableIf, requiredIf, or the
  // expression of a calculated value - with the values it read and the names that resolve to nothing.
  expression?: ISurveyTestExpressionTrace;
  // What fired during the command before this check, for a check about the state or a value.
  triggers?: Array<ISurveyTestTriggerTrace>;
  // Why the navigation or the completion of the previous command did not happen.
  blockedBy?: ISurveyTestBlockedRecord;
  // The question whose value was dropped by clearInvisibleValues, and when.
  clearedBy?: ISurveyTestClearedRecord;
  // The row of a matrix or the created panel the target belongs to. Neither has a node in the
  // definition, so the index travels here instead of in a path that would point at nothing.
  rowIndex?: number;
  // The key one result of a per-key survey check is about: "values", "variables", "noValues".
  key?: string;
  // "noValues" only: whether the survey data holds the key at all.
  present?: boolean;
}

// The kind of a built-in detail object, or undefined for anything else - including an object of a
// third-party check that happens to carry a "kind" of its own.
export function getSurveyTestDetailKind(detail: any): SurveyTestDetailKind {
  const kind = !!detail && typeof detail === "object" ? detail.kind : undefined;
  return typeof kind === "string" && DETAIL_KINDS.indexOf(<any>kind) > -1 ? <SurveyTestDetailKind>kind : undefined;
}

// The built-in members of a check result's details, and nothing else. A member is returned only when
// the object under it carries the discriminant the tester stamps on it, so a custom detail stored
// under the same property name is left where it is: in "details", for a host to render as it likes.
export function getSurveyTestCheckDetails(details: any): ISurveyTestCheckDetails {
  const res: ISurveyTestCheckDetails = {};
  if (!details || typeof details !== "object") return res;
  if (getSurveyTestDetailKind(details.expression) === "expression") res.expression = details.expression;
  if (getSurveyTestDetailKind(details.blockedBy) === "blocked") res.blockedBy = details.blockedBy;
  if (getSurveyTestDetailKind(details.clearedBy) === "cleared") res.clearedBy = details.clearedBy;
  if (Array.isArray(details.triggers) &&
    details.triggers.every((item: any) => getSurveyTestDetailKind(item) === "trigger")) {
    res.triggers = details.triggers;
  }
  if (typeof details.rowIndex === "number") res.rowIndex = details.rowIndex;
  if (typeof details.key === "string") res.key = details.key;
  if (typeof details.present === "boolean") res.present = details.present;
  return res;
}

// -----------------------------------------------------------------------------------------------
// 1. The path of a model object inside the definition the case was built from.
// -----------------------------------------------------------------------------------------------

// A survey-free string distance, so that the validator - which has neither a survey nor this module's
// other dependencies - can call it directly.
function getNameDistance(a: string, b: string): number {
  const prev: Array<number> = [];
  for (let j = 0; j <= b.length; j++) prev.push(j);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = prev[j];
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diagonal + cost);
      diagonal = current;
    }
  }
  return prev[b.length];
}
function isNamePart(a: string, b: string): boolean {
  const first = a.toLowerCase();
  const second = b.toLowerCase();
  return first.indexOf(second) > -1 || second.indexOf(first) > -1;
}
// Returns the single best candidate, or "" when nothing is close enough to offer. A candidate that
// contains the name or is contained by it is offered whatever its distance: "excess" is six edits
// away from "excessAmount" and is exactly the near miss this exists to name.
export function getClosestName(name: string, candidates: Array<string>): string {
  if (!name || !Array.isArray(candidates)) return "";
  const limit = Math.max(2, Math.floor(name.length * 0.4));
  let res = "";
  let best = -1;
  candidates.forEach(candidate => {
    if (!candidate || candidate === name) return;
    const distance = getNameDistance(name, candidate);
    if (distance > limit && !isNamePart(name, candidate)) return;
    if (best < 0 || distance < best) {
      best = distance;
      res = candidate;
    }
  });
  return res;
}

function isSurveyObj(obj: any): boolean {
  return !!obj && Array.isArray(obj.pages) && typeof obj.getAllQuestions === "function";
}
export function getSurveyOf(obj: any): any {
  if (!obj) return undefined;
  if (isSurveyObj(obj)) return obj;
  if (typeof obj.getSurvey === "function") {
    const res = obj.getSurvey();
    if (isSurveyObj(res)) return res;
  }
  if (isSurveyObj(obj.survey)) return obj.survey;
  return undefined;
}

function joinPath(parent: string, part: string): string {
  if (parent === undefined) return undefined;
  return !parent ? part : parent + "." + part;
}
function indexOfName(items: Array<any>, name: string): number {
  if (!Array.isArray(items) || !name) return -1;
  for (let i = 0; i < items.length; i++) {
    if (!!items[i] && items[i].name === name) return i;
  }
  return -1;
}

// The path of the object, or undefined when it cannot be located. Never a guess: a caller that gets
// "" knows the definition has no node for this object, instead of opening the wrong one.
function getObjectPath(obj: any): string {
  const survey = getSurveyOf(obj);
  if (!survey) return undefined;
  if (obj === survey) return "";
  const pageIndex = survey.pages.indexOf(obj);
  if (pageIndex > -1) return "pages[" + pageIndex + "]";
  const triggerIndex = survey.triggers.indexOf(obj);
  if (triggerIndex > -1) return "triggers[" + triggerIndex + "]";
  const calculatedIndex = survey.calculatedValues.indexOf(obj);
  if (calculatedIndex > -1) return "calculatedValues[" + calculatedIndex + "]";
  const validatorOwner = obj.errorOwner;
  if (!!validatorOwner && Array.isArray(validatorOwner.validators)) {
    const index = validatorOwner.validators.indexOf(obj);
    if (index > -1) return joinPath(getObjectPath(validatorOwner), "validators[" + index + "]");
  }
  return getElementPath(obj);
}

// A panel that a dynamic panel owns - its template or one of the panels it created from it - holds no
// definition node of its own: its children live in "templateElements".
function getDynamicPanelOf(panel: any): any {
  const question = !!panel ? panel.parentQuestion : undefined;
  if (!question || !Array.isArray(question.panels)) return undefined;
  return question.template === panel || question.panels.indexOf(panel) > -1 ? question : undefined;
}

function getElementPath(el: any): string {
  const parentQuestion = el.parentQuestion;
  if (!!parentQuestion) {
    // A cell of a matrix and the template question of a column are the same definition node.
    const columnIndex = indexOfName(parentQuestion.columns, el.name);
    if (columnIndex > -1) return joinPath(getObjectPath(parentQuestion), "columns[" + columnIndex + "]");
    const items: Array<any> = parentQuestion.items;
    if (Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].editor === el) return joinPath(getObjectPath(parentQuestion), "items[" + i + "]");
      }
    }
  }
  const parent = el.parent;
  if (!parent) return undefined;
  const dynamicPanel = getDynamicPanelOf(parent);
  if (!!dynamicPanel) {
    const templateElements: Array<any> = dynamicPanel.templateElements;
    let index = templateElements.indexOf(el);
    // A question of a created panel is a copy of the template element with the same name.
    if (index < 0) index = indexOfName(templateElements, el.name);
    if (index < 0) return undefined;
    return joinPath(getObjectPath(dynamicPanel), "templateElements[" + index + "]");
  }
  if (!Array.isArray(parent.elements)) return undefined;
  const index = parent.elements.indexOf(el);
  if (index < 0) return undefined;
  return joinPath(getObjectPath(parent), "elements[" + index + "]");
}

export function getJsonPath(obj: any, property?: string): string {
  const path = getObjectPath(obj);
  if (path === undefined) return "";
  return !property ? path : joinPath(path, property);
}

// Rows and created panels do not exist in the definition, so the index travels in "details" instead of
// in a path that would point at a node the definition does not have.
export function getRowIndex(el: any): number {
  if (!el) return undefined;
  const parent = el.parent;
  const dynamicPanel = getDynamicPanelOf(parent);
  if (!!dynamicPanel) {
    const index = dynamicPanel.panels.indexOf(parent);
    if (index > -1) return index;
  }
  const parentQuestion = el.parentQuestion;
  const rows: Array<any> = !!parentQuestion ? parentQuestion.visibleRows : undefined;
  if (Array.isArray(rows)) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (typeof row.getQuestionByColumnName === "function" && row.getQuestionByColumnName(el.name) === el) return i;
    }
  }
  return undefined;
}

// -----------------------------------------------------------------------------------------------
// 2. Expression traces. Computed for a failed check only, and always through a fresh runner: the
// element's own runner would re-enter the model, and a diagnostic that changes the survey it explains
// is worse than no diagnostic.
// -----------------------------------------------------------------------------------------------

// {row.total}, {panel.q1} and the rest of the context roots are resolved by the owner of the running
// expression, not by the survey values, so they are never reported as names that do not exist.
function isContextRootName(name: string): boolean {
  const roots: any = settings.expressionVariables;
  for (let key in roots) {
    if (roots[key] === name) return true;
  }
  return false;
}
function getFirstNamePart(name: string): string {
  let res = name.split(".")[0];
  const bracket = res.indexOf("[");
  if (bracket > -1) res = res.substring(0, bracket);
  const prefix = settings.expressionElementPropertyPrefix;
  if (!!prefix && res.indexOf(prefix) === 0) res = res.substring(prefix.length);
  return res;
}
function isKnownExpressionName(survey: any, processValue: ProcessValue, name: string): boolean {
  if (processValue.hasValue(name)) return true;
  const first = getFirstNamePart(name);
  if (!first || isContextRootName(first)) return true;
  if (!survey) return false;
  if (!!survey.getQuestionByName(first) || !!survey.getPanelByName(first) || !!survey.getPageByName(first)) return true;
  if (!!survey.getCalculatedValueByName(first)) return true;
  return survey.getVariableNames().indexOf(first.toLowerCase()) > -1;
}

// Every name a survey can offer an expression, in one list: the candidates of a name suggestion.
export function getSurveyNames(survey: any): Array<string> {
  const res: Array<string> = [];
  if (!survey) return res;
  survey.getAllQuestions(false, false, true).forEach((question: any) => res.push(question.name));
  survey.getAllPanels().forEach((panel: any) => res.push(panel.name));
  survey.pages.forEach((page: any) => res.push(page.name));
  survey.calculatedValues.forEach((calculated: any) => res.push(calculated.name));
  survey.getVariableNames().forEach((name: string) => res.push(name));
  return res;
}

export function getExpressionTrace(owner: any, expression: string): ISurveyTestExpressionTrace {
  const res: ISurveyTestExpressionTrace = { kind: "expression", expression: expression, values: {}, result: undefined };
  if (!expression) return res;
  const survey = getSurveyOf(owner);
  const values = !!survey ? survey.getFilteredValues() : {};
  const runner = new ExpressionRunner(expression);
  const names: Array<string> = runner.getVariables() || [];
  const processValue = new ProcessValue(new VariableGetterContext(values));
  const unknownNames: Array<string> = [];
  names.forEach(name => {
    res.values[name] = processValue.getValue(name);
    if (!isKnownExpressionName(survey, processValue, name)) unknownNames.push(name);
  });
  // Only an expression that calls nothing is evaluated here. Running one that calls a function would
  // call it a second time - the stub dispatcher routes by survey and its cache is off on purpose, so a
  // stub that reports a failure reports it twice and a handler the application supplied runs twice.
  // A diagnostic that changes the survey it explains is worse than no diagnostic.
  if (runner.canRun() && !runner.isAsync && !runner.hasFunction()) {
    res.result = runner.runValues(values, !!survey ? survey.getFilteredProperties() : undefined);
  }
  if (unknownNames.length > 0) {
    res.unknownNames = unknownNames;
    const candidates = getSurveyNames(survey);
    const suggestions: { [name: string]: string } = {};
    let hasSuggestion = false;
    unknownNames.forEach(name => {
      const closest = getClosestName(getFirstNamePart(name), candidates);
      if (!!closest) {
        suggestions[name] = closest;
        hasSuggestion = true;
      }
    });
    if (hasSuggestion) res.suggestions = suggestions;
  }
  return res;
}

// -----------------------------------------------------------------------------------------------
// 3. The per-test recorder. Both subscriptions are installed once for a test and removed in
// teardown(); nothing here polls the model and nothing diffs survey.data.
// -----------------------------------------------------------------------------------------------

// The checks whose expected value is produced by an expression the case did not write itself.
const EXPRESSION_PROPERTIES: { [check: string]: string } = {
  visible: "visibleIf",
  enabled: "enableIf",
  required: "requiredIf",
};
// A trigger changes the state and the values, so a failure of these carries what fired.
const TRIGGER_CHECKS = ["state", "value", "values"];
const BLOCKED_CHECKS = ["state", "currentPage"];
// The checks that read the whole list of visible choices. A failure of one of them is about the list,
// so it points at the list: no single item of the definition produced a text that came out in the
// wrong order, and a path into one of them would say it did.
const CHOICE_CHECKS = ["choices", "choiceTexts"];

export class SurveyTestDiagnostics {
  private triggers: Array<ISurveyTestTriggerTrace> = [];
  private blocked: ISurveyTestBlockedRecord;
  // The question, not the record: a run that clears an invisible value and passes never pays for the
  // path of a node nobody asks about.
  // Object.create(null) on both: the keys are value names of the survey, and a name like "toString"
  // read back off Object.prototype would be reported as a record this recorder never made.
  private cleared: { [name: string]: { stepIndex: number, question: any } } = Object.create(null);
  private reportedClears: { [key: string]: boolean } = Object.create(null);
  private triggerFunc: (sender: any, options: any) => void;
  private valueFunc: (sender: any, options: any) => void;
  constructor(private context: ISurveyTestContext) {
  }
  private get survey(): any {
    return this.context.survey;
  }
  public attach(): void {
    const survey = this.survey;
    if (!survey) return;
    this.triggerFunc = (sender: any, options: any): void => this.onTriggerExecuted(options);
    this.valueFunc = (sender: any, options: any): void => this.onValueChanged(options);
    survey.onTriggerExecuted.add(this.triggerFunc);
    survey.onValueChanged.add(this.valueFunc);
  }
  public detach(): void {
    const survey = this.survey;
    if (!survey || !this.triggerFunc) return;
    survey.onTriggerExecuted.remove(this.triggerFunc);
    survey.onValueChanged.remove(this.valueFunc);
    this.triggerFunc = undefined;
    this.valueFunc = undefined;
  }
  // What fired and what was blocked is attributed to the action that caused it, so a check reads the
  // records of the command that ran before it and never those of an older one.
  public startCommand(commandName: string): void {
    if (commandName === CHECK_COMMAND_NAME) return;
    this.triggers = [];
    this.blocked = undefined;
  }
  public setBlocked(commandName: string, data: any): void {
    const page: any = this.survey.currentPage;
    this.blocked = {
      kind: "blocked",
      stepIndex: this.context.stepIndex,
      command: commandName,
      page: !!page ? page.name : undefined,
      questions: !!data && Array.isArray(data.questions) ? data.questions : [],
    };
  }
  public enrichIssue(issue: ISurveyTestIssue): void {
    if (!issue || !!issue.jsonPath || !issue.target || !this.survey) return;
    const target = this.resolveTarget(issue.target);
    if (!target || target.kind === "survey") return;
    const path = getJsonPath(target.obj);
    if (!!path) issue.jsonPath = path;
  }
  public enrichCheckResult(result: ISurveyTestCheckResult): void {
    if (!result || !this.survey) return;
    const target = this.resolveTarget(result.target);
    if (!target) return;
    const isElement = target.kind !== "survey";
    // A failing check points at the expression property that produced the state, because that is the
    // node the reader wants to open; a passing one points at the element.
    const property = result.passed ? undefined : this.getExpressionProperty(result.check, target);
    if (isElement) {
      const path = getJsonPath(target.obj, property || this.getListProperty(result.check, target, result.passed));
      if (!!path) result.jsonPath = path;
    }
    if (result.passed) return;
    const details: any = {};
    if (!!property) {
      details.expression = getExpressionTrace(target.obj, target.obj[property]);
    }
    if (this.triggers.length > 0 && TRIGGER_CHECKS.indexOf(result.check) > -1) {
      details.triggers = this.triggers.map(trace => trace);
    }
    if (!!this.blocked && BLOCKED_CHECKS.indexOf(result.check) > -1) {
      details.blockedBy = this.blocked;
    }
    const cleared = this.getClearedRecord(result, target);
    if (!!cleared) {
      details.clearedBy = cleared;
      this.reportCleared(cleared);
    }
    if (isElement) {
      const rowIndex = getRowIndex(target.obj);
      if (rowIndex !== undefined) details.rowIndex = rowIndex;
    }
    if (Object.keys(details).length > 0) {
      result.details = Object.assign(details, result.details || {});
    }
  }
  // The definition node a failing list check is about, when the definition holds one: a question whose
  // choices come from a URL, from another question or from its type has no "choices" node to open, and
  // the element itself stays the most useful path.
  private getListProperty(checkName: string, target: ISurveyTestTarget, passed: boolean): string {
    if (passed || CHOICE_CHECKS.indexOf(checkName) < 0) return undefined;
    const choices: any = target.obj.choices;
    return Array.isArray(choices) && choices.length > 0 ? "choices" : undefined;
  }
  private getExpressionProperty(checkName: string, target: ISurveyTestTarget): string {
    const property = target.kind === "calculatedValue" && checkName === "value"
      ? "expression" : EXPRESSION_PROPERTIES[checkName];
    if (!property) return undefined;
    return !!target.obj[property] ? property : undefined;
  }
  // The name a failing check is about: the key of a per-key survey check, the value name of a question.
  private getClearedRecord(result: ISurveyTestCheckResult, target: ISurveyTestTarget): ISurveyTestClearedRecord {
    let name: string = undefined;
    if (target.kind === "survey") {
      const key = !!result.details ? result.details.key : undefined;
      if (typeof key === "string") name = key;
    } else if (target.kind === "question") {
      const obj: any = target.obj;
      name = typeof obj.getValueName === "function" ? obj.getValueName() : obj.name;
    }
    const record = !!name ? this.cleared[name] : undefined;
    if (!record) return undefined;
    const question = record.question;
    return {
      kind: "cleared",
      stepIndex: record.stepIndex,
      name: question.name,
      jsonPath: getJsonPath(question),
      clearInvisibleValues: this.survey.getQuestionClearIfInvisible(question.clearIfInvisible),
    };
  }
  // The warning goes into the step of the check that needed it: a survey that clears invisible values
  // does what it was configured to do, and a passing suite is not told about it.
  private reportCleared(record: ISurveyTestClearedRecord): void {
    const key = this.context.stepIndex + ":" + record.name;
    if (this.reportedClears[key] === true) return;
    this.reportedClears[key] = true;
    this.context.addWarning(SurveyTestIssueCodes.valueClearedAsInvisible,
      "The value of \"" + record.name + "\" was cleared because the question is not visible: the effective \"clearInvisibleValues\" mode is \"" +
      record.clearInvisibleValues + "\".",
      { target: record.name, name: record.name, jsonPath: record.jsonPath, step: record.stepIndex,
        clearInvisibleValues: record.clearInvisibleValues });
  }
  private resolveTarget(name: string): ISurveyTestTarget {
    const context: any = this.context;
    return typeof context.resolveTargetSafe === "function" ? context.resolveTargetSafe(name) : undefined;
  }
  private onTriggerExecuted(options: any): void {
    const trigger: any = !!options ? options.trigger : undefined;
    if (!trigger) return;
    this.triggers.push({
      kind: "trigger",
      stepIndex: this.context.stepIndex,
      triggerType: this.getTriggerTypeName(trigger),
      expression: trigger.expression,
      jsonPath: getJsonPath(trigger),
    });
  }
  // The definition writes a trigger as { "type": "complete" }: the class name carries a suffix the
  // JSON does not, and the path and the type must name the same node.
  private getTriggerTypeName(trigger: any): string {
    const type = typeof trigger.getType === "function" ? trigger.getType() : "";
    const suffix = "trigger";
    return type.length > suffix.length && type.lastIndexOf(suffix) === type.length - suffix.length
      ? type.substring(0, type.length - suffix.length) : type;
  }
  // A value that disappears while its question is invisible was cleared by clearInvisibleValues: a
  // respondent can only clear what they can see, and every command that clears requires a visible
  // question.
  private onValueChanged(options: any): void {
    const question: any = !!options ? options.question : undefined;
    const name: string = !!options ? options.name : undefined;
    if (!name) return;
    if (!Helpers.isValueEmpty(options.value)) {
      delete this.cleared[name];
      return;
    }
    if (!question || question.isVisibleInSurvey !== false) return;
    this.cleared[name] = { stepIndex: this.context.stepIndex, question: question };
  }
}
