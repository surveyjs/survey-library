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
  richTextLinkPlaceholder: "http://, https://, or mailto:",
  richTextLinkInvalid: "Enter a link that starts with http://, https://, or mailto:",
  richTextSourceMode: "This text contains formatting the editor cannot change. You are editing its source.",
  richTextEditAnyway: "Edit as rich text (unsupported formatting will be removed)"
};

export function setRichTextStrings(patch: { [key: string]: string }): void {
  if (!patch) return;
  const keys = Object.keys(patch);
  for (let i = 0; i < keys.length; i++) richTextStrings[keys[i]] = patch[keys[i]];
}

export function getRichTextString(key: string): string {
  const value = richTextStrings[key];
  return value === undefined ? key : value;
}
