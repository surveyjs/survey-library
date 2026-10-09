import { Helpers } from "../helpers";
import { DynamicDataOperation, IDynamicDataReadRequest, IDynamicDataReadResult, IDynamicDataSource } from "./dynamic-data-interfaces";

/* The request channel of DynamicDataList: everything that orders the requests the list sends to its
   source - the reads, the push chain of the writes, the inserts that have not answered yet, and the
   epoch that detaches a replaced source.

   The invariant of the read scheduling: a read is issued only when no write is pending, and its
   result is committed only when no write that could change it was enqueued since it was issued. A
   write addresses the source as windowOffset + index, so a window read from a server that has not
   applied every write of the list shows records the respondent has removed (or values they have
   overwritten), and the next write made against that window lands on the wrong record. It is
   enforced in two places: in startRead, a read requested while writes are pending is not issued
   until the chain has drained (onPushSettled) - chaining it on the chain as it is now would let a
   later write overtake it - and in doRead, where the answer to a read that a write overtook while it
   was in flight is discarded and the read is issued again.
   Which writes overtake a read in flight (markInFlightReadOvertaken, isAnswerOvertaken): every
   insert, remove and move, and every write to a read with a take of 0 - every read of the whole
   storage, and a paged read of everything from skip. An update to a paged read with take > 0 - the
   source is keyed, since a source written without keyField is an in-memory array, which does not
   page - never overtakes it on its own: its key is recorded, and the answer is discarded only when
   it carries a record with one of those keys. An update that has no key yet - it is queued behind
   the insert of its record - records nothing: that insert has already overtaken the read.
   A literal "every write overtakes" would read pages again that no write has touched.
   That is why the reads and the writes live in one class: the rule is shared by both. */

/* The list side of the channel. The list implements it with its own private members, so that the
   channel adds nothing to the list's public surface. */
export interface IDynamicDataChannelHost {
  // The source the list holds now. A write captures it when it is enqueued, a read when it is issued.
  getSource(): IDynamicDataSource;
  isDisposed(): boolean;
  getKeyField(): string;
  // The source may be sent this write (DynamicDataList.hasCapability).
  hasCapability(operation: DynamicDataOperation): boolean;
  // The next read is a paged one: the source pages, and it runs every part of the view the list has.
  isReadPagedBySource(): boolean;
  // The range of the next read. skip and take are 0 for a read of the whole storage.
  getReadRange(useWindowOffset: boolean): { skip: number, take: number };
  /* The request the source is sent: the range and the view. It copies the owner's sort, and it
     throws when the list cannot run the filter over a whole storage it has to read, so it is built
     inside the read's error handling: a refused read takes the path of a source that throws. */
  createReadRequest(skip: number, take: number): IDynamicDataReadRequest;
  // The window commit. Returns whether the window was committed - an empty page past the end is not.
  // request: what the read asked for, the view the source ran included.
  commitRead(data: any, skip: number, take: number, isPagedRead: boolean, request: IDynamicDataReadRequest): boolean;
  // A read failed: the window in force stays, and so does the page it was read for.
  onReadFailed(error: any): void;
  setIsLoading(val: boolean): void;
  raiseError(error: any, operation: DynamicDataOperation): void;
  // The window half of an insert answer: the record in the window takes the key the source assigned.
  applyInsertAnswer(entry: IPendingInsert): void;
  // A synchronous write to an ArrayDynamicDataSource IS the storage: the window takes its array.
  syncWindowAfterSyncPush(): void;
  /* The write goes to the owner's own storage: its synchronous failure is the caller's exception and
     is not reported. A role, decided by the list, never by the class of the source. */
  isOwnStorage(source: IDynamicDataSource): boolean;
  // A push failed and was reported: the window keeps the local change, unless the list decides
  // otherwise for this operation.
  onPushFailed(operation: DynamicDataOperation): void;
  // No read and no push is pending any more (see notifySettled).
  onSettled(): void;
  // The first push the source has not answered was sent: hasPendingWrites has become true.
  onWritesStarted(): void;
}
/* What runPush answers: the promise of an asynchronous push, or how a synchronous one ended. Private
   to the channel. */
type PushResult = Promise<void> | "done" | "failed";

/* The one place an answer is read: a bare array is { records: array }, and an answer that is neither
   an array nor an object with records holds no records. total and hasMore are passed on as they
   are - whether they mean anything is the reader's to decide. */
export function toReadResult(data: any): IDynamicDataReadResult {
  if (Array.isArray(data)) return { records: data };
  const res = !!data && typeof data === "object" ? data : {};
  return { records: Array.isArray(res.records) ? res.records : [], total: res.total, hasMore: res.hasMore };
}
function isPromiseLike(value: any): boolean {
  // Never instanceof Promise: a source may return any thenable.
  return !!value && typeof value.then === "function";
}
/* Keyed source only: an insert that has not answered yet. record is the window object of the new
   record - what the answer is matched by, re-pointed by every write (see repointPendingInsert).
   clientFields are the fields the client owns: the ones the insert sent and every one a write
   changed since, deleted fields included. The answer's other fields are the ones the server filled
   in.
   The entry is also the record's identity until the key is known: a write made to the record while
   the insert is in flight is queued with the entry and reads key when it runs, which the chain
   orders after the insert has settled (applyInsertAnswer). keyField is the field of the source the
   insert was sent to - the list's own getter follows whatever source it holds by then. */
export interface IPendingInsert {
  record: any;
  clientFields: Array<string>;
  keyField: string;
  key: any;
  answer: any;
  isSettled: boolean;
}
/* What a write tells pushToSource about the record it addresses, beyond the call itself: the key it
   was enqueued with, for an insert the window object of the new record, which its answer is matched
   by, and for a write to a record whose insert is in flight the pending entry that stands for its
   key. */
export interface IDynamicDataPushInfo {
  key?: any;
  insertedRecord?: any;
  pendingInsert?: IPendingInsert;
}
function createNoKeyError(): Error {
  return new Error("DynamicDataList: the record has no key yet");
}
function createStalePositionError(): Error {
  return new Error("DynamicDataList: a write queued before a failed insert, remove or move was not sent: its storage index is stale");
}
/* The one comparison of the records: case-sensitive, strings not trimmed. It decides that a record
   changed (DynamicDataList.isValueChanged) and which of its fields did (getChangedFields), so a
   record never changes with no field listed. */
export function isRecordValueChanged(newValue: any, oldValue: any): boolean {
  return !Helpers.isTwoValueEquals(newValue, oldValue, false, true, false);
}
export function getChangedFields(oldRecord: any, newRecord: any): Array<string> {
  const res: Array<string> = [];
  const add = (key: string): void => {
    if (res.indexOf(key) < 0) res.push(key);
  };
  for (const key in oldRecord || {}) {
    if (isRecordValueChanged((newRecord || {})[key], (oldRecord || {})[key])) add(key);
  }
  for (const key in newRecord || {}) {
    if (isRecordValueChanged((newRecord || {})[key], (oldRecord || {})[key])) add(key);
  }
  return res;
}
/* The client owns the fields it sent or changed while the insert was in flight, the server owns
   the rest, and the key belongs to the server. So the answer contributes only the fields outside
   clientFields - a field the client cleared is missing from its record and must stay missing, not
   come back as the value the insert sent - and its key is applied last, over anything the client
   record holds in the key field: that is the one field the client never overrules. The window
   merge and the payload of an update queued behind the insert are both made here, so that they
   cannot drift apart. clientFields is the ownership the client record goes with: the window merge
   takes everything the client has owned so far (the entry's), a queued update the fields owned
   when it was made (getOwnedFields). Called only once the entry has the key (and the answer). */
export function mergeInsertAnswer(entry: IPendingInsert, clientRecord: any, clientFields: Array<string> = entry.clientFields): any {
  const res: any = {};
  const answer = entry.answer;
  Object.keys(answer).forEach((field: string): void => {
    if (clientFields.indexOf(field) < 0) res[field] = answer[field];
  });
  Object.assign(res, clientRecord);
  res[entry.keyField] = entry.key;
  return res;
}
/* The fields the client owns as of the write being made, taken right after it reached the window.
   A later write widens entry.clientFields, and must not change what an earlier queued update
   sends: that update's snapshot does not hold the later field, so the wider set would drop the
   server's value of it from the payload - blanking a server-filled field until the later update
   lands, and for good when that one fails. */
export function getOwnedFields(pending: IPendingInsert): Array<string> {
  return !!pending ? pending.clientFields.slice() : undefined;
}
/* The record an update sends. A write that resolved its key normally sends the record as it is.
   One queued behind the insert of its record sends it merged with the insert's answer: a
   whole-record update of the snapshot alone would blank the fields the server filled in, and it
   would carry no key. Called when the update runs, so the answer is known. */
export function getUpdatePayload(pending: IPendingInsert, record: any, ownedFields: Array<string>): any {
  return !!pending ? mergeInsertAnswer(pending, record, ownedFields) : record;
}

/* The asynchronous writes in flight, per source object and per channel: the tail of each channel's
   push chain while it has pending pushes. It orders reads after writes: a keyed source object shared
   by two questions is written by two channels, and each one's reads wait for the other's writes (see
   getForeignWrites). An in-memory source written by position has one writing list
   (changeSourceWriter), so only that list's channel writes it. Two different objects over one backend
   are not known to be one. */
const writesBySource = new WeakMap<object, Map<DynamicDataSourceChannel, Promise<void>>>();

export class DynamicDataSourceChannel {
  private readRequestId: number = 0;
  // The push chain: one write in flight at a time, the next starts when the previous settles. It
  // always fulfills - a rejected push is reported through onError and the chain continues.
  private pushChain: Promise<void> = undefined;
  private pendingPushes: number = 0;
  /* Keyed source only: one entry per insert that has not answered yet, holding the window object of
     the new record. The object is what the answer is matched by - a key the record does not have yet
     cannot be - and every write replaces that object, so the list re-points the entry
     (repointPendingInsert) instead of the entry holding the object add created, which one keystroke
     would already have discarded. */
  private pendingInserts: Array<IPendingInsert> = [];
  /* The asynchronous read in flight: the range it asked for, and whether a write enqueued since it
     was issued made its answer stale (see the header). */
  private inFlightRead: {
    skip: number, take: number, isPagedRead: boolean, isOvertaken: boolean,
    /* Keyed source only: the keys of the records updated while this read was in flight. There a
       position cannot decide it - another writer may move a record between the pages while the read
       runs - so the answer is checked for those records instead (see isAnswerOvertaken). */
    updatedKeys: Array<any>,
  } = undefined;
  /* A read requested while writes are pending waits for the chain to drain (see startRead). The
     requests coalesce into one: queuedReadUseOffset stays true only while every one of them was a
     refresh of the window - a load() recomputes the offset from pageIndex, which is what a page
     change asked for. */
  private queuedReadUseOffset: boolean = true;
  private queuedReadWaiter: { promise: Promise<void>, resolve: (value?: any) => void } = undefined;
  private get isReadQueued(): boolean {
    return !!this.queuedReadWaiter;
  }
  // Bumped by every source change. A push carries the epoch it was enqueued in, so that a chain left
  // running against a replaced source cannot report back into the list.
  private sourceEpoch: number = 0;
  /* Bumped by a failed insert, remove or move of a source without keyField. Such a source is written
     by storage index, and every write queued behind the failed one took its index from a window that
     had the failed change: it is dropped and reported instead of landing on the record next to its
     own (see onPushFailed). */
  private addressEpoch: number = 0;

  constructor(private host: IDynamicDataChannelHost) { }

  public get hasPendingWrites(): boolean {
    return this.pendingPushes > 0;
  }
  // True from the moment a read is requested until its window is committed or it is rejected,
  // including the time it waits for pending writes.
  public get hasPendingRead(): boolean {
    return this.isReadQueued || !!this.inFlightRead;
  }
  public get hasPendingInserts(): boolean {
    return this.pendingInserts.length > 0;
  }

  /* The source was replaced. The push chain is detached, not drained: the queued edits belong to the
     old source and keep running against it (they still report their failures through onError), but
     they do not report back into the list, and hasPendingWrites no longer counts them. The new
     source's first read does wait for them (detachedTail, see getForeignWrites): the two objects may
     front one storage, and a read issued before the old writes land would show records the
     respondent has removed or changed. A write of the old source that never settles therefore keeps
     the new source unread. */
  public detach(): void {
    /* The writes of the old source are still on their way to the storage the new source may read
       too (the same backend behind another object): its first read waits for the tail of the chain.
       It is awaited only - nothing of it is reported into the list. */
    if (!!this.pushChain) {
      const tail = !this.detachedTail ? this.pushChain : Promise.all([this.detachedTail, this.pushChain]).then((): void => undefined);
      this.detachedTail = tail;
      tail.then((): void => {
        if (this.detachedTail === tail)this.detachedTail = undefined;
      });
    }
    this.sourceEpoch++;
    this.pushChain = undefined;
    this.pendingPushes = 0;
    // A read queued behind the detached chain dies with it: the new source is read by the list.
    this.cancelReads();
  }
  // Drops a queued read and discards the result of a read that is still in flight.
  public cancelReads(): void {
    this.dropQueuedRead();
    this.readRequestId++;
    this.inFlightRead = undefined;
  }
  // The inserts of a source that was replaced: their answers belong to a window that is gone.
  public clearPendingInserts(): void {
    this.pendingInserts = [];
  }
  /* The fields of a record written into the window without being sent (DynamicDataList.runShowingRecords),
     keyed by the window object of the record: a read replaces the objects, and with them forgets the
     fields. The record's next update sends them along with its own: takeUnsentFields. */
  private unsentFields: WeakMap<any, Array<string>>;
  public takeUnsentFields(record: any, fields: Array<string>): Array<string> {
    const unsent = !!this.unsentFields && record !== undefined ? this.unsentFields.get(record) : undefined;
    if (!unsent) return fields;
    this.unsentFields.delete(record);
    return fields.concat(unsent.filter((field: string): boolean => fields.indexOf(field) < 0));
  }
  public keepUnsentFields(record: any, fields: Array<string>): void {
    if (!this.unsentFields)this.unsentFields = new WeakMap<any, Array<string>>();
    this.unsentFields.set(record, fields);
  }

  public startRead(useWindowOffset: boolean): void | Promise<void> {
    if (this.hasPendingWrites) return this.queueRead(useWindowOffset);
    const foreign = this.getForeignWrites();
    if (!!foreign) {
      const res = this.queueRead(useWindowOffset);
      this.startQueuedReadAfter(foreign);
      return res;
    }
    return this.doRead(useWindowOffset);
  }
  // The tail of a chain detached by a source change, kept until it settles.
  private detachedTail: Promise<void> = undefined;
  /* The writes a read has to wait for that hasPendingWrites does not count: the detached chain of the
     previous source, and the pending writes other channels make to the same source object. */
  private getForeignWrites(): Promise<void> {
    const waits: Array<Promise<void>> = [];
    if (!!this.detachedTail) waits.push(this.detachedTail);
    const source = this.host.getSource();
    const chains = !!source ? writesBySource.get(source) : undefined;
    if (!!chains) {
      chains.forEach((tail: Promise<void>, channel: DynamicDataSourceChannel): void => {
        if (channel !== this) waits.push(tail);
      });
    }
    if (waits.length === 0) return undefined;
    return waits.length === 1 ? waits[0] : Promise.all(waits).then((): void => undefined);
  }
  private startQueuedReadAfter(foreign: Promise<void>): void {
    const epoch = this.sourceEpoch;
    foreign.then((): void => {
      // A new source starts its own read; a pending write of this channel starts it when it settles.
      if (epoch !== this.sourceEpoch || this.host.isDisposed() || this.hasPendingWrites) return;
      this.startQueuedRead();
    });
  }
  // The tail of this channel's chain is the one other channels on the source wait for.
  private trackChain(source: IDynamicDataSource): void {
    let chains = writesBySource.get(source);
    if (!chains) {
      chains = new Map<DynamicDataSourceChannel, Promise<void>>();
      writesBySource.set(source, chains);
    }
    const tail = this.pushChain;
    chains.set(this, tail);
    tail.then((): void => {
      if (chains.get(this) === tail) chains.delete(this);
    });
  }
  private queueRead(useWindowOffset: boolean): Promise<void> {
    this.queuedReadUseOffset = this.isReadQueued ? this.queuedReadUseOffset && useWindowOffset : useWindowOffset;
    if (!this.queuedReadWaiter) {
      let resolve: (value?: any) => void;
      const promise = new Promise<void>((res: (value?: any) => void): void => { resolve = res; });
      this.queuedReadWaiter = { promise: promise, resolve: resolve };
    }
    return this.queuedReadWaiter.promise;
  }
  private startQueuedRead(): void {
    if (!this.isReadQueued) return;
    const foreign = this.getForeignWrites();
    if (!!foreign) {
      this.startQueuedReadAfter(foreign);
      return;
    }
    const useWindowOffset = this.queuedReadUseOffset;
    const waiter = this.queuedReadWaiter;
    this.queuedReadWaiter = undefined;
    let res: void | Promise<void>;
    try {
      res = this.doRead(useWindowOffset);
    } finally {
      // The callers awaiting load() and refresh() are released also when the commit's user code throws.
      if (!!waiter) waiter.resolve(res);
    }
  }
  private dropQueuedRead(): void {
    const waiter = this.queuedReadWaiter;
    this.queuedReadWaiter = undefined;
    if (!!waiter) waiter.resolve();
  }
  private doRead(useWindowOffset: boolean): void | Promise<void> {
    const host = this.host;
    const source = host.getSource();
    if (host.isDisposed() || !source) return;
    const requestId = ++this.readRequestId;
    const isPagedRead = host.isReadPagedBySource();
    const range = host.getReadRange(useWindowOffset);
    const skip = range.skip;
    const take = range.take;
    let res: any;
    let request: IDynamicDataReadRequest;
    try {
      request = host.createReadRequest(skip, take);
      res = source.read(request);
    } catch(e) {
      // This read superseded whatever was in flight, so it also owns the loading state it inherited.
      this.inFlightRead = undefined;
      try {
        host.onReadFailed(e);
      } finally {
        this.notifySettled();
      }
      return;
    }
    if (isPromiseLike(res)) {
      const inFlight = {
        skip: skip, take: take, isPagedRead: isPagedRead, isOvertaken: false, updatedKeys: <Array<any>>[]
      };
      this.inFlightRead = inFlight;
      host.setIsLoading(true);
      return res.then((data: any): any => {
        // A later read supersedes this one: its result is discarded when it arrives.
        if (host.isDisposed() || requestId !== this.readRequestId) return;
        this.inFlightRead = undefined;
        if (inFlight.isOvertaken || this.isAnswerOvertaken(inFlight, data)) {
          // A write overtook this read: the answer describes a server that did not have it yet. The
          // read is issued again - behind the chain while writes are pending - and it inherits the
          // loading state, as a superseding read does.
          return this.startRead(useWindowOffset);
        }
        /* A page past the end: the read of the page it stepped back to (the retry) takes this one's
           place, and it is returned, so that a caller awaiting load()/refresh() waits for the window
           that is committed and not for the answer that was discarded. It inherits the loading
           state, as a superseding read does. */
        try {
          if (!this.commitRead(data, skip, take, isPagedRead, request)) return this.startRead(false);
          host.setIsLoading(false);
        } finally {
          this.notifySettled();
        }
      }, (error: any): void => {
        if (host.isDisposed() || requestId !== this.readRequestId) return;
        this.inFlightRead = undefined;
        try {
          host.onReadFailed(error);
        } finally {
          this.notifySettled();
        }
      });
    }
    this.inFlightRead = undefined;
    try {
      if (!this.commitRead(res, skip, take, isPagedRead, request)) return this.startRead(false);
      // A synchronous answer (a source that reads from a cache) can supersede a pending asynchronous
      // read of the same source; the flag that read set is this one's to clear.
      host.setIsLoading(false);
    } finally {
      this.notifySettled();
    }
  }
  /* The commit announces the window to the owner, which runs user code (a rebuild runs expressions and
     survey events). An exception there reaches whoever awaits the read, and the read is over: it
     does not leave the list loading. */
  private commitRead(data: any, skip: number, take: number, isPagedRead: boolean, request: IDynamicDataReadRequest): boolean {
    try {
      return this.host.commitRead(data, skip, take, isPagedRead, request);
    } catch(e) {
      this.host.setIsLoading(false);
      throw e;
    }
  }

  /* The source is captured here, when the write is enqueued, and never read again from the host:
     a deferred push belongs to the source the edit was made against, not to whatever the list holds
     when the push finally runs. The capability check follows the same rule: a source that may not be
     sent the write gets nothing, and the edit stays in the window. */
  public pushToSource(operation: DynamicDataOperation, method: (source: IDynamicDataSource, key: any) => any,
    info?: IDynamicDataPushInfo): void {
    const host = this.host;
    const source = host.getSource();
    if (host.isDisposed() || !source || !host.hasCapability(operation)) return;
    const push = info || {};
    const pending = push.pendingInsert;
    /* A keyed source cannot be told about a record it has not named and never will: its insert
       answered without the key, or the source has no insert. The write is kept: it is in the window,
       so the respondent sees it, the error says why it was not delivered, and the next read
       reconciles. A record whose insert is still in flight is not such a record - see the action. */
    if (operation !== "insert" && !!host.getKeyField() && push.key === undefined && !pending) {
      host.raiseError(createNoKeyError(), operation);
      return;
    }
    this.markInFlightReadOvertaken(operation, push);
    const epoch = this.sourceEpoch;
    const addressEpoch = !host.getKeyField() ? this.addressEpoch : undefined;
    const entry = this.registerPendingInsert(operation, push);
    const onAnswer = !!entry ? (answer: any): void => this.applyInsertAnswer(entry, answer, epoch) : undefined;
    const onFailed = (): void => this.onPushFailed(epoch, operation);
    /* The key of a write queued behind the insert of its record is read when the write runs: the
       chain runs it after that insert has settled, so the answer has brought the key by then - or
       it never will (the insert failed or answered without it), and the write is reported for its
       own operation instead of being sent, which is the keep-and-report rule above, only later. */
    const action = (): any => {
      if (addressEpoch !== undefined && addressEpoch !== this.addressEpoch) throw createStalePositionError();
      if (!pending) return method(source, push.key);
      if (!pending.isSettled || pending.key === undefined) {
        host.raiseError(createNoKeyError(), operation);
        return undefined;
      }
      return method(source, pending.key);
    };
    /* The owner's own storage: a write to it fails only when the code behind its setter throws - a
       survey handler, a value-changed callback - and that exception is the caller's, not a failure
       of a source. It reaches the caller, as it does without a list. Every other source is reported,
       an in-memory one the developer assigned included. */
    const isOwnStorage = host.isOwnStorage(source);
    if (!this.pushChain) {
      const res = this.runPush(operation, action, onAnswer, onFailed, isOwnStorage, true);
      if (!isPromiseLike(res)) {
        this.settleSyncPush(epoch, res === "failed", onFailed);
        return;
      }
      this.pendingPushes = 1;
      this.pushChain = this.createFirstLink(<Promise<void>>res, epoch);
      this.trackChain(source);
      host.onWritesStarted();
      return;
    }
    this.pendingPushes++;
    const previous = this.pushChain;
    this.pushChain = new Promise<void>((resolve: () => void): void => {
      previous.then((): void => {
        let res: PushResult;
        try {
          res = this.runPush(operation, action, onAnswer, onFailed, isOwnStorage);
        } catch(e) {
          // A synchronous failure whose report threw: the chain goes on, and the exception is the
          // rejection of this continuation. The window keeps the local change.
          this.settleLink(epoch, false, resolve);
          throw e;
        }
        if (!isPromiseLike(res)) {
          // A failed link does not sync the window: it keeps the local change.
          const isFailed = res === "failed";
          if (isFailed)onFailed();
          this.settleLink(epoch, !isFailed, resolve);
        } else {
          (<Promise<void>>res).then((): void => { this.settleLink(epoch, false, resolve); });
        }
      });
    });
    this.trackChain(source);
  }
  /* The link after the first, asynchronous push. Every link of the chain fulfills, so that a later
     write always runs after an earlier one has settled - see runPush. */
  private createFirstLink(res: Promise<void>, epoch: number): Promise<void> {
    return new Promise<void>((resolve: () => void): void => {
      res.then((): void => { this.settleLink(epoch, false, resolve); });
    });
  }
  // onPushSettled may start the read the chain held, and its commit runs user code: the link settles whatever it does.
  private settleLink(epoch: number, wasSync: boolean, resolve: () => void): void {
    try {
      this.onPushSettled(epoch, wasSync);
    } finally {
      resolve();
    }
  }
  // The pending insert whose record is this window object; undefined unless an insert is in flight.
  public findPendingInsert(record: any): IPendingInsert {
    if (record === undefined) return undefined;
    for (let i = 0; i < this.pendingInserts.length; i++) {
      if (this.pendingInserts[i].record === record) return this.pendingInserts[i];
    }
    return undefined;
  }
  /* An insert that has not answered yet is matched by the window object of its record, and every
     write replaces that object: the entry follows the record across the replacements. Every write
     reaches the window through the list's replaceRecord, which calls this, so this is also where the
     fields it changed become the client's. */
  public repointPendingInsert(oldRecord: any, newRecord: any): void {
    if (oldRecord === undefined || oldRecord === newRecord) return;
    this.pendingInserts.forEach((entry: IPendingInsert): void => {
      if (entry.record !== oldRecord) return;
      entry.record = newRecord;
      getChangedFields(oldRecord, newRecord).forEach((field: string): void => {
        if (entry.clientFields.indexOf(field) < 0) entry.clientFields.push(field);
      });
    });
  }
  private registerPendingInsert(operation: DynamicDataOperation, push: IDynamicDataPushInfo): IPendingInsert {
    const keyField = this.host.getKeyField();
    if (operation !== "insert" || !keyField || push.insertedRecord === undefined) return undefined;
    // The payload the insert sends, without the key (see add): the fields the client owns from the start.
    const entry: IPendingInsert = {
      record: push.insertedRecord, clientFields: Object.keys(push.insertedRecord || {}),
      keyField: keyField, key: undefined, answer: undefined, isSettled: false
    };
    this.pendingInserts.push(entry);
    return entry;
  }
  /* The answer of an insert is the stored record: it carries the key the source assigned, and
     whatever else the source filled in. The merged record (mergeInsertAnswer) replaces the one in
     the window, so that every later write finds the key on it; the host does that part. The record is
     found through the pending entry and never by indexOf of the object add created: a write copies
     the record, and that lookup would miss it.
     The entry learns the key first, before the epoch check and the window: the writes queued behind
     the insert read it when they run, and they still have to run with it when the source was
     replaced meanwhile (the detached chain runs to its end against its own source) or the record
     was removed while the insert was in flight (its queued remove needs the key). */
  private applyInsertAnswer(entry: IPendingInsert, answer: any, epoch: number): void {
    entry.isSettled = true;
    const field = entry.keyField;
    if (!!answer && typeof answer === "object" && !Helpers.isValueEmpty(answer[field])) {
      entry.key = answer[field];
      entry.answer = answer;
    }
    const at = this.pendingInserts.indexOf(entry);
    if (at > -1)this.pendingInserts.splice(at, 1);
    if (this.host.isDisposed() || epoch !== this.sourceEpoch || entry.key === undefined) return;
    this.host.applyInsertAnswer(entry);
  }
  /* Does this write make the answer of the read in flight stale? An insert or a remove shifts the
     records and changes the total, and a move shifts the records between its two ends, so each of
     them does. An update changes one record in place: the answer of a paged read is stale only when
     it holds that record - an edit on page 1 while page 2 is loading leaves page 2 as it is. */
  private markInFlightReadOvertaken(operation: DynamicDataOperation, push: IDynamicDataPushInfo): void {
    const read = this.inFlightRead;
    if (!read || read.isOvertaken) return;
    if (operation === "update" && read.isPagedRead && read.take > 0) {
      /* The source is keyed (see the header): where the record is by now is not the position it was
         edited at - another writer may have moved it between the pages while the read was running -
         so the answer is checked for that record when it arrives. No key yet (a write behind a
         pending insert): that insert has already overtaken the read. */
      if (push.key !== undefined) read.updatedKeys.push(push.key);
      return;
    }
    read.isOvertaken = true;
  }
  /* The other half of the rule above: the answer of a read an update overtook is stale only when it
     carries one of the updated records, because it then describes the value the respondent has just
     replaced. An edit of a record the answer does not contain leaves it as it is, which is what the
     positional check decides by range. */
  private isAnswerOvertaken(read: { updatedKeys: Array<any> }, data: any): boolean {
    const field = this.host.getKeyField();
    if (!field || read.updatedKeys.length === 0) return false;
    return toReadResult(data).records.some((record: any): boolean => !!record && read.updatedKeys.indexOf(record[field]) > -1);
  }
  /* Returns a promise that always fulfills, or how a synchronous push ended: "done", or "failed"
     once the failure is reported. onAnswer
     is what the source answered - only an insert has an answer - and it runs for a failed push too,
     with undefined, so that the pending entry never outlives its push: it settles the entry before
     anything is reported. isOwnStorage: a synchronous failure is the caller's exception (see
     pushToSource) and is not reported as a source error.
     User code runs on the answer - the error listener, and the owner's follow-up of the insert answer.
     The chain does not wait for it to succeed: the promise returned settles in any case, and an
     exception of that code is the rejection of the answer's own continuation, as an exception of any
     asynchronous callback is - a rejection of the chain would stop every later write and read.
     onFailed runs after a reported failure, synchronous or asynchronous - for a synchronous one the
     caller runs it, once the result is known. */
  private runPush(operation: DynamicDataOperation, action: () => any,
    onAnswer: (answer: any) => void, onFailed: () => void, isOwnStorage: boolean, isInWrite: boolean = false): PushResult {
    let res: any;
    try {
      res = action();
    } catch(e) {
      if (!!onAnswer) onAnswer(undefined);
      if (isOwnStorage) throw e;
      this.reportSyncFailure(e, operation, isInWrite);
      return "failed";
    }
    if (!isPromiseLike(res)) {
      if (!!onAnswer) onAnswer(res);
      return "done";
    }
    // A rejected push keeps the local change and reports the error; the chain continues.
    return new Promise<void>((resolve: () => void): void => {
      res.then((answer: any): void => {
        try {
          if (!!onAnswer) onAnswer(answer);
        } finally {
          resolve();
        }
      }, (error: any): void => {
        try {
          if (!!onAnswer) onAnswer(undefined);
        } finally {
          resolve();
        }
        this.host.raiseError(error, operation);
        onFailed();
      });
    });
  }
  /* An error listener that throws for a push the list makes inside its write would unwind that write
     before the list told its owner: the window would hold the change and the owner would not. The
     write finishes as failed, and the list rethrows the exception when its outermost write has ended
     (takeListenerError). A queued push has no write around it: its listener's exception is the
     rejection of that link, as before. */
  private listenerError: { error: any } = undefined;
  private reportSyncFailure(error: any, operation: DynamicDataOperation, isInWrite: boolean): void {
    if (!isInWrite) {
      this.host.raiseError(error, operation);
      return;
    }
    try {
      this.host.raiseError(error, operation);
    } catch(e) {
      if (!this.listenerError)this.listenerError = { error: e };
    }
  }
  public takeListenerError(): { error: any } {
    const res = this.listenerError;
    this.listenerError = undefined;
    return res;
  }
  private onPushSettled(epoch: number, wasSync: boolean): void {
    // A chain detached by a source change runs to its end against its own source, but the counters
    // and the window it would touch belong to the source that replaced it.
    if (epoch !== this.sourceEpoch) return;
    this.pendingPushes--;
    if (this.pendingPushes <= 0) {
      this.pendingPushes = 0;
      this.pushChain = undefined;
      if (wasSync)this.syncWindowAfterSyncPush(epoch);
      this.startQueuedRead();
      this.notifySettled();
    }
  }
  /* The end of the work the source was asked for: the last pending push settled, or a read -
     synchronous or asynchronous - committed or failed (also when the commit or the error handler
     threw), and nothing else is pending. What waits for the source's answers (the owner's validation
     and completion) goes on from here. A pending read or write makes it a no-op, so it may be called
     more often than once per settle. */
  private notifySettled(): void {
    if (this.hasPendingWrites || this.hasPendingRead || this.host.isDisposed()) return;
    this.host.onSettled();
  }
  private syncWindowAfterSyncPush(epoch: number): void {
    if (this.host.isDisposed() || epoch !== this.sourceEpoch) return;
    this.host.syncWindowAfterSyncPush();
  }
  /* After a synchronous push: the window takes what the storage holds after a success, and keeps the
     local change after a reported failure (the list may still put it back, see onPushFailed). */
  private settleSyncPush(epoch: number, isFailed: boolean, onFailed: () => void): void {
    if (!isFailed) {
      this.syncWindowAfterSyncPush(epoch);
      return;
    }
    onFailed();
  }
  /* A push failed and was reported. A failed insert, remove or move of a source without keyField
     shifts the storage indexes the writes queued behind it were given: they are dropped
     (addressEpoch). The list decides what its window becomes. */
  private onPushFailed(epoch: number, operation: DynamicDataOperation): void {
    if (this.host.isDisposed() || epoch !== this.sourceEpoch) return;
    if (operation !== "update" && !this.host.getKeyField())this.addressEpoch++;
    this.host.onPushFailed(operation);
  }
}
