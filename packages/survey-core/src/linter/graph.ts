// Finds elementary cycles reachable via DFS back-edges. Good enough for the small
// dependency graphs of calculated values and triggers; each cycle is reported once,
// rotated so the lexicographically smallest node comes first.
export function findCycles(nodes: Array<string>, getEdges: (node: string) => Array<string>): Array<Array<string>> {
  const colors: { [node: string]: number } = {};
  const stack: Array<string> = [];
  const cycles: Array<Array<string>> = [];
  const seen: { [key: string]: boolean } = {};

  const addCycle = (cycle: Array<string>) => {
    let minIndex = 0;
    for (let i = 1; i < cycle.length; i++) {
      if (cycle[i].toLowerCase() < cycle[minIndex].toLowerCase()) minIndex = i;
    }
    const canonical = cycle.slice(minIndex).concat(cycle.slice(0, minIndex));
    const key = canonical.join("");
    if (seen[key]) return;
    seen[key] = true;
    cycles.push(canonical);
  };

  const visit = (node: string) => {
    colors[node] = 1;
    stack.push(node);
    getEdges(node).forEach(next => {
      if (colors[next] === 1) {
        addCycle(stack.slice(stack.indexOf(next)));
      } else if (!colors[next]) {
        visit(next);
      }
    });
    stack.pop();
    colors[node] = 2;
  };

  nodes.forEach(node => {
    if (!colors[node]) visit(node);
  });
  return cycles;
}
