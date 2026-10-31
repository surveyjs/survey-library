import { ILintRule, LintContext } from "../rule";
import { closestMatch } from "../levenshtein";
import { didYouMean, ownerText } from "../message-utils";
import { SurveyLintFixReasons, SurveyLintReasons } from "../reasons";
import { UnknownKeySite } from "../property-walk";
import { ILintFix } from "../types";
import { removeFix, renameFix } from "../fix-utils";

const reasons = SurveyLintReasons["property/unknown"];
const fixReasons = SurveyLintFixReasons["property/unknown"];

// A misspelling is renamed where it stands, so the key keeps its place among its neighbours.
// Renaming over a key the object already spells would throw that value away, and the author did
// write it correctly there - so the typo is dropped instead, which is what the deserializer does
// with it anyway. A key nothing is close to is dropped for the same reason.
function buildFix(entry: UnknownKeySite, suggestion: string): ILintFix {
  const taken = !!entry.json && Object.prototype.hasOwnProperty.call(entry.json, suggestion);
  if (!suggestion || taken) return removeFix(fixReasons.removeKey, entry.path);
  return renameFix(fixReasons.renameKey, entry.path, suggestion);
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
        fix: buildFix(entry, suggestion),
      });
    });
  },
};
