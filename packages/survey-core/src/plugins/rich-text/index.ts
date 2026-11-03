import { RendererFactory, Serializer, SvgRegistry } from "survey-core";
import { installConverters } from "./api";
import { htmlConverter } from "./html-format";
import { richTextIcons } from "./icons";
import { markdownConverter } from "./markdown";
import { activateRichTextProvider } from "./provider";

export { RichText } from "./api";
export { RichTextEditorModel } from "./editor-model";
export type { IRichTextCommands, IRichTextEditorHost, RichTextMark, RichTextMarkState } from "./editor-model";
export { getRichTextString, setRichTextStrings } from "./rich-text-strings";
export type { IRichTextConverter, IRichTextConverterContext, UnsupportedHit } from "./api";

installConverters(markdownConverter, htmlConverter);
activateRichTextProvider();
Serializer.findProperty("comment", "textFormat").visible = true;
Serializer.findProperty("survey", "stringFormat").visible = true;
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
RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
SvgRegistry.registerIcons(richTextIcons);
