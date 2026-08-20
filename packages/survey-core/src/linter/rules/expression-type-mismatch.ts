import { BinaryOperand, Const, Variable } from "survey-core";
import { ILintRule, LintContext } from "../rule";
import { classifySiteRefs, collectOperands } from "../expression-utils";
import { ElementRecord, ParsedRef } from "../symbols";
import { isTextInputQuestion } from "../value-types";

const ORDERING_OPERATORS: { [op: string]: boolean } = {
  less: true, greater: true, lessorequal: true, greaterorequal: true,
  plus: true, minus: true, mul: true, div: true, mod: true, power: true,
};
const EQUALITY_OPERATORS: { [op: string]: boolean } = { equal: true, notequal: true };

interface Mismatch {
  reason: string;
  detail: string;
  suggestion?: string;
}

function isPlainConst(op: any): boolean {
  return op instanceof Const && !(op instanceof Variable);
}

function checkOrdering(record: ElementRecord, constValue: any): Mismatch | undefined {
  const valueType = record.valueType;
  if (valueType.shape === "none") {
    return { reason: "no-value", detail: "\"" + record.name + "\" (" + record.type + ") has no value to compare." };
  }
  if (valueType.shape === "array" || valueType.shape === "object") {
    return {
      reason: "non-scalar",
      detail: "\"" + record.name + "\" holds " + (valueType.shape === "array" ? "an array" : "an object") +
        " - ordering and arithmetic operators do not apply to it.",
    };
  }
  if (valueType.scalarType === "boolean") {
    return { reason: "boolean-ordering", detail: "\"" + record.name + "\" is a boolean question - ordering operators do not apply to it." };
  }
  if (valueType.scalarType === "string" && isTextInputQuestion(record)) {
    return {
      reason: "text-ordering",
      detail: "\"" + record.name + "\" is a text question - its value is a string, so numeric comparison relies on implicit conversion.",
      suggestion: "set inputType: \"number\" on \"" + record.name + "\" if it collects numbers",
    };
  }
  if (valueType.scalarType === "date" && typeof constValue === "number") {
    return { reason: "date-vs-number", detail: "\"" + record.name + "\" holds a date string - comparing it to the number " + constValue + " cannot hold." };
  }
  if (valueType.scalarType === "number" && typeof constValue === "string" && constValue !== "") {
    return { reason: "number-vs-string", detail: "\"" + record.name + "\" is numeric - comparing it to the string \"" + constValue + "\" cannot hold." };
  }
  return undefined;
}

function checkEquality(record: ElementRecord, constValue: any): Mismatch | undefined {
  const valueType = record.valueType;
  if (valueType.shape === "none") {
    return { reason: "no-value", detail: "\"" + record.name + "\" (" + record.type + ") has no value to compare." };
  }
  if (valueType.shape === "array" && constValue !== null && constValue !== undefined &&
    constValue !== "" && typeof constValue !== "object") {
    return {
      reason: "array-vs-scalar",
      detail: "\"" + record.name + "\" holds an array of selected values - \"=\" compares the whole array.",
      suggestion: "use \"contains\" or \"anyof\" for multi-select values",
    };
  }
  if (valueType.scalarType === "boolean" && typeof constValue !== "boolean" &&
    constValue !== null && constValue !== undefined && constValue !== "") {
    return { reason: "boolean-vs-const", detail: "\"" + record.name + "\" is a boolean question - comparing it to " + JSON.stringify(constValue) + " cannot hold." };
  }
  if (valueType.scalarType === "number" && typeof constValue === "string" && constValue !== "") {
    return { reason: "number-vs-string", detail: "\"" + record.name + "\" is numeric - comparing it to the string \"" + constValue + "\" cannot hold." };
  }
  return undefined;
}

export const expressionTypeMismatchRule: ILintRule = {
  id: "expression/type-mismatch",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.index.expressionSites.forEach(site => {
      if (site.kind !== "condition" || !site.ast) return;
      let refByRaw: { [raw: string]: ParsedRef };
      const getRef = (variable: Variable): ParsedRef => {
        if (!refByRaw) {
          refByRaw = {};
          classifySiteRefs(site, ctx.index, ctx.options).forEach(ref => {
            if (!refByRaw[ref.raw]) refByRaw[ref.raw] = ref;
          });
        }
        return refByRaw[variable.variable];
      };
      collectOperands(site.ast).forEach(op => {
        if (!(op instanceof BinaryOperand)) return;
        const isOrdering = ORDERING_OPERATORS[op.operator];
        const isEquality = EQUALITY_OPERATORS[op.operator];
        if (!isOrdering && !isEquality) return;
        const left = op.leftOperand;
        const right = op.rightOperand;
        let variable: Variable;
        let constant: Const;
        if (left instanceof Variable && isPlainConst(right)) {
          variable = left;
          constant = right;
        } else if (right instanceof Variable && isPlainConst(left)) {
          variable = right;
          constant = left;
        } else {
          return;
        }
        const ref = getRef(variable);
        if (!ref) return;
        const record = ref.resolvedTo;
        if (!record || record.isUnknownType || record.valueType.shape === "unknown") return;
        // type only confidently resolved references - an unknown sub-segment keeps
        // resolvedTo set but is already reported by reference/unknown
        if (ref.status !== "resolved" && ref.status !== "scoped-resolved") return;
        // sub-path/indexed references ({q.item}, {q[0]}) compare against a sub-value
        // we do not type; scoped refs ({row.col}) resolve to the compared element itself
        if (ref.status === "resolved" && (ref.segments.length > 1 || ref.segments[0].index !== undefined)) return;
        const constValue = constant.correctValue;
        const mismatch = isOrdering ? checkOrdering(record, constValue) : checkEquality(record, constValue);
        if (!mismatch) return;
        let message = "The condition applies \"" + op.operator +
          "\" to \"" + variable.variable + "\": " + mismatch.detail;
        if (mismatch.suggestion) message += " Consider: " + mismatch.suggestion + ".";
        message += " (in \"" + site.text + "\")";
        ctx.report({
          message: message,
          path: site.path,
          messageData: {
            name: variable.variable,
            questionType: record.type,
            valueShape: record.valueType.shape,
            scalarType: record.valueType.scalarType,
            operator: op.operator,
            constValue: constValue,
            reason: mismatch.reason,
            expression: site.text,
          },
          elementName: site.owner ? site.owner.name : undefined,
          elementType: site.owner ? site.owner.type : undefined,
          suggestion: mismatch.suggestion,
        });
      });
    });
  },
};
