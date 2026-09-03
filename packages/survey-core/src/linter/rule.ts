import {
  ILintFinding, ILintHint, ISurveyLintOptions, ISuppression, LintFindingSeverity, LintSeverity,
} from "./types";
import { ElementRecord, ExpressionSite, ParsedRef, SurveyIndex } from "./symbols";
import { LintMetadata } from "./metadata";
import {
  ConditionSemanticsVerdict, ConstResolver, getConditionSemanticsVerdict, isAlwaysFalseVerdict,
} from "./expression-utils";
import { buildConstantEnv, ConstantEnv } from "./constant-env";
import { getIifConditionSubSites } from "./condition-subsites";
import { FoldedCondition, foldCondition, getConstResolver } from "./condition-eval";
import { analyzeNeverVisible, NeverVisibleAnalysis } from "./never-visible";
import { getRecordValueDomain, getValueDomain, ValueDomain } from "./value-domain";
import { PropertyWalkResult, walkProperties } from "./property-walk";

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

function isSuppressed(finding: ILintFinding, suppressions: Array<ISuppression>): boolean {
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

// reportAtSite fills path, elementName and elementType from the site; "path" stays available
// for a finding that points at a property of the site rather than at the site itself.
export type SiteReportInput = Omit<ReportInput, "path" | "elementName" | "elementType"> & {
  path?: string,
};

// What the analysis concluded about one condition. "fold" is set only when the verdict came
// from folding references to constant sources, and carries the values that decided it.
export interface ConditionVerdict {
  verdict?: ConditionSemanticsVerdict;
  fold?: FoldedCondition;
}

// Which expression sites a rule visits. The walker sets exactly one of ast/parseError on a
// site, so "parsed" and "unparsable" partition the sites; "condition" narrows "parsed" to
// sites whose result gates something.
export type SiteFilter = "parsed" | "condition" | "unparsable";

export class LintContext {
  public findings: Array<ILintFinding> = [];
  public suppressed: Array<ILintFinding> = [];
  private currentRuleId: string;
  private currentSeverity: LintFindingSeverity;
  private constantEnv: ConstantEnv;
  private propertyWalk: PropertyWalkResult;
  // several rules ask about the same site, and a verdict now costs an evaluation
  private verdicts = new Map<ExpressionSite, ConditionVerdict>();
  // several rules ask about the same record, and a domain costs rebuilding the value set
  private valueDomains = new Map<ElementRecord, ValueDomain | undefined>();
  private neverVisible: NeverVisibleAnalysis;
  constructor(public index: SurveyIndex, public options: ISurveyLintOptions,
    public metadata: LintMetadata) {}
  public forEachSite(filter: SiteFilter, cb: (site: ExpressionSite) => void): void {
    this.index.expressionSites.forEach(site => {
      if (filter === "unparsable") {
        if (!site.parseError) return;
      } else if (!site.ast || (filter === "condition" && site.kind !== "condition")) {
        return;
      }
      cb(site);
    });
  }
  // The synthesized iif() condition sub-sites of every parsed site, for the rules whose
  // reasoning needs a condition root and cannot run on a whole expression.
  public forEachIifCondition(cb: (site: ExpressionSite) => void): void {
    this.forEachSite("parsed", site => getIifConditionSubSites(site).forEach(cb));
  }
  // The property-level view of the JSON, shared by the property/* rules.
  public getPropertyWalk(): PropertyWalkResult {
    if (!this.propertyWalk) {
      this.propertyWalk = walkProperties(this.index.json, this.metadata, this.options, this.index.settings);
    }
    return this.propertyWalk;
  }
  public getConstantEnv(): ConstantEnv {
    if (!this.constantEnv) {
      this.constantEnv = buildConstantEnv(this.index, this.options);
    }
    return this.constantEnv;
  }
  public getConstResolver(site: ExpressionSite): ConstResolver {
    return getConstResolver(site, this.getConstantEnv());
  }
  public getRecordValueDomain(record: ElementRecord): ValueDomain | undefined {
    if (!this.valueDomains.has(record)) {
      this.valueDomains.set(record, getRecordValueDomain(record, this.index));
    }
    return this.valueDomains.get(record);
  }
  public getValueDomain(ref: ParsedRef): ValueDomain | undefined {
    return getValueDomain(ref, this.index, record => this.getRecordValueDomain(record));
  }
  // The elements whose own visibleIf can never hold. Only "visibleIf" counts: choicesVisibleIf
  // and rowsVisibleIf hide items inside a question, and templateVisibleIf hides single panels
  // of a dynamic panel - none of them stops the element itself from rendering.
  // The base set comes from the memoized verdicts; analyzeNeverVisible then cascades it
  // through conditions that demand a value of a dead-and-valueless question.
  public getNeverVisibleAnalysis(): NeverVisibleAnalysis {
    if (!this.neverVisible) {
      const baseDead = new Set<ElementRecord>();
      this.forEachSite("condition", site => {
        if (site.prop !== "visibleIf" || !site.owner) return;
        if (isAlwaysFalseVerdict(this.getConditionVerdict(site).verdict)) baseDead.add(site.owner);
      });
      this.neverVisible = analyzeNeverVisible({
        index: this.index,
        options: this.options,
        baseEnv: this.getConstantEnv(),
        baseDead: baseDead,
        recordDomain: record => this.getRecordValueDomain(record),
      });
    }
    return this.neverVisible;
  }
  public getNeverVisibleElements(): Set<ElementRecord> {
    return this.getNeverVisibleAnalysis().dead;
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
    const fold = foldCondition(site, this.getConstantEnv(), record => this.getRecordValueDomain(record));
    if (!fold) return {};
    if (!fold.value) {
      // whichever mechanism settled it gives the most concrete explanation of why
      let verdict: ConditionSemanticsVerdict = "alwaysFalseViaConstants";
      if (fold.conflicts.length > 0) verdict = "unsatisfiable";
      else if (fold.ranges.length > 0) verdict = "outOfRange";
      return { verdict: verdict, fold: fold };
    }
    // "always holds" needs the value to be there at all: a source that can be hidden loses it
    if (fold.used.some(source => !source.allowsAlwaysTrue)) return {};
    return { verdict: "alwaysTrueViaConstants", fold: fold };
  }
  public setCurrentRule(ruleId: string, severity: LintFindingSeverity): void {
    this.currentRuleId = ruleId;
    this.currentSeverity = severity;
  }
  // A finding about one expression site: the site owns the path and the element it belongs to,
  // so a rule states only what it concluded.
  public reportAtSite(site: ExpressionSite, input: SiteReportInput): void {
    this.report({
      ...input,
      path: input.path || site.path,
      elementName: site.owner ? site.owner.name : undefined,
      elementType: site.owner ? site.owner.type : undefined,
    });
  }
  public report(input: ReportInput): void {
    const finding: ILintFinding = {
      ruleId: this.currentRuleId,
      severity: this.currentSeverity,
      message: input.message,
      // the reason is mirrored into messageData: it shipped there before finding.reason
      // existed, and a rule should not have to remember to repeat itself
      messageData: input.reason
        ? { reason: input.reason, ...input.messageData }
        : (input.messageData || {}),
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
