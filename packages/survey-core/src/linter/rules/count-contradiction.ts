import { ILintRule, LintContext } from "../rule";
import { ElementRecord, getEffectiveType } from "../symbols";
import { isDescendantOf } from "../metadata";
import { RATING_DEFAULTS, runtimeGreater, SLIDER_DEFAULTS } from "../value-domain";
import { getInputType, getSelectableChoiceCount, isComparableRangeInputType } from "../value-types";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["element/count-contradiction"];

interface CountProps { count: string, min: string, max: string }

const COUNT_PROPS: { [type: string]: CountProps } = {
  matrixdynamic: { count: "rowCount", min: "minRowCount", max: "maxRowCount" },
  paneldynamic: { count: "panelCount", min: "minPanelCount", max: "maxPanelCount" },
};

// A bound pair the runtime reconciles behind the author's back: whichever of the two is set
// last wins, so the JSON says one thing and the survey does another.
interface BoundPair {
  min: string;
  max: string;
  // the pair needs a value between the bounds, so equal bounds are a conflict too
  needsGap?: boolean;
  appliesTo(record: ElementRecord, type: string): boolean;
  read(json: any, prop: string): any;
}

function authored(json: any, prop: string): number | undefined {
  const value = json ? json[prop] : undefined;
  return typeof value === "number" && isFinite(value) ? value : undefined;
}

// A count of items, where the model reads anything below 1 as "no limit".
function readEnabledCount(json: any, prop: string): number | undefined {
  const value = authored(json, prop);
  return value !== undefined && value > 0 ? value : undefined;
}

// minimumFractionDigits/maximumFractionDigits, where the -1 default means "unset".
function readFractionDigits(json: any, prop: string): number | undefined {
  const value = authored(json, prop);
  return value !== undefined && value >= 0 ? value : undefined;
}

// A text bound is a number or a date string, so the value is taken as authored.
function readTextBound(json: any, prop: string): any {
  const value = json ? json[prop] : undefined;
  return value === undefined || value === null || value === "" ? undefined : value;
}

function isTextWithBounds(record: ElementRecord, type: string): boolean {
  if (type !== "text" && type !== "multipletextitem") return false;
  const json = record.json;
  // a bound computed at runtime is unknown while linting
  if (!json || json.minValueExpression !== undefined || json.maxValueExpression !== undefined) return false;
  return isComparableRangeInputType(getInputType(json));
}

// The rating bounds only describe the scale while the model generates it: rateValues list
// the scale themselves, and then the model reads the items instead of the bounds.
function isGeneratedRating(record: ElementRecord, type: string): boolean {
  return type === "rating" && !Array.isArray(record.json.rateValues);
}

function isSelectionLimited(record: ElementRecord, type: string): boolean {
  // ranking descends from checkbox, but reads the pair only in its select-to-rank mode
  if (isDescendantOf(type, "ranking")) return record.json.selectToRankEnabled === true;
  return isDescendantOf(type, "checkbox");
}

const BOUND_PAIRS: Array<BoundPair> = [
  {
    min: "rateMin", max: "rateMax", needsGap: true,
    appliesTo: isGeneratedRating, read: authored,
  },
  { min: "min", max: "max", appliesTo: isTextWithBounds, read: readTextBound },
  {
    min: "min", max: "max",
    appliesTo: (record, type) => type === "slider", read: authored,
  },
  {
    min: "minRangeLength", max: "maxRangeLength",
    appliesTo: (record, type) => type === "slider" && record.json.sliderType === "range",
    read: authored,
  },
  {
    min: "minSelectedChoices", max: "maxSelectedChoices",
    appliesTo: isSelectionLimited, read: readEnabledCount,
  },
  {
    min: "minimumFractionDigits", max: "maximumFractionDigits",
    appliesTo: (record, type) => type === "expression", read: readFractionDigits,
  },
  {
    min: "totalMinimumFractionDigits", max: "totalMaximumFractionDigits",
    appliesTo: record => record.kind === "column", read: readFractionDigits,
  },
];

// A step has to fit inside the range it steps through; both scales default to a real range,
// which the control offers whether the JSON states it or not.
interface StepDef {
  step: string;
  min: string;
  max: string;
  defaults: { min: number, max: number };
  appliesTo(record: ElementRecord, type: string): boolean;
}

const STEP_DEFS: Array<StepDef> = [
  {
    step: "rateStep", min: "rateMin", max: "rateMax", defaults: RATING_DEFAULTS,
    // with rateCount the model computes the maximum out of the step, so the two always fit
    appliesTo: (record, type) => isGeneratedRating(record, type) && record.json.rateCount === undefined,
  },
  {
    step: "step", min: "min", max: "max", defaults: SLIDER_DEFAULTS,
    appliesTo: (record, type) => type === "slider",
  },
];

function checkSteps(ctx: LintContext, record: ElementRecord, type: string): void {
  STEP_DEFS.forEach(def => {
    if (!def.appliesTo(record, type)) return;
    const step = authored(record.json, def.step);
    if (step === undefined || step <= 0) return;
    const min = authored(record.json, def.min);
    const max = authored(record.json, def.max);
    const range = (max !== undefined ? max : def.defaults.max) - (min !== undefined ? min : def.defaults.min);
    if (step <= range) return;
    ctx.report({
      message: "The " + def.step + " of \"" + record.name + "\" is " + step +
        ", above the whole range " + def.max + " - " + def.min + " of " + range +
        " - the runtime clamps it.",
      path: record.path + "." + def.step,
      reason: reasons.stepAboveRange,
      messageData: {
        name: record.name, questionType: record.type,
        stepProp: def.step, step: step, minProp: def.min, maxProp: def.max, range: range,
      },
      elementName: record.name,
      elementType: record.type,
    });
  });
}

// The bound rateCount is clamped to (question_rating.ts): never below two, and never above the
// settings maximum - which listed rateValues lift, since they are the scale then.
function getRateCountBound(record: ElementRecord, count: number, maxCount: number): number | undefined {
  if (count < 2) return 2;
  const rateValues = record.json.rateValues;
  const listed = Array.isArray(rateValues) ? rateValues.length : 0;
  if (count > maxCount && count > listed) return maxCount;
  if (count > 10 && record.json.rateType === "smileys") return 10;
  return undefined;
}

function checkRateCount(ctx: LintContext, record: ElementRecord, type: string): void {
  if (type !== "rating") return;
  const count = authored(record.json, "rateCount");
  if (count === undefined) return;
  const bound = getRateCountBound(record, count, ctx.index.settings.ratingMaximumRateValueCount);
  if (bound === undefined) return;
  ctx.report({
    message: "The rateCount of \"" + record.name + "\" is " + count + ", " +
      (count < bound ? "below" : "above") + " the " + (count < bound ? "minimum" : "maximum") +
      " of " + bound + " - the runtime clamps it.",
    path: record.path + ".rateCount",
    reason: reasons.countOutOfBounds,
    messageData: {
      name: record.name, questionType: record.type,
      countProp: "rateCount", count: count, bound: bound,
    },
    elementName: record.name,
    elementType: record.type,
  });
}

function checkMinSelectedChoices(ctx: LintContext, record: ElementRecord, type: string): void {
  if (!isSelectionLimited(record, type)) return;
  const min = readEnabledCount(record.json, "minSelectedChoices");
  if (min === undefined) return;
  const selectable = getSelectableChoiceCount(record);
  if (selectable === undefined || min <= selectable) return;
  ctx.report({
    message: "The minSelectedChoices of \"" + record.name + "\" is " + min + ", above the " +
      selectable + " choices that can be selected together - the question can never be answered.",
    path: record.path + ".minSelectedChoices",
    reason: reasons.minAboveChoicesCount,
    messageData: {
      name: record.name, questionType: record.type,
      minProp: "minSelectedChoices", min: min, selectable: selectable,
    },
    elementName: record.name,
    elementType: record.type,
  });
}

function isAbove(min: any, max: any): boolean {
  if (typeof min === "number" && typeof max === "number") return min > max;
  return runtimeGreater(min, max);
}

function checkBoundPairs(ctx: LintContext, record: ElementRecord, type: string): void {
  BOUND_PAIRS.forEach(pair => {
    const json = record.json;
    if (!pair.appliesTo(record, type)) return;
    const min = pair.read(json, pair.min);
    const max = pair.read(json, pair.max);
    if (min === undefined || max === undefined) return;
    const above = isAbove(min, max);
    if (!above && !(pair.needsGap && !isAbove(max, min))) return;
    ctx.report({
      message: "The " + pair.min + " of \"" + record.name + "\" is " + min + ", " +
        (above ? "above" : "equal to") + " its " + pair.max + " of " + max +
        " - the runtime silently adjusts one of them.",
      path: record.path + "." + pair.min,
      reason: reasons.minAboveMax,
      messageData: {
        name: record.name, questionType: record.type,
        minProp: pair.min, maxProp: pair.max, min: min, max: max,
      },
      elementName: record.name,
      elementType: record.type,
    });
  });
}

// The setters' own normalization (question_matrixdynamic.ts, question_paneldynamic.ts):
// a negative minimum reads as 0, a non-positive maximum as 1. Comparing normalized values
// keeps the rule silent where the runtime already agrees with the author.
function normMin(value: number): number { return value < 0 ? 0 : value; }
function normMax(value: number): number { return value <= 0 ? 1 : value; }

// Only numbers the author actually wrote conflict: the model defaults are reconciled by the
// setters silently and never contradict anything on their own.
function checkRecord(ctx: LintContext, record: ElementRecord): void {
  const props = COUNT_PROPS[getEffectiveType(record)];
  if (!props || record.kind !== "question") return;
  const min = authored(record.json, props.min);
  const max = authored(record.json, props.max);
  const count = authored(record.json, props.count);
  if (min !== undefined && max !== undefined && normMin(min) > normMax(max)) {
    ctx.report({
      message: "The " + props.min + " of \"" + record.name + "\" is " + min + ", above its " +
        props.max + " of " + max + " - the runtime silently adjusts one of them.",
      path: record.path + "." + props.min,
      reason: reasons.minAboveMax,
      messageData: {
        name: record.name, questionType: record.type,
        minProp: props.min, maxProp: props.max, min: min, max: max,
      },
      elementName: record.name,
      elementType: record.type,
    });
  }
  if (count === undefined) return;
  const belowMin = min !== undefined && count < normMin(min);
  const aboveMax = max !== undefined && count > normMax(max);
  if (!belowMin && !aboveMax) return;
  const boundProp = belowMin ? props.min : props.max;
  const bound = belowMin ? normMin(min) : normMax(max);
  ctx.report({
    message: "The " + props.count + " of \"" + record.name + "\" is " + count + ", " +
      (belowMin ? "below" : "above") + " its " + boundProp + " of " + bound +
      " - the runtime clamps it.",
    path: record.path + "." + props.count,
    reason: reasons.countOutOfBounds,
    messageData: {
      name: record.name, questionType: record.type,
      countProp: props.count, boundProp: boundProp, count: count, bound: bound,
    },
    elementName: record.name,
    elementType: record.type,
  });
}

export const elementCountContradictionRule: ILintRule = {
  id: "element/count-contradiction",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.index.allElements.forEach(record => {
      if (!record.json) return;
      const type = getEffectiveType(record);
      checkRecord(ctx, record);
      checkBoundPairs(ctx, record, type);
      checkSteps(ctx, record, type);
      checkRateCount(ctx, record, type);
      checkMinSelectedChoices(ctx, record, type);
    });
  },
};
