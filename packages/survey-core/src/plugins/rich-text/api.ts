import { Base, LocalizableString, SurveyModel, TextMarkdownEvent } from "survey-core";
import { getDefaultEditMode, RichTextEditMode } from "./edit-mode";
import { findUnsupported, UnsupportedRichText } from "./unsupported";
import { getDisallowedHtml, sanitizeHtml } from "./sanitizer";
import { applyStringHtml } from "./survey-strings";
import { setRichTextStrings } from "./rich-text-strings";

export type { RichTextEditMode } from "./edit-mode";

export interface IRichTextEditorOptions {
  mode: "inline" | "block";
  onInput?: () => void;
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
    const inline = RichText.getStringEditMode(owner, options.name, locStr) !== "block";
    applyStringHtml(options, inline);
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
}

export { setRichTextStrings };
export type { UnsupportedRichText };
