// Canonical HTML is a sequence of runs. Marks merge when they match, whitespace at the
// edge of a mark range moves outside that range, and a link is always the outer tag.

export interface Marks {
  strong: boolean;
  em: boolean;
  s: boolean;
  href?: string;
}

export interface Piece {
  kind: "text" | "br";
  text: string;
  marks: Marks;
}

export interface RichRun {
  text: string;
  strong?: boolean;
  em?: boolean;
  s?: boolean;
  href?: string;
}

interface Char {
  ch: string;
  strong: boolean;
  em: boolean;
  s: boolean;
  href?: string;
}

type MarkId = "link" | "strong" | "em" | "s";

export function emptyMarks(): Marks {
  return { strong: false, em: false, s: false };
}

export function copyMarks(marks: Marks): Marks {
  return { strong: marks.strong, em: marks.em, s: marks.s, href: marks.href };
}

export function sameMarks(a: Marks, b: Marks): boolean {
  return a.strong === b.strong && a.em === b.em && a.s === b.s && a.href === b.href;
}

export function serializePieces(pieces: Piece[]): string {
  return serializeChars(piecesToChars(pieces));
}

export function renderRuns(runs: RichRun[]): string {
  const pieces: Piece[] = [];
  for (let i = 0; i < runs.length; i++) {
    const run = runs[i];
    if (run.text === "\n") {
      pieces.push({ kind: "br", text: "", marks: marksOf(run) });
    } else if (run.text) {
      pieces.push({ kind: "text", text: run.text, marks: marksOf(run) });
    }
  }
  return serializePieces(pieces);
}

export function runsFromPieces(pieces: Piece[]): RichRun[] {
  const chars = piecesToChars(pieces);
  const runs: RichRun[] = [];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const text = ch.ch === "\n" ? "\n" : ch.ch;
    const prev = runs[runs.length - 1];
    if (prev && prev.strong === ch.strong && prev.em === ch.em && prev.s === ch.s && prev.href === ch.href && prev.text !== "\n" && text !== "\n") {
      prev.text += text;
    } else {
      const run: RichRun = { text: text };
      if (ch.strong) run.strong = true;
      if (ch.em) run.em = true;
      if (ch.s) run.s = true;
      if (ch.href) run.href = ch.href;
      runs.push(run);
    }
  }
  return runs;
}

function marksOf(run: RichRun): Marks {
  return { strong: !!run.strong, em: !!run.em, s: !!run.s, href: run.href };
}

function piecesToChars(pieces: Piece[]): Char[] {
  const chars: Char[] = [];
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (piece.kind === "br") {
      chars.push(charOf("\n", piece.marks));
    } else {
      for (let c = 0; c < piece.text.length; c++) {
        chars.push(charOf(piece.text[c], piece.marks));
      }
    }
  }
  trimMarkEdges(chars);
  return chars;
}

function charOf(ch: string, marks: Marks): Char {
  return { ch: ch, strong: marks.strong, em: marks.em, s: marks.s, href: marks.href };
}

function trimMarkEdges(chars: Char[]): void {
  trimRange(chars, (ch) => ch.strong, (ch) => { ch.strong = false; });
  trimRange(chars, (ch) => ch.em, (ch) => { ch.em = false; });
  trimRange(chars, (ch) => ch.s, (ch) => { ch.s = false; });
  trimRange(chars, (ch) => !!ch.href, (ch) => { ch.href = undefined; }, true);
}

function trimRange(chars: Char[], has: (ch: Char) => boolean, clear: (ch: Char) => void, byHref = false): void {
  let i = 0;
  while(i < chars.length) {
    if (!has(chars[i])) {
      i++;
      continue;
    }
    let j = i + 1;
    while(j < chars.length && has(chars[j]) && (!byHref || chars[j].href === chars[i].href)) j++;
    let start = i;
    while(start < j && isEdgeSpace(chars[start])) {
      clear(chars[start]);
      start++;
    }
    let end = j - 1;
    while(end >= start && isEdgeSpace(chars[end])) {
      clear(chars[end]);
      end--;
    }
    i = j;
  }
}

function isEdgeSpace(ch: Char): boolean {
  return ch.ch === "\n" || /\s/.test(ch.ch);
}

function serializeChars(chars: Char[]): string {
  let out = "";
  const open: MarkId[] = [];
  let openHref: string | undefined;
  for (let i = 0; i < chars.length; i++) {
    const current = chars[i];
    const desired = orderMarks(chars, i, activeMarks(current));
    let prefix = 0;
    while(prefix < open.length && prefix < desired.length && open[prefix] === desired[prefix]) {
      if (open[prefix] === "link" && openHref !== current.href) break;
      prefix++;
    }
    while(open.length > prefix) out += closeTag(open.pop());
    while(open.length < desired.length) {
      const id = desired[open.length];
      out += openTag(id, current.href);
      open.push(id);
      if (id === "link") openHref = current.href;
    }
    if (current.ch === "\n") out += "<br>";
    else out += escapeText(current.ch, i + 1 < chars.length ? chars[i + 1].ch : undefined);
  }
  while(open.length) out += closeTag(open.pop());
  return out;
}

function activeMarks(ch: Char): MarkId[] {
  const ids: MarkId[] = [];
  if (ch.href) ids.push("link");
  if (ch.strong) ids.push("strong");
  if (ch.em) ids.push("em");
  if (ch.s) ids.push("s");
  return ids;
}

function orderMarks(chars: Char[], index: number, ids: MarkId[]): MarkId[] {
  return ids.slice().sort((a, b) => {
    if (a === "link") return -1;
    if (b === "link") return 1;
    const endA = markEnd(chars, index, a);
    const endB = markEnd(chars, index, b);
    if (endA !== endB) return endB - endA;
    const startA = markStart(chars, index, a);
    const startB = markStart(chars, index, b);
    if (startA !== startB) return startA - startB;
    return markRank(a) - markRank(b);
  });
}

function markRank(id: MarkId): number {
  if (id === "strong") return 0;
  if (id === "em") return 1;
  return 2;
}

function hasMark(ch: Char, id: MarkId, href?: string): boolean {
  if (id === "link") return ch.href === href;
  if (id === "strong") return ch.strong;
  if (id === "em") return ch.em;
  return ch.s;
}

function markEnd(chars: Char[], index: number, id: MarkId): number {
  const href = chars[index].href;
  let j = index;
  while(j < chars.length && hasMark(chars[j], id, href)) j++;
  return j;
}

function markStart(chars: Char[], index: number, id: MarkId): number {
  const href = chars[index].href;
  let j = index;
  while(j > 0 && hasMark(chars[j - 1], id, href)) j--;
  return j;
}

function openTag(id: MarkId, href?: string): string {
  if (id === "link") {
    return "<a href=\"" + escapeHref(href || "") + "\" target=\"_blank\" rel=\"noopener noreferrer\">";
  }
  if (id === "strong") return "<strong>";
  if (id === "em") return "<em>";
  return "<s>";
}

function closeTag(id: MarkId): string {
  if (id === "link") return "</a>";
  if (id === "strong") return "</strong>";
  if (id === "em") return "</em>";
  return "</s>";
}

export function escapeText(ch: string, next: string | undefined): string {
  if (ch === "&" && !!next && /[A-Za-z0-9#]/.test(next)) return "&amp;";
  if (ch === "<" && !!next && /[A-Za-z/!?]/.test(next)) return "&lt;";
  return ch;
}

export function escapeHref(href: string): string {
  return href.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
