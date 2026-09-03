import { ILintRule, LintContext } from "../rule";
import { ExpressionSite } from "../symbols";
import {
  ConditionSemanticsVerdict, isAlwaysFalseVerdict, verdictToReason,
} from "../expression-utils";
import {
  ConstantSource, describeConstants, toConstantsData, toConstantsRelated,
} from "../constant-env";

function getMessage(verdict: ConditionSemanticsVerdict, site: ExpressionSite,
  used?: Array<ConstantSource>): string {
  // an iif() condition decides a branch of its expression, not whether an element shows
  const subject = site.subOf
    ? "the iif() condition \"" + site.text + "\" in the " + site.subOf.prop
    : "the " + site.prop + " \"" + site.text + "\"";
  const capitalized = "T" + subject.substring(1);
  const alwaysTrueTail = site.subOf
    ? " - only its first branch is ever taken."
    : ", so it decides nothing - remove it.";
  if (verdict === "alwaysTrueViaConstants") {
    return capitalized + " always holds: " + describeConstants(used) + alwaysTrueTail;
  }
  if (verdict === "alwaysTrue") {
    return capitalized + " is built from constants only and is always true" + alwaysTrueTail;
  }
  if (verdict === "notABoolean") {
    return capitalized + " is arithmetic, not a comparison, so it never" +
      " produces a boolean result.";
  }
  return "A part of " + subject + " has a result known upfront - a constant" +
    " branch, a comparison of two constants, or an operand compared with itself.";
}

// The semantic defects of a condition that are not contradictions: the result is known upfront,
// or the expression is not a condition at all. Together with expression/contradiction this covers
// ExpressionErrorType.SemanticError, the one type of Base.validateExpressions the linter did not
// report, plus the same defects reached through a reference to a constant source.
export const expressionMeaninglessConditionRule: ILintRule = {
  id: "expression/meaningless-condition",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const check = (site: ExpressionSite) => {
      const { verdict, fold } = ctx.getConditionVerdict(site);
      if (!verdict || isAlwaysFalseVerdict(verdict)) return;
      const messageData: { [key: string]: any } = { expression: site.text, prop: site.prop };
      if (!!site.subOf) messageData.parentExpression = site.subOf.text;
      if (verdict === "alwaysTrue" || verdict === "alwaysTrueViaConstants") {
        messageData.value = true;
      }
      if (!!fold) messageData.constants = toConstantsData(fold.used);
      ctx.reportAtSite(site, {
        message: getMessage(verdict, site, !!fold ? fold.used : undefined),
        reason: verdictToReason(verdict),
        messageData: messageData,
        related: !!fold ? toConstantsRelated(fold.used) : undefined,
      });
    };
    ctx.forEachSite("condition", check);
    ctx.forEachIifCondition(check);
  },
};
