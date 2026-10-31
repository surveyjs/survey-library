import { findCycles } from "./graph";
import { LintContext, ReportInput } from "./rule";

// What one cycle rule contributes on top of the shared shape: the sentence, where the finding
// points, and whatever else that rule names. "isSelf" separates a node that depends on itself
// from a loop through several of them - the two read differently and carry different reasons.
export interface CycleDescription<T> {
  members: Array<T>;
  // the loop as node identities, first member first
  cycle: Array<string>;
  isSelf: boolean;
}

export interface CycleRule<T> {
  // the graph: node identities and the nodes each one leads to
  nodes: Array<string>;
  edges: (node: string) => Array<string>;
  member: (node: string) => T;
  reasons: { self: string, loop: string };
  describe: (description: CycleDescription<T>) => Omit<ReportInput, "reason">;
}

// The shared half of the two cycle rules: find the cycles, resolve their members, and report
// each one with the loop recorded the same way. messageData.cycle is the closed loop (the
// first identity appears again as the last element), messageData.names is that loop without
// the repetition, and messageData.members is what the rule made of each node.
export function reportCycles<T>(ctx: LintContext, rule: CycleRule<T>): void {
  findCycles(rule.nodes, rule.edges).forEach(cycle => {
    const members = cycle.map(rule.member);
    const isSelf = cycle.length === 1;
    const input = rule.describe({ members: members, cycle: cycle, isSelf: isSelf });
    ctx.report({
      ...input,
      reason: isSelf ? rule.reasons.self : rule.reasons.loop,
      messageData: {
        cycle: cycle.concat([cycle[0]]),
        names: cycle.slice(),
        ...input.messageData,
      },
    });
  });
}
