import { Action, ActionContainer } from "survey-core";
import { getRichTextString } from "./rich-text-strings";

export type RichTextCommand = "bold" | "italic" | "strikeThrough" | "insertUnorderedList" | "insertOrderedList" | "removeFormat";

export interface IRichTextToolbarHost {
  run(command: RichTextCommand): void;
  keepSelection(event: any): void;
}

export function createRichTextToolbar(host: IRichTextToolbarHost, mode: "inline" | "block"): ActionContainer {
  const toolbar = new ActionContainer();
  toolbar.sizeMode = "small";
  const actions = [
    button(host, "rich-text-bold", "richTextBold", "bold"),
    button(host, "rich-text-italic", "richTextItalic", "italic"),
    button(host, "rich-text-strikethrough", "richTextStrikethrough", "strikeThrough"),
    button(host, "rich-text-list-bulleted", "richTextBulletedList", "insertUnorderedList"),
    button(host, "rich-text-list-numbered", "richTextNumberedList", "insertOrderedList"),
    button(host, "rich-text-clear", "richTextClearFormatting", "removeFormat")
  ];
  actions[3].visible = mode === "block";
  actions[4].visible = mode === "block";
  toolbar.actions = actions;
  return toolbar;
}

function button(host: IRichTextToolbarHost, id: string, labelKey: string, command: RichTextCommand): Action {
  const label = getRichTextString(labelKey);
  return new Action({
    id: id,
    title: label,
    ariaLabel: label,
    iconName: "icon-" + id,
    showTitle: false,
    action: () => host.run(command),
    onMouseDown: (event: any) => host.keepSelection(event)
  });
}
