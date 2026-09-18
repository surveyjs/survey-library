// The message vocabulary of the collaboration plugin. It is deliberately also the
// vocabulary of the wire protocol a relay speaks, so a host forwards frames into
// apply() and out of onEvent without translating anything.
//
// Two rules make that forwarding safe, and both are part of the contract:
//   - an unknown `type` is ignored silently (an old client survives a new server);
//   - unknown FIELDS are ignored silently, so a frame may carry things this plugin
//     does not own - the schema in `init.seed`, the sender id in `value.from`.

import { IPresencePeerEntry } from "./presence/presence-envelope";

// One answer change. `key` is already the wire key: the plugin owns the codec, so
// a comment does NOT travel under the sender's own survey.commentSuffix (that is a
// per-client setting - two differently configured peers would write to different
// fields and diverge in silence).
export interface IValueMessage {
  type: "value";
  key: string;
  value: any;
}

// Bootstrap: the authoritative full state plus the full roster, in one frame.
// One frame rather than three so no peer edit can land between them and be erased
// by a state that does not contain it yet.
export interface IInitMessage {
  type: "init";
  values?: { [key: string]: any };
  peers?: Array<IPresencePeerEntry>;
}

export interface IPeerMessage {
  type: "peer";
  peer: IPresencePeerEntry;
}

export interface IPeerLeftMessage {
  type: "peer-left";
  clientId: string;
}

// Synthesized by the host from the socket lifecycle - not a wire frame.
// "connected" is absent on purpose: the plugin sets it when it handles `init`,
// which cannot arrive while disconnected.
export interface IStatusMessage {
  type: "status";
  status: "connecting" | "closed";
}

export type ICollabIn = IInitMessage | IValueMessage | IPeerMessage | IPeerLeftMessage | IStatusMessage;

// Presence travels as the full state, never a diff, so any single frame
// re-establishes a participant. `retain` tells the relay whether to keep it for
// late joiners (focus, page) or treat it as droppable (cursor).
export interface IPresenceMessage {
  type: "presence";
  state: any;
  retain: boolean;
}

export type ICollabOut = IValueMessage | IPresenceMessage;
