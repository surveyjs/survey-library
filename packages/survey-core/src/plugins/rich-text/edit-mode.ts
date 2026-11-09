import { Base, LocalizableString, QuestionCommentModel, Serializer } from "survey-core";

export type RichTextEditMode = "none" | "inline" | "block";

export function getDefaultEditMode(owner: Base, name: string, locStr: LocalizableString): RichTextEditMode {
  if (!locStr || !locStr.useMarkdown) return "none";
  const typeName = owner && typeof owner.getType === "function" ? owner.getType() : undefined;
  const type = typeName ? Serializer.findProperty(typeName, name)?.type : undefined;
  if (type === "html") return "none";
  return type === "text" ? "block" : "inline";
}

export function getCommentEditMode(question: QuestionCommentModel): RichTextEditMode {
  return question.acceptCarriageReturn === false ? "inline" : "block";
}
