// The presence envelope and the identity helpers around it.
//
// Identity (name, colour slot) lives in the envelope, NOT inside the state: the
// relay stamps it onto every relayed entry. That is what keeps the state opaque to the
// server and what makes a reconnect self-healing - any single frame fully
// re-establishes a participant.
//
// Shared on purpose: survey-creator's collaboration plugin is expected to consume
// these from here rather than keep its own copy (see the shared-foundation seam in
// presence-scene.ts).

// One roster entry as the host receives it. `state` is opaque here; the product
// that produced it is the only thing that knows its shape.
export interface IPresencePeerEntry {
  clientId: string;
  name?: string;
  // Which theme colour slot paints this participant. A slot rather than a colour on
  // purpose: the palette belongs to the theme, which is the only thing that knows
  // whether the page is light or dark. A relay that stamped a colour of its own
  // would be a second palette indexed by the same number, and the same person would
  // come out one colour on their avatar and another on their focus ring.
  //
  // Absent from a relay that assigns none, in which case presenceColorSlot derives
  // one from the id - collision-free only by luck, so a relay that can should.
  colorIndex?: number;
  state: any;
}

// A roster entry after the roster has filled in what the relay left out. The slot
// is resolved exactly once, here, because everything that paints a participant has
// to agree on it - and three copies of the same fallback is how they stop agreeing.
export interface IPresencePeer {
  clientId: string;
  name: string;
  colorIndex: number;
  state: any;
}

// Up to two letters for an avatar chip: initials of the first and last word, or
// the first two characters of a single word.
export function presenceInitials(name: string): string {
  const parts = (name || "").trim().split(/\s+/).filter((part) => !!part);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// The theme's user-colour slots. Slot 0 is the theme's "unknown user" grey, so a
// participant gets 1..9 and is never painted the colour that means "nobody".
export const PRESENCE_FIRST_COLOR_SLOT = 1;
export const PRESENCE_COLOR_SLOTS = 9;

// A theme colour slot for a client id, for a relay that assigns none. Every client
// computes the same slot for the same id, so avatars keep their colour across
// participants without the relay having to agree on one. FNV-1a: short, stable,
// and dependency-free.
export function presenceColorSlot(
  clientId: string,
  slots: number = PRESENCE_COLOR_SLOTS
): number {
  let hash = 0x811c9dc5;
  const id = clientId || "";
  for (let i = 0; i < id.length; i++) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return PRESENCE_FIRST_COLOR_SLOT + (hash % slots);
}
