import { ILintRule, LintContext } from "../rule";
import { ExpressionSite } from "../symbols";
import { classifyFunctionArgRefs, getVariableOperands } from "../expression-utils";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["expression/no-reference"];

// A condition that reads no question, calculated value or variable: "false", "true",
// "today() > '2026-12-31'". Off by default - a lone "false" is how an author switches an element
// off (see "Relation to Base.validateExpressions" in the README). A host turns it on where a
// constant condition is suspect, e.g. for a condition an AI wrote. The message does not claim
// the result never changes: today(), now() or a custom function can still change it.
export const expressionNoReferenceRule: ILintRule = {
  id: "expression/no-reference",
  defaultSeverity: "off",
  run(ctx: LintContext): void {
    ctx.forEachSite("condition", (site: ExpressionSite) => {
      // an inArray filter or an iif() branch condition is no gate of its own
      if (!!site.inArrayOf || !!site.subOf || !!site.synthesized) return;
      if (getVariableOperands(site.ast).length > 0) return;
      // isContainerReady('page1'), displayValue('q1'): an element named as a string is read too
      if (classifyFunctionArgRefs(site, ctx.index, ctx.options).length > 0) return;
      // "1 = 1", "1 = 2": expression/meaningless-condition or expression/contradiction already
      // names the more specific defect
      if (!!ctx.getConditionVerdict(site).verdict) return;
      ctx.reportAtSite(site, {
        message: "The " + site.prop + " \"" + site.text + "\" does not read any question or variable.",
        reason: reasons.noReference,
        messageData: { expression: site.text, prop: site.prop },
      });
    });
  },
};
