import { FunctionFactory } from "survey-core";
import { ILintRule, LintContext } from "../rule";
import { getFunctionOperands } from "../expression-utils";
import { ExpressionSite, isCarvedOutSite } from "../symbols";
import { closestMatch } from "../levenshtein";
import { didYouMean } from "../message-utils";
import { SurveyLintFixReasons, SurveyLintReasons } from "../reasons";
import { setFix } from "../fix-utils";
import { ILintFix } from "../types";

const fixReasons = SurveyLintFixReasons["expression/unknown-function"];

function isIdentChar(ch: string): boolean {
  return !!ch && /[A-Za-z0-9_$]/.test(ch);
}

// A call is the name followed by "(". The occurrence is found by hand rather than through a
// pattern built out of the name: an identifier boundary on the left, spaces and the opening
// bracket on the right. So the same word written as a string argument, or as part of a longer
// name, is left exactly where it stands.
function rewriteCall(text: string, name: string, suggestion: string): string | undefined {
  if (!text || !name || !suggestion) return undefined;
  let res = "";
  let rest = text;
  let found = false;
  let at = rest.indexOf(name);
  while(at > -1) {
    const before = at > 0 ? rest.charAt(at - 1) : "";
    let after = at + name.length;
    while(after < rest.length && rest.charAt(after).trim() === "") after++;
    if (!isIdentChar(before) && before !== "." && rest.charAt(after) === "(") {
      res += rest.substring(0, at) + suggestion;
      found = true;
    } else {
      res += rest.substring(0, at + name.length);
    }
    rest = rest.substring(at + name.length);
    at = rest.indexOf(name);
  }
  return found ? res + rest : undefined;
}

function buildFix(site: ExpressionSite, name: string, suggestion: string): ILintFix | undefined {
  if (isCarvedOutSite(site)) return undefined;
  return setFix(fixReasons.renameFunction, site.path, rewriteCall(site.text, name, suggestion));
}

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
          fix: buildFix(site, name, suggestion),
        });
      });
    });
  },
};
