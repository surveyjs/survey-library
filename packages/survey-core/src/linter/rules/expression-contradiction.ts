import { ILintRule, LintContext } from "../rule";
import { ExpressionSite } from "../symbols";
import { hasBound, isAlwaysFalseVerdict, verdictToReason } from "../expression-utils";
import { quoteValue } from "../message-utils";
import { describeConstants, toConstantsData, toConstantsRelated } from "../constant-env";
import { FoldedCondition } from "../condition-eval";
import { ConditionConflict } from "../satisfiability";
import { ValueRangeDomain } from "../value-domain";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["expression/contradiction"];

function describeRanges(ranges: Array<ValueRangeDomain>): string {
  return ranges.map(range => {
    const bounds: Array<string> = [];
    if (hasBound(range.min)) bounds.push("at least " + quoteValue(range.min));
    if (hasBound(range.max)) bounds.push("at most " + quoteValue(range.max));
    return "{" + range.record.name + "} is " + bounds.join(" and ");
  }).join(", ");
}

function toRangesData(ranges: Array<ValueRangeDomain>): Array<any> {
  return ranges.map(range => {
    const res: { [key: string]: any } = { name: range.record.name };
    if (range.min !== undefined) res.min = range.min;
    if (range.max !== undefined) res.max = range.max;
    return res;
  });
}

function describeConflicts(conflicts: Array<ConditionConflict>): string {
  return conflicts.map(conflict => {
    const values = (conflict.values || []).map(quoteValue);
    if (conflict.kind === "equalValues") {
      return "{" + conflict.name + "} cannot be both " + values.join(" and ");
    }
    if (conflict.kind === "equalAndNotEqual") {
      return "{" + conflict.name + "} cannot be " + values[0] + " and not be it";
    }
    if (conflict.kind === "emptyAndValue") {
      return "{" + conflict.name + "} cannot be empty and be " + values[0];
    }
    if (conflict.kind === "impossibleBounds") {
      return "{" + conflict.name + "} cannot be above " + values[0] + " and below " + values[1];
    }
    if (conflict.kind === "emptySet") {
      return "{" + conflict.name + "} is asked to be one of no value at all";
    }
    return "{" + conflict.name + "} cannot be empty and not empty";
  }).join(", ");
}

function getMessage(site: ExpressionSite, fold?: FoldedCondition): string {
  // an iif() condition guards a branch of its expression, not an element
  const subject = site.subOf
    ? "The iif() condition \"" + site.text + "\" in the " + site.subOf.prop
    : "The " + site.prop + " \"" + site.text + "\"";
  const consequence = site.subOf
    ? "its first branch is never taken"
    : "the element it guards is never shown";
  if (!fold) {
    return subject + " is built from constants only and is always false," +
      " so it never holds - " + consequence + ".";
  }
  const facts = [
    describeConflicts(fold.conflicts), describeRanges(fold.ranges), describeConstants(fold.used),
  ].filter(part => !!part);
  return subject + " never holds: " + facts.join(", ") + ", so " + consequence + ".";
}

function getRelated(fold: FoldedCondition): Array<{ path: string, elementName: string }> {
  return toConstantsRelated(fold.used).concat(fold.ranges.map(range =>
    ({ path: range.record.path, elementName: range.record.name })));
}

// The reachability group of the linter issue asks for "a condition parses but can never evaluate
// true". Only the decidable part of that is implemented here - a condition whose operands are all
// known at authoring time, either written inline or reached through a reference to a constant
// source, evaluated at lint time. Reasoning about satisfiability ("{q} = 'a' and {q} = 'b'")
// extends this same rule later, with its own reason.
export const expressionContradictionRule: ILintRule = {
  id: "expression/contradiction",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const check = (site: ExpressionSite) => {
      const { verdict, fold } = ctx.getConditionVerdict(site);
      if (!isAlwaysFalseVerdict(verdict)) return;
      const messageData: { [key: string]: any } = {
        expression: site.text,
        prop: site.prop,
        value: false,
      };
      if (!!site.subOf) messageData.parentExpression = site.subOf.text;
      if (!!fold && fold.used.length > 0) messageData.constants = toConstantsData(fold.used);
      if (!!fold && fold.ranges.length > 0) messageData.ranges = toRangesData(fold.ranges);
      if (!!fold && fold.conflicts.length > 0) messageData.conflicts = fold.conflicts;
      ctx.reportAtSite(site, {
        message: getMessage(site, fold),
        reason: verdictToReason(verdict),
        messageData: messageData,
        related: !!fold ? getRelated(fold) : undefined,
      });
    };
    ctx.forEachSite("condition", check);
    ctx.forEachIifCondition(check);
  },
};
