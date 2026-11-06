# Rich text rework: comment answers through handlers (milestone M4R)

Task list for the next session. It brings the code written for M0–M4 (including the M3R rework) in line with the updated `RICH_TEXT_PLUGIN_SPEC.md`. The spec is the source of truth; this file only lists what to change and why. Part A covers this repository (survey-library); part B covers the survey-creator repository, where work has not started yet, so it lists only how the Creator part of the spec changed.

## 1. Team decisions (already applied to the spec)

1. The comment property `textFormat` (`"plain" | "markdown" | "html"`) is removed. A boolean comment property `allowRichText` (default `false`) switches the question to the rich renderer (spec §5.1).
2. The storage format of an answer is decided by handlers, not by JSON. Answers are rendered through the existing `survey.onTextMarkdown` and saved through a new survey event `survey.onHtmlToMarkdown` (spec §5.2). Its options (`element`, `name`, `html`, `text`) match Creator's `onHtmlToMarkdown`, so `RichText.htmlToMarkdownHandler` fits both.
3. Handlers recognize an answer by `options.name === "value"`; `options.element` is the comment question. HTML answers for selected questions are a customer pattern built on this (spec §4.2 sample), not a format option.
4. Rich editing needs both handlers. Without an `onTextMarkdown` handler, or when the reverse probe returns `null`, an editable question renders the standard textarea (the "plain state"). Display/read-only modes always render through `onTextMarkdown` (spec §6.4).
5. Answers are untrusted. Handler output for answers always passes through the built-in allow-list before it reaches the DOM, pass-through handlers included (spec §1.2, §6.4, §10).
6. The lossless check for answers first asks the allow-list whether it would remove anything from the handler output, then does the round trip. The allow-list stops reporting `target`/`rel` on links (spec §3.4, §6.4).
7. `richTextConverter` stays. When set, it replaces the answer converter and skips the probe: Creator's property-grid and translation cells live in internal surveys without customer handlers.
8. `RichText.registerFormat` is removed; the plugin has no converter registry. External converters (markdown-it, turndown) are attached as handlers. `RichText.getFormat("markdown" | "html")` stays public and read-only: customers use the allow-list as a sanitizer, and the demo playground inspects the built-in converters. The plugin's functions and ready-made handlers always use the built-in Markdown converter (spec §3.1, §4.1–§4.3).

---

# Part A — survey-library

## 2. survey-core (outside the plugin)

| File | Change |
|---|---|
| `src/question_comment.ts` | Replace `@property() textFormat: string;` (line ~112) with `@property() allowRichText: boolean;`. In `getComponentName` (line ~114) use `if (this.allowRichText)`; keep the comment about the literal `"comment"` type. Replace the serializer entry (line ~214) with `{ name: "allowRichText:boolean", default: false, visible: false }`. |
| `src/survey-events-api.ts` | After `TextMarkdownEvent` (line ~522) add `export interface HtmlToMarkdownEvent extends TextProcessingEvent { html: string; text: string; }`. |
| `src/survey.ts` | Next to `onTextMarkdown` (line ~711) add `public onHtmlToMarkdown: EventBase<SurveyModel, HtmlToMarkdownEvent> = this.addEvent<SurveyModel, HtmlToMarkdownEvent>();` (no `locStrsChanged` callback). Next to `getSurveyMarkdownHtml` (line ~8561) add `getSurveyHtmlToMarkdown(element, html, name): string` that fires the event with `text: null` and returns `options.text`. Add `HtmlToMarkdownEvent` to the import list from `survey-events-api` (line ~81). |
| `src/interfaces/survey-interfaces.ts` | Next to `getSurveyMarkdownHtml` (line ~130) add `getSurveyHtmlToMarkdown(element: Base, html: string, name: string): string;`. |
| Public entry | Check that `HtmlToMarkdownEvent` is exported the same way as `TextMarkdownEvent`. |

Do not write doccomments for the new event, interface or method (`CLAUDE.md`); the documentation team adds them. A `//` comment is fine where the code needs one, e.g. "fired only by the rich text plugin for comment answers".

Check: `git diff master -- packages/survey-core/src` shows changes only in the four files above and in `src/plugins/rich-text/`.

## 3. Plugin (`packages/survey-core/src/plugins/rich-text/`)

### 3.0 `api.ts`
- Remove `RichText.registerFormat` (lines ~44–46). Keep `getFormat`, the `converters` map and `installConverters` (internal, called once from `index.ts`).
- Keep `IRichTextConverter`, `IRichTextConverterContext` and `RichTextFormat` exported: they type `getFormat`, `richTextConverter` and the answer converter.

### 3.1 `runs.ts`
- In `flattenElement`'s attribute report (line ~104–113): for `tag === "a"`, skip `target` and `rel` without reporting them, as is already done for an allowed `href`. Do not keep them in the output; rendering re-adds them.

### 3.2 `edit-mode.ts`
- Add `getAnswerEditMode(question): "inline" | "block"`: `"inline"` when `acceptCarriageReturn === false`, otherwise `richTextEditMode === "inline" ? "inline" : "block"`. This moves the rule out of the React wrapper (`get mode()` in `rich-text-comment.tsx`, line ~47).

### 3.3 `survey-strings.ts`
- `resolveInline`: before the `getStringEditMode` branch, add the answer branch: when `context.name === "value"` and `context.element.isDescendantOf("comment")`, return `getAnswerEditMode(context.element) === "inline"`.
- `htmlToMarkdownHandler` already returns `""` for empty HTML (`options.html || ""`); keep it, because the answer probe relies on it.
- `attachEditor`: remove `format: "markdown"` from the host (line ~54) once `format` leaves `IRichTextEditorHost` (§3.6).

### 3.4 New `answer-format.ts`
Spec §6.4. Exports:

- `createAnswerConverter(question): IRichTextConverter`
  - `toHtml(source, ctx)`: `raw = question.survey.getSurveyMarkdownHtml(question, source, "value", undefined)`. When `raw` is empty, return `escapeHtml(source)` with `\n` → `<br>`. Otherwise return `RichText.getFormat("html").toHtml(raw, ctx)`.
  - `toSource(root, ctx)`: `question.survey.getSurveyHtmlToMarkdown(question, root.innerHTML, "value")`.
  - `checkLossless(source, ctx)`: `true` when `raw` is empty; `false` when `RichText.getFormat("html").getUnsupported(raw)` is not empty; otherwise the round trip on sanitized HTML (`toHtml` → `toSource(createDetachedElement(html))` → `toHtml`, compare). Return `true` when there is no DOM or `toSource` returns `null`.
  - No `lossless` flag.
- `canEditRichAnswer(question): boolean`: `false` when the question is read-only or has no survey; `false` when `(question.survey as SurveyModel).onTextMarkdown.isEmpty` (cast: `ISurvey` has no events; add a `//` comment why); otherwise `question.survey.getSurveyHtmlToMarkdown(question, "", "value") !== null`.
- Both take `richTextConverter` into account through the editor model (§3.6), not here.

### 3.5 `lossless.ts`
- Extract `isConverterLossless(converter, source, context)` from the body of `isLossless` (lines ~12–22); `isLossless(source, format, context)` calls it with `RichText.getFormat(format)`.
- `findUnsupported` (lines ~52–57): replace the `textFormat` branch. For questions where `isDescendantOf("comment")` and `allowRichText` is `true` with a non-empty string value: `converter = question.richTextConverter || createAnswerConverter(question)`; add a hit when `!isConverterLossless(converter, value, { inline: getAnswerEditMode(question) === "inline", element: question, name: "value" })`. The `format` argument no longer applies to answers.

### 3.6 `editor-model.ts`
- `IRichTextEditorHost`: remove `format` (line ~22).
- `get converter()` (line ~237): `host.converter || (host.owner ? createAnswerConverter(host.owner) : RichText.getFormat("markdown"))`. Cache the answer converter per model instance; it is stateless and reads the survey on each call.
- `updateSourceMode` (lines ~344–351): use `isConverterLossless(this.converter, value, this.context)` instead of `RichText.isLossless(value, format, …)`. This also fixes a current bug: the check ignores `host.converter` (`richTextConverter`).
- `context` (line ~241): keep `name: "value"`; `element` is `host.owner`.
- Add `public get canEditRich(): boolean`: `true` when `host.converter` is set, `true` when there is no `host.owner` (format-agnostic mode), otherwise `canEditRichAnswer(host.owner)`.
- `onPaste` in value mode (line ~289) already uses `this.converter`; with the answer converter, paste now goes through the customer's handlers and the sanitizer. No change needed.

### 3.7 `index.ts`
- Replace `Serializer.findProperty("comment", "textFormat").visible = true;` (line ~21) with the same line for `allowRichText`.
- Export `createAnswerConverter` only if a test or Creator needs it; it is not part of the documented API (spec §11.2 item 2).

### 3.8 React wrapper (`packages/survey-react-ui/src/components/rich-text/rich-text-comment.tsx`)
- Host object: remove `get format()` (line ~48); `get mode()` calls `getAnswerEditMode(question)`. Export `getAnswerEditMode` from `survey-core/rich-text` for this, or add `mode` resolution to the model; prefer the second option if it keeps the wrapper smaller.
- `renderElement` (lines ~83–99): after the read-only branch, add `if (!this.editor.canEditRich) return <TextAreaComponent viewModel={question.textAreaModel} />;` before the source-mode branch. `syncHost` already detaches when the host element is gone.
- `renderReadOnly` already uses `editor.getReadOnlyHtml`; with the answer converter it now renders through `onTextMarkdown` and the sanitizer.

## 4. Tests (`packages/survey-core/tests/rich-text/`)

| File | Change |
|---|---|
| `comment-text-format.tests.ts` | Rename to `comment-rich-text.tests.ts` and rename the `describe`. Replace every `textFormat: "markdown"` with `allowRichText: true`; drop the `"html"` cases (lines ~38, ~44, ~48) and the `textFormat = "plain"` toggles (lines ~68, ~112), using `allowRichText = false` instead. Add: the comment question has no `textFormat` property (`Serializer.findProperty("comment", "textFormat")` is null); `getSurveyHtmlToMarkdown` returns `null` without handlers and the handler's text otherwise; the event options carry `element`, `name`, `html`; adding a handler does not call `locStrsChanged`. Remove `format: "markdown"` from the host (line ~138). |
| New `answer-format.tests.ts` | The cases in spec §13.1 (`toHtml` through `onTextMarkdown` with `name: "value"`; empty handler output → escaped text with `<br>`; XSS vectors through a pass-through handler are sanitized; `toSource` through `onHtmlToMarkdown`; `checkLossless` for plain text, table/`style` in handler output, a non-round-tripping pair, the built-in pair with links; `canEditRich` for no survey, no forward handler, no reverse handler, a reverse handler that ignores `"value"`, both built-in handlers, read-only; `richTextConverter` replaces the answer converter and skips the probe). |
| `editor-model.tests.ts` | Add a helper that creates the survey and attaches `RichText.textMarkdownHandler` + `RichText.htmlToMarkdownHandler`. Replace `textFormat: "markdown"` with `allowRichText: true` (lines ~53–424). Remove `format` from the hosts (lines ~27, ~246). Replace the `textFormat` visibility assertion (line ~48) with `allowRichText`. Rewrite the `"html"` cases (lines ~386, ~409) with a raw HTML handler pair: the unsupported default value opens in source mode; typing stores the editor's HTML. Add a `canEditRich === false` case without the reverse handler. |
| `lossless.tests.ts` | Lines ~16–23 ("a lossless converter skips the check…"): replace the `registerFormat` swaps with direct calls to the internal `isConverterLossless` (import from `src/plugins/rich-text/lossless`) on the two inline converters. Line ~32: `allowRichText: true` plus a raw HTML handler pair on the survey; `findUnsupported` still reports `c_unsupported`. Add a case: an answer with Markdown and the built-in pair is not reported. |
| `html-format.tests.ts` | Add: `<a href="https://x" target="_blank" rel="noopener">` → `getUnsupported` is empty and the output keeps only `href` (plus render-time `target`/`rel`). |
| `survey-strings.tests.ts` | Delete the test "a registered markdown converter is used by the string functions and the handler" (lines ~103–119). Its replacement: a customer handler (a fake markdown-it, e.g. `options.html = "<i>" + options.text + "</i>"`) attached instead of `textMarkdownHandler` renders the title, and `RichText.registerFormat` is `undefined`. Add: for `{ element: comment, name: "value" }`, `markdownToHtml` uses block context by default and inline context with `acceptCarriageReturn: false`. |
| Markup etalons (`tests/markup/etalon_rich_text.ts`) | Not created yet (M5); create them with `allowRichText` and the handler setup per etalon (spec §13.2). |

Run `npx vitest run tests/rich-text`, then the full `npm run test` in `packages/survey-core`, plus `npm run lint`. The full suite must pass without changed expectations outside `tests/rich-text/`.

## 5. Demo page (`packages/survey-react-ui/rich-text.js`, `rich-text.html`)

- `demoSurveyJson` (lines ~36–48): replace `"textFormat": …` with `"allowRichText": true` everywhere (keep the JSON identical to spec Appendix A).
- Turn the string handler switch into a **handler switch** of pairs (spec §14.2): `applyStringHandler` (lines ~153–159) removes and adds both `survey.onTextMarkdown` and `survey.onHtmlToMarkdown` handlers.
  - built-in: `textMarkdownHandler` + `htmlToMarkdownHandler`;
  - raw HTML: `options.html = options.text` + `options.text = options.html`;
  - custom: the current `customStringHandler` + `htmlToMarkdownHandler`;
  - in built-in and custom, answers of `c_html` and `c_unsupported` (`options.name === "value"` and the element name) go to the raw HTML pair.
- Add a **reverse handler** checkbox (default on) to `rich-text.html`; unchecking detaches the current `onHtmlToMarkdown` handler. After toggling, re-mount the React survey component (render it again with a new `key`), because rich comments read `canEditRich` on render and v1 does not track handler changes (spec §6.4).
- Attach the default pair before `ReactDOM.render` (already done for the string handler).
- External converter toggle (lines ~176–184): it checks `api.registerFormat` to decide whether the sample exists. Drop that check; until M7 the toggle just shows "The external converter sample is not included yet." In M7 it swaps the current pair for markdown-it/turndown handlers (spec §14.2).
- With `?plugin=off`, hide the switch and the checkbox.

## 6. Verification (CP4R in the spec)

1. `npm run build && npm run build:rich-text` in `packages/survey-core`, then `npm run build && npm start` in `packages/survey-react-ui`, open `/rich-text.html`.
2. Re-check the CP1/CP4 items marked *(re-verify after M4R)* and all CP3/CP4 items with the built-in pair.
3. Run the CP4R checklist: handler "none", reverse checkbox off, the XSS value through the raw HTML pair, a link in `c_md` stays in rich mode.
4. `git grep -n "textFormat\|registerFormat" packages/` finds nothing; in the console `SurveyRichText.RichText.registerFormat` is `undefined`.

---

# Part B — survey-creator (spec §9, §13.6, C1–C5)

Creator work has not started, so nothing needs to be rewritten. These are the differences from the previous version of the spec.

## 7. Changes to implement

| Spec | Change |
|---|---|
| §9.0 setup sample, docs | Add `options.survey.onHtmlToMarkdown.add(RichText.htmlToMarkdownHandler);` next to the `onTextMarkdown` line, so comment answers are rich editors in the preview and theme tabs. Creator does **not** forward `creator.onHtmlToMarkdown` to the surveys it creates. |
| §9.1 | No code. Comment questions with `allowRichText` render formatted on the design surface (design mode is read-only) and are rich editors in the preview/theme tabs when the sample attaches both handlers. |
| §9.4 `PropertyGridEditorText.getJSON` | Emit `allowRichText: true` instead of `textFormat: "markdown"`. `richTextEditMode`, `richTextToolbarVisibility` and the `richTextConverter` assignment are unchanged. |
| §9.4 property grid definition | List `allowRichText` in the comment entry, next to `autoGrow` and `allowResize`. The property is visible only when the plugin is loaded (the plugin sets `visible = true`). |
| §9.5 grid and dialog cells (`onMatrixCellCreated`) | Set `allowRichText = true` instead of `textFormat = "markdown"`. Everything else is unchanged. |
| Localization (`survey-creator-core/src/localization/english.ts`) | Add the display name of the property, e.g. `pe.allowRichText: "Enable rich text formatting"`, and a hint if comment properties have hints there. Other locales follow the usual translation process. |
| §9.2.1 converter | Unchanged. Important: because `richTextConverter` is set, the editor skips the reverse-handler probe (spec §6.1, §6.4). Property-grid and translation cells therefore stay rich even though their internal surveys have no `onHtmlToMarkdown` handler. Verify this with a unit test. |

## 8. Tests and checkpoints

- Unit (§13.6): property-grid editor JSON contains `allowRichText: true`; translation cells get `allowRichText = true`; the comment question's `allowRichText` is listed in the property grid with the plugin and absent without it; a property-grid cell with `richTextConverter` is rich although the property-grid survey has no `onHtmlToMarkdown` handler.
- E2E (§13.6): in the preview tab, a comment question with `allowRichText` is a rich editor and stores Markdown.
- CP-C1 and CP-C3 were updated in the spec (preview tab answers; `allowRichText` in the property grid).

---

## 9. Open questions for the team

1. **Property name.** `allowRichText` follows `allowResize` / `allowClear`. Alternatives: `richText`, `enableRichText`. It goes into customers' JSON, so it must be final before release.
2. **Live handler changes.** In v1, handlers added or removed after a rich comment is rendered take effect on its next render (spec §6.4). Is that enough, or should the rich comment re-render on `survey.locStrsChanged()`?
3. **Creator forwarding.** The spec keeps `creator.onHtmlToMarkdown` (strings) and `survey.onHtmlToMarkdown` (answers) separate, and the customer attaches both. Should Creator instead forward its event to the preview/theme surveys automatically?
4. **Stored answers outside the plugin.** Stored answers are not sanitized (spec §10). Do survey-pdf, Dashboard and the Creator's JSON/preview of results need follow-up tickets to render `allowRichText` answers through `onTextMarkdown` plus `RichText.getFormat("html").toHtml`?
