import { Base } from "../base";
import { property } from "../decorators";
import { DomDocumentHelper } from "../global_variables_utils";

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
// renderer attaches the element that holds the action bar of the chips (the bar is its first child;
// its last item is "Show More") and calls update() after it has drawn changed chips; a resize is
// observed here. On a phone the row scrolls sideways instead, and nothing is measured.
export class FilterChipsLayout extends Base {
  private container: HTMLElement;
  private resizeObserver: ResizeObserver;
  // "Show More" was clicked: every chip shows, in as many rows as they need.
  @property({ defaultValue: false }) isExpanded: boolean;
  // How many chips the collapsed row shows; -1 while every chip fits, or nothing was measured.
  @property({ defaultValue: -1 }) fitCount: number;
  @property({ defaultValue: false }) isMobile: boolean;

  public getType(): string { return "filterchipslayout"; }
  public get hasOverflow(): boolean { return this.fitCount > -1; }
  public attach(container: HTMLElement): void {
    if (this.container === container) return;
    this.detach();
    this.container = container;
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver((): void => { this.update(); });
      this.resizeObserver.observe(container);
    }
    this.update();
  }
  public detach(): void {
    if (!!this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    this.container = undefined;
  }
  public update(): void {
    const bar = !!this.container ? <HTMLElement>this.container.firstElementChild : undefined;
    if (!bar || this.isMobile) {
      this.fitCount = -1;
      return;
    }
    const items: Array<HTMLElement> = Array.prototype.slice.call(bar.children);
    if (items.length < 2) {
      this.fitCount = -1;
      return;
    }
    this.observe(items);
    const more = items.pop();
    this.fitCount = fitFilterChips(items.map((el: HTMLElement): number => this.getWidth(el)),
      this.getAvailableSpace(bar), this.getGap(bar), this.getWidth(more));
  }
  public dispose(): void {
    this.detach();
    super.dispose();
  }
  // A chip whose text changes changes its width without resizing the row: each chip is observed too.
  // Observing an element twice is a no-op, and a removed one reports nothing.
  private observe(items: Array<HTMLElement>): void {
    if (!this.resizeObserver) return;
    items.forEach((el: HTMLElement): void => { this.resizeObserver.observe(el); });
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
