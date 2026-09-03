import { ILintRule, LintContext } from "../rule";
import { forEachValidator, getValidatorOwnerType, ValidatorEntry } from "../validator-utils";
import { isComponentType } from "../metadata";
import { ValueTypeInfo } from "../symbols";
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

// Which value shapes a validator can actually check. This is behaviour, not the Creator's
// settings.supportedValidators table: that one leaves out pairs the runtime handles fine (a
// regex validator reads a number as its digits), and a validator outside it runs anyway.
// Every entry here is pinned against a live model in linter-runtime-parity.tests.ts.
type ValidatorEffect = "neverFires" | "rejectsEveryAnswer";

// what the runtime does, one key per branch below: the message spells it out in English,
// while a host that localizes reads the key out of messageData.cause
type ValidatorCause = "noAnswer" | "textLength" | "notANumber" | "numberVsEmail" | "notAList";

interface ShapeVerdict {
  effect: ValidatorEffect;
  cause: ValidatorCause;
  // what the runtime does, as the message says it
  because: string;
}

// A length check reads value.length: undefined on a number, so the comparison never holds.
function textVerdict(entry: ValidatorEntry, value: ValueTypeInfo): ShapeVerdict | undefined {
  const hasLengthBound = entry.json.minLength > 0 || entry.json.maxLength > 0;
  if (!hasLengthBound) return undefined;
  if (value.shape === "object" || (value.shape === "scalar" && value.scalarType === "number")) {
    return {
      effect: "neverFires", cause: "textLength",
      because: "a length is read off a text value, and this answer has none",
    };
  }
  return undefined;
}

// Helpers.isNumber says no to every array of more than one value and to every object, and the
// validator answers that with RequreNumericError.
function numericVerdict(value: ValueTypeInfo): ShapeVerdict | undefined {
  if (value.shape !== "array" && value.shape !== "object") return undefined;
  return {
    effect: "rejectsEveryAnswer", cause: "notANumber",
    because: "the answer is not a number and never can be",
  };
}

// The email pattern is tested against the value as text; digits never match it.
function emailVerdict(value: ValueTypeInfo): ShapeVerdict | undefined {
  if (value.shape !== "scalar" || value.scalarType !== "number") return undefined;
  return {
    effect: "rejectsEveryAnswer", cause: "numberVsEmail",
    because: "a number never matches an e-mail address",
  };
}

// AnswerCountValidator returns at once for anything that is not an array.
function answerCountVerdict(value: ValueTypeInfo): ShapeVerdict | undefined {
  if (value.shape === "array" || value.shape === "unknown") return undefined;
  return {
    effect: "neverFires", cause: "notAList",
    because: "the answer is not a list of values",
  };
}

function getShapeVerdict(entry: ValidatorEntry, type: string, value: ValueTypeInfo): ShapeVerdict | undefined {
  // a question that holds no value runs no validator at all
  if (value.shape === "none") {
    return {
      effect: "neverFires", cause: "noAnswer",
      because: "the question holds no answer to validate",
    };
  }
  if (type === "text") return textVerdict(entry, value);
  if (type === "numeric") return numericVerdict(value);
  if (type === "email") return emailVerdict(value);
  if (type === "answercount") return answerCountVerdict(value);
  // regex reads any value as text, and expression does not look at the answer's shape
  return undefined;
}

function checkValueShape(ctx: LintContext, entry: ValidatorEntry, type: string): void {
  const owner = entry.owner;
  // what a component does with its value is its own business
  if (owner.isUnknownType || !!owner.componentDef) return;
  const questionType = getValidatorOwnerType(owner);
  if (isComponentType(questionType)) return;
  const value = owner.valueType;
  if (!value) return;
  const verdict = getShapeVerdict(entry, type, value);
  if (!verdict) return;
  const inputType = questionType === "text" ? getInputType(owner.json) : undefined;
  report(ctx, entry,
    "The " + type + " validator of \"" + owner.name + "\" " +
    (verdict.effect === "neverFires" ? "never fires" : "rejects every answer") + ": " +
    verdict.because + " (" + questionType +
    (inputType ? ", inputType \"" + inputType + "\"" : "") + ").",
    reasons.wrongValueShape,
    {
      questionType: questionType, inputType: inputType,
      valueShape: value.shape, scalarType: value.scalarType,
      effect: verdict.effect, cause: verdict.cause,
    });
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
      checkValueShape(ctx, entry, type);
      checkBounds(ctx, entry, type);
      checkAnswerCount(ctx, entry, type);
      checkRegex(ctx, entry, type);
      checkExpression(ctx, entry, type);
    });
  },
};
