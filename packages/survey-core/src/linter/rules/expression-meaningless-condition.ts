import { ILintRule, LintContext } from "../rule";
import { getConditionSemanticsVerdict } from "../expression-utils";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["expression/meaningless-condition"];

function getMessage(reason: string, prop: string, text: string): string {
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

// The semantic defects of a condition that the core's own check reports and that are not
// contradictions: the result is known upfront, or the expression is not a condition at all.
// Together with expression/contradiction this covers ExpressionErrorType.SemanticError, the one
// type of Base.validateExpressions the linter did not report.
export const expressionMeaninglessConditionRule: ILintRule = {
  id: "expression/meaningless-condition",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.index.expressionSites.forEach(site => {
      const verdict = getConditionSemanticsVerdict(site);
      if (!verdict || verdict === "alwaysFalse") return;
      const messageData: { [key: string]: any } = { expression: site.text, prop: site.prop };
      if (verdict === reasons.alwaysTrue) messageData.value = true;
      ctx.report({
        message: getMessage(verdict, site.prop, site.text),
        path: site.path,
        reason: verdict,
        messageData: messageData,
        elementName: site.owner ? site.owner.name : undefined,
        elementType: site.owner ? site.owner.type : undefined,
      });
    });
  },
};
