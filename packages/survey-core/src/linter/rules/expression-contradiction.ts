import { ILintRule, LintContext } from "../rule";
import { describeConstants, toConstantsData, toConstantsRelated } from "../constant-env";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["expression/contradiction"];

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
      if (verdict !== "alwaysFalse" && verdict !== "alwaysFalseViaConstants") return;
      const messageData: { [key: string]: any } = {
        expression: site.text,
        prop: site.prop,
        value: false,
      };
      if (!!fold) messageData.constants = toConstantsData(fold.used);
      ctx.report({
        message: !!fold
          ? "The " + site.prop + " \"" + site.text + "\" never holds: " +
            describeConstants(fold.used) + ", so the element it guards is never shown."
          : "The " + site.prop + " \"" + site.text + "\" is built from constants only and is" +
            " always false, so it never holds - the element it guards is never shown.",
        path: site.path,
        reason: !!fold ? reasons.alwaysFalseViaConstants : reasons.alwaysFalse,
        messageData: messageData,
        elementName: site.owner ? site.owner.name : undefined,
        elementType: site.owner ? site.owner.type : undefined,
        related: !!fold ? toConstantsRelated(fold.used) : undefined,
      });
    });
  },
};
