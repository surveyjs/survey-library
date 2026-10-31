import { describe, test, expect } from "vitest";
import { IRecordsDataWaitsOwner, RecordsDataWaits } from "../../src/records/records-data-waits";

// A validation context as the waits use it: the elements it waits for, and how it was asked.
class FakeContext {
  public elements: Array<string> = [];
  public removed: Array<string> = [];
  constructor(public hasCallback: boolean = true, public isOnValueChanged: boolean = false, public isOnValueChanging: boolean = false) { }
  public addElement(id: string): void { this.elements.push(id); }
  public removeElement(id: string): void { this.removed.push(id); }
}
// The survey side that waits for the writes.
class FakeSurvey {
  public calls: Array<string> = [];
  public dynamicDataWritesChanged(question: any, hasPendingWrites: boolean, isFailed?: boolean): void {
    this.calls.push(question.name + ":" + hasPendingWrites + (isFailed ? ":failed" : ""));
  }
}
class FakeOwner implements IRecordsDataWaitsOwner {
  public question: any = { name: "q" };
  public id = "q1";
  public isDisposed = false;
  public survey: any = new FakeSurvey();
  public running = false;
  public writing = false;
  public validated: Array<FakeContext> = [];
  public onValidate: (context: FakeContext) => void;
  public isDataRunning(): boolean { return this.running; }
  public isWriting(): boolean { return this.writing; }
  public validate(context: any): void {
    this.validated.push(context);
    if (!!this.onValidate) {
      this.onValidate(context);
    }
  }
}
function create(): { owner: FakeOwner, waits: RecordsDataWaits } {
  const owner = new FakeOwner();
  return { owner, waits: new RecordsDataWaits(owner) };
}

describe("RecordsDataWaits: a validation that answers through a callback waits for the data", () => {
  test("a context waits only while the data runs, with a callback and not on a value change", () => {
    const { owner, waits } = create();
    const idle = new FakeContext();
    waits.wait(<any>idle);
    expect(idle.elements, "#1: nothing runs").toEqual([]);
    owner.running = true;
    const noCallback = new FakeContext(false);
    const onChanged = new FakeContext(true, true);
    const onChanging = new FakeContext(true, false, true);
    waits.wait(<any>noCallback);
    waits.wait(<any>onChanged);
    waits.wait(<any>onChanging);
    expect(noCallback.elements.concat(onChanged.elements, onChanging.elements), "#2: none of them waits").toEqual([]);
    const context = new FakeContext();
    waits.wait(<any>context);
    waits.wait(<any>context);
    expect(context.elements, "#3: one registration per context").toEqual(["q1_data_1"]);
  });
  test("the settled data validates every waiting context again and releases it", () => {
    const { owner, waits } = create();
    owner.running = true;
    const first = new FakeContext();
    const second = new FakeContext();
    waits.wait(<any>first);
    waits.wait(<any>second);
    waits.onDataSettled();
    expect(owner.validated.length, "#1: still running: nothing is validated").toBe(0);
    owner.running = false;
    waits.onDataSettled();
    expect(owner.validated, "#2: both validated, in order").toEqual([first, second]);
    expect(first.removed, "#3").toEqual(["q1_data_1"]);
    expect(second.removed, "#4").toEqual(["q1_data_2"]);
    owner.validated = [];
    waits.onDataSettled();
    expect(owner.validated.length, "#5: released once").toBe(0);
  });
  test("a context registered again by its own validation gets a new id and the old one is removed", () => {
    const { owner, waits } = create();
    owner.running = true;
    const context = new FakeContext();
    waits.wait(<any>context);
    owner.running = false;
    owner.onValidate = (ctx: FakeContext): void => {
      owner.running = true;
      waits.wait(<any>ctx);
    };
    waits.onDataSettled();
    expect(context.elements, "#1").toEqual(["q1_data_1", "q1_data_2"]);
    expect(context.removed, "#2: the registration the release ends").toEqual(["q1_data_1"]);
  });
  test("a release without validation removes every registration; a throwing validation is rethrown after all are released", () => {
    const { owner, waits } = create();
    owner.running = true;
    const first = new FakeContext();
    const second = new FakeContext();
    waits.wait(<any>first);
    waits.wait(<any>second);
    waits.release(false);
    expect(owner.validated.length, "#1").toBe(0);
    expect(first.removed.concat(second.removed), "#2").toEqual(["q1_data_1", "q1_data_2"]);
    waits.wait(<any>first);
    waits.wait(<any>second);
    owner.onValidate = (): void => { throw new Error("validation"); };
    expect(() => waits.release(true), "#3").toThrow("validation");
    expect(second.removed, "#4: the second one is released too").toEqual(["q1_data_2", "q1_data_4"]);
  });
});

describe("RecordsDataWaits: the survey is told about the unanswered writes", () => {
  test("the first write is reported once and the settled writes take the question off", () => {
    const { owner, waits } = create();
    owner.writing = true;
    waits.onWritesStarted();
    waits.onWritesStarted();
    expect(owner.survey.calls, "#1").toEqual(["q:true"]);
    owner.writing = false;
    waits.onDataSettled();
    expect(owner.survey.calls, "#2").toEqual(["q:true", "q:false"]);
  });
  test("a rejected write is reported as failed, a rejected read is not", () => {
    const { owner, waits } = create();
    waits.onSourceError("update");
    owner.writing = true;
    waits.onWritesStarted();
    owner.writing = false;
    waits.onDataSettled();
    expect(owner.survey.calls, "#1: rejected before it was reported").toEqual(["q:true", "q:false"]);
    owner.writing = true;
    waits.onWritesStarted();
    waits.onSourceError("read");
    owner.writing = false;
    waits.reportPendingWrites();
    expect(owner.survey.calls.slice(2), "#2: a read").toEqual(["q:true", "q:false"]);
    owner.writing = true;
    waits.onWritesStarted();
    waits.onSourceError("insert");
    owner.writing = false;
    waits.reportPendingWrites();
    expect(owner.survey.calls.slice(4), "#3: an insert").toEqual(["q:true", "q:false:failed"]);
  });
  test("a question that moves to another survey or is disposed is taken off", () => {
    const { owner, waits } = create();
    owner.writing = true;
    waits.onWritesStarted();
    const first = owner.survey;
    const second = new FakeSurvey();
    owner.survey = second;
    waits.onSurveyChanged(<any>second);
    expect(first.calls, "#1").toEqual(["q:true", "q:false"]);
    expect(second.calls, "#2").toEqual(["q:true"]);
    owner.isDisposed = true;
    waits.reportPendingWrites();
    expect(second.calls, "#3").toEqual(["q:true", "q:false"]);
  });
  test("a survey without the writes member is never asked", () => {
    const { owner, waits } = create();
    owner.survey = {};
    owner.writing = true;
    expect(() => waits.onWritesStarted(), "#1").not.toThrow();
    owner.writing = false;
    expect(() => waits.reportPendingWrites(), "#2").not.toThrow();
  });
});
