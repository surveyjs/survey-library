import { SurveyModel, SurveyVariablePresets } from "survey-core";
import {
  countBySeverity, ILintFinding, ILintRuleInfo, ISurveyLintOptions, ISurveyLintResult,
} from "./types";
import { LintContext, resolveSeverity } from "./rule";
import { allRules } from "./rules/index";
import { buildIndex } from "./walker";
import { LintMetadata } from "./metadata";

export * from "./types";
export * from "./reasons";
export { renderFindings } from "./renderer";

export function getRules(): Array<ILintRuleInfo> {
  return allRules.map(rule => ({ id: rule.id, defaultSeverity: rule.defaultSeverity }));
}

function compareFindings(a: ILintFinding, b: ILintFinding): number {
  if (a.path !== b.path) return a.path < b.path ? -1 : 1;
  if (a.ruleId !== b.ruleId) return a.ruleId < b.ruleId ? -1 : 1;
  return 0;
}

function isPresent(value: any): boolean {
  return value !== undefined && value !== null;
}

// The container is a document a host stores, so it has to be one: a string, an array or a class
// instance is a call the host got wrong, and it hears about it the way a bad survey JSON does.
// What is *inside* the container - a definition that is not an object, a presets that is not an
// array - is data, and data is what the variable/preset rule reports on rather than throws over.
function isPlainObject(value: any): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

// The definition model is named, not built: the no-model rule of #11693 is about the linted
// document, and this one is the host's, already normalized by the host's own build.
function createVariablePresets(opts: ISurveyLintOptions): SurveyVariablePresets | undefined {
  if (isPresent(opts.variablePresets) && !isPlainObject(opts.variablePresets)) {
    throw new TypeError("lintSurvey expects options.variablePresets to be a variable presets object: { definition?, presets? }.");
  }
  if (isPresent(opts.variableDefinitionModel) && !(opts.variableDefinitionModel instanceof SurveyModel)) {
    throw new TypeError("lintSurvey expects options.variableDefinitionModel to be a SurveyModel.");
  }
  if (!opts.variablePresets && !opts.variableDefinitionModel) return undefined;
  return new SurveyVariablePresets(opts.variablePresets,
    { definitionModel: opts.variableDefinitionModel });
}

export function lintSurvey(json: any, options?: ISurveyLintOptions): ISurveyLintResult {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new TypeError("lintSurvey expects a survey JSON object. Parse JSON strings with JSON.parse before calling.");
  }
  const opts: ISurveyLintOptions = options || {};
  // one companion per run, never a module-level one: two concurrent lintSurvey calls carry two
  // different definitions, and the companion holds the model they are read from
  const variablePresets = createVariablePresets(opts);
  try {
    // one snapshot of the serializer registry per run: it is mutable at runtime, and
    // both the walker and the rules must see the same view of it
    const metadata = new LintMetadata();
    const index = buildIndex(json, opts, metadata, variablePresets);
    const ctx = new LintContext(index, opts, metadata, variablePresets);
    allRules.forEach(rule => {
      const severity = resolveSeverity(rule, opts);
      if (severity === "off") return;
      ctx.setCurrentRule(rule.id, severity);
      rule.run(ctx);
    });
    ctx.findings.sort(compareFindings);
    ctx.suppressed.sort(compareFindings);
    const counts = countBySeverity(ctx.findings);
    const result: ISurveyLintResult = {
      findings: ctx.findings,
      errorCount: counts.error,
      warningCount: counts.warning,
      infoCount: counts.info,
      suppressedCount: ctx.suppressed.length,
    };
    if (opts.reportSuppressed) result.suppressed = ctx.suppressed;
    return result;
  } finally {
    // disposing the run's companion never disposes a model the host handed in, so the host goes
    // on linting with the same one call after call - which is the point of passing one
    if (!!variablePresets) variablePresets.dispose();
  }
}
