# Rich text rework: survey strings through handlers (milestone M3R)

Task list for the next session. It brings the code written for M0–M3 in line with the updated `RICH_TEXT_PLUGIN_SPEC.md`. The spec is the source of truth; this file only lists what to change in the existing code and why.

## 1. Team decisions (already applied to the spec)

1. survey-core does not connect the built-in converter to surveys through `settings`. The plugin exports converter functions and ready-made handlers, and customers attach them to `survey.onTextMarkdown` the same way as an external converter (markdown-it).
2. The survey property `stringFormat` is removed.
3. `settings.richText` is removed entirely, together with `src/rich-text-provider.ts`. Creator gets the editor through a new explicit API: `creator.registerRichTextEditor(RichText)`.
4. Creator shows the rich toolbar for survey strings only when an editor is registered **and** `onHtmlToMarkdown` has a handler (the existing `checkMarkdownToTextConversion` probe).
5. Public API: both plain functions (`markdownToHtml`, `htmlToMarkdown`) and ready-made handlers (`textMarkdownHandler`, `htmlToMarkdownHandler`). The handlers work out inline vs block from `options.name`.
6. Survey strings have no built-in HTML format. A customer who wants HTML strings writes `options.html = options.text` in their own handler (their risk). The allow-list HTML format stays for comment answers (`textFormat: "html"`).
7. The comment property `textFormat` stays unchanged.
8. The library's in-place string editor fix (old §5.4) is dropped from scope.
9. The Creator string editor is format-agnostic. The toolbar edits HTML, and the customer's `onHtmlToMarkdown` handler converts it. There is no lossless check or source mode for survey strings.

The spec's consequences of decision 9 (§6.1, §9.2.1): comment cells in Creator (property grid, translation grid) need a converter that goes through the customer's handlers. The spec adds a non-serializable comment property, `richTextConverter`, for this. **Confirm with the team** (see §7, open questions).

## 2. survey-core (outside the plugin)

| File | Change |
|---|---|
| `src/survey.ts` | Remove `@property(...) stringFormat` (around line 3409). Restore `getSurveyMarkdownHtml` to the original: `html: null`, no `provider` / `format` locals (around lines 8563–8573). Remove the serializer entry `{ name: "stringFormat", ... }` (around line 9545). |
| `src/settings.ts` | Remove `import type { IRichTextProvider } ...` and the `richText: <IRichTextProvider>undefined,` entry together with its comment. |
| `src/rich-text-provider.ts` | Delete the file. |
| `entries/chunks/core-wo-model.ts` | Remove `export * from "../../src/rich-text-provider";`. |
| `src/question_comment.ts` | No change (`textFormat` + `getComponentName` stay). |

Check: `git diff master -- packages/survey-core/src/survey.ts packages/survey-core/src/settings.ts` must be empty after the change.

## 3. Plugin (`packages/survey-core/src/plugins/rich-text/`)

### 3.1 `api.ts`
- Remove `RichText.defaultFormat`.
- Move here the types that were in core: `RichTextEditMode`, `IRichTextEditorOptions` (`{ mode: "inline" | "block"; onInput?: () => void }`) and `IRichTextEditorHandle` (`{ toolbar: ActionContainer; detach(): void }`). Note: there is no `format`, `onChange` or `getSource` anymore.
- Add static members that delegate to `survey-strings.ts`: `markdownToHtml`, `htmlToMarkdown`, `textMarkdownHandler`, `htmlToMarkdownHandler`, `getStringEditMode`, `attachEditor` (signatures in spec §4.2). Keep `getEditMode`, `registerFormat`, `getFormat`, `isLossless` and `findUnsupported`.
- Watch for import cycles (`api.ts` ↔ `lossless.ts` ↔ `survey-strings.ts`). If needed, assign the delegating members in `index.ts` after all modules load, the same way `installConverters` is called.

### 3.2 `provider.ts` → new `survey-strings.ts`
Delete `provider.ts` (`richTextProvider` and `activateRichTextProvider`). Create `survey-strings.ts`:

- `resolveInline(context)`: use `context.inline` when it is set; otherwise, when there is no `context.element`, return `true`; otherwise `getStringEditMode(element, name, element.getLocalizableString(name)) !== "block"`.
- `markdownToHtml(text, context?)`: `RichText.getFormat("markdown").toHtml(text, { inline, element, name })`. Return `""` when the result is empty or has no `<` (same rule as the current `provider.toHtml`).
- `htmlToMarkdown(html, context?)`: create the detached element with `createDetachedElement(html)` from `runs.ts`. When there is no DOM or no element, return `html` unchanged. Otherwise `RichText.getFormat("markdown").toSource(element, { inline, element, name })`.
- `textMarkdownHandler(sender, options)`: `const html = markdownToHtml(options.text, { element: options.element, name: options.name }); if (html) options.html = html;`.
- `htmlToMarkdownHandler(sender, options)`: `options.text = htmlToMarkdown(options.html, { element: options.element, name: options.name });`. It must return `""` (not `null`) for empty HTML, so Creator's probe (`options.text !== null`) detects the handler.
- `getStringEditMode(owner, name, locStr)`: `RichText.getEditMode(owner, name, locStr, getDefaultEditMode(owner, name, locStr))`.
- `attachEditor(element, options)`: a `RichTextEditorModel` in format-agnostic mode (§3.5). Returns `{ toolbar, detach }`.

### 3.3 `edit-mode.ts`
- Delete `getStringFormat`.
- Remove the line `if (getStringFormat(owner) === "plain") return "none";` from `getDefaultEditMode`.
- Import `RichTextEditMode` from `./api` instead of `survey-core`.

### 3.4 `lossless.ts`
- `findUnsupported`: `const scanFormat: RichTextFormat = format || "markdown";`.

### 3.5 `editor-model.ts`
- `IRichTextEditorHost`: add `readonly converter?: IRichTextConverter`. Add a private `get converter()` that returns `host.converter || RichText.getFormat(host.format)`, and use it in place of both `RichText.getFormat(this.host.format)` calls (lines ~114 and ~158) and in the lossless check.
- Format-agnostic mode for `attachEditor` (add a host flag such as `readonly managesValue: boolean`, or a separate constructor option). In this mode:
  - The model does not read or write a value: no initial content render, no serialization on input or blur, no external-value handling.
  - No source mode and no lossless check.
  - Paste normalization uses `RichText.getFormat("html")` (allow-list) for the `toSource` → `toHtml` round trip.
  - `onInput` (when given) is called on real `input` events.
- Add a read-only HTML helper on the model (e.g. `getReadOnlyHtml(value)`) that uses the resolved converter. Then the wrapper (`rich-text-comment.tsx`, `renderReadOnly`) stops calling `RichText.getFormat` directly. This is needed for `richTextConverter`, and it moves logic out of the wrapper (§8: no business logic in wrappers).

### 3.6 `index.ts`
- Remove `import { activateRichTextProvider }` and its call.
- Remove `Serializer.findProperty("survey", "stringFormat").visible = true;`.
- Add `Serializer.addProperty("comment", { name: "richTextConverter", visible: false, isSerializable: false });`. Check that `Serializer` accepts an object value with no `type`; if it doesn't, declare a plain property on the instance instead and note why in a comment.
- Export the new types (`RichTextEditMode`, `IRichTextEditorOptions`, `IRichTextEditorHandle`).

### 3.7 `entries/rich-text.ts`
- Add the new types to the `export type { ... }` list.

### 3.8 React wrapper (`packages/survey-react-ui/src/components/rich-text/rich-text-comment.tsx`)
- In the host object, add `get converter() { return (question as any).richTextConverter; }`.
- In `renderReadOnly`, use the model helper from §3.5 instead of `RichText.getFormat(format).toHtml(...)`.

## 4. Tests

| File | Change |
|---|---|
| `tests/rich-text/provider.tests.ts` | Delete it, and create `survey-strings.tests.ts` with the cases in spec §13.1 (plugin without a handler renders plain; `textMarkdownHandler` uses inline for titles and block for descriptions; plain strings keep `hasHtml === false`; conditional handler; pass-through handler unaffected; explicit `inline`; `htmlToMarkdown` for a string, for `""` and without a DOM; `htmlToMarkdownHandler`; a registered `"markdown"` converter is used; `findUnsupported` default). |
| `tests/rich-text/comment-text-format.tests.ts` | Remove the `stringFormat` test (around lines 52–66) and the `stringFormat` assertion in the visibility test (around line 70). Add: the survey has no `stringFormat` property (`Serializer.findProperty("survey", "stringFormat")` is null); `settings` has no `richText` key; `richTextConverter` is not serialized and replaces `RichText.getFormat(textFormat)`. Rename the `describe` title. |
| `tests/rich-text/edit-mode.tests.ts` | Remove `stringFormat` from survey JSON (line ~14). Replace `settings.richText.getEditMode` with `RichText.getStringEditMode` (lines ~20, ~41). Replace the "`stringFormat: plain` → none" case (lines ~37–41) with "a title of a survey without any handler → `inline`" (the mode no longer depends on handlers). |
| `tests/rich-text/lossless.tests.ts` | Remove `stringFormat: "markdown"` (line ~27); `findUnsupported` must still find the same hits through the `"markdown"` default. |
| `tests/rich-text/markdown.tests.ts` | Line ~9: attach `RichText.textMarkdownHandler` instead of setting `stringFormat`. |
| `tests/rich-text/editor-model.tests.ts` | Remove the `stringFormat` visibility assertion (line ~47). Add the format-agnostic mode cases (spec §13.1, end of the editor-model bullet) and a `host.converter` case. |
| Markup etalons (`tests/markup/etalon_rich_text.ts`) | No `stringFormat` there; re-run the React markup tests to confirm the snapshots are unchanged. |

Run `npx vitest run tests/rich-text` and then the full `npm run test` in `packages/survey-core`, plus `npm run lint`. The full suite must pass without changed expectations outside `tests/rich-text/`.

## 5. Demo page (`packages/survey-react-ui/rich-text.js`, `rich-text.html`)

- Remove `"stringFormat": "markdown"` from `demoSurveyJson` (keep the JSON identical to spec Appendix A).
- Replace the string format buttons (`data-format`, `applyStringFormat`) with a **string handler switch** (`data-handler`): `none` / `built-in` (the default when the plugin is loaded) / `raw HTML` / `custom` (spec §14.2). Switching removes the previous handler from `survey.onTextMarkdown`, adds the new one and calls `survey.locStrsChanged()`.
- Attach the default handler **before** `ReactDOM.render`, so the first paint is already formatted.
- Remove the old "custom handler" checkbox (`custom-handler`, `titleHandler`); it is now the `custom` option of the switch.
- With `?plugin=off`, hide the switch (no plugin, so no handlers).

## 6. Verification (CP3R in the spec)

1. `npm run build && npm run build:rich-text` in `packages/survey-core`, then `npm run build && npm start` in `packages/survey-react-ui`, open `/rich-text.html`.
2. Re-check the CP1/CP2 items marked *(re-verify after M3R)* and all CP3 items.
3. `git grep -n "stringFormat\|settings.richText\|rich-text-provider" packages/` finds nothing.
4. In the console: `SurveyRichText.RichText.markdownToHtml("**a**")` returns `<strong>a</strong>`; `htmlToMarkdown("<b>a</b>")` returns `**a**`; `markdownToHtml("plain")` returns `""`.

## 7. Open questions for the team

1. **`richTextConverter` on comment questions.** The format-agnostic Creator decision means the property grid and translation grid comment cells must render and save through the customer's handlers, not through `RichText.getFormat(textFormat)`. The spec adds a non-serializable `richTextConverter` property for this (§6.1, §9.2.1). The alternative is no rich editing in property-grid and translation-grid cells in v1 (the design surface and the side-by-side target pane would still be rich). Which one?
2. **The `textFormat: "markdown"` placeholder in Creator cells.** With `richTextConverter` set, Creator still sets `textFormat: "markdown"` only to switch the renderer on. Is that acceptable, or should `getComponentName` also switch when `richTextConverter` is set? The second option would need a core change, or a plugin-side override.
3. **Name of the Creator API.** `creator.registerRichTextEditor(RichText)` is a working name; confirm it, or choose a property (`creator.richTextEditor = RichText`).
