import { settings } from "../../settings";
import { ILintRule, LintContext } from "../rule";
import { classifySiteRefs } from "../expression-utils";
import { ElementRecord, ExpressionSite, ParsedRef } from "../symbols";
import { ILintReproduction } from "../types";

const SELF_PROPS: { [prop: string]: boolean } = { visibleIf: true, enableIf: true, requiredIf: true };

function equalsCI(a: string, b: string): boolean {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase();
}

function hasItemValueFrame(site: ExpressionSite): boolean {
  return site.scope.some(frame => frame.kind === "itemValue");
}

function isSelfRef(ref: ParsedRef, owner: ElementRecord, site: ExpressionSite): boolean {
  if (ref.status === "skipped") return false;
  const root = ref.segments.length > 0 ? ref.segments[0].name : "";
  const vars = settings.expressionVariables;
  // {self} inside item-level conditions refers to the item, which is the legitimate pattern
  if (equalsCI(root, vars.self) && owner.kind === "question" && !hasItemValueFrame(site)) return true;
  if (equalsCI(root, owner.name) || (owner.valueName && equalsCI(root, owner.valueName))) return true;
  // a matrix column referencing itself through {row.<own name>},
  // a dynamic-panel question referencing itself through {panel.<own name>}
  if (ref.segments.length > 1 && (equalsCI(root, vars.row) || equalsCI(root, vars.panel))) {
    return equalsCI(ref.segments[1].name, owner.name);
  }
  return false;
}

function buildReproduction(owner: ElementRecord, prop: string): ILintReproduction {
  const res: ILintReproduction = {
    description: "Answering \"" + owner.name + "\" re-evaluates its own " + prop +
      "; if the element becomes hidden its value is cleared, which flips the condition again.",
    steps: [{ set: { [owner.name]: "<any value>" } }],
  };
  if (prop === "visibleIf") {
    res.steps.push({ expect: { visible: { [owner.name]: true } } });
  }
  return res;
}

export const referenceSelfRule: ILintRule = {
  id: "reference/self",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.index.expressionSites.forEach(site => {
      if (site.parseError || !site.owner || !SELF_PROPS[site.prop]) return;
      const owner = site.owner;
      if (!owner.name) return;
      const refs = classifySiteRefs(site, ctx.index, ctx.options);
      const selfRef = refs.filter(ref => isSelfRef(ref, owner, site))[0];
      if (!selfRef) return;
      ctx.report({
        message: "The " + site.prop + " of \"" + owner.name + "\" references the element itself ({" +
          selfRef.raw + "} in \"" + site.text + "\").",
        path: site.path,
        messageData: {
          name: owner.name,
          prop: site.prop,
          reference: selfRef.raw,
          expression: site.text,
        },
        elementName: owner.name,
        elementType: owner.type,
        reproduction: owner.kind === "question" ? buildReproduction(owner, site.prop) : undefined,
      });
    });
  },
};
