import { EventBase } from "survey-core";
import { IPresencePeer, IPresencePeerEntry, presenceColorSlot } from "./presence-envelope";

// The roster of remote participants.
//
// Generic on purpose - identical for editing and for filling - so survey-creator
// can use this instead of keeping its own copy. It holds no DOM and no transport:
// the host feeds it whatever the relay relayed, and it reports changes.
export class PresenceRoster {
  public onPeersChanged: EventBase<PresenceRoster, { peers: ReadonlyMap<string, IPresencePeer> }> =
    new EventBase<PresenceRoster, { peers: ReadonlyMap<string, IPresencePeer> }>();

  private peersMap = new Map<string, IPresencePeer>();

  public get peers(): ReadonlyMap<string, IPresencePeer> {
    return this.peersMap;
  }

  // Replace the whole roster (a bootstrap). Self must already be filtered out.
  public setPeers(entries: Array<IPresencePeerEntry>): void {
    this.peersMap.clear();
    (entries || []).forEach((entry) => this.addPeer(entry));
    this.changed();
  }

  public upsertPeer(entry: IPresencePeerEntry): void {
    if (!this.addPeer(entry)) return;
    this.changed();
  }

  public removePeer(clientId: string): void {
    if (!this.peersMap.delete(clientId)) return;
    this.changed();
  }

  // Called when the connection drops: a roster that outlived its socket would
  // leave frozen cursors and stale rings on screen.
  public clear(): void {
    if (this.peersMap.size === 0) return;
    this.peersMap.clear();
    this.changed();
  }

  // Fires even when nothing is in the map, so a host can react to a reset.
  private changed(): void {
    this.onPeersChanged.fire(this, { peers: this.peersMap });
  }

  private addPeer(entry: IPresencePeerEntry): boolean {
    if (!entry || !entry.clientId || entry.state === undefined || entry.state === null) return false;
    this.peersMap.set(entry.clientId, {
      clientId: entry.clientId,
      name: entry.name ?? "",
      // Resolved once, here, so that every place that paints this participant reads
      // one number instead of repeating the fallback and drifting apart.
      colorIndex: entry.colorIndex ?? presenceColorSlot(entry.clientId),
      state: entry.state,
    });
    return true;
  }
}
