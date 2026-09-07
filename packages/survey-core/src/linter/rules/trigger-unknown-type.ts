import { ILintRule, LintContext } from "../rule";
import { closestMatch } from "../levenshtein";
import { didYouMean } from "../message-utils";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["trigger/unknown-type"];

export const triggerUnknownTypeRule: ILintRule = {
  id: "trigger/unknown-type",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const knownTypes = ctx.metadata.getTriggerTypes();
    ctx.index.triggers.forEach(trigger => {
      if (!!ctx.metadata.getTriggerDef(trigger.type)) return;
      const suggestion = trigger.type ? closestMatch(trigger.type, knownTypes) : undefined;
      const reason = trigger.type ? reasons.unknownType : reasons.noType;
      const message = trigger.type
        ? "The trigger type \"" + trigger.type + "\" is not known."
        : "The trigger has no type.";
      ctx.report({
        message: message + didYouMean(suggestion, "A misspelled type is silently dropped at" +
          " runtime; a custom trigger is not covered by the linter's target and cycle checks."),
        path: trigger.path,
        reason: reason,
        messageData: { type: trigger.type, known: knownTypes },
        elementType: "trigger",
        suggestion: suggestion,
      });
    });
  },
};
