import type { Question, SurveyModel } from "survey-core";
import type { IInterviewItem } from "./interview-types";
import {
  IInterviewInput, getInputErrors, getRootQuestions, isContainerQuestion, isInputValid, isOnStartPage,
} from "./interview-items";
import {
  createBatchItem, getContainerFields, getContainerInputs, getContainerRows, getFieldItems,
  getRowRecords, isContainerAnswered, isContainerValid, isFixedShapeContainer,
} from "./interview-fields";
import {
  canAddEntry, getEntryRecords, getRecordEntries, getTemplateItems, isDynamicContainer,
  isRecordsAnswered, isRecordsValid,
} from "./interview-records";

// Batch mode is single mode's inventory read at the root level. An agent that fills a whole form in
// one turn writes one value per question, so the unit here is the root - the question a JSON key
// names - and not the nested input single mode walks.
//
// A root whose value is one object with a fixed set of keys is filled as that object: a single-choice
// matrix, a matrix dropdown, a multiple text and a composite report their inputs as "fields" and
// take an object of field values back (interview-fields.ts). A root whose value is a list that grows
// and shrinks - a dynamic panel, a dynamic matrix - is listed and not filled, and so is a root whose
// value no text consumer can produce (a file, a signature); the two are told apart by the "reason"
// key: "batch" means this version cannot fill it and a later one may, no reason at all means nothing
// ever will.

export interface IInterviewBatchEntry {
  address: string;
  item: IInterviewItem;
  // The input a value is written to and whose errors the item reports. Set for a plain root only.
  input?: IInterviewInput;
  // A fixed-shape container: the value is an object of field values, and the fields are read from
  // the live structure on every call rather than carried here.
  container?: Question;
  // A dynamic container: the value is a list of entry records, and the entries are read from the live
  // structure on every call as well.
  records?: Question;
}

export function getBatchEntries(survey: SurveyModel, inputs: Array<IInterviewInput>): Array<IInterviewBatchEntry> {
  const res: Array<IInterviewBatchEntry> = [];
  getRootQuestions(survey).forEach(root => {
    const own = inputs.filter(input => input.root === root);
    // One input, and it is the root itself: the root is a plain question, whatever the mode would
    // have done with a container in its place.
    const single = own.length === 1 && own[0].question === root && !own[0].isSummary ? own[0] : undefined;
    if (!!single && !isBatchContainer(root, single.item)) {
      res.push({ address: single.address, item: single.item, input: single });
      return;
    }
    const item = createBatchItem(root);
    if (!item) return;
    // A question with no plain input is unsupported already, and nothing about its structure changes
    // that: a file is a file whether or not it holds nested questions.
    if (item.unsupported !== true && isDynamicContainer(root)) {
      res.push(createRecordsEntry(root, item));
      return;
    }
    if (item.unsupported !== true && isFixedShapeContainer(root)) {
      res.push(createContainerEntry(root, item));
      return;
    }
    item.unsupported = true;
    item.reason = "batch";
    res.push({ address: item.name, item: item });
  });
  return res;
}

// valueType "object" as well as the structural test: a host that turned nesting off through
// onCheckSingleInputPerPageMode folds a container back into one input holding the whole object, and
// that input is still not one plain value. Batch mode then fills it as an object all the same - the
// two host events tune single mode only.
function isBatchContainer(root: Question, item: IInterviewItem): boolean {
  return isContainerQuestion(root) || item.valueType === "object";
}

function createContainerEntry(container: Question, item: IInterviewItem): IInterviewBatchEntry {
  const address = item.name;
  const rows = getContainerRows(container, address);
  // The key the describer would have written for a multiple text or a composite is gone
  // (createBatchItem drops it) and one of these takes its place, in the same position. It is written
  // even when it is empty, unlike the optional keys of a document: "fields: []" says that this
  // container has nothing an agent can fill - an enableIf turned every editor read-only with it -
  // and that is information, the way "items: []" and "current: null" are.
  if (!!rows) {
    item.rows = getRowRecords(rows);
  } else {
    item.fields = getFieldItems(getContainerFields(container, address));
  }
  return { address: address, item: item, container: container };
}

// A dynamic container in the document: what it holds now, what a new entry takes, and whether another
// one may be added, in that order. "entries" is left out while the container holds none - "canAdd" is
// then the whole story - while "template" says what to send either way.
function createRecordsEntry(container: Question, item: IInterviewItem): IInterviewBatchEntry {
  const address = item.name;
  const entries = getRecordEntries(container, address);
  if (entries.length > 0) {
    item.entries = getEntryRecords(entries);
  }
  const template = getTemplateItems(container);
  if (template.length > 0) {
    item.template = template;
  }
  item.canAdd = canAddEntry(container);
  return { address: address, item: item, records: container };
}

// The document of batch mode: everything that still needs work, plus everything the agent has to be
// told about even though it cannot act on it. An item that is answered and valid is left out - the
// agent is not asked to confirm what it already sent - while a disabled or unsupported one is always
// listed, because "this question exists and you cannot fill it" is the only way to say so.
export function getBatchItems(entries: Array<IInterviewBatchEntry>): Array<IInterviewItem> {
  const res: Array<IInterviewItem> = [];
  entries.forEach(entry => {
    if (!isListedInBatch(entry)) return;
    const errors = getEntryErrors(entry);
    // The first error text goes on the record, next to the value the agent has to correct; the full
    // list is the errors section of the document.
    if (errors.length > 0) entry.item.error = errors[0];
    res.push(entry.item);
  });
  return res;
}

function getEntryErrors(entry: IInterviewBatchEntry): Array<string> {
  if (!!entry.input) return getInputErrors(entry.input);
  // A container's own errors: RequiredInAllRowsError, EachRowUniqueError, MinRowCountError, a
  // duplicated key, a required container left empty. Its fields carry theirs on their own records.
  const container = entry.container || entry.records;
  return !!container ? container.errors.map(error => error.getText()) : [];
}

function isListedInBatch(entry: IInterviewBatchEntry): boolean {
  if (entry.item.unsupported === true || entry.item.disabled === true) return true;
  if (!!entry.records) {
    const records = entry.records;
    return !isRecordsAnswered(records) ||
      !isRecordsValid(records, getRecordEntries(records, entry.address));
  }
  if (!!entry.container) {
    const container = entry.container;
    return !isContainerAnswered(container) ||
      !isContainerValid(container, getContainerInputs(container, entry.address));
  }
  if (!entry.input) return true;
  // Skipping is a single-mode gesture: an agent that wants to leave a question blank leaves it
  // blank, so the skipped set is not consulted here and a skipped item is still listed.
  return entry.input.question.isEmpty() || !isInputValid(entry.input);
}

// The loop condition of batch mode: the first item an agent may still write to. Until this tier it
// was the single-mode current, and with containers in play the two part ways - an empty optional
// item of a multiple text keeps single mode's current on it while the container is answered, valid
// and not listed, and the loop would spin on an empty items list.
export function getBatchCurrent(items: Array<IInterviewItem>): IInterviewItem | null {
  const writable = (items || []).filter(item => item.disabled !== true && item.unsupported !== true);
  return writable.length > 0 ? writable[0] : null;
}

export function findBatchEntry(entries: Array<IInterviewBatchEntry>, address: string): IInterviewBatchEntry {
  return entries.filter(entry => entry.address === address)[0];
}

export function getBatchAddresses(entries: Array<IInterviewBatchEntry>): Array<string> {
  return entries.filter(entry => isBatchWritable(entry)).map(entry => entry.address);
}

export function isBatchWritable(entry: IInterviewBatchEntry): boolean {
  if (!entry.input && !entry.container && !entry.records) return false;
  return entry.item.disabled !== true && entry.item.unsupported !== true;
}

// One write of a batch may hide or disable a question a later write of the same batch names, and it
// may move the choices a later value is checked against (choicesFromQuestion, choicesVisibleIf). So
// every entry is described again immediately before its own write, and the answer is checked against
// the state the earlier writes left behind, not the state the call started in.
export function refreshBatchEntry(entry: IInterviewBatchEntry): IInterviewBatchEntry {
  const question = entry.input ? entry.input.question : (entry.container || entry.records);
  if (!question || !question.isVisibleInSurvey || isOnStartPage(question)) return undefined;
  const item = createBatchItem(question);
  if (!item) return undefined;
  if (!!entry.records) {
    return { address: entry.address, item: item, records: question };
  }
  if (!!entry.container) {
    return { address: entry.address, item: item, container: question };
  }
  return {
    address: entry.address,
    item: item,
    input: {
      address: entry.address, question: question, root: entry.input.root, isSummary: false, item: item,
    },
  };
}
