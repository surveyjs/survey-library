import { EventBase, Helpers, SurveyModel } from "survey-core";
import { ICollabIn, ICollabOut } from "./collab-messages";
import { ValueSyncController } from "./data/value-sync";
import { decodeSurveyName, encodeValueKey } from "./data/value-record";
import { PresenceController } from "./presence/index";
import { IPresencePeer, IPresencePeerEntry } from "./presence/presence-envelope";
import { emptyPresenceState, IPresenceState } from "./presence/presence-state";
import { CollabBarModel, ICollabBarOptions } from "./bar/bar-model";
import { HistoryController, IHistoryOptions } from "./history/history-controller";
import { HistoryPanel } from "./history/history-panel";
import { hasSameContent } from "./history/history-entry";

export * from "./collab-messages";
export * from "./presence/index";
export { ValueSyncController } from "./data/value-sync";
export { COMMENT_KEY_SUFFIX, encodeValueKey, decodeValueKey } from "./data/value-record";
export { commitFocusedEditor, QUESTION_ROOT_SELECTOR } from "./data/editor-commit";
export { CollabBarModel, COLLAB_BAR_ELEMENT_ID } from "./bar/bar-model";
export type { ICollabBarOptions, CollabBarStatus } from "./bar/bar-model";
export { getCollabString, setCollabStrings, collaborationStrings } from "./collaboration-strings";
export { HistoryController, DEFAULT_HISTORY_LIMIT, DEFAULT_HISTORY_MERGE_MS } from "./history/history-controller";
export type { IHistoryOptions } from "./history/history-controller";
export { describeValue, historyAuthorLabel, MAX_HISTORY_TEXT } from "./history/history-entry";
export { HistoryPanel } from "./history/history-panel";
export type { IHistoryEntry } from "./history/history-entry";

export type CollabStatus = "connecting" | "connected" | "closed";

export interface ICollaborationOptions extends ICollabBarOptions, IHistoryOptions {
  // Outgoing presence is coalesced to at most one message per this many ms. The window
  // lives here rather than in the host because it is a property of how chatty presence
  // is, not of the transport - and because a host coalescing an event that already
  // carried a payload would end up shipping a state that went stale inside the window.
  presenceCoalesceMs?: number;
  presence?: boolean;
  bar?: boolean;
  // Who changed what, for the lifetime of this connection. Costs nothing on the wire:
  // the attribution rides on `from`, which the relay already stamps.
  history?: boolean;
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
  public history: HistoryController;
  public historyPanel: HistoryPanel;

  private statusValue: CollabStatus = "connecting";
  private disposed = false;
  // The author of the value currently being applied, so that the local changes it
  // cascades into are recorded as theirs rather than as ours.
  private applyingFrom: IPresencePeer | null = null;
  private inertPeersChanged: EventBase<any, { peers: ReadonlyMap<string, IPresencePeer> }>;
  private detachHistory: (() => void) | undefined;

  // Presence coalescing: a window opens on the first change and the state is read when
  // it CLOSES, so what goes out is always the current state, never the one that
  // happened to open the window.
  private presenceTimer: any;
  private presenceLastSentAt = 0;
  private presencePendingRetain = false;

  constructor(public survey: SurveyModel, private options: ICollaborationOptions = {}) {
    if (options.history !== false) {
      this.history = new HistoryController(survey, options);
      this.historyPanel = new HistoryPanel(survey, {
        onEntryClick: (entry) => this.goToQuestion(entry.questionName),
      });
      this.history.onChanged.add((_sender, o) => this.historyPanel.setEntries(o.entries));
      this.listenForHistory();
    }

    this.data = new ValueSyncController(survey);
    this.data.onMessage.add((_sender, o) => this.onEvent.fire(this, { message: o.message }));

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
        onHistoryToggle: options.onHistoryToggle ?? (() => this.toggleHistory()),
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

  // Opens or closes the changes panel and keeps the button showing which it is.
  public toggleHistory(): void {
    if (!this.historyPanel) return;
    this.historyPanel.setEntries(this.history.entries);
    // Toggled on its own line: inside `this.bar?.setHistoryOpen(...)` the optional
    // call would swallow the argument too, and a host with the strip switched off
    // would find that toggling the panel did nothing at all.
    const open = this.historyPanel.toggle();
    this.bar?.setHistoryOpen(open);
  }

  // Scrolls to a question without focusing it - focusing would steal the local caret
  // and broadcast OUR focus, which is the same reason goToParticipant does not.
  public goToQuestion(questionName: string): void {
    this.presence?.goToQuestion(questionName);
  }

  public apply(message: ICollabIn): void {
    if (!message || typeof message !== "object") return;
    switch(message.type) {
      case "init":
        // Receiving init is proof of a live connection; no separate "connected" frame.
        this.setStatus("connected");
        this.data.applyState(message);
        // init is authoritative and replaces the whole state, so anything recorded
        // before it describes a state that no longer exists.
        this.history?.clear();
        // A bootstrap replaces the roster wholesale: anyone missing from it has gone,
        // and a stale entry would leave a ring on a question nobody is in.
        this.presence?.setPeers(message.peers ?? []);
        // Announce ourselves at once. Capture stays silent until something actually
        // changes, so without this nobody would learn we are here until we happened
        // to move - and we would be missing from every late joiner bootstrap.
        if (!!this.presence)this.schedulePresence(true);
        break;
      case "value": {
        // Resolved before the apply, so a cascade recorded during it is credited to
        // the peer that caused it.
        this.applyingFrom = this.authorOf(message.from);
        try {
          this.data.applyValue(message);
        } finally {
          this.applyingFrom = null;
        }
        break;
      }
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
    this.detachHistory?.();
    this.history?.dispose();
    this.historyPanel?.dispose();
  }

  private setStatus(status: CollabStatus): void {
    this.statusValue = status;
    this.bar?.setStatus(status);
  }

  // The history records what changed in THIS survey, so it listens to the survey rather
  // than to the wire. A message that changes nothing here - a value already held, the
  // same value from a second peer - raises no onValueChanged, and neither does init,
  // which assigns survey.data wholesale.
  private listenForHistory(): void {
    const survey = this.survey;
    // The value each pending change started from: onValueChanged does not carry it.
    const before = new Map<string, any>();
    const onValueChanging = (_sender: SurveyModel, o: { name: string, oldValue: any, value: any }) => {
      // Only for a change that is coming: a set to the same value raises onValueChanging
      // and never onValueChanged, and would leave its old value parked here.
      if (!Helpers.isTwoValueEquals(o.oldValue, o.value, false, true, false)) before.set(o.name, o.oldValue);
    };
    const onValueChanged = (_sender: SurveyModel, o: { name: string, value: any }) => {
      const known = before.has(o.name);
      const oldValue = before.get(o.name);
      before.delete(o.name);
      // A row added or removed with nothing in it changes the value, not the answer. The
      // participant who added it raises no event at all - rowCount is not a value - so
      // the peers skip it too, and everyone's log agrees.
      if (known && hasSameContent(oldValue, o.value)) return;
      const decoded = decodeSurveyName(o.name, survey.commentSuffix);
      // A change raised WHILE a peer value is being applied is that value or its cascade
      // (clearInvisibleValues, a trigger), so it is credited to the peer. survey-core
      // raises the cascade first, which keeps the cause above it in a newest-first list.
      this.history.record(this.data.isApplying ? this.applyingFrom : null,
        encodeValueKey(decoded.name, decoded.isComment), o.value);
    };
    survey.onValueChanging.add(onValueChanging);
    survey.onValueChanged.add(onValueChanged);
    this.detachHistory = () => {
      survey.onValueChanging.remove(onValueChanging);
      survey.onValueChanged.remove(onValueChanged);
      before.clear();
    };
  }

  // The peer an incoming edit belongs to. Never null, because null is reserved for
  // our own edits: an author the roster cannot resolve - a relay that stamps no
  // `from`, a peer with presence switched off - becomes a nameless one on slot 0,
  // the theme's reserved "unknown user" grey.
  private authorOf(clientId: string | undefined): IPresencePeer {
    const peer = !!clientId ? this.presence?.peers.get(clientId) : undefined;
    return peer ?? { clientId: clientId ?? "", name: "", colorIndex: 0, state: null };
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
