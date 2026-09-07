import { BinaryOperand } from "survey-core";
import { ILintRule, LintContext } from "../rule";
import { SurveyLintReasons, SurveyLintSuggestionReasons } from "../reasons";
import {
  ARITHMETIC_OPERATORS, collectOperands, EQUALITY_OPERATORS, getConstantOperandValue,
  getRefValueRecord, getSiteRefByRaw, matchVariableComparison, ORDERING_OPERATORS,
} from "../expression-utils";
import { quoteValue } from "../message-utils";
import { ElementRecord } from "../symbols";
import { isTextInputQuestion } from "../value-types";

const reasons = SurveyLintReasons["expression/type-mismatch"];

// Which family the operator belongs to. Ordering and arithmetic reject the same value types
// but say so differently: "{q} > 1" is a comparison that cannot rank, "{q} + 1" is arithmetic
// on something that is not a number.
type OperatorClass = "ordering" | "arithmetic" | "equality";

interface Mismatch {
  reason: keyof typeof reasons;
  detail: string;
  suggestion?: string;
  // one of SurveyLintSuggestionReasons - "suggestion" itself is prose, not an identifier
  suggestionReason?: string;
}

function getOperatorClass(operator: string): OperatorClass | undefined {
  if (ORDERING_OPERATORS[operator]) return "ordering";
  if (ARITHMETIC_OPERATORS[operator]) return "arithmetic";
  return EQUALITY_OPERATORS[operator] ? "equality" : undefined;
}

// A value the operator has nothing to work with, whichever family it belongs to.
function checkNoValue(record: ElementRecord): Mismatch | undefined {
  if (record.valueType.shape !== "none") return undefined;
  return {
    reason: "no-value",
    detail: "\"" + record.name + "\" (" + record.type + ") has no value to compare.",
  };
}

function checkNumberVsString(record: ElementRecord, constValue: any): Mismatch | undefined {
  if (record.valueType.scalarType !== "number" || typeof constValue !== "string" || constValue === "") {
    return undefined;
  }
  return {
    reason: "number-vs-string",
    detail: "\"" + record.name + "\" is numeric - comparing it to the string \"" + constValue + "\" cannot hold.",
  };
}

function checkOrdering(record: ElementRecord, constValue: any,
  operatorClass: OperatorClass): Mismatch | undefined {
  const valueType = record.valueType;
  const isArithmetic = operatorClass === "arithmetic";
  if (valueType.shape === "array" || valueType.shape === "object") {
    return {
      reason: "non-scalar",
      detail: "\"" + record.name + "\" holds " + (valueType.shape === "array" ? "an array" : "an object") +
        " - ordering and arithmetic operators do not apply to it.",
    };
  }
  if (valueType.scalarType === "boolean") {
    return {
      reason: "boolean-ordering",
      detail: "\"" + record.name + "\" is a boolean question - " +
        (isArithmetic ? "it is not a number to compute with." : "ordering operators do not apply to it."),
    };
  }
  if (valueType.scalarType === "string" && isTextInputQuestion(record)) {
    return {
      reason: "text-ordering",
      detail: "\"" + record.name + "\" is a text question - its value is a string, so " +
        (isArithmetic ? "arithmetic" : "numeric comparison") + " relies on implicit conversion.",
      suggestion: "set inputType: \"number\" on \"" + record.name + "\" if it collects numbers",
      suggestionReason: SurveyLintSuggestionReasons.setNumberInputType,
    };
  }
  if (valueType.scalarType === "date" && typeof constValue === "number") {
    return {
      reason: "date-vs-number",
      detail: "\"" + record.name + "\" holds a date string - comparing it to the number " +
        constValue + " cannot hold.",
    };
  }
  return checkNumberVsString(record, constValue);
}

function checkEquality(record: ElementRecord, constValue: any): Mismatch | undefined {
  const valueType = record.valueType;
  if (valueType.shape === "array" && constValue !== null && constValue !== undefined &&
    constValue !== "" && typeof constValue !== "object") {
    return {
      reason: "array-vs-scalar",
      detail: "\"" + record.name + "\" holds an array of selected values - \"=\" compares the whole array.",
      suggestion: "use \"contains\" or \"anyof\" for multi-select values",
      suggestionReason: SurveyLintSuggestionReasons.useContainsOrAnyof,
    };
  }
  if (valueType.scalarType === "boolean" && typeof constValue !== "boolean" &&
    constValue !== null && constValue !== undefined && constValue !== "") {
    return {
      reason: "boolean-vs-const",
      detail: "\"" + record.name + "\" is a boolean question - comparing it to " +
        quoteValue(constValue) + " cannot hold.",
    };
  }
  return checkNumberVsString(record, constValue);
}

export const expressionTypeMismatchRule: ILintRule = {
  id: "expression/type-mismatch",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    // expression-kind sites carry typed comparisons too, inside iif() conditions and
    // boolean fragments, so the same per-operand scan applies to them
    ctx.forEachSite("parsed", site => {
      const resolve = ctx.getConstResolver(site);
      collectOperands(site.ast).forEach(op => {
        if (!(op instanceof BinaryOperand)) return;
        const operatorClass = getOperatorClass(op.operator);
        if (!operatorClass) return;
        // a reference to a constant source reads as the value it always has, so "{q} = {c1}"
        // is typed the way "{q} = 2" is
        const match = matchVariableComparison(op, undefined, resolve);
        if (!match) return;
        const constant = getConstantOperandValue(match.constSide, resolve);
        if (!constant) return;
        const variable = match.variable;
        const constValue = constant.value;
        const ref = getSiteRefByRaw(site, ctx.index, ctx.options).get(variable.variable);
        // type only confidently resolved references: the element's own value, or the matrix
        // cell / template question a modelled sub-path lands on. An unknown sub-segment keeps
        // resolvedTo set but is already reported by reference/unknown, and getRefValueRecord
        // rejects it.
        const record = getRefValueRecord(ref);
        if (!record || record.isUnknownType || record.valueType.shape === "unknown") return;
        const mismatch = checkNoValue(record) || (operatorClass === "equality"
          ? checkEquality(record, constValue)
          : checkOrdering(record, constValue, operatorClass));
        if (!mismatch) return;
        // summing free-text fields is a widespread legitimate pattern in computed expressions,
        // unlike in conditions where a numeric comparison on text hints at a missing inputType
        if (site.kind !== "condition" && operatorClass === "arithmetic" &&
          mismatch.reason === "text-ordering") return;
        let message = (site.kind === "condition" ? "The condition" : "The expression") +
          " applies \"" + op.operator +
          "\" to \"" + variable.variable + "\": " + mismatch.detail;
        if (mismatch.suggestion) message += " Consider: " + mismatch.suggestion + ".";
        message += " (in \"" + site.text + "\")";
        ctx.reportAtSite(site, {
          message: message,
          reason: mismatch.reason,
          messageData: {
            name: variable.variable,
            prop: site.prop,
            // the detail sentences are about the element, and its name differs from the raw
            // reference for valueName hits, "-Comment" keys, matrix "-total" keys and scoped refs
            recordName: record.name,
            questionType: record.type,
            valueShape: record.valueType.shape,
            scalarType: record.valueType.scalarType,
            operator: op.operator,
            constValue: constValue,
            suggestionReason: mismatch.suggestionReason,
            expression: site.text,
          },
          suggestion: mismatch.suggestion,
        });
      });
    });
  },
};
