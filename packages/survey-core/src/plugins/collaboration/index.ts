import { EventBase, SurveyModel } from "survey-core";
import { ICollabIn, ICollabOut } from "./collab-messages";
import { IValueSyncOptions, ValueSyncController } from "./data/value-sync";
import { PresenceController } from "./presence/index";
import { IPresencePeer, IPresencePeerEntry } from "./presence/presence-envelope";
import { emptyPresenceState, IPresenceState } from "./presence/presence-state";
import { CollabBarModel, ICollabBarOptions } from "./bar/bar-model";

export * from "./collab-messages";
export * from "./presence/index";
export { ValueSyncController } from "./data/value-sync";
export type { IValueSyncOptions } from "./data/value-sync";
export { MAX_VALUE_CHARS, COMMENT_KEY_SUFFIX, encodeValueKey, decodeValueKey } from "./data/value-record";
export { commitFocusedEditor, QUESTION_ROOT_SELECTOR } from "./data/editor-commit";
export { CollabBarModel, COLLAB_BAR_ELEMENT_ID } from "./bar/bar-model";
export type { ICollabBarOptions, CollabBarStatus } from "./bar/bar-model";
export { getCollabString, setCollabStrings, collaborationStrings } from "./collaboration-strings";

export type CollabStatus = "connecting" | "connected" | "closed";

export interface ICollaborationOptions extends IValueSyncOptions, ICollabBarOptions {
  // Outgoing presence is coalesced to at most one message per this many ms. The window
  // lives here rather than in the host because it is a property of how chatty presence
  // is, not of the transport - and because a host coalescing an event that already
  // carried a payload would end up shipping a state that went stale inside the window.
  presenceCoalesceMs?: number;
  presence?: boolean;
  bar?: boolean;
}

const NO_PEERS: ReadonlyMap<string, IPresencePeer> = new Map<string, IPresencePeer>();
const DEFAULT_PRESENCE_COALESCE_MS = 40;

// Collaborative form filling for a SurveyModel.
//
// It owns no transport: outbound is the `onEvent` event, inbound is the `apply` method,
// so any relay, protocol or storage can drive it - including a test with no network at
// all. The message vocabulary is deliberately also a wire vocabulary, so a host forwards
// frames both ways without translating them.
//
//   const collab = new CollaborationPlugin(survey, { getInviteLink });
//   collab.onEvent.add((_, o) => ws.send(JSON.stringify(o.message)));
//   ws.onmessage = (e) => collab.apply(JSON.parse(e.data));
//
// Unknown message types and unknown fields are ignored in silence: that is what lets a
// server grow new frames without every application having to be rewired.
//
// Every delegating member stays callable when a part is switched off and goes quiet
// instead of throwing, so a host can disable presence without unwiring its transport.
export class CollaborationPlugin {
  public onEvent: EventBase<CollaborationPlugin, { message: ICollabOut }> =
    new EventBase<CollaborationPlugin, { message: ICollabOut }>();

  public data: ValueSyncController;
  public presence: PresenceController;
  public bar: CollabBarModel;

  private statusValue: CollabStatus = "connecting";
  private disposed = false;
  private inertPeersChanged: EventBase<any, { peers: ReadonlyMap<string, IPresencePeer> }>;

  // Presence coalescing: a window opens on the first change and the state is read when
  // it CLOSES, so what goes out is always the current state, never the one that
  // happened to open the window.
  private presenceTimer: any;
  private presenceLastSentAt = 0;
  private presencePendingRetain = false;

  constructor(public survey: SurveyModel, private options: ICollaborationOptions = {}) {
    this.data = new ValueSyncController(survey, options);
    this.data.onMessage.add((_sender, o) => {
      this.onEvent.fire(this, { message: o.message });
    });

    if (options.presence !== false) {
      this.presence = new PresenceController(survey);
      this.presence.onStateChanged.add((_sender, o) => this.schedulePresence(o.retain));
    }

    if (options.bar !== false) {
      this.bar = new CollabBarModel(survey, {
        ...options,
        // Both halves are in hand here, so the roster is wired directly instead of
        // being looked up by name later - which is where the creator version could
        // silently end up with an empty strip when registration order changed.
        onParticipantClick: options.onParticipantClick ?? ((clientId) => this.goToParticipant(clientId)),
      });
      this.bar.setStatus(this.statusValue);
      if (!!this.presence) {
        this.presence.onPeersChanged.add((_sender, o) => this.bar.setParticipants(o.peers));
        this.bar.setParticipants(this.presence.peers);
      }
    }
  }

  public get status(): CollabStatus {
    return this.statusValue;
  }

  public get isApplying(): boolean {
    return this.data.isApplying;
  }

  // The whole current state in the shape `init.values` carries.
  public getSnapshot(): { [key: string]: any } {
    return this.data.getState();
  }

  public getState(retain: boolean): IPresenceState {
    return !!this.presence ? this.presence.getState(retain) : emptyPresenceState();
  }

  public get peers(): ReadonlyMap<string, IPresencePeer> {
    return !!this.presence ? this.presence.peers : NO_PEERS;
  }

  public get onPeersChanged(): EventBase<any, { peers: ReadonlyMap<string, IPresencePeer> }> {
    if (!!this.presence) return this.presence.onPeersChanged;
    if (!this.inertPeersChanged) {
      this.inertPeersChanged = new EventBase<any, { peers: ReadonlyMap<string, IPresencePeer> }>();
    }
    return this.inertPeersChanged;
  }

  public goToParticipant(clientId: string): void {
    this.presence?.goToParticipant(clientId);
  }

  public apply(message: ICollabIn): void {
    if (!message || typeof message !== "object") return;
    switch(message.type) {
      case "init":
        // Receiving init is proof of a live connection; no separate "connected" frame.
        this.setStatus("connected");
        this.data.applyState(message);
        // A bootstrap replaces the roster wholesale: anyone missing from it has gone,
        // and a stale entry would leave a ring on a question nobody is in.
        this.presence?.setPeers(message.peers ?? []);
        // Announce ourselves at once. Capture stays silent until something actually
        // changes, so without this nobody would learn we are here until we happened
        // to move - and we would be missing from every late joiner bootstrap.
        if (!!this.presence)this.schedulePresence(true);
        break;
      case "value":
        this.data.applyValue(message);
        break;
      case "peer":
        this.presence?.upsertPeer(message.peer as IPresencePeerEntry);
        break;
      case "peer-left":
        this.presence?.removePeer(message.clientId);
        break;
      case "status":
        this.setStatus(message.status);
        // A dropped connection must not leave frozen cursors and stale rings behind.
        if (message.status === "closed")this.presence?.clearPeers();
        break;
      default:
        // Unknown type: ignored on purpose (forward compatibility).
        break;
    }
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (this.presenceTimer !== undefined) clearTimeout(this.presenceTimer);
    this.bar?.dispose();
    this.presence?.dispose();
    this.data.dispose();
  }

  private setStatus(status: CollabStatus): void {
    this.statusValue = status;
    this.bar?.setStatus(status);
  }

  private schedulePresence(retain: boolean): void {
    // A retained change must not be swallowed by a window a cursor move opened.
    this.presencePendingRetain = this.presencePendingRetain || retain;
    if (this.presenceTimer !== undefined) return;
    const coalesce = this.options.presenceCoalesceMs ?? DEFAULT_PRESENCE_COALESCE_MS;
    const elapsed = Date.now() - this.presenceLastSentAt;
    if (coalesce <= 0 || elapsed >= coalesce) {
      this.flushPresence();
      return;
    }
    this.presenceTimer = setTimeout(() => this.flushPresence(), coalesce - elapsed);
  }

  private flushPresence(): void {
    this.presenceTimer = undefined;
    if (this.disposed || !this.presence) return;
    const retain = this.presencePendingRetain;
    this.presencePendingRetain = false;
    this.presenceLastSentAt = Date.now();
    this.onEvent.fire(this, {
      message: { type: "presence", state: this.presence.getState(retain), retain },
    });
  }
}
