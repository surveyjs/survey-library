import { ILintRule, LintContext } from "../rule";
import { classifyTargetName } from "../expression-utils";
import { isCheckableValue, runtimeEquals, ValueDomain, ValueSetDomain } from "../value-domain";
import { ElementRecord, TriggerRecord } from "../symbols";
import { quoteValues } from "../message-utils";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["value/not-a-choice"];

// A range constrains a value without listing the ones that exist, so it says nothing about a
// value being alien - only expression/contradiction reads it.
function asSet(domain: ValueDomain | undefined): ValueSetDomain | undefined {
  return !!domain && domain.kind === "set" ? domain : undefined;
}

function toValueList(value: any): Array<any> {
  return Array.isArray(value) ? value : [value];
}

function findAlienValues(value: any, domain: ValueSetDomain): Array<any> {
  return toValueList(value).filter(item => isCheckableValue(item) &&
    !domain.values.some(allowed => runtimeEquals(allowed, item)));
}

// The question a trigger writes into: a plain name, or a matrix cell whose column owns the set.
// An unresolvable target is trigger/unknown-target territory, not this rule.
function getTargetDomain(ctx: LintContext, name: string): ValueSetDomain | undefined {
  const ref = classifyTargetName(name, ctx.index, ctx.options);
  if (ref.status !== "resolved" || !ref.resolvedTo) return undefined;
  const columns = ref.resolvedTo.matrixColumns;
  switch(ref.segments.length) {
    case 1: return asSet(ctx.getRecordValueDomain(ref.resolvedTo));
    // "matrix.column" writes into a cell, and the column owns the set of values
    case 2: {
      if (!columns) return asSet(ctx.getValueDomain(ref));
      const column = columns.first(ref.segments[1].name);
      return !!column ? asSet(ctx.getRecordValueDomain(column)) : undefined;
    }
    // a deeper path addresses something below a cell, which no domain describes
    default: return columns ? undefined : asSet(ctx.getValueDomain(ref));
  }
}

function reportAlien(ctx: LintContext, params: {
  values: Array<any>, domain: ValueSetDomain, path: string, prop: string, reason: string,
  owner: string, ownerType: string, subject: string,
}): void {
  const listed = quoteValues(params.domain.listed);
  const alien = quoteValues(params.values);
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
  const domain = asSet(ctx.getRecordValueDomain(record));
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
  const domain = getTargetDomain(ctx, target);
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
