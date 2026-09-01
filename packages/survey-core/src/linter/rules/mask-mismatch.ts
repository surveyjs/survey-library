import { ILintRule, LintContext } from "../rule";
import { ElementRecord, getEffectiveType } from "../symbols";
import { getInputType } from "../value-types";
import { closestMatch } from "../levenshtein";
import { didYouMean } from "../message-utils";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["mask/mismatch"];

// maskTypeIsEmpty (question_text.ts): a mask reaches the input only for these two.
const MASK_INPUT_TYPES = ["text", "tel"];
const BASE_MASK_CLASS = "masksettings";
const BASE_MASK_KEY = "saveMaskedValue";

function isMaskOwner(record: ElementRecord): boolean {
  return getEffectiveType(record) === "text" || record.kind === "multipletextitem";
}

function getMaskType(json: any): string {
  const value = json.maskType;
  return typeof value === "string" ? value : "";
}

function getSettings(json: any): any {
  const value = json.maskSettings;
  return !!value && typeof value === "object" && !Array.isArray(value) ? value : undefined;
}

function report(ctx: LintContext, record: ElementRecord, message: string, reason: string,
  path: string, messageData: { [key: string]: any }, suggestion?: string): void {
  ctx.report({
    message: message,
    path: path,
    reason: reason,
    messageData: { ...messageData, name: record.name },
    elementName: record.name,
    elementType: record.type,
    suggestion: suggestion,
  });
}

// setData (mask_base.ts) applies only the properties of the class maskType resolves to and
// drops every other key - without even a JsonUnknownPropertyError, since the load bypasses
// the serializer's own property walk.
function checkSettingsKeys(ctx: LintContext, record: ElementRecord, maskType: string,
  maskClass: string, settings: any): void {
  const known = ctx.metadata.getKnownKeys(maskClass);
  if (!known) return;
  Object.keys(settings).forEach(key => {
    if (known.byKey.has(key)) return;
    report(ctx, record,
      "The maskSettings of \"" + record.name + "\" set \"" + key + "\", which is not a property of the \"" +
      maskType + "\" mask - the runtime drops it silently." +
      didYouMean(closestMatch(key, known.names)),
      reasons.unknownSettingsKey,
      record.path + ".maskSettings." + key,
      { key: key, maskType: maskType, maskClass: maskClass },
      closestMatch(key, known.names));
  });
}

// Without a maskType the settings resolve to the bare base class, which carries one property.
function checkSettingsWithoutMask(ctx: LintContext, record: ElementRecord, settings: any): void {
  const keys = Object.keys(settings).filter(key => key !== BASE_MASK_KEY);
  if (keys.length === 0) return;
  report(ctx, record,
    "The maskSettings of \"" + record.name + "\" are set without a maskType - the runtime keeps " +
    "only \"" + BASE_MASK_KEY + "\" and drops the rest.",
    reasons.settingsWithoutMask,
    record.path + ".maskSettings",
    { keys: keys });
}

function checkBounds(ctx: LintContext, record: ElementRecord, maskType: string,
  maskClass: string, settings: any): void {
  const min = settings.min;
  const max = settings.max;
  if (min === undefined || max === undefined) return;
  if (maskClass === "datetimemask") {
    if (!!settings.pattern) return;
    report(ctx, record,
      "The datetime mask of \"" + record.name + "\" sets min/max without a pattern - the bounds " +
      "apply to the pattern's date parts, so without one they do nothing.",
      reasons.minMaxWithoutPattern,
      record.path + ".maskSettings",
      { maskType: maskType, keys: ["min", "max"] });
    return;
  }
  if (typeof min !== "number" || typeof max !== "number" || min <= max) return;
  report(ctx, record,
    "The " + maskType + " mask of \"" + record.name + "\" allows at least " + min + " and at most " +
    max + " - no value satisfies it.",
    reasons.minAboveMax,
    record.path + ".maskSettings.min",
    { maskType: maskType, min: min, max: max });
}

function checkRecord(ctx: LintContext, record: ElementRecord): void {
  const json = record.json;
  const maskType = getMaskType(json);
  const settings = getSettings(json);
  if (!maskType && !settings) return;
  const maskClass = ctx.metadata.resolveMaskClass(maskType);
  if (!maskClass) {
    const known = ctx.metadata.getMaskTypes();
    report(ctx, record,
      "The maskType \"" + maskType + "\" of \"" + record.name + "\" is not a known mask - the " +
      "runtime falls back to no mask at all." + didYouMean(closestMatch(maskType, known)),
      reasons.unknownMaskType,
      record.path + ".maskType",
      { maskType: maskType, known: known },
      closestMatch(maskType, known));
    return;
  }
  const hasMask = maskClass !== BASE_MASK_CLASS;
  if (hasMask) {
    const inputType = getInputType(json);
    if (MASK_INPUT_TYPES.indexOf(inputType) < 0) {
      report(ctx, record,
        "The " + maskType + " mask of \"" + record.name + "\" applies to no input: inputType \"" +
        inputType + "\" is masked only for " + MASK_INPUT_TYPES.join(" and ") + ".",
        reasons.maskInertForInputType,
        record.path + ".maskType",
        { maskType: maskType, inputType: inputType });
    }
  }
  if (!settings) return;
  if (!hasMask) {
    checkSettingsWithoutMask(ctx, record, settings);
    return;
  }
  checkSettingsKeys(ctx, record, maskType, maskClass, settings);
  checkBounds(ctx, record, maskType, maskClass, settings);
}

export const maskMismatchRule: ILintRule = {
  id: "mask/mismatch",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.index.allElements.forEach(record => {
      if (!record.json || !isMaskOwner(record)) return;
      checkRecord(ctx, record);
    });
  },
};
