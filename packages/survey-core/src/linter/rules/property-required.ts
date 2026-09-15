import { ILintRule, LintContext } from "../rule";
import { ObjectSite } from "../property-walk";
import { ILintFix } from "../types";
import { isDescendantOf } from "../metadata";
import { SurveyLintFixReasons, SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["property/required"];
const fixReasons = SurveyLintFixReasons["property/required"];

function ownerText(name?: string, className?: string): string {
  if (!!name) return "\"" + name + "\"";
  return className === "survey" ? "the survey" : "the " + className;
}

// Only a name can be made up. Every other required property states something about the element
// that nothing in the JSON implies - a trigger's target, the items of a multiple text.
function buildFix(ctx: LintContext, site: ObjectSite, key: string): ILintFix | undefined {
  if (key !== "name") return undefined;
  const path = site.path ? site.path + ".name" : "name";
  return {
    reason: fixReasons.setName,
    edits: [{ op: "set", path: path, value: ctx.newElementName(site.className) }],
  };
}

// The deserializer's own check (JsonObject.getRequiredError): every object it builds is asked
// for the properties its class marks required, an itemvalue is left alone, and a property with
// a default value is never missing. Its reading of "missing" is a falsy value, so an empty name
// is missing too.
export const propertyRequiredRule: ILintRule = {
  id: "property/required",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.getPropertyWalk().objects.forEach(site => {
      if (isDescendantOf(site.className, "itemvalue")) return;
      ctx.metadata.getRequiredProperties(site.className).forEach(prop => {
        if (!!site.json[prop.name]) return;
        ctx.report({
          message: ownerText(site.ownName, site.className) + " has no \"" + prop.name +
            "\" - the property is required for a " + site.className + ".",
          path: site.path,
          reason: reasons.missing,
          messageData: { key: prop.name, className: site.className, name: site.ownName },
          elementName: site.ownName,
          elementType: site.owner.type,
          fix: buildFix(ctx, site, prop.name),
        });
      });
    });
  },
};
