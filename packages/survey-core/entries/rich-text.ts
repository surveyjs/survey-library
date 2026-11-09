// The public surface of "survey-core/rich-text". A separate entry point on purpose: a form
// that does not load the plugin downloads neither this JS nor its CSS. entries/index.ts
// does not reference this file.

export { RichText } from "../src/plugins/rich-text/index";

import { checkLibraryVersion } from "survey-core";
export let Version: string;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
Version = `${process.env.VERSION}`;
// survey-core is external here, so the two halves are separate files that must match.
checkLibraryVersion(Version, "survey-core-rich-text");
