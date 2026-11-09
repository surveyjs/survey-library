// Importing the plugin does not attach handlers and does not change string rendering.
// Renderer registration, icon registration and showing allowRichText belong to the editor milestone.

export { RichText } from "./api";
export { setRichTextStrings } from "./rich-text-strings";
export type { RichTextEditMode } from "./edit-mode";
export type { IRichTextEditorOptions, UnsupportedRichText } from "./api";
