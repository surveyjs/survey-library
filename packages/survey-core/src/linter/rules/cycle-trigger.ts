import { ILintRule, LintContext } from "../rule";
import { buildTriggerSetStep, classifySiteRefs } from "../expression-utils";
import { TriggerRecord } from "../symbols";
import { ILintReproduction } from "../types";
import { findCycles } from "../graph";

// Triggers write and expressions read DATA keys: a question's name and its
// valueName identify the same signal. Canonicalize both edge endpoints to the
// resolved element name so "setToName: q1" links to "{v1}" when v1 is q1's valueName.
function canonicalRoot(ctx: LintContext, root: string): string {
  const record = ctx.index.byName.first(root) || ctx.index.byValueName.first(root);
  return (record && record.name ? record.name : root).toLowerCase();
}

function getExpressionRoots(ctx: LintContext, trigger: TriggerRecord): Array<string> {
  if (!trigger.expressionSite || !trigger.expressionSite.ast) return [];
  return classifySiteRefs(trigger.expressionSite, ctx.index, ctx.options)
    .filter(ref => ref.status !== "skipped" && ref.segments.length > 0)
    .map(ref => ref.resolvedTo && ref.resolvedTo.name
      ? ref.resolvedTo.name.toLowerCase()
      : canonicalRoot(ctx, ref.segments[0].name));
}

function triggerLabel(trigger: TriggerRecord): string {
  let res = trigger.path + " (" + (trigger.type || "trigger");
  if (trigger.setToName) res += " -> " + trigger.setToName;
  return res + ")";
}

export const cycleTriggerRule: ILintRule = {
  id: "cycle/trigger",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const triggers = ctx.index.triggers.filter(trigger => !!trigger.setRoot);
    if (triggers.length === 0) return;
    const byId: { [id: string]: TriggerRecord } = {};
    const roots: { [id: string]: Array<string> } = {};
    triggers.forEach(trigger => {
      const id = String(trigger.index);
      byId[id] = trigger;
      roots[id] = getExpressionRoots(ctx, trigger);
    });
    const ids = triggers.map(trigger => String(trigger.index));
    const getEdges = (id: string): Array<string> => {
      const setRoot = canonicalRoot(ctx, byId[id].setRoot);
      return ids.filter(otherId => roots[otherId].indexOf(setRoot) > -1);
    };
    findCycles(ids, getEdges).forEach(cycle => {
      const members = cycle.map(id => byId[id]);
      const first = members[0];
      const labels = members.map(triggerLabel);
      const setStep = buildTriggerSetStep(first);
      const reproduction: ILintReproduction = setStep ? {
        description: "This fires the first trigger; each trigger in the cycle sets a value the next one reacts to.",
        steps: [setStep],
      } : undefined;
      ctx.report({
        message: (cycle.length === 1
          ? "The trigger at " + first.path + " reacts to the value it sets itself (\"" + first.setToName + "\")."
          : "Triggers form a loop through the values they set: " + labels.join(" -> ") + ".") +
          " The loop may be unreachable if the trigger conditions never hold together - verify the expressions.",
        path: first.path,
        messageData: {
          cycle: labels,
          triggerIndexes: members.map(member => member.index),
          setRoots: members.map(member => member.setRoot),
        },
        related: members.map(member => ({ path: member.path })),
        reproduction: reproduction,
      });
    });
  },
};
