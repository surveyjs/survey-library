import { DomWindowHelper } from "survey-core";
import { Marks, Piece, copyMarks, emptyMarks, serializePieces } from "./runs";

export interface SanitizeOptions {
  inline?: boolean;
  paste?: boolean;
}

interface Para {
  kind: "p";
  pieces: Piece[];
}

interface ListBlock {
  kind: "ul" | "ol";
  items: Para[];
}

type Block = Para | ListBlock;

const DROPPED = new Set(["script", "style", "iframe", "object", "embed", "template", "noscript"]);
const ALLOWED = new Set(["b", "strong", "i", "em", "s", "strike", "del", "a", "ul", "ol", "li", "p", "div", "br"]);
const BLOCK_UNKNOWN = new Set([
  "address", "article", "aside", "blockquote", "caption", "dd", "dl", "dt", "fieldset", "figcaption", "figure",
  "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "legend", "main", "nav", "pre",
  "section", "table", "tbody", "td", "tfoot", "th", "thead", "tr"
]);

class Builder {
  public blocks: Block[] = [];
  public pieces: Piece[] = [];
  public marks: Marks = emptyMarks();
  public list: ListBlock | undefined;
  private reported = new Set<string>();
  public reports: string[] = [];
  public paste = false;

  public report(kind: string): void {
    if (!kind || this.reported.has(kind)) return;
    this.reported.add(kind);
    this.reports.push(kind);
  }

  public pushText(text: string): void {
    if (!text) return;
    if (this.paste) {
      const collapsed = text.replace(/\s+/g, " ");
      if (collapsed)this.pieces.push({ kind: "text", text: collapsed, marks: copyMarks(this.marks) });
      return;
    }
    const parts = text.split(/\r\n|\r|\n/);
    for (let i = 0; i < parts.length; i++) {
      if (i > 0)this.pieces.push({ kind: "br", text: "", marks: copyMarks(this.marks) });
      if (parts[i])this.pieces.push({ kind: "text", text: parts[i], marks: copyMarks(this.marks) });
    }
  }

  public pushBr(): void {
    this.pieces.push({ kind: "br", text: "", marks: copyMarks(this.marks) });
  }

  public flushPara(): void {
    const pieces = trimPieces(this.pieces);
    this.pieces = [];
    if (!hasText(pieces)) return;
    const para: Para = { kind: "p", pieces: pieces };
    if (this.list)this.list.items.push(para);
    else this.blocks.push(para);
  }
}

export function sanitizeHtml(html: string, options?: SanitizeOptions): string {
  const analyzed = analyze(html, options);
  if (!analyzed) return "";
  return analyzed.html;
}

export function getDisallowedHtml(html: string): string[] {
  const analyzed = analyze(html, undefined);
  if (!analyzed) return [];
  return analyzed.reports;
}

function analyze(html: string, options: SanitizeOptions | undefined): { html: string, reports: string[] } | undefined {
  if (html === undefined || html === null || html === "") return { html: "", reports: [] };
  const body = parseBody(String(html));
  if (!body) return undefined;
  const builder = new Builder();
  builder.paste = !!options?.paste;
  reportDroppedTags(String(html), builder);
  for (let i = 0; i < body.childNodes.length; i++) walk(body.childNodes[i], builder);
  builder.flushPara();
  return { html: serializeBlocks(builder.blocks, !!options?.inline), reports: builder.reports };
}

function parseBody(html: string): HTMLElement | undefined {
  if (!DomWindowHelper.isAvailable()) return undefined;
  const win = DomWindowHelper.getWindow() as (Window & { DOMParser?: { new(): { parseFromString(html: string, type: string): Document } } }) | null;
  const Parser = win && win.DOMParser;
  if (!Parser) return undefined;
  const doc = new Parser().parseFromString(html, "text/html");
  return doc && doc.body ? doc.body : undefined;
}

function walk(node: Node, builder: Builder): void {
  if (node.nodeType === 3) {
    builder.pushText(node.textContent || "");
    return;
  }
  if (node.nodeType !== 1) return;
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  if (DROPPED.has(tag)) {
    builder.report(tag);
    return;
  }
  reportAttributes(el, tag, builder);
  if (tag === "br") {
    builder.pushBr();
    return;
  }
  if (tag === "b" || tag === "strong") return withMark(builder, "strong", () => walkChildren(el, builder));
  if (tag === "i" || tag === "em") return withMark(builder, "em", () => walkChildren(el, builder));
  if (tag === "s" || tag === "strike" || tag === "del") return withMark(builder, "s", () => walkChildren(el, builder));
  if (tag === "a") return walkLink(el, builder);
  if (tag === "p" || tag === "div") {
    builder.flushPara();
    walkChildren(el, builder);
    builder.flushPara();
    return;
  }
  if (tag === "ul" || tag === "ol") return walkList(el, builder, tag);
  if (tag === "li") return walkItem(el, builder);
  if (!ALLOWED.has(tag)) builder.report(tag);
  if (BLOCK_UNKNOWN.has(tag)) {
    builder.flushPara();
    walkChildren(el, builder);
    builder.flushPara();
    return;
  }
  walkChildren(el, builder);
}

function walkChildren(el: HTMLElement, builder: Builder): void {
  for (let i = 0; i < el.childNodes.length; i++) walk(el.childNodes[i], builder);
}

function withMark(builder: Builder, key: "strong" | "em" | "s", run: () => void): void {
  const prev = builder.marks[key];
  builder.marks[key] = true;
  run();
  builder.marks[key] = prev;
}

function walkLink(el: HTMLElement, builder: Builder): void {
  const href = el.getAttribute("href") || "";
  const scheme = hrefScheme(href);
  if (!schemeAllowed(scheme)) {
    if (href && scheme) builder.report(scheme);
    else if (href) builder.report("relative");
    walkChildren(el, builder);
    return;
  }
  const prev = builder.marks.href;
  builder.marks.href = href.trim();
  walkChildren(el, builder);
  builder.marks.href = prev;
}

function walkList(el: HTMLElement, builder: Builder, tag: "ul" | "ol"): void {
  if (builder.list) {
    builder.report("nested-list");
    walkChildren(el, builder);
    return;
  }
  builder.flushPara();
  const list: ListBlock = { kind: tag, items: [] };
  builder.blocks.push(list);
  builder.list = list;
  walkChildren(el, builder);
  builder.flushPara();
  list.items = list.items.filter(para => hasText(para.pieces));
  if (list.items.length === 0) builder.blocks.pop();
  builder.list = undefined;
}

function walkItem(el: HTMLElement, builder: Builder): void {
  builder.flushPara();
  walkChildren(el, builder);
  builder.flushPara();
}

function reportAttributes(el: HTMLElement, tag: string, builder: Builder): void {
  const attrs = el.attributes;
  if (!attrs) return;
  for (let i = 0; i < attrs.length; i++) {
    const name = attrs[i].name.toLowerCase();
    if (tag === "a" && (name === "href" || name === "target" || name === "rel")) continue;
    builder.report(name);
  }
}

function stripControls(value: string): string {
  let out = "";
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code > 31 && code !== 127) out += value[i];
  }
  return out;
}

export function hrefScheme(href: string): string {
  const trimmed = href.trim();
  const colon = trimmed.indexOf(":");
  if (colon <= 0) return "";
  const raw = trimmed.slice(0, colon);
  const stripped = stripControls(raw);
  if (!stripped) return "invalid";
  return stripped.toLowerCase();
}

export function schemeAllowed(scheme: string): boolean {
  return scheme === "http" || scheme === "https" || scheme === "mailto";
}

function reportDroppedTags(html: string, builder: Builder): void {
  // The HTML parser removes script (and sometimes the other dropped tags) before the walk.
  const re = /<\s*(script|style|iframe|object|embed|template|noscript)\b/gi;
  let match = re.exec(html);
  while(match) {
    builder.report(match[1].toLowerCase());
    match = re.exec(html);
  }
}

function trimPieces(pieces: Piece[]): Piece[] {
  const copy = pieces.map(piece => ({ kind: piece.kind, text: piece.text, marks: copyMarks(piece.marks) }));
  trimEdge(copy, true);
  trimEdge(copy, false);
  return copy;
}

// Line breaks at a block edge go away. Whitespace does too, unless a mark owns it:
// that space is moved outside the mark later (<strong>word </strong> -> <strong>word</strong> ).
function trimEdge(pieces: Piece[], leading: boolean): void {
  while(pieces.length) {
    const piece = leading ? pieces[0] : pieces[pieces.length - 1];
    if (piece.kind === "br") {
      if (leading) pieces.shift();
      else pieces.pop();
      continue;
    }
    if (piece.marks.strong || piece.marks.em || piece.marks.s || piece.marks.href) break;
    piece.text = leading ? piece.text.replace(/^\s+/, "") : piece.text.replace(/\s+$/, "");
    if (!piece.text) {
      if (leading) pieces.shift();
      else pieces.pop();
      continue;
    }
    break;
  }
}

function hasText(pieces: Piece[]): boolean {
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].kind === "text" && pieces[i].text) return true;
  }
  return false;
}

function serializeBlocks(blocks: Block[], inline: boolean): string {
  const meaningful = blocks.filter(block => block.kind === "p" ? hasText(block.pieces) : block.items.some(item => hasText(item.pieces)));
  if (meaningful.length === 0) return "";
  if (inline) {
    const lines: string[] = [];
    for (let i = 0; i < meaningful.length; i++) {
      const block = meaningful[i];
      if (block.kind === "p") lines.push(serializePieces(block.pieces));
      else {
        for (let j = 0; j < block.items.length; j++) {
          if (hasText(block.items[j].pieces)) lines.push(serializePieces(block.items[j].pieces));
        }
      }
    }
    return lines.filter(line => line !== "").join("<br>");
  }
  if (meaningful.length === 1 && meaningful[0].kind === "p") return serializePieces(meaningful[0].pieces);
  let out = "";
  for (let i = 0; i < meaningful.length; i++) {
    const block = meaningful[i];
    if (block.kind === "p") {
      out += "<p>" + serializePieces(block.pieces) + "</p>";
    } else {
      let items = "";
      for (let j = 0; j < block.items.length; j++) {
        if (!hasText(block.items[j].pieces)) continue;
        items += "<li>" + serializePieces(block.items[j].pieces) + "</li>";
      }
      out += "<" + block.kind + ">" + items + "</" + block.kind + ">";
    }
  }
  return out;
}
