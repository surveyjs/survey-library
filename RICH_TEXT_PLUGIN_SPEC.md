# Rich Text Editor Plugin — Specification

This document is the single source of truth for building the SurveyJS rich text editor plugin. It goes from general decisions to implementation details. When an implementation detail seems to conflict with a general rule, the general rule wins; report the conflict instead of resolving it silently.

---

## 1. Goals and guiding principles

### 1.1 Goal

Provide a rich text editor that can be used in:

1. **Long Text (`comment`) questions** and every question type that inherits from `comment` (including matrix cells with `cellType: "comment"`).
2. **Survey Creator inline string editing** on the design surface (titles, descriptions, choice texts, etc.).
3. **Survey Creator property grid** editors for long-text properties.
4. **Survey Creator translation tab**: the strings grid, the element strings dialog, and the target pane of the side-by-side view.

### 1.2 Guiding principles (apply to every decision)

- **Minimum code.** Reuse existing survey-core mechanisms (`ActionContainer` + `sv-action-bar`, `RendererFactory`, `settings.showDialog`, `SvgRegistry`, `onTextMarkdown`). Framework-specific code is limited to thin wrappers.
- **No hard dependency on external libraries.** The plugin has zero runtime dependencies. External converters (markdown-it, turndown, DOMPurify, …) can be plugged in by customers through a public interface.
- **Minimum functionality** that survey authors actually need. No tables, images, colors, font sizes, alignment.
- **Opt-in and zero cost when unused.** A survey that does not load the plugin downloads no plugin JS/CSS and behaves exactly as today.
- **Self-describing JSON.** Only properties stored in the survey JSON switch rich text on (`stringFormat` on the survey, `textFormat` on comment questions). Loading the plugin alone never changes how an existing survey renders.
- **Movable into the main bundle.** The feature ships as a plugin first and must be movable into the main `survey-core` bundle later without breaking customer code or JSON (§11.2).
- **Never lose data silently.** Content the editor cannot represent is never opened in the rich editor; it is edited as source.
- **Backward compatibility.** Existing `onTextMarkdown` / Creator `onHtmlToMarkdown` handlers keep working and always take precedence.

---

## 2. Key decisions (summary)

| Topic | Decision |
|---|---|
| Storage format | **Markdown by default**. HTML is supported as an alternative format (built-in allow-list HTML or customer-provided pass-through). Never store both. |
| Converter | Own, built-in Markdown subset converter (both directions) + built-in allow-list HTML format. Replaceable via a public converter interface. |
| Features | Bold, italic, strikethrough, link, bulleted list, numbered list, line breaks/paragraphs, clear formatting. |
| Not supported | Tables, images, headings, colors, font size/family, alignment, underline, nested lists, code, blockquotes. |
| Distribution | Separate entry point of the `survey-core` npm package: `survey-core/rich-text` (ESM + UMD + CSS), same pattern as `survey-core/collaboration`. Designed so it can later move into the main bundle without breaking changes (§11.2). |
| Activation | By survey JSON only: survey property `stringFormat: "plain" \| "markdown" \| "html"` for survey strings (titles, descriptions, …), comment property `textFormat` for answers. Both are declared in core. |
| Source location | `packages/survey-core/src/plugins/rich-text/` + thin wrappers in UI packages. |
| Per-question switch | Serializable `comment` property `textFormat: "plain" \| "markdown" \| "html"` (declared in core, made visible by the plugin). |
| Core ↔ plugin contract | A provider slot `settings.richText` in survey-core, filled by the plugin on import. Creator reads only this slot and never imports the plugin. |

---

## 3. Data model and formats

### 3.1 Formats

- `"plain"` — today's behavior. No rich editing.
- `"markdown"` — default rich format. Stored value is Markdown text from the supported subset (§3.3).
- `"html"` — stored value is HTML. With the built-in converter it is restricted to the allow-list (§3.4). A customer may register a pass-through HTML converter at their own risk (§4.3).

Only the formats `"markdown"` and `"html"` can be registered/overridden. No other format names exist.

### 3.2 Common rendering rules (both formats)

- **Line breaks:** a single newline in Markdown (and `<br>` in HTML) renders as a line break. A blank line (and `<p>` in HTML) separates paragraphs. Rationale: existing plain-text comment answers contain newlines and must not collapse when a question is switched to rich text.
- **Paragraph wrapping:** a single paragraph renders **without** a `<p>` wrapper; two or more paragraphs render as `<p>` elements.
- **Inline context:** when the context is `inline` (see §6.3), block syntax (lists, paragraphs) is not parsed; newlines become `<br>`.
- **Canonical HTML tags** produced by every built-in conversion: `strong`, `em`, `s`, `a`, `ul`, `ol`, `li`, `p`, `br`.
- **Links:** only `http:`, `https:`, `mailto:` URLs are allowed. Any other scheme (e.g. `javascript:`, `data:`, `vbscript:`) is rendered as plain text. Rendered links always get `target="_blank" rel="noopener noreferrer"` (navigating away would lose survey answers). These two attributes are added at render time and are never stored.
- **Plain text detection:** when the source contains no formatting, `toHtml` returns `""` through the provider (§5.2) so callers render the source as plain text (keeps `LocalizableString.hasHtml === false` and today's rendering path).

### 3.3 Built-in Markdown subset

Parsing (input accepted):

- Inline: `**bold**` and `__bold__`; `*italic*` and `_italic_` (underscore emphasis is not allowed inside words, as in CommonMark); `~~strike~~`; `[text](url)`; backslash escapes.
- Block (block context only): paragraphs separated by blank lines; bulleted list items starting with `- `, `* ` or `+ `; numbered list items starting with `N. `. **No nested lists**: indented list items are not treated as nested.
- Everything else (headings, tables, images, code, blockquotes, raw HTML, indented list items) is rendered as **literal, escaped text**. The parser records each such literal fallback; `getUnsupported` (§4.1) returns their kinds (`"heading"`, `"table"`, `"image"`, `"code"`, `"blockquote"`, `"raw-html"`, `"nested-list"`).
- All text is HTML-escaped. Output contains only canonical tags. The converter is XSS-safe by construction.
- Delimiter resolution follows CommonMark for everything the serializer emits. For pathological delimiter runs (overlapping bold/italic boundaries inside one word with no separator) the parser uses a deterministic stack rule: inside a run of `*`, first close open marks from the top of the stack, then open new ones.

Serialization (output written), from the editor DOM:

1. **Flatten** the DOM into runs: `{ text, marks: { bold, italic, strike, link? } }` plus block boundaries (paragraph, line break, list item). Recognize `b/strong`, `i/em`, `s/strike/del`, `a[href]`, `ul/ol/li`, `p/div`, `br`. Unknown elements are unwrapped (text kept). Elements carrying formatting only through `style` are unwrapped (formatting dropped).
2. **Merge** adjacent runs with identical marks.
3. **Move whitespace out** of mark boundaries (`**word **` → `**word** `).
4. **Nesting order:** link is always outermost; among other marks, the mark that ends first is placed inside.
5. Emit `**` for bold, `*` for italic (never `_`, so intraword emphasis works), `~~` for strikethrough, `[text](url)` for links, `- ` for bulleted items, `1. 2. 3.` for numbered items, `\n` for line breaks, `\n\n` between paragraphs/blocks.
6. **Escape** characters that would otherwise be parsed as markup (`\ * _ ~ [ ] ( )`, and line-start markers such as `- `, `+ `, `* `, `N. `, `#`).
7. Empty content serializes to `""`.

Worked example (must be a unit test): source `Please **read** the *terms* carefully`, user selects `ead the ter` and applies bold → `Please **read the** ***ter**ms* carefully`. Applying bold again to the same selection → `Please **r**ead the *terms* carefully`.

### 3.4 Built-in HTML format (allow-list)

- **Input accepted:** the same element set as §3.3 step 1.
- **Unknown elements** are unwrapped, keeping their text. Block-level unknown elements (`div`, `h1`–`h6`, `table`, `tr`, `blockquote`, `pre`, …) become paragraph/line boundaries so text does not run together.
- **Dropped with their content:** `script`, `style`, `iframe`, `object`, `embed`, `template`, `noscript`.
- **Attributes:** all are removed except `a[href]` with an allowed scheme.
- **Output:** canonical tags only. The same run-based serializer as §3.3 writes HTML instead of Markdown.
- `toHtml` runs stored HTML through the same allow-list. This makes it a sanitizer on display.
- The allow-list pass reports everything it removed or unwrapped (element names, attributes such as `style`, disallowed `href` schemes). `getUnsupported` returns these kinds; `checkLossless` returns `true` only when the report is empty. Renaming to canonical tags (`b` → `strong`) is not reported.
- **No DOM available (SSR):** `toHtml` returns `""`, so callers render the source as escaped plain text.

---

## 4. Public API of the plugin

### 4.1 Converter interface

```ts
export interface IRichTextConverterContext {
  inline: boolean;      // true: no block syntax, no <p> wrapper
  element?: Base;       // owner of the text (question, panel, page, survey, item)
  name?: string;        // property name: "title", "description", "value", ...
}

export interface IRichTextConverter {
  toHtml(source: string, context: IRichTextConverterContext): string;
  toSource(root: HTMLElement, context: IRichTextConverterContext): string;
  lossless?: boolean;   // true: skip the round-trip check (pass-through converters)
  checkLossless?(source: string, context: IRichTextConverterContext): boolean; // replaces the semantic round-trip check
  getUnsupported?(source: string): string[]; // kinds of constructs the converter cannot represent
}
```

Converters must be synchronous. The built-in Markdown converter implements `getUnsupported` (§3.3). The built-in HTML converter implements `getUnsupported` and `checkLossless` (§3.4); `checkLossless` is required there because its `toHtml` already drops unsupported content, so a round trip of its output cannot detect the loss.

### 4.2 `RichText` facade (exported from `survey-core/rich-text`)

```ts
RichText.registerFormat(format: "markdown" | "html", converter: IRichTextConverter): void;
RichText.getFormat(format: "markdown" | "html"): IRichTextConverter;   // built-in or registered
RichText.defaultFormat: "markdown" | "html";                            // default: "markdown"
RichText.getEditMode: (owner: Base, name: string, locStr: LocalizableString,
                       defaultMode: RichTextEditMode) => RichTextEditMode; // default: returns defaultMode
RichText.isLossless(source: string, format: "markdown" | "html", context: IRichTextConverterContext): boolean;
RichText.findUnsupported(survey: SurveyModel, format?: "markdown" | "html"): Array<{ element: Base, name: string, locale: string, text: string }>;
setRichTextStrings(patch: { [key: string]: string }): void;
```

- Survey strings use the survey's `stringFormat` (§5.5); a `comment` question uses its own `textFormat`. `defaultFormat` is only the value Survey Creator assigns to `stringFormat` of new surveys (§9.1).
- `findUnsupported` checks survey strings against `format`, which defaults to the survey's `stringFormat`, or to `defaultFormat` when the survey is `"plain"` (to check a survey before switching it on).
- Composition example (documented): `{ toHtml: markdownIt-based, toSource: RichText.getFormat("markdown").toSource }`. There is no implicit per-method fallback.
- Also export `RichTextEditorModel` and all public types.

### 4.3 Converter contract (documented, not enforced)

1. `toHtml` must return safe HTML. With raw-HTML-capable libraries, sanitize inside `toHtml` (e.g. DOMPurify).
2. `toSource` must convert back everything `toHtml` produces, otherwise content is lost on save (the round-trip check, §7.4, will route such content to source mode).
3. Follow the line-break semantics of §3.2 (markdown-it: `breaks: true`; turndown: `emDelimiter: "*"`).
4. Round-trips should be stable.

### 4.4 Edit modes (toolbar profiles)

```ts
type RichTextEditMode = "none" | "inline" | "block";
```

- `none`: the plain (existing) editor.
- `inline`: bold, italic, strikethrough, link, clear formatting.
- `block`: `inline` plus bulleted list and numbered list.
- The **bold** button is hidden automatically when the computed `font-weight` of the editable element is ≥ 600 at attach time. This covers titles and other strings the theme renders bold; `execCommand("bold")` would otherwise produce an un-bold `<span style>` that the serializer drops.

---

## 5. survey-core changes (outside the plugin)

All changes are small, generic, and do not reference the plugin.

### 5.1 Provider slot

Add `settings.richText: IRichTextProvider | undefined` (default `undefined`) and the types below, in a new core file (e.g. `src/rich-text-provider.ts`), exported from `entries/index.ts`:

```ts
export type RichTextEditMode = "none" | "inline" | "block";
export interface IRichTextContext { element?: Base; name?: string; item?: any; format?: "markdown" | "html"; inline?: boolean; }
export interface IRichTextEditorOptions { mode: RichTextEditMode; format: "markdown" | "html"; onChange?: (source: string) => void; }
export interface IRichTextEditorHandle { toolbar: ActionContainer; getSource(): string; detach(): void; }
export interface IRichTextProvider {
  readonly defaultFormat: "markdown" | "html";                             // mirrors RichText.defaultFormat; Creator uses it for new surveys
  toHtml(source: string, context: IRichTextContext): string;               // "" when there is no formatting
  toSource(root: HTMLElement, context: IRichTextContext): string;
  getEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode;
  isLossless(source: string, context: IRichTextContext): boolean;
  attachEditor(element: HTMLElement, options: IRichTextEditorOptions): IRichTextEditorHandle;
}
```

When `context.format` is omitted, the provider uses the `stringFormat` of the element's survey (`element.getSurvey()`, or the element itself when it is a `SurveyModel`); with `"plain"` or no survey, `toHtml` returns `""`. When `context.inline` is omitted, the provider derives it from `getEditMode` (`"block"` → `false`, otherwise `true`).

### 5.2 Default rendering for survey strings

In `SurveyModel.getSurveyMarkdownHtml()`, pre-fill `options.html` with `settings.richText.toHtml(text, { element, name, item, format: this.stringFormat })` when a provider exists and `this.stringFormat !== "plain"`, otherwise with `null`, **before** firing `onTextMarkdown`. Consequences (all must be covered by tests):

| Setup | Result |
|---|---|
| No plugin, no handler | Unchanged (plain text) |
| No plugin, existing handler | Unchanged |
| Plugin, `stringFormat: "plain"` (any handler) | Unchanged |
| Plugin, no handler | Plugin renders |
| Plugin + handler that assigns `options.html` | Handler wins |
| Plugin + conditional handler | Handler covers its strings; plugin covers the rest |
| Handler reads `options.html` | Can post-process the plugin output |

Rows from "Plugin, no handler" down assume a survey with `stringFormat` other than `"plain"`. Only strings with `useMarkdown === true` reach this path (unchanged core behavior).

### 5.3 `comment` question: `textFormat`

In `question_comment.ts`:

- `@property() textFormat: string;` and serializer entry `{ name: "textFormat", default: "plain", choices: ["plain", "markdown", "html"], visible: false }`.
- Override `getComponentName()`: if `textFormat !== "plain"`, return `RendererFactory.Instance.getRenderer("comment", "richtext")` when it is not `"default"`; otherwise call `super.getComponentName()`. Use the literal `"comment"` type (not `getType()`) so inheriting question types are covered. The check runs before the view-mode fallback so the plugin's component also renders display/read-only mode.
- Without the plugin: the renderer is not registered → the default textarea shows the source; `textFormat` remains in JSON.

Same precedent: `QuestionBooleanModel.getComponentName()`.

### 5.4 Library in-place string editor fix

`SurveyLocStringEditor` (`LocalizableString.editableRenderer`, in React/Vue3/Angular) currently saves `innerText` on blur, which destroys formatting when the string renders as HTML. When `locStr.hasHtml`, `settings.richText` is set and the survey's `stringFormat` is not `"plain"`, save `settings.richText.toSource(element, { element: owner, name })` instead.

### 5.5 Survey: `stringFormat`

In `survey.ts`:

- `@property() stringFormat: string;` and serializer entry `{ name: "stringFormat", default: "plain", choices: ["plain", "markdown", "html"], visible: false }`.
- Changing the value calls `locStrsChanged()` so strings re-render, and invalidates cached HTML of localizable strings.
- Without the plugin, the value is kept in JSON and ignored (§5.2 pre-fills `null`).
- The name is distinct from the comment's `textFormat` on purpose: `stringFormat` governs survey strings, `textFormat` governs a comment's answer.

---

## 6. Plugin architecture (survey-core/rich-text)

### 6.1 What happens on import

1. Set `settings.richText` to the plugin's provider.
2. Make `textFormat` and `stringFormat` visible: `Serializer.findProperty("comment", "textFormat").visible = true`, `Serializer.findProperty("survey", "stringFormat").visible = true`.
3. Add a non-serializable, invisible property on `comment`: `{ name: "richTextEditMode", default: "block", choices: ["inline", "block"], visible: false, isSerializable: false }`. Used by Creator (§9.4, §9.5). The effective mode of a comment editor is `"inline"` when `acceptCarriageReturn === false`, otherwise `richTextEditMode`.
   Also add `{ name: "richTextToolbarVisibility", default: "always", choices: ["always", "onFocus"], visible: false, isSerializable: false }` (§7.2). Used by Creator for dense layouts (property grid, translation tab).
4. Register the renderer: `RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment")`.
5. Register icons via `SvgRegistry.registerIcons(...)`.
6. Call `checkLibraryVersion(Version, "survey-core-rich-text")`.

### 6.2 Default edit mode resolution (`provider.getEditMode`)

```ts
function getDefaultEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode {
  if (!locStr || !locStr.useMarkdown) return "none";
  if (getStringFormat(owner) === "plain") return "none"; // owner's survey; "plain" when there is no survey
  if (Serializer.findProperty(owner.getType?.(), name)?.type === "html") return "none";
  return blockProperties.indexOf(name) > -1 ? "block" : "inline";
}
const blockProperties = ["description"];
```

The result is passed to `RichText.getEditMode(owner, name, locStr, defaultMode)` (customer override).

### 6.3 Rendering context

- Survey strings: `inline` = edit mode is not `"block"`.
- Comment answers: `inline` = effective comment edit mode is `"inline"`.

### 6.4 Comment answers rendering

Comment answers never go through `onTextMarkdown` (existing handlers often strip `<p>` with `substring`, which would corrupt multi-paragraph answers). They are rendered with `RichText.getFormat(question.textFormat).toHtml`.

### 6.5 Strings and localization

- `src/plugins/rich-text/rich-text-strings.ts`, same pattern as `collaboration-strings.ts` (own English strings + `setRichTextStrings`).
- Keys: `richTextToolbar` "Formatting", `richTextBold` "Bold", `richTextItalic` "Italic", `richTextStrikethrough` "Strikethrough", `richTextLink` "Link", `richTextBulletedList` "Bulleted list", `richTextNumberedList` "Numbered list", `richTextClearFormatting` "Clear formatting", `richTextLinkUrl` "URL", `richTextLinkInvalid` "Enter a link that starts with http://, https://, or mailto:", `richTextSourceMode` "This text contains formatting the editor cannot change. You are editing its source.", `richTextEditAnyway` "Edit as rich text (unsupported formatting will be removed)".

---

## 7. Editor behavior (`RichTextEditorModel`)

The model is framework-agnostic and attaches to any `contenteditable` element (`attach(element)` / `detach()`). It is used by the comment question wrappers and, through `provider.attachEditor`, by Survey Creator.

### 7.1 Editing engine

- `contenteditable` + `document.execCommand` for: `bold`, `italic`, `strikeThrough`, `createLink`, `unlink`, `insertUnorderedList`, `insertOrderedList`, `removeFormat`, `insertText`, `insertHTML`. Set `styleWithCSS` to `false`.
- `execCommand` is accessed through a small injectable command adapter so unit tests can mock it (jsdom does not implement `execCommand`).
- Browser markup differences never reach stored data: only serializer output is stored.

### 7.2 Toolbar and commands

- Toolbar = `ActionContainer` rendered by the existing `sv-action-bar` (compact size), placed **above** the editing area and **before** it in tab order.
- Toolbar visibility (comment question, `richTextToolbarVisibility`): `"always"` — the toolbar is part of the layout. `"onFocus"` — the toolbar is a floating overlay above the editing area, shown while focus is within the editor, its toolbar or its link dialog; it never changes the layout (no row height changes in grids). The Creator inline string editor always uses the floating variant (§9.2).
- Clicking a toolbar button must not lose the selection: the model saves the selection `Range` on every `selectionchange` inside the element and restores it (and focus) before executing a command.
- Toggle state is computed by the model (not `queryCommandState`): walk text nodes in the selection → `all` / `none` / `mixed`. A button is pressed (`aria-pressed="true"`) only for `all`. Command semantics: `all` → remove; `none`/`mixed` → apply to the whole selection.
- Collapsed selection: the command sets the typing style for subsequent input (native behavior); the button reflects it.
- Keyboard: Ctrl/Cmd+B and Ctrl/Cmd+I run the same model actions (respecting button visibility); Ctrl/Cmd+U is blocked.
- **Link:** opens a dialog through `settings.showDialog` with `componentName: "survey"` and a small `SurveyModel` containing one text question (`url`), same approach as `showRecordsSortDialog`. Validation: allowed schemes only (`richTextLinkInvalid`). Empty URL removes the link. With a collapsed selection, the URL text is inserted as the link text. If `settings.showDialog` is not set, the link action is hidden.
- **Clear formatting:** removes bold/italic/strike/link from the selection and converts list items in the selection to paragraphs.

### 7.3 Keys

- Comment question, `block` mode: Enter → new paragraph; Shift+Enter → line break; Enter inside a list item → new item; Enter in an empty list item → leaves the list.
- `inline` mode: Enter is blocked when `acceptCarriageReturn === false` (existing auto-advance behavior via `isAutoAdvanceEnter` is preserved); otherwise Enter inserts a line break.
- Tab is never captured (it moves focus).

### 7.4 Value flow

- **Lossless check** (`isLossless`):

  ```ts
  if (converter.lossless) return true;
  if (converter.checkLossless) return converter.checkLossless(src, ctx);
  const html = converter.toHtml(src, ctx);
  return converter.toHtml(converter.toSource(createDetachedElement(html), ctx), ctx) === html;
  ```

  "Lossless" is defined relative to the active converter's rendering. With the built-in Markdown converter, unsupported syntax is literal text, so it is lossless and editable as text in the rich editor. Source mode is reached with lossy external converters and with the built-in HTML format when the allow-list removes something. Returns `true` when no DOM is available. Cached per value; re-evaluated when the value changes from outside and when an editing session starts.
- **Rich mode** (lossless): editor content is set from `toHtml(value)`.
- **Source mode** (not lossless): the standard textarea is shown with the source, plus the `richTextSourceMode` notice and an `richTextEditAnyway` action that switches to rich mode for this session without the check.
- **Committing:** on blur always; additionally on `input` (debounced) when `question.isInputTextUpdate` is true. Only real `input` events serialize; focusing and leaving without changes never rewrites the value.
- **External value changes** (`setValue`, expressions, collaboration): re-render the element only if the new value differs from the last serialized value. If the element is focused, defer the re-render until blur.
- **Paste:** always intercepted. `text/html` → `toSource` of a detached fragment → `toHtml` → `insertHTML` (normalizes everything to the format; pass-through converters keep what they keep). `text/plain` → `insertText`.
- **Undo/redo:** native (provided by `execCommand`).

### 7.5 Comment question integration details

- `placeholder`: rendered via `data-placeholder` + CSS `:empty::before`; the model keeps the element truly empty (removes a lone `<br>`).
- `rows` → minimum height; `autoGrow` → grows with content, otherwise fixed height with scroll; `allowResize` → CSS vertical resize.
- `maxLength` counts **stored source** characters. The character counter shows remaining source characters. Typing/paste is blocked (`beforeinput`) when the limit is reached. A formatting command whose result exceeds the limit is reverted (`undo`).
- Read-only, disabled, display mode and design mode (Creator surface): render `toHtml(value)` in a non-editable element with the existing view-mode CSS class; no toolbar. Empty value renders like today.
- Accessibility: editing element `role="textbox"`, `aria-multiline="true"` in block mode, and `aria-label`/`aria-labelledby`/`aria-describedby`/`aria-required`/`aria-invalid`/`aria-errormessage` from the question's `a11y_input_*` properties (same sources as `TextAreaModel`). Toolbar: `role="toolbar"`, `aria-label` = `richTextToolbar`, `aria-controls` = editing element id.
- Out of scope: the comment area under choice questions (`commentTextAreaModel`, "Other"), a survey-level default for `textFormat` (the survey's `stringFormat` does not affect answers).

---

## 8. UI framework wrappers (survey-library)

One component, registered as `sv-rich-text-comment`, in each UI package:

- React: `packages/survey-react-ui/src/components/rich-text/` (registered in `ReactQuestionFactory`). **survey-js-ui** reuses React sources through Preact; ensure the component is included in its bundle.
- Vue 3: `packages/survey-vue3-ui/src/components/rich-text/`.
- Angular: `packages/survey-angular-ui/src/components/rich-text/` (registered in the Angular component factory).

Wrapper responsibilities only:

1. Render the toolbar via `sv-action-bar` with the model's `toolbar`.
2. Render the editing host element (`div`, `contenteditable`) whose **content is not managed by the framework**; call `model.attach(el)` after mount and `model.detach()` before unmount.
3. Render source mode by reusing the existing `TextAreaComponent` plus the notice/action.
4. Render read-only/display mode as non-editable HTML.

No business logic in wrappers. Target size: ~30–40 lines per framework.

---

## 9. Survey Creator integration (survey-creator repository)

Creator never imports the plugin; it reads `settings.richText` from survey-core. Without the plugin, Creator behaves exactly as today.

### 9.1 Rendering in Creator surveys and enabling rich text

- Rendering follows each survey's `stringFormat` (§5.2); no `onSurveyInstanceCreated` wiring is needed. Surveys built from the edited JSON (`designer-tab`, `preview-tab`, `theme-tab`, `translation-tab:source-survey`, `translation-tab:target-survey`, `matrix-cell-question-popup-editor`) inherit the value. Internal UI surveys (property grid, dialogs, translation grid) are created without it, so they keep today's rendering and need no opt-out code. The existing property-grid `description` handler (property hints) keeps working.
- **New surveys:** when `settings.richText` exists and Creator starts a new survey (empty JSON, including "New survey"), it sets `stringFormat = settings.richText.defaultFormat`. Loaded JSON is never changed.
- **Existing surveys:** the survey property grid shows `stringFormat` (made visible by the plugin, §6.1), so authors switch it on or off. Switching re-renders the design surface; the stored strings are not changed.
- When the survey's `stringFormat` is `"plain"`, every Creator editor behaves exactly as today, including the `checkMarkdownToTextConversion` probe and existing `onTextMarkdown` / `onHtmlToMarkdown` handlers.

### 9.2 Inline string editor (`StringEditorViewModelBase`, `survey-creator-core/src/components/string-editor.ts`)

- Mode resolution in `setLocString`: `settings.richText.getEditMode(owner, name, locStr)`, forced to `"none"` for in-place choice value editing (`isInplaceForEditValues`). Translation-surface strings are not excluded: `isInplaceForEditValues` is already `false` for them, so their choice texts get the rich editor (§9.5). This replaces the one-off `checkMarkdownToTextConversion` probe when a provider exists and the survey's `stringFormat` is not `"plain"`; otherwise the probe behaves as today.
- On focus in `"inline"`/`"block"` mode: run `isLossless`; if lossless → `settings.richText.attachEditor(element, { mode, format: <survey's stringFormat> })` and show its toolbar (floating above the editor); otherwise use the existing `editAsText` path (source). Detach on blur.
- Saving (`getClearedText`): pre-fill `options.text` with `settings.richText.toSource(...)` before firing `onHtmlToMarkdown`, so existing user handlers still override.
- `checkConstraints`: allow Ctrl+B/Ctrl+I in rich mode (routed to the editor); keep blocking Ctrl+Z/Ctrl+Y (Creator undo works per committed value; Escape restores the value from before the edit).
- Enter: commits (unchanged), except inside a list item in `block` mode (new item / leave list).

### 9.3 Creator UI packages (React incl. creator-js via Preact, Angular, Vue)

- Bind `onInput`, `onPaste`, `onBeforeInput` also on the HTML-mode element.
- Add a toolbar slot rendered via `sv-action-bar`.
- Use a `div` instead of a `span` as the editable element for `block` mode.

### 9.4 Property grid (`survey-creator-core/src/property-grid/index.ts`)

`PropertyGridEditorText.getJSON` adds, when `settings.richText` exists and the edit mode is not `"none"` (so the edited object's survey has a rich `stringFormat`, §6.2): `textFormat: <that survey's stringFormat>`, `richTextEditMode: <mode>` and `richTextToolbarVisibility: "onFocus"`. `html`-type properties (`PropertyGridEditorHtml`) are unchanged.

### 9.5 Translation tab (`survey-creator-core/src/components/tabs/translation-base.ts`, `translation-side-by-side.ts`)

The translation tab edits strings in three places. All of them already write through a single path (`getProcessedTranslationItemText` → `setItemLocText` / `performItemLocTextAction`), and the stored value stays the source text (Markdown or HTML), so no change is needed in the write path, CSV import/export or machine translation.

1. **Strings grid** (`createStringsSurvey`, area `translation-tab:table`): each string is a `matrixdropdown` row with one `comment` cell per locale, configured in `onMatrixCellCreated`.
2. **Element strings dialog** (`createStringsMatrix` / `onMatrixCellCreated` in the side-by-side model): the same `comment` cells, scoped to one element.
3. **Side-by-side panes**: the target pane (`translation_target`) uses Creator's inline string editor (`editableStringRendererName`) on a copy of each string; the source pane (`translation_source`) is read-only (no string renderer) and renders formatted HTML.

Changes:

- **Grid and dialog cells** (both `onMatrixCellCreated` handlers): resolve the mode with `settings.richText.getEditMode(item.context, item.locString.name, item.locString)`; it is `"none"` for multi-value strings (`locString.getIsMultiple()`), for strings without `useMarkdown`, and when the edited survey's `stringFormat` is `"plain"`. When it is not `"none"`, set on the cell question: `textFormat = <edited survey's stringFormat>`, `richTextEditMode = <mode>`, `richTextToolbarVisibility = "onFocus"`. The existing `acceptCarriageReturn`, `rows`, `maxLength` (counts source characters, §7.5) and `autoGrow` settings stay as they are.
- **Placeholders** of rich cells (`setPlaceHolder`, `item.getPlaceholder`) show the source-locale text, which may contain markup. For rich cells, pass the plain text instead: the `textContent` of `settings.richText.toHtml(...)`, or the source itself when that returns `""`.
- **Target pane:** covered by §9.2 (no translation-surface exclusion). The toolbar is floating, so the row equalizer (`translation-row-equalizer.ts`) is unaffected.
- **Read-only translation** (`translation.readOnly`): cells render formatted, non-editable HTML (§7.5).
- **Unsupported content** in a cell (e.g. raw HTML with `stringFormat: "html"`) opens in source mode (§7.4), the same as in the comment question.
- **Machine translation** sends and receives the stored source unchanged. A service may return damaged markup; the built-in Markdown converter then shows it as literal text, and the HTML format routes it to source mode. Translators fix it in the cell. Markup-aware machine translation is out of scope for v1.

---

## 10. Security requirements

- Built-in converters are XSS-safe by construction (escaping + allow-list). Must be proven by unit tests with known XSS vectors (script tags, event-handler attributes, `javascript:`/`data:` links, quote breaking in `href`, entity tricks).
- Sanitization happens **at display time** (`toHtml`), never only at save time: respondents can submit arbitrary values without using the editor.
- Piped values (`{name}`) are inserted by `textPreProcessor` without HTML escaping before conversion. Built-in Markdown escapes them; the built-in HTML format sanitizes them; pass-through converters must sanitize. This is documented.
- Documentation must state the customer risks of pass-through HTML: stored XSS, piped values, tags in exports/PDF/analytics, one-way format migration, theme mismatch.

---

## 11. Compatibility requirements

### 11.1 Existing behavior

- No plugin loaded → no behavior change anywhere (library and Creator).
- Plugin loaded, survey `stringFormat: "plain"` (every existing survey) → survey strings render and are edited exactly as before; only comment questions with a rich `textFormat` change.
- `onTextMarkdown` handlers keep precedence (§5.2). Recommended migration: move an existing markdown-it handler into `RichText.registerFormat("markdown", …)` so the editor and the read-only view render identically.
- Creator `onHtmlToMarkdown` handlers keep precedence (§9.2).
- `textFormat` and `stringFormat` survive loading/saving in environments without the plugin.
- `RichText.findUnsupported(survey, format?)` lets customers find strings/answers that will render differently with the active converter (e.g. raw `<br>` inside Markdown, which the built-in converter shows literally) before switching `stringFormat` on. It checks every `useMarkdown` string in every locale, and comment values that have a rich `textFormat`. It uses `getUnsupported` when the converter implements it, otherwise `!isLossless`.

### 11.2 Forward compatibility: a possible move into the main bundle

The feature ships as a plugin first. After one or two minor releases it may move into the main `survey-core` bundle; signals for the move are noticeable adoption, support requests about Markdown shown as raw text in runners that do not load the plugin, the measured bundle size within the §12 target, and an API that did not change since the first release. The plugin must be built so that this move needs **no change in customer code or JSON**:

1. **JSON is the only switch.** Rendering and editing are turned on only by `stringFormat` (§5.5) and `textFormat` (§5.3), both declared in core. Importing the plugin alone never changes an existing survey (§11.1). After the move, the same JSON renders identically with no import.
2. **Small public surface.** Documented API is limited to the `RichText` facade and its types (§4), the converter interface (§4.1), the JSON properties `stringFormat` and `textFormat`, and the CSS classes and CSS variables introduced by `rich-text.scss`. `settings.richText`, `IRichTextProvider` and the related core types (§5.1), and the non-serializable properties `richTextEditMode` and `richTextToolbarVisibility` (§6.1) are exported for Survey Creator only and stay out of the documentation. Creator ships with the same survey-core version, so these may change during the move.
3. **Entry points stay.** After the move, `survey-core/rich-text` (ESM, UMD with the `SurveyRichText` global) remains as a thin alias that re-exports `RichText` from the main bundle, and `rich-text.css` remains as a file (possibly empty), so existing imports and `<link>` tags keep working.
4. **One package, one version.** The plugin is an entry of the `survey-core` npm package, not a separate package, so customers' dependencies do not change.
5. **Stable string keys.** The `richText*` keys (§6.5) keep their names. After the move they live in `english.ts` and the regular translations; `setRichTextStrings` keeps working.
6. **Isolated code.** Plugin code uses core only through the core API and the §5.1 slot; core never imports from `src/plugins/rich-text/`. All import side effects are listed in §6.1, so the move consists of relocating the folder and running the §6.1 registration from the core entry.
7. **Acceptance test for the move.** The plugin's unit, markup, e2e, screenshot and a11y suites (§13.1–§13.5) pass unchanged after the move, except for import paths.

---

## 12. Repository layout and build

```
packages/survey-core/
  entries/rich-text.ts                       # public surface, version check
  rollup.rich-text.config.mjs                # copy of the collaboration config pattern
  tsconfig.rich-text.json
  src/rich-text-provider.ts                  # core types + settings slot (§5.1)
  src/plugins/rich-text/
    index.ts                                 # RichText facade, import side effects (§6.1)
    provider.ts                              # IRichTextProvider implementation
    markdown.ts                              # Markdown parser + serializer
    html-format.ts                           # allow-list HTML format
    runs.ts                                  # DOM → runs flattening, shared by both formats
    lossless.ts                              # isLossless, findUnsupported
    editor-model.ts                          # RichTextEditorModel, command adapter
    toolbar.ts                               # ActionContainer setup
    link-dialog.ts                           # settings.showDialog + SurveyModel
    rich-text-strings.ts
    icons/                                   # toolbar SVG icons
  src/default-theme/rich-text.scss           # uses existing theme CSS variables only
  tests/rich-text/                           # unit tests (§13.1)
packages/survey-react-ui/rich-text.html, rich-text.js     # demo harness (§14.2), dev-only
packages/survey-js-ui/rich-text.html, rich-text.js        # demo harness, dev-only
packages/survey-vue3-ui/example/...                       # "/rich-text" route, dev-only
packages/survey-angular-ui/example/...                    # "rich-text" route, dev-only
```

- Build: `npm run build:rich-text` (ESM `build/fesm/rich-text/index.mjs`, UMD `build/rich-text/index.js` with global `SurveyRichText`, `build/rich-text.css` + minified variants, typings stub for classic module resolution as in the collaboration config). Add `build:rich-text` to `build:all`. `survey-core` is external.
- Requires a prior `npm run build` (same as collaboration).
- No runtime dependencies.
- Target bundle size: ≤ 30 KB minified (JS), excluding CSS.
- Conventions (see `CLAUDE.md`): no API doccomments; comments only for constraints the code cannot express; ESLint with zero warnings; Conventional Commits.

---

## 13. Testing

All test suites below are required deliverables.

### 13.1 Unit tests — survey-core (Vitest, `packages/survey-core/tests/rich-text/`)

- **markdown.tests.ts:** subset parsing; escaping; line-break and paragraph rules; single-paragraph unwrapping; inline vs block context; unsupported syntax as literal text; link scheme allow-list; `target`/`rel` on render; plain text → `""` through the provider.
- **serializer.tests.ts:** DOM-shape normalization (`b`/`strong`, `i`/`em`, `div`/`p`, duplicated nested tags, `span[style]` unwrapped); whitespace movement; overlapping marks including the worked example in §3.3; intraword emphasis; link outermost; lists; escaping of special characters and line-start markers; empty content.
- **roundtrip.tests.ts:** corpus + deterministic generated run sequences; `toSource(toHtml(x))` stability; parse(serialize(runs)) equals runs.
- **html-format.tests.ts:** allow-list; unknown elements unwrapped with text kept; block elements → boundaries; dropped elements with content; attribute stripping; `href` schemes; canonical output; XSS vectors; SSR (no DOM) returns `""`.
- **lossless.tests.ts:** equivalent Markdown syntax variants are lossless; tables are lossy with a lossy external converter; literal tables are lossless with the built-in Markdown converter but reported by its `getUnsupported`; built-in HTML: content with removed elements/attributes is not lossless, canonical renaming is; `lossless: true` converters skip the check; `checkLossless` takes precedence over the round trip; `findUnsupported`.
- **provider.tests.ts:** the full precedence matrix of §5.2, including `stringFormat: "plain"` with the plugin loaded; `useMarkdown === false` strings untouched; HTML cache invalidation on handler add and on `stringFormat` change; `stringFormat: "html"` rendering; `findUnsupported` with and without the `format` argument.
- **comment-text-format.tests.ts** (core, with and without the plugin): `textFormat` default not serialized, non-default value survives a load/save round trip; `getComponentName` for comment, an inheriting class, a matrix cell with `cellType: "comment"`, display mode; renderer fallback without plugin; `textFormat` and `stringFormat` visibility toggled by plugin; survey `stringFormat` default not serialized, non-default value survives a load/save round trip with and without the plugin; `richTextEditMode` not serialized.
- **edit-mode.tests.ts:** default modes (description → block, title → inline, non-markdown → none, `html` type → none, survey with `stringFormat: "plain"` → none, owner without a survey → none); `RichText.getEditMode` override; bold-hiding rule (computed `font-weight`).
- **editor-model.tests.ts** (mocked command adapter): toggle state `all`/`none`/`mixed`; selection save/restore; command dispatch for buttons and shortcuts; Ctrl+U blocked; commit on blur and debounced input per `isInputTextUpdate`; no write on focus/blur without input; external value update and deferral while focused; paste normalization; source mode and "edit anyway"; `maxLength` blocking and command revert; placeholder emptiness; link dialog model validation and empty-URL unlink.

### 13.2 Markup tests — UI packages

- Shared etalons in `tests/markup/etalon_rich_text.ts` with snapshots in `tests/markup/snapshots/`: rich comment (edit, with placeholder), read-only, display mode, disabled, source mode with notice, `html` format, inline mode (`acceptCarriageReturn: false`).
- The markup runners of React, Vue 3, Angular and survey-js-ui must import the plugin for these etalons.
- Framework unit tests (where the package has them): attach/detach lifecycle; framework re-renders do not overwrite the editing element's content.

### 13.3 E2E tests — Playwright (`e2e/questions/richtext.spec.ts`, run for every framework)

Each package's test page/example app must load the `rich-text` bundle and CSS.

- Type text; apply bold/italic/strikethrough via toolbar and via Ctrl/Cmd+B/I; assert stored Markdown via `survey.data`.
- Mixed-selection toggle (worked example of §3.3).
- Bulleted/numbered lists via toolbar; Enter creates an item; Enter on an empty item leaves the list.
- Enter (paragraph) and Shift+Enter (line break).
- Link dialog: add, edit, remove; invalid scheme rejected.
- Paste rich HTML (styles, table) → normalized result.
- Undo with Ctrl/Cmd+Z.
- `textUpdateMode` `onTyping` vs `onBlur`.
- External `setValue` updates the editor; deferred while focused.
- Display/read-only mode renders HTML; links open with `target="_blank"`.
- Unsupported stored content → source mode; "edit anyway" switches to rich mode.
- `textFormat: "html"` question stores allow-list HTML.
- `maxLength` blocks typing.
- `acceptCarriageReturn: false` (inline mode, Enter blocked).
- Matrix cell with `cellType: "comment"` and `textFormat`.
- Survey strings: Markdown titles/descriptions render with the plugin and `stringFormat: "markdown"`; with `stringFormat: "plain"` they render as without the plugin; plain strings render unchanged; existing `onTextMarkdown` handler wins.
- Keyboard: Tab reaches toolbar then editing area; toolbar buttons operable by keyboard.

### 13.4 Screenshot tests — Playwright VRT (`screenshots/richtext.spec.ts`)

Default empty state with placeholder; focused editor with toolbar; pressed button states; formatted content (bold/italic/strike/link/lists/paragraphs); read-only/display mode; disabled; source mode with notice; link dialog; mobile width; a dark theme; inline mode (bold hidden when the host is bold).

### 13.5 Accessibility tests — axe (`accessibilityTests/richtext.spec.ts`)

Edit mode with toolbar, read-only mode, source mode, open link dialog.

### 13.6 Survey Creator tests (survey-creator repository)

- Unit (`survey-creator-core/tests`): string editor mode resolution (none/inline/block, in-place values, translation surface); lossless/source fallback; `toSource` pre-fill and `onHtmlToMarkdown` precedence; Ctrl+B/I allowed only in rich mode; §9.1 (new surveys get `stringFormat = defaultFormat`, loaded JSON is not changed, internal UI surveys do not render Markdown, a `"plain"` survey keeps today's editors and probe); property grid editor JSON (`textFormat`, `richTextEditMode`, `richTextToolbarVisibility`, `html` type untouched); translation tab: grid and dialog cell setup (rich for Markdown strings, plain for multi-value and non-Markdown strings), plain-text placeholders, the target-pane string editor gets the rich mode, edits written through `setItemLocText` store the source unchanged, CSV export/import round trip of formatted strings; behavior without the plugin unchanged.
- E2E: format a question title (inline, bold hidden) and a description (block, lists) on the design surface; Escape restores; Enter commits; property grid rich editor edits title/description and syncs with the surface; preview tab renders formatting; translation tab: format a translation in a grid cell, in the element strings dialog and in the side-by-side target pane, and verify the stored locale text and the designer rendering in that locale.
- Screenshots: floating toolbar over a title and over a description; property grid rich editor; translation grid with a focused rich cell and with formatted read-only cells; side-by-side panes with formatted strings.

---

## 14. Execution plan and checkpoints

### 14.1 Rules

- Work is split into milestones. Each milestone ends with a **checkpoint (CP)**: a state that a person can open in a browser and verify by hand using the checklist below.
- Before a checkpoint is presented, the milestone's automated tests and `npm run lint` must be green. A checkpoint is passed when every checklist item shows the expected result; a failed item is fixed within the same milestone.
- The build entry point and the demo page come first (M0), so every later milestone is visible in a browser.
- React is the reference framework for the editor (M3–M4); the other frameworks follow once the behavior is approved (M5).
- Library milestones (M0–M7) and Creator milestones (C1–C5) are separate PRs in separate repositories. Creator work starts after CP4 is passed.

### 14.2 Demo harness (manual verification pages)

Dev-only pages, not part of any bundle and not used by automated tests:

| Framework | Page | How to open |
|---|---|---|
| React | `packages/survey-react-ui/rich-text.html` + `rich-text.js` | `npm start` in `packages/survey-react-ui` → `/rich-text.html` |
| survey-js-ui | `packages/survey-js-ui/rich-text.html` + `rich-text.js` | `npm start` in `packages/survey-js-ui` → `/rich-text.html` |
| Vue 3 | route `/rich-text` in `packages/survey-vue3-ui/example` | `npm run serve:example:dev` |
| Angular | route `rich-text` in `packages/survey-angular-ui/example` | `npm run serve:example:dev` |
| Creator | `packages/survey-creator-react/rich-text.html` (survey-creator repo) | `npm start` in `packages/survey-creator-react` → `/rich-text.html` |

Every library demo page renders the demo survey of Appendix A and has a side panel with:

- **Live data:** `survey.data` as formatted JSON, plus a log of `onValueChanged` events (question name, new value). Used to verify stored Markdown/HTML and that no write happens without input.
- **Show JSON:** `survey.toJSON()`.
- **Set value externally:** sets the value of `c_md` to a fixed formatted string; a second button does the same after a 3-second delay (to test deferral while focused).
- **Mode switch:** edit / read-only / display (`mode: "display"`) / design (`survey.setDesignMode(true)`).
- **Theme switch:** default light theme / a dark theme from `survey-core/themes`.
- **String format switch:** sets `survey.stringFormat` to `"plain"` / `"markdown"` / `"html"` without re-creating the survey.
- **Custom handler toggle:** adds an `onTextMarkdown` handler that returns `"[handler] " + text` for titles only.
- **External converter toggle** (from M7): registers markdown-it/turndown (loaded from a CDN on the demo page only) as the `"markdown"` format, exactly as in the documentation sample.
- **Converter playground:** a format selector, a source textarea, and three outputs updated on input: rendered HTML (preview), canonical source (`toSource` of the rendered HTML), `isLossless` and `getUnsupported` results.
- **Find unsupported:** runs `RichText.findUnsupported(survey)` and lists the results.
- URL parameter **`?plugin=off`**: the page does not load the plugin bundle and CSS (the panel hides plugin-only controls).

### 14.3 Milestones

#### M0 — Scaffolding and demo harness

Scope: `entries/rich-text.ts` (version check, empty `RichText`), `rollup.rich-text.config.mjs`, `tsconfig.rich-text.json`, `build:rich-text` and its inclusion in `build:all`, empty `rich-text.scss`, React demo page skeleton with the side panel and `?plugin=off`.

Automated: build succeeds; lint.

**CP0 — the plugin loads.** Run `npm run build && npm run build:rich-text` in `packages/survey-core`, then `npm run build && npm start` in `packages/survey-react-ui`, open `/rich-text.html`.
- [x] The survey renders; the console has no errors and no version-mismatch warning.
- [x] `window.SurveyRichText.RichText` exists.
- [x] With `?plugin=off`, `SurveyRichText` is undefined and the survey looks identical.
- [x] `build/rich-text/index.js`, `build/fesm/rich-text/index.mjs`, `build/rich-text.css` exist.

#### M1 — survey-core hooks (§5.1–§5.3, §5.5)

Scope: `settings.richText` slot and types, pre-filling `options.html` in `getSurveyMarkdownHtml`, `textFormat` property and `getComponentName` override, survey `stringFormat` property (§5.5).

Automated: core part of `comment-text-format.tests.ts`; `provider.tests.ts` with a fake provider; the full existing survey-core suite is green without changed expectations.

**CP1 — core is unchanged without the plugin** (`?plugin=off`).
- [x] Questions `c_md`, `c_html` render as ordinary textareas; typing `**x**` stores `**x**` literally (data panel).
- [x] "Show JSON" contains `"stringFormat": "markdown"` at the survey level and `"textFormat": "markdown"` for `c_md`; a plain comment has no `textFormat` key.
- [x] Titles with Markdown on page "Strings" show raw Markdown characters (no plugin → no rendering), exactly as before the change.

#### M2 — Converters and survey string rendering (§3, §5.2, §6.1 items 1 and 6, §6.2, §6.3, §7.4 lossless check, §11 `findUnsupported`)

Automated: `markdown`, `serializer`, `roundtrip`, `html-format`, `lossless`, `provider`, `edit-mode` unit tests.

**CP2 — survey strings render rich text; converters are inspectable.** Open the React demo page (plugin on), page "Strings".
- [x] Survey title, question titles, descriptions and choice texts show bold/italic/strikethrough/links; links open in a new tab.
- [x] The description of `s1` shows two lines, a paragraph break and a bulleted list.
- [x] The title of `s6` (`- not a list in a title`) is shown literally (inline context).
- [x] Plain strings look exactly as with `?plugin=off`.
- [x] String format `"plain"`: the whole page "Strings" looks exactly as with `?plugin=off`; switching back to `"markdown"` restores formatting without reloading.
- [x] `s3` and `s4`: no alert appears; the script tag and the `javascript:` link are shown as text.
- [x] `s5` (Markdown table) is shown as literal text with its line breaks.
- [x] Custom handler toggle: titles show the `[handler]` prefix; descriptions are still rendered by the plugin.
- [x] String format `"html"`: `s7` (HTML with `style` and a table) renders without color and without table structure, text kept.
- [x] Converter playground: `__a__` → canonical `**a**`, lossless; a Markdown table → lossless, `getUnsupported` = `["table"]`; HTML format with `<span style="color:red">x</span>` → not lossless, `getUnsupported` lists `style`.
- [x] "Find unsupported" lists `s3`, `s5` and `s7`.

#### M3 — Editor core in React (§6.1 items 2–5, §7.1–§7.3, value flow basics of §7.4, §8 for React)

Scope: `RichTextEditorModel` with the command adapter, toolbar (bold, italic, strikethrough, lists, clear formatting), toggle state, selection save/restore, keys, commit on blur/debounced input, React wrapper, base CSS, icons, strings.

Automated: corresponding `editor-model.tests.ts` cases; React markup etalons for edit mode.

**CP3 — formatting a comment answer.** React demo page, page "Editor".
- [x] `c_md` shows a toolbar above the editing area; the toolbar uses the survey theme.
- [x] Bold/italic/strikethrough via buttons and via Ctrl/Cmd+B/I; the pressed state follows the caret.
- [x] Worked example of §3.3: data panel shows exactly `Please **read the** ***ter**ms* carefully`, then `Please **r**ead the *terms* carefully` after the second click.
- [x] Clicking a toolbar button keeps the selection.
- [x] Bulleted/numbered list; Enter adds an item; Enter on an empty item leaves the list.
- [x] Enter → `\n\n` in data; Shift+Enter → `\n`.
- [x] Ctrl/Cmd+U does nothing; Ctrl/Cmd+Z undoes the last formatting.
- [x] `c_md` updates the value on blur; `c_typing` updates while typing (event log).
- [x] Focus and leave `c_md` without typing → no new entry in the event log.
- [x] Clear formatting removes marks and turns list items into paragraphs.

#### M4 — Editor completeness in React (rest of §7, §5.4)

Scope: link dialog, paste normalization, `maxLength` and counter, placeholder, `rows`/`autoGrow`/`allowResize`, external value updates with deferral, read-only/disabled/display/design rendering, source mode and "edit anyway", `textFormat: "html"`, inline mode, matrix cells, bold hiding, accessibility attributes, theme CSS, library string editor fix.

Automated: remaining `editor-model.tests.ts` cases; all React markup etalons.

**CP4 — the comment editor is feature-complete in React.**
- [ ] Link: dialog opens; `https://surveyjs.io` creates a link; `javascript:alert(1)` shows the validation error; empty URL removes the link; with no selection the URL is inserted as link text.
- [ ] Paste formatted content from a web page or Word (colors, fonts, a table): only supported formatting remains; table text is kept as paragraphs/lines.
- [ ] `c_max`: the counter counts source characters; typing stops at the limit; a formatting command that would exceed the limit is reverted.
- [ ] Placeholder is visible when empty and disappears on typing; it reappears after deleting everything.
- [ ] `c_rows`: initial height of 6 lines, grows with content, can be resized.
- [ ] "Set value externally" updates `c_md` immediately when not focused; with the delayed button while typing in `c_md`, the content is updated only after blur and the caret is not disturbed.
- [ ] Read-only, display and disabled modes show formatted, non-editable HTML without a toolbar; design mode shows the same.
- [ ] `c_unsupported` opens in source mode with the notice; "edit anyway" switches to the rich editor; after editing, the stored HTML contains only allow-list tags.
- [ ] `c_html` stores canonical HTML (`<strong>`, `<em>`, `<p>`, …) in the data panel.
- [ ] `c_inline`: no list buttons; Enter does nothing.
- [ ] Matrix `m1`: the comment cell has the rich editor; the cell value is Markdown.
- [ ] Design mode, page "Strings": edit the description of `s1` inline; after blur its formatting is preserved (§5.4).
- [ ] Dark theme: toolbar, content, links, placeholder and source-mode notice are readable.
- [ ] Narrow (mobile) width: the toolbar fits or wraps without overlapping the content.
- [ ] Screen reader / devtools accessibility tree: textbox with the question title as name, toolbar with pressed states.

#### M5 — survey-js-ui, Vue 3, Angular wrappers (§8)

Scope: the `sv-rich-text-comment` component in each package, the demo page/route for each, markup runners importing the plugin.

Automated: markup etalons pass in all four packages (identical snapshots).

**CP5 — parity across frameworks.** Repeat in survey-js-ui, Vue 3 and Angular (pages from §14.2):
- [ ] CP3 items: toolbar, bold via button and shortcut, worked example, lists, Enter/Shift+Enter, value on blur.
- [ ] CP4 items: link dialog, paste, read-only/display, source mode, `c_html`, matrix cell, external value update.
- [ ] Visual comparison with the React page side by side: no differences.

#### M6 — Automated E2E, screenshot and accessibility suites (§13.3–§13.5)

Automated: all suites green for all four frameworks.

**CP6 — review of automated results.**
- [ ] Run `npm run e2e` (Playwright UI mode) in one package and watch the rich text scenarios execute.
- [ ] Every new screenshot etalon is reviewed by a person before being committed and matches the demo page for the same state.
- [ ] The a11y reports contain no violations for the rich text states.

#### M7 — Documentation

Scope: documentation article (enabling the plugin, `textFormat`, formats, custom converters with the markdown-it/turndown sample, HTML storage risks, migration with `findUnsupported`); external converter toggle on the demo page.

**CP7 — documentation samples work as written.**
- [ ] The markdown-it/turndown sample, pasted unchanged into the demo page (external converter toggle), renders `s5` as a real table.
- [ ] With the external converter, formatting in `c_md` (bold, italic, lists, links) is stored by turndown and renders identically after reload of the value; italic is stored with `*`.
- [ ] Every other code sample in the article runs without changes.

#### C1–C5 — Survey Creator integration (survey-creator repository, §9)

**C1 — rendering and enabling rich text (§9.1).** CP-C1 on the Creator demo page (demo survey of Appendix A loaded into Creator):
- [ ] The designer shows formatted titles/descriptions/choices without any `onSurveyInstanceCreated` code on the page.
- [ ] Property grid labels and property hints look exactly as with `?plugin=off`.
- [ ] Survey settings in the property grid show `stringFormat` = `markdown`; switching it to `plain` shows raw Markdown on the design surface and plain string editors; switching back restores formatting. The stored strings do not change (JSON tab).
- [ ] "New survey": the JSON tab contains `"stringFormat": "markdown"`. Loading a JSON without `stringFormat` keeps it `plain`.
- [ ] Preview tab shows formatted strings and working rich comment editors.
- [ ] With `?plugin=off`, Creator looks and behaves as before.

**C2 — inline string editor (§9.2, §9.3).** CP-C2:
- [ ] Click a question title: floating toolbar with italic/strikethrough/link/clear (no bold because the title is bold, §4.4; no lists); Enter commits; Escape restores the previous text.
- [ ] Click a description: toolbar with bold and lists; Enter in a list item adds an item; Enter elsewhere commits.
- [ ] Ctrl/Cmd+B/I work in rich strings; after commit, Creator undo/redo reverts/reapplies the change.
- [ ] Choice texts get the inline toolbar; with `inplaceEditChoiceValues` the plain editor is used.
- [ ] With `stringFormat: "html"`, the raw-HTML string `s7` is edited as source.
- [ ] JSON tab shows Markdown (or canonical HTML with `stringFormat: "html"`) for edited strings.

**C3 — property grid (§9.4).** CP-C3:
- [ ] Question title and description editors are rich (inline/block toolbars); edits appear on the design surface and vice versa.
- [ ] `requiredErrorText` and `completedHtml` editors stay plain.
- [ ] A comment question's property grid shows `textFormat`; switching it to `markdown` changes the question on the design surface.

**C4 — translation tab (§9.5).** CP-C4 on the Creator demo page, after adding German (`de`) in the translation tab:
- [ ] Strings grid: Markdown strings show the toolbar only in the focused cell, floating, without changing row heights; titles get the inline toolbar, descriptions the block toolbar.
- [ ] Empty `de` cells show the default-locale text as a plain-text placeholder (no `**`).
- [ ] Format a `de` translation of `s1`'s title; switching the designer to `de` shows the formatted title; the JSON tab stores Markdown under `"de"`.
- [ ] Strings without Markdown support and multi-value strings stay plain.
- [ ] Element strings dialog: same behavior as the grid; edits appear in the grid and the side-by-side panes.
- [ ] Side-by-side view: the source pane shows formatted read-only strings; the target pane edits with the floating toolbar; rows of both panes stay aligned while editing.
- [ ] Read-only translation: cells show formatted, non-editable HTML.
- [ ] Export to CSV and import back: formatted translations are unchanged.
- [ ] With `?plugin=off`, the translation tab looks and behaves as before.

**C5 — Creator automated tests (§13.6).** CP-C5:
- [ ] Unit, e2e and screenshot suites are green; new screenshot etalons are reviewed by a person.

#### M8 — Release readiness

**CP8 — final regression.**
- [ ] Definition of done (§15) is met.
- [ ] `?plugin=off` on every demo page: no visible difference from the current release.
- [ ] Bundle size reported in the PR description.
- [ ] Forward-compatibility review (§11.2): the documentation mentions only the public surface of item 2; a search shows no import from `src/plugins/rich-text/` outside the plugin folder and its entry; the plugin has no import side effects beyond §6.1.

---

## 15. Definition of done

- All suites in §13 pass for all frameworks; `npm run lint` passes with zero warnings in every touched package.
- `npm run build:all` in survey-core produces the `rich-text` bundle and CSS.
- With the plugin not loaded, all existing tests pass without changes to their expectations.
- The forward-compatibility requirements of §11.2 are met.
- Bundle size target (§12) met; no runtime dependencies.
- All checkpoints CP0–CP8 (library) and CP-C1–CP-C5 (Creator) are passed.

---

## Appendix A. Demo survey

Used by every demo page (§14.2). Keep the copies in all demo pages identical.

```json
{
  "stringFormat": "markdown",
  "title": "Rich text **demo**",
  "description": "Survey description with *italic* text.\n\nSecond paragraph.",
  "pages": [
    {
      "name": "strings",
      "title": "Strings",
      "elements": [
        {
          "type": "text", "name": "s1",
          "title": "Title with *italic*, **bold**, ~~strike~~ and [a link](https://surveyjs.io)",
          "description": "Line one\nLine two\n\n- item one\n- item two"
        },
        {
          "type": "radiogroup", "name": "s2", "title": "Plain title",
          "choices": ["**Bold** choice", "Plain choice", "Choice with a literal \\* star"]
        },
        { "type": "text", "name": "s3", "title": "Raw <b>html</b> and <script>alert(1)</script>" },
        { "type": "text", "name": "s4", "title": "[js link](javascript:alert(1))" },
        { "type": "text", "name": "s5", "title": "Table", "description": "| a | b |\n|---|---|\n| 1 | 2 |" },
        { "type": "text", "name": "s6", "title": "- not a list in a title" },
        {
          "type": "text", "name": "s7", "title": "HTML string",
          "description": "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>"
        }
      ]
    },
    {
      "name": "editor",
      "title": "Editor",
      "elements": [
        { "type": "comment", "name": "c_md", "title": "Markdown answer", "textFormat": "markdown", "placeholder": "Type and format text" },
        { "type": "comment", "name": "c_typing", "title": "Updates while typing", "textFormat": "markdown", "textUpdateMode": "onTyping" },
        { "type": "comment", "name": "c_html", "title": "HTML answer", "textFormat": "html" },
        { "type": "comment", "name": "c_inline", "title": "Inline mode", "textFormat": "markdown", "acceptCarriageReturn": false },
        { "type": "comment", "name": "c_max", "title": "Max length 50", "textFormat": "markdown", "maxLength": 50 },
        { "type": "comment", "name": "c_rows", "title": "Rows, autoGrow, resize", "textFormat": "markdown", "rows": 6, "autoGrow": true, "allowResize": true },
        {
          "type": "comment", "name": "c_unsupported", "title": "Unsupported stored content", "textFormat": "html",
          "defaultValue": "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>"
        },
        {
          "type": "matrixdropdown", "name": "m1", "title": "Matrix with a rich comment cell",
          "columns": [{ "name": "notes", "cellType": "comment", "textFormat": "markdown" }],
          "rows": ["Row 1"]
        }
      ]
    }
  ]
}
```
