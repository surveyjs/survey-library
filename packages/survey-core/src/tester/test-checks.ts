import { Helpers } from "../helpers";
import { CHECK_COMMAND_NAME } from "./test-json";
import {
  formatTestValue, getTestPayloadTypeText, isValidTestPayload, SurveyTestCommandFactory, SurveyTestPayloadType,
} from "./test-commands";
import { ISurveyTestContext } from "./test-context";
import {
  isDynamicMatrixQuestion, isDynamicPanelQuestion, ISurveyTestTarget, SurveyTestTargetKind,
} from "./test-targets";
import { ISurveyTestIssue, SurveyTestIssueCodes } from "./test-result";

export interface ISurveyTestCheckOutcome {
  passed?: boolean;
  actual?: any;
  // Only a check that reports one result per key sets it: the payload of the pair is the whole map,
  // and one result carries the expected value of one key.
  expected?: any;
  message?: string;
  details?: any;
  // Set instead of an assertion: the pair is an author error, not a failed check. The dispatcher turns
  // it into an issue and the remaining checks of the step still run.
  issueCode?: string;
}

// The runtime counterpart of ISurveyTestCheck from test-json.ts: that one is the JSON shape of a
// check map, this one is a registered check handler.
export interface ISurveyTestCheckHandler {
  name: string;
  // The target kinds the check applies to; undefined means all of them.
  kinds?: Array<SurveyTestTargetKind>;
  payloadType: SurveyTestPayloadType;
  // Overrides the type name in the invalidCheckPayload message: "a page name" says more than
  // "a string" while remaining the same single payload type.
  payloadText?: string;
  // A check that applies to a question type rather than to a kind as a whole says why it does not
  // apply here. The dispatcher turns the sentence into a checkNotApplicable issue.
  getNotApplicableReason?(target: ISurveyTestTarget): string;
  // A handler that returns a promise is awaited before the next check of the same target runs. Every
  // built-in check reads the model and returns its outcome synchronously.
  check(context: ISurveyTestContext, target: ISurveyTestTarget, expected: any):
    ISurveyTestCheckOutcome | Array<ISurveyTestCheckOutcome> |
    Promise<ISurveyTestCheckOutcome | Array<ISurveyTestCheckOutcome>>;
}

export function isCheckAllowedForKind(check: ISurveyTestCheckHandler, kind: SurveyTestTargetKind): boolean {
  return !check.kinds || check.kinds.indexOf(kind) > -1;
}

export class SurveyTestCheckFactory {
  public static Instance: SurveyTestCheckFactory = new SurveyTestCheckFactory();
  private checks: { [name: string]: ISurveyTestCheckHandler } = {};
  public register(check: ISurveyTestCheckHandler): void {
    this.checks[check.name] = check;
  }
  public unregister(name: string): void {
    delete this.checks[name];
  }
  public get(name: string): ISurveyTestCheckHandler {
    return this.checks[name];
  }
  // Sorted and stable: the Builder editor populates its dropdowns from it.
  public getNames(): Array<string> {
    return Object.keys(this.checks).sort();
  }
  public getNamesForKind(kind: SurveyTestTargetKind): Array<string> {
    return this.getNames().filter(name => isCheckAllowedForKind(this.checks[name], kind));
  }
}

function addPairIssue(context: ISurveyTestContext, code: string, message: string, target: string, data: any): void {
  const issue: ISurveyTestIssue = { severity: "error", code: code, message: message, target: target, data: data };
  context.addIssue(issue);
}

// "expect" is an ordinary registry entry whose parameters are a map of check -> expected value. It is
// the only place assertions are produced by a built-in, but nothing about producing them is tied to
// this name: any command may call context.addCheckResult.
SurveyTestCommandFactory.Instance.register({
  name: CHECK_COMMAND_NAME,
  allowSurvey: true,
  allowElement: true,
  paramsKind: "checks",
  payloadType: "nameMap",
  run: async (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): Promise<void> => {
    const factory = SurveyTestCheckFactory.Instance;
    // Every pair produces a result or an issue, including the pairs after a failing one: checks are
    // independent of each other. They run in key order, one after the other, so an asynchronous handler
    // finishes before the next pair reads the model.
    const checkNames = Object.keys(params);
    for (let i = 0; i < checkNames.length; i++) {
      // A run stopped while the previous check was awaited produces no further ones. Returning is all
      // a handler has to do: the runner notices the stop the moment this command returns.
      if (!!context.signal && context.signal.aborted) break;
      const checkName = checkNames[i];
      const handler = factory.get(checkName);
      if (!handler) {
        addPairIssue(context, SurveyTestIssueCodes.unknownCheck,
          "There is no check named \"" + checkName + "\". Available checks: " + factory.getNames().join(", ") + ".",
          target.name, { check: checkName });
        continue;
      }
      if (!isCheckAllowedForKind(handler, target.kind)) {
        addPairIssue(context, SurveyTestIssueCodes.checkNotApplicable,
          "The check \"" + checkName + "\" does not apply to the " + target.kind + " \"" + target.name +
          "\". Checks for a " + target.kind + ": " + factory.getNamesForKind(target.kind).join(", ") + ".",
          target.name, { check: checkName, kind: target.kind });
        continue;
      }
      const reason = !!handler.getNotApplicableReason ? handler.getNotApplicableReason(target) : undefined;
      if (!!reason) {
        addPairIssue(context, SurveyTestIssueCodes.checkNotApplicable, reason, target.name,
          { check: checkName, kind: target.kind });
        continue;
      }
      const expected = params[checkName];
      if (!isValidTestPayload(handler.payloadType, expected)) {
        addPairIssue(context, SurveyTestIssueCodes.invalidCheckPayload,
          "The check \"" + checkName + "\" expects " + getCheckPayloadText(handler) +
          " as its expected value, but the target \"" + target.name + "\" passes " + formatTestValue(expected) + ".",
          target.name, { check: checkName, payloadType: handler.payloadType });
        continue;
      }
      const outcome = await handler.check(context, target, expected);
      const outcomes = Array.isArray(outcome) ? outcome : [outcome];
      outcomes.forEach(item => addOutcome(context, target, checkName, expected, item));
    }
  },
});

function getCheckPayloadText(handler: ISurveyTestCheckHandler): string {
  return !!handler.payloadText ? handler.payloadText : getTestPayloadTypeText(handler.payloadType);
}

function addOutcome(context: ISurveyTestContext, target: ISurveyTestTarget, checkName: string,
  expected: any, outcome: ISurveyTestCheckOutcome): void {
  if (!!outcome.issueCode) {
    addPairIssue(context, outcome.issueCode, outcome.message, target.name,
      Object.assign({ check: checkName }, outcome.details || {}));
    return;
  }
  context.addCheckResult({
    target: target.name,
    check: checkName,
    // A per-key check reports the expected value of its key; every other check reports the payload.
    expected: Object.prototype.hasOwnProperty.call(outcome, "expected") ? outcome.expected : expected,
    actual: outcome.actual,
    passed: outcome.passed === true,
    message: outcome.message,
    details: outcome.details,
  });
}

// -----------------------------------------------------------------------------------------------
// Comparison
// -----------------------------------------------------------------------------------------------

function getValueTypeText(val: any): string {
  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (Array.isArray(val)) return "an array";
  const type = typeof val;
  if (type === "string") return "a string";
  if (type === "number") return "a number";
  if (type === "boolean") return "a boolean";
  return "an object";
}

// Helpers.isTwoValueEquals converts "5" into 5 because the expression engine does, and visibleIf has
// to keep working that way. A check must not: "what is stored" has one answer, and a case that passes
// with the wrong type hides the bug it was written to find. Empty values keep the engine semantics,
// so value: null still matches an unanswered question and value: [] an unanswered checkbox. Only the
// top level is compared: a payload is written by hand, and a nested type-only difference has never
// been the confusing case.
function isTypeMismatch(actual: any, expected: any): boolean {
  if (Helpers.isValueEmpty(actual) || Helpers.isValueEmpty(expected)) return false;
  if (Array.isArray(actual) !== Array.isArray(expected)) return true;
  return typeof actual !== typeof expected;
}
function isEqualByEngine(actual: any, expected: any, ignoreOrder: boolean): boolean {
  return Helpers.isTwoValueEquals(actual, expected, ignoreOrder, true, false);
}
function isSameTestValue(actual: any, expected: any, ignoreOrder?: boolean): boolean {
  if (isTypeMismatch(actual, expected)) return false;
  return isEqualByEngine(actual, expected, ignoreOrder === true);
}
function getMismatchText(actual: any, expected: any, ignoreOrder: boolean): string {
  let res = " is " + formatTestValue(actual) + ", expected " + formatTestValue(expected) + ".";
  if (isTypeMismatch(actual, expected) && isEqualByEngine(actual, expected, ignoreOrder)) {
    res += " The two differ only by type: the survey holds " + getValueTypeText(actual) +
      " and the case expects " + getValueTypeText(expected) + ". The tester never converts one into the other.";
  }
  return res;
}
// subject names what was read, so that the sentence reads as one: "The "value" of "q1" is 5, expected 7."
function createOutcome(subject: string, actual: any, expected: any, ignoreOrder?: boolean): ISurveyTestCheckOutcome {
  const order = ignoreOrder === true;
  const passed = isSameTestValue(actual, expected, order);
  return {
    passed: passed,
    actual: actual,
    message: passed ? undefined : "The " + subject + getMismatchText(actual, expected, order),
  };
}

// -----------------------------------------------------------------------------------------------
// Reading the model. No check may change it: a check that mutates the survey makes the order of the
// steps meaningless, so every accessor below is a getter and hasErrors() is never called with true.
// -----------------------------------------------------------------------------------------------

function getElementQuestions(obj: any): Array<any> {
  return !!obj && Array.isArray(obj.questions) ? obj.questions : [];
}
function getErrorTexts(target: ISurveyTestTarget): Array<string> {
  const obj: any = target.obj;
  const questions: Array<any> = target.kind === "question" ? [obj] : getElementQuestions(obj);
  const res: Array<string> = [];
  questions.forEach(question => {
    const errors: Array<any> = Array.isArray(question.errors) ? question.errors : [];
    errors.forEach(error => res.push(error.getText()));
  });
  return res;
}
function getSurveyErrorTexts(context: ISurveyTestContext): Array<string> {
  const res: Array<string> = [];
  (<any>context.survey).getAllQuestions(false, false, true).forEach((question: any) => {
    const errors: Array<any> = Array.isArray(question.errors) ? question.errors : [];
    errors.forEach(error => res.push(error.getText()));
  });
  return res;
}
function getErrorCount(context: ISurveyTestContext, target: ISurveyTestTarget): number {
  return target.kind === "survey" ? getSurveyErrorTexts(context).length : getErrorTexts(target).length;
}
// A question knows whether its containers are visible; a panel knows about itself only, so its
// parents are walked here. A page has no parent to walk.
function isElementVisible(obj: any): boolean {
  if (obj.isVisible !== true) return false;
  if (typeof obj.isVisibleInSurvey === "boolean") return obj.isVisibleInSurvey;
  let parent: any = obj.parent;
  while(!!parent) {
    if (parent.isVisible === false) return false;
    parent = parent.parent;
  }
  return true;
}
function getElementTitle(obj: any): string {
  // renderedHtml resolves the locale and the text piping, which is the point of checking a title.
  return !!obj && !!obj.locTitle ? obj.locTitle.renderedHtml : undefined;
}
function getElementPageName(obj: any): string {
  const page: any = !!obj ? obj.page : undefined;
  return !!page ? page.name : undefined;
}
function getChoiceValues(obj: any): Array<any> {
  return obj.visibleChoices.map((choice: any) => choice.value);
}
function getTypeName(obj: any): string {
  return !!obj && typeof obj.getType === "function" ? obj.getType() : "element";
}
function createTypeReason(checkName: string, target: ISurveyTestTarget, expected: string): string {
  return "The check \"" + checkName + "\" applies to " + expected + ", but the target \"" + target.name +
    "\" is a question of the type \"" + getTypeName(target.obj) + "\".";
}

// -----------------------------------------------------------------------------------------------
// 1. Element checks
// -----------------------------------------------------------------------------------------------

interface IReadCheckDefinition {
  name: string;
  kinds?: Array<SurveyTestTargetKind>;
  payloadType: SurveyTestPayloadType;
  payloadText?: string;
  // Arrays that mean a set compare order-insensitively; "pages" is the one ordered list.
  ignoreOrder?: boolean;
  getNotApplicableReason?(target: ISurveyTestTarget): string;
  // The subject of the message; the check name in quotes unless the sentence needs a noun.
  subject?: string;
  getActual(context: ISurveyTestContext, target: ISurveyTestTarget): any;
}

// Every check that reads one value and compares it is registered from a definition: the handlers
// differ in what they read and in nothing else, and a per-check copy of the comparison would drift.
function registerReadCheck(definition: IReadCheckDefinition): void {
  const subject = !!definition.subject ? definition.subject : "\"" + definition.name + "\"";
  SurveyTestCheckFactory.Instance.register({
    name: definition.name,
    kinds: definition.kinds,
    payloadType: definition.payloadType,
    payloadText: definition.payloadText,
    getNotApplicableReason: definition.getNotApplicableReason,
    check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any): ISurveyTestCheckOutcome => {
      return createOutcome(subject + " of \"" + target.name + "\"",
        definition.getActual(context, target), expected, definition.ignoreOrder);
    },
  });
}

registerReadCheck({
  name: "value",
  kinds: ["question", "calculatedValue"],
  payloadType: "value",
  subject: "value",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => target.obj.value,
});
registerReadCheck({
  name: "empty",
  kinds: ["question"],
  payloadType: "boolean",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => target.obj.isEmpty(),
});
registerReadCheck({
  name: "visible",
  kinds: ["question", "panel", "page"],
  payloadType: "boolean",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => isElementVisible(target.obj),
});
registerReadCheck({
  name: "enabled",
  kinds: ["question", "panel", "page"],
  payloadType: "boolean",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => target.obj.isReadOnly !== true,
});
registerReadCheck({
  name: "required",
  kinds: ["question"],
  payloadType: "boolean",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => target.obj.isRequired === true,
});
registerReadCheck({
  name: "errors",
  kinds: ["question", "panel", "page"],
  payloadType: "stringArray",
  payloadText: "an array of error texts",
  ignoreOrder: true,
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => getErrorTexts(target),
});
registerReadCheck({
  name: "errorCount",
  kinds: ["question", "panel", "page", "survey"],
  payloadType: "number",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => getErrorCount(context, target),
});
registerReadCheck({
  name: "hasErrors",
  kinds: ["question", "panel", "page"],
  payloadType: "boolean",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => getErrorTexts(target).length > 0,
});
registerReadCheck({
  name: "comment",
  kinds: ["question"],
  payloadType: "string",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => target.obj.comment,
});
registerReadCheck({
  name: "choices",
  kinds: ["question"],
  payloadType: "array",
  payloadText: "an array of choice values",
  ignoreOrder: true,
  getNotApplicableReason: (target: ISurveyTestTarget): string => {
    return Array.isArray(target.obj.visibleChoices) ? undefined
      : createTypeReason("choices", target, "a question with choices");
  },
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => getChoiceValues(target.obj),
});
registerReadCheck({
  name: "title",
  kinds: ["question", "panel", "page"],
  payloadType: "string",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => getElementTitle(target.obj),
});
registerReadCheck({
  name: "page",
  kinds: ["question", "panel"],
  payloadType: "string",
  payloadText: "a page name",
  subject: "page",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => getElementPageName(target.obj),
});
registerReadCheck({
  name: "rowCount",
  kinds: ["question"],
  payloadType: "number",
  getNotApplicableReason: (target: ISurveyTestTarget): string => {
    return isDynamicMatrixQuestion(target.obj) ? undefined
      : createTypeReason("rowCount", target, "a dynamic matrix");
  },
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => target.obj.rowCount,
});
registerReadCheck({
  name: "panelCount",
  kinds: ["question"],
  payloadType: "number",
  getNotApplicableReason: (target: ISurveyTestTarget): string => {
    return isDynamicPanelQuestion(target.obj) ? undefined
      : createTypeReason("panelCount", target, "a dynamic panel");
  },
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => target.obj.panelCount,
});
registerReadCheck({
  name: "type",
  kinds: ["question"],
  payloadType: "string",
  getActual: (context: ISurveyTestContext, target: ISurveyTestTarget): any => getTypeName(target.obj),
});

// -----------------------------------------------------------------------------------------------
// 2. Survey checks
// -----------------------------------------------------------------------------------------------

const SURVEY_STATES = ["running", "completed", "preview", "starting", "empty", "loading", "completedbefore"];

SurveyTestCheckFactory.Instance.register({
  name: "state",
  kinds: ["survey"],
  payloadType: "string",
  payloadText: "a survey state (" + SURVEY_STATES.join(", ") + ")",
  check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any): ISurveyTestCheckOutcome => {
    const actual = context.survey.state;
    if (actual === expected) return { passed: true, actual: actual };
    // A misspelled state would otherwise fail with no hint at all: the value looks like data, and the
    // set of states is not something a case author is expected to know by heart.
    const unknown = SURVEY_STATES.indexOf(expected) < 0
      ? " There is no survey state named \"" + expected + "\"; the states are: " + SURVEY_STATES.join(", ") + "."
      : "";
    return {
      passed: false,
      actual: actual,
      message: "The survey state is \"" + actual + "\", expected \"" + expected + "\"." + unknown,
    };
  },
});

SurveyTestCheckFactory.Instance.register({
  name: "currentPage",
  kinds: ["survey"],
  payloadType: "string",
  // A page index would let a page reorder silently redirect a case, exactly as it would in a start.
  payloadText: "a page name",
  check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any): ISurveyTestCheckOutcome => {
    const survey: any = context.survey;
    const page: any = survey.currentPage;
    const actual = !!page ? page.name : undefined;
    if (actual === expected) return { passed: true, actual: actual };
    const message = !page
      ? "The survey is on no page: its state is \"" + survey.state + "\". Expected the page \"" + expected + "\"."
      : "The survey is on the page \"" + actual + "\", expected \"" + expected + "\".";
    return { passed: false, actual: actual, message: message };
  },
});

function createEmptyMapOutcome(checkName: string, what: string): ISurveyTestCheckOutcome {
  return {
    issueCode: SurveyTestIssueCodes.invalidCheckPayload,
    message: "The check \"" + checkName + "\" is empty. It expects " + what + ", and an empty one asserts nothing.",
  };
}

// One result per key, not one for the whole object: the Builder highlights the key that failed, and a
// single result for an object of five keys says only that one of them was wrong.
function registerPerKeyCheck(name: string, what: string, subject: string,
  getActual: (context: ISurveyTestContext, key: string) => any): void {
  SurveyTestCheckFactory.Instance.register({
    name: name,
    kinds: ["survey"],
    payloadType: "nameMap",
    payloadText: what,
    check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any):
      ISurveyTestCheckOutcome | Array<ISurveyTestCheckOutcome> => {
      const keys = Object.keys(expected);
      if (keys.length === 0) return createEmptyMapOutcome(name, what);
      return keys.map(key => {
        const outcome = createOutcome(subject + " \"" + key + "\"", getActual(context, key), expected[key]);
        outcome.expected = expected[key];
        outcome.details = { key: key };
        return outcome;
      });
    },
  });
}

registerPerKeyCheck("values", "an object that maps a question name to its expected value", "value of",
  (context: ISurveyTestContext, key: string): any => context.survey.data[key]);
registerPerKeyCheck("variables", "an object that maps a variable name to its expected value", "variable",
  (context: ISurveyTestContext, key: string): any => context.survey.getVariable(key));

SurveyTestCheckFactory.Instance.register({
  name: "noValues",
  kinds: ["survey"],
  payloadType: "stringArray",
  payloadText: "an array of question names",
  check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any):
    ISurveyTestCheckOutcome | Array<ISurveyTestCheckOutcome> => {
    const names: Array<string> = expected;
    if (names.length === 0) {
      return createEmptyMapOutcome("noValues", "an array of question names");
    }
    const data = context.survey.data;
    return names.map(name => {
      // Presence, not emptiness: a key stored as null or as an empty string is present, and the two
      // states differ for a survey that posts its data.
      const present = Object.prototype.hasOwnProperty.call(data, name);
      const actual = present ? data[name] : undefined;
      return {
        passed: !present,
        actual: actual,
        expected: undefined,
        details: { key: name, present: present },
        message: present
          ? "The survey data contains the key \"" + name + "\" with the value " + formatTestValue(actual) +
            ", and the case expects no value under this name."
          : undefined,
      };
    });
  },
});

// The one array check that compares in order: the order of the pages is what a respondent walks
// through, so a case that pins it means the order too.
SurveyTestCheckFactory.Instance.register({
  name: "pages",
  kinds: ["survey"],
  payloadType: "stringArray",
  payloadText: "an array of page names",
  check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any): ISurveyTestCheckOutcome => {
    const actual = (<any>context.survey).visiblePages.map((page: any) => page.name);
    const passed = isSameTestValue(actual, expected);
    return {
      passed: passed,
      actual: actual,
      message: passed ? undefined
        : "The survey shows the pages " + formatTestValue(actual) + ", expected " + formatTestValue(expected) +
          " in this order.",
    };
  },
});
