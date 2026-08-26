import { ILintRule, LintContext } from "../rule";
import { closestMatch } from "../levenshtein";

export const elementUnknownTypeRule: ILintRule = {
  id: "element/unknown-type",
  defaultSeverity: "info",
  run(ctx: LintContext): void {
    const candidates = ctx.metadata.getElementTypes().concat(
      ctx.options.components ? Object.keys(ctx.options.components) : []);
    ctx.index.allElements.forEach(record => {
      if (record.kind !== "question" || !record.isUnknownType) return;
      const suggestion = closestMatch(record.type, candidates);
      let message = "\"" + (record.name || record.path) + "\" has an unknown type \"" + record.type + "\".";
      message += suggestion
        ? " Did you mean \"" + suggestion + "\"?"
        : " If it is a custom component, pass its definition via options.components to enable full analysis.";
      ctx.report({
        message: message,
        path: record.path,
        messageData: { name: record.name, type: record.type },
        elementName: record.name,
        elementType: record.type,
        suggestion: suggestion,
      });
    });
  },
};
