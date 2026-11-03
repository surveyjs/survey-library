import { DomDocumentHelper } from "survey-core";
import { IRichTextConverter, IRichTextConverterContext } from "./api";
import { blocksToHtml, createDetachedElement, flattenElement, RichBlock } from "./runs";

function collectKinds(source: string): string[] {
  if (!DomDocumentHelper.isAvailable()) return [];
  const element = createDetachedElement(source);
  if (!element) return [];
  const kinds: string[] = [];
  const seen = new Set<string>();
  flattenElement(element, {
    report: (kind: string) => {
      if (seen.has(kind)) return;
      seen.add(kind);
      kinds.push(kind);
    }
  });
  return kinds;
}

function blocksForContext(blocks: RichBlock[], inline: boolean): RichBlock[] {
  if (!inline) return blocks;
  const content = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (content.length) content.push({ type: "break" as const });
    if (block.type === "paragraph") {
      for (let n = 0; n < block.content.length; n++) content.push(block.content[n]);
    } else {
      for (let n = 0; n < block.items.length; n++) {
        if (n > 0) content.push({ type: "break" as const });
        for (let p = 0; p < block.items[n].length; p++) content.push(block.items[n][p]);
      }
    }
  }
  return content.length ? [{ type: "paragraph", content: content }] : [];
}

export const htmlConverter: IRichTextConverter = {
  toHtml(source: string, context: IRichTextConverterContext): string {
    if (!DomDocumentHelper.isAvailable()) return "";
    const element = createDetachedElement(source);
    if (!element) return "";
    return blocksToHtml(blocksForContext(flattenElement(element), !!context.inline), true);
  },
  toSource(root: HTMLElement, context: IRichTextConverterContext): string {
    const blocks = blocksForContext(flattenElement(root), !!context.inline);
    return blocksToHtml(blocks, false);
  },
  checkLossless(source: string): boolean {
    if (!DomDocumentHelper.isAvailable()) return true;
    return collectKinds(source).length === 0;
  },
  getUnsupported(source: string): string[] {
    return collectKinds(source);
  }
};
