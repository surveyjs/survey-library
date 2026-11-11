import { ILintRule, LintContext } from "../rule";
import { SurveyLintReasons } from "../reasons";
import { isPanel } from "../metadata";
import { forEachComponentElement } from "../walker";

const reasons = SurveyLintReasons["nesting/ignored-key"];

function isKey(value: any): boolean {
  return typeof value === "string" && value.trim() !== "";
}

// A panel of the composite definition typeName whose valueName stores nothing.
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

// Nested data, decisions N5: a composite question's content panel is a value of its own, and a panel
// inside it never nests - its valueName is ignored in every mode (until prompt 11's step 2). A panel
// inside a dynamic panel's template or a matrix detail panel nests by its valueName (records nesting 02,
// RN3); the template panel and the detail panel themselves never nest (RN6), but the JSON gives them no
// valueName to report. With "dataNesting": "none" every valueName is ignored by the author's own choice,
// so nothing is reported there. The panels of a composite definition (options.components) are found at
// any depth: the walker does not index them, since a definition is never part of the survey's own elements.
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
