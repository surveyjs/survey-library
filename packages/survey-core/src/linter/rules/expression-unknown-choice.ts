import { runBinaryOperator } from "survey-core";
import { closestMatch } from "../levenshtein";
import { ILintRule, LintContext } from "../rule";
import { collectOperands, getConstValues, getSiteRefByRaw, matchVariableComparison } from "../expression-utils";
import { isCheckableValue, runtimeEquals } from "../value-domain";
import { ElementRecord } from "../symbols";
import { quoteValues } from "../message-utils";
import { ILintReproduction } from "../types";
import { SurveyLintReasons, SurveyLintReproductionReasons } from "../reasons";

const reasons = SurveyLintReasons["expression/unknown-choice"];

const CHOICE_OPERATORS: { [op: string]: boolean } = {
  equal: true, notequal: true, anyof: true, allof: true, noneof: true,
  contains: true, notcontains: true,
};

// The values the author explicitly put on the question next to its choices. A defaultValue
// outside the choices is a deliberate legacy value, so a condition comparing against it is
// meaningful - which is why it is added here and not inside the domain itself.
function getAuthoredValues(record: ElementRecord): Array<any> {
  const defaultValue = record.json ? record.json.defaultValue : undefined;
  if (Array.isArray(defaultValue)) return defaultValue.slice();
  return defaultValue !== undefined && defaultValue !== null ? [defaultValue] : [];
}

// The substring counterpart of runtimeEquals, applied through the same runtime operator.
function runtimeContains(haystack: any, needle: any): boolean {
  return runBinaryOperator("contains", haystack, needle) === true;
}

export const expressionUnknownChoiceRule: ILintRule = {
  id: "expression/unknown-choice",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.forEachSite("condition", site => {
      const resolve = ctx.getConstResolver(site);
      collectOperands(site.ast).forEach(op => {
        const match = matchVariableComparison(op, CHOICE_OPERATORS, resolve);
        if (!match) return;
        const constValues = getConstValues(match.constSide, resolve);
        if (!constValues || constValues.length === 0) return;
        const ref = getSiteRefByRaw(site, ctx.index, ctx.options).get(match.variable.variable);
        if (!ref) return;
        const domain = ctx.getValueDomain(ref);
        // a range says which values are allowed, not which ones exist: expression/contradiction
        // is the rule that reads it
        if (!domain || domain.kind !== "set") return;
        const record = domain.record;
        // containsCore (expressions.ts) does substring matching when the question
        // value is a scalar (numbers are stringified too): "{q} contains 'apr'" is
        // true for the choice "apricot". Whole-value membership applies to arrays.
        const useSubstring = (match.operator === "contains" || match.operator === "notcontains") &&
          record.valueType.shape !== "array";
        const matches = useSubstring ? runtimeContains : runtimeEquals;
        const allowed = domain.values.concat(getAuthoredValues(record));
        const missing = constValues.filter(value => isCheckableValue(value) &&
          !allowed.some(choice => matches(choice, value)));
        if (missing.length === 0) return;
        const availableText = quoteValues(domain.listed);
        const refName = ref.segments.map(s => s.name).join(".");
        const missingText = quoteValues(missing);
        let reproduction: ILintReproduction;
        if (site.prop === "visibleIf" && site.owner && site.owner.name &&
          ref.status === "resolved" && record.name) {
          reproduction = {
            description: "No selectable choice of \"" + record.name + "\" " +
              (useSubstring ? "contains " : "equals ") + missingText + ".",
            reason: useSubstring
              ? SurveyLintReproductionReasons.noChoiceContains
              : SurveyLintReproductionReasons.noChoiceEquals,
            steps: domain.listed.slice(0, 3).map(value => ({ set: { [record.name]: value } })),
          };
          reproduction.steps.push({ expect: { visible: { [site.owner.name]: true } } });
        }
        ctx.reportAtSite(site, {
          message: "The condition compares \"" + refName + "\" to " + missingText +
            (useSubstring ? " - no choice value contains it." : " - not among its choices.") +
            " Available: " + availableText + ". (in \"" + site.text + "\")",
          reason: useSubstring ? reasons.noChoiceContains : reasons.notAmongChoices,
          messageData: {
            name: refName,
            recordName: record.name,
            reference: ref.raw,
            operator: match.operator,
            values: missing,
            available: domain.listed,
            semantics: useSubstring ? "substring" : "equality",
            expression: site.text,
          },
          suggestion: missing.length === 1 && typeof missing[0] === "string" &&
            domain.listed.length > 0
            ? closestMatch(missing[0], domain.listed.map(choice => String(choice)))
            : undefined,
          reproduction: reproduction,
        });
      });
    });
  },
};
