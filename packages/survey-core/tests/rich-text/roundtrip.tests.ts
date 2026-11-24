import { describe, expect, test } from "vitest";
import { sanitizeHtml } from "../../src/plugins/rich-text/sanitizer";
import { renderRuns, RichRun } from "../../src/plugins/rich-text/runs";

const corpus = [
  "<b>a</b>",
  "<p>one</p>",
  "<div>one</div><div>two</div>",
  "<ul><li>a</li></ul>tail",
  "a\nb",
  "Tom & Jerry",
  "R&amp;D",
  "<span style=\"color:red\">x</span>",
  "<a href=\"https://x\">x</a>",
  "<a href=\"javascript:alert(1)\">x</a>",
  "Please <strong>read</strong> the <em>terms</em> carefully",
  "<p>Line one<br>Line two</p><ul><li>item one</li><li>item two</li></ul>"
];

function textOf(html: string): string {
  const root = document.createElement("div");
  root.innerHTML = html;
  return root.textContent || "";
}

function flatten(html: string): RichRun[] {
  const root = document.createElement("div");
  root.innerHTML = html;
  const runs: RichRun[] = [];
  const visit = (node: Node, marks: { strong?: boolean, em?: boolean, s?: boolean, href?: string }) => {
    if (node.nodeType === 3) {
      const text = node.textContent || "";
      if (!text) return;
      const prev = runs[runs.length - 1];
      const same = prev && prev.text !== "\n" && text !== "\n" && prev.strong === marks.strong && prev.em === marks.em && prev.s === marks.s && prev.href === marks.href;
      if (same) prev.text += text;
      else {
        const run: RichRun = { text: text };
        if (marks.strong) run.strong = true;
        if (marks.em) run.em = true;
        if (marks.s) run.s = true;
        if (marks.href) run.href = marks.href;
        runs.push(run);
      }
      return;
    }
    if (node.nodeType !== 1) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    if (tag === "br") {
      runs.push({ text: "\n" });
      return;
    }
    const next = { ...marks };
    if (tag === "strong") next.strong = true;
    if (tag === "em") next.em = true;
    if (tag === "s") next.s = true;
    if (tag === "a") next.href = el.getAttribute("href") || "";
    for (let i = 0; i < el.childNodes.length; i++) visit(el.childNodes[i], next);
  };
  for (let i = 0; i < root.childNodes.length; i++) visit(root.childNodes[i], {});
  return runs;
}

describe("sanitizer round trip", () => {
  test("sanitizing twice changes nothing", () => {
    for (let i = 0; i < corpus.length; i++) {
      const once = sanitizeHtml(corpus[i]);
      expect(sanitizeHtml(once), corpus[i]).toBe(once);
    }
  });

  test("rendering runs and reading them back returns the same runs", () => {
    const sequences: RichRun[][] = [
      [{ text: "Please " }, { text: "read", strong: true }, { text: " the " }, { text: "terms", em: true }],
      [{ text: "a", strong: true, em: true }, { text: "b", em: true }],
      [{ text: "go", href: "https://x", strong: true }, { text: " on" }],
      [{ text: "a" }, { text: "\n" }, { text: "b" }]
    ];
    for (let i = 0; i < sequences.length; i++) {
      const html = renderRuns(sequences[i]);
      expect(sanitizeHtml(html)).toBe(html);
      expect(flatten(html)).toEqual(sequences[i]);
    }
  });

  test("escaped text parses back to the original characters", () => {
    const alphabet = ["&", "<", ">", "\"", "#", "0", "a", "b", " "];
    for (let i = 0; i < alphabet.length; i++) {
      for (let j = 0; j < alphabet.length; j++) {
        const original = "x" + alphabet[i] + alphabet[j] + "y";
        const holder = document.createElement("div");
        holder.textContent = original;
        const canonical = sanitizeHtml(holder.innerHTML);
        expect(textOf(canonical), original).toBe(original);
      }
    }
  });
});
