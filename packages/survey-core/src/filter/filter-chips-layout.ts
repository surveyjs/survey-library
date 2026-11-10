import { ArrayChanges, Base } from "../base";
import { property } from "../decorators";
import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";

// How many chips the first row shows with the "Show More" link right after the last of them, or -1
// when every chip fits in the row and no link is needed. widths are the chips' own widths in their
// order; gap is the space between two neighbours. At least one chip is always shown: a row too
// narrow for one chip and the link wraps them rather than show the link alone.
export function fitFilterChips(widths: Array<number>, available: number, gap: number, moreWidth: number): number {
  let total = 0;
  widths.forEach((width: number, index: number): void => { total += width + (index > 0 ? gap : 0); });
  if (total <= available) return -1;
  let used = moreWidth;
  let count = 0;
  for (let i = 0; i < widths.length; i++) {
    const next = used + gap + widths[i];
    if (next > available) break;
    used = next;
    count++;
  }
  return Math.max(count, 1);
}

// The quick filters row is one row while collapsed: the chips that fit, then "Show More". It is
// measured the way ResponsivityManager measures an adaptive action bar, but by rows: every chip is
// always rendered - one the collapsed row does not show is taken out of the flow and stays
// measurable (see FilterToolbars) - so its width is known without a separate measuring pass. The
// renderer attaches the element that holds the action bar of the chips (the bar is its first displayed
// child; its last displayed item is "Show More") on mount and detaches it on unmount; nothing else.
// The row is measured again here: on a resize, on a change of the chips under the element (a chip
// added, removed or retitled) and when the control leaves the phone layout. On a phone the row
// scrolls sideways instead, and nothing is measured.
export class FilterChipsLayout extends Base {
  private container: HTMLElement;
  private resizeObserver: ResizeObserver;
  private mutationObserver: MutationObserver;
  // The chips the resize observer watches besides the container: the items of the last measure.
  private observedItems: Array<HTMLElement> = [];
  // "Show More" was clicked: every chip shows, in as many rows as they need.
  @property({ defaultValue: false }) isExpanded: boolean;
  // How many chips the collapsed row shows; -1 while every chip fits, or nothing was measured.
  @property({ defaultValue: -1 }) fitCount: number;
  @property({ defaultValue: false }) isMobile: boolean;

  public getType(): string { return "filterchipslayout"; }
  public attach(container: HTMLElement): void {
    if (this.container === container) return;
    this.detach();
    this.container = container;
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver((): void => { this.update(); });
      this.resizeObserver.observe(container);
    }
    // The chips are the container's grandchildren (container > action bar > items), and a retitled chip
    // changes its text only. Attributes are not observed: update() itself changes the chips' classes.
    // A chip's popup is drawn inside the row, so opening it measures the row once too.
    if (typeof MutationObserver !== "undefined") {
      this.mutationObserver = new MutationObserver((): void => { this.update(); });
      this.mutationObserver.observe(container, { childList: true, subtree: true, characterData: true });
    }
    this.update();
  }
  public detach(): void {
    if (!!this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    if (!!this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
    this.observedItems = [];
    this.container = undefined;
  }
  public update(): void {
    const bar = !!this.container ? this.getRenderedChildren(this.container)[0] : undefined;
    if (!bar || this.isMobile) {
      this.observe([]);
      this.fitCount = -1;
      return;
    }
    const items: Array<HTMLElement> = this.getRenderedChildren(bar);
    if (items.length < 2) {
      this.observe([]);
      this.fitCount = -1;
      return;
    }
    this.observe(items);
    const more = items.pop();
    this.fitCount = fitFilterChips(items.map((el: HTMLElement): number => this.getWidth(el)),
      this.getAvailableSpace(bar), this.getGap(bar), this.getWidth(more));
  }
  // Leaving the phone layout changes no element under the row, so nothing above sees it: the row is
  // measured in the next frame, once it is laid out as a row again (as ResponsivityManager does).
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any, arrayChanges?: ArrayChanges): void {
    super.onPropertyValueChanged(name, oldValue, newValue, arrayChanges);
    if (name !== "isMobile" || !!newValue || !this.container) return;
    DomWindowHelper.requestAnimationFrame((): void => {
      if (!this.container || this.isDisposed) return;
      this.update();
    });
  }
  public dispose(): void {
    this.detach();
    super.dispose();
  }
  // Angular puts an empty host element, hidden, before the bar and before every item, so the children
  // that are not displayed are skipped. A chip taken out of the collapsed row is hidden by visibility,
  // not by display, and is still measured.
  private getRenderedChildren(el: HTMLElement): Array<HTMLElement> {
    return Array.prototype.slice.call(el.children).filter((child: HTMLElement): boolean => this.isRendered(child));
  }
  private isRendered(el: HTMLElement): boolean {
    const style = DomDocumentHelper.getComputedStyle(el);
    return !style || style.display !== "none";
  }
  // A chip whose text changes changes its width without resizing the row: each chip is observed too.
  // The chips a rebuilt row no longer holds are unobserved - an observed element is kept alive by its
  // observer until detach() - and only the new ones are observed: the observer reports every element
  // once as it starts to observe it, so observing the whole row again on each measure (after a
  // disconnect()) would measure it again, and again. The mutation observer that calls update() on a
  // rebuilt row is what keeps this list in step with the row.
  private observe(items: Array<HTMLElement>): void {
    if (!this.resizeObserver) return;
    this.observedItems.forEach((el: HTMLElement): void => {
      if (items.indexOf(el) < 0) {
        this.resizeObserver.unobserve(el);
      }
    });
    items.forEach((el: HTMLElement): void => {
      if (this.observedItems.indexOf(el) < 0) {
        this.resizeObserver.observe(el);
      }
    });
    this.observedItems = [].concat(items);
  }
  protected getWidth(el: HTMLElement): number {
    return el.offsetWidth || el.getBoundingClientRect().width;
  }
  protected getAvailableSpace(el: HTMLElement): number {
    const style = DomDocumentHelper.getComputedStyle(el);
    if (!style) return el.clientWidth;
    return el.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
  }
  protected getGap(el: HTMLElement): number {
    const style = DomDocumentHelper.getComputedStyle(el);
    return !!style ? parseFloat(style.columnGap) || 0 : 0;
  }
}
