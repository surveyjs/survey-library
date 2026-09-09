import { ISurveyVariablePresets, SurveyModel } from "survey-core";

export type LintSeverity = "error" | "warning" | "info" | "off";
export type LintFindingSeverity = "error" | "warning" | "info";

export interface ISuppression {
  ruleId?: string;
  elementName?: string;
  // exact path, or a prefix form ending with ".*" (e.g. "pages[2].*")
  path?: string;
}

export interface IComponentDef {
  questionJSON?: any;
  elementsJSON?: Array<any>;
}

export interface ISurveyLintOptions {
  rules?: { [ruleId: string]: LintSeverity };
  suppress?: Array<ISuppression>;
  knownVariables?: Array<string>;
  knownFunctions?: Array<string>;
  components?: { [typeName: string]: IComponentDef };
  reportSuppressed?: boolean;
  // The host's variable definition and its named presets - the object survey-core declares and
  // the tester carries at the root of a suite too. The definition's questions are a second
  // source of known variable names next to knownVariables, and the presets are checked against
  // them. Everything inside the object is data the variable/preset rule reports on; only the
  // object itself has to be one.
  variablePresets?: ISurveyVariablePresets;
  // The definition the host already has as a model. It wins over variablePresets.definition,
  // which is then never loaded: the JSON is not always the truth - a definition with custom
  // question types, with choices assigned in code, or one a Creator is editing right now is a
  // model first - and not always cheap, since a host that lints on every keystroke would
  // otherwise pay a fromJSON of the definition per call. The model is borrowed, never owned:
  // the run disposes nothing and loads nothing into it. What it does change is the model's
  // data, which validateVariables overwrites with the values of every preset it checks, so
  // this must be an instrument and not a definition someone is filling in at the same time.
  variableDefinitionModel?: SurveyModel;
}

export interface ILintReproductionExpect {
  visible?: { [name: string]: boolean };
  calculatedValue?: { [name: string]: any };
}

export type LintReproductionStep = { set: { [name: string]: any } } | { expect: ILintReproductionExpect };

export interface ILintReproduction {
  description?: string;
  // one of SurveyLintReproductionReasons - the localizable form of "description"
  reason?: string;
  steps: Array<LintReproductionStep>;
}

export interface ILintRelated {
  path: string;
  elementName?: string;
}

export interface ILintHint {
  // one of SurveyLintHintReasons
  reason: string;
  // the expression variable the hint is about, as configured in settings.expressionVariables
  name: string;
}

export interface ILintFinding {
  ruleId: string;
  severity: LintFindingSeverity;
  // ready to show to a human, in English
  message: string;
  // one of SurveyLintReasons[ruleId] - which branch of the rule's message this is. A host that
  // localizes composes its own sentence from (ruleId, reason) plus messageData.
  reason?: string;
  messageData: { [key: string]: any };
  // the scope hint appended to the message, when there is one. Independent of "reason".
  hint?: ILintHint;
  path: string;
  elementName?: string;
  elementType?: string;
  suggestion?: string;
  related?: Array<ILintRelated>;
  reproduction?: ILintReproduction;
}

export interface ISurveyLintResult {
  findings: Array<ILintFinding>;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  suppressedCount: number;
  suppressed?: Array<ILintFinding>;
}

export interface ILintRuleInfo {
  id: string;
  defaultSeverity: LintFindingSeverity;
}

export interface IRenderOptions {
  includeSuppressed?: boolean;
}

export interface SeverityCounts {
  error: number;
  warning: number;
  info: number;
}

export function countBySeverity(findings: Array<ILintFinding>): SeverityCounts {
  const res: SeverityCounts = { error: 0, warning: 0, info: 0 };
  findings.forEach(finding => {
    if (finding.severity === "error") res.error++;
    else if (finding.severity === "warning") res.warning++;
    else res.info++;
  });
  return res;
}
