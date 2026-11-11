// Importing the plugin shows allowRichText and richTextToolbarMode, registers the comment renderer and the toolbar icons.
// It does not attach event handlers. Survey strings change only when a customer adds renderStringHandler.

import { RendererFactory, Serializer, SvgRegistry } from "survey-core";
import { richTextIcons } from "./icons";
import { RichTextEditorModel } from "./editor-model";
import { RichText } from "./api";

const allowRichText = Serializer.findProperty("comment", "allowRichText");
if (allowRichText) allowRichText.visible = true;
const richTextToolbarMode = Serializer.findProperty("comment", "richTextToolbarMode");
if (richTextToolbarMode) richTextToolbarMode.visible = true;
RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
SvgRegistry.registerIcons(richTextIcons);

const host = globalThis as any;
if (!host.SurveyRichText) host.SurveyRichText = {};
host.SurveyRichText.RichText = RichText;
host.SurveyRichText.RichTextEditorModel = RichTextEditorModel;
host.__surveyRichTextPlugin = true;

export { RichText } from "./api";
export { RichTextEditorModel } from "./editor-model";
export { setRichTextStrings } from "./rich-text-strings";
export type { RichTextEditMode } from "./edit-mode";
export type { IRichTextEditorOptions, UnsupportedRichText } from "./api";
