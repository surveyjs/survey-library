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
- **No hard dependency on external libraries.** The plugin has zero runtime dependencies. External converters (markdown-it, turndown, DOMPurify, …) can be plugged in by customers as handlers of the survey events (§4.2); the plugin has no converter registry.
- **Minimum functionality** that survey authors actually need. No tables, images, colors, font sizes, alignment.
- **Opt-in and zero cost when unused.** A survey that does not load the plugin downloads no plugin JS/CSS and behaves exactly as today.
- **One conversion path, through events.** Survey strings (titles, descriptions, …) and comment answers are rendered only through the existing `onTextMarkdown` event. Survey strings are saved in Creator through the existing `creator.onHtmlToMarkdown` event. Comment answers are saved through a new survey event, `survey.onHtmlToMarkdown`, which has the same options as Creator's event (§5.2). The plugin exports converter functions and ready-made handlers for these events; customers attach them the same way as an external converter (markdown-it, turndown). survey-core has no rich-text setting, no provider slot and no format property.
- **Explicit switch for answers.** A comment question switches to the rich editor only through its boolean JSON property `allowRichText`. The stored format of the answer is decided by the attached handlers, not by JSON. Loading the plugin alone never changes how an existing survey renders.
- **Answers are untrusted.** Respondents type answers, and other people view them later. HTML that handlers produce for an answer always passes through the built-in allow-list (§3.4) before it reaches the DOM, whatever handler produced it.
- **Movable into the main bundle.** The feature ships as a plugin first and must be movable into the main `survey-core` bundle later without breaking customer code or JSON (§11.2).
- **Never lose data silently.** Comment answers the editor cannot represent are never opened in the rich editor; they are edited as source.
- **Backward compatibility.** Existing `onTextMarkdown` / Creator `onHtmlToMarkdown` handlers keep working unchanged; they remain the only path for survey strings.

---

## 2. Key decisions (summary)

| Topic | Decision |
|---|---|
| Storage format | Survey strings and comment answers: whatever the customer's handlers understand; the plugin supplies Markdown handlers. A customer who wants HTML assigns `options.html = options.text` in their own handler (their risk for strings, §10; answers are sanitized on display, §6.4). Never store both. |
| Converter | Own, built-in Markdown subset converter (both directions), exposed as ready-made handlers. Built-in allow-list HTML format, used as the display sanitizer of comment answers and for paste normalization. Customers replace conversion by attaching their own handlers (markdown-it, turndown). |
| Features | Bold, italic, strikethrough, link, bulleted list, numbered list, line breaks/paragraphs, clear formatting. |
| Not supported | Tables, images, headings, colors, font size/family, alignment, underline, nested lists, code, blockquotes. |
| Distribution | Separate entry point of the `survey-core` npm package: `survey-core/rich-text` (ESM + UMD + CSS), same pattern as `survey-core/collaboration`. Designed so it can later move into the main bundle without breaking changes (§11.2). |
| Activation — survey strings | By customer code: attach `RichText.textMarkdownHandler` (or own code calling `RichText.markdownToHtml`) to `survey.onTextMarkdown`. No JSON property, no setting. |
| Activation — comment answers | By survey JSON: boolean comment property `allowRichText` (declared in core, made visible by the plugin). Rich editing also needs handlers on `survey.onTextMarkdown` and `survey.onHtmlToMarkdown`; without a reverse handler the answer is edited in the standard textarea (§6.4). |
| Source location | `packages/survey-core/src/plugins/rich-text/` + thin wrappers in UI packages. |
| Core ↔ plugin contract | None beyond public core APIs: core declares `allowRichText` and the `onHtmlToMarkdown` survey event, and asks `RendererFactory` for the `"richtext"` comment renderer. Core never imports the plugin and has no rich-text slot in `settings`. |
| Creator ↔ plugin contract | Creator never imports the plugin. The customer registers it explicitly: `creator.registerRichTextEditor(RichText)` (§9). Creator enables the rich toolbar for survey strings only when an editor is registered **and** `creator.onHtmlToMarkdown` has a handler. |

---

## 3. Data model and formats

### 3.1 Formats

There is no format property in JSON, neither for survey strings nor for comment answers. The storage format is whatever the handlers attached to `onTextMarkdown` / `onHtmlToMarkdown` read and write. Formats are only the names of the plugin's two built-in converters, available read-only through `RichText.getFormat`:

- `"markdown"` — the default rich format. Stored value is Markdown text from the supported subset (§3.3). The plugin's functions and ready-made handlers (§4.2) use it.
- `"html"` — the allow-list HTML format (§3.4). It is not a storage format of its own: it sanitizes handler output for comment answers (§6.4), normalizes paste (§7.4), and customers may call it from their own handlers (§10).

No other format names exist, and the built-in converters cannot be replaced. A customer who wants different conversion (e.g. markdown-it/turndown) attaches their own handlers instead of the plugin's; the plugin's functions and ready-made handlers always use the built-in Markdown converter.

Comment answers and survey strings go through the same handlers. A handler recognizes an answer by `options.name === "value"`; `options.element` is the comment question. Any other storage (e.g. raw HTML strings, or HTML answers for selected questions) is implemented by the customer in their own handlers, branching on these options (§4.2 sample).

### 3.2 Common rendering rules (both formats)

- **Line breaks:** a single newline in Markdown (and `<br>` in HTML) renders as a line break. A blank line (and `<p>` in HTML) separates paragraphs. Rationale: existing plain-text comment answers contain newlines and must not collapse when a question is switched to rich text.
- **Paragraph wrapping:** a single paragraph renders **without** a `<p>` wrapper; two or more paragraphs render as `<p>` elements.
- **Inline context:** when the context is `inline` (see §6.3), block syntax (lists, paragraphs) is not parsed; newlines become `<br>`.
- **Canonical HTML tags** produced by every built-in conversion: `strong`, `em`, `s`, `a`, `ul`, `ol`, `li`, `p`, `br`.
- **Links:** only `http:`, `https:`, `mailto:` URLs are allowed. Any other scheme (e.g. `javascript:`, `data:`, `vbscript:`) is rendered as plain text. Rendered links always get `target="_blank" rel="noopener noreferrer"` (navigating away would lose survey answers). These two attributes are added at render time and are never stored.
- **Plain text detection:** when the source contains no formatting, `RichText.markdownToHtml` returns `""` and `RichText.textMarkdownHandler` leaves `options.html` untouched (§4.2), so the string renders as plain text (keeps `LocalizableString.hasHtml === false` and today's rendering path).

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

Used as the display sanitizer of comment answers (§6.4), by paste normalization in the Creator string editor (§9.2), and available through `RichText.getFormat("html")`.

- **Input accepted:** the same element set as §3.3 step 1.
- **Unknown elements** are unwrapped, keeping their text. Block-level unknown elements (`div`, `h1`–`h6`, `table`, `tr`, `blockquote`, `pre`, …) become paragraph/line boundaries so text does not run together.
- **Dropped with their content:** `script`, `style`, `iframe`, `object`, `embed`, `template`, `noscript`.
- **Attributes:** all are removed except `a[href]` with an allowed scheme. `target` and `rel` on `a` are removed **without being reported**: they are render-time attributes (§3.2), and the built-in Markdown converter emits them, so reporting them would send every answer with a link to source mode (§6.4).
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

Customers do not implement this interface to change conversion; they attach handlers (§4.2). It types the results of `RichText.getFormat`, Creator's `richTextConverter` (§6.1, §9.2.1) and the plugin's internal answer converter (§6.4).

Converters must be synchronous. The built-in Markdown converter implements `getUnsupported` (§3.3). The built-in HTML converter implements `getUnsupported` and `checkLossless` (§3.4); `checkLossless` is required there because its `toHtml` already drops unsupported content, so a round trip of its output cannot detect the loss.

### 4.2 `RichText` facade (exported from `survey-core/rich-text`)

```ts
// Built-in converters (read-only; no registration)
RichText.getFormat(format: "markdown" | "html"): IRichTextConverter;
RichText.isLossless(source: string, format: "markdown" | "html", context: IRichTextConverterContext): boolean;
RichText.findUnsupported(survey: SurveyModel, format?: "markdown" | "html"): Array<{ element: Base, name: string, locale: string, text: string }>;

// Survey strings: plain functions
RichText.markdownToHtml(text: string, context?: Partial<IRichTextConverterContext>): string; // "" when there is no formatting
RichText.htmlToMarkdown(html: string, context?: Partial<IRichTextConverterContext>): string;

// Survey strings and comment answers: ready-made event handlers
RichText.textMarkdownHandler: (sender: SurveyModel, options: TextMarkdownEvent) => void;  // for survey.onTextMarkdown
RichText.htmlToMarkdownHandler: (sender: any, options: { element: Base, name: string, html: string, text: string }) => void; // for survey.onHtmlToMarkdown and creator.onHtmlToMarkdown

// Edit modes and Creator integration
RichText.getEditMode: (owner: Base, name: string, locStr: LocalizableString,
                       defaultMode: RichTextEditMode) => RichTextEditMode; // customer override; default: returns defaultMode
RichText.getStringEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode; // §6.2 + getEditMode override
RichText.attachEditor(element: HTMLElement, options: IRichTextEditorOptions): IRichTextEditorHandle;

setRichTextStrings(patch: { [key: string]: string }): void;
```

```ts
export type RichTextEditMode = "none" | "inline" | "block";
export interface IRichTextEditorOptions { mode: "inline" | "block"; onInput?: () => void; }
export interface IRichTextEditorHandle { toolbar: ActionContainer; detach(): void; }
```

- `markdownToHtml` / `htmlToMarkdown` use the built-in Markdown converter (`RichText.getFormat("markdown")`). `htmlToMarkdown` parses the string into a detached element and calls `toSource`; without a DOM it returns the input unchanged.
- When `context.inline` is omitted, it is derived from `context.element` and `context.name`. For a comment answer (`element` inherits from `comment` and `name === "value"`), `inline` = the effective comment edit mode is `"inline"` (§6.1). Otherwise `inline = getStringEditMode(...) !== "block"`. With no element, `inline = true`.
- `textMarkdownHandler` calls `markdownToHtml(options.text, { element: options.element, name: options.name })` and assigns the result to `options.html` only when it is not `""`. `htmlToMarkdownHandler` assigns `htmlToMarkdown(options.html, { element, name })` to `options.text`; it assigns `""` (not `null`) for empty HTML, so the reverse-handler probes (§6.4, §9.0) detect it. Both handlers serve survey strings and comment answers.
- Documented usage:

  ```js
  // Survey strings and comment answers in Markdown:
  survey.onTextMarkdown.add(RichText.textMarkdownHandler);
  survey.onHtmlToMarkdown.add(RichText.htmlToMarkdownHandler);
  // Conditional use / post-processing, the same way as with markdown-it:
  survey.onTextMarkdown.add((sender, options) => {
    if (options.name === "title") options.html = RichText.markdownToHtml(options.text, { inline: true });
  });
  // Raw HTML strings (customer's choice and risk, §10):
  survey.onTextMarkdown.add((sender, options) => { options.html = options.text; });
  // HTML answers for one question, Markdown for everything else.
  // The answer is sanitized on display (§6.4); the stored value is the editor's HTML.
  const isHtmlAnswer = (options) => options.name === "value" && options.element.name === "notes";
  survey.onTextMarkdown.add((sender, options) => {
    if (isHtmlAnswer(options)) options.html = options.text;
    else RichText.textMarkdownHandler(sender, options);
  });
  survey.onHtmlToMarkdown.add((sender, options) => {
    if (isHtmlAnswer(options)) options.text = options.html;
    else RichText.htmlToMarkdownHandler(sender, options);
  });
  ```

- `findUnsupported` checks survey strings against `format`, which defaults to `"markdown"`, and the values of comment questions with `allowRichText` through their answer converter (§6.4); `format` does not apply to answers.
- `attachEditor` is format-agnostic: it adds the toolbar and keyboard behavior to a `contenteditable` element and never serializes. The caller reads `innerHTML` and converts it itself (Creator: through `onHtmlToMarkdown`, §9.2). Paste is normalized with the built-in allow-list HTML format (§3.4).
- External converters are attached as handlers: markdown-it to `survey.onTextMarkdown`, turndown to `survey.onHtmlToMarkdown` (and to `creator.onHtmlToMarkdown` in Creator). Mixing is done in the customer's handlers, e.g. markdown-it for rendering and `RichText.htmlToMarkdownHandler` for saving.
- Also export `RichTextEditorModel` and all public types.

### 4.3 Handler contract (documented, not enforced)

Applies to the customer's own handlers on `onTextMarkdown` / `onHtmlToMarkdown`:

1. The `onTextMarkdown` handler must return safe HTML for survey strings. With raw-HTML-capable libraries, sanitize inside the handler (e.g. DOMPurify). Comment answers are sanitized by the plugin anyway (§6.4).
2. The `onHtmlToMarkdown` handler must convert back everything the `onTextMarkdown` handler produces, otherwise content is lost on save (for answers, the lossless check, §6.4, routes such content to source mode).
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

The only changes are the comment property and the survey event below. Both are small, generic, and do not reference the plugin. survey-core has **no** rich-text setting, provider slot, provider types or format property: survey strings keep today's code path (`getSurveyMarkdownHtml` pre-fills `options.html` with `null` and fires `onTextMarkdown`), and the plugin plugs into it only through handlers the customer attaches (§4.2).

### 5.1 `comment` question: `allowRichText`

In `question_comment.ts`:

- `@property() allowRichText: boolean;` and serializer entry `{ name: "allowRichText:boolean", default: false, visible: false }`.
- Override `getComponentName()`: if `allowRichText` is `true`, return `RendererFactory.Instance.getRenderer("comment", "richtext")` when it is not `"default"`; otherwise call `super.getComponentName()`. Use the literal `"comment"` type (not `getType()`) so inheriting question types are covered. The check runs before the view-mode fallback so the plugin's component also renders display/read-only mode.
- Without the plugin: the renderer is not registered → the default textarea shows the source; `allowRichText` remains in JSON.

Same precedent: `QuestionBooleanModel.getComponentName()`.

### 5.2 Survey event `onHtmlToMarkdown`

In `survey-events-api.ts`:

```ts
export interface HtmlToMarkdownEvent extends TextProcessingEvent {
  html: string;   // HTML produced by the editor
  text: string;   // pre-filled with null; the handler assigns the converted source
}
```

In `survey.ts` and `ISurvey` (`interfaces/survey-interfaces.ts`):

- `public onHtmlToMarkdown: EventBase<SurveyModel, HtmlToMarkdownEvent> = this.addEvent<SurveyModel, HtmlToMarkdownEvent>();` (no `locStrsChanged` callback: the event does not affect rendering).
- `getSurveyHtmlToMarkdown(element: Base, html: string, name: string): string` fires the event with `text: null` and returns `options.text`. It is the counterpart of `getSurveyMarkdownHtml`.
- The option names (`element`, `name`, `html`, `text`) match Creator's `onHtmlToMarkdown`, so one handler (`RichText.htmlToMarkdownHandler` or the customer's own) can be attached to both.
- Core never fires the event itself. In the library only the plugin fires it, for comment answers (§6.4).

Out of scope: the library's own in-place string editor (`SurveyLocStringEditor`, used by `survey.setDesignMode(true)`). It keeps today's behavior (saves `innerText`); Survey Creator is the editing surface for formatted survey strings.

---

## 6. Plugin architecture (survey-core/rich-text)

### 6.1 What happens on import

1. Make `allowRichText` visible: `Serializer.findProperty("comment", "allowRichText").visible = true`.
2. Add a non-serializable, invisible property on `comment`: `{ name: "richTextEditMode", default: "block", choices: ["inline", "block"], visible: false, isSerializable: false }`. Used by Creator (§9.4, §9.5). The effective mode of a comment editor is `"inline"` when `acceptCarriageReturn === false`, otherwise `richTextEditMode`.
   Also add `{ name: "richTextToolbarVisibility", default: "always", choices: ["always", "onFocus"], visible: false, isSerializable: false }`. The question renderer does not read it: the comment toolbar is always the floating on-focus variant (§7.2). Creator still sets `"onFocus"` for the property grid and the translation tab.
   Also add `{ name: "richTextConverter", visible: false, isSerializable: false }` holding an `IRichTextConverter` or `undefined`. When set, the comment editor uses it instead of the answer converter (§6.4) for rendering, serializing and the lossless check, and the reverse-handler probe is skipped. Used by Creator to edit survey strings in comment cells through the handlers of the edited survey and Creator (§9.4, §9.5): those cells live in an internal survey that has no customer handlers.
3. Register the renderer: `RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment")`.
4. Register icons via `SvgRegistry.registerIcons(...)`.
5. Call `checkLibraryVersion(Version, "survey-core-rich-text")`.

Importing the plugin has no effect on survey strings or comment answers: it assigns nothing in `settings` and adds no event handlers.

### 6.2 Default edit mode resolution (`RichText.getStringEditMode`)

```ts
function getDefaultEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode {
  if (!locStr || !locStr.useMarkdown) return "none";
  if (Serializer.findProperty(owner.getType?.(), name)?.type === "html") return "none";
  return blockProperties.indexOf(name) > -1 ? "block" : "inline";
}
const blockProperties = ["description"];
```

The result is passed to `RichText.getEditMode(owner, name, locStr, defaultMode)` (customer override). Used by `markdownToHtml` / `textMarkdownHandler` to choose the inline or block context, and by Creator to choose the toolbar profile. Whether survey strings are rich at all is decided by the customer's handlers, not here.

### 6.3 Rendering context

- Survey strings: `inline` = `getStringEditMode(...)` is not `"block"` (computed by `markdownToHtml` when `context.inline` is omitted).
- Comment answers: `inline` = effective comment edit mode is `"inline"` (computed by `markdownToHtml` / `htmlToMarkdown` for `name === "value"` when `context.inline` is omitted, §4.2).

### 6.4 Comment answers: rendering and saving through handlers

Comment answers go through the handlers of the question's survey, with `element` = the comment question and `name` = `"value"`. The plugin builds an **answer converter** per question (`answer-format.ts`); `ctx` is the converter context of §6.3:

- `toHtml(source, ctx)`: `raw = survey.getSurveyMarkdownHtml(question, source, "value", undefined)`.
  - When `raw` is empty (`null`, `undefined` or `""`), the source has no formatting: return the HTML-escaped source with `\n` → `<br>`.
  - Otherwise return `RichText.getFormat("html").toHtml(raw, ctx)`. Handler output never reaches the DOM unsanitized, in edit mode and in display mode, whatever handler produced it (pass-through handlers included).
- `toSource(root, ctx)`: `survey.getSurveyHtmlToMarkdown(question, root.innerHTML, "value")`.
- `checkLossless(source, ctx)`:
  1. `true` when `raw` is empty (plain text);
  2. `false` when the allow-list reports anything in `raw` (`RichText.getFormat("html").getUnsupported(raw).length > 0`), e.g. a table rendered by markdown-it or a `style` attribute. Without this step the sanitizer would hide the loss from the round trip;
  3. otherwise the round trip on sanitized HTML: `html = toHtml(source)`, then `toHtml(toSource(detached(html))) === html`.

**Rich editing condition** (`canEditRich`): the question is editable, it has a survey, `survey.onTextMarkdown` is not empty, and the reverse probe `survey.getSurveyHtmlToMarkdown(question, "", "value") !== null` succeeds. Otherwise the editable question renders the standard textarea with no notice and no toolbar: the editor would otherwise let the user format text that cannot be saved. Read-only, display and design modes always render `toHtml(value)`; with only `onTextMarkdown` attached (e.g. a results viewer) answers are shown formatted.

When `question.richTextConverter` (§6.1) is set, it replaces the answer converter, `canEditRich` checks only that the question is editable, and no sanitizing is added (Creator edits author content, §9.2.1).

Existing `onTextMarkdown` handlers start receiving answers as soon as a question gets `allowRichText: true`. Handlers that post-process HTML for strings (e.g. strip `<p>` with `substring`) can damage multi-paragraph answers; the documentation tells customers to branch on `options.name === "value"`. A damaged round trip is caught by `checkLossless` and opens the answer in source mode, so no data is lost.

`canEditRich` is evaluated on every render of the question. The lossless result is evaluated as described in §7.4. Adding or removing handlers after the editor is attached takes effect the next time the question renders the editor; v1 does not track handler changes live.

### 6.5 Strings and localization

- `src/plugins/rich-text/rich-text-strings.ts`, same pattern as `collaboration-strings.ts` (own English strings + `setRichTextStrings`).
- Keys: `richTextToolbar` "Formatting", `richTextBold` "Bold", `richTextItalic` "Italic", `richTextStrikethrough` "Strikethrough", `richTextLink` "Link", `richTextBulletedList` "Bulleted list", `richTextNumberedList` "Numbered list", `richTextClearFormatting` "Clear formatting", `richTextLinkUrl` "URL", `richTextLinkInvalid` "Enter a link that starts with http://, https://, or mailto:", `richTextSourceMode` "This text contains formatting the editor cannot change. You are editing its source.", `richTextEditAnyway` "Edit as rich text (unsupported formatting will be removed)".

---

## 7. Editor behavior (`RichTextEditorModel`)

The model is framework-agnostic and attaches to any `contenteditable` element (`attach(element)` / `detach()`). It is used by the comment question wrappers and, through `RichText.attachEditor` (format-agnostic mode, §4.2), by Survey Creator.

### 7.1 Editing engine

- `contenteditable` + `document.execCommand` for: `bold`, `italic`, `strikeThrough`, `createLink`, `unlink`, `insertUnorderedList`, `insertOrderedList`, `removeFormat`, `insertText`, `insertHTML`. Set `styleWithCSS` to `false`.
- `execCommand` is accessed through a small injectable command adapter so unit tests can mock it (jsdom does not implement `execCommand`).
- Browser markup differences never reach stored data: only serializer output is stored.

### 7.2 Toolbar and commands

- Toolbar = `ActionContainer` rendered by the existing `sv-action-bar` (compact size). On the comment question it is a floating overlay **below** the editing area and does not take space in the layout. It is shown only while focus is inside the editor, the toolbar, or the link dialog. In the DOM it follows the editing area, so Tab from the field reaches the buttons once they are shown. Clicking a button does not move focus (`mousedown` is cancelled), so the toolbar stays open.
- The floating box uses the dropdown popup chrome: a 2px gap below the field (the same offset as `.sv-dropdown-popup.sv-popup--menu-popup.sv-popup--bottom`), `padding: var(--sjs2-spacing-x050)` (the popup list padding), and the border, radius, background and shadow of `.sv-popup--menu-popup > .sv-popup__container`. The action bar is the only content inside that box.
- `richTextToolbarVisibility` is not read by the question renderer: the comment toolbar is always this floating on-focus variant. Creator still sets `"onFocus"` on grid cells (§9.4, §9.5); that matches the only behavior. The Creator inline string editor uses the same floating toolbar (§9.2).
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

  "Lossless" is defined relative to the active converter's rendering. For comment answers the active converter is the answer converter of §6.4 (or `richTextConverter`), which implements `checkLossless`. With the built-in Markdown handlers, unsupported syntax is literal text, so it is lossless and editable as text in the rich editor. Source mode is reached when handler output contains something the allow-list removes (tables, styles, raw HTML with unsupported tags) and when the customer's handlers do not round-trip. Returns `true` when no DOM is available. Cached per value; re-evaluated when the value changes from outside and when an editing session starts.
- **Rich mode** (lossless): editor content is set from `toHtml(value)`.
- **Source mode** (not lossless): the standard textarea is shown with the source, plus the `richTextSourceMode` notice and an `richTextEditAnyway` action that switches to rich mode for this session without the check.
- **Committing:** on blur always; additionally on `input` (debounced) when `question.isInputTextUpdate` is true. Only real `input` events serialize; focusing and leaving without changes never rewrites the value.
- **External value changes** (`setValue`, expressions, collaboration): re-render the element only if the new value differs from the last serialized value. If the element is focused, defer the re-render until blur.
- **Paste:** always intercepted. `text/html` → `toSource` of a detached fragment → `toHtml` → `insertHTML` (normalizes everything to the format; for answers, this goes through the customer's handlers and the sanitizer, §6.4). `text/plain` → `insertText`. In the format-agnostic mode of `RichText.attachEditor` (§4.2) the built-in allow-list HTML format is used for this round trip.
- **Undo/redo:** native (provided by `execCommand`).
- **Format-agnostic mode** (`RichText.attachEditor`, Creator string editor): no lossless check, no source mode, no serialization, no value commits. The model only runs commands, keys, toolbar state and paste normalization; the caller owns the content.

### 7.5 Comment question integration details

- `placeholder`: rendered via `data-placeholder` + CSS `:empty::before`; the model keeps the element truly empty (removes a lone `<br>`).
- `rows` → minimum height; `autoGrow` → grows with content, otherwise fixed height with scroll; `allowResize` → CSS vertical resize.
- `maxLength` counts **stored source** characters. The character counter shows remaining source characters. Typing/paste is blocked (`beforeinput`) when the limit is reached. A formatting command whose result exceeds the limit is reverted (`undo`).
- Read-only, disabled, display mode and design mode (Creator surface): render `toHtml(value)` in a non-editable element with the existing view-mode CSS class; no toolbar. Empty value renders like today.
- Accessibility: editing element `role="textbox"`, `aria-multiline="true"` in block mode, and `aria-label`/`aria-labelledby`/`aria-describedby`/`aria-required`/`aria-invalid`/`aria-errormessage` from the question's `a11y_input_*` properties (same sources as `TextAreaModel`). Toolbar: `role="toolbar"`, `aria-label` = `richTextToolbar`, `aria-controls` = editing element id.
- Plain state (`canEditRich === false`, §6.4): the standard textarea, exactly as without the plugin; display/read-only modes still render `toHtml(value)`.
- Out of scope: the comment area under choice questions (`commentTextAreaModel`, "Other"), a survey-level default for `allowRichText`.

---

## 8. UI framework wrappers (survey-library)

One component, registered as `sv-rich-text-comment`, in each UI package:

- React: `packages/survey-react-ui/src/components/rich-text/` (registered in `ReactQuestionFactory`). **survey-js-ui** reuses React sources through Preact; ensure the component is included in its bundle.
- Vue 3: `packages/survey-vue3-ui/src/components/rich-text/`.
- Angular: `packages/survey-angular-ui/src/components/rich-text/` (registered in the Angular component factory).

Wrapper responsibilities only:

1. Render the toolbar via `sv-action-bar` with the model's `toolbar`, after the editing host, inside the element that gets `:focus-within`. Visibility and the floating box are CSS only (§7.2).
2. Render the editing host element (`div`, `contenteditable`) whose **content is not managed by the framework**; call `model.attach(el)` after mount and `model.detach()` before unmount.
3. Render source mode by reusing the existing `TextAreaComponent` plus the notice/action, and the plain state (§7.5) by reusing `TextAreaComponent` alone. The wrapper reads both states from the model; it never probes handlers itself.
4. Render read-only/display mode as non-editable HTML.

No business logic in wrappers. Target size: ~30–40 lines per framework.

---

## 9. Survey Creator integration (survey-creator repository)

Creator never imports the plugin. Without a registered editor, Creator behaves exactly as today.

### 9.0 Registration and the "rich strings" condition

- New Creator API: `creator.registerRichTextEditor(editor: ICreatorRichTextEditor | undefined)`. `ICreatorRichTextEditor` is declared in survey-creator-core and is satisfied structurally by the plugin's `RichText`:

  ```ts
  interface ICreatorRichTextEditor {
    getStringEditMode(owner: Base, name: string, locStr: LocalizableString): "none" | "inline" | "block";
    attachEditor(element: HTMLElement, options: { mode: "inline" | "block"; onInput?: () => void }): { toolbar: ActionContainer; detach(): void };
  }
  ```

- **Rich strings are enabled** when an editor is registered **and** the existing `checkMarkdownToTextConversion` probe reports a handler (`onHtmlToMarkdown` sets `options.text` to a non-`null` value, i.e. `editAsText === false`). Otherwise every Creator editor behaves exactly as today.
- Documented setup (the customer chooses converters; the plugin's handlers are one option):

  ```js
  import { RichText } from "survey-core/rich-text";
  creator.registerRichTextEditor(RichText);
  creator.onSurveyInstanceCreated.add((_, options) => {
    if (["designer-tab", "preview-tab", "theme-tab", "translation-tab:source-survey",
         "translation-tab:target-survey", "matrix-cell-question-popup-editor"].indexOf(options.area) > -1) {
      options.survey.onTextMarkdown.add(RichText.textMarkdownHandler);
      // Comment answers with allowRichText (typed in the preview and theme tabs):
      options.survey.onHtmlToMarkdown.add(RichText.htmlToMarkdownHandler);
    }
  });
  creator.onHtmlToMarkdown.add(RichText.htmlToMarkdownHandler);
  ```

- `creator.onHtmlToMarkdown` (survey strings edited by the author) and `survey.onHtmlToMarkdown` (comment answers typed by a respondent) are separate events with the same options. Creator does not forward one to the other.

### 9.1 Rendering in Creator surveys

- Rendering comes only from the customer's `onTextMarkdown` handlers (§9.0 sample). There is no survey-level format property, no default for new surveys and no property-grid switch.
- Internal UI surveys (property grid, dialogs, translation grid) are not wired by the sample, so they keep today's rendering. The existing property-grid `description` handler (property hints) keeps working.
- Comment questions with `allowRichText` render their answers through the same handlers: formatted on the design surface (design mode is read-only), rich editors in the preview and theme tabs when the sample also attaches `survey.onHtmlToMarkdown` (§6.4), standard textareas otherwise.

### 9.2 Inline string editor (`StringEditorViewModelBase`, `survey-creator-core/src/components/string-editor.ts`)

- Mode resolution in `setLocString` (after the existing probe): when rich strings are enabled (§9.0) and not `isInplaceForEditValues` → `editor.getStringEditMode(owner, name, locStr)`; otherwise `"none"`. Translation-surface strings are not excluded: `isInplaceForEditValues` is already `false` for them, so their choice texts get the rich editor (§9.5).
- The mode does not depend on `locStr.hasHtml`: a string without formatting (rendered as plain text) still gets the toolbar, so authors can format it.
- On focus in `"inline"`/`"block"` mode: `editor.attachEditor(element, { mode })` and show its toolbar (floating above the editor). Detach on blur. No lossless check and no source mode: what the customer's converter can or cannot round-trip is the converter's responsibility (§4.3).
- Saving (`getClearedText`): unchanged. It already fires `onHtmlToMarkdown` with the element's `innerHTML` and stores `options.text`. Verify the case where the handler returns `""` (empty content) still stores an empty string.
- `checkConstraints`: allow Ctrl+B/Ctrl+I in rich mode (routed to the editor); keep blocking Ctrl+Z/Ctrl+Y (Creator undo works per committed value; Escape restores the value from before the edit).
- Enter: commits (unchanged), except inside a list item in `block` mode (new item / leave list).

### 9.2.1 Creator string converter (used by §9.4 and §9.5)

Comment cells and property-grid editors edit a string's source through the comment rich editor. Their questions live in internal surveys without customer handlers, so the answer converter of §6.4 cannot be used. Creator builds a converter per edited survey from the customer's handlers and assigns it to the comment's `richTextConverter` property (§6.1):

- `toHtml(source, ctx)`: the edited survey's `getSurveyMarkdownHtml(ctx.element, source, ctx.name, undefined)`; when it returns an empty value, the HTML-escaped source with `\n` → `<br>`.
- `toSource(root, ctx)`: fire `creator.onHtmlToMarkdown` with `{ element: ctx.element, name: ctx.name, html: root.innerHTML, text: null }`; return `options.text`, or `root.innerText` when it is `null`.
- `lossless: true` (no source mode, same as §9.2).

### 9.3 Creator UI packages (React incl. creator-js via Preact, Angular, Vue)

- Bind `onInput`, `onPaste`, `onBeforeInput` also on the HTML-mode element.
- Add a toolbar slot rendered via `sv-action-bar`.
- Use a `div` instead of a `span` as the editable element for `block` mode.

### 9.4 Property grid (`survey-creator-core/src/property-grid/index.ts`)

`PropertyGridEditorText.getJSON` adds, when rich strings are enabled (§9.0) and `editor.getStringEditMode(...)` is not `"none"`: `allowRichText: true` (switches the renderer; the converter decides the actual format), `richTextEditMode: <mode>` and `richTextToolbarVisibility: "onFocus"`. After the editor question is created, Creator assigns `richTextConverter` (§9.2.1). `html`-type properties (`PropertyGridEditorHtml`) are unchanged.

The comment question's own `allowRichText` property appears in the property grid when the plugin is loaded (the plugin makes it visible, §6.1). Creator lists it in the comment entry of the property grid definition, next to `autoGrow` and `allowResize`.

### 9.5 Translation tab (`survey-creator-core/src/components/tabs/translation-base.ts`, `translation-side-by-side.ts`)

The translation tab edits strings in three places. All of them already write through a single path (`getProcessedTranslationItemText` → `setItemLocText` / `performItemLocTextAction`), and the stored value stays the source text (Markdown or HTML), so no change is needed in the write path, CSV import/export or machine translation.

1. **Strings grid** (`createStringsSurvey`, area `translation-tab:table`): each string is a `matrixdropdown` row with one `comment` cell per locale, configured in `onMatrixCellCreated`.
2. **Element strings dialog** (`createStringsMatrix` / `onMatrixCellCreated` in the side-by-side model): the same `comment` cells, scoped to one element.
3. **Side-by-side panes**: the target pane (`translation_target`) uses Creator's inline string editor (`editableStringRendererName`) on a copy of each string; the source pane (`translation_source`) is read-only (no string renderer) and renders formatted HTML.

Changes:

- **Grid and dialog cells** (both `onMatrixCellCreated` handlers): when rich strings are enabled (§9.0), resolve the mode with `editor.getStringEditMode(item.context, item.locString.name, item.locString)`; force `"none"` for multi-value strings (`locString.getIsMultiple()`). When it is not `"none"`, set on the cell question: `allowRichText = true`, `richTextEditMode = <mode>`, `richTextToolbarVisibility = "onFocus"`, `richTextConverter = <§9.2.1 converter of the edited survey>`. The existing `acceptCarriageReturn`, `rows`, `maxLength` (counts source characters, §7.5) and `autoGrow` settings stay as they are.
- **Placeholders** of rich cells (`setPlaceHolder`, `item.getPlaceholder`) show the source-locale text, which may contain markup. For rich cells, pass the plain text instead: the `textContent` of the converter's `toHtml(...)`.
- **Target pane:** covered by §9.2 (no translation-surface exclusion). The toolbar is floating, so the row equalizer (`translation-row-equalizer.ts`) is unaffected.
- **Source pane** renders formatted strings when the customer wires `translation-tab:source-survey` (§9.0 sample).
- **Read-only translation** (`translation.readOnly`): cells render formatted, non-editable HTML (§7.5).
- **Machine translation** sends and receives the stored source unchanged. A service may return damaged markup; the built-in Markdown converter then shows it as literal text. Translators fix it in the cell. Markup-aware machine translation is out of scope for v1.

---

## 10. Security requirements

- Built-in converters are XSS-safe by construction (escaping + allow-list). Must be proven by unit tests with known XSS vectors (script tags, event-handler attributes, `javascript:`/`data:` links, quote breaking in `href`, entity tricks).
- Sanitization happens **at display time** (`toHtml`), never only at save time: respondents can submit arbitrary values without using the editor.
- Comment answers: the output of the customer's `onTextMarkdown` handlers is always passed through the built-in allow-list before it reaches the DOM (§6.4), including pass-through handlers (`options.html = options.text`). Stored answers are not sanitized: they are whatever the reverse handler returns. Exports, PDF, analytics and custom viewers that render stored answers outside the plugin must sanitize them themselves; the documentation recommends `RichText.getFormat("html").toHtml`.
- Piped values (`{name}`) are inserted by `textPreProcessor` without HTML escaping before conversion. Built-in Markdown escapes them; the built-in HTML format sanitizes them; for survey strings, pass-through handlers must sanitize (answers are sanitized by the plugin, §6.4). This is documented.
- Documentation must state the customer risks of pass-through HTML: stored XSS, piped values, tags in exports/PDF/analytics, one-way format migration, theme mismatch.
- The same risks apply to raw HTML survey strings (`options.html = options.text` in a customer's `onTextMarkdown` handler). With a pass-through `onHtmlToMarkdown` handler (`options.text = options.html`), the Creator toolbar stores browser-generated markup (`<b>`, `<span style>`, …) as is. The docs recommend `RichText.getFormat("html").toHtml` as a sanitizer in such handlers.

---

## 11. Compatibility requirements

### 11.1 Existing behavior

- No plugin loaded → no behavior change anywhere (library and Creator).
- Plugin loaded, no handler attached → survey strings render and are edited exactly as before, and comment questions with `allowRichText: true` render the standard textarea (§6.4). Only those comment questions change, and only when handlers are attached.
- Existing `onTextMarkdown` handlers are untouched for survey strings: the plugin never pre-fills `options.html`. They start receiving comment answers (`options.name === "value"`) only for questions that get `allowRichText: true`, which is new JSON, so existing surveys are not affected. Recommended migration: replace a markdown-it handler with `RichText.textMarkdownHandler` and attach `RichText.htmlToMarkdownHandler` to `survey.onHtmlToMarkdown`; or keep markdown-it and attach turndown to `survey.onHtmlToMarkdown`. Comment answers, survey strings and the editor then render identically because they share the handlers.
- Creator `onHtmlToMarkdown` handlers are untouched; they are the only save path for survey strings (§9.2).
- `allowRichText` survives loading/saving in environments without the plugin.
- `RichText.findUnsupported(survey, format?)` lets customers find strings/answers that will render differently with the active converter (e.g. raw `<br>` inside Markdown, which the built-in converter shows literally) before attaching the handler. `format` defaults to `"markdown"`. It checks every `useMarkdown` string in every locale against `format` (it uses `getUnsupported` when the converter implements it, otherwise `!isLossless`), and the values of comment questions with `allowRichText` through their answer converter's `checkLossless` (§6.4).

### 11.2 Forward compatibility: a possible move into the main bundle

The feature ships as a plugin first. After one or two minor releases it may move into the main `survey-core` bundle; signals for the move are noticeable adoption, support requests about Markdown shown as raw text in runners that do not load the plugin, the measured bundle size within the §12 target, and an API that did not change since the first release. The plugin must be built so that this move needs **no change in customer code or JSON**:

1. **Explicit switches only.** Comment answers are switched on by the JSON property `allowRichText` (§5.1, declared in core) together with handlers the customer attaches; survey strings by a handler the customer attaches (§4.2). Importing the plugin alone never changes an existing survey (§11.1). After the move, the same JSON and the same handler code (`RichText` re-exported, item 3) behave identically; a survey without a handler still renders strings as plain text.
2. **Small public surface.** Documented API is limited to the `RichText` facade and its types (§4), the converter interface (§4.1), the JSON property `allowRichText`, the survey event `onHtmlToMarkdown` (§5.2), Creator's `registerRichTextEditor` (§9.0), and the CSS classes and CSS variables introduced by `rich-text.scss`. `RichText.attachEditor`, `RichText.getStringEditMode` and the non-serializable properties `richTextEditMode`, `richTextToolbarVisibility` and `richTextConverter` (§6.1) exist for Survey Creator and stay out of the documentation. Creator ships with the same survey-core version, so these may change during the move.
3. **Entry points stay.** After the move, `survey-core/rich-text` (ESM, UMD with the `SurveyRichText` global) remains as a thin alias that re-exports `RichText` from the main bundle, and `rich-text.css` remains as a file (possibly empty), so existing imports and `<link>` tags keep working.
4. **One package, one version.** The plugin is an entry of the `survey-core` npm package, not a separate package, so customers' dependencies do not change.
5. **Stable string keys.** The `richText*` keys (§6.5) keep their names. After the move they live in `english.ts` and the regular translations; `setRichTextStrings` keeps working.
6. **Isolated code.** Plugin code uses core only through the public core API; core never imports from `src/plugins/rich-text/` and has no rich-text slot. All import side effects are listed in §6.1, so the move consists of relocating the folder and running the §6.1 registration from the core entry.
7. **Acceptance test for the move.** The plugin's unit, markup, e2e, screenshot and a11y suites (§13.1–§13.5) pass unchanged after the move, except for import paths.

---

## 12. Repository layout and build

```
packages/survey-core/
  entries/rich-text.ts                       # public surface, version check
  rollup.rich-text.config.mjs                # copy of the collaboration config pattern
  tsconfig.rich-text.json
  src/plugins/rich-text/
    index.ts                                 # import side effects (§6.1), re-exports
    api.ts                                   # RichText facade, converter interface, editor types
    edit-mode.ts                             # getDefaultEditMode (§6.2), bold-hiding rule
    survey-strings.ts                        # markdownToHtml, htmlToMarkdown, handlers, attachEditor (§4.2)
    answer-format.ts                         # answer converter through handlers, canEditRich (§6.4)
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

- **markdown.tests.ts:** subset parsing; escaping; line-break and paragraph rules; single-paragraph unwrapping; inline vs block context; unsupported syntax as literal text; link scheme allow-list; `target`/`rel` on render; plain text → `""` through `RichText.markdownToHtml`.
- **serializer.tests.ts:** DOM-shape normalization (`b`/`strong`, `i`/`em`, `div`/`p`, duplicated nested tags, `span[style]` unwrapped); whitespace movement; overlapping marks including the worked example in §3.3; intraword emphasis; link outermost; lists; escaping of special characters and line-start markers; empty content.
- **roundtrip.tests.ts:** corpus + deterministic generated run sequences; `toSource(toHtml(x))` stability; parse(serialize(runs)) equals runs.
- **html-format.tests.ts:** allow-list; unknown elements unwrapped with text kept; block elements → boundaries; dropped elements with content; attribute stripping; `target`/`rel` on `a` stripped without being reported; `href` schemes; canonical output; XSS vectors; SSR (no DOM) returns `""`.
- **lossless.tests.ts:** equivalent Markdown syntax variants are lossless; tables are lossy with a lossy test converter passed to the internal check (`isConverterLossless`); literal tables are lossless with the built-in Markdown converter but reported by its `getUnsupported`; built-in HTML: content with removed elements/attributes is not lossless, canonical renaming is; `lossless: true` converters skip the check; `checkLossless` takes precedence over the round trip; `findUnsupported` for strings and for comment answers with `allowRichText` (through their answer converter).
- **survey-strings.tests.ts:** plugin loaded without a handler → survey strings render as plain text (no `options.html` pre-fill); `textMarkdownHandler` renders titles inline and descriptions in block context; plain strings keep `hasHtml === false`; `useMarkdown === false` strings untouched; a conditional customer handler calling `markdownToHtml` for some strings only; a pass-through handler (`options.html = options.text`) is unaffected by the plugin; `markdownToHtml` honours an explicit `inline`; for a comment answer (`name: "value"`) the context is inline when `acceptCarriageReturn === false` and block otherwise; `htmlToMarkdown` of a string, of `""`, and without a DOM; `htmlToMarkdownHandler` fills `options.text` and returns `""` for empty HTML; `RichText` has no `registerFormat`; `findUnsupported` with and without the `format` argument (default `"markdown"`).
- **comment-rich-text.tests.ts** (core, with and without the plugin; replaces `comment-text-format.tests.ts`): `allowRichText` default `false` not serialized, `true` survives a load/save round trip; `getComponentName` for comment, an inheriting class, a matrix cell with `cellType: "comment"`, display mode; renderer fallback without plugin; `allowRichText` visibility toggled by plugin; `richTextEditMode`, `richTextToolbarVisibility` and `richTextConverter` not serialized; the comment question has no `textFormat` property, the survey has no `stringFormat` property and `settings` has no `richText` key. Core event: `getSurveyHtmlToMarkdown` returns `null` without handlers and the handler's `options.text` otherwise; the options carry `element`, `name` and `html`; adding a handler does not call `locStrsChanged`.
- **answer-format.tests.ts:** `toHtml` goes through `onTextMarkdown` with `element` = question and `name` = `"value"`; empty handler output → escaped source with `<br>`; handler output is sanitized (a pass-through handler with `<script>`, `onerror`, `javascript:` links and `style` renders none of them); `toSource` goes through `onHtmlToMarkdown`; `checkLossless`: plain text → `true`, handler output with a table or `style` → `false`, a handler pair that does not round-trip → `false`, the built-in pair with links → `true`; `canEditRich`: no survey, no `onTextMarkdown` handler, no `onHtmlToMarkdown` handler, a reverse handler that ignores `"value"` → `false`, both built-in handlers → `true`, read-only → `false`; `richTextConverter` replaces the answer converter and skips the probe.
- **edit-mode.tests.ts:** default modes (description → block, title → inline, non-markdown → none, `html` type → none, owner without a survey → by property name); `RichText.getEditMode` override through `getStringEditMode`; bold-hiding rule (computed `font-weight`).
- **editor-model.tests.ts** (mocked command adapter; the test survey attaches the built-in handler pair): toggle state `all`/`none`/`mixed`; selection save/restore; command dispatch for buttons and shortcuts; Ctrl+U blocked; commit on blur and debounced input per `isInputTextUpdate`; no write on focus/blur without input; external value update and deferral while focused; paste normalization; source mode and "edit anyway"; `maxLength` blocking and command revert; placeholder emptiness; link dialog model validation and empty-URL unlink; format-agnostic mode of `RichText.attachEditor` (toolbar profile per mode, no value writes, no source mode, paste normalized by the allow-list HTML format, `detach` removes listeners).

### 13.2 Markup tests — UI packages

- Shared etalons in `tests/markup/etalon_rich_text.ts` with snapshots in `tests/markup/snapshots/`: rich comment (edit, with placeholder), read-only, display mode, disabled, source mode with notice, HTML answer through a pass-through handler pair (sanitized display), inline mode (`acceptCarriageReturn: false`), plain state (no `onHtmlToMarkdown` handler).
- The markup runners of React, Vue 3, Angular and survey-js-ui must import the plugin and attach the handlers each etalon needs.
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
- A question routed to a pass-through HTML handler pair stores HTML; an externally set value with `<img onerror>` and `<script>` displays without running script.
- No `onHtmlToMarkdown` handler: the question is a standard textarea; display mode still shows the answer formatted.
- `maxLength` blocks typing.
- `acceptCarriageReturn: false` (inline mode, Enter blocked).
- Matrix cell with `cellType: "comment"` and `allowRichText`.
- Survey strings: Markdown titles/descriptions render with the plugin and `RichText.textMarkdownHandler` attached; with the plugin loaded and no handler they render as without the plugin; plain strings render unchanged; a customer handler that calls `markdownToHtml` for titles only leaves other strings plain.
- Keyboard: Tab reaches toolbar then editing area; toolbar buttons operable by keyboard.

### 13.4 Screenshot tests — Playwright VRT (`screenshots/richtext.spec.ts`)

Default empty state with placeholder; focused editor with toolbar; pressed button states; formatted content (bold/italic/strike/link/lists/paragraphs); read-only/display mode; disabled; source mode with notice; link dialog; mobile width; a dark theme; inline mode (bold hidden when the host is bold).

### 13.5 Accessibility tests — axe (`accessibilityTests/richtext.spec.ts`)

Edit mode with toolbar, read-only mode, source mode, open link dialog.

### 13.6 Survey Creator tests (survey-creator repository)

- Unit (`survey-creator-core/tests`): `registerRichTextEditor` with a fake editor; the "rich strings" condition of §9.0 (no editor → today's behavior; editor without `onHtmlToMarkdown` handler → today's behavior; both → rich); string editor mode resolution (none/inline/block, in-place values, translation surface, plain string without `hasHtml` still rich); saving goes through `onHtmlToMarkdown` with `innerHTML` (including empty content); Ctrl+B/I allowed only in rich mode; internal UI surveys do not render Markdown; the §9.2.1 converter (`toHtml` through the edited survey's `onTextMarkdown`, escaped fallback, `toSource` through `onHtmlToMarkdown`, `innerText` fallback); property grid editor JSON (`allowRichText: true`, `richTextEditMode`, `richTextToolbarVisibility`, `richTextConverter` assigned, `html` type untouched); the comment question's `allowRichText` is listed in the property grid when the plugin is loaded; translation tab: grid and dialog cell setup (rich for Markdown strings, plain for multi-value and non-Markdown strings), plain-text placeholders, the target-pane string editor gets the rich mode, edits written through `setItemLocText` store the source unchanged, CSV export/import round trip of formatted strings; behavior without a registered editor unchanged.
- E2E: format a question title (inline, bold hidden) and a description (block, lists) on the design surface; Escape restores; Enter commits; property grid rich editor edits title/description and syncs with the surface; preview tab renders formatting, and a comment question with `allowRichText` is a rich editor there that stores Markdown; translation tab: format a translation in a grid cell, in the element strings dialog and in the side-by-side target pane, and verify the stored locale text and the designer rendering in that locale.
- Screenshots: floating toolbar over a title and over a description; property grid rich editor; translation grid with a focused rich cell and with formatted read-only cells; side-by-side panes with formatted strings.

---

## 14. Execution plan and checkpoints

### 14.1 Rules

- Work is split into milestones. Each milestone ends with a **checkpoint (CP)**: a state that a person can open in a browser and verify by hand using the checklist below.
- Before a checkpoint is presented, the milestone's automated tests and `npm run lint` must be green. A checkpoint is passed when every checklist item shows the expected result; a failed item is fixed within the same milestone.
- The build entry point and the demo page come first (M0), so every later milestone is visible in a browser.
- React is the reference framework for the editor (M3–M4); the other frameworks follow once the behavior is approved (M5).
- Library milestones (M0–M7) and Creator milestones (C1–C5) are separate PRs in separate repositories. Creator work starts after CP4R is passed.

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
- **Handler switch:** each option attaches a pair, one handler to `survey.onTextMarkdown` and one to `survey.onHtmlToMarkdown`: none / built-in (`RichText.textMarkdownHandler` + `RichText.htmlToMarkdownHandler`, the default) / raw HTML (`options.html = options.text` + `options.text = options.html`, demo only) / custom (titles get `"[handler] " + RichText.markdownToHtml(text, { inline: true })`, other strings and answers `RichText.markdownToHtml(text)`; reverse: `RichText.htmlToMarkdownHandler`). In built-in and custom, the answers of `c_html` and `c_unsupported` are routed to the raw HTML pair (the documented per-question sample of §4.2). Switching removes the previous pair, adds the new one and calls `survey.locStrsChanged()` without re-creating the survey; rich comments pick up the change when they next render the editor (§6.4).
- **Reverse handler checkbox** (default on): unchecking detaches the `onHtmlToMarkdown` handler of the current pair, to verify the plain state (§6.4).
- **External converter toggle** (from M7): replaces the built-in pair with markdown-it (`onTextMarkdown`) and turndown (`onHtmlToMarkdown`) handlers, loaded from a CDN on the demo page only, exactly as in the documentation sample.
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

#### M1 — survey-core hook (§5.1)

Scope: comment property and `getComponentName` override. (The earlier `settings.richText` slot, `options.html` pre-fill and survey `stringFormat` are removed in M3R; `textFormat` is replaced by `allowRichText`, and `survey.onHtmlToMarkdown` is added, in M4R.)

Automated: core part of `comment-text-format.tests.ts`; the full existing survey-core suite is green without changed expectations.

**CP1 — core is unchanged without the plugin** (`?plugin=off`).
- [x] Questions `c_md`, `c_html` render as ordinary textareas; typing `**x**` stores `**x**` literally (data panel).
- [ ] "Show JSON" contains `"allowRichText": true` for `c_md` and no `stringFormat` key at the survey level; a plain comment has no `allowRichText` key; no element has a `textFormat` key. *(re-verify after M4R)*
- [x] Titles with Markdown on page "Strings" show raw Markdown characters (no plugin → no rendering), exactly as before the change.

#### M2 — Converters and survey string rendering (§3, §4.2 string functions and handlers, §6.1 item 5, §6.2, §6.3, §7.4 lossless check, §11 `findUnsupported`)

Automated: `markdown`, `serializer`, `roundtrip`, `html-format`, `lossless`, `survey-strings`, `edit-mode` unit tests.

**CP2 — survey strings render rich text; converters are inspectable.** Open the React demo page (plugin on, string handler "built-in"), page "Strings". Items marked *(re-verify after M3R)* changed with the move from `stringFormat` to handlers.
- [x] Survey title, question titles, descriptions and choice texts show bold/italic/strikethrough/links; links open in a new tab.
- [x] The description of `s1` shows two lines, a paragraph break and a bulleted list.
- [x] The title of `s6` (`- not a list in a title`) is shown literally (inline context).
- [x] Plain strings look exactly as with `?plugin=off`.
- [ ] String handler "none": the whole page "Strings" looks exactly as with `?plugin=off`; switching back to "built-in" restores formatting without reloading. *(re-verify after M3R)*
- [x] `s3` and `s4`: no alert appears; the script tag and the `javascript:` link are shown as text.
- [x] `s5` (Markdown table) is shown as literal text with its line breaks.
- [ ] String handler "custom": titles show the `[handler]` prefix and are still formatted; descriptions are formatted without the prefix. *(re-verify after M3R)*
- [ ] String handler "raw HTML": `s7` renders as HTML (red text, a table); this is the customer's pass-through choice, not plugin behavior. *(re-verify after M3R)*
- [x] Converter playground: `__a__` → canonical `**a**`, lossless; a Markdown table → lossless, `getUnsupported` = `["table"]`; HTML format with `<span style="color:red">x</span>` → not lossless, `getUnsupported` lists `style`.
- [x] "Find unsupported" lists `s3`, `s5` and `s7`.

#### M3 — Editor core in React (§6.1 items 1–4, §7.1–§7.3, value flow basics of §7.4, §8 for React)

Scope: `RichTextEditorModel` with the command adapter, toolbar (bold, italic, strikethrough, lists, clear formatting), toggle state, selection save/restore, keys, commit on blur/debounced input, React wrapper, base CSS, icons, strings.

Automated: corresponding `editor-model.tests.ts` cases; React markup etalons for edit mode.

**CP3 — formatting a comment answer.** React demo page, page "Editor".
- [x] `c_md`: the toolbar is hidden until the editing area is focused; then it floats 2px below the field, in the dropdown-popup chrome, and does not change the layout. It uses the survey theme.
- [x] Bold/italic/strikethrough via buttons and via Ctrl/Cmd+B/I; the pressed state follows the caret.
- [x] Worked example of §3.3: data panel shows exactly `Please **read the** ***ter**ms* carefully`, then `Please **r**ead the *terms* carefully` after the second click.
- [x] Clicking a toolbar button keeps the selection.
- [x] Bulleted/numbered list; Enter adds an item; Enter on an empty item leaves the list.
- [x] Enter → `\n\n` in data; Shift+Enter → `\n`.
- [x] Ctrl/Cmd+U does nothing; Ctrl/Cmd+Z undoes the last formatting.
- [x] `c_md` updates the value on blur; `c_typing` updates while typing (event log).
- [x] Focus and leave `c_md` without typing → no new entry in the event log.
- [x] Clear formatting removes marks and turns list items into paragraphs.

#### M3R — Rework: survey strings through handlers (team decision, see `RICH_TEXT_REWORK_CHANGES.md`)

Scope: remove `settings.richText`, `src/rich-text-provider.ts`, the `options.html` pre-fill and the survey `stringFormat` property from survey-core; add `RichText.markdownToHtml`, `htmlToMarkdown`, `textMarkdownHandler`, `htmlToMarkdownHandler`, `getStringEditMode`, `attachEditor` (format-agnostic) and the `richTextConverter` comment property to the plugin; update demo page, tests and Appendix A.

Automated: `survey-strings.tests.ts` (replaces `provider.tests.ts`); updated `comment-text-format`, `edit-mode`, `lossless`, `markdown`, `editor-model` tests; the full existing survey-core suite is green without changed expectations; lint.

**CP3R — the rework keeps every checked behavior.**
- [ ] Re-verify the items of CP1 and CP2 marked *(re-verify after M3R)*.
- [ ] Re-run CP3 on the React demo page: all items still pass.
- [ ] `git grep -n "stringFormat\|settings.richText\|rich-text-provider" packages/` finds nothing outside this spec and the change list.
- [ ] Console: `SurveyRichText.RichText.markdownToHtml("**a**")` → `<strong>a</strong>`; `SurveyRichText.RichText.htmlToMarkdown("<b>a</b>")` → `**a**`; `markdownToHtml("plain")` → `""`.

#### M4 — Editor completeness in React (rest of §7)

Scope: link dialog, paste normalization, `maxLength` and counter, placeholder, `rows`/`autoGrow`/`allowResize`, external value updates with deferral, read-only/disabled/display/design rendering, source mode and "edit anyway", HTML answers (`textFormat: "html"` until M4R, a raw HTML handler pair after it), inline mode, matrix cells, bold hiding, accessibility attributes, theme CSS.

Automated: remaining `editor-model.tests.ts` cases; all React markup etalons.

**CP4 — the comment editor is feature-complete in React.**
- [x] Link: dialog opens; `https://surveyjs.io` creates a link; `javascript:alert(1)` shows the validation error; empty URL removes the link; with no selection the URL is inserted as link text.
- [x] Paste formatted content from a web page or Word (colors, fonts, a table): only supported formatting remains; table text is kept as paragraphs/lines.
- [x] `c_max`: the counter counts source characters; typing stops at the limit; a formatting command that would exceed the limit is reverted.
- [x] Placeholder is visible when empty and disappears on typing; it reappears after deleting everything.
- [x] `c_rows`: initial height of 6 lines, grows with content, can be resized.
- [x] "Set value externally" updates `c_md` immediately when not focused; with the delayed button while typing in `c_md`, the content is updated only after blur and the caret is not disturbed.
- [x] Read-only, display and disabled modes show formatted, non-editable HTML without a toolbar; design mode shows the same.
- [x] `c_unsupported` opens in source mode with the notice; "edit anyway" switches to the rich editor; after editing, the stored HTML contains only allow-list tags. *(re-verify after M4R: the stored value is the editor's HTML returned by the raw HTML pair; the displayed HTML contains only allow-list tags)*
- [x] `c_html` stores canonical HTML (`<strong>`, `<em>`, `<p>`, …) in the data panel. *(re-verify after M4R: `c_html` stores the editor's HTML through the raw HTML pair)*
- [x] `c_inline`: no list buttons; Enter does nothing.
- [x] Matrix `m1`: the comment cell has the rich editor; the cell value is Markdown.
- [x] Dark theme: toolbar, content, links, placeholder and source-mode notice are readable.
- [ ] Narrow (mobile) width: the toolbar fits or wraps without overlapping the content.
- [ ] Screen reader / devtools accessibility tree: textbox with the question title as name, toolbar with pressed states.

#### M4R — Rework: comment answers through handlers (team decision, see `RICH_TEXT_ANSWER_HANDLERS_CHANGES.md`)

Scope: replace the comment property `textFormat` with `allowRichText`; add the survey event `onHtmlToMarkdown` and `getSurveyHtmlToMarkdown` to survey-core (§5); add the answer converter and `canEditRich` to the plugin (§6.4); stop reporting `target`/`rel` in the allow-list (§3.4); answer context for the handlers (§4.2); remove `RichText.registerFormat` (§3.1, §4.2); plain state in the React wrapper (§7.5, §8); update demo page, tests and Appendix A.

Automated: `comment-rich-text.tests.ts` (replaces `comment-text-format.tests.ts`), `answer-format.tests.ts`; updated `survey-strings`, `lossless`, `html-format`, `editor-model` tests; the full existing survey-core suite is green without changed expectations; lint.

**CP4R — the rework keeps every checked behavior.**
- [ ] Re-verify the items of CP1 and CP4 marked *(re-verify after M4R)*.
- [ ] Re-run CP3 and CP4 on the React demo page with the built-in pair: all items still pass.
- [ ] Handler "none": every comment on page "Editor" is a standard textarea; read-only mode shows the raw source.
- [ ] Built-in pair with the reverse handler checkbox off: editable comments are standard textareas without a notice; read-only mode shows `c_md` formatted.
- [ ] Raw HTML pair: in the console, `survey.setValue("c_md", "<img src=x onerror=alert(1)><b>ok</b><script>alert(2)</script>")` shows a bold "ok" and no alert, in edit and read-only mode.
- [ ] Built-in pair: a link typed in `c_md` stays in rich mode after reload of the value (no source mode because of `target`/`rel`).
- [ ] `git grep -n "textFormat\|registerFormat" packages/` finds nothing.
- [ ] Console: `SurveyRichText.RichText.registerFormat` is `undefined`; `SurveyRichText.RichText.getFormat("markdown")` still returns the built-in converter.

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

Scope: documentation article (enabling the plugin, `allowRichText`, attaching `RichText.textMarkdownHandler` / `markdownToHtml` to `onTextMarkdown` and `RichText.htmlToMarkdownHandler` to `survey.onHtmlToMarkdown`, answers in handlers (`options.name === "value"`), HTML answers for selected questions, Creator setup with `registerRichTextEditor` and `onHtmlToMarkdown`, external converters as handlers with the markdown-it/turndown sample, raw-HTML string and pass-through HTML risks, migration with `findUnsupported`); external converter toggle on the demo page.

**CP7 — documentation samples work as written.**
- [ ] The markdown-it/turndown sample, pasted unchanged into the demo page (external converter toggle), renders `s5` as a real table.
- [ ] With the external converter, formatting in `c_md` (bold, italic, lists, links) is stored by turndown and renders identically after reload of the value; italic is stored with `*`.
- [ ] With the external converter, a Markdown table set as the value of `c_md` opens in source mode (the allow-list removes the table, §6.4).
- [ ] Every other code sample in the article runs without changes.

#### C1–C5 — Survey Creator integration (survey-creator repository, §9)

**C1 — registration and rendering (§9.0, §9.1).** CP-C1 on the Creator demo page (demo survey of Appendix A loaded into Creator; the page runs the §9.0 setup sample, with toggles to skip `registerRichTextEditor` and to skip the `onHtmlToMarkdown` handler):
- [ ] The designer, preview, theme and translation source/target surveys show formatted titles/descriptions/choices.
- [ ] Property grid labels and property hints look exactly as with `?plugin=off`.
- [ ] Preview tab shows formatted strings and working rich comment editors; a typed answer is stored as Markdown (the sample attaches `survey.onHtmlToMarkdown`). Without that line, the comments in the preview tab are standard textareas.
- [ ] Without `registerRichTextEditor`, or without the `onHtmlToMarkdown` handler: strings still render formatted (the `onTextMarkdown` handler is attached), and every string editor behaves exactly as today (no toolbar).
- [ ] With `?plugin=off` (no handlers, no registration), Creator looks and behaves as before.

**C2 — inline string editor (§9.2, §9.3).** CP-C2:
- [ ] Click a question title: floating toolbar with italic/strikethrough/link/clear (no bold because the title is bold, §4.4; no lists); Enter commits; Escape restores the previous text.
- [ ] Click a description: toolbar with bold and lists; Enter in a list item adds an item; Enter elsewhere commits.
- [ ] A plain (unformatted) title also gets the toolbar; making a word italic stores `*word*`.
- [ ] Ctrl/Cmd+B/I work in rich strings; after commit, Creator undo/redo reverts/reapplies the change.
- [ ] Choice texts get the inline toolbar; with `inplaceEditChoiceValues` the plain editor is used.
- [ ] JSON tab shows Markdown for edited strings (produced by `RichText.htmlToMarkdownHandler`).
- [ ] With a pass-through demo setup (`options.html = options.text` and `options.text = options.html`), edited strings are stored as HTML.

**C3 — property grid (§9.4).** CP-C3:
- [ ] Question title and description editors are rich (inline/block toolbars), rendered and saved through the customer's handlers (§9.2.1); edits appear on the design surface and vice versa.
- [ ] `requiredErrorText` and `completedHtml` editors stay plain.
- [ ] A comment question's property grid shows `allowRichText` next to `autoGrow`/`allowResize`; turning it on shows a formatted default value on the design surface and a rich editor in the preview tab. With `?plugin=off` the property is not shown.

**C4 — translation tab (§9.5).** CP-C4 on the Creator demo page, after adding German (`de`) in the translation tab:
- [ ] Strings grid: Markdown strings show the toolbar only in the focused cell, floating, without changing row heights; titles get the inline toolbar, descriptions the block toolbar.
- [ ] Empty `de` cells show the default-locale text as a plain-text placeholder (no `**`).
- [ ] Format a `de` translation of `s1`'s title; switching the designer to `de` shows the formatted title; the JSON tab stores Markdown under `"de"`.
- [ ] Strings without Markdown support and multi-value strings stay plain.
- [ ] Element strings dialog: same behavior as the grid; edits appear in the grid and the side-by-side panes.
- [ ] Side-by-side view: the source pane shows formatted read-only strings; the target pane edits with the floating toolbar; rows of both panes stay aligned while editing.
- [ ] Read-only translation: cells show formatted, non-editable HTML.
- [ ] Export to CSV and import back: formatted translations are unchanged.
- [ ] With `?plugin=off` or without `registerRichTextEditor`, the translation tab editors behave as before.

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

Used by every demo page (§14.2). Keep the copies in all demo pages identical. Survey strings and comment answers are rendered and saved by the handler pair selected with the demo page's handler switch (§14.2), not by the JSON. With the built-in and custom pairs, `c_html` and `c_unsupported` are routed to the raw HTML pair.

```json
{
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
        { "type": "comment", "name": "c_md", "title": "Markdown answer", "allowRichText": true, "placeholder": "Type and format text" },
        { "type": "comment", "name": "c_typing", "title": "Updates while typing", "allowRichText": true, "textUpdateMode": "onTyping" },
        { "type": "comment", "name": "c_html", "title": "HTML answer", "allowRichText": true },
        { "type": "comment", "name": "c_inline", "title": "Inline mode", "allowRichText": true, "acceptCarriageReturn": false },
        { "type": "comment", "name": "c_max", "title": "Max length 50", "allowRichText": true, "maxLength": 50 },
        { "type": "comment", "name": "c_rows", "title": "Rows, autoGrow, resize", "allowRichText": true, "rows": 6, "autoGrow": true, "allowResize": true },
        {
          "type": "comment", "name": "c_unsupported", "title": "Unsupported stored content", "allowRichText": true,
          "defaultValue": "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>"
        },
        {
          "type": "matrixdropdown", "name": "m1", "title": "Matrix with a rich comment cell",
          "columns": [{ "name": "notes", "cellType": "comment", "allowRichText": true }],
          "rows": ["Row 1"]
        }
      ]
    }
  ]
}
```
