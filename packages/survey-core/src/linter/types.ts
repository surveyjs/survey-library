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
}

export interface ILintReproductionExpect {
  visible?: { [name: string]: boolean };
  calculatedValue?: { [name: string]: any };
}

export type LintReproductionStep = { set: { [name: string]: any } } | { expect: ILintReproductionExpect };

export interface ILintReproduction {
  description?: string;
  steps: Array<LintReproductionStep>;
}

export interface ILintRelated {
  path: string;
  elementName?: string;
}

export interface ILintFinding {
  ruleId: string;
  severity: LintFindingSeverity;
  message: string;
  messageData: { [key: string]: any };
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
