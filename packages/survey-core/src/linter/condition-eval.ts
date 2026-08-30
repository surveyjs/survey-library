import { BinaryOperand, Operand, Variable } from "survey-core";
import { classifySiteRefs, ConstResolver, getVariableOperands } from "./expression-utils";
import { ConstantEnv, ConstantSource, getFoldableSource } from "./constant-env";
import { ExpressionSite, ParsedRef } from "./symbols";
import { getUnsatisfiableRange } from "./value-range";
import { ValueRangeDomain } from "./value-domain";
import {
  ConditionConflict, findConjunctionConflict, findEmptySetComparison,
} from "./satisfiability";

// What decided a condition, next to the value it was decided to have. A rule turns these into
// the facts its message names, so each mechanism that can settle a leaf adds its own list.
export interface FoldedCondition {
  value: any;
  // the constant sources whose values were read while evaluating
  used: Array<ConstantSource>;
  // the questions whose bounds ruled a comparison out
  ranges: Array<ValueRangeDomain>;
  // the pairs of requirements that cannot hold together
  conflicts: Array<ConditionConflict>;
}

interface EvalContext {
  env: ConstantEnv;
  refOf: (raw: string) => ParsedRef | undefined;
  sourceOf: (raw: string) => ConstantSource | undefined;
  resolve: ConstResolver;
  used: Array<ConstantSource>;
  ranges: Array<ValueRangeDomain>;
  conflicts: Array<ConditionConflict>;
}

// The classified references of a site, keyed by the raw name an operand carries. Lazy: a site
// whose operands are never asked about is never classified.
function makeRefLookup(site: ExpressionSite, env: ConstantEnv): (raw: string) => ParsedRef | undefined {
  // Map, not an object literal: the keys are raw variable names from user expressions
  let refByRaw: Map<string, ParsedRef>;
  return (raw: string) => {
    if (!refByRaw) {
      refByRaw = new Map<string, ParsedRef>();
      classifySiteRefs(site, env.index, env.options).forEach(ref => {
        if (!refByRaw.has(ref.raw)) refByRaw.set(ref.raw, ref);
      });
    }
    return refByRaw.get(raw);
  };
}

function makeSourceLookup(site: ExpressionSite, env: ConstantEnv): (raw: string) => ConstantSource | undefined {
  const refOf = makeRefLookup(site, env);
  return (raw: string) => {
    const ref = refOf(raw);
    return !!ref ? getFoldableSource(ref, site, env) : undefined;
  };
}

// The resolver the rules that read a variable against a constant are given: with it, a
// reference to a constant source reads as the value it always has.
export function getConstResolver(site: ExpressionSite, env: ConstantEnv): ConstResolver {
  const lookup = makeSourceLookup(site, env);
  return (variable: Variable) => {
    const source = lookup(variable.variable);
    return !!source ? { value: source.value } : undefined;
  };
}

// A subtree with no reference left unresolved, evaluated as a whole. Undefined when anything
// in it depends on an answer - evaluating then would read a missing name as null and turn
// "{q1} = 5" into a confident false.
function evalFolded(node: Operand, ctx: EvalContext): boolean | undefined {
  if (node.hasFunction()) return undefined;
  const vars = getVariableOperands(node);
  const found: Array<ConstantSource> = [];
  for (let i = 0; i < vars.length; i++) {
    const source = ctx.sourceOf(vars[i].variable);
    if (!source) return undefined;
    found.push(source);
  }
  let value: any;
  try {
    value = node.evaluate(ctx.env.processValue);
  } catch{
    return undefined;
  }
  found.forEach(source => {
    if (ctx.used.indexOf(source) < 0) ctx.used.push(source);
  });
  return !!value;
}

// A comparison the bounds of a question rule out is false whatever the answer is, so it settles
// a leaf the same way a folded constant does. Only "never" comes out of bounds: an unanswered
// question makes any comparison false, so they can never prove that a condition always holds.
function evalRange(node: Operand, ctx: EvalContext): boolean | undefined {
  const verdict = getUnsatisfiableRange(node, ctx.env.index, ctx.refOf, ctx.resolve);
  if (!verdict) return undefined;
  if (ctx.ranges.indexOf(verdict.domain) < 0) ctx.ranges.push(verdict.domain);
  return false;
}

// A comparison against an empty set is false for every answer, so it settles a leaf too.
function evalEmptySet(node: Operand, ctx: EvalContext): boolean | undefined {
  const conflict = findEmptySetComparison(node, ctx.refOf, ctx.resolve);
  if (!conflict) return undefined;
  ctx.conflicts.push(conflict);
  return false;
}

function evalLeaf(node: Operand, ctx: EvalContext): boolean | undefined {
  const folded = evalFolded(node, ctx);
  if (folded !== undefined) return folded;
  const ranged = evalRange(node, ctx);
  return ranged !== undefined ? ranged : evalEmptySet(node, ctx);
}

// Conjuncts that are each satisfiable on their own may still be impossible together, which no
// amount of evaluating one leaf at a time can see - so the and-node itself is asked.
function evalConflict(node: Operand, ctx: EvalContext): boolean | undefined {
  const conflict = findConjunctionConflict(node, ctx.refOf, ctx.resolve);
  if (!conflict) return undefined;
  ctx.conflicts.push(conflict);
  return false;
}

// Three-valued evaluation over and/or: a branch whose value is known can decide the whole
// condition even when the rest of it depends on the answers. Only and/or are taken apart -
// everything else, a unary operator included, is a leaf, so no reasoning about the polarity
// of a node is needed and an undecided branch costs a missed finding, never a wrong one.
function evalPartial(node: Operand, ctx: EvalContext): boolean | undefined {
  if (!(node instanceof BinaryOperand) || !node.isConjunction) return evalLeaf(node, ctx);
  const left = evalPartial(node.leftOperand, ctx);
  const right = evalPartial(node.rightOperand, ctx);
  if (node.conjunction === "and") {
    if (left === false || right === false) return false;
    if (left === true && right === true) return true;
    return evalConflict(node, ctx);
  }
  if (left === true || right === true) return true;
  return left === false && right === false ? false : undefined;
}

// The value a condition has at authoring time, as far as anything known then decides it.
export function foldCondition(site: ExpressionSite, env: ConstantEnv): FoldedCondition | undefined {
  if (!site || site.kind !== "condition" || !!site.parseError || !site.ast) return undefined;
  const ast = site.ast;
  // a lone reference is a switch the author meant, the way a lone boolean constant is
  if (ast instanceof Variable) return undefined;
  const ctx: EvalContext = {
    env: env,
    refOf: makeRefLookup(site, env),
    sourceOf: makeSourceLookup(site, env),
    resolve: getConstResolver(site, env),
    used: [],
    ranges: [],
    conflicts: [],
  };
  const value = evalPartial(ast, ctx);
  if (value === undefined) return undefined;
  // nothing of our own was used: the condition is constant on its own, which the core reports
  if (ctx.used.length === 0 && ctx.ranges.length === 0 && ctx.conflicts.length === 0) return undefined;
  return { value: value, used: ctx.used, ranges: ctx.ranges, conflicts: ctx.conflicts };
}
