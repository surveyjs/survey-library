import { ILintRule, LintContext } from "../rule";
import { getConditionSemanticsVerdict } from "../expression-utils";
import { SurveyLintReasons } from "../reasons";

// The reachability group of the linter issue asks for "a condition parses but can never evaluate
// true". Only the decidable part of that is implemented here - a condition built entirely from
// constants, evaluated at lint time. Reasoning about satisfiability ("{q} = 'a' and {q} = 'b'")
// extends this same rule later, with its own reason.
export const expressionContradictionRule: ILintRule = {
  id: "expression/contradiction",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.index.expressionSites.forEach(site => {
      if (getConditionSemanticsVerdict(site) !== "alwaysFalse") return;
      ctx.report({
        message: "The " + site.prop + " \"" + site.text + "\" is built from constants only and is" +
          " always false, so it never holds - the element it guards is never shown.",
        path: site.path,
        reason: SurveyLintReasons["expression/contradiction"].alwaysFalse,
        messageData: {
          expression: site.text,
          prop: site.prop,
          value: false,
        },
        elementName: site.owner ? site.owner.name : undefined,
        elementType: site.owner ? site.owner.type : undefined,
      });
    });
  },
};
