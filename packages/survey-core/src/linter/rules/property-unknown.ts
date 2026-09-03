import { ILintRule, LintContext } from "../rule";
import { closestMatch } from "../levenshtein";
import { didYouMean } from "../message-utils";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["property/unknown"];

function ownerText(name?: string, className?: string): string {
  if (!!name) return "\"" + name + "\"";
  return className === "survey" ? "the survey" : "the " + className;
}

export const propertyUnknownRule: ILintRule = {
  id: "property/unknown",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.getPropertyWalk().unknownKeys.forEach(entry => {
      const suggestion = closestMatch(entry.key, entry.knownKeys);
      ctx.report({
        message: "\"" + entry.key + "\" is not a property of " +
          ownerText(entry.owner.name, entry.className) + " (" + entry.className + ")." +
          didYouMean(suggestion, "The deserializer drops a key it does not know."),
        path: entry.path,
        reason: reasons.unknownProperty,
        messageData: { key: entry.key, className: entry.className, name: entry.owner.name },
        elementName: entry.owner.name,
        elementType: entry.owner.type,
        suggestion: suggestion,
      });
    });
  },
};
