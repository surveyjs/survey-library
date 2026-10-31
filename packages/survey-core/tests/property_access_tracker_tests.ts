import { Base, PropertyAccessTracker, IPropertyArrayValueChangedEvent } from "../src/base";
import { describe, test, expect, afterEach } from "vitest";

class TrackerTestModel extends Base {
  constructor() {
    super();
    this.createNewArray("items");
  }
  public get prop1(): string { return this.getPropertyValue("prop1"); }
  public set prop1(val: string) { this.setPropertyValue("prop1", val); }
  public get prop2(): string { return this.getPropertyValue("prop2"); }
  public set prop2(val: string) { this.setPropertyValue("prop2", val); }
  public get items(): Array<any> { return this.getPropertyValue("items"); }
}

function createTracker() {
  const log: Array<{ model: Base, name: string }> = [];
  const tracker = new PropertyAccessTracker((model: Base, options: IPropertyArrayValueChangedEvent) => {
    log.push({ model, name: options.name });
  });
  return { tracker, log };
}

describe("PropertyAccessTracker", () => {
  afterEach(() => {
    Base.currentPropertyAccessListener = undefined as any;
  });

  test("startTracking/stopTracking set and restore Base.currentPropertyAccessListener", () => {
    const { tracker } = createTracker();
    expect(Base.currentPropertyAccessListener, "no listener initially").toBeUndefined();
    tracker.startTracking();
    expect(Base.currentPropertyAccessListener, "tracker is the current listener").toBe(tracker);
    tracker.stopTracking();
    expect(Base.currentPropertyAccessListener, "listener is restored").toBeUndefined();
  });

  test("Notify only about changes of properties accessed during tracking", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    model.prop1;
    tracker.stopTracking();
    tracker.subscribe();

    model.prop2 = "b";
    expect(log, "prop2 was not accessed").toHaveLength(0);
    model.prop1 = "a";
    expect(log).toHaveLength(1);
    expect(log[0].model).toBe(model);
    expect(log[0].name).toBe("prop1");
  });

  test("Properties accessed outside of tracking are not tracked", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    model.prop2;
    tracker.startTracking();
    model.prop1;
    tracker.stopTracking();
    model.prop2;
    tracker.subscribe();

    model.prop2 = "b";
    expect(log, "prop2 was accessed outside of tracking").toHaveLength(0);
  });

  test("Do not notify before subscribe and after unsubscribe", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    model.prop1;
    tracker.stopTracking();

    model.prop1 = "a";
    expect(log, "not subscribed yet").toHaveLength(0);

    tracker.subscribe();
    model.prop1 = "b";
    expect(log, "subscribed").toHaveLength(1);

    tracker.unsubscribe();
    model.prop1 = "c";
    expect(log, "unsubscribed").toHaveLength(1);
    expect(model.hasActiveUISubscribers, "callbacks are removed from the model").toBe(false);
  });

  test("Track properties of several models", () => {
    const model1 = new TrackerTestModel();
    const model2 = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    model1.prop1;
    model2.prop2;
    tracker.stopTracking();
    tracker.subscribe();

    model1.prop2 = "x";
    model2.prop1 = "x";
    expect(log, "untracked properties").toHaveLength(0);

    model1.prop1 = "a";
    model2.prop2 = "b";
    expect(log).toHaveLength(2);
    expect(log[0].model).toBe(model1);
    expect(log[0].name).toBe("prop1");
    expect(log[1].model).toBe(model2);
    expect(log[1].name).toBe("prop2");
  });

  test("Notify about array changes", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    model.items;
    tracker.stopTracking();
    tracker.subscribe();

    model.items.push(1);
    expect(log).toHaveLength(1);
    expect(log[0].name).toBe("items");
    model.items.splice(0, 1);
    expect(log).toHaveLength(2);
  });

  test("startTracking again resets tracked properties and unsubscribes", () => {
    const model1 = new TrackerTestModel();
    const model2 = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    model1.prop1;
    tracker.stopTracking();
    tracker.subscribe();

    tracker.startTracking();
    model2.prop2;
    tracker.stopTracking();
    expect(model1.hasActiveUISubscribers, "unsubscribed from model1").toBe(false);
    tracker.subscribe();

    model1.prop1 = "a";
    expect(log, "model1.prop1 is not tracked anymore").toHaveLength(0);
    model2.prop2 = "b";
    expect(log).toHaveLength(1);
    expect(log[0].model).toBe(model2);
  });

  test("Do not notify about changes made while any tracking is in progress", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    model.prop1;
    tracker.stopTracking();
    tracker.subscribe();

    const { tracker: other } = createTracker();
    other.startTracking();
    model.prop1 = "a";
    other.stopTracking();
    expect(log, "change during tracking is ignored").toHaveLength(0);

    model.prop1 = "b";
    expect(log).toHaveLength(1);
  });

  test("Nested tracking restores the outer tracker", () => {
    const model = new TrackerTestModel();
    const { tracker: outer, log: outerLog } = createTracker();
    const { tracker: inner, log: innerLog } = createTracker();

    outer.startTracking();
    model.prop1;
    inner.startTracking();
    expect(Base.currentPropertyAccessListener).toBe(inner);
    model.prop2;
    inner.stopTracking();
    expect(Base.currentPropertyAccessListener, "outer tracker is restored").toBe(outer);
    outer.stopTracking();
    expect(Base.currentPropertyAccessListener).toBeUndefined();

    outer.subscribe();
    inner.subscribe();

    model.prop1 = "a";
    expect(outerLog.map(e => e.name)).toEqual(["prop1"]);
    expect(innerLog, "prop1 was accessed before inner tracking started").toHaveLength(0);

    model.prop2 = "b";
    expect(outerLog.map(e => e.name), "prop2 was accessed by the inner tracker only").toEqual(["prop1"]);
    expect(innerLog.map(e => e.name)).toEqual(["prop2"]);
  });
});
