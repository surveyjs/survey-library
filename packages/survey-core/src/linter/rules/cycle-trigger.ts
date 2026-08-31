import { ILintRule, LintContext } from "../rule";
import { buildTriggerSetStep, classifySiteRefs } from "../expression-utils";
import { reportCycles } from "../cycle-report";
import { TriggerRecord } from "../symbols";
import { ILintReproduction } from "../types";
import { SurveyLintReasons, SurveyLintReproductionReasons } from "../reasons";

const reasons = SurveyLintReasons["cycle/trigger"];

// Triggers write and expressions read DATA keys: a question's name and its
// valueName identify the same signal. Canonicalize both edge endpoints to the
// resolved element name so "setToName: q1" links to "{v1}" when v1 is q1's valueName.
function canonicalRoot(ctx: LintContext, root: string): string {
  const record = ctx.index.findByDataName(root);
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
    // Maps, not object literals: a trigger path is a fixed shape, but the lookups share the
    // rest of the linter's policy on user-derived keys
    const byId = new Map<string, TriggerRecord>();
    const roots = new Map<string, Array<string>>();
    triggers.forEach(trigger => {
      byId.set(trigger.path, trigger);
      roots.set(trigger.path, getExpressionRoots(ctx, trigger));
    });
    // the graph nodes are trigger paths: an index would read as a position in the JSON,
    // and messageData.cycle names the loop the way the other cycle rule names it
    const ids = triggers.map(trigger => trigger.path);
    const getEdges = (id: string): Array<string> => {
      const setRoot = canonicalRoot(ctx, byId.get(id).setRoot);
      return ids.filter(otherId => roots.get(otherId).indexOf(setRoot) > -1);
    };
    reportCycles<TriggerRecord>(ctx, {
      nodes: ids,
      edges: getEdges,
      member: id => byId.get(id),
      reasons: reasons,
      describe: ({ members, isSelf }) => {
        const first = members[0];
        const labels = members.map(triggerLabel);
        const setStep = buildTriggerSetStep(first);
        return {
          message: (isSelf
            ? "The trigger at " + first.path + " reacts to the value it sets itself (\"" + first.setToName + "\")."
            : "Triggers form a loop through the values they set: " + labels.join(" -> ") + ".") +
            " The loop may be unreachable if the trigger conditions never hold together - verify the expressions.",
          path: first.path,
          messageData: {
            // "labels" holds the rendered strings the English message lists; "members" holds
            // the same triggers unformatted, so a host can compose its own labels.
            labels: labels,
            members: members.map(member => ({
              path: member.path, type: member.type, setToName: member.setToName,
            })),
            setToName: first.setToName,
            triggerIndexes: members.map(member => member.index),
            setRoots: members.map(member => member.setRoot),
          },
          related: members.map(member => ({ path: member.path })),
          reproduction: setStep ? <ILintReproduction>{
            description: "This fires the first trigger; each trigger in the cycle sets a value the next one reacts to.",
            reason: SurveyLintReproductionReasons.triggerCycle,
            steps: [setStep],
          } : undefined,
        };
      },
    });
  },
};
