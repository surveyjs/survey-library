import { Base, DomDocumentHelper, LocalizableString, RichTextEditMode, Serializer } from "survey-core";

const blockProperties = ["description"];

export function getStringFormat(owner: Base): "plain" | "markdown" | "html" {
  const survey = owner.getType?.() === "survey" ? owner : owner.getSurvey?.();
  const format = survey && (survey as any).stringFormat;
  if (format === "markdown" || format === "html") return format;
  return "plain";
}

export function getDefaultEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode {
  if (!locStr || !locStr.useMarkdown) return "none";
  if (getStringFormat(owner) === "plain") return "none";
  if (Serializer.findProperty(owner.getType?.(), name)?.type === "html") return "none";
  return blockProperties.indexOf(name) > -1 ? "block" : "inline";
}

export function isRichTextBoldHidden(element: HTMLElement): boolean {
  const style = DomDocumentHelper.getComputedStyle(element);
  if (!style) return false;
  const weight = style.fontWeight;
  const numeric = weight === "bold" ? 700 : weight === "normal" ? 400 : parseInt(weight, 10);
  return !isNaN(numeric) && numeric >= 600;
}
