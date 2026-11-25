import { BinaryOperand, FunctionOperand, Operand, Variable } from "survey-core";
import { ParsedRef } from "./symbols";

// Every variable, item filters included: a filter that reads the value is a read too
function getAllVariables(node: Operand): Array<Variable> {
  const list: Array<Operand> = [];
  node.addOperandsToList(list);
  return list.filter((op): op is Variable => op instanceof Variable);
}

// How an expression that writes a value uses that value itself (Bug#12407):
// - "none": it does not read it;
// - "copy": it is a bare reference to it ({x}), so it never writes anything new;
// - "keep": it reads it only to keep it once it is set ({x} || today(), iif({x} empty, 1, {x}),
//   an iif() one branch of which is {x} itself, whatever its condition: iif({x} = '', 1, {x}))
//   or to pass it through unchanged ({y} || {x}); the result settles after one run;
// - "rewrite": it computes a new value from it ({x} + 1), so each run starts from the previous result.
export type SelfWriteKind = "none" | "copy" | "keep" | "rewrite";

// "whole" for a reference to the written value itself, "part" for one to a part of it ({x.a}, {x[0]}),
// undefined for a reference to anything else
export type SelfRefKind = "whole" | "part" | undefined;

// How a reference already known to address the written value reads it: {x.length} reads a number
// computed from the value, not the value itself
export function getRefSelfKind(ref: ParsedRef): SelfRefKind {
  return ref.segments.length === 1 && ref.segments[0].index === undefined && !ref.readsLength ? "whole" : "part";
}

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
      // iif(<any condition>, <fallback>, {x}): a run either returns the value unchanged or replaces it
      // with the fallback, and the next run returns that again - whichever branch the condition takes
      // then, the fallback does not compute from the value. iif({x} empty, 1, {x}) is one of these.
      return isWholeSelf(onTrue) || isWholeSelf(onFalse);
    }
    return false;
  };
  if (!readsSelf(ast)) return "none";
  if (isWholeSelf(ast)) return "copy";
  return passesThrough(ast) ? "keep" : "rewrite";
}
