import { ILintRule, LintContext } from "../rule";
import { ElementRecord, getEffectiveType } from "../symbols";
import { getInputType, isMinMaxInputType } from "../value-types";
import { AliasPairSite, PropertySite } from "../property-walk";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["property/dead"];

// min/max/step are registered on every text question, but the runtime applies them only to the
// inputTypes whose editor has bounds (isMinMaxType, question_text.ts).
const BOUND_PROPS = ["min", "max", "step"];

function ownerText(name?: string, className?: string): string {
  if (!!name) return "\"" + name + "\"";
  return className === "survey" ? "the survey" : "the " + className;
}

// A property the deserializer applies and the serializer then leaves out: it works until the
// JSON is saved again, and disappears from every copy made after that.
function checkNotSerializable(ctx: LintContext, site: PropertySite): void {
  if (site.prop.isSerializable !== false || !!site.prop.isSerializableFunc) return;
  ctx.report({
    message: "\"" + site.key + "\" of " + ownerText(site.owner.name, site.className) +
      " is not serializable - it takes effect on load, and is dropped from the JSON whenever " +
      "the survey is saved again.",
    path: site.path,
    reason: reasons.notSerializable,
    messageData: { key: site.key, className: site.className, name: site.owner.name },
    elementName: site.owner.name,
    elementType: site.owner.type,
  });
}

// One property under both its names: the deserializer assigns them in JSON order, so the key
// written last decides the value and the other one is written for nothing.
function checkAliasPair(ctx: LintContext, pair: AliasPairSite): void {
  // the pair is seen from both keys; report it from the one that loses
  if (pair.key === pair.winner) return;
  ctx.report({
    message: "\"" + pair.key + "\" and \"" + pair.aliasKey + "\" of " +
      ownerText(pair.owner.name, pair.className) + " are two names of one property - the runtime " +
      "applies them in the order the JSON writes them, so \"" + pair.winner + "\" wins.",
    path: pair.path,
    reason: reasons.aliasDuplicate,
    messageData: {
      key: pair.key, aliasKey: pair.aliasKey, winner: pair.winner,
      className: pair.className, name: pair.owner.name,
    },
    elementName: pair.owner.name,
    elementType: pair.owner.type,
    related: [{ path: pair.path }, { path: pair.aliasPath }],
  });
}

function checkInertBounds(ctx: LintContext, record: ElementRecord): void {
  const type = getEffectiveType(record);
  if (type !== "text" && record.kind !== "multipletextitem") return;
  const inputType = getInputType(record.json);
  if (isMinMaxInputType(inputType)) return;
  BOUND_PROPS.forEach(key => {
    if (record.json[key] === undefined) return;
    ctx.report({
      message: "\"" + key + "\" is set on \"" + record.name + "\", but inputType \"" + inputType +
        "\" has no bounds - the runtime ignores it.",
      path: record.path + "." + key,
      reason: reasons.inertMinMax,
      messageData: { key: key, inputType: inputType, name: record.name },
      elementName: record.name,
      elementType: record.type,
    });
  });
}

export const propertyDeadRule: ILintRule = {
  id: "property/dead",
  defaultSeverity: "info",
  run(ctx: LintContext): void {
    const walk = ctx.getPropertyWalk();
    walk.props.forEach(site => checkNotSerializable(ctx, site));
    walk.aliasPairs.forEach(pair => checkAliasPair(ctx, pair));
    ctx.index.allElements.forEach(record => {
      if (!record.json) return;
      checkInertBounds(ctx, record);
    });
  },
};
