import { ConditionsParser } from "../conditions/conditionsParser";
import { ProcessValue } from "../conditions/conditionProcessValue";
import { FunctionFactory } from "../functionsfactory";
import { settings } from "../settings";
import { Operand, BinaryOperand, UnaryOperand, ArrayOperand, Const, Variable, FunctionOperand } from "./expressions";

// The filter of a paging data source (request.filter) as a JSON tree a server reads without our parser:
// every value stays a value, never a piece of query text. build/filter-tree.schema.json describes the same shapes.
export type FilterTreeOperator = "equal" | "notequal" | "greater" | "less" | "greaterorequal" | "lessorequal" |
  "contains" | "notcontains" | "anyof" | "noneof" | "allof" | "empty" | "notempty";
export interface FilterTreeCondition {
  // the variable name as written, without the braces and the "#" prefix: "price", "address.city", "row.x"
  field: string;
  op: FilterTreeOperator;
  // absent for empty/notempty, a non-empty array for anyof/noneof/allof, one scalar for the rest.
  // A date is a text: "YYYY-MM-DD" for a calendar date, ISO 8601 with the offset for a moment.
  value?: string | number | boolean | Array<string | number | boolean>;
}
export type FilterTreeNode =
  | { and: Array<FilterTreeNode> } // 2 or more items, none of them an "and"
  | { or: Array<FilterTreeNode> } // 2 or more items, none of them an "or"
  | { not: FilterTreeNode } // never wraps a "not"
  | { const: boolean } // only ever the whole tree: a filter that is always true or always false
  | FilterTreeCondition;

type FilterTreeValue = string | number | boolean;

// The clock functions are registered with resultDependsOn "survey" only because they read the clock:
// with constant arguments their value is known when the tree is built, so they fold like the "parameters" ones.
const clockFunctions = ["today", "currentDate", "currentYear", "age", "dateDiff", "year", "month", "day", "weekday"];
const comparisonMirror: { [op: string]: FilterTreeOperator } = {
  equal: "equal", notequal: "notequal", greater: "less", less: "greater",
  greaterorequal: "lessorequal", lessorequal: "greaterorequal"
};
const listOperators = ["anyof", "noneof", "allof"];
const binaryOperators = ["contains", "notcontains"].concat(Object.keys(comparisonMirror), listOperators);
// A list operator with an empty list answers the same for every value
const emptyListResult: { [op: string]: boolean } = { anyof: true, allof: true, noneof: false };

const notCondition = "not a field condition";
const fieldWithField = "a field compared with a field";

function refuse(reason: string, part: Operand | null): never {
  throw new Error("Cannot convert the filter: " + reason + ": " + (part ? part.toString() : "null"));
}
function hasVariables(op: Operand | null): boolean {
  if (!op) return false;
  const list: Array<string> = [];
  op.setVariables(list);
  return list.length > 0;
}
function isVariable(op: Operand | null): op is Variable {
  return !!op && op.getType() === "variable";
}

// Why an operand that has a field below it cannot be the value (or the field) of a condition
function reasonForFieldInside(op: Operand): string {
  switch(op.getType()) {
    case "variable": return fieldWithField;
    case "function": return "a function of a field";
    case "array": return reasonForFieldInside((<ArrayOperand>op).values.filter(item => hasVariables(item))[0]);
    case "binary": {
      const bin = <BinaryOperand>op;
      return bin.isArithmetic && !bin.isConjunction ? "arithmetic" : notCondition;
    }
  }
  return notCondition;
}

// The functions below op, outermost first
function collectFunctions(op: Operand | null, list: Array<FunctionOperand>): Array<FunctionOperand> {
  if (!op) return list;
  switch(op.getType()) {
    case "function":
      list.push(<FunctionOperand>op);
      (<FunctionOperand>op).paramValues.forEach(item => collectFunctions(item, list));
      break;
    case "array": (<ArrayOperand>op).values.forEach(item => collectFunctions(item, list)); break;
    case "unary": collectFunctions((<UnaryOperand>op).expression, list); break;
    case "binary":
      collectFunctions((<BinaryOperand>op).leftOperand, list);
      collectFunctions((<BinaryOperand>op).rightOperand, list);
      break;
  }
  return list;
}
// A function folds when its value depends on its arguments only (or on the clock). hasValue('q') has constant
// arguments too, but reads the survey and answers false without one: folding it would filter by a wrong constant.
function checkFunctionsFold(op: Operand, part: Operand): void {
  if (op.hasAsyncFunction()) refuse("an async function", part);
  collectFunctions(op, []).forEach(func => {
    const name = func.functionName;
    if (FunctionFactory.Instance.getResultDependsOn(name) !== "parameters" && clockFunctions.indexOf(name) < 0) {
      refuse(name + "() reads the survey", part);
    }
  });
}
function evaluateConstant(op: Operand, part: Operand, func: FunctionOperand | undefined): any {
  try {
    // no context: the operand has no variable, and a folded function reads its arguments and the clock only
    return op.evaluate(new ProcessValue(undefined));
  } catch{
    return refuse(!!func ? func.functionName + "() has no value" : notCondition, part);
  }
}

function pad(num: number, len: number = 2): string {
  return ("000" + num).slice(-len);
}
function dateText(year: number, month: number, day: number): string {
  return pad(year, 4) + "-" + pad(month + 1) + "-" + pad(day);
}
// A calendar date (today(), dateAdd(today(), ...)) is "YYYY-MM-DD", read in local time - or in UTC under
// settings.storeUtcDates, where today() returns UTC midnight. JSON.stringify would give the UTC moment instead:
// "2026-11-15T22:00:00.000Z" for 2026-11-16 in UTC+2, the day before. Any other moment is ISO 8601 with the
// local offset, always numeric (+00:00, never Z) and with milliseconds: "2026-11-23T10:00:00.000+02:00".
function dateToValue(date: Date): string {
  if (settings.storeUtcDates) {
    if (date.getUTCHours() + date.getUTCMinutes() + date.getUTCSeconds() + date.getUTCMilliseconds() === 0) {
      return dateText(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    }
  } else if (date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds() === 0) {
    return dateText(date.getFullYear(), date.getMonth(), date.getDate());
  }
  const offset = -date.getTimezoneOffset();
  const sign = offset < 0 ? "-" : "+";
  return dateText(date.getFullYear(), date.getMonth(), date.getDate()) +
    "T" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()) +
    "." + pad(date.getMilliseconds(), 3) + sign + pad(Math.floor(Math.abs(offset) / 60)) + ":" + pad(Math.abs(offset) % 60);
}
// A folded value a JSON tree can carry: a text, a finite number, a boolean or a valid Date (as a text)
function toScalar(value: any): FilterTreeValue | undefined {
  if (value instanceof Date) return isNaN(value.getTime()) ? undefined : dateToValue(value);
  if (typeof value === "string" || typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return undefined;
}

// The value side of a condition: a constant, a list of constants or a function that folds. JS null for the
// "null"/"undefined" literal and for a missing operand ("{f} contains").
function toValue(op: Operand | null, part: Operand, inList: boolean): FilterTreeValue | Array<FilterTreeValue> | null {
  if (!op) {
    if (inList) refuse(notCondition, part);
    return null;
  }
  switch(op.getType()) {
    case "const": {
      // a number literal too large for a double is Infinity, which JSON writes as null
      const res = toScalar((<Const>op).correctValue);
      return res === undefined ? refuse(notCondition, part) : res;
    }
    case "array":
      if (inList) refuse(notCondition, part);
      return (<ArrayOperand>op).values.map(item => <FilterTreeValue>toValue(item, part, true));
    case "function": {
      const func = <FunctionOperand>op;
      checkFunctionsFold(func, part);
      const res = toScalar(evaluateConstant(func, part, func));
      if (res === undefined) refuse(func.functionName + "() has no value", part);
      return res;
    }
    case "binary":
      // {price} > 10 * 2: no emitter writes arithmetic, and a value is a constant or a function
      if ((<BinaryOperand>op).isArithmetic) refuse("arithmetic", part);
  }
  return refuse(notCondition, part);
}

function toCondition(field: Variable, operator: string, valueOp: Operand | null, part: BinaryOperand): FilterTreeNode {
  if (hasVariables(valueOp)) refuse(reasonForFieldInside(valueOp), part);
  let value = toValue(valueOp, part, false);
  const isList = listOperators.indexOf(operator) > -1;
  if (value === null) {
    // {f} = null is empty; any other operator with no value means nothing
    if (operator === "equal" || operator === "notequal") return { field: field.variable, op: operator === "equal" ? "empty" : "notempty" };
    refuse(notCondition, part);
  }
  if (Array.isArray(value)) {
    if (!isList) refuse(notCondition, part);
    if (value.length === 0) return { const: emptyListResult[operator] };
  } else if (isList) {
    // ours treats {f} anyof 'a' as {f} anyof ['a']
    value = [value];
  } else if (value === "") {
    // ours: = '' is empty, contains '' is false for every value; notcontains '' depends on the field and stays
    if (operator === "equal") return { field: field.variable, op: "empty" };
    if (operator === "notequal") return { field: field.variable, op: "notempty" };
    if (operator === "contains") return { const: false };
  }
  return { field: field.variable, op: <FilterTreeOperator>operator, value: value };
}

function comparisonToNode(op: BinaryOperand): FilterTreeNode {
  const left = op.leftOperand;
  const right = op.rightOperand;
  const operator = op.operator;
  if (binaryOperators.indexOf(operator) < 0) refuse(notCondition, op);
  if (isVariable(left)) {
    if (isVariable(right)) refuse(fieldWithField, op);
    return toCondition(left, operator, right, op);
  }
  if (isVariable(right)) {
    // 10 < {price} is {price} > 10; 'a' contains {f} has no mirror
    if (!comparisonMirror[operator]) refuse(notCondition, op);
    if (hasVariables(left)) refuse(reasonForFieldInside(left), op);
    return toCondition(right, comparisonMirror[operator], left, op);
  }
  return refuse(reasonForFieldInside(hasVariables(left) ? left : right), op);
}

// A condition with no field below it ("1 = 1", "false", "currentYear() = 2026") is known now: a const part
function constantToNode(op: Operand | null): FilterTreeNode {
  if (!op) refuse(notCondition, op);
  checkFunctionsFold(op, op);
  // every function must have a value, as on the value side: "noValue() = 1" is refused, not false
  const functions = collectFunctions(op, []);
  functions.forEach(func => {
    if (toScalar(evaluateConstant(func, op, func)) === undefined) refuse(func.functionName + "() has no value", op);
  });
  const res = evaluateConstant(op, op, functions[0]);
  if (typeof res !== "boolean") refuse(notCondition, op);
  return { const: res };
}

function isConst(node: FilterTreeNode): node is { const: boolean } {
  return Object.prototype.hasOwnProperty.call(node, "const");
}
function combine(kind: "and" | "or", parts: Array<FilterTreeNode>): FilterTreeNode {
  // true drops out of "and" and decides "or"; false the mirror
  const neutral = kind === "and";
  const items: Array<FilterTreeNode> = [];
  for (const part of parts) {
    if (isConst(part)) {
      if (part.const !== neutral) return { const: !neutral };
    } else if (Object.prototype.hasOwnProperty.call(part, kind)) {
      items.push(...(<any>part)[kind]);
    } else {
      items.push(part);
    }
  }
  if (items.length === 0) return { const: neutral };
  if (items.length === 1) return items[0];
  return <FilterTreeNode>{ [kind]: items };
}
function negate(node: FilterTreeNode): FilterTreeNode {
  if (isConst(node)) return { const: !node.const };
  if (Object.prototype.hasOwnProperty.call(node, "not")) return (<{ not: FilterTreeNode }>node).not;
  return { not: node };
}

// op sits in a condition position: the root, an and/or item or under "!". A refusal names the innermost such node.
function toNode(op: Operand | null): FilterTreeNode {
  if (!hasVariables(op)) return constantToNode(op);
  switch(op.getType()) {
    case "binary": {
      const bin = <BinaryOperand>op;
      // and/or report isArithmetic too: test isConjunction first
      if (bin.isConjunction) return combine(<"and" | "or">bin.operator, [toNode(bin.leftOperand), toNode(bin.rightOperand)]);
      if (bin.isArithmetic) refuse("arithmetic", op);
      return comparisonToNode(bin);
    }
    case "unary": {
      const un = <UnaryOperand>op;
      if (un.operator === "negate") return negate(toNode(un.expression));
      if (!isVariable(un.expression)) refuse(reasonForFieldInside(un.expression), op);
      return { field: (<Variable>un.expression).variable, op: <FilterTreeOperator>un.operator };
    }
    case "function": return refuse("a function of a field", op);
  }
  // a bare {f}: ours is true only for 1 and true
  return refuse(notCondition, op);
}

export function toFilterTree(expression: string): FilterTreeNode | null {
  if (!expression || !expression.trim()) return null;
  const operand = new ConditionsParser().parseExpression(expression);
  // undefined is a text that does not parse; null is the "null" literal, refused as a condition below
  if (operand === undefined) throw new Error("Cannot convert the filter: the text does not parse: " + expression);
  return toNode(operand);
}
