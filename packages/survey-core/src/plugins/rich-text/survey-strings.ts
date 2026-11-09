import { Base, LocalizableString } from "survey-core";
import { IRichTextConverterContext, IRichTextEditorHandle, IRichTextEditorOptions, RichText, RichTextEditMode } from "./api";
import { getAnswerEditMode, getDefaultEditMode } from "./edit-mode";
import { RichTextEditorModel } from "./editor-model";
import { markdownConverter } from "./markdown";
import { createDetachedElement } from "./runs";

function resolveInline(context?: Partial<IRichTextConverterContext>): boolean {
  if (context && context.inline !== undefined) return context.inline;
  if (context && context.name === "value" && context.element && context.element.isDescendantOf("comment")) {
    return getAnswerEditMode(context.element) === "inline";
  }
  if (!context || !context.element) return true;
  const loc = context.element.getLocalizableString(context.name || "");
  return getStringEditMode(context.element, context.name || "", loc) !== "block";
}

function converterContext(context?: Partial<IRichTextConverterContext>): IRichTextConverterContext {
  return {
    inline: resolveInline(context),
    element: context && context.element,
    name: context && context.name
  };
}

export function markdownToHtml(text: string, context?: Partial<IRichTextConverterContext>): string {
  const html = markdownConverter.toHtml(text, converterContext(context));
  if (!html || html.indexOf("<") < 0) return "";
  return html;
}

export function htmlToMarkdown(html: string, context?: Partial<IRichTextConverterContext>): string {
  const element = createDetachedElement(html);
  if (!element) return html;
  return markdownConverter.toSource(element, converterContext(context));
}

export function textMarkdownHandler(_sender: any, options: { text: string, html: string, element?: Base, name?: string }): void {
  const html = markdownToHtml(options.text, { element: options.element, name: options.name });
  if (html) options.html = html;
}

export function htmlToMarkdownHandler(_sender: any, options: { element?: Base, name?: string, html: string, text: string }): void {
  options.text = htmlToMarkdown(options.html || "", { element: options.element, name: options.name });
}

export function getStringEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode {
  return RichText.getEditMode(owner, name, locStr, getDefaultEditMode(owner, name, locStr));
}

export function attachEditor(element: HTMLElement, options: IRichTextEditorOptions): IRichTextEditorHandle {
  const editor = new RichTextEditorModel({
    getValue: () => "",
    setValue: () => {},
    isInputTextUpdate: false,
    acceptCarriageReturn: options.mode !== "inline",
    mode: options.mode,
    managesValue: false,
    onInput: options.onInput
  });
  editor.attach(element);
  return { toolbar: editor.toolbar, detach: () => editor.detach() };
}
