---
description: "Un-skip survey-core tests that depend on Selection.modify(), CSS.escape, comma-separated CSS shorthand parsing, or shadow-DOM querying."
name: "Un-skip missing-DOM-API tests"
agent: "agent"
---
Un-skip the survey-core tests listed below. Each one fails because jsdom is missing (or behaves differently for) a browser API that the production code calls into. Resolution is per-API: polyfill in `tests/vitest.setup.ts` if the surface is small, otherwise stub per-test or move to Playwright.

## Working directory

```
cd packages/survey-core
```

## In-scope tests

### `tests/utilstests.ts` — `Selection.modify()` (non-standard)
| Line | Test |
|---|---|
| 39 | `utils: sanitizer` |
| 69 | `utils: sanitizer with linebreaks` |
| 92 | `utils: sanitizer with grapheme clusters` |

These exercise `sanitizeEditableContent()` which uses `window.getSelection().modify("extend", "right", "character")` to walk a `contenteditable` range. jsdom's `Selection` has no `.modify()`.

### `tests/utilstests.ts` — comma-separated CSS shorthand on `getComputedStyle`
| Line | Test |
|---|---|
| 233 | `Test animation utils: getAnimationDuration` |
| 253 | `Test animation utils: getAnimationDuration` (second variant) |

`getAnimationDuration()` reads `el.style.animationDuration` like `"0.2s, 0.5s"` and expects `getComputedStyle(el).animationDuration` to round-trip the comma-separated value. jsdom returns `""` for any shorthand it doesn't fully implement.

### `tests/surveytests.ts` — Shadow DOM + `CSS.escape`
| Line | Test |
|---|---|
| 19841 | `Check that focusInput works correctly with shadow dom` |

The production `focusInput` path calls `CSS.escape(...)` on a selector and then `shadowRoot.querySelector(...)`. jsdom does not implement `CSS.escape` on `window.CSS` (and shadow-root querying still has gaps for some selectors).

## Resolution recipes

### A. `Selection.modify()` polyfill (utilstests sanitizer trio)

Implement the small subset the sanitizer needs (extend / move; right / left; character / word) directly on the active selection range in `tests/vitest.setup.ts`:

```ts
const SelectionProto = Object.getPrototypeOf(window.getSelection() ?? {});
if (SelectionProto && typeof SelectionProto.modify !== "function") {
  SelectionProto.modify = function (alter: "extend" | "move", direction: "left" | "right" | "forward" | "backward", granularity: "character" | "word" | "line" | "lineboundary") {
    if (this.rangeCount === 0) return;
    const range = this.getRangeAt(0);
    const node = (direction === "right" || direction === "forward") ? range.endContainer : range.startContainer;
    const offset = (direction === "right" || direction === "forward") ? range.endOffset : range.startOffset;
    if (node.nodeType !== Node.TEXT_NODE) return;
    const text = (node as Text).data;
    let newOffset = offset;
    if (granularity === "character") newOffset = (direction === "right" || direction === "forward") ? Math.min(text.length, offset + 1) : Math.max(0, offset - 1);
    else if (granularity === "word") {
      const re = /\S+/g;
      // ... walk forward/backward to next word boundary
    }
    if (alter === "move") { range.setStart(node, newOffset); range.setEnd(node, newOffset); }
    else { range.setEnd(node, newOffset); }
  };
}
```

Inspect the production `sanitizeEditableContent()` to enumerate exactly which `(alter, direction, granularity)` triples it calls — the polyfill only needs to cover those.

If grapheme-cluster handling needs `Intl.Segmenter` and that proves flaky under jsdom, leave the grapheme test moved to Playwright (recipe D) and unskip only the two simpler sanitizer tests.

### B. `getComputedStyle` shorthand patch (utilstests animation duration)

Two options, in order of preference:

1. **Per-test stub on the inspected element.** The tests construct the element themselves — set the value on a side-channel and stub `window.getComputedStyle` only for that element:

   ```ts
   const realGCS = window.getComputedStyle;
   vi.spyOn(window, "getComputedStyle").mockImplementation((el: Element, pseudo?: string | null) => {
     const cs = realGCS.call(window, el, pseudo);
     const inline = (el as HTMLElement).style.animationDuration;
     if (inline) return new Proxy(cs, { get: (t, p) => p === "animationDuration" ? inline : (t as any)[p] });
     return cs;
   });
   ```

2. **Switch the file to `happy-dom`** via `// @vitest-environment happy-dom` at the top of `utilstests.ts`. happy-dom round-trips comma-separated shorthand values. Verify the rest of the file still passes.

### C. `CSS.escape` polyfill (surveytests shadow-dom test)

Add to `tests/vitest.setup.ts` (guarded so it does not override a real implementation):

```ts
if (typeof window.CSS === "undefined" || typeof (window.CSS as any).escape !== "function") {
  (window as any).CSS = (window as any).CSS ?? {};
  (window as any).CSS.escape = (value: string) => String(value).replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, "\\$&");
};
```

(Use the spec algorithm if the simple regex above misses a character the test exercises — see https://drafts.csswg.org/cssom/#serialize-an-identifier.)

If the test still fails after the polyfill because the actual shadow-root `querySelector` does not match, treat the residual failure as a `DOM_API` gap and apply recipe **D** for that test only.

### D. Move to Playwright

For any test where the API is too large to polyfill realistically (full grapheme segmentation, full shadow DOM behavior), port it to a Playwright spec under `packages/survey-react-ui/e2e/` or `accessibilityTests/`. Leave a one-line breadcrumb in the survey-core file pointing to the new test and delete the skipped block.

## Required output

1. Per-test result table:

   | File | Line | Test | Recipe (A/B/C/D) | Vitest result |
   |---|---|---|---|---|

2. Diff of every modified file (test files + `tests/vitest.setup.ts` if touched).
3. `npx vitest run tests/<file>.ts` for each touched file.
4. `npm run test` regression check from `packages/survey-core`.

## Quality checks

- Polyfills installed in `vitest.setup.ts` must be **idempotent** and **guarded** (`if (typeof X === "undefined")`) so they don't shadow a real implementation in a future environment upgrade.
- Per-test `vi.spyOn` / mocks must be restored in `afterEach` (or via `restoreMocks: true` in `vitest.config.ts`).
- Delete the `// Skipped: …` / `// VITEST-MIGRATION: MANUAL` marker for every un-skipped test.
- Do not modify `packages/survey-core/src/` from this prompt.
