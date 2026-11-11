import { Action, ActionContainer, settings } from "survey-core";
import { getRichTextString } from "./rich-text-strings";

export type RichTextCommand = "bold" | "italic" | "underline" | "strikeThrough" | "createLink" | "insertUnorderedList" | "insertOrderedList" | "removeFormat";

export interface IRichTextToolbarHost {
  run(command: RichTextCommand): void;
  keepSelection(event: any): void;
}

export function createRichTextToolbar(host: IRichTextToolbarHost, mode: "inline" | "block"): ActionContainer {
  const toolbar = new ActionContainer();
  toolbar.sizeMode = "small";
  toolbar.setActionsAppearance({ style: "neutral", mode: "tertiary", size: "x-small" });
  const actions = [
    button(host, "rich-text-bold", "richTextBold", "bold"),
    button(host, "rich-text-italic", "richTextItalic", "italic"),
    button(host, "rich-text-underline", "richTextUnderline", "underline"),
    button(host, "rich-text-strikethrough", "richTextStrikethrough", "strikeThrough"),
    button(host, "rich-text-link", "richTextLink", "createLink"),
    button(host, "rich-text-list-bulleted", "richTextBulletedList", "insertUnorderedList"),
    button(host, "rich-text-list-numbered", "richTextNumberedList", "insertOrderedList"),
    button(host, "rich-text-clear", "richTextClearFormatting", "removeFormat")
  ];
  actions[4].visible = typeof settings.showDialog === "function";
  actions[5].visible = mode === "block";
  actions[6].visible = mode === "block";
  toolbar.actions = actions;
  return toolbar;
}

function button(host: IRichTextToolbarHost, id: string, labelKey: string, command: RichTextCommand): Action {
  const label = getRichTextString(labelKey);
  return new Action({
    id: id,
    title: label,
    ariaLabel: label,
    iconName: "icon-" + id + "-16x16",
    iconSize: 16,
    showTitle: false,
    action: () => host.run(command),
    onMouseDown: (event: any) => host.keepSelection(event)
  });
}
