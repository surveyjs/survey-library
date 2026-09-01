import { ILintRule, LintContext } from "../rule";
import { forEachValidator, getSupportedValidators, getValidatorOwnerType, ValidatorEntry } from "../validator-utils";
import { isComponentType } from "../metadata";
import { getInputType, getSelectableChoiceCount } from "../value-types";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["validator/dead"];

interface ValidatorBoundPair { min: string, max: string, enabledOnly?: boolean }

// The bounds each validator compares an answer against. minLength/maxLength and the answer
// counts read anything below 1 as "no bound", so only a written pair can contradict itself.
const BOUND_PAIRS: { [validatorType: string]: ValidatorBoundPair } = {
  numeric: { min: "minValue", max: "maxValue" },
  text: { min: "minLength", max: "maxLength", enabledOnly: true },
  answercount: { min: "minCount", max: "maxCount", enabledOnly: true },
};

function readBound(json: any, prop: string, enabledOnly: boolean): number | undefined {
  const value = json[prop];
  if (typeof value !== "number" || !isFinite(value)) return undefined;
  return enabledOnly && value <= 0 ? undefined : value;
}

function report(ctx: LintContext, entry: ValidatorEntry, message: string, reason: string,
  messageData: { [key: string]: any }): void {
  ctx.report({
    message: message,
    path: entry.path,
    reason: reason,
    messageData: { ...messageData, validatorType: entry.type, name: entry.owner.name },
    elementName: entry.owner.name,
    elementType: entry.owner.type,
  });
}

// A validator the question does not support runs anyway: depending on the pair, it either
// rejects every answer or never fires - and either way it is not the check that was meant.
function checkSupported(ctx: LintContext, entry: ValidatorEntry, type: string): void {
  const owner = entry.owner;
  // what a component does with a value is its own business, so the core's table says nothing
  if (owner.isUnknownType || !!owner.componentDef) return;
  const questionType = getValidatorOwnerType(owner);
  if (isComponentType(questionType)) return;
  const supported = getSupportedValidators(owner, ctx.index.settings);
  if (supported.indexOf(type) > -1) return;
  const inputType = questionType === "text" ? getInputType(owner.json) : undefined;
  report(ctx, entry,
    "A \"" + type + "\" validator is attached to \"" + owner.name + "\" (" + questionType +
    (inputType ? ", inputType \"" + inputType + "\"" : "") +
    "), which does not support it - it either never fires or rejects every answer.",
    reasons.unsupportedForQuestion,
    { questionType: questionType, inputType: inputType, supported: supported });
}

function checkBounds(ctx: LintContext, entry: ValidatorEntry, type: string): void {
  const pair = BOUND_PAIRS[type];
  if (!pair) return;
  const min = readBound(entry.json, pair.min, pair.enabledOnly === true);
  const max = readBound(entry.json, pair.max, pair.enabledOnly === true);
  if (min === undefined || max === undefined || min <= max) return;
  report(ctx, entry,
    "The " + type + " validator of \"" + entry.owner.name + "\" requires at least " + min +
    " and at most " + max + " - no answer satisfies it.",
    reasons.minAboveMax,
    { minProp: pair.min, maxProp: pair.max, min: min, max: max });
}

function checkAnswerCount(ctx: LintContext, entry: ValidatorEntry, type: string): void {
  if (type !== "answercount") return;
  const min = readBound(entry.json, "minCount", true);
  if (min === undefined) return;
  const selectable = getSelectableChoiceCount(entry.owner);
  if (selectable === undefined || min <= selectable) return;
  report(ctx, entry,
    "The answercount validator of \"" + entry.owner.name + "\" requires at least " + min +
    " answers, above the " + selectable + " choices that can be selected together.",
    reasons.minCountAboveChoices,
    { minCount: min, selectable: selectable });
}

function checkRegex(ctx: LintContext, entry: ValidatorEntry, type: string): void {
  if (type !== "regex") return;
  const regex = entry.json.regex;
  if (typeof regex !== "string" || !regex) return;
  try {
    // the very call the validator makes while validating, where the throw would surface
    new RegExp(regex, entry.json.caseInsensitive === true || entry.json.insensitive === true ? "i" : "");
  } catch(e) {
    report(ctx, entry,
      "The regex validator of \"" + entry.owner.name + "\" has a pattern the engine rejects: " +
      (e && e.message ? e.message : String(e)) + ".",
      reasons.invalidRegex,
      { regex: regex, error: e && e.message ? e.message : String(e) });
  }
}

// ensureConditionRunner returns false for an empty expression, and the validator reports no
// error at all: the message it carries can never be shown.
function checkExpression(ctx: LintContext, entry: ValidatorEntry, type: string): void {
  if (type !== "expression") return;
  const expression = entry.json.expression;
  if (typeof expression === "string" && !!expression.trim()) return;
  report(ctx, entry,
    "The expression validator of \"" + entry.owner.name +
    "\" has no expression, so it always passes.",
    reasons.emptyExpression, {});
}

export const validatorDeadRule: ILintRule = {
  id: "validator/dead",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    forEachValidator(ctx, entry => {
      // an unresolvable type is dropped whole, which validator/unknown-type reports
      if (!ctx.metadata.getValidatorClass(entry.type)) return;
      const type = ctx.metadata.normalizeValidatorType(entry.type);
      checkSupported(ctx, entry, type);
      checkBounds(ctx, entry, type);
      checkAnswerCount(ctx, entry, type);
      checkRegex(ctx, entry, type);
      checkExpression(ctx, entry, type);
    });
  },
};
