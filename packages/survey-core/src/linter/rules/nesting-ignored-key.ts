import { ILintRule, LintContext } from "../rule";
import { SurveyLintReasons } from "../reasons";
import { isPanel } from "../metadata";
import { forEachComponentElement } from "../walker";

const reasons = SurveyLintReasons["nesting/ignored-key"];

function isKey(value: any): boolean {
  return typeof value === "string" && value.trim() !== "";
}

function report(ctx: LintContext, panel: any, path: string, typeName: string): void {
  const name = panel.name || "";
  ctx.report({
    message: "The valueName \"" + panel.valueName + "\" of panel \"" + name + "\" stores nothing: the panel is inside composite question \"" +
      typeName + "\", whose value stays flat - its questions keep writing into the question's value directly.",
    path: path + ".valueName",
    reason: reasons.insideComposite,
    messageData: { name: name, valueName: panel.valueName, recordName: typeName, recordType: typeName },
    elementName: name,
    elementType: "panel",
  });
}

// Nested data: a panel inside a composite question's content panel never nests - its valueName is ignored in every
// mode (see "Limitations" in docs/design-survey-nested-data.md). A panel inside a template or a detail panel does
// nest; the template and the detail panel themselves never do, but the JSON gives them no valueName to report.
// "none" ignores every valueName, so nothing is reported there. The walker does not index a composite definition
// (it is not part of the survey's elements), so its panels are found here at any depth.
export const nestingIgnoredKeyRule: ILintRule = {
  id: "nesting/ignored-key",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    if (ctx.index.dataNesting === "none") return;
    const components = ctx.options.components;
    if (!components) return;
    Object.keys(components).forEach(typeName => {
      const def = components[typeName];
      if (!def) return;
      forEachComponentElement(ctx.metadata, def.elementsJSON, "components." + typeName + ".elementsJSON", (el, path) => {
        if (isPanel((el.type || "").toLowerCase()) && isKey(el.valueName)) report(ctx, el, path, typeName);
      });
    });
  },
};
