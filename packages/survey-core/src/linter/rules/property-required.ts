import { ILintRule, LintContext } from "../rule";
import { ObjectSite } from "../property-walk";
import { ownerText } from "../message-utils";
import { joinPath } from "../symbols";
import { ILintFix } from "../types";
import { isDescendantOf } from "../metadata";
import { SurveyLintFixReasons, SurveyLintReasons } from "../reasons";
import { setFix } from "../fix-utils";

const reasons = SurveyLintReasons["property/required"];
const fixReasons = SurveyLintFixReasons["property/required"];

// Only a name can be made up. Every other required property states something about the element
// that nothing in the JSON implies - a trigger's target, the items of a multiple text.
function buildFix(ctx: LintContext, site: ObjectSite, key: string): ILintFix | undefined {
  if (key !== "name") return undefined;
  return setFix(fixReasons.setName, joinPath(site.path, "name"), ctx.newElementName(site.className));
}

function hasNameProperty(ctx: LintContext, className: string): boolean {
  const known = ctx.metadata.getKnownKeys(className);
  return !!known && known.byKey.has("name");
}

// A survey element (a question, a page, a panel, and so a matrix column and a multiple-text item)
// loads a numeric name as its string and any other value that is not a string as no name. A
// calculated value lower-cases its name as it is, so the survey does not load. A number is still
// not a name, so it is reported either way. Its spelling is the one repair: "5" is what the author
// meant by 5. An object written there means nothing in particular, and gets no fix.
function getNotAStringOutcome(className: string, value: any): string {
  if (isDescendantOf(className, "calculatedvalue")) return "the survey cannot load it";
  if (typeof value === "number") return "the survey loads it as \"" + String(value) + "\"";
  return "the survey loads the " + className + " without a name";
}
function reportNotAString(ctx: LintContext, site: ObjectSite, value: any): void {
  const path = joinPath(site.path, "name");
  const spelled = typeof value === "number" || typeof value === "boolean" ? String(value) : undefined;
  ctx.report({
    message: "The name of the " + site.className + " is " + JSON.stringify(value) +
      ", not a string - " + getNotAStringOutcome(site.className, value) + ".",
    path: path,
    reason: reasons.notAString,
    messageData: { key: "name", className: site.className, name: spelled, value: value },
    elementName: spelled,
    elementType: site.owner.type,
    fix: setFix(fixReasons.setName, path, spelled),
  });
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
      const name = site.json.name;
      if (!!name && typeof name !== "string" && hasNameProperty(ctx, site.className)) {
        reportNotAString(ctx, site, name);
      }
      ctx.metadata.getRequiredProperties(site.className).forEach(prop => {
        // a truthy name that is not a string was reported above, and is not missing
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
