import { DomDocumentHelper, SurveyModel } from "survey-core";
import { IPresencePeer } from "./presence-envelope";
import { IDecoration, IPeerColors, IPresenceCursorSample, IPresenceScene } from "./presence-scene";
import { IPresenceState, PRESENCE_SELECTORS } from "./presence-state";

// The form's half of the presence seam: which node a peer focus points at, and
// where their cursor is.
//
// Every lookup is scoped to the survey's own root element rather than the whole
// document, so two surveys on one page do not decorate each other.
export class SurveyPresenceScene implements IPresenceScene {
  // Scheduled cursor paths per peer, rebuilt when a frame arrives. Kept here and
  // not in the overlay because only this class knows the state shape.
  private paths = new Map<string, Array<IPresenceCursorSample>>();

  constructor(private survey: SurveyModel) {}

  // The theme's user-colour slots are the single source of truth for who is which
  // colour: the avatar in the strip is painted by a CSS class for the same slot, so
  // resolving the slot here is what keeps a participant one colour everywhere.
  //
  // It has to be RESOLVED rather than left as a var() reference: the cursor layer is
  // a fixed element on the body, outside the element that carries the theme, where a
  // --sjs2-* variable does not exist.
  public peerColors(peer: IPresencePeer): IPeerColors {
    // The theme's own "unknown user" grey. Reached only on a page carrying no
    // survey-core theme at all, where the form itself is unstyled too.
    const fallback = { bg: "#808080", fg: "#ffffff" };
    const root = this.getRoot();
    if (!root) return fallback;
    const view = root.ownerDocument?.defaultView;
    if (!view || typeof view.getComputedStyle !== "function") return fallback;
    const slot = peer.colorIndex;
    const style = view.getComputedStyle(root);
    const bg = style.getPropertyValue("--sjs2-color-utility-user-bg-color-" + slot).trim();
    const fg = style.getPropertyValue("--sjs2-color-utility-user-fg-on-color-" + slot).trim();
    if (!bg) return fallback;
    return { bg, fg: fg || fallback.fg };
  }

  public getRoot(): Element | null {
    const root = (this.survey as any).rootElement as Element | undefined;
    if (!!root) return root;
    const doc = DomDocumentHelper.getDocument();
    return doc ? doc.body : null;
  }

  public collectDecorations(peers: ReadonlyMap<string, IPresencePeer>): Map<HTMLElement, IDecoration> {
    const wanted = new Map<HTMLElement, IDecoration>();
    peers.forEach((peer) => {
      const state = peer.state as IPresenceState;
      if (!state || !state.focus) return;
      const node = this.findQuestionNode(state.focus);
      // First peer to claim a node wins the ring. Two carets in one question is
      // rare enough that a second ring would cost more than it explains.
      if (!node || wanted.has(node)) return;
      const colors = this.peerColors(peer);
      wanted.set(node, {
        clientId: peer.clientId,
        color: colors.bg,
        foreground: colors.fg,
        name: peer.name,
        clip: this.scrollClipOf(node),
      });
    });
    return wanted;
  }

  public peerUpdated(peer: IPresencePeer): void {
    const state = peer.state as IPresenceState;
    const cursor = !!state ? state.cur : null;
    if (!cursor || !cursor.n || !Array.isArray(cursor.p) || cursor.p.length === 0) {
      // A retained frame carries no cursor; the previous path is kept so the arrow
      // does not blink away every time the peer merely changes focus.
      return;
    }
    // Schedule the packet from now: the receiver clock is the only one both sides
    // agree on, and the replay runs behind it anyway.
    const start = Date.now();
    this.paths.set(
      peer.clientId,
      cursor.p.map((point) => ({ anchor: cursor.n, x: point.x, y: point.y, at: start + (point.t || 0) }))
    );
  }

  public peerRemoved(clientId: string): void {
    this.paths.delete(clientId);
  }

  public cursorSamples(clientId: string): Array<IPresenceCursorSample> | null {
    return this.paths.get(clientId) ?? null;
  }

  public projectCursor(sample: IPresenceCursorSample): { x: number, y: number } | null {
    const node = this.findQuestionNode(sample.anchor);
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    return { x: rect.left + sample.x * rect.width, y: rect.top + sample.y * rect.height };
  }

  public dispose(): void {
    this.paths.clear();
  }

  public findQuestionNode(name: string): HTMLElement | null {
    const root = this.getRoot();
    if (!root || !name) return null;
    return root.querySelector<HTMLElement>(PRESENCE_SELECTORS.question(name));
  }

  // Top-level question roots only: nested [data-name] nodes (matrix cells,
  // composite parts) carry names that are not unique across the survey.
  public topLevelQuestionNodes(): Array<HTMLElement> {
    const root = this.getRoot();
    if (!root) return [];
    const all = Array.from(root.querySelectorAll<HTMLElement>(PRESENCE_SELECTORS.questionRoot));
    return all.filter((el) => {
      const parent = el.parentElement;
      const outer = !!parent ? parent.closest(PRESENCE_SELECTORS.questionRoot) : null;
      return !outer || !root.contains(outer);
    });
  }

  // The visible area of the node's nearest scrolling ancestor, so a badge is not
  // drawn for a question that is scrolled out of its container.
  private scrollClipOf(node: HTMLElement): IDecoration["clip"] {
    let el: HTMLElement | null = node.parentElement;
    while(!!el) {
      const style = el.ownerDocument?.defaultView?.getComputedStyle(el);
      const overflow = !!style ? style.overflowY + style.overflowX : "";
      if (overflow.indexOf("auto") >= 0 || overflow.indexOf("scroll") >= 0) {
        const rect = el.getBoundingClientRect();
        return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
      }
      el = el.parentElement;
    }
    return undefined;
  }
}
