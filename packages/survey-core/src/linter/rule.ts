import {
  ILintFinding, ISurveyLintOptions, ISuppression, LintFindingSeverity, LintSeverity,
} from "./types";
import { SurveyIndex } from "./symbols";
import { LintMetadata } from "./metadata";

export interface ILintRule {
  id: string;
  defaultSeverity: LintFindingSeverity;
  run(ctx: LintContext): void;
}

export function resolveSeverity(rule: ILintRule, options: ISurveyLintOptions): LintSeverity {
  const rules = options.rules;
  if (rules && Object.prototype.hasOwnProperty.call(rules, rule.id)) {
    const val = rules[rule.id];
    if (val === "error" || val === "warning" || val === "info" || val === "off") return val;
  }
  return rule.defaultSeverity;
}

function matchesPath(pattern: string, path: string): boolean {
  if (pattern.endsWith(".*")) {
    const prefix = pattern.substring(0, pattern.length - 2);
    return path === prefix || path.indexOf(prefix + ".") === 0 || path.indexOf(prefix + "[") === 0;
  }
  return path === pattern;
}

export function isSuppressed(finding: ILintFinding, suppressions: Array<ISuppression>): boolean {
  if (!Array.isArray(suppressions)) return false;
  return suppressions.some(sup => {
    if (!sup) return false;
    if (!sup.ruleId && !sup.elementName && !sup.path) return false;
    if (sup.ruleId && sup.ruleId !== finding.ruleId) return false;
    if (sup.elementName) {
      if (!finding.elementName) return false;
      if (sup.elementName.toLowerCase() !== finding.elementName.toLowerCase()) return false;
    }
    if (sup.path && !matchesPath(sup.path, finding.path)) return false;
    return true;
  });
}

export type ReportInput = {
  message: string,
  path: string,
  messageData?: { [key: string]: any },
  elementName?: string,
  elementType?: string,
  suggestion?: string,
  related?: ILintFinding["related"],
  reproduction?: ILintFinding["reproduction"],
};

export class LintContext {
  public findings: Array<ILintFinding> = [];
  public suppressed: Array<ILintFinding> = [];
  private currentRuleId: string;
  private currentSeverity: LintFindingSeverity;
  constructor(public index: SurveyIndex, public options: ISurveyLintOptions,
    public metadata: LintMetadata) {}
  public setCurrentRule(ruleId: string, severity: LintFindingSeverity): void {
    this.currentRuleId = ruleId;
    this.currentSeverity = severity;
  }
  public report(input: ReportInput): void {
    const finding: ILintFinding = {
      ruleId: this.currentRuleId,
      severity: this.currentSeverity,
      message: input.message,
      messageData: input.messageData || {},
      path: input.path,
    };
    if (input.elementName) finding.elementName = input.elementName;
    if (input.elementType) finding.elementType = input.elementType;
    if (input.suggestion) finding.suggestion = input.suggestion;
    if (input.related && input.related.length > 0) finding.related = input.related;
    if (input.reproduction) finding.reproduction = input.reproduction;
    if (isSuppressed(finding, this.options.suppress)) {
      this.suppressed.push(finding);
    } else {
      this.findings.push(finding);
    }
  }
}
