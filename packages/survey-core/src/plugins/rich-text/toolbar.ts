import { Action, ActionContainer, settings } from "survey-core";
import { getRichTextString } from "./rich-text-strings";

export interface IRichTextToolbarTarget {
  toggleMark(mark: "bold" | "italic" | "strike"): void;
  applyList(ordered: boolean): void;
  clearFormatting(): void;
  openLink(): void;
}

export interface IRichTextToolbarActions {
  bold: Action;
  italic: Action;
  strike: Action;
  link: Action;
  bulleted: Action;
  numbered: Action;
  clear: Action;
}

export function createRichTextToolbar(editor: IRichTextToolbarTarget): { toolbar: ActionContainer, actions: IRichTextToolbarActions } {
  const preventFocusLoss = (event: any) => {
    if (event && event.preventDefault) event.preventDefault();
  };
  const make = (id: string, icon: string, titleKey: string, run: () => void): Action => {
    return new Action({
      id: id,
      iconName: icon,
      title: getRichTextString(titleKey),
      showTitle: false,
      tooltip: getRichTextString(titleKey),
      onMouseDown: preventFocusLoss,
      action: () => run()
    });
  };
  const actions: IRichTextToolbarActions = {
    bold: make("rich-text-bold", "icon-rich-text-bold", "richTextBold", () => editor.toggleMark("bold")),
    italic: make("rich-text-italic", "icon-rich-text-italic", "richTextItalic", () => editor.toggleMark("italic")),
    strike: make("rich-text-strike", "icon-rich-text-strike", "richTextStrikethrough", () => editor.toggleMark("strike")),
    link: make("rich-text-link", "icon-rich-text-link", "richTextLink", () => editor.openLink()),
    bulleted: make("rich-text-bulleted", "icon-rich-text-list", "richTextBulletedList", () => editor.applyList(false)),
    numbered: make("rich-text-numbered", "icon-rich-text-numbered-list", "richTextNumberedList", () => editor.applyList(true)),
    clear: make("rich-text-clear", "icon-rich-text-clear", "richTextClearFormatting", () => editor.clearFormatting())
  };
  // The dialog hook is installed when the modal host mounts, which is after the first toolbars are built.
  syncRichTextLinkVisibility(actions.link);
  const toolbar = new ActionContainer();
  toolbar.sizeMode = "small";
  toolbar.actions = [actions.bold, actions.italic, actions.strike, actions.link, actions.bulleted, actions.numbered, actions.clear];
  return { toolbar, actions };
}

export function syncRichTextLinkVisibility(link: Action): void {
  link.visible = !!settings.showDialog;
}
