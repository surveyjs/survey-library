import { describe, test, expect } from "vitest";
import { DynamicDataSourceChannel, IDynamicDataChannelHost } from "../../src/dynamic-data/dynamic-data-channel";
import { isLocalSource } from "../../src/dynamic-data/dynamic-data-sources";
import { IPendingInsert } from "../../src/dynamic-data/dynamic-data-pending-insert";
import {
  DynamicDataErrorOperation, DynamicDataSourceMethod, IDynamicDataReadRequest, IDynamicDataSource
} from "../../src/dynamic-data/dynamic-data-interfaces";

class Deferred {
  public promise: Promise<any>;
  public resolve: (value?: any) => void;
  public reject: (error?: any) => void;
  constructor() {
    this.promise = new Promise<any>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
// Lets the queued microtasks run; the channel uses no timers.
async function flush(times: number = 10): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
  }
}
// An exception that rejects a continuation nobody awaits surfaces as an unhandled rejection.
function catchUnhandled(): { errors: Array<any>, restore: () => void } {
  const listeners = process.listeners("unhandledRejection");
  process.removeAllListeners("unhandledRejection");
  const errors: Array<any> = [];
  const onRejection = (reason: any): void => { errors.push(reason); };
  process.on("unhandledRejection", onRejection);
  return {
    errors: errors,
    restore: (): void => {
      process.removeListener("unhandledRejection", onRejection);
      listeners.forEach((listener: any) => process.on("unhandledRejection", listener));
    }
  };
}
async function drainRejections(): Promise<void> {
  await flush();
  await new Promise<void>(resolve => setTimeout(resolve, 0));
  await flush();
}

// The list side, recorded: what the channel asks for and when.
class FakeHost implements IDynamicDataChannelHost {
  public disposed: boolean = false;
  public isPaged: boolean = false;
  public range: { skip: number, take: number } = { skip: 0, take: 0 };
  public log: Array<string> = [];
  public commits: Array<{ data: any, skip: number, take: number, isPagedRead: boolean }> = [];
  public errors: Array<string> = [];
  // The error listener: it may throw.
  public listener: (error: any, operation: DynamicDataErrorOperation) => void;
  constructor(public source: IDynamicDataSource) { }
  public getSource(): IDynamicDataSource { return this.source; }
  public isDisposed(): boolean { return this.disposed; }
  public getKeyField(): string { return !!this.source ? this.source.keyField : undefined; }
  public hasCapability(operation: DynamicDataSourceMethod): boolean { return !!this.source && typeof (<any>this.source)[operation] === "function"; }
  public isReadPagedBySource(): boolean { return this.isPaged; }
  public getReadRange(useWindowOffset: boolean): { skip: number, take: number } {
    this.log.push("range:" + useWindowOffset);
    return this.range;
  }
  public createReadRequest(skip: number, take: number): IDynamicDataReadRequest {
    return { skip: skip, take: take, filter: "", sort: [] };
  }
  public commitRead(data: any, skip: number, take: number, isPagedRead: boolean): boolean {
    this.commits.push({ data: data, skip: skip, take: take, isPagedRead: isPagedRead });
    this.log.push("commit");
    return true;
  }
  public onReadFailed(error: any): void { this.log.push("readFailed:" + error.message); }
  public setIsLoading(val: boolean): void { }
  public raiseError(error: any, operation: DynamicDataErrorOperation): void {
    this.errors.push(operation + ":" + error.message);
    if (!!this.listener)this.listener(error, operation);
  }
  public applyInsertAnswer(entry: IPendingInsert): void { this.log.push("insertAnswer:" + entry.key); }
  public syncWindowAfterSyncPush(): void { this.log.push("syncWindow"); }
  public isOwnStorage(source: IDynamicDataSource): boolean { return false; }
  public isLocalSource(source: IDynamicDataSource): boolean { return isLocalSource(source); }
  public onPushFailed(operation: DynamicDataSourceMethod, isAsyncLocalWrite: boolean): void { this.log.push("pushFailed:" + operation); }
  public getSurvey(): any { return undefined; }
  public onSettled(): void { this.log.push("settled"); }
  public onWritesStarted(): void { this.log.push("writesStarted"); }
  public count(entry: string): number { return this.log.filter(item => item === entry).length; }
}
// A keyed remote source whose every call answers when the test says so.
class FakeSource implements IDynamicDataSource {
  public keyField: string = "id";
  public calls: Array<{ op: string, deferred: Deferred }> = [];
  public read(request: IDynamicDataReadRequest): Promise<any> { return this.call("read"); }
  public insert(record: any, sourceIndex: number): Promise<any> { return this.call("insert"); }
  public update(key: any, record: any, changedFields: Array<string>): Promise<any> { return this.call("update:" + key); }
  public remove(key: any): Promise<any> { return this.call("remove:" + key); }
  public get ops(): Array<string> { return this.calls.map(call => call.op); }
  public answer(index: number, value?: any): void { this.calls[index].deferred.resolve(value); }
  public fail(index: number, error: any): void { this.calls[index].deferred.reject(error); }
  private call(op: string): Promise<any> {
    const deferred = new Deferred();
    this.calls.push({ op: op, deferred: deferred });
    return deferred.promise;
  }
}
function pushUpdate(channel: DynamicDataSourceChannel, key: any, pending?: IPendingInsert): void {
  channel.pushToSource("update", (source: IDynamicDataSource, runKey: any): any => source.update(runKey, { id: runKey }, ["name"]),
    { key: key, pendingInsert: pending });
}
function pushRemove(channel: DynamicDataSourceChannel, key: any, pending?: IPendingInsert): void {
  channel.pushToSource("remove", (source: IDynamicDataSource, runKey: any): any => source.remove(runKey), { key: key, pendingInsert: pending });
}
function pushInsert(channel: DynamicDataSourceChannel, record: any): void {
  channel.pushToSource("insert", (source: IDynamicDataSource): any => source.insert(record, 0), { insertedRecord: record });
}
function committedIds(host: FakeHost): Array<Array<any>> {
  return host.commits.map(commit => (Array.isArray(commit.data) ? commit.data : commit.data.records).map((record: any) => record.id));
}
function createPaged(take: number): { source: FakeSource, host: FakeHost, channel: DynamicDataSourceChannel } {
  const source = new FakeSource();
  const host = new FakeHost(source);
  host.isPaged = true;
  host.range = { skip: 0, take: take };
  return { source: source, host: host, channel: new DynamicDataSourceChannel(host) };
}

describe("DynamicDataSourceChannel: a read overtaken by a write", () => {
  test("positional: a remove sent while a read is in flight discards its answer, and the read is issued again after the remove", async () => {
    const { source, host, channel } = createPaged(2);
    const loaded = channel.startRead(false);
    pushRemove(channel, 1);
    expect(source.ops, "#1: the remove is sent at once").toEqual(["read", "remove:1"]);
    source.answer(0, { records: [{ id: 0 }, { id: 1 }], total: 3 });
    await flush();
    expect(host.commits.length, "#2: the answer describes a server without the remove").toBe(0);
    expect(source.ops, "#3: no read while the remove is pending").toEqual(["read", "remove:1"]);
    expect(channel.hasPendingRead, "#4").toBe(true);
    source.answer(1);
    await flush();
    expect(source.ops, "#5").toEqual(["read", "remove:1", "read"]);
    source.answer(2, { records: [{ id: 0 }, { id: 2 }], total: 2 });
    await loaded;
    expect(committedIds(host), "#6: the caller waited for the window that was committed").toEqual([[0, 2]]);
    expect(host.count("settled"), "#7").toBe(1);
  });
  test("positional: an update overtakes a read of the whole storage", async () => {
    const source = new FakeSource();
    const host = new FakeHost(source);
    const channel = new DynamicDataSourceChannel(host);
    channel.startRead(false);
    pushUpdate(channel, 7);
    source.answer(0, [{ id: 0 }]);
    await flush();
    expect(host.commits.length, "#1").toBe(0);
    source.answer(1);
    await flush();
    expect(source.ops, "#2").toEqual(["read", "update:7", "read"]);
  });
  test("by key: an update overtakes a paged read only when the answer carries the updated record", async () => {
    const carried = createPaged(2);
    carried.channel.startRead(false);
    pushUpdate(carried.channel, 1);
    carried.source.answer(0, { records: [{ id: 0 }, { id: 1 }], total: 4 });
    await flush();
    expect(carried.host.commits.length, "#1: the answer holds the value the respondent replaced").toBe(0);
    carried.source.answer(1);
    await flush();
    expect(carried.source.ops, "#2: read again after the update").toEqual(["read", "update:1", "read"]);

    const other = createPaged(2);
    other.channel.startRead(false);
    pushUpdate(other.channel, 3);
    other.source.answer(0, { records: [{ id: 0 }, { id: 1 }], total: 4 });
    await flush();
    expect(committedIds(other.host), "#3: committed while the update is still pending").toEqual([[0, 1]]);
    expect(other.channel.hasPendingWrites, "#4").toBe(true);
    expect(other.source.ops, "#5").toEqual(["read", "update:3"]);
  });
});

describe("DynamicDataSourceChannel: reads requested while writes are pending", () => {
  test("they coalesce into one read, issued when the chain drains; a load among them makes it a load", async () => {
    const source = new FakeSource();
    const host = new FakeHost(source);
    const channel = new DynamicDataSourceChannel(host);
    pushUpdate(channel, 1);
    const first = channel.startRead(true);
    const second = channel.startRead(false);
    const third = channel.startRead(true);
    expect(first === second && second === third, "#1: one promise").toBe(true);
    expect(source.ops, "#2: nothing is read yet").toEqual(["update:1"]);
    expect(channel.hasPendingRead, "#3").toBe(true);
    source.answer(0);
    await flush();
    expect(source.ops, "#4: one read").toEqual(["update:1", "read"]);
    expect(host.log.filter(item => item.indexOf("range:") === 0), "#5: useWindowOffset false").toEqual(["range:false"]);
    source.answer(1, [{ id: 0 }]);
    await first;
    expect(host.commits.length, "#6").toBe(1);
    expect(channel.hasPendingRead, "#7").toBe(false);
  });
  test("refreshes only: the read keeps the window offset", async () => {
    const source = new FakeSource();
    const host = new FakeHost(source);
    const channel = new DynamicDataSourceChannel(host);
    pushUpdate(channel, 1);
    channel.startRead(true);
    channel.startRead(true);
    source.answer(0);
    await flush();
    expect(host.log.filter(item => item.indexOf("range:") === 0)).toEqual(["range:true"]);
  });
});

describe("DynamicDataSourceChannel: a replaced source", () => {
  test("the old chain is detached, and the new source's first read waits for its tail", async () => {
    const oldSource = new FakeSource();
    const host = new FakeHost(oldSource);
    const channel = new DynamicDataSourceChannel(host);
    pushUpdate(channel, 1);
    pushUpdate(channel, 2);
    expect(channel.hasPendingWrites, "#1").toBe(true);
    channel.detach();
    expect(channel.hasPendingWrites, "#2: the old writes are not counted any more").toBe(false);
    const newSource = new FakeSource();
    host.source = newSource;
    const loaded = channel.startRead(false);
    expect(newSource.ops, "#3: the read waits for the old chain").toEqual([]);
    expect(channel.hasPendingRead, "#4").toBe(true);
    oldSource.fail(0, new Error("server"));
    await flush();
    expect(host.errors, "#5: the old chain still reports its failures").toEqual(["update:server"]);
    expect(oldSource.ops, "#6: and runs to its end against its own source").toEqual(["update:1", "update:2"]);
    expect(newSource.ops, "#7: not before the tail").toEqual([]);
    oldSource.answer(1);
    await flush();
    expect(newSource.ops, "#8").toEqual(["read"]);
    expect(host.count("settled"), "#9: the old chain does not report back into the list").toBe(0);
    newSource.answer(0, [{ id: 9 }]);
    await loaded;
    expect(committedIds(host), "#10").toEqual([[9]]);
    expect(host.count("settled"), "#11").toBe(1);
  });
  test("an insert answer of the detached chain does not reach the window", async () => {
    const oldSource = new FakeSource();
    const host = new FakeHost(oldSource);
    const channel = new DynamicDataSourceChannel(host);
    const record = { name: "new" };
    pushInsert(channel, record);
    const entry = channel.findPendingInsert(record);
    channel.detach();
    channel.clearPendingInserts();
    oldSource.answer(0, { id: 77, name: "new" });
    await flush();
    expect(entry.key, "#1: the entry learns the key: writes queued behind it still need it").toBe(77);
    expect(host.log.filter(item => item.indexOf("insertAnswer") === 0), "#2").toEqual([]);
  });
});

describe("DynamicDataSourceChannel: the pending inserts", () => {
  test("writes to a new record wait for its key and are sent with it", async () => {
    const source = new FakeSource();
    const host = new FakeHost(source);
    const channel = new DynamicDataSourceChannel(host);
    const record = { name: "new" };
    pushInsert(channel, record);
    const entry = channel.findPendingInsert(record);
    expect(!!entry, "#1").toBe(true);
    expect(entry.clientFields, "#2: the payload's fields are the client's").toEqual(["name"]);
    pushUpdate(channel, undefined, entry);
    pushRemove(channel, undefined, entry);
    expect(source.ops, "#3: they wait for the insert").toEqual(["insert"]);
    source.answer(0, { id: 77, name: "new" });
    await flush();
    expect(host.log.filter(item => item.indexOf("insertAnswer") === 0), "#4").toEqual(["insertAnswer:77"]);
    expect(channel.hasPendingInserts, "#5").toBe(false);
    expect(source.ops, "#6").toEqual(["insert", "update:77"]);
    source.answer(1);
    await flush();
    expect(source.ops, "#7").toEqual(["insert", "update:77", "remove:77"]);
    source.answer(2);
    await flush();
    expect(channel.hasPendingWrites, "#8").toBe(false);
    expect(host.errors, "#9").toEqual([]);
  });
  test("a repointed entry follows the record across the writes that replace it", () => {
    const source = new FakeSource();
    const channel = new DynamicDataSourceChannel(new FakeHost(source));
    const record = { name: "new" };
    pushInsert(channel, record);
    const edited = { name: "new", city: "Paris" };
    channel.repointPendingInsert(record, edited);
    expect(channel.findPendingInsert(record), "#1").toBeUndefined();
    const entry = channel.findPendingInsert(edited);
    expect(entry.clientFields, "#2: the changed field became the client's").toEqual(["name", "city"]);
  });
  test("a failed insert reports itself, and then every write that waited for its key", async () => {
    const source = new FakeSource();
    const host = new FakeHost(source);
    const channel = new DynamicDataSourceChannel(host);
    const record = { name: "new" };
    pushInsert(channel, record);
    const entry = channel.findPendingInsert(record);
    pushUpdate(channel, undefined, entry);
    pushRemove(channel, undefined, entry);
    source.fail(0, new Error("server"));
    await flush();
    expect(host.errors, "#1").toEqual([
      "insert:server",
      "update:DynamicDataList: the record has no key yet",
      "remove:DynamicDataList: the record has no key yet"
    ]);
    expect(source.ops, "#2: nothing is sent without the key").toEqual(["insert"]);
    expect(channel.hasPendingInserts, "#3").toBe(false);
    expect(channel.hasPendingWrites, "#4").toBe(false);
  });
  test("an insert that answers without the key: the waiting writes are reported the same way", async () => {
    const source = new FakeSource();
    const host = new FakeHost(source);
    const channel = new DynamicDataSourceChannel(host);
    const record = { name: "new" };
    pushInsert(channel, record);
    pushUpdate(channel, undefined, channel.findPendingInsert(record));
    source.answer(0, undefined);
    await flush();
    expect(host.errors, "#1").toEqual(["update:DynamicDataList: the record has no key yet"]);
    expect(host.log.filter(item => item.indexOf("insertAnswer") === 0), "#2").toEqual([]);
  });
});

describe("DynamicDataSourceChannel: an error listener that throws", () => {
  function createFailingUpdates(failures: Array<string>): IDynamicDataSource {
    let calls = 0;
    return {
      keyField: "id",
      read: (): Array<any> => [],
      update: (): any => { throw new Error(failures[calls++]); }
    } as IDynamicDataSource;
  }
  test("a synchronous push inside a write: the channel keeps the exception, and takeListenerError returns it once", () => {
    const host = new FakeHost(createFailingUpdates(["server"]));
    let listenerCalls = 0;
    host.listener = (): void => { throw new Error("listener" + (++listenerCalls)); };
    const channel = new DynamicDataSourceChannel(host);
    expect(() => pushUpdate(channel, 1), "#1: the write finishes").not.toThrow();
    expect(host.errors, "#2").toEqual(["update:server"]);
    expect(host.log, "#3: it finished as failed").toEqual(["pushFailed:update"]);
    const kept = channel.takeListenerError();
    expect(kept && kept.error.message, "#4").toBe("listener1");
    expect(channel.takeListenerError(), "#5: once").toBeUndefined();
  });
  test("two failing pushes of one write: the first exception is kept", () => {
    const host = new FakeHost(createFailingUpdates(["a", "b"]));
    let listenerCalls = 0;
    host.listener = (): void => { throw new Error("listener" + (++listenerCalls)); };
    const channel = new DynamicDataSourceChannel(host);
    pushUpdate(channel, 1);
    pushUpdate(channel, 2);
    expect(host.errors, "#1: both are reported").toEqual(["update:a", "update:b"]);
    expect(channel.takeListenerError().error.message, "#2").toBe("listener1");
    expect(channel.takeListenerError(), "#3").toBeUndefined();
  });
  test("a queued push: the exception rejects only its own continuation, and the chain goes on", async () => {
    const calls: Array<string> = [];
    const first = new Deferred();
    let updates = 0;
    const source: IDynamicDataSource = {
      keyField: "id",
      read: (): Array<any> => { calls.push("read"); return [{ id: 0 }]; },
      update: (key: any): any => {
        calls.push("update:" + key);
        updates++;
        if (updates === 1) return first.promise;
        if (updates === 2) throw new Error("server");
        return undefined;
      }
    } as IDynamicDataSource;
    const host = new FakeHost(source);
    host.listener = (): void => { throw new Error("listener"); };
    const channel = new DynamicDataSourceChannel(host);
    const unhandled = catchUnhandled();
    try {
      pushUpdate(channel, 0);
      pushUpdate(channel, 1);
      pushUpdate(channel, 2);
      const loaded = channel.startRead(false);
      expect(calls, "#1").toEqual(["update:0"]);
      first.resolve();
      await drainRejections();
      await loaded;
    } finally {
      unhandled.restore();
    }
    expect(calls, "#2: the later write and the read ran").toEqual(["update:0", "update:1", "update:2", "read"]);
    expect(unhandled.errors.map(e => e.message), "#3: the exception is not swallowed").toEqual(["listener"]);
    expect(channel.takeListenerError(), "#4: and not kept for a write").toBeUndefined();
    expect(channel.hasPendingWrites, "#5").toBe(false);
    expect(host.commits.length, "#6").toBe(1);
  });
  test("an asynchronous push that is rejected: the exception rejects only its own continuation, and the chain goes on", async () => {
    const source = new FakeSource();
    const host = new FakeHost(source);
    host.listener = (): void => { throw new Error("listener"); };
    const channel = new DynamicDataSourceChannel(host);
    const unhandled = catchUnhandled();
    let loaded: void | Promise<void>;
    try {
      pushUpdate(channel, 0);
      pushUpdate(channel, 1);
      loaded = channel.startRead(false);
      source.fail(0, new Error("server"));
      await drainRejections();
      expect(source.ops, "#1: the next write runs").toEqual(["update:0", "update:1"]);
      source.answer(1);
      await drainRejections();
    } finally {
      unhandled.restore();
    }
    expect(source.ops, "#2: and the read after it").toEqual(["update:0", "update:1", "read"]);
    expect(unhandled.errors.map(e => e.message), "#3").toEqual(["listener"]);
    expect(channel.takeListenerError(), "#4").toBeUndefined();
    source.answer(2, [{ id: 0 }]);
    await loaded;
    expect(host.commits.length, "#5").toBe(1);
  });
});
