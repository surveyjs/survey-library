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

// Both toolbars use x-small buttons and the 16px icons. Floating buttons are tertiary; the static footer uses tertiary-muted.
export function applyRichTextToolbarChrome(toolbar: ActionContainer, chrome: "floating" | "static"): void {
  const floating = chrome === "floating";
  const size = 16;
  toolbar.sizeMode = "small";
  toolbar.setActionsAppearance({ style: "brand", mode: floating ? "tertiary" : "tertiary-muted", size: floating ? "x-small" : "x-small" });
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
