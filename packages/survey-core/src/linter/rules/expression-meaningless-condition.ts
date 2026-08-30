import { ILintRule, LintContext } from "../rule";
import { isAlwaysFalseVerdict } from "../expression-utils";
import {
  ConstantSource, describeConstants, toConstantsData, toConstantsRelated,
} from "../constant-env";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["expression/meaningless-condition"];

function getMessage(reason: string, prop: string, text: string, used?: Array<ConstantSource>): string {
  if (reason === reasons.alwaysTrueViaConstants) {
    return "The " + prop + " \"" + text + "\" always holds: " + describeConstants(used) +
      ", so it decides nothing - remove it.";
  }
  if (reason === reasons.alwaysTrue) {
    return "The " + prop + " \"" + text + "\" is built from constants only and is always true," +
      " so it decides nothing - remove it.";
  }
  if (reason === reasons.notABoolean) {
    return "The " + prop + " \"" + text + "\" is arithmetic, not a comparison, so it never" +
      " produces a boolean result.";
  }
  return "A part of the " + prop + " \"" + text + "\" has a result known upfront - a constant" +
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
    ctx.index.expressionSites.forEach(site => {
      const { verdict, fold } = ctx.getConditionVerdict(site);
      if (!verdict || isAlwaysFalseVerdict(verdict)) return;
      const messageData: { [key: string]: any } = { expression: site.text, prop: site.prop };
      if (verdict === reasons.alwaysTrue || verdict === reasons.alwaysTrueViaConstants) {
        messageData.value = true;
      }
      if (!!fold) messageData.constants = toConstantsData(fold.used);
      ctx.report({
        message: getMessage(verdict, site.prop, site.text, !!fold ? fold.used : undefined),
        path: site.path,
        reason: verdict,
        messageData: messageData,
        elementName: site.owner ? site.owner.name : undefined,
        elementType: site.owner ? site.owner.type : undefined,
        related: !!fold ? toConstantsRelated(fold.used) : undefined,
      });
    });
  },
};
