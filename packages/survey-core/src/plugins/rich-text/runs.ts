import { DomDocumentHelper } from "survey-core";

export interface TextMarks {
  bold: boolean;
  italic: boolean;
  strike: boolean;
  link?: string;
}

export interface TextRun {
  type: "text";
  text: string;
  marks: TextMarks;
}

export interface BreakRun {
  type: "break";
}

export type InlinePiece = TextRun | BreakRun;

export interface ParagraphBlock {
  type: "paragraph";
  content: InlinePiece[];
}

export interface ListBlock {
  type: "list";
  ordered: boolean;
  items: InlinePiece[][];
}

export type RichBlock = ParagraphBlock | ListBlock;

export function emptyMarks(): TextMarks {
  return { bold: false, italic: false, strike: false };
}

export function sameMarks(a: TextMarks, b: TextMarks): boolean {
  return a.bold === b.bold && a.italic === b.italic && a.strike === b.strike && (a.link || "") === (b.link || "");
}

export function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function linkScheme(url: string): string {
  // C0 controls and whitespace are removed before the scheme is read, so "java\nscript:" is not a scheme.
  let trimmed = "";
  for (let i = 0; i < url.length; i++) {
    const code = url.charCodeAt(i);
    if (code <= 0x1f || /\s/.test(url[i])) continue;
    trimmed += url[i];
  }
  const match = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(trimmed);
  return match ? match[1].toLowerCase() : "";
}

export function isAllowedLink(url: string): boolean {
  const scheme = linkScheme(url);
  return scheme === "http" || scheme === "https" || scheme === "mailto";
}

const DROPPED_TAGS = new Set(["script", "style", "iframe", "object", "embed", "template", "noscript"]);
const BLOCK_UNKNOWN = new Set([
  "address", "article", "aside", "blockquote", "center", "dd", "dl", "dt", "figcaption", "figure",
  "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "main", "nav", "pre",
  "section", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "div"
]);

export interface FlattenOptions {
  // Allow-list walk reports removed or unwrapped kinds. The editor walk does not.
  report?: (kind: string) => void;
}

export function flattenElement(root: HTMLElement, options?: FlattenOptions): RichBlock[] {
  const blocks: RichBlock[] = [];
  let para: InlinePiece[] = [];

  const flush = () => {
    if (!hasVisiblePiece(para)) {
      para = [];
      return;
    }
    blocks.push({ type: "paragraph", content: para });
    para = [];
  };

  const walkChildren = (el: HTMLElement, marks: TextMarks) => {
    for (let i = 0; i < el.childNodes.length; i++) {
      walk(el.childNodes[i], marks);
    }
  };

  const walk = (node: Node, marks: TextMarks) => {
    if (node.nodeType === 3) {
      const text = node.textContent || "";
      if (!text) return;
      if (!text.trim() && para.length === 0) return;
      para.push({ type: "text", text: text, marks: { ...marks } });
      return;
    }
    if (node.nodeType !== 1) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (DROPPED_TAGS.has(tag)) {
      options?.report?.(tag);
      return;
    }
    if (options?.report) {
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        if (tag === "a" && (attr.name === "href" || attr.name === "target" || attr.name === "rel")) {
          if (attr.name === "href") {
            const href = attr.value || "";
            if (href && !isAllowedLink(href)) options.report(linkScheme(href) || "href");
          }
          continue;
        }
        options.report(attr.name);
      }
    }
    if (tag === "br") {
      para.push({ type: "break" });
      return;
    }
    if (tag === "ul" || tag === "ol") {
      flush();
      blocks.push(readList(el, tag === "ol", marks));
      return;
    }
    const knownInline = tag === "b" || tag === "strong" || tag === "i" || tag === "em" || tag === "s" || tag === "strike" || tag === "del" || tag === "a";
    const knownBlock = tag === "p";
    if (!knownInline && !knownBlock && tag !== "ul" && tag !== "ol" && tag !== "li" && tag !== "br") {
      options?.report?.(tag);
      if (BLOCK_UNKNOWN.has(tag)) {
        flush();
        walkChildren(el, marks);
        flush();
        return;
      }
    }
    if (tag === "p" || (tag === "div" && !options?.report)) {
      flush();
      walkChildren(el, marks);
      flush();
      return;
    }
    const next: TextMarks = { ...marks };
    if (tag === "b" || tag === "strong") next.bold = true;
    else if (tag === "i" || tag === "em") next.italic = true;
    else if (tag === "s" || tag === "strike" || tag === "del") next.strike = true;
    else if (tag === "a") {
      const href = el.getAttribute("href") || "";
      if (isAllowedLink(href)) next.link = href.trim();
    }
    walkChildren(el, next);
  };

  const readList = (el: HTMLElement, ordered: boolean, marks: TextMarks): ListBlock => {
    const items: InlinePiece[][] = [];
    for (let i = 0; i < el.childNodes.length; i++) {
      const child = el.childNodes[i];
      if (child.nodeType !== 1 || (child as HTMLElement).tagName.toLowerCase() !== "li") continue;
      const saved = para;
      para = [];
      walkChildren(child as HTMLElement, marks);
      items.push(para);
      para = saved;
    }
    return { type: "list", ordered: ordered, items: items };
  };

  walkChildren(root, emptyMarks());
  flush();
  return mergeBlocks(blocks);
}

function hasVisiblePiece(content: InlinePiece[]): boolean {
  for (let i = 0; i < content.length; i++) {
    const piece = content[i];
    if (piece.type === "break") return true;
    if (piece.text.length > 0) return true;
  }
  return false;
}

function mergeBlocks(blocks: RichBlock[]): RichBlock[] {
  const merged: RichBlock[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "paragraph") {
      block.content = mergePieces(block.content);
      if (!hasVisiblePiece(block.content)) continue;
    } else {
      block.items = block.items.map(item => mergePieces(item));
    }
    merged.push(block);
  }
  return merged;
}

export function mergePieces(content: InlinePiece[]): InlinePiece[] {
  const merged: InlinePiece[] = [];
  for (let i = 0; i < content.length; i++) {
    const piece = content[i];
    const prev = merged[merged.length - 1];
    if (piece.type === "text" && prev && prev.type === "text" && sameMarks(prev.marks, piece.marks)) {
      prev.text += piece.text;
    } else if (piece.type === "text" && piece.text.length === 0) {
      continue;
    } else {
      merged.push(piece.type === "text" ? { type: "text", text: piece.text, marks: { ...piece.marks } } : { type: "break" });
    }
  }
  return merged;
}

interface RichChar {
  ch: string;
  bold: boolean;
  italic: boolean;
  strike: boolean;
  link: string;
}

function piecesToChars(content: InlinePiece[]): RichChar[] {
  const chars: RichChar[] = [];
  for (let i = 0; i < content.length; i++) {
    const piece = content[i];
    if (piece.type === "break") {
      chars.push({ ch: "\n", bold: false, italic: false, strike: false, link: "" });
      continue;
    }
    const link = piece.marks.link || "";
    for (let c = 0; c < piece.text.length; c++) {
      chars.push({
        ch: piece.text[c],
        bold: piece.marks.bold,
        italic: piece.marks.italic,
        strike: piece.marks.strike,
        link: link
      });
    }
  }
  relaxWhitespace(chars);
  return chars;
}

function isEdgeSpace(ch: string): boolean {
  return ch === " " || ch === "\t" || ch === "\n";
}

function clearMark(ch: RichChar, mark: "bold" | "italic" | "strike" | "link"): void {
  if (mark === "link") ch.link = "";
  else ch[mark] = false;
}

function hasMark(ch: RichChar, mark: "bold" | "italic" | "strike" | "link"): boolean {
  if (mark === "link") return !!ch.link;
  return ch[mark];
}

// Spaces that sit on the edge of a mark belong outside it: **word ** -> **word**[space].
function relaxWhitespace(chars: RichChar[]): void {
  const marks: Array<"bold" | "italic" | "strike" | "link"> = ["bold", "italic", "strike", "link"];
  let changed = true;
  while(changed) {
    changed = false;
    for (let m = 0; m < marks.length; m++) {
      const mark = marks[m];
      let i = 0;
      while(i < chars.length) {
        if (!hasMark(chars[i], mark)) {
          i++;
          continue;
        }
        const link = chars[i].link;
        let j = i;
        while(j < chars.length && hasMark(chars[j], mark) && (mark !== "link" || chars[j].link === link)) j++;
        let start = i;
        while(start < j && isEdgeSpace(chars[start].ch)) {
          clearMark(chars[start], mark);
          start++;
          changed = true;
        }
        let end = j - 1;
        while(end >= start && isEdgeSpace(chars[end].ch)) {
          clearMark(chars[end], mark);
          end--;
          changed = true;
        }
        i = j;
      }
    }
  }
}

type MarkName = "link" | "italic" | "bold" | "strike";

function marksAt(ch: RichChar): MarkName[] {
  const names: MarkName[] = [];
  if (ch.link) names.push("link");
  if (ch.italic) names.push("italic");
  if (ch.bold) names.push("bold");
  if (ch.strike) names.push("strike");
  return names;
}

function spanEnd(chars: RichChar[], index: number, mark: MarkName): number {
  const link = chars[index].link;
  let i = index;
  while(i < chars.length && hasMark(chars[i], mark) && (mark !== "link" || chars[i].link === link)) i++;
  return i;
}

// Outer mark first. Link is always outermost. A mark that ends sooner is inside.
// Equal ends follow CommonMark's ***text*** shape: italic outside bold.
function targetStack(chars: RichChar[], index: number): MarkName[] {
  const present = marksAt(chars[index]);
  const rank: { [key: string]: number } = { link: 0, italic: 1, bold: 2, strike: 3 };
  present.sort((a, b) => {
    if (a === "link" && b !== "link") return -1;
    if (b === "link" && a !== "link") return 1;
    const endA = spanEnd(chars, index, a);
    const endB = spanEnd(chars, index, b);
    if (endA !== endB) return endB - endA;
    return rank[a] - rank[b];
  });
  return present;
}

function openMarker(mark: MarkName, link: string, asHtml: boolean, displayLinks: boolean): string {
  if (!asHtml) {
    if (mark === "bold") return "**";
    if (mark === "italic") return "*";
    if (mark === "strike") return "~~";
    return "[";
  }
  if (mark === "bold") return "<strong>";
  if (mark === "italic") return "<em>";
  if (mark === "strike") return "<s>";
  const href = escapeHtml(link);
  if (!displayLinks) return "<a href=\"" + href + "\">";
  return "<a href=\"" + href + "\" target=\"_blank\" rel=\"noopener noreferrer\">";
}

function closeMarker(mark: MarkName, link: string, asHtml: boolean, displayLinks: boolean): string {
  if (!asHtml) {
    if (mark === "bold") return "**";
    if (mark === "italic") return "*";
    if (mark === "strike") return "~~";
    return "](" + escapeMarkdownUrl(link) + ")";
  }
  if (mark === "bold") return "</strong>";
  if (mark === "italic") return "</em>";
  if (mark === "strike") return "</s>";
  return "</a>";
}

function escapeMarkdownUrl(url: string): string {
  return escapeMarkdownText(url, false).text;
}

function escapeMarkdownText(text: string, lineStart: boolean): { text: string, lineStart: boolean } {
  let out = "";
  let atLineStart = lineStart;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "\n") {
      out += "\n";
      atLineStart = true;
      continue;
    }
    const special = "\\*_~[]()".indexOf(ch) >= 0;
    if (atLineStart && !special && needsLineStartEscape(text, i)) out += "\\";
    if (special) out += "\\";
    out += ch;
    atLineStart = false;
  }
  return { text: out, lineStart: atLineStart };
}

function needsLineStartEscape(text: string, index: number): boolean {
  const rest = text.substring(index);
  return /^[-+*] /.test(rest) || /^#{1,6}(\s|$)/.test(rest) || /^\d+\. /.test(rest);
}

function emitChars(chars: RichChar[], asHtml: boolean, displayLinks: boolean, escapeText: boolean, lineStart: boolean): { text: string, lineStart: boolean } {
  let out = "";
  const stack: Array<{ mark: MarkName, link: string }> = [];
  let atLineStart = lineStart;
  let i = 0;
  while(i < chars.length) {
    const target = targetStack(chars, i);
    let prefix = 0;
    while(prefix < stack.length && prefix < target.length && stack[prefix].mark === target[prefix] && (target[prefix] !== "link" || stack[prefix].link === chars[i].link)) {
      prefix++;
    }
    while(stack.length > prefix) {
      const closed = stack.pop();
      out += closeMarker(closed.mark, closed.link, asHtml, displayLinks);
    }
    while(stack.length < target.length) {
      const mark = target[stack.length];
      const link = mark === "link" ? chars[i].link : "";
      out += openMarker(mark, link, asHtml, displayLinks);
      stack.push({ mark: mark, link: link });
    }
    let j = i + 1;
    while(j < chars.length && sameCharMarks(chars[i], chars[j])) j++;
    const raw = chars.slice(i, j).map(ch => ch.ch).join("");
    if (escapeText) {
      const escaped = escapeMarkdownText(raw, atLineStart);
      out += escaped.text;
      atLineStart = escaped.lineStart;
    } else {
      out += escapeHtml(raw);
      atLineStart = raw.charAt(raw.length - 1) === "\n";
    }
    i = j;
  }
  while(stack.length > 0) {
    const closed = stack.pop();
    out += closeMarker(closed.mark, closed.link, asHtml, displayLinks);
  }
  return { text: out, lineStart: atLineStart };
}

function sameCharMarks(a: RichChar, b: RichChar): boolean {
  return a.bold === b.bold && a.italic === b.italic && a.strike === b.strike && a.link === b.link;
}

function emitInlines(content: InlinePiece[], asHtml: boolean, displayLinks: boolean, escapeText: boolean, lineStart: boolean): string {
  return emitChars(piecesToChars(content), asHtml, displayLinks, escapeText, lineStart).text;
}

export function blocksToMarkdown(blocks: RichBlock[]): string {
  if (!blocks.length) return "";
  const parts: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "paragraph") {
      const text = emitInlines(block.content, false, false, true, true);
      if (text) parts.push(text);
    } else {
      const items: string[] = [];
      for (let n = 0; n < block.items.length; n++) {
        const marker = block.ordered ? (n + 1) + ". " : "- ";
        items.push(marker + emitInlines(block.items[n], false, false, true, false));
      }
      parts.push(items.join("\n"));
    }
  }
  return parts.join("\n\n");
}

export function blocksToHtml(blocks: RichBlock[], displayLinks: boolean): string {
  if (!blocks.length) return "";
  const paragraphCount = blocks.filter(block => block.type === "paragraph").length;
  const wrapParagraphs = paragraphCount >= 2;
  const parts: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "paragraph") {
      const inner = emitInlines(block.content, true, displayLinks, false, false).replace(/\n/g, "<br>");
      if (!inner) continue;
      parts.push(wrapParagraphs ? "<p>" + inner + "</p>" : inner);
    } else {
      const tag = block.ordered ? "ol" : "ul";
      const items = block.items.map(item => "<li>" + emitInlines(item, true, displayLinks, false, false).replace(/\n/g, "<br>") + "</li>");
      parts.push("<" + tag + ">" + items.join("") + "</" + tag + ">");
    }
  }
  return parts.join("");
}

export function createDetachedElement(html: string): HTMLElement | null {
  const element = DomDocumentHelper.createElement("div");
  if (!element) return null;
  element.innerHTML = html;
  return element;
}
