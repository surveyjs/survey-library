import { ILintRule, LintContext } from "../rule";
import { classifySiteRefs, equalsCI } from "../expression-utils";
import { collectAmbiguousNames } from "../constant-env";
import { findCycles } from "../graph";
import { ExpressionSite, TriggerRecord } from "../symbols";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["cycle/value-write"];

// The question properties that write the question's own value when their expressions run.
// setValueIf and setValueExpression act as one writer: the runtime evaluates them as a pair.
const QUESTION_WRITE_GROUPS: Array<{ key: string, props: Array<string> }> = [
  { key: "setValue", props: ["setValueIf", "setValueExpression"] },
  { key: "resetValue", props: ["resetValueIf"] },
  { key: "defaultValue", props: ["defaultValueExpression"] },
];

// One thing that writes a value slot: a question property group, a trigger, or a calculated
// value. Nodes are writers rather than slots because one slot may have several writers.
interface ValueWriter {
  id: string;
  kind: "question" | "trigger" | "calculatedValue";
  path: string;
  label: string;
  // the canonical slot: the element NAME, the same canonical form reads resolve to
  slot: string;
  // the valueName when the question has one - a second name for the same slot, checked
  // for ambiguity next to the canonical one
  altSlot?: string;
  reads: Array<string>;
  usesDefaultValueExpression: boolean;
}

function canonicalSlot(ctx: LintContext, root: string): string {
  const record = ctx.index.findByDataName(root);
  return (record && record.name ? record.name : root).toLowerCase();
}

// The slots a site reads. Scoped references live inside a row/panel and are skipped - except
// {self}, which reads the very value the owner writes.
function getSiteReads(ctx: LintContext, site: ExpressionSite, selfSlot?: string): Array<string> {
  if (!site || !site.ast) return [];
  const selfVar = ctx.index.settings.expressionVariables.self;
  const res: Array<string> = [];
  classifySiteRefs(site, ctx.index, ctx.options).forEach(ref => {
    if (ref.status === "scoped-resolved" || ref.status === "scoped-unknown") {
      if (!!selfSlot && !!ref.scopePrefix && equalsCI(ref.scopePrefix, selfVar)) res.push(selfSlot);
      return;
    }
    if (ref.status === "skipped" || ref.segments.length === 0) return;
    res.push(ref.resolvedTo && ref.resolvedTo.name
      ? ref.resolvedTo.name.toLowerCase()
      : canonicalSlot(ctx, ref.segments[0].name));
  });
  return res;
}

function buildQuestionWriters(ctx: LintContext): Array<ValueWriter> {
  const groupByProp = new Map<string, { key: string, props: Array<string> }>();
  QUESTION_WRITE_GROUPS.forEach(group => group.props.forEach(prop => groupByProp.set(prop, group)));
  // per owner, per group: the sites the group's expressions live in
  const sitesByWriter = new Map<string, { sites: Array<ExpressionSite>, group: { key: string } }>();
  ctx.forEachSite("parsed", site => {
    const owner = site.owner;
    if (!owner || owner.kind !== "question" || (owner.scope && owner.scope.length > 0)) return;
    const group = groupByProp.get(site.prop);
    if (!group) return;
    const id = owner.path + "#" + group.key;
    let entry = sitesByWriter.get(id);
    if (!entry) {
      entry = { sites: [], group: group };
      sitesByWriter.set(id, entry);
    }
    entry.sites.push(site);
  });
  const res: Array<ValueWriter> = [];
  sitesByWriter.forEach((entry, id) => {
    const owner = entry.sites[0].owner;
    const slot = owner.name.toLowerCase();
    const props = entry.sites.map(site => site.prop);
    const reads: Array<string> = [];
    entry.sites.forEach(site => getSiteReads(ctx, site, slot).forEach(read => reads.push(read)));
    res.push({
      id: id,
      kind: "question",
      path: entry.sites[0].path,
      label: owner.name + "." + props.join("/"),
      slot: slot,
      altSlot: owner.valueName ? owner.valueName.toLowerCase() : undefined,
      reads: reads,
      usesDefaultValueExpression: props.indexOf("defaultValueExpression") > -1,
    });
  });
  return res;
}

function buildTriggerWriter(ctx: LintContext, trigger: TriggerRecord): ValueWriter {
  const reads: Array<string> = [];
  const sites = (trigger.expressionSite ? [trigger.expressionSite] : [])
    .concat(trigger.extraSites || []);
  sites.forEach(site => getSiteReads(ctx, site).forEach(read => reads.push(read)));
  const fromName = trigger.json ? trigger.json.fromName : undefined;
  if (typeof fromName === "string" && fromName) reads.push(canonicalSlot(ctx, fromName));
  return {
    id: trigger.path,
    kind: "trigger",
    path: trigger.path,
    label: trigger.path + " (" + (trigger.type || "trigger") + " -> " + trigger.setToName + ")",
    slot: canonicalSlot(ctx, trigger.setRoot),
    reads: reads,
    usesDefaultValueExpression: false,
  };
}

function getMessage(members: Array<ValueWriter>, isSelf: boolean): string {
  let message: string;
  if (isSelf) {
    message = "The " + members[0].label + " reads the value it writes itself." +
      " The runtime re-evaluates it only when another value changes, so an expression" +
      " reading only its own question never runs.";
  } else {
    message = "Values are written in a loop: " + members.map(member => member.label).join(" -> ") +
      ". Each write reruns the expressions that read it, so the final values depend on the" +
      " order of answers.";
  }
  if (members.some(member => member.usesDefaultValueExpression)) {
    message += " A defaultValueExpression applies only until its question is answered.";
  }
  return message;
}

// The cross-domain companion of cycle/calculated-value and cycle/trigger: one graph over
// everything that writes a value (question setValue/reset/default expressions, triggers,
// calculated values), so a loop spanning the domains is seen. A loop living entirely inside
// one of the two older rules is skipped here - it is already reported there.
export const cycleValueWriteRule: ILintRule = {
  id: "cycle/value-write",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const ambiguous = collectAmbiguousNames(ctx.index);
    const writers = buildQuestionWriters(ctx)
      .concat(ctx.index.triggers.filter(trigger => !!trigger.setRoot)
        .map(trigger => buildTriggerWriter(ctx, trigger)));
    ctx.index.calculatedValueList.forEach(cv => {
      if (!cv.site || !cv.site.ast) return;
      writers.push({
        id: cv.path,
        kind: "calculatedValue",
        path: cv.path,
        label: "calculatedValue \"" + cv.name + "\"",
        slot: cv.name.toLowerCase(),
        reads: getSiteReads(ctx, cv.site),
        usesDefaultValueExpression: false,
      });
    });
    const byId = new Map<string, ValueWriter>();
    const bySlot = new Map<string, Array<ValueWriter>>();
    writers.forEach(writer => {
      byId.set(writer.id, writer);
      // an ambiguous slot name is a guess about which declaration a read addresses - leave it out
      if (ambiguous.has(writer.slot) || (!!writer.altSlot && ambiguous.has(writer.altSlot))) return;
      let bucket = bySlot.get(writer.slot);
      if (!bucket) {
        bucket = [];
        bySlot.set(writer.slot, bucket);
      }
      bucket.push(writer);
    });
    const getEdges = (id: string): Array<string> => {
      const res: Array<string> = [];
      byId.get(id).reads.forEach(read => {
        (bySlot.get(read) || []).forEach(writer => {
          if (res.indexOf(writer.id) < 0) res.push(writer.id);
        });
      });
      return res;
    };
    findCycles(writers.map(writer => writer.id), getEdges).forEach(cycle => {
      const members = cycle.map(id => byId.get(id));
      // a loop entirely inside one domain is that rule's finding, not a second one here
      if (members.every(member => member.kind === "trigger")) return;
      if (members.every(member => member.kind === "calculatedValue")) return;
      const isSelf = cycle.length === 1;
      ctx.report({
        message: getMessage(members, isSelf),
        path: members[0].path,
        reason: isSelf ? reasons.self : reasons.loop,
        messageData: {
          cycle: cycle.concat([cycle[0]]),
          names: cycle.slice(),
          labels: members.map(member => member.label),
          members: members.map(member => ({
            path: member.path, kind: member.kind, slot: member.slot,
          })),
        },
        related: members.map(member => ({ path: member.path })),
      });
    });
  },
};
