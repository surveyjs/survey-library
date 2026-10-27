import { DomDocumentHelper } from "../global_variables_utils";

// A framework-agnostic tooltip for any element carrying the `data-sv-tooltip` attribute.
// One set of delegated listeners per document and one shared tooltip element: elements opt in
// by markup alone, so the same tooltip works for survey actions, Creator controls, or host pages.
export const tooltipAttributeName = "data-sv-tooltip";

const showDelay = 200;
const gap = 8;

interface ITooltipTargetRect { left: number, top: number, right: number, bottom: number }
interface ITooltipSize { width: number, height: number }

export function calculateTooltipPosition(target: ITooltipTargetRect, size: ITooltipSize, viewport: ITooltipSize): { left: number, top: number, placement: "top" | "bottom" } {
  const below = target.bottom + gap;
  const above = target.top - gap - size.height;
  const placement = below + size.height > viewport.height && above >= 0 ? "top" : "bottom";
  const fits = (left: number) => left >= 0 && left + size.width <= viewport.width;
  const candidates = [(target.left + target.right - size.width) / 2, target.left, target.right - size.width];
  let left = candidates.filter(fits)[0];
  if (left === undefined) {
    left = Math.min(Math.max(candidates[0], 0), viewport.width - size.width);
  }
  return { left, top: placement === "top" ? above : below, placement };
}

class TooltipManager {
  private element: HTMLElement;
  private trigger: HTMLElement | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private titleOwner: HTMLElement | undefined;
  private suppressedTitle: string | null = null;
  private listenedRoots = new WeakSet<Document | ShadowRoot>();

  constructor(private doc: Document) {
    this.listen(doc);
  }
  // A pointer move between two elements of one shadow tree is not dispatched to the document
  // (both ends retarget to the same host), so each shadow root hosting triggers gets its own listeners.
  public listen(root: Document | ShadowRoot): void {
    if (this.listenedRoots.has(root)) return;
    this.listenedRoots.add(root);
    root.addEventListener("pointerover", this.onPointerOver);
    root.addEventListener("pointerout", this.onPointerOut);
    root.addEventListener("pointerdown", this.hide, true);
    root.addEventListener("focusin", this.onFocusIn);
    root.addEventListener("focusout", this.hide);
    root.addEventListener("scroll", this.hide, true);
    root.addEventListener("keydown", this.onKeyDown);
  }
  private findTrigger(event: Event): HTMLElement | undefined {
    const target = (event.composedPath ? event.composedPath()[0] : event.target) as Element;
    return target?.closest?.(`[${tooltipAttributeName}]`) as HTMLElement || undefined;
  }
  private onPointerOver = (event: PointerEvent): void => {
    // A pressed button means a drag (or a text selection) is in progress: crossing a trigger then is not a hover.
    if (event.pointerType === "touch" || event.buttons) return;
    const trigger = this.findTrigger(event);
    if (trigger !== this.trigger) {
      this.hide();
      if (trigger)this.schedule(trigger);
    }
  };
  private onPointerOut = (event: PointerEvent): void => {
    const next = event.relatedTarget as Node;
    if (this.trigger && !(next && this.trigger.contains(next)))this.hide();
  };
  private onFocusIn = (event: FocusEvent): void => {
    const trigger = this.findTrigger(event);
    if (!trigger || trigger === this.trigger) return;
    this.hide();
    let isKeyboardFocus = true;
    try {
      isKeyboardFocus = trigger.matches(":focus-visible");
    } catch{ }
    if (isKeyboardFocus)this.schedule(trigger);
  };
  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape")this.hide();
  };
  private schedule(trigger: HTMLElement): void {
    this.trigger = trigger;
    this.timer = setTimeout(() => this.show(trigger), showDelay);
  }
  private show(trigger: HTMLElement): void {
    const text = trigger.getAttribute(tooltipAttributeName);
    if (!text || !trigger.isConnected) return;
    const tooltip = this.getElement();
    // Mount inside the trigger's theme root so the tooltip inherits the theme's CSS variables.
    const rootNode = trigger.getRootNode() as ShadowRoot | Document;
    const container = trigger.closest(".sd-theme-root") || (rootNode !== this.doc ? rootNode : this.doc.body);
    if (tooltip.parentNode !== container) container.appendChild(tooltip);
    tooltip.textContent = text;
    // The top layer escapes overflow clipping, z-index stacking and transformed ancestors.
    (tooltip as any).showPopover?.();
    tooltip.style.display = "block";
    // Measure at the origin: a position left over from a previous trigger near the viewport edge would shrink the width.
    tooltip.style.left = "0px";
    tooltip.style.top = "0px";
    const docElement = this.doc.documentElement;
    const tooltipRect = tooltip.getBoundingClientRect();
    const position = calculateTooltipPosition(trigger.getBoundingClientRect(), tooltipRect,
      { width: docElement.clientWidth, height: docElement.clientHeight });
    tooltip.style.left = position.left + "px";
    tooltip.style.top = position.top + "px";
    tooltip.classList.add("sv-tooltip--visible");
    // Triggers keep their `title` (selectors and automation rely on it); it is taken off only while
    // the tooltip is shown, so the browser's native tooltip does not appear on top of it.
    this.titleOwner = trigger;
    this.suppressedTitle = trigger.getAttribute("title");
    trigger.removeAttribute("title");
  }
  private hide = (): void => {
    clearTimeout(this.timer);
    this.timer = undefined;
    this.trigger = undefined;
    // A renderer may have set a new title meanwhile; that one wins.
    if (this.titleOwner && this.suppressedTitle !== null && !this.titleOwner.hasAttribute("title")) {
      this.titleOwner.setAttribute("title", this.suppressedTitle);
    }
    this.titleOwner = undefined;
    this.suppressedTitle = null;
    if (!this.element) return;
    this.element.classList.remove("sv-tooltip--visible");
    this.element.style.display = "";
    if ((this.element as any).hidePopover && this.element.matches(":popover-open")) {
      (this.element as any).hidePopover();
    }
  };
  private getElement(): HTMLElement {
    if (!this.element) {
      this.element = this.doc.createElement("div");
      this.element.className = "sv-tooltip";
      this.element.setAttribute("role", "tooltip");
      this.element.setAttribute("popover", "manual");
    }
    return this.element;
  }
}

const managers = new WeakMap<Document, TooltipManager>();

// Accepts a document or any node rendered in it; a node inside a shadow root also gets that root covered.
export function initTooltips(node?: Node): void {
  node = node || DomDocumentHelper.getDocument();
  if (!node) return;
  const doc = node.nodeType === 9 ? node as Document : node.ownerDocument;
  if (!doc) return;
  let manager = managers.get(doc);
  if (!manager) {
    manager = new TooltipManager(doc);
    managers.set(doc, manager);
  }
  const root = node.getRootNode?.();
  if (root && root !== doc && (root as ShadowRoot).host) manager.listen(root as ShadowRoot);
}
