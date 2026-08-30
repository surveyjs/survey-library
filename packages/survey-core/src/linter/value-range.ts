import { BinaryOperand, Operand } from "survey-core";
import { ConstResolver, getConstantOperandValue, matchVariableComparison } from "./expression-utils";
import { ParsedRef, SurveyIndex } from "./symbols";
import { getValueDomain, runtimeGreater, ValueRangeDomain } from "./value-domain";

// Only the operators whose satisfiability a pair of bounds decides. "notequal" is left out: a
// range holds more than one value, so "{q} <> x" is satisfiable whatever the bounds are.
const RANGE_OPERATORS: { [op: string]: boolean } = {
  equal: true, greater: true, greaterorequal: true, less: true, lessorequal: true,
};

// Whether some value between min and max can satisfy "value <operator> constant". The bounds
// are compared through the runtime operator, so a date range works without date arithmetic here.
function isSatisfiable(operator: string, constValue: any, domain: ValueRangeDomain): boolean {
  const min = domain.min;
  const max = domain.max;
  const hasMin = min !== undefined && min !== null && min !== "";
  const hasMax = max !== undefined && max !== null && max !== "";
  if (operator === "greater") return !hasMax || runtimeGreater(max, constValue);
  if (operator === "greaterorequal") return !hasMax || !runtimeGreater(constValue, max);
  if (operator === "less") return !hasMin || runtimeGreater(constValue, min);
  if (operator === "lessorequal") return !hasMin || !runtimeGreater(min, constValue);
  // equal: the constant itself has to sit inside the bounds
  return (!hasMin || !runtimeGreater(min, constValue)) && (!hasMax || !runtimeGreater(constValue, max));
}

// A number compared to a string is expression/type-mismatch territory, and comparing them here
// would only put a second reading on the same defect.
function isComparable(constValue: any, domain: ValueRangeDomain): boolean {
  const bound = domain.min !== undefined && domain.min !== null ? domain.min : domain.max;
  return typeof constValue === typeof bound;
}

export interface RangeVerdict {
  domain: ValueRangeDomain;
}

// "This comparison can never hold" for a leaf of a condition, established from the bounds of the
// question it reads. Undefined means undecided - never "it always holds".
export function getUnsatisfiableRange(node: Operand, index: SurveyIndex,
  refOf: (raw: string) => ParsedRef | undefined, resolve?: ConstResolver): RangeVerdict | undefined {
  if (!(node instanceof BinaryOperand)) return undefined;
  const match = matchVariableComparison(node, RANGE_OPERATORS, resolve);
  if (!match) return undefined;
  const constant = getConstantOperandValue(match.constSide, resolve);
  if (!constant) return undefined;
  const ref = refOf(match.variable.variable);
  if (!ref || ref.status !== "resolved" && ref.status !== "scoped-resolved") return undefined;
  if (ref.status === "resolved" && (ref.segments.length > 1 || ref.segments[0].index !== undefined)) {
    return undefined;
  }
  const domain = getValueDomain(ref, index);
  if (!domain || domain.kind !== "range") return undefined;
  if (!isComparable(constant.value, domain)) return undefined;
  // the operator is read left-to-right, and matchVariableComparison may have swapped the sides
  const operator = match.constSide === node.rightOperand ? node.operator : flipOperator(node.operator);
  if (!RANGE_OPERATORS[operator]) return undefined;
  return isSatisfiable(operator, constant.value, domain) ? undefined : { domain: domain };
}

function flipOperator(operator: string): string {
  if (operator === "greater") return "less";
  if (operator === "less") return "greater";
  if (operator === "greaterorequal") return "lessorequal";
  if (operator === "lessorequal") return "greaterorequal";
  return operator;
}
