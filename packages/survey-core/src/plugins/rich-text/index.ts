import { installConverters } from "./api";
import { htmlConverter } from "./html-format";
import { markdownConverter } from "./markdown";
import { activateRichTextProvider } from "./provider";

export { RichText } from "./api";
export { setRichTextStrings } from "./rich-text-strings";
export type { IRichTextConverter, IRichTextConverterContext, UnsupportedHit } from "./api";

installConverters(markdownConverter, htmlConverter);
activateRichTextProvider();
