import { ILintFinding, ILintRuleInfo, ISurveyLintOptions, ISurveyLintResult } from "./types";
import { LintContext, resolveSeverity } from "./rule";
import { allRules } from "./rules/index";
import { buildIndex } from "./walker";

export * from "./types";
export { renderFindings } from "./renderer";

export function getRules(): Array<ILintRuleInfo> {
  return allRules.map(rule => ({ id: rule.id, defaultSeverity: rule.defaultSeverity }));
}

function compareFindings(a: ILintFinding, b: ILintFinding): number {
  if (a.path !== b.path) return a.path < b.path ? -1 : 1;
  if (a.ruleId !== b.ruleId) return a.ruleId < b.ruleId ? -1 : 1;
  return 0;
}

export function lintSurvey(json: any, options?: ISurveyLintOptions): ISurveyLintResult {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new TypeError("lintSurvey expects a survey JSON object. Parse JSON strings with JSON.parse before calling.");
  }
  const opts: ISurveyLintOptions = options || {};
  const index = buildIndex(json, opts);
  const ctx = new LintContext(index, opts);
  allRules.forEach(rule => {
    const severity = resolveSeverity(rule, opts);
    if (severity === "off") return;
    ctx.setCurrentRule(rule.id, severity);
    rule.run(ctx);
  });
  ctx.findings.sort(compareFindings);
  ctx.suppressed.sort(compareFindings);
  const result: ISurveyLintResult = {
    findings: ctx.findings,
    errorCount: ctx.findings.filter(f => f.severity === "error").length,
    warningCount: ctx.findings.filter(f => f.severity === "warning").length,
    infoCount: ctx.findings.filter(f => f.severity === "info").length,
    suppressedCount: ctx.suppressed.length,
  };
  if (opts.reportSuppressed) result.suppressed = ctx.suppressed;
  return result;
}
