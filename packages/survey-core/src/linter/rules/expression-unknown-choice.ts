import { Helpers, Variable } from "survey-core";
import { closestMatch } from "../levenshtein";
import { ILintRule, LintContext } from "../rule";
import { classifySiteRefs, collectOperands, getConstValues, matchVariableComparison } from "../expression-utils";
import { ElementRecord, ParsedRef } from "../symbols";
import { getSpecialChoiceValues } from "../value-types";
import { ILintReproduction } from "../types";
import { ILintResolvedSettings } from "../lint-settings";

const CHOICE_OPERATORS: { [op: string]: boolean } = {
  equal: true, notequal: true, anyof: true, allof: true, noneof: true,
  contains: true, notcontains: true,
};

function getComparableRecord(ref: ParsedRef): ElementRecord | undefined {
  const record = ref.resolvedTo;
  if (!record || record.isUnknownType) return undefined;
  // subpath references ({q.item1}) compare against the sub-element, which we do not model
  if (ref.status === "resolved" && ref.segments.length > 1) return undefined;
  const info = record.choicesInfo;
  if (!info) return undefined;
  if (info.hasChoicesByUrl || info.lazy || info.carryForwardFrom ||
    info.carryForwardValuesFrom || info.staticValues.length === 0) return undefined;
  return record;
}

function getAllowedValues(record: ElementRecord, lintSettings: ILintResolvedSettings): Array<any> {
  const info = record.choicesInfo;
  const res = info.staticValues.slice();
  res.push(...getSpecialChoiceValues(info, lintSettings));
  const defaultValue = record.json ? record.json.defaultValue : undefined;
  if (Array.isArray(defaultValue)) res.push(...defaultValue);
  else if (defaultValue !== undefined && defaultValue !== null) res.push(defaultValue);
  return res;
}

// The runtime "equal" operator compares through OperandMaker.isTwoValueEquals, which
// normalizes the string "undefined" and then delegates to Helpers.isTwoValueEquals with
// ignoreOrder. Helpers is public, so this IS that comparison rather than an approximation
// of it: settings.comparator (caseSensitive, trimStrings, normalizeTextCallback) and the
// numeric conversion apply exactly as they do at runtime.
function runtimeEquals(a: any, b: any): boolean {
  if (a === "undefined") a = undefined;
  if (b === "undefined") b = undefined;
  return Helpers.isTwoValueEquals(a, b, true);
}

// Mirrors OperandMaker.binaryFunctions.containsCore for a scalar left side: the value is
// stringified and matched as a substring, case-folded only when settings.comparator
// .caseSensitive is off. OperandMaker is not part of the public API, so this stays a copy.
function runtimeContains(haystack: any, needle: any, caseSensitive: boolean): boolean {
  let left = String(haystack);
  let right = String(needle);
  if (!caseSensitive) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }
  return left.indexOf(right) > -1;
}

export const expressionUnknownChoiceRule: ILintRule = {
  id: "expression/unknown-choice",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const caseSensitive = ctx.index.settings.comparatorCaseSensitive;
    ctx.index.expressionSites.forEach(site => {
      if (site.kind !== "condition" || !site.ast) return;
      // Map, not an object literal: keys are raw variable names from user expressions
      let refByRaw: Map<string, ParsedRef>;
      const getRef = (variable: Variable): ParsedRef => {
        if (!refByRaw) {
          refByRaw = new Map<string, ParsedRef>();
          classifySiteRefs(site, ctx.index, ctx.options).forEach(ref => {
            if (!refByRaw.has(ref.raw)) refByRaw.set(ref.raw, ref);
          });
        }
        return refByRaw.get(variable.variable);
      };
      collectOperands(site.ast).forEach(op => {
        const match = matchVariableComparison(op, CHOICE_OPERATORS);
        if (!match) return;
        const constValues = getConstValues(match.constSide);
        if (!constValues || constValues.length === 0) return;
        const ref = getRef(match.variable);
        if (!ref) return;
        const record = getComparableRecord(ref);
        if (!record) return;
        // containsCore (expressions.ts) does substring matching when the question
        // value is a scalar (numbers are stringified too): "{q} contains 'apr'" is
        // true for the choice "apricot". Whole-value membership applies to arrays.
        const useSubstring = (match.operator === "contains" || match.operator === "notcontains") &&
          record.valueType.shape !== "array";
        const matches = useSubstring
          ? (choice: any, value: any) => runtimeContains(choice, value, caseSensitive)
          : runtimeEquals;
        const allowed = getAllowedValues(record, ctx.index.settings);
        const missing = constValues.filter(value =>
          value !== null && value !== undefined && value !== "" && typeof value !== "boolean" &&
          !allowed.some(choice => matches(choice, value)));
        if (missing.length === 0) return;
        const availableText = record.choicesInfo.staticValues.map(v => "\"" + String(v) + "\"").join(", ");
        const refName = ref.segments.map(s => s.name).join(".");
        const missingText = missing.map(v => "\"" + String(v) + "\"").join(", ");
        let reproduction: ILintReproduction;
        if (site.prop === "visibleIf" && site.owner && site.owner.name &&
          ref.status === "resolved" && record.name) {
          reproduction = {
            description: "No selectable choice of \"" + record.name + "\" " +
              (useSubstring ? "contains " : "equals ") + missingText + ".",
            steps: record.choicesInfo.staticValues.slice(0, 3).map(value => ({ set: { [record.name]: value } })),
          };
          reproduction.steps.push({ expect: { visible: { [site.owner.name]: true } } });
        }
        ctx.report({
          message: "The condition compares \"" + refName + "\" to " + missingText +
            (useSubstring ? " - no choice value contains it." : " - not among its choices.") +
            " Available: " + availableText + ". (in \"" + site.text + "\")",
          path: site.path,
          messageData: {
            name: refName,
            reference: ref.raw,
            operator: match.operator,
            values: missing,
            available: record.choicesInfo.staticValues,
            semantics: useSubstring ? "substring" : "equality",
            expression: site.text,
          },
          elementName: site.owner ? site.owner.name : undefined,
          elementType: site.owner ? site.owner.type : undefined,
          suggestion: missing.length === 1 && typeof missing[0] === "string"
            ? (record.choicesInfo.staticValues.length > 0
              ? findClosestChoice(String(missing[0]), record.choicesInfo.staticValues)
              : undefined)
            : undefined,
          reproduction: reproduction,
        });
      });
    });
  },
};

function findClosestChoice(value: string, choices: Array<any>): string | undefined {
  return closestMatch(value, choices.map(choice => String(choice)));
}
