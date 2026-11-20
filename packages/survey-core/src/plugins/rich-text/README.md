# Rich text

The rich-text API is a separate `survey-core/rich-text` plugin. Loading it registers a `richtext` question and the `RichText` helpers. It does not turn existing survey strings into HTML.

## Loading

```ts
import { QuestionRichTextModel, RichText } from "survey-core/rich-text";
```

In a script tag the UMD build is `survey-core/rich-text/index.js` and the global is `SurveyRichText`. The plugin must be loaded after `survey-core`. The editor styles ship in `survey-core.css`. A form that never imports the plugin downloads none of its script.

## `richtext` question

`QuestionRichTextModel` extends the comment question. The answer is an HTML string. All comment properties still apply (`placeholder`, `rows`, `maxLength`, `autoGrow`, `allowResize`, `acceptCarriageReturn`, read-only, and display mode).

```json
{ "type": "richtext", "name": "notes", "title": "Notes", "richTextToolbarMode": "onFocus" }
```

`richTextToolbarMode` controls the formatting bar:

| Value | Behavior |
|---|---|
| `"static"` | Always visible in the footer. Default. |
| `"onFocus"` | Floating bar while the editor has focus. |
| `"onSelection"` | Floating bar only while text is selected. Default for a matrix cell. |
| `"none"` | No bar. Bold, italic, underline, and strikethrough still work from the keyboard. |

`"static"` is the default and is omitted from JSON. A matrix dropdown or dynamic matrix cell defaults to `"onSelection"`.

With `acceptCarriageReturn: false` the editor is one line: no paragraphs and no lists. Otherwise it is a block editor.

The toolbar commands are bold, italic, underline, strikethrough, link, bulleted list, numbered list, and clear formatting. Lists are available only in block mode. A link must use `http://`, `https://`, or `mailto:`. A command applied to a selection leaves that selection in place, so the same text can take another format and an on-selection bar stays open.

If the stored value contains markup the editor cannot change (a table, a style, a script), the question opens in source mode and shows the raw HTML. The respondent can choose "Edit as rich text", which drops the unsupported formatting. Blurring the field without that choice leaves the original value unchanged.

## `RichText` helpers

`RichText` is a static class. Importing the plugin does not subscribe it to anything.

### Render survey strings

Add the built-in handler yourself:

```ts
survey.onTextMarkdown.add(RichText.renderStringHandler);
```

Removing it and calling `survey.locStrsChanged()` restores plain text. The handler renders a string only when its edit mode is not `"none"`:

- A property whose serializer type is `"html"` renders as a block (`<p>`, lists, line breaks).
- A property whose type is `"inlinehtml"` renders as one line (marks and links; blocks become `<br>`).
- Every other property, including ordinary `"text"` titles and descriptions, stays plain. Markdown is not interpreted.

To opt a property in, change its serializer type:

```ts
Serializer.findProperty("question", "title").type = "inlinehtml";
Serializer.findProperty("survey", "description").type = "html";
```

Replace `RichText.getEditMode` to decide per string. It receives the owner, the property name, the `LocalizableString`, and the default mode, and must return `"none"`, `"inline"`, or `"block"`. `RichText.getStringEditMode(owner, name, locStr)` is the resolved mode the handler uses.

You can also write your own `onTextMarkdown` handler and call `RichText.sanitizeHtml` or `RichText.renderStringHandler` for the strings you want.

### Sanitize

```ts
RichText.sanitizeHtml(html);                  // block
RichText.sanitizeHtml(html, { inline: true }); // one line
RichText.getDisallowedHtml(html);             // ["script", "style", "javascript", ...]
```

`sanitizeHtml` returns the subset the editor can store. `getDisallowedHtml` lists what was rejected and does not return the cleaned HTML. The allowed markup is:

- Marks: `strong`/`b`, `em`/`i`, `u`, `s`/`strike`/`del`. Synonyms are rewritten to `strong`, `em`, and `s`.
- Links: `a` with `http`, `https`, or `mailto`. `javascript:`, `data:`, and event handlers are removed. Kept links get `target="_blank"` and `rel="noopener noreferrer"`.
- Blocks: `p`, `div`, `br`, `ul`, `ol`, `li`. Nested lists are flattened.

Anything else is dropped and its text is kept. Tables and headings become paragraphs. `script`, `style`, and similar elements are removed entirely. In inline mode, paragraphs and list items become line breaks.

### Find stored markup the editor cannot keep

```ts
const issues = RichText.findUnsupported(survey);
// { element, name, locale, text }
```

This walks localizable strings that have HTML in any locale, plus `richtext` answers. Supported markup is not reported. Use it before turning the handler on, so existing tables, styles, and scripts are visible before display strips them.

### Attach an editor to any element

For a string editor outside a question, such as a property grid:

```ts
const handle = RichText.attachEditor(element, {
  mode: "inline",          // or "block"
  onInput: () => {},       // the element changed; read element.innerHTML yourself
  onState: () => {}        // toolbarOpen changed
});

handle.toolbar;            // ActionContainer
handle.toolbarOpen;        // true only while text is selected
handle.detach();
```

This editor does not read or write a question value. The host owns the HTML in the element. The toolbar is on-selection. `onInput` fires for edits; blur does not rewrite the element's HTML.

## Localization

`RichText.setRichTextStrings` patches the editor UI strings (toolbar labels, link dialog, source-mode notice):

```ts
RichText.setRichTextStrings({
  richTextBold: "Fett",
  richTextSourceMode: "Dieser Text enthält Formatierung, die der Editor nicht ändern kann."
});
```

The keys are `richTextToolbar`, `richTextBold`, `richTextItalic`, `richTextUnderline`, `richTextStrikethrough`, `richTextLink`, `richTextBulletedList`, `richTextNumberedList`, `richTextClearFormatting`, `richTextLinkUrl`, `richTextLinkPlaceholder`, `richTextLinkInvalid`, `richTextSourceMode`, and `richTextEditAnyway`.
