// The public surface of "survey-core/rich-text". A separate entry point on purpose: a form
// that does not use rich text loads neither this JS nor its CSS, and nothing under src/
// outside src/plugins/rich-text/ imports from here. entries/index.ts does not reference this file.

export { RichText, RichTextEditorModel, getRichTextString, setRichTextStrings } from "../src/plugins/rich-text/index";
export type { IRichTextConverter, IRichTextConverterContext, IRichTextEditorHandle, IRichTextEditorOptions, RichTextEditMode, UnsupportedHit } from "../src/plugins/rich-text/index";

import { checkLibraryVersion } from "survey-core";
export let Version: string;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
Version = `${process.env.VERSION}`;
// survey-core is external here, so the two halves are separate files that must match:
// one Serializer, one settings object, one Base identity. Say so loudly if they drift.
checkLibraryVersion(Version, "survey-core-rich-text");
