import { ILintRule, LintContext } from "../rule";
import { SurveyLintReasons } from "../reasons";
import { isPanel } from "../metadata";

const reasons = SurveyLintReasons["nesting/ignored-key"];

function isKey(value: any): boolean {
  return typeof value === "string" && value.trim() !== "";
}

function report(ctx: LintContext, path: string, name: string, valueName: string, recordName: string,
  recordType: string, what: string): void {
  ctx.report({
    message: "The valueName \"" + valueName + "\" of panel \"" + name + "\" stores nothing: the panel is inside " + what +
      ", whose value stays flat - its questions keep writing into the question's value directly.",
    path: path,
    reason: reasons.insideRecord,
    messageData: { name: name, valueName: valueName, recordName: recordName, recordType: recordType },
    elementName: name,
    elementType: "panel",
  });
}

// The panels of a composite definition (options.components), at any depth: the walker does not
// index them, since a definition is never part of the survey's own elements.
function checkComponentElements(ctx: LintContext, elements: any, basePath: string, typeName: string): void {
  if (!Array.isArray(elements)) return;
  const keys = ctx.metadata.getElementsKeys().concat(ctx.metadata.getTemplateElementsKeys());
  elements.forEach((el: any, i: number) => {
    if (!el || typeof el !== "object") return;
    const path = basePath + "[" + i + "]";
    if (isPanel((el.type || "").toLowerCase()) && isKey(el.valueName)) {
      report(ctx, path + ".valueName", el.name || "", el.valueName, typeName, typeName, "composite question \"" + typeName + "\"");
    }
    keys.forEach(key => checkComponentElements(ctx, el[key], path + "." + key, typeName));
  });
}

// Nested data, decisions N5: a composite question's content panel is a value of its own, and a panel
// inside it never nests - its valueName is ignored in every mode (until prompt 11's step 2). A panel
// inside a dynamic panel's template or a matrix detail panel nests by its valueName (records nesting 02,
// RN3); the template panel and the detail panel themselves never nest (RN6), but the JSON gives them no
// valueName to report. With "dataNesting": "none" every valueName is ignored by the author's own choice,
// so nothing is reported there.
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
      checkComponentElements(ctx, def.elementsJSON, "components." + typeName + ".elementsJSON", typeName);
    });
  },
};
