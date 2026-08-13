import { Helpers } from "../helpers";
import { settings } from "../settings";
import { createCaseError, ISurveyTestContext, ISurveyTestTarget, SurveyTestCaseError, SurveyTestTargetKind } from "./test-context";
import { RESERVED_TARGET_SURVEY } from "./test-json";
import { SurveyTestIssueCodes } from "./test-result";

// Exactly one accepted type per command and per check. Nothing in the format changes meaning
// according to the type it was handed: the Creator renders one property editor per entry from the
// declared type, and a type-switch payload would have to be re-derived by the editor, the renderer,
// the validator and the docs.
export type SurveyTestPayloadType =
  "string" | "number" | "boolean" | "stringArray" | "nameMap" | "value" | "none";

export interface ISurveyTestCommand {
  name: string;
  // May target "survey"; default false.
  allowSurvey?: boolean;
  // May target an element; default true.
  allowElement?: boolean;
  // "checks" means the payload is a check map. Only "expect" declares it.
  paramsKind?: "params" | "checks";
  payloadType: SurveyTestPayloadType;
  run(context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void;
}

export function isValidTestPayload(type: SurveyTestPayloadType, val: any): boolean {
  switch(type) {
    case "string": return typeof val === "string";
    case "number": return typeof val === "number" && isFinite(val);
    case "boolean": return typeof val === "boolean";
    case "stringArray": return Array.isArray(val) && val.every(item => typeof item === "string");
    case "nameMap": return !!val && typeof val === "object" && !Array.isArray(val);
    case "value": return val !== undefined;
    case "none": return val === true;
  }
  return false;
}

export function getTestPayloadTypeText(type: SurveyTestPayloadType): string {
  switch(type) {
    case "string": return "a string";
    case "number": return "a number";
    case "boolean": return "a boolean";
    case "stringArray": return "an array of strings";
    case "nameMap": return "an object that maps a name to a value";
    case "value": return "a question value";
    case "none": return "true";
  }
  return type;
}

export function isCommandAllowedForKind(command: ISurveyTestCommand, kind: SurveyTestTargetKind): boolean {
  if (kind === "survey") return command.allowSurvey === true;
  return command.allowElement !== false;
}

export function formatTestValue(val: any): string {
  if (val === undefined) return "undefined";
  try {
    return JSON.stringify(val);
  } catch(e) {
    return String(val);
  }
}

export class SurveyTestCommandFactory {
  public static Instance: SurveyTestCommandFactory = new SurveyTestCommandFactory();
  private commands: { [name: string]: ISurveyTestCommand } = {};
  public register(command: ISurveyTestCommand): void {
    this.commands[command.name] = command;
  }
  public unregister(name: string): void {
    delete this.commands[name];
  }
  public get(name: string): ISurveyTestCommand {
    return this.commands[name];
  }
  // Sorted and stable: the Builder editor populates its dropdowns from it.
  public getNames(): Array<string> {
    return Object.keys(this.commands).sort();
  }
  public getNamesForKind(kind: SurveyTestTargetKind): Array<string> {
    return this.getNames().filter(name => isCommandAllowedForKind(this.commands[name], kind));
  }
}

// -----------------------------------------------------------------------------------------------
// Shared helpers
// -----------------------------------------------------------------------------------------------

function getTypeName(obj: any): string {
  return !!obj && typeof obj.getType === "function" ? obj.getType() : "element";
}
function commandNotApplicableToType(commandName: string, target: ISurveyTestTarget, expected: string): SurveyTestCaseError {
  return createCaseError(SurveyTestIssueCodes.commandNotApplicable,
    "The \"" + commandName + "\" command applies to " + expected + ", but the target \"" + target.name +
    "\" is a question of the type \"" + getTypeName(target.obj) + "\".",
    { target: target.name, data: { command: commandName, type: getTypeName(target.obj) } });
}
function requireQuestion(commandName: string, target: ISurveyTestTarget): any {
  if (target.kind === "question") return target.obj;
  throw createCaseError(SurveyTestIssueCodes.commandNotApplicable,
    "The \"" + commandName + "\" command applies to a question, but the target \"" + target.name + "\" is a " +
    target.kind + ".", { target: target.name, data: { command: commandName, kind: target.kind } });
}
function invalidParams(commandName: string, target: string, message: string, data?: any): SurveyTestCaseError {
  return createCaseError(SurveyTestIssueCodes.invalidCommandParams,
    "The \"" + commandName + "\" command cannot run for the target \"" + target + "\": " + message,
    { target: target, data: Object.assign({ command: commandName }, data || {}) });
}
// Levenshtein distance, used only to suggest the name the author probably meant. Prompt 05 owns the
// diagnostics; this is the smallest form of it a walk into a composite value needs.
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
export function findClosestTestName(name: string, names: Array<string>): string {
  let res: string = undefined;
  let best = -1;
  const limit = Math.max(2, Math.floor(name.length / 3));
  names.forEach(candidate => {
    const distance = getNameDistance(name, candidate);
    if (distance <= limit && (best < 0 || distance < best)) {
      best = distance;
      res = candidate;
    }
  });
  return res;
}
function unknownChildError(path: string, key: string, names: Array<string>, what: string): SurveyTestCaseError {
  const closest = findClosestTestName(key, names);
  const props: any = { target: path, data: { key: key, available: names } };
  if (!!closest) props.suggestion = "Did you mean \"" + closest + "\"?";
  return createCaseError(SurveyTestIssueCodes.unknownTarget,
    "The value of \"" + path + "\" contains the key \"" + key + "\", but the question has no " + what +
    " with this name. Available: " + (names.length > 0 ? names.join(", ") : "none") + ".", props);
}

// -----------------------------------------------------------------------------------------------
// 0.1 Navigation feasibility. The model booleans are read, not the navigationBar actions: the bar is
// created lazily and building it in a headless run is pointless work.
// -----------------------------------------------------------------------------------------------

interface INavigationRule {
  buttonId: string;
  title: string;
  isVisible(survey: any): boolean;
  // Why the button is not displayed, as one sentence that points at what to do instead.
  getReason(survey: any): string;
  // The start button has no enabled state of its own.
  hasEnabledState?: boolean;
}

function getStateReason(survey: any): string {
  return "The survey state is \"" + survey.state + "\", so no navigation button is displayed.";
}

const navigationRules: { [name: string]: INavigationRule } = {
  nextPage: {
    buttonId: "sv-nav-next",
    title: "the Next button",
    hasEnabledState: true,
    isVisible: (survey: any): boolean => survey.isShowNextButton,
    getReason: (survey: any): string => {
      if (survey.state !== "running") return getStateReason(survey);
      return "The survey is on the last page, where the Complete button has replaced Next. Use the \"complete\" command.";
    },
  },
  prevPage: {
    buttonId: "sv-nav-prev",
    title: "the Previous button",
    hasEnabledState: true,
    isVisible: (survey: any): boolean => survey.isShowPrevButton,
    getReason: (survey: any): string => {
      if (survey.state !== "running") return getStateReason(survey);
      if (!survey.showPrevButton) return "The survey hides it: \"showPrevButton\" is false.";
      return "The survey is on the first page.";
    },
  },
  complete: {
    buttonId: "sv-nav-complete",
    title: "the Complete button",
    hasEnabledState: true,
    isVisible: (survey: any): boolean => survey.isCompleteButtonVisible,
    getReason: (survey: any): string => {
      if (survey.state !== "running" && survey.state !== "preview") return getStateReason(survey);
      if (!survey.isEditMode) return "The survey is in the \"" + survey.mode + "\" mode.";
      if (!survey.showCompleteButton) return "The survey hides it: \"showCompleteButton\" is false.";
      if (survey.showPreviewBeforeComplete) {
        return "The survey shows a preview before completing, so the Preview button is displayed instead. Use the \"showPreview\" command first.";
      }
      return "The survey is not on the last page. Use the \"nextPage\" command first.";
    },
  },
  showPreview: {
    buttonId: "sv-nav-preview",
    title: "the Preview button",
    hasEnabledState: true,
    isVisible: (survey: any): boolean => survey.isPreviewButtonVisible,
    getReason: (survey: any): string => {
      if (survey.state !== "running") return getStateReason(survey);
      if (!survey.isEditMode) return "The survey is in the \"" + survey.mode + "\" mode.";
      if (!survey.showPreviewBeforeComplete) return "The survey does not show a preview: \"showPreviewBeforeComplete\" is off.";
      return "The survey is not on the last page. Use the \"nextPage\" command first.";
    },
  },
  startSurvey: {
    buttonId: "sv-nav-start",
    title: "the Start button",
    isVisible: (survey: any): boolean => survey.isStartPageActive,
    getReason: (survey: any): string => {
      if (!survey.firstPageIsStartPage) return "The survey has no start page: \"firstPageIsStartPage\" is false.";
      return "The start page is no longer displayed; the survey state is \"" + survey.state + "\".";
    },
  },
  // Not a navigation-bar action: the Edit button of the preview page carries it. It is listed here
  // because cancelPreview outside the preview state is a silent no-op in survey-core, and a case that
  // relies on it would pass while asserting nothing.
  cancelPreview: {
    buttonId: "cancel-preview",
    title: "the Edit button of the preview page",
    isVisible: (survey: any): boolean => survey.isCancelPreviewButtonVisible,
    getReason: (survey: any): string => "The survey is not showing a preview; its state is \"" + survey.state + "\".",
  },
};

function checkNavigationAvailable(context: ISurveyTestContext, commandName: string): void {
  const survey: any = context.survey;
  const rule = navigationRules[commandName];
  const data = { command: commandName, button: rule.buttonId, state: survey.state };
  if (!rule.isVisible(survey)) {
    throw createCaseError(SurveyTestIssueCodes.navigationButtonNotAvailable,
      "The \"" + commandName + "\" command cannot run: " + rule.title + " (\"" + rule.buttonId +
      "\") is not displayed. " + rule.getReason(survey),
      { target: RESERVED_TARGET_SURVEY, data: data });
  }
  if (rule.hasEnabledState === true && survey.getPropertyValue("isNavigationBlocked") === true) {
    throw createCaseError(SurveyTestIssueCodes.navigationButtonNotAvailable,
      "The \"" + commandName + "\" command cannot run: " + rule.title + " (\"" + rule.buttonId +
      "\") is displayed but disabled - the survey is waiting for an asynchronous operation to finish.",
      { target: RESERVED_TARGET_SURVEY, data: data });
  }
}

// -----------------------------------------------------------------------------------------------
// 0.2 set feasibility, cheapest check first, stopping at the first failure.
// -----------------------------------------------------------------------------------------------

function checkOnCurrentPage(context: ISurveyTestContext, question: any, path: string): void {
  const survey: any = context.survey;
  // activePage, not currentPage: it is the start page while the start page is shown and the preview
  // page while the survey previews the answers, which is what "on screen" means in both states.
  const active: any = survey.activePage;
  const page: any = question.page;
  // With no active page at all - every page is hidden - the visibility check that follows gives the
  // accurate diagnosis, and "the survey is on the page """ gives none.
  if (!page || !active || page === active) return;
  throw createCaseError(SurveyTestIssueCodes.elementNotOnCurrentPage,
    "The question \"" + path + "\" is on the page \"" + page.name + "\", but the survey is on the page \"" +
    (!!active ? active.name : "") + "\". Navigate to it with the \"nextPage\" command, or begin the test there with \"startPage\" in the test start.",
    { target: path, data: { page: page.name, currentPage: !!active ? active.name : undefined } });
}

function getHiddenParent(question: any): any {
  let parent: any = question.parent;
  while(!!parent) {
    if (parent.isVisible === false) return parent;
    parent = parent.parent;
  }
  return undefined;
}

function checkVisible(context: ISurveyTestContext, question: any, path: string): void {
  if (question.isVisibleInSurvey !== false) return;
  const hiddenParent = question.isVisible === false ? undefined : getHiddenParent(question);
  let reason: string;
  const data: any = { type: getTypeName(question) };
  if (!!hiddenParent) {
    reason = "it is inside the hidden " + getTypeName(hiddenParent) + " \"" + hiddenParent.name + "\"";
    data.hiddenParent = hiddenParent.name;
    if (!!hiddenParent.visibleIf) data.visibleIf = hiddenParent.visibleIf;
  } else {
    reason = !!question.visibleIf
      ? "its \"visibleIf\" condition (" + question.visibleIf + ") is false"
      : "its \"visible\" property is false";
    if (!!question.visibleIf) data.visibleIf = question.visibleIf;
  }
  throw createCaseError(SurveyTestIssueCodes.elementNotVisible,
    "The question \"" + path + "\" is not visible, so a respondent cannot answer it: " + reason +
    ". Use the \"setDirectly\" command to assign a value a respondent cannot enter.",
    { target: path, data: data });
}

function checkEditable(context: ISurveyTestContext, question: any, path: string): void {
  if (!question.isReadOnly && !question.isInputReadOnly) return;
  const survey: any = context.survey;
  let reason: string;
  const data: any = { type: getTypeName(question) };
  if (survey.isDisplayMode) {
    reason = "the survey is in the \"" + survey.mode + "\" mode";
    data.cause = "surveyMode";
  } else if (question.readOnly) {
    reason = !!question.enableIf
      ? "its \"enableIf\" condition (" + question.enableIf + ") is false"
      : "its \"readOnly\" property is true";
    data.cause = !!question.enableIf ? "enableIf" : "readOnly";
    if (!!question.enableIf) data.enableIf = question.enableIf;
  } else {
    const parent = getReadOnlyParent(question);
    reason = !!parent
      ? "it is inside the read-only " + getTypeName(parent) + " \"" + parent.name + "\""
      : "the input is read-only";
    data.cause = !!parent ? "parent" : "input";
    if (!!parent) data.readOnlyParent = parent.name;
  }
  throw createCaseError(SurveyTestIssueCodes.elementNotEditable,
    "The question \"" + path + "\" cannot be edited: " + reason +
    ". Use the \"setDirectly\" command to assign a value a respondent cannot enter.",
    { target: path, data: data });
}

function getReadOnlyParent(question: any): any {
  let parent: any = question.parentQuestion;
  if (!!parent && parent.isReadOnly) return parent;
  parent = question.parent;
  while(!!parent) {
    if (parent.isReadOnly) return parent;
    parent = parent.parent;
  }
  return undefined;
}

function notEnterable(path: string, question: any, message: string, data?: any): SurveyTestCaseError {
  return createCaseError(SurveyTestIssueCodes.valueNotEnterable,
    "The value cannot be entered into the question \"" + path + "\": " + message,
    { target: path, data: Object.assign({ type: getTypeName(question) }, data || {}) });
}

// The value round-trips through the mask exactly as the input does. A phone mask cannot receive
// "abc", and a case that says it can is wrong before it runs.
function checkMask(question: any, value: any, path: string): void {
  if (question.maskTypeIsEmpty !== false) return;
  const mask: any = question.maskInstance;
  if (!mask) return;
  if (typeof value !== "string" && typeof value !== "number") {
    throw notEnterable(path, question, "the \"" + question.maskType + "\" input mask accepts text, but the value is " +
      formatTestValue(value) + ".", { maskType: question.maskType });
  }
  const maskData: any = { maskType: question.maskType };
  if (typeof mask.pattern === "string") maskData.pattern = mask.pattern;
  const patternText = typeof mask.pattern === "string" ? " (\"" + mask.pattern + "\")" : "";
  // With saveMaskedValue the stored value is the masked string, so the round trip starts one step
  // earlier; either way the value must survive it unchanged.
  const isSaveMasked = mask.saveMaskedValue === true;
  const masked = isSaveMasked ? mask.getMaskedValue(mask.getUnmaskedValue(value)) : mask.getMaskedValue(value);
  if (question.maskType === "pattern" && typeof masked === "string" &&
    masked.indexOf(settings.maskSettings.patternPlaceholderChar) > -1) {
    throw notEnterable(path, question, "the \"pattern\" input mask" + patternText + " is not filled completely by " +
      formatTestValue(value) + "; the input would show \"" + masked + "\".", maskData);
  }
  const roundTrip = isSaveMasked ? masked : mask.getUnmaskedValue(masked);
  if (!Helpers.isTwoValueEquals(roundTrip, value)) {
    throw notEnterable(path, question, "the \"" + question.maskType + "\" input mask" + patternText +
      " does not accept " + formatTestValue(value) + "; it stores " + formatTestValue(roundTrip) +
      " for this input.", maskData);
  }
}

function checkMaxLength(question: any, value: any, path: string): void {
  if (typeof value !== "string" || typeof question.getMaxLength !== "function") return;
  const maxLength = question.getMaxLength();
  if (!maxLength || value.length <= maxLength) return;
  throw notEnterable(path, question, "the input accepts at most " + maxLength + " character(s), and the value has " +
    value.length + ".", { maxLength: maxLength });
}

// Both QuestionSelectBase and the Rating question expose visibleChoices, so one accessor covers the
// choice-based questions and the rate values.
function hasChoices(question: any): boolean {
  return Array.isArray(question.visibleChoices);
}
function getChoiceValues(question: any): Array<any> {
  return question.visibleChoices.map((item: any) => item.value);
}
function isMultiSelectQuestion(question: any): boolean {
  if (typeof question.multiSelect === "boolean") return question.multiSelect;
  return typeof question.maxSelectedChoices === "number";
}
// The harness must never reach the network, so a question whose choices come from a URL or a lazy
// load callback keeps its value unverified and says so.
function areChoicesVerifiable(question: any): boolean {
  if (question.choicesLazyLoadEnabled === true) return false;
  const byUrl: any = question.choicesByUrl;
  return !byUrl || byUrl.isEmpty !== false;
}

function checkChoices(context: ISurveyTestContext, question: any, value: any, path: string): void {
  if (!hasChoices(question)) return;
  const isRating = getTypeName(question) === "rating";
  if (!isRating && !areChoicesVerifiable(question)) {
    context.addWarning(SurveyTestIssueCodes.choicesNotVerifiable,
      "The choices of \"" + path + "\" are loaded from a web service, so the value " + formatTestValue(value) +
      " was not verified against them.", { target: path });
    return;
  }
  const isMulti = isMultiSelectQuestion(question);
  if (isMulti && !Array.isArray(value)) {
    throw notEnterable(path, question,
      "the question takes an array of choice values, and the value is " + formatTestValue(value) +
      ". A scalar is not wrapped into an array: write the array the case means.");
  }
  if (!isMulti && Array.isArray(value)) {
    throw notEnterable(path, question,
      "the question takes a single choice value, and the value is an array: " + formatTestValue(value) + ".");
  }
  const available = getChoiceValues(question);
  const values: Array<any> = isMulti ? value : [value];
  values.forEach(item => {
    if (available.some(choice => Helpers.isTwoValueEquals(choice, item))) return;
    const availableText = available.map(choice => formatTestValue(choice)).join(", ");
    if (isRating) {
      throw notEnterable(path, question, "the rate values are " + availableText + ", and the value is " +
        formatTestValue(item) + ".", { rateValues: available });
    }
    throw createCaseError(SurveyTestIssueCodes.invalidChoiceValue,
      "The value " + formatTestValue(item) + " is not among the choices of \"" + path + "\". Available choices: " +
      availableText + ".",
      { target: path, data: { value: item, choices: available } });
  });
  const max = question.maxSelectedChoices;
  if (isMulti && typeof max === "number" && max > 0 && values.length > max) {
    throw notEnterable(path, question, "the question allows at most " + max + " selected choice(s), and the value has " +
      values.length + ".", { maxSelectedChoices: max });
  }
}

function checkBoolean(question: any, value: any, path: string): void {
  if (typeof question.getValueTrue !== "function" || typeof question.getValueFalse !== "function") return;
  const valueTrue = question.getValueTrue();
  const valueFalse = question.getValueFalse();
  if (Helpers.isTwoValueEquals(value, valueTrue) || Helpers.isTwoValueEquals(value, valueFalse)) return;
  throw notEnterable(path, question, "the question accepts " + formatTestValue(valueTrue) + " or " +
    formatTestValue(valueFalse) + ", and the value is " + formatTestValue(value) + ".",
  { valueTrue: valueTrue, valueFalse: valueFalse });
}

const DATE_INPUT_PATTERNS: { [inputType: string]: { regex: RegExp, text: string, isDate: boolean } } = {
  "date": { regex: /^\d{4}-\d{2}-\d{2}$/, text: "YYYY-MM-DD", isDate: true },
  "datetime-local": { regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/, text: "YYYY-MM-DDThh:mm", isDate: true },
  "time": { regex: /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, text: "hh:mm", isDate: false },
};

function checkDateInput(question: any, value: any, path: string): void {
  const rule = DATE_INPUT_PATTERNS[question.inputType];
  if (!rule) return;
  const isValid = typeof value === "string" && rule.regex.test(value) &&
    (!rule.isDate || !isNaN(Date.parse(value)));
  if (isValid) return;
  throw notEnterable(path, question, "the input type is \"" + question.inputType + "\", so the value must be a \"" +
    rule.text + "\" string, and it is " + formatTestValue(value) + ".", { inputType: question.inputType });
}

// min/max and the validators are deliberately absent: a respondent can type an out-of-range value and
// see a validation error, and blocking it here would make validation untestable.
function checkValueEnterable(context: ISurveyTestContext, question: any, value: any, path: string): void {
  if (Helpers.isValueEmpty(value)) return;
  checkMask(question, value, path);
  checkMaxLength(question, value, path);
  checkChoices(context, question, value, path);
  checkBoolean(question, value, path);
  checkDateInput(question, value, path);
}

// -----------------------------------------------------------------------------------------------
// 0.3 A composite value is filled leaf by leaf, in value order, one leaf at a time, so that a
// condition on a later cell that depends on an earlier one is already correct when it is reached.
// -----------------------------------------------------------------------------------------------

function isDynamicPanelQuestion(question: any): boolean {
  return typeof question.addPanel === "function" && Array.isArray(question.panels);
}
function isDynamicMatrixQuestion(question: any): boolean {
  return typeof question.addRow === "function" && Array.isArray(question.visibleRows) &&
    typeof question.rowCount === "number";
}
function isCellMatrixQuestion(question: any): boolean {
  return Array.isArray(question.visibleRows) && !isDynamicMatrixQuestion(question) &&
    (question.visibleRows.length === 0 || typeof question.visibleRows[0].getQuestionByColumnName === "function");
}
function isSingleChoiceMatrixQuestion(question: any): boolean {
  return Array.isArray(question.visibleRows) && Array.isArray(question.columns) &&
    !isDynamicMatrixQuestion(question) && !isCellMatrixQuestion(question);
}
function isMultipleTextQuestion(question: any): boolean {
  return Array.isArray(question.items) && (question.items.length === 0 || !!question.items[0].editor);
}
function isCompositeQuestion(question: any): boolean {
  return !!question.contentPanel && typeof question.contentPanel.getQuestionByName === "function";
}

function isObjectValue(value: any): boolean {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

// Grows a dynamic matrix or panel to hold the value, exactly as far as a respondent could by pressing
// "Add". Never shrinks: the extra entries stay and the case is told about them.
function resizeForValue(context: ISurveyTestContext, question: any, path: string, count: number,
  info: { current: number, max: number, allowAdd: boolean, add: () => void, itemsText: string, allowProperty: string, maxProperty: string }): void {
  if (count > info.current) {
    const toAdd = count - info.current;
    if (!info.allowAdd) {
      throw createCaseError(SurveyTestIssueCodes.cannotAddRows,
        "The value of \"" + path + "\" has " + count + " " + info.itemsText + ", the question has " + info.current +
        ", and a respondent cannot add more: \"" + info.allowProperty + "\" is false.",
        { target: path, data: { required: count, current: info.current, allowAdd: false } });
    }
    if (info.current + toAdd > info.max) {
      throw createCaseError(SurveyTestIssueCodes.cannotAddRows,
        "The value of \"" + path + "\" has " + count + " " + info.itemsText + ", but the question allows at most " +
        info.max + " (\"" + info.maxProperty + "\").",
        { target: path, data: { required: count, current: info.current, max: info.max } });
    }
    for (let i = 0; i < toAdd; i++) info.add();
    context.addWarning(SurveyTestIssueCodes.rowsAddedImplicitly,
      "The value of \"" + path + "\" required " + count + " " + info.itemsText + " and the question had " +
      info.current + ", so " + toAdd + " were added as a respondent would.",
      { target: path, added: toAdd, count: count });
  } else if (count < info.current) {
    context.addWarning(SurveyTestIssueCodes.rowsNotRemoved,
      "The value of \"" + path + "\" has " + count + " " + info.itemsText + " and the question has " + info.current +
      "; the remaining " + (info.current - count) + " keep their values - nothing is removed implicitly.",
      { target: path, count: count, current: info.current });
  }
}

function setDynamicPanelValue(context: ISurveyTestContext, question: any, value: Array<any>, path: string): void {
  resizeForValue(context, question, path, value.length, {
    current: question.panelCount, max: question.maxPanelCount, allowAdd: question.allowAddPanel !== false,
    add: () => question.addPanel(), itemsText: "panel(s)",
    allowProperty: "allowAddPanel", maxProperty: "maxPanelCount",
  });
  value.forEach((panelValue: any, index: number) => {
    const panelPath = path + "[" + index + "]";
    if (!isObjectValue(panelValue)) {
      throw notEnterable(panelPath, question,
        "a panel of a dynamic panel is filled from an object that maps a question name to its value, and the value is " +
        formatTestValue(panelValue) + ".");
    }
    const panel = question.panels[index];
    if (!panel) return;
    Object.keys(panelValue).forEach(name => {
      const inner = panel.getQuestionByName(name);
      if (!inner) {
        throw unknownChildError(panelPath, name, panel.questions.map((q: any) => q.name), "question");
      }
      setValueThroughInput(context, inner, panelValue[name], panelPath + "." + name);
    });
  });
}

function setDynamicMatrixValue(context: ISurveyTestContext, question: any, value: Array<any>, path: string): void {
  resizeForValue(context, question, path, value.length, {
    current: question.rowCount, max: question.maxRowCount, allowAdd: question.allowAddRows !== false,
    add: () => question.addRow(), itemsText: "row(s)",
    allowProperty: "allowAddRows", maxProperty: "maxRowCount",
  });
  value.forEach((rowValue: any, index: number) => {
    const row = question.visibleRows[index];
    if (!row) return;
    setMatrixCellValues(context, question, row, rowValue, path + "[" + index + "]");
  });
}

function setCellMatrixValue(context: ISurveyTestContext, question: any, value: any, path: string): void {
  Object.keys(value).forEach(rowName => {
    const row = question.visibleRows.filter((item: any) => String(item.rowName) === rowName)[0];
    if (!row) {
      throw unknownChildError(path, rowName, question.visibleRows.map((item: any) => String(item.rowName)), "row");
    }
    setMatrixCellValues(context, question, row, value[rowName], path + "." + rowName);
  });
}

function setMatrixCellValues(context: ISurveyTestContext, question: any, row: any, rowValue: any, rowPath: string): void {
  if (!isObjectValue(rowValue)) {
    throw notEnterable(rowPath, question,
      "a matrix row is filled from an object that maps a column name to its value, and the value is " +
      formatTestValue(rowValue) + ".");
  }
  Object.keys(rowValue).forEach(columnName => {
    const cell = row.getQuestionByColumnName(columnName);
    if (!cell) {
      throw unknownChildError(rowPath, columnName, question.columns.map((column: any) => column.name), "column");
    }
    setValueThroughInput(context, cell, rowValue[columnName], rowPath + "." + columnName);
  });
}

function setSingleChoiceMatrixValue(context: ISurveyTestContext, question: any, value: any, path: string): void {
  const columns: Array<any> = question.columns;
  Object.keys(value).forEach(rowName => {
    const row = question.visibleRows.filter((item: any) => String(item.name) === rowName)[0];
    if (!row) {
      throw unknownChildError(path, rowName, question.visibleRows.map((item: any) => String(item.name)), "row");
    }
    const rowPath = path + "." + rowName;
    const cellValue = value[rowName];
    if (row.isReadOnly) {
      throw createCaseError(SurveyTestIssueCodes.elementNotEditable,
        "The row \"" + rowPath + "\" cannot be edited: the row or the matrix is read-only.",
        { target: rowPath, data: { cause: "readOnly" } });
    }
    if (!columns.some(column => Helpers.isTwoValueEquals(column.value, cellValue))) {
      throw createCaseError(SurveyTestIssueCodes.invalidChoiceValue,
        "The value " + formatTestValue(cellValue) + " is not among the columns of \"" + rowPath +
        "\". Available columns: " + columns.map(column => formatTestValue(column.value)).join(", ") + ".",
        { target: rowPath, data: { value: cellValue, choices: columns.map(column => column.value) } });
    }
    row.value = cellValue;
  });
}

function setMultipleTextValue(context: ISurveyTestContext, question: any, value: any, path: string): void {
  Object.keys(value).forEach(itemName => {
    const item = question.items.filter((entry: any) => entry.name === itemName)[0];
    if (!item) {
      throw unknownChildError(path, itemName, question.items.map((entry: any) => entry.name), "item");
    }
    setValueThroughInput(context, item.editor, value[itemName], path + "." + itemName);
  });
}

function setCompositeValue(context: ISurveyTestContext, question: any, value: any, path: string): void {
  const panel = question.contentPanel;
  Object.keys(value).forEach(name => {
    const inner = panel.getQuestionByName(name);
    if (!inner) {
      throw unknownChildError(path, name, panel.questions.map((q: any) => q.name), "question");
    }
    setValueThroughInput(context, inner, value[name], path + "." + name);
  });
}

// The one place a value reaches the model through the input path. Visibility, editability and the
// "could this be typed" checks apply at every nesting level, so a cell that a condition hides halfway
// through the walk fails naming that cell - the bug wholesale assignment hides.
function setValueThroughInput(context: ISurveyTestContext, question: any, value: any, path: string): void {
  checkVisible(context, question, path);
  checkEditable(context, question, path);
  if (!Helpers.isValueEmpty(value)) {
    if (isDynamicPanelQuestion(question) && Array.isArray(value)) {
      setDynamicPanelValue(context, question, value, path);
      return;
    }
    if (isDynamicMatrixQuestion(question) && Array.isArray(value)) {
      setDynamicMatrixValue(context, question, value, path);
      return;
    }
    if (isCellMatrixQuestion(question) && isObjectValue(value)) {
      setCellMatrixValue(context, question, value, path);
      return;
    }
    if (isSingleChoiceMatrixQuestion(question) && isObjectValue(value)) {
      setSingleChoiceMatrixValue(context, question, value, path);
      return;
    }
    if (isMultipleTextQuestion(question) && isObjectValue(value)) {
      setMultipleTextValue(context, question, value, path);
      return;
    }
    if (isCompositeQuestion(question) && isObjectValue(value)) {
      setCompositeValue(context, question, value, path);
      return;
    }
    checkCompositeValueShape(question, value, path);
  }
  // A custom question wraps one editor: the value is checked against that editor and stored on the
  // wrapper, which is the only object that owns it.
  const inputQuestion = !!question.contentQuestion ? question.contentQuestion : question;
  checkValueEnterable(context, inputQuestion, value, path);
  question.value = value;
}

// A composite question that is handed a value of the wrong shape must say what shape it takes,
// instead of assigning it wholesale and quietly skipping every per-leaf check.
function checkCompositeValueShape(question: any, value: any, path: string): void {
  if (isDynamicPanelQuestion(question)) {
    throw notEnterable(path, question, "a dynamic panel is filled from an array of panel values, and the value is " +
      formatTestValue(value) + ".");
  }
  if (isDynamicMatrixQuestion(question)) {
    throw notEnterable(path, question, "a dynamic matrix is filled from an array of row values, and the value is " +
      formatTestValue(value) + ".");
  }
  if (isCellMatrixQuestion(question) || isSingleChoiceMatrixQuestion(question)) {
    throw notEnterable(path, question, "a matrix is filled from an object that maps a row name to its value, and the value is " +
      formatTestValue(value) + ".");
  }
  if (isMultipleTextQuestion(question)) {
    throw notEnterable(path, question, "a multiple text question is filled from an object that maps an item name to its value, and the value is " +
      formatTestValue(value) + ".");
  }
  if (isCompositeQuestion(question)) {
    throw notEnterable(path, question, "a composite question is filled from an object that maps a question name to its value, and the value is " +
      formatTestValue(value) + ".");
  }
}

// -----------------------------------------------------------------------------------------------
// 1. Element commands
// -----------------------------------------------------------------------------------------------

// The value goes in through the question, which routes it into SurveyModel.setValue for a top-level
// question and into the owning panel or matrix row for a nested one. Triggers, setValueIf and
// calculated values therefore run exactly as they do for a respondent, at every nesting level.
SurveyTestCommandFactory.Instance.register({
  name: "set",
  allowSurvey: false,
  allowElement: true,
  payloadType: "value",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
    const question = requireQuestion("set", target);
    checkOnCurrentPage(context, question, target.name);
    setValueThroughInput(context, question, params, target.name);
  },
});

// The one escape hatch, named for the mechanism so that no one reaches for it by accident. It is the
// step-level equivalent of a start with dataMode: "restore": setup a respondent cannot perform, never
// a shortcut around a failing "set".
SurveyTestCommandFactory.Instance.register({
  name: "setDirectly",
  allowSurvey: false,
  allowElement: true,
  payloadType: "value",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
    const question = requireQuestion("setDirectly", target);
    const survey: any = context.survey;
    if (question.isVisibleInSurvey === false || question.isReadOnly || question.isInputReadOnly) {
      const mode = survey.getQuestionClearIfInvisible(question.clearIfInvisible);
      context.addWarning(SurveyTestIssueCodes.setWhileHidden,
        "\"setDirectly\" assigned a value to \"" + target.name +
        "\", which a respondent cannot edit because it is " +
        (question.isVisibleInSurvey === false ? "not visible" : "read-only") +
        ". The effective \"clearInvisibleValues\" mode is \"" + mode + "\", so the value may be dropped later.",
        { target: target.name, clearInvisibleValues: mode });
    }
    question.value = params;
  },
});

SurveyTestCommandFactory.Instance.register({
  name: "clear",
  allowSurvey: false,
  allowElement: true,
  payloadType: "none",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget): void => {
    const question = requireQuestion("clear", target);
    checkOnCurrentPage(context, question, target.name);
    checkVisible(context, question, target.name);
    checkEditable(context, question, target.name);
    question.clearValue();
  },
});

SurveyTestCommandFactory.Instance.register({
  name: "setComment",
  allowSurvey: false,
  allowElement: true,
  payloadType: "string",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
    const question = requireQuestion("setComment", target);
    checkOnCurrentPage(context, question, target.name);
    checkVisible(context, question, target.name);
    checkEditable(context, question, target.name);
    question.comment = params;
  },
});

function requireCount(commandName: string, target: ISurveyTestTarget, params: any): number {
  if (typeof params !== "number" || !isFinite(params) || params < 1 || Math.floor(params) !== params) {
    throw invalidParams(commandName, target.name,
      "the parameter is the number of items to add and must be a whole number greater than 0, and it is " +
      formatTestValue(params) + ".", { value: params });
  }
  return params;
}
function requireIndex(commandName: string, target: ISurveyTestTarget, params: any, count: number): number {
  if (typeof params !== "number" || !isFinite(params) || Math.floor(params) !== params || params < 0 || params >= count) {
    throw invalidParams(commandName, target.name,
      "the parameter is the index of the item to remove and must be a whole number between 0 and " + (count - 1) +
      ", and it is " + formatTestValue(params) + ".", { value: params, count: count });
  }
  return params;
}

SurveyTestCommandFactory.Instance.register({
  name: "addRow",
  allowSurvey: false,
  allowElement: true,
  payloadType: "number",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
    const question = requireQuestion("addRow", target);
    if (!isDynamicMatrixQuestion(question)) throw commandNotApplicableToType("addRow", target, "a dynamic matrix");
    const count = requireCount("addRow", target, params);
    checkOnCurrentPage(context, question, target.name);
    checkVisible(context, question, target.name);
    if (question.allowAddRows === false) {
      throw createCaseError(SurveyTestIssueCodes.cannotAddRows,
        "A respondent cannot add a row to \"" + target.name + "\": \"allowAddRows\" is false.",
        { target: target.name, data: { allowAdd: false } });
    }
    if (question.rowCount + count > question.maxRowCount) {
      throw createCaseError(SurveyTestIssueCodes.cannotAddRows,
        "Adding " + count + " row(s) to \"" + target.name + "\" would exceed its \"maxRowCount\" of " +
        question.maxRowCount + "; it already has " + question.rowCount + ".",
        { target: target.name, data: { current: question.rowCount, max: question.maxRowCount } });
    }
    for (let i = 0; i < count; i++) question.addRow();
  },
});

SurveyTestCommandFactory.Instance.register({
  name: "removeRow",
  allowSurvey: false,
  allowElement: true,
  payloadType: "number",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
    const question = requireQuestion("removeRow", target);
    if (!isDynamicMatrixQuestion(question)) throw commandNotApplicableToType("removeRow", target, "a dynamic matrix");
    const index = requireIndex("removeRow", target, params, question.rowCount);
    checkOnCurrentPage(context, question, target.name);
    checkVisible(context, question, target.name);
    question.removeRow(index);
  },
});

SurveyTestCommandFactory.Instance.register({
  name: "addPanel",
  allowSurvey: false,
  allowElement: true,
  payloadType: "number",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
    const question = requireQuestion("addPanel", target);
    if (!isDynamicPanelQuestion(question)) throw commandNotApplicableToType("addPanel", target, "a dynamic panel");
    const count = requireCount("addPanel", target, params);
    checkOnCurrentPage(context, question, target.name);
    checkVisible(context, question, target.name);
    if (question.allowAddPanel === false) {
      throw createCaseError(SurveyTestIssueCodes.cannotAddRows,
        "A respondent cannot add a panel to \"" + target.name + "\": \"allowAddPanel\" is false.",
        { target: target.name, data: { allowAdd: false } });
    }
    if (question.panelCount + count > question.maxPanelCount) {
      throw createCaseError(SurveyTestIssueCodes.cannotAddRows,
        "Adding " + count + " panel(s) to \"" + target.name + "\" would exceed its \"maxPanelCount\" of " +
        question.maxPanelCount + "; it already has " + question.panelCount + ".",
        { target: target.name, data: { current: question.panelCount, max: question.maxPanelCount } });
    }
    for (let i = 0; i < count; i++) question.addPanel();
  },
});

SurveyTestCommandFactory.Instance.register({
  name: "removePanel",
  allowSurvey: false,
  allowElement: true,
  payloadType: "number",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
    const question = requireQuestion("removePanel", target);
    if (!isDynamicPanelQuestion(question)) throw commandNotApplicableToType("removePanel", target, "a dynamic panel");
    const index = requireIndex("removePanel", target, params, question.panelCount);
    checkOnCurrentPage(context, question, target.name);
    checkVisible(context, question, target.name);
    question.removePanel(index);
  },
});

// -----------------------------------------------------------------------------------------------
// 2. Survey commands
// -----------------------------------------------------------------------------------------------

function registerNavigationCommand(name: string, act: (context: ISurveyTestContext) => void): void {
  SurveyTestCommandFactory.Instance.register({
    name: name,
    allowSurvey: true,
    allowElement: false,
    payloadType: "none",
    run: (context: ISurveyTestContext): void => {
      checkNavigationAvailable(context, name);
      act(context);
    },
  });
}

// A blocked completion is not a failing step: the button was there, the respondent pressed it and the
// survey refused. The warning carries the blocking questions so that the following "expect" - and the
// diagnostics of prompt 05 - can say why.
function addBlockedWarning(context: ISurveyTestContext, code: string, action: string): void {
  const survey: any = context.survey;
  const blocking: Array<string> = [];
  const page: any = survey.currentPage;
  if (!!page && Array.isArray(page.questions)) {
    page.questions.forEach((question: any) => {
      if (question.errors && question.errors.length > 0) blocking.push(question.name);
    });
  }
  context.addWarning(code,
    "The survey did not " + action + ": " + (blocking.length > 0
      ? "the questions " + blocking.join(", ") + " have validation errors."
      : "it was blocked, and no question reported an error - an event handler may have cancelled it."),
    { questions: blocking, state: survey.state });
}

registerNavigationCommand("complete", (context: ISurveyTestContext) => {
  const survey: any = context.survey;
  if (!survey.tryComplete()) {
    addBlockedWarning(context, SurveyTestIssueCodes.completeBlocked, "complete");
  }
});
registerNavigationCommand("nextPage", (context: ISurveyTestContext) => {
  const survey: any = context.survey;
  if (!survey.nextPage()) {
    addBlockedWarning(context, SurveyTestIssueCodes.nextPageBlocked, "move to the next page");
  }
});
registerNavigationCommand("prevPage", (context: ISurveyTestContext) => {
  (<any>context.survey).prevPage();
});
registerNavigationCommand("startSurvey", (context: ISurveyTestContext) => {
  (<any>context.survey).start();
});
registerNavigationCommand("showPreview", (context: ISurveyTestContext) => {
  (<any>context.survey).showPreview();
});
registerNavigationCommand("cancelPreview", (context: ISurveyTestContext) => {
  (<any>context.survey).cancelPreview();
});

// The host application changes a variable mid-session in real deployments, so this is a real
// interaction and not an escape hatch.
SurveyTestCommandFactory.Instance.register({
  name: "setVariable",
  allowSurvey: true,
  allowElement: false,
  payloadType: "nameMap",
  run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): void => {
    Object.keys(params).forEach(name => context.survey.setVariable(name, params[name]));
  },
});
