import { Base, IRichTextContext, IRichTextEditorHandle, IRichTextEditorOptions, IRichTextProvider, LocalizableString, RichTextEditMode, settings } from "survey-core";
import { RichText } from "./api";
import { RichTextEditorModel } from "./editor-model";
import { getDefaultEditMode, getStringFormat } from "./edit-mode";

function resolveFormat(context: IRichTextContext): "markdown" | "html" | "plain" {
  if (context.format === "markdown" || context.format === "html" || context.format === "plain") return context.format;
  if (!context.element) return "plain";
  return getStringFormat(context.element);
}

function resolveInline(context: IRichTextContext): boolean {
  if (context.inline !== undefined) return context.inline;
  if (!context.element) return true;
  const loc = context.element.getLocalizableString(context.name || "");
  return richTextProvider.getEditMode(context.element, context.name || "", loc) !== "block";
}

export const richTextProvider: IRichTextProvider = {
  get defaultFormat() {
    return RichText.defaultFormat;
  },
  toHtml(source: string, context: IRichTextContext): string {
    const format = resolveFormat(context);
    if (format === "plain") return "";
    const html = RichText.getFormat(format).toHtml(source, {
      inline: resolveInline(context),
      element: context.element,
      name: context.name
    });
    if (!html || html.indexOf("<") < 0) return "";
    return html;
  },
  toSource(root: HTMLElement, context: IRichTextContext): string {
    const format = resolveFormat(context);
    const used = format === "plain" ? RichText.defaultFormat : format;
    return RichText.getFormat(used).toSource(root, {
      inline: resolveInline(context),
      element: context.element,
      name: context.name
    });
  },
  getEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode {
    return RichText.getEditMode(owner, name, locStr, getDefaultEditMode(owner, name, locStr));
  },
  isLossless(source: string, context: IRichTextContext): boolean {
    const format = resolveFormat(context);
    if (format === "plain") return true;
    return RichText.isLossless(source, format, {
      inline: resolveInline(context),
      element: context.element,
      name: context.name
    });
  },
  attachEditor(element: HTMLElement, options: IRichTextEditorOptions): IRichTextEditorHandle {
    const editor = new RichTextEditorModel({
      getValue: () => "",
      setValue: (value: string) => options.onChange?.(value),
      isInputTextUpdate: false,
      acceptCarriageReturn: options.mode !== "inline",
      mode: options.mode === "inline" ? "inline" : "block",
      format: options.format,
      owner: undefined
    });
    editor.attach(element);
    return { toolbar: editor.toolbar, getSource: () => editor.getSource(), detach: () => editor.detach() };
  }
};

export function activateRichTextProvider(): void {
  settings.richText = richTextProvider;
}
