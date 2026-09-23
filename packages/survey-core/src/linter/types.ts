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
  // Names a new element for a fix that has to invent one. "nameKind" is "page", "panel" or
  // "question"; "taken" is every name the document already spells, plus the ones this run has
  // handed out. A host that shows its user another language spells the name in it - the linter
  // knows only the English words - and one that passes nothing gets "question1" and its kin.
  newElementName?: (nameKind: string, taken: Array<string>) => string;
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

// A machine-applicable repair of one finding, addressed the way the finding itself is: by a path
// into the linted JSON. The linter never sees the document text, so an edit says what to change
// and not where in the text it stands - a host that edits text resolves the path itself.
export type LintFixOp = "set" | "remove" | "rename" | "wrap";

export interface ILintFixEdit {
  op: LintFixOp;
  // addresses the linted JSON the way ILintFinding.path does. "set" names the property to write
  // and is the one op whose last segment may be missing; the others name what is already there.
  path: string;
  // "set": the new value. A scalar or a string the linter composed, never a piece of the document
  // itself - so a host that writes an edit back into text never copies an annotation into it.
  value?: any;
  // "rename": the name the key takes
  key?: string;
}

export interface ILintFix {
  // one of SurveyLintFixReasons[ruleId] - what the repair does, for a host that labels it
  reason: string;
  edits: Array<ILintFixEdit>;
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
  // the repair to offer, when the defect has exactly one mechanical one
  fix?: ILintFix;
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
