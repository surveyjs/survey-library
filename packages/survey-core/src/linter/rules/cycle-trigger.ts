import { BinaryOperand, Const, Variable } from "../../expressions/expressions";
import { ILintRule, LintContext } from "../rule";
import { classifySiteRefs, splitRefSegments } from "../expression-utils";
import { TriggerRecord } from "../symbols";
import { ILintReproduction, LintReproductionStep } from "../types";
import { findCycles } from "../graph";

function getExpressionRoots(ctx: LintContext, trigger: TriggerRecord): Array<string> {
  if (!trigger.expressionSite || !trigger.expressionSite.ast) return [];
  return classifySiteRefs(trigger.expressionSite, ctx.index, ctx.options)
    .filter(ref => ref.status !== "skipped" && ref.segments.length > 0)
    .map(ref => ref.segments[0].name.toLowerCase());
}

function triggerLabel(trigger: TriggerRecord): string {
  let res = trigger.path + " (" + (trigger.type || "trigger");
  if (trigger.setToName) res += " -> " + trigger.setToName;
  return res + ")";
}

// best-effort: a single {var} op const comparison gives a concrete "set" step
function buildSetStep(trigger: TriggerRecord): LintReproductionStep | undefined {
  const ast = trigger.expressionSite ? trigger.expressionSite.ast : undefined;
  if (!(ast instanceof BinaryOperand)) return undefined;
  const left = ast.leftOperand;
  const right = ast.rightOperand;
  let variable: Variable;
  let constant: Const;
  if (left instanceof Variable && right instanceof Const && !(right instanceof Variable)) {
    variable = left;
    constant = right;
  } else if (right instanceof Variable && left instanceof Const && !(left instanceof Variable)) {
    variable = right;
    constant = left;
  } else {
    return undefined;
  }
  const root = splitRefSegments(variable.variable)[0];
  if (!root || !root.name || root.name.indexOf(":") > -1) return undefined;
  return { set: { [root.name]: constant.correctValue } };
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
      const setRoot = byId[id].setRoot.toLowerCase();
      return ids.filter(otherId => roots[otherId].indexOf(setRoot) > -1);
    };
    findCycles(ids, getEdges).forEach(cycle => {
      const members = cycle.map(id => byId[id]);
      const first = members[0];
      const labels = members.map(triggerLabel);
      const setStep = buildSetStep(first);
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
