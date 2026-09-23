// The public surface of "survey-core/collaboration". A separate entry point on purpose: a form
// that does not collaborate loads neither this JS nor its CSS, and nothing under src/ outside
// src/plugins/collaboration/ imports from here. entries/index.ts does not reference this file.

export { CollaborationPlugin } from "../src/plugins/collaboration/index";
export type { ICollaborationOptions } from "../src/plugins/collaboration/index";

export type {
  ICollabIn,
  ICollabOut,
  IInitMessage,
  IValueMessage,
  IPeerMessage,
  IPeerLeftMessage,
  IStatusMessage,
  IPresenceMessage,
} from "../src/plugins/collaboration/collab-messages";

export type { IPresencePeerEntry, IPresencePeer } from "../src/plugins/collaboration/presence/presence-envelope";
export {
  presenceInitials,
  presenceColorSlot,
  PRESENCE_COLOR_SLOTS,
  PRESENCE_FIRST_COLOR_SLOT,
} from "../src/plugins/collaboration/presence/presence-envelope";

export type { IHistoryEntry } from "../src/plugins/collaboration/history/history-entry";
export {
  describeValue,
  historyAuthorLabel,
  MAX_HISTORY_TEXT,
} from "../src/plugins/collaboration/history/history-entry";
export { HistoryController } from "../src/plugins/collaboration/history/history-controller";
export type { IHistoryOptions } from "../src/plugins/collaboration/history/history-controller";

import { checkLibraryVersion } from "survey-core";
export let Version: string;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
Version = `${process.env.VERSION}`;
// survey-core is external here, so the two halves are separate files that must match:
// one Serializer, one settings object, one Base identity. Say so loudly if they drift.
checkLibraryVersion(Version, "survey-core-collaboration");
