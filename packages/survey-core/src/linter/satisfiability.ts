import { BinaryOperand, Operand, UnaryOperand, Variable } from "survey-core";
import { ConstResolver, getConstantOperandValue, matchVariableComparison } from "./expression-utils";
import { ParsedRef } from "./symbols";
import { runtimeEquals } from "./value-domain";

// What one conjunct demands of one reference.
type ConstraintKind = "eq" | "ne" | "empty" | "notempty";

interface Constraint {
  key: string;
  name: string;
  kind: ConstraintKind;
  value?: any;
}

// Two constraints that cannot hold together, named the way a message names them.
export interface ConditionConflict {
  name: string;
  kind: "equalValues" | "equalAndNotEqual" | "emptyAndValue" | "emptyAndNotEmpty";
  values?: Array<any>;
}

const EQUALITY_OPERATORS: { [op: string]: boolean } = { equal: true, notequal: true };

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
    const constraint = readEquality(conjunct, refOf, resolve) || readEmptiness(conjunct, refOf);
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
