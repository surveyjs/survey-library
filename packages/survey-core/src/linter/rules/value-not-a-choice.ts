import { ILintRule, LintContext } from "../rule";
import { classifyTargetName } from "../expression-utils";
import { getRecordValueDomain, getValueDomain, runtimeEquals, ValueDomain, ValueSetDomain } from "../value-domain";
import { ElementRecord, SurveyIndex, TriggerRecord } from "../symbols";
import { ISurveyLintOptions } from "../types";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["value/not-a-choice"];

// A range constrains a value without listing the ones that exist, so it says nothing about a
// value being alien - only expression/contradiction reads it.
function asSet(domain: ValueDomain | undefined): ValueSetDomain | undefined {
  return !!domain && domain.kind === "set" ? domain : undefined;
}

// An empty value clears the answer and a boolean one is a switch, not a choice: neither says
// anything about the set of values. The same filter expression/unknown-choice applies.
function isCheckable(value: any): boolean {
  return value !== null && value !== undefined && value !== "" && typeof value !== "boolean";
}

function toValueList(value: any): Array<any> {
  return Array.isArray(value) ? value : [value];
}

function findAlienValues(value: any, domain: ValueSetDomain): Array<any> {
  return toValueList(value).filter(item => isCheckable(item) &&
    !domain.values.some(allowed => runtimeEquals(allowed, item)));
}

// The question a trigger writes into: a plain name, or a matrix cell whose column owns the set.
// An unresolvable target is trigger/unknown-target territory, not this rule.
function getTargetDomain(name: string, index: SurveyIndex, options: ISurveyLintOptions): ValueSetDomain | undefined {
  const ref = classifyTargetName(name, index, options);
  if (ref.status !== "resolved" || !ref.resolvedTo) return undefined;
  if (ref.segments.length === 1) return asSet(getRecordValueDomain(ref.resolvedTo, index));
  const columns = ref.resolvedTo.matrixColumns;
  if (ref.segments.length !== 2 || !columns) return asSet(getValueDomain(ref, index));
  const column = columns.first(ref.segments[1].name);
  return !!column ? asSet(getRecordValueDomain(column, index)) : undefined;
}

function reportAlien(ctx: LintContext, params: {
  values: Array<any>, domain: ValueSetDomain, path: string, prop: string, reason: string,
  owner: string, ownerType: string, subject: string,
}): void {
  const listed = params.domain.listed.map(v => "\"" + String(v) + "\"").join(", ");
  const alien = params.values.map(v => "\"" + String(v) + "\"").join(", ");
  ctx.report({
    message: "The " + params.prop + " of \"" + params.subject + "\" is " + alien +
      " - not among the values it can hold. Available: " + listed + ".",
    path: params.path,
    reason: params.reason,
    messageData: {
      prop: params.prop,
      name: params.subject,
      recordName: params.domain.record.name,
      questionType: params.domain.record.type,
      values: params.values,
      available: params.domain.listed,
    },
    elementName: params.owner,
    elementType: params.ownerType,
    related: [{ path: params.domain.record.path, elementName: params.domain.record.name }],
  });
}

function checkElementProp(ctx: LintContext, record: ElementRecord, prop: string, reason: string): void {
  const value = record.json ? record.json[prop] : undefined;
  if (value === undefined) return;
  const domain = asSet(getRecordValueDomain(record, ctx.index));
  if (!domain) return;
  const alien = findAlienValues(value, domain);
  if (alien.length === 0) return;
  reportAlien(ctx, {
    values: alien, domain: domain, path: record.path + "." + prop, prop: prop, reason: reason,
    owner: record.name, ownerType: record.type, subject: record.name,
  });
}

function checkTrigger(ctx: LintContext, trigger: TriggerRecord): void {
  if (trigger.type !== "setvalue" || !trigger.json) return;
  const target = trigger.json.setToName;
  if (typeof target !== "string" || !target) return;
  const domain = getTargetDomain(target, ctx.index, ctx.options);
  if (!domain) return;
  const alien = findAlienValues(trigger.json.setValue, domain);
  if (alien.length === 0) return;
  reportAlien(ctx, {
    values: alien, domain: domain, path: trigger.path + ".setValue", prop: "setValue",
    reason: reasons.triggerSetValue, owner: domain.record.name, ownerType: domain.record.type,
    subject: target,
  });
}

// The mirror of expression/unknown-choice: the same set of values, but checked against the
// constants the JSON writes next to a question rather than against the ones a condition
// compares it to. A defaultValue outside the choices is silently dropped at runtime.
export const valueNotAChoiceRule: ILintRule = {
  id: "value/not-a-choice",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.index.allElements.forEach(record => {
      checkElementProp(ctx, record, "defaultValue", reasons.defaultValue);
      checkElementProp(ctx, record, "correctAnswer", reasons.correctAnswer);
    });
    ctx.index.triggers.forEach(trigger => checkTrigger(ctx, trigger));
  },
};
