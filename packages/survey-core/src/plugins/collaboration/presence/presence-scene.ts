import { IPresencePeer } from "./presence-envelope";

// The seam between the generic presence overlay and the product it decorates.
//
// Everything about HOW remote presence is drawn - stamping the focus attribute,
// the cursor layer, the animation tick, the badge geometry, the spline replay -
// is generic and lives in presence-overlay.ts. Everything about WHICH nodes to
// decorate and WHERE a cursor is belongs to the product: for a form that is a
// question root inside the survey's own root element; for survey-creator it is
// seven different scopes across the designer, the property grid and the
// translation table, with canvas zoom and panel occlusion on top.
//
// This interface is what lets survey-creator eventually drop its own copy of the
// overlay and supply a scene instead, so `clip`, `avoid` and a scaled projection
// are part of the contract even though the form scene uses only the first.

export interface IRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// The colours one participant is drawn in, everywhere they appear.
//
// A background and the foreground that belongs ON it, resolved together: a palette
// that pairs them is the only way the initials on an avatar and the name in a badge
// stay legible across a light and a dark theme.
export interface IPeerColors {
  bg: string;
  fg: string;
}

// A decoration wanted on one node this tick.
export interface IDecoration {
  // Which peer this decoration belongs to: the overlay needs it to place that
  // peer name badge, and matching by name+colour would break for namesakes.
  clientId: string;
  color: string;
  foreground: string;
  // Peer name for the badge under the ring.
  name: string;
  // Visible area of the node's scroll container: the badge hides outside it.
  clip?: IRect;
  // An overlaying panel the badge must not draw over (flyout, mobile sidebar).
  avoid?: IRect;
}

// One sample of a peer's cursor path, in the product's own anchor space, already
// scheduled at a local timestamp. Kept unprojected so the overlay can re-project
// it on every frame - the anchor moves when the page scrolls.
export interface IPresenceCursorSample {
  // Opaque to the overlay; only the scene knows what it addresses.
  anchor: string;
  x: number;
  y: number;
  // Local time (ms) at which this sample should be shown.
  at: number;
}

export interface IPresenceScene {
  // The element the overlay observes for mutations and resizes.
  getRoot(): Element | null;
  // The colours this participant is drawn in. One source for the ring, the badge,
  // the cursor and the avatar - otherwise the same person appears in two different
  // colours and the colour stops identifying anybody.
  peerColors(peer: IPresencePeer): IPeerColors;
  // Which nodes to decorate this tick, and how.
  collectDecorations(peers: ReadonlyMap<string, IPresencePeer>): Map<HTMLElement, IDecoration>;
  // Called when a peer's state arrives, so the scene can update its path buffer.
  peerUpdated(peer: IPresencePeer): void;
  peerRemoved(clientId: string): void;
  // The peer's scheduled cursor path, or null when it has none.
  cursorSamples(clientId: string): Array<IPresenceCursorSample> | null;
  // Projects a sample into viewport pixels; null when its anchor is not rendered
  // locally (the peer is on another page, or the row has not been lazily rendered).
  projectCursor(sample: IPresenceCursorSample): { x: number, y: number } | null;
  dispose?(): void;
}
