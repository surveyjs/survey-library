import { DomDocumentHelper, SurveyModel } from "survey-core";
import { getCollabString } from "../collaboration-strings";
import { presenceInitials } from "../presence/presence-envelope";
import { historyAuthorLabel, IHistoryEntry } from "./history-entry";

// The survey container - the element that holds the collaboration strip, the title
// and the form body as siblings.
//
// The panel is a child of THIS and not of the .sv-components-row inside it, even
// though that row is where the library keeps its own side columns: the row begins
// below the title, so a panel docked there started with a gap under the strip. The
// stylesheet turns the container into a two-column grid while the panel is open.
const CONTAINER_SELECTOR = ".sd-container-modern";

// The sticky strip above the form. The panel has to start below it, and nothing in
// survey-core publishes how tall it is - collab-bar.scss says as much where it
// admits the strip and the top progress bar overlap. So the panel measures it and
// hands the number to CSS, the way question_ranking writes --animation-height and
// the dropdown popup writes --sv-popup-overlay-height.
const BAR_SELECTOR = ".sv-collab-bar";
const TOP_PROPERTY = "--sv-collab-changes-top";
// The height of the FORM's viewport, not the document's: the same basis the sticky
// table of contents takes from rootElement.getBoundingClientRect().
const MAX_PROPERTY = "--sv-collab-changes-max";

export interface IHistoryPanelOptions {
  onEntryClick?: (entry: IHistoryEntry) => void;
}

// The changes panel: a column beside the form listing who changed what.
//
// It is raw DOM owned by the plugin rather than a layout element, because a layout
// element renders through a component registered per UI package, and collaboration
// deliberately ships no component of its own in React, Vue, Angular or js-ui. The
// price is paid here: the node is re-attached when a framework re-renders the column
// row out from under it, exactly as the presence overlay re-applies its decorations.
//
// Every string that comes from another participant - a name, an answer - is written
// with textContent. Nothing here builds markup from a value.
export class HistoryPanel {
  private root: HTMLElement | null = null;
  private listNode: HTMLElement | null = null;
  private entries: ReadonlyArray<IHistoryEntry> = [];
  private visibleValue = false;
  private observer: MutationObserver | undefined;
  private observedRoot: Element | null = null;
  private sizeObserver: ResizeObserver | undefined;
  private disposed = false;

  constructor(private survey: SurveyModel, private options: IHistoryPanelOptions = {}) {}

  public get isVisible(): boolean {
    return this.visibleValue;
  }

  public toggle(): boolean {
    this.setVisible(!this.visibleValue);
    return this.visibleValue;
  }

  public setVisible(visible: boolean): void {
    if (this.disposed || this.visibleValue === visible) return;
    this.visibleValue = visible;
    if (visible)this.render();
    else this.detach();
  }

  public setEntries(entries: ReadonlyArray<IHistoryEntry>): void {
    this.entries = entries;
    if (this.visibleValue)this.render();
  }

  public render(): void {
    if (this.disposed || !this.visibleValue) return;
    const host = this.getHost();
    if (!host) return;
    this.observe();
    const root = this.ensureRoot();
    if (!root) return;
    // Appended, never inserted between the framework's own children: an extra LAST
    // child is tolerated, while a node in the middle makes React remove the wrong one.
    if (root.parentElement !== host) host.appendChild(root);
    this.fillList();
    this.measure();
    this.observeSize();
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.observer?.disconnect();
    this.observer = undefined;
    this.observedRoot = null;
    this.detach();
    this.root = null;
    this.listNode = null;
  }

  private getHost(): Element | null {
    const surveyRoot = (this.survey as any).rootElement as Element | undefined;
    if (!surveyRoot) return null;
    return surveyRoot.matches(CONTAINER_SELECTOR)
      ? surveyRoot
      : surveyRoot.querySelector(CONTAINER_SELECTOR);
  }

  private detach(): void {
    this.sizeObserver?.disconnect();
    this.sizeObserver = undefined;
    this.root?.remove();
  }

  // Two numbers the stylesheet cannot work out on its own: where the panel has to
  // start so the strip does not cover it, and how tall the visible part of the form
  // is. Without the second one the panel would be as tall as the whole form, and
  // nothing inside it would ever need to scroll.
  private measure(): void {
    const root = this.root;
    const host = this.getHost();
    if (!root || !host) return;
    const bar = host.querySelector(BAR_SELECTOR);
    const barHeight = !!bar ? bar.getBoundingClientRect().height : 0;
    root.style.setProperty(TOP_PROPERTY, barHeight + "px");
    const surveyRoot = (this.survey as any).rootElement as Element | undefined;
    if (!surveyRoot) return;
    root.style.setProperty(MAX_PROPERTY, surveyRoot.getBoundingClientRect().height + "px");
  }

  // The strip grows when its info rows wrap, and the form viewport changes with the
  // window, so both are watched rather than measured once.
  private observeSize(): void {
    if (!!this.sizeObserver) return;
    const win: any = DomDocumentHelper.getDocument()?.defaultView;
    if (!win || typeof win.ResizeObserver !== "function") return;
    const surveyRoot = (this.survey as any).rootElement as Element | undefined;
    const bar = this.getHost()?.querySelector(BAR_SELECTOR);
    this.sizeObserver = new win.ResizeObserver(() => this.measure());
    if (!!surveyRoot)this.sizeObserver!.observe(surveyRoot);
    if (!!bar)this.sizeObserver!.observe(bar);
  }

  // The container is re-rendered on a page change and on completion, which can take
  // our node with it. Re-attaching from the observer costs nothing while the panel is
  // closed, because render() returns at once.
  private observe(): void {
    const surveyRoot = (this.survey as any).rootElement as Element | undefined;
    const root = surveyRoot ?? null;
    if (root === this.observedRoot) return;
    this.observedRoot = root;
    this.observer?.disconnect();
    this.observer = undefined;
    if (!root) return;
    const win: any = DomDocumentHelper.getDocument()?.defaultView;
    if (!win || typeof win.MutationObserver !== "function") return;
    this.observer = new win.MutationObserver(() => {
      if (!this.visibleValue || !this.root) return;
      if (this.root.isConnected && this.root.parentElement === this.getHost()) return;
      this.render();
    });
    this.observer.observe(root, { childList: true, subtree: true });
  }

  private ensureRoot(): HTMLElement | null {
    if (!!this.root) return this.root;
    const doc = DomDocumentHelper.getDocument();
    if (!doc) return null;
    const root = doc.createElement("aside");
    root.className = "sv-collab-changes";

    const header = doc.createElement("div");
    header.className = "sv-collab-changes__header";
    header.textContent = getCollabString("collabHistory");
    root.appendChild(header);

    const list = doc.createElement("ol");
    list.className = "sv-collab-changes__list";
    root.appendChild(list);

    this.root = root;
    this.listNode = list;
    return root;
  }

  private fillList(): void {
    const doc = DomDocumentHelper.getDocument();
    const list = this.listNode;
    if (!doc || !list) return;
    list.replaceChildren();
    if (this.entries.length === 0) {
      const empty = doc.createElement("li");
      empty.className = "sv-collab-changes__empty";
      empty.textContent = getCollabString("collabHistoryEmpty");
      list.appendChild(empty);
      return;
    }
    // Newest first: the last thing that happened is what a reader is looking for.
    for (let i = this.entries.length - 1; i >= 0; i--) {
      list.appendChild(this.createRow(doc, this.entries[i]));
    }
  }

  private createRow(doc: Document, entry: IHistoryEntry): HTMLElement {
    const item = doc.createElement("li");
    item.className = "sv-collab-changes__item";

    // A button, so the keyboard reaches it and the focus ring comes for free.
    const row = doc.createElement("button");
    row.type = "button";
    row.className = "sv-collab-changes__row";
    row.onclick = () => this.options.onEntryClick?.(entry);

    const avatar = doc.createElement("span");
    // Our own edits carry slot 0, the theme's "unknown user" grey: the panel is not a
    // roster, and giving ourselves a participant colour we show nowhere else would
    // invent an identity the rest of the UI does not have.
    avatar.className = "sv-collab-changes__avatar sv-collab-changes__avatar--color-" + entry.colorIndex;
    // Initials only for a participant with a name. "You" and "Someone" are labels,
    // not people, and lettering them would read as somebody called Yo or So.
    avatar.textContent = !!entry.name ? presenceInitials(entry.name) : "";
    row.appendChild(avatar);

    const body = doc.createElement("span");
    body.className = "sv-collab-changes__body";
    body.appendChild(this.createLine(doc, "sv-collab-changes__who", historyAuthorLabel(entry)));
    body.appendChild(this.createLine(doc, "sv-collab-changes__what", entry.title));
    body.appendChild(this.createLine(doc, "sv-collab-changes__value", entry.text));
    row.appendChild(body);

    item.appendChild(row);
    return item;
  }

  private createLine(doc: Document, css: string, text: string): HTMLElement {
    const node = doc.createElement("span");
    node.className = css;
    node.textContent = text;
    return node;
  }
}
