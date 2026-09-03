import { foldCondition } from "./condition-eval";
import {
  collectAmbiguousNames, collectTriggerTargets, ConstantEnv, ConstantSource,
  extendEnvWithNeverAssigned, hasOwnValue,
} from "./constant-env";
import { CIMap, ElementRecord, ExpressionSite, SurveyIndex } from "./symbols";
import { ValueDomain } from "./value-domain";

export interface NeverVisibleCascadeItem {
  owner: ElementRecord;
  site: ExpressionSite;
  // the never-assigned sources whose absence decided the condition
  deps: Array<ConstantSource>;
}

export interface NeverVisibleAnalysis {
  // every element whose own visibleIf can never hold: the base set plus the cascade.
  // page/empty reads this; the asymmetry it relies on (a panel with a dead visibleIf still
  // counts as renderable) is its own policy and unaffected here.
  dead: Set<ElementRecord>;
  // only the elements dead THROUGH the cascade - the ones expression/contradiction does not
  // already report, so one defect keeps one finding
  cascade: Array<NeverVisibleCascadeItem>;
}

// A question that provably never receives a value: nothing in the JSON writes to it, its type
// gives it a value the respondent would have to enter, and its name is unambiguous. A question
// with visible: false is deliberately NOT counted - hidden fields are routinely filled from
// application code through survey.data, which the JSON does not show.
function buildValuelessCheck(index: SurveyIndex): (record: ElementRecord) => boolean {
  const ambiguous = collectAmbiguousNames(index);
  const triggerTargets = collectTriggerTargets(index);
  const boundNames = new CIMap<boolean>();
  index.nameRefs.forEach(ref => {
    if (ref.kind === "binding") boundNames.set(ref.name, true);
  });
  const isTaken = (name: string): boolean =>
    ambiguous.has(name) || triggerTargets.has(name) || boundNames.has(name);
  return (record: ElementRecord): boolean =>
    record.kind === "question" &&
    (!record.scope || record.scope.length === 0) &&
    !record.isUnknownType &&
    // an expression question computes its value even while invisible
    record.type !== "expression" &&
    record.valueType.shape !== "none" &&
    !hasOwnValue(record.json) &&
    !isTaken(record.name) &&
    (!record.valueName || !isTaken(record.valueName));
}

// The fixpoint: a question dead through its visibleIf (or living inside a dead container) and
// valueless makes every condition demanding its value always false, which kills more elements,
// which may make more questions valueless. Each pass adds at least one dead element or stops,
// so the site count bounds the passes; the cap is a hard stop for pathological inputs.
const MAX_PASSES = 32;

export function analyzeNeverVisible(params: {
  index: SurveyIndex,
  options: any,
  baseEnv: ConstantEnv,
  baseDead: Set<ElementRecord>,
  recordDomain: (record: ElementRecord) => ValueDomain | undefined,
}): NeverVisibleAnalysis {
  const index = params.index;
  const dead = new Set<ElementRecord>(params.baseDead);
  const cascade: Array<NeverVisibleCascadeItem> = [];
  const isValueless = buildValuelessCheck(index);
  const visibleIfSites = index.expressionSites.filter(site =>
    site.kind === "condition" && site.prop === "visibleIf" && !!site.owner && !!site.ast);
  const isNeverVisible = (record: ElementRecord): boolean => {
    let current = record;
    while(!!current) {
      if (dead.has(current)) return true;
      current = current.parent;
    }
    return false;
  };
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const valueless = index.allElements.filter(record =>
      isValueless(record) && isNeverVisible(record));
    if (valueless.length === 0) break;
    const env = extendEnvWithNeverAssigned(params.baseEnv, valueless);
    let added = false;
    visibleIfSites.forEach(site => {
      if (dead.has(site.owner)) return;
      const fold = foldCondition(site, env, params.recordDomain);
      if (!fold || !!fold.value) return;
      const deps = fold.used.filter(source => !!source.neverAssigned);
      // false without a never-assigned source is decidable from the base environment,
      // which is expression/contradiction territory
      if (deps.length === 0) return;
      dead.add(site.owner);
      cascade.push({ owner: site.owner, site: site, deps: deps });
      added = true;
    });
    if (!added) break;
  }
  return { dead: dead, cascade: cascade };
}
