import { ILintRule, LintContext } from "../rule";

export const expressionSyntaxRule: ILintRule = {
  id: "expression/syntax",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.index.expressionSites.forEach(site => {
      if (!site.parseError) return;
      const at = site.parseError.at;
      let message = "The expression \"" + site.text + "\" cannot be parsed";
      if (typeof at === "number") message += " (at position " + at + ")";
      message += ".";
      if (site.synthesized) {
        message += " It was built from the trigger's legacy name/operator/value properties.";
      }
      ctx.report({
        message: message,
        path: site.path,
        messageData: {
          expression: site.text,
          at: at,
          detail: site.parseError.message,
          synthesized: site.synthesized === true,
        },
        elementName: site.owner ? site.owner.name : undefined,
        elementType: site.owner ? site.owner.type : undefined,
      });
    });
  },
};
