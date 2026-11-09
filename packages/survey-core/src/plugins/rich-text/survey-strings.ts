import { TextMarkdownEvent } from "survey-core";
import { sanitizeHtml } from "./sanitizer";

// Canonical tags compare equal to the input, but plain text would show those tags.
// Equality alone would skip them. A tag the HTML parser would read is not plain text.
export function renderedHtml(text: string, inline: boolean): string | undefined {
  const html = sanitizeHtml(text, { inline: inline });
  if (html !== text || /<[A-Za-z/!?]/.test(html)) return html;
  return undefined;
}

export function applyStringHtml(options: TextMarkdownEvent, inline: boolean): void {
  const html = renderedHtml(options.text, inline);
  if (html !== undefined) options.html = html;
}
