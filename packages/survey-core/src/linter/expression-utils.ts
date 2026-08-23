import { ArrayOperand, BinaryOperand, ConditionsParser, Const, FunctionOperand, getBuiltInVariableNames, Operand, ValueGetter, Variable } from "survey-core";
import { ISurveyLintOptions, LintReproductionStep } from "./types";
import { ILintResolvedSettings } from "./lint-settings";
import { closestMatch } from "./levenshtein";
import {
  ElementRecord, ExpressionSite, NameRef, ParsedRef, ParsedRefSegment, ScopeFrame,
  ScopeFrameComposite, ScopeFrameItemValue, ScopeFrameMatrixRow, ScopeFramePanelDynamic,
  SurveyIndex, CIMultiMap, TriggerRecord,
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

// The runtime resolver owns reference-path parsing (including how "[n]" indexes are
// read through Helpers.getNumber), so delegate instead of reimplementing it.
// getPath is stateless, hence the shared instance.
const pathParser = new ValueGetter();

export function splitRefSegments(name: string): Array<ParsedRefSegment> {
  return pathParser.getPath(name);
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

// Names, not values: element names and scope prefixes are matched case-insensitively by
// the runtime resolver no matter what settings.comparator says, so this must NOT become
// Helpers.isTwoValueEquals - that one honours caseSensitive/trimStrings and converts
// numbers, which is right for comparing question VALUES and wrong for names.
export function equalsCI(a: string, b: string): boolean {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase();
}

function endsWithCI(text: string, suffix: string): boolean {
  return !!suffix && text.length > suffix.length && text.toLowerCase().endsWith(suffix.toLowerCase());
}

// The runtime stores a question's comment under name + settings.commentSuffix and
// exposes that key next to the value - in the survey data, in a matrix row and in a
// dynamic-panel value alike. Returns the base name, or undefined when the suffix is absent.
function stripCommentSuffix(name: string, lintSettings: ILintResolvedSettings): string | undefined {
  const suffix = lintSettings.commentSuffix;
  if (!endsWithCI(name, suffix)) return undefined;
  return name.substring(0, name.length - suffix.length);
}

export function isKnownVariable(name: string, options: ISurveyLintOptions): boolean {
  const vars = options.knownVariables;
  if (!Array.isArray(vars)) return false;
  return vars.some(v => equalsCI(v, name));
}

// {pageno}, {locale} and the quiz counters: the survey answers these itself, so they
// carry no declaration in the JSON and must not be reported as unknown. The names come
// from the core's own table (SurveyModel's value getter), so the list cannot drift.
export function builtInVariableNames(): Array<string> {
  return getBuiltInVariableNames();
}

export function isBuiltInVariable(name: string): boolean {
  return !!name && builtInVariableNames().some(v => equalsCI(v, name));
}

function rootCandidates(index: SurveyIndex, options: ISurveyLintOptions): Array<string> {
  const res: Array<string> = [];
  index.byName.forEach((values, name) => res.push(name));
  index.byValueName.forEach((values, name) => res.push(name));
  index.calculatedValues.forEach((value, name) => res.push(name));
  if (Array.isArray(options.knownVariables)) res.push(...options.knownVariables);
  res.push(...builtInVariableNames());
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

function validateInnerName(ref: ParsedRef, prefix: string, map: CIMultiMap<ElementRecord>,
  lintSettings: ILintResolvedSettings): ParsedRef {
  if (ref.segments.length < 2) return scopedResolved(ref, prefix);
  // inner names may contain dots too ({row.col.a} for a column named "col.a") -
  // try progressively longer joins, longest first, like the runtime value walk
  for (let end = ref.segments.length; end > 1; end--) {
    if (!isFoldableRange(ref.segments, 1, end)) continue;
    const inner = ref.segments.slice(1, end).map(seg => seg.name).join(".");
    const record = map.first(inner);
    if (record) {
      scopedResolved(ref, prefix);
      ref.resolvedTo = record;
      return ref;
    }
  }
  // a comment lives next to its value inside the row/panel too ({row.col1-Comment}):
  // resolvedTo stays unset, the comment is a plain string, not the base question
  const commentBase = stripCommentSuffix(ref.segments[1].name, lintSettings);
  if (ref.segments.length === 2 && commentBase && map.has(commentBase)) {
    scopedResolved(ref, prefix);
    ref.resolvedKind = "comment";
    return ref;
  }
  return scopedUnknown(ref, prefix, 1, map.names());
}

function tryResolveScopePrefix(ref: ParsedRef, site: { owner?: ElementRecord, scope: Array<ScopeFrame> },
  lintSettings: ILintResolvedSettings): ScopeResolution {
  const vars = lintSettings.expressionVariables;
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
      return { handled: true, ref: validateInnerName(ref, rowPrefixes[i], matrixFrame.columns, lintSettings) };
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
    if (panelFrame) return { handled: true, ref: validateInnerName(ref, vars.panel, panelFrame.templateNames, lintSettings) };
    const staticPanel = getStaticPanelAncestor(site.owner);
    if (staticPanel && staticPanel.panelDescendantNames) {
      if (ref.segments.length < 2) return { handled: true, ref: scopedResolved(ref, vars.panel) };
      const inner = ref.segments[1].name;
      if (staticPanel.panelDescendantNames.has(inner)) return { handled: true, ref: scopedResolved(ref, vars.panel) };
      const commentBase = stripCommentSuffix(inner, lintSettings);
      if (commentBase && staticPanel.panelDescendantNames.has(commentBase)) {
        const commentRef = scopedResolved(ref, vars.panel);
        commentRef.resolvedKind = "comment";
        return { handled: true, ref: commentRef };
      }
      return { handled: true, ref: scopedUnknown(ref, vars.panel, 1, staticPanel.panelDescendantNames.names()) };
    }
    return { handled: false, inactiveHint: "\"" + vars.panel + ".\" references are only available inside a dynamic panel or a panel container." };
  }
  const panelSiblings = [vars.prevPanel, vars.nextPanel];
  for (let i = 0; i < panelSiblings.length; i++) {
    if (equalsCI(root, panelSiblings[i])) {
      if (!panelFrame) return { handled: false, inactiveHint: "\"" + panelSiblings[i] + ".\" references are only available inside a dynamic panel." };
      return { handled: true, ref: validateInnerName(ref, panelSiblings[i], panelFrame.templateNames, lintSettings) };
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

// segments [start, end) can fold into one dotted name only if none but the last
// carries an index: in {a[0].b} the index makes ".b" a walk into a's value
function isFoldableRange(segments: Array<ParsedRefSegment>, start: number, end: number): boolean {
  for (let i = start; i < end - 1; i++) {
    if (segments[i].index !== undefined) return false;
  }
  return true;
}

// Element/calculated-value names may themselves contain dots ("address.city").
// The runtime resolver re-joins progressively longer dotted prefixes and prefers
// the longest (ValueGetterContextCore.checkValueByPath with isSearchNameRevert),
// so a longer registered name must win over "first segment plus sub-path".
// When a prefix of 2+ segments matches a registered name, collapse it into the
// root segment; the remaining segments stay a sub-path to validate as usual.
function collapseLongestRootName(ref: ParsedRef, index: SurveyIndex, options: ISurveyLintOptions): void {
  for (let end = ref.segments.length; end > 1; end--) {
    if (!isFoldableRange(ref.segments, 0, end)) continue;
    const joined = ref.segments.slice(0, end).map(seg => seg.name).join(".");
    if (!index.byName.has(joined) && !index.byValueName.has(joined) &&
      !index.calculatedValues.has(joined) && !isKnownVariable(joined, options)) {
      continue;
    }
    const last = ref.segments[end - 1];
    const collapsed: ParsedRefSegment = last.index === undefined
      ? { name: joined } : { name: joined, index: last.index };
    ref.segments = [collapsed].concat(ref.segments.slice(end));
    return;
  }
}

function stripUnwrapPostfix(name: string, postfix: string): string {
  if (!!postfix && name.length > postfix.length && name.endsWith(postfix)) {
    return name.substring(0, name.length - postfix.length);
  }
  return name;
}

// The total-row data key of a matrixdropdown/matrixdynamic ({matrix1-total.col1}
// by default); the suffix comes from settings.matrix.totalsSuffix. The runtime keys
// the total row off getValueName(), so a matrix with a valueName is addressed by it.
function tryResolveMatrixTotal(ref: ParsedRef, root: string, index: SurveyIndex): boolean {
  const suffix = index.settings.matrixTotalsSuffix;
  if (!endsWithCI(root, suffix)) return false;
  const base = root.substring(0, root.length - suffix.length);
  const record = <ElementRecord>index.byName.first(base) || <ElementRecord>index.byValueName.first(base);
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

// The comment data key of a question ({q1-Comment} by default): the runtime stores
// comments under name + settings.commentSuffix and exposes them to expressions.
// The comment value is a plain string, so resolvedTo stays unset - typing the ref
// as the base question would misfire the type/choice rules.
function tryResolveCommentSuffix(ref: ParsedRef, root: string, index: SurveyIndex): boolean {
  const base = stripCommentSuffix(root, index.settings);
  if (base === undefined) return false;
  if (!index.byName.has(base) && !index.byValueName.has(base)) return false;
  ref.status = "resolved";
  ref.resolvedKind = "comment";
  return true;
}

// nameOnly: the raw string is a runtime NAME (a trigger target), not an expression
// reference, so none of the expression-only sugar applies - no ":"/property-prefix
// skipping, no conversion-char or unwrap-postfix stripping, no trailing ".length",
// and no scope prefixes (a question may legitimately be named "survey").
function classifyRefCore(raw: string, site: { owner?: ElementRecord, scope: Array<ScopeFrame> },
  index: SurveyIndex, options: ISurveyLintOptions, flags: { nameOnly?: boolean }): ParsedRef {
  const ref: ParsedRef = { raw: raw, segments: [], status: "skipped" };
  if (!raw) return ref;
  const nameOnly = flags.nameOnly === true;
  let name = raw;
  if (!nameOnly) {
    // {"key": 1}-style JSON object literals are not references
    if (name.indexOf(":") > -1) return ref;
    // element property references ({$q1.isVisible}) are out of scope for v1
    const propPrefix = index.settings.expressionElementPropertyPrefix;
    if (!!propPrefix && name[0] === propPrefix) return ref;
    const disableConversion = index.settings.expressionDisableConversionChar;
    if (!!disableConversion && name.length > 1 && name[0] === disableConversion) {
      name = name.substring(1);
    }
  }
  ref.segments = splitRefSegments(name);
  if (ref.segments.length === 0 || !ref.segments[0].name) return ref;
  if (!nameOnly) {
    // a single trailing ".length" is valid whenever the base reference is
    if (ref.segments.length > 1 && ref.segments[ref.segments.length - 1].name === "length") {
      ref.segments = ref.segments.slice(0, ref.segments.length - 1);
    }
    ref.segments[0] = {
      name: stripUnwrapPostfix(ref.segments[0].name, index.settings.expressionVariables.unwrapPostfix),
      index: ref.segments[0].index,
    };
  }

  const scopeRes = nameOnly ? { handled: false } : tryResolveScopePrefix(ref, site, index.settings);
  if (scopeRes.handled) return (<ScopeResolution>scopeRes).ref;

  collapseLongestRootName(ref, index, options);
  const root = ref.segments[0].name;

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
  // A one-segment path only: the runtime answers a built-in for a single name, so
  // {pageno.x} is not one of them. Checked after the element/calculated-value lookup,
  // not before it: the runtime does let a built-in shadow a question of the same name,
  // but a trigger target with that name still addresses the question, and reading such
  // a reference as the question keeps the type rules working on it.
  if (ref.segments.length === 1 && isBuiltInVariable(root)) {
    ref.status = "resolved";
    ref.resolvedKind = "builtInVariable";
    return ref;
  }
  if (tryResolveMatrixTotal(ref, root, index)) return ref;
  if (tryResolveCommentSuffix(ref, root, index)) return ref;

  ref.status = "unknown";
  ref.unknownSegmentIndex = 0;
  const inactiveHint = (<ScopeResolution>scopeRes).inactiveHint;
  if (inactiveHint) ref.scopeHint = inactiveHint;
  // a bare name that exists in the enclosing template/matrix scope needs its prefix
  const panelFrame = findFrame<ScopeFramePanelDynamic>(site.scope || [], "panelDynamic");
  const matrixFrame = findFrame<ScopeFrameMatrixRow>(site.scope || [], "matrixRow");
  if (matrixFrame && matrixFrame.columns.has(root)) {
    ref.suggestion = index.settings.expressionVariables.row + "." + root;
    ref.scopeHint = "\"" + root + "\" is a column of this matrix - reference it as {" + ref.suggestion + "}.";
  } else if (panelFrame && panelFrame.templateNames.has(root)) {
    ref.suggestion = index.settings.expressionVariables.panel + "." + root;
    ref.scopeHint = "\"" + root + "\" is a question of this dynamic panel - reference it as {" + ref.suggestion + "}.";
  } else {
    const candidates = rootCandidates(index, options);
    let suggestion: string = undefined;
    // a typo inside a dotted name ({address.cty}) is closest to the full registered name
    if (ref.segments.length > 1 && isFoldableRange(ref.segments, 0, ref.segments.length)) {
      suggestion = closestMatch(ref.segments.map(seg => seg.name).join("."), candidates);
    }
    ref.suggestion = suggestion || closestMatch(root, candidates);
  }
  return ref;
}

export function classifyRef(raw: string, site: { owner?: ElementRecord, scope: Array<ScopeFrame> },
  index: SurveyIndex, options: ISurveyLintOptions): ParsedRef {
  return classifyRefCore(raw, site, index, options, {});
}

// Resolves a runtime name (a trigger target) through the same chain as expression
// references, so both stay consistent by construction.
export function classifyTargetName(raw: string, index: SurveyIndex, options: ISurveyLintOptions): ParsedRef {
  return classifyRefCore(raw, { scope: [] }, index, options, { nameOnly: true });
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

export interface CarryForwardSource {
  source?: ElementRecord;
  // set when the name carried a row./panel. prefix; candidates are then the names
  // reachable through that prefix, not the survey-level question names
  scopePrefix?: string;
  candidates?: Array<string>;
}

// Mirrors dynamicItemModelBase.findQuestionByName: inside a matrix row or a dynamic
// panel, "<variableName>.<name>" addresses a sibling within that row/panel and anything
// else falls through to the survey. The runtime compares that prefix case-sensitively,
// unlike an expression reference, so this does too.
export function resolveCarryForwardSource(sourceName: string, owner: ElementRecord,
  index: SurveyIndex): CarryForwardSource {
  const vars = index.settings.expressionVariables;
  const scope = owner.scope || [];
  const rowPrefix = vars.row + ".";
  if (sourceName.indexOf(rowPrefix) === 0) {
    const frame = findFrame<ScopeFrameMatrixRow>(scope, "matrixRow");
    const inner = sourceName.substring(rowPrefix.length);
    return {
      source: frame ? frame.columns.first(inner) : undefined,
      scopePrefix: vars.row,
      candidates: frame ? frame.columns.names().map(name => rowPrefix + name) : [],
    };
  }
  const panelPrefix = vars.panel + ".";
  if (sourceName.indexOf(panelPrefix) === 0) {
    const frame = findFrame<ScopeFramePanelDynamic>(scope, "panelDynamic");
    const inner = sourceName.substring(panelPrefix.length);
    return {
      source: frame ? frame.templateNames.first(inner) : undefined,
      scopePrefix: vars.panel,
      candidates: frame ? frame.templateNames.names().map(name => panelPrefix + name) : [],
    };
  }
  return {
    source: <ElementRecord>index.byName.first(sourceName) || <ElementRecord>index.byValueName.first(sourceName),
  };
}

export interface VariableComparison {
  variable: Variable;
  constSide: Operand;
  operator: string;
}

// A BinaryOperand with exactly one Variable side; the other side is returned as-is
// (it may be a Const, an ArrayOperand, or any non-Variable operand - callers narrow).
// operators === undefined accepts any BinaryOperand.
export function matchVariableComparison(op: Operand, operators?: { [op: string]: boolean }): VariableComparison | undefined {
  if (!(op instanceof BinaryOperand)) return undefined;
  if (operators && !operators[op.operator]) return undefined;
  const left = op.leftOperand;
  const right = op.rightOperand;
  if (left instanceof Variable && !(right instanceof Variable)) {
    return { variable: left, constSide: right, operator: op.operator };
  }
  if (right instanceof Variable && !(left instanceof Variable)) {
    return { variable: right, constSide: left, operator: op.operator };
  }
  return undefined;
}

// Variable extends Const, so a plain constant must exclude variables
export function isPlainConst(op: Operand): boolean {
  return op instanceof Const && !(op instanceof Variable);
}

export function getConstValues(op: Operand): Array<any> | undefined {
  if (isPlainConst(op)) return [(<Const>op).correctValue];
  if (op instanceof ArrayOperand) {
    const values: Array<any> = [];
    for (let i = 0; i < op.values.length; i++) {
      if (!isPlainConst(op.values[i])) return undefined;
      values.push((<Const>op.values[i]).correctValue);
    }
    return values;
  }
  return undefined;
}

// best-effort: a single {var} op const comparison gives a concrete "set" step.
// The root is kept as written in the expression, not canonicalized.
export function buildTriggerSetStep(trigger: TriggerRecord, operators?: { [op: string]: boolean }): LintReproductionStep | undefined {
  const ast = trigger.expressionSite ? trigger.expressionSite.ast : undefined;
  if (!ast) return undefined;
  const match = matchVariableComparison(ast, operators);
  if (!match || !isPlainConst(match.constSide)) return undefined;
  const root = splitRefSegments(match.variable.variable)[0];
  if (!root || !root.name || root.name.indexOf(":") > -1) return undefined;
  return { set: { [root.name]: (<Const>match.constSide).correctValue } };
}
