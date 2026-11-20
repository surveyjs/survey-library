import { ActionContainer, Base, LocalizableString, SurveyModel, TextMarkdownEvent } from "survey-core";
import { getDefaultEditMode, RichTextEditMode } from "./edit-mode";
import { findUnsupported, UnsupportedRichText } from "./unsupported";
import { getDisallowedHtml, sanitizeHtml } from "./sanitizer";
import { applyStringHtml } from "./survey-strings";
import { setRichTextStrings } from "./rich-text-strings";
import { RichTextEditorModel } from "./editor-model";

export type { RichTextEditMode } from "./edit-mode";

export interface IRichTextEditorOptions {
  mode: "inline" | "block";
  onInput?: () => void;
  // Fires when toolbarOpen changes. The string editor has no question, so the toolbar is on-selection.
  onState?: () => void;
}

export interface IRichTextEditorHandle {
  toolbar: ActionContainer;
  readonly toolbarOpen: boolean;
  detach(): void;
}

export class RichText {
  public static sanitizeHtml(html: string, options?: { inline?: boolean }): string {
    return sanitizeHtml(html, options);
  }
  public static getDisallowedHtml(html: string): string[] {
    return getDisallowedHtml(html);
  }
  public static renderStringHandler(sender: SurveyModel, options: TextMarkdownEvent): void {
    const owner = (options.item as Base) || options.element;
    const locStr = owner && typeof owner.getLocalizableString === "function"
      ? owner.getLocalizableString(options.name)
      : undefined;
    const mode = RichText.getStringEditMode(owner, options.name, locStr);
    if (mode === "none") return;
    applyStringHtml(options, mode !== "block");
  }
  public static findUnsupported(survey: SurveyModel): UnsupportedRichText[] {
    return findUnsupported(survey);
  }
  public static getEditMode(owner: Base, name: string, locStr: LocalizableString, defaultMode: RichTextEditMode): RichTextEditMode {
    return defaultMode;
  }
  public static getStringEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode {
    return RichText.getEditMode(owner, name, locStr, getDefaultEditMode(owner, name, locStr));
  }
  public static attachEditor(element: HTMLElement, options: IRichTextEditorOptions): IRichTextEditorHandle {
    const model = new RichTextEditorModel(undefined, {
      mode: options.mode,
      contentAgnostic: true,
      onInput: options.onInput
    });
    model.onState = options.onState;
    model.attach(element);
    model.syncSelection();
    return {
      toolbar: model.toolbar,
      get toolbarOpen(): boolean { return model.toolbarOpen; },
      detach: (): void => {
        model.onState = undefined;
        model.detach();
      }
    };
  }
}

export { setRichTextStrings };
export type { UnsupportedRichText };
