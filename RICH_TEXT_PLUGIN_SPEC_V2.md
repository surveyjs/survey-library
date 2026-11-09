# Rich Text Editor Plugin — Specification (v2, HTML storage)

This document is the single source of truth for building the SurveyJS rich text editor plugin. It supersedes `RICH_TEXT_PLUGIN_SPEC.md` and `RICH_TEXT_ANSWER_HANDLERS_CHANGES.md`. It goes from general decisions to implementation details. When an implementation detail seems to conflict with a general rule, the general rule wins; report the conflict instead of resolving it silently.

The main change from the previous version: **rich text is stored as HTML**. There is no Markdown and no format conversion; the only processing step is the built-in allow-list sanitizer. Existing events keep their behavior and no new events are added. Code written for the previous version is brought in line by milestone M4H (§14.3).

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
- **No hard dependency on external libraries.** The plugin has zero runtime dependencies.
- **Minimum functionality** that survey authors actually need. No tables, images, colors, font sizes, alignment.
- **Opt-in and zero cost when unused.** A survey that does not load the plugin downloads no plugin JS/CSS and behaves exactly as today.
- **In rich text mode the value is always HTML.** Rich comment answers and survey strings rendered by the plugin are read as HTML and stored as canonical HTML (§3.2), whoever wrote them. There is no plain-text branch and no content-based classification. The plugin converts nothing; it only sanitizes.
- **Text without markup is stored as typed.** The sanitizer escapes only what HTML parsing requires, and a line feed is a line break (§3.2). So a value without formatting looks like plain text in JSON, exports and translations, and plain text written by other code renders as typed.
- **Existing events are unchanged; no new events.** `survey.onTextMarkdown` and Creator's `onHtmlToMarkdown` keep their options, firing sites and meaning. The only handler the plugin exports is the string render handler for `survey.onTextMarkdown` (§4.1), because that event is the only way survey-core renders a string as HTML. Comment answers are rendered and saved by the plugin directly and never pass through events. Creator saves rich strings through the registered editor (§9.0).
- **Explicit switches.** A comment question switches to the rich editor only through its boolean JSON property `allowRichText`. Survey strings render as HTML only when the customer attaches a handler to `onTextMarkdown`. Loading the plugin alone never changes how an existing survey renders.
- **Stored HTML is untrusted.** Respondents can submit arbitrary values without the editor, and JSON can be edited by hand. Everything the plugin renders passes through the sanitizer at display time (§10).
- **Never lose data silently.** A stored value that the sanitizer would change materially is never opened in the rich editor; it is edited as source (§6.4).
- **Movable into the main bundle.** The feature ships as a plugin first and must be movable into the main `survey-core` bundle later without breaking customer code or JSON (§11.2).
- **Backward compatibility.** Existing `onTextMarkdown` / Creator `onHtmlToMarkdown` handlers keep working unchanged.

---

## 2. Key decisions (summary)

| Topic | Decision |
|---|---|
| Storage format | Always HTML: canonical HTML (§3.2) with minimal escaping, so unformatted text is stored as typed. No format property in JSON. |
| Processing | Built-in allow-list HTML sanitizer only. No Markdown, no converters, no converter registry. |
| Features | Bold, italic, strikethrough, link, bulleted list, numbered list, line breaks/paragraphs, clear formatting. |
| Not supported | Tables, images, headings, colors, font size/family, alignment, underline, nested lists, code, blockquotes. |
| Distribution | Separate entry point of the `survey-core` npm package: `survey-core/rich-text` (ESM + UMD + CSS), same pattern as `survey-core/collaboration`. Designed so it can later move into the main bundle without breaking changes (§11.2). |
| Activation — comment answers | By survey JSON: boolean comment property `allowRichText` (declared in core, made visible by the plugin). No handler is needed. |
| Activation — survey strings | By customer code: attach `RichText.renderStringHandler` to `survey.onTextMarkdown`. No JSON property, no setting. |
| Events | None added, none changed. `survey.onTextMarkdown` renders survey strings through `RichText.renderStringHandler`. Creator's `onHtmlToMarkdown` stays an optional customer override; no plugin handler is attached to it. |
| Source location | `packages/survey-core/src/plugins/rich-text/` + thin wrappers in UI packages. |
| Core ↔ plugin contract | None beyond public core APIs: core declares `allowRichText` and asks `RendererFactory` for the `"richtext"` comment renderer. Core never imports the plugin and has no rich-text slot in `settings`. |
| Creator ↔ plugin contract | Creator never imports the plugin. The customer registers it explicitly: `creator.registerRichTextEditor(RichText)` (§9). Creator enables the rich toolbar for survey strings when an editor is registered **and** the designed survey has an `onTextMarkdown` handler, and saves rich strings with the editor's `sanitizeHtml`. |

---

## 3. Data model and formats

### 3.1 Storage

There is no format property in JSON, neither for survey strings nor for comment answers.

- **Comment answers** (`allowRichText: true`): the value is always HTML. The plugin writes `""` or canonical HTML. Values written by other code (`setValue`, `defaultValue`, answers collected before `allowRichText` was turned on, collaboration, data from a server) are read as HTML too and sanitized on display (§3.3, §6.4).
- **Survey strings**: with `RichText.renderStringHandler` attached (§4.1), every string is read as HTML. Strings saved by the Creator rich editor are canonical HTML. Without the handler, strings render as plain text, as today.

### 3.2 Canonical HTML

Canonical HTML is the only HTML the plugin writes. It is produced by the sanitizer (§3.4), both for storage and for display.

- **Tags:** `strong`, `em`, `s`, `a`, `ul`, `ol`, `li`, `p`, `br`.
- **Attributes:** only on `a`: `href` with an `http:`, `https:` or `mailto:` URL, followed by `target="_blank" rel="noopener noreferrer"`. Every link carries these two attributes (navigating away would lose survey answers), so stored HTML is safe to render as is by any consumer. A link with any other scheme is unwrapped (its text is kept).
- **Blocks (block context):** the content is a sequence of paragraphs and lists. A single paragraph alone is written **without** a `<p>` wrapper. When there are two or more blocks (paragraphs or lists), every paragraph is wrapped in `<p>`. A line break inside a paragraph or list item is `<br>`. Lists are not nested. Empty paragraphs and empty list items are removed.
- **Inline context:** no blocks. Blocks are joined with `<br>` into one paragraph without a wrapper; list items become lines. Used for single-line strings, whose serializer type is not `text` (§6.2, §6.3): choice texts and the survey title. Question, page and panel titles are type `text`, so they use the block context.
- **Marks:** adjacent runs with identical marks are merged. Whitespace at the edges of a mark span is moved outside the mark (`<strong>word </strong>` → `<strong>word</strong> `). Nesting order: a link is always outermost; among other marks, the mark that ends first is inside.
- **Escaping (minimal):** in text, `&` is escaped only when followed by a letter, a digit or `#`, and `<` only when followed by a letter, `/`, `!` or `?`. These are exactly the cases where the HTML parser would read a character reference or markup; in every other case the parser keeps the character as is. `>` and `"` are not escaped in text. In `href`, `&` and `"` are escaped. So `Tom & Jerry` and `a < b` are written as typed.
- **Line feeds:** a line feed (`\n`, `\r\n` or `\r`) inside text is a line break and is written as `<br>`. Line feeds and other whitespace at the start and end of a paragraph or list item, and whitespace-only text between blocks, are removed. Other whitespace is kept. Canonical HTML never contains a raw line feed.
- **Empty content:** content without text (only whitespace and line breaks) is `""`.
- **Idempotent:** sanitizing canonical HTML returns it unchanged.

Examples (each must be a unit test):

| Input | Canonical HTML (block context) |
|---|---|
| `<b>a</b>` | `<strong>a</strong>` |
| `<p>one</p>` | `one` |
| `<div>one</div><div>two</div>` | `<p>one</p><p>two</p>` |
| `<ul><li>a</li></ul>tail` | `<ul><li>a</li></ul><p>tail</p>` |
| `a` + line feed + `b` | `a<br>b` |
| `<p>` + line feed + `  one` + line feed + `</p>` | `one` |
| `Tom & Jerry` | `Tom & Jerry` |
| `Tom &amp; Jerry` | `Tom & Jerry` |
| `R&amp;D` | `R&amp;D` |
| `a &lt;b&gt; c` | `a &lt;b> c` |
| `<span style="color:red">x</span>` | `x` |
| `<a href="https://x">x</a>` | `<a href="https://x" target="_blank" rel="noopener noreferrer">x</a>` |
| `<a href="javascript:alert(1)">x</a>` | `x` |
| `<p><br></p>` | `""` |

Worked example (must be a unit test and an e2e test): value `Please <strong>read</strong> the <em>terms</em> carefully`, the user selects `ead the ter` and applies bold → `Please <strong>read the </strong><em><strong>ter</strong>ms</em> carefully`. Applying bold again to the same selection → `Please <strong>r</strong>ead the <em>terms</em> carefully`.

### 3.3 Values from other sources

There is one rule for every value in rich text mode: it is HTML. It is displayed as `sanitizeHtml(value)` and stored as `sanitizeHtml(editorHtml)` (§6.4, §9.2). Nothing decides from the content whether a value is "plain" or "HTML".

Plain text written by other code (a plain `defaultValue`, `setValue`, answers typed in a textarea before `allowRichText` was turned on, strings of existing surveys once `renderStringHandler` is attached) is therefore read as HTML. Thanks to the line-feed rule and minimal escaping of §3.2, it renders as typed. The only exceptions are sequences that are markup by HTML parsing rules:

| Value written by other code | Displayed as | Edit mode |
|---|---|---|
| `Typed: a < b & c` + line feed + `Second line` | `Typed: a < b & c<br>Second line` | rich editor |
| `Press <Enter> to continue` | `Press  to continue` | source mode (`enter` is reported, §6.4) |
| `&copy; 2026` | `© 2026` | rich editor |

Unknown tags are reported by `getDisallowedHtml`, so such values open in source mode and are found by `RichText.findUnsupported` (§4.1); their data is never lost silently. Character references are decoded on display, which is rare in plain text and changes only the display.

### 3.4 Built-in HTML sanitizer (allow-list)

Two functions in `sanitizer.ts`: `sanitizeHtml(html, inline)` and `getDisallowedHtml(html)`. They are used for every display of rich content (§6.4), for storing editor content (§6.4, §9.2), for paste (§7.4), and are available as `RichText.sanitizeHtml` / `RichText.getDisallowedHtml` (§4.1).

- **Input accepted:** `b`/`strong`, `i`/`em`, `s`/`strike`/`del`, `a[href]`, `ul`/`ol`/`li`, `p`/`div`, `br`. They are renamed to canonical tags (§3.2).
- **Unknown elements** are unwrapped, keeping their text. Block-level unknown elements (`div` inside content, `h1`–`h6`, `table`, `tr`, `td`, `blockquote`, `pre`, …) become paragraph/line boundaries so text does not run together.
- **Dropped with their content:** `script`, `style`, `iframe`, `object`, `embed`, `template`, `noscript`.
- **Attributes:** all are removed except `a[href]` with an allowed scheme. `target` and `rel` on `a` are removed **without being reported** and replaced by the canonical pair (§3.2), so canonical HTML is never reported.
- **Nested lists** are flattened into the outer list.
- **Output:** canonical HTML (§3.2) for the given context.
- **Paste option:** an internal flag collapses each run of whitespace in text, line feeds included, into one space before the line-feed rule applies. It is used only for pasted HTML (§7.4): line feeds in another page's HTML source were not line breaks there.
- **Reporting:** the allow-list pass reports everything it removes or unwraps: element names, attribute names (e.g. `style`), disallowed `href` schemes, and `"nested-list"`. `getDisallowedHtml` returns these kinds. Renaming to canonical tags (`b` → `strong`, `div` → `p`), escaping, the whitespace rules and the canonical link attributes are not reported.
- **No DOM available (SSR):** `sanitizeHtml` returns `""`, so callers render the value as escaped text; `getDisallowedHtml` returns `[]`.

---

## 4. Public API of the plugin

### 4.1 `RichText` facade (exported from `survey-core/rich-text`)

```ts
// Sanitizer (§3.4): used for display and for storage
RichText.sanitizeHtml(html: string, options?: { inline?: boolean }): string; // block context by default
RichText.getDisallowedHtml(html: string): string[];

// Survey strings: handler for the existing survey.onTextMarkdown event
RichText.renderStringHandler: (sender: SurveyModel, options: TextMarkdownEvent) => void;

// Migration
RichText.findUnsupported(survey: SurveyModel): Array<{ element: Base, name: string, locale: string, text: string }>;

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

- `renderStringHandler` computes `html = sanitizeHtml(options.text, { inline })`, with `inline = getStringEditMode(options.element, options.name, locStr) !== "block"` (§6.3), and assigns it to `options.html` when it differs from `options.text`. When they are equal, the string has no markup and the HTML rendering would be identical to the plain one, so the handler leaves `options.html` untouched and the string keeps today's plain-text path (`LocalizableString.hasHtml === false`). This compares output with input; it does not classify the content. The handler is needed because survey-core renders a string as HTML only when an `onTextMarkdown` handler sets `options.html`.
- There is no save handler. Comment answers are saved by the plugin (§6.4); strings edited in Creator are saved by Creator through the registered editor's `sanitizeHtml` (§9.2).
- `findUnsupported` reports every `useMarkdown` string in every locale, and every non-empty value of a comment question with `allowRichText`, for which `getDisallowedHtml` is not empty.
- `attachEditor` adds the toolbar and keyboard behavior to a `contenteditable` element and never reads or writes a value. The caller owns the content (Creator: saves `sanitizeHtml(innerHTML)`, §9.2). Paste is sanitized (§7.4).
- Also export `RichTextEditorModel` and all public types.
- Documented usage:

  ```js
  // Survey strings stored as HTML:
  survey.onTextMarkdown.add(RichText.renderStringHandler);

  // Conditional use / post-processing in the customer's own handler:
  survey.onTextMarkdown.add((sender, options) => {
    if (options.name === "title") options.html = RichText.sanitizeHtml(options.text, { inline: true });
    else RichText.renderStringHandler(sender, options);
  });

  // Rendering a stored rich answer outside the survey (export, custom viewer):
  element.innerHTML = RichText.sanitizeHtml(answer);
  ```

  Comment answers need no code: `allowRichText: true` in JSON is enough.

### 4.2 Handler contract (documented, not enforced)

Applies to the customer's own handlers on `survey.onTextMarkdown`, and to `creator.onHtmlToMarkdown` handlers when the rich toolbar is used in Creator:

1. The `onTextMarkdown` handler must return safe HTML. Customers who pass strings through (`options.html = options.text`) should call `RichText.sanitizeHtml` instead.
2. A `creator.onHtmlToMarkdown` handler is not needed for rich strings. If a customer has one, it overrides the value Creator stores for strings edited on the design surface (§9.2), so it must store HTML the `onTextMarkdown` handler can render. The rich toolbar is designed for HTML storage: the property grid and translation cells write HTML directly (§9.4, §9.5). Customers who store another format (e.g. markdown-it + turndown) do not register the editor (§9.0).

Comment answers are not affected by handlers.

### 4.3 Edit modes (toolbar profiles)

```ts
type RichTextEditMode = "none" | "inline" | "block";
```

- `none`: the plain (existing) editor.
- `inline`: bold, italic, strikethrough, link, clear formatting.
- `block`: `inline` plus bulleted list and numbered list.
- The **bold** button is always available, including on strings the theme renders bold (titles). There is no special handling for such strings: in a host that is already bold, `execCommand("bold")` un-bolds the text with a `<span style>` that the sanitizer drops, so the button may have no effect on the stored value. This is accepted.

---

## 5. survey-core changes (outside the plugin)

### 5.1 `comment` question: `allowRichText`

In `question_comment.ts`:

- `@property() allowRichText: boolean;` and serializer entry `{ name: "allowRichText:boolean", default: false, visible: false }`.
- Override `getComponentName()`: if `allowRichText` is `true`, return `RendererFactory.Instance.getRenderer("comment", "richtext")` when it is not `"default"`; otherwise call `super.getComponentName()`. Use the literal `"comment"` type (not `getType()`) so inheriting question types are covered. The check runs before the view-mode fallback so the plugin's component also renders display/read-only mode.
- Without the plugin: the renderer is not registered → the default textarea shows the stored value as is (HTML tags visible); `allowRichText` remains in JSON; no data is lost.

Same precedent: `QuestionBooleanModel.getComponentName()`.

### 5.2 Nothing else

This is the only change to survey-core. survey-core has **no** new event, no rich-text setting, no provider slot and no format property. Survey strings keep today's code path (`getSurveyMarkdownHtml` pre-fills `options.html` with `null` and fires `onTextMarkdown`); the plugin plugs into it only through handlers the customer attaches.

Out of scope: the library's own in-place string editor (`SurveyLocStringEditor`, used by `survey.setDesignMode(true)`). It keeps today's behavior; Survey Creator is the editing surface for formatted survey strings.

---

## 6. Plugin architecture (survey-core/rich-text)

### 6.1 What happens on import

1. Make `allowRichText` visible: `Serializer.findProperty("comment", "allowRichText").visible = true`.
2. Register the renderer: `RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment")`.
3. Register the toolbar icons via `SvgRegistry.registerIcons(...)`. They are filled icons from Material Icons (Apache-2.0, noted in `icons.ts`): single-path 24×24 SVGs without their own colors, so the action bar colors them through `fill`, the same way as the built-in icons.
4. Call `checkLibraryVersion(Version, "survey-core-rich-text")`.

Importing the plugin assigns nothing in `settings`, adds no event handlers and registers no other properties. It affects only comment questions with `allowRichText: true`.

The edit mode of a comment editor comes from an existing property: `"inline"` when `acceptCarriageReturn === false`, otherwise `"block"`. Creator configures its rich cells through the same property (§9.4, §9.5).

### 6.2 Default edit mode resolution (`RichText.getStringEditMode`)

```ts
function getDefaultEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode {
  if (!locStr || !locStr.useMarkdown) return "none";
  const type = Serializer.findProperty(owner.getType?.(), name)?.type;
  if (type === "html") return "none";
  return type === "text" ? "block" : "inline";
}
```

The mode is decided by the serializer property type, not by the property name. Type `text` is the multiline string: in the property grid, `PropertyGridEditorText` matches `prop.type === "text"` and creates a question of type `comment`. That is the same condition as `SurveyElementCore.getAllowLineBreaks`. Every other rich string is `inline`, including type `string`, which `PropertyGridEditorString` edits as a single-line `text` question.

Consequences of the registered types: question, page and panel `title` and `description` are `text`, so they are `block`; the survey `title` and a choice `text` (`itemvalue`) are `string`, so they are `inline`. A string with `useMarkdown === false` is `none` even when its type is `text` (`requiredErrorText`). A property that is not registered is `inline`.

The result is passed to `RichText.getEditMode(owner, name, locStr, defaultMode)` (customer override). Used by the handlers to choose the inline or block context, and by Creator to choose the toolbar profile. Whether survey strings render as HTML at all is decided by the customer's handlers, not here.

### 6.3 Rendering context

- Survey strings: `inline` = `getStringEditMode(...)` is not `"block"`.
- Comment answers: `inline` = `acceptCarriageReturn === false` (§6.1).

### 6.4 Comment answers

Comment answers never pass through events. The plugin renders and stores them itself, in the context of §6.3. The value is always HTML (§3.3):

- **Display**, used for read-only, display and design modes and for the initial content of the editor: `sanitizeHtml(value, inline)`.
- **Storing:** `sanitizeHtml(editor.innerHTML, inline)`.
- **Source mode condition:** `getDisallowedHtml(value)` is not empty (e.g. a table, a `style` attribute, an image, an unknown tag such as `<Enter>`). Sanitizing such a value would drop content, so the editor shows the stored value as source instead (§7.4).
- **Rich editing condition:** the question is editable (not read-only, not in display or design mode). There is no other condition: the rich editor does not depend on handlers.

`onTextMarkdown` handlers never receive comment answers, so existing handlers are not affected by `allowRichText`.

### 6.5 Strings and localization

- `src/plugins/rich-text/rich-text-strings.ts`, same pattern as `collaboration-strings.ts` (own English strings + `setRichTextStrings`).
- Keys: `richTextToolbar` "Formatting", `richTextBold` "Bold", `richTextItalic` "Italic", `richTextStrikethrough` "Strikethrough", `richTextLink` "Link", `richTextBulletedList` "Bulleted list", `richTextNumberedList` "Numbered list", `richTextClearFormatting` "Clear formatting", `richTextLinkUrl` "URL", `richTextLinkInvalid` "Enter a link that starts with http://, https://, or mailto:", `richTextSourceMode` "This text contains formatting the editor cannot change. You are editing its source.", `richTextEditAnyway` "Edit as rich text (unsupported formatting will be removed)".

---

## 7. Editor behavior (`RichTextEditorModel`)

The model is framework-agnostic and attaches to any `contenteditable` element (`attach(element)` / `detach()`). It is used by the comment question wrappers (value mode) and, through `RichText.attachEditor` (content-agnostic mode, §4.1), by Survey Creator.

### 7.1 Editing engine

- `contenteditable` + `document.execCommand` for: `bold`, `italic`, `strikeThrough`, `createLink`, `unlink`, `insertUnorderedList`, `insertOrderedList`, `removeFormat`, `insertText`, `insertHTML`. Set `styleWithCSS` to `false`.
- `execCommand` is accessed through a small injectable command adapter so unit tests can mock it (jsdom does not implement `execCommand`).
- Browser markup differences never reach stored data: only `sanitizeHtml` output is stored.

### 7.2 Toolbar and commands

- Toolbar = `ActionContainer` rendered by the existing `sv-action-bar` (compact size). On the comment question it is a floating overlay **below** the editing area and does not take space in the layout. It is shown only while focus is inside the editor, the toolbar, or the link dialog. In the DOM it follows the editing area, so Tab from the field reaches the buttons once they are shown. Clicking a button does not move focus (`mousedown` is cancelled), so the toolbar stays open.
- The floating box uses the dropdown popup chrome: a 2px gap below the field (the same offset as `.sv-dropdown-popup.sv-popup--menu-popup.sv-popup--bottom`), `padding: var(--sjs2-spacing-x050)` (the popup list padding), and the border, radius, background and shadow of `.sv-popup--menu-popup > .sv-popup__container`. The action bar is the only content inside that box.
- The Creator inline string editor uses the same floating toolbar (§9.2).
- Clicking a toolbar button must not lose the selection: the model saves the selection `Range` on every `selectionchange` inside the element and restores it (and focus) before executing a command.
- Toggle state is computed by the model (not `queryCommandState`): walk text nodes in the selection → `all` / `none` / `mixed`. A button is pressed (`aria-pressed="true"`) only for `all`. Command semantics: `all` → remove; `none`/`mixed` → apply to the whole selection.
- Collapsed selection: the command sets the typing style for subsequent input (native behavior); the button reflects it.
- Keyboard: Ctrl/Cmd+B and Ctrl/Cmd+I run the same model actions (respecting the button's visibility and enabled state); Ctrl/Cmd+U is blocked.
- **Link:** opens a dialog through `settings.showDialog` with `componentName: "survey"` and a small `SurveyModel` containing one text question (`url`), same approach as `showRecordsSortDialog`.
  - The dialog survey uses the `DefaultLightPanelless` theme, so the single field has no panel chrome.
  - The URL field is pre-filled with the `href` of the existing link when the whole selection (or the caret) is inside one link; otherwise it is empty.
  - The popup container is passed to `settings.showDialog` as its root: the closest `.sd-rich-text` element (the box that holds the editing area and the toolbar), or the editing element's parent when there is none. It is never the `contenteditable` element itself, where the popup would become part of the edited text.
  - Validation: allowed schemes only. On Apply, an invalid URL shows the `richTextLinkInvalid` message under the field and the dialog stays open.
  - Apply: an empty URL removes the link. When the selection is inside one existing link, its `href` is replaced in place: the link text is kept and the selection is restored to the same text offsets. With a collapsed selection outside a link, the URL is inserted as the link text. Otherwise the selection becomes the link text.
  - If `settings.showDialog` is not set, the link action is hidden; visibility is re-checked on attach, because the dialog host may mount after the first toolbar is built.
- **Clear formatting:** removes bold/italic/strike/link from the selection and converts list items in the selection to paragraphs.

### 7.3 Keys

- Comment question, `block` mode: Enter → new paragraph; Shift+Enter → line break; Enter inside a list item → new item; Enter in an empty list item → leaves the list.
- `inline` mode (for a comment question, `acceptCarriageReturn === false`): Enter is blocked (existing auto-advance behavior via `isAutoAdvanceEnter` is preserved).
- Tab is never captured (it moves focus).

### 7.4 Value flow (value mode)

- **Rich mode:** editor content is set from `sanitizeHtml(value)` (§6.4).
- **Source mode** (source mode condition of §6.4): the standard textarea is shown with the stored value, plus the `richTextSourceMode` notice and a `richTextEditAnyway` action that switches to rich mode for this session. The textarea stores what is typed, exactly as without the plugin; the value is sanitized on display. The condition is cached per value and re-evaluated when the value changes from outside and when an editing session starts.
- **Committing:** on blur always; additionally on `input` (debounced) when `question.isInputTextUpdate` is true. The stored value is `sanitizeHtml(element.innerHTML)`. Only real `input` events commit; focusing and leaving without changes never rewrites the value (a value written by other code stays byte-for-byte the same).
- **External value changes** (`setValue`, expressions, collaboration): re-render the element only if the new value differs from the last committed value. If the element is focused, defer the re-render until blur.
- **Paste:** always intercepted. `text/html` → `sanitizeHtml` with the paste option (whitespace collapsed first, §3.4) → `insertHTML`. `text/plain` → `insertText`. The same in value mode and content-agnostic mode.
- **Undo/redo:** native (provided by `execCommand`).
- **Content-agnostic mode** (`RichText.attachEditor`, Creator string editor): no source mode, no value reads or writes, no commits. The model only runs commands, keys, toolbar state and paste sanitizing; the caller owns the content.

### 7.5 Comment question integration details

- `placeholder`: rendered via `data-placeholder` + CSS `:empty::before`; the model keeps the element truly empty (removes a lone `<br>`).
- `rows` → minimum height; `autoGrow` → grows with content, otherwise fixed height with scroll; `allowResize` → CSS vertical resize.
- `maxLength` counts **visible characters**: text characters, plus one for each line break and each boundary between blocks. Markup is not counted, so formatting commands never change the count. The character counter shows the remaining visible characters. Typing and paste are blocked (`beforeinput`) when the limit is reached. The stored HTML can be longer than `maxLength`.
- Read-only, disabled, display mode and design mode (Creator surface): render `sanitizeHtml(value)` in a non-editable element with the existing view-mode CSS class; no toolbar. Empty value renders like today.
- The editing area uses `white-space: pre-wrap` (as today), so the browser stores typed spaces as regular spaces rather than `&nbsp;`. The display element uses `pre-wrap` too, so repeated spaces render the same in both.
- Accessibility: editing element `role="textbox"`, `aria-multiline="true"` in block mode, and `aria-label`/`aria-labelledby`/`aria-describedby`/`aria-required`/`aria-invalid`/`aria-errormessage` from the question's `a11y_input_*` properties (same sources as `TextAreaModel`). Toolbar: `role="toolbar"`, `aria-label` = `richTextToolbar`, `aria-controls` = editing element id.
- `isEmpty` and required validation work without changes: content without text is stored as `""` (§3.2).
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
3. Render source mode by reusing the existing `TextAreaComponent` plus the notice/action. The wrapper reads the state from the model.
4. Render read-only/display mode as non-editable HTML from the model.

No business logic in wrappers. Target size: ~30–40 lines per framework.

---

## 9. Survey Creator integration (survey-creator repository)

Creator never imports the plugin. Without a registered editor, Creator behaves exactly as today.

### 9.0 Registration and the "rich strings" condition

- Creator API: `creator.registerRichTextEditor(editor: ICreatorRichTextEditor | undefined)`. `ICreatorRichTextEditor` is declared in survey-creator-core and is satisfied structurally by the plugin's `RichText`:

  ```ts
  interface ICreatorRichTextEditor {
    getStringEditMode(owner: Base, name: string, locStr: LocalizableString): "none" | "inline" | "block";
    attachEditor(element: HTMLElement, options: { mode: "inline" | "block"; onInput?: () => void }): { toolbar: ActionContainer; detach(): void };
    sanitizeHtml(html: string, options?: { inline?: boolean }): string;
  }
  ```

- **Rich strings are enabled** when an editor is registered **and** the designed survey (`creator.survey`, area `"designer-tab"`) has an `onTextMarkdown` handler (`!creator.survey.onTextMarkdown.isEmpty`). Without that handler the design surface renders stored HTML as text, and saving it would store the text escaped. Otherwise every Creator editor behaves exactly as today. Creator only reads the event's state; it does not attach or change handlers.
- The `checkMarkdownToTextConversion` probe of `creator.onHtmlToMarkdown` is no longer part of the condition. It keeps deciding `editAsText` for strings whose rich mode is `"none"`, exactly as today.
- Documented setup:

  ```js
  import { RichText } from "survey-core/rich-text";
  creator.registerRichTextEditor(RichText);
  creator.onSurveyInstanceCreated.add((_, options) => {
    if (["designer-tab", "preview-tab", "theme-tab", "translation-tab:source-survey",
         "translation-tab:target-survey", "matrix-cell-question-popup-editor"].indexOf(options.area) > -1) {
      options.survey.onTextMarkdown.add(RichText.renderStringHandler);
    }
  });
  ```

- The `onTextMarkdown` handler is required for rich strings (see the condition above); the documentation states this next to the sample. No `creator.onHtmlToMarkdown` handler is needed.
- Comment answers with `allowRichText` need no setup: they are rich editors in the preview and theme tabs whenever the plugin is loaded.
- Customers whose handlers store another format (e.g. markdown-it + turndown) do not register the editor (§4.2).

### 9.1 Rendering in Creator surveys

- Survey strings render only through the customer's `onTextMarkdown` handlers (§9.0 sample). There is no survey-level format property, no default for new surveys and no property-grid switch.
- Internal UI surveys (property grid, dialogs, translation grid) are not wired by the sample, so they keep today's rendering. The existing property-grid `description` handler (property hints) keeps working.
- Comment questions with `allowRichText` render their answers formatted on the design surface (design mode is read-only) and are rich editors in the preview and theme tabs (§6.4).

### 9.2 Inline string editor (`StringEditorViewModelBase`, `survey-creator-core/src/components/string-editor.ts`)

- Mode resolution in `setLocString`: when rich strings are enabled (§9.0) and not `isInplaceForEditValues` → `editor.getStringEditMode(owner, name, locStr)`; otherwise `"none"`. Translation-surface strings are not excluded: `isInplaceForEditValues` is already `false` for them, so their choice texts get the rich editor (§9.5).
- The mode does not depend on `locStr.hasHtml`: a plain-text string still gets the toolbar, so authors can format it.
- On focus in `"inline"`/`"block"` mode: `editor.attachEditor(element, { mode })` and show its toolbar (floating, §7.2). Detach on blur. No source mode: strings are author content, rendered through the customer's handler.
- In `"inline"`/`"block"` mode the editor edits HTML (`editAsText = false`) regardless of the `onHtmlToMarkdown` probe.
- Saving (`getClearedText`) in `"inline"`/`"block"` mode: fire `onHtmlToMarkdown` with the element's `innerHTML`, as today. When a handler sets `options.text` (not `null`), store it (customer override, §4.2). Otherwise store `editor.sanitizeHtml(innerHTML, { inline: mode === "inline" })`: canonical HTML, where unformatted text is stored as typed (§3.2). Empty content stores an empty string. In `"none"` mode saving is unchanged.
- `checkConstraints`: allow Ctrl+B/Ctrl+I in rich mode (routed to the editor); keep blocking Ctrl+Z/Ctrl+Y (Creator undo works per committed value; Escape restores the value from before the edit).
- Enter: commits (unchanged), except inside a list item in `block` mode (new item / leave list).

### 9.3 Creator UI packages (React incl. creator-js via Preact, Angular, Vue)

- Bind `onInput`, `onPaste`, `onBeforeInput` also on the HTML-mode element.
- Add a toolbar slot rendered via `sv-action-bar`.
- Use a `div` instead of a `span` as the editable element for `block` mode.

### 9.4 Property grid (`survey-creator-core/src/property-grid/index.ts`)

`applyRichTextPropertyEditor` runs for both editors of a string property: `PropertyGridEditorText` (serializer type `text`, already a `comment` question) and `PropertyGridEditorString` (type `string`, a single-line `text` question). When rich strings are enabled (§9.0) and `editor.getStringEditMode(...)` is not `"none"`, it sets `type: "comment"`, `allowRichText: true` and `acceptCarriageReturn` to `true` for `"block"` and `false` for `"inline"`; the comment editor takes its mode from `acceptCarriageReturn` (§6.1). It does not compute the mode again: a `text` property is `block` and a `string` property is `inline` only because §6.2 says so. An `"inline"` cell also stays one line (`rows: 1`, `allowResize: false`). The cell edits the stored string directly: it renders and stores it by the rules of §6.4, which match what `RichText.renderStringHandler` and the inline string editor (§9.2) do on the design surface. `html`-type properties (`PropertyGridEditorHtml`) are unchanged.

The comment question's own `allowRichText` property appears in the property grid when the plugin is loaded (the plugin makes it visible, §6.1). Creator lists it in the comment entry of the property grid definition, next to `autoGrow` and `allowResize`, with the display name `pe.allowRichText` "Enable rich text formatting" in `survey-creator-core/src/localization/english.ts`.

### 9.5 Translation tab (`survey-creator-core/src/components/tabs/translation-base.ts`, `translation-side-by-side.ts`)

The translation tab edits strings in three places. All of them already write through a single path (`getProcessedTranslationItemText` → `setItemLocText` / `performItemLocTextAction`), and the stored value is the string itself (HTML), so no change is needed in the write path, CSV import/export or machine translation.

1. **Strings grid** (`createStringsSurvey`, area `translation-tab:table`): each string is a `matrixdropdown` row with one `comment` cell per locale, configured in `onMatrixCellCreated`.
2. **Element strings dialog** (`createStringsMatrix` / `onMatrixCellCreated` in the side-by-side model): the same `comment` cells, scoped to one element.
3. **Side-by-side panes**: the target pane (`translation_target`) uses Creator's inline string editor (`editableStringRendererName`) on a copy of each string; the source pane (`translation_source`) is read-only (no string renderer) and renders formatted HTML.

Changes:

- **Grid and dialog cells** (both `onMatrixCellCreated` handlers): when rich strings are enabled (§9.0), resolve the mode with `editor.getStringEditMode(item.context, item.locString.name, item.locString)`; force `"none"` for multi-value strings (`locString.getIsMultiple()`). When it is not `"none"`, set on the cell question `allowRichText = true` and `acceptCarriageReturn = (mode === "block")`, replacing the plain-cell value (`isMultiLine || allowLineBreaks`); the comment editor takes its mode from `acceptCarriageReturn` (§6.1). With the default modes of §6.2 the two values are the same; they differ only when `RichText.getEditMode` is overridden. The existing `rows`, `maxLength` (counts visible characters, §7.5) and `autoGrow` settings stay as they are.
- **Placeholders** of rich cells (`setPlaceHolder`, `item.getPlaceholder`) show the source-locale text, which may be HTML. For rich cells, pass the plain text instead: the text content of `RichText.sanitizeHtml(...)`.
- **Target pane:** covered by §9.2 (no translation-surface exclusion). The toolbar is floating, so the row equalizer (`translation-row-equalizer.ts`) is unaffected.
- **Source pane** renders formatted strings when the customer wires `translation-tab:source-survey` (§9.0 sample).
- **Read-only translation** (`translation.readOnly`): cells render formatted, non-editable HTML (§7.5).
- **Machine translation** sends and receives the stored value unchanged (HTML for formatted strings; most services have an HTML mode). A service may return damaged markup; the sanitizer cleans it on display and translators fix it in the cell.

---

## 10. Security requirements

- The sanitizer is the only path from stored rich text to the DOM in the plugin. It is XSS-safe by construction (allow-list of tags, attributes and URL schemes; text is escaped). Must be proven by unit tests with known XSS vectors (script tags, event-handler attributes, `javascript:`/`data:`/`vbscript:` links, schemes split by control characters, quote breaking in `href`, entity tricks, SVG/MathML).
- Sanitization happens **at display time**, never only at save time: respondents can submit arbitrary values without using the editor, and JSON can be edited by hand. Comment answers are sanitized on every display (§6.4); survey strings are sanitized by `RichText.renderStringHandler`.
- Stored values written by the plugin are canonical HTML and are safe to render as is. Values written by other code are not: exports, PDF, analytics and custom viewers that render stored answers outside the plugin must sanitize them; the documentation recommends `RichText.sanitizeHtml`.
- Piped values (`{name}`) are inserted by `textPreProcessor` without HTML escaping before `onTextMarkdown` fires. With `RichText.renderStringHandler` the result is sanitized, so piped values cannot inject script; they can inject allowed formatting. A piped rich answer renders formatted in a string with the handler and as raw tags in a string without it. This is documented.
- Customer pass-through handlers (`options.html = options.text`) bypass the sanitizer for survey strings; the documentation lists the risks (stored XSS, piped values) and recommends `RichText.sanitizeHtml`.

---

## 11. Compatibility requirements

### 11.1 Existing behavior

- No plugin loaded → no behavior change anywhere (library and Creator). A comment with `allowRichText: true` is a standard textarea that shows the stored value as is.
- Plugin loaded, no handler attached → survey strings render and are edited exactly as before. Comment questions with `allowRichText: true` are rich editors; no other question changes.
- Existing `onTextMarkdown` handlers are untouched: the plugin never pre-fills `options.html`, and comment answers never reach handlers.
- Existing Markdown strings rendered by a customer's markdown-it handler keep rendering through that handler. `RichText.renderStringHandler` does not render Markdown: Markdown syntax has no markup by HTML rules, so `**a**` is shown literally on today's plain path. Converting stored Markdown to HTML is a one-time migration done by the customer with their own tools; the plugin offers no Markdown converter.
- Creator `onHtmlToMarkdown` handlers are untouched: Creator still fires the event, and a handler that sets `options.text` still decides the stored value (§9.2). Without a handler, rich strings are stored with the registered editor's `sanitizeHtml`.
- `allowRichText` survives loading/saving in environments without the plugin.
- Existing plain-text answers of a question switched to `allowRichText`, and existing plain strings once `renderStringHandler` is attached, are read as HTML. They render as typed (line breaks, bare `&` and `<` kept) except for sequences that are markup by HTML rules (§3.3). Answers are not rewritten until the respondent edits them (§7.4).
- `RichText.findUnsupported(survey)` lets customers find strings and answers whose HTML the sanitizer would change (e.g. tables, inline styles) before attaching the handler or enabling `allowRichText`.
- Consumers of stored answers outside the plugin (`question.displayValue`, `survey.getPlainData`, exports, survey-pdf, Dashboard) receive the stored value; for formatted answers this is HTML. Follow-up work for those products is listed in Appendix B.

### 11.2 Forward compatibility: a possible move into the main bundle

The feature ships as a plugin first. After one or two minor releases it may move into the main `survey-core` bundle; signals for the move are noticeable adoption, support requests about HTML shown as raw text in runners that do not load the plugin, the measured bundle size within the §12 target, and an API that did not change since the first release. The plugin must be built so that this move needs **no change in customer code or JSON**:

1. **Explicit switches only.** Comment answers are switched on by the JSON property `allowRichText` (§5.1, declared in core); survey strings by a handler the customer attaches (§4.1). Importing the plugin alone never changes an existing survey (§11.1). After the move, the same JSON and the same handler code (`RichText` re-exported, item 3) behave identically; a survey without a handler still renders strings as plain text.
2. **Small public surface.** Documented API is limited to the `RichText` facade and its types (§4.1), the JSON property `allowRichText`, Creator's `registerRichTextEditor` (§9.0), and the CSS classes and CSS variables introduced by `rich-text.scss`. `RichText.attachEditor` and `RichText.getStringEditMode` exist for Survey Creator and stay out of the documentation. Creator ships with the same survey-core version, so these may change during the move.
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
    api.ts                                   # RichText facade, context and editor types
    edit-mode.ts                             # getDefaultEditMode (§6.2), answer edit mode
    runs.ts                                  # DOM → runs flattening, runs → canonical HTML
    sanitizer.ts                             # sanitizeHtml, getDisallowedHtml (§3.4)
    survey-strings.ts                        # context resolution, renderStringHandler, attachEditor (§4.1)
    unsupported.ts                           # findUnsupported
    editor-model.ts                          # RichTextEditorModel, command adapter
    toolbar.ts                               # ActionContainer setup
    link-dialog.ts                           # settings.showDialog + SurveyModel
    rich-text-strings.ts
    icons.ts                                 # toolbar SVG icons
  src/default-theme/rich-text.scss           # uses existing theme CSS variables only
  tests/rich-text/                           # unit tests (§13.1)
packages/survey-react-ui/rich-text.html, rich-text.js     # demo harness (§14.2), dev-only
packages/survey-js-ui/rich-text.html, rich-text.js        # demo harness, dev-only
packages/survey-vue3-ui/example/...                       # "/rich-text" route, dev-only
packages/survey-angular-ui/example/...                    # "rich-text" route, dev-only
```

- Build: `npm run build:rich-text` (ESM `build/fesm/rich-text/index.mjs`, UMD `build/rich-text/index.js` with global `SurveyRichText`, `build/rich-text.css` + minified variants, typings stub for classic module resolution as in the collaboration config). `build:rich-text` is part of `build:all`. `survey-core` is external.
- Requires a prior `npm run build` (same as collaboration).
- No runtime dependencies.
- Target bundle size: ≤ 20 KB minified (JS), excluding CSS.
- Conventions (see `CLAUDE.md`): no API doccomments; comments only for constraints the code cannot express; ESLint with zero warnings; Conventional Commits.

---

## 13. Testing

All test suites below are required deliverables.

### 13.1 Unit tests — survey-core (Vitest, `packages/survey-core/tests/rich-text/`)

- **sanitizer.tests.ts:** the examples table of §3.2; allow-list; renaming to canonical tags; unknown elements unwrapped with text kept; block elements → boundaries; one paragraph unwrapped, two or more blocks wrapped (including a list followed by text); inline context joins blocks and list items with `<br>`; minimal escaping (`Tom & Jerry`, `a < b`, `x > y` and quotes unchanged; `R&D`, `&#1`, `a<b`, `</`, `<!`, `<?` escaped; `&` and `"` escaped in `href`); line feeds (`\n`, `\r\n`, `\r` → `<br>`; line feeds at block edges and whitespace-only text between blocks removed); the paste option collapses whitespace instead; the table of §3.3; empty and text-less content → `""`; dropped elements with content; attribute stripping; canonical `target`/`rel` on links, not reported; `href` schemes; nested lists flattened and reported; idempotence on a corpus; XSS vectors (§10); `getDisallowedHtml` reports removed elements/attributes/schemes but not canonical renaming; SSR (no DOM) returns `""` and `[]`.
- **serializer.tests.ts:** DOM-shape normalization (`b`/`strong`, `i`/`em`, `div`/`p`, duplicated nested tags, `span[style]` unwrapped); merging of adjacent runs; whitespace at mark edges; overlapping marks including the worked example of §3.2; link outermost.
- **roundtrip.tests.ts:** corpus + deterministic generated run sequences: `sanitizeHtml(sanitizeHtml(x)) === sanitizeHtml(x)`; flatten(render(runs)) equals runs; for every generated text (including `&`, `<`, `>`, `"`, `#`, digits and letters after `&` and `<`), parsing the escaped output as HTML returns the original text.
- **survey-strings.tests.ts:** plugin loaded without a handler → survey strings render as plain text (no `options.html` pre-fill); `renderStringHandler` renders a `text`-typed string (a question title, a description) in block context and a `string`-typed string (a choice text, the survey title) in inline context; strings whose sanitized output equals the input (`Tom & Jerry`, `a < b`) keep `hasHtml === false`; a plain multi-line description renders with `<br>`; Markdown strings stay plain (`**a**` rendered literally); `useMarkdown === false` strings untouched; a conditional customer handler calling `sanitizeHtml` for some strings only; a pass-through handler (`options.html = options.text`) is unaffected by the plugin; `RichText` has no `textMarkdownHandler`, `htmlToMarkdownHandler`, `valueToHtml`, `htmlToValue`, `markdownToHtml`, `htmlToMarkdown`, `isLossless`, `getUnsupportedMarkdown`, `registerFormat`, `getFormat`.
- **comment-rich-text.tests.ts** (core, with and without the plugin): `allowRichText` default `false` not serialized, `true` survives a load/save round trip; `getComponentName` for comment, an inheriting class, a matrix cell with `cellType: "comment"`, display mode; renderer fallback without plugin; `allowRichText` visibility toggled by the plugin; `richTextEditMode`, `richTextToolbarVisibility`, `richTextDisableBold`, `richTextConverter` and `textFormat` are not registered; the survey has no `onHtmlToMarkdown` event and no `getSurveyHtmlToMarkdown` method; `settings` has no `richText` key; an `onTextMarkdown` handler is never called with `name: "value"` for a rich comment, in edit and display mode.
- **comment-answer.tests.ts:** display of `""`, of plain text with `&`, `<` and line breaks, of HTML, and of XSS vectors set through `setValue`; inline context for `acceptCarriageReturn: false`; source mode condition: plain text and canonical HTML → `false`, a table / `style` / `img` / `<Enter>` → `true`; without a DOM, values render as escaped text.
- **unsupported.tests.ts:** `findUnsupported` reports HTML strings with disallowed content in every locale, skips plain and canonical strings, skips non-`useMarkdown` strings, reports rich comment answers with disallowed content and skips plain answers.
- **edit-mode.tests.ts:** default modes by serializer type (`text` → block for a question title and a description, `string` → inline for a choice text and the survey title, `useMarkdown === false` → none even for type `text`, `html` type → none, a detached owner still resolves by property type); `RichText.getEditMode` override through `getStringEditMode`; comment answer mode from `acceptCarriageReturn`.
- **editor-model.tests.ts** (mocked command adapter): toggle state `all`/`none`/`mixed`; selection save/restore; command dispatch for buttons and shortcuts; Ctrl+U blocked; commit on blur and debounced input per `isInputTextUpdate`; stored value is `sanitizeHtml` output (unformatted text stored as typed); no write on focus/blur without input (including a legacy plain value with line breaks); external value update and deferral while focused; paste sanitized in both modes; source mode and "edit anyway"; `maxLength` counts visible characters, blocks typing and paste at the limit, and formatting does not change the count; placeholder emptiness; link dialog: panelless theme, the URL pre-filled from the link under the selection, the validation message shown on Apply, empty-URL unlink, editing an existing link replaces only `href` and restores the selection, the dialog root is the `.sd-rich-text` box and never the editing element; link action visibility re-checked on attach; content-agnostic mode of `RichText.attachEditor` (toolbar profile per mode, no value writes, no source mode, `detach` removes listeners).

### 13.2 Markup tests — UI packages

- Shared etalons in `tests/markup/etalon_rich_text.ts` with snapshots in `tests/markup/snapshots/`: rich comment (edit, with placeholder), with an HTML value, with a legacy plain value with line breaks, read-only, display mode, disabled, source mode with notice, an XSS value (sanitized display), inline mode (`acceptCarriageReturn: false`).
- The markup runners of React, Vue 3, Angular and survey-js-ui must import the plugin.
- Framework unit tests (where the package has them): attach/detach lifecycle; framework re-renders do not overwrite the editing element's content.

### 13.3 E2E tests — Playwright (`e2e/questions/richtext.spec.ts`, run for every framework)

Each package's test page/example app must load the `rich-text` bundle and CSS.

- Type text; apply bold/italic/strikethrough via toolbar and via Ctrl/Cmd+B/I; assert the stored HTML via `survey.data`.
- Text without formatting is stored as typed (`Tom & Jerry`, `a < b`).
- Mixed-selection toggle (worked example of §3.2).
- Bulleted/numbered lists via toolbar; Enter creates an item; Enter on an empty item leaves the list.
- Enter (paragraph, `<p>`) and Shift+Enter (line break, `<br>`).
- Link dialog: add, edit (the field shows the current URL; the link text is kept), remove; an invalid scheme shows the message and keeps the dialog open; the dialog is not part of the edited text; the stored link carries the canonical `target`/`rel`.
- Paste rich HTML (styles, table) → sanitized result.
- Undo with Ctrl/Cmd+Z.
- `textUpdateMode` `onTyping` vs `onBlur`.
- External `setValue` updates the editor; deferred while focused.
- Display/read-only mode renders HTML; links open with `target="_blank"`.
- A legacy plain value with line breaks renders as lines and is not rewritten by focus and blur.
- Stored content with disallowed HTML → source mode; "edit anyway" switches to rich mode.
- An externally set value with `<img onerror>` and `<script>` displays without running script.
- `maxLength` blocks typing; the counter ignores markup.
- `acceptCarriageReturn: false` (inline mode, Enter blocked).
- Matrix cell with `cellType: "comment"` and `allowRichText`.
- Survey strings: HTML titles/descriptions render with the plugin and `RichText.renderStringHandler` attached; with the plugin loaded and no handler they render as without the plugin; plain strings render unchanged.
- Keyboard: Tab reaches toolbar then editing area; toolbar buttons operable by keyboard.

### 13.4 Screenshot tests — Playwright VRT (`screenshots/richtext.spec.ts`)

Default empty state with placeholder; focused editor with toolbar; pressed button states; formatted content (bold/italic/strike/link/lists/paragraphs); read-only/display mode; disabled; source mode with notice; link dialog; mobile width; a dark theme; inline mode.

### 13.5 Accessibility tests — axe (`accessibilityTests/richtext.spec.ts`)

Edit mode with toolbar, read-only mode, source mode, open link dialog.

### 13.6 Survey Creator tests (survey-creator repository)

- Unit (`survey-creator-core/tests`): `registerRichTextEditor` with a fake editor; the "rich strings" condition of §9.0 (no editor → today's behavior; editor but no `onTextMarkdown` handler on `creator.survey` → today's behavior; both → rich, with or without a `creator.onHtmlToMarkdown` handler); string editor mode resolution (none/inline/block, in-place values, translation surface, plain string without `hasHtml` still rich); rich saving stores `editor.sanitizeHtml(innerHTML)` (formatted → canonical HTML, unformatted → the text as typed, empty → `""`), and a `creator.onHtmlToMarkdown` handler that sets `options.text` overrides it; `"none"` mode saving unchanged; Ctrl+B/I allowed only in rich mode; internal UI surveys do not render HTML strings; property grid editor JSON (`type: "comment"`, `allowRichText: true`, `acceptCarriageReturn` `true` for block and `false` for inline, no `textFormat`, `html` type untouched); translation cells get `acceptCarriageReturn` from the mode; a property-grid cell renders an HTML string formatted and stores canonical HTML although the property-grid survey has no handlers; the comment question's `allowRichText` is listed in the property grid when the plugin is loaded; translation tab: grid and dialog cell setup (rich for `useMarkdown` strings, plain for multi-value and non-`useMarkdown` strings), plain-text placeholders, the target-pane string editor gets the rich mode, edits written through `setItemLocText` store the value unchanged, CSV export/import round trip of formatted strings; behavior without a registered editor unchanged.
- E2E: format a question title (block, lists, bold available) and a description (block, lists) on the design surface; a choice text stays inline (no lists); Escape restores; Enter commits except inside a list item; the JSON tab shows canonical HTML for formatted strings and the text as typed for unformatted ones (`Tom & Jerry`); property grid rich editor edits title/description and syncs with the surface; preview tab renders formatting, and a comment question with `allowRichText` is a rich editor there that stores HTML; translation tab: format a translation in a grid cell, in the element strings dialog and in the side-by-side target pane, and verify the stored locale text and the designer rendering in that locale.
- Screenshots: floating toolbar over a title and over a description; property grid rich editor; translation grid with a focused rich cell and with formatted read-only cells; side-by-side panes with formatted strings.

---

## 14. Execution plan and checkpoints

### 14.1 Rules

- Work is split into milestones. Each milestone ends with a **checkpoint (CP)**: a state that a person can open in a browser and verify by hand using the checklist below.
- Before a checkpoint is presented, the milestone's automated tests and `npm run lint` must be green. A checkpoint is passed when every checklist item shows the expected result; a failed item is fixed within the same milestone.
- The build entry point and the demo page come first (M0), so every later milestone is visible in a browser.
- React is the reference framework for the editor (M3–M4); the other frameworks follow once the behavior is approved (M5).
- Library milestones (M0–M8) and Creator milestones (C1–C5) are separate PRs in separate repositories. Creator work continues after CP4H is passed.
- Checklist state: M0–M4 were implemented for the previous (Markdown) version of this spec. All checkpoint items are unchecked and are verified again against this version, in CP4H at the latest.

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

- **Live data:** `survey.data` as formatted JSON, plus a log of `onValueChanged` events (question name, new value). Used to verify stored HTML, and that no write happens without input.
- **Show JSON:** `survey.toJSON()`.
- **Set value externally:** sets the value of `c_md` to the worked-example value `Please <strong>read</strong> the <em>terms</em> carefully`; a second button does the same after a 3-second delay (to test deferral while focused).
- **Mode switch:** edit / read-only / display (`mode: "display"`) / design (`survey.setDesignMode(true)`).
- **Theme switch:** default light theme / a dark theme from `survey-core/themes`.
- **String handler switch** (affects survey strings only): none / built-in (`RichText.renderStringHandler`, the default) / raw HTML (`options.html = options.text`, demo only) / custom (titles get `"[handler] " + RichText.sanitizeHtml(text, { inline: true })`, other strings `RichText.renderStringHandler`). Switching removes the previous handler, adds the new one and calls `survey.locStrsChanged()` without re-creating the survey.
- **Playground:** an HTML textarea and outputs updated on input: `RichText.sanitizeHtml` (block and inline) as preview and as text, and `RichText.getDisallowedHtml`.
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

#### M1 — survey-core hook (§5)

Scope: `allowRichText` and the `getComponentName` override.

Automated: core part of `comment-rich-text.tests.ts`; the full existing survey-core suite is green without changed expectations.

**CP1 — core is unchanged without the plugin** (`?plugin=off`).
- [x] Comment questions render as ordinary textareas; typing `<b>x</b>` stores `<b>x</b>` literally (data panel).
- [x] `c_unsupported` shows its default HTML value as raw text in the textarea.
- [x] "Show JSON" contains `"allowRichText": true` for `c_md`; a plain comment has no `allowRichText` key; no element has a `textFormat` key.
- [x] Titles with HTML on page "Strings" show the raw tags (no plugin → no rendering), exactly as before the change.

#### M2 — Sanitizer and survey string rendering (§3, §4.1, §6.2, §6.3, `findUnsupported`)

Automated: `sanitizer`, `serializer`, `roundtrip`, `value`, `survey-strings`, `unsupported`, `edit-mode` unit tests.

**CP2 — survey strings render rich text; the sanitizer is inspectable.** React demo page (plugin on, string handler "built-in"), page "Strings".
- [x] Survey title, question titles, descriptions and choice texts show bold/italic/strikethrough/links; links open in a new tab.
- [x] The description of `s1` shows two lines, a paragraph break and a bulleted list.
- [x] The title of `s6` (a list in a question title) is shown as a bulleted list (block context: a question title is serializer type `text`).
- [x] `s2`: `Markdown **is not** rendered` shows the asterisks; `Tom & Jerry` shows one ampersand.
- [x] Plain strings, including the multi-line description of `s8`, look exactly as with `?plugin=off`.
- [x] String handler "none": the whole page "Strings" looks exactly as with `?plugin=off`; switching back to "built-in" restores formatting without reloading.
- [x] `s3` and `s4`: no alert appears; `s3` shows a bold "html" and no script text; `s4` shows "js link" as plain text.
- [x] `s5` (a table) shows its cell texts as separate lines; `s7` shows "Red" in the normal text color.
- [x] String handler "custom": titles show the `[handler]` prefix and are still formatted; descriptions are formatted without the prefix.
- [x] String handler "raw HTML": `s7` renders red text and a table; this is the customer's pass-through choice, not plugin behavior.
- [x] Playground: `<b>a</b>` → `<strong>a</strong>`; `<span style="color:red">x</span>` → `x`, disallowed `span`, `style`; `Tom &amp; Jerry` → `Tom & Jerry`; `R&D` → `R&amp;D`; `a` + line feed + `b` → `a<br>b`.
- [x] "Find unsupported" lists `s3`, `s4`, `s5`, `s7` and `c_unsupported`.

#### M3 — Editor core in React (§6.1, §7.1–§7.3, value flow basics of §7.4, §8 for React)

Scope: `RichTextEditorModel` with the command adapter, toolbar (bold, italic, strikethrough, lists, clear formatting), toggle state, selection save/restore, keys, commit on blur/debounced input, React wrapper, base CSS, icons, strings.

Automated: corresponding `editor-model.tests.ts` cases; React markup etalons for edit mode.

**CP3 — formatting a comment answer.** React demo page, page "Editor".
- [x] `c_md`: the toolbar is hidden until the editing area is focused; then it floats 2px below the field, in the dropdown-popup chrome, and does not change the layout. It uses the survey theme.
- [ ] Bold/italic/strikethrough via buttons and via Ctrl/Cmd+B/I; the pressed state follows the caret.
- [ ] Worked example of §3.2 (start with "Set value externally"): the data panel shows exactly `Please <strong>read the </strong><em><strong>ter</strong>ms</em> carefully`, then `Please <strong>r</strong>ead the <em>terms</em> carefully` after the second click.
- [x] Clicking a toolbar button keeps the selection.
- [ ] Bulleted/numbered list; Enter adds an item; Enter on an empty item leaves the list.
- [x] Enter → two `<p>` paragraphs in data; Shift+Enter → `<br>`.
- [x] Typing `Tom & Jerry` without formatting stores `Tom & Jerry` as typed.
- [x] Ctrl/Cmd+U does nothing; Ctrl/Cmd+Z undoes the last formatting.
- [x] `c_md` updates the value on blur; `c_typing` updates while typing (event log).
- [x] Focus and leave `c_md` without typing → no new entry in the event log.
- [ ] Clear formatting removes marks and turns list items into paragraphs.

#### M4 — Editor completeness in React (rest of §7)

Scope: link dialog, paste sanitizing, `maxLength` and counter, placeholder, `rows`/`autoGrow`/`allowResize`, external value updates with deferral, read-only/disabled/display/design rendering, source mode and "edit anyway", legacy plain values, inline mode, matrix cells, accessibility attributes, theme CSS.

Automated: remaining `editor-model.tests.ts` cases; all React markup etalons.

**CP4 — the comment editor is feature-complete in React.**
- [ ] Link: dialog opens; `https://surveyjs.io` creates a link; `javascript:alert(1)` shows the validation error; empty URL removes the link; with no selection the URL is inserted as link text.
- [ ] Link dialog: no panel chrome around the field; with the caret inside a link the field shows its URL, and Apply with a new URL keeps the link text and the caret position.
- [ ] The stored link is `<a href="https://surveyjs.io" target="_blank" rel="noopener noreferrer">…</a>`.
- [ ] Paste formatted content from a web page or Word (colors, fonts, a table): only supported formatting remains; table text is kept as paragraphs/lines.
- [ ] `c_max`: the counter counts visible characters; making a word bold does not change it; typing stops at the limit.
- [ ] Placeholder is visible when empty and disappears on typing; it reappears after deleting everything.
- [ ] `c_rows`: initial height of 6 lines, grows with content, can be resized.
- [ ] "Set value externally" updates `c_md` immediately when not focused; with the delayed button while typing in `c_md`, the content is updated only after blur and the caret is not disturbed.
- [ ] Read-only, display and disabled modes show formatted, non-editable HTML without a toolbar; design mode shows the same.
- [ ] `c_legacy` shows two lines and the `&` and `<` characters as typed; focusing and leaving it writes nothing; making a word bold stores HTML with `<br>` between the lines.
- [ ] `c_unsupported` opens in source mode with the notice; "edit anyway" switches to the rich editor; after editing, the stored value contains only canonical HTML.
- [ ] `c_inline`: no list buttons; Enter does nothing.
- [ ] Matrix `m1`: the comment cell has the rich editor; the cell value is HTML.
- [ ] Dark theme: toolbar, content, links, placeholder and source-mode notice are readable.
- [ ] Narrow (mobile) width: the toolbar fits or wraps without overlapping the content.
- [ ] Screen reader / devtools accessibility tree: textbox with the question title as name, toolbar with pressed states.

#### M4H — Rework: HTML storage (team decision, this version of the spec)

Scope (brings the M0–M4 code in line with this spec):

- **survey-core:** remove `onHtmlToMarkdown`, `getSurveyHtmlToMarkdown` and `HtmlToMarkdownEvent` from `survey.ts`, `survey-events-api.ts` and `interfaces/survey-interfaces.ts` (and the public export, if any). Keep `allowRichText` (§5).
- **Plugin, removed:** `markdown.ts`, `answer-format.ts`, `lossless.ts`; the Markdown emitter in `runs.ts`; `IRichTextConverter` / `IRichTextConverterContext`; `RichText.markdownToHtml`, `htmlToMarkdown`, `isLossless`, `getUnsupportedMarkdown`, `htmlToMarkdownHandler`; the `richTextConverter`, `richTextEditMode`, `richTextToolbarVisibility` and `richTextDisableBold` comment properties and `host.converter`; the bold-disabling rule (`isRichTextBoldDisabled`); `canEditRich` and the handler probes. The comment edit mode is taken from `acceptCarriageReturn` only (§6.1).
- **Plugin, changed:** the sanitizer follows §3.2 and §3.4: minimal escaping instead of escaping every `&`, `<`, `>` and `"`; the line-feed rule extended to `\r\n`/`\r`, with line feeds at block edges and whitespace-only text between blocks removed; the paste option; `<p>` wrapping when there are two or more blocks; text-less content → `""`; nested lists reported. `sanitizeHtml` defaults to block context. `textMarkdownHandler` is renamed to `renderStringHandler` (§4.1). `findUnsupported` moves to `unsupported.ts` and uses `getDisallowedHtml`. The editor model displays and commits through `sanitizeHtml`, uses the source mode condition of §6.4, sanitizes paste with the paste option in both modes, and counts `maxLength` in visible characters (no formatting revert). The display element gets `white-space: pre-wrap`.
- **React wrapper:** remove the `converter` getter and the plain-state branch.
- **Tests:** delete `markdown`, `lossless` and `answer-format` tests; add `comment-answer` and `unsupported` tests; rewrite the others per §13.1.
- **Demo page:** Appendix A survey; string handler switch of §14.2 (the reverse handler checkbox and the external converter toggle are removed); HTML playground.

Automated: §13.1 suites; the full existing survey-core suite is green without changed expectations; lint.

**CP4H — the rework keeps every checked behavior.**
- [ ] Every item of CP0–CP4 passes on the React demo page.
- [ ] String handler "none": every comment on page "Editor" is still a rich editor (answers do not depend on handlers); strings render as plain text.
- [ ] In the console, `survey.setValue("c_md", "<img src=x onerror=alert(1)><b>ok</b><script>alert(2)</script>")` shows no alert; read-only mode shows a bold "ok"; edit mode opens source mode.
- [ ] Console: `survey.onHtmlToMarkdown`, `SurveyRichText.RichText.markdownToHtml`, `SurveyRichText.RichText.textMarkdownHandler` and `SurveyRichText.RichText.htmlToMarkdownHandler` are `undefined`; `SurveyRichText.RichText.sanitizeHtml("Tom &amp; Jerry")` → `"Tom & Jerry"`; `SurveyRichText.RichText.sanitizeHtml("a < b\nc")` → `"a < b<br>c"`.
- [ ] `git grep -n "getSurveyHtmlToMarkdown\|HtmlToMarkdownEvent\|markdownToHtml\|textMarkdownHandler\|htmlToMarkdownHandler\|richTextConverter\|richTextEditMode\|richTextToolbarVisibility\|richTextDisableBold\|isRichTextBoldDisabled\|getUnsupportedMarkdown\|isLossless\|textFormat" packages/` finds nothing outside `packages/survey-core/tests/`, where the names appear only in assertions that they are absent.

#### M5 — survey-js-ui, Vue 3, Angular wrappers (§8)

Scope: the `sv-rich-text-comment` component in each package, the demo page/route for each, markup runners importing the plugin.

Automated: markup etalons pass in all four packages (identical snapshots).

**CP5 — parity across frameworks.** Repeat in survey-js-ui, Vue 3 and Angular (pages from §14.2):
- [ ] CP3 items: toolbar, bold via button and shortcut, worked example, lists, Enter/Shift+Enter, value on blur.
- [ ] CP4 items: link dialog, paste, read-only/display, source mode, `c_legacy`, matrix cell, external value update.
- [ ] Visual comparison with the React page side by side: no differences.

#### M6 — Automated E2E, screenshot and accessibility suites (§13.3–§13.5)

Automated: all suites green for all four frameworks.

**CP6 — review of automated results.**
- [ ] Run `npm run e2e` (Playwright UI mode) in one package and watch the rich text scenarios execute.
- [ ] Every new screenshot etalon is reviewed by a person before being committed and matches the demo page for the same state.
- [ ] The a11y reports contain no violations for the rich text states.

#### M7 — Documentation

Scope: documentation article: enabling the plugin; `allowRichText`; the value in rich text mode is always HTML, and how plain text from other sources renders (§3.3); attaching `RichText.renderStringHandler` for strings; rendering stored answers outside the survey with `RichText.sanitizeHtml`; Creator setup with `registerRichTextEditor` and `onTextMarkdown`; `creator.onHtmlToMarkdown` as an optional override; pass-through HTML risks; migration with `findUnsupported`; a note for customers with Markdown strings (§11.1).

**CP7 — documentation samples work as written.**
- [ ] Every code sample in the article runs without changes on the demo page or the Creator demo page.

#### C1–C5 — Survey Creator integration (survey-creator repository, §9)

**C1 — registration and rendering (§9.0, §9.1).** CP-C1 on the Creator demo page (demo survey of Appendix A loaded into Creator; the page runs the §9.0 setup sample, with toggles to skip `registerRichTextEditor` and to skip the `onTextMarkdown` handler of the designer survey):
- [ ] The designer, preview, theme and translation source/target surveys show formatted titles/descriptions/choices.
- [ ] Property grid labels and property hints look exactly as with `?plugin=off`.
- [ ] Preview tab shows formatted strings and working rich comment editors; a typed answer is stored as HTML.
- [ ] Without `registerRichTextEditor`: strings still render formatted (the `onTextMarkdown` handler is attached), and every string editor behaves exactly as today (no toolbar).
- [ ] With `registerRichTextEditor` but without the designer survey's `onTextMarkdown` handler: HTML strings show as raw tags, and every string editor behaves exactly as today (no toolbar).
- [ ] With `?plugin=off` (no handlers, no registration), Creator looks and behaves as before.

**C2 — inline string editor (§9.2, §9.3).** CP-C2:
- [ ] Click a question title: floating toolbar with bold and lists (the title property is type `text`, so the mode is block, §6.2); the bold button is enabled, and pressing it on the bold title may change nothing (§4.3); Enter in a list item adds an item; Enter elsewhere commits; Escape restores the previous text.
- [ ] Click a description: the same block toolbar; Enter in a list item adds an item; Enter elsewhere commits.
- [ ] A plain title also gets the toolbar; making a word italic stores `<em>word</em>`; editing a plain title such as `Tom & Jerry` without formatting keeps it as typed in the JSON tab. This works without any `creator.onHtmlToMarkdown` handler.
- [ ] With a demo `creator.onHtmlToMarkdown` handler that sets `options.text = options.html.toUpperCase()`, the stored string is that handler's result (customer override).
- [ ] Ctrl/Cmd+B/I work in rich strings; after commit, Creator undo/redo reverts/reapplies the change.
- [ ] Choice texts get the inline toolbar; with `inplaceEditChoiceValues` the plain editor is used.

**C3 — property grid (§9.4).** CP-C3:
- [ ] Question title and description editors are rich block editors (both properties are type `text`); the survey title editor is a one-line inline editor (type `string`); edits appear on the design surface and vice versa.
- [ ] `requiredErrorText` and `completedHtml` editors stay plain.
- [ ] A comment question's property grid shows "Enable rich text formatting" next to `autoGrow`/`allowResize`; turning it on shows a formatted default value on the design surface and a rich editor in the preview tab. With `?plugin=off` the property is not shown.

**C4 — translation tab (§9.5).** CP-C4 on the Creator demo page, after adding German (`de`) in the translation tab:
- [ ] Strings grid: rich strings show the toolbar only in the focused cell, floating, without changing row heights; question titles and descriptions get the block toolbar, choice texts the inline toolbar.
- [ ] Empty `de` cells show the default-locale text as a plain-text placeholder (no tags).
- [ ] Format a `de` translation of `s1`'s title; switching the designer to `de` shows the formatted title; the JSON tab stores canonical HTML under `"de"`.
- [ ] Strings without `useMarkdown` and multi-value strings stay plain.
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
- survey-core contains no rich-text event or setting; its only change is `allowRichText` (§5).
- The forward-compatibility requirements of §11.2 are met.
- Bundle size target (§12) met; no runtime dependencies.
- All checkpoints CP0–CP8 (library) and CP-C1–CP-C5 (Creator) are passed.

---

## Appendix A. Demo survey

Used by every demo page (§14.2). Keep the copies in all demo pages identical. Survey strings are rendered by the handler selected with the string handler switch (§14.2); comment answers do not depend on it.

```json
{
  "title": "Rich text <strong>demo</strong>",
  "description": "<p>Survey description with <em>italic</em> text.</p><p>Second paragraph.</p>",
  "pages": [
    {
      "name": "strings",
      "title": "Strings",
      "elements": [
        {
          "type": "text", "name": "s1",
          "title": "Title with <em>italic</em>, <strong>bold</strong>, <s>strike</s> and <a href=\"https://surveyjs.io\">a link</a>",
          "description": "<p>Line one<br>Line two</p><ul><li>item one</li><li>item two</li></ul>"
        },
        {
          "type": "radiogroup", "name": "s2", "title": "Plain title",
          "choices": ["<strong>Bold</strong> choice", "Plain choice", "Markdown **is not** rendered", "Tom & Jerry"]
        },
        { "type": "text", "name": "s3", "title": "Raw <b>html</b> and <script>alert(1)</script>" },
        { "type": "text", "name": "s4", "title": "<a href=\"javascript:alert(1)\">js link</a>" },
        { "type": "text", "name": "s5", "title": "Table", "description": "<table><tr><td>a</td><td>b</td></tr><tr><td>1</td><td>2</td></tr></table>" },
        { "type": "text", "name": "s6", "title": "<ul><li>a list</li><li>in a title</li></ul>" },
        {
          "type": "text", "name": "s7", "title": "Styled string",
          "description": "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>"
        },
        { "type": "text", "name": "s8", "title": "Plain multi-line description", "description": "Plain line one\nPlain line two" }
      ]
    },
    {
      "name": "editor",
      "title": "Editor",
      "elements": [
        { "type": "comment", "name": "c_md", "title": "Rich answer", "allowRichText": true, "placeholder": "Type and format text" },
        { "type": "comment", "name": "c_typing", "title": "Updates while typing", "allowRichText": true, "textUpdateMode": "onTyping" },
        {
          "type": "comment", "name": "c_legacy", "title": "Plain answer from before rich text", "allowRichText": true,
          "defaultValue": "Typed in a textarea: a < b & c\nSecond line"
        },
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

---

## Appendix B. Open questions for the team

1. **`maxLength` semantics.** This spec counts visible characters (§7.5), so the stored HTML can exceed `maxLength`. The alternative, counting stored characters, protects storage limits but makes the counter jump when text is formatted.
2. **Link attributes in data.** Canonical HTML stores `target="_blank" rel="noopener noreferrer"` on every link (§3.2), so stored HTML is safe for any consumer. The alternative is to store `href` only and add the attributes at render time, which keeps values shorter but makes every consumer responsible for them.
3. **Customers with Markdown strings in Creator.** With the editor registered, the property grid and translation cells write HTML (§4.2, §9.4). Is "do not register the editor" an acceptable answer for them, or is a migration tool needed?
4. **Stored answers outside the plugin.** `displayValue`, `getPlainData`, CSV/XLSX exports, survey-pdf and Dashboard receive HTML for formatted answers. Do these products need follow-up tickets to render or strip it (with `RichText.sanitizeHtml`)?
5. **Property name.** `allowRichText` follows `allowResize` / `allowClear`. It goes into customers' JSON, so it must be final before release.
