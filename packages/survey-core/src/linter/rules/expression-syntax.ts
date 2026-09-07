import { ILintRule, LintContext } from "../rule";
import { SurveyLintReasons } from "../reasons";

export const expressionSyntaxRule: ILintRule = {
  id: "expression/syntax",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.forEachSite("unparsable", site => {
      const at = site.parseError.at;
      let message = "The expression \"" + site.text + "\" cannot be parsed";
      if (typeof at === "number") message += " (at position " + at + ")";
      message += ".";
      if (site.synthesized) {
        message += " It was built from the trigger's legacy name/operator/value properties.";
      }
      ctx.reportAtSite(site, {
        message: message,
        reason: SurveyLintReasons["expression/syntax"].unparsable,
        messageData: {
          expression: site.text,
          at: at,
          detail: site.parseError.message,
          synthesized: site.synthesized === true,
        },
      });
    });
  },
};
