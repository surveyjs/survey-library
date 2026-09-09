import { ISurveyVariableError, ISurveyVariablePreset } from "survey-core";
import { ILintRule, LintContext } from "../rule";
import { closestMatch } from "../levenshtein";
import { didYouMean } from "../message-utils";
import { CIMap } from "../symbols";
import { ILintRelated } from "../types";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["variable/preset"];

// The presets live outside the survey JSON, so their paths are rooted at the option that carries
// them rather than at "pages[...]". A finding's own path always addresses the linted document
// everywhere else; here the linted document is not where the defect is.
const ROOT_PATH = "variablePresets";
const DEFINITION_PATH = ROOT_PATH + ".definition";

function presetPath(index: number): string {
  return ROOT_PATH + ".presets[" + index + "]";
}

function definitionRelated(questionName: string): Array<ILintRelated> {
  return [{ path: DEFINITION_PATH, elementName: questionName }];
}

// The same notion of "an object" the core companion applies: a dictionary built with
// Object.create(null) is one, an array is not.
function isRecord(value: any): boolean {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isPresent(value: any): boolean {
  return value !== undefined && value !== null;
}

// How a message names a preset that may have no name yet.
function presetLabel(preset: any, index: number): string {
  const name = !!preset && typeof preset.name === "string" ? preset.name : "";
  return name ? "\"" + name + "\"" : "#" + index;
}

function checkDefinition(ctx: LintContext): boolean {
  // With a definition model in hand the JSON definition is never loaded, so there is nothing
  // in it to complain about - the variables come from the model either way.
  if (!!ctx.options.variableDefinitionModel) return true;
  const definition = ctx.options.variablePresets.definition;
  if (!isPresent(definition) || isRecord(definition)) return true;
  ctx.report({
    message: "variablePresets.definition is not a survey JSON object, so no variable is declared " +
      "and no preset value can be checked against one.",
    path: DEFINITION_PATH,
    reason: reasons.definitionNotAnObject,
    messageData: { definitionType: Array.isArray(definition) ? "array" : typeof definition },
  });
  return false;
}

function checkUnknownVariables(ctx: LintContext, preset: ISurveyVariablePreset, index: number,
  unknown: Array<string>): void {
  unknown.forEach(key => {
    const suggestion = closestMatch(key, ctx.index.definitionVariables.names());
    ctx.report({
      message: "Preset " + presetLabel(preset, index) + " sets \"" + key +
        "\", which the variable definition does not declare." + didYouMean(suggestion),
      path: presetPath(index) + ".variables." + key,
      reason: reasons.unknownVariable,
      messageData: { preset: preset.name, variable: key },
      suggestion: suggestion,
    });
  });
}

// The verdict is the definition's own - its validators, its isRequired, its visibleIfs and the
// choice-membership check the core companion adds - because it comes from a model of the
// definition rather than from a static approximation of it. A required variable a preset leaves
// out is therefore reported here too, on the key that is missing.
function checkInvalidValues(ctx: LintContext, preset: ISurveyVariablePreset, index: number,
  errors: Array<ISurveyVariableError>): void {
  // Validation normalizes keys to the definition's spelling; paths address the preset itself.
  // The last case variant wins, matching validateVariables' assignment order.
  const inputKeys = new CIMap<string>();
  Object.keys(preset.variables).forEach(key => inputKeys.set(key, key));
  errors.forEach(error => {
    const key = inputKeys.get(error.variable) || error.variable;
    ctx.report({
      message: "Preset " + presetLabel(preset, index) + " sets \"" + error.variable +
        "\" to a value the variable definition rejects: " + error.errors[0],
      path: presetPath(index) + ".variables." + key,
      reason: reasons.invalidValue,
      messageData: {
        preset: preset.name, variable: error.variable, question: error.question,
        errors: error.errors,
      },
      related: definitionRelated(error.question),
    });
  });
}

function checkPreset(ctx: LintContext, preset: any, index: number,
  firstByName: { [name: string]: number }): void {
  const path = presetPath(index);
  if (!isRecord(preset)) {
    ctx.report({
      message: "Preset #" + index + " is not an object.",
      path: path,
      reason: reasons.presetNotAnObject,
      messageData: { index: index },
    });
    return;
  }
  if (typeof preset.name !== "string" || !preset.name) {
    ctx.report({
      message: "Preset #" + index + " has no name, so nothing can reference it.",
      path: path,
      reason: reasons.presetNameMissing,
      messageData: { index: index },
    });
  } else if (Object.prototype.hasOwnProperty.call(firstByName, preset.name)) {
    // preset names are case-sensitive: a name is an identifier the author typed, and getPreset
    // compares it as written
    ctx.report({
      message: "Preset \"" + preset.name + "\" is declared twice - a lookup by that name answers " +
        "with the first one.",
      path: path,
      reason: reasons.duplicateName,
      messageData: { preset: preset.name, index: index, firstIndex: firstByName[preset.name] },
      related: [{ path: presetPath(firstByName[preset.name]) }],
    });
  } else {
    firstByName[preset.name] = index;
  }
  if (!isRecord(preset.variables)) {
    ctx.report({
      message: "Preset " + presetLabel(preset, index) + " carries no variables object, so it sets " +
        "nothing.",
      path: path + ".variables",
      reason: reasons.presetVariablesNotAnObject,
      messageData: { preset: preset.name, index: index },
    });
    return;
  }
  // Without a definition there is nothing to judge a value against, and a preset written before
  // the definition exists is not a defect.
  if (!ctx.variablePresets.hasDefinition) return;
  const result = ctx.variablePresets.validateVariables(preset.variables);
  checkUnknownVariables(ctx, preset, index, result.unknownVariables);
  checkInvalidValues(ctx, preset, index, result.errors);
}

// The variable presets object itself: its structure, and the values its presets carry read
// against the variable definition. Does nothing when the option is absent - a survey linted
// without a presets object has no presets to be wrong about.
export const variablePresetRule: ILintRule = {
  id: "variable/preset",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const source = ctx.options.variablePresets;
    if (!source || !ctx.variablePresets) return;
    if (!checkDefinition(ctx)) return;
    const presets = source.presets;
    if (!isPresent(presets)) return;
    if (!Array.isArray(presets)) {
      ctx.report({
        message: "variablePresets.presets is not an array, so no preset is declared.",
        path: ROOT_PATH + ".presets",
        reason: reasons.presetsNotAnArray,
        messageData: { presetsType: isRecord(presets) ? "object" : typeof presets },
      });
      return;
    }
    const firstByName: { [name: string]: number } = Object.create(null);
    presets.forEach((preset, index) => checkPreset(ctx, preset, index, firstByName));
  },
};
