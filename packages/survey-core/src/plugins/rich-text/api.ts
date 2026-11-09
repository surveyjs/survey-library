import { ActionContainer, Base, LocalizableString } from "survey-core";
import { findUnsupported, isLossless, UnsupportedHit } from "./lossless";
import { getUnsupportedMarkdown } from "./markdown";
import { getDisallowedHtml, sanitizeHtml } from "./sanitizer";

export interface IRichTextConverterContext {
  inline: boolean;
  element?: Base;
  name?: string;
}

export interface IRichTextConverter {
  toHtml(source: string, context: IRichTextConverterContext): string;
  toSource(root: HTMLElement, context: IRichTextConverterContext): string;
  lossless?: boolean;
  checkLossless?(source: string, context: IRichTextConverterContext): boolean;
  getUnsupported?(source: string): string[];
}

export type RichTextEditMode = "none" | "inline" | "block";

export interface IRichTextEditorOptions {
  mode: "inline" | "block";
  onInput?: () => void;
}

export interface IRichTextEditorHandle {
  toolbar: ActionContainer;
  detach(): void;
}

// Filled by index.ts after every module has loaded. api.ts does not import survey-strings.ts.
export const richTextBindings = {
  markdownToHtml: (_text: string, _context?: Partial<IRichTextConverterContext>): string => "",
  htmlToMarkdown: (html: string, _context?: Partial<IRichTextConverterContext>): string => html,
  textMarkdownHandler: (_sender: any, _options: { text: string, html: string, element?: Base, name?: string }): void => { return; },
  htmlToMarkdownHandler: (_sender: any, options: { element?: Base, name?: string, html: string, text: string }): void => { options.text = options.html; },
  getStringEditMode: (_owner: Base, _name: string, _locStr: LocalizableString): RichTextEditMode => "none",
  attachEditor: (_element: HTMLElement, _options: IRichTextEditorOptions): IRichTextEditorHandle => ({ toolbar: undefined as any, detach: (): void => { return; } })
};

export class RichText {
  public static getEditMode: (owner: Base, name: string, locStr: LocalizableString, defaultMode: RichTextEditMode) => RichTextEditMode = (_owner, _name, _locStr, defaultMode) => defaultMode;

  public static isLossless(source: string, context: IRichTextConverterContext): boolean {
    return isLossless(source, context);
  }

  public static getUnsupportedMarkdown(source: string): string[] {
    return getUnsupportedMarkdown(source);
  }

  public static findUnsupported(survey: any): UnsupportedHit[] {
    return findUnsupported(survey);
  }

  public static sanitizeHtml(html: string, options?: { inline?: boolean }): string {
    return sanitizeHtml(html, !!options && !!options.inline);
  }

  public static getDisallowedHtml(html: string): string[] {
    return getDisallowedHtml(html);
  }

  public static markdownToHtml(text: string, context?: Partial<IRichTextConverterContext>): string {
    return richTextBindings.markdownToHtml(text, context);
  }

  public static htmlToMarkdown(html: string, context?: Partial<IRichTextConverterContext>): string {
    return richTextBindings.htmlToMarkdown(html, context);
  }

  public static textMarkdownHandler(sender: any, options: { text: string, html: string, element?: Base, name?: string }): void {
    richTextBindings.textMarkdownHandler(sender, options);
  }

  public static htmlToMarkdownHandler(sender: any, options: { element?: Base, name?: string, html: string, text: string }): void {
    richTextBindings.htmlToMarkdownHandler(sender, options);
  }

  public static getStringEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode {
    return richTextBindings.getStringEditMode(owner, name, locStr);
  }

  public static attachEditor(element: HTMLElement, options: IRichTextEditorOptions): IRichTextEditorHandle {
    return richTextBindings.attachEditor(element, options);
  }
}

export type { UnsupportedHit };
