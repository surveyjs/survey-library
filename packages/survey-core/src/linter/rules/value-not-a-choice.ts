import { ILintRule, LintContext } from "../rule";
import { classifyTargetName } from "../expression-utils";
import { CompositeValueIssue, findCompositeValueIssues } from "../composite-values";
import { isCheckableValue, runtimeEquals, ValueDomain, ValueSetDomain } from "../value-domain";
import { closestMatch } from "../levenshtein";
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

const KEY_LABELS: { [kind: string]: string } = {
  unknownRowKey: "row",
  unknownColumnKey: "column",
  unknownQuestionKey: "template question",
};

function reportCompositeIssues(ctx: LintContext, record: ElementRecord, prop: string,
  alienReason: string, issues: Array<CompositeValueIssue>): void {
  issues.forEach(issue => {
    if (issue.kind === "alienCell") {
      reportAlien(ctx, {
        values: issue.values, domain: issue.domain, path: record.path + "." + prop,
        prop: prop, reason: alienReason,
        owner: record.name, ownerType: record.type, subject: issue.domain.record.name,
      });
      return;
    }
    ctx.report({
      message: "The " + prop + " of \"" + record.name + "\" names \"" + issue.key +
        "\" - no such " + KEY_LABELS[issue.kind] + ". Available: " +
        quoteValues(issue.candidates) + ".",
      path: record.path + "." + prop,
      reason: reasons[issue.kind],
      messageData: {
        prop: prop,
        name: record.name,
        questionType: record.type,
        key: issue.key,
        available: issue.candidates,
      },
      elementName: record.name,
      elementType: record.type,
      suggestion: closestMatch(issue.key, issue.candidates),
    });
  });
}

function findCompositeIssues(ctx: LintContext, record: ElementRecord, value: any,
  shape?: "row"): Array<CompositeValueIssue> | undefined {
  return findCompositeValueIssues(record, value, r => ctx.getRecordValueDomain(r),
    ctx.index.settings, isCheckableValue, runtimeEquals, shape);
}

function checkElementProp(ctx: LintContext, record: ElementRecord, prop: string, reason: string): void {
  const value = record.json ? record.json[prop] : undefined;
  if (value === undefined) return;
  // a composite value is taken apart per row/panel key; the whole-value check below covers
  // the questions whose own domain is the value set
  const issues = findCompositeIssues(ctx, record, value);
  if (issues) {
    reportCompositeIssues(ctx, record, prop, reason, issues);
    return;
  }
  const domain = asSet(ctx.getRecordValueDomain(record));
  if (!domain) return;
  const alien = findAlienValues(value, domain);
  if (alien.length === 0) return;
  reportAlien(ctx, {
    values: alien, domain: domain, path: record.path + "." + prop, prop: prop, reason: reason,
    owner: record.name, ownerType: record.type, subject: record.name,
  });
}

// defaultRowValue/defaultPanelValue hold one row/panel object outside any array
function checkRowTemplateProp(ctx: LintContext, record: ElementRecord, prop: string, reason: string): void {
  const value = record.json ? record.json[prop] : undefined;
  if (value === undefined) return;
  const issues = findCompositeIssues(ctx, record, value, "row");
  if (issues) reportCompositeIssues(ctx, record, prop, reason, issues);
}

// The record a trigger name lands on: the question itself, or the column of a matrix cell.
function resolveTargetRecord(ctx: LintContext, name: string): ElementRecord | undefined {
  const ref = classifyTargetName(name, ctx.index, ctx.options);
  if (ref.status !== "resolved" || !ref.resolvedTo) return undefined;
  if (ref.segments.length === 1) return ref.resolvedTo;
  const columns = ref.resolvedTo.matrixColumns;
  if (!!columns && ref.segments.length === 2) return columns.first(ref.segments[1].name);
  return undefined;
}

// A copyvalue trigger moves one answer verbatim, so its ends must be able to hold the same
// value: matching shapes, and - when both sides list their values - at least one shared one.
function checkCopyValueTrigger(ctx: LintContext, trigger: TriggerRecord): void {
  if (trigger.type !== "copyvalue" || !trigger.json) return;
  const fromName = trigger.json.fromName;
  const toName = trigger.json.setToName;
  if (typeof fromName !== "string" || !fromName || typeof toName !== "string" || !toName) return;
  const source = resolveTargetRecord(ctx, fromName);
  const target = resolveTargetRecord(ctx, toName);
  if (!source || !target || source.isUnknownType || target.isUnknownType) return;
  const sourceShape = source.valueType.shape;
  const targetShape = target.valueType.shape;
  const shapes = sourceShape + "/" + targetShape;
  if (shapes === "array/scalar" || shapes === "scalar/array") {
    ctx.report({
      message: "The copyvalue trigger copies \"" + fromName + "\" into \"" + toName + "\": \"" +
        fromName + "\" holds " + (sourceShape === "array" ? "an array of selected values" : "a single value") +
        ", but \"" + toName + "\" holds " +
        (targetShape === "array" ? "an array of selected values" : "a single value") + ".",
      path: trigger.path,
      reason: reasons.copyValueShape,
      messageData: {
        fromName: fromName, setToName: toName,
        sourceShape: sourceShape, targetShape: targetShape,
        sourceType: source.type, targetType: target.type,
      },
      elementName: target.name,
      elementType: target.type,
      related: [
        { path: source.path, elementName: source.name },
        { path: target.path, elementName: target.name },
      ],
    });
    return;
  }
  const sourceSet = asSet(ctx.getRecordValueDomain(source));
  const targetSet = asSet(ctx.getRecordValueDomain(target));
  if (!sourceSet || !targetSet) return;
  const overlaps = sourceSet.values.some(value =>
    targetSet.values.some(allowed => runtimeEquals(allowed, value)));
  if (overlaps) return;
  ctx.report({
    message: "The copyvalue trigger copies \"" + fromName + "\" into \"" + toName +
      "\", but no value of \"" + fromName + "\" is among the values \"" + toName +
      "\" can hold. Available: " + quoteValues(targetSet.listed) + ".",
    path: trigger.path,
    reason: reasons.copyValueNoOverlap,
    messageData: {
      fromName: fromName, setToName: toName,
      sourceValues: sourceSet.listed, available: targetSet.listed,
      sourceType: source.type, targetType: target.type,
    },
    elementName: target.name,
    elementType: target.type,
    related: [
      { path: source.path, elementName: source.name },
      { path: target.path, elementName: target.name },
    ],
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
      checkRowTemplateProp(ctx, record, "defaultRowValue", reasons.defaultRowValue);
      checkRowTemplateProp(ctx, record, "defaultPanelValue", reasons.defaultPanelValue);
    });
    ctx.index.triggers.forEach(trigger => {
      checkTrigger(ctx, trigger);
      checkCopyValueTrigger(ctx, trigger);
    });
  },
};
