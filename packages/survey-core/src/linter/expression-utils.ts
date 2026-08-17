import { ConditionsParser } from "../conditions/conditionsParser";
import { Operand, Variable, FunctionOperand } from "../expressions/expressions";
import { settings } from "../settings";
import { ISurveyLintOptions } from "./types";
import { closestMatch } from "./levenshtein";
import {
  ElementRecord, ExpressionSite, NameRef, ParsedRef, ParsedRefSegment, ScopeFrame,
  ScopeFrameComposite, ScopeFrameItemValue, ScopeFrameMatrixRow, ScopeFramePanelDynamic,
  SurveyIndex, CIMultiMap,
} from "./symbols";

export interface ParseOutcome {
  ast?: Operand;
  error?: { at?: number, message?: string };
}

export function parseExpressionText(text: string): ParseOutcome {
  const parser = new ConditionsParser();
  const ast = parser.parseExpression(text);
  if (ast) return { ast: ast };
  const err = parser.error;
  if (err) return { error: { at: err.at, message: err.code } };
  return { error: { message: "The expression cannot be parsed." } };
}

export function collectOperands(ast: Operand): Array<Operand> {
  const list: Array<Operand> = [];
  ast.addOperandsToList(list);
  return list;
}

export function getVariableOperands(ast: Operand): Array<Variable> {
  return <Array<Variable>>collectOperands(ast).filter(op => op.getType() === "variable");
}

export function getFunctionOperands(ast: Operand): Array<FunctionOperand> {
  return <Array<FunctionOperand>>collectOperands(ast).filter(op => op.getType() === "function");
}

// Mirrors ValueGetter.getPath: split on "." with a trailing "[n]" index per segment.
export function splitRefSegments(name: string): Array<ParsedRefSegment> {
  const res: Array<ParsedRefSegment> = [];
  name.split(".").forEach(part => {
    let index: number = undefined;
    let segName = part;
    if (part.lastIndexOf("]") === part.length - 1) {
      const ind = part.lastIndexOf("[");
      if (ind > -1) {
        const parsed = parseInt(part.substring(ind + 1, part.length - 1), 10);
        if (!isNaN(parsed)) {
          index = parsed;
          segName = part.substring(0, ind);
        }
      }
    }
    res.push(index === undefined ? { name: segName } : { name: segName, index: index });
  });
  return res;
}

function findFrame<T extends ScopeFrame>(scope: Array<ScopeFrame>, kind: T["kind"]): T | undefined {
  for (let i = scope.length - 1; i >= 0; i--) {
    if (scope[i].kind === kind) return <T>scope[i];
  }
  return undefined;
}

function getStaticPanelAncestor(owner: ElementRecord): ElementRecord | undefined {
  let current = owner ? owner.parent : undefined;
  while(current) {
    if (current.kind === "panel") return current;
    current = current.parent;
  }
  return undefined;
}

function equalsCI(a: string, b: string): boolean {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase();
}

function isKnownVariable(name: string, options: ISurveyLintOptions): boolean {
  const vars = options.knownVariables;
  if (!Array.isArray(vars)) return false;
  return vars.some(v => equalsCI(v, name));
}

function rootCandidates(index: SurveyIndex, options: ISurveyLintOptions): Array<string> {
  const res: Array<string> = [];
  index.byName.forEach((values, name) => res.push(name));
  index.byValueName.forEach((values, name) => res.push(name));
  index.calculatedValues.forEach((value, name) => res.push(name));
  if (Array.isArray(options.knownVariables)) res.push(...options.knownVariables);
  return res;
}

interface ScopeResolution {
  handled: boolean;
  ref?: ParsedRef;
  // set when the root word looks like a scope prefix but the scope is not active
  inactiveHint?: string;
}

function scopedResolved(ref: ParsedRef, prefix: string): ParsedRef {
  ref.status = "scoped-resolved";
  ref.resolvedKind = "scope";
  ref.scopePrefix = prefix;
  return ref;
}

function scopedUnknown(ref: ParsedRef, prefix: string, segmentIndex: number, candidates: Array<string>): ParsedRef {
  ref.status = "scoped-unknown";
  ref.scopePrefix = prefix;
  ref.unknownSegmentIndex = segmentIndex;
  ref.suggestion = closestMatch(ref.segments[segmentIndex].name, candidates);
  return ref;
}

function validateInnerName(ref: ParsedRef, prefix: string, map: CIMultiMap<ElementRecord>): ParsedRef {
  if (ref.segments.length < 2) return scopedResolved(ref, prefix);
  const inner = ref.segments[1].name;
  const record = map.first(inner);
  if (record) {
    scopedResolved(ref, prefix);
    ref.resolvedTo = record;
    return ref;
  }
  return scopedUnknown(ref, prefix, 1, map.names());
}

function tryResolveScopePrefix(ref: ParsedRef, site: { owner?: ElementRecord, scope: Array<ScopeFrame> }): ScopeResolution {
  const vars = settings.expressionVariables;
  const root = ref.segments[0].name;
  const scope = site.scope || [];
  const matrixFrame = findFrame<ScopeFrameMatrixRow>(scope, "matrixRow");
  const panelFrame = findFrame<ScopeFramePanelDynamic>(scope, "panelDynamic");
  const itemFrame = findFrame<ScopeFrameItemValue>(scope, "itemValue");
  const compositeFrame = findFrame<ScopeFrameComposite>(scope, "composite");

  const rowPrefixes = [vars.row, vars.prevRow, vars.nextRow, vars.totalRow];
  for (let i = 0; i < rowPrefixes.length; i++) {
    if (equalsCI(root, rowPrefixes[i])) {
      if (!matrixFrame) return { handled: false, inactiveHint: "\"" + rowPrefixes[i] + ".\" references are only available inside a matrix cell or a matrix detail panel." };
      return { handled: true, ref: validateInnerName(ref, rowPrefixes[i], matrixFrame.columns) };
    }
  }
  const rowStandalone = [vars.rowIndex, vars.visibleRowIndex, vars.rowValue, vars.rowName, vars.rowTitle, vars.matrix];
  for (let i = 0; i < rowStandalone.length; i++) {
    if (equalsCI(root, rowStandalone[i])) {
      if (!matrixFrame) return { handled: false, inactiveHint: "\"" + rowStandalone[i] + "\" is only available inside a matrix cell or a matrix detail panel." };
      return { handled: true, ref: scopedResolved(ref, rowStandalone[i]) };
    }
  }
  if (equalsCI(root, vars.panel)) {
    if (panelFrame) return { handled: true, ref: validateInnerName(ref, vars.panel, panelFrame.templateNames) };
    const staticPanel = getStaticPanelAncestor(site.owner);
    if (staticPanel && staticPanel.panelDescendantNames) {
      if (ref.segments.length < 2) return { handled: true, ref: scopedResolved(ref, vars.panel) };
      const inner = ref.segments[1].name;
      if (staticPanel.panelDescendantNames.has(inner)) return { handled: true, ref: scopedResolved(ref, vars.panel) };
      return { handled: true, ref: scopedUnknown(ref, vars.panel, 1, staticPanel.panelDescendantNames.names()) };
    }
    return { handled: false, inactiveHint: "\"" + vars.panel + ".\" references are only available inside a dynamic panel or a panel container." };
  }
  const panelSiblings = [vars.prevPanel, vars.nextPanel];
  for (let i = 0; i < panelSiblings.length; i++) {
    if (equalsCI(root, panelSiblings[i])) {
      if (!panelFrame) return { handled: false, inactiveHint: "\"" + panelSiblings[i] + ".\" references are only available inside a dynamic panel." };
      return { handled: true, ref: validateInnerName(ref, panelSiblings[i], panelFrame.templateNames) };
    }
  }
  const panelStandalone = [vars.parentPanel, vars.panelIndex, vars.visiblePanelIndex];
  for (let i = 0; i < panelStandalone.length; i++) {
    if (equalsCI(root, panelStandalone[i])) {
      if (!panelFrame) return { handled: false, inactiveHint: "\"" + panelStandalone[i] + "\" is only available inside a dynamic panel." };
      return { handled: true, ref: scopedResolved(ref, panelStandalone[i]) };
    }
  }
  const itemPrefixes = [vars.item, vars.choice, vars.column];
  for (let i = 0; i < itemPrefixes.length; i++) {
    if (equalsCI(root, itemPrefixes[i])) {
      if (!itemFrame) return { handled: false, inactiveHint: "\"" + itemPrefixes[i] + "\" is only available inside choice/row/column conditions." };
      return { handled: true, ref: scopedResolved(ref, itemPrefixes[i]) };
    }
  }
  if (equalsCI(root, vars.composite)) {
    if (!compositeFrame) return { handled: false, inactiveHint: "\"" + vars.composite + ".\" references are only available inside a composite question." };
    if (compositeFrame.fieldNames.size === 0 || ref.segments.length < 2) {
      return { handled: true, ref: scopedResolved(ref, vars.composite) };
    }
    const inner = ref.segments[1].name;
    if (compositeFrame.fieldNames.has(inner)) return { handled: true, ref: scopedResolved(ref, vars.composite) };
    return { handled: true, ref: scopedUnknown(ref, vars.composite, 1, compositeFrame.fieldNames.names()) };
  }
  if (equalsCI(root, vars.self) || equalsCI(root, vars.parent) || equalsCI(root, vars.survey)) {
    return { handled: true, ref: scopedResolved(ref, root) };
  }
  return { handled: false };
}

function validateElementSubPath(ref: ParsedRef, record: ElementRecord): void {
  if (ref.segments.length < 2) return;
  const seg1 = ref.segments[1];
  if (record.type === "multipletext" && record.multipleTextItems) {
    if (!record.multipleTextItems.has(seg1.name)) {
      ref.status = "unknown";
      ref.unknownSegmentIndex = 1;
      ref.suggestion = closestMatch(seg1.name, record.multipleTextItems.names());
    }
    return;
  }
  if ((record.type === "matrix" || record.type === "matrixdropdown") && Array.isArray(record.matrixRowValues)) {
    const rowKnown = record.matrixRowValues.some(v => equalsCI(String(v), seg1.name));
    if (!rowKnown) {
      ref.status = "unknown";
      ref.unknownSegmentIndex = 1;
      ref.suggestion = closestMatch(seg1.name, record.matrixRowValues.map(v => String(v)));
      return;
    }
    if (record.type === "matrixdropdown" && ref.segments.length > 2 && record.matrixColumns) {
      const seg2 = ref.segments[2];
      if (!record.matrixColumns.has(seg2.name)) {
        ref.status = "unknown";
        ref.unknownSegmentIndex = 2;
        ref.suggestion = closestMatch(seg2.name, record.matrixColumns.names());
      }
    }
    return;
  }
  if (record.type === "matrixdynamic" && record.matrixColumns) {
    // {mdyn[0].col} - the index is attached to the root segment
    if (ref.segments[0].index === undefined) return;
    if (!record.matrixColumns.has(seg1.name)) {
      ref.status = "unknown";
      ref.unknownSegmentIndex = 1;
      ref.suggestion = closestMatch(seg1.name, record.matrixColumns.names());
    }
    return;
  }
  if (record.type === "paneldynamic" && record.templateNames) {
    if (ref.segments[0].index === undefined) return;
    if (!record.templateNames.has(seg1.name)) {
      ref.status = "unknown";
      ref.unknownSegmentIndex = 1;
      ref.suggestion = closestMatch(seg1.name, record.templateNames.names());
    }
    return;
  }
  if (record.componentFieldNames && record.componentFieldNames.size > 0) {
    if (!record.componentFieldNames.has(seg1.name)) {
      ref.status = "unknown";
      ref.unknownSegmentIndex = 1;
      ref.suggestion = closestMatch(seg1.name, record.componentFieldNames.names());
    }
    return;
  }
  // every other type (custom/unknown, expression, checkbox indexes, ...): stay lenient
}

function stripUnwrapPostfix(name: string): string {
  const postfix = settings.expressionVariables.unwrapPostfix;
  if (!!postfix && name.length > postfix.length && name.endsWith(postfix)) {
    return name.substring(0, name.length - postfix.length);
  }
  return name;
}

// The "-total" data key of a matrixdropdown/matrixdynamic total row: {matrix1-total.col1}
function tryResolveMatrixTotal(ref: ParsedRef, root: string, index: SurveyIndex): boolean {
  const suffix = "-total";
  if (!root.toLowerCase().endsWith(suffix)) return false;
  const base = root.substring(0, root.length - suffix.length);
  const record = <ElementRecord>index.byName.first(base);
  if (!record || (record.type !== "matrixdropdown" && record.type !== "matrixdynamic")) return false;
  ref.status = "resolved";
  ref.resolvedTo = record;
  ref.resolvedKind = "element";
  if (ref.segments.length > 1 && record.matrixColumns && !record.matrixColumns.has(ref.segments[1].name)) {
    ref.status = "unknown";
    ref.unknownSegmentIndex = 1;
    ref.suggestion = closestMatch(ref.segments[1].name, record.matrixColumns.names());
  }
  return true;
}

export function classifyRef(raw: string, site: { owner?: ElementRecord, scope: Array<ScopeFrame> },
  index: SurveyIndex, options: ISurveyLintOptions): ParsedRef {
  const ref: ParsedRef = { raw: raw, segments: [], status: "skipped" };
  if (!raw) return ref;
  let name = raw;
  // {"key": 1}-style JSON object literals are not references
  if (name.indexOf(":") > -1) return ref;
  // element property references ({$q1.isVisible}) are out of scope for v1
  const propPrefix = settings.expressionElementPropertyPrefix;
  if (!!propPrefix && name[0] === propPrefix) return ref;
  const disableConversion = settings.expressionDisableConversionChar;
  if (!!disableConversion && name.length > 1 && name[0] === disableConversion) {
    name = name.substring(1);
  }
  ref.segments = splitRefSegments(name);
  if (ref.segments.length === 0 || !ref.segments[0].name) return ref;
  // a single trailing ".length" is valid whenever the base reference is
  if (ref.segments.length > 1 && ref.segments[ref.segments.length - 1].name === "length") {
    ref.segments = ref.segments.slice(0, ref.segments.length - 1);
  }
  ref.segments[0] = { name: stripUnwrapPostfix(ref.segments[0].name), index: ref.segments[0].index };
  const root = ref.segments[0].name;

  const scopeRes = tryResolveScopePrefix(ref, site);
  if (scopeRes.handled) return scopeRes.ref;

  const record = <ElementRecord>index.byName.first(root) || <ElementRecord>index.byValueName.first(root);
  if (record) {
    ref.status = "resolved";
    ref.resolvedTo = record;
    ref.resolvedKind = record.kind === "page" ? "page" : "element";
    if (record.kind !== "page") validateElementSubPath(ref, record);
    return ref;
  }
  if (index.calculatedValues.has(root)) {
    ref.status = "resolved";
    ref.resolvedKind = "calculatedValue";
    return ref;
  }
  if (isKnownVariable(root, options)) {
    ref.status = "resolved";
    ref.resolvedKind = "knownVariable";
    return ref;
  }
  if (tryResolveMatrixTotal(ref, root, index)) return ref;

  ref.status = "unknown";
  ref.unknownSegmentIndex = 0;
  if (scopeRes.inactiveHint) ref.scopeHint = scopeRes.inactiveHint;
  // a bare name that exists in the enclosing template/matrix scope needs its prefix
  const panelFrame = findFrame<ScopeFramePanelDynamic>(site.scope || [], "panelDynamic");
  const matrixFrame = findFrame<ScopeFrameMatrixRow>(site.scope || [], "matrixRow");
  if (matrixFrame && matrixFrame.columns.has(root)) {
    ref.suggestion = settings.expressionVariables.row + "." + root;
    ref.scopeHint = "\"" + root + "\" is a column of this matrix - reference it as {" + ref.suggestion + "}.";
  } else if (panelFrame && panelFrame.templateNames.has(root)) {
    ref.suggestion = settings.expressionVariables.panel + "." + root;
    ref.scopeHint = "\"" + root + "\" is a question of this dynamic panel - reference it as {" + ref.suggestion + "}.";
  } else {
    ref.suggestion = closestMatch(root, rootCandidates(index, options));
  }
  return ref;
}

export function classifySiteRefs(site: ExpressionSite, index: SurveyIndex, options: ISurveyLintOptions): Array<ParsedRef> {
  if (site.refs) return site.refs;
  if (!site.ast) {
    site.refs = [];
    return site.refs;
  }
  site.refs = getVariableOperands(site.ast).map(variable =>
    classifyRef(variable.variable, site, index, options));
  return site.refs;
}

export function classifyNameRef(nameRef: NameRef, index: SurveyIndex, options: ISurveyLintOptions): ParsedRef {
  return classifyRef(nameRef.name, { owner: nameRef.owner, scope: nameRef.scope }, index, options);
}
