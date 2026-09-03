import { ArrayOperand, BinaryOperand, ConditionsParser, Const, FunctionOperand, getBuiltInVariableNames, IExpressionError, isReturnColumnParam, Operand, ValueGetter, Variable } from "survey-core";
import { FUNCTION_NAME_ARGS, FunctionArgNameScope } from "./catalog";
import { ISurveyLintOptions, LintReproductionStep } from "./types";
import { SurveyLintHintReasons, SurveyLintReasons } from "./reasons";
import { ILintResolvedSettings } from "./lint-settings";
import { closestMatch } from "./levenshtein";
import {
  ElementRecord, ExpressionSite, getEffectiveType, NameRef, ParsedRef, ParsedRefSegment, ScopeFrame,
  ScopeFrameComposite, ScopeFrameItemValue, ScopeFrameMatrixRow, ScopeFramePanelDynamic,
  SurveyIndex, CIMap, CIMultiMap, TriggerRecord, ValueTypeInfo,
  SCOPE_INDEX_VARIABLE_TYPE, SCOPE_ROW_VALUE_TYPE,
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
  return collectOperands(ast).filter((op): op is Variable => op instanceof Variable);
}

export function getFunctionOperands(ast: Operand): Array<FunctionOperand> {
  return collectOperands(ast).filter((op): op is FunctionOperand => op instanceof FunctionOperand);
}

// A value known at lint time. Boxed, so that a value of null or false is still a value.
export interface ConstValue {
  value: any;
}

export type OperatorSet = { [op: string]: boolean };

// The operator vocabulary, declared once: several rules and the satisfiability reasoning
// classify the same operators, and a set written twice is a set that drifts.
export const EQUALITY_OPERATORS: OperatorSet = { equal: true, notequal: true };
export const ORDERING_OPERATORS: OperatorSet = {
  greater: true, greaterorequal: true, less: true, lessorequal: true,
};
export const ARITHMETIC_OPERATORS: OperatorSet = {
  plus: true, minus: true, mul: true, div: true, mod: true, power: true,
};
// what a pair of bounds decides: an ordering comparison, plus "equal" asking for one point
// inside them. "notequal" is left out - a range holds more than one value, so it is always
// satisfiable.
export const RANGE_OPERATORS: OperatorSet = { ...ORDERING_OPERATORS, equal: true };

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
export function stripCommentSuffix(name: string, lintSettings: ILintResolvedSettings): string | undefined {
  const suffix = lintSettings.commentSuffix;
  if (!endsWithCI(name, suffix)) return undefined;
  return name.substring(0, name.length - suffix.length);
}

function isKnownVariable(name: string, options: ISurveyLintOptions): boolean {
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

// A page holds no value: the runtime answers a page name only behind the element-property
// prefix ({$page1.visible}), which never reaches the name lookup, so {page1} in an
// expression is nothing. A runtime name (nameOnly - a gotoName trigger target) does
// address a page by name.
function isRootRecordVisible(record: ElementRecord, nameOnly: boolean): boolean {
  return nameOnly || record.kind !== "page";
}

function findRootRecord(root: string, index: SurveyIndex, nameOnly: boolean): ElementRecord | undefined {
  // byName is a multimap: a page and a question may share a name, and only the
  // question answers an expression reference
  const named = index.byName.get(root);
  for (let i = 0; i < named.length; i++) {
    if (isRootRecordVisible(named[i], nameOnly)) return named[i];
  }
  return index.byValueName.first(root);
}

export interface NameCandidateFilter {
  // which indexed elements answer the name being suggested for
  accepts: (record: ElementRecord) => boolean;
  // add the names that answer as data without being elements: valueNames, calculated
  // values, options.knownVariables and the built-in variables
  values?: boolean;
}

// The pool a typo suggestion is drawn from. Each caller states which names would be a
// valid answer in its position - offering a question name for a page target, or a page
// name for an expression reference, would be a suggestion that cannot work.
export function nameCandidates(index: SurveyIndex, options: ISurveyLintOptions,
  filter: NameCandidateFilter): Array<string> {
  const res: Array<string> = [];
  index.byName.forEach((records, name) => {
    if (records.some(filter.accepts)) res.push(name);
  });
  if (!filter.values) return res;
  index.byValueName.forEach((_, name) => res.push(name));
  index.calculatedValues.forEach((_, name) => res.push(name));
  if (Array.isArray(options.knownVariables)) res.push(...options.knownVariables);
  res.push(...builtInVariableNames());
  return res;
}

// segments [start, end) can fold into one dotted name only if none but the last
// carries an index: in {a[0].b} the index makes ".b" a walk into a's value
function isFoldableRange(segments: Array<ParsedRefSegment>, start: number, end: number): boolean {
  for (let i = start; i < end - 1; i++) {
    if (segments[i].index !== undefined) return false;
  }
  return true;
}

// The name closest to what the reference tried to address. A typo inside a dotted name
// ({address.cty}) is closest to the full registered name, so the whole path is tried first.
export function suggestForRef(ref: ParsedRef, pool: Array<string>): string | undefined {
  if (ref.segments.length > 1 && isFoldableRange(ref.segments, 0, ref.segments.length)) {
    const joined = closestMatch(ref.segments.map(seg => seg.name).join("."), pool);
    if (joined) return joined;
  }
  return closestMatch(ref.segments[0].name, pool);
}

// What a scope prefix made of the reference: "handled" means the root was one and "ref" is
// the answer; otherwise the inactive-scope fields say whether it looked like one.
interface ScopeResolution {
  handled: boolean;
  ref?: ParsedRef;
  // set when the root word looks like a scope prefix but the scope is not active
  inactiveHint?: string;
  inactiveHintReason?: string;
  inactiveHintName?: string;
}

const NOT_A_SCOPE: ScopeResolution = { handled: false };

// The text is what the English message shows; the reason is what a host localizes on.
function inactiveScope(reason: string, name: string, text: string): ScopeResolution {
  return { handled: false, inactiveHint: text, inactiveHintReason: reason, inactiveHintName: name };
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

// The synthetic element behind a standalone scope variable, memoized on the matrix/panel it
// belongs to: the domain and verdict caches key off record identity. It is a plain record
// literal (never a model object) that only the value-typing machinery reads.
function getScopeValueRecord(owner: ElementRecord, name: string, type: string,
  valueType: ValueTypeInfo, choices?: Array<any>): ElementRecord {
  if (!owner.scopeValueRecords) owner.scopeValueRecords = new CIMap<ElementRecord>();
  let record = owner.scopeValueRecords.get(name);
  if (!record) {
    record = {
      name: name, type: type, kind: "question", path: owner.path, json: {},
      parent: owner, scope: [], isUnknownType: false, valueType: valueType,
    };
    if (!!choices) {
      record.choicesInfo = {
        staticValues: choices.slice(), hasChoicesByUrl: false, lazy: false,
        showOtherItem: false, showNoneItem: false, showRefuseItem: false, showDontKnowItem: false,
      };
    }
    owner.scopeValueRecords.set(name, record);
  }
  return record;
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
      if (!matrixFrame) return inactiveScope(SurveyLintHintReasons.rowScopePrefix, rowPrefixes[i],
        "\"" + rowPrefixes[i] + ".\" references are only available inside a matrix cell or a matrix detail panel.");
      return { handled: true, ref: validateInnerName(ref, rowPrefixes[i], matrixFrame.columns, lintSettings) };
    }
  }
  const rowStandalone = [vars.rowIndex, vars.visibleRowIndex, vars.rowValue, vars.rowName, vars.rowTitle, vars.matrix];
  for (let i = 0; i < rowStandalone.length; i++) {
    if (equalsCI(root, rowStandalone[i])) {
      if (!matrixFrame) return inactiveScope(SurveyLintHintReasons.rowScopeStandalone, rowStandalone[i],
        "\"" + rowStandalone[i] + "\" is only available inside a matrix cell or a matrix detail panel.");
      const resolved = scopedResolved(ref, rowStandalone[i]);
      if (ref.segments.length === 1) {
        if (equalsCI(root, vars.rowIndex) || equalsCI(root, vars.visibleRowIndex)) {
          resolved.resolvedTo = getScopeValueRecord(matrixFrame.owner, root,
            SCOPE_INDEX_VARIABLE_TYPE, { shape: "scalar", scalarType: "number" });
        } else if (equalsCI(root, vars.rowValue) &&
          Array.isArray(matrixFrame.owner.matrixRowValues) && matrixFrame.owner.matrixRowValues.length > 0) {
          // only a matrix with listed rows pins {rowValue} down - a matrixdynamic row has none
          resolved.resolvedTo = getScopeValueRecord(matrixFrame.owner, root,
            SCOPE_ROW_VALUE_TYPE, { shape: "scalar", scalarType: "any" }, matrixFrame.owner.matrixRowValues);
        }
      }
      return { handled: true, ref: resolved };
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
    return inactiveScope(SurveyLintHintReasons.panelScopePrefix, vars.panel,
      "\"" + vars.panel + ".\" references are only available inside a dynamic panel or a panel container.");
  }
  const panelSiblings = [vars.prevPanel, vars.nextPanel];
  for (let i = 0; i < panelSiblings.length; i++) {
    if (equalsCI(root, panelSiblings[i])) {
      if (!panelFrame) return inactiveScope(SurveyLintHintReasons.panelSiblingPrefix, panelSiblings[i],
        "\"" + panelSiblings[i] + ".\" references are only available inside a dynamic panel.");
      return { handled: true, ref: validateInnerName(ref, panelSiblings[i], panelFrame.templateNames, lintSettings) };
    }
  }
  const panelStandalone = [vars.parentPanel, vars.panelIndex, vars.visiblePanelIndex];
  for (let i = 0; i < panelStandalone.length; i++) {
    if (equalsCI(root, panelStandalone[i])) {
      if (!panelFrame) return inactiveScope(SurveyLintHintReasons.panelStandalone, panelStandalone[i],
        "\"" + panelStandalone[i] + "\" is only available inside a dynamic panel.");
      const resolved = scopedResolved(ref, panelStandalone[i]);
      if (ref.segments.length === 1 &&
        (equalsCI(root, vars.panelIndex) || equalsCI(root, vars.visiblePanelIndex))) {
        resolved.resolvedTo = getScopeValueRecord(panelFrame.owner, root,
          SCOPE_INDEX_VARIABLE_TYPE, { shape: "scalar", scalarType: "number" });
      }
      return { handled: true, ref: resolved };
    }
  }
  const itemPrefixes = [vars.item, vars.choice, vars.column];
  for (let i = 0; i < itemPrefixes.length; i++) {
    if (equalsCI(root, itemPrefixes[i])) {
      if (!itemFrame) return inactiveScope(SurveyLintHintReasons.itemScope, itemPrefixes[i],
        "\"" + itemPrefixes[i] + "\" is only available inside choice/row/column conditions.");
      return { handled: true, ref: scopedResolved(ref, itemPrefixes[i]) };
    }
  }
  if (equalsCI(root, vars.composite)) {
    if (!compositeFrame) return inactiveScope(SurveyLintHintReasons.compositeScopePrefix, vars.composite,
      "\"" + vars.composite + ".\" references are only available inside a composite question.");
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
  return NOT_A_SCOPE;
}

// The segment at index does not name anything inside the container the segment before it
// resolved to. Candidates are the names that container does hold, for the typo suggestion.
function markUnknownSegment(ref: ParsedRef, index: number, candidates: Array<string>): void {
  ref.status = "unknown";
  ref.unknownSegmentIndex = index;
  ref.suggestion = closestMatch(ref.segments[index].name, candidates);
}

function validateElementSubPath(ref: ParsedRef, record: ElementRecord): void {
  if (ref.segments.length < 2) return;
  const seg1 = ref.segments[1];
  const type = getEffectiveType(record);
  if (type === "multipletext" && record.multipleTextItems) {
    if (!record.multipleTextItems.has(seg1.name)) {
      markUnknownSegment(ref, 1, record.multipleTextItems.names());
    }
    return;
  }
  if ((type === "matrix" || type === "matrixdropdown") && Array.isArray(record.matrixRowValues)) {
    const rowNames = record.matrixRowValues.map(v => String(v));
    if (!rowNames.some(name => equalsCI(name, seg1.name))) {
      markUnknownSegment(ref, 1, rowNames);
      return;
    }
    if (type === "matrixdropdown" && ref.segments.length > 2 && record.matrixColumns) {
      if (!record.matrixColumns.has(ref.segments[2].name)) {
        markUnknownSegment(ref, 2, record.matrixColumns.names());
      }
    }
    return;
  }
  if (type === "matrixdynamic" && record.matrixColumns) {
    // {mdyn[0].col} - the index is attached to the root segment
    if (ref.segments[0].index === undefined) return;
    if (!record.matrixColumns.has(seg1.name)) {
      markUnknownSegment(ref, 1, record.matrixColumns.names());
    }
    return;
  }
  if (type === "paneldynamic" && record.templateNames) {
    if (ref.segments[0].index === undefined) return;
    if (!record.templateNames.has(seg1.name)) {
      markUnknownSegment(ref, 1, record.templateNames.names());
    }
    return;
  }
  if (record.componentFieldNames && record.componentFieldNames.size > 0) {
    if (!record.componentFieldNames.has(seg1.name)) {
      markUnknownSegment(ref, 1, record.componentFieldNames.names());
    }
    return;
  }
  // every other type (custom/unknown, expression, checkbox indexes, ...): stay lenient
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
  const record = index.findByDataName(base);
  if (!record || (record.type !== "matrixdropdown" && record.type !== "matrixdynamic")) return false;
  ref.status = "resolved";
  ref.resolvedTo = record;
  ref.resolvedKind = "element";
  if (ref.segments.length > 1 && record.matrixColumns && !record.matrixColumns.has(ref.segments[1].name)) {
    markUnknownSegment(ref, 1, record.matrixColumns.names());
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

  // a scope prefix answers the reference outright; otherwise what it says about an inactive
  // scope is the hint an unknown root is reported with, further down
  let scopeRes: ScopeResolution = NOT_A_SCOPE;
  if (!nameOnly) {
    scopeRes = tryResolveScopePrefix(ref, site, index.settings);
    if (scopeRes.handled) return scopeRes.ref;
  }

  collapseLongestRootName(ref, index, options);
  const root = ref.segments[0].name;

  const record = findRootRecord(root, index, nameOnly);
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
  if (scopeRes.inactiveHint) {
    ref.scopeHint = scopeRes.inactiveHint;
    ref.hintReason = scopeRes.inactiveHintReason;
    ref.hintName = scopeRes.inactiveHintName;
  }
  // a bare name that exists in the enclosing template/matrix scope needs its prefix
  const panelFrame = findFrame<ScopeFramePanelDynamic>(site.scope || [], "panelDynamic");
  const matrixFrame = findFrame<ScopeFrameMatrixRow>(site.scope || [], "matrixRow");
  if (matrixFrame && matrixFrame.columns.has(root)) {
    ref.suggestion = index.settings.expressionVariables.row + "." + root;
    ref.scopeHint = "\"" + root + "\" is a column of this matrix - reference it as {" + ref.suggestion + "}.";
    ref.hintReason = SurveyLintHintReasons.matrixColumn;
    ref.hintName = root;
  } else if (panelFrame && panelFrame.templateNames.has(root)) {
    ref.suggestion = index.settings.expressionVariables.panel + "." + root;
    ref.scopeHint = "\"" + root + "\" is a question of this dynamic panel - reference it as {" + ref.suggestion + "}.";
    ref.hintReason = SurveyLintHintReasons.panelQuestion;
    ref.hintName = root;
  } else {
    ref.suggestion = suggestForRef(ref, nameCandidates(index, options, {
      accepts: record => isRootRecordVisible(record, nameOnly), values: true,
    }));
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

// A subtree evaluated for its value at lint time. Wrapped rather than returned bare, because
// the value itself may be null or false; undefined means the expression threw, which is the
// runtime's own answer to a fragment that does not compute.
export function tryEvaluate(node: Operand, processValue?: any): ConstValue | undefined {
  try {
    return { value: node.evaluate(processValue) };
  } catch{
    return undefined;
  }
}

// A bound the JSON actually states. An empty string is what a cleared min/max field leaves
// behind, so it is no more a bound than a missing one.
export function hasBound(value: any): boolean {
  return value !== undefined && value !== null && value !== "";
}

// A reference that names one known element: reasoning about its value is only sound then.
export function isUsableRef(ref: ParsedRef | undefined): boolean {
  return !!ref && (ref.status === "resolved" || ref.status === "scoped-resolved");
}

// A usable reference that reads the element's own value, not a part of it: a sub-path or an
// index ({q.item}, {q[0]}) compares against a sub-value the linter does not model. A scoped
// ref ({row.col}) already resolves to the compared element itself.
export function isSimpleValueRef(ref: ParsedRef | undefined): boolean {
  if (!isUsableRef(ref)) return false;
  return ref.status !== "resolved" ||
    ref.segments.length === 1 && ref.segments[0].index === undefined;
}

// The element whose own value a sub-path reference reads: a matrix cell path lands on the
// column record (typed as its cell type), a dynamic panel path on the template question.
// Only the shapes where every row/panel shares one sub-element are modelled - which row or
// panel the index picks does not change what the cell can hold. Undefined elsewhere, and for
// a path reference/unknown already reports.
export function getSubPathRecord(ref: ParsedRef | undefined): ElementRecord | undefined {
  if (!ref || ref.status !== "resolved" || !ref.resolvedTo) return undefined;
  if (ref.unknownSegmentIndex !== undefined) return undefined;
  const record = ref.resolvedTo;
  if (record.isUnknownType) return undefined;
  const segments = ref.segments;
  const type = getEffectiveType(record);
  if (type === "matrixdropdown" && record.matrixColumns) {
    if (segments.length !== 3 || segments.some(seg => seg.index !== undefined)) return undefined;
    return record.matrixColumns.first(segments[2].name);
  }
  if (type === "matrixdynamic" && record.matrixColumns) {
    if (segments.length !== 2 || segments[0].index === undefined ||
      segments[1].index !== undefined) return undefined;
    return record.matrixColumns.first(segments[1].name);
  }
  if (type === "paneldynamic" && record.templateNames) {
    if (segments.length !== 2 || segments[0].index === undefined ||
      segments[1].index !== undefined) return undefined;
    const sub = record.templateNames.first(segments[1].name);
    return !!sub && sub.kind === "question" ? sub : undefined;
  }
  return undefined;
}

// The element a reference compares against, sub-paths included: the referenced element itself
// for a simple ref, the cell column / template question for a modelled sub-path.
export function getRefValueRecord(ref: ParsedRef | undefined): ElementRecord | undefined {
  return isSimpleValueRef(ref) ? ref.resolvedTo : getSubPathRecord(ref);
}

// A site whose result gates something and which parsed: the walker sets exactly one of
// ast/parseError, so the ast test alone covers the parse failure.
export function isAnalyzableCondition(site: ExpressionSite): boolean {
  return !!site && site.kind === "condition" && !!site.ast;
}

// The classified refs of a site keyed by the raw name an operand carries, first ref wins.
// A Map, not an object literal: the keys are raw variable names from user expressions, so
// "constructor" must not collide with Object.prototype. Memoized on the site like refs.
export function getSiteRefByRaw(site: ExpressionSite, index: SurveyIndex,
  options: ISurveyLintOptions): Map<string, ParsedRef> {
  if (!site.refByRaw) {
    const refByRaw = new Map<string, ParsedRef>();
    classifySiteRefs(site, index, options).forEach(ref => {
      if (!refByRaw.has(ref.raw)) refByRaw.set(ref.raw, ref);
    });
    site.refByRaw = refByRaw;
  }
  return site.refByRaw;
}

// A name a function takes as a plain string argument: sumInArray({m1}, 'col1'),
// displayValue('q1'), isContainerReady('page1'). The runtime looks such a name up at call
// time, so a typo silently turns the call into undefined/0/"" instead of failing.
export interface FunctionArgRef {
  ref: ParsedRef;
  functionName: string;
  argIndex: number;
  // the element whose entries the name is read from, for an inArray call
  container?: ElementRecord;
}

// Variable extends Const, so the type tag - not instanceof - tells a written-out string from
// a {reference}: only the former is a name the author typed.
function getConstString(operand: Operand | undefined): string | undefined {
  if (!operand || operand.getType() !== "const") return undefined;
  const value = (<Const>operand).correctValue;
  return typeof value === "string" && !!value ? value : undefined;
}

// The names the item of an array-valued element answers with: matrix columns or the
// questions of a dynamic-panel template - the same two lists getArrayContextVarNames
// collects in the core.
function getArrayItemSource(operand: Operand | undefined, index: SurveyIndex):
  { record: ElementRecord, map: CIMultiMap<ElementRecord> } | undefined {
  if (!operand || !(operand instanceof Variable)) return undefined;
  const record = index.findByDataName(operand.variable);
  if (!record) return undefined;
  const map = record.matrixColumns || record.templateNames;
  return map ? { record: record, map: map } : undefined;
}

function classifyArrayItemName(name: string, map: CIMultiMap<ElementRecord>): ParsedRef {
  const ref: ParsedRef = { raw: name, segments: [{ name: name }], status: "resolved" };
  const record = map.first(name);
  if (record) {
    ref.resolvedTo = record;
    ref.resolvedKind = "element";
    return ref;
  }
  ref.status = "unknown";
  ref.unknownSegmentIndex = 0;
  ref.suggestion = closestMatch(name, map.names());
  return ref;
}

// getQuestionValueByContext walks up from the question the expression belongs to before it
// asks the survey, so a sibling column or a template question answers its bare name here.
function classifyContainerName(name: string, site: { scope: Array<ScopeFrame> },
  index: SurveyIndex, options: ISurveyLintOptions): ParsedRef {
  const scope = site.scope || [];
  const panelFrame = findFrame<ScopeFramePanelDynamic>(scope, "panelDynamic");
  const matrixFrame = findFrame<ScopeFrameMatrixRow>(scope, "matrixRow");
  const local = matrixFrame && matrixFrame.columns.has(name) ? matrixFrame.columns
    : panelFrame && panelFrame.templateNames.has(name) ? panelFrame.templateNames : undefined;
  if (local) return classifyArrayItemName(name, local);
  return classifyTargetName(name, index, options);
}

function classifyFunctionArgName(name: string, scope: FunctionArgNameScope, fn: FunctionOperand,
  site: { scope: Array<ScopeFrame> }, index: SurveyIndex, options: ISurveyLintOptions):
  { ref: ParsedRef, container?: ElementRecord } | undefined {
  if (scope === "arrayItem") {
    const source = getArrayItemSource(fn.paramValues[0], index);
    // an unresolved first argument is reported on its own; what it holds is unknown here
    if (!source) return undefined;
    return { ref: classifyArrayItemName(name, source.map), container: source.record };
  }
  if (scope === "container") return { ref: classifyContainerName(name, site, index, options) };
  return { ref: classifyTargetName(name, index, options) };
}

export function classifyFunctionArgRefs(site: ExpressionSite, index: SurveyIndex,
  options: ISurveyLintOptions): Array<FunctionArgRef> {
  if (site.functionArgRefs) return site.functionArgRefs;
  const res: Array<FunctionArgRef> = [];
  if (site.ast) {
    getFunctionOperands(site.ast).forEach(fn => {
      const def = FUNCTION_NAME_ARGS.get((fn.functionName || "").toLowerCase());
      if (!def) return;
      const params = fn.paramValues || [];
      def.indexes.forEach(argIndex => {
        const name = getConstString(params[argIndex]);
        if (!name) return;
        // the third argument of an inArray function is a column only when it is not the
        // condition, which the runtime decides with this very function
        if (def.scope === "arrayItem" && argIndex > 1 &&
          !isReturnColumnParam(name, params[argIndex])) return;
        const arg = classifyFunctionArgName(name, def.scope, fn, site, index, options);
        if (!arg) return;
        res.push({
          ref: arg.ref, functionName: fn.functionName, argIndex: argIndex, container: arg.container,
        });
      });
    });
  }
  site.functionArgRefs = res;
  return res;
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
  return { source: index.findByDataName(sourceName) };
}

export interface VariableComparison {
  variable: Variable;
  constSide: Operand;
  operator: string;
}

// Answers what a reference is worth when it names a source known at authoring time. Without
// one, a Variable is only ever a variable - which is how the rules read expressions until the
// constant sources are built.
export type ConstResolver = (variable: Variable) => ConstValue | undefined;

// A BinaryOperand with exactly one side that is still unknown at authoring time; the other side
// is returned as-is (it may be a Const, an ArrayOperand, a folded Variable, or any other operand
// - callers narrow). operators === undefined accepts any BinaryOperand.
export function matchVariableComparison(op: Operand, operators?: { [op: string]: boolean },
  resolve?: ConstResolver): VariableComparison | undefined {
  if (!(op instanceof BinaryOperand)) return undefined;
  if (operators && !operators[op.operator]) return undefined;
  const left = op.leftOperand;
  const right = op.rightOperand;
  const leftIsVar = left instanceof Variable && !getConstantOperandValue(left, resolve);
  const rightIsVar = right instanceof Variable && !getConstantOperandValue(right, resolve);
  if (leftIsVar && !rightIsVar) {
    return { variable: <Variable>left, constSide: right, operator: op.operator };
  }
  if (rightIsVar && !leftIsVar) {
    return { variable: <Variable>right, constSide: left, operator: op.operator };
  }
  return undefined;
}

// The operator as it reads from the variable side: "10 < {q}" constrains {q} from below just
// as "{q} > 10" does, and a caller that reasons about bounds needs the second form.
export function operatorFromVariableSide(op: BinaryOperand, match: VariableComparison): string {
  if (match.constSide === op.rightOperand) return op.operator;
  if (op.operator === "greater") return "less";
  if (op.operator === "less") return "greater";
  if (op.operator === "greaterorequal") return "lessorequal";
  if (op.operator === "lessorequal") return "greaterorequal";
  return op.operator;
}

// Variable extends Const, so a plain constant must exclude variables
function isPlainConst(op: Operand): boolean {
  return op instanceof Const && !(op instanceof Variable);
}

// The value of a single operand known at authoring time: a literal, or a reference the resolver
// folds.
export function getConstantOperandValue(op: Operand, resolve?: ConstResolver): ConstValue | undefined {
  if (op instanceof Variable) return !!resolve ? resolve(op) : undefined;
  return isPlainConst(op) ? { value: (<Const>op).correctValue } : undefined;
}

export function getConstValues(op: Operand, resolve?: ConstResolver): Array<any> | undefined {
  const single = getConstantOperandValue(op, resolve);
  // a reference folding to an array lists its members, exactly as an ArrayOperand
  // literal does - "{q} anyof {constArray}" compares member-by-member
  if (!!single) return Array.isArray(single.value) ? single.value.slice() : [single.value];
  if (op instanceof ArrayOperand) {
    const values: Array<any> = [];
    for (let i = 0; i < op.values.length; i++) {
      const item = getConstantOperandValue(op.values[i], resolve);
      if (!item) return undefined;
      values.push(item.value);
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

// What the core's own semantic check concludes about a condition.
export type CoreConditionVerdict =
  "alwaysFalse" | "alwaysTrue" | "notABoolean" | "meaninglessFragment";

// What folding the condition against the values known at authoring time concludes.
export type FoldConditionVerdict =
  "alwaysFalseViaConstants" | "alwaysTrueViaConstants" | "outOfRange" | "unsatisfiable";

export type ConditionSemanticsVerdict = CoreConditionVerdict | FoldConditionVerdict;

// The reason a verdict is reported under. The two vocabularies use the same words today,
// but they are separate contracts - a verdict is what the analysis concluded, a reason is
// what a host localizes on - so the mapping is written out rather than assumed. Declared as
// a full record, so a new verdict is a compile error here instead of a missing reason.
const VERDICT_REASONS: { [verdict in ConditionSemanticsVerdict]: string } = {
  alwaysFalse: SurveyLintReasons["expression/contradiction"].alwaysFalse,
  alwaysFalseViaConstants: SurveyLintReasons["expression/contradiction"].alwaysFalseViaConstants,
  outOfRange: SurveyLintReasons["expression/contradiction"].outOfRange,
  unsatisfiable: SurveyLintReasons["expression/contradiction"].unsatisfiable,
  alwaysTrue: SurveyLintReasons["expression/meaningless-condition"].alwaysTrue,
  alwaysTrueViaConstants: SurveyLintReasons["expression/meaningless-condition"].alwaysTrueViaConstants,
  notABoolean: SurveyLintReasons["expression/meaningless-condition"].notABoolean,
  meaninglessFragment: SurveyLintReasons["expression/meaningless-condition"].meaninglessFragment,
};

export function verdictToReason(verdict: ConditionSemanticsVerdict): string {
  return VERDICT_REASONS[verdict];
}

// A condition that can never hold, however that was established. Rules that act on
// unreachability test this instead of listing the verdicts themselves.
export function isAlwaysFalseVerdict(verdict: ConditionSemanticsVerdict | undefined): boolean {
  return verdict === "alwaysFalse" || verdict === "alwaysFalseViaConstants" ||
    verdict === "outOfRange" || verdict === "unsatisfiable";
}

// The verdict the core's own semantic check gives a condition, refined into which defect it is.
// Undefined when the core reports nothing, which keeps the linter at parity with
// Base.validateExpressions - including its deliberate silence on a lone boolean constant, the one
// form that is a switch the author meant rather than a defect.
//
// Only a condition is judged: a constant *expression* is legitimate (a calculated value of
// "1 + 2"), a constant *condition* is not.
export function getConditionSemanticsVerdict(site: ExpressionSite): CoreConditionVerdict | undefined {
  if (!isAnalyzableCondition(site)) return undefined;
  const ast = site.ast;
  const errors: Array<IExpressionError> = [];
  ast.addConditionSemanticErrors(errors);
  if (errors.length === 0) return undefined;
  // A condition built only from constants has its result fixed at authoring time, so it can be
  // evaluated without any answers: Const.evaluate() takes none, and the operands a constant tree
  // is made of ignore the process value they are handed. A function call is never constant
  // (FunctionOperand does not override isConstant), so nothing registered by the application runs
  // here - hasFunction() states that intent rather than relying on it.
  if (ast.isConstant() && !ast.hasFunction()) {
    const evaluated = tryEvaluate(ast);
    if (!evaluated) return "meaninglessFragment";
    return !!evaluated.value ? "alwaysTrue" : "alwaysFalse";
  }
  // Knowing the value beats knowing the shape, so this runs after the branch above: a constant
  // "1 + 1" is reported as alwaysTrue rather than as arithmetic. The core agrees - it adds the
  // arithmetic error only when the operand is not constant.
  if (ast instanceof BinaryOperand && ast.isArithmetic && !ast.isConjunction) {
    return "notABoolean";
  }
  return "meaninglessFragment";
}
