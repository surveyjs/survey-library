import { ILintRule, LintContext } from "../rule";
import { isDescendantOf } from "../metadata";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["property/required"];

function ownerText(name?: string, className?: string): string {
  if (!!name) return "\"" + name + "\"";
  return className === "survey" ? "the survey" : "the " + className;
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
        });
      });
    });
  },
};
