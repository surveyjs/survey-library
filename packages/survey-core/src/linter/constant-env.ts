import { ProcessValue, Variable, VariableGetterContext } from "survey-core";
import { classifySiteRefs, splitRefSegments } from "./expression-utils";
import {
  CIMap, ExpressionSite, ParsedRef, ScopeFrame, SurveyIndex,
} from "./symbols";
import { ISurveyLintOptions } from "./types";

export interface ConstantSource {
  name: string;
  // the path of the expression that makes the source constant, for the "related" of a finding
  path: string;
  expression: string;
  value: any;
}

export interface ConstantEnv {
  index: SurveyIndex;
  options: ISurveyLintOptions;
  sources: CIMap<ConstantSource>;
  processValue: ProcessValue;
}

export interface FoldedCondition {
  value: any;
  used: Array<ConstantSource>;
}

// The names a trigger can write to. A source the author can overwrite at runtime is not a
// constant, whatever its expression says. Page targets are not values.
function collectTriggerTargets(index: SurveyIndex): CIMap<boolean> {
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

// A name registered twice is ambiguous: one declaration shadows the other, name/duplicate
// reports that, and folding either of them would be a guess.
function collectAmbiguousNames(index: SurveyIndex): CIMap<boolean> {
  const res = new CIMap<boolean>();
  const json = index.json;
  if (Array.isArray(json.calculatedValues)) {
    const seen = new CIMap<boolean>();
    json.calculatedValues.forEach((cv: any) => {
      if (!cv || typeof cv !== "object" || typeof cv.name !== "string") return;
      if (seen.has(cv.name)) res.set(cv.name, true);
      seen.set(cv.name, true);
    });
  }
  index.calculatedValues.forEach((_, name) => {
    if (index.byName.has(name) || index.byValueName.has(name)) res.set(name, true);
  });
  return res;
}

export function buildConstantEnv(index: SurveyIndex, options: ISurveyLintOptions): ConstantEnv {
  const sources = new CIMap<ConstantSource>();
  const triggerTargets = collectTriggerTargets(index);
  const ambiguous = collectAmbiguousNames(index);
  // null-proto: the keys are user names, and VariableGetterContext walks them with for-in
  const values: { [name: string]: any } = Object.create(null);

  index.calculatedValues.forEach((record, name) => {
    if (triggerTargets.has(name) || ambiguous.has(name)) return;
    const site = record.site;
    if (!site || !site.ast || !!site.parseError) return;
    // a call is never constant, and nothing registered by the application runs at lint time
    if (!site.ast.isConstant() || site.ast.hasFunction()) return;
    let value: any;
    try {
      value = site.ast.evaluate();
    } catch{
      return;
    }
    sources.set(name, {
      name: record.name, path: site.path, expression: record.expression, value: value,
    });
    values[record.name] = value;
  });

  return {
    index: index,
    options: options,
    sources: sources,
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

function getFoldableSource(ref: ParsedRef, site: ExpressionSite, env: ConstantEnv): ConstantSource | undefined {
  if (ref.status !== "resolved" || ref.resolvedKind !== "calculatedValue") return undefined;
  if (ref.segments.length !== 1 || ref.segments[0].index !== undefined) return undefined;
  const name = ref.segments[0].name;
  if (isShadowedByScope(name, site.scope)) return undefined;
  return env.sources.get(name);
}

// The English fragment naming what decided the condition, shared by the two condition rules.
export function describeConstants(used: Array<ConstantSource>): string {
  return used.map(source => "{" + source.name + "} is always " + JSON.stringify(source.value)).join(", ");
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

// The value a condition has at authoring time, when every reference in it resolves to a
// constant source. Undefined when anything in the condition depends on an answer.
export function foldCondition(site: ExpressionSite, env: ConstantEnv): FoldedCondition | undefined {
  if (!site || site.kind !== "condition" || !!site.parseError || !site.ast) return undefined;
  const ast = site.ast;
  if (ast.hasFunction()) return undefined;
  // a lone reference is a switch the author meant, the way a lone boolean constant is
  if (ast instanceof Variable) return undefined;
  const refs = classifySiteRefs(site, env.index, env.options);
  if (refs.length === 0) return undefined;
  const used: Array<ConstantSource> = [];
  for (let i = 0; i < refs.length; i++) {
    const source = getFoldableSource(refs[i], site, env);
    if (!source) return undefined;
    if (used.indexOf(source) < 0) used.push(source);
  }
  try {
    return { value: ast.evaluate(env.processValue), used: used };
  } catch{
    return undefined;
  }
}
