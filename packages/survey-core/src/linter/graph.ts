// Finds elementary cycles reachable via DFS back-edges. Good enough for the small
// dependency graphs of calculated values and triggers; each cycle is reported once,
// rotated so the lexicographically smallest node comes first.
export function findCycles(nodes: Array<string>, getEdges: (node: string) => Array<string>): Array<Array<string>> {
  // Maps/Sets, not object literals: node names come from user JSON and may
  // collide with Object.prototype keys ("constructor", "__proto__", ...).
  const colors = new Map<string, number>();
  const stack: Array<string> = [];
  const cycles: Array<Array<string>> = [];
  const seen = new Set<string>();

  const addCycle = (cycle: Array<string>) => {
    let minIndex = 0;
    for (let i = 1; i < cycle.length; i++) {
      if (cycle[i].toLowerCase() < cycle[minIndex].toLowerCase()) minIndex = i;
    }
    const canonical = cycle.slice(minIndex).concat(cycle.slice(0, minIndex));
    const key = canonical.join("");
    if (seen.has(key)) return;
    seen.add(key);
    cycles.push(canonical);
  };

  const visit = (node: string) => {
    colors.set(node, 1);
    stack.push(node);
    getEdges(node).forEach(next => {
      if (colors.get(next) === 1) {
        addCycle(stack.slice(stack.indexOf(next)));
      } else if (!colors.get(next)) {
        visit(next);
      }
    });
    stack.pop();
    colors.set(node, 2);
  };

  nodes.forEach(node => {
    if (!colors.get(node)) visit(node);
  });
  return cycles;
}
