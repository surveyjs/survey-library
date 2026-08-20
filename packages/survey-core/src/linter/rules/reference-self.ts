import { ILintRule, LintContext } from "../rule";
import { classifySiteRefs, equalsCI } from "../expression-utils";
import { ElementRecord, ExpressionSite, ParsedRef } from "../symbols";
import { ILintReproduction } from "../types";
import { ILintResolvedSettings } from "../lint-settings";

const SELF_PROPS: { [prop: string]: boolean } = { visibleIf: true, enableIf: true, requiredIf: true };

function hasItemValueFrame(site: ExpressionSite): boolean {
  return site.scope.some(frame => frame.kind === "itemValue");
}

function isSelfRef(ref: ParsedRef, owner: ElementRecord, site: ExpressionSite,
  lintSettings: ILintResolvedSettings): boolean {
  if (ref.status === "skipped") return false;
  const root = ref.segments.length > 0 ? ref.segments[0].name : "";
  const vars = lintSettings.expressionVariables;
  // {self} inside item-level conditions refers to the item, which is the legitimate pattern
  if (equalsCI(root, vars.self) && owner.kind === "question" && !hasItemValueFrame(site)) return true;
  // per-item conditions (a choice's/rate value's own visibleIf/enableIf) legitimately
  // reference the owning question to filter items by its current value - only the item
  // hides, the question value stays, so evaluation converges (the exclusive-"none" idiom)
  if (hasItemValueFrame(site)) return false;
  // identity, not name equality: a matrix column or a template question may share its
  // name with a top-level question, and then {name} resolves to that other element.
  // classifyRef already resolved the root (byName/byValueName) and the {row.x}/{panel.x}
  // inner name, so comparing records covers both forms at once.
  return ref.resolvedTo === owner;
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
      const selfRef = refs.filter(ref => isSelfRef(ref, owner, site, ctx.index.settings))[0];
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
