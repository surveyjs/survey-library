import { IDynamicDataListChange } from "../dynamic-data/dynamic-data-interfaces";
import { getRecordRemap } from "../dynamic-data/dynamic-data-record-remap";

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
