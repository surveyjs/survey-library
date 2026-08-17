import { FunctionFactory } from "../../functionsfactory";
import { ILintRule, LintContext } from "../rule";
import { getFunctionOperands } from "../expression-utils";
import { closestMatch } from "../levenshtein";

export const expressionUnknownFunctionRule: ILintRule = {
  id: "expression/unknown-function",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const known = Array.isArray(ctx.options.knownFunctions) ? ctx.options.knownFunctions : [];
    const isKnown = (name: string): boolean => {
      if (FunctionFactory.Instance.hasFunction(name)) return true;
      return known.indexOf(name) > -1;
    };
    const candidates = FunctionFactory.Instance.getAll().concat(known);
    ctx.index.expressionSites.forEach(site => {
      if (!site.ast) return;
      getFunctionOperands(site.ast).forEach(fn => {
        const name = fn.functionName;
        if (!name || isKnown(name)) return;
        const suggestion = closestMatch(name, candidates);
        let message = "The function \"" + name + "\" is not registered (in \"" + site.text + "\").";
        message += suggestion
          ? " Did you mean \"" + suggestion + "\"?"
          : " If it is a custom function registered at runtime, list it in options.knownFunctions.";
        ctx.report({
          message: message,
          path: site.path,
          messageData: { functionName: name, expression: site.text },
          elementName: site.owner ? site.owner.name : undefined,
          elementType: site.owner ? site.owner.type : undefined,
          suggestion: suggestion,
        });
      });
    });
  },
};
