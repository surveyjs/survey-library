---
description: "Un-skip survey-core tests that depend on real canvas color normalization or <img> onerror lifecycle."
name: "Un-skip canvas / image-lifecycle tests"
agent: "agent"
---
Un-skip the survey-core tests listed below. Each one fails under jsdom because either (a) the canvas 2D context returned by jsdom is a stub that does not normalize CSS colors (e.g., `"#c8140a"` is not converted to `"rgba(200, 20, 10, 1)"` when read back via `ctx.fillStyle`), or (b) jsdom's `HTMLImageElement` does not fire `onerror` for invalid URLs the same way a real browser does, so the production code's `onReadyChanged` sequence never completes.

## Working directory

```
cd packages/survey-core
```

## In-scope tests

### `tests/question_ratingtests.ts`
| Line | Test | Sub-cause |
|---|---|---|
| 1287 | `rating colors` | canvas `fillStyle` round-trip |
| 1385 | `rating colors when vars used` | canvas `fillStyle` round-trip |

### `tests/question_signaturepadtests.ts`
| Line | Test |
|---|---|
| 675 | `Check storeDataAsText: false and no download file callback and incorrect link passed` |

## Resolution recipes

### A. Stub the color-normalizing call in production code path (preferred for the rating tests)

The rating tests don't actually need a real canvas — they call into a helper that uses canvas to normalize a CSS color string into `rgba()` form. Locate the helper (search for `getComputedStyle` + canvas `fillStyle` write/read pattern in `src/utils/utils.ts` or `src/utils/color.ts`) and inject a deterministic JS-only fallback when running under jsdom:

1. In `tests/vitest.setup.ts`, install a stub on `HTMLCanvasElement.prototype.getContext` that returns an object whose `fillStyle` setter parses common CSS color syntax (`#rrggbb`, `#rgb`, `rgb(...)`, named colors) into the canonical `rgba(r, g, b, a)` form on read. A tiny ~30-line implementation handles every input the rating tests use.

2. Verify the un-skipped tests do not assert on font/canvas drawing, only on the normalized color string.

If implementing the parser is too involved, prefer recipe **C**.

### B. Per-test stub of the helper

If the helper that does the canvas-based normalization is exported, mock it for these two tests using `vi.spyOn`:

```ts
import * as colorUtils from "src/utils/color";
beforeEach(() => {
  vi.spyOn(colorUtils, "normalizeColor").mockImplementation((c) => myJsParser(c));
});
```

Use only when the helper is reachable as a module-level export (avoid monkey-patching prototypes per-test).

### C. Move to a Playwright component test

If neither A nor B is clean, port the test into `packages/survey-react-ui/e2e/rating.spec.ts` (or the rating screenshots spec under `packages/survey-react-ui/screenshots/`) where a real Chromium canvas is available. Leave a one-line breadcrumb in `tests/question_ratingtests.ts` and delete the skipped block.

### D. signaturepad onerror lifecycle

The signaturepad test loads an image URL that should fail. jsdom does not fire `onerror` automatically. Two options:

- **Stub `HTMLImageElement` constructor** at the top of the test (or in a per-test `beforeEach`):

  ```ts
  const OriginalImage = window.Image;
  class StubImage extends OriginalImage {
    set src(v: string) { super.src = v; if (!v || v === "invalid-link") queueMicrotask(() => this.onerror?.(new Event("error"))); else queueMicrotask(() => this.onload?.(new Event("load"))); }
    get src() { return super.src; }
  }
  Object.defineProperty(window, "Image", { configurable: true, writable: true, value: StubImage });
  // restore in afterEach
  ```

- **Or move to a Playwright spec** — the production logic is small enough that recipe D-stub is preferred.

## Required output

1. Per-test result table:

   | File | Line | Test | Recipe (A/B/C/D) | Vitest result |
   |---|---|---|---|---|

2. Diff of every modified file (test files + `tests/vitest.setup.ts` if changed).
3. `npx vitest run tests/<file>.ts` for each touched file.
4. `npm run test` regression check from `packages/survey-core`.

## Quality checks

- A canvas color stub installed in `vitest.setup.ts` becomes shared infrastructure — confirm no other test relied on the prior thrown-error behavior.
- A `window.Image` replacement must be restored in `afterEach`; otherwise it leaks into unrelated suites.
- Delete the `// Skipped: …` marker on every un-skipped test.
- Do not modify `packages/survey-core/src/` from this prompt.
