import { RendererFactory, Serializer, SvgRegistry } from "survey-core";
import { installConverters, richTextBindings } from "./api";
import { htmlConverter } from "./html-format";
import { richTextIcons } from "./icons";
import { markdownConverter } from "./markdown";
import { attachEditor, getStringEditMode, htmlToMarkdown, htmlToMarkdownHandler, markdownToHtml, textMarkdownHandler } from "./survey-strings";

export { RichText } from "./api";
export { RichTextEditorModel } from "./editor-model";
export type { IRichTextCommands, IRichTextEditorHost, RichTextMark, RichTextMarkState } from "./editor-model";
export { getRichTextString, setRichTextStrings } from "./rich-text-strings";
export type { IRichTextConverter, IRichTextConverterContext, IRichTextEditorHandle, IRichTextEditorOptions, RichTextEditMode, UnsupportedHit } from "./api";

installConverters(markdownConverter, htmlConverter);
richTextBindings.markdownToHtml = markdownToHtml;
richTextBindings.htmlToMarkdown = htmlToMarkdown;
richTextBindings.textMarkdownHandler = textMarkdownHandler;
richTextBindings.htmlToMarkdownHandler = htmlToMarkdownHandler;
richTextBindings.getStringEditMode = getStringEditMode;
richTextBindings.attachEditor = attachEditor;
Serializer.findProperty("comment", "allowRichText").visible = true;
Serializer.addProperty("comment", {
  name: "richTextEditMode",
  default: "block",
  choices: ["inline", "block"],
  visible: false,
  isSerializable: false
});
Serializer.addProperty("comment", {
  name: "richTextToolbarVisibility",
  default: "always",
  choices: ["always", "onFocus"],
  visible: false,
  isSerializable: false
});
// No type: the value is a converter object, stored as-is and never written to JSON.
Serializer.addProperty("comment", {
  name: "richTextConverter",
  visible: false,
  isSerializable: false
});
Serializer.addProperty("comment", {
  name: "richTextDisableBold",
  visible: false,
  isSerializable: false
});
RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
SvgRegistry.registerIcons(richTextIcons);
