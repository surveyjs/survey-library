import { Base, PropertyAccessTracker, IPropertyArrayValueChangedEvent } from "../src/base";
import { SurveyModel } from "../src/survey";
import { QuestionRowModel } from "../src/panel";
import "../src/question_text";
import { describe, test, expect, afterEach, vi } from "vitest";

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
  public calcFuncCallCount = 0;
  public get calcProp(): string {
    return this.getPropertyValue("calcProp", undefined, () => {
      this.calcFuncCallCount++;
      return this.prop1 + "-" + this.prop2;
    });
  }
  public set calcProp(val: string) { this.setPropertyValue("calcProp", val); }
  public get throwingCalcProp(): string {
    return this.getPropertyValue("throwingCalcProp", undefined, () => {
      this.prop1;
      throw new Error("calcFunc error");
    });
  }
  public static runUntrackedForTest<T>(func: () => T): T {
    return Base.runUntracked(func);
  }
}

function createTracker() {
  const log: Array<{ model: Base, name: string }> = [];
  const tracker = new PropertyAccessTracker((model: Base, options: IPropertyArrayValueChangedEvent) => {
    log.push({ model, name: options.name });
  });
  return { tracker, log };
}
function render(tracker: PropertyAccessTracker, read: () => void): void {
  tracker.startTracking();
  try {
    read();
  } finally {
    tracker.stopTracking();
  }
}
// Both UI callback sets: a model holds the tracker's callback in each while it is subscribed.
function hasCallback(model: Base, tracker: PropertyAccessTracker): boolean {
  const callback = (tracker as any).onPropertyChanged;
  const valueCallbacks: Set<any> = (model as any).onPropertyValueCoreChanged;
  const arrayCallbacks: Set<any> = (model as any).onArrayChanged;
  return !!valueCallbacks?.has(callback) || !!arrayCallbacks?.has(callback);
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

  test("A commit swaps in what the last render read: a model it no longer reads is unsubscribed", () => {
    const model1 = new TrackerTestModel();
    const model2 = new TrackerTestModel();
    const { tracker, log } = createTracker();
    render(tracker, () => model1.prop1);
    tracker.subscribe();

    render(tracker, () => model2.prop2);
    expect(hasCallback(model1, tracker), "model1 stays subscribed until the commit").toBe(true);
    expect(hasCallback(model2, tracker), "model2 is not subscribed before the commit").toBe(false);
    tracker.subscribe();
    expect(hasCallback(model1, tracker), "model1 is unsubscribed at the commit").toBe(false);
    expect(hasCallback(model2, tracker), "model2 is subscribed at the commit").toBe(true);

    model1.prop1 = "a";
    expect(log, "model1.prop1 is not tracked anymore").toHaveLength(0);
    model2.prop2 = "b";
    expect(log).toHaveLength(1);
    expect(log[0].model).toBe(model2);
  });

  test("A re-render that reads one property fewer stops notifying about it, and one that reads one more starts", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    render(tracker, () => { model.prop1; model.prop2; });
    tracker.subscribe();

    render(tracker, () => model.prop1);
    tracker.subscribe();
    model.prop2 = "a";
    expect(log, "prop2 is not read anymore").toHaveLength(0);
    model.prop1 = "b";
    expect(log.map(e => e.name)).toEqual(["prop1"]);

    render(tracker, () => { model.prop1; model.items; });
    tracker.subscribe();
    model.items.push(1);
    expect(log.map(e => e.name), "items is read now").toEqual(["prop1", "items"]);
  });

  test("A render without a commit keeps the previous subscriptions working", () => {
    const model1 = new TrackerTestModel();
    const model2 = new TrackerTestModel();
    const { tracker, log } = createTracker();
    render(tracker, () => model1.prop1);
    tracker.subscribe();

    // React throws this render away and never commits it
    render(tracker, () => model2.prop2);
    model1.prop1 = "a";
    expect(log.map(e => e.name), "the committed render is still notified").toEqual(["prop1"]);
    expect(hasCallback(model2, tracker), "the thrown-away render subscribed to nothing").toBe(false);

    // The next render is committed
    render(tracker, () => model1.prop2);
    tracker.subscribe();
    model1.prop1 = "b";
    model1.prop2 = "c";
    expect(log.map(e => e.name), "the committed render replaced the previous one").toEqual(["prop1", "prop2"]);
  });

  test("A change between a render and its commit notifies about a property only that render read", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    render(tracker, () => model.prop1);
    tracker.subscribe();

    render(tracker, () => { model.prop1; model.prop2; });
    model.prop2 = "a";
    expect(log.map(e => e.name), "the render shows the old prop2").toEqual(["prop2"]);
    tracker.subscribe();
    model.prop2 = "b";
    expect(log.map(e => e.name)).toEqual(["prop2", "prop2"]);
  });

  test("A second subscribe() without a render in between keeps the subscriptions", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    render(tracker, () => model.prop1);
    tracker.subscribe();
    tracker.subscribe();
    expect(hasCallback(model, tracker), "the model is subscribed").toBe(true);

    model.prop1 = "a";
    expect(log, "notified once").toHaveLength(1);
  });

  test("subscribe() after unsubscribe() without a render subscribes again, as a StrictMode remount does", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    render(tracker, () => model.prop1);
    tracker.subscribe();

    tracker.unsubscribe();
    tracker.subscribe();
    expect(hasCallback(model, tracker), "the model is subscribed again").toBe(true);
    model.prop1 = "a";
    expect(log.map(e => e.name)).toEqual(["prop1"]);
  });

  test("After unsubscribe(), no model holds a callback of the tracker", () => {
    const model1 = new TrackerTestModel();
    const model2 = new TrackerTestModel();
    const { tracker, log } = createTracker();
    render(tracker, () => { model1.prop1; model1.items; });
    tracker.subscribe();
    render(tracker, () => model2.prop1);

    tracker.unsubscribe();
    expect(hasCallback(model1, tracker), "the committed model").toBe(false);
    expect(hasCallback(model2, tracker), "the model of the render that was not committed").toBe(false);
    model1.prop1 = "a";
    model1.items.push(1);
    model2.prop1 = "b";
    expect(log, "nothing is notified").toHaveLength(0);

    tracker.subscribe();
    expect(hasCallback(model2, tracker), "unsubscribe() dropped the render that was not committed").toBe(false);
    expect(hasCallback(model1, tracker), "a mount without a render subscribes to the committed model").toBe(true);
    tracker.unsubscribe();
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

  test("blockTracking/releaseTracking stop and resume collecting accessed properties", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    model.prop1;
    tracker.blockTracking();
    expect(tracker.isTrackingBlocked(), "tracking is blocked").toBe(true);
    model.prop2;
    tracker.releaseTracking();
    expect(tracker.isTrackingBlocked(), "tracking is released").toBe(false);
    model.items;
    tracker.stopTracking();
    tracker.subscribe();

    model.prop2 = "b";
    expect(log, "prop2 was accessed while tracking was blocked").toHaveLength(0);
    model.prop1 = "a";
    model.items.push(1);
    expect(log.map(e => e.name)).toEqual(["prop1", "items"]);
  });

  test("blockTracking is reentrant: tracking resumes after the last releaseTracking", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    tracker.blockTracking();
    tracker.blockTracking();
    tracker.releaseTracking();
    expect(tracker.isTrackingBlocked(), "still blocked after the first release").toBe(true);
    model.prop1;
    tracker.releaseTracking();
    expect(tracker.isTrackingBlocked(), "released after the second release").toBe(false);
    model.prop2;
    tracker.stopTracking();
    tracker.subscribe();

    model.prop1 = "a";
    expect(log, "prop1 was accessed while tracking was blocked").toHaveLength(0);
    model.prop2 = "b";
    expect(log.map(e => e.name)).toEqual(["prop2"]);
  });

  test("getPropertyValue does not track properties accessed inside calcFunc", () => {
    const model = new TrackerTestModel();
    model.prop1 = "a";
    model.prop2 = "b";
    const { tracker, log } = createTracker();
    tracker.startTracking();
    expect(model.calcProp).toBe("a-b");
    expect(model.calcFuncCallCount, "calcFunc is called").toBe(1);
    expect(tracker.isTrackingBlocked(), "tracking is released after getPropertyValue").toBe(false);
    tracker.stopTracking();
    tracker.subscribe();

    model.prop1 = "c";
    model.prop2 = "d";
    expect(log, "properties accessed in calcFunc are not tracked").toHaveLength(0);
    model.calcProp = "e";
    expect(log.map(e => e.name), "the property itself is tracked").toEqual(["calcProp"]);
  });

  test("getPropertyValue tracks properties accessed after calcFunc", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    model.calcProp;
    model.prop1;
    tracker.stopTracking();
    tracker.subscribe();

    model.prop1 = "a";
    expect(log.map(e => e.name), "prop1 is accessed after calcFunc and is tracked").toEqual(["prop1"]);
  });

  test("getPropertyValue releases tracking if calcFunc throws", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    expect(() => model.throwingCalcProp).toThrow("calcFunc error");
    expect(tracker.isTrackingBlocked(), "tracking is released after an exception").toBe(false);
    model.prop2;
    tracker.stopTracking();
    tracker.subscribe();

    model.prop1 = "a";
    expect(log, "prop1 was accessed inside calcFunc").toHaveLength(0);
    model.prop2 = "b";
    expect(log.map(e => e.name)).toEqual(["prop2"]);
  });

  test("getPropertyValue releases the listener that was blocked even if calcFunc changes the current listener", () => {
    const model = new TrackerTestModel();
    const { tracker: outer } = createTracker();
    const { tracker: inner } = createTracker();
    outer.startTracking();
    model.getPropertyValue("nestedProp", undefined, () => {
      inner.startTracking();
      return "value";
    });
    expect(outer.isTrackingBlocked(), "outer tracker is released").toBe(false);
    expect(inner.isTrackingBlocked(), "inner tracker was not blocked").toBe(false);
    inner.stopTracking();
    outer.stopTracking();
  });

  test("getPropertyValue does not block tracking when there is no listener", () => {
    const model = new TrackerTestModel();
    const { tracker } = createTracker();
    model.calcProp;
    expect(tracker.isTrackingBlocked()).toBe(false);
  });

  test("A plain property read does not block tracking; only running calcFunc does", () => {
    const model = new TrackerTestModel();
    const { tracker } = createTracker();
    const blockSpy = vi.spyOn(tracker, "blockTracking");
    tracker.startTracking();
    model.prop1;
    model.items;
    expect(blockSpy, "plain reads do not block").not.toHaveBeenCalled();
    model.calcProp;
    expect(blockSpy, "the first read runs calcFunc").toHaveBeenCalledTimes(1);
    model.calcProp;
    expect(blockSpy, "the cached value does not run calcFunc again").toHaveBeenCalledTimes(1);
    tracker.stopTracking();
  });

  test("runUntracked returns the function's result and does not track what it reads", () => {
    const model = new TrackerTestModel();
    const { tracker, log } = createTracker();
    tracker.startTracking();
    const res = TrackerTestModel.runUntrackedForTest(() => model.prop1 + "!");
    expect(res).toBe("undefined!");
    expect(tracker.isTrackingBlocked(), "tracking is released").toBe(false);
    model.prop2;
    tracker.stopTracking();
    tracker.subscribe();

    model.prop1 = "a";
    expect(log, "prop1 was read inside runUntracked").toHaveLength(0);
    model.prop2 = "b";
    expect(log.map(e => e.name)).toEqual(["prop2"]);
  });

  test("runUntracked releases tracking when the function throws", () => {
    const { tracker } = createTracker();
    tracker.startTracking();
    expect(() => TrackerTestModel.runUntrackedForTest(() => { throw new Error("func error"); })).toThrow("func error");
    expect(tracker.isTrackingBlocked()).toBe(false);
    tracker.stopTracking();
  });

  test("runUntracked runs the function when no tracker is active", () => {
    const model = new TrackerTestModel();
    model.prop1 = "a";
    expect(TrackerTestModel.runUntrackedForTest(() => model.prop1)).toBe("a");
  });
});

describe("PropertyAccessTracker and finding an element's row", () => {
  afterEach(() => {
    Base.currentPropertyAccessListener = undefined as any;
  });
  function createSurvey(gridLayoutEnabled: boolean): SurveyModel {
    return new SurveyModel({
      gridLayoutEnabled,
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" },
        { type: "text", name: "q4" }
      ]
    });
  }
  function trackDuring(func: () => void): PropertyAccessTracker {
    const { tracker } = createTracker();
    tracker.startTracking();
    func();
    tracker.stopTracking();
    tracker.subscribe();
    return tracker;
  }

  test("findRowByElement does not subscribe to the rows it searches", () => {
    const survey = createSurvey(false);
    const page = survey.pages[0];
    const q4 = survey.getQuestionByName("q4");
    expect(page.rows.length, "one row per question").toBe(4);
    let row: QuestionRowModel = undefined as any;
    const tracker = trackDuring(() => { row = page.findRowByElement(q4); });
    expect(row, "the row is found").toBe(page.rows[3]);
    expect(page.rows.map(r => r.hasActiveUISubscribers), "no row is subscribed").toEqual([false, false, false, false]);
    expect(page.hasActiveUISubscribers, "the page's rows are tracked").toBe(true);
    tracker.unsubscribe();
  });

  test("getColumsForElement subscribes only to the element's own row", () => {
    const survey = createSurvey(true);
    const page = survey.pages[0];
    const q4 = survey.getQuestionByName("q4");
    // The first read of columns builds them from every row; components rendered after it reuse the cached columns
    expect(page.columns.length, "columns are built").toBeGreaterThan(0);
    const tracker = trackDuring(() => { page.getColumsForElement(q4); });
    expect(page.rows.map(r => r.hasActiveUISubscribers)).toEqual([false, false, false, true]);
    tracker.unsubscribe();
  });

  test("getColumsForElement does not search the rows when the grid layout is off", () => {
    const survey = createSurvey(false);
    const page = survey.pages[0];
    const q4 = survey.getQuestionByName("q4");
    let columns: Array<any> = undefined as any;
    const tracker = trackDuring(() => { columns = page.getColumsForElement(q4); });
    expect(columns).toEqual([]);
    expect(page.hasActiveUISubscribers, "the page is not read").toBe(false);
    expect(page.rows.map(r => r.hasActiveUISubscribers)).toEqual([false, false, false, false]);
    tracker.unsubscribe();
  });
});
