import { ProcessValue, VariableGetterContext } from "survey-core";
import { classifySiteRefs, splitRefSegments, tryEvaluate } from "./expression-utils";
import { quoteValue } from "./message-utils";
import {
  CIMap, ElementRecord, ExpressionSite, ParsedRef, ScopeFrame, SurveyIndex,
} from "./symbols";
import { ISurveyLintOptions } from "./types";

export interface ConstantSource {
  // the name a condition addresses the source by: a valueName when the question has one
  name: string;
  // the path of the expression that makes the source constant, for the "related" of a finding
  path: string;
  expression: string;
  value: any;
  // unset for a calculated value; set for the question that produces the value
  record?: ElementRecord;
  // false when the source can be hidden: a hidden question loses its value under
  // clearInvisibleValues, so such a source can prove "never holds" but not "always holds"
  allowsAlwaysTrue: boolean;
  // set on a source that provably never holds a value at all (a never-visible question
  // nothing writes to): folded as an absent answer, never treated as a constant to
  // compare against
  neverAssigned?: boolean;
}

export interface ConstantEnv {
  index: SurveyIndex;
  options: ISurveyLintOptions;
  sources: CIMap<ConstantSource>;
  processValue: ProcessValue;
}

interface Candidate {
  name: string;
  site: ExpressionSite;
  expression: string;
  record?: ElementRecord;
  allowsAlwaysTrue: boolean;
}

// Properties that give an element a value of its own, next to the one its expression computes.
const OWN_VALUE_PROPS = ["defaultValue", "defaultValueExpression", "setValueExpression", "setValueIf"];

export function hasOwnValue(json: any): boolean {
  if (!json) return false;
  return OWN_VALUE_PROPS.some(prop => json[prop] !== undefined && json[prop] !== null && json[prop] !== "");
}

function canBeHidden(record: ElementRecord): boolean {
  let current = record;
  while(!!current) {
    const json = current.json;
    if (!!json) {
      if (json.visible === false) return true;
      if (typeof json.visibleIf === "string" && json.visibleIf.trim() !== "") return true;
    }
    current = current.parent;
  }
  return false;
}

// The names a trigger can write to. A source the author can overwrite at runtime is not a
// constant, whatever its expression says. Page targets are not values.
export function collectTriggerTargets(index: SurveyIndex): CIMap<boolean> {
  const res = new CIMap<boolean>();
  index.triggers.forEach(trigger => {
    trigger.targets.forEach(target => {
      if (target.kind === "page" || !target.name) return;
      const root = splitRefSegments(target.name)[0];
      if (!!root && !!root.name) res.set(root.name, true);
    });
  });
  return res;
}

// A name declared twice is ambiguous: one declaration shadows the other, name/duplicate reports
// that, and folding either of them would be a guess. Counting every declaration - elements,
// valueNames and calculated values alike - keeps the rule the same for all of them.
export function collectAmbiguousNames(index: SurveyIndex): CIMap<boolean> {
  const counts = new CIMap<number>();
  const bump = (name: string) => {
    if (!name) return;
    counts.set(name, (counts.get(name) || 0) + 1);
  };
  index.byName.forEach((values, name) => values.forEach(() => bump(name)));
  index.byValueName.forEach((values, name) => values.forEach(() => bump(name)));
  index.calculatedValueList.forEach(cv => bump(cv.name));
  const res = new CIMap<boolean>();
  counts.forEach((count, name) => {
    if (count > 1) res.set(name, true);
  });
  return res;
}

function collectCandidates(index: SurveyIndex): Array<Candidate> {
  const res: Array<Candidate> = [];
  index.calculatedValues.forEach(record => {
    if (!record.site) return;
    res.push({
      name: record.name, site: record.site, expression: record.expression,
      allowsAlwaysTrue: true,
    });
  });
  // An expression question is recomputed by the runtime the way a calculated value is, but only
  // its own "expression" property makes it one, and only at the top level: a name nested in a
  // matrix or a dynamic panel is not what {name} addresses from outside.
  const siteByOwner = new Map<ElementRecord, ExpressionSite>();
  index.expressionSites.forEach(site => {
    if (site.kind !== "expression" || site.prop !== "expression" || !site.owner) return;
    if (!siteByOwner.has(site.owner)) siteByOwner.set(site.owner, site);
  });
  index.allElements.forEach(record => {
    if (record.kind !== "question" || record.type !== "expression") return;
    if (!!record.scope && record.scope.length > 0) return;
    if (hasOwnValue(record.json)) return;
    const site = siteByOwner.get(record);
    if (!site) return;
    res.push({
      name: record.valueName || record.name, site: site, expression: site.text,
      record: record, allowsAlwaysTrue: !canBeHidden(record),
    });
  });
  return res;
}

export function buildConstantEnv(index: SurveyIndex, options: ISurveyLintOptions): ConstantEnv {
  const sources = new CIMap<ConstantSource>();
  const triggerTargets = collectTriggerTargets(index);
  const ambiguous = collectAmbiguousNames(index);
  // null-proto: the keys are user names, and VariableGetterContext walks them with for-in.
  // The hash is handed to ProcessValue by reference, so filling it in later is what makes an
  // already-resolved source visible to the sources resolved after it.
  const values: { [name: string]: any } = Object.create(null);
  const env: ConstantEnv = {
    index: index,
    options: options,
    sources: sources,
    processValue: new ProcessValue(new VariableGetterContext(values)),
  };
  const candidates = collectCandidates(index).filter(candidate =>
    !triggerTargets.has(candidate.name) && !ambiguous.has(candidate.name));

  // A source may be constant only because another one is, and the JSON is under no obligation to
  // declare them in that order - so keep resolving until a pass adds nothing. A cycle never
  // settles and simply stays unresolved, which is what cycle/calculated-value reports.
  let added = true;
  while(added) {
    added = false;
    candidates.forEach(candidate => {
      if (sources.has(candidate.name)) return;
      const site = candidate.site;
      if (!site.ast || !!site.parseError) return;
      // a call is never constant, and nothing registered by the application runs at lint time
      if (site.ast.hasFunction()) return;
      const refs = classifySiteRefs(site, index, options);
      if (refs.some(ref => !getFoldableSource(ref, site, env))) return;
      const evaluated = tryEvaluate(site.ast, env.processValue);
      if (!evaluated) return;
      sources.set(candidate.name, {
        name: candidate.name, path: site.path, expression: candidate.expression,
        value: evaluated.value, record: candidate.record,
        allowsAlwaysTrue: candidate.allowsAlwaysTrue,
      });
      values[candidate.name] = evaluated.value;
      added = true;
    });
  }
  return env;
}

// A fresh environment extending "env" with never-assigned sources for the given questions.
// The base env is left untouched: the verdicts folded against it stay valid. The values hash
// deliberately has no entry for a never-assigned name - the runtime reads an unanswered
// question as a missing key, and tryEvaluate then reproduces exactly the runtime semantics
// ({q} = x is false, {q} empty is true).
export function extendEnvWithNeverAssigned(env: ConstantEnv,
  records: Array<ElementRecord>): ConstantEnv {
  const values: { [name: string]: any } = Object.create(null);
  const sources = new CIMap<ConstantSource>();
  env.sources.forEach((source, name) => {
    sources.set(name, source);
    values[name] = source.value;
  });
  records.forEach(record => {
    if (sources.has(record.name) || (!!record.valueName && sources.has(record.valueName))) return;
    const source: ConstantSource = {
      name: record.valueName || record.name, path: record.path, expression: "",
      value: undefined, record: record, allowsAlwaysTrue: true, neverAssigned: true,
    };
    sources.set(record.name, source);
    if (record.valueName) sources.set(record.valueName, source);
  });
  return {
    index: env.index, options: env.options, sources: sources,
    processValue: new ProcessValue(new VariableGetterContext(values)),
  };
}

// The runtime resolves a name inside a matrix row or a dynamic panel against that container
// first, so a top-level constant of the same name is not what {name} answers there.
function isShadowedByScope(name: string, scope: Array<ScopeFrame>): boolean {
  if (!Array.isArray(scope)) return false;
  return scope.some(frame => {
    if (frame.kind === "matrixRow") return frame.columns.has(name);
    if (frame.kind === "panelDynamic") return frame.templateNames.has(name);
    if (frame.kind === "composite") return frame.fieldNames.has(name);
    return false;
  });
}

// The reference must resolve to the very declaration the source was built from: a name that
// resolves elsewhere is a different value, however familiar it looks.
export function getFoldableSource(ref: ParsedRef, site: ExpressionSite, env: ConstantEnv): ConstantSource | undefined {
  if (ref.status !== "resolved") return undefined;
  if (ref.segments.length !== 1 || ref.segments[0].index !== undefined) return undefined;
  const name = ref.segments[0].name;
  if (isShadowedByScope(name, site.scope)) return undefined;
  const source = env.sources.get(name);
  if (!source) return undefined;
  if (ref.resolvedKind === "calculatedValue") return !source.record ? source : undefined;
  if (ref.resolvedKind === "element") return ref.resolvedTo === source.record ? source : undefined;
  return undefined;
}

// The English fragment naming what decided the condition, shared by the two condition rules.
export function describeConstants(used: Array<ConstantSource>): string {
  return used.map(source => "{" + source.name + "} is always " + quoteValue(source.value)).join(", ");
}

export function toConstantsData(used: Array<ConstantSource>): { [name: string]: any } {
  // null-proto: the keys are names from the linted JSON
  const res: { [name: string]: any } = Object.create(null);
  used.forEach(source => res[source.name] = source.value);
  return res;
}

export function toConstantsRelated(used: Array<ConstantSource>): Array<{ path: string, elementName: string }> {
  return used.map(source => ({ path: source.path, elementName: source.name }));
}
