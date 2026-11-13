import { Base, LocalizableString, QuestionCommentModel, Serializer } from "survey-core";

export type RichTextEditMode = "none" | "inline" | "block";

export function getDefaultEditMode(owner: Base, name: string, _locStr: LocalizableString): RichTextEditMode {
  const typeName = owner && typeof owner.getType === "function" ? owner.getType() : undefined;
  const type = typeName && name ? Serializer.findProperty(typeName, name)?.type : undefined;
  if (type === "inlinehtml") return "inline";
  if (type === "html") return "block";
  return "none";
}

export function getCommentEditMode(question: QuestionCommentModel): RichTextEditMode {
  return question.acceptCarriageReturn === false ? "inline" : "block";
}
