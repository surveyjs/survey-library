import { describe, test, expect } from "vitest";
import { DynamicDataWriteScope, IDynamicDataWriteScopeHost } from "../../src/dynamic-data/dynamic-data-write-scope";
import { DynamicDataList } from "../../src/dynamic-data/dynamic-data-list";
import { ArrayDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { IDynamicDataListChange, IDynamicDataSource } from "../../src/dynamic-data/dynamic-data-interfaces";

interface IFakeHost extends IDynamicDataWriteScopeHost {
  window: Array<any>;
  source: IDynamicDataSource;
  isAssigned: boolean;
  isWhole: boolean;
  listenerErrors: Array<any>;
  log: Array<string>;
}
function createHost(): IFakeHost {
  const host: IFakeHost = {
    window: [],
    source: undefined,
    isAssigned: false,
    isWhole: true,
    listenerErrors: [],
    log: [],
    getWindowRecords: (): Array<any> => host.window,
    getSource: (): IDynamicDataSource => host.source,
    isAssignedSourceInUse: (): boolean => host.isAssigned,
    isWindowWholeStorage: (): boolean => host.isWhole,
    takeListenerError: (): { error: any } => {
      host.log.push("takeListenerError");
      return host.listenerErrors.length > 0 ? { error: host.listenerErrors.shift() } : undefined;
    },
    onWriteEnded: (): void => { host.log.push("onWriteEnded"); },
    raiseChanged: (change: IDynamicDataListChange): void => { host.log.push(change.type); }
  };
  return host;
}

describe("DynamicDataWriteScope: the scopes of a write", () => {
  test("isWriting and isWriteOpen: the scopes nest, and a throw closes them", () => {
    const scope = new DynamicDataWriteScope(createHost());
    const seen: Array<string> = [];
    const state = (): string => scope.isWriteOpen + "/" + scope.isWriting;
    scope.runOpenWrite(() => {
      seen.push(state());
      scope.runWrite(() => {
        seen.push(state());
        scope.runWrite(() => { seen.push(state()); });
        seen.push(state());
      });
      seen.push(state());
    });
    seen.push(state());
    expect(seen, "#1").toEqual(["true/false", "true/true", "true/true", "true/true", "true/false", "false/false"]);
    expect(() => scope.runOpenWrite(() => scope.runWrite(() => { throw new Error("user"); })), "#2").toThrow("user");
    expect(state(), "#3").toBe("false/false");
  });
  test("the owner is told once, when the outermost open write ends - also when it throws", () => {
    const host = createHost();
    const scope = new DynamicDataWriteScope(host);
    const res = scope.runOpenWrite(() => scope.runOpenWrite(() => 5));
    expect(res, "#1").toBe(5);
    expect(host.log, "#2").toEqual(["takeListenerError", "onWriteEnded"]);
    host.log = [];
    expect(() => scope.runOpenWrite(() => { throw new Error("user"); }), "#3").toThrow("user");
    expect(host.log, "#4").toEqual(["takeListenerError", "onWriteEnded"]);
  });
  test("the window at the start of the outermost write is kept for its span", () => {
    const host = createHost();
    const scope = new DynamicDataWriteScope(host);
    const start = [{ id: 0 }];
    host.window = start;
    const seen: Array<boolean> = [];
    scope.runWrite(() => {
      host.window = [{ id: 1 }];
      scope.runWrite(() => { seen.push(scope.windowAtWriteStart === start); });
      seen.push(scope.windowAtWriteStart === start);
    });
    expect(seen, "#1: a nested write does not capture it again").toEqual([true, true]);
    expect(scope.windowAtWriteStart, "#2").toBeUndefined();
    expect(() => scope.runWrite(() => { throw new Error("user"); }), "#3").toThrow("user");
    expect(scope.windowAtWriteStart, "#4: dropped when the write throws").toBeUndefined();
  });
});

describe("DynamicDataWriteScope: the reset the list owes", () => {
  test("a reset requested inside a write is raised once, after the outermost write", () => {
    const host = createHost();
    const scope = new DynamicDataWriteScope(host);
    scope.runWrite(() => {
      scope.runWrite(() => {
        scope.isResetPending = true;
        scope.raisePendingReset();
      });
      scope.raisePendingReset();
      expect(host.log, "#1: not inside a write").toEqual([]);
    });
    scope.raisePendingReset();
    expect(host.log, "#2").toEqual(["reset"]);
    expect(scope.isResetPending, "#3").toBe(false);
    scope.raisePendingReset();
    expect(host.log, "#4: once").toEqual(["reset"]);
  });
  test("notifyWrite: the write's own notification first, then the reset it owes", () => {
    const host = createHost();
    const scope = new DynamicDataWriteScope(host);
    scope.runWrite(() => { scope.isResetPending = true; });
    scope.notifyWrite({ type: "recordAdded", index: 0 });
    expect(host.log, "#1").toEqual(["recordAdded", "reset"]);
  });
  test("a nested write notifies with the outer scope open: the reset waits for the outer one", () => {
    const host = createHost();
    const scope = new DynamicDataWriteScope(host);
    scope.runWrite(() => {
      scope.runWrite(() => { scope.isResetPending = true; });
      scope.notifyWrite({ type: "recordRemoved", index: 0 });
    });
    expect(host.log, "#1").toEqual(["recordRemoved"]);
    scope.raisePendingReset();
    expect(host.log, "#2").toEqual(["recordRemoved", "reset"]);
  });
});

describe("DynamicDataWriteScope: an error listener's exception", () => {
  test("is rethrown after the outermost open write ends, once the owner was told", () => {
    const host = createHost();
    const scope = new DynamicDataWriteScope(host);
    host.listenerErrors.push(new Error("listener"));
    let isInnerDone = false;
    expect(() => scope.runOpenWrite(() => {
      scope.runOpenWrite(() => { isInnerDone = true; });
      return 1;
    }), "#1").toThrow("listener");
    expect(isInnerDone, "#2: the nested write does not take it").toBe(true);
    expect(host.log, "#3").toEqual(["takeListenerError", "onWriteEnded"]);
    expect(scope.isWriteOpen, "#4").toBe(false);
    expect(scope.runOpenWrite(() => 2), "#5: it is thrown once").toBe(2);
  });
  test("the write's own exception wins over it", () => {
    const host = createHost();
    const scope = new DynamicDataWriteScope(host);
    host.listenerErrors.push(new Error("listener"));
    expect(() => scope.runOpenWrite(() => { throw new Error("user"); }), "#1").toThrow("user");
    expect(host.listenerErrors, "#2: taken all the same").toEqual([]);
  });
});

describe("DynamicDataWriteScope: is the window in sync with an assigned array", () => {
  function createSyncHost(stored: Array<any>): IFakeHost {
    const host = createHost();
    host.source = ArrayDynamicDataSource.fromArray(stored);
    host.window = stored;
    host.isAssigned = true;
    return host;
  }
  function isInSync(host: IFakeHost): boolean {
    const scope = new DynamicDataWriteScope(host);
    let res: boolean = undefined;
    scope.runWrite(() => { res = scope.isAssignedArrayInSync; });
    expect(scope.isAssignedArrayInSync, "false outside a write").toBe(false);
    return res;
  }
  test("the window is the stored array, or equal to it record for record", () => {
    const stored = [{ id: 0 }, { id: 1 }];
    expect(isInSync(createSyncHost(stored)), "#1: the same array").toBe(true);
    const copy = createSyncHost(stored);
    copy.window = [{ id: 0 }, { id: 1 }];
    expect(isInSync(copy), "#2: a copy with the same records").toBe(true);
    const changed = createSyncHost(stored);
    changed.window = [{ id: 0 }, { id: 2 }];
    expect(isInSync(changed), "#3: a record differs").toBe(false);
    const shorter = createSyncHost(stored);
    shorter.window = [{ id: 0 }];
    expect(isInSync(shorter), "#4: another length").toBe(false);
  });
  test("only for an assigned local source whose window is the whole storage", () => {
    const stored = [{ id: 0 }];
    const notAssigned = createSyncHost(stored);
    notAssigned.isAssigned = false;
    expect(isInSync(notAssigned), "#1").toBe(false);
    const paged = createSyncHost(stored);
    paged.isWhole = false;
    expect(isInSync(paged), "#2").toBe(false);
    const remote = createSyncHost(stored);
    remote.source = { read: (): Array<any> => stored } as IDynamicDataSource;
    expect(isInSync(remote), "#3: not an in-memory source").toBe(false);
  });
  test("decided when the outermost write starts: a nested write does not decide it again", () => {
    const host = createSyncHost([{ id: 0 }]);
    const scope = new DynamicDataWriteScope(host);
    const seen: Array<boolean> = [];
    scope.runWrite(() => {
      host.window = [{ id: 9 }];
      scope.runWrite(() => { seen.push(scope.isAssignedArrayInSync); });
    });
    expect(seen).toEqual([true]);
  });
  test("through the list: true inside a batch on an assigned array the list holds, false after it, and false for an array replaced outside", () => {
    let arr: Array<any> = [{ id: 0 }, { id: 1 }];
    const assigned = new ArrayDynamicDataSource(() => arr, (a: Array<any>): void => { arr = a; });
    const list = new DynamicDataList(ArrayDynamicDataSource.fromArray([]));
    list.load();
    list.assignSource(assigned);
    const writes: DynamicDataWriteScope = list["writes"];
    let inside: boolean = undefined;
    list.batch(() => {
      inside = writes.isAssignedArrayInSync;
      list.setValue(0, "name", "a");
    });
    expect(inside, "#1: in sync before the batch").toBe(true);
    expect(writes.isAssignedArrayInSync, "#2: false after the batch").toBe(false);
    expect(list.getRecord(0), "#3: the window took the stored array").toBe(arr[0]);
    arr = [{ id: 5 }, { id: 6 }];
    list.batch(() => {
      inside = writes.isAssignedArrayInSync;
      list.setValue(0, "name", "b");
    });
    expect(inside, "#4: an array replaced outside the list").toBe(false);
    expect(list.getRecord(1), "#5: the window keeps its records, the rest arrives with the next read").toEqual({ id: 1 });
  });
});
