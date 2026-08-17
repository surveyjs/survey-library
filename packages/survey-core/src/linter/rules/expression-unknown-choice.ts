import { ArrayOperand, BinaryOperand, Const, Operand, Variable } from "../../expressions/expressions";
import { closestMatch } from "../levenshtein";
import { ILintRule, LintContext } from "../rule";
import { classifySiteRefs, collectOperands } from "../expression-utils";
import { ElementRecord, ParsedRef } from "../symbols";
import { getSpecialChoiceValues } from "../value-types";
import { ILintReproduction } from "../types";

const CHOICE_OPERATORS: { [op: string]: boolean } = {
  equal: true, notequal: true, anyof: true, allof: true, noneof: true,
  contains: true, notcontains: true,
};

function isPlainConst(op: Operand): boolean {
  return op instanceof Const && !(op instanceof Variable);
}

function getConstValues(op: Operand): Array<any> | undefined {
  if (isPlainConst(op)) return [(<Const>op).correctValue];
  if (op instanceof ArrayOperand) {
    const values: Array<any> = [];
    for (let i = 0; i < op.values.length; i++) {
      if (!isPlainConst(op.values[i])) return undefined;
      values.push((<Const>op.values[i]).correctValue);
    }
    return values;
  }
  return undefined;
}

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

function getAllowedValues(record: ElementRecord): Array<any> {
  const info = record.choicesInfo;
  const res = info.staticValues.slice();
  res.push(...getSpecialChoiceValues(info));
  const defaultValue = record.json ? record.json.defaultValue : undefined;
  if (Array.isArray(defaultValue)) res.push(...defaultValue);
  else if (defaultValue !== undefined && defaultValue !== null) res.push(defaultValue);
  return res;
}

function looseEquals(a: any, b: any): boolean {
  return String(a).toLowerCase() === String(b).toLowerCase();
}

export const expressionUnknownChoiceRule: ILintRule = {
  id: "expression/unknown-choice",
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
        if (!(op instanceof BinaryOperand) || !CHOICE_OPERATORS[op.operator]) return;
        const left = op.leftOperand;
        const right = op.rightOperand;
        let variable: Variable;
        let constSide: Operand;
        if (left instanceof Variable && !(right instanceof Variable)) {
          variable = left;
          constSide = right;
        } else if (right instanceof Variable && !(left instanceof Variable)) {
          variable = right;
          constSide = left;
        } else {
          return;
        }
        const constValues = constSide ? getConstValues(constSide) : undefined;
        if (!constValues || constValues.length === 0) return;
        const ref = getRef(variable);
        if (!ref) return;
        const record = getComparableRecord(ref);
        if (!record) return;
        const allowed = getAllowedValues(record);
        const missing = constValues.filter(value =>
          value !== null && value !== undefined && value !== "" && typeof value !== "boolean" &&
          !allowed.some(choice => looseEquals(choice, value)));
        if (missing.length === 0) return;
        const availableText = record.choicesInfo.staticValues.map(v => "\"" + String(v) + "\"").join(", ");
        const refName = ref.segments.map(s => s.name).join(".");
        const missingText = missing.map(v => "\"" + String(v) + "\"").join(", ");
        let reproduction: ILintReproduction;
        if (site.prop === "visibleIf" && site.owner && site.owner.name &&
          ref.status === "resolved" && record.name) {
          reproduction = {
            description: "No selectable choice of \"" + record.name + "\" equals " + missingText + ".",
            steps: record.choicesInfo.staticValues.slice(0, 3).map(value => ({ set: { [record.name]: value } })),
          };
          reproduction.steps.push({ expect: { visible: { [site.owner.name]: true } } });
        }
        ctx.report({
          message: "The condition compares \"" + refName + "\" to " + missingText +
            " - not among its choices. Available: " + availableText + ". (in \"" + site.text + "\")",
          path: site.path,
          messageData: {
            name: refName,
            reference: ref.raw,
            operator: op.operator,
            values: missing,
            available: record.choicesInfo.staticValues,
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
