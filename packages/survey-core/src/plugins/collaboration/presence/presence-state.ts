import { PageModel, SurveyModel } from "survey-core";

// The presence state of a form filler, and the codecs around it.
//
// This file is the source of truth for what travels inside a presence frame. The
// relay treats it as opaque, so nothing outside this module needs to know the shape.
// Identity (name, colour) is deliberately absent - the server stamps it onto the
// envelope, which is what makes a reconnect self-healing.

export interface IPresenceCursorPoint {
  x: number;
  y: number;
  // Offset in ms from the first point of the packet.
  t: number;
}

export interface IPresenceCursor {
  // Top-level question name the path is anchored to.
  n: string;
  p: Array<IPresenceCursorPoint>;
}

export interface IPresenceState {
  // survey.currentPage identity - see pageKey.
  page: string | null;
  // Top-level question name the peer caret is in, or null.
  focus: string | null;
  // Absent in a RETAINED frame: a stored cursor would be replayed to a late joiner
  // as a ghost arrow at a position its owner left long ago.
  cur?: IPresenceCursor | null;
}

export function emptyPresenceState(): IPresenceState {
  return { page: null, focus: null };
}

// Every DOM selector presence relies on, in one place: if a renderer ever renames
// the attribute, this is the only file to fix.
export const PRESENCE_SELECTORS = {
  questionRoot: "[data-name]",
  question: (name: string): string => `[data-name="${escapeAttr(name)}"]`,
};

// Escapes for use inside a double-quoted attribute selector. CSS.escape is not
// available in every environment this runs in.
export function escapeAttr(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}

// A page identity every client computes the same way: the page name, or "#<index>"
// for unnamed pages - safe because every client renders the same schema.
export function pageKey(survey: SurveyModel, page: PageModel): string {
  return page.name || ("#" + survey.pages.indexOf(page));
}

// Inverse of pageKey. Null when the page is unknown or currently invisible.
export function resolvePage(survey: SurveyModel, key: string): PageModel | null {
  if (!key) return null;
  let page: PageModel | null = survey.getPageByName(key);
  if (!page && key.indexOf("#") === 0) {
    const index = Number(key.substring(1));
    page = (Number.isInteger(index) && survey.pages[index]) || null;
  }
  return !!page && survey.visiblePages.indexOf(page) >= 0 ? page : null;
}

// Deliberately unclamped: fractions outside 0..1 encode a pointer outside the
// anchor question box, which is how the cursor stays visible in page gaps.
export function roundFraction(n: number): number {
  return Math.round(n * 1000) / 1000;
}
