import { EventBase, SurveyModel } from "survey-core";
import { IPresencePeer, IPresencePeerEntry } from "./presence-envelope";
import { PresenceCapture } from "./presence-capture";
import { PresenceOverlay } from "./presence-overlay";
import { PresenceRoster } from "./presence-roster";
import { SurveyPresenceScene } from "./survey-scene";
import { goToParticipant } from "./presence-navigate";
import { IPresenceState } from "./presence-state";

export * from "./presence-envelope";
export * from "./presence-scene";
export * from "./presence-state";
export { PresenceCapture } from "./presence-capture";
export { PresenceOverlay } from "./presence-overlay";
export { PresenceRoster } from "./presence-roster";
export { SurveyPresenceScene } from "./survey-scene";

// Tracks the local participant's presence and renders everyone else's.
//
// Like the value sync it owns no transport: outbound is `onStateChanged` (the host
// then asks for the state and ships it), inbound is the roster ingress. Identity is
// not part of the state - the relay stamps it onto each entry.
export class PresenceController {
  public capture: PresenceCapture;
  public overlay: PresenceOverlay;
  public scene: SurveyPresenceScene;
  public roster: PresenceRoster;

  private disposed = false;

  constructor(private survey: SurveyModel) {
    this.scene = new SurveyPresenceScene(survey);
    this.roster = new PresenceRoster();
    this.capture = new PresenceCapture(survey, this.scene);
    this.overlay = new PresenceOverlay(this.scene, () => this.roster.peers);
  }

  public get onStateChanged(): EventBase<PresenceCapture, { retain: boolean }> {
    return this.capture.onStateChanged;
  }

  public get onPeersChanged(): EventBase<PresenceRoster, { peers: ReadonlyMap<string, IPresencePeer> }> {
    return this.roster.onPeersChanged;
  }

  public getState(retain: boolean): IPresenceState {
    return this.capture.getState(retain);
  }

  public get peers(): ReadonlyMap<string, IPresencePeer> {
    return this.roster.peers;
  }

  public setPeers(entries: Array<IPresencePeerEntry>): void {
    this.roster.setPeers(entries);
    this.roster.peers.forEach((peer) => this.scene.peerUpdated(peer));
    this.overlay.render();
  }

  public upsertPeer(entry: IPresencePeerEntry): void {
    this.roster.upsertPeer(entry);
    const peer = this.roster.peers.get(entry.clientId);
    if (!!peer)this.scene.peerUpdated(peer);
    this.overlay.render();
  }

  public removePeer(clientId: string): void {
    this.roster.removePeer(clientId);
    this.scene.peerRemoved(clientId);
    this.overlay.render();
  }

  public clearPeers(): void {
    this.roster.peers.forEach((peer) => this.scene.peerRemoved(peer.clientId));
    this.roster.clear();
    this.overlay.render();
  }

  public goToParticipant(clientId: string): void {
    goToParticipant(this.survey, this.scene, this.roster.peers.get(clientId));
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.capture.dispose();
    this.overlay.dispose();
    this.scene.dispose();
  }
}
