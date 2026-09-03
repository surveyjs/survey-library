import { ILintRule, LintContext } from "../rule";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["element/never-visible"];

// The transitive half of dead-visibility reasoning: an element whose visibleIf demands a value
// of a question that can never become visible and that nothing ever writes to. The element
// with the contradictory visibleIf itself belongs to expression/contradiction - only the
// elements dead through the cascade are reported here.
export const elementNeverVisibleRule: ILintRule = {
  id: "element/never-visible",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.getNeverVisibleAnalysis().cascade.forEach(item => {
      const names = item.deps.map(dep => "{" + dep.name + "}").join(", ");
      const plural = item.deps.length > 1;
      ctx.reportAtSite(item.site, {
        message: "\"" + item.owner.name + "\" can never become visible: its visibleIf reads " +
          names + ", which " + (plural
          ? "are never visible and never receive a value"
          : "is never visible and never receives a value") +
          ", so the condition never holds.",
        reason: reasons.dependsOnDeadValue,
        messageData: {
          name: item.owner.name,
          expression: item.site.text,
          dependsOn: item.deps.map(dep => dep.name),
        },
        related: item.deps.map(dep => ({ path: dep.record.path, elementName: dep.record.name })),
      });
    });
  },
};
