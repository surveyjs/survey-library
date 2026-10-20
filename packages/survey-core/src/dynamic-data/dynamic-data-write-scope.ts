import { Scope } from "../utils/scope";
import { IDynamicDataListChange, IDynamicDataSource } from "./dynamic-data-interfaces";
import { isRecordValueChanged } from "./dynamic-data-records";
import { isLocalSource } from "./dynamic-data-sources";

// What the write transaction reads from DynamicDataList. Every member answers from the list's state
// when it is called; nothing is cached on this side.
export interface IDynamicDataWriteScopeHost {
  // The window the list holds - never the records a read-through list reads from its source.
  getWindowRecords(): Array<any>;
  getSource(): IDynamicDataSource;
  // The list holds the source the developer assigned (DynamicDataSourceBinding.isAssignedSourceInUse).
  isAssignedSourceInUse(): boolean;
  // The window holds every record of the source (DynamicDataReadState.isWindowWholeStorage).
  isWindowWholeStorage(): boolean;
  // An error listener's exception the channel kept for a push (DynamicDataSourceChannel.takeListenerError).
  takeListenerError(): { error: any };
  // The owner is told that the outermost write ended (IDynamicDataOwner.onWriteEnded); a disposed list tells nobody.
  onWriteEnded(): void;
  raiseChanged(change: IDynamicDataListChange): void;
}

/* The write transaction of DynamicDataList. The list runs every write of its own inside runOpenWrite
   and runWrite and raises its notification through notifyWrite; this class keeps what an outermost
   write keeps for its span - the window it started with, whether an assigned array was in sync with
   that window - and the reset the list owes its owner. */
export class DynamicDataWriteScope {
  /* Active while the list applies a write of its own. A write-through source assigns the owner's
     storage, and an owner that reports an assignment made meanwhile through invalidateViews() is
     ignored: the membership must not be re-evaluated by the very write that maintains it. */
  private writeScope: Scope = new Scope();
  private openWriteScope: Scope = new Scope();
  // The window when the outermost write started (runWrite).
  private windowAtWriteStartValue: Array<any>;
  private isAssignedArrayInSyncValue: boolean = false;
  /* A reset the list owes its owner for a window it replaced inside a write (takeStoredArray,
     restoreWindowToStorage). It is raised once the outermost write has notified: the owner
     follows that notification by record index, and a reset in front of it would have it renumber
     the objects it has just rebuilt. A committed read clears it: the reset of a read stands for the
     one a write still owed. */
  public isResetPending: boolean = false;

  constructor(private host: IDynamicDataWriteScopeHost) { }

  // True while the list applies a write of its own: the views it caches are its own to maintain then,
  // and an owner that is assigned inside the write may not read them (invalidateViews is ignored).
  public get isWriting(): boolean {
    return this.writeScope.isActive;
  }
  /* True from the start of an outermost write - batch, ensureCount, truncate, setValue, setRecord,
     add, remove, move, an insert answer - until its notifications have been raised, and until it
     unwinds when it throws. isWriting is narrower: a write notifies after its own scope, and a write
     whose push throws never notifies. The owner is told when it ends (onWriteEnded): a change it owes
     a write - an assignment made from outside while the write was open - is followed then. */
  public get isWriteOpen(): boolean {
    return this.openWriteScope.isActive;
  }
  public get windowAtWriteStart(): Array<any> {
    return this.windowAtWriteStartValue;
  }
  /* True for the span of the outermost write to an assigned local source whose array was,
     when the write started, the window record for record: nothing has replaced it outside the list
     since the list last read or wrote it. Only then does the window take the array the write stores
     (syncWindowAfterSyncPush). */
  public get isAssignedArrayInSync(): boolean {
    return this.isAssignedArrayInSyncValue;
  }
  /* An error listener's exception the channel kept for a push of this write is rethrown at its end:
     after the owner was told that the write ended, so that the window and the owner agree when the
     caller sees it. The channel keeps the first one only. */
  public runOpenWrite<T>(func: () => T): T {
    let listenerError: { error: any } = undefined;
    let res: T;
    try {
      res = this.openWriteScope.run(func);
    } finally {
      if (!this.openWriteScope.isActive) {
        listenerError = this.host.takeListenerError();
        this.host.onWriteEnded();
      }
    }
    if (!!listenerError) throw listenerError.error;
    return res;
  }
  /* Every write of the list runs here. The code inside runs user code - the owner's createRecord,
     the notifications of a nested write or a clamp, onError, a read-through source's setter and the
     survey handlers behind it - and a write scope that a throw left open would make isWriting true
     for good: invalidateViews would ignore every later assignment and the owners would take every
     assignment from outside for their own. The nesting and the timing of the notifications are
     unchanged: each method notifies after its own scope, so a write nested in ensureCount, truncate
     or batch still notifies with the outer scope open. */
  public runWrite<T>(func: () => T): T {
    // Before the write edits the window: see isAssignedArrayInSync. editWindow copies before it
    // edits, so the window captured here is never mutated.
    if (!this.writeScope.isActive) {
      this.isAssignedArrayInSyncValue = this.getIsAssignedArrayInSync();
      this.windowAtWriteStartValue = this.host.getWindowRecords();
    }
    try {
      return this.writeScope.run(func);
    } finally {
      if (!this.writeScope.isActive) {
        this.isAssignedArrayInSyncValue = false;
        this.windowAtWriteStartValue = undefined;
      }
    }
  }
  // Raised only outside every write scope: see isResetPending.
  public raisePendingReset(): void {
    if (!this.isResetPending || this.writeScope.isActive) return;
    this.isResetPending = false;
    this.host.raiseChanged({ type: "reset" });
  }
  // The notification of a write, raised after its scope.
  public notifyWrite(change: IDynamicDataListChange): void {
    this.host.raiseChanged(change);
    this.raisePendingReset();
  }
  private getIsAssignedArrayInSync(): boolean {
    const source = this.host.getSource();
    if (!this.host.isAssignedSourceInUse() || !this.host.isWindowWholeStorage() || !isLocalSource(source)) return false;
    const stored = source.read();
    const records = this.host.getWindowRecords();
    // The common case: the window IS the array, taken by the last read or the last write.
    if (stored === records) return true;
    // A source that hands out a copy on every read (SurveyDataDynamicDataSource) is compared by content.
    if (!Array.isArray(stored) || stored.length !== records.length) return false;
    for (let i = 0; i < records.length; i++) {
      if (stored[i] !== records[i] && isRecordValueChanged(stored[i], records[i])) return false;
    }
    return true;
  }
}
