import { getFunctionOperands } from "./expression-utils";
import { ExpressionSite } from "./symbols";

// The first argument of iif() is a condition whatever property the call sits in, so it gets
// the same always-false/always-true reasoning a visibleIf gets. Carved into a synthesized
// site: the fold and ref machinery is memoized per site object, and a stable identity keeps
// that memoization working. Deliberately NOT pushed into index.expressionSites - the walker's
// list feeds getNeverVisibleElements and the per-site rules, where a sub-site would double
// what its parent already carries.
export function getIifConditionSubSites(site: ExpressionSite): Array<ExpressionSite> {
  if (!site.subSites) {
    const subs: Array<ExpressionSite> = [];
    if (site.ast) {
      getFunctionOperands(site.ast)
        .filter(fn => fn.functionName.toLowerCase() === "iif")
        .forEach((fn, k) => {
          const condition = fn.paramValues[0];
          if (!condition) return;
          subs.push({
            text: condition.toString(),
            kind: "condition",
            path: site.path + ".iif[" + k + "]",
            prop: site.prop,
            owner: site.owner,
            scope: site.scope,
            synthesized: true,
            ast: condition,
            subOf: site,
          });
        });
    }
    site.subSites = subs;
  }
  return site.subSites;
}
