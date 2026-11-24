import { BinaryOperand, FunctionOperand, Operand, UnaryOperand, Variable } from "survey-core";

// Every variable, item filters included: a filter that reads the value is a read too
function getAllVariables(node: Operand): Array<Variable> {
  const list: Array<Operand> = [];
  node.addOperandsToList(list);
  return list.filter((op): op is Variable => op instanceof Variable);
}

// How an expression that writes a value uses that value itself (Bug#12407):
// - "none": it does not read it;
// - "copy": it is a bare reference to it ({x}), so it never writes anything new;
// - "keep": it reads it only to keep it once it is set ({x} || today(), iif({x} empty, 1, {x}))
//   or to pass it through unchanged ({y} || {x}); the result settles after one run;
// - "rewrite": it computes a new value from it ({x} + 1), so each run starts from the previous result.
export type SelfWriteKind = "none" | "copy" | "keep" | "rewrite";

// "whole" for a reference to the written value itself, "part" for one to a part of it ({x.a}, {x[0]}),
// undefined for a reference to anything else
export type SelfRefKind = "whole" | "part" | undefined;

export function classifySelfWrite(ast: Operand, getSelfRef: (variable: Variable) => SelfRefKind): SelfWriteKind {
  if (!ast) return "none";
  const readsSelf = (node: Operand): boolean => !!node && getAllVariables(node).some(v => !!getSelfRef(v));
  const isWholeSelf = (node: Operand): boolean => node instanceof Variable && getSelfRef(node) === "whole";
  // the result is either the own value unchanged or a value that does not depend on it
  const passesThrough = (node: Operand): boolean => {
    if (!readsSelf(node) || isWholeSelf(node)) return true;
    if (node instanceof BinaryOperand && node.operator === "or") {
      return passesThrough(node.leftOperand) && passesThrough(node.rightOperand);
    }
    if (node instanceof FunctionOperand && node.functionName.toLowerCase() === "iif" && node.paramValues.length === 3) {
      const [condition, onTrue, onFalse] = node.paramValues;
      if (!passesThrough(onTrue) || !passesThrough(onFalse)) return false;
      if (!readsSelf(condition)) return true;
      // iif({x} empty, <fallback>, {x}) and iif({x} notempty, {x}, <fallback>): once the value is set,
      // the branch taken returns it unchanged
      if (condition instanceof UnaryOperand && isWholeSelf(condition.expression)) {
        if (condition.operator === "empty") return isWholeSelf(onFalse);
        if (condition.operator === "notempty") return isWholeSelf(onTrue);
      }
    }
    return false;
  };
  if (!readsSelf(ast)) return "none";
  if (isWholeSelf(ast)) return "copy";
  return passesThrough(ast) ? "keep" : "rewrite";
}
