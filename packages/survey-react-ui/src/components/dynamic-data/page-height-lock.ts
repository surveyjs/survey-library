// Prototype for the #11873 showcase: a short last page of a paged matrix keeps the height a full
// page last had, so the pager and the "Add row" toolbar do not jump from under the pointer. The
// shipping version belongs in survey-core as a framework-free DOM helper; this file is throwaway.
import { QuestionMatrixDynamicModel } from "survey-core";

export class PageHeightLock {
  private wrapper: HTMLElement | undefined;
  private table: HTMLElement | undefined;
  private observer: ResizeObserver | undefined;
  private wrapperWidth: number = -1;
  // The height is only valid for the page size it was measured under.
  private height: number = 0;
  private heightPageSize: number = 0;

  constructor(private question: QuestionMatrixDynamicModel) { }

  // The wrapper is passed every time: React mounts a new one after the placeholder was shown.
  public update(wrapper: HTMLElement | undefined): void {
    if (typeof ResizeObserver === "undefined") return;
    // setControl() ignores null, so a wrapper kept by the component can be a detached node.
    if (!this.question.renderedTable.showTable || !wrapper || !wrapper.isConnected) {
      this.unbind();
      return;
    }
    if (wrapper !== this.wrapper) {
      this.unbind();
      this.wrapper = wrapper;
      this.observer = new ResizeObserver((entries) => this.onResize(entries));
      this.observer.observe(wrapper);
    }
    const table = <HTMLElement>wrapper.querySelector("table") || undefined;
    if (table !== this.table) {
      if (this.table) {
        this.observer.unobserve(this.table);
      }
      this.table = table;
      if (table) {
        this.observer.observe(table);
      }
    }
    this.measure();
    this.apply();
  }
  public dispose(): void {
    this.unbind();
  }

  private get isFullPage(): boolean {
    const rows = this.question.visibleRows;
    return Array.isArray(rows) && rows.length >= this.question.pageSize;
  }
  private onResize(entries: Array<ResizeObserverEntry>): void {
    for (const entry of entries) {
      if (entry.target !== this.wrapper) continue;
      const width = Math.round(entry.contentRect.width);
      // Every row re-wraps: the stored height describes a layout that is gone.
      if (this.wrapperWidth >= 0 && this.wrapperWidth !== width) {
        this.release();
      }
      this.wrapperWidth = width;
    }
    this.measure();
    this.apply();
  }
  // A single full page is measured too: its height is what the first overflow page needs.
  private measure(): void {
    const q = this.question;
    if (!this.table || q.pageSize <= 0 || q.isMobile || !this.isFullPage) return;
    // The table and not the wrapper: the wrapper reports its own min-height once one is set.
    const height = this.table.offsetHeight;
    if (height <= 0) return;
    this.height = height;
    this.heightPageSize = q.pageSize;
  }
  private apply(): void {
    if (!this.wrapper) return;
    const q = this.question;
    if (q.pageSize <= 0 || q.isMobile || (this.height > 0 && this.heightPageSize !== q.pageSize)) {
      this.release();
      return;
    }
    const isLocked = this.height > 0 && q.pageCount > 1 && !this.isFullPage;
    this.wrapper.style.minHeight = isLocked ? this.height + "px" : "";
  }
  private release(): void {
    this.height = 0;
    this.heightPageSize = 0;
    if (this.wrapper) {
      this.wrapper.style.minHeight = "";
    }
  }
  private unbind(): void {
    this.release();
    if (this.observer) {
      this.observer.disconnect();
    }
    this.observer = undefined;
    this.wrapper = undefined;
    this.table = undefined;
    this.wrapperWidth = -1;
  }
}
