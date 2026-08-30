import {
  ILintFinding, ILintHint, ISurveyLintOptions, ISuppression, LintFindingSeverity, LintSeverity,
} from "./types";
import { ExpressionSite, SurveyIndex } from "./symbols";
import { LintMetadata } from "./metadata";
import { ConditionSemanticsVerdict, getConditionSemanticsVerdict } from "./expression-utils";
import { buildConstantEnv, ConstantEnv, FoldedCondition, foldCondition } from "./constant-env";

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
  // one of SurveyLintReasons[ruleId]
  reason?: string,
  messageData?: { [key: string]: any },
  hint?: ILintHint,
  elementName?: string,
  elementType?: string,
  suggestion?: string,
  related?: ILintFinding["related"],
  reproduction?: ILintFinding["reproduction"],
};

// What the analysis concluded about one condition. "fold" is set only when the verdict came
// from folding references to constant sources, and carries the values that decided it.
export interface ConditionVerdict {
  verdict?: ConditionSemanticsVerdict;
  fold?: FoldedCondition;
}

export class LintContext {
  public findings: Array<ILintFinding> = [];
  public suppressed: Array<ILintFinding> = [];
  private currentRuleId: string;
  private currentSeverity: LintFindingSeverity;
  private constantEnv: ConstantEnv;
  // several rules ask about the same site, and a verdict now costs an evaluation
  private verdicts = new Map<ExpressionSite, ConditionVerdict>();
  constructor(public index: SurveyIndex, public options: ISurveyLintOptions,
    public metadata: LintMetadata) {}
  public getConstantEnv(): ConstantEnv {
    if (!this.constantEnv) {
      this.constantEnv = buildConstantEnv(this.index, this.options);
    }
    return this.constantEnv;
  }
  public getConditionVerdict(site: ExpressionSite): ConditionVerdict {
    let res = this.verdicts.get(site);
    if (!res) {
      res = this.calcConditionVerdict(site);
      this.verdicts.set(site, res);
    }
    return res;
  }
  // The core's own semantic check comes first: when it already names the defect, its verdict is
  // the more specific one and folding must not restate it under a different reason.
  private calcConditionVerdict(site: ExpressionSite): ConditionVerdict {
    const core = getConditionSemanticsVerdict(site);
    if (!!core) return { verdict: core };
    const fold = foldCondition(site, this.getConstantEnv());
    if (!fold) return {};
    if (!fold.value) return { verdict: "alwaysFalseViaConstants", fold: fold };
    // "always holds" needs the value to be there at all: a source that can be hidden loses it
    if (fold.used.some(source => !source.allowsAlwaysTrue)) return {};
    return { verdict: "alwaysTrueViaConstants", fold: fold };
  }
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
    if (input.reason) finding.reason = input.reason;
    if (input.hint) finding.hint = input.hint;
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
