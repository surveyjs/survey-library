import { ILintRule, LintContext } from "../rule";
import { SurveyLintFixReasons, SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["property/not-an-array"];
const fixReasons = SurveyLintFixReasons["property/not-an-array"];

function ownerText(name?: string, className?: string): string {
  if (!!name) return "\"" + name + "\"";
  return className === "survey" ? "the survey" : "the " + className;
}

export const propertyNotAnArrayRule: ILintRule = {
  id: "property/not-an-array",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.getPropertyWalk().notArrays.forEach(site => {
      ctx.report({
        message: "The \"" + site.key + "\" of " + ownerText(site.owner.name, site.className) +
          " (" + site.className + ") is not an array - the property holds a list, and the" +
          " deserializer wraps the value into a one-item array.",
        path: site.path,
        reason: reasons.notAnArray,
        messageData: {
          key: site.key, className: site.className, name: site.owner.name,
          valueType: typeof site.value,
        },
        elementName: site.owner.name,
        elementType: site.owner.type,
        // the deserializer's own repair, written down: the value becomes the one item of the array
        fix: { reason: fixReasons.wrapInArray, edits: [{ op: "wrap", path: site.path }] },
      });
    });
  },
};
