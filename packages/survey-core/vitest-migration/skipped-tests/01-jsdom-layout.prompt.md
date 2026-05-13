---
description: "Un-skip survey-core tests that depend on real DOM layout, focus, scroll, RTL, matchMedia, ResizeObserver, or getBoundingClientRect."
name: "Un-skip jsdom layout/focus tests"
argument-hint: "Optional file path (e.g., tests/components/popuptests.ts) to scope to a single file"
agent: "agent"
---
Un-skip the survey-core tests listed below by replacing the missing-jsdom-feature with a deterministic stub, switching the test (or whole file) to `happy-dom`, or — if neither works — moving the test to a Playwright component test in the appropriate UI package.

## Working directory

```
cd packages/survey-core
```

Run a single file in isolation: `npx vitest run tests/<file>.ts -t "<test name substring>"`.

## In-scope tests

All entries are preceded by a `// Skipped: …` marker comment in the file. Address them in the order listed; do not batch across files.

### `tests/components/popuptests.ts`
| Line | Test | Sub-cause |
|---|---|---|
| 166 | `PopupDropdownViewModel RTL` | `document.dir = "rtl"` direction calculation |
| 468 | `PopupDropdownViewModel pointerTarget` | element rect-based pointer alignment |
| 1039 | `PopupModel dropdown displayMode` | `matchMedia` / screen size |
| 1056 | `PopupModel displayMode overlay and overlayDisplayMode` | `matchMedia` / screen size |
| 1115 | `PopupModel top+center position calculate` | `getBoundingClientRect` layout |
| 1146 | `PopupModel top+left position calculate` | `getBoundingClientRect` layout |
| 1177 | `Fixed PopupModel width calculate setWidthByTarget = false` | width measurement |
| 1213 | `Fixed PopupModel width calculate if short content setWidthByTarget = false` | width measurement |
| 1249 | `Fixed PopupModel width calculate and overflow content position calculate setWidthByTarget = false` | width measurement |
| 1285 | `Fixed PopupModel width calculate` | width measurement |
| 1321 | `Fixed PopupModel width calculate if short content` | width measurement |
| 1357 | `Fixed PopupModel width calculate and overflow content position calculate` | width measurement |
| 1393 | `PopupViewModel updateOnHiding` | hide animation |
| 1454 | `PopupViewModel updateOnHiding displayMode = overlay` | hide animation |
| 1517 | `Check that modal popup prevents scroll outside` | scroll events |
| 1598 | `PopupModel into modal window with translate/transform` | element transform offsets |

### `tests/listModelTests.ts`
| Line | Test |
|---|---|
| 211 | `ListModel focus item` |
| 230 | `focusNextVisibleItem item` |
| 243 | `focusNextVisibleItem item + filtration` |
| 269 | `focusPrevVisibleItem item + filtration` |
| 294 | `selectFocusedItem` |
| 306 | `onMouseMove` |
| 317 | `add/remove scrollHandler` |
| 360 | `onItemRended & hasVerticalScroller & isAllDataLoaded` |

### `tests/multi_select_list_model_tests.ts`
| Line | Test |
|---|---|
| 100 | `selectFocusedItem` |
| 114 | `selectFocusedItem & hideSelectedItems` |

### `tests/dropdown_list_model_test.ts`
| Line | Test |
|---|---|
| 77 | `DropdownListModel focusFirstInputSelector` |

### `tests/dropdown_multi_select_list_model_test.ts`
| Line | Test |
|---|---|
| 74 | `DropdownListModel with MultiListModel & searchEnabled false` |
| 220 | `hintString test` |
| 294 | `reset placeholder on in-list focus change` |
| 306 | `tagbox using space` |
| 339 | `tagbox hint after deselect` |

### `tests/question_tagbox_tests.ts`
| Line | Test |
|---|---|
| 50 | `clearValue` |

### `tests/questionDropdownTests.ts`
| Line | Test |
|---|---|
| 96 | `Test dropdown renderAs select` |
| 145 | `Test dropdown renderAs select searchEnabled property` |
| 1765 | `lazy loading: duplication of elements after blur` |
| 1819 | `lazy loading: check onChoicesLazyLoad callback count` |
| 2059 | `allowCustomChoices: Possibility of creating an element with custom value if searchEnabled: false` |
| 2319 | `allowCustomChoices: hintString with custom value if searchEnabled: true` |

### `tests/surveytests.ts`
| Line | Test |
|---|---|
| 14453 | `Check survey resize observer double process` |
| 14490 | `Check survey resize observer do not process if container is not visible` |
| 17161 | `Check onOpenDropdownMenu events` |
| 19841 | `Check that focusInput works correctly with shadow dom` (also needs `CSS.escape` — see [04-missing-dom-apis.prompt.md](04-missing-dom-apis.prompt.md)) |

### `tests/a11y.ts`
| Line | Test | Note |
|---|---|---|
| 114 | `a11y: aria-labelledby` (radiogroup variant) | `a11y_input_ariaExpanded` returns `undefined` instead of `null`; investigate whether the production getter has a layout dependency or a strict-equality bug. |

### `tests/dragdropcoretests.ts`
| Line | Test |
|---|---|
| 23 | `Show/hide new created item, simple test` (uses `clientWidth`/`clientHeight`/`scrollTop`) |

### `tests/paneltests.ts`
| Line | Test |
|---|---|
| 1759 | `Check panel styles with originalPage and showPreview` (depends on rendered panel layout class application) |

## Resolution recipes (apply in order, stop at the first that works)

### 1. Per-file `happy-dom` switch
Add at the very top of the file:

```ts
// @vitest-environment happy-dom
```

Run the file. happy-dom implements a larger DOM surface than jsdom (including more layout/`matchMedia`). If the whole file passes, prefer this and stop.

### 2. Per-test stub
For a single test that needs known dimensions or `matchMedia`:

```ts
const el = document.createElement("div");
Object.defineProperty(el, "offsetWidth", { configurable: true, value: 320 });
Object.defineProperty(el, "offsetHeight", { configurable: true, value: 200 });
Object.defineProperty(el, "getBoundingClientRect", {
  configurable: true,
  value: () => ({ top: 100, left: 50, right: 370, bottom: 300, width: 320, height: 200, x: 50, y: 100, toJSON() {} }),
});
```

For `matchMedia`:

```ts
const mql = (q: string) => ({ matches: q.includes("min-width: 600px"), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false, onchange: null });
Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: mql });
```

For RTL: set `document.dir = "rtl"` **and** stub the parent-element rect; jsdom keeps the attribute but never reflows.

### 3. Shared polyfill in `tests/vitest.setup.ts`
Only when the same stub is needed by ≥3 tests. `ResizeObserver` already has a no-op polyfill there — extend it to invoke the callback synchronously on `observe()` if a test explicitly needs the first-tick callback (gate this behind a flag the test sets so other tests are unaffected).

### 4. Move to a Playwright component test
If the test really exercises rendered layout (e.g., popup width calculation, modal scroll lock, scroll-by-drag), it belongs in `packages/survey-react-ui/e2e/` (or the matching UI package). Steps:
1. Translate the test into Playwright form using an existing spec in `packages/survey-react-ui/e2e/` as a template.
2. In the survey-core file, replace the body with a single line: `// Moved to packages/<ui-package>/e2e/<file>.spec.ts — <PR/issue>` and **remove** `test.skip` (delete the test entirely from the unit suite).

## Required output

1. Per-test result table:

   | File | Line | Test | Resolution (happy-dom / stub / setup / moved) | Vitest result |
   |---|---|---|---|---|

2. Diff of each modified test file plus `tests/vitest.setup.ts` if changed.
3. Output of `npx vitest run tests/<file>.ts` for every modified file.
4. Output of `npm run test` for the whole survey-core suite (regression check).

## Quality checks

- Never silently widen a stub used by other tests — gate behavioral stubs (e.g., synchronous ResizeObserver fire) behind a per-test flag.
- For every test you un-skip, delete the `// Skipped: …` marker comment immediately above it.
- For every test you move out of unit suite, leave a one-line breadcrumb pointing to the new location.
- If you switch a whole file to `happy-dom`, verify in the PR description that none of the file's other tests now rely on jsdom-specific quirks.
