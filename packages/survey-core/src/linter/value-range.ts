import { BinaryOperand, Operand } from "survey-core";
import {
  ConstResolver, getConstantOperandValue, getRefValueRecord, hasBound, matchVariableComparison,
  operatorFromVariableSide, RANGE_OPERATORS,
} from "./expression-utils";
import { ElementRecord, ParsedRef, SurveyIndex } from "./symbols";
import { getValueDomain, runtimeGreater, ValueDomain, ValueRangeDomain } from "./value-domain";

// Whether some value between min and max can satisfy "value <operator> constant". The bounds
// are compared through the runtime operator, so a date range works without date arithmetic here.
function isSatisfiable(operator: string, constValue: any, domain: ValueRangeDomain): boolean {
  const min = domain.min;
  const max = domain.max;
  const hasMin = hasBound(min);
  const hasMax = hasBound(max);
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
  const bound = hasBound(domain.min) ? domain.min : domain.max;
  return typeof constValue === typeof bound;
}

// "This comparison can never hold" for a leaf of a condition, established from the bounds of the
// question it reads. Undefined means undecided - never "it always holds".
export function getUnsatisfiableRange(node: Operand, index: SurveyIndex,
  refOf: (raw: string) => ParsedRef | undefined, resolve?: ConstResolver,
  recordDomain?: (record: ElementRecord) => ValueDomain | undefined): ValueRangeDomain | undefined {
  if (!(node instanceof BinaryOperand)) return undefined;
  const match = matchVariableComparison(node, RANGE_OPERATORS, resolve);
  if (!match) return undefined;
  const constant = getConstantOperandValue(match.constSide, resolve);
  if (!constant) return undefined;
  const ref = refOf(match.variable.variable);
  if (!getRefValueRecord(ref)) return undefined;
  const domain = getValueDomain(ref, index, recordDomain);
  if (!domain || domain.kind !== "range") return undefined;
  if (!isComparable(constant.value, domain)) return undefined;
  // operatorFromVariableSide maps RANGE_OPERATORS onto itself, so the operator read from the
  // variable side is still one of them
  return isSatisfiable(operatorFromVariableSide(node, match), constant.value, domain)
    ? undefined : domain;
}
