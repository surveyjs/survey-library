import { ActionContainer } from "./actions/container";
import { Base } from "./base";
import { LocalizableString } from "./localizablestring";

export type RichTextEditMode = "none" | "inline" | "block";

export interface IRichTextContext {
  element?: Base;
  name?: string;
  item?: any;
  format?: "markdown" | "html";
  inline?: boolean;
}

export interface IRichTextEditorOptions {
  mode: RichTextEditMode;
  format: "markdown" | "html";
  onChange?: (source: string) => void;
}

export interface IRichTextEditorHandle {
  toolbar: ActionContainer;
  getSource(): string;
  detach(): void;
}

// Filled by survey-core/rich-text on import. This module does not import that package:
// a survey that never loads the plugin keeps settings.richText undefined.
export interface IRichTextProvider {
  readonly defaultFormat: "markdown" | "html";
  toHtml(source: string, context: IRichTextContext): string;
  toSource(root: HTMLElement, context: IRichTextContext): string;
  getEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode;
  isLossless(source: string, context: IRichTextContext): boolean;
  attachEditor(element: HTMLElement, options: IRichTextEditorOptions): IRichTextEditorHandle;
}
