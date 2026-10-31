import { describe, test, expect } from "vitest";
import { DynamicDataSourceBinding, IDynamicDataSourceBindingHost } from "../../src/dynamic-data/dynamic-data-source-binding";
import { ArrayDynamicDataSource, RowsDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";
import { DynamicDataSourceMethod, IDynamicDataSource } from "../../src/dynamic-data/dynamic-data-interfaces";

const operations: Array<DynamicDataSourceMethod> = ["read", "insert", "update", "remove", "move"];

interface IFakeHost extends IDynamicDataSourceBindingHost {
  source: IDynamicDataSource;
  swaps: Array<IDynamicDataSource>;
  writerChanges: number;
}
function createHost(source: IDynamicDataSource): IFakeHost {
  const host: IFakeHost = {
    source: source,
    swaps: [],
    writerChanges: 0,
    getSource: (): IDynamicDataSource => host.source,
    setSource: (newSource: IDynamicDataSource): void => {
      host.swaps.push(newSource);
      host.source = newSource;
    },
    onWriterChanged: (): void => { host.writerChanges++; }
  };
  return host;
}
// A binding with the owner's own storage, as DynamicDataList.createReadThrough sets it up.
function createOwnerBinding(createSource: () => IDynamicDataSource = (): IDynamicDataSource => ArrayDynamicDataSource.fromArray([{ id: 0 }])):
  { binding: DynamicDataSourceBinding, host: IFakeHost, writer: object, own: IDynamicDataSource } {
  const own = createSource();
  const host = createHost(own);
  const writer = {};
  const binding = new DynamicDataSourceBinding(writer, host);
  binding.setDefaultSource(createSource, own);
  return { binding: binding, host: host, writer: writer, own: own };
}
// A source that is not in memory, with every write method; keyField undefined: one without a key.
function createRemoteSource(keyField: string): IDynamicDataSource {
  return {
    keyField: keyField,
    read: (): Array<any> => [],
    insert: (): any => undefined,
    update: (): any => undefined,
    remove: (): any => undefined,
    move: (): any => undefined
  } as IDynamicDataSource;
}
function getCapabilities(binding: DynamicDataSourceBinding): { [operation: string]: boolean } {
  const res: { [operation: string]: boolean } = {};
  operations.forEach((operation: DynamicDataSourceMethod): void => { res[operation] = binding.hasCapability(operation); });
  return res;
}

describe("DynamicDataSourceBinding: the capabilities of the source in use", () => {
  const rows: Array<{ kind: string, create: () => DynamicDataSourceBinding, expected: { [operation: string]: boolean } }> = [
    {
      kind: "own storage",
      create: () => createOwnerBinding().binding,
      expected: { read: true, insert: true, update: true, remove: true, move: true }
    },
    {
      kind: "own storage without insert (the owner defines the records)",
      create: () => createOwnerBinding(() => new RowsDynamicDataSource(() => [], () => undefined, () => undefined)).binding,
      expected: { read: true, insert: false, update: true, remove: false, move: false }
    },
    {
      kind: "assigned local",
      create: () => {
        const { binding } = createOwnerBinding();
        binding.assignSource(ArrayDynamicDataSource.fromArray([{ id: 0 }]));
        return binding;
      },
      expected: { read: true, insert: true, update: true, remove: true, move: false }
    },
    {
      kind: "assigned keyed remote",
      create: () => {
        const { binding } = createOwnerBinding();
        binding.assignSource(createRemoteSource("id"));
        return binding;
      },
      expected: { read: true, insert: true, update: true, remove: true, move: false }
    },
    {
      kind: "assigned remote without key",
      create: () => {
        const { binding } = createOwnerBinding();
        binding.assignSource(createRemoteSource(undefined));
        return binding;
      },
      expected: { read: true, insert: false, update: false, remove: false, move: false }
    },
    {
      kind: "a standalone list's keyed source",
      create: () => new DynamicDataSourceBinding({}, createHost(createRemoteSource("id"))),
      expected: { read: true, insert: true, update: true, remove: true, move: false }
    },
    {
      kind: "a standalone list's local source",
      create: () => new DynamicDataSourceBinding({}, createHost(ArrayDynamicDataSource.fromArray([{ id: 0 }]))),
      expected: { read: true, insert: true, update: true, remove: true, move: true }
    }
  ];
  rows.forEach((row) => {
    test(row.kind, () => {
      expect(getCapabilities(row.create())).toEqual(row.expected);
    });
  });
  test("a method the source does not have is never a capability, whatever its role", () => {
    const source = { keyField: "id", read: (): Array<any> => [], update: (): any => undefined } as IDynamicDataSource;
    const binding = new DynamicDataSourceBinding({}, createHost(source));
    expect(getCapabilities(binding)).toEqual({ read: true, insert: false, update: true, remove: false, move: false });
  });
  test("no source: no capability", () => {
    const binding = new DynamicDataSourceBinding({}, createHost(undefined));
    expect(getCapabilities(binding)).toEqual({ read: false, insert: false, update: false, remove: false, move: false });
  });
});

describe("DynamicDataSourceBinding: the roles of the sources", () => {
  test("isOwnStorage: the default source while it is not the assigned one; a standalone list has none", () => {
    const { binding, own } = createOwnerBinding();
    expect(binding.isOwnStorage(own), "#1").toBe(true);
    expect(binding.isOwnStorage(undefined), "#2").toBe(false);
    const assigned = createRemoteSource("id");
    binding.assignSource(assigned);
    expect(binding.isOwnStorage(assigned), "#3").toBe(false);
    expect(binding.isOwnStorage(own), "#4: the replaced default source keeps its role").toBe(true);
    const standalone = ArrayDynamicDataSource.fromArray([]);
    expect(new DynamicDataSourceBinding({}, createHost(standalone)).isOwnStorage(standalone), "#5").toBe(false);
  });
  test("assignSource: the flag first, then onAssigning, then the swap; undefined builds a fresh default source", () => {
    const { binding, host, own } = createOwnerBinding();
    const assigned = createRemoteSource("id");
    const seen: Array<string> = [];
    binding.assignSource(assigned, () => {
      seen.push("isRemote:" + binding.isRemote + ", inUse:" + binding.isAssignedSourceInUse + ", swapped:" + (host.source === assigned));
    });
    expect(seen, "#1: inside onAssigning the flag is set and the old source is still held").toEqual(["isRemote:true, inUse:false, swapped:false"]);
    expect(host.swaps, "#2").toEqual([assigned]);
    expect(binding.assignedSource === assigned, "#3").toBe(true);
    expect(binding.isAssignedSourceInUse, "#4").toBe(true);
    binding.assignSource(assigned);
    expect(host.swaps.length, "#5: the same source again swaps nothing").toBe(1);
    binding.assignSource(undefined);
    expect(binding.isRemote, "#6").toBe(false);
    expect(host.swaps.length, "#7").toBe(2);
    expect(host.source !== own && host.source !== assigned, "#8: a fresh default source").toBe(true);
    expect(binding.isOwnStorage(host.source), "#9: and it is the owner's storage").toBe(true);
  });
  test("a standalone list keeps its source on a detach: only the flag changes", () => {
    const own = ArrayDynamicDataSource.fromArray([]);
    const host = createHost(own);
    const binding = new DynamicDataSourceBinding({}, host);
    const assigned = createRemoteSource("id");
    binding.assignSource(assigned);
    binding.assignSource(null);
    expect(binding.isRemote, "#1").toBe(false);
    expect(host.swaps, "#2").toEqual([assigned]);
  });
  test("an owner without insert defines the records: the source cannot be replaced, and nothing changes", () => {
    const { binding, host } = createOwnerBinding(() => new RowsDynamicDataSource(() => [], () => undefined, () => undefined));
    expect(binding.isMembershipFixed, "#1").toBe(true);
    let isCalled = false;
    expect(() => binding.assignSource(createRemoteSource("id"), () => { isCalled = true; }), "#2").toThrow(/cannot be replaced/);
    expect(isCalled, "#3: onAssigning is not called").toBe(false);
    expect(binding.isRemote, "#4").toBe(false);
    expect(host.swaps, "#5").toEqual([]);
  });
  test("an assigned source never fixes the membership", () => {
    const { binding } = createOwnerBinding();
    binding.assignSource({ read: (): Array<any> => [] } as IDynamicDataSource);
    expect(binding.isMembershipFixed).toBe(false);
  });
});

describe("DynamicDataSourceBinding: the writer of an in-memory source", () => {
  test("the claim moves between two lists; a released source keeps the other list read-only until it is assigned again", () => {
    const first = createOwnerBinding();
    const second = createOwnerBinding();
    const shared = ArrayDynamicDataSource.fromArray([{ id: 0 }]);
    first.binding.assignSource(shared);
    expect(shared["positionWriter"] === first.writer, "#1: the list is the claim").toBe(true);
    expect(first.binding.hasCapability("update"), "#2").toBe(true);
    second.binding.assignSource(shared);
    expect(shared["positionWriter"] === second.writer, "#3").toBe(true);
    expect(shared["positionWriterChanged"] === second.host.onWriterChanged, "#4: the second list's own callback").toBe(true);
    expect(first.host.writerChanges, "#5: the first list is told").toBe(1);
    expect(getCapabilities(first.binding), "#6: the first list only reads").toEqual({ read: true, insert: false, update: false, remove: false, move: false });
    expect(second.binding.hasCapability("update"), "#7").toBe(true);
    second.binding.assignSource(undefined);
    expect(shared["positionWriter"], "#8: released").toBeUndefined();
    expect(first.binding.hasCapability("update"), "#9: still read-only").toBe(false);
    first.binding.assignSource(shared);
    expect(shared["positionWriter"] === first.writer, "#10: the same source again claims it").toBe(true);
    expect(first.binding.hasCapability("update"), "#11").toBe(true);
    expect(first.host.swaps.length, "#12: no swap for the same source").toBe(1);
  });
  test("a keyed in-memory source is shared: no writer, every list writes it", () => {
    const first = createOwnerBinding();
    const second = createOwnerBinding();
    const shared = ArrayDynamicDataSource.fromArray([{ id: 0 }]);
    (<any>shared).keyField = "id";
    first.binding.assignSource(shared);
    second.binding.assignSource(shared);
    expect(shared["positionWriter"], "#1").toBeUndefined();
    expect(first.host.writerChanges, "#2").toBe(0);
    expect(first.binding.hasCapability("update"), "#3").toBe(true);
    expect(second.binding.hasCapability("update"), "#4").toBe(true);
  });
  test("an onAssigning that throws rolls the flag and the writer claims back", () => {
    const { binding, host, writer } = createOwnerBinding();
    const old = ArrayDynamicDataSource.fromArray([{ id: 0 }]);
    binding.assignSource(old);
    const fresh = ArrayDynamicDataSource.fromArray([{ id: 1 }]);
    let assignedInside: IDynamicDataSource = undefined;
    let writerInside: object = undefined;
    expect(() => binding.assignSource(fresh, () => {
      assignedInside = binding.assignedSource;
      writerInside = fresh["positionWriter"];
      throw new Error("owner");
    }), "#1").toThrow("owner");
    expect(assignedInside === fresh, "#2: the flag was stored first").toBe(true);
    expect(writerInside === writer, "#3: and the new source claimed").toBe(true);
    expect(binding.assignedSource === old, "#4: the flag is rolled back").toBe(true);
    expect(old["positionWriter"] === writer, "#5: the old source is claimed again").toBe(true);
    expect(fresh["positionWriter"], "#6: the new one is released").toBeUndefined();
    expect(host.swaps, "#7: no swap").toEqual([old]);
    expect(binding.hasCapability("update"), "#8").toBe(true);
  });
  test("dispose releases the source and drops the default-source factory", () => {
    const { binding } = createOwnerBinding();
    const shared = ArrayDynamicDataSource.fromArray([{ id: 0 }]);
    binding.assignSource(shared);
    binding.dispose();
    expect(shared["positionWriter"], "#1").toBeUndefined();
    expect(shared["positionWriterChanged"], "#2").toBeUndefined();
    expect(binding["createDefaultSource"], "#3: its closures hold the owner").toBeUndefined();
  });
});
