import { IRichTextConverter, IRichTextConverterContext } from "./api";
import {
  BreakRun,
  InlinePiece,
  ListBlock,
  ParagraphBlock,
  RichBlock,
  TextMarks,
  TextRun,
  blocksToHtml,
  blocksToMarkdown,
  emptyMarks,
  escapeHtml,
  flattenElement,
  isAllowedLink
} from "./runs";

export interface MarkdownParse {
  blocks: RichBlock[];
  unsupported: string[];
}

const PUNCT = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

export function parseMarkdown(source: string, inline: boolean): MarkdownParse {
  const found: string[] = [];
  const seen = new Set<string>();
  const report = (kind: string) => {
    if (seen.has(kind)) return;
    seen.add(kind);
    found.push(kind);
  };
  const normalized = source.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = inline ? parseInlineDocument(normalized, report) : parseBlockDocument(normalized, report);
  return { blocks: blocks, unsupported: found };
}

function parseInlineDocument(source: string, report: (kind: string) => void): RichBlock[] {
  if (!source) return [];
  const content = parseInline(source, report, true);
  return content.length ? [{ type: "paragraph", content: content }] : [];
}

function parseBlockDocument(source: string, report: (kind: string) => void): RichBlock[] {
  if (!source) return [];
  const lines = source.split("\n");
  const blocks: RichBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim() === "") {
      i++;
      continue;
    }
    if (isFence(lines[i])) {
      const start = i;
      i++;
      while (i < lines.length && !isFence(lines[i])) i++;
      if (i < lines.length) i++;
      report("code");
      blocks.push(literalParagraph(lines.slice(start, i)));
      continue;
    }
    const tableEnd = tableEndIndex(lines, i);
    if (tableEnd > i) {
      report("table");
      blocks.push(literalParagraph(lines.slice(i, tableEnd)));
      i = tableEnd;
      continue;
    }
    if (/^#{1,6}(\s|$)/.test(lines[i])) {
      report("heading");
      blocks.push(literalParagraph([lines[i]]));
      i++;
      continue;
    }
    if (/^>\s?/.test(lines[i])) {
      report("blockquote");
      const start = i;
      while (i < lines.length && /^>\s?/.test(lines[i])) i++;
      blocks.push(literalParagraph(lines.slice(start, i)));
      continue;
    }
    if (isNestedList(lines[i])) {
      report("nested-list");
      blocks.push(literalParagraph([lines[i]]));
      i++;
      continue;
    }
    if (/^( {4}|\t)/.test(lines[i])) {
      report("code");
      const start = i;
      while (i < lines.length && /^( {4}|\t)/.test(lines[i])) i++;
      blocks.push(literalParagraph(lines.slice(start, i)));
      continue;
    }
    const list = readList(lines, i, report);
    if (list) {
      blocks.push(list.block);
      i = list.next;
      continue;
    }
    const start = i;
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !isBlockStart(lines, i)) i++;
    const content: InlinePiece[] = [];
    for (let line = start; line < i; line++) {
      if (line > start) content.push({ type: "break" });
      pushAll(content, parseInline(lines[line], report, false));
    }
    blocks.push({ type: "paragraph", content: content });
  }
  return blocks;
}

function isFence(line: string): boolean {
  return /^`{3,}/.test(line.trim());
}

function isNestedList(line: string): boolean {
  return /^\s+([-+*]|\d+\.)\s+/.test(line);
}

function isDelimiterRow(line: string): boolean {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function tableEndIndex(lines: string[], index: number): number {
  if (index + 1 >= lines.length) return index;
  if (lines[index].indexOf("|") < 0 || !isDelimiterRow(lines[index + 1])) return index;
  let end = index + 2;
  while (end < lines.length && lines[end].indexOf("|") >= 0 && lines[end].trim() !== "") end++;
  return end;
}

function isBlockStart(lines: string[], index: number): boolean {
  const line = lines[index];
  return isFence(line) || tableEndIndex(lines, index) > index || /^#{1,6}(\s|$)/.test(line) || /^>\s?/.test(line) || isNestedList(line) || /^( {4}|\t)/.test(line) || /^([-+*]|\d+\.)\s+/.test(line);
}

function literalParagraph(lines: string[]): ParagraphBlock {
  const content: InlinePiece[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) content.push({ type: "break" });
    content.push(textRun(lines[i], emptyMarks()));
  }
  return { type: "paragraph", content: content };
}

function readList(lines: string[], index: number, report: (kind: string) => void): { block: ListBlock, next: number } | null {
  const match = /^([-+*]|\d+\.)\s+/.exec(lines[index]);
  if (!match) return null;
  const ordered = /\d/.test(match[1]);
  const items: InlinePiece[][] = [];
  let i = index;
  while (i < lines.length) {
    const item = /^([-+*]|\d+\.)\s+/.exec(lines[i]);
    if (!item) break;
    const itemOrdered = /\d/.test(item[1]);
    if (itemOrdered !== ordered) break;
    items.push(parseInline(lines[i].substring(item[0].length), report, false));
    i++;
  }
  return { block: { type: "list", ordered: ordered, items: items }, next: i };
}

function textRun(text: string, marks: TextMarks): TextRun {
  return { type: "text", text: text, marks: { ...marks } };
}

function pushAll(target: InlinePiece[], source: InlinePiece[]): void {
  for (let i = 0; i < source.length; i++) target.push(source[i]);
}

interface DelimToken {
  type: "delim";
  char: "*" | "_" | "~";
  length: number;
  canOpen: boolean;
  canClose: boolean;
}

interface TextToken {
  type: "text";
  text: string;
  marks: TextMarks;
}

type InlineToken = DelimToken | TextToken | BreakRun;

function parseInline(source: string, report: (kind: string) => void, allowBreaks: boolean): InlinePiece[] {
  const tokens: InlineToken[] = [];
  let i = 0;
  let plain = "";
  const flushPlain = () => {
    if (!plain) return;
    tokens.push({ type: "text", text: plain, marks: emptyMarks() });
    plain = "";
  };
  while (i < source.length) {
    const ch = source[i];
    if (ch === "\\" && i + 1 < source.length) {
      plain += source[i + 1];
      i += 2;
      continue;
    }
    if (ch === "`") {
      const end = closingCode(source, i);
      if (end > i) {
        report("code");
        plain += source.substring(i, end);
        i = end;
        continue;
      }
    }
    if (ch === "!" && source[i + 1] === "[") {
      const image = readLink(source, i + 1);
      if (image) {
        report("image");
        plain += source.substring(i, image.end);
        i = image.end;
        continue;
      }
    }
    if (ch === "[") {
      const link = readLink(source, i);
      if (link) {
        flushPlain();
        if (isAllowedLink(link.url)) {
          const inner = parseInline(link.text, report, allowBreaks);
          for (let n = 0; n < inner.length; n++) {
            const piece = inner[n];
            if (piece.type === "text") piece.marks.link = link.url.trim();
            tokens.push(piece);
          }
        } else {
          plain += source.substring(i, link.end);
        }
        i = link.end;
        continue;
      }
    }
    if (ch === "<" && /[A-Za-z/]/.test(source[i + 1] || "")) {
      report("raw-html");
      plain += ch;
      i++;
      continue;
    }
    if (ch === "\n" && allowBreaks) {
      flushPlain();
      tokens.push({ type: "break" });
      i++;
      continue;
    }
    if (ch === "*" || ch === "_" || ch === "~") {
      let j = i + 1;
      while (j < source.length && source[j] === ch) j++;
      const length = j - i;
      if (ch === "~" && length < 2) {
        plain += source.substring(i, j);
        i = j;
        continue;
      }
      flushPlain();
      const flanking = delimiterFlanking(source, i, length);
      const canOpen = ch === "_" ? flanking.left && (!flanking.right || flanking.beforePunct) : flanking.left;
      const canClose = ch === "_" ? flanking.right && (!flanking.left || flanking.afterPunct) : flanking.right;
      if (!canOpen && !canClose) {
        plain += source.substring(i, j);
      } else {
        tokens.push({ type: "delim", char: ch, length: length, canOpen: canOpen, canClose: canClose });
      }
      i = j;
      continue;
    }
    plain += ch;
    i++;
  }
  flushPlain();
  resolveDelimiters(tokens);
  return tokensToPieces(tokens);
}

function closingCode(source: string, start: number): number {
  let ticks = 0;
  while (source[start + ticks] === "`") ticks++;
  const rest = source.indexOf("`".repeat(ticks), start + ticks);
  if (rest < 0) return start;
  return rest + ticks;
}

function readLink(source: string, start: number): { text: string, url: string, end: number } | null {
  // start points at '['
  let i = start + 1;
  while (i < source.length && source[i] !== "]") {
    if (source[i] === "\\") i++;
    i++;
  }
  if (source[i] !== "]" || source[i + 1] !== "(") return null;
  const text = source.substring(start + 1, i);
  i += 2;
  const urlStart = i;
  while (i < source.length && source[i] !== ")") {
    if (source[i] === "\\") i++;
    i++;
  }
  if (source[i] !== ")") return null;
  return { text: unescapeMarkdown(text), url: unescapeMarkdown(source.substring(urlStart, i)), end: i + 1 };
}

function unescapeMarkdown(text: string): string {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\\" && i + 1 < text.length) {
      out += text[i + 1];
      i++;
    } else {
      out += text[i];
    }
  }
  return out;
}

function delimiterFlanking(source: string, start: number, length: number): { left: boolean, right: boolean, beforePunct: boolean, afterPunct: boolean } {
  const before = start > 0 ? source[start - 1] : "";
  const afterIndex = start + length;
  const after = afterIndex < source.length ? source[afterIndex] : "";
  const beforeSpace = before === "" || /\s/.test(before);
  const afterSpace = after === "" || /\s/.test(after);
  const beforePunct = PUNCT.test(before);
  const afterPunct = PUNCT.test(after);
  const left = !afterSpace && (!afterPunct || beforeSpace || beforePunct);
  const right = !beforeSpace && (!beforePunct || afterSpace || afterPunct);
  return { left: left, right: right, beforePunct: beforePunct, afterPunct: afterPunct };
}

function canMatch(opener: DelimToken, closer: DelimToken): boolean {
  if (opener.char !== closer.char || !opener.canOpen || !closer.canClose || opener.length <= 0 || closer.length <= 0) return false;
  if ((opener.canOpen && opener.canClose) || (closer.canOpen && closer.canClose)) {
    const sum = opener.length + closer.length;
    if (sum % 3 === 0 && opener.length % 3 !== 0 && closer.length % 3 !== 0) return false;
  }
  if (opener.char === "~") return opener.length >= 2 && closer.length >= 2;
  return true;
}

function resolveDelimiters(tokens: InlineToken[]): void {
  let closerIndex = 0;
  while (closerIndex < tokens.length) {
    const closer = tokens[closerIndex];
    if (closer.type !== "delim" || !closer.canClose || closer.length <= 0) {
      closerIndex++;
      continue;
    }
    let openerIndex = -1;
    for (let j = closerIndex - 1; j >= 0; j--) {
      const opener = tokens[j];
      if (opener.type === "delim" && canMatch(opener, closer)) {
        openerIndex = j;
        break;
      }
    }
    if (openerIndex < 0) {
      closerIndex++;
      continue;
    }
    const opener = tokens[openerIndex] as DelimToken;
    const use = opener.char === "~" ? 2 : (opener.length >= 2 && closer.length >= 2 ? 2 : 1);
    const mark = opener.char === "~" ? "strike" : use === 2 ? "bold" : "italic";
    for (let n = openerIndex + 1; n < closerIndex; n++) {
      const token = tokens[n];
      if (token.type === "text") token.marks[mark] = true;
    }
    opener.length -= use;
    closer.length -= use;
    if (closer.length <= 0) closerIndex++;
  }
}

function tokensToPieces(tokens: InlineToken[]): InlinePiece[] {
  const pieces: InlinePiece[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "break") {
      pieces.push({ type: "break" });
    } else if (token.type === "text" && token.text) {
      pieces.push({ type: "text", text: token.text, marks: token.marks });
    } else if (token.type === "delim" && token.length > 0) {
      pieces.push(textRun(token.char.repeat(token.length), emptyMarks()));
    }
  }
  return pieces;
}

export function markdownToHtml(source: string, inline: boolean): string {
  return blocksToHtml(parseMarkdown(source, inline).blocks, true);
}

export const markdownConverter: IRichTextConverter = {
  toHtml(source: string, context: IRichTextConverterContext): string {
    return markdownToHtml(source, !!context.inline);
  },
  toSource(root: HTMLElement): string {
    return blocksToMarkdown(flattenElement(root));
  },
  getUnsupported(source: string): string[] {
    return parseMarkdown(source, false).unsupported;
  }
};

export function htmlEscapeVisible(text: string): string {
  return escapeHtml(text);
}
