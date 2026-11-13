// Importing the plugin registers the "richtext" question, its renderer and the toolbar icons.
// It does not attach event handlers. Survey strings change only when a customer adds renderStringHandler.

import { RendererFactory, SvgRegistry } from "survey-core";
import { richTextIcons } from "./icons";
import { RichTextEditorModel } from "./editor-model";
import { RichText } from "./api";
import "./question";

RendererFactory.Instance.registerRenderer("richtext", "default", "sv-rich-text", true);
SvgRegistry.registerIcons(richTextIcons);

const host = globalThis as any;
if (!host.SurveyRichText) host.SurveyRichText = {};
host.SurveyRichText.RichText = RichText;
host.SurveyRichText.RichTextEditorModel = RichTextEditorModel;
host.__surveyRichTextPlugin = true;

export { RichText } from "./api";
export { RichTextEditorModel } from "./editor-model";
export { QuestionRichTextModel } from "./question";
export type { RichTextToolbarMode } from "./question";
export { setRichTextStrings } from "./rich-text-strings";
export type { RichTextEditMode } from "./edit-mode";
export type { IRichTextEditorHandle, IRichTextEditorOptions, UnsupportedRichText } from "./api";
