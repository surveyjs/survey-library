import type { Question } from "survey-core";
import type { IInterviewItem } from "./interview-types";
import { MAX_NESTING_DEPTH } from "./interview-address";
import {
  IFieldWriteResult, IInterviewNesting, InterviewDescribeMode, clearUntouchedFields,
  createBatchItem, getContainerFields, getContainerInputs, getContainerRows, getDeclaredFields,
  getDeclaredRows, getFieldItems, getRowRecords, isContainerValid, isDynamicContainer,
  isFixedShapeContainer, mergeWriteResult, writeContainerValue,
} from "./interview-fields";
import {
  canAddEntry, clearUntouchedErrors, getEntryRecords, getRecordEntries, getTemplateItems,
  isRecordsValid, writeRecordsValue,
} from "./interview-records";

// One describer and one writer for "a container at an address", whatever it holds and wherever it
// sits. A root container and a field that is a container go through the same two functions: the root
// code (interview-batch.ts, interview.ts) calls them at depth 0, and the field code
// (interview-fields.ts, interview-records.ts) reaches them through the IInterviewNesting built here,
// one level down each time. So an entry's record describes a nested container exactly as the root
// document describes a root one, and a record an agent sends carries the nested container's own value
// form - a list of records for a dynamic one, an object of fields for a fixed-shape one - at any
// depth: { orders: [{ ref: "PO-1", items: [{ sku: "A-1" }, null] }] }. The value has the shape of data,
// one key, one schema, one turn, and the rules of tiers 07 and 08 - patch semantics, field order, "one
// bad field skips that field", whole-key refusal of a list - hold one level down because they are the
// same functions called with a different owner.
//
// "depth" is the number of containers above the question (interview-address.ts). A container at the
// ceiling is the one thing a batch cannot fill: it is described with unsupported and reason "batch",
// with nothing of its own below it, and a key for it is refused. The inventory and the address grammar
// stop at the same depth, so nothing reaches what lies below it in either mode.
//
// Nothing imports this module but interview-batch.ts and interview.ts; the two tier-07 / tier-08 files
// take it as a parameter instead, which is what keeps the recursion free of an import cycle.

// What writing a container did: the refusals, the fields written at any depth, and the containers
// written - the nested ones first, the container itself last.
export type IContainerWriteResult = IFieldWriteResult;

// The tier-07 / tier-08 record of a container. In "live" mode: what it holds now at the address -
// entries, template and canAdd for a dynamic container, fields or rows for a fixed-shape one. In
// "declaration" mode - a container inside a template - what a new entry's container will take: template
// and canAdd, or fields or rows, read from the template's own question, and never entries, a value or
// an error; the address is ignored, because a declaration has none. undefined for a question that is
// read-only by property, which is not an item anywhere.
export function describeContainer(question: Question, address: string | undefined,
  mode: InterviewDescribeMode, depth: number): IInterviewItem | undefined {
  const item = createBatchItem(question);
  if (!item) return undefined;
  // A question with no plain input is unsupported already, and nothing about its structure changes
  // that: a file is a file whether or not it holds nested questions.
  if (item.unsupported === true) return item;
  const isDynamic = isDynamicContainer(question);
  if (depth >= MAX_NESTING_DEPTH || (!isDynamic && !isFixedShapeContainer(question))) {
    // The only place the pair is written: the depth ceiling, and a root whose value is an object the
    // interview has no shape for.
    item.unsupported = true;
    item.reason = "batch";
    return item;
  }
  const nesting = createNesting(mode, depth + 1, {});
  const at = mode === "live" ? address : undefined;
  if (isDynamic) {
    fillRecords(item, question, at, nesting);
  } else {
    fillFields(item, question, at, nesting);
  }
  return item;
}

// A dynamic container: what it holds now, what a new entry takes, and whether another one may be
// added, in that order. "entries" is left out while the container holds none - "canAdd" is then the
// whole story - while "template" says what to send either way. canAdd is written in a declaration too:
// it is what the template question reports, which is what a new entry's container reports before
// anything is written, and it is the key the answer schema tells a list by.
function fillRecords(item: IInterviewItem, container: Question, address: string | undefined,
  nesting: IInterviewNesting): void {
  if (nesting.mode === "live") {
    const entries = getRecordEntries(container, address, nesting);
    if (entries.length > 0) item.entries = getEntryRecords(entries);
  }
  const template = getTemplateItems(container, nesting);
  if (template.length > 0) item.template = template;
  item.canAdd = canAddEntry(container);
}

// A fixed-shape container. The key the describer would have written for a multiple text or a
// composite is gone (createBatchItem drops it) and one of these takes its place, in the same position.
// It is written even when it is empty, unlike the optional keys of a document: "fields: []" says that
// this container has nothing an agent can fill - an enableIf turned every editor read-only with it -
// and that is information, the way "items: []" and "current: null" are.
function fillFields(item: IInterviewItem, container: Question, address: string | undefined,
  nesting: IInterviewNesting): void {
  if (nesting.mode === "declaration") {
    const declared = getDeclaredRows(container, nesting);
    if (!!declared) {
      item.rows = declared;
    } else {
      item.fields = getDeclaredFields(container, nesting);
    }
    return;
  }
  const rows = getContainerRows(container, address, nesting);
  if (!!rows) {
    item.rows = getRowRecords(rows);
  } else {
    item.fields = getFieldItems(getContainerFields(container, address, nesting));
  }
}

// One value for a container, in its own value form: a list of entry records for a dynamic one, an
// object of fields (of row objects, for a matrix dropdown) for a fixed-shape one. null and undefined
// leave it alone wherever the key sits. After the write the container validates itself - its own
// errors (hasKeysDuplicated, MinRowCountError, RequiredInAllRowsError, a required container that lost
// its last entry) come from nowhere else - and the untouched-errors rule is applied to everything
// below it, with the one snapshot of the call. A write refused as a whole leaves the container as it
// was, with nothing to validate.
export function writeContainer(question: Question, address: string, item: IInterviewItem, value: any,
  commentSuffix: string, hadErrors: { [id: string]: boolean }, depth: number): IContainerWriteResult {
  const res: IContainerWriteResult = { errors: [], written: [], containers: [] };
  if (value === undefined || value === null) return res;
  const nesting = createNesting("live", depth + 1, hadErrors, true);
  if (isDynamicContainer(question)) {
    const constraints: any = item.constraints || {};
    const records = writeRecordsValue(question, address, value, commentSuffix,
      { minCount: constraints.minCount, maxCount: constraints.maxCount }, nesting);
    mergeWriteResult(res, records);
    if (records.applied !== true) return res;
  } else {
    mergeWriteResult(res, writeContainerValue(question, address, value, commentSuffix, nesting));
    if (res.written.length === 0 && res.containers.length === 0) return res;
  }
  // After every write of the key, not only after an add or a remove: hasKeysDuplicated lives in the
  // container's own validate and nowhere a nested question's validate(true) reaches, so a patch that
  // turns a keyName field into a duplicate would leave no error anywhere and the record would drop out
  // of the document while invalid.
  question.validate(true);
  clearUntouchedTree(question, address, getWrittenIds(res), depth, hadErrors);
  res.containers.push({ address: address, question: question });
  return res;
}

function getWrittenIds(res: IFieldWriteResult): { [id: string]: boolean } {
  const ids: { [id: string]: boolean } = {};
  res.written.forEach(field => { ids[field.question.id] = true; });
  res.containers.forEach(container => { ids[container.question.id] = true; });
  return ids;
}

// The batch validity of a container at any depth: neither it nor any field below it carries an error
// or a required error. A read of persisted state, never a validation run. An empty optional field -
// or an empty optional nested container - does not make it invalid.
export function isContainerTreeValid(question: Question, address: string, depth: number): boolean {
  if (question.errors.length > 0 || question.hasRequiredError()) return false;
  // Nothing below the ceiling exists, so nothing there can make the container invalid.
  if (depth >= MAX_NESTING_DEPTH) return true;
  const nesting = createNesting("live", depth + 1, {}, true);
  if (isDynamicContainer(question)) {
    return isRecordsValid(question, getRecordEntries(question, address, nesting), nesting);
  }
  return isContainerValid(question, getContainerInputs(question, address, nesting), nesting);
}

function clearUntouchedTree(question: Question, address: string, writtenIds: { [id: string]: boolean },
  depth: number, hadErrors: { [id: string]: boolean }): void {
  if (depth >= MAX_NESTING_DEPTH) return;
  const nesting = createNesting("live", depth + 1, hadErrors, true);
  if (isDynamicContainer(question)) {
    clearUntouchedErrors(question, address, writtenIds, nesting);
    return;
  }
  clearUntouchedFields(getContainerInputs(question, address, nesting), writtenIds, nesting);
}

// The record of a container field as a write and a predicate need it: the batch record - constraints,
// disabled, required - and the ceiling, without the entries, the template or the fields below it.
// Writing and validating walk the tree one level at a time and re-read each level as they reach it,
// so describing the whole subtree at every level would describe it again for every level above it.
function describeShallow(question: Question, depth: number): IInterviewItem | undefined {
  const item = createBatchItem(question);
  if (!item || item.unsupported === true) return item;
  if (depth >= MAX_NESTING_DEPTH || (!isDynamicContainer(question) && !isFixedShapeContainer(question))) {
    item.unsupported = true;
    item.reason = "batch";
  }
  return item;
}

// The recursion as the field code sees it, for the fields at "depth": the same mode, the same
// snapshot, and every function one level further down than the owner they are fields of. "shallow"
// for a nesting that writes or validates rather than describes a document (describeShallow).
function createNesting(mode: InterviewDescribeMode, depth: number,
  hadErrors: { [id: string]: boolean }, shallow?: boolean): IInterviewNesting {
  let declaration: IInterviewNesting;
  const res: IInterviewNesting = {
    mode: mode,
    depth: depth,
    hadErrors: hadErrors,
    describe: (question, address) => shallow === true
      ? describeShallow(question, depth)
      : describeContainer(question, address, mode, depth),
    write: (question, address, item, value, commentSuffix) =>
      writeContainer(question, address, item, value, commentSuffix, hadErrors, depth),
    isValid: (question, address) => isContainerTreeValid(question, address, depth),
    clearUntouched: (question, address, writtenIds) =>
      clearUntouchedTree(question, address, writtenIds, depth, hadErrors),
    asDeclaration: () => {
      if (mode === "declaration") return res;
      if (!declaration) declaration = createNesting("declaration", depth, hadErrors, shallow);
      return declaration;
    },
  };
  return res;
}
