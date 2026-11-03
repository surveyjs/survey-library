export const richTextStrings: { [index: string]: string } = {
  richTextToolbar: "Formatting",
  richTextBold: "Bold",
  richTextItalic: "Italic",
  richTextStrikethrough: "Strikethrough",
  richTextLink: "Link",
  richTextBulletedList: "Bulleted list",
  richTextNumberedList: "Numbered list",
  richTextClearFormatting: "Clear formatting",
  richTextLinkUrl: "URL",
  richTextLinkInvalid: "Enter a link that starts with http://, https://, or mailto:",
  richTextSourceMode: "This text contains formatting the editor cannot change. You are editing its source.",
  richTextEditAnyway: "Edit as rich text (unsupported formatting will be removed)"
};

export function setRichTextStrings(patch: { [key: string]: string }): void {
  if (!patch) return;
  Object.keys(patch).forEach(key => {
    richTextStrings[key] = patch[key];
  });
}

export function getRichTextString(key: string): string {
  return richTextStrings[key] === undefined ? key : richTextStrings[key];
}
