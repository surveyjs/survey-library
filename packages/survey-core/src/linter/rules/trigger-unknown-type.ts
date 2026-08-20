import { ILintRule, LintContext } from "../rule";
import { TRIGGER_TYPES } from "../catalog";
import { closestMatch } from "../levenshtein";

export const triggerUnknownTypeRule: ILintRule = {
  id: "trigger/unknown-type",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const knownTypes: Array<string> = [];
    TRIGGER_TYPES.forEach((def, name) => knownTypes.push(name));
    ctx.index.triggers.forEach(trigger => {
      if (TRIGGER_TYPES.has(trigger.type)) return;
      const suggestion = trigger.type ? closestMatch(trigger.type, knownTypes) : undefined;
      let message = trigger.type
        ? "The trigger type \"" + trigger.type + "\" is not known."
        : "The trigger has no type.";
      message += suggestion
        ? " Did you mean \"" + suggestion + "\"?"
        : " A misspelled type is silently dropped at runtime; a custom trigger is not covered by the linter's target and cycle checks.";
      ctx.report({
        message: message,
        path: trigger.path,
        messageData: { type: trigger.type, known: knownTypes },
        elementType: "trigger",
        suggestion: suggestion,
      });
    });
  },
};
