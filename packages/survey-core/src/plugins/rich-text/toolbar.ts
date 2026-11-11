import { Action, ActionContainer, settings } from "survey-core";
import { getRichTextString } from "./rich-text-strings";

export type RichTextCommand = "bold" | "italic" | "underline" | "strikeThrough" | "createLink" | "insertUnorderedList" | "insertOrderedList" | "removeFormat";

export interface IRichTextToolbarHost {
  run(command: RichTextCommand): void;
  keepSelection(event: any): void;
}

export function createRichTextToolbar(host: IRichTextToolbarHost, mode: "inline" | "block"): ActionContainer {
  const toolbar = new ActionContainer();
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
  applyRichTextToolbarChrome(toolbar, "floating");
  return toolbar;
}

// The floating toolbar uses compact x-small buttons. The static footer toolbar uses small buttons and the 24px icons.
export function applyRichTextToolbarChrome(toolbar: ActionContainer, chrome: "floating" | "static"): void {
  const floating = chrome === "floating";
  const size = floating ? 16 : 24;
  toolbar.sizeMode = "small";
  toolbar.setActionsAppearance({ style: "neutral", mode: "tertiary", size: floating ? "x-small" : "small" });
  for (let i = 0; i < toolbar.actions.length; i++) {
    const action = toolbar.actions[i];
    if (!action.iconName) continue;
    action.iconName = String(action.iconName).replace(/-\d+x\d+$/, "-" + size + "x" + size);
    action.iconSize = size;
  }
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
