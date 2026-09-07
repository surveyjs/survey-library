import { ILintRule, LintContext } from "../rule";
import { forEachValidator } from "../validator-utils";
import { closestMatch } from "../levenshtein";
import { didYouMean } from "../message-utils";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["validator/unknown-type"];

export const validatorUnknownTypeRule: ILintRule = {
  id: "validator/unknown-type",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const knownTypes = ctx.metadata.getValidatorTypes();
    forEachValidator(ctx, entry => {
      if (!!ctx.metadata.getValidatorClass(entry.type)) return;
      const suggestion = entry.type ? closestMatch(entry.type, knownTypes) : undefined;
      const message = entry.type
        ? "The validator type \"" + entry.type + "\" of \"" + entry.owner.name + "\" is not known."
        : "A validator of \"" + entry.owner.name + "\" has no type.";
      ctx.report({
        message: message + didYouMean(suggestion,
          "The deserializer drops a validator it cannot resolve, so nothing validates."),
        path: entry.path,
        reason: entry.type ? reasons.unknownType : reasons.noType,
        messageData: { type: entry.type, known: knownTypes, name: entry.owner.name },
        elementName: entry.owner.name,
        elementType: entry.owner.type,
        suggestion: suggestion,
      });
    });
  },
};
