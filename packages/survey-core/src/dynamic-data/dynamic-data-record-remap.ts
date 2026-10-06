import { IDynamicDataListChange } from "./dynamic-data-interfaces";

/* A record index names a record only as long as nothing is inserted, removed or moved in front of
   it. Everything that keeps record indexes across the list's own writes - the frozen membership of
   the list, the objects of the questions, the edited set of layer 2 - renumbers them with these
   rules. The removed record maps to -1: a caller that keeps it drops it, one that holds an object
   for it marks the object as having no record. */

export function insertRemap(at: number): (index: number) => number {
  return (i: number): number => i >= at ? i + 1 : i;
}
export function removeRemap(index: number): (index: number) => number {
  return (i: number): number => i === index ? -1 : (i > index ? i - 1 : i);
}
export function moveRemap(from: number, to: number): (index: number) => number {
  return (i: number): number => {
    if (i === from) return to;
    if (from < i && i <= to) return i - 1;
    if (to <= i && i < from) return i + 1;
    return i;
  };
}
// undefined for a change that does not renumber records: recordChanged, reset, loading, pageChanged.
export function getRecordRemap(change: IDynamicDataListChange): (index: number) => number {
  if (change.type === "recordAdded") return insertRemap(change.index);
  if (change.type === "recordRemoved") return removeRemap(change.index);
  if (change.type === "recordMoved") return moveRemap(change.from, change.to);
  return undefined;
}
/* The part of a list change a question follows by record index: an edit marks the record edited, an
   insert, remove or move renumbers the question's own objects (remapObjects) and then the edited set.
   validation is the edited set of layer 2, when the question has one. */
export function applyRecordChange(change: IDynamicDataListChange,
  validation: { markEdited(index: number): void, onRecordRemap(remap: (index: number) => number): void },
  remapObjects: (remap: (index: number) => number) => void): void {
  if (change.type === "recordChanged") {
    if (!!validation) validation.markEdited(change.index);
    return;
  }
  const remap = getRecordRemap(change);
  if (!remap) return;
  remapObjects(remap);
  if (!!validation) validation.onRecordRemap(remap);
}
