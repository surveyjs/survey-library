import { ILintRule, LintContext } from "../rule";
import { PropertySite } from "../property-walk";
import { closestMatch } from "../levenshtein";
import { didYouMean, quoteValues } from "../message-utils";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["property/invalid-value"];

function ownerText(name?: string, className?: string): string {
  if (!!name) return "\"" + name + "\"";
  return className === "survey" ? "the survey" : "the " + className;
}

function isScalar(value: any): boolean {
  const type = typeof value;
  return type === "string" || type === "number" || type === "boolean";
}

// A property whose value the JSON states outright. An expression is evaluated at runtime, a
// localizable value is a string or a per-locale object, and a value-typed property holds
// whatever answer the author wants to preset - none of the three has a set of allowed values.
function isCheckableProp(site: PropertySite): boolean {
  const prop = site.prop;
  return !prop.isExpression && !prop.isLocalizable && !prop.serializationProperty &&
    isScalar(site.value);
}

// The allowed values, when the property lists them outright. A choices function is called
// with no object, the way validateValue calls it: one that needs the object answers nothing
// usable, and a partial answer would only invent a defect.
function getAllowedValues(site: PropertySite): Array<any> | undefined {
  let choices: any;
  try {
    choices = site.prop.getChoices(null, () => { });
  } catch(e) {
    return undefined;
  }
  if (!Array.isArray(choices) || choices.length === 0) return undefined;
  if (!choices.every(isScalar)) return undefined;
  return choices;
}

function matches(allowed: Array<any>, value: any): boolean {
  // the loose comparison validateValue makes: the deserializer converts "5" to 5 for a
  // number-typed property, so the two spellings are one value
  return allowed.some(item => item == value);
}

function caseInsensitiveMatch(allowed: Array<any>, value: any): string | undefined {
  if (typeof value !== "string") return undefined;
  const lower = value.toLowerCase();
  return allowed.filter(item => typeof item === "string" && item.toLowerCase() === lower)[0];
}

function checkChoices(ctx: LintContext, site: PropertySite): void {
  const allowed = getAllowedValues(site);
  if (!allowed || matches(allowed, site.value)) return;
  const accepted = site.prop.acceptedValues;
  if (Array.isArray(accepted) && accepted.indexOf(site.value) > -1) return;
  // a value spelled with the wrong case is still the wrong value: most setters compare it
  // as written, so the suggestion carries the spelling that works
  const suggestion = caseInsensitiveMatch(allowed, site.value) ||
    closestMatch(String(site.value), allowed.map(item => String(item)));
  ctx.report({
    message: "The " + site.key + " of " + ownerText(site.owner.name, site.className) + " is " +
      JSON.stringify(site.value) + " - not one of the allowed values (" + quoteValues(allowed) + ")." +
      didYouMean(suggestion),
    path: site.path,
    reason: reasons.notInChoices,
    messageData: {
      key: site.key, value: site.value, allowed: allowed,
      className: site.className, name: site.owner.name,
    },
    elementName: site.owner.name,
    elementType: site.owner.type,
    suggestion: suggestion,
  });
}

function toNumber(site: PropertySite): number | undefined {
  const value = site.value;
  if (typeof value === "number") return isFinite(value) ? value : undefined;
  // the deserializer parses a string into a number-typed property
  if (typeof value === "string" && site.prop.type === "number") {
    const res = parseInt(value);
    return isNaN(res) ? undefined : res;
  }
  return undefined;
}

function checkRange(ctx: LintContext, site: PropertySite): void {
  const min = site.prop.minValue;
  const max = site.prop.maxValue;
  if (typeof min !== "number" && typeof max !== "number") return;
  const value = toNumber(site);
  if (value === undefined) return;
  const belowMin = typeof min === "number" && value < min;
  const aboveMax = typeof max === "number" && value > max;
  if (!belowMin && !aboveMax) return;
  const range = (typeof min === "number" ? min : "") + ".." + (typeof max === "number" ? max : "");
  ctx.report({
    message: "The " + site.key + " of " + ownerText(site.owner.name, site.className) + " is " +
      value + ", outside its allowed range " + range + ".",
    path: site.path,
    reason: reasons.outOfRange,
    messageData: {
      key: site.key, value: value, min: min, max: max,
      className: site.className, name: site.owner.name,
    },
    elementName: site.owner.name,
    elementType: site.owner.type,
  });
}

// A dot makes the runtime read the name as a path into another key, so the flat data key the
// author wrote can never be addressed.
function checkValueName(ctx: LintContext, site: PropertySite): void {
  if (site.key !== "valueName" || typeof site.value !== "string" || site.value.indexOf(".") < 0) return;
  ctx.report({
    message: "The valueName \"" + site.value + "\" of \"" + site.owner.name +
      "\" contains a \".\" - expressions read {" + site.value + "} as a path into \"" +
      site.value.split(".")[0] + "\", so the data key itself can never be addressed.",
    path: site.path,
    reason: reasons.valueNameDotted,
    messageData: { key: site.key, valueName: site.value, name: site.owner.name },
    elementName: site.owner.name,
    elementType: site.owner.type,
  });
}

export const propertyInvalidValueRule: ILintRule = {
  id: "property/invalid-value",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.getPropertyWalk().props.forEach(site => {
      if (!isCheckableProp(site)) return;
      checkChoices(ctx, site);
      checkRange(ctx, site);
      checkValueName(ctx, site);
    });
  },
};
