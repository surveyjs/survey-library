import { ILintRule, LintContext } from "../rule";
import { closestMatch } from "../levenshtein";
import { didYouMean } from "../message-utils";
import { SurveyLintFixReasons, SurveyLintReasons } from "../reasons";

export const elementUnknownTypeRule: ILintRule = {
  id: "element/unknown-type",
  defaultSeverity: "info",
  run(ctx: LintContext): void {
    const candidates = ctx.metadata.getElementTypes().concat(
      ctx.options.components ? Object.keys(ctx.options.components) : []);
    const reasons = SurveyLintReasons["element/unknown-type"];
    const fixReasons = SurveyLintFixReasons["element/unknown-type"];
    ctx.index.allElements.forEach(record => {
      if (record.kind !== "question" || !record.isUnknownType) return;
      const label = "\"" + (record.name || record.path) + "\"";
      // no type at all is a defect of its own: there is nothing to suggest a spelling for, and
      // the deserializer drops the element without even guessing a class
      if (!record.type) {
        ctx.report({
          message: label + " has no type - the deserializer drops an element it cannot pick a class for.",
          path: record.path,
          reason: reasons.missingType,
          messageData: { name: record.name, type: record.type },
          elementName: record.name,
          elementType: record.type,
        });
        return;
      }
      const suggestion = closestMatch(record.type, candidates);
      ctx.report({
        message: label + " has an unknown type \"" + record.type + "\"." +
          didYouMean(suggestion, "If it is a custom component, pass its definition via" +
            " options.components to enable full analysis."),
        path: record.path,
        reason: reasons.unknownType,
        messageData: { name: record.name, type: record.type },
        elementName: record.name,
        elementType: record.type,
        suggestion: suggestion,
        // only a misspelling can be repaired: without a close known type there is nothing to
        // write, and a custom component is a definition to pass, not a spelling to correct
        fix: !suggestion ? undefined : {
          reason: fixReasons.setType,
          edits: [{ op: "set", path: record.path + ".type", value: suggestion }],
        },
      });
    });
  },
};
