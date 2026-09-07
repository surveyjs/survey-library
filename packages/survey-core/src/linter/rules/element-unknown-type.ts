import { ILintRule, LintContext } from "../rule";
import { closestMatch } from "../levenshtein";
import { didYouMean } from "../message-utils";
import { SurveyLintReasons } from "../reasons";

export const elementUnknownTypeRule: ILintRule = {
  id: "element/unknown-type",
  defaultSeverity: "info",
  run(ctx: LintContext): void {
    const candidates = ctx.metadata.getElementTypes().concat(
      ctx.options.components ? Object.keys(ctx.options.components) : []);
    ctx.index.allElements.forEach(record => {
      if (record.kind !== "question" || !record.isUnknownType) return;
      const suggestion = closestMatch(record.type, candidates);
      ctx.report({
        message: "\"" + (record.name || record.path) + "\" has an unknown type \"" + record.type + "\"." +
          didYouMean(suggestion, "If it is a custom component, pass its definition via" +
            " options.components to enable full analysis."),
        path: record.path,
        reason: SurveyLintReasons["element/unknown-type"].unknownType,
        messageData: { name: record.name, type: record.type },
        elementName: record.name,
        elementType: record.type,
        suggestion: suggestion,
      });
    });
  },
};
