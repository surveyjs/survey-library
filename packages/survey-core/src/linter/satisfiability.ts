import { BinaryOperand, Operand, UnaryOperand, Variable } from "survey-core";
import {
  ConstResolver, getConstValues, getConstantOperandValue, matchVariableComparison,
  operatorFromVariableSide,
} from "./expression-utils";
import { ParsedRef } from "./symbols";
import { runtimeEquals, runtimeGreater } from "./value-domain";

// What one conjunct demands of one reference.
type ConstraintKind = "eq" | "ne" | "empty" | "notempty" | "gt" | "ge" | "lt" | "le";

interface Constraint {
  key: string;
  name: string;
  kind: ConstraintKind;
  value?: any;
}

// Two constraints that cannot hold together, named the way a message names them.
export interface ConditionConflict {
  name: string;
  kind: "equalValues" | "equalAndNotEqual" | "emptyAndValue" | "emptyAndNotEmpty" |
    "impossibleBounds" | "emptySet";
  values?: Array<any>;
}

const EQUALITY_OPERATORS: { [op: string]: boolean } = { equal: true, notequal: true };
const ORDER_OPERATORS: { [op: string]: boolean } = {
  greater: true, greaterorequal: true, less: true, lessorequal: true,
};
const ORDER_KINDS: { [op: string]: ConstraintKind } = {
  greater: "gt", greaterorequal: "ge", less: "lt", lessorequal: "le",
};

function isLowerBound(kind: ConstraintKind): boolean {
  return kind === "gt" || kind === "ge";
}

function isUpperBound(kind: ConstraintKind): boolean {
  return kind === "lt" || kind === "le";
}

// The conjuncts of one and-chain. An or below it is left whole: its branches are alternatives,
// and only what every branch demands would count, which is more than this rule claims to know.
function collectConjuncts(node: Operand, out: Array<Operand>): void {
  if (node instanceof BinaryOperand && node.conjunction === "and") {
    collectConjuncts(node.leftOperand, out);
    collectConjuncts(node.rightOperand, out);
    return;
  }
  out.push(node);
}

// The whole reference, not just its root: {m.r1} and {m.r2} are different values. Case is
// irrelevant the way it is to the runtime resolver, and an index is part of the identity.
function refKey(ref: ParsedRef): string {
  return ref.segments.map(segment =>
    segment.name.toLowerCase() + (segment.index === undefined ? "" : "[" + segment.index + "]")
  ).join(".");
}

function isUsableRef(ref: ParsedRef | undefined): boolean {
  return !!ref && (ref.status === "resolved" || ref.status === "scoped-resolved");
}

function readEmptiness(node: Operand, refOf: (raw: string) => ParsedRef | undefined): Constraint | undefined {
  if (!(node instanceof UnaryOperand)) return undefined;
  const kind = node.operator === "empty" ? "empty" : node.operator === "notempty" ? "notempty" : undefined;
  if (!kind) return undefined;
  const operand = node.expression;
  if (!(operand instanceof Variable)) return undefined;
  const ref = refOf(operand.variable);
  if (!isUsableRef(ref)) return undefined;
  return { key: refKey(ref), name: operand.variable, kind: kind };
}

function readEquality(node: Operand, refOf: (raw: string) => ParsedRef | undefined,
  resolve?: ConstResolver): Constraint | undefined {
  const match = matchVariableComparison(node, EQUALITY_OPERATORS, resolve);
  if (!match) return undefined;
  const constant = getConstantOperandValue(match.constSide, resolve);
  if (!constant) return undefined;
  const ref = refOf(match.variable.variable);
  if (!isUsableRef(ref)) return undefined;
  return {
    key: refKey(ref),
    name: match.variable.variable,
    kind: match.operator === "equal" ? "eq" : "ne",
    value: constant.value,
  };
}

function readOrdering(node: Operand, refOf: (raw: string) => ParsedRef | undefined,
  resolve?: ConstResolver): Constraint | undefined {
  if (!(node instanceof BinaryOperand)) return undefined;
  const match = matchVariableComparison(node, ORDER_OPERATORS, resolve);
  if (!match) return undefined;
  const constant = getConstantOperandValue(match.constSide, resolve);
  if (!constant) return undefined;
  const ref = refOf(match.variable.variable);
  if (!isUsableRef(ref)) return undefined;
  return {
    key: refKey(ref),
    name: match.variable.variable,
    kind: ORDER_KINDS[operatorFromVariableSide(node, match)],
    value: constant.value,
  };
}

// A lower bound and an upper bound leave room only while the upper one is above the lower one;
// two bounds that touch leave room exactly when both of them include their own value.
function getBoundsConflict(lower: Constraint, upper: Constraint): ConditionConflict | undefined {
  if (runtimeGreater(upper.value, lower.value)) return undefined;
  if (runtimeEquals(upper.value, lower.value) && lower.kind === "ge" && upper.kind === "le") {
    return undefined;
  }
  return { name: lower.name, kind: "impossibleBounds", values: [lower.value, upper.value] };
}

// A concrete value has to sit inside every bound the same condition demands.
function getValueBoundConflict(value: Constraint, bound: Constraint): ConditionConflict | undefined {
  const inside = bound.kind === "gt" ? runtimeGreater(value.value, bound.value)
    : bound.kind === "ge" ? !runtimeGreater(bound.value, value.value)
      : bound.kind === "lt" ? runtimeGreater(bound.value, value.value)
        : !runtimeGreater(value.value, bound.value);
  return inside ? undefined : { name: value.name, kind: "impossibleBounds", values: [value.value, bound.value] };
}

// Values are compared through the runtime operator, so "1" and 1 are one requirement, not two.
function getConflict(a: Constraint, b: Constraint): ConditionConflict | undefined {
  const name = a.name;
  if (a.kind === "eq" && b.kind === "eq") {
    return runtimeEquals(a.value, b.value)
      ? undefined
      : { name: name, kind: "equalValues", values: [a.value, b.value] };
  }
  if (a.kind === "eq" && b.kind === "ne") {
    return runtimeEquals(a.value, b.value)
      ? { name: name, kind: "equalAndNotEqual", values: [a.value] }
      : undefined;
  }
  if (a.kind === "empty" && b.kind === "notempty") {
    return { name: name, kind: "emptyAndNotEmpty" };
  }
  // an empty value cannot equal a concrete one; "notempty" next to a value is consistent
  if (a.kind === "empty" && b.kind === "eq") {
    return { name: name, kind: "emptyAndValue", values: [b.value] };
  }
  if (isLowerBound(a.kind) && isUpperBound(b.kind)) return getBoundsConflict(a, b);
  if (a.kind === "eq" && (isLowerBound(b.kind) || isUpperBound(b.kind))) {
    return getValueBoundConflict(a, b);
  }
  return undefined;
}

// The first pair of conjuncts that cannot hold together, or undefined when they all can as far
// as this reasoning goes. Undecided is the safe answer: the caller then reports nothing.
export function findConjunctionConflict(node: Operand, refOf: (raw: string) => ParsedRef | undefined,
  resolve?: ConstResolver): ConditionConflict | undefined {
  const conjuncts: Array<Operand> = [];
  collectConjuncts(node, conjuncts);
  if (conjuncts.length < 2) return undefined;
  const constraints: Array<Constraint> = [];
  conjuncts.forEach(conjunct => {
    const constraint = readEquality(conjunct, refOf, resolve) ||
      readOrdering(conjunct, refOf, resolve) || readEmptiness(conjunct, refOf);
    if (!!constraint) constraints.push(constraint);
  });
  for (let i = 0; i < constraints.length; i++) {
    for (let j = i + 1; j < constraints.length; j++) {
      if (constraints[i].key !== constraints[j].key) continue;
      const conflict = getConflict(constraints[i], constraints[j]) ||
        getConflict(constraints[j], constraints[i]);
      if (!!conflict) return conflict;
    }
  }
  return undefined;
}

const EMPTY_SET_OPERATORS: { [op: string]: boolean } = { anyof: true };

// "{q} anyof []" asks whether the answer is one of no values at all, which nothing satisfies.
// allof/noneof of nothing hold instead, so they are not here.
export function findEmptySetComparison(node: Operand, refOf: (raw: string) => ParsedRef | undefined,
  resolve?: ConstResolver): ConditionConflict | undefined {
  const match = matchVariableComparison(node, EMPTY_SET_OPERATORS, resolve);
  if (!match) return undefined;
  const values = getConstValues(match.constSide, resolve);
  if (!values || values.length > 0) return undefined;
  const ref = refOf(match.variable.variable);
  if (!isUsableRef(ref)) return undefined;
  return { name: match.variable.variable, kind: "emptySet" };
}
