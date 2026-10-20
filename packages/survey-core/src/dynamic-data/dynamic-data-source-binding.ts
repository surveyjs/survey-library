import { DynamicDataSourceMethod, IDynamicDataSource } from "./dynamic-data-interfaces";
import { hasFixedMembership, isLocalSource } from "./dynamic-data-sources";

// What the binding reads from DynamicDataList and what it asks the list to do.
export interface IDynamicDataSourceBindingHost {
  // The source the list holds now.
  getSource(): IDynamicDataSource;
  // The list's low-level swap (DynamicDataList.source): it detaches the old source and reads the new one.
  setSource(source: IDynamicDataSource): void;
  /* Another list claimed an in-memory source this list wrote (IDynamicDataOwner.onSourceWriterChanged).
     One function for every claim, handed to the source as it is: the source holds it with its writer. */
  readonly onWriterChanged: () => void;
}

/* The roles of the sources of DynamicDataList: the owner's own storage (the default source), the
   source the developer assigned, and what the source in use may be sent (hasCapability).
   An in-memory source is written by one list: the source holds its writer, and the list itself is the
   claim (LocalDynamicDataSource.positionWriter). A source this list releases keeps the other lists
   that hold it read-only until it is assigned again. The members of the source are private, and the
   binding calls them by element access. */
export class DynamicDataSourceBinding {
  private createDefaultSource: () => IDynamicDataSource;
  // The source createDefaultSource built last: the owner's own storage.
  private defaultSource: IDynamicDataSource;
  private assignedSourceValue: IDynamicDataSource;

  // writer: the list - the object that claims an in-memory source.
  constructor(private writer: object, private host: IDynamicDataSourceBindingHost) { }

  // The owner's own storage (DynamicDataList.createReadThrough): source is what createSource built.
  public setDefaultSource(createSource: () => IDynamicDataSource, source: IDynamicDataSource): void {
    this.createDefaultSource = createSource;
    this.defaultSource = source;
  }
  /* The owner defines its records (isMembershipFixed): any other source would replace them. Refused
     before anything changes. */
  public checkSourceReplaceable(): void {
    if (this.isMembershipFixed) throw new Error("DynamicDataList: the owner defines the records, the source cannot be replaced.");
  }
  // The source the developer assigned (question.dataSource); undefined while the default one is used.
  public get assignedSource(): IDynamicDataSource {
    return this.assignedSourceValue;
  }
  // A source is remote because it was assigned, never because of its type or because it pages.
  public get isRemote(): boolean {
    return !!this.assignedSourceValue;
  }
  /* The owner's swap: undefined goes back to the default source. The flag is stored first, then
     onAssigning runs, then the source is swapped: the owner reads isRemote inside onAssigning and
     inside the notifications the swap raises. A list without a default source (a standalone one)
     keeps its source on a detach - there is nothing to go back to - and only the flag changes.
     An onAssigning that throws rolls the flag and the writer claims back. A list that wrote the new
     source before was told it lost it (claimPositionWriter), and the rollback cannot undo that. */
  public assignSource(source: IDynamicDataSource, onAssigning?: () => void): void {
    const newValue = source || undefined;
    // An in-memory source is written by its last assignment only, the same one again included (LocalDynamicDataSource.positionWriter).
    if (this.assignedSourceValue === newValue) {
      if (isLocalSource(newValue)) newValue["claimPositionWriter"](this.writer, this.host.onWriterChanged);
      return;
    }
    this.checkSourceReplaceable();
    const oldValue = this.assignedSourceValue;
    this.movePositionWriter(oldValue, newValue);
    this.assignedSourceValue = newValue;
    try {
      if (!!onAssigning) onAssigning();
    } catch(e) {
      this.movePositionWriter(newValue, oldValue);
      this.assignedSourceValue = oldValue;
      throw e;
    }
    if (!!newValue) {
      this.host.setSource(newValue);
    } else if (!!this.createDefaultSource) {
      this.defaultSource = this.createDefaultSource();
      this.host.setSource(this.defaultSource);
    }
  }
  private movePositionWriter(from: IDynamicDataSource, to: IDynamicDataSource): void {
    if (isLocalSource(from)) from["releasePositionWriter"](this.writer);
    if (isLocalSource(to)) to["claimPositionWriter"](this.writer, this.host.onWriterChanged);
  }
  /* A write to the owner's own storage - its default source, never the assigned one - fails only when
     the code behind the owner's setter throws, and that exception is the caller's. Every other
     source's failure is reported (onError). A role, not a class: a standalone list has no default
     source, so all of its sources report. The isLocalSource tests in the list (useReadThrough,
     restoreWindowToStorage, syncWindowAfterSyncPush), in hasCapability and in
     DynamicDataWriteScope.getIsAssignedArrayInSync ask another question - does the source answer
     synchronously and is it written by index - and stay. */
  public isOwnStorage(source: IDynamicDataSource): boolean {
    return !!source && source === this.defaultSource && source !== this.assignedSourceValue;
  }
  /* The owner defines which records exist and in what order; the list only reads and updates them.
     add, remove, move, ensureCount and truncate are refused before they touch any state - the hidden
     flags, the storage count, the membership, the views - so a refused call leaves no trace and
     raises nothing, and hasCapability answers false for the three operations. It follows from the
     owner's own default source - one without insert (hasFixedMembership) -, never from an assigned
     one, and a standalone list has none. */
  public get isMembershipFixed(): boolean {
    return !!this.defaultSource && hasFixedMembership(this.defaultSource);
  }
  // Not isRemote alone: assignSource sets the flag before it swaps, and until the swap the list
  // still holds the default source - the owner's storage - and reads through it.
  public get isAssignedSourceInUse(): boolean {
    return this.isRemote && this.host.getSource() === this.assignedSourceValue;
  }
  /* A capability is declared by the presence of the matching method: the operation names are the
     source method names. A write names its record by key; only a local source is written by
     position - the list is its only writer, it writes synchronously, and the remap layer renumbers
     what holds an index. Any other source without keyField is read-only, whatever methods it has: a
     position it resolves another way - it sorts or filters on its side, another writer changed it -
     would name another record. A move is not part of the source contract: only a local source with
     a move method that is not assigned, written by storage index, takes one. An assigned source -
     local ones included - and a standalone list's keyed source never do, whatever methods they have. */
  public hasCapability(operation: DynamicDataSourceMethod): boolean {
    if (this.isMembershipFixed && (operation === "insert" || operation === "remove" || operation === "move")) return false;
    const source: any = this.host.getSource();
    if (!source || typeof source[operation] !== "function") return false;
    const keyField = source.keyField;
    if (operation === "move") return !this.isRemote && isLocalSource(source) && !keyField && !source["isWrittenByAnotherWriter"](this.writer);
    return operation === "read" || !!keyField || isLocalSource(source) && !source["isWrittenByAnotherWriter"](this.writer);
  }
  // The list is disposed: the source it wrote is released, and the factory, whose closures hold the owner, is dropped.
  public dispose(): void {
    this.movePositionWriter(this.assignedSourceValue, undefined);
    this.createDefaultSource = undefined;
  }
}
