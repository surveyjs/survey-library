import { DomDocumentHelper, DomWindowHelper } from "survey-core";
import { IPresencePeer } from "./presence-envelope";
import { IDecoration, IPresenceScene, IRect } from "./presence-scene";

// Remote cursors are replayed this far behind real time, so there is always a
// buffered segment ahead to interpolate through: motion stays smooth despite
// network jitter and the ephemeral frames the relay is allowed to drop.
export const CURSOR_BUFFER_MS = 100;
// A cursor that has not moved for this long fades out.
export const CURSOR_IDLE_MS = 30_000;
// Safety repaint for DOM changes no observer catches (animations, scrollIntoView).
export const FALLBACK_TICK_MS = 500;
// Gap between the focus ring and the name badge above it.
const BADGE_GAP_PX = 6;

const CURSOR_SVG =
  "<svg width=\"16\" height=\"18\" viewBox=\"0 0 16 18\" style=\"display:block\">" +
  "<path d=\"M1 1 L1 14 L4.5 10.8 L7 16.5 L9.3 15.5 L6.8 9.9 L11.5 9.6 Z\" " +
  "stroke=\"#fff\" stroke-width=\"1\"/></svg>";

interface IPeerArtifacts {
  cursor: HTMLElement;
  cursorName: HTMLElement;
  badge: HTMLElement;
}

function intersects(a: IRect, b: IRect): boolean {
  return a.left < b.left + b.width && a.left + a.width > b.left &&
    a.top < b.top + b.height && a.top + a.height > b.top;
}

// Uniform Catmull-Rom for one coordinate, u in 0..1 between p1 and p2.
function catmullRom(p0: number, p1: number, p2: number, p3: number, u: number): number {
  return 0.5 * (2 * p1 + (p2 - p0) * u +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u +
    (3 * (p1 - p2) + p3 - p0) * u * u * u);
}

// Renders remote participants.
//
// Element focus is drawn NATIVELY: a `data-collab-focus` attribute plus an inline
// `--collab-peer-color` on the real node, with the ring itself coming from CSS - so
// it scrolls, clips and layers like any built-in decoration, and there is no element
// of ours in the middle. Inline styles and unknown attributes survive a framework
// re-render; a re-CREATED node loses them, which the observer tick below repairs.
//
// Only what cannot be expressed as a decoration of an existing node - the mouse
// cursors and the name badges - lives in a fixed, pointer-transparent layer.
//
// Everything here is product-agnostic; what to decorate and where a cursor is comes
// from the injected IPresenceScene.
export class PresenceOverlay {
  private layer: HTMLElement | null = null;
  private artifacts = new Map<string, IPeerArtifacts>();
  private decorated = new Set<HTMLElement>();
  private disposed = false;
  private scheduled = false;
  private animating = false;
  private fallbackTimer: any;
  private resizeObserver: ResizeObserver | undefined;
  private mutationObserver: MutationObserver | undefined;
  private observedRoot: Element | null = null;
  private onScroll = () => this.refresh();

  constructor(private scene: IPresenceScene, private getPeers: () => ReadonlyMap<string, IPresencePeer>) {
    const doc = DomDocumentHelper.getDocument();
    if (!doc || !doc.body) return;
    this.layer = doc.createElement("div");
    this.layer.className = "collab-presence-layer";
    doc.body.appendChild(this.layer);

    // Capture phase: a scroll inside any container moves the anchors too, and
    // scroll events on inner elements do not bubble.
    doc.addEventListener("scroll", this.onScroll, true);
    const win = DomWindowHelper.getWindow();
    win?.addEventListener("resize", this.onScroll);
    this.fallbackTimer = setInterval(() => this.refresh(), FALLBACK_TICK_MS);
    this.observe();
  }

  // Coalesced through rAF: scroll, resize and mutation storms must not each cause
  // a layout pass.
  public refresh(): void {
    if (this.scheduled || this.disposed) return;
    this.scheduled = true;
    this.raf(() => {
      this.scheduled = false;
      this.render();
    });
  }

  // Synchronous repaint. Used when a message arrives, so tests need no timers.
  public render(): void {
    if (this.disposed || !this.layer) return;
    this.observe();
    const peers = this.getPeers();
    const now = Date.now();

    const wanted = this.scene.collectDecorations(peers);
    this.applyDecorations(wanted);
    this.renderArtifacts(peers, wanted, now);
    this.ensureAnimating(now);
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    // Leaves no orphan attributes on a survey that outlives the plugin.
    this.applyDecorations(new Map<HTMLElement, IDecoration>());
    const doc = DomDocumentHelper.getDocument();
    doc?.removeEventListener("scroll", this.onScroll, true);
    DomWindowHelper.getWindow()?.removeEventListener("resize", this.onScroll);
    if (this.fallbackTimer) clearInterval(this.fallbackTimer);
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    this.artifacts.forEach((a) => {
      a.cursor.remove();
      a.cursorName.remove();
      a.badge.remove();
    });
    this.artifacts.clear();
    this.layer?.remove();
    this.layer = null;
  }

  // The root can appear after construction (the survey is not rendered yet) and can
  // be replaced, so observation is (re)established on every tick rather than once.
  private observe(): void {
    const root = this.scene.getRoot();
    if (root === this.observedRoot) return;
    this.observedRoot = root;
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    if (!root) return;
    const win: any = DomWindowHelper.getWindow();
    if (!!win && typeof win.ResizeObserver === "function") {
      this.resizeObserver = new win.ResizeObserver(() => this.refresh());
      this.resizeObserver!.observe(root);
    }
    if (!!win && typeof win.MutationObserver === "function") {
      this.mutationObserver = new win.MutationObserver(() => this.refresh());
      this.mutationObserver!.observe(root, { childList: true, subtree: true, attributes: false });
    }
  }

  private applyDecorations(wanted: Map<HTMLElement, IDecoration>): void {
    this.decorated.forEach((node) => {
      if (wanted.has(node) && node.isConnected) return;
      node.removeAttribute("data-collab-focus");
      node.style.removeProperty("--collab-peer-color");
      this.decorated.delete(node);
    });
    wanted.forEach((decoration, node) => {
      node.setAttribute("data-collab-focus", "on");
      node.style.setProperty("--collab-peer-color", decoration.color);
      this.decorated.add(node);
    });
  }

  private renderArtifacts(
    peers: ReadonlyMap<string, IPresencePeer>,
    wanted: Map<HTMLElement, IDecoration>,
    now: number
  ): void {
    // Which peer owns which decorated node, so a badge can be placed on it.
    const badgeTarget = new Map<string, HTMLElement>();
    wanted.forEach((decoration, node) => {
      if (!badgeTarget.has(decoration.clientId)) badgeTarget.set(decoration.clientId, node);
    });

    this.artifacts.forEach((_artifacts, clientId) => {
      if (peers.has(clientId)) return;
      this.removeArtifacts(clientId);
    });

    peers.forEach((peer) => {
      const artifacts = this.ensureArtifacts(peer.clientId);
      if (!artifacts) return;

      const node = badgeTarget.get(peer.clientId);
      const decoration = !!node ? wanted.get(node) : undefined;
      if (!!node && !!decoration) {
        const rect = node.getBoundingClientRect();
        const badgeRect: IRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
        const hidden = (!!decoration.clip && !intersects(badgeRect, decoration.clip)) ||
          (!!decoration.avoid && intersects(badgeRect, decoration.avoid));
        if (hidden || rect.width === 0) {
          this.hide(artifacts.badge);
        } else {
          artifacts.badge.textContent = peer.name;
          artifacts.badge.style.setProperty("--collab-peer-color", decoration.color);
          artifacts.badge.style.setProperty("--collab-peer-fg", decoration.foreground);
          this.place(artifacts.badge, rect.right, rect.top - BADGE_GAP_PX);
          artifacts.badge.style.transform = "translate(-100%, -100%)";
        }
      } else {
        this.hide(artifacts.badge);
      }

      const position = this.cursorPosition(peer.clientId, now);
      if (!position) {
        this.hide(artifacts.cursor);
        this.hide(artifacts.cursorName);
        return;
      }
      // Same source as the ring and the avatar, so one person is one colour.
      const colors = this.scene.peerColors(peer);
      const path = artifacts.cursor.querySelector("path");
      path?.setAttribute("fill", colors.bg);
      this.place(artifacts.cursor, position.x, position.y);
      artifacts.cursorName.textContent = peer.name;
      artifacts.cursorName.style.setProperty("--collab-peer-color", colors.bg);
      artifacts.cursorName.style.setProperty("--collab-peer-fg", colors.fg);
      this.place(artifacts.cursorName, position.x + 12, position.y + 16);
    });
  }

  // Position on the replay path at `now - CURSOR_BUFFER_MS`: a Catmull-Rom spline
  // through the surrounding samples, computed in viewport pixels so that segments
  // spanning different anchors stay smooth. Before the path starts the first sample
  // is used; once it is exhausted the last one is held, until it goes stale.
  private cursorPosition(clientId: string, now: number): { x: number, y: number } | null {
    const samples = this.scene.cursorSamples(clientId);
    if (!samples || samples.length === 0) return null;
    const last = samples[samples.length - 1];
    if (now - last.at > CURSOR_IDLE_MS) return null;

    const target = now - CURSOR_BUFFER_MS;
    let index = -1;
    for (let i = 0; i < samples.length; i++) {
      if (samples[i].at > target) {
        index = i;
        break;
      }
    }
    if (index === -1) return this.scene.projectCursor(last);
    if (index === 0) return this.scene.projectCursor(samples[0]);

    const a = this.scene.projectCursor(samples[index - 1]);
    const b = this.scene.projectCursor(samples[index]);
    if (!a || !b) return a ?? b;
    const p0 = (samples[index - 2] && this.scene.projectCursor(samples[index - 2])) || a;
    const p3 = (samples[index + 1] && this.scene.projectCursor(samples[index + 1])) || b;
    const span = samples[index].at - samples[index - 1].at;
    const u = span > 0 ? (target - samples[index - 1].at) / span : 1;
    return {
      x: catmullRom(p0.x, a.x, b.x, p3.x, u),
      y: catmullRom(p0.y, a.y, b.y, p3.y, u),
    };
  }

  // Frames run while any peer still has samples ahead of the replay clock, then the
  // loop stops itself - no permanent rAF pump.
  private ensureAnimating(now: number): void {
    if (this.animating || this.disposed) return;
    let pending = false;
    this.getPeers().forEach((peer) => {
      const samples = this.scene.cursorSamples(peer.clientId);
      const last = !!samples && samples.length > 0 ? samples[samples.length - 1] : null;
      if (!!last && last.at > now - CURSOR_BUFFER_MS) pending = true;
    });
    if (!pending) return;
    this.animating = true;
    this.raf(() => {
      this.animating = false;
      this.render();
    });
  }

  private ensureArtifacts(clientId: string): IPeerArtifacts | null {
    let found = this.artifacts.get(clientId);
    if (!!found) return found;
    const doc = DomDocumentHelper.getDocument();
    if (!doc || !this.layer) return null;
    const cursor = doc.createElement("div");
    cursor.className = "collab-presence-cursor";
    cursor.innerHTML = CURSOR_SVG;
    const cursorName = doc.createElement("div");
    cursorName.className = "collab-presence-cursor-name";
    const badge = doc.createElement("div");
    badge.className = "collab-presence-badge";
    this.layer.appendChild(cursor);
    this.layer.appendChild(cursorName);
    this.layer.appendChild(badge);
    found = { cursor, cursorName, badge };
    this.artifacts.set(clientId, found);
    return found;
  }

  private removeArtifacts(clientId: string): void {
    const found = this.artifacts.get(clientId);
    if (!found) return;
    found.cursor.remove();
    found.cursorName.remove();
    found.badge.remove();
    this.artifacts.delete(clientId);
  }

  private place(el: HTMLElement, x: number, y: number): void {
    el.style.display = "block";
    el.style.left = x + "px";
    el.style.top = y + "px";
  }

  private hide(el: HTMLElement): void {
    el.style.display = "none";
  }

  private raf(callback: () => void): void {
    const win: any = DomWindowHelper.getWindow();
    if (!!win && typeof win.requestAnimationFrame === "function") {
      win.requestAnimationFrame(callback);
      return;
    }
    setTimeout(callback, 16);
  }
}
