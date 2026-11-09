import { DomDocumentHelper } from "survey-core";
import { blocksToHtml, createDetachedElement, flattenElement, RichBlock } from "./runs";

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

export function sanitizeHtml(html: string, inline: boolean): string {
  if (!DomDocumentHelper.isAvailable()) return "";
  const element = createDetachedElement(html);
  if (!element) return "";
  return blocksToHtml(blocksForContext(flattenElement(element), inline), true);
}

export function getDisallowedHtml(html: string): string[] {
  if (!DomDocumentHelper.isAvailable()) return [];
  const element = createDetachedElement(html);
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
