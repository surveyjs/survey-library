import { IDynamicDataListChange } from "../dynamic-data/dynamic-data-interfaces";
import { getRecordRemap } from "../dynamic-data/dynamic-data-record-remap";

/* A record index a records question keeps besides its records - the record an object was built for,
   the current record, a held remove target, the edited set - names a record only until the records
   move, and some of them name nothing once the records are replaced or the question goes. Every event
   that does either reaches every follower of the question, in one order
   (QuestionRecordsModel.followRecordIndexEvent), and each follower decides what the event does to its
   own state. A follower reads the paging state from its owner when it handles the event: it is not
   part of the event. */

// An index: where the record is now. -1: it is gone. undefined: the remap could not place it.
export type RecordRemap = (index: number) => number | undefined;

// The list's own insert, remove or move: the remap is total.
export type RecordListChangeEvent = { kind: "insert" | "remove" | "move", remap: RecordRemap };
export type RecordIndexEvent = RecordListChangeEvent
  /* A read that committed again, an assignment from outside that replaced records. getRemap builds the
     remap on its first call (getReplacedRecordsRemap): a follower with nothing to renumber never asks. */
  | { kind: "reload" | "assignment", oldRecords: Array<any>, newRecords: Array<any>, getRemap: () => RecordRemap }
  // The records were replaced by a change of what defines them (the rows of the fixed matrix); total.
  | { kind: "redefined", getRemap: () => RecordRemap }
  /* An assignment from outside has ended, after the objects it rebuilt ran their conditions - which is
     later than "assignment", and is raised for every assignment from outside, also one owed. */
  | { kind: "valueAssigned", oldRecords: Array<any>, newRecords: Array<any> }
  | { kind: "source" | "dispose" | "pageChanged" | "readFailed" };

export interface IRecordIndexFollower {
  follow(event: RecordIndexEvent): void;
}

export function isRecordListChange(event: RecordIndexEvent): event is RecordListChangeEvent {
  return event.kind === "insert" || event.kind === "remove" || event.kind === "move";
}
// The list change as an event; undefined for a change that renumbers nothing (see getRecordRemap).
export function getRecordListChangeEvent(change: IDynamicDataListChange): RecordListChangeEvent {
  const remap = getRecordRemap(change);
  if (!remap) return undefined;
  return { kind: change.type === "recordAdded" ? "insert" : (change.type === "recordRemoved" ? "remove" : "move"), remap: remap };
}
// For a follower that treats a record the remap cannot place as gone.
export function toKnownRemap(remap: RecordRemap): (index: number) => number {
  return (index: number): number => {
    const to = remap(index);
    return to === undefined ? -1 : to;
  };
}
// The remap is built on the first call and kept.
export function createLazyRemap(create: () => RecordRemap): () => RecordRemap {
  let remap: RecordRemap = undefined;
  return (): RecordRemap => remap || (remap = create());
}
