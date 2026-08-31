import { ILintRule, LintContext } from "../rule";
import { ElementRecord, getEffectiveType } from "../symbols";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["element/count-contradiction"];

interface CountProps { count: string, min: string, max: string }

const COUNT_PROPS: { [type: string]: CountProps } = {
  matrixdynamic: { count: "rowCount", min: "minRowCount", max: "maxRowCount" },
  paneldynamic: { count: "panelCount", min: "minPanelCount", max: "maxPanelCount" },
};

function authored(json: any, prop: string): number | undefined {
  const value = json ? json[prop] : undefined;
  return typeof value === "number" && isFinite(value) ? value : undefined;
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
    ctx.index.allElements.forEach(record => checkRecord(ctx, record));
  },
};
