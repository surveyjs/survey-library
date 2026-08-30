import { ILintRule, LintContext } from "../rule";
import { isAlwaysFalseVerdict } from "../expression-utils";
import { describeConstants, toConstantsData, toConstantsRelated } from "../constant-env";
import { FoldedCondition } from "../condition-eval";
import { ConditionConflict } from "../satisfiability";
import { ValueRangeDomain } from "../value-domain";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["expression/contradiction"];

function describeRanges(ranges: Array<ValueRangeDomain>): string {
  return ranges.map(range => {
    const bounds: Array<string> = [];
    if (range.min !== undefined && range.min !== null && range.min !== "") bounds.push("at least " + JSON.stringify(range.min));
    if (range.max !== undefined && range.max !== null && range.max !== "") bounds.push("at most " + JSON.stringify(range.max));
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
    const values = (conflict.values || []).map(value => JSON.stringify(value));
    if (conflict.kind === "equalValues") {
      return "{" + conflict.name + "} cannot be both " + values.join(" and ");
    }
    if (conflict.kind === "equalAndNotEqual") {
      return "{" + conflict.name + "} cannot be " + values[0] + " and not be it";
    }
    if (conflict.kind === "emptyAndValue") {
      return "{" + conflict.name + "} cannot be empty and be " + values[0];
    }
    return "{" + conflict.name + "} cannot be empty and not empty";
  }).join(", ");
}

function getReason(verdict: string): string {
  if (verdict === "unsatisfiable") return reasons.unsatisfiable;
  if (verdict === "outOfRange") return reasons.outOfRange;
  return verdict === "alwaysFalseViaConstants" ? reasons.alwaysFalseViaConstants : reasons.alwaysFalse;
}

function getMessage(prop: string, text: string, fold?: FoldedCondition): string {
  if (!fold) {
    return "The " + prop + " \"" + text + "\" is built from constants only and is always false," +
      " so it never holds - the element it guards is never shown.";
  }
  const facts = [
    describeConflicts(fold.conflicts), describeRanges(fold.ranges), describeConstants(fold.used),
  ].filter(part => !!part);
  return "The " + prop + " \"" + text + "\" never holds: " + facts.join(", ") +
    ", so the element it guards is never shown.";
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
    ctx.index.expressionSites.forEach(site => {
      const { verdict, fold } = ctx.getConditionVerdict(site);
      if (!isAlwaysFalseVerdict(verdict)) return;
      const messageData: { [key: string]: any } = {
        expression: site.text,
        prop: site.prop,
        value: false,
      };
      if (!!fold && fold.used.length > 0) messageData.constants = toConstantsData(fold.used);
      if (!!fold && fold.ranges.length > 0) messageData.ranges = toRangesData(fold.ranges);
      if (!!fold && fold.conflicts.length > 0) messageData.conflicts = fold.conflicts;
      ctx.report({
        message: getMessage(site.prop, site.text, fold),
        path: site.path,
        reason: getReason(verdict),
        messageData: messageData,
        elementName: site.owner ? site.owner.name : undefined,
        elementType: site.owner ? site.owner.type : undefined,
        related: !!fold ? getRelated(fold) : undefined,
      });
    });
  },
};
