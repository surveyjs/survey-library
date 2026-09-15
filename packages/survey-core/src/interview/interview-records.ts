import type { Question } from "survey-core";
import type { IInterviewEntry, IInterviewError, IInterviewItem } from "./interview-types";
import {
  IFieldWriteResult, IInterviewField, IInterviewNesting, clearUntouchedFields, createFieldItem,
  createFields, getColumnQuestions, getDesignDetailQuestions, getFieldItems, isFieldValid, isPlainObject,
  writeFields,
} from "./interview-fields";
import { ensureRowDetailPanel } from "./interview-detail";
import { badRecordError, cannotAddError, cannotRemoveError, notAskableError } from "./interview-errors";

// The entries of a dynamic container as batch records, in both directions. A dynamic panel and a
// dynamic matrix are the two containers whose value is a list that grows and shrinks, so batch mode
// describes them as a list of records - one per entry - and takes such a list back: an object at a
// position patches that entry, a position past the count adds one, null removes one. Add, remove and
// edit, any number of entries, in one turn.
//
// The field record and the per-field write are tier 07's (interview-fields.ts), reused per entry:
// what owns the fields is one panel or one row instead of the container itself, and nothing about
// writing a field changes with the owner.
//
// Everything is read from the live structure - visiblePanels, visibleRows, the questions of each -
// and never from the single-mode inventory or the mode's navigation list: onCheckSingleInputPerPageMode
// and onGetLoopQuestions tune single mode only, and batch mode works per record whatever the host did
// to the mode's nesting. The inventory keeps one job here too - the change report is still taken over
// its addresses.
//
// A container inside an entry - a dynamic panel or a matrix in a panel template, a multiple text in a
// detail panel - is a field like any other, described and written through the nesting the caller
// hands down (interview-fields.ts): the same functions, called one level down with a longer address.

export interface IInterviewRecordEntry {
  // The position the document lists and a value of answerAll() addresses: the index into what the
  // interviewee sees, which is the list the summary step of single mode numbers as well.
  index: number;
  canRemove: boolean;
  // The PanelModel of visiblePanels[index], or the row of visibleRows[index]. A position names this
  // object and not an index: a patch may hide an earlier entry and shift the list under the call.
  entry: any;
  address: string;
  fields: Array<IInterviewField>;
}

function isPanelDynamic(question: any): boolean {
  return !!question && typeof question.addPanel === "function";
}

// What the interviewee sees, in the order they see it: visiblePanels with templateVisibleIf applied,
// visibleRows with rowsVisibleIf applied. Read on a live container only: the first read builds the
// entries of a container nobody has rendered.
function getEntryObjects(container: Question): Array<any> {
  const target: any = container;
  const res = isPanelDynamic(target) ? target.visiblePanels : target.visibleRows;
  return Array.isArray(res) ? res : [];
}

// Whether an add or a remove actually happened. The visible list is the wrong thing to count with: a
// new panel a templateVisibleIf hides never appears in it although the container did grow.
function getEntryCount(container: Question): number {
  const target: any = container;
  return isPanelDynamic(target) ? target.panelCount : target.rowCount;
}

export function canAddEntry(container: Question): boolean {
  const target: any = container;
  // False at the maximum count, with adding turned off, in read-only state, and under a
  // panelCountExpression / rowCountExpression - the count is then the expression's, and records
  // cannot change it.
  return isPanelDynamic(target) ? target.canAddPanel === true : target.canAddRow === true;
}

// The very reads the summary step's remove button is built from.
function canRemoveEntry(container: Question, entry: any): boolean {
  const target: any = container;
  if (isPanelDynamic(target)) return target.canRemovePanel === true;
  return target.canRemoveRows === true && target.canRemoveRow(entry) === true;
}

function getEntryAddress(address: string, index: number): string {
  return address + "[" + index + "]";
}

interface IEntryPosition {
  index: number;
  canRemove: boolean;
  entry: any;
  address: string;
}

// The positions alone - what a write plans with before anything is written. The fields are not
// described here: a plan needs to know which entry a position names, not what it holds.
function getEntryPositions(container: Question, address: string): Array<IEntryPosition> {
  return getEntryObjects(container).map((entry: any, index: number) => ({
    index: index,
    canRemove: canRemoveEntry(container, entry),
    entry: entry,
    address: getEntryAddress(address, index),
  }));
}

export function getRecordEntries(container: Question, address: string,
  nesting: IInterviewNesting): Array<IInterviewRecordEntry> {
  return getEntryPositions(container, address).map(position => ({
    index: position.index,
    canRemove: position.canRemove,
    entry: position.entry,
    address: position.address,
    fields: createFields(getEntryQuestions(position.entry), position.address, nesting),
  }));
}

// A panel's visible questions, recursive through the static panels inside it; a row's cells in column
// order, then the questions of its detail panel - which the interview has created for every visible
// row by the time anything reads it (interview-detail.ts).
function getEntryQuestions(entry: any): Array<Question> {
  return !!entry && Array.isArray(entry.visibleQuestions) ? entry.visibleQuestions : [];
}

// The names the entry knows, invisible ones included: a key that names one of them was not invented
// by the agent - the survey hid it - and that is a different statement than "there is no such field".
function getEntryNames(entry: any): Array<string> {
  const questions: Array<any> = !!entry && Array.isArray(entry.questions) ? entry.questions : [];
  return questions.map(question => question.name);
}

// The records the document renders: the position, whether it may be removed, and the fields. No
// title: the entry title the summary step shows is built by the model only for the container that is
// its current single input, and a document that never moves the model has no way to ask for it. An
// agent reads the values instead.
export function getEntryRecords(entries: Array<IInterviewRecordEntry>): Array<IInterviewEntry> {
  return entries.map(entry => ({
    index: entry.index,
    canRemove: entry.canRemove,
    fields: getFieldItems(entry.fields),
  }));
}

// What a new entry takes. A declaration and not a live entry: a visibleIf inside it has not run,
// choicesFromQuestion is empty, and a column that inherits the matrix's choices may report none. An
// entry's own fields are the truth once it exists. Everything a template holds is described in
// declaration mode, whatever the mode of the container that owns it - a container inside a template
// has a template and canAdd, or fields, or rows, and never entries, a value or an error, at any depth.
//
// The nesting's mode is the mode the container itself is described in. A live container may read its
// first entry for what the template cannot answer for itself; a declared one reads nothing but the
// template, because its entries - panels a panelCount would build on the first read - must never come
// into being through a look.
export function getTemplateItems(container: Question, nesting: IInterviewNesting): Array<IInterviewItem> {
  const res: Array<IInterviewItem> = [];
  const isLive = nesting.mode === "live";
  const entries = isLive ? getEntryObjects(container) : [];
  const declaration = nesting.asDeclaration();
  getTemplateQuestions(container, entries).forEach(question => {
    const item = createFieldItem(question, undefined, declaration);
    if (!!item) res.push(fillTemplateChoices(item, entries[0], declaration));
  });
  return res;
}

// The one thing a template question of a dynamic matrix cannot answer for itself: the choices a
// column inherits from the matrix. The column's templateQuestion is never bound to the matrix's own
// "choices" property - only the cells the rows build are - so a dropdown column that offers a list
// reports none there. When a row exists, its cell is asked instead; when none does, the template says
// what it can and the entry's own fields are the truth once an entry is added. No throwaway row is
// ever created to read it.
function fillTemplateChoices(item: IInterviewItem, entry: any, declaration: IInterviewNesting): IInterviewItem {
  if (!entry || !!item.choices || !!item.rateValues || item.choicesUnknown === true) return item;
  if (item.unsupported === true || isContainerRecord(item)) return item;
  const cell = getEntryQuestions(entry).filter(question => question.name === item.name)[0];
  const described = !!cell ? createFieldItem(cell, undefined, declaration) : undefined;
  if (!described || (!described.choices && !described.rateValues && described.choicesUnknown !== true)) {
    return item;
  }
  return described;
}

function isContainerRecord(item: IInterviewItem): boolean {
  return item.canAdd !== undefined || !!item.fields || !!item.rows;
}

function getTemplateQuestions(container: Question, entries: Array<any>): Array<Question> {
  const target: any = container;
  if (isPanelDynamic(target)) {
    // The template panel is attached to the survey, so titles and the locale resolve on it.
    const template: any = target.template;
    return !!template && Array.isArray(template.questions) ? template.questions : [];
  }
  return getColumnQuestions(target).concat(getDetailTemplateQuestions(target, entries));
}

// The detail panel's questions follow the columns: a new row takes them too. The design-time panel
// they are declared on is not attached to the survey, so a localized title and a choicesFromQuestion
// do not resolve there; a live matrix therefore describes them from the panel of its first row that
// has one - still as a declaration - and a matrix with no such row, or one that is itself declared,
// falls back to the design-time panel and says what it can.
function getDetailTemplateQuestions(matrix: any, entries: Array<any>): Array<Question> {
  const design = getDesignDetailQuestions(matrix);
  if (design.length === 0) return design;
  const row = entries.filter(item => !!item && !!item.detailPanel)[0];
  return !!row && Array.isArray(row.detailPanel.questions) ? row.detailPanel.questions : design;
}

// The batch twin of "not empty" for a container whose value is a list: it holds at least one entry.
// The "done" gesture of single mode is not consulted - an agent has no such gesture.
export function isRecordsAnswered(container: Question): boolean {
  return getEntryObjects(container).length > 0;
}

// A read of persisted state, never a validation run. An empty optional field does not make the
// container invalid, exactly as an empty optional root is not an error; a field that is a container
// is valid by the same test one level down.
export function isRecordsValid(container: Question, entries: Array<IInterviewRecordEntry>,
  nesting: IInterviewNesting): boolean {
  if (container.errors.length > 0 || container.hasRequiredError()) return false;
  return entries.every(entry => entry.fields.every(field => isFieldValid(field, nesting)));
}

export interface IRecordCounts {
  minCount?: number;
  maxCount?: number;
}

export interface IRecordWriteResult extends IFieldWriteResult {
  // Whether the key got past its pre-check. A key refused as a whole leaves the container exactly as
  // it was, and there is then nothing for the container to validate itself about.
  applied?: boolean;
}

interface IRecordOperation {
  // the position the agent sent, which is what every message names: the entries have not moved yet
  position: number;
  address: string;
  entry?: any;
  canRemove?: boolean;
  values?: any;
}

interface IRecordPlan {
  error?: IInterviewError;
  patches: Array<IRecordOperation>;
  adds: Array<IRecordOperation>;
  removes: Array<IRecordOperation>;
}

// One value for a dynamic container. Patch semantics, as one level up: a position not sent is left as
// it is, an object patches only the keys it carries, and the interview never removes an entry it was
// not told to remove - "the list you send is the list the survey holds" would silently delete the
// entries an agent did not resend. The same function for a root key and for a field of an entry at
// any depth: the address is the owner address the caller hands in.
export function writeRecordsValue(container: Question, address: string, value: any,
  commentSuffix: string, counts: IRecordCounts, nesting: IInterviewNesting): IRecordWriteResult {
  const res: IRecordWriteResult = { errors: [], written: [], containers: [] };
  const list = toRecordList(value);
  if (list === undefined) {
    res.errors.push(badRecordError(address, value, "list"));
    return res;
  }
  if (list.length === 0) return res;
  const plan = createPlan(container, address, list, counts);
  if (!!plan.error) {
    // Whole-key: a partially realized shape shifts the positions the agent reasoned about, so nothing
    // of the key is written and the message names the position that cannot work.
    res.errors.push(plan.error);
    return res;
  }
  res.applied = true;
  // Patches and adds first, removals last, so that what the agent read stays what the agent meant: a
  // patch may hide an earlier entry and shift the visible list, and an index read after the write
  // would then remove the wrong entry.
  plan.patches.forEach(operation => patchEntry(res, container, operation, commentSuffix, false, nesting));
  applyAdds(res, container, address, plan, commentSuffix, nesting);
  applyRemoves(res, container, address, plan);
  return res;
}

// A single plain object is wrapped, by the array rule of tier 04. null, undefined and an empty list
// write nothing and remove nothing: "clear it all" is a list of nulls.
function toRecordList(value: any): Array<any> | undefined {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  if (isPlainObject(value)) return [value];
  return undefined;
}

// Every position below the count is resolved to the entry object it names before anything is written,
// and every operation of the call then acts on that object rather than on an index.
function createPlan(container: Question, address: string, list: Array<any>,
  counts: IRecordCounts): IRecordPlan {
  const res: IRecordPlan = { patches: [], adds: [], removes: [] };
  const entries = getEntryPositions(container, address);
  const count = entries.length;
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    // A hole in the list, or an explicit undefined: that position is not being sent at all.
    if (element === undefined) continue;
    const entry = i < count ? entries[i] : undefined;
    if (element === null) {
      if (!entry) {
        // A null past the count names nothing to remove, and a position past the count is an add,
        // which takes an object.
        res.error = badRecordError(getEntryAddress(address, i), element, "entry");
        return res;
      }
      res.removes.push({
        position: i, address: entry.address, entry: entry.entry, canRemove: entry.canRemove,
      });
      continue;
    }
    if (!isPlainObject(element)) {
      res.error = badRecordError(getEntryAddress(address, i), element, "entry");
      return res;
    }
    if (!entry) {
      res.adds.push({ position: i, address: getEntryAddress(address, i), values: element });
      continue;
    }
    res.patches.push({ position: i, address: entry.address, entry: entry.entry, values: element });
  }
  res.error = checkCounts(container, address, res, count, counts);
  return res;
}

// The counts are checked in the order the operations run, because the model enforces each step on its
// own - canAddPanel / canAddRow at every add, canRemovePanel / canRemoveRows at every remove. So the
// adds must fit before the removes: four entries, a maximum of five, two adds and one null is
// cannotAdd although the final count would be five, and an agent that needs the room removes first,
// in a turn of its own. The refusal is named after the position that cannot work, and its message
// after the container that refused it.
function checkCounts(container: Question, address: string, plan: IRecordPlan, count: number,
  counts: IRecordCounts): IInterviewError | undefined {
  const refused = plan.removes.filter(operation => operation.canRemove !== true)[0];
  if (!!refused) return cannotRemoveError(refused.address, refused.position, { container: address });
  const maxCount = counts.maxCount === undefined ? Number.MAX_VALUE : counts.maxCount;
  const minCount = counts.minCount === undefined ? 0 : counts.minCount;
  if (plan.adds.length > 0) {
    if (!canAddEntry(container)) {
      return cannotAddError(plan.adds[0].address, { container: address, position: plan.adds[0].position });
    }
    if (count + plan.adds.length > maxCount) {
      const over = plan.adds[Math.max(0, maxCount - count)] || plan.adds[0];
      return cannotAddError(over.address, { container: address, position: over.position });
    }
  }
  if (plan.removes.length > 0 && count + plan.adds.length - plan.removes.length < minCount) {
    const first = plan.removes[0];
    return cannotRemoveError(first.address, first.position, { container: address });
  }
  return undefined;
}

// One record, written into one entry. The keys go in the entry's field order and not in the object's
// key order - a setValueIf or a trigger that reads an earlier field must see it first - and each is
// resolved immediately before its own write, so a field an earlier key of the same record revealed is
// written in the same call. One bad field skips that field; the rest of the record is written.
function patchEntry(res: IRecordWriteResult, container: Question, operation: IRecordOperation,
  commentSuffix: string, isNew: boolean, nesting: IInterviewNesting): void {
  if (!isNew && !isEntryVisible(container, operation.entry)) {
    // An entry an earlier patch of the same call hid is no longer being asked for.
    res.errors.push(notAskableError(operation.address, "hidden"));
    return;
  }
  // A row this call added, or one an earlier write revealed, has no detail panel until something
  // creates it, and the settle that would is still to come: its detail fields are written in the same
  // record whether or not detailPanelShowOnAdding is set. A mutation inside a mutating call, before
  // that call's settle - the one place outside the settle that creates a panel.
  ensureRowDetailPanel(operation.entry);
  writeFields(res, operation.values, commentSuffix, {
    address: operation.address,
    getFields: () => createFields(getEntryQuestions(operation.entry), operation.address, nesting),
    getNames: () => getEntryNames(operation.entry),
  }, nesting);
}

function isEntryVisible(container: Question, entry: any): boolean {
  return getEntryObjects(container).indexOf(entry) >= 0;
}

function applyAdds(res: IRecordWriteResult, container: Question, address: string, plan: IRecordPlan,
  commentSuffix: string, nesting: IInterviewNesting): void {
  for (let i = 0; i < plan.adds.length; i++) {
    const operation = plan.adds[i];
    // Read again before every add: a patch of the same call, or a handler of the survey, may have
    // turned adding off since the pre-check.
    if (!canAddEntry(container)) {
      res.errors.push(cannotAddError(operation.address,
        { container: address, position: operation.position }));
      return;
    }
    const before = getEntryCount(container);
    const entry = addEntry(container);
    if (!entry || getEntryCount(container) <= before) {
      // The host's handler refused - onMatrixRowAdding, or a panel a panelCountExpression dropped
      // again. The remaining adds are not attempted: the positions they were meant for have moved.
      res.errors.push(cannotAddError(operation.address,
        { container: address, position: operation.position, byHost: true }));
      return;
    }
    operation.entry = entry;
    patchEntry(res, container, operation, commentSuffix, true, nesting);
  }
}

// Not singleInputAddItem(), addPanelUI() or addRowUI(): those are the mode's and the UI's gestures -
// canLeaveCurrentPanel, focus, moving the current input - and this is a data write.
function addEntry(container: Question): any {
  const target: any = container;
  if (isPanelDynamic(target)) {
    // A negative index appends in every display mode; runAdditionalActions left off means no focus,
    // no animation and no canAddPanel check of its own, which is why the interview checks first.
    return target.addPanel(-1);
  }
  // addRow checks canAddRow itself, fires onMatrixRowAdding, and shows the detail panel when
  // detailPanelShowOnAdding says so.
  target.addRow(false);
  const rows: Array<any> = target.visibleRows;
  return rows.length > 0 ? rows[rows.length - 1] : undefined;
}

// Descending position, each on the entry object the plan resolved: removing from the back leaves the
// positions of the removals that are still to come untouched in the model's own lists.
function applyRemoves(res: IRecordWriteResult, container: Question, address: string,
  plan: IRecordPlan): void {
  plan.removes.slice().sort((a, b) => b.position - a.position).forEach(operation => {
    // The permission is read again immediately before the removal, because the data-level calls do
    // not read it for the interview: removePanel() with confirmDelete undefined goes straight to
    // removePanelCore, and a patch or a host handler earlier in the same call may have changed
    // allowRemovePanel, readOnly or the count. There is no way to remove what the interviewee cannot
    // see either.
    if (!isEntryVisible(container, operation.entry) || !canRemoveEntry(container, operation.entry)) {
      res.errors.push(cannotRemoveError(operation.address, operation.position, { container: address }));
      return;
    }
    const before = getEntryCount(container);
    removeEntry(container, operation.entry);
    if (getEntryCount(container) >= before) {
      // onDynamicPanelRemoving / onMatrixRowRemoving said no. The other removals of the call still
      // run: the pre-check has ruled out the shapes that cannot work, and what fails here is one entry.
      res.errors.push(cannotRemoveError(operation.address, operation.position,
        { container: address, byHost: true }));
    }
  });
}

function removeEntry(container: Question, entry: any): void {
  const target: any = container;
  if (isPanelDynamic(target)) {
    // confirmDelete left undefined: the non-UI branch, no dialog - and nobody answers a dialog in Node.
    target.removePanel(entry);
    return;
  }
  // The index is the row's position now, not the one the agent sent; false skips the prompt.
  const index = target.visibleRows.indexOf(entry);
  if (index >= 0) target.removeRow(index, false);
}

// The untouched-errors rule (interview-fields.ts clearUntouchedFields) over every field of every
// entry: validating a container validates its entries with it, and a freshly added entry is empty by
// definition. An unanswered required field becomes an error at complete(), not the moment its entry
// comes into being.
export function clearUntouchedErrors(container: Question, address: string,
  writtenIds: { [id: string]: boolean }, nesting: IInterviewNesting): void {
  getRecordEntries(container, address, nesting).forEach(entry => {
    clearUntouchedFields(entry.fields, writtenIds, nesting);
  });
}
