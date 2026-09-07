import { FunctionFactory } from "survey-core";
import { ILintRule, LintContext } from "../rule";
import { getFunctionOperands } from "../expression-utils";
import { closestMatch } from "../levenshtein";
import { didYouMean } from "../message-utils";
import { SurveyLintReasons } from "../reasons";

export const expressionUnknownFunctionRule: ILintRule = {
  id: "expression/unknown-function",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const functions = FunctionFactory.Instance;
    const known = Array.isArray(ctx.options.knownFunctions) ? ctx.options.knownFunctions : [];
    const isKnown = (name: string): boolean => {
      if (functions.hasFunction(name)) return true;
      return known.indexOf(name) > -1;
    };
    const candidates = functions.getAll().concat(known);
    ctx.forEachSite("parsed", site => {
      getFunctionOperands(site.ast).forEach(fn => {
        const name = fn.functionName;
        if (!name || isKnown(name)) return;
        const suggestion = closestMatch(name, candidates);
        ctx.reportAtSite(site, {
          message: "The function \"" + name + "\" is not registered (in \"" + site.text + "\")." +
            didYouMean(suggestion, "Register it with FunctionFactory.Instance before linting," +
              " or list it in options.knownFunctions."),
          reason: SurveyLintReasons["expression/unknown-function"].notRegistered,
          messageData: { functionName: name, expression: site.text },
          suggestion: suggestion,
        });
      });
    });
  },
};
