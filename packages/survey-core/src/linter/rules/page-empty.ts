import { ILintRule, LintContext } from "../rule";
import { ContainerRecord, ElementRecord } from "../symbols";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["page/empty"];

// A question renders unless it is statically hidden (visible: false with no visibleIf) or its
// visibleIf can never hold. html/image and custom/unknown types count as rendering. A panel
// renders when any child does.
//
// The two tests are deliberately not symmetric for a panel: a panel with visible: false is not
// renderable, but a panel with a dead visibleIf is, because expression/contradiction already
// reports that condition and one defect should produce one finding.
function buildRenderableCheck(containers: Array<ContainerRecord>,
  neverVisible: Set<ElementRecord>): (el: ElementRecord) => boolean {
  const containerByRecord = new Map<ElementRecord, ContainerRecord>();
  containers.forEach(container => {
    if (container.record) containerByRecord.set(container.record, container);
  });
  const isRenderable = (el: ElementRecord): boolean => {
    if (el.json && el.json.visible === false && typeof el.json.visibleIf !== "string") return false;
    if (el.kind === "panel") {
      const container = containerByRecord.get(el);
      if (!container) return true;
      return container.children.some(isRenderable);
    }
    return !neverVisible.has(el);
  };
  return isRenderable;
}

// detailElements render only when detailPanelMode says so; with the default "none" they are
// authored content no respondent ever sees.
function checkHiddenDetailElements(ctx: LintContext, record: ElementRecord): void {
  const json = record.json;
  if (!record.matrixColumns || !json) return;
  if (!Array.isArray(json.detailElements) || json.detailElements.length === 0) return;
  if (json.detailPanelMode !== undefined && json.detailPanelMode !== "none") return;
  ctx.report({
    message: "The detailElements of \"" + record.name + "\" are never shown: its" +
      " detailPanelMode is \"none\" (the default).",
    path: record.path + ".detailElements",
    reason: reasons.detailElementsHidden,
    messageData: {
      name: record.name,
      questionType: record.type,
      childCount: json.detailElements.length,
    },
    elementName: record.name,
    elementType: record.type,
  });
}

export const pageEmptyRule: ILintRule = {
  id: "page/empty",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.index.allElements.forEach(record => checkHiddenDetailElements(ctx, record));
    const isRenderable = buildRenderableCheck(ctx.index.containers, ctx.getNeverVisibleElements());
    ctx.index.containers.forEach(container => {
      if (container.kind === "panelDynamicTemplate") {
        if (container.children.length === 0) {
          ctx.report({
            message: "The dynamic panel \"" + (container.name || container.path) +
              "\" has an empty template - its panels have nothing to render.",
            path: container.path,
            reason: reasons.emptyTemplate,
            messageData: { name: container.name, kind: "emptyTemplate" },
            elementName: container.name,
            elementType: "paneldynamic",
          });
        }
        return;
      }
      if (container.children.some(isRenderable)) return;
      const kind = container.kind;
      const label = container.name || container.path;
      const isEmpty = container.children.length === 0;
      const reasonText = isEmpty
        ? "has no elements"
        : "has no elements that can ever render (every element is statically hidden, never shown" +
          " by its own condition, or empty)";
      ctx.report({
        message: "The " + kind + " \"" + label + "\" " + reasonText + ".",
        path: container.path,
        reason: isEmpty ? reasons.noElements : reasons.noRenderableElements,
        messageData: {
          name: container.name,
          kind: kind,
          childCount: container.children.length,
        },
        elementName: container.name,
        elementType: container.record ? container.record.type : kind,
      });
    });
  },
};
