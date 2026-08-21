import { ILintRule, LintContext } from "../rule";
import { ContainerRecord, ElementRecord } from "../symbols";

// A question renders unless it is statically hidden (visible: false with no visibleIf).
// html/image and custom/unknown types count as rendering. A panel renders when any child does.
function buildRenderableCheck(containers: Array<ContainerRecord>): (el: ElementRecord) => boolean {
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
    return true;
  };
  return isRenderable;
}

export const pageEmptyRule: ILintRule = {
  id: "page/empty",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const isRenderable = buildRenderableCheck(ctx.index.containers);
    ctx.index.containers.forEach(container => {
      if (container.kind === "panelDynamicTemplate") {
        if (container.children.length === 0) {
          ctx.report({
            message: "The dynamic panel \"" + (container.name || container.path) +
              "\" has an empty template - its panels have nothing to render.",
            path: container.path,
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
      const reason = container.children.length === 0
        ? "has no elements"
        : "has no elements that can ever render (every element is statically hidden or empty)";
      ctx.report({
        message: "The " + kind + " \"" + label + "\" " + reason + ".",
        path: container.path,
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
